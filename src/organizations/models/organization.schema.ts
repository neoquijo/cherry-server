import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema()
export class Organizations {
  @Prop()
  id: string;
  @Prop()
  organizationName: string;
  @Prop()
  nif: string;
  @Prop()
  activityType: string;
  @Prop()
  contactNumber: string;
  @Prop({ type: [{ type: Types.ObjectId, ref: 'pos' }] })
  pointsOfSale: [Types.ObjectId];
  @Prop({ type: [{ type: Types.ObjectId }] })
  managers: [Types.ObjectId];
  @Prop({ type: Types.ObjectId, ref: 'BusinessOwner' })
  owner: Types.ObjectId;
}

export const OrganizationsSchema = SchemaFactory.createForClass(Organizations);
