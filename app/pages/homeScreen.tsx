import { useIsFocused, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Category, Habit, RootStackParamList } from "../../models/types";
import { getAllCategories } from "../../services/categoryService";
import { getAllHabits } from "../../services/habitService";
import Card from "../components/card";
import HabitItem from "../components/habit";

export default function Home() {
	const [favoriteHabits, setFavoriteHabits] = useState<Habit[]>([]);
	const [favoriteCategories, setFavoriteCategories] = useState<Category[]>([]);
	const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

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

	const handleCategoryPress = (categoryId: string) => {
		navigation.navigate("HabitDetail", { categoryId });
	};

	return (
		<ScrollView style={{ backgroundColor: "#fff", paddingTop: 28 }}>
			<View style={{ padding: 10, backgroundColor: "#fff" }}>
				{/* Favorite Categories */}
				{favoriteCategories.length > 0 && (
					<View style={styles.favoriteContainer}>
						<Text style={styles.title}>Favorited Categories</Text>
						<View style={styles.categoryGrid}>
							{favoriteCategories.map((category) => (
								<View key={category.id} style={styles.categoryCardWrapper}>
									<Card backgroundColor={category.icon || "#000000"} size="medium" text={category.name} onPress={() => handleCategoryPress(category.id)} />
								</View>
							))}
						</View>
					</View>
				)}

				{/* Favorite Habits */}
				{favoriteHabits.length > 0 && (
					<ScrollView style={{ backgroundColor: "#fff" }}>
						<View style={styles.favoriteContainer}>
							<Text style={styles.subTitle}>Favorited Habits</Text>
							{favoriteHabits.map((habit) => (
								<HabitItem key={habit.id} habit={habit} onToggleComplete={() => {}} onPress={() => {}} />
							))}
						</View>
					</ScrollView>
				)}
			</View>
		</ScrollView>
	);
}
const styles = StyleSheet.create({
	favoriteContainer: {
		padding: 12,
		marginBottom: 12,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 20,
		marginTop: 18,
		color: "#003300",
	},
	subTitle: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 10,
		color: "#003300",
	},
	categoryGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "center",
	},
	categoryCardWrapper: {
		margin: 5,
	},
});
