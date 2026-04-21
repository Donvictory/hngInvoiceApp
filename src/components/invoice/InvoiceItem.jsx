import React from "react";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const InvoiceItem = ({ invoice }) => {
  const navigate = useNavigate();

  const getStatusStyles = (status) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-[#33D69F]/5 text-[#33D69F]";
      case "pending":
        return "bg-[#FF8F00]/5 text-[#FF8F00]";
      case "draft":
        return "bg-[#373B53]/5 text-[#373B53] dark:bg-slate-50/5 dark:text-slate-100";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  const getDotColor = (status) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-[#33D69F]";
      case "pending":
        return "bg-[#FF8F00]";
      case "draft":
        return "bg-[#373B53] dark:bg-slate-100";
      default:
        return "bg-slate-400";
    }
  };

  return (
    <div
      onClick={() => navigate(`/invoice/${invoice.dbId}`)}
      className="invoice-item bg-white dark:bg-card-dark p-6 rounded-lg shadow-sm cursor-pointer group"
    >
      <div className="flex md:hidden flex-col gap-4">
        <div className="flex justify-between items-center">
          <span className="font-bold text-slate-400">
            <span className="text-slate-400">#</span>
            <span className="text-text-light dark:text-text-dark">
              {invoice.id}
            </span>
          </span>
          <span className="text-slate-500 dark:text-slate-300 font-medium">
            {invoice.client}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <span className="text-slate-500 dark:text-slate-300 font-medium text-sm">
              Due <span className="ml-1">{invoice.date}</span>
            </span>
            <span className="text-xl font-bold text-text-light dark:text-text-dark">
              {invoice.currency}{" "}
              {invoice.amount.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>

          <div
            className={`w-28 py-3 rounded-md flex items-center justify-center gap-2 font-bold text-sm ${getStatusStyles(invoice.status)}`}
          >
            <div
              className={`w-2 h-2 rounded-full ${getDotColor(invoice.status)}`}
            ></div>
            {invoice.status}
          </div>
        </div>
      </div>

      <div className="hidden md:flex items-center justify-between gap-4">
        <div className="flex items-center gap-6 flex-1">
          <span className="font-bold text-slate-400 w-20">
            <span className="text-slate-400">#</span>
            <span className="text-text-light dark:text-text-dark">
              {invoice.id}
            </span>
          </span>
          <span className="text-slate-500 dark:text-slate-300 font-medium w-32">
            Due <span className="ml-1">{invoice.date}</span>
          </span>
          <span className="text-slate-500 dark:text-slate-300 font-medium flex-1">
            {invoice.client}
          </span>
        </div>

        <div className="flex items-center gap-8">
          <span className="text-xl font-bold text-text-light dark:text-text-dark min-w-[120px] text-right">
            {invoice.currency}{" "}
            {invoice.amount.toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </span>

          <div
            className={`w-28 py-3 rounded-md flex items-center justify-center gap-2 font-bold text-sm ${getStatusStyles(invoice.status)}`}
          >
            <div
              className={`w-2 h-2 rounded-full ${getDotColor(invoice.status)}`}
            ></div>
            {invoice.status}
          </div>

          <ChevronRight className="text-brand w-5 h-5 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </div>
  );
};

export default InvoiceItem;
