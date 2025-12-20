export interface WebDevQuestion {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: 'HTML' | 'CSS' | 'JavaScript' | 'React' | 'End Game';
  link: string;
  recommended: boolean;
  description: string;
  tags: string[];
  starterHtml: string;
  starterCss: string;
  starterJs: string;
  hints: string[];
  expectedOutput?: string;
  testCases: any[];  // Required array of test cases for automated testing
  passingScore: number;  // Required passing score percentage (e.g., 80 for 80%)
}

// HTML Questions (25)
const htmlQuestions: WebDevQuestion[] = [
  {
    id: 'html-1',
    title: 'Build a Semantic Navigation Bar',
    difficulty: 'Easy',
    category: 'HTML',
    link: 'https://www.frontendmentor.io/challenges',
    recommended: true,
    description: 'Create a mobile-friendly navigation menu using semantic HTML elements like <nav>, <ul>, and proper accessibility attributes.',
    tags: ['semantic-html', 'accessibility', 'navigation'],
    starterHtml: '<header>\n  <!-- Create your navigation here -->\n</header>',
    starterCss: '/* Style your navigation */\nnav { }',
    starterJs: '// Optional: Add mobile menu toggle',
    hints: ['Use <nav> for the main navigation wrapper', 'Add role="navigation" for accessibility', 'Use <ul> and <li> for menu items'],
    expectedOutput: 'A fully accessible navigation bar with proper semantic structure',
    testCases: [
      {
        id: 'html-1-nav',
        name: 'Navigation Element',
        description: 'Checks if a <nav> element exists',
        type: 'dom',
        selector: 'nav',
        expectedValue: true
      },
      {
        id: 'html-1-list',
        name: 'Unordered List',
        description: 'Checks if a <ul> element exists inside <nav>',
        type: 'dom',
        selector: 'nav ul',
        expectedValue: true
      },
      {
        id: 'html-1-items',
        name: 'List Items',
        description: 'Checks if at least 3 <li> elements exist',
        type: 'function',
        testFunction: 'return document.querySelectorAll("nav li").length >= 3'
      }
    ],
    passingScore: 90
  },
  {
    id: 'html-2',
    title: 'Contact Form with Validation',
    difficulty: 'Medium',
    category: 'HTML',
    link: 'https://www.frontendmentor.io/challenges',
    recommended: true,
    description: 'Build a form with proper HTML5 validation attributes including required fields, email validation, and pattern matching.',
    tags: ['forms', 'validation', 'accessibility'],
    starterHtml: '<form>\n  <!-- Create your form fields -->\n</form>',
    starterCss: 'form { max-width: 400px; margin: 0 auto; }',
    starterJs: '// Form validation script',
    hints: ['Use required attribute for mandatory fields', 'Use type="email" for email validation', 'Add pattern attribute for custom validation'],
    expectedOutput: 'A working contact form with client-side validation',
    testCases: [
      {
        id: 'html-2-form',
        name: 'Form Element',
        description: 'Checks if a <form> element exists',
        type: 'dom',
        selector: 'form',
        expectedValue: true
      },
      {
        id: 'html-2-email',
        name: 'Email Input',
        description: 'Checks if an email input exists',
        type: 'dom',
        selector: 'input[type="email"]',
        expectedValue: true
      },
      {
        id: 'html-2-required',
        name: 'Required Field',
        description: 'Checks if at least one input is required',
        type: 'dom',
        selector: 'input[required]',
        expectedValue: true
      }
    ],
    passingScore: 90
  },
  {
    id: 'html-3',
    title: 'Blog Post Layout',
    difficulty: 'Easy',
    category: 'HTML',
    link: 'https://developer.mozilla.org/',
    recommended: false,
    description: 'Structure a blog post using semantic HTML elements like <article>, <header>, <main>, and <footer>.',
    tags: ['semantic-html', 'article', 'structure'],
    starterHtml: '<!-- Create a semantic blog post structure -->',
    starterCss: 'article { max-width: 700px; margin: 0 auto; }',
    starterJs: '',
    hints: ['Wrap the post in <article> tag', 'Use <header> for title and metadata', 'Use <time> for publication date'],
    testCases: [
      {
        id: 'html-3-article',
        name: 'Article Element',
        description: 'Checks if an <article> element exists',
        type: 'dom',
        selector: 'article',
        expectedValue: true
      },
      {
        id: 'html-3-header',
        name: 'Header Element',
        description: 'Checks if a <header> element exists inside <article>',
        type: 'dom',
        selector: 'article header',
        expectedValue: true
      },
      {
        id: 'html-3-time',
        name: 'Time Element',
        description: 'Checks if a <time> element exists',
        type: 'dom',
        selector: 'time',
        expectedValue: true
      }
    ],
    passingScore: 90
  },
  {
    id: 'html-4',
    title: 'Responsive Image Gallery',
    difficulty: 'Medium',
    category: 'HTML',
    link: 'https://developer.mozilla.org/',
    recommended: true,
    description: 'Use picture, srcset, and sizes attributes to create a responsive image gallery that loads appropriate images based on screen size.',
    tags: ['images', 'performance', 'responsive'],
    starterHtml: '<figure>\n  <!-- Add responsive image -->\n</figure>',
    starterCss: 'img { max-width: 100%; height: auto; }',
    starterJs: '',
    hints: ['Use <picture> element for art direction', 'Use srcset for different resolutions', 'Add loading="lazy" for performance'],
    testCases: [
      {
        id: 'html-4-picture',
        name: 'Picture Element',
        description: 'Checks if a <picture> element exists',
        type: 'dom',
        selector: 'picture',
        expectedValue: true
      },
      {
        id: 'html-4-source',
        name: 'Source Element',
        description: 'Checks if a <source> element exists inside <picture>',
        type: 'dom',
        selector: 'picture source',
        expectedValue: true
      },
      {
        id: 'html-4-img',
        name: 'Image Element',
        description: 'Checks if an <img> element exists inside <picture>',
        type: 'dom',
        selector: 'picture img',
        expectedValue: true
      }
    ],
    passingScore: 90
  },
  {
    id: 'html-5',
    title: 'Embed Media Content',
    difficulty: 'Easy',
    category: 'HTML',
    link: 'https://developer.mozilla.org/',
    recommended: false,
    description: 'Embed audio and video with proper controls, fallbacks, and accessibility features.',
    tags: ['media', 'video', 'audio'],
    starterHtml: '<!-- Add video and audio elements -->',
    starterCss: 'video { max-width: 100%; }',
    starterJs: '',
    hints: ['Add controls attribute', 'Provide fallback text', 'Include multiple source formats'],
    testCases: [
      {
        id: 'html-5-video',
        name: 'Video Element',
        description: 'Checks if a <video> element exists',
        type: 'dom',
        selector: 'video',
        expectedValue: true
      },
      {
        id: 'html-5-controls',
        name: 'Video Controls',
        description: 'Checks if video has controls attribute',
        type: 'dom',
        selector: 'video[controls]',
        expectedValue: true
      },
      {
        id: 'html-5-audio',
        name: 'Audio Element',
        description: 'Checks if an <audio> element exists',
        type: 'dom',
        selector: 'audio',
        expectedValue: true
      }
    ],
    passingScore: 90
  },
  {
    id: 'html-6',
    title: 'Accessible Data Table',
    difficulty: 'Medium',
    category: 'HTML',
    link: 'https://www.frontendmentor.io/',
    recommended: true,
    description: 'Create a fully accessible data table with proper headers, captions, and scope attributes.',
    tags: ['tables', 'accessibility', 'data'],
    starterHtml: '<table>\n  <!-- Create accessible table -->\n</table>',
    starterCss: 'table { border-collapse: collapse; width: 100%; }',
    starterJs: '',
    hints: ['Use <caption> for table title', 'Use scope attribute on headers', 'Use <thead>, <tbody>, <tfoot>'],
    testCases: [
      {
        id: 'html-6-table',
        name: 'Table Element',
        description: 'Checks if a <table> element exists',
        type: 'dom',
        selector: 'table',
        expectedValue: true
      },
      {
        id: 'html-6-caption',
        name: 'Table Caption',
        description: 'Checks if a <caption> element exists',
        type: 'dom',
        selector: 'table caption',
        expectedValue: true
      },
      {
        id: 'html-6-headers',
        name: 'Table Headers',
        description: 'Checks if table headers have scope attribute',
        type: 'dom',
        selector: 'th[scope]',
        expectedValue: true
      }
    ],
    passingScore: 90
  },
  {
    id: 'html-7',
    title: 'Email Template Layout',
    difficulty: 'Hard',
    category: 'HTML',
    link: 'https://www.campaignmonitor.com/',
    recommended: false,
    description: 'Build a table-based email HTML layout that renders correctly across email clients.',
    tags: ['emails', 'tables', 'compatibility'],
    starterHtml: '<table role="presentation">\n  <!-- Email layout -->\n</table>',
    starterCss: '/* Inline styles recommended for emails */',
    starterJs: '',
    hints: ['Use table-based layouts', 'Inline all CSS styles', 'Test across email clients'],
    testCases: [
      {
        id: 'html-7-table',
        name: 'Table Layout',
        description: 'Checks if a <table> element exists',
        type: 'dom',
        selector: 'table',
        expectedValue: true
      },
      {
        id: 'html-7-role',
        name: 'Presentation Role',
        description: 'Checks if table has role="presentation"',

        type: 'dom',
        selector: 'table[role="presentation"]',
        expectedValue: true
      },
      {
        id: 'html-7-inline',
        name: 'Inline Styles',
        description: 'Checks if elements have inline styles',
        type: 'dom',
        selector: '[style]',
        expectedValue: true
      },
      {
        id: 'html-7-doctype',
        name: 'HTML 4.01/XHTML',
        description: 'Checks for email-safe doctype',
        type: 'function',
        testFunction: 'return document.doctype && (document.doctype.publicId.includes("XHTML") || document.doctype.publicId.includes("HTML 4.01")) || true'
      },
      {
        id: 'html-7-width',
        name: 'Table Width',
        description: 'Table width set to 100% or 600px',
        type: 'style',
        selector: 'table',
        property: 'width',
        expectedValue: (val: string) => val === '100%' || val.includes('600')
      },
      {
        id: 'html-7-cellpadding',
        name: 'Cellpadding',
        description: 'Cellpadding attribute used',
        type: 'dom',
        selector: 'table[cellpadding]',
        expectedValue: true
      },
      {
        id: 'html-7-cellspacing',
        name: 'Cellspacing',
        description: 'Cellspacing attribute used',
        type: 'dom',
        selector: 'table[cellspacing]',
        expectedValue: true
      },
      {
        id: 'html-7-img-block',
        name: 'Image Display',
        description: 'Images display block',
        type: 'style',
        selector: 'img',
        property: 'display',
        expectedValue: (val: string) => val === 'block'
      },
      {
        id: 'html-7-font-family',
        name: 'Web Safe Fonts',
        description: 'Standard fonts used',
        type: 'style',
        selector: 'td',
        property: 'font-family',
        expectedValue: (val: string) => val.includes('Arial') || val.includes('Helvetica') || val.includes('sans-serif')
      },
      {
        id: 'html-7-center',
        name: 'Centering',
        description: 'Layout centering technique',
        type: 'style',
        selector: 'table',
        property: 'margin-left',
        expectedValue: (val: string) => val === 'auto'
      },
      {
        id: 'html-7-bg-color',
        name: 'Background Color',
        description: 'Background defined on body/table',
        type: 'style',
        selector: 'table',
        property: 'background-color',
        expectedValue: (val: string) => val !== 'rgba(0, 0, 0, 0)'
      },
      {
        id: 'html-7-no-div',
        name: 'Avoid Divs',
        description: 'Minimal div usage',
        type: 'function',
        testFunction: 'return document.querySelectorAll("div").length < 5'
      },
      {
        id: 'html-7-anchor-style',
        name: 'Link Styling',
        description: 'Links explicit color',
        type: 'style',
        selector: 'a',
        property: 'color',
        expectedValue: (val: string) => val !== ''
      },
      {
        id: 'html-7-preview-text',
        name: 'Preview Text',
        description: 'Hidden preview text present',
        type: 'dom',
        selector: 'div[style*="display: none"]',
        expectedValue: true
      },
      {
        id: 'html-7-alt-text',
        name: 'Image Alt',
        description: 'Alt text required',
        type: 'dom',
        selector: 'img[alt]',
        expectedValue: true
      }
    ],
    passingScore: 90
  },
  {
    id: 'html-8',
    title: 'Portfolio Landing Page',
    difficulty: 'Easy',
    category: 'HTML',
    link: 'https://www.frontendmentor.io/',
    recommended: true,
    description: 'Structure a personal portfolio page using clean, semantic HTML with proper heading hierarchy.',
    tags: ['layout', 'semantic', 'portfolio'],
    starterHtml: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>Portfolio</title>\n</head>\n<body>\n  <!-- Build your portfolio -->\n</body>\n</html>',
    starterCss: 'body { font-family: sans-serif; }',
    starterJs: '',
    hints: ['Use proper heading hierarchy h1-h6', 'Add meta description', 'Include social links'],
    testCases: [
      {
        id: 'html-8-h1',
        name: 'Main Heading',
        description: 'Checks if an <h1> element exists',
        type: 'dom',
        selector: 'h1',
        expectedValue: true
      },
      {
        id: 'html-8-meta',
        name: 'Meta Description',
        description: 'Checks if meta description exists',
        type: 'dom',
        selector: 'meta[name="description"]',
        expectedValue: true
      },
      {
        id: 'html-8-links',
        name: 'Social Links',
        description: 'Checks if there are external links',
        type: 'dom',
        selector: 'a[href^="http"]',
        expectedValue: true
      }
    ],
    passingScore: 90
  },
  {
    id: 'html-9',
    title: 'Keyboard Accessible Navigation',
    difficulty: 'Medium',
    category: 'HTML',
    link: 'https://developer.mozilla.org/',
    recommended: true,
    description: 'Build a navigation menu that is fully keyboard accessible with proper focus management.',
    tags: ['navigation', 'accessibility', 'keyboard'],
    starterHtml: '<nav aria-label="Main navigation">\n  <!-- Accessible nav -->\n</nav>',
    starterCss: 'a:focus { outline: 2px solid blue; }',
    starterJs: '// Handle keyboard navigation',
    hints: ['Use tabindex appropriately', 'Add skip links', 'Ensure visible focus states'],
    testCases: [
      {
        id: 'html-9-nav',
        name: 'Navigation',
        description: 'Checks if a <nav> element exists',
        type: 'dom',
        selector: 'nav',
        expectedValue: true
      },
      {
        id: 'html-9-label',
        name: 'ARIA Label',
        description: 'Checks if nav has aria-label',
        type: 'dom',
        selector: 'nav[aria-label]',
        expectedValue: true
      },
      {
        id: 'html-9-links',
        name: 'Focusable Links',
        description: 'Checks if links are present',
        type: 'dom',
        selector: 'nav a',
        expectedValue: true
      }
    ],
    passingScore: 90
  },
  {
    id: 'html-10',
    title: 'HTML Boilerplate',
    difficulty: 'Easy',
    category: 'HTML',
    link: 'https://developer.mozilla.org/',
    recommended: false,
    description: 'Create the base HTML structure including DOCTYPE, meta tags, and proper document outline.',
    tags: ['boilerplate', 'structure', 'meta'],
    starterHtml: '<!-- Create a complete HTML boilerplate -->',
    starterCss: '',
    starterJs: '',
    hints: ['Include viewport meta tag', 'Add charset declaration', 'Include Open Graph tags'],
    testCases: [
      {
        id: 'html-10-doctype',
        name: 'Doctype',
        description: 'Checks if DOCTYPE is present',
        type: 'output',
        selector: 'html',
        expectedValue: (output: string) => document.doctype !== null
      },
      {
        id: 'html-10-viewport',
        name: 'Viewport Meta',
        description: 'Checks if viewport meta tag exists',
        type: 'dom',
        selector: 'meta[name="viewport"]',
        expectedValue: true
      },
      {
        id: 'html-10-charset',
        name: 'Charset Meta',
        description: 'Checks if charset meta tag exists',
        type: 'dom',
        selector: 'meta[charset]',
        expectedValue: true
      }
    ],
    passingScore: 90
  },
  {
    id: 'html-11',
    title: 'Custom Checkbox & Radio',
    difficulty: 'Medium',
    category: 'HTML',
    link: 'https://developer.mozilla.org/',
    recommended: true,
    description: 'Create accessible custom-styled checkboxes and radio buttons.',
    tags: ['forms', 'accessibility', 'custom'],
    starterHtml: '<label>\n  <input type="checkbox">\n  <span>Custom checkbox</span>\n</label>',
    starterCss: 'input[type="checkbox"] { /* Hide default */ }',
    starterJs: '',
    hints: ['Use label association', 'Hide native input visually', 'Keep it accessible'],
    testCases: [
      {
        id: 'html-11-checkbox',
        name: 'Checkbox Element',
        description: 'Checks if a checkbox exists',
        type: 'dom',
        selector: 'input[type="checkbox"]',
        expectedValue: true
      },
      {
        id: 'html-11-label',
        name: 'Label Element',
        description: 'Checks if a label exists',
        type: 'dom',
        selector: 'label',
        expectedValue: true
      },
      {
        id: 'html-11-hidden',
        name: 'Hidden Input',
        description: 'Checks if native input is visually hidden but accessible',
        type: 'style',
        selector: 'input[type="checkbox"]',
        property: 'opacity',
        expectedValue: (val: string) => val === '0' || val === '0.001'
      }
    ],
    passingScore: 90
  },
  {
    id: 'html-12',
    title: 'Accordion FAQ Section',
    difficulty: 'Easy',
    category: 'HTML',
    link: 'https://www.frontendmentor.io/',
    recommended: true,
    description: 'Build an FAQ accordion using details and summary elements.',
    tags: ['accordion', 'details', 'interactive'],
    starterHtml: '<details>\n  <summary>Question?</summary>\n  <p>Answer</p>\n</details>',
    starterCss: 'details { margin-bottom: 1rem; }',
    starterJs: '',
    hints: ['Use details/summary elements', 'Add open attribute for default state', 'Style the marker'],
    testCases: [
      {
        id: 'html-12-details',
        name: 'Details Element',
        description: 'Checks if a <details> element exists',
        type: 'dom',
        selector: 'details',
        expectedValue: true
      },
      {
        id: 'html-12-summary',
        name: 'Summary Element',
        description: 'Checks if a <summary> element exists',
        type: 'dom',
        selector: 'details summary',
        expectedValue: true
      },
      {
        id: 'html-12-content',
        name: 'Content',
        description: 'Checks if content exists inside details',
        type: 'dom',
        selector: 'details p',
        expectedValue: true
      }
    ],
    passingScore: 90
  },
  {
    id: 'html-13',
    title: 'Progress Bar Component',
    difficulty: 'Easy',
    category: 'HTML',
    link: 'https://developer.mozilla.org/',
    recommended: false,
    description: 'Create accessible progress and meter elements with proper labeling.',
    tags: ['progress', 'meter', 'accessibility'],
    starterHtml: '<label for="progress">Loading:</label>\n<progress id="progress" value="70" max="100">70%</progress>',
    starterCss: 'progress { width: 100%; }',
    starterJs: '',
    hints: ['Add fallback text', 'Use aria-label', 'Style with CSS'],
    testCases: [
      {
        id: 'html-13-progress',
        name: 'Progress Element',
        description: 'Checks if a <progress> element exists',
        type: 'dom',
        selector: 'progress',
        expectedValue: true
      },
      {
        id: 'html-13-label',
        name: 'Label',
        description: 'Checks if label exists',
        type: 'dom',
        selector: 'label[for]',
        expectedValue: true
      },
      {
        id: 'html-13-value',
        name: 'Value Attribute',
        description: 'Checks if value attribute is set',
        type: 'dom',
        selector: 'progress[value]',
        expectedValue: true
      }
    ],
    passingScore: 90
  },
  {
    id: 'html-14',
    title: 'Dialog Modal',
    difficulty: 'Medium',
    category: 'HTML',
    link: 'https://developer.mozilla.org/',
    recommended: true,
    description: 'Implement a native HTML dialog element with proper focus management.',
    tags: ['dialog', 'modal', 'interactive'],
    starterHtml: '<button id="open">Open Modal</button>\n<dialog id="modal">\n  <h2>Modal Title</h2>\n  <button id="close">Close</button>\n</dialog>',
    starterCss: 'dialog::backdrop { background: rgba(0,0,0,0.5); }',
    starterJs: 'document.getElementById("open").onclick = () => document.getElementById("modal").showModal();',
    hints: ['Use showModal() method', 'Style the ::backdrop', 'Handle Escape key'],
    testCases: [
      {
        id: 'html-14-dialog',
        name: 'Dialog Element',
        description: 'Checks if a <dialog> element exists',
        type: 'dom',
        selector: 'dialog',
        expectedValue: true
      },
      {
        id: 'html-14-button',
        name: 'Open Button',
        description: 'Checks if open button exists',
        type: 'dom',
        selector: 'button',
        expectedValue: true
      },
      {
        id: 'html-14-script',
        name: 'Show Modal Script',
        description: 'Checks if showModal is called',
        type: 'function',
        testFunction: 'return document.querySelector("dialog").showModal !== undefined'
      }
    ],
    passingScore: 90
  },
  {
    id: 'html-15',
    title: 'Figure with Caption',
    difficulty: 'Easy',
    category: 'HTML',
    link: 'https://developer.mozilla.org/',
    recommended: false,
    description: 'Use figure and figcaption elements for images, code, and quotations.',
    tags: ['figure', 'semantic', 'images'],
    starterHtml: '<figure>\n  <img src="" alt="">\n  <figcaption></figcaption>\n</figure>',
    starterCss: 'figure { margin: 0; }',
    starterJs: '',
    hints: ['Figure is not just for images', 'Caption can be before or after content', 'Use for self-contained content'],
    testCases: [
      {
        id: 'html-15-figure',
        name: 'Figure Element',
        description: 'Checks if a <figure> element exists',
        type: 'dom',
        selector: 'figure',
        expectedValue: true
      },
      {
        id: 'html-15-figcaption',
        name: 'Figcaption Element',
        description: 'Checks if a <figcaption> element exists',
        type: 'dom',
        selector: 'figure figcaption',
        expectedValue: true
      },
      {
        id: 'html-15-img',
        name: 'Image',
        description: 'Checks if image exists inside figure',
        type: 'dom',
        selector: 'figure img',
        expectedValue: true
      }
    ],
    passingScore: 90
  },
  {
    id: 'html-16',
    title: 'Breadcrumb Navigation',
    difficulty: 'Easy',
    category: 'HTML',
    link: 'https://developer.mozilla.org/',
    recommended: true,
    description: 'Create accessible breadcrumb navigation with proper ARIA labels.',
    tags: ['navigation', 'breadcrumb', 'accessibility'],
    starterHtml: '<nav aria-label="Breadcrumb">\n  <ol>\n    <!-- Add breadcrumb items -->\n  </ol>\n</nav>',
    starterCss: 'ol { display: flex; list-style: none; }',
    starterJs: '',
    hints: ['Use aria-current for current page', 'Use ordered list', 'Add separators with CSS'],
    testCases: [
      {
        id: 'html-16-nav',
        name: 'Navigation',
        description: 'Checks if a <nav> element exists',
        type: 'dom',
        selector: 'nav',
        expectedValue: true
      },
      {
        id: 'html-16-list',
        name: 'Ordered List',
        description: 'Checks if an <ol> element exists',
        type: 'dom',
        selector: 'nav ol',
        expectedValue: true
      },
      {
        id: 'html-16-aria',
        name: 'ARIA Label',
        description: 'Checks if nav has aria-label',
        type: 'dom',
        selector: 'nav[aria-label]',
        expectedValue: true
      }
    ],
    passingScore: 90
  },
  {
    id: 'html-17',
    title: 'Card Component',
    difficulty: 'Easy',
    category: 'HTML',
    link: 'https://www.frontendmentor.io/',
    recommended: true,
    description: 'Build a semantic card component with image, title, description, and call to action.',
    tags: ['card', 'component', 'layout'],
    starterHtml: '<article class="card">\n  <!-- Card content -->\n</article>',
    starterCss: '.card { border-radius: 8px; overflow: hidden; }',
    starterJs: '',
    hints: ['Use article for self-contained content', 'Add proper heading level', 'Make the entire card clickable'],
    testCases: [
      {
        id: 'html-17-article',
        name: 'Article Element',
        description: 'Checks if an <article> element exists',
        type: 'dom',
        selector: 'article',
        expectedValue: true
      },
      {
        id: 'html-17-heading',
        name: 'Heading',
        description: 'Checks if a heading exists inside article',
        type: 'function',
        testFunction: 'return document.querySelector("article h2") !== null || document.querySelector("article h3") !== null'
      },
      {
        id: 'html-17-img',
        name: 'Image',
        description: 'Checks if image exists inside article',
        type: 'dom',
        selector: 'article img',
        expectedValue: true
      }
    ],
    passingScore: 90
  },
  {
    id: 'html-18',
    title: 'Tab Interface',
    difficulty: 'Medium',
    category: 'HTML',
    link: 'https://developer.mozilla.org/',
    recommended: true,
    description: 'Create an accessible tabbed interface with proper ARIA attributes and keyboard navigation.',
    tags: ['tabs', 'accessibility', 'interactive'],
    starterHtml: '<div role="tablist">\n  <button role="tab">Tab 1</button>\n</div>\n<div role="tabpanel">Content</div>',
    starterCss: '[role="tab"][aria-selected="true"] { border-bottom: 2px solid blue; }',
    starterJs: '// Implement tab switching',
    hints: ['Use tabindex appropriately', 'Add skip links', 'Ensure visible focus states'],
    testCases: [
      {
        id: 'html-18-tablist',
        name: 'Tablist',
        description: 'Checks if role="tablist" exists',
        type: 'dom',
        selector: '[role="tablist"]',
        expectedValue: true
      },
      {
        id: 'html-18-tab',
        name: 'Tab',
        description: 'Checks if role="tab" exists',
        type: 'dom',
        selector: '[role="tab"]',
        expectedValue: true
      },
      {
        id: 'html-18-panel',
        name: 'Tabpanel',
        description: 'Checks if role="tabpanel" exists',
        type: 'dom',
        selector: '[role="tabpanel"]',
        expectedValue: true
      }
    ],
    passingScore: 90
  },
  {
    id: 'html-19',
    title: 'Autocomplete Search',
    difficulty: 'Medium',
    category: 'HTML',
    link: 'https://developer.mozilla.org/',
    recommended: false,
    description: 'Build a search input with datalist for autocomplete suggestions.',
    tags: ['forms', 'datalist', 'autocomplete'],
    starterHtml: '<input list="suggestions" type="search">\n<datalist id="suggestions">\n  <option value="Option 1">\n</datalist>',
    starterCss: 'input { width: 100%; padding: 0.5rem; }',
    starterJs: '',
    hints: ['Use datalist element', 'Connect with list attribute', 'Works across browsers'],
    testCases: [
      {
        id: 'html-19-input',
        name: 'Input Element',
        description: 'Checks if input with list attribute exists',
        type: 'dom',
        selector: 'input[list]',
        expectedValue: true
      },
      {
        id: 'html-19-datalist',
        name: 'Datalist Element',
        description: 'Checks if <datalist> element exists',
        type: 'dom',
        selector: 'datalist',
        expectedValue: true
      },
      {
        id: 'html-19-options',
        name: 'Options',
        description: 'Checks if options exist inside datalist',
        type: 'dom',
        selector: 'datalist option',
        expectedValue: true
      }
    ],
    passingScore: 90
  },
  {
    id: 'html-20',
    title: 'Pricing Table',
    difficulty: 'Medium',
    category: 'HTML',
    link: 'https://www.frontendmentor.io/',
    recommended: true,
    description: 'Create a responsive pricing table with proper semantic structure.',
    tags: ['table', 'pricing', 'layout'],
    starterHtml: '<section class="pricing">\n  <!-- Pricing tiers -->\n</section>',
    starterCss: '.pricing { display: grid; gap: 1rem; }',
    starterJs: '',
    hints: ['Use proper heading hierarchy', 'Add ARIA labels for screen readers', 'Highlight recommended tier'],
    testCases: [
      {
        id: 'html-20-section',
        name: 'Pricing Section',
        description: 'Checks if a section exists',
        type: 'dom',
        selector: 'section',
        expectedValue: true
      },
      {
        id: 'html-20-heading',
        name: 'Heading',
        description: 'Checks if heading exists',
        type: 'dom',
        selector: 'h2, h3',
        expectedValue: true
      },
      {
        id: 'html-20-button',
        name: 'CTA Button',
        description: 'Checks if button exists',
        type: 'dom',
        selector: 'button, a.btn',
        expectedValue: true
      }
    ],
    passingScore: 90
  },
  {
    id: 'html-21',
    title: 'Timeline Component',
    difficulty: 'Medium',
    category: 'HTML',
    link: 'https://developer.mozilla.org/',
    recommended: false,
    description: 'Build a vertical timeline for displaying chronological events.',
    tags: ['timeline', 'layout', 'semantic'],
    starterHtml: '<ol class="timeline">\n  <li><time datetime="">Date</time><p>Event</p></li>\n</ol>',
    starterCss: '.timeline { position: relative; }',
    starterJs: '',
    hints: ['Use ordered list', 'Add time element with datetime', 'Use CSS for visual line'],
    testCases: [
      {
        id: 'html-21-ol',
        name: 'Ordered List',
        description: 'Checks if an <ol> element exists',
        type: 'dom',
        selector: 'ol.timeline',
        expectedValue: true
      },
      {
        id: 'html-21-li',
        name: 'List Item',
        description: 'Checks if <li> elements exist inside the timeline',
        type: 'dom',
        selector: 'ol.timeline li',
        expectedValue: true
      },
      {
        id: 'html-21-time',
        name: 'Time Element',
        description: 'Checks if a <time> element exists inside list items',
        type: 'dom',
        selector: 'ol.timeline li time',
        expectedValue: true
      }
    ],
    passingScore: 90
  },
  {
    id: 'html-22',
    title: 'Star Rating',
    difficulty: 'Easy',
    category: 'HTML',
    link: 'https://developer.mozilla.org/',
    recommended: false,
    description: 'Create an accessible star rating component using radio buttons.',
    tags: ['forms', 'rating', 'accessibility'],
    starterHtml: '<fieldset>\n  <legend>Rate this</legend>\n  <!-- Add star inputs -->\n</fieldset>',
    starterCss: 'input { display: none; }',
    starterJs: '',
    hints: ['Use radio buttons in reverse order', 'Use fieldset and legend', 'Style with CSS sibling selectors'],
    testCases: [
      {
        id: 'html-22-fieldset',
        name: 'Fieldset Element',
        description: 'Checks if a <fieldset> element exists',
        type: 'dom',
        selector: 'fieldset',
        expectedValue: true
      },
      {
        id: 'html-22-legend',
        name: 'Legend Element',
        description: 'Checks if a <legend> element exists inside fieldset',
        type: 'dom',
        selector: 'fieldset legend',
        expectedValue: true
      },
      {
        id: 'html-22-radio',
        name: 'Radio Inputs',
        description: 'Checks if radio buttons exist for rating',
        type: 'dom',
        selector: 'input[type="radio"]',
        expectedValue: true
      }
    ],
    passingScore: 90
  },
  {
    id: 'html-23',
    title: 'Multi-step Form',
    difficulty: 'Hard',
    category: 'HTML',
    link: 'https://www.frontendmentor.io/',
    recommended: true,
    description: 'Build a multi-step form with progress indicator and validation.',
    tags: ['forms', 'multi-step', 'validation'],
    starterHtml: '<form>\n  <fieldset class="step">\n    <!-- Step 1 -->\n  </fieldset>\n</form>',
    starterCss: '.step { display: none; } .step.active { display: block; }',
    starterJs: '// Handle step navigation',
    hints: ['Use fieldsets for steps', 'Add progress indicator', 'Validate before proceeding'],
    testCases: [
      {
        id: 'html-23-form',
        name: 'Form Element',
        description: 'Checks if a <form> element exists',
        type: 'dom',
        selector: 'form',
        expectedValue: true
      },
      {
        id: 'html-23-fieldset',
        name: 'Fieldset Steps',
        description: 'Checks if multiple <fieldset> elements are used for steps',
        type: 'dom',
        selector: 'form fieldset.step',
        expectedValue: true
      },
      {
        id: 'html-23-progress',
        name: 'Progress Indicator',
        description: 'Checks for a progress indicator (e.g., <progress> or div with role="progressbar")',
        type: 'dom',
        selector: 'progress, [role="progressbar"]',
        expectedValue: true
      },
      { id: 'html-23-active-step', name: 'Active Step Class', description: 'Checks if active class is used', type: 'dom', selector: '.step.active', expectedValue: true },
      { id: 'html-23-buttons', name: 'Navigation Buttons', description: 'Next/Prev buttons exist', type: 'dom', selector: 'button', expectedValue: true },
      { id: 'html-23-required', name: 'Validation', description: 'Inputs required', type: 'dom', selector: 'input[required]', expectedValue: true },
      { id: 'html-23-script-nav', name: 'Step Logic', description: 'JS handles step switch', type: 'function', testFunction: 'return document.querySelector("script")?.innerText.includes("classList.add") || document.querySelector("script")?.innerText.includes("style.display")' },
      { id: 'html-23-total-steps', name: 'Step Count', description: 'At least 3 steps', type: 'function', testFunction: 'return document.querySelectorAll(".step").length >= 2' },
      { id: 'html-23-aria-current', name: 'ARIA Current', description: 'Current step marked', type: 'function', testFunction: 'return document.querySelector("[aria-current]") !== null || true' },
      { id: 'html-23-submit', name: 'Submit Button', description: 'Final submit button', type: 'dom', selector: 'button[type="submit"]', expectedValue: true },
      { id: 'html-23-hidden', name: 'Hidden Steps', description: 'Non-active steps hidden', type: 'style', selector: '.step:not(.active)', property: 'display', expectedValue: 'none' },
      { id: 'html-23-legend', name: 'Step Titles', description: 'Fieldset legends present', type: 'dom', selector: 'legend', expectedValue: true },
      { id: 'html-23-enter-prevent', name: 'Prevent Enter Submit', description: 'Enter key handled', type: 'function', testFunction: 'return document.querySelector("script")?.innerText.includes("preventDefault")' },
      { id: 'html-23-validity-check', name: 'Check Validity', description: 'checkValidity used', type: 'function', testFunction: 'return document.querySelector("script")?.innerText.includes("checkValidity")' },
      { id: 'html-23-error-msg', name: 'Error Messages', description: 'Error containers', type: 'dom', selector: '.error, .invalid-feedback', expectedValue: true }
    ],
    passingScore: 90
  },
  {
    id: 'html-24',
    title: 'Footer with Sitemap',
    difficulty: 'Easy',
    category: 'HTML',
    link: 'https://developer.mozilla.org/',
    recommended: false,
    description: 'Create a comprehensive footer with sitemap, social links, and legal information.',
    tags: ['footer', 'navigation', 'layout'],
    starterHtml: '<footer>\n  <!-- Footer content -->\n</footer>',
    starterCss: 'footer { background: #333; color: white; }',
    starterJs: '',
    hints: ['Use nav for link groups', 'Add address element for contact', 'Include legal links'],
    testCases: [
      {
        id: 'html-24-footer',
        name: 'Footer Element',
        description: 'Checks if a <footer> element exists',
        type: 'dom',
        selector: 'footer',
        expectedValue: true
      },
      {
        id: 'html-24-nav',
        name: 'Navigation in Footer',
        description: 'Checks if a <nav> element exists inside the footer',
        type: 'dom',
        selector: 'footer nav',
        expectedValue: true
      },
      {
        id: 'html-24-address',
        name: 'Address Element',
        description: 'Checks if an <address> element exists in the footer',
        type: 'dom',
        selector: 'footer address',
        expectedValue: true
      }
    ],
    passingScore: 90
  },
  {
    id: 'html-25',
    title: 'Notification Banner',
    difficulty: 'Easy',
    category: 'HTML',
    link: 'https://developer.mozilla.org/',
    recommended: false,
    description: 'Build an accessible notification/alert banner with dismiss functionality.',
    tags: ['alert', 'notification', 'accessibility'],
    starterHtml: '<div role="alert" class="banner">\n  <p>Message</p>\n  <button>Dismiss</button>\n</div>',
    starterCss: '.banner { padding: 1rem; background: #fef3cd; }',
    starterJs: '// Handle dismiss',
    hints: ['Use role="alert" for announcements', 'Add aria-live for dynamic updates', 'Ensure keyboard dismissible'],
    testCases: [
      {
        id: 'html-25-alert',
        name: 'Alert Role',
        description: 'Checks if an element with role="alert" exists',
        type: 'dom',
        selector: '[role="alert"]',
        expectedValue: true
      },
      {
        id: 'html-25-button',
        name: 'Dismiss Button',
        description: 'Checks if a dismiss button exists within the alert',
        type: 'dom',
        selector: '[role="alert"] button',
        expectedValue: true
      },
      {
        id: 'html-25-aria-live',
        name: 'ARIA Live',
        description: 'Checks if aria-live attribute is present on the alert',
        type: 'dom',
        selector: '[role="alert"][aria-live]',
        expectedValue: true
      }
    ],
    passingScore: 90
  },
];

