import { Category, Type } from 'src/assistant/interface';

export interface IShortcut {
  id: number;
  title: string;
  type: Type;
  category: Category;
  promptInjection: string;
  icon: string;
  model: string;
  temperature: number;
}
