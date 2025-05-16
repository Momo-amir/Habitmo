import { useEffect, useState } from "react";
import { Button, ScrollView, Text } from "react-native";
import { Habit } from "../../models/types";
import HabitItem from "../components/habit";

export default function HabitDetailScreen({ route, navigation }: any) {
	const { categoryId } = route.params;
	const [habits, setHabits] = useState<Habit[]>([]);

	useEffect(() => {
		// Replace with DB call later
		// Fetch habits for the category here
		setHabits([]);
	}, [categoryId]);

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
		// TODO: Replace with real form
		console.log("Add new habit for category", categoryId);
	};

	return (
		<ScrollView contentContainerStyle={{ padding: 16 }}>
			<Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>Vaner</Text>
			<Button title="Tilføj ny vane" onPress={handleAddHabit} />
			{habits.length === 0 ? <Text style={{ marginTop: 20 }}>Ingen vaner endnu – tilføj en for at komme i gang!</Text> : habits.map((habit) => <HabitItem key={habit.id} habit={habit} onPress={() => console.log("Pressed habit:", habit.name)} onToggleComplete={() => handleToggleComplete(habit.id)} />)}
		</ScrollView>
	);
}
