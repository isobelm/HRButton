import React, { Component } from "react";
import { getDailyCounts, getPress, getTotals } from "../Services/Requests";
import { ResponsiveRadar } from "@nivo/radar";
import GraphColours from "../Utilities/GraphColours";
import { Types } from "../Utilities/Types";
import People from "../Utilities/People";

class Master extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedUser: "",
      totalCount: "Loading..",
      dailyCount: undefined,
      disabled: false,
      totalChartData: [],
      dailyChartData: [],
      lineChartData: [],
      dailyLineChartData: undefined,
      weekyLineChartData: undefined,
      daily: false
    };

    this.totalChartData = [];
    this.dailyChartData = [];
    this.lineChartData = [];
    this.types = Object.keys(Types);

    this.createHomeCharts();
  }

  renderHomePage() {
    return (
      <div className="graph-container">
        {this.state.dailyChartData !== undefined && !this.state.disabled
          ? this.renderRadarGraph(this.state.dailyChartData, "Daily")
          : undefined}
        {this.state.totalChartData !== undefined && !this.state.disabled
          ? this.renderRadarGraph(this.state.totalChartData, "Total")
          : undefined}
      </div>
    );
  }

  createHomeCharts() {
    this.createChartData("total");
    this.createChartData("daily");
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

  async createRadarChartData(id, type) {
    const chartData = { id: id };

    for (let i = 0; i < People.length; i++) {
      const data = await getTotals(People[i], id);
      chartData[People[i]] = data[type];
    }

    this[type + "ChartData"].push(this.normalise(chartData));
    if (this.dailyChartData.length >= this.types.length - 1) {
      this.setState({
        dailyChartData: this.dailyChartData,
        selectedUser: "everyone"
        // disabled: false,
      });
    }
    debugger;
    if (this.totalChartData.length >= this.types.length - 1) {
      this.setState({
        totalChartData: this.totalChartData,
        selectedUser: "everyone"
        // disabled: false,
      });
    }
  }

  createChartData = async type => {
    for (let i = 0; i < this.types.length; i++) {
      if (this.types[i] !== "Master") {
        this.createRadarChartData(this.types[i], type);
      }
    }
  };

  normalise = chartData => {
    const normalisedData = {};
    normalisedData["id"] = chartData["id"];

    let total = 0;
    Object.keys(chartData).forEach(key => {
      if (key != "id") {
        total += chartData[key];
      }
    });

    if (total > 0) {
      Object.keys(chartData).forEach(key => {
        if (key != "id") {
          normalisedData[key] = Math.trunc((chartData[key] / total) * 100);
        }
      });
      return normalisedData;
    } else return chartData;
  };

  createLineChartData() {
    for (let i = 0; i < this.types.length; i++) {
      if (this.types[i] !== "Master") {
        this.createLineChartDataByType(
          this.types[i],
          this.state.daily ? "daily" : "weekly",
          this.state.selectedUser
        );
      }
    }
  }

  async createLineChartDataByType(type, data, selectedUser) {
    const lineChartData = [
      {
        id: selectedUser,
        data: new Array(data.length),
        color: GraphColours[type][selectedUser]
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
    const dailyLineChartData = this.createLineChartData(
      returnedLineChartData.dailyData,
      this.state.selectedUser
    );
    const lineChartData = this.state.daily ? dailyLineChartData : weeklyChartData;
    this.setState({
      dailyCount: data.daily,
      totalCount: data.total,
      highScore: data.highscore,
      selectedUser: this.state.selectedUser,
      lineChartData,
      weeklyChartData,
      dailyLineChartData,
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
    const data = await getTotals(selectedUser, this.state.type);
    const returnedLineChartData = await getDailyCounts(
      selectedUser,
      this.state.type
    );
    const weeklyChartData = this.createLineChartData(
      returnedLineChartData.data,
      selectedUser
    );
    const dailyLineChartData = this.createLineChartData(
      returnedLineChartData.dailyData,
      selectedUser
    );
    const lineChartData = this.state.daily ? dailyLineChartData : weeklyChartData;
    this.setState({
      dailyCount: data.daily,
      totalCount: data.total,
      highScore: data.highscore,
      selectedUser: selectedUser,
      lineChartData,
      weeklyChartData,
      dailyLineChartData,
      disabled: false
    });
  }

  async _handleHomePress() {
    debugger;
    this.setState({
      selectedUser: "everyone"
    });
    debugger;
    // await this.createHomeCharts();
  }

  async _handleSwitch() {
    this.setState({
      daily: !this.state.daily,
      lineChartData: !this.state.daily
        ? this.state.dailyLineChartData
        : this.state.weeklyChartData
    });
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

  renderPersonPage() {
    return (
      <div>
        {this.state.lineChartData !== undefined && !this.state.disabled
          ? this.renderGraph()
          : undefined}
        {this.renderSwitchCharts()}
        {this.renderHomeButton()}
      </div>
    );
  }

  renderSwitchCharts() {
    return (
      <div className="switch-container">
        <div className="switch-layout">
          <div className="switch-labels">Weekly</div>
          <label class="switch">
            <input
              checked={this.state.daily}
              type="checkbox"
              onChange={() => this._handleSwitch()}
            />
            <span class="slider"></span>
          </label>
          <div className="switch-labels">Today</div>
        </div>
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

  renderRadarGraph(data, title) {
    return (
      <div className="chart-area">
        <div className="chartTitle">{title}</div>
        <div className="graph-parent">
          <div className="chart">
            <ResponsiveRadar
              data={data}
              keys={People}
              indexBy="id"
              maxValue="auto"
              margin={{
                top: 40,
                right: 40,
                bottom: 60,
                left: 40
              }}
              curve="linearClosed"
              borderWidth={2}
              borderColor={{ from: "color" }}
              gridLevels={5}
              gridShape="circular"
              gridLabelOffset={16}
              enableDots={true}
              dotSize={2}
              dotColor={{ theme: "background" }}
              dotBorderWidth={2}
              dotBorderColor={{ from: "color" }}
              enableDotLabel={false}
              dotLabel="value"
              dotLabelYOffset={-12}
              colors={Object.values(GraphColours["Master"])}
              fillOpacity={0.1}
              blendMode="normal"
              animate={true}
              motionStiffness={90}
              motionDamping={15}
              isInteractive={true}
              legends={[
                {
                  anchor: "bottom",
                  direction: "row",
                  translateX: -30,
                  translateY: -50,
                  itemWidth: 60,
                  itemHeight: 20,
                  itemTextColor: "#999",
                  symbolSize: 10,
                  symbolShape: "circle",
                  effects: [
                    {
                      on: "hover",
                      style: {
                        itemTextColor: "#000"
                      }
                    }
                  ]
                }
              ]}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Master;
