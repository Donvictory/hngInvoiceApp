import React from "react";
import InvoiceForm from "../components/invoice/InvoiceForm";
import { useNavigate } from "react-router-dom";

const CreateInvoice = () => {
  const navigate = useNavigate();

  return (
    <div className="animate-in fade-in duration-700 max-w-[730px] mx-auto rounded-r-[20px]">
      <div className="bg-white dark:bg-bg-dark rounded-r-[20px] p-8 lg:p-12 shadow-sm border border-transparent">
        <InvoiceForm isPage={true} />
      </div>
    </div>
  );
};

export default CreateInvoice;
