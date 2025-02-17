import React, { useState } from "react";

interface MultiSelectOptionProps {
  label: string;
  listOfTexts: string[];
  defaultSelected?: string[];
  onChange?: (selected: string[]) => void;
  disabled?: boolean;
}

const MultiSelectOption: React.FC<MultiSelectOptionProps> = ({
  label,
  listOfTexts,
  defaultSelected = [],
  onChange,
  disabled = false,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(defaultSelected);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleDropdown = () => {
    if (disabled) return;
    setIsOpen((prev) => !prev);
    setSearchTerm(""); // Reset search when opening
  };

  const handleSelect = (optionValue: string) => {
    if (!selectedOptions.includes(optionValue)) {
      const newSelectedOptions = [...selectedOptions, optionValue];
      setSelectedOptions(newSelectedOptions);
      if (onChange) onChange(newSelectedOptions);
    }
  };

  const removeOption = (value: string) => {
    const newSelectedOptions = selectedOptions.filter((opt) => opt !== value);
    setSelectedOptions(newSelectedOptions);
    if (onChange) onChange(newSelectedOptions);
  };

  const filteredOptions = listOfTexts
    .filter((text) => !selectedOptions.includes(text)) // Hide selected items
    .filter((text) => text.toLowerCase().includes(searchTerm.toLowerCase())); // Filter by search

  return (
    <div className="w-full">
      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
        {label}
      </label>

      <div className="relative z-20 inline-block w-full">
        <div className="relative flex flex-col items-center">
          <div className="w-full">
            <div
              onClick={toggleDropdown}
              className="mb-2 flex h-11 rounded-lg border border-gray-300 py-1.5 pl-3 pr-3 shadow-theme-xs outline-none transition focus:border-brand-300 focus:shadow-focus-ring dark:border-gray-700 dark:bg-gray-900 dark:focus:border-brand-300 cursor-pointer"
            >
              <div className="flex flex-wrap flex-auto gap-2">
                {selectedOptions.length > 0 ? (
                  selectedOptions.map((text, index) => (
                    <div
                      key={index}
                      className="group flex items-center justify-center rounded-full border-[0.7px] border-transparent bg-gray-100 py-1 pl-2.5 pr-2 text-sm text-gray-800 hover:border-gray-200 dark:bg-gray-800 dark:text-white/90 dark:hover:border-gray-800"
                    >
                      <span className="flex-initial max-w-full">{text}</span>
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          removeOption(text);
                        }}
                        className="pl-2 text-gray-500 cursor-pointer group-hover:text-gray-400 dark:text-gray-400"
                      >
                        ✕
                      </div>
                    </div>
                  ))
                ) : (
                  <span className="text-gray-500 dark:text-gray-400">
                    Select services...
                  </span>
                )}
              </div>
            </div>
          </div>

          {isOpen && (
            <div
              className="absolute left-0 z-40 w-full bg-white rounded-lg shadow top-full dark:bg-gray-900"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 border-b border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white outline-none"
                autoFocus
              />
              <div className="max-h-40 overflow-y-auto">
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((text, index) => (
                    <div key={index}>
                      <div
                        className="hover:bg-primary/5 w-full cursor-pointer rounded-t border-b border-gray-200 dark:border-gray-800 p-2"
                        onClick={() => handleSelect(text)}
                      >
                        <span className="text-gray-800 dark:text-white/90">
                          {text}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-2 text-gray-500 dark:text-gray-400">
                    No options found
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultiSelectOption;
