// schemas/sermonsCollection.ts
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'sermons',
  title: 'Sermons',
  type: 'document',
  fields: [
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'object',
      validation: (Rule) => Rule.required(),
      fields: [
        defineField({
          name: 'title',
          title: 'Page Title',
          type: 'string',
          initialValue: "GSF UI – Gofamint Students' Fellowship, University of Ibadan",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'description',
          title: 'Meta Description',
          type: 'text',
          rows: 3,
          validation: (Rule) => Rule.required().min(50).max(160),
        }),
        defineField({
          name: 'keywords',
          title: 'Keywords',
          type: 'array',
          of: [{type: 'string'}],
          validation: (Rule) => Rule.required().min(5),
        }),
        defineField({
          name: 'ogImage',
          title: 'Social Media Image',
          type: 'image',
          options: {
            hotspot: true,
          },
          validation: (Rule) => Rule.required(),
        }),
      ],
    }), 


     defineField({
          name: 'heroSection',
          title: 'Hero Section',
          type: 'object',
          validation: (Rule) => Rule.required(),
          fields: [
            defineField({
              name: 'backgroundImage',
              title: 'Background Image',
              type: 'image',
              options: {
                hotspot: true,
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'title',
              title: 'Hero Title',
              type: 'string',
              validation: (Rule) => Rule.required().min(10),
            }),
            defineField({
              name: 'subtitle',
              title: 'Hero Subtitle',
              type: 'string',
              validation: (Rule) => Rule.required().min(10),
            }),
         
          ],
        }),

    // Array of sermons
    defineField({
      name: 'sermons',
      title: 'Sermons',
      type: 'array',
      of: [
        {
          type: 'object',
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
              type: 'datetime',
              validation: (Rule) => Rule.required().error('Date is required'),
            }),
            defineField({
              name: 'duration',
              title: 'Duration (in minutes)',
              type: 'number',
              validation: (Rule) =>
                Rule.required().min(1).max(300).error('Duration must be between 1-300 minutes'),
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
            defineField({
              name: 'slug',
              title: 'Slug',
              type: 'slug',
              options: {
                source: 'title',
                maxLength: 96,
              },
              validation: (Rule) => Rule.required().error('Slug is required for URL generation'),
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
        },
      ],
      options: {
        insertMenu: {
          filter: true,
          showIcons: true,
        },
      },
    }),
  ],

  preview: {
    select: {
      title: 'seo.title',
      sermonCount: 'sermons',
    },
    prepare(selection) {
      const {title, sermonCount} = selection
      const count = Array.isArray(sermonCount) ? sermonCount.length : 0
      return {
        title: `${title} - Sermons`,
        subtitle: `${count} sermons`,
      }
    },
  },
})
