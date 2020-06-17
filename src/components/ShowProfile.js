import React, { useState, useEffect } from "react";
import "../styles.css";
import { Link } from "react-router-dom";

const ShowProfile = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({});
  const [languages, setLanguages] = useState({});
  const [contributors, setContributors] = useState([]);
  const fetchLanguages = (url) => {
    fetch(url)
      .then((response) => response.json())
      .then((response) => {
        setIsLoading(false);
        setLanguages(response);
      })
      .catch((error) => {
        setIsLoading(false);
        //error description
      });
  };
  const fetchContributors = (url) => {
    fetch(url)
      .then((response) => response.json())
      .then((response) => {
        setIsLoading(false);
        setContributors(response.slice(0, 10));
      })
      .catch((error) => {
        setIsLoading(false);
        //error description
      });
  };

  useEffect(() => {
    setIsLoading(true);
    fetch(
      `https://api.github.com/repos/${props.match.params.owner}/${props.match.params.repo}`
    )
      .then((response) => response.json())
      .then((response) => {
        setIsLoading(false);
        setData(response);
        fetchLanguages(response.languages_url);
        fetchContributors(response.contributors_url);
      })
      .catch((error) => {
        setIsLoading(false);
        //error description
      });
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="github-card" key={data.id}>
      <div className="header">
        <div className="repo-name">{data.name}</div>
      </div>
      <div className="avatar-link">
        {data.owner && data.owner.avatar_url && (
          <img src={data.owner.avatar_url} alt="avatar" />
        )}
      </div>
      <div>
        {data.owner && data.owner.html_url && (
          <a href={data.owner.html_url} className="login">
            {data.owner.login}
          </a>
        )}
      </div>
      <div className="description">{data.description}</div>
      <div className="container">
        <ul>
          <li>
            <div className="stars-count">
              <div className="title">Stars count</div>
              <span>&#9733;</span>
              {data.stargazers_count}
            </div>
          </li>
          <li>
            <div className="title">Last commit</div>
            <div className="last-commit">
              {data.updated_at && data.updated_at.toString().slice(0, 10)}
            </div>
          </li>
          <li>
            <div>
              <div className="title">Languages</div>
              {Object.keys(languages).map((key) => (
                <div key={key}>{key}</div>
              ))}
            </div>
          </li>
          <li>
            <div>
              <div className="title">Active contributors</div>
              {contributors.map((contributor) => (
                <div key={contributor.login}>{contributor.login}</div>
              ))}
            </div>
          </li>
        </ul>
      </div>
      <Link to={`/`} className="user-link">
        back
      </Link>
    </div>
  );
};

export default ShowProfile;
