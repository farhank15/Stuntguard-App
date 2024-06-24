import ArticleList from "@/components/templates/ArticleList";
import React from "react";
import { Helmet } from "react-helmet-async";

const ArtikelKesehatan = () => {
  return (
    <div>
      <Helmet>
        <title>Stuntguard - Artikel Kesehatan</title>
      </Helmet>
      <ArticleList />
    </div>
  );
};

export default ArtikelKesehatan;
