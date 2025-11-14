"use client";

import dynamic from "next/dynamic";

const DynamicFellowshipCalendar = dynamic(
  () => import("@/components/events/dynamicFellowshipCalendar"),
  {
    ssr: false, // This is now allowed in Client Components
    loading: () => (
      <div className="min-h-screen flex items-center justify-center bg-white rounded-xl shadow-sm p-8">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-lg text-black font-light">
            Loading Events Calendar...
          </p>
        </div>
      </div>
    ),
  }
);

export default function CalendarWrapper() {
  return <DynamicFellowshipCalendar />;
}
