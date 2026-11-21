export const unit4 = {
  unitNumber: 4,
  slug: 'unit-4-web2-and-web3',
  title: 'Web 2.0 and Web 3.0 Technologies',
  subtitle: 'Unit 4 · Social & Participatory Web, Semantic RDF, Mashups, Blockchain & Edge Systems',
  description:
    'Comprehensive coverage of Web 2.0 participatory platforms (blogs, wikis, social networks), enabling stack (AJAX, RSS, Ruby on Rails, Open APIs), Web 3.0 Semantic Web & RDF, widgets, mashups, web information systems, search engines, recommender systems, blockchain, edge computing, and dark mode.',
  examWeight: '20% Weightage',
  estimatedHours: 9,
  syllabus: [
    'Web 2.0',
    'Interactive and Social Web',
    'Blogs',
    'Wikis',
    'Social Networking Sites',
    'Technologies Behind Web 2.0',
    'AJAX',
    'RSS',
    'Ruby on Rails',
    'Open APIs',
    'Web 3.0',
    'Semantic Web',
    'Widgets',
    'Mashups',
    'RDF',
    'Web-Based Information Systems',
    'Search Engines',
    'Recommender Systems',
    'Benefits of Blockchain',
    'Edge Computing',
    'Dark Mode in Web Development',
  ],
  quickRevision: [
    'Web 1.0 = Read-Only static brochure web; Web 2.0 = Read-Write interactive social web; Web 3.0 = Semantic + Decentralized Read-Write-Own web.',
    'Web 2.0 enablers: AJAX (rich async UI), RSS/Atom (content syndication), Open APIs (REST/JSON), Ruby on Rails (MVC rapid backend).',
    'RDF (Resource Description Framework) expresses knowledge as Subject–Predicate–Object triples.',
    'Mashups combine APIs/data from 2+ external sources into one unified web app (e.g., real estate map + transit API).',
    'Recommender Systems use Collaborative Filtering (user similarity), Content-Based Filtering (item attributes), or Hybrid models.',
    'Edge Computing processes data closer to end users at CDN/edge PoPs, cutting latency and origin bandwidth.',
  ],
  diagrams: [
    {
      diagramKey: 'u4-web-evolution',
      title: 'Evolution of Web 1.0, Web 2.0, and Web 3.0',
      category: 'Comparison',
      summary:
        'Contrasts static read-only Web 1.0, user-generated social Web 2.0, and semantic/decentralized Web 3.0.',
      steps: [
        { step: 1, label: 'Web 1.0 (1991–2003)', detail: 'Static HTML pages, directory portals, publisher-only authoring.' },
        { step: 2, label: 'Web 2.0 (2004–2015)', detail: 'AJAX, blogs, wikis, social graphs, cloud platforms, Open APIs.' },
        { step: 3, label: 'Web 3.0 Semantic Layer', detail: 'RDF, OWL ontologies, SPARQL queries, machine-understandable data.' },
        { step: 4, label: 'Web 3.0 Decentralization', detail: 'Distributed ledgers, verifiable identity, and edge-native delivery.' },
      ],
    },
    {
      diagramKey: 'u4-semantic-web',
      title: 'Semantic Web Layer Cake Architecture',
      category: 'Architecture',
      summary:
        'W3C layered stack from Unicode/URI through XML, RDF triples, RDFS/OWL ontologies, SPARQL, and Proof/Trust.',
      steps: [
        { step: 1, label: 'URI & Unicode Foundation', detail: 'Globally unique resource identifiers and character encoding.' },
        { step: 2, label: 'RDF Data Model (Triples)', detail: 'Subject–Predicate–Object statements serialized in Turtle/JSON-LD.' },
        { step: 3, label: 'OWL Ontologies & Rules', detail: 'Defines class hierarchies, equivalences, and logical inference.' },
        { step: 4, label: 'SPARQL & Trust Layer', detail: 'Graph querying and cryptographic signature verification.' },
      ],
    },
    {
      diagramKey: 'u4-rss-flow',
      title: 'RSS Content Syndication Working Process',
      category: 'Process',
      summary:
        'Shows how publishers emit XML RSS feeds and feed aggregators poll updates automatically for subscribers.',
      steps: [
        { step: 1, label: 'Publisher Creates Post', detail: 'CMS/blog publishes new article and updates /feed.xml.' },
        { step: 2, label: 'RSS XML Serialization', detail: 'Item title, link, pubDate, and summary formatted in <rss> XML.' },
        { step: 3, label: 'Aggregator Polling', detail: 'Feed reader fetches feed.xml periodically via HTTP GET.' },
        { step: 4, label: 'Unified Reader Inbox', detail: 'New entries surface across multiple subscribed sources.' },
      ],
    },
    {
      diagramKey: 'u4-mashup-arch',
      title: 'Web Mashup Integration Architecture',
      category: 'Architecture',
      summary:
        'Illustrates combining multiple external Open APIs (Maps, Weather, Transit) into a unified client/server mashup.',
      steps: [
        { step: 1, label: 'Open API Providers', detail: 'Independent services expose REST/JSON or RSS feeds.' },
        { step: 2, label: 'Mashup Server / Proxy', detail: 'Aggregates, normalizes schemas, and secures API credentials.' },
        { step: 3, label: 'Browser Composition', detail: 'AJAX fetches merged dataset and renders synchronized UI widgets.' },
        { step: 4, label: 'Unified User Experience', detail: 'Users inspect combined insights in one interactive viewport.' },
      ],
    },
    {
      diagramKey: 'u4-blockchain-arch',
      title: 'Blockchain Distributed Ledger Architecture',
      category: 'Architecture',
      summary:
        'Shows cryptographic hash chaining of immutable blocks across decentralized peer-to-peer consensus nodes.',
      steps: [
        { step: 1, label: 'Transaction Broadcast', detail: 'Digitally signed transaction enters P2P mempool.' },
        { step: 2, label: 'Block Assembly & Merkle Root', detail: 'Validator bundles verified transactions into a candidate block.' },
        { step: 3, label: 'Consensus Agreement', detail: 'Network nodes validate block via PoS/PoW consensus rules.' },
        { step: 4, label: 'Immutable Hash Link', detail: 'Block stores PrevHash pointer, sealing tamper-evident history.' },
      ],
    },
    {
      diagramKey: 'u4-edge-arch',
      title: 'Edge Computing vs Centralized Cloud Architecture',
      category: 'Architecture',
      summary:
        'Demonstrates executing compute and caching at regional Edge PoPs milliseconds from users instead of distant origin servers.',
      steps: [
        { step: 1, label: 'Client Request', detail: 'User browser routes via Anycast DNS to nearest Edge PoP.' },
        { step: 2, label: 'Edge Worker Execution', detail: 'Edge node handles auth checks, A/B routing, and cached SSR.' },
        { step: 3, label: 'Selective Origin Fetch', detail: 'Only cache misses or writes traverse backbone to origin DB.' },
        { step: 4, label: 'Sub-20ms Response', detail: 'Minimized round-trip latency improves Core Web Vitals.' },
      ],
    },
    {
      diagramKey: 'u4-recommender-flow',
      title: 'Recommender System Workflow (Collaborative & Content-Based)',
      category: 'Flowchart',
      summary:
        'Traces user interaction logs and item metadata through similarity modeling to generate ranked recommendations.',
      steps: [
        { step: 1, label: 'Signal Collection', detail: 'Capture views, bookmarks, quiz scores, and item tags.' },
        { step: 2, label: 'Feature & Matrix Modeling', detail: 'Build User-Item interaction matrix and TF-IDF item vectors.' },
        { step: 3, label: 'Similarity / Scoring', detail: 'Compute cosine similarity or matrix factorization predictions.' },
        { step: 4, label: 'Top-N Ranked Output', detail: 'Filter already-seen items and serve personalized study picks.' },
      ],
    },
  ],
  topics: [
    {
      orderIndex: 1,
      slug: 'web-2-0',
      title: 'Web 2.0',
      definition:
        'Web 2.0 refers to the second generation of the World Wide Web centered on user-generated content, dynamic responsiveness, collaboration, and platform-as-a-service interoperability.',
      explanation:
        'Popularized by Tim O’Reilly (2004), Web 2.0 marked a paradigm shift from static Web 1.0 brochures ("Read-Only") to participatory platforms ("Read-Write"). Users became active creators—publishing articles, uploading media, tagging content (folksonomies), and collaborating inside browser-based rich internet applications.',
      examples: [
        {
          title: 'Web 1.0 vs Web 2.0 Shift',
          description: 'Britannica Online -> Wikipedia | Personal Geocities HTML -> WordPress/Medium | Static catalogs -> Amazon reviews.',
        },
      ],
      keyTakeaways: [
        'Web 2.0 is a design and social paradigm shift, not a new network protocol upgrade.',
        'Network effects make platforms more valuable as more users contribute.',
      ],
      diagramKey: 'u4-web-evolution',
    },
    {
      orderIndex: 2,
      slug: 'interactive-and-social-web',
      title: 'Interactive and Social Web',
      definition:
        'The Interactive and Social Web encompasses web architectures built around two-way user participation, community curation, commenting, sharing, and real-time feedback loops.',
      explanation:
        'Unlike broadcast media, the interactive social web pairs asynchronous UI controls (likes, threaded replies, live polls) with persistent user profiles and social graphs. Content spreads virally via feeds, mentions, and recommendations rather than strict editorial hierarchies.',
      examples: [
        {
          title: 'Interactive Learning Loop',
          description: 'Students bookmarking questions, taking instant MCQ quizzes, and seeing real-time mastery charts.',
        },
      ],
      keyTakeaways: [
        'Identity, social graphs, and bidirectional communication define the social web.',
        'Moderation and anti-spam controls are critical when users publish freely.',
      ],
    },
    {
      orderIndex: 3,
      slug: 'blogs',
      title: 'Blogs (Weblogs)',
      definition:
        'A Blog is a frequently updated online journal or informational website displaying posts in reverse-chronological order with commentary, tags, and syndication feeds.',
      explanation:
        'Blogs democratized publishing by abstracting away raw HTML uploads behind Content Management Systems (WordPress, Ghost, Blogger). Key components include timestamped entries, permalinks, categories/tags, comment threads, trackbacks, and automated RSS/Atom feeds.',
      examples: [
        {
          title: 'Anatomy of a Blog Post URL & Feed',
          description: 'Permalink: /2026/11/understanding-dns-resolution paired with /rss.xml.',
        },
      ],
      keyTakeaways: [
        'Reverse-chronological publishing and permalinks make blog posts citable and subscribable.',
        'CMS platforms separate content authoring from theme templates.',
      ],
    },
    {
      orderIndex: 4,
      slug: 'wikis',
      title: 'Wikis',
      definition:
        'A Wiki is a collaborative web application enabling communities to collaboratively author, edit, link, and maintain shared knowledge pages directly from a browser.',
      explanation:
        'Invented by Ward Cunningham (1995), wikis rely on simplified markup (Wikitext/Markdown), rapid internal hyperlinking, full version revision histories (diffs and rollbacks), and peer review ("talk pages"). Wikipedia is the largest global wiki implementation.',
      examples: [
        {
          title: 'Core Wiki Mechanisms',
          description: 'Revision History (audit every edit) + Instant Rollback + Collaborative Discussion Pages.',
        },
      ],
      keyTakeaways: [
        'Wikis prioritize collective consensus and edit traceability over single-author ownership.',
        'Version control inside wikis allows safe recovery from vandalism or errors.',
      ],
    },
    {
      orderIndex: 5,
      slug: 'social-networking-sites',
      title: 'Social Networking Sites',
      definition:
        'Social Networking Sites (SNS) are web platforms where individuals construct public or semi-public profiles, articulate lists of connected users, and traverse shared social graphs.',
      explanation:
        'Architecturally, SNS platforms model users and relationships as directed or undirected graphs (followers vs mutual friends). Core subsystems include identity profiles, newsfeed ranking pipelines, real-time notifications, media CDN storage, and privacy access-control lists.',
      examples: [
        {
          title: 'Graph Data Model in SNS',
          description: 'Professional networks (LinkedIn), microblogging (X), developer collaboration (GitHub).',
        },
      ],
      keyTakeaways: [
        'Social graphs store relationships (edges) between user entities (nodes).',
        'Algorithmic feeds rank posts by recency, affinity, and engagement signals.',
      ],
    },
    {
      orderIndex: 6,
      slug: 'technologies-behind-web-2-0',
      title: 'Technologies Behind Web 2.0',
      definition:
        'Web 2.0 relies on a cohesive stack of client interactivity (HTML5, CSS3, AJAX), syndication (RSS/Atom), RESTful Open APIs, and rapid MVC server frameworks.',
      explanation:
        'No single protocol created Web 2.0; rather, browsers gained reliable DOM/XHR support while servers adopted JSON serialization, RESTful architectures, cloud elasticity, and MVC frameworks (like Ruby on Rails and Django) that slashed iteration time.',
      examples: [
        {
          title: 'Web 2.0 Core Stack',
          description: 'Frontend: DOM + CSS + AJAX/JSON | Integration: Open REST APIs + RSS | Backend: MVC Frameworks + Cloud DB.',
        },
      ],
      keyTakeaways: [
        'JSON over HTTP/REST became the universal lightweight glue of Web 2.0.',
        'Browser standardization enabled Rich Internet Applications (RIAs) without proprietary plugins.',
      ],
    },
    {
      orderIndex: 7,
      slug: 'ajax-in-web-2-0',
      title: 'AJAX (Role in Web 2.0)',
      definition:
        'In Web 2.0, AJAX acts as the engine of responsiveness—allowing social feeds, collaborative editors, and interactive maps to fetch incremental data asynchronously.',
      explanation:
        'Applications like Google Maps (2005) and Gmail proved that browsers could rival desktop software by loading map tiles and email threads via background XMLHttpRequest calls rather than full-page refreshes.',
      examples: [
        {
          title: 'Web 2.0 AJAX Interactions',
          description: 'Infinite scroll feeds, inline "Like" counters, live form autosave, and drag-and-drop dashboards.',
        },
      ],
      keyTakeaways: [
        'AJAX decoupled UI interactions from full-document HTTP navigation.',
        'Paved the way for Single-Page Applications (SPAs).',
      ],
    },
    {
      orderIndex: 8,
      slug: 'rss',
      title: 'RSS (Really Simple Syndication)',
      definition:
        'RSS is a standardized XML web feed format that enables publishers to syndicate newly updated headlines, summaries, and links automatically to feed readers and aggregators.',
      explanation:
        'An RSS 2.0 document contains a <channel> element describing the source and multiple <item> elements for recent articles, each with <title>, <link>, <description>, and <pubDate>. Subscribers add the feed URL to an aggregator, which polls periodically so users receive updates in one place without visiting dozens of sites manually.',
      examples: [
        {
          title: 'RSS 2.0 Feed XML Snippet',
          description: 'Standard structure emitted by blogs and news portals.',
          code: `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Exam Tips Study Updates</title>
    <link>https://examtips.edu</link>
    <item>
      <title>Unit 4 Semantic Web Notes Added</title>
      <link>https://examtips.edu/unit-4</link>
      <pubDate>Mon, 16 Nov 2026 09:00:00 GMT</pubDate>
    </item>
  </channel>
</rss>`,
          language: 'xml',
        },
      ],
      keyTakeaways: [
        'RSS enables pull-based automated content syndication and podcasts (via <enclosure>).',
        'Atom (RFC 4287) is a modern XML alternative addressing RSS versioning ambiguities.',
      ],
      diagramKey: 'u4-rss-flow',
    },
    {
      orderIndex: 9,
      slug: 'ruby-on-rails',
      title: 'Ruby on Rails',
      definition:
        'Ruby on Rails (RoR) is an influential open-source server-side web framework written in Ruby, famous for Model-View-Controller (MVC) architecture, Convention over Configuration (CoC), and DRY principles.',
      explanation:
        'Created by David Heinemeier Hansson (2004), Rails accelerated Web 2.0 startups (GitHub, Shopify, Basecamp) by eliminating repetitive XML configuration files. ActiveRecord maps database tables to Ruby classes automatically, ActionController routes RESTful HTTP verbs cleanly, and database migrations version schema changes systematically.',
      examples: [
        {
          title: 'Core Rails Design Philosophies',
          description:
            'Convention over Configuration (CoC): sensible defaults replace boilerplate | DRY (Don’t Repeat Yourself): single source of truth | RESTful CRUD routing.',
        },
      ],
      keyTakeaways: [
        'Rails popularized MVC web routing, database migrations, and rapid REST scaffolding.',
        'ActiveRecord implements the Object-Relational Mapping (ORM) pattern.',
      ],
    },
    {
      orderIndex: 10,
      slug: 'open-apis',
      title: 'Open APIs',
      definition:
        'Open APIs (Public APIs) are documented HTTP interfaces exposed externally by platforms so third-party developers can programmatically read data, trigger workflows, and build integrations.',
      explanation:
        'Open APIs use REST/JSON or GraphQL documented with OpenAPI (Swagger) specifications and secured via API keys or OAuth 2.0 bearer tokens. Rate limiting (e.g., 1,000 requests/hour) protects backend stability while unlocking developer ecosystems and mashups.',
      examples: [
        {
          title: 'Open API Authentication Flow',
          description: 'OAuth 2.0 scoped access tokens let a calendar app read events without seeing the user password.',
        },
      ],
      keyTakeaways: [
        'Open APIs turn standalone websites into programmable ecosystems.',
        'Require versioning, rate limiting, and explicit OAuth/API-key scopes.',
      ],
    },
    {
      orderIndex: 11,
      slug: 'web-3-0',
      title: 'Web 3.0',
      definition:
        'Web 3.0 represents the next evolution of the Web—combining Semantic Web machine understanding (linked data, ontologies) with decentralized, user-owned cryptographic infrastructure.',
      explanation:
        'Originally defined by Tim Berners-Lee as the Semantic Web where software agents reason over structured meaning, Web 3.0 also encompasses decentralized protocols (Web3): distributed ledgers, peer-to-peer storage (IPFS), verifiable credentials, and intelligent context-aware services.',
      examples: [
        {
          title: 'Dual Pillars of Web 3.0',
          description: '1. Semantic Intelligence (RDF/OWL knowledge graphs) + 2. Decentralized Ownership (Blockchain/DIDs).',
        },
      ],
      keyTakeaways: [
        'Shifts data from isolated platform silos to interoperable knowledge graphs and user-controlled wallets/identities.',
        'Enables software agents to execute complex multi-step queries autonomously.',
      ],
      diagramKey: 'u4-web-evolution',
    },
    {
      orderIndex: 12,
      slug: 'semantic-web',
      title: 'Semantic Web',
      definition:
        'The Semantic Web is a W3C extension of the Web in which information is given well-defined machine-readable meaning, enabling computers and humans to work in cooperation.',
      explanation:
        'Standard HTML tells browsers how to display headings and paragraphs, not what entities mean. The Semantic Web layers URI identifiers, RDF triples, RDFS/OWL ontologies, and SPARQL queries (the Semantic Web Layer Cake) so search engines and intelligent agents understand relationships—such as knowing "Tim Berners-Lee" is a Person who invented "World Wide Web".',
      examples: [
        {
          title: 'Schema.org JSON-LD Structured Data',
          description: 'How modern websites embed semantic meaning inside HTML <head>.',
          code: `{
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "Web Technologies Unit 4",
  "provider": { "@type": "Organization", "name": "EXAM TIPS" }
}`,
          language: 'json',
        },
      ],
      keyTakeaways: [
        'Moves the Web from a "Web of Documents" to a "Web of Linked Data".',
        'Powers Knowledge Graphs and rich search result snippets.',
      ],
      diagramKey: 'u4-semantic-web',
    },
    {
      orderIndex: 13,
      slug: 'widgets',
      title: 'Web Widgets',
      definition:
        'A Web Widget is a portable, self-contained UI component or micro-application that can be embedded into any host web page or dashboard to display live functionality.',
      explanation:
        'Widgets encapsulate HTML/CSS/JavaScript (often via Web Components, Shadow DOM, or sandboxed iframes) to deliver weather cards, stock tickers, chat launchers, or countdown timers without rewriting backend logic on the host site.',
      examples: [
        {
          title: 'Embeddable Study Countdown Widget',
          description: 'A drop-in exam timer or currency converter embedded inside a student portal.',
        },
      ],
      keyTakeaways: [
        'Widgets emphasize portability, encapsulation, and single-purpose utility.',
        'Shadow DOM prevents host CSS from breaking widget styling.',
      ],
    },
    {
      orderIndex: 14,
      slug: 'mashups',
      title: 'Mashups',
      definition:
        'A Web Mashup is a web application that combines data, presentation, or functionality from two or more external Open APIs or feeds to create a new unified service.',
      explanation:
        'Mashups can execute client-side (browser JavaScript calling multiple CORS-enabled APIs) or server-side (backend proxy aggregating feeds, normalizing schemas, and hiding private API keys). Classic types include Mapping Mashups, News Mashups, and Commerce Price Aggregators.',
      examples: [
        {
          title: 'Campus Housing Mashup',
          description: 'Combines rental listings API + Google Maps API + local transit schedule API on a single interactive map.',
        },
      ],
      keyTakeaways: [
        'Mashups unlock rapid innovation by remixing existing Open APIs.',
        'Server-side mashup proxies protect secret API keys and enforce rate caching.',
      ],
      diagramKey: 'u4-mashup-arch',
    },
    {
      orderIndex: 15,
      slug: 'rdf',
      title: 'RDF (Resource Description Framework)',
      definition:
        'RDF is the standard W3C data model for representing metadata and linked knowledge on the Semantic Web as directed graphs of Subject–Predicate–Object triples.',
      explanation:
        'Every RDF statement asserts a fact in three parts: Subject (the resource URI being described), Predicate (the property or relationship URI), and Object (another resource URI or literal value). RDF can be serialized in multiple syntaxes including RDF/XML, Turtle (.ttl), N-Triples, and JSON-LD, and queried using SPARQL.',
      examples: [
        {
          title: 'RDF Triple in Turtle Syntax',
          description: 'Expressing course authorship as a Subject-Predicate-Object statement.',
          code: `@prefix ex: <https://examtips.edu/schema/> .
@prefix dc: <http://purl.org/dc/terms/> .

<https://examtips.edu/unit/4>
  dc:title "Web 2.0 and Web 3.0 Technologies" ;
  ex:coversTopic "Semantic Web" .`,
          language: 'turtle',
        },
      ],
      keyTakeaways: [
        'RDF uses URIs to eliminate naming ambiguity across independent datasets.',
        'Triples naturally merge into a global Linked Data graph.',
      ],
      diagramKey: 'u4-semantic-web',
    },
    {
      orderIndex: 16,
      slug: 'web-based-information-systems',
      title: 'Web-Based Information Systems (WIS)',
      definition:
        'A Web-Based Information System (WIS) is an information system using Internet and web technologies (browser client, application tier, relational/NoSQL database) to store, process, and deliver organizational information.',
      explanation:
        'WIS architectures typically follow a 3-tier or N-tier design: Presentation Tier (HTML/CSS/React UI), Application Logic Tier (Node.js/Express REST APIs, authentication, business validation), and Data Tier (PostgreSQL/Cloud SQL). Examples include University LMS portals, Hospital EHR systems, and ERP dashboards.',
      examples: [
        {
          title: '3-Tier WIS Example: EXAM TIPS LMS',
          description: 'React Browser UI -> Express REST API + Firebase Auth -> Cloud SQL PostgreSQL.',
        },
      ],
      keyTakeaways: [
        'Separating Presentation, Logic, and Data tiers improves security and maintainability.',
        'WIS delivers zero-install global accessibility via standard browsers.',
      ],
    },
    {
      orderIndex: 17,
      slug: 'search-engines',
      title: 'Search Engines',
      definition:
        'A Web Search Engine is a software system designed to systematically discover, index, rank, and retrieve relevant web pages in response to user queries.',
      explanation:
        'Search engines operate via three core pipelines: (1) Crawling—automated bots (spiders) traverse hyperlinks from seed URLs respecting robots.txt; (2) Indexing—tokenizing text, stripping stopwords, and storing an inverted index mapping keywords to document IDs; (3) Ranking & Querying—scoring matching pages using relevance signals (TF-IDF/BM25, PageRank link authority, semantic embeddings, mobile friendliness, and page speed).',
      examples: [
        {
          title: 'Inverted Index Concept',
          description: 'Keyword "SOAP" -> [Unit3_Topic3 (freq: 14), Unit3_Q3 (freq: 6)].',
        },
      ],
      keyTakeaways: [
        'Crawling -> Parsing/Indexing (Inverted Index) -> Ranking/Retrieval.',
        'Semantic Web markup (Schema.org) helps search engines produce rich knowledge cards.',
      ],
    },
    {
      orderIndex: 18,
      slug: 'recommender-systems',
      title: 'Recommender Systems',
      definition:
        'Recommender Systems are intelligent filtering algorithms that predict user preferences and suggest relevant items (courses, articles, videos, products) based on behavior and item attributes.',
      explanation:
        'Three primary architectures exist: (1) Collaborative Filtering—recommends items liked by users with similar interaction histories (User-User or Item-Item); (2) Content-Based Filtering—matches item metadata/tags against a user’s past profile; (3) Hybrid Systems—combine both approaches (plus deep neural embeddings) to overcome the Cold-Start problem for new users or items.',
      examples: [
        {
          title: 'LMS Practice Recommendation',
          description: 'If a student scores 40% on Unit 3 AJAX MCQs, recommend "Unit 3: Programming in AJAX" notes and Section B Q&A.',
        },
      ],
      keyTakeaways: [
        'Collaborative filtering captures hidden taste patterns; Content-based handles new items cleanly.',
        'Hybrid recommenders mitigate sparsity and cold-start limitations.',
      ],
      diagramKey: 'u4-recommender-flow',
    },
    {
      orderIndex: 19,
      slug: 'benefits-of-blockchain',
      title: 'Benefits of Blockchain',
      definition:
        'Blockchain is a decentralized, append-only distributed ledger technology that groups validated records into cryptographically linked blocks without requiring a central trusted authority.',
      explanation:
        'Key benefits for web systems include: Immutability (altering past blocks invalidates every subsequent cryptographic hash), Transparency & Auditability (shared verifiable ledger), Decentralization (no single point of failure or unilateral censorship), Cryptographic Security (public-key digital signatures), and Programmable Trust via Smart Contracts.',
      examples: [
        {
          title: 'Academic Credential Verification',
          description: 'Universities issuing tamper-proof degree hashes verifiable instantly by employers without manual registrar calls.',
        },
      ],
      keyTakeaways: [
        'Hash pointers (PrevHash) make historical records tamper-evident.',
        'Ideal where multiple untrusted parties need a single shared source of truth.',
      ],
      diagramKey: 'u4-blockchain-arch',
    },
    {
      orderIndex: 20,
      slug: 'edge-computing',
      title: 'Edge Computing',
      definition:
        'Edge Computing is a distributed computing paradigm that brings computation, caching, and request routing closer to data sources and end users at regional network edge nodes.',
      explanation:
        'Rather than sending every HTTP request thousands of kilometers to a single centralized cloud region, Edge Computing runs lightweight serverless workers (e.g., Cloudflare Workers, Cloud CDN edge functions) across hundreds of global Points of Presence (PoPs). This cuts round-trip latency from ~200ms to <20ms, reduces origin server bandwidth, and supports real-time IoT filtering.',
      examples: [
        {
          title: 'Edge SSR & Token Verification',
          description: 'Verifying JWT session cookies and serving localized cached study notes at the nearest city PoP.',
        },
      ],
      keyTakeaways: [
        'Minimizes physical network distance between user and compute.',
        'Complements—rather than replaces—centralized relational databases.',
      ],
      diagramKey: 'u4-edge-arch',
    },
    {
      orderIndex: 21,
      slug: 'dark-mode-in-web-development',
      title: 'Dark Mode in Web Development',
      definition:
        'Dark Mode is an adaptive UI color scheme using low-luminance dark surfaces with high-contrast light typography to reduce eye strain in dim environments and lower OLED screen power draw.',
      explanation:
        'Proper Dark Mode implementation avoids crude CSS color inversion. Developers use CSS Custom Properties or Tailwind v4 @custom-variant dark (&:where(.dark, .dark *)) combined with the prefers-color-scheme: dark media query and explicit user toggle persistence. Accessibility requires maintaining WCAG AA contrast (at least 4.5:1), softening pure #000000/#FFFFFF glare to refined slate tones (#020617 / #F1F5F9), and keeping semantic status text legible.',
      examples: [
        {
          title: 'Detecting & Toggling Dark Mode in CSS & JS',
          description: 'Respecting system preference while allowing manual user override.',
          code: `/* Tailwind v4 class-based dark variant */
@custom-variant dark (&:where(.dark, .dark *));

/* Native CSS media query fallback */
@media (prefers-color-scheme: dark) {
  :root { color-scheme: dark; }
}`,
          language: 'css',
        },
      ],
      keyTakeaways: [
        'Never use pure #000000 black with #FFFFFF text; dark slate reduces halation and eye fatigue.',
        'Verify WCAG AA contrast ratios in both Light and Dark themes.',
      ],
    },
  ],
  questions: [
    {
      section: 'A',
      marks: 2,
      questionText: 'What is an RDF Triple? Give an example.',
      practiceBadge: 'Practice Recommendation',
      introduction: 'RDF (Resource Description Framework) models Semantic Web facts as a graph of statements.',
      mainExplanation:
        'An RDF Triple consists of three components: Subject (the resource URI), Predicate (the relationship or attribute URI), and Object (another resource URI or literal value).',
      examples: 'Subject: <Unit4> | Predicate: <hasTopic> | Object: "Semantic Web".',
      advantages: ['Enables global linking and machine reasoning across datasets'],
      disadvantages: ['More verbose than flat relational rows without compact formats like Turtle/JSON-LD'],
      conclusion: 'Triples form the atomic building blocks of Linked Data and SPARQL knowledge graphs.',
      keywords: ['RDF', 'Triple', 'Subject-Predicate-Object', 'URI'],
    },
    {
      section: 'A',
      marks: 2,
      questionText: 'Define a Web Mashup with one real-world example.',
      practiceBadge: 'Practice Recommendation',
      introduction: 'Mashups are a hallmark integration pattern of Web 2.0 applications.',
      mainExplanation:
        'A Web Mashup combines data or UI components from two or more independent Open APIs or feeds into a single cohesive application.',
      examples: 'Combining real-estate rental listings API with an interactive Maps API and local transit timetable API.',
      advantages: ['Rapidly creates novel functionality by remixing existing services'],
      disadvantages: ['Depends on uptime and licensing terms of third-party APIs'],
      conclusion: 'Mashups demonstrate the power of Open APIs and standardized JSON/REST interoperability.',
      keywords: ['Mashup', 'Open API', 'Data Aggregation', 'Web 2.0'],
    },
    {
      section: 'B',
      marks: 5,
      questionText: 'Compare Web 1.0, Web 2.0, and Web 3.0 across interaction model, technologies, and data ownership.',
      practiceBadge: 'Practice Recommendation',
      introduction:
        'The World Wide Web has progressed through three major evolutionary paradigms reflecting shifts in authoring, interactivity, and machine intelligence.',
      mainExplanation:
        'Web 1.0 (Read-Only Web) delivered static HTML pages authored solely by site owners, connected via hyperlinks with minimal user feedback. Web 2.0 (Read-Write Social Web) introduced AJAX, RSS, Open APIs, blogs, wikis, and social networks—turning everyday users into content creators hosted on centralized cloud platforms. Web 3.0 (Semantic & Decentralized Web) adds machine-understandable metadata via RDF, OWL ontologies, and Knowledge Graphs alongside decentralized blockchain ledgers and user-controlled identities.',
      examples: 'Web 1.0: Static college brochure | Web 2.0: Wikipedia / YouTube | Web 3.0: Schema.org Linked Data & IPFS/Web3 apps.',
      advantages: ['Each generation expands participation, automation, and interoperability'],
      disadvantages: ['Web 2.0 centralized data monopolies; Web 3.0 introduces usability and energy/scalability trade-offs'],
      diagramKey: 'u4-web-evolution',
      conclusion: 'Modern web engineering frequently blends Web 2.0 responsiveness with Web 3.0 semantic linking and edge distribution.',
      keywords: ['Web 1.0', 'Web 2.0', 'Web 3.0', 'Semantic Web', 'User-Generated Content'],
    },
    {
      section: 'B',
      marks: 5,
      questionText: 'Explain how Recommender Systems work, contrasting Collaborative Filtering and Content-Based Filtering.',
      practiceBadge: 'Practice Recommendation',
      introduction:
        'Recommender Systems help users navigate large information spaces by predicting relevant items.',
      mainExplanation:
        'Content-Based Filtering builds a profile of item features (tags, syllabus topics, difficulty) and recommends items similar to what the user previously engaged with. Collaborative Filtering ignores item internals and analyzes the User-Item interaction matrix—finding peers with similar ratings or bookmarks ("users who revised Unit 3 also bookmarked CORBA Q&A"). Hybrid systems merge both signals to solve the Cold-Start problem when new users or topics have few interactions.',
      examples: 'LMS recommending "DNS Resolution Diagram" after a student misses two DNS questions in a quiz.',
      advantages: ['Increases engagement and personalized learning efficiency'],
      disadvantages: ['Cold-start issue for brand-new users; filter-bubble risk'],
      diagramKey: 'u4-recommender-flow',
      conclusion: 'Hybrid recommenders combine metadata precision with behavioral discovery for high-accuracy personalization.',
      keywords: ['Collaborative Filtering', 'Content-Based', 'Cold-Start', 'Similarity Matrix'],
    },
    {
      section: 'C',
      marks: 10,
      questionText: 'Describe the Semantic Web architecture (Layer Cake) explaining URI, XML, RDF, OWL, and SPARQL with a diagram.',
      practiceBadge: 'Practice Recommendation',
      introduction:
        'The Semantic Web, envisioned by Tim Berners-Lee and standardized by W3C, enriches web content with formal meaning so software agents can reason across heterogeneous sources.',
      mainExplanation:
        'The Semantic Web Layer Cake stacks capabilities cleanly: (1) Unicode & URI provide universal character encoding and globally unique identifiers for real-world concepts. (2) XML & Namespaces offer syntactic structure. (3) RDF (Resource Description Framework) represents facts as Subject–Predicate–Object triples forming a directed graph. (4) RDFS & OWL (Web Ontology Language) define vocabularies, class hierarchies, properties, and logical axioms (e.g., transitive or inverse relationships) enabling automated inference. (5) SPARQL serves as the declarative query language over RDF triple stores. (6) Cryptography, Proof, and Trust verify provenance and authenticity of assertions.',
      examples:
        'Modeling university courses with RDF/OWL so an agent infers that "Unit 3" is part of "Web Technologies" and queries all 10-mark questions via SPARQL.',
      advantages: [
        'Eliminates data silos across organizations via shared vocabularies',
        'Enables automated logical inference and richer search knowledge graphs',
      ],
      disadvantages: [
        'Authoring strict OWL ontologies requires specialized domain modeling expertise',
        'Complex SPARQL graph joins can be slower than tuned relational SQL queries',
      ],
      diagramKey: 'u4-semantic-web',
      conclusion:
        'By pairing RDF graphs with OWL ontologies and SPARQL querying, the Semantic Web transforms isolated documents into a queryable global knowledge base.',
      keywords: ['Semantic Web Layer Cake', 'RDF', 'OWL', 'SPARQL', 'Ontology', 'URI'],
    },
    {
      section: 'C',
      marks: 8,
      questionText: 'Explain Edge Computing and Blockchain benefits in modern web architecture with neat diagrams.',
      practiceBadge: 'Practice Recommendation',
      introduction:
        'Modern web applications leverage Edge Computing for ultra-low latency and Blockchain where tamper-evident decentralized trust is required.',
      mainExplanation:
        'Edge Computing deploys stateless compute workers and caches to globally distributed Points of Presence (PoPs) near end users. Instead of routing every request to one central region, edge nodes authenticate tokens, personalize cached HTML, and filter IoT telemetry within ~15ms, forwarding only database writes to origin servers. Blockchain complements distributed systems by maintaining an append-only ledger replicated across consensus nodes. Each block references the cryptographic hash of its predecessor, guaranteeing immutability, transparent auditing, and automated Smart Contract execution without central intermediaries.',
      examples:
        'Serving an exam portal via Edge CDN nodes worldwide while anchoring official verified academic certificates on a permissioned blockchain.',
      advantages: [
        'Edge: Drastic latency drop, lower origin load, resilience against traffic spikes',
        'Blockchain: Tamper-evident immutability, zero single point of control',
      ],
      disadvantages: [
        'Edge: Eventual consistency challenges for global mutable state',
        'Blockchain: Higher storage/consensus overhead compared to centralized PostgreSQL',
      ],
      diagramKey: 'u4-edge-arch',
      conclusion:
        'Edge Computing optimizes physical network speed, while Blockchain provides verifiable cryptographic trust where centralized databases are insufficient.',
      keywords: ['Edge PoP', 'Latency', 'CDN Workers', 'Immutable Ledger', 'Hash Pointer', 'Consensus'],
    },
  ],
  mcqs: [
    {
      questionText: 'Which phrase best characterizes the shift from Web 1.0 to Web 2.0?',
      options: [
        'From Read-Only static publishing to Read-Write participatory platforms',
        'From TCP/IP to Bluetooth',
        'From JSON to binary machine code',
        'From HTTPS to unencrypted HTTP',
      ],
      correctIndex: 0,
      explanation: 'Web 2.0 shifted the web from static publisher-only pages to user-generated content and interactive apps.',
      difficulty: 'Easy',
    },
    {
      questionText: 'Which XML format enables blogs and news sites to automatically syndicate new posts to subscriber aggregators?',
      options: ['WSDL', 'RSS', 'XSD', 'CORBA'],
      correctIndex: 1,
      explanation: 'RSS (Really Simple Syndication) publishes structured XML <channel> and <item> feeds.',
      difficulty: 'Easy',
    },
    {
      questionText: 'Which two core principles were popularized by the Ruby on Rails framework?',
      options: [
        'Manual XML Config and Tight Coupling',
        'Convention over Configuration (CoC) and Don’t Repeat Yourself (DRY)',
        'Static Framesets and Quirks Mode',
        'Peer-to-Peer Mining and PoW',
      ],
      correctIndex: 1,
      explanation: 'Rails popularized CoC (sensible defaults) and DRY (single authoritative representation).',
      difficulty: 'Medium',
    },
    {
      questionText: 'What are the three parts of an RDF statement (triple)?',
      options: [
        'Header, Body, Fault',
        'Subject, Predicate, Object',
        'Client, Broker, Server',
        'Input, Process, Output',
      ],
      correctIndex: 1,
      explanation: 'RDF encodes semantic knowledge as Subject–Predicate–Object triples.',
      difficulty: 'Easy',
    },
    {
      questionText: 'Which query language is specifically designed to retrieve data from RDF triple stores?',
      options: ['SQL', 'SPARQL', 'XSLT', 'IIOP'],
      correctIndex: 1,
      explanation: 'SPARQL (SPARQL Protocol and RDF Query Language) queries RDF graph patterns.',
      difficulty: 'Medium',
    },
    {
      questionText: 'A web application that merges Google Maps with live city transit and rental APIs is an example of a:',
      options: ['Mashup', 'DTD', 'SAX Parser', 'Mail Transfer Agent'],
      correctIndex: 0,
      explanation: 'A Mashup combines data/functionality from two or more external Open APIs into one interface.',
      difficulty: 'Easy',
    },
    {
      questionText: 'In Search Engines, what data structure maps extracted keywords directly to the list of documents containing them?',
      options: ['Linked List Stack', 'Inverted Index', 'SOAP Envelope', 'Binary Tree Heap'],
      correctIndex: 1,
      explanation: 'An inverted index enables millisecond keyword lookup across millions of indexed web pages.',
      difficulty: 'Medium',
    },
    {
      questionText: 'Which recommender system challenge occurs when a brand-new user or item has zero interaction history?',
      options: ['Cache Poisoning', 'Cold-Start Problem', 'Quirks Mode', 'Deadlock'],
      correctIndex: 1,
      explanation: 'The Cold-Start problem happens when collaborative filtering lacks prior ratings for new users or items.',
      difficulty: 'Medium',
    },
    {
      questionText: 'How does Edge Computing reduce web application latency?',
      options: [
        'By storing all data on floppy disks',
        'By executing caching and lightweight compute at PoPs physically closer to the user',
        'By disabling TLS encryption',
        'By forcing synchronous page reloads',
      ],
      correctIndex: 1,
      explanation: 'Running logic at nearby Edge PoPs slashes round-trip propagation time.',
      difficulty: 'Easy',
    },
    {
      questionText: 'Which CSS media feature detects whether a user’s OS is configured for Dark Mode?',
      options: ['color-depth', 'prefers-color-scheme', 'screen-brightness', 'dark-theme-mode'],
      correctIndex: 1,
      explanation: '@media (prefers-color-scheme: dark) detects the operating system’s theme preference.',
      difficulty: 'Medium',
    },
  ],
};
