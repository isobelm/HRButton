import React, { Component } from "react";
import { getDailyCounts, getPress, getTotals } from "../Services/Requests";
import { ResponsiveLine } from "@nivo/line";

class ButtonPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedUser: "",
      totalCount: "Loading..",
      dailyCount: undefined,
      disabled: false,
      graphData: undefined
    };

    this.startButton = React.createRef();
  }

  componentDidMount() {
    console.log("Mount");
  }

  render() {
    return (
      <div>
        {this.renderTabs()}
        {this.state.selectedUser !== "" ? (
          this.renderPage()
        ) : (
          <div className="total">Who was naughty?</div>
        )}
      </div>
    );
  }

  renderPage() {
    return (
      <div>
        {this.renderInfo()}
        {this.renderButton()}
        {(this.state.graphData!==undefined && !this.state.disabled)?this.renderGraph():undefined}
      </div>
    );
  }

  renderGraph() {
    return (
      <div className="graph-parent">
        <div className="chart">
        <ResponsiveLine
          data={this.state.graphData}
          margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
          xScale={{ type: "point" }}
          yScale={{ type: "linear", stacked: true, min: "auto", max: "auto" }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            orient: "bottom",
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Last 14 Days",
            legendOffset: 36,
            legendPosition: "middle"
          }}
          axisLeft={{
            orient: "left",
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "count",
            legendOffset: -40,
            legendPosition: "middle"
          }}
          colors={{ scheme: "nivo" }}
          pointSize={10}
          pointColor={{ theme: "background" }}
          pointBorderWidth={2}
          pointBorderColor={{ from: "serieColor" }}
          pointLabel="y"
          pointLabelYOffset={-12}
          useMesh={true}
          legends={[]}
        />
        </div>
      </div>
    );
  }

  renderInfo() {
    return (
      <div>
        <div className="total">{this.state.totalCount}</div>
        <div className="daily">{this.state.dailyCount}</div>
      </div>
    );
  }

  renderButton() {
    return (
      <div>
        <form onClick={() => this._handlePress()}>
          <input
            className="ghost-input-button"
            type="button"
            value="HR"
            disabled={this.state.disabled}
          />
        </form>
      </div>
    );
  }

  renderTabs() {
    return (
      <div className="App-header">
        <div className="rows">
          <form className="row" onClick={() => this._handleChange("Donal")}>
            <input className="ghost-input-small" type="button" value="Donal" />
          </form>
          <form className="row" onClick={() => this._handleChange("Ebin")}>
            <input className="ghost-input-small" type="button" value="Ebin" />
          </form>
          <form className="row" onClick={() => this._handleChange("Gemma")}>
            <input className="ghost-input-small" type="button" value="Gemma" />
          </form>
          <form className="row" onClick={() => this._handleChange("Isobel")}>
            <input className="ghost-input-small" type="button" value="Isobel" />
          </form>
          <form className="row" onClick={() => this._handleChange("Niall")}>
            <input className="ghost-input-small" type="button" value="Niall" />
          </form>
        </div>
      </div>
    );
  }

  async _handlePress() {
    this.setState({
      disabled: true
    });
    await getPress(this.state.selectedUser);
    const data = await getTotals(this.state.selectedUser);
    const returnedGraphData = await getDailyCounts(this.state.selectedUser);
    const graphData = this.createGraphData(returnedGraphData.data);
    this.setState({
      dailyCount: data.daily,
      totalCount: data.total,
      selectedUser: this.state.selectedUser,
      graphData: graphData,
      disabled: false
    });
  }

  async _handleChange(selectedUser) {
    this.setState({
      selectedUser: selectedUser,
      dailyCount: undefined,
      totalCount: "Loading..",
      disabled: true
    });
    const data = await getTotals(selectedUser);
    const returnedGraphData = await getDailyCounts(selectedUser);
    const graphData = this.createGraphData(returnedGraphData.data);
    this.setState({
      dailyCount: data.daily,
      totalCount: data.total,
      selectedUser: selectedUser,
      graphData: graphData,
      disabled: false
    });
  }

  createGraphData(data) {
    const graphData = [ {
      id: this.state.selectedUser,
      data: new Array(data.length),
    },
    ]

    for(let i = 0; i < data.length; i++){
      graphData[0].data[i] = {
        x: i+1,
        y: data[i]
      };
    }

    return graphData;
  }
}

export default ButtonPage;
