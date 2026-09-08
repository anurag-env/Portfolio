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
      "This work presents a context-aware sentiment classification framework built on a fine-tuned RoBERTa transformer, trained and evaluated on 18,170 real-world YouTube comments. The model addresses severe class imbalance through weighted cross-entropy loss and label smoothing, achieving 96% accuracy and a 0.95 macro-F1 score across three sentiment classes. Results demonstrate that context-aware fine-tuning substantially improves robustness on noisy, informal social media text compared to standard baselines.",
    pipeline: [
      { label: "Raw YouTube\nComments", icon: "fab fa-youtube" },
      { label: "Preprocessing", icon: "fas fa-filter" },
      { label: "RoBERTa\nFine-Tuning", icon: "fas fa-brain" },
      { label: "Context-Aware\nClassification", icon: "fas fa-tags" },
      { label: "Evaluation", icon: "fas fa-chart-line" },
    ],
    stats: [
      { value: "NLP" },
      { value: "Transformers" },
      { value: "Sentiment Analysis" },
      { value: "Class Imbalance" },
      { value: "Context-Aware Modeling" },
    ],
    links: {
      publication: "https://doi.org/10.1007/978-3-031-XXXXX-X",
      code: "https://github.com/anurag-env",
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
