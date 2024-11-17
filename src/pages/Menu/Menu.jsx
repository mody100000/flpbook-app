import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import menuImg from "@assets/menu.jpg"
const FullScreenImage = styled.img`
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
  // padding: 3rem 2rem 0 0;
`;

const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  cursor: crosshair;
  // padding: 3rem 2rem 0 0;
  opacity: 0.3;
  &:hover {
    opacity: 1;
  }
  transition: opacity 0.3s ease;
`;

const Container = styled.div`
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
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
  z-index: 1000;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
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

const ContentContainer = styled.div`
  padding: 2rem;
  flex-grow: 1;
  direction: rtl;
  text-align: right;
  white-space: pre-wrap;
  font-size: 1.4rem;
`;

function Menu() {
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [detectedText, setDetectedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (imageLoaded) {
      updateCanvas();
    }
  }, [imageLoaded]);

  const updateCanvas = () => {
    const canvas = canvasRef.current;
    const img = imageRef.current;

    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');

    // Match canvas size to image size including padding
    canvas.width = img.clientWidth;
    canvas.height = img.clientHeight;

    // Clear and draw transparent background
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const startSelection = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsSelecting(true);
    setStartPos({ x, y });
    setCurrentPos({ x, y });
  };

  const updateSelection = (e) => {
    if (!isSelecting) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCurrentPos({ x, y });
    drawSelectionOverlay();
  };

  const endSelection = async () => {
    setIsSelecting(false);
    if (Math.abs(currentPos.x - startPos.x) > 10 && Math.abs(currentPos.y - startPos.y) > 10) {
      setIsLoading(true);
      setShowModal(true);

      try {
        const canvas = canvasRef.current;
        const img = imageRef.current;

        // Create a temporary canvas for the selection
        const tempCanvas = document.createElement('canvas');
        const x = Math.min(startPos.x, currentPos.x);
        const y = Math.min(startPos.y, currentPos.y);
        const width = Math.abs(currentPos.x - startPos.x);
        const height = Math.abs(currentPos.y - startPos.y);

        // Scale the selection coordinates to match the original image
        const scaleX = img.naturalWidth / img.clientWidth;
        const scaleY = img.naturalHeight / img.clientHeight;

        tempCanvas.width = width * scaleX;
        tempCanvas.height = height * scaleY;

        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.drawImage(
          img,
          x * scaleX, y * scaleY, width * scaleX, height * scaleY,
          0, 0, width * scaleX, height * scaleY
        );

        const croppedImage = tempCanvas.toDataURL('image/jpeg').split(',')[1];

        // Call Google Cloud Vision API
        const apiKey = import.meta.env.VITE_GOOGLE_VISION_API_KEY;
        const response = await axios.post(
          `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
          {
            requests: [{
              image: {
                content: croppedImage
              },
              features: [{
                type: 'TEXT_DETECTION',
                maxResults: 1
              }]
            }]
          }
        );

        const detectedText = response.data.responses[0]?.fullTextAnnotation?.text || 'No text detected';
        setDetectedText(detectedText);
      } catch (error) {
        console.error('OCR Error:', error);
        setDetectedText('Error reading text from image');
      } finally {
        setIsLoading(false);
        updateCanvas(); // Clear selection after processing
      }
    }
  };

  const drawSelectionOverlay = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Clear previous overlay
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw selection rectangle
    ctx.fillStyle = 'rgba(66, 135, 245, 0.3)';
    ctx.strokeStyle = '#4287f5';
    ctx.lineWidth = 2;

    const x = Math.min(startPos.x, currentPos.x);
    const y = Math.min(startPos.y, currentPos.y);
    const width = Math.abs(currentPos.x - startPos.x);
    const height = Math.abs(currentPos.y - startPos.y);

    ctx.fillRect(x, y, width, height);
    ctx.strokeRect(x, y, width, height);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setDetectedText('');
  };

  return (
    <Container>
      <FullScreenImage
        ref={imageRef}
        src={menuImg}
        alt="menu image"
        onLoad={() => setImageLoaded(true)}
      />
      <Canvas
        ref={canvasRef}
        onMouseDown={startSelection}
        onMouseMove={updateSelection}
        onMouseUp={endSelection}
        onMouseLeave={() => {
          setIsSelecting(false);
          updateCanvas();
        }}
      />

      {showModal && (
        <ModalOverlay>
          <Modal>
            <ModalHeader>
              <ModalTitle>Selected Text</ModalTitle>
              <CloseButton onClick={handleCloseModal}>X</CloseButton>
            </ModalHeader>
            <ContentContainer>
              {isLoading ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  Reading text from image...
                </div>
              ) : (
                detectedText
              )}
            </ContentContainer>
          </Modal>
        </ModalOverlay>
      )}
    </Container>
  );
}

export default Menu;