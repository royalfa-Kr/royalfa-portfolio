// types/index.ts

export type ContentStatus = 'Published' | 'Prototype' | 'In Development' | 'Private Demo' | 'Playtesting';

export interface Investigator {
  id: string;
  name: string;
  subtitle: string;
  classType: 'Guardian' | 'Seeker' | 'Rogue' | 'Mystic' | 'Survivor' | 'Neutral';
  status: ContentStatus;
  description: string;
  redditLink?: string;
  imagePath?: string; 
}

export interface AppProject {
  id: string;
  title: string;
  description: string;
  status: ContentStatus;
  tags: string[]; // ej. ["React", "Educación", "Python"]
  url?: string;
}