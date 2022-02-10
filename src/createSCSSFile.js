import fs from 'fs'
import { prefixApp } from '../config.js'

const writeClassesLines = ({ streamCSS, element, tabspace }) => {

  if(element.class){

    streamCSS.write(`${tabspace}\t@apply\n`)

    element.class.split(' ').map((cl,i,a) => {
      if(i+1 === a.length){
        streamCSS.write(`${tabspace}\t\t${cl};\n`)
      }else{
        streamCSS.write(`${tabspace}\t\t${cl}\n`)
      }
    })

  }

}

const writeCSSLines = ({
  streamCSS,
  templateObject,
  tabDeepness
}) => {

  templateObject.map((element) => {

    let tabspace = ''
    for (let i = 0; i < tabDeepness; i++) {
      tabspace = `${tabspace}\t`
    }

    let classSelector = null

    if(element.class && element.templateId){

      classSelector = element.isRoot ?
        `.${prefixApp}-${element.templateId.toLowerCase()}` :
        `&__${element.templateId.toLowerCase()}`

      streamCSS.write(`${tabspace}${classSelector} {\n`)
      writeClassesLines({ streamCSS, element, tabspace })
      !element.isRoot && streamCSS.write(`${tabspace}}\n`)
      streamCSS.write(`\n`)

      if(element.childrens.length){
        writeCSSLines({ streamCSS, templateObject: element.childrens, tabDeepness: 1 })
      }

      element.isRoot && streamCSS.write(`}\n`)
      element.isRoot && streamCSS.write(`\n`)
    }
  })
}

const createCSS = (templateObject) => {

  let streamCSS;

  const toCapitalize = ([first, ...rest]) => first.toUpperCase() + rest.join('').toLowerCase();

  const componentName = toCapitalize(templateObject[0].templateId);
  let tabDeepness = 0;

  if (!fs.existsSync(`output/${componentName}`)){
    fs.mkdirSync(`output/${componentName}`, { recursive: true });
  }

  streamCSS = fs.createWriteStream(`output/${componentName}/${componentName.toLowerCase()}.scss`);

  writeCSSLines({
    streamCSS,
    templateObject,
    tabDeepness
  });
}

export { createCSS }