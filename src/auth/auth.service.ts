import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { sign, verify } from 'jsonwebtoken';
import { Connection, Model } from 'mongoose';
import { v4 as uuidV4 } from 'uuid';
import authConfig from '../config/factories/auth.config';
import { AuthDocument } from '../infra/database/models/auth.model';
import { RefreshTokenDocument } from '../infra/database/models/refresh-token.model';
import { UserDocument } from '../infra/database/models/user.model';
import { AuthTokens } from '../types/auth-tokens';
import { UserProfile } from '../types/user';
import { UserNotFoundException } from '../users/exceptions/user-not-found.exception';
import { InvalidPasswordException } from './exceptions/invalid-password.exception';
import { InvalidRefreshTokenException } from './exceptions/invalid-refresh-token.exception';
import { AccessTokenExpiredException } from './exceptions/access-token-expired.exception';
import { InvalidAccessTokenException } from './exceptions/invalid-access-token.exception';

@Injectable()
export class AuthService {
  constructor(
    @InjectConnection() private connection: Connection,
    @InjectModel(AuthDocument.name) private authModel: Model<AuthDocument>,
    @InjectModel(RefreshTokenDocument.name)
    private refreshTokenModel: Model<RefreshTokenDocument>,
    @Inject(authConfig.KEY) private config: ConfigType<typeof authConfig>,
  ) {}

  async validateUser(email: string, password: string): Promise<UserProfile> {
    const { UserModel } = this.connection.models;
    const exUser: UserDocument = await UserModel.findOne({ email });
    if (!exUser) {
      throw new UserNotFoundException();
    }
    const exAuth: AuthDocument = await this.authModel.findById(exUser.auth);
    if (!exAuth.validatePassword(password)) {
      throw new InvalidPasswordException();
    }

    return {
      _id: exUser._id,
      role: exUser.role,
    };
  }

  async login(profile: UserProfile): Promise<AuthTokens> {
    return {
      accessToken: this.signAccessToken(profile),
      refreshToken: await this.signRefreshToken(profile._id),
    };
  }

  private signAccessToken(payload: UserProfile): string {
    return sign(payload, this.config.jwtSecret, {
      expiresIn: '1d',
      audience: 'todo.com',
      issuer: 'todo.com',
    });
  }

  private async signRefreshToken(userId: string): Promise<string> {
    const token = uuidV4();
    await this.refreshTokenModel.create({
      user: userId,
      value: token,
    });
    return token;
  }

  async getUserIdByRefreshToken(refreshToken: string): Promise<string> {
    const document = await this.refreshTokenModel.findOne({
      value: refreshToken,
    });

    if (!document) {
      throw new InvalidRefreshTokenException();
    }

    return document.user;
  }

  async refreshToken(
    refreshToken: string,
    payload: UserProfile,
  ): Promise<AuthTokens> {
    const document = await this.refreshTokenModel.findOne({
      value: refreshToken,
    });
    const aToken = this.signAccessToken(payload);
    const rToken = await this.signRefreshToken(payload._id);
    await document.deleteOne();
    return {
      accessToken: aToken,
      refreshToken: rToken,
    };
  }

  verifyToken(token: string): UserProfile {
    try {
      const { _id, role } = verify(token, this.config.jwtSecret) as UserProfile;

      return { _id, role };
    } catch (e) {
      if (e.name === 'TokenExpiredError') {
        throw new AccessTokenExpiredException();
      } else {
        throw new InvalidAccessTokenException();
      }
    }
  }
}
