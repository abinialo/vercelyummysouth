import React, { useState, useEffect ,useCallback} from 'react';
import styles from './product.module.css';
import { Switch, Modal } from 'antd';
import { RiEditFill } from "react-icons/ri";
import { MdDelete } from "react-icons/md";
import Pagination from "@mui/material/Pagination";
import { IoSearchSharp } from "react-icons/io5";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddProductModal from "../../components/models/product/addproduct";
import { getProducts, DeleteProduct } from "../../utils/api/Serviceapi";
import { Search } from '@mui/icons-material';

const Product = () => {
  const [category, setCategory] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [totalItems, setTotalItems] = useState(0);

  const itemsPerPage = 5; 


  const fetchProducts = useCallback(async () => {
  try {
    const limit = itemsPerPage;
    const offset = (page - 1) * limit;
    const search = searchTerm || "";
    

    const response = await getProducts(search, limit, offset);
    console.log("API Response:", response.data);

    if (response?.data?.status || response?.data?.code === 200) {
      const productData = response.data.data?.data || [];
      const total = response.data.data?.totalCount || 0;

 
      setProducts(productData);
      setTotalItems(total);
    } else {
      setProducts([]);
      setTotalItems(0);
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    toast.error("Failed to fetch products");
  }
}, [page, searchTerm]);


  useEffect(() => {
    fetchProducts();
  }, [page, searchTerm, category]);


  const handlePageChange = (event, value) => setPage(value);


  const onChange = (checked) => {
    console.log(`switch to ${checked}`);
  };


  const handleEdit = (product) => {
    setSelectedProduct(product);
    setOpenEditModal(true);
  };


  const handleDelete = (product) => {
    setSelectedProduct(product);
    setDeleteConfirmVisible(true);
  };

  const confirmDelete = async () => {
    try {
      await DeleteProduct(selectedProduct._id);
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete product");
    } finally {
      setDeleteConfirmVisible(false);
      setSelectedProduct(null);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmVisible(false);
    setSelectedProduct(null);
  };

  const indexOfFirstItem = (page - 1) * itemsPerPage + 1;
  const indexOfLastItem = Math.min(page * itemsPerPage, totalItems);

  return (
    <>
      <div className={styles.productContainer}>
        <div>
          <p className="heading">Product List</p>
        </div>

        <div className={styles.addProduct}>
          <button className="button" onClick={() => setOpenAddModal(true)}>
            Add Product
          </button>
        </div>

        <div className={styles.topContainer}>
 
          <div className={styles.categoryBox}>
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="ALL">ALL</option>
              <option value="Snacks & Sweets">Snacks & Sweets</option>
              <option value="Cookies">Cookies</option>
              <option value="Murukku">Murukku</option>
              <option value="Regional Snacks">Regional Snacks & Sweets</option>
              <option value="Panda Dappa">Panda Dappa</option>
              <option value="Masala">Masala</option>
            </select>
          </div>

        
          <div style={{ width: '300px' }}>
            <div className="search">
              <input
                type="text"
                placeholder="Search Product"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <IoSearchSharp />
            </div>
          </div>
        </div>

      
        <div className={styles.tableContainer}>
          <table className="table">
            <thead className="tablehead">
              <tr>
                <th>No.</th>
                <th>Item name</th>
                <th>Product image</th>
                <th>Status</th>
                <th>Price</th>
                <th>Category Name</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {products.length > 0 ? (
                products.map((product, index) => (
                  <tr key={product._id} className="tabledata">
                    <td>{indexOfFirstItem + index}</td>
                    <td>{product.productName}</td>
                    <td>
                      <div className={styles.productImage}>
                        <img
                          src={product.imgUrl?.[0] || "https://via.placeholder.com/50"}
                          alt={product.productName}
                        />
                      </div>
                    </td>
                    <td>
                      <Switch
                        checked={product.status === "active"}
                        onChange={onChange}
                        className="custom-switch"
                      />
                    </td>
                    <td>
                      {product.priceDetails?.length > 0
                        ? `₹${product.priceDetails[0].price} / ${product.priceDetails[0].prodQuantity}${product.priceDetails[0].uom}`
                        : "N/A"}
                    </td>
                    <td>{product.categoryDetails?.categoryName || "N/A"}</td>
                    <td>
                      <div className={styles.action}>
                        <RiEditFill
                          className={styles.edit}
                          onClick={() => handleEdit(product)}
                        />
                        <MdDelete
                          className={styles.delete}
                          onClick={() => handleDelete(product)}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

   
          {totalItems > 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                padding: "10px 16px",
                marginTop: "10px",
                gap: "10px",
                flexWrap: "wrap",
                fontSize: "13px",
              }}
            >
              <span style={{ fontSize: "12px", color: "#666" }}>
                Items per page: {itemsPerPage}
              </span>

              <Pagination
                count={Math.ceil(totalItems / itemsPerPage)}
                page={page}
                onChange={handlePageChange}
                shape="rounded"
                siblingCount={1}
                boundaryCount={1}
                size="small"
              />

              <span style={{ fontSize: "12px", color: "#666" }}>
                {indexOfFirstItem}-{indexOfLastItem > totalItems ? totalItems : indexOfLastItem} of {totalItems}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ✅ Modals */}
      <AddProductModal
        open={openAddModal}
        handleClose={() => setOpenAddModal(false)}
        title="Add Product"
        refreshProducts={fetchProducts}
      />

      <AddProductModal
        open={openEditModal}
        handleClose={() => setOpenEditModal(false)}
        title="Edit Product"
        productData={selectedProduct}
        refreshProducts={fetchProducts}
      />

    
      <Modal
        open={deleteConfirmVisible}
        onCancel={cancelDelete}
        footer={null}
        centered
        styles={{
          header: { textAlign: "center" },
          body: { textAlign: "center", fontSize: "16px", padding: "20px 10px" },
        }}
        title={
          <span style={{ fontWeight: "600", color: "#0B6623" }}>
            Confirm Delete
          </span>
        }
      >
        <p>
          Are you sure you want to delete <b>{selectedProduct?.productName}</b>?
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "15px",
            marginTop: "20px",
          }}
        >
          <button
            onClick={cancelDelete}
            style={{
              border: "1px solid #ccc",
              background: "white",
              color: "#333",
              padding: "6px 16px",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>

          <button
            onClick={confirmDelete}
            style={{
              backgroundColor: "#0B6623",
              color: "white",
              padding: "6px 16px",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Delete
          </button>
        </div>
      </Modal>
    </>
  );
};

export default Product;
