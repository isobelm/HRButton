import React, { Component } from "react";
import { getDailyCounts, getPress, getTotals } from "../Services/Requests";
import { ResponsiveRadar } from '@nivo/radar'
import { ResponsiveBar } from "@nivo/bar";
import GraphColours from "./GraphColours";

class Master extends Component {

    constructor(props) {
        super(props)
        this.state = {
          selectedUser: "",
          totalCount: "Loading..",
          dailyCount: undefined,
          disabled: false,
          totalChartData: [],
          dailyChartData: [],
        };
    
        this.us = ["Donal", "Ebin", "Gemma", "Isobel", "Niall", "Rory"];
        this.totalChartData = []
        this.dailyChartData = []

        this.types = ["MISTAKE", "HR", "Goof Chold", "Yike"];

        this.createChartData("total")
        this.createChartData("daily")
    }

    render() {
        return (
            <div className="graph-container">
                {this.renderRadarGraph(this.state.dailyChartData, "Daily")}
                {this.renderRadarGraph(this.state.totalChartData, "Total")}
            </div>
        )
    }

    async createRadarChartData(id, type) {
        const chartData = { "id": id };
    
        for (let i = 0; i < this.us.length; i++) {
            const data = await getTotals(this.us[i], id)
            chartData[this.us[i]] = data[type]
        }

        this[type + "ChartData"].push(this.normalise(chartData))
        if (this.dailyChartData.length >= 4) {
            this.setState({dailyChartData: this.dailyChartData})
        }
        if(this.totalChartData.length >= 4) {
            this.setState({totalChartData: this.totalChartData})
        }
      }

    createChartData = async (type) => {
        const chartData = [];

        for (let i = 0; i < this.types.length; i++) {
            chartData[i] = await this.createRadarChartData(this.types[i], type)
        }
    }

    normalise = (chartData) => {
        const normalisedData = {}
        normalisedData["id"] = chartData["id"]

        let total = 0
        Object.keys(chartData).forEach(key => {
            if (key != "id") {
                total += chartData[key]
            }
        });

        if (total > 0)
        {
            Object.keys(chartData).forEach(key => {
                if (key != "id") {
                    normalisedData[key] = Math.trunc((chartData[key] / total) * 100)
                }   
            })
            return normalisedData
        }
        else return chartData
    }

    renderRadarGraph(data, title) {
        return (
            <div className="chart-area">
            <div className="chartTitle">{title}</div>
                <div className="graph-parent">
                    <div className="chart">
                    <ResponsiveRadar
                    data={data}
                    keys={this.us}
                    indexBy="id"
                    maxValue="auto"
                    margin={{ top: 40, right: 40, bottom: 60, left: 40 }}
                    curve="linearClosed"
                    borderWidth={2}
                    borderColor={{ from: 'color' }}
                    gridLevels={5}
                    gridShape="circular"
                    gridLabelOffset={16}
                    enableDots={true}
                    dotSize={2}
                    dotColor={{ theme: 'background' }}
                    dotBorderWidth={2}
                    dotBorderColor={{ from: 'color' }}
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
                            anchor: 'bottom',
                            direction: 'row',
                            translateX: -30,
                            translateY: -50,
                            itemWidth: 60,
                            itemHeight: 20,
                            itemTextColor: '#999',
                            symbolSize: 10,
                            symbolShape: 'circle',
                            effects: [
                                {
                                    on: 'hover',
                                    style: {
                                        itemTextColor: '#000'
                                    }
                                }
                            ]
                        }
                    ]}
                />
                </div>
                </div>
        </div>);
      }

}

export default Master