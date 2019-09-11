import React, { Component } from "react";
import Dropdown from "./Dropdown";

const mode = {
  Master: "Master",
  HR: "HR",
  GoofChold: "GoofChold",
  MISTAKE: "MISTAKE",
  Yike: "Yike"
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

    let startMode = mode.Master;
    const type = props.location.pathname.slice(1);
    if (type) {
      startMode = type;
    }

    this.state = {
      mode: startMode
    };

    this.handleChange.bind(this);
  }

  setSelected = option => {
    this.setState({ mode: option });
    console.log()
    this.props.history.push(`/${option}`);
  };

  render() {
    return (
      <div>
        {
          <Dropdown
            options={mode}
            selected={this.state.mode}
            setSelected={this.setSelected}
          />
        }
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
