// Initialize Firebase
var config = {
  apiKey: "AIzaSyBQIEv21xenoYJHVaqk6zVB8tZ9gxLLXLM",
  authDomain: "felz-fitness-tracker.firebaseapp.com",
  databaseURL: "https://felz-fitness-tracker.firebaseio.com",
  storageBucket: "felz-fitness-tracker.appspot.com",
  messagingSenderId: "838221349830"
};
firebase.initializeApp(config);

// Initialize array of date/weight measurements
var measurementArray = [];

// Get Firebase reference
var firebaseRef = firebase.database().ref();

// Create new date/weight measurement
$('#measurement-entry').on('submit', function (e) {
  e.preventDefault();

  var date = $('[name=date]').val();
  var weight = $('[name=weight]').val();
  var newMeasurement = {date, weight};
  console.log(newMeasurement);

  firebaseRef.child('measurements').push(newMeasurement);
});

// Get all measurements
var displayMeasurements = function (snapshot) {
  console.log('from firebase', snapshot.val());
  var meas = snapshot.val();
  measurementArray.push(meas);
  return buildChart(measurementArray);
};
// firebaseRef.child('measurements').once('value', displayMeasurements);

// Get newest measurement when added
firebaseRef.child('measurements').on('child_added', displayMeasurements);
