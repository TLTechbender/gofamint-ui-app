import {defineField, defineType} from 'sanity'

export const user = defineType({
  name: 'user',
  title: 'Users',
  type: 'document',
  fields: [
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'phoneNumber',
      title: 'Phone Number',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'password',
      title: 'Password',
      type: 'string',
      hidden: true,
    }),
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
      name: 'dateOfBirth',
      title: 'Date of Birth',
      type: 'date',
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'text',
    }),
    defineField({
      name: 'hallOFResidence',
      title: 'Hall of residence',
      type: 'text',
    }),

    defineField({
      name: 'department',
      title: 'Department',
      type: 'text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'profileImage',
      title: 'Profile Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'isActive',
      title: 'Is Active',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'notificationPreferences',
      title: 'Notification Preferences',
      type: 'object',
      fields: [
        defineField({
          name: 'eventReminders',
          title: 'Event Reminders',
          type: 'boolean',
          initialValue: true,
        }),
        defineField({
          name: 'blogUpdates',
          title: 'Blog Updates',
          type: 'boolean',
          initialValue: true,
        }),
        defineField({
          name: 'generalAnnouncements',
          title: 'General Announcements',
          type: 'boolean',
          initialValue: true,
        }),
      ],
    }),
    defineField({
      name: 'emailVerified',
      title: 'Email Verified',
      type: 'datetime',
      hidden: true,
    }),
    defineField({
      name: 'emailVerificationToken',
      title: 'Email Verification Token',
      type: 'string',
      hidden: true,
    }),
    defineField({
      name: 'emailVerificationExpiry',
      title: 'Email Verification Expiry',
      type: 'datetime',
      hidden: true,
    }),
    defineField({
      name: 'resetToken',
      title: 'Reset Token',
      type: 'string',
      hidden: true,
    }),
    defineField({
      name: 'resetTokenExpiry',
      title: 'Reset Token Expiry',
      type: 'datetime',
      hidden: true,
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      hidden: true,
    }),
    defineField({
      name: 'updatedAt',
      title: 'Updated At',
      type: 'datetime',
      hidden: true,
    }),
  ],
  preview: {
    select: {
      title: 'firstName',
      subtitle: 'email',
      media: 'profileImage',
    },
    prepare(selection) {
      const {title, subtitle} = selection
      return {
        title: title,
        subtitle: subtitle,
      }
    },
  },
})
