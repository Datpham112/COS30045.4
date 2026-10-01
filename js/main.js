// ---------------------------------------------------------------
// Exercises 4.3 - 4.7: bar chart of TV counts by brand
// ---------------------------------------------------------------

// Ex 4.3 Step 2: create the svg inside the responsive container.
// Ex 4.6: viewBox is smaller than the old 1200 x 1600 so scales are needed.
const svg = d3.select(".responsive-svg-container")
  .append("svg")
    .attr("viewBox", "0 0 500 400")
    .style("border", "1px solid black");

// Ex 4.4: load the csv, convert count to a number, then draw
d3.csv("data/2026_TV_Data.csv", d => {
  return {
    brand: d.brand,
    count: +d.count            // + converts the string to a number
  };
}).then(data => {
  // Ex 4.4 Step 3: explore the data set
  console.log(data);
  console.log(data.length);
  console.log(d3.max(data, d => d.count));
  console.log(d3.min(data, d => d.count));
  console.log(d3.extent(data, d => d.count));

  // sort largest to smallest so the chart is easier to read
  data.sort((a, b) => b.count - a.count);

  // Ex 4.5: hand the data to the function that builds the chart
  drawBarChart(data);
});

// Ex 4.5 - 4.7: build the chart
const drawBarChart = data => {

  // Ex 4.6 Step 1: linear scale for the counts (x-axis).
  // Domain goes a bit above the max (~1050). Range leaves room on the
  // left for brand labels (100px) and on the right for value labels.
  const xScale = d3.scaleLinear()
    .domain([0, 1200])
    .range([0, 340]);

  // Ex 4.6 Step 2: band scale for the categories (y-axis).
  // padding() puts a gap between bars.
  const yScale = d3.scaleBand()
    .domain(data.map(d => d.brand))
    .range([0, 400])
    .padding(0.2);

  // Ex 4.7 Step 2: one group per brand holding its bar and labels,
  // moved down together with translate (like the windows in Ex 4.1)
  const barAndLabel = svg
    .selectAll("g")
    .data(data)
    .join("g")
      .attr("transform", d => `translate(0, ${yScale(d.brand)})`);

  // Ex 4.5 + 4.6 + 4.7 Step 3: the bars.
  // x = 100 leaves room for labels; y = 0 because the group does the moving.
  barAndLabel
    .append("rect")
      .attr("class", d => `bar bar-${d.count}`)
      .attr("x", 100)
      .attr("y", 0)
      .attr("width", d => xScale(d.count))
      .attr("height", yScale.bandwidth())
      .attr("fill", "steelblue");

  // Ex 4.7 Step 4: brand name, right-aligned just left of the bar
  barAndLabel
    .append("text")
      .text(d => d.brand)
      .attr("x", 90)
      .attr("y", yScale.bandwidth() / 2 + 4)   // roughly vertically centred
      .attr("text-anchor", "end")
      .style("font-size", "13px");

  // Ex 4.7 Step 5: count value just past the end of the bar
  barAndLabel
    .append("text")
      .text(d => d.count)
      .attr("x", d => 100 + xScale(d.count) + 5)
      .attr("y", yScale.bandwidth() / 2 + 4)
      .style("font-size", "13px");
};
