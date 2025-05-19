import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface CardProps {
	backgroundColor: string;
	size: "small" | "medium" | "large";
	onPress: () => void;
	text: string;
}

export default function Card({ backgroundColor, size, onPress, text }: CardProps) {
	return (
		<TouchableOpacity style={[styles.card, styles[size], { backgroundColor }]} onPress={onPress}>
			<View style={styles.content}>
				<Text style={styles.cardText}>{text}</Text>
			</View>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	card: {
		borderRadius: 10,
		margin: 0,
		overflow: "hidden",
	},
	content: {
		width: "100%",
		height: "100%",
		justifyContent: "center",
		alignItems: "center",
	},
	cardText: {
		fontSize: 18,
		color: "#fefefe",
		textAlign: "center",
		padding: 5,
		borderRadius: 5,
		fontWeight: 500,
	},
	large: {
		width: 350,
		height: 150,
		margin: 10,
	},
	medium: {
		width: 165,
		height: 100,
	},
	small: {
		width: 75,
		height: 75,
	},
});
