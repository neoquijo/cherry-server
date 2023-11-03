import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema()
export class Users {
  @Prop({ required: true })
  id: string;
  @Prop({ required: true })
  login: string;
  @Prop()
  password: string;
  @Prop({ required: true })
  email: string;
  @Prop()
  phone: string;
  @Prop()
  avatar: string;
  @Prop()
  firstname: string;
  @Prop()
  lastname: string;
  @Prop()
  displayName: string;
  @Prop({ required: true })
  authProvider: string;
  @Prop()
  emailVerified: boolean;
}

export interface IUser {
  _id: Types.ObjectId;
  id: string;
  login: string;
  password?: string;
  email: string;
  phone?: string;
  avatar?: string;
  firstname?: string;
  lastname?: string;
  displayName?: string;
  authProvider: string;
  emailVerified?: boolean;
}

export const userSchema = SchemaFactory.createForClass(Users);
