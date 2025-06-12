import {defineField, defineType} from 'sanity'

// First, create a separate author document type
export const author = defineType({
  name: 'author',
  title: 'Authors',
  type: 'document',
  fields: [
    defineField({
      name: 'firstName',
      title: 'First Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'lastName',
      title: 'Last Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'bio',
      title: 'Author Bio',
      type: 'text',
      description: 'Bio for this author',
      rows: 4,
    }),
    defineField({
      name: 'jobTitle',
      title: 'Job Title/Position',
      type: 'string',
      description: 'Professional title or position in the church',
    }),
    defineField({
      name: 'profileImage',
      title: 'Profile Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative Text',
          type: 'string',
          description: 'Alternative text for profile image',
        }),
      ],
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Media Links',
      type: 'object',
      fields: [
        defineField({
          name: 'instagram',
          title: 'Instagram',
          type: 'url',
          validation: (Rule) =>
            Rule.uri({
              scheme: ['http', 'https'],
            }),
        }),
        defineField({
          name: 'whatsapp',
          title: 'WhatsApp',
          type: 'string',
          description: 'WhatsApp number (include country code)',
        }),
        defineField({
          name: 'linkedin',
          title: 'LinkedIn',
          type: 'url',
          validation: (Rule) =>
            Rule.uri({
              scheme: ['http', 'https'],
            }),
        }),
        defineField({
          name: 'twitter',
          title: 'Twitter/X',
          type: 'url',
          validation: (Rule) =>
            Rule.uri({
              scheme: ['http', 'https'],
            }),
        }),
        defineField({
          name: 'facebook',
          title: 'Facebook',
          type: 'url',
          validation: (Rule) =>
            Rule.uri({
              scheme: ['http', 'https'],
            }),
        }),
        defineField({
          name: 'website',
          title: 'Personal Website',
          type: 'url',
          validation: (Rule) =>
            Rule.uri({
              scheme: ['http', 'https'],
            }),
        }),
      ],
    }),
  ],
  preview: {
    select: {
      firstName: 'firstName',
      lastName: 'lastName',
      media: 'profileImage',
    },
    prepare(selection) {
      const {firstName, lastName} = selection
      return {
        title: `${firstName} ${lastName}`,
      }
    },
  },
})