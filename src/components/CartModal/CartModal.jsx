import React from 'react';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useCart } from '../../context/CartContext';

export const CartModal = () => {
    const {
        cartItems,
        removeFromCart,
        setShowCartModal,
        clearCart,
        confirmOrder
    } = useCart();

    const totalPrice = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    const handleFinalOrder = () => {
        if (cartItems.length === 0) {
            toast.error('السلة فارغة', {
                position: 'top-right',
                duration: 2000
            });
            return;
        }

        toast.success(`تم تأكيد الطلب بقيمة ${totalPrice.toFixed(2)} EGP`, {
            position: 'top-right',
            duration: 3000
        });

        confirmOrder(cartItems, totalPrice);
        clearCart();
        setShowCartModal(false);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-[95%] sm:w-[90%] md:w-[80%] lg:max-w-3xl max-h-[90%] overflow-y-auto flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between bg-gray-100 p-4 sm:p-6 rounded-t-lg">
                    <button
                        onClick={() => setShowCartModal(false)}
                        className="text-gray-600 hover:text-gray-800 transition-colors text-2xl sm:text-4xl"
                    >
                        ×
                    </button>
                    <div className="text-lg sm:text-2xl font-thin flex items-center">
                        <ShoppingCart className="ml-2" />
                        سلة التسوق
                    </div>
                </div>

                {/* Cart Content */}
                <div className="p-4 sm:p-8">
                    {cartItems.length === 0 ? (
                        <div className="text-center text-gray-500 text-base sm:text-xl">
                            السلة فارغة
                        </div>
                    ) : (
                        <div>
                            {cartItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex flex-col sm:flex-row items-center justify-between mb-4 pb-4 border-b"
                                >
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-32 h-32 sm:w-20 sm:h-20 object-cover rounded-lg mb-2 sm:mb-0 ml-0 sm:ml-4"
                                    />
                                    <div className="flex-grow ml-0 sm:ml-4 text-center sm:text-left">
                                        <h3 className="text-xl sm:text-xl font-bold">{item.name}</h3>
                                        <div className="text-sm sm:text-base text-gray-600">
                                            {item.size} - الكمية: {item.quantity}
                                        </div>
                                    </div>
                                    <span className="text-green-600 font-semibold mx-0 sm:mx-2 text-sm sm:text-base">
                                        {(item.price * item.quantity).toFixed(2)} EGP
                                    </span>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <Trash2 />
                                    </button>
                                </div>
                            ))}

                            {/* Total Price and Order Button */}
                            <div className="mt-6">
                                <div className="flex justify-between mb-4 text-sm sm:text-base">
                                    <span className="font-bold">المجموع</span>
                                    <span className="text-green-600 font-bold">
                                        {totalPrice.toFixed(2)} EGP
                                    </span>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button
                                        onClick={() => setShowCartModal(false)}
                                        className="w-full border border-green-600 text-green-600 font-bold py-2 rounded transition-colors"
                                    >
                                        اضف منتج اخر
                                    </button>
                                    <button
                                        onClick={handleFinalOrder}
                                        className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors"
                                    >
                                        تأكيد الطلب
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
