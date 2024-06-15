import React, { useState, useEffect } from 'react';
import imageCompression from 'browser-image-compression';
import './ImageCompressor.css';

const ImageCompressor = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [compressedImage, setCompressedImage] = useState(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [quality, setQuality] = useState(0.8);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setSelectedImage(URL.createObjectURL(file));
    setOriginalSize((file.size / 1024 / 1024).toFixed(2)); // Convert bytes to MB
    setImageFile(file);
  };

  const handleQualityChange = (event) => {
    setQuality(event.target.value / 100);
  };

  useEffect(() => {
    if (imageFile) {
      setLoading(true);
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
        initialQuality: quality
      };

      imageCompression(imageFile, options)
        .then((compressedFile) => {
          const compressedURL = URL.createObjectURL(compressedFile);
          setCompressedImage(compressedURL);
          setCompressedSize((compressedFile.size / 1024 / 1024).toFixed(2)); // Convert bytes to MB
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error while compressing image:', error);
          setLoading(false);
        });
    }
  }, [imageFile, quality]);

  const downloadCompressedImage = () => {
    const link = document.createElement('a');
    link.href = compressedImage;
    link.download = 'compressed_image.jpg';
    link.click();
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000); // Hide popup after 3 seconds
  };

  return (
    <div className="image-compressor">
      <h1>Image Compressor</h1>
      <div className='file'></div>
      <input type="file" accept="image/*" onChange={handleImageUpload} className='file'/>
      <div className="quality-slider">
        <label htmlFor="quality">Quality: {Math.round(quality * 100)}%</label>
        <input
          type="range"
          id="quality"
          name="quality"
          min="10"
          max="100"
          value={quality * 100}
          onChange={handleQualityChange}
        />
      </div>
      <div className="images">
        {selectedImage && (
          <div>
            <h2>Original Image</h2>
            <img src={selectedImage} alt="Original" className="original-image" />
            <p>Size: {originalSize} MB</p>
          </div>
        )}
        {loading && <p className="loading">Loading...</p>}
        {compressedImage && !loading && (
          <div>
            <h2>Compressed Image</h2>
            <img src={compressedImage} alt="Compressed" className="compressed-image" />
            <p>Size: {compressedSize} MB</p>
            <button onClick={downloadCompressedImage} className="download-button">
              Download Compressed Image
            </button>
          </div>
        )}
      </div>
      {showPopup && <div className="popup">Your image has been downloaded successfully!</div>}
    </div>
  );
};

export default ImageCompressor;
