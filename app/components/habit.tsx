import type { RootStackParamList } from "@/models/types";
import { Habit } from "@/models/types";
import { completeHabit, deleteHabit, updateHabit } from "@/services/habitService";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";

interface HabitItemProps {
	habit: Habit;
	onToggleComplete: () => void;
	onPress: () => void;
}

// Utility: check if two dates are the same local calendar day
function isSameLocalDay(d1: Date, d2: Date): boolean {
	return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
}

// Utility: get last completed date (as Date object)
function getLastCompletedDate(habit: Habit): Date | null {
	if (!habit.completedDates.length) return null;
	// Sort ISO date strings descending and pick the most recent
	const sortedDates = habit.completedDates.slice().sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
	return new Date(sortedDates[0]);
}

// Utility: get next due date (based on frequency and last completed)
function getNextDueDate(habit: Habit): Date | null {
	const last = getLastCompletedDate(habit);
	if (!last) return null;
	switch (habit.frequency.type) {
		case "daily":
			return new Date(last.getTime() + 24 * 60 * 60 * 1000);
		case "weekly":
			return new Date(last.getTime() + 7 * 24 * 60 * 60 * 1000);
		case "custom":
			return new Date(last.getTime() + habit.frequency.interval * 24 * 60 * 60 * 1000);
	}
}

// Utility: get status color based on days since last completion vs interval
function getStatusColor(habit: Habit): string {
	const lastCompleted = getLastCompletedDate(habit);
	if (!lastCompleted) {
		// Never completed → overdue
		return "#f44336";
	}

	// Determine the interval in days
	let intervalDays = 1;
	switch (habit.frequency.type) {
		case "daily":
			intervalDays = 1;
			break;
		case "weekly":
			intervalDays = 7;
			break;
		case "custom":
			intervalDays = habit.frequency.interval;
			break;
	}

	// Compute days since last completion, rounding down
	const nowMid = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).getTime();
	const lastMid = new Date(lastCompleted.getFullYear(), lastCompleted.getMonth(), lastCompleted.getDate()).getTime();
	const daysSince = Math.floor((nowMid - lastMid) / (24 * 60 * 60 * 1000));

	if (daysSince === 0) {
		// Completed today
		return "#4caf50";
	} else if (daysSince === intervalDays) {
		// Due today
		return "#FEC901";
	} else if (daysSince > intervalDays) {
		// Overdue
		return "#f44336";
	}

	// Not yet due
	return "#4caf50";
}

// Utility: time since last completion (in days, hours, min)
function timeSince(date: Date): string {
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();

	// If same local day, return "I dag"
	if (isSameLocalDay(now, date)) {
		return "Today";
	}

	const seconds = Math.floor(diffMs / 1000);
	const units: [string, number][] = [
		["year", 31536000],
		["months", 2592000],
		["weeks", 604800],
		["days", 86400],
		["hours", 3600],
		["min", 60],
	];
	for (const [label, secs] of units) {
		const val = Math.floor(seconds / secs);
		if (val >= 1) return `${val} ${label}`;
	}
	return "Right now";
}

// Utility: time until next due (similar logic)
function timeUntil(date: Date): string {
	const now = new Date();
	const diffMs = date.getTime() - now.getTime();

	// Normalize to local midnight for days only
	const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
	const nextDueMidnight = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

	const diffDays = (nextDueMidnight - todayMidnight) / (24 * 60 * 60 * 1000);

	if (diffDays <= 0) return "Now";

	const seconds = Math.floor(diffMs / 1000);
	const units: [string, number][] = [
		["yr", 31536000],
		["month", 2592000],
		["weeks", 604800],
		["days", 86400],
		["hours", 3600],
		["min", 60],
	];
	for (const [label, secs] of units) {
		const val = Math.floor(seconds / secs);
		if (val >= 1) return `in ${val} ${label}`;
	}
	return "Soon";
}

export default function HabitItem({ habit, onToggleComplete, onPress }: HabitItemProps) {
	const lastCompleted = getLastCompletedDate(habit);
	const statusColor = getStatusColor(habit);
	const nextDue = getNextDueDate(habit);
	type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Form">;
	const navigation = useNavigation<NavigationProp>();

	const handleComplete = async () => {
		await completeHabit(habit.id);
		onToggleComplete();
	};

	const handleFavoriteToggle = async () => {
		const updatedHabit = { ...habit, isFavorite: !habit.isFavorite };
		await updateHabit(updatedHabit);
		onToggleComplete();
	};

	const handleDelete = async () => {
		await deleteHabit(habit.id);
		onToggleComplete();
	};

	const handleEdit = () => {
		navigation.navigate("Form", {
			mode: "edit",
			type: "habit",
			categoryId: habit.categoryId,
			initialData: habit,
		});
	};

	const renderRightActions = () => (
		<View style={styles.actionsContainer}>
			<Pressable onPress={handleEdit} style={[styles.actionButton, { backgroundColor: "#2196f3" }]}>
				<Text style={styles.actionText}>Edit</Text>
			</Pressable>
			<Pressable onPress={handleDelete} style={[styles.actionButton, { backgroundColor: "#DC143C" }]}>
				<Text style={styles.actionText}>Delete</Text>
			</Pressable>
		</View>
	);

	const renderLeftActions = () => (
		<View style={styles.actionsContainer}>
			<Pressable onPress={handleFavoriteToggle} style={[styles.actionButton, { backgroundColor: "#ff9800" }]}>
				<Text style={styles.actionText}>{habit.isFavorite ? "Remove\nfavorite" : "Add\nfavorite"}</Text>
			</Pressable>
		</View>
	);

	return (
		<Swipeable renderLeftActions={renderLeftActions} renderRightActions={renderRightActions}>
			<TouchableOpacity onPress={handleComplete} style={[styles.container, { borderLeftColor: statusColor }]}>
				<View style={{ flex: 1 }}>
					<Text style={styles.name}>
						{habit.name} {habit.isFavorite ? "⭐" : ""}
					</Text>
					<Text style={styles.subtext}>
						{habit.frequency.type === "daily" && "Daily"}
						{habit.frequency.type === "weekly" && `Weekly (${habit.frequency.days.map((d) => "SMTWTFS"[d]).join(", ")})`}
						{habit.frequency.type === "custom" && `Every ${habit.frequency.interval} day(s)`}
					</Text>
					{lastCompleted ? <Text style={styles.subtext}>Latest completion: {timeSince(lastCompleted)} </Text> : <Text style={styles.subtext}>Never Completed</Text>}
					{nextDue && <Text style={styles.subtext}>Next: {timeUntil(nextDue)}</Text>}
				</View>
				<View style={[styles.statusDot, { backgroundColor: statusColor }]} />
			</TouchableOpacity>
		</Swipeable>
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
		borderLeftWidth: 5,
	},
	name: {
		fontSize: 16,
		fontWeight: "500",
	},
	subtext: {
		fontSize: 12,
		color: "#666",
		marginTop: 4,
	},
	statusDot: {
		width: 16,
		height: 16,
		borderRadius: 8,
		marginLeft: 12,
	},
	actionsContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
	actionButton: {
		justifyContent: "center",
		alignItems: "center",
		width: 80,
		height: "100%",
	},
	actionText: {
		color: "#fff",
		fontWeight: "600",
	},
});
