## Plataforma de Contratos Digitais — Plano

### 1. Banco de dados (migration)

Criar 1 tabela `contracts`:

| Campo | Tipo | Notas |
|---|---|---|
| `id` | uuid PK | |
| `token` | text unique | usado na URL pública `/contrato/:token` |
| `created_by` | uuid → auth.users | admin que gerou |
| `issue_date` | date | travada na criação (data por extenso no rodapé) |
| `client_name` | text nullable | preenchido pelo cliente |
| `client_document` | text nullable | CPF/CNPJ |
| `client_address` | text nullable | endereço completo |
| `client_signature` | text nullable | dataURL PNG do canvas |
| `status` | enum: `pending` / `signed` | |
| `signed_at` | timestamptz nullable | |
| `created_at`, `updated_at` | timestamptz | |

**RLS / GRANTs:**
- Admin (`has_role admin`) e Diretor/Coordenador podem `SELECT/INSERT/UPDATE/DELETE` todos.
- `anon` + `authenticated` podem `SELECT` apenas pelo `token` (policy permissiva por token) e `UPDATE` apenas se `status='pending'` (para preencher e assinar).
- `GRANT SELECT, UPDATE ON public.contracts TO anon, authenticated;` + admin grants.

### 2. Constantes da empresa
- Arquivo `src/lib/contractConfig.ts` com: Razão Social ("CASE EJ Consultoria"), CNPJ, endereço Macaé, nome do Presidente, e import da imagem da assinatura (placeholder PNG em `src/assets/signature-presidente.png` — usuário substituirá depois).
- Texto padrão do contrato (template com lacunas `{{client_name}}`, `{{client_document}}`, `{{client_address}}`, `{{issue_date_extenso}}`).

### 3. Componentes / páginas

**`src/pages/Contratos.tsx`** (já existe — adicionar)
- Botão "Acessar Admin" leva para `/contratos/admin`.
- Botão "Como funciona" abre modal com os 4 passos.

**`src/pages/ContractsAdmin.tsx`** (nova)
- Header "Painel de Contratos" + botão "← Voltar" e "Novo Contrato".
- Tabela: data, cliente (ou "—"), status (Pendente/Assinado), ações: copiar link, WhatsApp, baixar PDF (se assinado), excluir.
- "Novo Contrato": cria registro, gera token, abre dialog com link + botões copiar/WhatsApp.

**`src/pages/ContractSign.tsx`** rota `/contrato/:token` (PÚBLICA — sem login)
- Carrega contrato pelo token via supabase client anon.
- Se `status='signed'`: mostra mensagem "Contrato já assinado" + botão baixar PDF.
- Se `pending`:
  - Etapa 1: formulário (nome, CPF/CNPJ com máscara, endereço).
  - Etapa 2: pré-visualização do contrato renderizado com os dados nas lacunas.
  - Etapa 3: canvas de assinatura (react-signature-canvas).
  - Botão "Finalizar e Assinar" → update do registro (`status=signed`, `signed_at=now()`, dados, dataURL da assinatura).
  - Após assinar: tela de sucesso + botão de download do PDF.

**`src/components/contracts/ContractPreview.tsx`**
- Render HTML com dados, usado tanto na prévia quanto na geração do PDF.
- Estilizado em A4 (210×297mm) com margens 25mm, fontes serifadas, quebras controladas via CSS `page-break-inside: avoid` nos blocos `<section>` (cláusulas) e bloco final de assinaturas com `break-inside: avoid`.

**`src/lib/contractPdf.ts`**
- Função `generateContractPdf(contract)` usa `jspdf` + `html2canvas` OU `html2pdf.js`. Escolha: **html2pdf.js** (mais simples para A4 com page-break CSS).
- Instalar `html2pdf.js`.
- Renderiza um nó oculto com o componente preview e exporta com `jsPDF: { unit:'mm', format:'a4' }` + `pagebreak: { mode: ['css','legacy'] }`.

### 4. Helpers
- `formatDateExtenso(date)` → "Macaé, 25 de junho de 2026".
- `maskCpfCnpj`, `validateCpfCnpj`.
- Assinatura presidente: usar `imagegen` para gerar uma rubrica caligráfica em PNG transparente (placeholder visual; usuário substitui depois).

### 5. Rotas em `App.tsx`
- `/contratos` (existe, com login)
- `/contratos/admin` (com login — admin/diretor)
- `/contrato/:token` (PÚBLICA, sem guard)

### 6. Integração com painel admin
- No `Contratos.tsx`, o botão "Acessar Admin" agora navega para `/contratos/admin`.

### 7. Dependências a instalar
- `html2pdf.js` (gera PDF A4 com page-breaks)
- `react-signature-canvas` (canvas de assinatura)

### Pontos a confirmar antes de implementar
1. **Texto do contrato**: vou usar um template genérico de prestação de serviços (CASE EJ) com cláusulas padrão (objeto, prazo, valor placeholder, confidencialidade, foro Macaé). Você fornece depois ou tudo bem começar com esse genérico?
2. **Assinatura do Presidente**: gero uma imagem PNG de rubrica caligráfica como placeholder, ok? (Depois você sobe a real pelo admin ou eu adiciono campo de upload?)
3. **Quem pode criar contratos**: só admin, ou também Diretor/Coordenador de Projetos?
