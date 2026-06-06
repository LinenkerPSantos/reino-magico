import { useState } from 'react'
import { useGameData } from '../../hooks/useGameData'
import styles from './Equipamentos.module.css'

const MAIN_TABS = [
  { id: 'armas',        label: 'Armas' },
  { id: 'armaduras',    label: 'Armaduras' },
  { id: 'acessorios',   label: 'Acessórios' },
  { id: 'itens',        label: 'Itens & Kits' },
  { id: 'intermediario',label: 'Intermediários' },
  { id: 'lendario',     label: 'Lendários' },
]

const ARMAS_SUBS    = ['Armas Simples CaC','Armas Táticas CaC','Armas de Disparo','Armas Mágicas']
const ARMADURA_SUBS = ['Armaduras Cabeça','Armaduras Tronco','Armaduras Calçado','Escudos']
const ITENS_SUBS    = ['Aventura e Sobrevivência','Kits e Ferramentas','Munição e Consumíveis']
const INTER_SUBS    = ['Armas CaC','Armas Disparo','Armas Mágicas','Armaduras','Cabeça e Calçado','Escudos e Acessórios']

function TabBar({ tabs, active, onSelect, accent }) {
  return (
    <div className={styles.subTabs}>
      {tabs.map(t => {
        const id   = typeof t === 'string' ? t : t.id
        const lbl  = typeof t === 'string' ? t.replace('Armas ','').replace('Armaduras ','') : t.label
        const isA  = active === id
        return (
          <button
            key={id}
            className={`${styles.subTab} ${isA ? styles.subTabActive : ''}`}
            style={isA && accent ? { borderBottomColor: accent, color: accent } : {}}
            onClick={() => onSelect(id)}
          >{lbl}</button>
        )
      })}
    </div>
  )
}

function WeaponTable({ items }) {
  const hasMagic = items.some(i => i.bonus)
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Dano</th>
            <th>Tipo</th>
            {items.some(i => i.alcance) && <th>Alcance</th>}
            <th>Propriedades{hasMagic ? ' / Bônus' : ''}</th>
            <th>Preço</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.nome}>
              <td className={styles.tdNome}>{item.nome}</td>
              <td className={styles.tdDano}>{item.dano}</td>
              <td>{item.tipo_dano}</td>
              {items.some(i => i.alcance) && <td>{item.alcance || '—'}</td>}
              <td className={styles.tdProp}>{item.propriedades || item.bonus || '—'}</td>
              <td className={styles.tdPreco}>{item.preco}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ArmorTable({ items }) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Bônus DB</th>
            {items.some(i => i.tipo) && <th>Tipo</th>}
            {items.some(i => i.requisito) && <th>Requisito</th>}
            <th>Descrição</th>
            <th>Preço</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.nome}>
              <td className={styles.tdNome}>{item.nome}</td>
              <td className={styles.tdDano}>{item.bonus_db ?? '—'}</td>
              {items.some(i => i.tipo) && <td>{item.tipo || '—'}</td>}
              {items.some(i => i.requisito) && <td>{item.requisito || '—'}</td>}
              <td className={styles.tdProp}>{item.descricao || item.propriedades || '—'}</td>
              <td className={styles.tdPreco}>{item.preco}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ItemTable({ items }) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Preço</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.nome}>
              <td className={styles.tdNome}>{item.nome}</td>
              <td className={styles.tdDesc}>{item.descricao}</td>
              <td className={styles.tdPreco}>{item.preco}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function EfeitosList({ efeitos }) {
  const list = typeof efeitos === 'string' ? JSON.parse(efeitos) : efeitos
  if (!list?.length) return null
  return (
    <ul className={styles.efeitosList}>
      {list.map((e, i) => (
        <li key={i} className={styles.efeito}>
          <span className={styles.efeitoNome}>{e.nome}</span>
          <span className={styles.efeitoDesc}>{e.desc}</span>
        </li>
      ))}
    </ul>
  )
}

function MaldicaoBox({ maldicao }) {
  const list = typeof maldicao === 'string' ? JSON.parse(maldicao) : maldicao
  if (!list?.length) return null
  return (
    <div className={styles.maldicaoBox}>
      <p className={styles.maldicaoLabel}>⚠ Maldição</p>
      {list.map((m, i) => (
        <div key={i} className={styles.efeito}>
          <span className={styles.efeitoNome}>{m.nome}</span>
          <span className={styles.efeitoDesc}>{m.desc}</span>
        </div>
      ))}
    </div>
  )
}

function InterCard({ item }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`${styles.interCard} ${open ? styles.interCardOpen : ''}`}>
      <button className={styles.interCardHeader} onClick={() => setOpen(o => !o)}>
        <div className={styles.interCardLeft}>
          <span className={styles.interNome}>{item.nome}</span>
          {item.base && <span className={styles.interBase}>{item.base}</span>}
        </div>
        <div className={styles.interCardRight}>
          {item.dano && <span className={styles.interDano}>{item.dano}</span>}
          {item.bonus_db && <span className={styles.interDano}>{item.bonus_db}</span>}
          <span className={styles.interPreco}>{item.preco}</span>
          <span className={styles.chevron}>{open ? '▲' : '▼'}</span>
        </div>
      </button>
      {open && (
        <div className={styles.interBody}>
          <div className={styles.interMeta}>
            {item.requisito && <span>Req: {item.requisito}</span>}
            {item.propriedades && <span>{item.propriedades}</span>}
            {item.alcance && <span>Alcance: {item.alcance}</span>}
            {item.tipo && <span>{item.tipo}</span>}
          </div>
          {item.efeitos && <EfeitosList efeitos={item.efeitos} />}
          {item.maldicao && <MaldicaoBox maldicao={item.maldicao} />}
        </div>
      )}
    </div>
  )
}

