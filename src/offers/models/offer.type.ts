import { Types } from 'mongoose';

export interface IOffer {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  images: string[];
  content: string;
  maxActivations: number;
  currentActivations: number;
  organization: Types.ObjectId;
  pointOfSale: Types.ObjectId;
  startsAt: number;
  endsAt: number;
  active: boolean;
  price: number | string;
  minPrice: number;
  maxPrice: number;
  verified: boolean;
  options: any[]; // Replace 'any' with the appropriate type for options
  lang: string;
}
