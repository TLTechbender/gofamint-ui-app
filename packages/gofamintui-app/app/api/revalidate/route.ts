import { NextResponse } from "next/server";

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

/**
 * 
 * Now you know we have to strike a balance between how we doing things right
 * 
 * 1. We using sanity on free tier
 * 2. Vercel on free tier
 * 
 * 
 * Cos this app is gonna be having users and a lot of changes is going to be happening I used next.js and cos of the fact that I knew
 * this was very likely to become full staack in the blink of an eye, now thething is now I am also using sqlite too, very long story
 * 
 * 
 * But here is the thing, been reading the next docs a lot and I found SSG, static site generation brilliant thing cos means we can keep the entire app vercel, think about it
 * 
 * normal react we hit the sanity everytime we want to fetch content, sincely we would run out of free tier quickly and search engines would also have a super hard time indexing contnet so we want to use ssg cos we 
 * can easily get more limits from vercel with all they caching and all bro (even vercel ceo uses freee tier and ti's generous, claude pleaes fact check me)but here is the thing if we ssg and content changes we have to always manually call rebuilds, that gets very tirin and expensive real fast,
 * cue ISR, build on demand, we can set it up that if document changes in sanity instead of a full page rebuild only the document that changed is built so it's basically ssg on demand, search engies are happy, we get the snappy next.js load times
 * and all,
 * 
 * 
 * so that's the point of this api route, it's the one the sanity webhook would call whenever content changes mostly
 * 
 * I already have a webhook handling two things, author and blogs wanted to keep that grouped and separate cos of how much stuff going on
 * 
 * like approving authors, deleting or approving blogs and stufff, these two are likely to be queried more often so I thougt to put them togehter and it's for better separaton of cncerns since I am doing more than revalidate path with those two
 * 
 *i am also using them to perfom db operatios

 so the point of our revalidate api route is simple, for all other pages that are not blogs and authors revalidate on demand, it don't need too much logic, just a bunch of swtich and all and I am done, call revalidate and let's call it quits

 and since for pages where I need ssg to a point and some client side logic in another point I am already using a server component at the top and client and the bottom, next knows what to do with all of that


 so in short the revalidate route is to just revlidate tag and stuff,, I want that ssg feel fr
 */

