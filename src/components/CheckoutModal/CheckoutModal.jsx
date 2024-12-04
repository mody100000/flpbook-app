import React from 'react';
import { CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import { useCart } from '../../context/CartContext';

export const CheckoutModal = () => {
    const {
        confirmedItems,
        clearCheckout,
        setShowCheckoutModal
    } = useCart();

    const totalPrice = confirmedItems.reduce((total, item) =>
        total + (item.price * item.quantity), 0);

    const handleFinalOrder = () => {
        if (confirmedItems.length === 0) {
            toast.error('لا توجد منتجات للطلب', {
                position: 'top-right',
                duration: 2000
            });
            return;
        }

        toast.success(`تم تأكيد الطلب بقيمة ${totalPrice.toFixed(2)} EGP`, {
            position: 'top-right',
            duration: 3000
        });

        // Send order data to the backend
        console.log('Order submitted:', {
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
                        {confirmedItems.length === 0 ? (
                            <div className="text-center text-gray-500 py-7">
                                <p className="text-xl">لا توجد منتجات في السلة</p>
                            </div>
                        ) : (
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
                        )}
                    </div>

                    {/* Order Total and Submit */}
                    <div className="mt-6">
                        <div className="flex justify-between mb-4">
                            <span className="text-xl font-bold">المجموع</span>
                            <span className="text-green-600 text-xl font-bold">
                                {totalPrice.toFixed(2)} EGP
                            </span>
                        </div>

                        <button
                            onClick={handleFinalOrder}
                            className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors"
                        >
                            تأكيد الطلب
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
