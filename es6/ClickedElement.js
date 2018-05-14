/**
 * Build XPath from element node
 *
 * @param   Node     element_node  target element node
 * @returns {string} XPath string
 */
function getXpathByElementNode(element_node) {
  const ELEMENT_NODE = 1;
  let currentNode = (element_node instanceof Array) ? element_node = element_node[0] : element_node;

  if (element_node.nodeType != ELEMENT_NODE) {
    throw new ErrorException('nodes other than the element node was passed. node_type:' + element_node.nodeType + ' node_name:' + element_node.nodeName);
  }

  const pathElements = [];

  do {
    const id = currentNode.id;
    if (id) {
      const nodeName = '/*[@id="' + id + '"]';
      pathElements.unshift(nodeName);
      break;
    } else {
      let nodeName = currentNode.nodeName.toLowerCase();
      const siblings = currentNode.parentNode.children;
      if (siblings.length > 1) {
        let nodeCount = 0;
        let nodePoint = null;
        for (let i = 0; i < siblings.length; i++) {
          if (currentNode.nodeName == siblings[i].nodeName) {
            nodeCount++;
            if (currentNode.isEqualNode(siblings[i])) {
              nodePoint = nodeCount;
            }
            if (nodePoint != null && nodeCount > 1) {
              nodeName += '[' + nodePoint + ']';
              break;
            }
          }
        }
      }
      pathElements.unshift(nodeName);
    }
  } while ((currentNode = currentNode.parentNode) != null && currentNode.nodeName != '#document');

  return '/' + pathElements.join('/').toLowerCase();
}

(function () {
  document.addEventListener('click', function (e) {
    var node = e.srcElement;
    var xpath = getXpathByElementNode(node);
    console.log(xpath);
    var formData = new FormData();
    formData.append('action', 'clicked_element_insert');
    formData.append('path', location.pathname);
    formData.append('xpath', xpath);
    fetch(admin_ajax_url, {
      method: 'POST',
      body: formData
    })
      .then(status)
      .then((json) => {
        console.log('request succeeded with json response', json)
      }).catch((error) => {
        console.log('request failed', error)
      })
  });
})();