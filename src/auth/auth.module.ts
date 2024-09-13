import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { JwtService } from '@nestjs/jwt';
import { SessionsModule } from 'src/sessions/sessions.module';

@Module({
  imports: [UsersModule, SessionsModule],
  providers: [AuthService, JwtService],
	controllers: [AuthController],
	exports: [AuthService]
})
export class AuthModule {}
