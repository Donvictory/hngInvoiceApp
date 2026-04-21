import React, { useState, useEffect } from "react";
import { Plus, Trash2, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../common/Button";
import Input, { Notice } from "../common/Input";

import { db } from "../../lib/firebase";
import { collection, addDoc, doc, getDoc, updateDoc } from "firebase/firestore";

const generateId = () => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const digits = "0123456789";
  const rand = (str, n) =>
    Array.from(
      { length: n },
      () => str[Math.floor(Math.random() * str.length)],
    ).join("");
  return rand(letters, 2) + rand(digits, 4);
};

const InvoiceForm = ({ isOpen, onClose, isPage = false, editId, onSaved }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    senderStreet: "",
    senderCity: "",
    senderPostCode: "",
    senderCountry: "",
    clientName: "",
    clientEmail: "",
    clientStreet: "",
    clientCity: "",
    clientPostCode: "",
    clientCountry: "",
    invoiceDate: new Date().toISOString().split("T")[0],
    paymentTerms: "30",
    projectDescription: "",
    id: "",
  });

  const [showErrors, setShowErrors] = useState(false);
  const [emptyItemsError, setEmptyItemsError] = useState(false);
  const [items, setItems] = useState([
    { id: 1, name: "", qty: "1", price: "0", total: "0" },
  ]);

  useEffect(() => {
    if (editId && isOpen) {
      const fetchInvoice = async () => {
        const docRef = doc(db, "invoices", editId);
        const docSnap = await getDoc(docRef);
        const invoice = docSnap.exists() ? docSnap.data() : null;

        if (invoice) {
          setFormData({
            senderStreet: invoice.senderAddress.street,
            senderCity: invoice.senderAddress.city,
            senderPostCode: invoice.senderAddress.postCode,
            senderCountry: invoice.senderAddress.country,
            clientName: invoice.clientName,
            clientEmail: invoice.clientEmail,
            clientStreet: invoice.clientAddress.street,
            clientCity: invoice.clientAddress.city,
            clientPostCode: invoice.clientAddress.postCode,
            clientCountry: invoice.clientAddress.country,
            invoiceDate: invoice.createdAt,
            paymentTerms: invoice.paymentTerms.toString(),
            projectDescription: invoice.description,
            id: invoice.id,
          });
          setItems(
            invoice.items.map((item, idx) => ({ ...item, id: idx + 1 })),
          );
        }
      };
      fetchInvoice();
    } else if (isOpen) {
      setShowErrors(false);
      setEmptyItemsError(false);
      setFormData({
        senderStreet: "",
        senderCity: "",
        senderPostCode: "",
        senderCountry: "",
        clientName: "",
        clientEmail: "",
        clientStreet: "",
        clientCity: "",
        clientPostCode: "",
        clientCountry: "",
        invoiceDate: new Date().toISOString().split("T")[0],
        paymentTerms: "30",
        projectDescription: "",
      });
      setItems([{ id: 1, name: "", qty: "1", price: "0", total: "0" }]);
    }
  }, [editId, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (id, field, value) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          if ((field === "qty" || field === "price") && value < 0) return item;
          const updatedItem = { ...item, [field]: value };
          if (field === "qty" || field === "price") {
            updatedItem.total = (Number(updatedItem.qty) || 0) * (Number(updatedItem.price) || 0);
          }
          return updatedItem;
        }
        return item;
      }),
    );
  };

  const addItem = () => {
    setItems([
      ...items,
      { id: Date.now(), name: "", qty: "1", price: "0", total: "0" },
    ]);
  };

  const removeItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else if (isPage) {
      navigate(-1);
    }
  };

  const handleSubmit = async (e, status) => {
    if (e) e.preventDefault();

    if (status !== "draft") {
      if (items.length === 0) {
        setEmptyItemsError(true);
        setShowErrors(true);
        return;
      } else {
        setEmptyItemsError(false);
      }

      const isHeaderValid = Object.entries(formData).every(([key, value]) => {
        if (key.includes("PostCode")) return true;
        return value.trim() !== "";
      });
      const areItemsValid = items.every(
        (item) => item.name.trim() !== "" && Number(item.qty) > 0 && Number(item.price) > 0,
      );

      if (!isHeaderValid || !areItemsValid) {
        setShowErrors(true);
        return;
      }
    }

    const invoiceData = {
      status: status,
      createdAt: formData.invoiceDate,
      paymentDue: formData.invoiceDate,
      paymentTerms: parseInt(formData.paymentTerms),
      description: formData.projectDescription,
      clientName: formData.clientName,
      clientEmail: formData.clientEmail,
      senderAddress: {
        street: formData.senderStreet,
        city: formData.senderCity,
        postCode: formData.senderPostCode,
        country: formData.senderCountry,
      },
      clientAddress: {
        street: formData.clientStreet,
        city: formData.clientCity,
        postCode: formData.clientPostCode,
        country: formData.clientCountry,
      },
      items: items.map(item => ({ ...item, qty: Number(item.qty), price: Number(item.price), total: Number(item.total) })),
      total: items.reduce((acc, item) => acc + Number(item.total), 0),
    };

    try {
      if (editId) {
        await updateDoc(doc(db, "invoices", editId), invoiceData);
        if (onSaved) onSaved();
        handleClose();
      } else {
        invoiceData.id = generateId();
        await addDoc(collection(db, "invoices"), invoiceData);
        if (onSaved) onSaved();
        handleClose();
        navigate("/");
      }
    } catch (error) {
      console.error("Error saving document: ", error);
    }
  };

  if (!isOpen && !isPage) return null;

  const formContent = (
    <div
      className={`${
        isPage
          ? "w-full"
          : "relative w-full max-w-2xl bg-white dark:bg-bg-dark h-screen overflow-y-auto animate-slide-in p-6 pt-24 md:p-12 md:pt-30 lg:p-14 lg:pl-[140px]"
      } rounded-r-[20px]`}
    >
      {!isPage && (
        <button
          onClick={handleClose}
          className="flex items-center gap-4 text-slate-900 dark:text-white font-bold mb-8 lg:hidden"
        >
          <ChevronLeft className="text-brand w-4 h-4" /> Go back
        </button>
      )}

      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-12">
        {editId ? `Edit #${formData.id || editId}` : isPage ? "Create Invoice" : "New Invoice"}
      </h2>

      <form className="space-y-10">
        <section>
          <h3 className="text-brand font-bold text-sm mb-6 tracking-wider text-[15px]">
            Bill From
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input
              label="Street Address"
              name="senderStreet"
              value={formData.senderStreet}
              onChange={handleInputChange}
              className="md:col-span-3"
              required
              showError={showErrors}
            />
            <Input
              label="City"
              name="senderCity"
              value={formData.senderCity}
              onChange={handleInputChange}
              required
              showError={showErrors}
            />
            <Input
              label="Post Code"
              name="senderPostCode"
              value={formData.senderPostCode}
              onChange={handleInputChange}
            />
            <Input
              label="Country"
              name="senderCountry"
              value={formData.senderCountry}
              onChange={handleInputChange}
              required
              showError={showErrors}
            />
          </div>
        </section>

        <section>
          <h3 className="text-brand font-bold text-sm mb-6 tracking-wider text-[15px]">
            Bill To
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input
              label="Client's Name"
              name="clientName"
              value={formData.clientName}
              onChange={handleInputChange}
              className="md:col-span-3"
              required
              showError={showErrors}
            />
            <Input
              label="Client's Email"
              name="clientEmail"
              value={formData.clientEmail}
              onChange={handleInputChange}
              placeholder="e.g. email@example.com"
              className="md:col-span-3"
              required
              showError={showErrors}
            />
            <Input
              label="Street Address"
              name="clientStreet"
              value={formData.clientStreet}
              onChange={handleInputChange}
              className="md:col-span-3"
              required
              showError={showErrors}
            />
            <Input
              label="City"
              name="clientCity"
              value={formData.clientCity}
              onChange={handleInputChange}
              required
              showError={showErrors}
            />
            <Input
              label="Post Code"
              name="clientPostCode"
              value={formData.clientPostCode}
              onChange={handleInputChange}
            />
            <Input
              label="Country"
              name="clientCountry"
              value={formData.clientCountry}
              onChange={handleInputChange}
              required
              showError={showErrors}
            />
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Invoice Date"
            name="invoiceDate"
            type="date"
            value={formData.invoiceDate}
            onChange={handleInputChange}
            required
            showError={showErrors}
          />
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-500 dark:text-slate-300">
              Payment Terms
            </label>
            <select
              name="paymentTerms"
              value={formData.paymentTerms}
              onChange={handleInputChange}
              className="w-full border border-slate-200 dark:border-sidebar-accent dark:bg-card-dark dark:text-white rounded-md py-3 px-4 focus:border-brand font-bold outline-none appearance-none bg-white"
            >
              <option value="1">Net 1 Day</option>
              <option value="7">Net 7 Days</option>
              <option value="14">Net 14 Days</option>
              <option value="30">Net 30 Days</option>
            </select>
          </div>
          <Input
            label="Project Description"
            name="projectDescription"
            value={formData.projectDescription}
            onChange={handleInputChange}
            placeholder="e.g. Graphic Design"
            className="md:col-span-2"
            required
            showError={showErrors}
          />
        </section>

        <section>
          <h3 className="text-slate-500 dark:text-slate-300 font-bold text-lg mb-6">
            Item List
          </h3>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="grid grid-cols-12 gap-4 items-end">
                <Input
                  label="Item Name"
                  value={item.name}
                  onChange={(e) =>
                    handleItemChange(item.id, "name", e.target.value)
                  }
                  className="col-span-12 md:col-span-5"
                  required
                  showError={showErrors}
                />
                <Input
                  label="Qty."
                  type="number"
                  value={item.qty}
                  onChange={(e) =>
                    handleItemChange(
                      item.id,
                      "qty",
                      e.target.value === "" ? "" : e.target.value,
                    )
                  }
                  className="col-span-3 md:col-span-2 text-center"
                />
                <Input
                  label="Price"
                  type="number"
                  value={item.price}
                  onChange={(e) =>
                    handleItemChange(
                      item.id,
                      "price",
                      e.target.value === "" ? "" : e.target.value,
                    )
                  }
                  className="col-span-4 md:col-span-2"
                />
                <div className="col-span-3 md:col-span-2">
                  <div className="mb-4 text-xs font-bold text-slate-500 md:hidden">
                    Total
                  </div>
                  <div className="py-3 font-bold text-slate-400 dark:text-text-dark">
                    {Number(item.total).toFixed(2)}
                  </div>
                </div>
                <div className="col-span-2 md:col-span-1 flex justify-end pb-3">
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
            <Button
              variant="ghost"
              className="w-full mt-4"
              onClick={addItem}
              icon={Plus}
            >
              Add New Item
            </Button>
          </div>
        </section>
      </form>
      {(showErrors || emptyItemsError) && (
        <section className="flex justify-start mt-4">
          <Notice show={showErrors} emptyItems={emptyItemsError} />
        </section>
      )}

      <div
        className={`mt-16 pt-8 border-t border-slate-100 dark:border-sidebar-accent flex items-center   justify-between ${isPage ? "pb-12" : ""} ${editId ? "justify-end" : ""}`}
      >
        <Button variant="secondary" onClick={handleClose}>
          {editId ? "Cancel" : "Discard"}
        </Button>
        <div className="flex items-center gap-2">
          {!editId && (
            <Button variant="dark" onClick={(e) => handleSubmit(e, "Draft")}>
              Save as Draft
            </Button>
          )}
          <Button
            className="pl-6"
            variant="primary"
            onClick={(e) => handleSubmit(e, "Pending")}
          >
            {editId ? "Save Changes" : "Save & Send"}
          </Button>
        </div>
      </div>
    </div>
  );

  if (isPage) return formContent;

  return (
    <div className="fixed inset-0 z-[60] flex">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        onClick={handleClose}
      ></div>
      {formContent}
    </div>
  );
};

export default InvoiceForm;
