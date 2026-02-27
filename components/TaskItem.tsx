import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Task } from '@/hooks/useHabits';
import { CheckCircle2, Circle, Trash2 } from 'lucide-react-native';
import React from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity } from 'react-native';

interface TaskItemProps {
    task: Task;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete }) => {
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];

    return (
        <Animated.View style={[styles.container, { backgroundColor: theme.background }]}>
            <TouchableOpacity
                style={styles.checkbox}
                onPress={() => onToggle(task.id)}
                activeOpacity={0.7}
            >
                {task.completed ? (
                    <CheckCircle2 color="#10b981" size={24} />
                ) : (
                    <Circle color="#94a3b8" size={24} />
                )}
            </TouchableOpacity>

            <Text
                style={[
                    styles.text,
                    { color: theme.text },
                    task.completed && styles.completedText,
                ]}
            >
                {task.text}
            </Text>

            <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => onDelete(task.id)}
                activeOpacity={0.7}
            >
                <Trash2 color="#ef4444" size={20} />
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    checkbox: {
        marginRight: 12,
    },
    text: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
    },
    completedText: {
        textDecorationLine: 'line-through',
        opacity: 0.5,
    },
    deleteButton: {
        padding: 4,
    },
});
