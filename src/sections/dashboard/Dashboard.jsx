import React, { useEffect, useState } from "react";
import styles from "./dashboard.module.css";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Pagination from "@mui/material/Pagination";
import img from "../../assets/dashboard/vector.png";
import img1 from "../../assets/dashboard/Vector1.png";
import img2 from "../../assets/dashboard/Vector2.png";
import img3 from "../../assets/dashboard/vector3.png";
import { FaUser, FaBox } from "react-icons/fa";
import { getOrderDashboard, orderDashboard, userDashboard } from "../../utils/api/Serviceapi";
import { BiExpandAlt } from "react-icons/bi";
import { Link } from "react-router-dom";







const Dashboard = () => {

  const [user, setUser] = useState({})
  const [order, setOrder] = useState({})
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    userDetails();
  }, [])

  useEffect(() => {
    orderDetails();
  }, [])



  useEffect(() => {
    getStocksproducts();
  }, [page])

  const userDetails = async () => {
    try {
      const response = await userDashboard();
      const data = response.data?.data;
      setUser(data);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const [chartData, setChartData] = useState([]);

  const orderDetails = async () => {
    try {
      const response = await orderDashboard();
      const data = response.data?.data;
      setOrder(data);

      const graph = data.graphResponse;

      // ✅ Two-point comparison (matches your uploaded image)
      const formattedGraphData = [
        { name: "Current Week", current: graph.currentWeek, previous: 0 },
        { name: "Previous Week", current: 0, previous: graph.lastWeek },
      ];

      setChartData(formattedGraphData);
    } catch (error) {
      console.error(error);
    }
  };

  const getStocksproducts = async () => {
    try {
      const limit = itemsPerPage;
      const offset = (page - 1) * itemsPerPage;

      const response = await getOrderDashboard(limit, offset);

      setOrders(response.data?.data?.data);
      setTotalItems(response.data?.data?.totalCount || 0);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.dashboard}>

      <div className={styles.cardcontainer}>
        <div className={styles.card}>
          <h3>New Orders</h3>
          <div className={styles.down}>
            <img src={img1} alt="" />
            <p>{order.newCount}</p>
          </div>
        </div>

        <div className={styles.card}>
          <h3>Active Orders</h3>
          <div className={styles.down}>
            <img src={img2} alt="" />
            <p>{order.assignedCount}</p>
          </div>
        </div>

        <div className={styles.card}>
          <h3>Delivered Orders</h3>
          <div className={styles.down}>
            <img src={img} alt="" />
            <p>{order.deliveredCount}</p>
          </div>
        </div>

        <div className={styles.card}>
          <h3>Cancel Orders</h3>
          <div className={styles.down}>
            <img src={img3} alt="" />
            <p>{order.cancelledCount}</p>
          </div>
        </div>
      </div>


      <div className={styles.bottomSection}>
        <div className={styles.chartBox}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12, fill: "#333" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#333" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                  fontSize: "12px",
                }}
              />
              <Legend
                verticalAlign="top"
                align="center"
                content={() => (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "25px",
                      marginBottom: "8px",
                      fontSize: "13px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span
                        style={{
                          width: "15px",
                          height: "10px",
                          backgroundColor: "#FFB6C1",
                          border: "1px solid #000",
                          display: "inline-block",
                        }}
                      ></span>
                      <span>Current Week</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span
                        style={{
                          width: "15px",
                          height: "10px",
                          backgroundColor: "#ADD8E6",
                          border: "1px solid #000",
                          display: "inline-block",
                        }}
                      ></span>
                      <span>Previous Week</span>
                    </div>
                  </div>
                )}
              />

              {/* ✅ Matching your uploaded style */}
              <Area
                type="monotone"
                dataKey="current"
                stroke="#000"
                strokeWidth={4}
                fill="#FFB6C1"
                fillOpacity={0.7}
                dot={{ r: 4, fill: "#FF69B4", stroke: "#000", strokeWidth: 1 }}
                activeDot={{ r: 5 }}
                name="Current Week"
              />
              <Area
                type="monotone"
                dataKey="previous"
                stroke="#87CEFA"
                strokeWidth={2}
                fill="#ADD8E6"
                fillOpacity={0.6}
                dot={{ r: 4, fill: "#87CEFA", stroke: "#000", strokeWidth: 1 }}
                name="Previous Week"
              />
            </AreaChart>
          </ResponsiveContainer>



        </div>


        <div className={styles.summaryCards}>
          <div className={styles.summaryCard}>
            <div className={styles.summaryHeader}>
              <h4>Customers</h4>
              <FaUser />
            </div>
            <p>
              <span style={{
                fontWeight: '600'
              }}> Mobile App Users :</span> <span style={{marginRight: '8px'}}>{user.appUserCount}</span>
            </p>
            <p>
              <span style={{
                fontWeight: ' 600'
              }}> Website Users :</span>  <span style={{marginRight: '8px'}}>{user.webUserCount}</span>
            </p>
          </div>

          <div className={styles.summaryCard}>
            <div className={styles.summaryHeader}>
              <h4>Stock Summary</h4>
              <FaBox />
            </div>
            <p>
              <span style={{
                fontWeight: ' 600',
                
              }}>  Stock In :</span> <span style={{marginRight: '8px'}}>{order?.stockResponse?.stockIn}</span>
            </p>
            <p>
              <span style={{
                fontWeight: ' 600'
              }}>    Stock Out :</span> <span style={{marginRight: '8px'}}>{order?.stockResponse?.stockOut}</span>
            </p>
          </div>
        </div>
      </div>


      <div className={styles.tableSection}>
        <table className={styles.orderTable}>
          <thead>
            <tr>
              <th>No.</th>
              <th>Order Id</th>
              <th>Price</th>
              <th>Quantity</th>
              <th className={styles.statusColumn}>Status <Link to="order"><BiExpandAlt className={styles.expandIcon}/></Link></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((item, index) => (
              <tr className='tabledata' key={item._id}>
                <td>{(page - 1) * itemsPerPage + index + 1}</td>
                <td>{item?.orderCode}</td>


                <td>
                  {item?.payableAmount}
                </td>
                <td>
                  {item?.totalQuantity}
                </td>
                <td
                  style={{
                    color:
                      item?.orderStatus?.toLowerCase() === "new"
                        ? "blue"
                        : item?.orderStatus?.toLowerCase() === "assigned"
                          ? "orange"
                          : item?.orderStatus?.toLowerCase() === "inprogress"
                            ? "#37c5fdff"
                            : item?.orderStatus?.toLowerCase() === "delivered"
                              ? "green"
                              : item?.orderStatus?.toLowerCase() === "cancelled"
                                ? "red"
                                : "black",
                  }}
                >
                  {item?.orderStatus
                    ? item.orderStatus.charAt(0).toUpperCase() +
                    item.orderStatus.slice(1).toLowerCase()
                    : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            padding: "10px 16px",
            fontSize: "14px",
            marginTop: "10px",
            gap: "10px",
          }}
        >
          <span style={{ marginRight: "8px", fontSize: "12px" }}>
            Items per page: {itemsPerPage}
          </span>

          <Pagination
            count={Math.ceil(totalItems / itemsPerPage)}
            page={page}
            onChange={(e, newPage) => setPage(newPage)}
            shape="rounded"
            siblingCount={0}
            boundaryCount={1}
            size="small"
          />

          <span style={{ fontSize: "12px" }}>
            {Math.min((page - 1) * itemsPerPage + 1, totalItems)}–
            {Math.min(page * itemsPerPage, totalItems)} of {totalItems}
          </span>
        </div>
      </div>
    </div >
  );
};

export default Dashboard;
