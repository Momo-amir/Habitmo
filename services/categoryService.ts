import { Category } from "../models/types";
import db from "./db";

export const getAllCategories = (): Category[] => {
	try {
		const rows = db.getAllSync("SELECT * FROM categories");
		return rows.map((item: any) => ({
			...item,
			isFavorite: !!item.isFavorite,
			icon: `${item.icon}`,
		}));
	} catch (error) {
		console.error("Failed to fetch categories:", error);
		throw error;
	}
};

export const categoryExistsById = (id: string): boolean => {
	const existing = db.getFirstSync("SELECT id FROM categories WHERE id = ?", [id]);
	return !!existing;
};

export const categoryExistsByName = (name: string): boolean => {
	const existing = db.getFirstSync("SELECT id FROM categories WHERE name = ?", [name]);
	return !!existing;
};

export const addCategory = async (category: Category): Promise<boolean> => {
	if (categoryExistsById(category.id) || categoryExistsByName(category.name)) {
		return false;
	}
	db.runSync(`INSERT INTO categories (id, name, icon, color, isFavorite) VALUES (?, ?, ?, ?, ?)`, [category.id, category.name, typeof category.icon === "string" ? category.icon : "a.png", category.color ?? "#000", category.isFavorite ? 1 : 0]);
	return true;
};

export const deleteCategory = (id: string): void => {
	try {
		db.runSync("DELETE FROM categories WHERE id = ?", [id]);
	} catch (error) {
		console.error("Failed to delete category:", error);
		throw error;
	}
};

export const updateCategory = async (category: Category): Promise<void> => {
	try {
		db.runSync(`UPDATE categories SET name = ?, icon = ?, color = ?, isFavorite = ? WHERE id = ?`, [category.name, typeof category.icon === "string" ? category.icon : "a.png", category.color ?? "#000", category.isFavorite ? 1 : 0, category.id]);
	} catch (error) {
		console.error("Failed to update category:", error);
		throw error;
	}
};
