import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ShowProfile from "./containers/RepoPage";
import HomePage from "./containers/HomePage";
import "../src/assets/styles/styles.css";

export default function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <HomePage />
        </Route>
        <Route path="/repos/:owner/:repo" component={ShowProfile} />
      </Switch>
    </Router>
  );
}
