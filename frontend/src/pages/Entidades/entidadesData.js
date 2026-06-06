export const ENTITY_IMAGES = {
  'O Afogado':           '/img/Entidades/O%20Afogado.png',
  'O Rei das Montanhas':   '/img/Entidades/O%20Rei%20das%20Montanhas.png',
  'A Dama de Vermelho':  '/img/Entidades/A%20Dama%20de%20Vermelho.png',
  'O Andarilho':         '/img/Entidades/O%20Andarilho.png',
  'O Trovador':          '/img/Entidades/O%20Trovador.png',
  'O Primeiro Amanhecer':'/img/Entidades/O%20Primeiro%20Amanhecer.png',
  'O Senhor do Silêncio':  '/img/Entidades/O%20Senhor%20do%20Sil%C3%AAncio.png',
  'O Arquiteto Sem Face':'/img/Entidades/O%20Arquiteto%20Sem%20Face.png',
  'O Guardião do Tempo': '/img/Entidades/O%20Guardi%C3%A3o%20do%20Tempo.png',
  'A Tecelã':            '/img/Entidades/A%20Tecel%C3%A3.png',
  'O Espelho Dourado':   '/img/Entidades/O%20Espelho%20Dourado.png',
  'A Dama dos Desejos':  '/img/Entidades/A%20Dama%20dos%20Desejos.png',
  'O Mestre do Banquete':'/img/Entidades/O%20Mestre%20do%20Banquete.png',
  'O Ruivo':             '/img/Entidades/O%20Ruivo.png',
  'O Sonolento':         '/img/Entidades/O%20Sonolento.png',
  'O Mil Olhos':           '/img/Entidades/O%20Mil%20Olhos.png',
  'O Colecionador':      '/img/Entidades/O%20Colecionador.png',
}

