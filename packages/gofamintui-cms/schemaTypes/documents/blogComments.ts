import {defineField, defineType} from 'sanity'

export const comment = defineType({
  name: 'comment',
  title: 'Comments',
  type: 'document',
  fields: [
    defineField({
      name: 'content',
      title: 'Comment',
      type: 'text',
      validation: (Rule) => Rule.required().min(1).max(1000),
      rows: 3,
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{type: 'user'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'blogPost',
      title: 'Blog Post',
      type: 'reference',
      to: [{type: 'blogPost'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'parentComment',
      title: 'Parent Comment',
      type: 'reference',
      to: [{type: 'comment'}],
      description: 'For replies to other comments',
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
      description: 'Users who liked this comment',
    }),
    defineField({
      name: 'approved',
      title: 'Approved',
      type: 'boolean',
      initialValue: true,
      description: 'Auto-approve for signed-in users',
    }),
  ],
  orderings: [
    {
      title: 'Newest First',
      name: 'newestFirst',
      by: [{field: '_createdAt', direction: 'desc'}],
    },
    {
      title: 'Oldest First',
      name: 'oldestFirst',
      by: [{field: '_createdAt', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      content: 'content',
      author: 'author.firstName',
      authorLastName: 'author.lastName',
      blogPost: 'blogPost.title',
      createdAt: '_createdAt',
    },
    prepare(selection) {
      const {content, author, authorLastName, blogPost, createdAt} = selection
      const authorName =
        author && authorLastName ? `${author} ${authorLastName}` : author || 'Unknown'
      const date = createdAt ? new Date(createdAt).toLocaleDateString() : ''
      const truncatedContent = content ? content.substring(0, 50) + '...' : ''

      return {
        title: truncatedContent,
        subtitle: `by ${authorName} on ${blogPost} • ${date}`,
      }
    },
  },
})
