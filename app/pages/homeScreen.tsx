import { useIsFocused, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";
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

	// Animation values
	const titleOpacity = useRef(new Animated.Value(0)).current;
	const titleTranslateY = useRef(new Animated.Value(20)).current;

	const refetchData = () => {
		const allHabits = getAllHabits();
		setFavoriteHabits(allHabits.filter((habit) => habit.isFavorite));

		const allCategories = getAllCategories();
		const favCats = allCategories.filter((cat) => cat.isFavorite).slice(0, 4);
		setFavoriteCategories(favCats);
	};

	useEffect(() => {
		if (isFocused) {
			refetchData();

			// Trigger animation
			Animated.parallel([
				Animated.timing(titleOpacity, {
					toValue: 1,
					duration: 400,
					useNativeDriver: true,
				}),
				Animated.timing(titleTranslateY, {
					toValue: 0,
					duration: 500,
					useNativeDriver: true,
				}),
			]).start();
		}
	}, [isFocused]);

	const handleCategoryPress = (categoryId: string) => {
		navigation.navigate("HabitDetail", { categoryId });
	};

	const handleToggleComplete = (habitId: string) => {
		refetchData(); // Refetch data when a habit is clicked
	};

	return (
		<ScrollView style={{ backgroundColor: "#fff", paddingTop: 28 }}>
			<View style={{ padding: 10, backgroundColor: "#fff" }}>
				{/* Favorite Categories */}
				{favoriteCategories.length > 0 && (
					<View style={styles.favoriteContainer}>
						<Animated.Text
							style={[
								styles.title,
								{
									opacity: titleOpacity,
									transform: [{ translateY: titleTranslateY }],
								},
							]}>
							Favorited Categories
						</Animated.Text>
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
							<Animated.Text
								style={[
									styles.subTitle,
									{
										opacity: titleOpacity,
										transform: [{ translateY: titleTranslateY }],
									},
								]}>
								Favorited Habits
							</Animated.Text>
							{favoriteHabits.map((habit) => (
								<HabitItem key={habit.id} habit={habit} onToggleComplete={() => handleToggleComplete(habit.id)} onPress={() => {}} />
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
