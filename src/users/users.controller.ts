import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
  SerializeOptions,
  Req,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { EnumRole, Roles } from 'src/decorators/role-auth.decorator';
import { IUserRequest } from 'src/interfaces/user-request.interface';
import { DeleteUserDto } from './dto/delete-user.dto';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ---------- Find All User ---------- //

  @Get()
  @ApiOperation({ summary: 'Find all users' })
  @ApiOkResponse({ type: [UserEntity] })
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.usersService.findAll();
  }

  // ---------- Find One User ---------- //

  @SerializeOptions({
    groups: ['admin'],
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(EnumRole.ADMIN)
  @Get(':id')
  @ApiOperation({ summary: 'Find one User' })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({ type: [UserEntity] })
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: UserEntity['id']) {
    return this.usersService.findOne(id);
  }

  // ---------- Update User ---------- //

  @UseGuards(AuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update User' })
  @ApiParam({ name: 'id' })
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: UserEntity['id'],
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  // ---------- Remove User (himself) ---------- //

  @UseGuards(AuthGuard)
  @Post('delete')
  @ApiOperation({
    summary: 'Remove User',
    description: 'For confirm deleting type password to dto',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Body() dto: DeleteUserDto, @Req() req: IUserRequest) {
    const userId = req.user.id;
    return this.usersService.remove(userId, dto);
  }
}
