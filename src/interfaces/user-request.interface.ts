import { Request } from 'express';
import { RoleEntity } from 'src/roles/entities/role.entity';
import { UserEntity } from 'src/users/entities/user.entity';

export interface IUserRequest extends Request {
  user?: {
    id: UserEntity['id'];
    role: RoleEntity['title'];
  };
}
