import CoreLocation
import CoreMotion

@objc(stepdistplugin) class stepdistplugin : CDVPlugin, CLLocationManagerDelegate {
    
    var locationManager: CLLocationManager!
    var pedometer: CMPedometer!
    var pluginInfoEventCallbackId: String!
    var distanceEventCallbackId: String!
    var distanceFilter: Int!
    var accuracyFilter: Int!
    
    @objc(startLocalization:) func startLocalization(command: CDVInvokedUrlCommand) {
        pluginInfoEventCallbackId = command.callbackId
        
        guard let arguments = command.arguments.first as? [String: Any] else {
            return
        }
        
        if let distanceFilter = arguments["distanceFilter"] as? Int, let accuracyFilter = arguments["accuracyFilter"] as? Int {
            self.distanceFilter = distanceFilter
            self.accuracyFilter = accuracyFilter
        } else {
            return
        }
    
        if locationManager == nil {
            locationManager = CLLocationManager()
        }
        
        if pedometer == nil {
            pedometer = CMPedometer()
        }
        
        locationManager.delegate = self
        locationManager.desiredAccuracy = kCLLocationAccuracyBest
        locationManager.distanceFilter = Double(distanceFilter)
        locationManager.allowsBackgroundLocationUpdates = true
        locationManager.requestWhenInUseAuthorization()
        locationManager.startUpdatingLocation()
        
        let pluginResult = CDVPluginResult(
            status: CDVCommandStatus_OK,
            messageAs: createPluginInfo(9999.0)
        )
        pluginResult?.setKeepCallbackAs(true)
        
        self.commandDelegate!.send(
            pluginResult,
            callbackId: command.callbackId
        )
    }

    @objc(stopLocalization:) func stopLocalization(command: CDVInvokedUrlCommand) {
        locationManager.stopUpdatingLocation();
        locationManager = nil
        
        let pluginResult = CDVPluginResult(
            status: CDVCommandStatus_OK
        )
        
        self.commandDelegate!.send(
            pluginResult,
            callbackId: command.callbackId
        )
    }
    
    @objc(startMeasuringDistance:) func startMeasuringDistance(command: CDVInvokedUrlCommand) {     
        distanceEventCallbackId = command.callbackId
        
        pedometer.startUpdates(from: Date(), withHandler: { (data, error) in
            if let pedometerData = data {
                
            }
        })
        
        let pluginResult = CDVPluginResult(
            status: CDVCommandStatus_OK,
            messageAs: "Distance measuring started"
        )
        pluginResult?.setKeepCallbackAs(true)
        
        self.commandDelegate!.send(
            pluginResult,
            callbackId: distanceEventCallbackId
        )
    }

    @objc(stopMeasuringDistance:) func stopMeasuringDistance(command: CDVInvokedUrlCommand) {     
        distanceEventCallbackId = nil
        
        pedometer.stopUpdates()
        
        let pluginResult = CDVPluginResult(
            status: CDVCommandStatus_OK,
            messageAs: "Distance measuring stopped"
        )
        
        self.commandDelegate!.send(
            pluginResult,
            callbackId: command.callbackId
        )
    }
    
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        print("Location accuracy: \(locations.last?.horizontalAccuracy ?? 9999.0)")

        if pluginInfoEventCallbackId != nil {
            let pluginInfo = createPluginInfo(locations.last!.horizontalAccuracy)
            
            let pluginResult = CDVPluginResult(
                status: CDVCommandStatus_OK,
                messageAs: pluginInfo
            )
            pluginResult?.setKeepCallbackAs(true)
            
            self.commandDelegate!.send(
                pluginResult,
                callbackId: pluginInfoEventCallbackId
            )
        }
        
        if distanceEventCallbackId != nil {
            let pluginResult = CDVPluginResult(
                status: CDVCommandStatus_OK,
                messageAs: "New Distance Event"
            )
            pluginResult?.setKeepCallbackAs(true)
            
            self.commandDelegate!.send(
                pluginResult,
                callbackId: distanceEventCallbackId
            )
        }
    }
    
    func createPluginInfo(_ accuracy: Double) -> [String : Any] {
        var isReadyToStart = false;
        
        if (accuracy <= Double(accuracyFilter) + 0.01) {
            isReadyToStart = true;
        }
        
        let pluginInfo: [String : Any] = ["isReadyToStart": isReadyToStart, "lastCalibrated": "Placeholder", "stepLength": "Placeholder"]
        return pluginInfo
    }
    
}
