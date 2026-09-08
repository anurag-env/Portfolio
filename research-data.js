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
    authors: "Anurag Singh, et al.",
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
      { label: "96% Accuracy", icon: "fas fa-chart-line" },
    ],
    stats: [
      { value: "96%", label: "accuracy" },
      { value: "0.95", label: "macro-F1" },
      { value: "18,170", label: "comments" },
    ],
    links: {
      publication: "https://doi.org/10.1007/978-3-031-XXXXX-X",
      code: "https://github.com/anurag-env",
    },
    bibtex:
      '@inproceedings{singh2026roberta,\n  title     = {RoBERTa-Driven Transformer Framework for Context-Aware Sentiment Classification of Social Media Text},\n  author    = {Singh, Anurag and others},\n  booktitle = {Proc. International Conference on Natural Language Processing and Information Retrieval (NLPIR)},\n  year      = {2026},\n  publisher = {Springer},\n  series    = {LNNS}\n}',
  },
  // ── Add future papers below this line ──────────────────────
  // {
  //   featured: false,
  //   title: "Your Next Paper Title",
  //   authors: "Anurag Singh, ...",
  //   venue: "VENUE 2027",
  //   publisher: "Publisher",
  //   year: 2027,
  //   abstract: "...",
  //   pipeline: [
  //     { label: "Step 1", icon: "fas fa-icon" },
  //     { label: "Step 2", icon: "fas fa-icon" },
  //     { label: "Step 3", icon: "fas fa-icon" },
  //   ],
  //   stats: [
  //     { value: "XX%", label: "metric" },
  //   ],
  //   links: { publication: "", code: "" },
  //   bibtex: "",
  // },
];
