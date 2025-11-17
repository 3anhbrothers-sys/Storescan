import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function StoreDetails() {
  const params = useLocalSearchParams();
  const router = useRouter();
  
  // Get data from previous screen - NO DEFAULTS
  const storeName = params.storeName;
  const distance = params.distance;
  const totalPrice = params.totalPrice;
  
  // Parse products from JSON string
  let products = [];
  let hasError = false;
  
  try {
    if (params.products) {
      products = JSON.parse(params.products);
    }
  } catch (e) {
    console.error('Error parsing products:', e);
    hasError = true;
  }
  
  // Check if we have required data
  if (!storeName || !distance || !totalPrice || products.length === 0) {
    hasError = true;
  }

  // Error state
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
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>Store Data Unavailable</Text>
          <Text style={styles.errorMessage}>
            We couldn't load the store details. Please go back and try again.
          </Text>
          <TouchableOpacity 
            style={styles.errorButton}
            onPress={() => router.back()}
          >
            <Text style={styles.errorButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
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

      {/* Store Name Badge */}
      <View style={styles.storeNameContainer}>
        <View style={styles.storeNameBadge}>
          <Text style={styles.storeNameText}>{storeName}</Text>
        </View>
      </View>

      {/* Summary Card */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Distance</Text>
            <Text style={styles.summaryValue}>{distance}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total</Text>
            <Text style={styles.summaryValue}>{totalPrice}</Text>
          </View>
        </View>
      </View>

      {/* Products List */}
      <View style={styles.productsCard}>
        {products.map((product, index) => (
          <View key={index} style={styles.productRow}>
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productPrice}>{product.price}</Text>
            </View>
            {product.inStock && (
              <View style={styles.inStockBadge}>
                <Text style={styles.inStockText}>In Stock</Text>
              </View>
            )}
            {!product.inStock && (
              <View style={styles.outOfStockBadge}>
                <Text style={styles.outOfStockText}>Out of Stock</Text>
              </View>
            )}
          </View>
        ))}
      </View>

      {/* Add to Cart Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.addToCartButton}>
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
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
  storeNameContainer: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  storeNameBadge: {
    backgroundColor: '#4A7FC1',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 30,
  },
  storeNameText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  summaryCard: {
    backgroundColor: '#2a2a2a',
    margin: 20,
    padding: 25,
    borderRadius: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#aaa',
    fontWeight: '600',
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#444',
  },
  productsCard: {
    backgroundColor: '#2a2a2a',
    margin: 20,
    marginTop: 10,
    padding: 20,
    borderRadius: 12,
  },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  inStockBadge: {
    backgroundColor: '#2a4a2a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  inStockText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: '600',
  },
  outOfStockBadge: {
    backgroundColor: '#4a2a2a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  outOfStockText: {
    color: '#F44336',
    fontSize: 12,
    fontWeight: '600',
  },
  buttonContainer: {
    padding: 20,
  },
  addToCartButton: {
    backgroundColor: '#4A7FC1',
    padding: 18,
    borderRadius: 25,
    alignItems: 'center',
  },
  addToCartText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