function LendarioCard({ item }) {
  const [open, setOpen] = useState(false)
  const corrupto = item.sub?.includes('Corrompido') || item.maldicao
  return (
    <div className={`${styles.lendCard} ${corrupto ? styles.lendCardCorrupto : ''} ${open ? styles.lendCardOpen : ''}`}>
      <button className={styles.lendHeader} onClick={() => setOpen(o => !o)}>
        <div>
          <span className={styles.lendSub}>{item.subcategoria}</span>
          <span className={styles.lendNome}>{item.nome}</span>
          <span className={styles.lendTipo}>{item.tipo}</span>
        </div>
        <div className={styles.lendHeaderRight}>
          {corrupto && <span className={styles.corruptoBadge}>CORROMPIDO</span>}
          <span className={styles.chevron}>{open ? '▲' : '▼'}</span>
        </div>
      </button>
      {open && (
        <div className={styles.lendBody}>
          {item.lore && <p className={styles.lendLore}>{item.lore}</p>}
          <div className={styles.lendStats}>
            {item.dano && <div><span className={styles.statLabel}>Dano</span><span>{item.dano}</span></div>}
            {item.bonus_db && <div><span className={styles.statLabel}>DB</span><span>{item.bonus_db}</span></div>}
            {item.requisito && <div><span className={styles.statLabel}>Requisito</span><span>{item.requisito}</span></div>}
            {item.alcance && <div><span className={styles.statLabel}>Alcance</span><span>{item.alcance}</span></div>}
          </div>
          {item.efeitos && (
            <>
              <p className={styles.sectionLabel}>Propriedades</p>
              <EfeitosList efeitos={item.efeitos} />
            </>
          )}
          {item.maldicao && <MaldicaoBox maldicao={item.maldicao} />}
        </div>
      )}
    </div>
  )
}

export default function Equipamentos() {
  const { data, loading, error } = useGameData()
  const [mainTab,  setMainTab]  = useState('armas')
  const [armaSub,  setArmaSub]  = useState('Armas Simples CaC')
  const [armSub,   setArmSub]   = useState('Armaduras Cabeça')
  const [itensSub, setItensSub] = useState('Aventura e Sobrevivência')
  const [interSub, setInterSub] = useState('Armas CaC')

  if (loading) return <div className={styles.loading}>Carregando equipamentos...</div>
  if (error)   return <div className={styles.loading}>⚠ Servidor offline — inicie o backend.</div>

  const all = data.equipamentos || []
  const byCateg  = (cat) => all.filter(i => i.categoria === cat)
  const bySub    = (cat, sub) => all.filter(i => i.categoria === cat && i.subcategoria === sub)

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <p className={styles.eyebrow}>Arsenal do Aventureiro</p>
        <h1 className={styles.pageTitle}>Equipamentos</h1>
        <div className={styles.divider} />
        <p className={styles.lead}>
          Todo aventureiro precisa de suas ferramentas. Armas, armaduras, itens de viagem e
          artefatos lendários que podem decidir o destino de uma batalha — ou de um reino inteiro.
        </p>
      </div>

      <div className={styles.mainTabs}>
        {MAIN_TABS.map(t => (
          <button
            key={t.id}
            className={`${styles.mainTab} ${mainTab === t.id ? styles.mainTabActive : ''}`}
            onClick={() => setMainTab(t.id)}
          >{t.label}</button>
        ))}
      </div>

      <div className={styles.content}>

        {/* ── ARMAS ── */}
        {mainTab === 'armas' && (
          <>
            <TabBar tabs={ARMAS_SUBS} active={armaSub} onSelect={setArmaSub} accent="var(--gold)" />
            <WeaponTable items={byCateg(armaSub)} />
          </>
        )}

        {/* ── ARMADURAS ── */}
        {mainTab === 'armaduras' && (
          <>
            <TabBar tabs={ARMADURA_SUBS} active={armSub} onSelect={setArmSub} accent="var(--gold)" />
            {armSub === 'Escudos'
              ? <ArmorTable items={byCateg('Escudos')} />
              : <ArmorTable items={byCateg(armSub)} />
            }
          </>
        )}

        {/* ── ACESSÓRIOS ── */}
        {mainTab === 'acessorios' && (
          <ItemTable items={byCateg('Acessórios')} />
        )}

        {/* ── ITENS & KITS ── */}
        {mainTab === 'itens' && (
          <>
            <TabBar tabs={ITENS_SUBS} active={itensSub} onSelect={setItensSub} accent="var(--gold)" />
            <ItemTable items={bySub('Itens Gerais', itensSub)} />
          </>
        )}

        {/* ── INTERMEDIÁRIOS ── */}
        {mainTab === 'intermediario' && (
          <>
            <div className={styles.tierNote}>
              Equipamentos Intermediários — adquiridos em missões, recompensas ou comerciantes especializados. Preços em <strong>MP (Moedas de Prata)</strong>.
            </div>
            <TabBar tabs={INTER_SUBS} active={interSub} onSelect={setInterSub} accent="#c9a227" />
            <div className={styles.interList}>
              {bySub('Intermediário', interSub).map(item => (
                <InterCard key={item.nome} item={item} />
              ))}
            </div>
          </>
        )}

        {/* ── LENDÁRIOS ── */}
        {mainTab === 'lendario' && (
          <>
            <div className={styles.tierNote}>
              <strong>Itens Lendários Únicos</strong> — 10 artefatos ligados aos Dez Heróis e às forças cósmicas do mundo.
              Não se compram — se conquistam.
            </div>
            <div className={styles.lendList}>
              {byCateg('Lendário').map(item => (
                <LendarioCard key={item.nome} item={item} />
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  )
}
