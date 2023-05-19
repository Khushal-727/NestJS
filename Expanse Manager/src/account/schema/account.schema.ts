import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class Account {
  @Prop({ required: true })
  accName: string;

  @Prop({ default: 0 })
  balance: number;

  @Prop({ type: Types.ObjectId })
  owner: string;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
