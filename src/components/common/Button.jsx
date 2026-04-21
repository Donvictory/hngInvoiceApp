import React from "react";

const Button = ({
  children,
  variant = "primary",
  onClick,
  type = "button",
  className = "",
  disabled = false,
  icon: Icon,
}) => {
  const baseStyles =
    "px-6 py-2 rounded-full font-bold transition-all flex items-center justify-center gap-2 text-sm lg:text-base cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-95";

  const variants = {
    primary: "bg-[#7C5DFA] hover:bg-[#9277FF] text-white pl-2 py-2 ",
    secondary:
      "bg-[#F9FAFE] dark:bg-[#252945] hover:bg-[#DFE3FA] dark:hover:bg-white text-[#7E88C3] dark:text-[#DFE3FA] dark:hover:text-[#7E88C3]",
    danger: "bg-[#EC5757] hover:bg-[#FF9797] text-white py-3",
    dark: "bg-[#373B53] hover:bg-[#0C0E16] text-[#888EB0] dark:text-[#DFE3FA]",
    ghost:
      "bg-[#F9FAFE] dark:bg-[#1e2139]/50 hover:bg-[#DFE3FA] dark:hover:bg-[#252945] text-[#7E88C3] dark:text-[#DFE3FA] w-full",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {Icon && (
        <div
          className={
            variant === "primary"
              ? "w-8 h-8 bg-white rounded-full flex items-center justify-center mr-2"
              : "mr-1"
          }
        >
          <Icon
            className={
              variant === "primary" ? "w-4 h-4 text-[#7C5DFA]" : "w-5 h-5"
            }
          />
        </div>
      )}
      <span>{children}</span>
    </button>
  );
};

export default Button;
