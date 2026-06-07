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

### [ ] Etapa 3 — Aprimoramento "Magias Adicionais" (~25–35k)
- Adicionar estado em `char.aprimoramentos` (ex.: `magiasAdicionais: 0`,
  `magiasAdicionaisEscolhidas: []`), custo em `getXPGasto()`.
- UI de compra em `renderAprimoramentos()`: botão de compra (até 3x), seletor de
  `tipo`+`nivel_magia` respeitando as regras de acesso/gating da seção 1.3.
- Função `comprarMagiaAdicional(tipo, nivel)` que valida acesso, XP e limite de 3,
  e adiciona 2 magias à lista do personagem.
- Atualizar `Aprimoramento.jsx` (nova linha na tabela `MAGIC_TABLE` ou tabela
  própria, com custo e descrição).

### [ ] Etapa 4 — Aba "Magias Aprimoradas" (Trilha A) (~30–40k)
- Adicionar passo condicional no step bar (mesmo padrão usado para
  "Perícias Avançadas": `getStepNames()` + array `fns` em `render()`), aparecendo
  quando `char.aprimoramentos.magicLevel >= 1`.
- `renderMagiasAprimoradas()`: lista as magias Iniciais/Sagradas que o personagem
  já conhece, permite selecionar até 3 (limitado pelo que ele realmente possui) e
  trocar pela versão de tier superior usando `getSpellFamily()`.
- Função de toggle/troca (`toggleMagiaAprimorada(nomeOriginal)`) com lógica de
  reverter ao remover (parecida com `togglePericiaInt`/`togglePericiaAvancado`).

### [ ] Etapa 5 — Polimento, textos e testes manuais (~15–25k)
- Atualizar texto da página `Magias` (React) explicando Trilha A vs Trilha B.
- Revisar `Aprimoramento.jsx` (descrições do `MAGIC_TABLE` para refletir o novo
  fluxo: proficiência só libera o "direito"; "Magias Adicionais" é quem entrega
  as magias de Trilha B).
- Testar fluxo completo na ficha: personagem avançado comprando proficiência →
  abrindo aba nova → evoluindo magias da Trilha A → comprando Magias Adicionais →
  recebendo magias da Trilha B com gating correto.
- Apagar este arquivo de plano quando tudo estiver validado pelo usuário.


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
