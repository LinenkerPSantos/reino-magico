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
  { key: 'caracteristicas', label: 'Características' },
  { key: 'longevidade', label: 'Longevidade' },
  { key: 'clas', label: 'Clãs e Famílias' },
  { key: 'nomes',   label: 'Nomes' },
]

const RACE_LORE = {
  "Anão": {
    intro: ["Os Anões são humanoides robustos, de baixa estatura e resistência excepcional. Forjados — literal e metaforicamente — em ambientes subterrâneos e montanhosos, desenvolveram uma cultura centrada na tradição, no ofício e na honra coletiva. São mestres artesãos, guerreiros disciplinados e guardiões de segredos que duram gerações. Teimosos por natureza e leais por escolha, os Anões raramente abandonam uma causa abraçada — para o bem ou para o mal. Sua resistência física é lendária, mas é sua resistência de vontade que realmente os define. Um Anão pode ser vencido em combate. Fazer com que ele desista é outra história."],
    cultura: ["A sociedade anã é organizada em clãs, cada um com sua especialidade — forjadores, guerreiros, mineradores, comerciantes. A honra do clã é levada a sério, e insultar a linhagem de um Anão é o caminho mais rápido para um conflito. Suas fortalezas montanhosas são obras de engenharia sem paralelo, esculpidas em pedra por gerações de mãos habilidosas. A cerveja, a forja e a música de guerra são pilares culturais inegociáveis."],
    historia: [
      "Os Anões foram os primeiros a organizar algo merecedor do nome de reino — não por ambição, mas por clareza. Descobriram cedo que a maioria das guerras começa não por maldade, mas por ambiguidade, e construíram sistemas de registro e comunicação para eliminar ambiguidade antes que virasse sangue.",
      "O conflito com os Draconatos pelas montanhas durou gerações — dois povos antigos e orgulhosos que queriam a mesma coisa e não tinham vocabulário em comum para negociar. A paz anã-dracônica sempre durou exatamente o tempo necessário para que ambos os lados esquecessem o suficiente para brigar de novo.",
      "Os grandes domínios subterrâneos, construídos com distribuição de peso perfeitamente calculada sobre camadas de rocha que os Anões conhecem melhor que qualquer outro povo, são considerados pelos próprios Anões seu legado mais duradouro. As armas dos Dez Heróis estão guardadas em câmaras nas entranhas das montanhas, e os Anões as guardam com o mesmo cuidado que guardam os próprios arquivos de clã.",
    ],
    figuras: [
      "Durn Maçaneta-de-Ferro — Um dos Dez Heróis. Ferreiro, filho de ferreiro, neto de ferreiro que havia forjado armas para a guerra anã-dracônica por toda a vida. Até o dia em que o filho dele foi morto em batalha por uma das mesmas armas que o pai havia feito. Durn colocou o martelo no chão, fechou a forja e foi encontrar um Draconato para conversar. O que construiu com Vorax das Escamas Negras foi o primeiro tijolo do Grande Conselho. É estátua em três cidades.",
      "O Rei das Montanhas (Entidade Elemental) — A entidade que habita a pedra do mundo. Os Anões foram o primeiro povo a perceber sua presença — ao escavar fundo o suficiente para ouvir o pulso das camadas antigas, ficaram imóveis por horas numa reverência instintiva. Essa relação é diferente do que outras raças têm com suas entidades: não de adoração, mas de conversa. Quando um Anão bate com o martelo na pedra, ele não está dominando — está perguntando.",
    ],
    caracteristicas: [
      'Segundo os registros mais antigos preservados nos Salões de Pedra Eterna, os anões não acreditam ter sido criados por deuses. Eles afirmam ter sido "despertados" pelo próprio Rei das Montanhas, moldados a partir das rochas profundas quando o mundo ainda era jovem.',
      'Os primeiros anões surgiram nas entranhas das grandes cordilheiras e passaram séculos explorando as profundezas do mundo. Enquanto outras raças ainda formavam tribos dispersas, os anões construíram fortalezas permanentes, sistemas de escrita, registros históricos e as primeiras redes comerciais organizadas.Foi entre eles que nasceram os conceitos de propriedade, tratado e aliança formal. Para os anões, uma palavra escrita possui quase o mesmo valor que um juramento de sangue.',
      'Durante a Guerra das Montanhas, travada contra os draconatos pelo controle dos picos mais ricos em minério, ambos os povos sofreram perdas devastadoras. A paz somente foi possível graças aos esforços de Durn Maçaneta-de-Ferro e Vorax das Escamas Negras, que lançaram as bases do Grande Conselho. Hoje, os anões permanecem como guardiões das montanhas, das relíquias dos Dez Heróis e dos segredos enterrados nas profundezas do mundo. Muitos acreditam que, quando o Rei das Montanhas voltar a falar diretamente com os mortais, serão os anões os primeiros a ouvir sua voz.'
    ],
    longevidade: [
      'Os Anões possuem uma das maiores expectativas de vida entre os povos mortais, vivendo normalmente entre trezentos e quinhentos anos. Sua infância é longa e marcada por aprendizado constante, e poucos são considerados verdadeiramente adultos antes dos cinquenta anos. A maturidade anã não é medida pela idade, mas pela responsabilidade assumida diante do clã. Por viverem durante séculos, os Anões desenvolvem uma relação peculiar com o tempo. Enquanto outras raças enxergam décadas, eles enxergam gerações. Projetos que levariam uma vida inteira para outros povos são frequentemente iniciados por um Anão sem qualquer pressa, sabendo que ele próprio poderá ver sua conclusão. Talvez por isso pareçam tão pacientes em algumas situações e absurdamente teimosos em outras.'
    ],
    clas: [
      'Os estrangeiros costumam acreditar que os reinos anões são governados por reis. Os próprios Anões consideram essa visão simplista. Reis governam territórios; clãs governam pessoas. Cada clã possui tradições, deveres e especialidades próprias. Alguns dedicam suas vidas à guerra, outros à mineração, ao comércio, à engenharia ou à preservação do conhecimento. A identidade de um Anão é moldada pelo clã em que nasceu, mas seu valor é determinado pelos feitos que realiza em nome dele.',
      'A rivalidade entre clãs é antiga e, em muitos casos, saudável. Discussões sobre técnicas de forja, estratégias militares ou interpretações históricas podem durar décadas sem que nenhum dos lados admita derrota.'
    ],
    nomes: [
      "Para um Anão, o nome é mais do que uma forma de identificação — é uma herança. O primeiro nome pertence ao indivíduo, mas o nome da família pertence a todos os ancestrais que vieram antes dele. Carregar um sobrenome respeitado significa honrar séculos de feitos acumulados, enquanto carregar um nome manchado pode se tornar o fardo de uma vida inteira.",
      "É comum que um Anão memorize pelo menos dez gerações de sua própria linhagem. Em cerimônias importantes, casamentos e funerais, recitar os nomes dos antepassados é considerado uma demonstração de respeito tão importante quanto qualquer oferenda.",
      "Os nomes anões são curtos, fortes e carregam significado familiar. O sobrenome de um anão é considerado tão importante quanto seu nome próprio, pois representa os feitos acumulados de gerações inteiras.",
      "Nomes Masculinos: Durn, Borin, Tharim, Brokk, Kharok",
      "Nomes Femininos: Helga, Thora, Brynja, Kara, Dagna",
      "Nomes de Família: Maçaneta-de-Ferro, Rochafundida, Martelo-Grisalho, Barba-de-Bronze, Escudo-de-Pedra.",
    ],
  },
  "Celestial": {
    intro: ["Os Celestiais são seres com uma fagulha divina inscrita em sua essência — uma conexão direta com os Cinco Pilares que sustentam o cosmos. Semelhantes aos Humanos em forma, distinguem-se pela luminosidade suave que emana de sua pele em momentos de emoção intensa e pela capacidade de manifestar asas de luz pura quando necessário. São ligados à ordem, à proteção e ao julgamento — não necessariamente ao bem, mas ao equilíbrio."],
    cultura: [
      "Os Celestiais não possuem uma cultura própria unificada — ao menos não até sua chegada ao Continente Ancestral. Aqueles criados em templos ou ordens divinas tendem a adotar os valores dessas instituições. Os que cresceram entre outras raças desenvolvem identidades híbridas, carregando a luz sem necessariamente abraçar o dogma.",
      "A Ordem dos Cinco é a estrutura cultural que os une: um corpo de conhecimento sobre os Cinco Pilares, o Tudo e o Nada, e o selo que contém o Negativo. Não é uma religião exatamente — é um compromisso de vigília. Os Celestiais que integram a Ordem se instalam próximos às áreas de risco e transmitem o que sabem para quem quiser aprender.",
    ],
    historia: ["Os Celestiais foram o último povo a se instalar entre as raças do Continente Ancestral. Estavam aqui antes — nos espaços entre os planos, nas intersecções de linhas de Mana, nos lugares onde a presença dos Cinco Pilares é mais densa — mas não entre os povos mortais. Desceram com propósito. A mensagem que trouxeram era simples e perturbadora: o fragmento do Negativo liberado em Ignareth não foi um acidente isolado, mas um sintoma. O selo original dos Cinco Pilares foi construído para um mundo que ainda não tinha seres inteligentes ativamente tentando quebrá-lo. Agora existe a Seita do Vazio. Existe Terra Devastadas como laboratório de vazio livre. O selo está sob pressão de um tipo inédito. Os Celestiais vieram dizer isso. E ficaram porque disseram que a mensagem não era suficiente."],
    figuras: [
      "Saereneth a Portadora — A primeira Celestial a descer em plena presença entre os povos do Continente Ancestral, carregando os textos fundamentais da Ordem dos Cinco. Não veio com proclamações ou sinais — veio com documentos, com paciência para responder perguntas e com a disposição de ficar mesmo quando não era bem-vinda. Não tem templo. Circula entre cidades, ensina quem quer aprender e observa o que os outros preferem ignorar.",
      "Os Guardiões do Limiar (coletivo) — Celestiais que escolheram se instalar nas bordas do Continente Ancestral mais próximas a Terra Devastadas. Monitoram as zonas de expansão do vazio e enviam relatórios para a Ordem. São vistos com reverência e com desconforto em proporções iguais pelos moradores locais.",
    ],
    caracteristicas: [
      'Os Celestiais não formam uma raça no sentido tradicional da palavra. Eles compartilham uma origem comum ligada aos Cinco Pilares, mas surgem em diferentes lugares, épocas e circunstâncias. Alguns manifestam sua natureza desde o nascimento; outros passam anos sem compreender a origem da luz que carregam.',
      'Fisicamente, são semelhantes aos Humanos, embora frequentemente apresentem traços difíceis de ignorar: olhos que refletem brilho próprio, cabelos que parecem reagir à luz ambiente ou uma aura sutil de serenidade que os acompanha mesmo em silêncio. Quando emoções intensas afloram ou quando canalizam seu poder, sua herança torna-se evidente através de manifestações luminosas que lembram fragmentos do próprio plano celestial.',
      'A maioria dos estudiosos concorda que os Celestiais não são descendentes dos deuses, mas sim ecos da energia utilizada pelos Cinco Pilares para moldar e sustentar a realidade. Os próprios Celestiais raramente se preocupam com a distinção.'
    ],
    longevidade: [
      'Os Celestiais possuem uma expectativa de vida que ultrapassa facilmente os dez mil anos. Muitos deles testemunham a ascensão e queda de reinos inteiros, observam mudanças geográficas e sobrevivem a eventos que para outras raças pertencem apenas aos livros de história. Essa longevidade cria uma relação peculiar com o tempo. Celestiais raramente tomam decisões precipitadas e tendem a enxergar problemas dentro de contextos muito maiores do que a maioria dos mortais consegue compreender. Ainda assim, aqueles que convivem por muito tempo entre outras raças costumam desenvolver uma visão mais imediata do mundo, aprendendo a valorizar a brevidade da vida mortal.'
    ],
    clas: [
      'Os Celestiais não formam clãs de sangue. Sua principal estrutura social é a Ordem dos Cinco, uma organização dedicada ao estudo e à preservação do equilíbrio cósmico. Apesar disso, pequenos grupos de Celestiais frequentemente se unem por propósito comum. Alguns dedicam suas existências à proteção dos selos contra o Negativo. Outros atuam como estudiosos das linhas de Mana ou observadores das fronteiras planares. Essas fraternidades raramente são permanentes, mas seus laços costumam durar séculos.'
    ],
    nomes: [
      "Os Celestiais não possuem linhagens familiares tão definidas quanto Humanos ou Anões. Sua identidade é construída muito mais por seus feitos, responsabilidades e juramentos do que por ancestrais. É comum que recebam um nome ao nascer e adquiram títulos ao longo da vida. Alguns tornam-se tão conhecidos por seus títulos que seus nomes originais acabam sendo esquecidos. Para um Celestial, aquilo que realizou possui mais importância do que aquilo que herdou.",
      "Nomes Masculinos: Saeren, Aelarion, Valeth, Kaelion, Orion",
      "Nomes Femininos: Saereneth, Elyra, Serapha, Lysandra, Auriel",
      "Nomes de Família: Os Celestiais raramente utilizam sobrenomes familiares. Em seu lugar, costumam adotar títulos ligados a feitos ou funções, como: A Portadora, Guardião do Limiar,  Vigia da Aurora, Portador da Chama, Observador dos Pilares.",
    ],
  },
  "Draconato": {
    intro: [
      "Os Draconatos são humanoides imponentes cobertos de escamas, com traços inconfundíveis de dragão — caudas, mandíbulas alongadas, olhos rasgados e uma presença que domina qualquer ambiente em que entram. Descendentes de antigas linhagens onde sangue draconíaco foi transmitido e transformado, cada Draconato carrega em si a herança de um tipo específico de dragão, com resistências e poderes que refletem essa origem.",
      "Poderosos e orgulhosos, os Draconatos não são dados a humildade fácil. Sua ligação com a magia primordial os torna excelentes conjuradores, e sua presença física impõe respeito imediato. No entanto, por trás da armadura de escamas e da postura dominante, há seres profundamente ligados à honra e à lealdade — quando escolhem dar essas coisas.",
    ],
    cultura: ["Os Draconatos vivem em pequenos grupos familiares chamados de Lares — não clãs, mas laços de sangue e escolha. A cultura dracônica valoriza força, disciplina e respeito pela linhagem. Trair um companheiro de Lar é considerado a pior das desonras. Muitos Draconatos buscam aventuras como forma de provar seu valor e honrar seus ancestrais, carregando o nome de seu tipo dracônico como um brasão."],
    historia: [
      "Os Draconatos desceram dos picos das montanhas enquanto os Anões subiam de baixo. A colisão era inevitável. O primeiro conflito aconteceu em cavernas onde o calor vulcânico encontrava o ar de altitude — sagrado para os Draconatos, rico em minerais para os Anões. Ninguém sabe quem atacou primeiro naquela noite. A pedra absorveu o sangue de ambos e não tomou partido.",
      "A guerra entre as profundezas e os picos durou décadas, extinguindo-se em acordos que duravam uma geração e recomeçando quando a geração nova chegava sem lembrar por que o acordo havia sido feito. O padrão só quebrou quando Vorax das Escamas Negras se sentou com Durn Maçaneta-de-Ferro — dois homens cansados demais para saber mais para quê estavam brigando.",
    ],
    figuras: ["Vorax das Escamas Negras — Um dos Dez Heróis. Perdeu toda a sua ninhada numa câmara de mineração dois anos antes do encontro com Durn. Dois homens que carregavam o mesmo peso que ninguém ao redor deles queria reconhecer. Não fizeram paz no primeiro encontro — ficaram sentados no mesmo lugar sem falar por um longo tempo, e isso foi suficiente para começar. A relação que construíram com Durn é o modelo que o Grande Conselho usa para descrever o que a reconciliação real parece: sem discurso, sem cerimônia, só dois seres exaustos escolhendo sentar juntos."],
    caracteristicas: [
      'Os Draconatos carregam em suas veias fragmentos do poder dos antigos dragões. Embora os grandes dragões sejam hoje criaturas raras, desaparecidas ou transformadas em lendas, sua herança permanece viva através das linhagens dracônicas espalhadas pelo mundo. Cada Draconato nasce ligado a uma ancestralidade específica, identificada pela coloração de suas escamas, pela natureza de sua magia e pelo elemento que ressoa em sua alma. Essa ligação não determina seu destino, mas influencia profundamente sua personalidade e a forma como os outros membros de seu povo o enxergam.',
      'Fisicamente, são mais altos e robustos que a maioria das raças humanoides. Sua presença impõe respeito mesmo quando permanecem em silêncio, e muitos povos afirmam sentir algo ancestral em seus olhares — como se observassem o mundo através de memórias muito mais antigas do que deveriam possuir.'
    ],
    longevidade: [
      'Os Draconatos possuem uma expectativa de vida que pode alcançar seiscentos anos. Crescem rapidamente durante os primeiros anos de vida, mas atingem a maturidade apenas após décadas de treinamento e disciplina. Diferente dos Anões, que valorizam a experiência acumulada ao longo dos séculos, ou dos Celestiais, que observam eras inteiras passarem, os Draconatos vivem com intensidade. Eles acreditam que o valor de uma vida não é medido por sua duração, mas pelas marcas deixadas no mundo. Muitos passam décadas aperfeiçoando uma única arte, técnica de combate ou forma de magia. Para os Draconatos, a excelência é uma forma de honrar os ancestrais.'
    ],
    clas: [
      'Os Draconatos organizam suas vidas em estruturas conhecidas como Lares. Um Lar é mais do que uma família — é uma união de sangue, juramento e propósito. Cada Lar preserva tradições próprias, histórias ancestrais e deveres específicos. Alguns dedicam-se à guerra, outros à magia, à diplomacia ou à proteção de territórios sagrados ligados às antigas linhagens dracônicas. A lealdade ao Lar é uma das bases da cultura draconata. Conflitos entre Lares acontecem, mas a traição interna é considerada uma falta tão grave que muitos acreditam que ela mancha não apenas o indivíduo, mas toda a sua linhagem.'
    ],
    nomes: [
      "O nome de um Draconato representa sua história, mas sua linhagem representa sua origem. Todo Draconato sabe exatamente de qual ancestralidade dracônica descende e considera essa informação parte fundamental de sua identidade.",
      "Ao se apresentar formalmente, é comum que um Draconato mencione não apenas seu nome, mas também sua linhagem e Lar. Entre seu povo, esconder a própria origem é visto como um sinal de vergonha ou desonra. As linhagens mais antigas preservam registros genealógicos que remontam por centenas de gerações, alguns alegando descender diretamente dos primeiros dragões que habitaram o mundo.",
      "Nomes Masculinos: Vorax, Rhogar, Kharvax, Draegon, Tyrakar",
      "Nomes Femininos: Veyra. Syrakha, Nyxara, Zarith, Kaelyra",
      "Nomes de Família: Os Draconatos raramente utilizam sobrenomes da forma tradicional. Em vez disso, são identificados por sua linhagem dracônica ou por títulos herdados: Escamas Negras, Chama Rubra, Presa de Bronze, Tempestade Azul, Rocha Ancestral",
    ],
  },
  "Elfo": {
    intro: ["Os Elfos são seres de beleza singular e longevidade extraordinária, moldados por séculos de observação e refinamento. Sua ligação com a magia arcana e com a natureza vai além do treinamento — é algo inscrito em cada fibra de seu ser, herdado de ancestrais que caminharam pelo mundo quando ele ainda era jovem. Racionais, estratégicos e às vezes percebidos como distantes, os Elfos enxergam o tempo de forma diferente. O que um Humano considera uma vida inteira, um Elfo experimenta como uma fase. Essa perspectiva os torna excelentes estudiosos, conjuradores e estrategistas — mas também pode torná-los arrogantes ou lentos para agir em situações que exigem impulso."],
    cultura: [
      "A cultura élfica é construída sobre tradição, arte e conhecimento. Suas cidades — quando existem — são obras de harmonia entre arquitetura e natureza, crescendo com as árvores em vez de substituí-las. Os Elfos valorizam a memória histórica acima de quase tudo, mantendo arquivos orais e escritos de eventos que outras raças já esqueceram.",
      "Relacionamentos inter-raciais existem e são, no Continente Ancestral atual, mais comuns do que eram. No entanto, há Elfos que veem os reinos híbridos com desconforto — não por preconceito simples, mas porque um povo que vive séculos carrega memórias de por que certas alianças falharam que os mais jovens ainda não acumularam.",
    ],
    historia: [
      "Os Elfos foram os primeiros a habitar as florestas antigas com respeito ao ritmo do lugar. Na Era das Sementes, a tensão com os Faunos pela mesma terra foi a primeira das disputas que definiria séculos. Os santuários de Mana que construíram na Era dos Domínios foram generosos em substância mas carregavam, na arquitetura, a perspectiva élfica — o que os Faunos notaram.",
      "A manipulação de Veryn Esmeraldanobre explorou exatamente essa tensão acumulada. O colapso da aliança florestal foi o evento mais traumático da história Élfica — não por quantos morreram, mas pelo que revelou: que a virtude de preservar tradição pode se tornar o instrumento de sua própria destruição quando entra em contato com orgulho suficiente. A investigação de Aeva das Raízes Profundas que expôs Veryn levou décadas. É considerada, nos arquivos Élficos, tanto um ato de coragem quanto um ato de penitência — a admissão de que seu próprio povo havia sido cúmplice, por ignorância, em algo que destruiu séculos de coexistência.",
    ],
    figuras: [
      "Aeva das Raízes Profundas — Uma dos Dez Heróis. Passou décadas rastreando a origem do conflito das florestas — não para vingar os Elfos, mas para descobrir genuinamente se eles haviam iniciado aquilo ou sofrido aquilo. A descoberta da manipulação de Veryn não a alegrou. A destruiu por um tempo. Depois a fez levantar com uma clareza que levou ao processo de exposição mais paciente da história: documentos, memórias convocadas de árvores, anos encontrando a forma certa de apresentar a verdade. Seu nome está numa biblioteca do Instituto Real.",
      "Ildara Candela-Viva — Uma dos Dez Heróis. Fez o que poucos Elfos fizeram: desceu das florestas para os campos de batalha das Guerras Vermelhas e ficou. Não como guerreira — como sanadora. Viu coisas que poucos Elfos sobrevivem para recordar com clareza, e ficou de qualquer forma, quando a maioria havia se retirado para o interior protegido. A dor que carregava era visível e a tornava uma presença difícil de ignorar.",
      "Veryn Esmeraldanobre (figura histórica negativa) — O nobre feérico cuja manipulação destruiu a aliança das florestas. Mencionado em arquivos Élficos não como monstro, mas como advertência mais precisa: o que acontece quando inteligência, poder e o desejo legítimo de ser reconhecido se combinam com um pacto que o usuário não admite ter feito. Desapareceu após as Guerras Vermelhas. Nenhum rastro confirmado.",
    ],
    caracteristicas: [
      'Os Elfos carregam em si uma afinidade natural com a Mana que permeia o mundo. Para eles, a magia não é apenas uma ferramenta ou um conhecimento adquirido — é uma linguagem tão natural quanto a fala. Mesmo aqueles que jamais estudam formalmente as artes arcanas costumam demonstrar sensibilidade aos fluxos mágicos e às alterações sutis do ambiente.',
      'Sua aparência elegante e traços refinados fizeram com que muitas outras raças os associassem à perfeição. Os próprios Elfos consideram essa visão simplista. Para eles, a verdadeira excelência não está na aparência, mas no aperfeiçoamento constante da mente, do corpo e do espírito ao longo dos séculos.',
      'Embora sejam frequentemente vistos como serenos e pacientes, essa tranquilidade nasce da perspectiva. Quando se vive por mais de um milênio, poucas situações parecem realmente urgentes.'
    ],
    longevidade: [
      'Os Elfos possuem uma expectativa de vida que varia entre mil e dois mil anos. Sua infância e juventude são longas quando comparadas às de outras raças, e poucos são considerados adultos antes dos oitenta anos.',
      'Essa longevidade influencia profundamente sua forma de pensar. Enquanto outras raças se preocupam com os próximos anos, os Elfos frequentemente planejam décadas ou séculos à frente. Florestas inteiras são cultivadas segundo projetos que levarão gerações para atingir sua forma ideal.',
      'A memória é considerada uma das maiores riquezas élficas. Muitos indivíduos carregam recordações de eventos que para outras raças pertencem à história antiga. Por essa razão, os Elfos tendem a valorizar tradição e experiência, embora essa mesma característica possa torná-los resistentes a mudanças repentinas.'
    ],
    clas: [
      'Os Elfos não se organizam em clãs guerreiros ou estruturas rígidas de poder. Suas famílias são antigas casas de conhecimento, arte, magia e tradição. Cada linhagem preserva especializações próprias. Algumas famílias dedicam-se ao estudo arcano, outras à diplomacia, à preservação da história, ao cultivo das florestas ou à criação de artefatos mágicos.',
      'As grandes casas élficas raramente competem através da guerra ou da força. Seus conflitos costumam ocorrer através de influência política, debates filosóficos, disputas acadêmicas ou interpretações divergentes de eventos históricos.'
    ],
    nomes: [
      "Os nomes élficos possuem significados profundos e geralmente estão ligados à natureza, à magia ou à história familiar. Um nome não é escolhido apenas por sonoridade, mas pelo legado que se espera que o indivíduo construa ao longo da vida. A linhagem possui grande importância na cultura élfica.",
      "Muitas famílias preservam registros que remontam a centenas de gerações, mantendo viva a memória de ancestrais, feitos e responsabilidades herdadas. Entretanto, diferentemente dos Anões, os Elfos valorizam menos a honra familiar e mais a reputação individual. Um Elfo pode honrar sua linhagem, mas espera-se que construa sua própria história.",
      "Nomes Masculinos: Aelar, Thalion, Eryndor, Faelar, Lorien",
      "Nomes Femininos: Aeva, Ildara, Sylwen, Elyndra, Vaelira",
      "Nomes de Família: Das Raízes Profundas, Candela-Viva, Folha Prateada, Acqua Esmeralda, Canto das Estrelas",
    ],
  },
  "Fauno": {
    intro: ["Os Faunos são seres com traços animais pronunciados — pelos, garras, presas, cauda, orelhas — herdados de uma linhagem que se misturou com espíritos da natureza há tempos imemoriais. Lobos, felinos, raposas, corvos: cada família metamorfa carrega a essência de uma criatura diferente, e essa essência molda não apenas a aparência, mas os instintos e a forma de enxergar o mundo. Ágeis, perceptivos e intensamente ligados ao ambiente, os Faunos são rastreadores naturais e guerreiros instintivos. Sua capacidade mais impressionante, no entanto, é a transformação completa — assumir a forma da criatura de sua herança, fundindo o humanoide com o animal de forma total e temporária."],
    cultura: ["A maioria dos Faunos vive em clãs nômades, seguindo rotas de caça e migração que seus ancestrais estabeleceram. Hierarquia é determinada por força, sabedoria e respeito — não por nascimento. Poucos Faunos se integram completamente às cidades, preferindo as bordas dos assentamentos onde podem sentir o cheiro da floresta próxima. Os que se aventuram como mercenários ou exploradores costumam ser os mais adaptáveis — e os mais incompreendidos."],
    historia: [
      "Os Faunos chegaram às florestas antigas vindos das estepes, seguindo as rotas de migração dos animais com quem partilhavam instintos. Encontraram os Elfos lá. Os primeiros encontros foram tensos da forma que encontros entre pessoas que amam a mesma coisa costumam ser. A divisão que funcionou — Elfos nas copas, Faunos nas bordas — era prática, não afeto.",
      "A manipulação de Veryn explorou exatamente esse desconforto de fundo. As dúvidas que plantou entre os dois povos nunca foram totalmente falsas — eram amplificações calculadas de fricções reais. O colapso da aliança florestal foi uma ferida que levou gerações para cicatrizar e que ainda dói em regiões onde a memória coletiva é mais longa.",
      "Os Faunos têm cultuado O Andarilho e as entidades elementais da natureza desde a Era das Sementes — não com templos fixos (que para eles seria uma prisão) mas com rituais móveis realizados onde o ambiente pede.",
    ],
    figuras: ["Tavan Passo-Branco — Um dos Dez Heróis. Ancião que havia perdido quase todo o clã no conflito com os Elfos — o suficiente para ter todo o direito de odiar. Escolheu não usar esse direito. Não por bondade, mas por uma lógica fria que seus aliados mais jovens às vezes confundiam com frieza: a certeza de que o ódio era um luxo que não podiam pagar. Foi ele quem primeiro se sentou com líderes Élficos após a exposição de Veryn, quando a maioria dos Faunos ainda recusava qualquer contato."],
    caracteristicas: [
      'Os Faunos carregam em seus corpos e espíritos a herança de antigas ligações entre mortais e entidades da natureza. Essa conexão manifesta-se através de características animais que variam entre famílias e linhagens: pelagem, caudas, garras, presas, olhos adaptados à escuridão ou sentidos extraordinariamente aguçados.',
      'Diferente de outras raças, os Faunos raramente enxergam sua natureza bestial como algo separado de sua identidade racional. Para eles, instinto e pensamento não são forças opostas, mas partes complementares de um mesmo ser.',
      'Cada linhagem preserva traços associados a um animal ancestral. Essas características influenciam sua forma de agir, suas tradições e até mesmo a maneira como interpretam o mundo ao redor. Ainda assim, os Faunos rejeitam a ideia de que destino e herança sejam a mesma coisa. O animal que existe dentro deles oferece caminhos; cabe ao indivíduo decidir qual deles seguir.'
    ],
    longevidade: [
      'Os Faunos possuem uma expectativa de vida semelhante à dos Humanos, vivendo normalmente entre sessenta e oitenta anos. Essa existência relativamente breve faz com que valorizem intensamente o presente. Poucos povos celebram tanto a vida cotidiana quanto os Faunos. Festas, caçadas, histórias e canções são vistas não apenas como entretenimento, mas como formas de preservar memórias para as gerações futuras.',
      'Os anciões ocupam posições de grande respeito dentro dos clãs. Sobreviver por muitas décadas significa acumular conhecimento, experiência e histórias que se tornam patrimônio coletivo de todo o povo.'
    ],
    clas: [
      'Os Faunos organizam-se em clãs nômades ligados por sangue, amizade e tradição. Cada clã costuma possuir uma herança animal predominante, embora misturas entre linhagens sejam comuns.',
      'Os clãs percorrem territórios ancestrais seguindo rotas estabelecidas ao longo de gerações. Essas jornadas não servem apenas para caça ou sobrevivência, mas também para manter vivas histórias, acordos e locais sagrados espalhados pelo mundo.',
      'A liderança costuma recair sobre aqueles que demonstram sabedoria, capacidade de proteger o grupo e profundo entendimento da natureza. O respeito é conquistado, não herdado.',
      'Conflitos internos são raros, pois a sobrevivência coletiva sempre foi mais importante do que disputas individuais. Um Fauno pode desafiar um líder, mas espera-se que apresente uma solução melhor antes de fazê-lo.'
    ],
    nomes: [
      "Os nomes faunos costumam refletir elementos da natureza, características pessoais ou eventos marcantes ocorridos durante o nascimento. É comum que um indivíduo receba um segundo nome ou título ao realizar um feito importante para seu clã. A linhagem é reconhecida principalmente pela herança animal compartilhada. Muitos Faunos identificam-se primeiro pela família metamorfa à qual pertencem e apenas depois pelo nome de seu clã.",
      "Nomes Masculinos:  Tavan, Kaoru, Fenrir, Aruk e Bran",
      "Nomes Femininos: Lyra, Naya, Selene, Aria e Vesha",
      "Nomes de Família: Passo-Branco, Presa Cinzenta, Olhos da Lua, Garra de Carvalho e Vento da Estepe",
    ],
  },
  "Feérico": {
    intro: ["Os Feéricos são humanoides pequenos e ágeis, nascidos da fronteira entre o mundo material e o reino das fadas. De aparência delicada, mas mente afiada, os Feéricos são naturalmente inclinados para ilusões, truques e a exploração dos limites entre o que é real e o que parece ser. Sua estatura baixa é perpetuamente subestimada — e eles preferem assim. Curiosos por natureza, os Feéricos raramente ficam parados o suficiente para serem completamente compreendidos. Eles observam, experimentam, provocam e desaparecem antes que as consequências se tornem inconvenientes. No entanto, quando escolhem se dedicar a algo — ou a alguém — fazem isso com uma intensidade que poucos esperam de seres tão aparentemente leves."],
    cultura: ["A cultura Feérica valoriza a criatividade, a adaptabilidade e o humor — não como entretenimento, mas como filosofia. Enganar um inimigo é considerado mais honrado do que derrotá-lo pela força. As comunidades Feéricas existem nas margens das cidades ou dentro de florestas encantadas, e sua política interna é tão labiríntica quanto fascinante. Acordos entre feéricos nunca são simples — cada palavra importa."],
    historia: [
      "Os Feéricos chegaram às florestas antigas simplesmente aparecendo onde a Mana era mais densa. Não colonizaram o lugar — tornaram-se parte dele de uma maneira que Elfos e Faunos levaram séculos para entender. Os santuários de Mana que os Elfos construíram potencializaram involuntariamente os Feéricos, que prosperaram de formas que os outros dois povos não compreendiam completamente.",
      "A nobreza Feérica que surgiu na Era dos Domínios foi diferente dos Feéricos simples — mais ambiciosa, com memória longa e projetos que atravessavam gerações. Veryn Esmeraldanobre era a expressão mais elaborada disso. O colapso do seu plano e a exposição de sua manipulação pela própria raça (Serafael o Arrependido foi da sua nobreza; Aeva das Raízes Profundas encontrou os documentos com sua ajuda) deixou uma fratura cultural que os Feéricos ainda carregam: o orgulho de ser os mais complexos e o peso de saber que complexidade sem ética é apenas sofisticação a serviço do dano.",
    ],
    figuras: [
      "Serafael o Arrependido — Um dos Dez Heróis. Carregava o sobrenome que ele mesmo escolheu, substituindo o sobrenome nobre que havia queimado publicamente. Era da nobreza de Veryn. Havia participado das primeiras fases da manipulação acreditando que servia a um projeto legítimo — e a percepção do que havia servido chegou tarde o suficiente para não poder desfazer nada, mas cedo o suficiente para fazer algo. O que fez foi ir até Aeva das Raízes Profundas e contar tudo que sabia.",
      "Eyra Sussurro-nas-Folhas — Uma dos Dez Heróis. Recusou-se desde o início a seguir a visão de Veryn. Passou a Era das Rachaduras nos espaços entre os planos, invisível para todos os lados, documentando o que via. Uma testemunha que nenhuma das facções havia recrutado, o que significava que nenhuma das facções podia desacreditá-la completamente.",
      "O Décimo (sem nome registrado) — O último dos Dez Heróis. Pode ter sido Feérico — os relatos discordam sobre raça e origem. Apareceu perto do fim do período mais intenso das guerras, disse a coisa que os outros nove precisavam ouvir para parar de argumentar e começar a agir juntos, e nunca mais foi visto após o último tratado ser assinado.",
      "Veryn Esmeraldanobre (histórico, desaparecido) — O símbolo de como a busca por reconhecimento legítimo se torna catastrófica quando mediada por uma entidade caótica. O fio da Dama dos Desejos ainda está preso nele, em algum lugar. Ninguém sabe onde.",
    ],
    caracteristicas: [
      'Os Feéricos são criaturas moldadas pela proximidade com os planos feéricos e pelas correntes mais imprevisíveis da Mana. Embora compartilhem características físicas semelhantes, raramente dois Feéricos parecem verdadeiramente iguais. Alguns possuem orelhas alongadas, outros exibem olhos de cores impossíveis, pequenas marcas luminosas sobre a pele ou vozes que parecem carregar ecos de lugares distantes.',
      'Sua relação com a realidade é diferente da maioria dos povos. Os Feéricos compreendem intuitivamente que a verdade nem sempre é simples e que aparência e essência raramente são a mesma coisa. Essa perspectiva os torna excelentes observadores, manipuladores, artistas e estudiosos das emoções alheias.',
      'Apesar da fama de brincalhões e enganadores, os Feéricos levam promessas extremamente a sério. Uma palavra dada possui valor quase místico entre eles, e quebrar um acordo voluntariamente é considerado uma falha moral grave.'
    ],
    longevidade: [
      'Os Feéricos vivem normalmente entre cento e vinte e duzentos anos. Embora não sejam tão longevos quanto Elfos ou Celestiais, possuem vidas significativamente mais longas do que a maioria dos povos mortais.',
      'O tempo é percebido de maneira peculiar por eles. Muitos Feéricos passam décadas perseguindo um único interesse para então abandoná-lo completamente ao descobrir algo novo e fascinante. Essa curiosidade constante faz com que acumulem experiências extremamente variadas ao longo da vida.',
      'A velhice entre os Feéricos raramente significa lentidão. Mesmo os mais antigos costumam preservar sua criatividade, humor e tendência a enxergar possibilidades onde outros veem apenas limitações.'
    ],
    clas: [
      'Os Feéricos raramente se organizam em estruturas rígidas como reinos ou clãs tradicionais. Em vez disso, formam Casas, Cortes e círculos sociais baseados em interesses, alianças e objetivos compartilhados.',
      'As Casas Feéricas mais antigas acumulam influência através de conhecimento, favores e acordos construídos ao longo de gerações. Muitas vezes uma família feérica exerce poder não por força militar, mas porque conhece segredos que ninguém mais conhece ou porque possui antigas promessas que ainda precisam ser honradas.',
      'A política feérica é notoriamente complexa. Uma disputa pode durar décadas sem que uma única arma seja sacada. Intrigas, negociações, jogos de palavras e acordos cuidadosamente construídos são as ferramentas preferidas desse povo.'
    ],
    nomes: [
      "Os nomes feéricos costumam ser musicais, simbólicos e carregados de significados ocultos. Muitos indivíduos escolhem alterar seus próprios nomes ao longo da vida, adotando novos títulos que reflitam eventos marcantes ou mudanças pessoais.",
      "A linhagem possui importância entre as antigas casas feéricas, mas é menos valorizada do que reputação, inteligência e capacidade de navegar pelas complexas relações sociais do povo feérico. Não é incomum que um Feérico possua vários nomes: um nome verdadeiro, um nome social e um apelido utilizado apenas entre amigos próximos.",
      "Nomes Masculinos: Serafael, Lyrian, Thistle, Vaelor e Nym",
      "Nomes Femininos: Eyra, Sylvara, Nixie, Lirael e Faelyn",
      "Nomes de Família: Esmeraldanobre, Sussurro-nas-Folhas, Dança-da-Lua, Brilho-do-Orvalho e Voz-do-Crepúsculo",
    ],
  },
  "Humano": {
    intro: ["Os Humanos são o povo mais numeroso, disperso e imprevisível do Reino Mágico. Não são os mais altos, nem os mais fortes, nem os mais antigos — mas são, sem dúvida, os mais adaptáveis. Onde outras raças desenvolveram especializações ao longo de séculos, os Humanos escolheram outra estratégia: a versatilidade. Presentes em todos os cantos do mundo, os Humanos constroem reinos onde outros abandonaram, prosperam em climas que outros evitam e formam alianças que nenhuma outra raça conseguiria sustentar. Sua maior força não é física nem mágica — é a capacidade de aprender, mudar e persistir."],
    cultura: [
      "A sociedade humana é marcada pela diversidade. Não existe uma única cultura humana — existem centenas delas, cada uma moldada por clima, história e vizinhança. Os Humanos constroem cidades, formam guildas, escrevem tratados e os ignoram quando conveniente. São ambiciosos por natureza, o que os torna tanto os maiores construtores quanto os maiores destruidores do mundo conhecido.",
      "No Continente Ancestral atual, os Humanos são o povo com maior presença nos reinos híbridos — precisamente porque a versatilidade que sempre os definiu facilita a integração com outras culturas. Os maiores centros comerciais do continente são, em sua maioria, fundações humanas que cresceram para incluir bairros de todas as raças.",
    ],
    historia: [
      "Na Era das Sementes, os Humanos chegaram por último — e em todos os lugares ao mesmo tempo. Sem especialização geográfica, ocuparam planícies, vales e costas com a persistência de quem não se adapta ao ambiente porque aprende a adaptar o ambiente a si.",
      "Durante a Era dos Domínios, os primeiros reinos humanos nasceram não de filosofia ou tradição sagrada, mas de necessidade brutal: organizar força suficiente para segurar fronteiras. Cada guerra ensinava algo. Cada aliança que quebrava revelava o que havia faltado para durar. Os reinos humanos que sobreviveram às guerras internas foram os que aprenderam mais rápido. Nas Guerras Vermelhas, os Humanos foram os que mais sofreram nos primeiros meses — suas cidades costeiras foram as primeiras a cair para os Infernais. E foram também os que lideraram as negociações de paz, porque haviam aprendido, gerações antes, que construir sobre ruínas é construir sobre areia.",
    ],
    figuras: [
      "Mira Filha-de-Ninguém — Uma dos Dez Heróis que fundaram o Grande Conselho. Filha de um reino que se expandiu sobre territórios florestais durante as guerras, cresceu sabendo exatamente o que havia sido feito para aquela terra ficar disponível. Carregava esse peso com honestidade brutal. Foi ela quem convenceu os líderes humanos mais pragmáticos de que a estabilidade que os Humanos precisavam para prosperar exigia vizinhos — não inimigos, não súditos. Seu nome está numa rua do maior centro comercial do Continente Ancestral.",
      "Kael das Planícies Abertas — Um dos Dez Heróis. Guerreiro que combateu em três guerras antes dos trinta anos e chegou à conclusão, com a simplicidade de quem calcula perdas, de que havia menos inimigos no mundo do que lhe disseram. Tornou-se perigoso para quem queria que as guerras continuassem — que é exatamente o tipo de pessoa que você quer do seu lado quando está tentando terminá-las. Suas táticas de identificar e desmontar manipulação política são estudadas no Instituto Real.",
      "Rei Aldric Voz-das-Chamas (histórico, Infernal) — Mencionado em textos humanos como o exemplo do que acontece quando capacidade genuína se combina com certeza inabalável de que se tem razão. Os Humanos, que passaram séculos vendo seus próprios reis cometer os mesmos erros, usam sua história como advertência.",
    ],
    caracteristicas: [
      'Os Humanos não possuem uma afinidade natural tão marcante quanto a dos Elfos, a resistência dos Anões ou o poder ancestral dos Draconatos. Ainda assim, poucos estudiosos consideram isso uma desvantagem. A verdadeira característica humana sempre foi a capacidade de aprender com aqueles ao seu redor.',
      'Ao longo da história, os Humanos dominaram artes marciais criadas por Anões, estudaram magia desenvolvida por Elfos, negociaram com Feéricos, exploraram terras habitadas por Faunos e lutaram ao lado de praticamente todas as raças conhecidas. Sua maior qualidade é justamente não possuir um único caminho predeterminado.',
      'Essa versatilidade faz dos Humanos um dos povos mais imprevisíveis do mundo. Eles podem se tornar qualquer coisa. Heróis, conquistadores, estudiosos, governantes, mercadores ou aventureiros. Em muitos casos, tornam-se várias dessas coisas ao longo da mesma vida.'
    ],
    longevidade: [
      'Os Humanos possuem uma expectativa de vida relativamente curta quando comparados à maioria das outras raças, vivendo normalmente entre sessenta e cem anos.',
      'Essa brevidade moldou profundamente sua forma de enxergar o mundo. Enquanto outras raças podem passar décadas refletindo sobre uma decisão, os Humanos frequentemente precisam agir enquanto ainda possuem tempo para ver os resultados de suas escolhas.',
      'Essa urgência produz tanto grandes feitos quanto grandes erros. Reinos são construídos em poucas gerações, tecnologias se espalham rapidamente e mudanças culturais acontecem em um ritmo que outras raças frequentemente consideram difícil de acompanhar.'
    ],
    clas: [
      'Os Humanos raramente organizam suas sociedades em clãs. Sua estrutura social é construída principalmente através de famílias, guildas, casas nobres, ordens militares, instituições religiosas e alianças políticas. Algumas famílias acumulam influência por gerações, enquanto outras desaparecem em poucas décadas. Essa constante transformação faz parte da natureza humana. Poucos povos reinventam suas próprias estruturas sociais com tanta frequência.',
      'Nas grandes cidades humanas, é comum encontrar indivíduos de diversas origens vivendo lado a lado. Essa capacidade de integrar culturas diferentes ajudou a transformar os reinos humanos nos maiores centros comerciais e diplomáticos do Continente Ancestral.',
      'Embora valorizem suas famílias, os Humanos geralmente acreditam que o destino de uma pessoa deve ser definido por suas próprias escolhas, não apenas por sua origem.'
    ],
    nomes: [
      "Os nomes humanos variam enormemente entre regiões, culturas e tradições. Alguns povos valorizam linhagens antigas e sobrenomes nobres; outros dão mais importância às realizações individuais.",
      "Por estarem espalhados por praticamente todo o mundo conhecido, não existe um padrão universal para nomes humanos. Um mercador costeiro, um guerreiro das planícies e um estudioso das grandes cidades podem seguir tradições completamente diferentes.",
      "Ainda assim, os Humanos tendem a valorizar histórias familiares, preservando memórias de ancestrais, fundadores de cidades, exploradores e heróis locais.",
      "Nomes Masculinos: Kael, Aldric, Rafael, Victor, Henrique, Arthur, Gabriel",
      "Nomes Femininos: Mira, Helena, Beatriz, Sofia, Valéria, Camila, Isabela, Elisa, Catarina, Juliana",
      "Nomes de Família: Filha-de-Ninguém, Das Planícies Abertas, Monteclaro, Valeforte e Costa Dourada",
    ],
  },
  "Híbrido": {
    intro: [
      "Os Híbridos são filhos de dois mundos — pessoas nascidas da união entre raças diferentes, portando em si duas heranças que o mundo por muito tempo não sabia como classificar. Com a expansão dos reinos híbridos no Continente Ancestral após o Grande Conselho, os Híbridos deixaram de ser raridades curiosas e tornaram-se uma presença constante nas planícies, nas rotas de comércio e nas cidades de encruzilhada.",
      "Não existe \"aparência de Híbrido.\" Um Híbrido filho de Elfo e Humano terá orelhas levemente pontudas numa face inconfundivelmente mortal. Um filho de Anão e Fauno terá a robustez da rocha com instintos predatórios que não deveriam coexistir. Cada Híbrido é único — o que significa que cada Híbrido passou algum tempo da vida descobrindo quem é numa cultura que tem expectativas bem-definidas para cada raça separada.",
    ],
    cultura: [
      "Os Híbridos não têm uma cultura própria centralizada — são a prova de que culturas se encontram. Nas cidades híbridas do Continente Ancestral, são frequentemente os melhores diplomatas, os comerciantes mais eficazes em regiões de fronteira, os que conseguem sentar nas mesmas mesas que outras raças evitam umas às outras.",
      "O que os une não é origem comum, mas uma experiência compartilhada: crescer pertencendo completamente a nenhum lugar e parcialmente a todos os lugares. Há uma solidariedade não-declarada entre Híbridos que outros povos às vezes chamam de \"a cumplicidade dos que entendem\".",
    ],
    historia: [
      "Os primeiros Híbridos são anteriores ao Grande Conselho — sempre houve encontros entre raças — mas durante as guerras eram vistos com desconfiança pelas comunidades de ambos os lados. A abertura trazida pelo Grande Conselho mudou isso gradualmente.",
      "As gerações que cresceram nos reinos híbridos desenvolveram identidades que não eram nem de um pai nem de outro, mas algo específico e próprio. Aren Duplo-Sangue, o primeiro representante Híbrido no Grande Conselho, fez seu discurso de apresentação dizendo que não estava ali para representar os Elfos nem os Humanos — estava ali para representar o argumento de que raça é o ponto de partida de uma pessoa, não o limite.",
      "O Instituto Real tem um número crescente de alunos Híbridos, precisamente porque o cruzamento de tradições mágicas — a Afinidade Arcânica Élfica encontrando o pragmatismo humano, ou a Resistência de Pedra Anã encontrando o Instinto Predatório Fauno — produz combinações que os professores encontram genuinamente surpreendentes.",
    ],
    figuras: [
      "Aren Duplo-Sangue — Filho de mãe Humana e pai Elfo, nascido num reino híbrido das planícies. Primeiro representante Híbrido formalmente reconhecido no Grande Conselho. Não chegou lá por herança — chegou porque era excepcionalmente bom em fazer pessoas que discordavam fundamentalmente ficarem na mesma sala tempo suficiente para começar a escutar umas às outras.",
      "Os Filhos das Encruzilhadas (coletivo informal) — Nome dado por estudiosos do Instituto Real aos Híbridos que, ao longo das últimas gerações, têm ocupado posições de mediação em disputas inter-raciais. Não é uma organização formal — é um padrão que os arquivos do Instituto identificaram: Híbridos são, estatisticamente, mais presentes em resoluções de conflito do que qualquer raça pura individualmente.",
    ],
    caracteristicas: [
      'Os Híbridos são a manifestação viva de um mundo que aprendeu, ainda que lentamente, a conviver consigo mesmo. Cada indivíduo carrega duas heranças distintas, duas histórias ancestrais e, muitas vezes, duas formas diferentes de enxergar a realidade.',
      'Fisicamente, não existe um padrão universal para os Híbridos. Alguns se parecem claramente com uma de suas raças de origem, apresentando apenas traços sutis da outra. Outros exibem uma mistura evidente de ambas as linhagens, tornando impossível classificá-los à primeira vista.',
      'Essa diversidade faz com que muitos estudiosos considerem os Híbridos a raça mais variável do mundo conhecido. Nenhuma outra apresenta tamanha diversidade de aparência, temperamento, habilidades ou aptidões naturais. Se existe algo compartilhado por todos eles, é a capacidade de enxergar mais de uma perspectiva ao mesmo tempo.'
    ],
    longevidade: [
      'A longevidade dos Híbridos varia de acordo com suas linhagens de origem. Na maioria dos casos, sua expectativa de vida situa-se entre as duas heranças que carregam, embora existam exceções registradas nos arquivos do Instituto Real.',
      'Filhos de povos longevos costumam viver séculos. Filhos de raças mais breves geralmente mantêm expectativas de vida mais próximas de seus ancestrais mortais.',
      'Essa incerteza cria uma relação peculiar com o futuro. Muitos Híbridos crescem sem saber exatamente qual herança prevalecerá em seus corpos, aprendendo desde cedo a valorizar tanto o presente quanto as possibilidades do amanhã.'
    ],
    clas: [
      'Os Híbridos raramente formam clãs ou estruturas próprias baseadas em sangue. Em vez disso, costumam crescer integrados às culturas de suas famílias ou dentro dos reinos híbridos que surgiram após o Grande Conselho.',
      'Nas grandes cidades multiculturais, comunidades híbridas surgiram naturalmente ao longo das gerações. Não são unidas por raça, mas por experiências compartilhadas, desafios semelhantes e pela necessidade de criar espaços onde não precisem escolher entre uma herança ou outra.',
      'Muitos Híbridos tornam-se diplomatas, comerciantes, estudiosos ou exploradores. Não porque estejam destinados a isso, mas porque aprenderam desde cedo a transitar entre diferentes culturas, idiomas e formas de pensar.',
      'Talvez por isso sejam frequentemente chamados de Filhos das Encruzilhadas: não pertencem a um único caminho, mas ao ponto onde vários caminhos se encontram.'
    ],
    nomes: [
      "Os nomes dos Híbridos refletem a enorme diversidade de suas origens. Alguns recebem nomes tradicionais de uma das famílias. Outros combinam tradições de ambas as linhagens ou adotam nomes inteiramente novos.",
      "A linhagem possui importância cultural, mas raramente define a identidade de um Híbrido da mesma forma que ocorre entre Anões, Elfos ou Draconatos. Muitos preferem ser reconhecidos pelos próprios feitos em vez das heranças que carregam.",
      "Nomes Masculinos: Aren, Kaelen, Thoren, Vaelor, Darius, Rowan, Eryk, Lucan, Tavien, Orion",
      "Nomes Femininos: Lyra, Elara, Mira, Sylva, Kaelya, Arwen, Valina, Seris, Nerya, Alina",
      "Nomes de Família: Duplo-Sangue, Das Duas Luas, Filho das Encruzilhadas, Ponte de Ferro, Voz dos Dois Povos",
    ],
  },
  "Infernal": {
    intro: [
      "Os Infernais são os descendentes dos sobreviventes de Ignareth — o continente que foi destruído quando seus próprios estudiosos tentaram canalizar o Negativo. Reconhecíveis pelo tom de pele que vai do cobre queimado ao vermelho de brasa, pelos olhos que em momentos de emoção intensa exibem um reflexo âmbar como chama interna, e por um calor que emana do corpo mesmo no frio mais severo, os Infernais carregam no sangue a herança de um povo que foi o mais poderoso do mundo e que, por sua própria mão, perdeu tudo. O orgulho que os definia virou vergonha coletiva ao longo das gerações. Então virou algo mais difícil de nomear: a consciência de que o orgulho não era errado em si — era o que foi feito com ele que destruiu um continente.",
      "Os Infernais de hoje são mais raros do que deveriam ser. Vivem nos dois continentes, frequentemente em comunidades pequenas ou integrados a reinos híbridos, raramente anunciando sua origem. Alguns tentam manter tradições de Ignareth. Outros preferiram esquecer completamente. Entre esses extremos vivem a maioria deles — pessoas que carregam uma herança que não escolheram e tentam descobrir o que fazer com ela.",
    ],
    cultura: [
      "A cultura Infernal pré-desastre era centrada em hierarquia, honra de título e devoção ao fogo como identidade coletiva. Pós-desastre, a hierarquia desapareceu com as cidades que a sustentavam. O que sobrou foi a lealdade familiar — extrema, quase incondicional — porque a família é o que resta quando um reino desaparece. O fogo ainda é sagrado para os Infernais, mas de uma forma diferente de antes.",
      "Antes, reverenciavam o fogo como emblema de grandeza. Agora, os que ainda mantêm a devoção o fazem com a honestidade de quem sabe o que o fogo pode destruir — e por isso respeita genuinamente o que aquece. Em Terra Devastadas, há rumores de comunidades Infernais que nunca saíram — que ficaram nas ruínas do que foi Ignareth, guardando os templos que ainda estão de pé e recusando qualquer abandono definitivo. Se esses rumores são verdadeiros, essas comunidades sobrevivem em condições que a maioria dos povos não conseguiria suportar.",
    ],
    historia: [
      "Os Infernais dominaram Ignareth por séculos antes do desastre — um continente inteiro sob um único reino com cidades que não tinham nada a invejar das maiores de Solveran. A influência do Espelho Dourado sobre eles não era anomalia: era o resultado de séculos de uma cultura que havia aprendido a ver o fogo não como entidade, mas como troféu, não como presença, mas como prova.",
      "As Guerras Vermelhas foram o ponto em que o orgulho coletivo encontrou a manipulação de Veryn e produziu uma invasão que quase destruiu o Continente Ancestral. O que destruiu os Infernais no final foi diferente e mais definitivo: a tentativa de usar o Negativo como arma. A Duquesa Cariza das Piras Eternas — a maior general de Ignareth — sobreviveu no domínio da Dama de Vermelho e viveu para ver os últimos grupos organizados tentarem e falharem em manter alguma coisa que parecesse o reino que haviam perdido. No final, deixou de usar o título. Não havia mais piras para guardar.",
    ],
    figuras: [
      "Rei Valdrak Chama-Imortal (histórico, caído) — O rei que acreditou em Veryn. Não era tolo — era um homem capaz que havia sido criado numa cultura que lhe dizia que capacidade somada a nascimento significava destino. A tragédia dele é o tipo que o Instituto usa para discutir como pessoas inteligentes fazem coisas terríveis quando estão certas de ter razão.",
      "Duquesa Cariza das Piras Eternas (sobrevivente) — A maior general que Ignareth produziu em três gerações. Sobreviveu no domínio da Dama de Vermelho. Tentou manter o povo Infernal unido depois do desastre e viu essa tentativa fracassar. Em seu último discurso registrado, com duzentas pessoas — o maior grupo de Infernais que ainda se reunia — disse que não havia mais piras para guardar e desapareceu dos registros. Figura de referência para Infernais que tentam entender o que significa carregar uma herança de derrota.",
      "Lysa das Cinzas Brancas (destino incerto) — A estudiosa que descobriu os fragmentos do Negativo sob Ignareth, documentou o perigo, advertiu que não havia aplicação militar segura, e não foi ouvida. Seu nome está nos documentos de pesquisa nos arquivos da capital de Ignareth — intactos, cercados por vazio, esperando que alguém os leia. Para os Infernais, é a figura que representa o que o orgulho coletivo custou: a voz que disse a verdade na hora certa e foi arquivada por inconveniência.",
    ],
    caracteristicas: [
      'Os Infernais carregam em seus corpos as marcas de uma história que nenhum outro povo compartilha. O calor que emana de sua pele, o brilho âmbar que surge em seus olhos durante emoções intensas e a resistência natural às chamas são vestígios de uma herança forjada em Ignareth antes de sua queda.',
      'Ao contrário do que muitos acreditam, os Infernais não possuem qualquer ligação natural com demônios ou entidades malignas. Seu nome não deriva de corrupção, mas da associação histórica com o fogo, com as terras devastadas de Ignareth e com o desastre que redefiniu seu povo para sempre.',
      'Muitos carregam um profundo senso de responsabilidade histórica. Crescem ouvindo histórias sobre um continente perdido, sobre erros que jamais devem ser repetidos e sobre a importância de reconhecer os limites do próprio poder. Para alguns, isso gera humildade. Para outros, uma determinação feroz de provar que não são definidos pelos pecados dos antepassados.'
    ],
    longevidade: [
      'Os Infernais vivem normalmente entre cento e cinquenta e duzentos anos. Essa longevidade intermediária lhes permite acumular experiência sem desenvolver a distância emocional que frequentemente caracteriza os povos mais antigos.',
      'Poucos Infernais esquecem sua história. Mesmo aqueles nascidos longe das ruínas de Ignareth costumam crescer ouvindo relatos transmitidos por pais, avós e anciões que preservam memórias de um povo que perdeu um continente inteiro.',
      'Essa relação constante com o passado faz com que muitos Infernais desenvolvam uma visão intensa da vida. Eles valorizam conquistas duradouras, mas compreendem melhor do que a maioria o quão rapidamente tudo pode ser perdido.'
    ],
    clas: [
      'Após a destruição de Ignareth, os grandes títulos, castelos e estruturas de poder desapareceram. O que restou foram as famílias.',
      'Por essa razão, os laços familiares ocupam uma posição central na cultura infernal moderna. Muitas comunidades sobrevivem graças à cooperação entre parentes próximos e à preservação de tradições transmitidas por gerações.',
      'Algumas famílias mantêm registros detalhados sobre sua origem em Ignareth. Outras preferem abandonar completamente o passado e construir novas identidades longe das ruínas do continente perdido.',
      'Embora não existam mais grandes casas governantes, certos sobrenomes ainda despertam respeito ou desconforto entre os próprios Infernais. Alguns representam heróis que tentaram impedir a catástrofe. Outros carregam a memória daqueles que ajudaram a provocá-la.'
    ],
    nomes: [
      "Os nomes infernais preservam ecos da antiga nobreza de Ignareth. Muitos sobrenomes atuais descendem diretamente de casas, legiões, títulos militares ou famílias que sobreviveram ao desastre.",
      "A linhagem possui grande importância cultural. Não como símbolo de superioridade, mas como responsabilidade. Saber quem foram seus ancestrais significa compreender quais escolhas os trouxeram até o presente.",
      "Nomes Masculinos: Valdrak, Kaelor, Darius, Malvek, Rhaegor, Theren, Varkos, Auron, Lucien, Cassian",
      "Nomes Femininos: Cariza, Lysa, Valeria, Seraphine, Nyra, Evelyn, Kaelys, Auria, Selene, Verena",
      "Nomes de Família: Chama-Imortal, Das Piras Eternas, Das Cinzas Brancas, Brasa Rubra, Fogo Ancestral",
    ],
  },
  "Maculado": {
    intro: [
      "Os Maculados são seres que existem entre estados — nem completamente vivos pela definição comum, nem mortos pelo que isso significa. De pele marcada por padrões brancos sem textura nem temperatura, olhos que carregam algo mais profundo que observação e uma longevidade que o tempo não explica completamente, os Maculados são o único povo cuja origem não é racial, mas histórica: foram feitos, não nasceram.",
      "O que os consome não é o tempo — é a luz direta do sol, que conflita com a ausência inscrita neles. E é o peso de existir indefinidamente num mundo que continua mudando ao redor, carregando a memória de tudo que viram.",
    ],
    cultura: [
      "Não existe uma sociedade Maculada unificada. Alguns vivem isolados, acumulando conhecimento ao longo de séculos. Outros se integram em sociedades mortais, conscientes de que vão sobreviver às amizades que fazem. Quando formam grupos, criam vínculos extraordinariamente profundos — porque sabem o que significa ter alguém que escolhe estar presente quando poderia não estar.",
      "Nas grandes cidades do Continente Ancestral, os Maculados são mais comuns do que pareciam ser nas gerações anteriores. O estigma ainda existe — especialmente nas regiões com memória viva das Guerras Vermelhas — mas diminuiu à medida que mais pessoas convivem com eles e percebem que as marcas não se propagam por contato.",
    ],
    historia: [
      "Os Maculados não existiam como povo antes de Porto Vermelho. Quando os acadêmicos de Ignareth tentaram canalizar o Negativo e o canal quebrou, a expansão de vazio que se liberou não apagou tudo que tocou. Na borda do alcance, onde o Negativo perdia força, havia pessoas — comerciantes, estivadores, marinheiros, famílias — que foram tocadas sem ser destruídas.",
      "O vazio marcou-os: deixou regiões de ausência impressas na pele, alterou sua relação com a mortalidade, criou neles um canal que o Negativo abriu, mas não atravessou completamente. Esses sobreviventes chegaram ao Continente Ancestral em navios que fugiam do desastre.",
      "Rhem das Marcas Brancas foi o primeiro registrado. Vieram sem explicação para o que eram, sem nome para o que carregavam, e foram recebidos com o medo que o desconhecido sempre gera.",
      "O toque do Negativo neles é hereditário: filhos de Maculados nascem com marcas menores, ecos do toque original impressos na linha vital. Ao longo de gerações, o que era acidente de história virou herança.",
    ],
    figuras: [
      "Rhem das Marcas Brancas — O primeiro Maculado registrado a chegar no Continente Ancestral. Estivador de Porto Vermelho que estava no porto quando a expansão começou, nadou até o navio mais próximo, chegou com as marcas cobrindo metade do braço esquerdo e uma memória fragmentada do que havia acontecido. Não soube explicar o que era. Ninguém soube. Seu testemunho, preservado num arquivo do Instituto Real, é o documento fundacional do que se sabe sobre a origem dos Maculados.",
      "Sark o Marcado — Um dos Dez Heróis. Errante que não pertencia a nenhum reino, nenhum clã, nenhuma lealdade de nome. As marcas que carregava documentavam décadas de conflitos em todos os territórios — não como guerreiro, mas como testemunha. Havia estado em lugares onde batalhas aconteceram antes que os generais chegassem para nomear a vitória, e havia ficado depois que os generais partiram. Era impossível abstrair sofrimento em estratégia enquanto Sark estava na sala.",
    ],
    caracteristicas: [
      'Os Maculados não nasceram de uma linhagem ancestral comum nem foram moldados por uma entidade primordial. Eles são consequência de um evento impossível de ser repetido e, talvez, impossível de ser compreendido por completo. Carregam em seus corpos a marca deixada pelo contato com o Negativo — uma ausência que não deveria existir em seres vivos.',
      'As marcas brancas que percorrem sua pele não são cicatrizes, tatuagens ou deformidades. São regiões onde algo foi removido da realidade de forma tão profunda que nem mesmo o corpo consegue preencher completamente o vazio. Apesar da aparência inquietante, os Maculados continuam sendo pessoas comuns em quase todos os aspectos: amam, odeiam, constroem famílias, criam filhos e sonham com o futuro.',
      'O que os diferencia é a relação que possuem com o tempo e com a mortalidade. Muitos relatam uma sensação constante de observarem o mundo de uma pequena distância, como se uma parte de si permanecesse sempre à margem da realidade. Alguns aprendem a conviver com isso. Outros passam a vida tentando descobrir o que exatamente foi perdido quando seus ancestrais foram tocados pelo Negativo.'
    ],
    longevidade: [
      'Não existe consenso sobre quanto tempo um Maculado pode viver.',
      'Os primeiros registros surgiram após a destruição de Ignareth, mas alguns indivíduos presentes nos relatos mais antigos continuam vivos até os dias atuais sem demonstrar sinais claros de envelhecimento. Outros viveram vidas relativamente comuns, falecendo com idades semelhantes às de suas raças de origem.',
      'Essa inconsistência transformou a longevidade Maculada em um dos maiores mistérios estudados pelo Instituto Real. A teoria mais aceita sugere que o Negativo interrompeu parcialmente a relação dessas pessoas com o fluxo natural da vida e da morte, tornando cada caso único.'
    ],
    clas: [
      'Os Maculados raramente formam clãs ou organizações permanentes. Sua população é pequena, dispersa e espalhada entre praticamente todos os povos conhecidos.',
      'Quando se reúnem, geralmente o fazem por afinidade e não por sangue. Muitos grupos Maculados surgem em torno de estudiosos, viajantes, filósofos ou indivíduos particularmente antigos que acumulam séculos de experiências.',
      'Existe uma tradição informal entre eles conhecida como Vigília das Marcas. Quando dois Maculados se encontram, é comum compartilharem histórias de suas vidas antes de se despedirem. Para muitos, essas conversas possuem valor semelhante ao de registros históricos, pois a memória é uma das poucas coisas que o tempo ainda não conseguiu arrancar deles.'
    ],
    nomes: [
      "Os Maculados costumam manter os nomes e tradições das famílias das quais descendem. Um Maculado de origem Humana normalmente utiliza nomes humanos. Um descendente de Elfos ou Anões costuma preservar as convenções culturais de seus ancestrais.",
      "Com o passar das gerações, porém, algumas famílias passaram a adotar sobrenomes relacionados às marcas que carregam, transformando aquilo que antes era motivo de medo em símbolo de identidade.",
      "Nomes Masculinos: Rhem, Sark, Dorian, Kael, Varek, Lucien, Orin, Thalen, Cassian, Eldric",
      "Nomes Femininos: Lyra, Serah, Nyssa, Eveline, Aria, Maelis, Thessa, Alina, Veyra, Elira",
      "Nomes de Família: Das Marcas Brancas, Véu-Partido, Cinza-Pálida, Sem-Crepúsculo, Eco-Vazio, Limiar-Branco, Ausência Serena, Fragmento Perdido, Passo Silencioso, Além-da-Marca",
    ],
  },
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
          {lore[activeTab].map((p, i) => (
            <p key={i} className={styles.loreText}>{p}</p>
          ))}
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
