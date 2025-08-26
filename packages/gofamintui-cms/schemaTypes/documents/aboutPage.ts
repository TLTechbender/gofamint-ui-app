import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'aboutpage',
  title: 'aboutPage',
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
      ],
    }),

    // Hardcoded sections now as Sanity fields
    defineField({
      name: 'establishedSection',
      title: 'Established Section',
      type: 'object',
      fields: [
        defineField({
          name: 'yearLabel',
          title: 'Year Label',
          type: 'string',
          initialValue: 'Established in 2002',
        }),
        defineField({
          name: 'title',
          title: 'Section Title',
          type: 'text',
          rows: 2,
          initialValue: 'We all young, energetic dudes who love God',
        }),
      ],
    }),

    defineField({
      name: 'whoWeAreSection',
      title: 'Who We Are Section',
      type: 'object',
      fields: [
        defineField({
          name: 'label',
          title: 'Section Label',
          type: 'string',
          initialValue: 'Who We Are',
        }),
        defineField({
          name: 'content',
          title: 'Section Content',
          type: 'text',
          initialValue:
            "GOFAMINT UI Student Fellowship (GSF UI) is the student arm of the Gospel Faith Mission International at the University of Ibadan. We exist to honor and proclaim the supremacy of the name and purpose of Jesus. Rooted in the truth of Christ's life, death, and resurrection, we are committed to His plan of healing and redemption in our campus and beyond.",
        }),
      ],
    }),

    defineField({
      name: 'beliefsSection',
      title: 'What We Believe Section',
      type: 'object',
      fields: [
        defineField({
          name: 'sectionLabel',
          title: 'Section Label',
          type: 'string',
          initialValue: 'WHAT WE BELIEVE',
        }),
        defineField({
          name: 'title',
          title: 'Main Title',
          type: 'string',
          initialValue: 'Our Foundational Beliefs',
        }),
        defineField({
          name: 'convictionsTitle',
          title: 'Convictions Title',
          type: 'string',
          initialValue: 'Our Convictions',
        }),
        defineField({
          name: 'convictions',
          title: 'Convictions List',
          type: 'array',
          of: [{type: 'string'}],
          initialValue: [
            "Ruled by God's Word",
            'Christ-Centered in Focus',
            'Empowered by the Holy Spirit',
            'Reliant on Prayer',
            'Committed to Covenant Community',
            'Gospel-Saturated in Discipleship',
            'Devoted to Equipping the Saints',
            'Relentless in Mission',
          ],
        }),
        defineField({
          name: 'faithLabel',
          title: 'Faith Section Label',
          type: 'string',
          initialValue: 'Core Beliefs',
        }),
        defineField({
          name: 'faithTitle',
          title: 'Faith Section Title',
          type: 'string',
          initialValue: 'Affirmation of Faith',
        }),
        defineField({
          name: 'faithPoints',
          title: 'Faith Points',
          type: 'array',
          of: [{type: 'string'}],
          initialValue: [
            'The Bible is the Word of God, fully inspired and without error in the original manuscripts.',
            'There is one true, good, and living God who eternally exists in three persons—the Father, Son, and Holy Spirit.',
            'God created men and women in His image and created all things for His glory.',
            'All have sinned and rebelled against God.',
            'Jesus came to earth, lived a perfect life, and died an atoning death—conquering sin, Satan, and death by His resurrection.',
            'God alone is the Author of Salvation.',
            'The Holy Spirit gives gifts to those who are in Christ.',
            'The church consists of all who have trusted Jesus for their eternal salvation.',
            'Heaven and hell are real places.',
            'Jesus Christ will one day return to establish His kingdom.',
          ],
        }),
      ],
    }),

    defineField({
      name: 'imageTextSections',
      title: 'These is for the about page to highlight some of the important events you have during the year like conferences, annual movements etc',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'imageTextSection',
          title: 'Image-Text Section',
          fields: [
          
            defineField({
              name: 'title',
              title: 'Section Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'subtitle',
              title: 'Subtitle (Optional)',
              type: 'string',
              description: 'Supporting text that appears below the main title',
            }),
            defineField({
              name: 'image',
              title: 'Section Image',
              type: 'image',
              options: {
                hotspot: true,
              },
              fields: [
                {
                  name: 'alt',
                  type: 'string',
                  title: 'Alternative Text',
                  description: 'Important for accessibility and SEO',
                  validation: (Rule) => Rule.required(),
                },
                {
                  name: 'caption',
                  type: 'string',
                  title: 'Image Caption (Optional)',
                },
              ],
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'imagePosition',
              title: 'Image Position',
              type: 'string',
              options: {
                list: [
                  {title: 'Left', value: 'left'},
                  {title: 'Right', value: 'right'},
                ],
                layout: 'radio',
              },
              initialValue: 'left',
              description: 'Choose whether the image appears on the left or right side',
            }),
            defineField({
              name: 'content',
              title: 'Content Text',
              type: 'text',
              rows: 4,
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'subtitle',
              content: 'content',
              image: 'image',
              imagePosition: 'imagePosition',
            },
            prepare({title, subtitle, content, image, imagePosition}) {
              const contentPreview = content ? content.substring(0, 60) + '...' : 'No content'

              return {
                title: title || 'Untitled Section',
                subtitle: subtitle || contentPreview,
                media: image,
                description: `Image: ${imagePosition || 'left'} | ${contentPreview}`,
              }
            },
          },
        },
      ],
      description: '',
    }),
  ],
  preview: {
    select: {
      title: 'seo.title',
      media: 'seo.ogImage',
    },
    prepare(selection) {
      return {
        title: selection.title || 'aboutPage',
        media: selection.media,
      }
    },
  },
})
