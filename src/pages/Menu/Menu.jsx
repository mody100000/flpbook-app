import React, { useState } from 'react';
import axios from 'axios';
import menu from '@assets/menu.jpg';
import styled from 'styled-components';

const FullScreenImage = styled.img`
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
  padding: 3rem 2rem 0 0;
`;

const ImageMapContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const ImageMapArea = styled.div`
  position: absolute;
  background-color: transparent;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.2);
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 800px;
  max-height: 90%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f7f7f7;
  padding: 1.5rem 2rem;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
`;

const ModalTitle = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
`;

const CloseButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: #666;
  transition: color 0.3s ease;

  &:hover {
    color: #333;
  }
`;

const CategoryContainer = styled.div`
  padding: 2rem;
  flex-grow: 1;
`;

const CategoryTitle = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const CategoryArabicTitle = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const MenuItemList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const MenuItem = styled.li`
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
`;

const MenuItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const MenuItemIngredients = styled.div`
  font-size: 0.875rem;
  color: #666;
  padding-right: 1rem;
  display: flex;
  justify-content :end
`;

const MenuItemName = styled.div`
  font-size: 1rem;
  font-weight: bold;
`;

const MenuItemPrice = styled.div`
  font-size: 1rem;
  font-weight: bold;
  color: #007bff;
`;

const NavigationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f7f7f7;
  padding: 1rem 2rem;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
`;

const NavigationButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: #666;
  transition: color 0.3s ease;
  display: flex;
  align-items: center;

  &:hover {
    color: #333;
  }
`;

function Menu() {
  const [showModal, setShowModal] = useState(false);
  const [detectedText, setDetectedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleImageMapClick = async (x, y, width, height) => {
    setIsLoading(true);
    setShowModal(true);

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.src = menu;
      await img.decode(); // Wait for the image to load

      canvas.width = img.width * (width / 100);
      canvas.height = img.height * (height / 100);
      ctx.drawImage(
        img,
        img.width * (x / 100),
        img.height * (y / 100),
        img.width * (width / 100),
        img.height * (height / 100),
        0,
        0,
        canvas.width,
        canvas.height
      );

      const croppedImage = canvas.toDataURL('image/jpeg').split(',')[1]; // Base64 without the header

      // Direct request to Google Cloud Vision API (exposing API key)
      const apiKey = import.meta.env.VITE_GOOGLE_VISION_API_KEY;

      const response = await axios.post(
        `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
        {
          requests: [
            {
              image: {
                content: croppedImage,
              },
              features: [
                {
                  type: 'TEXT_DETECTION',
                  maxResults: 1,
                },
              ],
            },
          ],
        }
      );

      const detectedText = response.data.responses[0]?.fullTextAnnotation?.text || 'No text detected';
      setDetectedText(detectedText);
    } catch (error) {
      console.error('OCR Error:', error);
      setDetectedText('Error reading text from image');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setDetectedText('');
  };
  const imageMapAreas = [
    {
      x: 11.5,
      y: 14,
      width: 31,
      height: 24,
    },
    {
      x: 12.5,
      y: 42,
      width: 30,
      height: 28,
    },
    {
      x: 11.5,
      y: 75,
      width: 32,
      height: 16,
    },
    {
      x: 63,
      y: 49,
      width: 29,
      height: 28,
    },
    {
      x: 62,
      y: 16,
      width: 31,
      height: 28,
    },
    {
      x: 62,
      y: 75,
      width: 31,
      height: 28,
    },
  ];

  return (
    <div className="h-screen flex justify-center items-center overflow-hidden font-arabic">
      <FullScreenImage src={menu} alt="menu image" />
      <ImageMapContainer>
        {imageMapAreas.map((area, index) => (
          <ImageMapArea
            key={index}
            style={{
              left: `${area.x}%`,
              top: `${area.y}%`,
              width: `${area.width}%`,
              height: `${area.height}%`,
            }}
            onClick={() => handleImageMapClick(area.x, area.y, area.width, area.height)}
          />
        ))}
      </ImageMapContainer>

      {showModal && (
        <Modal>
          <ModalHeader>
            <ModalTitle>Menu Section</ModalTitle>
            <CloseButton onClick={handleCloseModal}>X</CloseButton>
          </ModalHeader>
          <CategoryContainer>
            {isLoading ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>Reading text from image...</div>
            ) : (
              <div style={{ direction: 'rtl', textAlign: 'right', whiteSpace: 'pre-wrap', padding: '1rem', fontSize: "1.2rem" }}>
                {detectedText}
              </div>
            )}
          </CategoryContainer>
        </Modal>
      )}
    </div>
  );
}

export default Menu;