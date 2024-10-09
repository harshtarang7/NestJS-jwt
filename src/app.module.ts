import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import dbConfi from './config/db.confi';
import { LoginModule } from './auth/login/login.module';
import { JwtAppModule } from './auth/jwt/jwt.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRoot(dbConfi()),
    ConfigModule.forRoot(),
    JwtAppModule,
    LoginModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
