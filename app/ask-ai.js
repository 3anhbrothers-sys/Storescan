import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { getStoreRecommendation } from './api/openai';

export default function AskAI() {
  const router = useRouter();
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    // Make sure user typed something
    if (question.trim()) {
      setLoading(true);
      
      try {
        // Call the OpenAI API
        const response = await getStoreRecommendation(question);
        
        console.log('Got response from AI:', response);
        
        // Go to the recommendations page with the data
        router.push({
          pathname: '/recommendations',
          params: { 
            aiResponse: JSON.stringify(response),
            userQuestion: question 
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
        <Text style={styles.headerText}>Ask AI</Text>
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
  },
  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  content: {
    padding: 20,
    marginTop: 40,
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
});