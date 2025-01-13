# 🐶 Doguin Starter SaaS v2

## Visão Geral

Doguin Starter SaaS v2 é um kit inicial moderno e robusto para SaaS, construído com:

- **Next.js 15**: O mais recente framework para criação de aplicações React renderizadas no servidor.
- **ShadCN**: Componentes de UI flexíveis para um desenvolvimento mais rápido.
- **Auth.js v5**: Uma biblioteca de autenticação simplificada.
- **Prisma**: Um ORM moderno para gerenciamento de banco de dados.
- **Docker**: Containerização para um deployment simplificado.
- **Stripe**: Integração de pagamentos para gerenciar planos de assinatura.

Este projeto foi projetado para ajudá-lo a iniciar e escalar rapidamente aplicações SaaS com uma arquitetura limpa e eficiente.

---

## Pré-visualização do Projeto

![Pré-visualização 1](https://i.ibb.co/S6KwbnL/dogin-3.png)
![Pré-visualização 2](https://i.ibb.co/MZ4STH8/dogin1.png)
![Pré-visualização 3](https://i.ibb.co/1KLMmzg/dogin2.png)

---

## Recursos

- Componentes React renderizados no servidor usando Next.js.
- Autenticação pré-configurada (Google, Apple, etc.) usando Auth.js v5.
- Estilizado com ShadCN e Tailwind CSS.
- Integração de banco de dados com Prisma.
- Integração com Stripe para gerenciamento de pagamentos e assinaturas.
- Ambiente de desenvolvimento containerizado usando Docker.

---

## Guia de Instalação

### Pré-requisitos

Antes de começar, certifique-se de ter os seguintes itens instalados:

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [Docker](https://www.docker.com/)
- [Git](https://git-scm.com/)

### Passo 1: Clonar o Repositório

```bash
# Clone o repositório para sua máquina local
git clone https://github.com/vinimatheus/doguin-starter-saas-v2.git

# Navegue até o diretório do projeto
cd doguin-starter-saas-v2
```

### Passo 2: Configurar Variáveis de Ambiente

1. Duplique o arquivo `.env.example` e renomeie-o para `.env`:

   ```bash
   cp .env.example .env
   ```

2. Edite o arquivo `.env` para incluir as variáveis específicas do seu ambiente:

   ```env
   NEXTAUTH_URL=http://localhost:3000
   AUTH_SECRET=seu_auth_secret
   DATABASE_URL=sua_database_url
   RESEND_API_KEY=sua_resend_api_key
   EMAIL_FROM=seu_email@exemplo.com
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   CLOUDINARY_URL=sua_api_cloudinary
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=sua_chave_publica_stripe
   STRIPE_SECRET_KEY=sua_chave_secreta_stripe
   NEXT_PUBLIC_PLAN_PRICE_ID_MONTHLY=id_preco_mensal_stripe
   NEXT_PUBLIC_PLAN_PRICE_ID_YEARLY=id_preco_anual_stripe
   ```

   - **NEXTAUTH_URL**: A URL base da sua aplicação.
   - **AUTH_SECRET**: Uma chave secreta para autenticação.
   - **DATABASE_URL**: String de conexão para seu banco de dados PostgreSQL.
   - **RESEND_API_KEY**: Chave de API para envio de emails.
   - **EMAIL_FROM**: Endereço de email do remetente padrão.
   - **CLOUDINARY_URL**: API para upload da imagem do perfil do usuario.
   - **NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY**: Chave pública do Stripe.
   - **STRIPE_SECRET_KEY**: Chave secreta do Stripe.
   - **NEXT_PUBLIC_PLAN_PRICE_ID_MONTHLY**: ID do preço mensal configurado no Stripe.
   - **NEXT_PUBLIC_PLAN_PRICE_ID_YEARLY**: ID do preço anual configurado no Stripe.

### Passo 3: Configurar Docker

1. Construa o container Docker:

   ```bash
   docker-compose build
   ```

2. Inicie o ambiente de desenvolvimento:

   ```bash
   docker-compose up
   ```

A aplicação estará disponível em `http://localhost:3000`.

### Passo 4: Configurar o Banco de Dados

Se estiver usando Prisma, inicialize o banco de dados:

```bash
# Gerar o Cliente Prisma
npx prisma generate

# Aplicar as migrações no banco de dados
npx prisma migrate dev
```

### Passo 5: Configurar o Stripe

1. Configure seus planos e preços no painel do Stripe.
2. Atualize os IDs dos preços no arquivo `.env`:

   ```env
   NEXT_PUBLIC_PLAN_PRICE_ID_MONTHLY=price_12345
   NEXT_PUBLIC_PLAN_PRICE_ID_YEARLY=price_67890
   ```

3. Adicione a lógica de assinatura no arquivo `src/app/(protected)/dashboard/configuracao/planos/_components/plan.tsx` para gerenciar planos de assinatura.

### Passo 6: Rodar o Servidor de Desenvolvimento

#### Sem Docker:

```bash
npm run dev
```

---

## Estrutura do Projeto

```
doguin-starter-saas-v2/
├── .github/             # Configurações e fluxos de trabalho do GitHub
├── .husky/              # Hooks do Git
├── .vscode/             # Configurações do Visual Studio Code
├── prisma/              # Esquemas e migrações do Prisma
├── public/              # Arquivos estáticos públicos
├── src/                 # Código-fonte principal
│   ├── app/             # Páginas e rotas do Next.js
│   ├── components/      # Componentes reutilizáveis da UI
│   ├── lib/             # Bibliotecas e utilitários
│   ├── pages/           # Páginas do Next.js (se aplicável)
│   ├── styles/          # Arquivos de estilo (CSS, Tailwind)
│   └── utils/           # Funções utilitárias
├── .env.example         # Exemplo de arquivo de variáveis de ambiente
├── .eslintrc.json       # Configuração do ESLint
├── .gitignore           # Arquivos e pastas ignorados pelo Git
├── docker-compose.yml   # Configuração do Docker Compose
├── Dockerfile           # Arquivo de configuração do Docker
├── next.config.js       # Configuração do Next.js
├── package.json         # Dependências e scripts do projeto
├── README.md            # Documentação do projeto
└── tsconfig.json        # Configuração do TypeScript
```

---

## Contribuição

1. Faça um fork do repositório.
2. Crie uma nova branch:
   ```bash
   git checkout -b feature/minha-feature
   ```
3. Faça suas alterações e commit:
   ```bash
   git commit -m "Adicione minha nova feature"
   ```
4. Envie sua branch:
   ```bash
   git push origin feature/minha-feature
   ```
5. Abra um Pull Request.

---

## Licença

Créditos ao Projeto Base
Este projeto foi inspirado e baseado no excelente trabalho de Kiranism com o projeto next-shadcn-dashboard-starter. Agradecemos por compartilhar um ponto de partida tão robusto e bem estruturado.
https://github.com/Kiranism/next-shadcn-dashboard-starter

Este projeto está licenciado sob a [Licença MIT](LICENSE).

---

Para dúvidas ou sugestões, sinta-se à vontade para abrir uma issue no repositório.
