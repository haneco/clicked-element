'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Analytics = function () {
  function Analytics() {
    _classCallCheck(this, Analytics);
  }

  _createClass(Analytics, [{
    key: 'initialize',
    value: function initialize() {
      document.getElementById('clicked_dt').addEventListener('change', this.dateChanged);
      document.getElementById('path').addEventListener('change', this.pathChanged);
      document.getElementById('xpaths').addEventListener('click', this.xpathClicked);
      window.addEventListener('resize', this.adjustIFrame);

      this.adjustIFrame();
    }
  }, {
    key: 'dateChanged',
    value: function dateChanged() {
      var params = new URLSearchParams();
      params.set('action', 'clicked_element_urls');
      params.set('date', document.getElementById('clicked_dt').value);
      fetch(admin_ajax_url + '?' + params.toString(), {
        method: 'GET',
        credentials: 'include'
      }).then(function (response) {
        if (response.ok) {
          return response.json();
        }
      }).then(function (json) {
        var selectElm = document.getElementById('path');
        while (selectElm.firstChild) {
          selectElm.removeChild(selectElm.firstChild);
        }selectElm.appendChild(document.createElement('option'));

        for (var i = 0; i < json.length; ++i) {
          var item = json[i];
          var optionElm = document.createElement('option');
          optionElm.textContent = item.title + '(' + item.path + ')';
          optionElm.setAttribute('value', item.path);
          selectElm.appendChild(optionElm);
        };
      }).catch(function (error) {
        console.log('request failed', error);
      });
    }
  }, {
    key: 'pathChanged',
    value: function pathChanged() {
      var _this = this;

      var path = document.getElementById('path').value;
      var viewer = document.getElementById('clickedelement-viewer');
      viewer.setAttribute('src', path);

      var params = new URLSearchParams();
      params.set('action', 'clicked_element_xpaths');
      params.set('date', document.getElementById('clicked_dt').value);
      params.set('path', path);
      fetch(admin_ajax_url + '?' + params.toString(), {
        method: 'GET',
        credentials: 'include'
      }).then(function (response) {
        if (response.ok) {
          return response.json();
        }
      }).then(function (json) {
        var xpathsTbody = document.getElementById('xpaths');
        while (xpathsTbody.firstChild) {
          xpathsTbody.removeChild(xpathsTbody.firstChild);
        }for (var i = 0; i < json.length; ++i) {
          var item = json[i];
          var rowElm = document.createElement('tr');

          var countCol = document.createElement('td');
          countCol.textContent = item.count;
          rowElm.appendChild(countCol);

          var xpathCol = document.createElement('td');
          var xpathA = document.createElement('a');
          xpathA.textContent = item.xpath;
          xpathA.dataset.xpath = item.xpath;
          xpathCol.appendChild(xpathA);
          rowElm.appendChild(xpathCol);

          xpathsTbody.appendChild(rowElm);
        };

        setTimeout(function () {
          _this.adjustIFrame();
        }, 11);
      }).catch(function (error) {
        console.log('request failed', error);
      });
    }
  }, {
    key: 'xpathClicked',
    value: function xpathClicked(e) {
      if (e.srcElement.tagName != 'A') {
        return;
      }
      var xpath = e.srcElement.dataset.xpath;
      var iframeWindow = document.getElementById('clickedelement-viewer').contentWindow;
      var iframeDocument = iframeWindow.document;
      var xpathResult = document.evaluate(xpath, iframeDocument, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
      var node = xpathResult.singleNodeValue;

      var highlighter = iframeDocument.getElementById('clickedelement-highlighter');
      if (!highlighter) {
        highlighter = iframeDocument.createElement('div');
        highlighter.setAttribute('id', 'clickedelement-highlighter');
        highlighter.style.position = 'absolute';
        highlighter.style.background = 'rgba(128, 128, 255, 0.5)';
        iframeDocument.body.appendChild(highlighter);
      }

      if (node) {
        node.scrollIntoView(false);
        var rect = node.getBoundingClientRect();
        highlighter.style.top = rect.top + iframeWindow.pageYOffset + 'px';
        highlighter.style.left = rect.left + iframeWindow.pageXOffset + 'px';
        highlighter.style.width = rect.width + 'px';
        highlighter.style.height = rect.height + 'px';
      }

      var iframeRect = document.getElementById('clickedelement-viewer').getBoundingClientRect();
      var footerRect = document.getElementById('wpfooter').getBoundingClientRect();
      document.getElementById('clickedelement-viewer').height = footerRect.y - footerRect.height - iframeRect.y;
    }
  }, {
    key: 'adjustIFrame',
    value: function adjustIFrame() {
      setTimeout(function () {
        var viewer = document.getElementById('clickedelement-viewer');
        var iframeRect = viewer.getBoundingClientRect();
        var footerRect = document.getElementById('wpfooter').getBoundingClientRect();
        viewer.height = footerRect.y - footerRect.height - iframeRect.y;
      }, 1);
    }
  }]);

  return Analytics;
}();

(function () {
  var analytics = new Analytics();
  analytics.initialize();
})();