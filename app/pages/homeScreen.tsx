import { useIsFocused } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Category, Habit } from "../../models/types";
import { getAllCategories } from "../../services/categoryService";
import { getAllHabits } from "../../services/habitService";
import Card from "../components/card";
import HabitItem from "../components/habit";

export default function Home() {
	const styles = StyleSheet.create({
		favoriteContainer: {
			padding: 10,
		},
		title: {
			fontSize: 20,
			fontWeight: "bold",
			marginBottom: 10,
		},
		categoryGrid: {
			flexDirection: "row",
			flexWrap: "wrap",
			justifyContent: "center",
			gap: 4,
		},
		categoryCardWrapper: {
			margin: 5,
		},
	});

	const [favoriteHabits, setFavoriteHabits] = useState<Habit[]>([]);
	const [favoriteCategories, setFavoriteCategories] = useState<Category[]>([]);
	const isFocused = useIsFocused();

	useEffect(() => {
		if (isFocused) {
			const allHabits = getAllHabits();
			setFavoriteHabits(allHabits.filter((habit) => habit.isFavorite));

			const allCategories = getAllCategories();
			const favCats = allCategories.filter((cat) => cat.isFavorite).slice(0, 4);
			setFavoriteCategories(favCats);
		}
	}, [isFocused]);

	const handleHabitPress = (habit: Habit) => {
		// TODO: Implement habit press logic, e.g. navigate to habit detail
		console.log("Pressed habit:", habit.name);
	};

	const handleCategoryPress = (category: Category) => {
		// TODO: Implement category press logic, e.g. navigate to habit list for category
		console.log("Pressed category:", category.name);
	};

	return (
		<View style={{ padding: 10 }}>
			{/* Favorite Categories */}
			{favoriteCategories.length > 0 && (
				<View style={styles.favoriteContainer}>
					<Text style={styles.title}>Favorit kategorier</Text>
					<View style={styles.categoryGrid}>
						{favoriteCategories.map((category) => (
							<View key={category.id} style={styles.categoryCardWrapper}>
								<Card img={category.icon || require("@/assets/images/a.png")} size="medium" text={category.name} onPress={() => handleCategoryPress(category)} />
							</View>
						))}
					</View>
				</View>
			)}

			{/* Favorite Habits */}
			{favoriteHabits.length > 0 && (
				<View style={styles.favoriteContainer}>
					<Text style={styles.title}>Favorit vaner</Text>
					{favoriteHabits.map((habit) => (
						<HabitItem key={habit.id} habit={habit} onPress={() => handleHabitPress(habit)} onToggleComplete={() => {}} />
					))}
				</View>
			)}
		</View>
	);
}
