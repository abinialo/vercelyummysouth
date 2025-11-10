import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  TextField,
  MenuItem,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { toast } from "react-toastify";
import styles from "./addcoupon.module.css";
import { AddCoupon, UpdateCoupon } from "../../../utils/api/Serviceapi"; 

const AddCouponModal = ({ open, handleClose, editData, refreshCoupons }) => {
  
  const initialForm = {
    couponName: "",
    basePrice: "", 
    amount: "",
    type: "",
    fromDate: "",
    endDate: "",
    status: "",
  };

  const [formData, setFormData] = useState(initialForm);
  const [touched, setTouched] = useState(false);

  
  useEffect(() => {
    if (open) {
      if (editData) {
        setFormData({
          couponName: editData.name || "",
          basePrice: editData.couponCode || "",
          amount: editData.amount || "",
          type: editData.type || "",
          fromDate: editData.startDate?.split("T")[0] || "",
          endDate: editData.endDate?.split("T")[0] || "",
          status: editData.status || "",
        });
      } else {
        setFormData(initialForm);
      }
      setTouched(false);
    }
  }, [open, editData]);

 
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

 
  const handleSubmit = async () => {
    setTouched(true);

    const isValid = Object.values(formData).every(
      (v) => v !== null && v !== undefined && String(v).trim() !== ""
    );

    if (!isValid) {
      toast.error("Please fill all required fields", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

   
    const payload = {
      name: formData.couponName,
      couponCode: formData.basePrice, 
      amount: formData.amount,
      type: formData.type,
      startDate: formData.fromDate,
      endDate: formData.endDate,
      status: formData.status,
    };

    try {
      if (editData) {
        await UpdateCoupon(editData._id, payload);
        toast.success("Coupon updated successfully!", {
          position: "top-center",
        });
      } else {
        await AddCoupon(payload);
        toast.success("Coupon added successfully!", { position: "top-center" });
      }

      handleClose();
      if (refreshCoupons) refreshCoupons();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!", { position: "top-center" });
    }
  };

 
  return (
    <Modal open={open} onClose={handleClose}>
      <Box className={styles.modalBox}>
    
        <Box className={styles.header}>
          <Typography className={styles.title}>
            {editData ? "Edit Coupon" : "Add Coupon"}
          </Typography>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Box>


        <Box className={styles.formGrid}>
          {[
            { label: "Coupon Name", name: "couponName" },
            { label: "Base Price", name: "basePrice" },
            { label: "Amount", name: "amount" },
          ].map((f) => (
            <TextField
              key={f.name}
              variant="standard"
              label={f.label}
              name={f.name}
              value={formData[f.name]}
              onChange={handleChange}
              required
              error={touched && !formData[f.name]}
              fullWidth
            />
          ))}

          <TextField
            variant="standard"
            select
            label="Type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            error={touched && !formData.type}
            fullWidth
          >
            <MenuItem value="percentage">Percentage</MenuItem>
            <MenuItem value="flat">Flat</MenuItem>
          </TextField>

          <TextField
            variant="standard"
            label="From Date"
            name="fromDate"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formData.fromDate}
            onChange={handleChange}
            required
            error={touched && !formData.fromDate}
            fullWidth
          />

          <TextField
            variant="standard"
            label="End Date"
            name="endDate"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formData.endDate}
            onChange={handleChange}
            required
            error={touched && !formData.endDate}
            fullWidth
          />

          <TextField
            variant="standard"
            select
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
            error={touched && !formData.status}
            fullWidth
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </TextField>
        </Box>

        {/* Buttons */}
        <Box className={styles.buttonGroup}>
          <Button
            variant="contained"
            className={styles.buttonPrimary}
            onClick={handleSubmit}
          >
            {editData ? "Update" : "Add"}
          </Button>
          <Button className={styles.buttonSecondary} onClick={handleClose}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddCouponModal;
