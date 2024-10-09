import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user/user.entity';
import { Repository } from 'typeorm';
import { LoginResponseDTO } from './dto/login.response.dto';
import * as bcrypt from 'bcryptjs';
import { ValitdateLoginResponseDTO } from './dto/validate.login.dto';
import { LoginRequestDTO } from './dto/login.request.dto';
import { JwtTokenService } from '../jwt/jwt.service';

@Injectable()
export class LoginService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtTokenService: JwtTokenService,
  ) {}

  async register(
    email: string,
    password: string,
    username: string,
  ): Promise<User> {
    try {
      const validate_user = await this.userRepository.findOne({
        where: { email: email },
      });
      if (validate_user) {
        throw new BadRequestException('Email already exists');
      }

      const salt = await bcrypt.genSalt();
      const hashed_password = await bcrypt.hash(password, salt);

      const user = this.userRepository.create({
        username: username,
        email: email,
        password: hashed_password,
      });

      return await this.userRepository.save(user);
    } catch (error) {
      console.error(`Unexpected error occurred: ${error.message}`);
      throw new Error(`Unexpected error occurred: ${error.message}`);
    }
  }

  async validateUser(
    username: string,
    password: string,
  ): Promise<ValitdateLoginResponseDTO> {
    const user = await this.userRepository.findOne({
      where: { username, account_status: 'active' },
    });
    if (!user) {
      throw new UnauthorizedException('not authorized');
    }
    try {
      const is_match = await bcrypt.compare(password, user.password);
      if (!is_match) {
        return null;
      }
    } catch (error) {
      throw Error(`unexpected error occured ${error}`);
    }
    return user;
  }

  async login(dto: LoginRequestDTO): Promise<LoginResponseDTO> {
    try {
      const user = await this.loginAdmin(dto);

      if (!user) {
        throw new Error('User not found');
      }
      const token = await this.jwtTokenService.generateToken({
        user_id: user.id,
        user_name: user.username,
        user_mail: user.email,
      });
      return { token, user };
    } catch (error) {
      throw error;
    }
  }

  private async loginAdmin(dto: LoginRequestDTO): Promise<User> {
    try {
      const query = this.userRepository.createQueryBuilder('users');
      query.andWhere('users.email LIKE :email', { email: `%${dto.email}%` });
      query.select([
        'users.id',
        'users.username',
        'users.email',
        'users.account_status',
      ]);
      const user = await query.getOne();
      return user;
    } catch (error) {
      throw error;
    }
  }
}
