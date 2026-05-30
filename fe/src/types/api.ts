export interface Category {
  id: number;
  name: string;
  description: string;
}

export interface Brand {
  id: number;
  name: string;
  description: string;
  createdAt?: string;
}

export interface SwitchType {
  id: number;
  name: string;
  description: string;
}

export interface KeyboardLayout {
  id: number;
  name: string;
  percentage: string;
  description: string;
}

export interface ProductImage {
  id: number;
  imageUrl: string;
  alt: string;
  displayOrder: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: number;
  categoryName: string;
  brandId: number;
  brandName: string;
  switchTypeId?: number | null;
  switchTypeName?: string | null;
  layoutId?: number | null;
  layoutName?: string | null;
  images: ProductImage[];
  createdAt?: string;
  updatedAt?: string | null;
}

export interface PagedResult<T> {
  data: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  imageUrl?: string | null;
  price: number;
  quantity: number;
  stock: number;
  subtotal: number;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
}

export interface AuthResponse {
  token?: string;
  refreshToken?: string;
  email: string;
  role: string;
  isEmailVerified: boolean;
  requiresEmailVerification: boolean;
  message?: string;
  expiresAt?: string;
}

export interface User {
  id: number;
  email: string;
  role: string;
  createdAt: string;
}

export interface CreateOrderItem {
  productId: number;
  quantity: number;
}

export interface CreateOrderPayload {
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  note?: string;
  items: CreateOrderItem[];
}

export interface OrderDetail {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Order {
  id: number;
  userId: number;
  userEmail: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  paymentMethod: string;
  paymentStatus: string;
  transactionId?: string | null;
  paidAt?: string | null;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  note?: string | null;
  orderDetails: OrderDetail[];
}

export interface PaymentStatus {
  orderId: number;
  paymentStatus: string;
  transactionId?: string | null;
  paidAt?: string | null;
}

export interface VNPayPayment {
  orderId: number;
  paymentUrl: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}
