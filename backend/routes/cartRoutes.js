const express = require("express");
const Cart = require("../models/Cart");

const router = express.Router();

// Получение корзины
router.get("/", async (req, res) => {
  try {
    const cart = await Cart.findOne();
    res.status(200).json(cart || { ingredients: [] });
  } catch (err) {
    res.status(500).json({ error: "Ошибка при получении корзины" });
  }
});

// Добавление ингредиентов в корзину
router.post("/", async (req, res) => {
  const { ingredients } = req.body;

  try {
    let cart = await Cart.findOne();
    if (!cart) {
      cart = new Cart({ ingredients: [] });
    }

    cart.ingredients = [...new Set([...cart.ingredients, ...ingredients])];
    await cart.save();
    console.log("Saved cart:", cart);

    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: "Ошибка при добавлении в корзину" });
  }
});


// Очистка корзины
router.delete("/", async (req, res) => {
  try {
    await Cart.deleteOne({});
    res.status(200).json({ message: "Корзина очищена" });
  } catch (err) {
    res.status(500).json({ error: "Ошибка при очистке корзины" });
  }
});

module.exports = router;





// Очистить корзину
router.delete("/", async (req, res) => {
  try {
    await Cart.deleteMany();
    res.status(200).json({ message: "Корзина очищена" });
  } catch (err) {
    res.status(500).json({ error: "Ошибка очистки корзины", details: err });
  }
});


module.exports = router;
