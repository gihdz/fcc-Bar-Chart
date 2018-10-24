import React from 'react'
import * as d3 from 'd3'
import {
    Link
  } from 'react-router-dom';
const datasetUrl = {
    videogames:{ url: "https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/video-game-sales-data.json", subTitle: "Top 100 Most Sold Video Games Grouped by Platform"},
    movies:{ url: "https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/movie-data.json", subTitle:"Top 100 Highest Grossing Movies Grouped By Genre"},
    kickstarter: {url:"https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/kickstarter-funding-data.json", subTitle: "Top 100 Most Pledged Kickstarter Campaigns Grouped By Category"}

}
function sumByValue(d) {
    return d.value;
  }
  function getTooltipHtml(d) {
      const data = d.data;
    return `Name: ${data.name} <br/>
    Category: ${data.category} <br/>
    Value: ${data.value}`
};
export default class extends React.Component{
    render(){
        const base = process.env.PUBLIC_URL;
        const treemapUrl = `${base}/treemap`;
        return(
            <div>
            <div id="tooltip" className="TM-tooltip"></div>
        <div id="TM-container">
        <nav id="sub-nav">
                <div>
                    <ul id="TM-nav-links" >
                        <li>
                <Link to={treemapUrl + "/videogames"}>Video Games</Link>
                </li>
                <li>                
                <Link to={treemapUrl + "/movies"}>Movies</Link> 
                </li>
                <li>                
                <Link to={treemapUrl + "/kickstarter"}>KickStarter</Link>
                </li>
                
                </ul>
                </div>
                </nav> 
            <div id="title" className="TM-title">
                <h2 className="TM-main-title"> </h2>
                <p id="description" className="TM-sub-title">
                
                </p>

            </div>
            <div id="TM-svg-container"></div>
            <div id ="TM-svg-legend-container"></div>

        </div>
        </div>
        );
    }
    componentDidMount(){
        this.props.selecTestSuiteFor("tree-map");
        this.init(this.props);
    }
    componentWillReceiveProps(newProps){
        this.init(newProps);
    }
    init(treeMapProps){
        const {dataset} = treeMapProps.match.params;
        
        // console.log("dataset: ", dataset);
        if(datasetUrl[dataset])
            this.initData(datasetUrl[dataset]);
        else
            alert("Url not found");
    }
    initData(dataset){
        const w = 960;
        const h = 570;
                
        const svgContainer = d3.select("#TM-svg-container");
        svgContainer.select("svg").remove();
        
        const svg = svgContainer.append("svg")
        .attr("width", w).attr("height", h);

        const tooltip = d3.select("#tooltip");
        svg.on("mousemove", () => {
            tooltip
            .style("top", `${d3.event.y - 10}px`)
            .style("left", `${d3.event.x + 20}px`);
        }); 

        const fader = function(color) { 
            return d3.interpolateRgb(color, "#fff")(0.2); },
        color = d3.scaleOrdinal(d3.schemeCategory20.map(fader))

        const treemap = d3.treemap()
        .tile(d3.treemapResquarify)
        .size([w, h])
        .paddingInner(1);
        d3.json(dataset.url, function(error, data) {
            if (error) throw error;
            
           //setting title 
           d3.select(".TM-main-title").text(data.name);
           d3.select(".TM-sub-title").text(dataset.subTitle);
            
            const root = d3.hierarchy(data)
                .eachBefore(function(d) { d.data.id = (d.parent ? d.parent.data.id + "." : "") + d.data.name; })
                .sum(sumByValue)
                .sort(function(a, b) { return b.height - a.height || b.value - a.value; });
          
            treemap(root);
          
            const cell = svg.selectAll("g")
              .data(root.leaves())
              .enter().append("g")
                .attr("transform", function(d) { return "translate(" + d.x0 + "," + d.y0 + ")"; })
                .on("mouseover", d => {
                    tooltip.html(getTooltipHtml(d));
                  tooltip.attr("data-value", d.data.value )
                    tooltip.classed("show", true);
                  })
                  .on("mouseout", d => {
                      tooltip.classed("show", false);
                  })
                  ;
          
            cell.append("rect")
                .attr("id", function(d) { return d.data.id; })
                .attr("width", function(d) { return d.x1 - d.x0; })
                .attr("height", function(d) { return d.y1 - d.y0; })
                .attr("fill", function(d) { return color(d.parent.data.id); })
                .attr("data-legend", d => d.parent.data.name)
                .attr("class", "tile")
                .attr("data-name", d=> d.data.name)
                .attr("data-category", d=> d.data.category)
                .attr("data-value", d=> {

                    // console.log(`value: ${d.value}, width: ${d.x1 - d.x0}, height: ${d.y1 - d.y0}, area: ${(d.x1 - d.x0) * (d.y1 - d.y0)}, name: ${d.data.name}`)
                    // d.data.value
                    return d.data.value;
                })
                ;
          
            cell.append("clipPath")
                .attr("id", function(d) { return "clip-" + d.data.id; })
              .append("use")
                .attr("xlink:href", function(d) { return "#" + d.data.id; });
          
            cell.append("text")
                .attr("clip-path", function(d) { return "url(#clip-" + d.data.id + ")"; })
              .selectAll("tspan")
              .data(function(d) { return d.data.name.split(/(?=[A-Z][^A-Z])/g); })
              .enter().append("tspan")
              .style("font-size", 9.5)
              .attr("x", 4)
              .attr("y", function(d, i) { return 13 + i * 10; })
              .text(function(d) { return d; });


              //LEGEND
              const legendData = svg.selectAll('[data-legend]');
              const categoryKeys = {};
              let categories = [];
              legendData.each(function()
              { 
                const self = d3.select(this);
                const category = self.attr('data-legend');
                if(!categoryKeys[category]){ 
                categoryKeys[category] = true;
                categories = categories.concat(
                        {
                            name: category,
                            pos: self.attr('data-legend-pos') || this.getBBox().y,
                            color: self.style('fill') !== 'none' ? self.style('fill') : self.style('stroke')
                        }
                    )
                }
            });
            // console.log("categories: ", categories);
            const svgLegendWidth = 250;
            
            const svgLegendContainer = d3.select("#TM-svg-legend-container");
            svgLegendContainer.select("svg").remove();
            const svgLegend = svgLegendContainer.append("svg")
            .attr("id", "legend").attr("width", svgLegendWidth).attr("height", 200);

            const catPos = {x: 5, y :10};

              const legends = svgLegend.selectAll("g").data(categories).enter()
              .append("g")
              .attr("transform", function(d) {
                  let translate = "translate(" + catPos.x + "," + catPos.y + ")"; 
                  if(catPos.x <= svgLegendWidth - 50) {
                      catPos.x += 100;
                  }
                  else {
                        catPos.x = 5;
                        catPos.y += 25;
                    }
                  return translate; 
                })
                .on("mouseover", function(d) {
                    d3.selectAll(`[data-legend='${d.name}']`).attr("stroke", "black");                    
                })
                .on("mouseout", function(d) {
                    d3.selectAll(`[data-legend='${d.name}']`).attr("stroke", "none");
                });

              legends.append("rect")
              .attr("width", 15).attr("height", 15)
              .attr("class", "legend-item")
              .attr("fill", d => d.color)
              .style("stroke", "black");

              legends.append("text")
              .attr("x", 17).attr("y", 11)
              .style("font-size", 10)
              .text(d => d.name);
          });
    }
}