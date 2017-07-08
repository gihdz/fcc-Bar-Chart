import React from 'react'
import * as d3 from 'd3'
import * as d3Schemes from 'd3-scale-chromatic'
import * as topojson from 'topojson'

export default class extends React.Component{
    render(){
        return (        <div>
            <div id="tooltip" className="CM-tooltip">
                
        </div>
        <input id="test-thres" type="number" defaultValue="0" />
        <div id="CM-container">
            <div id="title" className="CM-title">
                <div className="CM-main-title">Choropleth Map</div>
                <p id="description" className="CM-sub-title"></p>
            </div>

        </div>
        </div>
        )
    }
    componentDidMount(){
        // this.props.selecTestSuiteFor("heat-map");

        fetch("https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json").then(res => res.json()).then(res => this.initData(res)).catch(reason => console.log(reason));
        
    }
    initData(data){
        fetch("https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json").then(res => res.json()).then(res => this.displayData(res, data)).catch(reason => console.log(reason));
    }
    displayData(data, educationData){
        console.log("County data: ", data)
        console.log("Educational data: ",  educationData);

        const educationDataHash = {};
        for(let i = 0; i < educationData.length; i++){
            educationDataHash[educationData[i].fips] = educationData[i];
        }

        const getTooltipHtml = (d) => {
            const info = educationDataHash[d.id];
            return `${info.area_name}, ${info.state}: ${info.bachelorsOrHigher}%`;
        };

        const w = 960;
        const h = 600;

        const geoPath = d3.geoPath();
                
        const svg = d3.select("#CM-container").append("svg")
        .attr("width", w).attr("height", h);

        const tooltip = d3.select("#tooltip");
        //coords for tooltip
        svg.on("mousemove", () => {
            tooltip
            .style("top", `${d3.event.y - 10}px`)
            .style("left", `${d3.event.x + 20}px`);
        }); 

        svg.append("g")
        .attr("class", "CM-counties")
        .selectAll("path")
        .data(topojson.feature(data, data.objects.counties).features)
        .enter().append("path")
        .on("mouseover", d => {
            tooltip.html(getTooltipHtml(d));
            tooltip.classed("show", true);
        })
        .on("mouseout", d => {
            tooltip.classed("show", false);
        })
        .attr("d", geoPath);

        svg.append("path")
        .attr("class", "CM-county-borders")
        .attr("d", geoPath(topojson.mesh(data, data.objects.counties, function(a, b) { return a !== b; })));

        // // const colorScaleDomain = [d3.min(educationData, d => d.bachelorsOrHigher), d3.max(educationData, d => d.bachelorsOrHigher)];
        // const colorScaleRange = ["#e5f5e0","#c7e9c0", "#a1d99b", "#74c476", "#41ab5d", "#238b45", "#006d2c", "#00441b"];
        // let max = 100;
        // max = d3.max(educationData, d => d.bachelorsOrHigher);
        // let inc = -10;
        // inc = d3.min(educationData, d => d.bachelorsOrHigher) + 8;
        // const colorScaleDomain = [];
        // const diff = max/(colorScaleRange.length - 1);
        // for(var i = 0; i < colorScaleRange.length - 1; i++){
        //     colorScaleDomain.push(inc);
        //     inc += diff;
        // }
        // console.log(colorScaleDomain);

        
        // const colorScale = d3.scaleThreshold().domain(colorScaleDomain).range(colorScaleRange);
        const otherScale = d3.scaleLinear().domain([d3.min(educationData, d => d.bachelorsOrHigher),d3.max(educationData, d => d.bachelorsOrHigher)]).range([1,10]);

        var x = d3.scaleLinear()
        .domain([1, 10])
        .rangeRound([600, 860]);

        var colorScale = d3.scaleThreshold()
            .domain(d3.range(2, 10))
            .range(d3Schemes.schemeBlues[9]);

            console.log(d3.range(2, 10))

        var g = svg.append("g")
            .attr("class", "key")
            .attr("transform", "translate(0,40)");

        g.selectAll("rect")
        .data(colorScale.range().map(function(d) {
            d = colorScale.invertExtent(d);
            if (d[0] == null) d[0] = x.domain()[0];
            if (d[1] == null) d[1] = x.domain()[1];
            return d;
            }))
        .enter().append("rect")
            .attr("height", 8)
            .attr("x", function(d) { return x(d[0]); })
            .attr("width", function(d) { return x(d[1]) - x(d[0]); })
            .attr("fill", function(d) { return colorScale(d[0]); });

        g.append("text")
            .attr("class", "caption")
            .attr("x", x.range()[0])
            .attr("y", -6)
            .attr("fill", "#000")
            .attr("text-anchor", "start")
            .attr("font-weight", "bold")
            .text("Unemployment rate");

        g.call(d3.axisBottom(x)
            .tickSize(13)
            .tickFormat(function(x, i) { return i ? x : x + "%"; })
            .tickValues(colorScale.domain()))
            .select(".domain")
            .remove();
        d3.select("#test-thres")
        .on("click", function(){
            console.log(colorScale(parseFloat(this.value)));
            // this.select();
        })
        // console.log(colorScale(6));


    }
}