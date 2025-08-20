export interface UpdateProfileActionState {
  success: boolean;
  message: string;
  status: number;
  data?: {
    firstName?: string;
    lastName?: string;
    bio?: string;
    phoneNumber?: string;
  } | null;
  errors?: {
    firstName?: string[];
    lastName?: string[];
    bio?: string[];
    phoneNumber?: string[];
  } | null;
}
