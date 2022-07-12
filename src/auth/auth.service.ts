import {
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { sign, verify } from 'jsonwebtoken';
import { Connection, Model } from 'mongoose';
import { v4 as uuidV4 } from 'uuid';
import authConfig from '../config/factories/auth.config';
import { ErrorCodes } from '../errors/error-definition';
import { AuthDocument } from '../infra/database/models/auth.model';
import { RefreshTokenDocument } from '../infra/database/models/refresh-token.model';
import { UserDocument } from '../infra/database/models/user.model';
import { AuthTokens } from '../types/auth-tokens';
import { UserProfile } from '../types/user';

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
      throw new NotFoundException('찾을 수 없는 사용자입니다.');
    }
    const exAuth: AuthDocument = await this.authModel.findById(exUser.auth);
    if (!exAuth.validatePassword(password)) {
      throw new UnauthorizedException('잘못된 비밀번호입니다.');
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
      throw new UnauthorizedException('유효한 리프레시토큰이 아닙니다.');
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
      const code =
        e.name === 'TokenExpiredError'
          ? ErrorCodes.ACCESS_TOKEN_EXPIRED
          : '유효하지 않은 액세스토큰입니다.';
      throw new UnauthorizedException({
        status: HttpStatus.UNAUTHORIZED,
        code,
      });
    }
  }
}
