import React, { useState, useEffect } from "react";
import "../styles.css";
import useDebounce from "../helpers/useDebounce";
import Pagination from "./Pagination";
import { Link } from "react-router-dom";

const Api = (props) => {
  const [currentPage, setCurrentPage] = useState(
    parseInt(localStorage.getItem("currentPage"), 10) || 1
  );
  const [data, setData] = useState([]);
  const [mostPopularRepos, setMostPopularRepos] = useState([]);
  const [inputValue, setInputValue] = useState(
    localStorage.getItem("inputValue") || ""
  );
  const handleChange = (e) => {
    setInputValue(e.target.value);
    localStorage.setItem("inputValue", e.target.value);
    localStorage.setItem("currentPage", 1);
    setCurrentPage(1);
  };
  const debouncedSearchTerm = useDebounce(inputValue, 1000);
  const goToPage = (number) => {
    const pageNumber = number + 1;
    localStorage.setItem("currentPage", pageNumber);
    setCurrentPage(pageNumber);
  };
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    if (inputValue.length > 1 && debouncedSearchTerm) {
      setIsLoading(true);
      fetch(
        `https://cors-anywhere.herokuapp.com/https://api.github.com/search/repositories?q=${inputValue}&sort=stars&order=desc&page=${currentPage}&per_page=10`
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

  const result = inputValue.length > 1 ? data : mostPopularRepos;
  const isVisiblePaginaton =
    inputValue.length > 1 && !isLoading && data.length > 0;
  const pagesCount = totalCount / 10;
  const totalPages =
    pagesCount > 1 ? Math.floor(pagesCount) : Math.ceil(pagesCount);

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
      <div className="container">
        <div className="cards">
          {result.map((repo) => (
            <div key={repo.id} className="user-card">
              <Link
                to={`/repos/${repo.owner.login}/${repo.name}`}
                className="avatar-link"
              >
                {repo.owner && repo.owner.avatar_url && (
                  <img src={repo.owner.avatar_url} alt="avatar" />
                )}
              </Link>
              <div className="info">
                <Link
                  to={`/repos/${repo.owner.login}/${repo.name}`}
                  className="login"
                >
                  {repo.name}
                </Link>
                <div className="stars-count">
                  <span>&#9733;</span>
                  {repo.stargazers_count}
                </div>
                <div className="last-commit">
                  {repo.updated_at && repo.updated_at.toString().slice(0, 10)}
                </div>
                <a
                  href={repo.owner.html_url}
                  className="user-link"
                  target="_blank"
                >
                  Github
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isVisiblePaginaton && (
        <Pagination
          currentPage={currentPage}
          pageNeighbours={2}
          totalPages={totalPages > 100 ? 100 : totalPages}
          goToPage={goToPage}
        />
      )}
    </div>
  );
};

export default Api;
