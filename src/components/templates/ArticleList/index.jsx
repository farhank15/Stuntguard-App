import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ArticleList = () => {
  const [articles, setArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

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
        }
      })
      .catch((error) => {
        console.error("Error fetching the articles:", error);
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
        {filteredArticles.map((article) => (
          <div
            key={article.Id}
            className="p-6 border rounded-md shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            <img
              src={getRandomHealthImage()}
              alt="Health Topic"
              className="w-full h-40 object-cover rounded-md mb-4"
            />
            <h2 className="text-lg font-semibold mb-2">{article.Title}</h2>
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
        ))}
      </div>
    </div>
  );
};

export default ArticleList;
