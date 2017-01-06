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
  console.log('measurement array', measurementArray);
};
firebaseRef.child('measurements').once('value', displayMeasurements);


// NEW MEASUREMENT
// --------------------
// New measurement posted
$('#measurement-entry').on('submit', function (e) {
  e.preventDefault();

  var date = $('[name=date]').val();
  var weight = $('[name=weight]').val();
  var newMeasurement = {date, weight};
  console.log(newMeasurement);

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
