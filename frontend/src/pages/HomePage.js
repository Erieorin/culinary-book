import React, { useEffect, useState } from "react";
import axios from "axios";
import RecipeList from "../components/RecipeList";
import { Link } from "react-router-dom";

function HomePage() {
  const [recipes, setRecipes] = useState([]);
  const [filters, setFilters] = useState({
    category: "",
    complexity: "",
    sortBy: "",
    cookingTime: "",
  });

  const fetchRecipes = async () => {
    try {
      const params = {};
      if (filters.category) params.category = filters.category;
      if (filters.complexity) params.complexity = filters.complexity;
      if (filters.cookingTime) params.cookingTime = filters.cookingTime;
      if (filters.sortBy) params.sortBy = filters.sortBy;

      const response = await axios.get("http://localhost:5000/api/recipes", { params });
      setRecipes(response.data);
    } catch (err) {
      console.error("Ошибка загрузки рецептов:", err);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleApplyFilters = (e) => {
    e.preventDefault();
    fetchRecipes();
  };

  // Обработчик для добавления в избранное
  const handleAddToFavorites = async (id) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/recipes/${id}/favorite`);
      console.log(response.data.message); // Логируем успех
      fetchRecipes(); // Обновляем список рецептов после изменения
    } catch (err) {
      console.error("Ошибка добавления в избранное:", err);
    }
  };

  return (
    <div className="home-page">
      <h2>Все рецепты</h2>
      <div className="filters">
        <select name="category" onChange={handleFilterChange} value={filters.category}>
          <option value="">Все категории</option>
          <option value="Завтрак">Завтрак</option>
          <option value="Обед">Обед</option>
          <option value="Ужин">Ужин</option>
          <option value="Десерт">Десерт</option>
        </select>
        <select name="complexity" onChange={handleFilterChange} value={filters.complexity}>
          <option value="">Любая сложность</option>
          <option value="Легко">Легко</option>
          <option value="Средне">Средне</option>
          <option value="Сложно">Сложно</option>
        </select>
        <input
          type="number"
          name="cookingTime"
          value={filters.cookingTime}
          onChange={handleFilterChange}
          placeholder="Макс. время (мин)"
        />
        <select name="sortBy" onChange={handleFilterChange} value={filters.sortBy}>
          <option value="">Сортировка</option>
          <option value="favorites">По избранному</option>
          <option value="cookingTime">По времени приготовления</option>
        </select>
        <button onClick={handleApplyFilters}>Применить фильтры</button>
      </div>
      <RecipeList recipes={recipes} onAddToFavorites={handleAddToFavorites} />
    </div>
  );
}

export default HomePage;



