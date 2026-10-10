const Invoice = require("../models/Invoice");
const { generateInvoicePDF } = require("../services/pdfService");

// ======================================================
// CREATE GST INVOICE / QUOTATION
// ======================================================

const createDocument = async (req, res) => {
  try {
    const data = req.body;

    console.log("====================================");
    console.log("Received document:");
    console.log(data);
    console.log("====================================");

    // -----------------------------
    // Validation
    // -----------------------------

    if (!data.documentType) {
      return res.status(400).json({
        success: false,
        message: "Document type is required",
      });
    }

    if (!data.number) {
      return res.status(400).json({
        success: false,
        message: "Document number is required",
      });
    }

    if (!data.customerName) {
      return res.status(400).json({
        success: false,
        message: "Customer name is required",
      });
    }

    // -----------------------------
    // Generate PDF
    // -----------------------------

    console.log("Generating PDF...");

    const pdfPath = await generateInvoicePDF(data);

    console.log("PDF generated successfully:");
    console.log(pdfPath);

    // -----------------------------
    // Save document in MongoDB
    // -----------------------------

    const document = await Invoice.create({
      ...data,
      pdfPath: pdfPath,
    });

    console.log("Document saved in MongoDB:");
    console.log(document._id);

    // -----------------------------
    // Create browser URL
    // -----------------------------

    const pdfUrl = `http://localhost:5000/${pdfPath}`;

    console.log("PDF URL:");
    console.log(pdfUrl);

    // -----------------------------
    // Send response
    // -----------------------------

    return res.status(201).json({
      success: true,

      message:
        data.documentType === "quotation"
          ? "Quotation generated successfully"
          : "GST Invoice generated successfully",

      documentId: document._id,

      pdfPath: pdfPath,

      pdfUrl: pdfUrl,

      document: document,
    });
  } catch (error) {
    console.error("====================================");
    console.error("CREATE DOCUMENT ERROR");
    console.error(error);
    console.error("====================================");

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to generate document",
    });
  }
};


// ======================================================
// GET ALL GST INVOICES
// ======================================================

const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({
      documentType: "invoice",
    }).sort({
      createdAt: -1,
    });

    // Add complete PDF URL
    const invoicesWithUrl = invoices.map((invoice) => ({
      ...invoice.toObject(),

      pdfUrl: invoice.pdfPath
        ? `http://localhost:5000/${invoice.pdfPath}`
        : "",
    }));

    res.status(200).json(invoicesWithUrl);
  } catch (error) {
    console.error("Get invoices error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch invoices",
    });
  }
};


// ======================================================
// GET ALL QUOTATIONS
// ======================================================

const getQuotations = async (req, res) => {
  try {
    const quotations = await Invoice.find({
      documentType: "quotation",
    }).sort({
      createdAt: -1,
    });

    // Add complete PDF URL
    const quotationsWithUrl = quotations.map((quotation) => ({
      ...quotation.toObject(),

      pdfUrl: quotation.pdfPath
        ? `http://localhost:5000/${quotation.pdfPath}`
        : "",
    }));

    res.status(200).json(quotationsWithUrl);
  } catch (error) {
    console.error("Get quotations error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch quotations",
    });
  }
};

// ======================================================
// UPDATE DOCUMENT STATUS
// ======================================================

const updateDocumentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    if (!["pending", "accepted", "cancelled"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid document status",
      });
    }

    const document = await Invoice.findByIdAndUpdate(
      id,
      {
        status: status,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    const pdfUrl = document.pdfPath
      ? `http://localhost:5000/${document.pdfPath}`
      : "";

    return res.status(200).json({
      success: true,
      message: "Document status updated successfully",
      document: {
        ...document.toObject(),
        pdfUrl,
      },
    });

  } catch (error) {
    console.error("Update document status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update document status",
    });
  }
};



// ======================================================
// EXPORT
// ======================================================

module.exports = {
  createDocument,
  getInvoices,
  getQuotations,
  updateDocumentStatus,
};