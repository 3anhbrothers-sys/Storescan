import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, Animated, FlatList } from 'react-native';

export default function App() {
  const [page, setPage] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [searchMode, setSearchMode] = useState(false);
  const [items, setItems] = useState([]);

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
  //these sample lists are just for the demo; they'd ideally be populated by
  //actual supermarket items
  const sampleData = [
    { id: '1', name: 'Item One', distance: '1.2 km', price: '$9.99' },
    { id: '2', name: 'Item Two', distance: '3.4 km', price: '$12.49' },
    { id: '3', name: 'Item Three', distance: '0.8 km', price: '$7.50' },
    { id: '4', name: 'Item Four', distance: '2.1 km', price: '$15.00' },
    { id: '5', name: 'Item Five', distance: '4.7 km', price: '$22.00' },
    { id: '6', name: 'Item Six', distance: '1.6 km', price: '$5.00' },
    { id: '7', name: 'Item Seven', distance: '2.9 km', price: '$18.99' },
  ];
  const buttonList = [
    { id: '1', label: 'Add Item 1' },
    { id: '2', label: 'Add Item 2' },
    { id: '3', label: 'Add Item 3' },
    { id: '4', label: 'Add Item 4' },
    { id: '5', label: 'Add Item 5' },
    { id: '6', label: 'Add Item 6' },
    { id: '7', label: 'Add Item 7' },
  ];
  const addNewItem = () => {
    setItems(prev => [
      ...prev,
      {
        id: String(prev.length + 1),
        name: `Item ${prev.length + 1}`,
        distance: `${(Math.random() * 5).toFixed(1)} km`,
        price: `$${(Math.random() * 20 + 5).toFixed(2)}`
      }
    ]);
  };
  // yay renderingggg!!!
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
              //buttons!!!
              <Text style={styles.text}>Search Results</Text>

              <FlatList
                data={buttonList}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ width: '100%', paddingTop: 20 }}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.bigButton}
                    onPress={addNewItem}
                  >
                    <Text style={styles.bigButtonText}>{item.label}</Text>
                  </TouchableOpacity>
                )}
              />

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

          {/* Centered group */}
          <View style={styles.centeredSearchGroup}>
            <Text style={styles.text}>Search Here</Text>
            <Image source={require('./assets/search.png')} />
          </View>
        </View>
        );

      case 1:
        return (
          <View style={[styles.page, { backgroundColor: '#2a2a2a', paddingTop: 0 }]}>
            
            <View style={styles.listHeader}>
              <Text style={styles.listHeaderText}>Shopping List</Text>
              <View style={styles.listHeaderBar} />
            </View>

            <FlatList
              data={items}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingVertical: 10, paddingHorizontal: 0 }}
              renderItem={({ item }) => (
                <View style={styles.listItem}>
                  <Image
                    source={require('./assets/star.png')}
                    style={styles.listImage}
                  />

                  <View style={styles.listTextContainer}>
                    <Text style={styles.listName}>{item.name}</Text>
                    <Text style={styles.listInfo}>Distance: {item.distance}</Text>
                    <Text style={styles.listInfo}>Price: {item.price}</Text>
                  </View>
                </View>
              )}
            />

          </View>
        );

      case 2:
        return (
          <View style={[styles.page, { backgroundColor: '#333', paddingTop: 0 }]}>
            <Image 
              source={require('./assets/ask_ai.png')} 
              style={styles.fullScreenImage}
            />
          </View>
        );

      case 3:
        return (
          <View style={[styles.page, { backgroundColor: '#444', paddingTop: 0 }]}>
            <Image 
              source={require('./assets/login_placeholder.png')} 
              style={styles.fullScreenImage}
            />
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
    alignSelf: 'center',
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
  bigButton: {
    flexDirection: 'row',
    backgroundColor: '#4a7fc1',
    borderRadius: 14,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },

  bigButtonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  listItem: {
    flexDirection: 'row',
    backgroundColor: '#2f2f2f',
    borderRadius: 14,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },

  listImage: {
    width: 60,
    height: 60,
    marginRight: 20,
    tintColor: '#ffd700',
  },

  listTextContainer: {
    flex: 1,
  },

  listName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },

  listInfo: {
    color: '#ccc',
    fontSize: 16,
  },
  listHeader: {
    width: '100%',
    paddingTop: 40,
    paddingBottom: 12,
    paddingHorizontal: 20,
    backgroundColor: '#2a2a2a',
  },

  listHeaderText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
  },

  listHeaderBar: {
    width: '100%',
    height: 3,
    backgroundColor: '#4a7fc1',
    borderRadius: 2,
  },
  centeredSearchGroup: {
    alignItems: 'center',
    marginTop: 30,
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});
