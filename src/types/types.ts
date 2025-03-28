export interface Card {
  number: number;
  front: string;
  back: string;
  id: string;
}

export interface Set {
  name: string;
  cards: Card[];
  color: string;
  id: string;
}

export interface Sets extends Array<object> {
  name: string;
  cards: Card[];
  color: string;
  id: string;
}
