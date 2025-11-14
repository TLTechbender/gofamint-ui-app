type DateInput = string | number | Date;

const isValidDate = (date: unknown): date is Date => {
  return date instanceof Date && !isNaN(date.getTime());
};

const toDate = (dateInput: DateInput): Date => {
  const date = new Date(dateInput);
  if (!isValidDate(date)) {
    throw new Error(`Invalid date input: ${dateInput}`);
  }
  return date;
};

const formatDate = (dateString: DateInput): string => {
  try {
    const date = toDate(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
};

const timeAgo = (dateString: DateInput): string => {
  try {
    const now = new Date();
    const date = toDate(dateString);

    if (!isValidDate(now) || !isValidDate(date)) {
      return "Invalid date";
    }

    const diffInMs = now.getTime() - date.getTime();

    if (diffInMs < 0) {
      return "In the future";
    }

    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return formatDate(date);
  } catch (error) {
    console.error("Error calculating time ago:", error);
    return "Invalid date";
  }
};

const timeAgoDetailed = (dateString: DateInput): string => {
  try {
    const now = new Date();
    const date = toDate(dateString);

    if (!isValidDate(now) || !isValidDate(date)) {
      return "Invalid date";
    }

    const diffInMs = now.getTime() - date.getTime();

    if (diffInMs < 0) {
      return "In the future";
    }

    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInWeeks = Math.floor(diffInDays / 7);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInDays / 365);

    if (diffInSeconds < 60) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    if (diffInWeeks < 4) return `${diffInWeeks}w ago`;
    if (diffInMonths < 12) return `${diffInMonths}mo ago`;
    if (diffInYears === 1) return "1 year ago";
    if (diffInYears > 1) return `${diffInYears} years ago`;

    return formatDate(date);
  } catch (error) {
    console.error("Error calculating detailed time ago:", error);
    return "Invalid date";
  }
};

const isValidDateString = (dateString: unknown): dateString is string => {
  if (typeof dateString !== "string") return false;
  const date = new Date(dateString);
  return isValidDate(date);
};

export {
  formatDate,
  timeAgo,
  timeAgoDetailed,
  isValidDate,
  isValidDateString,
  toDate,
  type DateInput,
};
