import { useState } from 'react'
import { useGameData } from '../../hooks/useGameData'
import styles from './Magias.module.css'

const ELEM_COLORS = {
  Fogo:'#e05c3a', Água:'#4a9fc8', Terra:'#8a6a3a', Vento:'#7acfa0',
  Arcano:'#9a5ed4', Sagrado:'#c9a227', Trovão:'#c9a227', Caótico:'#cc4444',
}

const ELEM_IMAGES = {
  Fogo:   '/img/Circulos/Fogo.png',
  Água:   '/img/Circulos/Agua.png',
  Terra:  '/img/Circulos/Terra.png',
  Vento:  '/img/Circulos/Vento.png',
  Arcano: '/img/Circulos/Arcano.png',
  Sagrado:'/img/Circulos/Sagrado.png',
  Trovão: '/img/Circulos/Trov%C3%A3o.png',
  Caótico:'/img/Circulos/Caotico.png',
}

const TABS = [
  { key: 'sistema',    label: 'Sistema de Conjurador' },
  { key: 'natureza',   label: 'Natureza da Mana' },
  { key: 'conhecidas', label: 'Magias Conhecidas' },
  { key: 'atributos',  label: 'Atributos de Conjuração' },
  { key: 'niveis',     label: 'Níveis de Magia' },
]

function SistemaConjurador() {
  return (
    <div className={styles.tabContent}>
      <h2 className={styles.secTitle}>Sistema de Conjurador</h2>
      <p className={styles.secText}>
        No Reino Mágico, nem todo personagem conjura magias — mas aqueles que o fazem operam dentro de um
        sistema unificado baseado em <strong>Pontos de Mana (PM)</strong>. Mana é a energia vital que permeia
        o cosmos, canalizada pelos Cinco Pilares, e que todo conjurador aprende a moldar à sua vontade.
      </p>
      <p className={styles.secText}>
        Conjurar uma magia consome PM. Quando o conjurador fica sem mana, não pode mais lançar magias
        até recuperá-los por descanso. Truques (nível 0) não custam PM e podem ser usados à vontade.
      </p>

      <h3 className={styles.subTitle}>Como funciona o pool de Mana</h3>
      <div className={styles.rulesGrid}>
        <div className={styles.ruleCard}>
          <div className={styles.ruleLabel}>Reserva de Mana</div>
          <div className={styles.ruleFormula}>Presença × 2 + Bônus de Classe</div>
          <p className={styles.ruleDesc}>A reserva total de PM do personagem. Aumenta com o nível de Presença e varia por classe.</p>
        </div>
        <div className={styles.ruleCard}>
          <div className={styles.ruleLabel}>Limite de Mana por Turno</div>
          <div className={styles.ruleFormula}>Proficiência + 2</div>
          <p className={styles.ruleDesc}>Máximo de PM que pode ser gasto em um único turno. Impede que conjuradores esgotem tudo de uma vez.</p>
        </div>
        <div className={styles.ruleCard}>
          <div className={styles.ruleLabel}>CD de Conjuração</div>
          <div className={styles.ruleFormula}>8 + Atributo Base + Foco</div>
          <p className={styles.ruleDesc}>Dificuldade para os alvos resistirem às magias. Cada classe usa um atributo diferente como base.</p>
        </div>
        <div className={styles.ruleCard}>
          <div className={styles.ruleLabel}>Recuperação (Descanso Curto)</div>
          <div className={styles.ruleFormula}>1d4 + Presença PM</div>
          <p className={styles.ruleDesc}>Um descanso de 1 hora recupera parte da reserva de mana.</p>
        </div>
        <div className={styles.ruleCard}>
          <div className={styles.ruleLabel}>Recuperação (Descanso Longo)</div>
          <div className={styles.ruleFormula}>2d4 + Presença PM</div>
          <p className={styles.ruleDesc}>Um descanso completo de 8 horas recupera mana e vida com bônus dobrado.</p>
        </div>
        <div className={styles.ruleCard}>
          <div className={styles.ruleLabel}>Truques (Nível 0)</div>
          <div className={styles.ruleFormula}>0 PM — uso livre</div>
          <p className={styles.ruleDesc}>Magias básicas sem custo. Todo conjurador conhece 2 truques e pode usá-los indefinidamente.</p>
        </div>
      </div>

      <h3 className={styles.subTitle}>Quem pode conjurar?</h3>
      <p className={styles.secText}>
        Classes conjuradoras têm acesso a um ou mais tipos de magia definidos por sua especialização.
        O tipo de magia acessível determina o pool de feitiços disponíveis para aprender.
        Classes não-conjuradoras podem adquirir magias via talentos especiais como <em>Pacto Ancestral</em> ou
        <em>Toque Arcano</em>.
      </p>
    </div>
  )
}

