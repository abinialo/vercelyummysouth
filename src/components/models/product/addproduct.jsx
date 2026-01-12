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
import { toast } from "react-toastify";
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
    availableQuantityIn: "",

    description: "",
    recommended: false,
    imgUrl: [],
  });

  const [errors, setErrors] = useState({});
  const [priceDetails, setPriceDetails] = useState([]); // start empty
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
        availableQuantityIn: productData.availableQuantityIn || "", 
        description: productData.description || "",
        recommended: productData.recommended || false,
        imgUrl: productData.imgUrl || [],
      });
      setPriceDetails(productData.priceDetails || []); 
      setSelectedFiles(productData.imgUrl || []);
    } else if (!open) {
      setFormData({
        categoryId: "",
        productName: "",
        status: "active",
        availableProductQuantity: "",
        availableQuantityIn: "",

        description: "",
        recommended: false,
        imgUrl: [],
      });
      setPriceDetails([]);
      setErrors({});
      setSelectedFiles([]);
    }
  }, [open, productData]);


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

  if (field === "price" || field === "cutprice") {
    updated[index][field] = value === "" ? null : Number(value);
  } else {
    updated[index][field] = value;
  }

  setPriceDetails(updated);
};

 
  const handleAddPriceDetail = () => {
    setPriceDetails([
      ...priceDetails,
     { prodQuantity: "", uom: "", price:null, cutprice:null },
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


  const MAX_SIZE = 500 * 1024;
  const validFiles = [];
  const invalidFiles = [];

  files.forEach((file) => {
    if (file.size > MAX_SIZE) {
      invalidFiles.push(file.name);
    } else {
      validFiles.push(file);
    }
  });

  
  if (invalidFiles.length > 0) {
    toast.error(
      `These files exceed 500KB: ${invalidFiles.join(", ")}`,
      { autoClose: 3000 }
    );
  }


  if (validFiles.length === 0) return;

  try {
    const uploadData = new FormData();
    validFiles.forEach((file) => uploadData.append("file", file));

    const res = await uploadProductImages(uploadData);
    const uploadedData = res?.data?.data;

    if (uploadedData?.imgUrl) {
      setFormData((prev) => ({
        ...prev,
        imgUrl: [...(prev.imgUrl || []), uploadedData.imgUrl],
      }));
      setSelectedFiles((prev) => [...prev, uploadedData.imgUrl]);
      toast.success("Image uploaded successfully!", { autoClose: 1500 });
    } else {
      toast.error("Image upload failed!", { autoClose: 1500 });
    }
  } catch (error) {
    console.error("File upload failed:", error);
    toast.error("Something went wrong during file upload!");
  }
};


  const handleRemoveFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      imgUrl: prev.imgUrl.filter((_, i) => i !== index),
    }));
  };

 
const validateForm = () => {
  let tempErrors = {};

  if (!formData.categoryId)
    tempErrors.categoryId = "Category is required";

  if (!formData.productName)
    tempErrors.productName = "Product name is required";

  if (!formData.status)
    tempErrors.status = "Status is required";

  if (
    formData.availableProductQuantity === "" ||
    isNaN(formData.availableProductQuantity) ||
    Number(formData.availableProductQuantity) <= 0
  ) {
    tempErrors.availableProductQuantity =
      "Available quantity must be greater than 0";
  }
  if (!formData.availableQuantityIn) {
  tempErrors.availableQuantityIn = "Please select quantity unit";
}

  if (!formData.imgUrl || formData.imgUrl.length === 0)
    tempErrors.imgUrl = "Please upload at least one product image";


  if (priceDetails.length === 0) {
    tempErrors.priceDetails = "At least one price detail is required";
  } else {
    priceDetails.forEach((detail, index) => {
      if (!detail.prodQuantity) {
        tempErrors[`prodQuantity_${index}`] = "Quantity required";
      }

      if (!detail.uom) {
        tempErrors[`uom_${index}`] = "UOM required";
      }

   
      if (detail.price <= 0) {
        tempErrors[`price_${index}`] =
          "Price must be greater than 0";
      }


      if (detail.cutprice < 0) {
        tempErrors[`cutprice_${index}`] =
          "Cut price cannot be negative";
      } else if (detail.cutprice < detail.price) {
        tempErrors[`cutprice_${index}`] =
          "Cut price must be greater than base price";
      }
    });
  }

  setErrors(tempErrors);
  return Object.keys(tempErrors).length === 0;
};


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
         availableQuantityIn: formData.availableQuantityIn || "", 
        description: formData.description,
        recommended: formData.recommended,
        priceDetails: priceDetails,
        imgUrl: formData.imgUrl || [],
      };

      const isEditMode = title.toLowerCase().includes("edit");
      let response;

      if (isEditMode && productData?._id) {
        response = await UpdateProduct(productData._id, requestData);
        if (response?.data?.status === true) {
          toast.success("Product updated successfully!", { autoClose: 1500 });
          handleClose();
          if (typeof refreshProducts === "function") refreshProducts();
        } else {
          toast.error(response?.data?.message || "Failed to update product!");
        }
      } else {
        response = await AddProduct(requestData);
        if (response?.data?.status === true) {
          toast.success("Product added successfully!", { autoClose: 1500 });
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
          <Typography variant="h6" fontWeight="bold">{title}</Typography>
          <IconButton onClick={handleClose}><Close sx={{ color: "green" }} /></IconButton>
        </Box>

      
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }, gap: 2, mt: 2 }}>
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
              <MenuItem key={cat._id} value={cat._id}>{cat.categoryName}</MenuItem>
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
            helperText={errors.status}
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </TextField>
        </Box>

       
        <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", mt: 3, gap: 2 }}>
         <Box sx={{ display: "flex", gap: 2, flex: "1 1 300px" }}>
  <TextField
    name="availableProductQuantity"
    label="Available Quantity *"
    variant="standard"
    type="number"
    value={formData.availableProductQuantity}
    onChange={handleInputChange}
    error={!!errors.availableProductQuantity}
    helperText={errors.availableProductQuantity}
    sx={{ flex: 1 }}
  />

  <TextField
    name="availableQuantityIn"
    label="In *"
    variant="standard"
    select
    value={formData.availableQuantityIn || ""}
    onChange={handleInputChange}

    error={!!errors.availableQuantityIn}
  helperText={errors.availableQuantityIn}
  sx={{ width: 120 }}
  >
    <MenuItem value="">Select</MenuItem>
    <MenuItem value="nos">nos</MenuItem>
    <MenuItem value="g">g</MenuItem>
    <MenuItem value="kg">kg</MenuItem>
  </TextField>
