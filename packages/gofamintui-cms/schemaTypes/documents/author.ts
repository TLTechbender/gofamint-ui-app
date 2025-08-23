import {defineField, defineType} from 'sanity'

type ApplicationStatus = 'pending'  | 'approved' | 'rejected' 

const APPLICATION_STATUSES: Array<{title: string; value: ApplicationStatus}> = [
  {title: 'Pending Review', value: 'pending'},

  {title: 'Approved', value: 'approved'},
  { title: 'Rejected', value: 'rejected' },

]

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
      name: 'application',
      title: 'Author Application',
      type: 'object',
      validation: (Rule) => Rule.required().error('Application details are required'),
      fields: [
        defineField({
          name: 'isApproved',
          title: 'Approved',
          type: 'boolean',
          initialValue: false,
          description: 'Toggle this to approve/reject the author request',
        }),
        defineField({
          name: 'status',
          title: 'Application Status',
          type: 'string',
          options: {
            list: APPLICATION_STATUSES,
            layout: 'radio',
          },
          initialValue: 'pending' as ApplicationStatus,
          validation: (Rule) => Rule.required().error('Application status is required'),
        }),

        defineField({
          name: 'approvedAt',
          title: 'Approved At',
          type: 'datetime',
        }),
        defineField({
          name: 'rejectionReason',
          title: 'Rejection Reason',
          type: 'text',
          hidden: ({document}) => {
            const status = document?.status as ApplicationStatus
            return status !== 'rejected' || document?.isApproved !== false
          },
          validation: (Rule) =>
            Rule.custom((value, context) => {
              const {document} = context
              const status = document?.status as ApplicationStatus

              const isVisible = status === 'rejected' && document?.isApproved === false

              if (isVisible && !value) {
                return 'Rejection reason is required when application is rejected'
              }
              return true
            }),
        }),
      ],
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
