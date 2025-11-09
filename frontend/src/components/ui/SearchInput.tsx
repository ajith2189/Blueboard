import React, { memo } from "react";
import { Search, X } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onClear?: () => void;
  className?: string;
}

const SearchInput: React.FC<SearchInputProps> = memo(({
  value,
  onChange,
  placeholder = "Search...",
  onClear,
  className = "",
}) => {
  return (
    <div className={`relative w-full max-w-md ${className}`}>
      {/* Search icon on left */}
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />

      {/* Input field */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-3 rounded-2xl border-0 bg-gray-100 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-600 transition-all duration-200"
      />

      {/* X clear button (only visible if there's text) */}
      {value && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
          aria-label="Clear search"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
});

SearchInput.displayName = "SearchInput";

export default SearchInput;