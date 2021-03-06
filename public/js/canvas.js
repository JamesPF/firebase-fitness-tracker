// Dimensions and formatting variables
var height = 550;
var width = 1200;
var margin = 50;
var parsedDate = d3.timeParse('%Y-%m-%d');
var tooltipDate = d3.timeFormat('%b %e, %Y');

// Creates canvas
var canvas = d3.select('svg')
  .attr('height', height)
  .attr('width', width)
  .style('background', '#ECF0F1')
  .style('display', 'block')
  .style('margin', '0 auto')
  .append('g')
    .attr('transform', 'translate (90, -30)');

// Sets label on y axis
canvas.append('text')
  .attr('text-anchor', 'middle')
  .attr('transform', 'translate(-35,' + (height / 2) + ')rotate(-90)')
  .attr('font-family', 'Helvetica')
  .attr('fill', '#222')
  .text('Weight');

// Sets label on x axis
canvas.append('text')
  .attr('text-anchor', 'middle')
  .attr('transform', 'translate(' + ((width - (4 * margin)) / 2) + ',' + (height + 10) + ')')
  .attr('font-family', 'Helvetica')
  .attr('fill', '#222')
  .text('Date');

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function (d) {
    return 'Date: ' + tooltipDate(parsedDate(d.date)) + '<br>Weight: ' + d.weight + ' lbs';
  });

canvas.call(tip);

// DRAW CHART WHEN DATA LOADS
function buildChart (measurementArray) {
  // Sort measurementArray in chronological order
  measurementArray.sort(function (a, b) {
    return new Date(a.date) - new Date(b.date);
  });

  var x = d3.scaleTime()
    .domain(d3.extent(measurementArray, function (d) {
      var date = parsedDate(d.date);
      return date;
    }))
    .range([0, (width - (3.5 * margin))]);

  var y = d3.scaleLinear()
    .domain([0, d3.max(measurementArray, function (d) {
      return d.weight;
    })])
    .range([(height - (1.5*margin)), margin]);

  var xAxis = d3.axisBottom()
    .scale(x)
    .ticks(d3.timeMonth)
    .tickFormat(d3.timeFormat('%b %Y'))
    .tickSizeInner(-(height - (2.5*margin)))
    .tickSizeOuter(0);

  var yAxis = d3.axisLeft()
    .scale(y)
    .ticks(d3.max(measurementArray, function (d) {
      // Create a way to determine the difference between the largest and smallest numbers
      // If it exceeds a certain amount, change the tick intervals
      return d.weight/10;
    }))
    .tickSizeInner(-(width - (3.5 * margin)));

  // Generates the fill area beneath the data line
  var area = d3.area()
    .x(function (d) {
      var date = parsedDate(d.date);
      return x(date);
    })
    .y0(height - (1.5*margin))
    .y1(function (d) {return y(d.weight);})
    .curve(d3.curveMonotoneX);

  // Generates the lines
  var line = d3.line()
    .x(function (d) {
      var date = parsedDate(d.date);
      return x(date);
    })
    .y(function (d) {return y(d.weight);})
    .curve(d3.curveMonotoneX);

  // Creates the shaded area underneath the line
  var newArea = canvas.selectAll('area')
    .data([measurementArray]);

  newArea.attr('d', area)
    .attr('class', 'area')
    .enter()
      .append('path')
      .attr('d', area)
      .attr('class', 'area');

  newArea.exit().remove();

  // Creates the line
  var newLine = canvas.selectAll('.path')
    .data([measurementArray]);

  newLine.exit().remove();

  newLine.attr('d', line)
    .attr('class', 'path')
    .attr('fill', 'none')
    .attr('stroke', '#2980B9')
    .attr('stroke-width', 3)
    .enter()
      .append('path')
      .attr('class', '.path')
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke', '#2980B9')
      .attr('stroke-width', 3);

  // Appends x axis and moves it to bottom
  canvas.append('g')
    .attr('transform', 'translate (0, ' + (height - (1.5*margin)) + ')')
    .attr('class', 'x-axis')
    .call(xAxis)
    .selectAll('text')
      .style('text-anchor', 'start')
      .attr('transform', function (d) {
        return 'rotate(75) translate(10, -4)';
      });

  // Appends y axis
  canvas.append('g')
    .attr('class', 'y-axis')
    .call(yAxis);

  // Creates points
  var circle = canvas.selectAll('circle')
    .data(measurementArray);

  circle.attr('fill', '#333')
    .attr('r', 3)
    .attr('cx', function (d) {
      var date = parsedDate(d.date);
      return x(date);
    })
    .attr('cy', function (d) {return y(d.weight);})
    .enter()
    .append('circle')
      .attr('r', 3)
      .attr('cx', function (d) {
        var date = parsedDate(d.date);
        return x(date);
      })
      .attr('cy', function (d) {return y(d.weight);})
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);

  circle.exit().remove();
};


