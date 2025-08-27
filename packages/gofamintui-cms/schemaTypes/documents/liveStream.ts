import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'liveStream',
  title: 'Live Streams',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Stream Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'platform',
      title: 'Streaming Platform',
      type: 'string',
      options: {
        list: [
          {title: 'YouTube', value: 'youtube'},
          {title: 'Facebook', value: 'facebook'},
          {title: 'Instagram', value: 'instagram'},
          {title: 'Vimeo', value: 'vimeo'},
          {title: 'Twitch', value: 'twitch'},
          {title: 'Custom', value: 'custom'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'streamUrl',
      title: 'Stream URL',
      type: 'url',
      description: 'Direct link to the live stream',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'embedCode',
      title: 'Embed Code (Optional)',
      type: 'text',
      description: 'HTML embed code if needed for custom integration',
    }),
    defineField({
      name: 'scheduledStart',
      title: 'Scheduled Start Time',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'scheduledEnd',
      title: 'Scheduled End Time',
      type: 'datetime',
      validation: (Rule) =>
        Rule.required().custom((scheduledEnd, context) => {
          const scheduledStart = context.document?.scheduledStart as string | undefined

          if (scheduledStart && scheduledEnd && typeof scheduledEnd === 'string') {
            const startDate = new Date(scheduledStart)
            const endDate = new Date(scheduledEnd)

            if (endDate <= startDate) {
              return 'End date must be after start date'
            }
          }
          return true
        }),
    }),
    defineField({
      name: 'isLive',
      title: 'Currently Live',
      type: 'boolean',
      initialValue: false,
      description: 'Toggle this when stream goes live',
    }),
    defineField({
      name: 'category',
      title: 'Service Type',
      type: 'string',
      options: {
        list: [
          {title: 'Sunday Service', value: 'service'},
          {title: 'Prayer Meeting', value: 'prayer'},
          {title: 'Bible Study', value: 'study'},
          {title: 'Youth Service', value: 'youth'},
          {title: 'Special Event', value: 'event'},
          {title: 'Conference', value: 'conference'},
        ],
      },
    }),
    defineField({
      name: 'thumbnail',
      title: 'Stream Thumbnail',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Preview image for the stream',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'pastor',
      title: 'Pastor/Speaker',
      type: 'string',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'platform',
      media: 'thumbnail',
    },
    prepare({title, subtitle, media}) {
      return {
        title,
        subtitle: `${subtitle} Stream`,
        media,
      }
    },
  },
})
