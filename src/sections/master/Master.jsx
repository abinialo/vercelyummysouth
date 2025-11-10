import  { useEffect, useState } from 'react'
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Box from '@mui/material/Box';
import { RiEditFill } from "react-icons/ri";
import { MdDelete } from "react-icons/md";
import chips from '../../assets/chips.jpg'
import styles from './master.module.css'
import { IoSearchSharp } from "react-icons/io5";
import cloud from '../../assets/up-arrow.png'
import { Addcategory, Adddelivery, Category, Deletecategory, Deletedelivery, deliveryCharge, Editcategory, Editdelivery, uploadFile } from '../../utils/api/Serviceapi';
import { toast } from 'react-toastify';
import { IoIosCloseCircle } from "react-icons/io";
import { Modal } from 'antd';

const Master = () => {
  const [value, setValue] = useState('1');
  const [search, setSearch] = useState('')
  const [state, setState] = useState('')
  const [category, setCategory] = useState([])
  const [delivery, setDelivery] = useState([])
  const [addCategory, setAddCategory] = useState({
    categoryName: '',
    imgUrl: '',
  })
  const [adddelivery, setAddDelivery] = useState({
    state: '',
    deliveryCharge: '',
  })
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [deliveryConfirmVisible, setDeliveryConfirmVisible] = useState(false);



  const handleChange = (event, newValue) => {
    setValue(newValue);
    setError(false);
    setDeliveryerror({
      state: false,
      deliveryCharge: false,
    });
    setAddCategory({
      categoryName: '',
      imgUrl: '',
    })
    setAddDelivery({
      state: '',
      deliveryCharge: '',
    })
    setIsEditMode(false);
    setIsdeliveryMode(false);
  };
  const handleSearchChange = (e) => {

    setSearch(e.target.value);
    setCategory([])
  };
  const handleStateSearch = (e) => {

    setState(e.target.value);
    setDelivery([])
  };
  useEffect(() => {
    getCategory()
  }, [search])
  useEffect(() => {
    getDelivery()
  }, [state])
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isdeliveyMode, setIsdeliveryMode] = useState(false);
  const [deliveryId, setDeliveryId] = useState(null);
  const getCategory = async () => {
    try {
      const response = await Category(search)
      setCategory(response.data.data)
      // console.log(response.data.data)
    } catch (error) {
      console.log(error)
    } finally {

    }
  };
  const getDelivery = async () => {
    try {
      const response = await deliveryCharge(state)
      setDelivery(response.data.data)
      // console.log(response.data.data)
    } catch (error) {
      console.log(error)
      // toast.error(error.response.data.message)
    } finally {

    }
  };
  const aadharfile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const res = await uploadFile(file);
      const imageUrl = res.data?.data?.imgUrl;

      if (imageUrl) {
        setAddCategory(prev => ({
          ...prev,
          imgUrl: imageUrl
        }));
      }
      console.log("Uploaded Image URL:", imageUrl);

    } catch (error) {
      console.error("File upload failed", error.response?.data || error);
    }
  };
  const [error, setError] = useState(false)

  const [deliveryerror, setDeliveryerror] = useState({
    state: false,
    deliveryCharge: false,
  })

  const [imgError, setimgError] = useState(false)
  const handleSave = async () => {
    if (!addCategory.categoryName) {
      toast.error("Category name is required");
      setError(true)
      return;
    }else if (!addCategory.imgUrl) {
      toast.error("Image is required");
      setimgError(true)
      return;
    }
    try {
      if (isEditMode) {

        const res = await Editcategory(addCategory, editId);
        toast.success("Category updated successfully!");
      } else {

        const res = await Addcategory(addCategory);
        toast.success("Category added successfully!");
      }

      setAddCategory({ categoryName: "", imgUrl: "" });
      setIsEditMode(false);
      setEditId(null);
      getCategory();
      console.log('e')

    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };
  const handledeliverySave = async () => {
    if (!adddelivery.state) {
      toast.error("States is required");
      setDeliveryerror({ ...deliveryerror, state: true })
      console.log('e')

      return;
    } else if (!adddelivery.deliveryCharge) {
      toast.error("Deliverys Charge is required");
      setDeliveryerror({ ...deliveryerror, deliveryCharge: true })
      return;
    }
    try {
      if (isdeliveyMode) {

        const res = await Editdelivery(adddelivery, deliveryId);
        toast.success("Deliverys Charges updated successfully!");
      } else {

        const res = await Adddelivery(adddelivery);
        toast.success("Deliverys Charges added successfully!");
      }
      setAddDelivery({ state: "", deliveryCharge: "" });
      setIsdeliveryMode(false);
      setDeliveryId(null);
      getDelivery();
      console.log('e')

    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };
  const handleEdit = (item) => {
    setAddCategory({
      categoryName: item.categoryName,
      imgUrl: item.imgUrl,
    });
    setEditId(item._id);
    setIsEditMode(true);
    console.log('e')

  };

  const handledeliveryEdit = (item) => {
    setAddDelivery({
      state: item.state,
      deliveryCharge: item.deliveryCharge,
    });
    setDeliveryId(item._id);
    setIsdeliveryMode(true);
    console.log('e')

  };
  const handleDelete = (product) => {
    setSelectedProduct(product);
    setDeleteConfirmVisible(true);
    console.log('e')

  };

  const deliveryDelete = (product) => {
    setSelectedDelivery(product);
    setDeliveryConfirmVisible(true);
    console.log('e')

  };
  const confirmDelete = async () => {
    try {
      const response = await Deletecategory(selectedProduct)
      toast.success("Category deleted successfully!");
      getCategory()
      setDeleteConfirmVisible(false);
      setSelectedProduct(null);
    } catch (error) {
      console.log(error)
      console.log('e')

    }
  }
  const handledeliveryDelete = async () => {
    try {
      const response = await Deletedelivery(selectedDelivery)
      toast.success("Delivery Charges deleted successfully!");
      getDelivery()
      setDeliveryConfirmVisible(false);
      setSelectedDelivery(null);
      
    } catch (error) {
      console.log(error)
      console.log('e')

    }
  }
  const cancelDelete = () => {
    setDeleteConfirmVisible(false);
    setSelectedProduct(null);
    console.log('e')
  };
  const cancelDelivery = () => {
    setDeliveryConfirmVisible(false);
    setSelectedDelivery(null);
    console.log('e')

  };
  return (
    <>
      <div className={styles.productContainer}>
        <div style={{ overflow: 'auto' }}>
          <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={handleChange} aria-label="lab API tabs example">
                  <Tab label="Category" value="1" />
                  <Tab label="Delivery Charge" value="2" />
                </TabList>
              </Box>
              <TabPanel value="1" >
                <div>
                  <div>
                    <p className='heading'>Category</p>
                  </div>
                  <div className={styles.deliveryForm}>
                    <div>
                      <div>
                        <input className={styles.input} style={{ border: error && '1px solid red' }} value={addCategory.categoryName}
                          onChange={(e) => {
                            setAddCategory({ ...addCategory, categoryName: e.target.value });
                            if (!e.target.value.trim()) {
                              setError(true);
                            } else {
                              setError(false);
                            }
                          }} type="text" placeholder='Enter Category Name' />
                      </div>
                    </div>
                    <div>
                      {addCategory.imgUrl ?

                        <div className={styles.uploadContainer} >
                          <label htmlFor="fileUpload" className={styles.uploadBox}  >
                            <div className={styles.cloud}>
                              <img src={addCategory.imgUrl} alt="" />
                            </div>
                            <input type="file" onChange={aadharfile} id="fileUpload" className={styles.fileInput} />
                          </label>
                        </div> :
                        <div className={styles.uploadContainer}>
                          <label htmlFor="fileUpload" className={styles.uploadBox} style={{ border: imgError && '1px dashed red' }}>
                            <div className={styles.cloud}>
                              <img src={cloud} alt="" />
                            </div>
                            <input type="file" onChange={(e)=>{aadharfile(e);setimgError(false)}} id="fileUpload" className={styles.fileInput} />
                          </label>
                        </div>
                      }
                    </div>
                    <div>
                      <div >
                        <button className="button" onClick={handleSave}>
                          {isEditMode ? "Update" : "Save"}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div style={{ width: '400px', margin: '15px 0px' }} className={styles.searchContainer}>
                      <div className='search'>
                        <input type="text" value={search} placeholder='Search by Category' onChange={(e) => handleSearchChange(e)} />
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
                        <th>Category Image</th>
                        <th>Name</th>
                        <th>Action</th>
                      </tr>
                      {category.length <= 0 ? <tr className='tabledata'>
                        <td colSpan={4} style={{ textAlign: "center" }}>No Data Found</td>
                      </tr> :
                        category.map((item, index) => (
                          <tr className='tabledata' key={item._id}>
                            <td>{index + 1}</td>
                            <td>
                              <div className={styles.productImage}>
                                <img src={item.imgUrl} alt="snacks" />
                              </div>
                            </td>
                            <td>
                              {item.categoryName}</td>
                            <td>
                              <div className={styles.action}>
                                <RiEditFill className={styles.edit} onClick={() => handleEdit(item)} />
                                <MdDelete className={styles.delete} onClick={() => handleDelete(item._id)} />
                              </div>
                            </td>
                          </tr>
                        ))
                      }
                    </table>
                  </div>
                </div>
              </TabPanel>
              <TabPanel value="2" >
                <div>
                  <div>
                    <p className='heading'>Delivery Charges</p>
                  </div>
                  <div className={styles.deliveryForm}>
                    <div>
                      <label htmlFor="">States</label>
                      <div>
                        <input
                          type="text"
                          value={adddelivery.state}
                          onChange={(e) => {
                            const onlyLetters = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                            setAddDelivery({ ...adddelivery, state: onlyLetters });
                            setDeliveryerror({ ...deliveryerror, state: false })
                            if (!onlyLetters.trim()) {
                              setDeliveryerror({ ...deliveryerror, state: true });
                            } else {
                              setDeliveryerror({ ...deliveryerror, state: false });
                            }
                          }}
                          className={styles.input}
                          placeholder='Enter States'
                          style={{ border: deliveryerror.state && '1px solid red' }}
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="">Delivery Charges</label>
                      <div>
                        <input
                          type="text"
                          value={adddelivery.deliveryCharge}
                          onChange={(e) => {
                            const onlyNums = e.target.value.replace(/[^0-9]/g, '');
                            setAddDelivery({ ...adddelivery, deliveryCharge: onlyNums });
                            setDeliveryerror({ ...deliveryerror, deliveryCharge: false })
                            if (!onlyNums.trim()) {
                              setDeliveryerror({ ...deliveryerror, deliveryCharge: true });
                            } else {
                              setDeliveryerror({ ...deliveryerror, deliveryCharge: false });
                            }
                          }}
                          className={styles.input}
                          placeholder='Enter delivery Charges'
                          style={{ border: deliveryerror.deliveryCharge && '1px solid red' }}

                        />
                        {/* <input type="text" className={styles.input} value={adddelivery.deliveryCharge} 
                        onChange={(e) => setAddDelivery({ ...adddelivery, deliveryCharge: e.target.value })} placeholder='Enter delivery Charges' /> */}
                      </div>
                    </div>
                    <div>
                      <div>
                        <button className='button' onClick={handledeliverySave}>
                          {isdeliveyMode ? "Update" : "Save"}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div style={{ width: '400px', margin: '15px 0px' }} className={styles.searchContainer}>
                      <div className='search'>
                        <input type="text" value={state} onChange={handleStateSearch} placeholder='Search by States' />
                        {state.length > 0 &&
                          <IoIosCloseCircle onClick={() => setState('')} className='searchclose' />
                        }
                        <IoSearchSharp />
                      </div>
                    </div>
                  </div>
                  <div className={styles.tableContainer}>
                    <table className='table'>
                      <tr className='tablehead'>
                        <th>No.</th>
                        <th>State</th>
                        <th>Delivery Charges</th>
                        <th>Action</th>
                      </tr>
                      {delivery.length <= 0 ? <tr className='tabledata'>
                        <td colSpan={4} style={{ textAlign: "center" }}>No Data Found</td>
                      </tr> :
                        delivery.map((item, index) => (
                          <tr className='tabledata'>
                            <td>{index + 1}</td>
                            <td>
                              {item.state}
                            </td>
                            <td>
                              {item.deliveryCharge}</td>
                            <td>
                              <div className={styles.action}>
                                <RiEditFill className={styles.edit} onClick={() => handledeliveryEdit(item)} />
                                <MdDelete className={styles.delete} onClick={() => deliveryDelete(item._id)} />
                              </div>
                            </td>
                          </tr>
                        ))}
                    </table>
                  </div>
                </div>


              </TabPanel>
            </TabContext>
          </Box>

        </div>
      </div>

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

      <Modal
        open={deliveryConfirmVisible}
        onCancel={cancelDelivery}
        footer={null}
        centered
        styles={{
          header: { textAlign: "center" },
          body: { textAlign: "center", fontSize: "16px", padding: "20px 10px" },
        }}
        title={
          <span style={{ fontWeight: "600", color: "#0B6623" }}>
            Confirm Deletes
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
            onClick={cancelDelivery}
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
            onClick={handledeliveryDelete}
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
  )
}

export default Master