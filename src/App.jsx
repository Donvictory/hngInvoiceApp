import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import InvoiceDetail from "./pages/InvoiceDetail";
import CreateInvoice from "./pages/CreateInvoice";
import EditInvoice from "./pages/EditInvoice";

function App() {
  return (
    <Router>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/invoice/:id" element={<InvoiceDetail />} />
          <Route path="/create" element={<CreateInvoice />} />
          <Route path="/edit/:id" element={<EditInvoice />} />
        </Routes>
      </DashboardLayout>
    </Router>
  );
}

export default App;
