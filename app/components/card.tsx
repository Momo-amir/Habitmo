import { ImageBackground, ImageSourcePropType, StyleSheet, Text, TouchableOpacity } from "react-native";

interface cardProps {
	img: ImageSourcePropType; // Use `any` or `ImageSourcePropType` for stricter typing
	size: "small" | "medium" | "large";

	onPress: () => void;
	text: string;
}

export default function Card({ img, size, onPress, text }: cardProps) {
	return (
		<TouchableOpacity style={[styles.card, styles[size]]} onPress={onPress}>
			<ImageBackground source={img} style={styles.cardBackground} imageStyle={styles.cardImage} resizeMode="cover">
				<Text style={styles.cardText}>{text}</Text>
			</ImageBackground>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	card: {
		borderRadius: 10,
		margin: 10,
		overflow: "hidden",
		backgroundColor: "#000000",
	},
	cardBackground: {
		width: "100%",
		height: "100%",
		justifyContent: "center",
		alignItems: "center",
		opacity: 0.8,
	},
	cardImage: {
		borderRadius: 10,
	},
	cardText: {
		fontSize: 16,
		color: "#fff",
		textAlign: "center",
		padding: 5,
		borderRadius: 5,
	},
	large: {
		width: 350,
		height: 150,
	},
	medium: {
		width: 100,
		height: 100,
	},
	small: {
		width: 75,
		height: 75,
	},
});
