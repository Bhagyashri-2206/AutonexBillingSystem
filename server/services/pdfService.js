const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

// ======================================================
// LOGO PATH
// ======================================================

const logoPath = path.join(
  __dirname,
  "../../client/src/assets/autonex-logo.png"
);

// ======================================================
// DATE FORMAT
// ======================================================

const formatDate = (date) => {
  if (!date) return "";

  const dateString = String(date);

  if (/^\d{2}-\d{2}-\d{4}$/.test(dateString)) {
    return dateString;
  }

  const parts = dateString.split("-");

  if (parts.length === 3 && parts[0].length === 4) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }

  const d = new Date(dateString);

  if (isNaN(d.getTime())) {
    return dateString;
  }

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  return `${day}-${month}-${year}`;
};

// ======================================================
// NUMBER TO WORDS
// ======================================================

const numberToWords = (num) => {
  num = Math.floor(Number(num) || 0);

  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];

  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  const convertBelow1000 = (n) => {
    let result = "";

    if (n >= 100) {
      result += `${ones[Math.floor(n / 100)]} Hundred`;
      n %= 100;

      if (n > 0) {
        result += " ";
      }
    }

    if (n >= 20) {
      result += tens[Math.floor(n / 10)];
      n %= 10;

      if (n > 0) {
        result += `-${ones[n]}`;
      }
    } else if (n > 0) {
      result += ones[n];
    }

    return result;
  };

  if (num === 0) {
    return "Zero";
  }

  let result = "";

  const crore = Math.floor(num / 10000000);
  num %= 10000000;

  const lakh = Math.floor(num / 100000);
  num %= 100000;

  const thousand = Math.floor(num / 1000);
  num %= 1000;

  if (crore > 0) {
    result += `${convertBelow1000(crore)} Crore`;
  }

  if (lakh > 0) {
    if (result) result += " ";
    result += `${convertBelow1000(lakh)} Lakh`;
  }

  if (thousand > 0) {
    if (result) result += " ";
    result += `${convertBelow1000(thousand)} Thousand`;
  }

  if (num > 0) {
    if (result) result += " ";
    result += convertBelow1000(num);
  }

  return result;
};

// ======================================================
// AMOUNT TO WORDS
// ======================================================

const amountToWords = (amount) => {
  amount = Number(amount) || 0;

  const rupees = Math.floor(amount);
  const paise = Math.round((amount - rupees) * 100);

  let result = `Rupees ${numberToWords(rupees)}`;

  if (paise > 0) {
    result += ` and ${numberToWords(paise)} Paise`;
  }

  result += " Only";

  return result;
};

// ======================================================
// GENERATE PDF
// ======================================================

