export type AnimalCategory = 'peliharaan' | 'ternak';

export interface Animal {
  id: string;
  name: string;
  soundName: string;
  category: AnimalCategory;
  categoryLabel: string;
  food: string;
  funFact: string;
  habitat: string;
  benefit: string;
  color: {
    bg: string;
    border: string;
    badgeBg: string;
    accent: string;
  };
  audioDescription: string;
  speechText: string;
  realPhotoUrl: string;
  similarAnimals: string[];
}

export type GameMode = 'tebak-suara' | 'kelompokkan' | 'panggung-suara' | 'stiker-juara';

export type Difficulty = 'mudah' | 'sedang' | 'sulit'; // mudah: 3 pilihan, sedang: 4 pilihan, sulit: 6 pilihan + tricky pairs & limited replays
export type VisualMode = 'real' | 'cartoon';
export type FilterCategory = 'semua' | 'peliharaan' | 'ternak';

export interface Sticker {
  id: string;
  title: string;
  description: string;
  iconName: string;
  requiredCorrect: number;
  unlocked: boolean;
  category: 'suara' | 'kelompok' | 'eksplorasi';
}
