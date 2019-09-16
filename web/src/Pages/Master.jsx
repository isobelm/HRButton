import React, { Component } from "react";
import { getDailyCounts, getPress, getTotals } from "../Services/Requests";
import { ResponsiveRadar } from "@nivo/radar";
import { ResponsiveLine } from "@nivo/line";
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
			daily: false,
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
				selectedUser: "everyone",
			});
		}
		if (this.totalChartData.length >= this.types.length - 1) {
			this.setState({
				totalChartData: this.totalChartData,
				selectedUser: "everyone",
			});
		}
	}

	createChartData = async (type) => {
		for (let i = 0; i < this.types.length; i++) {
			if (this.types[i] !== "Master") {
				this.createRadarChartData(this.types[i], type);
			}
		}
	};

	normalise = (chartData) => {
		const normalisedData = {};
		normalisedData["id"] = chartData["id"];

		let total = 0;
		Object.keys(chartData).forEach((key) => {
			if (key != "id") {
				total += chartData[key];
			}
		});

		if (total > 0) {
			Object.keys(chartData).forEach((key) => {
				if (key != "id") {
					normalisedData[key] = Math.trunc(
						(chartData[key] / total) * 100
					);
				}
			});
			return normalisedData;
		} else return chartData;
	};

	createLineChartData(data) {
		const returnData = [];
		for (let i = 0; i < this.types.length; i++) {
			if (this.types[i] !== "Master") {
				returnData.push(
					this.createLineChartDataByType(
						this.types[i],
						data[this.types[i]],
						this.state.selectedUser
					)
				);
			}
		}

		return returnData;
	}

	createLineChartDataByType(type, data, selectedUser) {
		const lineChartData = {
			id: type,
			data: new Array(data.length),
			color: GraphColours[type][selectedUser],
		};
		for (let i = 0; i < data.length; i++) {
			lineChartData.data[i] = {
				x: i,
				y: data[i],
			};
		}

		return lineChartData;
	}

	async _handleChange(selectedUser) {
		this.setState({
			selectedUser: selectedUser,
			dailyCount: undefined,
			totalCount: "Loading..",
			disabled: true,
		});
		const returnedLineChartData = [];
		const dailyData = {};
		const weeklyData = {};

		for (const type of this.types) {
			const tmpData = await getDailyCounts(this.state.selectedUser, type);
			tmpData.data.id = type;
			tmpData.dailyData.id = type;
			returnedLineChartData.push(tmpData);
			dailyData[type] = tmpData.dailyData;
			weeklyData[type] = tmpData.data;
		}

		const weeklyChartData = this.createLineChartData(weeklyData);
		const dailyLineChartData = this.createLineChartData(dailyData);

		const lineChartData = this.state.daily
			? dailyLineChartData
			: weeklyChartData;
		this.setState({
			selectedUser: selectedUser,
			lineChartData,
			weeklyChartData,
			dailyLineChartData,
			disabled: false,
		});
	}

	async _handleHomePress() {
		this.setState({
			selectedUser: "everyone",
		});
	}

	async _handleSwitch() {
		this.setState({
			daily: !this.state.daily,
			lineChartData: !this.state.daily
				? this.state.dailyLineChartData
				: this.state.weeklyChartData,
		});
	}

	renderTabs() {
		const tabs = [];
		People.forEach((person) => {
			const tab = (
				<form
					className="row"
					onClick={() => this._handleChange(person)}
				>
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
				<div className="chart-area">
					{this.state.lineChartData !== undefined &&
					!this.state.disabled
						? this.renderGraph()
						: undefined}
				</div>
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

	renderGraph() {
		return (
			<div className="graph-parent">
				<div className="chart">
					<ResponsiveLine
						data={this.state.lineChartData}
						colors={(d) => d.color}
						margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
						xScale={{ type: "point" }}
						yScale={{
							type: "linear",
							stacked: false,
							min: "auto",
							max: "auto",
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
									? [
											1,
											3,
											5,
											7,
											9,
											11,
											13,
											15,
											17,
											19,
											21,
											23,
									  ]
									: "linear",
						}}
						axisLeft={{
							orient: "left",
							tickSize: 5,
							tickPadding: 5,
							tickRotation: 0,
							legend: "count",
							legendOffset: -40,
							legendPosition: "middle",
						}}
						pointSize={2}
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
								left: 40,
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
												itemTextColor: "#000",
											},
										},
									],
								},
							]}
						/>
					</div>
				</div>
			</div>
		);
	}
}

export default Master;
