# Plano — Reformulação do Sistema de Evolução de Magias

> Spec validada com o usuário em 2026-06-06. Guardar este arquivo e implementar em etapas
> separadas (cada etapa = uma sessão de ~20k–40k tokens). Não apagar até o sistema estar
> 100% implementado e testado no site, no banco e na ficha.

## 1. Regras confirmadas (especificação validada)

1. **Acesso inicial**: todo personagem começa no nível de proficiência mágica "Menor".
   Na seleção inicial de magias só aparecem magias com `nivel_magia` ≤ 3
   (Truque / Básica / Menor), respeitando o `tipo` que o personagem tem acesso.

2. **Trilha A — evoluir magia já conhecida** (só `Magias Iniciais` e `Magias Sagradas`):
   - Ao comprar Proficiência Elite/Maior/Avançado (aprimoramento `magicLevel`), abre a aba
     **"Magias Aprimoradas"**.
   - Nessa aba o personagem escolhe, dentre as magias que já conhece dessas duas
     categorias, até **3** para evoluir para a versão de tier superior.
   - **"Até 3" é teto, não garantia**: se ele só conhece 2 magias elegíveis, só pode
     evoluir essas 2.
   - **Vínculo entre tiers ("irmãs menores")**: NÃO usar as colunas `upg_*` (remover/
     ignorar — elas estão vazias e cada magia continua sendo uma linha única no banco).
     O vínculo é por **padrão de nome**: nome-base + sufixo de tier, dentro do mesmo
     `tipo` + `natureza`. Confirmado no banco:
     ```
     "Alarme Mágico"  (nível 2)
       → "Alarme Mágico Elite"     (nível 4)
       → "Alarme Mágico Maior"     (nível 5)
       → "Alarme Mágico Avançado"  (nível 6)

     "Acelerar" (Sagrada, nível 2)
       → "Acelerar Elite" → "Acelerar Maior" → "Acelerar Avançado"
       → "Acelerar Divino Rompante Temporal"   (nível 8 — sufixo "Divino <título único>")
     ```
     Algoritmo: extrair nome-base removendo sufixo " Elite"/" Maior"/" Avançado"/
     " Divino ..." e buscar a magia com mesmo nome-base + tipo + natureza no
     `nivel_magia` alvo.

3. **Trilha B — adquirir magia nova** (`Magias Antigas`, `Magias de Pacto`,
   `Magias de Grimório`, `Magia Proibida`):
   - Subir a proficiência NÃO dá essas magias automaticamente — apenas habilita o
     **direito** de comprá-las.
   - Para realmente obtê-las, o personagem precisa comprar o aprimoramento
     **"Magias Adicionais"**.
   - Também precisa ter acesso-base à categoria (raça/classe/talento), ex.: só Elfo
     tem acesso a `Magias Antigas`, só Mago tem acesso a `Magias de Grimório`.
   - Exemplos de gating combinando os dois requisitos:
     - Pacto Avançado (`nivel_magia` 6): exige proficiência Avançado + compra de
       Magias Adicionais.
     - Grimório Elite (`nivel_magia` 4): exige proficiência Elite + compra de
       Magias Adicionais.
     - Elfo com acesso a Magias Antigas pode usar Magias Adicionais para pegar mais
       Antigas (ou até Iniciais/Truque se preferir).
     - Mago com Grimório precisa das DUAS compras (proficiência + Magias Adicionais)
       para níveis mais altos de Grimório.

4. **Aprimoramento "Magias Adicionais"** (novo):
   - Concede **2 magias novas** por compra, em qualquer nível permitido pelas regras
     de acesso (ex.: Inicial nova começa em Básico; se já tem acesso Grimório-Elite,
     pode pegar Grimório-Elite nova diretamente).
   - **Limite: 3 compras no total** (até 6 magias extras).
   - Sem outro pré-requisito além de ter XP suficiente e respeitar nível/acesso.

5. **Distribuição real de `nivel_magia` por `tipo`** (já confirmada no banco —
   referência para os filtros de seleção/gating):
   ```
   Truque              → 1
   Magias Iniciais     → 2, 4, 5, 6
   Magias Sagradas     → 2, 4, 5, 6, 8
   Magias Antigas      → 3, 5, 6
   Magias de Grimório  → 3, 4
   Magias de Pacto     → 3, 6
   Magia Proibida      → 6, 7, 9
   ```
   (nivel_magia: 1=Truque 2=Básica 3=Menor 4=Elite 5=Maior 6=Avançado
   7=Lendário 8=Divino 9=Secreto)

