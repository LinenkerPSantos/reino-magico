import { useState } from 'react'
import { useGameData } from '../../hooks/useGameData'
import styles from './Mecanicas.module.css'

const CHAPTERS = [
  { id: 'cap1', label: 'Conceitos Fundamentais' },
  { id: 'cap2', label: 'Estatísticas' },
  { id: 'cap3', label: 'Ações e Combate' },
  { id: 'cap4', label: 'Terrenos e Deslocamento' },
]

const DESLOCAMENTO_SITUACOES = [
  { s: 'Movimento normal (terreno padrão)', d: '9 metros', o: 'Valor base de todas as raças e classes.' },
  { s: 'Terreno Arenoso', d: '6 metros', o: 'Reduzido em 3 metros.' },
  { s: 'Terreno Difícil', d: '4,5 metros', o: 'Reduzido à metade (arredondado para cima).' },
  { s: 'Condição Enfraquecido', d: '4,5 metros', o: 'Deslocamento reduzido à metade.' },
  { s: 'Condição Lentidão', d: '4,5 metros', o: 'Deslocamento reduzido à metade.' },
  { s: 'Condição Congelando / Paralisado', d: '0 metros', o: 'Impossibilitado de se mover.' },
  { s: 'Condição Aprisionado', d: '0 metros', o: 'Impossibilitado de se mover.' },
  { s: 'Talento ou habilidade de velocidade', d: '+3 metros', o: 'Acréscimo conforme descrito na habilidade.' },
]

const TIPOS_TERRENO = [
  { t: 'Normal', e: 'Deslocamento completo sem penalidade.' },
  { t: 'Arenoso', e: 'Deslocamento reduzido em −3 metros.' },
  { t: 'Difícil', e: 'Deslocamento pela metade (arredondado para cima).' },
]

const ATTR_COLORS = { FOR:'#e07028', DES:'#4a9a5a', VIT:'#c44', INT:'#7a7aca', PRE:'#c9a227' }

