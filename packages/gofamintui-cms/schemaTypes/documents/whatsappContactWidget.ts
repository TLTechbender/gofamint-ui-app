import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'whatsappContactWidget',
  title: 'WhatsApp Contact Widget',
  type: 'document',
  description: 'Configure the WhatsApp contact widget that appears at the bottom of pages',
  fields: [
    defineField({
      name: 'phoneNumber',
      title: 'WhatsApp Phone Number',
      type: 'string',
      description: 'Enter phone number with country code (e.g., 1234567890)',
      validation: (Rule) =>
        Rule.required()
          .min(10)
          .max(15)
          .regex(/^[0-9+]+$/)
          .error('Please enter a valid phone number with country code, numbers only'),
    }),

    defineField({
      name: 'message',
      title: 'Default Message',
      type: 'text',
      description:
        'The pre-filled message that will appear when someone clicks the WhatsApp button',
      initialValue: "Hi! I'm interested in attending your next service.",
      validation: (Rule) => Rule.required().max(200),
      rows: 3,
    }),

    defineField({
      name: 'title',
      title: 'Widget Title',
      type: 'string',
      description: 'Main heading displayed in the widget',
      initialValue: 'Want to attend our next service?',
      validation: (Rule) => Rule.required().max(60),
    }),

    defineField({
      name: 'subtitle',
      title: 'Widget Subtitle',
      type: 'string',
      description: 'Secondary text displayed below the title',
      initialValue: 'Reach out on WhatsApp',
      validation: (Rule) => Rule.required().max(50),
    }),

    defineField({
      name: 'buttonText',
      title: 'Button Text',
      type: 'string',
      description: 'Text displayed on the WhatsApp action button',
      initialValue: 'Message Us',
      validation: (Rule) => Rule.required().max(20),
    }),
  ],

  preview: {
    select: {
      title: 'title',
      subtitle: 'phoneNumber',
      isEnabled: 'isEnabled',
    },
    prepare(selection) {
      const {title, subtitle, isEnabled} = selection
      return {
        title: title || 'WhatsApp Widget',
      }
    },
  },
})
