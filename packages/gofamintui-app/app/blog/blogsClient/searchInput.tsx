"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useTransition, useState, useEffect } from "react";

interface SearchInputProps {
  placeholder?: string;
  className?: string;
}

export function SearchInput({
  placeholder = "Search blog posts...",
  className = "",
}: SearchInputProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const urlSearchTerm = searchParams.get("search") || "";
  const [inputValue, setInputValue] = useState(urlSearchTerm);

  // Sync input with URL when URL changes (e.g., back/forward navigation)
  useEffect(() => {
    setInputValue(urlSearchTerm);
  }, [urlSearchTerm]);

  // Debounced update to URL
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (inputValue.trim()) {
        params.set("search", inputValue);
      } else {
        params.delete("search");
      }

      const newUrl = `${pathname}?${params.toString()}`;
      const currentUrl = `${pathname}?${searchParams.toString()}`;

      // Only update if URL actually changed
      if (newUrl !== currentUrl) {
        startTransition(() => {
          router.replace(newUrl);
        });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [inputValue, searchParams, router, pathname]);

  return (
    <div className="relative">
      <input
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className={`
          w-full px-4 py-2 border border-gray-300 rounded-lg 
          focus:ring-2 focus:ring-blue-500 focus:border-transparent 
          outline-none transition-all duration-200
          ${isPending ? "opacity-50" : ""}
          ${className}
        `}
      />
      {isPending && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}