// UPDATE CHART
function updateChart(measurementArray) {
  // Remove previous line and area
  d3.selectAll('path').remove();
  d3.selectAll('circle').remove();

  // Sort measurementArray in chronological order
  measurementArray.sort(function (a, b) {
    return new Date(a.date) - new Date(b.date);
  });

  // Draws graph
  var x = d3.scaleTime()
    .domain(d3.extent(measurementArray, function (d) {
      var date = parsedDate(d.date);
      return date;
    }))
    .range([0, (width - (3.5 * margin))]);

  var y = d3.scaleLinear()
    .domain([0, d3.max(measurementArray, function (d) {
      return d.weight;
    })])
    .range([(height - (1.5*margin)), margin]);

  var xAxis = d3.axisBottom()
    .scale(x)
    .ticks(d3.timeMonth)
    .tickFormat(d3.timeFormat('%b %Y'))
    .tickSizeInner(-(height - (2.5*margin)))
    .tickSizeOuter(0);

  var yAxis = d3.axisLeft()
    .scale(y)
    .ticks(d3.max(measurementArray, function (d) {
      return d.weight/10;
    }))
    .tickSizeInner(-(width - (3.5 * margin)));

  // Generates the fill area beneath the data line
  var area = d3.area()
    .x(function (d) {
      var date = parsedDate(d.date);
      return x(date);
    })
    .y0(height - (1.5*margin))
    .y1(function (d) {return y(d.weight);})
    .curve(d3.curveMonotoneX);

  // Generates the lines
  var line = d3.line()
    .x(function (d) {
      var date = parsedDate(d.date);
      return x(date);
    })
    .y(function (d) {return y(d.weight);})
    .curve(d3.curveMonotoneX);

  // Updates the shaded area underneath the line
  var newArea = canvas.selectAll('area')
    .data([measurementArray]);

  newArea.enter()
      .append('path')
      .attr('d', area)
      .attr('class', 'area');

  newArea.exit().remove();

  // Updates the line
  var newLine = canvas.selectAll('.path')
    .data([measurementArray]);

  newLine.enter()
    .append('path')
    .attr('class', '.path')
    .attr('d', line)
    .attr('fill', 'none')
    .attr('stroke', '#2980B9')
    .attr('stroke-width', 3);

  newLine.exit().remove();

  // Updates the X axis and aligns 'month' labels
  canvas.selectAll('.x-axis')
    .call(xAxis)
    .selectAll('text')
      .style('text-anchor', 'start')
      .attr('transform', function (d) {
        return 'rotate(75) translate(10, -4)';
      });

  // Updates the Y axis
  canvas.selectAll('.y-axis')
    .call(yAxis);

  // Updates the measurement points
  var circle = canvas.selectAll('circle')
    .data(measurementArray);

  circle.enter().append('circle')
      .attr('r', 3)
    .merge(circle)
      .attr('cx', function (d) {
        var date = parsedDate(d.date);
        return x(date);
      })
      .attr('cy', function (d) {return y(d.weight);})
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);

  circle.exit().remove();
};