6. **Limpeza de banco**: as colunas `upg_tipo`, `upg_custo`, `upg_nome`, `upg_desc`
   da tabela `spells` estão 100% vazias (0 de 487 linhas) — remover/parar de usar.
   Cada magia continua única; nada de registros "mestre + variantes".


## 2. Plano de implementação em etapas (cada uma cabe em ~20k–40k tokens)

Trabalhar **uma etapa por sessão**. Ao concluir uma etapa, marcar `[x]` abaixo e
parar — a próxima sessão lê este arquivo e continua da etapa seguinte sem precisar
re-derivar o entendimento.

### [x] Etapa 1 — Base de dados + helper de "família de magia" (~20–30k) — CONCLUÍDA 2026-06-06
- ✅ Migração no banco: colunas `upg_tipo/upg_custo/upg_nome/upg_desc` já removidas de
  `spells` (`backend/data/rpg.db` — confirmado via `PRAGMA table_info`; backup em
  `backend/data/rpg.db.bak_20260606_212950`).
- ✅ Criada `getSpellBaseName(nome)` e `getSpellFamily(nome, tipo, natureza, nivelAlvo)`
  em `ficha.html` (perto de `getMagicLevelName`/`getMagicLevelColor`, ~linha 538):
  remove sufixo de tier (" Elite"/" Maior"/" Avançado"/" Divino ...") e busca a magia
  com mesmo `tipo`+`natureza`+`nivel_magia` alvo, usando `SPELL_NIVEL_SUFFIX` para
  os tiers nomeados e prefixo `"<base> Divino"` para o caso nível 8 (título variável).
- ✅ Testado com 10 casos reais via Node contra o dump do banco: "Alarme Mágico" →
  Elite/Maior/Avançado e volta, "Acelerar" → Elite/Avançado/Divino Rompante Temporal,
  e caso negativo (nível sem família correspondente → `null`). Todos passaram.

### [x] Etapa 2 — Restringir seleção inicial de magias (~20–30k) — CONCLUÍDA 2026-06-06
- ✅ `getMaxMagicLevel()` (linha ~437) agora **sempre retorna 3**, independente de
  `char.aprimoramentos.magicLevel`. Antes ela escalava o teto até 6 conforme a
  Progressão Mágica comprada — isso fazia tiers Elite/Maior/Avançado aparecerem
  direto no pool de seleção, o que contradiz a nova spec (esses tiers agora só
  vêm pela Trilha A "Magias Aprimoradas" ou Trilha B "Magias Adicionais").
- ✅ Como `getMaxMagicLevel()` é a única fonte do teto usado em `renderMagias()`
  (filtro de nível e lista `filtered`), a mudança propaga automaticamente para
  base, truques e extras (Grimório/racial) — todas usam o mesmo pool filtrado.
- ✅ Testado via Playwright com personagem "avançado" + `magicLevel:3` (Avançado,
  o teto mais alto possível): botões de filtro "Nível máximo" mostraram só
  `[1,2,3]` (Truques/Básicas/Menor), nenhuma magia Elite/Maior/Avançado apareceu
  na lista (`htmlContainsElite: false`), confirmando que o cap vale mesmo para
  quem já comprou toda a Progressão Mágica.

### [x] Etapa 3 — Aprimoramento "Magias Adicionais" (~25–35k) — CONCLUÍDA 2026-06-06
- ✅ Reaproveitado o campo de estado já existente `char.aprimoramentos.novasMagias`
  (renomeado na UI para "Magias Adicionais", custo já estava em `getXPGasto()`) e
  adicionado `magiasAdicionaisEscolhidas: []` — array de compras
  `{tipo, nivel, nomes:[a,b]}`, uma entrada por compra (até 3).
- ✅ Criadas as helpers de gating Trilha B em `ficha.html` (perto de
  `getMaxMagicLevel()`, ~linha 446): `getMagicProficiencyLevel()` (mapeia
  `magicLevel` 0-3 → nível de proficiência 3/4/5/6), `TRILHA_B_TIPOS` (Antigas,
  Pacto, Grimório, Proibida) e `getMagiasAdicionaisOpcoes()` — cruza acesso-base
  (`getSpellAccess()`) com o teto certo: `getMagicProficiencyLevel()` para tipos
  de Trilha B, `getMaxMagicLevel()` (sempre 3) para os demais — implementando
  literalmente "Inicial nova começa em Básico; Grimório-Elite exige proficiência
  Elite".
