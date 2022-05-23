var margin = {top: 10, right: 30, bottom: 30, left: 40},
    width = 700 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#box_plot")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

d3.json("games_sales_yearly.json", (dr) => {
  
  let data = [];

  let numGames = Object.keys(dr.Rank).length;
  
  for (let i = 0; i < numGames; i++) {
    let gn = dr.Genre[i];
    let platform = dr.Platform[i];
    let value = dr.Global_Sales[i];
    let genreData = data.find(d => d.genre == gn);
    if (genreData) {
        genreData.dataSet.push(value)
    }
    else {
      if (gn != null) {
        data.push({genre: gn, dataSet: []})
      }
    }
  }        
  console.log(data)

  let sumstat = [];
  for (const g of data) {
    let q1 = d3.quantile(g.dataSet, .25);
    let q3 = d3.quantile(g.dataSet, .75);
    let median = d3.median(g.dataSet);
    let interQuantileRange = q1 - q3
    let min = g.dataSet[g.dataSet.length - 1]
    let max = q1 + 1.5 * interQuantileRange
    let el = {genre: g.genre, q1: q1, median: median, q3: q3, interQuantileRange: interQuantileRange, min: min, max: max}
    sumstat.push(el)
  }
  console.log(sumstat);

  var x = d3.scaleBand()
    .range([ 0, width ])
    .domain(["Action", "Platform", "Adventure", "Sports", "Fighting", "Shooter", "Puzzle", "Racing", "Role-Playing", "Simulation", "Strategy", "Misc"])
    .paddingInner(1)
    .paddingOuter(.5)
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))

  // Show the Y scale
  var y = d3.scaleLinear()
    .domain([0,2])
    .range([height, 0])
  svg.append("g").call(d3.axisLeft(y))

  svg
    .selectAll("vertLines")
    .data(sumstat)
    .enter()
    .append("line")
      .attr("x1", function(d){return(x(d.genre))})
      .attr("x2", function(d){return(x(d.genre))})
      .attr("y1", function(d){return(y(d.min))})
      .attr("y2", function(d){return(y(d.max))})
      .attr("stroke", "black")
      .style("width", 40)
  
      svg
      .selectAll("vertLines")
      .data(sumstat)
      .enter()
      .append("line")
        .attr("x1", function(d){return(x(d.genre))})
        .attr("x2", function(d){return(x(d.genre))})
        .attr("y1", function(d){return(y(d.min))})
        .attr("y2", function(d){return(y(d.max))})
        .attr("stroke", "black")
        .style("width", 40)
  
    // rectangle for the main box
    var boxWidth = 25
    svg
      .selectAll("boxes")
      .data(sumstat)
      .enter()
      .append("rect")
          .attr("x", function(d){return(x(d.genre)-boxWidth/2)})
          .attr("y", function(d){return(y(d.q1))})
          .attr("height", function(d){return(y(d.q3)-y(d.q1))})
          .attr("width", boxWidth )
          .attr("stroke", "black")
          .style("fill", "#69b3a2")
  
    // Show the median
    svg
      .selectAll("medianLines")
      .data(sumstat)
      .enter()
      .append("line")
        .attr("x1", function(d){return(x(d.genre)-boxWidth/2) })
        .attr("x2", function(d){return(x(d.genre)+boxWidth/2) })
        .attr("y1", function(d){return(y(d.median))})
        .attr("y2", function(d){return(y(d.median))})
        .attr("stroke", "black")
        .style("width", 80)
  
    //let dataSorted = data.sort((a, b) => (a.year > b.year) ? 1: -1)
    console.log(data);
  
  })