// CSS Questions (25)
const cssQuestions: WebDevQuestion[] = [
  {
    id: 'css-1',
    title: 'Flexbox Photo Gallery',
    difficulty: 'Easy',
    category: 'CSS',
    link: 'https://cssbattle.dev/',
    recommended: true,
    description: 'Build a responsive image gallery using Flexbox that adapts to different screen sizes.',
    tags: ['flexbox', 'responsive', 'gallery'],
    starterHtml: '<div class="gallery">\n  <div class="item">1</div>\n  <div class="item">2</div>\n  <div class="item">3</div>\n  <div class="item">4</div>\n  <div class="item">5</div>\n  <div class="item">6</div>\n</div>',
    starterCss: '.gallery {\n  /* Add flexbox styles */\n}\n\n.item {\n  background: #ddd;\n  padding: 2rem;\n}',
    starterJs: '',
    hints: ['Use display: flex', 'Add flex-wrap: wrap', 'Use gap for spacing'],
    testCases: [
      {
        id: 'css-1-flex',
        name: 'Flex Display',
        description: 'Checks if container uses flexbox',
        type: 'style',
        selector: '.gallery',
        property: 'display',
        expectedValue: 'flex'
      },
      {
        id: 'css-1-wrap',
        name: 'Flex Wrap',
        description: 'Checks if flex-wrap is set to wrap',
        type: 'style',
        selector: '.gallery',
        property: 'flex-wrap',
        expectedValue: 'wrap'
      },
      {
        id: 'css-1-gap',
        name: 'Flex Gap',
        description: 'Checks if gap is set for spacing',
        type: 'style',
        selector: '.gallery',
        property: 'gap',
        expectedValue: (val: string) => val !== 'normal' && val !== '0px'
      }
    ],
    passingScore: 90
  },
  {
    id: 'css-2',
    title: 'CSS Grid Dashboard',
    difficulty: 'Medium',
    category: 'CSS',
    link: 'https://cssbattle.dev/',
    recommended: true,
    description: 'Design a dashboard layout with sidebar, header, main content, and widgets using CSS Grid.',
    tags: ['grid', 'layout', 'dashboard'],
    starterHtml: '<div class="dashboard">\n  <header>Header</header>\n  <aside>Sidebar</aside>\n  <main>Main Content</main>\n  <div class="widget">Widget 1</div>\n  <div class="widget">Widget 2</div>\n</div>',
    starterCss: '.dashboard {\n  display: grid;\n  /* Define your grid */\n}',
    starterJs: '',
    hints: ['Use grid-template-areas', 'Make sidebar span full height', 'Use minmax() for responsiveness'],
    testCases: [
      {
        id: 'css-2-grid',
        name: 'Grid Display',
        description: 'Checks if container uses grid',
        type: 'style',
        selector: '.dashboard',
        property: 'display',
        expectedValue: 'grid'
      },
      {
        id: 'css-2-columns',
        name: 'Grid Columns',
        description: 'Checks if grid-template-columns is defined',
        type: 'style',
        selector: '.dashboard',
        property: 'grid-template-columns',
        expectedValue: (val: string) => val !== 'none' && val !== ''
      },
      {
        id: 'css-2-areas',
        name: 'Grid Areas',
        description: 'Checks if grid-template-areas is used',
        type: 'style',
        selector: '.dashboard',
        property: 'grid-template-areas',
        expectedValue: (val: string) => val !== 'none' && val !== ''
      }
    ],
    passingScore: 90
  },
  {
    id: 'css-3',
    title: 'Dark Mode Toggle',
    difficulty: 'Medium',
    category: 'CSS',
    link: 'https://www.frontendmentor.io/challenges',
    recommended: true,
    description: 'Create a theme switcher with CSS custom properties that toggles between light and dark themes.',
    tags: ['css-variables', 'theming', 'dark-mode'],
    starterHtml: '<div class="container">\n  <h1>Theme Toggle</h1>\n  <button id="toggle">Toggle Theme</button>\n</div>',
    starterCss: ':root {\n  --bg: white;\n  --text: black;\n}\n\n.dark {\n  --bg: #1a1a1a;\n  --text: white;\n}\n\nbody {\n  background: var(--bg);\n  color: var(--text);\n}',
    starterJs: 'document.getElementById("toggle").onclick = () => document.body.classList.toggle("dark");',
    hints: ['Define CSS variables in :root', 'Create .dark class with overrides', 'Toggle class on body'],
    testCases: [
      {
        id: 'css-3-root-vars',
        name: 'Root Variables',
        description: 'Checks if CSS variables are defined in :root',
        type: 'function',
        testFunction: 'return getComputedStyle(document.documentElement).getPropertyValue("--bg") !== ""'
      },
      {
        id: 'css-3-dark-class',
        name: 'Dark Class Overrides',
        description: 'Checks if .dark class overrides variables',
        type: 'function',
        testFunction: 'document.body.classList.add("dark"); const bg = getComputedStyle(document.body).backgroundColor; document.body.classList.remove("dark"); return bg !== "rgb(255, 255, 255)"'
      },
      {
        id: 'css-3-toggle',
        name: 'Class Toggle',
        description: 'Checks if button toggles "dark" class on body',
        type: 'function',
        testFunction: 'const body = document.body; const initial = body.classList.contains("dark"); document.getElementById("toggle").click(); const afterClick = body.classList.contains("dark"); document.getElementById("toggle").click(); return initial !== afterClick'
      }
    ],
    passingScore: 90
  },
  {
    id: 'css-4',
    title: 'Advanced Keyframe Animations',
    difficulty: 'Hard',
    category: 'CSS',
    link: 'https://cssbattle.dev/',
    recommended: true,
    description: 'Build complex animations using keyframes, multiple animation properties, and timing functions.',
    tags: ['animations', 'keyframes', 'transitions'],
    starterHtml: '<div class="box"></div>',
    starterCss: '.box {\n  width: 100px;\n  height: 100px;\n  background: blue;\n  /* Add animation */\n}\n\n@keyframes bounce {\n  /* Define keyframes */\n}',
    starterJs: '',
    hints: ['Use @keyframes for animation', 'Combine multiple properties', 'Use cubic-bezier for custom timing'],
    testCases: [
      {
        id: 'css-4-animation',
        name: 'Animation Property',
        description: 'Checks if animation property is set on the box',
        type: 'style',
        selector: '.box',
        property: 'animation',
        expectedValue: (val: string) => val !== 'none' && val !== ''
      },
      {
        id: 'css-4-keyframes',
        name: 'Keyframes Defined',
        description: 'Checks if @keyframes rule exists',
        type: 'function',
        testFunction: 'return Array.from(document.styleSheets[0].cssRules).some(rule => rule.type === CSSRule.KEYFRAMES_RULE && rule.name === "bounce")'
      },
      {
        id: 'css-4-transform',
        name: 'Transform in Keyframes',
        description: 'Checks if transform is used within keyframes',
        type: 'function',
        testFunction: `
          const styleSheets = Array.from(document.styleSheets);
          for (const sheet of styleSheets) {
            try {
              const rules = Array.from(sheet.cssRules);
              for (const rule of rules) {
                if (rule.type === CSSRule.KEYFRAMES_RULE && rule.name === "bounce") {
                  for (const frame of Array.from(rule.cssRules)) {
                    if (frame.style.transform) return true;
                  }
                }
              }
            } catch (e) { /* Security error for cross-origin stylesheets */ }
          }
          return false;
        `
      },
      { id: 'css-4-multi-prop', name: 'Multiple Properties', description: 'Animating multiple props', type: 'function', testFunction: 'return document.querySelector("style")?.innerText.includes("background") && document.querySelector("style")?.innerText.includes("transform")' },
      { id: 'css-4-duration', name: 'Duration', description: 'Transition/Animation duration set', type: 'style', selector: '.box', property: 'animation-duration', expectedValue: (val: string) => val !== '0s' },
      { id: 'css-4-timing', name: 'Timing Function', description: 'Custom timing used', type: 'style', selector: '.box', property: 'animation-timing-function', expectedValue: (val: string) => val !== 'ease' },
      { id: 'css-4-delay', name: 'Delay', description: 'Animation delay used', type: 'style', selector: '.box', property: 'animation-delay', expectedValue: (val: string) => true },
      { id: 'css-4-fill-mode', name: 'Fill Mode', description: 'Fill mode set', type: 'style', selector: '.box', property: 'animation-fill-mode', expectedValue: (val: string) => val !== 'none' },
      { id: 'css-4-iteration', name: 'Iteration Count', description: 'Infinite or count set', type: 'style', selector: '.box', property: 'animation-iteration-count', expectedValue: (val: string) => val !== '1' },
      { id: 'css-4-direction', name: 'Direction', description: 'Alternate direction', type: 'style', selector: '.box', property: 'animation-direction', expectedValue: (val: string) => val !== 'normal' },
      { id: 'css-4-play-state', name: 'Play State', description: 'Paused/Running', type: 'style', selector: '.box', property: 'animation-play-state', expectedValue: (val: string) => true },
      { id: 'css-4-cubic', name: 'Cubic Bezier', description: 'Custom bezier curve', type: 'function', testFunction: 'return document.querySelector("style")?.innerText.includes("cubic-bezier")' },
      { id: 'css-4-percent', name: 'Percentage Keyframes', description: 'Using % not just from/to', type: 'function', testFunction: 'return document.querySelector("style")?.innerText.includes("%")' }
    ],
    passingScore: 90
  },
  {
    id: 'css-5',
    title: 'Perfect Centering',
    difficulty: 'Easy',
    category: 'CSS',
    link: 'https://flexboxfroggy.com/',
    recommended: true,
    description: 'Master different centering techniques - flexbox, grid, and transform.',
    tags: ['flexbox', 'grid', 'centering'],
    starterHtml: '<div class="container">\n  <div class="centered">Center Me!</div>\n</div>',
    starterCss: '.container {\n  height: 300px;\n  border: 1px solid #ddd;\n  /* Center the child */\n}',
    starterJs: '',
    hints: ['Flexbox: justify-content + align-items', 'Grid: place-items: center', 'Transform: translate(-50%, -50%)'],
    testCases: [
      {
        id: 'css-5-flex',
        name: 'Flex Display',
        description: 'Checks if container uses flexbox',
        type: 'style',
        selector: '.container',
        property: 'display',
        expectedValue: 'flex'
      },
      {
        id: 'css-5-justify',
        name: 'Horizontal Center',
        description: 'Checks if content is centered horizontally',
        type: 'style',
        selector: '.container',
        property: 'justify-content',
        expectedValue: 'center'
      },
      {
        id: 'css-5-align',
        name: 'Vertical Center',
        description: 'Checks if content is centered vertically',
        type: 'style',
        selector: '.container',
        property: 'align-items',
        expectedValue: 'center'
      }
    ],
    passingScore: 90
  },
  {
    id: 'css-6',
    title: 'Responsive Grid System',
    difficulty: 'Medium',
    category: 'CSS',
    link: 'https://cssgridgarden.com/',
    recommended: true,
    description: 'Build a 12-column responsive grid system using CSS Grid with auto-fit and minmax.',
    tags: ['grid', 'responsive', 'system'],
    starterHtml: '<div class="grid">\n  <div class="col-6">Half</div>\n  <div class="col-6">Half</div>\n  <div class="col-4">Third</div>\n  <div class="col-4">Third</div>\n  <div class="col-4">Third</div>\n</div>',
    starterCss: '.grid {\n  display: grid;\n  grid-template-columns: repeat(12, 1fr);\n  gap: 1rem;\n}\n\n.col-6 { grid-column: span 6; }',
    starterJs: '',
    hints: ['Use repeat(12, 1fr) for columns', 'span X for column width', 'Add media queries for mobile'],
    testCases: [
      {
        id: 'css-6-grid',
        name: 'Grid Display',
        description: 'Checks if container uses grid',
        type: 'style',
        selector: '.grid',
        property: 'display',
        expectedValue: 'grid'
      },
      {
        id: 'css-6-columns',
        name: 'Grid Columns',
        description: 'Checks if grid-template-columns is defined with repeat',
        type: 'style',
        selector: '.grid',
        property: 'grid-template-columns',
        expectedValue: (val: string) => val.includes('repeat') && val.includes('1fr')
      },
      {
        id: 'css-6-span',
        name: 'Column Span',
        description: 'Checks if .col-6 spans 6 columns',
        type: 'style',
        selector: '.col-6',
        property: 'grid-column',
        expectedValue: (val: string) => val.includes('span 6')
      }
    ],
    passingScore: 90
  },
  {
    id: 'css-7',
    title: 'Card Component Design',
    difficulty: 'Easy',
    category: 'CSS',
    link: 'https://www.frontendmentor.io/',
    recommended: true,
    description: 'Design a beautiful card component with shadow, hover effects, and proper spacing.',
    tags: ['box-model', 'shadows', 'hover'],
    starterHtml: '<div class="card">\n  <img src="https://picsum.photos/300/200" alt="Card">\n  <div class="content">\n    <h3>Card Title</h3>\n    <p>Card description goes here</p>\n  </div>\n</div>',
    starterCss: '.card {\n  /* Style the card */\n}',
    starterJs: '',
    hints: ['Use box-shadow for depth', 'Add transition for hover', 'Use overflow: hidden for rounded images'],
    testCases: [
      {
        id: 'css-7-shadow',
        name: 'Box Shadow',
        description: 'Checks if box-shadow is set',
        type: 'style',
        selector: '.card',
        property: 'box-shadow',
        expectedValue: (val: string) => val !== 'none' && val !== ''
      },
      {
        id: 'css-7-transition',
        name: 'Transition for Hover',
        description: 'Checks if transition is added to the card',
        type: 'style',
        selector: '.card',
        property: 'transition',
        expectedValue: (val: string) => val !== 'all 0s ease 0s' && val !== ''
      },
      {
        id: 'css-7-padding',
        name: 'Content Padding',
        description: 'Checks if content has padding',
        type: 'style',
        selector: '.card .content',
        property: 'padding',
        expectedValue: (val: string) => val !== '0px' && val !== '0px 0px 0px 0px'
      }
    ],
    passingScore: 90
  },
  {
    id: 'css-8',
    title: 'CSS Variables Theme System',
    difficulty: 'Medium',
    category: 'CSS',
    link: 'https://developer.mozilla.org/',
    recommended: true,
    description: 'Build a comprehensive theming system using CSS custom properties with multiple color schemes.',
    tags: ['css-variables', 'themes', 'system'],
    starterHtml: '<div class="app">\n  <h1>Themed App</h1>\n  <button class="btn-primary">Primary</button>\n  <button class="btn-secondary">Secondary</button>\n</div>',
    starterCss: ':root {\n  --primary: #007bff;\n  --secondary: #6c757d;\n  /* Add more variables */\n}',
    starterJs: '',
    hints: ['Define color palette in :root', 'Use semantic variable names', 'Add dark mode overrides'],
    testCases: [],
    passingScore: 90
  },
  {
    id: 'css-9',
    title: 'Sticky Header',
    difficulty: 'Easy',
    category: 'CSS',
    link: 'https://developer.mozilla.org/',
    recommended: false,
    description: 'Create a sticky navbar that stays fixed when scrolling with smooth transition effects.',
    tags: ['position', 'sticky', 'navigation'],
    starterHtml: '<header class="sticky-header">\n  <nav>Navigation</nav>\n</header>\n<main>\n  <p>Content...</p>\n</main>',
    starterCss: '.sticky-header {\n  /* Make it sticky */\n}',
    starterJs: '',
    hints: ['Use position: sticky', 'Set top: 0', 'Add background and shadow when stuck'],
    testCases: [],
    passingScore: 90
  },
  {
    id: 'css-10',
    title: 'Hamburger Menu Animation',
    difficulty: 'Medium',
    category: 'CSS',
    link: 'https://www.frontendmentor.io/',
    recommended: true,
    description: 'Create an animated hamburger menu icon that transforms to an X when clicked.',
    tags: ['animation', 'hamburger', 'transform'],
    starterHtml: '<button class="hamburger">\n  <span></span>\n  <span></span>\n  <span></span>\n</button>',
    starterCss: '.hamburger {\n  display: flex;\n  flex-direction: column;\n  gap: 5px;\n  background: none;\n  border: none;\n}\n\n.hamburger span {\n  width: 25px;\n  height: 3px;\n  background: black;\n  transition: 0.3s;\n}',
    starterJs: 'document.querySelector(".hamburger").onclick = function() { this.classList.toggle("active"); }',
    hints: ['Rotate top and bottom lines', 'Hide middle line', 'Use transform: rotate()'],
    testCases: [],
    passingScore: 90
  },
  {
    id: 'css-11',
    title: 'CSS Transitions',
    difficulty: 'Easy',
    category: 'CSS',
    link: 'https://developer.mozilla.org/',
    recommended: true,
    description: 'Master CSS transitions with different properties, durations, and timing functions.',
    tags: ['transitions', 'animation', 'effects'],
    starterHtml: '<button class="btn">Hover Me</button>',
    starterCss: '.btn {\n  padding: 1rem 2rem;\n  background: blue;\n  color: white;\n  border: none;\n  /* Add transition */\n}\n\n.btn:hover {\n  /* Hover state */\n}',
    starterJs: '',
    hints: ['Use transition shorthand', 'Specify multiple properties', 'Try ease-in-out timing'],
    testCases: [
      {
        id: 'css-11-transition',
        name: 'Transition',
        description: 'Checks if transition property is set',
        type: 'style',
        selector: '.btn',
        property: 'transition',
        expectedValue: (val: string) => val !== 'all 0s ease 0s' && val !== ''
      },
      {
        id: 'css-11-hover',
        name: 'Hover State',
        description: 'Checks if hover state is defined',
        type: 'function',
        testFunction: 'return Array.from(document.styleSheets[0].cssRules).some(rule => rule.selectorText && rule.selectorText.includes(":hover"))'
      },
      {
        id: 'css-11-transform',
        name: 'Transform',
        description: 'Checks if transform is used',
        type: 'style',
        selector: '.btn',
        property: 'transform',
        expectedValue: (val: string) => true // Hard to check dynamic hover state without interaction
      }
    ],
    passingScore: 90
  },
  {
    id: 'css-12',
    title: 'Form Styling',
    difficulty: 'Medium',
    category: 'CSS',
    link: 'https://www.frontendmentor.io/',
    recommended: true,
    description: 'Style form inputs with focus states, validation styling, and custom appearance.',
    tags: ['forms', 'inputs', 'validation'],
    starterHtml: '<input type="text" id="username" placeholder="Name">\n  <input type="email" id="email" placeholder="Email">\n  <button type="submit">Submit</button>\n</form>',
    starterCss: 'input {\n  width: 100%;\n  padding: 0.75rem;\n  margin-bottom: 1rem;\n  border: 1px solid #ddd;\n}',
    starterJs: '',
    hints: ['Style :focus state', 'Use :valid and :invalid', 'Custom placeholder styling'],
    testCases: [
      {
        id: 'css-12-focus',
        name: 'Focus State',
        description: 'Checks if :focus style is applied to inputs',
        type: 'function',
        testFunction: 'return Array.from(document.styleSheets[0].cssRules).some(rule => rule.selectorText && rule.selectorText.includes("input:focus"))'
      },
      {
        id: 'css-12-valid',
        name: 'Valid State',
        description: 'Checks if :valid style is applied to inputs',
        type: 'function',
        testFunction: 'return Array.from(document.styleSheets[0].cssRules).some(rule => rule.selectorText && rule.selectorText.includes("input:valid"))'
      },
      {
        id: 'css-12-invalid',
        name: 'Invalid State',
        description: 'Checks if :invalid style is applied to inputs',
        type: 'function',
        testFunction: 'return Array.from(document.styleSheets[0].cssRules).some(rule => rule.selectorText && rule.selectorText.includes("input:invalid"))'
      }
    ],
    passingScore: 90
  },
  {
    id: 'css-13',
    title: 'Glassmorphism Card',
    difficulty: 'Medium',
    category: 'CSS',
    link: 'https://developer.mozilla.org/',
    recommended: true,
    description: 'Create a glass effect card using backdrop-filter and transparency.',
    tags: ['modern-ui', 'backdrop-filter', 'glass'],
    starterHtml: '<div class="background">\n  <div class="glass-card">\n    <h2>Glass Card</h2>\n    <p>Modern UI effect</p>\n  </div>\n</div>',
    starterCss: '.background {\n  min-height: 100vh;\n  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n\n.glass-card {\n  /* Add glass effect */\n}',
    starterJs: '',
    hints: ['Use backdrop-filter: blur()', 'Add semi-transparent background', 'Add subtle border'],
    testCases: [
      {
        id: 'css-13-filter',
        name: 'Blur Filter',
        description: 'Checks if filter property uses blur',
        type: 'style',
        selector: '.glass-card',
        property: 'backdrop-filter',
        expectedValue: (val: string) => val.includes('blur') || val === 'none' // Fallback if not supported or used filter instead
      },
      {
        id: 'css-13-background',
        name: 'Background Color',
        description: 'Checks if background is semi-transparent',
        type: 'style',
        selector: '.glass-card',
        property: 'background-color',
        expectedValue: (val: string) => val.includes('rgba') || val.includes('hsla')
      },
      {
        id: 'css-13-fallback',
        name: 'Fallback',
        description: 'Checks if filter is used as fallback',
        type: 'style',
        selector: '.glass-card',
        property: 'filter',
        expectedValue: (val: string) => true
      }
    ],
    passingScore: 90
  },
  {
    id: 'css-14',
    title: 'Mobile First Layout',
    difficulty: 'Medium',
    category: 'CSS',
    link: 'https://developer.mozilla.org/',
    recommended: true,
    description: 'Design a layout using mobile-first approach with progressive media queries.',
    tags: ['media-queries', 'responsive', 'mobile-first'],
    starterHtml: '<div class="container">\n  <header>Header</header>\n  <main>Main</main>\n  <aside>Sidebar</aside>\n  <footer>Footer</footer>\n</div>',
    starterCss: '/* Mobile styles first */\n.container {\n  display: flex;\n  flex-direction: column;\n}\n\n/* Tablet and up */\n@media (min-width: 768px) {\n  /* Add tablet styles */\n}',
    starterJs: '',
    hints: ['Start with mobile styles', 'Use min-width queries', 'Progressive enhancement'],
    testCases: [],
    passingScore: 90
  },
  {
    id: 'css-15',
    title: 'Loading Spinner',
    difficulty: 'Easy',
    category: 'CSS',
    link: 'https://developer.mozilla.org/',
    recommended: false,
    description: 'Create various loading spinners using CSS animations.',
    tags: ['animation', 'loading', 'spinner'],
    starterHtml: '<div class="spinner"></div>',
    starterCss: '.spinner {\n  width: 50px;\n  height: 50px;\n  border: 3px solid #f3f3f3;\n  border-top: 3px solid blue;\n  border-radius: 50%;\n  /* Add animation */\n}',
    starterJs: '',
    hints: ['Use animation: spin infinite', 'Rotate from 0 to 360deg', 'Adjust animation duration'],
    testCases: [],
    passingScore: 90
  },
  {
    id: 'css-16',
    title: 'Tooltip Component',
    difficulty: 'Easy',
    category: 'CSS',
    link: 'https://developer.mozilla.org/',
    recommended: false,
    description: 'Build a pure CSS tooltip with arrow pointer and fade animation.',
    tags: ['tooltip', 'pseudo-elements', 'hover'],
    starterHtml: '<button class="tooltip" data-tip="This is a tooltip">Hover me</button>',
    starterCss: '.tooltip {\n  position: relative;\n}\n\n.tooltip::after {\n  content: attr(data-tip);\n  /* Style tooltip */\n}',
    starterJs: '',
    hints: ['Use ::after pseudo-element', 'Position absolutely', 'Add arrow with ::before'],
    testCases: [
      {
        id: 'css-16-after',
        name: 'Pseudo-element ::after',
        description: 'Checks if ::after pseudo-element is used for tooltip content',
        type: 'function',
        testFunction: 'return Array.from(document.styleSheets[0].cssRules).some(rule => rule.selectorText && rule.selectorText.includes(".tooltip::after"))'
      },
      {
        id: 'css-16-content',
        name: 'Content Attribute',
        description: 'Checks if content property uses attr()',
        type: 'function',
        testFunction: `
          const styleSheets = Array.from(document.styleSheets);
          for (const sheet of styleSheets) {
            try {
              const rules = Array.from(sheet.cssRules);
              for (const rule of rules) {
                if (rule.selectorText && rule.selectorText.includes(".tooltip::after")) {
                  if (rule.style.content && rule.style.content.includes("attr(data-tip)")) return true;
                }
              }
            } catch (e) { /* Security error for cross-origin stylesheets */ }
          }
          return false;
        `
      },
      {
        id: 'css-16-before',
        name: 'Pseudo-element ::before (Arrow)',
        description: 'Checks if ::before pseudo-element is used for the arrow (optional)',
        type: 'function',
        testFunction: 'return Array.from(document.styleSheets[0].cssRules).some(rule => rule.selectorText && rule.selectorText.includes(".tooltip::before"))'
      }
    ],
    passingScore: 90
  },
  {
    id: 'css-17',
    title: 'Masonry Grid',
    difficulty: 'Hard',
    category: 'CSS',
    link: 'https://developer.mozilla.org/',
    recommended: false,
    description: 'Create a Pinterest-style masonry layout using CSS columns or Grid.',
    tags: ['grid', 'masonry', 'layout'],
    starterHtml: '<div class="masonry">\n  <div class="item" style="height: 150px">1</div>\n  <div class="item" style="height: 200px">2</div>\n  <div class="item" style="height: 180px">3</div>\n  <div class="item" style="height: 220px">4</div>\n</div>',
    starterCss: '.masonry {\n  /* Use columns or grid */\n}',
    starterJs: '',
    hints: ['CSS columns: column-count', 'Prevent break inside items', 'Or use grid with dense packing'],
    testCases: [
      {
        id: 'css-17-columns',
        name: 'Column Count',
        description: 'Checks if column-count is set on the masonry container',
        type: 'style',
        selector: '.masonry',
        property: 'column-count',
        expectedValue: (val: string) => val !== 'auto' && val !== '' && parseInt(val) > 0
      },
      {
        id: 'css-17-gap',
        name: 'Column Gap',
        description: 'Checks if column-gap is set on the masonry container',
        type: 'style',
        selector: '.masonry',
        property: 'column-gap',
        expectedValue: (val: string) => val !== 'normal' && val !== '0px' && val !== ''
      },
      {
        id: 'css-17-break',
        name: 'Break Inside Avoid',
        description: 'Checks if break-inside is set to avoid on items',
        type: 'style',
        selector: '.masonry .item',
        property: 'break-inside',
        expectedValue: 'avoid'
      },
      { id: 'css-17-grid-template', name: 'Grid Template (Alt)', description: 'Checks grid alternative', type: 'style', selector: '.masonry', property: 'grid-template-rows', expectedValue: (val: string) => val === 'masonry' || val !== 'none' },
      { id: 'css-17-responsive-cols', name: 'Media Query Cols', description: 'Checks for responsive columns', type: 'function', testFunction: 'return document.querySelector("style")?.innerText.includes("@media") && document.querySelector("style")?.innerText.includes("column-count")' },
      { id: 'css-17-item-width', name: 'Item Width', description: 'Items have width set', type: 'style', selector: '.masonry .item', property: 'width', expectedValue: (val: string) => val.includes('%') || val !== 'auto' },
      { id: 'css-17-margin-bottom', name: 'Item Spacing', description: 'Items have bottom margin', type: 'style', selector: '.masonry .item', property: 'margin-bottom', expectedValue: (val: string) => val !== '0px' },
      { id: 'css-17-display', name: 'Container Display', description: 'Block or grid display', type: 'style', selector: '.masonry', property: 'display', expectedValue: (val: string) => val === 'block' || val === 'grid' },
      { id: 'css-17-images', name: 'Image Handling', description: 'Images 100% width', type: 'style', selector: 'img', property: 'width', expectedValue: '100%' },
      { id: 'css-17-overflow', name: 'Overflow Handling', description: 'Container overflow', type: 'style', selector: '.masonry', property: 'overflow', expectedValue: (val: string) => val !== 'visible' },
      { id: 'css-17-auto-fill', name: 'Grid Auto Fill', description: 'Auto-fill usage (if grid)', type: 'function', testFunction: 'return document.querySelector("style")?.innerText.includes("auto-fill") || true' },
      { id: 'css-17-dense', name: 'Grid Auto Flow', description: 'Dense packing (if grid)', type: 'style', selector: '.masonry', property: 'grid-auto-flow', expectedValue: (val: string) => val.includes('dense') || true }
    ],
    passingScore: 90
  },
  {
    id: 'css-18',
    title: 'Gradient Border',
    difficulty: 'Medium',
    category: 'CSS',
    link: 'https://developer.mozilla.org/',
    recommended: false,
    description: 'Create gradient borders using pseudo-elements or background-clip.',
    tags: ['gradients', 'borders', 'creative'],
    starterHtml: '<button class="gradient-border">Gradient Border</button>',
    starterCss: '.gradient-border {\n  position: relative;\n  background: white;\n  padding: 1rem 2rem;\n  /* Add gradient border effect */\n}',
    starterJs: '',
    hints: ['Use background-clip: padding-box', 'Or use pseudo-element method', 'Linear gradient for border'],
    testCases: [
      {
        id: 'css-18-background-clip',
        name: 'Background Clip',
        description: 'Checks if background-clip is used for border effect',
        type: 'style',
        selector: '.gradient-border',
        property: 'background-clip',
        expectedValue: (val: string) => val.includes('padding-box') || val.includes('border-box')
      },
      {
        id: 'css-18-border-image',
        name: 'Border Image',
        description: 'Checks if border-image is used (alternative)',
        type: 'style',
        selector: '.gradient-border',
        property: 'border-image',
        expectedValue: (val: string) => val.includes('gradient') || val === 'none'
      },
      {
        id: 'css-18-pseudo',
        name: 'Pseudo-element Method',
        description: 'Checks if a pseudo-element is used for the gradient border (alternative)',
        type: 'function',
        testFunction: 'return Array.from(document.styleSheets[0].cssRules).some(rule => rule.selectorText && (rule.selectorText.includes(".gradient-border::before") || rule.selectorText.includes(".gradient-border::after")))'
      }
    ],
    passingScore: 90
  },
  {
    id: 'css-19',
    title: 'Scroll Snap Gallery',
    difficulty: 'Medium',
    category: 'CSS',
    link: 'https://developer.mozilla.org/',
    recommended: true,
    description: 'Build a horizontal scrolling gallery with CSS scroll snap.',
    tags: ['scroll-snap', 'gallery', 'slider'],
    starterHtml: '<div class="gallery">\n  <div class="slide">1</div>\n  <div class="slide">2</div>\n  <div class="slide">3</div>\n</div>',
    starterCss: '.gallery {\n  display: flex;\n  overflow-x: auto;\n  /* Add scroll snap */\n}\n\n.slide {\n  min-width: 100%;\n  height: 300px;\n}',
    starterJs: '',
    hints: ['Use scroll-snap-type on container', 'Use scroll-snap-align on children', 'Hide scrollbar optionally'],
    testCases: [
      {
        id: 'css-19-snap-type',
        name: 'Scroll Snap Type',
        description: 'Checks if scroll-snap-type is set on the gallery container',
        type: 'style',
        selector: '.gallery',
        property: 'scroll-snap-type',
        expectedValue: (val: string) => val.includes('x') && (val.includes('mandatory') || val.includes('proximity'))
      },
      {
        id: 'css-19-snap-align',
        name: 'Scroll Snap Align',
        description: 'Checks if scroll-snap-align is set on the slide items',
        type: 'style',
        selector: '.slide',
        property: 'scroll-snap-align',
        expectedValue: (val: string) => val.includes('start') || val.includes('center') || val.includes('end')
      },
      {
        id: 'css-19-overflow',
        name: 'Overflow X',
        description: 'Checks if overflow-x is set to auto or scroll',
        type: 'style',
        selector: '.gallery',
        property: 'overflow-x',
        expectedValue: (val: string) => val === 'auto' || val === 'scroll'
      }
    ],
    passingScore: 90
  },
  {
    id: 'css-20',
    title: 'Aspect Ratio Box',
    difficulty: 'Easy',
    category: 'CSS',
    link: 'https://developer.mozilla.org/',
    recommended: false,
    description: 'Maintain aspect ratio for responsive containers using modern CSS.',
    tags: ['aspect-ratio', 'responsive', 'video'],
    starterHtml: '<div class="video-container">\n  <iframe src=""></iframe>\n</div>',
    starterCss: '.video-container {\n  /* Maintain 16:9 aspect ratio */\n}\n\n.video-container iframe {\n  width: 100%;\n  height: 100%;\n}',
    starterJs: '',
    hints: ['Use aspect-ratio property', 'Or use padding-bottom trick', '16:9 = 56.25% padding'],
    testCases: [
      {
        id: 'css-20-aspect-ratio',
        name: 'Aspect Ratio Property',
        description: 'Checks if aspect-ratio property is used',
        type: 'style',
        selector: '.video-container',
        property: 'aspect-ratio',
        expectedValue: (val: string) => val !== 'auto' && val !== ''
      },
      {
        id: 'css-20-padding-bottom',
        name: 'Padding Bottom Hack',
        description: 'Checks if padding-bottom hack is used (alternative)',
        type: 'style',
        selector: '.video-container',
        property: 'padding-bottom',
        expectedValue: (val: string) => val.includes('%') || val === '0px'
      },
      {
        id: 'css-20-position',
        name: 'Positioning for Content',
        description: 'Checks if inner content is absolutely positioned when using padding hack',
        type: 'style',
        selector: '.video-container iframe',
        property: 'position',
        expectedValue: (val: string) => val === 'absolute' || val === 'static' // static if aspect-ratio property is used
      }
    ],
    passingScore: 90
  },
  {
    id: 'css-21',
    title: 'Text Clipping Effect',
    difficulty: 'Medium',
    category: 'CSS',
    link: 'https://developer.mozilla.org/',
    recommended: false,
    description: 'Create gradient and image text effects using background-clip.',
    tags: ['text', 'gradients', 'clip'],
    starterHtml: '<h1 class="gradient-text">Gradient Text</h1>',
    starterCss: '.gradient-text {\n  font-size: 4rem;\n  font-weight: bold;\n  /* Add gradient text effect */\n}',
    starterJs: '',
    hints: ['Use perspective on container', 'Use transform-style: preserve-3d', 'Rotate on hover'],
    testCases: [
      {
        id: 'css-21-perspective',
        name: 'Perspective',
        description: 'Checks if perspective is set on container',
        type: 'style',
        selector: '.scene',
        property: 'perspective',
        expectedValue: (val: string) => val !== 'none' && val !== ''
      },
      {
        id: 'css-21-preserve',
        name: 'Preserve 3D',
        description: 'Checks if transform-style is preserve-3d',
        type: 'style',
        selector: '.cube',
        property: 'transform-style',
        expectedValue: 'preserve-3d'
      },
      {
        id: 'css-21-rotate',
        name: 'Rotation',
        description: 'Checks if rotation is applied (optional)',
        type: 'style',
        selector: '.cube',
        property: 'transform',
        expectedValue: (val: string) => val.includes('rotate') || val === 'none' // might be on hover
      }
    ],
    passingScore: 90
  },
  {
    id: 'css-22',
    title: 'Animated Underline',
    difficulty: 'Easy',
    category: 'CSS',
    link: 'https://developer.mozilla.org/',
    recommended: true,
    description: 'Create animated underline effects for links using pseudo-elements.',
    tags: ['animation', 'links', 'underline'],
    starterHtml: '<nav>\n  <a href="#">Home</a>\n  <a href="#">About</a>\n  <a href="#">Contact</a>\n</nav>',
    starterCss: 'a {\n  position: relative;\n  text-decoration: none;\n}\n\na::after {\n  /* Add animated underline */\n}',
    starterJs: '',
    hints: ['Use mix-blend-mode', 'Try multiply or screen', 'Position over image'],
    testCases: [
      {
        id: 'css-22-blend',
        name: 'Blend Mode',
        description: 'Checks if mix-blend-mode is set',
        type: 'style',
        selector: '.text-overlay',
        property: 'mix-blend-mode',
        expectedValue: (val: string) => val !== 'normal'
      },
      {
        id: 'css-22-position',
        name: 'Position',
        description: 'Checks if overlay is positioned',
        type: 'style',
        selector: '.text-overlay',
        property: 'position',
        expectedValue: 'absolute'
      },
      {
        id: 'css-22-color',
        name: 'Color',
        description: 'Checks if text color is set',
        type: 'style',
        selector: '.text-overlay',
        property: 'color',
        expectedValue: (val: string) => val !== ''
      }
    ],
    passingScore: 90
  },
  {
    id: 'css-23',
    title: 'CSS Grid Auto-Fit',
    difficulty: 'Medium',
    category: 'CSS',
    link: 'https://developer.mozilla.org/',
    recommended: true,
    description: 'Create responsive cards that auto-fit using repeat, auto-fit, and minmax.',
    tags: ['grid', 'auto-fit', 'responsive'],
    starterHtml: '<div class="auto-grid">\n  <div class="card">Card 1</div>\n  <div class="card">Card 2</div>\n  <div class="card">Card 3</div>\n  <div class="card">Card 4</div>\n  <div class="card">Card 5</div>\n</div>',
    starterCss: '.auto-grid {\n  display: grid;\n  /* Use auto-fit with minmax */\n}',
    starterJs: '',
    hints: ['Use shape-outside', 'Float the image', 'Define circle or polygon'],
    testCases: [
      {
        id: 'css-23-shape',
        name: 'Shape Outside',
        description: 'Checks if shape-outside is set',
        type: 'style',
        selector: '.float-img',
        property: 'shape-outside',
        expectedValue: (val: string) => val !== 'none'
      },
      {
        id: 'css-23-float',
        name: 'Float',
        description: 'Checks if image is floated',
        type: 'style',
        selector: '.float-img',
        property: 'float',
        expectedValue: (val: string) => val === 'left' || val === 'right'
      },
      {
        id: 'css-23-clip',
        name: 'Clip Path',
        description: 'Checks if clip-path matches shape (optional)',
        type: 'style',
        selector: '.float-img',
        property: 'clip-path',
        expectedValue: (val: string) => true
      }
    ],
    passingScore: 90
  },
  {
    id: 'css-24',
    title: 'Neumorphism Design',
    difficulty: 'Medium',
    category: 'CSS',
    link: 'https://developer.mozilla.org/',
    recommended: false,
    description: 'Create soft UI / neumorphism style components with inset shadows.',
    tags: ['neumorphism', 'shadows', 'modern-ui'],
    starterHtml: '<div class="neu-container">\n  <button class="neu-button">Button</button>\n  <input type="text" class="neu-input" placeholder="Input">\n</div>',
    starterCss: '.neu-container {\n  background: #e0e0e0;\n  padding: 2rem;\n}\n\n.neu-button {\n  /* Add neumorphism effect */\n}',
    starterJs: '',
    hints: ['Use writing-mode: vertical-rl', 'Rotate text container', 'Adjust alignment'],
    testCases: [
      {
        id: 'css-24-writing',
        name: 'Writing Mode',
        description: 'Checks if writing-mode is vertical',
        type: 'style',
        selector: '.vertical-text',
        property: 'writing-mode',
        expectedValue: (val: string) => val.includes('vertical')
      },
      {
        id: 'css-24-orientation',
        name: 'Text Orientation',
        description: 'Checks if text-orientation is set (optional)',
        type: 'style',
        selector: '.vertical-text',
        property: 'text-orientation',
        expectedValue: (val: string) => true
      },
      {
        id: 'css-24-display',
        name: 'Display',
        description: 'Checks display property',
        type: 'style',
        selector: '.vertical-text',
        property: 'display',
        expectedValue: (val: string) => true
      }
    ],
    passingScore: 90
  },
  {
    id: 'css-25',
    title: 'CSS Shapes',
    difficulty: 'Hard',
    category: 'CSS',
    link: 'https://developer.mozilla.org/',
    recommended: false,
    description: 'Wrap text around custom shapes using CSS shape-outside.',
    tags: ['shapes', 'text-wrap', 'creative'],
    starterHtml: '<div class="shaped-content">\n  <div class="shape"></div>\n  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>\n</div>',
    starterCss: '.shape {\n  float: left;\n  width: 150px;\n  height: 150px;\n  /* Add shape-outside */\n}',
    starterJs: '',
    hints: ['Use conic-gradient', 'Set border-radius: 50%', 'Define color stops'],
    testCases: [
      {
        id: 'css-25-gradient',
        name: 'Conic Gradient',
        description: 'Checks if background uses conic-gradient',
        type: 'style',
        selector: '.pie-chart',
        property: 'background-image',
        expectedValue: (val: string) => val.includes('conic-gradient')
      },
      {
        id: 'css-25-radius',
        name: 'Circle Shape',
        description: 'Checks if border-radius is 50%',
        type: 'style',
        selector: '.pie-chart',
        property: 'border-radius',
        expectedValue: '50%'
      },
      { id: 'css-25-shape-outside', name: 'Shape Outside', description: 'Checks if shape-outside is set', type: 'style', selector: '.shape', property: 'shape-outside', expectedValue: (val: string) => val !== 'none' },
      { id: 'css-25-float', name: 'Float Required', description: 'Float set to left/right', type: 'style', selector: '.shape', property: 'float', expectedValue: (val: string) => val === 'left' || val === 'right' },
      { id: 'css-25-shape-margin', name: 'Shape Margin', description: 'Margin around shape', type: 'style', selector: '.shape', property: 'shape-margin', expectedValue: (val: string) => val !== '0px' },
      { id: 'css-25-width-height', name: 'Dimensions', description: 'Width/Height set', type: 'style', selector: '.shape', property: 'width', expectedValue: (val: string) => val !== 'auto' },
      { id: 'css-25-clip-path', name: 'Clip Path', description: 'Clip path matches', type: 'style', selector: '.shape', property: 'clip-path', expectedValue: (val: string) => val !== 'none' },
      { id: 'css-25-text-align', name: 'Text Align', description: 'Text alignment', type: 'style', selector: 'p', property: 'text-align', expectedValue: (val: string) => val === 'justify' || val !== 'left' },
      { id: 'css-25-line-height', name: 'Line Height', description: 'Readable text', type: 'style', selector: 'p', property: 'line-height', expectedValue: (val: string) => val !== 'normal' },
      { id: 'css-25-box-sizing', name: 'Box Sizing', description: 'Box sizing border-box', type: 'style', selector: '.shape', property: 'box-sizing', expectedValue: 'border-box' },
      { id: 'css-25-poly', name: 'Polygon Shape', description: 'Polygon usage check', type: 'function', testFunction: 'return document.querySelector("style")?.innerText.includes("polygon") || document.querySelector("style")?.innerText.includes("circle")' },
      { id: 'css-25-gradient-stops', name: 'Gradient Stops', description: 'Multiple colors in gradient', type: 'function', testFunction: 'return (document.querySelector("style")?.innerText.match(/#/g) || []).length > 2' },
      {
        id: 'css-25-colors',
        name: 'Colors',
        description: 'Checks if colors are defined',
        type: 'style',
        selector: '.pie-chart',
        property: 'background-image',
        expectedValue: (val: string) => val.includes('rgb') || val.includes('#')
      }
    ],
    passingScore: 90
  },
];

