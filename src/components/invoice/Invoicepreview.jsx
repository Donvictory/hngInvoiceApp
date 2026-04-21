import React, { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Button from "../common/Button";
import Modal from "../common/Modal";
import InvoiceForm from "./InvoiceForm";
import { db } from "../../lib/firebase";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";

const InvoicePreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoice = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "invoices", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setInvoice({ dbId: docSnap.id, ...docSnap.data() });
        } else {
          console.error("No such document!");
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching invoice:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [id, isEditFormOpen]);

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "invoices", id));
      setIsDeleteModalOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Error deleting invoice:", error);
    }
  };

  const handleMarkAsPaid = async () => {
    try {
      const docRef = doc(db, "invoices", id);
      await updateDoc(docRef, { status: "Paid" });
      setInvoice((prev) => ({ ...prev, status: "Paid" }));
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  if (loading)
    return (
      <div className="p-8 text-center text-slate-500 animate-pulse font-bold">
        Loading invoice details...
      </div>
    );
  if (!invoice)
    return (
      <div className="p-8 text-center text-slate-500">Invoice not found</div>
    );

  const getStatusStyles = (status) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-[#33D69F]/5 text-[#33D69F]";
      case "pending":
        return "bg-[#FF8F00]/5 text-[#FF8F00]";
      case "draft":
        return "bg-[#373B53]/5 text-[#373B53] dark:text-slate-100";
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
    <div className="animate-in fade-in duration-700">
      <Link
        to="/"
        className="Back flex items-center gap-6 text-slate-900 dark:text-white font-bold mb-8 hover:text-slate-500 transition-colors group hover:text-[#7C5DFA]"
      >
        <ChevronLeft className="text-brand w-4 h-4 transition-transform group-hover:-translate-x-1" />
        Go back
      </Link>

      <div className="bg-white dark:bg-card-dark p-6 rounded-lg shadow-sm border border-transparent flex items-center justify-between mb-6">
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
          <span className="text-slate-500 dark:text-slate-300 font-medium">
            Status
          </span>
          <div
            className={`w-28 py-3 rounded-md flex items-center justify-center gap-2 font-bold text-sm ${getStatusStyles(invoice.status)}`}
          >
            <div
              className={`w-2 h-2 rounded-full ${getDotColor(invoice.status)}`}
            ></div>
            {invoice.status}
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <Button variant="secondary" onClick={() => setIsEditFormOpen(true)}>
            Edit
          </Button>
          <Button variant="danger" onClick={() => setIsDeleteModalOpen(true)}>
            Delete
          </Button>
          <Button
            className="pl-6 py-3"
            variant="primary"
            onClick={handleMarkAsPaid}
            disabled={invoice.status === "Paid"}
          >
            Mark as Paid
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-card-dark p-6 lg:p-12 rounded-lg shadow-sm border border-transparent mb-16">
        <div className="flex flex-col md:flex-row justify-between gap-8 mb-12">
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              <span className="text-slate-400">#</span>
              {invoice.id}
            </h1>
            <p className="text-slate-500 dark:text-slate-300 font-medium">
              {invoice.description}
            </p>
          </div>
          <div className="text-slate-500 dark:text-slate-300 font-medium md:text-right text-sm leading-relaxed">
            <p>{invoice.senderAddress.street}</p>
            <p>{invoice.senderAddress.city}</p>
            <p>{invoice.senderAddress.postCode}</p>
            <p>{invoice.senderAddress.country}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-12">
          <div className="flex flex-col gap-8">
            <div>
              <p className="text-slate-500 dark:text-slate-300 font-medium mb-3 text-sm">
                Invoice Date
              </p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">
                {invoice.createdAt}
              </p>
            </div>
            <div>
              <p className="text-slate-500 dark:text-slate-300 font-medium mb-3 text-sm">
                Payment Due
              </p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">
                {invoice.paymentDue}
              </p>
            </div>
          </div>

          <div>
            <p className="text-slate-500 dark:text-slate-300 font-medium mb-3 text-sm">
              Bill To
            </p>
            <p className="text-lg font-bold text-slate-900 dark:text-white mb-3">
              {invoice.clientName}
            </p>
            <div className="text-slate-500 dark:text-slate-300 font-medium text-xs leading-relaxed">
              <p>{invoice.clientAddress.street}</p>
              <p>{invoice.clientAddress.city}</p>
              <p>{invoice.clientAddress.postCode}</p>
              <p>{invoice.clientAddress.country}</p>
            </div>
          </div>

          <div className="col-span-2 md:col-span-1">
            <p className="text-slate-500 dark:text-slate-300 font-medium mb-3 text-sm">
              Sent to
            </p>
            <p className="text-lg font-bold text-slate-900 dark:text-white break-all">
              {invoice.clientEmail}
            </p>
          </div>
        </div>

        <div className="bg-[#F9FAFE] dark:bg-[#252945] rounded-t-lg p-6 lg:p-8">
          <div className="hidden md:grid grid-cols-4 gap-4 mb-8 text-sm font-medium text-slate-500 dark:text-slate-300">
            <div>Item Name</div>
            <div className="text-center">QTY.</div>
            <div className="text-right">Price</div>
            <div className="text-right">Total</div>
          </div>

          <div className="space-y-6">
            {invoice.items.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center"
              >
                <div className="font-bold text-slate-900 dark:text-white text-sm">
                  {item.name}
                  <div className="md:hidden text-slate-500 dark:text-slate-300 mt-2 font-bold">
                    {item.qty} x £{item.price.toFixed(2)}
                  </div>
                </div>
                <div className="hidden md:block text-center font-bold text-slate-500 dark:text-slate-300">
                  {item.qty}
                </div>
                <div className="hidden md:block text-right font-bold text-slate-500 dark:text-slate-300">
                  £{item.price.toFixed(2)}
                </div>
                <div className="text-right font-bold text-slate-900 dark:text-white text-sm md:text-base">
                  £{item.total.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#373B53] dark:bg-[#0C0E16] rounded-b-lg p-8 flex items-center justify-between text-white">
          <span className="text-sm font-medium">Amount Due</span>
          <span className="text-2xl lg:text-3xl font-bold">
            £{" "}
            {invoice.total.toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </span>
        </div>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white dark:bg-card-dark p-6 flex items-center justify-center gap-2 shadow-2xl border-t border-slate-100 dark:border-slate-800">
        <Button
          variant="secondary"
          className="px-4"
          onClick={() => setIsEditFormOpen(true)}
        >
          Edit
        </Button>
        <Button
          variant="danger"
          className="px-4"
          onClick={() => setIsDeleteModalOpen(true)}
        >
          Delete
        </Button>
        <Button
          variant="primary"
          className="px-6 text-xs font-bold pl-6"
          onClick={handleMarkAsPaid}
          disabled={invoice.status === "Paid"}
        >
          Mark Paid
        </Button>
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to delete invoice #${invoice.id}? This action cannot be undone.`}
      />

      <InvoiceForm
        isOpen={isEditFormOpen}
        onClose={() => setIsEditFormOpen(false)}
        editId={invoice.id}
      />
    </div>
  );
};

export default InvoicePreview;
