// Get Firebase reference
var firebaseRef = firebase.database().ref();
var measurementArray =[];


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


// ADD OR UPDATE MEASUREMENT
// --------------------
// Measurement posted
$('#measurement-entry').on('submit', function (e) {
  e.preventDefault();

  var date = $('[name=date]').val();
  var weight = $('[name=weight]').val();
  var newMeasurement = {date, weight};

  // Search firebase for any item with a matching date
  firebaseRef.child('measurements/').orderByChild('date').equalTo(date).once('value', function (snapshot) {
    var res = snapshot.val();

    if (res) {
      var id = Object.keys(res)[0];

      firebaseRef.child('measurements/' + id).update({
        weight: newMeasurement.weight
      });
    } else {
      firebaseRef.child('measurements').push(newMeasurement);
    }

    $('[name=date]').val('');
    $('[name=weight]').val('');

    firebaseRef.child('measurements').on('value', function (snapshot) {
      var measurements = snapshot.val();

      if (newMeasurement) {
        var parsedMeasurements = [];

        Object.keys(measurements).forEach(function (measurementId) {
          parsedMeasurements.push(measurements[measurementId]);
        });

        measurementArray = parsedMeasurements;
        updateChart(measurementArray);
        newMeasurement = undefined;
      }
    });
  });
});


// REMOVE MEASUREMENT
// --------------------
$('#remove-entry').on('submit', function (e) {
  e.preventDefault();
  var date = $('[name=remove]').val();

  // Search firebase for any item with a matching date
  firebaseRef.child('measurements/').orderByChild('date').equalTo(date).once('value', function (snapshot) {
    var res = snapshot.val();

    if (res) {
      var id = Object.keys(res)[0];
      firebaseRef.child('measurements/' + id).remove();

      // And then query the database
      firebaseRef.child('measurements').on('value', function (snapshot) {
        var measurements = snapshot.val();
        var parsedMeasurements = [];

        Object.keys(measurements).forEach(function (measurementId) {
          parsedMeasurements.push(measurements[measurementId]);
        });

        measurementArray = parsedMeasurements;
        updateChart(measurementArray);

        date = '';
        $('[name=remove]').val('');
      });
    }
  });
});
