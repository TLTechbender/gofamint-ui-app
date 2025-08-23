import { checkApplicationStatus } from "@/actions/author/apply";
import ApplyPageClient from "./ApplyPageClient";

// Type for validation errors to match your server action
type ValidationErrors = {
  bio?: string[];
  profilePicture?: string[];
};

///With my overall logic I am also limiting how many applications can be sent, would do a cron job somewhere to reset the  stuff in sanity later man

// Status Components with Minimalist Design
const AlreadyAuthorStatus = () => (
  <div className="min-h-[60vh] flex items-center justify-center bg-white">
    <div className="max-w-2xl mx-auto px-6 text-center">
      <div className="flex items-center justify-center space-x-3 mb-8">
        <div className="w-12 h-px bg-blue-400"></div>
        <span className="text-sm font-medium text-blue-400 tracking-widest uppercase">
          Author Status
        </span>
      </div>

      <div className="w-16 h-16 mx-auto mb-8 bg-blue-50 flex items-center justify-center">
        <svg
          className="w-8 h-8 text-blue-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      <h1 className="text-3xl md:text-4xl font-light text-black mb-6 leading-tight">
        {`You're Already an Author`}
      </h1>
      <p className="text-lg text-black font-light leading-relaxed mb-8 max-w-lg mx-auto">
        You have full access to create and publish blog posts. Start writing
        your next article today.
      </p>

      <a
        href="/dashboard/blogs"
        className="inline-flex items-center space-x-2 bg-white border border-blue-400 text-blue-500 hover:bg-blue-50 transition-colors duration-300 px-6 py-3 font-medium tracking-wide"
      >
        <span>Go to Dashboard</span>
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </a>
    </div>
  </div>
);

const PendingStatus = () => (
  <div className="min-h-[60vh] flex items-center justify-center bg-white">
    <div className="max-w-2xl mx-auto px-6 text-center">
      <div className="flex items-center justify-center space-x-3 mb-8">
        <div className="w-12 h-px bg-blue-400"></div>
        <span className="text-sm font-medium text-blue-400 tracking-widest uppercase">
          Under Review
        </span>
      </div>

      <div className="w-16 h-16 mx-auto mb-8 bg-blue-50 flex items-center justify-center relative">
        <svg
          className="w-8 h-8 text-blue-400 animate-pulse"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        {/* Subtle spinning border */}
        <div
          className="absolute inset-0 border border-blue-200 animate-spin"
          style={{ animationDuration: "3s" }}
        ></div>
      </div>

      <h1 className="text-3xl md:text-4xl font-light text-black mb-6 leading-tight">
        Application Under Review
      </h1>
      <p className="text-lg text-black font-light leading-relaxed mb-8 max-w-lg mx-auto">
        Your author application is currently being reviewed by our leadership.{" "}
        {`We'll`}
        notify you once a decision has been made.
      </p>

     
    </div>
  </div>
);

const ApprovedStatus = () => (
  <div className="min-h-[60vh] flex items-center justify-center bg-white">
    <div className="max-w-2xl mx-auto px-6 text-center">
      <div className="flex items-center justify-center space-x-3 mb-8">
        <div className="w-12 h-px bg-blue-400"></div>
        <span className="text-sm font-medium text-blue-400 tracking-widest uppercase">
          Congratulations
        </span>
      </div>

      <div className="w-16 h-16 mx-auto mb-8 bg-blue-50 flex items-center justify-center">
        <svg
          className="w-8 h-8 text-blue-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <h1 className="text-3xl md:text-4xl font-light text-black mb-6 leading-tight">
        Welcome to GSF UI Publishing
      </h1>
    </div>
  </div>
);

