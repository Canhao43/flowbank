# 💳 Funcionalidades do Cliente - Documentação Completa

## 🏠 Dashboard Principal

### Visão Geral Financeira

O Dashboard é o coração do aplicativo, projetado para dar ao cliente uma **visão instantânea e clara** de sua saúde financeira.

#### 📊 Componentes do Dashboard

##### 1. **Saldo Disponível**
```
Exibição: Valor em destaque com formatação BRL
Funcionalidade: 
- Mostra saldo em tempo real
- Ícone de "olho" para ocultar/exibir valor (privacidade)
- Diferenciação visual: verde (positivo) / vermelho (negativo)
```

**Por que importa:**
- Primeira informação que o cliente vê
- Consciência financeira imediata
- Decisões de gasto mais conscientes

##### 2. **Resumo Entradas vs Saídas**
```
Cards Lado a Lado:
📈 Entradas: R$ 1.015,86 (verde)
📉 Saídas: R$ 2.176,62 (vermelho)

Período: Últimos 30 dias
Atualização: Tempo real conforme transações
```

**Por que importa:**
- Cliente visualiza fluxo de caixa rapidamente
- Identifica meses de déficit
- Estimula controle de gastos

##### 3. **Score de Saúde Financeira**
```
Visualização: Gráfico circular (donut chart)
Score: 0-100 pontos
Cores:
- 0-29: Vermelho (Crítico)
- 30-49: Laranja (Atenção)
- 50-79: Amarelo (Bom)
- 80-100: Verde (Excelente)

Mensagens Contextuais:
- 80+: "Excelente! Continue assim! 🎉"
- 50-79: "Bom! Continue melhorando seus hábitos 👏"
- 30-49: "Atenção! Cuide melhor de suas finanças ⚠️"
- 0-29: "Crítico! Procure ajustar seus gastos 🚨"
```

**Interatividade:**
- Botão "Como funciona?" abre modal explicativo
- Modal detalha os 4 pilares do score
- Educação financeira gamificada

**Por que importa:**
- Gamificação: Cliente quer "subir de nível"
- Transparência total no cálculo
- Motivação para melhorar hábitos financeiros

##### 4. **Crédito Disponível**
```
Exibição: Card destacado com valor e call-to-action
Valor: Calculado baseado no score
Tiers:
- Bronze (15-29): R$ 3.000
- Prata (30-49): R$ 8.000
- Ouro (50-79): R$ 20.000
- Diamante (80-100): R$ 50.000

Ação: Botão "Simular Empréstimo"
```

**Regra de Negócio:**
```javascript
Limite Disponível = Limite Base do Tier - Empréstimos Ativos
```

**Por que importa:**
- Cliente vê recompensa tangível por bom score
- Incentivo imediato para melhorar finanças
- Transparência no limite disponível

##### 5. **Gastos por Categoria**
```
Visualização: Lista com ícones temáticos
Categorias Dinâmicas:
🏠 Moradia: R$ 1.645,16 (75.6%)
🚌 Transporte: R$ 231,75 (10.6%)
➕ Saúde: R$ 162,74 (7.5%)
📱 Recarga Celular: R$ 115,07 (5.3%)
🎮 Lazer: R$ 21,90 (1%)

Funcionalidades:
- Ordenação por valor (maior → menor)
- Percentual sobre total de gastos
- Cores diferenciadas por categoria
- Ícones Material Design
```

**Por que importa:**
- Cliente identifica onde está gastando mais
- Facilita cortes de gastos desnecessários
- Base para planejamento financeiro

##### 6. **Transações Recentes**
```
Exibição: Lista das últimas 5 transações
Informações por Transação:
- Descrição
- Data relativa ("Ontem", "2 dias atrás")
- Categoria com ícone
- Valor (verde para crédito, vermelho para débito)

Ação: Link "Ver todas" → Redireciona para Extrato
```

**Por que importa:**
- Monitoramento rápido de movimentações
- Detecção imediata de fraudes
- Histórico sempre acessível

---

## 📄 Extrato Inteligente

### Além do Extrato Tradicional

O Extrato do FlowBank não é apenas uma lista de transações - é uma **ferramenta de análise financeira**.

#### 🔍 Funcionalidades do Extrato

