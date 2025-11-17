import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';

export default function AskAI() {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (question.trim()) {
      setLoading(true);
      // We'll add OpenAI call here next
      console.log('Submitting question:', question);
      
      // Temporary: simulate loading
      setTimeout(() => {
        setLoading(false);
        // Navigate to recommendations screen (we'll add this later)
      }, 2000);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Ask AI</Text>
      </View>

      {/* Input Section */}
      <View style={styles.content}>
        <TextInput
          style={styles.textInput}
          placeholder="Ask the AI about stores or products..."
          placeholderTextColor="#888"
          value={question}
          onChangeText={setQuestion}
          multiline
        />
        
        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
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
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});