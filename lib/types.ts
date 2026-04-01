export type Profile = {
  id: number;
  user_id: string;
  username: string | null;
  email: string | null;
  avatar_url: string | null;
  phone_number: number | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export type Organization = {
  id: number;
  user_id: string | null;
  name: string;
  description: string | null;
  avatar_url: string | null;
  banner_url: string | null;
  website: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  created_at: string;
  updated_at: string;
}

export type Event = {
  id: number;
  organization_id: number | null;
  user_id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  address: string | null;
  location_details?: string | null;
  lat: number | null;
  lng: number | null;
  max_capacity: number | null;
  image_url: string | null;
  category: string | null;
  status: 'UPCOMING' | 'STARTED' | 'ENDED' | 'CANCELLED';
  created_at: string;
  updated_at: string;
}

export type RSVP = {
  id: number;
  event_id: number;
  user_id: string;
  status: 'CONFIRMED' | 'CANCELLED';
  created_at: string;
}

export type Review = {
  id: number;
  event_id: number;
  user_id: string;
  rating: number;
  content: string | null;
  created_at: string;
  edited_at: string | null;
}