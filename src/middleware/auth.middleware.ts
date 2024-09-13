import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';

interface IRequest extends Request {
  user: {
    id: number;
    role: string;
  };
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async use(request: IRequest, _: Response, next: NextFunction) {
    const { headers } = request;
    const { authorization } = headers;

    if (!authorization) {
      request.user = null;
      return next();
    }

    const [, token] = authorization.split(' ');

    try {
      const secret = this.configService.get('JWT_SECRET');
      const { id, role } = await this.jwtService.verifyAsync(token, { secret });

      request.user = {
        id,
        role,
      };
    } catch (error) {
      request.user = null;
    } finally {
      return next();
    }
  }
}
