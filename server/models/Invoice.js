const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    hsn: {
      type: String,
      required: true,
    },

    qty: {
      type: Number,
      required: true,
    },

    rate: {
      type: Number,
      required: true,
    },

    cgstPercent: {
      type: Number,
      default: 0,
    },

    sgstPercent: {
      type: Number,
      default: 0,
    },

    taxableValue: {
      type: Number,
      default: 0,
    },

    cgst: {
      type: Number,
      default: 0,
    },

    sgst: {
      type: Number,
      default: 0,
    },

    total: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

const invoiceSchema = new mongoose.Schema(
  {
    documentType: {
      type: String,
      enum: ["invoice", "quotation"],
      required: true,
    },

    number: {
      type: String,
      required: true,
    },

    date: {
      type: String,
      required: true,
    },

    dueDate: {
      type: String,
      default: "",
    },

    customerName: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    gstin: {
      type: String,
      default: "",
    },

    pan: {
      type: String,
      default: "",
    },

    placeOfSupply: {
      type: String,
      default: "",
    },

    items: {
      type: [itemSchema],
      default: [],
    },

    taxableAmount: {
      type: Number,
      default: 0,
    },

    cgstAmount: {
      type: Number,
      default: 0,
    },

    sgstAmount: {
      type: Number,
      default: 0,
    },

    totalTax: {
      type: Number,
      default: 0,
    },

    totalAmount: {
      type: Number,
      default: 0,
    },

    pdfPath: {
  type: String,
  default: "",
},

// Document status
status: {
  type: String,
  enum: ["pending", "accepted", "cancelled"],
  default: "pending",
},
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Invoice",
  invoiceSchema
);