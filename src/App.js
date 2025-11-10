import "./App.css";
import Navbar from "./layouts/header/Navbar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./sections/dashboard/Dashboard";
import Product from "./sections/products/Product";
import Stock from "./sections/stock/Stock";
import Login from "./sections/login/Login";
import Order from "./sections/order/Order";
import Coupon from "./sections/coupon/Coupon";
import Customers from "./sections/customers/Customers";
import Settings from "./sections/settings/Settings";
import Master from "./sections/master/Master";
import OrderView from "./sections/order/orderview/OrderView";
import PrivateRoute from "./utils/PrivateRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Navbar />}>
              <Route index element={<Dashboard />} />
              {/* <Route path="dashboard" element={<Dashboard />} /> */}
              <Route path="order" element={<Order />} />
              <Route path="product" element={<Product />} />
              <Route path="stock" element={<Stock />} />
              <Route path="coupon" element={<Coupon />} />
              <Route path="customers" element={<Customers />} />
              <Route path="settings" element={<Settings />} />
              <Route path="master" element={<Master />} />
              <Route path="orderview/:id" element={<OrderView />} />
            </Route>
          </Route>
          <Route path="/" element={<Login />} />
        </Routes>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
