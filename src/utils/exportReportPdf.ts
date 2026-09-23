import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { TransactionReportItem } from "@/components/admin/ReportTable";

export interface ExportReportOptions {
  items: TransactionReportItem[];
  periodLabel: string;
  categoryLabel: string;
  searchTerm?: string;
}

export function exportReportToPdf({
  items,
  periodLabel,
  categoryLabel,
  searchTerm = "",
}: ExportReportOptions) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;

  /*
   * Semua data yang masuk ke laporan dianggap
   * sebagai transaksi yang sudah berhasil dibayar.
   */
  const totalAmount = items.reduce(
    (total, item) => total + item.amount,
    0
  );

  const now = new Date();

  const dateFormatted = now.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const timeFormatted = now.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // ==============================
  // WARNA
  // ==============================

  const black = [15, 23, 42];
  const darkGray = [51, 65, 85];
  const gray = [100, 116, 139];
  const lightGray = [226, 232, 240];
  const veryLightGray = [248, 250, 252];
  const white = [255, 255, 255];

  // ==============================
  // HEADER / KOP LAPORAN
  // ==============================

  doc.setTextColor(
    black[0],
    black[1],
    black[2]
  );

  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);

  doc.text(
    "SISTEM BOOKING LAPANGAN",
    pageWidth / 2,
    17,
    {
      align: "center",
    }
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);

  doc.text(
    "Laporan Administrasi dan Transaksi Pemesanan Lapangan",
    pageWidth / 2,
    23,
    {
      align: "center",
    }
  );

  // Garis kop
  doc.setDrawColor(
    black[0],
    black[1],
    black[2]
  );

  doc.setLineWidth(0.8);

  doc.line(
    margin,
    28,
    pageWidth - margin,
    28
  );

  doc.setLineWidth(0.2);

  doc.line(
    margin,
    30,
    pageWidth - margin,
    30
  );

  // ==============================
  // JUDUL
  // ==============================

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);

  doc.text(
    "LAPORAN TRANSAKSI PEMESANAN",
    pageWidth / 2,
    40,
    {
      align: "center",
    }
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);

  doc.text(
    `Periode: ${periodLabel}`,
    pageWidth / 2,
    46,
    {
      align: "center",
    }
  );

  // ==============================
  // INFORMASI LAPORAN
  // ==============================

  const infoY = 54;

  doc.setFillColor(
    veryLightGray[0],
    veryLightGray[1],
    veryLightGray[2]
  );

  doc.rect(
    margin,
    infoY,
    pageWidth - margin * 2,
    29,
    "F"
  );

  doc.setFontSize(8.5);

  doc.setTextColor(
    darkGray[0],
    darkGray[1],
    darkGray[2]
  );

  doc.setFont("helvetica", "bold");

  doc.text(
    "INFORMASI LAPORAN",
    margin + 4,
    infoY + 6
  );

  // Kolom kiri
  doc.setFont("helvetica", "normal");

  doc.text(
    "Periode",
    margin + 4,
    infoY + 13
  );

  doc.text(
    "Lapangan",
    margin + 4,
    infoY + 20
  );

  doc.text(
    "Jumlah Transaksi",
    margin + 4,
    infoY + 26
  );

  doc.setFont("helvetica", "bold");

  doc.text(
    `: ${periodLabel}`,
    margin + 35,
    infoY + 13
  );

  doc.text(
    `: ${categoryLabel}`,
    margin + 35,
    infoY + 20
  );

  doc.text(
    `: ${items.length} transaksi`,
    margin + 35,
    infoY + 26
  );

  // Kolom kanan
  const rightX = 110;

  doc.setFont("helvetica", "normal");

  doc.text(
    "Tanggal Cetak",
    rightX,
    infoY + 13
  );

  doc.text(
    "Pencarian",
    rightX,
    infoY + 20
  );

  doc.text(
    "Jenis Laporan",
    rightX,
    infoY + 26
  );

  doc.setFont("helvetica", "bold");

  doc.text(
    `: ${dateFormatted}`,
    rightX + 30,
    infoY + 13
  );

  doc.text(
    `: ${searchTerm || "-"}`,
    rightX + 30,
    infoY + 20
  );

  doc.text(
    ": Transaksi Pembayaran",
    rightX + 30,
    infoY + 26
  );
    // ==============================
  // REKAPITULASI TRANSAKSI
  // ==============================

  const summaryY = infoY + 37;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);

  doc.setTextColor(
    black[0],
    black[1],
    black[2]
  );

  doc.text(
    "A. REKAPITULASI TRANSAKSI",
    margin,
    summaryY
  );

  // Total transaksi
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);

  doc.setTextColor(
    darkGray[0],
    darkGray[1],
    darkGray[2]
  );

  doc.text(
    `Total Transaksi       : ${items.length} transaksi`,
    margin + 4,
    summaryY + 7
  );

  // Total pendapatan
  doc.text(
    `Total Pendapatan      : Rp ${totalAmount.toLocaleString("id-ID")}`,
    margin + 4,
    summaryY + 14
  );

  // ==============================
  // TABEL TRANSAKSI
  // ==============================

  const tableStartY = summaryY + 22;
