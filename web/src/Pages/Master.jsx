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
          totalChartData: undefined,
          dailyChartData: undefined,
        };
    
        this.us = ["Donal", "Ebin", "Gemma", "Isobel", "Niall", "Rory"];

        this.types = ["MISTAKE", "HR", "Goof Chold", "Yike"];

        this.createHomeCharts()
    }

    render() {
        return (
            <div>
                {this.renderRadarGraph(this.state.dailyChartData, "Daily")}
                {this.renderRadarGraph(this.state.totalChartData, "Total")}
            </div>
        )
    }

    async createRadarChartData(id, type) {
        const totalChartData = { "id": id };
    
        for (let i = 0; i < this.us.length; i++) {
            const data = await getTotals(this.us[i], id)
            totalChartData[this.us[i]] = data[type]
        }
    
        return totalChartData;
      }

      createHomeCharts = async () => {
        const totalChartData = await this.createChartData("total");
        const dailyChartData = await this.createChartData("daily");

        this.createChartData("total")

        this.setState({
            totalChartData: totalChartData,
            dailyChartData: dailyChartData})
    }

    createChartData = async (type) => {
        const chartData = [];

        for (let i = 0; i < this.types.length; i++) {
            chartData[i] = await this.createRadarChartData(this.types[i], type)
        }

        return chartData
    }

    renderRadarGraph(data, title) {
        return (
            <div>
            <div className="chartTitle">{title}</div>
                {(data == null ? null :
                <div className="graph-parent">
                    <div className="chart">
                    <ResponsiveRadar
                    data={data}
                    keys={this.us}
                    indexBy="id"
                    maxValue="auto"
                    margin={{ top: 70, right: 80, bottom: 80, left: 80 }}
                    curve="linearClosed"
                    borderWidth={2}
                    borderColor={{ from: 'color' }}
                    gridLevels={5}
                    gridShape="circular"
                    gridLabelOffset={16}
                    enableDots={true}
                    dotSize={10}
                    dotColor={{ theme: 'background' }}
                    dotBorderWidth={2}
                    dotBorderColor={{ from: 'color' }}
                    enableDotLabel={true}
                    dotLabel="value"
                    dotLabelYOffset={-12}
                    colors={Object.values(GraphColours["Master"])}
                    fillOpacity={0.25}
                    blendMode="multiply"
                    animate={true}
                    motionStiffness={90}
                    motionDamping={15}
                    isInteractive={true}
                    legends={[
                        {
                            anchor: 'bottom',
                            direction: 'row',
                            translateX: -70,
                            translateY: -100,
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
                </div>)}
        </div>);
      }

}

export default Master