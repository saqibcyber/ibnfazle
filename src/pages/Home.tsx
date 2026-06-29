import { useEffect } from "react";
import { Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ArticleCard from "@/components/ArticleCard";
import PdfCard from "@/components/PdfCard";
import { getLatestPosts } from "@/data/posts";
import { getLatestPdfs } from "@/data/pdfs";

const Home = () => {
  const latestPosts = getLatestPosts(3);
  const latestPdfs = getLatestPdfs(3);

  useEffect(() => {
    document.title = "Thaqib ibn Fazle";
  }, []);

  return (
    <div className="site-wrapper">
      <SiteHeader align="left" />

      <div className="section-label section-label--spread">
        <Link to="/articles" className="section-heading-link">
          Latest Articles
        </Link>
        <Link to="/articles" className="section-view-all">
          View all →
        </Link>
      </div>

      <div className="article-list">
        {latestPosts.map((post) => (
          <ArticleCard
            key={post.slug}
            slug={post.slug}
            title={post.title}
            summary={post.summary}
            category={post.category}
            content={post.content}
          />
        ))}
      </div>

      <div className="site-divider" />

      <div className="section-label section-label--spread">
        <Link to="/pdfs" className="section-heading-link">
          Latest PDFs
        </Link>
        <Link to="/pdfs" className="section-view-all">
          View all →
        </Link>
      </div>

      <div className="article-list">
        {latestPdfs.map((pdf) => (
          <PdfCard
            key={pdf.slug}
            title={pdf.title}
            summary={pdf.summary}
            fileUrl={pdf.fileUrl}
            category={pdf.category}
            pageCount={pdf.pageCount}
          />
        ))}
      </div>

      <SiteFooter />
    </div>
  );
};

export default Home;
