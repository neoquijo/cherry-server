import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Organizations } from 'src/organizations/models/organization.schema';

@Schema()
export class BusinessOwner {
  @Prop({ required: true, unique: true })
  id: string;
  @Prop({ type: [{ type: Types.ObjectId, ref: 'pos' }] })
  pointsOfSale: [Types.ObjectId];
  @Prop({ required: true })
  displayName: string;
  @Prop()
  firstname: string;
  @Prop()
  lastname: string;
  @Prop({ required: true, unique: true })
  email: string;
  @Prop({ required: true })
  password: string;
  @Prop({ required: true, unique: true })
  phoneNumber: string;
  @Prop()
  contactNumber: string;
  @Prop({ type: [{ type: Types.ObjectId, ref: Organizations.name }] })
  organizations: Types.ObjectId[];
  @Prop({ default: true })
  firstLogin: boolean;
}

export const BusinessOwnerSchema = SchemaFactory.createForClass(BusinessOwner);
