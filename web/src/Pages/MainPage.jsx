import React, { Component } from "react";
import Page from './Page';
import Dropdown from './Dropdown';

const mode = {
  Master: "Master",
  HR: "HR",
  GoofChold: "GoofChold",
  Mistake: "Mistake",
  Yike: "yike"
}

const page = {
  "Master": (<div>Master</div>),
  "HR": (<Page/>),
  "GoofChold": (<div>GoofChold</div>),
  "Mistake": (<div>Mistake</div>),
  "yike": (<div>yike</div>)
}

const css = {
  "HR": {
    border:0,
    background: '#f12711', /* fallback for old browsers */
    background: '-webkit-linear-gradient(to right, #f12711, #f5af19)', /* Chrome 10-25, Safari 5.1-6 */
    background: 'linear-gradient(to right, #f12711, #f5af19)', /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  },
  "GoofChold": {
    border:0,
    background: '#27f111', /* fallback for old browsers */
    background: '-webkit-linear-gradient(to right, #27f111, #aff519)', /* Chrome 10-25, Safari 5.1-6 */
    background: 'linear-gradient(to right, #27f111, #aff519)', /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  },
  "Master": {
    border:0,
    background: '#000000', /* fallback for old browsers */
    background: '-webkit-linear-gradient(to right, #f12711, #f5af19)', /* Chrome 10-25, Safari 5.1-6 */
    background: 'linear-gradient(to right, #f12711, #f5af19)', /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  },
  "Mistake": {
    border:0,
    background: '#f12711', /* fallback for old browsers */
    background: '-webkit-linear-gradient(to right, #f12711, #f5af19)', /* Chrome 10-25, Safari 5.1-6 */
    background: 'linear-gradient(to right, #f12711, #f5af19)', /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  },
  "yike": {
    border:0,
    background: '#f12711', /* fallback for old browsers */
    background: '-webkit-linear-gradient(to right, #f12711, #f5af19)', /* Chrome 10-25, Safari 5.1-6 */
    background: 'linear-gradient(to right, #f12711, #f5af19)', /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  }
}

class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: mode.Master
    };

    // this.createHomeCharts();
    this.handleChange.bind(this)
  }

  setSelected = (option) => {
    this.setState({mode: option})
  }

  render() {
    return (
      <div>
        {<Dropdown options={mode} selcted={mode.Master} setSelected={this.setSelected}/>}
        {/* {this.renderDropdown()} */}
        {/* <HRPage/> */}
        {this.renderPage()}
      </div>
    );
  }

  renderPage() {
    return page[this.state.mode]
  }

  renderDropdown() {
    return (
      <div className="title-select"
      style={{width: "100%"}}>
        <select 
        style={css[this.state.mode]}
        value={this.state.mode}
        onChange={this.handleChange}>
          <option value={mode.Master}>{mode.Master}</option>
          <option value={mode.HR}>{mode.HR}</option>
          <option value={mode.Mistake}>{mode.Mistake}</option>
          <option value={mode.GoofChold}>{mode.GoofChold}</option>
        </select>
      </div>
    );
  }

  handleChange = (event) => {
    let {value} = event.target;
    this.setState({
      mode: value,
    });
  }

}

export default MainPage;
