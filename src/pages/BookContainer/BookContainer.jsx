import React, { useState } from 'react';
import { useLocation, Routes, Route, useNavigate } from 'react-router-dom';
import { PageTransition } from "@mohammedahmed18/react-page-transition";
import { ChevronLeft, ChevronRight, ShoppingCart, CreditCard } from 'lucide-react';
import Home from '../Home/Home';
import Menu from '../Menu/Menu';
import Contact from '../Contact/Contact';
import About from '../About/About';
import News from '../News';
import { keyframes } from 'styled-components';
import { Page } from '../Page';
import styled from 'styled-components';

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
  padding: ${props => props.isCollapsed ? '20px' : '10px 12px'};
  background-color: ${props => props.active ? '#f0f0f0' : '#d0d0d099'};
  color: #333;
  border: none;
  border-radius: 10px 0 0 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  box-shadow: -2px 2px 5px rgba(0,0,0,0.1);
  position: relative;
  right: ${props => props.active ? '0' : '-20px'};
  white-space: nowrap;
  overflow: hidden;
  max-width: ${props => props.isCollapsed ? '40px' : '200px'};

  &:hover {
    right: 0;
    background-color: #e0e0e0;
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

const ToggleButton = styled.button`
  position: fixed;
  right: ${props => props.isCollapsed ? '10px' : '10px'};
  top: 20px;
  background-color: rgb(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: -2px 2px 5px rgba(0,0,0,0.1);
  z-index: 1001;
  transition: all 0.3s ease;

  @media (min-width: 768px) {
    display: none;
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

function Book({ showCartModal, setShowCartModal }) {
    const location = useLocation();
    const navigate = useNavigate();
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

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };
    const handleShowCartModal = () => {
        setShowCartModal(true); // Trigger the modal in the Menu component
    };
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
                                    showCartModal={showCartModal}
                                    setShowCartModal={setShowCartModal}
                                />
                            }

                        />
                    ))}
                </Routes>
            </PageTransition>
            <ToggleButton onClick={toggleCollapse} isCollapsed={isCollapsed}>
                {isCollapsed ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
            </ToggleButton>


            <BookmarkContainer>
                {pages.map((page, index) => (
                    <Bookmark
                        key={index}
                        onClick={() => handleNavigation(page.path)}
                        active={location.pathname === page.path}
                        isCollapsed={isCollapsed}
                    >
                        {isCollapsed ? page.label[0] : page.label}
                    </Bookmark>
                ))}
            </BookmarkContainer>
            <CartButton onClick={handleShowCartModal}>
                <ShoppingCart size={24} />
            </CartButton>
            <CheckoutButton onClick={() => { }}>
                <CreditCard size={24} />
            </CheckoutButton>
        </>
    );
}

export default Book;