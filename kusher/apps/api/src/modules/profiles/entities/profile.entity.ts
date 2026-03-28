export interface Profile {
  id: string;
  userId: string;       // FK to Users table
  bio?: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  smokerSince?: Date;
  cigarettesPerDay?: number;
  timezone?: string;
  createdAt: Date;
  updatedAt: Date;
}