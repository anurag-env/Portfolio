# ACHIEVEMENTS.md
### Master source file for resume building — Anurag Singh
*Last updated: August 2026. Keep this file as the single source of truth. When building a resume for a specific role, pull and trim from here — don't rewrite from scratch.*

---

## 📇 CONTACT / LINKS

| Field | Value |
|---|---|
| Name | Anurag Singh |
| Email | anuragsingh.eu@gmail.com |
| LinkedIn | https://www.linkedin.com/in/anu-env/ |
| GitHub | https://github.com/anurag-env |
| Portfolio | https://anurag-env.github.io/Portfolio-website/ |
| Location | Katra, J&K, India |

---

## 🎯 SUMMARY / OBJECTIVE (draft — tailor per role)

> Final-year Computer Science undergraduate with hands-on experience across full-stack development (React, Django), applied NLP/ML (transformer fine-tuning, RAG pipelines), and production internship work shipping AI-integrated features to real users. Published first-author research (96% accuracy, 0.95 macro-F1) at an international conference. Seeking an SDE/AI-ML internship or entry-level role to apply strong fundamentals in system design, model development, and end-to-end delivery.

**Variants to swap in depending on target role:**
- **SDE-focused:** lead with Eduspheria scale (97K LOC, 60+ pages) and full-stack breadth.
- **AI/ML-focused:** lead with the RoBERTa paper (96% acc, 0.95 F1) and RAG-RERoBERTa research.
- **Research-focused:** lead with first-author NLPIR 2026 acceptance + ongoing biomedical QA research.

---

## 🎓 EDUCATION

**B.Tech, Computer Science and Engineering**
Shri Mata Vaishno Devi University | Aug 2023 – May 2027
- CGPA (through 6th semester): **7.5 / 10**
- Relevant coursework: Deep Learning, Computer Vision, NLP, Machine Learning

---

## 💼 EXPERIENCE

### 1. Software Development Intern — Eduspheria
*Jun 2026 – Aug 2026 (3 months)*
EdTech startup building AI-powered school management and tutoring software (**Saksham** — school-ops dashboard, **Sarthi** — K-12 tutoring platform), used by schools across India.

**Saksham (React frontend):**
- Developed and maintained a production-grade **React 18 SPA** — **~97,000 LOC across 60+ pages** — used by directors, principals, teachers, and accountants for school operations.
- Built data-intensive modules (fee management, attendance, payroll, timetabling, accounting ledgers) using **Material UI (MUI 6)** and **MUI DataGrid**.
- Implemented **role-based access control (RBAC)** across **6 user roles** with dynamic navigation, route-level gating, and subscription-tier feature gating.
- Integrated AI features: AI poster generator (**DALL·E 3**), AI question-paper generation, and a conversational AI assistant with **WebSocket**-based real-time messaging.
- Built a real-time layer with **WebSockets** and **Firebase Cloud Messaging** for live monitoring, AI nudges, and push notifications.
- Shipped **PWA** support (offline mode, install prompts, push notifications) and **i18n** infrastructure via `react-i18next`.
- Consumed **30+ REST API endpoints** (Django REST Framework) with token auth, centralized error handling, and automatic subscription-gating.

