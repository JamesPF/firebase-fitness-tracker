// Initialize Firebase
var config = {
  apiKey: "AIzaSyBQIEv21xenoYJHVaqk6zVB8tZ9gxLLXLM",
  authDomain: "felz-fitness-tracker.firebaseapp.com",
  databaseURL: "https://felz-fitness-tracker.firebaseio.com",
  storageBucket: "felz-fitness-tracker.appspot.com",
  messagingSenderId: "838221349830"
};
firebase.initializeApp(config);

var measurementArray =[];
var initialDataLoaded = false;
var addedMeasurement = {};

// Get Firebase reference
var firebaseRef = firebase.database().ref();


// ON LOAD
// --------------------
// Get all measurements
var displayMeasurements = function (snapshot) {
  initialDataLoaded = true;
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