const ELEMENTOS = [
  {
    n:'Terra', color:'#8a6a3a',
    desc:'O elemento de Terra representa estabilidade, resistência e força primordial. Associado à solidez das montanhas e à permanência da pedra, este elemento manifesta magias voltadas à proteção, sustentação e domínio do terreno. Feitiços de Terra costumam erguer barreiras, manipular rochas, endurecer estruturas e fortalecer o corpo contra impactos e destruição.',
    simbolo:'Formado por um círculo externo envolvendo um losango central — a união entre permanência e equilíbrio material. Em versões mais avançadas, as bordas podem conter inscrições em línguas Selvagem ou Silvestre.',
    linguas:'Selvagem, Silvestre',
  },
  {
    n:'Fogo', color:'#e05c3a',
    desc:'O elemento de Fogo representa destruição, impulso e intensidade. Ligado à chama primordial e ao poder da transformação, este elemento manifesta magias explosivas, agressivas e difíceis de conter. Feitiços de Fogo costumam consumir tudo ao redor, liberar ondas de calor, provocar explosões e transformar energia em pura devastação.',
    simbolo:'Marcado por um triângulo central, representando ascensão, poder e instabilidade. As bordas frequentemente carregam escritas Dracônicas ou Infernais, utilizadas para intensificar a violência e a ferocidade das chamas.',
    linguas:'Dracônico, Infernal',
  },
  {
    n:'Água', color:'#4a9fc8',
    desc:'O elemento de Água representa adaptação, fluidez e transformação. Associado ao movimento constante dos mares e à serenidade da lua, este elemento manifesta magias capazes de assumir diferentes funções — ofensivas, defensivas ou restauradoras. Feitiços de Água podem moldar correntes, criar barreiras líquidas, envolver inimigos em pressão esmagadora ou canalizar energias regenerativas.',
    simbolo:'Formado por duas ondas centrais, representando o fluxo contínuo, os ciclos naturais e a ligação entre maré e lua. As bordas frequentemente carregam inscrições em línguas Primordiais ou Naga.',
    linguas:'Primordial, Naga',
  },
  {
    n:'Vento', color:'#7acfa0',
    desc:'O elemento de Vento representa velocidade, precisão e liberdade de movimento. Associado aos céus abertos e às correntes invisíveis do mundo, este elemento manifesta magias voltadas à agilidade, deslocamento e controle do fluxo do ar. Feitiços de Vento costumam impulsionar movimentos, criar lâminas cortantes de ar e dificultar a aproximação de inimigos.',
    simbolo:'Marcado por duas setas voltadas para cima em seu centro, representando ascensão, impulso e o fluxo constante dos ventos. As bordas frequentemente carregam escritas em línguas Feéricas ou Élficas.',
    linguas:'Feérico, Élfico',
  },
  {
    n:'Trovão', color:'#c9c227',
    desc:'O elemento de Trovão representa energia explosiva, impacto imediato e poder destrutivo concentrado. Associado ao som das tempestades e à força brutal dos céus, este elemento manifesta magias rápidas, violentas e difíceis de reagir. Feitiços de Trovão costumam descarregar impulsos elétricos, provocar ondas de choque e atravessar defesas antes que o alvo consiga se preparar.',
    simbolo:'Marcado por uma meia seta fechada apontando para baixo, representando a descarga repentina da tempestade. As bordas frequentemente carregam inscrições em línguas Anã ou Gigante.',
    linguas:'Anão, Gigante',
  },
  {
    n:'Sagrado', color:'#c9a227',
    desc:'O elemento Sagrado representa ordem, purificação e equilíbrio. Associado à luz, à harmonia e às forças divinas, este elemento manifesta magias voltadas à proteção, cura e erradicação da corrupção. Feitiços Sagrados costumam restaurar ferimentos, fortalecer aliados, purificar maldições e criar barreiras capazes de resistir às forças sombrias e caóticas.',
    simbolo:'Geralmente apresenta uma estrela, um sol ou uma flor em seu centro, representando iluminação, renovação e perfeição espiritual. As bordas frequentemente carregam inscrições na Língua Celestial.',
    linguas:'Celestial',
  },
  {
    n:'Caótico', color:'#cc4444',
    desc:'O elemento Caótico representa distorção, instabilidade e corrupção. Associado às forças que desafiam a ordem natural, este elemento manifesta magias imprevisíveis, violentas e difíceis de compreender. Feitiços Caóticos costumam alterar a realidade, deformar matéria, corromper energia mágica e produzir efeitos inesperados que fogem da lógica comum.',
    simbolo:'Geralmente apresenta um losango envolvendo uma estrela interna, representando a ruptura do equilíbrio. À primeira vista, muitos confundem com o Círculo de Terra, porém as diferenças tornam-se evidentes em seus traços irregulares e inscrições agressivas em Língua Abissal.',
    linguas:'Abissal',
  },
  {
    n:'Arcano', color:'#9a5ed4',
    desc:'O elemento Arcano é considerado a forma mais pura da magia. Diferente dos demais, o Arcano não representa um elemento natural específico, mas a própria essência mágica em seu estado bruto. É a base de incontáveis feitiços e o fundamento sobre o qual muitas magias assumem propriedades elementais mais complexas. Por essa razão, grande parte dos conjuradores inicia seus estudos através do Arcano.',
    simbolo:'Geralmente possui estruturas simples — círculos, triângulos, hexágonos ou linhas simétricas. Raramente apresenta inscrições complexas ou línguas específicas, tornando o Arcano a forma mais acessível e amplamente utilizada entre iniciantes.',
    linguas:'Arcano (sem língua fixa)',
  },
]

