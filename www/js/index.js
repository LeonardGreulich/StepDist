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
        var parentElement = document.getElementById('deviceready');
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        var onIsReadyToStart = function(isReadyToStartEvent) {
            if (isReadyToStartEvent["isReadyToStart"]) {
                document.getElementById("ready-to-start").setAttribute("status", "on");
            } else {
                document.getElementById("ready-to-start").setAttribute("status", "off");
            }
        }

        document.addEventListener("isreadytostart", onIsReadyToStart, false);

        var onLastCalibration = function(lastCalibrationEvent) {
            if (lastCalibrationEvent["isCalibrating"]) {
                document.getElementById("currently-calibrating").innerHTML = "Currently calibrating"
            } else {
                document.getElementById("currently-calibrating").innerHTML = "Currently not calibrating"
            }
            document.getElementById("last-calibrated").innerHTML = "Last calibrated: " + lastCalibrationEvent["lastCalibrated"]
            document.getElementById("step-length").innerHTML = "Step length: " + lastCalibrationEvent["stepLength"]
        }

        document.addEventListener("lastcalibration", onLastCalibration, false);

        var distanceTraveledListening = false;

        var onDistanceTraveled = function(distanceTraveledEvent) {
            document.getElementById("distance-traveled-paragraph").innerHTML = "Distance: " + distanceTraveledEvent[0]["distanceTraveled"]
            document.getElementById("steps-taken-paragraph").innerHTML = "Steps: " + distanceTraveledEvent[0]["stepsTaken"]
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
