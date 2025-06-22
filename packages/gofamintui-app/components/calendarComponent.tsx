// packages/gofamintui-app/components/fellowshipCalendar.tsx
"use client";
import React, { useState, useMemo } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import type { View } from "react-big-calendar";
import { PortableText, PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import {
  Clock,
  MapPin,
  Users,
  Tag,
  X,
  Loader2,
  RefreshCw,
  AlertCircle,
  CalendarCheck2,
  ArrowRight, // Added for modal icon
} from "lucide-react";
import "react-big-calendar/lib/css/react-big-calendar.css"; // Keep this for base styles
import { motion } from "framer-motion";

import { useFellowshipEvents } from "@/hooks/useCalendar"; // Assuming this hook exists and works

const localizer = momentLocalizer(moment);

// Portable Text components for rich text rendering
const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mb-4 text-gray-700 leading-relaxed">{children}</p>
    ),
    h1: ({ children }) => (
      <h1 className="text-3xl font-bold text-gray-900 mb-6 mt-8">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-lg font-semibold text-gray-900 mb-3 mt-4">
        {children}
      </h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-blue-500 pl-6 py-4 my-6 italic text-gray-800 bg-blue-50 rounded-r-lg">
        {children}
      </blockquote>
    ),
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      // Note: urlFor needs to be properly configured via sanityClient in your project
      const imageUrl =
        value.asset.url || `/api/placeholder/800/400?text=Image+Missing`;

      return (
        <div className="my-8">
          <img
            src={imageUrl}
            alt={value.alt || ""}
            className="w-full rounded-lg shadow-lg"
          />
          {value.alt && (
            <p className="text-sm text-gray-600 mt-2 text-center italic">
              {value.alt}
            </p>
          )}
        </div>
      );
    },
    callout: ({ value }) => (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-6 rounded-r-lg">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-yellow-700">{value.text}</p>
          </div>
        </div>
      </div>
    ),
    code: ({ value }) => (
      <div className="my-6">
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
          <code className={`language-${value.language || "text"}`}>
            {value.code}
          </code>
        </pre>
        {value.filename && (
          <p className="text-sm text-gray-600 mt-2 text-center">
            {value.filename}
          </p>
        )}
      </div>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-gray-900">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ value, children }) => {
      const target = (value?.href || "").startsWith("http")
        ? "_blank"
        : undefined;
      return (
        <a
          href={value?.href}
          target={target}
          rel={target === "_blank" ? "noopener noreferrer" : undefined}
          className="text-blue-600 hover:text-blue-800 underline transition-colors"
        >
          {children}
        </a>
      );
    },
    code: ({ children }) => (
      <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono">
        {children}
      </code>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-inside mb-4 ml-4 space-y-2">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-inside mb-4 ml-4 space-y-2">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="text-gray-700">{children}</li>,
    number: ({ children }) => <li className="text-gray-700">{children}</li>,
  },
};

const isPortableText = (
  description: string | PortableTextBlock[] | undefined
): description is PortableTextBlock[] => {
  return (
    Array.isArray(description) &&
    description.length > 0 &&
    typeof description[0] === "object" &&
    "_type" in description[0]
  );
};

const renderDescription = (
  description: string | PortableTextBlock[] | undefined
) => {
  if (!description) return null;

  if (isPortableText(description)) {
    return (
      <PortableText value={description} components={portableTextComponents} />
    );
  }

  return <p className="text-gray-600">{description}</p>;
};

// Calendar event type for react-big-calendar (assuming FellowshipEvent comes from your Sanity structure)
interface FellowshipEvent {
  id: string;
  title: string;
  eventDate: string; // ISO date string
  endDateTime?: string; // Optional ISO date string
  location?: {
    venue?: string;
    room?: string;
    address?: string;
    googleMapsLink?: string;
  };
  eventType: string; // e.g., "weekly-service", "bible-study"
  ministers?: Array<{
    name: string;
    role?: string; // e.g., "pastor", "guest-speaker"
    bio?: string | PortableTextBlock[];
  }>;
  description?: string | PortableTextBlock[];
  // Add other properties from your Sanity event schema as needed
}

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: FellowshipEvent;
  allDay: boolean;
}

