import { Metadata } from "next";
import OnlineGivingComponent from "@/components/onlineGivingComponent";
import { OnlineGiving } from "@/sanity/interfaces/onlineGiving";
import { onlineGivingQuery } from "@/sanity/queries/onlingGiving";
import { sanityFetchWrapper } from "@/sanity/sanityCRUDHandlers";

// Generate metadata function
export async function generateMetadata(): Promise<Metadata> {
  //Should I try catch? maybe not but I did it anyway
  try {
    const givingsDetails =
      await sanityFetchWrapper<OnlineGiving[]>(onlineGivingQuery);

    // Get primary giving details for metadata
    const primaryGiving = givingsDetails?.[0];

    // Dynamic title and description based on CMS content
    const title = primaryGiving?.title
      ? `${primaryGiving.title} | Your Church Name`
      : "Online Giving | Your Church Name";

    const description = primaryGiving?.description
      ? `${primaryGiving.description} Support our ministry with secure online donations and bank transfers.`
      : "Support our church ministry through secure online giving. Multiple donation options including bank transfers, international giving, and easy receipt submission.";

    // Generate keywords based on giving options
    const hasNigerianBank = primaryGiving?.nigerianBankDetails?.bankName;
    const hasForeignBank = primaryGiving?.foreignBankDetails?.bankName;
    const hasEmail = primaryGiving?.receiptSubmission?.email;
    const hasWhatsApp = primaryGiving?.receiptSubmission?.whatsappNumber;

    const keywords: string[] = [
      "online giving",
      "church donations",
      "tithe online",
      "support church",
      "online offering",
      "church giving",
      "donate online",
      "church financial support",
      "ministry donations",
      "church contribution",
      ...(hasNigerianBank ? ["nigerian bank transfer", "local donations"] : []),
      ...(hasForeignBank
        ? [
            "international donations",
            "foreign bank transfer",
            "overseas giving",
          ]
        : []),
      ...(hasEmail ? ["email receipt"] : []),
      ...(hasWhatsApp ? ["whatsapp receipt"] : []),
    ];

    // Create structured data for donation organization
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "NGO",
      name: "Your Church Name",
      description: description,
      url: "/online-giving",
      sameAs: [
        "https://facebook.com/yourchurch", // Add your social links
        "https://instagram.com/yourchurch",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "donations",
        ...(hasEmail && { email: primaryGiving.receiptSubmission.email }),
        ...(hasWhatsApp && {
          telephone: primaryGiving.receiptSubmission.whatsappNumber,
        }),
      },
      potentialAction: {
        "@type": "DonateAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "/online-giving",
        },
      },
    };

    return {
      title,
      description,
      keywords,
      authors: [
        {
          name: "Gofamint Students' Fellowship UI Chapter",
          url: `${process.env.NEXT_PUBLIC_SITE_URL}/about`,
        },
      ],
      creator: "Bolarinwa Paul Ayomide (https://github.com/TLTechbender)",
      publisher: "Gofamint Students' Fellowship UI",
      category: "Chruch",
      // Open Graph metadata
      openGraph: {
        title,
        description,
        type: "website",
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/giving`,
        siteName: "Your Church Name",
        locale: "en_US",
        images: [
          {
            url: `${process.env.NEXT_PUBLIC_SITE_URL}/onlineGiving`,
            width: 1200,
            height: 630,
            alt: "Online Giving - Support Our Ministry GSF UI",
            type: "image/jpeg",
          },
        ],
      },

      // Twitter Card metadata
      twitter: {
        card: "summary_large_image",
        title,
        description,
        site: "@yourchurchtwitter",
        creator: "@yourchurchtwitter",
        images: [`${process.env.NEXT_PUBLIC_SITE_URL}/onlineGiving`],
      },

      // Additional metadata
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/giving`,
      },

      // Structured data and giving-specific metadata
      other: {
        "og:type": "website",
        "article:section": "Donations & Giving",
        "article:tag": keywords.slice(0, 10).join(", "),
        // Structured data JSON-LD
        "application/ld+json": JSON.stringify(structuredData),
        // Giving-specific meta tags
        "donation:methods": [
          ...(hasNigerianBank ? ["bank_transfer_ng"] : []),
          ...(hasForeignBank ? ["bank_transfer_international"] : []),
        ].join(","),
        "contact:email": hasEmail ? primaryGiving.receiptSubmission.email : "",
        "contact:whatsapp": hasWhatsApp
          ? primaryGiving.receiptSubmission.whatsappNumber
          : "",
      },

      // Robots directive
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

      // App-specific metadata
      appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: "Online Giving",
      },

      verification: {
        google: `${process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION_CODE}`,
      },

      classification: "Donation Platform",

      referrer: "strict-origin-when-cross-origin",
    };
  } catch (error) {
    console.error("Error generating online giving metadata:", error);

    // Fallback metadata
    return {
      title: "Online Giving | GSF UI",
      description:
        "Support our church ministry through secure online giving. Multiple donation options available with easy receipt submission.",
      keywords: [
        "online giving",
        "church donations",
        "tithe online",
        "support church",
        "ministry donations",
      ],

      openGraph: {
        title: "Online Giving | Your Church Name",
        description:
          "Support our church ministry through secure online giving.",
        type: "website",
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/giving`,

        images: [
          {
            url: `${process.env.NEXT_PUBLIC_SITE_URL}/onlineGiving`,
            width: 1200,
            height: 630,
            alt: "Online Giving",
          },
        ],
      },

      twitter: {
        card: "summary_large_image",
        title: "Online Giving | GSF UI",
        description:
          "Support our church ministry through secure online giving.",
        images: [`${process.env.NEXT_PUBLIC_SITE_URL}/onlineGiving`],
      },

      robots: {
        index: true,
        follow: true,
      },
    };
  }
}

export const dynamic = "force-dynamic";

export default async function OnlineGivings() {
  const givingsDetails =
    await sanityFetchWrapper<OnlineGiving[]>(onlineGivingQuery);

  return <OnlineGivingComponent givingDetails={givingsDetails} />;
}
