import React, { useState, useEffect } from "react";
import axios from "axios";

function ShoppingCartPage() {
  const [cart, setCart] = useState([]);

  // Загрузка корзины
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/cart");
        setCart(response.data.ingredients || []);
      } catch (err) {
        console.error("Ошибка загрузки корзины:", err);
      }
    };
    fetchCart();
  }, []);

  // Очистка корзины
  const clearCart = async () => {
    try {
      await axios.delete("http://localhost:5000/api/cart");
      setCart([]);
      alert("Корзина очищена!");
    } catch (err) {
      console.error("Ошибка очистки корзины:", err);
    }
  };

  return (
    <div>
      <h2>Корзина</h2>
      {cart.length === 0 ? (
        <p>Корзина пуста</p>
      ) : (
        <ul>
          {cart.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
      )}
      <button onClick={clearCart}>Очистить корзину</button>
    </div>
  );
}


export default ShoppingCartPage;
