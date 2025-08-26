export interface Strategy {
  title: string;
  howTo: string;
  research: string;
}

export interface Gradient {
  name: string;
  class: string;
  preview: string;
  color: string;
}

export type PreviewMode = 'card' | 'post' | 'story';

export type EditorMode = 'single' | 'weekly';

export type WeeklyPreviewMode = 'post' | 'story';

export interface WeeklyStrategy {
  id: number;
  title: string;
  summary: string;
  image: string | null;
  gradient: Gradient;
}

export interface ArticleContent {
  title: string;
  subtitle: string;
  image: string | null;
}
