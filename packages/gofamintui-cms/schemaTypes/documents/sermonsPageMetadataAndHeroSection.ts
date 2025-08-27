import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'sermonsPageMetadataAndHero',
  title: 'Sermons Page Metadata and Herosection',
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
  ],
  preview: {
    select: {
      title: 'seo.title',
      media: 'seo.ogImage',
    },
  },
})
