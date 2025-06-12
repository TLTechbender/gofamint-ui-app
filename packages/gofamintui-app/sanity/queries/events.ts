export const getEventsForCalendarQuery = `
*[_type == "fellowshipEvent" && 
  dateTime(eventDate) >= dateTime($startDateTime) && 
  dateTime(eventDate) < dateTime($endDateTime) &&
  isPublished == true
] | order(eventDate asc) {
  _id,
  title,
  slug,
  eventDate,
  endDateTime,
  eventType,
  eventCategory,
  description,
  location,
  ministers,
  specialEventDetails,
  dressCode,
  requirements,
  contact,
  featuredImage,
  gallery,
  isRecurring,
  recurrencePattern,
  priority,
  isPublished,
  isFeatured
}
`;
