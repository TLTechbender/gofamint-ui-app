import ContactInformationComponent from "@/components/contactInformationComponent";
import { ContactInfo } from "@/sanity/interfaces/contact";
import { getFellowshipContactInfo } from "@/sanity/queries/contact";
import { sanityFetchWrapper } from "@/sanity/sanityCRUDHandlers";

export default async function ContactInformation() {
  const info = await sanityFetchWrapper<ContactInfo>(getFellowshipContactInfo);

  return <ContactInformationComponent contactInfo={info} />;
}
