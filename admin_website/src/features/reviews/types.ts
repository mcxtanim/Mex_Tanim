export interface AdminProductReview {
  id: string;
  productId: string;
  orderId?: string;
  customerName: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
  isVerifiedBuyer: boolean;
}
