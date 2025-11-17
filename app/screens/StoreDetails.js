import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function StoreDetails() {
  // Dummy data - we'll pass real data later
  const storeInfo = {
    name: 'Target',
    distance: '0.8 Mi',
    totalPrice: '$8.47',
    products: [
      { name: 'Milk (1 gallon)', price: '$3.49', inStock: true },
      { name: 'Eggs (1 carton)', price: '$4.98', inStock: true },
    ],
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Ask AI</Text>
      </View>

      {/* Store Name Badge */}
      <View style={styles.storeNameContainer}>
        <View style={styles.storeNameBadge}>
          <Text style={styles.storeNameText}>{storeInfo.name}</Text>
        </View>
      </View>

      {/* Summary Card */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Distance</Text>
            <Text style={styles.summaryValue}>{storeInfo.distance}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total</Text>
            <Text style={styles.summaryValue}>{storeInfo.totalPrice}</Text>
          </View>
        </View>
      </View>

      {/* Products List */}
      <View style={styles.productsCard}>
        {storeInfo.products.map((product, index) => (
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