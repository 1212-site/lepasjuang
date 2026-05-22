export interface Wish {
  id: string;
  name: string;
  major: string;
  message: string;
  initial: string;
}

export interface FallingElement {
  id: number;
  x: number;
  size: number;
  delay: number;
  duration: number;
  rotate: number;
  drift: number;
  type: 'cap' | 'sparkle' | 'star' | 'diploma';
}
