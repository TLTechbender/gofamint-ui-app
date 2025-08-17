// import {
//   sanityFetchWrapper,
//   sanityPatchWrapper,
// } from "@/sanity/sanityCRUDHandlers";
// import { NextRequest, NextResponse } from "next/server";

// export async function POST(request: NextRequest) {
//   try {
//     const { token } = await request.json();

//     if (!token) {
//       return NextResponse.json(
//         { error: "Verification token is required" },
//         { status: 400 }
//       );
//     }

//     // Find user with this verification token
//     const userQuery = `*[_type == "user" && emailVerificationToken == $token][0]`;
//     const user = await sanityFetchWrapper(userQuery, { token });

//     console.log(user);

//     if (!user) {
//       return NextResponse.json(
//         { error: "Invalid or expired verification token" },
//         { status: 400 }
//       );
//     }

//     if (new Date() > new Date(user.emailVerificationExpiry)) {
//       return NextResponse.json(
//         { error: "Verification token has expired" },
//         { status: 400 }
//       );
//     }

//     // Update user to mark as verified and active
//   const response =  await sanityPatchWrapper(user._id, {
//       set: {
//         emailVerified: new Date().toISOString(),
//         isActive: true,
//         emailVerificationToken: null,
//         emailVerificationExpiry: null,
//         updatedAt: new Date().toISOString(),
//       },
//   });
      
//       console.log(response);

//     return NextResponse.json(
//       { message: "Email verified successfully!" },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Email verification error:", error);
//     return NextResponse.json(
//       { error: "Email verification failed. Please try again." },
//       { status: 500 }
//     );
//   }
// }
import {
  sanityFetchWrapper,
  sanityPatchWrapper,
} from "@/sanity/sanityCRUDHandlers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Check if request has content
    const contentLength = request.headers.get("content-length");
    if (!contentLength || contentLength === "0") {
      return NextResponse.json(
        { error: "Verification token is required" },
        { status: 400 }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch (jsonError) {
      console.error("JSON parsing error:", jsonError);
      return NextResponse.json(
        { error: "Invalid request format" },
        { status: 400 }
      );
    }

    const { token } = body;

    if (!token || !token.trim()) {
      return NextResponse.json(
        { error: "Verification token is required" },
        { status: 400 }
      );
    }

    // Find user with this verification token
    const userQuery = `*[_type == "user" && emailVerificationToken == $token][0]`;
    const user = await sanityFetchWrapper(userQuery, { token: token.trim() });

    console.log(user);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired verification token" },
        { status: 400 }
      );
    }

    if (new Date() > new Date(user.emailVerificationExpiry)) {
      return NextResponse.json(
        { error: "Verification token has expired" },
        { status: 400 }
      );
    }

    // Update user to mark as verified and active
    const response = await sanityPatchWrapper(user._id, {
      set: {
        emailVerified: new Date().toISOString(),
        isActive: true,
        emailVerificationToken: null,
        emailVerificationExpiry: null,
        updatedAt: new Date().toISOString(),
      },
    });

    console.log(response);

    return NextResponse.json(
      { message: "Email verified successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { error: "Email verification failed. Please try again." },
      { status: 500 }
    );
  }
}