</Box>

          <Box display="flex" alignItems="center" gap={1}>
            <Typography>Recommended</Typography>
            <Switch
              checked={formData.recommended}
              onChange={(e) => setFormData({ ...formData, recommended: e.target.checked })}
            />
          </Box>
          <Box sx={{ mt: 3 }}>
  <Box display="flex" alignItems="center" gap={1}>
    <Typography fontWeight="bold">Price Details</Typography>
  <IconButton
  onClick={handleAddPriceDetail}
  sx={{
    background: "#1976d2 !important",
    color: "#fff",
    p: 1,
    "&:hover": {
      background: "#1976d2 !important",   
    },
    "&:active": {
      background: "#1976d2 !important",  
    },
    "& .MuiTouchRipple-root": {
      display: "none",  
    }
  }}
>
  <Add />
</IconButton>

  </Box>

  {errors.priceDetails && (
    <Typography color="error" variant="body2" sx={{ mt: 0.5, ml: 0.5 }}>
      {errors.priceDetails}
    </Typography>
  )}
</Box>


        </Box>

  
        {priceDetails.map((detail, index) => (
          <Box key={index} sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(2,1fr)", sm: "repeat(4,1fr) 40px" }, gap: 2, mt: 2 }}>
           <TextField
  label="Product Quantity"
  variant="standard"
  value={detail.prodQuantity}
  onChange={(e) => handlePriceChange(index, "prodQuantity", e.target.value)}
  error={!!errors[`prodQuantity_${index}`]}
  helperText={errors[`prodQuantity_${index}`]}
/>

<TextField
  label="UOM"
  variant="standard"
  select
  value={detail.uom}
  onChange={(e) => handlePriceChange(index, "uom", e.target.value)}
  error={!!errors[`uom_${index}`]}
  helperText={errors[`uom_${index}`]}
>
  <MenuItem value="">Select</MenuItem>
  <MenuItem value="nos">Nos</MenuItem>
  <MenuItem value="g">g</MenuItem>
  <MenuItem value="kg">kg</MenuItem>
</TextField>

<TextField
  label="Price"
  type="number"
  variant="standard"
  value={detail.price ?? ""}
  onChange={(e) => handlePriceChange(index, "price", e.target.value)}
  error={!!errors[`price_${index}`]}
  helperText={errors[`price_${index}`]}
/>

<TextField
  label="Cut Price"
  type="number"
  variant="standard"
  value={detail.cutprice ?? ""}
  onChange={(e) => handlePriceChange(index, "cutprice", e.target.value)}
  error={!!errors[`cutprice_${index}`]}
  helperText={errors[`cutprice_${index}`]}
/>

<IconButton
  onClick={() => handleRemovePriceDetail(index)}
  disableRipple
  sx={{
    background: "transparent !important",
    "&:hover": {
      background: "transparent !important",
      boxShadow: "none",
    },
    "& .MuiTouchRipple-root": {
      display: "none",
    }
  }}
>
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
            sx={{ border: "2px dashed #4CAF50", borderRadius: 2, mt: 1, p: 3, textAlign: "center", color: "gray", fontSize: 15, cursor: "pointer" }}
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
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mt: 2 }}>
              {selectedFiles.map((file, i) => (
                <Box key={i} sx={{ position: "relative", width: 80, height: 80, borderRadius: 2, overflow: "hidden", border: "1px solid #ccc" }}>
                  <IconButton
                    size="small"
                    sx={{ position: "absolute", top: 0, right: 0, color: "red", backgroundColor: "white", "&:hover": { backgroundColor: "#f5f5f5" }, zIndex: 2, p: "2px" }}
                    onClick={() => handleRemoveFile(i)}
                  >
                    <Close sx={{ fontSize: 14 }} />
                  </IconButton>
                  <img src={typeof file === "string" ? file : URL.createObjectURL(file)} alt={`preview-${i}`} width="100%" height="100%" style={{ objectFit: "cover" }} />
                </Box>
              ))}
            </Box>
          )}
          {errors.imgUrl && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {errors.imgUrl}
            </Typography>
          )}
        </Box>

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}>
          <Button variant="outlined" onClick={handleClose}>CANCEL</Button>
          <Button
            variant="contained"
            sx={{ background: "#003300", color: "white", "&:hover": { background: "#004d00" } }}
            onClick={handleSubmit}
          >
            {title === "Add Product" ? "CONFIRM" : "UPDATE"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddProductModal;
