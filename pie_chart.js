var margin = { top: 10, right: 30, bottom: 30, left: 40 },
    width = 700 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;
radius = Math.min(width, height) / 2;


d3.json("sales_by_platform.json", (dr) => {

    // console.log(data);
    let data = [];
    let keys = Object.keys(dr);
    for (const key of keys) {
        data.push({ "platform": key, "profit": dr[key] })
    }
    console.log(data);

    var color = d3.scaleOrdinal().range(["#f9f0ff", "#e9c0ff", "#d489ff", "#c55bff"]);

    var arc = d3
        .arc()
        .outerRadius(radius - 10)
        .innerRadius(0);

    var labelArc = d3
        .arc()
        .outerRadius(radius - 40)
        .innerRadius(radius - 40);

    var pie = d3
        .pie()
        .sort(null)
        .value(function (d) {
            return +d.profit;
        });
        
    var svg = d3.select("#pie_chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var g = svg
        .selectAll(".arc")
        .data(pie(data))
        .enter()
        .append("g")
        .attr("class", "arc");

    g.append("path")
        .attr("d", arc)
        .style("fill", function (d) {
            return color(+d.value);
        })
        .on('mouseenter', function (d, i) {
            let percentage = (d.endAngle - d.startAngle) / (2 * Math.PI) * 100
            let percent = Math.round(percentage * 10) / 10
            d3.select(this).attr('opacity', .5)
            d3.select("#tooltip")
                .style("left", d3.event.pageX + "px")
                .style("top", d3.event.pageY + "px")
                .style("opacity", 1)
                // .select("#value")
                .text(percent + "%");
            console.log(percentage)
        })
        .on('mousemove', function (d, i) {
            d3.select("#tooltip")
                .style("left", d3.event.pageX + "px")
                .style("top", d3.event.pageY + "px")
        })
        .on('mouseleave', function (d, i) {
            d3.select(this).attr('opacity', 1)
        });

    g.append("text")
        .attr("transform", function (d) {
            return "translate(" + labelArc.centroid(d) + ")";
        })
        .attr("dy", ".35em")
        .text(function (d) {
            return d.data.platform;
        });
});
