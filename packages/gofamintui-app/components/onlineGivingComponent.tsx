"use client";
import React, { useState } from "react";
import {
  Heart,
  Copy,
  Check,
  Mail,
  MessageCircle,
  Globe,
  MapPin,
  CreditCard,
  Gift,
  LucideIcon,
} from "lucide-react";
import {
  ForeignBankDetails,
  NigerianBankDetails,
  OnlineGiving,
} from "@/sanity/interfaces/onlineGiving";

type BankType = "nigerian" | "foreign";
type CopiedFieldType = string | null;

// Component prop interfaces
interface CopyButtonProps {
  text: string;
  fieldName: string;
}

interface BankDetailCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  copyKey: string;
}

interface BankCardProps {
  bank: NigerianBankDetails | ForeignBankDetails;
  bankType: BankType;
}

const OnlineGivingComponent = ({
  givingDetails,
}: {
  givingDetails: OnlineGiving[];
}) => {

  const [copiedField, setCopiedField] = useState<CopiedFieldType>(null);
  const [selectedBankType, setSelectedBankType] =
    useState<BankType>("nigerian");

  const copyToClipboard = async (
    text: string,
    fieldName: string
  ): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const CopyButton: React.FC<CopyButtonProps> = ({ text, fieldName }) => (
    <button
      onClick={() => copyToClipboard(text, fieldName)}
      className="ml-2 p-1 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors group"
      title="Copy to clipboard"
    >
      {copiedField === fieldName ? (
        <Check size={14} className="text-green-600" />
      ) : (
        <Copy size={14} className="text-blue-600 group-hover:text-blue-700" />
      )}
    </button>
  );

  const BankDetailCard: React.FC<BankDetailCardProps> = ({
    icon: Icon,
    label,
    value,
    copyKey,
  }) => (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="flex items-center space-x-3">
        <Icon size={18} className="text-gray-600" />
        <div>
          <p className="text-sm font-medium text-gray-900">{label}</p>
          <p className="text-sm text-gray-600 font-mono">{value}</p>
        </div>
      </div>
      <CopyButton text={value} fieldName={copyKey} />
    </div>
  );

  const BankCard: React.FC<BankCardProps> = ({ bank, bankType }) => {
    // Type guard to check if bank is Nigerian bank
    const isNigerianBank = (
      bank: NigerianBankDetails | ForeignBankDetails
    ): bank is NigerianBankDetails => {
      return bankType === "nigerian";
    };

    // Type guard to check if bank is Foreign bank
    const isForeignBank = (
      bank: NigerianBankDetails | ForeignBankDetails
    ): bank is ForeignBankDetails => {
      return bankType === "foreign";
    };

    return (
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <CreditCard className="w-5 h-5 text-blue-500 mr-2" />
          {bank.bankName}
        </h4>

        <div className="space-y-3">
          {isNigerianBank(bank) ? (
            <>
              <BankDetailCard
                icon={CreditCard}
                label="Account Name"
                value={bank.accountName}
                copyKey={`${bank.bankName}-account-name`}
              />
              <BankDetailCard
                icon={CreditCard}
                label="Account Number"
                value={bank.accountNumber}
                copyKey={`${bank.bankName}-account-number`}
              />
              <BankDetailCard
                icon={CreditCard}
                label="Sort Code"
                value={bank.sortCode}
                copyKey={`${bank.bankName}-sort-code`}
              />
            </>
          ) : isForeignBank(bank) ? (
            <>
              <BankDetailCard
                icon={CreditCard}
                label="Account Name"
                value={bank.accountName}
                copyKey={`${bank.bankName}-account-name`}
              />
              <BankDetailCard
                icon={CreditCard}
                label="Account Number/IBAN"
                value={bank.accountNumber}
                copyKey={`${bank.bankName}-account-number`}
              />
              {bank.routingNumber && (
                <BankDetailCard
                  icon={CreditCard}
                  label="Routing Number"
                  value={bank.routingNumber}
                  copyKey={`${bank.bankName}-routing`}
                />
              )}
              {bank.swiftCode && (
                <BankDetailCard
                  icon={CreditCard}
                  label="SWIFT/BIC Code"
                  value={bank.swiftCode}
                  copyKey={`${bank.bankName}-swift`}
                />
              )}
              {bank.bankAddress && (
                <BankDetailCard
                  icon={MapPin}
                  label="Bank Address"
                  value={bank.bankAddress}
                  copyKey={`${bank.bankName}-address`}
                />
              )}
            </>
          ) : null}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {givingDetails.map((giving: OnlineGiving) => (
        <div key={giving._id} className="max-w-7xl mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {giving.title}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {giving.description}
            </p>
          </div>

          {/* Inspiration Quote */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 mb-12 text-white text-center">
            <Gift className="w-12 h-12 mx-auto mb-4 opacity-80" />
            <blockquote className="text-xl font-medium mb-4">
              "Each of you should give what you have decided in your heart to
              give, not reluctantly or under compulsion, for God loves a
              cheerful giver."
            </blockquote>
            <cite className="text-blue-100">— 2 Corinthians 9:7</cite>
          </div>

          {/* Bank Selection */}
          <div className="mb-8">
            <div className="flex justify-center space-x-4 mb-6">
              <button
                onClick={() => setSelectedBankType("nigerian")}
                className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all ${
                  selectedBankType === "nigerian"
                    ? "bg-blue-500 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                <MapPin size={18} />
                <span>Nigerian Bank</span>
              </button>
              {/* Only show international button if foreignBankDetails exists */}
              {giving?.foreignBankDetails && (
                <button
                  onClick={() => setSelectedBankType("foreign")}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all ${
                    selectedBankType === "foreign"
                      ? "bg-blue-500 text-white shadow-lg"
                      : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                  }`}
                >
                  <Globe size={18} />
                  <span>International Banks</span>
                </button>
              )}
            </div>
          </div>

          {/* Bank Details Grid */}
          <div className="mb-12">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
              {selectedBankType === "nigerian"
                ? "Nigerian Bank Options"
                : "International Bank Options"}
            </h3>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {selectedBankType === "nigerian"
                ? giving?.nigerianBankDetails && (
                    <BankCard
                      key={giving.nigerianBankDetails.bankName}
                      bank={giving.nigerianBankDetails}
                      bankType="nigerian"
                    />
                  )
                : giving?.foreignBankDetails && (
                    <BankCard
                      key={giving.foreignBankDetails.bankName}
                      bank={giving.foreignBankDetails}
                      bankType="foreign"
                    />
                  )}
            </div>
          </div>

          {/* Receipt Submission */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center mb-6">
                <Mail className="w-6 h-6 text-green-500 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">
                  Submit Your Receipt
                </h3>
              </div>

              <div className="space-y-4 mb-6">
                {giving.receiptSubmission.email && (
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <Mail size={18} className="text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Email
                        </p>
                        <p className="text-sm text-green-600">
                          {giving.receiptSubmission.email}
                        </p>
                      </div>
                    </div>
                    <CopyButton
                      text={giving.receiptSubmission.email}
                      fieldName="email"
                    />
                  </div>
                )}

                {giving.receiptSubmission.whatsappNumber && (
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <MessageCircle size={18} className="text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          WhatsApp
                        </p>
                        <p className="text-sm text-green-600">
                          {giving.receiptSubmission.whatsappNumber}
                        </p>
                      </div>
                    </div>
                    <CopyButton
                      text={giving.receiptSubmission.whatsappNumber}
                      fieldName="whatsapp"
                    />
                  </div>
                )}
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800 leading-relaxed">
                  {giving.receiptSubmission.instructions}
                </p>
              </div>
            </div>
          </div>

          {/* Thank You Message */}
          <div className="text-center bg-white rounded-2xl shadow-lg p-8">
            <Heart className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Thank You for Your Generosity
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Your donation is more than a gift—it's a seed of hope that will
              grow into blessings for our community. We are deeply grateful for
              your heart of giving and your partnership in our mission.
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OnlineGivingComponent;
