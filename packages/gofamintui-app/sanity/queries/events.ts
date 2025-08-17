
export const getEventsForCalendarQuery = `*[_type == "fellowshipEvent" 
  && eventDate >= $startDateTime 
  && endDateTime <= $endDateTime && !(_id in path("drafts.**"))
] | order(eventDate asc) {
  _id,
  title,
  eventDate,
  endDateTime,
  slug,
  location,
  eventCategory,
  eventType
}`;
