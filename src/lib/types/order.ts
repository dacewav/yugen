export type OrderStatus =
  | 'pending_payment'
  | 'paid'
  | 'stems_needed'
  | 'stems_uploaded'
  | 'in_progress'
  | 'review'
  | 'revision'
  | 'completed'
  | 'cancelled'
  | 'refunded';

export type PaymentMethod = 'stripe' | 'mercadopago';

export interface Order {
  id: string;
  clientId?: string;
  clientName: string;
  clientEmail: string;
  productType: 'service' | 'beat' | 'drumkit' | 'drop';
  productId: string;
  productName: string;
  tier?: string;
  status: OrderStatus;
  payment: {
    method: PaymentMethod;
    status: 'pending' | 'paid' | 'failed' | 'refunded';
    paymentId?: string;
    amount: number;
    currency: string;
  };
  notes?: string;
  deadline?: Date;
  portalToken: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TimelineEvent {
  id: string;
  event: string;
  message: string;
  timestamp: Date;
  actor?: string;
}

export interface OrderMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'client' | 'crew';
  content: string;
  attachmentUrl?: string;
  timestamp: Date;
}
