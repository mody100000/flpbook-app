import React, { useRef, useEffect, useState } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './BookContainer.module.css';
import Home from '../Home/Home';
import Menu from '../Menu/Menu';
import Contact from '../Contact/Contact';
import About from '../About/About';
import News from '../News';


const Page = React.forwardRef(({ number, children }, ref) => {
    return (
        <div className={styles.page} ref={ref}>
            <div className={styles.pageContent}>
                {children}
            </div>
            <div className={styles.pageNumber}>{number}</div>
        </div>
    );
});

function Book() {
    const location = useLocation();
    const navigate = useNavigate();
    const book = useRef();
    const [currentPage, setCurrentPage] = useState(0);

    const pages = [
        { path: '/', component: Home },
        { path: '/menu', component: Menu },
        { path: '/contact', component: Contact },
        { path: '/about', component: About },
        { path: '/news', component: News },
    ];

    useEffect(() => {
        const pageIndex = pages.findIndex(page => page.path === location.pathname);
        if (pageIndex !== -1 && pageIndex !== currentPage) {
            flipToPage(pageIndex);
        }
    }, [location]);

    const flipToPage = (targetPage) => {
        const flipCount = Math.abs(targetPage - currentPage);
        const flipDirection = targetPage > currentPage ? 'next' : 'prev';

        let flippedCount = 0;
        const flipInterval = setInterval(() => {
            if (flippedCount < flipCount) {
                if (flipDirection === 'next') {
                    book.current.pageFlip().flipNext();
                } else {
                    book.current.pageFlip().flipPrev();
                }
                flippedCount++;
            } else {
                clearInterval(flipInterval);
                setCurrentPage(targetPage);
            }
        }, 750); // Adjust timing as needed
    };

    const onFlip = (e) => {
        setCurrentPage(e.data);
        navigate(pages[e.data].path);
    };

    return (
        <div className={styles.bookContainer}>
            <HTMLFlipBook
                width={550}
                height={533}
                size="stretch"
                minWidth={315}
                maxWidth={1000}
                minHeight={400}
                maxHeight={1533}
                maxShadowOpacity={0.5}
                showCover={true}
                mobileScrollSupport={true}
                onFlip={onFlip}
                className={styles.book}
                ref={book}
            >
                {pages.map((page, index) => (
                    <Page key={index} number={index + 1}>
                        <page.component />
                    </Page>
                ))}
            </HTMLFlipBook>
        </div>
    );
}

export default Book;