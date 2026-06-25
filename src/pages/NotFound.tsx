import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import SiteFooter from "@/components/SiteFooter";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    document.title = "Page Not Found | Thaqib ibn Fazle";
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="site-wrapper">
      <header className="site-header">
        <h1>404</h1>
        <div className="site-meta">
          <span>Page not found.</span>
        </div>
        <div className="site-divider" />
        <Link to="/" className="back-link">
          Return to home
        </Link>
      </header>
      <SiteFooter />
    </div>
  );
};

export default NotFound;
