import { defineField, defineType } from 'sanity'

export const author = defineType({
  name: 'author',
  title: 'Author Details',
  type: 'document',
  fields: [
    defineField({
      name: 'userDatabaseReferenceId',
      title: 'User Database Reference ID',
      type: 'string',
      readOnly: true,
      hidden: true,
      description: 'Links this author to a user in the main database',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'profilePic',
      title: 'Profile Picture',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
  ],

  preview: {
    select: {
      media: 'profilePic',
    },
    prepare({ media }) {
      return {
        title: 'Author Profile',
        media,
      }
    },
  },
})