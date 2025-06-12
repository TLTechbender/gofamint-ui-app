"use client";
import React, { useState, useEffect } from "react";
import {
  Play,
  Maximize2,
  X,
  Clock,
  Users,
  Calendar,
  ChevronRight,
} from "lucide-react";

// TypeScript interfaces for Sanity data
interface LiveStream {
  _id: string;
  title: string;
  description?: string;
  platform: string;
  streamUrl: string;
  embedCode?: string;
  thumbnailUrl?: string;
  isLive: boolean;
  scheduledStart: string;
  scheduledEnd?: string;
  pastor?: string;
  category?: string;
}

// Props interfaces
interface LiveStreamPlayerProps {
  stream: LiveStream;
  onClose?: () => void;
  isPictureInPicture?: boolean;
}

interface LiveStreamBadgeProps {
  isLive: boolean;
  category?: string;
}

interface StreamScheduleProps {
  streams: LiveStream[];
}

const LiveStreamPlayer: React.FC<LiveStreamPlayerProps> = ({
  stream,
  onClose,
  isPictureInPicture = false,
}) => {
  const getEmbedUrl = (platform: string, streamUrl: string): string => {
    switch (platform) {
      case "youtube":
        const youtubeId = streamUrl.includes("watch?v=")
          ? streamUrl.split("watch?v=")[1].split("&")[0]
          : streamUrl.split("/").pop() || "";
        return `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`;
      case "facebook":
        return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(streamUrl)}&autoplay=1`;
      case "vimeo":
        const vimeoId = streamUrl.split("/").pop() || "";
        return `https://player.vimeo.com/video/${vimeoId}?autoplay=1`;
      case "twitch":
        const twitchChannel = streamUrl.split("/").pop() || "";
        return `https://player.twitch.tv/?channel=${twitchChannel}&parent=${window.location.hostname}&autoplay=true`;
      case "instagram":
        // Instagram Live typically requires special handling
        return streamUrl;
      default:
        return streamUrl;
    }
  };

  return (
    <div
      className={`relative ${
        isPictureInPicture
          ? "fixed bottom-4 right-4 w-96 h-56 z-50 rounded-lg overflow-hidden shadow-2xl"
          : "w-full aspect-video"
      }`}
    >
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-10 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-1 rounded-full transition-all"
          aria-label="Close player"
        >
          <X size={16} />
        </button>
      )}
      <iframe
        src={getEmbedUrl(stream.platform, stream.streamUrl)}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title={stream.title}
      />
    </div>
  );
};

const LiveStreamBadge: React.FC<LiveStreamBadgeProps> = ({
  isLive,
  category,
}) => {
  if (!isLive) return null;

  const getCategoryLabel = (cat?: string): string => {
    if (!cat) return "";
    const labels: Record<string, string> = {
      service: "Sunday Service",
      prayer: "Prayer Meeting",
      study: "Bible Study",
      youth: "Youth Service",
      event: "Special Event",
      conference: "Conference",
    };
    return labels[cat] || cat.replace("_", " ");
  };

  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse">
        <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
        LIVE NOW
      </div>
      {category && (
        <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
          {getCategoryLabel(category)}
        </div>
      )}
    </div>
  );
};

