import React, { Component } from "react";
import { getDailyCounts, getPress, getTotals } from "../Services/Requests";
import { ResponsiveLine } from "@nivo/line";
import { ResponsiveBar } from "@nivo/bar";

const Donal = "Donal";
const Ebin = "Ebin";
const Gemma = "Gemma";
const Isobel = "Isobel";
const Niall = "Niall";
const Rory = "Rory";

class ButtonPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedUser: "",
      totalCount: "Loading..",
      dailyCount: undefined,
      disabled: false,
      lineChartData: undefined,
      barChartData: undefined
    };

    this.createHomeCharts();
  }

  render() {
    return (
      <div>
        {this.renderTabs()}
        {this.state.selectedUser !== "" ? (
          this.state.selectedUser !== "everyone" ? (
            this.renderPersonPage()
          ) : (
            this.renderHomePage()
          )
        ) : (
          <div className="total">Loading...</div>
          // <div className="total">Who was naughty?</div>
        )}
      </div>
    );
  }

  renderPersonPage() {
    return (
      <div>
        {this.renderInfo()}
        {this.renderButton()}
        {this.state.lineChartData !== undefined && !this.state.disabled
          ? this.renderGraph()
          : undefined}
        {this.renderHomeButton()}
      </div>
    );
  }

  renderHomePage() {
    return (
      <div>
        <div className="chartTitle">Recent Behaviour</div>
        {this.state.lineChartData !== undefined
          ? this.renderBigGraph()
          : undefined}
        <div className="chartTitle">Total Presses</div>
        {this.state.barChartData !== undefined
          ? this.renderTotalChart()
          : undefined}
      </div>
    );
  }

  renderGraph() {
    return (
      <div className="graph-parent">
        <div className="chart">
          <ResponsiveLine
            data={this.state.lineChartData}
            margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
            xScale={{ type: "point" }}
            yScale={{
              type: "linear",
              stacked: false,
              min: "auto",
              max: "auto"
            }}
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
            data={this.state.lineChartData}
            margin={{ top: 20, right: 50, bottom: 100, left: 60 }}
            xScale={{ type: "point" }}
            yScale={{
              type: "linear",
              stacked: false,
              min: "auto",
              max: "auto"
            }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              orient: "bottom",
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Last 14 Days",
              legendOffset: 35,
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
            legends={[
              {
                anchor: "bottom",
                direction: "row",
                justify: false,
                translateX: 0,
                translateY: 70,
                itemsSpacing: 5,
                itemDirection: "left-to-right",
                itemWidth: 60,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: "circle",
                symbolBorderColor: "rgba(0, 0, 0, .5)",
                effects: []
              }
            ]}
          />
        </div>
      </div>
    );
  }

  renderTotalChart() {
    return (
      <div className="graph-parent">
        <div className="chart">
          <ResponsiveBar
            data={this.state.barChartData}
            keys={[Donal, Ebin, Gemma, Isobel, Niall, Rory]}
            indexBy="person"
            margin={{ top: 20, right: 50, bottom: 100, left: 60 }}
            padding={0.3}
            colors={{ scheme: "nivo" }}
            borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              orient: "bottom",
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "total",
              legendPosition: "middle",
              legendOffset: -40,
            }}
            enableLabel={false}
            animate={true}
            motionStiffness={90}
            motionDamping={15}
            legends={[
              {
                dataFrom: "keys",
                anchor: "bottom",
                direction: "row",
                justify: false,
                translateX: 15,
                translateY: 60,
                itemsSpacing: -10,
                itemDirection: "left-to-right",
                itemWidth: 60,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: "circle",
                symbolBorderColor: "rgba(0, 0, 0, .5)",
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
      </div>
    );
  }

  renderTabs() {
    return (
      <div className="App-header">
        <div className="rows">
          <form className="row" onClick={() => this._handleChange(Donal)}>
            <input
              className="ghost-input-small"
              type="button"
              value={Donal}
              disabled={this.state.selectedUser === Donal}
            />
          </form>
          <form className="row" onClick={() => this._handleChange(Ebin)}>
            <input
              className="ghost-input-small"
              type="button"
              value={Ebin}
              disabled={this.state.selectedUser === Ebin}
            />
          </form>
          <form className="row" onClick={() => this._handleChange(Gemma)}>
            <input
              className="ghost-input-small"
              type="button"
              value={Gemma}
              disabled={this.state.selectedUser === Gemma}
            />
          </form>
          <form className="row" onClick={() => this._handleChange(Isobel)}>
            <input
              className="ghost-input-small"
              type="button"
              value={Isobel}
              disabled={this.state.selectedUser === Isobel}
            />
          </form>
          <form className="row" onClick={() => this._handleChange(Niall)}>
            <input
              className="ghost-input-small"
              type="button"
              value={Niall}
              disabled={this.state.selectedUser === Niall}
            />
          </form>
          <form className="row" onClick={() => this._handleChange(Rory)}>
            <input
              className="ghost-input-small"
              type="button"
              value={Rory}
              disabled={this.state.selectedUser === Rory}
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
    const returnedLineChartData = await getDailyCounts(this.state.selectedUser);
    const lineChartData = this.createLineChartData(
      returnedLineChartData.data,
      this.state.selectedUser
    );
    this.setState({
      dailyCount: data.daily,
      totalCount: data.total,
      selectedUser: this.state.selectedUser,
      lineChartData: lineChartData,
      disabled: false
    });
  }

  async _handleHomePress() {
    this.setState({
      disabled: true
    });
    await this.createHomeCharts(this.state.selectedUser);
  }

  async createHomeCharts() {
    const lineChartDataD = await getDailyCounts(Donal);
    const lineChartDataE = await getDailyCounts(Ebin);
    const lineChartDataG = await getDailyCounts(Gemma);
    const lineChartDataI = await getDailyCounts(Isobel);
    const lineChartDataN = await getDailyCounts(Niall);
    const lineChartDataR = await getDailyCounts(Rory);
    const lineChartData = [
      this.createLineChartData(lineChartDataD.data, Donal)[0],
      this.createLineChartData(lineChartDataE.data, Ebin)[0],
      this.createLineChartData(lineChartDataG.data, Gemma)[0],
      this.createLineChartData(lineChartDataI.data, Isobel)[0],
      this.createLineChartData(lineChartDataN.data, Niall)[0],
      this.createLineChartData(lineChartDataR.data, Rory)[0]
    ];

    const barChartDataD = await getTotals(Donal);
    const barChartDataE = await getTotals(Ebin);
    const barChartDataG = await getTotals(Gemma);
    const barChartDataI = await getTotals(Isobel);
    const barChartDataN = await getTotals(Niall);
    const barChartDataR = await getTotals(Rory);
    const barChartData = [
      this.createBarChartData(barChartDataD.total, Donal),
      this.createBarChartData(barChartDataE.total, Ebin),
      this.createBarChartData(barChartDataG.total, Gemma),
      this.createBarChartData(barChartDataI.total, Isobel),
      this.createBarChartData(barChartDataN.total, Niall),
      this.createBarChartData(barChartDataR.total, Rory)
    ];

    this.setState({
      dailyCount: undefined,
      totalCount: undefined,
      selectedUser: "everyone",
      lineChartData,
      barChartData,
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
    const returnedLineChartData = await getDailyCounts(selectedUser);
    const lineChartData = this.createLineChartData(returnedLineChartData.data);
    this.setState({
      dailyCount: data.daily,
      totalCount: data.total,
      selectedUser: selectedUser,
      lineChartData: lineChartData,
      disabled: false
    });
  }

  createLineChartData(data, selectedUser) {
    const lineChartData = [
      {
        id: selectedUser,
        data: new Array(data.length)
      }
    ];

    for (let i = 0; i < data.length; i++) {
      lineChartData[0].data[i] = {
        x: i + 1,
        y: data[i]
      };
    }

    return lineChartData;
  }

  createBarChartData(data, selectedUser) {
    let chartData = {};
    chartData["person"] = selectedUser;
    chartData[selectedUser] = data;
    return chartData;
  }
}

export default ButtonPage;
