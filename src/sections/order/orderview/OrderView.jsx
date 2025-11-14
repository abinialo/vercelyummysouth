import React, { useEffect, useState } from 'react'
import styles from './orderview.module.css'
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { FaLocationDot } from "react-icons/fa6";
import { FaUserCircle } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { Orderbyid, updateStatus } from '../../../utils/api/Serviceapi';
import Loader from '../../../components/loader/Loader';
const OrderView = () => {
    const [orderStatus, setStatus] = useState('');
    const handleStatusChange = (event) => {
        setStatus(event.target.value);
    };

    const [getloader, setgetLoader] = useState(false);

    const { id } = useParams();

    console.log(id);

    const [orders, setOrders] = useState({});

    const getOrder = async () => {
        setgetLoader(true)
        try {

            const response = await Orderbyid(id)
            // setCustomers(response.data?.data)
            const orderData = response.data?.data?.data?.[0];
            setOrders(orderData);
            setStatus(orderData?.orderStatus || '');
            console.log(response.data?.data)
            setgetLoader(false)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (id) {
            getOrder();
        }
    }, [id]);

    const [loader, setLoader] = useState(false);
    const update = async () => {
        setLoader(true)
        try {
            const response = await updateStatus(id, { orderStatus: orderStatus, inProgressAt: new Date() })
            getOrder();
            setLoader(false)
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <>
            {getloader ?
                <div className={styles.loader}>
                    <Loader />
                </div>
                :
                <div>
                    <div className={styles.orderHead}>
                        <div>
                            <p className='heading'>Order List</p>
                        </div>
                        <div>
                            <button
                                className="button"
                                style={{
                                    cursor: "default",
                                    backgroundColor:
                                        orders?.orderStatus?.toLowerCase() === "new"
                                            ? "blue"
                                            : orders?.orderStatus?.toLowerCase() === "assigned"
                                                ? "orange"
                                                : orders?.orderStatus?.toLowerCase() === "inprogress"
                                                    ? "#37c5fdff"
                                                    : orders?.orderStatus?.toLowerCase() === "delivered"
                                                        ? "green"
                                                        : orders?.orderStatus?.toLowerCase() === "cancelled"
                                                            ? "red"
                                                            : "lightgray",
                                    color: "white",
                                    border: "none",
                                    padding: "6px 12px",
                                    borderRadius: "6px",
                                    fontWeight: "500",
                                }}
                            >
                                {orders?.orderStatus
                                    ? orders.orderStatus.charAt(0).toUpperCase() +
                                    orders.orderStatus.slice(1).toLowerCase()
                                    : ""}
                            </button>
                        </div>
                    </div>
                    <div className={styles.orderDetails}>
                        <div >
                            <p className={styles.orderId}>OrderId: {orders?.orderCode}</p>
                            <p className={styles.orderDate}>Order Generated Date:  {orders?.createdAt
                                ? new Date(orders.createdAt).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                })
                                : ""}</p>
                        </div>

                        <div className={styles.customerDetails}>
                            <div className={styles.customerBox}>
                                <div>
                                    <p className={styles.head}><FaUserCircle className={styles.icon} />
                                        Customer Details</p>
                                    <div className={styles.customerName}>
                                        <p>{orders?.userDetails?.name}
                                        </p>
                                        <p> {orders?.userDetails?.mobileNo}</p>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.customerBox2}>
                                <div>
                                    <p className={styles.head}><FaLocationDot className={styles.icon} />
                                        Delivery Address
                                    </p>
                                    <div className={styles.customerName2}>
                                        <p>{orders?.address?.[0]?.fullAddress},{orders?.address?.[0]?.city},{orders?.address?.[0]?.state},{orders?.address?.[0]?.district}</p>

                                        <p> {orders?.userDetails?.mobileNo}</p>

                                        <p>  {orders?.address?.[0]?.postalCode}</p>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.customerBox}>
                                <div>
                                    <div style={{ width: '250px', margin: 'auto' }}>
                                        <Box >
                                            <FormControl fullWidth>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    value={orderStatus}
                                                    onChange={handleStatusChange}
                                                    sx={{
                                                        '& .MuiSelect-select': {
                                                            padding: '8.5px 14px',
                                                        },
                                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                            borderColor: '#c4c4c4',
                                                            borderWidth: 1,
                                                        },

                                                    }}
                                                >
                                                    <MenuItem value='new'>New</MenuItem>
                                                    <MenuItem value='assigned'>Assigned</MenuItem>
                                                    <MenuItem value='inprogress'>Inprogress</MenuItem>
                                                    <MenuItem value='delivered'>Delivered</MenuItem>
                                                    <MenuItem value='cancelled'>Cancelled</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Box>

                                        <div className={styles.save}>
                                            <button onClick={update} disabled={loader} style={{cursor:loader ?'not-allowed':'pointer', backgroundColor: loader ? 'gray' : 'red'}}>{loader ? "Updating..." : "Save"}</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.container}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Sl No</th>
                                    <th>Item name</th>
                                    <th>Quantity</th>
                                    <th>Total Amount</th>
                                </tr>
                            </thead>
                            <tbody>

                                {orders.cartDetails?.map((item, index) => (
                                    <tr key={item._id}>
                                        <td>{index + 1}</td>
                                        <td>{item.productDetails?.productName}  </td>
                                        <td>{item.counter}</td>
                                        <td>{item.totalPrice}</td>
                                    </tr>
                                ))}


                                {/* Summary rows */}
                                <tr>
                                    <td colSpan="3" className={styles.label}>Total Amount</td>
                                    <td>{orders.totalAmount}</td>
                                </tr>
                                <tr>
                                    <td colSpan="3" className={styles.label}>GST</td>
                                    <td>—</td>
                                </tr>
                                <tr>
                                    <td colSpan="3" className={styles.label}>Coupon Amount</td>
                                    <td>{orders.couponAmount}</td>
                                </tr>
                                <tr>
                                    <td colSpan="3" className={styles.label}>Delivery Charge</td>
                                    <td>{orders.deliveryCharges}</td>
                                </tr>
                                <tr className={styles.grandTotalRow}>
                                    <td colSpan="3" className={styles.label}>Grand Total</td>
                                    <td className={styles.grandTotal}>{orders.payableAmount}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            }
        </>
    )
}

export default OrderView