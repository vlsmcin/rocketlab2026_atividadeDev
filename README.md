# RocketLab 2026 - Atividade Dev

Projeto full stack com backend em FastAPI + SQLite e frontend em React + Vite para gerenciamento e consulta de catalogo de produtos.

## Status dos requisitos principais

Os requisitos abaixo foram atendidos:

- [x] Eu gostaria de poder ter produtos com informacoes associadas.
- [x] Eu gostaria de poder navegar em um catalogo dos produtos.
- [x] Eu gostaria de poder acessar mais detalhes de cada produto, como medidas, vendas e avaliacoes feitas pelos consumidores.
- [x] Eu gostaria de poder buscar um ou mais produtos especificos.
- [x] Eu gostaria de poder adicionar, remover e atualizar os produtos individualmente.
- [x] Eu gostaria de poder ver a media das avaliacoes de um produto.

## Features opcionais implementadas

- Caching de consultas de produtos no backend.
- Autenticacao com JWT.
- Controle de acesso por perfil (admin para criar/editar/remover produto).
- Seed de administrador padrao.
- Tratamento de erros de API e validacoes.
- Documentacao automatica da API via Swagger (FastAPI /docs).
- Testes automatizados com pytest no backend.
- Paginacao via backend na listagem de produtos.
- Filtros e busca por nome/categoria.
- UI responsiva no frontend.


## Credenciais de admin no prototipo

As credenciais padrao de admin estao publicas porque este projeto e um prototipo educacional/local.

Padrao local:

- Usuario: admin@example.com
- Senha: admin123

Recomendada para producao:

- Nunca manter senha padrao publica.
- Definir credenciais seguras via variaveis de ambiente.
- Rotacionar segredo JWT e senhas.

## Como executar

## Backend

Entre na pasta backend (cd backend) e execute:

```bash
python -m venv venv
pip install -r requirements.txt
alembic upgrade head
python seed.py
python -m app.main
```

API:

- http://localhost:8000
- http://localhost:8000/docs

Para rodar os testes do backend:

```bash
pytest
```

## Frontend

Com pnpm instalado, entre na pasta frontend (cd frontend) e execute:

```bash
pnpm install
pnpm run dev
```

Frontend:

- http://localhost:5173

## Estrutura do repositorio

- backend: API, modelos, migrations, seed e testes.
- frontend: aplicacao React, paginas, componentes e hooks.
