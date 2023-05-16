import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';
import { Account } from 'src/account/schema/account.schema';
import { User } from 'src/user/schema/user.schema';

@Schema({ versionKey: false })
export class Member {
  @Prop({ type: Types.ObjectId, ref: Account.name })
  @Type(() => Account)
  accId: Account;

  @Prop({ type: Types.ObjectId, ref: User.name })
  @Type(() => User)
  memberId: User;
}

export const MemberSchema = SchemaFactory.createForClass(Member);
