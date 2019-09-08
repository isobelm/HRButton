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

    this.createDefaultGraph()
    this.startButton = React.createRef();
  }

  render() {
    return (
      <div>
        {this.renderTabs()}
        {this.state.selectedUser !== "" ? (
          this.state.selectedUser !== "everyone" ? (
            this.renderPage()
          ) : (
            this.renderBigGraph()
          )
        ) : (
          
        <div className="total">Loading...</div> 
          // <div className="total">Who was naughty?</div>
        )}
      </div>
    );
  }

  renderPage() {
    return (
      <div>
        {this.renderInfo()}
        {this.renderButton()}
        {this.state.graphData !== undefined && !this.state.disabled
          ? this.renderGraph()
          : undefined}
          {this.renderHomeButton()}
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
            yScale={{ type: "linear", stacked: false, min: "auto", max: "auto" }}
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

  renderBigGraph() {
    return (
      <div className="graph-parent">
        <div className="chart">
          <ResponsiveLine
            data={this.state.graphData}
            margin={{ top: 50, right: 50, bottom: 60, left: 50 }}
            xScale={{ type: "point" }}
            yScale={{ type: "linear", stacked: false, min: "auto", max: "auto" }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              orient: "bottom",
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Last 14 Days",
              legendOffset: -40,
              legendPosition: "middle"
            }}
            axisLeft={{
              orient: "left",
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "count",
              legendOffset: 40,
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
            legends={[
              {
                  anchor: 'bottom',
                  direction: 'row',
                  justify: false,
                  translateX: 15,
                  translateY: 50,
                  itemsSpacing: -10,
                  itemDirection: 'left-to-right',
                  itemWidth: 80,
                  itemHeight: 20,
                  itemOpacity: 0.75,
                  symbolSize: 12,
                  symbolShape: 'circle',
                  symbolBorderColor: 'rgba(0, 0, 0, .5)',
                  effects: []
              }
            ]}
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

  renderHomeButton() {
    return (
    <div>
      <form onClick={() => this._handleHomePress()}>
        <input
          className="home-button"
          type="button"
          value="Home"
          disabled={this.state.disabled}
        />
    </form>
  </div>)
  }

  renderTabs() {
    return (
      <div className="App-header">
        <div className="rows">
          <form className="row" onClick={() => this._handleChange("Donal")}>
            <input
              className="ghost-input-small"
              type="button"
              value="Donal"
              disabled={this.state.selectedUser === "Donal"}
            />
          </form>
          <form className="row" onClick={() => this._handleChange("Ebin")}>
            <input
              className="ghost-input-small"
              type="button"
              value="Ebin"
              disabled={this.state.selectedUser === "Ebin"}
            />
          </form>
          <form className="row" onClick={() => this._handleChange("Gemma")}>
            <input
              className="ghost-input-small"
              type="button"
              value="Gemma"
              disabled={this.state.selectedUser === "Gemma"}
            />
          </form>
          <form className="row" onClick={() => this._handleChange("Isobel")}>
            <input
              className="ghost-input-small"
              type="button"
              value="Isobel"
              disabled={this.state.selectedUser === "Isobel"}
            />
          </form>
          <form className="row" onClick={() => this._handleChange("Niall")}>
            <input
              className="ghost-input-small"
              type="button"
              value="Niall"
              disabled={this.state.selectedUser === "Niall"}
            />
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
    const graphData = this.createGraphData(returnedGraphData.data, this.state.selectedUser);
    this.setState({
      dailyCount: data.daily,
      totalCount: data.total,
      selectedUser: this.state.selectedUser,
      graphData: graphData,
      disabled: false
    });
  }

  async _handleHomePress() {
    this.setState({
      disabled: true
    });
    await this.createDefaultGraph(this.state.selectedUser);
  }

  async createDefaultGraph() {
    const d = "Donal"
    const e = "Ebin"
    const g = "Gemma"
    const i = "Isobel"
    const n = "Niall"
    const graphDataD = await getDailyCounts(d)
    const graphDataE = await getDailyCounts(e)
    const graphDataG = await getDailyCounts(g)
    const graphDataI = await getDailyCounts(i)
    const graphDataN = await getDailyCounts(n)
    const data = [
      this.createGraphData(graphDataD.data, d)[0],
      this.createGraphData(graphDataE.data, e)[0],
      this.createGraphData(graphDataG.data, g)[0],
      this.createGraphData(graphDataI.data, i)[0],
      this.createGraphData(graphDataN.data, n)[0],
    ]
    this.setState({
      dailyCount: undefined,
      totalCount: undefined,
      selectedUser: "everyone",
      graphData: data,
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

  createGraphData(data, selectedUser) {
    const graphData = [
      {
        id: selectedUser,
        data: new Array(data.length)
      }
    ];

    for (let i = 0; i < data.length; i++) {
      graphData[0].data[i] = {
        x: i + 1,
        y: data[i]
      };
    }

    return graphData;
  }
}

export default ButtonPage;