function NaturezaMana() {
  const [selected, setSelected] = useState(null)
  const elem = selected ? ELEMENTOS.find(e => e.n === selected) : null

  return (
    <div className={styles.tabContent}>
      <h2 className={styles.secTitle}>Natureza da Mana</h2>

      <div className={styles.natIntroBlock}>
        <h3 className={styles.natIntroTitle}>Círculos Arcanos</h3>
        <p className={styles.secText}>
          A magia manifesta-se através de <strong>Círculos Arcanos</strong>, representações visíveis da energia sendo moldada.
          Cada círculo gera uma fonte de poder ligada a uma propriedade mágica específica, revelando a natureza da magia conjurada.
        </p>
        <p className={styles.secText}>
          Os círculos podem surgir ao redor do conjurador, do alvo ou em pontos específicos do ambiente, variando de tamanho
          conforme o efeito da magia. Magias de grande escala podem formar círculos gigantescos que cobrem áreas inteiras do campo
          de batalha, enquanto feitiços sutis — como sussurros mágicos, ilusões ou controle mental — podem criar pequenos círculos
          discretos, refletidos apenas nos olhos do alvo ou em detalhes quase imperceptíveis.
        </p>
        <p className={styles.secText}>
          A própria estrutura da magia existe através desses círculos, tornando-os parte fundamental da conjuração e da identidade visual do poder arcano.
        </p>
      </div>

      <div className={styles.natIntroBlock}>
        <h3 className={styles.natIntroTitle}>Mana</h3>
        <p className={styles.secText}>
          Mana é a energia utilizada para alimentar magias. Todo ser vivo possui mana em alguma quantidade, porém apenas indivíduos
          treinados conseguem moldá-la conscientemente. A quantidade de mana determina quanto poder um conjurador consegue utilizar
          antes de se esgotar.
        </p>
        <p className={styles.secText}>
          Entretanto, possuir grandes reservas de mana não torna alguém automaticamente um grande mago. <strong>Controle é tão
          importante quanto poder bruto.</strong> Um conjurador habilidoso consegue lançar magias de forma mais eficiente, reduzindo
          desperdícios de energia, aumentando a estabilidade dos feitiços e mantendo sua capacidade de combate por mais tempo.
        </p>
      </div>

      <h3 className={styles.natIntroTitle} style={{ margin: '32px 0 16px' }}>Elementos</h3>
      <p className={styles.secText}>
        A magia é dividida em diferentes elementos. Cada elemento representa uma forma distinta de manipular a mana e interagir com o mundo.
      </p>

      <div className={styles.natGrid}>
        {ELEMENTOS.map(e => (
          <button
            key={e.n}
            className={`${styles.natCard} ${selected === e.n ? styles.natCardActive : ''}`}
            style={{ borderColor: selected === e.n ? e.color : undefined }}
            onClick={() => setSelected(selected === e.n ? null : e.n)}
          >
            <img
              src={ELEM_IMAGES[e.n]} alt={e.n}
              className={styles.natImg}
              style={{ filter: `drop-shadow(0 0 10px ${e.color}99)` }}
            />
            <div className={styles.natName} style={{ color: e.color }}>{e.n}</div>
          </button>
        ))}

        {/* Negativo */}
        <div className={`${styles.natCard} ${styles.natNegativo}`}>
          <div className={styles.natUnknownSymbol}>?</div>
          <div className={styles.natName} style={{ color:'#555' }}>Negativo</div>
        </div>
      </div>

      {elem && (
        <div className={styles.elemDetail} style={{ borderColor: elem.color }}>
          <div className={styles.elemDetailHeader}>
            <img
              src={ELEM_IMAGES[elem.n]} alt={elem.n}
              className={styles.elemDetailImg}
              style={{ filter: `drop-shadow(0 0 16px ${elem.color}99)` }}
            />
            <div>
              <h3 className={styles.elemDetailName} style={{ color: elem.color }}>{elem.n}</h3>
              <div className={styles.elemLinguas}>
                <span className={styles.elemLinguasLabel}>Línguas dos círculos:</span>
                <span style={{ color: elem.color }}>{elem.linguas}</span>
              </div>
            </div>
          </div>
          <p className={styles.secText}>{elem.desc}</p>
          <div className={styles.simboloBox} style={{ borderColor: elem.color + '44' }}>
            <div className={styles.simboloLabel} style={{ color: elem.color }}>◈ Símbolo</div>
            <p className={styles.simboloText}>{elem.simbolo}</p>
          </div>
        </div>
      )}

      {!elem && (
        <div className={styles.natHint}>Clique em um elemento para ver sua descrição completa.</div>
      )}

      {/* Negativo detail — always shown at bottom */}
      <div className={`${styles.elemDetail} ${styles.elemDetailNeg}`}>
        <div className={styles.elemDetailHeader}>
          <div className={styles.natUnknownSymbol} style={{ width:80, height:80, fontSize:'2.2em' }}>?</div>
          <div>
            <h3 className={styles.elemDetailName} style={{ color:'#555' }}>Negativo</h3>
            <div className={styles.elemLinguas}>
              <span className={styles.elemLinguasLabel}>Línguas dos círculos:</span>
              <span style={{ color:'#555' }}>Desconhecidas</span>
            </div>
          </div>
        </div>
        <p className={styles.secText} style={{ color:'var(--text-dim)' }}>
          A força que existe além dos Cinco Pilares. Não representa um elemento — representa a ausência de tudo que os
          elementos sustentam. Seu símbolo é completamente desconhecido pelos estudiosos. Os poucos registros que tentaram
          documentá-lo foram encontrados incompletos, rasgados ou apagados. Nenhum conjurador mortal dominou completamente
          sua natureza — os que tentaram não voltaram para contar.
        </p>
        <div className={styles.simboloBox} style={{ borderColor:'#33333366' }}>
          <div className={styles.simboloLabel} style={{ color:'#555' }}>◈ Símbolo</div>
          <p className={styles.simboloText} style={{ color:'var(--text-dim)', fontStyle:'italic' }}>
            Desconhecido. Nenhum registro sobrevivente descreve sua forma com precisão.
          </p>
        </div>
      </div>
    </div>
  )
}

