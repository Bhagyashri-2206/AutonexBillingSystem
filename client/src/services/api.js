import axios from "axios";

const API_URL = "http://localhost:5000/api";

const API = axios.create({
  baseURL: API_URL,
});


// ======================================================
// CREATE GST INVOICE
// ======================================================

export const createInvoice = async (invoiceData) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/invoices`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",

      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
    },

    body: JSON.stringify({
      ...invoiceData,
      documentType: "invoice",
    }),
  });

  const data = await response.json();

  console.log("Create Invoice Response:", data);

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to generate invoice"
    );
  }

  return data;
};


// ======================================================
// CREATE QUOTATION
// ======================================================

export const createQuotation = async (quotationData) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/quotations`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",

      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
    },

    body: JSON.stringify({
      ...quotationData,
      documentType: "quotation",
    }),
  });

  const data = await response.json();

  console.log("Create Quotation Response:", data);

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to generate quotation"
    );
  }

  return data;
};


// ======================================================
// GET GST INVOICES
// ======================================================

export const getInvoices = async () => {
  const response = await fetch(
    `${API_URL}/invoices`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch invoices"
    );
  }

  return data;
};


// ======================================================
// GET QUOTATIONS
// ======================================================

export const getQuotations = async () => {
  const response = await fetch(
    `${API_URL}/quotations`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch quotations"
    );
  }

  return data;
};


// ======================================================
// UPDATE DOCUMENT STATUS
// ======================================================

export const updateDocumentStatus = async (
  documentId,
  status
) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/documents/${documentId}/status`,
    {
      method: "PATCH",

      headers: {
        "Content-Type": "application/json",

        ...(token && {
          Authorization: `Bearer ${token}`,
        }),
      },

      body: JSON.stringify({
        status,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to update document status"
    );
  }

  return data;
};

export default API;