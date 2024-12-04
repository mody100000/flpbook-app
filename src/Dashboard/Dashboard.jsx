import React, { useState } from 'react';
import { Upload, ImagePlus, X, Check } from 'lucide-react';

const Dashboard = () => {
    const [image, setImage] = useState(null);
    const [title, setTitle] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const clearImage = () => {
        setImage(null);
        setSubmitted(false);
    };

    const handleSubmit = () => {
        if (image && title) {
            setSubmitted(true);
            // You can add additional submit logic here, like sending data to a backend
            console.log('Submitted:', { title, image });
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 space-y-6">
                <h1 className="text-2xl font-bold text-center text-gray-800">Image Upload Dashboard</h1>

                <div className="flex flex-col space-y-4">
                    <input
                        type="text"
                        placeholder="Enter Image Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <div className="relative">
                        {!image ? (
                            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                                <ImagePlus className="w-12 h-12 text-gray-400" />
                                <span className="mt-2 text-sm text-gray-500">Click to upload image</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                            </label>
                        ) : (
                            <div className="relative">
                                <img
                                    src={image}
                                    alt="Uploaded"
                                    className="w-full h-64 object-cover rounded-lg"
                                />
                                <button
                                    onClick={clearImage}
                                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </div>

                    {image && (
                        <button
                            onClick={handleSubmit}
                            disabled={!title}
                            className={`w-full py-3 rounded-md transition flex items-center justify-center space-x-2 ${title
                                ? 'bg-blue-500 text-white hover:bg-blue-600'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            <Upload className="w-5 h-5" />
                            <span>Submit</span>
                        </button>
                    )}

                    {submitted && (
                        <div className="flex items-center justify-center text-green-600 space-x-2">
                            <Check className="w-6 h-6" />
                            <span>Submission Successful!</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;