import React, { Component } from "react";
import Page from "./Page";
import Dropdown from "./Dropdown";
import { Route, BrowserRouter as Router } from "react-router-dom";
// import "../Master.css";

const mode = {
  Master: "Master",
  HR: "HR",
  GoofChold: "GoofChold",
  Mistake: "Mistake",
  Yike: "yike"
};

const css = {
  "Master": process.env.PUBLIC_URL + "/GoofChold.css",
  "HR": process.env.PUBLIC_URL + "../Master.css",
  "GoofChold": process.env.PUBLIC_URL + "../GoofChold.css",
  "Mistake": process.env.PUBLIC_URL + "../Master.css",
  "yike": process.env.PUBLIC_URL + "../yike.css"
};

class MainPage extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      mode: mode.Master,
      stylePath: css["Master"]
    };

    this.handleChange.bind(this);
  }

  // componentDidMount() {
  //   this.setState({stylePath: css[this.mode]})
  // }

  setSelected = (option) => {
    // window.open(`/${option}`, '_self');
    window.location.href = "/" + option;
    this.setState({mode: option, stylePath: css[option]})
  };

  render() {
    return (
      <div className="page">
        <link rel="stylesheet" type="text/css" href={this.state.stylePath} />
        <div className="page">
        {  
          <Dropdown
            options={mode}
            selected={mode.Master}
            setSelected={this.setSelected}
            />
        }
        {this.renderPage()}
        </div>
      </div>
    );
  }

  renderPage() {
    return (
      <div>
        <Router>
          <Route exact path="/" component={() => <div/>} />
          <Route path="/:type" component={Page} />
        </Router>
      </div>
    );
  }

  renderDropdown() {
    return (
      <div className="title-select" style={{ width: "100%" }}>
        <select
          style={css[this.state.mode]}
          value={this.state.mode}
          onChange={this.handleChange}
        >
          <option value={mode.Master}>{mode.Master}</option>
          <option value={mode.HR}>{mode.HR}</option>
          <option value={mode.Mistake}>{mode.Mistake}</option>
          <option value={mode.GoofChold}>{mode.GoofChold}</option>
        </select>
      </div>
    );
  }

  handleChange = event => {
    let { value } = event.target;
    this.setState({
      mode: value
    });
  };
}

export default MainPage;
