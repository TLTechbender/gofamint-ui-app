"use client";
/**
 * To be very honest if you ask me, Bolarinwa how far nha how is this calendar working, I don't think I would be able to defend my code oo
 * I tried many calendars out before using react big calendar, bro it was tuff, but react big calender it was obvious that it was made with a lot of forward thinking, damn!!!
 */
import React, { useState, useMemo } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import type { View } from "react-big-calendar";
import {
  Clock,
  MapPin,
  X,
  Loader2,
  RefreshCw,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import "react-big-calendar/lib/css/react-big-calendar.css";

/**
 * Update:
 * Oversabi wan kill mosquite sha, can't believe I was using framer motion for this sha, who send me oooo!!!!
 *
 * Works nice, but maybe I could have tailwinded my way out of it bro!!
 */
import { motion, AnimatePresence } from "framer-motion";

import { useCalendar } from "@/hooks/useCalendar";
import { FellowshipEvent } from "@/sanity/interfaces/fellowshipEvent";

const localizer = momentLocalizer(moment);

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: FellowshipEvent;
  allDay: boolean;
}

const DynamicFellowshpCalendar = () => {
  const [selectedEvent, setSelectedEvent] = useState<FellowshipEvent | null>(
    null
  );
  const [showModal, setShowModal] = useState<boolean>(false);
  const [view, setView] = useState<View>(Views.MONTH);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  const activeYear = currentDate.getFullYear();
  const activeMonth = currentDate.getMonth() + 1;

  const {
    data: eventsResponse,
    isLoading,
    error,
    isFetching,
    refetch,
  } = useCalendar(activeYear, activeMonth);
  console.log(eventsResponse);
  // Transform events for React Big Calendar
  const calendarEvents: CalendarEvent[] = useMemo(() => {
    if (!eventsResponse?.events) return [];

    return eventsResponse.events.map((event) => ({
      id: event._id,
      title: event.eventTitle,
      start: new Date(event.startsAt),
      end: new Date(event.endsAt),
      resource: event,
      allDay: false,
    }));
  }, [eventsResponse?.events]);

  const eventStyleGetter = (event: CalendarEvent) => {
    return {
      style: {
        backgroundColor: "#4169E1", // Royal blue, abi no be wetin tumex talk??
        borderColor: "#4169E1",
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

  if (error && !eventsResponse) {
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
            onClick={() => refetch()}
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
      <div className="mb-12">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-px bg-blue-400"></div>
          <span className="text-sm font-medium text-blue-400 uppercase tracking-widest">
            Fellowship Calendar
          </span>
        </div>
        <h1 className="text-4xl font-light text-black mb-4">Upcoming Events</h1>
        {eventsResponse && (
          <p className="text-gray-600 font-light">
            {eventsResponse.totalCount} event
            {eventsResponse.totalCount !== 1 ? "s" : ""} in{" "}
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
                      style={{ backgroundColor: "#4169E1" }}
                    />
                    <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                      Fellowship Event
                    </span>
                  </div>
                  <h2 className="text-2xl font-light text-black leading-tight">
                    {selectedEvent.eventTitle}
                  </h2>
                  {selectedEvent.eventSubtitle && (
                    <p className="text-lg text-gray-600 font-light mt-2">
                      {selectedEvent.eventSubtitle}
                    </p>
                  )}
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
                        {formatDateTime(selectedEvent.startsAt)}
                      </p>
                      <p className="text-gray-500 font-light text-sm">
                        Ends: {formatTime(selectedEvent.endsAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-black mb-1">Location</p>
                      <p className="text-gray-600 font-light text-sm">
                        {selectedEvent.eventLocation}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {selectedEvent.eventDescription && (
                  <div className="mb-8">
                    <h3 className="font-medium text-black mb-4">
                      About This Event
                    </h3>
                    <div className="prose prose-sm max-w-none">
                      <p className="text-gray-600 font-light leading-relaxed">
                        {selectedEvent.eventDescription}
                      </p>
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

export default DynamicFellowshpCalendar;
