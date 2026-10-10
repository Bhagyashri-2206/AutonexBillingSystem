import React, { useState } from "react";
import "./InvoiceModal.css";

import { createInvoice, createQuotation } from "../services/api";

function InvoiceModal({ type, onClose }) {
  const isInvoice = type === "invoice";

  const [formData, setFormData] = useState({
    number: "",
    date: "",
    dueDate: "",

    customerName: "",
    address: "",
    phone: "",
    gstin: "",
    pan: "",
    placeOfSupply: "",

    items: [
      {
        name: "",
        hsn: "",
        qty: 1,
        rate: "",
        cgstPercent: 9,
        sgstPercent: 9,
      },
    ],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];

    updatedItems[index][field] = value;

    setFormData((prev) => ({
      ...prev,
      items: updatedItems,
    }));
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          name: "",
          hsn: "",
          qty: 1,
          rate: "",
          cgstPercent: 9,
          sgstPercent: 9,
        },
      ],
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length === 1) return;

    const updatedItems = formData.items.filter(
      (_, itemIndex) => itemIndex !== index
    );

    setFormData((prev) => ({
      ...prev,
      items: updatedItems,
    }));
  };

  const calculateItem = (item) => {
    const qty = Number(item.qty) || 0;
    const rate = Number(item.rate) || 0;

    const taxableValue = qty * rate;

    const cgst =
      taxableValue * ((Number(item.cgstPercent) || 0) / 100);

    const sgst =
      taxableValue * ((Number(item.sgstPercent) || 0) / 100);

    const total = taxableValue + cgst + sgst;

    return {
      taxableValue,
      cgst,
      sgst,
      total,
    };
  };

  const totals = formData.items.reduce(
    (acc, item) => {
      const result = calculateItem(item);

      acc.taxable += result.taxableValue;
      acc.cgst += result.cgst;
      acc.sgst += result.sgst;
      acc.total += result.total;

      return acc;
    },
    {
      taxable: 0,
      cgst: 0,
      sgst: 0,
      total: 0,
    }
  );

  const handleGenerate = async (e) => {
  e.preventDefault();

  try {
    // Prepare item data for backend/PDF
    const items = formData.items.map((item) => {
      const calculation = calculateItem(item);

      return {
        name: item.name,
        hsn: item.hsn,
        qty: Number(item.qty) || 0,
        rate: Number(item.rate) || 0,

        cgstPercent: Number(item.cgstPercent) || 0,
        sgstPercent: Number(item.sgstPercent) || 0,

        taxableValue: calculation.taxableValue,
        cgst: calculation.cgst,
        sgst: calculation.sgst,
        total: calculation.total,
      };
    });

    const documentData = {
      documentType: isInvoice ? "invoice" : "quotation",

      number: formData.number,
      date: formData.date,
      dueDate: formData.dueDate,

      customerName: formData.customerName,
      address: formData.address,
      phone: formData.phone,
      gstin: formData.gstin,
      pan: formData.pan,
      placeOfSupply: formData.placeOfSupply,

      items,

      taxableAmount: totals.taxable,
      cgstAmount: totals.cgst,
      sgstAmount: totals.sgst,
      totalTax: totals.cgst + totals.sgst,
      totalAmount: totals.total,
    };

    console.log("Sending document:", documentData);

    let response;

    if (isInvoice) {
      response = await createInvoice(documentData);
    } else {
      response = await createQuotation(documentData);
    }

    console.log("Backend response:", response);

    // Open generated PDF
    if (response.pdfUrl) {
      window.open(response.pdfUrl, "_blank");
    }

    alert(
      isInvoice
        ? "GST Invoice generated successfully!"
        : "Quotation generated successfully!"
    );

    onClose();

  } catch (error) {
    console.error("PDF generation error:", error);

    alert(
      error.message ||
        "Failed to generate document. Please try again."
    );
  }
};
  return (
    <div className="invoice-modal-overlay">
      <div className="invoice-modal">

        {/* HEADER */}

        <div className="invoice-modal-header">

          <div>
            <h2>
              {isInvoice
                ? "Generate GST Invoice"
                : "Generate Quotation"}
            </h2>

            <p>
              Fill all required details to create your document
            </p>
          </div>

          <button
            className="close-modal"
            onClick={onClose}
          >
            ×
          </button>

        </div>

        <form onSubmit={handleGenerate}>

          {/* DOCUMENT INFORMATION */}

          <div className="form-section">

            <div className="section-title">
              <span>01</span>
              Document Information
            </div>

            <div className="form-grid">

              <div className="input-group">

                <label>
                  {isInvoice
                    ? "Invoice Number"
                    : "Quotation Number"} *
                </label>

                <input
                  type="text"
                  name="number"
                  value={formData.number}
                  onChange={handleChange}
                  placeholder={
                    isInvoice
                      ? "Enter invoice number"
                      : "Enter quotation number"
                  }
                  required
                />

              </div>

              <div className="input-group">

                <label>
                  {isInvoice
                    ? "Invoice Date"
                    : "Quotation Date"} *
                </label>

                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="input-group">

                <label>Due Date *</label>

                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>

          </div>

          {/* CUSTOMER DETAILS */}

          <div className="form-section">

            <div className="section-title">
              <span>02</span>
              Customer Details
            </div>

            <div className="form-grid">

              <div className="input-group">

                <label>M/S *</label>

                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  placeholder="Customer / Company Name"
                  required
                />

              </div>

              <div className="input-group">

                <label>Phone *</label>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Customer phone number"
                  required
                />

              </div>

              <div className="input-group full-width">

                <label>Address *</label>

                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Customer complete address"
                  rows="2"
                  required
                />

              </div>

              <div className="input-group">

                <label>GSTIN</label>

                <input
                  type="text"
                  name="gstin"
                  value={formData.gstin}
                  onChange={handleChange}
                  placeholder="Customer GSTIN"
                />

              </div>

              <div className="input-group">

                <label>PAN</label>

                <input
                  type="text"
                  name="pan"
                  value={formData.pan}
                  onChange={handleChange}
                  placeholder="Customer PAN"
                />

              </div>

              <div className="input-group">

                <label>Place of Supply *</label>

                <input
                  type="text"
                  name="placeOfSupply"
                  value={formData.placeOfSupply}
                  onChange={handleChange}
                  placeholder="Place of supply"
                  required
                />

              </div>

            </div>

          </div>

          {/* PRODUCT DETAILS */}

          <div className="form-section">

            <div className="section-title product-heading">

              <div>
                <span>03</span>
                Product / Service Details
              </div>

              <button
                type="button"
                className="add-item-btn"
                onClick={addItem}
              >
                + Add Item
              </button>

            </div>

            <div className="items-container">

              {formData.items.map((item, index) => {

                const calculation = calculateItem(item);

                return (
                  <div
                    className="item-card"
                    key={index}
                  >

                    <div className="item-number">
                      #{index + 1}
                    </div>

                    <div className="item-grid">

                      <div className="input-group item-name">

                        <label>
                          Name of Product / Service *
                        </label>

                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "name",
                              e.target.value
                            )
                          }
                          placeholder="Product / Service"
                          required
                        />

                      </div>

                      <div className="input-group">

                        <label>HSN / SAC *</label>

                        <input
                          type="text"
                          value={item.hsn}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "hsn",
                              e.target.value
                            )
                          }
                          placeholder="HSN / SAC"
                          required
                        />

                      </div>

                      <div className="input-group">

                        <label>Qty *</label>

                        <input
                          type="number"
                          min="1"
                          value={item.qty}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "qty",
                              e.target.value
                            )
                          }
                          required
                        />

                      </div>

                      <div className="input-group">

                        <label>Rate *</label>

                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.rate}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "rate",
                              e.target.value
                            )
                          }
                          placeholder="0.00"
                          required
                        />

                      </div>

                      <div className="input-group">

                        <label>Taxable Value</label>

                        <input
                          type="text"
                          value={calculation.taxableValue.toFixed(2)}
                          readOnly
                        />

                      </div>

                      <div className="input-group">

                        <label>CGST %</label>

                        <input
                          type="number"
                          min="0"
                          value={item.cgstPercent}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "cgstPercent",
                              e.target.value
                            )
                          }
                        />

                      </div>

                      <div className="input-group">

                        <label>SGST %</label>

                        <input
                          type="number"
                          min="0"
                          value={item.sgstPercent}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "sgstPercent",
                              e.target.value
                            )
                          }
                        />

                      </div>

                      <div className="input-group">

                        <label>Total</label>

                        <input
                          type="text"
                          value={calculation.total.toFixed(2)}
                          readOnly
                        />

                      </div>

                    </div>

                    {formData.items.length > 1 && (
                      <button
                        type="button"
                        className="remove-item-btn"
                        onClick={() => removeItem(index)}
                      >
                        Remove Item
                      </button>
                    )}

                  </div>
                );
              })}

            </div>

          </div>

          {/* TOTALS */}

          <div className="form-section">

            <div className="section-title">
              <span>04</span>
              Bill Summary
            </div>

            <div className="summary-box">

              <div className="summary-row">

                <span>Taxable Amount</span>

                <strong>
                   {totals.taxable.toFixed(2)}
                </strong>

              </div>

              <div className="summary-row">

                <span>Add : CGST</span>

                <strong>
                   {totals.cgst.toFixed(2)}
                </strong>

              </div>

              <div className="summary-row">

                <span>Add : SGST</span>

                <strong>
                   {totals.sgst.toFixed(2)}
                </strong>

              </div>

              <div className="summary-row">

                <span>Total Tax</span>

                <strong>
                   {(totals.cgst + totals.sgst).toFixed(2)}
                </strong>

              </div>

              <div className="summary-row final-total">

                <span>Total Amount After Tax</span>

                <strong>
                   {totals.total.toFixed(2)}
                </strong>

              </div>

            </div>

          </div>

          {/* ACTIONS */}

          <div className="modal-actions">

            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="generate-btn"
            >
              {isInvoice
                ? "Generate GST Invoice"
                : "Generate Quotation"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}

export default InvoiceModal;