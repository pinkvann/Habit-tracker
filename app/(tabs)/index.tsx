import { CalendarView } from '@/components/CalendarView';
import { TaskItem } from '@/components/TaskItem';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useHabits } from '@/hooks/useHabits';
import { Plus } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const { addTask, toggleTask, deleteTask, getTasksByDate, tasks } = useHabits();

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [newTaskText, setNewTaskText] = useState('');

  const currentTasks = useMemo(() => getTasksByDate(selectedDate), [
    selectedDate,
    tasks,
  ]);

  const markedDates = useMemo(() => {
    const marks: any = {};
    tasks.forEach((task) => {
      if (!marks[task.date]) {
        marks[task.date] = { marked: true, dotColor: '#6366f1' };
      }
    });
    return marks;
  }, [tasks]);

  const handleAddTask = () => {
    if (newTaskText.trim()) {
      addTask(newTaskText.trim(), selectedDate);
      setNewTaskText('');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>Habit Tracker</Text>
          <Text style={styles.subtitle}>Stay consistent, achieve more</Text>
        </View>

        <CalendarView
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          markedDates={markedDates}
        />

        <View style={styles.taskSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Tasks for {selectedDate === new Date().toISOString().split('T')[0] ? 'Today' : selectedDate}
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.input,
                { color: theme.text, backgroundColor: colorScheme === 'dark' ? '#1e293b' : '#f1f5f9' },
              ]}
              placeholder="Add a new task..."
              placeholderTextColor="#94a3b8"
              value={newTaskText}
              onChangeText={setNewTaskText}
              onSubmitEditing={handleAddTask}
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddTask}
              activeOpacity={0.8}
            >
              <Plus color="#ffffff" size={24} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={currentTasks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TaskItem
                task={item}
                onToggle={toggleTask}
                onDelete={deleteTask}
              />
            )}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No tasks for this day. Start by adding one!</Text>
              </View>
            }
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 4,
  },
  taskSection: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 10,
  },
  input: {
    flex: 1,
    height: 50,
    borderRadius: 15,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  listContent: {
    paddingBottom: 40,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    color: '#94a3b8',
    fontSize: 14,
    textAlign: 'center',
  },
});
