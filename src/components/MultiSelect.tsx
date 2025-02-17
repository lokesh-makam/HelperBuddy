import React, { useState } from "react";

interface MultiSelectProps {
  label: string;
  defaultSelected?: string[];
  onChange?: (selected: string[]) => void;
  disabled?: boolean;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  defaultSelected = [],
  onChange,
  disabled = false,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(defaultSelected);
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      e.preventDefault();
      if (!selectedOptions.includes(inputValue.trim())) {
        const newSelectedOptions = [...selectedOptions, inputValue.trim()];
        setSelectedOptions(newSelectedOptions);
        if (onChange) onChange(newSelectedOptions);
      }
      setInputValue("");
    }
  };

  const removeOption = (value: string) => {
    const newSelectedOptions = selectedOptions.filter((opt) => opt !== value);
    setSelectedOptions(newSelectedOptions);
    if (onChange) onChange(newSelectedOptions);
  };

  return (
    <div className="w-full">
      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
        {label}
      </label>

      <div className="relative w-full">
        <div className="mb-2 flex h-11 items-center rounded-lg border border-gray-300 py-1.5 px-3 shadow-sm outline-none transition focus:border-blue-400 dark:border-gray-700 dark:bg-gray-900 dark:focus:border-blue-400">
          <div className="flex flex-wrap gap-2">
            {selectedOptions.map((text, index) => (
              <div
                key={index}
                className="group flex items-center rounded-full bg-gray-200 px-3 py-1 text-sm text-gray-800 dark:bg-gray-800 dark:text-white"
              >
                {text}
                <button
                  onClick={() => removeOption(text)}
                  className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <input
            type="text"
            placeholder="Enter pincodes..."
            className="ml-2 flex-1 border-0 bg-transparent text-sm outline-none placeholder-gray-500 dark:placeholder-gray-400"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
};

export default MultiSelect;
