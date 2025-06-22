"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Maximize2,
  X,
  Clock,
  Users,
  Calendar,
  ChevronRight,
  MessageSquare,
  Share2,
  Heart,
} from "lucide-react";

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

interface LiveStreamPlayerProps {
  stream: LiveStream;
  onClose?: () => void;
  isPictureInPicture?: boolean;
  onViewerCountChange?: (count: number) => void;
}

interface LiveStreamBadgeProps {
  isLive: boolean;
  category?: string;
}

interface StreamScheduleProps {
  streams: LiveStream[];
  onStreamSelect: (stream: LiveStream) => void;
}

const LiveStreamPlayer: React.FC<LiveStreamPlayerProps> = ({
  stream,
  onClose,
  isPictureInPicture = false,
  onViewerCountChange,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const viewerCountInterval = useRef<NodeJS.Timeout>(null);
  const [currentViewerCount, setCurrentViewerCount] = useState(0);

  const getEmbedUrl = (platform: string, streamUrl: string): string => {
    switch (platform.toLowerCase()) {
      case "youtube":
        const youtubeId = streamUrl.includes("watch?v=")
          ? streamUrl.split("watch?v=")[1].split("&")[0]
          : streamUrl.split("/").pop() || "";
        return `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`;
      case "facebook":
        return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
          streamUrl
        )}&autoplay=1`;
      case "vimeo":
        const vimeoId = streamUrl.split("/").pop() || "";
        return `https://player.vimeo.com/video/${vimeoId}?autoplay=1`;
      case "twitch":
        const twitchChannel = streamUrl.split("/").pop() || "";
        return `https://player.twitch.tv/?channel=${twitchChannel}&parent=${window.location.hostname}&autoplay=true`;
      default:
        return streamUrl;
    }
  };

  // Simulate viewer count changes for demo purposes
  useEffect(() => {
    if (!onViewerCountChange) return;

    // Set initial viewer count
    const initialCount = Math.floor(Math.random() * 100) + 50;
    setCurrentViewerCount(initialCount);
    onViewerCountChange(initialCount);

    // Random viewer count fluctuation
    viewerCountInterval.current = setInterval(() => {
      const fluctuation = Math.floor(Math.random() * 20) - 10;
      setCurrentViewerCount((prev) => {
        const newCount = Math.max(0, prev + fluctuation);
        onViewerCountChange(newCount);
        return newCount;
      });
    }, 10000);

    return () => {
      if (viewerCountInterval.current) {
        clearInterval(viewerCountInterval.current);
      }
    };
  }, [onViewerCountChange]);

  return (
    <div
      className={`relative ${
        isPictureInPicture
          ? "fixed bottom-4 right-4 w-96 h-56 z-50 rounded-lg overflow-hidden shadow-2xl bg-black"
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
        ref={iframeRef}
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
    <div className="flex items-center gap-2 p-4">
      {isLive && (
        <div className="flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse">
          <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
          LIVE NOW
        </div>
      )}
      {category && (
        <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
          {getCategoryLabel(category)}
        </div>
      )}
    </div>
  );
};

const StreamSchedule: React.FC<StreamScheduleProps> = ({
  streams,
  onStreamSelect,
}) => {
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
          <button
            key={stream._id}
            onClick={() => onStreamSelect(stream)}
            className="w-full text-left flex items-center justify-between p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
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
          </button>
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
  const [showPictureInPicture, setShowPictureInPicture] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(1243);

  // Filter live streams and set initial selected stream
  const currentStreams = streamsData?.filter((stream) => stream.isLive) || [];

  // Set initial viewer count based on stream popularity
  useEffect(() => {
    if (currentStreams.length > 0) {
      const baseCount = currentStreams[0].category === "service" ? 500 : 150;
      setViewerCount(baseCount);
    }
  }, [currentStreams]);

  // Set the first live stream as selected when component mounts or streams change
  useEffect(() => {
    if (currentStreams.length > 0 && !selectedStream) {
      setSelectedStream(currentStreams[0]);
    }
  }, [currentStreams, selectedStream]);

  // Handle fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const handleStreamSelect = (stream: LiveStream) => {
    setSelectedStream(stream);
    if (showPictureInPicture) {
      setShowPictureInPicture(false);
    }
  };

  const toggleFullscreen = () => {
    const playerElement = document.getElementById("main-stream-player");
    if (!playerElement) return;

    if (!document.fullscreenElement) {
      playerElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  const handleShare = () => {
    if (navigator.share && selectedStream) {
      navigator
        .share({
          title: selectedStream.title,
          text: `Join me watching ${selectedStream.title} live!`,
          url: window.location.href,
        })
        .catch((error) => console.log("Error sharing", error));
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

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
              <p className="text-gray-600 mb-6">
                Check back soon for our next live service!
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                {streamsData
                  .filter((s) => !s.isLive)
                  .slice(0, 2)
                  .map((stream) => (
                    <div
                      key={stream._id}
                      className="bg-gray-50 p-4 rounded-lg text-left"
                    >
                      <h3 className="font-semibold text-gray-900">
                        {stream.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {new Date(stream.scheduledStart).toLocaleString()}
                      </p>
                    </div>
                  ))}
              </div>
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
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Live Stream</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              <Users size={16} />
              <span className="font-medium">
                {viewerCount.toLocaleString()} watching
              </span>
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
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <LiveStreamBadge
                  isLive={selectedStream.isLive}
                  category={selectedStream.category}
                />

                <div id="main-stream-player" className="relative">
                  {!showPictureInPicture && (
                    <>
                      <LiveStreamPlayer
                        stream={selectedStream}
                        onViewerCountChange={setViewerCount}
                      />
                      <div className="absolute bottom-4 right-4 flex gap-2">
                        <button
                          onClick={toggleFullscreen}
                          className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-lg transition-all"
                          title="Fullscreen"
                        >
                          <Maximize2 size={20} />
                        </button>
                        <button
                          onClick={() => setShowPictureInPicture(true)}
                          className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-lg transition-all"
                          title="Picture in Picture"
                        >
                          <Maximize2
                            size={20}
                            className="transform rotate-45"
                          />
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {/* Stream Info */}
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {selectedStream.title}
                      </h2>
                      {selectedStream.pastor && (
                        <p className="text-purple-600 font-medium">
                          {selectedStream.pastor}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleLike}
                        className={`p-2 rounded-full ${isLiked ? "text-red-500" : "text-gray-400"}`}
                        aria-label={isLiked ? "Unlike" : "Like"}
                      >
                        <Heart
                          size={20}
                          fill={isLiked ? "currentColor" : "none"}
                        />
                      </button>
                      <button
                        onClick={handleShare}
                        className="p-2 rounded-full text-gray-600 hover:text-gray-900"
                        aria-label="Share"
                      >
                        <Share2 size={20} />
                      </button>
                    </div>
                  </div>

                  {selectedStream.description && (
                    <div className="px-6 pb-6">
                      <p className="text-gray-600">
                        {selectedStream.description}
                      </p>
                    </div>
                  )}

                  {/* Stream Stats */}
                  <div className="px-6 pb-6 flex items-center gap-4 text-sm text-gray-500 border-t pt-4">
                    <span>
                      Started:{" "}
                      {new Date(
                        selectedStream.scheduledStart
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <span>•</span>
                    <span>{likeCount.toLocaleString()} likes</span>
                    <span>•</span>
                    <button
                      onClick={() => setIsChatOpen(!isChatOpen)}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                    >
                      <MessageSquare size={16} />
                      {isChatOpen ? "Hide Chat" : "Show Chat"}
                    </button>
                  </div>

                  {/* Chat Section */}
                  {isChatOpen && (
                    <div className="border-t p-6">
                      <h3 className="font-bold text-lg mb-4">Live Chat</h3>
                      <div className="bg-gray-50 rounded-lg p-4 h-64 overflow-y-auto">
                        {/* Chat messages would go here */}
                        <p className="text-center text-gray-500 py-8">
                          Live chat coming soon!
                        </p>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <input
                          type="text"
                          placeholder="Type your message..."
                          className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          disabled
                        />
                        <button
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                          disabled
                        >
                          Send
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

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
                        onClick={() => handleStreamSelect(stream)}
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
                <StreamSchedule
                  streams={otherStreams}
                  onStreamSelect={handleStreamSelect}
                />
              )}

              {/* Upcoming Streams */}
              {streamsData.filter((s) => !s.isLive).length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Upcoming Streams
                  </h3>
                  <div className="space-y-3">
                    {streamsData
                      .filter((s) => !s.isLive)
                      .slice(0, 3)
                      .map((stream) => (
                        <div
                          key={stream._id}
                          className="p-3 bg-gray-50 rounded-lg"
                        >
                          <h4 className="font-medium text-gray-900">
                            {stream.title}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {new Date(stream.scheduledStart).toLocaleString(
                              [],
                              {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
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
