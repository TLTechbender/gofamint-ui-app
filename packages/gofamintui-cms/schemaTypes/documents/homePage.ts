import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
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
        defineField({
          name: 'primaryButton',
          title: 'Primary Button',
          type: 'object',
          validation: (Rule) => Rule.required(),
          fields: [
            defineField({
              name: 'text',
              title: 'Button Text',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'link',
              title: 'Button Link',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
          ],
        }),
        defineField({
          name: 'secondaryButton',
          title: 'Secondary Button',
          type: 'object',
          validation: (Rule) => Rule.required(),
          fields: [
            defineField({
              name: 'text',
              title: 'Button Text',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'link',
              title: 'Button Link',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
          ],
        }),
      ],
    }),

    // Welcome Section
    defineField({
      name: 'welcomeSection',
      title: 'Welcome Section',
      type: 'object',
      validation: (Rule) => Rule.required(),
      fields: [
        defineField({
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Welcome to Church',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'description',
          title: 'Description',
          type: 'text',
          rows: 4,
          validation: (Rule) => Rule.required().min(50),
        }),
      ],
    }),

    // Services Section
    defineField({
      name: 'servicesSection',
      title: 'Services/Worship Section',
      type: 'object',
      validation: (Rule) => Rule.required(),
      fields: [
        defineField({
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'worship with us',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'subtitle',
          title: 'Section Subtitle',
          type: 'string',
          initialValue: 'our services at gofamint ui',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'location',
          title: 'Location',
          type: 'string',
          initialValue: 'somewhere inside ui sha',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'services',
          title: 'Services',
          type: 'array',
          validation: (Rule) => Rule.required().min(1).max(6),
          of: [
            {
              type: 'object',
              fields: [
                defineField({
                  name: 'title',
                  title: 'Service Title',
                  type: 'string',
                  validation: (Rule) => Rule.required(),
                }),
                defineField({
                  name: 'description',
                  title: 'Service Description',
                  type: 'text',
                  rows: 3,
                  validation: (Rule) => Rule.required().min(50),
                }),
                defineField({
                  name: 'time',
                  title: 'Service Time',
                  type: 'string',
                  placeholder: 'e.g., Fri, 6:00pm',
                  validation: (Rule) => Rule.required(),
                }),
                defineField({
                  name: 'posterImage',
                  title: 'Service Image',
                  type: 'image',
                  options: {
                    hotspot: true,
                  },
                  validation: (Rule) => Rule.required(),
                }),
              ],
              preview: {
                select: {
                  title: 'title',
                  media: 'posterImage',
                  time: 'time',
                },
                prepare(selection) {
                  const {title, media, time} = selection
                  return {
                    title,
                    subtitle: time,
                    media,
                  }
                },
              },
            },
          ],
        }),
      ],
    }),

    //Most likely this be c
    // Messages Section
    // defineField({
    //   name: 'messagesSection',
    //   title: 'Recent Messages Section',
    //   type: 'object',
    //   validation: (Rule) => Rule.required(),
    //   fields: [
    //     defineField({
    //       name: 'title',
    //       title: 'Section Title',
    //       type: 'string',
    //       initialValue: 'Revisit Recent Messages',
    //       validation: (Rule) => Rule.required(),
    //     }),
    //     defineField({
    //       name: 'subtitle',
    //       title: 'Section Subtitle',
    //       type: 'string',
    //       initialValue: "Catch Up on God's Word from his servants and remain blessed",
    //       validation: (Rule) => Rule.required(),
    //     }),
    //     defineField({
    //       name: 'viewMoreLink',
    //       title: 'View More Link',
    //       type: 'string',
    //       validation: (Rule) => Rule.required(),
    //     }),
    //     defineField({
    //       name: 'featuredMessages',
    //       title: 'Featured Messages',
    //       type: 'array',
    //       validation: (Rule) => Rule.required().min(1).max(3),
    //       of: [
    //         {
    //           type: 'object',
    //           fields: [
    //             defineField({
    //               name: 'title',
    //               title: 'Message Title',
    //               type: 'string',
    //               validation: (Rule) => Rule.required(),
    //             }),
    //             defineField({
    //               name: 'poster',
    //               title: 'Message Poster/Thumbnail',
    //               type: 'image',
    //               options: {
    //                 hotspot: true,
    //               },
    //               validation: (Rule) => Rule.required(),
    //             }),
    //             defineField({
    //               name: 'duration',
    //               title: 'Duration',
    //               type: 'string',
    //               placeholder: 'e.g., 42 mins',
    //               validation: (Rule) => Rule.required(),
    //             }),
    //             defineField({
    //               name: 'date',
    //               title: 'Message Date',
    //               type: 'date',
    //               validation: (Rule) => Rule.required(),
    //             }),
    //             defineField({
    //               name: 'preacher',
    //               title: 'Preacher/Speaker',
    //               type: 'string',
    //               validation: (Rule) => Rule.required(),
    //             }),
    //             defineField({
    //               name: 'description',
    //               title: 'Message Description',
    //               type: 'text',
    //               rows: 3,
    //               validation: (Rule) => Rule.required().min(30),
    //             }),
    //             defineField({
    //               name: 'audioUrl',
    //               title: 'Audio URL',
    //               type: 'url',
    //             }),
    //             defineField({
    //               name: 'videoUrl',
    //               title: 'Video URL',
    //               type: 'url',
    //             }),
    //             defineField({
    //               name: 'detailsLink',
    //               title: 'View Details Link',
    //               type: 'string',
    //               validation: (Rule) => Rule.required(),
    //             }),
    //             defineField({
    //               name: 'learnMoreLink',
    //               title: 'Learn More Link',
    //               type: 'string',
    //               validation: (Rule) => Rule.required(),
    //             }),
    //           ],
    //           preview: {
    //             select: {
    //               title: 'title',
    //               date: 'date',
    //               media: 'poster',
    //               duration: 'duration',
    //             },
    //             prepare(selection) {
    //               const {title, date, media, duration} = selection
    //               const formattedDate = date ? new Date(date).toLocaleDateString() : 'No date'
    //               return {
    //                 title,
    //                 subtitle: `${formattedDate} • ${duration || 'No duration'}`,
    //                 media,
    //               }
    //             },
    //           },
    //         },
    //       ],
    //     }),
    //   ],
    // }),

    // Testimonials Section
    defineField({
      name: 'testimonialsSection',
      title: 'Testimonials Section',
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
          title: 'Section Title',
          type: 'string',
          initialValue: 'Testimonies',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'subtitle',
          title: 'Section Subtitle',
          type: 'string',
          initialValue: 'Hear what God has done in the lives of our beloved fellowship members',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'testimonials',
          title: 'Testimonials',
          type: 'array',
          validation: (Rule) => Rule.required().min(1).max(12),
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
                  name: 'text',
                  title: 'Testimonial Text',
                  type: 'text',
                  rows: 4,
                  validation: (Rule) => Rule.required().min(50),
                }),

                defineField({
                  name: 'position',
                  title: 'Position/Title',
                  type: 'string',
                  placeholder: 'e.g., Student, Member since 2020',
                }),
                defineField({
                  name: 'date',
                  title: 'Date Given',
                  type: 'date',
                  validation: (Rule) => Rule.required(),
                }),
              ],
              preview: {
                select: {
                  title: 'name',
                  subtitle: 'position',
                  media: 'image',
                },
              },
            },
          ],
        }),
      ],
    }),

    // Call to Action Section
    defineField({
      name: 'ctaSection',
      title: 'Call to Action Section',
      type: 'object',
      validation: (Rule) => Rule.required(),
      fields: [
        defineField({
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Ready, Set, Asherrrr!',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'description',
          title: 'Description',
          type: 'text',
          rows: 4,
          validation: (Rule) => Rule.required().min(50),
        }),
        defineField({
          name: 'primaryButton',
          title: 'Primary Button',
          type: 'object',
          validation: (Rule) => Rule.required(),
          fields: [
            defineField({
              name: 'text',
              title: 'Button Text',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'link',
              title: 'Button Link',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
          ],
        }),
        defineField({
          name: 'secondaryButton',
          title: 'Secondary Button',
          type: 'object',
          validation: (Rule) => Rule.required(),
          fields: [
            defineField({
              name: 'text',
              title: 'Button Text',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'link',
              title: 'Button Link',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
          ],
        }),
      ],
    }),

    // Journey Planner Section (from your JourneyPlanner component)
    defineField({
      name: 'journeyPlannerSection',
      title: 'Journey Planner Section',
      type: 'object',
      validation: (Rule) => Rule.required(),
      fields: [
        defineField({
          name: 'isEnabled',
          title: 'Enable Journey Planner',
          type: 'boolean',
          initialValue: true,
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Plan Your Journey',
        }),
        defineField({
          name: 'description',
          title: 'Section Description',
          type: 'text',
          rows: 2,
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
        title: selection.title || 'Homepage',
        media: selection.media,
      }
    },
  },
})
