
export type SportCategory = 'Gym' | '羽毛球' | '排球' | '跑步' | '游泳' | '瑜伽' | '其他';

export interface ExerciseLog {
  id: string;
  category: SportCategory;
  subcategory: string;
  date: string; // ISO format
  durationMinutes: number;
  effort?: number; // 1-10
  performance?: number; // 1-5
  mood?: string; // Emoji
  notes?: string;
}

export interface CategoryOption {
  value: SportCategory;
  subcategories: string[];
  color: string;
  icon: string;
}

export type ViewMode = 'dashboard' | 'calendar' | 'add' | 'trends';
