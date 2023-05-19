import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'The Expense Manager using NestJS with MongoDB';
  }
}
