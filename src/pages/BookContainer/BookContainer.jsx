import React from 'react';
import { useLocation, Routes, Route, useNavigate } from 'react-router-dom';
import { PageTransition } from "@mohammedahmed18/react-page-transition"
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
`;

const Bookmark = styled.button`
  padding: 10px 20px;
  background-color: ${props => props.active ? '#f0f0f0' : '#d0d0d0'};
  color: #333;
  border: none;
  border-radius: 10px 0 0 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  box-shadow: -2px 2px 5px rgba(0,0,0,0.1);
  position: relative;
  right: ${props => props.active ? '0' : '-10px'};

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

function Book() {
    const location = useLocation();
    const navigate = useNavigate();

    const pages = [
        { path: '/', Component: Home, color: "red", label: "Home" },
        { path: '/menu', Component: Menu, label: "Menu" },
        { path: '/contact', Component: Contact, color: "pink", label: "Contact" },
        { path: '/about', Component: About, color: "green", label: "About" },
        { path: '/news', Component: News, color: "dodgerblue", label: "News" },
    ];

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <>
            <PageTransition
                className="!overflow-hidden shadow-lg"
                style={{ boxShadow: "4px 4px 8px rgba(0, 0, 0, 0.3)" }}
                enterAnimation={{
                    keyframes: keyframes`
                    0% {
                        transform: rotateY(10deg);
                        transform-origin: left center;
                    }
                    100% {
                        transform: rotateY(0deg);
                        transform-origin: left center;
                    }
            `,
                    duration: 1000,
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
                    duration: 1000,
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
                            element={<Page color={page.color} Page={page.Component} />}
                        />
                    ))}
                </Routes>
            </PageTransition>

            <BookmarkContainer>
                {pages.map((page, index) => (
                    <Bookmark
                        key={index}
                        onClick={() => handleNavigation(page.path)}
                        active={location.pathname === page.path}
                    >
                        {page.label}
                    </Bookmark>
                ))}
            </BookmarkContainer>
        </>
    );
}

export default Book;