var app = {
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    onDeviceReady: function() {
        var walkingDistanceListening = false;
        var bodyHeight = null;

        var showOptions = function() {
            var objectsToShow = document.getElementsByClassName("optional-settings");
            for (var i = 0; i < objectsToShow.length; i++) {
                objectsToShow[i].style.display = "inline";
            }
    
            var objectsToHide = document.getElementsByClassName("distance-step-data");
            for (var i = 0; i < objectsToHide.length; i++) {
                objectsToHide[i].style.display = "none";
            }
        }
    
        var hideOptions = function() {
            var objectsToShow = document.getElementsByClassName("distance-step-data");
            for (var i = 0; i < objectsToShow.length; i++) {
                objectsToShow[i].style.display = "inline";
            }
    
            var objectsToHide = document.getElementsByClassName("optional-settings");
            for (var i = 0; i < objectsToHide.length; i++) {
                objectsToHide[i].style.display = "none";
            }
        }

        hideOptions();

        var onStepDistStatusEvent = function(stepDistStatusEvent) {
            if (stepDistStatusEvent.isReadyToStart) {
                document.getElementById("info-box").setAttribute("status", "on");
                document.getElementById("ready-to-start").innerHTML = "Ready to start";
            } else {
                document.getElementById("info-box").setAttribute("status", "off");
                document.getElementById("ready-to-start").innerHTML = "Ready to start only when outside";
            }

            if (!stepDistStatusEvent.debugInfo == "") {
                document.getElementById("debug-info").innerHTML = stepDistStatusEvent["debugInfo"];
            } else {
                document.getElementById("debug-info").innerHTML = "";
            }

            document.getElementById("last-calibrated").innerHTML = "Last calibration: "
                + ((stepDistStatusEvent.lastCalibrated != null) ? stepDistStatusEvent.lastCalibrated : "--");
            document.getElementById("step-length").innerHTML = "Step length: "
                + ((stepDistStatusEvent.stepLength != null) ? stepDistStatusEvent.stepLength : "--");
            document.getElementById("body-height").innerHTML = "Body height: "
                + ((stepDistStatusEvent.bodyHeight != null) ? stepDistStatusEvent.bodyHeight : "--");
            bodyHeight = stepDistStatusEvent.bodyHeight;
        }

        document.addEventListener("stepdiststatus", onStepDistStatusEvent, false);

        var onWalkingDistanceEvent = function(walkingDistanceEvent) {
            document.getElementById("distance-traveled-paragraph").innerHTML = walkingDistanceEvent.distance;
            document.getElementById("steps-taken-paragraph").innerHTML = walkingDistanceEvent.steps;
            document.getElementById("altitude-gain-paragraph").innerHTML = walkingDistanceEvent.elevation;
        }

        document.getElementById("toggle-measuring-distance-button").onclick = function() {
            if (!walkingDistanceListening) {
                document.addEventListener("walkingdistance", onWalkingDistanceEvent, false);
                document.getElementById("toggle-measuring-distance-button").innerHTML = "Stop";
                walkingDistanceListening = true;
            } else {
                document.removeEventListener("walkingdistance", onWalkingDistanceEvent, false);
                document.getElementById("toggle-measuring-distance-button").innerHTML = "Start";
                walkingDistanceListening = false;
            }
        }

        document.getElementById("settings-button").onclick = function() {
            document.getElementById("toggle-measuring-distance-button").style.display = "none";
            document.getElementById("body-height-input").value = bodyHeight;
            showOptions();
        }

        document.getElementById("close-settings-button").onclick = function() {
            stepdist.setBodyHeight(Number(document.getElementById("body-height-input").value));
            if (document.getElementById("gps-calibration-checkbox").checked) {
                stepdist.disableGNSSCalibration();
            } else {
                stepdist.disableGNSSCalibration(false);
            }
            hideOptions();
            document.getElementById("toggle-measuring-distance-button").style.display = "inline";
        }

        document.getElementById("reset-data-button").onclick = function() {
            stepdist.resetData();
            document.getElementById("body-height-input").value = "";
        }
    }
};

app.initialize();
