export function printInvoice() {
  const printContent = document.createElement("div");
  printContent.innerHTML =
    document.querySelector(".print-container")?.innerHTML || "";

  const originalBody = document.body.innerHTML;
  document.body.innerHTML = `
        <style>
            @media print {
                body { padding: 20px; font-family: system-ui, sans-serif; }
                .print-header { margin-bottom: 20px; }
                table { width: 100%; border-collapse: collapse; }
                th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
                th { font-weight: 600; }
                .text-right { text-align: right; }
                .summary { margin-top: 20px; margin-left: auto; width: 250px; }
                .summary-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
                .summary-total { font-weight: bold; border-top: 1px solid #ddd; padding-top: 8px; }
                .no-print { display: none; }
            }
        </style>
        <div>${printContent.innerHTML}</div>
    `;

  window.print();
  document.body.innerHTML = originalBody;
}
