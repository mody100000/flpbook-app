import React, { useState } from 'react';
import { useLocation, Routes, Route, useNavigate } from 'react-router-dom';
import { PageTransition } from "@mohammedahmed18/react-page-transition";
import { ShoppingCart, CreditCard } from 'lucide-react';
import Home from '../Home/Home';
import Menu from '../Menu/Menu';
import Contact from '../Contact/Contact';
import About from '../About/About';
import News from '../News';
import { keyframes } from 'styled-components';
import { Page } from '../Page';
import styled from 'styled-components';
import { useCart } from '../../context/CartContext';
import { CartModal } from '../../components/CartModal/CartModal';
import Dashboard from '../../Dashboard/Dashboard';

const BookmarkContainer = styled.div`
  position: fixed;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  z-index: 1000;
  transition: all 0.3s ease;
`;

const Bookmark = styled.button`
  position: relative;
  padding: 10px;
  background-color: ${props => props.active ? '#f0f0f0' : '#d0d0d099'};
  color: #333;
  border: none;
  border-radius: 10px 0 0 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  box-shadow: -2px 2px 5px rgba(0,0,0,0.1);
  
  /* Default state - vertical text */
  writing-mode: vertical-rl;
  text-orientation: mixed;
  height: 60px;
  width: 40px;
  overflow: hidden;
  white-space: nowrap;
 right: -40px;

  
  /* Hover and active states */
  &:hover, &[data-active="true"] {
    writing-mode: horizontal-tb;
     height: 60px;
    width: 80px;
    right: 0;
    background-color: #e0e0e0;
    text-align: left;
    display: flex;
    align-items: center;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to right, rgba(255,255,255,0.1), transparent);
    border-radius: 10px 0 0 10px;
  }
`;


const FloatingButton = styled.button`
  position: fixed;
  right: 20px;
  background-color: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: -2px 2px 5px rgba(0,0,0,0.1);
  z-index: 1001;
  transition: all 0.3s ease;

  &:hover {
    background-color: #f0f0f0;
    transform: scale(1.1);
  }
`;

const CartButton = styled(FloatingButton)`
  bottom: 120px;
`;

const CheckoutButton = styled(FloatingButton)`
  bottom: 50px;
`;

function Book() {
    const location = useLocation();
    const navigate = useNavigate();
    const { setShowCartModal, showCartModal, setShowCheckoutModal } = useCart();

    const [isCollapsed, setIsCollapsed] = useState(window.innerWidth < 768);
    const pages = [
        { path: '/lameramenu/home', Component: Home, color: "red", label: "Home" },
        { path: '/lameramenu', Component: Menu, label: "Menu" },
        { path: '/lameramenu/contact', Component: Contact, color: "pink", label: "Contact" },
        { path: '/lameramenu/about', Component: About, color: "green", label: "About" },
        { path: '/lameramenu/news', Component: News, color: "dodgerblue", label: "News" },
    ];
    const handleNavigation = (path) => {
        navigate(path);
        if (window.innerWidth < 768) {
            setIsCollapsed(true);
        }
    };

    const handleShowCartModal = () => {
        setShowCartModal(true); // Trigger the modal in the Menu component
        setShowCheckoutModal(false)
    };
    const handleShowCheckoutModal = () => {
        setShowCheckoutModal(true);
        setShowCartModal(false)
    };
    const showFloatingButtons = pages.some(page =>
        location.pathname === page.path
    );
    return (
        <>
            <PageTransition
                className="!overflow-hidden shadow-lg"
                style={{ boxShadow: "4px 4px 8px rgba(0, 0, 0, 0.3)" }}
                enterAnimation={{
                    keyframes: keyframes`
                        0% {
                            transform: rotateY(20deg);
                            transform-origin: left center;
                        }
                        100% {
                            transform: rotateY(0deg);
                            transform-origin: left center;
                        }
                    `,
                    duration: 2000,
                    timing: 'ease',
                    fill: 'both'
                }}
                exitAnimation={{
                    keyframes: keyframes`
                        0% {
                            transform: rotateY(0deg);
                            transform-origin: left center;
                        }
                        50% {
                            transform: rotateY(-90deg);
                            transform-origin: left center;
                        }
                        100% {
                            transform: rotateY(-180deg);
                            transform-origin: left center;
                        }
                    `,
                    duration: 2000,
                    timing: 'ease',
                    fill: 'both'
                }}
                transitionKey={location.pathname}
            >
                <Routes location={location}>
                    {pages.map((page, index) => (
                        <Route
                            key={index}
                            exact
                            path={page.path}
                            element={
                                <Page
                                    Page={page.Component}
                                    color={page.color}
                                />
                            }
                        />
                    ))}
                    {/* Add dashboard route without Page wrapper */}
                    <Route path="/lameramenu/dashboard" element={<Dashboard />} />
                </Routes>
            </PageTransition>

            <BookmarkContainer>
                {pages.map((page, index) => (
                    <Bookmark
                        key={index}
                        onClick={() => handleNavigation(page.path)}
                        data-active={location.pathname === page.path}
                        active={location.pathname === page.path}
                    >
                        {page.label}
                    </Bookmark>
                ))}
            </BookmarkContainer>
            {showFloatingButtons && (
                <>
                    <CartButton onClick={handleShowCartModal}>
                        <ShoppingCart size={24} />
                    </CartButton>
                    <CheckoutButton onClick={handleShowCheckoutModal}>
                        <CreditCard size={24} />
                    </CheckoutButton>
                </>
            )}
            {showCartModal && <CartModal />}

        </>
    );
}

export default Book;