export const ENTITY_LORE = {
  'O Afogado': {
    personalidade: 'Paciente e inevitável, O Afogado raramente age de forma impulsiva. Ele observa em silêncio, como algo escondido sob a superfície esperando o momento certo para puxar alguém para baixo. Sua crueldade não está na violência repentina, mas no desgaste lento: culpa, medo, arrependimento e desespero. Velhas histórias dizem que ele oferece falsas esperanças antes de consumir suas vítimas, permitindo que elas acreditem que escaparão até o último instante.',
    descricao: 'O Afogado não representa apenas o oceano, mas toda água profunda o bastante para esconder algo. Mares, rios escuros, lagos silenciosos, cavernas inundadas e regiões cobertas por neblina carregam sua presença. Dizem que ele habita qualquer lugar onde algo tenha sido perdido e jamais encontrado novamente. Para muitos povos costeiros, a água não é apenas um elemento natural, mas uma porta para aquilo que o mundo tenta esquecer.\n\nAlguns afirmam ter visto um velho capitão envolto por correntes e mantos encharcados caminhando sobre águas rasas. Outros descrevem apenas olhos azulados observando nas profundezas. Há relatos onde ele surge como uma figura encapuzada parada na margem durante tempestades, enquanto em outras histórias ele jamais é visto diretamente — apenas sentido pela névoa fria e pelo som distante de correntes arrastando sob a água.\n\nMarinheiros acreditam que O Afogado caça aqueles consumidos pela culpa ou arrogância. Existe uma crença antiga de que toda água profunda pertence parcialmente a ele. E que, quando alguém desaparece sem deixar rastros, talvez não tenha morrido. Talvez apenas tenha sido levado para o fundo.',
    dominio: {
      nome: 'O Mar Sem Horizonte',
      desc: 'Um oceano infinito mergulhado em noite eterna. O céu permanece limpo, tomado por incontáveis estrelas refletidas sobre águas absurdamente calmas. No centro navega um antigo navio de madeira escurecida — sem tripulantes, sem velas tremulando, navegando lentamente sobre as águas imóveis. Sob o casco, incontáveis silhuetas afundadas deslizam pelas profundezas como corpos carregados pela correnteza.\n\nO ambiente é tomado por uma quantidade absurda de mana. Muitos magos descrevem a sensação de estar ali como mergulhar a mente em um oceano mágico profundo demais para ser compreendido. Mas permanecer por tempo demais é perigoso — o silêncio constante faz pensamentos afundarem, memórias desaparecem e surge uma vontade crescente de simplesmente cair no mar escuro.',
    },
    graca: {
      nome: 'Maré Arcana',
      desc: 'Recupera 1d4 PM no início de cada turno enquanto estiver em combate ativo. Além disso, o ganho adicional de mana durante descansos aumenta o valor da recuperação padrão mais bônus o valor da Presença.',
    },
    requisito: 'Ao menos 3 magias do elemento Água (iniciais aprimoradas ao nível Elite ou superior; Antigas ao nível Maior ou superior). Possuir perícia Tenacidade ou Vontade em nível Básico (+2).',
    frase: '"O Capitão sempre recebe antes da viagem começar."',
  },

  'O Rei das Montanhas': {
    personalidade: 'Antigo além da compreensão mortal, o Rei das Montanhas é severo, imóvel e impossível de apressar. Ele não sente compaixão nem crueldade; apenas existe como algo eterno observando civilizações nascerem e desaparecerem. Tudo muda, tudo morre, tudo é esquecido — menos ele. Algumas lendas afirmam que jamais pronuncia palavras, pois não existe necessidade para alguém que já viu incontáveis eras passarem.',
    descricao: 'O Rei das Montanhas representa a permanência absoluta. Não apenas a pedra e as montanhas, mas tudo aquilo que permanece mesmo após eras incontáveis. Ruínas esquecidas, cidades soterradas, trilhas apagadas pelo tempo existem sob seu domínio silencioso. Para muitos povos antigos, as montanhas não nasceram naturalmente — seriam partes adormecidas de seu corpo colossal emergindo do mundo.\n\nExistem incontáveis altares erguidos em cavernas representando sua imagem: um gigante colossal sentado sobre um trono de pedra, tão grandes que preenchem salões subterrâneos inteiros. Em certas ruínas, muitas dessas imagens não parecem ter sido esculpidas, mas descobertas já prontas dentro da própria rocha.\n\nSua aparência é a de um gigante ancestral formado por rochas rachadas, minerais luminosos e pedra escurecida pelo tempo. Partes de seu corpo lembram ruínas fossilizadas, como se cidades inteiras tivessem sido engolidas e incorporadas à sua estrutura ao longo das eras.',
    dominio: {
      nome: 'O Trono Sob a Montanha',
      desc: 'Um salão colossal tão vasto que o teto desaparece na escuridão. Gigantescas estátuas de pedra se erguem dos dois lados, cobertas por inscrições na antiga língua dos Gigantes. No final do salão repousa o trono de pedra negra e minerais verde-esmeralda, tão grande que parece feito para uma montanha sentar-se sobre ele.\n\nSentado ali permanece o Rei das Montanhas, imóvel e silencioso, parcialmente fundido ao próprio trono. Seus olhos brilham em verde-esmeralda profundo. Quando fala, sua voz ecoa pelo salão como pedras deslizando lentamente umas sobre as outras — pesada, antiga, calmamente esmagadora.',
    },
    graca: {
      nome: 'Coroa do Rei',
      desc: 'Manifesta uma coroa de pedra invisível para todos exceto seu portador. Concede +2 de Defesa e Barreira Arcana: absorve +10 de dano mágico uma vez por combate.',
    },
    requisito: 'Ao menos 3 magias do elemento Terra (iniciais aprimoradas ao nível Elite ou superior; Antigas ao nível Maior ou superior). Possuir Vitalidade pelo menos +2.',
    frase: '"O Rei coroa apenas aquele que já provou suportar o peso do mundo."',
  },

  'A Dama de Vermelho': {
    personalidade: 'Impulsiva, intensa e absolutamente sincera, a Dama de Vermelho despreza tudo aquilo que permanece imóvel por tempo demais. Ela vê estagnação como uma forma lenta de morte. Suas emoções são violentas e transparentes, mudando como as próprias chamas. Pode demonstrar calor e fascínio em um instante, apenas para se tornar devastadora no momento seguinte. Seus seguidores acreditam que ela jamais mente, porque o fogo nunca esconde sua verdadeira natureza.',
    descricao: 'A Dama de Vermelho não representa apenas incêndios ou destruição, mas a natureza inevitável da transformação. O fogo que aquece também consome, a chama que ilumina também reduz tudo a cinzas. Ela existe em vulcões, fogueiras, cidades queimando, paixões intensas e desejos impossíveis de controlar.\n\nEla normalmente assume a forma de uma mulher extremamente bela, quase impossível de ser ignorada. Sua pele é branca como porcelana iluminada pelo brilho de brasas, criando um contraste intenso com seus longos cabelos vermelhos que se movem como fogo vivo. Ela veste um longo vestido vermelho formado por tecidos finos misturados a chamas vivas que nunca se apagam.\n\nSeus seguidores acreditam que as chamas libertam o mundo de sua podridão. Para eles, destruir não significa acabar com algo, mas abrir espaço para que outra coisa nasça.',
    dominio: {
      nome: 'O Jardim das Cinzas',
      desc: 'Um mundo consumido eternamente pelas chamas. Não há céu verdadeiro — apenas nuvens escuras cortadas por incêndios distantes e rios de magma. No centro ergue-se um castelo colossal de pedra negra rachada pelo calor. Mesmo os jardins queimam: árvores carbonizadas continuam vivas, flores vermelhas surgem entre brasas, estátuas derretidas deformam-se lentamente.\n\nO calor é quase insuportável para criaturas mortais. Mas existe algo perigosamente belo naquele lugar. As chamas dançam como seda viva. As cinzas brilham como estrelas apagadas. Muitos visitantes descrevem o desejo crescente de deixar tudo para trás e permitir que o fogo consuma aquilo que ainda dói dentro deles.',
    },
    graca: {
      nome: 'Manto Vermelho',
      desc: 'Usando uma Ação Livre, um manto de fogo surge ao redor do conjurador durante 5 rodadas. O usuário torna-se Imune a Dano de Fogo. Criaturas adjacentes recebem 1d8 de dano de fogo no início de cada turno (salvaguarda de Reflexo = metade). Utilizável uma vez por Descanso Longo.',
    },
    requisito: 'Ao menos 3 magias do elemento Fogo (iniciais aprimoradas ao nível Elite ou superior; Antigas ao nível Maior ou superior). Possuir Presença pelo menos +2.',
    frase: '"Tudo que arde intensamente deixa cinzas para trás."',
  },

  'O Andarilho': {
    personalidade: 'O Andarilho é inquieto, curioso e impossível de compreender completamente. Pode surgir como uma presença gentil guiando viajantes perdidos, mas também pode trazer destruição repentina como ventos violentos. Ele raramente demonstra malícia direta. Em algumas histórias ajuda pessoas sem motivo aparente. Em outras, conduz homens para caminhos sem volta apenas porque desejava ver até onde chegariam. O Andarilho odeia aprisionamento.',
    descricao: 'O Andarilho representa aquilo que jamais permanece no mesmo lugar. Ele existe nos ventos frios antes de tempestades, nas estradas esquecidas, nas folhas carregadas pelo ar e nos caminhos que surgem sem explicação diante de viajantes perdidos.\n\nEle raramente possui uma única forma fixa. Em muitas histórias surge como um jovem de aparência livre, usando roupas simples e gastas pelo tempo que se movem mesmo quando não existe vento. Outros relatos descrevem um velho andarilho de cabelos longos caminhando por estradas vazias. Também existem histórias sobre uma mulher extremamente bela surgindo entre neblinas, seus cabelos dançando como fumaça ao vento.\n\nIndependentemente da forma, existe algo em comum em todos os relatos: O Andarilho jamais permanece por muito tempo. Ele surge como o vento. E desaparece da mesma forma.',
    dominio: {
      nome: 'A Encruzilhada Sem Fim',
      desc: 'Uma estrada infinita perdida entre realidades que nunca permanecem iguais. No centro existe uma grande encruzilhada onde o Andarilho costuma esperar — às vezes como jovem sorridente, outras como ancião silencioso, outras como mulher envolta por névoa. Enquanto fala, sua aparência muda, vozes se misturam e rostos trocam.\n\nCada estrada leva para paisagens diferentes: desertos dourados, florestas impossíveis, cidades desconhecidas, mares suspensos no vazio. Nada permanece estável — montanhas mudam de lugar, estradas surgem onde antes havia vazio. Algumas dessas estradas parecem levar diretamente de volta para memórias esquecidas do próprio visitante.',
    },
    graca: {
      nome: 'Viajante',
      desc: 'O pactuado recebe permanentemente +3 metros de Movimento. Uma vez a cada descanso, durante combate, o usuário pode escolher receber: um Movimento adicional ou uma Reação adicional. Além disso, ignora terreno difícil natural.',
    },
    requisito: 'Ao menos 3 magias do elemento Vento (iniciais aprimoradas ao nível Elite ou superior; Antigas ao nível Maior ou superior). Possuir Destreza pelo menos +2.',
    frase: '"Nenhum viajante corre eternamente sem que a estrada cobre descanso."',
  },

  'O Trovador': {
    personalidade: 'O Trovador é intenso, energético e impossível de ignorar. Possui um carisma quase sobrenatural, atraindo olhares e emoções com facilidade, mas existe algo perigoso por trás de sua beleza. Assim como uma tempestade pode começar bela antes de se tornar devastadora, O Trovador alterna entre fascínio e destruição sem aviso. Seus seguidores acreditam que vidas comuns são desperdícios silenciosos, e que existir significa deixar marcas tão fortes quanto trovões rasgando o céu.',
    descricao: 'O Trovador representa o som da destruição antes dela acontecer. Ele existe no estrondo distante das tempestades, no brilho violento dos relâmpagos e na energia selvagem que antecede o caos. Seu domínio não está apenas nos raios, mas na sensação de tensão que toma o ar segundos antes da tempestade cair sobre o mundo.\n\nEle normalmente assume a forma de um homem extremamente belo e jovem, com aparência elegante e presença impossível de ignorar. Seus cabelos longos se movem como fumaça tempestuosa atravessada por pequenos clarões elétricos. Seus olhos são azul-claro quase cinza, brilhando como relâmpagos presos atrás das pupilas. Suas roupas lembram mantos escuros feitos de nuvens carregadas com detalhes luminosos semelhantes a veios de eletricidade.\n\nExiste uma antiga superstição: "Quando o céu canta, O Trovador está próximo." E quando ele está próximo, a tempestade sempre vem.',
    dominio: {
      nome: 'O Grande Teatro da Tempestade',
      desc: 'Um teatro colossal perdido em meio a uma tempestade eterna. Do lado de fora, relâmpagos atravessam o céu incessantemente. Ao entrar pelas enormes portas douradas, todo som externo desaparece. O teatro é grandioso, iluminado por lustres azulados que brilham como eletricidade viva. No palco, uma peça ocorre constantemente — a história muda conforme os visitantes presentes, assumindo formas diferentes para cada pessoa.\n\nNos momentos mais intensos da peça, trovões explodem pelo salão, relâmpagos cortam o teto. Permanecer ali é emocionalmente sufocante. Cada cena parece atingir diretamente pensamentos, medos e emoções escondidas.',
    },
    graca: {
      nome: 'Silêncio Antes da Tempestade',
      desc: 'Uma vez a cada descanso, ativado como Ação Livre. Durante 1 rodada, todas as criaturas hostis ao redor ficam incapazes de utilizar Magias. Após esse efeito terminar, o pactuado recebe +10 na rolagem de seu primeiro ataque físico ou mágico realizado até o final do próximo turno.',
    },
    requisito: 'Ao menos 3 magias do elemento Trovão (iniciais aprimoradas ao nível Elite ou superior; Antigas ao nível Maior ou superior). Possuir perícia Carisma ou Enganação em nível Básico (+2).',
    frase: '"Após o trovão… até o mundo precisa de silêncio."',
  },

  'O Primeiro Amanhecer': {
    personalidade: 'Gentil, acolhedora e profundamente compassiva, O Primeiro Amanhecer transmite uma sensação de conforto impossível de explicar. Sua presença aquece não apenas o corpo, mas também a mente e o espírito. Entretanto, existe algo assustador por trás de sua compaixão. Quando decide preservar algo, torna-se absolutamente inflexível. Ela acredita que a existência deve continuar independentemente do custo.',
    descricao: 'O Primeiro Amanhecer representa o início de todas as coisas. Não apenas o nascer do sol, mas o primeiro respirar de uma vida, o despertar após a escuridão e a persistência da existência diante do fim. Muitos povos acreditam que toda luz no mundo é apenas um fragmento distante de seu brilho original.\n\nEla normalmente assume a forma de uma mulher de beleza sobrenatural, tão intensa que muitos têm dificuldade de olhar diretamente para ela. Seus longos cabelos dourados lembram os primeiros raios do sol atravessando o horizonte. Sua pele possui um brilho quente e delicado. Seus olhos carregam um brilho dourado intenso, profundo e acolhedor — mas também antigo e impossível de desafiar.\n\nExiste uma crença antiga: "Enquanto existir amanhecer, o mundo ainda não desistiu."',
    dominio: {
      nome: 'O Horizonte do Primeiro Sol',
      desc: 'Um penhasco silencioso acima de um oceano dourado imóvel. Não há noite naquele lugar. O sol permanece eternamente surgindo no horizonte, preso no exato instante do primeiro amanhecer da existência. O céu possui tons suaves de dourado, branco e laranja claro. No alto do penhasco existe um pequeno quiosque simples com uma mesa de duas cadeiras voltadas para o horizonte eterno.\n\nÉ ali que o Primeiro Amanhecer costuma permanecer, sentada calmamente observando o nascer do sol que jamais termina. Muitos visitantes sentem vontade de permanecer ali para sempre, como se naquele lugar toda dor parecesse distante.',
    },
    habilidades: ['Aurora Restauradora', 'Chama da Persistência', 'Último Amanhecer', 'Horizonte Dourado', 'Julgamento da Aurora', 'Amanhecer Eterno'],
  },

  'O Senhor do Silêncio': {
    personalidade: 'O Senhor dos Silêncios é sereno, paciente e inevitável. Ele não demonstra pressa, raiva ou alegria, pois compreende que tudo eventualmente chegará até ele. Sua presença transmite uma calma estranha e profundamente melancólica. Ele não vê a morte como tragédia, mas como parte natural da existência. Seus sacerdotes acreditam que temer a morte é uma corrupção causada pelo apego excessivo ao sofrimento do mundo material.',
    descricao: 'O Senhor dos Silêncios representa o fim inevitável de todas as coisas. Não apenas a morte do corpo, mas o descanso após o sofrimento, o silêncio depois do último suspiro e o esquecimento que lentamente apaga até mesmo os maiores nomes da história.\n\nEle normalmente assume a forma de um homem alto e extremamente belo, envolto por longos mantos negros adornados com delicados bordados dourados que lembram estrelas apagadas. Seus cabelos são longos, escuros e suaves como a própria noite. Seus olhos parecem profundos demais, carregando uma calma antiga e assustadoramente acolhedora.\n\nRelatos antigos afirmam que ele surge principalmente para pessoas próximas da morte, sentado ao lado de seus leitos ou observando em corredores vazios durante a madrugada. Existe uma crença antiga: "O silêncio não é vazio. É o lugar onde toda dor finalmente descansa."',
    dominio: {
      nome: 'O Vale do Último Descanso',
      desc: 'Um vale negro cercado por montanhas tão altas que seus topos desaparecem na escuridão. O firmamento é limpo e tomado por estrelas silenciosas. A entrada começa em uma praia de areia negra e fria. Um longo caminho atravessa o vale em direção a um gigantesco portal de pedra antiga coberto por símbolos dourados.\n\nDiante desse portal existe um altar com uma enorme balança dourada. O Senhor dos Silêncios permanece próximo dela aguardando em absoluto silêncio. Quando alguém entra, a balança desperta e mede não bondade ou maldade… mas o peso emocional carregado por aquela existência.',
    },
    habilidades: ['Toque do Silêncio', 'Descanso Misericordioso', 'Último Suspiro', 'Lanterna dos Mortos', 'Balança da Justiça', 'Caminho Final'],
  },

  'O Arquiteto Sem Face': {
    personalidade: 'O Arquiteto Sem Face é curioso, distante e eternamente insatisfeito. Nada do que cria parece suficiente para preencher o vazio dentro de sua mente infinita. Ele constantemente abandona projetos e altera aquilo que já existia apenas para observar possibilidades diferentes. Diferente de entidades que buscam controle ou adoração, ele parece mais interessado no ato de criar do que no resultado final.',
    descricao: 'O Arquiteto Sem Face representa a criação antes da forma, a ideia antes da existência e a imaginação antes da realidade. Tudo aquilo que nasce no mundo teria começado como um fragmento perdido dentro de sua mente eterna. Para muitos estudiosos, a realidade não passa de um grande projeto inacabado abandonado por ele eras atrás.\n\nEle normalmente assume a forma de um velho alto e magro coberto por roupas simples e antigas manchadas de tinta, carvão e poeira. Seu rosto nunca é visto completamente. Longos cabelos grisalhos e uma barba espessa escondem quase toda sua face. Ele está sempre desenhando, escrevendo ou construindo algo — pergaminhos surgem espalhados ao seu redor, cobertos por símbolos desconhecidos e projetos de coisas que não deveriam existir.\n\nExiste uma crença perturbadora: "Nada no mundo é original. Tudo já foi imaginado por ele antes."',
    dominio: {
      nome: 'A Biblioteca do Inacabado',
      desc: 'Uma gigantesca biblioteca de dois andares mergulhada em silêncio absoluto. Estantes infinitas carregam livros, pergaminhos, projetos e escritos impossíveis. Alguns livros flutuam lentamente. Outros escrevem a si mesmos. Certos pergaminhos parecem vivos, alterando palavras conforme são observados.\n\nNaquele domínio existe registro de tudo que já foi criado — e também de tudo que jamais chegou a existir. Idéias esquecidas. Canções nunca terminadas. Civilizações que poderiam ter nascido. No fundo, uma enorme mesa coberta por livros abertos e uma janela circular revelando diretamente o cosmos.',
    },
    habilidades: ['Ideia Materializada', 'Reescrever Estrutura', 'Biblioteca Perdida', 'Colapso Conceitual', 'Traço Arcano', 'Rascunho da Realidade'],
  },

  'O Guardião do Tempo': {
    personalidade: 'O Guardião do Tempo é calmo, distante e absolutamente inevitável. Diferente de entidades movidas por emoções intensas, ele raramente demonstra raiva, alegria ou tristeza. Seu olhar atravessa eras inteiras da mesma forma que mortais observam a mudança das estações. Ele não acelera nem atrasa nada por desejo pessoal. Tudo possui seu momento correto diante dele.',
    descricao: 'O Guardião do Tempo representa o fluxo inevitável da existência. Não apenas horas, dias ou eras, mas o movimento constante que conduz todas as coisas ao começo, à mudança e ao fim. Dizem que ele foi o primeiro a existir — antes dos mares, antes das montanhas, antes mesmo da luz tocar a escuridão.\n\nEle normalmente assume a forma de uma figura alta envolta por longos mantos escuros adornados com detalhes dourados semelhantes aos mecanismos internos de antigos relógios. Seu rosto é sereno e difícil de definir, como se estivesse constantemente mudando entre juventude e velhice. Seus olhos possuem brilho dourado profundo, semelhantes a ponteiros girando lentamente dentro das pupilas.\n\nAo redor dele, sons suaves de ponteiros e badaladas distantes podem ser ouvidos mesmo em completo silêncio. Segundos parecem durar minutos, enquanto horas desaparecem sem serem percebidas.',
    dominio: {
      nome: 'O Deserto das Últimas Horas',
      desc: 'Um deserto infinito onde o conceito de tempo assumiu forma física. A areia se espalha eternamente em todas as direções como um oceano de ouro pálido. Espalhados por todo o deserto flutuam incontáveis relógios — grandes, pequenos, antigos, quebrados, luxuosos. Entre eles também existem enormes ampulhetas suspensas no ar, despejando areia dourada eternamente.\n\nNo centro desse vazio existe um pequeno oásis silencioso com uma única árvore antiga e uma mesa coberta por relógios. Cada relógio possui um nome: mortais, reis, heróis, civilizações, até entidades antigas. Porque diante do tempo, até deuses possuem duração.',
    },
    habilidades: ['Acelerar', 'Vislumbre do Futuro', 'Eco Temporal', 'Relógio Quebrado', 'Segundo Roubado', 'Última Badalada'],
  },

  'A Tecelã': {
    personalidade: 'A Tecelã é silenciosa, paciente e profundamente misteriosa. Ela raramente interfere diretamente, mas parece surgir em momentos decisivos da existência mortal. Seus seguidores dizem que já viu incontáveis destinos se partirem e incontáveis civilizações desaparecerem sem jamais interromper seu trabalho. Ela não demonstra crueldade nem misericórdia. Apenas continua tecendo.',
    descricao: 'A Tecelã representa o destino, os caminhos da vida e as conexões invisíveis que unem todas as existências. Ela não controla completamente o destino como um tirano — em vez disso, tece possibilidades. Cada decisão cria novos caminhos, novos nós e novas rupturas dentro de sua obra infinita.\n\nEla normalmente assume a forma de uma velha de aparência simples, usando roupas humildes cobertas por linhas e tecidos. Suas mãos nunca param. Em alguns contos mais antigos e perturbadores, sua verdadeira forma é uma criatura gigantesca semelhante a uma aranha ancestral, coberta por fios dourados e infinitos olhos silenciosos observando através da escuridão.\n\nExiste uma superstição antiga: "Se a casa apareceu para você, algum fio da sua vida está prestes a se romper."',
    dominio: {
      nome: 'A Cabana na Floresta',
      desc: 'Uma pequena cabana antiga perdida no meio de uma floresta silenciosa. Ao entrar, o visitante encontra um ambiente iluminado por velas suaves. O interior é maior do que deveria ser. Fios percorrem absolutamente tudo — pendem do teto, desaparecem pelas paredes, atravessam o chão como raízes douradas. Cada fio vibra lentamente como se estivesse vivo, carregando emoções, memórias, encontros e possibilidades.\n\nAlguns visitantes percebem algo perturbador: alguns fios estão ligados diretamente a eles mesmos. Presos aos pulsos, ao peito, ao coração. E a Tecelã já parece conhecê-los antes mesmo de qualquer palavra ser dita.',
    },
    habilidades: ['Fio Compartilhado', 'Nó do Destino', 'Presságio', 'Romper Fio', 'Teia Invisível', 'Tapeçaria Infinita'],
  },

  'O Espelho Dourado': {
    personalidade: 'O Espelho Dourado é sedutor, elegante e insuportavelmente convencido. Sua presença domina ambientes sem esforço. Ele raramente demonstra raiva aberta — reage a afrontas com um desprezo frio e humilhante. Sua maior necessidade não é poder, destruição ou riqueza. É admiração. Cultos inteiros surgem ao seu redor porque ele compreende perfeitamente o desejo das pessoas: ser especial, amado, reconhecido e invejado.',
    descricao: 'O Espelho Dourado representa a obsessão pela própria imagem, a necessidade desesperada de reconhecimento e a corrupção causada pela adoração excessiva do ego. Ele existe em reis que acreditam serem deuses, em artistas consumidos pela própria fama e em qualquer alma que deseje ser admirada acima de tudo.\n\nEle não possui uma forma verdadeira fixa. Cada um o vê como uma versão distorcida e aperfeiçoada de si mesma — mais bela, mais imponente, mais admirável. Mas existe sempre algo profundamente errado: o sorriso arrogante demais, os olhos carregando desprezo demais, a expressão transmitindo superioridade absoluta.\n\nExiste uma crença perturbadora: olhar o próprio reflexo por tempo demais pode fazer algo olhar de volta. E sorrir.',
    dominio: {
      nome: 'O Mundo Espelhado',
      desc: 'Um mundo onde tudo parece refletido de maneira errada, distorcida e profundamente desconfortável. Cima e baixo parecem trocar de lugar. Corredores se dobram em ângulos impossíveis. Reflexos se movem antes das próprias pessoas. As vozes ecoam invertidas. Tudo naquele domínio provoca desconforto — distâncias mudam sem aviso, reflexos observam diretamente quem os encara.\n\nNo centro existe um enorme salão cercado por espelhos dourados gigantescos. É ali que o Espelho Dourado costuma surgir observando a si mesmo através de incontáveis reflexos diferentes. Nenhum deles é exatamente igual. E todos sorriam antes dele.',
    },
    graca: {
      nome: 'Reflexão Total',
      desc: 'Ação Livre. Qualquer ataque físico ou mágico recebido é refletido imediatamente contra seu atacante com o dobro da força original. Contra ataques múltiplos, escolhe apenas 1 para refletir por turno. Após a reflexão, o usuário deve consumir Mana equivalente ao dano refletido — caso não possua, o restante é pago diretamente com sua própria Vida.',
    },
    requisito: 'Possuir Presença pelo menos +3.',
  },

  'A Dama dos Desejos': {
    personalidade: 'A Dama dos Desejos é encantadora, íntima e perigosamente compreensiva. Ela sabe exatamente o que alguém quer ouvir, mesmo quando a própria pessoa não consegue admitir isso para si mesma. Ela não cria obsessões. Apenas transforma pequenos desejos em necessidades absolutas. E quanto mais alguém a segue, mais difícil se torna distinguir amor de dependência.',
    descricao: 'A Dama dos Desejos representa tudo aquilo que o coração deseja mesmo sabendo que não deveria. Ela existe na obsessão, na paixão impossível, no amor não correspondido e nos vícios emocionais. Para seus cultos, desejo não é fraqueza — é a força mais poderosa que existe.\n\nEla raramente possui uma forma verdadeira fixa. Normalmente aparece como aquilo que a pessoa mais deseja encontrar. Para alguns, surge como um amor perdido há muitos anos. Para outros, como alguém impossível de alcançar. Sua beleza nunca parece exagerada — simplesmente parece perfeita para quem a observa. Sua voz é suave, íntima e familiar, como alguém que conhece pensamentos que jamais foram revelados.\n\nExiste uma crença antiga: "A Dama dos Desejos nunca toma algo de você. Ela faz você entregar voluntariamente."',
    dominio: {
      nome: 'O Salão dos Desejos Vazios',
      desc: 'Um enorme salão semelhante a um antigo bordel decadente perdido fora da realidade. À primeira vista parece luxuoso e acolhedor: velas douradas, tecidos vermelhos, perfumes doces, músicas suaves. Mas quanto mais tempo alguém permanece ali, mais o encanto desaparece.\n\nO salão é habitado por figuras belas e perturbadoras ao mesmo tempo. Sorrisos largos demais, corpos distorcidos sob tecidos luxuosos, olhos vazios. Algumas criaturas parecem fundidas umas às outras após eternidades incapazes de se separar. O ambiente inteiro transmite uma sensação crescente de desejo doentio e dependência emocional sufocante.',
    },
    graca: {
      nome: 'Desejo Sombrio',
      desc: 'Ao final de cada descanso, rola 1d6 — o resultado determina quantas vezes poderá utilizar o poder. O usuário pode alterar o valor de qualquer dado rolado para outro resultado desejado. Custo: perde Vida igual a 2x o valor desejado e metade da Mana atual (mínimo 1). O custo é pago imediatamente após a alteração.',
    },
    requisito: 'Possuir perícia Persuasão ou Enganação em nível Básico (+2).',
  },

  'O Mestre do Banquete': {
    personalidade: 'O Mestre do Banquete é alegre, extravagante e grotescamente acolhedor. Diferente de entidades silenciosas ou ameaçadoras, ele ri alto, celebra excessos e trata tudo como uma grande festividade eterna. Sua presença transmite conforto imediato. Mas por trás de sua alegria existe algo profundamente perturbador — o Mestre do Banquete jamais fica satisfeito. Quanto mais consome, maior se torna sua fome.',
    descricao: 'O Mestre do Banquete representa o excesso sem limite, a fome que jamais desaparece e o vazio impossível de preencher. Ele existe na gula, no desperdício, nos vícios e na necessidade constante de consumir mais do que se precisa. Mas sua fome não se limita à comida — ele devora riquezas, emoções, prazeres, experiências e até o próprio tempo daqueles que o seguem.\n\nEle possui a forma de um gigante grotescamente inchado, coberto por roupas luxuosas rasgadas e adornos dourados manchados de gordura. Seu corpo é coberto por dezenas de bocas deformadas mastigando incessantemente sem jamais parar. Algumas riem enquanto comem. Outras choram. Mesmo assim, existe algo estranhamente carismático nele.\n\nExiste um antigo ditado proibido: "Ninguém sai da mesa do Mestre completamente inteiro."',
    dominio: {
      nome: 'O Salão da Fome Eterna',
      desc: 'Um gigantesco salão nobre iluminado por lustres dourados. Longas mesas cobertas por toalhas luxuosas atravessam o ambiente até desaparecerem no horizonte, todas repletas de comida, bebidas e sobremesas em quantidade absurda. Tudo parece perfeito. Carnes assadas ainda fumegam. Taças nunca esvaziam.\n\nMas existe algo profundamente errado. Alguns convidados continuam comendo mesmo após o próprio corpo começar a deformar. Outros possuem bocas demais. Ainda assim, todos continuam sorrindo. Regra do domínio: ninguém pode recusar comida — criaturas que permanecerem sem comer imediatamente perdem metade da própria Vida atual.',
    },
    graca: {
      nome: 'Banquete dos Fracos',
      desc: 'Como uma Ação Livre, restaura 50% da Vida e Mana instantaneamente. Também remove imediatamente a condição de morrendo. Após utilizar o poder, o pactuado recebe as condições Fadigado e Enfraquecido até um descanso. Durante a condição não poderá ativar novamente o poder.',
    },
    requisito: 'Possuir Vitalidade pelo menos +3 e Tenacidade e Vontade em nível Intermediário (+5).',
  },

  'O Ruivo': {
    personalidade: 'O Ruivo é agressivo, impulsivo e absurdamente fácil de provocar. Ele vive em estado constante de irritação, como alguém sempre esperando uma desculpa para começar uma briga. Mas por trás desse comportamento explosivo existe algo realmente perigoso: sua raiva é contagiosa. Pessoas próximas a ele começam lentamente a perder paciência, interpretar tudo como provocação e agir movidas pelo orgulho.',
    descricao: 'O Ruivo representa a raiva que cresce lentamente até explodir sem controle. Ele existe em ressentimentos guardados por anos, discussões que terminam em sangue, guerras iniciadas por orgulho e no prazer irracional encontrado dentro do conflito.\n\nEle possui a aparência de um anão largo, musculoso e absurdamente intimidador. Seu corpo é coberto por grossos pelos ruivos e desgrenhados. Sua pele possui um tom acinzentado marcado por cicatrizes e rachaduras escuras como carvão. Ele veste uma pesada armadura negra coberta por arranhões, amassados e manchas antigas de sangue seco. Seu rosto é agressivo — o nariz enorme em formato de batata domina boa parte da face, frequentemente vermelho como se estivesse constantemente irritado.\n\nExiste uma superstição antiga entre soldados: "Quando ninguém mais lembra por que a luta começou, O Ruivo já está sorrindo."',
    dominio: {
      nome: 'O Salão da Ira Rubra',
      desc: 'Um enorme salão vermelho construído em pedra escura rachada, iluminado apenas pelo brilho constante de brasas. O ar é pesado, quente e sufocante. As paredes são cobertas por marcas de batalha, rachaduras profundas e armas quebradas presas à pedra como troféus. Ecos distantes de gritos e aço colidindo ressoam continuamente.\n\nEspalhadas pelo domínio existem inúmeras estátuas do Ruivo, todas com posições diferentes mas todas parecem perigosamente vivas. No final do salão repousa um enorme trono negro. Criaturas presentes sofrem imediatamente a condição Enfurecido — pequenos incômodos se transformam em ódio absurdo.',
    },
    graca: {
      nome: 'Sentimentos de Fúria',
      desc: 'O usuário entra imediatamente na condição Enfurecido: todo ataque é considerado um Acerto Crítico e reduz todos dano sofrido pela metade. O pactuado deve atacar qualquer criatura visível, incluindo aliados, caso não existam inimigos disponíveis. O estado persiste até que o usuário fique Desacordado ou seja alvo de magia de cura capaz de estabilizar sua mente.',
    },
    requisito: 'Possuir Força pelo menos +3. Possuir perícia Luta ou Intimidação em nível Intermediário (+5).',
  },

  'O Sonolento': {
    personalidade: 'O Sonolento é lento, indiferente e assustadoramente apático. Diferente de entidades agressivas, ele raramente demonstra interesse direto em controlar alguma coisa. Sua simples presença faz tudo perder intensidade aos poucos. Esperança enfraquece. Ambições desaparecem. Conflitos deixam de importar. Ele não convence pessoas a desistirem — apenas torna continuar parecendo cansativo demais.',
    descricao: 'O Sonolento representa a estagnação que lentamente consome tudo aquilo que deixa de lutar para existir. Não é a destruição rápida causada por guerras, mas o abandono silencioso que transforma impérios em ruínas e sonhos em poeira esquecida.\n\nEle possui a forma de um enorme dragão negro coberto por escamas opacas semelhantes a pedra úmida. Grandes chifres de cristal azul emergem de sua cabeça e coluna, brilhando suavemente na escuridão. Uma névoa azulada escapa lentamente entre suas presas enquanto respira de maneira profunda e pesada. Seus olhos raramente se abrem — quando isso acontece, revelam um brilho azul profundo e vazio capaz de causar uma sensação imediata de exaustão.\n\nExiste uma antiga frase proibida: "Tudo dorme eventualmente." E aquilo que dorme por tempo demais começa lentamente a desaparecer.',
    dominio: {
      nome: 'O Sonho Imóvel',
      desc: 'Uma realidade onde o tempo parece próximo de parar completamente. Paisagens mudam lentamente como sonhos esquecidos misturando-se sem lógica definida. Montanhas flutuam acima de oceanos invertidos. Escadas sobem até céus impossíveis. Árvores crescem para baixo. As cores parecem suaves e desfocadas, como lembranças vistas através de olhos cansados. Até pensamentos parecem mais difíceis de completar.\n\nNo centro repousa o Sonolento, imóvel sobre enormes estruturas cristalinas azuladas. Criaturas que permanecem naquele domínio sofrem as condições Lentidão e Fadigado.',
    },
    graca: {
      nome: 'Fração de Segundos',
      desc: 'Enquanto ativa: o usuário sempre age antes da Iniciativa começar. Qualquer efeito, dano ou condição causado por outras criaturas só é aplicado após o início normal da iniciativa. Limitações: não pode usar Reações nem Ações Completas — apenas Ações Padrão e Ações de Movimento. Ativar ou desativar a habilidade durante descansos custa metade da Vida atual (mínimo 1), após as recuperações do descanso.',
    },
    requisito: 'Possuir perícia Sobrevivência em nível Básico (+2).',
  },

  'O Mil Olhos': {
    personalidade: 'Mil Olhos é paranoico, desconfiado e profundamente ressentido. Ele observa tudo constantemente, como alguém incapaz de suportar a ideia de estar perdendo algo que outra pessoa possui. Sua mente funciona através da comparação eterna. Sempre existe alguém mais amado, mais forte, mais belo — e isso o consome sem descanso. Ele raramente confronta diretamente seus alvos, prefere sussurrar inseguranças até transformar admiração em inveja.',
    descricao: 'Mil Olhos representa a inveja que nasce da comparação constante, o ressentimento silencioso diante da felicidade alheia e o desejo obsessivo de possuir aquilo que pertence aos outros. Diferente de entidades movidas por ambição direta, Mil Olhos não deseja criar — deseja possuir aquilo que já existe.\n\nEle possui a forma de uma criatura esférica flutuante coberta por pele verde-escura úmida. De seu corpo emergem dez longos tentáculos com um grande olho independente na ponta de cada um. As cicatrizes espalhadas por seu corpo são olhos fechados — centenas deles. Lendas afirmam que, quando todos os olhos se abrem simultaneamente, qualquer criatura ao redor perde completamente a própria sanidade.\n\nExiste um antigo aviso: "Aquilo que Mil Olhos observa eventualmente aprende a odiar a si mesmo."',
    dominio: {
      nome: 'A Galeria dos Vazios',
      desc: 'Um espaço completamente branco, silencioso e vazio, onde não parece existir céu, chão ou horizonte definidos. Espalhados por esse vazio encontram-se inúmeros manequins imóveis — centenas, talvez milhares. Todos possuem formas humanoides diferentes. Nenhum possui rosto. Ainda assim, cada visitante inevitavelmente reconhece alguns deles.\n\nQuanto mais tempo alguém observa os manequins, mais percebe que suas posições mudam lentamente quando não estão sendo encarados. Criaturas sofrem as condições Amedrontado e Confuso em relação a todas as outras criaturas presentes.',
    },
    graca: {
      nome: 'Cópia de Talento Corrompido',
      desc: 'O usuário pode marcar uma criatura e copiar uma Magia ou um Talento dela, utilizando normalmente seus custos e regras originais. Pode realizar isso até 3 vezes. Entretanto, cada uso gera uma corrupção invisível. A qualquer momento o Mestre pode aplicar: Rolagens com Desvantagem ou Alteração direta do valor obtido nos dados. As 5 corrupções devem ser consumidas antes de usar o poder novamente.',
    },
    requisito: 'Possuir Intelecto pelo menos +3. Não pode copiar Habilidades Divinas Sagradas nem outras Graças/Poderes Primordiais.',
  },

  'O Colecionador': {
    personalidade: 'O Colecionador é desconfiado, controlador e constantemente irritado. Ele enxerga ameaça em praticamente qualquer aproximação, como alguém convencido de que o mundo inteiro deseja roubar aquilo que lhe pertence. Quanto mais possui, mais medo sente de perder. Por isso nunca demonstra verdadeira satisfação, apenas ansiedade crescente escondida sob luxo e arrogância.',
    descricao: 'O Colecionador representa o medo de perder aquilo que se possui. Não apenas riquezas, ouro ou objetos raros, mas pessoas, poder, conhecimento e lembranças. Enquanto outras entidades desejam conquistar ou destruir, o Colecionador deseja guardar. E jamais dividir.\n\nEle possui a aparência de uma pequena criatura semelhante a um Feérico antigo e deformado pelo tempo. Seu corpo é magro, coberto por cicatrizes antigas e marcas espalhadas pela pele pálida e enrugada. Seu rosto transmite irritação constante. Apesar disso, suas roupas são absurdamente luxuosas — tecidos caros, joias excessivas e adornos dourados cobrindo praticamente todo o corpo.\n\nExiste uma velha crença entre ladrões: "Quanto maior o tesouro, maior a chance dele já pertencer ao Colecionador."',
    dominio: {
      nome: 'O Cofre das Posses Eternas',
      desc: 'Um gigantesco salão dourado que parece não possuir fim. Corredores intermináveis abarrotados por riquezas impossíveis de serem medidas. Armas lendárias, armaduras divinas, relíquias de civilizações destruídas, coroas antigas. Mas quanto mais alguém permanece, mais percebe algo perturbador — nenhum item parece realmente morto. Espadas vibram suavemente. Máscaras parecem respirar. Joias observam visitantes através de reflexos.\n\nCriaturas sofrem constantemente as condições Vulnerável e Silenciado enquanto no domínio.',
    },
    graca: {
      nome: 'Artefato Maldito',
      desc: 'Um artefato amaldiçoado vinculado à entidade que concede: +1 em todos os Atributos, +5 em rolagens de Ataques, +10 de Vida máxima e +10 de Mana máxima. Enquanto equipado: toda recuperação de Vida e Mana é reduzida pela metade e todo gasto de Mana é dobrado. Equipar/desequipar custa metade dos Pontos de Vida totais (mínimo 1 PV), ignorando proteções.',
    },
    requisito: 'Possuir perícia Investigação em nível Básico (+2).',
  },
}
