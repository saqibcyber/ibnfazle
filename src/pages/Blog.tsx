import { useEffect, useMemo, useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SearchBar from "@/components/SearchBar";
import ArticleCard from "@/components/ArticleCard";
import { posts } from "@/data/posts";

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const allCategories = useMemo(() => {
    const categories = new Set<string>();
    posts.forEach((post) => {
      if (post.category) {
        categories.add(post.category);
      }
    });
    return Array.from(categories).sort();
  }, []);

  const filteredPosts = useMemo(() => {
    return posts
      .filter((post) => {
        const matchesSearch =
          searchQuery === "" ||
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.summary.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory =
          selectedCategory === null || post.category === selectedCategory;

        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [searchQuery, selectedCategory]);

  const toggleCategory = (category: string) => {
    setSelectedCategory((prev) => (prev === category ? null : category));
  };

  useEffect(() => {
    document.title = "Articles | Thaqib ibn Fazle";
  }, []);

  return (
    <div className="site-wrapper">
      <SiteHeader align="left" />

      <SearchBar value={searchQuery} onChange={setSearchQuery} />

      <div className="section-label">
        <h2>Articles</h2>
        <span>{posts.length} articles</span>
      </div>

      {allCategories.length > 0 && (
        <div className="category-filters">
          {allCategories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => toggleCategory(category)}
              className={`category-filter-btn${selectedCategory === category ? " active" : ""}`}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      <div className="article-list">
        {filteredPosts.length === 0 ? (
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>No articles found.</p>
        ) : (
          filteredPosts.map((post) => (
            <ArticleCard
              key={post.slug}
              slug={post.slug}
              title={post.title}
              summary={post.summary}
              category={post.category}
              content={post.content}
            />
          ))
        )}
      </div>

      <SiteFooter />
    </div>
  );
};

export default Blog;
