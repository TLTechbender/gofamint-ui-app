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
      className="ml-3 p-2 hover:bg-gray-50 transition-colors group"
      aria-label={`Copy ${fieldName}`}
    >
      {copiedField === fieldName ? (
        <Check size={16} className="text-blue-400" />
      ) : (
        <Copy size={16} className="text-gray-400 group-hover:text-blue-400" />
      )}
    </button>
  );

  const BankDetailCard: React.FC<BankDetailCardProps> = ({
    icon: Icon,
    label,
    value,
    copyKey,
  }) => (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
      <div className="flex items-center space-x-4">
        <Icon size={18} className="text-gray-400 flex-shrink-0" />
        <div className="min-w-0">
          <p className="text-sm font-medium text-black mb-1">{label}</p>
          <p className="text-sm text-black font-mono">{value}</p>
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
      <div className="bg-white border border-gray-200 p-8 hover:border-blue-400 transition-all max-w-lg w-full mx-auto">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-8 h-px bg-blue-400"></div>
          <h4 className="text-xl font-light text-black">{bank.bankName}</h4>
        </div>

        <div className="space-y-0">
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
    <div className="min-h-screen ">
      {/**Again a lot of stupid code */}
      <div className="pt-20 mb-2 bg-black h-16 w-full" />
      {givingDetails.map((giving: OnlineGiving) => (
        <div
          key={giving._id}
          className="max-w-6xl mx-auto px-6 md:px-8 py-20 md:py-24"
        >
          {/* Header Section - Clean and Minimal */}
          <div className="mb-20 md:mb-24">
            <div className="flex items-center justify-center space-x-3 mb-8">
              <div className="w-8 h-px bg-blue-400"></div>
              <span className="text-sm font-medium text-blue-400 tracking-widest uppercase">
                Give Generously
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-black mb-8 leading-tight text-center tracking-tight">
              {giving.title}
            </h1>
            <p className="text-lg md:text-xl text-black font-light leading-relaxed max-w-4xl mx-auto text-center">
              {giving.description}
            </p>
          </div>

          {/* Scripture Quote - Minimalist */}
          <div className="bg-gray-50 py-16 md:py-20 mb-20 md:mb-24">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center space-x-3 mb-8">
                <div className="w-6 h-px bg-blue-400"></div>
                <Gift className="w-6 h-6 text-blue-400" />
                <div className="w-6 h-px bg-blue-400"></div>
              </div>
              <blockquote className="text-2xl md:text-3xl font-light text-black mb-8 leading-relaxed italic">
                {` "Each of you should give what you have decided in your heart to
                give, not reluctantly or under compulsion, for God loves a
                cheerful giver."`}
              </blockquote>
              <cite className="text-base text-gray-600 font-light tracking-wide">
                — 2 Corinthians 9:7
              </cite>
            </div>
          </div>

          {/* Giving Method Selection - Clean Tabs */}
          <div className="mb-20 md:mb-24">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center space-x-3 mb-6">
                <div className="w-8 h-px bg-blue-400"></div>
                <span className="text-sm font-medium text-blue-400 tracking-widest uppercase">
                  Choose Method
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-light text-black">
                Select Your Preferred Giving Method
              </h2>
            </div>

            {/* Tab Buttons - Minimal Design */}
            <div className="flex flex-wrap justify-center gap-2 mb-12 border-b border-gray-200">
              <button
                onClick={() => setSelectedBankType("nigerian")}
                className={`flex items-center space-x-3 px-8 py-4 font-light transition-all border-b-2 ${
                  selectedBankType === "nigerian"
                    ? "border-blue-400 text-black"
                    : "border-transparent text-gray-600 hover:text-black hover:border-gray-300"
                }`}
              >
                <MapPin size={18} />
                <span>Nigerian Bank Transfer</span>
              </button>

              {giving?.foreignBankDetails && (
                <button
                  onClick={() => setSelectedBankType("foreign")}
                  className={`flex items-center space-x-3 px-8 py-4 font-light transition-all border-b-2 ${
                    selectedBankType === "foreign"
                      ? "border-blue-400 text-black"
                      : "border-transparent text-gray-600 hover:text-black hover:border-gray-300"
                  }`}
                >
                  <Globe size={18} />
                  <span>International Transfer</span>
                </button>
              )}

              <button
                onClick={() => setSelectedBankType("online")}
                className={`flex items-center space-x-3 px-8 py-4 font-light transition-all border-b-2 ${
                  selectedBankType === "online"
                    ? "border-blue-400 text-black"
                    : "border-transparent text-gray-600 hover:text-black hover:border-gray-300"
                }`}
              >
                <CreditCard size={18} />
                <span>Online Payment</span>
              </button>
            </div>

            {/* Bank Details Section - Clean Cards */}
            {selectedBankType !== "online" ? (
              <div className="space-y-8">
                <div className="text-center mb-12">
                  <h3 className="text-xl md:text-2xl font-light text-black">
                    {selectedBankType === "nigerian"
                      ? "Nigerian Bank Transfer Details"
                      : "International Wire Transfer Details"}
                  </h3>
                </div>

                <div className="flex justify-center">
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
              <div className="bg-white border border-gray-200 p-12 text-center max-w-2xl mx-auto">
                <div className="flex items-center justify-center space-x-3 mb-6">
                  <div className="w-6 h-px bg-blue-400"></div>
                  <CreditCard className="w-6 h-6 text-blue-400" />
                  <div className="w-6 h-px bg-blue-400"></div>
                </div>
                <h3 className="text-2xl font-light text-black mb-4">
                  Online Payments Coming Soon
                </h3>
                <p className="text-black font-light mb-8 leading-relaxed">
                    {`We're working on integrating secure online payment options for
                  your convenience.`}
                </p>
                <button
                  onClick={() => setSelectedBankType("nigerian")}
                  className="inline-flex items-center px-8 py-3 bg-blue-400 text-white font-light hover:bg-blue-500 transition-colors"
                >
                  Use Bank Transfer Instead
                  <ArrowRight className="ml-3 w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Receipt Submission - Clean Design */}
          <div className="mb-20 md:mb-24">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <div className="flex items-center justify-center space-x-3 mb-6">
                  <div className="w-8 h-px bg-blue-400"></div>
                  <span className="text-sm font-medium text-blue-400 tracking-widest uppercase">
                    Submit Receipt
                  </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-light text-black mb-6">
                  Send Your Payment Receipt
                </h3>
                <p className="text-black font-light leading-relaxed">
                  After making your donation, please send your payment receipt
                  through one of the following channels for proper
                  documentation.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-12">
                {giving.receiptSubmission.email && (
                  <a
                    href={`mailto:${giving.receiptSubmission.email}`}
                    className="block group"
                  >
                    <div className="bg-white border border-gray-200 p-6 hover:border-blue-400 transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Mail
                            size={20}
                            className="text-gray-400 flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-black mb-1">
                              Email
                            </p>
                            <p className="text-sm text-black font-light">
                              {giving.receiptSubmission.email}
                            </p>
                          </div>
                        </div>
                        <CopyButton
                          text={giving.receiptSubmission.email}
                          fieldName="email"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>
                  </a>
                )}

                {giving.receiptSubmission.whatsappNumber && (
                  <a
                    href={`https://wa.me/${giving.receiptSubmission.whatsappNumber.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group"
                  >
                    <div className="bg-white border border-gray-200 p-6 hover:border-blue-400 transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <MessageCircle
                            size={20}
                            className="text-gray-400 flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-black mb-1">
                              WhatsApp
                            </p>
                            <p className="text-sm text-black font-light">
                              {giving.receiptSubmission.whatsappNumber}
                            </p>
                          </div>
                        </div>
                        <CopyButton
                          text={giving.receiptSubmission.whatsappNumber}
                          fieldName="whatsapp"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>
                  </a>
                )}
              </div>

              <div className="bg-blue-50 border-l-2 border-blue-400 p-6">
                <p className="text-sm text-black font-light leading-relaxed">
                  {giving.receiptSubmission.instructions}
                </p>
              </div>
            </div>
          </div>

          {/* Thank You Section - Minimal */}
          <div className="text-center bg-gray-50 py-16 md:py-20">
            <div className="flex items-center justify-center space-x-3 mb-8">
              <div className="w-6 h-px bg-blue-400"></div>
              <Heart className="w-6 h-6 text-blue-400" />
              <div className="w-6 h-px bg-blue-400"></div>
            </div>
            <h3 className="text-3xl md:text-4xl font-light text-black mb-8 leading-tight">
              Thank You for Your Generosity
            </h3>
            <p className="text-lg text-black font-light max-w-3xl mx-auto leading-relaxed">
              {`Your donation is more than a gift—it's a seed of hope that will
              grow into blessings for our community. We are deeply grateful for
              your heart of giving and your partnership in our mission.`}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OnlineGivingComponent;
