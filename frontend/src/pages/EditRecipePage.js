import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function EditRecipePage() {
  const { id } = useParams(); // использует параметры их текущей ссылки
  const navigate = useNavigate(); // для перехода на другую страницу
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    complexity: "",
    cookingTime: "",
    servings: "",
    steps: "",
    ingredients: "",
    tips: "",
    images: [],
  });

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/recipes/${id}`);
        setFormData(response.data);
      } catch (err) {
        console.error("Ошибка загрузки рецепта:", err);
      }
    };
    fetchRecipe();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    const uploadFormData = new FormData();
    for (let file of files) {
      uploadFormData.append("images", file);
    }
    try {
      const response = await axios.post("http://localhost:5000/api/upload", uploadFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFormData((prevData) => ({
        ...prevData,
        images: [...prevData.images, ...response.data.filePaths],
      }));
    } catch (err) {
      console.error("Ошибка загрузки изображений:", err);
    }
  };

  const handleImageDelete = async (imagePath) => {
    try {
      await axios.delete(`http://localhost:5000/api/recipes/${id}/image`, {
        data: { imagePath },
      });
      setFormData((prevData) => ({
        ...prevData,
        images: prevData.images.filter((img) => img !== imagePath),
      }));
    } catch (err) {
      console.error("Ошибка удаления изображения:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/recipes/${id}`, formData);
      alert("Рецепт успешно обновлен!");
      navigate("/");
    } catch (err) {
      console.error("Ошибка обновления рецепта:", err);
    }
  };

  return (
    <div className="recipe-page">
      <h2>Редактировать рецепт</h2>
      <form onSubmit={handleSubmit} className="form">
        <label>Название</label>
        <input
          type="text"
          name="title"
          placeholder="Название"
          value={formData.title}
          onChange={handleChange}
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

        <label>Калорийность(ккал)</label>
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
        
        {formData.images.length > 0 && (
          <div className="image-preview">
            <h4>Текущие изображения:</h4>
            <div style={{ display: "flex", gap: "10px" }}>
              {formData.images.map((img, idx) => (
                <div key={idx} style={{ position: "relative" }}>
                  <img
                    src={`http://localhost:5000${img}`}
                    alt={`Preview ${idx}`}
                    style={{ width: "100px", height: "100px", objectFit: "cover" }}
                  />
                  <button
                    onClick={() => handleImageDelete(img)}
                    style={{
                      position: "absolute",
                      top: "0",
                      right: "0",
                      backgroundColor: "red",
                      color: "white",
                      border: "none",
                      padding: "5px",
                      cursor: "pointer",
                    }}
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <button type="submit">Сохранить</button>
      </form>
    </div>
  );
}

export default EditRecipePage;
