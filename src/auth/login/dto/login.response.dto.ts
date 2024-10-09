import { User } from 'src/entities/user/user.entity';

export class LoginResponseDTO {
  token: string;
  user: User;
}
