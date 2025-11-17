import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, Animated } from 'react-native';

export default function App() {
  const [page, setPage] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [searchMode, setSearchMode] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const runAnimation = () => {
    fadeAnim.setValue(0.8);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    runAnimation();
  }, [page, searchMode]);

  const renderPage = () => {
    switch (page) {

      case 0:
        if (searchMode) {
          return (
            <View style={[styles.page, { backgroundColor: '#1a1a1a' }]}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => setSearchMode(false)}
              >
                <Text style={styles.backText}>← Back</Text>
              </TouchableOpacity>

              <Text style={styles.text}>Search Results</Text>
            </View>
          );
        }

        return (
          <View style={[styles.page, { backgroundColor: '#1a1a1a' }]}>
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search..."
                placeholderTextColor="#fff"
                value={searchText}
                onChangeText={setSearchText}
                onSubmitEditing={() => setSearchMode(true)}
              />
            </View>
            <Text style={styles.text}>Search Here</Text>
            <Image source={require('./assets/search.png')}/>
          </View>
        );

      case 1:
        return (
          <View style={[styles.page, { backgroundColor: '#2a2a2a' }]}>
            <Text style={styles.text}>Shopping list goes here</Text>
          </View>
        );

      case 2:
        return (
          <View style={[styles.page, { backgroundColor: '#333' }]}>
            <Text style={styles.text}>Page 2</Text>
          </View>
        );

      case 3:
        return (
          <View style={[styles.page, { backgroundColor: '#444' }]}>
            <Text style={styles.text}>Profile / Page 3</Text>
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
          }
        ]}
      >
        {renderPage()}
      </Animated.View>

      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navButton} onPress={() => setPage(0)}>
          <Image source={require('./assets/search.png')} style={styles.icon} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={() => setPage(1)}>
          <Image source={require('./assets/cart.png')} style={styles.icon} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={() => setPage(2)}>
          <Image source={require('./assets/star.png')} style={styles.icon} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={() => setPage(3)}>
          <Image source={require('./assets/profile.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
  },
  page: {
    flex: 1,
    paddingTop: 50,
    alignItems: 'center',
  },
  text: {
    marginTop: 20,
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
  },

  icon: {
    width: 36,
    height: 36,
    tintColor: '#fff',
  },

  searchContainer: {
    width: '90%',
  },
  searchInput: {
    backgroundColor: '#4a7fc1',
    borderRadius: 10,
    padding: 24,
    fontSize: 16,
  },

  navBar: {
    flexDirection: 'row',
    backgroundColor: '#222',
    paddingVertical: 10,
    borderTopWidth: 2,
    borderTopColor: '#222',
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
  },

  backButton: {
    position: 'absolute',
    top: 20,
    left: 15,
    padding: 10,
  },
  backText: {
    color: '#fff',
    fontSize: 20,
  },
  sampleButton: {
  marginTop: 40,
  backgroundColor: '#4a7fc1',
  paddingVertical: 12,
  paddingHorizontal: 30,
  borderRadius: 10,
  },
  sampleButtonText: {
  color: '#fff',
  fontSize: 18,
  fontWeight: 'bold',
  },
});
