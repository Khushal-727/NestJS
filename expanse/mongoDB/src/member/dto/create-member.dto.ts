import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateMemberDto {
  @IsNotEmpty()
  accId: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
