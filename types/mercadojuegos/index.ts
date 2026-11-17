export type ListingOperationType = "sale" | "trade" | "sale_or_trade";

export type ListingCondition =
  | "new"
  | "like_new"
  | "good"
  | "used_with_details"
  | "incomplete";

export type ListingAvailabilityStatus =
  | "available"
  | "negotiating"
  | "reserved"
  | "sold"
  | "traded"
  | "paused";

export interface SectionLink {
  href: string;
  label: string;
  description?: string;
}

export interface BgProfile {
  id: string;
  display_name: string;
  borough: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export interface UpdateBgProfileInput {
  display_name: string;
  borough?: string | null;
  bio?: string | null;
}