import { Habit } from "../models/types";
import db from "./db";

export const getAllHabits = (): Habit[] => {
	try {
		const rows = db.getAllSync("SELECT * FROM habits");
		return rows.map((item: any) => ({
			...item,
			isFavorite: !!item.isFavorite,
			completedDates: JSON.parse(item.completedDates || "[]"),
		}));
	} catch (error) {
		console.error("Failed to fetch habits:", error);
		throw error;
	}
};

export const getHabitsByCategory = (categoryId: string): Habit[] => {
	try {
		const rows = db.getAllSync("SELECT * FROM habits WHERE categoryId = ?", [categoryId]);
		return rows.map((item: any) => ({
			...item,
			isFavorite: !!item.isFavorite,
			completedDates: JSON.parse(item.completedDates || "[]"),
		}));
	} catch (error) {
		console.error("Failed to fetch habits by category:", error);
		throw error;
	}
};

// Check if a habit exists by id
export const habitExistsById = (id: string): boolean => {
	const existing = db.getFirstSync("SELECT id FROM habits WHERE id = ?", [id]);
	return !!existing;
};

// Check if a habit exists by name within the same category
export const habitExistsByNameInCategory = (name: string, categoryId: string): boolean => {
	const existing = db.getFirstSync("SELECT id FROM habits WHERE name = ? AND categoryId = ?", [name, categoryId]);
	return !!existing;
};

// Add habit only if id and name+category are unique
export const addHabit = async (habit: Habit): Promise<boolean> => {
	if (habitExistsById(habit.id) || habitExistsByNameInCategory(habit.name, habit.categoryId)) {
		return false;
	}
	db.runSync(`INSERT INTO habits (id, name, categoryId, frequency, completedDates, isFavorite, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)`, [habit.id, habit.name, habit.categoryId, JSON.stringify(habit.frequency), JSON.stringify(habit.completedDates || []), habit.isFavorite ? 1 : 0, habit.createdAt]);
	return true;
};

export const updateHabit = (habit: Habit): void => {
	try {
		db.runSync(`UPDATE habits SET name = ?, categoryId = ?, frequency = ?, completedDates = ?, isFavorite = ?, createdAt = ? WHERE id = ?`, [habit.name, habit.categoryId, JSON.stringify(habit.frequency), JSON.stringify(habit.completedDates || []), habit.isFavorite ? 1 : 0, habit.createdAt, habit.id]);
	} catch (error) {
		console.error("Failed to update habit:", error);
		throw error;
	}
};

export const deleteHabit = (id: string): void => {
	try {
		db.runSync("DELETE FROM habits WHERE id = ?", [id]);
	} catch (error) {
		console.error("Failed to delete habit:", error);
		throw error;
	}
};

// Mark a habit as completed for today by appending today's date with time to completedDates and persisting it
// habitService.ts
export const completeHabit = (id: string): void => {
	try {
		const habit = db.getFirstSync("SELECT * FROM habits WHERE id = ?", [id]) as Habit;
		if (!habit) throw new Error("Habit not found");

		const completedDates: string[] = Array.isArray(habit.completedDates) ? habit.completedDates : JSON.parse(habit.completedDates || "[]");

		const now = new Date().toISOString();
		console.log("Adding completion timestamp:", now);

		if (!completedDates.some((date) => date.startsWith(now.split("T")[0]))) {
			completedDates.push(now);
		}

		db.runSync(`UPDATE habits SET completedDates = ? WHERE id = ?`, [JSON.stringify(completedDates), id]);
	} catch (error) {
		console.error("Failed to complete habit:", error);
		throw error;
	}
};

export function logCompletedDates() {
	const rows = db.getAllSync("SELECT id, completedDates FROM habits") as { id: any; completedDates: any }[];
	rows.forEach(({ id, completedDates }) => {
		console.log(`Habit ID: ${id}, completedDates: ${completedDates}`);
	});
}
