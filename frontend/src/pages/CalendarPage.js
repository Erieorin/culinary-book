import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";

function CalendarPage() {
  const [recipes, setRecipes] = useState([]);
  const [mealPlan, setMealPlan] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [savedPlan, setSavedPlan] = useState(null);
  const [totalCalories, setTotalCalories] = useState(0);

  // Загрузка рецептов
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/recipes");
        setRecipes(response.data);
      } catch (err) {
        console.error("Ошибка загрузки рецептов:", err);
      }
    };
    fetchRecipes();
  }, []);

  // Загрузка плана для выбранной даты и пересчёт калорий
  useEffect(() => {
    const fetchPlanForDate = async () => {
      const dateKey = selectedDate.toISOString().split("T")[0];
      try {
        const response = await axios.get(`http://localhost:5000/api/meal-plan/${dateKey}`);
        const plan = response.data.plan || {}; // plan - объект, где ключи — это типы приёмов пищи, а значения — это рецепты, выбранные для этих приёмов пищи
        setSavedPlan(plan);
        setMealPlan(plan); // Устанавливаем план для редактирования
        calculateCalories(plan); // Пересчитываем калории для сохранённого плана
      } catch (err) {
        setSavedPlan(null);
        setMealPlan({});
        setTotalCalories(0); // Обнуляем калории, если план не найден
      }
    };
    fetchPlanForDate();
  }, [selectedDate]);

  // Функция подсчёта калорий
  const calculateCalories = (plan) => {
    const calories = Object.values(plan).reduce((total, recipe) => { // object.values - преобразование в массив
      return total + (recipe?.calories || 0); // Суммируем калории для выбранных рецептов
    }, 0);
    setTotalCalories(calories);
  };

  // Обработчик изменения рецепта для приёма пищи
  const handleMealChange = (mealType, recipeId) => {
    const recipe = recipes.find((r) => r._id === recipeId);
    setMealPlan((prev) => {
      const updatedPlan = { ...prev, [mealType]: recipe };
      calculateCalories(updatedPlan); // Пересчитываем калории для текущего плана
      return updatedPlan;
    });
  };

  // Сохранение плана
  const handleSavePlan = async () => {
    const dateKey = selectedDate.toISOString().split("T")[0];
    try {
      await axios.post("http://localhost:5000/api/meal-plan", {
        date: dateKey,
        plan: mealPlan,
      });
      alert("План сохранён!");
      setSavedPlan(mealPlan);
    } catch (err) {
      console.error("Ошибка сохранения плана:", err);
    }
  };

  const handleAddToCart = async (recipeId) => {
    const recipe = recipes.find((r) => r._id === recipeId);
    const ingredients = recipe ? recipe.ingredients : []; // Просто передаем весь массив
    console.log("Ингредиенты для добавления в корзину:", ingredients);

    try {
      await axios.post("http://localhost:5000/api/cart", { ingredients });
      alert("Ингредиенты добавлены в корзину!");
    } catch (err) {
      console.error("Ошибка добавления в корзину:", err);
    }
  };


  return (
    <div>
      <h2>Планировщик питания</h2>
      <Calendar onChange={setSelectedDate} value={selectedDate} />
      <div>
        <h3>Выбрана дата: {selectedDate.toDateString()}</h3>
        {["Завтрак", "Обед", "Ужин", "Десерт"].map((mealType) => (
          <div key={mealType}>
            <label>{mealType}</label>
            <select
              onChange={(e) => handleMealChange(mealType, e.target.value)}
              defaultValue={savedPlan?.[mealType]?._id || ""}
            >
              <option value="" disabled>
                Выберите рецепт
              </option>
              {recipes.map((recipe) => (
                <option key={recipe._id} value={recipe._id}>
                  {recipe.title}
                </option>
              ))}
            </select>
            <button onClick={() => handleAddToCart(mealPlan[mealType]?._id)}>
              Добавить ингредиенты в корзину
            </button>
          </div>
        ))}
      </div>
      <button onClick={handleSavePlan}>Сохранить план</button>
      {totalCalories > 0 && (
        <div>
          <h3>Общие калории на день: {totalCalories}</h3>
        </div>
      )}
      {savedPlan && (
        <div>
          <h3>Сохранённый план:</h3>
          <ul>
            {Object.entries(savedPlan).map(([mealType, recipe]) => (
              <li key={mealType}>
                {mealType}: {recipe?.title || "Не выбрано"}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default CalendarPage;


