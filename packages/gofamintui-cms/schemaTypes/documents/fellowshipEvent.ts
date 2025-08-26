import {defineField, defineType} from 'sanity'

export const fellowshipEvent = defineType({
  name: 'fellowshipEvent',
  title: 'Fellowship Event',
  type: 'document',
  fields: [
    defineField({
      name: 'eventTitle',
      title: 'Event Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'eventSubtitle',
      title: 'Event Subtitle',
      type: 'string',
    }),
    defineField({
      name: 'startsAt',
      title: 'Event Starts At',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'endsAt',
      title: 'Event Ends At',
      type: 'datetime',
      validation: (Rule) =>
        Rule.required().custom((endsAt, context) => {
          const startsAt = context.document?.startsAt as string | undefined

          if (startsAt && endsAt && typeof endsAt === 'string') {
            const startDate = new Date(startsAt)
            const endDate = new Date(endsAt)

            if (endDate <= startDate) {
              return 'End date must be after start date'
            }
          }
          return true
        }),
    }),
    defineField({
      name: 'eventLocation',
      title: 'Event Location',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'eventDescription',
      title: 'Event Description',
      type: 'text',
      rows: 4,
    }),
  ],
  preview: {
    select: {
      title: 'eventTitle',
      subtitle: 'eventSubtitle',
      startsAt: 'startsAt',
    },
    prepare({title, subtitle, startsAt}) {
      return {
        title: title,
        subtitle: subtitle || new Date(startsAt).toLocaleDateString(),
      }
    },
  },
})
