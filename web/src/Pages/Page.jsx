import React, { Component } from "react";
import {
  getDailyCounts,
  getPress,
  getTotals,
  getUndo
} from "../Services/Requests";
import { ResponsiveLine } from "@nivo/line";
import { ResponsiveBar } from "@nivo/bar";
import { MapType } from "../Utilities/Types";
import GraphColours from "../Utilities/GraphColours";
import People from "../Utilities/People";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUndo } from "@fortawesome/free-solid-svg-icons";
import { ClipLoader } from "react-spinners";

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
      weeklyChartData: undefined,
      highScoresChartData: undefined,
      totalChartData: undefined,
      daily: false,
      type: MapType(decodeURIComponent(this.props.match.params.type)),
      width: 0,
      height: 0,
      loading: true
    };

    this.createHomeCharts();
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  componentWillReceiveProps(props, state) {
    if (props.match.params.type !== state.type) {
      this.createHomeCharts();
    }
    this.setState({ type: props.match.params.type, loading: true });
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  render() {
    if (this.state.loading) {
      return (
        <div>
          {this.renderTabs()}
          {this.renderLoader()}
        </div>
      );
    }
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

  renderLoader() {
    return (
      <div className="loader-container">
        <ClipLoader
          sizeUnit={"px"}
          size={35}
          color={"#ffffff"}
          loading={this.state.loading}
        />
      </div>
    );
  }

  renderPersonPage() {
    return (
      <div className="graph-container">
        {this.renderInfoCard()}
        {this.state.lineChartData !== undefined && !this.state.disabled
          ? this.renderGraph()
          : undefined}
        {this.renderHomeButton()}
      </div>
    );
  }

  renderInfoCard() {
    return (
      <div className="chart-area">
        {this.renderInfo()}
        {this.renderButtons()}
      </div>
    );
  }

  renderHomePage() {
    return (
      <div className="graph-container">
        {this.state.lineChartData !== undefined
          ? this.renderBigGraph()
          : undefined}
        {this.state.totalChartData !== undefined
          ? this.renderBarChart(this.state.totalChartData, "Total Presses")
          : undefined}
        {this.state.highScoresChartData !== undefined
          ? this.renderBarChart(this.state.highScoresChartData, "Highscores")
          : undefined}
      </div>
    );
  }

  renderGraph() {
    return (
      <div className="chart-area">
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
                legend: this.state.daily ? "Today" : "Last 14 Days",
                legendOffset: 40,
                legendPosition: "middle",
                tickValues:
                  this.state.daily && this.state.width < 600
                    ? [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23]
                    : "linear"
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
              pointSize={2}
              pointColor={{ theme: "background" }}
              pointBorderWidth={2}
              pointBorderColor={{ from: "serieColor" }}
              pointLabel="y"
              pointLabelYOffset={-12}
              useMesh={true}
              legends={[]}
              colors={[GraphColours[this.state.type][this.state.selectedUser]]}
            />
          </div>
        </div>
        {this.renderSwitchCharts()}
      </div>
    );
  }

  renderBigGraph() {
    return (
      <div className="chart-area">
        <div className="chartTitle">Recent Behaviour</div>
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
              colors={Object.values(GraphColours[this.state.type])}
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
              pointSize={2}
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
      </div>
    );
  }

  renderBarChart(chartData, title) {
    return (
      <div className="chart-area">
        <div className="chartTitle">{title}</div>
        <div className="graph-parent">
          <div className="chart">
            <ResponsiveBar
              data={chartData}
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
      </div>
    );
  }

  renderInfo() {
    return (
      <div>
        <div className="count-container">
          <div className="total">{this.state.totalCount}</div>
          <div className="highscore">{this.state.highScore}</div>
        </div>
        <div className="daily">{this.state.dailyCount}</div>
      </div>
    );
  }

  renderButtons() {
    return (
      <div className="button-container">
        <form
          className="button-layout-main"
          onClick={() => this._handlePress()}
        >
          <input
            className="ghost-input-button"
            type="button"
            value={this.state.type}
            disabled={this.state.disabled}
          />
        </form>
        <div className="button-layout-undo">
          <button
            disabled={this.state.disabled}
            className="ghost-input-button"
            onClick={() => this._handleUndo()}
          >
            <FontAwesomeIcon icon={faUndo} size="xs" />
          </button>
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
        <form>
          <div class="radio-group">
            <input
              type="radio"
              id="option-one"
              name="selector"
              checked={!this.state.daily}
              onClick={() => this._handleSwitch()}
            />
            <label for="option-one">Weekly</label>
            <input
              type="radio"
              id="option-two"
              name="selector"
              checked={this.state.daily}
              onClick={() => this._handleSwitch()}
            />
            <label for="option-two">Daily</label>
          </div>
        </form>
      </div>
    );
  }

  async _handlePress() {
    this.setState({
      disabled: true,
      loading: true
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
      disabled: false,
      loading: false
    });
  }

  async _handleUndo() {
    this.setState({
      disabled: true,
      loading: true
    });
    await getUndo(this.state.selectedUser, this.state.type);
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
      disabled: false,
      loading: false
    });
  }

  async _handleHomePress() {
    this.setState({
      disabled: true,
      loading: true
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

    const totalChartData = [];
    const highScoresChartData = [];
    getData = async person => {
      const totalCountData = await getTotals(person, this.state.type);
      totalChartData.push(
        this.createBarChartData(totalCountData.total, person)
      );
      highScoresChartData.push(
        this.createBarChartData(totalCountData.highscore, person)
      );
    };

    for await (const person of People) {
      await getData(person);
    }

    this.setState({
      dailyCount: undefined,
      totalCount: undefined,
      highScore: undefined,
      selectedUser: "everyone",
      lineChartData,
      totalChartData,
      highScoresChartData,
      disabled: false,
      loading: false
    });
  };

  async _handleChange(selectedUser) {
    this.setState({
      selectedUser: selectedUser,
      dailyCount: undefined,
      totalCount: "Loading..",
      disabled: true,
      loading: true
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
      disabled: false,
      loading: false
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
