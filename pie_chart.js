

d3.json("sales_by_platform.json", (dr) => {

    // console.log(data);
    let data = [];
    let keys = Object.keys(dr);
    for (const key of keys) {
        data.push({ "platform": key, "profit": dr[key] })
    }
    console.log(data);

    var width = 960,
        height = 500,
        radius = Math.min(width, height) / 2;

    var color = d3.scaleOrdinal().range(["#98abc5", "#8a89a6", "#7b6888"]);

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

    var svg = d3
        .select("body")
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