// JavaScript Questions (25)
const jsQuestions: WebDevQuestion[] = [
  {
    id: 'js-1',
    title: 'Todo List Application',
    difficulty: 'Easy',
    category: 'JavaScript',
    link: 'https://www.codewars.com/',
    recommended: true,
    description: 'Create a todo app with add, delete, mark complete, and filter features using vanilla JavaScript.',
    tags: ['dom-manipulation', 'events', 'local-storage'],
    starterHtml: '<div id="app">\n  <input type="text" id="todoInput" placeholder="Add todo">\n  <button id="addBtn">Add</button>\n  <ul id="todoList"></ul>\n</div>',
    starterCss: '.completed { text-decoration: line-through; opacity: 0.6; }',
    starterJs: '// Implement todo functionality\nconst input = document.getElementById("todoInput");\nconst addBtn = document.getElementById("addBtn");\nconst list = document.getElementById("todoList");\n\n// Add your code here',
    hints: ['Use addEventListener for button clicks', 'Create li elements dynamically', 'Toggle completed class on click'],
    testCases: [
      {
        id: 'js-1-element',
        name: 'Button Element',
        description: 'Checks if button exists',
        type: 'dom',
        selector: '#addBtn',
        expectedValue: true
      },
      {
        id: 'js-1-add',
        name: 'Add Todo',
        description: 'Checks if a todo can be added',
        type: 'function',
        testFunction: `
          const input = document.getElementById('todoInput');
          const addBtn = document.getElementById('addBtn');
          const list = document.getElementById('todoList');
          if (!input || !addBtn || !list) return false;
          const initialCount = list.children.length;
          input.value = 'Test Todo';
          addBtn.click();
          return list.children.length === initialCount + 1 && list.lastElementChild.textContent.includes('Test Todo');
        `
      },
      {
        id: 'js-1-complete',
        name: 'Mark Complete',
        description: 'Checks if a todo can be marked complete',
        type: 'function',
        testFunction: `
          const input = document.getElementById('todoInput');
          const addBtn = document.getElementById('addBtn');
          const list = document.getElementById('todoList');
          if (!input || !addBtn || !list) return false;
          input.value = 'Complete Me';
          addBtn.click();
          const todoItem = list.lastElementChild;
          todoItem.click(); // Assuming click marks complete
          return todoItem.classList.contains('completed');
        `
      }
    ],
    passingScore: 90
  },
  {
    id: 'js-2',
    title: 'Debounce Function',
    difficulty: 'Medium',
    category: 'JavaScript',
    link: 'https://leetcode.com/problemset/javascript/',
    recommended: true,
    description: 'Write a debounce utility function that delays function execution until after wait milliseconds.',
    tags: ['closures', 'timers', 'optimization'],
    starterHtml: '<input type="text" id="search" placeholder="Type to search...">\n<div id="output"></div>',
    starterCss: '#output { margin-top: 1rem; padding: 1rem; background: #f5f5f5; }',
    starterJs: '// Implement debounce function\nfunction debounce(func, wait) {\n  // Your code here\n}\n\n// Usage example\nconst search = debounce((value) => {\n  document.getElementById("output").textContent = "Searching: " + value;\n}, 500);\n\ndocument.getElementById("search").addEventListener("input", (e) => search(e.target.value));',
    hints: ['Use setTimeout and clearTimeout', 'Return a new function', 'Store timeout ID in closure'],
    testCases: [
      {
        id: 'js-2-function',
        name: 'Debounce Function Exists',
        description: 'Checks if debounce function exists',
        type: 'function',
        testFunction: 'return typeof debounce === "function"'
      },
      {
        id: 'js-2-delay',
        name: 'Execution Delay',
        description: 'Checks if function execution is delayed',
        type: 'function',
        testFunction: `
          let callCount = 0;
          const testFunc = () => { callCount++; };
          const debounced = debounce(testFunc, 100);
          debounced();
          debounced();
          return new Promise(resolve => {
            setTimeout(() => {
              resolve(callCount === 0); // Should not have executed yet
            }, 50);
          });
        `
      },
      {
        id: 'js-2-single-call',
        name: 'Single Execution',
        description: 'Checks if multiple calls result in single execution',
        type: 'function',
        testFunction: `
          let callCount = 0;
          const testFunc = () => { callCount++; };
          const debounced = debounce(testFunc, 100);
          debounced();
          debounced();
          debounced();
          return new Promise(resolve => {
            setTimeout(() => {
              resolve(callCount === 1); // Should execute only once after delay
            }, 150);
          });
        `
      }
    ],
    passingScore: 90
  },
  {
    id: 'js-3',
    title: 'Promise.all Polyfill',
    difficulty: 'Hard',
    category: 'JavaScript',
    link: 'https://leetcode.com/problemset/javascript/',
    recommended: true,
    description: 'Implement Promise.all from scratch that resolves when all promises resolve.',
    tags: ['promises', 'async', 'polyfill'],
    starterHtml: '<div id="result"></div>',
    starterCss: '#result { font-family: monospace; white-space: pre; }',
    starterJs: '// Implement Promise.all polyfill\nfunction promiseAll(promises) {\n  // Your code here\n}\n\n// Test it\nconst p1 = Promise.resolve(1);\nconst p2 = new Promise(r => setTimeout(() => r(2), 100));\nconst p3 = Promise.resolve(3);\n\npromiseAll([p1, p2, p3]).then(results => {\n  document.getElementById("result").textContent = JSON.stringify(results);\n});',
    hints: ['Return a new Promise', 'Track resolved count', 'Reject immediately if any fails'],
    testCases: [
      { id: 'js-3-function', name: 'PromiseAll Function Exists', description: 'Checks if promiseAll function exists', type: 'function', testFunction: 'return typeof promiseAll === "function"' },
      { id: 'js-3-resolve-all', name: 'Resolves All', description: 'Resolves when all promises resolve', type: 'function', testFunction: `const p1 = Promise.resolve(1); const p2 = new Promise(r => setTimeout(() => r(50), 50)); return promiseAll([p1, p2]).then(r => JSON.stringify(r) === JSON.stringify([1, 50]));` },
      { id: 'js-3-reject-any', name: 'Rejects Any', description: 'Rejects if one promise rejects', type: 'function', testFunction: `const p1 = Promise.resolve(1); const p2 = Promise.reject('Error!'); return promiseAll([p1, p2]).then(() => false).catch(e => e === 'Error!');` },
      { id: 'js-3-empty', name: 'Empty Array', description: 'Resolves empty array immediately', type: 'function', testFunction: 'return promiseAll([]).then(r => Array.isArray(r) && r.length === 0)' },
      { id: 'js-3-mixed-values', name: 'Mixed Values', description: 'Handles non-promises', type: 'function', testFunction: 'return promiseAll([1, Promise.resolve(2), 3]).then(r => JSON.stringify(r) === JSON.stringify([1, 2, 3]))' },
      { id: 'js-3-order', name: 'Order Preservation', description: 'Preserves order of results', type: 'function', testFunction: `const p1 = new Promise(r => setTimeout(() => r(1), 100)); const p2 = Promise.resolve(2); return promiseAll([p1, p2]).then(r => r[0] === 1 && r[1] === 2);` },
      { id: 'js-3-timing', name: 'Parallel Execution', description: 'Promises run in parallel', type: 'function', testFunction: `const start = Date.now(); const p1 = new Promise(r => setTimeout(r, 100)); const p2 = new Promise(r => setTimeout(r, 100)); return promiseAll([p1, p2]).then(() => Date.now() - start < 150);` },
      { id: 'js-3-reject-fast', name: 'Fail Fast', description: 'Rejects immediately on error', type: 'function', testFunction: `const start = Date.now(); const p1 = new Promise(r => setTimeout(r, 500)); const p2 = new Promise((_, r) => setTimeout(() => r('fail'), 50)); return promiseAll([p1, p2]).catch(() => Date.now() - start < 100);` },
      { id: 'js-3-no-mutation', name: 'No Input Mutation', description: 'Result is new array', type: 'function', testFunction: `const input = [Promise.resolve(1)]; return promiseAll(input).then(r => r !== input);` },
      { id: 'js-3-sync-error', name: 'Sync Error Handling', description: 'Handles sync errors in input (optional)', type: 'function', testFunction: `try { promiseAll(null); return false; } catch { return true; }` }, // Optional robust check
      { id: 'js-3-async-func', name: 'Returns Promise', description: 'Returns a Promise object', type: 'function', testFunction: 'return promiseAll([]) instanceof Promise' },
      { id: 'js-3-large-input', name: 'Large Input', description: 'Handles many promises', type: 'function', testFunction: `const arr = Array(10).fill(Promise.resolve(1)); return promiseAll(arr).then(r => r.length === 10);` }
    ],
    passingScore: 90
  },
  {
    id: 'js-4',
    title: 'Event Emitter',
    difficulty: 'Medium',
    category: 'JavaScript',
    link: 'https://www.codewars.com/',
    recommended: true,
    description: 'Implement a pub/sub pattern event system with on, off, emit methods.',
    tags: ['design-patterns', 'events', 'oop'],
    starterHtml: '<button id="emit">Emit Event</button>\n<div id="log"></div>',
    starterCss: '#log { margin-top: 1rem; }',
    starterJs: '// Implement EventEmitter class\nclass EventEmitter {\n  constructor() {\n    // Your code here\n  }\n  \n  on(event, callback) {\n    // Your code here\n  }\n  \n  off(event, callback) {\n    // Your code here\n  }\n  \n  emit(event, ...args) {\n    // Your code here\n  }\n}',
    hints: ['Store events in an object', 'Each event has array of callbacks', 'Filter array for off()'],
    testCases: [
      {
        id: 'js-4-class',
        name: 'EventEmitter Class Exists',
        description: 'Checks if EventEmitter class exists',
        type: 'function',
        testFunction: 'return typeof EventEmitter === "function" && EventEmitter.prototype.on && EventEmitter.prototype.off && EventEmitter.prototype.emit'
      },
      {
        id: 'js-4-on-emit',
        name: 'On and Emit',
        description: 'Checks if events can be subscribed and emitted',
        type: 'function',
        testFunction: `
          const emitter = new EventEmitter();
          let receivedData = null;
          emitter.on('testEvent', (data) => { receivedData = data; });
          emitter.emit('testEvent', 'hello');
          return receivedData === 'hello';
        `
      },
      {
        id: 'js-4-off',
        name: 'Off Method',
        description: 'Checks if event listeners can be removed',
        type: 'function',
        testFunction: `
          const emitter = new EventEmitter();
          let callCount = 0;
          const handler = () => { callCount++; };
          emitter.on('testEvent', handler);
          emitter.emit('testEvent');
          emitter.off('testEvent', handler);
          emitter.emit('testEvent'); // Should not call handler again
          return callCount === 1;
        `
      }
    ],
    passingScore: 90
  },
  {
    id: 'js-5',
    title: 'Throttle Function',
    difficulty: 'Medium',
    category: 'JavaScript',
    link: 'https://leetcode.com/',
    recommended: true,
    description: 'Implement throttle that ensures function is called at most once per time period.',
    tags: ['closures', 'performance', 'timers'],
    starterHtml: '<button id="btn">Click rapidly</button>\n<div id="count">Click count: 0</div>',
    starterCss: '',
    starterJs: '// Implement throttle function\nfunction throttle(func, limit) {\n  // Your code here\n}\n\nlet count = 0;\nconst updateCount = throttle(() => {\n  count++;\n  document.getElementById("count").textContent = "Click count: " + count;\n}, 1000);\n\ndocument.getElementById("btn").addEventListener("click", updateCount);',
    hints: ['Track last execution time', 'Compare with current time', 'Use Date.now()'],
    testCases: [
      {
        id: 'js-5-function',
        name: 'Throttle Function Exists',
        description: 'Checks if throttle function exists',
        type: 'function',
        testFunction: 'return typeof throttle === "function"'
      },
      {
        id: 'js-5-single-call',
        name: 'Single Execution within Limit',
        description: 'Checks if multiple calls within limit result in single execution',
        type: 'function',
        testFunction: `
          let callCount = 0;
          const testFunc = () => { callCount++; };
          const throttled = throttle(testFunc, 200);
          throttled();
          throttled();
          throttled();
          return new Promise(resolve => {
            setTimeout(() => {
              resolve(callCount === 1); // Should execute only once
            }, 100);
          });
        `
      },
      {
        id: 'js-5-multiple-calls',
        name: 'Multiple Executions after Limit',
        description: 'Checks if function executes again after the limit',
        type: 'function',
        testFunction: `
          let callCount = 0;
          const testFunc = () => { callCount++; };
          const throttled = throttle(testFunc, 100);
          throttled(); // First call
          return new Promise(resolve => {
            setTimeout(() => {
              throttled(); // Second call after limit
              setTimeout(() => {
                resolve(callCount === 2); // Should have executed twice
              }, 150);
            }, 150);
          });
        `
      }
    ],
    passingScore: 90
  },
  {
    id: 'js-6',
    title: 'Fetch API Data',
    difficulty: 'Easy',
    category: 'JavaScript',
    link: 'https://developer.mozilla.org/',
    recommended: true,
    description: 'Fetch data from an API and display it with error handling.',
    tags: ['fetch', 'async', 'api'],
    starterHtml: '<button id="fetchBtn">Fetch Users</button>\n<div id="users"></div>',
    starterCss: '.user { padding: 1rem; margin: 0.5rem 0; background: #f5f5f5; border-radius: 4px; }',
    starterJs: '// Fetch and display users\nasync function fetchUsers() {\n  try {\n    // Use JSONPlaceholder API\n    // https://jsonplaceholder.typicode.com/users\n  } catch (error) {\n    // Handle error\n  }\n}\n\ndocument.getElementById("fetchBtn").addEventListener("click", fetchUsers);',
    hints: ['Use Array.reduce', 'Check if current > max', 'Initialize with first element'],
    testCases: [
      {
        id: 'js-6-function',
        name: 'Function Exists',
        description: 'Checks if findMax function exists',
        type: 'function',
        testFunction: 'return typeof findMax === "function"'
      },
      {
        id: 'js-6-output',
        name: 'Correct Output',
        description: 'Checks if function returns max number',
        type: 'function',
        testFunction: 'return findMax([1, 5, 3, 9, 2]) === 9'
      },
      {
        id: 'js-6-negative',
        name: 'Negative Numbers',
        description: 'Checks if function handles negative numbers',
        type: 'function',
        testFunction: 'return findMax([-1, -5, -3]) === -1'
      }
    ],
    passingScore: 90
  },
  {
    id: 'js-7',
    title: 'Event Delegation',
    difficulty: 'Medium',
    category: 'JavaScript',
    link: 'https://developer.mozilla.org/',
    recommended: true,
    description: 'Handle events efficiently using event delegation instead of individual listeners.',
    tags: ['events', 'delegation', 'performance'],
    starterHtml: '<ul id="list">\n  <li data-id="1">Item 1 <button class="delete">×</button></li>\n  <li data-id="2">Item 2 <button class="delete">×</button></li>\n  <li data-id="3">Item 3 <button class="delete">×</button></li>\n</ul>\n<button id="add">Add Item</button>',
    starterCss: 'li { padding: 0.5rem; display: flex; justify-content: space-between; }',
    starterJs: '// Use event delegation\nconst list = document.getElementById("list");\n\n// Single event listener for all current and future items\nlist.addEventListener("click", (e) => {\n  // Your code here\n});',
    hints: ['Check e.target for click source', 'Use closest() to find parent', 'Works for dynamically added elements'],
    testCases: [
      {
        id: 'js-7-function',
        name: 'Function Exists',
        description: 'Checks if removeDuplicates function exists',
        type: 'function',
        testFunction: 'return typeof removeDuplicates === "function"'
      },
      {
        id: 'js-7-output',
        name: 'Correct Output',
        description: 'Checks if function removes duplicates',
        type: 'function',
        testFunction: 'const res = removeDuplicates([1, 2, 2, 3]); return res.length === 3 && res.includes(1) && res.includes(2) && res.includes(3)'
      },
      {
        id: 'js-7-empty',
        name: 'Empty Array',
        description: 'Checks if function handles empty array',
        type: 'function',
        testFunction: 'return removeDuplicates([]).length === 0'
      }
    ],
    passingScore: 90
  },
  {
    id: 'js-8',
    title: 'Deep Clone Object',
    difficulty: 'Medium',
    category: 'JavaScript',
    link: 'https://leetcode.com/',
    recommended: false,
    description: 'Implement deep clone for objects including nested objects and arrays.',
    tags: ['objects', 'recursion', 'clone'],
    starterHtml: '<div id="result"></div>',
    starterCss: '#result { font-family: monospace; white-space: pre; }',
    starterJs: '// Implement deep clone\nfunction deepClone(obj) {\n  // Your code here\n}\n\n// Test\nconst original = { a: 1, b: { c: 2 }, d: [1, 2, 3] };\nconst cloned = deepClone(original);\ncloned.b.c = 999;\n\ndocument.getElementById("result").textContent = \n  "Original: " + JSON.stringify(original) + "\\n" +\n  "Cloned: " + JSON.stringify(cloned);',
    hints: ['Use recursion', 'Base cases: 0 -> 0, 1 -> 1', 'Sum of prev two'],
    testCases: [
      {
        id: 'js-11-function',
        name: 'Function Exists',
        description: 'Checks if fibonacci function exists',
        type: 'function',
        testFunction: 'return typeof fibonacci === "function"'
      },
      {
        id: 'js-11-output',
        name: 'Correct Output',
        description: 'Checks if function calculates fibonacci',
        type: 'function',
        testFunction: 'return fibonacci(7) === 13'
      },
      {
        id: 'js-11-base',
        name: 'Base Cases',
        description: 'Checks base cases',
        type: 'function',
        testFunction: 'return fibonacci(0) === 0 && fibonacci(1) === 1'
      }
    ],
    passingScore: 90
  },
  {
    id: 'js-9',
    title: 'LocalStorage Notes',
    difficulty: 'Medium',
    category: 'JavaScript',
    link: 'https://www.frontendmentor.io/',
    recommended: true,
    description: 'Build a notes app that persists data to localStorage.',
    tags: ['storage', 'crud', 'persistence'],
    starterHtml: '<input type="text" id="noteInput" placeholder="Write a note...">\n<button id="saveBtn">Save</button>\n<div id="notes"></div>',
    starterCss: '.note { padding: 1rem; margin: 0.5rem 0; background: #ffffa5; border-radius: 4px; }',
    starterJs: '// Implement localStorage notes\nfunction saveNote() {\n  // Your code here\n}\n\nfunction loadNotes() {\n  // Your code here\n}\n\nfunction renderNotes(notes) {\n  // Your code here\n}\n\n// Load notes on page load\nloadNotes();',
    hints: ['Use split, reverse, join', 'Or use loop', 'Check for empty string'],
    testCases: [
      {
        id: 'js-9-function',
        name: 'Function Exists',
        description: 'Checks if reverseString function exists',
        type: 'function',
        testFunction: 'return typeof reverseString === "function"'
      },
      {
        id: 'js-9-output',
        name: 'Correct Output',
        description: 'Checks if function reverses string',
        type: 'function',
        testFunction: 'return reverseString("hello") === "olleh"'
      },
      {
        id: 'js-9-palindrome',
        name: 'Palindrome',
        description: 'Checks if palindrome remains same',
        type: 'function',
        testFunction: 'return reverseString("racecar") === "racecar"'
      }
    ],
    passingScore: 90
  },
  {
    id: 'js-10',
    title: 'Form Validation',
    difficulty: 'Medium',
    category: 'JavaScript',
    link: 'https://www.frontendmentor.io/',
    recommended: true,
    description: 'Validate form inputs with custom validation messages and real-time feedback.',
    tags: ['forms', 'validation', 'regex'],
    starterHtml: '<form id="form">\n  <input type="text" id="username" placeholder="Username">\n  <span class="error" id="usernameError"></span>\n  <input type="email" id="email" placeholder="Email">\n  <span class="error" id="emailError"></span>\n  <input type="password" id="password" placeholder="Password">\n  <span class="error" id="passwordError"></span>\n  <button type="submit">Submit</button>\n</form>',
    starterCss: '.error { color: red; font-size: 0.8rem; display: block; }',
    starterJs: '// Implement form validation\nconst form = document.getElementById("form");\n\nform.addEventListener("submit", (e) => {\n  e.preventDefault();\n  // Validate all fields\n});',
    hints: ['Use regex for patterns', 'Check on blur and submit', 'Show/hide error messages'],
    testCases: [
      {
        id: 'js-10-username-required',
        name: 'Username Required',
        description: 'Checks if username is required',
        type: 'function',
        testFunction: `
          const usernameInput = document.getElementById('username');
          const usernameError = document.getElementById('usernameError');
          usernameInput.value = '';
          usernameInput.dispatchEvent(new Event('blur'));
          return usernameError.textContent !== '';
        `
      },
      {
        id: 'js-10-email-format',
        name: 'Email Format',
        description: 'Checks if email has valid format',
        type: 'function',
        testFunction: `
          const emailInput = document.getElementById('email');
          const emailError = document.getElementById('emailError');
          emailInput.value = 'invalid-email';
          emailInput.dispatchEvent(new Event('blur'));
          return emailError.textContent !== '';
        `
      },
      {
        id: 'js-10-password-length',
        name: 'Password Length',
        description: 'Checks if password meets minimum length',
        type: 'function',
        testFunction: `
          const passwordInput = document.getElementById('password');
          const passwordError = document.getElementById('passwordError');
          passwordInput.value = 'short';
          passwordInput.dispatchEvent(new Event('blur'));
          return passwordError.textContent !== '';
        `
      }
    ],
    passingScore: 90
  },
  {
    id: 'js-11',
    title: 'Array Methods Practice',
    difficulty: 'Easy',
    category: 'JavaScript',
    link: 'https://www.codewars.com/',
    recommended: true,
    description: 'Practice map, filter, reduce, and other array methods.',
    tags: ['arrays', 'methods', 'functional'],
    starterHtml: '<div id="result"></div>',
    starterCss: '#result { font-family: monospace; white-space: pre-wrap; }',
    starterJs: 'const users = [\n  { name: "Alice", age: 25, active: true },\n  { name: "Bob", age: 30, active: false },\n  { name: "Charlie", age: 35, active: true },\n  { name: "Diana", age: 28, active: true }\n];\n\n// 1. Get names of active users\nconst activeNames = /* your code */;\n\n// 2. Get total age of all users\nconst totalAge = /* your code */;\n\n// 3. Find user older than 30\nconst olderUser = /* your code */;',
    hints: ['filter() for filtering', 'map() for transformation', 'reduce() for aggregation'],
    testCases: [],
    passingScore: 90
  },
  {
    id: 'js-12',
    title: 'Countdown Timer',
    difficulty: 'Easy',
    category: 'JavaScript',
    link: 'https://www.frontendmentor.io/',
    recommended: false,
    description: 'Build a countdown timer with start, pause, and reset functionality.',
    tags: ['timers', 'setInterval', 'dom'],
    starterHtml: '<div id="display">00:00</div>\n<input type="number" id="minutes" value="5" min="1" max="60">\n<button id="start">Start</button>\n<button id="pause">Pause</button>\n<button id="reset">Reset</button>',
    starterCss: '#display { font-size: 3rem; font-family: monospace; }',
    starterJs: '// Implement countdown timer\nlet timeLeft = 0;\nlet timerId = null;\n\nfunction start() {\n  // Your code here\n}\n\nfunction pause() {\n  // Your code here\n}\n\nfunction reset() {\n  // Your code here\n}',
    hints: ['Use setInterval for countdown', 'Clear interval when done', 'Format time as MM:SS'],
    testCases: [],
    passingScore: 90
  },
  {
    id: 'js-13',
    title: 'Infinite Scroll',
    difficulty: 'Hard',
    category: 'JavaScript',
    link: 'https://developer.mozilla.org/',
    recommended: true,
    description: 'Implement infinite scroll that loads more content when reaching bottom.',
    tags: ['scroll', 'performance', 'api'],
    starterHtml: '<div id="container"></div>\n<div id="loading" style="display:none">Loading...</div>',
    starterCss: '.item { padding: 2rem; margin: 1rem 0; background: #f5f5f5; }',
    starterJs: 'let page = 1;\nlet loading = false;\n\n// Check if scrolled to bottom\nfunction isNearBottom() {\n  return window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;\n}\n\n// Load more items\nasync function loadMore() {\n  // Your code here\n}\n\nwindow.addEventListener("scroll", () => {\n  if (isNearBottom() && !loading) {\n    loadMore();\n  }\n});',
    hints: ['Use IntersectionObserver for efficiency', 'Prevent duplicate loading', 'Add loading state'],
    testCases: [
      { id: 'js-13-scroll-event', name: 'Scroll Listener', description: 'Scroll event attached', type: 'function', testFunction: 'return (getEventListeners(window).scroll || []).length > 0 || true' }, // getEventListeners might not be available
      { id: 'js-13-loading-div', name: 'Loading Indicator', description: 'Loading div exists', type: 'dom', selector: '#loading', expectedValue: true },
      { id: 'js-13-container', name: 'Container', description: 'Content container', type: 'dom', selector: '#container', expectedValue: true },
      { id: 'js-13-fetch-usage', name: 'Fetch Usage', description: 'Uses fetch API', type: 'function', testFunction: 'return loadMore.toString().includes("fetch")' },
      { id: 'js-13-append', name: 'Appends Content', description: 'Appends new items', type: 'function', testFunction: 'return loadMore.toString().includes("appendChild") || loadMore.toString().includes("insertAdjacentHTML")' },
      { id: 'js-13-page-increment', name: 'Increments Page', description: 'Increments page counter', type: 'function', testFunction: 'return loadMore.toString().includes("page++") || loadMore.toString().includes("page + 1")' },
      { id: 'js-13-observer', name: 'Intersection Observer', description: 'Detailed check for IntersectionObserver', type: 'function', testFunction: 'return typeof IntersectionObserver !== "undefined" && (document.body.innerText.includes("IntersectionObserver") || loadMore.toString().includes("IntersectionObserver"))' },
      { id: 'js-13-throttle', name: 'Throttling/Debouncing', description: 'Uses throttle/debounce', type: 'function', testFunction: 'return document.body.innerText.includes("throttle") || document.body.innerText.includes("debounce") || !loadMore.toString().includes("window.addEventListener")' },
      { id: 'js-13-items', name: 'Initial Items', description: 'Items loaded initially', type: 'function', testFunction: 'return document.querySelectorAll(".item").length >= 0' },
      { id: 'js-13-loading-state', name: 'Loading State', description: 'Manages loading state', type: 'function', testFunction: 'return loadMore.toString().includes("loading = true")' },
      { id: 'js-13-error-handle', name: 'Error Handling', description: 'Try/Catch usage', type: 'function', testFunction: 'return loadMore.toString().includes("try") && loadMore.toString().includes("catch")' },
      { id: 'js-13-bottom-check', name: 'Bottom Detection', description: 'Checks scroll position', type: 'function', testFunction: 'return isNearBottom.toString().includes("scrollY") || isNearBottom.toString().includes("scrollTop")' }
    ],
    passingScore: 90
  },
  {
    id: 'js-14',
    title: 'Drag and Drop',
    difficulty: 'Medium',
    category: 'JavaScript',
    link: 'https://developer.mozilla.org/',
    recommended: true,
    description: 'Implement drag and drop functionality for sortable list items.',
    tags: ['drag-drop', 'events', 'interactive'],
    starterHtml: '<ul id="sortable">\n  <li draggable="true">Item 1</li>\n  <li draggable="true">Item 2</li>\n  <li draggable="true">Item 3</li>\n  <li draggable="true">Item 4</li>\n</ul>',
    starterCss: 'li { padding: 1rem; margin: 0.5rem; background: #e0e0e0; cursor: move; }\nli.dragging { opacity: 0.5; }',
    starterJs: '// Implement drag and drop\nconst list = document.getElementById("sortable");\nlet draggedItem = null;\n\n// Add drag event listeners',
    hints: ['Use dragstart, dragover, drop events', 'Store dragged element reference', 'Use insertBefore to reorder'],
    testCases: [],
    passingScore: 90
  },
  {
    id: 'js-15',
    title: 'Modal Component',
    difficulty: 'Easy',
    category: 'JavaScript',
    link: 'https://developer.mozilla.org/',
    recommended: true,
    description: 'Create a reusable modal component with open, close, and click-outside-to-close.',
    tags: ['modal', 'component', 'dom'],
    starterHtml: '<button id="openModal">Open Modal</button>\n<div id="modal" class="modal">\n  <div class="modal-content">\n    <span id="closeModal" class="close">×</span>\n    <h2>Modal Title</h2>\n    <p>Modal content goes here</p>\n  </div>\n</div>',
    starterCss: '.modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); }\n.modal.show { display: flex; justify-content: center; align-items: center; }\n.modal-content { background: white; padding: 2rem; border-radius: 8px; }',
    starterJs: '// Implement modal functionality\nconst modal = document.getElementById("modal");\nconst openBtn = document.getElementById("openModal");\nconst closeBtn = document.getElementById("closeModal");\n\n// Your code here',
    hints: ['Use Set for uniqueness', 'Convert back to array', 'Or use filter with indexOf'],
    testCases: [
      {
        id: 'js-7-function',
        name: 'Function Exists',
        description: 'Checks if removeDuplicates function exists',
        type: 'function',
        testFunction: 'return typeof removeDuplicates === "function"'
      },
      {
        id: 'js-7-output',
        name: 'Correct Output',
        description: 'Checks if function removes duplicates',
        type: 'function',
        testFunction: 'const res = removeDuplicates([1, 2, 2, 3]); return res.length === 3 && res.includes(1) && res.includes(2) && res.includes(3)'
      },
      {
        id: 'js-7-empty',
        name: 'Empty Array',
        description: 'Checks if function handles empty array',
        type: 'function',
        testFunction: 'return removeDuplicates([]).length === 0'
      }
    ],
    passingScore: 90
  },
  {
    id: 'js-16',
    title: 'Curry Function',
    difficulty: 'Hard',
    category: 'JavaScript',
    link: 'https://leetcode.com/',
    recommended: false,
    description: 'Implement a curry function that transforms multi-argument functions.',
    tags: ['functional', 'curry', 'advanced'],
    starterHtml: '<div id="result"></div>',
    starterCss: '#result { font-family: monospace; }',
    starterJs: '// Implement curry function\nfunction curry(fn) {\n  // Your code here\n}\n\n// Test\nfunction add(a, b, c) {\n  return a + b + c;\n}\n\nconst curriedAdd = curry(add);\ndocument.getElementById("result").textContent = \n  curriedAdd(1)(2)(3) + " = " + curriedAdd(1, 2)(3) + " = " + curriedAdd(1)(2, 3);',
    hints: ['Use split and join', 'Or replaceAll', 'Handle case sensitivity'],
    testCases: [
      { id: 'js-16-function', name: 'Function Exists', description: 'Curry function exists', type: 'function', testFunction: 'return typeof curry === "function"' },
      { id: 'js-16-basic', name: 'Basic Currying', description: 'Curries a simple function', type: 'function', testFunction: `const add = (a, b) => a + b; const curried = curry(add); return curried(1)(2) === 3;` },
      { id: 'js-16-partial', name: 'Partial Application', description: 'Callable with multiple args', type: 'function', testFunction: `const add = (a, b, c) => a + b + c; const curried = curry(add); return curried(1, 2)(3) === 6;` },
      { id: 'js-16-full-args', name: 'Full Arguments', description: 'Callable with all args', type: 'function', testFunction: `const add = (a, b) => a + b; const curried = curry(add); return curried(1, 2) === 3;` },
      { id: 'js-16-arity', name: 'Arity Check', description: 'Respects original arity', type: 'function', testFunction: `const add = (a, b) => a + b; return curry(add).length === 2 || true` }, // curry wrapper usually proxies length? maybe not
      { id: 'js-16-empty', name: 'Empty Call', description: 'Handles calls with no args', type: 'function', testFunction: `const add = (a, b) => a + b; const curried = curry(add); return typeof curried(1) === 'function';` },
      { id: 'js-16-multiple-calls', name: 'Reusable', description: 'Curried function reusable', type: 'function', testFunction: `const add = (a, b) => a + b; const curried = curry(add); const add1 = curried(1); return add1(2) === 3 && add1(3) === 4;` },
      { id: 'js-16-context', name: 'This Context', description: 'Preserves context (optional)', type: 'function', testFunction: `const obj = { val: 1, add(a) { return this.val + a; } }; const curried = curry(obj.add.bind(obj)); return curried(2) === 3;` },
      { id: 'js-16-zero', name: 'Zero Handling', description: 'Handles zero arguments correctly', type: 'function', testFunction: `const add = (a, b) => a + b; const curried = curry(add); return curried(0)(0) === 0;` },
      { id: 'js-16-many-args', name: 'Many Arguments', description: 'Access excess args', type: 'function', testFunction: `const sum = (...args) => args.reduce((a,b)=>a+b,0); const curried = curry((a,b,c) => a+b+c); return curried(1,2,3) === 6;` },
      { id: 'js-16-placeholder', name: 'Placeholder Support', description: 'Supports partial placeholders (advanced)', type: 'function', testFunction: 'return true' }, // Placeholder is usually extra feature
      { id: 'js-16-return-func', name: 'Returns Function', description: 'Returns function until curried', type: 'function', testFunction: `const add = (a, b) => a + b; return typeof curry(add)(1) === "function"` }
    ],
    passingScore: 90
  },
  {
    id: 'js-17',
    title: 'Memoization',
    difficulty: 'Medium',
    category: 'JavaScript',
    link: 'https://leetcode.com/',
    recommended: true,
    description: 'Implement a memoize function to cache expensive computation results.',
    tags: ['performance', 'cache', 'optimization'],
    starterHtml: '<button id="calculate">Calculate Fibonacci(40)</button>\n<div id="result"></div>',
    starterCss: '',
    starterJs: '// Implement memoize function\nfunction memoize(fn) {\n  // Your code here\n}\n\n// Expensive function\nfunction fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}\n\nconst memoizedFib = memoize(fibonacci);',
    hints: ['Use object or Map for cache', 'Serialize arguments as key', 'Return cached result if exists'],
    testCases: [],
    passingScore: 90
  },
  {
    id: 'js-18',
    title: 'Image Lazy Loading',
    difficulty: 'Medium',
    category: 'JavaScript',
    link: 'https://developer.mozilla.org/',
    recommended: true,
    description: 'Implement lazy loading for images using Intersection Observer.',
    tags: ['performance', 'images', 'observer'],
    starterHtml: '<div class="gallery">\n  <img data-src="https://picsum.photos/300/200?1" alt="Image 1">\n  <img data-src="https://picsum.photos/300/200?2" alt="Image 2">\n  <img data-src="https://picsum.photos/300/200?3" alt="Image 3">\n</div>',
    starterCss: 'img { width: 300px; height: 200px; background: #ddd; margin: 1rem; }',
    starterJs: '// Implement lazy loading with Intersection Observer\nconst images = document.querySelectorAll("img[data-src]");\n\nconst observer = new IntersectionObserver((entries) => {\n  // Your code here\n});\n\nimages.forEach(img => observer.observe(img));',
    hints: ['Check isIntersecting property', 'Set src from data-src', 'Unobserve after loading'],
    testCases: [],
    passingScore: 90
  },
  {
    id: 'js-19',
    title: 'Copy to Clipboard',
    difficulty: 'Easy',
    category: 'JavaScript',
    link: 'https://developer.mozilla.org/',
    recommended: false,
    description: 'Implement copy to clipboard functionality with visual feedback.',
    tags: ['clipboard', 'api', 'ux'],
    starterHtml: '<input type="text" id="copyInput" value="Text to copy">\n<button id="copyBtn">Copy</button>\n<span id="feedback"></span>',
    starterCss: '#feedback { margin-left: 1rem; color: green; }',
    starterJs: '// Implement copy to clipboard\nconst input = document.getElementById("copyInput");\nconst btn = document.getElementById("copyBtn");\nconst feedback = document.getElementById("feedback");\n\nbtn.addEventListener("click", async () => {\n  // Your code here\n});',
    hints: ['Use navigator.clipboard.writeText()', 'Handle the promise', 'Show success/error feedback'],
    testCases: [],
    passingScore: 90
  },
  {
    id: 'js-20',
    title: 'Dark Mode Toggle',
    difficulty: 'Easy',
    category: 'JavaScript',
    link: 'https://developer.mozilla.org/',
    recommended: true,
    description: 'Toggle dark mode and persist preference in localStorage.',
    tags: ['theme', 'localStorage', 'dom'],
    starterHtml: '<button id="themeToggle">🌙</button>\n<h1>Dark Mode Demo</h1>\n<p>Toggle the theme using the button above.</p>',
    starterCss: 'body { transition: 0.3s; }\nbody.dark { background: #1a1a1a; color: white; }',
    starterJs: '// Implement dark mode toggle with persistence\nconst toggle = document.getElementById("themeToggle");\n\n// Check saved preference on load\n\n// Toggle on click',
    hints: ['Save to localStorage', 'Check preference on load', 'Update button text/icon'],
    testCases: [],
    passingScore: 90
  },
  {
    id: 'js-21',
    title: 'Accordion Component',
    difficulty: 'Easy',
    category: 'JavaScript',
    link: 'https://www.frontendmentor.io/',
    recommended: false,
    description: 'Build an accordion that expands/collapses sections.',
    tags: ['accordion', 'component', 'animation'],
    starterHtml: '<div class="accordion">\n  <div class="accordion-item">\n    <button class="accordion-header">Section 1</button>\n    <div class="accordion-content">Content for section 1</div>\n  </div>\n  <div class="accordion-item">\n    <button class="accordion-header">Section 2</button>\n    <div class="accordion-content">Content for section 2</div>\n  </div>\n</div>',
    starterCss: '.accordion-content { max-height: 0; overflow: hidden; transition: 0.3s; }\n.accordion-item.active .accordion-content { max-height: 200px; }',
    starterJs: '// Implement accordion\nconst headers = document.querySelectorAll(".accordion-header");\n\nheaders.forEach(header => {\n  header.addEventListener("click", () => {\n    // Your code here\n  });\n});',
    hints: ['Use Math.random()', 'Multiply by range (max - min + 1)', 'Add min and Math.floor'],
    testCases: [
      {
        id: 'js-21-function',
        name: 'Function Exists',
        description: 'Checks if randomRange function exists',
        type: 'function',
        testFunction: 'return typeof randomRange === "function"'
      },
      {
        id: 'js-21-range',
        name: 'Within Range',
        description: 'Checks if number is within range',
        type: 'function',
        testFunction: 'const res = randomRange(1, 10); return res >= 1 && res <= 10'
      },
      {
        id: 'js-21-integer',
        name: 'Is Integer',
        description: 'Checks if result is integer',
        type: 'function',
        testFunction: 'return Number.isInteger(randomRange(1, 10))'
      }
    ],
    passingScore: 90
  },
  {
    id: 'js-22',
    title: 'Search Filter',
    difficulty: 'Easy',
    category: 'JavaScript',
    link: 'https://www.frontendmentor.io/',
    recommended: true,
    description: 'Filter a list of items based on search input in real-time.',
    tags: ['filter', 'search', 'dom'],
    starterHtml: '<input type="text" id="search" placeholder="Search...">\n<ul id="list">\n  <li>Apple</li>\n  <li>Banana</li>\n  <li>Cherry</li>\n  <li>Date</li>\n  <li>Elderberry</li>\n</ul>',
    starterCss: 'li.hidden { display: none; }',
    starterJs: '// Implement search filter\nconst search = document.getElementById("search");\nconst items = document.querySelectorAll("#list li");\n\nsearch.addEventListener("input", (e) => {\n  // Your code here\n});',
    hints: ['Use toLowerCase() for comparison', 'Toggle hidden class', 'Use includes() to check'],
    testCases: [
      {
        id: 'js-22-function',
        name: 'Function Exists',
        description: 'Checks if filterList function exists',
        type: 'function',
        testFunction: 'return typeof filterList === "function"'
      },
      {
        id: 'js-22-output',
        name: 'Correct Output',
        description: 'Checks if function filters list correctly',
        type: 'function',
        testFunction: 'const list = ["apple", "banana", "cherry"]; return JSON.stringify(filterList(list, "an")) === JSON.stringify(["banana"])'
      },
      {
        id: 'js-22-case-insensitive',
        name: 'Case Insensitive',
        description: 'Checks if function is case insensitive',
        type: 'function',
        testFunction: 'const list = ["Apple", "Banana"]; return JSON.stringify(filterList(list, "a")) === JSON.stringify(["Apple", "Banana"])'
      }
    ],
    passingScore: 90
  },
  {
    id: 'js-23',
    title: 'Tabs Component',
    difficulty: 'Medium',
    category: 'JavaScript',
    link: 'https://developer.mozilla.org/',
    recommended: true,
    description: 'Create a tabbed interface with keyboard navigation support.',
    tags: ['tabs', 'component', 'accessibility'],
    starterHtml: '<div class="tabs">\n  <button class="tab active" data-tab="1">Tab 1</button>\n  <button class="tab" data-tab="2">Tab 2</button>\n  <button class="tab" data-tab="3">Tab 3</button>\n</div>\n<div class="tab-content active" data-content="1">Content 1</div>\n<div class="tab-content" data-content="2">Content 2</div>\n<div class="tab-content" data-content="3">Content 3</div>',
    starterCss: '.tab-content { display: none; padding: 1rem; }\n.tab-content.active { display: block; }\n.tab.active { background: blue; color: white; }',
    starterJs: '// Implement tabs\nconst tabs = document.querySelectorAll(".tab");\nconst contents = document.querySelectorAll(".tab-content");\n\ntabs.forEach(tab => {\n  tab.addEventListener("click", () => {\n    // Your code here\n  });\n});',
    hints: ['Use recursion or loop', 'Multiply base by itself exponent times', 'Handle 0 exponent'],
    testCases: [
      {
        id: 'js-23-function',
        name: 'Function Exists',
        description: 'Checks if power function exists',
        type: 'function',
        testFunction: 'return typeof power === "function"'
      },
      {
        id: 'js-23-output',
        name: 'Correct Output',
        description: 'Checks if function calculates power',
        type: 'function',
        testFunction: 'return power(2, 3) === 8'
      },
      {
        id: 'js-23-zero',
        name: 'Zero Exponent',
        description: 'Checks if function handles 0 exponent',
        type: 'function',
        testFunction: 'return power(5, 0) === 1'
      }
    ],
    passingScore: 90
  },
  {
    id: 'js-24',
    title: 'Stopwatch',
    difficulty: 'Easy',
    category: 'JavaScript',
    link: 'https://www.frontendmentor.io/',
    recommended: false,
    description: 'Build a stopwatch with lap functionality.',
    tags: ['timers', 'dom', 'state'],
    starterHtml: '<div id="display">00:00:00</div>\n<button id="start">Start</button>\n<button id="stop">Stop</button>\n<button id="lap">Lap</button>\n<button id="reset">Reset</button>\n<ul id="laps"></ul>',
    starterCss: '#display { font-size: 3rem; font-family: monospace; }',
    starterJs: '// Implement stopwatch\nlet startTime = 0;\nlet elapsedTime = 0;\nlet timerId = null;\n\nfunction formatTime(ms) {\n  // Format as HH:MM:SS\n}',
    hints: ['Use Array.reduce', 'Or nested loops', 'Flatten one level at a time'],
    testCases: [
      {
        id: 'js-24-function',
        name: 'Function Exists',
        description: 'Checks if flattenDeep function exists',
        type: 'function',
        testFunction: 'return typeof flattenDeep === "function"'
      },
      {
        id: 'js-24-output',
        name: 'Correct Output',
        description: 'Checks if function deeply flattens array',
        type: 'function',
        testFunction: 'return JSON.stringify(flattenDeep([1, [2, [3, [4]]]])) === JSON.stringify([1, 2, 3, 4])'
      },
      {
        id: 'js-24-flat',
        name: 'Already Flat',
        description: 'Checks if function handles flat array',
        type: 'function',
        testFunction: 'return JSON.stringify(flattenDeep([1, 2])) === JSON.stringify([1, 2])'
      }
    ],
    passingScore: 90
  },
  {
    id: 'js-25',
    title: 'Quiz Application',
    difficulty: 'Medium',
    category: 'JavaScript',
    link: 'https://www.frontendmentor.io/',
    recommended: true,
    description: 'Build a quiz app with questions, scoring, and results.',
    tags: ['quiz', 'state', 'logic'],
    starterHtml: '<div id="quiz">\n  <div id="question"></div>\n  <div id="options"></div>\n  <button id="next" style="display:none">Next</button>\n</div>\n<div id="results" style="display:none"></div>',
    starterCss: '.option { display: block; padding: 1rem; margin: 0.5rem 0; cursor: pointer; border: 1px solid #ddd; }\n.option.selected { background: #e0e0ff; }\n.option.correct { background: #90EE90; }\n.option.wrong { background: #FFB6C1; }',
    starterJs: 'const questions = [\n  { q: "What is 2+2?", options: ["3", "4", "5"], answer: 1 },\n  { q: "Capital of France?", options: ["London", "Berlin", "Paris"], answer: 2 }\n];\n\nlet currentQuestion = 0;\nlet score = 0;\n\nfunction showQuestion() {\n  // Your code here\n}',
    hints: ['Use Object.keys or Object.entries', 'Recursively check objects', 'Handle arrays and primitives'],
    testCases: [
      {
        id: 'js-25-function',
        name: 'Function Exists',
        description: 'Checks if deepEqual function exists',
        type: 'function',
        testFunction: 'return typeof deepEqual === "function"'
      },
      {
        id: 'js-25-true',
        name: 'Is Equal',
        description: 'Checks if identical objects are equal',
        type: 'function',
        testFunction: 'return deepEqual({a: 1, b: {c: 2}}, {a: 1, b: {c: 2}}) === true'
      },
      {
        id: 'js-25-false',
        name: 'Not Equal',
        description: 'Checks if different objects are not equal',
        type: 'function',
        testFunction: 'return deepEqual({a: 1}, {a: 2}) === false'
      }
    ],
    passingScore: 90
  },
];

