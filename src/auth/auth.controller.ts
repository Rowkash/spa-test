import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { Request, Response } from 'express';
import { clearCookie, setCookie } from 'src/utils/useCookie';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // ---------- Login ---------- //

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login' })
  async login(
    @Body() dto: AuthLoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.login(dto);

    setCookie(refreshToken, res);

    return { accessToken, refreshToken };
  }

  // ---------- Register ---------- //

  @Post('register')
  @ApiOperation({
    summary: 'Register',
    description:
      'Register user and return accessToken, refreshToken, inject refreshToken to cookie and create session',
  })
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() dto: AuthRegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.register(dto);

    setCookie(refreshToken, res);

    return { accessToken, refreshToken };
  }

  // ---------- Logout ---------- //

  @Post('logout')
  @ApiOperation({
    summary: 'Logout',
    description: 'Delete cookie and session from db',
  })
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const { refreshToken: sessionId } = req.cookies;
    if (!sessionId) throw new UnauthorizedException();
    await this.authService.logout(sessionId);
    res.clearCookie('refreshToken', {
      httpOnly: true,
      domain: 'localhost',
      secure: true,
      sameSite: 'lax',
    });
    clearCookie(res);
  }

  // ---------- Refresh Tokens ---------- //

  @Post('refresh-tokens')
  @ApiOperation({
    summary: 'Refresh tokens',
    description:
      'Refresh tokens by cookie refresh token. Return both of them and update session',
  })
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken: sessionId } = req.cookies;
    if (!sessionId) throw new UnauthorizedException();
    const { accessToken, refreshToken } =
      await this.authService.refreshTokens(sessionId);

    setCookie(refreshToken, res);

    return { accessToken, refreshToken };
  }
}
