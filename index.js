
import { processTemplate } from './src/templateToObject.js'
import { createTemplate } from './src/createReactFile.js'
import { createCSS } from './src/createSCSSFile.js'
import { template } from'./template.js';

const templateObject = processTemplate(template);

createTemplate(templateObject);
createCSS(templateObject);
