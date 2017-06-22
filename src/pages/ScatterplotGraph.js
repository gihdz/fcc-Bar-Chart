import React from 'react'
import * as d3 from 'd3'
export default class extends React.Component{
    render(){
        return(
            <div>
        <div id="tooltip" className="ScatterplotGraph-tooltip">
        </div>
        <div id="ScatterplotGraph-container">
            <div id="title" className="ScatterplotGraph-title">
                <div id="SG-main-title">Doping in Professional Bicycle Racing</div>
                <div id="SG-sub-title">35 Fastest times up Alpe d'Huez</div>
            </div>
        </div>
        </div>
        );
    }
    componentDidMount(){
        this.props.selecTestSuiteFor("scatter-plot");

        fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json").then(res => res.json()).then(res => this.displayData(res)).catch(reason => console.log(reason));
    }
    displayData(data){
        console.log(data);
        const getTooltipHtml = (d) => {
            let html =`${d.Name}: ${d.Nationality}<br/>
            Year: ${d.Year}, Time: ${d.Time}`;
            if(d.Doping) html += `<br/><br/>
            ${d.Doping}`;         
            return html;
        };
        
        //setting svg
        const w = 960;
        const h = 630;
        const yPadding = 20;
        const xPadding = 55;        

        const maxRight = w - xPadding;
        const maxLeft = xPadding;
        const maxBottom = h - yPadding;
        const maxTop = yPadding;

        const dopingColor = "rgb(31, 119, 180)";
        const noDopingColor = "rgb(255, 127, 14)";
        const classNoDoping = "SG-dot-no-doping";
        const classDoping = "SG-dot-doping";
        const circleRadius = 6;

        const svg = d3.select("#ScatterplotGraph-container")
        .append("svg").attr("width", w).attr("height", h);
        
        //coords for tooltip
        svg.on("mousemove", () => {
            d3.select("#tooltip")
            .style("top", `${d3.event.y - 10}px`)
            .style("left", `${d3.event.x + 20}px`);
        });   

        //setting axes
        const xScaleDomain = [d3.min(data, d => d.Year), d3.max(data, d => d.Year)];
        const xScaleRange = [maxLeft, maxRight];
        const xScale = d3.scaleLinear().domain(xScaleDomain).range(xScaleRange);

        const xAxis = d3.axisBottom(xScale);    
        svg.append("g").attr("id", "x-axis")
        .attr("transform", `translate(0, ${maxBottom})`)
        .call(xAxis);
        
        const yScaleDomain = [d3.min(data, d => d.Seconds), d3.max(data, d => d.Seconds)];
        const yScaleRange = [maxTop, maxBottom];
        const yScale = d3.scaleLinear().domain(yScaleDomain).range(yScaleRange);

        const yAxis = d3.axisLeft(yScale)
        .tickFormat(d => {
            let minutes = Math.floor(d / 60);
            let seconds = (d - (minutes * 60)).toString(10);
            minutes = minutes.toString(10);
            if(seconds.length === 1) seconds = `0${seconds}`;
            if(minutes.length === 1) minutes = `0${minutes}`;
            return `${minutes}:${seconds}`;            
        });

        //appending circles
        svg.append("g").attr("id", "y-axis")
        .attr("transform", `translate(${maxLeft},0)`)
        .call(yAxis);

        svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.Year))
        .attr("cy", d => yScale(d.Seconds))
        .attr("r", circleRadius)
        .attr("class", d =>{ 
            let klass = "dot SG-dot ";
            if(d.Doping)klass += classDoping
            else klass += classNoDoping;
            return klass;
        })
        .attr("data-xvalue", d => d.Year)
        .attr("data-yvalue", d => {
            const mins = d.Time.split(":")[0];
            return mins;
        })
        .style("fill", d =>{
            if(d.Doping)
                return dopingColor;
            else return noDopingColor;
        })
        .on("mouseover", function(d){        
            d3.select("#tooltip")
            .style("display", "block")
            .attr("date-year", xScale(d.Year))
            .html(getTooltipHtml(d));
        })
        .on("mouseout", function(d){
            d3.select("#tooltip")
            .style("display", "none");
        });
        //appending yAxis text Time in Minutes
        svg.append("text")
        .text("Time in Minutes")
        .attr("x", -180)
        .attr("y",  15)
        .attr("transform", `rotate(-90)`);

        //legend
        const handleLegendMouseOverOut = (klass, toggle) => {
            klass = `.${klass}`;
            const circles = d3.selectAll(klass);
            if(toggle) circles.attr("r", 10);
            else circles.attr("r", circleRadius);
        }
        const legendNoDoping = svg.append("g")
        .attr("id","legend").attr("class", "legend")
        .attr("transform", `translate(${maxRight}, ${h/2})`)
        .on("mouseover",() => handleLegendMouseOverOut(classNoDoping, true))
        .on("mouseout",() => handleLegendMouseOverOut(classNoDoping, false));

        const legendDoping = svg.append("g")
        .attr("id","legend").attr("class", "legend")
        .attr("transform", `translate(${maxRight}, ${(h/2) + 25 })`)
        .on("mouseover",() => handleLegendMouseOverOut(classDoping, true))
        .on("mouseout",() => handleLegendMouseOverOut(classDoping, false));

        legendNoDoping.append("text").text("No doping allegations")
        .style("text-anchor", "end")
        .style("font-size", 10)
        .attr("y", 14);
        legendNoDoping.append("rect").style("fill", noDopingColor)
        .style("stroke", "black")        
        .attr("width", 18).attr("height", 18)
        .attr("x", 5);
        legendDoping.append("text").text("Riders with doping allegations")
        .style("text-anchor", "end")
        .style("font-size", 10)
        .attr("y", 14);
        legendDoping.append("rect").style("fill", dopingColor)
        .style("stroke", "black")        
        .attr("width", 18).attr("height", 18)
        .attr("x", 5);
    }
}