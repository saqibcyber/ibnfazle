import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import NotFound from "./pages/NotFound";

const RedirectHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const search = location.search;
    if (search && search.startsWith("?/")) {
      const path = search
        .slice(2)
        .split("&")[0]
        .replace(/~and~/g, "&");

      navigate("/" + path + location.hash, { replace: true });
    }
  }, [location, navigate]);

  return null;
};

const App = () => (
  <BrowserRouter>
    <RedirectHandler />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/articles" element={<Blog />} />
      <Route path="/articles/:slug" element={<BlogPost />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;