- ✅ UI de compra em `renderAprimoramentos()` (substituiu o bloco antigo "Novas
  Magias"): seletor em 3 passos — tipo → nível → 2 magias (cards reaproveitando
  estilo `.sc`/`.spells-grid`), com estado transitório `maPicker` (não persiste no
  personagem) e funções `setMAPTipo`/`setMAPNivel`/`toggleMAPSpell`/`resetMAPicker`.
  Lista as compras já feitas e botão "Desfazer última compra".
- ✅ Funções `comprarMagiaAdicional()` (valida limite de 3, XP ≥ 500, opção
  presente em `getMagiasAdicionaisOpcoes()`, magia existe/bate tipo+nível/não
  duplicada — então grava a compra e empurra as 2 magias para `char.magiasExtra`)
  e `removerMagiaAdicional()` (desfaz a última compra: remove as magias de
  `magiasExtra`, decrementa o contador, limpa o picker).
- ✅ Atualizado `Aprimoramento.jsx`: linha "Novas Magias" → "Magias Adicionais"
  com a descrição do novo fluxo (proficiência habilita o direito; esta compra
  entrega as magias), e as 3 linhas de Proficiência (Elite/Maior/Avançada)
  reescritas para deixar claro que abrem a aba "Magias Aprimoradas" (Trilha A) e
  habilitam o direito de compra via "Magias Adicionais" (Trilha B) — em vez de
  sugerir que as magias chegam automaticamente.
- ✅ Testado via Playwright com personagem Elfo/Mago avançado (`magicLevel:3`):
  `getMagiasAdicionaisOpcoes()` devolveu corretamente `Magias Antigas` com níveis
  `[3,5,6]` (gating por proficiência, pois Elfo tem acesso-base) e `Magias
  Iniciais` travada em `[2]` (não é Trilha B → teto fixo em 3/Menor); fluxo
  completo de compra (escolher tipo→nível→2 magias→confirmar) debitou 500 XP,
  adicionou as magias a `char.magiasExtra` e registrou a entrada em
  `magiasAdicionaisEscolhidas`; tentativa de comprar `Magia Proibida` nível 9
  (fora do alcance/gating) foi corretamente bloqueada; "Desfazer última compra"
  reverteu XP, contador e lista de magias extras.

### [x] Etapa 4 — Aba "Magias Aprimoradas" (Trilha A) (~30–40k) — CONCLUÍDA 2026-06-06
- ✅ Passo condicional adicionado em `getStepNames()` (push de `'Magias
  Aprimoradas'` logo após `'Magias'`) e no array `fns` de `render()`
  (`fns.push(renderMagiasAprimoradas)`), ambos sob a guarda
  `char.tipo==='avancado' && char.aprimoramentos.magicLevel>=1` — mesmo padrão de
  "Perícias Avançadas". `comprarMagicLevel()` agora chama `render()` (em vez de
  só `renderAprimoramentos()`) na primeira compra de Progressão Mágica, para que
  a nova aba apareça imediatamente na barra de passos.
- ✅ Estado novo `char.aprimoramentos.magiasAprimoradas: []` — array
  `{original, evoluida, nivel}`, uma entrada por magia evoluída (até 3).
- ✅ `renderMagiasAprimoradas()`: lista as magias `Magias Iniciais`/`Magias
  Sagradas` que o personagem já conhece (reconhecendo também as já evoluídas,
  exibidas pelo nome original + seta para a versão atual), calcula a versão-alvo
  via `getSpellFamily(original, tipo, natureza, getMagicProficiencyLevel())` e
  mostra botão "✦ Evoluir" / "↩ Reverter" com os estados corretos (limite de 3,
  já conhece a versão, família incompleta no banco).
