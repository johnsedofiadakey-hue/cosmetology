export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  clientName: string;
  serviceName: string;
  amount: number;
  companyName: string;
}

export function generateInvoiceSummary(data: InvoiceData) {
  return `
    INVOICE: ${data.invoiceNumber}
    DATE: ${data.date}
    -------------------------
    CLIENT: ${data.clientName}
    SERVICE: ${data.serviceName}
    TOTAL: $${data.amount.toFixed(2)}
    -------------------------
    Thank you for choosing ${data.companyName}!
  `;
}
