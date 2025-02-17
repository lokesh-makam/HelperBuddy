"use client";
import ComponentCard from "../common/ComponentCard";
import Label from "../Label";
import Input from "../input/InputField";

export default function DefaultInputs() {
  const countries = [
    { code: "IN", label: "+91"}
  ];
  const handlePhoneNumberChange = (phoneNumber: string) => {
    console.log("Updated phone number:", phoneNumber);
  };
  const options = [
    { value: "marketing", label: "Marketing" },
    { value: "template", label: "Template" },
    { value: "development", label: "Development" },
  ];
  const handleSelectChange = (value: string) => {
    console.log("Selected value:", value);
  };
  return (
    <ComponentCard title="Basic Information">
      <div className="space-y-6">
        <div>
          <Label>Name</Label>
          <Input type="text" />
        </div>
        <div>
          <Label>Email</Label>
          <Input type="mail" disabled={true}/>
        </div>
        <div>
          <Label>Password</Label>
          <div className="relative">
            <Input
              type="password"
              placeholder="Enter your password"
              disabled={true}
            />
          </div>
        </div>
        <div>
          <Label>Phone Number</Label>
          <Input type="text" />
        </div>
        
      </div>
    </ComponentCard>
  );
}
