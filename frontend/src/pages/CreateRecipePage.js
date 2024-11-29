import React, { useState } from "react";
import axios from "axios";

function CreateRecipePage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Завтрак", // Значение по умолчанию
    complexity: "Легко", // Значение по умолчанию
    cookingTime: "",
    servings: "",
    calories: "", // Новое поле
    steps: "",
    ingredients: "",
    tips: "",
    images: [],
  });
  const [images, setImages] = useState([]); 
  

  const handleImageUpload = async (e) => { // обработка изображений
    const files = e.target.files;
    const formData = new FormData();
    for (let file of files) {
      formData.append("images", file);
    }
    try {
      const response = await axios.post("http://localhost:5000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setImages(response.data.filePaths);
    } catch (err) {
      console.error("Ошибка загрузки изображений:", err);
    }
  };

  const handleChange = (e) => {  // функция изменения данных
    const { name, value } = e.target; // имя и значение переменной
    setFormData({ ...formData, [name]: value }); 
  };

  const handleSubmit = async (e) => { // функция загрузки данных
    e.preventDefault(); // страница не перезагружается
    try {
      await axios.post("http://localhost:5000/api/recipes", {
        ...formData,
        steps: formData.steps.split("\n"),
        ingredients: formData.ingredients.split("\n"),
        images,
      });
      alert("Рецепт успешно добавлен!");
      setFormData({
        title: "",
        description: "",
        category: "Завтрак",
        complexity: "Легко",
        cookingTime: "",
        servings: "",
        calories: "",
        steps: "",
        ingredients: "",
        tips: "",
        images: [],
      });
    } catch (err) {
      console.error("Error creating recipe:", err);
      alert("Ошибка при добавлении рецепта!");
    }
  };

  return (
    <div className="recipe-page">
      <h2>Добавить новый рецепт</h2>
      <form onSubmit={handleSubmit} className="form">
        <label>Название</label>
        <input
          type="text"
          name="title"
          placeholder="Название"
          value={formData.title}
          onChange={handleChange} // обработчик изменений, который обновляет состояние
          required
        />

        <label>Описание</label>
        <textarea
          name="description"
          placeholder="Описание"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <label>Категория</label>
        <select name="category" value={formData.category} onChange={handleChange}>
          <option value="Завтрак">Завтрак</option>
          <option value="Обед">Обед</option>
          <option value="Ужин">Ужин</option>
          <option value="Десерт">Десерт</option>
        </select>

        <label>Сложность</label>
        <select name="complexity" value={formData.complexity} onChange={handleChange}>
          <option value="Легко">Легко</option>
          <option value="Средне">Средне</option>
          <option value="Сложно">Сложно</option>
        </select>

        <label>Время приготовления (мин.)</label>
        <input
          type="number"
          name="cookingTime"
          placeholder="Время приготовления"
          value={formData.cookingTime}
          onChange={handleChange}
        />

        <label>Количество порций</label>
        <input
          type="number"
          name="servings"
          placeholder="Количество порций"
          value={formData.servings}
          onChange={handleChange}
        />

        <label>Калорийность (ккал)</label>
        <input
          type="number"
          name="calories"
          placeholder="Калорийность"
          value={formData.calories}
          onChange={handleChange}
        />

        <label>Шаги приготовления</label>
        <textarea
          name="steps"
          placeholder="Каждый шаг с новой строки"
          value={formData.steps}
          onChange={handleChange}
        />

        <label>Ингредиенты</label>
        <textarea
          name="ingredients"
          placeholder="Каждый ингредиент с новой строки"
          value={formData.ingredients}
          onChange={handleChange}
        />

        <label>Советы</label>
        <textarea
          name="tips"
          placeholder="Советы по приготовлению"
          value={formData.tips}
          onChange={handleChange}
        />

        <label>Изображения</label>
        <input type="file" multiple onChange={handleImageUpload} />

        <button type="submit">Добавить рецепт</button>
      </form>
    </div>
  );
}

export default CreateRecipePage;
