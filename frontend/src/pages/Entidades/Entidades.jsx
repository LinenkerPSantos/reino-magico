import { useState } from 'react'
import { useGameData } from '../../hooks/useGameData'
import { ENTITY_IMAGES, ENTITY_LORE, ENTITY_DOMAIN_IMAGES } from './entidadesData'
import styles from './Entidades.module.css'

const ELEM_COLORS = {
  Fogo:'#e05c3a', Água:'#4a9fc8', Terra:'#8a6a3a', Vento:'#7acfa0',
  Arcano:'#9a5ed4', Sagrado:'#c9a227', Sombra:'#7a4a8a', Caótico:'#cc4444',
  Elemental:'#7acfa0', Sagrada:'#c9a227', Caótica:'#cc4444',
}
const TIPO_LABEL = {
  Elemental: 'Entidades Elementais',
  Sagrada:   'Divindades Sagradas',
  Caótica:   'Divindades Caóticas',
}
const TIPO_DESC = {
  Elemental: 'Espíritos primordiais dos elementos que habitam o mundo desde os primórdios. Vinculam-se a qualquer personagem com Pacto Elemental. Exigem domínio real sobre o elemento para conceder sua Graça.',
  Sagrada:   'Os Pilares da Existência — fragmentos do Tudo que governam os grandes domínios da realidade. Concedem Magia Divina através de devoção e ascensão espiritual gradual.',
  Caótica:   'Primordiais da Corrupção, nascidos de impulsos emocionais levados ao estado primordial. Oferecem poderes devastadores em troca de corrupção progressiva e transformação da alma.',
}
const TIPO_ORDER = ['Elemental', 'Sagrada', 'Caótica']

function normalize(s) {
  return s.toLowerCase().replace(/^(o|a|os|as) /, '').replace(/s$/, '').trim()
}

function getLore(nome) {
  if (ENTITY_LORE[nome]) return ENTITY_LORE[nome]
  const n = normalize(nome)
  const key = Object.keys(ENTITY_LORE).find(k => normalize(k) === n)
  return key ? ENTITY_LORE[key] : null
}

function getImage(nome) {
  if (ENTITY_IMAGES[nome]) return ENTITY_IMAGES[nome]
  const n = normalize(nome)
  const key = Object.keys(ENTITY_IMAGES).find(k => normalize(k) === n)
  return key ? ENTITY_IMAGES[key] : null
}

function getDomainImage(nome) {
  if (ENTITY_DOMAIN_IMAGES[nome]) return ENTITY_DOMAIN_IMAGES[nome]
  const n = normalize(nome)
  const key = Object.keys(ENTITY_DOMAIN_IMAGES).find(k => normalize(k) === n)
  return key ? ENTITY_DOMAIN_IMAGES[key] : null
}

