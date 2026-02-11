> ![Logo Kinvo](https://github.com/cbfranca/kinvo-front-end-test/blob/master/logo.svg)

# 💸 Kinvo - Desafio Back-end

Este projeto foi desenvolvido como solução para o **Desafio Back-end Kinvo**, com foco em controle de finanças pessoais, seguindo as melhores práticas de arquitetura, testes, segurança, cache e deploy.

---

## 🚀 Sobre o Desafio

O objetivo é criar uma API robusta para controle de movimentações financeiras (receitas e despesas), com autenticação, filtros, paginação, exibição de saldo e diferenciais como cache e Docker. O desafio avalia não só o cumprimento dos requisitos, mas principalmente a qualidade das decisões técnicas.

---

## 🏗️ Arquitetura & Tecnologias

- **Node.js + TypeScript**: Base moderna e tipada.
- **NestJS**: Framework modular, escalável e com suporte a injeção de dependências, CQRS e validação.
- **Prisma ORM**: Integração eficiente com PostgreSQL.
- **Redis**: Cache distribuído para performance.
- **Docker & Docker Compose**: Padronização do ambiente e fácil deploy.
- **Vitest**: Testes unitários e E2E rápidos e modernos.
- **Swagger**: Documentação automática e interativa da API.
- **SOLID & Clean Code**: Estrutura orientada a domínio, separação de responsabilidades e fácil manutenção.

---

## 🔒 Autenticação & Segurança

- **JWT**: Autenticação segura via tokens.
- **Cadastro e login de usuários**.
- **Proteção de rotas**: Apenas usuários autenticados podem acessar recursos sensíveis.
- **Validação de dados**: Zod + pipes globais para garantir integridade.
- **Boas práticas de tratamento de erros**.

---

## ⚡ Cache Inteligente

- **Cache global com Redis**: Reduz consultas repetidas ao banco, melhora a performance.
- **Cache granular**: Listagem e saldo de movimentações são cacheados por usuário/página.
- **Bypass automático**: Cache é ignorado quando há filtros por data, garantindo dados sempre atualizados.

---

## 🧪 Testes Automatizados

- **Cobertura de testes unitários e E2E** com Vitest.
- **Factories** para geração de dados de teste realistas.
- **Mocks** para isolamento de dependências (ex: cache, repositórios).
- **Testes de autenticação, cadastro, login, movimentações, filtros, paginação e saldo**.
- **Cobertura de erros e fluxos alternativos**.

---

## 🐳 Docker & Deploy

- **Dockerfile**: Build otimizado, ambiente isolado.
- **docker-compose.yml**: Orquestração de app, banco PostgreSQL e Redis.
- **Variáveis de ambiente**: Configuração flexível para produção e desenvolvimento.
- **Pronto para deploy em qualquer ambiente Docker**.

---

## 📚 Documentação & Uso

- **Swagger**: Acesse `/docs` após subir o projeto para explorar e testar todos os endpoints.

---

## 🛠️ Como rodar o projeto

1. **Clone o repositório**
2. **Configure o `.env`** (baseado no `.env.example`)
3. **Suba com Docker Compose**:
   ```sh
   docker-compose up --build
