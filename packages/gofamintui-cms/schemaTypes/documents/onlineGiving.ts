import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'onlineGiving',
  title: 'Giving Information',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      initialValue: 'Online Donations',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Donation Description',
      type: 'text',
      description: 'Brief message about donations',
    }),
    defineField({
      name: 'nigerianBankDetails',
      title: 'Nigerian Bank Details',
      type: 'object',
      fields: [
        defineField({
          name: 'bankName',
          title: 'Bank Name',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'accountName',
          title: 'Account Name',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'accountNumber',
          title: 'Account Number',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'sortCode',
          title: 'Sort Code (if applicable)',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'foreignBankDetails',
      title: 'Foreign Bank Details',
      type: 'object',
      fields: [
        defineField({
          name: 'bankName',
          title: 'Bank Name',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'accountName',
          title: 'Account Name',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'accountNumber',
          title: 'Account Number/IBAN',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'routingNumber',
          title: 'Routing Number',
          type: 'string',
        }),
        defineField({
          name: 'swiftCode',
          title: 'SWIFT/BIC Code',
          type: 'string',
        }),
        defineField({
          name: 'bankAddress',
          title: 'Bank Address',
          type: 'text',
        }),
      ],
    }),
    defineField({
      name: 'receiptSubmission',
      title: 'Receipt Submission Details',
      type: 'object',
      fields: [
        defineField({
          name: 'email',
          title: 'Email for Receipt Submission',
          type: 'string',
          validation: (Rule) => Rule.email(),
        }),
        defineField({
          name: 'whatsappNumber',
          title: 'WhatsApp Number',
          type: 'string',
          description: 'Include country code (e.g., +234...)',
        }),
        defineField({
          name: 'instructions',
          title: 'Submission Instructions',
          type: 'text',
          initialValue: 'Please forward your payment receipt to confirm your donation.',
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
})
