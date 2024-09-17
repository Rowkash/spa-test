import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { hash, verify } from 'argon2';
import { UserEntity } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { SessionsService } from 'src/sessions/sessions.service';
import { v4 as uuidv4 } from 'uuid';
import { DeepPartial } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private sessionsService: SessionsService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // ---------- Register ---------- //

  async register(dto: AuthRegisterDto) {
    const candidate = await this.userService.findOneByEmail(dto.email);
    if (candidate) throw new BadRequestException('Email already exist');

    const hashPass = await hash(dto.password);
    const user = await this.userService.create({ ...dto, password: hashPass });
    const { accessToken, refreshToken } = this.generateTokens(user);
    await this.sessionsService.create({ user, refreshToken });
    return { accessToken, refreshToken };
  }

  // ---------- Login ---------- //

  async login(dto: AuthLoginDto) {
    const user = await this.validateUser(dto);
    if (!user) return;
    const { accessToken, refreshToken } = this.generateTokens(user);

    const sessions = await this.sessionsService.findAllByUser(String(user.id));

    if (sessions.length > 0) {
      // some todo if sessions found
    }
    await this.sessionsService.create({ user, refreshToken });

    return { accessToken, refreshToken };
  }

  // ---------- Logout ---------- //

  async logout(sessionId: string) {
    const session = await this.sessionsService.findOneByKey(sessionId);
    if (!session)
      throw new UnauthorizedException('Session not found or expired');
    await this.sessionsService.remove(sessionId);
  }

  // ---------- Refresh Tokens ---------- //

  async refreshTokens(sessionId: string) {
    const session = await this.sessionsService.findOneByKey(sessionId);
    if (!session)
      throw new UnauthorizedException('Refresh token expired or its invalid');
    const userData = JSON.parse(session);
    const { accessToken, refreshToken } = this.generateTokens(userData);
    await this.sessionsService.updateSession(sessionId, refreshToken, userData);
    return { accessToken, refreshToken };
  }

  // ---------- Generate Tokens ---------- //

  private generateTokens(user: DeepPartial<UserEntity>) {
    const data = { id: user.id, email: user.email, role: user.role.title };
    const secret = this.configService.get('JWT_SECRET');

    const accessToken = this.jwtService.sign(data, {
      secret,
      expiresIn: '1d',
    });

    const refreshToken = uuidv4();

    return { accessToken, refreshToken };
  }

  // ---------- Validate User ---------- //

  private async validateUser(dto: AuthLoginDto) {
    const user = await this.userService.findOneByEmail(dto.email);
    if (user) {
      const passEquals = await verify(user.password, dto.password);
      if (passEquals) return user;
    }

    throw new UnauthorizedException({ message: 'Wrong email or password' });
  }
}
