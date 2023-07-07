import { Item } from '../../item/models/item.interface';

export interface Cart {
  _id: string;
  cartItems: CartItem[];
  user?: string;
  totalPrice: number;
}

export interface CartItem {
  _id?: string;
  item: Item;
  quantity: number;
  user?: string;
}

export interface CartItemDetailed {
  _id: string;
  item: Item;
  quantity: number;
}
