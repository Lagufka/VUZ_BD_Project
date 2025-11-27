import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "../Navigation/Navigation";
import HomePage from "../Pages/HomePage/HomePage";
import ProfilePage from "../Pages/ProfilePage/ProfilePage";
import ProductPage from "../Pages/ProductPage/ProductPage"
import AuthPage from "../Pages/AuthPage/AuthPage";
import UserRegisterPage from "../Pages/UserRegistePage/UserRegisterPage";
import OrdersPage from "../Pages/OrderPage/OrdersPage";


function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navigation profileId={1}/>

        <main>
          <Routes>
            <Route path="/" element={<HomePage/>} />
            <Route path="/profile/:id" element={<ProfilePage/>} />
            <Route path="/profile/:id/orders" element={<OrdersPage/>} />
            <Route path="/auth" element={<AuthPage/>} />
            <Route path="/product/:id" element={<ProductPage/>} />
            <Route path="/register" element={<UserRegisterPage/>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
