import React from "react";
import "./App.css";
import { Route, BrowserRouter as Router } from "react-router-dom";
import Page from "./Pages/Page";
import Master from "./Pages/Master";
import MainPage from "./Pages/MainPage";

function App() {
  return (
    <Router>
      <Route path="/" component={MainPage} />
      <Route exact path="/" component={Master} />
      <Route exact path="/Master" component={Master} />
      <Route path="/:type" component={Page} />
    </Router>
  );
}

export default App;
