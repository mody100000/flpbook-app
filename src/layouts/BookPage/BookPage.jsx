// components/BookPage.jsx
import React from 'react';
import styles from './BookPage.module.css';

const BookPage = ({ children }) => {
    return (
        <div className={styles.bookPage}>
            <div className={styles.pageContent}>
                {children}
            </div>
        </div>
    );
};

export default BookPage;