function DetailPanel({ detail }) {
  const [tab, setTab] = useState('lore')
  const c = ELEM_COLORS[detail.elemento] || 'var(--gold)'
  const lore = getLore(detail.nome)
  const img = getImage(detail.nome)
  const domainImg = getDomainImage(detail.nome)

  const tabs = [
    { id: 'lore',   label: 'Lore' },
    { id: 'dominio', label: 'Domínio' },
    { id: 'poder',  label: 'Poder' },
  ]

  return (
    <div className={styles.detailCard} style={{ borderColor: c }}>
      {img && (
        <div className={styles.detailImgWrap}>
          <img src={img} alt={detail.nome} className={styles.detailImg} />
        </div>
      )}

      <div className={styles.detailElem} style={{ color: c }}>
        {detail.elemento} · {TIPO_LABEL[detail.tipo] || detail.tipo}
      </div>
      <h2 className={styles.detailName} style={{ color: c }}>{detail.nome}</h2>
      <p className={styles.detailTitulo}>{detail.titulo}</p>

      {lore && (
        <div className={styles.loreTabs}>
          {tabs.map(t => (
            <button
              key={t.id}
              className={`${styles.loreTab} ${tab === t.id ? styles.loreTabActive : ''}`}
              style={tab === t.id ? { borderBottomColor: c, color: c } : {}}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      {(!lore || tab === 'lore') && (
        <div className={styles.loreSection}>
          {lore?.personalidade && (
            <>
              <h4 className={styles.loreSubTitle} style={{ color: c }}>Personalidade</h4>
              <p className={styles.loreText}>{lore.personalidade}</p>
            </>
          )}
          {lore?.descricao ? (
            <>
              <h4 className={styles.loreSubTitle} style={{ color: c }}>Descrição</h4>
              {lore.descricao.split('\n\n').map((p, i) => (
                <p key={i} className={styles.loreText}>{p}</p>
              ))}
            </>
          ) : (
            <p className={styles.loreText}>{detail.descricao}</p>
          )}
        </div>
      )}

      {lore && tab === 'dominio' && lore.dominio && (
        <div className={styles.loreSection}>
          <h4 className={styles.loreSubTitle} style={{ color: c }}>— {lore.dominio.nome}</h4>
          {lore.dominio.desc.split('\n\n').map((p, i) => (
            <p key={i} className={styles.loreText}>{p}</p>
          ))}
          {domainImg && (
            <div className={styles.detailImgWrap}>
              <img src={domainImg} alt={lore.dominio.nome} className={styles.detailImg} />
            </div>
          )}
          {lore.habilidades && (
            <div className={styles.habilidadesList} style={{ borderColor: c + '44' }}>
              <p className={styles.habilidadesLabel} style={{ color: c }}>Habilidades Divinas</p>
              {lore.habilidades.map(h => (
                <span key={h} className={styles.habilidadeTag} style={{ borderColor: c + '55', color: c }}>{h}</span>
              ))}
            </div>
          )}
        </div>
      )}

      {lore && tab === 'poder' && (
        <div className={styles.loreSection}>
          {(lore.graca || detail.efeito_nome) && (
            <div className={styles.efeitoBox} style={{ borderColor: c + '44' }}>
              <div className={styles.efeitoNome} style={{ color: c }}>
                ⚡ {lore.graca?.nome || detail.efeito_nome}
              </div>
              <p className={styles.efeitoDesc}>
                {lore.graca?.desc || detail.efeito}
              </p>
            </div>
          )}
          {lore.requisito && (
            <div className={styles.requisitoBox}>
              <p className={styles.requisitoLabel}>Requisito para acessar</p>
              <p className={styles.requisitoText}>{lore.requisito}</p>
            </div>
          )}
          {lore.frase && (
            <p className={styles.frase}>{lore.frase}</p>
          )}
          {!lore.graca && detail.efeito && (
            <p className={styles.loreText}>{detail.efeito}</p>
          )}
        </div>
      )}
    </div>
  )
}

export default function Entidades() {
  const { data, loading, error } = useGameData()
  const [activeGroup, setActiveGroup] = useState('Elemental')
  const [selected, setSelected] = useState(null)

  if (loading) return <div className={styles.loading}>Carregando entidades...</div>
  if (error)   return <div className={styles.loading}>⚠ Servidor offline — inicie o backend.</div>

  const entities = data.entities || []
  const groups = {}
  for (const e of entities) {
    if (!groups[e.tipo]) groups[e.tipo] = []
    groups[e.tipo].push(e)
  }
  const tipos = TIPO_ORDER.filter(t => groups[t])
  const lista = groups[activeGroup] || []
  const detail = selected ? entities.find(e => e.nome === selected) : null

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <p className={styles.eyebrow}>Lista de Entidades e Divindades</p>
        <h1 className={styles.pageTitle}>Entidades</h1>
        <div className={styles.divider} />
        <p className={styles.lead}>
          Seres de poder imenso que permeiam o cosmos do Reino Mágico. Consciências ancestrais,
          forças primordiais e manifestações vivas de conceitos fundamentais. Formar vínculo com
          uma delas significa marcar a própria alma com parte de sua essência primordial.
        </p>
      </div>

      <div className={styles.groupTabs}>
        {tipos.map(t => (
          <button
            key={t}
            className={`${styles.groupTab} ${activeGroup === t ? styles.groupTabActive : ''}`}
            style={activeGroup === t ? { borderBottomColor: ELEM_COLORS[t], color: ELEM_COLORS[t] } : {}}
            onClick={() => { setActiveGroup(t); setSelected(null) }}
          >
            {TIPO_LABEL[t] || t}
            <span className={styles.groupCount}>{(groups[t] || []).length}</span>
          </button>
        ))}
      </div>

      {TIPO_DESC[activeGroup] && (
        <div className={styles.groupDesc}>{TIPO_DESC[activeGroup]}</div>
      )}

      <div className={styles.layout}>
        <div className={styles.entList}>
          {lista.map(e => {
            const c = ELEM_COLORS[e.elemento] || 'var(--gold)'
            const sel = selected === e.nome
            const img = getImage(e.nome)
            return (
              <button
                key={e.nome}
                className={`${styles.entItem} ${sel ? styles.entItemActive : ''}`}
                style={sel ? { borderColor: c, background: c + '11' } : {}}
                onClick={() => setSelected(sel ? null : e.nome)}
              >
                {img && <img src={img} alt={e.nome} className={styles.entThumb} />}
                <div className={styles.entItemInfo}>
                  <div className={styles.entItemName} style={sel ? { color: c } : {}}>{e.nome}</div>
                  <div className={styles.entItemTitulo}>{e.titulo}</div>
                  <span className={styles.entElem} style={{ borderColor: c + '66', color: c, background: c + '15' }}>
                    {e.elemento}
                  </span>
                </div>
              </button>
            )
          })}
        </div>

        <div className={styles.entDetail}>
          {detail ? (
            <DetailPanel detail={detail} />
          ) : (
            <div className={styles.detailEmpty}>
              <span>Selecione uma entidade para ver os detalhes</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
