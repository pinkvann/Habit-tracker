import { CalendarView } from '@/components/CalendarView';
import { TaskItem } from '@/components/TaskItem';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useHabits } from '@/hooks/useHabits';
import { Trophy } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import {
    Dimensions,
    FlatList,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const READING_TASK_ID = 'fixed-reading-task';
const { width } = Dimensions.get('window');

export default function ReadingScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const { toggleTask, getTasksByDate, tasks, addTask, getReadingGoal } = useHabits();

    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split('T')[0]
    );

    const stats = getReadingGoal();

    // Use a stable ID for the reading task on each date
    const stableId = useMemo(() => `${READING_TASK_ID}-${selectedDate}`, [selectedDate]);

    // Find the actual task in state or create a virtual representation for display
    const currentTasks = useMemo(() => {
        const dayTasks = getTasksByDate(selectedDate);
        const readingTask = dayTasks.find(t => t.id === stableId);

        if (readingTask) {
            return [readingTask];
        }

        // Virtual task to show when it hasn't been started/completed yet
        return [{
            id: stableId,
            text: `Read for ${stats.goal} minutes`,
            completed: false,
            date: selectedDate
        }];
    }, [selectedDate, tasks, stableId, stats.goal]);

    const markedDates = useMemo(() => {
        const marks: any = {};
        tasks.forEach((task) => {
            if (task.id.startsWith(READING_TASK_ID) && task.completed) {
                marks[task.date] = { marked: true, dotColor: '#10b981' };
            }
        });
        return marks;
    }, [tasks]);

    const handleToggle = (id: string) => {
        // If the task exists in the real state, toggle it
        const exists = tasks.find(t => t.id === id);
        if (exists) {
            toggleTask(id);
        } else {
            // Otherwise, add it for the first time as completed
            addTask(`Read for ${stats.goal} minutes`, selectedDate, id, true);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <View style={styles.headerRow}>
                    <View>
                        <Text style={[styles.title, { color: theme.text }]}>Reading Habit</Text>
                        <Text style={styles.subtitle}>Level {stats.level} Reader</Text>
                    </View>
                    <View style={styles.trophyContainer}>
                        <Trophy color="#fbbf24" size={32} />
                    </View>
                </View>

                <View style={styles.progressCard}>
                    <View style={styles.progressInfo}>
                        <Text style={styles.progressText}>Current Goal: {stats.goal} mins</Text>
                        <Text style={styles.progressSubtext}>{stats.nextGoalIn} days to next level</Text>
                    </View>
                    <View style={styles.progressBarBg}>
                        <View style={[styles.progressBarFill, { width: `${((5 - stats.nextGoalIn) / 5) * 100}%` }]} />
                    </View>
                </View>
            </View>

            <CalendarView
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
                markedDates={markedDates}
            />

            <View style={styles.taskSection}>
                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>
                        Today's Target
                    </Text>
                </View>

                <FlatList
                    data={currentTasks}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TaskItem
                            task={item}
                            onToggle={handleToggle}
                            onDelete={() => { }}
                        />
                    )}
                    contentContainerStyle={styles.listContent}
                    extraData={tasks} // Ensure re-render when habits change
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 10,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 14,
        color: '#6366f1',
        fontWeight: '600',
        marginTop: 2,
    },
    trophyContainer: {
        backgroundColor: '#fffbeb',
        padding: 10,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#fef3c7',
    },
    progressCard: {
        backgroundColor: '#f8fafc',
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    progressInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    progressText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1e293b',
    },
    progressSubtext: {
        fontSize: 12,
        color: '#94a3b8',
        fontWeight: '500',
    },
    progressBarBg: {
        height: 8,
        backgroundColor: '#e2e8f0',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#10b981',
        borderRadius: 4,
    },
    taskSection: {
        flex: 1,
        paddingHorizontal: 20,
    },
    sectionHeader: {
        marginBottom: 16,
        marginTop: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    listContent: {
        paddingBottom: 40,
    },
});
