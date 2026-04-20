# CicloCampo 🌿

O **CicloCampo** é uma solução tecnológica voltada para a gestão de cultivos escolares e rastreabilidade de alimentos em zonas rurais. O projeto transforma a horta escolar em um laboratório de ciência de dados, permitindo que professores e alunos monitorem o ciclo de vida das plantas desde a semente até a colheita.

## 🚀 O Projeto

Nas escolas de zona rural, o contato com a terra é parte da identidade dos alunos. O **CicloCampo** utiliza tecnologia para potencializar esse aprendizado, criando uma "Identidade Digital" para cada canteiro através de QR Codes e registros fotográficos sistemáticos.

### Diferenciais:
- **Mediador Tecnológico:** Desenvolvido respeitando a legislação de uso de celulares, onde o professor é o operador do sistema em sala/campo.
- **Data-Driven:** Transforma a prática do plantio em dados reais para aulas de Ciências e Matemática.
- **Rastreabilidade:** Permite saber exatamente quem cuidou, como foi o manejo e quanto tempo levou cada colheita.

---

## 🛠️ Stack Técnica

O projeto foi concebido para ser escalável, seguro e de baixo custo de manutenção.

- **Frontend:** [React](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/) (Interface moderna e tipagem estrita).
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/) (Design responsivo e alto contraste para uso em campo).
- **Backend-as-a-Service:** [Supabase](https://supabase.com/) (PostgreSQL, Auth e Storage).
- **PWA:** Suporte a funcionamento offline para áreas com conectividade instável.

---

## 📊 Arquitetura de Dados

O sistema utiliza uma arquitetura **Multi-tenant**, garantindo que cada escola tenha seus dados isolados e seguros.

### Entidades Principais:

- `Schools`: Unidades escolares (Tenants).
- `Plots`: Áreas físicas de cultivo (Canteiros).
- `Batches`: Ciclos de produção (Lotes). Relaciona uma cultura a uma turma específica.
- `Batch_Events`: Timeline de eventos (Irrigação, adubação, mudança de fase).

> **Integridade:** O sistema utiliza Chaves Estrangeiras (FK) compostas e Row Level Security (RLS) para garantir que um professor só acesse os dados da sua respectiva unidade.

---

## 📱 Fluxo da Aplicação

1. **Início do Ciclo:** O professor registra um novo plantio (Batch) vinculado a um canteiro (Plot).
2. **Monitoramento:** Via QR Code, o professor acessa a "Timeline" do canteiro e registra ações rápidas (irrigação, fotos de pragas ou notas de crescimento).
3. **Fases de Desenvolvimento:** O sistema rastreia as fases biológicas (Plantio, Desenvolvimento, Floração e Colheita).
4. **Fechamento:** Ao colher, o sistema gera um resumo estatístico do ciclo, que pode ser utilizado em feiras de ciências e relatórios pedagógicos.

---

## 🎯 Objetivo Pedagógico (BNCC)

O CicloCampo não é apenas uma ferramenta de gestão, mas um apoio pedagógico:
- **Ciências:** Estudo de botânica, ciclo da água e ecologia.
- **Matemática:** Leitura de gráficos, estatística e contagem de tempo.
- **Cultura Digital:** Introdução ao pensamento computacional e rastreabilidade.

---

## 👨‍💻 Desenvolvedor

**André Bandeira**
*Engenheiro de Software & Estudante de Análise e Desenvolvimento de Sistemas.*
Atualmente atuando na Secretaria de Educação, unindo tecnologia e gestão pública para transformar a educação.

---