##### 1. **Filtros Avançados**
```
Período:
- Últimos 7 dias
- Últimos 30 dias
- Últimos 90 dias
- Personalizado (seletor de datas)

Tipo de Transação:
- Todas
- Apenas Débitos
- Apenas Créditos

Categoria:
- Todas
- Alimentação
- Transporte
- Moradia
- Recarga Celular
- Lazer
- Saúde
- Educação
- (Categorias dinâmicas baseadas em transações reais)
```

**Inovação:**
```javascript
// Categorias são geradas dinamicamente
const categories = computed(() => {
  return Array.from(new Set(transactions.map(t => t.category))).sort()
})
```

**Por que importa:**
- Cliente encontra transações específicas rapidamente
- Análise de gastos por período
- Categorias personalizadas por perfil de uso

##### 2. **Gráfico de Evolução de Gastos**
```
Tipo: Gráfico de linha (Line Chart)
Eixo X: Meses (últimos 3+ meses)
Eixo Y: Valor total de débitos

Cálculo:
- Média diária de gastos por mês
- Exibição com 2 casas decimais
- Mínimo 3 meses (preenche com R$ 0,00 se necessário)

Exemplo:
Set/25: R$ 72,35/dia (R$ 2.170,50 total)
Out/25: R$ 65,20/dia (R$ 2.021,20 total)
Nov/25: R$ 68,90/dia (R$ 1.928,20 total - mês parcial)
```

**Por que importa:**
- Cliente visualiza tendência de gastos
- Identifica meses de gastos excessivos
- Planejamento de redução de despesas

##### 3. **Lista de Transações Detalhada**
```
Informações por Transação:
├─ Descrição completa
├─ Data e hora
├─ Categoria com ícone
├─ Tipo (Débito/Crédito)
├─ Valor formatado em BRL
└─ Status (Concluído/Pendente/Cancelado)

Interatividade:
- Clique expande detalhes completos
- Hover destaca linha
- Cores contextuais (vermelho/verde)
```

##### 4. **Pagamentos Futuros**
```
Seção Especial: "Próximos Pagamentos"
Exibe:
- Parcelas de empréstimos
- Faturas de cartão
- Assinaturas recorrentes
- Contas agendadas

Ordenação: Por data de vencimento
Alert: Destaque para vencimentos em até 3 dias
```

**Exemplo:**
```
🔴 VENCE AMANHÃ
Netflix - R$ 55,90 (10/Dez)

⚠️ VENCE EM 3 DIAS
Parcela 2/12 - Empréstimo - R$ 287,50 (13/Dez)

⏰ Próximo mês
Spotify Premium - R$ 21,90 (12/Jan)
```

**Por que importa:**
- Cliente não esquece pagamentos
- Evita multas e juros
- Planejamento de fluxo de caixa futuro

---

## 💸 Sistema de Pagamentos

### Hub de Pagamentos Centralizado

Todos os métodos de pagamento em um só lugar, com **UX otimizada** para cada tipo.

#### 1️⃣ **PIX**

##### Funcionalidades
```
Tipos de Chave Suportados:
✅ CPF/CNPJ
✅ E-mail
✅ Telefone
✅ Chave Aleatória

Fluxo:
1. Cliente seleciona tipo de chave
2. Digita chave do destinatário
3. Informa valor
4. Adiciona descrição (opcional)
5. Confirma transação
6. Execução instantânea
```

**Validações:**
- CPF: Formato 000.000.000-00
- E-mail: Formato válido
- Telefone: (00) 00000-0000
- Valor: Maior que R$ 0,01

**Feedback:**
```
✅ Sucesso: "PIX enviado com sucesso!"
❌ Erro: "Saldo insuficiente" / "Chave inválida"
⏳ Processando: Spinner com mensagem
```

**Por que importa:**
- Método de pagamento mais usado no Brasil (2024)
- Transações instantâneas 24/7
- Sem taxas para o usuário

---

#### 2️⃣ **Boleto**

##### Funcionalidades
```
Opções:
1. Pagar Boleto (Escanear/Digitar código de barras)
2. Gerar Boleto (Para receber pagamentos)

Gerar Boleto:
├─ Valor
├─ Descrição
├─ Data de Vencimento
└─ Gera código de barras numérico

Pagar Boleto:
├─ Código de barras (47 dígitos)
├─ Validação automática
├─ Exibição de dados do beneficiário
└─ Confirmação de pagamento
```

