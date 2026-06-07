import styles from './Aprimoramento.module.css'

const STATS_TABLE = [
  { nome: 'Vida Extra',             efeito: 'Aumenta a Vida Máxima em 10 pontos. Pode ser adquirido múltiplas vezes.',                                                         custo: 200 },
  { nome: 'Nova Perícia Básica',    efeito: 'Concede uma nova perícia no nível Básico.',                                                                                        custo: 300 },
  { nome: 'Aumento de Atributo',    efeito: 'Concede +1 ponto em um atributo à escolha do jogador.',                                                                            custo: 400 },
  { nome: 'Ponto de Proficiência',  efeito: 'Aumenta em +1 o limite máximo de Proficiência (até 9 pontos).',                                                                    custo: 500 },
  { nome: 'Talento',                efeito: 'Permite adquirir um novo Talento, respeitando seus pré-requisitos.',                                                                custo: 600 },
  { nome: 'Casca Grossa',          efeito: 'Aumenta a Defesa Básica em +1. Pode ser adquirido no máximo 5 vezes, totalizando +5 de Defesa Básica.',                             custo: 700 },
]

const PERICIAS_TABLE = [
  { nome: 'Perito Intermediário', efeito: 'Escolha até 4 perícias Básicas para evoluí-las para o nível Intermediário.',     custo: 500 },
  { nome: 'Perito Avançado',      efeito: 'Escolha até 4 perícias Intermediárias para evoluí-las para o nível Avançado.',   custo: 800 },
]

const MAGIC_TABLE = [
  { nome: 'Proficiência Elite',    efeito: 'Eleva o conhecimento mágico para o nível Elite. Além disso, o personagem escolhe 3 magias que já conhece e as aprimora para suas versões Elite.',     custo: 400 },
  { nome: 'Proficiência Maior',    efeito: 'Eleva o conhecimento mágico para o nível Maior. Além disso, o personagem escolhe 3 magias que já conhece e as aprimora para suas versões Maiores.',   custo: 600 },
  { nome: 'Proficiência Avançada', efeito: 'Eleva o conhecimento mágico para o nível Avançado. Além disso, o personagem escolhe 3 magias que já conhece e as aprimora para suas versões Avançadas.', custo: 800 },
  { nome: 'Novas Magias', efeito: 'Concede acesso a 2 novas magias do nível de conhecimento mágico que possui ou menor (escolhidas manualmente na aba Magias). Pode ser adquirido no máximo 3 vezes, totalizando até 6 magias extras.', custo: 500 },
]

const ATTR_BENEFITS = [
  {
    attr: 'Força', color: '#e07028',
    desc: 'Representa poder físico e capacidade de combate corpo a corpo.',
    benefits: ['Aumenta o dano de ataques corpo a corpo.'],
  },
  {
    attr: 'Vitalidade', color: '#c44',
    desc: 'Representa resistência física, saúde e capacidade de suportar ferimentos.',
    benefits: ['Aumenta a Vida Máxima.'],
  },
  {
    attr: 'Destreza', color: '#4a9a5a',
    desc: 'Representa velocidade, coordenação e precisão.',
    benefits: ['Aumenta a Defesa Básica.', 'Aumenta o dano de ataques à distância.'],
  },
  {
    attr: 'Intelecto', color: '#7a7aca',
    desc: 'Representa conhecimento, estudo e capacidade de manipular magia.',
    benefits: ['Aumenta o número de magias conhecidas.', 'Aumenta o dano causado por magias.'],
  },
  {
    attr: 'Presença', color: '#c9a227',
    desc: 'Representa força espiritual, determinação e domínio das energias mágicas.',
    benefits: ['Aumenta a quantidade máxima de Mana.'],
  },
]

