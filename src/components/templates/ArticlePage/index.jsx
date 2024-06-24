import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

const ArticlePage = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchArticle(id);
  }, [id]);

  const fetchArticle = (articleId) => {
    setLoading(true);

    axios
      .get(`https://health.gov/myhealthfinder/api/v3/topicsearch.json?lang=en`)
      .then((response) => {
        if (
          response.data &&
          response.data.Result &&
          response.data.Result.Resources &&
          response.data.Result.Resources.Resource
        ) {
          const articles = response.data.Result.Resources.Resource;
          const foundArticle = articles.find((res) => res.Id === articleId);
          setArticle(foundArticle);

          // Shuffle articles except the current one
          const otherArticles = articles.filter((res) => res.Id !== articleId);
          const shuffledArticles = otherArticles
            .sort(() => 0.5 - Math.random())
            .slice(0, 5);
          setRelatedArticles(shuffledArticles);
        }
      })
      .catch((error) => {
        console.error("Error fetching the article:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getRandomHealthImage = () => {
    return `https://picsum.photos/800/400?random=${Math.floor(
      Math.random() * 1000
    )}`;
  };

  if (loading) {
    return (
      <div className="container mx-auto pt-32 p-6 flex flex-col lg:flex-row">
        <div className="article-content lg:w-3/4 pr-6">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-300 rounded w-3/4 mb-4"></div>
            <div className="h-64 bg-gray-300 rounded mb-4"></div>
            <div className="h-6 bg-gray-300 rounded w-full mb-2"></div>
            <div className="h-6 bg-gray-300 rounded w-5/6 mb-2"></div>
            <div className="h-6 bg-gray-300 rounded w-4/5 mb-2"></div>
          </div>
        </div>
        <div className="related-articles lg:w-1/4 mt-8 lg:mt-0">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="h-6 bg-gray-300 rounded w-full mb-2"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto pt-32 p-6 flex flex-col lg:flex-row">
      <div className="article-content lg:w-3/4 pr-6">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6">
          {article.Title}
        </h1>
        <img
          src={getRandomHealthImage()}
          alt="Health Topic"
          className="w-full h-64 object-cover rounded-md mb-4"
        />
        {article.Sections?.section.map((section, index) => (
          <div key={index} className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {section.Title}
            </h2>
            <p className="text-gray-600 mb-4">{section.Description}</p>
            <div
              className="prose lg:prose-xl text-gray-700"
              dangerouslySetInnerHTML={{ __html: section.Content }}
            />
          </div>
        ))}
      </div>
      <div className="related-articles lg:w-1/4 mt-8 lg:mt-0">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          Artikel Terkait
        </h3>
        <ul className="space-y-4">
          {relatedArticles.map((relatedArticle) => (
            <li key={relatedArticle.Id} className="border-b pb-2">
              <Link
                to={`/artikel-kesehatan/${relatedArticle.Id}`}
                className="text-blue-500 hover:underline"
                onClick={() => {
                  setLoading(true); // Show skeleton loading
                  navigate(`/artikel-kesehatan/${relatedArticle.Id}`);
                }}
              >
                {relatedArticle.Title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ArticlePage;
