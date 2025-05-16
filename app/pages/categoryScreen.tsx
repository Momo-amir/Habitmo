import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { Button, ScrollView, Text, View } from "react-native";
import { Category, RootStackParamList } from "../../models/types";
import { getAllCategories } from "../../services/categoryService";
import Card from "../components/card";

const fallbackImage = require("@/assets/images/a.png");

export default function CategoryScreen() {
	const [categories, setCategories] = useState<Category[]>([]);
	const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

	useEffect(() => {
		const data = getAllCategories();
		setCategories(data);
	}, []);

	const handleAddCategory = () => {
		console.log("Add category pressed");
	};

	const handleCategoryPress = (categoryId: string) => {
		navigation.navigate("HabitDetail", { categoryId });
	};

	return (
		<ScrollView contentContainerStyle={{ padding: 10 }}>
			<Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10, marginLeft: 10 }}>Category</Text>
			<View style={{ flexDirection: "column", justifyContent: "center", marginTop: 16, alignItems: "center" }}>
				{categories.map((category) => (
					<Card key={category.id} text={category.name} img={category.icon || fallbackImage} size="large" onPress={() => handleCategoryPress(category.id)} />
				))}
			</View>
			<Button title="Add Category" onPress={handleAddCategory} />
		</ScrollView>
	);
}
