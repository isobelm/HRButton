import React, { Component } from "react";
import Page from "./Page";
import Dropdown from "./Dropdown";
import { Route, Link, BrowserRouter as Router } from "react-router-dom";
import ButtonPage from "./ButtonPage";

const mode = {
  Master: "Master",
  HR: "HR",
  GoofChold: "GoofChold",
  Mistake: "MISTAKE",
  Yike: "yike"
};

const css = {
  HR: {
    border: 0,
    background: "#f12711" /* fallback for old browsers */,
    background:
      "-webkit-linear-gradient(to right, #f12711, #f5af19)" /* Chrome 10-25, Safari 5.1-6 */,
    background:
      "linear-gradient(to right, #f12711, #f5af19)" /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  },
  GoofChold: {
    border: 0,
    background: "#27f111" /* fallback for old browsers */,
    background:
      "-webkit-linear-gradient(to right, #27f111, #aff519)" /* Chrome 10-25, Safari 5.1-6 */,
    background:
      "linear-gradient(to right, #27f111, #aff519)" /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  },
  Master: {
    border: 0,
    background: "#000000" /* fallback for old browsers */,
    background:
      "-webkit-linear-gradient(to right, #f12711, #f5af19)" /* Chrome 10-25, Safari 5.1-6 */,
    background:
      "linear-gradient(to right, #f12711, #f5af19)" /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  },
  Mistake: {
    border: 0,
    background: "#f12711" /* fallback for old browsers */,
    background:
      "-webkit-linear-gradient(to right, #f12711, #f5af19)" /* Chrome 10-25, Safari 5.1-6 */,
    background:
      "linear-gradient(to right, #f12711, #f5af19)" /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  },
  Yike: {
    border: 0,
    background: "#f12711" /* fallback for old browsers */,
    background:
      "-webkit-linear-gradient(to right, #f12711, #f5af19)" /* Chrome 10-25, Safari 5.1-6 */,
    background:
      "linear-gradient(to right, #f12711, #f5af19)" /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  }
};

class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: mode.Master
    };

    this.handleChange.bind(this);
  }

  setSelected = option => {
    window.open(`/${option}`, '_self');
    this.setState({mode: option});
  };

  render() {
    return (
      <div>
        {
          <Dropdown
            options={mode}
            selected={mode}
            setSelected={this.setSelected}
          />
        }
        {this.renderPage()}
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
