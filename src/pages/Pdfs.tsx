import { useEffect, useMemo, useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SearchBar from "@/components/SearchBar";
import PdfCard from "@/components/PdfCard";
import { pdfs } from "@/data/pdfs";

const Pdfs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const allCategories = useMemo(() => {
    const categories = new Set<string>();
    pdfs.forEach((pdf) => {
      if (pdf.category) {
        categories.add(pdf.category);
      }
    });
    return Array.from(categories).sort();
  }, []);

  const filteredPdfs = useMemo(() => {
    return pdfs
      .filter((pdf) => {
        const matchesSearch =
          searchQuery === "" ||
          pdf.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          pdf.summary.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory =
          selectedCategory === null || pdf.category === selectedCategory;

        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [searchQuery, selectedCategory]);

  const toggleCategory = (category: string) => {
    setSelectedCategory((prev) => (prev === category ? null : category));
  };

  useEffect(() => {
    document.title = "PDFs | Thaqib ibn Fazle";
  }, []);

  return (
    <div className="site-wrapper">
      <SiteHeader align="left" />

      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search PDFs…"
      />

      <div className="section-label">
        <h2>PDFs</h2>
        <span>{pdfs.length} PDFs</span>
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
        {filteredPdfs.length === 0 ? (
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>No PDFs found.</p>
        ) : (
          filteredPdfs.map((pdf) => (
            <PdfCard
              key={pdf.slug}
              title={pdf.title}
              summary={pdf.summary}
              fileUrl={pdf.fileUrl}
              category={pdf.category}
              pageCount={pdf.pageCount}
            />
          ))
        )}
      </div>

      <SiteFooter />
    </div>
  );
};

export default Pdfs;