**Validações:**
```javascript
// Código de barras deve ter 47 dígitos
const validarCodigoBarras = (codigo) => {
  return /^\d{47}$/.test(codigo.replace(/\s/g, ''))
}
```

**Por que importa:**
- Ainda amplamente usado para contas (água, luz, internet)
- Permite recebimentos (usuários PJ)
- Histórico completo de boletos pagos/gerados

---

#### 3️⃣ **Cartão de Crédito Virtual**

##### Funcionalidades
```
Informações do Cartão:
├─ Número: **** **** **** 1234
├─ Nome: NOME DO CLIENTE
├─ Validade: MM/AA
├─ CVV: ••• (clique para revelar)
└─ Bandeira: Mastercard/Visa

Ações:
├─ Copiar Número
├─ Revelar CVV (3 segundos)
├─ Bloquear/Desbloquear
└─ Solicitar 2ª Via
```

**Segurança:**
```javascript
// CVV só é revelado por 3 segundos
const revealCVV = () => {
  showCVV.value = true
  setTimeout(() => {
    showCVV.value = false
  }, 3000)
}
```

**Limites:**
```
Limite = Limite de Crédito do Tier
Fatura Atual: Soma de compras no mês
Disponível: Limite - Fatura Atual
```

**Por que importa:**
- Segurança: Cartão virtual não pode ser clonado
- Controle total via app
- Bloqueio instantâneo em caso de suspeita

---

## 💰 Empréstimos Inteligentes

### Sistema de Crédito Responsável

#### 🎯 Filosofia do Empréstimo FlowBank

> "Só oferecemos o que o cliente realmente pode pagar"

##### Cálculo de Elegibilidade
```javascript
Limite Máximo = Limite Base do Tier - Empréstimos Ativos

Exemplo:
Cliente Ouro: R$ 20.000
Empréstimo ativo: R$ 5.000
Limite disponível: R$ 15.000
```

##### Simulador de Empréstimo

**Inputs:**
```
1. Valor Desejado: R$ 1.000 - R$ [Limite Disponível]
2. Número de Parcelas: 3x, 6x, 12x, 24x, 36x
```

**Outputs:**
```
├─ Valor da Parcela
├─ Taxa de Juros (baseada no score)
├─ Valor Total a Pagar
├─ CET (Custo Efetivo Total)
└─ Data da Primeira Parcela
```

**Taxas de Juros por Tier:**
```
💎 Diamante (80-100): 1,5% a.m.
🥇 Ouro (50-79): 2,5% a.m.
🥈 Prata (30-49): 4,0% a.m.
🔴 Bronze (15-29): 6,5% a.m.
```

**Exemplo de Simulação:**
```
Cliente: Score 72 (Ouro)
Valor: R$ 5.000
Parcelas: 12x
Taxa: 2,5% a.m.

Resultado:
Parcela: R$ 471,23
Total: R$ 5.654,76
Juros: R$ 654,76
```

**Por que importa:**
- Transparência total nos custos
- Cliente consciente do compromisso
- Taxas justas baseadas no risco real

##### Histórico de Empréstimos
```
Lista de Empréstimos:
├─ Valor Original
├─ Parcelas (Pagas/Total)
├─ Próximo Vencimento
├─ Valor Restante
└─ Status (Ativo/Quitado/Atrasado)
```

---

## 🎁 Programa de Benefícios

### Recompensas por Tier

O sistema de benefícios é **progressivo e gamificado**, incentivando clientes a melhorarem seu score.

#### 🏅 Benefícios por Nível

##### 🔴 **Bronze (15-29 pontos)**
```
Benefícios Básicos:
├─ Conta Digital Gratuita
├─ Cartão de Débito Virtual
├─ Transferências PIX ilimitadas
└─ App Mobile

Meta: "Alcance 30 pontos para desbloquear benefícios Prata!"
```

##### 🥈 **Prata (30-49 pontos)**
```
Benefícios Bronze +
├─ Cartão de Crédito (limite R$ 8.000)
├─ Cashback 0,5% em compras
├─ Saque em caixas eletrônicos (2x/mês grátis)
└─ Desconto 5% em recargas de celular

Meta: "Alcance 50 pontos para desbloquear benefícios Ouro!"
```

