import { Category } from '../../category/models/category.interface';

export interface Item {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: Category;
}
