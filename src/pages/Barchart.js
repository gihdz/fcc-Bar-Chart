import React from 'react'
import * as d3 from 'd3'
import accounting from 'accounting-js'
export default class extends React.Component{
    render(){
        return (<div id="svg-container" className="main-container">
            <div id="tooltip">
            </div>
            <div id="title" className="title">
                United States <em>Gross Domestic Product</em>
            </div>
        </div>);
    }
    componentDidMount(){        
        document.body.style.backgroundColor = "#708090"; 
        fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json").then(d => d.json()).then(d => this.displayData(d)).catch(reason => console.log(reason));
    }
    displayData(GDP){
        const getTooltipHtml = (d) =>{
            const sT = d[0].split("-");
            const getQuarter = function(month){
                switch(month){
                    case "01":
                    return "1";
                    case "04":
                    return "2";
                    case "07":
                    return "3";
                    case "10":
                    return "4";
                    default:
                    return "";
                }
            }
            return `${sT[0]} Q${getQuarter(sT[1])} <br/>${accounting.formatMoney(d[1])} Billion`;
        }
        console.log(GDP);
        const w = 900;
        const h = 460;
        const padding = 40;
        
        const svg = d3.select("#svg-container")
        .append("svg")
        .attr("width", w).attr("height", h);

        const xScaleDomain = [0, GDP.data.length];
        const xScaleRange = [padding, w - padding];
        const xScale = d3.scaleLinear().domain(xScaleDomain).range(xScaleRange);

        const xMaxValue = d3.max(GDP.data, d =>{
            const split = d[0].split("-");
            return parseInt(split[0]);
        });
        const xMinValue = d3.min(GDP.data, d =>{
            const split = d[0].split("-");
            return parseInt(split[0]);
        });
        const xScaleForAxis = d3.scaleLinear().domain([xMinValue, xMaxValue]).range(xScaleRange);


        // var xScale = d3.scaleLinear()
        //                  .domain([0, d3.max(dataset, (d) => d[0])])
        //                  .range([padding, w - padding]);
        
        const yScaleDomain = [0, d3.max(GDP.data, d => d[1])];
        const yScaleRange = [0, h - padding * 2];
        const yScale = d3.scaleLinear().domain(yScaleDomain).range(yScaleRange);
        
        // const yScale = d3.scaleLinear()
        // .domain([0, d3.max(dataset, d => d[1]) ])
        // .range([h - padding, padding]);


        const yScaleForAxis = d3.scaleLinear().domain(yScaleDomain).range([h - padding, padding]);

        //coords for tooltip
        svg.on("mousemove", () => {
            d3.select("#tooltip")
            .style("top", `${d3.event.y - 10}px`)
            .style("left", `${d3.event.x + 20}px`);
        });
        //appending rects    
        svg.selectAll("rect")
        .data(GDP.data)
        .enter()    
        .append("rect")
        .attr("x", (d, i) => xScale(i))
        .attr("y", (d, i) => h - yScale(d[1]) - padding)
        .attr("width", 3)
        .attr("height", d => yScale(d[1]))
        .attr("class", "bar")
        .attr("data-date", d => d[0])
        .attr("data-gdp", d => d[1])
        .on("mouseover", function(d) {        
            d3.select("#tooltip")
            .style("display", "block")
            .attr("data-date", d[0])
            .html(getTooltipHtml(d));
            d3.select(this).classed("active-rect", true);
        })
        .on("mouseout", function(d){
            d3.select("#tooltip")
            .style("display", "none");
            d3.select(this).classed("active-rect", false);
        });

        //setting axes
        const xAxis = d3.axisBottom(xScaleForAxis);    
        svg.append("g").attr("id", "x-axis")
        .attr("transform", `translate(0, ${h - padding})`)
        .call(xAxis);
        const yAxis = d3.axisLeft(yScaleForAxis);
        svg.append("g").attr("id", "y-axis")
        .attr("transform", `translate(${padding},0)`)
        .call(yAxis);

        //appending legend?
        svg.append("text")
        .text("Gross Domestic Product")
        .attr("x", -200 - padding)
        .attr("y", padding + 20)
        .attr("transform", `rotate(-90)`);
    }
    componentWillUnmount(){
        document.body.style.backgroundColor = "white"; 
    }
}