import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function RecipeList({ recipes }) {
  const handleFavorite = async (id) => {
    try {
      await axios.post(`http://localhost:5000/api/recipes/${id}/favorite`);
      alert("Рецепт добавлен в избранное!");
      window.location.reload(); // перезагружаем список рецептов
    } catch (err) {
      console.error("Ошибка добавления в избранное:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Вы уверены, что хотите удалить этот рецепт?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/recipes/${id}`);
      alert("Рецепт успешно удален");
      window.location.reload(); // Перезагружаем список рецептов
    } catch (err) {
      console.error("Ошибка удаления рецепта:", err);
    }
  };

  return (
    <div className="recipe-list">
      {recipes.map((recipe) => (
        <div key={recipe._id} className="recipe-card">
          <img src={`http://localhost:5000${recipe.images[0]}`} className="img-card" alt="Recipe" />
          <div className="recipe-details">
            <h3>{recipe.title}</h3>
            <p>{recipe.description}</p>
            <p>Категория: {recipe.category}</p>
            <p>Сложность: {recipe.complexity}</p>
            <p>Время приготовления: {recipe.cookingTime} минут</p>
            <p>Избранное: {recipe.favorites || 0}</p>
            <button onClick={() => handleFavorite(recipe._id)} className="favorite-button">
              Добавить в избранное
            </button>
            <Link to={`/recipe/${recipe._id}`} className="detail-link">
              Подробнее
            </Link>
            <button onClick={() => handleDelete(recipe._id)} className="delete-button">
              Удалить
            </button>
            <Link to={`/recipe/edit/${recipe._id}`} className="edit-link">
              Редактировать
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

export default RecipeList;

