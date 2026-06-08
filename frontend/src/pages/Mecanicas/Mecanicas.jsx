import { useState } from 'react'
import { useGameData } from '../../hooks/useGameData'
import styles from './Mecanicas.module.css'

const CHAPTERS = [
  { id: 'cap1', label: 'Conceitos Fundamentais' },
  { id: 'cap2', label: 'Estatísticas' },
  { id: 'cap3', label: 'Ações e Combate' },
  { id: 'cap4', label: 'Terrenos e Deslocamento' },
  { id: 'cap5', label: 'Idiomas' },
  { id: 'cap6', label: 'Talentos' },
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

const IDIOMAS = [
  { l: 'Comum', d: 'Idioma mais utilizado entre reinos e civilizações. Falado por praticamente todas as raças inteligentes.' },
  { l: 'Élfico', d: 'Língua antiga, refinada e ligada à magia e à natureza. Frequentemente usada em textos arcânicos e rituais.' },
  { l: 'Anão', d: 'Idioma robusto e percussivo, usado por povos subterrâneos e forjadores. Rico em termos técnicos de mineração e forja.' },
  { l: 'Dracônico', d: 'Língua dos dragões e da magia primordial. Muitas fórmulas mágicas têm raízes neste idioma.' },
  { l: 'Infernal', d: 'Linguagem de demônios, pactos e entidades sombrias. Cada palavra carrega peso contratual.' },
  { l: 'Celestial', d: 'Idioma sagrado utilizado por anjos e ordens divinas. Sons harmônicos que ressoam de forma diferente em seres corrompidos.' },
  { l: 'Selvagem', d: 'Língua tribal utilizada por povos bestiais e nômades. Direta, eficiente e rica em terminologia de caça e território.' },
  { l: 'Silvestre', d: 'Linguagem espiritual ligada as criaturas da floresta e ao povo Fauno. Melodiosa e cheia de metáforas da natureza.' },
  { l: 'Abissal', d: 'Idioma caótico associado ao vazio e à corrupção. Difícil de aprender sem exposição prolongada ao Abismo.' },
  { l: 'Gigante', d: 'Língua antiga de gigantes e titãs. Poucos a aprendem por escolha — é simplesmente grande demais para ser sussurrada.' },
  { l: 'Orc', d: 'Linguagem agressiva de tribos guerreiras. Funcional e direta, valoriza ação sobre descrição.' },
  { l: 'Feérico', d: 'Idioma místico e espiritual, semelhante ao Silvestre mas com sotaque próprio e expressões únicas do Reinos das Fadas.' },
  { l: 'Arcano', d: 'Linguagem utilizada em grimórios, runas e fórmulas mágicas. Não é falado em conversas comuns — é invocado.' },
  { l: 'Naga', d: 'Língua serpentina utilizada por criaturas reptilianas e povos aquáticos ancestrais. Suave e sibilante.' },
  { l: 'Primordial', d: 'Idioma ancestral dos elementais e forças da natureza. Considerado um dos idiomas mais antigos ainda em uso.' },
]

const TALENTOS = [
  { n: 'Aplicar Toxina', d: 'O dano causado pela condição Envenenado é aumentado para 2d6 por rodada.' },
  { n: 'Afinidade Elemental', d: 'Escolha um elemento entre Água, Fogo, Terra, Vento ou Trovão. Você recebe resistência ao dano causado por esse elemento.' },
  { n: 'Arqueólogo', d: 'Recebe vantagem em testes de História e Prestidigitação.' },
  { n: 'Arquimemória Arcana', d: 'Pré-requisito: Intelecto 3 ou superior — Sua mente processa magia e conhecimento em velocidade sobrenatural. Testes para identificar magia recebem vantagem. Uma vez por descanso curto, pode reduzir em 1 o custo de Mana de uma magia.' },
  { n: 'Atirador Mágico', d: 'Aumenta em 9 metros o alcance das magias conjuradas por você.' },
  { n: 'Aura de Liderança', d: 'Pré-requisito: Presença 3 ou superior — Sua presença inspira aqueles ao seu redor. Aliados a até 9 metros de você recebem +2 em testes de salvaguarda com base no atributo Presença. Esse bônus é passivo e sempre ativo enquanto você estiver consciente e não estiver com a condição Silenciado ou Amedrontado.' },
  { n: 'Chamas Incontroláveis', d: 'Ao aplicar um ataque mágico contra uma criatura com elemento fogo e causar a condição Em Chamas, ela causa +1d8 de dano contínuo adicional.' },
  { n: 'Colosso de Guerra', d: 'Pré-requisito: Armas de duas mãos e Força 3 ou superior — Seu corpo foi treinado para esmagar defesas inimigas. Ao acertar um ataque corpo a corpo, você pode empurrar o alvo 3 metros sem teste.' },
  { n: 'Coração de Leão', d: 'Pré-requisito: Presença 3 ou superior. Sua coragem e determinação permanecem firmes mesmo diante do impossível. Recebe vantagem em salvaguardas e testes de Vontade.' },
  { n: 'Corte Profundo', d: 'Ao realizar um acerto crítico com uma arma corpo a corpo do tipo cortante ou perfurante, o alvo sofre Sangramento por 2 rodadas.' },
  { n: 'Criar Veneno Mortal', d: 'A cada descanso, você pode criar uma quantidade de frascos de Veneno Mortal igual ao seu Intelecto. Cada frasco pode ser aplicado em uma arma corpo a corpo ou à distância (não funciona em armas mágicas). Ataques realizados com armas envenenadas causam dano mágico e aplicam a condição Envenenado ao alvo. Cada frasco possui uma única utilização.' },
  { n: 'Dançarino das Lâminas', d: 'Pré-requisito: Destreza 3 ou superior — Sua velocidade torna seus movimentos quase impossíveis de acompanhar. Uma vez por rodada, ao errar um ataque corpo a corpo, você pode mover até 3 metros sem provocar ataques de oportunidade.' },
  { n: 'Disparo Violento', d: 'Ao realizar um acerto crítico com uma arma de ataque à distância contra criaturas a menos de 6 metros de você, o alvo é empurrado 3 metros para trás.' },
  { n: 'Empunhadura Dupla', d: 'Quando estiver empunhando duas armas de uma mão, o personagem pode realizar um ataque adicional com a arma secundária após executar um ataque. Esse ataque extra causa apenas metade do dano normal da arma secundária.' },
  { n: 'Encantar com Veneno Mortal', d: 'O primeiro ataque crítico realizado por você com armas corpo a corpo ou à distância aplica Aplicar Toxina por 3 rodadas, aumentando o dano da condição para 2d6.' },
  { n: 'Envenenar Arma', d: 'Seus ataques críticos com armas corpo a corpo aplicam a condição Envenenado ao alvo.' },
  { n: 'Execução Final', d: 'Você recebe vantagem em ataques contra criaturas sob Enfraquecido, Paralisado ou Atordoado.' },
  { n: 'Explosão Tóxica', d: 'Ao final do turno, criaturas envenenadas por você sofrem 1d4 de dano adicional de Veneno.' },
  { n: 'Físico Escultural', d: 'Pré-requisito: Força 3 ou superior. Seu corpo foi levado ao auge da capacidade física. Recebe vantagem em salvaguardas e testes de Atletismo.' },
  { n: 'Ganância Insaciável', d: 'Você aprendeu a transformar sofrimento em benefício próprio. Sempre que derrotar uma criatura, recupera Mana ou Vida igual ao seu Intelecto ou Vitalidade. Porém, sofre desvantagem para resistir a efeitos de Provocado relacionados a recompensas, tesouros ou poder.' },
  { n: 'Gelo Sepulcral', d: 'Ao usar uma magia de ataque que causa a condição Congelando, as criaturas que sobreviverem recebem a condição de Lentidão por 2 rodadas.' },
  { n: 'Genialidade', d: 'Pré-requisito: Intelecto 3 ou superior. Sua mente possui capacidade analítica e intelectual excepcional. Recebe vantagem em salvaguardas e testes de Investigação.' },
  { n: 'Golpe Fulminante', d: 'Ao realizar um acerto crítico com uma arma de duas mãos, o alvo fica Atordoado por 1 rodada.' },
  { n: 'Golpe Silenciador', d: 'Pré-requisito: Destreza 2 ou superior — Ao realizar um acerto crítico com armas de longa distância contra uma criatura, o alvo deve passar em uma salvaguarda de Tenacidade ou ficará Silenciado por 1 rodada.' },
  { n: 'Gula Abissal', d: 'Você consome energia, vida e poder sem limites. Sempre que causar dano contínuo (Sangramento, Em Chamas, Veneno), recupera Vida igual a metade do dano realizado, uma única vez por rodada. Porém, recebe desvantagem contra efeitos de Fadigado.' },
  { n: 'Hemorragia Brutal', d: 'Pré-requisito: Força 2 ou superior — Sempre que causar Sangramento, o alvo também recebe a condição Enfraquecido até o fim do próximo turno.' },
  { n: 'Inveja Predatória', d: 'Você odeia ver outros superiores a você. Uma vez por descanso curto, pode copiar temporariamente um talento de um aliado por 1 rodada a qualquer momento. Porém, após utilizar esse talento terá desvantagem na próxima salvaguarda.' },
  { n: 'Ira Devastadora', d: 'Quanto mais ferido você está, mais brutal se torna. Sempre que entrar na condição Enfurecido, você recebe resistência a dano físico até o fim da cena.' },
  { n: 'Lista de Magias Expandida', d: 'Concede 3 magias adicionais iniciais à sua lista de magias conhecidas.' },
  { n: 'Luxúria Hipnótica', d: 'Sua presença domina emocionalmente aqueles ao redor. Uma vez por combate, pode forçar uma criatura que possa vê-lo a realizar uma salvaguarda de Vontade. Em falha, ela fica Desorientada por 1 rodada.' },
  { n: 'Maestria das Armas', d: 'Pré-requisito: possuir Proficiência em Armas Táticas ou Armas de Disparo — Sua habilidade com a arma é muito alta. Recebe +1 dado do dano da arma ao aplicar dano.' },
  { n: 'Maestria Marcial', d: 'Pré-requisito: Força 2 ou superior — Você dominou a arte de maximizar cada golpe. Ao rolar o dano mínimo (1) em qualquer dado de dano com armas físicas, você pode rolar esse dado novamente uma vez, ficando com o segundo resultado. Esse benefício se aplica apenas a armas que você possua proficiência.' },
  { n: 'Mente Fortalecida', d: 'Pré-requisito: Intelecto 2 ou superior — Seu treinamento mental cria barreiras internas contra influências externas. Você recebe +5 em salvaguardas contra magias e efeitos que causem as condições Alucinado, Confuso ou Provocado. Além disso, condições mentais que você já sofra têm sua duração reduzida em 1 rodada (sempre 1 rodada, nunca menor).' },
  { n: 'Mente Gêmeas', d: 'Pré-requisito: Intelecto 3 ou superior — O conjurador escolhe uma magia Sustentada que conhece; essa magia passa a durar uma quantidade de rodadas igual ao seu Intelecto e não pode ser conjurada novamente enquanto durar.' },
  { n: 'Mestre de Esquiva', d: 'Você recebe uma reação adicional do tipo Esquiva por rodada. Ao utilizar essa reação, recebe bônus de Defesa igual ao seu Reflexo até o final da ação defensiva.' },
  { n: 'Névoa Tóxica', d: 'Criaturas afetadas pela condição Envenenado também sofrem Lentidão enquanto permanecerem sob esse efeito.' },
  { n: 'Ocultação de Mana', d: 'Você recebe +10 em testes de Furtividade contra detecção mágica.' },
  { n: 'Olhos de Águia', d: 'Ao utilizar armas de arremesso ou armas de ataque à distância, você ignora penalidades de ataque contra alvos em até 18 metros.' },
  { n: 'Olhos de Coruja', d: 'Você enxerga no escuro não mágico em até 18 metros. Caso já possua visão no escuro, o alcance aumenta para 32 metros. Além disso, recebe +2 em salvaguardas contra ataques furtivos.' },
  { n: 'Orgulho Absoluto', d: 'Você acredita estar acima de todos os outros. Sempre que vencer uma salvaguarda contra um efeito hostil, recebe vantagem no próximo ataque ou magia realizada até o fim do turno seguinte. Porém, não pode receber a ação Ajudar ou bônus morais de aliados enquanto estiver consciente.' },
  { n: 'Pacto Ancestral', d: 'Restrição: não possuir pacto com nenhuma entidade. Permite escolher uma Entidade Caótica, concedendo acesso às Magias de Pacto.' },
  { n: 'Pacto Elemental', d: 'Restrição: não possuir pacto com nenhuma entidade. Permite escolher uma Entidade Elemental, concedendo acesso às Magias Antigas.' },
  { n: 'Pacto Santificado', d: 'Restrição: não possuir pacto com nenhuma entidade. Seu personagem recebe a subclasse Sagrado, podendo escolher uma Entidade Sagrada. Além disso, ganha acesso às Magias Sagradas. Ao realizar descansos em locais sagrados, recupera pontos adicionais de regeneração iguais ao seu valor de Presença.' },
  { n: 'Passo Silencioso', d: 'Pré-requisito: Destreza 2 ou superior — Seu controle corporal permite eliminar completamente o ruído dos seus movimentos. Você nunca sofre penalidade de Furtividade pelo tipo de terreno em que está se movendo. Além disso, ao se mover até a metade do seu deslocamento em um turno, recebe +5 em testes de Furtividade.' },
  { n: 'Penetração Mágica', d: 'Quando uma criatura possuir resistência contra o tipo de dano mágico causado por você, a efetividade dessa resistência é reduzida pela metade.' },
  { n: 'Poliglota', d: 'Você aprende um novo idioma à sua escolha. Além disso, recebe vantagem em testes relacionados a idiomas que conhece.' },
  { n: 'Posição de Fortaleza', d: 'Você recebe uma reação adicional do tipo Bloqueio por rodada. Ao utilizar essa reação, recebe bônus de Defesa igual à sua Tenacidade. Caso ainda sofra dano após o bloqueio, reduza o dano recebido em um valor igual à sua Tenacidade.' },
  { n: 'Potencializar Veneno', d: 'A duração da condição Envenenado causada por você é aumentada em +2 rodadas.' },
  { n: 'Preguiça Entorpecente', d: 'Seu corpo se move pouco, mas sua mente evita desperdícios. Sempre que permanecer sem se mover durante um turno inteiro, recebe +2 em Defesa e salvaguardas até o próximo turno.' },
  { n: 'Proficiência Armadura Leve', d: 'Tem acesso a armaduras leves.' },
  { n: 'Proficiência Armadura Pesado', d: 'Tem acesso a armaduras pesadas.' },
  { n: 'Proficiência Armas de Disparo', d: 'Tem acesso a armas de ataque de longa distância.' },
  { n: 'Proficiência Armas Mágicas', d: 'Tem acesso a armas mágicas.' },
  { n: 'Proficiência Armas Táticas', d: 'Tem acesso a armas táticas.' },
  { n: 'Proficiência em Magia', d: 'Aumenta a CD de Conjuração em +2 pontos.' },
  { n: 'Proficiência em Mana', d: 'Para cada ponto em Proficiência, recebe +2 de Mana máxima.' },
  { n: 'Proficiência em Vitalidade', d: 'Para cada ponto em Proficiência, recebe +3 em Vida máxima.' },
  { n: 'Proficiência Escudo', d: 'Tem acesso a escudos.' },
  { n: 'Prontidão', d: 'Pré-requisito: Destreza 3 ou superior. Você está sempre atento ao ambiente e pronto para reagir ao perigo. Recebe vantagem em salvaguardas, testes de Iniciativa e testes de Percepção.' },
  { n: 'Quebra de Limite', d: 'Aumenta o limite máximo de Mana por Turno em +2.' },
  { n: 'Reações Rápidas', d: 'Você recebe uma reação bônus adicional por rodada.' },
  { n: 'Refletir Veneno', d: 'Sempre que você sofrer um ataque crítico, a criatura atacante recebe a condição Envenenado por 3 rodadas.' },
  { n: 'Reserva Arcana', d: 'Pré-requisito: Presença 2 ou superior — Você desenvolveu uma reserva mágica secundária que alimenta sua conjuração em momentos críticos. Você possui uma reserva de Mana adicional igual à sua Presença. Essa reserva se recupera somente em descanso longo e pode ser usada normalmente para pagar custos de magias.' },
  { n: 'Resistência a Caótico', d: 'Você recebe resistência ao elemento caótico. Ao escolher esse elemento, fica restrito ao talento Resistência a Sagrado.' },
  { n: 'Resistência à Morte', d: 'Sua determinação desafia os limites da sobrevivência. Você recebe vantagem em salvaguardas realizadas enquanto estiver na condição Morrendo.' },
  { n: 'Resistência a Sagrado', d: 'Você recebe resistência ao elemento sagrado. Ao escolher esse elemento, fica restrito ao talento Resistência a Caótico.' },
  { n: 'Sensibilidade Aguçada', d: 'Você consegue perceber emoções e intenções de outras criaturas, como medo, raiva ou malícia. Recebe +5 em testes de Carisma relacionados a Persuasão, Intimidação e Enganação.' },
  { n: 'Sobrevivente Selvagem', d: 'Pré-requisito: Vitalidade 3 ou superior. Você domina técnicas naturais de adaptação e sobrevivência. Recebe vantagem em salvaguardas e testes de Sobrevivência.' },
  { n: 'Terror Implacável', d: 'Pré-requisito: Presença 2 ou superior — Sempre que reduzir uma criatura a menos da metade da Vida, ela deve realizar uma salvaguarda de Tenacidade. Em caso de falha, fica Amedrontada por 1 rodada.' },
  { n: 'Treinamento Marcial', d: 'Você recebe uma reação adicional do tipo Contra-Ataque por rodada. Ao utilizar essa reação, recebe bônus de Defesa igual à sua Luta. Caso obtenha sucesso na defesa, pode realizar imediatamente um ataque desarmado contra a criatura atacante.' },
  { n: 'Vigor Inabalável', d: 'Pré-requisito: Vitalidade 2 ou superior — Sua constituição robusta acelera sua recuperação. Sempre que recuperar Vida por descanso curto ou longo, você recupera pontos adicionais de Vida iguais ao dobro da sua Vitalidade.' },
  { n: 'Vitalidade Inabalável', d: 'Pré-requisito: Vitalidade 3 ou superior — Seu corpo suporta danos que destruiriam outras criaturas. Ao cair para 0 pontos de vida, pode permanecer consciente até o fim do próximo turno, uma vez por descanso longo.' },
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
        <h2 className={styles.chTitle}>Conceitos Fundamentais</h2>
        <div className={styles.chDivider} />
        <p className={styles.chLead}>Antes de rolar qualquer dado, é preciso compreender a linguagem do Reino Mágico.</p>
      </div>

      <div className={styles.sec}>
        <h3 className={styles.secTitle}>Dados Utilizados</h3>
        <p className={styles.secText}>
          No Reino Mágico, o destino dos personagens é moldado por 
          diferentes tipos de dados, cada um representando níveis 
          distintos de poder, risco e imprevisibilidade. 
          O sistema utiliza uma variedade que vai do <strong>D4 ao D20</strong>, 
          permitindo desde ações simples até feitos extraordinários.
        </p>
        
        <p className={styles.secText}>
         Os dados menores, como o <strong>D4 e o D6</strong>, costumam estar 
         ligados a efeitos mais modestos — pequenos danos, 
         bônus sutis ou eventos de baixa complexidade. 
         Já os dados intermediários, como <strong>D8, D10 e D12</strong>, 
         entram em cena quando as ações ganham mais impacto, seja em 
         combates mais intensos ou no uso de habilidades mais avançadas.
        </p>
        
        <p className={styles.secText}>
         No entanto, o verdadeiro coração do sistema é o <strong>D20</strong>. 
         Ele é o dado principal do jogo e determina 
         o sucesso ou fracasso das ações mais importantes. 
         Sempre que um personagem tenta realizar algo 
         decisivo — atacar um inimigo, resistir a um efeito, 
         conjurar uma magia poderosa ou superar um 
         desafio — é o D20 que dita o resultado.

        </p>
        <p className={styles.secText}>
        Essa variedade de dados não está ali por acaso: ela cria 
        uma escala clara de progressão e mantém o jogo dinâmico. 
        Ao mesmo tempo em que o D20 garante a emoção e
         a imprevisibilidade dos momentos cruciais, 
         os demais dados refinam os detalhes, dando profundidade às mecânicas.
         
        </p>
        
        
        
        
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
           <p className={styles.secText}>Na criação do personagem, 
            as perícias iniciais são definidas pela classe. 
            Além delas, o jogador pode <strong>escolher 2 perícias adicionais</strong>, 
            que começam no nível Básico (+2).</p>
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
        <p className={styles.secText}>A economia do reino é sustentada 
          por diferentes tipos de moedas, utilizadas 
          conforme o valor das transações e a posição social de 
          seus portadores. Desde simples comerciantes de 
          vilarejos até grandes nobres e monarcas, 
          cada camada da sociedade utiliza
           uma categoria monetária distinta.</p>
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
        <h3 className={styles.secTitle}>Rodada e Turno</h3>
        <div className={styles.actionList}>
          {[
            {l:'⏳ Rodada',d:'Uma rodada representa o ciclo completo do combate, no qual todos os participantes — jogadores e criaturas — têm a oportunidade de agir.'},
            {l:'👣 Turno',d:'O turno é o intervalo individual dentro dessa rodada, correspondente ao momento específico em que cada participante executa suas ações — ou seja, a sua vez de agir.'},

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
        <h3 className={styles.secTitle}>Tipos de Ação</h3>
        <div className={styles.actionList}>
          {[
            {l:'Padrão',t:'Básica',c:'green',d:'É a ação principal do turno, utilizada para atacar, conjurar magias ou executar habilidades centrais. Só pode ser realizada durante a vez do personagem.'},
            {l:'Movimento',t:'Básica',c:'green',d:'Permite deslocamento e reposicionamento no campo de batalha. O personagem não pode dividir ação de movimento, entretanto pode ser realizado antes ou depois de uma ação Padrão.Assim como a ação padrão, só pode ser usada no próprio turno.'},
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

function Cap5() {
  return (
    <div>
      
      <div className={styles.chHero}>
        <h2 className={styles.chTitle}>Idiomas</h2>
        <div className={styles.chDivider} />
        <p className={styles.chLead}>
         A comunicação é uma das ferramentas mais valiosas para quem busca evoluir. 
         Saber ouvir, compreender e transmitir
          ideias pode abrir caminhos que a força jamais conseguiria.
          </p>
      </div>

      <div className={styles.sec}>
        <h3 className={styles.secTitle}>Idiomas do Reino Mágico</h3>
        <p className={styles.secText}>
             O mundo é habitado por raças diversas, cada uma com sua própria língua, 
        história e forma de nomear as coisas. O idioma que um personagem 
        fala não é apenas comunicação — é identidade, cultura e, em alguns casos, 
        poder. Abaixo estão os idiomas do Reino Mágico, todos os personagens 
        iniciam falando comum e o idioma nativo de sua raça.  
        </p>
       
       
        <table className={styles.skillTable}>
          <thead><tr><th>Língua</th><th>Descrição</th></tr></thead>
          <tbody>
            {IDIOMAS.map(row => (
              <tr key={row.l}>
                <td>{row.l}</td>
                <td>{row.d}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}



function Cap6() {
  return (
    <div>
      <div className={styles.chHero}>
        <h2 className={styles.chTitle}>Talentos</h2>
        <div className={styles.chDivider} />
        <p className={styles.chLead}>
          Talentos representam habilidades especiais, treinos e traços únicos que distinguem um personagem dos demais — escolhas que moldam seu estilo de jogo e seu caminho de evolução.
        </p>
      </div>

      <div className={styles.sec}>
        <h3 className={styles.secTitle}>Como Conseguir Talentos</h3>
        <p className={styles.secText}>
          A quantidade de talentos que um personagem pode possuir é definida pela <strong>Proficiência</strong>. Seu valor inicial é <strong>2</strong>, podendo ser elevado até o máximo de <strong>9</strong> através de aprimoramentos. Cada talento adquirido voluntariamente consome 1 ponto desse limite — habilidades concedidas automaticamente por raça, classe ou outras fontes não consomem o limite de Proficiência.
        </p>
        <p className={styles.secText}>
          Além da Proficiência, algumas raças concedem talentos bônus que não contam para o limite. Após a criação do personagem, é possível adquirir <strong>novos talentos</strong> investindo Pontos de Aprimoramento — cada compra do aprimoramento <strong>Talento</strong> custa <strong>300 pontos</strong> e permite escolher um novo talento, respeitando seus pré-requisitos e restrições.
        </p>
        <p className={styles.secText}>
          Alguns talentos exigem <strong>pré-requisitos</strong> (como um valor mínimo em determinado atributo) ou possuem <strong>restrições</strong> (como não possuir pacto com nenhuma entidade). Esses requisitos devem ser atendidos no momento da escolha do talento.
        </p>
      </div>

      <div className={styles.sec}>
        <h3 className={styles.secTitle}>Lista de Talentos Disponíveis</h3>
        <p className={styles.secText}>
          Abaixo estão todos os talentos disponíveis no Reino Mágico, com seus respectivos efeitos.
        </p>
        <div className={styles.condGrid}>
          {TALENTOS.map(t => (
            <div key={t.n} className={styles.condCard}>
              <div className={styles.condName}>{t.n}</div>
              <p className={styles.condEffect}>{t.d}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const CHAPTER_COMPONENTS = { cap1: Cap1, cap2: Cap2, cap3: Cap3, cap4: Cap4, cap5: Cap5, cap6: Cap6 }

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
