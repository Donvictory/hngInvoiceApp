import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, Plus } from "lucide-react";
import InvoiceList from "../components/invoice/InvoiceList";
import InvoiceForm from "../components/invoice/InvoiceForm";
import Button from "../components/common/Button";
import { db } from "../lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

const Dashboard = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [invoicesCount, setInvoicesCount] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const filterRef = useRef(null);

  const handleSaved = () => {
    setIsFormOpen(false);
    setRefreshKey((k) => k + 1);
  };

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const invoicesRef = collection(db, "invoices");
        let q = invoicesRef;
        if (filter !== "all") {
          const capitalizedFilter =
            filter.charAt(0).toUpperCase() + filter.slice(1);
          q = query(invoicesRef, where("status", "==", capitalizedFilter));
        }
        const querySnapshot = await getDocs(q);
        setInvoicesCount(querySnapshot.size);
      } catch (error) {
        console.error("Error fetching count:", error);
      }
    };
    fetchCount();
  }, [filter, refreshKey]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="animate-in fade-in duration-700 relative">
      <header className="flex items-center justify-between mb-8 md:mb-16 lg:mb-20">
        <div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black-700 dark:text-white tracking-tight">
            Invoices
          </h1>
          <p className="text-[#888EB0] dark:text-slate-300 font-medium mt-1 text-sm md:text-base">
            {invoicesCount === 0 ? (
              "No invoices"
            ) : (
              <>
                <span className="hidden md:inline">
                  {invoicesCount === 1 ? "There is " : "There are "}
                </span>
                {invoicesCount}
                <span className="hidden md:inline">
                  {" "}
                  {filter !== "all" ? filter : "total"}
                </span>{" "}
                invoice{invoicesCount !== 1 ? "s" : ""}
              </>
            )}
          </p>
        </div>

        <div className="flex items-center gap-5 lg:gap-10">
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-3 group"
            >
              <span className="font-bold text-slate-900 dark:text-white text-sm lg:text-base">
                Filter <span className="hidden md:inline">by status</span>
              </span>
              <ChevronDown
                className={`w-4 h-4 text-brand transition-transform ${isFilterOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isFilterOpen && (
              <div className="absolute top-12 left-1/2 -translate-x-1/2 w-40 bg-white dark:bg-card-dark shadow-xl rounded-lg p-6 z-20 flex flex-col gap-4">
                {["all", "paid", "pending", "draft"].map((status) => (
                  <label
                    key={status}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-transparent bg-slate-200 dark:bg-sidebar-accent checked:bg-brand cursor-pointer accent-brand"
                      checked={filter === status}
                      onChange={() => {
                        setFilter(status);
                        setIsFilterOpen(false);
                      }}
                    />
                    <span className="font-bold text-sm text-slate-900 dark:text-white capitalize group-hover:text-brand transition-colors">
                      {status}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <Button onClick={() => setIsFormOpen(true)} icon={Plus}>
            New <span className="hidden md:inline pl-1">Invoice</span>
          </Button>
        </div>
      </header>

      <InvoiceList filter={filter} refreshKey={refreshKey} />

      <InvoiceForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSaved={handleSaved}
      />
    </div>
  );
};

export default Dashboard;
