import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

export async function PUT() {
  return new NextResponse("Method Not Allowed", { status: 405 });
}

export async function PATCH() {
  return new NextResponse("Method Not Allowed", { status: 405 });
}

export async function DELETE() {
  return new NextResponse("Method Not Allowed", { status: 405 });
}

export async function GET() {
  return new NextResponse("Method Not Allowed", { status: 405 });
}

// Revalidation functions using single tag approach
async function revalidateHomepage() {
  console.log("🔄 Revalidating homepage");
  revalidateTag("homepage");
  revalidatePath("/");
  return { tags: ["homepage"] };
}

async function revalidateBlogsPage() {
  console.log("🔄 Revalidating blogs page");
  revalidateTag("blogsPage");
  revalidatePath("/blog");
  return { tags: ["blogsPage"] };
}

async function revalidateAboutPage() {
  console.log("🔄 Revalidating about page");
  revalidateTag("aboutPage");
  revalidatePath("/about");
  return { tags: ["aboutPage"] };
}

async function revalidateContactInfo() {
  console.log("🔄 Revalidating contact info");
  revalidateTag("contactInfo");
  revalidatePath("/contact");
  return { tags: ["contactInfo"] };
}

//Don't thking I need this, but since next.js can be unpredicatable atimes I would be leaving this revalidate here now until I fee
//we may need the performance imporvement in future
async function revalidateFellowshipEvent() {
  console.log("🔄 Revalidating fellowship events");
  revalidateTag("fellowshipEvent");
  revalidateTag("fellowshipEventMetadata");
  revalidatePath("/events");
  return { tags: ["fellowshipEvent", "fellowshipEventMetadata"] };
}

async function revalidateExecutives() {
  console.log("🔄 Revalidating executives");
  revalidateTag("executives");
  revalidatePath("/executives");
  return { tags: ["executives"] };
}

async function revalidateGallery() {
  console.log("🔄 Revalidating gallery");
  revalidateTag("gallery");
  revalidatePath("/gallery");
  return { tags: ["gallery"] };
}

async function revalidateOnlineGiving() {
  console.log("🔄 Revalidating online giving");
  revalidateTag("onlineGiving");
  revalidatePath("/giving");
  return { tags: ["onlineGiving"] };
}

async function revalidateSermons() {
  console.log("🔄 Revalidating sermons");
  revalidateTag("sermons");
  revalidateTag("sermon");
  revalidateTag("sermonsPageMetadataAndHero");
  revalidatePath("/sermons");
  return { tags: ["sermons"] };
}

async function revalidateLiveStream() {
  console.log("🔄 Revalidating live stream");
  revalidateTag("liveStream");
  revalidatePath("/live");
  return { tags: ["liveStream"] };
}

async function revalidateFooter() {
  console.log("🔄 Revalidating footer");
  revalidateTag("footer");
  return { tags: ["footer"] };
}

async function revalidateWhatsappContactWidget() {
  console.log("🔄 Revalidating WhatsApp widget");
  revalidateTag("whatsappContactWidget");
  return { tags: ["whatsappContactWidget"] };
}

async function readBody(
  readable: ReadableStream<Uint8Array> | null
): Promise<string> {
  if (!readable) return "";

  const chunks: Buffer[] = [];
  const reader = readable.getReader();

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(Buffer.from(value));
    }
  } finally {
    reader.releaseLock();
  }

  return Buffer.concat(chunks).toString("utf8");
}

const secret = process.env.SANITY_WEBHOOK_SECRET!;

interface WebhookPayload {
  tags?: string[];
  _type?: string;
  _id?: string;
}

export async function POST(request: NextRequest) {
  console.log("🚀 Combined webhook for all content types received");

  try {
    // Check signature
    const signature = request.headers.get(SIGNATURE_HEADER_NAME);
    if (!signature) {
      console.log("❌ No signature found");
      return NextResponse.json(
        { success: false, message: "Missing signature" },
        { status: 400 }
      );
    }

    // Read body
    const body = await readBody(request.body);
    if (!body) {
      console.log("❌ Empty body");
      return NextResponse.json(
        { success: false, message: "Empty body" },
        { status: 400 }
      );
    }

    // Validate signature
    if (!secret) {
      console.log("❌ No webhook secret");
      return NextResponse.json(
        { success: false, message: "Server config error" },
        { status: 500 }
      );
    }

    const isValid = await isValidSignature(body, signature, secret);
    if (!isValid) {
      console.log("❌ Invalid signature");
      return NextResponse.json(
        { success: false, message: "Invalid signature" },
        { status: 401 }
      );
    }

    let parsedBody: WebhookPayload;
    try {
      parsedBody = JSON.parse(body);
      console.log("📄 Parsed webhook payload:", parsedBody);
    } catch (e) {
      console.log("❌ Invalid JSON");
      return NextResponse.json(
        { success: false, message: "Invalid JSON" },
        { status: 400 }
      );
    }

    // Check if we have tags array or fallback to _type
    const tagsToProcess =
      parsedBody.tags || (parsedBody._type ? [parsedBody._type] : []);

    if (tagsToProcess.length === 0) {
      console.log("⚠️ No tags or document type found in payload");
      return NextResponse.json(
        {
          success: true,
          message: "No tags or document type found - nothing to revalidate",
          operation: "IGNORED",
        },
        { status: 200 }
      );
    }

    console.log(`📄 Processing tags: ${tagsToProcess.join(", ")}`);

    // Process each tag and collect results
    const revalidationResults = [];

    for (const tag of tagsToProcess) {
      let revalidationResult;

      switch (tag) {
        case "homepage":
          revalidationResult = await revalidateHomepage();
          break;

        //todo I need to ensure consistent use of camel case man
        case "aboutpage":
          revalidationResult = await revalidateAboutPage();
          break;

        case "blogsPage":
          revalidationResult = await revalidateBlogsPage();
          break;

        case "contactInfo":
          revalidationResult = await revalidateContactInfo();
          break;

        case "fellowshipEvent":
          revalidationResult = await revalidateFellowshipEvent();
          break;

        case "executives":
          revalidationResult = await revalidateExecutives();
          break;

        case "gallery":
          revalidationResult = await revalidateGallery();
          break;

        case "onlineGiving":
          revalidationResult = await revalidateOnlineGiving();
          break;

        case "sermonsPageMetadataAndHero":
        case "sermon":
          revalidationResult = await revalidateSermons();
          break;

        case "liveStream":
          revalidationResult = await revalidateLiveStream();
          break;

        case "footer":
          revalidationResult = await revalidateFooter();
          break;

        case "whatsappContactWidget":
          revalidationResult = await revalidateWhatsappContactWidget();
          break;

        default:
          console.log(`⚠️ Unsupported tag: ${tag}`);
          continue;
      }

      if (revalidationResult) {
        revalidationResults.push(revalidationResult);
      }
    }

    if (revalidationResults.length === 0) {
      return NextResponse.json(
        {
          success: true,
          message: `No supported tags found in: ${tagsToProcess.join(", ")}`,
          operation: "IGNORED",
          processedTags: tagsToProcess,
        },
        { status: 200 }
      );
    }

    // Return success response
    console.log(
      `✅ Successfully processed ${revalidationResults.length} tag(s)`
    );
    return NextResponse.json(
      {
        success: true,
        message: `Successfully revalidated ${revalidationResults.length} tag(s)`,
        operation: "REVALIDATED",
        revalidated: revalidationResults,
        processedTags: tagsToProcess,
        documentId: parsedBody._id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("💥 Webhook error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Processing failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