function MagiasConhecidas({ spells, magic_levels }) {
  const [filterNat, setFilterNat]   = useState('')
  const [filterTipo, setFilterTipo] = useState('')
  const [filterNivel, setFilterNivel] = useState('')
  const [search, setSearch]         = useState('')

  const naturezas = [...new Set(spells.map(s => s.natureza).filter(Boolean))].sort()
  const tipos     = [...new Set(spells.map(s => s.tipo).filter(Boolean))].sort()

  let filtered = spells
  if (filterNat)   filtered = filtered.filter(s => s.natureza === filterNat)
  if (filterTipo)  filtered = filtered.filter(s => s.tipo === filterTipo)
  if (filterNivel) filtered = filtered.filter(s => s.nivel_magia === parseInt(filterNivel))
  if (search)      filtered = filtered.filter(s =>
    s.nome.toLowerCase().includes(search.toLowerCase()) ||
    s.descricao?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className={styles.tabContent}>
      <h2 className={styles.secTitle}>Magias Conhecidas</h2>
      <p className={styles.secText}>
        Lista completa de todas as magias do sistema. Cada magia tem um custo em PM, uma natureza elemental,
        um tipo de acesso e um nível. Use os filtros para encontrar magias por elemento, tipo ou nome.
      </p>

      <div className={styles.filters}>
        <input
          className={styles.searchInput}
          placeholder="Buscar magia..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select className={styles.select} value={filterNivel} onChange={e => setFilterNivel(e.target.value)}>
          <option value="">Todos os níveis</option>
          {(magic_levels || []).map(ml => (
            <option key={ml.nivel} value={ml.nivel}>{ml.nome}</option>
          ))}
        </select>
        <select className={styles.select} value={filterNat} onChange={e => setFilterNat(e.target.value)}>
          <option value="">Todos os elementos</option>
          {naturezas.map(n => <option key={n} value={n}>{n}</option>)}
        </select>
        <select className={styles.select} value={filterTipo} onChange={e => setFilterTipo(e.target.value)}>
          <option value="">Todos os tipos</option>
          {tipos.map(t => <option key={t} value={t}>{t.replace('Magias de ', '').replace('Magias ', '')}</option>)}
        </select>
      </div>

      <div className={styles.spellCount}>{filtered.length} magia{filtered.length !== 1 ? 's' : ''}</div>

      <div className={styles.spellGrid}>
        {filtered.map(s => {
          const nc = ELEM_COLORS[s.natureza] || 'var(--border)'
          const ml = (magic_levels || []).find(l => l.nivel === s.nivel_magia)
          return (
            <div key={s.nome} className={styles.spellCard}>
              <div className={styles.spellName}>{s.nome}</div>
              <div className={styles.spellTags}>
                {s.natureza && <span className={styles.tag} style={{ borderColor: nc, color: nc }}>{s.natureza}</span>}
                {ml && <span className={styles.tag} style={{ borderColor: ml.cor, color: ml.cor }}>{ml.nome}</span>}
                <span className={styles.tag}>{s.custo} PM</span>
                {s.execucao && <span className={styles.tag}>{s.execucao}</span>}
                {s.alcance && <span className={styles.tag}>{s.alcance}</span>}
              </div>
              {s.prereq && <div className={styles.spellPrereq}>Pré-req: {s.prereq}</div>}
              <p className={styles.spellDesc}>{s.descricao}</p>
            </div>
          )
        })}
        {filtered.length === 0 && <p className={styles.empty}>Nenhuma magia encontrada.</p>}
      </div>
    </div>
  )
}

