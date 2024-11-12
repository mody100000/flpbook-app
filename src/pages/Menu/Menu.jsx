import React, { useState } from 'react';
import menu from '@assets/menu.jpg';
import styled from 'styled-components';

const FullScreenImage = styled.img`
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
  padding: 3rem 2rem 0 0
`;

const ImageMapContainer = styled.div`
//   position: relative;
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
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
`;

const ModalHeader = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const ModalContent = styled.div`
  font-size: 14px;
`;

function Menu() {
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState(null);

    const handleImageMapClick = (data) => {
        setModalData(data);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setModalData(null);
    };

    const imageMapAreas = [
        { x: 11.5, y: 18, width: 30, height: 20, data: { title: 'Coffee', description: 'Our specialty coffee selection' } },
        { x: 60, y: 55, width: 31, height: 20, data: { title: 'Pastries', description: 'Freshly baked pastries and desserts' } },
        { x: 11.5, y: 72, width: 31, height: 19, data: { title: 'Sandwiches', description: 'A variety of delicious sandwiches' } },
    ];

    return (
        <div className="h-screen flex justify-center items-center overflow-hidden">
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
                        onClick={() => handleImageMapClick(area.data)}
                    />
                ))}
            </ImageMapContainer>

            {showModal && (
                <Modal>
                    <ModalHeader>{modalData?.title}</ModalHeader>
                    <ModalContent>{modalData?.description}</ModalContent>
                    <button onClick={handleCloseModal}>Close</button>
                </Modal>
            )}
        </div>
    );
}

export default Menu;