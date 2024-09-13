import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleEntity } from './entities/role.entity';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RoleEntity)
    private rolesRepository: Repository<RoleEntity>,
  ) {}

  // ---------- Create role ---------- //

  async create(dto: CreateRoleDto) {
    const role = await this.findOneByTitle(dto.title);
    if (!role) this.rolesRepository.save(dto);
  }

  // ---------- Find all roles ---------- //

  findAll() {
    return this.rolesRepository.find();
  }

  // ---------- Find one role by Id ---------- //

  async findOne(id: RoleEntity['id']) {
    const role = await this.rolesRepository.findOne({ where: { id } });
    if (!role) throw new NotFoundException(`Role with id ${id} not found`);
    return role;
  }

  // ---------- Find one role by title ---------- //

  async findOneByTitle(title: RoleEntity['title']) {
    const role = await this.rolesRepository.findOne({ where: { title } });
    if (!role) throw new NotFoundException(`Role ${title} not found`);
    return role;
  }

  // ---------- Update Role ---------- //

  async update(id: RoleEntity['id'], dto: UpdateRoleDto) {
    const role = await this.findOne(id);
    if (!role) return;
    const existRole = await this.findOneByTitle(dto.title);
    if (existRole)
      throw new BadRequestException(
        `Role with title ${dto.title} already exist`,
      );
    await this.rolesRepository.update(id, dto);
  }

  // ---------- Remove Role ---------- //

  async remove(id: RoleEntity['id']) {
    const role = await this.findOne(id);
    if (role) this.rolesRepository.delete(id);
  }
}
