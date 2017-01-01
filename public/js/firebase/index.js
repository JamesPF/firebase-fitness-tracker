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

  buildChart(parsedMeasurements);
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
    console.log(parsedMeasurements);
    updateChart(parsedMeasurements);
  });

});





// // Create new date/weight measurement
// $('#measurement-entry').on('submit', function (e) {
//   e.preventDefault();
//
//   var date = $('[name=date]').val();
//   var weight = $('[name=weight]').val();
//   var newMeasurement = {date, weight};
//   console.log(newMeasurement);
//
//   firebaseRef.child('measurements').push(newMeasurement);
// });
//
// var addMeasurement = function (snapshot) {
//   addedMeasurement = snapshot.val();
//   console.log('logged', addedMeasurement);
//
//   firebaseRef.child('measurements').once('value', function (snapshot) {
//     if (initialDataLoaded) {
//       var measurements = snapshot.val() || {};
//       var parsedMeasurements = [];
//
//       Object.keys(measurements).forEach(function (measurementId) {
//         parsedMeasurements.push(measurements[measurementId]);
//       });
//       console.log(parsedMeasurements);
//       // buildChart(parsedMeasurements);
//     }
//   });
// };
//
// // Get newest measurement when added
// firebaseRef.child('measurements').on('child_added', addMeasurement);
