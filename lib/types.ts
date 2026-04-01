export type Profile = {
  id: number;
  user_id: string;
  username: string | null;
  email: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export type Event = {
  id: number;
  organization_id: number;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  address: string;
  location_details?: string;
  lat: number;
  lng: number;
  max_capacity: number;
  image_url: string;
  category: string;
}
