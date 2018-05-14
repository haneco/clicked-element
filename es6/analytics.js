class Analytics {
  initialize() {
    document.getElementById('clicked_dt').addEventListener('change', this.dateChanged);
    document.getElementById('path').addEventListener('change', this.pathChanged);
    document.getElementById('xpaths').addEventListener('click', this.xpathClicked);
    window.addEventListener('resize', this.adjustIFrame);

    this.adjustIFrame();
  }

  dateChanged() {
    const params = new URLSearchParams();
    params.set('action', 'clicked_element_urls');
    params.set('date', document.getElementById('clicked_dt').value);
    fetch(admin_ajax_url + '?' + params.toString(), {
      method: 'GET',
      credentials: 'include'
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((json) => {
        const selectElm = document.getElementById('path');
        while (selectElm.firstChild) selectElm.removeChild(selectElm.firstChild);
        selectElm.appendChild(document.createElement('option'));

        for (let i = 0; i < json.length; ++i) {
          const item = json[i];
          const optionElm = document.createElement('option');
          optionElm.textContent = item.title + '(' + item.path + ')';
          optionElm.setAttribute('value', item.path);
          selectElm.appendChild(optionElm);
        };
      })
      .catch((error) => {
        console.log('request failed', error);
      })
  
  }

  pathChanged() {
    const path = document.getElementById('path').value;
    const viewer = document.getElementById('clickedelement-viewer');
    viewer.setAttribute('src', path);

    const params = new URLSearchParams();
    params.set('action', 'clicked_element_xpaths');
    params.set('date', document.getElementById('clicked_dt').value);
    params.set('path', path);
    fetch(admin_ajax_url + '?' + params.toString(), {
      method: 'GET',
      credentials: 'include'
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((json) => {
        const xpathsTbody = document.getElementById('xpaths');
        while (xpathsTbody.firstChild) xpathsTbody.removeChild(xpathsTbody.firstChild);

        for (let i = 0; i < json.length; ++i) {
          const item = json[i];
          const rowElm = document.createElement('tr');
          
          const countCol = document.createElement('td');
          countCol.textContent = item.count;
          rowElm.appendChild(countCol);

          const xpathCol = document.createElement('td');
          const xpathA = document.createElement('a');
          xpathA.textContent = item.xpath;
          xpathA.dataset.xpath = item.xpath;
          xpathCol.appendChild(xpathA);
          rowElm.appendChild(xpathCol);

          xpathsTbody.appendChild(rowElm);
        };

        setTimeout(() => {
          this.adjustIFrame();

        },11);
      })
      .catch((error) => {
        console.log('request failed', error);
      });
  }

  xpathClicked(e) {
    if (e.srcElement.tagName != 'A') {
      return;
    }
    const xpath = e.srcElement.dataset.xpath;
    const iframeWindow = document.getElementById('clickedelement-viewer').contentWindow;
    const iframeDocument = iframeWindow.document;
    const xpathResult = document.evaluate( xpath, iframeDocument, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null );
    const node = xpathResult.singleNodeValue;

    let highlighter = iframeDocument.getElementById('clickedelement-highlighter');
    if (!highlighter) {
      highlighter = iframeDocument.createElement('div');
      highlighter.setAttribute('id', 'clickedelement-highlighter');
      highlighter.style.position = 'absolute';
      highlighter.style.background = 'rgba(128, 128, 255, 0.5)';
      iframeDocument.body.appendChild(highlighter);
    }

    if (node) {
      node.scrollIntoView(false);
      const rect = node.getBoundingClientRect();
      highlighter.style.top = (rect.top + iframeWindow.pageYOffset) + 'px';
      highlighter.style.left = (rect.left + iframeWindow.pageXOffset) + 'px';
      highlighter.style.width =rect.width + 'px';
      highlighter.style.height =rect.height + 'px';
    }

    const iframeRect = document.getElementById('clickedelement-viewer').getBoundingClientRect();
    const footerRect = document.getElementById('wpfooter').getBoundingClientRect();
    document.getElementById('clickedelement-viewer').height = footerRect.y - footerRect.height - iframeRect.y;
  }

  adjustIFrame() {
    setTimeout(() => {
      const viewer = document.getElementById('clickedelement-viewer');
      const iframeRect = viewer.getBoundingClientRect();
      const footerRect = document.getElementById('wpfooter').getBoundingClientRect();
      viewer.height = footerRect.y - footerRect.height - iframeRect.y;    
    }, 1);
  }
}

(function () {
  const analytics = new Analytics();
  analytics.initialize();
})();
