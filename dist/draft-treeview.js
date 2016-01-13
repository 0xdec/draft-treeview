/*
* draft-treeview - A plugin for draft.js that renders nice tree views in the DOM
* version v0.0.0
* https://github.com/D1SC0tech/draft-treeview
*
* copyright Jordi Pakey-Rodriguez <jordi.orlando@gmail.com>
* license MIT
*
* BUILT: Tue Jan 12 2016 18:52:31 GMT-0600 (CST)
*/
(function() {
  // TODO: allow treeview to be attached to any DOM element
  // TODO: make each element in the treeview into its own element
  var treeView = {
    /*require: [
      Draft.json
    ],*/

    createTreeView: function() {
      var treeView = document.createElement('div');
      treeView.className = 'tree-view';

      // treeView.appendChild(document.createElement('span'));
      // treeView.firstChild.textContent = 'Document Model:';

      var pre = document.createElement('pre');
      treeView.appendChild(pre);

      // Make sure this.dom is initialized
      this.dom = this.dom || {};
      this.dom.treeView = treeView;

      this.dom.node.addEventListener('update', function(e) {
        // e.stopPropagation();
        e.currentTarget.element.updateTreeView();
      }, false);

      return this.updateTreeView();
    },

    updateTreeView: function() {
      var replacer = function(key, value) {
        if (key == 'dom' || key == 'doc' || key == 'parent' || key == 'id' || key == 'type' || key == '_events') {
          return undefined;
        } else if (key == 'children') {
          var obj = {};
          for (let element of value) {
            obj[element.getID()] = element;
          }
          return obj;
        } else {
          return value;
        }
      };

      var treeString = this.stringify(replacer).split('"').join('');
      this.dom.treeView.firstChild.textContent = this.getID() + ': ' + treeString;

      var longestLine = treeString.split('\n').reduce(function(a, b) {
        return a.length > b.length ? a : b;
      });
      // HACK: change 84 to a non-hardcoded value
      this.dom.treeView.style.width = Math.min(longestLine.length + 4, 84) + 'ch';

      return this.dom.treeView;
    }
  };

  // Draft.extend(Draft.Container, treeView);
  Draft.Container.require('json');
  Draft.Container.mixin(treeView);



  /*var css = document.createElement('link');
  css.setAttribute('rel', 'stylesheet');
  css.setAttribute('type', 'text/css');
  css.setAttribute('href', 'bower_components/draft-treeview/main.css');

  document.getElementsByTagName('head')[0].appendChild(css);*/
})();