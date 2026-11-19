import type { SeedUnit } from './types.ts';

export const unit5: SeedUnit = {
  unitNumber: 5,
  slug: 'unit-5-web4-and-emerging-tech',
  title: 'Web 4.0 and Emerging Technologies',
  subtitle: 'Unit 5 · Symbiotic AI Web, Decentralized Web, IoT, Spatial AR/VR, Automation & 5G',
  description:
    'Future-focused study of Web 4.0 (Symbiotic Web), AI-powered personalized web experiences, Decentralized Web (DWeb), Blockchain integration, Web of Things (IoT), WebXR (AR & VR), Smart Web, Adaptive Interfaces, Web Automation, and 5G impact on web architectures.',
  examWeight: '20% Weightage',
  estimatedHours: 7,
  syllabus: [
    'Web 4.0',
    'AI-Powered Web and Personalized Content',
    'Decentralized Web (DWeb)',
    'Blockchain Integration',
    'Internet of Things (IoT) in Web Development',
    'Augmented Reality (AR) in Web',
    'Virtual Reality (VR) in Web',
    'Smart Web',
    'Adaptive Interfaces',
    'Web Automation',
    'Impact of 5G on Web Technologies',
  ],
  quickRevision: [
    'Web 4.0 (Symbiotic Web) blends ubiquitous AI agents, real-time IoT context, spatial interfaces, and autonomous decision support.',
    'Decentralized Web (DWeb) replaces single-server URLs with content-addressed storage (IPFS CIDs), P2P routing, and DIDs.',
    'Web of Things (WoT) exposes IoT sensors and actuators via HTTP REST, MQTT, and WebSockets.',
    'WebXR Device API powers browser-native AR (digital overlays on physical world) and VR (fully immersive 3D environments).',
    'Adaptive Interfaces adjust layout density, contrast, navigation, and pacing dynamically to user context and accessibility.',
    '5G delivers multi-Gbps throughput, <10ms ultra-low latency, and massive IoT device density (mMTC) for cloud-streamed web apps.',
  ],
  diagrams: [
    {
      diagramKey: 'u5-web4-evolution',
      title: 'Evolution of Web 1.0 to Web 4.0',
      category: 'Comparison',
      summary:
        'Full generational arc from Static Read-Only (1.0) -> Social Read-Write (2.0) -> Semantic/Decentralized (3.0) -> Symbiotic AI Web (4.0).',
      steps: [
        { step: 1, label: 'Web 1.0 · Information', detail: 'Static HTML documents and directory hyperlinks.' },
        { step: 2, label: 'Web 2.0 · Social', detail: 'Interactive UGC platforms, AJAX, and mobile cloud APIs.' },
        { step: 3, label: 'Web 3.0 · Semantic & Trust', detail: 'RDF/OWL knowledge graphs and verifiable ledgers.' },
        { step: 4, label: 'Web 4.0 · Symbiotic AI', detail: 'Autonomous agents, spatial XR, IoT fusion, and adaptive UX.' },
      ],
    },
    {
      diagramKey: 'u5-ai-web-arch',
      title: 'AI-Powered Web & Personalization Architecture',
      category: 'Architecture',
      summary:
        'Connects behavioral context streams, vector embeddings, inference pipelines, and adaptive UI rendering.',
      steps: [
        { step: 1, label: 'Telemetry & Intent Capture', detail: 'Tracks study progress, quiz gaps, and viewport interactions.' },
        { step: 2, label: 'Feature Store & Vector DB', detail: 'Indexes semantic embeddings of curriculum concepts.' },
        { step: 3, label: 'ML / LLM Inference Gateway', detail: 'Generates personalized study paths and adaptive hints.' },
        { step: 4, label: 'Dynamic UI Hydration', detail: 'Streams tailored components seamlessly to the client.' },
      ],
    },
    {
      diagramKey: 'u5-dweb-arch',
      title: 'Decentralized Web (DWeb) Architecture (IPFS & DID)',
      category: 'Architecture',
      summary:
        'Contrasts location-addressed HTTP servers with content-addressed P2P nodes (IPFS CIDs) and self-sovereign identity.',
      steps: [
        { step: 1, label: 'Content Hashing (CID)', detail: 'Files chunked into Merkle DAGs producing cryptographic Content IDs.' },
        { step: 2, label: 'Distributed Hash Table (DHT)', detail: 'Peers locate nearest node hosting requested CID blocks.' },
        { step: 3, label: 'DID & Verifiable Identity', detail: 'Cryptographic keypairs authenticate users without central IdPs.' },
        { step: 4, label: 'Peer-to-Peer Verification', detail: 'Client verifies hash integrity locally upon download.' },
      ],
    },
    {
      diagramKey: 'u5-blockchain-int',
      title: 'Web Application Blockchain Integration Flow',
      category: 'Process',
      summary:
        'Shows how a modern web frontend interacts via JSON-RPC / Web3 provider with Smart Contracts and off-chain indexing.',
      steps: [
        { step: 1, label: 'Web Client & Wallet Signer', detail: 'User authorizes action via cryptographic signature in browser.' },
        { step: 2, label: 'JSON-RPC Node Gateway', detail: 'Signed transaction relays to blockchain validator network.' },
        { step: 3, label: 'Smart Contract Execution', detail: 'Deterministic on-chain state update emits verified event logs.' },
        { step: 4, label: 'Off-Chain Indexer Sync', detail: 'Web backend indexes events into PostgreSQL for fast UI queries.' },
      ],
    },
    {
      diagramKey: 'u5-iot-arch',
      title: 'IoT & Web of Things (WoT) Architecture',
      category: 'Architecture',
      summary:
        'Four-layer stack bridging physical sensors via MQTT/CoAP gateways to cloud analytics and live WebSocket web dashboards.',
      steps: [
        { step: 1, label: 'Perception Layer (Sensors)', detail: 'Edge microcontrollers sample temperature, motion, or power.' },
        { step: 2, label: 'Network & Gateway (MQTT/5G)', detail: 'Lightweight publish-subscribe brokers aggregate telemetry.' },
        { step: 3, label: 'Cloud Processing & Rules', detail: 'Stream engine stores time-series data and triggers alerts.' },
        { step: 4, label: 'Web Dashboard (WebSockets)', detail: 'Browser renders live charts and remote actuator controls.' },
      ],
    },
    {
      diagramKey: 'u5-ar-vs-vr',
      title: 'Augmented Reality (AR) vs Virtual Reality (VR) in WebXR',
      category: 'Comparison',
      summary:
        'Compares camera pass-through digital overlays (AR) against fully occluded synthetic 3D worlds (VR) using WebGL/WebXR.',
      steps: [
        { step: 1, label: 'Environment Context', detail: 'AR keeps physical world visible; VR replaces view completely.' },
        { step: 2, label: 'Sensor Tracking (SLAM / 6DoF)', detail: 'WebXR tracks head pose, planes, and hand controllers.' },
        { step: 3, label: 'WebGL / WebGPU Rendering', detail: 'GPU renders 3D meshes at 60–120 FPS in browser frame.' },
        { step: 4, label: 'Target Hardware', detail: 'AR runs on smartphones/smart glasses; VR on dedicated headsets.' },
      ],
    },
    {
      diagramKey: 'u5-smart-web',
      title: 'Smart Web Context-Aware Architecture',
      category: 'Architecture',
      summary:
        'Integrates semantic knowledge graphs, real-time sensor context, and proactive assistant workflows.',
      steps: [
        { step: 1, label: 'Multimodal Context Input', detail: 'Voice, location, schedule, and device state signals.' },
        { step: 2, label: 'Knowledge Graph Reasoning', detail: 'Connects entities and constraints across user services.' },
        { step: 3, label: 'Proactive Action Planner', detail: 'Synthesizes timely recommendations or automated tasks.' },
        { step: 4, label: 'Adaptive Surface Output', detail: 'Renders concise answers on desktop, watch, or voice.' },
      ],
    },
    {
      diagramKey: 'u5-5g-impact',
      title: 'Impact of 5G on Web Technologies',
      category: 'Architecture',
      summary:
        'Illustrates how eMBB (>1 Gbps), URLLC (<10ms), and mMTC (1M devices/km²) transform streaming, WebXR, and Edge Web apps.',
      steps: [
        { step: 1, label: 'eMBB (High Bandwidth)', detail: '4K/8K streaming, instant large WASM bundles, rich spatial 3D assets.' },
        { step: 2, label: 'URLLC (<10ms Latency)', detail: 'Real-time cloud gaming, remote robotics, zero-lag collaboration.' },
        { step: 3, label: 'mMTC (Massive IoT)', detail: 'Millions of urban sensors streaming telemetry into Web dashboards.' },
        { step: 4, label: 'Multi-Access Edge (MEC)', detail: 'Compute hosted directly at 5G cellular towers for instant response.' },
      ],
    },
  ],
  topics: [
    {
      orderIndex: 1,
      slug: 'web-4-0',
      title: 'Web 4.0 (The Symbiotic & Autonomous Web)',
      definition:
        'Web 4.0, often called the Symbiotic or Ubiquitous Web, is an emerging paradigm where humans, intelligent AI agents, physical IoT environments, and spatial interfaces interact seamlessly in real time.',
      explanation:
        'While Web 2.0 connected people and Web 3.0 structured machine-readable meaning and decentralized trust, Web 4.0 emphasizes proactive autonomy and context awareness. Instead of users manually searching ten websites to plan an exam schedule or trip, symbiotic web agents interpret intent, negotiate across services, integrate real-time sensor feeds, and surface adaptive experiences across phones, desktops, wearables, and spatial headsets.',
      examples: [
        {
          title: 'Symbiotic Web Scenario',
          description:
            'A proactive study web platform detecting upcoming university exam dates, identifying weak MCQ topics, and automatically assembling a timed revision sprint.',
        },
      ],
      keyTakeaways: [
        'Web 4.0 bridges digital web services with physical environments (IoT) and proactive AI.',
        'Shifts interaction from keyword search to goal-oriented autonomous assistance.',
      ],
      diagramKey: 'u5-web4-evolution',
    },
    {
      orderIndex: 2,
      slug: 'ai-powered-web-and-personalized-content',
      title: 'AI-Powered Web and Personalized Content',
      definition:
        'AI-Powered Web applications integrate machine learning, natural language processing, and real-time behavioral analytics to tailor content, search ranking, and workflows to each individual user.',
      explanation:
        'Modern web platforms embed AI across multiple layers: semantic vector search (understanding user intent rather than exact keywords), dynamic learning-path adaptation, automated accessibility captions/translations, and intelligent anomaly detection. Personalization engines balance relevance against user privacy by employing federated signals, explicit user preferences, and transparent recommendation controls.',
      examples: [
        {
          title: 'Adaptive Exam Preparation Feed',
          description: 'Prioritizing Unit 2 XML SAX/DOM drills when a student’s diagnostic score indicates schema confusion.',
        },
      ],
      keyTakeaways: [
        'Semantic embeddings improve search recall beyond literal keyword matching.',
        'Ethical AI personalization requires transparency, opt-out controls, and bias auditing.',
      ],
      diagramKey: 'u5-ai-web-arch',
    },
    {
      orderIndex: 3,
      slug: 'decentralized-web-dweb',
      title: 'Decentralized Web (DWeb)',
      definition:
        'The Decentralized Web (DWeb) re-architects web hosting, naming, and identity on peer-to-peer networks so content is resilient against central server failures and unilateral censorship.',
      explanation:
        'Traditional HTTP uses location-based addressing (asking a specific server IP for /file.pdf—if the server shuts down, the link returns 404). DWeb systems like IPFS (InterPlanetary File System) use content-based addressing: files receive a cryptographic Content Identifier (CID) derived from their hash, retrieved from any peer hosting the blocks via a Distributed Hash Table (DHT). Paired with Decentralized Identifiers (DIDs), users own their identity without central gatekeepers.',
      examples: [
        {
          title: 'Location Addressing vs Content Addressing',
          description: 'HTTP: https://server.com/notes.pdf (where it lives) vs IPFS: ipfs://bafybeig... (what it is, verified by hash).',
        },
      ],
      keyTakeaways: [
        'Content addressing guarantees integrity: tampering with a file changes its CID hash.',
        'Eliminates single points of failure while introducing P2P discovery latency trade-offs.',
      ],
      diagramKey: 'u5-dweb-arch',
    },
    {
      orderIndex: 4,
      slug: 'blockchain-integration',
      title: 'Blockchain Integration in Web Apps',
      definition:
        'Blockchain integration connects standard web frontends and backends with distributed ledger networks for verifiable ownership, tamper-proof audit trails, and programmable Smart Contracts.',
      explanation:
        'Hybrid Web + Blockchain architecture keeps fast UI state and heavy queries in relational databases (like PostgreSQL) while anchoring critical proofs—such as academic credential hashes, licensing rights, or audit logs—on-chain via JSON-RPC gateways and browser wallet signers. Smart Contracts automate deterministic state transitions when verifiable conditions are met.',
      examples: [
        {
          title: 'Hybrid Off-Chain + On-Chain Pattern',
          description: 'Store full PDF study guides on cloud/IPFS, store only the SHA-256 verification hash and issuer signature on-chain.',
        },
      ],
      keyTakeaways: [
        'Never store large media or sensitive PII directly on public blockchains; store hashes/proofs.',
        'Off-chain indexers synchronize blockchain events back into fast SQL queries for UI responsiveness.',
      ],
      diagramKey: 'u5-blockchain-int',
    },
    {
      orderIndex: 5,
      slug: 'iot-in-web-development',
      title: 'Internet of Things (IoT) in Web Development',
      definition:
        'IoT in web development (Web of Things, WoT) exposes physical sensors, smart appliances, and industrial actuators through standardized web protocols for monitoring and remote control.',
      explanation:
        'Resource-constrained IoT microcontrollers communicate over lightweight protocols like MQTT (publish-subscribe) or CoAP (UDP-based REST), relaying telemetry through edge gateways to cloud brokers. Web dashboards consume live device streams via WebSockets or Server-Sent Events (SSE), while W3C Web of Things Thing Descriptions standardize device capabilities in JSON-LD.',
      examples: [
        {
          title: 'Browser-Controlled Smart Lab Dashboard',
          description: 'ESP32 temperature sensor publishes JSON to MQTT broker -> Node.js server pushes updates via WebSocket -> React chart updates live.',
        },
      ],
      keyTakeaways: [
        'MQTT and WebSockets enable low-overhead bidirectional telemetry.',
        'Device authentication (mTLS / per-device tokens) is essential to prevent botnet hijacking.',
      ],
      diagramKey: 'u5-iot-arch',
    },
    {
      orderIndex: 6,
      slug: 'augmented-reality-ar-in-web',
      title: 'Augmented Reality (AR) in Web',
      definition:
        'Web-based Augmented Reality overlays interactive 3D digital objects, annotations, and telemetry directly onto a user’s live camera view of the physical world inside a browser.',
      explanation:
        'Powered by the WebXR Device API, WebGL/WebGPU, and real-time SLAM (Simultaneous Localization and Mapping) plane detection, WebAR eliminates app-store downloads—users simply open a URL to inspect 3D anatomy models on a desk, preview furniture at true 1:1 scale, or visualize lab equipment wiring overlays.',
      examples: [
        {
          title: 'Educational WebAR',
          description: 'Pointing a smartphone browser at a textbook diagram to inspect an interactive 3D rotating TCP/IP router model.',
        },
      ],
      keyTakeaways: [
        'Zero-install browser delivery dramatically increases user adoption over native AR apps.',
        'Relies on low-latency camera frame tracking and lightweight compressed glTF/GLB 3D models.',
      ],
      diagramKey: 'u5-ar-vs-vr',
    },
    {
      orderIndex: 7,
      slug: 'virtual-reality-vr-in-web',
      title: 'Virtual Reality (VR) in Web',
      definition:
        'Web-based Virtual Reality delivers fully immersive, stereoscopic 360-degree 3D environments rendered directly in browsers via WebXR and WebGL/Three.js.',
      explanation:
        'Unlike AR, VR occludes the physical surroundings, rendering separate left/right eye camera perspectives at 72–120 FPS with 6-Degrees-of-Freedom (6DoF) head and hand-controller tracking. Frameworks like Three.js and A-Frame let web developers build virtual science labs, architectural walkthroughs, and collaborative classrooms accessible from VR headsets and desktop fallback views.',
      examples: [
        {
          title: 'Virtual University Physics/Networking Lab',
          description: 'Students stepping inside a virtual server room in WebXR to wire switches and observe live packet paths.',
        },
      ],
      comparisonTable: {
        caption: 'WebAR vs WebVR Comparison',
        headers: ['Dimension', 'Augmented Reality (WebAR)', 'Virtual Reality (WebVR)'],
        rows: [
          ['Physical World', 'Visible; digital objects overlay reality', 'Fully replaced by synthetic 3D scene'],
          ['Primary Hardware', 'Smartphones, tablets, AR glasses', 'Head-Mounted Displays (HMDs)'],
          ['Immersion Type', 'Blended spatial context', 'Complete sensory immersion'],
          ['Shared Web Standard', 'WebXR Device API + glTF', 'WebXR Device API + WebGL/WebGPU'],
        ],
      },
      keyTakeaways: [
        'Consistent high frame rates (≥72 FPS) are critical in WebVR to prevent motion discomfort.',
        'WebXR provides a single unified API supporting both AR and VR sessions.',
      ],
      diagramKey: 'u5-ar-vs-vr',
    },
    {
      orderIndex: 8,
      slug: 'smart-web',
      title: 'Smart Web',
      definition:
        'The Smart Web combines semantic knowledge graphs, context-aware computing, edge intelligence, and natural multimodal interaction to anticipate user needs accurately.',
      explanation:
        'Rather than treating every HTTP request as an isolated stateless event, Smart Web systems synthesize user intent, device constraints, environmental context, and domain ontologies. Capabilities include conversational semantic querying, cross-device session handoff, and proactive workflow automation.',
      examples: [
        {
          title: 'Context-Aware Study Portal',
          description: 'Automatically switching to offline-cached quick revision cards when detecting a weak cellular train connection.',
        },
      ],
      keyTakeaways: [
        'Integrates Semantic Web structure (Web 3.0) with real-time AI/IoT responsiveness (Web 4.0).',
        'Prioritizes relevant answers over raw lists of ten blue links.',
      ],
      diagramKey: 'u5-smart-web',
    },
    {
      orderIndex: 9,
      slug: 'adaptive-interfaces',
      title: 'Adaptive Interfaces',
      definition:
        'Adaptive Interfaces are UI architectures that dynamically adjust layout geometry, visual contrast, typography density, interaction modality, and content complexity to match user needs and device conditions.',
      explanation:
        'Going beyond basic responsive breakpoints (desktop/tablet/mobile), adaptive interfaces respond to media preferences (prefers-reduced-motion, prefers-color-scheme, prefers-contrast), network speed (navigator.connection), input modality (pointer vs touch vs keyboard screen-reader), and user mastery level (showing guided hints for beginners or compact revision tables for advanced learners).',
      examples: [
        {
          title: 'CSS Preference Queries for Adaptive Accessibility',
          description: 'Honoring user motion and contrast preferences automatically.',
          code: `@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}`,
          language: 'css',
        },
      ],
      keyTakeaways: [
        'Responsive design adapts to screen width; Adaptive interfaces adapt to user context, accessibility, and capability.',
        'Respecting prefers-reduced-motion is mandatory for accessible motion design.',
      ],
    },
    {
      orderIndex: 10,
      slug: 'web-automation',
      title: 'Web Automation',
      definition:
        'Web Automation uses programmable headless browsers, API orchestrators, and workflow engines to automatically execute repetitive web testing, scraping, monitoring, and cross-app integrations.',
      explanation:
        'In software engineering, tools like Playwright and Puppeteer automate end-to-end UI testing—verifying login flows, quiz timers, and accessibility across Chromium, Firefox, and WebKit. In enterprise workflows, webhooks and automation platforms trigger actions across web services (e.g., syncing LMS quiz results to analytics spreadsheets automatically). Responsible web automation obeys robots.txt, rate limits, and authentication policies.',
      examples: [
        {
          title: 'Automated End-to-End LMS Smoke Test (Playwright)',
          description: 'Verifying a student can filter Unit 3 questions and submit an MCQ quiz.',
          code: `test('student completes Unit 3 MCQ quiz', async ({ page }) => {
  await page.goto('https://examtips.edu/practice');
  await page.getByRole('button', { name: 'Start Unit 3 Quiz' }).click();
  await expect(page.getByText('Question 1')).toBeVisible();
});`,
          language: 'typescript',
        },
      ],
      keyTakeaways: [
        'Headless browser automation guarantees UI regressions are caught before deployment.',
        'Webhooks enable event-driven automation without wasteful polling loops.',
      ],
    },
    {
      orderIndex: 11,
      slug: 'impact-of-5g-on-web-technologies',
      title: 'Impact of 5G on Web Technologies',
      definition:
        '5G wireless networks transform web capabilities through three performance pillars: Enhanced Mobile Broadband (eMBB, multi-Gbps), Ultra-Reliable Low-Latency Communication (URLLC, <10ms), and Massive Machine-Type Communication (mMTC).',
      explanation:
        'Historically, mobile web developers aggressively stripped 3D models, high-bitrate video, and rich client bundles to survive congested 3G/4G links. With 5G’s fiber-like speeds and sub-10ms radio latency paired with Multi-Access Edge Computing (MEC) at cell towers, browsers can stream real-time WebXR environments, execute heavy WebAssembly (WASM) apps instantly, support synchronized multiplayer/collaborative canvases without jitter, and ingest telemetry from millions of IoT endpoints per square kilometer.',
      examples: [
        {
          title: '5G-Enabled Web Capabilities',
          description: 'Cloud-rendered WebGPU scenes, lag-free live remote proctoring/classrooms, and real-time autonomous fleet dashboards.',
        },
      ],
      keyTakeaways: [
        '5G’s three pillars: eMBB (speed), URLLC (low latency), mMTC (IoT density).',
        'Multi-Access Edge Computing (MEC) brings server compute directly to cellular base stations.',
      ],
      diagramKey: 'u5-5g-impact',
    },
  ],
  questions: [
    {
      section: 'A',
      marks: 2,
      questionText: 'What is Web 4.0 and why is it called the Symbiotic Web?',
      practiceBadge: 'Practice Recommendation',
      introduction: 'Web 4.0 represents the intelligent, autonomous phase following Web 3.0.',
      mainExplanation:
        'Called the Symbiotic Web because humans, proactive AI agents, IoT physical devices, and spatial web interfaces operate in continuous two-way symbiosis—anticipating context and automating multi-step goals in real time.',
      examples: 'A browser assistant coordinating calendar, transit IoT feeds, and exam prep schedules automatically.',
      advantages: ['Proactive context-aware assistance across devices'],
      disadvantages: ['Raises heightened privacy and algorithmic autonomy concerns'],
      conclusion: 'Web 4.0 merges AI reasoning with ubiquitous connectivity.',
      keywords: ['Web 4.0', 'Symbiotic Web', 'Autonomous Agents', 'Context-Aware'],
    },
    {
      section: 'A',
      marks: 2,
      questionText: 'Differentiate between location addressing (HTTP) and content addressing (IPFS/DWeb).',
      practiceBadge: 'Practice Recommendation',
      introduction: 'Addressing models determine how browsers locate and verify web resources.',
      mainExplanation:
        'HTTP uses location addressing (URLs pointing to a specific server domain/path), which breaks if that server goes offline (404). DWeb systems like IPFS use content addressing (CIDs derived from the file’s cryptographic hash), allowing any peer in the network to serve and cryptographically verify the exact data.',
      examples: 'https://host.com/notes.pdf vs ipfs://QmHash... (CID).',
      advantages: ['Content addressing prevents silent tampering and single-server link rot'],
      disadvantages: ['Peer discovery via DHT can have higher initial lookup latency than CDN HTTP'],
      conclusion: 'Content addressing provides verifiable, server-independent persistence for the Decentralized Web.',
      keywords: ['DWeb', 'IPFS', 'CID', 'Content Addressing', 'Location Addressing'],
    },
    {
      section: 'B',
      marks: 5,
      questionText: 'Compare Augmented Reality (AR) and Virtual Reality (VR) in web development using WebXR.',
      practiceBadge: 'Practice Recommendation',
      introduction:
        'WebXR Device API allows browsers to deliver immersive spatial experiences without requiring native app downloads.',
      mainExplanation:
        'WebAR keeps the user’s physical environment visible via camera pass-through and anchors 3D glTF models onto detected planes (using SLAM tracking). It runs smoothly on everyday smartphones and AR glasses. WebVR replaces the user’s entire field of view with a stereoscopic synthetic 3D scene rendered via WebGL/WebGPU at 72–120 FPS on head-mounted displays with 6DoF controller tracking.',
      examples: 'WebAR: Placing a 3D router diagram on a study desk. WebVR: Walking through a virtual server data center.',
      advantages: ['Instant URL accessibility without app store friction'],
      disadvantages: ['High GPU/battery demand and strict frame-rate requirements to avoid motion sickness'],
      diagramKey: 'u5-ar-vs-vr',
      conclusion: 'WebXR unifies AR and VR programming under one cross-device browser standard.',
      keywords: ['WebXR', 'WebGL', 'WebAR', 'WebVR', 'SLAM', '6DoF'],
    },
    {
      section: 'B',
      marks: 5,
      questionText: 'Explain Adaptive Interfaces and how they go beyond basic Responsive Web Design.',
      practiceBadge: 'Practice Recommendation',
      introduction:
        'Modern web applications must serve diverse devices, accessibility needs, and fluctuating network conditions.',
      mainExplanation:
        'Responsive Web Design primarily rearranges layouts based on screen viewport width using CSS media queries and flexible grids. Adaptive Interfaces go further by dynamically tailoring contrast, typography density, motion behavior (prefers-reduced-motion), theme polarity (Dark/Light Mode), bandwidth payload (low-data mode), and functional scaffolding (beginner hints vs expert shortcuts) based on real-time user and environmental context.',
      examples: 'Automatically disabling parallax animations for prefers-reduced-motion users and surfacing quick revision cards on slow networks.',
      advantages: ['Superior WCAG accessibility, inclusivity, and task efficiency'],
      disadvantages: ['Requires thorough testing across preference combinations'],
      conclusion: 'Adaptive interfaces align software behavior directly with human capabilities and situational context.',
      keywords: ['Adaptive UI', 'Responsive Design', 'prefers-reduced-motion', 'Accessibility', 'Context'],
    },
    {
      section: 'C',
      marks: 10,
      questionText: 'Explain the Impact of 5G on Web Technologies detailing its three core pillars and architectural effects.',
      practiceBadge: 'Practice Recommendation',
      introduction:
        'Fifth-generation (5G) cellular networking fundamentally removes bandwidth and latency bottlenecks that shaped mobile web engineering for over a decade.',
      mainExplanation:
        '5G introduces three transformative capabilities: (1) eMBB (Enhanced Mobile Broadband) delivering multi-Gbps throughput—enabling instant loading of heavy WebAssembly applications, 4K/8K video streams, and high-polygon WebXR 3D assets. (2) URLLC (Ultra-Reliable Low-Latency Communication) dropping air-interface latency below 10ms—supporting real-time cloud rendering, multiplayer collaborative canvases, and remote tele-operation directly in browsers. (3) mMTC (Massive Machine-Type Communication) supporting up to 1 million connected IoT devices per square kilometer—feeding live urban, medical, and industrial telemetry into WebSocket dashboards. Combined with Multi-Access Edge Computing (MEC) deployed inside telecom towers, web apps execute server logic milliseconds away from mobile users.',
      examples:
        'A student on campus streaming an interactive 3D WebXR networking simulation over 5G MEC with zero buffering and sub-15ms collaborative quiz sync.',
      advantages: [
        'Eliminates heavy asset-stripping compromises on mobile web',
        'Unlocks real-time spatial computing, cloud gaming, and dense IoT dashboards',
      ],
      disadvantages: [
        'Higher battery draw on continuous 5G mmWave transfers; graceful fallback to 4G/offline PWA caching remains necessary',
      ],
      diagramKey: 'u5-5g-impact',
      conclusion:
        '5G transforms the mobile browser from a constrained document viewer into a real-time spatial and edge-connected computing terminal.',
      keywords: ['5G', 'eMBB', 'URLLC', 'mMTC', 'MEC', 'WebXR', 'WebAssembly'],
    },
    {
      section: 'C',
      marks: 8,
      questionText: 'Describe IoT Architecture in Web Development (Web of Things) with protocols and a real-time dashboard example.',
      practiceBadge: 'Practice Recommendation',
      introduction:
        'Integrating the Internet of Things (IoT) with web standards—known as the Web of Things (WoT)—connects physical devices seamlessly to browser dashboards and cloud APIs.',
      mainExplanation:
        'A complete IoT web architecture consists of four layers: (1) Perception Layer—sensors and actuators attached to microcontrollers; (2) Network & Gateway Layer—devices publish compact telemetry over MQTT or CoAP (over Wi-Fi, LoRaWAN, or 5G) to edge gateways; (3) Cloud Middleware & Storage—brokers ingest streams, evaluate alert rules, and persist time-series readings; (4) Web Presentation Layer—Express/Node backends forward live events over WebSockets or SSE to browser dashboards, while W3C Thing Descriptions (JSON-LD) standardize device metadata.',
      examples:
        'Smart campus energy monitor publishing wattage every 2 seconds via MQTT -> Cloud broker -> WebSocket -> Live React chart with threshold alerts.',
      advantages: ['Remote browser control from anywhere without custom OS binaries', 'Unified telemetry visualization'],
      disadvantages: ['IoT devices introduce large attack surfaces if firmware updates and TLS auth are neglected'],
      diagramKey: 'u5-iot-arch',
      conclusion:
        'Lightweight messaging (MQTT/CoAP) bridged to WebSockets enables scalable, real-time physical-to-web integration.',
      keywords: ['IoT', 'Web of Things', 'MQTT', 'CoAP', 'WebSockets', 'Edge Gateway'],
    },
  ],
  mcqs: [
    {
      questionText: 'Which term is commonly used to describe Web 4.0 due to the close cooperation between humans, AI agents, and IoT?',
      options: ['Static Web', 'Symbiotic Web', 'Brochure Web', 'Gopher Web'],
      correctIndex: 1,
      explanation: 'Web 4.0 is called the Symbiotic Web because AI agents, physical environments, and users interact symbiotically.',
      difficulty: 'Easy',
    },
    {
      questionText: 'How does IPFS identify files in the Decentralized Web (DWeb)?',
      options: [
        'By server IPv4 address only',
        'By cryptographic Content Identifier (CID) derived from file content hash',
        'By sequential SQL primary keys',
        'By DNS MX records',
      ],
      correctIndex: 1,
      explanation: 'IPFS uses content-based addressing (CIDs) so any peer can serve and verify file integrity.',
      difficulty: 'Medium',
    },
    {
      questionText: 'Which protocol is widely used for lightweight publish-subscribe telemetry from IoT sensors to gateways?',
      options: ['SMTP', 'MQTT', 'POP3', 'SOAP'],
      correctIndex: 1,
      explanation: 'MQTT (Message Queuing Telemetry Transport) uses minimal bandwidth and pub/sub topics ideal for IoT.',
      difficulty: 'Easy',
    },
    {
      questionText: 'Which W3C browser API enables both Augmented Reality (AR) and Virtual Reality (VR) sessions on the Web?',
      options: ['WebAudio API', 'WebXR Device API', 'WebSQL API', 'WebRTC DataChannel'],
      correctIndex: 1,
      explanation: 'The WebXR Device API provides unified access to AR and VR headsets, pose tracking, and rendering.',
      difficulty: 'Easy',
    },
    {
      questionText: 'Which key distinction separates WebAR from WebVR?',
      options: [
        'WebAR overlays digital content onto the real world; WebVR replaces the view with a fully virtual 3D world',
        'WebAR works only offline; WebVR requires FTP',
        'WebVR cannot render 3D meshes',
        'WebAR has no camera tracking',
      ],
      correctIndex: 0,
      explanation: 'AR augments physical surroundings via camera pass-through, whereas VR immerses the user in an entirely synthetic scene.',
      difficulty: 'Easy',
    },
    {
      questionText: 'Which 5G capability specifically targets sub-10ms latency for real-time cloud apps and remote control?',
      options: ['eMBB', 'URLLC', 'mMTC', 'HTTP/1.0'],
      correctIndex: 1,
      explanation: 'URLLC (Ultra-Reliable Low-Latency Communication) delivers sub-10ms responsiveness.',
      difficulty: 'Medium',
    },
    {
      questionText: 'Which 5G pillar supports up to 1 million connected IoT sensors per square kilometer?',
      options: ['URLLC', 'mMTC', 'eMBB', 'MIME'],
      correctIndex: 1,
      explanation: 'mMTC (Massive Machine-Type Communication) is engineered for ultra-dense IoT sensor networks.',
      difficulty: 'Medium',
    },
    {
      questionText: 'Which CSS media query should an Adaptive Interface honor to protect users sensitive to motion animations?',
      options: ['prefers-reduced-motion', 'prefers-high-fps', 'device-speed', 'motion-enable'],
      correctIndex: 0,
      explanation: '@media (prefers-reduced-motion: reduce) lets developers minimize or disable non-essential motion.',
      difficulty: 'Easy',
    },
    {
      questionText: 'What is the recommended hybrid pattern for integrating Blockchain into scalable web apps?',
      options: [
        'Store gigabytes of raw video directly inside blockchain blocks',
        'Store heavy content/queries off-chain and anchor cryptographic proofs/Smart Contract states on-chain',
        'Replace all browser CSS with Solidity',
        'Eliminate user authentication entirely',
      ],
      correctIndex: 1,
      explanation: 'Anchoring hashes/proofs on-chain while indexing and serving rich assets off-chain keeps costs and latency low.',
      difficulty: 'Hard',
    },
    {
      questionText: 'Which open-source browser automation framework tests web apps across Chromium, Firefox, and WebKit?',
      options: ['Playwright', 'WSDL', 'UDDI', 'IMAP'],
      correctIndex: 0,
      explanation: 'Playwright (and Puppeteer/Selenium) automates real headless browsers for reliable end-to-end web testing.',
      difficulty: 'Easy',
    },
  ],
};
