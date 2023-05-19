import { IsNotEmpty } from 'class-validator';

export class UpdateAccountDto {
  @IsNotEmpty()
  oldName: string;
  @IsNotEmpty()
  newName: string;
}