const CONDITIONS = [
  {n:'Abalado',      d:'A criatura sofre perturbação mental, insegurança ou perda momentânea de concentração.',                e:'Sofre –2 em testes de ataque, perícia ou habilidade baseados em Presença.',                                                                                                                              s:'—'},
  {n:'Adormecido',   d:'O personagem cai em um sono profundo, até o final do efeito ou até que receba algum dano.',           e:'Perde o turno, incapaz de agir. Ataques contra a criatura adormecida são considerados como vulneráveis.',                                                                                       s:'—'},
  {n:'Alucinado',    d:'O personagem perde a noção da realidade, enxergando e reagindo a estímulos inexistentes.',             e:'Perde o turno, incapaz de agir.',                                                                                                                                                            s:'Salv. Foco — ao sucesso, encerra a condição.'},
  {n:'Amedrontado',  d:'O personagem é dominado pelo medo diante de uma ameaça específica.',                                  e:'Sofre desvantagem contra o conjurador e recebe -2 na Defesa Básica.',                                                                                                                           s:'Salv. Tenacidade — ao sucesso, supera o medo.'},
  {n:'Aprisionado',  d:'O personagem tem seus movimentos restringidos por força física ou mágica.',                            e:'Não pode se mover, mas ainda pode atacar ou conjurar se o alvo estiver ao alcance.',                                                                                                            s:'Salv. Atletismo — ao sucesso, se liberta.'},
  {n:'Atordoado',    d:'O personagem sofre um impacto que compromete totalmente sua capacidade de reação.',                    e:'Não pode agir e perde o turno.',                                                                                                                                                               s:'Salv. Tenacidade — ao sucesso, recupera o controle.'},
  {n:'Cego',         d:'O personagem perde completamente a visão do ambiente ao redor.',                                       e:'Sofre penalidade de -20 em ataques físicos, à distância, mágicos e ações manuais.',                                                                                                            s:'—'},
  {n:'Confuso',      d:'A mente do personagem entra em desordem, dificultando decisões coerentes.',                            e:'No início do turno, rola 1d4: 1 = age normalmente; 2–3 = ataca um aliado; 4 = perde o turno e encerra a condição.',                                                                          s:'—'},
  {n:'Congelando',   d:'O corpo do personagem é tomado por frio extremo, limitando suas ações.',                               e:'Condição não acumulativa (propriedade Água). Novos ataques de Água contra alvo congelado causam metade do dano. O alvo não pode agir, mover-se ou reagir, sofrendo 1d8 de dano contínuo por rodada. Chegar a 0 vida nesta condição causa morte imediata — o corpo transforma-se em estátua de gelo.', s:'Salv. Atletismo — ao sucesso, rompe o efeito.'},
  {n:'Desprevenido', d:'O personagem é pego sem preparo ou atenção.',                                                          e:'Sofre -2 na Defesa Básica.',                                                                                                                                                                   s:'—'},
  {n:'Desorientado', d:'O alvo perde o controle sobre sua percepção e concentração.',                                          e:'Cancela imediatamente magias ativas, efeitos sustentados e habilidades de manutenção. Ao atacar ou selecionar alvo, 50% de chance de confundir aliados com inimigos.',                        s:'—'},
  {n:'Em Chamas',    d:'O personagem está envolto em chamas, sofrendo dano contínuo.',                                         e:'Propriedade Fogo. 1d8 de dano contínuo por rodada. Acumulativo: cada novo ataque de Chamas adiciona +1d8 e reinicia a duração. Pode ser extinto por magias de cura ou efeitos com propriedade Água.', s:'Salv. Reflexo — ao se jogar no chão, encerra a condição, mas fica Vulnerável até o próximo turno.'},
  {n:'Enfraquecido', d:'A força do personagem é drenada, reduzindo sua eficácia.',                                             e:'Causa metade do dano e tem o deslocamento reduzido pela metade.',                                                                                                                                 s:'—'},
  {n:'Enfurecido',   d:'O personagem perde o controle emocional e entra em estado de agressividade extrema.',                  e:'Recebe vantagem em ataques corpo a corpo, mas não pode realizar ataques à distância ou conjurar magias.',                                                                                      s:'—'},
  {n:'Envenenado',   d:'O corpo do personagem sofre com toxinas que causam dano gradual.',                                     e:'1d6 de dano contínuo com propriedade Terra por rodada. Condição não acumulativa, exceto quando efeitos, talentos ou magias especificarem explicitamente.',                                   s:'Salv. Tenacidade — ao sucesso, encerra o efeito.'},
  {n:'Fadigado',     d:'O personagem está exausto física e mentalmente.',                                                      e:'Sofre desvantagem em testes e ataques em geral.',                                                                                                                                               s:'Salv. Vontade — ao sucesso, recupera o foco.'},
  {n:'Lentidão',     d:'Os movimentos do personagem se tornam pesados e atrasados.',                                           e:'Movimento reduzido pela metade.',                                                                                                                                                              s:'Salv. Tenacidade — ao sucesso, recupera a mobilidade.'},
  {n:'Morrendo',     d:'O personagem encontra-se à beira da morte, com o corpo falhando e a consciência oscilando.',           e:'Por turno: salv. bem-sucedida = retorna com 1 de Vida; falha = acumula 1 falha (3 falhas = morte). Permanece Vulnerável durante toda a condição.',                                        s:'Salv. Tenacidade ou Vontade.'},
  {n:'Paralisado',   d:'O corpo do personagem está completamente imobilizado.',                                                 e:'Não pode se mover ou atacar, mas ainda pode conjurar magias.',                                                                                                                                 s:'Salv. Tenacidade — ao sucesso, encerra a condição.'},
  {n:'Provocado',    d:'O personagem é forçado a agir de forma impulsiva contra um alvo específico.',                          e:'Deve atacar o conjurador em sua próxima ação.',                                                                                                                                              s:'Salv. Vontade — ao sucesso, resiste à provocação.'},
  {n:'Sangrando',    d:'Ferimentos abertos causam perda contínua de vida.',                                                    e:'1d8 de dano contínuo por rodada (não acumulativo). Agravamento por reaplicação — efeitos secundários em ordem: Enfraquecido → Silenciado → Vulnerável.',                               s:'Salv. Tenacidade — ao sucesso, estanca o sangramento.'},
  {n:'Silenciado',   d:'O personagem tem sua capacidade de conjurar magia bloqueada.',                                         e:'Não pode conjurar magias.',                                                                                                                                                                    s:'—'},
  {n:'Vulnerável',   d:'O personagem se encontra em estado crítico, exposto a danos extremos.',                                e:'Redução de -5 na Defesa Básica e não pode utilizar Reações. Se estiver Morrendo, qualquer dano recebido causa morte imediata.',                                                             s:'—'},
]

