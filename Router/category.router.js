import express from 'express';
import { addCategory, deleteCategoryData, getCategories, getCategory, softDeleteCategoryData, updateCategoryData } from '../Controller/category.controller';

const router = express.Router();

router.get("/get-categories", getCategories);
router.get("/get-category/:_id", getCategory);
router.post("/add-category", addCategory);
router.delete("/soft-delete-categorydata/:category_id", softDeleteCategoryData);
router.delete("/delete-categorydata/:category_id", deleteCategoryData);
router.put("/update-categorydata/:category_id", updateCategoryData)

export default router;