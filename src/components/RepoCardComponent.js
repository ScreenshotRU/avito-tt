import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import defaultImage from "../assets/img/avatar.png";

const RepoCardComponent = (props) => (
  <div className="user-card">
    <Link
      to={`/repos/${props.owner.login}/${props.name}`}
      className="avatar-link"
    >
      <img src={props.owner.avatar_url || defaultImage} alt="avatar" />
    </Link>
    <div className="info">
      <Link to={`/repos/${props.owner.login}/${props.name}`} className="login">
        {props.name}
      </Link>
      <div className="stars-count">
        <span>&#9733;</span>
        {props.stargazers_count}
      </div>
      <div className="last-commit">{props.updated_at.slice(0, 10)}</div>
      <a href={props.owner.html_url} className="user-link" target="_blank">
        Github
      </a>
    </div>
  </div>
);

RepoCardComponent.propTypes = {
  owner: PropTypes.shape({
    login: PropTypes.string.isRequired,
    avatar_url: PropTypes.string,
    html_url: PropTypes.string.isRequired,
  }),
  name: PropTypes.string.isRequired,
  stargazers_count: PropTypes.number.isRequired,
  updated_at: PropTypes.string,
};

RepoCardComponent.defaultProps = {
  owner: {},
};

export default RepoCardComponent;