function AtributosConjuracao() {
  const attrs = [
    { n:'Intelecto (INT)', papel:'Conjurador Arcano', desc:'Mago, Alquimista, Bruxo. Define quantas magias o personagem conhece e a CD de Conjuração. Cada ponto de INT aumenta o dano mágico base.' },
    { n:'Presença (PRE)',  papel:'Conjurador Social/Espiritual', desc:'Bardo, Espiritualista. Governa a reserva total de Mana (PRE × 2) e magias de influência e cura.' },
    { n:'Foco',           papel:'Modificador Universal', desc:'Bônus de proficiência que se soma à CD de Conjuração e ao acerto de magias. Aumenta com o nível do personagem.' },
  ]
  return (
    <div className={styles.tabContent}>
      <h2 className={styles.secTitle}>Atributos de Conjuração</h2>
      <p className={styles.secText}>
        Dois atributos governam diretamente o poder mágico de um personagem. A classe determina qual deles
        é o <strong>Atributo Principal de Conjuração</strong> — o que alimenta a CD e o dano.
      </p>
      <div className={styles.attrGrid}>
        {attrs.map(a => (
          <div key={a.n} className={styles.attrCard}>
            <div className={styles.attrName}>{a.n}</div>
            <div className={styles.attrPapel}>{a.papel}</div>
            <p className={styles.attrDesc}>{a.desc}</p>
          </div>
        ))}
      </div>

      <h3 className={styles.subTitle}>Fórmulas</h3>
      <div className={styles.formulaTable}>
        {[
          ['Mana Total',             'Presença × 2 + Bônus de Classe'],
          ['CD de Conjuração',       '8 + Atributo Principal + Foco'],
          ['Magias Conhecidas',      '2 + Intelecto'],
          ['Truques Conhecidos',     '2 (fixo para todos os conjuradores)'],
          ['Limite PM por Turno',    'Foco + 2'],
          ['Dano Mágico (bônus)',    '+ Intelecto ao dano de magias ofensivas'],
        ].map(([l, f]) => (
          <div key={l} className={styles.formulaRow}>
            <span className={styles.formulaLabel}>{l}</span>
            <span className={styles.formulaVal}>{f}</span>
          </div>
        ))}
      </div>

      <h3 className={styles.subTitle}>Limite PM por Turno — Restrição de Uso</h3>
      <div className={styles.rulesGrid}>
        <div className={styles.ruleCard}>
          <div className={styles.ruleLabel}>Conhecer não é o mesmo que conjurar</div>
          <p className={styles.ruleDesc}>
            Um personagem pode possuir magias de nível <strong>Elite</strong> (ou superior) em sua lista de
            magias conhecidas, mas isso não garante que poderá conjurá-las a qualquer momento. Se o
            <strong> custo em PM</strong> da magia ultrapassar o <strong>Limite PM por Turno</strong> do
            conjurador (Proficiência + 2, por padrão), ela simplesmente não pode ser lançada naquele
            turno — mesmo que a reserva total de Mana seja suficiente.
          </p>
          <p className={styles.ruleDesc}>
            Esse limite, porém, não é fixo: <strong>armas, equipamentos e itens especiais</strong> encontrados
            durante a campanha podem elevá-lo, assim como o aprimoramento de <strong>Proficiência</strong>.
            Por isso, vale planejar a evolução do personagem para acompanhar o poder das magias que deseja dominar.
          </p>
        </div>
      </div>
    </div>
  )
}

