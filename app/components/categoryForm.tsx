import { useState } from "react";
import { Alert, Button, StyleSheet, Switch, Text, TextInput, View } from "react-native";
import { Category } from "../../models/types";
import { addCategory, updateCategory } from "../../services/categoryService";

type FormMode = "add" | "edit";

interface CategoryFormProps {
	initialData?: Category;
	mode: FormMode;
	onSubmit: (data: Category) => Promise<void>;
}

export default function CategoryForm({ initialData, mode, onSubmit }: CategoryFormProps) {
	const [name, setName] = useState(initialData?.name ?? "");
	const [icon, setIcon] = useState(initialData?.icon ?? "");
	const [color, setColor] = useState(initialData?.color ?? "#000000");
	const [isFavorite, setIsFavorite] = useState(initialData?.isFavorite ?? false);

	const handleSubmit = async () => {
		if (!name.trim()) return;

		const category: Category = {
			id: initialData?.id ?? Date.now().toString(),
			name,
			icon,
			color,
			isFavorite,
		};

		if (mode === "edit") {
			if (initialData?.id) {
				await updateCategory(category);
				await onSubmit(category);
			}
		} else {
			const success = await addCategory(category);
			if (success) {
				await onSubmit(category);
			} else {
				Alert.alert("Category Exists", "A category with this name or ID already exists.");
			}
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>{mode === "add" ? "New Category" : "Edit Category"}</Text>
			<TextInput style={styles.input} placeholder="Category Name" value={name} onChangeText={setName} />
			<TextInput style={styles.input} placeholder="Color in Hex (Yes it is stupid)" value={icon as string} onChangeText={setIcon} />
			<View style={styles.switchContainer}>
				<Text style={{ fontSize: 16, fontWeight: 500 }}>Add Favorite</Text>
				<Switch value={isFavorite} onValueChange={setIsFavorite} />
			</View>
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
	input: {
		borderWidth: 1,
		borderColor: "#ccc",
		padding: 10,
		borderRadius: 6,
	},
	switchContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
});
