import React, { Component } from "react";
import { getDailyCounts, getPress, getTotals } from "../Services/Requests";
import { ResponsiveLine } from "@nivo/line";
import { ResponsiveBar } from "@nivo/bar";
import { MapType } from "../Utilities/Types";
import GraphColours from "../Utilities/GraphColours";
import People from "../Utilities/People"

class Page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedUser: "",
      totalCount: "Loading..",
      highScore: undefined,
      dailyCount: undefined,
      disabled: false,
      lineChartData: undefined,
      dailyChartData: undefined,
      weekyChartData: undefined,
      barChartData: undefined,
      daily: false,
      type: MapType(decodeURIComponent(this.props.match.params.type))
    };
    
    this.createHomeCharts();
  }

  componentWillReceiveProps(props, state) {
    if (props.match.params.type !== state.type) {
      this.createHomeCharts();
    }
    this.setState({ type: props.match.params.type });
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
        {this.renderSwitchCharts()}
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
            colors={d => d.color}
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
              legend: this.state.daily ? "Today" : "Last 14 Days",
              legendOffset: 40,
              legendPosition: "middle",
              tickValues: this.state.daily ? [1,3,5,7,9,11,13,15,17,19,21,23] : "linear"
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
            colors={d => d.color}
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
                itemsSpacing: 0,
                itemDirection: "left-to-right",
                itemWidth: 60,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 10,
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
            colors={d => d.color}
            keys={People}
            indexBy="person"
            margin={{ top: 20, right: 50, bottom: 100, left: 60 }}
            padding={0.3}
            borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              orient: "bottom",
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "total",
              legendPosition: "middle",
              legendOffset: -40
            }}
            colors={Object.values(GraphColours[this.state.type])}
            enableLabel={false}
            animate={true}
            motionStiffness={90}
            motionDamping={15}
            legends={[
              {
                anchor: "bottom",
                direction: "row",
                justify: false,
                translateX: 0,
                translateY: 70,
                itemsSpacing: 0,
                itemDirection: "left-to-right",
                itemWidth: 60,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 10,
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
            value={this.state.type}
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
    const tabs = [];
    People.forEach(person => {
      const tab = (
        <form className="row" onClick={() => this._handleChange(person)}>
          <input
            className="ghost-input-small"
            type="button"
            value={person}
            disabled={this.state.selectedUser === person}
          />
        </form>
      );
      tabs.push(tab);
    });

    return (
      <div className="App-header">
        <div className="rows">{tabs}</div>
      </div>
    );
  }

  renderSwitchCharts() {
    return (
      <div className="switch-container">
        <div className="switch-layout">
          <div className="switch-labels">Weekly</div>
          <label class="switch">
            <input checked={this.state.daily} type="checkbox" onChange={() => this._handleSwitch()} />
            <span class="slider"></span>
          </label>
          <div className="switch-labels">Today</div>
        </div>
      </div>
    );
  }

  async _handlePress() {
    this.setState({
      disabled: true
    });
    await getPress(this.state.selectedUser, this.state.type);
    const data = await getTotals(this.state.selectedUser, this.state.type);
    const returnedLineChartData = await getDailyCounts(
      this.state.selectedUser,
      this.state.type
    );
    const weeklyChartData = this.createLineChartData(
      returnedLineChartData.data,
      this.state.selectedUser
    );
    const dailyChartData = this.createLineChartData(
      returnedLineChartData.dailyData,
      this.state.selectedUser
    );
    const lineChartData = this.state.daily ? dailyChartData : weeklyChartData;
    this.setState({
      dailyCount: data.daily,
      totalCount: data.total,
      highScore: data.highscore,
      selectedUser: this.state.selectedUser,
      lineChartData,
      weeklyChartData,
      dailyChartData,
      disabled: false
    });
  }

  async _handleHomePress() {
    this.setState({
      disabled: true
    });
    await this.createHomeCharts();
  }

  async _handleSwitch() {
    this.setState({
      daily: !this.state.daily,
      lineChartData: !this.state.daily
        ? this.state.dailyChartData
        : this.state.weeklyChartData
    });
  }

  createHomeCharts = async () => {
    const lineChartData = [];
    let getData = async person => {
      const dailyCountsData = await getDailyCounts(person, this.state.type);
      lineChartData.push(
        this.createLineChartData(dailyCountsData.data, person)[0]
      );
    };

    for await (const person of People) {
      await getData(person);
    }

    const barChartData = [];
    getData = async person => {
      const totalCountData = await getTotals(person, this.state.type);
      barChartData.push(this.createBarChartData(totalCountData.total, person));
    };

    for await (const person of People) {
      await getData(person);
    }

    this.setState({
      dailyCount: undefined,
      totalCount: undefined,
      highScore: undefined,
      selectedUser: "everyone",
      lineChartData: lineChartData,
      barChartData: barChartData,
      disabled: false
    });
  };

  async _handleChange(selectedUser) {
    this.setState({
      selectedUser: selectedUser,
      dailyCount: undefined,
      totalCount: "Loading..",
      disabled: true
    });
    const data = await getTotals(selectedUser, this.state.type);
    const returnedLineChartData = await getDailyCounts(
      selectedUser,
      this.state.type
    );
    const weeklyChartData = this.createLineChartData(
      returnedLineChartData.data,
      selectedUser
    );
    const dailyChartData = this.createLineChartData(
      returnedLineChartData.dailyData,
      selectedUser
    );
    const lineChartData = this.state.daily ? dailyChartData : weeklyChartData;
    this.setState({
      dailyCount: data.daily,
      totalCount: data.total,
      highScore: data.highscore,
      selectedUser: selectedUser,
      lineChartData,
      weeklyChartData,
      dailyChartData,
      disabled: false
    });
  }

  createLineChartData(data, selectedUser) {
    const lineChartData = [
      {
        id: selectedUser,
        data: new Array(data.length),
        color: GraphColours[this.state.type][selectedUser]
      }
    ];

    for (let i = 0; i < data.length; i++) {
      lineChartData[0].data[i] = {
        x: i,
        y: data[i]
      };
    }

    return lineChartData;
  }

  createBarChartData(data, selectedUser) {
    let chartData = {
      person: selectedUser
    };
    chartData[selectedUser] = data;
    return chartData;
  }
}

export default Page;
