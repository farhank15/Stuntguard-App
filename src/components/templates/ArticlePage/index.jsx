import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const ArticlePage = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);

  useEffect(() => {
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
          const foundArticle = articles.find((res) => res.Id === id);
          setArticle(foundArticle);

          // Shuffle articles except the current one
          const otherArticles = articles.filter((res) => res.Id !== id);
          const shuffledArticles = otherArticles
            .sort(() => 0.5 - Math.random())
            .slice(0, 5);
          setRelatedArticles(shuffledArticles);
        }
      })
      .catch((error) => {
        console.error("Error fetching the article:", error);
      });
  }, [id]);

  const getRandomHealthImage = () => {
    return `https://picsum.photos/800/400?random=${Math.floor(
      Math.random() * 1000
    )}`;
  };

  if (!article) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
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
