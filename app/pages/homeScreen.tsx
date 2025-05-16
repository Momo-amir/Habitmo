import { StyleSheet, Text, View } from "react-native";
import { Habit } from "../../models/types";
import Card from "../components/card";

export default function Home() {
	const styles = StyleSheet.create({
		favoriteContainer: {
			padding: 10,
		},
		title: {
			fontSize: 20,
			fontWeight: "bold",
		},
	});
	const favoriteItems: Habit[] = [];

	function getImage(icon: any): import("react-native").ImageSourcePropType {
		return icon;
	}

	function handlePress(item: Habit): void {
		// Implement  press
	}

	return (
		<View>
			{favoriteItems.length > 0 && (
				<View style={styles.favoriteContainer}>
					<Text style={styles.title}>Favoritter</Text>
					{favoriteItems.map((item) => (
						<Card key={item.id} text={item.name} img={getImage(item.icon)} size="medium" onPress={() => handlePress(item)} />
					))}
				</View>
			)}
		</View>
	);
}
