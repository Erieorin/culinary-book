const mongoose = require("mongoose");

const mealPlanSchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true },
  plan: {
    Завтрак: { type: mongoose.Schema.Types.Mixed },
    Обед: { type: mongoose.Schema.Types.Mixed },
    Ужин: { type: mongoose.Schema.Types.Mixed },
    Десерт: { type: mongoose.Schema.Types.Mixed },
  },
});

module.exports = mongoose.model("MealPlan", mealPlanSchema);
