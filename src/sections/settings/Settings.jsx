import React, { useState, useEffect } from "react";
import styles from "./setting.module.css";
import { FaUpload, FaTrash } from "react-icons/fa";
import img from "../../assets/settings/upload.png";
import {
  getBanners,
  AddBanner,
  UpdateBanner,
  DeleteBanner,
  uploadFiles,
} from "../../utils/api/Serviceapi";
import { toast } from "react-toastify";

const Settings = () => {
  const [banners, setBanners] = useState([{ id: null, image: null, imageUrl: null }]);
  const [subBanners, setSubBanners] = useState([{ id: null, image: null, imageUrl: null }]);

  // 🔹 Fetch Web Banner (max 3)
  const fetchWebBanners = async () => {
    try {
      const res = await getBanners("web", "active", "banner");
      const data = res.data?.data?.data || [];

      const formatted = data.map((item) => ({
        id: item._id,
        imageUrl: item.imageUrl,
        image: null,
      }));

      // Ensure only 3 slots (add empty slots if fewer)
      if (formatted.length < 3) {
        const emptySlots = Array.from({ length: 3 - formatted.length }, () => ({
          id: null,
          image: null,
          imageUrl: null,
        }));
        setBanners([...formatted, ...emptySlots]);
      } else {
        setBanners(formatted.slice(0, 3));
      }
    } catch (error) {
      console.error("Error fetching web banners:", error);
      toast.error("Failed to fetch web banners");
    }
  };

  // 🔹 Fetch Sub Banner
  const fetchSubBanners = async () => {
    try {
      const res = await getBanners("web", "active", "subbanner");
      const data = res.data?.data?.data || [];

      const formatted = data.map((item) => ({
        id: item._id,
        imageUrl: item.imageUrl,
        image: null,
      }));

      // Add one empty slot
      setSubBanners([...formatted, { id: null, image: null, imageUrl: null }]);
    } catch (error) {
      console.error("Error fetching sub banners:", error);
      toast.error("Failed to fetch sub banners");
    }
  };

  useEffect(() => {
    fetchWebBanners();
    fetchSubBanners();
  }, []);

  // 🔹 Upload or Update Banner
  const uploadAndSaveBanner = async (file, banner, typeName) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await uploadFiles(formData);
      const imageUrl = uploadRes.data?.data?.imgUrl;

      if (!imageUrl) {
        toast.error("File upload failed");
        return;
      }

      const bannerData = {
        name: typeName,
        imageUrl,
        type: "web",
        status: "active",
      };

      if (banner.id) {
        await UpdateBanner(banner.id, bannerData, typeName);
        toast.success(`${typeName} updated successfully!`);
      } else {
        await AddBanner(bannerData, typeName);
        toast.success(`${typeName} uploaded successfully!`);
      }

      if (typeName === "banner") {
        await fetchWebBanners();
      } else {
        await fetchSubBanners();
      }
    } catch (error) {
      console.error("Error saving banner:", error);
      toast.error("Failed to upload banner");
    }
  };

  // 🔹 File Change
  const handleFileChange = async (index, e, typeName) => {
    const file = e.target.files[0];
    if (!file) return;

    if (typeName === "banner") {
      const existingCount = banners.filter((b) => b.imageUrl).length;
      if (existingCount >= 3 && !banners[index].id) {
        toast.warn("Only 3 web banners are allowed.");
        return;
      }
    }

    const list = typeName === "banner" ? [...banners] : [...subBanners];
    list[index].image = file;
    if (typeName === "banner") setBanners(list);
    else setSubBanners(list);

    await uploadAndSaveBanner(file, list[index], typeName);
  };

  // 🔹 Update Existing
  const handleUpdate = (index, typeName) => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = (e) => handleFileChange(index, e, typeName);
    fileInput.click();
  };

  // 🔹 Delete Banner
  const handleDelete = async (index, typeName) => {
    const list = typeName === "banner" ? [...banners] : [...subBanners];
    const banner = list[index];

    try {
      if (banner.id) {
        await DeleteBanner(banner.id, typeName);
        toast.success(`${typeName} deleted successfully!`);
      }

      const updated = list.filter((_, i) => i !== index);

      if (typeName === "banner") {
        const count = updated.filter((b) => b.imageUrl).length;
        if (count < 3) {
          updated.push({ id: null, image: null, imageUrl: null });
        }
        setBanners(updated.slice(0, 3));
      } else {
        setSubBanners(updated.length ? updated : [{ id: null, image: null, imageUrl: null }]);
      }
    } catch (error) {
      console.error("Error deleting banner:", error);
      toast.error("Failed to delete banner");
    }
  };

  // 🔹 Render Section (shared for both)
  const renderBannerSection = (title, data, typeName) => (
    <div className={styles.section}>
      <h4 className={styles.title}>{title}</h4>
      {/* {typeName === "banner" && (
        <p className={styles.note}>* Maximum 3 web banners allowed</p>
      )} */}

      <div className={styles.cardWrapper}>
        {data.map((banner, index) => (
          <div key={index} className={styles.card}>
            <div className={styles.imageBox}>
              {banner.imageUrl ? (
                <img src={banner.imageUrl} alt="Banner" className={styles.image} />
              ) : banner.image ? (
                <img
                  src={URL.createObjectURL(banner.image)}
                  alt="Preview"
                  className={styles.image}
                />
              ) : (
                <img src={img} alt="Placeholder" className={styles.placeholder} />
              )}
            </div>

            {!banner.imageUrl ? (
              <label className={styles.uploadBtn}>
                <FaUpload /> Choose File
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => handleFileChange(index, e, typeName)}
                />
              </label>
            ) : (
              <div className={styles.actionBtns}>
                <button
                  className={styles.updateBtn}
                  onClick={() => handleUpdate(index, typeName)}
                >
                  <FaUpload /> Update
                </button>
                <button
                  className={styles.deleteBtn}
                  onClick={() => handleDelete(index, typeName)}
                >
                  <FaTrash /> Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      {renderBannerSection("Web Banner", banners, "banner")}
      {renderBannerSection("Web Sub Banner", subBanners, "subbanner")}
    </div>
  );
};

export default Settings;
