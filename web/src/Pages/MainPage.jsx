import React, { Component } from "react";
import Dropdown from "./Dropdown";

const mode = {
  Master: "Master",
  HR: "HR",
  GoofChold: "Goof Chold",
  MISTAKE: "MISTAKE",
  Yike: "Yike"
};

const css = {
  "Master": process.env.PUBLIC_URL + "/Master.css",
  "HR": process.env.PUBLIC_URL + "../HR.css",
  "Goof Chold": process.env.PUBLIC_URL + "../GoofChold.css",
  "MISTAKE": process.env.PUBLIC_URL + "../MISTAKE.css",
  "Yike": process.env.PUBLIC_URL + "../yike.css"
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
      stylePath: css[startMode],
      mode: startMode
    };

    this.handleChange.bind(this);
  }

  setSelected = option => {
    this.setState({ mode: option,
      stylePath: css[option] });
    if (option !== mode.Master) {
      this.props.history.push(`/${option}`);
    } else {
      this.props.history.push("/");
    }
  };

  render() {
    return (
      <div>
        <link rel="stylesheet" type="text/css" href={this.state.stylePath} />
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
