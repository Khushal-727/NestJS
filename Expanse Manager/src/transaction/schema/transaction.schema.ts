import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class Transaction {
  @Prop({ type: Types.ObjectId })
  accId: string;

  @Prop({ type: Number })
  amount: number;

  @Prop({ enum: ['I', 'E'] })
  trnType: string;
}



export const TransactionSchema = SchemaFactory.createForClass(Transaction);
