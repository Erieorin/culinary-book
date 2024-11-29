const express = require("express");
const router = express.Router();
const MealPlan = require("../models/MealPlan");

// Сохранение плана питания
router.post("/", async (req, res) => {
  const { date, plan } = req.body;

  // Логируем план, чтобы убедиться, что он содержит правильные ингредиенты
  console.log("Received meal plan:", plan);

  try {
    const existingPlan = await MealPlan.findOne({ date });
    if (existingPlan) {
      existingPlan.plan = plan;
      await existingPlan.save();
    } else {
      const newPlan = new MealPlan({ date, plan });
      await newPlan.save();
    }
    res.status(200).json({ message: "План питания сохранен" });
  } catch (err) {
    res.status(500).json({ message: "Ошибка сохранения плана", error: err });
  }
});


// Получение плана питания для даты
router.get("/:date", async (req, res) => {
  const { date } = req.params;
  try {
    const mealPlan = await MealPlan.findOne({ date });
    if (mealPlan) {
      res.status(200).json(mealPlan);
    } else {
      res.status(404).json({ message: "План на эту дату не найден" });
    }
  } catch (err) {
    res.status(500).json({ message: "Ошибка получения плана", error: err });
  }
});

module.exports = router;
