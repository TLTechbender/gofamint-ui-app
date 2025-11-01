import { SanityImage } from "./sanityImage";

export type ApplicationStatus =
  | "pending"
  
  | "approved"
  | "rejected" ;

export interface SocialMedia {
  platform:
    | "twitter"
    | "linkedin"
    | "instagram"
    | "facebook"
    | "github"
    | "website";
  url: string;
  handle?: string;
}

export interface Application {
  isApproved: boolean;
  status: ApplicationStatus;
  approvedAt?: string;
  rejectionReason?: string;
}

export interface Author {
  _id: string;
  _type: "author";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  userId: string;
  email: string;
  userName: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  userBio?: string;
  requestedAt: string;
  application: Application;
  authorBio?: string;
  profilePic?: SanityImage; 
  socials?: SocialMedia[];
}
