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
} from "lucide-react";
import "react-big-calendar/lib/css/react-big-calendar.css";


import { useFellowshipEvents } from "@/hooks/useCalendar";

const localizer = momentLocalizer(moment);

// Portable Text components for rich text rendering
const portableTextComponents: PortableTextComponents = {
  block: {
    // Default paragraph
    normal: ({ children }) => (
      <p className="mb-4 text-gray-700 leading-relaxed">{children}</p>
    ),
    // Headers
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
    // Blockquote
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-blue-500 pl-6 py-4 my-6 italic text-gray-800 bg-blue-50 rounded-r-lg">
        {children}
      </blockquote>
    ),
  },
  types: {
    // Custom image component
    image: ({ value }) => {
      if (!value?.asset) return null;

      return (
        <div className="my-8">
          <img
            src={value.asset.url || "/api/placeholder/800/400"}
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
    // Custom callout component (if you use it)
    callout: ({ value }) => (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-6 rounded-r-lg">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-yellow-700">{value.text}</p>
          </div>
        </div>
      </div>
    ),
    // Custom code block component (if you use it)
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
    // Bold text
    strong: ({ children }) => (
      <strong className="font-semibold text-gray-900">{children}</strong>
    ),
    // Italic text
    em: ({ children }) => <em className="italic">{children}</em>,
    // Links
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
    // Inline code
    code: ({ children }) => (
      <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono">
        {children}
      </code>
    ),
  },
  list: {
    // Bullet lists
    bullet: ({ children }) => (
      <ul className="list-disc list-inside mb-4 ml-4 space-y-2">{children}</ul>
    ),
    // Numbered lists
    number: ({ children }) => (
      <ol className="list-decimal list-inside mb-4 ml-4 space-y-2">
        {children}
      </ol>
    ),
  },
  listItem: {
    // List items
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

// Calendar event type for react-big-calendar
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

  const getEventTypeColor = (eventType: string): string => {
    const colors: Record<string, string> = {
      "weekly-service": "#3B82F6",
      "bible-study": "#10B981",
      "prayer-meeting": "#8B5CF6",
      "fellowship-gathering": "#F59E0B",
      outreach: "#EF4444",
      workshop: "#06B6D4",
      conference: "#DC2626",
      retreat: "#7C3AED",
      "special-service": "#DB2777",
    };
    return colors[eventType] || "#6B7280";
  };

  const eventStyleGetter = (event: CalendarEvent) => {
    const backgroundColor = getEventTypeColor(event.resource.eventType);
    return {
      style: {
        backgroundColor,
        borderRadius: "4px",
        opacity: 0.9,
        color: "white",
        border: "0px",
        display: "block",
        fontSize: "0.85em",
        padding: "2px 4px",
      },
    };
  };

  // Error state
  if (error && !eventsData) {
    return (
      <div className="max-w-7xl mx-auto p-4 sm:p-6 bg-white">
        <div className="text-center py-8">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Failed to Load Events
          </h2>
          <p className="text-red-600 mb-4">
            {error instanceof Error
              ? error.message
              : "An error occurred while fetching events"}
          </p>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            disabled={isFetching}
          >
            {isFetching ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 bg-white">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
              Fellowship Calendar
            </h1>
            <p className="text-gray-600">
              Stay connected with our church events and activities
            </p>
            {eventsData && (
              <p className="text-sm text-gray-500 mt-1">
                {eventsData.totalCount} events in{" "}
                {moment(currentDate).format("MMMM YYYY")}
              </p>
            )}
          </div>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            disabled={isFetching}
          >
            {isFetching ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Refresh
          </button>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
            <p className="text-gray-600">
              Loading events for {moment(currentDate).format("MMMM YYYY")}...
            </p>
          </div>
        </div>
      )}

      {/* Calendar */}
      {!isLoading && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div style={{ height: "600px" }} className="relative">
            {/* Background loading indicator */}
            {isFetching && (
              <div className="absolute top-2 right-2 z-10">
                <div className="bg-blue-500 text-white px-2 py-1 rounded text-xs flex items-center">
                  <Loader2 className="w-3 h-3 animate-spin mr-1" />
                  Loading...
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
                  <div className="flex flex-col sm:flex-row justify-between items-center p-4 bg-gray-50 border-b">
                    <div className="flex items-center gap-2 mb-2 sm:mb-0">
                      <button
                        onClick={() => onNavigate("PREV")}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
                        disabled={isLoading}
                      >
                        ←
                      </button>
                      <h2 className="text-lg font-semibold text-gray-800 mx-4">
                        {label}
                      </h2>
                      <button
                        onClick={() => onNavigate("NEXT")}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
                        disabled={isLoading}
                      >
                        →
                      </button>
                    </div>
                    <div className="flex gap-2">
                      {[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA].map(
                        (viewName) => (
                          <button
                            key={viewName}
                            onClick={() => onView(viewName)}
                            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                              currentView === viewName
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
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
        <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{
                    backgroundColor: getEventTypeColor(selectedEvent.eventType),
                  }}
                />
                <h3 className="text-xl font-semibold text-gray-800">
                  {selectedEvent.title}
                </h3>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Event Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-800">Date & Time</p>
                    <p className="text-gray-600">
                      {formatDateTime(selectedEvent.eventDate)}
                    </p>
                    {selectedEvent.endDateTime && (
                      <p className="text-gray-600">
                        Ends: {formatTime(selectedEvent.endDateTime)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-800">Location</p>
                    <p className="text-gray-600">
                      {selectedEvent.location?.venue || "TBD"}
                    </p>
                    {selectedEvent.location?.room && (
                      <p className="text-gray-600 text-sm">
                        {selectedEvent.location.room}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Tag className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-800">Event Type</p>
                    <p className="text-gray-600 capitalize">
                      {selectedEvent.eventType?.replace("-", " ") || "General"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              {selectedEvent.description && (
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">
                    Description
                  </h4>
                  <div className="prose prose-sm max-w-none">
                    {renderDescription(selectedEvent.description)}
                  </div>
                </div>
              )}

              {/* Ministers/Speakers */}
              {selectedEvent.ministers &&
                selectedEvent.ministers.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-800 mb-3">Speakers</h4>
                    <div className="space-y-2">
                      {selectedEvent.ministers.map((minister, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                        >
                          <Users className="w-4 h-4 text-gray-500" />
                          <div>
                            <p className="font-medium text-gray-800">
                              {minister.name}
                            </p>
                            <p className="text-sm text-gray-600 capitalize">
                              {minister.role?.replace("-", " ") || "Speaker"}
                            </p>
                            {minister.bio && (
                              <div className="text-sm text-gray-500 mt-1 prose prose-xs max-w-none">
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
          </div>
        </div>
      )}
    </div>
  );
};

export default FellowshipCalendar;
