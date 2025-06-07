import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'eventRegistration',
  title: 'Event Registration',
  type: 'document',
  fields: [
    defineField({
      name: 'registrationId',
      title: 'Registration ID',
      type: 'string',
      readOnly: true,
      description: 'Auto-generated unique registration ID',
    }),
    defineField({
      name: 'event',
      title: 'Event',
      type: 'reference',
      to: [{type: 'fellowshipEvent'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'user',
      title: 'Registered User',
      type: 'reference',
      to: [{type: 'user'}],
      description: 'Reference to existing user (if they have an account)',
    }),
    defineField({
      name: 'personalInfo',
      title: 'Personal Information',
      type: 'object',
      fields: [
        defineField({
          name: 'firstName',
          title: 'First Name',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'lastName',
          title: 'Last Name',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'email',
          title: 'Email Address',
          type: 'string',
          validation: (Rule) => Rule.required().email(),
        }),
        defineField({
          name: 'phone',
          title: 'Phone Number',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'whatsapp',
          title: 'WhatsApp Number',
          type: 'string',
          description: 'If different from phone number',
        }),
        defineField({
          name: 'dateOfBirth',
          title: 'Date of Birth',
          type: 'date',
        }),
        defineField({
          name: 'gender',
          title: 'Gender',
          type: 'string',
          options: {
            list: [
              {title: 'Male', value: 'male'},
              {title: 'Female', value: 'female'},
              {title: 'Prefer not to say', value: 'not-specified'},
            ],
          },
        }),
      ],
    }),
    defineField({
      name: 'churchInfo',
      title: 'Church Information',
      type: 'object',
      fields: [
        defineField({
          name: 'homeChurch',
          title: 'Home Church',
          type: 'string',
        }),
        defineField({
          name: 'churchLocation',
          title: 'Church Location',
          type: 'string',
        }),
        defineField({
          name: 'pastor',
          title: 'Pastor Name',
          type: 'string',
        }),
        defineField({
          name: 'membershipStatus',
          title: 'Membership Status',
          type: 'string',
          options: {
            list: [
              {title: 'Member', value: 'member'},
              {title: 'Regular Attendee', value: 'regular'},
              {title: 'Visitor', value: 'visitor'},
              {title: 'First Time', value: 'first-time'},
            ],
          },
        }),
        defineField({
          name: 'servingRole',
          title: 'Current Ministry Role',
          type: 'string',
          description: 'Any leadership or ministry role in your church',
        }),
      ],
    }),
    defineField({
      name: 'contactAddress',
      title: 'Contact Address',
      type: 'object',
      fields: [
        defineField({
          name: 'street',
          title: 'Street Address',
          type: 'string',
        }),
        defineField({
          name: 'city',
          title: 'City',
          type: 'string',
        }),
        defineField({
          name: 'state',
          title: 'State/Province',
          type: 'string',
        }),
        defineField({
          name: 'country',
          title: 'Country',
          type: 'string',
        }),
        defineField({
          name: 'zipCode',
          title: 'ZIP/Postal Code',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'emergencyContact',
      title: 'Emergency Contact',
      type: 'object',
      fields: [
        defineField({
          name: 'name',
          title: 'Emergency Contact Name',
          type: 'string',
        }),
        defineField({
          name: 'relationship',
          title: 'Relationship',
          type: 'string',
          options: {
            list: [
              {title: 'Parent', value: 'parent'},
              {title: 'Spouse', value: 'spouse'},
              {title: 'Sibling', value: 'sibling'},
              {title: 'Friend', value: 'friend'},
              {title: 'Other', value: 'other'},
            ],
          },
        }),
        defineField({
          name: 'phone',
          title: 'Emergency Contact Phone',
          type: 'string',
        }),
        defineField({
          name: 'email',
          title: 'Emergency Contact Email',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'eventSpecificInfo',
      title: 'Event-Specific Information',
      type: 'object',
      fields: [
        defineField({
          name: 'accommodationNeeded',
          title: 'Accommodation Needed',
          type: 'boolean',
          initialValue: false,
        }),
        defineField({
          name: 'accommodationType',
          title: 'Accommodation Preference',
          type: 'string',
          options: {
            list: [
              {title: 'Single Room', value: 'single'},
              {title: 'Shared Room', value: 'shared'},
              {title: 'Dormitory Style', value: 'dormitory'},
              {title: 'No Preference', value: 'no-preference'},
            ],
          },
          hidden: ({parent}) => !parent?.accommodationNeeded,
        }),
        defineField({
          name: 'dietaryRequirements',
          title: 'Dietary Requirements',
          type: 'array',
          of: [{type: 'string'}],
          options: {
            list: [
              {title: 'None', value: 'none'},
              {title: 'Vegetarian', value: 'vegetarian'},
              {title: 'Vegan', value: 'vegan'},
              {title: 'Gluten-Free', value: 'gluten-free'},
              {title: 'Halal', value: 'halal'},
              {title: 'Kosher', value: 'kosher'},
              {title: 'Diabetic-Friendly', value: 'diabetic'},
              {title: 'Food Allergies', value: 'allergies'},
            ],
          },
        }),
        defineField({
          name: 'allergyDetails',
          title: 'Allergy Details',
          type: 'text',
          rows: 2,
          description: 'Please specify any food allergies or special dietary needs',
        }),
        defineField({
          name: 'medicalConditions',
          title: 'Medical Conditions',
          type: 'text',
          rows: 2,
          description: 'Any medical conditions organizers should be aware of',
        }),
        defineField({
          name: 'specialNeeds',
          title: 'Special Needs/Accessibility',
          type: 'text',
          rows: 2,
          description: 'Any accessibility requirements or special accommodations needed',
        }),
        defineField({
          name: 'transportationNeeded',
          title: 'Transportation Assistance Needed',
          type: 'boolean',
          initialValue: false,
        }),
        defineField({
          name: 'pickupLocation',
          title: 'Preferred Pickup Location',
          type: 'string',
          hidden: ({parent}) => !parent?.transportationNeeded,
        }),
      ],
    }),
    defineField({
      name: 'paymentInfo',
      title: 'Payment Information',
      type: 'object',
      fields: [
        defineField({
          name: 'paymentStatus',
          title: 'Payment Status',
          type: 'string',
          options: {
            list: [
              {title: 'Pending', value: 'pending'},
              {title: 'Paid', value: 'paid'},
              {title: 'Partially Paid', value: 'partial'},
              {title: 'Refunded', value: 'refunded'},
              {title: 'Free Event', value: 'free'},
            ],
          },
          initialValue: 'pending',
        }),
        defineField({
          name: 'amountPaid',
          title: 'Amount Paid',
          type: 'number',
          initialValue: 0,
        }),
        defineField({
          name: 'paymentMethod',
          title: 'Payment Method',
          type: 'string',
          options: {
            list: [
              {title: 'Bank Transfer', value: 'bank-transfer'},
              {title: 'Mobile Money', value: 'mobile-money'},
              {title: 'Credit/Debit Card', value: 'card'},
              {title: 'Cash', value: 'cash'},
              {title: 'Check', value: 'check'},
              {title: 'Online Payment', value: 'online'},
            ],
          },
        }),
        defineField({
          name: 'transactionReference',
          title: 'Transaction Reference',
          type: 'string',
          description: 'Payment reference number or transaction ID',
        }),
        defineField({
          name: 'paymentDate',
          title: 'Payment Date',
          type: 'datetime',
        }),
        defineField({
          name: 'paymentNotes',
          title: 'Payment Notes',
          type: 'text',
          rows: 2,
        }),
      ],
    }),
    defineField({
      name: 'additionalInfo',
      title: 'Additional Information',
      type: 'object',
      fields: [
        defineField({
          name: 'howDidYouHear',
          title: 'How did you hear about this event?',
          type: 'string',
          options: {
            list: [
              {title: 'Social Media', value: 'social-media'},
              {title: 'Church Announcement', value: 'church-announcement'},
              {title: 'Friend/Family', value: 'word-of-mouth'},
              {title: 'Website', value: 'website'},
              {title: 'Email', value: 'email'},
              {title: 'Flyer/Poster', value: 'print-media'},
              {title: 'Other', value: 'other'},
            ],
          },
        }),
        defineField({
          name: 'expectations',
          title: 'What are your expectations for this event?',
          type: 'text',
          rows: 3,
        }),
        defineField({
          name: 'questions',
          title: 'Questions or Comments',
          type: 'text',
          rows: 3,
          description: "Any questions or additional information you'd like to share",
        }),
        defineField({
          name: 'previousAttendance',
          title: 'Have you attended similar events before?',
          type: 'boolean',
        }),
        defineField({
          name: 'attendanceHistory',
          title: 'Previous Event Attendance',
          type: 'text',
          rows: 2,
          hidden: ({parent}) => !parent?.previousAttendance,
        }),
      ],
    }),
    defineField({
      name: 'consent',
      title: 'Consent & Agreements',
      type: 'object',
      fields: [
        defineField({
          name: 'photoConsent',
          title: 'Photo/Video Consent',
          type: 'boolean',
          description: 'I consent to being photographed/filmed during the event',
          initialValue: false,
        }),
        defineField({
          name: 'communicationConsent',
          title: 'Communication Consent',
          type: 'boolean',
          description: 'I consent to receive communications about future events',
          initialValue: false,
        }),
        defineField({
          name: 'dataProcessingConsent',
          title: 'Data Processing Consent',
          type: 'boolean',
          description: 'I consent to my data being processed for event organization',
          validation: (Rule) => Rule.required(),
          initialValue: false,
        }),
        defineField({
          name: 'termsAccepted',
          title: 'Terms & Conditions Accepted',
          type: 'boolean',
          description: 'I have read and accept the terms and conditions',
          validation: (Rule) => Rule.required(),
          initialValue: false,
        }),
      ],
    }),
    defineField({
      name: 'registrationStatus',
      title: 'Registration Status',
      type: 'string',
      options: {
        list: [
          {title: 'Submitted', value: 'submitted'},
          {title: 'Under Review', value: 'review'},
          {title: 'Approved', value: 'approved'},
          {title: 'Rejected', value: 'rejected'},
          {title: 'Cancelled', value: 'cancelled'},
          {title: 'Waitlisted', value: 'waitlisted'},
        ],
      },
      initialValue: 'submitted',
    }),
    defineField({
      name: 'registrationDate',
      title: 'Registration Date',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      readOnly: true,
    }),
    defineField({
      name: 'adminNotes',
      title: 'Admin Notes',
      type: 'text',
      rows: 3,
      description: 'Internal notes for event organizers',
    }),
    defineField({
      name: 'confirmationSent',
      title: 'Confirmation Email Sent',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'checkInStatus',
      title: 'Check-in Status',
      type: 'string',
      options: {
        list: [
          {title: 'Not Checked In', value: 'not-checked-in'},
          {title: 'Checked In', value: 'checked-in'},
          {title: 'No Show', value: 'no-show'},
        ],
      },
      initialValue: 'not-checked-in',
    }),
    defineField({
      name: 'checkInTime',
      title: 'Check-in Time',
      type: 'datetime',
    }),
  ],
  orderings: [
    {
      title: 'Registration Date (Newest First)',
      name: 'registrationDateDesc',
      by: [{field: 'registrationDate', direction: 'desc'}],
    },
    {
      title: 'Last Name (A-Z)',
      name: 'lastNameAsc',
      by: [{field: 'personalInfo.lastName', direction: 'asc'}],
    },
    {
      title: 'Registration Status',
      name: 'statusAsc',
      by: [{field: 'registrationStatus', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      firstName: 'personalInfo.firstName',
      lastName: 'personalInfo.lastName',
      email: 'personalInfo.email',
      eventTitle: 'event.title',
      status: 'registrationStatus',
      paymentStatus: 'paymentInfo.paymentStatus',
    },
    prepare({firstName, lastName, email, eventTitle, status, paymentStatus}) {
      return {
        title: `${firstName} ${lastName}`,
        subtitle: `${eventTitle} • ${status} • Payment: ${paymentStatus}`,
        description: email,
      }
    },
  },
})
