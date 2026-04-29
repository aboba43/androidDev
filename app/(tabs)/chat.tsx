import { FontAwesome } from '@expo/vector-icons';
import Constants from 'expo-constants';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useSelector } from 'react-redux';


let N8N_WEBHOOK_URL = 'http://localhost:5678/webhook/ask-ai';

const debuggerHost = Constants.expoConfig?.hostUri;
if (N8N_WEBHOOK_URL.includes('localhost')) {
  if (debuggerHost) {
    const ip = debuggerHost.split(':')[0];
    N8N_WEBHOOK_URL = N8N_WEBHOOK_URL.replace('localhost', ip);
  } else if (Platform.OS === 'android') {
    N8N_WEBHOOK_URL = N8N_WEBHOOK_URL.replace('localhost', '10.0.2.2');
  }
}

export default function ChatScreen() {
  const user = useSelector((state: any) => state.user);
  const userId = user?.email || 'guest_user';

  const [messages, setMessages] = useState([
    { id: '1', text: 'Привіт! Я ваш ШІ-тренер. Я можу допомогти вам з планом тренувань, харчуванням або відповісти на будь-які питання.', sender: 'bot' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
    };


    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      if (N8N_WEBHOOK_URL) {

        const response = await fetch(N8N_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: userMessage.text,
            userId: userId
          }),
        });

        let replyText = "Отримано порожню відповідь від ШІ.";

        try {
          const responseText = await response.text();
          try {
            const data = JSON.parse(responseText);
            // Підтримка різних полів, які може повертати n8n
            replyText = data.reply || data.output || data.text || data.message || responseText;
          } catch (e) {
            // Якщо це не JSON, просто використовуємо текст
            replyText = responseText;
          }
        } catch (e) {
          console.error("Error reading response:", e);
        }

        const botMessage = {
          id: (Date.now() + 1).toString(),
          text: replyText,
          sender: 'bot',
        };
        setMessages((prev) => [...prev, botMessage]);

      } else {

        setTimeout(() => {
          const mockBotMessage = {
            id: (Date.now() + 1).toString(),
            text: `Це тестова відповідь від ШІ на ваше повідомлення: "${userMessage.text}". Вставте N8N_WEBHOOK_URL у коді, щоб підключити справжнього бота.`,
            sender: 'bot',
          };
          setMessages((prev) => [...prev, mockBotMessage]);
          setIsTyping(false);
        }, 1500);
        return;
      }
    } catch (error: any) {
      console.error('Error fetching from n8n:', error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        text: `Помилка: ${error.message || "сталася помилка з'єднання з ШІ сервером."}`,
        sender: 'bot',
      };
      setMessages((prev) => [...prev, errorMessage]);
    }

    setIsTyping(false);
  };

  const renderMessage = ({ item }: { item: any }) => {
    const isUser = item.sender === 'user';
    return (
      <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.botBubble]}>
        <Text style={[styles.messageText, isUser ? styles.userText : styles.botText]}>
          {item.text}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>ШІ Тренер</Text>
        </View>

        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        {isTyping && (
          <View style={styles.typingIndicator}>
            <ActivityIndicator size="small" color="#007bff" />
            <Text style={styles.typingText}>ШІ друкує...</Text>
          </View>
        )}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Напишіть повідомлення..."
            placeholderTextColor="#888"
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <TouchableOpacity
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={!inputText.trim()}
          >
            <FontAwesome name="send" size={20} color={inputText.trim() ? "#fff" : "#ccc"} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    padding: 15,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  messageList: {
    padding: 15,
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 10,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#007bff',
    borderBottomRightRadius: 4,
  },
  botBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#e9ecef',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: '#fff',
  },
  botText: {
    color: '#333',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  typingText: {
    marginLeft: 8,
    color: '#666',
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 16,
    maxHeight: 100,
    color: '#333',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    marginBottom: 2,
  },
  sendButtonDisabled: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
});
