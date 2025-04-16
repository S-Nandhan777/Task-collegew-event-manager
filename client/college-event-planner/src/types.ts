export interface User {
  token: string;
  name?: string;
  role?: 'user' | 'organizer'; 
}

export interface Event {
  event_id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  organizer_name: string;
  category_id: number;
}

export interface Reminder {
  reminder_id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  reminder_time?: string;
}

export interface Review {
  review_id: number;
  name: string;
  rating: number;
  review_text: string;
}

export interface Photo {
  photo_id: number;
  photo_url: string;
}

export interface Category {
  category_id: number;
  name: string;
}