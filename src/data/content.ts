/**
 * Single source of truth for every piece of copy on the site.
 * Keeping it here means the components stay presentational and content edits
 * never require touching JSX.
 */

export const profile = {
  name: "Govind Kumar",
  role: "AI/ML Developer",
  company: "Metro Infrasys Private Limited",
  location: "Delhi, India",
  email: "govindrajoria97@gmail.com",
  github: "https://github.com/GovindRajoria",
  githubHandle: "GovindRajoria",
  linkedin: "https://www.linkedin.com/in/govind-rajoria",
  headline:
    "I build edge-optimized computer vision systems for intelligent transportation.",
  summary:
    "Computer vision engineer working on Intelligent Transportation Systems — automatic traffic counting and classification, video incident detection, number plate recognition. The constraint that shapes everything I build is hardware: these models run on roadside edge devices, not datacentre GPUs, so the work is as much about quantization, threading and stream reliability as it is about accuracy.",
} as const;

export const stats = [
  { value: "90.8%", label: "Classification accuracy at 25 FPS", detail: "YOLO-based models after quantization and pruning" },
  { value: "99.9%", label: "Stream uptime", detail: "Multi-threaded RTSP ingestion with automated reconnection" },
  { value: "4", label: "Production CV systems", detail: "ATCC, VIDS, ANPR and AVC deployed on-site" },
  { value: "22%", label: "Query latency reduction", detail: "MySQL indexing and schema refinement" },
] as const;

export type Job = {
  role: string;
  company: string;
  location: string;
  period: string;
  current?: boolean;
  points: string[];
};

export const experience: Job[] = [
  {
    role: "AI/ML Developer",
    company: "Metro Infrasys Private Limited",
    location: "Noida",
    period: "Feb 2026 — Present",
    current: true,
    points: [
      "Architected a phased dual-model pipeline for ATCC, separating base vehicle localization from a centralized classification service to raise multi-camera system throughput.",
      "Engineered real-time Video Incident Detection (VIDS) on OpenVINO for edge deployment, mapping stalled-vehicle detections to precise stop-event triggers for reliable alerting.",
      "Held 99.9% stream uptime across deployments through multi-threaded RTSP ingestion paired with automated network probing and reconnection logic.",
      "Built configurable UDP-based radar monitoring applications with software-level logic filters that suppress hardware-induced data anomalies at ingest.",
      "Evaluate models against strict precision-recall targets to sustain high FPS on resource-constrained hardware, and serve the resulting insights into traffic management dashboards over REST APIs.",
    ],
  },
  {
    role: "Software Developer Trainee",
    company: "Metro Infrasys Private Limited",
    location: "Noida",
    period: "Jul 2025 — Jan 2026",
    points: [
      "Engineered three core systems in Python: ANPR, VIDS including vehicle stop detection, and Automatic Vehicle Classification (AVC).",
      "Reached 90.8% classification accuracy at 25 FPS on YOLO-based networks through systematic quantization and pruning.",
      "Led an architectural redesign and UI/UX modernization, decomposing monolithic codebases into modular microservices to shorten deployment cycles.",
      "Structured raw image capture pipelines for toll environments so production traffic continuously feeds training data back into model improvement.",
      "Managed on-site deployment and configuration of VASD and ANPR systems at the Rithwik and KNR-KERALA sites.",
      "Diagnosed and resolved gateway connectivity and camera misalignment faults, restoring reliable capture across four-lane highway setups.",
    ],
  },
  {
    role: "Database Engineering Intern",
    company: "EPlanet Technologies",
    location: "New Delhi",
    period: "Aug 2023",
    points: [
      "Optimized MySQL queries through strategic indexing and schema refinement, cutting execution time by 22% on high-traffic datasets.",
    ],
  },
];

export type System = {
  abbr: string;
  name: string;
  description: string;
};

export const systems: System[] = [
  {
    abbr: "ATCC",
    name: "Automatic Traffic Counter & Classifier",
    description:
      "Counts vehicles and sorts them by type as they pass a camera — the data highway authorities use for capacity planning and tolling. Runs as a two-stage pipeline: a lightweight model localizes vehicles per camera, then a shared classification service labels them, so one classifier serves many streams instead of duplicating work per feed.",
  },
  {
    abbr: "VIDS",
    name: "Video Incident Detection System",
    description:
      "Watches live highway feeds for events that need a response: stalled vehicles, stopped traffic, wrong-way movement. The engineering difficulty is not detection but discrimination — a vehicle in slow traffic must not raise the same alarm as one that has broken down, so detections are mapped to explicit stop-event triggers before anything alerts.",
  },
  {
    abbr: "ANPR",
    name: "Automatic Number Plate Recognition",
    description:
      "Reads registration plates from moving vehicles for toll and enforcement use. Accuracy is decided by conditions the model does not control — plate angle, motion blur, headlight glare, weather — which makes capture-pipeline design as consequential as the recognition model itself.",
  },
  {
    abbr: "AVC",
    name: "Automatic Vehicle Classification",
    description:
      "Assigns vehicles to toll categories by axle count and profile, so charging happens without a human in the loop. Misclassification has a direct revenue cost, which is what justifies aggressive optimization work to hold accuracy while meeting real-time frame budgets.",
  },
];

export type SkillGroup = {
  title: string;
  items: string[];
};

