import { Type } from 'class-transformer';
import { IsNotEmpty, Min } from 'class-validator';

export class CreateTransactionDto {
  @IsNotEmpty()
  accId: string;

  @IsNotEmpty()
  @Min(1)
  @Type(() => Number)
  amount: number;

  @IsNotEmpty()
  trnType: string;
}
