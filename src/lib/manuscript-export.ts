/**
 * Utility functions to export academic manuscripts to Microsoft Word (.docx)
 * and formatted print/PDF.
 */

export function buildWordDocumentHtml(contentHtml: string, title: string): string {
  return `<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office'
      xmlns:w='urn:schemas-microsoft-com:office:word'
      xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    @page Section1 {
      size: 8.5in 11.0in;
      margin: 1.0in 1.0in 1.0in 1.0in;
      mso-header-margin: 0.5in;
      mso-footer-margin: 0.5in;
      mso-paper-source: 0;
    }
    div.Section1 {
      page: Section1;
    }
    body {
      font-family: 'Times New Roman', Georgia, serif;
      font-size: 12pt;
      line-height: 2.0;
      color: #000000;
      background-color: #ffffff;
      margin: 0;
      padding: 0;
    }
    h1 {
      font-size: 18pt;
      font-weight: bold;
      line-height: 1.3;
      margin-top: 24pt;
      margin-bottom: 12pt;
      page-break-after: avoid;
    }
    h2 {
      font-size: 14pt;
      font-weight: bold;
      line-height: 1.4;
      margin-top: 18pt;
      margin-bottom: 8pt;
      page-break-after: avoid;
    }
    h3 {
      font-size: 12pt;
      font-weight: bold;
      margin-top: 12pt;
      margin-bottom: 6pt;
      page-break-after: avoid;
    }
    p {
      margin-top: 0;
      margin-bottom: 12pt;
      line-height: 2.0;
      text-align: justify;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 16pt 0;
      font-size: 10.5pt;
      line-height: 1.4;
    }
    table, th, td {
      border: 0.5pt solid #333333;
    }
    th {
      background-color: #f2f2f2;
      font-weight: bold;
      padding: 6pt 8pt;
      text-align: left;
    }
    td {
      padding: 5pt 8pt;
      vertical-align: top;
    }
    blockquote {
      margin: 12pt 24pt;
      padding-left: 12pt;
      border-left: 3pt solid #666666;
      font-style: italic;
      color: #444444;
    }
    ul, ol {
      margin-top: 0;
      margin-bottom: 12pt;
      padding-left: 24pt;
    }
    li {
      margin-bottom: 6pt;
      line-height: 1.8;
    }
    img {
      max-width: 100%;
      height: auto;
      margin: 12pt auto;
      display: block;
    }
    .page-break {
      page-break-before: always;
    }
  </style>
</head>
<body>
  <div class="Section1">
    ${contentHtml}
  </div>
</body>
</html>`;
}

export function downloadAsDocx(contentHtml: string, filename: string): void {
  const safeFilename = (filename || "manuscript").trim().replace(/[^a-zA-Z0-9_\-\s]/g, "");
  const wordDoc = buildWordDocumentHtml(contentHtml, safeFilename);
  const blob = new Blob(["\ufeff", wordDoc], {
    type: "application/vnd.ms-word;charset=utf-8",
  });

  const downloadUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = `${safeFilename}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
}

export function createManuscriptFile(contentHtml: string, title: string): File {
  const safeFilename = (title || "blinded_manuscript").trim().replace(/[^a-zA-Z0-9_\-\s]/g, "");
  const wordDoc = buildWordDocumentHtml(contentHtml, safeFilename);
  const blob = new Blob(["\ufeff", wordDoc], {
    type: "application/vnd.ms-word;charset=utf-8",
  });
  return new File([blob], `${safeFilename}.docx`, {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    lastModified: Date.now(),
  });
}

export function printManuscriptDocument(): void {
  window.print();
}
