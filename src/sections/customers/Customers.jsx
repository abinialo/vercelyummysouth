import React, { useEffect, useState } from "react";
import styles from "./customers.module.css";
import { IoSearchSharp } from "react-icons/io5";
import { IoIosCloseCircle } from "react-icons/io";
import Pagination from "@mui/material/Pagination";
import { getCustomers } from '../../utils/api/Serviceapi';
import { set } from "date-fns";
import Loader from "../../components/loader/Loader";

const Customers = () => {
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const [customers, setCustomers] = useState([])
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState('')

  const [loader, setLoader] = useState(false)
  const handleSearchChange = (e) => {

    setSearch(e.target.value);
    setCustomers([])
    setPage(1);
    console.log('d')
  };
  useEffect(() => {
    getCustomer()
  }, [search, page])
  const getCustomer = async () => {
    setLoader(true)
    try {
      const limit = itemsPerPage;
      const offset = (page - 1) * itemsPerPage;
      const response = await getCustomers(search, limit, offset)
      setCustomers(response.data?.data?.data)
      // console.log(response.data.data)
      setTotalItems(response.data?.data?.totalCount || 0);
      setLoader(false)

    } catch (error) {
      console.log(error)
      setLoader(false)

    } finally {

    }
  };


  return (
    <>
      <div className={styles.productContainer}>
        <div className={styles.stockHead}>
          <div>
            <p className="heading">Customers</p>
          </div>
          <div style={{ width: "400px" }}>
            <div className="search">
              <input type="text" value={search} onChange={handleSearchChange} placeholder="Search Customers" />
              {search.length > 0 &&
                <IoIosCloseCircle onClick={() => setSearch('')} className='searchclose' />
              }

              <IoSearchSharp />
            </div>
          </div>
        </div>

        <div className={styles.tableContainer}>
          <table className="table">
            <thead>
              <tr className="tablehead">
                <th>No.</th>
                <th>Customer Name</th>
                <th>Email ID</th>
                <th>Contact Number</th>
              </tr>
            </thead>

            <tbody>
              {loader ? <tr className='tabledata'>
                <td colSpan={4} style={{ textAlign: "center" }}><Loader /></td>
              </tr> :
                customers.length <= 0 ? <tr className='tabledata'>
                  <td colSpan={4} style={{ textAlign: "center" }}>No Data Found</td>
                </tr> :
                  customers.map((item, index) => (
                    <tr key={item._id} className="tabledata">
                      <td>{(page - 1) * itemsPerPage + index + 1}</td>
                      <td>{item.name}</td>
                      <td>{item.email}</td>
                      <td>{item.mobileNo}</td>
                    </tr>
                  ))

              }
            </tbody>
          </table>

          {customers.length > 0 &&
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
  );
};

export default Customers;
