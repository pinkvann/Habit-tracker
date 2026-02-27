import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';

interface CalendarViewProps {
    selectedDate: string;
    onDateSelect: (date: string) => void;
    markedDates: any;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
    selectedDate,
    onDateSelect,
    markedDates,
}) => {
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Calendar
                current={selectedDate}
                onDayPress={(day: DateData) => onDateSelect(day.dateString)}
                markedDates={{
                    ...markedDates,
                    [selectedDate]: {
                        selected: true,
                        disableTouchEvent: true,
                        selectedColor: '#6366f1',
                        selectedTextColor: '#ffffff',
                    },
                }}
                theme={{
                    backgroundColor: 'transparent',
                    calendarBackground: 'transparent',
                    textSectionTitleColor: '#94a3b8',
                    selectedDayBackgroundColor: '#6366f1',
                    selectedDayTextColor: '#ffffff',
                    todayTextColor: '#6366f1',
                    dayTextColor: theme.text,
                    textDisabledColor: '#475569',
                    dotColor: '#6366f1',
                    selectedDotColor: '#ffffff',
                    arrowColor: '#6366f1',
                    disabledArrowColor: '#d9e1e8',
                    monthTextColor: theme.text,
                    indicatorColor: '#6366f1',
                    textDayFontFamily: 'System',
                    textMonthFontFamily: 'System',
                    textDayHeaderFontFamily: 'System',
                    textDayFontWeight: '300',
                    textMonthFontWeight: 'bold',
                    textDayHeaderFontWeight: '300',
                    textDayFontSize: 16,
                    textMonthFontSize: 18,
                    textDayHeaderFontSize: 14,
                }}
                style={styles.calendar}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 24,
        overflow: 'hidden',
        margin: 16,
        padding: 8,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    calendar: {
        borderRadius: 16,
    },
});
