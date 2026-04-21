import React from "react";
import { useParams } from "react-router-dom";
import InvoiceForm from "../components/invoice/InvoiceForm";

const EditInvoice = () => {
  const { id } = useParams();

  return (
    <div className="animate-in fade-in duration-700 max-w-[730px] mx-auto">
      <div className="bg-white dark:bg-bg-dark rounded-r-[20px] p-4 lg:p-12 shadow-sm border border-transparent">
        <InvoiceForm isPage={true} editId={id} />
      </div>
    </div>
  );
};

export default EditInvoice;
