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
  location: string;
  max_capacity: number;
  image_url: string;
}
