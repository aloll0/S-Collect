/**
 * Export data array to CSV / Excel with UTF-8 BOM for Arabic support
 */
export function exportToCSV<T extends Record<string, any>>(
  filename: string,
  headers: { key: keyof T; label: string }[],
  data: T[]
) {
  if (!data.length) return;

  const headerRow = headers.map((h) => `"${h.label.replace(/"/g, '""')}"`).join(',');
  const dataRows = data.map((item) =>
    headers
      .map((h) => {
        const val = item[h.key] ?? '';
        return `"${String(val).replace(/"/g, '""')}"`;
      })
      .join(',')
  );

  // \uFEFF is UTF-8 Byte Order Mark for Excel Arabic support
  const csvContent = '\uFEFF' + [headerRow, ...dataRows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export table data as PDF using printable window document
 */
export function exportToPDF<T extends Record<string, any>>(
  title: string,
  headers: { key: keyof T; label: string }[],
  data: T[]
) {
  if (!data.length) return;

  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const tableHeaders = headers.map((h) => `<th style="padding: 10px; border-bottom: 2px solid #e5e7eb; text-align: start; font-size: 12px; color: #6b7280;">${h.label}</th>`).join('');
  const tableRows = data
    .map(
      (item) =>
        `<tr style="border-bottom: 1px solid #f3f4f6;">${headers
          .map(
            (h) =>
              `<td style="padding: 10px; font-size: 12px; color: #111827;">${item[h.key] ?? ''}</td>`
          )
          .join('')}</tr>`
    )
    .join('');

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>${title}</title>
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; margin: 20px; color: #111827; }
          h1 { font-size: 20px; font-weight: bold; margin-bottom: 16px; color: #111827; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          @media print {
            body { margin: 0; }
          }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <p style="font-size: 12px; color: #6b7280; margin-bottom: 15px;">Generated on ${new Date().toLocaleDateString()}</p>
        <table>
          <thead>
            <tr>${tableHeaders}</tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}
