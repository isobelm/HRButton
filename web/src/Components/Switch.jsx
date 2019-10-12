import React, { Component } from "react";

class Switch extends Component {
  setSelected = () => {};

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="switch-container">
        <form>
          <div class="radio-group">
            <input
              type="radio"
              id="option-one"
              name="selector"
              checked={!this.props.checked}
              onClick={() => this.props.onSwitch()}
            />
            <label for="option-one">{this.props.option1}</label>
            <input
              type="radio"
              id="option-two"
              name="selector"
              checked={this.props.checked}
              onClick={() => this.props.onSwitch()}
            />
            <label for="option-two">{this.props.option2}</label>
          </div>
        </form>
      </div>
    );
  }
}

export default Switch;
