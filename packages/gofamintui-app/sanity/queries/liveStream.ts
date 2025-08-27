// Get currently live streams
export const getCurrentLiveStreams = `
  *[_type == "liveStream" && isLive == true] | order(scheduledStart desc) {
    _id,
    title,
    description,
    platform,
    streamUrl,
    embedCode,
    scheduledStart,
    scheduledEnd,
    isLive,
    category,
    "thumbnailUrl": thumbnail.asset->url,
    pastor
  }
`;

