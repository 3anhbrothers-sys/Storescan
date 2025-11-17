import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';

export default function LocationInput() {
  const router = useRouter();
  const [location, setLocation] = useState('');

  const handleContinue = () => {
    if (location.trim()) {
      // Pass location to the ask-ai screen
      router.push({
        pathname: '/ask-ai',
        params: { userLocation: location.trim() }
      });
    } else {
      Alert.alert('Location Required', 'Please enter your city or zip code to continue.');
    }
  };

  const quickLocations = [
    'Richardson, TX',
    'Dallas, TX',
    'Plano, TX',
    'Austin, TX',
    'Houston, TX'
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Store Finder</Text>
        <Text style={styles.subheaderText}>Find the best prices near you</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>Where are you shopping?</Text>
        <Text style={styles.hint}>Enter your city, state, or zip code</Text>
        
        <TextInput
          style={styles.textInput}
          placeholder="e.g., Richardson, TX or 75080"
          placeholderTextColor="#888"
          value={location}
          onChangeText={setLocation}
          autoCapitalize="words"
        />
        
        <TouchableOpacity 
          style={styles.continueButton}
          onPress={handleContinue}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>

        {/* Quick Location Buttons */}
        <View style={styles.quickLocationsSection}>
          <Text style={styles.quickLocationsTitle}>Quick Select:</Text>
          
          {quickLocations.map((loc, index) => (
            <TouchableOpacity 
              key={index}
              style={styles.quickLocationButton}
              onPress={() => setLocation(loc)}
            >
              <Text style={styles.quickLocationText}>{loc}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            💡 We'll use your location to find nearby stores with the best prices for your shopping list.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    padding: 20,
    paddingTop: 80,
    backgroundColor: '#1a1a1a',
  },
  headerText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  subheaderText: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
  },
  content: {
    padding: 20,
    marginTop: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 8,
  },
  hint: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 15,
  },
  textInput: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 20,
    fontSize: 18,
    color: 'white',
    borderWidth: 2,
    borderColor: '#4A7FC1',
  },
  continueButton: {
    backgroundColor: '#4A7FC1',
    padding: 18,
    borderRadius: 25,
    marginTop: 20,
    alignItems: 'center',
  },
  continueButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  quickLocationsSection: {
    marginTop: 40,
  },
  quickLocationsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 15,
  },
  quickLocationButton: {
    backgroundColor: '#2a2a2a',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#444',
  },
  quickLocationText: {
    color: 'white',
    fontSize: 16,
  },
  infoBox: {
    backgroundColor: '#2a2a2a',
    padding: 15,
    borderRadius: 10,
    marginTop: 30,
    borderLeftWidth: 4,
    borderLeftColor: '#4A7FC1',
  },
  infoText: {
    color: '#aaa',
    fontSize: 14,
    lineHeight: 20,
  },
});