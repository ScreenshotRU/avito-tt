import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const RepoComponent = (props) => (
  <div className="github-card" key={props.id}>
    <div className="header">
      <div className="repo-name">{props.name}</div>
    </div>
    <div className="avatar-link">
      {props.owner && props.owner.avatar_url && (
        <img src={props.owner.avatar_url} alt="avatar" />
      )}
    </div>
    <div>
      {props.owner && props.owner.html_url && (
        <a href={props.owner.html_url} className="login">
          {props.owner.login}
        </a>
      )}
    </div>
    <div className="description">{props.description}</div>
    <div className="container">
      <ul>
        <li>
          <div className="stars-count">
            <div className="title">Stars count</div>
            <span>&#9733;</span>
            {props.stargazers_count}
          </div>
        </li>
        <li>
          <div className="title">Last commit</div>
          <div className="last-commit">
            {props.updated_at && props.updated_at.slice(0, 10)}
          </div>
        </li>
        <li>
          <div>
            <div className="title">Languages</div>
            {Object.keys(props.languages).map((key) => (
              <div key={key}>{key}</div>
            ))}
          </div>
        </li>
        <li>
          <div>
            <div className="title">Active contributors</div>
            {props.contributors.map((contributor) => (
              <div key={contributor.login}>{contributor.login}</div>
            ))}
          </div>
        </li>
      </ul>
    </div>
    <Link to={`/avito_tt`} className="user-link">
      Back
    </Link>
  </div>
);

RepoComponent.propTypes = {
  id: PropTypes.number,
  name: PropTypes.string,
  description: PropTypes.string,
  stargazers_count: PropTypes.number,
  updated_at: PropTypes.string,
  owner: PropTypes.shape({
    login: PropTypes.string.isRequired,
    avatar_url: PropTypes.string,
    html_url: PropTypes.string.isRequired,
  }),
};

RepoComponent.defaultProps = {
  languages: {},
  contributors: [],
};

export default RepoComponent;
