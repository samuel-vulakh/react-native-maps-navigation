/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useRef, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewNavigation, { NavigationModes, TravelModes } from 'react-native-maps-navigation-ts';

// Replace with your Google Maps API key
const GOOGLE_MAPS_APIKEY = '';

function App(): React.JSX.Element {
  const mapRef = useRef<MapView>(null);
  const [navigationMode, setNavigationMode] = useState(NavigationModes.IDLE);
  const [step, setStep] = useState<any>(null);
  const [simulate, setSimulate] = useState(false);

  // San Francisco coordinates
  const origin = {
    latitude: 37.78825,
    longitude: -122.4324,
  };

  // Los Angeles coordinates
  const destination = {
    latitude: 34.0522,
    longitude: -118.2437,
  };

  const handleRouteChange = (route: any) => {
    console.log('Route changed:', route.summary);
  };

  const handleStepChange = (step: any, nextStep: any) => {
    if (step) {
      setStep(step);
      console.log('Step changed:', step.instructions);
    }
  };

  const handleNavigationStarted = () => {
    console.log('Navigation started!');
  };

  const handleNavigationCompleted = () => {
    console.log('Navigation completed!');
    setNavigationMode(NavigationModes.IDLE);
  };

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: origin.latitude,
          longitude: origin.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        provider={PROVIDER_GOOGLE}
      >
        <MapViewNavigation
          apiKey={GOOGLE_MAPS_APIKEY}
          origin={origin}
          destination={destination}
          navigationMode={navigationMode}
          travelMode={TravelModes.DRIVING}
          map={() => mapRef.current!}
          simulate={simulate}
          onRouteChange={handleRouteChange}
          onStepChange={handleStepChange}
          onNavigationStarted={handleNavigationStarted}
          onNavigationCompleted={handleNavigationCompleted}
        />
      </MapView>

      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setNavigationMode(NavigationModes.ROUTE)}
        >
          <Text style={styles.buttonText}>Show Route</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setNavigationMode(NavigationModes.NAVIGATION);
          }}
        >
          <Text style={styles.buttonText}>Start Navigation</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setSimulate(!simulate)}
        >
          <Text style={styles.buttonText}>
            {simulate ? 'Disable Simulation' : 'Enable Simulation'}
          </Text>
        </TouchableOpacity>
      </View>

      {step && (
        <View style={styles.stepContainer}>
          <Text style={styles.stepText}>{step.instructions}</Text>
          <Text style={styles.distanceText}>
            {step.distance.text} • {step.duration.text}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  controls: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  stepContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    padding: 15,
  },
  stepText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  distanceText: {
    marginTop: 5,
    color: 'black',
  },
});

export default App;
