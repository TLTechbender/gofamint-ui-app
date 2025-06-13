import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'contactInfo',
  title: 'Contact Information',
  type: 'document',
  fields: [
    
    defineField({
      name: 'fellowshipName',
      title: 'Fellowship Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'address',
      title: 'Fellowship Address',
      type: 'object',
      fields: [
        defineField({
          name: 'street',
          title: 'Street Address',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'city',
          title: 'City',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'state',
          title: 'State',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'country',
          title: 'Country',
          type: 'string',
          initialValue: 'Nigeria',
        }),
      ],
    }),
    defineField({
      name: 'directions',
      title: 'Directions to Fellowship',
      type: 'text',
      description: 'Detailed directions on how to get to the fellowship',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'landmarks',
      title: 'Notable Landmarks',
      type: 'text',
      description: 'Nearby landmarks to help people find the location',
    }),
    defineField({
      name: 'googleMapsLink',
      title: 'Google Maps Link',
      type: 'url',
      description: 'Direct link to Google Maps location',
    }),
    defineField({
      name: 'contactPhone',
      title: 'Contact Phone Number',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'socialMedia',
      title: 'Social Media Links',
      type: 'object',
      fields: [
        defineField({
          name: 'facebook',
          title: 'Facebook',
          type: 'url',
        }),
        defineField({
          name: 'instagram',
          title: 'Instagram',
          type: 'url',
        }),
        defineField({
          name: 'twitter',
          title: 'Twitter/X',
          type: 'url',
        }),
        defineField({
          name: 'youtube',
          title: 'YouTube',
          type: 'url',
        }),
        defineField({
          name: 'whatsapp',
          title: 'WhatsApp',
          type: 'string',
          description: 'WhatsApp number with country code',
        }),
        defineField({
          name: 'tiktok',
          title: 'TikTok',
          type: 'url',
        }),
      ],
    }),
    defineField({
      name: 'serviceHours',
      title: 'Service Times',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'day',
              title: 'Day',
              type: 'string',
              options: {
                list: [
                  'Monday',
                  'Tuesday',
                  'Wednesday',
                  'Thursday',
                  'Friday',
                  'Saturday',
                  'Sunday',
                ],
              },
            }),
            defineField({
              name: 'time',
              title: 'Service Time',
              type: 'string',
            }),
            defineField({
              name: 'serviceType',
              title: 'Service Type',
              type: 'string',
              options: {
                list: [
                  'Sunday Service',
                  'Prayer Meeting',
                  'Bible Study',
                  'Youth Service',
                  'Workers Meeting',
                ],
              },
            }),
            defineField({
              name: 'posterImage',
              title: 'Service Poster Image',
              type: 'image',
              description: 'Upload a poster image that represents this service',
              options: {
                hotspot: true,
              },
              fields: [
                defineField({
                  name: 'alt',
                  title: 'Alternative Text',
                  type: 'string',
                  description: 'Important for accessibility and SEO',
                }),
              ],
            }),
            defineField({
              name: 'description',
              title: 'Service Description',
              type: 'text',
              description: 'Brief description of what happens in this service',
              rows: 3,
            }),
          ],
          preview: {
            select: {
              title: 'serviceType',
              subtitle: 'day',
              time: 'time',
              media: 'posterImage',
            },
            prepare(selection) {
              const {title, subtitle, time, media} = selection
              return {
                title: title || 'Service',
                subtitle: `${subtitle} - ${time}`,
                media: media,
              }
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'fellowshipName',
      subtitle: 'contactPhone',
    },
  },
})