function NiveisMagia({ magic_levels }) {
  return (
    <div className={styles.tabContent}>
      <h2 className={styles.secTitle}>Níveis de Magia</h2>
      <p className={styles.secText}>
        As magias são classificadas em <strong>níveis de poder</strong>, que determinam o custo em PM e
        os pré-requisitos para aprendê-las. Todo personagem começa no nível de proficiência mágica
        <strong> Menor</strong>, com acesso apenas a magias de Truque, Básica e Menor (níveis 1 a 3) —
        respeitando os tipos de magia aos quais tem acesso por raça, classe ou talento.
      </p>
      <div className={styles.levelList}>
        {(magic_levels || []).map(ml => (
          <div key={ml.nivel} className={styles.levelCard} style={{ borderLeftColor: ml.cor }}>
            <div className={styles.levelBadge} style={{ background: ml.cor + '22', color: ml.cor, borderColor: ml.cor }}>
              Nível {ml.nivel}
            </div>
            <div className={styles.levelName} style={{ color: ml.cor }}>{ml.nome}</div>
            <div className={styles.levelCost}>Custo base: <strong>{ml.custo} PM</strong></div>
          </div>
        ))}
        {(!magic_levels || magic_levels.length === 0) && (
          <p className={styles.empty}>Inicie o backend para carregar os níveis de magia.</p>
        )}
      </div>

      <h3 className={styles.subTitle} style={{ marginTop: 32 }}>Evolução do Conhecimento Mágico</h3>
      <p className={styles.secText}>
        Personagens avançados podem investir pontos de experiência no aprimoramento <strong>Progressão
        Mágica</strong> (Elite, Maior ou Avançado). Essa compra, por si só, <strong>não entrega magias
        novas</strong> — ela apenas <em>habilita o direito</em> de evoluir ou adquirir magias daquele
        tier, através de duas trilhas distintas e complementares:
      </p>
      <div className={styles.rulesGrid}>
        <div className={styles.ruleCard}>
          <div className={styles.ruleLabel}>Trilha A — Magias Aprimoradas</div>
          <div className={styles.ruleFormula}>Evoluir magia já conhecida</div>
          <p className={styles.ruleDesc}>
            Disponível apenas para <strong>Magias Iniciais</strong> e <strong>Magias Sagradas</strong>.
            Ao desbloquear um novo tier de Progressão Mágica, o personagem pode escolher até <strong>3</strong>
            {' '}magias que já conhece dessas categorias e trocá-las pela versão de tier superior — vinculadas
            por nome-base (ex.: "Acelerar" → "Acelerar Elite" → "Acelerar Maior"...). "Até 3" é um teto, não
            uma garantia: quem conhece menos magias elegíveis só pode evoluir essas.
          </p>
        </div>
        <div className={styles.ruleCard}>
          <div className={styles.ruleLabel}>Trilha B — Magias Adicionais</div>
          <div className={styles.ruleFormula}>Adquirir magia nova</div>
          <p className={styles.ruleDesc}>
            Cobre os tipos restritos — <strong>Magias Antigas, de Pacto, de Grimório</strong> e <strong>Magia
            Proibida</strong>. Ter a Progressão Mágica necessária apenas habilita o <em>direito</em> de
            comprar magias desses tipos em níveis mais altos; é o aprimoramento <strong>"Magias Adicionais"</strong>
            {' '}que de fato as entrega — 2 magias novas por compra (até 3 compras, totalizando 6 magias extras),
            sempre respeitando o acesso-base do personagem (ex.: só Elfos têm acesso a Magias Antigas, só
            Magos a Magias de Grimório).
          </p>
        </div>
      </div>
      <p className={styles.secText} style={{ marginTop: 12 }}>
        As duas trilhas são complementares: um Mago com Magias de Grimório, por exemplo, precisa tanto da
        Progressão Mágica (para abrir o direito a tiers superiores de Grimório) quanto de "Magias Adicionais"
        (para realmente recebê-las) — enquanto um Elfo pode usar "Magias Adicionais" para reforçar seu acesso
        natural a Magias Antigas.
      </p>
    </div>
  )
}

