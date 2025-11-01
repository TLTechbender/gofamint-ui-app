import { SanityImage } from "./sanityImage";

export type StreamPlatform =
  | "youtube"
  | "facebook"
  | "instagram"
  | "vimeo"
  | "twitch"
  | "custom";

export type StreamCategory =
  | "service"
  | "prayer"
  | "study"
  | "youth"
  | "event"
  | "conference";

export interface LiveStream {
  _id: string;
  title: string;
  description?: string;
  platform: StreamPlatform;
  streamUrl: string;
  embedCode?: string;
  scheduledStart: string; // ISO datetime string
  scheduledEnd?: string; // ISO datetime string
  isLive: boolean;
  category?: StreamCategory;
  thumbnailUrl?: string; // Sanity image asset URL
  pastor?: string;
}
