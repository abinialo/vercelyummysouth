import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  TextField,
  MenuItem,
  Typography,
  IconButton,
  Button,
  Switch,
} from "@mui/material";
import { Close, Add, Delete } from "@mui/icons-material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  AddProduct,
  UpdateProduct,
  getAllCategory,
  uploadProductImages,
} from "../../../utils/api/Serviceapi";

const AddProductModal = ({
  open,
  handleClose,
  title = "Add Product",
  productData,
  refreshProducts, 
}) => {
  const [formData, setFormData] = useState({
    categoryId: "",
    productName: "",
    status: "active",
    availableProductQuantity: "",
    description: "",
    recommended: false,
  });

  const [errors, setErrors] = useState({});
  const [priceDetails, setPriceDetails] = useState([
    { prodQuantity: "", uom: "", price: "", cutprice: "" },
  ]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [categories, setCategories] = useState([]);

 
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategory();
        if (response?.data?.status || response?.data?.code === 200) {
          setCategories(response?.data?.data || []);
        } else {
          toast.error("Failed to load categories");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Something went wrong while loading categories");
      }
    };
    if (open) fetchCategories();
  }, [open]);

 
  useEffect(() => {
    if (open && productData) {
      setFormData({
        categoryId: productData.categoryId || "",
        productName: productData.productName || "",
        status: productData.status || "active",
        availableProductQuantity: productData.availableProductQuantity || "",
        description: productData.description || "",
        recommended: productData.recommended || false,
      });

      setPriceDetails(
        productData.priceDetails?.length
          ? productData.priceDetails
          : [{ prodQuantity: "", uom: "", price: "", cutprice: "" }]
      );

      setSelectedFiles(productData.imgUrl || []);
    } else if (!open) {
      setFormData({
        categoryId: "",
        productName: "",
        status: "active",
        availableProductQuantity: "",
        description: "",
        recommended: false,
      });
      setPriceDetails([{ prodQuantity: "", uom: "", price: "", cutprice: "" }]);
      setErrors({});
      setSelectedFiles([]);
    }
  }, [open, productData]);

  // ✅ Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      const updated = { ...errors };
      delete updated[name];
      setErrors(updated);
    }
  };

  const handlePriceChange = (index, field, value) => {
    const updated = [...priceDetails];
    updated[index][field] = value;
    setPriceDetails(updated);
  };

  const handleAddPriceDetail = () => {
    setPriceDetails([
      ...priceDetails,
      { prodQuantity: "", uom: "", price: "", cutprice: "" },
    ]);
  };

  const handleRemovePriceDetail = (index) => {
    const updated = [...priceDetails];
    updated.splice(index, 1);
    setPriceDetails(updated);
  };

  const handleFileChange = async (e) => {
  const files = Array.from(e.target.files);
  if (files.length === 0) return;

  try {
   
    const uploadData = new FormData();
    files.forEach((file) => uploadData.append("file", file)); 

   
    const res = await uploadProductImages(uploadData);
    const uploadedData = res?.data?.data; 

    if (uploadedData?.imgUrl) {

      setFormData((prev) => ({
        ...prev,
        imgUrl: [uploadedData.imgUrl], 
      }));

      setSelectedFiles([uploadedData.imgUrl]);

      toast.success("Image uploaded successfully!");
      console.log("Uploaded Images URL:", uploadedData.imgUrl);
    } else {
      toast.error("Image upload failed!");
    }
  } catch (error) {
    console.error("File upload failed:", error);
    toast.error("Something went wrong during file upload!");
  }
};

  const validateForm = () => {
    let tempErrors = {};
    if (!formData.categoryId) tempErrors.categoryId = true;
    if (!formData.productName) tempErrors.productName = true;
    if (!formData.status) tempErrors.status = true;

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // ✅ Handle Add / Update
 const handleSubmit = async () => {
  if (!validateForm()) {
    toast.error(`Failed to ${title.toLowerCase()} — missing fields!`);
    return;
  }

  try {
    const requestData = {
      categoryId: formData.categoryId,
      productName: formData.productName,
      status: formData.status,
      availableProductQuantity: formData.availableProductQuantity,
      description: formData.description,
      recommended: formData.recommended,
      priceDetails: priceDetails,
      imgUrl: formData.imgUrl || [], // ✅ Use URLs already uploaded from handleFileChange
    };

    const isEditMode = title.toLowerCase().includes("edit");
    let response;

    if (isEditMode && productData?._id) {
      response = await UpdateProduct(productData._id, requestData);
      if (response?.data?.status === true) {
        toast.success("Product updated successfully!");
        handleClose();
        if (typeof refreshProducts === "function") refreshProducts();
      } else {
        toast.error(response?.data?.message || "Failed to update product!");
      }
    } else {
      response = await AddProduct(requestData);
      if (response?.data?.status === true) {
        toast.success("Product added successfully!");
        handleClose();
        if (typeof refreshProducts === "function") refreshProducts();
      } else {
        toast.error(response?.data?.message || "Failed to add product!");
      }
    }
  } catch (error) {
    console.error("Error saving product:", error);
    toast.error("Something went wrong while saving product!");
  }
};

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} />
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "95%", sm: "90%", md: "750px" },
            maxHeight: "90vh",
            overflowY: "auto",
            bgcolor: "white",
            boxShadow: 24,
            borderRadius: 2,
            p: { xs: 2, sm: 3, md: 4 },
          }}
        >
      
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight="bold">
              {title}
            </Typography>
            <IconButton onClick={handleClose}>
              <Close sx={{ color: "green" }} />
            </IconButton>
          </Box>

     
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
              },
              gap: 2,
              mt: 2,
            }}
          >
            <TextField
              name="categoryId"
              label="Select Category *"
              variant="standard"
              select
              value={formData.categoryId}
              onChange={handleInputChange}
              error={!!errors.categoryId}
            >
              <MenuItem value="">Select</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat._id} value={cat._id}>
                  {cat.categoryName}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              name="productName"
              label="Product Name *"
              variant="standard"
              value={formData.productName}
              onChange={handleInputChange}
              error={!!errors.productName}
            />

            <TextField
              name="status"
              label="Status *"
              variant="standard"
              select
              value={formData.status}
              onChange={handleInputChange}
              error={!!errors.status}
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </TextField>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 3,
              gap: 2,
            }}
          >
            <TextField
              name="availableProductQuantity"
              label="Available Quantity"
              variant="standard"
              sx={{ flex: "1 1 200px" }}
              value={formData.availableProductQuantity}
              onChange={handleInputChange}
            />

            <Box display="flex" alignItems="center" gap={1}>
              <Typography>Recommended</Typography>
              <Switch
                checked={formData.recommended}
                onChange={(e) =>
                  setFormData({ ...formData, recommended: e.target.checked })
                }
              />
            </Box>

            <Box display="flex" alignItems="center" gap={1}>
              <Typography>Price Details</Typography>
              <IconButton
                onClick={handleAddPriceDetail}
                sx={{ background: "#1976d2", color: "#fff", p: 1 }}
              >
                <Add />
              </IconButton>
            </Box>
          </Box>

          
          {priceDetails.map((detail, index) => (
            <Box
              key={index}
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(2, 1fr)",
                  sm: "repeat(4, 1fr) 40px",
                },
                alignItems: "center",
                gap: 2,
                mt: 2,
              }}
            >
              <TextField
                label="Product Quantity"
                variant="standard"
                value={detail.prodQuantity}
                onChange={(e) =>
                  handlePriceChange(index, "prodQuantity", e.target.value)
                }
              />
             <TextField
  label="UOM"
  variant="standard"
  select
  value={detail.uom}
  onChange={(e) => handlePriceChange(index, "uom", e.target.value)}
  required
