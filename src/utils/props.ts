export interface UserProps {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: Date | null;
  image: string | null;
  hashedPassword: string | null;
  createdAt: Date;
  updatedAt: Date;
  role: string;
}

export interface ReviewProps {
  id: string;
  userId: string;
  userName: string;
  productId: string;
  rating: number;
  comment: string;
  createdDate: Date;
}

export interface ImageProps {
  color: string;
  colorCode: string;
  image: string;
}

export interface ProductProps {
  id: string;
  name: string;
  description: string;
  price: number;
  brand: string;
  category: string;
  inStock: number;
  createdDate: Date;
  images: ImageProps[];
  reviews?: ReviewProps[];
}

export interface CartItemProps {
  id: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
  color: string;
  imageUrl: string;
  inStock: number;
}

export interface CurrentUserProps {
  createdAt: string;
  updatedAt: string;
  emailVerified: string | null;
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  hashedPassword: string | null;
  role: string;
  orders: OrderProps[] | null;
  UserOTPVerification: UserOTPVerificationProps | null;
}

interface AddressProps {
  city: String;
  country: String;
  line1: String;
  line2: String | null;
  postal_code: String;
  state: String;
}

export interface OrderProps {
  id: String;
  userId: String;
  amount: Number;
  currency: String;
  status: String;
  deliveryStatus: String | null;
  createdDate: Date;
  paymentIntentId: String;
  products: CartItemProps[];
  address: AddressProps | null;
}

interface UserOTPVerificationProps {
  id: String;
  userId: String;
  otp: String;
  createdAt: Date;
  expiresAt: Date;
}
