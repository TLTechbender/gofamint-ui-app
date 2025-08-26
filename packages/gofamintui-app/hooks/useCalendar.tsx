import { FellowshipEvent } from "@/sanity/interfaces/fellowshipEvent";
import { getEventsForCalendarQuery } from "@/sanity/queries/fellowshipEvent";
import { sanityFetchWrapper } from "@/sanity/sanityCRUDHandlers";
import { useQuery } from "@tanstack/react-query";

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

const fetchEventsForMonth = async ({
  year,
  month,
}: FellowshipEventsParams): Promise<FellowshipEventsResponse> => {
  // Create proper ISO date strings with .000Z format
  const startDateTime = `${year}-${month.toString().padStart(2, "0")}-01T00:00:00.000Z`;

  // Calculate next month properly
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;
  const endDateTime = `${nextYear}-${nextMonth.toString().padStart(2, "0")}-01T00:00:00.000Z`;

  const params = {
    startDateTime,
    endDateTime,
  };

  try {
    const events = await sanityFetchWrapper<FellowshipEvent[]>(
      getEventsForCalendarQuery,
      params
    );
console.log('I fetched')
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


//Complicated key, the idea simple sha, if just anything, I mean anything changes we call the refetch
export const fellowshipEventsKeys = {
  all: ["fellowshipEvents"] as const,
  byMonth: (year: number, month: number) =>
    [...fellowshipEventsKeys.all, year, month] as const,
};

export const useCalendar = (year: number, month: number) => {
  return useQuery({
    queryKey: fellowshipEventsKeys.byMonth(year, month),
    queryFn: () => fetchEventsForMonth({ year, month }),
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 1 * 60 * 1000, // 1 minute
    refetchOnWindowFocus: false,
    retry: 2,
    enabled: !!(year && month && year > 0 && month >= 1 && month <= 12),
  });
};
