// TypeScript interface for the onlineGiving Sanity query result

export interface NigerianBankDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
  sortCode: string;
}

export interface ForeignBankDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
  routingNumber: string;
  swiftCode: string;
  bankAddress: string;
}

export interface ReceiptSubmission {
  email: string;
  whatsappNumber: string;
  instructions: string;
}

export interface OnlineGiving {
  _id: string;
  title: string;
  description: string;
  nigerianBankDetails: NigerianBankDetails | null;
  foreignBankDetails: ForeignBankDetails;
  receiptSubmission: ReceiptSubmission;
  createdAt: string; // ISO date string
  _updatedAt: string; // ISO date string
}
