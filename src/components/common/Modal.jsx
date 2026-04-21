import React from "react";
import Button from "./Button";

const Modal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative bg-white dark:bg-card-dark w-full max-w-md p-8 lg:p-12 rounded-lg shadow-2xl animate-in fade-in zoom-in duration-300">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
          {title || "Confirm Deletion"}
        </h2>
        <p className="text-slate-500 dark:text-slate-300 font-medium leading-relaxed mb-8">
          {message ||
            "Are you sure you want to delete this invoice? This action cannot be undone."}
        </p>

        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
