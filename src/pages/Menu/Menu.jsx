import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import menuImg from "@assets/menu.jpg"

// You can adjust these values to change the default selection box size
const getSelectionSize = () => {
  const screenWidth = window.innerWidth;

  if (screenWidth < 640) {  // Tailwind's 'sm' breakpoint
    return {
      width: 140,   // Smaller width for mobile
      height: 25    // Maintain the same height
    };
  }

  return {
    width: 400,
    height: 25
  };
};

const DEFAULT_SELECTION_SIZE = getSelectionSize();

window.addEventListener('resize', () => {
  Object.assign(DEFAULT_SELECTION_SIZE, getSelectionSize());
});
const Menu = () => {
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [detectedText, setDetectedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [clickPosition, setClickPosition] = useState(null);

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
    canvas.width = img.clientWidth;
    canvas.height = img.clientHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const getCoordinates = (event) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const clientX = event.touches ? event.touches[0]?.clientX : event.clientX;
    const clientY = event.touches ? event.touches[0]?.clientY : event.clientY;

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const handleClick = async (e) => {
    const coords = getCoordinates(e);
    setClickPosition(coords);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate box coordinates ensuring it stays within canvas bounds
    const x = Math.max(0, coords.x - DEFAULT_SELECTION_SIZE.width / 1.5);
    const y = Math.max(0, coords.y - DEFAULT_SELECTION_SIZE.height / 2);

    // Draw selection box
    ctx.fillStyle = 'rgba(66, 135, 245, 0.3)';
    ctx.strokeStyle = '#4287f5';
    ctx.lineWidth = 2;
    ctx.fillRect(x, y, DEFAULT_SELECTION_SIZE.width, DEFAULT_SELECTION_SIZE.height);
    ctx.strokeRect(x, y, DEFAULT_SELECTION_SIZE.width, DEFAULT_SELECTION_SIZE.height);

    setIsLoading(true);
    setShowModal(true);

    try {
      const img = imageRef.current;
      const tempCanvas = document.createElement('canvas');
      const scaleX = img.naturalWidth / img.clientWidth;
      const scaleY = img.naturalHeight / img.clientHeight;

      tempCanvas.width = DEFAULT_SELECTION_SIZE.width * scaleX;
      tempCanvas.height = DEFAULT_SELECTION_SIZE.height * scaleY;

      const tempCtx = tempCanvas.getContext('2d');
      tempCtx.drawImage(
        img,
        x * scaleX, y * scaleY,
        DEFAULT_SELECTION_SIZE.width * scaleX,
        DEFAULT_SELECTION_SIZE.height * scaleY,
        0, 0,
        DEFAULT_SELECTION_SIZE.width * scaleX,
        DEFAULT_SELECTION_SIZE.height * scaleY
      );

      const croppedImage = tempCanvas.toDataURL('image/jpeg').split(',')[1];

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
      setTimeout(() => {
        updateCanvas();
      }, 1000); // Clear the selection after 1 second
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setDetectedText('');
    updateCanvas();
  };

  return (
    <div className="w-full h-screen relative overflow-hidden">
      <img
        ref={imageRef}
        src={menuImg}
        alt="menu image"
        onLoad={() => setImageLoaded(true)}
        className="w-full h-full fixed top-0 left-0 -z-10"
      />

      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/90 p-4 rounded-lg z-10 text-center pointer-events-none md:hidden">
        Click on text to scan
      </div>

      <canvas
        ref={canvasRef}
        onClick={handleClick}
        className="w-full h-full fixed top-0 left-0 z-10 cursor-pointer opacity-30 hover:opacity-100 transition-opacity duration-300"
        style={{ touchAction: 'none' }}
      />

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-3xl max-h-[90%] overflow-y-auto flex flex-col">
            <div className="flex items-center justify-between bg-gray-100 p-6 rounded-t-lg">
              <div className="text-2xl font-bold">Selected Text</div>
              <button onClick={handleCloseModal} className="text-gray-600 hover:text-gray-800 transition-colors">
                X
              </button>
            </div>
            <div className="p-8 flex-grow text-right whitespace-pre-wrap text-xl" dir="rtl">
              {isLoading ? (
                <div className="text-center p-8">
                  Reading text from image...
                </div>
              ) : (
                detectedText
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;