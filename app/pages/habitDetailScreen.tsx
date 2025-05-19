import { useIsFocused } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { Button, ScrollView, Text, View } from "react-native";
import { Habit } from "../../models/types";
import { completeHabit, getHabitsByCategory } from "../../services/habitService";
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
			<View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" }}>
				<Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10, marginLeft: 10, color: "#003300" }}>Habits</Text>
				<Button title="Add New" onPress={handleAddHabit} />
			</View>
			{habits.length === 0 ? <Text style={{ marginVertical: 20, flex: 1, justifyContent: "center", alignSelf: "center" }}>Ingen vaner endnu – tilføj en for at komme i gang!</Text> : habits.map((habit) => <HabitItem key={habit.id} habit={habit} onPress={() => console.log("Pressed habit:", habit.name)} onToggleComplete={() => handleToggleComplete(habit.id)} />)}
		</ScrollView>
	);
}
