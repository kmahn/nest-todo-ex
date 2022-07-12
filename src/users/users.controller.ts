import { Body, Controller, Get, Headers, Post, UseGuards } from '@nestjs/common';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../auth/auth.service';
import { LocalAuthGuard } from '../auth/guards/local-auth.guard';
import { User } from '../decorators/user.decorator';
import { AuthTokens } from '../types/auth-tokens';
import { UserProfile } from '../types/user';
import { JoinUserDto } from './dto/join-user.dto';
import { UsersService } from './users.service';

@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@User() user: UserProfile): Promise<AuthTokens> {
    return this.authService.login(user);
  }

  @Post('join')
  join(@Body() dto: JoinUserDto): Promise<boolean> {
    return this.usersService.join(dto);
  }

  @ApiHeader({ name: 'x-refresh-token' })
  @Get('refresh-token')
  refreshToken(@Headers('x-refresh-token') token: string) {
    return this.usersService.refreshToken(token);
  }
}
