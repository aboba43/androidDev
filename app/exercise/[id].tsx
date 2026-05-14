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
    auxiliaryExercises: [
      { id: 'bench-narrow', name: 'Жим лежачи вузьким хватом' },
      { id: 'bench-dumbbells', name: 'Жим гантелей лежачи на лаві' },
      { id: 'dips', name: 'Віджимання на брусах' },
      { id: 'seated-press', name: 'Жим сидячи' },
      { id: 'triceps-extension', name: 'Розгинання на трицепс' },
      { id: 'butterfly', name: 'Бабочка' },
    ]
  },
  squat: {
    title: 'Присяд зі штангою',
    image: require('./squat.png'),
    auxiliaryExercises: [
      { id: 'box-squat', name: 'Присідання на тумбу' },
      { id: 'leg-press', name: 'Жим ногами' },
      { id: 'dumbbell-lunges', name: 'Випади з гантелями' },
      { id: 'good-mornings', name: 'Нахили зі штангою' },
      { id: 'cable-pull', name: 'Тяга блока' },
    ]
  },
  deadlift: {
    title: 'Станова тяга',
    image: require('./deadlift.png'),
    auxiliaryExercises: [
      { id: 'romanian-deadlift', name: 'Румунська тяга (задня поверхня стегна/сідниці)' },
      { id: 'deficit-deadlift', name: 'Тяга з ями (зрив)' },
      { id: 'hyperextension', name: 'Гіперекстензія (розгиначі спини)' },
      { id: 'bent-over-row', name: 'Тяга в нахилі (найширші)' },
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
            <Text style={styles.tipsTitle}>Вправи для покращення рекорду:</Text>
            {data.auxiliaryExercises.map((exercise: any) => (
              <TouchableOpacity 
                key={exercise.id} 
                style={styles.exerciseButton}
                onPress={() => router.push(`/auxiliary/${exercise.id}`)}
              >
                <Text style={styles.exerciseButtonText}>{exercise.name}</Text>
                <Ionicons name="chevron-forward" size={20} color="#007bff" />
              </TouchableOpacity>
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
  exerciseButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  exerciseButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    flex: 1,
    paddingRight: 10,
  },
});
