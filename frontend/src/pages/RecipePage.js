import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function RecipePage() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/recipes/${id}`);
        setRecipe(response.data);
      } catch (err) {
        console.error("Error fetching recipe:", err);
      }
    };
    fetchRecipe();
  }, [id]);

  const toggleStep = (index) => {
    setCompletedSteps((prev) =>
      prev.includes(index) ? prev.filter((step) => step !== index) : [...prev, index]
    );
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? recipe.images.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === recipe.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  if (!recipe) return <p>Загрузка...</p>;

  return (
    <div className="recipe-page">
      <h2 className="cent">{recipe.title}</h2>
      {/* Слайдер изображений */}
      {recipe.images.length > 0 && (
        <div className="slider">
          <button className="prev" onClick={handlePrevImage}>←</button>
          <img
            src={`http://localhost:5000${recipe.images[currentImageIndex]}`}
            alt={`Image ${currentImageIndex + 1}`}
            className="slider-image"
          />
          <button className="next" onClick={handleNextImage}>→</button>
        </div>
      )}

      <p>{recipe.description}</p>
      <p><b>Категория:</b> {recipe.category}</p>
      <p><b>Сложность:</b> {recipe.complexity}</p>
      <p><b>Время приготовления:</b> {recipe.cookingTime} мин</p>
      <p><b>Количество порций:</b> {recipe.servings}</p>
      <p><b>Калорийность:</b> {recipe.calories} ккал</p>

      <h3>Шаги:</h3>
      <div className="steps">
        {recipe.steps.map((step, index) => (
          <div key={index} className="step">
            <label>
              <input
                type="checkbox"
                checked={completedSteps.includes(index)}
                onChange={() => toggleStep(index)}
              />
              <span>{step}</span>
            </label>
          </div>
        ))}
      </div>

      <h3>Ингредиенты:</h3>
      <ul>
        {recipe.ingredients.map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul>

      <h3>Советы:</h3>
      <p>{recipe.tips}</p>
    </div>
  );
}

export default RecipePage;

