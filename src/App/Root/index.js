// External Imports
import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

// Internal Imports
import Landing from "../Pages/Landing";
import Stats from "../Pages/Stats";
import Insights from "../Pages/Insights";
import Contact from "../Pages/Contact";

const Root = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Landing} />
        <Route exact path="/stats" component={Stats} />
        <Route exact path="/insights" component={Insights} />
        <Route exact path="/contact" component={Contact} />
      </Switch>
    </BrowserRouter>
  );
};

export default Root;
