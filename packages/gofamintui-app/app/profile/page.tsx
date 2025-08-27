import { fetchProfile } from "@/actions/profile/profile";
import ProfileComponent from "@/components/profile/profileComponent";

export default async function ProfilePage() {
  const user = await fetchProfile();

  return user.data ? <ProfileComponent user={user.data} /> : <div></div>;
}
