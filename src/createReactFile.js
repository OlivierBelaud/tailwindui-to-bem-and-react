import fs from 'fs'
import { prefixApp } from '../config.js'

const createTag = ({ elementObject, componentName }) => {

  let attr = ''

  if(elementObject.isRoot) {
    attr = attr + ` class="${prefixApp}-${componentName.toLowerCase()}"`
  }else{
    if(elementObject.templateId){
      attr = attr + ` class="${prefixApp}-${componentName.toLowerCase()}__${elementObject.templateId.toLowerCase()}"`
    }
  }

  for (const [key, value] of Object.entries(elementObject.attributes)) {
    attr = attr + ` ${key}="${value}"`
  }

  if(elementObject.nodeName === 'IMG') {
    return {
      initTag: `<${elementObject.nodeName.toLowerCase()}${attr} />`,
      closeTag: ``
    }
  }else{
    return {
      initTag: `<${elementObject.nodeName.toLowerCase()}${attr}>`,
      closeTag: `</${elementObject.nodeName.toLowerCase()}>`
    }
  }
}

const writeReactLines = ({
  componentName,
  streamReact,
  templateObject,
  tabDeepness
}) => {

  console.log('templateObject', templateObject[0])
  templateObject.map((element) => {

    let tabspace = '';
    for (let i = 0; i < tabDeepness; i++) {
      tabspace = `${tabspace}\t`;
    }
    
    switch (element.nodeName) {

      case '#text':
        streamReact.write(`${tabspace}${element.value}\n`);
        break;

      default:

        const { initTag, closeTag } = createTag({ elementObject: element, componentName });

        if(element.childrens.length){

          streamReact.write(`${tabspace}${initTag}\n`);
          writeReactLines({ componentName, streamReact, templateObject: element.childrens, tabDeepness: tabDeepness+1 });
          streamReact.write(`${tabspace}${closeTag}\n`);

        }else{

          streamReact.write(`${tabspace}${initTag}${closeTag}\n`);

        }
        break;
    }
  })
}

const preReact = (componentName) => {
  return `import PropTypes from 'prop-types';
import classNames from 'classnames';
import './${componentName.toLowerCase()}.scss';

const ${componentName} = ({
  ...props
}) => (`
} 

const postReact = (componentName) => {
  return `)

${componentName}.propTypes = {};

export default ${componentName};`
}

const createTemplate = (templateObject) => {

  let streamReact;

  const toCapitalize = ([first, ...rest]) => first.toUpperCase() + rest.join('').toLowerCase();

  const componentName = toCapitalize(templateObject[0].templateId);
  let tabDeepness = 1;

  if (!fs.existsSync(`output/${componentName}`)){
    fs.mkdirSync(`output/${componentName}`, { recursive: true });
  }

  streamReact = fs.createWriteStream(`output/${componentName}/${componentName.toLowerCase()}.jsx`);

  streamReact.write(`${preReact(componentName)}\n`);

  writeReactLines({
    componentName,
    streamReact,
    templateObject,
    tabDeepness
  });

  streamReact.write(`${postReact(componentName)}\n`);
}

export { createTemplate }
