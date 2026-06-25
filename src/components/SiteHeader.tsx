import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import logoUrl from "@/assets/logo.svg";

interface SiteHeaderProps {
  title?: string;
  subtitle?: ReactNode;
  align?: "left" | "center";
}

const SiteHeader = ({
  title = "Thaqib ibn Fazle",
  subtitle = (
    <>
      <span>A digital library of clear, referenced articles clarifying Islam.</span>
    </>
  ),
  align = "center",
}: SiteHeaderProps) => {
  return (
    <header className={`site-header${align === "left" ? " site-header--left" : ""}`}>
      <div className="logo-row">
        <Link to="/" className="logo-link">
          <img src={logoUrl} alt="Logo" />
        </Link>
      </div>
      <h1>{title}</h1>
      {subtitle && <div className="site-meta">{subtitle}</div>}
      <div className="site-divider" />
    </header>
  );
};

export default SiteHeader;
