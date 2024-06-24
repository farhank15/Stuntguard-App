import ArticlePage from "@/components/templates/ArticlePage";
import React from "react";
import { Helmet } from "react-helmet-async";

const ArtikelPage = () => {
  return (
    <div>
      <Helmet>
        <title>Stuntguard - Artikel</title>
      </Helmet>
      <ArticlePage />
    </div>
  );
};

export default ArtikelPage;