const SKILLS = [
  {n:'Atletismo',a:'FOR'},{n:'Luta',a:'FOR'},{n:'Iniciativa',a:'DES'},{n:'Pontaria',a:'DES'},
  {n:'Prestidigitação',a:'DES'},{n:'Reflexo',a:'DES'},{n:'Furtividade',a:'DES'},
  {n:'Sobrevivência',a:'VIT'},{n:'Tenacidade',a:'VIT'},
  {n:'Foco',a:'INT'},{n:'História',a:'INT'},{n:'Investigação',a:'INT'},{n:'Persuasão',a:'INT'},{n:'Vontade',a:'INT'},
  {n:'Carisma',a:'PRE'},{n:'Enganação',a:'PRE'},{n:'Intimidação',a:'PRE'},{n:'Percepção',a:'PRE'},
]
const SKILL_DESCS = {
  Atletismo:'Esforço físico intenso — escalada, saltos, perseguição',Luta:'Domínio do combate corpo a corpo',
  Iniciativa:'Rapidez de reação, especialmente em combate',Pontaria:'Precisão em ataques à distância',
  Prestidigitação:'Manipulação delicada — arrombamento, furto, artesanato',Reflexo:'Reação rápida a ameaças, evitar danos',
  Furtividade:'Movimentação sem ser notado',Sobrevivência:'Adaptação a ambientes hostis e natureza',
  Tenacidade:'Resistência a condições físicas negativas',Foco:'Controle arcano, canalização de magia',
  História:'Conhecimento de eventos, culturas, tradições',Investigação:'Análise de pistas e situações complexas',
  Persuasão:'Convencer através de argumentos e lógica',Vontade:'Resistência mental e controle emocional',
  Carisma:'Criar conexões, inspirar confiança por empatia',Enganação:'Distorcer a verdade, manipular percepções',
  Intimidação:'Impor medo ou pressão emocional',Percepção:'Captar detalhes e intenções por instinto',
}

