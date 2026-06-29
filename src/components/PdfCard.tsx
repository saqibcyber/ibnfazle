import { FileText } from "lucide-react";

interface PdfCardProps {
  title: string;
  summary: string;
  fileUrl: string;
  category?: string;
  pageCount?: number;
}

const PdfCard = ({ title, summary, fileUrl, category, pageCount }: PdfCardProps) => {
  return (
    <a
      href={fileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="article-card"
    >
      <h3>{title}</h3>
      {(category || pageCount) && (
        <div className="article-card-meta">
          {category && <span>{category}</span>}
          {pageCount && (
            <>
              {category && <span>·</span>}
              <span className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                {pageCount} pages
              </span>
            </>
          )}
        </div>
      )}
      <p>{summary}</p>
    </a>
  );
};

export default PdfCard;
