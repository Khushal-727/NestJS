import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { hash } from 'bcrypt';

@Schema({ timestamps: true, versionKey: false })
export class User {
  @Prop()
  username: string;

  @Prop({
    unique: true,
    required: true,
  })
  email: string;

  @Prop()
  password: string;

  @Prop()
  token: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
  const hashPwd = await hash(this.password, 10);
  this.password = hashPwd;
  next();
});
