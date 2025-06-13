interface Location {
  venue: string;
  address?: string;
  room?: string;
  directions?: string;
  mapLink?: string;
}

interface Minister {
  name: string;
  role: string;
  bio?: string;
  image?: any;
}

interface RegistrationFee {
  amount: number;
  currency: string;
  isFree: boolean;
}

interface AccommodationInfo {
  accommodationAvailable: boolean;
  accommodationDetails?: string;
  accommodationFee?: number;
}

interface MealsPlan {
  mealsIncluded: boolean;
  mealsDetails?: string;
  dietaryOptions?: string[];
}

interface SpecialEventDetails {
  registrationFee: RegistrationFee;
  capacity?: number;
  registrationDeadline: string;
  earlyBirdDeadline?: string;
  accommodationInfo?: AccommodationInfo;
  mealsPlan?: MealsPlan;
  certificateOffered?: boolean;
  materialsProvided?: string[];
}

interface DressCode {
  code: string;
  details?: string;
  colorTheme?: string;
}

interface Requirements {
  bringItems?: string[];
  ageRestriction?: string;
  prerequisites?: string;
}

interface Contact {
  contactPerson?: string;
  phone?: string;
  email?: string;
  whatsapp?: string;
}

interface FellowshipEvent {
  id: string;
  title: string;
  slug: { current: string };
  eventDate: string;
  endDateTime?: string;
  eventType: string;
  eventCategory: "normal" | "special";
  description?: string;
  location: Location;
  ministers?: Minister[];
  specialEventDetails?: SpecialEventDetails;
  dressCode?: DressCode;
  requirements?: Requirements;
  contact?: Contact;
  featuredImage?: any;
  gallery?: any[];
  isRecurring?: boolean;
  recurrencePattern?: string;
  priority?: "high" | "medium" | "low";
  isPublished: boolean;
  isFeatured?: boolean;
}
