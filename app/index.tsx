import { initializeDatabase } from "@/services/dbInit";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect } from "react";
import CategoryScreen from "./pages/categoryScreen";
import FormScreen from "./pages/formScreen";
import HabitDetailScreen from "./pages/habitDetailScreen";
import HomeScreen from "./pages/homeScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabNavigator() {
	return (
		<Tab.Navigator
			initialRouteName="Home"
			screenOptions={({ route }) => ({
				tabBarIcon: ({ color, size }) => {
					let iconName = route.name === "Home" ? "home" : "grid";
					return <Ionicons name={iconName as "home" | "grid"} size={size} color={color} />;
				},
				tabBarActiveTintColor: "#121212",
				tabBarInactiveTintColor: "gray",
				headerShown: false,
			})}>
			<Tab.Screen name="Home" component={HomeScreen} />
			<Tab.Screen name="Categories" component={CategoryScreen} />
		</Tab.Navigator>
	);
}

export default function Index() {
	useEffect(() => {
		initializeDatabase();
	}, []);

	return (
		<Stack.Navigator>
			<Stack.Screen name="Main" component={TabNavigator} options={{ headerShown: false }} />
			<Stack.Screen name="HabitDetail" component={HabitDetailScreen} />
			<Stack.Screen name="Form" component={FormScreen} options={{ presentation: "modal" }} />
		</Stack.Navigator>
	);
}
