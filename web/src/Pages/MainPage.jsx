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
  "Master": process.env.PUBLIC_URL + "/GoofChold.css",
  "HR": process.env.PUBLIC_URL + "../Master.css",
  "GoofChold": process.env.PUBLIC_URL + "../GoofChold.css",
  "Mistake": process.env.PUBLIC_URL + "../Master.css",
  "yike": process.env.PUBLIC_URL + "../yike.css"
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
      stylePath: css["Master"],
      mode: startMode
    };

    this.handleChange.bind(this);
  }

  setSelected = option => {
    this.setState({ mode: option });
    if (option !== mode.Master) {
      this.props.history.push(`/${option}`);
    } else {
      this.props.history.push("/");
    }
  };

  render() {
    return (
      <div className="page">
        <link rel="stylesheet" type="text/css" href={this.state.stylePath} />
        <div className="page">
        {  
          <Dropdown
            options={mode}
            selected={this.state.mode}
            setSelected={this.setSelected}
            />
        }
        </div>
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
