"use client";
import React, { useState } from "react";
import ComponentCard from "../common/ComponentCard";
import Label from "../Label";
import MultiSelect from "../MultiSelect";

export default function SelectInputs() {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  const handleMultiSelectChange = (values: string[]) => {
    setSelectedValues(values);
  };
  const options = [
    { value: "marketing", label: "Marketing" },
    { value: "template", label: "Template" },
    { value: "development", label: "Development" },
  ];

  return (
    <ComponentCard title="Select Inputs">
      <div className="space-y-6">
        <div>
          <Label>Select Input</Label>
        </div>
        <div className="relative">
          <MultiSelect
            label="Serviceable Pincodes"
            defaultSelected={["394210"]}
            onChange={(values) => setSelectedValues(values)}
          />
          <p className="sr-only">
            Selected Values: {selectedValues.join(", ")}
          </p>
        </div>
      </div>
    </ComponentCard>
  );
}
