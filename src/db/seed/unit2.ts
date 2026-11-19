import type { SeedUnit } from './types.ts';

export const unit2: SeedUnit = {
  unitNumber: 2,
  slug: 'unit-2-html-css-js-xml',
  title: 'HTML, CSS, JavaScript and XML',
  subtitle: 'Unit 2 · Frontend Document Structure, Dynamic HTML & Structured XML Processing',
  description:
    'Complete coverage of HTML lists, tables, images, forms, frames, CSS & Document Type Definitions, Dynamic HTML (DHTML) with JavaScript, XML Schemas, Object Models, XSLT presentation, and DOM/SAX XML processors.',
  examWeight: '20% Weightage',
  estimatedHours: 8,
  syllabus: [
    'Lists',
    'Tables',
    'Images',
    'Forms',
    'Frames',
    'Dynamic HTML with JavaScript',
    'CSS Document Type Definition',
    'Dynamic HTML',
    'XML Schemes',
    'Object Models',
    'Presenting XML',
    'XML Processors – DOM and SAX',
  ],
  quickRevision: [
    'HTML supports Ordered (<ol>), Unordered (<ul>), and Description (<dl>) lists; Tables use <table>, <thead>, <tr>, <th>, <td> with rowspan/colspan.',
    'Forms collect user input via <form action method="POST"> with <input>, <select>, <textarea>, and HTML5 validation.',
    'Frames (<frameset> legacy vs <iframe> modern) embed independent HTML documents inside viewports.',
    'DHTML = HTML + CSS + JavaScript + DOM working together for client-side interactivity without page reload.',
    'DTD defines legal XML/HTML structure; XML Schema (XSD) adds strict data types (xs:integer, xs:date) and namespaces.',
    'DOM loads entire XML into a tree in memory (read/write); SAX is event-driven streaming (read-only, low memory).',
  ],
  diagrams: [
    {
      diagramKey: 'u2-dhtml-pipeline',
      title: 'Dynamic HTML (DHTML) Event & DOM Manipulation Cycle',
      category: 'Process',
      summary:
        'Demonstrates how User Events trigger JavaScript handlers that mutate the DOM and CSS styles in real time.',
      steps: [
        { step: 1, label: 'Initial DOM + CSS Render', detail: 'Browser loads structured HTML elements and attached CSS rules.' },
        { step: 2, label: 'User Event Fired', detail: 'Click, input, or hover triggers an event listener on a DOM node.' },
        { step: 3, label: 'JavaScript DOM Mutation', detail: 'Script updates element textContent, attributes, or CSS classes.' },
        { step: 4, label: 'Incremental Repaint', detail: 'Browser reflows and repaints only affected regions seamlessly.' },
      ],
    },
    {
      diagramKey: 'u2-xml-schema-xslt',
      title: 'XML Validation (DTD/XSD) and Presentation (XSLT) Pipeline',
      category: 'Flowchart',
      summary:
        'Shows how raw XML is validated against XML Schema (XSD) or DTD and transformed via XSLT into HTML for display.',
      steps: [
        { step: 1, label: 'Raw XML Document', detail: 'Well-formed hierarchical XML data with custom tags.' },
        { step: 2, label: 'Schema / DTD Validation', detail: 'Parser verifies element hierarchy, cardinality, and XSD data types.' },
        { step: 3, label: 'XSLT Stylesheet Mapping', detail: 'XSLT templates match XPath nodes and generate formatted HTML.' },
        { step: 4, label: 'Browser Presentation', detail: 'Styled HTML or CSS-formatted XML displays to the end user.' },
      ],
    },
    {
      diagramKey: 'u2-xml-dom-sax',
      title: 'XML Processors: DOM Tree vs SAX Event Stream',
      category: 'Comparison',
      summary:
        'Visual comparison between in-memory random-access DOM parsing and sequential callback-based SAX streaming.',
      steps: [
        { step: 1, label: 'XML Byte Stream Input', detail: 'Both parsers read XML characters sequentially from disk or network.' },
        { step: 2, label: 'DOM: Build Complete Tree', detail: 'DOM allocates Parent/Child/Text nodes in RAM for random traversal.' },
        { step: 3, label: 'SAX: Emit Stream Events', detail: 'SAX fires startElement(), characters(), endElement() without storing tree.' },
        { step: 4, label: 'Application Consumption', detail: 'DOM allows editing/XPath; SAX excels on multi-gigabyte XML feeds.' },
      ],
    },
  ],
  topics: [
    {
      orderIndex: 1,
      slug: 'html-lists',
      title: 'HTML Lists',
      definition:
        'HTML lists organize related items into ordered sequences (<ol>), unordered bullet groups (<ul>), or term-definition pairs (<dl>).',
      explanation:
        'Lists provide semantic grouping for navigation menus, syllabus outlines, and glossaries. Ordered lists (<ol>) support numbering attributes such as type="1|A|a|I|i" and start. Unordered lists (<ul>) use bullet markers customizable via CSS list-style-type. Description lists (<dl>) pair <dt> (definition term) with <dd> (definition description). Lists can also be nested inside <li> elements.',
      examples: [
        {
          title: 'Ordered, Unordered & Nested Lists',
          description: 'Complete HTML example demonstrating all three list types.',
          code: `<h3>Course Syllabus</h3>
<ol type="I">
  <li>Internet Fundamentals
    <ul>
      <li>HTTP &amp; SMTP</li>
      <li>DNS Resolution</li>
    </ul>
  </li>
  <li>Web Markup</li>
</ol>
<dl>
  <dt>DOM</dt>
  <dd>Document Object Model tree representation.</dd>
</dl>`,
          language: 'html',
        },
      ],
      keyTakeaways: [
        'Use <ol> when sequence matters, <ul> for unordered collections, and <dl> for glossaries.',
        'Nested lists must always be placed inside an <li> element, not directly inside <ul> or <ol>.',
      ],
    },
    {
      orderIndex: 2,
      slug: 'html-tables',
      title: 'HTML Tables',
      definition:
        'HTML tables arrange structured tabular data into rows and columns using <table>, <tr>, <th>, and <td> elements.',
      explanation:
        'Semantic tables separate header rows (<thead>), body data (<tbody>), and summary footers (<tfoot>). Header cells use <th> for bold, centered alignment and screen-reader association via scope="col" or scope="row". Complex layouts span multiple columns using colspan="n" or multiple rows using rowspan="n".',
      examples: [
        {
          title: 'Exam Timetable Using colspan & rowspan',
          description: 'Demonstrates semantic table sections and cell merging.',
          code: `<table border="1">
  <caption>Semester Exam Schedule</caption>
  <thead>
    <tr>
      <th>Unit</th>
      <th colspan="2">Assessment Format</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td rowspan="2">Unit 1 &amp; 2</td>
      <td>Section A</td>
      <td>2 Marks</td>
    </tr>
    <tr>
      <td>Section C</td>
      <td>10 Marks</td>
    </tr>
  </tbody>
</table>`,
          language: 'html',
        },
      ],
      keyTakeaways: [
        'Never use tables for general page layout; reserve them strictly for tabular data.',
        'colspan merges horizontally across columns; rowspan merges vertically across rows.',
      ],
    },
    {
      orderIndex: 3,
      slug: 'html-images',
      title: 'HTML Images',
      definition:
        'HTML embeds raster and vector graphics using the void <img> element and responsive <picture> / <figure> containers.',
      explanation:
        'The <img> tag requires src (image path or URL) and alt (descriptive alternative text for accessibility and broken-image fallback). Explicit width and height attributes prevent Cumulative Layout Shift (CLS) while loading. Semantic captions wrap <img> inside <figure> with <figcaption>. Client-side image maps (<map> and <area>) allow clickable geometric regions on a single image.',
      examples: [
        {
          title: 'Accessible Image with Figure & Caption',
          description: 'Best-practice responsive image markup with alt fallback.',
          code: `<figure>
  <img
    src="/diagrams/http-flow.svg"
    alt="HTTP client-server request and response sequence"
    width="640"
    height="360"
    loading="lazy"
  />
  <figcaption>Fig 2.1: Stateless HTTP Exchange</figcaption>
</figure>`,
          language: 'html',
        },
      ],
      keyTakeaways: [
        'Always provide meaningful alt text for screen readers and SEO.',
        'Use loading="lazy" to defer off-screen image downloads and speed up page load.',
      ],
    },
    {
      orderIndex: 4,
      slug: 'html-forms',
      title: 'HTML Forms',
      definition:
        'HTML forms collect structured user input through interactive controls inside a <form> element and transmit it to a server via GET or POST.',
      explanation:
        'A <form> specifies action (target URL) and method (GET appends parameters to URL; POST sends data in request body). Accessible controls pair <label for="id"> with inputs such as text, email, password, radio, checkbox, date, <select> dropdowns, and <textarea>. HTML5 adds built-in validation attributes including required, minlength, pattern, and type="email".',
      examples: [
        {
          title: 'Student Registration Form Example',
          description: 'Includes labels, radio buttons, select dropdown, and built-in validation.',
          code: `<form action="/api/register" method="POST">
  <label for="studentName">Full Name</label>
  <input id="studentName" name="name" type="text" required />

  <label for="email">University Email</label>
  <input id="email" name="email" type="email" required />

  <label for="unit">Preferred Unit</label>
  <select id="unit" name="unit">
    <option value="1">Unit 1: Internet &amp; WWW</option>
    <option value="2">Unit 2: HTML, JS &amp; XML</option>
  </select>

  <button type="submit">Submit Registration</button>
</form>`,
          language: 'html',
        },
      ],
      keyTakeaways: [
        'Use POST for sensitive or state-changing submissions; GET for idempotent search queries.',
        'Every input should have a matching <label> for keyboard focus and accessibility.',
      ],
    },
    {
      orderIndex: 5,
      slug: 'html-frames',
      title: 'HTML Frames',
      definition:
        'Frames partition a browser window into independent rectangular sub-windows, each loading its own separate HTML document.',
      explanation:
        'Historically, HTML 4 used <frameset> and <frame> (replacing <body>) to keep navigation sidebars fixed while main content scrolled. However, <frameset> broke browser bookmarking, search engine indexing, and printing, and was deprecated in HTML5. Modern web development uses CSS Flexbox/Grid for layouts and <iframe> (inline frame) exclusively when embedding isolated third-party content (such as videos, maps, or sandboxed widgets) with security attributes like sandbox.',
      examples: [
        {
          title: 'Legacy Frameset vs Modern Sandboxed Iframe',
          description: 'Contrast between deprecated HTML4 frameset and HTML5 iframe.',
          code: `<!-- Legacy HTML 4 Frameset (Deprecated in HTML5) -->
<frameset cols="25%,75%">
  <frame src="menu.html" name="navFrame" />
  <frame src="content.html" name="mainFrame" />
</frameset>

<!-- Modern HTML5 Inline Frame -->
<iframe
  src="https://example.edu/diagram.html"
  title="Interactive Protocol Diagram"
  width="100%"
  height="400"
  sandbox="allow-scripts"
></iframe>`,
          language: 'html',
        },
      ],
      keyTakeaways: [
        '<frameset> and <frame> are obsolete in HTML5; only <iframe> remains standard.',
        'Always include a descriptive title and sandbox attribute on <iframe> elements.',
      ],
    },
    {
      orderIndex: 6,
      slug: 'dynamic-html-with-javascript',
      title: 'Dynamic HTML with JavaScript',
      definition:
        'Dynamic HTML with JavaScript uses client-side scripting to respond to user events, validate form input, and manipulate HTML elements and styles after page load.',
      explanation:
        'JavaScript interacts with the page through the Document Object Model (DOM) API—selecting nodes via document.getElementById() or document.querySelector(), attaching listeners with addEventListener(), modifying textContent or innerHTML, and toggling CSS classes via classList. This enables instant client-side validation, collapsible study accordions, and live score calculators without round-trips to the server.',
      examples: [
        {
          title: 'Interactive Topic Toggle & Form Check',
          description: 'Practical JavaScript event handling and DOM update.',
          code: `<button id="toggleBtn">Show Answer</button>
<p id="answerBox" hidden>HTTP is stateless over TCP port 80.</p>

<script>
  const btn = document.getElementById('toggleBtn');
  const box = document.getElementById('answerBox');
  btn.addEventListener('click', () => {
    box.hidden = !box.hidden;
    btn.textContent = box.hidden ? 'Show Answer' : 'Hide Answer';
  });
</script>`,
          language: 'html',
        },
      ],
      keyTakeaways: [
        'Prefer textContent over innerHTML when inserting untrusted text to prevent XSS attacks.',
        'Event delegation attaches a single listener to a parent container for dynamic child lists.',
      ],
      diagramKey: 'u2-dhtml-pipeline',
    },
    {
      orderIndex: 7,
      slug: 'css-document-type-definition',
      title: 'CSS & Document Type Definition (DTD)',
      definition:
        'CSS (Cascading Style Sheets) separates visual presentation from HTML structure, while a Document Type Definition (DTD) declares the formal grammar and rendering mode of an SGML/HTML/XML document.',
      explanation:
        'A Document Type Declaration (such as <!DOCTYPE html> in HTML5 or HTML 4.01 Strict/Transitional DTDs) instructs browsers to parse the document in Standards Mode rather than legacy Quirks Mode—ensuring consistent CSS Box Model calculations. CSS applies rules via selectors (element, .class, #id), specificity hierarchy, and the box model (content, padding, border, margin), supporting inline, internal (<style>), and external (<link rel="stylesheet">) stylesheets.',
      examples: [
        {
          title: 'HTML5 DOCTYPE with CSS Box Model & Flexbox',
          description: 'Ensures Standards Mode CSS rendering across browsers.',
          code: `<!DOCTYPE html>
<html>
<head>
  <style>
    .exam-card {
      box-sizing: border-box;
      padding: 1.5rem;
      border: 1px solid #cbd5e1;
      border-radius: 0.75rem;
      display: flex;
      gap: 1rem;
    }
  </style>
</head>
<body>
  <div class="exam-card">Unit 2 Study Module</div>
</body>
</html>`,
          language: 'html',
        },
      ],
      keyTakeaways: [
        'Without <!DOCTYPE html>, browsers fall back to Quirks Mode, breaking box-model widths.',
        'CSS specificity order: Inline styles > ID selectors > Class/attribute selectors > Element selectors.',
      ],
    },
    {
      orderIndex: 8,
      slug: 'dynamic-html',
      title: 'Dynamic HTML (DHTML)',
      definition:
        'Dynamic HTML (DHTML) is an umbrella architecture combining HTML, CSS, JavaScript, and the DOM to produce animated, interactive web pages on the client side.',
      explanation:
        'DHTML is not a standalone language; rather, it is the synergy of four components: (1) HTML for content structure, (2) CSS for positioning, visibility, and styling, (3) JavaScript for logic and event handling, and (4) the Document Object Model (DOM) exposing every tag as a programmable object. Together they enable drag-and-drop interfaces, animated menus, live filtering, and instant feedback without reloading the browser.',
      examples: [
        {
          title: 'The Four Pillars of DHTML',
          description: 'How each web layer contributes to dynamic client behavior.',
          code: `HTML       -> Semantic content skeleton
CSS        -> Visual appearance, transitions, layout
DOM        -> Tree API bridging markup and code
JavaScript -> Event listeners & state updates`,
          language: 'text',
        },
      ],
      keyTakeaways: [
        'DHTML executes on the client side, reducing server round-trips for UI updates.',
        'Modern SPA frameworks (React, Vue) build directly upon DHTML DOM-manipulation concepts.',
      ],
      diagramKey: 'u2-dhtml-pipeline',
    },
    {
      orderIndex: 9,
      slug: 'xml-schemes',
      title: 'XML Schemas (DTD and XSD)',
      definition:
        'XML Schemas (W3C XSD) formally define the legal building blocks, element ordering, attributes, and strong data types of an XML document.',
      explanation:
        'While an XML document is "well-formed" if it obeys syntax rules (single root, matched closing tags, proper nesting), it is "valid" only if it conforms to a DTD or XML Schema Definition (XSD). Unlike DTD—which uses non-XML syntax and treats almost everything as untyped character data (#PCDATA)—XSD is written in valid XML, supports namespaces, and enforces 40+ built-in types (xs:string, xs:integer, xs:date, xs:decimal) plus cardinality constraints (minOccurs, maxOccurs).',
      examples: [
        {
          title: 'XML Document & Matching XSD Schema',
          description: 'Validating a university question record with strict XSD types.',
          code: `<!-- student.xml -->
<examQuestion id="101">
  <unit>2</unit>
  <marks>10</marks>
</examQuestion>

<!-- question.xsd -->
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
  <xs:element name="examQuestion">
    <xs:complexType>
      <xs:sequence>
        <xs:element name="unit" type="xs:integer" />
        <xs:element name="marks" type="xs:positiveInteger" />
      </xs:sequence>
      <xs:attribute name="id" type="xs:string" use="required" />
    </xs:complexType>
  </xs:element>
</xs:schema>`,
          language: 'xml',
        },
      ],
      comparisonTable: {
        caption: 'DTD vs XML Schema (XSD)',
        headers: ['Feature', 'DTD (Document Type Definition)', 'XSD (XML Schema Definition)'],
        rows: [
          ['Syntax', 'Non-XML SGML-derived syntax', 'Written in standard XML'],
          ['Data Types', 'Weak (#PCDATA, CDATA only)', 'Strong (integer, boolean, date, regex)'],
          ['Namespace Support', 'No native support', 'Full XML Namespace support'],
          ['Extensibility', 'Limited parameter entities', 'Rich type inheritance & reuse'],
        ],
      },
      keyTakeaways: [
        'Well-formed XML follows syntax rules; Valid XML passes DTD or XSD validation.',
        'XSD is preferred in enterprise web services (SOAP/WSDL) because of strong typing and namespaces.',
      ],
      diagramKey: 'u2-xml-schema-xslt',
    },
    {
      orderIndex: 10,
      slug: 'object-models',
      title: 'Object Models (DOM & XML Object Model)',
      definition:
        'An Object Model represents a structured HTML or XML document as an in-memory hierarchy of programmable objects (nodes) that scripts can inspect and modify.',
      explanation:
        'The W3C Document Object Model (DOM) standardizes a platform- and language-neutral tree interface. Every part of an HTML or XML file becomes a Node: Document (root), Element (tags), Attr (attributes), Text (character content), and Comment. Developers traverse relationships using parentNode, childNodes, firstChild, and nextSibling, or mutate the tree using createElement(), appendChild(), and removeChild().',
      examples: [
        {
          title: 'Traversing an XML DOM Tree in JavaScript',
          description: 'Parsing XML string with DOMParser and reading element nodes.',
          code: `const xml = '<course><unit id="2">XML &amp; DHTML</unit></course>';
const doc = new DOMParser().parseFromString(xml, 'text/xml');
const unitNode = doc.getElementsByTagName('unit')[0];
console.log(unitNode.getAttribute('id')); // "2"
console.log(unitNode.textContent);        // "XML & DHTML"`,
          language: 'javascript',
        },
      ],
      keyTakeaways: [
        'DOM provides a standardized object-oriented API across JavaScript, Java, Python, and C#.',
        'Every tag, attribute, and text run is represented as a distinct node in the tree.',
      ],
    },
    {
      orderIndex: 11,
      slug: 'presenting-xml',
      title: 'Presenting XML (CSS and XSLT)',
      definition:
        'Because XML carries pure data without predefined display semantics, CSS or XSLT (Extensible Stylesheet Language Transformations) is used to style or transform XML for human presentation.',
      explanation:
        'Two primary approaches present XML documents: (1) Attaching a CSS stylesheet via <?xml-stylesheet type="text/css" href="style.css"?> formats XML tags directly in-place using display: block and typography rules, though it cannot reorder or compute data. (2) XSLT uses XPath expressions and template rules to transform an XML tree into HTML, SVG, plain text, or another XML dialect, allowing sorting, filtering, and conditional formatting.',
      examples: [
        {
          title: 'XSLT Template Transforming XML into HTML Table Row',
          description: 'Uses xsl:for-each and xsl:value-of to render structured XML.',
          code: `<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:template match="/syllabus">
    <html><body>
      <ul>
        <xsl:for-each select="topic">
          <li><xsl:value-of select="title" /></li>
        </xsl:for-each>
      </ul>
    </body></html>
  </xsl:template>
</xsl:stylesheet>`,
          language: 'xml',
        },
      ],
      keyTakeaways: [
        'CSS styles XML elements directly; XSLT restructures and transforms XML into HTML or other formats.',
        'XSLT relies on XPath to address specific elements and attributes.',
      ],
      diagramKey: 'u2-xml-schema-xslt',
    },
    {
      orderIndex: 12,
      slug: 'xml-processors-dom-and-sax',
      title: 'XML Processors – DOM and SAX',
      definition:
        'XML Processors (parsers) read XML documents, check well-formedness/validity, and expose content to applications—primarily via tree-based DOM or event-driven SAX APIs.',
      explanation:
        'A DOM (Document Object Model) parser loads the entire XML file into memory as a persistent node tree, supporting bidirectional navigation, XPath queries, and in-memory editing—at the cost of high RAM usage for large files. Conversely, SAX (Simple API for XML) is a push-based, event-driven streaming parser. It reads XML sequentially from start to finish and triggers callback methods (startElement, characters, endElement) without retaining the tree in memory, making it ideal for huge multi-gigabyte XML streams.',
      examples: [
        {
          title: 'SAX Event Handler Pattern (Pseudocode)',
          description: 'How SAX notifies callbacks sequentially without building a tree.',
          code: `onStartDocument()
onStartElement("unit", { id: "2" })
  onStartElement("title")
    onCharacters("XML Processors")
  onEndElement("title")
onEndElement("unit")
onEndDocument()`,
          language: 'text',
        },
      ],
      comparisonTable: {
        caption: 'DOM vs SAX XML Processor Comparison',
        headers: ['Criteria', 'DOM Parser', 'SAX Parser'],
        rows: [
          ['Parsing Model', 'Tree-based (loads entire XML in RAM)', 'Event-driven sequential stream'],
          ['Memory Usage', 'High (proportional to document size)', 'Very low (constant memory footprint)'],
          ['Access Pattern', 'Random, bidirectional traversal', 'Sequential forward-only read'],
          ['Modification', 'Supports insert, update, delete nodes', 'Read-only (cannot modify XML directly)'],
          ['Best Use Case', 'Small/medium config files needing edits', 'Large XML feeds, logs, high-throughput'],
        ],
      },
      keyTakeaways: [
        'Use DOM when you need random access or need to modify XML nodes.',
        'Use SAX when processing very large XML files with strict memory limits.',
      ],
      diagramKey: 'u2-xml-dom-sax',
    },
  ],
  questions: [
    {
      section: 'A',
      marks: 2,
      questionText: 'What is the purpose of <!DOCTYPE html> in a web document?',
      practiceBadge: 'Practice Recommendation',
      introduction: '<!DOCTYPE html> is the Document Type Declaration placed as the very first line of an HTML5 file.',
      mainExplanation:
        'It instructs the browser’s rendering engine to use Standards Mode rather than legacy Quirks Mode, ensuring predictable CSS Box Model sizing, margin handling, and layout behavior across all browsers.',
      examples: '<!DOCTYPE html> at line 1 of index.html.',
      advantages: ['Prevents cross-browser Quirks Mode layout bugs'],
      disadvantages: ['Omitting it causes inconsistent width/padding calculations'],
      conclusion: 'Every modern HTML document must begin with <!DOCTYPE html>.',
      keywords: ['DOCTYPE', 'Standards Mode', 'Quirks Mode', 'Box Model'],
    },
    {
      section: 'A',
      marks: 2,
      questionText: 'Distinguish between well-formed XML and valid XML.',
      practiceBadge: 'Practice Recommendation',
      introduction: 'XML parsers evaluate documents at two distinct compliance levels.',
      mainExplanation:
        'Well-formed XML satisfies basic syntax rules: a single root element, properly nested closing tags, case sensitivity, and quoted attributes. Valid XML is well-formed AND conforms to the structural rules and data types defined in an associated DTD or XML Schema (XSD).',
      examples: '<note><to>Student</to></note> is well-formed; it becomes valid once verified against note.xsd.',
      advantages: ['Separates syntactic integrity from domain-specific business schema validation'],
      disadvantages: ['Schema validation adds minor parsing overhead'],
      conclusion: 'All valid XML documents are well-formed, but not all well-formed XML documents are valid.',
      keywords: ['Well-formed', 'Valid XML', 'DTD', 'XSD', 'Single Root'],
    },
    {
      section: 'B',
      marks: 5,
      questionText: 'Explain Dynamic HTML (DHTML) and describe how HTML, CSS, JavaScript, and DOM work together.',
      practiceBadge: 'Practice Recommendation',
      introduction:
        'Dynamic HTML (DHTML) enables interactive, animated client-side web interfaces without requiring full page reloads from a server.',
      mainExplanation:
        'DHTML integrates four core technologies: (1) HTML provides the semantic document markup; (2) CSS controls positioning, colors, visibility, and transitions; (3) the Document Object Model (DOM) exposes every HTML tag and style rule as an addressable tree of objects; and (4) JavaScript registers event listeners (click, keyup, submit) that dynamically update DOM nodes and CSS classes in response to user actions.',
      examples:
        'An expandable exam answer accordion where clicking a button toggles the hidden attribute and updates button text via JavaScript.',
      advantages: ['Instant UI responsiveness', 'Reduced server bandwidth and load'],
      disadvantages: ['Heavy client-side scripts can slow down low-powered devices if poorly optimized'],
      diagramKey: 'u2-dhtml-pipeline',
      conclusion: 'DHTML transformed static hypertext pages into responsive, event-driven web applications.',
      keywords: ['DHTML', 'DOM', 'JavaScript Events', 'CSS', 'Client-side Interactivity'],
    },
    {
      section: 'B',
      marks: 5,
      questionText: 'Compare DTD and XML Schema (XSD) for defining XML structure.',
      practiceBadge: 'Practice Recommendation',
      introduction:
        'Both DTD (Document Type Definition) and XSD (XML Schema Definition) validate the grammar of XML documents.',
      mainExplanation:
        'DTD uses an older non-XML syntax inherited from SGML, lacks native support for XML Namespaces, and provides only basic text types (#PCDATA, CDATA). XSD, standardized by W3C, is itself written in XML, fully supports namespaces, and enforces over 40 strict built-in data types (xs:integer, xs:decimal, xs:date, xs:boolean) along with occurrence bounds (minOccurs, maxOccurs) and regex patterns.',
      examples:
        'Validating <marks>10</marks> as xs:positiveInteger in XSD prevents invalid strings like <marks>ten</marks>, whereas DTD cannot enforce numeric types.',
      advantages: ['XSD: Strong typing, XML syntax, namespace compatibility'],
      disadvantages: ['XSD schemas are more verbose than compact DTD declarations'],
      diagramKey: 'u2-xml-schema-xslt',
      conclusion: 'XSD is the industry standard for modern data exchange and web services, while DTD remains in legacy systems.',
      keywords: ['DTD', 'XSD', 'Data Types', 'Namespaces', 'Validation'],
    },
    {
      section: 'C',
      marks: 10,
      questionText: 'Compare DOM and SAX XML processors in detail with architecture diagrams, use cases, and trade-offs.',
      practiceBadge: 'Practice Recommendation',
      introduction:
        'XML Processors parse raw XML streams so software applications can read, validate, and act upon structured data. The two primary processing models are DOM (Document Object Model) and SAX (Simple API for XML).',
      mainExplanation:
        'A DOM parser reads the entire XML document into memory and constructs a complete hierarchical tree of Element, Attribute, and Text objects. Applications can traverse forwards, backwards, jump randomly via XPath, and insert or delete nodes. However, DOM consumes memory roughly 4–5x the size of the raw XML file. In contrast, a SAX parser operates as a sequential, event-driven stream processor. It scans XML from top to bottom and invokes registered callback handlers—such as startDocument(), startElement(), characters(), and endElement()—without retaining past nodes in RAM. SAX is read-only and forward-only, making random backward lookups inconvenient unless the application caches specific tags.',
      examples:
        'Use DOM for editing a 50 KB configuration XML; use SAX for extracting records from a 2 GB server log or catalog export.',
      advantages: [
        'DOM: Full random access, XPath support, read/write tree modification',
        'SAX: Minimal constant memory usage, starts processing immediately while streaming',
      ],
      disadvantages: [
        'DOM: High memory footprint; OutOfMemory risks on huge files',
        'SAX: Read-only, forward-only; complex state tracking for nested queries',
      ],
      diagramKey: 'u2-xml-dom-sax',
      conclusion:
        'Selecting between DOM and SAX depends on document size and whether in-memory mutation or streaming efficiency is prioritized.',
      keywords: ['DOM', 'SAX', 'Tree-based', 'Event-driven', 'Memory Footprint', 'Callbacks'],
    },
    {
      section: 'C',
      marks: 8,
      questionText: 'Write and explain an HTML5 registration form combined with JavaScript validation and CSS styling.',
      practiceBadge: 'Practice Recommendation',
      introduction:
        'Interactive forms are the primary mechanism for capturing user data on the Web, combining semantic HTML controls, CSS layout styling, and JavaScript validation.',
      mainExplanation:
        'An accessible form wraps inputs inside <form action="..." method="POST"> with explicit <label for="..."> associations. Controls include text/email fields, radio buttons sharing a name attribute, checkboxes, <select> menus, and submit buttons. CSS styles spacing, focus rings, and error borders, while JavaScript intercepts the submit event via event.preventDefault() to validate email formats, password lengths, or custom rules before transmission.',
      examples:
        'Validating that a university roll number matches /^[A-Z]{2}[0-9]{4}$/ using JavaScript before showing a confirmation banner.',
      advantages: ['Immediate user feedback without waiting for server error pages', 'Structured accessible input'],
      disadvantages: ['Client-side JavaScript validation can be bypassed; server-side validation is still mandatory'],
      diagramKey: 'u2-dhtml-pipeline',
      conclusion:
        'Combining semantic HTML forms, CSS clarity, and dual client/server validation creates secure and user-friendly web workflows.',
      keywords: ['<form>', 'POST vs GET', '<label>', 'preventDefault', 'Client Validation'],
    },
  ],
  mcqs: [
    {
      questionText: 'Which HTML element is used to create a term-and-description glossary list?',
      options: ['<ul>', '<ol>', '<dl>', '<list>'],
      correctIndex: 2,
      explanation: '<dl> defines a description list containing <dt> (term) and <dd> (description) pairs.',
      difficulty: 'Easy',
    },
    {
      questionText: 'In an HTML table, which attribute merges a single cell vertically across multiple rows?',
      options: ['colspan', 'rowspan', 'cellmerge', 'verticalspan'],
      correctIndex: 1,
      explanation: 'rowspan="n" extends a table cell vertically across n rows; colspan merges horizontally.',
      difficulty: 'Easy',
    },
    {
      questionText: 'Why was the <frameset> element deprecated in HTML5?',
      options: [
        'It cannot display text',
        'It breaks URL bookmarking, printing, and accessibility',
        'It requires Java installed in the browser',
        'It only works with XML files',
      ],
      correctIndex: 1,
      explanation: '<frameset> caused navigation, bookmarking, and SEO issues; modern layouts use CSS Grid/Flexbox and <iframe>.',
      difficulty: 'Medium',
    },
    {
      questionText: 'Which combination accurately represents the four core technologies behind Dynamic HTML (DHTML)?',
      options: [
        'HTML, CSS, JavaScript, and DOM',
        'HTTP, SMTP, POP3, and DNS',
        'SOAP, WSDL, UDDI, and CORBA',
        'XML, SAX, XSD, and RSS',
      ],
      correctIndex: 0,
      explanation: 'DHTML combines HTML structure, CSS styling, JavaScript logic, and the DOM API.',
      difficulty: 'Easy',
    },
    {
      questionText: 'What happens if <!DOCTYPE html> is omitted from an HTML document?',
      options: [
        'The server refuses to send the file',
        'Browsers may enter Quirks Mode with inconsistent CSS box model rendering',
        'JavaScript is automatically disabled',
        'All images fail to load',
      ],
      correctIndex: 1,
      explanation: 'Without a DOCTYPE declaration, browsers enter Quirks Mode for backward compatibility with 1990s pages.',
      difficulty: 'Medium',
    },
    {
      questionText: 'Which advantage does XML Schema (XSD) have over Document Type Definition (DTD)?',
      options: [
        'XSD is written in non-XML binary code',
        'XSD supports strong data types (e.g., xs:integer, xs:date) and XML namespaces',
        'XSD does not require closing tags',
        'XSD replaces HTTP for file transfers',
      ],
      correctIndex: 1,
      explanation: 'XSD uses XML syntax, supports namespaces, and enforces rich primitive and custom data types.',
      difficulty: 'Medium',
    },
    {
      questionText: 'Which technology transforms an XML document into an HTML page using XPath template rules?',
      options: ['XSLT', 'SAX', 'MIME', 'CGI'],
      correctIndex: 0,
      explanation: 'XSLT (Extensible Stylesheet Language Transformations) converts XML into HTML or other XML formats.',
      difficulty: 'Easy',
    },
    {
      questionText: 'Which XML processor loads the entire XML document into RAM as a modifiable tree?',
      options: ['SAX', 'DOM', 'StAX', 'SMTP'],
      correctIndex: 1,
      explanation: 'DOM builds a full in-memory tree allowing random access and modification.',
      difficulty: 'Easy',
    },
    {
      questionText: 'When should a developer choose a SAX parser instead of a DOM parser?',
      options: [
        'When the application must edit and save back small XML nodes',
        'When streaming multi-gigabyte XML files under tight memory constraints',
        'When random backward XPath traversal is needed',
        'When rendering CSS animations in a browser',
      ],
      correctIndex: 1,
      explanation: 'SAX processes XML sequentially via events with near-constant memory usage, ideal for massive read-only streams.',
      difficulty: 'Medium',
    },
    {
      questionText: 'Which <form> HTTP method appends form field values directly into the URL query string?',
      options: ['POST', 'PUT', 'GET', 'DELETE'],
      correctIndex: 2,
      explanation: 'GET encodes form parameters in the URL query string (?key=value), making it suitable for searches rather than passwords.',
      difficulty: 'Easy',
    },
  ],
};
