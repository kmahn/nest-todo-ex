import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthService } from '../auth/auth.service';
import { UserDocument } from '../infra/database/models/user.model';
import { AuthTokens } from '../types/auth-tokens';
import { CreateUserCommand } from './commands/create-user.command';
import { JoinUserDto } from './dto/join-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserDocument.name) private userModel: Model<UserDocument>,
    private authService: AuthService,
    private commandBus: CommandBus,
  ) {}

  async join(dto: JoinUserDto): Promise<boolean> {
    const { email, name, phone, password } = dto;

    await this.commandBus.execute(
      new CreateUserCommand(email, name, phone, password),
    );

    return true;
  }

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    const userId = await this.authService.getUserIdByRefreshToken(refreshToken);
    const user = await this.userModel.findById(userId);
    const payload = { _id: user._id, role: user.role };

    return this.authService.refreshToken(refreshToken, payload);
  }
}
