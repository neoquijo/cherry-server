import { Prop, Schema } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema()
export class POS {
  @Prop()
  id: string;
  @Prop()
  caption: string;
  @Prop()
  description: string;
  @Prop()
  html: string;
  @Prop({ type: [{ type: Types.ObjectId, ref: 'goods' }] })
  goods: [Types.ObjectId];
  @Prop({ type: [{ type: Types.ObjectId, ref: 'offers' }] })
  offers: [Types.ObjectId];
  @Prop({ type: [{ type: Types.ObjectId, ref: 'reviews' }] })
  reviews: [Types.ObjectId];
  @Prop()
  uploads: [string];
  @Prop()
  mainImage: string;
}
