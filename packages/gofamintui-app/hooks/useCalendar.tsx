import { getEventsForCalendarQuery } from "@/sanity/queries/events";
import { sanityFetchWrapper } from "@/sanity/sanityCRUDHandlers";

import { useQuery } from "@tanstack/react-query"

export interface FellowshipEventsParams {
  year: number;
  month: number;
}
interface FellowshipEventsResponse {
  events: FellowshipEvent[];
  totalCount: number;
  year: number;
  month: number;
}
// API function to fetch events for a specific month
const fetchEventsForMonth = async ({
  year,
  month,
}: FellowshipEventsParams): Promise<FellowshipEventsResponse> => {
  const startDateTime = `${year}-${month.toString().padStart(2, "0")}-01T00:00:00Z`;

  // Calculate next month for end date
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;
  const endDateTime = `${nextYear}-${nextMonth.toString().padStart(2, "0")}-01T00:00:00Z`;

  const params = {
    startDateTime,
    endDateTime,
  };

  try {
    const events = await sanityFetchWrapper<FellowshipEvent[]>(
      getEventsForCalendarQuery,
      params
    );
    return {
      events,
      totalCount: events.length,
      year,
      month,
    };
  } catch (error) {
    console.error("Error fetching fellowship events:", error);
    throw new Error(
      `Failed to fetch events for ${year}-${month}: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
};

// Query key factory
export const fellowshipEventsKeys = {
  all: ["fellowshipEvents"] as const,
  byMonth: (year: number, month: number) =>
    [...fellowshipEventsKeys.all, year, month] as const,
};

// Main hook - simple and focused
export const useFellowshipEvents = (year: number, month: number) => {
  return useQuery({
    queryKey: fellowshipEventsKeys.byMonth(year, month),
    queryFn: () => fetchEventsForMonth({ year, month }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes (formerly cacheTime)
    refetchOnWindowFocus: false,
    retry: 2,
    enabled: !!(year && month && year > 0 && month >= 1 && month <= 12),
  });
};
