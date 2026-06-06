import { useState } from 'react'
import { CHAPTERS } from './historiaData'
import styles from './Historia.module.css'

const NARRATOR_ICONS = {
  'narrado por Vento, o Primeiro Espírito': '🌬️',
  'narrado por Terra, a Constante': '⛏️',
  'narrado por Fogo, o Eterno': '🔥',
  'narrado por Mar, o Sem-Memória': '🌊',
  'narrado por O Trovador': '🎵',
}

function ChapterDetail({ chapter }) {
  const [activeSection, setActiveSection] = useState(null)
  const icon = NARRATOR_ICONS[chapter.narrator] || '◈'

  return (
    <div className={styles.eraContent}>
      <div className={styles.eraHeader}>
        <p className={styles.eraNum}>{chapter.label}</p>
        <h2 className={styles.eraTitle}>{chapter.title}</h2>
        <div className={styles.eraNarrator}>
          <span>{icon}</span>
          <em>{chapter.narrator}</em>
        </div>
        <div className={styles.eraIntro}>
          {chapter.intro.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </div>

      <div className={styles.sectionNav}>
        {chapter.sections.map(s => (
          <button
            key={s.title}
            className={`${styles.sectionNavBtn} ${activeSection === s.title ? styles.sectionNavActive : ''}`}
            onClick={() => setActiveSection(activeSection === s.title ? null : s.title)}
          >
            {s.title}
          </button>
        ))}
      </div>

      {chapter.sections.map(s => (
        activeSection === s.title && (
          <div key={s.title} className={styles.sectionBlock}>
            <h3 className={styles.sectionTitle}>{s.title}</h3>
            <div className={styles.sectionParas}>
              {s.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </div>
        )
      ))}

      {!activeSection && (
        <p className={styles.sectionHint}>Selecione uma seção acima para ler.</p>
      )}
    </div>
  )
}

export default function Historia() {
  const [activeChapter, setActiveChapter] = useState('cap1')
  const chapter = CHAPTERS.find(c => c.id === activeChapter)

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <p className={styles.eyebrow}>O Mundo</p>
        <h1 className={styles.pageTitle}>História</h1>
        <div className={styles.divider} />
        <p className={styles.lead}>A história oficial do Reino Mágico em cinco capítulos, cada um narrado por uma das forças primordiais do cosmos.</p>
      </div>

      <div className={styles.eraTabs}>
        {CHAPTERS.map(c => {
          const icon = NARRATOR_ICONS[c.narrator] || '◈'
          return (
            <button
              key={c.id}
              className={`${styles.eraTab} ${activeChapter === c.id ? styles.eraTabActive : ''}`}
              onClick={() => setActiveChapter(c.id)}
            >
              <span>{icon}</span> {c.label}
            </button>
          )
        })}
      </div>

      {chapter && (
        <div className={styles.panel}>
          <ChapterDetail key={chapter.id} chapter={chapter} />
        </div>
      )}
    </div>
  )
}
