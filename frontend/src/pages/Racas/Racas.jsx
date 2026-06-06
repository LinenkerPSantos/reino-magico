import { useState } from 'react'
import { useGameData } from '../../hooks/useGameData'
import styles from './Racas.module.css'

const RACE_ICONS = {
  'Anão':'⛏','Celestial':'✦','Draconato':'🐉','Elfo':'🌿',
  'Fauno':'🐾','Feérico':'🧚','Humano':'👤','Híbrido':'⚡',
  'Infernal':'🔥','Maculado':'🌑',
}
const RACE_IMAGES = {
  'Anão':      '/img/Ra%C3%A7as/An%C3%B5es.png',
  'Celestial': '/img/Ra%C3%A7as/Celestiais.png',
  'Draconato': '/img/Ra%C3%A7as/Draconianos.png',
  'Elfo':      '/img/Ra%C3%A7as/Elfos.png',
  'Fauno':     '/img/Ra%C3%A7as/Faunos.png',
  'Feérico':   '/img/Ra%C3%A7as/Feerico.png',
  'Humano':    '/img/Ra%C3%A7as/HUmanos.png',
  'Híbrido':   '/img/Ra%C3%A7as/Hibrido.png',
  'Infernal':  '/img/Ra%C3%A7as/Infernais.png',
  'Maculado':  '/img/Ra%C3%A7as/Maculados.png',
}

const LORE_TABS = [
  { key: 'intro',   label: 'Visão Geral' },
  { key: 'cultura', label: 'Cultura' },
  { key: 'historia',label: 'História' },
  { key: 'figuras', label: 'Figuras' },
  { key: 'nomes',   label: 'Nomes' },
]

