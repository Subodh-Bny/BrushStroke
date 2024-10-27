type QueryResponse<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
};

interface ApiResponse {
  success: boolean;
  message: string;
}

interface SignupUser {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}
interface LoginUser {
  email: string;
  password: string;
}

interface User {
  email: string;
  profilePic: string;
  username: string;
  _id?: string;
  role?: string;
  shippingAddress?: string;
  phoneNumber?: string;
}
interface Artwork {
  _id?: string;
  title: string;
  artist: User | string;
  price: number;
  category: string;
  image: string | undefined;
  description?: string;
  availability: boolean;
}

interface Category {
  _id?: string;
  name: string;
  slug?: string;
}

interface CartItem {
  artwork: Artwork;
  quantity: number;
}
interface Cart {
  _id?: string;
  userId: string;
  items: CartItem[];
}

interface PaymentDetails {
  pidx: string;
  total_amount: number;
  status: string;
  transaction_id: string;
  fee: number;
  refunded: boolean;
}
interface Order {
  _id?: string;
  cartId?: string;
  artworks: string[];
  user?: User;
  status?: string;
  totalPrice: number;
  shippingAddress: string;
  phoneNumber: string;
  paymentDetails?: PaymentDetails;
  createdAt?: string;
}

interface OrderData {
  user: User;
  order: Order;
}
interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
}

interface KhaltiInitiate {
  returnUrl: string;
  websiteUrl: string;
  amount: number;
  purchaseOrderId: string;
  purchaseOrderName: string;
  customerInfo: CustomerInfo;
}

interface EsewaPayment {
  amount: string;
  failure_url: string;
  product_delivery_charge: string;
  product_service_charge: string;
  product_code: string;
  //   signature: string;
  //   signed_field_names: string;
  success_url: string;
  tax_amount: string;
  total_amount: string;
  transaction_uuid: string;
}
