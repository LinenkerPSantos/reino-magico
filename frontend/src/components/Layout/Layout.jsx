import { Outlet } from 'react-router-dom'
import Nav from '../Nav/Nav'
import styles from './Layout.module.css'

export default function Layout() {
  return (
    <>
      <Nav />
      <main className={styles.main}><Outlet /></main>
    </>
  )
}
