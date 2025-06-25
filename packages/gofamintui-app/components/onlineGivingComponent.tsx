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
  Banknote,
  ArrowRight,
} from "lucide-react";
import {
  ForeignBankDetails,
  NigerianBankDetails,
  OnlineGiving,
} from "@/sanity/interfaces/onlineGiving";

type BankType = "nigerian" | "foreign" | "online";
type CopiedFieldType = string | null;

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

  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const CopyButton: React.FC<
    CopyButtonProps & { onClick?: (e: React.MouseEvent) => void }
  > = ({ text, fieldName, onClick }) => (
    <button
      onClick={(e) => {
        if (onClick) onClick(e);
        copyToClipboard(text, fieldName);
      }}
      className="ml-2 p-1.5 rounded-md bg-blue-50 hover:bg-blue-100 transition-colors group"
      aria-label={`Copy ${fieldName}`}
    >
      {copiedField === fieldName ? (
        <Check size={16} className="text-green-600" />
      ) : (
        <Copy size={16} className="text-blue-600 group-hover:text-blue-700" />
      )}
    </button>
  );

  const BankDetailCard: React.FC<BankDetailCardProps> = ({
    icon: Icon,
    label,
    value,
    copyKey,
  }) => (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-100">
      <div className="flex items-center space-x-3">
        <Icon size={18} className="text-gray-500 flex-shrink-0" />
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{label}</p>
          <p className="text-sm text-gray-600 font-mono truncate">{value}</p>
        </div>
      </div>
      <CopyButton text={value} fieldName={copyKey} />
    </div>
  );

  const BankCard: React.FC<BankCardProps> = ({ bank, bankType }) => {
    const isNigerianBank = (
      bank: NigerianBankDetails | ForeignBankDetails
    ): bank is NigerianBankDetails => {
      return bankType === "nigerian";
    };

    const isForeignBank = (
      bank: NigerianBankDetails | ForeignBankDetails
    ): bank is ForeignBankDetails => {
      return bankType === "foreign";
    };

    return (
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:border-blue-300 transition-all max-w-md w-full mx-auto">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Banknote className="w-5 h-5 text-blue-600 mr-2" />
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
              {bank.sortCode && (
                <BankDetailCard
                  icon={CreditCard}
                  label="Sort Code"
                  value={bank.sortCode}
                  copyKey={`${bank.bankName}-sort-code`}
                />
              )}
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
    <div className="min-h-screen bg-gray-50">
      {givingDetails.map((giving: OnlineGiving) => (
        <div key={giving._id} className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-6">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {giving.title}
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {giving.description}
            </p>
          </div>

          {/* Inspiration Quote */}
          <div className="bg-blue-600 rounded-xl p-6 sm:p-8 mb-12 text-white text-center">
            <Gift className="w-10 h-10 mx-auto mb-4 opacity-90" />
            <blockquote className="text-xl font-medium mb-4">
              "Each of you should give what you have decided in your heart to
              give, not reluctantly or under compulsion, for God loves a
              cheerful giver."
            </blockquote>
            <cite className="text-blue-100">— 2 Corinthians 9:7</cite>
          </div>

          {/* Giving Options */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
              Choose Your Giving Method
            </h2>

            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <button
                onClick={() => setSelectedBankType("nigerian")}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  selectedBankType === "nigerian"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                <MapPin size={18} />
                <span>Nigerian Bank Transfer</span>
              </button>

              {giving?.foreignBankDetails && (
                <button
                  onClick={() => setSelectedBankType("foreign")}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
                    selectedBankType === "foreign"
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                  }`}
                >
                  <Globe size={18} />
                  <span>International Transfer</span>
                </button>
              )}

              {/* Placeholder for future online payment integration */}
              <button
                onClick={() => setSelectedBankType("online")}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  selectedBankType === "online"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                }`}
                // disabled
              >
                <CreditCard size={18} />
                <span>Online Payment (Coming Soon)</span>
              </button>
            </div>

            {/* Bank Details Section */}
            {selectedBankType !== "online" ? (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                  {selectedBankType === "nigerian"
                    ? "Nigerian Bank Details"
                    : "International Bank Details"}
                </h3>

                <div className="flex flex-wrap justify-center gap-6">
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
            ) : (
              <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
                <div className="max-w-md mx-auto">
                  <CreditCard className="w-12 h-12 mx-auto text-blue-500 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Online Payments Coming Soon
                  </h3>
                  <p className="text-gray-600 mb-6">
                    We're working on integrating secure online payment options
                    for your convenience.
                  </p>
                  <button
                    onClick={() => setSelectedBankType("nigerian")}
                    className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Use Bank Transfer Instead
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Receipt Submission */}
          <div className="max-w-3xl mx-auto mb-12">
            <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8 border border-gray-200">
              <div className="flex items-center mb-6">
                <Mail className="w-6 h-6 text-green-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">
                  Submit Your Payment Receipt
                </h3>
              </div>

              <p className="text-gray-600 mb-6">
                After making your donation, please send your payment receipt to
                one of the following channels for proper documentation:
              </p>

              <div className="space-y-4 mb-6">
                {giving.receiptSubmission.email && (
                  <a
                    href={`mailto:${giving.receiptSubmission.email}`}
                    className="block"
                  >
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors border border-green-100 cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <Mail
                          size={18}
                          className="text-green-600 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            Email
                          </p>
                          <p className="text-sm text-green-600 truncate">
                            {giving.receiptSubmission.email}
                          </p>
                        </div>
                      </div>
                      <CopyButton
                        text={giving.receiptSubmission.email}
                        fieldName="email"
                        onClick={(e) => e.stopPropagation()} // Prevent mailto when copying
                      />
                    </div>
                  </a>
                )}

                {giving.receiptSubmission.whatsappNumber && (
                  <a
                    href={`https://wa.me/${giving.receiptSubmission.whatsappNumber.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors border border-green-100 cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <MessageCircle
                          size={18}
                          className="text-green-600 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            WhatsApp
                          </p>
                          <p className="text-sm text-green-600 truncate">
                            {giving.receiptSubmission.whatsappNumber}
                          </p>
                        </div>
                      </div>
                      <CopyButton
                        text={giving.receiptSubmission.whatsappNumber}
                        fieldName="whatsapp"
                        onClick={(e) => e.stopPropagation()} // Prevent WhatsApp redirect when copying
                      />
                    </div>
                  </a>
                )}
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-sm text-blue-800 leading-relaxed">
                  {giving.receiptSubmission.instructions}
                </p>
              </div>
            </div>
          </div>

          {/* Thank You Message */}
          <div className="text-center bg-white rounded-xl shadow-sm p-8 border border-gray-200">
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
