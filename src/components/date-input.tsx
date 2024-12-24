/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

interface DateInputProps {
  name: string;
  value: string;
  onChange: (date: string) => void;
  disabled?: boolean;
}

export function DateInput({ name, value, onChange, disabled }: DateInputProps) {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    onChange(newValue);
  };

  return (
    <Input
      type="date"
      name={name}
      value={inputValue}
      onChange={handleChange}
      disabled={disabled}
    />
  );
}
