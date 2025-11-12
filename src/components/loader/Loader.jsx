import React from 'react'
import styles from './loader.module.css'
const Loader = () => {
    return (
        <div class={styles.loader}>
            <div class={styles.ball}></div>
            <div class={styles.ball}></div>
            <div class={styles.ball}></div>
        </div>
    )
}

export default Loader