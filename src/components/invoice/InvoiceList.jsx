import React, { useState, useEffect } from "react";
import InvoiceItem from "./InvoiceItem";
import EmptyState from "./EmptyState";
import { db } from "../../lib/firebase";
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";

const InvoiceList = ({ filter = "all" }) => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true);
      try {
        const invoicesRef = collection(db, "invoices");
        const q = query(invoicesRef, orderBy("createdAt", "desc"));

        const querySnapshot = await getDocs(q);
        let data = querySnapshot.docs.map((doc) => ({
          dbId: doc.id,
          ...doc.data(),
        }));

        if (filter !== "all") {
          data = data.filter(
            (inv) => inv.status.toLowerCase() === filter.toLowerCase(),
          );
        }
        setInvoices(data);
      } catch (error) {
        console.error("Error fetching invoices:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [filter]);

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500 animate-pulse">
        Loading invoices...
      </div>
    );
  }

  if (invoices.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">
      {invoices.map((invoice) => (
        <InvoiceItem
          key={invoice.dbId}
          invoice={{
            ...invoice,
            client: invoice.clientName,
            amount: invoice.total,
            date: invoice.paymentDue,
            currency: "£",
          }}
        />
      ))}
    </div>
  );
};

export default InvoiceList;
