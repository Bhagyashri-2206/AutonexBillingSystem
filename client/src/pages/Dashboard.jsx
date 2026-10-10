import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InvoiceModal from "../components/InvoiceModal";

import {
  FilePlus,
  FileText,
  UserCircle,
  LogOut,
  Receipt,
  FileCheck,
  Search,
} from "lucide-react";

import logo from "../assets/autonex-logo.png";
import "../styles/Dashboard.css";
import {
  getInvoices,
  getQuotations,
  updateDocumentStatus,
} from "../services/api";

function Dashboard() {
  const navigate = useNavigate();

  // ===============================
  // STATES
  // ===============================

  const [activeTab, setActiveTab] = useState("generate");

  // Stores which document modal is open
  // null = no modal
  // "invoice" = GST Invoice
  // "quotation" = Quotation
  
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [documentType, setDocumentType] = useState("");
  // ======================================================
// INVOICE HISTORY STATES
// ======================================================

const [historyType, setHistoryType] =
  useState("invoice");

const [historyStatus, setHistoryStatus] =
  useState("all");

const [invoices, setInvoices] =
  useState([]);

const [quotations, setQuotations] =
  useState([]);

const [historySearch, setHistorySearch] =
  useState("");

const [historyLoading, setHistoryLoading] =
  useState(false);

const [historyError, setHistoryError] =
  useState("");


useEffect(() => {
  if (activeTab === "history") {
    loadHistory();
  }
}, [activeTab]);
  // ======================================================
// LOAD INVOICE HISTORY
// ======================================================

const loadHistory = async () => {
  try {
    setHistoryLoading(true);
    setHistoryError("");

    const [
      invoiceData,
      quotationData,
    ] = await Promise.all([
      getInvoices(),
      getQuotations(),
    ]);

    setInvoices(
      Array.isArray(invoiceData)
        ? invoiceData
        : []
    );

    setQuotations(
      Array.isArray(quotationData)
        ? quotationData
        : []
    );

  } catch (error) {
    console.error(
      "History loading error:",
      error
    );

    setHistoryError(
      error.message ||
        "Failed to load document history"
    );

  } finally {
    setHistoryLoading(false);
  }
};
  // ===============================
  // USER DATA
  // ===============================

  const user = JSON.parse(localStorage.getItem("user"));
  // ======================================================
// ACCEPT / CANCEL DOCUMENT
// ======================================================

const handleStatusChange = async (
  documentId,
  status
) => {
  try {
    const response =
      await updateDocumentStatus(
        documentId,
        status
      );

    const updatedDocument =
      response.document;

    // Update GST invoices
    setInvoices((previous) =>
      previous.map((invoice) =>
        invoice._id === documentId
          ? {
              ...invoice,
              ...updatedDocument,
            }
          : invoice
      )
    );

    // Update quotations
    setQuotations((previous) =>
      previous.map((quotation) =>
        quotation._id === documentId
          ? {
              ...quotation,
              ...updatedDocument,
            }
          : quotation
      )
    );

  } catch (error) {
    console.error(
      "Status update error:",
      error
    );

    alert(
      error.message ||
        "Failed to update document status"
    );
  }
};

// ======================================================
// CURRENT DOCUMENT LIST
// ======================================================

const currentDocuments =
  historyType === "invoice"
    ? invoices
    : quotations;

// ======================================================
// FILTER DOCUMENTS
// ======================================================

const filteredDocuments =
  currentDocuments.filter((document) => {

    const status =
      document.status || "pending";

    const matchesStatus =
      historyStatus === "all" ||
      (historyStatus === "accept" &&
        status === "accepted") ||
      (historyStatus === "cancel" &&
        status === "cancelled");

    const search =
      historySearch
        .toLowerCase()
        .trim();

    const matchesSearch =
      !search ||
      String(
        document.customerName || ""
      )
        .toLowerCase()
        .includes(search) ||

      String(
        document.number || ""
      )
        .toLowerCase()
        .includes(search);

    return (
      matchesStatus &&
      matchesSearch
    );
  });



  // ===============================
  // LOGOUT
  // ===============================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  // ===============================
  // TAB CHANGE
  // ===============================

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // ===============================
  // OPEN GST INVOICE
  // ===============================

  const handleGenerateInvoice = () => {
    setDocumentType("invoice");
  };

  // ===============================
  // OPEN QUOTATION
  // ===============================

  const handleGenerateQuotation = () => {
    setDocumentType("quotation");
  };
  



  // ===============================
  // CLOSE MODAL
  // ===============================

  const handleCloseModal = () => {
    setDocumentType(null);
  };

  // ===============================
  // JSX
  // ===============================

  return (
    <div className="dashboard-container">

      {/* =========================================
          HEADER
      ========================================= */}

      <header className="dashboard-header">

        <div className="brand-section">

          <div className="dashboard-logo">
            <img
              src={logo}
              alt="AutoNex Technology"
            />
          </div>

          <div className="brand-text">
            <h1>AutoNex Technology</h1>
            <span>Billing Management System</span>
          </div>

        </div>


        <div className="header-user">

          <div className="user-info">

            <span>Welcome</span>

            <strong>
              {user?.firstName || "User"}
            </strong>

          </div>


          <button
            className="logout-button"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            Logout
          </button>

        </div>

      </header>


      {/* =========================================
          MAIN
      ========================================= */}

      <main className="dashboard-main">

        {/* =========================================
            WELCOME SECTION
        ========================================= */}

        <section className="welcome-section">

          <div>

            <p className="welcome-label">
              Dashboard
            </p>

            <h2>
              Welcome back,{" "}
              <span>
                {user?.firstName || "User"} 👋
              </span>
            </h2>

            <p>
              Create and manage your GST invoices
              and quotations from one place.
            </p>

          </div>

        </section>


        {/* =========================================
            DASHBOARD TABS
        ========================================= */}

        <div className="dashboard-tabs">

          {/* GENERATE */}

          <button
            className={
              activeTab === "generate"
                ? "tab-button active"
                : "tab-button"
            }
            onClick={() =>
              handleTabChange("generate")
            }
          >
            <FilePlus size={19} />
            Generate
          </button>


          {/* HISTORY */}

          <button
            className={
              activeTab === "history"
                ? "tab-button active"
                : "tab-button"
            }
            onClick={() =>
              handleTabChange("history")
            }
          >
            <FileText size={19} />
            Invoice History
          </button>


          {/* PROFILE */}

          <button
            className={
              activeTab === "profile"
                ? "tab-button active"
                : "tab-button"
            }
            onClick={() =>
              handleTabChange("profile")
            }
          >
            <UserCircle size={19} />
            Profile
          </button>

        </div>


        {/* =========================================
            GENERATE TAB
        ========================================= */}

        {activeTab === "generate" && (

          <section className="dashboard-content">

            <div className="section-heading">

              <div>

                <h3>
                  Create New Document
                </h3>

                <p>
                  Choose the document you want
                  to generate.
                </p>

              </div>

            </div>


            {/* DOCUMENT CARDS */}

            <div className="document-grid">


              {/* =================================
                  GST INVOICE CARD
              ================================= */}

              <div className="document-card">

                <div className="document-icon invoice-icon">
                  <Receipt size={30} />
                </div>


                <div className="document-info">

                  <h3>
                    GST Invoice
                  </h3>

                  <p>
                    Create a professional GST
                    invoice with customer,
                    product and tax details.
                  </p>

                </div>


                <button
                  className="generate-button"
                  onClick={() => {
                         setDocumentType("invoice");
                         setShowInvoiceModal(true);
                  }}
                >
                  <FilePlus size={18} />

                  Generate GST Invoice

                </button>

              </div>


              {/* =================================
                  QUOTATION CARD
              ================================= */}

              <div className="document-card">

                <div className="document-icon quotation-icon">
                  <FileCheck size={30} />
                </div>


                <div className="document-info">

                  <h3>
                    Quotation
                  </h3>

                  <p>
                    Prepare a professional
                    quotation for your customer
                    with all required details.
                  </p>

                </div>


                <button
                  className="generate-button"
                   onClick={() => {
                  setDocumentType("quotation");
                  setShowInvoiceModal(true);
                  }}
                >
                  <FilePlus size={18} />

                  Generate Quotation

                </button>

              </div>

            </div>

          </section>

        )}


        {/* =========================================
    INVOICE HISTORY TAB
========================================= */}

{activeTab === "history" && (
  <section className="dashboard-content">

    {/* =====================================
        HEADING
    ===================================== */}

    <div className="section-heading">

      <div>
        <h3>
          Invoice History
        </h3>

        <p>
          View and manage your generated
          GST invoices and quotations.
        </p>
      </div>

    </div>


    {/* =====================================
        DOCUMENT TYPE TABS
    ===================================== */}

    <div className="history-type-tabs">

      <button
        className={
          historyType === "invoice"
            ? "history-type-button active"
            : "history-type-button"
        }
        onClick={() => {
          setHistoryType("invoice");
          setHistoryStatus("all");
        }}
      >
        <Receipt size={18} />
        GST Invoice
      </button>


      <button
        className={
          historyType === "quotation"
            ? "history-type-button active quotation-active"
            : "history-type-button"
        }
        onClick={() => {
          setHistoryType("quotation");
          setHistoryStatus("all");
        }}
      >
        <FileCheck size={18} />
        Quotation
      </button>

    </div>


    {/* =====================================
        STATUS FILTER TABS
    ===================================== */}

    <div className="history-status-tabs">

      <button
        className={
          historyStatus === "all"
            ? "status-tab active"
            : "status-tab"
        }
        onClick={() =>
          setHistoryStatus("all")
        }
      >
        All
      </button>


      <button
        className={
          historyStatus === "accept"
            ? "status-tab active accepted-tab"
            : "status-tab"
        }
        onClick={() =>
          setHistoryStatus("accept")
        }
      >
        Accept
      </button>


      <button
        className={
          historyStatus === "cancel"
            ? "status-tab active cancelled-tab"
            : "status-tab"
        }
        onClick={() =>
          setHistoryStatus("cancel")
        }
      >
        Cancel
      </button>

    </div>


    {/* =====================================
        SEARCH
    ===================================== */}

    <div className="search-box">

      <Search size={19} />

      <input
        type="text"
        placeholder="Search by customer name or document number..."
        value={historySearch}
        onChange={(e) =>
          setHistorySearch(
            e.target.value
          )
        }
      />

    </div>


    {/* =====================================
        ERROR
    ===================================== */}

    {historyError && (
      <div className="history-error">
        {historyError}
      </div>
    )}


    {/* =====================================
        LOADING
    ===================================== */}

    {historyLoading && (
      <div className="history-loading">
        Loading documents...
      </div>
    )}


    {/* =====================================
        DOCUMENT LIST
    ===================================== */}

    {!historyLoading &&
      filteredDocuments.length > 0 && (

        <div className="history-document-list">

          {filteredDocuments.map(
            (document) => {

              const status =
                document.status ||
                "pending";

              return (

                <div
                  className="history-document-card"
                  key={document._id}
                >

                  {/* LEFT */}
                  <div className="history-document-left">

                    <div
                      className={
                        historyType ===
                        "invoice"
                          ? "history-pdf-icon invoice-pdf-icon"
                          : "history-pdf-icon quotation-pdf-icon"
                      }
                    >
                      <FileText
                        size={27}
                      />
                    </div>


                    <div className="history-document-info">

                      <h4>
                        {historyType ===
                        "invoice"
                          ? "GST Invoice"
                          : "Quotation"}
                      </h4>

                      <strong>
                        No.{" "}
                        {document.number ||
                          "-"}
                      </strong>

                      <span>
                        Customer:{" "}
                        {document.customerName ||
                          "-"}
                      </span>

                      <span>
                        Date:{" "}
                        {document.date ||
                          "-"}
                      </span>

                    </div>

                  </div>


                  {/* MIDDLE */}
                  <div className="history-document-middle">

                    <span className="history-total-label">
                      Total Amount
                    </span>

                    <strong>
                      {" "}
                      {Number(
                        document.totalAmount ||
                          0
                      ).toFixed(2)}
                    </strong>

                    <span
                      className={
                        `document-status ${status}`
                      }
                    >
                      {status ===
                        "accepted"
                        ? "Accepted"
                        : status ===
                          "cancelled"
                        ? "Cancelled"
                        : "Pending"}
                    </span>

                  </div>


                  {/* RIGHT */}
                  <div className="history-document-actions">

                    {/* VIEW PDF */}

                    {document.pdfUrl && (
                      <a
                        href={
                          document.pdfUrl
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="view-pdf-button"
                      >
                        <FileText
                          size={16}
                        />
                        View PDF
                      </a>
                    )}


                    {/* ACCEPT */}

                    <button
                      className="accept-button"
                      onClick={() =>
                        handleStatusChange(
                          document._id,
                          "accepted"
                        )
                      }
                    >
                      Accept
                    </button>


                    {/* CANCEL */}

                    <button
                      className="cancel-button"
                      onClick={() =>
                        handleStatusChange(
                          document._id,
                          "cancelled"
                        )
                      }
                    >
                      Cancel
                    </button>

                  </div>

                </div>

              );
            }
          )}

        </div>

      )}


    {/* =====================================
        EMPTY RESULT
    ===================================== */}

    {!historyLoading &&
      filteredDocuments.length === 0 && (

        <div className="empty-history">

          <FileText size={45} />

          <h3>
            No documents found
          </h3>

          <p>
            {historyStatus === "all"
              ? `No ${
                  historyType ===
                  "invoice"
                    ? "GST invoices"
                    : "quotations"
                } have been generated yet.`
              : `No ${
                  historyStatus ===
                  "accept"
                    ? "accepted"
                    : "cancelled"
                } ${
                  historyType ===
                  "invoice"
                    ? "GST invoices"
                    : "quotations"
                } found.`}
          </p>

        </div>

      )}

  </section>
)}

        {/* =========================================
            PROFILE TAB
        ========================================= */}

        {activeTab === "profile" && (

          <section className="dashboard-content">

            <div className="section-heading">

              <div>

                <h3>
                  My Profile
                </h3>

                <p>
                  View your account information.
                </p>

              </div>

            </div>


            <div className="profile-card">


              {/* PROFILE ICON */}

              <div className="profile-avatar">

                <UserCircle size={65} />

              </div>


              {/* PROFILE DETAILS */}

              <div className="profile-details">


                {/* FIRST NAME */}

                <div className="profile-field">

                  <span>
                    First Name
                  </span>

                  <strong>
                    {user?.firstName || "-"}
                  </strong>

                </div>


                {/* LAST NAME */}

                <div className="profile-field">

                  <span>
                    Last Name
                  </span>

                  <strong>
                    {user?.lastName || "-"}
                  </strong>

                </div>


                {/* EMAIL */}

                <div className="profile-field">

                  <span>
                    Email Address
                  </span>

                  <strong>
                    {user?.email || "-"}
                  </strong>

                </div>

              </div>


              {/* LOGOUT */}

              <button
                className="profile-logout"
                onClick={handleLogout}
              >
                <LogOut size={18} />
                Logout
              </button>

            </div>

          </section>

        )}

      </main>


      {/* =========================================
          INVOICE / QUOTATION MODAL
      ========================================= */}

      {showInvoiceModal && (
  <InvoiceModal
    type={documentType}
    onClose={() => {
      setShowInvoiceModal(false);
      setDocumentType("");
    }}
  />
)}
    </div>
  );
}

export default Dashboard;