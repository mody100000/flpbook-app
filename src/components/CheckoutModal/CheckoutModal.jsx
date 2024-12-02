import React, { useState } from 'react';
import { CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import { useCart } from '../../context/CartContext';

export const CheckoutModal = () => {
    const {
        confirmedItems,
        clearCheckout,
        setShowCheckoutModal
    } = useCart();

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        paymentMethod: 'cash'
    });

    const totalPrice = confirmedItems.reduce((total, item) =>
        total + (item.price * item.quantity), 0);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleFinalOrder = (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.name.trim()) {
            toast.error('يرجى إدخال الاسم', {
                position: 'top-right',
                duration: 2000
            });
            return;
        }

        if (!formData.phone.trim()) {
            toast.error('يرجى إدخال رقم الهاتف', {
                position: 'top-right',
                duration: 2000
            });
            return;
        }

        if (!formData.address.trim()) {
            toast.error('يرجى إدخال العنوان', {
                position: 'top-right',
                duration: 2000
            });
            return;
        }

        if (confirmedItems.length === 0) {
            toast.error('لا توجد منتجات للطلب', {
                position: 'top-right',
                duration: 2000
            });
            return;
        }

        // If all validations pass
        toast.success(`تم تأكيد الطلب بقيمة ${totalPrice.toFixed(2)} EGP`, {
            position: 'top-right',
            duration: 3000
        });

        // Here you would typically send the order to a backend
        console.log('Order submitted:', {
            ...formData,
            items: confirmedItems,
            totalPrice
        });

        // Clear cart and close modal
        clearCheckout();
        setShowCheckoutModal(false);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-3xl max-h-[90%] overflow-y-auto flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between bg-gray-100 p-6 rounded-t-lg">
                    <button
                        onClick={() => setShowCheckoutModal(false)}
                        className="text-gray-600 hover:text-gray-800 transition-colors text-4xl"
                    >
                        ×
                    </button>
                    <div className="text-2xl font-thin flex items-center">
                        <CreditCard className="ml-2" />
                        إتمام الطلب
                    </div>
                </div>

                {/* Checkout Content */}
                <div className="p-5">
                    {/* Order Summary */}
                    <div>
                        {confirmedItems.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center justify-between mb-4 pb-4 border-b"
                            >
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-20 h-20 object-cover rounded-lg ml-4"
                                />
                                <div className="flex-grow ml-4">
                                    <h3 className="text-xl font-bold">{item.name}</h3>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">
                                            {item.size} - الكمية: {item.quantity}
                                        </span>
                                    </div>
                                </div>
                                <span className="text-green-600 font-semibold mx-2">
                                    {(item.price * item.quantity).toFixed(2)} EGP
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Checkout Form */}
                    <form onSubmit={handleFinalOrder}>
                        {/* Personal Information */}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                الاسم الكامل
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-400"
                                placeholder="أدخل اسمك"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                                رقم الهاتف
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-400"
                                placeholder="أدخل رقم هاتفك"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
                                العنوان
                            </label>
                            <textarea
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-400"
                                placeholder="أدخل عنوان التوصيل"
                                rows="3"
                            />
                        </div>

                        {/* Order Total */}
                        <div className="mt-6">
                            <div className="flex justify-between mb-4">
                                <span className="text-xl font-bold">المجموع</span>
                                <span className="text-green-600 text-xl font-bold">
                                    {totalPrice.toFixed(2)} EGP
                                </span>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors"
                            >
                                تأكيد الطلب
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};