**Sarthi (interactive exercises & simulations):**
- Designed and built **5+ original gamified educational exercises** (Mars Colonization Mission, Hardware Hero, Time Traveler Evolution, Blockchain Mining Simulator, Kaguya's Bamboo Harvest) in vanilla **HTML/CSS/JavaScript**, with multi-level progression, scoring, and drag-and-drop mechanics for Grades 5–12.
- Integrated **100+ PhET science/math simulations** via iframe wrappers and a **postMessage**-based communication protocol with the parent React app.
- Implemented **TTS voice narration** (ElevenLabs in production, Web Speech API locally) through a shared gameAPI bridge for accessible, guided learning.
- Contributed **~180,000+ lines of code** across **21 commits** on a dedicated feature branch, in a **6-person team** with Gitea-based PR review; one of the top 3 contributors by commit volume.

**Merged skills used:** React 18, JavaScript (ES6+), HTML5/CSS3, MUI 6, Framer Motion, Recharts, Formik + Yup, Vite 6, ESLint, PWA (vite-plugin-pwa), Git, Gitea, React Context API, React Router DOM 7, WebSockets, Firebase Cloud Messaging, postMessage/iframe architecture, MUI X DataGrid, RESTful APIs, Token Auth (DRF), Django, Sentry/GlitchTip, DALL·E 3, ElevenLabs TTS, Web Speech API, RBAC, i18n, QR scanning, Canvas API.

**Concise bullets (pick 4–6 for a one-page resume):**
- Built and maintained Saksham, a 60+ page React 18 school-management SPA (~97K LOC) with RBAC across 6 user roles, serving schools across India.
- Integrated AI features into Saksham — DALL·E 3 poster generation, AI question-paper generation, and a WebSocket-based conversational assistant.
- Designed 5+ original gamified learning exercises (JS/HTML/CSS) with scoring, progression, and TTS narration for the Sarthi K-12 tutoring platform.
- Integrated 100+ PhET simulations via an iframe/postMessage architecture connecting exercises to the parent app for AI content and voice synthesis.
- Shipped PWA support, i18n, and real-time WebSocket/FCM notifications; consumed 30+ REST APIs (DRF) with token auth.
- Collaborated in a 6-person team using Gitea, feature branches, and PR-based review across two production codebases.

**Interview talking points:**
- *Technical challenge:* On Saksham — RBAC/subscription-gating cleanly across 6 roles and 60+ pages without duplicated logic. On Sarthi — iframe sandboxing so exercises run standalone locally but integrate in production via a shared postMessage API client handling voice synthesis, LLM calls, and activity tracking with token auth.
- *Impact:* Shipped production features (RBAC, real-time notifications, AI integrations) used daily by school staff; built 5 original exercises and integrated 100+ simulations used by students Grades 5–12.

---

### 2. Freelance Software & AI Engineer — Independent
*2023 – Present*
- Delivered software, AI/ML, data analytics, and research-engineering projects for clients, translating technical requirements into functional solutions and documented deliverables.
- Developed and experimented with AI/ML applications involving RAG pipelines, NLP, LLM APIs, AI agents, embeddings, vector databases, and ML workflows.
- Built backend and web applications using Python, Django, Django REST Framework, JavaScript/Node.js, REST APIs, SQL/SQLite/PostgreSQL.
- Conducted end-to-end technical work: dataset preparation, preprocessing, model implementation, evaluation, visualization, experimentation, technical documentation.
- Created **Power BI dashboards** and Excel-based analytical solutions, transforming raw datasets into structured reports, visualizations, KPIs, and decision-support outputs.
- Worked with cloud/dev infrastructure: AWS services, Linux, Git, databases, package management, APIs, deployment/configuration workflows.
- Researched and implemented solutions across generative AI, ML, NLP, healthcare AI, cybersecurity, data analytics, and intelligent automation.
- Troubleshot software/infra issues involving Python environments, Node.js/npm, databases, Redis, PostgreSQL, AWS configs, FFmpeg, dev tooling.
- Managed multiple concurrent client projects end-to-end: requirement analysis, research, implementation, testing, documentation, revisions, delivery.
- Background: ~6 months of prior technical research and academic writing freelancing before pivoting fully to CS/placement prep — contributes to strong research-writing fluency.

---

## 📄 PUBLICATIONS / RESEARCH

### 1. RoBERTa-Driven Transformer Framework for Context-Aware Sentiment Classification of Social Media Text
**First Author** · Accepted — **NLPIR 2026, Nara, Japan**
Co-authors: Anurag Singh, Devesh Singh, Baijnath Kaushik, Subha Mahajan, Tavneet Singh — Shri Mata Vaishno Devi University
GitHub: *(add link)*

- Designed and fine-tuned an end-to-end **RoBERTa-based** (cardiffnlp/twitter-roberta-base-sentiment) transformer pipeline for 3-class sentiment classification (positive/negative/neutral) on **18,170** YouTube comments, achieving **96% accuracy** and **0.96 weighted F1** / **0.95 macro-F1** on an independent test set.
- Built a domain-specific preprocessing pipeline (URL/hashtag/mention removal, text normalization) for noisy, informal social media text.
- Addressed severe class imbalance (**62.6% positive vs. 12.9% negative**) via **weighted cross-entropy loss** and **label smoothing**, improving minority-class recall without sacrificing overall performance.
- Fine-tuned using **AdamW** with learning-rate scheduling, gradient clipping, and a stratified **70/15/15** train/val/test split — PyTorch + Hugging Face Transformers, GPU-accelerated.
- Conducted error analysis via confusion matrix; identified neutral-vs-positive boundary ambiguity as the primary misclassification source.
- **Tech stack:** Python, PyTorch, Hugging Face Transformers, RoBERTa, AdamW

**ATS keywords covered:** NLP, Transformers, Fine-tuning, Transfer Learning, Class Imbalance Handling, Weighted Cross-Entropy, Label Smoothing, Hyperparameter Scheduling, Model Evaluation, F1-Score, Confusion Matrix, GPU Acceleration.

---

### 2. RAG-RERoBERTa: Explainable Multilingual Biomedical Question Answering
**Undergraduate Research** — *In Progress* (do not use "published"/"accepted" until true; use "Research Paper — In Progress" or "Under preparation")

- Designed a novel **Recursive Embedding Refinement** mechanism (Eₜ₊₁ = Attention(Eₜ) + GRU(Eₜ)) that iteratively converges representations for biomedical QA, targeting **+4–8% accuracy** over BioBERT, PubMedBERT, and ClinicalBERT baselines.
- Engineered a **5-stage curriculum training pipeline** (PyTorch) across **3 biomedical datasets** — PubMedQA (273K samples), MedQA (12.7K), HealthSearchQA (4.4K) — with **Optuna** Bayesian hyperparameter optimization over **50+ trials**.
- Implemented **Graph Attention Networks (GAT)** for evidence aggregation over biomedical knowledge graphs (Disease–Drug–Symptom–Procedure) to ground answers in retrieved PubMed evidence.
- Integrated **SHAP** and **Integrated Gradients** explainability modules for per-prediction attention heatmaps and feature attribution.
- Built an end-to-end multilingual inference pipeline: **IndicTrans2** (English↔Hindi) + **VITS/XTTS-v2** TTS, evaluated with BLEU, METEOR, BERTScore, PESQ, STOI.
- Developed an evaluation framework covering **15+ metrics** across 4 categories (QA, Explainability, Translation, Speech) with automated ablations over attention heads and recursive iteration depths.
- **Tech stack:** Python, PyTorch, Hugging Face Transformers, RoBERTa, GAT (torch-geometric), SHAP, Captum, Optuna, TensorBoard, VITS, IndicTrans2, scikit-learn

**Placement guidance:** Use "Research Experience" section for AI/ML-targeted resumes; "Projects" section for general SDE resumes. STAR-format talking point already drafted — see below.

**Interview STAR:**
- *Situation:* Undergraduate research targeting a Q1/SCI publication in biomedical NLP.
- *Task:* Improve biomedical QA accuracy by 4–8% over BioBERT/PubMedBERT baselines.
- *Action:* Designed recursive embedding refinement mechanism; built training pipeline with 5-stage curriculum learning, Optuna search, SHAP/Integrated Gradients explainability.
- *Result:* Currently in training phase; architecture includes GAT evidence grounding + multilingual voice output; targeting submission to [Journal Name].

---

## 🛠️ PROJECTS

### 1. RoBERTa Sentiment Classification *(see Publications above for full detail — same project, dual-listed if resume has no Research section)*

### 2. Pragya — Local RAG Research Assistant
*Llama3 · ChromaDB · MiniLM · Streamlit* | GitHub: *(add link)*
- Built a fully local, zero-cloud **RAG system** using **Llama3** and **MiniLM** embeddings to make complex research papers accessible in both technical and lay-audience formats.
- Implemented **section-aware chunking** with **PyMuPDF + ChromaDB**, improving retrieval relevance over naive chunking; mean query latency **under 400ms** on CPU hardware.

### 3. AI Research Paper Writer
*Python, DeepSeek LLM, OpenAI API, python-docx* | Personal Project — 2026
- Engineered an end-to-end automated research paper generation pipeline (Python + DeepSeek LLM via OpenAI API) producing publication-ready DOCX documents from a single topic input.
- Designed a **modular 10+ module NLP pipeline**: topic expansion, AI-driven outline generation, section writing, abstract generation, reference synthesis (Harvard/APA), table planning, dynamic table generation, figure planning, Graphviz/Chart.js figure rendering.
- Built a media placement engine that parses markdown-structured text into typed blocks, performs fuzzy section matching, and injects contextual in-text references with optimal table/figure positioning.
- Integrated **QuickChart.io API** for automated Graphviz DOT diagrams and Chart.js visualizations, with retry-and-regenerate fault tolerance.
- Developed a lightweight web UI with a Python HTTP server backend supporting **real-time streaming output**, subprocess orchestration, and interactive controls.
- Implemented structured prompt engineering across all LLM modules — temperature tuning, JSON schema enforcement, markdown cleaning.
- **Tech stack:** Python, LLM APIs, OpenAI SDK, NLP, python-docx, Graphviz, Chart.js, QuickChart API, JSON, Regex

**Concise version (one-page resume):**
- Built an automated research paper generation system (Python, LLM APIs) producing structured, publication-ready DOCX papers with auto-generated abstracts, references, tables, and figures from a single topic input.
- Architected a 10-module pipeline covering topic expansion, section writing, media planning, Graphviz/Chart.js figure generation via QuickChart API, and fuzzy-matched content placement.
- Developed a web-based UI with real-time streaming output and subprocess management.

### 4. NL2SQL — Text-to-SQL Model
*Python, T5, Hugging Face Transformers, QLoRA, WikiSQL*
- Fine-tuned **T5-small** for natural-language-to-SQL query generation on the **WikiSQL** dataset.
- Experimented with **QLoRA** (quantized low-rank adaptation) to fine-tune under a constrained **4GB VRAM (RTX 2050)** hardware budget — trading off adapter rank, quantization precision, and batch size to fit training within memory limits.
- Worked through the practical constraints of consumer-GPU fine-tuning: gradient checkpointing / memory-efficient training strategies to make transformer fine-tuning feasible on limited hardware.
- **Tech stack:** Python, PyTorch, Hugging Face Transformers, T5, QLoRA/PEFT, WikiSQL

> ⚠️ **Still need from you to make this ATS-maximal:** exact-match / execution accuracy on WikiSQL test set, final QLoRA config (rank, quant bits), training time, inference latency, and whether there's a demo/CLI/API wrapping it. Add these and I'll tighten the bullets with hard numbers.

**Interview narrative (why this is strong):** Demonstrates fine-tuning under real hardware constraints — a concrete, defensible story about trade-offs (QLoRA rank vs. accuracy vs. VRAM) that's more credible than "I fine-tuned a model" with unlimited compute.

---

### 5. Local Password Manager
*Electron, Node.js, SQLite, Argon2id, AES-256-GCM*
- Built a fully **local-only** (zero-cloud) password manager using **Electron**, developed across **5 structured phases** (data layer → crypto layer → UI → hardening → polish, roughly).
- Implemented **Argon2id** for master-password key derivation, tuned for a deliberate memory/time-cost balance to resist brute-force and GPU-cracking attacks while keeping unlock latency acceptable.
- Used **SQLite via better-sqlite3** for local encrypted storage, with attention to **WAL (write-ahead logging) checkpointing** for data durability and consistency.
- Encrypted stored credentials with **AES-256-GCM** (authenticated encryption), keeping decryption keys derived in-memory only, never persisted in plaintext.
- Designed with a strict security architecture: no network calls, no telemetry, minimal attack surface by design.
- **Tech stack:** Electron, Node.js, SQLite (better-sqlite3), Argon2id, AES-256-GCM, JavaScript

> ⚠️ **Still need from you to make this ATS-maximal:** Argon2id parameters (memory cost, iterations, parallelism) and why you chose them, specific WAL checkpointing decision/issue you solved, LOC or phase-by-phase scope, and any threat model you explicitly defended against (e.g., offline brute-force, memory dumping).

**Interview narrative (why this is strong):** A genuine security-engineering story — KDF parameter tuning is a concrete signal of understanding *why* Argon2id beats bcrypt/PBKDF2 for this use case, and WAL checkpointing shows you thought about durability, not just encryption.

---

## 🏆 ACHIEVEMENTS & LEADERSHIP

- **Smart India Hackathon 2025 Finalist** — Among **1,360 finalist teams** selected from **68,766** nationwide. Built **KrishiRakshak**, an AI platform for early wheat disease detection fusing satellite imagery, drone surveillance, and farmer-uploaded leaf images to generate real-time disease risk maps and predictive advisories. Tech: React, Node.js, Python, PyTorch, TensorFlow, MongoDB.
- **AI Club Co-Lead**, SMVDU — Directing AI initiatives and technical workshops on Deep Learning and Computer Vision for **100+ students**.

---

## 🧰 TECHNICAL SKILLS

**Programming Languages:** Python, Java, C, C++, SQL, JavaScript (ES6+)

**ML/DL:** PyTorch, TensorFlow, Scikit-Learn, Hugging Face Transformers, Pandas, NumPy, MLflow, Optuna, torch-geometric (GAT), TensorBoard

**NLP:** RoBERTa, T5, Transformer fine-tuning, Attention Mechanisms, Class-imbalance handling (weighted cross-entropy, label smoothing), Tokenization, Text preprocessing/normalization, Explainable AI (SHAP, Captum/Integrated Gradients), Multilingual NLP (IndicTrans2), Text-to-Speech (VITS, XTTS-v2, ElevenLabs)

**LLMs / GenAI:** LLM APIs (OpenAI, DeepSeek), Prompt Engineering, RAG pipelines, Vector Databases (ChromaDB), Embeddings (MiniLM), Weights & Biases, AI Agents

**Web / Full-Stack:** React 18, Django, Django REST Framework, Node.js, REST APIs, Material UI, Vite, WebSockets, Firebase Cloud Messaging, PWA, i18n

**Databases:** SQL, SQLite, PostgreSQL, better-sqlite3

**Systems & Infra:** Linux, CUDA, Docker, Git, FastAPI, AWS, Redis, FFmpeg

**Data & Visualization:** Power BI, Excel (advanced/KPI reporting), Graphviz, Chart.js

**Security:** Argon2id, AES-256-GCM, Electron security architecture

---

## 📝 MAINTENANCE NOTES

1. Update this file first whenever a new project/internship/paper milestone happens — the resume gets built *from* this, not the other way around.
2. NL2SQL and Password Manager are now drafted from what I know of them — both still have a ⚠️ callout asking for hard numbers (accuracy, latency, Argon2id params, etc.). Fill those in next; they're your strongest technical-depth stories per past discussions.
3. Keep "In Progress" research honest until status changes — update the RAG-RERoBERTa entry the moment it's submitted/under review/published.
4. Add GitHub links for RoBERTa paper and Pragya project once available.
5. When trimming for a specific resume: SDE role → lead Eduspheria + AI Research Paper Writer + NL2SQL; AI/ML role → lead RoBERTa paper + RAG-RERoBERTa + Pragya; keep to 4–6 bullets per entry max on the actual one-pager.
