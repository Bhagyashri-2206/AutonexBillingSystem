const express = require("express");

const {
  createDocument,
  getInvoices,
  getQuotations,
  updateDocumentStatus,
} = require("../controllers/invoiceController");

const router = express.Router();

// ======================================================
// CREATE GST INVOICE
// ======================================================

router.post(
  "/invoices",
  createDocument
);

// ======================================================
// CREATE QUOTATION
// ======================================================

router.post(
  "/quotations",
  createDocument
);

// ======================================================
// GST INVOICE HISTORY
// ======================================================

router.get(
  "/invoices",
  getInvoices
);

// ======================================================
// QUOTATION HISTORY
// ======================================================

router.get(
  "/quotations",
  getQuotations
);

// ======================================================
// ACCEPT / CANCEL DOCUMENT
// ======================================================

router.patch(
  "/documents/:id/status",
  updateDocumentStatus
);

module.exports = router;