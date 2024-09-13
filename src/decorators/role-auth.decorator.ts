import { SetMetadata } from '@nestjs/common';

export enum EnumRole {
  USER = 'user',
  ADMIN = 'admin',
}

export const ROLE_KEY = 'role';

export const Roles = (...role: EnumRole[]) => SetMetadata(ROLE_KEY, role);
