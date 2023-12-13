import { Types } from 'mongoose';

export interface IOffer {
  id: string;
  title: string;
  lang: string;
  description: string;
  startsAt: number;
  endsAt: number;
  category: string;
  availableIn: Types.ObjectId[];
  homeDeliveryIn: Types.ObjectId[];
  qty: number;
  unlimited: boolean;
  offerPrice: number;
  offerValue: number;
  initialPrice: number;
  images: string[];
  mainImage: string;
  pageContent: unknown[];
  currentActivations: number;
  organization: Types.ObjectId;
  active: boolean;
  price: number | string;
  minPrice: number;
  maxPrice: number;
  owner: Types.ObjectId;
  verified: boolean;
  buyOptions: BuyOption[];
}

export interface BuyOption {
  caption: string;
  offerPrice: number;
  initialPrice: number;
  description: string;
}
