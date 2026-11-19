import type { SeedUnit } from './types.ts';

export const unit3: SeedUnit = {
  unitNumber: 3,
  slug: 'unit-3-web-services-and-ajax',
  title: 'Web Services and AJAX',
  subtitle: 'Unit 3 · Service-Oriented Architecture, SOAP/WSDL/UDDI, Asynchronous Web & CORBA',
  description:
    'In-depth coverage of Web Services architecture, UDDI registries, SOAP messaging, WSDL contracts, deploying services, AJAX asynchronous programming and performance optimization, and distributed object middleware via CORBA.',
  examWeight: '20% Weightage',
  estimatedHours: 7,
  syllabus: [
    'Introduction to Web Services',
    'UDDI',
    'SOAP',
    'WSDL',
    'Web Service Architecture',
    'Developing and Deploying Web Services',
    'AJAX',
    'Improving Web Page Performance Using AJAX',
    'Programming in AJAX',
    'CORBA',
  ],
  quickRevision: [
    'Web Services enable platform-independent machine-to-machine communication over HTTP using open standards.',
    'Service-Oriented Architecture (SOA) triangle: Service Provider (publishes), Service Registry/UDDI (discovers), Service Requestor (binds).',
    'SOAP (Simple Object Access Protocol) wraps XML messages in an Envelope (optional Header + mandatory Body + Fault).',
    'WSDL (Web Services Description Language) is an XML contract describing operations, messages, bindings, and endpoints.',
    'UDDI (Universal Description, Discovery, and Integration) acts as a searchable Yellow/White/Green pages directory for services.',
    'AJAX uses XMLHttpRequest or fetch() to exchange data asynchronously in the background without full page reloads.',
    'CORBA (OMG) enables binary distributed object calls across languages using IDL and the ORB over IIOP.',
  ],
  diagrams: [
    {
      diagramKey: 'u3-ws-arch',
      title: 'Web Services Architecture (SOA Triangle)',
      category: 'Architecture',
      summary:
        'Illustrates the Publish–Find–Bind lifecycle across Service Provider, Service Registry (UDDI), and Service Requestor.',
      steps: [
        { step: 1, label: 'Publish (WSDL -> UDDI)', detail: 'Service Provider registers service metadata and WSDL URL in UDDI.' },
        { step: 2, label: 'Find (Requestor -> UDDI)', detail: 'Service Requestor queries UDDI to discover a matching service.' },
        { step: 3, label: 'Retrieve Contract (WSDL)', detail: 'Requestor inspects WSDL operations, types, and endpoint URI.' },
        { step: 4, label: 'Bind & Invoke (SOAP/HTTP)', detail: 'Requestor binds directly to Provider and exchanges SOAP messages.' },
      ],
    },
    {
      diagramKey: 'u3-soap-flow',
      title: 'SOAP Communication Process & Envelope Structure',
      category: 'Process',
      summary:
        'Breaks down the SOAP Envelope (Header, Body, Fault) serialized over HTTP POST between Client Proxy and Server Skeleton.',
      steps: [
        { step: 1, label: 'Client Marshaling', detail: 'Client proxy serializes method parameters into SOAP Body XML.' },
        { step: 2, label: 'HTTP POST Transport', detail: 'SOAP Envelope sent over HTTP with Content-Type: application/soap+xml.' },
        { step: 3, label: 'Server Unmarshaling', detail: 'Service endpoint validates Header/auth and executes target operation.' },
        { step: 4, label: 'SOAP Response / Fault', detail: 'Returns result XML in Body or structured error inside <soap:Fault>.' },
      ],
    },
    {
      diagramKey: 'u3-wsdl-arch',
      title: 'WSDL Document Architecture',
      category: 'Architecture',
      summary:
        'Maps abstract sections (Types, Message, PortType) to concrete network sections (Binding, Service/Port).',
      steps: [
        { step: 1, label: '<types> (XSD)', detail: 'Defines XML Schema data types used by requests and responses.' },
        { step: 2, label: '<message> & <portType>', detail: 'Declares abstract input/output parameters and operations.' },
        { step: 3, label: '<binding>', detail: 'Maps abstract operations to concrete protocol (SOAP over HTTP).' },
        { step: 4, label: '<service> & <port>', detail: 'Specifies the live network endpoint URL for invocation.' },
      ],
    },
    {
      diagramKey: 'u3-uddi-registry',
      title: 'UDDI Registry Directory Model',
      category: 'Architecture',
      summary:
        'Organizes registered web services into White Pages (identity), Yellow Pages (category), and Green Pages (technical binding).',
      steps: [
        { step: 1, label: 'White Pages', detail: 'Business name, contact details, and corporate identifiers.' },
        { step: 2, label: 'Yellow Pages', detail: 'Industry taxonomy classifications (NAICS, UNSPSC, region).' },
        { step: 3, label: 'Green Pages', detail: 'Technical specifications, tModel references, and WSDL URLs.' },
        { step: 4, label: 'UDDI Inquiry API', detail: 'SOAP-based search API returning bindingTemplate endpoints.' },
      ],
    },
    {
      diagramKey: 'u3-ajax-working',
      title: 'AJAX Asynchronous Working Process',
      category: 'Process',
      summary:
        'Contrasts non-blocking background XMLHttpRequest/fetch JSON exchange against synchronous full-page HTTP reloads.',
      steps: [
        { step: 1, label: 'User Event in Browser', detail: 'User types in search box or clicks bookmark without page navigation.' },
        { step: 2, label: 'Async XHR / fetch()', detail: 'Browser sends background HTTP request while UI stays interactive.' },
        { step: 3, label: 'Server JSON / XML Reply', detail: 'Backend queries PostgreSQL and returns compact JSON payload.' },
        { step: 4, label: 'Partial DOM Update', detail: 'Callback updates only the affected DOM component seamlessly.' },
      ],
    },
    {
      diagramKey: 'u3-corba-arch',
      title: 'CORBA Distributed Object Architecture',
      category: 'Architecture',
      summary:
        'Shows Client Stub, Object Request Broker (ORB), IIOP network transport, and Server Skeleton generated from OMG IDL.',
      steps: [
        { step: 1, label: 'OMG IDL Interface', detail: 'Language-neutral Interface Definition Language specifies remote methods.' },
        { step: 2, label: 'Client Stub & ORB', detail: 'Client invokes local stub; ORB marshals binary arguments.' },
        { step: 3, label: 'GIOP / IIOP Transport', detail: 'Inter-ORB protocol routes call across TCP/IP networks.' },
        { step: 4, label: 'POA & Server Skeleton', detail: 'Server ORB/POA unmarshals call and invokes target implementation.' },
      ],
    },
  ],
  topics: [
    {
      orderIndex: 1,
      slug: 'introduction-to-web-services',
      title: 'Introduction to Web Services',
      definition:
        'A Web Service is a standardized, self-contained software component exposed over a network (typically HTTP) that enables interoperable machine-to-machine communication across heterogeneous platforms.',
      explanation:
        'Before Web Services, connecting a Java system on Linux to a .NET system on Windows required fragile proprietary bridges. Web Services solve interoperability by communicating through open text/XML/JSON standards over standard HTTP ports (80/443), bypassing restrictive firewalls. Classic WS-* Web Services rely on SOAP, WSDL, and UDDI, whereas modern lightweight Web Services predominantly adopt RESTful HTTP APIs with JSON.',
      examples: [
        {
          title: 'Real-World Web Service Scenarios',
          description:
            'Payment gateways (Stripe/Razorpay), weather telemetry APIs, university result verification portals, and flight reservation aggregators.',
        },
      ],
      keyTakeaways: [
        'Web Services decouple client language from server implementation via open standards.',
        'Operates cleanly across firewalls using ubiquitous HTTP/HTTPS transport.',
      ],
      diagramKey: 'u3-ws-arch',
    },
    {
      orderIndex: 2,
      slug: 'uddi',
      title: 'UDDI (Universal Description, Discovery, and Integration)',
      definition:
        'UDDI is an XML-based platform-independent registry standard for publishing, categorizing, and discovering Web Services across organizations.',
      explanation:
        'Inspired by telephone directories, UDDI organizes service metadata into three conceptual sections: White Pages (business name, address, contact info), Yellow Pages (industrial classification and service categories), and Green Pages (technical details, interface schemas, and binding URLs pointing to WSDL files). Clients query a UDDI registry via its SOAP Inquiry API to dynamically locate service providers.',
      examples: [
        {
          title: 'UDDI Information Categories',
          description: 'White Pages -> Who | Yellow Pages -> What Category | Green Pages -> How to Connect (WSDL/tModel).',
        },
      ],
      keyTakeaways: [
        'UDDI serves as the Service Broker in the SOA Publish-Find-Bind triangle.',
        'Green Pages store the technical tModel and WSDL binding references.',
      ],
      diagramKey: 'u3-uddi-registry',
    },
    {
      orderIndex: 3,
      slug: 'soap',
      title: 'SOAP (Simple Object Access Protocol)',
      definition:
        'SOAP is a strict, XML-based messaging protocol for exchanging structured information in decentralized web service implementations.',
      explanation:
        'Every SOAP message is an XML document with a root <soap:Envelope>. Inside sits an optional <soap:Header> (for security tokens, routing, or transaction IDs), a mandatory <soap:Body> (carrying the actual RPC call or response payload), and an optional <soap:Fault> inside the Body to report structured error codes and reasons. SOAP can travel over HTTP, SMTP, or JMS and integrates with enterprise WS-Security and WS-ReliableMessaging standards.',
      examples: [
        {
          title: 'SOAP 1.2 Request Envelope Example',
          description: 'Querying exam score for a student ID over SOAP.',
          code: `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope">
  <soap:Header>
    <authToken>eyJhbGciOiJIUzI1NiJ9</authToken>
  </soap:Header>
  <soap:Body>
    <GetUnitScore xmlns="https://examtips.edu/ws">
      <unitNumber>3</unitNumber>
    </GetUnitScore>
  </soap:Body>
</soap:Envelope>`,
          language: 'xml',
        },
      ],
      keyTakeaways: [
        'SOAP Envelope and Body are mandatory; Header and Fault are optional.',
        'Transport-independent protocol that guarantees strict contract typing via XSD.',
      ],
      diagramKey: 'u3-soap-flow',
    },
    {
      orderIndex: 4,
      slug: 'wsdl',
      title: 'WSDL (Web Services Description Language)',
      definition:
        'WSDL is an XML format that formally describes the network location, supported operations, message formats, and transport bindings of a Web Service.',
      explanation:
        'WSDL acts as a machine-readable contract between provider and consumer, enabling automated client stub generation. A WSDL document has abstract and concrete elements: <types> (XSD schemas), <message> (input/output data parts), <portType> (or <interface> in WSDL 2.0, listing abstract operations), <binding> (mapping operations to SOAP/HTTP), and <service> (providing the live endpoint URL via <port>).',
      examples: [
        {
          title: 'Core WSDL Element Structure',
          description: 'Skeleton showing abstract PortType mapped to concrete SOAP Binding.',
          code: `<definitions name="ExamService" targetNamespace="https://examtips.edu/ws">
  <types> <!-- XSD Schemas --> </types>
  <message name="ScoreRequest"><part name="unitId" type="xsd:int"/></message>
  <portType name="ExamPortType">
    <operation name="getScore"><input message="tns:ScoreRequest"/></operation>
  </portType>
  <binding name="ExamSoapBinding" type="tns:ExamPortType">
    <soap:binding style="document" transport="http://schemas.xmlsoap.org/soap/http"/>
  </binding>
  <service name="ExamService">
    <port name="ExamPort" binding="tns:ExamSoapBinding">
      <soap:address location="https://examtips.edu/soap/exam"/>
    </port>
  </service>
</definitions>`,
          language: 'xml',
        },
      ],
      keyTakeaways: [
        'WSDL answers three questions: What does the service do? How is it called? Where is it hosted?',
        'IDEs consume WSDL URLs to generate strongly-typed client proxies automatically.',
      ],
      diagramKey: 'u3-wsdl-arch',
    },
    {
      orderIndex: 5,
      slug: 'web-service-architecture',
      title: 'Web Service Architecture',
      definition:
        'Web Service Architecture defines the layered protocol stack and three-role interaction model (Provider, Registry, Requestor) enabling Service-Oriented Architecture (SOA).',
      explanation:
        'The architecture operates across four vertical layers: Transport (HTTP, SMTP, BEEP), Messaging (SOAP / XML-RPC / JSON), Description (WSDL), and Discovery (UDDI). At runtime, the Service Provider creates the service and publishes its WSDL to the Service Registry. The Service Requestor searches the registry, downloads the WSDL contract, and binds directly to the Provider’s endpoint to invoke remote operations.',
      examples: [
        {
          title: 'Web Service Protocol Stack',
          description: 'Discovery (UDDI) -> Description (WSDL) -> Messaging (SOAP/XML) -> Transport (HTTP/TCP).',
        },
      ],
      keyTakeaways: [
        'Loose coupling lets providers change internal code without breaking consumers as long as the WSDL contract holds.',
        'Publish-Find-Bind is the classic SOA interaction triad.',
      ],
      diagramKey: 'u3-ws-arch',
    },
    {
      orderIndex: 6,
      slug: 'developing-and-deploying-web-services',
      title: 'Developing and Deploying Web Services',
      definition:
        'Developing and deploying Web Services involves designing the service contract, implementing business logic, generating WSDL descriptors, packaging onto an application server, and publishing endpoints.',
      explanation:
        'Developers follow either a Contract-First approach (authoring WSDL/XSD first and generating server skeletons) or Code-First approach (annotating classes like @WebService / @WebMethod in Java JAX-WS or Express/FastAPI endpoints and auto-generating the contract). Deployment packages the service onto a web container or cloud runtime, configures TLS/HTTPS certificates, enforces authentication/rate-limiting, exposes the WSDL/OpenAPI URL, and registers metadata in a service directory.',
      examples: [
        {
          title: 'Contract-First vs Code-First Workflow',
          description:
            'Contract-First ensures cross-team agreement before coding; Code-First accelerates rapid prototyping from existing classes.',
        },
      ],
      keyTakeaways: [
        'Always version service endpoints (/v1/, /v2/) to avoid breaking existing client integrations.',
        'Secure deployed services with HTTPS, input validation, and token authentication.',
      ],
    },
    {
      orderIndex: 7,
      slug: 'ajax',
      title: 'AJAX (Asynchronous JavaScript and XML)',
      definition:
        'AJAX is a web development technique that uses browser APIs (XMLHttpRequest or Fetch) to exchange data asynchronously with a server and update portions of a web page without a full page reload.',
      explanation:
        'Coined by Jesse James Garrett in 2005, AJAX transforms clunky click-and-wait multi-page forms into fluid desktop-like web applications. Despite having XML in its name, modern AJAX predominantly exchanges lightweight JSON payloads. When a user triggers an event, JavaScript dispatches a non-blocking background HTTP request; the browser remains responsive, and when the response arrives, a callback updates only the relevant DOM elements.',
      examples: [
        {
          title: 'Classic Synchronous vs AJAX Asynchronous Flow',
          description: 'Classic HTTP reloads entire HTML document; AJAX fetches only compact JSON and updates 1 DOM region.',
        },
      ],
      keyTakeaways: [
        'AJAX is an architectural pattern combining JS, HTTP requests, and DOM updates—not a single programming language.',
        'JSON has largely replaced XML in modern AJAX APIs due to smaller size and native JS parsing.',
      ],
      diagramKey: 'u3-ajax-working',
    },
    {
      orderIndex: 8,
      slug: 'improving-web-page-performance-using-ajax',
      title: 'Improving Web Page Performance Using AJAX',
      definition:
        'AJAX improves perceived and actual web performance by minimizing redundant HTML transmission, avoiding full DOM reconstruction, and parallelizing data fetches.',
      explanation:
        'In traditional web apps, clicking a pagination button forces the server to re-render headers, sidebars, and stylesheets, and forces the browser to re-download and re-parse everything. With AJAX, static assets stay loaded in memory while only a few kilobytes of JSON are exchanged. Further optimizations include debouncing search inputs (reducing server calls while typing), caching responses client-side, cancelling stale in-flight requests via AbortController, and lazy-loading below-the-fold tabs on demand.',
      examples: [
        {
          title: 'Debounced Live Search Optimization',
          description: 'Waiting 250ms after typing stops prevents firing unnecessary AJAX requests on every keystroke.',
        },
      ],
      keyTakeaways: [
        'Reduces network payload size by 70–90% compared to full-HTML reloads.',
        'Combine AJAX with debouncing, caching, and request cancellation for peak responsiveness.',
      ],
      diagramKey: 'u3-ajax-working',
    },
    {
      orderIndex: 9,
      slug: 'programming-in-ajax',
      title: 'Programming in AJAX',
      definition:
        'AJAX programming uses the XMLHttpRequest object (tracking readyState 0–4 and HTTP status) or the modern Promise-based fetch() API.',
      explanation:
        'With XMLHttpRequest, developers instantiate new XMLHttpRequest(), assign an onreadystatechange handler checking readyState === 4 (DONE) and status === 200, call open(method, url, true), and invoke send(). With modern ES6+ Fetch API, asynchronous requests use async/await and clean Promise chains with built-in JSON parsing and AbortController support.',
      examples: [
        {
          title: 'XMLHttpRequest vs Modern Fetch API',
          description: 'Practical working examples of both standard AJAX approaches.',
          code: `// 1. Classic XMLHttpRequest
const xhr = new XMLHttpRequest();
xhr.open('GET', '/api/units/3', true);
xhr.onreadystatechange = function () {
  if (xhr.readyState === 4 && xhr.status === 200) {
    const data = JSON.parse(xhr.responseText);
    console.log(data.title);
  }
};
xhr.send();

// 2. Modern Fetch API
async function loadUnit(id) {
  const res = await fetch(\`/api/units/\${id}\`);
  if (!res.ok) throw new Error('Request failed');
  return res.json();
}`,
          language: 'javascript',
        },
      ],
      keyTakeaways: [
        'XMLHttpRequest readyState values: 0 UNSENT, 1 OPENED, 2 HEADERS_RECEIVED, 3 LOADING, 4 DONE.',
        'fetch() returns a Promise that resolves on HTTP response (check response.ok for 4xx/5xx errors).',
      ],
      diagramKey: 'u3-ajax-working',
    },
    {
      orderIndex: 10,
      slug: 'corba',
      title: 'CORBA (Common Object Request Broker Architecture)',
      definition:
        'CORBA, standardized by the Object Management Group (OMG), is a distributed object middleware architecture enabling objects written in different languages to invoke methods across a network.',
      explanation:
        'Before XML Web Services gained dominance, CORBA solved cross-language distributed computing (e.g., a C++ client calling a Java server object). Interfaces are declared in OMG IDL (Interface Definition Language), which compiles into client Stubs and server Skeletons. Requests travel through an Object Request Broker (ORB) using the binary IIOP (Internet Inter-ORB Protocol) over TCP/IP. While high-performance on intranets, CORBA struggles across Internet firewalls compared to HTTP-based Web Services.',
      examples: [
        {
          title: 'CORBA OMG IDL Interface Example',
          description: 'Language-neutral method specification compiled to C++/Java stubs.',
          code: `module ExamSystem {
  interface GradeBook {
    double getStudentAverage(in string studentId);
  };
};`,
          language: 'idl',
        },
      ],
      comparisonTable: {
        caption: 'CORBA vs Web Services (SOAP/REST)',
        headers: ['Feature', 'CORBA', 'Web Services'],
        rows: [
          ['Transport / Firewall', 'Binary IIOP (often blocked by firewalls)', 'HTTP/HTTPS (firewall-friendly)'],
          ['Interface Definition', 'OMG IDL', 'WSDL / OpenAPI'],
          ['Payload Format', 'Compact binary CDR', 'Text-based XML / JSON'],
          ['Coupling', 'Tighter distributed object coupling', 'Loose service-oriented coupling'],
        ],
      },
      keyTakeaways: [
        'ORB mediates communication transparently between Client Stub and Server Skeleton.',
        'IIOP (Internet Inter-ORB Protocol) is CORBA’s standard TCP/IP wire protocol.',
      ],
      diagramKey: 'u3-corba-arch',
    },
  ],
  questions: [
    {
      section: 'A',
      marks: 2,
      questionText: 'What are the three informational sections of a UDDI registry?',
      practiceBadge: 'Practice Recommendation',
      introduction: 'UDDI acts as a searchable directory for publishing and discovering Web Services.',
      mainExplanation:
        'It organizes service records into White Pages (business name, address, contact), Yellow Pages (industry and geographic classification codes), and Green Pages (technical binding details, interface specs, and WSDL endpoints).',
      examples: 'Looking up a shipping company’s tracking WSDL via Yellow Pages category "Logistics" and connecting via its Green Pages URL.',
      advantages: ['Standardizes service discovery across enterprise networks'],
      disadvantages: ['Public UDDI registries saw limited adoption compared to direct API portals'],
      conclusion: 'White, Yellow, and Green pages separate organizational identity from technical invocation details.',
      keywords: ['UDDI', 'White Pages', 'Yellow Pages', 'Green Pages', 'WSDL'],
    },
    {
      section: 'A',
      marks: 2,
      questionText: 'Define readyState values in XMLHttpRequest.',
      practiceBadge: 'Practice Recommendation',
      introduction: 'The readyState property tracks the lifecycle of an asynchronous AJAX XMLHttpRequest.',
      mainExplanation:
        '0 = UNSENT (object created), 1 = OPENED (open() called), 2 = HEADERS_RECEIVED (send() called and headers available), 3 = LOADING (response body downloading), and 4 = DONE (operation complete).',
      examples: 'Checking if (xhr.readyState === 4 && xhr.status === 200) before parsing responseText.',
      advantages: ['Allows fine-grained progress tracking during asynchronous transfers'],
      disadvantages: ['More verbose than modern async/await fetch()'],
      conclusion: 'State 4 combined with HTTP status 200 confirms a successful AJAX response.',
      keywords: ['XMLHttpRequest', 'readyState', 'AJAX', 'DONE', 'Status 200'],
    },
    {
      section: 'B',
      marks: 5,
      questionText: 'Explain the structure of a SOAP message and its communication workflow.',
      practiceBadge: 'Practice Recommendation',
      introduction:
        'SOAP (Simple Object Access Protocol) is a structured XML messaging specification for Web Services.',
      mainExplanation:
        'A SOAP message consists of an outer <soap:Envelope> namespace wrapper, an optional <soap:Header> carrying authentication or routing metadata, a mandatory <soap:Body> holding the method call or response XML, and an optional <soap:Fault> inside Body for standardized error reporting (faultcode, faultstring). Typically serialized over HTTP POST, a client proxy marshals arguments into SOAP XML, transmits to the server endpoint, and unmarshals the returned SOAP Body.',
      examples: 'Sending a <GetBalance> SOAP envelope with an auth token in <soap:Header> to a banking endpoint.',
      advantages: ['Language/platform neutral', 'Strong enterprise security and transaction extensions (WS-*)'],
      disadvantages: ['Verbose XML serialization increases bandwidth and parsing overhead compared to JSON'],
      diagramKey: 'u3-soap-flow',
      conclusion: 'SOAP’s rigid Envelope structure guarantees reliable, strongly typed enterprise communication.',
      keywords: ['SOAP Envelope', 'Header', 'Body', 'Fault', 'HTTP POST'],
    },
    {
      section: 'B',
      marks: 5,
      questionText: 'How does AJAX improve web page performance compared to traditional synchronous requests?',
      practiceBadge: 'Practice Recommendation',
      introduction:
        'Traditional multi-page web apps reload an entire HTML page on every user interaction, wasting bandwidth and disrupting user flow.',
      mainExplanation:
        'AJAX sends non-blocking background HTTP requests via XMLHttpRequest or fetch() and retrieves only compact JSON/XML payloads. The browser keeps existing CSS, JavaScript, and layout intact and updates only the targeted DOM element. Combined with input debouncing, client caching, and lazy loading, AJAX reduces payload sizes dramatically and eliminates screen flicker.',
      examples: 'Live autocomplete search querying /api/search?q=dns and updating a 10-item dropdown without refreshing the page.',
      advantages: ['70–90% lower bandwidth per interaction', 'Continuous, flicker-free user experience'],
      disadvantages: ['Requires careful handling of browser Back history and loading indicators'],
      diagramKey: 'u3-ajax-working',
      conclusion: 'AJAX shifts web apps from full-document reloads to efficient incremental data synchronization.',
      keywords: ['Asynchronous', 'Partial DOM Update', 'JSON', 'Debouncing', 'Latency'],
    },
    {
      section: 'C',
      marks: 10,
      questionText: 'Explain Web Service Architecture (SOA) detailing the roles of SOAP, WSDL, and UDDI with a neat diagram.',
      practiceBadge: 'Practice Recommendation',
      introduction:
        'Web Service Architecture implements Service-Oriented Architecture (SOA) so loosely coupled applications can discover and invoke capabilities across heterogeneous platforms over standard Internet protocols.',
      mainExplanation:
        'The architecture centers on three roles—Service Provider, Service Registry, and Service Requestor—and three core standards: (1) WSDL (Web Services Description Language) defines the XML contract specifying data types (<types>), messages (<message>), operations (<portType>), protocol bindings (<binding>), and endpoint URLs (<service>). (2) UDDI acts as the Service Registry where Providers publish their WSDL metadata (White, Yellow, and Green Pages) and Requestors search to find compatible services. (3) SOAP provides the XML message envelope transported over HTTP/HTTPS when the Requestor binds to the Provider to invoke operations. This Publish–Find–Bind cycle allows a Java backend to serve a Python or C# consumer seamlessly.',
      examples:
        'An airline booking portal finds a payment processor via UDDI, reads its WSDL contract to generate client stubs, and invokes ChargeCard via SOAP over HTTPS.',
      advantages: [
        'Cross-platform and cross-language interoperability',
        'Uses HTTP/HTTPS ports, avoiding firewall configuration issues',
        'Loose coupling and reusable enterprise services',
      ],
      disadvantages: [
        'XML parsing and SOAP headers add higher latency than lightweight REST/JSON',
        'Complex WS-* specifications increase development setup time',
      ],
      diagramKey: 'u3-ws-arch',
      conclusion:
        'Together, UDDI (discovery), WSDL (contract), and SOAP (messaging) establish the classic interoperable Web Services stack.',
      keywords: ['SOA', 'Publish-Find-Bind', 'WSDL', 'UDDI', 'SOAP', 'Interoperability'],
    },
    {
      section: 'C',
      marks: 8,
      questionText: 'Describe the CORBA architecture and compare it with Web Services.',
      practiceBadge: 'Practice Recommendation',
      introduction:
        'CORBA (Common Object Request Broker Architecture) is a distributed object standard created by the Object Management Group (OMG) to let objects across languages and operating systems communicate transparently.',
      mainExplanation:
        'CORBA relies on OMG IDL (Interface Definition Language) to declare remote object methods neutrally. An IDL compiler generates Client Stubs and Server Skeletons in target languages (C++, Java, Python). At runtime, the client invokes its local Stub; the Object Request Broker (ORB) marshals parameters into Common Data Representation (CDR) and transmits them via IIOP (Internet Inter-ORB Protocol) over TCP. The server’s ORB and Portable Object Adapter (POA) unmarshal the call through the Skeleton to execute the remote object method.',
      examples:
        'A C++ financial terminal invoking risk calculations hosted on a Java enterprise server across an internal corporate LAN.',
      advantages: ['High-speed binary serialization via CDR and IIOP', 'True distributed object-oriented semantics'],
      disadvantages: ['Binary IIOP traffic is often blocked by external firewalls', 'Steep complexity compared to HTTP/JSON APIs'],
      diagramKey: 'u3-corba-arch',
      conclusion:
        'While CORBA excels in tightly controlled binary intranets, HTTP-based Web Services superseded it for open cross-Internet integration.',
      keywords: ['CORBA', 'ORB', 'OMG IDL', 'IIOP', 'Stub & Skeleton', 'POA'],
    },
  ],
  mcqs: [
    {
      questionText: 'Which three interactions form the core Web Services SOA triangle?',
      options: [
        'Compile, Link, Execute',
        'Publish, Find, Bind',
        'Parse, Render, Paint',
        'Encode, Relay, Pop',
      ],
      correctIndex: 1,
      explanation: 'Providers Publish to the registry, Requestors Find services in the registry, and Bind to the provider.',
      difficulty: 'Easy',
    },
    {
      questionText: 'Which element is MANDATORY inside a valid <soap:Envelope>?',
      options: ['<soap:Header>', '<soap:Body>', '<soap:Fault>', '<soap:Signature>'],
      correctIndex: 1,
      explanation: '<soap:Body> is mandatory to carry payload or fault data; Header is optional.',
      difficulty: 'Easy',
    },
    {
      questionText: 'Which section of a WSDL document specifies the concrete network URL where the service can be invoked?',
      options: ['<types>', '<message>', '<portType>', '<service>'],
      correctIndex: 3,
      explanation: 'The <service> section contains <port> elements with the live endpoint address URL.',
      difficulty: 'Medium',
    },
    {
      questionText: 'In UDDI, which pages contain the technical interface specifications and WSDL binding references?',
      options: ['White Pages', 'Yellow Pages', 'Green Pages', 'Blue Pages'],
      correctIndex: 2,
      explanation: 'White = business identity, Yellow = industry categories, Green = technical binding/tModel specs.',
      difficulty: 'Medium',
    },
    {
      questionText: 'What does AJAX stand for?',
      options: [
        'Advanced Java and XML',
        'Asynchronous JavaScript and XML',
        'Automated JSON API Exchange',
        'Active Java Applet Execution',
      ],
      correctIndex: 1,
      explanation: 'AJAX stands for Asynchronous JavaScript and XML, coined by Jesse James Garrett in 2005.',
      difficulty: 'Easy',
    },
    {
      questionText: 'Which XMLHttpRequest readyState indicates that the response is completely received and ready?',
      options: ['1', '2', '3', '4'],
      correctIndex: 3,
      explanation: 'readyState 4 (DONE) signals that the entire HTTP response has finished downloading.',
      difficulty: 'Easy',
    },
    {
      questionText: 'Which technique reduces unnecessary AJAX server calls when a user types rapidly into a search field?',
      options: ['Polling', 'Debouncing', 'Frameset reloading', 'Base64 encoding'],
      correctIndex: 1,
      explanation: 'Debouncing delays sending the AJAX request until typing pauses for a brief interval (e.g., 250ms).',
      difficulty: 'Medium',
    },
    {
      questionText: 'In CORBA, which component translates method calls across networks between client stubs and server skeletons?',
      options: ['Object Request Broker (ORB)', 'UDDI Registry', 'XSLT Processor', 'DNS Resolver'],
      correctIndex: 0,
      explanation: 'The ORB acts as the middleware bus routing remote invocations between stubs and skeletons.',
      difficulty: 'Easy',
    },
    {
      questionText: 'Which protocol does CORBA use to communicate across TCP/IP networks?',
      options: ['SMTP', 'IIOP', 'POP3', 'IMAP'],
      correctIndex: 1,
      explanation: 'IIOP (Internet Inter-ORB Protocol) adapts GIOP for TCP/IP transport.',
      difficulty: 'Medium',
    },
    {
      questionText: 'Why are HTTP-based Web Services generally preferred over CORBA across the public Internet?',
      options: [
        'Web Services do not require IP addresses',
        'HTTP/HTTPS traffic passes cleanly through standard corporate firewalls',
        'CORBA only supports Python',
        'Web Services do not use TCP',
      ],
      correctIndex: 1,
      explanation: 'Firewalls commonly block proprietary IIOP ports used by CORBA, whereas HTTP/HTTPS ports 80/443 are open.',
      difficulty: 'Hard',
    },
  ],
};
