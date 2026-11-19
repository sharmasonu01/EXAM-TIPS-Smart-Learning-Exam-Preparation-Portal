import type { SeedUnit } from './types.ts';

export const unit1: SeedUnit = {
  unitNumber: 1,
  slug: 'unit-1-internet-and-www',
  title: 'Introduction to Internet and World Wide Web',
  subtitle: 'Course: Web Technology · Unit 1 · Network Foundations, Application Protocols & Web Infrastructure',
  description:
    'Complete Unit 1 study module for Web Technology covering History of the Internet, World Wide Web (WWW), HTML, HTTP, SMTP, POP3, MIME, IMAP, Domain Name Server (DNS), Web Browsers, and Web Servers with bilingual Exam & Hinglish explanations.',
  examWeight: '20% Weightage',
  estimatedHours: 6,
  syllabus: [
    'History of the Internet',
    'World Wide Web (WWW)',
    'HTML',
    'HTTP and SMTP',
    'POP3, MIME and IMAP',
    'Domain Name Server (DNS)',
    'Web Browsers',
    'Web Servers',
  ],
  quickRevision: [
    'ARPANET (1969) introduced packet switching; TCP/IP became the unified Internet protocol standard on January 1, 1983.',
    'WWW (1989) was invented by Sir Tim Berners-Lee at CERN by combining URLs, HTTP, and HTML.',
    'HTML structures hypertext documents semantically using elements like <header>, <nav>, <main>, <article>, and <a>.',
    'HTTP (TCP Port 80 / HTTPS Port 443) is a stateless pull-based request-response protocol; SMTP (Port 25 / 587) pushes outgoing email between servers.',
    'POP3 (Port 110 / 995) downloads mail locally and deletes it from the server; IMAP (Port 143 / 993) keeps folders synchronized across multiple devices.',
    'MIME extends 7-bit ASCII email using Content-Type and Base64 encoding so PDFs, images, audio, and UTF-8 text can travel safely over SMTP.',
    'DNS (UDP/TCP Port 53) resolves domain names to IP addresses via Browser Cache -> Recursive Resolver -> Root (.) -> TLD (.com/.edu) -> Authoritative Nameserver.',
    'Web Browsers parse HTML & CSS into DOM and CSSOM trees and render pixels; Web Servers (Nginx, Apache, IIS) listen on ports 80/443 to serve static or dynamic responses.',
  ],
  diagrams: [
    {
      diagramKey: 'u1-history-timeline',
      title: 'History of Internet Timeline',
      category: 'Flowchart',
      summary:
        'Chronological evolution from 1969 ARPANET packet switching to TCP/IP standardization (1983), WWW (1989), Mosaic (1993), and ICANN/Modern Web.',
      steps: [
        { step: 1, label: '1969–1974: ARPANET & Email', detail: '4-node packet-switched network launched; Ray Tomlinson introduces @ email.' },
        { step: 2, label: '1983: TCP/IP & DNS Flag Day', detail: 'ARPANET standardizes on TCP/IP; hierarchical domain naming begins.' },
        { step: 3, label: '1989–1991: World Wide Web', detail: 'Tim Berners-Lee proposes hypertext Web (HTTP, HTML, URL) at CERN.' },
        { step: 4, label: '1993–Present: Commercial Web', detail: 'Mosaic graphical browser, ICANN (1998), broadband, mobile & HTTP/3 scale globally.' },
      ],
    },
    {
      diagramKey: 'u1-client-server',
      title: 'Client-Server Architecture',
      category: 'Architecture',
      summary:
        'Demonstrates two-tier request/response communication between a Web Client (Browser) and a Web/Data Server over TCP/IP.',
      steps: [
        { step: 1, label: 'Client Initiates Socket', detail: 'Browser opens a TCP socket to the server IP on port 80 or 443.' },
        { step: 2, label: 'Request Transmission', detail: 'Structured HTTP request method, headers, and resource URI are sent.' },
        { step: 3, label: 'Server Processing', detail: 'Server parses request, queries file storage or database, and builds output.' },
        { step: 4, label: 'Response Delivery', detail: 'Server returns HTTP status code, headers, and HTML/JSON payload.' },
      ],
    },
    {
      diagramKey: 'u1-http-working',
      title: 'HTTP Request and Response',
      category: 'Process',
      summary:
        'Step-by-step TCP 3-way handshake followed by HTTP GET/POST request message, server status response (200 OK), and persistent Keep-Alive handling.',
      steps: [
        { step: 1, label: 'TCP 3-Way Handshake', detail: 'Client and server exchange SYN, SYN-ACK, and ACK segments.' },
        { step: 2, label: 'HTTP Request Message', detail: 'Client sends GET /unit1.html HTTP/1.1 with Host and Accept headers.' },
        { step: 3, label: 'HTTP Response Message', detail: 'Server replies with HTTP/1.1 200 OK, Content-Type, and HTML body.' },
        { step: 4, label: 'Render & Keep-Alive', detail: 'Browser renders content while reusing the open socket cleanly.' },
      ],
    },
    {
      diagramKey: 'u1-email-arch',
      title: 'Email Communication Architecture',
      category: 'Architecture',
      summary:
        'Shows how Mail User Agents (MUA) compose MIME-encoded messages, relay via SMTP Mail Transfer Agents (MTA), store in MDA, and retrieve using POP3 or IMAP.',
      steps: [
        { step: 1, label: 'Compose & MIME Encode', detail: 'Sender MUA encodes UTF-8 text and binary attachments using MIME Base64.' },
        { step: 2, label: 'SMTP Relay (MTA to MTA)', detail: 'Sender mail server delivers mail to recipient MTA using MX record on port 25.' },
        { step: 3, label: 'Mailbox Storage (MDA)', detail: 'Mail Delivery Agent stores incoming mail inside recipient mailbox.' },
        { step: 4, label: 'Retrieval (IMAP / POP3)', detail: 'Recipient MUA syncs folders via IMAP (143/993) or downloads via POP3 (110/995).' },
      ],
    },
    {
      diagramKey: 'u1-dns-resolution',
      title: 'DNS Resolution Process',
      category: 'Flowchart',
      summary:
        'Traces how a hostname query travels from local browser/OS cache to Recursive Resolver, Root (.), TLD (.edu/.com), and Authoritative Nameserver.',
      steps: [
        { step: 1, label: 'Cache Check & Resolver', detail: 'Browser/OS checks local cache; cache miss forwards to ISP Recursive Resolver.' },
        { step: 2, label: 'Root Server Query', detail: 'Root server returns referral to the matching Top-Level Domain (.edu / .com).' },
        { step: 3, label: 'TLD Server Query', detail: 'TLD nameserver directs resolver to the domain Authoritative Nameserver.' },
        { step: 4, label: 'Authoritative IP Answer', detail: 'Authoritative server returns A/AAAA IP record and caches it per TTL.' },
      ],
    },
    {
      diagramKey: 'u1-www-arch',
      title: 'WWW Architecture',
      category: 'Architecture',
      summary:
        'Illustrates the interplay of Web Browsers, DNS, URLs, HTTP/HTTPS transport, Web Servers, and distributed hypertext documents.',
      steps: [
        { step: 1, label: 'URL Entry in Browser', detail: 'User enters URL specifying scheme, hostname, and resource path.' },
        { step: 2, label: 'DNS Name Resolution', detail: 'Browser resolves domain hostname into target Web Server IP address.' },
        { step: 3, label: 'HTTP/HTTPS Request', detail: 'Browser sends stateless HTTP request to the Web Server on port 80/443.' },
        { step: 4, label: 'Hypertext Document Delivery', detail: 'Web Server retrieves linked HTML/media resources and returns rendered response.' },
      ],
    },
    {
      diagramKey: 'u1-browser-server',
      title: 'Web Browser and Web Server Interaction',
      category: 'Process',
      summary:
        'Explains how the browser networking layer communicates with a web server and executes the DOM, CSSOM, JS Engine, and Render Tree pipeline.',
      steps: [
        { step: 1, label: 'URL Parse & HTTP Request', detail: 'Browser extracts protocol, host, port, and sends HTTP request.' },
        { step: 2, label: 'Web Server Handling', detail: 'Web server maps URI to static files or executes backend logic.' },
        { step: 3, label: 'DOM & CSSOM Trees', detail: 'Rendering engine tokenizes HTML/CSS and JS engine executes scripts.' },
        { step: 4, label: 'Layout & Pixel Paint', detail: 'Browser merges Render Tree, computes geometry, and paints pixels.' },
      ],
    },
    {
      diagramKey: 'u1-internet-arch',
      title: 'Internet Layered & Backbone Architecture',
      category: 'Architecture',
      summary:
        'Shows how local LAN networks connect via Regional ISPs, Tier-1 Backbone IXPs, and TCP/IP packet routing to origin data centers.',
      steps: [
        { step: 1, label: 'Access Network (LAN/Wi-Fi)', detail: 'End devices frame IP packets via local switches and routers.' },
        { step: 2, label: 'Regional ISP Aggregation', detail: 'Traffic routes through regional fiber nodes using BGP peering.' },
        { step: 3, label: 'Tier-1 Backbone & IXPs', detail: 'High-capacity optical trunks exchange packets globally.' },
        { step: 4, label: 'Destination Data Center', detail: 'Target server network delivers packets up the TCP/IP stack.' },
      ],
    },
  ],
  topics: [
    {
      orderIndex: 1,
      slug: 'history-of-the-internet',
      title: 'History of the Internet',
      definition:
        'The Internet is a global network of interconnected computer networks using the standardized TCP/IP protocol suite to enable reliable data exchange worldwide.',
      explanation:
        'The Internet began in 1969 as ARPANET, funded by the US Department of Defense (ARPA) to create a fault-tolerant packet-switched network linking four universities (UCLA, SRI, UCSB, University of Utah). In 1971, Ray Tomlinson introduced network email using the "@" symbol. Vint Cerf and Bob Kahn designed TCP/IP in 1974, which ARPANET officially adopted on January 1, 1983 ("Flag Day"). NSFNET expanded academic backbone connectivity in 1986, Tim Berners-Lee proposed the World Wide Web in 1989, Mosaic popularized graphical browsing in 1993, and ICANN formed in 1998 to oversee global domain names.',
      examples: [
        {
          title: 'Major Historical Milestones Timeline',
          description:
            '1969: ARPANET launched | 1971: First Email | 1983: TCP/IP & DNS introduced | 1989: WWW invented | 1993: Mosaic Browser | 1998: ICANN established.',
        },
      ],
      comparisonTable: {
        caption: 'Circuit Switching vs Packet Switching (Internet Foundation)',
        headers: ['Feature', 'Circuit Switching', 'Packet Switching'],
        rows: [
          ['Path Allocation', 'Dedicated physical path reserved for entire call', 'Data split into packets routed dynamically'],
          ['Fault Tolerance', 'Link failure drops the connection', 'Packets automatically reroute around failures'],
          ['Bandwidth Efficiency', 'Low (idle time wastes reserved channel)', 'High (statistical multiplexing shares links)'],
          ['Example Network', 'Traditional PSTN telephone system', 'Modern Internet (TCP/IP)'],
        ],
      },
      keyTakeaways: [
        'Packet switching eliminated central single points of failure in ARPANET.',
        'TCP/IP standardization on Jan 1, 1983 allowed heterogeneous networks to merge.',
        'Commercialization in the 1990s transformed academic networks into the global Internet.',
      ],
      diagramKey: 'u1-history-timeline',
    },
    {
      orderIndex: 2,
      slug: 'world-wide-web',
      title: 'World Wide Web (WWW)',
      definition:
        'The World Wide Web (WWW) is an open information system of interlinked hypertext documents and multimedia resources accessed over the Internet via URLs and HTTP.',
      explanation:
        'Invented in 1989 by Sir Tim Berners-Lee at CERN, the WWW runs as an application-layer service on top of the Internet. Whereas the Internet comprises physical routers, fiber-optic cables, and TCP/IP routing, the Web consists of interconnected web pages, web browsers, and web servers linked via hyperlinks. The WWW relies on three core standards: URLs (to locate resources uniquely), HTTP/HTTPS (to transfer requests and responses), and HTML (to structure hypertext documents).',
      examples: [
        {
          title: 'Anatomy of a Uniform Resource Locator (URL)',
          description: 'Every resource on the Web is addressed using its scheme, host, port, path, query, and fragment.',
          code: 'https://www.examtips.edu:443/courses/web-tech?unit=1#dns',
          language: 'text',
        },
      ],
      comparisonTable: {
        caption: 'Internet vs World Wide Web (WWW)',
        headers: ['Parameter', 'Internet', 'World Wide Web (WWW)'],
        rows: [
          ['Nature', 'Global hardware & network infrastructure', 'Software information space over the Internet'],
          ['Core Protocols', 'TCP/IP, UDP, ICMP, BGP', 'HTTP, HTTPS'],
          ['Addressing', 'IPv4 / IPv6 numeric addresses', 'URLs / URIs'],
          ['Scope', 'Hosts Web, Email (SMTP), FTP, VoIP, Gaming', 'Subset of Internet focused on hypertext & web apps'],
        ],
      },
      keyTakeaways: [
        'The Internet is the physical/logical transport highway; WWW is a major service traveling on it.',
        'Three foundational pillars of WWW: URL, HTTP, and HTML.',
        'Hyperlinks connect distributed resources non-linearly across the globe.',
      ],
      diagramKey: 'u1-www-arch',
    },
    {
      orderIndex: 3,
      slug: 'html-overview',
      title: 'HTML (HyperText Markup Language)',
      definition:
        'HTML is the standard declarative markup language used to structure web documents through semantic tags, attributes, and hypertext links.',
      explanation:
        'HTML tells web browsers what each piece of content means—headings (<h1>–<h6>), paragraphs (<p>), lists (<ul>/<ol>), tables (<table>), forms (<form>), images (<img>), and hyperlinks (<a>)—rather than specifying procedural algorithms. Modern HTML5 introduces semantic landmarks (<header>, <nav>, <main>, <article>, <section>, <footer>) that improve accessibility for assistive screen readers and Search Engine Optimization (SEO). Every modern HTML5 file opens with <!DOCTYPE html> to enable standards-compliant layout mode.',
      examples: [
        {
          title: 'Semantic HTML5 Document Template',
          description: 'Clean HTML5 skeleton with metadata, semantic landmarks, and hyperlink.',
          code: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Unit 1: Web Technology</title>
  </head>
  <body>
    <header><h1>Introduction to WWW</h1></header>
    <main>
      <article>
        <p>HTML builds the semantic Document Object Model (DOM).</p>
        <a href="https://www.w3.org">Explore W3C Standards</a>
      </article>
    </main>
  </body>
</html>`,
          language: 'html',
        },
      ],
      keyTakeaways: [
        'HTML tags define document structure and semantics; CSS styles presentation; JS adds behavior.',
        'Attributes such as href, src, alt, and lang enrich elements with metadata and links.',
        'Semantic HTML5 tags aid accessibility tools and web crawlers.',
      ],
      diagramKey: 'u1-browser-server',
    },
    {
      orderIndex: 4,
      slug: 'http-and-smtp',
      title: 'HTTP and SMTP',
      definition:
        'HTTP (HyperText Transfer Protocol) transfers web resources via stateless request-response cycles, while SMTP (Simple Mail Transfer Protocol) pushes outgoing email between mail servers.',
      explanation:
        'HTTP runs over TCP (default port 80; HTTPS wraps HTTP inside TLS on port 443). Clients submit methods (GET, POST, PUT, DELETE) and headers, and servers return 3-digit status codes (200 OK, 301 Moved, 404 Not Found, 500 Server Error). Because HTTP is stateless, servers do not remember prior requests natively unless cookies or tokens are attached. Conversely, SMTP (TCP ports 25 for server-to-server relay, 587 for authenticated client submission) is a stateful push protocol using commands like EHLO, MAIL FROM, RCPT TO, and DATA to send email to the recipient’s Mail Transfer Agent (MTA).',
      examples: [
        {
          title: 'HTTP/1.1 Request & SMTP Relay Exchange',
          description: 'Comparison of wire-level commands in HTTP vs SMTP.',
          code: `// HTTP/1.1 Pull Request
GET /notes/unit1.html HTTP/1.1
Host: examtips.edu
Accept: text/html

// SMTP Push Session
220 mail.examtips.edu ESMTP Ready
EHLO client.college.edu
MAIL FROM:<student@college.edu>
RCPT TO:<faculty@examtips.edu>
DATA`,
          language: 'http',
        },
      ],
      comparisonTable: {
        caption: 'HTTP vs SMTP Protocol Comparison',
        headers: ['Feature', 'HTTP', 'SMTP'],
        rows: [
          ['Primary Role', 'Web pages, media & REST API transfer', 'Outgoing email submission & MTA relay'],
          ['Delivery Model', 'Pull protocol (client requests data)', 'Push protocol (sender pushes mail to server)'],
          ['Default Ports', '80 (HTTP), 443 (HTTPS)', '25 (Relay), 587 / 465 (Submission)'],
          ['Statefulness', 'Stateless (sessions via Cookies/JWT)', 'Stateful multi-step command session'],
        ],
      },
      keyTakeaways: [
        'HTTP is stateless and pull-oriented; HTTPS adds TLS encryption and identity verification.',
        'SMTP only handles sending/relaying email—it never pulls mail into a user inbox.',
        'Common HTTP status groups: 2xx Success, 3xx Redirect, 4xx Client Error, 5xx Server Error.',
      ],
      diagramKey: 'u1-http-working',
    },
    {
      orderIndex: 5,
      slug: 'pop3-mime-and-imap',
      title: 'POP3, MIME and IMAP',
      definition:
        'POP3 and IMAP are email retrieval protocols used by mail clients to read inbox messages, while MIME extends SMTP to carry multimedia attachments and non-ASCII text.',
      explanation:
        'Early SMTP only supported 7-bit US-ASCII plain text. MIME (Multipurpose Internet Mail Extensions) introduced standardized headers (MIME-Version, Content-Type, Content-Transfer-Encoding such as Base64) so emails can safely carry UTF-8 text, HTML formatting, images, audio, and PDF files. When retrieving email from the Mail Delivery Agent (MDA), POP3 (Post Office Protocol Version 3, port 110 / 995 SSL) downloads messages to a single device and typically deletes them from the server. IMAP (Internet Message Access Protocol, port 143 / 993 SSL) keeps emails and folders stored centrally on the server, enabling real-time synchronization across laptops, phones, and webmail.',
      examples: [
        {
          title: 'MIME Multipart Header Structure',
          description: 'How MIME embeds both plain text and a Base64 PDF attachment inside one SMTP email.',
          code: `MIME-Version: 1.0
Content-Type: multipart/mixed; boundary="PART_01"

--PART_01
Content-Type: text/plain; charset="UTF-8"

Attached are Unit 1 Web Technology notes.
--PART_01
Content-Type: application/pdf; name="unit1-notes.pdf"
Content-Transfer-Encoding: base64`,
          language: 'text',
        },
      ],
      comparisonTable: {
        caption: 'POP3 vs IMAP Email Retrieval Comparison',
        headers: ['Parameter', 'POP3', 'IMAP'],
        rows: [
          ['Default Port', '110 (Plain), 995 (SSL/TLS)', '143 (Plain), 993 (SSL/TLS)'],
          ['Message Storage', 'Downloaded locally & removed from server', 'Stored centrally on the mail server'],
          ['Multi-Device Sync', 'Not synchronized across devices', 'Full sync of read status & folders everywhere'],
          ['Bandwidth Efficiency', 'Downloads entire mail + attachments upfront', 'Fetches headers first; downloads attachments on demand'],
        ],
      },
      keyTakeaways: [
        'MIME is a data-formatting extension for SMTP—not a transport protocol itself.',
        'IMAP is preferred for multi-device access; POP3 suits single-computer offline archival.',
      ],
      diagramKey: 'u1-email-arch',
    },
    {
      orderIndex: 6,
      slug: 'domain-name-server-dns',
      title: 'Domain Name Server (DNS)',
      definition:
        'DNS is a hierarchical, globally distributed naming database that translates human-readable domain names (like www.examtips.edu) into machine-routable IP addresses.',
      explanation:
        'Because IPv4 (e.g., 142.250.190.78) and 128-bit IPv6 addresses are difficult for humans to memorize, DNS provides an inverted tree directory: Root Zone (.) -> Top-Level Domains (.com, .org, .edu, .in) -> Authoritative Second-Level Domains -> Subdomains. During resolution, the browser and OS first check local caches. On a cache miss, a query travels to the Recursive Resolver (UDP port 53), which iteratively queries the Root Nameserver, TLD Nameserver, and Authoritative Nameserver to obtain the A (IPv4) or AAAA (IPv6) record and caches it for its Time-To-Live (TTL).',
      examples: [
        {
          title: 'Essential DNS Resource Record Types',
          description: 'Core DNS record mappings frequently asked in university exams.',
          code: `A     -> Maps domain hostname to 32-bit IPv4 address
AAAA  -> Maps domain hostname to 128-bit IPv6 address
CNAME -> Canonical alias pointing one domain name to another
MX    -> Mail Exchange server for routing SMTP email
NS    -> Authoritative Nameserver responsible for the DNS zone`,
          language: 'text',
        },
      ],
      keyTakeaways: [
        'DNS uses UDP port 53 for fast queries and TCP port 53 for large responses or zone transfers.',
        'TTL caching reduces latency and shields Root/TLD servers from repeated lookups.',
      ],
      diagramKey: 'u1-dns-resolution',
    },
    {
      orderIndex: 7,
      slug: 'web-browsers',
      title: 'Web Browsers',
      definition:
        'A web browser is client-side software that requests web resources over HTTP/HTTPS, parses HTML/CSS/JavaScript, and renders interactive web pages to the user.',
      explanation:
        'Modern browsers (Chrome, Firefox, Safari, Edge) coordinate multiple internal components: User Interface (address bar, tabs), Browser Engine (links UI to rendering), Rendering Engine (Blink, Gecko, WebKit—builds DOM and CSSOM trees, computes layout, and paints pixels), Networking Layer (DNS, TLS, HTTP), JavaScript Engine (V8, SpiderMonkey), and Data Storage (Cookies, localStorage, IndexedDB).',
      examples: [
        {
          title: 'Critical Rendering Path Stages',
          description: 'HTML Bytes -> DOM Tree + CSSOM Tree -> Render Tree -> Layout Geometry -> Paint -> Composite.',
        },
      ],
      keyTakeaways: [
        'Rendering Engine combines DOM (HTML) and CSSOM (CSS) into the Render Tree.',
        'Per-tab process sandboxing isolates untrusted scripts from the operating system.',
      ],
      diagramKey: 'u1-browser-server',
    },
    {
      orderIndex: 8,
      slug: 'web-servers',
      title: 'Web Servers',
      definition:
        'A web server is hardware and/or server software (such as Apache HTTP Server, Nginx, or Microsoft IIS) that accepts HTTP/HTTPS requests and delivers static files or dynamic application responses.',
      explanation:
        'Web servers listen on TCP ports 80 and 443, resolve virtual hostnames, enforce HTTPS/TLS certificates, serve static assets (HTML, CSS, images) directly from disk, or proxy dynamic routes to backend runtimes (Node.js, Java Servlets, Python, PHP). Enterprise servers like Nginx also provide reverse proxying, gzip/Brotli compression, caching, rate limiting, and load balancing.',
      examples: [
        {
          title: 'Nginx Static & Reverse Proxy Block',
          description: 'Serving static frontend files while proxying /api calls to a backend service.',
          code: `server {
  listen 443 ssl;
  server_name examtips.edu;
  root /var/www/examtips/dist;

  location /api/ {
    proxy_pass http://127.0.0.1:3000;
  }
}`,
          language: 'nginx',
        },
      ],
      comparisonTable: {
        caption: 'Web Browser vs Web Server',
        headers: ['Aspect', 'Web Browser (Client)', 'Web Server'],
        rows: [
          ['Primary Role', 'Requests, parses & renders web content', 'Stores, processes & delivers web content'],
          ['Initiation', 'Initiates HTTP/HTTPS requests', 'Passively listens on Ports 80/443 & responds'],
          ['Key Subsystems', 'Rendering Engine (Blink), JS Engine (V8)', 'Virtual Hosts, TLS Terminator, Reverse Proxy'],
          ['Examples', 'Chrome, Mozilla Firefox, Safari, Edge', 'Apache HTTP Server, Nginx, Microsoft IIS'],
        ],
      },
      keyTakeaways: [
        'Virtual hosting allows a single web server to serve multiple independent domains.',
        'Static web servers serve files directly; dynamic servers delegate business logic to app runtimes.',
      ],
      diagramKey: 'u1-client-server',
    },
  ],
  questions: [
    // =========================================================================
    // SECTION A – 2 MARKS QUESTIONS (ALL 12 QUESTIONS)
    // =========================================================================
    {
      section: 'A',
      marks: 2,
      questionText: 'What is the Internet?',
      practiceBadge: 'Exam Preparation Recommendation',
      introduction:
        'The Internet is the world’s largest global system of interconnected computer networks.',
      mainExplanation:
        'It connects millions of private, public, academic, business, and government networks using the standardized TCP/IP (Transmission Control Protocol / Internet Protocol) suite. Each connected device receives an IP address and exchanges data using packet switching.',
      examples:
        'Sending an email via Gmail, attending a video lecture, or browsing https://www.w3.org over fiber or mobile broadband.',
      advantages: [
        'Enables instant global communication, remote learning, and distributed cloud services.',
      ],
      disadvantages: [
        'Exposes endpoints to cybersecurity threats if traffic is unencrypted or unauthenticated.',
      ],
      conclusion:
        'In short, the Internet is the underlying global hardware and protocol infrastructure that makes online services possible.',
      keywords: ['Global Network', 'TCP/IP', 'Packet Switching', 'IP Address', 'ARPANET'],
      hinglishIntro:
        'Internet duniya bhar ke karodo computers aur networks ka ek global jaal (network of networks) hai.',
      hinglishExplanation:
        'Yeh sabhi computers aur mobile devices ko TCP/IP rules ke through aapas mein connect karta hai. Data chhote-chhote packets mein toot kar routers ke raste sahi device tak pahunchta hai. Har device ka ek unique IP address hota hai.',
      hinglishExample:
        'Jaise desh ke har shehar ko highways jodte hain, waise hi Internet digital highway hai jiske upar WhatsApp, YouTube, email aur websites chalti hain.',
      hinglishConclusion:
        'Simple words mein: Internet wo basic network infrastructure hai jo poori duniya ke devices ko data exchange karne ke liye connect karta hai.',
    },
    {
      section: 'A',
      marks: 2,
      questionText: 'What is World Wide Web (WWW)?',
      practiceBadge: 'Exam Preparation Recommendation',
      introduction:
        'The World Wide Web (WWW), invented by Tim Berners-Lee in 1989 at CERN, is a global information space of interlinked hypertext documents.',
      mainExplanation:
        'WWW operates as an application-layer service over the Internet. It allows users to access web pages containing text, images, video, and hyperlinks using Web Browsers, addressed via URLs and transferred via HTTP/HTTPS.',
      examples:
        'Opening https://examtips.edu/unit-1 in a browser and clicking hyperlinks to jump between notes and diagrams.',
      advantages: [
        'Universal cross-platform publishing and hypertext navigation across global servers.',
      ],
      disadvantages: [
        'Requires reliable Internet connectivity and proper link maintenance to avoid 404 broken links.',
      ],
      conclusion:
        'Thus, the WWW is the collection of interconnected web pages and applications running on top of the Internet.',
      keywords: ['Tim Berners-Lee', 'CERN', 'Hypertext', 'URL', 'HTTP', 'HTML'],
      hinglishIntro:
        'World Wide Web (WWW) websites aur interlinked web pages ka ek global collection hai jo Internet ke upar chalta hai.',
      hinglishExplanation:
        '1989 mein Tim Berners-Lee ne isko banaya tha. WWW teen main cheezon par tikta hai: URL (page ka address), HTTP (data lane ka protocol), aur HTML (page banane ki language). Browser ke through hum ek page se dusre page par links click karke ja sakte hain.',
      hinglishExample:
        'Agar Internet ek sadak (highway) hai, toh WWW us sadak par bani dukaanein aur websites (jaise Wikipedia, Amazon, Exam Tips) hain.',
      hinglishConclusion:
        'Yaad rakhein: WWW Internet ka ek service hai jahan hyperlinks se jude web documents milte hain.',
    },
    {
      section: 'A',
      marks: 2,
      questionText: 'Define HTML.',
      practiceBadge: 'Exam Preparation Recommendation',
      introduction:
        'HTML stands for HyperText Markup Language, the foundational language used to create and structure web pages.',
      mainExplanation:
        'HTML uses angular-bracket tags (such as <h1>, <p>, <table>, <img>, and <a>) to define the logical structure and semantics of text, media, forms, and hyperlinks inside a document rendered by a web browser.',
      examples:
        '<h1>Unit 1 Notes</h1><p>Read the <a href="/dns">DNS Guide</a>.</p>',
      advantages: [
        'Platform-independent, human-readable, and natively supported by every web browser.',
      ],
      disadvantages: [
        'Static by itself—requires CSS for styling and JavaScript for dynamic behavior.',
      ],
      conclusion:
        'HTML forms the structural skeleton of every website on the World Wide Web.',
      keywords: ['HyperText Markup Language', 'Tags', 'Semantic Elements', 'Hyperlinks', 'DOM'],
      hinglishIntro:
        'HTML ka full form HyperText Markup Language hai. Yeh kisi bhi webpage ka basic structure (dhancha) banane ki standard language hai.',
      hinglishExplanation:
        'Isme predefined tags hote hain jaise headings ke liye <h1>, paragraph ke liye <p>, link ke liye <a>, aur image ke liye <img>. Browser inhi tags ko padh kar screen par text, images aur links dikhata hai.',
      hinglishExample:
        'Jaise ghar banate waqt eent aur pillars se skeleton banta hai, waise hi website mein HTML structure banata hai (design CSS se aur interactivity JavaScript se aati hai).',
      hinglishConclusion:
        'Exam point: HTML ek markup language hai (programming language nahi) jo tags ke zariye webpage structure karti hai.',
    },
    {
      section: 'A',
      marks: 2,
      questionText: 'What is HTTP?',
      practiceBadge: 'Exam Preparation Recommendation',
      introduction:
        'HTTP stands for HyperText Transfer Protocol, the primary application-layer protocol of the World Wide Web.',
      mainExplanation:
        'HTTP defines how clients (web browsers) format requests (GET, POST, PUT, DELETE) and how web servers return status codes (e.g., 200 OK, 404 Not Found) and payloads over TCP port 80 (or port 443 with TLS encryption as HTTPS). It is a stateless protocol.',
      examples:
        'When a user clicks a link, the browser sends "GET /index.html HTTP/1.1" and receives the HTML page.',
      advantages: [
        'Stateless design makes web servers lightweight and horizontally scalable.',
      ],
      disadvantages: [
        'Unencrypted HTTP sends plain text; HTTPS (TLS) is required for security.',
      ],
      conclusion:
        'HTTP acts as the universal communication rulebook between web clients and web servers.',
      keywords: ['HyperText Transfer Protocol', 'Stateless', 'Client-Server', 'Port 80', 'HTTPS'],
      hinglishIntro:
        'HTTP (HyperText Transfer Protocol) wo protocol hai jo browser aur web server ke beech webpage aur data transfer karne ka kaam karta hai.',
      hinglishExplanation:
        'Yeh Request-Response model par kaam karta hai. Browser server ko request bhejta hai (jaise GET /notes) aur server response deta hai (jaise 200 OK + HTML page). HTTP stateless hota hai, matlab server purani request yaad nahi rakhta (isiliye login yaad rakhne ke liye cookies use hoti hain).',
      hinglishExample:
        'Jaise restaurant mein waiter aapka order kitchen tak le jata hai aur khana wapas laata hai, waise hi HTTP browser ka order server tak le jata hai.',
      hinglishConclusion:
        'HTTP port 80 par aur secure HTTPS (encryption ke saath) port 443 par chalta hai.',
    },
    {
      section: 'A',
      marks: 2,
      questionText: 'What is SMTP?',
      practiceBadge: 'Exam Preparation Recommendation',
      introduction:
        'SMTP stands for Simple Mail Transfer Protocol, the Internet standard protocol for sending and relaying electronic mail.',
      mainExplanation:
        'SMTP is a text-based, push-oriented application protocol operating over TCP (port 25 for server-to-server relay, port 587 for client mail submission). It uses commands such as HELO/EHLO, MAIL FROM, RCPT TO, and DATA to push messages from a sender to the recipient’s Mail Transfer Agent (MTA).',
      examples:
        'When you click "Send" in an email app, SMTP relays the message from your mail server to the recipient’s mail server.',
      advantages: [
        'Reliable, universally supported delivery mechanism across different email providers.',
      ],
      disadvantages: [
        'Only sends/pushes mail; cannot retrieve emails into an inbox and natively supports only 7-bit ASCII without MIME.',
      ],
      conclusion:
        'SMTP serves as the backbone outgoing mail delivery protocol on the Internet.',
      keywords: ['Simple Mail Transfer Protocol', 'Push Protocol', 'MTA', 'Port 25', 'Port 587'],
      hinglishIntro:
        'SMTP (Simple Mail Transfer Protocol) ek Internet protocol hai jiska use email bhejne (send aur forward karne) ke liye kiya jata hai.',
      hinglishExplanation:
        'Yeh ek Push protocol hai—matlab sender ka mail server recipient ke mail server ko email push karta hai. SMTP TCP port 25 (server relay) aur port 587 (client submission) par chalta hai. Dhyan dein: SMTP sirf email bhejta hai, inbox se download nahi karta.',
      hinglishExample:
        'Jaise postman aapki chithi post-office se dusre shehar ke post-office tak pahunchata hai, wahi kaam SMTP servers ke beech karta hai.',
      hinglishConclusion:
        'Yaad rakhein: SMTP = Sending Mail Transfer Protocol (Port 25/587).',
    },
    {
      section: 'A',
      marks: 2,
      questionText: 'What is POP3?',
      practiceBadge: 'Exam Preparation Recommendation',
      introduction:
        'POP3 stands for Post Office Protocol Version 3, a standard protocol used by email clients to retrieve emails from a remote mail server.',
      mainExplanation:
        'Operating over TCP port 110 (or port 995 with SSL/TLS), POP3 follows a download-and-delete model: the client connects, downloads all inbox messages to local storage, and typically removes them from the server.',
      examples:
        'Configuring Outlook on an office desktop with POP3 to download emails for offline reading.',
      advantages: [
        'Saves server mailbox quota and enables full offline access to downloaded mail.',
      ],
      disadvantages: [
        'Does not synchronize folders or read/unread status across multiple devices.',
      ],
      conclusion:
        'POP3 is lightweight and suited for single-device offline email workflows.',
      keywords: ['Post Office Protocol v3', 'Pull Protocol', 'Port 110', 'Download-and-Delete', 'Offline'],
      hinglishIntro:
        'POP3 (Post Office Protocol Version 3) ek email receive (download) karne wala protocol hai.',
      hinglishExplanation:
        'Jab aap POP3 use karte hain, toh aapka device mail server se connect hokar saare emails local computer/phone mein download kar leta hai aur normally server se unhe delete kar deta hai. Yeh TCP port 110 (ya secure port 995) par kaam karta hai.',
      hinglishExample:
        'Jaise ghar ke letterbox se saari chithiyan nikal kar apne drawer mein rakh lena—ab wo chithiyan sirf aapke paas hain, letterbox khali ho gaya.',
      hinglishConclusion:
        'POP3 single device aur offline padhne ke liye achha hai, par multiple devices par sync nahi karta.',
    },
    {
      section: 'A',
      marks: 2,
      questionText: 'Define MIME.',
      practiceBadge: 'Exam Preparation Recommendation',
      introduction:
        'MIME stands for Multipurpose Internet Mail Extensions, an Internet standard that expands the format of email messages.',
      mainExplanation:
        'Because basic SMTP only supports 7-bit US-ASCII plain text, MIME adds headers (MIME-Version, Content-Type, Content-Transfer-Encoding) and encodings such as Base64 to transmit non-ASCII character sets (UTF-8), HTML formatting, images, audio, video, and binary attachments.',
      examples:
        'Attaching a PDF file in an email using Content-Type: application/pdf encoded in Base64.',
      advantages: [
        'Enables rich multimedia and international language support over standard email and HTTP.',
      ],
      disadvantages: [
        'Base64 encoding increases attachment payload size by approximately 33%.',
      ],
      conclusion:
        'MIME bridges plain-text SMTP servers with modern multimedia email communication.',
      keywords: ['Multipurpose Internet Mail Extensions', 'Base64', 'Content-Type', '7-bit ASCII', 'Attachments'],
      hinglishIntro:
        'MIME ka full form Multipurpose Internet Mail Extensions hai. Yeh ek formatting standard hai jo normal text-only email mein files aur multimedia bhejna possible banata hai.',
      hinglishExplanation:
        'Original SMTP sirf simple English text (7-bit ASCII) samajhta tha. MIME email headers mein Content-Type aur Base64 encoding add karta hai jisse hum PDFs, photos, audio, video aur Hindi/Unicode text email mein attach karke bhej sakte hain.',
      hinglishExample:
        'Jab aap Gmail par koi resume PDF ya photo attach karke bhejte hain, toh background mein MIME us file ko Base64 text mein badal kar SMTP ke through bhejta hai.',
      hinglishConclusion:
        'MIME koi alag delivery protocol nahi hai—yeh SMTP ko multimedia support dene wala extension hai.',
    },
    {
      section: 'A',
      marks: 2,
      questionText: 'What is IMAP?',
      practiceBadge: 'Exam Preparation Recommendation',
      introduction:
        'IMAP stands for Internet Message Access Protocol, a modern protocol for retrieving and managing emails directly on a remote mail server.',
      mainExplanation:
        'Operating on TCP port 143 (or port 993 with SSL/TLS), IMAP keeps all messages, folder hierarchies, and read/starred states stored on the server, allowing seamless real-time synchronization across multiple devices.',
      examples:
        'Reading an email on a smartphone automatically marks it as read on your laptop and webmail.',
      advantages: [
        'Real-time multi-device sync, server-side search, and header-first fetching to save bandwidth.',
      ],
      disadvantages: [
        'Consumes server mailbox storage quota and requires Internet access for uncached messages.',
      ],
      conclusion:
        'IMAP is the preferred retrieval protocol for cloud-synchronized multi-device email access.',
      keywords: ['Internet Message Access Protocol', 'Port 143', 'Multi-Device Sync', 'Server Storage'],
      hinglishIntro:
        'IMAP (Internet Message Access Protocol) ek modern email retrieval protocol hai jo saare emails aur folders ko mail server par hi store aur sync rakhta hai.',
      hinglishExplanation:
        'POP3 ki tarah emails delete karne ke bajaye IMAP emails ko server par safe rakhta hai. Aap phone, laptop ya tablet kahin se bhi inbox kholein, har jagah same folders aur read/unread status dikhta hai. Yeh TCP port 143 (ya secure 993) use karta hai.',
      hinglishExample:
        'Jaise Google Drive ya Gmail app—agar aapne phone par ek mail padh kar Star mark kiya, toh laptop par bhi turant starred dikhega.',
      hinglishConclusion:
        'Aaj ke multi-device time mein IMAP sabse zyada use hone wala inbox access protocol hai.',
    },
    {
      section: 'A',
      marks: 2,
      questionText: 'What is DNS?',
      practiceBadge: 'Exam Preparation Recommendation',
      introduction:
        'DNS stands for Domain Name System (often called the Domain Name Server), the distributed naming directory of the Internet.',
      mainExplanation:
        'DNS translates human-friendly domain names (such as www.university.edu) into numeric IPv4 or IPv6 addresses (such as 142.250.190.78) required by network routers, primarily using UDP port 53 across hierarchical Root, TLD, and Authoritative nameservers.',
      examples:
        'Typing www.examtips.edu prompts DNS to resolve the domain to its origin server IP.',
      advantages: [
        'Eliminates the need to memorize IP addresses and allows server IPs to change transparently.',
      ],
      disadvantages: [
        'Vulnerable to DNS spoofing/cache poisoning if security extensions (DNSSEC) are not enabled.',
      ],
      conclusion:
        'DNS serves as the automated phonebook that makes web navigation effortless.',
      keywords: ['Domain Name System', 'IP Address', 'UDP Port 53', 'Nameserver', 'A Record'],
      hinglishIntro:
        'DNS ka full form Domain Name System hai. Isko aap Internet ki phonebook samajh sakte hain.',
      hinglishExplanation:
        'Humans ke liye 142.250.190.78 jaise IP numbers yaad rakhna mushkil hota hai, par computers sirf IP samajhte hain. DNS domain name (jaise google.com) ko automatic uske sahi IP address mein translate karta hai taaki browser sahi server se connect ho sake.',
      hinglishExample:
        'Jaise mobile contacts mein hum friend ka naam save karte hain aur phone number dial ho jata hai, wahi kaam DNS domain naam ke liye karta hai.',
      hinglishConclusion:
        'DNS UDP port 53 par kaam karta hai aur hierarchical servers (Root, TLD, Authoritative) use karta hai.',
    },
    {
      section: 'A',
      marks: 2,
      questionText: 'What is a Web Browser?',
      practiceBadge: 'Exam Preparation Recommendation',
      introduction:
        'A Web Browser is a client-side software application used to locate, retrieve, and display content on the World Wide Web.',
      mainExplanation:
        'It communicates with web servers using HTTP/HTTPS, parses HTML into the DOM and CSS into the CSSOM, executes JavaScript via a JS engine (e.g., V8), and renders interactive pages on screen.',
      examples:
        'Google Chrome, Mozilla Firefox, Apple Safari, and Microsoft Edge.',
      advantages: [
        'Provides a unified, sandboxed graphical interface to access websites globally.',
      ],
      disadvantages: [
        'Cross-browser engine differences can cause subtle layout variations if standards are ignored.',
      ],
      conclusion:
        'A web browser serves as the user’s primary gateway to the World Wide Web.',
      keywords: ['Client Application', 'Rendering Engine', 'DOM', 'CSSOM', 'JS Engine'],
      hinglishIntro:
        'Web Browser ek client software application hai jiski madad se user Internet par websites khol aur dekh sakta hai.',
      hinglishExplanation:
        'Jab aap address bar mein koi URL dalte hain, browser server se HTML, CSS aur JavaScript files mangwata hai, unko parse karke visual webpage mein render karta hai. Iske andar Networking Layer, Rendering Engine aur JavaScript Engine jaise parts hote hain.',
      hinglishExample:
        'Google Chrome, Mozilla Firefox, Apple Safari aur Microsoft Edge sabse popular web browsers hain.',
      hinglishConclusion:
        'Simple line: Web browser user aur World Wide Web ke beech ek graphical bridge hai.',
    },
    {
      section: 'A',
      marks: 2,
      questionText: 'What is a Web Server?',
      practiceBadge: 'Exam Preparation Recommendation',
      introduction:
        'A Web Server is computer hardware and/or software that stores website files and delivers them to clients over HTTP/HTTPS.',
      mainExplanation:
        'Running continuously on ports 80 and 443, a web server receives incoming HTTP requests from browsers, locates static HTML/media files or executes server-side scripts, and returns formatted HTTP responses.',
      examples:
        'Apache HTTP Server, Nginx, Microsoft IIS, and Express/Node.js servers.',
      advantages: [
        'Handles thousands of concurrent requests reliably with TLS security, caching, and virtual hosting.',
      ],
      disadvantages: [
        'Misconfigured servers or unpatched modules can become targets for DDoS or unauthorized access.',
      ],
      conclusion:
        'The web server acts as the origin provider powering all hosted websites and APIs.',
      keywords: ['HTTP Server', 'Port 80/443', 'Apache', 'Nginx', 'Static & Dynamic Content'],
      hinglishIntro:
        'Web Server ek aisa computer system ya software hai jahan websites ki files store hoti hain aur jo browser ki request par unhe serve karta hai.',
      hinglishExplanation:
        'Web server 24x7 port 80 (HTTP) aur 443 (HTTPS) par wait karta rehta hai. Jaise hi browser request bhejta hai, server static files (HTML, CSS, images) bhejta hai ya backend code chalakar dynamic result wapas bhejta hai.',
      hinglishExample:
        'Apache HTTP Server, Nginx, aur Microsoft IIS duniya ke sabse mashhoor web servers hain.',
      hinglishConclusion:
        'Browser request bhejta hai (Client), aur Web Server uska response deliver karta hai.',
    },
    {
      section: 'A',
      marks: 2,
      questionText: 'Differentiate between Internet and WWW.',
      practiceBadge: 'Exam Preparation Recommendation',
      introduction:
        'Although frequently used synonymously, the Internet and the World Wide Web (WWW) occupy distinct architectural layers.',
      mainExplanation:
        '1) Infrastructure vs Service: The Internet is the global physical network of interconnected routers, cables, and TCP/IP devices; the WWW is an information service of interlinked hypertext documents running over the Internet. 2) Protocols: The Internet relies on TCP/IP, whereas the WWW relies primarily on HTTP/HTTPS, HTML, and URLs. 3) Scope: Email (SMTP), FTP, and VoIP run on the Internet independently of the WWW.',
      examples:
        'Sending an email via SMTP uses the Internet without the WWW, whereas visiting https://wikipedia.org uses both.',
      advantages: [
        'Clean architectural layering lets new services run on the Internet without changing hardware.',
      ],
      disadvantages: [
        'Confusing the two terms often leads to misunderstandings about non-web protocols.',
      ],
      conclusion:
        'In summary, the Internet is the network infrastructure ("highway"), while the WWW is one major hypermedia service ("traffic") operating on it.',
      keywords: ['Network vs Service', 'TCP/IP vs HTTP', 'Hardware vs Software', 'Tim Berners-Lee'],
      hinglishIntro:
        'Aam log Internet aur WWW ko ek hi samajhte hain, lekin technical roop se dono bilkul alag layers hain.',
      hinglishExplanation:
        '1) Internet ek physical aur logical network infrastructure hai jo TCP/IP par chalta hai. WWW ek software/information space hai jo Internet ke upar chalta hai. 2) Internet Email (SMTP), FTP, Gaming aur WWW sabko chalata hai; WWW sirf websites aur hypertext pages (HTTP/HTML/URL) tak seemit hai. 3) Internet 1969 (ARPANET) se shuru hua, jabki WWW 1989 mein Tim Berners-Lee ne banaya.',
      hinglishExample:
        'Internet ko ek Railway Track samjhein aur WWW ko us track par chalne wali ek Train—track par dusri trains (Email, FTP, Video Calls) bhi chalti hain.',
      hinglishConclusion:
        'Internet infrastructure hai (superset) aur World Wide Web uska ek subset/application hai.',
    },

    // =========================================================================
    // SECTION B – 5 MARKS QUESTIONS (ALL 5 QUESTIONS)
    // =========================================================================
    {
      section: 'B',
      marks: 5,
      questionText: 'Explain the History of the Internet.',
      practiceBadge: 'Exam Preparation Recommendation',
      introduction:
        'The History of the Internet traces the transformation of a small Cold War defense research project in 1969 into today’s worldwide digital communication backbone.',
      mainExplanation:
        '1) ARPANET & Packet Switching (1969): Funded by the US Department of Defense ARPA, ARPANET linked four universities (UCLA, SRI, UCSB, Utah) using packet switching instead of vulnerable circuit-switched telephone lines.\n2) Email & Protocol Foundations (1971–1974): Ray Tomlinson created networked email with the "@" notation in 1971; Vint Cerf and Bob Kahn published the TCP design in 1974 to enable internetworking.\n3) TCP/IP & DNS Standardization (1983): On January 1, 1983 ("Flag Day"), ARPANET mandated TCP/IP, and Paul Mockapetris introduced DNS to replace host tables.\n4) NSFNET & World Wide Web (1986–1993): NSFNET linked US supercomputing centers, Sir Tim Berners-Lee invented the WWW (HTTP, HTML, URLs) at CERN in 1989, and NCSA Mosaic (1993) popularized graphical web browsing.\n5) Commercialization & Modern Web (1995–Present): Commercial ISPs replaced NSFNET, ICANN formed in 1998 for DNS governance, and broadband, mobile, cloud computing, and HTTP/3 scaled connectivity globally.',
      examples:
        'First ARPANET message "LO" (intended "LOGIN") sent between UCLA and SRI on October 29, 1969.',
      advantages: [
        'Decentralized packet routing ensured resilience even if individual links failed',
        'Open protocol standards (TCP/IP) fostered rapid worldwide innovation',
      ],
      disadvantages: [
        'Early protocols lacked built-in encryption, requiring later additions like TLS/HTTPS and DNSSEC',
      ],
      diagramKey: 'u1-history-timeline',
      conclusion:
        'Through packet switching, TCP/IP standardization, and open Web standards, the Internet evolved into humanity’s most essential communication medium.',
      keywords: ['ARPANET 1969', 'Packet Switching', 'TCP/IP 1983', 'NSFNET', 'WWW 1989', 'Mosaic', 'ICANN'],
      hinglishIntro:
        'Internet ki shuruaat 1969 mein ek US defense research network se hui thi jo dheere-dheere duniya ke sabse bade global network mein badal gaya.',
      hinglishExplanation:
        'Step 1 (1969 ARPANET): US Defense ke ARPA department ne 4 universities ko joda aur Packet Switching technology use ki taaki ek line tootne par bhi data dusre raste se pahunch sake.\nStep 2 (1971–74 Email & TCP): Ray Tomlinson ne "@" wala email banaya, aur Vint Cerf & Bob Kahn ne TCP/IP ka concept diya.\nStep 3 (1983 TCP/IP Flag Day & DNS): Sabhi networks ne TCP/IP apnaya aur IP yaad rakhne ki jagah DNS shuru hua.\nStep 4 (1989 WWW & 1993 Mosaic): Tim Berners-Lee ne CERN mein WWW (HTTP, HTML, URL) banaya aur Mosaic browser ne images ke saath web chalana aasan kar diya.\nStep 5 (1995+ Modern Internet): Commercial ISPs aur 1998 mein ICANN ke aane ke baad Internet aam logon aur business ke liye khul gaya.',
      hinglishExample:
        '29 October 1969 ko UCLA se Stanford (SRI) pehla message "LOGIN" bhejna tha, lekin sirf "LO" pahunch kar system crash ho gaya—yahi Internet ka pehla message tha!',
      hinglishConclusion:
        'ARPANET ki packet switching aur 1983 ke TCP/IP standard ne aaj ke global Internet ki mazboot neev rakhi.',
    },
    {
      section: 'B',
      marks: 5,
      questionText: 'Explain the Working of HTTP.',
      practiceBadge: 'Exam Preparation Recommendation',
      introduction:
        'HTTP (HyperText Transfer Protocol) is the stateless, application-layer request-response protocol that powers data communication across the World Wide Web.',
      mainExplanation:
        'HTTP follows a structured four-step client-server lifecycle over TCP (Port 80; HTTPS uses TLS on Port 443):\n1) DNS Lookup & TCP 3-Way Handshake: The browser resolves the domain to an IP and exchanges SYN, SYN-ACK, and ACK packets with the web server.\n2) HTTP Request Transmission: The client sends a request line containing an HTTP Method (GET, POST, PUT, DELETE), URI path, HTTP version, headers (Host, Accept, User-Agent, Cookie), and optional body.\n3) Server Processing & Response: The web server parses the request, executes routing/backend logic, and replies with a status line (e.g., 200 OK, 301 Redirect, 404 Not Found, 500 Internal Error), response headers (Content-Type, Cache-Control), and payload.\n4) Statelessness & Keep-Alive: HTTP retains no session memory between requests; cookies/JWT tokens carry state, while HTTP/1.1 Keep-Alive and HTTP/2 multiplexing reuse the connection.',
      examples:
        'Client sends: GET /unit1/notes.html HTTP/1.1 -> Server replies: HTTP/1.1 200 OK + Content-Type: text/html + page body.',
      advantages: [
        'Stateless architecture allows effortless server scaling and load balancing',
        'Human-readable headers, caching controls, and extensible media types',
      ],
      disadvantages: [
        'Requires cookies or session tokens for login persistence',
        'Plain HTTP lacks encryption, making HTTPS (TLS) mandatory in modern apps',
      ],
      diagramKey: 'u1-http-working',
      conclusion:
        'HTTP’s clean request-response contract and stateless semantics enable reliable, high-scale web interactions.',
      keywords: ['Request-Response', 'TCP 3-Way Handshake', 'Stateless', 'GET/POST', 'Status Codes', 'Keep-Alive'],
      hinglishIntro:
        'HTTP ek stateless Request-Response protocol hai jo Web Browser (Client) aur Web Server ke beech data exchange karne ka kaam karta hai.',
      hinglishExplanation:
        'Iski working 4 easy steps mein hoti hai:\n1) Connection Setup: Pehle DNS domain ko IP mein badalta hai, fir browser aur server ke beech TCP 3-way handshake (SYN, SYN-ACK, ACK) hota hai.\n2) HTTP Request: Browser request bhejta hai jisme Method (GET ya POST), URL path aur Headers hote hain.\n3) Server Response: Server request process karke Status Code (jaise 200 OK ya 404 Not Found), headers aur HTML/JSON data bhejta hai.\n4) Stateless & Keep-Alive: Server pichhli request bhool jata hai (stateless), isliye user login rakhne ke liye Cookies/Tokens use hote hain.',
      hinglishExample:
        'Jab aap Exam Tips par Unit 1 Notes click karte hain, browser "GET /unit-1" bhejta hai aur server "200 OK" ke saath notes bhej deta hai.',
      hinglishConclusion:
        'Stateless nature aur clean status codes ki wajah se HTTP duniya ke billions of requests ko fast handle kar pata hai.',
    },
    {
      section: 'B',
      marks: 5,
      questionText: 'Explain SMTP, POP3 and IMAP.',
      practiceBadge: 'Exam Preparation Recommendation',
      introduction:
        'Internet email relies on complementary protocols: SMTP handles sending and relaying messages between servers, while POP3 and IMAP retrieve messages into a user’s mail client.',
      mainExplanation:
        '1) SMTP (Simple Mail Transfer Protocol – Ports 25 / 587): A push protocol used by Mail User Agents (MUAs) and Mail Transfer Agents (MTAs) to send and route outgoing emails using commands like EHLO, MAIL FROM, RCPT TO, and DATA.\n2) POP3 (Post Office Protocol v3 – Ports 110 / 995): A pull protocol designed for single-device offline use. It downloads all new messages from the server to local disk and usually deletes server copies.\n3) IMAP (Internet Message Access Protocol – Ports 143 / 993): A modern pull protocol that retains emails and folders on the server, synchronizing read/unread status, flags, and folder changes across phones, laptops, and webmail while allowing header-only preview.',
      examples:
        'Sending an assignment uses SMTP (port 587) to deliver mail; reading that reply on both your smartphone and laptop uses IMAP (port 993).',
      advantages: [
        'Clear division between outgoing mail relay (SMTP) and inbox retrieval (POP3/IMAP)',
        'IMAP provides multi-device folder synchronization and bandwidth-saving partial fetches',
      ],
      disadvantages: [
        'POP3 lacks multi-device sync and risks data loss if the local device fails',
        'IMAP requires continuous server storage space',
      ],
      diagramKey: 'u1-email-arch',
      conclusion:
        'Together, SMTP (push) and IMAP/POP3 (pull) provide reliable global email delivery and retrieval.',
      keywords: ['SMTP Push', 'POP3 Port 110', 'IMAP Port 143', 'MTA/MUA', 'Synchronization'],
      hinglishIntro:
        'Email system do hisson mein kaam karta hai: bhejne ke liye SMTP, aur padhne/receive karne ke liye POP3 ya IMAP.',
      hinglishExplanation:
        '1) SMTP (Simple Mail Transfer Protocol - Port 25/587): Yeh Push protocol hai jo sender ke device se email lekar recipient ke mail server tak pahunchata hai.\n2) POP3 (Post Office Protocol v3 - Port 110/995): Yeh Pull protocol hai jo server se email local computer par download kar leta hai aur server se delete kar deta hai. Ek hi PC par offline padhne ke liye useful hai.\n3) IMAP (Internet Message Access Protocol - Port 143/993): Yeh bhi Pull protocol hai, lekin emails server par hi rehte hain. Aap phone, laptop ya webmail kahin bhi kholein, folders aur read status sync rehte hain.',
      hinglishExample:
        'Jab aap college professor ko mail bhejte hain toh SMTP kaam karta hai; jab professor phone aur laptop dono par wo mail check karte hain toh IMAP use hota hai.',
      hinglishConclusion:
        'Exam tip: SMTP = Send (Push), POP3 = Download & Delete (Single Device), IMAP = Server Sync (Multi-Device).',
    },
    {
      section: 'B',
      marks: 5,
      questionText: 'Explain DNS and its working.',
      practiceBadge: 'Exam Preparation Recommendation',
      introduction:
        'DNS (Domain Name System) is a hierarchical, distributed directory that resolves human-readable domain names into IP addresses.',
      mainExplanation:
        'DNS is organized as an inverted tree: Root Zone (.) -> Top-Level Domains (.com, .edu, .in) -> Authoritative Second-Level Domains -> Subdomains. Its resolution process works in clear steps:\n1) Cache Lookup: Browser and OS check local DNS caches and hosts file.\n2) Recursive Resolver Query: On a cache miss, the OS sends a recursive query (UDP port 53) to the ISP or public resolver (e.g., 8.8.8.8).\n3) Iterative Root Query: The resolver asks a Root Server, which refers it to the relevant TLD server (e.g., .edu).\n4) TLD Server Query: The TLD server refers the resolver to the domain’s Authoritative Nameserver.\n5) Authoritative Response & Caching: The Authoritative server returns the A (IPv4) or AAAA (IPv6) record; the resolver caches it for the TTL duration and returns the IP to the browser.',
      examples:
        'Resolving portal.college.edu: Browser -> Recursive Resolver -> Root (.) -> .edu TLD -> college.edu NS -> 198.51.100.24.',
      advantages: [
        'Distributed hierarchy eliminates single points of bottleneck',
        'TTL caching drastically accelerates repeat lookups',
      ],
      disadvantages: [
        'TTL caching causes propagation delays when IP records are updated',
        'Susceptible to cache poisoning attacks without DNSSEC',
      ],
      diagramKey: 'u1-dns-resolution',
      conclusion:
        'DNS seamlessly bridges human-friendly domain names and machine-routable IP addresses across the Internet.',
      keywords: ['Root Server', 'TLD Server', 'Authoritative Nameserver', 'Recursive vs Iterative', 'TTL', 'A/AAAA'],
      hinglishIntro:
        'DNS (Domain Name System) Internet ki directory hai jo domain names (jaise examtips.edu) ko IP addresses (jaise 203.0.113.10) mein convert karta hai.',
      hinglishExplanation:
        'DNS ki working 5 steps mein samjhein:\n1) Cache Check: Sabse pehle browser aur OS apna local cache check karte hain.\n2) Recursive Resolver: Agar cache mein IP nahi mila, toh query ISP ke Recursive Resolver (UDP Port 53) ke paas jati hai.\n3) Root Server: Resolver Root server (.) se puchta hai, jo use sahi TLD server (.com ya .edu) ka address deta hai.\n4) TLD Server: TLD server batata hai ki us domain ka Authoritative Nameserver kahan hai.\n5) Authoritative Answer: Authoritative server final A (IPv4) ya AAAA (IPv6) IP deta hai, jise resolver TTL time ke liye cache karke browser ko wapas de deta hai.',
      hinglishExample:
        'Jaise aap kisi unknown school ka phone number dhoondhne ke liye receptionist -> department head -> class teacher tak jate hain, waise hi resolver Root -> TLD -> Authoritative server se IP lata hai.',
      hinglishConclusion:
        'Recursive resolver aur TTL caching ki wajah se DNS milliseconds mein karodo lookups handle karta hai.',
    },
    {
      section: 'B',
      marks: 5,
      questionText: 'Differentiate between Web Browser and Web Server.',
      practiceBadge: 'Exam Preparation Recommendation',
      introduction:
        'Web Browsers and Web Servers are the two complementary endpoints in the Web’s client-server architecture.',
      mainExplanation:
        '1) Role: A Web Browser acts as the client that requests and displays web pages; a Web Server hosts website files/logic and serves responses.\n2) Communication Direction: Browsers initiate HTTP/HTTPS requests; servers passively listen on TCP ports 80/443 and respond.\n3) Core Responsibilities: Browsers execute HTML parsing (DOM), CSS styling (CSSOM), JavaScript execution (e.g., V8), and pixel painting. Web servers manage virtual hosts, URL routing, TLS certificates, compression, authentication, and backend integration.\n4) Installation Location: Browsers run on end-user devices (PCs, smartphones); servers run on data-center or cloud hosts.\n5) Examples: Chrome, Firefox, Safari, Edge (Browsers) vs Apache HTTP Server, Nginx, IIS (Web Servers).',
      examples:
        'Chrome (Browser) requests GET /syllabus.html; Nginx (Web Server) reads the file and returns 200 OK.',
      advantages: [
        'Clear client-server separation lets any standard browser talk to any standard server',
      ],
      disadvantages: [
        'Network latency or server downtime prevents the browser from loading fresh resources',
      ],
      diagramKey: 'u1-browser-server',
      conclusion:
        'Coordinated interaction between Web Browsers and Web Servers turns stored markup and code into live user experiences.',
      keywords: ['Client vs Server', 'Rendering Engine', 'Port 80/443', 'Chrome vs Nginx', 'DOM/CSSOM'],
      hinglishIntro:
        'Web Browser aur Web Server Web Client-Server model ke do main endpoints hain jo request aur response ke through baat karte hain.',
      hinglishExplanation:
        'Main Differences:\n1) Role: Web Browser Client hota hai jo webpage mangta aur screen par dikhata hai; Web Server Host hota hai jo files store karke bhejta hai.\n2) Action: Browser HTTP request initiate karta hai; Web Server Port 80/443 par wait karta hai aur response bhejta hai.\n3) Processing: Browser ke andar Rendering Engine (DOM + CSSOM) aur JS Engine (V8) chalta hai; Server ke andar file routing, TLS security, aur backend database connect hota hai.\n4) Location: Browser user ke laptop/phone mein hota hai; Server data center ya cloud par hota hai.\n5) Examples: Chrome, Firefox, Edge (Browsers) vs Apache, Nginx, IIS (Servers).',
      hinglishExample:
        'Browser ek customer ki tarah menu mangta hai, aur Web Server waiter/kitchen ki tarah dish (HTML/CSS/JSON) banakar serve karta hai.',
      hinglishConclusion:
        'Dono milkar HTTP rules ko follow karte hue kisi bhi webpage ko screen tak pahunchate hain.',
    },

    // =========================================================================
    // SECTION C – 8/10 MARKS QUESTIONS (ALL 3 LONG-ANSWER QUESTIONS)
    // =========================================================================
    {
      section: 'C',
      marks: 8,
      questionText: 'Explain the Internet and World Wide Web. Describe their architecture and differences.',
      practiceBadge: 'Exam Preparation Recommendation',
      introduction:
        'The Internet and the World Wide Web (WWW) form the dual foundation of modern digital communication. While the Internet provides the physical and logical network infrastructure, the World Wide Web operates above it as a distributed hypermedia information system.',
      mainExplanation:
        '1) The Internet & Its Architecture: The Internet is a decentralized global network of networks communicating via the 4-layer TCP/IP stack (Network Access, Internet/IP, Transport TCP/UDP, Application). End-user LANs connect through Regional ISPs and Tier-1 Optical Backbones/IXPs using BGP routing and packet switching.\n2) World Wide Web (WWW) & Its Architecture: Proposed by Tim Berners-Lee in 1989, the WWW uses a client-server application architecture built on three pillars: URLs (resource identifiers), HTTP/HTTPS (transfer protocol), and HTML (hypertext markup). When a user enters a URL, the Web Browser resolves the hostname via DNS, establishes a TCP/TLS connection to the Web Server on port 80/443, fetches HTML/CSS/JS documents from the server’s hypertext store, and builds the DOM and Render Tree.\n3) Key Architectural Differences: (a) Layer: Internet = Network infrastructure; WWW = Application service. (b) Protocols: Internet uses TCP/IP/ICMP/BGP; WWW uses HTTP/HTTPS. (c) Scope: Internet powers Email (SMTP), FTP, SSH, VoIP, and WWW; WWW deals specifically with linked hypertext web resources. (d) Addressing: IP addresses vs URLs.',
      examples:
        'Using SSH or sending an email via an SMTP relay uses the Internet TCP/IP stack without invoking WWW; loading https://examtips.edu uses DNS + TCP/IP + HTTP + HTML (both Internet and WWW).',
      advantages: [
        'Modular layering allows hardware upgrades (5G, Fiber) without breaking Web apps',
        'Open WWW standards ensure universal accessibility across any OS or device',
      ],
      disadvantages: [
        'Dependence on centralized DNS/backbone routing creates privacy and availability challenges if misconfigured',
      ],
      diagramKey: 'u1-www-arch',
      conclusion:
        'In conclusion, the Internet is the global transport network infrastructure, whereas the World Wide Web is the interconnected hypertext ecosystem built atop that network.',
      keywords: ['Internet Architecture', 'WWW Architecture', 'TCP/IP Stack', 'URL/HTTP/HTML', 'Infrastructure vs Service'],
      hinglishIntro:
        'Internet aur World Wide Web (WWW) modern computing ke do pillars hain—Internet network infrastructure hai, jabki WWW uske upar chalne wala hypertext web ecosystem hai.',
      hinglishExplanation:
        '1) Internet Architecture: Internet TCP/IP 4-layer model (Network Access, IP, TCP/UDP, Application) par chalta hai. Ghar ka Wi-Fi/LAN Regional ISP se aur wahan se Tier-1 fiber backbone se judta hai jahan data packets dynamically route hote hain.\n2) WWW Architecture: Tim Berners-Lee ne 1989 mein banaya. Isme Client (Browser) URL dalta hai -> DNS IP nikalta hai -> HTTP/HTTPS request Web Server (Port 80/443) tak jati hai -> Web Server HTML/CSS/JS bhejta hai -> Browser unhe DOM banakar screen par render karta hai.\n3) Key Differences: (a) Internet hardware+network hai (Superset), WWW software+websites space hai (Subset). (b) Internet TCP/IP use karta hai, WWW HTTP/HTML/URL use karta hai. (c) Email (SMTP) aur FTP bina WWW ke sirf Internet par chal sakte hain.',
      hinglishExample:
        'Internet ko bijli ki grid line samjhein aur WWW ko us par chalne wala Smart TV—bina grid ke TV nahi chalega, lekin grid par Fridge aur AC (Email, FTP) bhi chalte hain.',
      hinglishConclusion:
        'Exam conclusion: Internet communication backbone provide karta hai, aur WWW usi backbone par hyperlinked knowledge aur apps deliver karta hai.',
    },
    {
      section: 'C',
      marks: 10,
      questionText: 'Explain the different Internet protocols: HTTP, SMTP, POP3, MIME and IMAP.',
      practiceBadge: 'Exam Preparation Recommendation',
      introduction:
        'Application-layer Internet protocols define exact message formats, port bindings, and communication rules for web browsing and electronic mail. Five core protocols—HTTP, SMTP, POP3, MIME, and IMAP—form the backbone of Unit 1 Web Technology.',
      mainExplanation:
        '1) HTTP (HyperText Transfer Protocol – Port 80 / HTTPS 443): A stateless, pull-based client-server protocol for transferring HTML, JSON, images, and API payloads. Clients send methods (GET, POST, PUT, DELETE) and servers reply with status codes (200 OK, 301, 404, 500).\n2) SMTP (Simple Mail Transfer Protocol – Ports 25 / 587): A stateful push protocol responsible for sending outgoing email from an MUA to an MTA and relaying messages between mail servers using EHLO, MAIL FROM, RCPT TO, and DATA.\n3) MIME (Multipurpose Internet Mail Extensions): Since plain SMTP only handles 7-bit US-ASCII text, MIME introduces headers (MIME-Version, Content-Type, Content-Transfer-Encoding) and Base64 encoding so emails carry PDFs, images, audio, HTML, and UTF-8 text.\n4) POP3 (Post Office Protocol v3 – Ports 110 / 995): A simple pull protocol that downloads new mail from the MDA mailbox to a single local device and normally removes copies from the server.\n5) IMAP (Internet Message Access Protocol – Ports 143 / 993): An advanced pull protocol that keeps mail and folders on the server, synchronizing read/unread flags across multiple devices and supporting server-side search.',
      examples:
        'Browsing https://examtips.edu uses HTTP/TLS (443); sending an email with a PDF uses SMTP (587) + MIME (Base64); syncing the same inbox on phone and laptop uses IMAP (993); downloading offline archive uses POP3 (995).',
      advantages: [
        'Each protocol specializes cleanly: HTTP for Web, SMTP+MIME for sending rich email, IMAP/POP3 for retrieval',
        'TLS/SSL wrappers (HTTPS, SMTPS, IMAPS, POP3S) protect confidentiality in transit',
      ],
      disadvantages: [
        'MIME Base64 encoding adds ~33% overhead to binary attachments',
        'HTTP statelessness demands cookies or tokens for session continuity',
      ],
      diagramKey: 'u1-email-arch',
      conclusion:
        'Collectively, HTTP, SMTP, MIME, POP3, and IMAP standardize reliable hypermedia retrieval and rich multi-device email communication worldwide.',
      keywords: ['HTTP (80/443)', 'SMTP (25/587)', 'MIME Base64', 'POP3 (110)', 'IMAP (143)', 'Stateless vs Stateful'],
      hinglishIntro:
        'Internet par web browsing aur email chalane ke liye 5 major application-layer protocols use hote hain: HTTP, SMTP, POP3, MIME aur IMAP.',
      hinglishExplanation:
        '1) HTTP (Port 80 / HTTPS 443): Web browser aur server ke beech HTML, images aur JSON laane ka stateless request-response protocol.\n2) SMTP (Port 25 / 587): Outgoing email bhejne aur servers ke beech relay karne ka Push protocol.\n3) MIME (Extension): SMTP sirf plain English (7-bit ASCII) bhej sakta hai, isliye MIME Content-Type aur Base64 encoding lagakar PDF, photo, video aur Unicode text ko email mein attach karna possible banata hai.\n4) POP3 (Port 110 / 995): Server se emails download karke delete karne wala single-device offline retrieval protocol.\n5) IMAP (Port 143 / 993): Emails ko server par safe rakh kar phone, laptop aur webmail sab par live sync karne wala modern protocol.',
      hinglishExample:
        'Ek college notice bhejte waqt website par HTTP se dikhta hai, aur students ko PDF email karte waqt SMTP + MIME bhejta hai, jise students phone par IMAP se padhte hain.',
      hinglishConclusion:
        'Short memory formula: HTTP = Web | SMTP = Send Mail | MIME = Attachments | POP3 = Download & Delete | IMAP = Multi-Device Sync.',
    },
    {
      section: 'C',
      marks: 10,
      questionText: 'Explain DNS architecture and its working process with a suitable diagram.',
      practiceBadge: 'Exam Preparation Recommendation',
      introduction:
        'The Domain Name System (DNS) is a globally distributed, fault-tolerant naming database that converts memorable domain names into IPv4 or IPv6 addresses needed by network routing hardware.',
      mainExplanation:
        '1) Hierarchical DNS Architecture: DNS uses an inverted tree namespace divided into independent zones:\n  • Root Zone (.): Topmost level operated by 13 logical root server clusters (A–M) worldwide.\n  • Top-Level Domains (TLDs): Generic (.com, .org, .edu, .net) and Country-Code (.in, .uk, .jp) registries.\n  • Second-Level & Authoritative Domains: Organization-owned domains (e.g., examtips.edu) managed by Authoritative Nameservers storing zone records (A for IPv4, AAAA for IPv6, CNAME for aliases, MX for email routing, NS for delegation).\n2) Step-by-Step DNS Resolution Process:\n  • Step 1 (Local Cache): Browser, OS, and local hosts file are checked first.\n  • Step 2 (Recursive Resolver): On cache miss, a recursive query is sent over UDP port 53 to the ISP/configured Recursive Resolver.\n  • Step 3 (Iterative Root Lookup): Resolver queries a Root Server, which replies with the referral to the .edu TLD server.\n  • Step 4 (Iterative TLD Lookup): Resolver queries the TLD server, which refers it to the domain’s Authoritative Nameserver.\n  • Step 5 (Authoritative Answer & TTL Cache): Authoritative Nameserver returns the exact A/AAAA IP address. The resolver caches it for the Time-To-Live (TTL) period and returns it to the client.',
      examples:
        'Lookup path for www.examtips.edu -> Browser Cache miss -> ISP Resolver -> Root (.) -> .edu TLD -> examtips.edu Authoritative NS -> Returns A record 203.0.113.42 (TTL 3600s).',
      advantages: [
        'Decentralized administration avoids a single point of failure across billions of domains',
        'TTL-based caching cuts latency and protects Root/TLD infrastructure',
        'Allows server IP migration without changing public domain names',
      ],
      disadvantages: [
        'DNS propagation delays occur during record updates because of cached TTLs',
        'Unprotected queries face DNS spoofing/cache poisoning risks unless DNSSEC and DoH/DoT are used',
      ],
      diagramKey: 'u1-dns-resolution',
      conclusion:
        'DNS pairs hierarchical delegation with recursive/iterative caching to resolve billions of domain lookups accurately in milliseconds.',
      keywords: ['DNS Hierarchy', 'Root (.)', 'TLD', 'Authoritative NS', 'Recursive Resolver', 'A/AAAA/MX/CNAME', 'TTL'],
      hinglishIntro:
        'DNS (Domain Name System) Internet ka distributed naming system hai jo domain names ko IP addresses mein resolve karta hai taaki browsers sahi server tak pahunch sakein.',
      hinglishExplanation:
        '1) DNS Architecture (Inverted Tree): Sabse upar Root Server (.) hota hai -> uske neeche TLD Servers (.com, .edu, .in) -> uske neeche Second-Level/Authoritative Domains (jaise examtips.edu) jahan actual records (A, AAAA, CNAME, MX, NS) stored rehte hain.\n2) Working Process (Resolution):\n  • Step 1: Browser aur OS sabse pehle apna local cache aur hosts file check karte hain.\n  • Step 2: Nahi milne par request ISP Recursive Resolver (UDP Port 53) ke paas jati hai.\n  • Step 3: Resolver Root Server se puchta hai -> Root use sahi TLD server par bhejta hai.\n  • Step 4: TLD Server use Authoritative Nameserver ka pata deta hai.\n  • Step 5: Authoritative Server final IP (A/AAAA record) deta hai, resolver use TTL time tak cache karke browser ko de deta hai.',
      hinglishExample:
        'Jab aap www.examtips.edu type karte hain, toh Resolver Root (.) -> .edu -> examtips.edu NS se poochkar final IP 203.0.113.42 laata hai.',
      hinglishConclusion:
        'Hierarchical tree aur TTL caching ki wajah se DNS bina kisi single bottleneck ke poori duniya ki websites ko fast connect karta hai.',
    },
  ],
  // 8 Focused Unit 1 MCQs covering every single Unit 1 syllabus topic
  mcqs: [
    {
      questionText: '1. Which project introduced packet switching in 1969 as the foundation of the modern Internet?',
      options: ['ARPANET', 'CERN', 'ICANN', 'NSFNET'],
      correctIndex: 0,
      explanation: 'ARPANET, funded by the US Department of Defense ARPA in 1969, pioneered packet-switched computer networking across four universities.',
      difficulty: 'Easy',
    },
    {
      questionText: '2. Which three foundational standards were combined by Tim Berners-Lee to create the World Wide Web (WWW)?',
      options: ['TCP, IP, and DNS', 'URL, HTTP, and HTML', 'SMTP, POP3, and IMAP', 'XML, SOAP, and WSDL'],
      correctIndex: 1,
      explanation: 'Sir Tim Berners-Lee combined URLs (addressing), HTTP (transfer), and HTML (document markup) at CERN in 1989 to build the WWW.',
      difficulty: 'Easy',
    },
    {
      questionText: '3. Which HTML5 declaration triggers standards-compliant rendering and what is the primary purpose of HTML?',
      options: [
        '<!DOCTYPE html>; defines procedural database queries',
        '<!DOCTYPE html>; defines semantic document structure and hypertext links',
        '<html5>; compiles server-side network sockets',
        '<meta charset>; encrypts TCP/IP traffic automatically',
      ],
      correctIndex: 1,
      explanation: '<!DOCTYPE html> tells browsers to use standards mode, and HTML defines semantic structure and hyperlinks using tags.',
      difficulty: 'Easy',
    },
    {
      questionText: '4. What are the default TCP ports for HTTP and HTTPS, and why is HTTP described as stateless?',
      options: [
        'Ports 25 & 587; it deletes files after reading',
        'Ports 80 & 443; servers retain no memory of previous client requests by default',
        'Ports 110 & 995; it uses UDP broadcasts only',
        'Ports 53 & 143; it converts domain names into MAC addresses',
      ],
      correctIndex: 1,
      explanation: 'HTTP uses TCP port 80 (HTTPS uses TLS on port 443), and each request is processed independently unless cookies or tokens carry state.',
      difficulty: 'Medium',
    },
    {
      questionText: '5. Which protocol pushes outgoing email between servers, and which standard enables multimedia attachments over it?',
      options: [
        'POP3 for sending; DNS for attachments',
        'SMTP for sending; MIME (Base64) for multimedia attachments',
        'IMAP for sending; HTTP for attachments',
        'UDP for sending; CSS for attachments',
      ],
      correctIndex: 1,
      explanation: 'SMTP pushes/relays outgoing mail (ports 25/587), while MIME extends 7-bit ASCII email using Content-Type headers and Base64 encoding.',
      difficulty: 'Medium',
    },
    {
      questionText: '6. How does IMAP differ from POP3 when accessing emails across a smartphone and a laptop?',
      options: [
        'POP3 syncs folders in real time, whereas IMAP deletes messages immediately',
        'IMAP keeps emails and folder states synchronized on the server across all devices',
        'IMAP only works over UDP port 53',
        'POP3 encrypts attachments using HTML5 tags',
      ],
      correctIndex: 1,
      explanation: 'IMAP (port 143/993) stores messages centrally on the server so folders and read/unread flags stay synchronized across multiple devices.',
      difficulty: 'Easy',
    },
    {
      questionText: '7. During DNS resolution, which nameserver holds and returns the final authoritative A or AAAA IP record for a domain?',
      options: ['Root Nameserver', 'TLD Nameserver', 'Authoritative Nameserver', 'ARP Broadcast Cache'],
      correctIndex: 2,
      explanation: 'The Recursive Resolver receives referrals from Root (.) and TLD servers before querying the domain’s Authoritative Nameserver for the final IP record.',
      difficulty: 'Medium',
    },
    {
      questionText: '8. Inside a Web Browser interacting with a Web Server, which two trees are merged to build the Render Tree?',
      options: ['DOM and CSSOM', 'DNS and SMTP', 'TCP and MIME', 'POP3 and IMAP'],
      correctIndex: 0,
      explanation: 'The browser’s Rendering Engine builds the DOM from HTML and CSSOM from CSS, combines them into the Render Tree, then performs Layout and Paint.',
      difficulty: 'Medium',
    },
  ],
};