function UpgradeTable({ rows, caption }) {
  return (
    <div className={styles.tableWrap}>
      {caption && <div className={styles.tableCaption}>{caption}</div>}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Aprimoramento</th>
            <th>Efeito</th>
            <th className={styles.costCol}>Custo</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.nome}>
              <td className={styles.upgName}>{r.nome}</td>
              <td>{r.efeito}</td>
              <td className={styles.costCell}>
                <span className={styles.costBadge}>{r.custo} pts</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function Aprimoramento() {
  return (
    <div className={styles.page}>
      {/* Hero */}
      <div className={styles.hero}>
        <p className={styles.eyebrow}>Sistema de Evolução</p>
        <h1 className={styles.pageTitle}>Aprimoramento</h1>
        <div className={styles.divider} />
        <p className={styles.lead}>
          No Reino Mágico não existem níveis. Os personagens crescem acumulando
          <strong> Pontos de Aprimoramento</strong> ao longo das aventuras.
        </p>
      </div>

      {/* Introdução */}
      <div className={styles.sec}>
        <p className={styles.secText}>
          Os pontos de aprimoramento representam experiência prática, treinamento, estudo e evolução
          pessoal adquiridos durante a campanha. À medida que os jogadores os acumulam, podem
          utilizá-los para desenvolver seu personagem de diferentes formas.
        </p>
        <p className={styles.secText}>
          Cada personagem pode acumular até <strong>5.000 Pontos de Aprimoramento</strong> ao longo
          de sua jornada. Os pontos podem ser gastos a qualquer momento para adquirir os
          aprimoramentos descritos abaixo.
        </p>
      </div>

      {/* Estatísticas Básicas */}
      <div className={styles.sec}>
        <h2 className={styles.secTitle}>Aprimoramentos de Estatísticas Básicas</h2>
        <UpgradeTable rows={STATS_TABLE} />
      </div>

      {/* Perícias */}
      <div className={styles.sec}>
        <h2 className={styles.secTitle}>Aprimoramentos de Perícias</h2>
        <UpgradeTable rows={PERICIAS_TABLE} />
      </div>

      {/* Proficiência Mágica */}
      <div className={styles.sec}>
        <h2 className={styles.secTitle}>Aprimoramentos de Proficiência Mágica</h2>
        <p className={styles.secText}>
          Esses aprimoramentos representam um aprofundamento no conhecimento arcano, permitindo ao
          conjurador manipular versões mais poderosas de suas magias. Apenas magias compatíveis com
          o nível de proficiência adquirido podem ser aprimoradas. O personagem deve cumprir todos
          os pré-requisitos exigidos para acessar cada novo grau de conhecimento mágico.
        </p>
        <UpgradeTable rows={MAGIC_TABLE} />
      </div>

      {/* Progressão Superior */}
      <div className={styles.sec}>
        <h2 className={styles.secTitle}>Progressão Superior das Magias</h2>
        <p className={styles.secText}>
          Nem todos os níveis de magia podem ser alcançados apenas por estudo, treinamento ou
          aprimoramento pessoal. As formas mais elevadas da magia exigem feitos extraordinários e
          circunstâncias únicas dentro da campanha.
        </p>

        <div className={styles.rulesGrid}>
          <div className={styles.ruleCard}>
            <div className={styles.ruleTitle}>Ascensão do Milagre</div>
            <p className={styles.ruleText}>
              Para despertar uma Magia Sagrada Divina, o conjurador deve possuir a magia desejada
              no nível Avançado e tê-la utilizado pelo menos três vezes durante a campanha em sua
              versão Avançada.
            </p>
            <p className={styles.ruleText}>
              Esse processo simboliza o fortalecimento gradual da ligação entre o conjurador e a
              entidade divina associada ao milagre. Quando a ascensão ocorre, a magia passa a
              representar uma manifestação direta da vontade divina, concedendo acesso ao nível
              Divino.
            </p>
          </div>

          <div className={styles.ruleCard}>
            <div className={styles.ruleTitle}>Magias Lendárias e Secretas</div>
            <p className={styles.ruleText}>
              As magias dos níveis <strong>Lendário</strong> e <strong>Secreto</strong> não podem
              ser aprendidas através de treinamento convencional.
            </p>
            <p className={styles.ruleText}>
              Para alcançá-las, o personagem deve encontrar artefatos, relíquias, grimórios
              ancestrais ou equipamentos especiais durante a campanha. Esses objetos funcionam como
              catalisadores sobrenaturais capazes de suportar energias muito além dos limites
              naturais de um conjurador comum.
            </p>
            <p className={styles.ruleText} style={{ color: 'var(--red)', fontStyle: 'italic' }}>
              Sem esses recursos, tentar manipular poderes dessa magnitude pode resultar em
              consequências catastróficas.
            </p>
          </div>
        </div>
      </div>

      {/* Benefícios da Proficiência */}
      <div className={styles.sec}>
        <h2 className={styles.secTitle}>Benefícios da Proficiência</h2>
        <p className={styles.secText}>
          Aumentar a Proficiência não apenas libera acesso a magias mais poderosas, mas também
          fortalece a capacidade do personagem de controlá-las. Cada aumento de Proficiência
          eleva indiretamente:
        </p>
        <div className={styles.benefitList}>
          <div className={styles.benefitItem}>A Salvaguarda das Magias.</div>
          <div className={styles.benefitItem}>O Limite Máximo de Mana por Turno.</div>
          <div className={styles.benefitItem}>O acesso a níveis superiores de conhecimento mágico.</div>
        </div>
      </div>

      {/* Benefícios dos Atributos */}
      <div className={styles.sec}>
        <h2 className={styles.secTitle}>Benefícios dos Atributos</h2>
        <p className={styles.secText}>
          Sempre que um atributo é aumentado, o personagem também recebe benefícios adicionais
          relacionados à sua área de especialização. Os benefícios são cumulativos — quanto maior
          o atributo, maiores serão os bônus derivados.
        </p>
        <div className={styles.attrGrid}>
          {ATTR_BENEFITS.map(a => (
            <div key={a.attr} className={styles.attrCard} style={{ borderTopColor: a.color }}>
              <div className={styles.attrName} style={{ color: a.color }}>{a.attr}</div>
              <p className={styles.attrDesc}>{a.desc}</p>
              <ul className={styles.attrBenefits}>
                {a.benefits.map(b => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
