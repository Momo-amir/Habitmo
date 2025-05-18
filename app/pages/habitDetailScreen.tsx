import { useIsFocused } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Button, ScrollView, Text } from "react-native";
import { Habit } from "../../models/types";
import { getHabitsByCategory } from "../../services/habitService";
import HabitItem from "../components/habit";

export default function HabitDetailScreen({ route, navigation }: any) {
	const { categoryId } = route.params;
	const [habits, setHabits] = useState<Habit[]>([]);
	const isFocused = useIsFocused();

	useEffect(() => {
		if (isFocused) {
			const data = getHabitsByCategory(categoryId);
			setHabits(data);
		}
	}, [isFocused, categoryId]);

	const handleToggleComplete = (id: string) => {
		// Placeholder toggle logic
		const today = new Date().toISOString().split("T")[0];
		setHabits((prev) =>
			prev.map((h) =>
				h.id === id
					? {
							...h,
							completedDates: h.completedDates.includes(today) ? h.completedDates.filter((d) => d !== today) : [...h.completedDates, today],
					  }
					: h
			)
		);
	};

	const handleAddHabit = () => {
		navigation.navigate("Form", {
			mode: "add",
			type: "habit",
			categoryId,
		});
	};

	return (
		<ScrollView contentContainerStyle={{ padding: 16 }}>
			<Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>Vaner</Text>
			<Button title="Tilføj ny vane" onPress={handleAddHabit} />
			{habits.length === 0 ? <Text style={{ marginTop: 20 }}>Ingen vaner endnu – tilføj en for at komme i gang!</Text> : habits.map((habit) => <HabitItem key={habit.id} habit={habit} onPress={() => console.log("Pressed habit:", habit.name)} onToggleComplete={() => handleToggleComplete(habit.id)} />)}
		</ScrollView>
	);
}
