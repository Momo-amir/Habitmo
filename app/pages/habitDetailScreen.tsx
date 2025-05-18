import { useIsFocused } from "@react-navigation/native";
import { useEffect, useState, useCallback } from "react";
import { Button, ScrollView, Text } from "react-native";
import { Habit } from "../../models/types";
import { getHabitsByCategory, completeHabit } from "../../services/habitService";
import HabitItem from "../components/habit";

export default function HabitDetailScreen({ route, navigation }: any) {
	const { categoryId } = route.params;
	const [habits, setHabits] = useState<Habit[]>([]);
	const isFocused = useIsFocused();

	const fetchHabits = useCallback(() => {
		const data = getHabitsByCategory(categoryId);
		setHabits(data);
	}, [categoryId]);

	useEffect(() => {
		if (isFocused) {
			fetchHabits();
		}
	}, [isFocused, fetchHabits]);

	const handleToggleComplete = async (id: string) => {
		await completeHabit(id);
		fetchHabits();
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
