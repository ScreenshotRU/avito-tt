import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "../assets/styles/styles.css";
import RepoComponent from "../components/RepoComponent";

const RepoPage = (props) => {
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
    <RepoComponent
      {...data}
      languages={languages}
      contributors={contributors}
    />
  );
};

RepoPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      owner: PropTypes.string.isRequired,
      repo: PropTypes.string.isRequired,
    }),
  }),
};

export default RepoPage;
