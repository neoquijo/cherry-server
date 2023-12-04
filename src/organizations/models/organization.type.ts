import { Types } from 'mongoose';

export interface Organizations {
  id: string;
  organizationName: string;
  nif: string;
  activityType: string;
  contactNumber: string;
  pointsOfSale: Types.ObjectId[];
  managers: Types.ObjectId[];
  owner: Types.ObjectId;
}
