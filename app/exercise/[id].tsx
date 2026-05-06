import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { updateRecord } from '../../store/userSlice';
import { saveRecords } from '../../utils/database';

const exerciseData = {
  bench: {
    title: 'Жим лежачи',
    image: require('./benchpress.png'),
    tips: [
      'Тримайте лопатки зведеними разом і опущеними вниз протягом усього руху.',
      'Використовуйте "міст" для зменшення амплітуди та захисту плечей, але сідниці мають торкатися лави.',
      'Ступні повинні щільно впиратися в підлогу (leg drive) для передачі зусилля.',
      'Опускайте штангу на низ грудей/сонячне сплетіння, лікті під кутом 45-60 градусів до тіла.',
    ]
  },
  squat: {
    title: 'Присяд зі штангою',
    image: require('./squat.png'),
    tips: [
      'Штанга повинна рухатися чітко над серединою стопи. Тримайте баланс.',
      'Глибокий вдих перед початком руху і затримка дихання (маневр Вальсальви) для стабілізації кора.',
      'Коліна повинні рухатися в напрямку носків, не зводьте їх всередину під час підйому.',
      'Опускайтеся хоча б до паралелі стегна з підлогою для повного включення сідничних м\'язів.',
    ]
  },
  deadlift: {
    title: 'Станова тяга',
    image: require('./deadlift.png'),
    tips: [
      'Гриф має знаходитися над серединою стопи на старті і ковзати по гомілках під час підйому.',
      'Спина має бути абсолютно рівною і жорстко зафіксованою. Жодних круглих попереків!',
      'Рух починається з відштовхування ногами від підлоги ("жим ногами"), а не з витягування спиною.',
      'Шия повинна бути в нейтральному положенні (не задирайте голову занадто високо).',
    ]
  }
};

export default function ExerciseScreen() {
  const { id } = useLocalSearchParams();
  const dispatch = useDispatch();

  const data = exerciseData[id as keyof typeof exerciseData];
  const records = useSelector((state: any) => state.user.records);
  const currentRecord = records ? records[id as string] : 0;

  const [newValue, setNewValue] = useState(currentRecord ? currentRecord.toString() : '');

  if (!data) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Вправу не знайдено</Text>
        <TouchableOpacity onPress={() => router.back()}><Text>Назад</Text></TouchableOpacity>
      </SafeAreaView>
    );
  }

  const user = useSelector((state: any) => state.user);

  const handleSave = async () => {
    const val = parseFloat(newValue);
    if (!isNaN(val) && val >= 0) {
      dispatch(updateRecord({ exercise: id, value: val }));
      
      if (user.email) {
        const updatedRecords = { ...records, [id]: val };
        await saveRecords(
          user.email,
          updatedRecords.bench || 0,
          updatedRecords.squat || 0,
          updatedRecords.deadlift || 0
        );
      }
      
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{data.title}</Text>
          <View style={{ width: 28 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>

          <View style={styles.iconContainer}>
            <Image source={data.image} style={{ width: 120, height: 120, resizeMode: 'contain' }} />
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Ваш рекорд (кг)</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={newValue}
                onChangeText={setNewValue}
                placeholder="0"
                maxLength={4}
              />
              <Text style={styles.kgText}>кг</Text>
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Зберегти результат</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tipsContainer}>
            <Text style={styles.tipsTitle}> Рекомендації для техніки:</Text>
            {data.tips.map((tip, index) => (
              <View key={index} style={styles.tipItem}>
                <Text style={styles.tipBullet}>•</Text>
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: '#f5f7fa',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollContent: {
    padding: 20,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 30,
  },
  cardTitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 15,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 25,
  },
  input: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1a1a2e',
    textAlign: 'center',
    minWidth: 100,
    borderBottomWidth: 2,
    borderColor: '#e9ecef',
    paddingBottom: 5,
  },
  kgText: {
    fontSize: 24,
    color: '#666',
    marginLeft: 10,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tipsContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  tipBullet: {
    fontSize: 18,
    color: '#007bff',
    marginRight: 10,
    fontWeight: 'bold',
    lineHeight: 24,
  },
  tipText: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
    flex: 1,
  },
});
