import { useEffect } from "react";
import { Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ArticleCard from "@/components/ArticleCard";
import { getLatestPosts } from "@/data/posts";

const Home = () => {
  const latestPosts = getLatestPosts(3);

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

      <SiteFooter />
    </div>
  );
};

export default Home;
