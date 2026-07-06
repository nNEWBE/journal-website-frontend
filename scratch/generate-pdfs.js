const fs = require('fs');
const path = require('path');

const articles = [
  {
    id: "ART-2026-001",
    slug: "community-healthcare-access-savar",
    title: "Community healthcare access patterns around Savar: A mixed-method university catchment study",
    authors: "Dr. Farhana Rahman, Md. Jamil Hossain, Nusrat A. Karim",
    doi: "10.5555/gbj.2026.001"
  },
  {
    id: "ART-2026-002",
    slug: "pharmacy-practice-antimicrobial-stewardship",
    title: "Pharmacy practice readiness for antimicrobial stewardship in teaching settings",
    authors: "Prof. Saiful Islam, Tania Sultana",
    doi: "10.5555/gbj.2026.002"
  },
  {
    id: "ART-2026-003",
    slug: "climate-resilient-smallholder-agriculture: Field observations from central Bangladesh",
    slugReal: "climate-resilient-agriculture-manifolds",
    title: "Climate-resilient smallholder agriculture: Field observations from central Bangladesh",
    authors: "Dr. Mahbub Alam, Sharmin Jahan",
    doi: "10.5555/gbj.2026.003"
  },
  {
    id: "ART-2026-004",
    slug: "legal-aid-university-clinic",
    title: "University legal aid clinics and access to justice: A governance perspective",
    authors: "Dr. Rehana Akter",
    doi: "10.5555/gbj.2026.004"
  },
  {
    id: "ART-2026-005",
    slug: "ai-assisted-learning-private-universities",
    title: "AI-assisted learning in private universities: Student confidence, risk, and academic integrity",
    authors: "Md. Rafiq Hasan, Samia Noor, Dr. Arup Chandra",
    doi: "10.5555/gbj.2026.005"
  }
];

const pdfDir = path.join(__dirname, '..', 'public', 'pdfs');
if (!fs.existsSync(pdfDir)) {
  fs.mkdirSync(pdfDir, { recursive: true });
}

articles.forEach(art => {
  const slug = art.slugReal || art.slug;
  const filename = `${slug}.pdf`;
  const filePath = path.join(pdfDir, filename);

  // Clean strings for PDF Tj operators (replace parentheses/special chars if any)
  const cleanTitle = art.title.replace(/[()]/g, '');
  const cleanAuthors = art.authors.replace(/[()]/g, '');
  const cleanDoi = art.doi.replace(/[()]/g, '');

  const streamText = `BT
/F1 16 Tf
50 780 Td
(GONO BISHWABIDYALAY JOURNAL OF RESEARCH) Tj
/F1 12 Tf
0 -40 Td
(Title: ${cleanTitle}) Tj
0 -25 Td
(Authors: ${cleanAuthors}) Tj
0 -20 Td
(DOI: ${cleanDoi}) Tj
0 -30 Td
(Document Type: Peer-Reviewed, Open-Access Research Paper) Tj
0 -30 Td
(This is a verified academic manuscript published by Gono Bishwabidyalay Press.) Tj
0 -20 Td
(To view or cite this article, use the DOI above or visit the official portal.) Tj
ET`;

  const streamLength = Buffer.byteLength(streamText);

  // PDF components
  const obj1 = `1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n`;
  const obj2 = `2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n`;
  const obj3 = `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>\nendobj\n`;
  const obj4 = `4 0 obj\n<< /Length ${streamLength} >>\nstream\n${streamText}\nendstream\nendobj\n`;
  const obj5 = `5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n`;

  // Write file
  let pdfContent = `%PDF-1.4\n`;
  const offsets = [];

  offsets.push(pdfContent.length);
  pdfContent += obj1;

  offsets.push(pdfContent.length);
  pdfContent += obj2;

  offsets.push(pdfContent.length);
  pdfContent += obj3;

  offsets.push(pdfContent.length);
  pdfContent += obj4;

  offsets.push(pdfContent.length);
  pdfContent += obj5;

  const xrefOffset = pdfContent.length;
  let xref = `xref\n0 6\n0000000000 65535 f \n`;
  offsets.forEach(offset => {
    xref += `${String(offset).padStart(10, '0')} 00000 n \n`;
  });

  pdfContent += xref;
  pdfContent += `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

  fs.writeFileSync(filePath, pdfContent);
  console.log(`Generated PDF for ${slug} at ${filePath}`);
});
