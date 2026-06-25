import { Link } from "react-router-dom";
import { Clock } from "lucide-react";
import { calculateReadTime } from "@/lib/readTime";

interface ArticleCardProps {
  slug: string;
  title: string;
  summary: string;
  category?: string;
  content?: string;
}

const ArticleCard = ({ slug, title, summary, category, content }: ArticleCardProps) => {
  return (
    <Link to={`/articles/${slug}`} className="article-card">
      <h3>{title}</h3>
      {(category || content) && (
        <div className="article-card-meta">
          {category && <span>{category}</span>}
          {content && (
            <>
              {category && <span>·</span>}
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {calculateReadTime(content)} min
              </span>
            </>
          )}
        </div>
      )}
      <p>{summary}</p>
    </Link>
  );
};

export default ArticleCard;
