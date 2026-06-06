import { NavLink, Link } from 'react-router-dom'
import styles from './Nav.module.css'

export default function Nav() {
  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.brand}>
        ⚔ REINO MÁGICO
        <span>Sistema de RPG</span>
      </Link>

      <ul className={styles.links}>
        <li><NavLink to="/" end>Início</NavLink></li>
        <li><NavLink to="/mecanicas">Mecânicas</NavLink></li>
        <li><NavLink to="/historia">História</NavLink></li>
        <li><NavLink to="/racas">Raças</NavLink></li>
        <li><NavLink to="/classes">Classes</NavLink></li>
        <li><NavLink to="/equipamentos">Equipamentos</NavLink></li>
        <li><NavLink to="/magias">Magias</NavLink></li>
        <li><NavLink to="/entidades">Entidades</NavLink></li>
        <li className={styles.dropdown}>
          <button className={styles.dropBtn}>Conteúdo ▾</button>
          <div className={styles.dropMenu}>
            <a href="/ficha.html" target="_blank" rel="noopener noreferrer">
              <span className={styles.dmIcon}>📋</span>
              <span className={styles.dmInfo}>
                <span className={styles.dmTitle}>Ficha de Personagem</span>
                <span className={styles.dmDesc}>Crie seu aventureiro</span>
              </span>
            </a>
          </div>
        </li>
      </ul>
    </nav>
  )
}
