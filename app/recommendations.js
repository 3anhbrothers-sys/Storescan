import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function Recommendation() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Get the AI response from the previous screen
  const aiResponseRaw = params.aiResponse;
  
  // Parse the JSON data
  let aiData = { summary: '', stores: [] };
  let hasError = false;
  
  try {
    if (aiResponseRaw) {
      const parsed = typeof aiResponseRaw === 'string' ? JSON.parse(aiResponseRaw) : aiResponseRaw;
      aiData = parsed;
    } else {
      hasError = true;
    }
  } catch (e) {
    console.error('Error parsing AI response:', e);
    hasError = true;
  }
  
  const stores = aiData.stores || [];
  const summary = aiData.summary;
  
  // Check if we have valid data
  if (!summary || stores.length === 0) {
    hasError = true;
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>Ask AI</Text>
        <View style={styles.backButton} />
      </View>

      {/* AI Response Section */}
      <View style={styles.responseSection}>
        <Text style={styles.responseTitle}>Recommendations</Text>
        <Text style={styles.responseText}>
          {summary}
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

          <TouchableOpacity 
            style={styles.viewStoreButton}
            onPress={() => router.push({
              pathname: '/store-details',
              params: { 
                storeName: store.name,
                distance: store.distance,
                totalPrice: store.totalPrice,
                products: JSON.stringify(store.products || [])
              }
            })}
          >
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    width: 60,
  },
  backButtonText: {
    color: '#4A7FC1',
    fontSize: 16,
    fontWeight: '600',
  },
  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    flex: 1,
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