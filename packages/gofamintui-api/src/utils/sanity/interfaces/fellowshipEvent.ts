import { SanityImage } from "./sanityImage";

export interface FellowshipEvent {
  _id: string;
  _type: "fellowshipEvent";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  eventTitle: string;
  eventSubtitle?: string;
  startsAt: string;
  endsAt: string;
  eventLocation: string;
  eventDescription?: string;
}

export interface FellowshipEventsSeo {
  seo: {
  title: string;
  description: string;
  keywords: string[];
  ogImage: SanityImage;
 }


}
