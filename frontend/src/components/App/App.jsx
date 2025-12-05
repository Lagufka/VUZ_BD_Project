import { BrowserRouter, Routes, Route } from "react-router-dom";
import TestPage from "../Hooks/TestPage.jsx"
import Navigation from "../Navigation/Navigation";
import HomePage from "../Pages/HomePage/HomePage";
import UserProfilePage from "../Pages/ProfilePage/UserProfilePage.jsx";
import ProductPage from "../Pages/ProductPage/ProductPage"
import UserAuthPage from "../Pages/AuthPage/UserAuthPage.jsx";
import PointAuthPage from "../Pages/AuthPage/PointAuthPage.jsx";
import SellerAuthPage from "../Pages/AuthPage/SellerAuthPage.jsx";
import UserRegisterPage from "../Pages/RegisterPages/UserRegistePage/UserRegisterPage";
import OrdersPage from "../Pages/OrderPage/OrdersPage";
import SellerRegisterPage from "../Pages/RegisterPages/SellerRegister/SellerRegisterPage.jsx"
import PointRegisterPage from "../Pages/RegisterPages/PointRegister/PointRegisterPage.jsx"
import PointManagePage from "../Pages/AuthPage/PointManagePage/PointManagePage.jsx";
import SellerOrdersPage from "../Pages/OrderPage/SellerOrdersPage.jsx";
import SellerProfilePage from "../Pages/ProfilePage/SellerProfilePage.jsx";


function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navigation profileId={1}/>

        <main>
          <Routes>
            <Route path="/" element={<HomePage/>} />

            <Route path="/test" element={<TestPage/>} />

            <Route path="/profile/:id" element={<UserProfilePage/>} />
            <Route path="/profile/:id/orders" element={<OrdersPage/>} />

            <Route path="/seller_profile/:id" element={<SellerProfilePage/>} />
            <Route path="/seller_profile/:id/orders" element={<SellerOrdersPage/>} />

            <Route path="/product/:id" element={<ProductPage/>} />

            <Route path="/user_auth" element={<UserAuthPage/>} />
            <Route path="/seller_auth" element={<SellerAuthPage/>} />
            <Route path="/point_auth" element={<PointAuthPage/>} />
            <Route path="/point_manage" element={<PointManagePage/>} />

            <Route path="/user_register" element={<UserRegisterPage/>} />
            <Route path="/seller_register" element={<SellerRegisterPage/>} />
            <Route path="/point_register" element={<PointRegisterPage/>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
