import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user/user.entity';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { JwtTokenService } from '../jwt/jwt.service';
import { JwtAppModule } from '../jwt/jwt.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), JwtAppModule],
  providers: [LoginService, JwtTokenService],
  controllers: [LoginController],
  exports: [LoginService],
})
export class LoginModule {}
