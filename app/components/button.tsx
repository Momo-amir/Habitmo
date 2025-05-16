import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface BtnProps {
	onPress: () => void;
	btnText: string;
}

export default function Btn({ onPress, btnText }: BtnProps) {
	return (
		<View style={styles.container}>
			<TouchableOpacity style={styles.button} onPress={onPress}>
				<Text style={styles.buttonText}>{btnText}</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		justifyContent: "center",
		alignItems: "center",
	},
	button: {
		backgroundColor: "#007BFF",
		padding: 15,
		borderRadius: 10,
	},
	buttonText: {
		color: "#fff",
		fontSize: 16,
		textAlign: "center",
	},
});
