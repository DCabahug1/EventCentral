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
  /** Stored as text; Supabase may deserialize as string or number */
  phone: string | number | null;
  location: string | null;
  created_at: string;
  updated_at: string;
}

export type Event = {
  id: number;
  organization_id: number | null;
  /** Denormalized from organizations.name; avoids a separate org fetch when set. */
  organization_name: string | null;
  /** Denormalized RSVP total maintained by DB trigger updates. */
  rsvp_count: number | null;
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
  CANCELLED: boolean;
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

export type ReviewWithProfile = Review & {
  username: string | null;
  avatar_url: string | null;
}

export type AnalyticsRange = "7d" | "30d" | "all";

export type EngagementStats = {
  totalConfirmedRsvps: number;
  rsvpsByDay: { date: string; count: number }[];
  topEventsByRsvp: { id: number; title: string; rsvp_count: number }[];
};

export type ReviewStats = {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: { rating: number; count: number }[];
  recentReviews: {
    id: number;
    event_id: number;
    event_title: string;
    rating: number;
    content: string | null;
    created_at: string;
    username: string | null;
    avatar_url: string | null;
  }[];
};

export type ReachStats = {
  orgProfileViews: number;
  totalEventViews: number;
  viewsPerEvent: { eventId: number; title: string; views: number }[];
};