import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'excecutives',
  title: 'Meet Them Excos',
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
          validation: (Rule) => Rule.required().min(15).max(160),
        }),
        defineField({
          name: 'keywords',
          title: 'Keywords',
          type: 'array',
          description: 'Helps search engines index the page',
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

    // Hero Section
    defineField({
      name: 'heroSection',
      title: 'Hero Section',
      type: 'object',
      fields: [
        defineField({
          name: 'title',
          title: 'Hero Title',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'subtitle',
          title: 'Hero Subtitle',
          type: 'text',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'image',
          title: 'Hero Image',
          type: 'image',
          options: {hotspot: true},
          validation: (rule) => rule.required(),
        }),
      ],
    }),

    // Overall Head Section
    defineField({
      name: 'overallHead',
      title: 'Overall Head',
      type: 'object',
      fields: [
        defineField({
          name: 'posterImage',
          title: 'Poster Image',
          type: 'image',
          options: {hotspot: true},
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'title',
          title: 'Title',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'subTitle',
          title: 'Subtitle',
          type: 'text',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'actionButtons',
          title: 'Action Buttons',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                defineField({name: 'buttonText', title: 'Button Text', type: 'string'}),
                defineField({name: 'buttonUrl', title: 'Button URL', type: 'url'}),
              ],
            },
          ],
        }),
      ],
    }),

    // Informational Text Section
    defineField({
      name: 'infoSection',
      title: 'Main Text Section',
      type: 'object',
      fields: [
        defineField({
          name: 'title',
          title: 'Title',
          type: 'string',
          validation: (r) => r.required(),
        }),
        defineField({
          name: 'subTitle',
          title: 'Subtitle',
          type: 'text',
          validation: (r) => r.required(),
        }),
      ],
    }),

    // Excos Section
    defineField({
      name: 'excosSection',
      title: 'Excos Section',
      type: 'object',
      fields: [
        defineField({
          name: 'title',
          title: 'Section Title',
          type: 'string',
          validation: (r) => r.required(),
        }),

        defineField({
          name: 'subTitle',
          title: 'Section Subtitle',
          type: 'string',
          validation: (r) => r.required(),
        }),
        defineField({
          name: 'excos',
          title: 'Excos',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                defineField({
                  name: 'picture',
                  title: 'Picture',
                  type: 'image',
                  options: {hotspot: true},
                }),
                defineField({name: 'name', title: 'Name', type: 'string'}),
                defineField({
                  name: 'operatingCapacity',
                  title: 'Operating Capacity',
                  type: 'string',
                }),
              ],
              preview: {
                select: {
                  title: 'name',
                  subtitle: 'operatingCapacity',
                  media: 'picture',
                },
              },
            },
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'heroSection.title',
      subtitle: 'heroSection.subtitle',
    },
  },
})
