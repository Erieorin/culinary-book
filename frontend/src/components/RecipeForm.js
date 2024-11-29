import React, { useState } from "react";

function RecipeForm({ initialData = {}, onSubmit }) {
  const [formData, setFormData] = useState({
    title: initialData.title || "",
    description: initialData.description || "",
    category: initialData.category || "",
    complexity: initialData.complexity || "",
    cookingTime: initialData.cookingTime || "",
    servings: initialData.servings || "",
    steps: initialData.steps?.join("\n") || "",
    ingredients: initialData.ingredients?.join("\n") || "",
    tips: initialData.tips || "",
    images: initialData.images || [],
    calories: initialData.calories || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      steps: formData.steps.split("\n"),
      ingredients: formData.ingredients.split("\n"),
    });
  };
  
  return (
    <form onSubmit={handleFormSubmit}>
      <input
        type="text"
        name="title"
        placeholder="Название"
        value={formData.title}
        onChange={handleChange}
        required
      />
      <textarea
        name="description"
        placeholder="Описание"
        value={formData.description}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="category"
        placeholder="Категория (например, завтрак)"
        value={formData.category}
        onChange={handleChange}
      />
      <input
        type="text"
        name="complexity"
        placeholder="Сложность"
        value={formData.complexity}
        onChange={handleChange}
      />
      <input
        type="number"
        name="cookingTime"
        placeholder="Время приготовления (мин)"
        value={formData.cookingTime}
        onChange={handleChange}
      />
      <input
        type="number"
        name="servings"
        placeholder="Количество порций"
        value={formData.servings}
        onChange={handleChange}
      />
      <input
          type="number"
          name="calories"
          placeholder="Калорийность"
          value={formData.calories}
          onChange={handleChange}
        />
      <textarea
        name="steps"
        placeholder="Шаги приготовления (каждый шаг с новой строки)"
        value={formData.steps}
        onChange={handleChange}
      />
      <textarea
        name="ingredients"
        placeholder="Ингредиенты (каждый ингредиент с новой строки)"
        value={formData.ingredients}
        onChange={handleChange}
      />
      <textarea
        name="tips"
        placeholder="Советы по приготовлению"
        value={formData.tips}
        onChange={handleChange}
      />
      <button type="submit">Сохранить</button>
    </form>
  );
}

export default RecipeForm;
