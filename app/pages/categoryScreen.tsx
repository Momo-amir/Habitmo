import { useIsFocused, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { Button, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { Category, RootStackParamList } from "../../models/types";
import { deleteCategory, getAllCategories, updateCategory } from "../../services/categoryService";
import Card from "../components/card";

const fallbackImage = require("@/assets/images/a.png");

export default function CategoryScreen() {
	const [categories, setCategories] = useState<Category[]>([]);
	const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
	const isFocused = useIsFocused();

	const refetchCategories = () => {
		const data = getAllCategories();
		setCategories(data);
	};

	useEffect(() => {
		if (isFocused) {
			refetchCategories();
		}
	}, [isFocused]);

	const handleAddCategory = () => {
		navigation.navigate("Form", {
			mode: "add",
			type: "category",
		});
	};

	const handleCategoryPress = (categoryId: string) => {
		navigation.navigate("HabitDetail", { categoryId });
	};

	return (
		<ScrollView contentContainerStyle={{ padding: 10 }}>
			<Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10, marginLeft: 10 }}>Category</Text>
			<View style={{ flexDirection: "column", justifyContent: "center", marginTop: 16, alignItems: "center" }}>
				{categories.map((category) => (
					<Swipeable
						key={category.id}
						renderLeftActions={() => (
							<TouchableOpacity
								style={{
									backgroundColor: "#FFD700",
									justifyContent: "center",
									alignItems: "center",
									width: 80,
									height: 150,
									alignSelf: "center",
									borderTopLeftRadius: 10,
									borderBottomLeftRadius: 10,
								}}
								onPress={() => {
									const updated = { ...category, isFavorite: !category.isFavorite };
									updateCategory(updated);
									refetchCategories();
								}}>
								<Text style={{ color: "#000", fontWeight: "bold" }}>{category.isFavorite ? "Unfav" : "Favorit"}</Text>
							</TouchableOpacity>
						)}
						renderRightActions={() => (
							<View style={{ flexDirection: "row" }}>
								<TouchableOpacity style={{ backgroundColor: "#007AFF", justifyContent: "center", alignItems: "center", width: 80, height: 150, alignSelf: "center" }} onPress={() => navigation.navigate("Form", { mode: "edit", type: "category", initialData: category })}>
									<Text style={{ color: "#fff", fontWeight: "bold" }}>Edit</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={{ backgroundColor: "#FF3B30", justifyContent: "center", alignItems: "center", width: 80, height: 150, alignSelf: "center", borderEndEndRadius: 10, borderStartEndRadius: 10 }}
									onPress={() => {
										deleteCategory(category.id);
										refetchCategories();
									}}>
									<Text style={{ color: "#fff", fontWeight: "bold" }}>Delete</Text>
								</TouchableOpacity>
							</View>
						)}>
						<Card text={category.name} img={category.icon || fallbackImage} size="large" onPress={() => handleCategoryPress(category.id)} />
					</Swipeable>
				))}
			</View>
			<Button title="Add Category" onPress={handleAddCategory} />
		</ScrollView>
	);
}
