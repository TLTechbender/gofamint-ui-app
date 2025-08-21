import {defineField, defineType} from 'sanity'

export const author = defineType({
  name: 'author',
  title: 'Author Details',
  type: 'document',
  fields: [
    // User data forwarded from my app database
    defineField({
      name: 'userId',
      title: 'User ID',
      type: 'string',
      readOnly: true, // Can't be edited in Sanity abeg make nobody spoil my chin chin abeg
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'email',
      readOnly: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'userName',
      title: 'Username',
      type: 'string',
      readOnly: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'firstName',
      title: 'First Name',
      type: 'string',
      readOnly: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'lastName',
      title: 'Last Name',
      type: 'string',
      readOnly: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'phoneNumber',
      title: 'Phone Number', //If available
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'userBio',
      title: 'User Bio', // If not empty
      type: 'text',
      readOnly: true,
      description: 'Bio from user profile',
    }),

    // Request metadata
    defineField({
      name: 'requestedAt',
      title: 'Requested At',
      type: 'datetime',
      readOnly: true,
      validation: (Rule) => Rule.required(),
    }),

    // Approval fields (editable by super user, this is very crucial sha)
    defineField({
      name: 'isApproved',
      title: 'Approved',
      type: 'boolean',
      initialValue: false,
      description: 'Toggle this to approve/reject the author request',
    }),

    defineField({
      name: 'approvedAt',
      title: 'Approved At',
      type: 'datetime',
    }),
    defineField({
      name: 'rejectionReason',
      title: 'Rejection Reason',
      type: 'text', //If you get rejected sha or something like that
      hidden: ({document}) => document?.isApproved === true,
    }),

    // Author profile fields (editable later)
    defineField({
      name: 'authorBio',
      title: 'Author Bio',
      type: 'text',
      description: 'Professional bio for author profile (Should be different from user bio)',
    }),
    defineField({
      name: 'profilePic',
      title: 'Profile Picture',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'socials',
      title: 'Social Media',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: [
                  {title: 'Twitter', value: 'twitter'},
                  {title: 'LinkedIn', value: 'linkedin'},
                  {title: 'Instagram', value: 'instagram'},
                  {title: 'Facebook', value: 'facebook'},
                  {title: 'GitHub', value: 'github'},
                  {title: 'Website', value: 'website'},
                ],
              },
            },
            {
              name: 'url',
              title: 'URL',
              type: 'url',
            },
            {
              name: 'handle',
              title: 'Handle',
              type: 'string',
              description: '@username (optional)',
            },
          ],
          preview: {
            select: {
              platform: 'platform',
              handle: 'handle',
              url: 'url',
            },
            prepare({platform, handle, url}) {
              return {
                title: platform,
                subtitle: handle || url,
              }
            },
          },
        },
      ],
    }),
  ],

  preview: {
    select: {
      firstName: 'firstName',
      lastName: 'lastName',
      email: 'email',
      isApproved: 'isApproved',
      requestedAt: 'requestedAt',
    },
    prepare({firstName, lastName, email, isApproved, requestedAt}) {
      const status = isApproved === true ? '✅' : isApproved === false ? '❌' : '⏳'
      return {
        title: `${firstName} ${lastName}`,
        subtitle: `${email} - ${status} - ${new Date(requestedAt).toLocaleDateString()}`,
      }
    },
  },
})