const FellowshipCalendar: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<FellowshipEvent | null>(
    null
  );
  const [showModal, setShowModal] = useState<boolean>(false);
  const [view, setView] = useState<View>(Views.MONTH);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  const activeYear = currentDate.getFullYear();
  const activeMonth = currentDate.getMonth() + 1; // getMonth() returns 0-11

  // Fetch events for the current month
  const {
    data: eventsData,
    isLoading,
    error,
    isFetching,
    refetch,
  } = useFellowshipEvents(activeYear, activeMonth);

  // Transform events for React Big Calendar
  const calendarEvents: CalendarEvent[] = useMemo(() => {
    if (!eventsData?.events) return [];

    return eventsData.events.map((event) => ({
      id: event.id,
      title: event.title,
      start: new Date(event.eventDate),
      // Ensure end date exists for Big Calendar, even if same as start
      end: new Date(event.endDateTime || event.eventDate),
      resource: event,
      allDay: false,
    }));
  }, [eventsData?.events]);

  // Event handlers
  const handleSelectEvent = (event: CalendarEvent): void => {
    setSelectedEvent(event.resource);
    setShowModal(true);
    document.body.classList.add("overflow-hidden");
  };

  const handleCloseModal = (): void => {
    setShowModal(false);
    setSelectedEvent(null);
    document.body.classList.remove("overflow-hidden");
  };

  const handleNavigate = (date: Date): void => {
    setCurrentDate(date);
  };

  const handleViewChange = (newView: View): void => {
    setView(newView);
  };

  const handleRefresh = (): void => {
    refetch();
  };

  // Utility functions
  const formatDateTime = (dateString: string): string => {
    return moment(dateString).format("MMMM Do, YYYY [at] h:mm A");
  };

  const formatTime = (dateString: string): string => {
    return moment(dateString).format("h:mm A");
  };

  // Enhanced color mapping for event types
  const getEventTypeColor = (eventType: string): string => {
    const colors: Record<string, string> = {
      "weekly-service": "#3B82F6", // Tailwind blue-500
      "bible-study": "#10B981", // Tailwind emerald-500
      "prayer-meeting": "#8B5CF6", // Tailwind violet-500
      "fellowship-gathering": "#F59E0B", // Tailwind amber-500
      outreach: "#EF4444", // Tailwind red-500
      workshop: "#06B6D4", // Tailwind cyan-500
      conference: "#DC2626", // Tailwind red-600
      retreat: "#7C3AED", // Tailwind purple-600
      "special-service": "#DB2777", // Tailwind pink-600
      // Default color for unmapped types, using a shade of blue
      default: "#2563EB", // Tailwind blue-600
    };
    return colors[eventType] || colors.default;
  };

  const eventStyleGetter = (event: CalendarEvent) => {
    const backgroundColor = getEventTypeColor(event.resource.eventType);
    const borderColor = backgroundColor; // Use same color for border for a solid look
    const textColor = "white"; // Ensure text is readable on colored background

    return {
      style: {
        backgroundColor,
        borderColor,
        color: textColor,
        borderRadius: "6px", // Slightly more rounded corners for events
        opacity: 0.95, // Slight transparency
        border: "1px solid", // Add a subtle border
        fontSize: "0.875rem", // Slightly larger font for better readability
        padding: "4px 8px", // More padding
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)", // Subtle shadow
        transition: "all 0.2s ease-in-out", // Smooth transitions for hover
      },
    };
  };

  // Error state
  if (error && !eventsData) {
    return (
      <div className="max-w-7xl mx-auto p-4 sm:p-6 bg-gradient-to-br from-red-50 to-orange-100 rounded-xl shadow-xl mt-8">
        <div className="text-center py-8">
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-red-900 mb-3">
            Oops! Error Loading Events
          </h2>
          <p className="text-red-700 mb-6 leading-relaxed">
            {error instanceof Error
              ? `Error: ${error.message}. Please try again.`
              : "An unexpected error occurred while fetching events. Your connection might be unstable."}
          </p>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
            disabled={isFetching}
          >
            {isFetching ? (
              <Loader2 className="w-5 h-5 animate-spin mr-3" />
            ) : (
              <RefreshCw className="w-5 h-5 mr-3" />
            )}
            Retry Loading Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 mt-8 mb-8">
      {/* Header */}
      <div className="mb-8 p-4 bg-white rounded-xl shadow-md border border-blue-100">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
              Fellowship Events
            </h1>
            <p className="text-gray-700 text-lg">
              Explore our upcoming church events and activities.
            </p>
            {eventsData && (
              <p className="text-sm text-gray-500 mt-2">
                Showing{" "}
                <span className="font-semibold text-blue-600">
                  {eventsData.totalCount}
                </span>{" "}
                event{eventsData.totalCount !== 1 ? "s" : ""} in{" "}
                <span className="font-semibold text-blue-600">
                  {moment(currentDate).format("MMMM YYYY")}
                </span>
              </p>
            )}
          </div>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center px-5 py-2.5 text-base bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
            disabled={isFetching || isLoading}
          >
            {isFetching || isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : (
              <RefreshCw className="w-5 h-5 mr-2" />
            )}
            Refresh Events
          </button>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center py-20 bg-white rounded-xl shadow-md">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-6 text-blue-500" />
            <p className="text-gray-700 text-lg">
              Loading events for{" "}
              <span className="font-semibold">
                {moment(currentDate).format("MMMM YYYY")}
              </span>
              ...
            </p>
          </div>
        </div>
      )}

      {/* Calendar */}
      {!isLoading && (
        <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
          <div style={{ height: "650px" }} className="relative">
            {/* Background loading indicator during navigation */}
            {isFetching && (
              <div className="absolute top-4 right-4 z-10">
                <div className="bg-blue-500 text-white px-3 py-1.5 rounded-full text-sm flex items-center shadow-md">
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Updating...
                </div>
              </div>
            )}

            <Calendar
              localizer={localizer}
              events={calendarEvents}
              startAccessor="start"
              endAccessor="end"
              style={{ height: "100%" }}
              onSelectEvent={handleSelectEvent}
              eventPropGetter={eventStyleGetter}
              view={view}
              onView={handleViewChange}
              date={currentDate}
              onNavigate={handleNavigate}
              views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
              popup
              showMultiDayTimes
              step={30}
              timeslots={2}
              formats={{
                timeGutterFormat: "h:mm A",
                eventTimeRangeFormat: ({ start, end }) =>
                  `${moment(start).format("h:mm A")} - ${moment(end).format("h:mm A")}`,
              }}
              components={{
                toolbar: ({ label, onNavigate, onView, view: currentView }) => (
                  <div className="flex flex-col sm:flex-row justify-between items-center p-4 bg-gray-50 border-b border-gray-200">
                    <div className="flex items-center gap-3 mb-3 sm:mb-0">
                      <button
                        onClick={() => onNavigate("PREV")}
                        className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                        disabled={isLoading || isFetching}
                        aria-label="Previous month"
                      >
                        <ArrowRight className="w-5 h-5 rotate-180" />
                      </button>
                      <h2 className="text-xl font-bold text-gray-800 mx-2 sm:mx-4">
                        {label}
                      </h2>
                      <button
                        onClick={() => onNavigate("NEXT")}
                        className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                        disabled={isLoading || isFetching}
                        aria-label="Next month"
                      >
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA].map(
                        (viewName) => (
                          <button
                            key={viewName}
                            onClick={() => onView(viewName)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 shadow-sm
                              ${
                                currentView === viewName
                                  ? "bg-blue-600 text-white hover:bg-blue-700"
                                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                              }
                            `}
                            disabled={isLoading || isFetching}
                          >
                            {viewName.charAt(0).toUpperCase() +
                              viewName.slice(1)}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                ),
              }}
            />
          </div>
        </div>
      )}

      {/* Event Details Modal */}
      {showModal && selectedEvent && (
        <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", damping: 15, stiffness: 200 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform scale-100"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-blue-50 rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div
                  className="w-5 h-5 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor: getEventTypeColor(selectedEvent.eventType),
                  }}
                />
                <h3 className="text-2xl font-bold text-blue-800">
                  {selectedEvent.title}
                </h3>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200 shadow-sm"
                aria-label="Close event details"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Event Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-gray-700">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900 text-lg">
                      Date & Time
                    </p>
                    <p>{formatDateTime(selectedEvent.eventDate)}</p>
                    {selectedEvent.endDateTime && (
                      <p className="text-sm text-gray-600">
                        Ends: {formatTime(selectedEvent.endDateTime)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900 text-lg">
                      Location
                    </p>
                    <p>{selectedEvent.location?.venue || "To be confirmed"}</p>
                    {selectedEvent.location?.room && (
                      <p className="text-gray-600 text-sm">
                        Room: {selectedEvent.location.room}
                      </p>
                    )}
                    {selectedEvent.location?.googleMapsLink && (
                      <a
                        href={selectedEvent.location.googleMapsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm flex items-center mt-1"
                      >
                        View on Map <ArrowRight className="w-4 h-4 ml-1" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3 col-span-1 sm:col-span-2">
                  <Tag className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900 text-lg">
                      Event Type
                    </p>
                    <p className="capitalize text-blue-700 font-medium">
                      {selectedEvent.eventType?.replace("-", " ") ||
                        "General Event"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              {selectedEvent.description && (
                <div>
                  <h4 className="font-semibold text-gray-900 text-xl mb-3 mt-4">
                    About This Event
                  </h4>
                  <div className="prose prose-blue prose-lg max-w-none text-gray-800">
                    {renderDescription(selectedEvent.description)}
                  </div>
                </div>
              )}

              {/* Ministers/Speakers */}
              {selectedEvent.ministers &&
                selectedEvent.ministers.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 text-xl mb-3 mt-4">
                      Ministers/Speakers
                    </h4>
                    <div className="space-y-3">
                      {selectedEvent.ministers.map((minister, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg shadow-sm border border-blue-100"
                        >
                          <Users className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                          <div>
                            <p className="font-bold text-gray-900 text-lg">
                              {minister.name}
                            </p>
                            <p className="text-blue-700 text-sm capitalize font-medium">
                              {minister.role?.replace("-", " ") || "Speaker"}
                            </p>
                            {minister.bio && (
                              <div className="text-sm text-gray-700 mt-2 prose prose-sm max-w-none">
                                {renderDescription(minister.bio)}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default FellowshipCalendar;
