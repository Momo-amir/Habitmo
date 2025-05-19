import { ImageSourcePropType } from "react-native";

export interface Category {
	id: string;
	name: string;
	icon?: ImageSourcePropType | any; //TODO: Optional image or icon (like emoji or asset)
	color?: string; // Optional background or accent color
	isFavorite?: boolean; // For front-page display
}

export interface Habit {
	icon?: ImageSourcePropType;
	id: string;
	name: string;
	categoryId: string; // Reference to Category.id
	frequency: Frequency;
	completedDates: string[];
	isFavorite?: boolean;
	createdAt: string;
}

export type RootStackParamList = {
	Home: undefined;
	Categories: undefined;
	HabitDetail: { categoryId: string };
	Form: { mode: "add" | "edit"; initialData?: Category | Habit; onSubmit?: () => void | Promise<void>; type: "category" | "habit"; categoryId?: string };
};

export type Frequency =
	| { type: "daily" }
	| { type: "weekly"; days: number[] } // 0 = Sunday, 1 = Monday, etc.
	| { type: "custom"; interval: number }; // every N days
