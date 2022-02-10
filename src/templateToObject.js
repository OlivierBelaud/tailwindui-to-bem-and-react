import { JSDOM } from "jsdom";

const getAttributes = ({ NamedNodeMap }) => {

  let object = {}
  NamedNodeMap && Array.from(NamedNodeMap).map(node => {
    object[node.nodeName] = node.nodeValue
  })
  return {
    ...object,
    class: object?.class || null,
    templateid: object?.templateid || null
  }

}

const loopTemplate = ({ nodeList }) => {

    return Array.from(nodeList).map(node => {

      if(node.nodeName === '#text' && !node.nodeValue.trim()){
        return false
      }

      const { class: classes, templateid, ...attributes } = getAttributes({ NamedNodeMap: node.attributes })

      return {
        nodeName: node.nodeName,
        templateId: templateid,
        class: classes,
        value: node.nodeValue?.trim(),
        isRoot: node.parentNode.nodeName === 'BODY',
        attributes: attributes,
        childrens: node.childNodes.length && loopTemplate({ nodeList: node.childNodes })
      };
    }).filter(node => node);

}

const processTemplate = (temp) => {

  const dom = new JSDOM(temp.replace(/(\r\n|\n|\r)/gm, "").trim());
  const rootNodeList = dom.window.document.body.childNodes;

  return loopTemplate({ nodeList: rootNodeList })

};

export { processTemplate }