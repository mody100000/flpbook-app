import React, { createContext, useState, useContext } from 'react';
import { CheckoutModal } from '../components/CheckoutModal/CheckoutModal';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [showCartModal, setShowCartModal] = useState(false);
    const [confirmedItems, setConfirmedItems] = useState([]);
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);

    const addToCart = (item) => {
        setCartItems(prevItems => [...prevItems, item]);
    };

    const removeFromCart = (id) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const confirmOrder = (items, totalPrice) => {
        // Set confirmed items and total price
        setConfirmedItems(items);
    };
    const clearCheckout = () => {
        setConfirmedItems([])
    }
    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            clearCart,
            clearCheckout,
            showCartModal,
            setShowCartModal,
            confirmedItems,
            showCheckoutModal,
            setShowCheckoutModal,
            confirmOrder
        }}>
            {children}
            {showCheckoutModal && <CheckoutModal />}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};