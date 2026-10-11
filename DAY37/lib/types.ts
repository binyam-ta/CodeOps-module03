export interface Dish {
  id: number | string;
  slug?: string;
  name: string;
  price: number;
  description: string;
  category: string;
  spicy?: boolean;
  image?: string;
}

export interface CartItem extends Dish {
  quantity: number;
  currency?: string;
}

export interface User {
  name: string;
  email: string;
  loggedInAt?: string;
}

export interface OrderDetails {
  customerName: string;
  phone: string;
  deliveryArea: string;
  totalAmount: number;
  orderTime: string;
}