const RejectedStatus = ({
  reason,
}: {
  reason: string | ValidationErrors | null;
}) => {
  // Helper function to render error messages
  const renderErrorMessage = () => {
    if (!reason) return "No reason provided";

    if (typeof reason === "string") {
      return reason;
    }

    // Handle ValidationErrors object
    const errors: string[] = [];
    if (reason.bio) errors.push(...reason.bio);
    if (reason.profilePicture) errors.push(...reason.profilePicture);

    return errors.length > 0
      ? errors.join(", ")
      : "No specific reason provided";
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-white">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <div className="flex items-center justify-center space-x-3 mb-8">
          <div className="w-12 h-px bg-gray-400"></div>
          <span className="text-sm font-medium text-gray-500 tracking-widest uppercase">
            Not Approved
          </span>
        </div>

        <div className="w-16 h-16 mx-auto mb-8 bg-gray-50 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        <h1 className="text-3xl md:text-4xl font-light text-black mb-6 leading-tight">
          Application Not Approved
        </h1>
        <p className="text-lg text-black font-light leading-relaxed mb-8 max-w-lg mx-auto">
          Unfortunately, your author application was not approved at this time.
          You can review the feedback and reapply.
        </p>

        {reason && renderErrorMessage() !== "No reason provided" && (
          <div className="bg-gray-50 p-6 max-w-md mx-auto mb-8">
            <p className="text-sm font-medium text-black mb-2">Feedback:</p>
            <p className="text-sm text-black font-light italic">
              {`"${renderErrorMessage()}"`}
            </p>
          </div>
        )}

        <span className="inline-flex items-center space-x-2 bg-blue-400 hover:bg-blue-500 text-white transition-colors duration-300 px-6 py-3 font-medium tracking-wide">
          {`We'll let you know when you would be eligible to apply again, may the Good Lord bless you`}
        </span>
      </div>
    </div>
  );
};

const NoApplicationStatus = () => <ApplyPageClient />;

const ErrorStatus = ({
  message,
  errors,
}: {
  message: string;
  errors: string | ValidationErrors | null;
}) => {
  // Helper function to render error messages
  const renderErrorMessage = () => {
    if (!errors) return null;

    if (typeof errors === "string") {
      return errors;
    }

    // Handle ValidationErrors object
    const errorMessages: string[] = [];
    if (errors.bio) errorMessages.push(...errors.bio);
    if (errors.profilePicture) errorMessages.push(...errors.profilePicture);

    return errorMessages.length > 0 ? errorMessages.join(", ") : null;
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-white">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <div className="flex items-center justify-center space-x-3 mb-8">
          <div className="w-12 h-px bg-red-400"></div>
          <span className="text-sm font-medium text-red-400 tracking-widest uppercase">
            Error
          </span>
        </div>

        <div className="w-16 h-16 mx-auto mb-8 bg-red-50 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>

        <h1 className="text-3xl md:text-4xl font-light text-black mb-6 leading-tight">
          Something Went Wrong
        </h1>
        <p className="text-lg text-black font-light leading-relaxed mb-8 max-w-lg mx-auto">
          {message === "Unauthorized"
            ? "Please sign in to access author applications."
            : "We encountered an issue while checking your application status."}
        </p>

        {renderErrorMessage() && (
          <div className="bg-red-50 p-6 max-w-md mx-auto mb-8">
            <p className="text-sm text-red-800 font-light">
              {renderErrorMessage()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Main Apply Page Component
export default async function ApplyPage() {
  const applicationStatusCheck = await checkApplicationStatus();

  // Render appropriate component based on status
  const renderStatusComponent = () => {
    if (!applicationStatusCheck.success) {
      return (
        <ErrorStatus
          message={applicationStatusCheck.message}
          errors={applicationStatusCheck.errors}
        />
      );
    }

    switch (applicationStatusCheck.message) {
      case "User is already an author":
        return <AlreadyAuthorStatus />;

      case "pending":
        return <PendingStatus />;

      case "approved":
        return <ApprovedStatus />;

      case "rejected":
        return <RejectedStatus reason={applicationStatusCheck.errors} />;

      case "no_application":
        return <NoApplicationStatus />;

      default:
        return (
          <ErrorStatus
            message="Unknown status"
            errors={`Unexpected status: ${applicationStatusCheck.message}`}
          />
        );
    }
  };

  return (
    <>
     
      <div className="bg-black h-16 mb-2 w-full flex-shrink-0" />
      <main className="bg-white">{renderStatusComponent()}</main>
    </>
  );
}
