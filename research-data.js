// =============================================================
// Research papers data
//
// To add a new paper, append a new object to the array below.
// The UI renders automatically — no code changes needed.
//
// Fields:
//   featured   – boolean, shows "FEATURED · PUBLICATION" tag
//   title      – paper title
//   authors    – author list string
//   venue      – conference/journal name
//   publisher  – publisher name (e.g. Springer LNNS)
//   year       – publication year
//   abstract   – 1-2 sentence summary
//   pipeline   – array of { label, icon } objects (3-6 nodes)
//   stats      – array of { value, label } objects
//   links      – { publication, code } (URLs)
//   bibtex     – BibTeX citation string
// =============================================================
window.__researchPapers = [
  {
    featured: true,
    title: "RoBERTa-Driven Transformer Framework for Context-Aware Sentiment Classification of Social Media Text",
    authors: "First Author",
    venue: "NLPIR 2026",
    publisher: "Springer LNNS",
    year: 2026,
    abstract:
      "This work presents a context-aware sentiment classification framework built on a fine-tuned RoBERTa transformer, trained and evaluated on 18,170 real-world YouTube comments. The model addresses severe class imbalance through weighted cross-entropy loss and label smoothing, achieving 96% accuracy (weighted F1 0.96, macro F1 0.95) across three sentiment classes. Results demonstrate that context-aware fine-tuning substantially improves robustness on noisy, informal social media text compared to standard baselines.",
    pipeline: [
      { title: "Input layer", subtitle: "Raw YouTube comments", icon: "fab fa-youtube" },
      { title: "Text preprocessing", subtitle: "Cleaning, normalization, noise removal", icon: "fas fa-filter" },
      { title: "RoBERTa tokenization", subtitle: "BPE, padding and truncation", icon: "fas fa-align-left" },
      { title: "Transformer encoder", subtitle: "Self-attention, contextual embeddings", icon: "fas fa-brain" },
      { title: "Classification head", subtitle: "Weighted loss, label smoothing", icon: "fas fa-tags" },
      { title: "Output", subtitle: "96% accuracy, 0.96 weighted F1", icon: "fas fa-chart-line" },
    ],
    training: [
      "Transfer learning from cardiffnlp/twitter-roberta-base-sentiment",
      "AdamW optimizer, learning rate 2e-5",
      "Learning rate scheduling with warmup",
      "Max sequence length 256, 4 training epochs",
      "GPU-accelerated training (NVIDIA RTX 3050, CUDA 11.8)",
      "Stratified 70/15/15 train/validation/test split",
    ],
    performance: [
      { value: "96.0%", label: "Accuracy" },
      { value: "0.96", label: "Weighted F1" },
      { value: "0.95", label: "Macro F1" },
    ],
    stats: [
      { value: "NLP" },
      { value: "Roberta"},
      { value: "Transfer Learning"},
      { value: "Class Imbalance" },
      { value: "Sentiment Analysis"},
      { value: "Social Media Analytics"},
      { value: "Weighted Cross-Entropy"}
    ],
    links: {
      publication: "https://nlpir.net/",
      code: "https://github.com/Devesh-Singh-23/Text_Sentiment_Classification",
    },
    bibtex:
      '@inproceedings{singh2026roberta,\n  title     = {RoBERTa-Driven Transformer Framework for Context-Aware Sentiment Classification of Social Media Text},\n  author    = {Singh, Anurag and others},\n  booktitle = {Proc. International Conference on Natural Language Processing and Information Retrieval (NLPIR)},\n  year      = {2026},\n  publisher = {Springer},\n  series    = {LNNS}\n}',
  },
  // ── Add future papers below this line ──────────────────────
  {
    featured: false,
    title: "RAG-RERoBERTa: Explainable Multilingual Biomedical Question Answering",
    authors: "Undergraduate Research",
    venue: "",
    publisher: "",
    year: "Present",
    abstract:
      "Currently building a novel Recursive Embedding Refinement mechanism that iteratively converges biomedical text representations, integrated with Graph Attention Networks for evidence grounding over biomedical knowledge graphs. The framework is being trained across multiple biomedical datasets with curriculum learning and Optuna-based hyperparameter optimization, with explainability modules for per-prediction attention visualization.",
    pipeline: [],
    stats: [
      { value: "Biomedical NLP" },
      { value: "RAG" },
      { value: "Explainable AI" },
      { value: "Graph Attention" },
      { value: "Curriculum Learning" },
    ],
    links: {
      publication: "",
      code: "https://github.com/anurag-env",
    },
    bibtex: "",
  },
];