const summaryFinalY =
  (doc as any).lastAutoTable?.finalY || summaryY + 25;

const tableData = items.map(
  (item, index) => [
    (index + 1).toString(),
    item.bookingCode,
    `${item.customerName}`,
    item.lapanganName,
    `${item.date}\n${item.timeSlot}`,
    item.paymentMethod,
    `Rp ${item.amount.toLocaleString("id-ID")}`,
  ]
);

autoTable(doc, {
  startY: tableStartY,

  head: [
    [
      "No",
      "Kode Booking",
      "Pelanggan",
      "Lapangan",
      "Tanggal / Sesi",
      "Metode Pembayaran",
      "Total",
    ],
  ],

  body: tableData,

  theme: "plain",

  styles: {
    font: "helvetica",
    fontSize: 7,
    textColor: darkGray,
    lineColor: lightGray,
    lineWidth: 0.2,
    cellPadding: 1.5,
    valign: "middle",
  },

  headStyles: {
    fillColor: white,
    textColor: black,
    fontStyle: "bold",
    fontSize: 7,
    halign: "center",
    valign: "middle",
  },

  columnStyles: {
    0: {
      halign: "center",
      cellWidth: 9,
    },

    1: {
      fontStyle: "bold",
      cellWidth: 27,
    },

    2: {
      cellWidth: 25,
    },

    3: {
      cellWidth: 39,
    },

    4: {
      cellWidth: 27,
      halign: "center",
    },

    5: {
      cellWidth: 28,
      halign: "center",
    },

    6: {
      cellWidth: 25,
    },
  },

  margin: {
    left: margin,
    right: margin,
    top: 35,
    bottom: 28,
  },

  showHead: "everyPage",
});
  // ==============================
  // PENGESAHAN
  // ==============================

  const finalY =
    (doc as any).lastAutoTable?.finalY || 120;

  let approvalY = finalY + 15;

  if (approvalY + 55 > pageHeight - 20) {
    doc.addPage();

    approvalY = 30;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);

  doc.setTextColor(
    black[0],
    black[1],
    black[2]
  );

  doc.text(
    "B. PENGESAHAN LAPORAN",
    margin,
    approvalY
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);

  doc.setTextColor(
    darkGray[0],
    darkGray[1],
    darkGray[2]
  );

  doc.text(
    `Laporan ini dicetak pada ${dateFormatted}, pukul ${timeFormatted} WIB.`,
    margin,
    approvalY + 7
  );

  // ==============================
  // TANDA TANGAN
  // ==============================

  const signatureWidth = 55;

  const signature1X = 55;

  const signature2X =
    pageWidth - 55;

  doc.text(
    "Dibuat oleh,",
    signature1X,
    approvalY + 17,
    {
      align: "center",
    }
  );

  doc.text(
    "Mengetahui,",
    signature2X,
    approvalY + 17,
    {
      align: "center",
    }
  );

  doc.text(
    "Admin / Pengelola",
    signature1X,
    approvalY + 22,
    {
      align: "center",
    }
  );

  doc.text(
    "Penanggung Jawab",
    signature2X,
    approvalY + 22,
    {
      align: "center",
    }
  );

  doc.line(
    signature1X - signatureWidth / 2,
    approvalY + 45,
    signature1X + signatureWidth / 2,
    approvalY + 45
  );

  doc.line(
    signature2X - signatureWidth / 2,
    approvalY + 45,
    signature2X + signatureWidth / 2,
    approvalY + 45
  );

  doc.setFont("helvetica", "bold");

  doc.text(
    "( __________________ )",
    signature1X,
    approvalY + 50,
    {
      align: "center",
    }
  );

  doc.text(
    "( __________________ )",
    signature2X,
    approvalY + 50,
    {
      align: "center",
    }
  );

  // ==============================
  // FOOTER SETIAP HALAMAN
  // ==============================

  const pageCount =
    (doc as any).internal.getNumberOfPages();

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    doc.setDrawColor(
      lightGray[0],
      lightGray[1],
      lightGray[2]
    );

    doc.setLineWidth(0.3);

    doc.line(
      margin,
      pageHeight - 13,
      pageWidth - margin,
      pageHeight - 13
    );

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);

    doc.setTextColor(
      gray[0],
      gray[1],
      gray[2]
    );

    doc.text(
      "Dokumen ini dihasilkan secara otomatis oleh Sistem Booking Lapangan.",
      margin,
      pageHeight - 7
    );

    doc.text(
      `Halaman ${i} dari ${pageCount}`,
      pageWidth - margin,
      pageHeight - 7,
      {
        align: "right",
      }
    );
  }

  // ==============================
  // PREVIEW / DOWNLOAD
  // ==============================

  const pdfBlob = doc.output("blob");

  const blobUrl =
    URL.createObjectURL(pdfBlob);

  const previewWindow =
    window.open(blobUrl, "_blank");

  if (!previewWindow) {
    const fileNameDate =
      now.toISOString().split("T")[0];

    doc.save(
      `Laporan_Transaksi_${fileNameDate}.pdf`
    );
  }
}