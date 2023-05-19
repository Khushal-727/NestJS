import { IsNotEmpty } from 'class-validator';

export class CreateAccountDto {
  @IsNotEmpty()
  accName: string;

  @IsNotEmpty()
  balance: number;

  @IsNotEmpty()
  owner: string;
}
