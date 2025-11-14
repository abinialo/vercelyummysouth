import React, { useState } from 'react';
import styles from './navbar.module.css';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../assets/YS LOGO green.png';
import {
  FaUserCircle,
  FaBars,
  FaChartLine,
  FaUser,
  FaBox,
  FaDatabase,
  FaGift,
  FaUsers,
  FaFileAlt,
  FaCog,
  FaSignOutAlt
} from "react-icons/fa";
import { Drawer } from 'antd';


const Navbar = () => {
  const [isLogOpen, setLogIsOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const toggleSidebar = () => setIsOpen(!isOpen);
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/");
  };

  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const menuItems = [
    { icon: <FaChartLine />, label: "Dashboard", path: "" },
    { icon: <FaUser />, label: "Master", path: "master" },
    { icon: <FaBox />, label: "Products", path: "product" },
    { icon: <FaDatabase />, label: "Stock management", path: "stock" },
    { icon: <FaGift />, label: "Coupon", path: "coupon" },
    { icon: <FaUsers />, label: "Customers", path: "customers" },
    { icon: <FaFileAlt />, label: "Order Details", path: "order" },
    { icon: <FaCog />, label: "Settings", path: "settings" },
    { icon: <FaSignOutAlt />, label: "Logout", path: "logout" },
 
  ];

  return (
    <>
      <div className={styles.navbar}>
        <div className={styles.navbarcontainer}>
          <div>
            <div className={styles.logo}>
              <Link to='/dashboard'>
                <img src={logo} alt="logo" />
              </Link>
            </div>
          </div>
          <div className={styles.user}>
            <FaUserCircle
              style={{ fontSize: '19px', cursor: 'pointer' }}
              onClick={() => setLogIsOpen(!isLogOpen)}
              title='Admin'
            />
            {isLogOpen && (
              <div className={styles.logoutdiv}>
                <p onClick={handleLogout} >Logout</p>
              </div>
            )}
          </div>
          <div className={styles.menusm}>
            <FaBars className={styles.menu_icon} onClick={showDrawer} />

          </div>
        </div>
      </div>

      <div className={styles.layoutcontainer}>
        <div className={styles.navbarlayout}>
          <div className={`${styles.sidebar} ${isOpen ? styles.open : styles.collapsed}`}>
            <ul className={styles.menu}>
              <li className={styles.menu_item} onClick={toggleSidebar}>
                <div className={styles.top_section}>
                  <FaBars className={styles.menu_icon} />
                </div>
              </li>
              {menuItems.map((item, index) => {
                const isOrderActive =
                  location.pathname.startsWith("/dashboard/order") ||
                  location.pathname === "/dashboard/orderview";

                const isActive =
                  item.path === "order"
                    ? isOrderActive
                    : location.pathname === `/dashboard/${item.path}` ||
                    (item.path === "" && location.pathname === "/dashboard");
               return item.label === "Logout" ? (
  <li
    key={index}
    className={styles.menu_item}
    onClick={() => navigate("/dashboard/logout")}
  >
    <span className={styles.icon}>{item.icon}</span>
    {isOpen && <span className={styles.label}>{item.label}</span>}
  </li>
) : (
                  <NavLink
                    key={index}
                    to={item.path}
                    end={item.path === ""}
                    className={
                      isActive ? `${styles.menu_link} ${styles.active}` : styles.menu_link
                    }
                  >
                    <li className={styles.menu_item}>
                      <span className={styles.icon}>{item.icon}</span>
                      {isOpen && <span className={styles.label}>{item.label}</span>}
                    </li>
                  </NavLink>
                );
              })}

            </ul>
          </div>
        </div>
        <div className={`${isOpen ? styles.content : styles.collapsedContent}`}>
          <Outlet />
        </div>
      </div>

      <div>

        <Drawer

          closable={{ 'aria-label': 'Close Button' }}
          onClose={onClose}
          open={open}
        >
          {menuItems.map((item, index) => {
            const isOrderActive =
              location.pathname.startsWith("/dashboard/order") ||
              location.pathname === "/dashboard/orderview";

            const isActive =
              item.path === "order"
                ? isOrderActive
                : location.pathname === `/dashboard/${item.path}` ||
                (item.path === "" && location.pathname === "/dashboard");
            return item.label === "Logout" ? (
              <li key={index} className={styles.menu_item} onClick={handleLogout}>
                <span className={styles.icon}>{item.icon}</span>
                {isOpen && <span className={styles.label}>{item.label}</span>}
              </li>
            ) : (
              <NavLink
                key={index}
                to={item.path}
                end={item.path === ""}
                className={
                  isActive ? `${styles.menu_link} ${styles.active}` : styles.menu_link
                }
              
              >
                <li className={styles.menu_item}   onClick={onClose}>
                  <span className={styles.icon}>{item.icon}</span>
                  {isOpen && <span className={styles.label}>{item.label}</span>}
                </li>
              </NavLink>
            );
          })} 
        </Drawer>
      </div>
    </>
  );
};

export default Navbar;
