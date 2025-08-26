"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Maximize2,
  X,
  Clock,
  Calendar,
  ChevronRight,
  Share2,
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
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

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

  return (
    <div
      className={`relative ${
        isPictureInPicture
          ? "fixed bottom-6 right-6 w-80 h-48 z-50 overflow-hidden shadow-2xl bg-black"
          : "w-full aspect-video"
      }`}
    >
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 bg-black/70 hover:bg-black/90 text-white p-2 transition-all duration-200"
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
    <div className="flex items-center justify-between p-6 border-b border-gray-100">
      <div className="flex items-center gap-4">
        {isLive && (
          <div className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 text-sm font-medium">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            LIVE
          </div>
        )}
        {category && (
          <div className="bg-blue-50 text-blue-500 px-4 py-2 text-sm font-medium">
            {getCategoryLabel(category)}
          </div>
        )}
      </div>
    </div>
  );
};

const StreamSchedule: React.FC<StreamScheduleProps> = ({
  streams,
  onStreamSelect,
}) => {
  if (streams.length === 0) {
    return (
      <div className="bg-white border border-gray-100">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-px bg-blue-400"></div>
            <h3 className="text-lg font-light text-black">Upcoming Streams</h3>
          </div>
          <p className="text-black font-light">
            No upcoming streams scheduled.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-100">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-6 h-px bg-blue-400"></div>
          <h3 className="text-lg font-light text-black">Other Live Streams</h3>
        </div>
        <div className="space-y-3">
          {streams.map((stream) => (
            <button
              key={stream._id}
              onClick={() => onStreamSelect(stream)}
              className="w-full text-left flex items-center justify-between p-4 hover:bg-gray-50 transition-colors duration-200 group"
            >
              <div>
                <h4 className="font-medium text-black mb-1">{stream.title}</h4>
                <p className="text-sm text-black font-light flex items-center gap-2 mb-1">
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
                  <p className="text-sm text-blue-500 font-light">
                    {stream.pastor}
                  </p>
                )}
              </div>
              <ChevronRight
                size={18}
                className="text-gray-400 group-hover:text-blue-400 transition-colors duration-200"
              />
            </button>
          ))}
        </div>
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
  const [_, setIsFullscreen] = useState(false);

  // Helper functions remain the same...
  const isStreamActuallyLive = (stream: LiveStream): boolean => {
    if (!stream.isLive) return false;
    const now = new Date().getTime();
    const startTime = new Date(stream.scheduledStart).getTime();
    if (now < startTime) return false;
    if (stream.scheduledEnd) {
      const endTime = new Date(stream.scheduledEnd).getTime();
      return now <= endTime;
    }
    return true;
  };

  const isStreamUpcoming = (stream: LiveStream): boolean => {
    const now = new Date().getTime();
    const startTime = new Date(stream.scheduledStart).getTime();
    return startTime > now;
  };

  const isStreamPast = (stream: LiveStream): boolean => {
    const now = new Date().getTime();
    if (stream.scheduledEnd) {
      const endTime = new Date(stream.scheduledEnd).getTime();
      return now > endTime;
    }
    const startTime = new Date(stream.scheduledStart).getTime();
    return now > startTime && !stream.isLive;
  };

  const currentStreams = streamsData?.filter(isStreamActuallyLive) || [];
  const upcomingStreams = streamsData?.filter(isStreamUpcoming) || [];
  const pastStreams = streamsData?.filter(isStreamPast) || [];

  useEffect(() => {
    if (currentStreams.length > 0 && !selectedStream) {
      setSelectedStream(currentStreams[0]);
    } else if (currentStreams.length === 0 && selectedStream) {
      setSelectedStream(null);
    } else if (selectedStream && !isStreamActuallyLive(selectedStream)) {
      setSelectedStream(currentStreams[0] || null);
    }
  }, [currentStreams, selectedStream]);

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

  const handleShare = async () => {
    if (!selectedStream) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: selectedStream.title,
          text: `Join me watching ${selectedStream.title} live!`,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      } catch (error) {
        console.error("Error copying to clipboard:", error);
      }
    }
  };

  // No live streams state - Minimalist design
  if (!streamsData || streamsData.length === 0 || currentStreams.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto px-6 md:px-8 py-24 md:py-32">
          <div className="text-center">
            <div className="bg-white border border-gray-100 p-16 md:p-20">
              <Clock size={64} className="mx-auto text-gray-300 mb-12" />

              <div className="flex items-center justify-center gap-3 mb-8">
                <div className="w-8 h-px bg-blue-400"></div>
                <span className="text-sm font-medium text-blue-400 uppercase tracking-wider">
                  Currently Offline
                </span>
                <div className="w-8 h-px bg-blue-400"></div>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-black mb-8 leading-tight">
                No Live Streams Active
              </h1>

              <p className="text-lg text-black font-light mb-12 max-w-2xl mx-auto leading-relaxed">
                Check back soon for our next live service. We'll be back with
                inspiring content and community worship.
              </p>

              {/* Upcoming streams preview - Clean cards */}
              {upcomingStreams.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16 max-w-4xl mx-auto">
                  {upcomingStreams.slice(0, 2).map((stream) => (
                    <div
                      key={stream._id}
                      className="bg-gray-50 p-8 text-left border border-gray-100"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <span className="inline-block w-1 h-1 bg-blue-400 rounded-full"></span>
                        <span className="text-xs font-medium text-blue-400 uppercase tracking-wider">
                          Next Up
                        </span>
                      </div>
                      <h3 className="text-xl font-light text-black mb-3 leading-tight">
                        {stream.title}
                      </h3>
                      <p className="text-sm text-black font-light mb-2">
                        {new Date(stream.scheduledStart).toLocaleString([], {
                          weekday: "long",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      {stream.pastor && (
                        <p className="text-sm text-blue-500 font-light">
                          {stream.pastor}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
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
    <div className="bg-white min-h-screen">
      {/* Clean navigation overlay */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-black/60 backdrop-blur-sm z-10"></div>

      <main className="max-w-7xl mx-auto px-6 md:px-8 pt-24 pb-16">
        <div className="grid lg:grid-cols-3 gap-12 md:gap-16">
          {/* Main Stream Player */}
          <div className="lg:col-span-2">
            {selectedStream && (
              <div className="bg-white border border-gray-100">
                <LiveStreamBadge
                  isLive={selectedStream.isLive}
                  category={selectedStream.category}
                />

                <div id="main-stream-player" className="relative">
                  {!showPictureInPicture && (
                    <>
                      <LiveStreamPlayer stream={selectedStream} />
                      <div className="absolute bottom-4 right-4 flex gap-3">
                        <button
                          onClick={toggleFullscreen}
                          className="bg-black/70 hover:bg-black/90 text-white p-3 transition-all duration-200"
                          title="Fullscreen"
                        >
                          <Maximize2 size={18} />
                        </button>
                        <button
                          onClick={() => setShowPictureInPicture(true)}
                          className="bg-black/70 hover:bg-black/90 text-white p-3 transition-all duration-200"
                          title="Picture in Picture"
                        >
                          <Maximize2
                            size={18}
                            className="transform rotate-45"
                          />
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {/* Clean Stream Info */}
                <div className="p-8">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-light text-black mb-4 leading-tight">
                        {selectedStream.title}
                      </h2>
                      {selectedStream.pastor && (
                        <p className="text-blue-500 font-light text-lg">
                          {selectedStream.pastor}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={handleShare}
                      className="p-3 text-gray-400 hover:text-blue-400 hover:bg-blue-50 transition-all duration-200"
                      aria-label="Share"
                    >
                      <Share2 size={20} />
                    </button>
                  </div>

                  {selectedStream.description && (
                    <div className="mb-8">
                      <p className="text-black font-light leading-relaxed text-lg">
                        {selectedStream.description}
                      </p>
                    </div>
                  )}

                  {/* Clean Stream Stats */}
                  <div className="flex items-center gap-6 text-sm text-black font-light border-t border-gray-100 pt-6">
                    <span>
                      Started:{" "}
                      {new Date(
                        selectedStream.scheduledStart
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span>{selectedStream.platform}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Clean Sidebar */}
          <div className="space-y-8">
            {/* Multiple live streams selector */}
            {currentStreams.length > 1 && (
              <div className="bg-white border border-gray-100">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-6 h-px bg-blue-400"></div>
                    <h3 className="text-lg font-light text-black">
                      Select Stream
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {currentStreams.map((stream) => (
                      <button
                        key={stream._id}
                        onClick={() => handleStreamSelect(stream)}
                        className={`w-full text-left p-4 transition-all duration-200 ${
                          selectedStream?._id === stream._id
                            ? "bg-blue-50 border-2 border-blue-200"
                            : "bg-gray-50 hover:bg-gray-100 border border-transparent"
                        }`}
                      >
                        <div className="font-medium text-black mb-1">
                          {stream.title}
                        </div>
                        {stream.pastor && (
                          <div className="text-sm text-black font-light">
                            {stream.pastor}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
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

            {/* Clean Upcoming Streams */}
            {upcomingStreams.length > 0 && (
              <div className="bg-white border border-gray-100">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-6 h-px bg-blue-400"></div>
                    <h3 className="text-lg font-light text-black">
                      Upcoming Streams
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {upcomingStreams.slice(0, 3).map((stream) => (
                      <div
                        key={stream._id}
                        className="p-4 bg-gray-50 border border-gray-100"
                      >
                        <h4 className="font-medium text-black mb-2">
                          {stream.title}
                        </h4>
                        <p className="text-sm text-black font-light mb-1">
                          {new Date(stream.scheduledStart).toLocaleString([], {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        {stream.pastor && (
                          <p className="text-sm text-blue-500 font-light">
                            {stream.pastor}
                          </p>
                        )}
                      </div>
                    ))}
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
