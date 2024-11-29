import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CreateRecipePage from "./pages/CreateRecipePage";
import RecipePage from "./pages/RecipePage";
import EditRecipePage from "./pages/EditRecipePage"; 
import CalendarPage from "./pages/CalendarPage";
import ShoppingCartPage from "./pages/ShoppingCartPage";
import "./index.css";


function App() {
  return (
    <Router>
      <div className="app-container">
        <header>
          <h1>Кулинарная книга</h1>
          <nav>
            <a href="/">Главная</a>                                                                                                                   
            <a href="/create">Добавить рецепт</a>                                                                                                              
            <a href="/calendar">Календарь</a>                                                                                                                    
            <a href="/cart">Корзина</a>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />                                                                                                           
            <Route path="/create" element={<CreateRecipePage />} />
            <Route path="/recipe/:id" element={<RecipePage />} />
            <Route path="/recipe/edit/:id" element={<EditRecipePage />} />
            <Route path="/calendar" element={<CalendarPage />} /> {/* Календарь */}
            <Route path="/cart" element={<ShoppingCartPage />} /> {/* Корзина */}
          </Routes>
        </main>
        <footer>
          <p>&copy; 2024 Кулинарная книга</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;


// useState: для работы с состоянием.
// useEffect: для выполнения побочных эффектов (например, загрузка данных).
// useContext: для работы с контекстом.
// useRef: для управления DOM-элементами напрямую.