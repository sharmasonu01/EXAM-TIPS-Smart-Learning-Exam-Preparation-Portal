export interface SchematicNode {
  id: string;
  label: string;
  sublabel?: string;
  x: number;
  y: number;
  w: number;
  h: number;
  tone?: 'neutral' | 'primary' | 'emerald' | 'amber' | 'violet';
  step?: number;
}

export interface SchematicEdge {
  from: string;
  to: string;
  label?: string;
  bidirectional?: boolean;
  dashed?: boolean;
  step?: number;
}

export interface SchematicSpec {
  layout: 'flow' | 'stack' | 'triangle' | 'compare' | 'hub';
  nodes: SchematicNode[];
  edges: SchematicEdge[];
}

export const SCHEMATIC_SPECS: Record<string, SchematicSpec> = {
  'u1-internet-arch': {
    layout: 'flow',
    nodes: [
      { id: 'lan', label: 'End User LAN', sublabel: 'Hosts · Wi-Fi · Router', x: 30, y: 120, w: 150, h: 76, tone: 'neutral', step: 1 },
      { id: 'isp', label: 'Regional ISP', sublabel: 'BGP · Access Aggregation', x: 230, y: 120, w: 160, h: 76, tone: 'primary', step: 2 },
      { id: 'ixp', label: 'Tier-1 Backbone & IXP', sublabel: 'Optical Fiber Mesh', x: 440, y: 60, w: 180, h: 76, tone: 'amber', step: 3 },
      { id: 'ixp2', label: 'Peering Exchange', sublabel: 'TCP/IP Packet Routing', x: 440, y: 185, w: 180, h: 76, tone: 'violet', step: 3 },
      { id: 'dc', label: 'Origin Data Center', sublabel: 'Web / App / DB Servers', x: 670, y: 120, w: 160, h: 76, tone: 'emerald', step: 4 },
    ],
    edges: [
      { from: 'lan', to: 'isp', label: 'Packets', step: 1 },
      { from: 'isp', to: 'ixp', label: 'BGP Route', step: 2 },
      { from: 'isp', to: 'ixp2', label: 'Alt Path', dashed: true, step: 3 },
      { from: 'ixp', to: 'dc', label: 'Fiber Trunk', step: 4 },
      { from: 'ixp2', to: 'dc', label: 'Delivery', step: 4 },
    ],
  },
  'u1-client-server': {
    layout: 'flow',
    nodes: [
      { id: 'client', label: 'Web Client (Browser)', sublabel: 'UI + Rendering Engine', x: 50, y: 115, w: 200, h: 90, tone: 'primary', step: 1 },
      { id: 'net', label: 'TCP/IP Network', sublabel: 'Port 80 (HTTP) / 443 (TLS)', x: 330, y: 122, w: 200, h: 76, tone: 'neutral', step: 2 },
      { id: 'server', label: 'Web Server', sublabel: 'Nginx / Apache / Node', x: 610, y: 70, w: 200, h: 76, tone: 'emerald', step: 3 },
      { id: 'store', label: 'Data & Asset Store', sublabel: 'Files + PostgreSQL', x: 610, y: 185, w: 200, h: 72, tone: 'amber', step: 4 },
    ],
    edges: [
      { from: 'client', to: 'net', label: 'HTTP Request', step: 2 },
      { from: 'net', to: 'server', label: 'Socket Stream', step: 3 },
      { from: 'server', to: 'store', label: 'Query / Read', bidirectional: true, step: 3 },
      { from: 'server', to: 'client', label: '200 OK + HTML/JSON', dashed: true, step: 4 },
    ],
  },
  'u1-http-working': {
    layout: 'flow',
    nodes: [
      { id: 'tcp', label: '1. TCP Handshake', sublabel: 'SYN -> SYN-ACK -> ACK', x: 30, y: 115, w: 175, h: 84, tone: 'neutral', step: 1 },
      { id: 'req', label: '2. HTTP Request', sublabel: 'GET /unit1.html HTTP/1.1', x: 245, y: 115, w: 185, h: 84, tone: 'primary', step: 2 },
      { id: 'res', label: '3. HTTP Response', sublabel: 'HTTP/1.1 200 OK + Body', x: 470, y: 115, w: 185, h: 84, tone: 'emerald', step: 3 },
      { id: 'keep', label: '4. Render & Keep-Alive', sublabel: 'Stateless · Reuse Socket', x: 695, y: 115, w: 175, h: 84, tone: 'amber', step: 4 },
    ],
    edges: [
      { from: 'tcp', to: 'req', label: 'Connected', step: 1 },
      { from: 'req', to: 'res', label: 'Server Parse', step: 2 },
      { from: 'res', to: 'keep', label: 'Payload', step: 3 },
    ],
  },
  'u1-dns-resolution': {
    layout: 'hub',
    nodes: [
      { id: 'browser', label: 'Browser & OS Cache', sublabel: 'Check local hosts / TTL', x: 30, y: 120, w: 175, h: 80, tone: 'neutral', step: 1 },
      { id: 'resolver', label: 'Recursive Resolver', sublabel: 'ISP / 1.1.1.1 / 8.8.8.8', x: 255, y: 120, w: 185, h: 80, tone: 'primary', step: 1 },
      { id: 'root', label: 'Root Nameserver (.)', sublabel: 'Refers to .edu / .com', x: 530, y: 30, w: 220, h: 68, tone: 'amber', step: 2 },
      { id: 'tld', label: 'TLD Nameserver (.edu)', sublabel: 'Refers to Authoritative NS', x: 530, y: 126, w: 220, h: 68, tone: 'violet', step: 3 },
      { id: 'auth', label: 'Authoritative Server', sublabel: 'Returns A / AAAA IP Record', x: 530, y: 222, w: 220, h: 68, tone: 'emerald', step: 4 },
    ],
    edges: [
      { from: 'browser', to: 'resolver', label: 'Query domain', step: 1 },
      { from: 'resolver', to: 'root', label: '1. Iterative', bidirectional: true, step: 2 },
      { from: 'resolver', to: 'tld', label: '2. Iterative', bidirectional: true, step: 3 },
      { from: 'resolver', to: 'auth', label: '3. Final IP', bidirectional: true, step: 4 },
    ],
  },
  'u1-email-arch': {
    layout: 'flow',
    nodes: [
      { id: 'mua1', label: 'Sender MUA', sublabel: 'Compose + MIME Encode', x: 25, y: 115, w: 165, h: 84, tone: 'primary', step: 1 },
      { id: 'mta1', label: 'Sender MTA (SMTP)', sublabel: 'Port 587 / 25 Relay', x: 235, y: 115, w: 175, h: 84, tone: 'amber', step: 2 },
      { id: 'mda', label: 'Recipient MTA & MDA', sublabel: 'Mailbox Store', x: 455, y: 115, w: 180, h: 84, tone: 'neutral', step: 3 },
      { id: 'mua2', label: 'Recipient MUA', sublabel: 'IMAP (143) / POP3 (110)', x: 680, y: 115, w: 185, h: 84, tone: 'emerald', step: 4 },
    ],
    edges: [
      { from: 'mua1', to: 'mta1', label: 'SMTP Push', step: 1 },
      { from: 'mta1', to: 'mda', label: 'MX Relay', step: 2 },
      { from: 'mda', to: 'mua2', label: 'IMAP / POP3 Pull', step: 4 },
    ],
  },
  'u1-browser-server': {
    layout: 'flow',
    nodes: [
      { id: 'url', label: 'URL & Networking', sublabel: 'DNS + TLS + HTTP GET', x: 30, y: 115, w: 175, h: 84, tone: 'neutral', step: 1 },
      { id: 'srv', label: 'Web Server', sublabel: 'Static Files / App Runtime', x: 245, y: 115, w: 180, h: 84, tone: 'amber', step: 2 },
      { id: 'trees', label: 'DOM & CSSOM Trees', sublabel: 'HTML + CSS Parsers + JS', x: 465, y: 115, w: 185, h: 84, tone: 'primary', step: 3 },
      { id: 'paint', label: 'Render Tree & Paint', sublabel: 'Layout Geometry + Pixels', x: 690, y: 115, w: 180, h: 84, tone: 'emerald', step: 4 },
    ],
    edges: [
      { from: 'url', to: 'srv', label: 'GET /', step: 1 },
      { from: 'srv', to: 'trees', label: 'HTML/CSS/JS', step: 2 },
      { from: 'trees', to: 'paint', label: 'Composite', step: 4 },
    ],
  },
  'u1-history-timeline': {
    layout: 'flow',
    nodes: [
      { id: 'arpa', label: '1969 · ARPANET', sublabel: '4 University Nodes · Packet Switching', x: 25, y: 40, w: 245, h: 78, tone: 'neutral', step: 1 },
      { id: 'email', label: '1971–74 · Email & TCP', sublabel: 'Ray Tomlinson (@) · Cerf & Kahn', x: 325, y: 40, w: 245, h: 78, tone: 'primary', step: 1 },
      { id: 'tcpip', label: '1983 · TCP/IP & DNS', sublabel: 'ARPANET Flag Day · .com/.edu Zones', x: 625, y: 40, w: 245, h: 78, tone: 'amber', step: 2 },
      { id: 'www', label: '1989 · WWW Proposal', sublabel: 'Tim Berners-Lee · HTTP/HTML/URL', x: 625, y: 185, w: 245, h: 78, tone: 'emerald', step: 3 },
      { id: 'mosaic', label: '1993 · Mosaic & Web 1.0', sublabel: 'Graphical Browser · Commercial ISPs', x: 325, y: 185, w: 245, h: 78, tone: 'violet', step: 4 },
      { id: 'icann', label: '1998+ · ICANN & Modern Web', sublabel: 'Global DNS · HTTP/2 & HTTP/3', x: 25, y: 185, w: 245, h: 78, tone: 'primary', step: 4 },
    ],
    edges: [
      { from: 'arpa', to: 'email', label: 'Packet Network', step: 1 },
      { from: 'email', to: 'tcpip', label: 'Protocol Standard', step: 2 },
      { from: 'tcpip', to: 'www', label: 'Hypertext Layer', step: 3 },
      { from: 'www', to: 'mosaic', label: 'Browser Era', step: 4 },
      { from: 'mosaic', to: 'icann', label: 'Global Scale', step: 4 },
    ],
  },
  'u1-www-arch': {
    layout: 'hub',
    nodes: [
      { id: 'browser', label: 'Web Browser (Client)', sublabel: 'URL Bar · DOM · CSSOM · JS', x: 30, y: 115, w: 195, h: 86, tone: 'primary', step: 1 },
      { id: 'dns', label: 'DNS Resolver', sublabel: 'Maps Domain -> Server IP', x: 295, y: 26, w: 215, h: 68, tone: 'amber', step: 2 },
      { id: 'http', label: 'HTTP / HTTPS Transport', sublabel: 'URL Addressing + Stateless Req/Res', x: 285, y: 120, w: 235, h: 78, tone: 'neutral', step: 3 },
      { id: 'server', label: 'Web Server', sublabel: 'Nginx / Apache · Port 80/443', x: 600, y: 70, w: 255, h: 78, tone: 'emerald', step: 3 },
      { id: 'hyper', label: 'Hypertext Document Store', sublabel: 'Linked HTML · Media · Web APIs', x: 600, y: 190, w: 255, h: 78, tone: 'violet', step: 4 },
    ],
    edges: [
      { from: 'browser', to: 'dns', label: 'Lookup Host', bidirectional: true, step: 2 },
      { from: 'browser', to: 'http', label: 'GET /page.html', step: 1 },
      { from: 'http', to: 'server', label: 'TCP/TLS Socket', step: 3 },
      { from: 'server', to: 'hyper', label: 'Fetch Resource', bidirectional: true, step: 4 },
      { from: 'server', to: 'browser', label: 'HTML + Links', dashed: true, step: 4 },
    ],
  },
  'u2-dhtml-pipeline': {
    layout: 'flow',
    nodes: [
      { id: 'dom', label: 'HTML + CSS Render', sublabel: 'Initial DOM & Style Rules', x: 30, y: 115, w: 175, h: 84, tone: 'neutral', step: 1 },
      { id: 'evt', label: 'User Event', sublabel: 'click / input / submit', x: 245, y: 115, w: 175, h: 84, tone: 'amber', step: 2 },
      { id: 'js', label: 'JavaScript Handler', sublabel: 'Mutate DOM & classList', x: 460, y: 115, w: 185, h: 84, tone: 'primary', step: 3 },
      { id: 'rep', label: 'Incremental Repaint', sublabel: 'Zero Page Reload', x: 685, y: 115, w: 185, h: 84, tone: 'emerald', step: 4 },
    ],
    edges: [
      { from: 'dom', to: 'evt', label: 'Listen', step: 1 },
      { from: 'evt', to: 'js', label: 'Dispatch', step: 2 },
      { from: 'js', to: 'rep', label: 'Reflow', step: 4 },
    ],
  },
  'u2-xml-schema-xslt': {
    layout: 'flow',
    nodes: [
      { id: 'xml', label: 'Raw XML Document', sublabel: 'Well-Formed Data Tree', x: 30, y: 115, w: 175, h: 84, tone: 'neutral', step: 1 },
      { id: 'xsd', label: 'DTD / XSD Validator', sublabel: 'Strong Types & Structure', x: 245, y: 115, w: 180, h: 84, tone: 'amber', step: 2 },
      { id: 'xslt', label: 'XSLT Processor', sublabel: 'XPath Templates Transform', x: 465, y: 115, w: 180, h: 84, tone: 'primary', step: 3 },
      { id: 'html', label: 'HTML / Styled Output', sublabel: 'Browser Presentation', x: 685, y: 115, w: 185, h: 84, tone: 'emerald', step: 4 },
    ],
    edges: [
      { from: 'xml', to: 'xsd', label: 'Validate', step: 2 },
      { from: 'xsd', to: 'xslt', label: 'Valid XML', step: 3 },
      { from: 'xslt', to: 'html', label: 'Render', step: 4 },
    ],
  },
  'u2-xml-dom-sax': {
    layout: 'compare',
    nodes: [
      { id: 'input', label: 'XML Stream Input', sublabel: '<course><unit>...</unit></course>', x: 30, y: 115, w: 180, h: 84, tone: 'neutral', step: 1 },
      { id: 'dom', label: 'DOM Parser (Tree)', sublabel: 'Full RAM Tree · Read/Write · XPath', x: 290, y: 45, w: 260, h: 88, tone: 'primary', step: 2 },
      { id: 'sax', label: 'SAX Parser (Stream)', sublabel: 'startElement() / endElement() · Low RAM', x: 290, y: 175, w: 260, h: 88, tone: 'amber', step: 3 },
      { id: 'app', label: 'Application Layer', sublabel: 'DOM: Edit/Query | SAX: Huge Feeds', x: 630, y: 115, w: 230, h: 84, tone: 'emerald', step: 4 },
    ],
    edges: [
      { from: 'input', to: 'dom', label: 'Load All', step: 2 },
      { from: 'input', to: 'sax', label: 'Stream Events', step: 3 },
      { from: 'dom', to: 'app', label: 'Random Access', step: 4 },
      { from: 'sax', to: 'app', label: 'Callbacks', step: 4 },
    ],
  },
  'u3-ws-arch': {
    layout: 'triangle',
    nodes: [
      { id: 'reg', label: 'Service Registry (UDDI)', sublabel: 'White / Yellow / Green Pages', x: 325, y: 24, w: 240, h: 80, tone: 'amber', step: 1 },
      { id: 'req', label: 'Service Requestor', sublabel: 'Client App + WSDL Stub', x: 60, y: 205, w: 230, h: 84, tone: 'primary', step: 2 },
      { id: 'prov', label: 'Service Provider', sublabel: 'Web Service Endpoint + WSDL', x: 600, y: 205, w: 230, h: 84, tone: 'emerald', step: 4 },
    ],
    edges: [
      { from: 'prov', to: 'reg', label: '1. Publish (WSDL)', step: 1 },
      { from: 'req', to: 'reg', label: '2. Find Service', bidirectional: true, step: 2 },
      { from: 'req', to: 'prov', label: '3. Bind & Invoke (SOAP / HTTP)', bidirectional: true, step: 4 },
    ],
  },
  'u3-soap-flow': {
    layout: 'flow',
    nodes: [
      { id: 'proxy', label: 'Client Stub', sublabel: 'Marshal Arguments to XML', x: 30, y: 115, w: 175, h: 84, tone: 'primary', step: 1 },
      { id: 'env', label: 'SOAP Envelope (HTTP POST)', sublabel: '<Header> + <Body> + <Fault>', x: 245, y: 115, w: 210, h: 84, tone: 'amber', step: 2 },
      { id: 'skel', label: 'Server Endpoint', sublabel: 'Unmarshal & Run Service', x: 495, y: 115, w: 175, h: 84, tone: 'neutral', step: 3 },
      { id: 'resp', label: 'SOAP Response / Fault', sublabel: 'Typed Result XML', x: 710, y: 115, w: 165, h: 84, tone: 'emerald', step: 4 },
    ],
    edges: [
      { from: 'proxy', to: 'env', label: 'Serialize', step: 1 },
      { from: 'env', to: 'skel', label: 'POST', step: 2 },
      { from: 'skel', to: 'resp', label: 'Return', step: 4 },
    ],
  },
  'u3-wsdl-arch': {
    layout: 'compare',
    nodes: [
      { id: 'types', label: '<types> (XSD)', sublabel: 'Schema Data Types', x: 45, y: 40, w: 220, h: 68, tone: 'neutral', step: 1 },
      { id: 'msg', label: '<message> & <portType>', sublabel: 'Abstract Operations & Params', x: 45, y: 135, w: 220, h: 72, tone: 'primary', step: 2 },
      { id: 'bind', label: '<binding>', sublabel: 'Concrete Protocol (SOAP/HTTP)', x: 350, y: 90, w: 230, h: 78, tone: 'amber', step: 3 },
      { id: 'svc', label: '<service> & <port>', sublabel: 'Live Network Endpoint URI', x: 650, y: 90, w: 215, h: 78, tone: 'emerald', step: 4 },
    ],
    edges: [
      { from: 'types', to: 'msg', label: 'Defines', step: 1 },
      { from: 'msg', to: 'bind', label: 'Maps to', step: 2 },
      { from: 'bind', to: 'svc', label: 'Exposes', step: 4 },
    ],
  },
  'u3-uddi-registry': {
    layout: 'stack',
    nodes: [
      { id: 'white', label: 'White Pages', sublabel: 'Organization Name · Contacts · Identifiers', x: 80, y: 35, w: 460, h: 68, tone: 'neutral', step: 1 },
      { id: 'yellow', label: 'Yellow Pages', sublabel: 'Industry Categories (NAICS / UNSPSC / Region)', x: 80, y: 120, w: 460, h: 68, tone: 'amber', step: 2 },
      { id: 'green', label: 'Green Pages', sublabel: 'Technical tModel Specs · WSDL Endpoint URLs', x: 80, y: 205, w: 460, h: 68, tone: 'emerald', step: 3 },
      { id: 'api', label: 'UDDI SOAP Inquiry API', sublabel: 'Search & Binding Discovery', x: 615, y: 120, w: 235, h: 78, tone: 'primary', step: 4 },
    ],
    edges: [
      { from: 'api', to: 'white', label: 'Lookup', bidirectional: true, step: 4 },
      { from: 'api', to: 'yellow', label: 'Filter', bidirectional: true, step: 4 },
      { from: 'api', to: 'green', label: 'Fetch WSDL', bidirectional: true, step: 4 },
    ],
  },
  'u3-ajax-working': {
    layout: 'flow',
    nodes: [
      { id: 'ui', label: '1. User Event', sublabel: 'No Page Navigation', x: 25, y: 115, w: 170, h: 84, tone: 'neutral', step: 1 },
      { id: 'xhr', label: '2. XHR / fetch()', sublabel: 'Async Background Request', x: 235, y: 115, w: 185, h: 84, tone: 'primary', step: 2 },
      { id: 'api', label: '3. Server JSON Reply', sublabel: 'Compact DB Query Result', x: 460, y: 115, w: 185, h: 84, tone: 'amber', step: 3 },
      { id: 'dom', label: '4. Partial DOM Update', sublabel: 'Smooth Live UI Patch', x: 685, y: 115, w: 185, h: 84, tone: 'emerald', step: 4 },
    ],
    edges: [
      { from: 'ui', to: 'xhr', label: 'Trigger', step: 1 },
      { from: 'xhr', to: 'api', label: 'Non-Blocking', step: 2 },
      { from: 'api', to: 'dom', label: 'JSON Callback', step: 4 },
    ],
  },
  'u3-corba-arch': {
    layout: 'flow',
    nodes: [
      { id: 'idl', label: 'OMG IDL Contract', sublabel: 'Client Stub Generation', x: 25, y: 115, w: 175, h: 84, tone: 'neutral', step: 1 },
      { id: 'corb', label: 'Client ORB', sublabel: 'Marshal Binary CDR', x: 240, y: 115, w: 170, h: 84, tone: 'primary', step: 2 },
      { id: 'iiop', label: 'GIOP / IIOP', sublabel: 'TCP/IP Inter-ORB Bus', x: 450, y: 115, w: 170, h: 84, tone: 'amber', step: 3 },
      { id: 'sorb', label: 'Server ORB + POA', sublabel: 'Skeleton -> Remote Object', x: 660, y: 115, w: 205, h: 84, tone: 'emerald', step: 4 },
    ],
    edges: [
      { from: 'idl', to: 'corb', label: 'Invoke', step: 1 },
      { from: 'corb', to: 'iiop', label: 'Binary Call', step: 2 },
      { from: 'iiop', to: 'sorb', label: 'Dispatch', step: 4 },
    ],
  },
  'u4-web-evolution': {
    layout: 'flow',
    nodes: [
      { id: 'w1', label: 'Web 1.0 (1991)', sublabel: 'Read-Only · Static HTML', x: 30, y: 115, w: 240, h: 88, tone: 'neutral', step: 1 },
      { id: 'w2', label: 'Web 2.0 (2004)', sublabel: 'Read-Write · AJAX · Social · APIs', x: 325, y: 115, w: 245, h: 88, tone: 'primary', step: 2 },
      { id: 'w3', label: 'Web 3.0 (Semantic/DWeb)', sublabel: 'RDF/OWL · Linked Data · Trust', x: 625, y: 115, w: 245, h: 88, tone: 'emerald', step: 3 },
    ],
    edges: [
      { from: 'w1', to: 'w2', label: 'Interactivity', step: 2 },
      { from: 'w2', to: 'w3', label: 'Meaning & Decentralization', step: 3 },
    ],
  },
  'u4-semantic-web': {
    layout: 'stack',
    nodes: [
      { id: 'trust', label: 'Proof, Trust & Crypto Signatures', sublabel: 'Provenance Verification', x: 140, y: 24, w: 600, h: 56, tone: 'emerald', step: 4 },
      { id: 'owl', label: 'OWL Ontologies · Rules · SPARQL Query', sublabel: 'Inference & Graph Queries', x: 140, y: 92, w: 600, h: 58, tone: 'violet', step: 3 },
      { id: 'rdf', label: 'RDF Data Model (Subject–Predicate–Object) & RDFS', sublabel: 'Linked Graph Triples', x: 140, y: 162, w: 600, h: 58, tone: 'primary', step: 2 },
      { id: 'uri', label: 'Unicode · URI Identifiers · XML / JSON-LD Syntax', sublabel: 'Foundational Layer', x: 140, y: 232, w: 600, h: 56, tone: 'neutral', step: 1 },
    ],
    edges: [
      { from: 'uri', to: 'rdf', step: 1 },
      { from: 'rdf', to: 'owl', step: 2 },
      { from: 'owl', to: 'trust', step: 4 },
    ],
  },
  'u4-rss-flow': {
    layout: 'flow',
    nodes: [
      { id: 'pub', label: 'Blog / CMS Publisher', sublabel: 'Publishes New Post', x: 30, y: 115, w: 175, h: 84, tone: 'neutral', step: 1 },
      { id: 'xml', label: 'RSS 2.0 XML Feed', sublabel: '<channel> + <item> entries', x: 245, y: 115, w: 185, h: 84, tone: 'amber', step: 2 },
      { id: 'agg', label: 'Feed Aggregator', sublabel: 'Periodic HTTP GET Poll', x: 470, y: 115, w: 180, h: 84, tone: 'primary', step: 3 },
      { id: 'rdr', label: 'Subscriber Reader', sublabel: 'Unified Updates Stream', x: 690, y: 115, w: 180, h: 84, tone: 'emerald', step: 4 },
    ],
    edges: [
      { from: 'pub', to: 'xml', label: 'Emit', step: 1 },
      { from: 'xml', to: 'agg', label: 'Fetch', step: 3 },
      { from: 'agg', to: 'rdr', label: 'Display', step: 4 },
    ],
  },
  'u4-mashup-arch': {
    layout: 'hub',
    nodes: [
      { id: 'api1', label: 'Maps / Geo API', sublabel: 'Open REST JSON', x: 35, y: 35, w: 185, h: 68, tone: 'neutral', step: 1 },
      { id: 'api2', label: 'Transit / Weather API', sublabel: 'Live Feed / RSS', x: 35, y: 126, w: 185, h: 68, tone: 'amber', step: 1 },
      { id: 'api3', label: 'Listings Data API', sublabel: 'OAuth 2.0 Open API', x: 35, y: 217, w: 185, h: 68, tone: 'violet', step: 1 },
      { id: 'srv', label: 'Mashup Integration Proxy', sublabel: 'Normalize · Cache · Hide Keys', x: 330, y: 115, w: 230, h: 88, tone: 'primary', step: 2 },
      { id: 'ui', label: 'Unified Web Mashup UI', sublabel: 'Synchronized Interactive View', x: 650, y: 115, w: 215, h: 88, tone: 'emerald', step: 4 },
    ],
    edges: [
      { from: 'api1', to: 'srv', step: 1 },
      { from: 'api2', to: 'srv', step: 1 },
      { from: 'api3', to: 'srv', step: 1 },
      { from: 'srv', to: 'ui', label: 'Merged JSON', step: 3 },
    ],
  },
  'u4-blockchain-arch': {
    layout: 'flow',
    nodes: [
      { id: 'tx', label: 'Signed Transactions', sublabel: 'Public-Key Mempool', x: 25, y: 115, w: 175, h: 84, tone: 'neutral', step: 1 },
      { id: 'b1', label: 'Block N-1', sublabel: 'Merkle Root · Hash A1F9', x: 240, y: 115, w: 175, h: 84, tone: 'primary', step: 2 },
      { id: 'b2', label: 'Block N', sublabel: 'PrevHash: A1F9 · Consensus', x: 460, y: 115, w: 190, h: 84, tone: 'amber', step: 3 },
      { id: 'b3', label: 'Block N+1', sublabel: 'PrevHash: 7C42 · Immutable', x: 695, y: 115, w: 175, h: 84, tone: 'emerald', step: 4 },
    ],
    edges: [
      { from: 'tx', to: 'b1', label: 'Pack', step: 1 },
      { from: 'b1', to: 'b2', label: 'Hash Link', step: 3 },
      { from: 'b2', to: 'b3', label: 'Hash Link', step: 4 },
    ],
  },
  'u4-edge-arch': {
    layout: 'flow',
    nodes: [
      { id: 'usr', label: 'Global End Users', sublabel: 'Anycast DNS Routing', x: 30, y: 115, w: 175, h: 84, tone: 'neutral', step: 1 },
      { id: 'edge', label: 'Regional Edge PoP', sublabel: 'Workers · Cache · Auth (<20ms)', x: 260, y: 115, w: 225, h: 84, tone: 'emerald', step: 2 },
      { id: 'orig', label: 'Origin App & Cloud SQL', sublabel: 'Cache Misses & DB Writes', x: 560, y: 115, w: 235, h: 84, tone: 'primary', step: 3 },
    ],
    edges: [
      { from: 'usr', to: 'edge', label: 'Sub-20ms RTT', bidirectional: true, step: 2 },
      { from: 'edge', to: 'orig', label: 'Selective Origin Sync', bidirectional: true, dashed: true, step: 3 },
    ],
  },
  'u4-recommender-flow': {
    layout: 'flow',
    nodes: [
      { id: 'log', label: 'Interaction Signals', sublabel: 'Views · Bookmarks · Scores', x: 25, y: 115, w: 175, h: 84, tone: 'neutral', step: 1 },
      { id: 'mat', label: 'User-Item & Feature Matrix', sublabel: 'TF-IDF + Collaborative Vectors', x: 240, y: 115, w: 195, h: 84, tone: 'primary', step: 2 },
      { id: 'sim', label: 'Similarity Scoring', sublabel: 'Cosine / Matrix Factorization', x: 475, y: 115, w: 185, h: 84, tone: 'amber', step: 3 },
      { id: 'topn', label: 'Top-N Ranked Picks', sublabel: 'Personalized Study Next', x: 700, y: 115, w: 175, h: 84, tone: 'emerald', step: 4 },
    ],
    edges: [
      { from: 'log', to: 'mat', label: 'Vectorize', step: 1 },
      { from: 'mat', to: 'sim', label: 'Predict', step: 2 },
      { from: 'sim', to: 'topn', label: 'Rank', step: 4 },
    ],
  },
  'u5-web4-evolution': {
    layout: 'flow',
    nodes: [
      { id: 'w1', label: 'Web 1.0', sublabel: 'Static Hypertext', x: 25, y: 115, w: 165, h: 84, tone: 'neutral', step: 1 },
      { id: 'w2', label: 'Web 2.0', sublabel: 'Social & AJAX', x: 235, y: 115, w: 165, h: 84, tone: 'primary', step: 2 },
      { id: 'w3', label: 'Web 3.0', sublabel: 'Semantic & DWeb', x: 445, y: 115, w: 175, h: 84, tone: 'violet', step: 3 },
      { id: 'w4', label: 'Web 4.0', sublabel: 'Symbiotic AI · IoT · XR', x: 665, y: 115, w: 205, h: 84, tone: 'emerald', step: 4 },
    ],
    edges: [
      { from: 'w1', to: 'w2', step: 1 },
      { from: 'w2', to: 'w3', step: 2 },
      { from: 'w3', to: 'w4', step: 4 },
    ],
  },
  'u5-ai-web-arch': {
    layout: 'flow',
    nodes: [
      { id: 'ctx', label: 'Context & Telemetry', sublabel: 'Quiz Mastery · Preferences', x: 25, y: 115, w: 175, h: 84, tone: 'neutral', step: 1 },
      { id: 'vec', label: 'Vector Embeddings', sublabel: 'Semantic Concept Index', x: 240, y: 115, w: 180, h: 84, tone: 'primary', step: 2 },
      { id: 'inf', label: 'AI Inference Gateway', sublabel: 'Personalization Ranking', x: 460, y: 115, w: 185, h: 84, tone: 'amber', step: 3 },
      { id: 'ui', label: 'Adaptive UI Stream', sublabel: 'Tailored Study Workspace', x: 685, y: 115, w: 185, h: 84, tone: 'emerald', step: 4 },
    ],
    edges: [
      { from: 'ctx', to: 'vec', label: 'Embed', step: 1 },
      { from: 'vec', to: 'inf', label: 'Retrieve', step: 2 },
      { from: 'inf', to: 'ui', label: 'Adapt', step: 4 },
    ],
  },
  'u5-dweb-arch': {
    layout: 'flow',
    nodes: [
      { id: 'cid', label: 'Content Hash (CID)', sublabel: 'Merkle DAG Chunks', x: 30, y: 115, w: 175, h: 84, tone: 'primary', step: 1 },
      { id: 'dht', label: 'P2P DHT Routing', sublabel: 'Locate Hosting Peers', x: 245, y: 115, w: 180, h: 84, tone: 'amber', step: 2 },
      { id: 'did', label: 'DID Identity Layer', sublabel: 'Self-Sovereign Keys', x: 465, y: 115, w: 180, h: 84, tone: 'violet', step: 3 },
      { id: 'ver', label: 'Local Hash Verify', sublabel: 'Tamper-Proof Delivery', x: 685, y: 115, w: 185, h: 84, tone: 'emerald', step: 4 },
    ],
    edges: [
      { from: 'cid', to: 'dht', label: 'Resolve', step: 1 },
      { from: 'dht', to: 'did', label: 'Authenticate', step: 2 },
      { from: 'did', to: 'ver', label: 'Verify', step: 4 },
    ],
  },
  'u5-blockchain-int': {
    layout: 'flow',
    nodes: [
      { id: 'web', label: 'Web UI + Wallet', sublabel: 'Sign Action Client-Side', x: 25, y: 115, w: 175, h: 84, tone: 'primary', step: 1 },
      { id: 'rpc', label: 'JSON-RPC Gateway', sublabel: 'Broadcast Signed Tx', x: 240, y: 115, w: 180, h: 84, tone: 'amber', step: 2 },
      { id: 'sc', label: 'Smart Contract', sublabel: 'On-Chain State & Proof', x: 460, y: 115, w: 180, h: 84, tone: 'violet', step: 3 },
      { id: 'idx', label: 'Off-Chain SQL Indexer', sublabel: 'Fast UI Queries in Postgres', x: 680, y: 115, w: 190, h: 84, tone: 'emerald', step: 4 },
    ],
    edges: [
      { from: 'web', to: 'rpc', label: 'Sign', step: 1 },
      { from: 'rpc', to: 'sc', label: 'Execute', step: 2 },
      { from: 'sc', to: 'idx', label: 'Sync Events', step: 4 },
    ],
  },
  'u5-iot-arch': {
    layout: 'flow',
    nodes: [
      { id: 'sen', label: '1. Sensors & Actuators', sublabel: 'Perception Layer', x: 25, y: 115, w: 175, h: 84, tone: 'neutral', step: 1 },
      { id: 'mqtt', label: '2. MQTT / CoAP Gateway', sublabel: 'Pub/Sub Telemetry', x: 240, y: 115, w: 185, h: 84, tone: 'amber', step: 2 },
      { id: 'cld', label: '3. Stream Rules & DB', sublabel: 'Time-Series Ingestion', x: 465, y: 115, w: 180, h: 84, tone: 'primary', step: 3 },
      { id: 'ws', label: '4. Live Web Dashboard', sublabel: 'WebSockets / WoT UI', x: 685, y: 115, w: 185, h: 84, tone: 'emerald', step: 4 },
    ],
    edges: [
      { from: 'sen', to: 'mqtt', label: 'Publish', step: 1 },
      { from: 'mqtt', to: 'cld', label: 'Ingest', step: 2 },
      { from: 'cld', to: 'ws', label: 'Stream', step: 4 },
    ],
  },
  'u5-ar-vs-vr': {
    layout: 'compare',
    nodes: [
      { id: 'xr', label: 'WebXR Device API', sublabel: 'Unified Browser Spatial Standard', x: 30, y: 115, w: 185, h: 84, tone: 'primary', step: 2 },
      { id: 'ar', label: 'WebAR (Pass-Through)', sublabel: 'Physical World + 3D Overlays · Phone/Glasses', x: 295, y: 45, w: 280, h: 88, tone: 'emerald', step: 1 },
      { id: 'vr', label: 'WebVR (Occluded 3D)', sublabel: '100% Synthetic Scene · 6DoF Headset · 90 FPS', x: 295, y: 175, w: 280, h: 88, tone: 'violet', step: 3 },
      { id: 'gpu', label: 'WebGL / WebGPU', sublabel: 'Hardware Shader Pipeline', x: 655, y: 115, w: 210, h: 84, tone: 'amber', step: 4 },
    ],
    edges: [
      { from: 'xr', to: 'ar', label: 'SLAM Planes', step: 1 },
      { from: 'xr', to: 'vr', label: '6DoF Pose', step: 3 },
      { from: 'ar', to: 'gpu', step: 4 },
      { from: 'vr', to: 'gpu', step: 4 },
    ],
  },
  'u5-smart-web': {
    layout: 'flow',
    nodes: [
      { id: 'in', label: 'Multimodal Context', sublabel: 'Voice · Location · Device', x: 25, y: 115, w: 175, h: 84, tone: 'neutral', step: 1 },
      { id: 'kg', label: 'Knowledge Graph', sublabel: 'Semantic Entity Reasoning', x: 240, y: 115, w: 180, h: 84, tone: 'primary', step: 2 },
      { id: 'act', label: 'Proactive Planner', sublabel: 'Automated Task Execution', x: 460, y: 115, w: 180, h: 84, tone: 'amber', step: 3 },
      { id: 'out', label: 'Adaptive Surface', sublabel: 'Desktop · Mobile · Wearable', x: 680, y: 115, w: 190, h: 84, tone: 'emerald', step: 4 },
    ],
    edges: [
      { from: 'in', to: 'kg', step: 1 },
      { from: 'kg', to: 'act', step: 2 },
      { from: 'act', to: 'out', step: 4 },
    ],
  },
  'u5-5g-impact': {
    layout: 'hub',
    nodes: [
      { id: 'embb', label: 'eMBB (>1 Gbps)', sublabel: '4K/8K Video · Heavy WASM · 3D', x: 35, y: 35, w: 210, h: 68, tone: 'primary', step: 1 },
      { id: 'urllc', label: 'URLLC (<10ms)', sublabel: 'Cloud Gaming · Live Collab', x: 35, y: 126, w: 210, h: 68, tone: 'amber', step: 2 },
      { id: 'mmtc', label: 'mMTC (1M IoT/km²)', sublabel: 'Dense Sensor Web Telemetry', x: 35, y: 217, w: 210, h: 68, tone: 'violet', step: 3 },
      { id: 'mec', label: '5G Multi-Access Edge (MEC)', sublabel: 'Cell-Tower Compute & Cache', x: 335, y: 115, w: 235, h: 88, tone: 'emerald', step: 4 },
      { id: 'apps', label: 'Next-Gen Web Apps', sublabel: 'WebXR · Real-Time AI · WoT', x: 655, y: 115, w: 210, h: 88, tone: 'neutral', step: 4 },
    ],
    edges: [
      { from: 'embb', to: 'mec', step: 1 },
      { from: 'urllc', to: 'mec', step: 2 },
      { from: 'mmtc', to: 'mec', step: 3 },
      { from: 'mec', to: 'apps', label: 'Sub-10ms Delivery', step: 4 },
    ],
  },
};
