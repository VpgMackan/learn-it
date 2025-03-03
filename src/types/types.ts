export interface Card {
  number: number;
  front: string;
  back: string;
  id: string;
}

export interface Sets {
  name: string;
  cards: Card[];
  color: string;
  id: string;
}
