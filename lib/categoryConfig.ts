import {
  Music,
  PartyPopper,
  Code,
  Trophy,
  Sandwich,
  Paintbrush,
  Leaf,
  LucideIcon,
  CircleOff,
} from "lucide-react";

export type CategoryConfig = {
  label: string;
  icon: LucideIcon;
  colorClass: string;
};

/** Default category for new events (create form). */
export const DEFAULT_EVENT_CATEGORY = "Other";

export const CATEGORY_CONFIG: CategoryConfig[] = [
  {
    label: DEFAULT_EVENT_CATEGORY,
    icon: CircleOff,
    colorClass: "text-muted-foreground",
  },
  { label: "Music",       icon: Music,        colorClass: "text-purple-500" },
  { label: "Parties",     icon: PartyPopper,  colorClass: "text-pink-500"   },
  { label: "Tech",        icon: Code,         colorClass: "text-blue-500"   },
  { label: "Sports",      icon: Trophy,       colorClass: "text-orange-500" },
  { label: "Food & Drink",icon: Sandwich,      colorClass: "text-red-500"    },
  { label: "Art",         icon: Paintbrush,   colorClass: "text-amber-500"  },
  { label: "Outdoor",     icon: Leaf,         colorClass: "text-green-500"  },
];

/** Search/filter category options should exclude the generic default bucket. */
export const SEARCH_CATEGORY_CONFIG: CategoryConfig[] = CATEGORY_CONFIG.filter(
  (c) => c.label !== DEFAULT_EVENT_CATEGORY,
);

export const getCategoryConfig = (label: string): CategoryConfig | undefined =>
  CATEGORY_CONFIG.find((c) => c.label === label);