const RACE_LORE = {
  "Anão":{intro:"Os Anões são humanoides robustos, de baixa estatura e resistência excepcional. Forjados — literal e metaforicamente — em ambientes subterrâneos e montanhosos, desenvolveram uma cultura centrada na tradição, no ofício e na honra coletiva.",cultura:"A sociedade anã é organizada em clãs, cada um com sua especialidade — forjadores, guerreiros, mineradores, comerciantes. A honra do clã é levada a sério.",historia:"Os Anões foram os primeiros a organizar algo merecedor do nome de reino. O conflito com os Draconatos durou gerações — a paz só foi possível graças a Durn Maçaneta-de-Ferro e Vorax das Escamas Negras.",figuras:"Durn Maçaneta-de-Ferro — Um dos Dez Heróis. Ferreiro que perdeu o filho na guerra anã-dracônica, colocou o martelo no chão e foi encontrar um Draconato para conversar.",nomes:"Masculinos: Durn, Borin, Tharim, Brokk, Kharok | Femininos: Helga, Thora, Brynja, Kara, Dagna | Famílias: Maçaneta-de-Ferro, Rochafundida, Martelo-Grisalho, Barba-de-Bronze"},
  "Celestial":{intro:"Os Celestiais são seres com uma fagulha divina inscrita em sua essência — uma conexão direta com os Cinco Pilares que sustentam o cosmos.",cultura:"Os Celestiais não possuem uma cultura própria unificada. A Ordem dos Cinco é a estrutura que os une.",historia:"Os Celestiais foram o último povo a se instalar entre as raças do Continente Ancestral. Vieram com um propósito: avisar que o fragmento do Negativo liberado em Ignareth não foi um acidente isolado.",figuras:"Saereneth a Portadora — A primeira Celestial a descer entre os mortais, carregando os textos fundamentais da Ordem dos Cinco.",nomes:"Masculinos: Saeren, Aelarion, Valeth, Kaelion, Orion | Femininos: Saereneth, Elyra, Serapha, Lysandra, Auriel | Títulos: A Portadora, Guardião do Limiar, Vigia da Aurora"},
  "Draconato":{intro:"Os Draconatos são humanoides imponentes cobertos de escamas, com traços inconfundíveis de dragão — caudas, mandíbulas alongadas, olhos rasgados.",cultura:"Os Draconatos vivem em pequenos grupos familiares chamados de Lares. A cultura dracônica valoriza força, disciplina e respeito pela linhagem.",historia:"Os Draconatos desceram dos picos das montanhas enquanto os Anões subiam de baixo. A guerra entre as profundezas e os picos durou décadas.",figuras:"Vorax das Escamas Negras — Um dos Dez Heróis. Perdeu toda a sua ninhada numa câmara de mineração.",nomes:"Masculinos: Vorax, Rhogar, Kharvax, Draegon, Tyrakar | Femininos: Veyra, Syrakha, Nyxara, Zarith, Kaelyra | Linhagens: Escamas Negras, Chama Rubra, Presa de Bronze, Tempestade Azul"},
  "Elfo":{intro:"Os Elfos são seres de beleza singular e longevidade extraordinária, moldados por séculos de observação e refinamento.",cultura:"A cultura élfica é construída sobre tradição, arte e conhecimento. Suas cidades são obras de harmonia entre arquitetura e natureza.",historia:"Os Elfos foram os primeiros a habitar as florestas antigas com respeito ao ritmo do lugar. A manipulação de Veryn Esmeraldanobre explorou tensões acumuladas com os Faunos.",figuras:"Aeva das Raízes Profundas — Uma dos Dez Heróis. Passou décadas rastreando a origem do conflito das florestas.",nomes:"Masculinos: Aelar, Thalion, Eryndor, Faelar, Lorien | Femininos: Aeva, Ildara, Sylwen, Elyndra, Vaelira | Famílias: Das Raízes Profundas, Candela-Viva, Folha Prateada, Canto das Estrelas"},
  "Fauno":{intro:"Os Faunos são seres com traços animais pronunciados — pelos, garras, presas, cauda — herdados de uma linhagem que se misturou com espíritos da natureza há tempos imemoriais.",cultura:"A maioria dos Faunos vive em clãs nômades, seguindo rotas de caça e migração. Hierarquia é determinada por força, sabedoria e respeito.",historia:"Os Faunos chegaram às florestas antigas vindos das estepes, seguindo rotas de migração dos animais. Encontraram os Elfos lá.",figuras:"Tavan Passo-Branco — Um dos Dez Heróis. Ancião que havia perdido quase todo o clã no conflito com os Elfos.",nomes:"Masculinos: Tavan, Kaoru, Fenrir, Aruk, Bran | Femininos: Lyra, Naya, Selene, Aria, Vesha | Famílias: Passo-Branco, Presa Cinzenta, Olhos da Lua, Garra de Carvalho"},
  "Feérico":{intro:"Os Feéricos são humanoides pequenos e ágeis, nascidos da fronteira entre o mundo material e o reino das fadas.",cultura:"A cultura Feérica valoriza a criatividade, a adaptabilidade e o humor — não como entretenimento, mas como filosofia.",historia:"Os Feéricos chegaram às florestas antigas simplesmente aparecendo onde a Mana era mais densa. Veryn Esmeraldanobre era a expressão mais elaborada da nobreza Feérica.",figuras:"Serafael o Arrependido — Um dos Dez Heróis. Da nobreza de Veryn, havia participado das primeiras fases acreditando servir a um projeto legítimo.",nomes:"Masculinos: Serafael, Lyrian, Thistle, Vaelor, Nym | Femininos: Eyra, Sylvara, Nixie, Lirael, Faelyn | Famílias: Esmeraldanobre, Sussurro-nas-Folhas, Dança-da-Lua, Brilho-do-Orvalho"},
  "Humano":{intro:"Os Humanos são o povo mais numeroso, disperso e imprevisível do Reino Mágico. Não são os mais altos, nem os mais fortes, nem os mais antigos — mas são, sem dúvida, os mais adaptáveis.",cultura:"A sociedade humana é marcada pela diversidade. Não existe uma única cultura humana — existem centenas delas.",historia:"Na Era das Sementes, os Humanos chegaram por último — e em todos os lugares ao mesmo tempo. Seus reinos nasceram não de filosofia, mas de necessidade brutal.",figuras:"Mira Filha-de-Ninguém — Uma dos Dez Heróis. | Kael das Planícies Abertas — Guerreiro que chegou à conclusão de que havia menos inimigos no mundo do que lhe disseram.",nomes:"Masculinos: Kael, Aldric, Rafael, Victor, Arthur, Gabriel | Femininos: Mira, Helena, Beatriz, Sofia, Valéria, Camila | Famílias: Filha-de-Ninguém, Das Planícies Abertas, Monteclaro, Valeforte"},
  "Híbrido":{intro:"Os Híbridos são filhos de dois mundos — pessoas nascidas da união entre raças diferentes, portando em si duas heranças.",cultura:"Os Híbridos não têm uma cultura própria centralizada — são a prova de que culturas se encontram.",historia:"Os primeiros Híbridos são anteriores ao Grande Conselho — sempre houve encontros entre raças.",figuras:"Aren Duplo-Sangue — Primeiro representante Híbrido no Grande Conselho.",nomes:"Masculinos: Aren, Kaelen, Thoren, Vaelor, Darius | Femininos: Lyra, Elara, Mira, Sylva, Kaelya | Famílias: Duplo-Sangue, Das Duas Luas, Filho das Encruzilhadas, Ponte de Ferro"},
  "Infernal":{intro:"Os Infernais são os descendentes dos sobreviventes de Ignareth — o continente destruído quando seus próprios estudiosos tentaram canalizar o Negativo.",cultura:"A cultura Infernal pré-desastre era centrada em hierarquia e devoção ao fogo. Pós-desastre, o que sobrou foi a lealdade familiar.",historia:"Os Infernais dominaram Ignareth por séculos. As Guerras Vermelhas foram o ponto em que o orgulho coletivo encontrou a manipulação de Veryn.",figuras:"Duquesa Cariza das Piras Eternas — A maior general de Ignareth. | Lysa das Cinzas Brancas — A estudiosa que descobriu os fragmentos do Negativo.",nomes:"Masculinos: Valdrak, Kaelor, Darius, Malvek, Rhaegor | Femininos: Cariza, Lysa, Valeria, Seraphine, Nyra | Famílias: Chama-Imortal, Das Piras Eternas, Das Cinzas Brancas, Brasa Rubra"},
  "Maculado":{intro:"Os Maculados são seres que existem entre estados — nem completamente vivos pela definição comum, nem mortos pelo que isso significa.",cultura:"Não existe uma sociedade Maculada unificada. Alguns vivem isolados, acumulando conhecimento.",historia:"Os Maculados não existiam como povo antes de Porto Vermelho. Quando os acadêmicos de Ignareth tentaram canalizar o Negativo, a expansão de vazio tocou pessoas sem destruí-las completamente.",figuras:"Rhem das Marcas Brancas — O primeiro Maculado registrado. | Sark o Marcado — Um dos Dez Heróis.",nomes:"Masculinos: Rhem, Sark, Dorian, Kael, Varek | Femininos: Lyra, Serah, Nyssa, Eveline, Aria | Famílias: Das Marcas Brancas, Véu-Partido, Cinza-Pálida, Sem-Crepúsculo, Eco-Vazio"},
}

