import React, { Component } from "react";

class Dropdown extends React.Component {
  options = [
    "Master",
    "HR",
    "GoofChold",
    "Mistake",
    "yike"
  ]

  setSelected = () => {}

  constructor(props) {
    super(props);
    this.setSelected = props.setSelected
    this.state = {
      selected: "Master",
      open: false
    };
  }

  handleOpen = () => {
    this.setState({open: true})
  }

  renderClosed = () => {
    return (<div className="title-select" onClick={this.handleOpen}>{this.state.selected}</div>)
  }

  render() {
    return (
      <div>
      {this.state.open ? 
      this.renderOpen() : 
      this.renderClosed()}
      </div>
    );
  }

  renderOpen = () => {
    const optionButtons = []
    let handleChoice = () => {
      this.setState({open: false})
    }
    optionButtons.push(<div className="title-select" onClick={handleChoice}>{this.state.selected}</div>)

    this.options.forEach(option => {
      handleChoice = () => {
        this.setState({
          selected: option,
          open: false,
        })
        this.setSelected(option)
      }
      optionButtons.push(<div className="title-select" onClick={handleChoice}>{option}</div>)

    });
    return (optionButtons)
  }
}

export default Dropdown;
