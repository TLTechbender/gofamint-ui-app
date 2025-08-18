export type RegisterActionState = {
  success?: boolean;
  message?: string;
  isUserVerified?: boolean;
  email?: string;
  errors?: {
    firstName?: string[];
    lastName?: string[];
    email?: string[];
    phoneNumber?: string[];
    password?: string[];
   userName? : string[]
  } | null;
};
