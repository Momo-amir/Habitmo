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
