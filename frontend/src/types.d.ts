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
}
