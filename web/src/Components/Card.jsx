import React, { Component } from "react";

class Card extends Component {
  setSelected = () => {};

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="card-container">
        <img
          className="card"
          src={"cards/" + this.props.name.toLowerCase() + ".png"}
          alt="Card"
          style={{ width: "90%" }}
        />
        <div class="bottom-right">
          <div className="card-titles">
            <div>HR</div>
            <div>Goof Chold</div>
            <div>Yike</div>
            <div>Dumb</div>
            <div>MISTAKE</div>
          </div>
          <div className="card-values">
            <div>{this.props.hr}</div>
            <div>{this.props.goof}</div>
            <div>{this.props.yike}</div>
            <div>{this.props.dumb}</div>
            <div>{this.props.mistake}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default Card;
