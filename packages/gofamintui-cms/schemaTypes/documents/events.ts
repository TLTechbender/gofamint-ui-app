import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'fellowshipEvent',
  title: 'Fellowship Event',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Event Title',
      type: 'string',
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'eventDate',
      title: 'Event Date & Time',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
      description: 'Full date and time of the event',
    }),
    defineField({
      name: 'endDateTime',
      title: 'End Date & Time',
      type: 'datetime',
      description: 'When the event ends (optional if duration is specified)',
    }),
    defineField({
      name: 'duration',
      title: 'Duration',
      type: 'object',
      fields: [
        defineField({
          name: 'hours',
          title: 'Hours',
          type: 'number',
          initialValue: 0,
          validation: (Rule) => Rule.min(0).max(24),
        }),
        defineField({
          name: 'minutes',
          title: 'Minutes',
          type: 'number',
          initialValue: 0,
          validation: (Rule) => Rule.min(0).max(59),
        }),
      ],
    }),
    defineField({
      name: 'eventCategory',
      title: 'Event Category',
      type: 'string',
      options: {
        list: [
          {title: 'Normal Event', value: 'normal'},
          {title: 'Special Event (Registration Required)', value: 'special'},
        ],
      },
      validation: (Rule) => Rule.required(),
      initialValue: 'normal',
    }),
    defineField({
      name: 'eventType',
      title: 'Event Type',
      type: 'string',
      options: {
        list: [
          {title: 'Weekly Service', value: 'weekly-service'},
          {title: 'Bible Study', value: 'bible-study'},
          {title: 'Prayer Meeting', value: 'prayer-meeting'},
          {title: 'Fellowship Gathering', value: 'fellowship-gathering'},
          {title: 'Outreach Program', value: 'outreach'},
          {title: 'Workshop/Seminar', value: 'workshop'},
          {title: 'Social Event', value: 'social'},
          {title: 'Conference', value: 'conference'},
          {title: 'Retreat', value: 'retreat'},
          {title: 'Special Service', value: 'special-service'},
          {title: 'Revival', value: 'revival'},
          {title: 'Crusade', value: 'crusade'},
          {title: 'Youth Camp', value: 'youth-camp'},
          {title: 'Leadership Training', value: 'leadership-training'},
          {title: 'Missions Trip', value: 'missions'},
          {title: 'Other', value: 'other'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'specialEventDetails',
      title: 'Special Event Details',
      type: 'object',
      hidden: ({parent}: any) => parent?.eventCategory !== 'special',
      fields: [
        defineField({
          name: 'registrationFee',
          title: 'Registration Fee',
          type: 'object',
          fields: [
            defineField({
              name: 'amount',
              title: 'Amount',
              type: 'number',
              initialValue: 0,
            }),
            defineField({
              name: 'currency',
              title: 'Currency',
              type: 'string',
              options: {
                list: [
                  {title: 'USD ($)', value: 'USD'},
                  {title: 'EUR (€)', value: 'EUR'},
                  {title: 'GBP (£)', value: 'GBP'},
                  {title: 'NGN (₦)', value: 'NGN'},
                  {title: 'GHS (₵)', value: 'GHS'},
                  {title: 'KES (KSh)', value: 'KES'},
                  {title: 'ZAR (R)', value: 'ZAR'},
                ],
              },
              initialValue: 'USD',
            }),
            defineField({
              name: 'isFree',
              title: 'Free Event',
              type: 'boolean',
              initialValue: true,
            }),
          ],
        }),
        defineField({
          name: 'capacity',
          title: 'Maximum Capacity',
          type: 'number',
          description: 'Maximum number of attendees (leave empty for unlimited)',
        }),
        defineField({
          name: 'registrationDeadline',
          title: 'Registration Deadline',
          type: 'datetime',
          validation: (Rule) =>
            Rule.custom((value, context) => {
              // Only require this field if eventCategory is 'special'
              const eventCategory = context.document?.eventCategory
              if (eventCategory === 'special' && !value) {
                return 'Registration deadline is required for special events'
              }
              return true
            }),
        }),
        defineField({
          name: 'earlyBirdDeadline',
          title: 'Early Bird Registration Deadline',
          type: 'datetime',
          description: 'Optional early bird registration deadline',
        }),
        defineField({
          name: 'accommodationInfo',
          title: 'Accommodation Details',
          type: 'object',
          fields: [
            defineField({
              name: 'accommodationAvailable',
              title: 'Accommodation Available',
              type: 'boolean',
              initialValue: false,
            }),
            defineField({
              name: 'accommodationDetails',
              title: 'Accommodation Details',
              type: 'text',
              rows: 3,
              hidden: ({parent}: any) => !parent?.accommodationAvailable,
            }),
            defineField({
              name: 'accommodationFee',
              title: 'Accommodation Fee',
              type: 'number',
              hidden: ({parent}: any) => !parent?.accommodationAvailable,
            }),
          ],
        }),
        defineField({
          name: 'mealsPlan',
          title: 'Meals Information',
          type: 'object',
          fields: [
            defineField({
              name: 'mealsIncluded',
              title: 'Meals Included',
              type: 'boolean',
              initialValue: false,
            }),
            defineField({
              name: 'mealsDetails',
              title: 'Meals Details',
              type: 'text',
              rows: 2,
              description: 'What meals are included (breakfast, lunch, dinner)',
              hidden: ({parent}: any) => !parent?.mealsIncluded,
            }),
            defineField({
              name: 'dietaryOptions',
              title: 'Dietary Options Available',
              type: 'array',
              of: [{type: 'string'}],
              options: {
                list: [
                  {title: 'Vegetarian', value: 'vegetarian'},
                  {title: 'Vegan', value: 'vegan'},
                  {title: 'Gluten-Free', value: 'gluten-free'},
                  {title: 'Halal', value: 'halal'},
                  {title: 'Kosher', value: 'kosher'},
                  {title: 'Diabetic-Friendly', value: 'diabetic'},
                ],
              },
              hidden: ({parent}: any) => !parent?.mealsIncluded,
            }),
          ],
        }),
        defineField({
          name: 'certificateOffered',
          title: 'Certificate of Attendance',
          type: 'boolean',
          initialValue: false,
          description: 'Will participants receive a certificate?',
        }),
        defineField({
          name: 'materialsProvided',
          title: 'Materials Provided',
          type: 'array',
          of: [{type: 'string'}],
          description: 'List of materials/resources provided to participants',
        }),
      ],
    }),
    defineField({
      name: 'description',
      title: 'Event Description',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'H3', value: 'h3'},
            {title: 'H4', value: 'h4'},
            {title: 'Quote', value: 'blockquote'},
          ],
          lists: [
            {title: 'Bullet', value: 'bullet'},
            {title: 'Numbered', value: 'number'},
          ],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
              {title: 'Underline', value: 'underline'},
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  {name: 'href', type: 'url', title: 'URL'},
                  {name: 'blank', type: 'boolean', title: 'Open in new tab', initialValue: true},
                ],
              },
            ],
          },
        },
      ],
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'object',
      fields: [
        defineField({
          name: 'venue',
          title: 'Venue Name',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'address',
          title: 'Full Address',
          type: 'text',
          rows: 2,
        }),
        defineField({
          name: 'room',
          title: 'Room/Hall',
          type: 'string',
          description: 'Specific room or hall within the venue',
        }),
        defineField({
          name: 'directions',
          title: 'Special Directions',
          type: 'text',
          rows: 2,
          description: 'Additional directions or landmarks',
        }),
        defineField({
          name: 'mapLink',
          title: 'Map Link',
          type: 'url',
          description: 'Google Maps or other map service link',
        }),
      ],
    }),
    defineField({
      name: 'ministers',
      title: 'Ministers/Speakers',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'name',
              title: 'Name',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'role',
              title: 'Role',
              type: 'string',
              options: {
                list: [
                  {title: 'Main Speaker', value: 'main-speaker'},
                  {title: 'Guest Speaker', value: 'guest-speaker'},
                  {title: 'Worship Leader', value: 'worship-leader'},
                  {title: 'Prayer Leader', value: 'prayer-leader'},
                  {title: 'Facilitator', value: 'facilitator'},
                  {title: 'MC/Host', value: 'mc'},
                  {title: 'Other', value: 'other'},
                ],
              },
            }),
            defineField({
              name: 'bio',
              title: 'Short Bio',
              type: 'text',
              rows: 2,
            }),
            defineField({
              name: 'image',
              title: 'Photo',
              type: 'image',
              options: {hotspot: true},
            }),
          ],
          preview: {
            select: {
              title: 'name',
              subtitle: 'role',
              media: 'image',
            },
          },
        },
      ],
    }),
    defineField({
      name: 'dressCode',
      title: 'Dress Code',
      type: 'object',
      fields: [
        defineField({
          name: 'code',
          title: 'Dress Code',
          type: 'string',
          options: {
            list: [
              {title: 'Casual', value: 'casual'},
              {title: 'Smart Casual', value: 'smart-casual'},
              {title: 'Formal', value: 'formal'},
              {title: 'Business Attire', value: 'business'},
              {title: 'Traditional/Cultural', value: 'traditional'},
              {title: 'Theme-based', value: 'theme'},
              {title: 'No Specific Code', value: 'none'},
            ],
          },
        }),
        defineField({
          name: 'details',
          title: 'Dress Code Details',
          type: 'text',
          rows: 2,
          description: 'Additional details about the dress code',
        }),
        defineField({
          name: 'colorTheme',
          title: 'Color Theme',
          type: 'string',
          description: 'Specific colors if applicable (e.g., "White and Gold")',
        }),
      ],
    }),
    defineField({
      name: 'requirements',
      title: 'General Requirements',
      type: 'object',
      fields: [
        defineField({
          name: 'bringItems',
          title: 'Items to Bring',
          type: 'array',
          of: [{type: 'string'}],
          description: 'List of items participants should bring',
        }),
        defineField({
          name: 'ageRestriction',
          title: 'Age Restriction',
          type: 'string',
          description: 'Any age restrictions (e.g., "18+", "Students only")',
        }),
        defineField({
          name: 'prerequisites',
          title: 'Prerequisites',
          type: 'text',
          rows: 2,
          description: 'Any requirements participants should meet before attending',
        }),
      ],
    }),
    defineField({
      name: 'contact',
      title: 'Contact Information',
      type: 'object',
      fields: [
        defineField({
          name: 'contactPerson',
          title: 'Contact Person',
          type: 'string',
        }),
        defineField({
          name: 'phone',
          title: 'Phone Number',
          type: 'string',
        }),
        defineField({
          name: 'email',
          title: 'Email',
          type: 'string',
        }),
        defineField({
          name: 'whatsapp',
          title: 'WhatsApp',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      options: {hotspot: true},
      description: 'Main image for the event',
    }),
    defineField({
      name: 'gallery',
      title: 'Additional Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {hotspot: true},
          fields: [
            {name: 'caption', type: 'string', title: 'Caption'},
            {name: 'alt', type: 'string', title: 'Alt text'},
          ],
        },
      ],
    }),
    defineField({
      name: 'isRecurring',
      title: 'Recurring Event',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'recurrencePattern',
      title: 'Recurrence Pattern',
      type: 'string',
      options: {
        list: [
          {title: 'Weekly', value: 'weekly'},
          {title: 'Bi-weekly', value: 'biweekly'},
          {title: 'Monthly', value: 'monthly'},
          {title: 'Custom', value: 'custom'},
        ],
      },
      hidden: ({parent}: any) => !parent?.isRecurring,
    }),

    defineField({
      name: 'isPublished',
      title: 'Published',
      type: 'boolean',
      initialValue: false,
      description: 'Make this event visible to users',
    }),
    defineField({
      name: 'isFeatured',
      title: 'Featured Event',
      type: 'boolean',
      initialValue: false,
      description: 'Highlight this event on the homepage',
    }),
  ],
  orderings: [
    {
      title: 'Event Date (Newest First)',
      name: 'eventDateDesc',
      by: [{field: 'eventDate', direction: 'desc'}],
    },
    {
      title: 'Event Date (Oldest First)',
      name: 'eventDateAsc',
      by: [{field: 'eventDate', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      eventDate: 'eventDate',
      eventType: 'eventType',
      venue: 'location.venue',
      media: 'featuredImage',
      published: 'isPublished',
    },
    prepare({
      title,
      eventDate,
      eventType,
      venue,
      media,
      published,
    }: {
      title: string
      eventDate: string
      eventType: string
      venue: string
      media: any
      published: boolean
    }) {
      const date = new Date(eventDate)
      const formattedDate = date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })

      return {
        title: title,
        subtitle: `${published ? '' : 'DRAFT - '}${formattedDate} • ${eventType} • ${venue}`,
        media: media,
      }
    },
  },
})
