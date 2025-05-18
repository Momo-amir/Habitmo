import { ImageSourcePropType } from "react-native";

export interface Category {
	id: string; // Unique identifier
	name: string; // "Health", "Productivity", etc.
	icon?: ImageSourcePropType | any; // Optional image or icon (like emoji or asset)
	color?: string; // Optional background or accent color
	isFavorite?: boolean; // For front-page display
}

export interface Habit {
	icon?: ImageSourcePropType;
	id: string;
	name: string;
	categoryId: string; // Reference to Category.id
	frequency: Frequency;
	completedDates: string[]; // e.g. ["2025-05-14", "2025-05-15"]
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
