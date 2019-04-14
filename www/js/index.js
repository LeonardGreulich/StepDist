/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        var onIsReadyToStart = function(isReadyToStartEvent) {
            if (isReadyToStartEvent["isReadyToStart"]) {
                document.getElementById("info-box").setAttribute("status", "on");
                document.getElementById("ready-to-start").innerHTML = "Ready to start";
            } else {
                document.getElementById("info-box").setAttribute("status", "off");
                document.getElementById("ready-to-start").innerHTML = "Ready to start only when outside";
            }
        }

        document.addEventListener("isreadytostart", onIsReadyToStart, false);

        var onLastCalibration = function(lastCalibrationEvent) {
            if (!lastCalibrationEvent["debugInfo"] == "") {
                document.getElementById("debug-info").innerHTML = lastCalibrationEvent["debugInfo"]
            } else {
                document.getElementById("debug-info").innerHTML = ""
            }
            document.getElementById("last-calibrated").innerHTML = "Last calibration: " + lastCalibrationEvent["lastCalibrated"]
            document.getElementById("step-length").innerHTML = "Step length: " + lastCalibrationEvent["stepLength"]
            document.getElementById("body-height").innerHTML = "Body height: " + lastCalibrationEvent.bodyHeight
        }

        document.addEventListener("lastcalibration", onLastCalibration, false);

        var distanceTraveledListening = false;

        var onDistanceTraveled = function(distanceTraveledEvent) {
            document.getElementById("distance-traveled-paragraph").innerHTML = distanceTraveledEvent[0]["distanceTraveled"]
            document.getElementById("steps-taken-paragraph").innerHTML = distanceTraveledEvent[0]["stepsTaken"]
            document.getElementById("altitude-gain-paragraph").innerHTML = distanceTraveledEvent[0]["relativeAltitudeGain"]
        }

        document.getElementById("toggle-measuring-distance-button").onclick = function() {
            if (!distanceTraveledListening) {
                document.addEventListener("distancetraveled", onDistanceTraveled, false);
                document.getElementById("toggle-measuring-distance-button").innerHTML = "Stop"
                distanceTraveledListening = true;
            } else {
                document.removeEventListener("distancetraveled", onDistanceTraveled, false);
                document.getElementById("toggle-measuring-distance-button").innerHTML = "Start"
                distanceTraveledListening = false;
            }
        }
    },
};

app.initialize();
