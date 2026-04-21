import React from "react";

const Input = ({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  className = "",
  error,
  required,
  showError,
  ...props
}) => {
  const isRequiredError = required && !value && showError;

  const handleChange = (e) => {
    if (type === "number") {
      const num = parseFloat(e.target.value);
      if (num < 0) return; // block negative values
    }
    onChange(e);
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <div className="flex justify-between items-center">
          <label
            htmlFor={id}
            className={`text-sm font-medium ${error || isRequiredError ? "text-rose-500" : "text-slate-500 dark:text-slate-300"}`}
          >
            {label}
            {required && <span className="ml-1 text-rose-500">*</span>}
          </label>
          {(error || isRequiredError) && (
            <span className="text-[10px] font-bold text-rose-500">
              {error || "can't be empty"}
            </span>
          )}
        </div>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        min={type === "number" ? 0 : undefined}
        className={`
          w-full border rounded-md py-3 px-4 font-bold outline-none transition-all
          ${
            error || isRequiredError
              ? "border-rose-500 focus:border-rose-500"
              : "border-slate-200 dark:border-sidebar-accent focus:border-brand"
          }
          dark:bg-card-dark dark:text-white
        `}
        {...props}
      />
    </div>
  );
};

export default Input;

export function Notice({ show }) {
  if (!show) return null;
  return (
    <span className="text-[10px] font-bold text-rose-500 flex flex-col gap-1">
      <span>- All fields must be filled</span>
      <span>- Item price and quantity must be greater than 0</span>
    </span>
  );
}
