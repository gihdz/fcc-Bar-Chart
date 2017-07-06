import React from 'react';
import * as d3 from 'd3'

export default class extends React.Component{
    render(){
        return(<div>
            <div id="tooltip" className="Heatmap-tooltip">
                
        </div>
        <div id="Heatmap-container">
            <div id="title" className="Heatmap-title">
                <div id="HM-main-title">Monthly Global Land-Surface Temperature</div>
                <p id="HM-sub-title"></p>
            </div>

        </div>



        </div>);
    }
    componentDidMount(){
        this.props.selecTestSuiteFor("heat-map");

        fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json").then(res => res.json()).then(res => this.displayData(res)).catch(reason => console.log(reason));
        
    }
    displayData(data){
        console.log(data);
        
        const baseTemp = data.baseTemperature;
        const mVariance = data.monthlyVariance;
        
        const months = ["","January", "February", "March", "April", "May", "June", "July", 
        "August", "September", "October", "November", "December", ""];
        const getTooltipHtml = (d) => {
            const temp = (baseTemp + d.variance).toFixed(1);
            let html =`${d.year} - ${months[d.month]}<br/>
            ${temp}°C<br/>
            ${d.variance.toFixed(1)}°C`;        
            return html;
        };
        const getFill = (temp) => {
            var fill = "black";
            if(temp < 2.8) fill = "rgb(49, 54, 149)";
            if(temp >= 2.8 && temp < 3.9) fill = "rgb(69, 117, 180)";
            if(temp >= 3.9 && temp < 5.0) fill = "rgb(116, 173, 209)";
            if(temp >= 5.0 && temp < 6.1) fill = "rgb(171, 217, 233)";
            if(temp >= 6.1 && temp < 7.2) fill = "rgb(224, 243, 248)";
            if(temp >= 7.2 && temp < 8.3) fill = "rgb(255, 255, 191)";
            if(temp >= 8.3 && temp < 9.5) fill = "rgb(254, 224, 144)";
            if(temp >= 9.5 && temp < 10.6) fill = "rgb(253, 174, 97)";
            if(temp >= 10.6 && temp < 11.7) fill = "rgb(244, 109, 67)";
            if(temp >= 11.7 && temp < 12.8) fill = "rgb(215, 48, 39)";
            if(temp >= 12.8) fill = "rgb(165, 0, 38)";
            return fill;            
        }
        const w = 1400;
        const h = 500;
        const svgH = 580;
        const paddingTop = 20;
        const paddingBottom = 50;
        const paddingLeft = 100;  
        const paddingRight = 20;  

        const maxRight = w - paddingRight;
        const maxLeft = paddingLeft;
        const maxBottom = h - paddingBottom;
        const maxTop = paddingTop;

        const svg = d3.select("#Heatmap-container").append("svg")
        .attr("width", w).attr("height", svgH);

        const tooltip = d3.select("#tooltip");

        const minYear = d3.min(mVariance, d => d.year);        
        const maxYear = d3.max(mVariance, d => d.year);

        d3.select("#HM-sub-title").text(`${minYear} - ${maxYear}: base temperature ${baseTemp}℃`)

        const xScaleDomain = [minYear, maxYear];
        const xScaleRange = [maxLeft, maxRight];

        const xScale = d3.scaleLinear().domain(xScaleDomain).range(xScaleRange);

        const xAxis = d3.axisBottom(xScale)
        .tickFormat(d => d.toString());
        
        svg.append("g").attr("id", "x-axis")
        .attr("transform", `translate(0, ${maxBottom})`)
        .call(xAxis)
        .append("text")
        .text("Years")
        .style("fill", "black")
        .attr("x", w/2)
        .attr("y", 35 )   
        ;

        const yScaleDomain = [d3.min(mVariance, d => d.month) - 1, d3.max(mVariance, d => d.month) + 1];
        const yScaleRange = [maxTop, maxBottom];

        const yScale = d3.scaleLinear()
        .domain(yScaleDomain)
        .range(yScaleRange);

        const yAxis = d3.axisLeft(yScale)
        .tickFormat(d => {
            return months[d];
        });

        svg.append("g").attr("id", "y-axis")
        .attr("transform", `translate(${maxLeft},0)`)
        .call(yAxis).append("text")
        .text("Months")
        .style("fill", "black")
        .attr("x", -h/2 + 50)
        .attr("y", -60)
        .attr("transform", "rotate(-90)")   
        ;

        //temp rects
        const rects = svg.selectAll(".Heatmap-rect").data(mVariance)
        .enter()
        .append("rect");
        
        const diffYear = maxYear - minYear;
        const diffW = maxRight - maxLeft;
        const rectW = diffW/diffYear;

        
        rects.attr("x", d => xScale(d.year) + 1)
        .attr("y", d => yScale(d.month) - 16)
        .attr("width", rectW)
        .attr("height", d =>{
            return 33;            
        })
        .attr("class", "Heatmap-rect cell")
        .style("fill", d => {
            return getFill((baseTemp + d.variance).toFixed(1));
        })
        .on("mouseover", function(d){
            const rect = this.getBoundingClientRect();
            tooltip.style("top", `${rect.top - 80}px`);
            tooltip.style("left", `${rect.left}px`);
            tooltip.html(getTooltipHtml(d));
            tooltip.classed("show", true);
        })
        .on("mouseout", d => {
            tooltip.classed("show", false);
        })  

        //legend axis
        const legendDomain = [2.8,3.9,5.0,6.1,7.2,8.3,9.5,10.6,11.7,12.8];
        let legendAxisRange = [];
        const rectLegendWidth = 30;
        const rectLegendHeight = 20;
        let inc = maxLeft + rectLegendWidth - .5;        
        for(let i = 0; i < legendDomain.length; i++){
            legendAxisRange.push(inc);
            inc += rectLegendWidth;            
        }
        
        const legendAxisDomain = legendDomain.map(d => d.toFixed(1));
        const legendAxisScale = d3.scaleOrdinal()
        .domain(legendAxisDomain)
        .range(legendAxisRange);
        const axisLegend = d3.axisBottom(legendAxisScale);

        const gLegend = svg.append("g").attr("id", "legend-axis")
        .attr("transform", `translate(0, ${svgH - 50})`)
        .call(axisLegend);

        gLegend.select("path").style("stroke-width", 0);

        // legend rect        
        legendDomain.push(13);
        const legendRange = [];
        inc = maxLeft;
        for(let i = 0; i < legendDomain.length; i++){
            legendRange.push(inc);
            inc += rectLegendWidth;            
        }

        const legendScale = d3.scaleOrdinal().domain(legendDomain).range(legendRange);
        
        svg.selectAll(".rect-legend")
        .data(legendDomain)
        .enter()
        .append("rect")
        .attr("class", "rect-legend")
        .style("fill", d => { 
            return getFill(d);
        })
        .style("stroke", "black")
        .attr("width", rectLegendWidth).attr("height", rectLegendHeight)
        .attr("x", d => legendScale(d)).attr("y", svgH - 70);

    }
}