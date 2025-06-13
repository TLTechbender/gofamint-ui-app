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

    // Multiple Content Sections
    defineField({
      name: 'contentSections',
      title: 'Content Sections',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'contentSection',
          title: 'Content Section',
          fields: [
            defineField({
              name: 'sectionId',
              title: 'Section ID',
              type: 'string',
              description: 'Unique identifier for this section (used for navigation/anchoring)',
            }),
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
              name: 'content',
              title: 'Content',
              type: 'array',
              of: [
                {
                  type: 'block',
                  styles: [
                    {title: 'Normal', value: 'normal'},
                    {title: 'H1', value: 'h1'},
                    {title: 'H2', value: 'h2'},
                    {title: 'H3', value: 'h3'},
                    {title: 'H4', value: 'h4'},
                    {title: 'H5', value: 'h5'},
                    {title: 'H6', value: 'h6'},
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
                      {title: 'Strike', value: 'strike-through'},
                      {title: 'Code', value: 'code'},
                    ],
                    annotations: [
                      {
                        name: 'link',
                        type: 'object',
                        title: 'Link',
                        fields: [
                          {
                            name: 'href',
                            type: 'url',
                            title: 'URL',
                          },
                          {
                            name: 'blank',
                            type: 'boolean',
                            title: 'Open in new tab',
                          },
                        ],
                      },
                    ],
                  },
                },
              ],
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'subtitle',
              content: 'content',
            },
            prepare({title, subtitle, content}) {
              const block = (content || []).find((block: any) => block._type === 'block')
              return {
                title: title || 'Untitled Section',
                subtitle:
                  subtitle ||
                  (block
                    ? block.children
                        ?.filter((child: any) => child._type === 'span')
                        ?.map((span: any) => span.text)
                        ?.join('')
                        ?.substring(0, 80) + '...'
                    : 'No content'),
              }
            },
          },
        },
      ],
      description: 'Add multiple content sections to build your about page',
    }),
    defineField({
      name: 'imageTextSections',
      title: 'Image-Text Sections',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'imageTextSection',
          title: 'Image-Text Section',
          fields: [
            defineField({
              name: 'sectionId',
              title: 'Section ID',
              type: 'string',
              description: 'Unique identifier for this section (used for navigation/anchoring)',
            }),
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
              title: 'Content',
              type: 'array',
              of: [
                {
                  type: 'block',
                  styles: [
                    {title: 'Normal', value: 'normal'},
                    {title: 'H1', value: 'h1'},
                    {title: 'H2', value: 'h2'},
                    {title: 'H3', value: 'h3'},
                    {title: 'H4', value: 'h4'},
                    {title: 'H5', value: 'h5'},
                    {title: 'H6', value: 'h6'},
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
                      {title: 'Strike', value: 'strike-through'},
                      {title: 'Code', value: 'code'},
                    ],
                    annotations: [
                      {
                        name: 'link',
                        type: 'object',
                        title: 'Link',
                        fields: [
                          {
                            name: 'href',
                            type: 'url',
                            title: 'URL',
                          },
                          {
                            name: 'blank',
                            type: 'boolean',
                            title: 'Open in new tab',
                          },
                        ],
                      },
                    ],
                  },
                },
              ],
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
              const block = (content || []).find((block: any) => block._type === 'block')
              const contentPreview = block
                ? block.children
                    ?.filter((child: any) => child._type === 'span')
                    ?.map((span: any) => span.text)
                    ?.join('')
                    ?.substring(0, 60) + '...'
                : 'No content'

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
      description: 'Create image-text sections with customizable layouts for your about page',
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
