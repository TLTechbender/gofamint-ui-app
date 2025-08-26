
import { ContactInfo } from "@/sanity/interfaces/contact";
import { getFellowshipContactInfo } from "@/sanity/queries/contact";
import { sanityFetchWrapper } from "@/sanity/sanityCRUDHandlers";
import { Metadata } from "next";
import { urlFor } from "@/sanity/sanityClient";
import UnderConstructionPage from "@/components/underConstructionPage";
import ContactInformationComponent from "@/components/contact/contactInformationComponent";

// Generate dynamic metadata based on contact information
export async function generateMetadata(): Promise<Metadata> {
  const contactInfo: ContactInfo = await sanityFetchWrapper(
    getFellowshipContactInfo
  );

  const fellowshipName = contactInfo.fellowshipName || "Our Fellowship";
  const title = `Contact ${fellowshipName} - Connect with Our Community`;
  const description = `Get in touch with ${fellowshipName}! ${contactInfo.address ? `Visit us at ${contactInfo.address.street}, ${contactInfo.address.city}, ${contactInfo.address.state}.` : ""} ${contactInfo.contactPhone ? `Call us at ${contactInfo.contactPhone}.` : ""} ${contactInfo.contactEmail ? `Email us at ${contactInfo.contactEmail}.` : ""} Join our welcoming fellowship community.`;

  const socialMediaLinks: string[] = [];
  if (contactInfo.socialMedia) {
    Object.entries(contactInfo.socialMedia).forEach(([url]) => {
      if (url) socialMediaLinks.push(url);
    });
  }

  const dynamicKeywords = [
    "contact us",
    `${fellowshipName.toLowerCase()} contact`,
    "fellowship contact",
    "church contact",
    "community contact",
    "visit us",
    "get in touch",
    "connect",
    "address",
    "phone",
    "email",
  ];

  if (contactInfo.address?.city) {
    dynamicKeywords.push(
      `${contactInfo.address.city.toLowerCase()} fellowship`,
      `${contactInfo.address.city.toLowerCase()} church`,
      `fellowship in ${contactInfo.address.city.toLowerCase()}`
    );
  }

  if (contactInfo.address?.state) {
    dynamicKeywords.push(
      `${contactInfo.address.state.toLowerCase()} fellowship`,
      `fellowship ${contactInfo.address.state.toLowerCase()}`
    );
  }

  if (contactInfo.serviceHours && contactInfo.serviceHours.length > 0) {
    const serviceTypes = contactInfo.serviceHours
      .map((service) => service.serviceType?.toLowerCase())
      .filter(Boolean);
    dynamicKeywords.push(
      ...serviceTypes,
      "service times",
      "worship times",
      "fellowship schedule"
    );
  }

  // Generate images for social media
  const images = [];

  // Use first service poster if available
  if (contactInfo.serviceHours && contactInfo.serviceHours.length > 0) {
    const firstServiceWithPoster = contactInfo.serviceHours.find(
      (service) => service.posterImage
    );
    if (firstServiceWithPoster?.posterImage) {
      images.push({
        url: urlFor(firstServiceWithPoster.posterImage)
          .width(1200)
          .height(630)
          .url(),
        width: 1200,
        height: 630,
        alt: `${fellowshipName} - ${firstServiceWithPoster.serviceType || "Service"} poster`,
        type: "image/jpeg",
      });
    }
  }

  // Fallback images
  images.push(
    {
      url: "",
      width: 1200,
      height: 630,
      alt: `${fellowshipName} contact information and community`,
      type: "image/jpeg",
    },
    {
      url: "",
      width: 800,
      height: 600,
      alt: `Welcome to ${fellowshipName} - Connect with our community`,
      type: "image/jpeg",
    }
  );

  return {
    title,
    description,
    keywords: dynamicKeywords,
    authors: [{ name: fellowshipName }],
    creator: "Bolarinwa Paul Ayomide (https://github.com/TLTechbender)",
    publisher: "Gofamint Students' Fellowship UI",

    // Open Graph metadata
    openGraph: {
      title,
      description,
      type: "website",
      locale: "en_US",
      siteName: fellowshipName,
      images,
      url: "/contact",
    },

    // Twitter Card metadata
    twitter: {
      card: "summary_large_image",
      title,
      description: description.substring(0, 200) + "...", // Twitter has character limits sha
      images: [images[0].url],
      creator: contactInfo.socialMedia?.twitter
        ? `@${contactInfo.socialMedia.twitter.split("/").pop()}`
        : undefined,
      site: contactInfo.socialMedia?.twitter
        ? `@${contactInfo.socialMedia.twitter.split("/").pop()}`
        : undefined,
    },

    // Additional metadata
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    // Alternate languages
    alternates: {
      canonical: "/contact",
      languages: {
        "en-US": "/contact",
      },
    },

    // Dynamic contact metadata
    other: {
      ...(contactInfo.contactPhone && {
        "contact:phone_number": contactInfo.contactPhone,
      }),
      ...(contactInfo.contactEmail && {
        "contact:email": contactInfo.contactEmail,
      }),
      ...(contactInfo.address?.state && {
        "geo.region": `${contactInfo.address.country || "US"}-${contactInfo.address.state}`,
      }),
      ...(contactInfo.address?.city && {
        "geo.placename": contactInfo.address.city,
      }),
    },

    // Category
    category: "Contact Information",

    // App-specific metadata
    applicationName: fellowshipName,

    // Manifest for PWA
    manifest: "/manifest.json",
  };
}

export default async function ContactInformation() {
  const contactInfo: ContactInfo = await sanityFetchWrapper(
    getFellowshipContactInfo,
    {},
    ["contactInfo"]
  );

  if (!contactInfo || Object.keys(contactInfo).length === 0) {
    return <UnderConstructionPage />;
  }

  return <ContactInformationComponent contactInfo={contactInfo} />;
}
