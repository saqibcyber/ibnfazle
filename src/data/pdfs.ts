export interface PdfDocument {
  slug: string;
  title: string;
  summary: string;
  date: string;
  category?: string;
  fileUrl: string;
  pageCount?: number;
}

export const pdfs: PdfDocument[] = [
  {
    slug: "introduction-to-ilm-ul-fiqh-and-the-hanbali-madhhab",
    title: "Introduction to ʿIlm al-Fiqh & the Ḥanbalī Madhhab",
    summary:
      "A concise introduction to the origins and development of the science of Fiqh, the Madhhāhib, and the Ḥanbalī Madhhab, extracted from the book Miftāḥ al-Bidāyah by Shaykh Dr. Muṭlaq al-Jāsir",
    date: "2026-06-28",
    category: "Fiqh",
    fileUrl: "/pdfs/Introduction to ‘Ilm ul-Fiqh & the Hanbali Madhhab.pdf",
    pageCount: 9,
  }
];

export const getLatestPdfs = (limit = 3) =>
  [...pdfs]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