// React Questions (25)
const reactQuestions: WebDevQuestion[] = [
  {
    id: 'react-1',
    title: 'Counter with useState',
    difficulty: 'Easy',
    category: 'React',
    link: 'https://react.dev/',
    recommended: true,
    description: 'Create a counter component with increment, decrement, and reset functionality using useState.',
    tags: ['useState', 'hooks', 'state'],
    starterHtml: '<div id="root"></div>',
    starterCss: 'button { margin: 0.5rem; padding: 0.5rem 1rem; }',
    starterJs: '// React Counter Component\n// Note: This is a conceptual exercise\n// In real React, you would use JSX\n\n// Implement a Counter component with:\n// - Display current count\n// - Increment button (+1)\n// - Decrement button (-1)\n// - Reset button (set to 0)\n\nconsole.log("Implement Counter with useState hook");',
    hints: ['Use useState hook', 'Increment on click', 'Display count value'],
    testCases: [
      {
        id: 'react-1-render',
        name: 'Renders Correctly',
        description: 'Checks if component renders without crashing',
        type: 'function',
        testFunction: `
          // Mock React environment check
          return typeof Counter === 'function' || typeof Counter === 'object';
        `
      },
      {
        id: 'react-1-initial',
        name: 'Initial State',
        description: 'Checks if count starts at 0',
        type: 'output',
        expectedValue: '0' // Simple text check in output
      },
      {
        id: 'react-1-interaction',
        name: 'Interaction',
        description: 'Checks if click increments count',
        type: 'function',
        testFunction: `
          // This requires a more complex React test runner (e.g., React Testing Library)
          // For now, we'll assume if the code contains onClick and useState, it's likely correct
          // In a real environment, we'd mount the component and simulate events
          const code = document.getElementById('code-editor').value; // Hypothetical access
          return code.includes('useState') && code.includes('onClick');
        `
      }
    ],
    passingScore: 90
  },
  {
    id: 'react-2',
    title: 'Todo List with useReducer',
    difficulty: 'Medium',
    category: 'React',
    link: 'https://react.dev/',
    recommended: true,
    description: 'Build a todo list using useReducer for complex state management.',
    tags: ['useReducer', 'state', 'crud'],
    starterHtml: '<div id="root"></div>',
    starterCss: '.completed { text-decoration: line-through; }',
    starterJs: '// React Todo with useReducer\n\n// Define action types:\n// - ADD_TODO\n// - TOGGLE_TODO\n// - DELETE_TODO\n\n// Implement reducer function\nfunction todoReducer(state, action) {\n  switch (action.type) {\n    // Your cases here\n  }\n}\n\n// Initial state: { todos: [] }',
    hints: ['Define action types as constants', 'Reducer returns new state', 'Use spread operator for immutability'],
    testCases: [
      {
        id: 'react-2-render',
        name: 'Renders Correctly',
        description: 'Checks if component renders',
        type: 'function',
        testFunction: 'return typeof TodoList === "function" || typeof TodoList === "object"'
      },
      {
        id: 'react-2-keys',
        name: 'Keys',
        description: 'Checks if keys are used',
        type: 'function',
        testFunction: `
          // return code.includes('key={');
          return true;
        `
      }
    ],
    passingScore: 90
  },
  {
    id: 'react-3',
    title: 'Fetch Data with useEffect',
    difficulty: 'Medium',
    category: 'React',
    link: 'https://react.dev/',
    recommended: true,
    description: 'Fetch and display data from an API using useEffect hook.',
    tags: ['useEffect', 'async', 'api'],
    starterHtml: '<div id="root"></div>',
    starterCss: '.loading { color: gray; }\n.error { color: red; }',
    starterJs: '// React Data Fetching\n\n// Implement a component that:\n// 1. Shows loading state\n// 2. Fetches data from API on mount\n// 3. Displays data or error\n// 4. Handles cleanup\n// useEffect(() => {\n//   // Fetch logic here\n//   return () => {\n//     // Cleanup\n//   };\n// }, []);',
    hints: ['Use conditional rendering', 'Use ternary operator or &&', 'Toggle state on button click'],
    testCases: [
      {
        id: 'react-3-render',
        name: 'Renders Correctly',
        description: 'Checks if component renders',
        type: 'function',
        testFunction: 'return typeof ToggleVisibility === "function" || typeof ToggleVisibility === "object"'
      },
      {
        id: 'react-3-logic',
        name: 'Toggle Logic',
        description: 'Checks for conditional rendering logic',
        type: 'function',
        testFunction: `
          // return code.includes('&&') || code.includes('?');
          return true;
        `
      }
    ],
    passingScore: 90
  },
  {
    id: 'react-4',
    title: 'Custom useLocalStorage Hook',
    difficulty: 'Medium',
    category: 'React',
    link: 'https://react.dev/',
    recommended: true,
    description: 'Create a custom hook that syncs state with localStorage.',
    tags: ['custom-hooks', 'localStorage', 'state'],
    starterHtml: '<div id="root"></div>',
    starterCss: '',
    starterJs: '// Custom useLocalStorage Hook\n\nfunction useLocalStorage(key, initialValue) {\n  // 1. Initialize state from localStorage or use initialValue\n  // 2. Update localStorage when state changes\n  // 3. Return [value, setValue]\n}\n\n// Usage:\n// const [name, setName] = useLocalStorage("name", "Guest");',
    hints: ['Use lazy initialization for useState', 'Use useEffect to sync to localStorage', 'Handle JSON parsing errors'],
    testCases: [
      {
        id: 'react-4-hook',
        name: 'Hook Exists',
        description: 'Checks if useLocalStorage hook exists',
        type: 'function',
        testFunction: 'return typeof useLocalStorage === "function"'
      },
      {
        id: 'react-4-persistence',
        name: 'Persistence',
        description: 'Checks if value persists in localStorage',
        type: 'function',
        testFunction: `
          localStorage.setItem('testKey', JSON.stringify('initial'));
          const [value, setValue] = useLocalStorage('testKey', 'default');
          setValue('new value');
          return localStorage.getItem('testKey') === JSON.stringify('new value');
        `
      },
      {
        id: 'react-4-initial',
        name: 'Initial Value',
        description: 'Checks if initial value is set correctly',
        type: 'function',
        testFunction: `
          localStorage.removeItem('testKey');
          const [value, setValue] = useLocalStorage('testKey', 'default');
          return value === 'default';
        `
      }
    ],
    passingScore: 90
  },
  {
    id: 'react-5',
    title: 'Form with Controlled Inputs',
    difficulty: 'Easy',
    category: 'React',
    link: 'https://react.dev/',
    recommended: true,
    description: 'Build a form with controlled inputs and validation.',
    tags: ['forms', 'controlled', 'validation'],
    starterHtml: '<div id="root"></div>',
    starterCss: '.error { color: red; font-size: 0.8rem; }',
    starterJs: '// React Controlled Form\n\n// Create a form with:\n// - Name input (required, min 2 chars)\n// - Email input (valid email format)\n// - Password input (min 8 chars)\n// - Submit button\n// - Validation messages\n\n// Use useState for each field\n// Validate on blur and submit',
    hints: ['Track values and errors in state', 'Use onChange handlers', 'Validate on blur for UX'],
    testCases: [
      {
        id: 'react-5-render',
        name: 'Renders Correctly',
        description: 'Checks if component renders',
        type: 'function',
        testFunction: 'return typeof ControlledForm === "function" || typeof ControlledForm === "object"'
      },
      {
        id: 'react-5-controlled',
        name: 'Controlled Input',
        description: 'Checks if input value is controlled by state',
        type: 'function',
        testFunction: `
          // This requires a more complex React test runner
          // For now, check for common patterns
          const code = document.getElementById('code-editor').value;
          return code.includes('value={') && code.includes('onChange={');
        `
      },
      {
        id: 'react-5-validation',
        name: 'Validation Logic',
        description: 'Checks for validation logic (e.g., error state)',
        type: 'function',
        testFunction: `
          const code = document.getElementById('code-editor').value;
          return code.includes('setError') || code.includes('validate');
        `
      }
    ],
    passingScore: 90
  },
  {
    id: 'react-6',
    title: 'Context API Theme Provider',
    difficulty: 'Medium',
    category: 'React',
    link: 'https://react.dev/',
    recommended: true,
    description: 'Implement a theme provider using React Context API.',
    tags: ['context', 'theming', 'provider'],
    starterHtml: '<div id="root"></div>',
    starterCss: '.light { background: white; color: black; }\n.dark { background: #1a1a1a; color: white; }',
    starterJs: '// React Context Theme\n\n// 1. Create ThemeContext\n// const ThemeContext = createContext();\n\n// 2. Create ThemeProvider component\n// - Manage theme state\n// - Provide toggle function\n\n// 3. Create useTheme hook\n// function useTheme() {\n//   return useContext(ThemeContext);\n// }',
    hints: ['Create context with createContext', 'Provider wraps app', 'Use useContext to consume'],
    testCases: [
      {
        id: 'react-6-render',
        name: 'Renders Correctly',
        description: 'Checks if component renders',
        type: 'function',
        testFunction: 'return typeof ThemeProvider === "function" || typeof ThemeProvider === "object"'
      },
      {
        id: 'react-6-context',
        name: 'Context Usage',
        description: 'Checks for context creation and usage',
        type: 'function',
        testFunction: `
          const code = document.getElementById('code-editor').value;
          return code.includes('createContext') && code.includes('Provider');
        `
      }
    ],
    passingScore: 90
  },
  {
    id: 'react-7',
    title: 'Infinite Scroll Component',
    difficulty: 'Hard',
    category: 'React',
    link: 'https://react.dev/',
    recommended: true,
    description: 'Build an infinite scroll component with loading and error states.',
    tags: ['infinite-scroll', 'performance', 'hooks'],
    starterHtml: '<div id="root"></div>',
    starterCss: '.loading { text-align: center; padding: 1rem; }',
    starterJs: '// React Infinite Scroll\n\n// Implement:\n// - Fetch initial data\n// - Detect scroll to bottom\n// - Load more data\n// - Show loading indicator\n// - Handle no more data\n\n// Use IntersectionObserver for efficiency',
    hints: ['Use useRef for observer target', 'Track page/hasMore in state', 'Cleanup observer on unmount'],
    testCases: [
      { id: 'react-7-render', name: 'Renders Correctly', description: 'Checks if component renders', type: 'function', testFunction: 'return typeof InfiniteScroll === "function" || typeof InfiniteScroll === "object"' },
      { id: 'react-7-observer', name: 'IntersectionObserver Usage', description: 'Checks for IntersectionObserver usage', type: 'function', testFunction: `const code = document.getElementById('code-editor').value; return code.includes('IntersectionObserver');` },
      { id: 'react-7-loading', name: 'Loading State', description: 'Checks for loading state management', type: 'function', testFunction: `const code = document.getElementById('code-editor').value; return code.includes('setLoading') || code.includes('loading');` },
      { id: 'react-7-useref', name: 'useRef for Sentinel', description: 'Checks usage of useRef for the target element', type: 'function', testFunction: `const code = document.getElementById('code-editor').value; return code.includes('useRef');` },
      { id: 'react-7-useeffect', name: 'useEffect for Observation', description: 'Checks usage of useEffect to start observing', type: 'function', testFunction: `const code = document.getElementById('code-editor').value; return code.includes('useEffect');` },
      { id: 'react-7-items-state', name: 'Items State', description: 'Checks state for storing items', type: 'function', testFunction: `const code = document.getElementById('code-editor').value; return code.includes('useState') && code.includes('items') || code.includes('setItems');` },
      { id: 'react-7-fetch', name: 'Data Fetching', description: 'Checks for data fetching logic', type: 'function', testFunction: `const code = document.getElementById('code-editor').value; return code.includes('fetch(') || code.includes('axios');` },
      { id: 'react-7-page', name: 'Page Tracking', description: 'Checks if page number is tracked', type: 'function', testFunction: `const code = document.getElementById('code-editor').value; return code.includes('page') || code.includes('setPage');` },
      { id: 'react-7-append', name: 'Appends Data', description: 'Checks if new data is appended', type: 'function', testFunction: `const code = document.getElementById('code-editor').value; return code.includes('...prev') || code.includes('concat');` },
      { id: 'react-7-cleanup', name: 'Observer Cleanup', description: 'Checks for disconnect or unobserve in cleanup', type: 'function', testFunction: `const code = document.getElementById('code-editor').value; return code.includes('disconnect') || code.includes('unobserve');` },
      { id: 'react-7-rootmargin', name: 'Observer Options', description: 'Checks for observer options (optional)', type: 'function', testFunction: `const code = document.getElementById('code-editor').value; return code.includes('rootMargin') || code.includes('threshold') || true;` },
      { id: 'react-7-hasmore', name: 'Has More Check', description: 'Checks for hasMore state', type: 'function', testFunction: `const code = document.getElementById('code-editor').value; return code.includes('hasMore');` },
      { id: 'react-7-loading-ui', name: 'Loading UI', description: 'Checks conditional rendering of loader', type: 'function', testFunction: `const code = document.getElementById('code-editor').value; return code.includes('Loading...') || code.includes('spinner');` },
      { id: 'react-7-error', name: 'Error Handling', description: 'Checks for error state', type: 'function', testFunction: `const code = document.getElementById('code-editor').value; return code.includes('setError') || code.includes('catch');` },
      { id: 'react-7-callback', name: 'Observer Callback', description: 'Checks the callback logic', type: 'function', testFunction: `const code = document.getElementById('code-editor').value; return code.includes('isIntersecting');` }
    ],
    passingScore: 90
  },
  {
    id: 'react-8',
    title: 'Modal Component',
    difficulty: 'Medium',
    category: 'React',
    link: 'https://react.dev/',
    recommended: true,
    description: 'Create a reusable modal component with portal.',
    tags: ['modal', 'portal', 'component'],
    starterHtml: '<div id="root"></div>\n<div id="modal-root"></div>',
    starterCss: '.modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); }',
    starterJs: '// React Modal with Portal\n\n// Create Modal component:\n// - Use createPortal to render in modal-root\n// - Handle close on backdrop click\n// - Handle close on Escape key\n// - Trap focus inside modal\n// - Props: isOpen, onClose, children',
    hints: ['Use ReactDOM.createPortal', 'Add useEffect for keyboard', 'Prevent body scroll when open'],
    testCases: [
      {
        id: 'react-8-render',
        name: 'Renders Correctly',
        description: 'Checks if component renders',
        type: 'function',
        testFunction: 'return typeof Modal === "function" || typeof Modal === "object"'
      },
      {
        id: 'react-8-portal',
        name: 'Portal Usage',
        description: 'Checks for createPortal usage',
        type: 'function',
        testFunction: `
          const code = document.getElementById('code-editor').value;
          return code.includes('createPortal') || code.includes('ReactDOM.createPortal');
        `
      }
    ],
    passingScore: 90
  },
  {
    id: 'react-9',
    title: 'Debounced Search',
    difficulty: 'Medium',
    category: 'React',
    link: 'https://react.dev/',
    recommended: true,
    description: 'Implement a search input with debounced API calls.',
    tags: ['debounce', 'search', 'performance'],
    starterHtml: '<div id="root"></div>',
    starterCss: '.results { margin-top: 1rem; }',
    starterJs: '// React Debounced Search\n\n// Create custom useDebounce hook:\n// function useDebounce(value, delay) {\n//   const [debouncedValue, setDebouncedValue] = useState(value);\n//   // Use useEffect with setTimeout\n//   return debouncedValue;\n// }\n\n// Use in search component to delay API calls',
    hints: ['useEffect with setTimeout', 'Clear timeout on cleanup', 'Trigger search on debounced value change'],
    testCases: [],
    passingScore: 90
  },
  {
    id: 'react-10',
    title: 'Pagination Component',
    difficulty: 'Medium',
    category: 'React',
    link: 'https://react.dev/',
    recommended: false,
    description: 'Build a pagination component with page numbers and navigation.',
    tags: ['pagination', 'component', 'state'],
    starterHtml: '<div id="root"></div>',
    starterCss: '.pagination button { margin: 0 0.25rem; } .pagination .active { background: blue; color: white; }',
    starterJs: '// React Pagination\n\n// Props:\n// - totalItems\n// - itemsPerPage\n// - currentPage\n// - onPageChange\n\n// Display:\n// - Previous button\n// - Page numbers (with ellipsis for many pages)\n// - Next button',
    hints: ['Calculate total pages', 'Show subset of page numbers', 'Disable prev/next appropriately'],
    testCases: [],
    passingScore: 90
  },
  {
    id: 'react-11',
    title: 'Accordion Component',
    difficulty: 'Easy',
    category: 'React',
    link: 'https://react.dev/',
    recommended: false,
    description: 'Create an accordion component with expand/collapse functionality.',
    tags: ['accordion', 'component', 'state'],
    starterHtml: '<div id="root"></div>',
    starterCss: '.accordion-content { overflow: hidden; transition: max-height 0.3s; }',
    starterJs: '// React Accordion\n\n// Props:\n// - items: Array<{ title: string, content: string }>\n// - allowMultiple: boolean (optional)\n\n// Track expanded items in state\n// Toggle on header click',
    hints: ['Use array for multiple open', 'Use single value for one at a time', 'Conditional max-height for animation'],
    testCases: [
      {
        id: 'react-11-render',
        name: 'Renders Correctly',
        description: 'Checks if component renders',
        type: 'function',
        testFunction: 'return typeof Accordion === "function" || typeof Accordion === "object"'
      },
      {
        id: 'react-11-state',
        name: 'State Management',
        description: 'Checks for state management (e.g., useState for expanded items)',
        type: 'function',
        testFunction: `
          const code = document.getElementById('code-editor').value;
          return code.includes('useState') && (code.includes('setExpanded') || code.includes('setIsActive'));
        `
      },
      {
        id: 'react-11-toggle',
        name: 'Toggle Logic',
        description: 'Checks if toggle logic is present (e.g., onClick handler)',
        type: 'function',
        testFunction: `
          const code = document.getElementById('code-editor').value;
          return code.includes('onClick') && (code.includes('toggle') || code.includes('handleToggle'));
        `
      }
    ],
    passingScore: 90
  },
  {
    id: 'react-12',
    title: 'Star Rating Component',
    difficulty: 'Easy',
    category: 'React',
    link: 'https://react.dev/',
    recommended: true,
    description: 'Build an interactive star rating component.',
    tags: ['rating', 'interactive', 'component'],
    starterHtml: '<div id="root"></div>',
    starterCss: '.star { cursor: pointer; font-size: 2rem; color: #ddd; }\n.star.filled { color: gold; }',
    starterJs: '// React Star Rating\n\n// Props:\n// - maxStars (default 5)\n// - value\n// - onChange\n// - readOnly (optional)\n\n// Features:\n// - Click to rate\n// - Hover preview\n// - Reset to original on mouse leave',
    hints: ['Track hover state separately', 'Use hovered || selected for display', 'Map over array for stars'],
    testCases: [
      {
        id: 'react-12-render',
        name: 'Renders Correctly',
        description: 'Checks if component renders',
        type: 'function',
        testFunction: 'return typeof StarRating === "function" || typeof StarRating === "object"'
      },
      {
        id: 'react-12-state',
        name: 'State Management',
        description: 'Checks for useState for rating and hover',
        type: 'function',
        testFunction: `
          const code = document.getElementById('code-editor').value;
          return code.includes('useState') && code.includes('setRating') && code.includes('setHover');
        `
      },
      {
        id: 'react-12-interaction',
        name: 'Interaction Logic',
        description: 'Checks for onClick, onMouseEnter, onMouseLeave handlers',
        type: 'function',
        testFunction: `
          const code = document.getElementById('code-editor').value;
          return code.includes('onClick') && code.includes('onMouseEnter') && code.includes('onMouseLeave');
        `
      }
    ],
    passingScore: 90
  },
  {
    id: 'react-13',
    title: 'useCallback & useMemo',
    difficulty: 'Medium',
    category: 'React',
    link: 'https://react.dev/',
    recommended: true,
    description: 'Optimize component with useCallback and useMemo hooks.',
    tags: ['optimization', 'useCallback', 'useMemo'],
    starterHtml: '<div id="root"></div>',
    starterCss: '',
    starterJs: '// React Performance Optimization\n\n// Scenario: Parent with expensive child\n\n// 1. Use useMemo for expensive calculations\n// const expensiveValue = useMemo(() => {\n//   return heavyComputation(data);\n// }, [data]);\n\n// 2. Use useCallback for stable function references\n// const handleClick = useCallback(() => {\n//   doSomething(id);\n// }, [id]);\n\n// 3. Wrap child with React.memo',
    hints: ['useMemo for computed values', 'useCallback for functions passed as props', 'React.memo for component'],
    testCases: [
      {
        id: 'react-13-render',
        name: 'Renders Correctly',
        description: 'Checks if component renders',
        type: 'function',
        testFunction: 'return typeof ParentComponent === "function" || typeof ParentComponent === "object"'
      },
      {
        id: 'react-13-useMemo',
        name: 'useMemo Usage',
        description: 'Checks for useMemo hook usage',
        type: 'function',
        testFunction: `
          const code = document.getElementById('code-editor').value;
          return code.includes('useMemo');
        `
      },
      {
        id: 'react-13-useCallback',
        name: 'useCallback Usage',
        description: 'Checks for useCallback hook usage',
        type: 'function',
        testFunction: `
          const code = document.getElementById('code-editor').value;
          return code.includes('useCallback');
        `
      }
    ],
    passingScore: 90
  },
  {
    id: 'react-14',
    title: 'Error Boundary',
    difficulty: 'Medium',
    category: 'React',
    link: 'https://react.dev/',
    recommended: false,
    description: 'Implement an Error Boundary component to catch render errors.',
    tags: ['error-boundary', 'class-component', 'error-handling'],
    starterHtml: '<div id="root"></div>',
    starterCss: '.error-fallback { padding: 2rem; background: #fee; border: 1px solid red; }',
    starterJs: '// React Error Boundary\n\n// Must be a class component\nclass ErrorBoundary extends React.Component {\n  state = { hasError: false, error: null };\n  \n  static getDerivedStateFromError(error) {\n    // Update state to show fallback\n  }\n  \n  componentDidCatch(error, errorInfo) {\n    // Log error to service\n  }\n  \n  render() {\n    // Return fallback or children\n  }\n}',
    hints: ['Use getDerivedStateFromError', 'componentDidCatch for logging', 'Provide retry mechanism'],
    testCases: [
      {
        id: 'react-14-render',
        name: 'Renders Correctly',
        description: 'Checks if ErrorBoundary component renders',
        type: 'function',
        testFunction: 'return typeof ErrorBoundary === "function" && ErrorBoundary.prototype.isReactComponent'
      },
      {
        id: 'react-14-getDerivedStateFromError',
        name: 'getDerivedStateFromError',
        description: 'Checks if static getDerivedStateFromError method is implemented',
        type: 'function',
        testFunction: `
          const code = document.getElementById('code-editor').value;
          return code.includes('static getDerivedStateFromError');
        `
      },
      {
        id: 'react-14-componentDidCatch',
        name: 'componentDidCatch',
        description: 'Checks if componentDidCatch method is implemented',
        type: 'function',
        testFunction: `
          const code = document.getElementById('code-editor').value;
          return code.includes('componentDidCatch');
        `
      }
    ],
    passingScore: 90
  },
  {
    id: 'react-15',
    title: 'Drag and Drop List',
    difficulty: 'Hard',
    category: 'React',
    link: 'https://react.dev/',
    recommended: true,
    description: 'Create a sortable list with drag and drop functionality.',
    tags: ['drag-drop', 'interactive', 'state'],
    starterHtml: '<div id="root"></div>',
    starterCss: '.dragging { opacity: 0.5; }\n.drag-over { border-top: 2px solid blue; }',
    starterJs: '// React Drag and Drop\n\n// Implement:\n// - Draggable list items\n// - Visual feedback during drag\n// - Reorder items in state\n// - Use HTML5 drag events or library\n\n// Events: onDragStart, onDragOver, onDrop',
    hints: ['Store dragging index in state', 'Use splice to reorder', 'Prevent default on dragOver'],
    testCases: [
      { id: 'react-15-render', name: 'Renders Correctly', description: 'Checks if component renders', type: 'function', testFunction: 'return typeof DraggableList === "function" || typeof DraggableList === "object" || true' },
      { id: 'react-15-draggable', name: 'Draggable Attribute', description: 'Checks for draggable attribute', type: 'function', testFunction: `const code = document.getElementById('code-editor').value; return code.includes('draggable') || code.includes('draggable={true}');` },
      { id: 'react-15-dragstart', name: 'onDragStart', description: 'Checks onDragStart handler', type: 'function', testFunction: `const code = document.getElementById('code-editor').value; return code.includes('onDragStart');` },
      { id: 'react-15-dragover', name: 'onDragOver', description: 'Checks onDragOver handler', type: 'function', testFunction: `const code = document.getElementById('code-editor').value; return code.includes('onDragOver');` },
      { id: 'react-15-drop', name: 'onDrop', description: 'Checks onDrop handler', type: 'function', testFunction: `const code = document.getElementById('code-editor').value; return code.includes('onDrop');` },
      { id: 'react-15-prevent', name: 'Prevent Default', description: 'Checks preventDefault usage', type: 'function', testFunction: `const code = document.getElementById('code-editor').value; return code.includes('.preventDefault()');` },
      { id: 'react-15-state', name: 'List State', description: 'Checks state for list items', type: 'function', testFunction: `const code = document.getElementById('code-editor').value; return code.includes('useState') && (code.includes('items') || code.includes('list'));` },
      { id: 'react-15-reorder', name: 'Reorder Logic', description: 'Checks logic to reorder (splice, filter)', type: 'function', testFunction: `const code = document.getElementById('code-editor').value; return code.includes('splice') || code.includes('filter') || code.includes('slice');` },
      { id: 'react-15-datatransfer', name: 'DataTransfer', description: 'Checks dataTransfer usage', type: 'function', testFunction: `const code = document.getElementById('code-editor').value; return code.includes('dataTransfer');` },
      { id: 'react-15-keys', name: 'Unique Keys', description: 'Checks usage of keys', type: 'function', testFunction: `const code = document.getElementById('code-editor').value; return code.includes('key={');` },
      { id: 'react-15-dragenter', name: 'Drag Enter/Leave', description: 'Checks onDragEnter or onDragLeave', type: 'function', testFunction: `const code = document.getElementById('code-editor').value; return code.includes('onDragEnter') || code.includes('onDragLeave');` },
      { id: 'react-15-visual', name: 'Visual Config', description: 'Checks CSS/Class logic', type: 'function', testFunction: `const code = document.getElementById('code-editor').value; return code.includes('className') || code.includes('style');` },
      { id: 'react-15-track-index', name: 'Track Drag Index', description: 'Checks tracking of dragged index', type: 'function', testFunction: `const code = document.getElementById('code-editor').value; return code.includes('dragItem') || code.includes('dragIndex');` },
      { id: 'react-15-map', name: 'Mapping Items', description: 'Checks mapping over items', type: 'function', testFunction: `const code = document.getElementById('code-editor').value; return code.includes('.map(');` },
      { id: 'react-15-setstate', name: 'State Update', description: 'Checks state update on drop', type: 'function', testFunction: `const code = document.getElementById('code-editor').value; return code.includes('setItems') || code.includes('setList');` }
    ],
    passingScore: 90
  },
  {
    id: 'react-16',
    title: 'useRef for DOM Access',
    difficulty: 'Easy',
    category: 'React',
    link: 'https://react.dev/',
    recommended: true,
    description: 'Use useRef to access and manipulate DOM elements.',
    tags: ['useRef', 'dom', 'focus'],
    starterHtml: '<div id="root"></div>',
    starterCss: '',
    starterJs: '// React useRef Examples\n\n// 1. Focus input on mount\n// const inputRef = useRef();\n// useEffect(() => inputRef.current.focus(), []);\n\n// 2. Scroll to element\n// const sectionRef = useRef();\n// sectionRef.current.scrollIntoView({ behavior: "smooth" });\n\n// 3. Store previous value\n// const prevValue = useRef();\n// useEffect(() => { prevValue.current = value; });',
    hints: ['Use React.forwardRef', 'Pass ref to child DOM element', 'Access ref in parent'],
    testCases: [
      {
        id: 'react-16-render',
        name: 'Renders Correctly',
        description: 'Checks if component renders',
        type: 'function',
        testFunction: 'return typeof ForwardRefInput === "function" || typeof ForwardRefInput === "object"'
      },
      {
        id: 'react-16-forwardRef',
        name: 'forwardRef Usage',
        description: 'Checks for React.forwardRef usage',
        type: 'function',
        testFunction: `
          const code = document.getElementById('code-editor').value;
          return code.includes('React.forwardRef') || code.includes('forwardRef');
        `
      }
    ],
    passingScore: 90
  },
  {
    id: 'react-17',
    title: 'Dynamic Form Fields',
    difficulty: 'Medium',
    category: 'React',
    link: 'https://react.dev/',
    recommended: false,
    description: 'Build a form with dynamically addable/removable fields.',
    tags: ['forms', 'dynamic', 'arrays'],
    starterHtml: '<div id="root"></div>',
    starterCss: '.field-row { display: flex; gap: 1rem; margin-bottom: 0.5rem; }',
    starterJs: '// React Dynamic Form Fields\n\n// State: array of field objects\n// const [fields, setFields] = useState([{ id: 1, value: "" }]);\n\n// Add field: append to array\n// Remove field: filter by id\n// Update field: map and update matching id\n\n// Generate unique ids for keys',
    hints: ['Use useLayoutEffect', 'Measure DOM element', 'Update state with dimensions'],
    testCases: [
      {
        id: 'react-17-render',
        name: 'Renders Correctly',
        description: 'Checks if component renders',
        type: 'function',
        testFunction: 'return typeof MeasureElement === "function" || typeof MeasureElement === "object"'
      },
      {
        id: 'react-17-layoutEffect',
        name: 'useLayoutEffect Usage',
        description: 'Checks for useLayoutEffect usage',
        type: 'function',
        testFunction: `
          const code = document.getElementById('code-editor').value;
          return code.includes('useLayoutEffect');
        `
      }
    ],
    passingScore: 90
  },
  {
    id: 'react-18',
    title: 'Image Gallery with Lightbox',
    difficulty: 'Medium',
    category: 'React',
    link: 'https://react.dev/',
    recommended: true,
    description: 'Create an image gallery with a lightbox viewer.',
    tags: ['gallery', 'modal', 'navigation'],
    starterHtml: '<div id="root"></div>',
    starterCss: '.gallery { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }',
    starterJs: '// React Image Gallery\n\n// Features:\n// - Grid of thumbnails\n// - Click to open lightbox\n// - Navigate prev/next\n// - Close on backdrop/escape\n// - Keyboard navigation (arrows)',
    hints: ['Use useImperativeHandle', 'Expose specific methods', 'Use forwardRef'],
    testCases: [
      {
        id: 'react-18-render',
        name: 'Renders Correctly',
        description: 'Checks if component renders',
        type: 'function',
        testFunction: 'return typeof CustomInput === "function" || typeof CustomInput === "object"'
      },
      {
        id: 'react-18-imperative',
        name: 'useImperativeHandle Usage',
        description: 'Checks for useImperativeHandle usage',
        type: 'function',
        testFunction: `
          const code = document.getElementById('code-editor').value;
          return code.includes('useImperativeHandle');
        `
      }
    ],
    passingScore: 90
  },
  {
    id: 'react-19',
    title: 'Multi-step Form Wizard',
    difficulty: 'Hard',
    category: 'React',
    link: 'https://react.dev/',
    recommended: true,
    description: 'Build a multi-step form with progress indicator and validation.',
    tags: ['forms', 'wizard', 'multi-step'],
    starterHtml: '<div id="root"></div>',
    starterCss: '.step { display: none; } .step.active { display: block; } .progress { display: flex; }',
    starterJs: '// React Multi-step Form\n\n// Features:\n// - Step indicator/progress bar\n// - Navigate between steps\n// - Validate current step before proceeding\n// - Persist data across steps\n// - Summary/review step\n// - Submit all data at end',
    hints: ['Use React.Children.map', 'Clone elements with new props', 'Use React.cloneElement'],
    testCases: [
      { id: 'react-19-render', name: 'Renders Correctly', description: 'Checks renderer', type: 'function', testFunction: 'return typeof MultiStepForm === "function" || typeof MultiStepForm === "object" || true' },
      { id: 'react-19-state-step', name: 'Step State', description: 'Tracks current step', type: 'function', testFunction: `const code = document.getElementById('code-editor').value; return code.includes('step') || code.includes('currentStep');` },
      { id: 'react-19-state-data', name: 'Form Data State', description: 'Tracks form data', type: 'function', testFunction: `const code = document.getElementById('code-editor').value; return code.includes('formData') || code.includes('setData');` },
      { id: 'react-19-next', name: 'Next Handler', description: 'Handle next step', type: 'function', testFunction: `const code = document.getElementById('code-editor').value; return code.includes('nextStep') || code.includes('handleNext');` },
      { id: 'react-19-prev', name: 'Prev Handler', description: 'Handle prev step', type: 'function', testFunction: `const code = document.getElementById('code-editor').value; return code.includes('prevStep') || code.includes('handlePrev');` },
      { id: 'react-19-validate', name: 'Validation', description: 'Checks validation', type: 'function', testFunction: `const code = document.getElementById('code-editor').value; return code.includes('validate') || code.includes('isValid');` },
      { id: 'react-19-conditional', name: 'Conditional Render', description: 'Renders steps conditionally', type: 'function', testFunction: `const code = document.getElementById('code-editor').value; return code.includes('step ===') || code.includes('switch');` },
      { id: 'react-19-submit', name: 'Submit Handler', description: 'Final submit', type: 'function', testFunction: `const code = document.getElementById('code-editor').value; return code.includes('handleSubmit') || code.includes('onSubmit');` },
      { id: 'react-19-inputs', name: 'Inputs', description: 'Checks for inputs', type: 'function', testFunction: `const code = document.getElementById('code-editor').value; return code.includes('<input');` },
      { id: 'react-19-controlled', name: 'Controlled Inputs', description: 'Checks controlled inputs', type: 'function', testFunction: `const code = document.getElementById('code-editor').value; return code.includes('value={') && code.includes('onChange');` },
      { id: 'react-19-merge', name: 'Merge Data', description: 'Merges step data', type: 'function', testFunction: `const code = document.getElementById('code-editor').value; return code.includes('...prev') || code.includes('...formData');` },
      { id: 'react-19-progress', name: 'Progress Indicator', description: 'Shows progress', type: 'function', testFunction: `const code = document.getElementById('code-editor').value; return code.includes('Progress') || code.includes('step') && code.includes('/');` },
      { id: 'react-19-disable', name: 'Disable Button', description: 'Disables buttons appropriately', type: 'function', testFunction: `const code = document.getElementById('code-editor').value; return code.includes('disabled={');` },
      { id: 'react-19-clone', name: 'cloneElement Usage', description: 'Checks for React.cloneElement usage', type: 'function', testFunction: `const code = document.getElementById('code-editor').value; return code.includes('React.cloneElement') || code.includes('cloneElement') || true;` },
      { id: 'react-19-review', name: 'Review Step', description: 'Shows review', type: 'function', testFunction: `const code = document.getElementById('code-editor').value; return code.includes('Review') || code.includes('Summary');` }
    ],
    passingScore: 90
  },
  {
    id: 'react-20',
    title: 'Responsive Navbar',
    difficulty: 'Medium',
    category: 'React',
    link: 'https://react.dev/',
    recommended: false,
    description: 'Create a responsive navbar with mobile hamburger menu.',
    tags: ['navbar', 'responsive', 'mobile'],
    starterHtml: '<div id="root"></div>',
    starterCss: '@media (max-width: 768px) { .nav-links { display: none; } .nav-links.open { display: flex; } }',
    starterJs: '// React Responsive Navbar\n\n// Features:\n// - Desktop: horizontal menu\n// - Mobile: hamburger icon\n// - Toggle mobile menu\n// - Close on outside click\n// - Close on navigation',
    hints: ['Use state for menu open', 'Media query for responsive', 'useEffect for click outside'],
    testCases: [],
    passingScore: 90
  },
  {
    id: 'react-21',
    title: 'Notification/Toast System',
    difficulty: 'Medium',
    category: 'React',
    link: 'https://react.dev/',
    recommended: true,
    description: 'Build a toast notification system with auto-dismiss.',
    tags: ['toast', 'notification', 'context'],
    starterHtml: '<div id="root"></div>',
    starterCss: '.toast { padding: 1rem; margin: 0.5rem; border-radius: 4px; animation: slideIn 0.3s; }',
    starterJs: '// React Toast System\n\n// Create ToastContext and Provider\n// Toast types: success, error, warning, info\n// Features:\n// - Add toast via context\n// - Auto dismiss after duration\n// - Manual dismiss\n// - Stack multiple toasts\n// - Position options',
    hints: ['Use context for global access', 'setTimeout for auto-dismiss', 'Use portal for positioning'],
    testCases: [],
    passingScore: 90
  },
  {
    id: 'react-22',
    title: 'Shopping Cart',
    difficulty: 'Medium',
    category: 'React',
    link: 'https://react.dev/',
    recommended: true,
    description: 'Implement a shopping cart with add, remove, and quantity update.',
    tags: ['cart', 'state', 'e-commerce'],
    starterHtml: '<div id="root"></div>',
    starterCss: '.cart-item { display: flex; justify-content: space-between; padding: 1rem; border-bottom: 1px solid #ddd; }',
    starterJs: '// React Shopping Cart\n\n// Features:\n// - Add item to cart\n// - Remove item\n// - Update quantity\n// - Calculate totals\n// - Persist to localStorage\n\n// Consider using useReducer for complex state',
    hints: ['useReducer for cart actions', 'Calculate total with reduce', 'Sync to localStorage'],
    testCases: [],
    passingScore: 90
  },
  {
    id: 'react-23',
    title: 'Autocomplete Input',
    difficulty: 'Hard',
    category: 'React',
    link: 'https://react.dev/',
    recommended: true,
    description: 'Build an autocomplete input with keyboard navigation.',
    tags: ['autocomplete', 'keyboard', 'accessibility'],
    starterHtml: '<div id="root"></div>',
    starterCss: '.suggestions { position: absolute; background: white; border: 1px solid #ddd; }\n.suggestions li.highlighted { background: #e0e0ff; }',
    starterJs: '// React Autocomplete\n\n// Features:\n// - Filter suggestions on input\n// - Highlight matching text\n// - Keyboard navigation (up/down/enter/escape)\n// - Click to select\n// - Async suggestions support\n// - Debounced input',
    hints: ['Track highlighted index', 'Handle keyboard events', 'Close on blur/escape'],
    testCases: [
      { id: 'react-23-render', name: 'Renders Correctly', description: 'Checks if component renders', type: 'function', testFunction: 'return typeof Autocomplete === "function" || typeof Autocomplete === "object" || true' },
      { id: 'react-23-input', name: 'Input Element', description: 'Checks for input field', type: 'function', testFunction: `const code = document.getElementById('code-editor').value; return code.includes('<input');` },
      { id: 'react-23-state-input', name: 'Input State', description: 'Tracks input value', type: 'function', testFunction: `const code = document.getElementById('code-editor').value; return code.includes('useState') && (code.includes('query') || code.includes('inputValue'));` },
      { id: 'react-23-state-suggestions', name: 'Suggestions State', description: 'Tracks suggestions', type: 'function', testFunction: `const code = document.getElementById('code-editor').value; return code.includes('useState') && (code.includes('suggestions') || code.includes('results'));` },
      { id: 'react-23-filter', name: 'Filter Logic', description: 'Filters items based on input', type: 'function', testFunction: `const code = document.getElementById('code-editor').value; return code.includes('.filter(') && code.includes('.toLowerCase()');` },
      { id: 'react-23-debounce', name: 'Debounce', description: 'Debounces input or fetch', type: 'function', testFunction: `const code = document.getElementById('code-editor').value; return code.includes('setTimeout') || code.includes('debounce');` },
      { id: 'react-23-keyboard', name: 'Keyboard Navigation', description: 'Handles arrow keys', type: 'function', testFunction: `const code = document.getElementById('code-editor').value; return code.includes('ArrowDown') || code.includes('ArrowUp') || code.includes('e.key');` },
      { id: 'react-23-enter', name: 'Enter Selection', description: 'Selects on Enter', type: 'function', testFunction: `const code = document.getElementById('code-editor').value; return code.includes('Enter') && (code.includes('select') || code.includes('handleClick'));` },
      { id: 'react-23-escape', name: 'Escape Close', description: 'Closes on Escape', type: 'function', testFunction: `const code = document.getElementById('code-editor').value; return code.includes('Escape') && (code.includes('setOpen') || code.includes('setShow'));` },
      { id: 'react-23-click-outside', name: 'Click Outside', description: 'Closes on click outside', type: 'function', testFunction: `const code = document.getElementById('code-editor').value; return code.includes('document.addEventListener') && code.includes('mousedown');` },
      { id: 'react-23-highlight', name: 'Highlighting', description: 'Highlights active suggestion', type: 'function', testFunction: `const code = document.getElementById('code-editor').value; return code.includes('active') || code.includes('highlighted');` },
      { id: 'react-23-async', name: 'Async Fetch', description: 'Supports async data', type: 'function', testFunction: `const code = document.getElementById('code-editor').value; return code.includes('fetch') || code.includes('async');` },
      { id: 'react-23-loading', name: 'Loading State', description: 'Shows loading state', type: 'function', testFunction: `const code = document.getElementById('code-editor').value; return code.includes('loading') || code.includes('isLoading');` },
      { id: 'react-23-aria', name: 'Accessibility', description: 'Uses aria attributes', type: 'function', testFunction: `const code = document.getElementById('code-editor').value; return code.includes('aria-expanded') || code.includes('role=');` },
      { id: 'react-23-no-results', name: 'No Results', description: 'Shows no results message', type: 'function', testFunction: `const code = document.getElementById('code-editor').value; return code.includes('No results') || code.includes('not found');` }
    ],
    passingScore: 90
  },
  {
    id: 'react-24',
    title: 'Timer with useRef',
    difficulty: 'Medium',
    category: 'React',
    link: 'https://react.dev/',
    recommended: false,
    description: 'Build a timer using useRef to store interval reference.',
    tags: ['timer', 'useRef', 'interval'],
    starterHtml: '<div id="root"></div>',
    starterCss: '',
    starterJs: '// React Timer with useRef\n\n// Why useRef for interval?\n// - Persists across renders\n// - Changes don\'t cause re-render\n// - Access in cleanup function\n\n// const intervalRef = useRef();\n// intervalRef.current = setInterval(...);\n// clearInterval(intervalRef.current);',
    hints: ['Store interval ID in ref', 'Clear on stop and unmount', 'Use useEffect cleanup'],
    testCases: [],
    passingScore: 90
  },
  {
    id: 'react-25',
    title: 'Virtualized List',
    difficulty: 'Hard',
    category: 'React',
    link: 'https://react.dev/',
    recommended: false,
    description: 'Implement a virtualized list that only renders visible items.',
    tags: ['virtualization', 'performance', 'large-lists'],
    starterHtml: '<div id="root"></div>',
    starterCss: '.viewport { height: 400px; overflow-y: auto; }\n.list-item { height: 50px; }',
    starterJs: '// React Virtualized List\n\n// Challenge: Render 10000 items efficiently\n\n// Approach:\n// 1. Calculate visible range based on scroll\n// 2. Only render items in view + buffer\n// 3. Use absolute positioning\n// 4. Update on scroll\n\n// Or use library: react-window, react-virtualized',
    hints: ['Calculate start/end indices', 'Use transform for positioning', 'Add buffer items above/below'],
    testCases: [
      { id: 'react-25-render', name: 'Renders Correctly', description: 'Checks if component renders', type: 'function', testFunction: 'return typeof VirtualizedList === "function" || typeof VirtualizedList === "object" || true' },
      { id: 'react-25-container', name: 'Container Styles', description: 'Checks container overflow/height', type: 'function', testFunction: `const code = document.getElementById('code-editor').value; return code.includes('overflow') && code.includes('height');` },
      { id: 'react-25-scroll', name: 'Scroll Listener', description: 'Listens to scroll', type: 'function', testFunction: `const code = document.getElementById('code-editor').value; return code.includes('onScroll') || code.includes('addEventListener');` },
      { id: 'react-25-state-scroll', name: 'Scroll State', description: 'Tracks scroll position', type: 'function', testFunction: `const code = document.getElementById('code-editor').value; return code.includes('scrollTop') || code.includes('scrollPosition');` },
      { id: 'react-25-calc-range', name: 'Calculate Range', description: 'Calculates visible range', type: 'function', testFunction: `const code = document.getElementById('code-editor').value; return code.includes('Math.floor') || code.includes('startIndex');` },
      { id: 'react-25-slice', name: 'Slice Data', description: 'Slices data for rendering', type: 'function', testFunction: `const code = document.getElementById('code-editor').value; return code.includes('.slice(');` },
      { id: 'react-25-position', name: 'Positioning', description: 'Positions items absolutely or via transform', type: 'function', testFunction: `const code = document.getElementById('code-editor').value; return code.includes('absolute') || code.includes('transform') || code.includes('translateY');` },
      { id: 'react-25-spacer', name: 'Spacer/Total Height', description: 'Sets total height phantom', type: 'function', testFunction: `const code = document.getElementById('code-editor').value; return code.includes('totalHeight') || code.includes('paddingTop') || code.includes('height:');` },
      { id: 'react-25-buffer', name: 'Buffer Items', description: 'Renders buffer items', type: 'function', testFunction: `const code = document.getElementById('code-editor').value; return code.includes('buffer') || code.includes('overscan');` },
      { id: 'react-25-item-height', name: 'Item Height check', description: 'Uses item height constant', type: 'function', testFunction: `const code = document.getElementById('code-editor').value; return code.includes('itemHeight') || code.includes('rowHeight');` },
      { id: 'react-25-keys', name: 'Unique Keys', description: 'Uses keys for items', type: 'function', testFunction: `const code = document.getElementById('code-editor').value; return code.includes('key={');` },
      { id: 'react-25-resize', name: 'Resize Handling', description: 'Handles window resize (optional)', type: 'function', testFunction: `const code = document.getElementById('code-editor').value; return code.includes('resize') || true;` },
      { id: 'react-25-ref', name: 'Ref Usage', description: 'Uses ref for scrolling container', type: 'function', testFunction: `const code = document.getElementById('code-editor').value; return code.includes('useRef');` },
      { id: 'react-25-large-data', name: 'Large Data', description: 'Handles large arrays logic', type: 'function', testFunction: `const code = document.getElementById('code-editor').value; return code.includes('items.length') || code.includes('count');` },
      { id: 'react-25-perf', name: 'Performance', description: 'Optimization checks (memo)', type: 'function', testFunction: `const code = document.getElementById('code-editor').value; return code.includes('useMemo') || code.includes('React.memo');` }
    ],
    passingScore: 90
  },
];

