export const onlineGivingQuery = `
  *[_type == "onlineGiving"] | order(_createdAt desc) {
    _id,
    title,
    description,
    nigerianBankDetails {
      bankName,
      accountName,
      accountNumber,
      sortCode
    },
    foreignBankDetails {
      bankName,
      accountName,
      accountNumber,
      routingNumber,
      swiftCode,
      bankAddress
    },
    receiptSubmission {
      email,
      whatsappNumber,
      instructions
    },
    _createdAt,
    _updatedAt
  }
`;
