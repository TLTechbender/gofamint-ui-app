import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'sermon',
  title: 'Sermon',
  type: 'document',

  fields: [
    defineField({
      name: 'posterImage',
      title: 'Poster Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required().error('Poster image is required'),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) =>
        Rule.required().min(5).max(200).error('Title must be between 5-200 characters'),
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      validation: (Rule) => Rule.required().error('Date is required'),
    }),
    defineField({
      name: 'duration',
      title: 'Duration (in minutes)',
      type: 'number',
      validation: (Rule) =>
        Rule.required().min(1).max(600).error('Duration must be between 1-300 minutes'),
    }),
    defineField({
      name: 'telegramLink',
      title: 'Telegram Link',
      type: 'url',
      validation: (Rule) =>
        Rule.required()
          .uri({
            scheme: ['http', 'https'],
          })
          .error('Please provide a valid Telegram URL'),
    }),
    defineField({
      name: 'googleDriveLink',
      title: 'Google Drive Link',
      type: 'url',
      validation: (Rule) =>
        Rule.required()
          .uri({
            scheme: ['http', 'https'],
          })
          .error('Please provide a valid Google Drive URL'),
    }),
  ],

  preview: {
    select: {
      title: 'title',
      date: 'date',
      media: 'posterImage',
      duration: 'duration',
    },
    prepare(selection) {
      const {title, date, media, duration} = selection
      return {
        title: title,
        subtitle: `${new Date(date).toLocaleDateString()} • ${duration} min`,
        media: media,
      }
    },
  },
})
