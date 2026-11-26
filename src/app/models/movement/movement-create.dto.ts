import { MovementDetailCreateDTO } from './movement-detail-create.dto';

export interface MovementCreateDTO {
  orderNumber: string;
  orderDate: string;
  paymentDate: string;
  type: string;
  note: string;
  total: number;
  buyerId?: number | null;
  responsibleId: number;
  paymentFormId: number;
  shippingMethodId?: number | null;
  status: number;
  details: MovementDetailCreateDTO[];
}