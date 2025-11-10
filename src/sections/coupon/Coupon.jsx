import React, { useState, useEffect, useCallback } from "react";
import styles from "./coupon.module.css";
import { RiEditFill } from "react-icons/ri";
import { MdDelete } from "react-icons/md";
import { Modal, Box, Typography, Button } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddCouponModal from "../../components/models/coupon/addcoupon";
import { getCoupons,DeleteCoupon } from "../../utils/api/Serviceapi";


const Coupon = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState(null);
  const [page, setPage] = useState(1);
  const [coupons, setCoupons] = useState([]);
  const [totalItems, setTotalItems] = useState(0);

  const itemsPerPage = 10;

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const fetchCoupons = useCallback(async () => {
    try {
      const limit = itemsPerPage;
      const offset = (page - 1) * limit;
      const response = await getCoupons(limit, offset);
      console.log("API Response:", response.data);

      if (response?.data?.status || response?.data?.code === 200) {
        const couponData = response.data.data?.data || [];
        const total = response.data.data?.totalCount || 0;

        setCoupons(couponData);
        setTotalItems(total);
      } else {
        setCoupons([]);
        setTotalItems(0);
        toast.error("Failed to fetch coupons");
      }
    } catch (error) {
      console.error("Error fetching coupons:", error);
      toast.error("Server error while fetching coupons");
    }
  }, [page]);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  const handleOpenAdd = () => {
    setSelectedCoupon(null);
    setOpenModal(true);
  };

  const handleOpenEdit = (coupon) => {
    setSelectedCoupon(coupon);
    setOpenModal(true);
  };

  const handleClose = () => setOpenModal(false);

  const handleOpenDelete = (coupon) => {
    setCouponToDelete(coupon);
    setOpenDelete(true);
  };

  const handleCloseDelete = () => setOpenDelete(false);

 const handleConfirmDelete = async () => {
  try {
    await DeleteCoupon(couponToDelete._id);
    toast.success(`Coupon "${couponToDelete.couponName}" deleted successfully!`, {
      position: "top-center",
      autoClose: 2000,
    });
    fetchCoupons(); 
  } catch (error) {
    console.error("Errors deleting coupon:", error);
    toast.error("Failed to delete coupon", { position: "top-center" });
  } finally {
    setOpenDelete(false);
  }
};
  const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};
  const indexOfFirstItem = (page - 1) * itemsPerPage + 1;
  const indexOfLastItem = Math.min(page * itemsPerPage, totalItems);

  return (
    <>
      <div className={styles.productContainer}>
        <div>
          <p className="heading">Coupon List</p>
        </div>

        <div className={styles.addProduct}>
          <button className="button" onClick={handleOpenAdd}>
            Add Coupon
          </button>
        </div>

        <div className={styles.tableContainer}>
          <table className="table">
            <thead>
              <tr className="tablehead">
                <th>No.</th>
                <th>Item Name</th>
                <th>Base Price</th>
                <th>Amount</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {coupons.length > 0 ? (
                coupons.map((coupon, index) => (
                  <tr key={coupon._id || index} className="tabledata">
                    <td>{indexOfFirstItem + index}</td>
                    <td>{coupon.name}</td>
                    <td>{coupon.basePrice}</td>
                     <td>
                   {coupon.type === "percentage"
            ? `${coupon.amount}%`
            : `₹${coupon.amount}`}
        </td>
                    <td>{formatDate(coupon.startDate)}</td>
                    <td>{formatDate(coupon.endDate)}</td>
                    <td>{coupon.status}</td>
                    <td>
                      <div className={styles.action}>
                        <RiEditFill
                          className={styles.edit}
                          onClick={() => handleOpenEdit(coupon)}
                        />
                        <MdDelete
                          className={styles.delete}
                          onClick={() => handleOpenDelete(coupon)}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center" }}>
                    No coupons found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              padding: "0 16px",
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
              onChange={handlePageChange}
              shape="rounded"
              siblingCount={0}
              boundaryCount={1}
              size="small"
            />
            <span style={{ fontSize: "12px" }}>
              {indexOfFirstItem}-{indexOfLastItem} of {totalItems}
            </span>
          </div>
        </div>
      </div>

      <AddCouponModal
        open={openModal}
        handleClose={handleClose}
        editData={selectedCoupon}
        refreshCoupons={fetchCoupons}
      />

      <Modal open={openDelete} onClose={handleCloseDelete}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 2,
            p: 4,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Delete Coupon
          </Typography>
          <Typography sx={{ mb: 3 }}>
            Are you sure you want to delete{" "}
            <strong>{couponToDelete?.couponName}</strong>?
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
            <Button
              variant="contained"
              sx={{
                textTransform: "none",
                backgroundColor: "#006400",
                "&:hover": { backgroundColor: "#004d00" },
              }}
              onClick={handleConfirmDelete}
            >
              Delete
            </Button>
            <Button
              variant="outlined"
              sx={{ textTransform: "none" }}
              onClick={handleCloseDelete}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>

      <ToastContainer />
    </>
  );
};

export default Coupon;
