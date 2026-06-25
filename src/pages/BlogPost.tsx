import { useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { ArrowLeft, Clock, Calendar, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkFootnotes from "remark-footnotes";
import SiteFooter from "@/components/SiteFooter";
import { getPostBySlug } from "@/data/posts";
import { calculateReadTime } from "@/lib/readTime";
import { format } from "date-fns";
import bismillahUrl from "@/assets/bismillah.svg";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : null;

  useEffect(() => {
    if (post) {
      document.title = `${post.title} | Thaqib ibn Fazle`;
    }
    return () => {
      document.title = "Thaqib ibn Fazle";
    };
  }, [post]);

  if (!post) {
    return <Navigate to="/articles" replace />;
  }

  const readTime = calculateReadTime(post.content);
  const formattedDate = format(new Date(post.date), "MMMM d, yyyy");

  return (
    <div className="site-wrapper">
      <header className="site-header" style={{ paddingBottom: 0 }}>
        <Link to="/" className="back-link">
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>
      </header>

      <article>
        <div className="article-page-header mb-8">
          <h1>{post.title}</h1>
          {post.category && (
            <div className="article-category">{post.category}</div>
          )}

          <div className="article-meta">
            {post.date && (
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <time dateTime={post.date}>{formattedDate}</time>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>{readTime} min</span>
            </div>
            {post.author && (
              <div className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                <span>{post.author}</span>
              </div>
            )}
          </div>
        </div>

        <div className="mb-6">
          <img
            src={bismillahUrl}
            alt="Bismillah"
            className="bismillah-img h-20 max-w-full w-auto"
          />
        </div>

        <div className="markdown-content">
          <ReactMarkdown remarkPlugins={[remarkGfm, remarkFootnotes]}>
            {post.content}
          </ReactMarkdown>
        </div>
      </article>

      <SiteFooter />
    </div>
  );
};

export default BlogPost;
