import React, { Component } from "react";
import { getDailyCounts, getPress, getTotals } from "../Services/Requests";
import { ResponsiveLine } from "@nivo/line";
import { ResponsiveBar } from "@nivo/bar";




class Page extends Component {

    // us = {
    //     Donal: "Donal",
    //     Ebin: "Ebin",
    //     Gemma: "Gemma",
    //     Isobel: "Isobel",
    //     Niall: "Niall",
    //     Rory: "Rory",
    // }

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

    this.us = [
      "Donal",
      "Ebin",
      "Gemma",
      "Isobel",
      "Niall",
      "Rory",
    ]

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
                translateX: 15,
                translateY: 70,
                itemsSpacing: -10,
                itemDirection: "left-to-right",
                itemWidth: 80,
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
            keys={this.us}
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
                itemWidth: 80,
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
    const tabs = []
    this.us.forEach((person) => {
        const tab = (
        <form className="row" onClick={() => this._handleChange(person)}>
            <input
            className="ghost-input-small"
            type="button"
            value={person}
            disabled={this.state.selectedUser === person}
            />
        </form>
        )
        tabs.push(tab)
    })

    return (
      <div className="App-header">
        <div className="rows">
          {tabs}
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

  createHomeCharts = async () => {
    // const lineChart = []
    // const lineChartData = []
    // let i = 0
    // await this.us.forEach(async (person) => {
    //     lineChart[i] = await getDailyCounts(person).data
    //     i++
    // })
    // i = 0
    // await this.us.forEach(async (person) => {
    //     lineChartData.push(this.createLineChartData(lineChart[i].data, person)[0])
    //     i++

    // })

    let getData = async (person) => {
      lineChartData.push(this.createBarChartData(await getDailyCounts(person).data, person)[0])
    }
    const lineChartData = []
    await this.us.forEach((person) => getData(person))

    getData = async (person) => {
      barChartData.push(this.createBarChartData(await getTotals(person).total, person))
    }
    const barChartData = []
    await this.us.forEach((person) => getData(person))

    this.setState({
      dailyCount: undefined,
      totalCount: undefined,
      selectedUser: "everyone",
      lineChartData: lineChartData.data,
      barChartData: barChartData.data,
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

export default Page;