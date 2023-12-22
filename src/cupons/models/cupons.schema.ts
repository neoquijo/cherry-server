import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { v4 } from 'uuid';

@Schema()
export class Cupons {
  @Prop({ default: () => v4() })
  id: string;
  @Prop()
  caption: string;
  @Prop()
  value: number;
  @Prop()
  expireDate: number;
  @Prop({ type: Types.ObjectId, ref: 'offers' })
  itemId: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'businessowners' })
  businessOwner: Types.ObjectId;
  @Prop()
  status: string;
  @Prop()
  option: undefined | string;
  @Prop({ default: new Date().getTime() })
  createdAt: number;
  @Prop({ type: Types.ObjectId })
  activatedBy: Types.ObjectId;
  @Prop()
  activatedAt: number;
  @Prop({ default: () => v4().slice(-12) })
  code: string;
}

export const cuponSchema = SchemaFactory.createForClass(Cupons);
