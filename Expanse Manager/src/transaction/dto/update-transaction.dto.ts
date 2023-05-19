import { IsNotEmpty, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateTransactionDto {
  @IsNotEmpty()
  @Min(1)
  @Type(() => Number)
  amount: number;
}
