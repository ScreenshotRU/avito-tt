import React from "react";
import Api from "./components/Api";
import "./styles.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ShowProfile from "./components/ShowProfile";

export default function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Api />
        </Route>
        <Route path="/repos/:owner/:repo" component={ShowProfile} />
      </Switch>
    </Router>
  );
}
