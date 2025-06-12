import OnlineGivingComponent from "@/components/onlineGivingComponent";
import { OnlineGiving } from "@/sanity/interfaces/onlineGiving";
import { onlineGivingQuery } from "@/sanity/queries/onlingGiving";
import { sanityFetchWrapper } from "@/sanity/sanityCRUDHandlers";

export default async function OnlineGivings() {
  const givingsDetails =
      await sanityFetchWrapper<OnlineGiving[]>(onlineGivingQuery);
    
    

  return <OnlineGivingComponent givingDetails={givingsDetails} />;
}
