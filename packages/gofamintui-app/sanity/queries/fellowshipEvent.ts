export const getEventsForCalendarQuery = `*[_type == "fellowshipEvent"
  && startsAt < $endDateTime
  && endsAt >= $startDateTime
  && !(_id in path("drafts.**"))
] | order(startsAt asc) {
  _id,
  _type,
  _createdAt,
  _updatedAt,
  _rev,
  eventTitle,
  eventSubtitle,
  startsAt,
  endsAt,
  eventLocation,
  eventDescription
}`;
