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
          title: 'Hero Background Image',
          type: 'image',
          description:
            'This image serves as a fallback or placeholder while the video loads. Use a high-quality, lightweight image.',
          options: {
            hotspot: true,
          },
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'backgroundVideo',
          title: 'Hero Background Video',
          type: 'file',
          description:
            'Upload a muted video (no sound) for the hero section background. Keep the file under 10MB for performance sakes.',
          validation: (Rule) => Rule.required(),
          options: {
            accept: 'video/*',
          },
          preview: {
            select: {
              title: 'asset.originalFilename',
              subtitle: 'asset.mimeType',
              size: 'asset.size',
            },
            prepare(selection) {
              const {title, subtitle, size} = selection

              const sizeInMB = size ? (size / (1024 * 1024)).toFixed(2) : ''

              return {
                title: title || 'Background Video Hero Section',
                subtitle: `${subtitle || 'video'} • ${sizeInMB}MB`,
              }
            },
          },
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

        defineField({
          name: 'imageSlider',
          title: 'Image Slider',
          type: 'array',
          description: 'Images for the very cool slider effect we got',
          of: [
            {
              type: 'object',
              name: 'slideImage',
              title: 'Slide Image',
              fields: [
                {
                  name: 'image',
                  title: 'Image',
                  type: 'image',
                  options: {
                    hotspot: true,
                  },
                  validation: (Rule) => Rule.required(),
                },
              ],
              preview: {
                select: {
                  media: 'image',
                  title: 'image.asset.originalFilename',
                },
                prepare(selection) {
                  const {media, title} = selection
                  return {
                    title: title || 'Slider Image',
                    media: media,
                  }
                },
              },
            },
          ],
          options: {
            layout: 'grid', // Shows images in a grid layout in Sanity Studio
          },
          validation: (Rule) =>
            Rule.required()
              .min(3)
              .max(20)
              .error(
                'Slider must have between 3-20 images, capping this cos large moving images could lead to peformance problems down the road',
              ),
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

    // Journey Planner Section
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
      description:
        'The naming sucks right?, just something I felt the need to add the vibe should be something that encourages',
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
          name: 'ctaBigImage',
          title: 'The Image for the CTA Section',
          type: 'image',
          options: {
            hotspot: true,
          },
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
        title: selection.title || 'Homepage',
        media: selection.media,
      }
    },
  },
})
