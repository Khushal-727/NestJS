import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Transaction, TransactionSchema } from './schema/transaction.schema';
import { Account, AccountSchema } from 'src/account/schema/account.schema';
import { JwtService } from '@nestjs/jwt';
import { User, UserSchema } from 'src/user/schema/user.schema';
import { Member, MemberSchema } from 'src/member/schema/member.schema';
import { MemberService } from 'src/member/member.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Member.name, schema: MemberSchema }]),
    MongooseModule.forFeature([{ name: Account.name, schema: AccountSchema }]),
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
    ]),
  ],
  controllers: [TransactionController],
  providers: [TransactionService, MemberService, JwtService],
})
export class TransactionModule {}
