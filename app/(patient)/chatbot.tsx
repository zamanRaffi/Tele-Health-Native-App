import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Stack } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import Colors from '../../constants/colors';
import { GEMINI_API_KEY } from '@env';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatbotScreen() {
  const { user } = useApp();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hello ${user?.name || 'there'}! I'm your health assistant. I can provide general wellbeing tips and health guidance. How can I help you today?`,
    },
  ]);

  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Gemini API call
  const askGemini = async (prompt: string): Promise<string> => {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );
      const data = await response.json();
      return data?.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't understand that. Try again!";
    } catch (err) {
      console.error('Gemini API Error:', err);
      return 'Sorry, something went wrong. Please try again later.';
    }
  };

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    const aiReply = await askGemini(userMessage.content);

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: aiReply,
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsLoading(false);

    // Scroll to bottom after small delay
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Health Assistant',
          headerStyle: { backgroundColor: Colors.light.background },
          headerShadowVisible: false,
        }}
      />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={{ flexGrow: 1, padding: 16, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageWrapper,
                message.role === 'user'
                  ? styles.userMessageWrapper
                  : styles.assistantMessageWrapper,
              ]}
            >
              <View
                style={[
                  styles.iconContainer,
                  message.role === 'user' ? styles.userIcon : styles.assistantIcon,
                ]}
              >
                <Feather name={message.role === 'user' ? 'user' : 'cpu'} size={16} color="#fff" />
              </View>
              <View
                style={[
                  styles.messageBubble,
                  message.role === 'user' ? styles.userMessage : styles.assistantMessage,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    message.role === 'user'
                      ? styles.userMessageText
                      : styles.assistantMessageText,
                  ]}
                >
                  {message.content}
                </Text>
              </View>
            </View>
          ))}

          {isLoading && (
            <View style={styles.messageWrapper}>
              <View style={[styles.iconContainer, styles.assistantIcon]}>
                <Feather name="cpu" size={16} color="#fff" />
              </View>
              <View style={[styles.messageBubble, styles.assistantMessage]}>
                <Text style={styles.assistantMessageText}>Thinking...</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input Box */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ask about health tips, symptoms, wellness..."
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
            placeholderTextColor={Colors.light.textSecondary}
            editable={!isLoading}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!inputText.trim() || isLoading) && styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            disabled={!inputText.trim() || isLoading}
          >
            <Feather
              name="send"
              size={20}
              color={!inputText.trim() || isLoading ? '#94A3B8' : '#fff'}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background,paddingTop:100 },
  messagesContainer: { flex: 1 },
  messageWrapper: { flexDirection: 'row', marginBottom: 16, alignItems: 'flex-start' },
  userMessageWrapper: { justifyContent: 'flex-end' },
  assistantMessageWrapper: { justifyContent: 'flex-start' },
  iconContainer: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginTop: 4 },
  userIcon: { backgroundColor: Colors.light.primary, marginLeft: 8 },
  assistantIcon: { backgroundColor: '#6366F1', marginRight: 8 },
  messageBubble: { maxWidth: '75%', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 16 },
  userMessage: { backgroundColor: Colors.light.primary, borderBottomRightRadius: 4 },
  assistantMessage: { backgroundColor: '#F1F5F9', borderBottomLeftRadius: 4 },
  messageText: { fontSize: 15, lineHeight: 22 },
  userMessageText: { color: '#fff' },
  assistantMessageText: { color: Colors.light.text },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: Colors.light.card,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    alignItems: 'flex-end',
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.light.background,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    maxHeight: 100,
    color: Colors.light.text,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  sendButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.light.primary, justifyContent: 'center', alignItems: 'center' },
  sendButtonDisabled: { backgroundColor: '#E2E8F0' },
});
