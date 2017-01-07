var measurementArray =[];

// Get Firebase reference
var firebaseRef = firebase.database().ref();


// ON LOAD
// --------------------
// Get all measurements
var displayMeasurements = function (snapshot) {
  var measurements = snapshot.val() || {};
  var parsedMeasurements = [];

  Object.keys(measurements).forEach(function (measurementId) {
    parsedMeasurements.push(measurements[measurementId]);
  });

  measurementArray = parsedMeasurements;
  buildChart(measurementArray);
};
firebaseRef.child('measurements').once('value', displayMeasurements);


// POST MEASUREMENT
// --------------------
// Measurement posted
$('#measurement-entry').on('submit', function (e) {
  e.preventDefault();

  var date = $('[name=date]').val();
  var weight = $('[name=weight]').val();
  var newMeasurement = {date, weight};

  // Search firebase for any item with a matching date
    // If there's an item, update that item
    // Else, create a new item

  $('[name=date]').val('');
  $('[name=weight]').val('');

  firebaseRef.child('measurements').push(newMeasurement);

  firebaseRef.child('measurements').on('value', function (snapshot) {
    var measurements = snapshot.val();
    var parsedMeasurements = [];

    Object.keys(measurements).forEach(function (measurementId) {
      parsedMeasurements.push(measurements[measurementId]);
    });
    measurementArray = parsedMeasurements;
    updateChart(measurementArray);
  });
});

// REMOVE MEASUREMENT
// --------------------
$('#remove-entry').on('submit', function (e) {
  e.preventDefault();

  var date = $('[name=date]').val();

  // Search firebase for any item with a matching date
    // If there's an item, remove that item
      // And get all measurements and run updateChart()
    // Else, do nothing
});
