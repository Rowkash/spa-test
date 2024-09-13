import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleEntity } from './entities/role.entity';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  // ---------- Create role ---------- //

  @Post()
  @ApiOperation({ summary: 'Create role' })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateRoleDto) {
    return this.rolesService.create(dto);
  }

  // ---------- Find all roles ---------- //

  @Get()
  @ApiOperation({ summary: 'Find all roles' })
  @ApiOkResponse({ type: [RoleEntity] })
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.rolesService.findAll();
  }

  // ---------- Find one role by Id ---------- //

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id' })
  @ApiOperation({ summary: 'Find one role' })
  findOne(@Param('id') id: RoleEntity['id']) {
    return this.rolesService.findOne(id);
  }

  // ---------- Update Role ---------- //

  @Patch(':id')
  @ApiParam({ name: 'id' })
  @ApiOperation({ summary: 'Update role' })
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: RoleEntity['id'], @Body() dto: UpdateRoleDto) {
    return this.rolesService.update(id, dto);
  }

  // ---------- Remove Role ---------- //

  @Delete(':id')
  @ApiParam({ name: 'id' })
  @ApiOperation({ summary: 'Delete role' })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: RoleEntity['id']) {
    return this.rolesService.remove(id);
  }
}
