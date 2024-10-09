import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user/user.entity';
import { Repository } from 'typeorm';
import { LoginResponseDTO } from './dto/login.response.dto';
import { SignInRequestDTO } from './dto/signin.request.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class LoginService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(
    email: string,
    password: string,
    username: string,
  ): Promise<SignInRequestDTO> {
    try {
      const salt = await bcrypt.genSalt();
      const hashed_password = await bcrypt.hash(password, salt);
      const user = this.userRepository.create({
        username: username,
        email: email,
        password: hashed_password,
      });
      return await this.userRepository.save(user);
    } catch (error) {
      throw Error(`unexpected error occured ${error}`);
    }
  }
}
