import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getStoreRecommendation } from './api/openai';

export default function AskAI() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const userLocation = params.userLocation || 'Richardson, TX'; // fallback
  
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (question.trim()) {
      setLoading(true);
      
      try {
        // Pass both question AND location to the API
        const response = await getStoreRecommendation(question, userLocation);
        
        console.log('Got response from AI:', response);
        
        router.push({
          pathname: '/recommendations',
          params: { 
            aiResponse: JSON.stringify(response),
            userQuestion: question,
            userLocation: userLocation
          }
        });
        
      } catch (error) {
        console.error('Something went wrong:', error);
        Alert.alert('Error', 'Failed to get AI response. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>← Change Location</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>Ask AI</Text>
        <View style={styles.backButton} />
      </View>

      {/* Show user's location */}
      <View style={styles.locationBadge}>
        <Text style={styles.locationIcon}>📍</Text>
        <Text style={styles.locationText}>{userLocation}</Text>
      </View>

      <View style={styles.content}>
        <TextInput
          style={styles.textInput}
          placeholder="e.g., Where can I buy milk, eggs, and bread?"
          placeholderTextColor="#888"
          value={question}
          onChangeText={setQuestion}
          multiline
        />
        
        <TouchableOpacity 
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="white" />
              <Text style={styles.loadingText}>Getting AI response...</Text>
            </View>
          ) : (
            <Text style={styles.submitButtonText}>Submit</Text>
          )}
        </TouchableOpacity>

        {/* Canned Questions */}
        <View style={styles.cannedQuestionsSection}>
          <Text style={styles.cannedQuestionsTitle}>Quick Questions:</Text>
          
          <TouchableOpacity 
            style={styles.cannedQuestionButton}
            onPress={() => setQuestion("Where can I buy milk and eggs?")}
          >
            <Text style={styles.cannedQuestionText}>Where can I buy milk and eggs?</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.cannedQuestionButton}
            onPress={() => setQuestion("What's the best store for fresh produce?")}
          >
            <Text style={styles.cannedQuestionText}>What's the best store for fresh produce?</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.cannedQuestionButton}
            onPress={() => setQuestion("Where can I find organic groceries nearby?")}
          >
            <Text style={styles.cannedQuestionText}>Where can I find organic groceries nearby?</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.cannedQuestionButton}
            onPress={() => setQuestion("Best deal on chicken, rice, and vegetables?")}
          >
            <Text style={styles.cannedQuestionText}>Best deal on chicken, rice, and vegetables?</Text>
          </TouchableOpacity>
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
    paddingTop: 60,
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    width: 120,
  },
  backButtonText: {
    color: '#4A7FC1',
    fontSize: 14,
    fontWeight: '600',
  },
  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    flex: 1,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2a2a2a',
    marginHorizontal: 20,
    marginTop: 15,
    padding: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#4A7FC1',
  },
  locationIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  locationText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    padding: 20,
    marginTop: 20,
  },
  textInput: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 20,
    fontSize: 16,
    color: 'white',
    minHeight: 120,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#4A7FC1',
    padding: 18,
    borderRadius: 25,
    marginTop: 20,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  loadingText: {
    color: 'white',
    fontSize: 14,
    marginLeft: 10,
  },
  cannedQuestionsSection: {
    marginTop: 30,
  },
  cannedQuestionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 15,
  },
  cannedQuestionButton: {
    backgroundColor: '#2a2a2a',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#4A7FC1',
  },
  cannedQuestionText: {
    color: 'white',
    fontSize: 14,
  },
});