function Cap1() {
  return (
    <div>
      <div className={styles.chHero}>
          <p className={styles.eyebrow}>Regras e Mecânicas em Geral</p>
        <h2 className={styles.chTitle}>Conceitos Fundamentais</h2>
        <div className={styles.chDivider} />
        <p className={styles.chLead}>Antes de rolar qualquer dado, é preciso compreender a linguagem do Reino Mágico.</p>
      </div>

      <div className={styles.sec}>
        <h3 className={styles.secTitle}>Dados Utilizados</h3>
        <p className={styles.secText}>No Reino Mágico o destino é moldado por dados do <strong>D4 ao D20</strong>. O <strong>D20</strong> é o coração do sistema — determina o sucesso ou fracasso das ações mais importantes.</p>
        <div className={styles.diceGrid}>
          {['D4','D6','D8','D10','D12'].map(d => (
            <div key={d} className={styles.diceCard}><div className={styles.diceName}>{d}</div></div>
          ))}
          <div className={`${styles.diceCard} ${styles.diceD20}`}><div className={styles.diceName}>D20</div><div className={styles.diceDesc}>Dado principal</div></div>
        </div>
      </div>

      <div className={styles.sec}>
        <h3 className={styles.secTitle}>Atributos</h3>
        <p className={styles.secText}>Cinco atributos base definem as capacidades naturais. Distribuição inicial: <strong>7 pontos</strong>, todos iniciam em 0, máximo 5 por atributo. Os atributos determinam quantos d20 são rolados — o maior resultado é sempre utilizado.</p>
        <div className={styles.attrList}>
          {[
            {n:'Força',a:'FOR',d:'Poder físico bruto. Determina o dano de ataques corpo a corpo.'},
            {n:'Destreza',a:'DES',d:'Controle preciso do corpo e agilidade. Contribui diretamente para a Defesa Básica.'},
            {n:'Vitalidade',a:'VIT',d:'Resistência física. Influencia a Vida máxima e a capacidade de suportar condições adversas.'},
            {n:'Intelecto',a:'INT',d:'Domínio arcano. Define quantas magias o personagem conhece e a CD de Conjuração.'},
            {n:'Presença',a:'PRE',d:'Força da personalidade. Rege habilidades sociais e determina a reserva de Mana (PRE × 2).'},
          ].map(a => (
            <div key={a.a} className={styles.attrRow}>
              <div className={styles.attrName} style={{color: ATTR_COLORS[a.a]}}>{a.n} <span className={styles.attrBadge}>{a.a}</span></div>
              <p className={styles.attrDesc}>{a.d}</p>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.sec}>
        <h3 className={styles.secTitle}>Perícias</h3>
        <p className={styles.secText}>As perícias somam um bônus fixo ao resultado dos dados. O jogador pode escolher <strong>2 perícias adicionais</strong> no nível Básico.</p>
        <div className={styles.levelCards}>
          <div className={styles.levelCard}><strong>Básico</strong><span className={styles.levelBonus}>+2</span><span>Familiaridade.</span></div>
          <div className={styles.levelCard}><strong>Intermediário</strong><span className={styles.levelBonus}>+5</span><span>Prática consistente.</span></div>
          <div className={styles.levelCard}><strong>Avançado</strong><span className={styles.levelBonus}>+10</span><span>Maestria.</span></div>
        </div>
        <table className={styles.skillTable}>
          <thead><tr><th>Perícia</th><th>Atributo</th><th>Descrição</th></tr></thead>
          <tbody>
            {SKILLS.map(s => (
              <tr key={s.n}>
                <td>{s.n}</td>
                <td><span className={styles.skillAttr} style={{borderColor: ATTR_COLORS[s.a], color: ATTR_COLORS[s.a]}}>{s.a}</span></td>
                <td>{SKILL_DESCS[s.n]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.sec}>
        <h3 className={styles.secTitle}>Sistema Monetário</h3>
        <div className={styles.moneyGrid}>
          {[
            {c:'MB',n:'Moeda de Bronze',d:'Compras cotidianas, alimentação',color:'#cd7f32'},
            {c:'MP',n:'Moeda de Prata',d:'Equipamentos, contratos',color:'#aaa'},
            {c:'MO',n:'Moeda de Ouro',d:'Grandes negociações, itens raros',color:'#c9a227'},
            {c:'ML',n:'Moeda de Platina',d:'Acordos políticos, artefatos',color:'#b0c0d0'},
            {c:'MG',n:'Platina com Gema',d:'Tesouros reais, tributos',color:'#9b59b6'},
          ].map(m => (
            <div key={m.c} className={styles.moneyCard}>
              <div className={styles.moneyCode} style={{color:m.color}}>{m.c}</div>
              <div className={styles.moneyName}>{m.n}</div>
              <div className={styles.moneyDesc}>{m.d}</div>
            </div>
          ))}
        </div>
        <div className={styles.moneyRate}>100 MB = 1 MP · 100 MP = 1 MO · 1.000 MO = 1 ML · 1.000 ML = 1 MG</div>
      </div>
    </div>
  )
}

function Cap2() {
  return (
    <div>
      <div className={styles.chHero}>
        <h2 className={styles.chTitle}>Estatísticas do Personagem</h2>
        <div className={styles.chDivider} />
        <p className={styles.chLead}>As estatísticas definem a capacidade de sobrevivência e efetividade do personagem em campo.</p>
      </div>

      <div className={styles.sec}>
        <h3 className={styles.secTitle}>Estatísticas Base</h3>
        <div className={styles.statCards}>
          {[
            {n:'❤ Vida',f:'10 + Vitalidade + Bônus de Classe',d:'Resistência total antes de ser derrotado.'},
            {n:'💧 Pontos de Mana',f:'Presença × 2 + Bônus de Classe',d:'Energia para conjurar magias. Nunca pode ser negativo.'},
            {n:'🛡 Defesa Básica',f:'10 + Destreza + Equipamento',d:'Capacidade de evitar ou absorver ataques.'},
            {n:'🎯 CD de Conjuração',f:'8 + Atributo Base + Foco',d:'Dificuldade para resistir às magias do conjurador.'},
            {n:'⚡ Limite de Mana/Turno',f:'Proficiência + 2',d:'Máximo de mana que pode ser gasto em um único turno.'},
            {n:'⚔ Salvaguarda',f:'D20 (Atrib.) + Prof. + Perícia',d:'Capacidade de resistir a efeitos adversos.'},
          ].map(s => (
            <div key={s.n} className={styles.statCard}>
              <div className={styles.statName}>{s.n}</div>
              <div className={styles.statFormula}>{s.f}</div>
              <p className={styles.statDesc}>{s.d}</p>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.sec}>
        <h3 className={styles.secTitle}>Vantagem e Desvantagem</h3>
        <div className={styles.critGrid}>
          <div className={`${styles.critCard} ${styles.critHit}`}>
            <div className={styles.critTitle}>✦ Vantagem</div>
            <div className={styles.critTrigger}>Rola +1d20 adicional — usa o <strong>maior</strong> resultado</div>
            <p className={styles.critText}>Representa posição favorável, preparo ou superioridade tática.</p>
          </div>
          <div className={`${styles.critCard} ${styles.critFail}`}>
            <div className={styles.critTitle}>✦ Desvantagem</div>
            <div className={styles.critTrigger}>Rola +1d20 adicional — usa o <strong>menor</strong> resultado</div>
            <p className={styles.critText}>Representa pressão, condições negativas ou falta de preparo.</p>
          </div>
        </div>
      </div>

      <div className={styles.sec}>
        <h3 className={styles.secTitle}>Descansos</h3>
        <div className={styles.restGrid}>
          <div className={styles.restCard}>
            <div className={styles.restTitle}>⏱ Descanso Curto</div>
            <div className={styles.restRecovery}><div>💧 Mana: 1d4 + Presença</div><div>❤ Vida: 1d6 + Vitalidade</div></div>
            <p className={styles.restDesc}>Pausa rápida para recuperar o fôlego e reorganizar energias.</p>
          </div>
          <div className={styles.restCard}>
            <div className={styles.restTitle}>🌙 Descanso Longo</div>
            <div className={styles.restRecovery}><div>💧 Mana: 2d4 + Presença</div><div>❤ Vida: 2d6 + Vitalidade</div></div>
            <p className={styles.restDesc}>Período prolongado de recuperação. Exige ambiente relativamente seguro.</p>
          </div>
        </div>
      </div>

      <div className={styles.sec}>
        <h3 className={styles.secTitle}>Condições de Status</h3>
        <p className={styles.secText}>
          Condições são efeitos negativos aplicados sobre um personagem ou criatura durante o jogo.
          Cada condição descreve seu impacto mecânico e, quando aplicável, a salvaguarda necessária para resistir ou encerrar o efeito.
        </p>
        <div className={styles.condGrid}>
          {CONDITIONS.map(c => (
            <div key={c.n} className={styles.condCard}>
              <div className={styles.condName}>{c.n}</div>
              <p className={styles.condDesc}>{c.d}</p>
              <p className={styles.condEffect}>{c.e}</p>
              {c.s !== '—' && <p className={styles.condSave}>{c.s}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Cap3() {
  return (
    <div>
      <div className={styles.chHero}>
        <h2 className={styles.chTitle}>Ações e Combate</h2>
        <div className={styles.chDivider} />
        <p className={styles.chLead}>O combate no Reino Mágico é estratégico e dinâmico. Cada decisão importa.</p>
      </div>

      <div className={styles.sec}>
        <h3 className={styles.secTitle}>Tipos de Ação</h3>
        <div className={styles.actionList}>
          {[
            {l:'Padrão',t:'Básica',c:'green',d:'Ação principal do turno. Usada para atacar, conjurar magias ou executar habilidades centrais.'},
            {l:'Movimento',t:'Básica',c:'green',d:'Permite deslocamento e reposicionamento no campo de batalha. O personagem pode dividir seu movimento antes e depois de uma ação Padrão.'},
            {l:'Reação',t:'Situacional',c:'blue',d:'Acionada dentro ou fora do turno, em resposta a eventos específicos. Limitada a uma vez por rodada.'},
            {l:'Livre',t:'Livre',c:'gold',d:'Interações simples como falar ou realizar ações rápidas. Uso limitado pelo bom senso do mestre.'},
          ].map(a => (
            <div key={a.l} className={styles.actionItem}>
              <div>
                <div className={styles.actionLabel}>{a.l}</div>
                <span className={`${styles.actionBadge} ${styles['badge_'+a.c]}`}>{a.t}</span>
              </div>
              <p className={styles.actionDesc}>{a.d}</p>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.sec}>
        <h3 className={styles.secTitle}>Tipos de Ataque</h3>
        <div className={styles.attackCards}>
          {[
            {n:'⚔ Corpo a Corpo',f:'Luta (FOR) vs Defesa Básica',d:'Confrontos diretos com armas simples ou marciais. Exige estar próximo ao alvo. O bônus de Força é somado ao dano. Armas de duas mãos dobram esse bônus.'},
            {n:'🏹 À Distância',f:'Pontaria (DES) vs Defesa Básica',d:'Arcos, bestas e armas de arremesso permitem atingir inimigos sem contato direto. Oferecem posicionamento estratégico.'},
            {n:'✨ Mágico',f:'Foco (INT) vs Defesa Básica',d:'Canaliza energia sobrenatural para causar dano ou afetar criaturas. Tratado como ataque de longa distância.'},
          ].map(a => (
            <div key={a.n} className={styles.attackCard}>
              <div className={styles.attackName}>{a.n}</div>
              <div className={styles.attackFormula}>{a.f}</div>
              <p className={styles.attackDesc}>{a.d}</p>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.sec}>
        <h3 className={styles.secTitle}>Acertos Críticos e Falhas Críticas</h3>
        <div className={styles.critGrid}>
          <div className={`${styles.critCard} ${styles.critHit}`}>
            <div className={styles.critTitle}>✦ Acerto Crítico</div>
            <div className={styles.critTrigger}>Qualquer dado obtiver um <strong>20 natural</strong></div>
            <p className={styles.critText}>O dano final é <strong>duplicado</strong> — rola os dados normalmente e dobra o total.</p>
          </div>
          <div className={`${styles.critCard} ${styles.critFail}`}>
            <div className={styles.critTitle}>✦ Falha Crítica</div>
            <div className={styles.critTrigger}>Resultado utilizado for um <strong>1 natural</strong></div>
            <p className={styles.critText}>Representa um erro grave ou consequência perigosa definida pelo mestre.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function Cap4() {
  return (
    <div>
      <div className={styles.chHero}>
        <h2 className={styles.chTitle}>Terrenos e Deslocamento</h2>
        <div className={styles.chDivider} />
        <p className={styles.chLead}>O campo de batalha é tão importante quanto as armas empunhadas.</p>
      </div>

      <div className={styles.sec}>
        <h3 className={styles.secTitle}>Deslocamento Base</h3>
        <p className={styles.secText}>O deslocamento representa a distância máxima que um personagem pode percorrer em uma única ação de Movimento durante seu turno. O deslocamento padrão no Reino Mágico é de <strong>9 metros por turno</strong> para todas as raças, salvo indicação especial de classe, raça ou talento.</p>
        <table className={styles.skillTable}>
          <thead><tr><th>Situação</th><th>Deslocamento</th><th>Observações</th></tr></thead>
          <tbody>
            {DESLOCAMENTO_SITUACOES.map(row => (
              <tr key={row.s}>
                <td>{row.s}</td>
                <td>{row.d}</td>
                <td>{row.o}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.sec}>
        <h3 className={styles.secTitle}>Regras Adicionais</h3>
        <p className={styles.secText}><strong>Escalada e Natação:</strong> ao se mover em superfícies verticais ou dentro d'água sem habilidades específicas, o deslocamento é reduzido à metade e pode exigir testes de Atletismo a critério do Mestre.</p>
        <p className={styles.secText}><strong>Deslocamento e Ataques:</strong> um personagem pode dividir seu movimento antes e depois de uma ação Padrão no mesmo turno.</p>
        <p className={styles.secText}>O Mestre pode criar variações de deslocamento para condições ambientais específicas, como lama (−3 m), ventos fortes (−3 m) ou superfícies escorregadias (teste de Reflexo para não cair).</p>
      </div>

      <div className={styles.sec}>
        <h3 className={styles.secTitle}>Tipos de Terreno</h3>
        <table className={styles.skillTable}>
          <thead><tr><th>Terreno</th><th>Efeito no Deslocamento</th></tr></thead>
          <tbody>
            {TIPOS_TERRENO.map(row => (
              <tr key={row.t}>
                <td>{row.t}</td>
                <td>{row.e}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className={styles.secText} style={{marginTop: '14px'}}>O Mestre pode criar variações de terreno adicionais de acordo com o cenário da aventura — lama, gelo, água rasa, vegetação densa — adaptando os modificadores conforme a situação narrativa.</p>
      </div>
    </div>
  )
}

const CHAPTER_COMPONENTS = { cap1: Cap1, cap2: Cap2, cap3: Cap3, cap4: Cap4 }

export default function Mecanicas() {
  const [activeChapter, setActiveChapter] = useState('cap1')
  const ChapterContent = CHAPTER_COMPONENTS[activeChapter]

  return (
    <div>
      <nav className={styles.tabs}>
        {CHAPTERS.map(c => (
          <button
            key={c.id}
            className={`${styles.tabBtn} ${activeChapter === c.id ? styles.tabActive : ''}`}
            onClick={() => setActiveChapter(c.id)}
          >{c.label}</button>
        ))}
      </nav>
      <div className={styles.wrap}>
        <ChapterContent />
      </div>
    </div>
  )
}
