import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  date: string; // YYYY-MM-DD
}

const STORAGE_KEY = '@habit_tracker_tasks';

export const useHabits = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error('Failed to load tasks', error);
    } finally {
      setLoading(false);
    }
  };

  const saveTasks = async (newTasks: Task[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newTasks));
    } catch (error) {
      console.error('Failed to save tasks', error);
    }
  };

  const addTask = (text: string, date: string, customId?: string, completed: boolean = false) => {
    const newTask: Task = {
      id: customId || Math.random().toString(36).substr(2, 9),
      text,
      completed,
      date,
    };
    setTasks(prevTasks => {
      const updated = [...prevTasks, newTask];
      saveTasks(updated);
      return updated;
    });
  };

  const toggleTask = (id: string) => {
    setTasks(prevTasks => {
      const updated = prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      );
      saveTasks(updated);
      return updated;
    });
  };

  const deleteTask = (id: string) => {
    setTasks(prevTasks => {
      const updated = prevTasks.filter((task) => task.id !== id);
      saveTasks(updated);
      return updated;
    });
  };

  const getTasksByDate = (date: string) => {
    return tasks.filter((task) => task.date === date);
  };

  const getReadingGoal = () => {
    const completedReadingDays = tasks.filter(
      (t) => t.id.startsWith('fixed-reading-task') && t.completed
    ).length;

    // Scale: 15 base + 5 for every 5 days completed
    const increment = Math.floor(completedReadingDays / 5) * 5;
    const goal = Math.min(15 + increment, 60); // Cap at 60 mins

    return {
      goal,
      completedDays: completedReadingDays,
      nextGoalIn: 5 - (completedReadingDays % 5),
      level: Math.floor(completedReadingDays / 5) + 1
    };
  };

  return {
    tasks,
    loading,
    addTask,
    toggleTask,
    deleteTask,
    getTasksByDate,
    getReadingGoal,
  };
};
