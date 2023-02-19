(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var linkedCheckbox = require("./widgets/linkedCheckbox");
function runSetup(widget) {
  if (widget.setup) {
    widget.setup();
  }
  ;
}
;
function setListeners(widget) {
  widget.actions.forEach(function (action) {
    action.element.addEventListener(action.event, action.handler);
  });
}
;
function kjs(constructors, page) {
  var widgetElements = page.querySelectorAll('[kjs-type]');
  widgetElements.forEach(function (el) {
    var widgetName = el.getAttribute('kjs-type');
    var widget = constructors[widgetName](el);
    runSetup(widget);
    setListeners(widget);
  });
}
;
module.exports = kjs;

},{"./widgets/linkedCheckbox":5}],2:[function(require,module,exports){
"use strict";

var _k = _interopRequireDefault(require("./k"));
var _drawers = _interopRequireDefault(require("./widgets/drawers"));
var _extendingForm = _interopRequireDefault(require("./widgets/extending-form"));
var _tabs = _interopRequireDefault(require("./widgets/tabs"));
var _linkedCheckbox = _interopRequireDefault(require("./widgets/linkedCheckbox"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
document.addEventListener("DOMContentLoaded", function () {
  (0, _k["default"])({
    drawers: _drawers["default"],
    extendingForm: _extendingForm["default"],
    tabs: _tabs["default"],
    linkedCheckbox: _linkedCheckbox["default"]
  }, document);
});

},{"./k":1,"./widgets/drawers":3,"./widgets/extending-form":4,"./widgets/linkedCheckbox":5,"./widgets/tabs":6}],3:[function(require,module,exports){
"use strict";

function accordion(widget) {
  var handles = widget.querySelectorAll('[kjs-role=handle]');
  var drawers = widget.querySelectorAll('[kjs-role=drawer]');
  function handleClick(e) {
    var openId = e.target.getAttribute('kjs-id');
    drawers.forEach(function (drawer) {
      if (drawer.getAttribute('kjs-handle-id') == openId) {
        drawer.classList.toggle('open');
      } else {
        drawer.classList.remove('open');
      }
    });
  }
  var actions = [];
  handles.forEach(function (handle) {
    actions.push({
      element: handle,
      event: 'click',
      handler: handleClick
    });
  });
  return {
    actions: actions
  };
}
module.exports = accordion;

},{}],4:[function(require,module,exports){
"use strict";

function extendingForm(widget) {
  var extensions = widget.querySelectorAll('[kjs-role=extension]');
  var toggle = widget.querySelector('[kjs-role=toggle]');
  function setup() {
    extensions.forEach(function (extension) {
      if (toggle.value == extension.getAttribute('kjs-trigger')) {
        extension.classList.add('reveal');
      } else {
        extension.classList.remove('reveal');
      }
    });
  }
  var actions = [{
    element: toggle,
    event: 'change',
    handler: setup
  }];
  return {
    setup: setup,
    actions: actions
  };
}
module.exports = extendingForm;

},{}],5:[function(require,module,exports){
"use strict";

function linkedCheckbox(widget) {
  // Select all checkbox items
  var linkedCheckboxes = widget.querySelectorAll('[kjs-role=checkbox]');
  // setup function
  // Setup function needs to set the current checkbox item 
  // Set a variable to equal the current checkbox item's children (and their children, etc. etc. until all elements are selected)
  // Set a variable equal to a widget's state (checked, unchecked, intermediary)

  function setup() {
    var activeCheckboxLI = widget.querySelector('.active[kjs-role=checkbox]');
    var activeChildren = findChildren(activeCheckboxLI);
    var checkbox = firstCheckbox(activeCheckboxLI);

    // This one takes the active checbkox and sets all the children to be checked

    for (var i = 0; i < activeChildren.length; i++) {
      activeChildren[i].checked = checkbox.checked;
    }

    /* 
        Function that searches for siblings to see if all are checked
         Have a stop gap of a the most parent item
         If search the parent element of the target element.
        If all the elements are = to one another, then element.checked = parent.checked
        else, nothing
    
    */
  }

  function findChildren(checkbox) {
    var allDescendants = [];
    var childNodes = checkbox.parentElement.childNodes;
    for (var i = 0; i < childNodes.length; i++) {
      var element = childNodes.length;
      if (childNodes[i].nodeType == 1) {
        recurseToFindChildren(childNodes[i], allDescendants);
      }
    }
    return allDescendants.slice(1); // This slice removes the element itself from the array
  }
  ;
  function findCheckedChildren(checkbox) {
    var checkedDescendants = [];
    var allDescendants = findChildren(checkbox);
    for (var i = 0; i < allDescendants.length; i++) {
      var element = allDescendants[i];
      if (element.checked) {
        checkedDescendants.push(element);
      }
    }
    return checkedDescendants;
  }
  function recurseToFindChildren(el, descendants) {
    if (el.nodeName == "INPUT") {
      descendants.push(el); // This only returns the actual checkboxes available, not just every element
    }
    ;
    var children = el.children;
    for (var i = 0; i < children.length; i++) {
      if (children[i].nodeType == 1) {
        recurseToFindChildren(children[i], descendants);
      }
    }
  }
  function handleCheckboxClick(e) {
    linkedCheckboxes.forEach(function (checkbox) {
      checkbox.classList.remove('active');
    });
    var el = e.target.parentElement;
    el.classList.add('active');
    var checkbox = firstCheckbox(el);
    var children = findChildren(el);
    for (var i = 0; i < children.length; i++) {
      children[i].addEventListener("click", function () {
        var checkedCount = findCheckedChildren(checkbox).length;
        checkbox.checked = checkedCount > 0;
        checkbox.indeterminate = checkedCount > 0 && checkedCount < children.length;
        // console.log(checkbox, checkedCount > 0, checkedCount < children.length, checkedCount);
      });
    }

    setup();
    /* 
        What does this for loop do?
         Take all the child elements and createa  for loop that loops that many times
        If any of the children are clicked it will:
            1. Set the 
    */
  }

  function firstCheckbox(el) {
    var out;
    el.childNodes.forEach(function (node) {
      if (node.nodeName == "INPUT") {
        out = node;
      }
    });
    return out;
  }
  var actions = [];
  linkedCheckboxes.forEach(function (checkbox) {
    actions.push({
      element: checkbox,
      event: 'click',
      handler: handleCheckboxClick
    });
  });
  return {
    setup: setup,
    actions: actions
  };
}
module.exports = linkedCheckbox;

},{}],6:[function(require,module,exports){
"use strict";

function tabs(widget) {
  var contents = widget.querySelectorAll('[kjs-role=content]');
  var tabs = widget.querySelectorAll('[kjs-role=tab]');
  function setup() {
    var activeTab = widget.querySelector('.active[kjs-role=tab]');
    contents.forEach(function (content) {
      if (activeTab.getAttribute('kjs-id') == content.getAttribute('kjs-tab-id')) {
        content.classList.add('active');
      } else {
        content.classList.remove('active');
      }
    });
  }
  function handleTabClick(e) {
    tabs.forEach(function (tab) {
      tab.classList.remove('active');
    });
    e.target.classList.add('active');
    setup();
  }
  var actions = [];
  tabs.forEach(function (tab) {
    actions.push({
      element: tab,
      event: 'click',
      handler: handleTabClick
    });
  });
  return {
    setup: setup,
    actions: actions
  };
}
module.exports = tabs;

},{}]},{},[2]);
