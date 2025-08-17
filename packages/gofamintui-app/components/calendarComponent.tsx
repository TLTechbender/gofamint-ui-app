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
  X,
  Loader2,
  RefreshCw,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { motion, AnimatePresence } from "framer-motion";

import { useFellowshipEvents } from "@/hooks/useCalendar";

const localizer = momentLocalizer(moment);

// Clean, minimal portable text components
const minimalPortableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mb-4 text-black leading-relaxed font-light">{children}</p>
    ),
    h1: ({ children }) => (
      <h1 className="text-2xl font-light text-black mb-6 mt-8">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-xl font-light text-black mb-4 mt-6">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-lg font-medium text-black mb-3 mt-4">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-blue-400 pl-6 py-4 my-6 text-black font-light bg-blue-50/30">
        {children}
      </blockquote>
    ),
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      const imageUrl =
        value.asset.url || `/api/placeholder/800/400?text=Image+Missing`;
      return (
        <div className="my-6">
          <img
            src={imageUrl}
            alt={value.alt || ""}
            className="w-full rounded-lg"
          />
          {value.alt && (
            <p className="text-sm text-gray-500 mt-2 text-center font-light">
              {value.alt}
            </p>
          )}
        </div>
      );
    },
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-medium text-black">{children}</strong>
    ),
    em: ({ children }) => <em className="italic font-light">{children}</em>,
    link: ({ value, children }) => {
      const target = (value?.href || "").startsWith("http")
        ? "_blank"
        : undefined;
      return (
        <a
          href={value?.href}
          target={target}
          rel={target === "_blank" ? "noopener noreferrer" : undefined}
          className="text-blue-500 hover:text-blue-600 underline underline-offset-2 transition-colors"
        >
          {children}
        </a>
      );
    },
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-4 ml-0 space-y-2 list-none">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="mb-4 ml-0 space-y-2">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="text-black font-light flex items-start">
        <span className="inline-block w-1.5 h-1.5 bg-blue-400 rounded-full mt-2.5 mr-3 flex-shrink-0"></span>
        <span>{children}</span>
      </li>
    ),
    number: ({ children }) => (
      <li className="text-black font-light">{children}</li>
    ),
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
      <PortableText
        value={description}
        components={minimalPortableTextComponents}
      />
    );
  }

  return <p className="text-black font-light leading-relaxed">{description}</p>;
};

// Event interfaces
interface FellowshipEvent {
  id: string;
  title: string;
  eventDate: string;
  endDateTime?: string;
  location?: {
    venue?: string;
    room?: string;
    address?: string;
    googleMapsLink?: string;
  };
  eventType: string;
  ministers?: Array<{
    name: string;
    role?: string;
    bio?: string | PortableTextBlock[];
  }>;
  description?: string | PortableTextBlock[];
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
  const activeMonth = currentDate.getMonth() + 1;

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

  // Minimal event styling - clean and professional
  const getEventTypeColor = (eventType: string): string => {
    const colors: Record<string, string> = {
      "weekly-service": "#4169E1", // Royal blue
      "bible-study": "#059669", // Emerald
      "prayer-meeting": "#7C3AED", // Violet
      "fellowship-gathering": "#DC2626", // Red
      outreach: "#EA580C", // Orange
      workshop: "#0891B2", // Cyan
      conference: "#BE185D", // Pink
      retreat: "#7C2D12", // Brown
      "special-service": "#374151", // Gray
      default: "#4169E1",
    };
    return colors[eventType] || colors.default;
  };

  const eventStyleGetter = (event: CalendarEvent) => {
    const backgroundColor = getEventTypeColor(event.resource.eventType);

    return {
      style: {
        backgroundColor,
        borderColor: backgroundColor,
        color: "white",
        border: "none",
        borderRadius: "4px",
        fontSize: "0.875rem",
        fontWeight: "400",
        padding: "2px 8px",
        boxShadow: "none",
        opacity: 1,
      },
    };
  };

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

  const formatDateTime = (dateString: string): string => {
    return moment(dateString).format("MMMM Do, YYYY [at] h:mm A");
  };

  const formatTime = (dateString: string): string => {
    return moment(dateString).format("h:mm A");
  };

