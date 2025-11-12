import { useEffect, useState } from 'react'
import styles from './Order.module.css'
import { IoSearchSharp } from "react-icons/io5";
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { DatePicker } from 'antd';
import Pagination from "@mui/material/Pagination";
import { Link } from 'react-router-dom';
import { dropDown, excelOrders, getOrders } from '../../utils/api/Serviceapi';
import { IoIosCloseCircle } from "react-icons/io";
import dayjs from 'dayjs';
import { set } from 'date-fns';
import Loader from '../../components/loader/Loader';
const Order = () => {

  const [orders, setOrders] = useState([])
  const [selectedRange, setSelectedRange] = useState([]);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('')
  const itemsPerPage = 10;
  const [totalItems, setTotalItems] = useState(0);
  const [id, setId] = useState('')


  const [status, setStatus] = useState('all');
  let getExcel = async () => {
    try {

      const formatDate = (date) => date ? date.toLocaleDateString('en-CA') : '';

      const fromDate = selectedRange.length ? formatDate(selectedRange[0].startDate) : '';
      const toDate = selectedRange.length ? formatDate(selectedRange[0].endDate) : '';

      // ✅ Call your API with extra params
      let res = await excelOrders(status, name, fromDate, toDate); console.log("Axios response:", res);

      // The Base64 string is here
      let base64String = res.data.data;

      if (!base64String) {
        alert("No Excel file data found");
        return;
      }

      // Clean (just in case)
      base64String = base64String.replace(/\s/g, "");

      // Convert Base64 → Blob
      const byteCharacters = atob(base64String);
      const byteNumbers = new Array(byteCharacters.length)
        .fill()
        .map((_, i) => byteCharacters.charCodeAt(i));
      const byteArray = new Uint8Array(byteNumbers);

      const blob = new Blob([byteArray], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // Trigger download
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "orderDetails.xlsx";
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (err) {
      console.log("Error downloading Excel:", err);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setOrders([])
    setPage(1);
  };
  const [name, setName] = useState('all');

  useEffect(() => {
    getStocksproducts();
  }, [search, page, name, status, selectedRange]);


  const { RangePicker } = DatePicker;

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
    setOrders([])
    setPage(1);
  };
  const handleNameChange = (event) => {
    setName(event.target.value);
    setOrders([])
    setPage(1);
  };
  const [loader, setLoader] = useState(false)

  const getStocksproducts = async () => {
    setLoader(true)
    try {
      const limit = itemsPerPage;
      const offset = (page - 1) * itemsPerPage;

      const formatDate = (date) => date ? date.toLocaleDateString('en-CA') : '';

      const fromDate = selectedRange.length ? formatDate(selectedRange[0].startDate) : '';
      const toDate = selectedRange.length ? formatDate(selectedRange[0].endDate) : '';

      const response = await getOrders(search, limit, offset, name, status, fromDate, toDate);

      setOrders(response.data?.data?.data);
      setTotalItems(response.data?.data?.totalCount || 0);
      setLoader(false)
    } catch (error) {
      console.log(error);
    }
  };



  const [customers, setCustomers] = useState([])
  const getCustomer = async () => {
    try {

      const response = await dropDown()
      setCustomers(response.data?.data)

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getCustomer()
  }, [])



  return (
    <>

      <div className={styles.productContainer}>
        <div className={styles.orderHead}>
          <div>
            <p className='heading'>Order List</p>{id}
          </div>
          <div>
            <button className='button' onClick={getExcel}>Export</button>
          </div>
        </div>

        <div className={styles.orderFilter}>
          <div style={{ width: '250px' }}>
            <Box >
              <FormControl fullWidth>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={status}
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
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value='new'>New</MenuItem>
                  <MenuItem value='assigned'>Assigned</MenuItem>
                  <MenuItem value='inprogress'>Inprogress</MenuItem>
                  <MenuItem value='delivered'>Delivered</MenuItem>
                  <MenuItem value='cancelled'>Cancelled</MenuItem>

                </Select>
              </FormControl>
            </Box>
          </div>
          <div style={{ width: '250px' }}>
            <Box >
              <FormControl fullWidth>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={name}
                  onChange={handleNameChange}
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

                  <MenuItem value='all' >All</MenuItem>
                  {customers.map((item) => (
                    <MenuItem value={item._id} key={item._id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </div>
          <div>
            <RangePicker
              format="YYYY-MM-DD"
              onChange={(dates) => {
                if (dates && dates.length === 2) {
                  setSelectedRange([
                    {
                      startDate: dates[0].toDate(),
                      endDate: dates[1].toDate(),
                      key: "selection",
                    },
                  ]);
                } else {
                  setSelectedRange([]); // No range selected
                }
              }}
              value={
                selectedRange.length
                  ? [dayjs(selectedRange[0].startDate), dayjs(selectedRange[0].endDate)]
                  : [] // no default selection
              }
            />
          </div>
          <div style={{ width: '250px' }}>
            <div className='search'>
              <input type="text" placeholder='Search Stocks' value={search} onChange={handleSearchChange} />
              {search.length > 0 &&
                <IoIosCloseCircle onClick={() => setSearch('')} className='searchclose' />
              }
              <IoSearchSharp />
            </div>
          </div>
        </div>

        <div className={styles.tableContainer}>
          <table className='table'>
            <tr className='tablehead'>
              <th>No.</th>
              <th>	Customer Name</th>
              <th>Order ID</th>
              <th>Created Date</th>
              <th>	Amount</th>
              <th>Qty</th>
              <th>Order status</th>
              <th>Payment Mode</th>
              <th>	Payment Status</th>
              <th>	Action</th>
            </tr>
            {loader ? <tr className='tabledata'>
              <td colSpan={10} style={{ textAlign: "center" }}><Loader /></td>
            </tr> :
              orders.length <= 0 ? <tr className='tabledata'>
                <td colSpan={10} style={{ textAlign: "center" }}>No Data Found</td>
              </tr> :
                orders.map((item, index) => (
                  <tr className='tabledata' key={item._id}>
                    <td>{(page - 1) * itemsPerPage + index + 1}</td>
                    <td>{item?.userDetails?.name}</td>
                    <td>{item?.orderCode}</td>
                    <td>
                      {item?.createdAt
                        ? new Date(item.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                        : ""}
                    </td>

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

                    <td>{item?.paymentMode}</td>
                    <td>{item?.paymentStatus}</td>
                    <td>
                      <Link to={`/dashboard/orderview/${item._id}`} >  <button className={styles.stock} style={{ cursor: 'pointer' }}>View</button></Link>
                    </td>
                  </tr>
                ))}
          </table>
          {orders.length > 0 &&
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
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
          }
        </div>
      </div>


    </>
  )
}

export default Order