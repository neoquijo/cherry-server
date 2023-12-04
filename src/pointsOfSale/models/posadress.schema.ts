import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 } from 'uuid';

@Schema()
export class PosAdress {
  @Prop({ type: String, default: () => v4() })
  id: string;
  @Prop()
  city: string;
  @Prop()
  country: string;
  @Prop({ type: { lat: Number, lng: Number } })
  geo: {
    lat: number;
    lng: number;
  };
  @Prop()
  adressLine: string;
  @Prop()
  postCode: string;
}

export const PosAdressSchema = SchemaFactory.createForClass(PosAdress);
