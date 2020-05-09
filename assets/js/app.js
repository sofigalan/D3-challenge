// @TODO: YOUR CODE HERE!
// Step 1: Set up our chart
//= ================================
var svgWidth = 900;
var svgHeight = 500;

var margin = {
	top: 20,
	right: 60,
	bottom: 100,
	left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Step 2: Create an SVG wrapper,
// append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
// =================================
var svg = d3
	.select("#scatter")
	.append("svg")
	.attr("width", svgWidth)
	.attr("height", svgHeight);

var chartGroup = svg.append("g")
	.attr("transform", `translate(${margin.left}, ${margin.top})`);


// Load data 
d3.csv("./assets/data/data.csv").then(function(censusData, err) {
	if (err) throw err;
	
	console.log(censusData);

    // parse data
	censusData.forEach(function(data) {
		data.poverty = +data.poverty;
		data.healthcare = +data.healthcare;
		data.abrr = +data.abbr;
	});
	
	console.log(censusData);
	
    //Create scale functions
	var xLinearScale = d3.scaleLinear()
		.domain([6, d3.max(censusData, d => d.poverty)])
		.range([0, width]);

	var yLinearScale = d3.scaleLinear()
		.domain([0, d3.max(censusData, d => d.healthcare)])
		.range([height, 0]);

	// Create initial axis functions
	var bottomAxis = d3.axisBottom(xLinearScale);
	var leftAxis = d3.axisLeft(yLinearScale);

	// append axes
	chartGroup.append("g")
		.attr("transform", `translate(0, ${height})`)
		.call(bottomAxis);

	chartGroup.append("g")
		.call(leftAxis);
	  
	// append initial circles
	var circlesGroup = chartGroup.selectAll("circle")
	.data(censusData)
	.enter()
	.append("circle")
	.attr("cx", d => xLinearScale(d.poverty))
	.attr("cy", d => yLinearScale(d.healthcare))
	.attr("r", 15)
	.attr("fill", "blue")
	.attr("opacity", ".5");
	
    var textGroup = chartGroup.selectAll()
	.data(censusData)
	.enter()
	.append("text")
	.attr("x", d => xLinearScale(d.poverty))
	.attr("y", d => yLinearScale(d.healthcare) + 5)
	.attr("text-anchor", "middle")
	.attr("font-family", "sans-serif")
	.attr("font-size", "15px")
	.attr("fill", "white")
	.text(d => d.abbr);

	// Create axes labels
	chartGroup.append("text")
	.attr("transform", "rotate(-90)")
	.attr("y", 0 - margin.left + 40)
	.attr("x", 0 - (height / 2))
	.attr("dy", "1em")
	.attr("class", "axisText")
	.text("Lack of Healthcare (%)");

	chartGroup.append("text")
		.attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
		.attr("class", "axisText")
		.text("In Poverty (%)");
}).catch(function(error) {
  console.log(error);
});