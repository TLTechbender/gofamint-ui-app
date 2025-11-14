import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'blogsPage',
  title: 'Blogs Page',
    type: 'document',
  description: "This is different from Blog posts this here is for seo title and things like that oooooooooooo",
  fields: [
    //Seo section of the home page
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

    // Hero Section
    defineField({
      name: 'heroSection',
      title: 'Hero Section',
      type: 'object',
      validation: (Rule) => Rule.required(),
      fields: [
        defineField({
          name: 'backgroundImage',
          title: 'Hero Background Image',
          type: 'image',
          description:
            'This image serves as the background for the hero section',
          options: {
            hotspot: true,
          },
          validation: (Rule) => Rule.required(),
        }),
     
        defineField({
          name: 'title',
          title: 'Hero Title',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'subtitle',
          title: 'Hero Subtitle',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
      
      ],
    }),

  ],
  preview: {
    select: {
      title: 'seo.title',
      media: 'seo.ogImage',
    },
    prepare(selection) {
      return {
        title: selection.title || 'Blogs Page',
        media: selection.media,
      }
    },
  },
})
