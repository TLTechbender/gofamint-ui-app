import LiveStreamComponent from "@/components/liveComponent";
import { LiveStream } from "@/sanity/interfaces/streaming";
import { getCurrentLiveStreams } from "@/sanity/queries/streaming";
import { sanityFetchWrapper } from "@/sanity/sanityCRUDHandlers";

export default async function Live() {
  const streamsData = await sanityFetchWrapper<LiveStream[]>(
    getCurrentLiveStreams
  );

  return <LiveStreamComponent streamsData={streamsData} />;
}
