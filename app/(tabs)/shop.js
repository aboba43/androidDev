import { router } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  Keyboard,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { useSelector } from 'react-redux';

export default function CalculatorScreen() {
  const records = useSelector((state: any) => state.user.records) || { bench: 0, squat: 0, deadlift: 0 };
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [oneRepMax, setOneRepMax] = useState(null);

  const calculate1RM = () => {
    Keyboard.dismiss();

    const m = parseFloat(weight);
    const k = parseInt(reps, 10);

    if (isNaN(m) || isNaN(k) || m <= 0 || k <= 0) {
      setOneRepMax(null);
      return;
    }

    // Якщо повторення = 1, то максимальна вага і є введеною
    if (k === 1) {
      setOneRepMax(m.toFixed(1));
      return;
    }

    // 1. Формула Еплі (Epley)
    const epley = (m * k) / 30 + m;

    // 2. Формула Метта Бжицькі (Matt Brzycki)
    const brzycki = m * (36 / (37 - k));

    // 3. Формула Лендера (Lander)
    const lander = (100 * m) / (101.3 - 2.67123 * k);

    // 4. Формула Про Коннор (O Conner)
    const oconner = m * (1 + 0.025 * k);

    // Середнє значення 4 формул
    const average1RM = (epley + brzycki + lander + oconner) / 4;

    setOneRepMax(average1RM.toFixed(1));
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContent}>

          <View style={styles.header}>
            <Text style={styles.headerTitle}>1RM Калькулятор</Text>
            <Text style={styles.headerSubtitle}>Розрахунок разового максимуму</Text>
          </View>

          <View style={styles.recordsContainer}>
            <Text style={styles.recordsTitle}>Мої Рекорди</Text>
            <View style={styles.recordsRow}>
              <TouchableOpacity style={styles.recordCard} onPress={() => router.push('/exercise/bench')}>
                <Image source={require('../../app/exercise/benchpress.png')} style={styles.recordIcon} />
                <Text style={styles.recordLabel}>Жим лежачи</Text>
                <Text style={styles.recordValue}>{records.bench} кг</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.recordCard} onPress={() => router.push('/exercise/squat')}>
                <Image source={require('../../app/exercise/squat.png')} style={styles.recordIcon} />
                <Text style={styles.recordLabel}>Присяд зі штангою</Text>
                <Text style={styles.recordValue}>{records.squat} кг</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.recordCard} onPress={() => router.push('/exercise/deadlift')}>
                <Image source={require('../../app/exercise/deadlift.png')} style={styles.recordIcon} />
                <Text style={styles.recordLabel}>Станова тяга</Text>
                <Text style={styles.recordValue}>{records.deadlift} кг</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Вага штанги (кг):</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="Наприклад: 80"
                placeholderTextColor="#999"
                value={weight}
                onChangeText={setWeight}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Кількість повторень:</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="Наприклад: 8"
                placeholderTextColor="#999"
                value={reps}
                onChangeText={setReps}
              />
            </View>

            <TouchableOpacity
              style={[styles.button, (!weight || !reps) && styles.buttonDisabled]}
              onPress={calculate1RM}
              disabled={!weight || !reps}
            >
              <Text style={styles.buttonText}>Розрахувати максимум</Text>
            </TouchableOpacity>
          </View>

          {oneRepMax !== null && (
            <View style={styles.resultCard}>
              <Text style={styles.resultTitle}>Ваш разовий максимум:</Text>
              <Text style={styles.resultValue}>{oneRepMax} <Text style={styles.resultUnit}>кг</Text></Text>
            </View>
          )}

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Увага!</Text>
            <Text style={styles.infoText}>
              Точне значення одноповторного максимуму залежить від багатьох індивідуальних особливостей організму кожної конкретної людини.
              Слід враховувати, що похибка даних формул може становити до <Text style={styles.boldText}>4%</Text>.
            </Text>
            <Text style={styles.infoTextSub}>
              Розрахунок ведеться як середнє значення за 4 алгоритмами: Epley, Matt Brzycki, Lander та O'Conner.
            </Text>
          </View>

        </ScrollView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  scrollContent: {
    padding: 20,
    flexGrow: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1a1a2e',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  recordsContainer: {
    marginBottom: 20,
  },
  recordsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  recordsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  recordCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 15,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  recordIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginBottom: 5,
  },
  recordLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  recordValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 12,
    padding: 15,
    fontSize: 18,
    color: '#333',
  },
  button: {
    backgroundColor: '#007bff',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#b3d7ff',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 25,
    alignItems: 'center',
    marginBottom: 25,
    shadowColor: '#007bff',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 5,
  },
  resultTitle: {
    fontSize: 16,
    color: '#a0aab2',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  resultValue: {
    fontSize: 48,
    fontWeight: '900',
    color: '#fff',
  },
  resultUnit: {
    fontSize: 24,
    fontWeight: '500',
    color: '#a0aab2',
  },
  infoBox: {
    backgroundColor: '#fff3cd',
    borderRadius: 12,
    padding: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 5,
  },
  infoText: {
    fontSize: 14,
    color: '#856404',
    lineHeight: 20,
  },
  infoTextSub: {
    fontSize: 12,
    color: '#856404',
    lineHeight: 18,
    marginTop: 10,
    opacity: 0.8,
  },
  boldText: {
    fontWeight: 'bold',
  },
});