import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "../Layout/Header.jsx";

import HomePage from "../Pages/HomePage/HomePage.jsx";
import ProductPage from "../Pages/Product/ProductPage.jsx";

import UserAuthPage from "../Pages/User/UserAuthPage.jsx";
import UserRegisterPage from "../Pages/User/UserRegisterPage.jsx";
import UserProfilePage from "../Pages/User/UserProfilePage.jsx";
import UserOrdersPage from "../Pages/User/UserOrdersPage.jsx";

import PointAuthPage from "../Pages/Point/PointAuthPage.jsx";
import PointRegisterPage from "../Pages/Point/PointRegisterPage.jsx";
import PointManagePage from "../Pages/Point/PointManagePage.jsx";

import SellerAuthPage from "../Pages/Seller/SellerAuthPage.jsx";
import SellerRegisterPage from "../Pages/Seller/SellerRegisterPage.jsx";
import SellerOrdersPage from "../Pages/Seller/SellerOrdersPage.jsx";
import SellerProfilePage from "../Pages/Seller/SellerProfilePage.jsx";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header profileId={1} />

        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />

            <Route path="/user_profile/" element={<UserProfilePage />} />
            <Route path="/user_profile/orders" element={<UserOrdersPage />} />

            <Route path="/seller_profile/:id" element={<SellerProfilePage />} />
            <Route
              path="/seller_profile/:id/orders"
              element={<SellerOrdersPage />}
            />

            <Route path="/product/:id" element={<ProductPage/>} />

            <Route path="/user_auth" element={<UserAuthPage />} />
            <Route path="/seller_auth" element={<SellerAuthPage />} />
            <Route path="/point_auth" element={<PointAuthPage />} />
            <Route path="/point_manage" element={<PointManagePage />} />

            <Route path="/user_register" element={<UserRegisterPage />} />
            <Route path="/seller_register" element={<SellerRegisterPage />} />
            <Route path="/point_register" element={<PointRegisterPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
