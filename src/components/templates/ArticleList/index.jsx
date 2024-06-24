import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ArticleList = () => {
  const [articles, setArticles] = useState([]);
  const [visibleArticles, setVisibleArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const observerRef = useRef(null);

  useEffect(() => {
    axios
      .get("https://health.gov/myhealthfinder/api/v3/topicsearch.json?lang=en")
      .then((response) => {
        if (
          response.data &&
          response.data.Result &&
          response.data.Result.Resources &&
          response.data.Result.Resources.Resource
        ) {
          setArticles(response.data.Result.Resources.Resource);
          setVisibleArticles(
            response.data.Result.Resources.Resource.slice(0, 6)
          );
        }
      })
      .catch((error) => {
        console.error("Error fetching the articles:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredArticles = articles.filter((article) =>
    article.Title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRandomHealthImage = () => {
    return `https://picsum.photos/800/700?random=${Math.floor(
      Math.random() * 1000
    )}`;
  };

  const loadMoreArticles = () => {
    const nextArticles = articles.slice(
      visibleArticles.length,
      visibleArticles.length + 6
    );
    setVisibleArticles((prev) => [...prev, ...nextArticles]);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreArticles();
        }
      },
      { threshold: 1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [visibleArticles, articles]);

  return (
    <div className="container font-poppins pt-32 mx-auto p-6">
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search articles..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? Array.from({ length: 7 }).map((_, index) => (
              <div
                key={index}
                className="card bg-base-100 shadow-md animate-pulse"
              >
                <div className="h-40 bg-gray-300 rounded-t-md"></div>
                <div className="card-body">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded w-5/6 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            ))
          : filteredArticles.slice(0, visibleArticles.length).map((article) => (
              <div key={article.Id} className="card bg-base-100 shadow-md">
                <figure>
                  <img
                    src={getRandomHealthImage()}
                    alt="Health Topic"
                    className="w-full h-40 object-cover rounded-t-md"
                  />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">{article.Title}</h2>
                  <p className="text-gray-700 mb-4">
                    {article.Sections?.section[0]?.Description}
                  </p>
                  <Link
                    to={`/artikel-kesehatan/${article.Id}`}
                    className="text-blue-500 hover:underline"
                  >
                    Read more
                  </Link>
                </div>
              </div>
            ))}
      </div>
      {visibleArticles.length < filteredArticles.length && (
        <div ref={observerRef} className="h-10"></div>
      )}
    </div>
  );
};

export default ArticleList;
