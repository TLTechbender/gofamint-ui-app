import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";


//THis be a placeholder right now fam

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  if (secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  try {
    // Get the webhook payload to see what was updated
    const body = await request.json();

    // Revalidate specific paths based on document type
    if (body._type === "post") {
      revalidatePath("/blog");
      revalidatePath(`/blog/${body.slug?.current}`);
    }

    // Always revalidate homepage
    revalidatePath("/");

    // Or use tags for more granular control
    // revalidateTag('posts')

    return NextResponse.json({
      revalidated: true,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Revalidation error:", err);
    return NextResponse.json(
      {
        message: "Error revalidating",
        error: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