function RaceDetail({ name, race, rd }) {
  const [activeTab, setActiveTab] = useState('intro')
  const lore = RACE_LORE[name] || {}

  const bonuses = []
  if (race.bMana > 0)      bonuses.push(`+${race.bMana} Mana`)
  if (race.bAttrExtra > 0) bonuses.push(`+${race.bAttrExtra} Atributo`)
  if (race.extraTal > 0)   bonuses.push(`+${race.extraTal} Talento`)
  if (race.extraPer > 0)   bonuses.push(`+${race.extraPer} Perícia`)
  if (race.extraSpell)     bonuses.push(`Magia: ${race.extraSpell}`)

  return (
    <div className={styles.detail}>
      <div className={styles.detailHeader}>
        <div className={styles.detailIcon}>{RACE_ICONS[name] || '◈'}</div>
        <div className={styles.detailInfo}>
          <h2 className={styles.detailName}>{name}</h2>
          <div className={styles.metaChips}>
            {rd && <span className={styles.chip}>{rd.movimento}</span>}
            {bonuses.map(b => <span key={b} className={`${styles.chip} ${styles.gold}`}>{b}</span>)}
          </div>
          {rd && <p className={styles.langs}>{rd.idiomas_nativos}</p>}
        </div>
      </div>

      {lore.intro && (
        <div className={styles.loreTabs}>
          {LORE_TABS.map(t => (
            <button
              key={t.key}
              className={`${styles.loreTab} ${activeTab === t.key ? styles.loreTabActive : ''}`}
              onClick={() => setActiveTab(t.key)}
            >{t.label}</button>
          ))}
        </div>
      )}
      {lore[activeTab] && (
        <div className={styles.lorePanel}>
          <p className={styles.loreText}>{lore[activeTab]}</p>
        </div>
      )}

      {RACE_IMAGES[name] && (
        <div className={styles.raceBanner}>
          <img src={RACE_IMAGES[name]} alt={name} className={styles.raceBannerImg} />
        </div>
      )}

      {rd && (
        <div className={styles.dataGrid}>
          {[
            ['Altura', rd.altura],
            ['Peso Médio', rd.peso_medio],
            ['Expectativa de Vida', rd.expectativa_vida],
            ['Deslocamento', rd.movimento],
          ].map(([l, v]) => (
            <div key={l} className={styles.dataItem}>
              <div className={styles.dataLabel}>{l}</div>
              <div className={styles.dataValue}>{v}</div>
            </div>
          ))}
        </div>
      )}

      <h3 className={styles.traitsTitle}>◈ Traços Raciais</h3>
      <div className={styles.traitsGrid}>
        {(race.traits || []).map(t => (
          <div key={t.n} className={styles.traitCard}>
            <div className={styles.traitName}>
              {t.n}
              {t.bonus && <span className={styles.traitBonus}>{t.bonus}</span>}
            </div>
            <p className={styles.traitDesc}>{t.d}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Racas() {
  const { data, loading, error } = useGameData()
  const [selected, setSelected]  = useState(null)

  if (loading) return <div className={styles.loading}>Carregando raças...</div>
  if (error)   return <div className={styles.loading}>⚠ Servidor offline — inicie o backend.</div>

  const races = data.races || {}
  const rd    = data.racial_data || {}
  const names = Object.keys(races).sort()

  const active = selected || names[0]

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <p className={styles.eyebrow}>Os Povos</p>
        <h1 className={styles.pageTitle}>Raças</h1>
        <div className={styles.divider} />
        <p className={styles.lead}>O mundo do Reino Mágico é habitado por diversas raças, cada uma com sua herança, cultura e traços únicos.</p>
      </div>

      <div className={styles.grid}>
        {names.map(name => (
          <button
            key={name}
            className={`${styles.thumb} ${active === name ? styles.thumbActive : ''}`}
            onClick={() => setSelected(name)}
          >
            {RACE_IMAGES[name]
              ? <img className={styles.thumbImg} src={RACE_IMAGES[name]} alt={name} />
              : <span className={styles.thumbIcon}>{RACE_ICONS[name] || '◈'}</span>
            }
            <span className={styles.thumbName}>{name}</span>
            <span className={styles.thumbMove}>{rd[name]?.movimento || `${races[name].move || 9}m`}</span>
          </button>
        ))}
      </div>

      {active && (
        <RaceDetail
          name={active}
          race={races[active]}
          rd={rd[active]}
        />
      )}
    </div>
  )
}