const generateInvoicePDF = (data) => {
  return new Promise((resolve, reject) => {
    try {
      // ==================================================
      // UPLOAD DIRECTORY
      // ==================================================

      const uploadDir = path.join(
        __dirname,
        "../uploads/pdf"
      );

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, {
          recursive: true,
        });
      }

      // ==================================================
      // DOCUMENT TYPE
      // ==================================================

      const isQuotation =
        data.documentType === "quotation";

      // ==================================================
      // FILE NAME
      // ==================================================

      const fileName = `${
        isQuotation ? "Quotation" : "GST-Invoice"
      }-${data.number}-${Date.now()}.pdf`;

      const filePath = path.join(
        uploadDir,
        fileName
      );

      // ==================================================
      // CREATE PDF
      // ==================================================

      const doc = new PDFDocument({
        size: "A4",
        margins: {
          top: 35,
          bottom: 35,
          left: 35,
          right: 35,
        },
      });

      const stream =
        fs.createWriteStream(filePath);

      doc.pipe(stream);

      // ==================================================
      // COLORS
      // ==================================================

      const teal = "#168A91";
      const lightTeal = "#D9F1F3";
      const black = "#000000";

      // ==================================================
      // PAGE DIMENSIONS
      // ==================================================

      const left = 40;
      const right = 555;
      const contentWidth = 515;

      // ==================================================
      // HEADER
      // ==================================================

      if (fs.existsSync(logoPath)) {
        doc.image(
          logoPath,
          40,
          35,
          {
            width: 75,
          }
        );
      }

      doc
        .font("Helvetica-Bold")
        .fontSize(19)
        .fillColor(black)
        .text(
          "Autonex",
          left + 85,
          48
        );

      doc
        .font("Helvetica-Bold")
        .fontSize(17)
        .text(
          "Technologies",
          left + 85,
          70
        );

      // ==================================================
      // COMPANY DETAILS
      // ==================================================

      doc
        .font("Helvetica-Bold")
        .fontSize(9)
        .fillColor(black)
        .text(
          "Name : ",
          280,
          48,
          {
            continued: true,
          }
        );

      doc
        .font("Helvetica")
        .text(
          "Satish Eknath Patil"
        );

      doc
        .font("Helvetica-Bold")
        .text(
          "Phone : ",
          280,
          63,
          {
            continued: true,
          }
        );

      doc
        .font("Helvetica")
        .text("9370504388");

      doc
        .font("Helvetica-Bold")
        .text(
          "Email : ",
          280,
          78,
          {
            continued: true,
          }
        );

      doc
        .font("Helvetica")
        .text(
          "service.autonextechnologies@gmail.com"
        );

      // ==================================================
      // TOP LINE
      // ==================================================

      doc
        .moveTo(left, 105)
        .lineTo(right, 105)
        .lineWidth(2)
        .strokeColor(teal)
        .stroke();

      // ==================================================
      // MAIN HEADER
      // ==================================================

      const headerY = 115;
      const headerH = 24;

      doc
        .rect(
          left,
          headerY,
          contentWidth,
          headerH
        )
        .lineWidth(1)
        .strokeColor(teal)
        .stroke();

      doc
        .font("Helvetica-Bold")
        .fontSize(9)
        .fillColor(black)
        .text(
          "GSTIN: 27FZSPP9968L1ZS",
          left + 6,
          headerY + 7
        );

      doc
        .font("Helvetica-Bold")
        .fontSize(10)
        .fillColor(teal)
        .text(
          isQuotation
            ? "Quotation"
            : "TAX INVOICE",
          270,
          headerY + 6,
          {
            width: 140,
            align: "center",
          }
        );

      doc
        .font("Helvetica-Bold")
        .fontSize(8)
        .fillColor(black)
        .text(
          "ORIGINAL FOR RECIPIENT",
          425,
          headerY + 7
        );

      // ==================================================
      // CUSTOMER DETAILS
      // ==================================================

      const customerY = 139;

      // IMPORTANT:
      // Reduced height so table header comes directly below.
      const customerH = 110;

      const customerLeftW = 210;

      // Outer customer box
      doc
        .rect(
          left,
          customerY,
          contentWidth,
          customerH
        )
        .lineWidth(1)
        .strokeColor(teal)
        .stroke();

      // Vertical divider
      doc
        .moveTo(
          left + customerLeftW,
          customerY
        )
        .lineTo(
          left + customerLeftW,
          customerY + customerH
        )
        .lineWidth(0.7)
        .strokeColor(teal)
        .stroke();

      // ==================================================
      // CUSTOMER HEADING
      // ==================================================

      doc
        .font("Helvetica-Bold")
        .fontSize(9)
        .fillColor(black)
        .text(
          "Customer Detail",
          left + 5,
          customerY + 5,
          {
            width: customerLeftW - 10,
            align: "center",
          }
        );

      // Heading line
      doc
        .moveTo(
          left,
          customerY + 22
        )
        .lineTo(
          left + customerLeftW,
          customerY + 22
        )
        .lineWidth(0.7)
        .strokeColor(teal)
        .stroke();

      // ==================================================
      // CUSTOMER INFORMATION
      // ==================================================

      let customerTextY =
        customerY + 27;

      const customerFields = [
        ["M/S", data.customerName || ""],
        ["Address", data.address || ""],
        ["Phone", data.phone || ""],
        ["GSTIN", data.gstin || ""],
        ["PAN", data.pan || ""],
        [
          "Place of Supply",
          data.placeOfSupply || "",
        ],
      ];

      customerFields.forEach(
        ([label, value]) => {

          doc
            .font("Helvetica-Bold")
            .fontSize(7.5)
            .fillColor(black)
            .text(
              label,
              left + 6,
              customerTextY,
              {
                width: 78,
              }
            );

          doc
            .font("Helvetica")
            .fontSize(7.5)
            .fillColor(black)
            .text(
              value,
              left + 88,
              customerTextY,
              {
                width:
                  customerLeftW - 94,
                lineBreak: false,
              }
            );

          customerTextY += 14;
        }
      );

      // ==================================================
      // DOCUMENT INFORMATION
      // ==================================================

      const infoX =
        left + customerLeftW + 8;

      doc
        .font("Helvetica")
        .fontSize(9)
        .fillColor(black)
        .text(
          `${
            isQuotation
              ? "Quotation"
              : "Invoice"
          } No. : ${data.number || ""}`,
          infoX,
          customerY + 25
        );

      doc.text(
        `${
          isQuotation
            ? "Quotation"
            : "Invoice"
        } Date : ${formatDate(data.date)}`,
        infoX,
        customerY + 48
      );

      doc.text(
        `Due Date : ${formatDate(
          data.dueDate
        )}`,
        infoX,
        customerY + 71
      );

      // ==================================================
      // ITEM TABLE
      // ==================================================

      // IMPORTANT:
      // Table starts immediately after customer box.
      const tableY =
        customerY + customerH;

      // ==================================================
      // TABLE COLUMNS
      // ==================================================

      const columns = [
        {
          name: "Sr.\nNo.",
          width: 30,
        },
        {
          name: "Name of Product /\nService",
          width: 90,
        },
        {
          name: "HSN /\nSAC",
          width: 40,
        },
        {
          name: "Qty",
          width: 28,
        },
        {
          name: "Rate",
          width: 47,
        },
        {
          name: "Taxable\nValue",
          width: 60,
        },
        {
          name: "CGST\n%",
          width: 38,
        },
        {
          name: "CGST\nAmount",
          width: 44,
        },
        {
          name: "SGST\n%",
          width: 38,
        },
        {
          name: "SGST\nAmount",
          width: 44,
        },
        {
          name: "Total",
          width: 56,
        },
      ];

      const tableWidth =
        columns.reduce(
          (sum, col) =>
            sum + col.width,
          0
        );

      // ==================================================
      // TABLE HEADER
      // ==================================================

      const tableHeaderH = 38;

      // Header background
      doc
        .rect(
          left,
          tableY,
          tableWidth,
          tableHeaderH
        )
        .fillColor(lightTeal)
        .fill();

      // Header cells
      let headerX = left;

      columns.forEach((col) => {

        doc
          .rect(
            headerX,
            tableY,
            col.width,
            tableHeaderH
          )
          .lineWidth(0.7)
          .strokeColor(teal)
          .stroke();

        doc
          .font("Helvetica-Bold")
          .fontSize(6.5)
          .fillColor(black)
          .text(
            col.name,
            headerX + 2,
            tableY + 8,
            {
              width:
                col.width - 4,
              align: "center",
            }
          );

        headerX += col.width;
      });

      // ==================================================
      // ITEMS
      // ==================================================

      // IMPORTANT:
      // Define items BEFORE using them.
      const items = Array.isArray(data.items)
        ? data.items
        : [];

      // Maximum 8 rows
      const maxRows = 8;

      // Current vertical position
      let currentY =
        tableY + tableHeaderH;

      // ==================================================
      // DYNAMIC ITEM ROWS
      // ==================================================

      for (
        let i = 0;
        i < maxRows;
        i++
      ) {

        const item = items[i];

        // Default row height
        let rowHeight = 25;

        // ------------------------------------------------
        // DYNAMIC HEIGHT FOR PRODUCT NAME
        // ------------------------------------------------

        if (item) {

          doc
            .font("Helvetica")
            .fontSize(6.5);

          const textHeight =
            doc.heightOfString(
              item.name || "",
              {
                width:
                  columns[1].width - 8,
                align: "left",
              }
            );

          rowHeight = Math.max(
            25,
            textHeight + 8
          );
        }

        // ==================================================
        // DRAW ROW CELLS
        // ==================================================

        let rowX = left;

        columns.forEach((col) => {

          doc
            .rect(
              rowX,
              currentY,
              col.width,
              rowHeight
            )
            .lineWidth(0.7)
            .strokeColor(teal)
            .stroke();

          rowX += col.width;
        });

        // ==================================================
        // DRAW ITEM DATA
        // ==================================================

        if (item) {

          const taxable =
            Number(
              item.taxableValue
            ) || 0;

          const cgst =
            Number(item.cgst) || 0;

          const sgst =
            Number(item.sgst) || 0;

          const total =
            Number(item.total) || 0;

          const values = [
            i + 1,
            item.name || "",
            item.hsn || "",
            item.qty || "",
            Number(
              item.rate || 0
            ).toFixed(2),
            taxable.toFixed(2),
            item.cgstPercent || 0,
            cgst.toFixed(2),
            item.sgstPercent || 0,
            sgst.toFixed(2),
            total.toFixed(2),
          ];

          let valueX = left;

          values.forEach(
            (value, index) => {

              doc
                .font("Helvetica")
                .fontSize(6.5)
                .fillColor(black);

              // ------------------------------------------------
              // PRODUCT NAME
              // ------------------------------------------------

              if (index === 1) {

                doc.text(
                  String(value),
                  valueX + 4,
                  currentY + 4,
                  {
                    width:
                      columns[index]
                        .width - 8,
                    align: "left",
                  }
                );

              }

              // ------------------------------------------------
              // OTHER COLUMNS
              // ------------------------------------------------

              else {

                const textY =
                  currentY +
                  Math.max(
                    5,
                    (rowHeight - 8) / 2
                  );

                doc.text(
                  String(value),
                  valueX + 2,
                  textY,
                  {
                    width:
                      columns[index]
                        .width - 4,
                    align: "center",
                    lineBreak: false,
                  }
                );
              }

              valueX +=
                columns[index]
                  .width;
            }
          );
        }

        // Move to next row
        currentY += rowHeight;
      }

      // ==================================================
      // TOTAL ROW
      // ==================================================

      const totalRowY = currentY;
      const totalRowHeight = 22;

      const lastColumn =
        columns[columns.length - 1];

      const totalLabelWidth =
        tableWidth -
        lastColumn.width;

      // Background
      doc
        .rect(
          left,
          totalRowY,
          tableWidth,
          totalRowHeight
        )
        .fillColor(lightTeal)
        .fill();

      // Borders
      let totalBorderX = left;

      columns.forEach((col) => {

        doc
          .rect(
            totalBorderX,
            totalRowY,
            col.width,
            totalRowHeight
          )
          .lineWidth(0.7)
          .strokeColor(teal)
          .stroke();

        totalBorderX += col.width;
      });

      // ==================================================
      // TOTAL LABEL
      // ==================================================

      const totalCellWidth =
        columns[
          columns.length - 2
        ].width;

      const totalCellX =
        left +
        tableWidth -
        lastColumn.width -
        totalCellWidth;

      doc
        .font("Helvetica-Bold")
        .fontSize(7)
        .fillColor(black)
        .text(
          "Total",
          totalCellX,
          totalRowY + 7,
          {
            width: totalCellWidth,
            align: "center",
            lineBreak: false,
          }
        );

      // ==================================================
      // TOTAL AMOUNT
      // ==================================================

      // NO ₹ SYMBOL
      doc
        .font("Helvetica-Bold")
        .fontSize(7)
        .fillColor(black)
        .text(
          Number(
            data.totalAmount || 0
          ).toFixed(2),
          left + totalLabelWidth,
          totalRowY + 7,
          {
            width:
              lastColumn.width,
            align: "center",
          }
        );

      // ==================================================
      // BOTTOM SECTION
      // ==================================================

      const bottomY =
        totalRowY +
        totalRowHeight;

      const bottomHeight = 265;

      const bottomLeftW = 270;

      const bottomRightW =
        contentWidth -
        bottomLeftW;

      // ==================================================
      // OUTER BORDER
      // ==================================================

      doc
        .rect(
          left,
          bottomY,
          contentWidth,
          bottomHeight
        )
        .lineWidth(0.8)
        .strokeColor(teal)
        .stroke();

      // ==================================================
      // VERTICAL DIVIDER
      // ==================================================

      doc
        .moveTo(
          left + bottomLeftW,
          bottomY
        )
        .lineTo(
          left + bottomLeftW,
          bottomY + bottomHeight
        )
        .lineWidth(0.8)
        .strokeColor(teal)
        .stroke();

      // ==================================================
      // LEFT SIDE
      // ==================================================

      // ==================================================
      // TOTAL IN WORDS
      // ==================================================

      const wordsHeight = 45;

      doc
        .rect(
          left,
          bottomY,
          bottomLeftW,
          wordsHeight
        )
        .lineWidth(0.7)
        .strokeColor(teal)
        .stroke();

      doc
        .font("Helvetica-Bold")
        .fontSize(8)
        .fillColor(black)
        .text(
          "Total in words",
          left + 5,
          bottomY + 8,
          {
            width:
              bottomLeftW - 10,
            align: "center",
          }
        );

      // Line
      doc
        .moveTo(
          left,
          bottomY + 22
        )
        .lineTo(
          left + bottomLeftW,
          bottomY + 22
        )
        .lineWidth(0.7)
        .strokeColor(teal)
        .stroke();

      // Amount words
      const wordsText =
        amountToWords(
          Number(
            data.totalAmount || 0
          )
        );

      doc
        .font("Helvetica")
        .fontSize(7)
        .fillColor(black)
        .text(
          wordsText,
          left + 10,
          bottomY + 25,
          {
            width:
              bottomLeftW - 20,
            align: "center",
            lineGap: 2,
          }
        );

      // ==================================================
      // BANK DETAILS
      // ==================================================

      const bankY =
        bottomY + wordsHeight;

      const bankHeight = 120;

      doc
        .rect(
          left,
          bankY,
          bottomLeftW,
          bankHeight
        )
        .lineWidth(0.7)
        .strokeColor(teal)
        .stroke();

      // Heading
      doc
        .font("Helvetica-Bold")
        .fontSize(8)
        .fillColor(black)
        .text(
          "Bank Details",
          left + 5,
          bankY + 8,
          {
            width:
              bottomLeftW - 10,
            align: "center",
          }
        );

      // Heading line
      doc
        .moveTo(
          left,
          bankY + 27
        )
        .lineTo(
          left + bottomLeftW,
          bankY + 27
        )
        .lineWidth(0.7)
        .strokeColor(teal)
        .stroke();

      // Bank information
      const bankDetails = [
        [
          "Name",
          "HDFC Bank , Gokul Shirgoan",
        ],
        [
          "Branch",
          "Gokul Shirgoan",
        ],
        [
          "Acc. Name",
          "AUTONEX TECHNOLOGIES",
        ],
        [
          "Acc. Number",
          "50200116931877",
        ],
        [
          "IFSC",
          "HDFC0006082",
        ],
      ];

      let bankTextY =
        bankY + 42;

      bankDetails.forEach(
        ([label, value]) => {

          doc
            .font("Helvetica-Bold")
            .fontSize(7)
            .fillColor(black)
            .text(
              label,
              left + 12,
              bankTextY,
              {
                width: 65,
              }
            );

          doc
            .font("Helvetica")
            .fontSize(7)
            .fillColor(black)
            .text(
              value,
              left + 85,
              bankTextY,
              {
                width:
                  bottomLeftW - 95,
                lineBreak: false,
              }
            );

          bankTextY += 15;
        }
      );

      // ==================================================
      // TERMS & CONDITIONS
      // ==================================================

      const termsY =
        bankY + bankHeight;

      const termsHeaderHeight = 25;

      const termsBodyHeight =
        bottomHeight -
        (termsY - bottomY) -
        termsHeaderHeight;

      // Header
      doc
        .rect(
          left,
          termsY,
          bottomLeftW,
          termsHeaderHeight
        )
        .lineWidth(0.7)
        .strokeColor(teal)
        .stroke();

      doc
        .font("Helvetica-Bold")
        .fontSize(8)
        .fillColor(black)
        .text(
          "Terms & Conditions Apply",
          left + 5,
          termsY + 8,
          {
            width:
              bottomLeftW - 10,
            align: "center",
          }
        );

      // Line
      doc
        .moveTo(
          left,
          termsY +
            termsHeaderHeight
        )
        .lineTo(
          left + bottomLeftW,
          termsY +
            termsHeaderHeight
        )
        .lineWidth(0.7)
        .strokeColor(teal)
        .stroke();

      // Body
      doc
        .rect(
          left,
          termsY +
            termsHeaderHeight,
          bottomLeftW,
          termsBodyHeight
        )
        .lineWidth(0.7)
        .strokeColor(teal)
        .stroke();

      // Terms text
      doc
        .font("Helvetica")
        .fontSize(6.5)
        .fillColor(black)
        .text(
          "Subject to our home Jurisdiction.\n" +
            "Our Responsibility Ceases as soon as goods leaves our Premises.\n" +
            (isQuotation
              ? "Goods once sold will not taken back.\n"
              : "") +
            "Delivery Ex-Premises.",
          left + 12,
          termsY +
            termsHeaderHeight +
            17,
          {
            width:
              bottomLeftW - 24,
            lineGap: 3,
          }
        );

      // ==================================================
      // RIGHT SIDE
      // ==================================================

      const summaryX =
        left + bottomLeftW;

      const summaryY = bottomY;

      // ==================================================
      // SUMMARY
      // ==================================================

      const summaryRowHeight = 24;

      const summaryRows = [
        [
          "Taxable Amount",
          Number(
            data.taxableAmount || 0
          ).toFixed(2),
        ],
        [
          "Add : CGST",
          Number(
            data.cgstAmount || 0
          ).toFixed(2),
        ],
        [
          "Add : SGST",
          Number(
            data.sgstAmount || 0
          ).toFixed(2),
        ],
        [
          "Total Tax",
          Number(
            data.totalTax || 0
          ).toFixed(2),
        ],
        [
          "Total Amount After Tax",
          Number(
            data.totalAmount || 0
          ).toFixed(2),
        ],
      ];

      summaryRows.forEach(
        (row, index) => {

          const y =
            summaryY +
            index *
              summaryRowHeight;

          // Final total background
          if (index === 4) {
            doc
              .rect(
                summaryX,
                y,
                bottomRightW,
                summaryRowHeight
              )
              .fillColor(lightTeal)
              .fill();
          }

          // Border
          doc
            .rect(
              summaryX,
              y,
              bottomRightW,
              summaryRowHeight
            )
            .lineWidth(0.7)
            .strokeColor(teal)
            .stroke();

          // Label
          doc
            .font(
              index === 4
                ? "Helvetica-Bold"
                : "Helvetica"
            )
            .fontSize(7.5)
            .fillColor(black)
            .text(
              row[0],
              summaryX + 7,
              y + 7,
              {
                width: 110,
              }
            );

          // Amount
          // NO ₹ SYMBOL
          doc
            .font("Helvetica-Bold")
            .fontSize(7.5)
            .fillColor(black)
            .text(
              row[1],
              summaryX + 105,
              y + 7,
              {
                width:
                  bottomRightW - 112,
                align: "right",
              }
            );
        }
      );

      // ==================================================
      // E & O.E.
      // ==================================================

      const eoY =
        summaryY +
        summaryRows.length *
          summaryRowHeight;

      const eoHeight = 22;

      doc
        .rect(
          summaryX,
          eoY,
          bottomRightW,
          eoHeight
        )
        .lineWidth(0.7)
        .strokeColor(teal)
        .stroke();

      doc
        .font("Helvetica")
        .fontSize(6.5)
        .fillColor(black)
        .text(
          "(E & O.E.)",
          summaryX + 5,
          eoY + 7,
          {
            width:
              bottomRightW - 10,
            align: "right",
          }
        );

      // ==================================================
      // CERTIFICATION
      // ==================================================

      const certificationY =
        eoY + eoHeight;

      const certificationHeight = 55;

      doc
        .rect(
          summaryX,
          certificationY,
          bottomRightW,
          certificationHeight
        )
        .lineWidth(0.7)
        .strokeColor(teal)
        .stroke();

      doc
        .font("Helvetica")
        .fontSize(6.5)
        .fillColor(black)
        .text(
          "Certified that the particulars given above are true and correct.",
          summaryX + 5,
          certificationY + 9,
          {
            width:
              bottomRightW - 10,
            align: "center",
          }
        );

      // ==================================================
      // COMPANY NAME
      // ==================================================

      doc
        .font("Helvetica-Bold")
        .fontSize(12)
        .fillColor(black)
        .text(
          "Autonex Technologies",
          summaryX,
          certificationY + 28,
          {
            width: bottomRightW,
            align: "center",
          }
        );

      // ==================================================
      // SIGNATURE BOX
      // ==================================================

      const signatureBoxY =
        certificationY +
        certificationHeight;

      const signatureBoxHeight = 48;

      doc
        .rect(
          summaryX,
          signatureBoxY,
          bottomRightW,
          signatureBoxHeight
        )
        .lineWidth(0.7)
        .strokeColor(teal)
        .stroke();

      // ==================================================
      // AUTHORISED SIGNATORY
      // ==================================================

      const signatoryY =
        signatureBoxY +
        signatureBoxHeight;

      const signatoryHeight = 20;

      doc
        .rect(
          summaryX,
          signatoryY,
          bottomRightW,
          signatoryHeight
        )
        .lineWidth(0.7)
        .strokeColor(teal)
        .stroke();

      doc
        .font("Helvetica-Bold")
        .fontSize(7)
        .fillColor(black)
        .text(
          "Authorised Signatory",
          summaryX,
          signatoryY + 6,
          {
            width: bottomRightW,
            align: "center",
          }
        );

      // ==================================================
      // RIGHT OUTER BORDER
      // ==================================================

      doc
        .moveTo(
          left + contentWidth,
          bottomY
        )
        .lineTo(
          left + contentWidth,
          bottomY + bottomHeight
        )
        .lineWidth(0.8)
        .strokeColor(teal)
        .stroke();

      // ==================================================
      // FINISH PDF
      // ==================================================

      doc.end();

      stream.on(
        "finish",
        () => {
          resolve(
            `uploads/pdf/${fileName}`
          );
        }
      );

      stream.on(
        "error",
        (error) => {
          reject(error);
        }
      );

    } catch (error) {
      reject(error);
    }
  });
};

// ======================================================
// EXPORT
// ======================================================

module.exports = {
  generateInvoicePDF,
};