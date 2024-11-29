const express = require("express");
const Recipe = require("../models/Recipe");
const router = express.Router();
const MealPlan = require("../models/MealPlan");
const ShoppingCart = require("../models/Cart");

// Добавление рецепта
router.post("/", async (req, res) => {
  try {
    const { title, description, category, complexity, cookingTime, servings, steps, ingredients, tips, images, calories } = req.body;
    const newRecipe = new Recipe({
      title,
      description,
      category,
      complexity,
      cookingTime,
      servings,
      steps,
      ingredients,
      tips,
      images,
      calories
    });
    await newRecipe.save();
    res.status(201).json(newRecipe);
  } catch (err) {
    res.status(500).json({ message: "Error creating recipe", error: err });
  }
});


// Получение рецептов с фильтрацией и сортировкой
router.get("/", async (req, res) => {
  const { category, complexity, cookingTime, sortBy } = req.query;

  console.log("Полученные параметры запроса:", req.query); // Логируем параметры запроса

  // Формируем объект для фильтрации
  const query = {};
  if (category) query.category = category;
  if (complexity) query.complexity = complexity;
  if (cookingTime) query.cookingTime = { $lte: Number(cookingTime) };

  const sort = {}; // Формируем объект сортировки
  if (sortBy) {
    if (sortBy === "favorites") {
      sort.favorites = -1; // сортировка по убыванию
    } else if (sortBy === "cookingTime") {
      sort.cookingTime = 1; // сортировка по возрастанию
    }
  }

  try {
    // Запрос в базу данных с фильтрацией и сортировкой
    const recipes = await Recipe.find(query).sort(sort);
    console.log("Рецепты, отправляемые клиенту:", recipes); // Логируем рецепты, которые отправляем
    res.status(200).json(recipes);
  } catch (err) {
    console.error("Ошибка получения рецептов:", err);
    res.status(500).json({ message: "Ошибка при получении рецептов", error: err });
  }
});

// Получение одного рецепта
router.get("/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    res.status(200).json(recipe);
  } catch (err) {
    res.status(500).json({ message: "Error fetching recipe", error: err });
  }
});

// Обновление рецепта
router.put("/:id", async (req, res) => {
  try {
    const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedRecipe) {
      return res.status(404).json({ message: "Рецепт не найден" });
    }
    res.status(200).json(updatedRecipe);
  } catch (err) {
    res.status(500).json({ message: "Ошибка при обновлении рецепта", error: err });
  }
});

// Удаление рецепта
router.delete("/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Рецепт не найден" });
    }
    res.status(200).json({ message: "Рецепт успешно удален" });
  } catch (err) {
    res.status(500).json({ message: "Ошибка при удалении рецепта", error: err });
  }
});

// Добавление рецепта в избранное
router.post("/:id/favorite", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    recipe.favorites += 1;
    await recipe.save();
    res.status(200).json({ message: "Рецепт добавлен в избранное", recipe });
  } catch (err) {
    res.status(500).json({ message: "Ошибка добавления в избранное", error: err });
  }
});

let mealPlans = {}; // Храним план питания временно в памяти
let shoppingCart = []; // Корзина


// Сохранение или обновление плана питания
router.post("/meal-plan", async (req, res) => {
  const { date, meals } = req.body;

  try {
    const existingPlan = await MealPlan.findOne({ date });
    if (existingPlan) {
      existingPlan.meals = meals;
      await existingPlan.save();
      res.status(200).json({ message: "План питания обновлен", plan: existingPlan });
    } else {
      const newPlan = new MealPlan({ date, meals });
      await newPlan.save();
      res.status(201).json({ message: "План питания сохранен", plan: newPlan });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ошибка сохранения плана", error: err });
  }
});

// Получение плана питания
router.get("/meal-plan/:date", async (req, res) => {
  try {
    const plan = await MealPlan.findOne({ date }).populate("meals.breakfast meals.lunch meals.dinner meals.dessert");
    res.status(200).json(plan || { message: "План отсутствует" });
  } catch (err) {
    res.status(500).json({ message: "Ошибка получения плана", error: err });
  }
});

// Добавление ингредиентов в корзину
router.post("/cart", async (req, res) => {
  const { ingredients } = req.body;

  try {
    let cart = await Cart.findOne();
    if (!cart) {
      cart = new ShoppingCart({ ingredients: [] });
    }
    // Убираем дубли и добавляем новые ингредиенты
    cart.ingredients = [...new Set([...cart.ingredients, ...ingredients])];
    await cart.save();
    res.status(200).json({ message: "Ингредиенты добавлены", cart });
  } catch (err) {
    res.status(500).json({ message: "Ошибка обновления корзины", error: err });
  }
});


// Получение ингредиентов из корзины
router.get("/cart", async (req, res) => {
  try {
    const cart = await Cart.findOne();
    res.status(200).json(cart || { ingredients: [] });
  } catch (err) {
    res.status(500).json({ message: "Ошибка получения корзины", error: err });
  }
});

// Удаление изображения
router.delete("/:id/image", async (req, res) => {
  try {
    const { imagePath } = req.body; // Путь к изображению, которое нужно удалить
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Рецепт не найден" });
    }

    // Удаляем изображение из массива изображений рецепта
    recipe.images = recipe.images.filter((image) => image !== imagePath);
    await recipe.save();
    
    res.status(200).json({ message: "Изображение удалено" });
  } catch (err) {
    res.status(500).json({ message: "Ошибка при удалении изображения", error: err });
  }
});


module.exports = router;