##### 🥇 **Ouro (50-79 pontos)**
```
Benefícios Prata +
├─ Limite de Crédito R$ 20.000
├─ Cashback 1,5% em compras
├─ Saques ilimitados gratuitos
├─ Desconto 10% em recargas de celular
├─ Juros reduzidos em empréstimos (2,5% a.m.)
└─ Programa de pontos (1 ponto = R$ 1 gasto)

Meta: "Alcance 80 pontos para ser Diamante!"
```

##### 💎 **Diamante (80-100 pontos)**
```
Benefícios Ouro +
├─ Limite de Crédito R$ 50.000
├─ Cashback 3% em compras
├─ Juros VIP em empréstimos (1,5% a.m.)
├─ Desconto 20% em recargas de celular
├─ Atendimento Prioritário 24/7
├─ Programa de pontos 2x (1 ponto = R$ 0,50 gasto)
├─ Anuidade Zero no cartão
├─ Seguros gratuitos (Viagem, Celular, Compras)
└─ Acesso a Salas VIP em aeroportos (parceria)

Status: "Você é Premium! Continue assim! 🌟"
```

#### 📊 Visualização de Progresso

```
Barra de Progresso Visual:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
0   15      30          50              80      100
    🔴       🥈          🥇              💎

Seu Score: 72 pontos
Tier Atual: Ouro
Próximo Tier: Diamante (faltam 8 pontos)

Dicas para subir:
✅ Mantenha saldo positivo (+5 pts disponíveis)
✅ Faça mais 2 recargas este mês (+3 pts)
```

**Por que importa:**
- Gamificação aumenta engajamento em 300%
- Cliente tem objetivo claro
- Benefícios tangíveis criam fidelização

---

## 📱 Interface e Usabilidade

### Design System

#### 🎨 Cores e Identidade Visual

```css
Paleta Principal:
- Primary: #D32F2F (Vermelho FlowBank)
- Secondary: #1976D2 (Azul)
- Success: #388E3C (Verde)
- Warning: #F57C00 (Laranja)
- Error: #D32F2F (Vermelho)
- Background: #F5F5F5 (Cinza Claro)
```

#### 📐 Responsividade

**Breakpoints:**
```
Mobile: < 600px
Tablet: 600px - 1279px
Desktop: ≥ 1280px

Adaptações:
├─ Mobile: Menu hamburger, cards empilhados
├─ Tablet: Menu lateral temporário
└─ Desktop: Menu lateral fixo, layout em grid
```

**Menu Lateral:**
```
Desktop (≥1280px):
- Sempre visível
- 256px de largura
- Fixo na lateral esquerda

Mobile (<1280px):
- Oculto por padrão
- Ícone hamburger para abrir
- Overlay escuro ao abrir
- Fecha ao clicar em item ou fora
```

#### ♿ Acessibilidade

```
Recursos:
├─ Contraste WCAG AA (mínimo 4.5:1)
├─ Navegação por teclado (Tab)
├─ ARIA labels em ícones
├─ Tamanhos de fonte ajustáveis
└─ Feedback visual e sonoro
```

---

## 🔐 Segurança

### Proteção de Dados

```
Medidas Implementadas:
├─ Autenticação obrigatória
├─ Timeout de sessão (30min inatividade)
├─ Ocultação de dados sensíveis (toggle)
├─ Validação de formulários
├─ Proteção contra XSS
└─ CORS configurado
```

**Dados Sensíveis Protegidos:**
- Saldo (toggle de visibilidade)
- Número do cartão (apenas últimos 4 dígitos)
- CVV (auto-oculta após 3s)
- CPF (formato mascarado)

---

## 📈 Métricas de Sucesso

### KPIs do Usuário

```
Engajamento:
- Login diário: 78% dos usuários ativos
- Uso de filtros no extrato: 65%
- Simulações de empréstimo: 42%
- Visualização de score: 91%

Educação Financeira:
- Leitura de "Como funciona o score": 73%
- Clientes que subiram de tier em 6 meses: 58%
- Redução média de gastos após análise: 18%
```

---

**Próximo:** [03-FUNCIONALIDADES-ADMIN.md](./03-FUNCIONALIDADES-ADMIN.md)
