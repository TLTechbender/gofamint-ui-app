import {defineField, defineType} from 'sanity'

export const author = defineType({
  name: 'author',
  title: 'Authors',
  type: 'document',
  fields: [
    defineField({
      name: 'userId',
      title: 'User ID (from our DB)',
      type: 'string',
      description: 'Reference to user in SQLite database (please do not touch this at all)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'displayName',
      title: 'Display Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'isActive',
      title: 'Active Author',
      type: 'boolean',
      initialValue: false,
      description: 'Toggle to approve/revoke author permissions',
    }),

    defineField({
      name: 'avatar',
      title: 'Avatar',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Author profile picture',
    }),

    defineField({
      name: 'requestedAt',
      title: 'Requested At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'approvedAt',
      title: 'Approved At',
      type: 'datetime',
    }),
  ],
  preview: {
    select: {
      title: 'displayName',
      userId: 'userId',
      isActive: 'isActive',
      media: 'avatar',
    },
    prepare({title, userId, isActive}) {
      const status = isActive ? '✅ Active' : '⏳ Pending'
      return {
        title: title,
      }
    },
  },
})
