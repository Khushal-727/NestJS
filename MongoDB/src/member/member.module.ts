import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberController } from './member.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Member, MemberSchema } from './schema/member.schema';
import { Account, AccountSchema } from 'src/account/schema/account.schema';
import { User, UserSchema } from 'src/user/schema/user.schema';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Member.name, schema: MemberSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Account.name, schema: AccountSchema }]),
  ],
  controllers: [MemberController],
  providers: [MemberService, JwtService],
})
export class MemberModule {}
