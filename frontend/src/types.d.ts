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
}
interface Product {
  id: number;
  title: string;
  artist: string;
  price: number;
  image: string;
}

interface Catogery {
  id: number;
  title: string;
  artist: string;
  price: number;
  image: string;
}
