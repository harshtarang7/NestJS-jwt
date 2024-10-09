import { Body, Controller, Post } from '@nestjs/common';
import { LoginService } from './login.service';
import { SignInRequestDTO } from './dto/signin.request.dto';
import { User } from 'src/entities/user/user.entity';
import { LoginRequestDTO } from './dto/login.request.dto';
import { LoginResponseDTO } from './dto/login.response.dto';

@Controller('auth')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post('/sign-in')
  async signUp(@Body() dto: SignInRequestDTO): Promise<User> {
    try {
      const user = await this.loginService.register(
        dto.email,
        dto.password,
        dto.username,
      );
      return user;
    } catch (error) {
      throw error;
    }
  }

  @Post('/login')
  async logn(@Body() dto: LoginRequestDTO): Promise<LoginResponseDTO> {
    try {
      const user = await this.loginService.login(dto);
      return user;
    } catch (error) {
      throw error;
    }
  }
}
