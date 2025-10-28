import Category from "../models/Category.js";

// import Category from "../models/Category";

export const createCategory = async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const createManyCategories = async (req, res) => {
  if (!Array.isArray(req.body) || req.body.length === 0) {
    return res
      .status(400)
      .json({ error: "Request body phải là một mảng và không được rỗng" });
  }
  try {
    const newCategories = await Category.insertMany(req.body);
    res.status(201).json(newCategories);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
