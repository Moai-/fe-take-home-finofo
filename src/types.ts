export type GroupBy = 'None' | 'Family' | 'Order' | 'Genus';

export type FormatView = 'List' | 'Table';

export type Fruit = {
  id: number;
  name: string;
  family: string;
  genus: string;
  order: string;
  nutritions: {
    calories: number;
    fat: number;
    sugar: number;
    carbohydrates: number;
    protein: number;
  };
}