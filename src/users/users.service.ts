import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RolesService } from 'src/roles/roles.service';
import { hash, verify } from 'argon2';
import { DeleteUserDto } from './dto/delete-user.dto';
// import { SessionsService } from 'src/sessions/sessions.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private rolesService: RolesService,
    // private sessionsService: SessionsService,
  ) {}

  // ---------- Create User ---------- //

  async create(dto: CreateUserDto) {
    const role = await this.rolesService.findOneByTitle('user');
    return this.usersRepository.save({ ...dto, role: role });
  }

  // ---------- Find All User ---------- //

  findAll() {
    return this.usersRepository.find();
  }

  // ---------- Find One User by Id ---------- //

  async findOne(id: UserEntity['id']) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    return user;
  }

  // ---------- Find one User by email ---------- //

  async findOneByEmail(email: UserEntity['email']) {
    const user = await this.usersRepository.findOne({ where: { email } });
    return user;
  }

  // ---------- Update User ---------- //

  async update(id: UserEntity['id'], dto: UpdateUserDto) {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException('User not found');

    if (dto.password) {
      const verifyPass = await verify(user.password, dto.password);
      if (verifyPass) {
        throw new BadRequestException(
          'The new password must not be equal to the old one',
        );
      } else {
        dto.password = await hash(dto.password);
      }
    }

    await this.usersRepository.update(id, dto);
  }

  // ---------- Remove User ---------- //

  async remove(id: UserEntity['id'], dto: DeleteUserDto) {
    const user = await this.findOne(id);
    if (!user) return;
    const verifyPass = await verify(user.password, dto.password);
    if (!verifyPass) throw new BadRequestException('Wrong password');
    // const session = await this.sessionsService.findAllByUser(String(user.id));
    // if (session) await this.sessionsService.remove(session.id);
    return this.usersRepository.delete(id);
  }
}
