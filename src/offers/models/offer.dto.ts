export abstract class OfferDTO {
  title: string;
  lang: string;
  description: string;
  startsAt: number;
  endsAt: number;
  category: string;
  availableIn: string[];
  homeDeliveryIn: string[];
  qty: number;
  unlimited: boolean;
  offerPrice: number;
  initialPrice: number;
  images: string[];
  mainImage: string;
  pageContent: any[];
  buyOptions: BuyOption[];
  retry: boolean;
}

class BuyOption {
  caption: string;
  offerPrice: number;
  initialPrice: number;
  description: string;
}
