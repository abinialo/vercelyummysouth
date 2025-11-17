import React, { useEffect, useState } from "react";
import styles from "./stock.module.css";
import { Switch } from "antd";
import { RiEditFill } from "react-icons/ri";
import { IoSearchSharp } from "react-icons/io5";
import Pagination from "@mui/material/Pagination";
import { Modal, Box, Typography, TextField, Button, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import { editStocks, getStocks } from "../../utils/api/Serviceapi";
import { IoIosCloseCircle } from "react-icons/io";
import Loader from '../../components/loader/Loader';
import { toast } from "react-toastify";

const Stock = () => {
  const [open, setOpen] = useState(false);
  const [availableProductQuantity, setQuantity] = useState("");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('')
  const [stocks, setStocks] = useState([])
  const [selectedProductId, setSelectedProductId] = useState(null);
  const itemsPerPage = 10;
  const [totalItems, setTotalItems] = useState(0);
  const [getloader, setgetLoader] = useState(false)
  const [editLoader, setEditLoader] = useState(false)
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setStocks([])
    setPage(1);
  };

  useEffect(() => {
    getStocksproducts()
  }, [search, page])

  const handleOpen = (id) => {
    setSelectedProductId(id);
    setOpen(true);
  };
  const handleClose = () => (setOpen(false),
    setSelectedProductId(null),
    setQuantity(''));

  const handleUpdate = async () => {
    if (!availableProductQuantity) return toast.error("Please enter available quantity");
    setEditLoader(true)
    try {
      const response = await editStocks(selectedProductId, {
        availableProductQuantity,
      });
      console.log("Updated product:", response.data);
      getStocksproducts();
      setOpen(false);
      setQuantity("");
      setEditLoader(false)
    } catch (error) {
      console.error("Error updating stock:", error);
      setEditLoader(false)
    }
  };

  const getStocksproducts = async () => {
    setgetLoader(true)
    try {
      const limit = itemsPerPage;
      const offset = (page - 1) * itemsPerPage;
      const response = await getStocks(search, limit, offset)
      setStocks(response.data?.data?.data)
      // console.log(response.data.data)
      setTotalItems(response.data?.data?.totalCount || 0);
      setgetLoader(false)
    } catch (error) {
      console.log(error)
      setgetLoader(false)
    }
  }

  const handleStatusChange = async (checked, id) => {
    const newStatus = checked ? "active" : "inactive";
    try {
      const response = await editStocks(id, { status: newStatus });
      console.log("Status updated:", response.data);
      getStocksproducts();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <>
      <div className={styles.productContainer}>
        <div className={styles.stockHead}>
          <div>
            <p className="heading">Stock Management</p>
          </div>
          <div style={{ width: '400px' }} className={styles.searchContainer}>
            <div className='search'>
              <input type="text" placeholder='Search Orders' value={search} onChange={handleSearchChange} />
              {search.length > 0 &&
                <IoIosCloseCircle onClick={() => setSearch('')} className='searchclose' />
              }
              <IoSearchSharp />
            </div>
          </div>
        </div>
        <div className={styles.tableContainer}>
          <table className="table">
            <thead className="tablehead">
              <tr>
                <th>No.</th>
                <th>Active</th>
                <th>Availablity</th>
                <th>Item Name</th>
                <th>Total Available Quant(kg)</th>
                <th>Price per kg</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="tabledata">
              {getloader ?
                <tr className='tabledata1'>
                  <td colSpan={7} style={{ textAlign: "center" }}>
                    <Loader />

                  </td>
                </tr>
                :
                stocks.length <= 0 ? <tr className='tabledata1'>
                  <td colSpan={7} style={{ textAlign: "center" }}>No Data Found</td>
                </tr> :
                  stocks.map((item, index) => (
                    <tr key={item._id}>
                      <td>{(page - 1) * itemsPerPage + index + 1}</td>
                      <td>
                        <Switch
                          checked={item.status === "active"}
                          onChange={(checked) => handleStatusChange(checked, item._id)}
                          className="custom-switch"
                        />                    </td>
                      <td>
                        {item.availableProductQuantity !== 0 ?
                          <button className={styles.stock}>Stock In</button>
                          : <button className={styles.stockOut}>Sold Out</button>}
                      </td>
                      <td>{item.productName}</td>
                      <td>{Number(item.availableProductQuantity || 0).toFixed(2)}</td>                    <td>{item.priceDetails[0].price} ({item.priceDetails[0].prodQuantity} {item.priceDetails[0].uom} )</td>
                      <td>
                        <div className={styles.action}>
                          <RiEditFill className={styles.edit} onClick={() => handleOpen(item._id)} />
                        </div>
                      </td>
                    </tr>
                  ))}



            </tbody>
          </table>

          {stocks.length > 0 &&
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


      <Modal open={open} onClose={handleClose}>
        <Box className={styles.modalBox}>
          <div className={styles.modalHeader}>
            <Typography variant="h6" sx={{ fontWeight: "bold",color: "#0B6623",textAlign: "center" }}>
              Edit Product
            </Typography>
            <IconButton onClick={handleClose}>
              <Close />
            </IconButton>
          </div>

          <TextField
            label="Available Quantity"
            fullWidth
            variant="outlined"
            value={availableProductQuantity}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*\.?\d*$/.test(value)) {
                setQuantity(value);
              }
            }}
            inputProps={{
              inputMode: "decimal", 
              pattern: "[0-9]*",    
            }}
            className={styles.textField}
          />
          <Button variant="contained" disabled={editLoader} style={{ cursor: editLoader ? 'not-allowed' : 'pointer', backgroundColor: editLoader ? 'gray' : '#004d25' }} className={styles.updateBtn} onClick={handleUpdate}>
            {editLoader ? 'Loading...' : 'Update'}
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default Stock;
