import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Account, AccountSchema } from 'src/account/schema/account.schema';
import { AccountService } from 'src/account/account.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { Member, MemberSchema } from 'src/member/schema/member.schema';
import { AuthService } from '../auth/auth.service';

@Module({
  imports: [
    JwtModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Member.name, schema: MemberSchema }]),
    MongooseModule.forFeature([{ name: Account.name, schema: AccountSchema }]),
    MailerModule.forRoot({
      transport: {
        host: 'sandbox.smtp.mailtrap.io',
        port: 2525,
        auth: {
          user: 'e4aa48651e7e0c',
          pass: 'f88416270a4682',
        },
      },
    }),
  ],
  controllers: [UserController],
  providers: [UserService, AuthService, JwtService, AccountService],
})
export class UserModule {}
