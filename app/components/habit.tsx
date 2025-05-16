// components/HabitItem.tsx
import { Habit } from "@/models/types";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface HabitItemProps {
	habit: Habit;
	onToggleComplete: () => void;
	onPress: () => void;
}

export default function HabitItem({ habit, onToggleComplete, onPress }: HabitItemProps) {
	const isCompletedToday = habit.completedDates.includes(new Date().toISOString().split("T")[0]);

	return (
		<TouchableOpacity onPress={onPress} style={styles.container}>
			<Text style={styles.name}>{habit.name}</Text>
			<TouchableOpacity onPress={onToggleComplete} style={[styles.status, isCompletedToday && styles.completed]}>
				<Text style={styles.statusText}>{isCompletedToday ? "✓" : "○"}</Text>
			</TouchableOpacity>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		padding: 15,
		borderBottomWidth: 1,
		borderBottomColor: "#ddd",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	name: {
		fontSize: 16,
	},
	status: {
		width: 24,
		height: 24,
		borderRadius: 12,
		borderWidth: 2,
		borderColor: "#aaa",
		justifyContent: "center",
		alignItems: "center",
	},
	completed: {
		backgroundColor: "#4caf50",
		borderColor: "#4caf50",
	},
	statusText: {
		color: "#fff",
		fontWeight: "bold",
	},
});