export const skills: SkillGroup[] = [
  {
    title: "Languages",
    items: ["Python", "C++", "TypeScript / JavaScript", "Kotlin", "SQL"],
  },
  {
    title: "Machine learning & vision",
    items: ["PyTorch", "TensorFlow", "TensorFlow Lite", "OpenCV", "YOLO (v8 / v11)", "SSD MobileNet", "scikit-learn", "NumPy", "Pandas"],
  },
  {
    title: "Edge optimization",
    items: ["OpenVINO", "TensorRT", "Quantization", "Pruning", "IR export & benchmarking", "Model evaluation (F1, AUC-ROC)"],
  },
  {
    title: "Backend & web",
    items: ["FastAPI", "Flask (REST APIs)", "Node.js", "Express", "React", "Vite", "asyncio"],
  },
  {
    title: "Agents & retrieval",
    items: ["LangGraph", "Ollama", "ChromaDB", "Kùzu", "Cypher", "GraphRAG", "Vector search"],
  },
  {
    title: "Data",
    items: ["MySQL", "SQLite", "Drizzle ORM", "JSON configuration"],
  },
  {
    title: "Systems & tooling",
    items: [
      "Docker",
      "Git",
      "GitHub Actions CI",
      "Linux / Ubuntu",
      "pytest",
      "Static analysis (Bandit, Semgrep)",
      "Multi-threaded RTSP ingestion",
      "UDP protocols",
      "Edge hardware deployment",
    ],
  },
];

export type Project = {
  name: string;
  blurb: string;
  stack: string[];
  repo: string;
  highlight?: string;
};

export const projects: Project[] = [
  {
    name: "pipeline-sentry",
    blurb:
      "Static analyser for ML and computer-vision codebases. Maps a Python repository into an embedded Cypher property graph and an AST-aligned vector index, then audits it with six rules written for the failure modes that break inference services — model paths that resolve against the working directory, unreleased camera handles, inference without no_grad(), torch.load without weights_only. Findings come from bandit, semgrep and pip-audit rather than from a model, because a deterministic scanner beats an 8B LLM at pattern matching. Fixtures ship in two halves, so precision is measured rather than claimed.",
    stack: ["Python", "Kùzu", "ChromaDB", "asyncio", "AST", "pytest"],
    repo: "https://github.com/GovindRajoria/pipeline-sentry",
    highlight: "913 files/s · 0 false positives",
  },
  {
    name: "FRIDAY",
    blurb:
      "A voice-driven desktop assistant that runs entirely on local hardware. Implements a ReAct reasoning loop over a local Llama 3.1, so it chains multiple tools to satisfy one request — searching, computing, drafting, then committing findings to a memory vault. Skills are auto-discovered from the filesystem and registered by manifest, so adding a capability means adding a file.",
    stack: ["Python", "Ollama", "faster-whisper", "YOLO11", "OpenVINO", "SQLite"],
    repo: "https://github.com/GovindRajoria/friday-assistant",
    highlight: "Local-first, no cloud inference",
  },
  {
    name: "Real-Time Object Detection (Android)",
    blurb:
      "On-device multi-object detection running SSD MobileNet V1 against a live Camera2 stream through TFLite Model Binding, with bounding boxes composited over the preview. CPU-only by design — no GPU delegate — to establish what is achievable inside a mid-range phone's compute budget. Reference implementation for the IJSREM publication.",
    stack: ["Kotlin", "TensorFlow Lite", "Camera2", "SSD MobileNet"],
    repo: "https://github.com/GovindRajoria/Real-Time-Object-Detection-Android-Application",
    highlight: "85% accuracy at 30 FPS",
  },
  {
    name: "Face Recognition System",
    blurb:
      "Real-time face recognition on CPU: Haar cascade detection to locate faces, LBPH to identify them. A three-stage pipeline — capture 120 grayscale crops per person, fit the recogniser, then run live inference with inverted-distance confidence and an unknown threshold rather than forcing every face to its nearest label. Chosen over a CNN embedding model precisely because it trains in seconds and runs without a GPU.",
    stack: ["Python", "OpenCV", "LBPH", "Haar cascades", "NumPy"],
    repo: "https://github.com/GovindRajoria/face-recognition-system",
    highlight: "CPU-only, no GPU required",
  },
  {
    name: "E-Commerce Platform",
    blurb:
      "Full-stack storefront with product catalogue, cart and authentication. React and TypeScript on the front end, Express with Drizzle ORM behind it, and a shared schema module keeping client and server types in agreement.",
    stack: ["React", "TypeScript", "Node.js", "Express", "Drizzle ORM"],
    repo: "https://github.com/GovindRajoria/E-Commerce",
  },
];

export const publication = {
  title: "Mobile Real-Time Object Detection with SSD MobileNet",
  venue: "International Journal of Scientific Research in Engineering and Management (IJSREM)",
  year: "2025",
  url: "https://ijsrem.com/download/mobile-real-time-object-detection-with-ssd-mobilenet",
  doi: "10.55041/IJSREM47895",
  abstract:
    "Peer-reviewed analysis of resource-constrained deployment bottlenecks, focused on optimizing SSD MobileNet architectures for high-speed inference on mobile devices.",
} as const;

export const education = {
  degree: "B.Tech, Artificial Intelligence & Data Science",
  institution: "University School of Automation & Robotics",
  university: "GGSIPU, Delhi",
  period: "2021 — 2025",
  gpa: "8.25 / 10",
} as const;

export const certifications = [
  { name: "Full Stack Developer", issuer: "GeeksforGeeks" },
  { name: "Data Analytics & Visualization", issuer: "Forage" },
  { name: "Power BI for Beginners", issuer: "Skillup" },
] as const;

/** Order mirrors the order sections appear on the page, so the scroll-spy
 *  highlight always moves forward as the visitor scrolls. */
export const navLinks = [
  { href: "#experience", label: "Experience" },
  { href: "#systems", label: "Systems" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#background", label: "Background" },
  { href: "#contact", label: "Contact" },
] as const;
