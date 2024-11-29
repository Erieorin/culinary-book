const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String },
  complexity: { type: String },
  cookingTime: { type: Number },
  servings: { type: Number },
  steps: [String],
  ingredients: { type: [String] },
  tips: String,
  images: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  favorites: { type: Number, default: 0 },
  calories: {type: Number},
});

module.exports = mongoose.model("Recipe", recipeSchema);
