import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLE_KEY } from 'src/decorators/role-auth.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.get<string>(
      ROLE_KEY,
      context.getHandler(),
    );

    if (!requiredRole) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    if (user.role !== requiredRole) throw new ForbiddenException();
    return true;
  }
}
