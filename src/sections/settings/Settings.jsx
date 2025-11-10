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
  const [banners, setBanners] = useState([{ image: null, savedImage: null, id: null }]);


  const fetchBanners = async () => {
    try {
      const response = await getBanners("web", "active", "subbanner");
      const bannerData = response.data?.data?.data || [];

      if (bannerData.length > 0) {
        const formatted = bannerData.map((item) => ({
          savedImage: item.imageUrl,
          image: null,
          id: item._id,
        }));
       
        setBanners([...formatted, { image: null, savedImage: null, id: null }]);
      } else {
        setBanners([{ image: null, savedImage: null, id: null }]);
      }
    } catch (error) {
      console.error("Errors fetching banners:", error);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);


  const handleFileChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const updated = [...banners];
      updated[index].image = file;
      setBanners(updated);
    }
  };


  const handleUpdate = async (index) => {
    try {
      const banner = banners[index];

     
      if (!banner.image) {
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = "image/*";
        fileInput.onchange = async (e) => {
          const file = e.target.files[0];
          if (file) {
            const updated = [...banners];
            updated[index].image = file;
            setBanners(updated);
            await uploadAndSaveBanner(file, banner, index);
          }
        };
        fileInput.click();
        return;
      }

   
      await uploadAndSaveBanner(banner.image, banner, index);
    } catch (error) {
      console.error("Error updating banner:", error);
      toast.error("Failed to update banner");
    }
  };


  const uploadAndSaveBanner = async (file, banner, index) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await uploadFiles(formData);

    
      const imageUrl = uploadRes.data?.data?.imgUrl;

      if (!imageUrl) {
        toast.error("File upload failed!");
        return;
      }

      const bannerData = {
        name: "subbanner",
        imageUrl,
        type: "web",
        status: "active",
      };

      if (banner.id) {
        await UpdateBanner(banner.id, bannerData);
        toast.success("Banner updated successfully!");
      } else {
        await AddBanner(bannerData);
        toast.success("Banner added successfully!");
      }


      await fetchBanners();
    } catch (error) {
      console.error("Error uploading or saving banner:", error);
      toast.error("Error while saving banner");
    }
  };


  const handleDelete = async (index) => {
    const banner = banners[index];
    try {
      if (banner.id) {
        await DeleteBanner(banner.id);
        toast.success("Banner deleted successfully!");
      }
      const updated = banners.filter((_, i) => i !== index);
      setBanners(updated.length ? updated : [{ image: null, savedImage: null, id: null }]);
    } catch (error) {
      console.error("Error deleting banner:", error);
      toast.error("Failed to delete banner");
    }
  };

  return (
    <div className={styles.container}>
      <h4 className={styles.title}>Web Sub Banner</h4>
      <div className={styles.cardWrapper}>
        {banners.map((banner, index) => (
          <div key={index} className={styles.card}>
            <div className={styles.imageBox}>
              {banner.savedImage ? (
                <img src={banner.savedImage} alt="Banner" className={styles.image} />
              ) : banner.image ? (
                <img src={URL.createObjectURL(banner.image)} alt="Preview" className={styles.image} />
              ) : (
                <img src={img} alt="Placeholder" className={styles.placeholder} />
              )}
            </div>

            {!banner.image && !banner.savedImage ? (
              <label className={styles.uploadBtn}>
                <FaUpload /> Choose File
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(index, e)}
                  hidden
                />
              </label>
            ) : (
              <div className={styles.actionBtns}>
                <button className={styles.updateBtn} onClick={() => handleUpdate(index)}>
                  <FaUpload /> {banner.id ? "Update" : "Add"}
                </button>
                <button className={styles.deleteBtn} onClick={() => handleDelete(index)}>
                  <FaTrash />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Settings;
