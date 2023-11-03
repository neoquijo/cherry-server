import { Prop, Schema } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema()
export class Organization {
  @Prop()
  id: string;
  @Prop()
  organizationName: string;
  @Prop()
  nif: string;
  @Prop({ type: [{ type: Types.ObjectId }] })
  pointsOfSale: [Types.ObjectId];
  @Prop({ type: Types.ObjectId })
  owner: Types.ObjectId;
  @Prop({ type: [{ type: Types.ObjectId }] })
  managers: [Types.ObjectId];
}
