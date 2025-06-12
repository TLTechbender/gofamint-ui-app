// import {defineField, defineType} from 'sanity'

// export default defineType({
//   name: 'gallery',
//   title: 'Gallery',
//   type: 'document',
//   fields: [
//     defineField({
//       name: 'title',
//       title: 'Gallery Title',
//       type: 'string',
//       validation: (Rule) => Rule.required(),
//     }),
//     defineField({
//       name: 'slug',
//       title: 'Slug',
//       type: 'slug',
//       options: {
//         source: 'title',
//         maxLength: 96,
//         slugify: (input) =>
//           input
//             .toLowerCase()
//             .replace(/\s+/g, '-')
//             .replace(/[^\w\-]+/g, '')
//             .slice(0, 96),
//       },
//       validation: (Rule) => Rule.required(),
//     }),
//     defineField({
//       name: 'description',
//       title: 'Gallery Description',
//       type: 'text',
//       rows: 4,
//       validation: (Rule) => Rule.max(300),
//     }),
//     defineField({
//       name: 'featuredImage',
//       title: 'Featured Image',
//       type: 'image',
//       options: {
//         hotspot: true,
//       },
//       fields: [
//         {
//           name: 'alt',
//           type: 'string',
//           title: 'Alternative text',
//           validation: (Rule) => Rule.required(),
//         },
//       ],
//       validation: (Rule) => Rule.required(),
//     }),
//     defineField({
//       name: 'media',
//       title: 'Gallery Media',
//       type: 'array',
//       of: [
//         {
//           title: 'Image',
//           type: 'object',
//           name: 'galleryImage',
//           fields: [
//             defineField({
//               name: 'image',
//               title: 'Image',
//               type: 'image',
//               options: {hotspot: true},
//               validation: (Rule) => Rule.required(),
//             }),
//             defineField({
//               name: 'alt',
//               title: 'Alternative Text',
//               type: 'string',
//               validation: (Rule) => Rule.required(),
//             }),
//             defineField({
//               name: 'caption',
//               title: 'Caption',
//               type: 'string',
//             }),
//             defineField({
//               name: 'photographer',
//               title: 'Photographer',
//               type: 'string',
//             }),
//           ],
//           preview: {
//             select: {
//               title: 'caption',
//               subtitle: 'alt',
//               media: 'image',
//             },
//           },
//         },
//         {
//           title: 'Video',
//           type: 'object',
//           name: 'galleryVideo',
//           fields: [
//             defineField({
//               name: 'video',
//               title: 'Video File',
//               type: 'file',
//               options: {
//                 accept: 'video/*',
//               },
//               validation: (Rule) => Rule.required(),
//             }),
//             defineField({
//               name: 'caption',
//               title: 'Video Caption',
//               type: 'string',
//             }),
//             defineField({
//               name: 'videographer',
//               title: 'Videographer',
//               type: 'string',
//             }),
//             defineField({
//               name: 'thumbnail',
//               title: 'Thumbnail Image',
//               type: 'image',
//               options: {hotspot: true},
//             }),
//           ],
//           preview: {
//             select: {
//               title: 'caption',
//               subtitle: 'videographer',
//               media: 'thumbnail',
//             },
//           },
//         },
//       ],
//       validation: (Rule) => Rule.required().min(1),
//     }),
//     defineField({
//       name: 'category',
//       title: 'Category',
//       type: 'string',
//       options: {
//         list: [
//           {title: 'Events', value: 'events'},
//           {title: 'Fellowship', value: 'fellowship'},
//           {title: 'Worship', value: 'worship'},
//           {title: 'Outreach', value: 'outreach'},
//           {title: 'Conference', value: 'conference'},
//           {title: 'Retreat', value: 'retreat'},
//           {title: 'Other', value: 'other'},
//         ],
//       },
//       validation: (Rule) => Rule.required(),
//     }),
//     defineField({
//       name: 'eventDate',
//       title: 'Event Date',
//       type: 'datetime',
//       options: {
//         dateFormat: 'YYYY-MM-DD',
//         timeFormat: 'HH:mm',
//       },
//     }),
//     defineField({
//       name: 'location',
//       title: 'Location',
//       type: 'string',
//     }),
//     defineField({
//       name: 'tags',
//       title: 'Tags',
//       type: 'array',
//       of: [{type: 'string'}],
//       options: {
//         layout: 'tags',
//       },
//     }),
//     defineField({
//       name: 'published',
//       title: 'Published',
//       type: 'boolean',
//       description:
//         'Toggle this on to make the gallery visible and accessible to website visitors. When off, the gallery will be hidden from public view.',
//       initialValue: false,
//     }),
//     defineField({
//       name: 'seo',
//       title: 'SEO Settings',
//       type: 'object',
//       validation: (Rule) => Rule.required(),
//       fields: [
//         defineField({
//           name: 'title',
//           title: 'SEO Title',
//           type: 'string',
//           description: 'This will override the gallery title for search engines',
//           validation: (Rule) => Rule.max(60),
//         }),
//         defineField({
//           name: 'description',
//           title: 'Meta Description',
//           type: 'text',
//           rows: 3,
//           validation: (Rule) => Rule.required().min(50).max(160),
//         }),
//         defineField({
//           name: 'keywords',
//           title: 'Keywords',
//           type: 'array',
//           of: [{type: 'string'}],
//           validation: (Rule) => Rule.required().min(3),
//         }),
//         defineField({
//           name: 'ogImage',
//           title: 'Social Media Image',
//           type: 'image',
//           description: 'Will fallback to featured image if not provided',
//           options: {
//             hotspot: true,
//           },
//           fields: [
//             {
//               name: 'alt',
//               type: 'string',
//               title: 'Alternative text',
//             },
//           ],
//         }),
//         defineField({
//           name: 'ogTitle',
//           title: 'Social Media Title',
//           type: 'string',
//           description: 'Title for social media sharing (Facebook, Twitter, etc.)',
//           validation: (Rule) => Rule.max(60),
//         }),
//         defineField({
//           name: 'ogDescription',
//           title: 'Social Media Description',
//           type: 'string',
//           description: 'Description for social media sharing',
//           validation: (Rule) => Rule.max(160),
//         }),
//         defineField({
//           name: 'canonicalUrl',
//           title: 'Canonical URL',
//           type: 'url',
//           description: 'The canonical URL for this gallery page',
//         }),
//         defineField({
//           name: 'noIndex',
//           title: 'No Index',
//           type: 'boolean',
//           description: 'Prevent search engines from indexing this page',
//           initialValue: false,
//         }),
//       ],
//     }),
//   ],
//   preview: {
//     select: {
//       title: 'title',
//       subtitle: 'category',
//       media: 'featuredImage',
//       published: 'published',
//     },
//     prepare({title, subtitle, media, published}) {
//       return {
//         title: `${title} ${published ? '✅' : '🚧'}`,
//         subtitle: subtitle ? `Category: ${subtitle}` : 'No category',
//         media,
//       }
//     },
//   },
//   orderings: [
//     {
//       title: 'Event Date, New',
//       name: 'eventDateDesc',
//       by: [{field: 'eventDate', direction: 'desc'}],
//     },
//     {
//       title: 'Event Date, Old',
//       name: 'eventDateAsc',
//       by: [{field: 'eventDate', direction: 'asc'}],
//     },
//     {
//       title: 'Title A-Z',
//       name: 'titleAsc',
//       by: [{field: 'title', direction: 'asc'}],
//     },
//     {
//       title: 'Created Date, New',
//       name: 'createdDesc',
//       by: [{field: '_createdAt', direction: 'desc'}],
//     },
//   ],
// })



import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      options: {
        hotspot: true
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'googleDriveFolder',
      title: 'Google Drive Folder Link',
      type: 'url',
      validation: Rule => Rule.required().uri({
        scheme: ['http', 'https']
      })
    })
  ],
  preview: {
    select: {
      title: 'title',
      media: 'featuredImage'
    }
  }
})

// TypeScript Interface
export interface GalleryPageData {
  _id: string;
  _type: 'project';
  _createdAt: string;
  _updatedAt: string;
  title: string;
  description: string;
  featuredImage: {
    _type: 'image';
    asset: {
      _ref: string;
      _type: 'reference';
    };
    hotspot?: {
      x: number;
      y: number;
      height: number;
      width: number;
    };
    crop?: {
      top: number;
      bottom: number;
      left: number;
      right: number;
    };
  };
  googleDriveFolder: string;
}