const StreamSchedule: React.FC<StreamScheduleProps> = ({ streams }) => {
  if (streams.length === 0) {
    return (
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Upcoming Streams
        </h3>
        <p className="text-gray-600">No upcoming streams scheduled.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-xl p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        Other Live Streams
      </h3>
      <div className="space-y-3">
        {streams.map((stream) => (
          <div
            key={stream._id}
            className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div>
              <h4 className="font-semibold text-gray-900">{stream.title}</h4>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <Calendar size={14} />
                {new Date(stream.scheduledStart).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </p>
              {stream.pastor && (
                <p className="text-sm text-purple-600">{stream.pastor}</p>
              )}
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </div>
        ))}
      </div>
    </div>
  );
};

const LiveStreamComponent = ({
  streamsData,
}: {
  streamsData: LiveStream[];
}) => {
  const [selectedStream, setSelectedStream] = useState<LiveStream | null>(null);
  const [showPictureInPicture, setShowPictureInPicture] =
    useState<boolean>(false);
  const [viewerCount, setViewerCount] = useState<number>(247);

  // Filter live streams and set initial selected stream
  const currentStreams = streamsData?.filter((stream) => stream.isLive) || [];

  // Set the first live stream as selected when component mounts or streams change
  useEffect(() => {
    if (currentStreams.length > 0 && !selectedStream) {
      setSelectedStream(currentStreams[0]);
    }
  }, [currentStreams, selectedStream]);

  // No live streams state
  if (!streamsData || streamsData.length === 0 || currentStreams.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-xl p-12">
              <Clock size={64} className="mx-auto text-gray-400 mb-6" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                No Live Streams Active
              </h1>
              <p className="text-gray-600 mb-8">
                Check back soon for our next live service!
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const otherStreams = currentStreams.filter(
    (stream) => stream._id !== selectedStream?._id
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Live Stream</h1>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users size={16} />
              <span className="font-medium">{viewerCount} watching</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Stream Player */}
          <div className="lg:col-span-2">
            {selectedStream && (
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-6">
                <LiveStreamBadge
                  isLive={selectedStream.isLive}
                  category={selectedStream.category}
                />

                {!showPictureInPicture && (
                  <div className="relative">
                    <LiveStreamPlayer stream={selectedStream} />
                    <button
                      onClick={() => setShowPictureInPicture(true)}
                      className="absolute bottom-4 right-4 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-lg transition-all"
                      title="Picture in Picture"
                    >
                      <Maximize2 size={20} />
                    </button>
                  </div>
                )}

                {showPictureInPicture && (
                  <div className="aspect-video bg-gray-900 flex items-center justify-center">
                    <div className="text-center text-white">
                      <Play size={64} className="mx-auto mb-4" />
                      <p className="text-lg">
                        Stream is playing in Picture-in-Picture mode
                      </p>
                      <button
                        onClick={() => setShowPictureInPicture(false)}
                        className="mt-4 bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg transition-colors"
                      >
                        Return to Main View
                      </button>
                    </div>
                  </div>
                )}

                <div className="pt-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedStream.title}
                  </h2>
                  {selectedStream.description && (
                    <p className="text-gray-600 mb-4">
                      {selectedStream.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>
                        Started:{" "}
                        {new Date(
                          selectedStream.scheduledStart
                        ).toLocaleTimeString()}
                      </span>
                      {selectedStream.pastor && (
                        <span>• {selectedStream.pastor}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-red-600 font-medium">LIVE</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Multiple live streams selector */}
            {currentStreams.length > 1 && (
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Select Stream
                </h3>
                <div className="space-y-2">
                  {currentStreams.map((stream) => (
                    <button
                      key={stream._id}
                      onClick={() => setSelectedStream(stream)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedStream?._id === stream._id
                          ? "bg-purple-100 text-purple-800 border-2 border-purple-300"
                          : "bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      <div className="font-medium">{stream.title}</div>
                      {stream.pastor && (
                        <div className="text-sm text-gray-600">
                          {stream.pastor}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Other Live Streams */}
            {otherStreams.length > 0 && (
              <StreamSchedule streams={otherStreams} />
            )}

            {/* Stream Info */}
            {selectedStream && (
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Stream Information
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Platform:</span>
                    <span className="font-medium capitalize">
                      {selectedStream.platform}
                    </span>
                  </div>
                  {selectedStream.category && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <span className="font-medium capitalize">
                        {selectedStream.category.replace("_", " ")}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Started:</span>
                    <span className="font-medium">
                      {new Date(
                        selectedStream.scheduledStart
                      ).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Picture in Picture Player */}
      {showPictureInPicture && selectedStream && (
        <LiveStreamPlayer
          stream={selectedStream}
          onClose={() => setShowPictureInPicture(false)}
          isPictureInPicture={true}
        />
      )}
    </div>
  );
};

export default LiveStreamComponent;
