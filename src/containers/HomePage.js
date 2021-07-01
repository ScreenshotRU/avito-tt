import React, { useState, useEffect } from "react";
import useDebounce from "../helpers/useDebounce";
import Pagination from "../components/Pagination";
import RepoCardComponent from "../components/RepoCardComponent";
import "../assets/styles/styles.css";

const ELEMENTS_PER_PAGE = 10;
const MAX_PAGES = 100;

const HomePage = (props) => {
  const defaultCurrentPage =
    parseInt(localStorage.getItem("currentPage"), 10) || 1;
  const defaultInputValue = localStorage.getItem("inputValue") || "";
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(defaultCurrentPage);
  const [data, setData] = useState([]);
  const [mostPopularRepos, setMostPopularRepos] = useState([]);
  const [inputValue, setInputValue] = useState(defaultInputValue);
  const debouncedSearchTerm = useDebounce(inputValue, 1000);
  const [totalCount, setTotalCount] = useState(0);
  const handleChange = (e) => {
    setInputValue(e.target.value);
    localStorage.setItem("inputValue", e.target.value);
    localStorage.setItem("currentPage", 1);
    setCurrentPage(1);
  };
  const result = inputValue.length > 1 ? data : mostPopularRepos;
  const isVisiblePaginaton =
    inputValue.length > 1 && !isLoading && data.length > 0;

  const pagesCount = totalCount / ELEMENTS_PER_PAGE;
  const totalPages = pagesCount > MAX_PAGES ? MAX_PAGES : Math.ceil(pagesCount);
  const goToPage = (number) => {
    const pageNumber = number + 1;
    localStorage.setItem("currentPage", pageNumber);
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    if (inputValue.length > 1 && debouncedSearchTerm) {
      setIsLoading(true);
      fetch(
        `https://api.github.com/search/repositories?q=${inputValue}&sort=stars&order=desc&page=${currentPage}&per_page=10`
      )
        .then((response) => response.json())
        .then((response) => {
          setIsLoading(false);
          setData(response.items);
          setTotalCount(response.total_count);
        })
        .catch((error) => {
          setIsLoading(false);
          //error description
        });
    }
  }, [debouncedSearchTerm, currentPage]);

  useEffect(() => {
    setIsLoading(true);
    fetch(
      "https://cors-anywhere.herokuapp.com/https://api.github.com/search/repositories?q=stars:>10000&sort=stars&order=desc&per_page=10"
    )
      .then((response) => response.json())
      .then((response) => {
        setIsLoading(false);
        setMostPopularRepos(response.items);
      })
      .catch((error) => {
        setIsLoading(false);
        //error description
      });
  }, []);

  return (
    <div className="main-area">
      <div className="top-stripe">
        <input
          type="text"
          placeholder="Github repository"
          onChange={handleChange}
          value={inputValue}
          autoComplete="off"
        />
      </div>
      {isLoading && <div>Loading...</div>}
      <div className="container">
        <div className="cards">
          {result.map((repo) => (
            <RepoCardComponent {...repo} key={repo.id} />
          ))}
        </div>
      </div>
      {isVisiblePaginaton && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          goToPage={goToPage}
        />
      )}
    </div>
  );
};

export default HomePage;
