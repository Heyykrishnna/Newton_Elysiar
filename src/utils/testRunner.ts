export interface TestCase {
  id: string;
  name: string;
  description: string;
  type: 'dom' | 'style' | 'function' | 'output';
  selector?: string;
  property?: string;
  expectedValue?: any;
  testFunction?: string;
}

export interface TestResult {
  testId: string;
  testName: string;
  passed: boolean;
  message: string;
  expected?: any;
  actual?: any;
}

export interface TestRunResult {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  percentage: number;
  results: TestResult[];
}

export const runTests = async (
  html: string,
  css: string,
  js: string,
  testCases: TestCase[]
): Promise<TestRunResult> => {
  const results: TestResult[] = [];
  
  // Create a sandboxed iframe to run tests
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  document.body.appendChild(iframe);
  
  try {
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) throw new Error('Cannot access iframe document');
    
    // Inject code into iframe
    iframeDoc.open();
    iframeDoc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>${css}</style>
          <script>
            window.__USER_CODE__ = {
              html: ${JSON.stringify(html)},
              css: ${JSON.stringify(css)},
              js: ${JSON.stringify(js)}
            };
          </script>
        </head>
        <body>
          ${html}
          <script>${js}</script>
        </body>
      </html>
    `);
    iframeDoc.close();
    
    // Wait for content to load
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Run each test
    for (const testCase of testCases) {
      try {
        const result = await runSingleTest(testCase, iframeDoc, iframe.contentWindow);
        results.push(result);
      } catch (error: any) {
        results.push({
          testId: testCase.id,
          testName: testCase.name,
          passed: false,
          message: `Test error: ${error.message}`,
        });
      }
    }
  } finally {
    document.body.removeChild(iframe);
  }
  
  const passedTests = results.filter(r => r.passed).length;
  const totalTests = results.length;
  
  return {
    totalTests,
    passedTests,
    failedTests: totalTests - passedTests,
    percentage: totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0,
    results,
  };
};

const runSingleTest = async (
  testCase: TestCase,
  doc: Document,
  win: Window | null
): Promise<TestResult> => {
  switch (testCase.type) {
    case 'dom':
      return runDOMTest(testCase, doc);
    case 'style':
      return runStyleTest(testCase, doc);
    case 'function':
      return runFunctionTest(testCase, win);
    case 'output':
      return runOutputTest(testCase, doc);
    default:
      throw new Error(`Unknown test type: ${testCase.type}`);
  }
};

const runDOMTest = (testCase: TestCase, doc: Document): TestResult => {
  const { id, name, selector, property, expectedValue } = testCase;
  
  if (!selector) {
    return {
      testId: id,
      testName: name,
      passed: false,
      message: 'No selector provided for DOM test',
    };
  }
  
  const element = doc.querySelector(selector);
  
  if (!element) {
    return {
      testId: id,
      testName: name,
      passed: false,
      message: `Element not found: ${selector}`,
      expected: 'Element to exist',
      actual: 'Element not found',
    };
  }
  
  if (!property) {
    // Just check existence
    return {
      testId: id,
      testName: name,
      passed: true,
      message: `Element found: ${selector}`,
    };
  }
  
  const actualValue = (element as any)[property];
  const passed = typeof expectedValue === 'function' 
    ? expectedValue(actualValue)
    : actualValue === expectedValue;
  
  return {
    testId: id,
    testName: name,
    passed,
    message: passed ? 'Test passed' : 'Value mismatch',
    expected: typeof expectedValue === 'function' ? 'Custom validation' : expectedValue,
    actual: actualValue,
  };
};

const runStyleTest = (testCase: TestCase, doc: Document): TestResult => {
  const { id, name, selector, property, expectedValue } = testCase;
  
  if (!selector || !property) {
    return {
      testId: id,
      testName: name,
      passed: false,
      message: 'Selector and property required for style test',
    };
  }
  
  const element = doc.querySelector(selector);
  
  if (!element) {
    return {
      testId: id,
      testName: name,
      passed: false,
      message: `Element not found: ${selector}`,
    };
  }
  
  const computedStyle = window.getComputedStyle(element);
  const actualValue = computedStyle.getPropertyValue(property);
  
  const passed = typeof expectedValue === 'function'
    ? expectedValue(actualValue)
    : actualValue === expectedValue;
  
  return {
    testId: id,
    testName: name,
    passed,
    message: passed ? 'Style test passed' : 'Style value mismatch',
    expected: typeof expectedValue === 'function' ? 'Custom validation' : expectedValue,
    actual: actualValue,
  };
};

const runFunctionTest = (testCase: TestCase, win: Window | null): TestResult => {
  const { id, name, testFunction } = testCase;
  
  if (!testFunction || !win) {
    return {
      testId: id,
      testName: name,
      passed: false,
      message: 'Test function or window not available',
    };
  }
  
  try {
    // Clean and prepare the test function
    let cleanedFunction = testFunction.trim();
    
    // Wrap the function in a try-catch to avoid "illegal" errors
    const safeFunction = `
      (function() {
        try {
          ${cleanedFunction}
        } catch (e) {
          return false;
        }
      })()
    `;
    
    // Use Function constructor for safer execution
    const executableFn = new Function('window', 'document', `
      with(window) {
        return (function() {
          try {
            ${cleanedFunction}
          } catch (e) {
            console.error('Test execution error:', e);
            return false;
          }
        })();
      }
    `);
    
    const result = executableFn.call(win, win, win.document);
    
    return {
      testId: id,
      testName: name,
      passed: !!result,
      message: result ? 'Function test passed' : 'Function test failed',
      actual: result,
    };
  } catch (error: any) {
    // Handle syntax errors and other issues gracefully
    console.error('Test function error:', error);
    return {
      testId: id,
      testName: name,
      passed: false,
      message: `Test error: ${error.message || 'Unknown error'}`,
    };
  }
};

const runOutputTest = (testCase: TestCase, doc: Document): TestResult => {
  const { id, name, selector, expectedValue } = testCase;
  
  if (!selector) {
    return {
      testId: id,
      testName: name,
      passed: false,
      message: 'Selector required for output test',
    };
  }
  
  const element = doc.querySelector(selector);
  
  if (!element) {
    return {
      testId: id,
      testName: name,
      passed: false,
      message: `Element not found: ${selector}`,
    };
  }
  
  const actualOutput = element.textContent?.trim() || '';
  const passed = typeof expectedValue === 'function'
    ? expectedValue(actualOutput)
    : actualOutput.includes(expectedValue);
  
  return {
    testId: id,
    testName: name,
    passed,
    message: passed ? 'Output test passed' : 'Output mismatch',
    expected: expectedValue,
    actual: actualOutput,
  };
};
