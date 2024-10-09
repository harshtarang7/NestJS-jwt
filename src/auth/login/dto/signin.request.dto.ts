import { IsNotEmpty } from 'class-validator';

export class SignInRequestDTO {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}
