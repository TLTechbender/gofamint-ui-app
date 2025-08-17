import {defineField, defineType} from 'sanity'

export const blogPost = defineType({
  name: 'blogPost',
  title: 'Blog Posts',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().max(200),
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
  name: 'author',
  title: 'Author',
  type: 'reference',
  to: [{type: 'user'}],
  validation: (Rule) => Rule.required(),
  options: {
    filter: 'isActive == true',
    disableNew: true, // Explicitly disable creating new users
  },
}),
    defineField({
      name: 'authorInfo',
      title: 'Author Information',
      type: 'object',
      fields: [
        defineField({
          name: 'bio',
          title: 'Author Bio',
          type: 'text',
          description: 'Bio for this specific blog post',
          rows: 4,
        }),
        defineField({
          name: 'jobTitle',
          title: 'Job Title/Position',
          type: 'string',
          description: 'Professional title or position in the church',
        }),
        defineField({
          name: 'socialLinks',
          title: 'Social Media Links',
          type: 'object',
          fields: [
            defineField({
              name: 'instagram',
              title: 'Instagram',
              type: 'url',
              validation: (Rule) =>
                Rule.uri({
                  scheme: ['http', 'https'],
                }),
            }),
            defineField({
              name: 'whatsapp',
              title: 'WhatsApp',
              type: 'string',
              description: 'WhatsApp number (include country code)',
            }),
            defineField({
              name: 'linkedin',
              title: 'LinkedIn',
              type: 'url',
              validation: (Rule) =>
                Rule.uri({
                  scheme: ['http', 'https'],
                }),
            }),
            defineField({
              name: 'twitter',
              title: 'Twitter/X',
              type: 'url',
              validation: (Rule) =>
                Rule.uri({
                  scheme: ['http', 'https'],
                }),
            }),
            defineField({
              name: 'facebook',
              title: 'Facebook',
              type: 'url',
              validation: (Rule) =>
                Rule.uri({
                  scheme: ['http', 'https'],
                }),
            }),
            defineField({
              name: 'website',
              title: 'Personal Website',
              type: 'url',
              validation: (Rule) =>
                Rule.uri({
                  scheme: ['http', 'https'],
                }),
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative Text',
          type: 'string',
          description: 'Important for SEO and accessibility',
        }),
      ],
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      description: 'Brief description of the post (for previews)',
      rows: 3,
      validation: (Rule) => Rule.max(1000),
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
            {title: 'Quote', value: 'blockquote'},
          ],
          lists: [
            {title: 'Bullet', value: 'bullet'},
            {title: 'Number', value: 'number'},
          ],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
              {title: 'Code', value: 'code'},
            ],
            annotations: [
              {
                title: 'URL',
                name: 'link',
                type: 'object',
                fields: [
                  {
                    title: 'URL',
                    name: 'href',
                    type: 'url',
                  },
                ],
              },
            ],
          },
        },
        {
          type: 'image',
          options: {hotspot: true},
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative Text',
            },
          ],
        },
      ],
    }),
 
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'isDraft',
      title: 'Draft',
      type: 'boolean',
      initialValue: true,
      description: 'Set to false to publish the post',
    }),
    defineField({
      name: 'featured',
      title: 'Featured Post',
      type: 'boolean',
      initialValue: false,
      description: 'Feature this post on homepage',
    }),
    defineField({
      name: 'readingTime',
      title: 'Reading Time (minutes)',
      type: 'number',
      description: 'Estimated reading time in minutes',
    }),
    defineField({
      name: 'allowComments',
      title: 'Allow Comments',
      type: 'boolean',
      initialValue: true,
      description: 'Enable/disable comments for this post',
    }),
    defineField({
      name: 'likes',
      title: 'Likes',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'user'}],
        },
      ],
      description: 'Users who liked this blog post',
    }),
    defineField({
      name: 'views',
      title: 'View Count',
      type: 'number',
      initialValue: 0,
      description: 'Number of times this post has been viewed',
    }),
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'object',
      fields: [
        defineField({
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
          validation: (Rule) => Rule.max(60),
        }),
        defineField({
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          validation: (Rule) => Rule.max(160),
        }),
        defineField({
          name: 'keywords',
          title: 'Keywords',
          type: 'array',
          of: [{type: 'string'}],
          options: {
            layout: 'tags',
          },
        }),
      ],
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
  orderings: [
    {
      title: 'Published Date, New',
      name: 'publishedAtDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
    {
      title: 'Published Date, Old',
      name: 'publishedAtAsc',
      by: [{field: 'publishedAt', direction: 'asc'}],
    },
    {
      title: 'Title A-Z',
      name: 'titleAsc',
      by: [{field: 'title', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.firstName',
      authorLastName: 'author.lastName',
      media: 'featuredImage',
      publishedAt: 'publishedAt',
      isDraft: 'isDraft',
      likes: 'likes',
      views: 'views',
    },
    prepare(selection) {
      const {title, author, authorLastName, publishedAt, isDraft, likes, views} = selection
      const authorName = author && authorLastName ? `${author} ${authorLastName}` : author
      const status = isDraft ? '(Draft)' : ''
      const date = publishedAt ? new Date(publishedAt).toLocaleDateString() : ''
      const likeCount = Array.isArray(likes) ? likes.length : 0
      const viewCount = views || 0
      const engagement = `${likeCount} ❤️ • ${viewCount} 👁️`

      return {
        title: `${title} ${status}`,
        subtitle: `by ${authorName || 'Unknown Author'} ${date ? `• ${date}` : ''} • ${engagement}`,
      }
    },
  },
})
