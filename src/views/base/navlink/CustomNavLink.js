import React from 'react'
import styles from './styles.module.css'
import { NavLink } from 'react-router-dom'

const CustomLink = ({ to, children }) => {
    return (
        <NavLink to={to} className={styles['none-decor']}>
            {children}
        </NavLink>
    )
}

export default CustomLink
