import { useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import styles from './Nav.module.css'

export default function Nav() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  // Fecha o menu ao navegar
  const close = () => setOpen(false)

  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.brand} onClick={close}>
        ⚔ REINO MÁGICO
        <span>Sistema de RPG</span>
      </Link>

      {/* Botão hamburguer — só aparece no mobile */}
      <button
        className={`${styles.hamburger} ${open ? styles.hamburgerOpen : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-label="Menu"
      >
        <span /><span /><span />
      </button>

      {/* Links — no desktop são inline, no mobile são o menu aberto */}
      <ul className={`${styles.links} ${open ? styles.linksOpen : ''}`}>
        <li><NavLink to="/" end onClick={close}>Início</NavLink></li>
        <li><NavLink to="/mecanicas" onClick={close}>Mecânicas</NavLink></li>
        <li><NavLink to="/historia" onClick={close}>História</NavLink></li>
        <li><NavLink to="/racas" onClick={close}>Raças</NavLink></li>
        <li><NavLink to="/classes" onClick={close}>Classes</NavLink></li>
        <li><NavLink to="/equipamentos" onClick={close}>Equipamentos</NavLink></li>
        <li><NavLink to="/magias" onClick={close}>Magias</NavLink></li>
        <li><NavLink to="/entidades" onClick={close}>Entidades</NavLink></li>
        <li><NavLink to="/aprimoramento" onClick={close}>Aprimoramento</NavLink></li>
        <li><NavLink to="/sobre" onClick={close}>Sobre</NavLink></li>
        <li className={styles.dropdown}>
          <button className={styles.dropBtn}>Conteúdo ▾</button>
          <div className={styles.dropMenu}>
            <a href="/ficha.html" target="_blank" rel="noopener noreferrer" onClick={close}>
              <span className={styles.dmIcon}>📋</span>
              <span className={styles.dmInfo}>
                <span className={styles.dmTitle}>Ficha de Personagem</span>
                <span className={styles.dmDesc}>Crie seu aventureiro</span>
              </span>
            </a>
          </div>
        </li>
      </ul>

      {/* Overlay escuro ao abrir o menu mobile */}
      {open && <div className={styles.overlay} onClick={close} />}
    </nav>
  )
}
