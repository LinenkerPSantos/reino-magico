import { useState } from 'react'
import { useGameData } from '../../hooks/useGameData'
import styles from './Classes.module.css'

const CLASS_ICONS = {
  'Alquimista':'🧪','Assassino':'🔪','Bardo':'🎵','Bruxo':'🔮',
  'Caçador':'🏹','Cavaleiro':'🛡️','Espiritualista':'✨',
  'Guardião':'🏰','Guerreiro':'⚔️','Mago':'📖','Monge':'👊',
}
const CLASS_LORE = {
  "Alquimista":{desc:"O Alquimista é um estudioso das substâncias, dos segredos ocultos na matéria e das interações entre o físico e o arcano. Especialista em investigação e manipulação, o Alquimista enxerga o que outros ignoram.",papel:"Investigação e Desarme de Armadilhas"},
  "Assassino":{desc:"O Assassino é a personificação da precisão letal. Ele não busca confrontos diretos, mas sim o momento perfeito para atacar — quando o alvo está vulnerável, distraído ou já condenado sem perceber.",papel:"Ataques Furtivos e Críticos"},
  "Bardo":{desc:"O Bardo é um manipulador de emoções, palavras e percepções. Sua força não está na violência, mas na capacidade de influenciar decisões, moldar narrativas e conduzir situações a seu favor.",papel:"Interação, Política e Manipulação"},
  "Bruxo":{desc:"O Bruxo é um manipulador de forças além da compreensão comum. Seu poder não vem apenas de estudo, mas de pactos — acordos com entidades que concedem poder em troca de influência.",papel:"Controle e Manipulação de Grupo"},
  "Caçador":{desc:"O Caçador é um especialista em rastreamento, sobrevivência e combate à distância. Ele domina o ambiente ao seu redor, utilizando paciência, precisão e conhecimento do terreno.",papel:"Ataques à Longa Distância e Rastreamento"},
  "Cavaleiro":{desc:"O Cavaleiro é um combatente excepcional, capaz de assumir a linha de frente como defensor implacável ou duelista nato. Sua força não está apenas em derrotar inimigos, mas em proteger aliados.",papel:"Tank e Duelista de Linha de Frente"},
  "Espiritualista":{desc:"O Espiritualista é a ponte entre o mundo material e as forças que o sustentam. Sua força não está em golpes ou destruição, mas na capacidade de fortalecer aliados, curar ferimentos e moldar o fluxo de mana.",papel:"Suporte, Cura e Buffs"},
  "Guardião":{desc:"O Guardião é o mestre dos escudos e das armaduras pesadas, um defensor implacável que permanece na linha de frente protegendo seus aliados.",papel:"Tank e Suporte"},
  "Guerreiro":{desc:"O Guerreiro é a expressão mais direta do combate. Ele não precisa de truques, alianças sobrenaturais ou poderes arcanos para dominar um campo de batalha.",papel:"Combate Corpo a Corpo Baseado em Força"},
  "Mago":{desc:"O Mago é o ápice do estudo arcânico. Nenhuma classe compreende a magia com tanta profundidade — nem a manipula com tamanha precisão.",papel:"Dano Mágico e Estudioso"},
  "Monge":{desc:"O Monge é um combatente espiritual e arcano, especializado em múltiplos ataques rápidos, movimentos ágeis e reflexos extraordinários.",papel:"DPS Físico e Mágico (Híbrido)"},
}
const ATTR_NAMES = {FOR:'Força',DES:'Destreza',VIT:'Vitalidade',INT:'Intelecto',PRE:'Presença'}

export default function Classes() {
  const { data, loading, error } = useGameData()
  const [selected, setSelected]  = useState(null)

  if (loading) return <div className={styles.loading}>Carregando classes...</div>
  if (error)   return <div className={styles.loading}>⚠ Servidor offline — inicie o backend.</div>

  const classes = data.classes || {}
  const names   = Object.keys(classes).sort()
  const active  = selected || names[0]
  const cl      = classes[active]
  const lore    = CLASS_LORE[active] || {}

  const armas   = cl?.armas && cl.armas !== 'Nenhuma' ? cl.armas.split(',').map(s => s.trim()) : []
  const spells  = cl?.spellAccess || []

  return (
    <div className={styles.page}>
      <div className={styles.strip}>
        {names.map(name => (
          <button
            key={name}
            className={`${styles.selItem} ${active === name ? styles.selActive : ''}`}
            onClick={() => setSelected(name)}
          >
            <span className={styles.selIcon}>{CLASS_ICONS[name] || '◈'}</span>
            <span className={styles.selName}>{name}</span>
          </button>
        ))}
      </div>

      {cl && (
        <div className={styles.content}>
          <div className={styles.heroArea}>
            <p className={styles.heroEyebrow}>{lore.papel ? `◈ ${lore.papel}` : 'Especialização'}</p>
            <h1 className={styles.heroTitle}>{active}</h1>
            <p className={styles.heroIntro}>{lore.desc?.substring(0, 220)}...</p>
            <span className={styles.heroGlyph}>{CLASS_ICONS[active] || '◈'}</span>
          </div>

          <div className={styles.trio}>
            <div className={styles.trioItem}><span className={styles.trioVal}>+{cl.vida}</span><span className={styles.trioLbl}>❤ Vida</span></div>
            <div className={styles.trioItem}><span className={styles.trioVal}>+{cl.mana}</span><span className={styles.trioLbl}>💧 Mana</span></div>
            <div className={styles.trioItem}><span className={styles.trioVal}>{ATTR_NAMES[cl.atrib] || cl.atrib}</span><span className={styles.trioLbl}>Atributo Principal</span></div>
          </div>

          <div className={styles.abGrid}>
            <div className={styles.abCard}>
              <div className={styles.abName}>{cl.hab1}</div>
              <div className={styles.abDesc}>{cl.h1}</div>
            </div>
            <div className={styles.abCard}>
              <div className={styles.abName}>{cl.hab2}</div>
              <div className={styles.abDesc}>{cl.h2}</div>
            </div>
          </div>

          <div className={styles.dataGrid}>
            <div>
              <p className={styles.dataTitle}>Perícias de Classe</p>
              <div className={styles.pills}>{(cl.pericias || []).map(p => <span key={p} className={`${styles.pill} ${styles.pillGreen}`}>{p}</span>)}</div>
              <p className={styles.dataTitle} style={{marginTop:'20px'}}>Proficiências</p>
              <div className={styles.pills}>
                <span className={`${styles.pill} ${styles.pillBlue}`}>Armas Simples</span>
                {armas.map(a => <span key={a} className={`${styles.pill} ${styles.pillBlue}`}>{a}</span>)}
              </div>
            </div>
            <div>
              <p className={styles.dataTitle}>Acesso a Magias</p>
              <div className={styles.pills}>
                {spells.map(s => <span key={s} className={`${styles.pill} ${styles.pillPurple}`}>{s}</span>)}
                {cl.extraSlots > 0 && <span className={`${styles.pill} ${styles.pillGold}`}>+{cl.extraSlots} {cl.extraSlotType}</span>}
              </div>
            </div>
          </div>

          {lore.desc && (
            <div className={styles.lore}>
              <p className={styles.loreTitle}>Sobre a Classe</p>
              <p className={styles.loreText}>{lore.desc}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
