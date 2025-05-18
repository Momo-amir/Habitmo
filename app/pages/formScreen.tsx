import { useNavigation, useRoute } from "@react-navigation/native";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { Category, Habit } from "../../models/types";
import { addCategory, updateCategory } from "../../services/categoryService";
import { addHabit, updateHabit } from "../../services/habitService";
import CategoryForm from "../components/categoryForm";
import HabitForm from "../components/habitForm";

type FormType = "category" | "habit";
type FormMode = "add" | "edit";

interface RouteParams {
	type: FormType;
	mode: FormMode;
	initialData?: Category | Habit;
	categoryId?: string;
}

export default function FormScreen() {
	const navigation = useNavigation();
	const route = useRoute();
	const { type, mode, initialData, categoryId } = route.params as RouteParams;

	const handleSubmit = async (data: Category | Habit): Promise<void> => {
		if (type === "category") {
			if (mode === "edit") {
				await updateCategory(data as Category);
			} else {
				await addCategory(data as Category);
			}
		} else if (type === "habit") {
			if (mode === "edit") {
				await updateHabit(data as Habit);
			} else {
				await addHabit(data as Habit);
			}
		}
		navigation.goBack();
	};

	return (
		<Modal animationType="slide" transparent={true} visible={true}>
			<View style={styles.overlay}>
				<View style={styles.modal}>
					<View style={styles.header}>
						<Pressable onPress={() => navigation.goBack()}>
							<Text style={styles.closeText}>Luk</Text>
						</Pressable>
					</View>
					{type === "category" && <CategoryForm mode={mode} initialData={initialData as Category} onSubmit={handleSubmit} />}
					{type === "habit" && <HabitForm mode={mode} initialData={initialData as Habit} categoryId={categoryId!} onSubmit={handleSubmit} />}
				</View>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.4)",
		justifyContent: "center",
		alignItems: "center",
	},
	modal: {
		width: "90%",
		backgroundColor: "white",
		padding: 20,
		borderRadius: 12,
		elevation: 5,
	},
	header: {
		alignItems: "flex-end",
		marginBottom: 10,
	},
	closeText: {
		fontSize: 16,
		color: "#007AFF",
	},
});