export default function Magias() {
  const { data, loading, error } = useGameData()
  const [activeTab, setActiveTab] = useState('sistema')

  if (loading) return <div className={styles.loading}>Carregando sistema de magias...</div>
  if (error)   return <div className={styles.loading}>⚠ Servidor offline — inicie o backend.</div>

  const spells       = data.spells || []
  const magic_levels = data.magic_levels || []

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <p className={styles.eyebrow}>As Magias do Mundo</p>
        <h1 className={styles.pageTitle}>Sistema de Magias</h1>
        <div className={styles.divider} />
        <p className={styles.lead}>As regras completas de conjuração, natureza da mana, feitiços e níveis de poder mágico.</p>
      </div>

      <div className={styles.tabs}>
        {TABS.map(t => (
          <button
            key={t.key}
            className={`${styles.tab} ${activeTab === t.key ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(t.key)}
          >{t.label}</button>
        ))}
      </div>

      <div className={styles.panel}>
        {activeTab === 'sistema'    && <SistemaConjurador />}
        {activeTab === 'natureza'   && <NaturezaMana />}
        {activeTab === 'conhecidas' && <MagiasConhecidas spells={spells} magic_levels={magic_levels} />}
        {activeTab === 'atributos'  && <AtributosConjuracao />}
        {activeTab === 'niveis'     && <NiveisMagia magic_levels={magic_levels} />}
      </div>
    </div>
  )
}