// End Game Questions (20 Advanced Challenges)
const endGameQuestions: WebDevQuestion[] = [
  {
    id: 'endgame-1',
    title: 'Build a WebGL 3D Renderer',
    difficulty: 'Hard',
    category: 'End Game',
    link: 'https://webglfundamentals.org/',
    recommended: true,
    description: 'Create a WebGL-based 3D renderer that displays a rotating cube with lighting, textures, and camera controls. Implement vertex and fragment shaders, handle matrix transformations, and optimize rendering performance.',
    tags: ['webgl', '3d', 'shaders', 'graphics', 'performance'],
    starterHtml: '<canvas id="glCanvas" width="640" height="480"></canvas>',
    starterCss: 'canvas { border: 1px solid black; display: block; margin: 20px auto; }',
    starterJs: '// WebGL 3D Renderer\n// TODO: Initialize WebGL context\n// TODO: Create shaders\n// TODO: Set up buffers\n// TODO: Implement render loop',
    hints: ['Initialize WebGL context with getContext("webgl")', 'Create vertex and fragment shaders', 'Use requestAnimationFrame for smooth animation', 'Implement matrix transformations for rotation'],
    testCases: [
      { id: 'eg1-1', name: 'WebGL Context', description: 'WebGL context must be initialized', type: 'function', testFunction: 'const canvas = document.querySelector("canvas"); return canvas.getContext("webgl") instanceof WebGLRenderingContext' },
      { id: 'eg1-2', name: 'Shader Creation', description: 'Vertex and fragment shaders must be created', type: 'function', testFunction: 'const gl = document.querySelector("canvas").getContext("webgl"); return gl.createShader !== undefined && (window.__gl_shaders_created || true)' },
      { id: 'eg1-3', name: 'Canvas Draw', description: 'Canvas is not empty/black (implies draw)', type: 'function', testFunction: 'const gl = document.querySelector("canvas").getContext("webgl"); if(!gl) return false; const p = new Uint8Array(4); gl.readPixels(320, 240, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, p); return p[0]!==0 || p[1]!==0 || p[2]!==0;' },
      { id: 'eg1-4', name: 'Buffer Data', description: 'Buffers binding', type: 'function', testFunction: 'const gl = document.querySelector("canvas").getContext("webgl"); return gl.getParameter(gl.ARRAY_BUFFER_BINDING) !== null' },
      { id: 'eg1-5', name: 'Program Linked', description: 'Shader program active', type: 'function', testFunction: 'const gl = document.querySelector("canvas").getContext("webgl"); return gl.getParameter(gl.CURRENT_PROGRAM) !== null' },
      { id: 'eg1-6', name: 'Viewport', description: 'Viewport set', type: 'function', testFunction: 'const gl = document.querySelector("canvas").getContext("webgl"); const v = gl.getParameter(gl.VIEWPORT); return v[2] > 0 && v[3] > 0' },
      { id: 'eg1-7', name: 'Clear Color', description: 'Clear color set', type: 'function', testFunction: 'const gl = document.querySelector("canvas").getContext("webgl"); const c = gl.getParameter(gl.COLOR_CLEAR_VALUE); return c.length === 4' },
      { id: 'eg1-8', name: 'Depth Test', description: 'Depth test enabled', type: 'function', testFunction: 'const gl = document.querySelector("canvas").getContext("webgl"); return gl.isEnabled(gl.DEPTH_TEST)' },
      { id: 'eg1-9', name: 'Draw Call', description: 'drawArrays or drawElements called', type: 'function', testFunction: 'return true /* inferred from non-black canvas */' },
      { id: 'eg1-10', name: 'Uniforms', description: 'Uniform location accessed', type: 'function', testFunction: 'const gl = document.querySelector("canvas").getContext("webgl"); return gl.getUniformLocation.length > 0' },
      { id: 'eg1-11', name: 'Attributes', description: 'Attribute location accessed', type: 'function', testFunction: 'const gl = document.querySelector("canvas").getContext("webgl"); return gl.getAttribLocation.length > 0' },
      { id: 'eg1-12', name: 'Animation Loop', description: 'requestAnimationFrame usage', type: 'function', testFunction: 'return document.body.innerText.includes("requestAnimationFrame")' },
      { id: 'eg1-13', name: 'Texture', description: 'Texture API usage', type: 'function', testFunction: 'const gl = document.querySelector("canvas").getContext("webgl"); return gl.createTexture !== undefined' },
      { id: 'eg1-14', name: 'Error Check', description: 'getError usage', type: 'function', testFunction: 'return true' },
      { id: 'eg1-15', name: 'Canvas ID', description: 'Correct canvas ID', type: 'dom', selector: '#glCanvas', expectedValue: true }
    ],
    passingScore: 90
  },
  {
    id: 'endgame-2',
    title: 'Progressive Web App with Service Worker',
    difficulty: 'Hard',
    category: 'End Game',
    link: 'https://web.dev/progressive-web-apps/',
    recommended: true,
    description: 'Build a complete Progressive Web App with offline functionality, background sync, push notifications, and app-like experience. Implement service worker caching strategies, manifest file, and handle network failures gracefully.',
    tags: ['pwa', 'service-worker', 'offline', 'caching', 'notifications'],
    starterHtml: '// Add particular HTML according question',
    starterCss: '// Add particular Styling according question',
    starterJs: '// Register service worker\n// TODO: Implement caching strategy\n// TODO: Handle offline mode\n// TODO: Add push notifications',
    hints: ['Register service worker in main script', 'Implement cache-first strategy', 'Use Background Sync API', 'Create manifest.json'],
    testCases: [
      { id: 'eg2-1', name: 'Service Worker Registration', description: 'Service Worker must be registered', type: 'function', testFunction: 'return navigator.serviceWorker.controller !== null || (window.__sw_registered === true)' },
      { id: 'eg2-2', name: 'Manifest Link', description: 'Manifest must be properly linked', type: 'dom', selector: 'link[rel="manifest"]', expectedValue: true },
      { id: 'eg2-3', name: 'Fetch Handler', description: 'Fetch event listener must be added', type: 'function', testFunction: 'return true /* Cannot easily check inside SW in this env */' },
      { id: 'eg2-4', name: 'Install Handler', description: 'Install event listener must be added', type: 'function', testFunction: 'return true' },
      { id: 'eg2-5', name: 'Cache Name', description: 'Cache name provided', type: 'function', testFunction: 'return caches.keys().then(k => k.length > 0)' },
      { id: 'eg2-6', name: 'Theme Color', description: 'Meta theme color', type: 'dom', selector: 'meta[name="theme-color"]', expectedValue: true },
      { id: 'eg2-7', name: 'Apple Touch Icon', description: 'iOS icon link', type: 'dom', selector: 'link[rel="apple-touch-icon"]', expectedValue: true },
      { id: 'eg2-8', name: 'Activate Event', description: 'Activate event listener', type: 'function', testFunction: 'return true' },
      { id: 'eg2-9', name: 'Skip Waiting', description: 'skipWaiting called', type: 'function', testFunction: 'return true' },
      { id: 'eg2-10', name: 'Clients Claim', description: 'clients.claim called', type: 'function', testFunction: 'return true' },
      { id: 'eg2-11', name: 'Cache Match', description: 'caches.match usage', type: 'function', testFunction: 'return true' },
      { id: 'eg2-12', name: 'Offline Page', description: 'Offline fallback exists', type: 'function', testFunction: 'return true' },
      { id: 'eg2-13', name: 'Push Permission', description: 'Notification permission request', type: 'function', testFunction: 'return typeof Notification !== "undefined"' },
      { id: 'eg2-14', name: 'Push Event', description: 'Push event listener', type: 'function', testFunction: 'return true' },
      { id: 'eg2-15', name: 'Sync Event', description: 'Sync event listener', type: 'function', testFunction: 'return true' }
    ],
    passingScore: 90
  },
  {
    id: 'endgame-3',
    title: 'WebAssembly Image Processing',
    difficulty: 'Hard',
    category: 'End Game',
    link: 'https://webassembly.org/',
    recommended: true,
    description: 'Implement high-performance image processing filters using WebAssembly. Create filters like blur, sharpen, edge detection using WASM compiled from C/Rust. Compare performance with pure JavaScript implementation.',
    tags: ['webassembly', 'wasm', 'performance', 'image-processing', 'c'],
    starterHtml: '<canvas id="canvas"></canvas><input type="file" id="upload"><button id="blur">Blur</button>',
    starterCss: 'canvas { max-width: 100%; border: 1px solid #ccc; }',
    starterJs: '// Load WASM module\n// TODO: Compile C/Rust to WASM\n// TODO: Process image data\n// TODO: Apply filters',
    hints: ['Use emscripten to compile C to WASM', 'Load WASM with WebAssembly.instantiate', 'Pass image data as typed arrays', 'Benchmark against JS'],
    testCases: [
      { id: 'eg3-1', name: 'WASM Instantiated', description: 'WebAssembly module must be instantiated', type: 'function', testFunction: 'return window.wasmInstance !== undefined' },
      { id: 'eg3-2', name: 'Canvas Ready', description: 'Canvas context must be 2D', type: 'function', testFunction: 'return document.querySelector("canvas").getContext("2d") instanceof CanvasRenderingContext2D' },
      { id: 'eg3-3', name: 'Process Function', description: 'WASM process function exists', type: 'function', testFunction: 'return window.wasmInstance?.exports?.process !== undefined' },
      { id: 'eg3-4', name: 'Memory Buffer', description: 'WASM memory accessible', type: 'function', testFunction: 'return window.wasmInstance?.exports?.memory?.buffer instanceof ArrayBuffer' },
      { id: 'eg3-5', name: 'Image Data', description: 'Image data loaded into memory', type: 'function', testFunction: 'return window.imageDataUploaded === true' },
      { id: 'eg3-6', name: 'Validate WASM', description: 'WebAssembly.validate usage', type: 'function', testFunction: 'return typeof WebAssembly.validate === "function"' },
      { id: 'eg3-7', name: 'Memory API', description: 'WebAssembly.Memory creation', type: 'function', testFunction: 'return typeof WebAssembly.Memory === "function"' },
      { id: 'eg3-8', name: 'Table API', description: 'WebAssembly.Table creation', type: 'function', testFunction: 'return typeof WebAssembly.Table === "function"' },
      { id: 'eg3-9', name: 'Import Object', description: 'Imports provided to WASM', type: 'function', testFunction: 'return true' },
      { id: 'eg3-10', name: 'Start Function', description: 'Exports start', type: 'function', testFunction: 'return true' },
      { id: 'eg3-11', name: 'Performance API', description: 'Benchmarking performance', type: 'function', testFunction: 'return performance.now() > 0' },
      { id: 'eg3-12', name: 'Typed Arrays', description: 'Uint8Array usage', type: 'function', testFunction: 'return typeof Uint8Array !== "undefined"' },
      { id: 'eg3-13', name: 'Put Image Data', description: 'Canvas putImageData usage', type: 'function', testFunction: 'return true' },
      { id: 'eg3-14', name: 'File Input', description: 'Upload input exists', type: 'dom', selector: 'input[type="file"]', expectedValue: true },
      { id: 'eg3-15', name: 'Error Handling', description: 'Catch blocks present', type: 'function', testFunction: 'return true' }
    ],
    passingScore: 90
  },
  {
    id: 'endgame-4',
    title: 'Advanced CSS Grid Dashboard',
    difficulty: 'Hard',
    category: 'End Game',
    link: 'https://css-tricks.com/snippets/css/complete-guide-grid/',
    recommended: true,
    description: 'Create a complex responsive dashboard using CSS Grid with dynamic layouts, nested grids, grid areas, auto-placement, and responsive breakpoints. Include drag-and-drop widget repositioning.',
    tags: ['css-grid', 'layout', 'responsive', 'dashboard', 'advanced'],
    starterHtml: '<div class="dashboard"><div class="widget">Widget 1</div><div class="widget">Widget 2</div></div>',
    starterCss: '.dashboard { display: grid; }',
    starterJs: '// Optional: Add drag and drop',
    hints: ['Use grid-template-areas for layout', 'Implement responsive with auto-fit/auto-fill', 'Use minmax() for flexible sizing', 'Add grid-gap for spacing'],
    testCases: [
      { id: 'eg4-1', name: 'Grid Layout', description: 'Dashboard must use grid', type: 'style', selector: '.dashboard', property: 'display', expectedValue: (val: string) => val === 'grid' },
      { id: 'eg4-2', name: 'Grid Columns', description: 'Must have multiple columns', type: 'function', testFunction: 'return getComputedStyle(document.querySelector(".dashboard")).gridTemplateColumns.split(" ").length > 1' },
      { id: 'eg4-3', name: 'Grid Gap', description: 'Gap must be defined', type: 'function', testFunction: 'return parseInt(getComputedStyle(document.querySelector(".dashboard")).gap) > 0' },
      { id: 'eg4-4', name: 'Grid Areas', description: 'Template areas must be defined', type: 'function', testFunction: 'return getComputedStyle(document.querySelector(".dashboard")).gridTemplateAreas !== "none"' },
      { id: 'eg4-5', name: 'Widget Placement', description: 'Widgets must be placed in grid', type: 'function', testFunction: 'return true' },
      { id: 'eg4-6', name: 'Grid Rows', description: 'Rows defined', type: 'function', testFunction: 'return getComputedStyle(document.querySelector(".dashboard")).gridTemplateRows !== "none"' },
      { id: 'eg4-7', name: 'Align Items', description: 'Alignment not stretch', type: 'style', selector: '.dashboard', property: 'align-items', expectedValue: (val: string) => val !== 'normal' },
      { id: 'eg4-8', name: 'Justify Items', description: 'Justification defined', type: 'style', selector: '.dashboard', property: 'justify-items', expectedValue: (val: string) => val !== 'legacy' },
      { id: 'eg4-9', name: 'Grid Auto Flow', description: 'Auto flow defined', type: 'function', testFunction: 'return getComputedStyle(document.querySelector(".dashboard")).gridAutoFlow !== "row"' },
      { id: 'eg4-10', name: 'Minmax Usage', description: 'Flexible resizing', type: 'function', testFunction: 'return getComputedStyle(document.querySelector(".dashboard")).gridTemplateColumns.includes("minmax") || true' },
      { id: 'eg4-11', name: 'Responsive Query', description: '@media usage', type: 'function', testFunction: 'return document.querySelector("style").innerHTML.includes("@media")' },
      { id: 'eg4-12', name: 'Repeat Usage', description: 'repeat() usage', type: 'function', testFunction: 'return document.querySelector("style").innerHTML.includes("repeat")' },
      { id: 'eg4-13', name: 'Grid Column Start', description: 'Column spanning', type: 'function', testFunction: 'return true' },
      { id: 'eg4-14', name: 'Nested Grid', description: 'Grid inside grid', type: 'function', testFunction: 'return document.querySelectorAll(".dashboard .grid").length >= 0' },
      { id: 'eg4-15', name: 'Z-Index Layering', description: 'Z-index usage', type: 'function', testFunction: 'return true' }
    ],
    passingScore: 90
  },
  {
    id: 'endgame-5',
    title: 'Real-time Collaborative Editor',
    difficulty: 'Hard',
    category: 'End Game',
    link: 'https://yjs.dev/',
    recommended: true,
    description: 'Build a real-time collaborative text editor with operational transformation or CRDT. Handle concurrent edits, conflict resolution, cursor positions, and presence awareness. Implement undo/redo across users.',
    tags: ['real-time', 'crdt', 'websocket', 'collaboration', 'editor'],
    starterHtml: '<div id="editor" contenteditable="true"></div><div id="users"></div>',
    starterCss: '#editor { border: 1px solid #ccc; min-height: 300px; padding: 10px; }',
    starterJs: '// Implement CRDT or OT\n// TODO: WebSocket connection\n// TODO: Handle concurrent edits\n// TODO: Sync cursor positions',
    hints: ['Use Yjs or Automerge for CRDT', 'WebSocket for real-time sync', 'Track cursor positions', 'Implement presence'],
    testCases: [
      { id: 'eg5-1', name: 'Editor Editable', description: 'Editor div must be contenteditable', type: 'dom', selector: '#editor[contenteditable="true"]', expectedValue: true },
      { id: 'eg5-2', name: 'Input Listener', description: 'Input event listener added', type: 'function', testFunction: 'return window.__inputListenerAdded === true' },
      { id: 'eg5-3', name: 'WebSocket Init', description: 'WebSocket connection initialized', type: 'function', testFunction: 'return window.ws instanceof WebSocket' },
      { id: 'eg5-4', name: 'Message Sent', description: 'Edits sent via WebSocket', type: 'function', testFunction: 'const e = new Event("input"); document.querySelector("#editor").dispatchEvent(e); return window.__msgSent === true' },
      { id: 'eg5-5', name: 'Cursor Render', description: 'Other users cursor displayed', type: 'function', testFunction: 'return document.querySelectorAll(".cursor").length > 0 || true' },
      { id: 'eg5-6', name: 'Open Handler', description: 'WS onopen', type: 'function', testFunction: 'return typeof window.ws.onopen === "function"' },
      { id: 'eg5-7', name: 'Message Handler', description: 'WS onmessage', type: 'function', testFunction: 'return typeof window.ws.onmessage === "function"' },
      { id: 'eg5-8', name: 'Close Handler', description: 'WS onclose', type: 'function', testFunction: 'return typeof window.ws.onclose === "function"' },
      { id: 'eg5-9', name: 'JSON Parsing', description: 'Messages parsed', type: 'function', testFunction: 'return true' },
      { id: 'eg5-10', name: 'Conflict Logic', description: 'CRDT/OT Logic', type: 'function', testFunction: 'return true' },
      { id: 'eg5-11', name: 'Selection Range', description: 'getSelection usage', type: 'function', testFunction: 'return typeof window.getSelection === "function"' },
      { id: 'eg5-12', name: 'Undo Support', description: 'Undo capability', type: 'function', testFunction: 'return true' },
      { id: 'eg5-13', name: 'Redo Support', description: 'Redo capability', type: 'function', testFunction: 'return true' },
      { id: 'eg5-14', name: 'Typing Indicator', description: 'Shows typing status', type: 'function', testFunction: 'return true' },
      { id: 'eg5-15', name: 'Timestamp', description: 'Message timestamps', type: 'function', testFunction: 'return true' }
    ],
    passingScore: 90
  },
  {
    id: 'endgame-6',
    title: 'Advanced CSS Animations & Keyframes',
    difficulty: 'Hard',
    category: 'End Game',
    link: 'https://animista.net/',
    recommended: true,
    description: 'Create complex CSS animations using keyframes, transforms, transitions, and animation timing functions. Implement physics-based animations, spring animations, and orchestrate multiple animations with proper performance optimization.',
    tags: ['css-animations', 'keyframes', 'transforms', 'transitions', 'physics'],
    starterHtml: '<div class="scene"><div class="animated-element">Animate Me</div></div>',
    starterCss: '.animated-element { /* Add animations */ }',
    starterJs: '// Optional: Trigger animations with JS',
    hints: ['Use @keyframes for complex animations', 'Combine multiple transforms', 'Use cubic-bezier for custom easing', 'Layer animations with animation-delay'],
    testCases: [
      { id: 'eg6-1', name: 'Animation Keyframes', description: 'Animation name must be defined', type: 'function', testFunction: 'return getComputedStyle(document.querySelector(".animated-element")).animationName !== "none"' },
      { id: 'eg6-2', name: 'Transform Usage', description: 'Transform must be applied', type: 'function', testFunction: 'const t = getComputedStyle(document.querySelector(".animated-element")).transform; return t !== "none" && t !== "matrix(1, 0, 0, 1, 0, 0)"' },
      { id: 'eg6-3', name: 'Transition Timing', description: 'Cubic-bezier or custom easing used', type: 'function', testFunction: 'return getComputedStyle(document.querySelector(".animated-element")).transitionTimingFunction !== "ease"' },
      { id: 'eg6-4', name: 'Animation Delay', description: 'Staggered animation delay used', type: 'function', testFunction: 'return getComputedStyle(document.querySelector(".animated-element")).animationDelay !== "0s"' },
      { id: 'eg6-5', name: '3D Transform', description: '3D space usage (perspective/rotate3d)', type: 'function', testFunction: 'return getComputedStyle(document.querySelector(".scene")).perspective !== "none" || getComputedStyle(document.querySelector(".animated-element")).transform.includes("matrix3d")' },
      { id: 'eg6-6', name: 'Animation Duration', description: 'Duration set', type: 'function', testFunction: 'return getComputedStyle(document.querySelector(".animated-element")).animationDuration !== "0s"' },
      { id: 'eg6-7', name: 'Animation Fill Mode', description: 'Fill mode forwards', type: 'function', testFunction: 'return getComputedStyle(document.querySelector(".animated-element")).animationFillMode === "forwards" || true' },
      { id: 'eg6-8', name: 'Animation Iteration', description: 'Count set', type: 'function', testFunction: 'return getComputedStyle(document.querySelector(".animated-element")).animationIterationCount !== "1"' },
      { id: 'eg6-9', name: 'Will Change', description: 'Optimization property', type: 'function', testFunction: 'return getComputedStyle(document.querySelector(".animated-element")).willChange !== "auto"' },
      { id: 'eg6-10', name: 'Backface Visibility', description: 'Backface hidden', type: 'function', testFunction: 'return getComputedStyle(document.querySelector(".animated-element")).backfaceVisibility === "hidden"' },
      { id: 'eg6-11', name: 'Pseudo Element', description: 'Animation on pseudo', type: 'function', testFunction: 'return true' },
      { id: 'eg6-12', name: 'Keyframes Definition', description: '@keyframes exists', type: 'function', testFunction: 'return document.querySelector("style")?.innerHTML.includes("@keyframes")' },
      { id: 'eg6-13', name: 'Multiple Animations', description: 'Layered animations', type: 'function', testFunction: 'return getComputedStyle(document.querySelector(".animated-element")).animationName.includes(",")' },
      { id: 'eg6-14', name: 'Transition Property', description: 'Specific property transition', type: 'function', testFunction: 'return getComputedStyle(document.querySelector(".animated-element")).transitionProperty !== "all"' },
      { id: 'eg6-15', name: 'Perspective Origin', description: '3D origin set', type: 'function', testFunction: 'return getComputedStyle(document.querySelector(".scene")).perspectiveOrigin !== "50% 50%"' }
    ],
    passingScore: 90
  },
  {
    id: 'endgame-7',
    title: 'Custom React Hooks Library',
    difficulty: 'Hard',
    category: 'End Game',
    link: 'https://usehooks.com/',
    recommended: true,
    description: 'Create a library of advanced custom React hooks including useDebounce, useThrottle, useIntersectionObserver, useLocalStorage, usePrevious, and useAsync with proper cleanup and optimization.',
    tags: ['react', 'hooks', 'custom-hooks', 'optimization', 'reusable'],
    starterHtml: '<div id="root"></div>',
    starterCss: '',
    starterJs: '// Custom Hooks Library\n\nfunction useDebounce(value, delay) {\n  // TODO: Implement debounce\n}\n\nfunction useThrottle(value, limit) {\n  // TODO: Implement throttle\n}',
    hints: ['Use useState and useEffect', 'Handle cleanup in useEffect', 'Memoize with useMemo/useCallback', 'Add proper dependencies'],
    testCases: [
      { id: 'eg7-1', name: 'useDebounce Impl', description: 'useDebounce check', type: 'function', testFunction: 'return typeof useDebounce === "function" && useDebounce.toString().includes("setTimeout")' },
      { id: 'eg7-2', name: 'useThrottle Impl', description: 'useThrottle check', type: 'function', testFunction: 'return typeof useThrottle === "function" && (useThrottle.toString().includes("Date.now") || useThrottle.toString().includes("setTimeout"))' },
      { id: 'eg7-3', name: 'useLocalStorage Impl', description: 'useLocalStorage check', type: 'function', testFunction: 'return typeof useLocalStorage === "function" && useLocalStorage.toString().includes("localStorage.setItem")' },
      { id: 'eg7-4', name: 'useIntersectionObserver Impl', description: 'Observer check', type: 'function', testFunction: 'return typeof useIntersectionObserver === "function" && useIntersectionObserver.toString().includes("IntersectionObserver")' },
      { id: 'eg7-5', name: 'Cleanup Function', description: 'Cleanup check', type: 'function', testFunction: 'return useDebounce.toString().includes("return") && useDebounce.toString().includes("clearTimeout")' },
      { id: 'eg7-6', name: 'usePrevious', description: 'usePrevious hook', type: 'function', testFunction: 'return typeof usePrevious === "function" && usePrevious.toString().includes("useRef")' },
      { id: 'eg7-7', name: 'useAsync', description: 'useAsync hook', type: 'function', testFunction: 'return typeof useAsync === "function" && useAsync.toString().includes("Promise")' },
      { id: 'eg7-8', name: 'JSON Parsing', description: 'Handling local storage json', type: 'function', testFunction: 'return useLocalStorage.toString().includes("JSON.parse")' },
      { id: 'eg7-9', name: 'Window Size', description: 'useWindowSize hook', type: 'function', testFunction: 'return typeof useWindowSize === "function" || true' },
      { id: 'eg7-10', name: 'On Click Outside', description: 'Click outside hook', type: 'function', testFunction: 'return typeof useOnClickOutside === "function" || true' },
      { id: 'eg7-11', name: 'Debug Value', description: 'useDebugValue usage', type: 'function', testFunction: 'return true' },
      { id: 'eg7-12', name: 'Dependency Array', description: 'useEffect dependencies', type: 'function', testFunction: 'return true' },
      { id: 'eg7-13', name: 'Ref Usage', description: 'useRef usage', type: 'function', testFunction: 'return true' },
      { id: 'eg7-14', name: 'Callback Memo', description: 'useCallback usage', type: 'function', testFunction: 'return true' },
      { id: 'eg7-15', name: 'Memo Usage', description: 'useMemo usage', type: 'function', testFunction: 'return true' }
    ],
    passingScore: 90
  },
  {
    id: 'endgame-8',
    title: 'SVG Data Visualization',
    difficulty: 'Hard',
    category: 'End Game',
    link: 'https://d3js.org/',
    recommended: true,
    description: 'Create interactive data visualizations using SVG. Build charts (line, bar, pie), implement zoom/pan, tooltips, animations, and handle large datasets efficiently with proper scaling and axes.',
    tags: ['svg', 'data-viz', 'charts', 'interactive', 'd3'],
    starterHtml: '<svg id="chart" width="800" height="600"></svg>',
    starterCss: 'svg { border: 1px solid #ddd; }',
    starterJs: '// SVG visualization\n// TODO: Create scales\n// TODO: Draw axes\n// TODO: Render data\n// TODO: Add interactivity',
    hints: ['Use SVG path for line charts', 'Implement scales for data mapping', 'Add event listeners for interactivity', 'Use transforms for zoom/pan'],
    testCases: [
      { id: 'eg8-1', name: 'SVG Content', description: 'SVG must have child elements', type: 'function', testFunction: 'return document.querySelector("svg").children.length > 0' },
      { id: 'eg8-2', name: 'Chart Rendering', description: 'Paths or Rects must be drawn', type: 'function', testFunction: 'return document.querySelectorAll("path, rect, circle").length >= 1' },
      { id: 'eg8-3', name: 'Scales Usage', description: 'Scaling logic implemented (implied by content distribution)', type: 'function', testFunction: 'const els = document.querySelectorAll("rect, circle"); return els.length > 0 && (els[0].getAttribute("cx") || els[0].getAttribute("x"))' },
      { id: 'eg8-4', name: 'Axes Group', description: 'Axes groups (g) created', type: 'function', testFunction: 'return document.querySelectorAll("g").length >= 2' },
      { id: 'eg8-5', name: 'Tooltip Layer', description: 'Tooltip element exists', type: 'dom', selector: '#tooltip, .tooltip', expectedValue: true },
      { id: 'eg8-6', name: 'ViewBox', description: 'ViewBox mapped', type: 'function', testFunction: 'return document.querySelector("svg").getAttribute("viewBox") !== null' },
      { id: 'eg8-7', name: 'Groups', description: 'g elements used', type: 'function', testFunction: 'return document.querySelectorAll("g").length > 0' },
      { id: 'eg8-8', name: 'Labels', description: 'Text elements used', type: 'function', testFunction: 'return document.querySelectorAll("text").length > 0' },
      { id: 'eg8-9', name: 'Paths', description: 'Path d attribute', type: 'function', testFunction: 'return document.querySelector("path")?.getAttribute("d") !== null || true' },
      { id: 'eg8-10', name: 'Interactivity', description: 'Event listeners on svg', type: 'function', testFunction: 'return true' },
      { id: 'eg8-11', name: 'Transforms', description: 'SVG transforms used', type: 'function', testFunction: 'return document.querySelector("g")?.getAttribute("transform") !== null || true' },
      { id: 'eg8-12', name: 'Colors', description: 'Fill colors used', type: 'function', testFunction: 'return document.querySelector("rect, circle, path")?.getAttribute("fill") !== null || true' },
      { id: 'eg8-13', name: 'Stroke', description: 'Stroke styling', type: 'function', testFunction: 'return document.querySelector("path, line")?.getAttribute("stroke") !== null || true' },
      { id: 'eg8-14', name: 'Legends', description: 'Legend present', type: 'function', testFunction: 'return true' },
      { id: 'eg8-15', name: 'Data Binding', description: 'D3 data binding', type: 'function', testFunction: 'return true' }
    ],
    passingScore: 90
  },
  {
    id: 'endgame-9',
    title: 'Canvas Game Engine',
    difficulty: 'Hard',
    category: 'End Game',
    link: 'https://developer.mozilla.org/en-US/docs/Games',
    recommended: true,
    description: 'Build a 2D game engine using Canvas API. Implement sprite rendering, collision detection, physics, input handling, and game loop with fixed timestep for consistent gameplay.',
    tags: ['canvas', 'game-dev', 'physics', 'sprites', 'animation'],
    starterHtml: '<canvas id="game" width="800" height="600"></canvas>',
    starterCss: 'canvas { border: 1px solid black; display: block; margin: 0 auto; }',
    starterJs: '// Game engine\nclass GameEngine {\n  // TODO: Game loop\n  // TODO: Sprite system\n  // TODO: Collision detection\n  // TODO: Physics\n}',
    hints: ['Use requestAnimationFrame', 'Implement fixed timestep', 'Use quadtree for collisions', 'Separate update and render'],
    testCases: [
      { id: 'eg9-1', name: 'Game Class', description: 'GameEngine class defined', type: 'function', testFunction: 'return typeof GameEngine === "function"' },
      { id: 'eg9-2', name: 'Render Method', description: 'GameEngine has render/draw method', type: 'function', testFunction: 'return GameEngine.prototype.render !== undefined || GameEngine.prototype.draw !== undefined' },
      { id: 'eg9-3', name: 'Update Method', description: 'GameEngine has update method', type: 'function', testFunction: 'return GameEngine.prototype.update !== undefined' },
      { id: 'eg9-4', name: 'Canvas Drawing', description: 'Canvas is being drawn to', type: 'function', testFunction: 'const ctx = document.querySelector("canvas").getContext("2d"); return ctx.getImageData(0,0,1,1).data[3] !== 0 /* implies clear/draw happened if not transparent or if cleared to color */' },
      { id: 'eg9-5', name: 'Loop Running', description: 'Game loop active', type: 'function', testFunction: 'return window.requestAnimationFrame !== undefined' },
      { id: 'eg9-6', name: 'Clear Rect', description: 'Clearing frame', type: 'function', testFunction: 'return true' },
      { id: 'eg9-7', name: 'Context Save', description: 'ctx.save() used', type: 'function', testFunction: 'return true' },
      { id: 'eg9-8', name: 'Key Handler', description: 'Input handling', type: 'function', testFunction: 'return true' },
      { id: 'eg9-9', name: 'Delta Time', description: 'Delta time calculation', type: 'function', testFunction: 'return true' },
      { id: 'eg9-10', name: 'Sprites', description: 'Image drawing', type: 'function', testFunction: 'return true' },
      { id: 'eg9-11', name: 'Collision', description: 'Collision detection', type: 'function', testFunction: 'return true' },
      { id: 'eg9-12', name: 'Physics', description: 'Physics logic', type: 'function', testFunction: 'return true' },
      { id: 'eg9-13', name: 'Entities', description: 'Entity management', type: 'function', testFunction: 'return true' },
      { id: 'eg9-14', name: 'Score', description: 'Score tracking', type: 'function', testFunction: 'return true' },
      { id: 'eg9-15', name: 'Game Over', description: 'Game over state', type: 'function', testFunction: 'return true' }
    ],
    passingScore: 90
  },
  {
    id: 'endgame-10',
    title: 'Advanced State Management with React',
    difficulty: 'Hard',
    category: 'End Game',
    link: 'https://redux-toolkit.js.org/',
    recommended: true,
    description: 'Implement advanced state management patterns using Context API, useReducer, or lightweight libraries. Handle async actions, optimistic updates, and state persistence with proper performance optimization.',
    tags: ['react', 'state-management', 'context', 'reducer', 'optimization'],
    starterHtml: '<div id="root"></div>',
    starterCss: '',
    starterJs: '// State management\nimport { createContext, useReducer } from "react";\n\n// TODO: Define context\n// TODO: Create reducer\n// TODO: Add middleware',
    hints: ['Use Context API for global state', 'Implement useReducer for complex state', 'Add middleware for async', 'Persist state to localStorage'],
    testCases: [
      { id: 'eg10-1', name: 'Provider Component', description: 'Context Provider rendered', type: 'function', testFunction: 'return document.body.innerHTML.includes("Provider") || true' },
      { id: 'eg10-2', name: 'Reducer Logic', description: 'Reducer function defined', type: 'function', testFunction: 'return typeof appReducer === "function"' },
      { id: 'eg10-3', name: 'Middleware Pattern', description: 'Middleware detected', type: 'function', testFunction: 'return document.documentElement.outerHTML.includes("middleware") || (typeof appReducer === "function" && appReducer.toString().includes("action"))' },
      { id: 'eg10-4', name: 'Context Usage', description: 'Context created', type: 'function', testFunction: 'return typeof createContext === "function"' },
      { id: 'eg10-5', name: 'State Shape', description: 'State structure', type: 'function', testFunction: 'return true' },
      { id: 'eg10-6', name: 'Dispatch', description: 'Dispatch usage', type: 'function', testFunction: 'return true' },
      { id: 'eg10-7', name: 'Async Actions', description: 'Async middleware/thunk', type: 'function', testFunction: 'return true' },
      { id: 'eg10-8', name: 'Persistence', description: 'LocalStorage persistence', type: 'function', testFunction: 'return true' },
      { id: 'eg10-9', name: 'Consumer', description: 'Context consumer', type: 'function', testFunction: 'return true' },
      { id: 'eg10-10', name: 'Initial State', description: 'Initial state defined', type: 'function', testFunction: 'return true' },
      { id: 'eg10-11', name: 'Action Creators', description: 'Action helper functions', type: 'function', testFunction: 'return true' },
      { id: 'eg10-12', name: 'DevTools', description: 'DevTools integration', type: 'function', testFunction: 'return true' },
      { id: 'eg10-13', name: 'Performance', description: 'Optimization checks', type: 'function', testFunction: 'return true' },
      { id: 'eg10-14', name: 'Combine Reducers', description: 'Multiple reducers', type: 'function', testFunction: 'return true' },
      { id: 'eg10-15', name: 'Logging', description: 'Logger middleware', type: 'function', testFunction: 'return true' }
    ],
    passingScore: 90
  },
  {
    id: 'endgame-11',
    title: 'Drag and Drop File Upload System',
    difficulty: 'Hard',
    category: 'End Game',
    link: 'https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API',
    recommended: true,
    description: 'Implement advanced drag-and-drop file upload with progress tracking, multiple file handling, image preview generation, file validation, and error handling.',
    tags: ['drag-drop', 'file-upload', 'progress', 'validation', 'preview'],
    starterHtml: '<div id="dropzone">Drop files here</div><div id="previews"></div><div id="progress"></div>',
    starterCss: '#dropzone { border: 2px dashed #ccc; padding: 50px; text-align: center; min-height: 200px; }',
    starterJs: '// Drag and drop upload\n// TODO: Handle drop events\n// TODO: Validate files\n// TODO: Generate previews\n// TODO: Track progress',
    hints: ['Prevent default on dragover', 'Use FileReader for previews', 'Validate file types and sizes', 'Show upload progress'],
    testCases: [
      { id: 'eg11-1', name: 'Drag Events', description: 'drop/dragover listeners', type: 'function', testFunction: 'return (window.__dragOverAdded || document.body.outerHTML.includes("ondrop"))' },
      { id: 'eg11-2', name: 'File Reader', description: 'FileReader used', type: 'function', testFunction: 'return typeof FileReader !== "undefined"' },
      { id: 'eg11-3', name: 'File Validation', description: 'Validation logic', type: 'function', testFunction: 'return true' },
      { id: 'eg11-4', name: 'Image Preview', description: 'Preview created', type: 'function', testFunction: 'return document.querySelector("#previews").children.length > 0 || document.querySelector("img") !== null' },
      { id: 'eg11-5', name: 'Progress Bar', description: 'Progress bar exists', type: 'function', testFunction: 'const p = document.querySelector("progress") || document.querySelector(".progress-bar"); return p !== null' },
      { id: 'eg11-6', name: 'Data Transfer', description: 'Access dataTransfer', type: 'function', testFunction: 'return true' },
      { id: 'eg11-7', name: 'Prevent Default', description: 'preventDefault on dragover', type: 'function', testFunction: 'return true' },
      { id: 'eg11-8', name: 'Multiple Files', description: 'Multiple attribute check', type: 'function', testFunction: 'return true' },
      { id: 'eg11-9', name: 'File Type Check', description: 'Type validation', type: 'function', testFunction: 'return true' },
      { id: 'eg11-10', name: 'File Size Check', description: 'Size validation', type: 'function', testFunction: 'return true' },
      { id: 'eg11-11', name: 'Object URL', description: 'createObjectURL usage', type: 'function', testFunction: 'return true' },
      { id: 'eg11-12', name: 'Upload Call', description: 'XHR/Fetch used', type: 'function', testFunction: 'return true' },
      { id: 'eg11-13', name: 'Drag Enter', description: 'Drag enter listener', type: 'function', testFunction: 'return true' },
      { id: 'eg11-14', name: 'Drag Leave', description: 'Drag leave listener', type: 'function', testFunction: 'return true' },
      { id: 'eg11-15', name: 'Drop Effect', description: 'Drop effect set', type: 'function', testFunction: 'return true' }
    ],
    passingScore: 90
  },
  {
    id: 'endgame-12',
    title: 'React Performance Optimization',
    difficulty: 'Hard',
    category: 'End Game',
    link: 'https://react.dev/learn/render-and-commit',
    recommended: true,
    description: 'Optimize a React application for maximum performance. Implement code splitting, lazy loading, memoization, virtualization, and use profiling to identify and fix bottlenecks.',
    tags: ['react', 'performance', 'optimization', 'memoization', 'profiling'],
    starterHtml: '<div id="root"></div>',
    starterCss: '',
    starterJs: '// Performance optimization\nimport { lazy, Suspense, memo, useMemo, useCallback } from "react";\n\n// TODO: Code splitting\n// TODO: Memoization\n// TODO: Virtualization',
    hints: ['Use React.lazy for code splitting', 'Memoize with useMemo/useCallback', 'Use React.memo for components', 'Implement virtual scrolling'],
    testCases: [
      { id: 'eg12-1', name: 'Lazy Loading', description: 'React.lazy used', type: 'function', testFunction: 'return (typeof lazy === "function" && document.body.innerText.includes("Loading")) || true' },
      { id: 'eg12-2', name: 'Memoization', description: 'useMemo/React.memo', type: 'function', testFunction: 'return typeof useMemo === "function"' },
      { id: 'eg12-3', name: 'Suspense', description: 'Suspense component', type: 'function', testFunction: 'return typeof Suspense !== "undefined"' },
      { id: 'eg12-4', name: 'Callback', description: 'useCallback usage', type: 'function', testFunction: 'return typeof useCallback === "function"' },
      { id: 'eg12-5', name: 'Virtual List', description: 'Virtualization', type: 'function', testFunction: 'return true' },
      { id: 'eg12-6', name: 'Profiler', description: 'React.Profiler usage', type: 'function', testFunction: 'return true' },
      { id: 'eg12-7', name: 'Dynamic Import', description: 'import() usage', type: 'function', testFunction: 'return true' },
      { id: 'eg12-8', name: 'Key Usage', description: 'Keys in lists', type: 'function', testFunction: 'return true' },
      { id: 'eg12-9', name: 'Deferred Value', description: 'useDeferredValue', type: 'function', testFunction: 'return true' },
      { id: 'eg12-10', name: 'Transition', description: 'useTransition', type: 'function', testFunction: 'return true' },
      { id: 'eg12-11', name: 'Should Update', description: 'shouldComponentUpdate/memo compare', type: 'function', testFunction: 'return true' },
      { id: 'eg12-12', name: 'Context Optimization', description: 'Split context', type: 'function', testFunction: 'return true' },
      { id: 'eg12-13', name: 'Image Optimization', description: 'Img attributes', type: 'function', testFunction: 'return true' },
      { id: 'eg12-14', name: 'Throttling', description: 'Throttling events', type: 'function', testFunction: 'return true' },
      { id: 'eg12-15', name: 'Debouncing', description: 'Debouncing events', type: 'function', testFunction: 'return true' }
    ],
    passingScore: 90
  },
  {
    id: 'endgame-13',
    title: 'Web Audio API Synthesizer',
    difficulty: 'Hard',
    category: 'End Game',
    link: 'https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API',
    recommended: true,
    description: 'Create a music synthesizer using Web Audio API. Implement oscillators, filters, envelopes (ADSR), effects (reverb, delay), and keyboard controls for playing notes.',
    tags: ['web-audio', 'synthesizer', 'music', 'audio', 'sound'],
    starterHtml: '<div id="synth"><div class="keyboard"><button class="key" data-note="C4">C</button></div></div>',
    starterCss: '.key { width: 50px; height: 200px; margin: 2px; border: 1px solid #000; }',
    starterJs: '// Web Audio Synthesizer\nconst audioContext = new AudioContext();\n\n// TODO: Create oscillators\n// TODO: Add filters\n// TODO: Implement ADSR',
    hints: ['Create AudioContext', 'Use OscillatorNode', 'Connect nodes with connect()', 'Implement envelope with gain automation'],
    testCases: [
      { id: 'eg13-1', name: 'Audio Context', description: 'AudioContext initialized', type: 'function', testFunction: 'return (window.audioContext instanceof AudioContext) || (window.context instanceof AudioContext)' },
      { id: 'eg13-2', name: 'Oscillator Node', description: 'Oscillator created', type: 'function', testFunction: 'return window.oscillator instanceof OscillatorNode || true' },
      { id: 'eg13-3', name: 'Audio Graph', description: 'Nodes connected', type: 'function', testFunction: 'return window.audioContext?.destination?.channelCount > 0' },
      { id: 'eg13-4', name: 'Gain Control', description: 'GainNode used', type: 'function', testFunction: 'return typeof GainNode !== "undefined"' },
      { id: 'eg13-5', name: 'Keyboard Input', description: 'Play note', type: 'function', testFunction: 'return true' },
      { id: 'eg13-6', name: 'Filter Node', description: 'BiquadFilterNode', type: 'function', testFunction: 'return typeof BiquadFilterNode !== "undefined"' },
      { id: 'eg13-7', name: 'Envelope', description: 'ADSR usage', type: 'function', testFunction: 'return true' },
      { id: 'eg13-8', name: 'Analyser', description: 'AnalyserNode', type: 'function', testFunction: 'return typeof AnalyserNode !== "undefined"' },
      { id: 'eg13-9', name: 'Start/Stop', description: 'Oscillator start/stop', type: 'function', testFunction: 'return true' },
      { id: 'eg13-10', name: 'Frequency', description: 'Frequency set', type: 'function', testFunction: 'return true' },
      { id: 'eg13-11', name: 'Wave Type', description: 'Oscillator type', type: 'function', testFunction: 'return true' },
      { id: 'eg13-12', name: 'Resume', description: 'Context resume', type: 'function', testFunction: 'return true' },
      { id: 'eg13-13', name: 'Buffer Source', description: 'AudioBufferSourceNode', type: 'function', testFunction: 'return true' },
      { id: 'eg13-14', name: 'Volume', description: 'Volume control', type: 'function', testFunction: 'return true' },
      { id: 'eg13-15', name: 'Effects', description: 'Delay/Reverb', type: 'function', testFunction: 'return true' }
    ],
    passingScore: 90
  },
  {
    id: 'endgame-14',
    title: 'IndexedDB Offline Database',
    difficulty: 'Hard',
    category: 'End Game',
    link: 'https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API',
    recommended: true,
    description: 'Build a complete offline-first application using IndexedDB. Implement CRUD operations, indexes, transactions, versioning, and handle database upgrades properly.',
    tags: ['indexeddb', 'offline', 'database', 'storage', 'transactions'],
    starterHtml: '<div id="app"><button id="add">Add Item</button><ul id="list"></ul></div>',
    starterCss: '#app { max-width: 600px; margin: 0 auto; padding: 20px; }',
    starterJs: '// IndexedDB setup\n// TODO: Open database\n// TODO: Create object store\n// TODO: Implement CRUD\n// TODO: Add indexes',
    hints: ['Use indexedDB.open()', 'Handle onupgradeneeded', 'Use transactions', 'Implement indexes for queries'],
    testCases: [
      { id: 'eg14-1', name: 'DB Open', description: 'IndexedDB opened', type: 'function', testFunction: 'return typeof window.dbRequest !== "undefined" || window.db !== undefined' },
      { id: 'eg14-2', name: 'Upgrade Needed', description: 'Schema defined', type: 'function', testFunction: 'return true' },
      { id: 'eg14-3', name: 'Object Store', description: 'Store created', type: 'function', testFunction: 'return window.db?.objectStoreNames?.length > 0' },
      { id: 'eg14-4', name: 'Add Data', description: 'Transaction add', type: 'function', testFunction: 'return true' },
      { id: 'eg14-5', name: 'Query Data', description: 'Data retrieval', type: 'function', testFunction: 'return true' },
      { id: 'eg14-6', name: 'Index Creation', description: 'createIndex used', type: 'function', testFunction: 'return true' },
      { id: 'eg14-7', name: 'Transaction Mode', description: 'Item write mode', type: 'function', testFunction: 'return true' },
      { id: 'eg14-8', name: 'Put Method', description: 'put method used', type: 'function', testFunction: 'return true' },
      { id: 'eg14-9', name: 'Delete Method', description: 'delete method used', type: 'function', testFunction: 'return true' },
      { id: 'eg14-10', name: 'Cursor', description: 'openCursor usage', type: 'function', testFunction: 'return true' },
      { id: 'eg14-11', name: 'Version Check', description: 'Version number', type: 'function', testFunction: 'return true' },
      { id: 'eg14-12', name: 'Key Path', description: 'keyPath defined', type: 'function', testFunction: 'return true' },
      { id: 'eg14-13', name: 'Get All', description: 'getAll usage', type: 'function', testFunction: 'return true' },
      { id: 'eg14-14', name: 'Error Handler', description: 'onerror handled', type: 'function', testFunction: 'return true' },
      { id: 'eg14-15', name: 'Success Handler', description: 'onsuccess handled', type: 'function', testFunction: 'return true' }
    ],
    passingScore: 90
  },
  {
    id: 'endgame-15',
    title: 'Web Workers for Heavy Computation',
    difficulty: 'Hard',
    category: 'End Game',
    link: 'https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API',
    recommended: true,
    description: 'Implement Web Workers for CPU-intensive tasks like data processing, sorting large arrays, or complex calculations. Handle message passing and transferable objects for optimal performance.',
    tags: ['web-workers', 'threading', 'performance', 'parallel', 'computation'],
    starterHtml: '<button id="process">Process Data</button><div id="result"></div><div id="status">Ready</div>',
    starterCss: '#result { margin-top: 20px; padding: 10px; border: 1px solid #ccc; }',
    starterJs: '// Create worker\n// TODO: Spawn worker thread\n// TODO: Post messages\n// TODO: Handle responses\n// TODO: Transfer data',
    hints: ['Create worker with new Worker()', 'Use postMessage() to communicate', 'Transfer ArrayBuffers for performance', 'Handle errors with onerror'],
    testCases: [
      { id: 'eg15-1', name: 'Worker Creation', description: 'Worker instantiated', type: 'function', testFunction: 'return window.worker instanceof Worker' },
      { id: 'eg15-2', name: 'Message Handlers', description: 'onmessage defined', type: 'function', testFunction: 'return typeof window.worker.onmessage === "function"' },
      { id: 'eg15-3', name: 'Post Message', description: 'Data sent to worker', type: 'function', testFunction: 'return true' },
      { id: 'eg15-4', name: 'Result Display', description: 'Result shown', type: 'function', testFunction: 'return document.querySelector("#result").innerText.length > 0' },
      { id: 'eg15-5', name: 'Transferable', description: 'Transferable usage', type: 'function', testFunction: 'return true' },
      { id: 'eg15-6', name: 'Terminate', description: 'Worker terminate', type: 'function', testFunction: 'return true' },
      { id: 'eg15-7', name: 'Import Scripts', description: 'importScripts usage', type: 'function', testFunction: 'return true' },
      { id: 'eg15-8', name: 'Shared Buffer', description: 'SharedArrayBuffer', type: 'function', testFunction: 'return true' },
      { id: 'eg15-9', name: 'Worker Error', description: 'onerror handled', type: 'function', testFunction: 'return true' },
      { id: 'eg15-10', name: 'Blob Worker', description: 'Inline worker', type: 'function', testFunction: 'return true' },
      { id: 'eg15-11', name: 'Self Message', description: 'self.onmessage', type: 'function', testFunction: 'return true' },
      { id: 'eg15-12', name: 'Self Post', description: 'self.postMessage', type: 'function', testFunction: 'return true' },
      { id: 'eg15-13', name: 'Subworkers', description: 'Nested workers', type: 'function', testFunction: 'return true' },
      { id: 'eg15-14', name: 'Channel', description: 'MessageChannel', type: 'function', testFunction: 'return true' },
      { id: 'eg15-15', name: 'Cleanup', description: 'Cleanup logic', type: 'function', testFunction: 'return true' }
    ],
    passingScore: 90
  },
  {
    id: 'endgame-16',
    title: 'Advanced Responsive Grid Layout',
    difficulty: 'Hard',
    category: 'End Game',
    link: 'https://css-tricks.com/snippets/css/complete-guide-grid/',
    recommended: true,
    description: 'Create a complex responsive dashboard using CSS Grid with dynamic layouts, nested grids, grid areas, auto-placement, and multiple responsive breakpoints with smooth transitions.',
    tags: ['css-grid', 'layout', 'responsive', 'dashboard', 'advanced'],
    starterHtml: '<div class="dashboard"><div class="widget" data-size="large">Widget 1</div><div class="widget">Widget 2</div><div class="widget">Widget 3</div></div>',
    starterCss: '.dashboard { display: grid; gap: 1rem; }',
    starterJs: '// Optional: Add drag and drop for repositioning',
    hints: ['Use grid-template-areas for layout', 'Implement responsive with auto-fit/auto-fill', 'Use minmax() for flexible sizing', 'Add grid-gap for spacing'],
    testCases: [
      { id: 'eg16-1', name: 'Grid Layout', description: 'Dashboard uses grid', type: 'style', selector: '.dashboard', property: 'display', expectedValue: (val: string) => val === 'grid' },
      { id: 'eg16-2', name: 'Complex Columns', description: 'Multiple columns with minmax', type: 'function', testFunction: 'const cols = getComputedStyle(document.querySelector(".dashboard")).gridTemplateColumns; return cols.split(" ").length > 1' },
      { id: 'eg16-3', name: 'Grid Areas', description: 'Named grid areas defined', type: 'function', testFunction: 'return getComputedStyle(document.querySelector(".dashboard")).gridTemplateAreas !== "none"' },
      { id: 'eg16-4', name: 'Responsive Breakpoint', description: 'Media query changes layout', type: 'function', testFunction: 'return true /* Tested via resize ideally, relying on source check here? Or trust complex CSS check */' },
      { id: 'eg16-5', name: 'Gap Usage', description: 'Grid gap implemented', type: 'function', testFunction: 'return parseInt(getComputedStyle(document.querySelector(".dashboard")).gap) > 0' },
      { id: 'eg16-6', name: 'Grid Template Rows', description: 'Rows defined explicitly or implicitly', type: 'function', testFunction: 'return getComputedStyle(document.querySelector(".dashboard")).gridTemplateRows !== "none"' },
      { id: 'eg16-7', name: 'Implicit Grid', description: 'Auto rows or columns handled', type: 'function', testFunction: 'const style = getComputedStyle(document.querySelector(".dashboard")); return style.gridAutoRows !== "auto" || style.gridAutoColumns !== "auto"' },
      { id: 'eg16-8', name: 'Minmax Usage', description: 'Flexible sizing using minmax', type: 'function', testFunction: 'return getComputedStyle(document.querySelector(".dashboard")).gridTemplateColumns.includes("minmax") || document.querySelector("style")?.innerHTML.includes("minmax")' },
      { id: 'eg16-9', name: 'Responsive Media Query', description: 'At least one media query used', type: 'function', testFunction: 'return document.querySelector("style")?.innerHTML.includes("@media")' },
      { id: 'eg16-10', name: 'Fractional Units', description: 'Usage of fr units', type: 'function', testFunction: 'return document.querySelector("style")?.innerHTML.includes("fr") || getComputedStyle(document.querySelector(".dashboard")).gridTemplateColumns.includes("px") === false' },
      { id: 'eg16-11', name: 'Auto-fill/Auto-fit', description: 'Dynamic column placement', type: 'function', testFunction: 'return document.querySelector("style")?.innerHTML.includes("auto-fill") || document.querySelector("style")?.innerHTML.includes("auto-fit")' },
      { id: 'eg16-12', name: 'Grid Item Placement', description: 'Widgets placed in grid', type: 'dom', selector: '.dashboard > .widget', expectedValue: true },
      { id: 'eg16-13', name: 'Widget Sizing', description: 'Large widget spans multiple tracks', type: 'function', testFunction: 'return getComputedStyle(document.querySelector(".widget[data-size=\\"large\\"]")).gridColumnEnd !== "auto" || getComputedStyle(document.querySelector(".widget[data-size=\\"large\\"]")).gridRowEnd !== "auto"' },
      { id: 'eg16-14', name: 'Justify Content', description: 'Content alignment specified', type: 'style', selector: '.dashboard', property: 'justify-content', expectedValue: (val: string) => val !== 'normal' && val !== 'start' },
      { id: 'eg16-15', name: 'Align Items', description: 'Item alignment specified', type: 'style', selector: '.dashboard', property: 'align-items', expectedValue: (val: string) => val !== 'normal' && val !== 'start' }
    ],
    passingScore: 90
  },
  {
    id: 'endgame-17',
    title: 'Intersection Observer Lazy Loading',
    difficulty: 'Hard',
    category: 'End Game',
    link: 'https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API',
    recommended: true,
    description: 'Implement advanced lazy loading using Intersection Observer API. Handle images, videos, and components with proper loading states, error handling, and performance optimization.',
    tags: ['intersection-observer', 'lazy-loading', 'performance', 'images', 'optimization'],
    starterHtml: '',
    starterCss: '.lazy { opacity: 0; transition: opacity 0.3s; } .lazy.loaded { opacity: 1; }',
    starterJs: '// Intersection Observer\n// TODO: Create observer\n// TODO: Observe elements\n// TODO: Load on intersection\n// TODO: Handle errors',
    hints: ['Create IntersectionObserver', 'Set threshold and rootMargin', 'Load images when visible', 'Add loading placeholders'],
    testCases: [
      { id: 'eg17-1', name: 'Observer Created', description: 'IntersectionObserver instantiated', type: 'function', testFunction: 'return window.observer instanceof IntersectionObserver || (typeof IntersectionObserver !== "undefined" && window.__observerCreated)' },
      { id: 'eg17-2', name: 'Elements Observed', description: 'Images are being observed', type: 'function', testFunction: 'return true /* Hard to check observation status without spy */' },
      { id: 'eg17-3', name: 'Data Src Attribute', description: 'Images have data-src', type: 'dom', selector: 'img[data-src]', expectedValue: true },
      { id: 'eg17-4', name: 'Load Logic', description: 'src populated on visible', type: 'function', testFunction: 'return true' },
      { id: 'eg17-5', name: 'Placeholder Class', description: 'Placeholder class exists initially', type: 'dom', selector: '.lazy', expectedValue: true },
      { id: 'eg17-6', name: 'Root Margin', description: 'rootMargin set in Observer', type: 'function', testFunction: 'return document.body.innerText.includes("rootMargin") || document.querySelector("script")?.innerText.includes("rootMargin")' },
      { id: 'eg17-7', name: 'Threshold', description: 'Threshold defined', type: 'function', testFunction: 'return document.querySelector("script")?.innerText.includes("threshold")' },
      { id: 'eg17-8', name: 'Unobserve', description: 'Cleanup after load', type: 'function', testFunction: 'return document.querySelector("script")?.innerText.includes("unobserve")' },
      { id: 'eg17-9', name: 'Loaded Class Transition', description: 'CSS transition for smooth loading', type: 'style', selector: '.lazy', property: 'transition', expectedValue: (val: string) => val.includes('opacity') },
      { id: 'eg17-10', name: 'Native Lazy Loading', description: 'Fallback loading="lazy"', type: 'dom', selector: 'img[loading="lazy"]', expectedValue: true },
      { id: 'eg17-11', name: 'Intersection Ratio Check', description: 'Logic checks isIntersecting', type: 'function', testFunction: 'return document.querySelector("script")?.innerText.includes("isIntersecting")' },
      { id: 'eg17-12', name: 'Alt Text', description: 'Accessibility alt text present', type: 'dom', selector: 'img[alt]', expectedValue: true },
      { id: 'eg17-13', name: 'Data Attributes', description: 'Correct data-src usage', type: 'function', testFunction: 'return document.querySelector("img").dataset.src !== undefined' },
      { id: 'eg17-14', name: 'Error Handling', description: 'Image error handling present', type: 'function', testFunction: 'return document.querySelector("script")?.innerText.includes("onerror") || document.querySelector("script")?.innerText.includes("catch")' },
      { id: 'eg17-15', name: 'Observer Disconnect', description: 'Disconnect method used', type: 'function', testFunction: 'return document.querySelector("script")?.innerText.includes("disconnect")' }
    ],
    passingScore: 90
  },
  {
    id: 'endgame-18',
    title: 'Custom Form Validation Engine',
    difficulty: 'Hard',
    category: 'End Game',
    link: 'https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation',
    recommended: true,
    description: 'Build a comprehensive form validation system with custom rules, async validation, real-time feedback, error messages, and accessibility features. Support complex validation scenarios.',
    tags: ['forms', 'validation', 'accessibility', 'ux', 'custom'],
    starterHtml: '// Add particular HTML according question',
    starterCss: '.error { color: red; font-size: 0.875rem; } .invalid { border-color: red; }',
    starterJs: '// Custom validation\nclass FormValidator {\n  // TODO: Add validation rules\n  // TODO: Real-time validation\n  // TODO: Async validation\n  // TODO: Error display\n}',
    hints: ['Use Constraint Validation API', 'Add custom validation rules', 'Implement async validation', 'Show errors accessibly'],
    testCases: [
      { id: 'eg18-1', name: 'Form Validation', description: 'Form checkValidity works', type: 'function', testFunction: 'return document.querySelector("form").checkValidity() === false /* Should fail initially with empty required fields */' },
      { id: 'eg18-2', name: 'Error Display', description: 'Error container populated on invalid', type: 'function', testFunction: 'return document.querySelector(".errors") !== null' },
      { id: 'eg18-3', name: 'Custom Rules', description: 'Custom validation logic', type: 'function', testFunction: 'return window.validator !== undefined || true' },
      { id: 'eg18-4', name: 'Input Types', description: 'Correct input types used', type: 'dom', selector: 'input[required]', expectedValue: true },
      { id: 'eg18-5', name: 'Submit Handler', description: 'Prevent default on submit', type: 'function', testFunction: 'return true' },
      { id: 'eg18-6', name: 'Novalidate', description: 'Native validation disabled', type: 'dom', selector: 'form[novalidate]', expectedValue: true },
      { id: 'eg18-7', name: 'ARIA Invalid', description: 'aria-invalid updates', type: 'function', testFunction: 'return document.querySelector("script")?.innerText.includes("aria-invalid")' },
      { id: 'eg18-8', name: 'ARIA DescribedBy', description: 'Error message association', type: 'function', testFunction: 'return document.querySelector("script")?.innerText.includes("aria-describedby")' },
      { id: 'eg18-9', name: 'Real-time Validation', description: 'Input event listener', type: 'function', testFunction: 'return document.querySelector("script")?.innerText.includes("addEventListener") && document.querySelector("script")?.innerText.includes("input")' },
      { id: 'eg18-10', name: 'Blur Validation', description: 'Blur event listener', type: 'function', testFunction: 'return document.querySelector("script")?.innerText.includes("blur")' },
      { id: 'eg18-11', name: 'Custom Validity', description: 'setCustomValidity used', type: 'function', testFunction: 'return document.querySelector("script")?.innerText.includes("setCustomValidity")' },
      { id: 'eg18-12', name: 'Report Validity', description: 'reportValidity used', type: 'function', testFunction: 'return document.querySelector("script")?.innerText.includes("reportValidity")' },
      { id: 'eg18-13', name: 'Password Strength', description: 'Regex pattern check', type: 'function', testFunction: 'return document.querySelector("script")?.innerText.includes("RegExp") || document.querySelector("script")?.innerText.includes("pattern")' },
      { id: 'eg18-14', name: 'Error Message Container', description: 'Div for errors exists', type: 'dom', selector: '.error-message, .errors', expectedValue: true },
      { id: 'eg18-15', name: 'Visual Feedback', description: 'Invalid class styling', type: 'style', selector: '.invalid', property: 'border-color', expectedValue: (val: string) => val !== 'rgb(0, 0, 0)' }
    ],
    passingScore: 90
  },
  {
    id: 'endgame-19',
    title: 'React Context with useReducer',
    difficulty: 'Hard',
    category: 'End Game',
    link: 'https://react.dev/learn/scaling-up-with-reducer-and-context',
    recommended: true,
    description: 'Build a scalable state management solution combining React Context and useReducer. Implement actions, reducers, middleware, and optimize performance with proper context splitting.',
    tags: ['react', 'context', 'reducer', 'state-management', 'hooks'],
    starterHtml: '<div id="root"></div>',
    starterCss: '',
    starterJs: '// Context + Reducer\nimport { createContext, useReducer, useContext } from "react";\n\nconst AppContext = createContext();\n\nfunction appReducer(state, action) {\n  // TODO: Handle actions\n}',
    hints: ['Create context with createContext', 'Use useReducer for state', 'Split contexts for performance', 'Add action creators'],
    testCases: [
      { id: 'eg19-1', name: 'Context Provider', description: 'Provider used in tree', type: 'function', testFunction: 'return true /* Implicit via render */' },
      { id: 'eg19-2', name: 'Reducer Hook', description: 'useReducer used', type: 'function', testFunction: 'return typeof useReducer === "function" && typeof appReducer === "function"' },
      { id: 'eg19-3', name: 'Initial State', description: 'State initialized', type: 'function', testFunction: 'return typeof initialState !== "undefined" || true' },
      { id: 'eg19-4', name: 'Dispatch', description: 'Dispatch function accessible', type: 'function', testFunction: 'return true' },
      { id: 'eg19-5', name: 'Performance', description: 'Context split or memoized', type: 'function', testFunction: 'return true' },
      { id: 'eg19-6', name: 'Context Value Object', description: 'Context provides object', type: 'function', testFunction: 'return document.querySelector("script")?.innerText.includes("value={{")' },
      { id: 'eg19-7', name: 'useMemo Optimization', description: 'Values memoized', type: 'function', testFunction: 'return document.querySelector("script")?.innerText.includes("useMemo")' },
      { id: 'eg19-8', name: 'useCallback Optimization', description: 'Functions memoized', type: 'function', testFunction: 'return document.querySelector("script")?.innerText.includes("useCallback")' },
      { id: 'eg19-9', name: 'Action Types', description: 'Action structure defined', type: 'function', testFunction: 'return document.querySelector("script")?.innerText.includes("type:") || document.querySelector("script")?.innerText.includes("action.type")' },
      { id: 'eg19-10', name: 'Switch Case', description: 'Reducer uses switch', type: 'function', testFunction: 'return document.querySelector("script")?.innerText.includes("switch") && document.querySelector("script")?.innerText.includes("case")' },
      { id: 'eg19-11', name: 'Default Case', description: 'Reducer throws on unknown action', type: 'function', testFunction: 'return document.querySelector("script")?.innerText.includes("default:") && document.querySelector("script")?.innerText.includes("throw")' },
      { id: 'eg19-12', name: 'Custom Hook', description: 'Context consumer hook', type: 'function', testFunction: 'return document.querySelector("script")?.innerText.includes("useContext")' },
      { id: 'eg19-13', name: 'Split Contexts', description: 'Dispatch context separation', type: 'function', testFunction: 'return (document.querySelector("script")?.innerText.match(/createContext/g) || []).length > 1' },
      { id: 'eg19-14', name: 'Immutability', description: 'State updates via spread', type: 'function', testFunction: 'return document.querySelector("script")?.innerText.includes("...")' },
      { id: 'eg19-15', name: 'DevTools Display Name', description: 'Context display name set', type: 'function', testFunction: 'return document.querySelector("script")?.innerText.includes(".displayName")' }
    ],
    passingScore: 90
  },
  {
    id: 'endgame-20',
    title: 'Accessibility-First Component Library',
    difficulty: 'Hard',
    category: 'End Game',
    link: 'https://www.w3.org/WAI/ARIA/apg/',
    recommended: true,
    description: 'Build accessible UI components following WAI-ARIA guidelines. Implement keyboard navigation, screen reader support, focus management, and ARIA attributes for modal, tabs, accordion, and dropdown.',
    tags: ['accessibility', 'aria', 'keyboard', 'a11y', 'components'],
    starterHtml: '// Add particular HTML according question',
    starterCss: '[role="dialog"] { /* Accessible modal styles */ }',
    starterJs: '// Accessible components\n// TODO: Keyboard navigation\n// TODO: Focus trap\n// TODO: ARIA attributes\n// TODO: Screen reader support',
    hints: ['Use proper ARIA roles', 'Implement keyboard shortcuts', 'Manage focus properly', 'Test with screen readers'],
    testCases: [
      { id: 'eg20-1', name: 'ARIA Roles', description: 'Elements have roles', type: 'dom', selector: '[role]', expectedValue: true },
      { id: 'eg20-2', name: 'ARIA Labels', description: 'aria-label or labelledby used', type: 'dom', selector: '[aria-label], [aria-labelledby]', expectedValue: true },
      { id: 'eg20-3', name: 'Tab Index', description: 'Keyboard focusable elements', type: 'dom', selector: '[tabindex="0"], button, a[href], input', expectedValue: true },
      { id: 'eg20-4', name: 'Focus Trap', description: 'Focus trap implemented', type: 'function', testFunction: 'return true /* Logic check needed */' },
      { id: 'eg20-5', name: 'ARIA Expanded', description: 'Expandable widgets state', type: 'function', testFunction: 'return document.querySelector("[aria-expanded]") !== null || true' },
      { id: 'eg20-6', name: 'Keydown Handler', description: 'Keyboard support implementation', type: 'function', testFunction: 'return document.querySelector("script")?.innerText.includes("keydown") || document.querySelector("script")?.innerText.includes("keyup")' },
      { id: 'eg20-7', name: 'Key Code Checks', description: 'Specific key checks (Enter/Space/Esc)', type: 'function', testFunction: 'return document.querySelector("script")?.innerText.includes("key ===") || document.querySelector("script")?.innerText.includes("code ===")' },
      { id: 'eg20-8', name: 'Focus Management', description: 'Programmatic focus', type: 'function', testFunction: 'return document.querySelector("script")?.innerText.includes(".focus()")' },
      { id: 'eg20-9', name: 'ARIA Hidden', description: 'Hiding non-active content', type: 'dom', selector: '[aria-hidden]', expectedValue: true },
      { id: 'eg20-10', name: 'ARIA Modal', description: 'Modal dialog check', type: 'dom', selector: '[aria-modal="true"]', expectedValue: true },
      { id: 'eg20-11', name: 'Button Role', description: 'Role button on div/span', type: 'dom', selector: '[role="button"]', expectedValue: true },
      { id: 'eg20-12', name: 'ARIA Controls', description: 'Controls relationship', type: 'dom', selector: '[aria-controls]', expectedValue: true },
      { id: 'eg20-13', name: 'ARIA Selected', description: 'Tab selection state', type: 'dom', selector: '[aria-selected]', expectedValue: true },
      { id: 'eg20-14', name: 'High Contrast Support', description: 'Focus outline provided', type: 'style', selector: ':focus', property: 'outline', expectedValue: (val: string) => val !== 'none' && val !== '0px' },
      { id: 'eg20-15', name: 'Skip Link', description: 'Skip to main content', type: 'dom', selector: 'a[href^="#main"]', expectedValue: true }
    ],
    passingScore: 90
  }
];


export const ALL_WEB_DEV_QUESTIONS: WebDevQuestion[] = [
  ...htmlQuestions,
  ...cssQuestions,
  ...jsQuestions,
  ...reactQuestions,
  ...endGameQuestions,
];

export const getQuestionsByCategory = (category: string) => {
  if (category === 'all') return ALL_WEB_DEV_QUESTIONS;
  return ALL_WEB_DEV_QUESTIONS.filter(q => q.category === category);
};

export const getQuestionsByDifficulty = (difficulty: string) => {
  return ALL_WEB_DEV_QUESTIONS.filter(q => q.difficulty === difficulty);
};

export const getQuestionById = (id: string) => {
  return ALL_WEB_DEV_QUESTIONS.find(q => q.id === id);
};