>
  <MenuItem value="">Select</MenuItem>
  <MenuItem value="g">g</MenuItem>
  <MenuItem value="kg">kg</MenuItem>
</TextField>

              <TextField
                label="Price"
                variant="standard"
                value={detail.price}
                onChange={(e) =>
                  handlePriceChange(index, "price", e.target.value)
                }
              />
              <TextField
                label="Cut Price"
                variant="standard"
                value={detail.cutprice}
                onChange={(e) =>
                  handlePriceChange(index, "cutprice", e.target.value)
                }
              />
              <IconButton onClick={() => handleRemovePriceDetail(index)}>
                <Delete sx={{ color: "red" }} />
              </IconButton>
            </Box>
          ))}


          <TextField
            name="description"
            label="Description"
            variant="standard"
            fullWidth
            multiline
            rows={2}
            sx={{ mt: 3 }}
            value={formData.description}
            onChange={handleInputChange}
          />

       
          <Box sx={{ mt: 3 }}>
            <Typography fontWeight="bold">Upload Images</Typography>
            <Box
              sx={{
                border: "2px dashed #4CAF50",
                borderRadius: 2,
                mt: 1,
                p: 3,
                textAlign: "center",
                color: "gray",
                fontSize: 15,
                cursor: "pointer",
              }}
              onClick={() => document.getElementById("fileInput").click()}
            >
              Drag & drop your images here or click to select files
            </Box>

            <input
              type="file"
              id="fileInput"
              multiple
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />

            {selectedFiles.length > 0 && (
              <Box sx={{ display: "flex", gap: 2, mt: 2, flexWrap: "wrap" }}>
                {selectedFiles.map((file, i) => (
                  <img
                    key={i}
                    src={
                      typeof file === "string"
                        ? file
                        : URL.createObjectURL(file)
                    }
                    alt="preview"
                    width="80"
                    height="80"
                    style={{
                      borderRadius: 8,
                      objectFit: "cover",
                      border: "1px solid #ccc",
                    }}
                  />
                ))}
              </Box>
            )}
          </Box>

      
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
              mt: 4,
            }}
          >
            <Button variant="outlined" onClick={handleClose}>
              CANCEL
            </Button>
            <Button
              variant="contained"
              sx={{
                background: "#003300",
                color: "white",
                "&:hover": { background: "#004d00" },
              }}
              onClick={handleSubmit}
            >
              {title === "Add Product" ? "CONFIRM" : "UPDATE"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default AddProductModal;