- ✅ `toggleMagiaAprimorada(nomeOriginal)`: ao evoluir, troca o nome da magia
  *in-place* em `char.magias`/`char.magiasExtra` (de "Alarme Mágico" para "Alarme
  Mágico Elite", por ex.) e registra `{original, evoluida, nivel}`; ao reverter,
  troca de volta usando o registro salvo e remove a entrada — mesma filosofia de
  reverter de `togglePericiaInt`/`togglePericiaAvancado`.
- ✅ Atualizado o resumo de bônus em `renderAprimoramentos()`: a linha
  "Magias Elite/Maior/Avançado desbloqueadas" (que sugeria entrega automática,
  contradizendo a nova spec) virou "Direito de evoluir/adquirir magias até o tier
  X (aba Magias Aprimoradas / Magias Adicionais)", e foi adicionada uma linha
  listando as trocas feitas em Magias Aprimoradas.
- ✅ Testado via Playwright (Humano/Mago avançado): comprar Proficiência Elite
  abriu a aba "Magias Aprimoradas" na barra de passos automaticamente; evoluir
  "Alarme Mágico" → "Alarme Mágico Elite" trocou o nome em `char.magias` mantendo
  as outras magias intactas; o limite de 3 foi respeitado (3ª evolução aceita, 4ª
  bloqueada); reverter restaurou o nome original em `char.magias` e decrementou o
  contador corretamente.

### [x] Etapa 5 — Polimento, textos e testes manuais (~15–25k) — CONCLUÍDA 2026-06-06
- ✅ Atualizada a página `Magias` (React, [Magias.jsx](frontend/src/pages/Magias/Magias.jsx)):
  a aba "Níveis de Magia" ganhou uma nova seção "Evolução do Conhecimento Mágico"
  com dois cards lado a lado — "Trilha A — Magias Aprimoradas" (evoluir magia já
  conhecida, Iniciais/Sagradas, até 3, vínculo por nome-base) e "Trilha B —
  Magias Adicionais" (adquirir magia nova, tipos restritos, gating de
  acesso-base + Progressão Mágica) — e um parágrafo final amarrando as duas
  trilhas como complementares (ex.: Mago de Grimório precisa das duas; Elfo usa
  "Magias Adicionais" para reforçar Magias Antigas). Texto introdutório do nível
  também revisado para descrever o ponto de partida real (Menor, níveis 1-3).
- ✅ `Aprimoramento.jsx` já tinha sido revisado durante a Etapa 3 (linha "Novas
  Magias" → "Magias Adicionais" e as 3 entradas de Proficiência reescritas para
  deixar claro que abrem a aba "Magias Aprimoradas"/habilitam "Magias
  Adicionais" em vez de entregar magias automaticamente) — conferido novamente,
  sem pendências.
- ✅ Teste de fluxo completo via Playwright (Elfo/Mago avançado, do zero):
  selecionar 2 magias Iniciais → comprar Proficiência Elite (debita 400 XP, abre
  a aba "Magias Aprimoradas" automaticamente) → evoluir "Alarme Mágico" →
  "Alarme Mágico Elite" (Trilha A) → comprar "Magias Adicionais" por 500 XP e
  receber 2 "Magias Antigas" de nível Menor — corretamente limitadas ao teto
  `min(profLvl, níveis disponíveis no banco)` já que Antigas só tem níveis
  [3,5,6] e profLvl=4 → só nível 3 qualifica (Trilha B) → checagem final de
  gating confirmou que "Magias de Pacto" nem aparece nas opções (Elfo/Mago não
  tem acesso-base) e que "Magias de Grimório" Avançado (nível 6) fica fora do
  alcance com profLvl=4. Tudo correto.

**Sistema 100% implementado e testado.** Apague este arquivo quando o usuário
validar o fluxo completo na campanha.


## 3. Notas para quem retomar

- Tudo isso vive principalmente em `frontend/public/ficha.html` (ficha vanilla JS),
  que carrega dados via `fetch('/api/all')`.
- Padrão de "nova aba condicional" já existe e funciona — replicar o que foi feito
  para "Perícias Avançadas" (`getStepNames()` faz `splice` condicional, `render()`
  faz `splice` correspondente no array `fns`, e `alterarApr()` chama `render()`
  completo quando o aprimoramento que libera a aba muda).
- `char.aprimoramentos.magicLevel` já existe no estado (0 = Menor / Elite / Maior /
  Avançado — confirmar mapeamento exato ao implementar a Etapa 4).
- Encoding: ao ler o banco via terminal aparecem caracteres corrompidos
  (`Magias de Grim?rio`, `M?gico` etc.) — é só exibição do terminal, os dados no
  banco estão corretos (UTF-8); não é um bug a corrigir.
