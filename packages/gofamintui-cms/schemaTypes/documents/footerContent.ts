import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'footer',
  title: 'Footer Settings',
  type: 'document',
  fields: [
    // Logo & Branding
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'object',
      fields: [
        defineField({
          name: 'image',
          title: 'Logo Image',
          type: 'image',
          options: {
            hotspot: true,
          },
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'fellowshipName',
          title: 'Fellowship Name',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
      ],
    }),

    // About Section
    defineField({
      name: 'about',
      title: 'About Section',
      type: 'object',
      fields: [
        defineField({
          name: 'description',
          title: 'Description',
          type: 'text',
          rows: 4,
          validation: (rule) => rule.required().min(50).max(300),
        }),
      ],
    }),

    // Contact Information
    defineField({
      name: 'contact',
      title: 'Contact Information',
      type: 'object',
      fields: [
        defineField({
          name: 'address',
          title: 'Address',
          type: 'object',
          fields: [
            defineField({
              name: 'street',
              title: 'Street Address',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'city',
              title: 'City',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'state',
              title: 'State/Province',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'zipCode',
              title: 'ZIP/Postal Code',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'country',
              title: 'Country',
              type: 'string',
              initialValue: 'United States',
            }),
          ],
        }),
        defineField({
          name: 'phone',
          title: 'Phone Number',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'email',
          title: 'Email Address',
          type: 'string',
          validation: (rule) => rule.required().email(),
        }),
        defineField({
          name: 'website',
          title: 'Website URL',
          type: 'url',
        }),
      ],
    }),

    // Service Times
    defineField({
      name: 'serviceTimes',
      title: 'Service Times',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'name',
              title: 'Service Name',
              type: 'string',
              validation: (rule) => rule.required(),
              placeholder: 'e.g., Sunday Worship, Wednesday Prayer',
            }),
            defineField({
              name: 'time',
              title: 'Time',
              type: 'string',
              validation: (rule) => rule.required(),
              placeholder: 'e.g., 9:00 AM & 11:00 AM, 7:00 PM',
            }),
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'string',
              options: {
                list: [
                  {title: 'Users (Worship)', value: 'Users'},
                  {title: 'Heart (Prayer)', value: 'Heart'},
                  {title: 'Coffee (Youth)', value: 'Coffee'},
                  {title: 'BookOpen (Bible Study)', value: 'BookOpen'},
                  {title: 'Music (Worship)', value: 'Music'},
                  {title: 'Clock (General)', value: 'Clock'},
                  {title: 'Calendar (Events)', value: 'Calendar'},
                ],
              },
              initialValue: 'Clock',
            }),
            defineField({
              name: 'description',
              title: 'Description (Optional)',
              type: 'text',
              rows: 2,
            }),
          ],
          preview: {
            select: {
              title: 'name',
              subtitle: 'time',
            },
          },
        },
      ],
      validation: (rule) => rule.min(1),
    }),

    // Quick Links
    defineField({
      name: 'quickLinks',
      title: 'Quick Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'name',
              title: 'Link Name',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'string',
              validation: (rule) => rule.required(),
              placeholder: '/about, /events, https://example.com',
            }),
          ],
          preview: {
            select: {
              title: 'name',
              subtitle: 'url',
            },
          },
        },
      ],
    }),

    defineField({
      name: 'socialLinks',
      title: 'Social Media Links',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'socialLink', // Add explicit name for the object type
          title: 'Social Link',
          fields: [
            defineField({
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: [
                  {title: 'Facebook', value: 'facebook'},
                  {title: 'Instagram', value: 'instagram'},
                  {title: 'YouTube', value: 'youtube'},
                  {title: 'Twitter/X', value: 'twitter'},
                  {title: 'LinkedIn', value: 'linkedin'},
                  {title: 'TikTok', value: 'tiktok'},
                ],
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'Profile URL',
              type: 'url',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'platform',
              subtitle: 'url',
            },
            prepare({title, subtitle}) {
              return {
                title: `${title ? title.charAt(0).toUpperCase() + title.slice(1) : 'Unknown Platform'}`,
                subtitle: subtitle || 'No URL provided',
              }
            },
          },
        },
      ],
    }),

    // Newsletter Section
    defineField({
      name: 'newsletter',
      title: 'Newsletter Section',
      type: 'object',
      fields: [
        defineField({
          name: 'title',
          title: 'Newsletter Title',
          type: 'string',
          initialValue: 'Stay Connected',
        }),
        defineField({
          name: 'description',
          title: 'Newsletter Description',
          type: 'text',
          rows: 2,
          initialValue:
            'Get updates on events, sermons, and community news delivered to your inbox.',
        }),
        defineField({
          name: 'buttonText',
          title: 'Subscribe Button Text',
          type: 'string',
          initialValue: 'Subscribe',
        }),
        defineField({
          name: 'placeholder',
          title: 'Email Input Placeholder',
          type: 'string',
          initialValue: 'Enter your email address',
        }),
        defineField({
          name: 'isEnabled',
          title: 'Show Newsletter Section',
          type: 'boolean',
          initialValue: true,
        }),
      ],
    }),

    // Footer Bottom
    defineField({
      name: 'footerBottom',
      title: 'Footer Bottom Section',
      type: 'object',
      fields: [
        defineField({
          name: 'copyrightText',
          title: 'Copyright Text',
          type: 'string',
          description: 'Leave blank to use default format with fellowship name and current year',
        }),

        defineField({
          name: 'developerCredit',
          title: 'Developer Credit',
          type: 'object',
          fields: [
            defineField({
              name: 'show',
              title: 'Show Developer Credit',
              type: 'boolean',
              initialValue: true,
            }),
            defineField({
              name: 'techCreditText',
              title: 'Credit Text',
              type: 'string',
              initialValue: 'Built with ❤️ and Next.js',
            }),
            defineField({
              name: 'developerName',
              title: 'Developer Name ',
              type: 'string',
            }),
            defineField({
              name: 'link',
              title: 'Developer Link (Optional)',
              type: 'url',
            }),
          ],
        }),
      ],
    }),
  ],

  preview: {
    select: {
      title: 'logo.churchName',
      subtitle: 'contact.email',
    },
    prepare({title, subtitle}) {
      return {
        title: `Footer - Gofamintui `,
        subtitle: subtitle,
      }
    },
  },
})
