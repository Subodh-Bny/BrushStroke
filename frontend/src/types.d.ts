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
  artist: User;
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
  usreId: string;
  items: CartItem[];
}

interface Order {
  _id?: string;
  artworks: string[];
  status?: string;
  totalPrice: number;
  shippingAddress: string;
  phoneNumber: string;
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
