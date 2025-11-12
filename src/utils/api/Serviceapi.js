import apiService from "./apiService";

export const LoginUser = (email, password) => {
  return apiService.post(`/user/web/login`, { email, password });
};

export const Category = (value) => {
  return apiService.get(`/category?value=${value}`);
};
export const Addcategory = (value) => {
  return apiService.post(`/category`, value);
};

export const getAllCategory = () => {
  return apiService.get(`/category?status=active`);
};

export const Deletecategory = (value) => {
  return apiService.delete(`/category/${value}`);
};

export const Editcategory = (value, id) => {
  return apiService.put(`/category/${id}`, value);
};
export const uploadFile = (file) => {
  const formData = new FormData();
  formData.append("file", file); // key name must be 'file'

  return apiService.post("file/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getCustomers = (value, limit, offset) => {
  return apiService.get(
    `/user?role=consumer,webconsumer&limit=${limit}&offset=${offset}&value=${value}`
  );
};

export const deliveryCharge = (value) => {
  return apiService.get(`/deliveryCharge?value=${value}`);
};

export const getStocks = (value, limit, offset) => {
  return apiService.get(
    `/products/admin?limit=${limit}&offset=${offset}&value=${value}`
  );
};

export const getOrders = (
  value,
  limit,
  offset,
  name,
  status,
  fromDate,
  toDate
) => {
  const statusParam =
    status && status !== "all" ? `&orderStatus=${status}` : "";
  const nameParam = name && name !== "all" ? `&userId=${name}` : "";

  return apiService.get(
    `/orders/admin?limit=${limit}&offset=${offset}&value=${value}&paymentStatus=success,failed&${nameParam}${statusParam}&fromDate=${fromDate}&toDate=${toDate}`
  );
};

export const getOrderDashboard = (limit, offset) => {
  return apiService.get(
    `/orders/admin?limit=${limit}&offset=${offset}&paymentStatus=success,failede`
  );
};
export const editStocks = (id, data) => {
  return apiService.put(`/products/${id}`, data);
};
export const AddProduct = (formData) => {
  return apiService.post("/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const UpdateProduct = (id, formData) => {
  return apiService.put(`/products/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
export const getProducts = (value, limit, offset, categoryId) => {
  let url = `/products/admin?limit=${limit}&offset=${offset}&value=${value}`;
  if (categoryId) {
    url += `&categoryId=${categoryId}`;
  }
  return apiService.get(url);
};



export const getCategoryList = () => {
  return apiService.get(`/products/categorylist`);
};

export const uploadProductImages = (formData) => {
  return apiService.post("/file/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const DeleteProduct = (id) => {
  return apiService.delete(`/products/${id}`);
};

export const getCoupons = (limit, offset) => {
  return apiService.get(`/couponMaster?limit=${limit}&offset=${offset}`);
};
export const AddCoupon = (data) => {
  return apiService.post(`/couponMaster`, data);
};

export const UpdateCoupon = (id, data) => {
  return apiService.put(`/couponMaster/${id}`, data);
};

export const DeleteCoupon = (id) => {
  return apiService.delete(`/couponMaster/${id}`);
};

export const getBanners = (type, status, name) => {

  return apiService.get(`/banner?type=${type}&status=${status}&name=${name}`);
};


export const AddBanner = (formData) => {
  return apiService.post("/banner/sub/banner", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};


export const UpdateBanner = (id, formData) => {
  return apiService.put(`/banner/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};


export const DeleteBanner = (id) => {
  return apiService.delete(`/banner/${id}`);
};


export const uploadFiles = (formData) => {
  return apiService.post("/file/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const Editdelivery = (value, id) => {
  return apiService.put(`/deliveryCharge/${id}`, value);
};
export const Adddelivery = (value) => {
  return apiService.post(`/deliveryCharge`, value);
};
export const Deletedelivery = (value) => {
  return apiService.delete(`/deliveryCharge/${value}`);
};

export const dropDown = () => {
  return apiService.get(`/user/dropDown?role=consumer,webconsumer`);
};

export const Orderbyid = (id) => {
  return apiService.get(`/orders/admin?_id=${id}`);
};

export const updateStatus = (id, data) => {
  return apiService.put(`/orders/${id}`, data);
};

export const excelOrders = (status, name, fromDate, toDate) => {
  const statusParam =
    status && status !== "all" ? `&orderStatus=${status}` : "";
  const nameParam = name && name !== "all" ? `&userId=${name}` : "";

  return apiService.get(
    `/orders/list/export?${nameParam}&fromDate=${fromDate}&toDate=${toDate}${statusParam}&assignedId=`
  );
};

export const orderDashboard = () => {
  return apiService.get(`/orders/dashboard/summary`);
};

export const userDashboard = () => {
  return apiService.get(`/user/dashboard/summary`);
};
