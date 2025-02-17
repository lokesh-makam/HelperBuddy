"use client";
import React, { useState } from "react";
import ComponentCard from "../common/ComponentCard";
import Label from "../Label";
import Input from "../input/InputField";
import MultiSelect from "../MultiSelect";
import MultiSelectOption from "../MultiSelectOption";

export default function InputGroup() {

  const [pincodes, setPincodes] = useState<string[]>([]);
  const [Services, setServices] = useState<string[]>([]);
  const predefinedTexts = ["JavaScript", "React", "Node.js", "Spring Boot"];
  
  const handlePincodeChange = (values: string[]) => {
    setPincodes(values);
  };
  const handleSeriveChange = (values: string[]) => {
    setServices(values);
  };

  

  return (
    <ComponentCard title="Business Information">
      <div className="space-y-6">
        <div>
          <Label>Business Name</Label>
          <Input type="text" />
        </div>
        <div className="relative">
          <MultiSelectOption
            label="Services Offered"
            listOfTexts={predefinedTexts}
            onChange={(values) => setServices(values)}
          />
        </div>
        <div className="relative">
          <MultiSelect
            label="Serviceable Pincodes"
            defaultSelected={["394210"]}
            onChange={(values) => setPincodes(values)}
          />
          <p className="sr-only">
            Selected Values: {pincodes.join(", ")}
          </p>
        </div>
        <div>
          <Label>Experience</Label>
          <Input type="text" />
        </div>
        <div>
          <Label htmlFor="tm">Account Number</Label>
          <div className="relative">
            <Input
              type="text"
              placeholder="Card number"
              className="pl-[62px]"
            />
            <span className="absolute left-0 top-1/2 flex h-11 w-[46px] -translate-y-1/2 items-center justify-center border-r border-gray-200 dark:border-gray-800">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="6.25" cy="10" r="5.625" fill="#E80B26" />
                <circle cx="13.75" cy="10" r="5.625" fill="#F59D31" />
                <path
                  d="M10 14.1924C11.1508 13.1625 11.875 11.6657 11.875 9.99979C11.875 8.33383 11.1508 6.8371 10 5.80713C8.84918 6.8371 8.125 8.33383 8.125 9.99979C8.125 11.6657 8.84918 13.1625 10 14.1924Z"
                  fill="#FC6020"
                />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </ComponentCard>
  );
}
