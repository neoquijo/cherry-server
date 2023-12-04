import { Prop, Schema } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { v4 } from 'uuid';

@Schema()
export class Message {
  @Prop({ type: String, default: () => v4() })
  id: string;
  @Prop({
    type: [
      { type: Types.ObjectId, ref: 'pos' },
      { type: Types.ObjectId, ref: 'businessowners' },
      { type: Types.ObjectId, ref: 'managers' },
    ],
  })
  from: Types.ObjectId;
  @Prop({
    type: [
      { type: Types.ObjectId, ref: 'pos' },
      { type: Types.ObjectId, ref: 'businessowners' },
      { type: Types.ObjectId, ref: 'managers' },
    ],
  })
  to: Types.ObjectId;
  @Prop()
  messageType: 'text' | 'voice' | 'image' | 'document' | 'media';
  @Prop()
  messageBody: string;
}
