import React, { Component } from "react";
import { Types } from "../Utilities/Types";

class Dropdown extends Component {
  setSelected = () => {};

  constructor(props) {
    super(props);
    this.setSelected = props.setSelected;
    this.state = {
      selected: props.selected,
      open: false
    };
  }

  handleOpen = () => {
    this.setState({ open: true });
  };

  renderClosed = () => {
    return (
      <div className="title-select-title" onClick={this.handleOpen}>
        {this.state.selected}
      </div>
    );
  };

  render() {
    return (
      <div className="title-select">
        {this.state.open ? this.renderOpen() : this.renderClosed()}
      </div>
    );
  }

  renderOpen = () => {
    const optionButtons = [];
    let handleChoice = () => {
      this.setState({ open: false });
    };
    optionButtons.push(
      <div className="title-select-title" onClick={handleChoice}>
        {this.state.selected}
      </div>
    );

    Object.keys(Types).forEach(option => {
      handleChoice = () => {
        this.setState({
          selected: option,
          open: false
        });
        this.setSelected(option);
      };
      optionButtons.push(
        <div className="title-select-options" onClick={handleChoice}>
          {option}
        </div>
      );
    });
    return optionButtons;
  };
}

export default Dropdown;
