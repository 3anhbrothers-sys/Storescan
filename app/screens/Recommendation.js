import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function Recommendation() {
  // Dummy data - we'll replace this with real data later
  const stores = [
    {
      name: 'Target',
      distance: '0.8 mi',
      totalPrice: '$8.47',
      recommended: true,
    },
    {
      name: 'Walmart',
      distance: '0.5 mi',
      totalPrice: '$9.12',
      recommended: true,
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Ask AI</Text>
      </View>

      {/* AI Response Section */}
      <View style={styles.responseSection}>
        <Text style={styles.responseTitle}>Recommendations</Text>
        <Text style={styles.responseText}>
          Based on your search for "Milk and eggs", Target is the best combination of price and availability
        </Text>
      </View>

      {/* Store Cards */}
      {stores.map((store, index) => (
        <View key={index} style={styles.storeCard}>
          <View style={styles.storeHeader}>
            <Text style={styles.storeName}>{store.name}</Text>
            {store.recommended && (
              <View style={styles.recommendedBadge}>
                <Text style={styles.recommendedText}>Recommended</Text>
              </View>
            )}
          </View>

          <View style={styles.storeDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Distance</Text>
              <Text style={styles.detailValue}>{store.distance}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Total Price</Text>
              <Text style={styles.detailValue}>{store.totalPrice}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.viewStoreButton}>
            <Text style={styles.viewStoreButtonText}>View Store</Text>
          </TouchableOpacity>
        </View>
      ))}
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
    paddingTop: 60,
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  responseSection: {
    backgroundColor: '#2a2a2a',
    margin: 15,
    padding: 20,
    borderRadius: 12,
  },
  responseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  responseText: {
    fontSize: 14,
    color: '#aaa',
    lineHeight: 20,
  },
  storeCard: {
    backgroundColor: '#2a2a2a',
    margin: 15,
    marginTop: 10,
    padding: 20,
    borderRadius: 12,
  },
  storeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  storeName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  recommendedBadge: {
    backgroundColor: '#4A7FC1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  recommendedText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  storeDetails: {
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 16,
    color: '#aaa',
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
  viewStoreButton: {
    backgroundColor: '#4A7FC1',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  viewStoreButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});