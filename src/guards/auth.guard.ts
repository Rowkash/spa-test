import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { EnumRole, ROLE_KEY } from 'src/decorators/role-auth.decorator';

interface IRequest extends Request {
  user: {
    id: number;
    role: string;
  };
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: IRequest = context.switchToHttp().getRequest();
    const { user } = request;
    if (!user) throw new UnauthorizedException();

    const methodContextHandler = context.getHandler();
    const classContextHandler = context.getClass();
    const methodRoles =
      this.reflector.get<EnumRole[]>(ROLE_KEY, methodContextHandler) || [];
    const classRoles =
      this.reflector.get<EnumRole[]>(ROLE_KEY, classContextHandler) || [];

    const roles = [...methodRoles, ...classRoles];

    if (!roles.length) return true;

    const canActivate = roles.includes(user.role as EnumRole);
    if (!canActivate) throw new ForbiddenException();

    return true;
  }
}
