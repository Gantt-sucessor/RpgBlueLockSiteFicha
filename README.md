# Fórmula do Ego — Fichas Digitais

Site de fichas para o sistema **Fórmula do Ego** (RPG de Blue Lock, por xxpaodeforma).
HTML + CSS + JS puro (sem frameworks/build step), com Firebase (Firestore) para
sincronizar campanhas e fichas em tempo real entre Mestre e jogadores.

## O que o site faz

- **Fichas totalmente editáveis a qualquer momento**, sem ordem obrigatória: clique
  em qualquer atributo, fôlego, token de ego etc. para editar livremente.
- **Hexágono de atributos clicável** (inspirado no selo de status do Blue Lock):
  clique numa ponta para rolar aquele atributo automaticamente.
- **Campanhas compartilhadas**: o Mestre cria uma campanha e recebe um código de
  convite. Todo jogador que entra vê os status de todo mundo (incluindo o Mestre).
- **Botão "Passar Rodada"** (só visível para o Mestre): decrementa automaticamente
  o cooldown de todas as habilidades ativas de todos os jogadores da campanha.
- Funciona em qualquer sistema operacional e é responsivo para celular.

## Como configurar (passo a passo)

### 1. Criar o projeto Firebase (gratuito)

1. Acesse https://console.firebase.google.com e crie um novo projeto.
2. No menu lateral, vá em **Build > Authentication** → aba "Sign-in method" →
   ative o provedor **Anônimo**.
3. Vá em **Build > Firestore Database** → "Criar banco de dados" → escolha o
   modo de produção (vamos ajustar as regras de segurança a seguir) → escolha
   a região mais próxima (ex: `southamerica-east1`).
4. Nas **Regras** do Firestore, cole isto (permite leitura/escrita básica; ajuste
   depois se quiser mais segurança):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /fichas/{fichaId} {
      allow read, write: if request.auth != null;
    }
    match /campanhas/{campanhaId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

5. Volte em **Configurações do projeto** (ícone de engrenagem) → role até
   "Seus apps" → clique no ícone `</>` (Web) → registre um app (não precisa
   de Hosting) → copie o objeto `firebaseConfig` que aparece.

### 2. Colar as credenciais no projeto

Abra o arquivo `js/firebase-config.js` e substitua este bloco pelos valores
copiados do passo anterior:

```js
const firebaseConfig = {
  apiKey: "SUA_API_KEY_AQUI",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  projectId: "SEU_PROJETO",
  storageBucket: "SEU_PROJETO.appspot.com",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID"
};
```

### 3. Subir na Vercel

1. Crie uma conta em https://vercel.com (pode entrar com GitHub).
2. Suba esta pasta para um repositório no GitHub (ou use `vercel` CLI direto
   na pasta, sem precisar de GitHub).
3. Na Vercel: "Add New… > Project" → importe o repositório → como é só
   HTML/CSS/JS puro, não precisa configurar build command nem framework
   (deixe em branco / "Other"). Clique em Deploy.
4. Pronto — a Vercel te dá uma URL pública (ex: `seu-projeto.vercel.app`).

## Estrutura de arquivos

```
index.html              → página inicial (entrar, criar/entrar em campanha)
entrar-campanha.html    → escolher ficha ao entrar via convite
ficha.html              → a ficha de personagem (todas as abas)
mestre.html             → painel do Mestre (visão de todos + Passar Rodada)

css/                    → estilos (um arquivo por página + base/componentes)
js/data/                → todo o conteúdo do sistema (classes, essências, etc.)
js/engine-regras.js     → cálculos: dados, fórmulas, cooldowns
js/store.js             → leitura/escrita no Firestore
js/firebase-config.js   → SUAS credenciais do Firebase (editar aqui)
js/ficha-core.js        → núcleo da página de ficha
js/secao-*.js           → cada aba da ficha é um módulo separado
```

## Observações

- O "login" é só um nome guardado no navegador (localStorage) + uma conta
  anônima do Firebase Auth por trás — não tem senha, é só pra identificar
  quem é o dono de cada ficha/campanha.
- Cada jogador pode usar a mesma ficha em vários dispositivos (basta abrir o
  mesmo link `ficha.html?id=...`).
- O sistema "Fórmula do Ego" é fan content não-oficial, sem fins lucrativos.
  Blue Lock pertence a Muneyuki Kaneshiro e Yusuke Nomura.
