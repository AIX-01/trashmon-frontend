export interface FarmMonster {
  id: number;
  name: string;
  imageUrl: string;
  rank: 'S' | 'A' | 'B' | 'C';
  category: string;
  capturedAt: Date;
  x: number;
  y: number;
  speed: number;
  direction: number;
  scale: number;
  action: 'idle' | 'walk' | 'jump' | 'sleep' | 'dragged' | 'happy';
  actionTimer: number;
}
