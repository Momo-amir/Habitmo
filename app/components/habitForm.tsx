import { useState } from "react";
import { Button, Pressable, StyleSheet, Switch, Text, TextInput, View } from "react-native";
import { Frequency, Habit } from "../../models/types";

type FormMode = "add" | "edit";

interface HabitFormProps {
	initialData?: Habit;
	mode: FormMode;
	onSubmit: (data: Habit) => void;
	categoryId: string;
}

const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];

export default function HabitForm({ initialData, mode, onSubmit, categoryId }: HabitFormProps) {
	const [name, setName] = useState(initialData?.name ?? "");
	const [isFavorite, setIsFavorite] = useState(initialData?.isFavorite ?? false);
	const initialFrequency = initialData?.frequency ?? { type: "daily" };
	const [frequencyType, setFrequencyType] = useState<Frequency["type"]>(initialFrequency.type);
	const [weeklyDays, setWeeklyDays] = useState<number[]>(initialFrequency.type === "weekly" ? initialFrequency.days : []);
	const [customInterval, setCustomInterval] = useState(initialFrequency.type === "custom" ? String(initialFrequency.interval) : "3");

	const toggleDay = (dayIndex: number) => {
		setWeeklyDays((prev) => (prev.includes(dayIndex) ? prev.filter((d) => d !== dayIndex) : [...prev, dayIndex]));
	};

	const handleSubmit = () => {
		if (!name.trim()) return;

		let frequency: Frequency;
		if (frequencyType === "weekly") {
			frequency = { type: "weekly", days: weeklyDays };
		} else if (frequencyType === "custom") {
			frequency = { type: "custom", interval: parseInt(customInterval) || 1 };
		} else {
			frequency = { type: "daily" };
		}

		const habit: Habit = {
			id: initialData?.id ?? Date.now().toString(),
			name,
			categoryId,
			frequency,
			completedDates: initialData?.completedDates ?? [],
			isFavorite,
			createdAt: initialData?.createdAt ?? new Date().toISOString(),
		};

		onSubmit(habit);
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>{mode === "add" ? "New habit" : "Edit habit"}</Text>
			<TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
			<View style={styles.switchRow}>
				<Text>Favorite</Text>
				<Switch value={isFavorite} onValueChange={setIsFavorite} />
			</View>
			<Text style={styles.subtitle}>Repeat</Text>
			<View style={styles.row}>
				{["daily", "weekly", "custom"].map((type) => (
					<Pressable key={type} style={[styles.freqOption, frequencyType === type && styles.selected]} onPress={() => setFrequencyType(type as Frequency["type"])}>
						<Text>{type}</Text>
					</Pressable>
				))}
			</View>

			{frequencyType === "weekly" && (
				<View style={styles.row}>
					{daysOfWeek.map((day, index) => (
						<Pressable key={index} style={[styles.day, weeklyDays.includes(index) && styles.selectedDay]} onPress={() => toggleDay(index)}>
							<Text>{day}</Text>
						</Pressable>
					))}
				</View>
			)}

			{frequencyType === "custom" && <TextInput style={styles.input} value={customInterval} onChangeText={setCustomInterval} keyboardType="numeric" placeholder="Custom interval" />}

			<Button title={mode === "add" ? "Add" : "Update"} onPress={handleSubmit} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		padding: 16,
		gap: 12,
	},
	title: {
		fontSize: 20,
		fontWeight: "600",
	},
	subtitle: {
		marginTop: 8,
		marginBottom: 4,
		fontWeight: "500",
	},
	input: {
		borderWidth: 1,
		borderColor: "#ccc",
		padding: 10,
		borderRadius: 6,
	},
	switchRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	row: {
		flexDirection: "row",
		justifyContent: "space-around",
	},
	freqOption: {
		padding: 8,
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 6,
	},
	selected: {
		backgroundColor: "#ddd",
	},
	day: {
		padding: 8,
		borderWidth: 1,
		borderRadius: 4,
		marginHorizontal: 2,
	},
	selectedDay: {
		backgroundColor: "#aaa",
	},
});
