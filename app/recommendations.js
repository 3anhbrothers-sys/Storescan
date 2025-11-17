import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function Recommendation() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [feedback, setFeedback] = useState(null);
  
  // Get the data that was passed from the previous screen
  const aiResponseRaw = params.aiResponse;
  
  let aiData = { summary: '', stores: [] };
  let hasError = false;
  
  // Try to parse the JSON data from AI
  try {
    if (aiResponseRaw) {
      const parsed = typeof aiResponseRaw === 'string' ? JSON.parse(aiResponseRaw) : aiResponseRaw;
      aiData = parsed;
    } else {
      hasError = true;
    }
  } catch (error) {
    console.error('Error reading AI response:', error);
    hasError = true;
  }
  
  const stores = aiData.stores || [];
  const summary = aiData.summary;
  
  // Make sure we got valid data
  if (!summary || stores.length === 0) {
    hasError = true;
  }

  // Show error message if something went wrong
  if (hasError) {
    return (
      <View style={styles.errorContainer}>
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
        
        <View style={styles.errorContent}>
          <Text style={styles.errorIcon}>❌</Text>
          <Text style={styles.errorTitle}>No Results Found</Text>
          <Text style={styles.errorMessage}>
            We couldn't find any recommendations for your search. Please try asking a different question.
          </Text>
          <TouchableOpacity 
            style={styles.errorButton}
            onPress={() => router.back()}
          >
            <Text style={styles.errorButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
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

      {/* Show the AI's summary */}
      <View style={styles.responseSection}>
        <Text style={styles.responseTitle}>Recommendations</Text>
        <Text style={styles.responseText}>{summary}</Text>
      </View>

      {/* Show each store as a card */}
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
  errorContainer: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  errorContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorIcon: {
    fontSize: 60,
    marginBottom: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  errorButton: {
    backgroundColor: '#4A7FC1',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  errorButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
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