  // Error state - minimal and clean
  if (error && !eventsData) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-light text-black mb-3">
            Unable to load events
          </h2>
          <p className="text-gray-600 mb-6 font-light">
            Please check your connection and try again.
          </p>
          <button
            onClick={refetch}
            className="inline-flex items-center px-6 py-3 bg-black text-white font-light rounded-lg hover:bg-gray-800 transition-colors"
            disabled={isFetching}
          >
            {isFetching ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Clean Header */}
      <div className="mb-12">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-px bg-blue-400"></div>
          <span className="text-sm font-medium text-blue-400 uppercase tracking-widest">
            Fellowship Calendar
          </span>
        </div>
        <h1 className="text-4xl font-light text-black mb-4">Upcoming Events</h1>
        {eventsData && (
          <p className="text-gray-600 font-light">
            {eventsData.totalCount} event
            {eventsData.totalCount !== 1 ? "s" : ""} in{" "}
            {moment(currentDate).format("MMMM YYYY")}
          </p>
        )}
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-400" />
            <p className="text-gray-600 font-light">Loading events...</p>
          </div>
        </div>
      )}

      {/* Clean Calendar */}
      {!isLoading && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div style={{ height: "700px" }} className="relative">
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
              views={[Views.MONTH, Views.WEEK, Views.DAY]}
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
                  <div className="flex flex-col sm:flex-row justify-between items-center p-6 bg-white border-b border-gray-200">
                    <div className="flex items-center gap-4 mb-4 sm:mb-0">
                      <button
                        onClick={() => onNavigate("PREV")}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        disabled={isLoading || isFetching}
                      >
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                      </button>
                      <h2 className="text-xl font-light text-black min-w-[200px] text-center">
                        {label}
                      </h2>
                      <button
                        onClick={() => onNavigate("NEXT")}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        disabled={isLoading || isFetching}
                      >
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                    <div className="flex gap-1">
                      {[Views.MONTH, Views.WEEK, Views.DAY].map((viewName) => (
                        <button
                          key={viewName}
                          onClick={() => onView(viewName)}
                          className={`px-4 py-2 rounded-lg text-sm font-light transition-colors
                            ${
                              currentView === viewName
                                ? "bg-black text-white"
                                : "text-gray-600 hover:text-black hover:bg-gray-50"
                            }
                          `}
                          disabled={isLoading || isFetching}
                        >
                          {viewName.charAt(0).toUpperCase() + viewName.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                ),
              }}
            />
          </div>
        </div>
      )}

      {/* Professional Modal */}
      <AnimatePresence>
        {showModal && selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between p-6 border-b border-gray-200">
                <div className="flex-1 pr-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{
                        backgroundColor: getEventTypeColor(
                          selectedEvent.eventType
                        ),
                      }}
                    />
                    <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                      {selectedEvent.eventType.replace("-", " ")}
                    </span>
                  </div>
                  <h2 className="text-2xl font-light text-black leading-tight">
                    {selectedEvent.title}
                  </h2>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {/* Event Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                  <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-black mb-1">Date & Time</p>
                      <p className="text-gray-600 font-light text-sm">
                        {formatDateTime(selectedEvent.eventDate)}
                      </p>
                      {selectedEvent.endDateTime && (
                        <p className="text-gray-500 font-light text-sm">
                          Ends: {formatTime(selectedEvent.endDateTime)}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-black mb-1">Location</p>
                      <p className="text-gray-600 font-light text-sm">
                        {selectedEvent.location?.venue || "Location TBA"}
                      </p>
                      {selectedEvent.location?.room && (
                        <p className="text-gray-500 font-light text-sm">
                          {selectedEvent.location.room}
                        </p>
                      )}
                      {selectedEvent.location?.googleMapsLink && (
                        <a
                          href={selectedEvent.location.googleMapsLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-500 hover:text-blue-600 text-sm font-light mt-1 transition-colors"
                        >
                          View on Map <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Description */}
                {selectedEvent.description && (
                  <div className="mb-8">
                    <h3 className="font-medium text-black mb-4">
                      About This Event
                    </h3>
                    <div className="prose prose-sm max-w-none">
                      {renderDescription(selectedEvent.description)}
                    </div>
                  </div>
                )}

                {/* Ministers/Speakers */}
                {selectedEvent.ministers &&
                  selectedEvent.ministers.length > 0 && (
                    <div>
                      <h3 className="font-medium text-black mb-4">Speakers</h3>
                      <div className="space-y-4">
                        {selectedEvent.ministers.map((minister, index) => (
                          <div
                            key={index}
                            className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg"
                          >
                            <Users className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium text-black">
                                {minister.name}
                              </p>
                              {minister.role && (
                                <p className="text-gray-500 font-light text-sm capitalize">
                                  {minister.role.replace("-", " ")}
                                </p>
                              )}
                              {minister.bio && (
                                <div className="text-sm text-gray-600 mt-2 prose prose-sm max-w-none">
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FellowshipCalendar;
