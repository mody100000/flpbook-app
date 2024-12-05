import axios from "axios";

export const performOCR = async (imageBase64, options = {}) => {
  const { languageHints = ["ar"], maxResults = 1 } = options;

  try {
    const apiKey = import.meta.env.VITE_GOOGLE_VISION_API_KEY;

    const response = await axios.post(
      `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
      {
        requests: [
          {
            image: {
              content: imageBase64,
            },
            features: [
              {
                type: "TEXT_DETECTION",
                maxResults,
              },
            ],
            imageContext: {
              languageHints,
            },
          },
        ],
      }
    );

    let detectedText =
      response.data.responses[0]?.fullTextAnnotation?.text ||
      "No text detected";
    detectedText = detectedText.replace(/[0-9]/g, "").trim();

    return { detectedText };
  } catch (error) {
    console.error("OCR Error:", error);
    return {
      detectedText: "Error reading text from image",
      error: error.message,
    };
  }
};

// New function to perform OCR on the full image
export const performFullImageOCR = async (imageElement, options = {}) => {
  try {
    // Create a temporary canvas to process the full image
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = imageElement.naturalWidth;
    tempCanvas.height = imageElement.naturalHeight;

    const tempCtx = tempCanvas.getContext("2d");
    tempCtx.drawImage(
      imageElement,
      0,
      0,
      imageElement.naturalWidth,
      imageElement.naturalHeight
    );

    // Convert full image to base64
    const fullImageBase64 = tempCanvas.toDataURL("image/jpeg").split(",")[1];

    // Perform OCR on the full image
    const { detectedText } = await performOCR(fullImageBase64, {
      languageHints: options.languageHints || ["ar"],
      maxResults: options.maxResults || 10,
    });

    // Log the detected text to console
    console.log("Full Image Text Detection:", detectedText);

    return { detectedText };
  } catch (error) {
    console.error("Full Image OCR Error:", error);
    return {
      detectedText: "Error reading full image text",
      error: error.message,
    };
  }
};

export const handleClick = (
  e,
  canvasRef,
  imageRef,
  DEFAULT_SELECTION_SIZE,
  setClickPosition,
  setShowModal,
  setIsLoading,
  setDetectedText,
  updateCanvas
) => {
  const getCoordinates = (event) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const clientX = event.touches ? event.touches[0]?.clientX : event.clientX;
    const clientY = event.touches ? event.touches[0]?.clientY : event.clientY;

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const coords = getCoordinates(e);
  setClickPosition(coords);

  const canvas = canvasRef.current;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const x = Math.max(0, coords.x - DEFAULT_SELECTION_SIZE.width / 1.5);
  const y = Math.max(0, coords.y - DEFAULT_SELECTION_SIZE.height / 2);

  ctx.fillStyle = "rgba(66, 135, 245, 0.3)";
  ctx.strokeStyle = "#4287f5";
  ctx.lineWidth = 2;
  ctx.fillRect(
    x,
    y,
    DEFAULT_SELECTION_SIZE.width,
    DEFAULT_SELECTION_SIZE.height
  );
  ctx.strokeRect(
    x,
    y,
    DEFAULT_SELECTION_SIZE.width,
    DEFAULT_SELECTION_SIZE.height
  );

  setIsLoading(true);
  setShowModal(true);

  return async () => {
    try {
      const img = imageRef.current;
      const tempCanvas = document.createElement("canvas");
      const scaleX = img.naturalWidth / img.clientWidth;
      const scaleY = img.naturalHeight / img.clientHeight;

      tempCanvas.width = DEFAULT_SELECTION_SIZE.width * scaleX;
      tempCanvas.height = DEFAULT_SELECTION_SIZE.height * scaleY;

      const tempCtx = tempCanvas.getContext("2d");
      tempCtx.drawImage(
        img,
        x * scaleX,
        y * scaleY,
        DEFAULT_SELECTION_SIZE.width * scaleX,
        DEFAULT_SELECTION_SIZE.height * scaleY,
        0,
        0,
        DEFAULT_SELECTION_SIZE.width * scaleX,
        DEFAULT_SELECTION_SIZE.height * scaleY
      );

      const croppedImage = tempCanvas.toDataURL("image/jpeg").split(",")[1];
      const { detectedText } = await performOCR(croppedImage);
      setDetectedText(detectedText);
    } catch (error) {
      console.error("OCR Error:", error);
      setDetectedText("Error reading text from image");
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        updateCanvas();
      }, 1000);
    }
  };
};
