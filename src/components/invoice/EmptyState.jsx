import React from "react";
import emptyImg from "../../assets/Email campaign_Flatline.png";

const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-1000">
      <img
        src={emptyImg}
        alt="No invoices"
        className="w-full max-w-[240px] md:max-w-[300px] mb-10"
      />
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
        There is nothing here
      </h2>
      <p className="text-slate-500 dark:text-slate-300 max-w-[220px] mx-auto leading-relaxed">
        Create an invoice by clicking the{" "}
        <span className="font-bold">New Invoice</span> button and get started
      </p>
    </div>
  );
};

export default EmptyState;
