/*
Unobtrusive JavaScript
https://github.com/rails/rails/blob/master/actionview/app/assets/javascripts
Released under the MIT license
 */


(function() {
  var context = this;

  (function() {
    (function() {
      this.Rails = {
        linkClickSelector: 'a[data-confirm], a[data-method], a[data-remote]:not([disabled]), a[data-disable-with], a[data-disable]',
        buttonClickSelector: {
          selector: 'button[data-remote]:not([form]), button[data-confirm]:not([form])',
          exclude: 'form button'
        },
        inputChangeSelector: 'select[data-remote], input[data-remote], textarea[data-remote]',
        formSubmitSelector: 'form',
        formInputClickSelector: 'form input[type=submit], form input[type=image], form button[type=submit], form button:not([type]), input[type=submit][form], input[type=image][form], button[type=submit][form], button[form]:not([type])',
        formDisableSelector: 'input[data-disable-with]:enabled, button[data-disable-with]:enabled, textarea[data-disable-with]:enabled, input[data-disable]:enabled, button[data-disable]:enabled, textarea[data-disable]:enabled',
        formEnableSelector: 'input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled, input[data-disable]:disabled, button[data-disable]:disabled, textarea[data-disable]:disabled',
        fileInputSelector: 'input[name][type=file]:not([disabled])',
        linkDisableSelector: 'a[data-disable-with], a[data-disable]',
        buttonDisableSelector: 'button[data-remote][data-disable-with], button[data-remote][data-disable]'
      };

    }).call(this);
  }).call(context);

  var Rails = context.Rails;

  (function() {
    (function() {
      var expando, m;

      m = Element.prototype.matches || Element.prototype.matchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector || Element.prototype.webkitMatchesSelector;

      Rails.matches = function(element, selector) {
        if (selector.exclude != null) {
          return m.call(element, selector.selector) && !m.call(element, selector.exclude);
        } else {
          return m.call(element, selector);
        }
      };

      expando = '_ujsData';

      Rails.getData = function(element, key) {
        var ref;
        return (ref = element[expando]) != null ? ref[key] : void 0;
      };

      Rails.setData = function(element, key, value) {
        if (element[expando] == null) {
          element[expando] = {};
        }
        return element[expando][key] = value;
      };

      Rails.$ = function(selector) {
        return Array.prototype.slice.call(document.querySelectorAll(selector));
      };

    }).call(this);
    (function() {
      var $, csrfParam, csrfToken;

      $ = Rails.$;

      csrfToken = Rails.csrfToken = function() {
        var meta;
        meta = document.querySelector('meta[name=csrf-token]');
        return meta && meta.content;
      };

      csrfParam = Rails.csrfParam = function() {
        var meta;
        meta = document.querySelector('meta[name=csrf-param]');
        return meta && meta.content;
      };

      Rails.CSRFProtection = function(xhr) {
        var token;
        token = csrfToken();
        if (token != null) {
          return xhr.setRequestHeader('X-CSRF-Token', token);
        }
      };

      Rails.refreshCSRFTokens = function() {
        var param, token;
        token = csrfToken();
        param = csrfParam();
        if ((token != null) && (param != null)) {
          return $('form input[name="' + param + '"]').forEach(function(input) {
            return input.value = token;
          });
        }
      };

    }).call(this);
    (function() {
      var CustomEvent, fire, matches;

      matches = Rails.matches;

      CustomEvent = window.CustomEvent;

      if (typeof CustomEvent !== 'function') {
        CustomEvent = function(event, params) {
          var evt;
          evt = document.createEvent('CustomEvent');
          evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
          return evt;
        };
        CustomEvent.prototype = window.Event.prototype;
      }

      fire = Rails.fire = function(obj, name, data) {
        var event;
        event = new CustomEvent(name, {
          bubbles: true,
          cancelable: true,
          detail: data
        });
        obj.dispatchEvent(event);
        return !event.defaultPrevented;
      };

      Rails.stopEverything = function(e) {
        fire(e.target, 'ujs:everythingStopped');
        e.preventDefault();
        e.stopPropagation();
        return e.stopImmediatePropagation();
      };

      Rails.delegate = function(element, selector, eventType, handler) {
        return element.addEventListener(eventType, function(e) {
          var target;
          target = e.target;
          while (!(!(target instanceof Element) || matches(target, selector))) {
            target = target.parentNode;
          }
          if (target instanceof Element && handler.call(target, e) === false) {
            e.preventDefault();
            return e.stopPropagation();
          }
        });
      };

    }).call(this);
    (function() {
      var AcceptHeaders, CSRFProtection, createXHR, fire, prepareOptions, processResponse;

      CSRFProtection = Rails.CSRFProtection, fire = Rails.fire;

      AcceptHeaders = {
        '*': '*/*',
        text: 'text/plain',
        html: 'text/html',
        xml: 'application/xml, text/xml',
        json: 'application/json, text/javascript',
        script: 'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript'
      };

      Rails.ajax = function(options) {
        var xhr;
        options = prepareOptions(options);
        xhr = createXHR(options, function() {
          var response;
          response = processResponse(xhr.response, xhr.getResponseHeader('Content-Type'));
          if (Math.floor(xhr.status / 100) === 2) {
            if (typeof options.success === "function") {
              options.success(response, xhr.statusText, xhr);
            }
          } else {
            if (typeof options.error === "function") {
              options.error(response, xhr.statusText, xhr);
            }
          }
          return typeof options.complete === "function" ? options.complete(xhr, xhr.statusText) : void 0;
        });
        if (!(typeof options.beforeSend === "function" ? options.beforeSend(xhr, options) : void 0)) {
          return false;
        }
        if (xhr.readyState === XMLHttpRequest.OPENED) {
          return xhr.send(options.data);
        }
      };

      prepareOptions = function(options) {
        options.url = options.url || location.href;
        options.type = options.type.toUpperCase();
        if (options.type === 'GET' && options.data) {
          if (options.url.indexOf('?') < 0) {
            options.url += '?' + options.data;
          } else {
            options.url += '&' + options.data;
          }
        }
        if (AcceptHeaders[options.dataType] == null) {
          options.dataType = '*';
        }
        options.accept = AcceptHeaders[options.dataType];
        if (options.dataType !== '*') {
          options.accept += ', */*; q=0.01';
        }
        return options;
      };

      createXHR = function(options, done) {
        var xhr;
        xhr = new XMLHttpRequest();
        xhr.open(options.type, options.url, true);
        xhr.setRequestHeader('Accept', options.accept);
        if (typeof options.data === 'string') {
          xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        }
        if (!options.crossDomain) {
          xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        }
        CSRFProtection(xhr);
        xhr.withCredentials = !!options.withCredentials;
        xhr.onreadystatechange = function() {
          if (xhr.readyState === XMLHttpRequest.DONE) {
            return done(xhr);
          }
        };
        return xhr;
      };

      processResponse = function(response, type) {
        var parser, script;
        if (typeof response === 'string' && typeof type === 'string') {
          if (type.match(/\bjson\b/)) {
            try {
              response = JSON.parse(response);
            } catch (error) {}
          } else if (type.match(/\b(?:java|ecma)script\b/)) {
            script = document.createElement('script');
            script.text = response;
            document.head.appendChild(script).parentNode.removeChild(script);
          } else if (type.match(/\b(xml|html|svg)\b/)) {
            parser = new DOMParser();
            type = type.replace(/;.+/, '');
            try {
              response = parser.parseFromString(response, type);
            } catch (error) {}
          }
        }
        return response;
      };

      Rails.href = function(element) {
        return element.href;
      };

      Rails.isCrossDomain = function(url) {
        var e, originAnchor, urlAnchor;
        originAnchor = document.createElement('a');
        originAnchor.href = location.href;
        urlAnchor = document.createElement('a');
        try {
          urlAnchor.href = url;
          return !(((!urlAnchor.protocol || urlAnchor.protocol === ':') && !urlAnchor.host) || (originAnchor.protocol + '//' + originAnchor.host === urlAnchor.protocol + '//' + urlAnchor.host));
        } catch (error) {
          e = error;
          return true;
        }
      };

    }).call(this);
    (function() {
      var matches, toArray;

      matches = Rails.matches;

      toArray = function(e) {
        return Array.prototype.slice.call(e);
      };

      Rails.serializeElement = function(element, additionalParam) {
        var inputs, params;
        inputs = [element];
        if (matches(element, 'form')) {
          inputs = toArray(element.elements);
        }
        params = [];
        inputs.forEach(function(input) {
          if (!input.name || input.disabled) {
            return;
          }
          if (matches(input, 'select')) {
            return toArray(input.options).forEach(function(option) {
              if (option.selected) {
                return params.push({
                  name: input.name,
                  value: option.value
                });
              }
            });
          } else if (input.checked || ['radio', 'checkbox', 'submit'].indexOf(input.type) === -1) {
            return params.push({
              name: input.name,
              value: input.value
            });
          }
        });
        if (additionalParam) {
          params.push(additionalParam);
        }
        return params.map(function(param) {
          if (param.name != null) {
            return (encodeURIComponent(param.name)) + "=" + (encodeURIComponent(param.value));
          } else {
            return param;
          }
        }).join('&');
      };

      Rails.formElements = function(form, selector) {
        if (matches(form, 'form')) {
          return toArray(form.elements).filter(function(el) {
            return matches(el, selector);
          });
        } else {
          return toArray(form.querySelectorAll(selector));
        }
      };

    }).call(this);
    (function() {
      var allowAction, fire, stopEverything;

      fire = Rails.fire, stopEverything = Rails.stopEverything;

      Rails.handleConfirm = function(e) {
        if (!allowAction(this)) {
          return stopEverything(e);
        }
      };

      allowAction = function(element) {
        var answer, callback, message;
        message = element.getAttribute('data-confirm');
        if (!message) {
          return true;
        }
        answer = false;
        if (fire(element, 'confirm')) {
          try {
            answer = confirm(message);
          } catch (error) {}
          callback = fire(element, 'confirm:complete', [answer]);
        }
        return answer && callback;
      };

    }).call(this);
    (function() {
      var disableFormElement, disableFormElements, disableLinkElement, enableFormElement, enableFormElements, enableLinkElement, formElements, getData, matches, setData, stopEverything;

      matches = Rails.matches, getData = Rails.getData, setData = Rails.setData, stopEverything = Rails.stopEverything, formElements = Rails.formElements;

      Rails.handleDisabledElement = function(e) {
        var element;
        element = this;
        if (element.disabled) {
          return stopEverything(e);
        }
      };

      Rails.enableElement = function(e) {
        var element;
        element = e instanceof Event ? e.target : e;
        if (matches(element, Rails.linkDisableSelector)) {
          return enableLinkElement(element);
        } else if (matches(element, Rails.buttonDisableSelector) || matches(element, Rails.formEnableSelector)) {
          return enableFormElement(element);
        } else if (matches(element, Rails.formSubmitSelector)) {
          return enableFormElements(element);
        }
      };

      Rails.disableElement = function(e) {
        var element;
        element = e instanceof Event ? e.target : e;
        if (matches(element, Rails.linkDisableSelector)) {
          return disableLinkElement(element);
        } else if (matches(element, Rails.buttonDisableSelector) || matches(element, Rails.formDisableSelector)) {
          return disableFormElement(element);
        } else if (matches(element, Rails.formSubmitSelector)) {
          return disableFormElements(element);
        }
      };

      disableLinkElement = function(element) {
        var replacement;
        replacement = element.getAttribute('data-disable-with');
        if (replacement != null) {
          setData(element, 'ujs:enable-with', element.innerHTML);
          element.innerHTML = replacement;
        }
        element.addEventListener('click', stopEverything);
        return setData(element, 'ujs:disabled', true);
      };

      enableLinkElement = function(element) {
        var originalText;
        originalText = getData(element, 'ujs:enable-with');
        if (originalText != null) {
          element.innerHTML = originalText;
          setData(element, 'ujs:enable-with', null);
        }
        element.removeEventListener('click', stopEverything);
        return setData(element, 'ujs:disabled', null);
      };

      disableFormElements = function(form) {
        return formElements(form, Rails.formDisableSelector).forEach(disableFormElement);
      };

      disableFormElement = function(element) {
        var replacement;
        replacement = element.getAttribute('data-disable-with');
        if (replacement != null) {
          if (matches(element, 'button')) {
            setData(element, 'ujs:enable-with', element.innerHTML);
            element.innerHTML = replacement;
          } else {
            setData(element, 'ujs:enable-with', element.value);
            element.value = replacement;
          }
        }
        element.disabled = true;
        return setData(element, 'ujs:disabled', true);
      };

      enableFormElements = function(form) {
        return formElements(form, Rails.formEnableSelector).forEach(enableFormElement);
      };

      enableFormElement = function(element) {
        var originalText;
        originalText = getData(element, 'ujs:enable-with');
        if (originalText != null) {
          if (matches(element, 'button')) {
            element.innerHTML = originalText;
          } else {
            element.value = originalText;
          }
          setData(element, 'ujs:enable-with', null);
        }
        element.disabled = false;
        return setData(element, 'ujs:disabled', null);
      };

    }).call(this);
    (function() {
      var stopEverything;

      stopEverything = Rails.stopEverything;

      Rails.handleMethod = function(e) {
        var csrfParam, csrfToken, form, formContent, href, link, method;
        link = this;
        method = link.getAttribute('data-method');
        if (!method) {
          return;
        }
        href = Rails.href(link);
        csrfToken = Rails.csrfToken();
        csrfParam = Rails.csrfParam();
        form = document.createElement('form');
        formContent = "<input name='_method' value='" + method + "' type='hidden' />";
        if ((csrfParam != null) && (csrfToken != null) && !Rails.isCrossDomain(href)) {
          formContent += "<input name='" + csrfParam + "' value='" + csrfToken + "' type='hidden' />";
        }
        formContent += '<input type="submit" />';
        form.method = 'post';
        form.action = href;
        form.target = link.target;
        form.innerHTML = formContent;
        form.style.display = 'none';
        document.body.appendChild(form);
        form.querySelector('[type="submit"]').click();
        return stopEverything(e);
      };

    }).call(this);
    (function() {
      var ajax, fire, getData, isCrossDomain, isRemote, matches, serializeElement, setData, stopEverything,
        slice = [].slice;

      matches = Rails.matches, getData = Rails.getData, setData = Rails.setData, fire = Rails.fire, stopEverything = Rails.stopEverything, ajax = Rails.ajax, isCrossDomain = Rails.isCrossDomain, serializeElement = Rails.serializeElement;

      isRemote = function(element) {
        var value;
        value = element.getAttribute('data-remote');
        return (value != null) && value !== 'false';
      };

      Rails.handleRemote = function(e) {
        var button, data, dataType, element, method, url, withCredentials;
        element = this;
        if (!isRemote(element)) {
          return true;
        }
        if (!fire(element, 'ajax:before')) {
          fire(element, 'ajax:stopped');
          return false;
        }
        withCredentials = element.getAttribute('data-with-credentials');
        dataType = element.getAttribute('data-type') || 'script';
        if (matches(element, Rails.formSubmitSelector)) {
          button = getData(element, 'ujs:submit-button');
          method = getData(element, 'ujs:submit-button-formmethod') || element.method;
          url = getData(element, 'ujs:submit-button-formaction') || element.getAttribute('action') || location.href;
          if (method.toUpperCase() === 'GET') {
            url = url.replace(/\?.*$/, '');
          }
          if (element.enctype === 'multipart/form-data') {
            data = new FormData(element);
            if (button != null) {
              data.append(button.name, button.value);
            }
          } else {
            data = serializeElement(element, button);
          }
          setData(element, 'ujs:submit-button', null);
          setData(element, 'ujs:submit-button-formmethod', null);
          setData(element, 'ujs:submit-button-formaction', null);
        } else if (matches(element, Rails.buttonClickSelector) || matches(element, Rails.inputChangeSelector)) {
          method = element.getAttribute('data-method');
          url = element.getAttribute('data-url');
          data = serializeElement(element, element.getAttribute('data-params'));
        } else {
          method = element.getAttribute('data-method');
          url = Rails.href(element);
          data = element.getAttribute('data-params');
        }
        ajax({
          type: method || 'GET',
          url: url,
          data: data,
          dataType: dataType,
          beforeSend: function(xhr, options) {
            if (fire(element, 'ajax:beforeSend', [xhr, options])) {
              return fire(element, 'ajax:send', [xhr]);
            } else {
              fire(element, 'ajax:stopped');
              return false;
            }
          },
          success: function() {
            var args;
            args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
            return fire(element, 'ajax:success', args);
          },
          error: function() {
            var args;
            args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
            return fire(element, 'ajax:error', args);
          },
          complete: function() {
            var args;
            args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
            return fire(element, 'ajax:complete', args);
          },
          crossDomain: isCrossDomain(url),
          withCredentials: (withCredentials != null) && withCredentials !== 'false'
        });
        return stopEverything(e);
      };

      Rails.formSubmitButtonClick = function(e) {
        var button, form;
        button = this;
        form = button.form;
        if (!form) {
          return;
        }
        if (button.name) {
          setData(form, 'ujs:submit-button', {
            name: button.name,
            value: button.value
          });
        }
        setData(form, 'ujs:formnovalidate-button', button.formNoValidate);
        setData(form, 'ujs:submit-button-formaction', button.getAttribute('formaction'));
        return setData(form, 'ujs:submit-button-formmethod', button.getAttribute('formmethod'));
      };

      Rails.handleMetaClick = function(e) {
        var data, link, metaClick, method;
        link = this;
        method = (link.getAttribute('data-method') || 'GET').toUpperCase();
        data = link.getAttribute('data-params');
        metaClick = e.metaKey || e.ctrlKey;
        if (metaClick && method === 'GET' && !data) {
          return e.stopImmediatePropagation();
        }
      };

    }).call(this);
    (function() {
      var $, CSRFProtection, delegate, disableElement, enableElement, fire, formSubmitButtonClick, getData, handleConfirm, handleDisabledElement, handleMetaClick, handleMethod, handleRemote, refreshCSRFTokens;

      fire = Rails.fire, delegate = Rails.delegate, getData = Rails.getData, $ = Rails.$, refreshCSRFTokens = Rails.refreshCSRFTokens, CSRFProtection = Rails.CSRFProtection, enableElement = Rails.enableElement, disableElement = Rails.disableElement, handleDisabledElement = Rails.handleDisabledElement, handleConfirm = Rails.handleConfirm, handleRemote = Rails.handleRemote, formSubmitButtonClick = Rails.formSubmitButtonClick, handleMetaClick = Rails.handleMetaClick, handleMethod = Rails.handleMethod;

      if ((typeof jQuery !== "undefined" && jQuery !== null) && (jQuery.ajax != null) && !jQuery.rails) {
        jQuery.rails = Rails;
        jQuery.ajaxPrefilter(function(options, originalOptions, xhr) {
          if (!options.crossDomain) {
            return CSRFProtection(xhr);
          }
        });
      }

      Rails.start = function() {
        if (window._rails_loaded) {
          throw new Error('rails-ujs has already been loaded!');
        }
        window.addEventListener('pageshow', function() {
          $(Rails.formEnableSelector).forEach(function(el) {
            if (getData(el, 'ujs:disabled')) {
              return enableElement(el);
            }
          });
          return $(Rails.linkDisableSelector).forEach(function(el) {
            if (getData(el, 'ujs:disabled')) {
              return enableElement(el);
            }
          });
        });
        delegate(document, Rails.linkDisableSelector, 'ajax:complete', enableElement);
        delegate(document, Rails.linkDisableSelector, 'ajax:stopped', enableElement);
        delegate(document, Rails.buttonDisableSelector, 'ajax:complete', enableElement);
        delegate(document, Rails.buttonDisableSelector, 'ajax:stopped', enableElement);
        delegate(document, Rails.linkClickSelector, 'click', handleDisabledElement);
        delegate(document, Rails.linkClickSelector, 'click', handleConfirm);
        delegate(document, Rails.linkClickSelector, 'click', handleMetaClick);
        delegate(document, Rails.linkClickSelector, 'click', disableElement);
        delegate(document, Rails.linkClickSelector, 'click', handleRemote);
        delegate(document, Rails.linkClickSelector, 'click', handleMethod);
        delegate(document, Rails.buttonClickSelector, 'click', handleDisabledElement);
        delegate(document, Rails.buttonClickSelector, 'click', handleConfirm);
        delegate(document, Rails.buttonClickSelector, 'click', disableElement);
        delegate(document, Rails.buttonClickSelector, 'click', handleRemote);
        delegate(document, Rails.inputChangeSelector, 'change', handleDisabledElement);
        delegate(document, Rails.inputChangeSelector, 'change', handleConfirm);
        delegate(document, Rails.inputChangeSelector, 'change', handleRemote);
        delegate(document, Rails.formSubmitSelector, 'submit', handleDisabledElement);
        delegate(document, Rails.formSubmitSelector, 'submit', handleConfirm);
        delegate(document, Rails.formSubmitSelector, 'submit', handleRemote);
        delegate(document, Rails.formSubmitSelector, 'submit', function(e) {
          return setTimeout((function() {
            return disableElement(e);
          }), 13);
        });
        delegate(document, Rails.formSubmitSelector, 'ajax:send', disableElement);
        delegate(document, Rails.formSubmitSelector, 'ajax:complete', enableElement);
        delegate(document, Rails.formInputClickSelector, 'click', handleDisabledElement);
        delegate(document, Rails.formInputClickSelector, 'click', handleConfirm);
        delegate(document, Rails.formInputClickSelector, 'click', formSubmitButtonClick);
        document.addEventListener('DOMContentLoaded', refreshCSRFTokens);
        return window._rails_loaded = true;
      };

      if (window.Rails === Rails && fire(document, 'rails:attachBindings')) {
        Rails.start();
      }

    }).call(this);
  }).call(this);

  if (typeof module === "object" && module.exports) {
    module.exports = Rails;
  } else if (typeof define === "function" && define.amd) {
    define(Rails);
  }
}).call(this);
/*
Turbolinks 5.1.0
Copyright © 2018 Basecamp, LLC
 */

(function(){this.Turbolinks={supported:function(){return null!=window.history.pushState&&null!=window.requestAnimationFrame&&null!=window.addEventListener}(),visit:function(t,e){return Turbolinks.controller.visit(t,e)},clearCache:function(){return Turbolinks.controller.clearCache()},setProgressBarDelay:function(t){return Turbolinks.controller.setProgressBarDelay(t)}}}).call(this),function(){var t,e,r,n=[].slice;Turbolinks.copyObject=function(t){var e,r,n;r={};for(e in t)n=t[e],r[e]=n;return r},Turbolinks.closest=function(e,r){return t.call(e,r)},t=function(){var t,r;return t=document.documentElement,null!=(r=t.closest)?r:function(t){var r;for(r=this;r;){if(r.nodeType===Node.ELEMENT_NODE&&e.call(r,t))return r;r=r.parentNode}}}(),Turbolinks.defer=function(t){return setTimeout(t,1)},Turbolinks.throttle=function(t){var e;return e=null,function(){var r;return r=1<=arguments.length?n.call(arguments,0):[],null!=e?e:e=requestAnimationFrame(function(n){return function(){return e=null,t.apply(n,r)}}(this))}},Turbolinks.dispatch=function(t,e){var n,o,i,s,a,u;return a=null!=e?e:{},u=a.target,n=a.cancelable,o=a.data,i=document.createEvent("Events"),i.initEvent(t,!0,n===!0),i.data=null!=o?o:{},i.cancelable&&!r&&(s=i.preventDefault,i.preventDefault=function(){return this.defaultPrevented||Object.defineProperty(this,"defaultPrevented",{get:function(){return!0}}),s.call(this)}),(null!=u?u:document).dispatchEvent(i),i},r=function(){var t;return t=document.createEvent("Events"),t.initEvent("test",!0,!0),t.preventDefault(),t.defaultPrevented}(),Turbolinks.match=function(t,r){return e.call(t,r)},e=function(){var t,e,r,n;return t=document.documentElement,null!=(e=null!=(r=null!=(n=t.matchesSelector)?n:t.webkitMatchesSelector)?r:t.msMatchesSelector)?e:t.mozMatchesSelector}(),Turbolinks.uuid=function(){var t,e,r;for(r="",t=e=1;36>=e;t=++e)r+=9===t||14===t||19===t||24===t?"-":15===t?"4":20===t?(Math.floor(4*Math.random())+8).toString(16):Math.floor(15*Math.random()).toString(16);return r}}.call(this),function(){Turbolinks.Location=function(){function t(t){var e,r;null==t&&(t=""),r=document.createElement("a"),r.href=t.toString(),this.absoluteURL=r.href,e=r.hash.length,2>e?this.requestURL=this.absoluteURL:(this.requestURL=this.absoluteURL.slice(0,-e),this.anchor=r.hash.slice(1))}var e,r,n,o;return t.wrap=function(t){return t instanceof this?t:new this(t)},t.prototype.getOrigin=function(){return this.absoluteURL.split("/",3).join("/")},t.prototype.getPath=function(){var t,e;return null!=(t=null!=(e=this.requestURL.match(/\/\/[^\/]*(\/[^?;]*)/))?e[1]:void 0)?t:"/"},t.prototype.getPathComponents=function(){return this.getPath().split("/").slice(1)},t.prototype.getLastPathComponent=function(){return this.getPathComponents().slice(-1)[0]},t.prototype.getExtension=function(){var t,e;return null!=(t=null!=(e=this.getLastPathComponent().match(/\.[^.]*$/))?e[0]:void 0)?t:""},t.prototype.isHTML=function(){return this.getExtension().match(/^(?:|\.(?:htm|html|xhtml))$/)},t.prototype.isPrefixedBy=function(t){var e;return e=r(t),this.isEqualTo(t)||o(this.absoluteURL,e)},t.prototype.isEqualTo=function(t){return this.absoluteURL===(null!=t?t.absoluteURL:void 0)},t.prototype.toCacheKey=function(){return this.requestURL},t.prototype.toJSON=function(){return this.absoluteURL},t.prototype.toString=function(){return this.absoluteURL},t.prototype.valueOf=function(){return this.absoluteURL},r=function(t){return e(t.getOrigin()+t.getPath())},e=function(t){return n(t,"/")?t:t+"/"},o=function(t,e){return t.slice(0,e.length)===e},n=function(t,e){return t.slice(-e.length)===e},t}()}.call(this),function(){var t=function(t,e){return function(){return t.apply(e,arguments)}};Turbolinks.HttpRequest=function(){function e(e,r,n){this.delegate=e,this.requestCanceled=t(this.requestCanceled,this),this.requestTimedOut=t(this.requestTimedOut,this),this.requestFailed=t(this.requestFailed,this),this.requestLoaded=t(this.requestLoaded,this),this.requestProgressed=t(this.requestProgressed,this),this.url=Turbolinks.Location.wrap(r).requestURL,this.referrer=Turbolinks.Location.wrap(n).absoluteURL,this.createXHR()}return e.NETWORK_FAILURE=0,e.TIMEOUT_FAILURE=-1,e.timeout=60,e.prototype.send=function(){var t;return this.xhr&&!this.sent?(this.notifyApplicationBeforeRequestStart(),this.setProgress(0),this.xhr.send(),this.sent=!0,"function"==typeof(t=this.delegate).requestStarted?t.requestStarted():void 0):void 0},e.prototype.cancel=function(){return this.xhr&&this.sent?this.xhr.abort():void 0},e.prototype.requestProgressed=function(t){return t.lengthComputable?this.setProgress(t.loaded/t.total):void 0},e.prototype.requestLoaded=function(){return this.endRequest(function(t){return function(){var e;return 200<=(e=t.xhr.status)&&300>e?t.delegate.requestCompletedWithResponse(t.xhr.responseText,t.xhr.getResponseHeader("Turbolinks-Location")):(t.failed=!0,t.delegate.requestFailedWithStatusCode(t.xhr.status,t.xhr.responseText))}}(this))},e.prototype.requestFailed=function(){return this.endRequest(function(t){return function(){return t.failed=!0,t.delegate.requestFailedWithStatusCode(t.constructor.NETWORK_FAILURE)}}(this))},e.prototype.requestTimedOut=function(){return this.endRequest(function(t){return function(){return t.failed=!0,t.delegate.requestFailedWithStatusCode(t.constructor.TIMEOUT_FAILURE)}}(this))},e.prototype.requestCanceled=function(){return this.endRequest()},e.prototype.notifyApplicationBeforeRequestStart=function(){return Turbolinks.dispatch("turbolinks:request-start",{data:{url:this.url,xhr:this.xhr}})},e.prototype.notifyApplicationAfterRequestEnd=function(){return Turbolinks.dispatch("turbolinks:request-end",{data:{url:this.url,xhr:this.xhr}})},e.prototype.createXHR=function(){return this.xhr=new XMLHttpRequest,this.xhr.open("GET",this.url,!0),this.xhr.timeout=1e3*this.constructor.timeout,this.xhr.setRequestHeader("Accept","text/html, application/xhtml+xml"),this.xhr.setRequestHeader("Turbolinks-Referrer",this.referrer),this.xhr.onprogress=this.requestProgressed,this.xhr.onload=this.requestLoaded,this.xhr.onerror=this.requestFailed,this.xhr.ontimeout=this.requestTimedOut,this.xhr.onabort=this.requestCanceled},e.prototype.endRequest=function(t){return this.xhr?(this.notifyApplicationAfterRequestEnd(),null!=t&&t.call(this),this.destroy()):void 0},e.prototype.setProgress=function(t){var e;return this.progress=t,"function"==typeof(e=this.delegate).requestProgressed?e.requestProgressed(this.progress):void 0},e.prototype.destroy=function(){var t;return this.setProgress(1),"function"==typeof(t=this.delegate).requestFinished&&t.requestFinished(),this.delegate=null,this.xhr=null},e}()}.call(this),function(){var t=function(t,e){return function(){return t.apply(e,arguments)}};Turbolinks.ProgressBar=function(){function e(){this.trickle=t(this.trickle,this),this.stylesheetElement=this.createStylesheetElement(),this.progressElement=this.createProgressElement()}var r;return r=300,e.defaultCSS=".turbolinks-progress-bar {\n  position: fixed;\n  display: block;\n  top: 0;\n  left: 0;\n  height: 3px;\n  background: #0076ff;\n  z-index: 9999;\n  transition: width "+r+"ms ease-out, opacity "+r/2+"ms "+r/2+"ms ease-in;\n  transform: translate3d(0, 0, 0);\n}",e.prototype.show=function(){return this.visible?void 0:(this.visible=!0,this.installStylesheetElement(),this.installProgressElement(),this.startTrickling())},e.prototype.hide=function(){return this.visible&&!this.hiding?(this.hiding=!0,this.fadeProgressElement(function(t){return function(){return t.uninstallProgressElement(),t.stopTrickling(),t.visible=!1,t.hiding=!1}}(this))):void 0},e.prototype.setValue=function(t){return this.value=t,this.refresh()},e.prototype.installStylesheetElement=function(){return document.head.insertBefore(this.stylesheetElement,document.head.firstChild)},e.prototype.installProgressElement=function(){return this.progressElement.style.width=0,this.progressElement.style.opacity=1,document.documentElement.insertBefore(this.progressElement,document.body),this.refresh()},e.prototype.fadeProgressElement=function(t){return this.progressElement.style.opacity=0,setTimeout(t,1.5*r)},e.prototype.uninstallProgressElement=function(){return this.progressElement.parentNode?document.documentElement.removeChild(this.progressElement):void 0},e.prototype.startTrickling=function(){return null!=this.trickleInterval?this.trickleInterval:this.trickleInterval=setInterval(this.trickle,r)},e.prototype.stopTrickling=function(){return clearInterval(this.trickleInterval),this.trickleInterval=null},e.prototype.trickle=function(){return this.setValue(this.value+Math.random()/100)},e.prototype.refresh=function(){return requestAnimationFrame(function(t){return function(){return t.progressElement.style.width=10+90*t.value+"%"}}(this))},e.prototype.createStylesheetElement=function(){var t;return t=document.createElement("style"),t.type="text/css",t.textContent=this.constructor.defaultCSS,t},e.prototype.createProgressElement=function(){var t;return t=document.createElement("div"),t.className="turbolinks-progress-bar",t},e}()}.call(this),function(){var t=function(t,e){return function(){return t.apply(e,arguments)}};Turbolinks.BrowserAdapter=function(){function e(e){this.controller=e,this.showProgressBar=t(this.showProgressBar,this),this.progressBar=new Turbolinks.ProgressBar}var r,n,o;return o=Turbolinks.HttpRequest,r=o.NETWORK_FAILURE,n=o.TIMEOUT_FAILURE,e.prototype.visitProposedToLocationWithAction=function(t,e){return this.controller.startVisitToLocationWithAction(t,e)},e.prototype.visitStarted=function(t){return t.issueRequest(),t.changeHistory(),t.loadCachedSnapshot()},e.prototype.visitRequestStarted=function(t){return this.progressBar.setValue(0),t.hasCachedSnapshot()||"restore"!==t.action?this.showProgressBarAfterDelay():this.showProgressBar()},e.prototype.visitRequestProgressed=function(t){return this.progressBar.setValue(t.progress)},e.prototype.visitRequestCompleted=function(t){return t.loadResponse()},e.prototype.visitRequestFailedWithStatusCode=function(t,e){switch(e){case r:case n:return this.reload();default:return t.loadResponse()}},e.prototype.visitRequestFinished=function(t){return this.hideProgressBar()},e.prototype.visitCompleted=function(t){return t.followRedirect()},e.prototype.pageInvalidated=function(){return this.reload()},e.prototype.showProgressBarAfterDelay=function(){return this.progressBarTimeout=setTimeout(this.showProgressBar,this.controller.progressBarDelay)},e.prototype.showProgressBar=function(){return this.progressBar.show()},e.prototype.hideProgressBar=function(){return this.progressBar.hide(),clearTimeout(this.progressBarTimeout)},e.prototype.reload=function(){return window.location.reload()},e}()}.call(this),function(){var t=function(t,e){return function(){return t.apply(e,arguments)}};Turbolinks.History=function(){function e(e){this.delegate=e,this.onPageLoad=t(this.onPageLoad,this),this.onPopState=t(this.onPopState,this)}return e.prototype.start=function(){return this.started?void 0:(addEventListener("popstate",this.onPopState,!1),addEventListener("load",this.onPageLoad,!1),this.started=!0)},e.prototype.stop=function(){return this.started?(removeEventListener("popstate",this.onPopState,!1),removeEventListener("load",this.onPageLoad,!1),this.started=!1):void 0},e.prototype.push=function(t,e){return t=Turbolinks.Location.wrap(t),this.update("push",t,e)},e.prototype.replace=function(t,e){return t=Turbolinks.Location.wrap(t),this.update("replace",t,e)},e.prototype.onPopState=function(t){var e,r,n,o;return this.shouldHandlePopState()&&(o=null!=(r=t.state)?r.turbolinks:void 0)?(e=Turbolinks.Location.wrap(window.location),n=o.restorationIdentifier,this.delegate.historyPoppedToLocationWithRestorationIdentifier(e,n)):void 0},e.prototype.onPageLoad=function(t){return Turbolinks.defer(function(t){return function(){return t.pageLoaded=!0}}(this))},e.prototype.shouldHandlePopState=function(){return this.pageIsLoaded()},e.prototype.pageIsLoaded=function(){return this.pageLoaded||"complete"===document.readyState},e.prototype.update=function(t,e,r){var n;return n={turbolinks:{restorationIdentifier:r}},history[t+"State"](n,null,e)},e}()}.call(this),function(){Turbolinks.Snapshot=function(){function t(t){var e,r;r=t.head,e=t.body,this.head=null!=r?r:document.createElement("head"),this.body=null!=e?e:document.createElement("body")}return t.wrap=function(t){return t instanceof this?t:this.fromHTML(t)},t.fromHTML=function(t){var e;return e=document.createElement("html"),e.innerHTML=t,this.fromElement(e)},t.fromElement=function(t){return new this({head:t.querySelector("head"),body:t.querySelector("body")})},t.prototype.clone=function(){return new t({head:this.head.cloneNode(!0),body:this.body.cloneNode(!0)})},t.prototype.getRootLocation=function(){var t,e;return e=null!=(t=this.getSetting("root"))?t:"/",new Turbolinks.Location(e)},t.prototype.getCacheControlValue=function(){return this.getSetting("cache-control")},t.prototype.getElementForAnchor=function(t){try{return this.body.querySelector("[id='"+t+"'], a[name='"+t+"']")}catch(e){}},t.prototype.hasAnchor=function(t){return null!=this.getElementForAnchor(t)},t.prototype.isPreviewable=function(){return"no-preview"!==this.getCacheControlValue()},t.prototype.isCacheable=function(){return"no-cache"!==this.getCacheControlValue()},t.prototype.isVisitable=function(){return"reload"!==this.getSetting("visit-control")},t.prototype.getSetting=function(t){var e,r;return r=this.head.querySelectorAll("meta[name='turbolinks-"+t+"']"),e=r[r.length-1],null!=e?e.getAttribute("content"):void 0},t}()}.call(this),function(){var t=[].slice;Turbolinks.Renderer=function(){function e(){}var r;return e.render=function(){var e,r,n,o;return n=arguments[0],r=arguments[1],e=3<=arguments.length?t.call(arguments,2):[],o=function(t,e,r){r.prototype=t.prototype;var n=new r,o=t.apply(n,e);return Object(o)===o?o:n}(this,e,function(){}),o.delegate=n,o.render(r),o},e.prototype.renderView=function(t){return this.delegate.viewWillRender(this.newBody),t(),this.delegate.viewRendered(this.newBody)},e.prototype.invalidateView=function(){return this.delegate.viewInvalidated()},e.prototype.createScriptElement=function(t){var e;return"false"===t.getAttribute("data-turbolinks-eval")?t:(e=document.createElement("script"),e.textContent=t.textContent,e.async=!1,r(e,t),e)},r=function(t,e){var r,n,o,i,s,a,u;for(i=e.attributes,a=[],r=0,n=i.length;n>r;r++)s=i[r],o=s.name,u=s.value,a.push(t.setAttribute(o,u));return a},e}()}.call(this),function(){Turbolinks.HeadDetails=function(){function t(t){var e,r,i,s,a,u,l;for(this.element=t,this.elements={},l=this.element.childNodes,s=0,u=l.length;u>s;s++)i=l[s],i.nodeType===Node.ELEMENT_NODE&&(a=i.outerHTML,r=null!=(e=this.elements)[a]?e[a]:e[a]={type:o(i),tracked:n(i),elements:[]},r.elements.push(i))}var e,r,n,o;return t.prototype.hasElementWithKey=function(t){return t in this.elements},t.prototype.getTrackedElementSignature=function(){var t,e;return function(){var r,n;r=this.elements,n=[];for(t in r)e=r[t].tracked,e&&n.push(t);return n}.call(this).join("")},t.prototype.getScriptElementsNotInDetails=function(t){return this.getElementsMatchingTypeNotInDetails("script",t)},t.prototype.getStylesheetElementsNotInDetails=function(t){return this.getElementsMatchingTypeNotInDetails("stylesheet",t)},t.prototype.getElementsMatchingTypeNotInDetails=function(t,e){var r,n,o,i,s,a;o=this.elements,s=[];for(n in o)i=o[n],a=i.type,r=i.elements,a!==t||e.hasElementWithKey(n)||s.push(r[0]);return s},t.prototype.getProvisionalElements=function(){var t,e,r,n,o,i,s;r=[],n=this.elements;for(e in n)o=n[e],s=o.type,i=o.tracked,t=o.elements,null!=s||i?t.length>1&&r.push.apply(r,t.slice(1)):r.push.apply(r,t);return r},o=function(t){return e(t)?"script":r(t)?"stylesheet":void 0},n=function(t){return"reload"===t.getAttribute("data-turbolinks-track")},e=function(t){var e;return e=t.tagName.toLowerCase(),"script"===e},r=function(t){var e;return e=t.tagName.toLowerCase(),"style"===e||"link"===e&&"stylesheet"===t.getAttribute("rel")},t}()}.call(this),function(){var t=function(t,r){function n(){this.constructor=t}for(var o in r)e.call(r,o)&&(t[o]=r[o]);return n.prototype=r.prototype,t.prototype=new n,t.__super__=r.prototype,t},e={}.hasOwnProperty;Turbolinks.SnapshotRenderer=function(e){function r(t,e,r){this.currentSnapshot=t,this.newSnapshot=e,this.isPreview=r,this.currentHeadDetails=new Turbolinks.HeadDetails(this.currentSnapshot.head),this.newHeadDetails=new Turbolinks.HeadDetails(this.newSnapshot.head),this.newBody=this.newSnapshot.body}return t(r,e),r.prototype.render=function(t){return this.shouldRender()?(this.mergeHead(),this.renderView(function(e){return function(){return e.replaceBody(),e.isPreview||e.focusFirstAutofocusableElement(),t()}}(this))):this.invalidateView()},r.prototype.mergeHead=function(){return this.copyNewHeadStylesheetElements(),this.copyNewHeadScriptElements(),this.removeCurrentHeadProvisionalElements(),this.copyNewHeadProvisionalElements()},r.prototype.replaceBody=function(){return this.activateBodyScriptElements(),this.importBodyPermanentElements(),this.assignNewBody()},r.prototype.shouldRender=function(){return this.newSnapshot.isVisitable()&&this.trackedElementsAreIdentical()},r.prototype.trackedElementsAreIdentical=function(){return this.currentHeadDetails.getTrackedElementSignature()===this.newHeadDetails.getTrackedElementSignature()},r.prototype.copyNewHeadStylesheetElements=function(){var t,e,r,n,o;for(n=this.getNewHeadStylesheetElements(),o=[],e=0,r=n.length;r>e;e++)t=n[e],o.push(document.head.appendChild(t));return o},r.prototype.copyNewHeadScriptElements=function(){var t,e,r,n,o;for(n=this.getNewHeadScriptElements(),o=[],e=0,r=n.length;r>e;e++)t=n[e],o.push(document.head.appendChild(this.createScriptElement(t)));return o},r.prototype.removeCurrentHeadProvisionalElements=function(){var t,e,r,n,o;for(n=this.getCurrentHeadProvisionalElements(),o=[],e=0,r=n.length;r>e;e++)t=n[e],o.push(document.head.removeChild(t));return o},r.prototype.copyNewHeadProvisionalElements=function(){var t,e,r,n,o;for(n=this.getNewHeadProvisionalElements(),o=[],e=0,r=n.length;r>e;e++)t=n[e],o.push(document.head.appendChild(t));return o},r.prototype.importBodyPermanentElements=function(){var t,e,r,n,o,i;for(n=this.getNewBodyPermanentElements(),i=[],e=0,r=n.length;r>e;e++)o=n[e],(t=this.findCurrentBodyPermanentElement(o))?i.push(o.parentNode.replaceChild(t,o)):i.push(void 0);return i},r.prototype.activateBodyScriptElements=function(){var t,e,r,n,o,i;for(n=this.getNewBodyScriptElements(),i=[],e=0,r=n.length;r>e;e++)o=n[e],t=this.createScriptElement(o),i.push(o.parentNode.replaceChild(t,o));return i},r.prototype.assignNewBody=function(){return document.body=this.newBody},r.prototype.focusFirstAutofocusableElement=function(){var t;return null!=(t=this.findFirstAutofocusableElement())?t.focus():void 0},r.prototype.getNewHeadStylesheetElements=function(){return this.newHeadDetails.getStylesheetElementsNotInDetails(this.currentHeadDetails)},r.prototype.getNewHeadScriptElements=function(){return this.newHeadDetails.getScriptElementsNotInDetails(this.currentHeadDetails)},r.prototype.getCurrentHeadProvisionalElements=function(){return this.currentHeadDetails.getProvisionalElements()},r.prototype.getNewHeadProvisionalElements=function(){return this.newHeadDetails.getProvisionalElements()},r.prototype.getNewBodyPermanentElements=function(){return this.newBody.querySelectorAll("[id][data-turbolinks-permanent]")},r.prototype.findCurrentBodyPermanentElement=function(t){return document.body.querySelector("#"+t.id+"[data-turbolinks-permanent]")},r.prototype.getNewBodyScriptElements=function(){return this.newBody.querySelectorAll("script")},r.prototype.findFirstAutofocusableElement=function(){return document.body.querySelector("[autofocus]")},r}(Turbolinks.Renderer)}.call(this),function(){var t=function(t,r){function n(){this.constructor=t}for(var o in r)e.call(r,o)&&(t[o]=r[o]);return n.prototype=r.prototype,t.prototype=new n,t.__super__=r.prototype,t},e={}.hasOwnProperty;Turbolinks.ErrorRenderer=function(e){function r(t){this.html=t}return t(r,e),r.prototype.render=function(t){return this.renderView(function(e){return function(){return e.replaceDocumentHTML(),e.activateBodyScriptElements(),t()}}(this))},r.prototype.replaceDocumentHTML=function(){return document.documentElement.innerHTML=this.html},r.prototype.activateBodyScriptElements=function(){var t,e,r,n,o,i;for(n=this.getScriptElements(),i=[],e=0,r=n.length;r>e;e++)o=n[e],t=this.createScriptElement(o),i.push(o.parentNode.replaceChild(t,o));return i},r.prototype.getScriptElements=function(){return document.documentElement.querySelectorAll("script")},r}(Turbolinks.Renderer)}.call(this),function(){Turbolinks.View=function(){function t(t){this.delegate=t,this.element=document.documentElement}return t.prototype.getRootLocation=function(){return this.getSnapshot().getRootLocation()},t.prototype.getElementForAnchor=function(t){return this.getSnapshot().getElementForAnchor(t)},t.prototype.getSnapshot=function(){return Turbolinks.Snapshot.fromElement(this.element)},t.prototype.render=function(t,e){var r,n,o;return o=t.snapshot,r=t.error,n=t.isPreview,this.markAsPreview(n),null!=o?this.renderSnapshot(o,n,e):this.renderError(r,e)},t.prototype.markAsPreview=function(t){return t?this.element.setAttribute("data-turbolinks-preview",""):this.element.removeAttribute("data-turbolinks-preview")},t.prototype.renderSnapshot=function(t,e,r){return Turbolinks.SnapshotRenderer.render(this.delegate,r,this.getSnapshot(),Turbolinks.Snapshot.wrap(t),e)},t.prototype.renderError=function(t,e){return Turbolinks.ErrorRenderer.render(this.delegate,e,t)},t}()}.call(this),function(){var t=function(t,e){return function(){return t.apply(e,arguments)}};Turbolinks.ScrollManager=function(){function e(e){this.delegate=e,this.onScroll=t(this.onScroll,this),this.onScroll=Turbolinks.throttle(this.onScroll)}return e.prototype.start=function(){return this.started?void 0:(addEventListener("scroll",this.onScroll,!1),this.onScroll(),this.started=!0)},e.prototype.stop=function(){return this.started?(removeEventListener("scroll",this.onScroll,!1),this.started=!1):void 0},e.prototype.scrollToElement=function(t){return t.scrollIntoView()},e.prototype.scrollToPosition=function(t){var e,r;return e=t.x,r=t.y,window.scrollTo(e,r)},e.prototype.onScroll=function(t){return this.updatePosition({x:window.pageXOffset,y:window.pageYOffset})},e.prototype.updatePosition=function(t){var e;return this.position=t,null!=(e=this.delegate)?e.scrollPositionChanged(this.position):void 0},e}()}.call(this),function(){Turbolinks.SnapshotCache=function(){function t(t){this.size=t,this.keys=[],this.snapshots={}}var e;return t.prototype.has=function(t){var r;return r=e(t),r in this.snapshots},t.prototype.get=function(t){var e;if(this.has(t))return e=this.read(t),this.touch(t),e},t.prototype.put=function(t,e){return this.write(t,e),this.touch(t),e},t.prototype.read=function(t){var r;return r=e(t),this.snapshots[r]},t.prototype.write=function(t,r){var n;return n=e(t),this.snapshots[n]=r},t.prototype.touch=function(t){var r,n;return n=e(t),r=this.keys.indexOf(n),r>-1&&this.keys.splice(r,1),this.keys.unshift(n),this.trim()},t.prototype.trim=function(){var t,e,r,n,o;for(n=this.keys.splice(this.size),o=[],t=0,r=n.length;r>t;t++)e=n[t],o.push(delete this.snapshots[e]);return o},e=function(t){return Turbolinks.Location.wrap(t).toCacheKey()},t}()}.call(this),function(){var t=function(t,e){return function(){return t.apply(e,arguments)}};Turbolinks.Visit=function(){function e(e,r,n){this.controller=e,this.action=n,this.performScroll=t(this.performScroll,this),this.identifier=Turbolinks.uuid(),this.location=Turbolinks.Location.wrap(r),this.adapter=this.controller.adapter,this.state="initialized",this.timingMetrics={}}var r;return e.prototype.start=function(){return"initialized"===this.state?(this.recordTimingMetric("visitStart"),this.state="started",this.adapter.visitStarted(this)):void 0},e.prototype.cancel=function(){var t;return"started"===this.state?(null!=(t=this.request)&&t.cancel(),this.cancelRender(),this.state="canceled"):void 0},e.prototype.complete=function(){var t;return"started"===this.state?(this.recordTimingMetric("visitEnd"),this.state="completed","function"==typeof(t=this.adapter).visitCompleted&&t.visitCompleted(this),this.controller.visitCompleted(this)):void 0},e.prototype.fail=function(){var t;return"started"===this.state?(this.state="failed","function"==typeof(t=this.adapter).visitFailed?t.visitFailed(this):void 0):void 0},e.prototype.changeHistory=function(){var t,e;return this.historyChanged?void 0:(t=this.location.isEqualTo(this.referrer)?"replace":this.action,e=r(t),this.controller[e](this.location,this.restorationIdentifier),this.historyChanged=!0)},e.prototype.issueRequest=function(){return this.shouldIssueRequest()&&null==this.request?(this.progress=0,this.request=new Turbolinks.HttpRequest(this,this.location,this.referrer),this.request.send()):void 0},e.prototype.getCachedSnapshot=function(){var t;return!(t=this.controller.getCachedSnapshotForLocation(this.location))||null!=this.location.anchor&&!t.hasAnchor(this.location.anchor)||"restore"!==this.action&&!t.isPreviewable()?void 0:t},e.prototype.hasCachedSnapshot=function(){return null!=this.getCachedSnapshot()},e.prototype.loadCachedSnapshot=function(){var t,e;return(e=this.getCachedSnapshot())?(t=this.shouldIssueRequest(),this.render(function(){var r;return this.cacheSnapshot(),this.controller.render({snapshot:e,isPreview:t},this.performScroll),"function"==typeof(r=this.adapter).visitRendered&&r.visitRendered(this),t?void 0:this.complete()})):void 0},e.prototype.loadResponse=function(){return null!=this.response?this.render(function(){var t,e;return this.cacheSnapshot(),this.request.failed?(this.controller.render({error:this.response},this.performScroll),"function"==typeof(t=this.adapter).visitRendered&&t.visitRendered(this),this.fail()):(this.controller.render({snapshot:this.response},this.performScroll),"function"==typeof(e=this.adapter).visitRendered&&e.visitRendered(this),this.complete())}):void 0},e.prototype.followRedirect=function(){return this.redirectedToLocation&&!this.followedRedirect?(this.location=this.redirectedToLocation,this.controller.replaceHistoryWithLocationAndRestorationIdentifier(this.redirectedToLocation,this.restorationIdentifier),this.followedRedirect=!0):void 0},e.prototype.requestStarted=function(){var t;return this.recordTimingMetric("requestStart"),"function"==typeof(t=this.adapter).visitRequestStarted?t.visitRequestStarted(this):void 0},e.prototype.requestProgressed=function(t){var e;return this.progress=t,"function"==typeof(e=this.adapter).visitRequestProgressed?e.visitRequestProgressed(this):void 0},e.prototype.requestCompletedWithResponse=function(t,e){return this.response=t,null!=e&&(this.redirectedToLocation=Turbolinks.Location.wrap(e)),this.adapter.visitRequestCompleted(this)},e.prototype.requestFailedWithStatusCode=function(t,e){return this.response=e,this.adapter.visitRequestFailedWithStatusCode(this,t)},e.prototype.requestFinished=function(){var t;return this.recordTimingMetric("requestEnd"),"function"==typeof(t=this.adapter).visitRequestFinished?t.visitRequestFinished(this):void 0},e.prototype.performScroll=function(){return this.scrolled?void 0:("restore"===this.action?this.scrollToRestoredPosition()||this.scrollToTop():this.scrollToAnchor()||this.scrollToTop(),this.scrolled=!0)},e.prototype.scrollToRestoredPosition=function(){var t,e;return t=null!=(e=this.restorationData)?e.scrollPosition:void 0,null!=t?(this.controller.scrollToPosition(t),!0):void 0},e.prototype.scrollToAnchor=function(){return null!=this.location.anchor?(this.controller.scrollToAnchor(this.location.anchor),!0):void 0},e.prototype.scrollToTop=function(){return this.controller.scrollToPosition({x:0,y:0})},e.prototype.recordTimingMetric=function(t){var e;return null!=(e=this.timingMetrics)[t]?e[t]:e[t]=(new Date).getTime()},e.prototype.getTimingMetrics=function(){return Turbolinks.copyObject(this.timingMetrics)},r=function(t){switch(t){case"replace":return"replaceHistoryWithLocationAndRestorationIdentifier";case"advance":case"restore":return"pushHistoryWithLocationAndRestorationIdentifier"}},e.prototype.shouldIssueRequest=function(){return"restore"===this.action?!this.hasCachedSnapshot():!0},e.prototype.cacheSnapshot=function(){return this.snapshotCached?void 0:(this.controller.cacheSnapshot(),this.snapshotCached=!0)},e.prototype.render=function(t){return this.cancelRender(),this.frame=requestAnimationFrame(function(e){return function(){return e.frame=null,t.call(e)}}(this))},e.prototype.cancelRender=function(){return this.frame?cancelAnimationFrame(this.frame):void 0},e}()}.call(this),function(){var t=function(t,e){return function(){return t.apply(e,arguments)}};Turbolinks.Controller=function(){function e(){this.clickBubbled=t(this.clickBubbled,this),this.clickCaptured=t(this.clickCaptured,this),this.pageLoaded=t(this.pageLoaded,this),this.history=new Turbolinks.History(this),this.view=new Turbolinks.View(this),this.scrollManager=new Turbolinks.ScrollManager(this),this.restorationData={},this.clearCache(),this.setProgressBarDelay(500)}return e.prototype.start=function(){return Turbolinks.supported&&!this.started?(addEventListener("click",this.clickCaptured,!0),addEventListener("DOMContentLoaded",this.pageLoaded,!1),this.scrollManager.start(),this.startHistory(),this.started=!0,this.enabled=!0):void 0},e.prototype.disable=function(){return this.enabled=!1},e.prototype.stop=function(){return this.started?(removeEventListener("click",this.clickCaptured,!0),removeEventListener("DOMContentLoaded",this.pageLoaded,!1),this.scrollManager.stop(),this.stopHistory(),this.started=!1):void 0},e.prototype.clearCache=function(){return this.cache=new Turbolinks.SnapshotCache(10)},e.prototype.visit=function(t,e){var r,n;return null==e&&(e={}),t=Turbolinks.Location.wrap(t),this.applicationAllowsVisitingLocation(t)?this.locationIsVisitable(t)?(r=null!=(n=e.action)?n:"advance",this.adapter.visitProposedToLocationWithAction(t,r)):window.location=t:void 0},e.prototype.startVisitToLocationWithAction=function(t,e,r){var n;return Turbolinks.supported?(n=this.getRestorationDataForIdentifier(r),this.startVisit(t,e,{restorationData:n})):window.location=t},e.prototype.setProgressBarDelay=function(t){return this.progressBarDelay=t},e.prototype.startHistory=function(){return this.location=Turbolinks.Location.wrap(window.location),this.restorationIdentifier=Turbolinks.uuid(),this.history.start(),this.history.replace(this.location,this.restorationIdentifier)},e.prototype.stopHistory=function(){return this.history.stop()},e.prototype.pushHistoryWithLocationAndRestorationIdentifier=function(t,e){return this.restorationIdentifier=e,this.location=Turbolinks.Location.wrap(t),this.history.push(this.location,this.restorationIdentifier)},e.prototype.replaceHistoryWithLocationAndRestorationIdentifier=function(t,e){return this.restorationIdentifier=e,this.location=Turbolinks.Location.wrap(t),this.history.replace(this.location,this.restorationIdentifier)},e.prototype.historyPoppedToLocationWithRestorationIdentifier=function(t,e){var r;return this.restorationIdentifier=e,this.enabled?(r=this.getRestorationDataForIdentifier(this.restorationIdentifier),this.startVisit(t,"restore",{restorationIdentifier:this.restorationIdentifier,restorationData:r,historyChanged:!0}),this.location=Turbolinks.Location.wrap(t)):this.adapter.pageInvalidated()},e.prototype.getCachedSnapshotForLocation=function(t){var e;return e=this.cache.get(t),e?e.clone():void 0},e.prototype.shouldCacheSnapshot=function(){return this.view.getSnapshot().isCacheable()},e.prototype.cacheSnapshot=function(){var t;return this.shouldCacheSnapshot()?(this.notifyApplicationBeforeCachingSnapshot(),t=this.view.getSnapshot(),this.cache.put(this.lastRenderedLocation,t.clone())):void 0},e.prototype.scrollToAnchor=function(t){var e;return(e=this.view.getElementForAnchor(t))?this.scrollToElement(e):this.scrollToPosition({x:0,y:0})},e.prototype.scrollToElement=function(t){return this.scrollManager.scrollToElement(t)},e.prototype.scrollToPosition=function(t){return this.scrollManager.scrollToPosition(t)},e.prototype.scrollPositionChanged=function(t){var e;return e=this.getCurrentRestorationData(),e.scrollPosition=t},e.prototype.render=function(t,e){return this.view.render(t,e)},e.prototype.viewInvalidated=function(){return this.adapter.pageInvalidated()},e.prototype.viewWillRender=function(t){return this.notifyApplicationBeforeRender(t)},e.prototype.viewRendered=function(){return this.lastRenderedLocation=this.currentVisit.location,this.notifyApplicationAfterRender()},e.prototype.pageLoaded=function(){
return this.lastRenderedLocation=this.location,this.notifyApplicationAfterPageLoad()},e.prototype.clickCaptured=function(){return removeEventListener("click",this.clickBubbled,!1),addEventListener("click",this.clickBubbled,!1)},e.prototype.clickBubbled=function(t){var e,r,n;return this.enabled&&this.clickEventIsSignificant(t)&&(r=this.getVisitableLinkForNode(t.target))&&(n=this.getVisitableLocationForLink(r))&&this.applicationAllowsFollowingLinkToLocation(r,n)?(t.preventDefault(),e=this.getActionForLink(r),this.visit(n,{action:e})):void 0},e.prototype.applicationAllowsFollowingLinkToLocation=function(t,e){var r;return r=this.notifyApplicationAfterClickingLinkToLocation(t,e),!r.defaultPrevented},e.prototype.applicationAllowsVisitingLocation=function(t){var e;return e=this.notifyApplicationBeforeVisitingLocation(t),!e.defaultPrevented},e.prototype.notifyApplicationAfterClickingLinkToLocation=function(t,e){return Turbolinks.dispatch("turbolinks:click",{target:t,data:{url:e.absoluteURL},cancelable:!0})},e.prototype.notifyApplicationBeforeVisitingLocation=function(t){return Turbolinks.dispatch("turbolinks:before-visit",{data:{url:t.absoluteURL},cancelable:!0})},e.prototype.notifyApplicationAfterVisitingLocation=function(t){return Turbolinks.dispatch("turbolinks:visit",{data:{url:t.absoluteURL}})},e.prototype.notifyApplicationBeforeCachingSnapshot=function(){return Turbolinks.dispatch("turbolinks:before-cache")},e.prototype.notifyApplicationBeforeRender=function(t){return Turbolinks.dispatch("turbolinks:before-render",{data:{newBody:t}})},e.prototype.notifyApplicationAfterRender=function(){return Turbolinks.dispatch("turbolinks:render")},e.prototype.notifyApplicationAfterPageLoad=function(t){return null==t&&(t={}),Turbolinks.dispatch("turbolinks:load",{data:{url:this.location.absoluteURL,timing:t}})},e.prototype.startVisit=function(t,e,r){var n;return null!=(n=this.currentVisit)&&n.cancel(),this.currentVisit=this.createVisit(t,e,r),this.currentVisit.start(),this.notifyApplicationAfterVisitingLocation(t)},e.prototype.createVisit=function(t,e,r){var n,o,i,s,a;return o=null!=r?r:{},s=o.restorationIdentifier,i=o.restorationData,n=o.historyChanged,a=new Turbolinks.Visit(this,t,e),a.restorationIdentifier=null!=s?s:Turbolinks.uuid(),a.restorationData=Turbolinks.copyObject(i),a.historyChanged=n,a.referrer=this.location,a},e.prototype.visitCompleted=function(t){return this.notifyApplicationAfterPageLoad(t.getTimingMetrics())},e.prototype.clickEventIsSignificant=function(t){return!(t.defaultPrevented||t.target.isContentEditable||t.which>1||t.altKey||t.ctrlKey||t.metaKey||t.shiftKey)},e.prototype.getVisitableLinkForNode=function(t){return this.nodeIsVisitable(t)?Turbolinks.closest(t,"a[href]:not([target]):not([download])"):void 0},e.prototype.getVisitableLocationForLink=function(t){var e;return e=new Turbolinks.Location(t.getAttribute("href")),this.locationIsVisitable(e)?e:void 0},e.prototype.getActionForLink=function(t){var e;return null!=(e=t.getAttribute("data-turbolinks-action"))?e:"advance"},e.prototype.nodeIsVisitable=function(t){var e;return(e=Turbolinks.closest(t,"[data-turbolinks]"))?"false"!==e.getAttribute("data-turbolinks"):!0},e.prototype.locationIsVisitable=function(t){return t.isPrefixedBy(this.view.getRootLocation())&&t.isHTML()},e.prototype.getCurrentRestorationData=function(){return this.getRestorationDataForIdentifier(this.restorationIdentifier)},e.prototype.getRestorationDataForIdentifier=function(t){var e;return null!=(e=this.restorationData)[t]?e[t]:e[t]={}},e}()}.call(this),function(){!function(){var t,e;if((t=e=document.currentScript)&&!e.hasAttribute("data-turbolinks-suppress-warning"))for(;t=t.parentNode;)if(t===document.body)return console.warn("You are loading Turbolinks from a <script> element inside the <body> element. This is probably not what you meant to do!\n\nLoad your application\u2019s JavaScript bundle inside the <head> element instead. <script> elements in <body> are evaluated with each page change.\n\nFor more information, see: https://github.com/turbolinks/turbolinks#working-with-script-elements\n\n\u2014\u2014\nSuppress this warning by adding a `data-turbolinks-suppress-warning` attribute to: %s",e.outerHTML)}()}.call(this),function(){var t,e,r;Turbolinks.start=function(){return e()?(null==Turbolinks.controller&&(Turbolinks.controller=t()),Turbolinks.controller.start()):void 0},e=function(){return null==window.Turbolinks&&(window.Turbolinks=Turbolinks),r()},t=function(){var t;return t=new Turbolinks.Controller,t.adapter=new Turbolinks.BrowserAdapter(t),t},r=function(){return window.Turbolinks===Turbolinks},r()&&Turbolinks.start()}.call(this);
/*!
 * jQuery JavaScript Library v3.2.1
 * https://jquery.com/
 *
 * Includes Sizzle.js
 * https://sizzlejs.com/
 *
 * Copyright JS Foundation and other contributors
 * Released under the MIT license
 * https://jquery.org/license
 *
 * Date: 2017-03-20T18:59Z
 */

( function( global, factory ) {

	"use strict";

	if ( typeof module === "object" && typeof module.exports === "object" ) {

		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info.
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
} )( typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Edge <= 12 - 13+, Firefox <=18 - 45+, IE 10 - 11, Safari 5.1 - 9+, iOS 6 - 9.1
// throw exceptions when non-strict code (e.g., ASP.NET 4.5) accesses strict mode
// arguments.callee.caller (trac-13335). But as of jQuery 3.0 (2016), strict mode should be common
// enough that all such attempts are guarded in a try block.
"use strict";

var arr = [];

var document = window.document;

var getProto = Object.getPrototypeOf;

var slice = arr.slice;

var concat = arr.concat;

var push = arr.push;

var indexOf = arr.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var fnToString = hasOwn.toString;

var ObjectFunctionString = fnToString.call( Object );

var support = {};



	function DOMEval( code, doc ) {
		doc = doc || document;

		var script = doc.createElement( "script" );

		script.text = code;
		doc.head.appendChild( script ).parentNode.removeChild( script );
	}
/* global Symbol */
// Defining this global in .eslintrc.json would create a danger of using the global
// unguarded in another place, it seems safer to define global only for this module



var
	version = "3.2.1",

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {

		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );
	},

	// Support: Android <=4.0 only
	// Make sure we trim BOM and NBSP
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([a-z])/g,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	};

jQuery.fn = jQuery.prototype = {

	// The current version of jQuery being used
	jquery: version,

	constructor: jQuery,

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {

		// Return all the elements in a clean array
		if ( num == null ) {
			return slice.call( this );
		}

		// Return just the one element from the set
		return num < 0 ? this[ num + this.length ] : this[ num ];
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	each: function( callback ) {
		return jQuery.each( this, callback );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map( this, function( elem, i ) {
			return callback.call( elem, i, elem );
		} ) );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
	},

	end: function() {
		return this.prevObject || this.constructor();
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: arr.sort,
	splice: arr.splice
};

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[ 0 ] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// Skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction( target ) ) {
		target = {};
	}

	// Extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {

		// Only deal with non-null/undefined values
		if ( ( options = arguments[ i ] ) != null ) {

			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
					( copyIsArray = Array.isArray( copy ) ) ) ) {

					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && Array.isArray( src ) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject( src ) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend( {

	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

	isFunction: function( obj ) {
		return jQuery.type( obj ) === "function";
	},

	isWindow: function( obj ) {
		return obj != null && obj === obj.window;
	},

	isNumeric: function( obj ) {

		// As of jQuery 3.0, isNumeric is limited to
		// strings and numbers (primitives or objects)
		// that can be coerced to finite numbers (gh-2662)
		var type = jQuery.type( obj );
		return ( type === "number" || type === "string" ) &&

			// parseFloat NaNs numeric-cast false positives ("")
			// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
			// subtraction forces infinities to NaN
			!isNaN( obj - parseFloat( obj ) );
	},

	isPlainObject: function( obj ) {
		var proto, Ctor;

		// Detect obvious negatives
		// Use toString instead of jQuery.type to catch host objects
		if ( !obj || toString.call( obj ) !== "[object Object]" ) {
			return false;
		}

		proto = getProto( obj );

		// Objects with no prototype (e.g., `Object.create( null )`) are plain
		if ( !proto ) {
			return true;
		}

		// Objects with prototype are plain iff they were constructed by a global Object function
		Ctor = hasOwn.call( proto, "constructor" ) && proto.constructor;
		return typeof Ctor === "function" && fnToString.call( Ctor ) === ObjectFunctionString;
	},

	isEmptyObject: function( obj ) {

		/* eslint-disable no-unused-vars */
		// See https://github.com/eslint/eslint/issues/6125
		var name;

		for ( name in obj ) {
			return false;
		}
		return true;
	},

	type: function( obj ) {
		if ( obj == null ) {
			return obj + "";
		}

		// Support: Android <=2.3 only (functionish RegExp)
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ toString.call( obj ) ] || "object" :
			typeof obj;
	},

	// Evaluates a script in a global context
	globalEval: function( code ) {
		DOMEval( code );
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Support: IE <=9 - 11, Edge 12 - 13
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	each: function( obj, callback ) {
		var length, i = 0;

		if ( isArrayLike( obj ) ) {
			length = obj.length;
			for ( ; i < length; i++ ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		} else {
			for ( i in obj ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		}

		return obj;
	},

	// Support: Android <=4.0 only
	trim: function( text ) {
		return text == null ?
			"" :
			( text + "" ).replace( rtrim, "" );
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArrayLike( Object( arr ) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		return arr == null ? -1 : indexOf.call( arr, elem, i );
	},

	// Support: Android <=4.0 only, PhantomJS 1 only
	// push.apply(_, arraylike) throws on ancient WebKit
	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		for ( ; j < len; j++ ) {
			first[ i++ ] = second[ j ];
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var length, value,
			i = 0,
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArrayLike( elems ) ) {
			length = elems.length;
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		return concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var tmp, args, proxy;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	now: Date.now,

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
} );

if ( typeof Symbol === "function" ) {
	jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
}

// Populate the class2type map
jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
function( i, name ) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
} );

function isArrayLike( obj ) {

	// Support: real iOS 8.2 only (not reproducible in simulator)
	// `in` check used to prevent JIT error (gh-2145)
	// hasOwn isn't used here due to false negatives
	// regarding Nodelist length in IE
	var length = !!obj && "length" in obj && obj.length,
		type = jQuery.type( obj );

	if ( type === "function" || jQuery.isWindow( obj ) ) {
		return false;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}
var Sizzle =
/*!
 * Sizzle CSS Selector Engine v2.3.3
 * https://sizzlejs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2016-08-08
 */
(function( window ) {

var i,
	support,
	Expr,
	getText,
	isXML,
	tokenize,
	compile,
	select,
	outermostContext,
	sortInput,
	hasDuplicate,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + 1 * new Date(),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf as it's faster than native
	// https://jsperf.com/thor-indexof-vs-for/5
	indexOf = function( list, elem ) {
		var i = 0,
			len = list.length;
		for ( ; i < len; i++ ) {
			if ( list[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",

	// http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = "(?:\\\\.|[\\w-]|[^\0-\\xa0])+",

	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +
		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +
		// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
		"*\\]",

	pseudos = ":(" + identifier + ")(?:\\((" +
		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
		// 3. anything else (capture 2)
		".*" +
		")\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rwhitespace = new RegExp( whitespace + "+", "g" ),
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + identifier + ")" ),
		"CLASS": new RegExp( "^\\.(" + identifier + ")" ),
		"TAG": new RegExp( "^(" + identifier + "|[*])" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,

	// CSS escapes
	// http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox<24
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			high < 0 ?
				// BMP codepoint
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	},

	// CSS string/identifier serialization
	// https://drafts.csswg.org/cssom/#common-serializing-idioms
	rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
	fcssescape = function( ch, asCodePoint ) {
		if ( asCodePoint ) {

			// U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
			if ( ch === "\0" ) {
				return "\uFFFD";
			}

			// Control characters and (dependent upon position) numbers get escaped as code points
			return ch.slice( 0, -1 ) + "\\" + ch.charCodeAt( ch.length - 1 ).toString( 16 ) + " ";
		}

		// Other potentially-special ASCII characters get backslash-escaped
		return "\\" + ch;
	},

	// Used for iframes
	// See setDocument()
	// Removing the function wrapper causes a "Permission Denied"
	// error in IE
	unloadHandler = function() {
		setDocument();
	},

	disabledAncestor = addCombinator(
		function( elem ) {
			return elem.disabled === true && ("form" in elem || "label" in elem);
		},
		{ dir: "parentNode", next: "legend" }
	);

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var m, i, elem, nid, match, groups, newSelector,
		newContext = context && context.ownerDocument,

		// nodeType defaults to 9, since context defaults to document
		nodeType = context ? context.nodeType : 9;

	results = results || [];

	// Return early from calls with invalid selector or context
	if ( typeof selector !== "string" || !selector ||
		nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

		return results;
	}

	// Try to shortcut find operations (as opposed to filters) in HTML documents
	if ( !seed ) {

		if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
			setDocument( context );
		}
		context = context || document;

		if ( documentIsHTML ) {

			// If the selector is sufficiently simple, try using a "get*By*" DOM method
			// (excepting DocumentFragment context, where the methods don't exist)
			if ( nodeType !== 11 && (match = rquickExpr.exec( selector )) ) {

				// ID selector
				if ( (m = match[1]) ) {

					// Document context
					if ( nodeType === 9 ) {
						if ( (elem = context.getElementById( m )) ) {

							// Support: IE, Opera, Webkit
							// TODO: identify versions
							// getElementById can match elements by name instead of ID
							if ( elem.id === m ) {
								results.push( elem );
								return results;
							}
						} else {
							return results;
						}

					// Element context
					} else {

						// Support: IE, Opera, Webkit
						// TODO: identify versions
						// getElementById can match elements by name instead of ID
						if ( newContext && (elem = newContext.getElementById( m )) &&
							contains( context, elem ) &&
							elem.id === m ) {

							results.push( elem );
							return results;
						}
					}

				// Type selector
				} else if ( match[2] ) {
					push.apply( results, context.getElementsByTagName( selector ) );
					return results;

				// Class selector
				} else if ( (m = match[3]) && support.getElementsByClassName &&
					context.getElementsByClassName ) {

					push.apply( results, context.getElementsByClassName( m ) );
					return results;
				}
			}

			// Take advantage of querySelectorAll
			if ( support.qsa &&
				!compilerCache[ selector + " " ] &&
				(!rbuggyQSA || !rbuggyQSA.test( selector )) ) {

				if ( nodeType !== 1 ) {
					newContext = context;
					newSelector = selector;

				// qSA looks outside Element context, which is not what we want
				// Thanks to Andrew Dupont for this workaround technique
				// Support: IE <=8
				// Exclude object elements
				} else if ( context.nodeName.toLowerCase() !== "object" ) {

					// Capture the context ID, setting it first if necessary
					if ( (nid = context.getAttribute( "id" )) ) {
						nid = nid.replace( rcssescape, fcssescape );
					} else {
						context.setAttribute( "id", (nid = expando) );
					}

					// Prefix every selector in the list
					groups = tokenize( selector );
					i = groups.length;
					while ( i-- ) {
						groups[i] = "#" + nid + " " + toSelector( groups[i] );
					}
					newSelector = groups.join( "," );

					// Expand context for sibling selectors
					newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
						context;
				}

				if ( newSelector ) {
					try {
						push.apply( results,
							newContext.querySelectorAll( newSelector )
						);
						return results;
					} catch ( qsaError ) {
					} finally {
						if ( nid === expando ) {
							context.removeAttribute( "id" );
						}
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {function(string, object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key + " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key + " " ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created element and returns a boolean result
 */
function assert( fn ) {
	var el = document.createElement("fieldset");

	try {
		return !!fn( el );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( el.parentNode ) {
			el.parentNode.removeChild( el );
		}
		// release memory in IE
		el = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = arr.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			a.sourceIndex - b.sourceIndex;

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for :enabled/:disabled
 * @param {Boolean} disabled true for :disabled; false for :enabled
 */
function createDisabledPseudo( disabled ) {

	// Known :disabled false positives: fieldset[disabled] > legend:nth-of-type(n+2) :can-disable
	return function( elem ) {

		// Only certain elements can match :enabled or :disabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-enabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-disabled
		if ( "form" in elem ) {

			// Check for inherited disabledness on relevant non-disabled elements:
			// * listed form-associated elements in a disabled fieldset
			//   https://html.spec.whatwg.org/multipage/forms.html#category-listed
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-fe-disabled
			// * option elements in a disabled optgroup
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-option-disabled
			// All such elements have a "form" property.
			if ( elem.parentNode && elem.disabled === false ) {

				// Option elements defer to a parent optgroup if present
				if ( "label" in elem ) {
					if ( "label" in elem.parentNode ) {
						return elem.parentNode.disabled === disabled;
					} else {
						return elem.disabled === disabled;
					}
				}

				// Support: IE 6 - 11
				// Use the isDisabled shortcut property to check for disabled fieldset ancestors
				return elem.isDisabled === disabled ||

					// Where there is no isDisabled, check manually
					/* jshint -W018 */
					elem.isDisabled !== !disabled &&
						disabledAncestor( elem ) === disabled;
			}

			return elem.disabled === disabled;

		// Try to winnow out elements that can't be disabled before trusting the disabled property.
		// Some victims get caught in our net (label, legend, menu, track), but it shouldn't
		// even exist on them, let alone have a boolean value.
		} else if ( "label" in elem ) {
			return elem.disabled === disabled;
		}

		// Remaining elements are neither :enabled nor :disabled
		return false;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== "undefined" && context;
}

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var hasCompare, subWindow,
		doc = node ? node.ownerDocument || node : preferredDoc;

	// Return early if doc is invalid or already selected
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Update global variables
	document = doc;
	docElem = document.documentElement;
	documentIsHTML = !isXML( document );

	// Support: IE 9-11, Edge
	// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
	if ( preferredDoc !== document &&
		(subWindow = document.defaultView) && subWindow.top !== subWindow ) {

		// Support: IE 11, Edge
		if ( subWindow.addEventListener ) {
			subWindow.addEventListener( "unload", unloadHandler, false );

		// Support: IE 9 - 10 only
		} else if ( subWindow.attachEvent ) {
			subWindow.attachEvent( "onunload", unloadHandler );
		}
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties
	// (excepting IE8 booleans)
	support.attributes = assert(function( el ) {
		el.className = "i";
		return !el.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( el ) {
		el.appendChild( document.createComment("") );
		return !el.getElementsByTagName("*").length;
	});

	// Support: IE<9
	support.getElementsByClassName = rnative.test( document.getElementsByClassName );

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programmatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( el ) {
		docElem.appendChild( el ).id = expando;
		return !document.getElementsByName || !document.getElementsByName( expando ).length;
	});

	// ID filter and find
	if ( support.getById ) {
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var elem = context.getElementById( id );
				return elem ? [ elem ] : [];
			}
		};
	} else {
		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== "undefined" &&
					elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};

		// Support: IE 6 - 7 only
		// getElementById is not reliable as a find shortcut
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var node, i, elems,
					elem = context.getElementById( id );

				if ( elem ) {

					// Verify the id attribute
					node = elem.getAttributeNode("id");
					if ( node && node.value === id ) {
						return [ elem ];
					}

					// Fall back on getElementsByName
					elems = context.getElementsByName( id );
					i = 0;
					while ( (elem = elems[i++]) ) {
						node = elem.getAttributeNode("id");
						if ( node && node.value === id ) {
							return [ elem ];
						}
					}
				}

				return [];
			}
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( tag );

			// DocumentFragment nodes don't have gEBTN
			} else if ( support.qsa ) {
				return context.querySelectorAll( tag );
			}
		} :

		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See https://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( document.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( el ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// https://bugs.jquery.com/ticket/12359
			docElem.appendChild( el ).innerHTML = "<a id='" + expando + "'></a>" +
				"<select id='" + expando + "-\r\\' msallowcapture=''>" +
				"<option selected=''></option></select>";

			// Support: IE8, Opera 11-12.16
			// Nothing should be selected when empty strings follow ^= or $= or *=
			// The test attribute must be unknown in Opera but "safe" for WinRT
			// https://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
			if ( el.querySelectorAll("[msallowcapture^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !el.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
			if ( !el.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
				rbuggyQSA.push("~=");
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !el.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}

			// Support: Safari 8+, iOS 8+
			// https://bugs.webkit.org/show_bug.cgi?id=136851
			// In-page `selector#id sibling-combinator selector` fails
			if ( !el.querySelectorAll( "a#" + expando + "+*" ).length ) {
				rbuggyQSA.push(".#.+[+~]");
			}
		});

		assert(function( el ) {
			el.innerHTML = "<a href='' disabled='disabled'></a>" +
				"<select disabled='disabled'><option/></select>";

			// Support: Windows 8 Native Apps
			// The type and name attributes are restricted during .innerHTML assignment
			var input = document.createElement("input");
			input.setAttribute( "type", "hidden" );
			el.appendChild( input ).setAttribute( "name", "D" );

			// Support: IE8
			// Enforce case-sensitivity of name attribute
			if ( el.querySelectorAll("[name=d]").length ) {
				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( el.querySelectorAll(":enabled").length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Support: IE9-11+
			// IE's :disabled selector does not pick up the children of disabled fieldsets
			docElem.appendChild( el ).disabled = true;
			if ( el.querySelectorAll(":disabled").length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			el.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
		docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( el ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( el, "*" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( el, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */
	hasCompare = rnative.test( docElem.compareDocumentPosition );

	// Element contains another
	// Purposefully self-exclusive
	// As in, an element does not contain itself
	contains = hasCompare || rnative.test( docElem.contains ) ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = hasCompare ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}

		// Calculate position if both inputs belong to the same document
		compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if ( compare & 1 ||
			(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

			// Choose the first element that is related to our preferred document
			if ( a === document || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
				return -1;
			}
			if ( b === document || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	} :
	function( a, b ) {
		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Parentless nodes are either documents or disconnected
		if ( !aup || !bup ) {
			return a === document ? -1 :
				b === document ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return document;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		!compilerCache[ expr + " " ] &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch (e) {}
	}

	return Sizzle( expr, document, null, [ elem ] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val !== undefined ?
		val :
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null;
};

Sizzle.escape = function( sel ) {
	return (sel + "").replace( rcssescape, fcssescape );
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	// Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		while ( (node = elem[i++]) ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (jQuery #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[3] || match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[6] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] ) {
				match[2] = match[4] || match[5] || "";

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, uniqueCache, outerCache, node, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType,
						diff = false;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) {

										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {

							// Seek `elem` from a previously-cached index

							// ...in a gzip-friendly way
							node = parent;
							outerCache = node[ expando ] || (node[ expando ] = {});

							// Support: IE <9 only
							// Defend against cloned attroperties (jQuery gh-1709)
							uniqueCache = outerCache[ node.uniqueID ] ||
								(outerCache[ node.uniqueID ] = {});

							cache = uniqueCache[ type ] || [];
							nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
							diff = nodeIndex && cache[ 2 ];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						} else {
							// Use previously-cached element index if available
							if ( useCache ) {
								// ...in a gzip-friendly way
								node = elem;
								outerCache = node[ expando ] || (node[ expando ] = {});

								// Support: IE <9 only
								// Defend against cloned attroperties (jQuery gh-1709)
								uniqueCache = outerCache[ node.uniqueID ] ||
									(outerCache[ node.uniqueID ] = {});

								cache = uniqueCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex;
							}

							// xml :nth-child(...)
							// or :nth-last-child(...) or :nth(-last)?-of-type(...)
							if ( diff === false ) {
								// Use the same loop as above to seek `elem` from the start
								while ( (node = ++nodeIndex && node && node[ dir ] ||
									(diff = nodeIndex = 0) || start.pop()) ) {

									if ( ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) &&
										++diff ) {

										// Cache the index of each encountered element
										if ( useCache ) {
											outerCache = node[ expando ] || (node[ expando ] = {});

											// Support: IE <9 only
											// Defend against cloned attroperties (jQuery gh-1709)
											uniqueCache = outerCache[ node.uniqueID ] ||
												(outerCache[ node.uniqueID ] = {});

											uniqueCache[ type ] = [ dirruns, diff ];
										}

										if ( node === elem ) {
											break;
										}
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					// Don't keep the element (issue #299)
					input[0] = null;
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			text = text.replace( runescape, funescape );
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": createDisabledPseudo( false ),
		"disabled": createDisabledPseudo( true ),

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&

				// Support: IE<8
				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( (tokens = []) );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
};

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		skip = combinator.next,
		key = skip || dir,
		checkNonElements = base && key === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
			return false;
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, uniqueCache, outerCache,
				newCache = [ dirruns, doneName ];

			// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});

						// Support: IE <9 only
						// Defend against cloned attroperties (jQuery gh-1709)
						uniqueCache = outerCache[ elem.uniqueID ] || (outerCache[ elem.uniqueID ] = {});

						if ( skip && skip === elem.nodeName.toLowerCase() ) {
							elem = elem[ dir ] || elem;
						} else if ( (oldCache = uniqueCache[ key ]) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							// Assign to newCache so results back-propagate to previous elements
							return (newCache[ 2 ] = oldCache[ 2 ]);
						} else {
							// Reuse newcache so results back-propagate to previous elements
							uniqueCache[ key ] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) {
								return true;
							}
						}
					}
				}
			}
			return false;
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
			// Avoid hanging onto element (issue #299)
			checkContext = null;
			return ret;
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,
				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
				len = elems.length;

			if ( outermost ) {
				outermostContext = context === document || context || outermost;
			}

			// Add elements passing elementMatchers directly to results
			// Support: IE<9, Safari
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
			for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					if ( !context && elem.ownerDocument !== document ) {
						setDocument( elem );
						xml = !documentIsHTML;
					}
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context || document, xml) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// `i` is now the count of elements visited above, and adding it to `matchedCount`
			// makes the latter nonnegative.
			matchedCount += i;

			// Apply set filters to unmatched elements
			// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
			// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
			// no element matchers and no seed.
			// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
			// case, which will result in a "00" `matchedCount` that differs from `i` but is also
			// numerically zero.
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) {
			cached = matcherFromTokens( match[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );

		// Save selector and tokenization
		cached.selector = selector;
	}
	return cached;
};

/**
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
select = Sizzle.select = function( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector,
		match = !seed && tokenize( (selector = compiled.selector || selector) );

	results = results || [];

	// Try to minimize operations if there is only one selector in the list and no seed
	// (the latter of which guarantees us context)
	if ( match.length === 1 ) {

		// Reduce context if the leading compound selector is an ID
		tokens = match[0] = match[0].slice( 0 );
		if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
				context.nodeType === 9 && documentIsHTML && Expr.relative[ tokens[1].type ] ) {

			context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
			if ( !context ) {
				return results;

			// Precompiled matchers will still verify ancestry, so step up a level
			} else if ( compiled ) {
				context = context.parentNode;
			}

			selector = selector.slice( tokens.shift().value.length );
		}

		// Fetch a seed set for right-to-left matching
		i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[i];

			// Abort if we hit a combinator
			if ( Expr.relative[ (type = token.type) ] ) {
				break;
			}
			if ( (find = Expr.find[ type ]) ) {
				// Search, expanding context for leading sibling combinators
				if ( (seed = find(
					token.matches[0].replace( runescape, funescape ),
					rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
				)) ) {

					// If seed is empty or no tokens remain, we can return early
					tokens.splice( i, 1 );
					selector = seed.length && toSelector( tokens );
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}

					break;
				}
			}
		}
	}

	// Compile and execute a filtering function if one is not provided
	// Provide `match` to avoid retokenization if we modified the selector above
	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentIsHTML,
		results,
		!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
};

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome 14-35+
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = !!hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( el ) {
	// Should return 1, but returns 4 (following)
	return el.compareDocumentPosition( document.createElement("fieldset") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// https://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( el ) {
	el.innerHTML = "<a href='#'></a>";
	return el.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( el ) {
	el.innerHTML = "<input/>";
	el.firstChild.setAttribute( "value", "" );
	return el.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( el ) {
	return el.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return elem[ name ] === true ? name.toLowerCase() :
					(val = elem.getAttributeNode( name )) && val.specified ?
					val.value :
				null;
		}
	});
}

return Sizzle;

})( window );



jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;

// Deprecated
jQuery.expr[ ":" ] = jQuery.expr.pseudos;
jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;
jQuery.escapeSelector = Sizzle.escape;




var dir = function( elem, dir, until ) {
	var matched = [],
		truncate = until !== undefined;

	while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
		if ( elem.nodeType === 1 ) {
			if ( truncate && jQuery( elem ).is( until ) ) {
				break;
			}
			matched.push( elem );
		}
	}
	return matched;
};


var siblings = function( n, elem ) {
	var matched = [];

	for ( ; n; n = n.nextSibling ) {
		if ( n.nodeType === 1 && n !== elem ) {
			matched.push( n );
		}
	}

	return matched;
};


var rneedsContext = jQuery.expr.match.needsContext;



function nodeName( elem, name ) {

  return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();

};
var rsingleTag = ( /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i );



var risSimple = /^.[^:#\[\.,]*$/;

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			return !!qualifier.call( elem, i, elem ) !== not;
		} );
	}

	// Single element
	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		} );
	}

	// Arraylike of elements (jQuery, arguments, Array)
	if ( typeof qualifier !== "string" ) {
		return jQuery.grep( elements, function( elem ) {
			return ( indexOf.call( qualifier, elem ) > -1 ) !== not;
		} );
	}

	// Simple selector that can be filtered directly, removing non-Elements
	if ( risSimple.test( qualifier ) ) {
		return jQuery.filter( qualifier, elements, not );
	}

	// Complex selector, compare the two sets, removing non-Elements
	qualifier = jQuery.filter( qualifier, elements );
	return jQuery.grep( elements, function( elem ) {
		return ( indexOf.call( qualifier, elem ) > -1 ) !== not && elem.nodeType === 1;
	} );
}

jQuery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];

	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	if ( elems.length === 1 && elem.nodeType === 1 ) {
		return jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [];
	}

	return jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
		return elem.nodeType === 1;
	} ) );
};

jQuery.fn.extend( {
	find: function( selector ) {
		var i, ret,
			len = this.length,
			self = this;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter( function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			} ) );
		}

		ret = this.pushStack( [] );

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		return len > 1 ? jQuery.uniqueSort( ret ) : ret;
	},
	filter: function( selector ) {
		return this.pushStack( winnow( this, selector || [], false ) );
	},
	not: function( selector ) {
		return this.pushStack( winnow( this, selector || [], true ) );
	},
	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	}
} );


// Initialize a jQuery object


// A central reference to the root jQuery(document)
var rootjQuery,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	// Shortcut simple #id case for speed
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,

	init = jQuery.fn.init = function( selector, context, root ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Method init() accepts an alternate rootjQuery
		// so migrate can support jQuery.sub (gh-2101)
		root = root || rootjQuery;

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector[ 0 ] === "<" &&
				selector[ selector.length - 1 ] === ">" &&
				selector.length >= 3 ) {

				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && ( match[ 1 ] || !context ) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[ 1 ] ) {
					context = context instanceof jQuery ? context[ 0 ] : context;

					// Option to run scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge( this, jQuery.parseHTML(
						match[ 1 ],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {

							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[ 2 ] );

					if ( elem ) {

						// Inject the element directly into the jQuery object
						this[ 0 ] = elem;
						this.length = 1;
					}
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || root ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this[ 0 ] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return root.ready !== undefined ?
				root.ready( selector ) :

				// Execute immediately if ready is not present
				selector( jQuery );
		}

		return jQuery.makeArray( selector, this );
	};

// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );


var rparentsprev = /^(?:parents|prev(?:Until|All))/,

	// Methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend( {
	has: function( target ) {
		var targets = jQuery( target, this ),
			l = targets.length;

		return this.filter( function() {
			var i = 0;
			for ( ; i < l; i++ ) {
				if ( jQuery.contains( this, targets[ i ] ) ) {
					return true;
				}
			}
		} );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			targets = typeof selectors !== "string" && jQuery( selectors );

		// Positional selectors never match, since there's no _selection_ context
		if ( !rneedsContext.test( selectors ) ) {
			for ( ; i < l; i++ ) {
				for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {

					// Always skip document fragments
					if ( cur.nodeType < 11 && ( targets ?
						targets.index( cur ) > -1 :

						// Don't pass non-elements to Sizzle
						cur.nodeType === 1 &&
							jQuery.find.matchesSelector( cur, selectors ) ) ) {

						matched.push( cur );
						break;
					}
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
	},

	// Determine the position of an element within the set
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// Index in selector
		if ( typeof elem === "string" ) {
			return indexOf.call( jQuery( elem ), this[ 0 ] );
		}

		// Locate the position of the desired element
		return indexOf.call( this,

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem
		);
	},

	add: function( selector, context ) {
		return this.pushStack(
			jQuery.uniqueSort(
				jQuery.merge( this.get(), jQuery( selector, context ) )
			)
		);
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	}
} );

function sibling( cur, dir ) {
	while ( ( cur = cur[ dir ] ) && cur.nodeType !== 1 ) {}
	return cur;
}

jQuery.each( {
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return siblings( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return siblings( elem.firstChild );
	},
	contents: function( elem ) {
        if ( nodeName( elem, "iframe" ) ) {
            return elem.contentDocument;
        }

        // Support: IE 9 - 11 only, iOS 7 only, Android Browser <=4.3 only
        // Treat the template element as a regular one in browsers that
        // don't support it.
        if ( nodeName( elem, "template" ) ) {
            elem = elem.content || elem;
        }

        return jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var matched = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			matched = jQuery.filter( selector, matched );
		}

		if ( this.length > 1 ) {

			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				jQuery.uniqueSort( matched );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				matched.reverse();
			}
		}

		return this.pushStack( matched );
	};
} );
var rnothtmlwhite = ( /[^\x20\t\r\n\f]+/g );



// Convert String-formatted options into Object-formatted ones
function createOptions( options ) {
	var object = {};
	jQuery.each( options.match( rnothtmlwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	} );
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		createOptions( options ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,

		// Last fire value for non-forgettable lists
		memory,

		// Flag to know if list was already fired
		fired,

		// Flag to prevent firing
		locked,

		// Actual callback list
		list = [],

		// Queue of execution data for repeatable lists
		queue = [],

		// Index of currently firing callback (modified by add/remove as needed)
		firingIndex = -1,

		// Fire callbacks
		fire = function() {

			// Enforce single-firing
			locked = locked || options.once;

			// Execute callbacks for all pending executions,
			// respecting firingIndex overrides and runtime changes
			fired = firing = true;
			for ( ; queue.length; firingIndex = -1 ) {
				memory = queue.shift();
				while ( ++firingIndex < list.length ) {

					// Run callback and check for early termination
					if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
						options.stopOnFalse ) {

						// Jump to end and forget the data so .add doesn't re-fire
						firingIndex = list.length;
						memory = false;
					}
				}
			}

			// Forget the data if we're done with it
			if ( !options.memory ) {
				memory = false;
			}

			firing = false;

			// Clean up if we're done firing for good
			if ( locked ) {

				// Keep an empty list if we have data for future add calls
				if ( memory ) {
					list = [];

				// Otherwise, this object is spent
				} else {
					list = "";
				}
			}
		},

		// Actual Callbacks object
		self = {

			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {

					// If we have memory from a past run, we should fire after adding
					if ( memory && !firing ) {
						firingIndex = list.length - 1;
						queue.push( memory );
					}

					( function add( args ) {
						jQuery.each( args, function( _, arg ) {
							if ( jQuery.isFunction( arg ) ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && jQuery.type( arg ) !== "string" ) {

								// Inspect recursively
								add( arg );
							}
						} );
					} )( arguments );

					if ( memory && !firing ) {
						fire();
					}
				}
				return this;
			},

			// Remove a callback from the list
			remove: function() {
				jQuery.each( arguments, function( _, arg ) {
					var index;
					while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
						list.splice( index, 1 );

						// Handle firing indexes
						if ( index <= firingIndex ) {
							firingIndex--;
						}
					}
				} );
				return this;
			},

			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ?
					jQuery.inArray( fn, list ) > -1 :
					list.length > 0;
			},

			// Remove all callbacks from the list
			empty: function() {
				if ( list ) {
					list = [];
				}
				return this;
			},

			// Disable .fire and .add
			// Abort any current/pending executions
			// Clear all callbacks and values
			disable: function() {
				locked = queue = [];
				list = memory = "";
				return this;
			},
			disabled: function() {
				return !list;
			},

			// Disable .fire
			// Also disable .add unless we have memory (since it would have no effect)
			// Abort any pending executions
			lock: function() {
				locked = queue = [];
				if ( !memory && !firing ) {
					list = memory = "";
				}
				return this;
			},
			locked: function() {
				return !!locked;
			},

			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( !locked ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					queue.push( args );
					if ( !firing ) {
						fire();
					}
				}
				return this;
			},

			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},

			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};


function Identity( v ) {
	return v;
}
function Thrower( ex ) {
	throw ex;
}

function adoptValue( value, resolve, reject, noValue ) {
	var method;

	try {

		// Check for promise aspect first to privilege synchronous behavior
		if ( value && jQuery.isFunction( ( method = value.promise ) ) ) {
			method.call( value ).done( resolve ).fail( reject );

		// Other thenables
		} else if ( value && jQuery.isFunction( ( method = value.then ) ) ) {
			method.call( value, resolve, reject );

		// Other non-thenables
		} else {

			// Control `resolve` arguments by letting Array#slice cast boolean `noValue` to integer:
			// * false: [ value ].slice( 0 ) => resolve( value )
			// * true: [ value ].slice( 1 ) => resolve()
			resolve.apply( undefined, [ value ].slice( noValue ) );
		}

	// For Promises/A+, convert exceptions into rejections
	// Since jQuery.when doesn't unwrap thenables, we can skip the extra checks appearing in
	// Deferred#then to conditionally suppress rejection.
	} catch ( value ) {

		// Support: Android 4.0 only
		// Strict mode functions invoked without .call/.apply get global-object context
		reject.apply( undefined, [ value ] );
	}
}

jQuery.extend( {

	Deferred: function( func ) {
		var tuples = [

				// action, add listener, callbacks,
				// ... .then handlers, argument index, [final state]
				[ "notify", "progress", jQuery.Callbacks( "memory" ),
					jQuery.Callbacks( "memory" ), 2 ],
				[ "resolve", "done", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 0, "resolved" ],
				[ "reject", "fail", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 1, "rejected" ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				"catch": function( fn ) {
					return promise.then( null, fn );
				},

				// Keep pipe for back-compat
				pipe: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;

					return jQuery.Deferred( function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {

							// Map tuples (progress, done, fail) to arguments (done, fail, progress)
							var fn = jQuery.isFunction( fns[ tuple[ 4 ] ] ) && fns[ tuple[ 4 ] ];

							// deferred.progress(function() { bind to newDefer or newDefer.notify })
							// deferred.done(function() { bind to newDefer or newDefer.resolve })
							// deferred.fail(function() { bind to newDefer or newDefer.reject })
							deferred[ tuple[ 1 ] ]( function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.progress( newDefer.notify )
										.done( newDefer.resolve )
										.fail( newDefer.reject );
								} else {
									newDefer[ tuple[ 0 ] + "With" ](
										this,
										fn ? [ returned ] : arguments
									);
								}
							} );
						} );
						fns = null;
					} ).promise();
				},
				then: function( onFulfilled, onRejected, onProgress ) {
					var maxDepth = 0;
					function resolve( depth, deferred, handler, special ) {
						return function() {
							var that = this,
								args = arguments,
								mightThrow = function() {
									var returned, then;

									// Support: Promises/A+ section 2.3.3.3.3
									// https://promisesaplus.com/#point-59
									// Ignore double-resolution attempts
									if ( depth < maxDepth ) {
										return;
									}

									returned = handler.apply( that, args );

									// Support: Promises/A+ section 2.3.1
									// https://promisesaplus.com/#point-48
									if ( returned === deferred.promise() ) {
										throw new TypeError( "Thenable self-resolution" );
									}

									// Support: Promises/A+ sections 2.3.3.1, 3.5
									// https://promisesaplus.com/#point-54
									// https://promisesaplus.com/#point-75
									// Retrieve `then` only once
									then = returned &&

										// Support: Promises/A+ section 2.3.4
										// https://promisesaplus.com/#point-64
										// Only check objects and functions for thenability
										( typeof returned === "object" ||
											typeof returned === "function" ) &&
										returned.then;

									// Handle a returned thenable
									if ( jQuery.isFunction( then ) ) {

										// Special processors (notify) just wait for resolution
										if ( special ) {
											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special )
											);

										// Normal processors (resolve) also hook into progress
										} else {

											// ...and disregard older resolution values
											maxDepth++;

											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special ),
												resolve( maxDepth, deferred, Identity,
													deferred.notifyWith )
											);
										}

									// Handle all other returned values
									} else {

										// Only substitute handlers pass on context
										// and multiple values (non-spec behavior)
										if ( handler !== Identity ) {
											that = undefined;
											args = [ returned ];
										}

										// Process the value(s)
										// Default process is resolve
										( special || deferred.resolveWith )( that, args );
									}
								},

								// Only normal processors (resolve) catch and reject exceptions
								process = special ?
									mightThrow :
									function() {
										try {
											mightThrow();
										} catch ( e ) {

											if ( jQuery.Deferred.exceptionHook ) {
												jQuery.Deferred.exceptionHook( e,
													process.stackTrace );
											}

											// Support: Promises/A+ section 2.3.3.3.4.1
											// https://promisesaplus.com/#point-61
											// Ignore post-resolution exceptions
											if ( depth + 1 >= maxDepth ) {

												// Only substitute handlers pass on context
												// and multiple values (non-spec behavior)
												if ( handler !== Thrower ) {
													that = undefined;
													args = [ e ];
												}

												deferred.rejectWith( that, args );
											}
										}
									};

							// Support: Promises/A+ section 2.3.3.3.1
							// https://promisesaplus.com/#point-57
							// Re-resolve promises immediately to dodge false rejection from
							// subsequent errors
							if ( depth ) {
								process();
							} else {

								// Call an optional hook to record the stack, in case of exception
								// since it's otherwise lost when execution goes async
								if ( jQuery.Deferred.getStackHook ) {
									process.stackTrace = jQuery.Deferred.getStackHook();
								}
								window.setTimeout( process );
							}
						};
					}

					return jQuery.Deferred( function( newDefer ) {

						// progress_handlers.add( ... )
						tuples[ 0 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								jQuery.isFunction( onProgress ) ?
									onProgress :
									Identity,
								newDefer.notifyWith
							)
						);

						// fulfilled_handlers.add( ... )
						tuples[ 1 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								jQuery.isFunction( onFulfilled ) ?
									onFulfilled :
									Identity
							)
						);

						// rejected_handlers.add( ... )
						tuples[ 2 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								jQuery.isFunction( onRejected ) ?
									onRejected :
									Thrower
							)
						);
					} ).promise();
				},

				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 5 ];

			// promise.progress = list.add
			// promise.done = list.add
			// promise.fail = list.add
			promise[ tuple[ 1 ] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(
					function() {

						// state = "resolved" (i.e., fulfilled)
						// state = "rejected"
						state = stateString;
					},

					// rejected_callbacks.disable
					// fulfilled_callbacks.disable
					tuples[ 3 - i ][ 2 ].disable,

					// progress_callbacks.lock
					tuples[ 0 ][ 2 ].lock
				);
			}

			// progress_handlers.fire
			// fulfilled_handlers.fire
			// rejected_handlers.fire
			list.add( tuple[ 3 ].fire );

			// deferred.notify = function() { deferred.notifyWith(...) }
			// deferred.resolve = function() { deferred.resolveWith(...) }
			// deferred.reject = function() { deferred.rejectWith(...) }
			deferred[ tuple[ 0 ] ] = function() {
				deferred[ tuple[ 0 ] + "With" ]( this === deferred ? undefined : this, arguments );
				return this;
			};

			// deferred.notifyWith = list.fireWith
			// deferred.resolveWith = list.fireWith
			// deferred.rejectWith = list.fireWith
			deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
		} );

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( singleValue ) {
		var

			// count of uncompleted subordinates
			remaining = arguments.length,

			// count of unprocessed arguments
			i = remaining,

			// subordinate fulfillment data
			resolveContexts = Array( i ),
			resolveValues = slice.call( arguments ),

			// the master Deferred
			master = jQuery.Deferred(),

			// subordinate callback factory
			updateFunc = function( i ) {
				return function( value ) {
					resolveContexts[ i ] = this;
					resolveValues[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( !( --remaining ) ) {
						master.resolveWith( resolveContexts, resolveValues );
					}
				};
			};

		// Single- and empty arguments are adopted like Promise.resolve
		if ( remaining <= 1 ) {
			adoptValue( singleValue, master.done( updateFunc( i ) ).resolve, master.reject,
				!remaining );

			// Use .then() to unwrap secondary thenables (cf. gh-3000)
			if ( master.state() === "pending" ||
				jQuery.isFunction( resolveValues[ i ] && resolveValues[ i ].then ) ) {

				return master.then();
			}
		}

		// Multiple arguments are aggregated like Promise.all array elements
		while ( i-- ) {
			adoptValue( resolveValues[ i ], updateFunc( i ), master.reject );
		}

		return master.promise();
	}
} );


// These usually indicate a programmer mistake during development,
// warn about them ASAP rather than swallowing them by default.
var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;

jQuery.Deferred.exceptionHook = function( error, stack ) {

	// Support: IE 8 - 9 only
	// Console exists when dev tools are open, which can happen at any time
	if ( window.console && window.console.warn && error && rerrorNames.test( error.name ) ) {
		window.console.warn( "jQuery.Deferred exception: " + error.message, error.stack, stack );
	}
};




jQuery.readyException = function( error ) {
	window.setTimeout( function() {
		throw error;
	} );
};




// The deferred used on DOM ready
var readyList = jQuery.Deferred();

jQuery.fn.ready = function( fn ) {

	readyList
		.then( fn )

		// Wrap jQuery.readyException in a function so that the lookup
		// happens at the time of error handling instead of callback
		// registration.
		.catch( function( error ) {
			jQuery.readyException( error );
		} );

	return this;
};

jQuery.extend( {

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );
	}
} );

jQuery.ready.then = readyList.then;

// The ready event handler and self cleanup method
function completed() {
	document.removeEventListener( "DOMContentLoaded", completed );
	window.removeEventListener( "load", completed );
	jQuery.ready();
}

// Catch cases where $(document).ready() is called
// after the browser event has already occurred.
// Support: IE <=9 - 10 only
// Older IE sometimes signals "interactive" too soon
if ( document.readyState === "complete" ||
	( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {

	// Handle it asynchronously to allow scripts the opportunity to delay ready
	window.setTimeout( jQuery.ready );

} else {

	// Use the handy event callback
	document.addEventListener( "DOMContentLoaded", completed );

	// A fallback to window.onload, that will always work
	window.addEventListener( "load", completed );
}




// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
		len = elems.length,
		bulk = key == null;

	// Sets many values
	if ( jQuery.type( key ) === "object" ) {
		chainable = true;
		for ( i in key ) {
			access( elems, fn, i, key[ i ], true, emptyGet, raw );
		}

	// Sets one value
	} else if ( value !== undefined ) {
		chainable = true;

		if ( !jQuery.isFunction( value ) ) {
			raw = true;
		}

		if ( bulk ) {

			// Bulk operations run against the entire set
			if ( raw ) {
				fn.call( elems, value );
				fn = null;

			// ...except when executing function values
			} else {
				bulk = fn;
				fn = function( elem, key, value ) {
					return bulk.call( jQuery( elem ), value );
				};
			}
		}

		if ( fn ) {
			for ( ; i < len; i++ ) {
				fn(
					elems[ i ], key, raw ?
					value :
					value.call( elems[ i ], i, fn( elems[ i ], key ) )
				);
			}
		}
	}

	if ( chainable ) {
		return elems;
	}

	// Gets
	if ( bulk ) {
		return fn.call( elems );
	}

	return len ? fn( elems[ 0 ], key ) : emptyGet;
};
var acceptData = function( owner ) {

	// Accepts only:
	//  - Node
	//    - Node.ELEMENT_NODE
	//    - Node.DOCUMENT_NODE
	//  - Object
	//    - Any
	return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
};




function Data() {
	this.expando = jQuery.expando + Data.uid++;
}

Data.uid = 1;

Data.prototype = {

	cache: function( owner ) {

		// Check if the owner object already has a cache
		var value = owner[ this.expando ];

		// If not, create one
		if ( !value ) {
			value = {};

			// We can accept data for non-element nodes in modern browsers,
			// but we should not, see #8335.
			// Always return an empty object.
			if ( acceptData( owner ) ) {

				// If it is a node unlikely to be stringify-ed or looped over
				// use plain assignment
				if ( owner.nodeType ) {
					owner[ this.expando ] = value;

				// Otherwise secure it in a non-enumerable property
				// configurable must be true to allow the property to be
				// deleted when data is removed
				} else {
					Object.defineProperty( owner, this.expando, {
						value: value,
						configurable: true
					} );
				}
			}
		}

		return value;
	},
	set: function( owner, data, value ) {
		var prop,
			cache = this.cache( owner );

		// Handle: [ owner, key, value ] args
		// Always use camelCase key (gh-2257)
		if ( typeof data === "string" ) {
			cache[ jQuery.camelCase( data ) ] = value;

		// Handle: [ owner, { properties } ] args
		} else {

			// Copy the properties one-by-one to the cache object
			for ( prop in data ) {
				cache[ jQuery.camelCase( prop ) ] = data[ prop ];
			}
		}
		return cache;
	},
	get: function( owner, key ) {
		return key === undefined ?
			this.cache( owner ) :

			// Always use camelCase key (gh-2257)
			owner[ this.expando ] && owner[ this.expando ][ jQuery.camelCase( key ) ];
	},
	access: function( owner, key, value ) {

		// In cases where either:
		//
		//   1. No key was specified
		//   2. A string key was specified, but no value provided
		//
		// Take the "read" path and allow the get method to determine
		// which value to return, respectively either:
		//
		//   1. The entire cache object
		//   2. The data stored at the key
		//
		if ( key === undefined ||
				( ( key && typeof key === "string" ) && value === undefined ) ) {

			return this.get( owner, key );
		}

		// When the key is not a string, or both a key and value
		// are specified, set or extend (existing objects) with either:
		//
		//   1. An object of properties
		//   2. A key and value
		//
		this.set( owner, key, value );

		// Since the "set" path can have two possible entry points
		// return the expected data based on which path was taken[*]
		return value !== undefined ? value : key;
	},
	remove: function( owner, key ) {
		var i,
			cache = owner[ this.expando ];

		if ( cache === undefined ) {
			return;
		}

		if ( key !== undefined ) {

			// Support array or space separated string of keys
			if ( Array.isArray( key ) ) {

				// If key is an array of keys...
				// We always set camelCase keys, so remove that.
				key = key.map( jQuery.camelCase );
			} else {
				key = jQuery.camelCase( key );

				// If a key with the spaces exists, use it.
				// Otherwise, create an array by matching non-whitespace
				key = key in cache ?
					[ key ] :
					( key.match( rnothtmlwhite ) || [] );
			}

			i = key.length;

			while ( i-- ) {
				delete cache[ key[ i ] ];
			}
		}

		// Remove the expando if there's no more data
		if ( key === undefined || jQuery.isEmptyObject( cache ) ) {

			// Support: Chrome <=35 - 45
			// Webkit & Blink performance suffers when deleting properties
			// from DOM nodes, so set to undefined instead
			// https://bugs.chromium.org/p/chromium/issues/detail?id=378607 (bug restricted)
			if ( owner.nodeType ) {
				owner[ this.expando ] = undefined;
			} else {
				delete owner[ this.expando ];
			}
		}
	},
	hasData: function( owner ) {
		var cache = owner[ this.expando ];
		return cache !== undefined && !jQuery.isEmptyObject( cache );
	}
};
var dataPriv = new Data();

var dataUser = new Data();



//	Implementation Summary
//
//	1. Enforce API surface and semantic compatibility with 1.9.x branch
//	2. Improve the module's maintainability by reducing the storage
//		paths to a single mechanism.
//	3. Use the same single mechanism to support "private" and "user" data.
//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
//	5. Avoid exposing implementation details on user objects (eg. expando properties)
//	6. Provide a clear path for implementation upgrade to WeakMap in 2014

var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	rmultiDash = /[A-Z]/g;

function getData( data ) {
	if ( data === "true" ) {
		return true;
	}

	if ( data === "false" ) {
		return false;
	}

	if ( data === "null" ) {
		return null;
	}

	// Only convert to a number if it doesn't change the string
	if ( data === +data + "" ) {
		return +data;
	}

	if ( rbrace.test( data ) ) {
		return JSON.parse( data );
	}

	return data;
}

function dataAttr( elem, key, data ) {
	var name;

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {
		name = "data-" + key.replace( rmultiDash, "-$&" ).toLowerCase();
		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = getData( data );
			} catch ( e ) {}

			// Make sure we set the data so it isn't changed later
			dataUser.set( elem, key, data );
		} else {
			data = undefined;
		}
	}
	return data;
}

jQuery.extend( {
	hasData: function( elem ) {
		return dataUser.hasData( elem ) || dataPriv.hasData( elem );
	},

	data: function( elem, name, data ) {
		return dataUser.access( elem, name, data );
	},

	removeData: function( elem, name ) {
		dataUser.remove( elem, name );
	},

	// TODO: Now that all calls to _data and _removeData have been replaced
	// with direct calls to dataPriv methods, these can be deprecated.
	_data: function( elem, name, data ) {
		return dataPriv.access( elem, name, data );
	},

	_removeData: function( elem, name ) {
		dataPriv.remove( elem, name );
	}
} );

jQuery.fn.extend( {
	data: function( key, value ) {
		var i, name, data,
			elem = this[ 0 ],
			attrs = elem && elem.attributes;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = dataUser.get( elem );

				if ( elem.nodeType === 1 && !dataPriv.get( elem, "hasDataAttrs" ) ) {
					i = attrs.length;
					while ( i-- ) {

						// Support: IE 11 only
						// The attrs elements can be null (#14894)
						if ( attrs[ i ] ) {
							name = attrs[ i ].name;
							if ( name.indexOf( "data-" ) === 0 ) {
								name = jQuery.camelCase( name.slice( 5 ) );
								dataAttr( elem, name, data[ name ] );
							}
						}
					}
					dataPriv.set( elem, "hasDataAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each( function() {
				dataUser.set( this, key );
			} );
		}

		return access( this, function( value ) {
			var data;

			// The calling jQuery object (element matches) is not empty
			// (and therefore has an element appears at this[ 0 ]) and the
			// `value` parameter was not undefined. An empty jQuery object
			// will result in `undefined` for elem = this[ 0 ] which will
			// throw an exception if an attempt to read a data cache is made.
			if ( elem && value === undefined ) {

				// Attempt to get data from the cache
				// The key will always be camelCased in Data
				data = dataUser.get( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to "discover" the data in
				// HTML5 custom data-* attrs
				data = dataAttr( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// We tried really hard, but the data doesn't exist.
				return;
			}

			// Set the data...
			this.each( function() {

				// We always store the camelCased key
				dataUser.set( this, key, value );
			} );
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each( function() {
			dataUser.remove( this, key );
		} );
	}
} );


jQuery.extend( {
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = dataPriv.get( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || Array.isArray( data ) ) {
					queue = dataPriv.access( elem, type, jQuery.makeArray( data ) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// Clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// Not public - generate a queueHooks object, or return the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return dataPriv.get( elem, key ) || dataPriv.access( elem, key, {
			empty: jQuery.Callbacks( "once memory" ).add( function() {
				dataPriv.remove( elem, [ type + "queue", key ] );
			} )
		} );
	}
} );

jQuery.fn.extend( {
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[ 0 ], type );
		}

		return data === undefined ?
			this :
			this.each( function() {
				var queue = jQuery.queue( this, type, data );

				// Ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			} );
	},
	dequeue: function( type ) {
		return this.each( function() {
			jQuery.dequeue( this, type );
		} );
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},

	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while ( i-- ) {
			tmp = dataPriv.get( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
} );
var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;

var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );


var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

var isHiddenWithinTree = function( elem, el ) {

		// isHiddenWithinTree might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;

		// Inline style trumps all
		return elem.style.display === "none" ||
			elem.style.display === "" &&

			// Otherwise, check computed style
			// Support: Firefox <=43 - 45
			// Disconnected elements can have computed display: none, so first confirm that elem is
			// in the document.
			jQuery.contains( elem.ownerDocument, elem ) &&

			jQuery.css( elem, "display" ) === "none";
	};

var swap = function( elem, options, callback, args ) {
	var ret, name,
		old = {};

	// Remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.apply( elem, args || [] );

	// Revert the old values
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};




function adjustCSS( elem, prop, valueParts, tween ) {
	var adjusted,
		scale = 1,
		maxIterations = 20,
		currentValue = tween ?
			function() {
				return tween.cur();
			} :
			function() {
				return jQuery.css( elem, prop, "" );
			},
		initial = currentValue(),
		unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

		// Starting value computation is required for potential unit mismatches
		initialInUnit = ( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
			rcssNum.exec( jQuery.css( elem, prop ) );

	if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {

		// Trust units reported by jQuery.css
		unit = unit || initialInUnit[ 3 ];

		// Make sure we update the tween properties later on
		valueParts = valueParts || [];

		// Iteratively approximate from a nonzero starting point
		initialInUnit = +initial || 1;

		do {

			// If previous iteration zeroed out, double until we get *something*.
			// Use string for doubling so we don't accidentally see scale as unchanged below
			scale = scale || ".5";

			// Adjust and apply
			initialInUnit = initialInUnit / scale;
			jQuery.style( elem, prop, initialInUnit + unit );

		// Update scale, tolerating zero or NaN from tween.cur()
		// Break the loop if scale is unchanged or perfect, or if we've just had enough.
		} while (
			scale !== ( scale = currentValue() / initial ) && scale !== 1 && --maxIterations
		);
	}

	if ( valueParts ) {
		initialInUnit = +initialInUnit || +initial || 0;

		// Apply relative offset (+=/-=) if specified
		adjusted = valueParts[ 1 ] ?
			initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
			+valueParts[ 2 ];
		if ( tween ) {
			tween.unit = unit;
			tween.start = initialInUnit;
			tween.end = adjusted;
		}
	}
	return adjusted;
}


var defaultDisplayMap = {};

function getDefaultDisplay( elem ) {
	var temp,
		doc = elem.ownerDocument,
		nodeName = elem.nodeName,
		display = defaultDisplayMap[ nodeName ];

	if ( display ) {
		return display;
	}

	temp = doc.body.appendChild( doc.createElement( nodeName ) );
	display = jQuery.css( temp, "display" );

	temp.parentNode.removeChild( temp );

	if ( display === "none" ) {
		display = "block";
	}
	defaultDisplayMap[ nodeName ] = display;

	return display;
}

function showHide( elements, show ) {
	var display, elem,
		values = [],
		index = 0,
		length = elements.length;

	// Determine new display value for elements that need to change
	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		display = elem.style.display;
		if ( show ) {

			// Since we force visibility upon cascade-hidden elements, an immediate (and slow)
			// check is required in this first loop unless we have a nonempty display value (either
			// inline or about-to-be-restored)
			if ( display === "none" ) {
				values[ index ] = dataPriv.get( elem, "display" ) || null;
				if ( !values[ index ] ) {
					elem.style.display = "";
				}
			}
			if ( elem.style.display === "" && isHiddenWithinTree( elem ) ) {
				values[ index ] = getDefaultDisplay( elem );
			}
		} else {
			if ( display !== "none" ) {
				values[ index ] = "none";

				// Remember what we're overwriting
				dataPriv.set( elem, "display", display );
			}
		}
	}

	// Set the display of the elements in a second loop to avoid constant reflow
	for ( index = 0; index < length; index++ ) {
		if ( values[ index ] != null ) {
			elements[ index ].style.display = values[ index ];
		}
	}

	return elements;
}

jQuery.fn.extend( {
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each( function() {
			if ( isHiddenWithinTree( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		} );
	}
} );
var rcheckableType = ( /^(?:checkbox|radio)$/i );

var rtagName = ( /<([a-z][^\/\0>\x20\t\r\n\f]+)/i );

var rscriptType = ( /^$|\/(?:java|ecma)script/i );



// We have to close these tags to support XHTML (#13200)
var wrapMap = {

	// Support: IE <=9 only
	option: [ 1, "<select multiple='multiple'>", "</select>" ],

	// XHTML parsers do not magically insert elements in the
	// same way that tag soup parsers do. So we cannot shorten
	// this by omitting <tbody> or other required elements.
	thead: [ 1, "<table>", "</table>" ],
	col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
	tr: [ 2, "<table><tbody>", "</tbody></table>" ],
	td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

	_default: [ 0, "", "" ]
};

// Support: IE <=9 only
wrapMap.optgroup = wrapMap.option;

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;


function getAll( context, tag ) {

	// Support: IE <=9 - 11 only
	// Use typeof to avoid zero-argument method invocation on host objects (#15151)
	var ret;

	if ( typeof context.getElementsByTagName !== "undefined" ) {
		ret = context.getElementsByTagName( tag || "*" );

	} else if ( typeof context.querySelectorAll !== "undefined" ) {
		ret = context.querySelectorAll( tag || "*" );

	} else {
		ret = [];
	}

	if ( tag === undefined || tag && nodeName( context, tag ) ) {
		return jQuery.merge( [ context ], ret );
	}

	return ret;
}


// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		dataPriv.set(
			elems[ i ],
			"globalEval",
			!refElements || dataPriv.get( refElements[ i ], "globalEval" )
		);
	}
}


var rhtml = /<|&#?\w+;/;

function buildFragment( elems, context, scripts, selection, ignored ) {
	var elem, tmp, tag, wrap, contains, j,
		fragment = context.createDocumentFragment(),
		nodes = [],
		i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		elem = elems[ i ];

		if ( elem || elem === 0 ) {

			// Add nodes directly
			if ( jQuery.type( elem ) === "object" ) {

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

			// Convert non-html into a text node
			} else if ( !rhtml.test( elem ) ) {
				nodes.push( context.createTextNode( elem ) );

			// Convert html into DOM nodes
			} else {
				tmp = tmp || fragment.appendChild( context.createElement( "div" ) );

				// Deserialize a standard representation
				tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
				wrap = wrapMap[ tag ] || wrapMap._default;
				tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];

				// Descend through wrappers to the right content
				j = wrap[ 0 ];
				while ( j-- ) {
					tmp = tmp.lastChild;
				}

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, tmp.childNodes );

				// Remember the top-level container
				tmp = fragment.firstChild;

				// Ensure the created nodes are orphaned (#12392)
				tmp.textContent = "";
			}
		}
	}

	// Remove wrapper from fragment
	fragment.textContent = "";

	i = 0;
	while ( ( elem = nodes[ i++ ] ) ) {

		// Skip elements already in the context collection (trac-4087)
		if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
			if ( ignored ) {
				ignored.push( elem );
			}
			continue;
		}

		contains = jQuery.contains( elem.ownerDocument, elem );

		// Append to fragment
		tmp = getAll( fragment.appendChild( elem ), "script" );

		// Preserve script evaluation history
		if ( contains ) {
			setGlobalEval( tmp );
		}

		// Capture executables
		if ( scripts ) {
			j = 0;
			while ( ( elem = tmp[ j++ ] ) ) {
				if ( rscriptType.test( elem.type || "" ) ) {
					scripts.push( elem );
				}
			}
		}
	}

	return fragment;
}


( function() {
	var fragment = document.createDocumentFragment(),
		div = fragment.appendChild( document.createElement( "div" ) ),
		input = document.createElement( "input" );

	// Support: Android 4.0 - 4.3 only
	// Check state lost if the name is set (#11217)
	// Support: Windows Web Apps (WWA)
	// `name` and `type` must use .setAttribute for WWA (#14901)
	input.setAttribute( "type", "radio" );
	input.setAttribute( "checked", "checked" );
	input.setAttribute( "name", "t" );

	div.appendChild( input );

	// Support: Android <=4.1 only
	// Older WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE <=11 only
	// Make sure textarea (and checkbox) defaultValue is properly cloned
	div.innerHTML = "<textarea>x</textarea>";
	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;
} )();
var documentElement = document.documentElement;



var
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

// Support: IE <=9 only
// See #13393 for more info
function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

function on( elem, types, selector, data, fn, one ) {
	var origFn, type;

	// Types can be a map of types/handlers
	if ( typeof types === "object" ) {

		// ( types-Object, selector, data )
		if ( typeof selector !== "string" ) {

			// ( types-Object, data )
			data = data || selector;
			selector = undefined;
		}
		for ( type in types ) {
			on( elem, type, selector, data, types[ type ], one );
		}
		return elem;
	}

	if ( data == null && fn == null ) {

		// ( types, fn )
		fn = selector;
		data = selector = undefined;
	} else if ( fn == null ) {
		if ( typeof selector === "string" ) {

			// ( types, selector, fn )
			fn = data;
			data = undefined;
		} else {

			// ( types, data, fn )
			fn = data;
			data = selector;
			selector = undefined;
		}
	}
	if ( fn === false ) {
		fn = returnFalse;
	} else if ( !fn ) {
		return elem;
	}

	if ( one === 1 ) {
		origFn = fn;
		fn = function( event ) {

			// Can use an empty set, since event contains the info
			jQuery().off( event );
			return origFn.apply( this, arguments );
		};

		// Use same guid so caller can remove using origFn
		fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
	}
	return elem.each( function() {
		jQuery.event.add( this, types, fn, data, selector );
	} );
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {

		var handleObjIn, eventHandle, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.get( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Ensure that invalid selectors throw exceptions at attach time
		// Evaluate against documentElement in case elem is a non-element node (e.g., document)
		if ( selector ) {
			jQuery.find.matchesSelector( documentElement, selector );
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !( events = elemData.events ) ) {
			events = elemData.events = {};
		}
		if ( !( eventHandle = elemData.handle ) ) {
			eventHandle = elemData.handle = function( e ) {

				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ?
					jQuery.event.dispatch.apply( elem, arguments ) : undefined;
			};
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend( {
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join( "." )
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !( handlers = events[ type ] ) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener if the special events handler returns false
				if ( !special.setup ||
					special.setup.call( elem, data, namespaces, eventHandle ) === false ) {

					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var j, origCount, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.hasData( elem ) && dataPriv.get( elem );

		if ( !elemData || !( events = elemData.events ) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[ 2 ] &&
				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector ||
						selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown ||
					special.teardown.call( elem, namespaces, elemData.handle ) === false ) {

					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove data and the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			dataPriv.remove( elem, "handle events" );
		}
	},

	dispatch: function( nativeEvent ) {

		// Make a writable jQuery.Event from the native event object
		var event = jQuery.event.fix( nativeEvent );

		var i, j, ret, matched, handleObj, handlerQueue,
			args = new Array( arguments.length ),
			handlers = ( dataPriv.get( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[ 0 ] = event;

		for ( i = 1; i < arguments.length; i++ ) {
			args[ i ] = arguments[ i ];
		}

		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( ( handleObj = matched.handlers[ j++ ] ) &&
				!event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or 2) have namespace(s)
				// a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.rnamespace || event.rnamespace.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
						handleObj.handler ).apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( ( event.result = ret ) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var i, handleObj, sel, matchedHandlers, matchedSelectors,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		if ( delegateCount &&

			// Support: IE <=9
			// Black-hole SVG <use> instance trees (trac-13180)
			cur.nodeType &&

			// Support: Firefox <=42
			// Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
			// https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
			// Support: IE 11 only
			// ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
			!( event.type === "click" && event.button >= 1 ) ) {

			for ( ; cur !== this; cur = cur.parentNode || this ) {

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && !( event.type === "click" && cur.disabled === true ) ) {
					matchedHandlers = [];
					matchedSelectors = {};
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matchedSelectors[ sel ] === undefined ) {
							matchedSelectors[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) > -1 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matchedSelectors[ sel ] ) {
							matchedHandlers.push( handleObj );
						}
					}
					if ( matchedHandlers.length ) {
						handlerQueue.push( { elem: cur, handlers: matchedHandlers } );
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		cur = this;
		if ( delegateCount < handlers.length ) {
			handlerQueue.push( { elem: cur, handlers: handlers.slice( delegateCount ) } );
		}

		return handlerQueue;
	},

	addProp: function( name, hook ) {
		Object.defineProperty( jQuery.Event.prototype, name, {
			enumerable: true,
			configurable: true,

			get: jQuery.isFunction( hook ) ?
				function() {
					if ( this.originalEvent ) {
							return hook( this.originalEvent );
					}
				} :
				function() {
					if ( this.originalEvent ) {
							return this.originalEvent[ name ];
					}
				},

			set: function( value ) {
				Object.defineProperty( this, name, {
					enumerable: true,
					configurable: true,
					writable: true,
					value: value
				} );
			}
		} );
	},

	fix: function( originalEvent ) {
		return originalEvent[ jQuery.expando ] ?
			originalEvent :
			new jQuery.Event( originalEvent );
	},

	special: {
		load: {

			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {

			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					this.focus();
					return false;
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {

			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( this.type === "checkbox" && this.click && nodeName( this, "input" ) ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined && event.originalEvent ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	}
};

jQuery.removeEvent = function( elem, type, handle ) {

	// This "if" is needed for plain objects
	if ( elem.removeEventListener ) {
		elem.removeEventListener( type, handle );
	}
};

jQuery.Event = function( src, props ) {

	// Allow instantiation without the 'new' keyword
	if ( !( this instanceof jQuery.Event ) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undefined &&

				// Support: Android <=2.3 only
				src.returnValue === false ?
			returnTrue :
			returnFalse;

		// Create target properties
		// Support: Safari <=6 - 7 only
		// Target should not be a text node (#504, #13143)
		this.target = ( src.target && src.target.nodeType === 3 ) ?
			src.target.parentNode :
			src.target;

		this.currentTarget = src.currentTarget;
		this.relatedTarget = src.relatedTarget;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// https://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	constructor: jQuery.Event,
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,
	isSimulated: false,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;

		if ( e && !this.isSimulated ) {
			e.preventDefault();
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopPropagation();
		}
	},
	stopImmediatePropagation: function() {
		var e = this.originalEvent;

		this.isImmediatePropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopImmediatePropagation();
		}

		this.stopPropagation();
	}
};

// Includes all common event props including KeyEvent and MouseEvent specific props
jQuery.each( {
	altKey: true,
	bubbles: true,
	cancelable: true,
	changedTouches: true,
	ctrlKey: true,
	detail: true,
	eventPhase: true,
	metaKey: true,
	pageX: true,
	pageY: true,
	shiftKey: true,
	view: true,
	"char": true,
	charCode: true,
	key: true,
	keyCode: true,
	button: true,
	buttons: true,
	clientX: true,
	clientY: true,
	offsetX: true,
	offsetY: true,
	pointerId: true,
	pointerType: true,
	screenX: true,
	screenY: true,
	targetTouches: true,
	toElement: true,
	touches: true,

	which: function( event ) {
		var button = event.button;

		// Add which for key events
		if ( event.which == null && rkeyEvent.test( event.type ) ) {
			return event.charCode != null ? event.charCode : event.keyCode;
		}

		// Add which for click: 1 === left; 2 === middle; 3 === right
		if ( !event.which && button !== undefined && rmouseEvent.test( event.type ) ) {
			if ( button & 1 ) {
				return 1;
			}

			if ( button & 2 ) {
				return 3;
			}

			if ( button & 4 ) {
				return 2;
			}

			return 0;
		}

		return event.which;
	}
}, jQuery.event.addProp );

// Create mouseenter/leave events using mouseover/out and event-time checks
// so that event delegation works in jQuery.
// Do the same for pointerenter/pointerleave and pointerover/pointerout
//
// Support: Safari 7 only
// Safari sends mouseenter too often; see:
// https://bugs.chromium.org/p/chromium/issues/detail?id=470258
// for the description of the bug (it existed in older Chrome versions as well).
jQuery.each( {
	mouseenter: "mouseover",
	mouseleave: "mouseout",
	pointerenter: "pointerover",
	pointerleave: "pointerout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mouseenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
} );

jQuery.fn.extend( {

	on: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn );
	},
	one: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {

			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ?
					handleObj.origType + "." + handleObj.namespace :
					handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {

			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {

			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each( function() {
			jQuery.event.remove( this, types, fn, selector );
		} );
	}
} );


var

	/* eslint-disable max-len */

	// See https://github.com/eslint/eslint/issues/3229
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,

	/* eslint-enable */

	// Support: IE <=10 - 11, Edge 12 - 13
	// In IE/Edge using regex groups here causes severe slowdowns.
	// See https://connect.microsoft.com/IE/feedback/details/1736512/
	rnoInnerhtml = /<script|<style|<link/i,

	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;

// Prefer a tbody over its parent table for containing new rows
function manipulationTarget( elem, content ) {
	if ( nodeName( elem, "table" ) &&
		nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ) {

		return jQuery( ">tbody", elem )[ 0 ] || elem;
	}

	return elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = ( elem.getAttribute( "type" ) !== null ) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );

	if ( match ) {
		elem.type = match[ 1 ];
	} else {
		elem.removeAttribute( "type" );
	}

	return elem;
}

function cloneCopyEvent( src, dest ) {
	var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;

	if ( dest.nodeType !== 1 ) {
		return;
	}

	// 1. Copy private data: events, handlers, etc.
	if ( dataPriv.hasData( src ) ) {
		pdataOld = dataPriv.access( src );
		pdataCur = dataPriv.set( dest, pdataOld );
		events = pdataOld.events;

		if ( events ) {
			delete pdataCur.handle;
			pdataCur.events = {};

			for ( type in events ) {
				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type, events[ type ][ i ] );
				}
			}
		}
	}

	// 2. Copy user data
	if ( dataUser.hasData( src ) ) {
		udataOld = dataUser.access( src );
		udataCur = jQuery.extend( {}, udataOld );

		dataUser.set( dest, udataCur );
	}
}

// Fix IE bugs, see support tests
function fixInput( src, dest ) {
	var nodeName = dest.nodeName.toLowerCase();

	// Fails to persist the checked state of a cloned checkbox or radio button.
	if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
		dest.checked = src.checked;

	// Fails to return the selected option to the default selected state when cloning options
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

function domManip( collection, args, callback, ignored ) {

	// Flatten any nested arrays
	args = concat.apply( [], args );

	var fragment, first, scripts, hasScripts, node, doc,
		i = 0,
		l = collection.length,
		iNoClone = l - 1,
		value = args[ 0 ],
		isFunction = jQuery.isFunction( value );

	// We can't cloneNode fragments that contain checked, in WebKit
	if ( isFunction ||
			( l > 1 && typeof value === "string" &&
				!support.checkClone && rchecked.test( value ) ) ) {
		return collection.each( function( index ) {
			var self = collection.eq( index );
			if ( isFunction ) {
				args[ 0 ] = value.call( this, index, self.html() );
			}
			domManip( self, args, callback, ignored );
		} );
	}

	if ( l ) {
		fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
		first = fragment.firstChild;

		if ( fragment.childNodes.length === 1 ) {
			fragment = first;
		}

		// Require either new content or an interest in ignored elements to invoke the callback
		if ( first || ignored ) {
			scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
			hasScripts = scripts.length;

			// Use the original fragment for the last item
			// instead of the first because it can end up
			// being emptied incorrectly in certain situations (#8070).
			for ( ; i < l; i++ ) {
				node = fragment;

				if ( i !== iNoClone ) {
					node = jQuery.clone( node, true, true );

					// Keep references to cloned scripts for later restoration
					if ( hasScripts ) {

						// Support: Android <=4.0 only, PhantomJS 1 only
						// push.apply(_, arraylike) throws on ancient WebKit
						jQuery.merge( scripts, getAll( node, "script" ) );
					}
				}

				callback.call( collection[ i ], node, i );
			}

			if ( hasScripts ) {
				doc = scripts[ scripts.length - 1 ].ownerDocument;

				// Reenable scripts
				jQuery.map( scripts, restoreScript );

				// Evaluate executable scripts on first document insertion
				for ( i = 0; i < hasScripts; i++ ) {
					node = scripts[ i ];
					if ( rscriptType.test( node.type || "" ) &&
						!dataPriv.access( node, "globalEval" ) &&
						jQuery.contains( doc, node ) ) {

						if ( node.src ) {

							// Optional AJAX dependency, but won't run scripts if not present
							if ( jQuery._evalUrl ) {
								jQuery._evalUrl( node.src );
							}
						} else {
							DOMEval( node.textContent.replace( rcleanScript, "" ), doc );
						}
					}
				}
			}
		}
	}

	return collection;
}

function remove( elem, selector, keepData ) {
	var node,
		nodes = selector ? jQuery.filter( selector, elem ) : elem,
		i = 0;

	for ( ; ( node = nodes[ i ] ) != null; i++ ) {
		if ( !keepData && node.nodeType === 1 ) {
			jQuery.cleanData( getAll( node ) );
		}

		if ( node.parentNode ) {
			if ( keepData && jQuery.contains( node.ownerDocument, node ) ) {
				setGlobalEval( getAll( node, "script" ) );
			}
			node.parentNode.removeChild( node );
		}
	}

	return elem;
}

jQuery.extend( {
	htmlPrefilter: function( html ) {
		return html.replace( rxhtmlTag, "<$1></$2>" );
	},

	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var i, l, srcElements, destElements,
			clone = elem.cloneNode( true ),
			inPage = jQuery.contains( elem.ownerDocument, elem );

		// Fix IE cloning issues
		if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
				!jQuery.isXMLDoc( elem ) ) {

			// We eschew Sizzle here for performance reasons: https://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			for ( i = 0, l = srcElements.length; i < l; i++ ) {
				fixInput( srcElements[ i ], destElements[ i ] );
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					cloneCopyEvent( srcElements[ i ], destElements[ i ] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		// Return the cloned set
		return clone;
	},

	cleanData: function( elems ) {
		var data, elem, type,
			special = jQuery.event.special,
			i = 0;

		for ( ; ( elem = elems[ i ] ) !== undefined; i++ ) {
			if ( acceptData( elem ) ) {
				if ( ( data = elem[ dataPriv.expando ] ) ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataPriv.expando ] = undefined;
				}
				if ( elem[ dataUser.expando ] ) {

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataUser.expando ] = undefined;
				}
			}
		}
	}
} );

jQuery.fn.extend( {
	detach: function( selector ) {
		return remove( this, selector, true );
	},

	remove: function( selector ) {
		return remove( this, selector );
	},

	text: function( value ) {
		return access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().each( function() {
					if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
						this.textContent = value;
					}
				} );
		}, null, value, arguments.length );
	},

	append: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		} );
	},

	prepend: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		} );
	},

	before: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		} );
	},

	after: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		} );
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; ( elem = this[ i ] ) != null; i++ ) {
			if ( elem.nodeType === 1 ) {

				// Prevent memory leaks
				jQuery.cleanData( getAll( elem, false ) );

				// Remove any remaining nodes
				elem.textContent = "";
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function() {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		} );
	},

	html: function( value ) {
		return access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined && elem.nodeType === 1 ) {
				return elem.innerHTML;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

				value = jQuery.htmlPrefilter( value );

				try {
					for ( ; i < l; i++ ) {
						elem = this[ i ] || {};

						// Remove element nodes and prevent memory leaks
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch ( e ) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var ignored = [];

		// Make the changes, replacing each non-ignored context element with the new content
		return domManip( this, arguments, function( elem ) {
			var parent = this.parentNode;

			if ( jQuery.inArray( this, ignored ) < 0 ) {
				jQuery.cleanData( getAll( this ) );
				if ( parent ) {
					parent.replaceChild( elem, this );
				}
			}

		// Force callback invocation
		}, ignored );
	}
} );

jQuery.each( {
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1,
			i = 0;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );

			// Support: Android <=4.0 only, PhantomJS 1 only
			// .get() because push.apply(_, arraylike) throws on ancient WebKit
			push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
} );
var rmargin = ( /^margin/ );

var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

var getStyles = function( elem ) {

		// Support: IE <=11 only, Firefox <=30 (#15098, #14150)
		// IE throws on elements created in popups
		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
		var view = elem.ownerDocument.defaultView;

		if ( !view || !view.opener ) {
			view = window;
		}

		return view.getComputedStyle( elem );
	};



( function() {

	// Executing both pixelPosition & boxSizingReliable tests require only one layout
	// so they're executed at the same time to save the second computation.
	function computeStyleTests() {

		// This is a singleton, we need to execute it only once
		if ( !div ) {
			return;
		}

		div.style.cssText =
			"box-sizing:border-box;" +
			"position:relative;display:block;" +
			"margin:auto;border:1px;padding:1px;" +
			"top:1%;width:50%";
		div.innerHTML = "";
		documentElement.appendChild( container );

		var divStyle = window.getComputedStyle( div );
		pixelPositionVal = divStyle.top !== "1%";

		// Support: Android 4.0 - 4.3 only, Firefox <=3 - 44
		reliableMarginLeftVal = divStyle.marginLeft === "2px";
		boxSizingReliableVal = divStyle.width === "4px";

		// Support: Android 4.0 - 4.3 only
		// Some styles come back with percentage values, even though they shouldn't
		div.style.marginRight = "50%";
		pixelMarginRightVal = divStyle.marginRight === "4px";

		documentElement.removeChild( container );

		// Nullify the div so it wouldn't be stored in the memory and
		// it will also be a sign that checks already performed
		div = null;
	}

	var pixelPositionVal, boxSizingReliableVal, pixelMarginRightVal, reliableMarginLeftVal,
		container = document.createElement( "div" ),
		div = document.createElement( "div" );

	// Finish early in limited (non-browser) environments
	if ( !div.style ) {
		return;
	}

	// Support: IE <=9 - 11 only
	// Style of cloned element affects source element cloned (#8908)
	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	container.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;" +
		"padding:0;margin-top:1px;position:absolute";
	container.appendChild( div );

	jQuery.extend( support, {
		pixelPosition: function() {
			computeStyleTests();
			return pixelPositionVal;
		},
		boxSizingReliable: function() {
			computeStyleTests();
			return boxSizingReliableVal;
		},
		pixelMarginRight: function() {
			computeStyleTests();
			return pixelMarginRightVal;
		},
		reliableMarginLeft: function() {
			computeStyleTests();
			return reliableMarginLeftVal;
		}
	} );
} )();


function curCSS( elem, name, computed ) {
	var width, minWidth, maxWidth, ret,

		// Support: Firefox 51+
		// Retrieving style before computed somehow
		// fixes an issue with getting wrong values
		// on detached elements
		style = elem.style;

	computed = computed || getStyles( elem );

	// getPropertyValue is needed for:
	//   .css('filter') (IE 9 only, #12537)
	//   .css('--customProperty) (#3144)
	if ( computed ) {
		ret = computed.getPropertyValue( name ) || computed[ name ];

		if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
			ret = jQuery.style( elem, name );
		}

		// A tribute to the "awesome hack by Dean Edwards"
		// Android Browser returns percentage for some values,
		// but width seems to be reliably pixels.
		// This is against the CSSOM draft spec:
		// https://drafts.csswg.org/cssom/#resolved-values
		if ( !support.pixelMarginRight() && rnumnonpx.test( ret ) && rmargin.test( name ) ) {

			// Remember the original values
			width = style.width;
			minWidth = style.minWidth;
			maxWidth = style.maxWidth;

			// Put in the new values to get a computed value out
			style.minWidth = style.maxWidth = style.width = ret;
			ret = computed.width;

			// Revert the changed values
			style.width = width;
			style.minWidth = minWidth;
			style.maxWidth = maxWidth;
		}
	}

	return ret !== undefined ?

		// Support: IE <=9 - 11 only
		// IE returns zIndex value as an integer.
		ret + "" :
		ret;
}


function addGetHookIf( conditionFn, hookFn ) {

	// Define the hook, we'll check on the first run if it's really needed.
	return {
		get: function() {
			if ( conditionFn() ) {

				// Hook not needed (or it's not possible to use it due
				// to missing dependency), remove it.
				delete this.get;
				return;
			}

			// Hook needed; redefine it so that the support test is not executed again.
			return ( this.get = hookFn ).apply( this, arguments );
		}
	};
}


var

	// Swappable if display is none or starts with table
	// except "table", "table-cell", or "table-caption"
	// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rcustomProp = /^--/,
	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	},

	cssPrefixes = [ "Webkit", "Moz", "ms" ],
	emptyStyle = document.createElement( "div" ).style;

// Return a css property mapped to a potentially vendor prefixed property
function vendorPropName( name ) {

	// Shortcut for names that are not vendor prefixed
	if ( name in emptyStyle ) {
		return name;
	}

	// Check for vendor prefixed names
	var capName = name[ 0 ].toUpperCase() + name.slice( 1 ),
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in emptyStyle ) {
			return name;
		}
	}
}

// Return a property mapped along what jQuery.cssProps suggests or to
// a vendor prefixed property.
function finalPropName( name ) {
	var ret = jQuery.cssProps[ name ];
	if ( !ret ) {
		ret = jQuery.cssProps[ name ] = vendorPropName( name ) || name;
	}
	return ret;
}

function setPositiveNumber( elem, value, subtract ) {

	// Any relative (+/-) values have already been
	// normalized at this point
	var matches = rcssNum.exec( value );
	return matches ?

		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 2 ] - ( subtract || 0 ) ) + ( matches[ 3 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i,
		val = 0;

	// If we already have the right measurement, avoid augmentation
	if ( extra === ( isBorderBox ? "border" : "content" ) ) {
		i = 4;

	// Otherwise initialize for horizontal or vertical properties
	} else {
		i = name === "width" ? 1 : 0;
	}

	for ( ; i < 4; i += 2 ) {

		// Both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {

			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// At this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {

			// At this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// At this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with computed style
	var valueIsBorderBox,
		styles = getStyles( elem ),
		val = curCSS( elem, name, styles ),
		isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// Computed unit is not pixels. Stop here and return.
	if ( rnumnonpx.test( val ) ) {
		return val;
	}

	// Check for style in case a browser which returns unreliable values
	// for getComputedStyle silently falls back to the reliable elem.style
	valueIsBorderBox = isBorderBox &&
		( support.boxSizingReliable() || val === elem.style[ name ] );

	// Fall back to offsetWidth/Height when value is "auto"
	// This happens for inline elements with no explicit setting (gh-3571)
	if ( val === "auto" ) {
		val = elem[ "offset" + name[ 0 ].toUpperCase() + name.slice( 1 ) ];
	}

	// Normalize "", auto, and prepare for extra
	val = parseFloat( val ) || 0;

	// Use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

jQuery.extend( {

	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {

					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"animationIterationCount": true,
		"columnCount": true,
		"fillOpacity": true,
		"flexGrow": true,
		"flexShrink": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		"float": "cssFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {

		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			isCustomProp = rcustomProp.test( name ),
			style = elem.style;

		// Make sure that we're working with the right name. We don't
		// want to query the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Gets hook for the prefixed version, then unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// Convert "+=" or "-=" to relative numbers (#7345)
			if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
				value = adjustCSS( elem, name, ret );

				// Fixes bug #9237
				type = "number";
			}

			// Make sure that null and NaN values aren't set (#7116)
			if ( value == null || value !== value ) {
				return;
			}

			// If a number was passed in, add the unit (except for certain CSS properties)
			if ( type === "number" ) {
				value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
			}

			// background-* props affect original clone's values
			if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !( "set" in hooks ) ||
				( value = hooks.set( elem, value, extra ) ) !== undefined ) {

				if ( isCustomProp ) {
					style.setProperty( name, value );
				} else {
					style[ name ] = value;
				}
			}

		} else {

			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks &&
				( ret = hooks.get( elem, false, extra ) ) !== undefined ) {

				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var val, num, hooks,
			origName = jQuery.camelCase( name ),
			isCustomProp = rcustomProp.test( name );

		// Make sure that we're working with the right name. We don't
		// want to modify the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Try prefixed name followed by the unprefixed name
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		// Convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Make numeric if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || isFinite( num ) ? num || 0 : val;
		}

		return val;
	}
} );

jQuery.each( [ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {

				// Certain elements can have dimension info if we invisibly show them
				// but it must have a current display style that would benefit
				return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&

					// Support: Safari 8+
					// Table columns in Safari have non-zero offsetWidth & zero
					// getBoundingClientRect().width unless display is changed.
					// Support: IE <=11 only
					// Running getBoundingClientRect on a disconnected node
					// in IE throws an error.
					( !elem.getClientRects().length || !elem.getBoundingClientRect().width ) ?
						swap( elem, cssShow, function() {
							return getWidthOrHeight( elem, name, extra );
						} ) :
						getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var matches,
				styles = extra && getStyles( elem ),
				subtract = extra && augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				);

			// Convert to pixels if value adjustment is needed
			if ( subtract && ( matches = rcssNum.exec( value ) ) &&
				( matches[ 3 ] || "px" ) !== "px" ) {

				elem.style[ name ] = value;
				value = jQuery.css( elem, name );
			}

			return setPositiveNumber( elem, value, subtract );
		}
	};
} );

jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
	function( elem, computed ) {
		if ( computed ) {
			return ( parseFloat( curCSS( elem, "marginLeft" ) ) ||
				elem.getBoundingClientRect().left -
					swap( elem, { marginLeft: 0 }, function() {
						return elem.getBoundingClientRect().left;
					} )
				) + "px";
		}
	}
);

// These hooks are used by animate to expand properties
jQuery.each( {
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// Assumes a single number if not a string
				parts = typeof value === "string" ? value.split( " " ) : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
} );

jQuery.fn.extend( {
	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( Array.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	}
} );


function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || jQuery.easing._default;
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			// Use a property on the element directly when it is not a DOM element,
			// or when there is no matching style property that exists.
			if ( tween.elem.nodeType !== 1 ||
				tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
				return tween.elem[ tween.prop ];
			}

			// Passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails.
			// Simple values such as "10px" are parsed to Float;
			// complex values such as "rotate(1rad)" are returned as-is.
			result = jQuery.css( tween.elem, tween.prop, "" );

			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {

			// Use step hook for back compat.
			// Use cssHook if its there.
			// Use .style if available and use plain properties where available.
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.nodeType === 1 &&
				( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null ||
					jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9 only
// Panic based approach to setting things on disconnected nodes
Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p * Math.PI ) / 2;
	},
	_default: "swing"
};

jQuery.fx = Tween.prototype.init;

// Back compat <1.8 extension point
jQuery.fx.step = {};




var
	fxNow, inProgress,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rrun = /queueHooks$/;

function schedule() {
	if ( inProgress ) {
		if ( document.hidden === false && window.requestAnimationFrame ) {
			window.requestAnimationFrame( schedule );
		} else {
			window.setTimeout( schedule, jQuery.fx.interval );
		}

		jQuery.fx.tick();
	}
}

// Animations created synchronously will run synchronously
function createFxNow() {
	window.setTimeout( function() {
		fxNow = undefined;
	} );
	return ( fxNow = jQuery.now() );
}

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		i = 0,
		attrs = { height: type };

	// If we include width, step value is 1 to do all cssExpand values,
	// otherwise step value is 2 to skip over Left and Right
	includeWidth = includeWidth ? 1 : 0;
	for ( ; i < 4; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {

			// We're done with this property
			return tween;
		}
	}
}

function defaultPrefilter( elem, props, opts ) {
	var prop, value, toggle, hooks, oldfire, propTween, restoreDisplay, display,
		isBox = "width" in props || "height" in props,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHiddenWithinTree( elem ),
		dataShow = dataPriv.get( elem, "fxshow" );

	// Queue-skipping animations hijack the fx hooks
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always( function() {

			// Ensure the complete handler is called before this completes
			anim.always( function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			} );
		} );
	}

	// Detect show/hide animations
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.test( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// Pretend to be hidden if this is a "show" and
				// there is still data from a stopped show/hide
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;

				// Ignore all other no-op show/hide data
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	// Bail out if this is a no-op like .hide().hide()
	propTween = !jQuery.isEmptyObject( props );
	if ( !propTween && jQuery.isEmptyObject( orig ) ) {
		return;
	}

	// Restrict "overflow" and "display" styles during box animations
	if ( isBox && elem.nodeType === 1 ) {

		// Support: IE <=9 - 11, Edge 12 - 13
		// Record all 3 overflow attributes because IE does not infer the shorthand
		// from identically-valued overflowX and overflowY
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Identify a display type, preferring old show/hide data over the CSS cascade
		restoreDisplay = dataShow && dataShow.display;
		if ( restoreDisplay == null ) {
			restoreDisplay = dataPriv.get( elem, "display" );
		}
		display = jQuery.css( elem, "display" );
		if ( display === "none" ) {
			if ( restoreDisplay ) {
				display = restoreDisplay;
			} else {

				// Get nonempty value(s) by temporarily forcing visibility
				showHide( [ elem ], true );
				restoreDisplay = elem.style.display || restoreDisplay;
				display = jQuery.css( elem, "display" );
				showHide( [ elem ] );
			}
		}

		// Animate inline elements as inline-block
		if ( display === "inline" || display === "inline-block" && restoreDisplay != null ) {
			if ( jQuery.css( elem, "float" ) === "none" ) {

				// Restore the original display value at the end of pure show/hide animations
				if ( !propTween ) {
					anim.done( function() {
						style.display = restoreDisplay;
					} );
					if ( restoreDisplay == null ) {
						display = style.display;
						restoreDisplay = display === "none" ? "" : display;
					}
				}
				style.display = "inline-block";
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		anim.always( function() {
			style.overflow = opts.overflow[ 0 ];
			style.overflowX = opts.overflow[ 1 ];
			style.overflowY = opts.overflow[ 2 ];
		} );
	}

	// Implement show/hide animations
	propTween = false;
	for ( prop in orig ) {

		// General show/hide setup for this element animation
		if ( !propTween ) {
			if ( dataShow ) {
				if ( "hidden" in dataShow ) {
					hidden = dataShow.hidden;
				}
			} else {
				dataShow = dataPriv.access( elem, "fxshow", { display: restoreDisplay } );
			}

			// Store hidden/visible for toggle so `.stop().toggle()` "reverses"
			if ( toggle ) {
				dataShow.hidden = !hidden;
			}

			// Show elements before animating them
			if ( hidden ) {
				showHide( [ elem ], true );
			}

			/* eslint-disable no-loop-func */

			anim.done( function() {

			/* eslint-enable no-loop-func */

				// The final step of a "hide" animation is actually hiding the element
				if ( !hidden ) {
					showHide( [ elem ] );
				}
				dataPriv.remove( elem, "fxshow" );
				for ( prop in orig ) {
					jQuery.style( elem, prop, orig[ prop ] );
				}
			} );
		}

		// Per-property setup
		propTween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );
		if ( !( prop in dataShow ) ) {
			dataShow[ prop ] = propTween.start;
			if ( hidden ) {
				propTween.end = propTween.start;
				propTween.start = 0;
			}
		}
	}
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( Array.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// Not quite $.extend, this won't overwrite existing keys.
			// Reusing 'index' because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = Animation.prefilters.length,
		deferred = jQuery.Deferred().always( function() {

			// Don't match elem in the :animated selector
			delete tick.elem;
		} ),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),

				// Support: Android 2.3 only
				// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ] );

			// If there's more to do, yield
			if ( percent < 1 && length ) {
				return remaining;
			}

			// If this was an empty animation, synthesize a final progress notification
			if ( !length ) {
				deferred.notifyWith( elem, [ animation, 1, 0 ] );
			}

			// Resolve the animation and report its conclusion
			deferred.resolveWith( elem, [ animation ] );
			return false;
		},
		animation = deferred.promise( {
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, {
				specialEasing: {},
				easing: jQuery.easing._default
			}, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,

					// If we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// Resolve when we played the last frame; otherwise, reject
				if ( gotoEnd ) {
					deferred.notifyWith( elem, [ animation, 1, 0 ] );
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		} ),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length; index++ ) {
		result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			if ( jQuery.isFunction( result.stop ) ) {
				jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
					jQuery.proxy( result.stop, result );
			}
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	// Attach callbacks from options
	animation
		.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		} )
	);

	return animation;
}

jQuery.Animation = jQuery.extend( Animation, {

	tweeners: {
		"*": [ function( prop, value ) {
			var tween = this.createTween( prop, value );
			adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
			return tween;
		} ]
	},

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.match( rnothtmlwhite );
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length; index++ ) {
			prop = props[ index ];
			Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];
			Animation.tweeners[ prop ].unshift( callback );
		}
	},

	prefilters: [ defaultPrefilter ],

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			Animation.prefilters.unshift( callback );
		} else {
			Animation.prefilters.push( callback );
		}
	}
} );

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	// Go to the end state if fx are off
	if ( jQuery.fx.off ) {
		opt.duration = 0;

	} else {
		if ( typeof opt.duration !== "number" ) {
			if ( opt.duration in jQuery.fx.speeds ) {
				opt.duration = jQuery.fx.speeds[ opt.duration ];

			} else {
				opt.duration = jQuery.fx.speeds._default;
			}
		}
	}

	// Normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.fn.extend( {
	fadeTo: function( speed, to, easing, callback ) {

		// Show any hidden elements after setting opacity to 0
		return this.filter( isHiddenWithinTree ).css( "opacity", 0 ).show()

			// Animate to the value specified
			.end().animate( { opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {

				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || dataPriv.get( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each( function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = dataPriv.get( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this &&
					( type == null || timers[ index ].queue === type ) ) {

					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// Start the next in the queue if the last step wasn't forced.
			// Timers currently will call their complete callbacks, which
			// will dequeue but only if they were gotoEnd.
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		} );
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each( function() {
			var index,
				data = dataPriv.get( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// Enable finishing flag on private data
			data.finish = true;

			// Empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// Look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// Look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// Turn off finishing flag
			delete data.finish;
		} );
	}
} );

jQuery.each( [ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
} );

// Generate shortcuts for custom animations
jQuery.each( {
	slideDown: genFx( "show" ),
	slideUp: genFx( "hide" ),
	slideToggle: genFx( "toggle" ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
} );

jQuery.timers = [];
jQuery.fx.tick = function() {
	var timer,
		i = 0,
		timers = jQuery.timers;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];

		// Run the timer and safely remove it when done (allowing for external removal)
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	jQuery.timers.push( timer );
	jQuery.fx.start();
};

jQuery.fx.interval = 13;
jQuery.fx.start = function() {
	if ( inProgress ) {
		return;
	}

	inProgress = true;
	schedule();
};

jQuery.fx.stop = function() {
	inProgress = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,

	// Default speed
	_default: 400
};


// Based off of the plugin by Clint Helfers, with permission.
// https://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
jQuery.fn.delay = function( time, type ) {
	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
	type = type || "fx";

	return this.queue( type, function( next, hooks ) {
		var timeout = window.setTimeout( next, time );
		hooks.stop = function() {
			window.clearTimeout( timeout );
		};
	} );
};


( function() {
	var input = document.createElement( "input" ),
		select = document.createElement( "select" ),
		opt = select.appendChild( document.createElement( "option" ) );

	input.type = "checkbox";

	// Support: Android <=4.3 only
	// Default value for a checkbox should be "on"
	support.checkOn = input.value !== "";

	// Support: IE <=11 only
	// Must access selectedIndex to make default options select
	support.optSelected = opt.selected;

	// Support: IE <=11 only
	// An input loses its value after becoming a radio
	input = document.createElement( "input" );
	input.value = "t";
	input.type = "radio";
	support.radioValue = input.value === "t";
} )();


var boolHook,
	attrHandle = jQuery.expr.attrHandle;

jQuery.fn.extend( {
	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each( function() {
			jQuery.removeAttr( this, name );
		} );
	}
} );

jQuery.extend( {
	attr: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set attributes on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		// Attribute hooks are determined by the lowercase version
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			hooks = jQuery.attrHooks[ name.toLowerCase() ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : undefined );
		}

		if ( value !== undefined ) {
			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;
			}

			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			elem.setAttribute( name, value + "" );
			return value;
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		ret = jQuery.find.attr( elem, name );

		// Non-existent attributes return null, we normalize to undefined
		return ret == null ? undefined : ret;
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !support.radioValue && value === "radio" &&
					nodeName( elem, "input" ) ) {
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	removeAttr: function( elem, value ) {
		var name,
			i = 0,

			// Attribute names can contain non-HTML whitespace characters
			// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
			attrNames = value && value.match( rnothtmlwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( ( name = attrNames[ i++ ] ) ) {
				elem.removeAttribute( name );
			}
		}
	}
} );

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {

			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			elem.setAttribute( name, name );
		}
		return name;
	}
};

jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = attrHandle[ name ] || jQuery.find.attr;

	attrHandle[ name ] = function( elem, name, isXML ) {
		var ret, handle,
			lowercaseName = name.toLowerCase();

		if ( !isXML ) {

			// Avoid an infinite loop by temporarily removing this function from the getter
			handle = attrHandle[ lowercaseName ];
			attrHandle[ lowercaseName ] = ret;
			ret = getter( elem, name, isXML ) != null ?
				lowercaseName :
				null;
			attrHandle[ lowercaseName ] = handle;
		}
		return ret;
	};
} );




var rfocusable = /^(?:input|select|textarea|button)$/i,
	rclickable = /^(?:a|area)$/i;

jQuery.fn.extend( {
	prop: function( name, value ) {
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		return this.each( function() {
			delete this[ jQuery.propFix[ name ] || name ];
		} );
	}
} );

jQuery.extend( {
	prop: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set properties on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {

			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			return ( elem[ name ] = value );
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		return elem[ name ];
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {

				// Support: IE <=9 - 11 only
				// elem.tabIndex doesn't always return the
				// correct value when it hasn't been explicitly set
				// https://web.archive.org/web/20141116233347/http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				if ( tabindex ) {
					return parseInt( tabindex, 10 );
				}

				if (
					rfocusable.test( elem.nodeName ) ||
					rclickable.test( elem.nodeName ) &&
					elem.href
				) {
					return 0;
				}

				return -1;
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	}
} );

// Support: IE <=11 only
// Accessing the selectedIndex property
// forces the browser to respect setting selected
// on the option
// The getter ensures a default option is selected
// when in an optgroup
// eslint rule "no-unused-expressions" is disabled for this code
// since it considers such accessions noop
if ( !support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent && parent.parentNode ) {
				parent.parentNode.selectedIndex;
			}
			return null;
		},
		set: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent ) {
				parent.selectedIndex;

				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
		}
	};
}

jQuery.each( [
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
} );




	// Strip and collapse whitespace according to HTML spec
	// https://html.spec.whatwg.org/multipage/infrastructure.html#strip-and-collapse-whitespace
	function stripAndCollapse( value ) {
		var tokens = value.match( rnothtmlwhite ) || [];
		return tokens.join( " " );
	}


function getClass( elem ) {
	return elem.getAttribute && elem.getAttribute( "class" ) || "";
}

jQuery.fn.extend( {
	addClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( typeof value === "string" && value ) {
			classes = value.match( rnothtmlwhite ) || [];

			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );
				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( !arguments.length ) {
			return this.attr( "class", "" );
		}

		if ( typeof value === "string" && value ) {
			classes = value.match( rnothtmlwhite ) || [];

			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );

				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {

						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) > -1 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( i ) {
				jQuery( this ).toggleClass(
					value.call( this, i, getClass( this ), stateVal ),
					stateVal
				);
			} );
		}

		return this.each( function() {
			var className, i, self, classNames;

			if ( type === "string" ) {

				// Toggle individual class names
				i = 0;
				self = jQuery( this );
				classNames = value.match( rnothtmlwhite ) || [];

				while ( ( className = classNames[ i++ ] ) ) {

					// Check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( value === undefined || type === "boolean" ) {
				className = getClass( this );
				if ( className ) {

					// Store className if set
					dataPriv.set( this, "__className__", className );
				}

				// If the element has a class name or if we're passed `false`,
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				if ( this.setAttribute ) {
					this.setAttribute( "class",
						className || value === false ?
						"" :
						dataPriv.get( this, "__className__" ) || ""
					);
				}
			}
		} );
	},

	hasClass: function( selector ) {
		var className, elem,
			i = 0;

		className = " " + selector + " ";
		while ( ( elem = this[ i++ ] ) ) {
			if ( elem.nodeType === 1 &&
				( " " + stripAndCollapse( getClass( elem ) ) + " " ).indexOf( className ) > -1 ) {
					return true;
			}
		}

		return false;
	}
} );




var rreturn = /\r/g;

jQuery.fn.extend( {
	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[ 0 ];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] ||
					jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks &&
					"get" in hooks &&
					( ret = hooks.get( elem, "value" ) ) !== undefined
				) {
					return ret;
				}

				ret = elem.value;

				// Handle most common string cases
				if ( typeof ret === "string" ) {
					return ret.replace( rreturn, "" );
				}

				// Handle cases where value is null/undef or number
				return ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each( function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";

			} else if ( typeof val === "number" ) {
				val += "";

			} else if ( Array.isArray( val ) ) {
				val = jQuery.map( val, function( value ) {
					return value == null ? "" : value + "";
				} );
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		} );
	}
} );

jQuery.extend( {
	valHooks: {
		option: {
			get: function( elem ) {

				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :

					// Support: IE <=10 - 11 only
					// option.text throws exceptions (#14686, #14858)
					// Strip and collapse whitespace
					// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
					stripAndCollapse( jQuery.text( elem ) );
			}
		},
		select: {
			get: function( elem ) {
				var value, option, i,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one",
					values = one ? null : [],
					max = one ? index + 1 : options.length;

				if ( index < 0 ) {
					i = max;

				} else {
					i = one ? index : 0;
				}

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// Support: IE <=9 only
					// IE8-9 doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&

							// Don't return options that are disabled or in a disabled optgroup
							!option.disabled &&
							( !option.parentNode.disabled ||
								!nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];

					/* eslint-disable no-cond-assign */

					if ( option.selected =
						jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1
					) {
						optionSet = true;
					}

					/* eslint-enable no-cond-assign */
				}

				// Force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	}
} );

// Radios and checkboxes getter/setter
jQuery.each( [ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( Array.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
			}
		}
	};
	if ( !support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			return elem.getAttribute( "value" ) === null ? "on" : elem.value;
		};
	}
} );




// Return jQuery for attributes-only inclusion


var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/;

jQuery.extend( jQuery.event, {

	trigger: function( event, data, elem, onlyHandlers ) {

		var i, cur, tmp, bubbleType, ontype, handle, special,
			eventPath = [ elem || document ],
			type = hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "." ) > -1 ) {

			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split( "." );
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf( ":" ) < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join( "." );
		event.rnamespace = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === ( elem.ownerDocument || document ) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( dataPriv.get( cur, "events" ) || {} )[ event.type ] &&
				dataPriv.get( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && handle.apply && acceptData( cur ) ) {
				event.result = handle.apply( cur, data );
				if ( event.result === false ) {
					event.preventDefault();
				}
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( ( !special._default ||
				special._default.apply( eventPath.pop(), data ) === false ) &&
				acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name as the event.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && jQuery.isFunction( elem[ type ] ) && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					elem[ type ]();
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	// Piggyback on a donor event to simulate a different one
	// Used only for `focus(in | out)` events
	simulate: function( type, elem, event ) {
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true
			}
		);

		jQuery.event.trigger( e, null, elem );
	}

} );

jQuery.fn.extend( {

	trigger: function( type, data ) {
		return this.each( function() {
			jQuery.event.trigger( type, data, this );
		} );
	},
	triggerHandler: function( type, data ) {
		var elem = this[ 0 ];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
} );


jQuery.each( ( "blur focus focusin focusout resize scroll click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup contextmenu" ).split( " " ),
	function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
} );

jQuery.fn.extend( {
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
} );




support.focusin = "onfocusin" in window;


// Support: Firefox <=44
// Firefox doesn't have focus(in | out) events
// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
//
// Support: Chrome <=48 - 49, Safari <=9.0 - 9.1
// focus(in | out) events fire after focus & blur events,
// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
// Related ticket - https://bugs.chromium.org/p/chromium/issues/detail?id=449857
if ( !support.focusin ) {
	jQuery.each( { focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler on the document while someone wants focusin/focusout
		var handler = function( event ) {
			jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ) );
		};

		jQuery.event.special[ fix ] = {
			setup: function() {
				var doc = this.ownerDocument || this,
					attaches = dataPriv.access( doc, fix );

				if ( !attaches ) {
					doc.addEventListener( orig, handler, true );
				}
				dataPriv.access( doc, fix, ( attaches || 0 ) + 1 );
			},
			teardown: function() {
				var doc = this.ownerDocument || this,
					attaches = dataPriv.access( doc, fix ) - 1;

				if ( !attaches ) {
					doc.removeEventListener( orig, handler, true );
					dataPriv.remove( doc, fix );

				} else {
					dataPriv.access( doc, fix, attaches );
				}
			}
		};
	} );
}
var location = window.location;

var nonce = jQuery.now();

var rquery = ( /\?/ );



// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
	var xml;
	if ( !data || typeof data !== "string" ) {
		return null;
	}

	// Support: IE 9 - 11 only
	// IE throws on parseFromString with invalid input.
	try {
		xml = ( new window.DOMParser() ).parseFromString( data, "text/xml" );
	} catch ( e ) {
		xml = undefined;
	}

	if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
		jQuery.error( "Invalid XML: " + data );
	}
	return xml;
};


var
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( Array.isArray( obj ) ) {

		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {

				// Treat each array item as a scalar.
				add( prefix, v );

			} else {

				// Item is non-scalar (array or object), encode its numeric index.
				buildParams(
					prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
					v,
					traditional,
					add
				);
			}
		} );

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {

		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {

		// Serialize scalar item.
		add( prefix, obj );
	}
}

// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, valueOrFunction ) {

			// If value is a function, invoke it and use its return value
			var value = jQuery.isFunction( valueOrFunction ) ?
				valueOrFunction() :
				valueOrFunction;

			s[ s.length ] = encodeURIComponent( key ) + "=" +
				encodeURIComponent( value == null ? "" : value );
		};

	// If an array was passed in, assume that it is an array of form elements.
	if ( Array.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {

		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		} );

	} else {

		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" );
};

jQuery.fn.extend( {
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map( function() {

			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		} )
		.filter( function() {
			var type = this.type;

			// Use .is( ":disabled" ) so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		} )
		.map( function( i, elem ) {
			var val = jQuery( this ).val();

			if ( val == null ) {
				return null;
			}

			if ( Array.isArray( val ) ) {
				return jQuery.map( val, function( val ) {
					return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
				} );
			}

			return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		} ).get();
	}
} );


var
	r20 = /%20/g,
	rhash = /#.*$/,
	rantiCache = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,

	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat( "*" ),

	// Anchor tag for parsing the document origin
	originAnchor = document.createElement( "a" );
	originAnchor.href = location.href;

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( rnothtmlwhite ) || [];

		if ( jQuery.isFunction( func ) ) {

			// For each dataType in the dataTypeExpression
			while ( ( dataType = dataTypes[ i++ ] ) ) {

				// Prepend if requested
				if ( dataType[ 0 ] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );

				// Otherwise append
				} else {
					( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if ( typeof dataTypeOrTransport === "string" &&
				!seekingTransport && !inspected[ dataTypeOrTransport ] ) {

				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		} );
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var ct, type, finalDataType, firstDataType,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while ( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {

		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}

		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},

		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {

								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s.throws ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return {
								state: "parsererror",
								error: conv ? e : "No conversion from " + prev + " to " + current
							};
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}

jQuery.extend( {

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: location.href,
		type: "GET",
		isLocal: rlocalProtocol.test( location.protocol ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",

		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /\bxml\b/,
			html: /\bhtml/,
			json: /\bjson\b/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": JSON.parse,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var transport,

			// URL without anti-cache param
			cacheURL,

			// Response headers
			responseHeadersString,
			responseHeaders,

			// timeout handle
			timeoutTimer,

			// Url cleanup var
			urlAnchor,

			// Request state (becomes false upon send and true upon completion)
			completed,

			// To know if global events are to be dispatched
			fireGlobals,

			// Loop variable
			i,

			// uncached part of the url
			uncached,

			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),

			// Callbacks context
			callbackContext = s.context || s,

			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context &&
				( callbackContext.nodeType || callbackContext.jquery ) ?
					jQuery( callbackContext ) :
					jQuery.event,

			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),

			// Status-dependent callbacks
			statusCode = s.statusCode || {},

			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},

			// Default abort message
			strAbort = "canceled",

			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( completed ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[ 1 ].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return completed ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					if ( completed == null ) {
						name = requestHeadersNames[ name.toLowerCase() ] =
							requestHeadersNames[ name.toLowerCase() ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( completed == null ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( completed ) {

							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						} else {

							// Lazy-add the new callbacks in a way that preserves old ones
							for ( code in map ) {
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR );

		// Add protocol if not provided (prefilters might expect it)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || location.href ) + "" )
			.replace( rprotocol, location.protocol + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = ( s.dataType || "*" ).toLowerCase().match( rnothtmlwhite ) || [ "" ];

		// A cross-domain request is in order when the origin doesn't match the current origin.
		if ( s.crossDomain == null ) {
			urlAnchor = document.createElement( "a" );

			// Support: IE <=8 - 11, Edge 12 - 13
			// IE throws exception on accessing the href property if url is malformed,
			// e.g. http://example.com:80x/
			try {
				urlAnchor.href = s.url;

				// Support: IE <=8 - 11 only
				// Anchor's host property isn't correctly set when s.url is relative
				urlAnchor.href = urlAnchor.href;
				s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !==
					urlAnchor.protocol + "//" + urlAnchor.host;
			} catch ( e ) {

				// If there is an error parsing the URL, assume it is crossDomain,
				// it can be rejected by the transport if it is invalid
				s.crossDomain = true;
			}
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( completed ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
		fireGlobals = jQuery.event && s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		// Remove hash to simplify url manipulation
		cacheURL = s.url.replace( rhash, "" );

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// Remember the hash so we can put it back
			uncached = s.url.slice( cacheURL.length );

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data;

				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add or update anti-cache param if needed
			if ( s.cache === false ) {
				cacheURL = cacheURL.replace( rantiCache, "$1" );
				uncached = ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ( nonce++ ) + uncached;
			}

			// Put hash and anti-cache on the URL that will be requested (gh-1732)
			s.url = cacheURL + uncached;

		// Change '%20' to '+' if this is encoded form body content (gh-2658)
		} else if ( s.data && s.processData &&
			( s.contentType || "" ).indexOf( "application/x-www-form-urlencoded" ) === 0 ) {
			s.data = s.data.replace( r20, "+" );
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
				s.accepts[ s.dataTypes[ 0 ] ] +
					( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend &&
			( s.beforeSend.call( callbackContext, jqXHR, s ) === false || completed ) ) {

			// Abort if not done already and return
			return jqXHR.abort();
		}

		// Aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		completeDeferred.add( s.complete );
		jqXHR.done( s.success );
		jqXHR.fail( s.error );

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}

			// If request was aborted inside ajaxSend, stop there
			if ( completed ) {
				return jqXHR;
			}

			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = window.setTimeout( function() {
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				completed = false;
				transport.send( requestHeaders, done );
			} catch ( e ) {

				// Rethrow post-completion exceptions
				if ( completed ) {
					throw e;
				}

				// Propagate others as results
				done( -1, e );
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Ignore repeat invocations
			if ( completed ) {
				return;
			}

			completed = true;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				window.clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader( "Last-Modified" );
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader( "etag" );
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {

				// Extract error from statusText and normalize for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );

				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
} );

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {

		// Shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		// The url can be an options object (which then must have .url)
		return jQuery.ajax( jQuery.extend( {
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		}, jQuery.isPlainObject( url ) && url ) );
	};
} );


jQuery._evalUrl = function( url ) {
	return jQuery.ajax( {
		url: url,

		// Make this explicit, since user can override this through ajaxSetup (#11264)
		type: "GET",
		dataType: "script",
		cache: true,
		async: false,
		global: false,
		"throws": true
	} );
};


jQuery.fn.extend( {
	wrapAll: function( html ) {
		var wrap;

		if ( this[ 0 ] ) {
			if ( jQuery.isFunction( html ) ) {
				html = html.call( this[ 0 ] );
			}

			// The elements to wrap the target around
			wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map( function() {
				var elem = this;

				while ( elem.firstElementChild ) {
					elem = elem.firstElementChild;
				}

				return elem;
			} ).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each( function( i ) {
				jQuery( this ).wrapInner( html.call( this, i ) );
			} );
		}

		return this.each( function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		} );
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each( function( i ) {
			jQuery( this ).wrapAll( isFunction ? html.call( this, i ) : html );
		} );
	},

	unwrap: function( selector ) {
		this.parent( selector ).not( "body" ).each( function() {
			jQuery( this ).replaceWith( this.childNodes );
		} );
		return this;
	}
} );


jQuery.expr.pseudos.hidden = function( elem ) {
	return !jQuery.expr.pseudos.visible( elem );
};
jQuery.expr.pseudos.visible = function( elem ) {
	return !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
};




jQuery.ajaxSettings.xhr = function() {
	try {
		return new window.XMLHttpRequest();
	} catch ( e ) {}
};

var xhrSuccessStatus = {

		// File protocol always yields status code 0, assume 200
		0: 200,

		// Support: IE <=9 only
		// #1450: sometimes IE returns 1223 when it should be 204
		1223: 204
	},
	xhrSupported = jQuery.ajaxSettings.xhr();

support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
support.ajax = xhrSupported = !!xhrSupported;

jQuery.ajaxTransport( function( options ) {
	var callback, errorCallback;

	// Cross domain only allowed if supported through XMLHttpRequest
	if ( support.cors || xhrSupported && !options.crossDomain ) {
		return {
			send: function( headers, complete ) {
				var i,
					xhr = options.xhr();

				xhr.open(
					options.type,
					options.url,
					options.async,
					options.username,
					options.password
				);

				// Apply custom fields if provided
				if ( options.xhrFields ) {
					for ( i in options.xhrFields ) {
						xhr[ i ] = options.xhrFields[ i ];
					}
				}

				// Override mime type if needed
				if ( options.mimeType && xhr.overrideMimeType ) {
					xhr.overrideMimeType( options.mimeType );
				}

				// X-Requested-With header
				// For cross-domain requests, seeing as conditions for a preflight are
				// akin to a jigsaw puzzle, we simply never set it to be sure.
				// (it can always be set on a per-request basis or even using ajaxSetup)
				// For same-domain requests, won't change header if already provided.
				if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
					headers[ "X-Requested-With" ] = "XMLHttpRequest";
				}

				// Set headers
				for ( i in headers ) {
					xhr.setRequestHeader( i, headers[ i ] );
				}

				// Callback
				callback = function( type ) {
					return function() {
						if ( callback ) {
							callback = errorCallback = xhr.onload =
								xhr.onerror = xhr.onabort = xhr.onreadystatechange = null;

							if ( type === "abort" ) {
								xhr.abort();
							} else if ( type === "error" ) {

								// Support: IE <=9 only
								// On a manual native abort, IE9 throws
								// errors on any property access that is not readyState
								if ( typeof xhr.status !== "number" ) {
									complete( 0, "error" );
								} else {
									complete(

										// File: protocol always yields status 0; see #8605, #14207
										xhr.status,
										xhr.statusText
									);
								}
							} else {
								complete(
									xhrSuccessStatus[ xhr.status ] || xhr.status,
									xhr.statusText,

									// Support: IE <=9 only
									// IE9 has no XHR2 but throws on binary (trac-11426)
									// For XHR2 non-text, let the caller handle it (gh-2498)
									( xhr.responseType || "text" ) !== "text"  ||
									typeof xhr.responseText !== "string" ?
										{ binary: xhr.response } :
										{ text: xhr.responseText },
									xhr.getAllResponseHeaders()
								);
							}
						}
					};
				};

				// Listen to events
				xhr.onload = callback();
				errorCallback = xhr.onerror = callback( "error" );

				// Support: IE 9 only
				// Use onreadystatechange to replace onabort
				// to handle uncaught aborts
				if ( xhr.onabort !== undefined ) {
					xhr.onabort = errorCallback;
				} else {
					xhr.onreadystatechange = function() {

						// Check readyState before timeout as it changes
						if ( xhr.readyState === 4 ) {

							// Allow onerror to be called first,
							// but that will not handle a native abort
							// Also, save errorCallback to a variable
							// as xhr.onerror cannot be accessed
							window.setTimeout( function() {
								if ( callback ) {
									errorCallback();
								}
							} );
						}
					};
				}

				// Create the abort callback
				callback = callback( "abort" );

				try {

					// Do send the request (this may raise an exception)
					xhr.send( options.hasContent && options.data || null );
				} catch ( e ) {

					// #14683: Only rethrow if this hasn't been notified as an error yet
					if ( callback ) {
						throw e;
					}
				}
			},

			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




// Prevent auto-execution of scripts when no explicit dataType was provided (See gh-2432)
jQuery.ajaxPrefilter( function( s ) {
	if ( s.crossDomain ) {
		s.contents.script = false;
	}
} );

// Install script dataType
jQuery.ajaxSetup( {
	accepts: {
		script: "text/javascript, application/javascript, " +
			"application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /\b(?:java|ecma)script\b/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
} );

// Handle cache's special case and crossDomain
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
	}
} );

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function( s ) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {
		var script, callback;
		return {
			send: function( _, complete ) {
				script = jQuery( "<script>" ).prop( {
					charset: s.scriptCharset,
					src: s.url
				} ).on(
					"load error",
					callback = function( evt ) {
						script.remove();
						callback = null;
						if ( evt ) {
							complete( evt.type === "error" ? 404 : 200, evt.type );
						}
					}
				);

				// Use native DOM manipulation to avoid our domManip AJAX trickery
				document.head.appendChild( script[ 0 ] );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup( {
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
} );

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" &&
				( s.contentType || "" )
					.indexOf( "application/x-www-form-urlencoded" ) === 0 &&
				rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters[ "script json" ] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// Force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always( function() {

			// If previous value didn't exist - remove it
			if ( overwritten === undefined ) {
				jQuery( window ).removeProp( callbackName );

			// Otherwise restore preexisting value
			} else {
				window[ callbackName ] = overwritten;
			}

			// Save back as free
			if ( s[ callbackName ] ) {

				// Make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// Save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		} );

		// Delegate to script
		return "script";
	}
} );




// Support: Safari 8 only
// In Safari 8 documents created via document.implementation.createHTMLDocument
// collapse sibling forms: the second one becomes a child of the first one.
// Because of that, this security measure has to be disabled in Safari 8.
// https://bugs.webkit.org/show_bug.cgi?id=137337
support.createHTMLDocument = ( function() {
	var body = document.implementation.createHTMLDocument( "" ).body;
	body.innerHTML = "<form></form><form></form>";
	return body.childNodes.length === 2;
} )();


// Argument "data" should be string of html
// context (optional): If specified, the fragment will be created in this context,
// defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( typeof data !== "string" ) {
		return [];
	}
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}

	var base, parsed, scripts;

	if ( !context ) {

		// Stop scripts or inline event handlers from being executed immediately
		// by using document.implementation
		if ( support.createHTMLDocument ) {
			context = document.implementation.createHTMLDocument( "" );

			// Set the base href for the created document
			// so any parsed elements with URLs
			// are based on the document's URL (gh-2965)
			base = context.createElement( "base" );
			base.href = document.location.href;
			context.head.appendChild( base );
		} else {
			context = document;
		}
	}

	parsed = rsingleTag.exec( data );
	scripts = !keepScripts && [];

	// Single tag
	if ( parsed ) {
		return [ context.createElement( parsed[ 1 ] ) ];
	}

	parsed = buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}

	return jQuery.merge( [], parsed.childNodes );
};


/**
 * Load a url into a page
 */
jQuery.fn.load = function( url, params, callback ) {
	var selector, type, response,
		self = this,
		off = url.indexOf( " " );

	if ( off > -1 ) {
		selector = stripAndCollapse( url.slice( off ) );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax( {
			url: url,

			// If "type" variable is undefined, then "GET" method will be used.
			// Make value of this field explicit since
			// user can override it through ajaxSetup method
			type: type || "GET",
			dataType: "html",
			data: params
		} ).done( function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		// If the request succeeds, this function gets "data", "status", "jqXHR"
		// but they are ignored because response was set above.
		// If it fails, this function gets "jqXHR", "status", "error"
		} ).always( callback && function( jqXHR, status ) {
			self.each( function() {
				callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
			} );
		} );
	}

	return this;
};




// Attach a bunch of functions for handling common AJAX events
jQuery.each( [
	"ajaxStart",
	"ajaxStop",
	"ajaxComplete",
	"ajaxError",
	"ajaxSuccess",
	"ajaxSend"
], function( i, type ) {
	jQuery.fn[ type ] = function( fn ) {
		return this.on( type, fn );
	};
} );




jQuery.expr.pseudos.animated = function( elem ) {
	return jQuery.grep( jQuery.timers, function( fn ) {
		return elem === fn.elem;
	} ).length;
};




jQuery.offset = {
	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// Set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
			( curCSSTop + curCSSLeft ).indexOf( "auto" ) > -1;

		// Need to be able to calculate position if either
		// top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;

		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {

			// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
			options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );

		} else {
			curElem.css( props );
		}
	}
};

jQuery.fn.extend( {
	offset: function( options ) {

		// Preserve chaining for setter
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each( function( i ) {
					jQuery.offset.setOffset( this, options, i );
				} );
		}

		var doc, docElem, rect, win,
			elem = this[ 0 ];

		if ( !elem ) {
			return;
		}

		// Return zeros for disconnected and hidden (display: none) elements (gh-2310)
		// Support: IE <=11 only
		// Running getBoundingClientRect on a
		// disconnected node in IE throws an error
		if ( !elem.getClientRects().length ) {
			return { top: 0, left: 0 };
		}

		rect = elem.getBoundingClientRect();

		doc = elem.ownerDocument;
		docElem = doc.documentElement;
		win = doc.defaultView;

		return {
			top: rect.top + win.pageYOffset - docElem.clientTop,
			left: rect.left + win.pageXOffset - docElem.clientLeft
		};
	},

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			elem = this[ 0 ],
			parentOffset = { top: 0, left: 0 };

		// Fixed elements are offset from window (parentOffset = {top:0, left: 0},
		// because it is its only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {

			// Assume getBoundingClientRect is there when computed position is fixed
			offset = elem.getBoundingClientRect();

		} else {

			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset = {
				top: parentOffset.top + jQuery.css( offsetParent[ 0 ], "borderTopWidth", true ),
				left: parentOffset.left + jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true )
			};
		}

		// Subtract parent offsets and element margins
		return {
			top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	// This method will return documentElement in the following cases:
	// 1) For the element inside the iframe without offsetParent, this method will return
	//    documentElement of the parent window
	// 2) For the hidden or detached element
	// 3) For body or html element, i.e. in case of the html node - it will return itself
	//
	// but those exceptions were never presented as a real life use-cases
	// and might be considered as more preferable results.
	//
	// This logic, however, is not guaranteed and can change at any point in the future
	offsetParent: function() {
		return this.map( function() {
			var offsetParent = this.offsetParent;

			while ( offsetParent && jQuery.css( offsetParent, "position" ) === "static" ) {
				offsetParent = offsetParent.offsetParent;
			}

			return offsetParent || documentElement;
		} );
	}
} );

// Create scrollLeft and scrollTop methods
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
	var top = "pageYOffset" === prop;

	jQuery.fn[ method ] = function( val ) {
		return access( this, function( elem, method, val ) {

			// Coalesce documents and windows
			var win;
			if ( jQuery.isWindow( elem ) ) {
				win = elem;
			} else if ( elem.nodeType === 9 ) {
				win = elem.defaultView;
			}

			if ( val === undefined ) {
				return win ? win[ prop ] : elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : win.pageXOffset,
					top ? val : win.pageYOffset
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length );
	};
} );

// Support: Safari <=7 - 9.1, Chrome <=37 - 49
// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// Blink bug: https://bugs.chromium.org/p/chromium/issues/detail?id=589347
// getComputedStyle returns percent when specified for top/left/bottom/right;
// rather than make the css module depend on the offset module, just check for it here
jQuery.each( [ "top", "left" ], function( i, prop ) {
	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
		function( elem, computed ) {
			if ( computed ) {
				computed = curCSS( elem, prop );

				// If curCSS returns percentage, fallback to offset
				return rnumnonpx.test( computed ) ?
					jQuery( elem ).position()[ prop ] + "px" :
					computed;
			}
		}
	);
} );


// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name },
		function( defaultExtra, funcName ) {

		// Margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {

					// $( window ).outerWidth/Height return w/h including scrollbars (gh-1729)
					return funcName.indexOf( "outer" ) === 0 ?
						elem[ "inner" + name ] :
						elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
					// whichever is greatest
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?

					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable );
		};
	} );
} );


jQuery.fn.extend( {

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {

		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ?
			this.off( selector, "**" ) :
			this.off( types, selector || "**", fn );
	}
} );

jQuery.holdReady = function( hold ) {
	if ( hold ) {
		jQuery.readyWait++;
	} else {
		jQuery.ready( true );
	}
};
jQuery.isArray = Array.isArray;
jQuery.parseJSON = JSON.parse;
jQuery.nodeName = nodeName;




// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.

// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

if ( typeof define === "function" && define.amd ) {
	define( "jquery", [], function() {
		return jQuery;
	} );
}




var

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$;

jQuery.noConflict = function( deep ) {
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}

	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}

	return jQuery;
};

// Expose jQuery and $ identifiers, even in AMD
// (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (#13566)
if ( !noGlobal ) {
	window.jQuery = window.$ = jQuery;
}




return jQuery;
} );
/*!
 * Chart.js
 * http://chartjs.org/
 * Version: 2.7.0
 *
 * Copyright 2017 Nick Downie
 * Released under the MIT license
 * https://github.com/chartjs/Chart.js/blob/master/LICENSE.md
 */

!function(t){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{("undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this).Chart=t()}}(function(){return function t(e,n,i){function a(r,l){if(!n[r]){if(!e[r]){var s="function"==typeof require&&require;if(!l&&s)return s(r,!0);if(o)return o(r,!0);var u=new Error("Cannot find module '"+r+"'");throw u.code="MODULE_NOT_FOUND",u}var d=n[r]={exports:{}};e[r][0].call(d.exports,function(t){var n=e[r][1][t];return a(n||t)},d,d.exports,t,e,n,i)}return n[r].exports}for(var o="function"==typeof require&&require,r=0;r<i.length;r++)a(i[r]);return a}({1:[function(t,e,n){},{}],2:[function(t,e,n){function i(t){if(t){var e=/^#([a-fA-F0-9]{3})$/i,n=/^#([a-fA-F0-9]{6})$/i,i=/^rgba?\(\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/i,a=/^rgba?\(\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/i,o=/(\w+)/,r=[0,0,0],l=1,s=t.match(e);if(s){s=s[1];for(d=0;d<r.length;d++)r[d]=parseInt(s[d]+s[d],16)}else if(s=t.match(n)){s=s[1];for(d=0;d<r.length;d++)r[d]=parseInt(s.slice(2*d,2*d+2),16)}else if(s=t.match(i)){for(d=0;d<r.length;d++)r[d]=parseInt(s[d+1]);l=parseFloat(s[4])}else if(s=t.match(a)){for(d=0;d<r.length;d++)r[d]=Math.round(2.55*parseFloat(s[d+1]));l=parseFloat(s[4])}else if(s=t.match(o)){if("transparent"==s[1])return[0,0,0,0];if(!(r=c[s[1]]))return}for(var d=0;d<r.length;d++)r[d]=u(r[d],0,255);return l=l||0==l?u(l,0,1):1,r[3]=l,r}}function a(t){if(t){var e=/^hsla?\(\s*([+-]?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)/,n=t.match(e);if(n){var i=parseFloat(n[4]);return[u(parseInt(n[1]),0,360),u(parseFloat(n[2]),0,100),u(parseFloat(n[3]),0,100),u(isNaN(i)?1:i,0,1)]}}}function o(t){if(t){var e=/^hwb\(\s*([+-]?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)/,n=t.match(e);if(n){var i=parseFloat(n[4]);return[u(parseInt(n[1]),0,360),u(parseFloat(n[2]),0,100),u(parseFloat(n[3]),0,100),u(isNaN(i)?1:i,0,1)]}}}function r(t,e){return void 0===e&&(e=void 0!==t[3]?t[3]:1),"rgba("+t[0]+", "+t[1]+", "+t[2]+", "+e+")"}function l(t,e){return"rgba("+Math.round(t[0]/255*100)+"%, "+Math.round(t[1]/255*100)+"%, "+Math.round(t[2]/255*100)+"%, "+(e||t[3]||1)+")"}function s(t,e){return void 0===e&&(e=void 0!==t[3]?t[3]:1),"hsla("+t[0]+", "+t[1]+"%, "+t[2]+"%, "+e+")"}function u(t,e,n){return Math.min(Math.max(e,t),n)}function d(t){var e=t.toString(16).toUpperCase();return e.length<2?"0"+e:e}var c=t(6);e.exports={getRgba:i,getHsla:a,getRgb:function(t){var e=i(t);return e&&e.slice(0,3)},getHsl:function(t){var e=a(t);return e&&e.slice(0,3)},getHwb:o,getAlpha:function(t){var e=i(t);return e?e[3]:(e=a(t))?e[3]:(e=o(t))?e[3]:void 0},hexString:function(t){return"#"+d(t[0])+d(t[1])+d(t[2])},rgbString:function(t,e){return e<1||t[3]&&t[3]<1?r(t,e):"rgb("+t[0]+", "+t[1]+", "+t[2]+")"},rgbaString:r,percentString:function(t,e){return e<1||t[3]&&t[3]<1?l(t,e):"rgb("+Math.round(t[0]/255*100)+"%, "+Math.round(t[1]/255*100)+"%, "+Math.round(t[2]/255*100)+"%)"},percentaString:l,hslString:function(t,e){return e<1||t[3]&&t[3]<1?s(t,e):"hsl("+t[0]+", "+t[1]+"%, "+t[2]+"%)"},hslaString:s,hwbString:function(t,e){return void 0===e&&(e=void 0!==t[3]?t[3]:1),"hwb("+t[0]+", "+t[1]+"%, "+t[2]+"%"+(void 0!==e&&1!==e?", "+e:"")+")"},keyword:function(t){return h[t.slice(0,3)]}};var h={};for(var f in c)h[c[f]]=f},{6:6}],3:[function(t,e,n){var i=t(5),a=t(2),o=function(t){if(t instanceof o)return t;if(!(this instanceof o))return new o(t);this.valid=!1,this.values={rgb:[0,0,0],hsl:[0,0,0],hsv:[0,0,0],hwb:[0,0,0],cmyk:[0,0,0,0],alpha:1};var e;"string"==typeof t?(e=a.getRgba(t))?this.setValues("rgb",e):(e=a.getHsla(t))?this.setValues("hsl",e):(e=a.getHwb(t))&&this.setValues("hwb",e):"object"==typeof t&&(void 0!==(e=t).r||void 0!==e.red?this.setValues("rgb",e):void 0!==e.l||void 0!==e.lightness?this.setValues("hsl",e):void 0!==e.v||void 0!==e.value?this.setValues("hsv",e):void 0!==e.w||void 0!==e.whiteness?this.setValues("hwb",e):void 0===e.c&&void 0===e.cyan||this.setValues("cmyk",e))};o.prototype={isValid:function(){return this.valid},rgb:function(){return this.setSpace("rgb",arguments)},hsl:function(){return this.setSpace("hsl",arguments)},hsv:function(){return this.setSpace("hsv",arguments)},hwb:function(){return this.setSpace("hwb",arguments)},cmyk:function(){return this.setSpace("cmyk",arguments)},rgbArray:function(){return this.values.rgb},hslArray:function(){return this.values.hsl},hsvArray:function(){return this.values.hsv},hwbArray:function(){var t=this.values;return 1!==t.alpha?t.hwb.concat([t.alpha]):t.hwb},cmykArray:function(){return this.values.cmyk},rgbaArray:function(){var t=this.values;return t.rgb.concat([t.alpha])},hslaArray:function(){var t=this.values;return t.hsl.concat([t.alpha])},alpha:function(t){return void 0===t?this.values.alpha:(this.setValues("alpha",t),this)},red:function(t){return this.setChannel("rgb",0,t)},green:function(t){return this.setChannel("rgb",1,t)},blue:function(t){return this.setChannel("rgb",2,t)},hue:function(t){return t&&(t=(t%=360)<0?360+t:t),this.setChannel("hsl",0,t)},saturation:function(t){return this.setChannel("hsl",1,t)},lightness:function(t){return this.setChannel("hsl",2,t)},saturationv:function(t){return this.setChannel("hsv",1,t)},whiteness:function(t){return this.setChannel("hwb",1,t)},blackness:function(t){return this.setChannel("hwb",2,t)},value:function(t){return this.setChannel("hsv",2,t)},cyan:function(t){return this.setChannel("cmyk",0,t)},magenta:function(t){return this.setChannel("cmyk",1,t)},yellow:function(t){return this.setChannel("cmyk",2,t)},black:function(t){return this.setChannel("cmyk",3,t)},hexString:function(){return a.hexString(this.values.rgb)},rgbString:function(){return a.rgbString(this.values.rgb,this.values.alpha)},rgbaString:function(){return a.rgbaString(this.values.rgb,this.values.alpha)},percentString:function(){return a.percentString(this.values.rgb,this.values.alpha)},hslString:function(){return a.hslString(this.values.hsl,this.values.alpha)},hslaString:function(){return a.hslaString(this.values.hsl,this.values.alpha)},hwbString:function(){return a.hwbString(this.values.hwb,this.values.alpha)},keyword:function(){return a.keyword(this.values.rgb,this.values.alpha)},rgbNumber:function(){var t=this.values.rgb;return t[0]<<16|t[1]<<8|t[2]},luminosity:function(){for(var t=this.values.rgb,e=[],n=0;n<t.length;n++){var i=t[n]/255;e[n]=i<=.03928?i/12.92:Math.pow((i+.055)/1.055,2.4)}return.2126*e[0]+.7152*e[1]+.0722*e[2]},contrast:function(t){var e=this.luminosity(),n=t.luminosity();return e>n?(e+.05)/(n+.05):(n+.05)/(e+.05)},level:function(t){var e=this.contrast(t);return e>=7.1?"AAA":e>=4.5?"AA":""},dark:function(){var t=this.values.rgb;return(299*t[0]+587*t[1]+114*t[2])/1e3<128},light:function(){return!this.dark()},negate:function(){for(var t=[],e=0;e<3;e++)t[e]=255-this.values.rgb[e];return this.setValues("rgb",t),this},lighten:function(t){var e=this.values.hsl;return e[2]+=e[2]*t,this.setValues("hsl",e),this},darken:function(t){var e=this.values.hsl;return e[2]-=e[2]*t,this.setValues("hsl",e),this},saturate:function(t){var e=this.values.hsl;return e[1]+=e[1]*t,this.setValues("hsl",e),this},desaturate:function(t){var e=this.values.hsl;return e[1]-=e[1]*t,this.setValues("hsl",e),this},whiten:function(t){var e=this.values.hwb;return e[1]+=e[1]*t,this.setValues("hwb",e),this},blacken:function(t){var e=this.values.hwb;return e[2]+=e[2]*t,this.setValues("hwb",e),this},greyscale:function(){var t=this.values.rgb,e=.3*t[0]+.59*t[1]+.11*t[2];return this.setValues("rgb",[e,e,e]),this},clearer:function(t){var e=this.values.alpha;return this.setValues("alpha",e-e*t),this},opaquer:function(t){var e=this.values.alpha;return this.setValues("alpha",e+e*t),this},rotate:function(t){var e=this.values.hsl,n=(e[0]+t)%360;return e[0]=n<0?360+n:n,this.setValues("hsl",e),this},mix:function(t,e){var n=this,i=t,a=void 0===e?.5:e,o=2*a-1,r=n.alpha()-i.alpha(),l=((o*r==-1?o:(o+r)/(1+o*r))+1)/2,s=1-l;return this.rgb(l*n.red()+s*i.red(),l*n.green()+s*i.green(),l*n.blue()+s*i.blue()).alpha(n.alpha()*a+i.alpha()*(1-a))},toJSON:function(){return this.rgb()},clone:function(){var t,e,n=new o,i=this.values,a=n.values;for(var r in i)i.hasOwnProperty(r)&&(t=i[r],"[object Array]"===(e={}.toString.call(t))?a[r]=t.slice(0):"[object Number]"===e?a[r]=t:console.error("unexpected color value:",t));return n}},o.prototype.spaces={rgb:["red","green","blue"],hsl:["hue","saturation","lightness"],hsv:["hue","saturation","value"],hwb:["hue","whiteness","blackness"],cmyk:["cyan","magenta","yellow","black"]},o.prototype.maxes={rgb:[255,255,255],hsl:[360,100,100],hsv:[360,100,100],hwb:[360,100,100],cmyk:[100,100,100,100]},o.prototype.getValues=function(t){for(var e=this.values,n={},i=0;i<t.length;i++)n[t.charAt(i)]=e[t][i];return 1!==e.alpha&&(n.a=e.alpha),n},o.prototype.setValues=function(t,e){var n,a=this.values,o=this.spaces,r=this.maxes,l=1;if(this.valid=!0,"alpha"===t)l=e;else if(e.length)a[t]=e.slice(0,t.length),l=e[t.length];else if(void 0!==e[t.charAt(0)]){for(n=0;n<t.length;n++)a[t][n]=e[t.charAt(n)];l=e.a}else if(void 0!==e[o[t][0]]){var s=o[t];for(n=0;n<t.length;n++)a[t][n]=e[s[n]];l=e.alpha}if(a.alpha=Math.max(0,Math.min(1,void 0===l?a.alpha:l)),"alpha"===t)return!1;var u;for(n=0;n<t.length;n++)u=Math.max(0,Math.min(r[t][n],a[t][n])),a[t][n]=Math.round(u);for(var d in o)d!==t&&(a[d]=i[t][d](a[t]));return!0},o.prototype.setSpace=function(t,e){var n=e[0];return void 0===n?this.getValues(t):("number"==typeof n&&(n=Array.prototype.slice.call(e)),this.setValues(t,n),this)},o.prototype.setChannel=function(t,e,n){var i=this.values[t];return void 0===n?i[e]:n===i[e]?this:(i[e]=n,this.setValues(t,i),this)},"undefined"!=typeof window&&(window.Color=o),e.exports=o},{2:2,5:5}],4:[function(t,e,n){function i(t){var e,n,i,a=t[0]/255,o=t[1]/255,r=t[2]/255,l=Math.min(a,o,r),s=Math.max(a,o,r),u=s-l;return s==l?e=0:a==s?e=(o-r)/u:o==s?e=2+(r-a)/u:r==s&&(e=4+(a-o)/u),(e=Math.min(60*e,360))<0&&(e+=360),i=(l+s)/2,n=s==l?0:i<=.5?u/(s+l):u/(2-s-l),[e,100*n,100*i]}function a(t){var e,n,i,a=t[0],o=t[1],r=t[2],l=Math.min(a,o,r),s=Math.max(a,o,r),u=s-l;return n=0==s?0:u/s*1e3/10,s==l?e=0:a==s?e=(o-r)/u:o==s?e=2+(r-a)/u:r==s&&(e=4+(a-o)/u),(e=Math.min(60*e,360))<0&&(e+=360),i=s/255*1e3/10,[e,n,i]}function o(t){var e=t[0],n=t[1],a=t[2];return[i(t)[0],100*(1/255*Math.min(e,Math.min(n,a))),100*(a=1-1/255*Math.max(e,Math.max(n,a)))]}function l(t){var e,n,i,a,o=t[0]/255,r=t[1]/255,l=t[2]/255;return a=Math.min(1-o,1-r,1-l),e=(1-o-a)/(1-a)||0,n=(1-r-a)/(1-a)||0,i=(1-l-a)/(1-a)||0,[100*e,100*n,100*i,100*a]}function s(t){return C[JSON.stringify(t)]}function u(t){var e=t[0]/255,n=t[1]/255,i=t[2]/255;return[100*(.4124*(e=e>.04045?Math.pow((e+.055)/1.055,2.4):e/12.92)+.3576*(n=n>.04045?Math.pow((n+.055)/1.055,2.4):n/12.92)+.1805*(i=i>.04045?Math.pow((i+.055)/1.055,2.4):i/12.92)),100*(.2126*e+.7152*n+.0722*i),100*(.0193*e+.1192*n+.9505*i)]}function d(t){var e,n,i,a=u(t),o=a[0],r=a[1],l=a[2];return o/=95.047,r/=100,l/=108.883,o=o>.008856?Math.pow(o,1/3):7.787*o+16/116,r=r>.008856?Math.pow(r,1/3):7.787*r+16/116,l=l>.008856?Math.pow(l,1/3):7.787*l+16/116,e=116*r-16,n=500*(o-r),i=200*(r-l),[e,n,i]}function c(t){var e,n,i,a,o,r=t[0]/360,l=t[1]/100,s=t[2]/100;if(0==l)return o=255*s,[o,o,o];e=2*s-(n=s<.5?s*(1+l):s+l-s*l),a=[0,0,0];for(var u=0;u<3;u++)(i=r+1/3*-(u-1))<0&&i++,i>1&&i--,o=6*i<1?e+6*(n-e)*i:2*i<1?n:3*i<2?e+(n-e)*(2/3-i)*6:e,a[u]=255*o;return a}function h(t){var e=t[0]/60,n=t[1]/100,i=t[2]/100,a=Math.floor(e)%6,o=e-Math.floor(e),r=255*i*(1-n),l=255*i*(1-n*o),s=255*i*(1-n*(1-o)),i=255*i;switch(a){case 0:return[i,s,r];case 1:return[l,i,r];case 2:return[r,i,s];case 3:return[r,l,i];case 4:return[s,r,i];case 5:return[i,r,l]}}function f(t){var e,n,i,a,o=t[0]/360,l=t[1]/100,s=t[2]/100,u=l+s;switch(u>1&&(l/=u,s/=u),e=Math.floor(6*o),n=1-s,i=6*o-e,0!=(1&e)&&(i=1-i),a=l+i*(n-l),e){default:case 6:case 0:r=n,g=a,b=l;break;case 1:r=a,g=n,b=l;break;case 2:r=l,g=n,b=a;break;case 3:r=l,g=a,b=n;break;case 4:r=a,g=l,b=n;break;case 5:r=n,g=l,b=a}return[255*r,255*g,255*b]}function p(t){var e,n,i,a=t[0]/100,o=t[1]/100,r=t[2]/100,l=t[3]/100;return e=1-Math.min(1,a*(1-l)+l),n=1-Math.min(1,o*(1-l)+l),i=1-Math.min(1,r*(1-l)+l),[255*e,255*n,255*i]}function v(t){var e,n,i,a=t[0]/100,o=t[1]/100,r=t[2]/100;return e=3.2406*a+-1.5372*o+-.4986*r,n=-.9689*a+1.8758*o+.0415*r,i=.0557*a+-.204*o+1.057*r,e=e>.0031308?1.055*Math.pow(e,1/2.4)-.055:e*=12.92,n=n>.0031308?1.055*Math.pow(n,1/2.4)-.055:n*=12.92,i=i>.0031308?1.055*Math.pow(i,1/2.4)-.055:i*=12.92,e=Math.min(Math.max(0,e),1),n=Math.min(Math.max(0,n),1),i=Math.min(Math.max(0,i),1),[255*e,255*n,255*i]}function m(t){var e,n,i,a=t[0],o=t[1],r=t[2];return a/=95.047,o/=100,r/=108.883,a=a>.008856?Math.pow(a,1/3):7.787*a+16/116,o=o>.008856?Math.pow(o,1/3):7.787*o+16/116,r=r>.008856?Math.pow(r,1/3):7.787*r+16/116,e=116*o-16,n=500*(a-o),i=200*(o-r),[e,n,i]}function x(t){var e,n,i,a,o=t[0],r=t[1],l=t[2];return o<=8?a=(n=100*o/903.3)/100*7.787+16/116:(n=100*Math.pow((o+16)/116,3),a=Math.pow(n/100,1/3)),e=e/95.047<=.008856?e=95.047*(r/500+a-16/116)/7.787:95.047*Math.pow(r/500+a,3),i=i/108.883<=.008859?i=108.883*(a-l/200-16/116)/7.787:108.883*Math.pow(a-l/200,3),[e,n,i]}function y(t){var e,n,i,a=t[0],o=t[1],r=t[2];return e=Math.atan2(r,o),(n=360*e/2/Math.PI)<0&&(n+=360),i=Math.sqrt(o*o+r*r),[a,i,n]}function k(t){return v(x(t))}function w(t){var e,n,i,a=t[0],o=t[1];return i=t[2]/360*2*Math.PI,e=o*Math.cos(i),n=o*Math.sin(i),[a,e,n]}function M(t){return S[t]}e.exports={rgb2hsl:i,rgb2hsv:a,rgb2hwb:o,rgb2cmyk:l,rgb2keyword:s,rgb2xyz:u,rgb2lab:d,rgb2lch:function(t){return y(d(t))},hsl2rgb:c,hsl2hsv:function(t){var e,n,i=t[0],a=t[1]/100,o=t[2]/100;return 0===o?[0,0,0]:(o*=2,a*=o<=1?o:2-o,n=(o+a)/2,e=2*a/(o+a),[i,100*e,100*n])},hsl2hwb:function(t){return o(c(t))},hsl2cmyk:function(t){return l(c(t))},hsl2keyword:function(t){return s(c(t))},hsv2rgb:h,hsv2hsl:function(t){var e,n,i=t[0],a=t[1]/100,o=t[2]/100;return n=(2-a)*o,e=a*o,e/=n<=1?n:2-n,e=e||0,n/=2,[i,100*e,100*n]},hsv2hwb:function(t){return o(h(t))},hsv2cmyk:function(t){return l(h(t))},hsv2keyword:function(t){return s(h(t))},hwb2rgb:f,hwb2hsl:function(t){return i(f(t))},hwb2hsv:function(t){return a(f(t))},hwb2cmyk:function(t){return l(f(t))},hwb2keyword:function(t){return s(f(t))},cmyk2rgb:p,cmyk2hsl:function(t){return i(p(t))},cmyk2hsv:function(t){return a(p(t))},cmyk2hwb:function(t){return o(p(t))},cmyk2keyword:function(t){return s(p(t))},keyword2rgb:M,keyword2hsl:function(t){return i(M(t))},keyword2hsv:function(t){return a(M(t))},keyword2hwb:function(t){return o(M(t))},keyword2cmyk:function(t){return l(M(t))},keyword2lab:function(t){return d(M(t))},keyword2xyz:function(t){return u(M(t))},xyz2rgb:v,xyz2lab:m,xyz2lch:function(t){return y(m(t))},lab2xyz:x,lab2rgb:k,lab2lch:y,lch2lab:w,lch2xyz:function(t){return x(w(t))},lch2rgb:function(t){return k(w(t))}};var S={aliceblue:[240,248,255],antiquewhite:[250,235,215],aqua:[0,255,255],aquamarine:[127,255,212],azure:[240,255,255],beige:[245,245,220],bisque:[255,228,196],black:[0,0,0],blanchedalmond:[255,235,205],blue:[0,0,255],blueviolet:[138,43,226],brown:[165,42,42],burlywood:[222,184,135],cadetblue:[95,158,160],chartreuse:[127,255,0],chocolate:[210,105,30],coral:[255,127,80],cornflowerblue:[100,149,237],cornsilk:[255,248,220],crimson:[220,20,60],cyan:[0,255,255],darkblue:[0,0,139],darkcyan:[0,139,139],darkgoldenrod:[184,134,11],darkgray:[169,169,169],darkgreen:[0,100,0],darkgrey:[169,169,169],darkkhaki:[189,183,107],darkmagenta:[139,0,139],darkolivegreen:[85,107,47],darkorange:[255,140,0],darkorchid:[153,50,204],darkred:[139,0,0],darksalmon:[233,150,122],darkseagreen:[143,188,143],darkslateblue:[72,61,139],darkslategray:[47,79,79],darkslategrey:[47,79,79],darkturquoise:[0,206,209],darkviolet:[148,0,211],deeppink:[255,20,147],deepskyblue:[0,191,255],dimgray:[105,105,105],dimgrey:[105,105,105],dodgerblue:[30,144,255],firebrick:[178,34,34],floralwhite:[255,250,240],forestgreen:[34,139,34],fuchsia:[255,0,255],gainsboro:[220,220,220],ghostwhite:[248,248,255],gold:[255,215,0],goldenrod:[218,165,32],gray:[128,128,128],green:[0,128,0],greenyellow:[173,255,47],grey:[128,128,128],honeydew:[240,255,240],hotpink:[255,105,180],indianred:[205,92,92],indigo:[75,0,130],ivory:[255,255,240],khaki:[240,230,140],lavender:[230,230,250],lavenderblush:[255,240,245],lawngreen:[124,252,0],lemonchiffon:[255,250,205],lightblue:[173,216,230],lightcoral:[240,128,128],lightcyan:[224,255,255],lightgoldenrodyellow:[250,250,210],lightgray:[211,211,211],lightgreen:[144,238,144],lightgrey:[211,211,211],lightpink:[255,182,193],lightsalmon:[255,160,122],lightseagreen:[32,178,170],lightskyblue:[135,206,250],lightslategray:[119,136,153],lightslategrey:[119,136,153],lightsteelblue:[176,196,222],lightyellow:[255,255,224],lime:[0,255,0],limegreen:[50,205,50],linen:[250,240,230],magenta:[255,0,255],maroon:[128,0,0],mediumaquamarine:[102,205,170],mediumblue:[0,0,205],mediumorchid:[186,85,211],mediumpurple:[147,112,219],mediumseagreen:[60,179,113],mediumslateblue:[123,104,238],mediumspringgreen:[0,250,154],mediumturquoise:[72,209,204],mediumvioletred:[199,21,133],midnightblue:[25,25,112],mintcream:[245,255,250],mistyrose:[255,228,225],moccasin:[255,228,181],navajowhite:[255,222,173],navy:[0,0,128],oldlace:[253,245,230],olive:[128,128,0],olivedrab:[107,142,35],orange:[255,165,0],orangered:[255,69,0],orchid:[218,112,214],palegoldenrod:[238,232,170],palegreen:[152,251,152],paleturquoise:[175,238,238],palevioletred:[219,112,147],papayawhip:[255,239,213],peachpuff:[255,218,185],peru:[205,133,63],pink:[255,192,203],plum:[221,160,221],powderblue:[176,224,230],purple:[128,0,128],rebeccapurple:[102,51,153],red:[255,0,0],rosybrown:[188,143,143],royalblue:[65,105,225],saddlebrown:[139,69,19],salmon:[250,128,114],sandybrown:[244,164,96],seagreen:[46,139,87],seashell:[255,245,238],sienna:[160,82,45],silver:[192,192,192],skyblue:[135,206,235],slateblue:[106,90,205],slategray:[112,128,144],slategrey:[112,128,144],snow:[255,250,250],springgreen:[0,255,127],steelblue:[70,130,180],tan:[210,180,140],teal:[0,128,128],thistle:[216,191,216],tomato:[255,99,71],turquoise:[64,224,208],violet:[238,130,238],wheat:[245,222,179],white:[255,255,255],whitesmoke:[245,245,245],yellow:[255,255,0],yellowgreen:[154,205,50]},C={};for(var _ in S)C[JSON.stringify(S[_])]=_},{}],5:[function(t,e,n){var i=t(4),a=function(){return new u};for(var o in i){a[o+"Raw"]=function(t){return function(e){return"number"==typeof e&&(e=Array.prototype.slice.call(arguments)),i[t](e)}}(o);var r=/(\w+)2(\w+)/.exec(o),l=r[1],s=r[2];(a[l]=a[l]||{})[s]=a[o]=function(t){return function(e){"number"==typeof e&&(e=Array.prototype.slice.call(arguments));var n=i[t](e);if("string"==typeof n||void 0===n)return n;for(var a=0;a<n.length;a++)n[a]=Math.round(n[a]);return n}}(o)}var u=function(){this.convs={}};u.prototype.routeSpace=function(t,e){var n=e[0];return void 0===n?this.getValues(t):("number"==typeof n&&(n=Array.prototype.slice.call(e)),this.setValues(t,n))},u.prototype.setValues=function(t,e){return this.space=t,this.convs={},this.convs[t]=e,this},u.prototype.getValues=function(t){var e=this.convs[t];if(!e){var n=this.space,i=this.convs[n];e=a[n][t](i),this.convs[t]=e}return e},["rgb","hsl","hsv","cmyk","keyword"].forEach(function(t){u.prototype[t]=function(e){return this.routeSpace(t,arguments)}}),e.exports=a},{4:4}],6:[function(t,e,n){"use strict";e.exports={aliceblue:[240,248,255],antiquewhite:[250,235,215],aqua:[0,255,255],aquamarine:[127,255,212],azure:[240,255,255],beige:[245,245,220],bisque:[255,228,196],black:[0,0,0],blanchedalmond:[255,235,205],blue:[0,0,255],blueviolet:[138,43,226],brown:[165,42,42],burlywood:[222,184,135],cadetblue:[95,158,160],chartreuse:[127,255,0],chocolate:[210,105,30],coral:[255,127,80],cornflowerblue:[100,149,237],cornsilk:[255,248,220],crimson:[220,20,60],cyan:[0,255,255],darkblue:[0,0,139],darkcyan:[0,139,139],darkgoldenrod:[184,134,11],darkgray:[169,169,169],darkgreen:[0,100,0],darkgrey:[169,169,169],darkkhaki:[189,183,107],darkmagenta:[139,0,139],darkolivegreen:[85,107,47],darkorange:[255,140,0],darkorchid:[153,50,204],darkred:[139,0,0],darksalmon:[233,150,122],darkseagreen:[143,188,143],darkslateblue:[72,61,139],darkslategray:[47,79,79],darkslategrey:[47,79,79],darkturquoise:[0,206,209],darkviolet:[148,0,211],deeppink:[255,20,147],deepskyblue:[0,191,255],dimgray:[105,105,105],dimgrey:[105,105,105],dodgerblue:[30,144,255],firebrick:[178,34,34],floralwhite:[255,250,240],forestgreen:[34,139,34],fuchsia:[255,0,255],gainsboro:[220,220,220],ghostwhite:[248,248,255],gold:[255,215,0],goldenrod:[218,165,32],gray:[128,128,128],green:[0,128,0],greenyellow:[173,255,47],grey:[128,128,128],honeydew:[240,255,240],hotpink:[255,105,180],indianred:[205,92,92],indigo:[75,0,130],ivory:[255,255,240],khaki:[240,230,140],lavender:[230,230,250],lavenderblush:[255,240,245],lawngreen:[124,252,0],lemonchiffon:[255,250,205],lightblue:[173,216,230],lightcoral:[240,128,128],lightcyan:[224,255,255],lightgoldenrodyellow:[250,250,210],lightgray:[211,211,211],lightgreen:[144,238,144],lightgrey:[211,211,211],lightpink:[255,182,193],lightsalmon:[255,160,122],lightseagreen:[32,178,170],lightskyblue:[135,206,250],lightslategray:[119,136,153],lightslategrey:[119,136,153],lightsteelblue:[176,196,222],lightyellow:[255,255,224],lime:[0,255,0],limegreen:[50,205,50],linen:[250,240,230],magenta:[255,0,255],maroon:[128,0,0],mediumaquamarine:[102,205,170],mediumblue:[0,0,205],mediumorchid:[186,85,211],mediumpurple:[147,112,219],mediumseagreen:[60,179,113],mediumslateblue:[123,104,238],mediumspringgreen:[0,250,154],mediumturquoise:[72,209,204],mediumvioletred:[199,21,133],midnightblue:[25,25,112],mintcream:[245,255,250],mistyrose:[255,228,225],moccasin:[255,228,181],navajowhite:[255,222,173],navy:[0,0,128],oldlace:[253,245,230],olive:[128,128,0],olivedrab:[107,142,35],orange:[255,165,0],orangered:[255,69,0],orchid:[218,112,214],palegoldenrod:[238,232,170],palegreen:[152,251,152],paleturquoise:[175,238,238],palevioletred:[219,112,147],papayawhip:[255,239,213],peachpuff:[255,218,185],peru:[205,133,63],pink:[255,192,203],plum:[221,160,221],powderblue:[176,224,230],purple:[128,0,128],rebeccapurple:[102,51,153],red:[255,0,0],rosybrown:[188,143,143],royalblue:[65,105,225],saddlebrown:[139,69,19],salmon:[250,128,114],sandybrown:[244,164,96],seagreen:[46,139,87],seashell:[255,245,238],sienna:[160,82,45],silver:[192,192,192],skyblue:[135,206,235],slateblue:[106,90,205],slategray:[112,128,144],slategrey:[112,128,144],snow:[255,250,250],springgreen:[0,255,127],steelblue:[70,130,180],tan:[210,180,140],teal:[0,128,128],thistle:[216,191,216],tomato:[255,99,71],turquoise:[64,224,208],violet:[238,130,238],wheat:[245,222,179],white:[255,255,255],whitesmoke:[245,245,245],yellow:[255,255,0],yellowgreen:[154,205,50]}},{}],7:[function(t,e,n){var i=t(29)();i.helpers=t(45),t(27)(i),i.defaults=t(25),i.Element=t(26),i.elements=t(40),i.Interaction=t(28),i.platform=t(48),t(31)(i),t(22)(i),t(23)(i),t(24)(i),t(30)(i),t(33)(i),t(32)(i),t(35)(i),t(54)(i),t(52)(i),t(53)(i),t(55)(i),t(56)(i),t(57)(i),t(15)(i),t(16)(i),t(17)(i),t(18)(i),t(19)(i),t(20)(i),t(21)(i),t(8)(i),t(9)(i),t(10)(i),t(11)(i),t(12)(i),t(13)(i),t(14)(i);var a=[];a.push(t(49)(i),t(50)(i),t(51)(i)),i.plugins.register(a),i.platform.initialize(),e.exports=i,"undefined"!=typeof window&&(window.Chart=i),i.canvasHelpers=i.helpers.canvas},{10:10,11:11,12:12,13:13,14:14,15:15,16:16,17:17,18:18,19:19,20:20,21:21,22:22,23:23,24:24,25:25,26:26,27:27,28:28,29:29,30:30,31:31,32:32,33:33,35:35,40:40,45:45,48:48,49:49,50:50,51:51,52:52,53:53,54:54,55:55,56:56,57:57,8:8,9:9}],8:[function(t,e,n){"use strict";e.exports=function(t){t.Bar=function(e,n){return n.type="bar",new t(e,n)}}},{}],9:[function(t,e,n){"use strict";e.exports=function(t){t.Bubble=function(e,n){return n.type="bubble",new t(e,n)}}},{}],10:[function(t,e,n){"use strict";e.exports=function(t){t.Doughnut=function(e,n){return n.type="doughnut",new t(e,n)}}},{}],11:[function(t,e,n){"use strict";e.exports=function(t){t.Line=function(e,n){return n.type="line",new t(e,n)}}},{}],12:[function(t,e,n){"use strict";e.exports=function(t){t.PolarArea=function(e,n){return n.type="polarArea",new t(e,n)}}},{}],13:[function(t,e,n){"use strict";e.exports=function(t){t.Radar=function(e,n){return n.type="radar",new t(e,n)}}},{}],14:[function(t,e,n){"use strict";e.exports=function(t){t.Scatter=function(e,n){return n.type="scatter",new t(e,n)}}},{}],15:[function(t,e,n){"use strict";var i=t(25),a=t(40),o=t(45);i._set("bar",{hover:{mode:"label"},scales:{xAxes:[{type:"category",categoryPercentage:.8,barPercentage:.9,offset:!0,gridLines:{offsetGridLines:!0}}],yAxes:[{type:"linear"}]}}),i._set("horizontalBar",{hover:{mode:"index",axis:"y"},scales:{xAxes:[{type:"linear",position:"bottom"}],yAxes:[{position:"left",type:"category",categoryPercentage:.8,barPercentage:.9,offset:!0,gridLines:{offsetGridLines:!0}}]},elements:{rectangle:{borderSkipped:"left"}},tooltips:{callbacks:{title:function(t,e){var n="";return t.length>0&&(t[0].yLabel?n=t[0].yLabel:e.labels.length>0&&t[0].index<e.labels.length&&(n=e.labels[t[0].index])),n},label:function(t,e){return(e.datasets[t.datasetIndex].label||"")+": "+t.xLabel}},mode:"index",axis:"y"}}),e.exports=function(t){t.controllers.bar=t.DatasetController.extend({dataElementType:a.Rectangle,initialize:function(){var e,n=this;t.DatasetController.prototype.initialize.apply(n,arguments),(e=n.getMeta()).stack=n.getDataset().stack,e.bar=!0},update:function(t){var e,n,i=this,a=i.getMeta().data;for(i._ruler=i.getRuler(),e=0,n=a.length;e<n;++e)i.updateElement(a[e],e,t)},updateElement:function(t,e,n){var i=this,a=i.chart,r=i.getMeta(),l=i.getDataset(),s=t.custom||{},u=a.options.elements.rectangle;t._xScale=i.getScaleForId(r.xAxisID),t._yScale=i.getScaleForId(r.yAxisID),t._datasetIndex=i.index,t._index=e,t._model={datasetLabel:l.label,label:a.data.labels[e],borderSkipped:s.borderSkipped?s.borderSkipped:u.borderSkipped,backgroundColor:s.backgroundColor?s.backgroundColor:o.valueAtIndexOrDefault(l.backgroundColor,e,u.backgroundColor),borderColor:s.borderColor?s.borderColor:o.valueAtIndexOrDefault(l.borderColor,e,u.borderColor),borderWidth:s.borderWidth?s.borderWidth:o.valueAtIndexOrDefault(l.borderWidth,e,u.borderWidth)},i.updateElementGeometry(t,e,n),t.pivot()},updateElementGeometry:function(t,e,n){var i=this,a=t._model,o=i.getValueScale(),r=o.getBasePixel(),l=o.isHorizontal(),s=i._ruler||i.getRuler(),u=i.calculateBarValuePixels(i.index,e),d=i.calculateBarIndexPixels(i.index,e,s);a.horizontal=l,a.base=n?r:u.base,a.x=l?n?r:u.head:d.center,a.y=l?d.center:n?r:u.head,a.height=l?d.size:void 0,a.width=l?void 0:d.size},getValueScaleId:function(){return this.getMeta().yAxisID},getIndexScaleId:function(){return this.getMeta().xAxisID},getValueScale:function(){return this.getScaleForId(this.getValueScaleId())},getIndexScale:function(){return this.getScaleForId(this.getIndexScaleId())},getStackCount:function(t){var e,n,i=this,a=i.chart,o=i.getIndexScale().options.stacked,r=void 0===t?a.data.datasets.length:t+1,l=[];for(e=0;e<r;++e)(n=a.getDatasetMeta(e)).bar&&a.isDatasetVisible(e)&&(!1===o||!0===o&&-1===l.indexOf(n.stack)||void 0===o&&(void 0===n.stack||-1===l.indexOf(n.stack)))&&l.push(n.stack);return l.length},getStackIndex:function(t){return this.getStackCount(t)-1},getRuler:function(){var t,e,n=this,i=n.getIndexScale(),a=n.getStackCount(),o=n.index,r=[],l=i.isHorizontal(),s=l?i.left:i.top,u=s+(l?i.width:i.height);for(t=0,e=n.getMeta().data.length;t<e;++t)r.push(i.getPixelForValue(null,t,o));return{pixels:r,start:s,end:u,stackCount:a,scale:i}},calculateBarValuePixels:function(t,e){var n,i,a,o,r,l,s=this,u=s.chart,d=s.getMeta(),c=s.getValueScale(),h=u.data.datasets,f=c.getRightValue(h[t].data[e]),g=c.options.stacked,p=d.stack,v=0;if(g||void 0===g&&void 0!==p)for(n=0;n<t;++n)(i=u.getDatasetMeta(n)).bar&&i.stack===p&&i.controller.getValueScaleId()===c.id&&u.isDatasetVisible(n)&&(a=c.getRightValue(h[n].data[e]),(f<0&&a<0||f>=0&&a>0)&&(v+=a));return o=c.getPixelForValue(v),r=c.getPixelForValue(v+f),l=(r-o)/2,{size:l,base:o,head:r,center:r+l/2}},calculateBarIndexPixels:function(t,e,n){var i,a,r,l,s,u,d=this,c=n.scale.options,h=d.getStackIndex(t),f=n.pixels,g=f[e],p=f.length,v=n.start,m=n.end;return 1===p?(i=g>v?g-v:m-g,a=g<m?m-g:g-v):(e>0&&(i=(g-f[e-1])/2,e===p-1&&(a=i)),e<p-1&&(a=(f[e+1]-g)/2,0===e&&(i=a))),r=i*c.categoryPercentage,l=a*c.categoryPercentage,s=(r+l)/n.stackCount,u=s*c.barPercentage,u=Math.min(o.valueOrDefault(c.barThickness,u),o.valueOrDefault(c.maxBarThickness,1/0)),g-=r,g+=s*h,g+=(s-u)/2,{size:u,base:g,head:g+u,center:g+u/2}},draw:function(){var t=this,e=t.chart,n=t.getValueScale(),i=t.getMeta().data,a=t.getDataset(),r=i.length,l=0;for(o.canvas.clipArea(e.ctx,e.chartArea);l<r;++l)isNaN(n.getRightValue(a.data[l]))||i[l].draw();o.canvas.unclipArea(e.ctx)},setHoverStyle:function(t){var e=this.chart.data.datasets[t._datasetIndex],n=t._index,i=t.custom||{},a=t._model;a.backgroundColor=i.hoverBackgroundColor?i.hoverBackgroundColor:o.valueAtIndexOrDefault(e.hoverBackgroundColor,n,o.getHoverColor(a.backgroundColor)),a.borderColor=i.hoverBorderColor?i.hoverBorderColor:o.valueAtIndexOrDefault(e.hoverBorderColor,n,o.getHoverColor(a.borderColor)),a.borderWidth=i.hoverBorderWidth?i.hoverBorderWidth:o.valueAtIndexOrDefault(e.hoverBorderWidth,n,a.borderWidth)},removeHoverStyle:function(t){var e=this.chart.data.datasets[t._datasetIndex],n=t._index,i=t.custom||{},a=t._model,r=this.chart.options.elements.rectangle;a.backgroundColor=i.backgroundColor?i.backgroundColor:o.valueAtIndexOrDefault(e.backgroundColor,n,r.backgroundColor),a.borderColor=i.borderColor?i.borderColor:o.valueAtIndexOrDefault(e.borderColor,n,r.borderColor),a.borderWidth=i.borderWidth?i.borderWidth:o.valueAtIndexOrDefault(e.borderWidth,n,r.borderWidth)}}),t.controllers.horizontalBar=t.controllers.bar.extend({getValueScaleId:function(){return this.getMeta().xAxisID},getIndexScaleId:function(){return this.getMeta().yAxisID}})}},{25:25,40:40,45:45}],16:[function(t,e,n){"use strict";var i=t(25),a=t(40),o=t(45);i._set("bubble",{hover:{mode:"single"},scales:{xAxes:[{type:"linear",position:"bottom",id:"x-axis-0"}],yAxes:[{type:"linear",position:"left",id:"y-axis-0"}]},tooltips:{callbacks:{title:function(){return""},label:function(t,e){var n=e.datasets[t.datasetIndex].label||"",i=e.datasets[t.datasetIndex].data[t.index];return n+": ("+t.xLabel+", "+t.yLabel+", "+i.r+")"}}}}),e.exports=function(t){t.controllers.bubble=t.DatasetController.extend({dataElementType:a.Point,update:function(t){var e=this,n=e.getMeta().data;o.each(n,function(n,i){e.updateElement(n,i,t)})},updateElement:function(t,e,n){var i=this,a=i.getMeta(),o=t.custom||{},r=i.getScaleForId(a.xAxisID),l=i.getScaleForId(a.yAxisID),s=i._resolveElementOptions(t,e),u=i.getDataset().data[e],d=i.index,c=n?r.getPixelForDecimal(.5):r.getPixelForValue("object"==typeof u?u:NaN,e,d),h=n?l.getBasePixel():l.getPixelForValue(u,e,d);t._xScale=r,t._yScale=l,t._options=s,t._datasetIndex=d,t._index=e,t._model={backgroundColor:s.backgroundColor,borderColor:s.borderColor,borderWidth:s.borderWidth,hitRadius:s.hitRadius,pointStyle:s.pointStyle,radius:n?0:s.radius,skip:o.skip||isNaN(c)||isNaN(h),x:c,y:h},t.pivot()},setHoverStyle:function(t){var e=t._model,n=t._options;e.backgroundColor=o.valueOrDefault(n.hoverBackgroundColor,o.getHoverColor(n.backgroundColor)),e.borderColor=o.valueOrDefault(n.hoverBorderColor,o.getHoverColor(n.borderColor)),e.borderWidth=o.valueOrDefault(n.hoverBorderWidth,n.borderWidth),e.radius=n.radius+n.hoverRadius},removeHoverStyle:function(t){var e=t._model,n=t._options;e.backgroundColor=n.backgroundColor,e.borderColor=n.borderColor,e.borderWidth=n.borderWidth,e.radius=n.radius},_resolveElementOptions:function(t,e){var n,i,a,r=this,l=r.chart,s=l.data.datasets[r.index],u=t.custom||{},d=l.options.elements.point,c=o.options.resolve,h=s.data[e],f={},g={chart:l,dataIndex:e,dataset:s,datasetIndex:r.index},p=["backgroundColor","borderColor","borderWidth","hoverBackgroundColor","hoverBorderColor","hoverBorderWidth","hoverRadius","hitRadius","pointStyle"];for(n=0,i=p.length;n<i;++n)f[a=p[n]]=c([u[a],s[a],d[a]],g,e);return f.radius=c([u.radius,h?h.r:void 0,s.radius,d.radius],g,e),f}})}},{25:25,40:40,45:45}],17:[function(t,e,n){"use strict";var i=t(25),a=t(40),o=t(45);i._set("doughnut",{animation:{animateRotate:!0,animateScale:!1},hover:{mode:"single"},legendCallback:function(t){var e=[];e.push('<ul class="'+t.id+'-legend">');var n=t.data,i=n.datasets,a=n.labels;if(i.length)for(var o=0;o<i[0].data.length;++o)e.push('<li><span style="background-color:'+i[0].backgroundColor[o]+'"></span>'),a[o]&&e.push(a[o]),e.push("</li>");return e.push("</ul>"),e.join("")},legend:{labels:{generateLabels:function(t){var e=t.data;return e.labels.length&&e.datasets.length?e.labels.map(function(n,i){var a=t.getDatasetMeta(0),r=e.datasets[0],l=a.data[i],s=l&&l.custom||{},u=o.valueAtIndexOrDefault,d=t.options.elements.arc;return{text:n,fillStyle:s.backgroundColor?s.backgroundColor:u(r.backgroundColor,i,d.backgroundColor),strokeStyle:s.borderColor?s.borderColor:u(r.borderColor,i,d.borderColor),lineWidth:s.borderWidth?s.borderWidth:u(r.borderWidth,i,d.borderWidth),hidden:isNaN(r.data[i])||a.data[i].hidden,index:i}}):[]}},onClick:function(t,e){var n,i,a,o=e.index,r=this.chart;for(n=0,i=(r.data.datasets||[]).length;n<i;++n)(a=r.getDatasetMeta(n)).data[o]&&(a.data[o].hidden=!a.data[o].hidden);r.update()}},cutoutPercentage:50,rotation:-.5*Math.PI,circumference:2*Math.PI,tooltips:{callbacks:{title:function(){return""},label:function(t,e){var n=e.labels[t.index],i=": "+e.datasets[t.datasetIndex].data[t.index];return o.isArray(n)?(n=n.slice())[0]+=i:n+=i,n}}}}),i._set("pie",o.clone(i.doughnut)),i._set("pie",{cutoutPercentage:0}),e.exports=function(t){t.controllers.doughnut=t.controllers.pie=t.DatasetController.extend({dataElementType:a.Arc,linkScales:o.noop,getRingIndex:function(t){for(var e=0,n=0;n<t;++n)this.chart.isDatasetVisible(n)&&++e;return e},update:function(t){var e=this,n=e.chart,i=n.chartArea,a=n.options,r=a.elements.arc,l=i.right-i.left-r.borderWidth,s=i.bottom-i.top-r.borderWidth,u=Math.min(l,s),d={x:0,y:0},c=e.getMeta(),h=a.cutoutPercentage,f=a.circumference;if(f<2*Math.PI){var g=a.rotation%(2*Math.PI),p=(g+=2*Math.PI*(g>=Math.PI?-1:g<-Math.PI?1:0))+f,v={x:Math.cos(g),y:Math.sin(g)},m={x:Math.cos(p),y:Math.sin(p)},b=g<=0&&p>=0||g<=2*Math.PI&&2*Math.PI<=p,x=g<=.5*Math.PI&&.5*Math.PI<=p||g<=2.5*Math.PI&&2.5*Math.PI<=p,y=g<=-Math.PI&&-Math.PI<=p||g<=Math.PI&&Math.PI<=p,k=g<=.5*-Math.PI&&.5*-Math.PI<=p||g<=1.5*Math.PI&&1.5*Math.PI<=p,w=h/100,M={x:y?-1:Math.min(v.x*(v.x<0?1:w),m.x*(m.x<0?1:w)),y:k?-1:Math.min(v.y*(v.y<0?1:w),m.y*(m.y<0?1:w))},S={x:b?1:Math.max(v.x*(v.x>0?1:w),m.x*(m.x>0?1:w)),y:x?1:Math.max(v.y*(v.y>0?1:w),m.y*(m.y>0?1:w))},C={width:.5*(S.x-M.x),height:.5*(S.y-M.y)};u=Math.min(l/C.width,s/C.height),d={x:-.5*(S.x+M.x),y:-.5*(S.y+M.y)}}n.borderWidth=e.getMaxBorderWidth(c.data),n.outerRadius=Math.max((u-n.borderWidth)/2,0),n.innerRadius=Math.max(h?n.outerRadius/100*h:0,0),n.radiusLength=(n.outerRadius-n.innerRadius)/n.getVisibleDatasetCount(),n.offsetX=d.x*n.outerRadius,n.offsetY=d.y*n.outerRadius,c.total=e.calculateTotal(),e.outerRadius=n.outerRadius-n.radiusLength*e.getRingIndex(e.index),e.innerRadius=Math.max(e.outerRadius-n.radiusLength,0),o.each(c.data,function(n,i){e.updateElement(n,i,t)})},updateElement:function(t,e,n){var i=this,a=i.chart,r=a.chartArea,l=a.options,s=l.animation,u=(r.left+r.right)/2,d=(r.top+r.bottom)/2,c=l.rotation,h=l.rotation,f=i.getDataset(),g=n&&s.animateRotate?0:t.hidden?0:i.calculateCircumference(f.data[e])*(l.circumference/(2*Math.PI)),p=n&&s.animateScale?0:i.innerRadius,v=n&&s.animateScale?0:i.outerRadius,m=o.valueAtIndexOrDefault;o.extend(t,{_datasetIndex:i.index,_index:e,_model:{x:u+a.offsetX,y:d+a.offsetY,startAngle:c,endAngle:h,circumference:g,outerRadius:v,innerRadius:p,label:m(f.label,e,a.data.labels[e])}});var b=t._model;this.removeHoverStyle(t),n&&s.animateRotate||(b.startAngle=0===e?l.rotation:i.getMeta().data[e-1]._model.endAngle,b.endAngle=b.startAngle+b.circumference),t.pivot()},removeHoverStyle:function(e){t.DatasetController.prototype.removeHoverStyle.call(this,e,this.chart.options.elements.arc)},calculateTotal:function(){var t,e=this.getDataset(),n=this.getMeta(),i=0;return o.each(n.data,function(n,a){t=e.data[a],isNaN(t)||n.hidden||(i+=Math.abs(t))}),i},calculateCircumference:function(t){var e=this.getMeta().total;return e>0&&!isNaN(t)?2*Math.PI*(t/e):0},getMaxBorderWidth:function(t){for(var e,n,i=0,a=this.index,o=t.length,r=0;r<o;r++)e=t[r]._model?t[r]._model.borderWidth:0,i=(n=t[r]._chart?t[r]._chart.config.data.datasets[a].hoverBorderWidth:0)>(i=e>i?e:i)?n:i;return i}})}},{25:25,40:40,45:45}],18:[function(t,e,n){"use strict";var i=t(25),a=t(40),o=t(45);i._set("line",{showLines:!0,spanGaps:!1,hover:{mode:"label"},scales:{xAxes:[{type:"category",id:"x-axis-0"}],yAxes:[{type:"linear",id:"y-axis-0"}]}}),e.exports=function(t){function e(t,e){return o.valueOrDefault(t.showLine,e.showLines)}t.controllers.line=t.DatasetController.extend({datasetElementType:a.Line,dataElementType:a.Point,update:function(t){var n,i,a,r=this,l=r.getMeta(),s=l.dataset,u=l.data||[],d=r.chart.options,c=d.elements.line,h=r.getScaleForId(l.yAxisID),f=r.getDataset(),g=e(f,d);for(g&&(a=s.custom||{},void 0!==f.tension&&void 0===f.lineTension&&(f.lineTension=f.tension),s._scale=h,s._datasetIndex=r.index,s._children=u,s._model={spanGaps:f.spanGaps?f.spanGaps:d.spanGaps,tension:a.tension?a.tension:o.valueOrDefault(f.lineTension,c.tension),backgroundColor:a.backgroundColor?a.backgroundColor:f.backgroundColor||c.backgroundColor,borderWidth:a.borderWidth?a.borderWidth:f.borderWidth||c.borderWidth,borderColor:a.borderColor?a.borderColor:f.borderColor||c.borderColor,borderCapStyle:a.borderCapStyle?a.borderCapStyle:f.borderCapStyle||c.borderCapStyle,borderDash:a.borderDash?a.borderDash:f.borderDash||c.borderDash,borderDashOffset:a.borderDashOffset?a.borderDashOffset:f.borderDashOffset||c.borderDashOffset,borderJoinStyle:a.borderJoinStyle?a.borderJoinStyle:f.borderJoinStyle||c.borderJoinStyle,fill:a.fill?a.fill:void 0!==f.fill?f.fill:c.fill,steppedLine:a.steppedLine?a.steppedLine:o.valueOrDefault(f.steppedLine,c.stepped),cubicInterpolationMode:a.cubicInterpolationMode?a.cubicInterpolationMode:o.valueOrDefault(f.cubicInterpolationMode,c.cubicInterpolationMode)},s.pivot()),n=0,i=u.length;n<i;++n)r.updateElement(u[n],n,t);for(g&&0!==s._model.tension&&r.updateBezierControlPoints(),n=0,i=u.length;n<i;++n)u[n].pivot()},getPointBackgroundColor:function(t,e){var n=this.chart.options.elements.point.backgroundColor,i=this.getDataset(),a=t.custom||{};return a.backgroundColor?n=a.backgroundColor:i.pointBackgroundColor?n=o.valueAtIndexOrDefault(i.pointBackgroundColor,e,n):i.backgroundColor&&(n=i.backgroundColor),n},getPointBorderColor:function(t,e){var n=this.chart.options.elements.point.borderColor,i=this.getDataset(),a=t.custom||{};return a.borderColor?n=a.borderColor:i.pointBorderColor?n=o.valueAtIndexOrDefault(i.pointBorderColor,e,n):i.borderColor&&(n=i.borderColor),n},getPointBorderWidth:function(t,e){var n=this.chart.options.elements.point.borderWidth,i=this.getDataset(),a=t.custom||{};return isNaN(a.borderWidth)?!isNaN(i.pointBorderWidth)||o.isArray(i.pointBorderWidth)?n=o.valueAtIndexOrDefault(i.pointBorderWidth,e,n):isNaN(i.borderWidth)||(n=i.borderWidth):n=a.borderWidth,n},updateElement:function(t,e,n){var i,a,r=this,l=r.getMeta(),s=t.custom||{},u=r.getDataset(),d=r.index,c=u.data[e],h=r.getScaleForId(l.yAxisID),f=r.getScaleForId(l.xAxisID),g=r.chart.options.elements.point;void 0!==u.radius&&void 0===u.pointRadius&&(u.pointRadius=u.radius),void 0!==u.hitRadius&&void 0===u.pointHitRadius&&(u.pointHitRadius=u.hitRadius),i=f.getPixelForValue("object"==typeof c?c:NaN,e,d),a=n?h.getBasePixel():r.calculatePointY(c,e,d),t._xScale=f,t._yScale=h,t._datasetIndex=d,t._index=e,t._model={x:i,y:a,skip:s.skip||isNaN(i)||isNaN(a),radius:s.radius||o.valueAtIndexOrDefault(u.pointRadius,e,g.radius),pointStyle:s.pointStyle||o.valueAtIndexOrDefault(u.pointStyle,e,g.pointStyle),backgroundColor:r.getPointBackgroundColor(t,e),borderColor:r.getPointBorderColor(t,e),borderWidth:r.getPointBorderWidth(t,e),tension:l.dataset._model?l.dataset._model.tension:0,steppedLine:!!l.dataset._model&&l.dataset._model.steppedLine,hitRadius:s.hitRadius||o.valueAtIndexOrDefault(u.pointHitRadius,e,g.hitRadius)}},calculatePointY:function(t,e,n){var i,a,o,r=this,l=r.chart,s=r.getMeta(),u=r.getScaleForId(s.yAxisID),d=0,c=0;if(u.options.stacked){for(i=0;i<n;i++)if(a=l.data.datasets[i],"line"===(o=l.getDatasetMeta(i)).type&&o.yAxisID===u.id&&l.isDatasetVisible(i)){var h=Number(u.getRightValue(a.data[e]));h<0?c+=h||0:d+=h||0}var f=Number(u.getRightValue(t));return f<0?u.getPixelForValue(c+f):u.getPixelForValue(d+f)}return u.getPixelForValue(t)},updateBezierControlPoints:function(){function t(t,e,n){return Math.max(Math.min(t,n),e)}var e,n,i,a,r=this,l=r.getMeta(),s=r.chart.chartArea,u=l.data||[];if(l.dataset._model.spanGaps&&(u=u.filter(function(t){return!t._model.skip})),"monotone"===l.dataset._model.cubicInterpolationMode)o.splineCurveMonotone(u);else for(e=0,n=u.length;e<n;++e)i=u[e]._model,a=o.splineCurve(o.previousItem(u,e)._model,i,o.nextItem(u,e)._model,l.dataset._model.tension),i.controlPointPreviousX=a.previous.x,i.controlPointPreviousY=a.previous.y,i.controlPointNextX=a.next.x,i.controlPointNextY=a.next.y;if(r.chart.options.elements.line.capBezierPoints)for(e=0,n=u.length;e<n;++e)(i=u[e]._model).controlPointPreviousX=t(i.controlPointPreviousX,s.left,s.right),i.controlPointPreviousY=t(i.controlPointPreviousY,s.top,s.bottom),i.controlPointNextX=t(i.controlPointNextX,s.left,s.right),i.controlPointNextY=t(i.controlPointNextY,s.top,s.bottom)},draw:function(){var t=this,n=t.chart,i=t.getMeta(),a=i.data||[],r=n.chartArea,l=a.length,s=0;for(o.canvas.clipArea(n.ctx,r),e(t.getDataset(),n.options)&&i.dataset.draw(),o.canvas.unclipArea(n.ctx);s<l;++s)a[s].draw(r)},setHoverStyle:function(t){var e=this.chart.data.datasets[t._datasetIndex],n=t._index,i=t.custom||{},a=t._model;a.radius=i.hoverRadius||o.valueAtIndexOrDefault(e.pointHoverRadius,n,this.chart.options.elements.point.hoverRadius),a.backgroundColor=i.hoverBackgroundColor||o.valueAtIndexOrDefault(e.pointHoverBackgroundColor,n,o.getHoverColor(a.backgroundColor)),a.borderColor=i.hoverBorderColor||o.valueAtIndexOrDefault(e.pointHoverBorderColor,n,o.getHoverColor(a.borderColor)),a.borderWidth=i.hoverBorderWidth||o.valueAtIndexOrDefault(e.pointHoverBorderWidth,n,a.borderWidth)},removeHoverStyle:function(t){var e=this,n=e.chart.data.datasets[t._datasetIndex],i=t._index,a=t.custom||{},r=t._model;void 0!==n.radius&&void 0===n.pointRadius&&(n.pointRadius=n.radius),r.radius=a.radius||o.valueAtIndexOrDefault(n.pointRadius,i,e.chart.options.elements.point.radius),r.backgroundColor=e.getPointBackgroundColor(t,i),r.borderColor=e.getPointBorderColor(t,i),r.borderWidth=e.getPointBorderWidth(t,i)}})}},{25:25,40:40,45:45}],19:[function(t,e,n){"use strict";var i=t(25),a=t(40),o=t(45);i._set("polarArea",{scale:{type:"radialLinear",angleLines:{display:!1},gridLines:{circular:!0},pointLabels:{display:!1},ticks:{beginAtZero:!0}},animation:{animateRotate:!0,animateScale:!0},startAngle:-.5*Math.PI,legendCallback:function(t){var e=[];e.push('<ul class="'+t.id+'-legend">');var n=t.data,i=n.datasets,a=n.labels;if(i.length)for(var o=0;o<i[0].data.length;++o)e.push('<li><span style="background-color:'+i[0].backgroundColor[o]+'"></span>'),a[o]&&e.push(a[o]),e.push("</li>");return e.push("</ul>"),e.join("")},legend:{labels:{generateLabels:function(t){var e=t.data;return e.labels.length&&e.datasets.length?e.labels.map(function(n,i){var a=t.getDatasetMeta(0),r=e.datasets[0],l=a.data[i].custom||{},s=o.valueAtIndexOrDefault,u=t.options.elements.arc;return{text:n,fillStyle:l.backgroundColor?l.backgroundColor:s(r.backgroundColor,i,u.backgroundColor),strokeStyle:l.borderColor?l.borderColor:s(r.borderColor,i,u.borderColor),lineWidth:l.borderWidth?l.borderWidth:s(r.borderWidth,i,u.borderWidth),hidden:isNaN(r.data[i])||a.data[i].hidden,index:i}}):[]}},onClick:function(t,e){var n,i,a,o=e.index,r=this.chart;for(n=0,i=(r.data.datasets||[]).length;n<i;++n)(a=r.getDatasetMeta(n)).data[o].hidden=!a.data[o].hidden;r.update()}},tooltips:{callbacks:{title:function(){return""},label:function(t,e){return e.labels[t.index]+": "+t.yLabel}}}}),e.exports=function(t){t.controllers.polarArea=t.DatasetController.extend({dataElementType:a.Arc,linkScales:o.noop,update:function(t){var e=this,n=e.chart,i=n.chartArea,a=e.getMeta(),r=n.options,l=r.elements.arc,s=Math.min(i.right-i.left,i.bottom-i.top);n.outerRadius=Math.max((s-l.borderWidth/2)/2,0),n.innerRadius=Math.max(r.cutoutPercentage?n.outerRadius/100*r.cutoutPercentage:1,0),n.radiusLength=(n.outerRadius-n.innerRadius)/n.getVisibleDatasetCount(),e.outerRadius=n.outerRadius-n.radiusLength*e.index,e.innerRadius=e.outerRadius-n.radiusLength,a.count=e.countVisibleElements(),o.each(a.data,function(n,i){e.updateElement(n,i,t)})},updateElement:function(t,e,n){for(var i=this,a=i.chart,r=i.getDataset(),l=a.options,s=l.animation,u=a.scale,d=a.data.labels,c=i.calculateCircumference(r.data[e]),h=u.xCenter,f=u.yCenter,g=0,p=i.getMeta(),v=0;v<e;++v)isNaN(r.data[v])||p.data[v].hidden||++g;var m=l.startAngle,b=t.hidden?0:u.getDistanceFromCenterForValue(r.data[e]),x=m+c*g,y=x+(t.hidden?0:c),k=s.animateScale?0:u.getDistanceFromCenterForValue(r.data[e]);o.extend(t,{_datasetIndex:i.index,_index:e,_scale:u,_model:{x:h,y:f,innerRadius:0,outerRadius:n?k:b,startAngle:n&&s.animateRotate?m:x,endAngle:n&&s.animateRotate?m:y,label:o.valueAtIndexOrDefault(d,e,d[e])}}),i.removeHoverStyle(t),t.pivot()},removeHoverStyle:function(e){t.DatasetController.prototype.removeHoverStyle.call(this,e,this.chart.options.elements.arc)},countVisibleElements:function(){var t=this.getDataset(),e=this.getMeta(),n=0;return o.each(e.data,function(e,i){isNaN(t.data[i])||e.hidden||n++}),n},calculateCircumference:function(t){var e=this.getMeta().count;return e>0&&!isNaN(t)?2*Math.PI/e:0}})}},{25:25,40:40,45:45}],20:[function(t,e,n){"use strict";var i=t(25),a=t(40),o=t(45);i._set("radar",{scale:{type:"radialLinear"},elements:{line:{tension:0}}}),e.exports=function(t){t.controllers.radar=t.DatasetController.extend({datasetElementType:a.Line,dataElementType:a.Point,linkScales:o.noop,update:function(t){var e=this,n=e.getMeta(),i=n.dataset,a=n.data,r=i.custom||{},l=e.getDataset(),s=e.chart.options.elements.line,u=e.chart.scale;void 0!==l.tension&&void 0===l.lineTension&&(l.lineTension=l.tension),o.extend(n.dataset,{_datasetIndex:e.index,_scale:u,_children:a,_loop:!0,_model:{tension:r.tension?r.tension:o.valueOrDefault(l.lineTension,s.tension),backgroundColor:r.backgroundColor?r.backgroundColor:l.backgroundColor||s.backgroundColor,borderWidth:r.borderWidth?r.borderWidth:l.borderWidth||s.borderWidth,borderColor:r.borderColor?r.borderColor:l.borderColor||s.borderColor,fill:r.fill?r.fill:void 0!==l.fill?l.fill:s.fill,borderCapStyle:r.borderCapStyle?r.borderCapStyle:l.borderCapStyle||s.borderCapStyle,borderDash:r.borderDash?r.borderDash:l.borderDash||s.borderDash,borderDashOffset:r.borderDashOffset?r.borderDashOffset:l.borderDashOffset||s.borderDashOffset,borderJoinStyle:r.borderJoinStyle?r.borderJoinStyle:l.borderJoinStyle||s.borderJoinStyle}}),n.dataset.pivot(),o.each(a,function(n,i){e.updateElement(n,i,t)},e),e.updateBezierControlPoints()},updateElement:function(t,e,n){var i=this,a=t.custom||{},r=i.getDataset(),l=i.chart.scale,s=i.chart.options.elements.point,u=l.getPointPositionForValue(e,r.data[e]);void 0!==r.radius&&void 0===r.pointRadius&&(r.pointRadius=r.radius),void 0!==r.hitRadius&&void 0===r.pointHitRadius&&(r.pointHitRadius=r.hitRadius),o.extend(t,{_datasetIndex:i.index,_index:e,_scale:l,_model:{x:n?l.xCenter:u.x,y:n?l.yCenter:u.y,tension:a.tension?a.tension:o.valueOrDefault(r.lineTension,i.chart.options.elements.line.tension),radius:a.radius?a.radius:o.valueAtIndexOrDefault(r.pointRadius,e,s.radius),backgroundColor:a.backgroundColor?a.backgroundColor:o.valueAtIndexOrDefault(r.pointBackgroundColor,e,s.backgroundColor),borderColor:a.borderColor?a.borderColor:o.valueAtIndexOrDefault(r.pointBorderColor,e,s.borderColor),borderWidth:a.borderWidth?a.borderWidth:o.valueAtIndexOrDefault(r.pointBorderWidth,e,s.borderWidth),pointStyle:a.pointStyle?a.pointStyle:o.valueAtIndexOrDefault(r.pointStyle,e,s.pointStyle),hitRadius:a.hitRadius?a.hitRadius:o.valueAtIndexOrDefault(r.pointHitRadius,e,s.hitRadius)}}),t._model.skip=a.skip?a.skip:isNaN(t._model.x)||isNaN(t._model.y)},updateBezierControlPoints:function(){var t=this.chart.chartArea,e=this.getMeta();o.each(e.data,function(n,i){var a=n._model,r=o.splineCurve(o.previousItem(e.data,i,!0)._model,a,o.nextItem(e.data,i,!0)._model,a.tension);a.controlPointPreviousX=Math.max(Math.min(r.previous.x,t.right),t.left),a.controlPointPreviousY=Math.max(Math.min(r.previous.y,t.bottom),t.top),a.controlPointNextX=Math.max(Math.min(r.next.x,t.right),t.left),a.controlPointNextY=Math.max(Math.min(r.next.y,t.bottom),t.top),n.pivot()})},setHoverStyle:function(t){var e=this.chart.data.datasets[t._datasetIndex],n=t.custom||{},i=t._index,a=t._model;a.radius=n.hoverRadius?n.hoverRadius:o.valueAtIndexOrDefault(e.pointHoverRadius,i,this.chart.options.elements.point.hoverRadius),a.backgroundColor=n.hoverBackgroundColor?n.hoverBackgroundColor:o.valueAtIndexOrDefault(e.pointHoverBackgroundColor,i,o.getHoverColor(a.backgroundColor)),a.borderColor=n.hoverBorderColor?n.hoverBorderColor:o.valueAtIndexOrDefault(e.pointHoverBorderColor,i,o.getHoverColor(a.borderColor)),a.borderWidth=n.hoverBorderWidth?n.hoverBorderWidth:o.valueAtIndexOrDefault(e.pointHoverBorderWidth,i,a.borderWidth)},removeHoverStyle:function(t){var e=this.chart.data.datasets[t._datasetIndex],n=t.custom||{},i=t._index,a=t._model,r=this.chart.options.elements.point;a.radius=n.radius?n.radius:o.valueAtIndexOrDefault(e.pointRadius,i,r.radius),a.backgroundColor=n.backgroundColor?n.backgroundColor:o.valueAtIndexOrDefault(e.pointBackgroundColor,i,r.backgroundColor),a.borderColor=n.borderColor?n.borderColor:o.valueAtIndexOrDefault(e.pointBorderColor,i,r.borderColor),a.borderWidth=n.borderWidth?n.borderWidth:o.valueAtIndexOrDefault(e.pointBorderWidth,i,r.borderWidth)}})}},{25:25,40:40,45:45}],21:[function(t,e,n){"use strict";t(25)._set("scatter",{hover:{mode:"single"},scales:{xAxes:[{id:"x-axis-1",type:"linear",position:"bottom"}],yAxes:[{id:"y-axis-1",type:"linear",position:"left"}]},showLines:!1,tooltips:{callbacks:{title:function(){return""},label:function(t){return"("+t.xLabel+", "+t.yLabel+")"}}}}),e.exports=function(t){t.controllers.scatter=t.controllers.line}},{25:25}],22:[function(t,e,n){"use strict";var i=t(25),a=t(26),o=t(45);i._set("global",{animation:{duration:1e3,easing:"easeOutQuart",onProgress:o.noop,onComplete:o.noop}}),e.exports=function(t){t.Animation=a.extend({chart:null,currentStep:0,numSteps:60,easing:"",render:null,onAnimationProgress:null,onAnimationComplete:null}),t.animationService={frameDuration:17,animations:[],dropFrames:0,request:null,addAnimation:function(t,e,n,i){var a,o,r=this.animations;for(e.chart=t,i||(t.animating=!0),a=0,o=r.length;a<o;++a)if(r[a].chart===t)return void(r[a]=e);r.push(e),1===r.length&&this.requestAnimationFrame()},cancelAnimation:function(t){var e=o.findIndex(this.animations,function(e){return e.chart===t});-1!==e&&(this.animations.splice(e,1),t.animating=!1)},requestAnimationFrame:function(){var t=this;null===t.request&&(t.request=o.requestAnimFrame.call(window,function(){t.request=null,t.startDigest()}))},startDigest:function(){var t=this,e=Date.now(),n=0;t.dropFrames>1&&(n=Math.floor(t.dropFrames),t.dropFrames=t.dropFrames%1),t.advance(1+n);var i=Date.now();t.dropFrames+=(i-e)/t.frameDuration,t.animations.length>0&&t.requestAnimationFrame()},advance:function(t){for(var e,n,i=this.animations,a=0;a<i.length;)n=(e=i[a]).chart,e.currentStep=(e.currentStep||0)+t,e.currentStep=Math.min(e.currentStep,e.numSteps),o.callback(e.render,[n,e],n),o.callback(e.onAnimationProgress,[e],n),e.currentStep>=e.numSteps?(o.callback(e.onAnimationComplete,[e],n),n.animating=!1,i.splice(a,1)):++a}},Object.defineProperty(t.Animation.prototype,"animationObject",{get:function(){return this}}),Object.defineProperty(t.Animation.prototype,"chartInstance",{get:function(){return this.chart},set:function(t){this.chart=t}})}},{25:25,26:26,45:45}],23:[function(t,e,n){"use strict";var i=t(25),a=t(45),o=t(28),r=t(48);e.exports=function(t){function e(t){var e=(t=t||{}).data=t.data||{};return e.datasets=e.datasets||[],e.labels=e.labels||[],t.options=a.configMerge(i.global,i[t.type],t.options||{}),t}function n(t){var e=t.options;e.scale?t.scale.options=e.scale:e.scales&&e.scales.xAxes.concat(e.scales.yAxes).forEach(function(e){t.scales[e.id].options=e}),t.tooltip._options=e.tooltips}function l(t){return"top"===t||"bottom"===t}var s=t.plugins;t.types={},t.instances={},t.controllers={},a.extend(t.prototype,{construct:function(n,i){var o=this;i=e(i);var l=r.acquireContext(n,i),s=l&&l.canvas,u=s&&s.height,d=s&&s.width;o.id=a.uid(),o.ctx=l,o.canvas=s,o.config=i,o.width=d,o.height=u,o.aspectRatio=u?d/u:null,o.options=i.options,o._bufferedRender=!1,o.chart=o,o.controller=o,t.instances[o.id]=o,Object.defineProperty(o,"data",{get:function(){return o.config.data},set:function(t){o.config.data=t}}),l&&s?(o.initialize(),o.update()):console.error("Failed to create chart: can't acquire context from the given item")},initialize:function(){var t=this;return s.notify(t,"beforeInit"),a.retinaScale(t,t.options.devicePixelRatio),t.bindEvents(),t.options.responsive&&t.resize(!0),t.ensureScalesHaveIDs(),t.buildScales(),t.initToolTip(),s.notify(t,"afterInit"),t},clear:function(){return a.canvas.clear(this),this},stop:function(){return t.animationService.cancelAnimation(this),this},resize:function(t){var e=this,n=e.options,i=e.canvas,o=n.maintainAspectRatio&&e.aspectRatio||null,r=Math.max(0,Math.floor(a.getMaximumWidth(i))),l=Math.max(0,Math.floor(o?r/o:a.getMaximumHeight(i)));if((e.width!==r||e.height!==l)&&(i.width=e.width=r,i.height=e.height=l,i.style.width=r+"px",i.style.height=l+"px",a.retinaScale(e,n.devicePixelRatio),!t)){var u={width:r,height:l};s.notify(e,"resize",[u]),e.options.onResize&&e.options.onResize(e,u),e.stop(),e.update(e.options.responsiveAnimationDuration)}},ensureScalesHaveIDs:function(){var t=this.options,e=t.scales||{},n=t.scale;a.each(e.xAxes,function(t,e){t.id=t.id||"x-axis-"+e}),a.each(e.yAxes,function(t,e){t.id=t.id||"y-axis-"+e}),n&&(n.id=n.id||"scale")},buildScales:function(){var e=this,n=e.options,i=e.scales={},o=[];n.scales&&(o=o.concat((n.scales.xAxes||[]).map(function(t){return{options:t,dtype:"category",dposition:"bottom"}}),(n.scales.yAxes||[]).map(function(t){return{options:t,dtype:"linear",dposition:"left"}}))),n.scale&&o.push({options:n.scale,dtype:"radialLinear",isDefault:!0,dposition:"chartArea"}),a.each(o,function(n){var o=n.options,r=a.valueOrDefault(o.type,n.dtype),s=t.scaleService.getScaleConstructor(r);if(s){l(o.position)!==l(n.dposition)&&(o.position=n.dposition);var u=new s({id:o.id,options:o,ctx:e.ctx,chart:e});i[u.id]=u,u.mergeTicksOptions(),n.isDefault&&(e.scale=u)}}),t.scaleService.addScalesToLayout(this)},buildOrUpdateControllers:function(){var e=this,n=[],i=[];return a.each(e.data.datasets,function(a,o){var r=e.getDatasetMeta(o),l=a.type||e.config.type;if(r.type&&r.type!==l&&(e.destroyDatasetMeta(o),r=e.getDatasetMeta(o)),r.type=l,n.push(r.type),r.controller)r.controller.updateIndex(o);else{var s=t.controllers[r.type];if(void 0===s)throw new Error('"'+r.type+'" is not a chart type.');r.controller=new s(e,o),i.push(r.controller)}},e),i},resetElements:function(){var t=this;a.each(t.data.datasets,function(e,n){t.getDatasetMeta(n).controller.reset()},t)},reset:function(){this.resetElements(),this.tooltip.initialize()},update:function(t){var e=this;if(t&&"object"==typeof t||(t={duration:t,lazy:arguments[1]}),n(e),!1!==s.notify(e,"beforeUpdate")){e.tooltip._data=e.data;var i=e.buildOrUpdateControllers();a.each(e.data.datasets,function(t,n){e.getDatasetMeta(n).controller.buildOrUpdateElements()},e),e.updateLayout(),a.each(i,function(t){t.reset()}),e.updateDatasets(),s.notify(e,"afterUpdate"),e._bufferedRender?e._bufferedRequest={duration:t.duration,easing:t.easing,lazy:t.lazy}:e.render(t)}},updateLayout:function(){var e=this;!1!==s.notify(e,"beforeLayout")&&(t.layoutService.update(this,this.width,this.height),s.notify(e,"afterScaleUpdate"),s.notify(e,"afterLayout"))},updateDatasets:function(){var t=this;if(!1!==s.notify(t,"beforeDatasetsUpdate")){for(var e=0,n=t.data.datasets.length;e<n;++e)t.updateDataset(e);s.notify(t,"afterDatasetsUpdate")}},updateDataset:function(t){var e=this,n=e.getDatasetMeta(t),i={meta:n,index:t};!1!==s.notify(e,"beforeDatasetUpdate",[i])&&(n.controller.update(),s.notify(e,"afterDatasetUpdate",[i]))},render:function(e){var n=this;e&&"object"==typeof e||(e={duration:e,lazy:arguments[1]});var i=e.duration,o=e.lazy;if(!1!==s.notify(n,"beforeRender")){var r=n.options.animation,l=function(t){s.notify(n,"afterRender"),a.callback(r&&r.onComplete,[t],n)};if(r&&(void 0!==i&&0!==i||void 0===i&&0!==r.duration)){var u=new t.Animation({numSteps:(i||r.duration)/16.66,easing:e.easing||r.easing,render:function(t,e){var n=a.easing.effects[e.easing],i=e.currentStep,o=i/e.numSteps;t.draw(n(o),o,i)},onAnimationProgress:r.onProgress,onAnimationComplete:l});t.animationService.addAnimation(n,u,i,o)}else n.draw(),l(new t.Animation({numSteps:0,chart:n}));return n}},draw:function(t){var e=this;e.clear(),a.isNullOrUndef(t)&&(t=1),e.transition(t),!1!==s.notify(e,"beforeDraw",[t])&&(a.each(e.boxes,function(t){t.draw(e.chartArea)},e),e.scale&&e.scale.draw(),e.drawDatasets(t),e.tooltip.draw(),s.notify(e,"afterDraw",[t]))},transition:function(t){for(var e=this,n=0,i=(e.data.datasets||[]).length;n<i;++n)e.isDatasetVisible(n)&&e.getDatasetMeta(n).controller.transition(t);e.tooltip.transition(t)},drawDatasets:function(t){var e=this;if(!1!==s.notify(e,"beforeDatasetsDraw",[t])){for(var n=(e.data.datasets||[]).length-1;n>=0;--n)e.isDatasetVisible(n)&&e.drawDataset(n,t);s.notify(e,"afterDatasetsDraw",[t])}},drawDataset:function(t,e){var n=this,i=n.getDatasetMeta(t),a={meta:i,index:t,easingValue:e};!1!==s.notify(n,"beforeDatasetDraw",[a])&&(i.controller.draw(e),s.notify(n,"afterDatasetDraw",[a]))},getElementAtEvent:function(t){return o.modes.single(this,t)},getElementsAtEvent:function(t){return o.modes.label(this,t,{intersect:!0})},getElementsAtXAxis:function(t){return o.modes["x-axis"](this,t,{intersect:!0})},getElementsAtEventForMode:function(t,e,n){var i=o.modes[e];return"function"==typeof i?i(this,t,n):[]},getDatasetAtEvent:function(t){return o.modes.dataset(this,t,{intersect:!0})},getDatasetMeta:function(t){var e=this,n=e.data.datasets[t];n._meta||(n._meta={});var i=n._meta[e.id];return i||(i=n._meta[e.id]={type:null,data:[],dataset:null,controller:null,hidden:null,xAxisID:null,yAxisID:null}),i},getVisibleDatasetCount:function(){for(var t=0,e=0,n=this.data.datasets.length;e<n;++e)this.isDatasetVisible(e)&&t++;return t},isDatasetVisible:function(t){var e=this.getDatasetMeta(t);return"boolean"==typeof e.hidden?!e.hidden:!this.data.datasets[t].hidden},generateLegend:function(){return this.options.legendCallback(this)},destroyDatasetMeta:function(t){var e=this.id,n=this.data.datasets[t],i=n._meta&&n._meta[e];i&&(i.controller.destroy(),delete n._meta[e])},destroy:function(){var e,n,i=this,o=i.canvas;for(i.stop(),e=0,n=i.data.datasets.length;e<n;++e)i.destroyDatasetMeta(e);o&&(i.unbindEvents(),a.canvas.clear(i),r.releaseContext(i.ctx),i.canvas=null,i.ctx=null),s.notify(i,"destroy"),delete t.instances[i.id]},toBase64Image:function(){return this.canvas.toDataURL.apply(this.canvas,arguments)},initToolTip:function(){var e=this;e.tooltip=new t.Tooltip({_chart:e,_chartInstance:e,_data:e.data,_options:e.options.tooltips},e)},bindEvents:function(){var t=this,e=t._listeners={},n=function(){t.eventHandler.apply(t,arguments)};a.each(t.options.events,function(i){r.addEventListener(t,i,n),e[i]=n}),t.options.responsive&&(n=function(){t.resize()},r.addEventListener(t,"resize",n),e.resize=n)},unbindEvents:function(){var t=this,e=t._listeners;e&&(delete t._listeners,a.each(e,function(e,n){r.removeEventListener(t,n,e)}))},updateHoverStyle:function(t,e,n){var i,a,o,r=n?"setHoverStyle":"removeHoverStyle";for(a=0,o=t.length;a<o;++a)(i=t[a])&&this.getDatasetMeta(i._datasetIndex).controller[r](i)},eventHandler:function(t){var e=this,n=e.tooltip;if(!1!==s.notify(e,"beforeEvent",[t])){e._bufferedRender=!0,e._bufferedRequest=null;var i=e.handleEvent(t);i|=n&&n.handleEvent(t),s.notify(e,"afterEvent",[t]);var a=e._bufferedRequest;return a?e.render(a):i&&!e.animating&&(e.stop(),e.render(e.options.hover.animationDuration,!0)),e._bufferedRender=!1,e._bufferedRequest=null,e}},handleEvent:function(t){var e=this,n=e.options||{},i=n.hover,o=!1;return e.lastActive=e.lastActive||[],"mouseout"===t.type?e.active=[]:e.active=e.getElementsAtEventForMode(t,i.mode,i),a.callback(n.onHover||n.hover.onHover,[t.native,e.active],e),"mouseup"!==t.type&&"click"!==t.type||n.onClick&&n.onClick.call(e,t.native,e.active),e.lastActive.length&&e.updateHoverStyle(e.lastActive,i.mode,!1),e.active.length&&i.mode&&e.updateHoverStyle(e.active,i.mode,!0),o=!a.arrayEquals(e.active,e.lastActive),e.lastActive=e.active,o}}),t.Controller=t}},{25:25,28:28,45:45,48:48}],24:[function(t,e,n){"use strict";var i=t(45);e.exports=function(t){function e(t,e){t._chartjs?t._chartjs.listeners.push(e):(Object.defineProperty(t,"_chartjs",{configurable:!0,enumerable:!1,value:{listeners:[e]}}),a.forEach(function(e){var n="onData"+e.charAt(0).toUpperCase()+e.slice(1),a=t[e];Object.defineProperty(t,e,{configurable:!0,enumerable:!1,value:function(){var e=Array.prototype.slice.call(arguments),o=a.apply(this,e);return i.each(t._chartjs.listeners,function(t){"function"==typeof t[n]&&t[n].apply(t,e)}),o}})}))}function n(t,e){var n=t._chartjs;if(n){var i=n.listeners,o=i.indexOf(e);-1!==o&&i.splice(o,1),i.length>0||(a.forEach(function(e){delete t[e]}),delete t._chartjs)}}var a=["push","pop","shift","splice","unshift"];t.DatasetController=function(t,e){this.initialize(t,e)},i.extend(t.DatasetController.prototype,{datasetElementType:null,dataElementType:null,initialize:function(t,e){var n=this;n.chart=t,n.index=e,n.linkScales(),n.addElements()},updateIndex:function(t){this.index=t},linkScales:function(){var t=this,e=t.getMeta(),n=t.getDataset();null===e.xAxisID&&(e.xAxisID=n.xAxisID||t.chart.options.scales.xAxes[0].id),null===e.yAxisID&&(e.yAxisID=n.yAxisID||t.chart.options.scales.yAxes[0].id)},getDataset:function(){return this.chart.data.datasets[this.index]},getMeta:function(){return this.chart.getDatasetMeta(this.index)},getScaleForId:function(t){return this.chart.scales[t]},reset:function(){this.update(!0)},destroy:function(){this._data&&n(this._data,this)},createMetaDataset:function(){var t=this,e=t.datasetElementType;return e&&new e({_chart:t.chart,_datasetIndex:t.index})},createMetaData:function(t){var e=this,n=e.dataElementType;return n&&new n({_chart:e.chart,_datasetIndex:e.index,_index:t})},addElements:function(){var t,e,n=this,i=n.getMeta(),a=n.getDataset().data||[],o=i.data;for(t=0,e=a.length;t<e;++t)o[t]=o[t]||n.createMetaData(t);i.dataset=i.dataset||n.createMetaDataset()},addElementAndReset:function(t){var e=this.createMetaData(t);this.getMeta().data.splice(t,0,e),this.updateElement(e,t,!0)},buildOrUpdateElements:function(){var t=this,i=t.getDataset(),a=i.data||(i.data=[]);t._data!==a&&(t._data&&n(t._data,t),e(a,t),t._data=a),t.resyncElements()},update:i.noop,transition:function(t){for(var e=this.getMeta(),n=e.data||[],i=n.length,a=0;a<i;++a)n[a].transition(t);e.dataset&&e.dataset.transition(t)},draw:function(){var t=this.getMeta(),e=t.data||[],n=e.length,i=0;for(t.dataset&&t.dataset.draw();i<n;++i)e[i].draw()},removeHoverStyle:function(t,e){var n=this.chart.data.datasets[t._datasetIndex],a=t._index,o=t.custom||{},r=i.valueAtIndexOrDefault,l=t._model;l.backgroundColor=o.backgroundColor?o.backgroundColor:r(n.backgroundColor,a,e.backgroundColor),l.borderColor=o.borderColor?o.borderColor:r(n.borderColor,a,e.borderColor),l.borderWidth=o.borderWidth?o.borderWidth:r(n.borderWidth,a,e.borderWidth)},setHoverStyle:function(t){var e=this.chart.data.datasets[t._datasetIndex],n=t._index,a=t.custom||{},o=i.valueAtIndexOrDefault,r=i.getHoverColor,l=t._model;l.backgroundColor=a.hoverBackgroundColor?a.hoverBackgroundColor:o(e.hoverBackgroundColor,n,r(l.backgroundColor)),l.borderColor=a.hoverBorderColor?a.hoverBorderColor:o(e.hoverBorderColor,n,r(l.borderColor)),l.borderWidth=a.hoverBorderWidth?a.hoverBorderWidth:o(e.hoverBorderWidth,n,l.borderWidth)},resyncElements:function(){var t=this,e=t.getMeta(),n=t.getDataset().data,i=e.data.length,a=n.length;a<i?e.data.splice(a,i-a):a>i&&t.insertElements(i,a-i)},insertElements:function(t,e){for(var n=0;n<e;++n)this.addElementAndReset(t+n)},onDataPush:function(){this.insertElements(this.getDataset().data.length-1,arguments.length)},onDataPop:function(){this.getMeta().data.pop()},onDataShift:function(){this.getMeta().data.shift()},onDataSplice:function(t,e){this.getMeta().data.splice(t,e),this.insertElements(t,arguments.length-2)},onDataUnshift:function(){this.insertElements(0,arguments.length)}}),t.DatasetController.extend=i.inherits}},{45:45}],25:[function(t,e,n){"use strict";var i=t(45);e.exports={_set:function(t,e){return i.merge(this[t]||(this[t]={}),e)}}},{45:45}],26:[function(t,e,n){"use strict";function i(t,e,n,i){var o,r,l,s,u,d,c,h,f,g=Object.keys(n);for(o=0,r=g.length;o<r;++o)if(l=g[o],d=n[l],e.hasOwnProperty(l)||(e[l]=d),(s=e[l])!==d&&"_"!==l[0]){if(t.hasOwnProperty(l)||(t[l]=s),u=t[l],(c=typeof d)===typeof u)if("string"===c){if((h=a(u)).valid&&(f=a(d)).valid){e[l]=f.mix(h,i).rgbString();continue}}else if("number"===c&&isFinite(u)&&isFinite(d)){e[l]=u+(d-u)*i;continue}e[l]=d}}var a=t(3),o=t(45),r=function(t){o.extend(this,t),this.initialize.apply(this,arguments)};o.extend(r.prototype,{initialize:function(){this.hidden=!1},pivot:function(){var t=this;return t._view||(t._view=o.clone(t._model)),t._start={},t},transition:function(t){var e=this,n=e._model,a=e._start,o=e._view;return n&&1!==t?(o||(o=e._view={}),a||(a=e._start={}),i(a,o,n,t),e):(e._view=n,e._start=null,e)},tooltipPosition:function(){return{x:this._model.x,y:this._model.y}},hasValue:function(){return o.isNumber(this._model.x)&&o.isNumber(this._model.y)}}),r.extend=o.inherits,e.exports=r},{3:3,45:45}],27:[function(t,e,n){"use strict";var i=t(3),a=t(25),o=t(45);e.exports=function(t){function e(t,e,n){var i;return"string"==typeof t?(i=parseInt(t,10),-1!==t.indexOf("%")&&(i=i/100*e.parentNode[n])):i=t,i}function n(t){return void 0!==t&&null!==t&&"none"!==t}function r(t,i,a){var o=document.defaultView,r=t.parentNode,l=o.getComputedStyle(t)[i],s=o.getComputedStyle(r)[i],u=n(l),d=n(s),c=Number.POSITIVE_INFINITY;return u||d?Math.min(u?e(l,t,a):c,d?e(s,r,a):c):"none"}o.extend=function(t){for(var e=1,n=arguments.length;e<n;e++)o.each(arguments[e],function(e,n){t[n]=e});return t},o.configMerge=function(){return o.merge(o.clone(arguments[0]),[].slice.call(arguments,1),{merger:function(e,n,i,a){var r=n[e]||{},l=i[e];"scales"===e?n[e]=o.scaleMerge(r,l):"scale"===e?n[e]=o.merge(r,[t.scaleService.getScaleDefaults(l.type),l]):o._merger(e,n,i,a)}})},o.scaleMerge=function(){return o.merge(o.clone(arguments[0]),[].slice.call(arguments,1),{merger:function(e,n,i,a){if("xAxes"===e||"yAxes"===e){var r,l,s,u=i[e].length;for(n[e]||(n[e]=[]),r=0;r<u;++r)s=i[e][r],l=o.valueOrDefault(s.type,"xAxes"===e?"category":"linear"),r>=n[e].length&&n[e].push({}),!n[e][r].type||s.type&&s.type!==n[e][r].type?o.merge(n[e][r],[t.scaleService.getScaleDefaults(l),s]):o.merge(n[e][r],s)}else o._merger(e,n,i,a)}})},o.where=function(t,e){if(o.isArray(t)&&Array.prototype.filter)return t.filter(e);var n=[];return o.each(t,function(t){e(t)&&n.push(t)}),n},o.findIndex=Array.prototype.findIndex?function(t,e,n){return t.findIndex(e,n)}:function(t,e,n){n=void 0===n?t:n;for(var i=0,a=t.length;i<a;++i)if(e.call(n,t[i],i,t))return i;return-1},o.findNextWhere=function(t,e,n){o.isNullOrUndef(n)&&(n=-1);for(var i=n+1;i<t.length;i++){var a=t[i];if(e(a))return a}},o.findPreviousWhere=function(t,e,n){o.isNullOrUndef(n)&&(n=t.length);for(var i=n-1;i>=0;i--){var a=t[i];if(e(a))return a}},o.inherits=function(t){var e=this,n=t&&t.hasOwnProperty("constructor")?t.constructor:function(){return e.apply(this,arguments)},i=function(){this.constructor=n};return i.prototype=e.prototype,n.prototype=new i,n.extend=o.inherits,t&&o.extend(n.prototype,t),n.__super__=e.prototype,n},o.isNumber=function(t){return!isNaN(parseFloat(t))&&isFinite(t)},o.almostEquals=function(t,e,n){return Math.abs(t-e)<n},o.almostWhole=function(t,e){var n=Math.round(t);return n-e<t&&n+e>t},o.max=function(t){return t.reduce(function(t,e){return isNaN(e)?t:Math.max(t,e)},Number.NEGATIVE_INFINITY)},o.min=function(t){return t.reduce(function(t,e){return isNaN(e)?t:Math.min(t,e)},Number.POSITIVE_INFINITY)},o.sign=Math.sign?function(t){return Math.sign(t)}:function(t){return 0==(t=+t)||isNaN(t)?t:t>0?1:-1},o.log10=Math.log10?function(t){return Math.log10(t)}:function(t){return Math.log(t)/Math.LN10},o.toRadians=function(t){return t*(Math.PI/180)},o.toDegrees=function(t){return t*(180/Math.PI)},o.getAngleFromPoint=function(t,e){var n=e.x-t.x,i=e.y-t.y,a=Math.sqrt(n*n+i*i),o=Math.atan2(i,n);return o<-.5*Math.PI&&(o+=2*Math.PI),{angle:o,distance:a}},o.distanceBetweenPoints=function(t,e){return Math.sqrt(Math.pow(e.x-t.x,2)+Math.pow(e.y-t.y,2))},o.aliasPixel=function(t){return t%2==0?0:.5},o.splineCurve=function(t,e,n,i){var a=t.skip?e:t,o=e,r=n.skip?e:n,l=Math.sqrt(Math.pow(o.x-a.x,2)+Math.pow(o.y-a.y,2)),s=Math.sqrt(Math.pow(r.x-o.x,2)+Math.pow(r.y-o.y,2)),u=l/(l+s),d=s/(l+s),c=i*(u=isNaN(u)?0:u),h=i*(d=isNaN(d)?0:d);return{previous:{x:o.x-c*(r.x-a.x),y:o.y-c*(r.y-a.y)},next:{x:o.x+h*(r.x-a.x),y:o.y+h*(r.y-a.y)}}},o.EPSILON=Number.EPSILON||1e-14,o.splineCurveMonotone=function(t){var e,n,i,a,r=(t||[]).map(function(t){return{model:t._model,deltaK:0,mK:0}}),l=r.length;for(e=0;e<l;++e)if(!(i=r[e]).model.skip){if(n=e>0?r[e-1]:null,(a=e<l-1?r[e+1]:null)&&!a.model.skip){var s=a.model.x-i.model.x;i.deltaK=0!==s?(a.model.y-i.model.y)/s:0}!n||n.model.skip?i.mK=i.deltaK:!a||a.model.skip?i.mK=n.deltaK:this.sign(n.deltaK)!==this.sign(i.deltaK)?i.mK=0:i.mK=(n.deltaK+i.deltaK)/2}var u,d,c,h;for(e=0;e<l-1;++e)i=r[e],a=r[e+1],i.model.skip||a.model.skip||(o.almostEquals(i.deltaK,0,this.EPSILON)?i.mK=a.mK=0:(u=i.mK/i.deltaK,d=a.mK/i.deltaK,(h=Math.pow(u,2)+Math.pow(d,2))<=9||(c=3/Math.sqrt(h),i.mK=u*c*i.deltaK,a.mK=d*c*i.deltaK)));var f;for(e=0;e<l;++e)(i=r[e]).model.skip||(n=e>0?r[e-1]:null,a=e<l-1?r[e+1]:null,n&&!n.model.skip&&(f=(i.model.x-n.model.x)/3,i.model.controlPointPreviousX=i.model.x-f,i.model.controlPointPreviousY=i.model.y-f*i.mK),a&&!a.model.skip&&(f=(a.model.x-i.model.x)/3,i.model.controlPointNextX=i.model.x+f,i.model.controlPointNextY=i.model.y+f*i.mK))},o.nextItem=function(t,e,n){return n?e>=t.length-1?t[0]:t[e+1]:e>=t.length-1?t[t.length-1]:t[e+1]},o.previousItem=function(t,e,n){return n?e<=0?t[t.length-1]:t[e-1]:e<=0?t[0]:t[e-1]},o.niceNum=function(t,e){var n=Math.floor(o.log10(t)),i=t/Math.pow(10,n);return(e?i<1.5?1:i<3?2:i<7?5:10:i<=1?1:i<=2?2:i<=5?5:10)*Math.pow(10,n)},o.requestAnimFrame="undefined"==typeof window?function(t){t()}:window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(t){return window.setTimeout(t,1e3/60)},o.getRelativePosition=function(t,e){var n,i,a=t.originalEvent||t,r=t.currentTarget||t.srcElement,l=r.getBoundingClientRect(),s=a.touches;s&&s.length>0?(n=s[0].clientX,i=s[0].clientY):(n=a.clientX,i=a.clientY);var u=parseFloat(o.getStyle(r,"padding-left")),d=parseFloat(o.getStyle(r,"padding-top")),c=parseFloat(o.getStyle(r,"padding-right")),h=parseFloat(o.getStyle(r,"padding-bottom")),f=l.right-l.left-u-c,g=l.bottom-l.top-d-h;return n=Math.round((n-l.left-u)/f*r.width/e.currentDevicePixelRatio),i=Math.round((i-l.top-d)/g*r.height/e.currentDevicePixelRatio),{x:n,y:i}},o.getConstraintWidth=function(t){return r(t,"max-width","clientWidth")},o.getConstraintHeight=function(t){return r(t,"max-height","clientHeight")},o.getMaximumWidth=function(t){var e=t.parentNode;if(!e)return t.clientWidth;var n=parseInt(o.getStyle(e,"padding-left"),10),i=parseInt(o.getStyle(e,"padding-right"),10),a=e.clientWidth-n-i,r=o.getConstraintWidth(t);return isNaN(r)?a:Math.min(a,r)},o.getMaximumHeight=function(t){var e=t.parentNode;if(!e)return t.clientHeight;var n=parseInt(o.getStyle(e,"padding-top"),10),i=parseInt(o.getStyle(e,"padding-bottom"),10),a=e.clientHeight-n-i,r=o.getConstraintHeight(t);return isNaN(r)?a:Math.min(a,r)},o.getStyle=function(t,e){return t.currentStyle?t.currentStyle[e]:document.defaultView.getComputedStyle(t,null).getPropertyValue(e)},o.retinaScale=function(t,e){var n=t.currentDevicePixelRatio=e||window.devicePixelRatio||1;if(1!==n){var i=t.canvas,a=t.height,o=t.width;i.height=a*n,i.width=o*n,t.ctx.scale(n,n),i.style.height=a+"px",i.style.width=o+"px"}},o.fontString=function(t,e,n){return e+" "+t+"px "+n},o.longestText=function(t,e,n,i){var a=(i=i||{}).data=i.data||{},r=i.garbageCollect=i.garbageCollect||[];i.font!==e&&(a=i.data={},r=i.garbageCollect=[],i.font=e),t.font=e;var l=0;o.each(n,function(e){void 0!==e&&null!==e&&!0!==o.isArray(e)?l=o.measureText(t,a,r,l,e):o.isArray(e)&&o.each(e,function(e){void 0===e||null===e||o.isArray(e)||(l=o.measureText(t,a,r,l,e))})});var s=r.length/2;if(s>n.length){for(var u=0;u<s;u++)delete a[r[u]];r.splice(0,s)}return l},o.measureText=function(t,e,n,i,a){var o=e[a];return o||(o=e[a]=t.measureText(a).width,n.push(a)),o>i&&(i=o),i},o.numberOfLabelLines=function(t){var e=1;return o.each(t,function(t){o.isArray(t)&&t.length>e&&(e=t.length)}),e},o.color=i?function(t){return t instanceof CanvasGradient&&(t=a.global.defaultColor),i(t)}:function(t){return console.error("Color.js not found!"),t},o.getHoverColor=function(t){return t instanceof CanvasPattern?t:o.color(t).saturate(.5).darken(.1).rgbString()}}},{25:25,3:3,45:45}],28:[function(t,e,n){"use strict";function i(t,e){return t.native?{x:t.x,y:t.y}:u.getRelativePosition(t,e)}function a(t,e){var n,i,a,o,r;for(i=0,o=t.data.datasets.length;i<o;++i)if(t.isDatasetVisible(i))for(a=0,r=(n=t.getDatasetMeta(i)).data.length;a<r;++a){var l=n.data[a];l._view.skip||e(l)}}function o(t,e){var n=[];return a(t,function(t){t.inRange(e.x,e.y)&&n.push(t)}),n}function r(t,e,n,i){var o=Number.POSITIVE_INFINITY,r=[];return a(t,function(t){if(!n||t.inRange(e.x,e.y)){var a=t.getCenterPoint(),l=i(e,a);l<o?(r=[t],o=l):l===o&&r.push(t)}}),r}function l(t){var e=-1!==t.indexOf("x"),n=-1!==t.indexOf("y");return function(t,i){var a=e?Math.abs(t.x-i.x):0,o=n?Math.abs(t.y-i.y):0;return Math.sqrt(Math.pow(a,2)+Math.pow(o,2))}}function s(t,e,n){var a=i(e,t);n.axis=n.axis||"x";var s=l(n.axis),u=n.intersect?o(t,a):r(t,a,!1,s),d=[];return u.length?(t.data.datasets.forEach(function(e,n){if(t.isDatasetVisible(n)){var i=t.getDatasetMeta(n).data[u[0]._index];i&&!i._view.skip&&d.push(i)}}),d):[]}var u=t(45);e.exports={modes:{single:function(t,e){var n=i(e,t),o=[];return a(t,function(t){if(t.inRange(n.x,n.y))return o.push(t),o}),o.slice(0,1)},label:s,index:s,dataset:function(t,e,n){var a=i(e,t);n.axis=n.axis||"xy";var s=l(n.axis),u=n.intersect?o(t,a):r(t,a,!1,s);return u.length>0&&(u=t.getDatasetMeta(u[0]._datasetIndex).data),u},"x-axis":function(t,e){return s(t,e,{intersect:!0})},point:function(t,e){return o(t,i(e,t))},nearest:function(t,e,n){var a=i(e,t);n.axis=n.axis||"xy";var o=l(n.axis),s=r(t,a,n.intersect,o);return s.length>1&&s.sort(function(t,e){var n=t.getArea()-e.getArea();return 0===n&&(n=t._datasetIndex-e._datasetIndex),n}),s.slice(0,1)},x:function(t,e,n){var o=i(e,t),r=[],l=!1;return a(t,function(t){t.inXRange(o.x)&&r.push(t),t.inRange(o.x,o.y)&&(l=!0)}),n.intersect&&!l&&(r=[]),r},y:function(t,e,n){var o=i(e,t),r=[],l=!1;return a(t,function(t){t.inYRange(o.y)&&r.push(t),t.inRange(o.x,o.y)&&(l=!0)}),n.intersect&&!l&&(r=[]),r}}}},{45:45}],29:[function(t,e,n){"use strict";t(25)._set("global",{responsive:!0,responsiveAnimationDuration:0,maintainAspectRatio:!0,events:["mousemove","mouseout","click","touchstart","touchmove"],hover:{onHover:null,mode:"nearest",intersect:!0,animationDuration:400},onClick:null,defaultColor:"rgba(0,0,0,0.1)",defaultFontColor:"#666",defaultFontFamily:"'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",defaultFontSize:12,defaultFontStyle:"normal",showLines:!0,elements:{},layout:{padding:{top:0,right:0,bottom:0,left:0}}}),e.exports=function(){var t=function(t,e){return this.construct(t,e),this};return t.Chart=t,t}},{25:25}],30:[function(t,e,n){"use strict";var i=t(45);e.exports=function(t){function e(t,e){return i.where(t,function(t){return t.position===e})}function n(t,e){t.forEach(function(t,e){return t._tmpIndex_=e,t}),t.sort(function(t,n){var i=e?n:t,a=e?t:n;return i.weight===a.weight?i._tmpIndex_-a._tmpIndex_:i.weight-a.weight}),t.forEach(function(t){delete t._tmpIndex_})}t.layoutService={defaults:{},addBox:function(t,e){t.boxes||(t.boxes=[]),e.fullWidth=e.fullWidth||!1,e.position=e.position||"top",e.weight=e.weight||0,t.boxes.push(e)},removeBox:function(t,e){var n=t.boxes?t.boxes.indexOf(e):-1;-1!==n&&t.boxes.splice(n,1)},configure:function(t,e,n){for(var i,a=["fullWidth","position","weight"],o=a.length,r=0;r<o;++r)i=a[r],n.hasOwnProperty(i)&&(e[i]=n[i])},update:function(t,a,o){function r(t){var e=i.findNextWhere(_,function(e){return e.box===t});if(e)if(t.isHorizontal()){var n={left:Math.max(T,D),right:Math.max(F,I),top:0,bottom:0};t.update(t.fullWidth?x:S,y/2,n)}else t.update(e.minSize.width,C)}function l(t){t.isHorizontal()?(t.left=t.fullWidth?d:T,t.right=t.fullWidth?a-c:T+S,t.top=V,t.bottom=V+t.height,V=t.bottom):(t.left=N,t.right=N+t.width,t.top=O,t.bottom=O+C,N=t.right)}if(t){var s=t.options.layout||{},u=i.options.toPadding(s.padding),d=u.left,c=u.right,h=u.top,f=u.bottom,g=e(t.boxes,"left"),p=e(t.boxes,"right"),v=e(t.boxes,"top"),m=e(t.boxes,"bottom"),b=e(t.boxes,"chartArea");n(g,!0),n(p,!1),n(v,!0),n(m,!1);var x=a-d-c,y=o-h-f,k=y/2,w=(a-x/2)/(g.length+p.length),M=(o-k)/(v.length+m.length),S=x,C=y,_=[];i.each(g.concat(p,v,m),function(t){var e,n=t.isHorizontal();n?(e=t.update(t.fullWidth?x:S,M),C-=e.height):(e=t.update(w,k),S-=e.width),_.push({horizontal:n,minSize:e,box:t})});var D=0,I=0,P=0,A=0;i.each(v.concat(m),function(t){if(t.getPadding){var e=t.getPadding();D=Math.max(D,e.left),I=Math.max(I,e.right)}}),i.each(g.concat(p),function(t){if(t.getPadding){var e=t.getPadding();P=Math.max(P,e.top),A=Math.max(A,e.bottom)}});var T=d,F=c,O=h,R=f;i.each(g.concat(p),r),i.each(g,function(t){T+=t.width}),i.each(p,function(t){F+=t.width}),i.each(v.concat(m),r),i.each(v,function(t){O+=t.height}),i.each(m,function(t){R+=t.height}),i.each(g.concat(p),function(t){var e=i.findNextWhere(_,function(e){return e.box===t}),n={left:0,right:0,top:O,bottom:R};e&&t.update(e.minSize.width,C,n)}),T=d,F=c,O=h,R=f,i.each(g,function(t){T+=t.width}),i.each(p,function(t){F+=t.width}),i.each(v,function(t){O+=t.height}),i.each(m,function(t){R+=t.height});var L=Math.max(D-T,0);T+=L,F+=Math.max(I-F,0);var z=Math.max(P-O,0);O+=z,R+=Math.max(A-R,0);var B=o-O-R,W=a-T-F;W===S&&B===C||(i.each(g,function(t){t.height=B}),i.each(p,function(t){t.height=B}),i.each(v,function(t){t.fullWidth||(t.width=W)}),i.each(m,function(t){t.fullWidth||(t.width=W)}),C=B,S=W);var N=d+L,V=h+z;i.each(g.concat(v),l),N+=S,V+=C,i.each(p,l),i.each(m,l),t.chartArea={left:T,top:O,right:T+S,bottom:O+C},i.each(b,function(e){e.left=t.chartArea.left,e.top=t.chartArea.top,e.right=t.chartArea.right,e.bottom=t.chartArea.bottom,e.update(S,C)})}}}}},{45:45}],31:[function(t,e,n){"use strict";var i=t(25),a=t(26),o=t(45);i._set("global",{plugins:{}}),e.exports=function(t){t.plugins={_plugins:[],_cacheId:0,register:function(t){var e=this._plugins;[].concat(t).forEach(function(t){-1===e.indexOf(t)&&e.push(t)}),this._cacheId++},unregister:function(t){var e=this._plugins;[].concat(t).forEach(function(t){var n=e.indexOf(t);-1!==n&&e.splice(n,1)}),this._cacheId++},clear:function(){this._plugins=[],this._cacheId++},count:function(){return this._plugins.length},getAll:function(){return this._plugins},notify:function(t,e,n){var i,a,o,r,l,s=this.descriptors(t),u=s.length;for(i=0;i<u;++i)if(a=s[i],o=a.plugin,"function"==typeof(l=o[e])&&((r=[t].concat(n||[])).push(a.options),!1===l.apply(o,r)))return!1;return!0},descriptors:function(t){var e=t._plugins||(t._plugins={});if(e.id===this._cacheId)return e.descriptors;var n=[],a=[],r=t&&t.config||{},l=r.options&&r.options.plugins||{};return this._plugins.concat(r.plugins||[]).forEach(function(t){if(-1===n.indexOf(t)){var e=t.id,r=l[e];!1!==r&&(!0===r&&(r=o.clone(i.global.plugins[e])),n.push(t),a.push({plugin:t,options:r||{}}))}}),e.descriptors=a,e.id=this._cacheId,a}},t.pluginService=t.plugins,t.PluginBase=a.extend({})}},{25:25,26:26,45:45}],32:[function(t,e,n){"use strict";function i(t){var e,n,i=[];for(e=0,n=t.length;e<n;++e)i.push(t[e].label);return i}function a(t,e,n){var i=t.getPixelForTick(e);return n&&(i-=0===e?(t.getPixelForTick(1)-i)/2:(i-t.getPixelForTick(e-1))/2),i}var o=t(25),r=t(26),l=t(45),s=t(34);o._set("scale",{display:!0,position:"left",offset:!1,gridLines:{display:!0,color:"rgba(0, 0, 0, 0.1)",lineWidth:1,drawBorder:!0,drawOnChartArea:!0,drawTicks:!0,tickMarkLength:10,zeroLineWidth:1,zeroLineColor:"rgba(0,0,0,0.25)",zeroLineBorderDash:[],zeroLineBorderDashOffset:0,offsetGridLines:!1,borderDash:[],borderDashOffset:0},scaleLabel:{display:!1,labelString:"",lineHeight:1.2,padding:{top:4,bottom:4}},ticks:{beginAtZero:!1,minRotation:0,maxRotation:50,mirror:!1,padding:0,reverse:!1,display:!0,autoSkip:!0,autoSkipPadding:0,labelOffset:0,callback:s.formatters.values,minor:{},major:{}}}),e.exports=function(t){function e(t,e,n){return l.isArray(e)?l.longestText(t,n,e):t.measureText(e).width}function n(t){var e=l.valueOrDefault,n=o.global,i=e(t.fontSize,n.defaultFontSize),a=e(t.fontStyle,n.defaultFontStyle),r=e(t.fontFamily,n.defaultFontFamily);return{size:i,style:a,family:r,font:l.fontString(i,a,r)}}function s(t){return l.options.toLineHeight(l.valueOrDefault(t.lineHeight,1.2),l.valueOrDefault(t.fontSize,o.global.defaultFontSize))}t.Scale=r.extend({getPadding:function(){var t=this;return{left:t.paddingLeft||0,top:t.paddingTop||0,right:t.paddingRight||0,bottom:t.paddingBottom||0}},getTicks:function(){return this._ticks},mergeTicksOptions:function(){var t=this.options.ticks;!1===t.minor&&(t.minor={display:!1}),!1===t.major&&(t.major={display:!1});for(var e in t)"major"!==e&&"minor"!==e&&(void 0===t.minor[e]&&(t.minor[e]=t[e]),void 0===t.major[e]&&(t.major[e]=t[e]))},beforeUpdate:function(){l.callback(this.options.beforeUpdate,[this])},update:function(t,e,n){var i,a,o,r,s,u,d=this;for(d.beforeUpdate(),d.maxWidth=t,d.maxHeight=e,d.margins=l.extend({left:0,right:0,top:0,bottom:0},n),d.longestTextCache=d.longestTextCache||{},d.beforeSetDimensions(),d.setDimensions(),d.afterSetDimensions(),d.beforeDataLimits(),d.determineDataLimits(),d.afterDataLimits(),d.beforeBuildTicks(),s=d.buildTicks()||[],d.afterBuildTicks(),d.beforeTickToLabelConversion(),o=d.convertTicksToLabels(s)||d.ticks,d.afterTickToLabelConversion(),d.ticks=o,i=0,a=o.length;i<a;++i)r=o[i],(u=s[i])?u.label=r:s.push(u={label:r,major:!1});return d._ticks=s,d.beforeCalculateTickRotation(),d.calculateTickRotation(),d.afterCalculateTickRotation(),d.beforeFit(),d.fit(),d.afterFit(),d.afterUpdate(),d.minSize},afterUpdate:function(){l.callback(this.options.afterUpdate,[this])},beforeSetDimensions:function(){l.callback(this.options.beforeSetDimensions,[this])},setDimensions:function(){var t=this;t.isHorizontal()?(t.width=t.maxWidth,t.left=0,t.right=t.width):(t.height=t.maxHeight,t.top=0,t.bottom=t.height),t.paddingLeft=0,t.paddingTop=0,t.paddingRight=0,t.paddingBottom=0},afterSetDimensions:function(){l.callback(this.options.afterSetDimensions,[this])},beforeDataLimits:function(){l.callback(this.options.beforeDataLimits,[this])},determineDataLimits:l.noop,afterDataLimits:function(){l.callback(this.options.afterDataLimits,[this])},beforeBuildTicks:function(){l.callback(this.options.beforeBuildTicks,[this])},buildTicks:l.noop,afterBuildTicks:function(){l.callback(this.options.afterBuildTicks,[this])},beforeTickToLabelConversion:function(){l.callback(this.options.beforeTickToLabelConversion,[this])},convertTicksToLabels:function(){var t=this,e=t.options.ticks;t.ticks=t.ticks.map(e.userCallback||e.callback,this)},afterTickToLabelConversion:function(){l.callback(this.options.afterTickToLabelConversion,[this])},beforeCalculateTickRotation:function(){l.callback(this.options.beforeCalculateTickRotation,[this])},calculateTickRotation:function(){var t=this,e=t.ctx,a=t.options.ticks,o=i(t._ticks),r=n(a);e.font=r.font;var s=a.minRotation||0;if(o.length&&t.options.display&&t.isHorizontal())for(var u,d=l.longestText(e,r.font,o,t.longestTextCache),c=d,h=t.getPixelForTick(1)-t.getPixelForTick(0)-6;c>h&&s<a.maxRotation;){var f=l.toRadians(s);if(u=Math.cos(f),Math.sin(f)*d>t.maxHeight){s--;break}s++,c=u*d}t.labelRotation=s},afterCalculateTickRotation:function(){l.callback(this.options.afterCalculateTickRotation,[this])},beforeFit:function(){l.callback(this.options.beforeFit,[this])},fit:function(){var t=this,a=t.minSize={width:0,height:0},o=i(t._ticks),r=t.options,u=r.ticks,d=r.scaleLabel,c=r.gridLines,h=r.display,f=t.isHorizontal(),g=n(u),p=r.gridLines.tickMarkLength;if(a.width=f?t.isFullWidth()?t.maxWidth-t.margins.left-t.margins.right:t.maxWidth:h&&c.drawTicks?p:0,a.height=f?h&&c.drawTicks?p:0:t.maxHeight,d.display&&h){var v=s(d)+l.options.toPadding(d.padding).height;f?a.height+=v:a.width+=v}if(u.display&&h){var m=l.longestText(t.ctx,g.font,o,t.longestTextCache),b=l.numberOfLabelLines(o),x=.5*g.size,y=t.options.ticks.padding;if(f){t.longestLabelWidth=m;var k=l.toRadians(t.labelRotation),w=Math.cos(k),M=Math.sin(k)*m+g.size*b+x*(b-1)+x;a.height=Math.min(t.maxHeight,a.height+M+y),t.ctx.font=g.font;var S=e(t.ctx,o[0],g.font),C=e(t.ctx,o[o.length-1],g.font);0!==t.labelRotation?(t.paddingLeft="bottom"===r.position?w*S+3:w*x+3,t.paddingRight="bottom"===r.position?w*x+3:w*C+3):(t.paddingLeft=S/2+3,t.paddingRight=C/2+3)}else u.mirror?m=0:m+=y+x,a.width=Math.min(t.maxWidth,a.width+m),t.paddingTop=g.size/2,t.paddingBottom=g.size/2}t.handleMargins(),t.width=a.width,t.height=a.height},handleMargins:function(){var t=this;t.margins&&(t.paddingLeft=Math.max(t.paddingLeft-t.margins.left,0),t.paddingTop=Math.max(t.paddingTop-t.margins.top,0),t.paddingRight=Math.max(t.paddingRight-t.margins.right,0),t.paddingBottom=Math.max(t.paddingBottom-t.margins.bottom,0))},afterFit:function(){l.callback(this.options.afterFit,[this])},isHorizontal:function(){return"top"===this.options.position||"bottom"===this.options.position},isFullWidth:function(){return this.options.fullWidth},getRightValue:function(t){if(l.isNullOrUndef(t))return NaN;if("number"==typeof t&&!isFinite(t))return NaN;if(t)if(this.isHorizontal()){if(void 0!==t.x)return this.getRightValue(t.x)}else if(void 0!==t.y)return this.getRightValue(t.y);return t},getLabelForIndex:l.noop,getPixelForValue:l.noop,getValueForPixel:l.noop,getPixelForTick:function(t){var e=this,n=e.options.offset;if(e.isHorizontal()){var i=(e.width-(e.paddingLeft+e.paddingRight))/Math.max(e._ticks.length-(n?0:1),1),a=i*t+e.paddingLeft;n&&(a+=i/2);var o=e.left+Math.round(a);return o+=e.isFullWidth()?e.margins.left:0}var r=e.height-(e.paddingTop+e.paddingBottom);return e.top+t*(r/(e._ticks.length-1))},getPixelForDecimal:function(t){var e=this;if(e.isHorizontal()){var n=(e.width-(e.paddingLeft+e.paddingRight))*t+e.paddingLeft,i=e.left+Math.round(n);return i+=e.isFullWidth()?e.margins.left:0}return e.top+t*e.height},getBasePixel:function(){return this.getPixelForValue(this.getBaseValue())},getBaseValue:function(){var t=this,e=t.min,n=t.max;return t.beginAtZero?0:e<0&&n<0?n:e>0&&n>0?e:0},_autoSkip:function(t){var e,n,i,a,o=this,r=o.isHorizontal(),s=o.options.ticks.minor,u=t.length,d=l.toRadians(o.labelRotation),c=Math.cos(d),h=o.longestLabelWidth*c,f=[];for(s.maxTicksLimit&&(a=s.maxTicksLimit),r&&(e=!1,(h+s.autoSkipPadding)*u>o.width-(o.paddingLeft+o.paddingRight)&&(e=1+Math.floor((h+s.autoSkipPadding)*u/(o.width-(o.paddingLeft+o.paddingRight)))),a&&u>a&&(e=Math.max(e,Math.floor(u/a)))),n=0;n<u;n++)i=t[n],((e>1&&n%e>0||n%e==0&&n+e>=u)&&n!==u-1||l.isNullOrUndef(i.label))&&delete i.label,f.push(i);return f},draw:function(t){var e=this,i=e.options;if(i.display){var r=e.ctx,u=o.global,d=i.ticks.minor,c=i.ticks.major||d,h=i.gridLines,f=i.scaleLabel,g=0!==e.labelRotation,p=e.isHorizontal(),v=d.autoSkip?e._autoSkip(e.getTicks()):e.getTicks(),m=l.valueOrDefault(d.fontColor,u.defaultFontColor),b=n(d),x=l.valueOrDefault(c.fontColor,u.defaultFontColor),y=n(c),k=h.drawTicks?h.tickMarkLength:0,w=l.valueOrDefault(f.fontColor,u.defaultFontColor),M=n(f),S=l.options.toPadding(f.padding),C=l.toRadians(e.labelRotation),_=[],D="right"===i.position?e.left:e.right-k,I="right"===i.position?e.left+k:e.right,P="bottom"===i.position?e.top:e.bottom-k,A="bottom"===i.position?e.top+k:e.bottom;if(l.each(v,function(n,o){if(void 0!==n.label){var r,s,c,f,m=n.label;o===e.zeroLineIndex&&i.offset===h.offsetGridLines?(r=h.zeroLineWidth,s=h.zeroLineColor,c=h.zeroLineBorderDash,f=h.zeroLineBorderDashOffset):(r=l.valueAtIndexOrDefault(h.lineWidth,o),s=l.valueAtIndexOrDefault(h.color,o),c=l.valueOrDefault(h.borderDash,u.borderDash),f=l.valueOrDefault(h.borderDashOffset,u.borderDashOffset));var b,x,y,w,M,S,T,F,O,R,L="middle",z="middle",B=d.padding;if(p){var W=k+B;"bottom"===i.position?(z=g?"middle":"top",L=g?"right":"center",R=e.top+W):(z=g?"middle":"bottom",L=g?"left":"center",R=e.bottom-W);var N=a(e,o,h.offsetGridLines&&v.length>1);N<e.left&&(s="rgba(0,0,0,0)"),N+=l.aliasPixel(r),O=e.getPixelForTick(o)+d.labelOffset,b=y=M=T=N,x=P,w=A,S=t.top,F=t.bottom}else{var V,E="left"===i.position;d.mirror?(L=E?"left":"right",V=B):(L=E?"right":"left",V=k+B),O=E?e.right-V:e.left+V;var H=a(e,o,h.offsetGridLines&&v.length>1);H<e.top&&(s="rgba(0,0,0,0)"),H+=l.aliasPixel(r),R=e.getPixelForTick(o)+d.labelOffset,b=D,y=I,M=t.left,T=t.right,x=w=S=F=H}_.push({tx1:b,ty1:x,tx2:y,ty2:w,x1:M,y1:S,x2:T,y2:F,labelX:O,labelY:R,glWidth:r,glColor:s,glBorderDash:c,glBorderDashOffset:f,rotation:-1*C,label:m,major:n.major,textBaseline:z,textAlign:L})}}),l.each(_,function(t){if(h.display&&(r.save(),r.lineWidth=t.glWidth,r.strokeStyle=t.glColor,r.setLineDash&&(r.setLineDash(t.glBorderDash),r.lineDashOffset=t.glBorderDashOffset),r.beginPath(),h.drawTicks&&(r.moveTo(t.tx1,t.ty1),r.lineTo(t.tx2,t.ty2)),h.drawOnChartArea&&(r.moveTo(t.x1,t.y1),r.lineTo(t.x2,t.y2)),r.stroke(),r.restore()),d.display){r.save(),r.translate(t.labelX,t.labelY),r.rotate(t.rotation),r.font=t.major?y.font:b.font,r.fillStyle=t.major?x:m,r.textBaseline=t.textBaseline,r.textAlign=t.textAlign;var e=t.label;if(l.isArray(e))for(var n=0,i=0;n<e.length;++n)r.fillText(""+e[n],0,i),i+=1.5*b.size;else r.fillText(e,0,0);r.restore()}}),f.display){var T,F,O=0,R=s(f)/2;if(p)T=e.left+(e.right-e.left)/2,F="bottom"===i.position?e.bottom-R-S.bottom:e.top+R+S.top;else{var L="left"===i.position;T=L?e.left+R+S.top:e.right-R-S.top,F=e.top+(e.bottom-e.top)/2,O=L?-.5*Math.PI:.5*Math.PI}r.save(),r.translate(T,F),r.rotate(O),r.textAlign="center",r.textBaseline="middle",r.fillStyle=w,r.font=M.font,r.fillText(f.labelString,0,0),r.restore()}if(h.drawBorder){r.lineWidth=l.valueAtIndexOrDefault(h.lineWidth,0),r.strokeStyle=l.valueAtIndexOrDefault(h.color,0);var z=e.left,B=e.right,W=e.top,N=e.bottom,V=l.aliasPixel(r.lineWidth);p?(W=N="top"===i.position?e.bottom:e.top,W+=V,N+=V):(z=B="left"===i.position?e.right:e.left,z+=V,B+=V),r.beginPath(),r.moveTo(z,W),r.lineTo(B,N),r.stroke()}}}})}},{25:25,26:26,34:34,45:45}],33:[function(t,e,n){"use strict";var i=t(25),a=t(45);e.exports=function(t){t.scaleService={constructors:{},defaults:{},registerScaleType:function(t,e,n){this.constructors[t]=e,this.defaults[t]=a.clone(n)},getScaleConstructor:function(t){return this.constructors.hasOwnProperty(t)?this.constructors[t]:void 0},getScaleDefaults:function(t){return this.defaults.hasOwnProperty(t)?a.merge({},[i.scale,this.defaults[t]]):{}},updateScaleDefaults:function(t,e){var n=this;n.defaults.hasOwnProperty(t)&&(n.defaults[t]=a.extend(n.defaults[t],e))},addScalesToLayout:function(e){a.each(e.scales,function(n){n.fullWidth=n.options.fullWidth,n.position=n.options.position,n.weight=n.options.weight,t.layoutService.addBox(e,n)})}}}},{25:25,45:45}],34:[function(t,e,n){"use strict";var i=t(45);e.exports={generators:{linear:function(t,e){var n,a=[];if(t.stepSize&&t.stepSize>0)n=t.stepSize;else{var o=i.niceNum(e.max-e.min,!1);n=i.niceNum(o/(t.maxTicks-1),!0)}var r=Math.floor(e.min/n)*n,l=Math.ceil(e.max/n)*n;t.min&&t.max&&t.stepSize&&i.almostWhole((t.max-t.min)/t.stepSize,n/1e3)&&(r=t.min,l=t.max);var s=(l-r)/n;s=i.almostEquals(s,Math.round(s),n/1e3)?Math.round(s):Math.ceil(s),a.push(void 0!==t.min?t.min:r);for(var u=1;u<s;++u)a.push(r+u*n);return a.push(void 0!==t.max?t.max:l),a},logarithmic:function(t,e){var n,a,o=[],r=i.valueOrDefault,l=r(t.min,Math.pow(10,Math.floor(i.log10(e.min)))),s=Math.floor(i.log10(e.max)),u=Math.ceil(e.max/Math.pow(10,s));0===l?(n=Math.floor(i.log10(e.minNotZero)),a=Math.floor(e.minNotZero/Math.pow(10,n)),o.push(l),l=a*Math.pow(10,n)):(n=Math.floor(i.log10(l)),a=Math.floor(l/Math.pow(10,n)));do{o.push(l),10===++a&&(a=1,++n),l=a*Math.pow(10,n)}while(n<s||n===s&&a<u);var d=r(t.max,l);return o.push(d),o}},formatters:{values:function(t){return i.isArray(t)?t:""+t},linear:function(t,e,n){var a=n.length>3?n[2]-n[1]:n[1]-n[0];Math.abs(a)>1&&t!==Math.floor(t)&&(a=t-Math.floor(t));var o=i.log10(Math.abs(a)),r="";if(0!==t){var l=-1*Math.floor(o);l=Math.max(Math.min(l,20),0),r=t.toFixed(l)}else r="0";return r},logarithmic:function(t,e,n){var a=t/Math.pow(10,Math.floor(i.log10(t)));return 0===t?"0":1===a||2===a||5===a||0===e||e===n.length-1?t.toExponential():""}}}},{45:45}],35:[function(t,e,n){"use strict";var i=t(25),a=t(26),o=t(45);i._set("global",{tooltips:{enabled:!0,custom:null,mode:"nearest",position:"average",intersect:!0,backgroundColor:"rgba(0,0,0,0.8)",titleFontStyle:"bold",titleSpacing:2,titleMarginBottom:6,titleFontColor:"#fff",titleAlign:"left",bodySpacing:2,bodyFontColor:"#fff",bodyAlign:"left",footerFontStyle:"bold",footerSpacing:2,footerMarginTop:6,footerFontColor:"#fff",footerAlign:"left",yPadding:6,xPadding:6,caretPadding:2,caretSize:5,cornerRadius:6,multiKeyBackground:"#fff",displayColors:!0,borderColor:"rgba(0,0,0,0)",borderWidth:0,callbacks:{beforeTitle:o.noop,title:function(t,e){var n="",i=e.labels,a=i?i.length:0;if(t.length>0){var o=t[0];o.xLabel?n=o.xLabel:a>0&&o.index<a&&(n=i[o.index])}return n},afterTitle:o.noop,beforeBody:o.noop,beforeLabel:o.noop,label:function(t,e){var n=e.datasets[t.datasetIndex].label||"";return n&&(n+=": "),n+=t.yLabel},labelColor:function(t,e){var n=e.getDatasetMeta(t.datasetIndex).data[t.index]._view;return{borderColor:n.borderColor,backgroundColor:n.backgroundColor}},labelTextColor:function(){return this._options.bodyFontColor},afterLabel:o.noop,afterBody:o.noop,beforeFooter:o.noop,footer:o.noop,afterFooter:o.noop}}}),e.exports=function(t){function e(t,e){var n=o.color(t);return n.alpha(e*n.alpha()).rgbaString()}function n(t,e){return e&&(o.isArray(e)?Array.prototype.push.apply(t,e):t.push(e)),t}function r(t){var e=t._xScale,n=t._yScale||t._scale,i=t._index,a=t._datasetIndex;return{xLabel:e?e.getLabelForIndex(i,a):"",yLabel:n?n.getLabelForIndex(i,a):"",index:i,datasetIndex:a,x:t._model.x,y:t._model.y}}function l(t){var e=i.global,n=o.valueOrDefault;return{xPadding:t.xPadding,yPadding:t.yPadding,xAlign:t.xAlign,yAlign:t.yAlign,bodyFontColor:t.bodyFontColor,_bodyFontFamily:n(t.bodyFontFamily,e.defaultFontFamily),_bodyFontStyle:n(t.bodyFontStyle,e.defaultFontStyle),_bodyAlign:t.bodyAlign,bodyFontSize:n(t.bodyFontSize,e.defaultFontSize),bodySpacing:t.bodySpacing,titleFontColor:t.titleFontColor,_titleFontFamily:n(t.titleFontFamily,e.defaultFontFamily),_titleFontStyle:n(t.titleFontStyle,e.defaultFontStyle),titleFontSize:n(t.titleFontSize,e.defaultFontSize),_titleAlign:t.titleAlign,titleSpacing:t.titleSpacing,titleMarginBottom:t.titleMarginBottom,footerFontColor:t.footerFontColor,_footerFontFamily:n(t.footerFontFamily,e.defaultFontFamily),_footerFontStyle:n(t.footerFontStyle,e.defaultFontStyle),footerFontSize:n(t.footerFontSize,e.defaultFontSize),_footerAlign:t.footerAlign,footerSpacing:t.footerSpacing,footerMarginTop:t.footerMarginTop,caretSize:t.caretSize,cornerRadius:t.cornerRadius,backgroundColor:t.backgroundColor,opacity:0,legendColorBackground:t.multiKeyBackground,displayColors:t.displayColors,borderColor:t.borderColor,borderWidth:t.borderWidth}}function s(t,e){var n=t._chart.ctx,i=2*e.yPadding,a=0,r=e.body,l=r.reduce(function(t,e){return t+e.before.length+e.lines.length+e.after.length},0);l+=e.beforeBody.length+e.afterBody.length;var s=e.title.length,u=e.footer.length,d=e.titleFontSize,c=e.bodyFontSize,h=e.footerFontSize;i+=s*d,i+=s?(s-1)*e.titleSpacing:0,i+=s?e.titleMarginBottom:0,i+=l*c,i+=l?(l-1)*e.bodySpacing:0,i+=u?e.footerMarginTop:0,i+=u*h,i+=u?(u-1)*e.footerSpacing:0;var f=0,g=function(t){a=Math.max(a,n.measureText(t).width+f)};return n.font=o.fontString(d,e._titleFontStyle,e._titleFontFamily),o.each(e.title,g),n.font=o.fontString(c,e._bodyFontStyle,e._bodyFontFamily),o.each(e.beforeBody.concat(e.afterBody),g),f=e.displayColors?c+2:0,o.each(r,function(t){o.each(t.before,g),o.each(t.lines,g),o.each(t.after,g)}),f=0,n.font=o.fontString(h,e._footerFontStyle,e._footerFontFamily),o.each(e.footer,g),a+=2*e.xPadding,{width:a,height:i}}function u(t,e){var n=t._model,i=t._chart,a=t._chart.chartArea,o="center",r="center";n.y<e.height?r="top":n.y>i.height-e.height&&(r="bottom");var l,s,u,d,c,h=(a.left+a.right)/2,f=(a.top+a.bottom)/2;"center"===r?(l=function(t){return t<=h},s=function(t){return t>h}):(l=function(t){return t<=e.width/2},s=function(t){return t>=i.width-e.width/2}),u=function(t){return t+e.width>i.width},d=function(t){return t-e.width<0},c=function(t){return t<=f?"top":"bottom"},l(n.x)?(o="left",u(n.x)&&(o="center",r=c(n.y))):s(n.x)&&(o="right",d(n.x)&&(o="center",r=c(n.y)));var g=t._options;return{xAlign:g.xAlign?g.xAlign:o,yAlign:g.yAlign?g.yAlign:r}}function d(t,e,n){var i=t.x,a=t.y,o=t.caretSize,r=t.caretPadding,l=t.cornerRadius,s=n.xAlign,u=n.yAlign,d=o+r,c=l+r;return"right"===s?i-=e.width:"center"===s&&(i-=e.width/2),"top"===u?a+=d:a-="bottom"===u?e.height+d:e.height/2,"center"===u?"left"===s?i+=d:"right"===s&&(i-=d):"left"===s?i-=c:"right"===s&&(i+=c),{x:i,y:a}}t.Tooltip=a.extend({initialize:function(){this._model=l(this._options)},getTitle:function(){var t=this,e=t._options.callbacks,i=e.beforeTitle.apply(t,arguments),a=e.title.apply(t,arguments),o=e.afterTitle.apply(t,arguments),r=[];return r=n(r,i),r=n(r,a),r=n(r,o)},getBeforeBody:function(){var t=this._options.callbacks.beforeBody.apply(this,arguments);return o.isArray(t)?t:void 0!==t?[t]:[]},getBody:function(t,e){var i=this,a=i._options.callbacks,r=[];return o.each(t,function(t){var o={before:[],lines:[],after:[]};n(o.before,a.beforeLabel.call(i,t,e)),n(o.lines,a.label.call(i,t,e)),n(o.after,a.afterLabel.call(i,t,e)),r.push(o)}),r},getAfterBody:function(){var t=this._options.callbacks.afterBody.apply(this,arguments);return o.isArray(t)?t:void 0!==t?[t]:[]},getFooter:function(){var t=this,e=t._options.callbacks,i=e.beforeFooter.apply(t,arguments),a=e.footer.apply(t,arguments),o=e.afterFooter.apply(t,arguments),r=[];return r=n(r,i),r=n(r,a),r=n(r,o)},update:function(e){var n,i,a=this,c=a._options,h=a._model,f=a._model=l(c),g=a._active,p=a._data,v={xAlign:h.xAlign,yAlign:h.yAlign},m={x:h.x,y:h.y},b={width:h.width,height:h.height},x={x:h.caretX,y:h.caretY};if(g.length){f.opacity=1;var y=[],k=[];x=t.Tooltip.positioners[c.position](g,a._eventPosition);var w=[];for(n=0,i=g.length;n<i;++n)w.push(r(g[n]));c.filter&&(w=w.filter(function(t){return c.filter(t,p)})),c.itemSort&&(w=w.sort(function(t,e){return c.itemSort(t,e,p)})),o.each(w,function(t){y.push(c.callbacks.labelColor.call(a,t,a._chart)),k.push(c.callbacks.labelTextColor.call(a,t,a._chart))}),f.title=a.getTitle(w,p),f.beforeBody=a.getBeforeBody(w,p),f.body=a.getBody(w,p),f.afterBody=a.getAfterBody(w,p),f.footer=a.getFooter(w,p),f.x=Math.round(x.x),f.y=Math.round(x.y),f.caretPadding=c.caretPadding,f.labelColors=y,f.labelTextColors=k,f.dataPoints=w,m=d(f,b=s(this,f),v=u(this,b))}else f.opacity=0;return f.xAlign=v.xAlign,f.yAlign=v.yAlign,f.x=m.x,f.y=m.y,f.width=b.width,f.height=b.height,f.caretX=x.x,f.caretY=x.y,a._model=f,e&&c.custom&&c.custom.call(a,f),a},drawCaret:function(t,e){var n=this._chart.ctx,i=this._view,a=this.getCaretPosition(t,e,i);n.lineTo(a.x1,a.y1),n.lineTo(a.x2,a.y2),n.lineTo(a.x3,a.y3)},getCaretPosition:function(t,e,n){var i,a,o,r,l,s,u=n.caretSize,d=n.cornerRadius,c=n.xAlign,h=n.yAlign,f=t.x,g=t.y,p=e.width,v=e.height;if("center"===h)l=g+v/2,"left"===c?(a=(i=f)-u,o=i,r=l+u,s=l-u):(a=(i=f+p)+u,o=i,r=l-u,s=l+u);else if("left"===c?(i=(a=f+d+u)-u,o=a+u):"right"===c?(i=(a=f+p-d-u)-u,o=a+u):(i=(a=f+p/2)-u,o=a+u),"top"===h)l=(r=g)-u,s=r;else{l=(r=g+v)+u,s=r;var m=o;o=i,i=m}return{x1:i,x2:a,x3:o,y1:r,y2:l,y3:s}},drawTitle:function(t,n,i,a){var r=n.title;if(r.length){i.textAlign=n._titleAlign,i.textBaseline="top";var l=n.titleFontSize,s=n.titleSpacing;i.fillStyle=e(n.titleFontColor,a),i.font=o.fontString(l,n._titleFontStyle,n._titleFontFamily);var u,d;for(u=0,d=r.length;u<d;++u)i.fillText(r[u],t.x,t.y),t.y+=l+s,u+1===r.length&&(t.y+=n.titleMarginBottom-s)}},drawBody:function(t,n,i,a){var r=n.bodyFontSize,l=n.bodySpacing,s=n.body;i.textAlign=n._bodyAlign,i.textBaseline="top",i.font=o.fontString(r,n._bodyFontStyle,n._bodyFontFamily);var u=0,d=function(e){i.fillText(e,t.x+u,t.y),t.y+=r+l};o.each(n.beforeBody,d);var c=n.displayColors;u=c?r+2:0,o.each(s,function(l,s){o.each(l.before,d),o.each(l.lines,function(o){if(c){i.fillStyle=e(n.legendColorBackground,a),i.fillRect(t.x,t.y,r,r),i.lineWidth=1,i.strokeStyle=e(n.labelColors[s].borderColor,a),i.strokeRect(t.x,t.y,r,r),i.fillStyle=e(n.labelColors[s].backgroundColor,a),i.fillRect(t.x+1,t.y+1,r-2,r-2);var l=e(n.labelTextColors[s],a);i.fillStyle=l}d(o)}),o.each(l.after,d)}),u=0,o.each(n.afterBody,d),t.y-=l},drawFooter:function(t,n,i,a){var r=n.footer;r.length&&(t.y+=n.footerMarginTop,i.textAlign=n._footerAlign,i.textBaseline="top",i.fillStyle=e(n.footerFontColor,a),i.font=o.fontString(n.footerFontSize,n._footerFontStyle,n._footerFontFamily),o.each(r,function(e){i.fillText(e,t.x,t.y),t.y+=n.footerFontSize+n.footerSpacing}))},drawBackground:function(t,n,i,a,o){i.fillStyle=e(n.backgroundColor,o),i.strokeStyle=e(n.borderColor,o),i.lineWidth=n.borderWidth;var r=n.xAlign,l=n.yAlign,s=t.x,u=t.y,d=a.width,c=a.height,h=n.cornerRadius;i.beginPath(),i.moveTo(s+h,u),"top"===l&&this.drawCaret(t,a),i.lineTo(s+d-h,u),i.quadraticCurveTo(s+d,u,s+d,u+h),"center"===l&&"right"===r&&this.drawCaret(t,a),i.lineTo(s+d,u+c-h),i.quadraticCurveTo(s+d,u+c,s+d-h,u+c),"bottom"===l&&this.drawCaret(t,a),i.lineTo(s+h,u+c),i.quadraticCurveTo(s,u+c,s,u+c-h),"center"===l&&"left"===r&&this.drawCaret(t,a),i.lineTo(s,u+h),i.quadraticCurveTo(s,u,s+h,u),i.closePath(),i.fill(),n.borderWidth>0&&i.stroke()},draw:function(){var t=this._chart.ctx,e=this._view;if(0!==e.opacity){var n={width:e.width,height:e.height},i={x:e.x,y:e.y},a=Math.abs(e.opacity<.001)?0:e.opacity,o=e.title.length||e.beforeBody.length||e.body.length||e.afterBody.length||e.footer.length;this._options.enabled&&o&&(this.drawBackground(i,e,t,n,a),i.x+=e.xPadding,i.y+=e.yPadding,this.drawTitle(i,e,t,a),this.drawBody(i,e,t,a),this.drawFooter(i,e,t,a))}},handleEvent:function(t){var e=this,n=e._options,i=!1;if(e._lastActive=e._lastActive||[],"mouseout"===t.type?e._active=[]:e._active=e._chart.getElementsAtEventForMode(t,n.mode,n),!(i=!o.arrayEquals(e._active,e._lastActive)))return!1;if(e._lastActive=e._active,n.enabled||n.custom){e._eventPosition={x:t.x,y:t.y};var a=e._model;e.update(!0),e.pivot(),i|=a.x!==e._model.x||a.y!==e._model.y}return i}}),t.Tooltip.positioners={average:function(t){if(!t.length)return!1;var e,n,i=0,a=0,o=0;for(e=0,n=t.length;e<n;++e){var r=t[e];if(r&&r.hasValue()){var l=r.tooltipPosition();i+=l.x,a+=l.y,++o}}return{x:Math.round(i/o),y:Math.round(a/o)}},nearest:function(t,e){var n,i,a,r=e.x,l=e.y,s=Number.POSITIVE_INFINITY;for(n=0,i=t.length;n<i;++n){var u=t[n];if(u&&u.hasValue()){var d=u.getCenterPoint(),c=o.distanceBetweenPoints(e,d);c<s&&(s=c,a=u)}}if(a){var h=a.tooltipPosition();r=h.x,l=h.y}return{x:r,y:l}}}}},{25:25,26:26,45:45}],36:[function(t,e,n){"use strict";var i=t(25),a=t(26),o=t(45);i._set("global",{elements:{arc:{backgroundColor:i.global.defaultColor,borderColor:"#fff",borderWidth:2}}}),e.exports=a.extend({inLabelRange:function(t){var e=this._view;return!!e&&Math.pow(t-e.x,2)<Math.pow(e.radius+e.hoverRadius,2)},inRange:function(t,e){var n=this._view;if(n){for(var i=o.getAngleFromPoint(n,{x:t,y:e}),a=i.angle,r=i.distance,l=n.startAngle,s=n.endAngle;s<l;)s+=2*Math.PI;for(;a>s;)a-=2*Math.PI;for(;a<l;)a+=2*Math.PI;var u=a>=l&&a<=s,d=r>=n.innerRadius&&r<=n.outerRadius;return u&&d}return!1},getCenterPoint:function(){var t=this._view,e=(t.startAngle+t.endAngle)/2,n=(t.innerRadius+t.outerRadius)/2;return{x:t.x+Math.cos(e)*n,y:t.y+Math.sin(e)*n}},getArea:function(){var t=this._view;return Math.PI*((t.endAngle-t.startAngle)/(2*Math.PI))*(Math.pow(t.outerRadius,2)-Math.pow(t.innerRadius,2))},tooltipPosition:function(){var t=this._view,e=t.startAngle+(t.endAngle-t.startAngle)/2,n=(t.outerRadius-t.innerRadius)/2+t.innerRadius;return{x:t.x+Math.cos(e)*n,y:t.y+Math.sin(e)*n}},draw:function(){var t=this._chart.ctx,e=this._view,n=e.startAngle,i=e.endAngle;t.beginPath(),t.arc(e.x,e.y,e.outerRadius,n,i),t.arc(e.x,e.y,e.innerRadius,i,n,!0),t.closePath(),t.strokeStyle=e.borderColor,t.lineWidth=e.borderWidth,t.fillStyle=e.backgroundColor,t.fill(),t.lineJoin="bevel",e.borderWidth&&t.stroke()}})},{25:25,26:26,45:45}],37:[function(t,e,n){"use strict";var i=t(25),a=t(26),o=t(45),r=i.global;i._set("global",{elements:{line:{tension:.4,backgroundColor:r.defaultColor,borderWidth:3,borderColor:r.defaultColor,borderCapStyle:"butt",borderDash:[],borderDashOffset:0,borderJoinStyle:"miter",capBezierPoints:!0,fill:!0}}}),e.exports=a.extend({draw:function(){var t,e,n,i,a=this,l=a._view,s=a._chart.ctx,u=l.spanGaps,d=a._children.slice(),c=r.elements.line,h=-1;for(a._loop&&d.length&&d.push(d[0]),s.save(),s.lineCap=l.borderCapStyle||c.borderCapStyle,s.setLineDash&&s.setLineDash(l.borderDash||c.borderDash),s.lineDashOffset=l.borderDashOffset||c.borderDashOffset,s.lineJoin=l.borderJoinStyle||c.borderJoinStyle,s.lineWidth=l.borderWidth||c.borderWidth,s.strokeStyle=l.borderColor||r.defaultColor,s.beginPath(),h=-1,t=0;t<d.length;++t)e=d[t],n=o.previousItem(d,t),i=e._view,0===t?i.skip||(s.moveTo(i.x,i.y),h=t):(n=-1===h?n:d[h],i.skip||(h!==t-1&&!u||-1===h?s.moveTo(i.x,i.y):o.canvas.lineTo(s,n._view,e._view),h=t));s.stroke(),s.restore()}})},{25:25,26:26,45:45}],38:[function(t,e,n){"use strict";function i(t){var e=this._view;return!!e&&Math.pow(t-e.x,2)<Math.pow(e.radius+e.hitRadius,2)}var a=t(25),o=t(26),r=t(45),l=a.global.defaultColor;a._set("global",{elements:{point:{radius:3,pointStyle:"circle",backgroundColor:l,borderColor:l,borderWidth:1,hitRadius:1,hoverRadius:4,hoverBorderWidth:1}}}),e.exports=o.extend({inRange:function(t,e){var n=this._view;return!!n&&Math.pow(t-n.x,2)+Math.pow(e-n.y,2)<Math.pow(n.hitRadius+n.radius,2)},inLabelRange:i,inXRange:i,inYRange:function(t){var e=this._view;return!!e&&Math.pow(t-e.y,2)<Math.pow(e.radius+e.hitRadius,2)},getCenterPoint:function(){var t=this._view;return{x:t.x,y:t.y}},getArea:function(){return Math.PI*Math.pow(this._view.radius,2)},tooltipPosition:function(){var t=this._view;return{x:t.x,y:t.y,padding:t.radius+t.borderWidth}},draw:function(t){var e=this._view,n=this._model,i=this._chart.ctx,o=e.pointStyle,s=e.radius,u=e.x,d=e.y,c=r.color,h=0;e.skip||(i.strokeStyle=e.borderColor||l,i.lineWidth=r.valueOrDefault(e.borderWidth,a.global.elements.point.borderWidth),i.fillStyle=e.backgroundColor||l,void 0!==t&&(n.x<t.left||1.01*t.right<n.x||n.y<t.top||1.01*t.bottom<n.y)&&(n.x<t.left?h=(u-n.x)/(t.left-n.x):1.01*t.right<n.x?h=(n.x-u)/(n.x-t.right):n.y<t.top?h=(d-n.y)/(t.top-n.y):1.01*t.bottom<n.y&&(h=(n.y-d)/(n.y-t.bottom)),h=Math.round(100*h)/100,i.strokeStyle=c(i.strokeStyle).alpha(h).rgbString(),i.fillStyle=c(i.fillStyle).alpha(h).rgbString()),r.canvas.drawPoint(i,o,s,u,d))}})},{25:25,26:26,45:45}],39:[function(t,e,n){"use strict";function i(t){return void 0!==t._view.width}function a(t){var e,n,a,o,r=t._view;if(i(t)){var l=r.width/2;e=r.x-l,n=r.x+l,a=Math.min(r.y,r.base),o=Math.max(r.y,r.base)}else{var s=r.height/2;e=Math.min(r.x,r.base),n=Math.max(r.x,r.base),a=r.y-s,o=r.y+s}return{left:e,top:a,right:n,bottom:o}}var o=t(25),r=t(26);o._set("global",{elements:{rectangle:{backgroundColor:o.global.defaultColor,borderColor:o.global.defaultColor,borderSkipped:"bottom",borderWidth:0}}}),e.exports=r.extend({draw:function(){function t(t){return m[(b+t)%4]}var e,n,i,a,o,r,l,s=this._chart.ctx,u=this._view,d=u.borderWidth;if(u.horizontal?(e=u.base,n=u.x,i=u.y-u.height/2,a=u.y+u.height/2,o=n>e?1:-1,r=1,l=u.borderSkipped||"left"):(e=u.x-u.width/2,n=u.x+u.width/2,i=u.y,o=1,r=(a=u.base)>i?1:-1,l=u.borderSkipped||"bottom"),d){var c=Math.min(Math.abs(e-n),Math.abs(i-a)),h=(d=d>c?c:d)/2,f=e+("left"!==l?h*o:0),g=n+("right"!==l?-h*o:0),p=i+("top"!==l?h*r:0),v=a+("bottom"!==l?-h*r:0);f!==g&&(i=p,a=v),p!==v&&(e=f,n=g)}s.beginPath(),s.fillStyle=u.backgroundColor,s.strokeStyle=u.borderColor,s.lineWidth=d;var m=[[e,a],[e,i],[n,i],[n,a]],b=["bottom","left","top","right"].indexOf(l,0);-1===b&&(b=0);var x=t(0);s.moveTo(x[0],x[1]);for(var y=1;y<4;y++)x=t(y),s.lineTo(x[0],x[1]);s.fill(),d&&s.stroke()},height:function(){var t=this._view;return t.base-t.y},inRange:function(t,e){var n=!1;if(this._view){var i=a(this);n=t>=i.left&&t<=i.right&&e>=i.top&&e<=i.bottom}return n},inLabelRange:function(t,e){var n=this;if(!n._view)return!1;var o=a(n);return i(n)?t>=o.left&&t<=o.right:e>=o.top&&e<=o.bottom},inXRange:function(t){var e=a(this);return t>=e.left&&t<=e.right},inYRange:function(t){var e=a(this);return t>=e.top&&t<=e.bottom},getCenterPoint:function(){var t,e,n=this._view;return i(this)?(t=n.x,e=(n.y+n.base)/2):(t=(n.x+n.base)/2,e=n.y),{x:t,y:e}},getArea:function(){var t=this._view;return t.width*Math.abs(t.y-t.base)},tooltipPosition:function(){var t=this._view;return{x:t.x,y:t.y}}})},{25:25,26:26}],40:[function(t,e,n){"use strict";e.exports={},e.exports.Arc=t(36),e.exports.Line=t(37),e.exports.Point=t(38),e.exports.Rectangle=t(39)},{36:36,37:37,38:38,39:39}],41:[function(t,e,n){"use strict";var i=t(42),n=e.exports={clear:function(t){t.ctx.clearRect(0,0,t.width,t.height)},roundedRect:function(t,e,n,i,a,o){if(o){var r=Math.min(o,i/2),l=Math.min(o,a/2);t.moveTo(e+r,n),t.lineTo(e+i-r,n),t.quadraticCurveTo(e+i,n,e+i,n+l),t.lineTo(e+i,n+a-l),t.quadraticCurveTo(e+i,n+a,e+i-r,n+a),t.lineTo(e+r,n+a),t.quadraticCurveTo(e,n+a,e,n+a-l),t.lineTo(e,n+l),t.quadraticCurveTo(e,n,e+r,n)}else t.rect(e,n,i,a)},drawPoint:function(t,e,n,i,a){var o,r,l,s,u,d;if("object"!=typeof e||"[object HTMLImageElement]"!==(o=e.toString())&&"[object HTMLCanvasElement]"!==o){if(!(isNaN(n)||n<=0)){switch(e){default:t.beginPath(),t.arc(i,a,n,0,2*Math.PI),t.closePath(),t.fill();break;case"triangle":t.beginPath(),u=(r=3*n/Math.sqrt(3))*Math.sqrt(3)/2,t.moveTo(i-r/2,a+u/3),t.lineTo(i+r/2,a+u/3),t.lineTo(i,a-2*u/3),t.closePath(),t.fill();break;case"rect":d=1/Math.SQRT2*n,t.beginPath(),t.fillRect(i-d,a-d,2*d,2*d),t.strokeRect(i-d,a-d,2*d,2*d);break;case"rectRounded":var c=n/Math.SQRT2,h=i-c,f=a-c,g=Math.SQRT2*n;t.beginPath(),this.roundedRect(t,h,f,g,g,n/2),t.closePath(),t.fill();break;case"rectRot":d=1/Math.SQRT2*n,t.beginPath(),t.moveTo(i-d,a),t.lineTo(i,a+d),t.lineTo(i+d,a),t.lineTo(i,a-d),t.closePath(),t.fill();break;case"cross":t.beginPath(),t.moveTo(i,a+n),t.lineTo(i,a-n),t.moveTo(i-n,a),t.lineTo(i+n,a),t.closePath();break;case"crossRot":t.beginPath(),l=Math.cos(Math.PI/4)*n,s=Math.sin(Math.PI/4)*n,t.moveTo(i-l,a-s),t.lineTo(i+l,a+s),t.moveTo(i-l,a+s),t.lineTo(i+l,a-s),t.closePath();break;case"star":t.beginPath(),t.moveTo(i,a+n),t.lineTo(i,a-n),t.moveTo(i-n,a),t.lineTo(i+n,a),l=Math.cos(Math.PI/4)*n,s=Math.sin(Math.PI/4)*n,t.moveTo(i-l,a-s),t.lineTo(i+l,a+s),t.moveTo(i-l,a+s),t.lineTo(i+l,a-s),t.closePath();break;case"line":t.beginPath(),t.moveTo(i-n,a),t.lineTo(i+n,a),t.closePath();break;case"dash":t.beginPath(),t.moveTo(i,a),t.lineTo(i+n,a),t.closePath()}t.stroke()}}else t.drawImage(e,i-e.width/2,a-e.height/2,e.width,e.height)},clipArea:function(t,e){t.save(),t.beginPath(),t.rect(e.left,e.top,e.right-e.left,e.bottom-e.top),t.clip()},unclipArea:function(t){t.restore()},lineTo:function(t,e,n,i){if(n.steppedLine)return"after"===n.steppedLine&&!i||"after"!==n.steppedLine&&i?t.lineTo(e.x,n.y):t.lineTo(n.x,e.y),void t.lineTo(n.x,n.y);n.tension?t.bezierCurveTo(i?e.controlPointPreviousX:e.controlPointNextX,i?e.controlPointPreviousY:e.controlPointNextY,i?n.controlPointNextX:n.controlPointPreviousX,i?n.controlPointNextY:n.controlPointPreviousY,n.x,n.y):t.lineTo(n.x,n.y)}};i.clear=n.clear,i.drawRoundedRectangle=function(t){t.beginPath(),n.roundedRect.apply(n,arguments),t.closePath()}},{42:42}],42:[function(t,e,n){"use strict";var i={noop:function(){},uid:function(){var t=0;return function(){return t++}}(),isNullOrUndef:function(t){return null===t||void 0===t},isArray:Array.isArray?Array.isArray:function(t){return"[object Array]"===Object.prototype.toString.call(t)},isObject:function(t){return null!==t&&"[object Object]"===Object.prototype.toString.call(t)},valueOrDefault:function(t,e){return void 0===t?e:t},valueAtIndexOrDefault:function(t,e,n){return i.valueOrDefault(i.isArray(t)?t[e]:t,n)},callback:function(t,e,n){if(t&&"function"==typeof t.call)return t.apply(n,e)},each:function(t,e,n,a){var o,r,l;if(i.isArray(t))if(r=t.length,a)for(o=r-1;o>=0;o--)e.call(n,t[o],o);else for(o=0;o<r;o++)e.call(n,t[o],o);else if(i.isObject(t))for(r=(l=Object.keys(t)).length,o=0;o<r;o++)e.call(n,t[l[o]],l[o])},arrayEquals:function(t,e){var n,a,o,r;if(!t||!e||t.length!==e.length)return!1;for(n=0,a=t.length;n<a;++n)if(o=t[n],r=e[n],o instanceof Array&&r instanceof Array){if(!i.arrayEquals(o,r))return!1}else if(o!==r)return!1;return!0},clone:function(t){if(i.isArray(t))return t.map(i.clone);if(i.isObject(t)){for(var e={},n=Object.keys(t),a=n.length,o=0;o<a;++o)e[n[o]]=i.clone(t[n[o]]);return e}return t},_merger:function(t,e,n,a){var o=e[t],r=n[t];i.isObject(o)&&i.isObject(r)?i.merge(o,r,a):e[t]=i.clone(r)},_mergerIf:function(t,e,n){var a=e[t],o=n[t];i.isObject(a)&&i.isObject(o)?i.mergeIf(a,o):e.hasOwnProperty(t)||(e[t]=i.clone(o))},merge:function(t,e,n){var a,o,r,l,s,u=i.isArray(e)?e:[e],d=u.length;if(!i.isObject(t))return t;for(a=(n=n||{}).merger||i._merger,o=0;o<d;++o)if(e=u[o],i.isObject(e))for(s=0,l=(r=Object.keys(e)).length;s<l;++s)a(r[s],t,e,n);return t},mergeIf:function(t,e){return i.merge(t,e,{merger:i._mergerIf})}};e.exports=i,i.callCallback=i.callback,i.indexOf=function(t,e,n){return Array.prototype.indexOf.call(t,e,n)},i.getValueOrDefault=i.valueOrDefault,i.getValueAtIndexOrDefault=i.valueAtIndexOrDefault},{}],43:[function(t,e,n){"use strict";var i=t(42),a={linear:function(t){return t},easeInQuad:function(t){return t*t},easeOutQuad:function(t){return-t*(t-2)},easeInOutQuad:function(t){return(t/=.5)<1?.5*t*t:-.5*(--t*(t-2)-1)},easeInCubic:function(t){return t*t*t},easeOutCubic:function(t){return(t-=1)*t*t+1},easeInOutCubic:function(t){return(t/=.5)<1?.5*t*t*t:.5*((t-=2)*t*t+2)},easeInQuart:function(t){return t*t*t*t},easeOutQuart:function(t){return-((t-=1)*t*t*t-1)},easeInOutQuart:function(t){return(t/=.5)<1?.5*t*t*t*t:-.5*((t-=2)*t*t*t-2)},easeInQuint:function(t){return t*t*t*t*t},easeOutQuint:function(t){return(t-=1)*t*t*t*t+1},easeInOutQuint:function(t){return(t/=.5)<1?.5*t*t*t*t*t:.5*((t-=2)*t*t*t*t+2)},easeInSine:function(t){return 1-Math.cos(t*(Math.PI/2))},easeOutSine:function(t){return Math.sin(t*(Math.PI/2))},easeInOutSine:function(t){return-.5*(Math.cos(Math.PI*t)-1)},easeInExpo:function(t){return 0===t?0:Math.pow(2,10*(t-1))},easeOutExpo:function(t){return 1===t?1:1-Math.pow(2,-10*t)},easeInOutExpo:function(t){return 0===t?0:1===t?1:(t/=.5)<1?.5*Math.pow(2,10*(t-1)):.5*(2-Math.pow(2,-10*--t))},easeInCirc:function(t){return t>=1?t:-(Math.sqrt(1-t*t)-1)},easeOutCirc:function(t){return Math.sqrt(1-(t-=1)*t)},easeInOutCirc:function(t){return(t/=.5)<1?-.5*(Math.sqrt(1-t*t)-1):.5*(Math.sqrt(1-(t-=2)*t)+1)},easeInElastic:function(t){var e=1.70158,n=0,i=1;return 0===t?0:1===t?1:(n||(n=.3),i<1?(i=1,e=n/4):e=n/(2*Math.PI)*Math.asin(1/i),-i*Math.pow(2,10*(t-=1))*Math.sin((t-e)*(2*Math.PI)/n))},easeOutElastic:function(t){var e=1.70158,n=0,i=1;return 0===t?0:1===t?1:(n||(n=.3),i<1?(i=1,e=n/4):e=n/(2*Math.PI)*Math.asin(1/i),i*Math.pow(2,-10*t)*Math.sin((t-e)*(2*Math.PI)/n)+1)},easeInOutElastic:function(t){var e=1.70158,n=0,i=1;return 0===t?0:2==(t/=.5)?1:(n||(n=.45),i<1?(i=1,e=n/4):e=n/(2*Math.PI)*Math.asin(1/i),t<1?i*Math.pow(2,10*(t-=1))*Math.sin((t-e)*(2*Math.PI)/n)*-.5:i*Math.pow(2,-10*(t-=1))*Math.sin((t-e)*(2*Math.PI)/n)*.5+1)},easeInBack:function(t){var e=1.70158;return t*t*((e+1)*t-e)},easeOutBack:function(t){var e=1.70158;return(t-=1)*t*((e+1)*t+e)+1},easeInOutBack:function(t){var e=1.70158;return(t/=.5)<1?t*t*((1+(e*=1.525))*t-e)*.5:.5*((t-=2)*t*((1+(e*=1.525))*t+e)+2)},easeInBounce:function(t){return 1-a.easeOutBounce(1-t)},easeOutBounce:function(t){return t<1/2.75?7.5625*t*t:t<2/2.75?7.5625*(t-=1.5/2.75)*t+.75:t<2.5/2.75?7.5625*(t-=2.25/2.75)*t+.9375:7.5625*(t-=2.625/2.75)*t+.984375},easeInOutBounce:function(t){return t<.5?.5*a.easeInBounce(2*t):.5*a.easeOutBounce(2*t-1)+.5}};e.exports={effects:a},i.easingEffects=a},{42:42}],44:[function(t,e,n){"use strict";var i=t(42);e.exports={toLineHeight:function(t,e){var n=(""+t).match(/^(normal|(\d+(?:\.\d+)?)(px|em|%)?)$/);if(!n||"normal"===n[1])return 1.2*e;switch(t=+n[2],n[3]){case"px":return t;case"%":t/=100}return e*t},toPadding:function(t){var e,n,a,o;return i.isObject(t)?(e=+t.top||0,n=+t.right||0,a=+t.bottom||0,o=+t.left||0):e=n=a=o=+t||0,{top:e,right:n,bottom:a,left:o,height:e+a,width:o+n}},resolve:function(t,e,n){var a,o,r;for(a=0,o=t.length;a<o;++a)if(void 0!==(r=t[a])&&(void 0!==e&&"function"==typeof r&&(r=r(e)),void 0!==n&&i.isArray(r)&&(r=r[n]),void 0!==r))return r}}},{42:42}],45:[function(t,e,n){"use strict";e.exports=t(42),e.exports.easing=t(43),e.exports.canvas=t(41),e.exports.options=t(44)},{41:41,42:42,43:43,44:44}],46:[function(t,e,n){e.exports={acquireContext:function(t){return t&&t.canvas&&(t=t.canvas),t&&t.getContext("2d")||null}}},{}],47:[function(t,e,n){"use strict";function i(t,e){var n=v.getStyle(t,e),i=n&&n.match(/^(\d+)(\.\d+)?px$/);return i?Number(i[1]):void 0}function a(t,e){var n=t.style,a=t.getAttribute("height"),o=t.getAttribute("width");if(t[m]={initial:{height:a,width:o,style:{display:n.display,height:n.height,width:n.width}}},n.display=n.display||"block",null===o||""===o){var r=i(t,"width");void 0!==r&&(t.width=r)}if(null===a||""===a)if(""===t.style.height)t.height=t.width/(e.options.aspectRatio||2);else{var l=i(t,"height");void 0!==r&&(t.height=l)}return t}function o(t,e,n){t.addEventListener(e,n,M)}function r(t,e,n){t.removeEventListener(e,n,M)}function l(t,e,n,i,a){return{type:t,chart:e,native:a||null,x:void 0!==n?n:null,y:void 0!==i?i:null}}function s(t,e){var n=w[t.type]||t.type,i=v.getRelativePosition(t,e);return l(n,e,i.x,i.y,t)}function u(t,e){var n=!1,i=[];return function(){i=Array.prototype.slice.call(arguments),e=e||this,n||(n=!0,v.requestAnimFrame.call(window,function(){n=!1,t.apply(e,i)}))}}function d(t){var e=document.createElement("div"),n=b+"size-monitor",i="position:absolute;left:0;top:0;right:0;bottom:0;overflow:hidden;pointer-events:none;visibility:hidden;z-index:-1;";e.style.cssText=i,e.className=n,e.innerHTML='<div class="'+n+'-expand" style="'+i+'"><div style="position:absolute;width:1000000px;height:1000000px;left:0;top:0"></div></div><div class="'+n+'-shrink" style="'+i+'"><div style="position:absolute;width:200%;height:200%;left:0; top:0"></div></div>';var a=e.childNodes[0],r=e.childNodes[1];e._reset=function(){a.scrollLeft=1e6,a.scrollTop=1e6,r.scrollLeft=1e6,r.scrollTop=1e6};var l=function(){e._reset(),t()};return o(a,"scroll",l.bind(a,"expand")),o(r,"scroll",l.bind(r,"shrink")),e}function c(t,e){var n=(t[m]||(t[m]={})).renderProxy=function(t){t.animationName===y&&e()};v.each(k,function(e){o(t,e,n)}),t.classList.add(x)}function h(t){var e=t[m]||{},n=e.renderProxy;n&&(v.each(k,function(e){r(t,e,n)}),delete e.renderProxy),t.classList.remove(x)}function f(t,e,n){var i=t[m]||(t[m]={}),a=i.resizer=d(u(function(){if(i.resizer)return e(l("resize",n))}));c(t,function(){if(i.resizer){var e=t.parentNode;e&&e!==a.parentNode&&e.insertBefore(a,e.firstChild),a._reset()}})}function g(t){var e=t[m]||{},n=e.resizer;delete e.resizer,h(t),n&&n.parentNode&&n.parentNode.removeChild(n)}function p(t,e){var n=t._style||document.createElement("style");t._style||(t._style=n,e="/* Chart.js */\n"+e,n.setAttribute("type","text/css"),document.getElementsByTagName("head")[0].appendChild(n)),n.appendChild(document.createTextNode(e))}var v=t(45),m="$chartjs",b="chartjs-",x=b+"render-monitor",y=b+"render-animation",k=["animationstart","webkitAnimationStart"],w={touchstart:"mousedown",touchmove:"mousemove",touchend:"mouseup",pointerenter:"mouseenter",pointerdown:"mousedown",pointermove:"mousemove",pointerup:"mouseup",pointerleave:"mouseout",pointerout:"mouseout"},M=!!function(){var t=!1;try{var e=Object.defineProperty({},"passive",{get:function(){t=!0}});window.addEventListener("e",null,e)}catch(t){}return t}()&&{passive:!0};e.exports={_enabled:"undefined"!=typeof window&&"undefined"!=typeof document,initialize:function(){var t="from{opacity:0.99}to{opacity:1}";p(this,"@-webkit-keyframes "+y+"{"+t+"}@keyframes "+y+"{"+t+"}."+x+"{-webkit-animation:"+y+" 0.001s;animation:"+y+" 0.001s;}")},acquireContext:function(t,e){"string"==typeof t?t=document.getElementById(t):t.length&&(t=t[0]),t&&t.canvas&&(t=t.canvas);var n=t&&t.getContext&&t.getContext("2d");return n&&n.canvas===t?(a(t,e),n):null},releaseContext:function(t){var e=t.canvas;if(e[m]){var n=e[m].initial;["height","width"].forEach(function(t){var i=n[t];v.isNullOrUndef(i)?e.removeAttribute(t):e.setAttribute(t,i)}),v.each(n.style||{},function(t,n){e.style[n]=t}),e.width=e.width,delete e[m]}},addEventListener:function(t,e,n){var i=t.canvas;if("resize"!==e){var a=n[m]||(n[m]={});o(i,e,(a.proxies||(a.proxies={}))[t.id+"_"+e]=function(e){n(s(e,t))})}else f(i,n,t)},removeEventListener:function(t,e,n){var i=t.canvas;if("resize"!==e){var a=((n[m]||{}).proxies||{})[t.id+"_"+e];a&&r(i,e,a)}else g(i)}},v.addEvent=o,v.removeEvent=r},{45:45}],48:[function(t,e,n){"use strict";var i=t(45),a=t(46),o=t(47),r=o._enabled?o:a;e.exports=i.extend({initialize:function(){},acquireContext:function(){},releaseContext:function(){},addEventListener:function(){},removeEventListener:function(){}},r)},{45:45,46:46,47:47}],49:[function(t,e,n){"use strict";var i=t(25),a=t(40),o=t(45);i._set("global",{plugins:{filler:{propagate:!0}}}),e.exports=function(){function t(t,e,n){var i,a=t._model||{},o=a.fill;if(void 0===o&&(o=!!a.backgroundColor),!1===o||null===o)return!1;if(!0===o)return"origin";if(i=parseFloat(o,10),isFinite(i)&&Math.floor(i)===i)return"-"!==o[0]&&"+"!==o[0]||(i=e+i),!(i===e||i<0||i>=n)&&i;switch(o){case"bottom":return"start";case"top":return"end";case"zero":return"origin";case"origin":case"start":case"end":return o;default:return!1}}function e(t){var e,n=t.el._model||{},i=t.el._scale||{},a=t.fill,o=null;if(isFinite(a))return null;if("start"===a?o=void 0===n.scaleBottom?i.bottom:n.scaleBottom:"end"===a?o=void 0===n.scaleTop?i.top:n.scaleTop:void 0!==n.scaleZero?o=n.scaleZero:i.getBasePosition?o=i.getBasePosition():i.getBasePixel&&(o=i.getBasePixel()),void 0!==o&&null!==o){if(void 0!==o.x&&void 0!==o.y)return o;if("number"==typeof o&&isFinite(o))return e=i.isHorizontal(),{x:e?o:null,y:e?null:o}}return null}function n(t,e,n){var i,a=t[e].fill,o=[e];if(!n)return a;for(;!1!==a&&-1===o.indexOf(a);){if(!isFinite(a))return a;if(!(i=t[a]))return!1;if(i.visible)return a;o.push(a),a=i.fill}return!1}function r(t){var e=t.fill,n="dataset";return!1===e?null:(isFinite(e)||(n="boundary"),d[n](t))}function l(t){return t&&!t.skip}function s(t,e,n,i,a){var r;if(i&&a){for(t.moveTo(e[0].x,e[0].y),r=1;r<i;++r)o.canvas.lineTo(t,e[r-1],e[r]);for(t.lineTo(n[a-1].x,n[a-1].y),r=a-1;r>0;--r)o.canvas.lineTo(t,n[r],n[r-1],!0)}}function u(t,e,n,i,a,o){var r,u,d,c,h,f,g,p=e.length,v=i.spanGaps,m=[],b=[],x=0,y=0;for(t.beginPath(),r=0,u=p+!!o;r<u;++r)h=n(c=e[d=r%p]._view,d,i),f=l(c),g=l(h),f&&g?(x=m.push(c),y=b.push(h)):x&&y&&(v?(f&&m.push(c),g&&b.push(h)):(s(t,m,b,x,y),x=y=0,m=[],b=[]));s(t,m,b,x,y),t.closePath(),t.fillStyle=a,t.fill()}var d={dataset:function(t){var e=t.fill,n=t.chart,i=n.getDatasetMeta(e),a=i&&n.isDatasetVisible(e)&&i.dataset._children||[],o=a.length||0;return o?function(t,e){return e<o&&a[e]._view||null}:null},boundary:function(t){var e=t.boundary,n=e?e.x:null,i=e?e.y:null;return function(t){return{x:null===n?t.x:n,y:null===i?t.y:i}}}};return{id:"filler",afterDatasetsUpdate:function(i,o){var l,s,u,d,c=(i.data.datasets||[]).length,h=o.propagate,f=[];for(s=0;s<c;++s)d=null,(u=(l=i.getDatasetMeta(s)).dataset)&&u._model&&u instanceof a.Line&&(d={visible:i.isDatasetVisible(s),fill:t(u,s,c),chart:i,el:u}),l.$filler=d,f.push(d);for(s=0;s<c;++s)(d=f[s])&&(d.fill=n(f,s,h),d.boundary=e(d),d.mapper=r(d))},beforeDatasetDraw:function(t,e){var n=e.meta.$filler;if(n){var a=t.ctx,r=n.el,l=r._view,s=r._children||[],d=n.mapper,c=l.backgroundColor||i.global.defaultColor;d&&c&&s.length&&(o.canvas.clipArea(a,t.chartArea),u(a,s,d,l,c,r._loop),o.canvas.unclipArea(a))}}}}},{25:25,40:40,45:45}],50:[function(t,e,n){"use strict";var i=t(25),a=t(26),o=t(45);i._set("global",{legend:{display:!0,position:"top",fullWidth:!0,reverse:!1,weight:1e3,onClick:function(t,e){var n=e.datasetIndex,i=this.chart,a=i.getDatasetMeta(n);a.hidden=null===a.hidden?!i.data.datasets[n].hidden:null,i.update()},onHover:null,labels:{boxWidth:40,padding:10,generateLabels:function(t){var e=t.data;return o.isArray(e.datasets)?e.datasets.map(function(e,n){return{text:e.label,fillStyle:o.isArray(e.backgroundColor)?e.backgroundColor[0]:e.backgroundColor,hidden:!t.isDatasetVisible(n),lineCap:e.borderCapStyle,lineDash:e.borderDash,lineDashOffset:e.borderDashOffset,lineJoin:e.borderJoinStyle,lineWidth:e.borderWidth,strokeStyle:e.borderColor,pointStyle:e.pointStyle,datasetIndex:n}},this):[]}}},legendCallback:function(t){var e=[];e.push('<ul class="'+t.id+'-legend">');for(var n=0;n<t.data.datasets.length;n++)e.push('<li><span style="background-color:'+t.data.datasets[n].backgroundColor+'"></span>'),t.data.datasets[n].label&&e.push(t.data.datasets[n].label),e.push("</li>");return e.push("</ul>"),e.join("")}}),e.exports=function(t){function e(t,e){return t.usePointStyle?e*Math.SQRT2:t.boxWidth}function n(e,n){var i=new t.Legend({ctx:e.ctx,options:n,chart:e});r.configure(e,i,n),r.addBox(e,i),e.legend=i}var r=t.layoutService,l=o.noop;return t.Legend=a.extend({initialize:function(t){o.extend(this,t),this.legendHitBoxes=[],this.doughnutMode=!1},beforeUpdate:l,update:function(t,e,n){var i=this;return i.beforeUpdate(),i.maxWidth=t,i.maxHeight=e,i.margins=n,i.beforeSetDimensions(),i.setDimensions(),i.afterSetDimensions(),i.beforeBuildLabels(),i.buildLabels(),i.afterBuildLabels(),i.beforeFit(),i.fit(),i.afterFit(),i.afterUpdate(),i.minSize},afterUpdate:l,beforeSetDimensions:l,setDimensions:function(){var t=this;t.isHorizontal()?(t.width=t.maxWidth,t.left=0,t.right=t.width):(t.height=t.maxHeight,t.top=0,t.bottom=t.height),t.paddingLeft=0,t.paddingTop=0,t.paddingRight=0,t.paddingBottom=0,t.minSize={width:0,height:0}},afterSetDimensions:l,beforeBuildLabels:l,buildLabels:function(){var t=this,e=t.options.labels||{},n=o.callback(e.generateLabels,[t.chart],t)||[];e.filter&&(n=n.filter(function(n){return e.filter(n,t.chart.data)})),t.options.reverse&&n.reverse(),t.legendItems=n},afterBuildLabels:l,beforeFit:l,fit:function(){var t=this,n=t.options,a=n.labels,r=n.display,l=t.ctx,s=i.global,u=o.valueOrDefault,d=u(a.fontSize,s.defaultFontSize),c=u(a.fontStyle,s.defaultFontStyle),h=u(a.fontFamily,s.defaultFontFamily),f=o.fontString(d,c,h),g=t.legendHitBoxes=[],p=t.minSize,v=t.isHorizontal();if(v?(p.width=t.maxWidth,p.height=r?10:0):(p.width=r?10:0,p.height=t.maxHeight),r)if(l.font=f,v){var m=t.lineWidths=[0],b=t.legendItems.length?d+a.padding:0;l.textAlign="left",l.textBaseline="top",o.each(t.legendItems,function(n,i){var o=e(a,d)+d/2+l.measureText(n.text).width;m[m.length-1]+o+a.padding>=t.width&&(b+=d+a.padding,m[m.length]=t.left),g[i]={left:0,top:0,width:o,height:d},m[m.length-1]+=o+a.padding}),p.height+=b}else{var x=a.padding,y=t.columnWidths=[],k=a.padding,w=0,M=0,S=d+x;o.each(t.legendItems,function(t,n){var i=e(a,d)+d/2+l.measureText(t.text).width;M+S>p.height&&(k+=w+a.padding,y.push(w),w=0,M=0),w=Math.max(w,i),M+=S,g[n]={left:0,top:0,width:i,height:d}}),k+=w,y.push(w),p.width+=k}t.width=p.width,t.height=p.height},afterFit:l,isHorizontal:function(){return"top"===this.options.position||"bottom"===this.options.position},draw:function(){var t=this,n=t.options,a=n.labels,r=i.global,l=r.elements.line,s=t.width,u=t.lineWidths;if(n.display){var d,c=t.ctx,h=o.valueOrDefault,f=h(a.fontColor,r.defaultFontColor),g=h(a.fontSize,r.defaultFontSize),p=h(a.fontStyle,r.defaultFontStyle),v=h(a.fontFamily,r.defaultFontFamily),m=o.fontString(g,p,v);c.textAlign="left",c.textBaseline="middle",c.lineWidth=.5,c.strokeStyle=f,c.fillStyle=f,c.font=m;var b=e(a,g),x=t.legendHitBoxes,y=function(t,e,i){if(!(isNaN(b)||b<=0)){c.save(),c.fillStyle=h(i.fillStyle,r.defaultColor),c.lineCap=h(i.lineCap,l.borderCapStyle),c.lineDashOffset=h(i.lineDashOffset,l.borderDashOffset),c.lineJoin=h(i.lineJoin,l.borderJoinStyle),c.lineWidth=h(i.lineWidth,l.borderWidth),c.strokeStyle=h(i.strokeStyle,r.defaultColor);var a=0===h(i.lineWidth,l.borderWidth);if(c.setLineDash&&c.setLineDash(h(i.lineDash,l.borderDash)),n.labels&&n.labels.usePointStyle){var s=g*Math.SQRT2/2,u=s/Math.SQRT2,d=t+u,f=e+u;o.canvas.drawPoint(c,i.pointStyle,s,d,f)}else a||c.strokeRect(t,e,b,g),c.fillRect(t,e,b,g);c.restore()}},k=function(t,e,n,i){var a=g/2,o=b+a+t,r=e+a;c.fillText(n.text,o,r),n.hidden&&(c.beginPath(),c.lineWidth=2,c.moveTo(o,r),c.lineTo(o+i,r),c.stroke())},w=t.isHorizontal();d=w?{x:t.left+(s-u[0])/2,y:t.top+a.padding,line:0}:{x:t.left+a.padding,y:t.top+a.padding,line:0};var M=g+a.padding;o.each(t.legendItems,function(e,n){var i=c.measureText(e.text).width,o=b+g/2+i,r=d.x,l=d.y;w?r+o>=s&&(l=d.y+=M,d.line++,r=d.x=t.left+(s-u[d.line])/2):l+M>t.bottom&&(r=d.x=r+t.columnWidths[d.line]+a.padding,l=d.y=t.top+a.padding,d.line++),y(r,l,e),x[n].left=r,x[n].top=l,k(r,l,e,i),w?d.x+=o+a.padding:d.y+=M})}},handleEvent:function(t){var e=this,n=e.options,i="mouseup"===t.type?"click":t.type,a=!1;if("mousemove"===i){if(!n.onHover)return}else{if("click"!==i)return;if(!n.onClick)return}var o=t.x,r=t.y;if(o>=e.left&&o<=e.right&&r>=e.top&&r<=e.bottom)for(var l=e.legendHitBoxes,s=0;s<l.length;++s){var u=l[s];if(o>=u.left&&o<=u.left+u.width&&r>=u.top&&r<=u.top+u.height){if("click"===i){n.onClick.call(e,t.native,e.legendItems[s]),a=!0;break}if("mousemove"===i){n.onHover.call(e,t.native,e.legendItems[s]),a=!0;break}}}return a}}),{id:"legend",beforeInit:function(t){var e=t.options.legend;e&&n(t,e)},beforeUpdate:function(t){var e=t.options.legend,a=t.legend;e?(o.mergeIf(e,i.global.legend),a?(r.configure(t,a,e),a.options=e):n(t,e)):a&&(r.removeBox(t,a),delete t.legend)},afterEvent:function(t,e){var n=t.legend;n&&n.handleEvent(e)}}}},{25:25,26:26,45:45}],51:[function(t,e,n){"use strict";var i=t(25),a=t(26),o=t(45);i._set("global",{title:{display:!1,fontStyle:"bold",fullWidth:!0,lineHeight:1.2,padding:10,position:"top",text:"",weight:2e3}}),e.exports=function(t){function e(e,i){var a=new t.Title({ctx:e.ctx,options:i,chart:e});n.configure(e,a,i),n.addBox(e,a),e.titleBlock=a}var n=t.layoutService,r=o.noop;return t.Title=a.extend({initialize:function(t){var e=this;o.extend(e,t),e.legendHitBoxes=[]},beforeUpdate:r,update:function(t,e,n){var i=this;return i.beforeUpdate(),i.maxWidth=t,i.maxHeight=e,i.margins=n,i.beforeSetDimensions(),i.setDimensions(),i.afterSetDimensions(),i.beforeBuildLabels(),i.buildLabels(),i.afterBuildLabels(),i.beforeFit(),i.fit(),i.afterFit(),i.afterUpdate(),i.minSize},afterUpdate:r,beforeSetDimensions:r,setDimensions:function(){var t=this;t.isHorizontal()?(t.width=t.maxWidth,t.left=0,t.right=t.width):(t.height=t.maxHeight,t.top=0,t.bottom=t.height),t.paddingLeft=0,t.paddingTop=0,t.paddingRight=0,t.paddingBottom=0,t.minSize={width:0,height:0}},afterSetDimensions:r,beforeBuildLabels:r,buildLabels:r,afterBuildLabels:r,beforeFit:r,fit:function(){var t=this,e=o.valueOrDefault,n=t.options,a=n.display,r=e(n.fontSize,i.global.defaultFontSize),l=t.minSize,s=o.isArray(n.text)?n.text.length:1,u=o.options.toLineHeight(n.lineHeight,r),d=a?s*u+2*n.padding:0;t.isHorizontal()?(l.width=t.maxWidth,l.height=d):(l.width=d,l.height=t.maxHeight),t.width=l.width,t.height=l.height},afterFit:r,isHorizontal:function(){var t=this.options.position;return"top"===t||"bottom"===t},draw:function(){var t=this,e=t.ctx,n=o.valueOrDefault,a=t.options,r=i.global;if(a.display){var l,s,u,d=n(a.fontSize,r.defaultFontSize),c=n(a.fontStyle,r.defaultFontStyle),h=n(a.fontFamily,r.defaultFontFamily),f=o.fontString(d,c,h),g=o.options.toLineHeight(a.lineHeight,d),p=g/2+a.padding,v=0,m=t.top,b=t.left,x=t.bottom,y=t.right;e.fillStyle=n(a.fontColor,r.defaultFontColor),e.font=f,t.isHorizontal()?(s=b+(y-b)/2,u=m+p,l=y-b):(s="left"===a.position?b+p:y-p,u=m+(x-m)/2,l=x-m,v=Math.PI*("left"===a.position?-.5:.5)),e.save(),e.translate(s,u),e.rotate(v),e.textAlign="center",e.textBaseline="middle";var k=a.text;if(o.isArray(k))for(var w=0,M=0;M<k.length;++M)e.fillText(k[M],0,w,l),w+=g;else e.fillText(k,0,0,l);e.restore()}}}),{id:"title",beforeInit:function(t){var n=t.options.title;n&&e(t,n)},beforeUpdate:function(a){var r=a.options.title,l=a.titleBlock;r?(o.mergeIf(r,i.global.title),l?(n.configure(a,l,r),l.options=r):e(a,r)):l&&(t.layoutService.removeBox(a,l),delete a.titleBlock)}}}},{25:25,26:26,45:45}],52:[function(t,e,n){"use strict";e.exports=function(t){var e={position:"bottom"},n=t.Scale.extend({getLabels:function(){var t=this.chart.data;return this.options.labels||(this.isHorizontal()?t.xLabels:t.yLabels)||t.labels},determineDataLimits:function(){var t=this,e=t.getLabels();t.minIndex=0,t.maxIndex=e.length-1;var n;void 0!==t.options.ticks.min&&(n=e.indexOf(t.options.ticks.min),t.minIndex=-1!==n?n:t.minIndex),void 0!==t.options.ticks.max&&(n=e.indexOf(t.options.ticks.max),t.maxIndex=-1!==n?n:t.maxIndex),t.min=e[t.minIndex],t.max=e[t.maxIndex]},buildTicks:function(){var t=this,e=t.getLabels();t.ticks=0===t.minIndex&&t.maxIndex===e.length-1?e:e.slice(t.minIndex,t.maxIndex+1)},getLabelForIndex:function(t,e){var n=this,i=n.chart.data,a=n.isHorizontal();return i.yLabels&&!a?n.getRightValue(i.datasets[e].data[t]):n.ticks[t-n.minIndex]},getPixelForValue:function(t,e){var n,i=this,a=i.options.offset,o=Math.max(i.maxIndex+1-i.minIndex-(a?0:1),1);if(void 0!==t&&null!==t&&(n=i.isHorizontal()?t.x:t.y),void 0!==n||void 0!==t&&isNaN(e)){var r=i.getLabels();t=n||t;var l=r.indexOf(t);e=-1!==l?l:e}if(i.isHorizontal()){var s=i.width/o,u=s*(e-i.minIndex);return a&&(u+=s/2),i.left+Math.round(u)}var d=i.height/o,c=d*(e-i.minIndex);return a&&(c+=d/2),i.top+Math.round(c)},getPixelForTick:function(t){return this.getPixelForValue(this.ticks[t],t+this.minIndex,null)},getValueForPixel:function(t){var e=this,n=e.options.offset,i=Math.max(e._ticks.length-(n?0:1),1),a=e.isHorizontal(),o=(a?e.width:e.height)/i;return t-=a?e.left:e.top,n&&(t-=o/2),(t<=0?0:Math.round(t/o))+e.minIndex},getBasePixel:function(){return this.bottom}});t.scaleService.registerScaleType("category",n,e)}},{}],53:[function(t,e,n){"use strict";var i=t(25),a=t(45),o=t(34);e.exports=function(t){var e={position:"left",ticks:{callback:o.formatters.linear}},n=t.LinearScaleBase.extend({determineDataLimits:function(){function t(t){return r?t.xAxisID===e.id:t.yAxisID===e.id}var e=this,n=e.options,i=e.chart,o=i.data.datasets,r=e.isHorizontal();e.min=null,e.max=null;var l=n.stacked;if(void 0===l&&a.each(o,function(e,n){if(!l){var a=i.getDatasetMeta(n);i.isDatasetVisible(n)&&t(a)&&void 0!==a.stack&&(l=!0)}}),n.stacked||l){var s={};a.each(o,function(o,r){var l=i.getDatasetMeta(r),u=[l.type,void 0===n.stacked&&void 0===l.stack?r:"",l.stack].join(".");void 0===s[u]&&(s[u]={positiveValues:[],negativeValues:[]});var d=s[u].positiveValues,c=s[u].negativeValues;i.isDatasetVisible(r)&&t(l)&&a.each(o.data,function(t,i){var a=+e.getRightValue(t);isNaN(a)||l.data[i].hidden||(d[i]=d[i]||0,c[i]=c[i]||0,n.relativePoints?d[i]=100:a<0?c[i]+=a:d[i]+=a)})}),a.each(s,function(t){var n=t.positiveValues.concat(t.negativeValues),i=a.min(n),o=a.max(n);e.min=null===e.min?i:Math.min(e.min,i),e.max=null===e.max?o:Math.max(e.max,o)})}else a.each(o,function(n,o){var r=i.getDatasetMeta(o);i.isDatasetVisible(o)&&t(r)&&a.each(n.data,function(t,n){var i=+e.getRightValue(t);isNaN(i)||r.data[n].hidden||(null===e.min?e.min=i:i<e.min&&(e.min=i),null===e.max?e.max=i:i>e.max&&(e.max=i))})});e.min=isFinite(e.min)&&!isNaN(e.min)?e.min:0,e.max=isFinite(e.max)&&!isNaN(e.max)?e.max:1,this.handleTickRangeOptions()},getTickLimit:function(){var t,e=this,n=e.options.ticks;if(e.isHorizontal())t=Math.min(n.maxTicksLimit?n.maxTicksLimit:11,Math.ceil(e.width/50));else{var o=a.valueOrDefault(n.fontSize,i.global.defaultFontSize);t=Math.min(n.maxTicksLimit?n.maxTicksLimit:11,Math.ceil(e.height/(2*o)))}return t},handleDirectionalChanges:function(){this.isHorizontal()||this.ticks.reverse()},getLabelForIndex:function(t,e){return+this.getRightValue(this.chart.data.datasets[e].data[t])},getPixelForValue:function(t){var e,n=this,i=n.start,a=+n.getRightValue(t),o=n.end-i;return n.isHorizontal()?(e=n.left+n.width/o*(a-i),Math.round(e)):(e=n.bottom-n.height/o*(a-i),Math.round(e))},getValueForPixel:function(t){var e=this,n=e.isHorizontal(),i=n?e.width:e.height,a=(n?t-e.left:e.bottom-t)/i;return e.start+(e.end-e.start)*a},getPixelForTick:function(t){return this.getPixelForValue(this.ticksAsNumbers[t])}});t.scaleService.registerScaleType("linear",n,e)}},{25:25,34:34,45:45}],54:[function(t,e,n){"use strict";var i=t(45),a=t(34);e.exports=function(t){var e=i.noop;t.LinearScaleBase=t.Scale.extend({getRightValue:function(e){return"string"==typeof e?+e:t.Scale.prototype.getRightValue.call(this,e)},handleTickRangeOptions:function(){var t=this,e=t.options.ticks;if(e.beginAtZero){var n=i.sign(t.min),a=i.sign(t.max);n<0&&a<0?t.max=0:n>0&&a>0&&(t.min=0)}var o=void 0!==e.min||void 0!==e.suggestedMin,r=void 0!==e.max||void 0!==e.suggestedMax;void 0!==e.min?t.min=e.min:void 0!==e.suggestedMin&&(null===t.min?t.min=e.suggestedMin:t.min=Math.min(t.min,e.suggestedMin)),void 0!==e.max?t.max=e.max:void 0!==e.suggestedMax&&(null===t.max?t.max=e.suggestedMax:t.max=Math.max(t.max,e.suggestedMax)),o!==r&&t.min>=t.max&&(o?t.max=t.min+1:t.min=t.max-1),t.min===t.max&&(t.max++,e.beginAtZero||t.min--)},getTickLimit:e,handleDirectionalChanges:e,buildTicks:function(){var t=this,e=t.options.ticks,n=t.getTickLimit(),o={maxTicks:n=Math.max(2,n),min:e.min,max:e.max,stepSize:i.valueOrDefault(e.fixedStepSize,e.stepSize)},r=t.ticks=a.generators.linear(o,t);t.handleDirectionalChanges(),t.max=i.max(r),t.min=i.min(r),e.reverse?(r.reverse(),t.start=t.max,t.end=t.min):(t.start=t.min,t.end=t.max)},convertTicksToLabels:function(){var e=this;e.ticksAsNumbers=e.ticks.slice(),e.zeroLineIndex=e.ticks.indexOf(0),t.Scale.prototype.convertTicksToLabels.call(e)}})}},{34:34,45:45}],55:[function(t,e,n){"use strict";var i=t(45),a=t(34);e.exports=function(t){var e={position:"left",ticks:{callback:a.formatters.logarithmic}},n=t.Scale.extend({determineDataLimits:function(){function t(t){return s?t.xAxisID===e.id:t.yAxisID===e.id}var e=this,n=e.options,a=n.ticks,o=e.chart,r=o.data.datasets,l=i.valueOrDefault,s=e.isHorizontal();e.min=null,e.max=null,e.minNotZero=null;var u=n.stacked;if(void 0===u&&i.each(r,function(e,n){if(!u){var i=o.getDatasetMeta(n);o.isDatasetVisible(n)&&t(i)&&void 0!==i.stack&&(u=!0)}}),n.stacked||u){var d={};i.each(r,function(a,r){var l=o.getDatasetMeta(r),s=[l.type,void 0===n.stacked&&void 0===l.stack?r:"",l.stack].join(".");o.isDatasetVisible(r)&&t(l)&&(void 0===d[s]&&(d[s]=[]),i.each(a.data,function(t,i){var a=d[s],o=+e.getRightValue(t);isNaN(o)||l.data[i].hidden||(a[i]=a[i]||0,n.relativePoints?a[i]=100:a[i]+=o)}))}),i.each(d,function(t){var n=i.min(t),a=i.max(t);e.min=null===e.min?n:Math.min(e.min,n),e.max=null===e.max?a:Math.max(e.max,a)})}else i.each(r,function(n,a){var r=o.getDatasetMeta(a);o.isDatasetVisible(a)&&t(r)&&i.each(n.data,function(t,n){var i=+e.getRightValue(t);isNaN(i)||r.data[n].hidden||(null===e.min?e.min=i:i<e.min&&(e.min=i),null===e.max?e.max=i:i>e.max&&(e.max=i),0!==i&&(null===e.minNotZero||i<e.minNotZero)&&(e.minNotZero=i))})});e.min=l(a.min,e.min),e.max=l(a.max,e.max),e.min===e.max&&(0!==e.min&&null!==e.min?(e.min=Math.pow(10,Math.floor(i.log10(e.min))-1),e.max=Math.pow(10,Math.floor(i.log10(e.max))+1)):(e.min=1,e.max=10))},buildTicks:function(){var t=this,e=t.options.ticks,n={min:e.min,max:e.max},o=t.ticks=a.generators.logarithmic(n,t);t.isHorizontal()||o.reverse(),t.max=i.max(o),t.min=i.min(o),e.reverse?(o.reverse(),t.start=t.max,t.end=t.min):(t.start=t.min,t.end=t.max)},convertTicksToLabels:function(){this.tickValues=this.ticks.slice(),t.Scale.prototype.convertTicksToLabels.call(this)},getLabelForIndex:function(t,e){return+this.getRightValue(this.chart.data.datasets[e].data[t])},getPixelForTick:function(t){return this.getPixelForValue(this.tickValues[t])},getPixelForValue:function(t){var e,n,a,o=this,r=o.start,l=+o.getRightValue(t),s=o.options.ticks;return o.isHorizontal()?(a=i.log10(o.end)-i.log10(r),0===l?n=o.left:(e=o.width,n=o.left+e/a*(i.log10(l)-i.log10(r)))):(e=o.height,0!==r||s.reverse?0===o.end&&s.reverse?(a=i.log10(o.start)-i.log10(o.minNotZero),n=l===o.end?o.top:l===o.minNotZero?o.top+.02*e:o.top+.02*e+.98*e/a*(i.log10(l)-i.log10(o.minNotZero))):0===l?n=s.reverse?o.top:o.bottom:(a=i.log10(o.end)-i.log10(r),e=o.height,n=o.bottom-e/a*(i.log10(l)-i.log10(r))):(a=i.log10(o.end)-i.log10(o.minNotZero),n=l===r?o.bottom:l===o.minNotZero?o.bottom-.02*e:o.bottom-.02*e-.98*e/a*(i.log10(l)-i.log10(o.minNotZero)))),n},getValueForPixel:function(t){var e,n,a=this,o=i.log10(a.end)-i.log10(a.start);return a.isHorizontal()?(n=a.width,e=a.start*Math.pow(10,(t-a.left)*o/n)):(n=a.height,e=Math.pow(10,(a.bottom-t)*o/n)/a.start),e}});t.scaleService.registerScaleType("logarithmic",n,e)}},{34:34,45:45}],56:[function(t,e,n){"use strict";var i=t(25),a=t(45),o=t(34);e.exports=function(t){function e(t){var e=t.options;return e.angleLines.display||e.pointLabels.display?t.chart.data.labels.length:0}function n(t){var e=t.options.pointLabels,n=a.valueOrDefault(e.fontSize,v.defaultFontSize),i=a.valueOrDefault(e.fontStyle,v.defaultFontStyle),o=a.valueOrDefault(e.fontFamily,v.defaultFontFamily);return{size:n,style:i,family:o,font:a.fontString(n,i,o)}}function r(t,e,n){return a.isArray(n)?{w:a.longestText(t,t.font,n),h:n.length*e+1.5*(n.length-1)*e}:{w:t.measureText(n).width,h:e}}function l(t,e,n,i,a){return t===i||t===a?{start:e-n/2,end:e+n/2}:t<i||t>a?{start:e-n-5,end:e}:{start:e,end:e+n+5}}function s(t){var i,o,s,u=n(t),d=Math.min(t.height/2,t.width/2),c={r:t.width,l:0,t:t.height,b:0},h={};t.ctx.font=u.font,t._pointLabelSizes=[];var f=e(t);for(i=0;i<f;i++){s=t.getPointPosition(i,d),o=r(t.ctx,u.size,t.pointLabels[i]||""),t._pointLabelSizes[i]=o;var g=t.getIndexAngle(i),p=a.toDegrees(g)%360,v=l(p,s.x,o.w,0,180),m=l(p,s.y,o.h,90,270);v.start<c.l&&(c.l=v.start,h.l=g),v.end>c.r&&(c.r=v.end,h.r=g),m.start<c.t&&(c.t=m.start,h.t=g),m.end>c.b&&(c.b=m.end,h.b=g)}t.setReductions(d,c,h)}function u(t){var e=Math.min(t.height/2,t.width/2);t.drawingArea=Math.round(e),t.setCenterPoint(0,0,0,0)}function d(t){return 0===t||180===t?"center":t<180?"left":"right"}function c(t,e,n,i){if(a.isArray(e))for(var o=n.y,r=1.5*i,l=0;l<e.length;++l)t.fillText(e[l],n.x,o),o+=r;else t.fillText(e,n.x,n.y)}function h(t,e,n){90===t||270===t?n.y-=e.h/2:(t>270||t<90)&&(n.y-=e.h)}function f(t){var i=t.ctx,o=a.valueOrDefault,r=t.options,l=r.angleLines,s=r.pointLabels;i.lineWidth=l.lineWidth,i.strokeStyle=l.color;var u=t.getDistanceFromCenterForValue(r.ticks.reverse?t.min:t.max),f=n(t);i.textBaseline="top";for(var g=e(t)-1;g>=0;g--){if(l.display){var p=t.getPointPosition(g,u);i.beginPath(),i.moveTo(t.xCenter,t.yCenter),i.lineTo(p.x,p.y),i.stroke(),i.closePath()}if(s.display){var m=t.getPointPosition(g,u+5),b=o(s.fontColor,v.defaultFontColor);i.font=f.font,i.fillStyle=b;var x=t.getIndexAngle(g),y=a.toDegrees(x);i.textAlign=d(y),h(y,t._pointLabelSizes[g],m),c(i,t.pointLabels[g]||"",m,f.size)}}}function g(t,n,i,o){var r=t.ctx;if(r.strokeStyle=a.valueAtIndexOrDefault(n.color,o-1),r.lineWidth=a.valueAtIndexOrDefault(n.lineWidth,o-1),t.options.gridLines.circular)r.beginPath(),r.arc(t.xCenter,t.yCenter,i,0,2*Math.PI),r.closePath(),r.stroke();else{var l=e(t);if(0===l)return;r.beginPath();var s=t.getPointPosition(0,i);r.moveTo(s.x,s.y);for(var u=1;u<l;u++)s=t.getPointPosition(u,i),r.lineTo(s.x,s.y);r.closePath(),r.stroke()}}function p(t){return a.isNumber(t)?t:0}var v=i.global,m={display:!0,animate:!0,position:"chartArea",angleLines:{display:!0,color:"rgba(0, 0, 0, 0.1)",lineWidth:1},gridLines:{circular:!1},ticks:{showLabelBackdrop:!0,backdropColor:"rgba(255,255,255,0.75)",backdropPaddingY:2,backdropPaddingX:2,callback:o.formatters.linear},pointLabels:{display:!0,fontSize:10,callback:function(t){return t}}},b=t.LinearScaleBase.extend({setDimensions:function(){var t=this,e=t.options,n=e.ticks;t.width=t.maxWidth,t.height=t.maxHeight,t.xCenter=Math.round(t.width/2),t.yCenter=Math.round(t.height/2);var i=a.min([t.height,t.width]),o=a.valueOrDefault(n.fontSize,v.defaultFontSize);t.drawingArea=e.display?i/2-(o/2+n.backdropPaddingY):i/2},determineDataLimits:function(){var t=this,e=t.chart,n=Number.POSITIVE_INFINITY,i=Number.NEGATIVE_INFINITY;a.each(e.data.datasets,function(o,r){if(e.isDatasetVisible(r)){var l=e.getDatasetMeta(r);a.each(o.data,function(e,a){var o=+t.getRightValue(e);isNaN(o)||l.data[a].hidden||(n=Math.min(o,n),i=Math.max(o,i))})}}),t.min=n===Number.POSITIVE_INFINITY?0:n,t.max=i===Number.NEGATIVE_INFINITY?0:i,t.handleTickRangeOptions()},getTickLimit:function(){var t=this.options.ticks,e=a.valueOrDefault(t.fontSize,v.defaultFontSize);return Math.min(t.maxTicksLimit?t.maxTicksLimit:11,Math.ceil(this.drawingArea/(1.5*e)))},convertTicksToLabels:function(){var e=this;t.LinearScaleBase.prototype.convertTicksToLabels.call(e),e.pointLabels=e.chart.data.labels.map(e.options.pointLabels.callback,e)},getLabelForIndex:function(t,e){return+this.getRightValue(this.chart.data.datasets[e].data[t])},fit:function(){this.options.pointLabels.display?s(this):u(this)},setReductions:function(t,e,n){var i=this,a=e.l/Math.sin(n.l),o=Math.max(e.r-i.width,0)/Math.sin(n.r),r=-e.t/Math.cos(n.t),l=-Math.max(e.b-i.height,0)/Math.cos(n.b);a=p(a),o=p(o),r=p(r),l=p(l),i.drawingArea=Math.min(Math.round(t-(a+o)/2),Math.round(t-(r+l)/2)),i.setCenterPoint(a,o,r,l)},setCenterPoint:function(t,e,n,i){var a=this,o=a.width-e-a.drawingArea,r=t+a.drawingArea,l=n+a.drawingArea,s=a.height-i-a.drawingArea;a.xCenter=Math.round((r+o)/2+a.left),a.yCenter=Math.round((l+s)/2+a.top)},getIndexAngle:function(t){return t*(2*Math.PI/e(this))+(this.chart.options&&this.chart.options.startAngle?this.chart.options.startAngle:0)*Math.PI*2/360},getDistanceFromCenterForValue:function(t){var e=this;if(null===t)return 0;var n=e.drawingArea/(e.max-e.min);return e.options.ticks.reverse?(e.max-t)*n:(t-e.min)*n},getPointPosition:function(t,e){var n=this,i=n.getIndexAngle(t)-Math.PI/2;return{x:Math.round(Math.cos(i)*e)+n.xCenter,y:Math.round(Math.sin(i)*e)+n.yCenter}},getPointPositionForValue:function(t,e){return this.getPointPosition(t,this.getDistanceFromCenterForValue(e))},getBasePosition:function(){var t=this,e=t.min,n=t.max;return t.getPointPositionForValue(0,t.beginAtZero?0:e<0&&n<0?n:e>0&&n>0?e:0)},draw:function(){var t=this,e=t.options,n=e.gridLines,i=e.ticks,o=a.valueOrDefault;if(e.display){var r=t.ctx,l=this.getIndexAngle(0),s=o(i.fontSize,v.defaultFontSize),u=o(i.fontStyle,v.defaultFontStyle),d=o(i.fontFamily,v.defaultFontFamily),c=a.fontString(s,u,d);a.each(t.ticks,function(e,a){if(a>0||i.reverse){var u=t.getDistanceFromCenterForValue(t.ticksAsNumbers[a]);if(n.display&&0!==a&&g(t,n,u,a),i.display){var d=o(i.fontColor,v.defaultFontColor);if(r.font=c,r.save(),r.translate(t.xCenter,t.yCenter),r.rotate(l),i.showLabelBackdrop){var h=r.measureText(e).width;r.fillStyle=i.backdropColor,r.fillRect(-h/2-i.backdropPaddingX,-u-s/2-i.backdropPaddingY,h+2*i.backdropPaddingX,s+2*i.backdropPaddingY)}r.textAlign="center",r.textBaseline="middle",r.fillStyle=d,r.fillText(e,0,-u),r.restore()}}}),(e.angleLines.display||e.pointLabels.display)&&f(t)}}});t.scaleService.registerScaleType("radialLinear",b,m)}},{25:25,34:34,45:45}],57:[function(t,e,n){"use strict";function i(t,e){return t-e}function a(t){var e,n,i,a={},o=[];for(e=0,n=t.length;e<n;++e)a[i=t[e]]||(a[i]=!0,o.push(i));return o}function o(t,e,n,i){if("linear"===i||!t.length)return[{time:e,pos:0},{time:n,pos:1}];var a,o,r,l,s,u=[],d=[e];for(a=0,o=t.length;a<o;++a)(l=t[a])>e&&l<n&&d.push(l);for(d.push(n),a=0,o=d.length;a<o;++a)s=d[a+1],r=d[a-1],l=d[a],void 0!==r&&void 0!==s&&Math.round((s+r)/2)===l||u.push({time:l,pos:a/(o-1)});return u}function r(t,e,n){for(var i,a,o,r=0,l=t.length-1;r>=0&&r<=l;){if(i=r+l>>1,a=t[i-1]||null,o=t[i],!a)return{lo:null,hi:o};if(o[e]<n)r=i+1;else{if(!(a[e]>n))return{lo:a,hi:o};l=i-1}}return{lo:o,hi:null}}function l(t,e,n,i){var a=r(t,e,n),o=a.lo?a.hi?a.lo:t[t.length-2]:t[0],l=a.lo?a.hi?a.hi:t[t.length-1]:t[1],s=l[e]-o[e],u=s?(n-o[e])/s:0,d=(l[i]-o[i])*u;return o[i]+d}function s(t,e){var n=e.parser,i=e.parser||e.format;return"function"==typeof n?n(t):"string"==typeof t&&"string"==typeof i?v(t,i):(t instanceof v||(t=v(t)),t.isValid()?t:"function"==typeof i?i(t):t)}function u(t,e){if(b.isNullOrUndef(t))return null;var n=e.options.time,i=s(e.getRightValue(t),n);return i.isValid()?(n.round&&i.startOf(n.round),i.valueOf()):null}function d(t,e,n,i){var a,o,r,l=e-t,s=k[n],u=s.size,d=s.steps;if(!d)return Math.ceil(l/((i||1)*u));for(a=0,o=d.length;a<o&&(r=d[a],!(Math.ceil(l/(u*r))<=i));++a);return r}function c(t,e,n,i){var a,o,r,l=w.length;for(a=w.indexOf(t);a<l-1;++a)if(o=k[w[a]],r=o.steps?o.steps[o.steps.length-1]:y,Math.ceil((n-e)/(r*o.size))<=i)return w[a];return w[l-1]}function h(t){for(var e=w.indexOf(t)+1,n=w.length;e<n;++e)if(k[w[e]].major)return w[e]}function f(t,e,n,i,a,o){var r,l=o.time,s=b.valueOrDefault(l.stepSize,l.unitStepSize),u="week"===n&&l.isoWeekday,c=o.ticks.major.enabled,h=k[n],f=v(t),g=v(e),p=[];for(s||(s=d(t,e,n,a)),u&&(f=f.isoWeekday(u),g=g.isoWeekday(u)),f=f.startOf(u?"day":n),(g=g.startOf(u?"day":n))<e&&g.add(1,n),r=v(f),c&&i&&!u&&!l.round&&(r.startOf(i),r.add(~~((f-r)/(h.size*s))*s,n));r<g;r.add(s,n))p.push(+r);return p.push(+r),p}function g(t,e,n,i,a){var o,r,s=0,u=0;return a.offset&&e.length&&(a.time.min||(o=e.length>1?e[1]:i,r=e[0],s=(l(t,"time",o,"pos")-l(t,"time",r,"pos"))/2),a.time.max||(o=e[e.length-1],r=e.length>1?e[e.length-2]:n,u=(l(t,"time",o,"pos")-l(t,"time",r,"pos"))/2)),{left:s,right:u}}function p(t,e){var n,i,a,o,r=[];for(n=0,i=t.length;n<i;++n)a=t[n],o=!!e&&a===+v(a).startOf(e),r.push({value:a,major:o});return r}var v=t(1);v="function"==typeof v?v:window.moment;var m=t(25),b=t(45),x=Number.MIN_SAFE_INTEGER||-9007199254740991,y=Number.MAX_SAFE_INTEGER||9007199254740991,k={millisecond:{major:!0,size:1,steps:[1,2,5,10,20,50,100,250,500]},second:{major:!0,size:1e3,steps:[1,2,5,10,30]},minute:{major:!0,size:6e4,steps:[1,2,5,10,30]},hour:{major:!0,size:36e5,steps:[1,2,3,6,12]},day:{major:!0,size:864e5,steps:[1,2,5]},week:{major:!1,size:6048e5,steps:[1,2,3,4]},month:{major:!0,size:2628e6,steps:[1,2,3]},quarter:{major:!1,size:7884e6,steps:[1,2,3,4]},year:{major:!0,size:3154e7}},w=Object.keys(k);e.exports=function(t){var e={position:"bottom",distribution:"linear",bounds:"data",time:{parser:!1,format:!1,unit:!1,round:!1,displayFormat:!1,isoWeekday:!1,minUnit:"millisecond",displayFormats:{millisecond:"h:mm:ss.SSS a",second:"h:mm:ss a",minute:"h:mm a",hour:"hA",day:"MMM D",week:"ll",month:"MMM YYYY",quarter:"[Q]Q - YYYY",year:"YYYY"}},ticks:{autoSkip:!1,source:"auto",major:{enabled:!1}}},n=t.Scale.extend({initialize:function(){if(!v)throw new Error("Chart.js - Moment.js could not be found! You must include it before Chart.js to use the time scale. Download at https://momentjs.com");this.mergeTicksOptions(),t.Scale.prototype.initialize.call(this)},update:function(){var e=this,n=e.options;return n.time&&n.time.format&&console.warn("options.time.format is deprecated and replaced by options.time.parser."),t.Scale.prototype.update.apply(e,arguments)},getRightValue:function(e){return e&&void 0!==e.t&&(e=e.t),t.Scale.prototype.getRightValue.call(this,e)},determineDataLimits:function(){var t,e,n,o,r,l,s=this,d=s.chart,c=s.options.time,h=u(c.min,s)||y,f=u(c.max,s)||x,g=[],p=[],m=[];for(t=0,n=d.data.labels.length;t<n;++t)m.push(u(d.data.labels[t],s));for(t=0,n=(d.data.datasets||[]).length;t<n;++t)if(d.isDatasetVisible(t))if(r=d.data.datasets[t].data,b.isObject(r[0]))for(p[t]=[],e=0,o=r.length;e<o;++e)l=u(r[e],s),g.push(l),p[t][e]=l;else g.push.apply(g,m),p[t]=m.slice(0);else p[t]=[];m.length&&(m=a(m).sort(i),h=Math.min(h,m[0]),f=Math.max(f,m[m.length-1])),g.length&&(g=a(g).sort(i),h=Math.min(h,g[0]),f=Math.max(f,g[g.length-1])),h=h===y?+v().startOf("day"):h,f=f===x?+v().endOf("day")+1:f,s.min=Math.min(h,f),s.max=Math.max(h+1,f),s._horizontal=s.isHorizontal(),s._table=[],s._timestamps={data:g,datasets:p,labels:m}},buildTicks:function(){var t,e,n,i=this,a=i.min,r=i.max,l=i.options,s=l.time,d=s.displayFormats,v=i.getLabelCapacity(a),m=s.unit||c(s.minUnit,a,r,v),b=h(m),x=[],y=[];switch(l.ticks.source){case"data":x=i._timestamps.data;break;case"labels":x=i._timestamps.labels;break;case"auto":default:x=f(a,r,m,b,v,l)}for("ticks"===l.bounds&&x.length&&(a=x[0],r=x[x.length-1]),a=u(s.min,i)||a,r=u(s.max,i)||r,t=0,e=x.length;t<e;++t)(n=x[t])>=a&&n<=r&&y.push(n);return i.min=a,i.max=r,i._unit=m,i._majorUnit=b,i._minorFormat=d[m],i._majorFormat=d[b],i._table=o(i._timestamps.data,a,r,l.distribution),i._offsets=g(i._table,y,a,r,l),p(y,b)},getLabelForIndex:function(t,e){var n=this,i=n.chart.data,a=n.options.time,o=i.labels&&t<i.labels.length?i.labels[t]:"",r=i.datasets[e].data[t];return b.isObject(r)&&(o=n.getRightValue(r)),a.tooltipFormat&&(o=s(o,a).format(a.tooltipFormat)),o},tickFormatFunction:function(t,e,n){var i=this,a=i.options,o=t.valueOf(),r=i._majorUnit,l=i._majorFormat,s=t.clone().startOf(i._majorUnit).valueOf(),u=a.ticks.major,d=u.enabled&&r&&l&&o===s,c=t.format(d?l:i._minorFormat),h=d?u:a.ticks.minor,f=b.valueOrDefault(h.callback,h.userCallback);return f?f(c,e,n):c},convertTicksToLabels:function(t){var e,n,i=[];for(e=0,n=t.length;e<n;++e)i.push(this.tickFormatFunction(v(t[e].value),e,t));return i},getPixelForOffset:function(t){var e=this,n=e._horizontal?e.width:e.height,i=e._horizontal?e.left:e.top,a=l(e._table,"time",t,"pos");return i+n*(e._offsets.left+a)/(e._offsets.left+1+e._offsets.right)},getPixelForValue:function(t,e,n){var i=this,a=null;if(void 0!==e&&void 0!==n&&(a=i._timestamps.datasets[n][e]),null===a&&(a=u(t,i)),null!==a)return i.getPixelForOffset(a)},getPixelForTick:function(t){var e=this.getTicks();return t>=0&&t<e.length?this.getPixelForOffset(e[t].value):null},getValueForPixel:function(t){var e=this,n=e._horizontal?e.width:e.height,i=e._horizontal?e.left:e.top,a=(n?(t-i)/n:0)*(e._offsets.left+1+e._offsets.left)-e._offsets.right,o=l(e._table,"pos",a,"time");return v(o)},getLabelWidth:function(t){var e=this,n=e.options.ticks,i=e.ctx.measureText(t).width,a=b.toRadians(n.maxRotation),o=Math.cos(a),r=Math.sin(a);return i*o+b.valueOrDefault(n.fontSize,m.global.defaultFontSize)*r},getLabelCapacity:function(t){var e=this;e._minorFormat=e.options.time.displayFormats.millisecond;var n=e.tickFormatFunction(v(t),0,[]),i=e.getLabelWidth(n),a=e.isHorizontal()?e.width:e.height;return Math.floor(a/i)}});t.scaleService.registerScaleType("time",n,e)}},{1:1,25:25,45:45}]},{},[7])(7)});
/*!
 * Select2 4.0.3
 * https://select2.github.io
 *
 * Released under the MIT license
 * https://github.com/select2/select2/blob/master/LICENSE.md
 */

(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    // Node/CommonJS
    factory(require('jquery'));
  } else {
    // Browser globals
    factory(jQuery);
  }
}(function (jQuery) {
  // This is needed so we can catch the AMD loader configuration and use it
  // The inner file should be wrapped (by `banner.start.js`) in a function that
  // returns the AMD loader references.
  var S2 =
(function () {
  // Restore the Select2 AMD loader so it can be used
  // Needed mostly in the language files, where the loader is not inserted
  if (jQuery && jQuery.fn && jQuery.fn.select2 && jQuery.fn.select2.amd) {
    var S2 = jQuery.fn.select2.amd;
  }
var S2;(function () { if (!S2 || !S2.requirejs) {
if (!S2) { S2 = {}; } else { require = S2; }
/**
 * @license almond 0.3.1 Copyright (c) 2011-2014, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/almond for details
 */
//Going sloppy to avoid 'use strict' string cost, but strict practices should
//be followed.
/*jslint sloppy: true */
/*global setTimeout: false */

var requirejs, require, define;
(function (undef) {
    var main, req, makeMap, handlers,
        defined = {},
        waiting = {},
        config = {},
        defining = {},
        hasOwn = Object.prototype.hasOwnProperty,
        aps = [].slice,
        jsSuffixRegExp = /\.js$/;

    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }

    /**
     * Given a relative module name, like ./something, normalize it to
     * a real name that can be mapped to a path.
     * @param {String} name the relative name
     * @param {String} baseName a real name that the name arg is relative
     * to.
     * @returns {String} normalized name
     */
    function normalize(name, baseName) {
        var nameParts, nameSegment, mapValue, foundMap, lastIndex,
            foundI, foundStarMap, starI, i, j, part,
            baseParts = baseName && baseName.split("/"),
            map = config.map,
            starMap = (map && map['*']) || {};

        //Adjust any relative paths.
        if (name && name.charAt(0) === ".") {
            //If have a base name, try to normalize against it,
            //otherwise, assume it is a top-level require that will
            //be relative to baseUrl in the end.
            if (baseName) {
                name = name.split('/');
                lastIndex = name.length - 1;

                // Node .js allowance:
                if (config.nodeIdCompat && jsSuffixRegExp.test(name[lastIndex])) {
                    name[lastIndex] = name[lastIndex].replace(jsSuffixRegExp, '');
                }

                //Lop off the last part of baseParts, so that . matches the
                //"directory" and not name of the baseName's module. For instance,
                //baseName of "one/two/three", maps to "one/two/three.js", but we
                //want the directory, "one/two" for this normalization.
                name = baseParts.slice(0, baseParts.length - 1).concat(name);

                //start trimDots
                for (i = 0; i < name.length; i += 1) {
                    part = name[i];
                    if (part === ".") {
                        name.splice(i, 1);
                        i -= 1;
                    } else if (part === "..") {
                        if (i === 1 && (name[2] === '..' || name[0] === '..')) {
                            //End of the line. Keep at least one non-dot
                            //path segment at the front so it can be mapped
                            //correctly to disk. Otherwise, there is likely
                            //no path mapping for a path starting with '..'.
                            //This can still fail, but catches the most reasonable
                            //uses of ..
                            break;
                        } else if (i > 0) {
                            name.splice(i - 1, 2);
                            i -= 2;
                        }
                    }
                }
                //end trimDots

                name = name.join("/");
            } else if (name.indexOf('./') === 0) {
                // No baseName, so this is ID is resolved relative
                // to baseUrl, pull off the leading dot.
                name = name.substring(2);
            }
        }

        //Apply map config if available.
        if ((baseParts || starMap) && map) {
            nameParts = name.split('/');

            for (i = nameParts.length; i > 0; i -= 1) {
                nameSegment = nameParts.slice(0, i).join("/");

                if (baseParts) {
                    //Find the longest baseName segment match in the config.
                    //So, do joins on the biggest to smallest lengths of baseParts.
                    for (j = baseParts.length; j > 0; j -= 1) {
                        mapValue = map[baseParts.slice(0, j).join('/')];

                        //baseName segment has  config, find if it has one for
                        //this name.
                        if (mapValue) {
                            mapValue = mapValue[nameSegment];
                            if (mapValue) {
                                //Match, update name to the new value.
                                foundMap = mapValue;
                                foundI = i;
                                break;
                            }
                        }
                    }
                }

                if (foundMap) {
                    break;
                }

                //Check for a star map match, but just hold on to it,
                //if there is a shorter segment match later in a matching
                //config, then favor over this star map.
                if (!foundStarMap && starMap && starMap[nameSegment]) {
                    foundStarMap = starMap[nameSegment];
                    starI = i;
                }
            }

            if (!foundMap && foundStarMap) {
                foundMap = foundStarMap;
                foundI = starI;
            }

            if (foundMap) {
                nameParts.splice(0, foundI, foundMap);
                name = nameParts.join('/');
            }
        }

        return name;
    }

    function makeRequire(relName, forceSync) {
        return function () {
            //A version of a require function that passes a moduleName
            //value for items that may need to
            //look up paths relative to the moduleName
            var args = aps.call(arguments, 0);

            //If first arg is not require('string'), and there is only
            //one arg, it is the array form without a callback. Insert
            //a null so that the following concat is correct.
            if (typeof args[0] !== 'string' && args.length === 1) {
                args.push(null);
            }
            return req.apply(undef, args.concat([relName, forceSync]));
        };
    }

    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(depName) {
        return function (value) {
            defined[depName] = value;
        };
    }

    function callDep(name) {
        if (hasProp(waiting, name)) {
            var args = waiting[name];
            delete waiting[name];
            defining[name] = true;
            main.apply(undef, args);
        }

        if (!hasProp(defined, name) && !hasProp(defining, name)) {
            throw new Error('No ' + name);
        }
        return defined[name];
    }

    //Turns a plugin!resource to [plugin, resource]
    //with the plugin being undefined if the name
    //did not have a plugin prefix.
    function splitPrefix(name) {
        var prefix,
            index = name ? name.indexOf('!') : -1;
        if (index > -1) {
            prefix = name.substring(0, index);
            name = name.substring(index + 1, name.length);
        }
        return [prefix, name];
    }

    /**
     * Makes a name map, normalizing the name, and using a plugin
     * for normalization if necessary. Grabs a ref to plugin
     * too, as an optimization.
     */
    makeMap = function (name, relName) {
        var plugin,
            parts = splitPrefix(name),
            prefix = parts[0];

        name = parts[1];

        if (prefix) {
            prefix = normalize(prefix, relName);
            plugin = callDep(prefix);
        }

        //Normalize according
        if (prefix) {
            if (plugin && plugin.normalize) {
                name = plugin.normalize(name, makeNormalize(relName));
            } else {
                name = normalize(name, relName);
            }
        } else {
            name = normalize(name, relName);
            parts = splitPrefix(name);
            prefix = parts[0];
            name = parts[1];
            if (prefix) {
                plugin = callDep(prefix);
            }
        }

        //Using ridiculous property names for space reasons
        return {
            f: prefix ? prefix + '!' + name : name, //fullName
            n: name,
            pr: prefix,
            p: plugin
        };
    };

    function makeConfig(name) {
        return function () {
            return (config && config.config && config.config[name]) || {};
        };
    }

    handlers = {
        require: function (name) {
            return makeRequire(name);
        },
        exports: function (name) {
            var e = defined[name];
            if (typeof e !== 'undefined') {
                return e;
            } else {
                return (defined[name] = {});
            }
        },
        module: function (name) {
            return {
                id: name,
                uri: '',
                exports: defined[name],
                config: makeConfig(name)
            };
        }
    };

    main = function (name, deps, callback, relName) {
        var cjsModule, depName, ret, map, i,
            args = [],
            callbackType = typeof callback,
            usingExports;

        //Use name if no relName
        relName = relName || name;

        //Call the callback to define the module, if necessary.
        if (callbackType === 'undefined' || callbackType === 'function') {
            //Pull out the defined dependencies and pass the ordered
            //values to the callback.
            //Default to [require, exports, module] if no deps
            deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
            for (i = 0; i < deps.length; i += 1) {
                map = makeMap(deps[i], relName);
                depName = map.f;

                //Fast path CommonJS standard dependencies.
                if (depName === "require") {
                    args[i] = handlers.require(name);
                } else if (depName === "exports") {
                    //CommonJS module spec 1.1
                    args[i] = handlers.exports(name);
                    usingExports = true;
                } else if (depName === "module") {
                    //CommonJS module spec 1.1
                    cjsModule = args[i] = handlers.module(name);
                } else if (hasProp(defined, depName) ||
                           hasProp(waiting, depName) ||
                           hasProp(defining, depName)) {
                    args[i] = callDep(depName);
                } else if (map.p) {
                    map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
                    args[i] = defined[depName];
                } else {
                    throw new Error(name + ' missing ' + depName);
                }
            }

            ret = callback ? callback.apply(defined[name], args) : undefined;

            if (name) {
                //If setting exports via "module" is in play,
                //favor that over return value and exports. After that,
                //favor a non-undefined return value over exports use.
                if (cjsModule && cjsModule.exports !== undef &&
                        cjsModule.exports !== defined[name]) {
                    defined[name] = cjsModule.exports;
                } else if (ret !== undef || !usingExports) {
                    //Use the return value from the function.
                    defined[name] = ret;
                }
            }
        } else if (name) {
            //May just be an object definition for the module. Only
            //worry about defining if have a module name.
            defined[name] = callback;
        }
    };

    requirejs = require = req = function (deps, callback, relName, forceSync, alt) {
        if (typeof deps === "string") {
            if (handlers[deps]) {
                //callback in this case is really relName
                return handlers[deps](callback);
            }
            //Just return the module wanted. In this scenario, the
            //deps arg is the module name, and second arg (if passed)
            //is just the relName.
            //Normalize module name, if it contains . or ..
            return callDep(makeMap(deps, callback).f);
        } else if (!deps.splice) {
            //deps is a config object, not an array.
            config = deps;
            if (config.deps) {
                req(config.deps, config.callback);
            }
            if (!callback) {
                return;
            }

            if (callback.splice) {
                //callback is an array, which means it is a dependency list.
                //Adjust args if there are dependencies
                deps = callback;
                callback = relName;
                relName = null;
            } else {
                deps = undef;
            }
        }

        //Support require(['a'])
        callback = callback || function () {};

        //If relName is a function, it is an errback handler,
        //so remove it.
        if (typeof relName === 'function') {
            relName = forceSync;
            forceSync = alt;
        }

        //Simulate async callback;
        if (forceSync) {
            main(undef, deps, callback, relName);
        } else {
            //Using a non-zero value because of concern for what old browsers
            //do, and latest browsers "upgrade" to 4 if lower value is used:
            //http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html#dom-windowtimers-settimeout:
            //If want a value immediately, use require('id') instead -- something
            //that works in almond on the global level, but not guaranteed and
            //unlikely to work in other AMD implementations.
            setTimeout(function () {
                main(undef, deps, callback, relName);
            }, 4);
        }

        return req;
    };

    /**
     * Just drops the config on the floor, but returns req in case
     * the config return value is used.
     */
    req.config = function (cfg) {
        return req(cfg);
    };

    /**
     * Expose module registry for debugging and tooling
     */
    requirejs._defined = defined;

    define = function (name, deps, callback) {
        if (typeof name !== 'string') {
            throw new Error('See almond README: incorrect module build, no module name');
        }

        //This module may not have dependencies
        if (!deps.splice) {
            //deps is not an array, so probably means
            //an object literal or factory function for
            //the value. Adjust args.
            callback = deps;
            deps = [];
        }

        if (!hasProp(defined, name) && !hasProp(waiting, name)) {
            waiting[name] = [name, deps, callback];
        }
    };

    define.amd = {
        jQuery: true
    };
}());

S2.requirejs = requirejs;S2.require = require;S2.define = define;
}
}());
S2.define("almond", function(){});

/* global jQuery:false, $:false */
S2.define('jquery',[],function () {
  var _$ = jQuery || $;

  if (_$ == null && console && console.error) {
    console.error(
      'Select2: An instance of jQuery or a jQuery-compatible library was not ' +
      'found. Make sure that you are including jQuery before Select2 on your ' +
      'web page.'
    );
  }

  return _$;
});

S2.define('select2/utils',[
  'jquery'
], function ($) {
  var Utils = {};

  Utils.Extend = function (ChildClass, SuperClass) {
    var __hasProp = {}.hasOwnProperty;

    function BaseConstructor () {
      this.constructor = ChildClass;
    }

    for (var key in SuperClass) {
      if (__hasProp.call(SuperClass, key)) {
        ChildClass[key] = SuperClass[key];
      }
    }

    BaseConstructor.prototype = SuperClass.prototype;
    ChildClass.prototype = new BaseConstructor();
    ChildClass.__super__ = SuperClass.prototype;

    return ChildClass;
  };

  function getMethods (theClass) {
    var proto = theClass.prototype;

    var methods = [];

    for (var methodName in proto) {
      var m = proto[methodName];

      if (typeof m !== 'function') {
        continue;
      }

      if (methodName === 'constructor') {
        continue;
      }

      methods.push(methodName);
    }

    return methods;
  }

  Utils.Decorate = function (SuperClass, DecoratorClass) {
    var decoratedMethods = getMethods(DecoratorClass);
    var superMethods = getMethods(SuperClass);

    function DecoratedClass () {
      var unshift = Array.prototype.unshift;

      var argCount = DecoratorClass.prototype.constructor.length;

      var calledConstructor = SuperClass.prototype.constructor;

      if (argCount > 0) {
        unshift.call(arguments, SuperClass.prototype.constructor);

        calledConstructor = DecoratorClass.prototype.constructor;
      }

      calledConstructor.apply(this, arguments);
    }

    DecoratorClass.displayName = SuperClass.displayName;

    function ctr () {
      this.constructor = DecoratedClass;
    }

    DecoratedClass.prototype = new ctr();

    for (var m = 0; m < superMethods.length; m++) {
        var superMethod = superMethods[m];

        DecoratedClass.prototype[superMethod] =
          SuperClass.prototype[superMethod];
    }

    var calledMethod = function (methodName) {
      // Stub out the original method if it's not decorating an actual method
      var originalMethod = function () {};

      if (methodName in DecoratedClass.prototype) {
        originalMethod = DecoratedClass.prototype[methodName];
      }

      var decoratedMethod = DecoratorClass.prototype[methodName];

      return function () {
        var unshift = Array.prototype.unshift;

        unshift.call(arguments, originalMethod);

        return decoratedMethod.apply(this, arguments);
      };
    };

    for (var d = 0; d < decoratedMethods.length; d++) {
      var decoratedMethod = decoratedMethods[d];

      DecoratedClass.prototype[decoratedMethod] = calledMethod(decoratedMethod);
    }

    return DecoratedClass;
  };

  var Observable = function () {
    this.listeners = {};
  };

  Observable.prototype.on = function (event, callback) {
    this.listeners = this.listeners || {};

    if (event in this.listeners) {
      this.listeners[event].push(callback);
    } else {
      this.listeners[event] = [callback];
    }
  };

  Observable.prototype.trigger = function (event) {
    var slice = Array.prototype.slice;
    var params = slice.call(arguments, 1);

    this.listeners = this.listeners || {};

    // Params should always come in as an array
    if (params == null) {
      params = [];
    }

    // If there are no arguments to the event, use a temporary object
    if (params.length === 0) {
      params.push({});
    }

    // Set the `_type` of the first object to the event
    params[0]._type = event;

    if (event in this.listeners) {
      this.invoke(this.listeners[event], slice.call(arguments, 1));
    }

    if ('*' in this.listeners) {
      this.invoke(this.listeners['*'], arguments);
    }
  };

  Observable.prototype.invoke = function (listeners, params) {
    for (var i = 0, len = listeners.length; i < len; i++) {
      listeners[i].apply(this, params);
    }
  };

  Utils.Observable = Observable;

  Utils.generateChars = function (length) {
    var chars = '';

    for (var i = 0; i < length; i++) {
      var randomChar = Math.floor(Math.random() * 36);
      chars += randomChar.toString(36);
    }

    return chars;
  };

  Utils.bind = function (func, context) {
    return function () {
      func.apply(context, arguments);
    };
  };

  Utils._convertData = function (data) {
    for (var originalKey in data) {
      var keys = originalKey.split('-');

      var dataLevel = data;

      if (keys.length === 1) {
        continue;
      }

      for (var k = 0; k < keys.length; k++) {
        var key = keys[k];

        // Lowercase the first letter
        // By default, dash-separated becomes camelCase
        key = key.substring(0, 1).toLowerCase() + key.substring(1);

        if (!(key in dataLevel)) {
          dataLevel[key] = {};
        }

        if (k == keys.length - 1) {
          dataLevel[key] = data[originalKey];
        }

        dataLevel = dataLevel[key];
      }

      delete data[originalKey];
    }

    return data;
  };

  Utils.hasScroll = function (index, el) {
    // Adapted from the function created by @ShadowScripter
    // and adapted by @BillBarry on the Stack Exchange Code Review website.
    // The original code can be found at
    // http://codereview.stackexchange.com/q/13338
    // and was designed to be used with the Sizzle selector engine.

    var $el = $(el);
    var overflowX = el.style.overflowX;
    var overflowY = el.style.overflowY;

    //Check both x and y declarations
    if (overflowX === overflowY &&
        (overflowY === 'hidden' || overflowY === 'visible')) {
      return false;
    }

    if (overflowX === 'scroll' || overflowY === 'scroll') {
      return true;
    }

    return ($el.innerHeight() < el.scrollHeight ||
      $el.innerWidth() < el.scrollWidth);
  };

  Utils.escapeMarkup = function (markup) {
    var replaceMap = {
      '\\': '&#92;',
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      '\'': '&#39;',
      '/': '&#47;'
    };

    // Do not try to escape the markup if it's not a string
    if (typeof markup !== 'string') {
      return markup;
    }

    return String(markup).replace(/[&<>"'\/\\]/g, function (match) {
      return replaceMap[match];
    });
  };

  // Append an array of jQuery nodes to a given element.
  Utils.appendMany = function ($element, $nodes) {
    // jQuery 1.7.x does not support $.fn.append() with an array
    // Fall back to a jQuery object collection using $.fn.add()
    if ($.fn.jquery.substr(0, 3) === '1.7') {
      var $jqNodes = $();

      $.map($nodes, function (node) {
        $jqNodes = $jqNodes.add(node);
      });

      $nodes = $jqNodes;
    }

    $element.append($nodes);
  };

  return Utils;
});

S2.define('select2/results',[
  'jquery',
  './utils'
], function ($, Utils) {
  function Results ($element, options, dataAdapter) {
    this.$element = $element;
    this.data = dataAdapter;
    this.options = options;

    Results.__super__.constructor.call(this);
  }

  Utils.Extend(Results, Utils.Observable);

  Results.prototype.render = function () {
    var $results = $(
      '<ul class="select2-results__options" role="tree"></ul>'
    );

    if (this.options.get('multiple')) {
      $results.attr('aria-multiselectable', 'true');
    }

    this.$results = $results;

    return $results;
  };

  Results.prototype.clear = function () {
    this.$results.empty();
  };

  Results.prototype.displayMessage = function (params) {
    var escapeMarkup = this.options.get('escapeMarkup');

    this.clear();
    this.hideLoading();

    var $message = $(
      '<li role="treeitem" aria-live="assertive"' +
      ' class="select2-results__option"></li>'
    );

    var message = this.options.get('translations').get(params.message);

    $message.append(
      escapeMarkup(
        message(params.args)
      )
    );

    $message[0].className += ' select2-results__message';

    this.$results.append($message);
  };

  Results.prototype.hideMessages = function () {
    this.$results.find('.select2-results__message').remove();
  };

  Results.prototype.append = function (data) {
    this.hideLoading();

    var $options = [];

    if (data.results == null || data.results.length === 0) {
      if (this.$results.children().length === 0) {
        this.trigger('results:message', {
          message: 'noResults'
        });
      }

      return;
    }

    data.results = this.sort(data.results);

    for (var d = 0; d < data.results.length; d++) {
      var item = data.results[d];

      var $option = this.option(item);

      $options.push($option);
    }

    this.$results.append($options);
  };

  Results.prototype.position = function ($results, $dropdown) {
    var $resultsContainer = $dropdown.find('.select2-results');
    $resultsContainer.append($results);
  };

  Results.prototype.sort = function (data) {
    var sorter = this.options.get('sorter');

    return sorter(data);
  };

  Results.prototype.highlightFirstItem = function () {
    var $options = this.$results
      .find('.select2-results__option[aria-selected]');

    var $selected = $options.filter('[aria-selected=true]');

    // Check if there are any selected options
    if ($selected.length > 0) {
      // If there are selected options, highlight the first
      $selected.first().trigger('mouseenter');
    } else {
      // If there are no selected options, highlight the first option
      // in the dropdown
      $options.first().trigger('mouseenter');
    }

    this.ensureHighlightVisible();
  };

  Results.prototype.setClasses = function () {
    var self = this;

    this.data.current(function (selected) {
      var selectedIds = $.map(selected, function (s) {
        return s.id.toString();
      });

      var $options = self.$results
        .find('.select2-results__option[aria-selected]');

      $options.each(function () {
        var $option = $(this);

        var item = $.data(this, 'data');

        // id needs to be converted to a string when comparing
        var id = '' + item.id;

        if ((item.element != null && item.element.selected) ||
            (item.element == null && $.inArray(id, selectedIds) > -1)) {
          $option.attr('aria-selected', 'true');
        } else {
          $option.attr('aria-selected', 'false');
        }
      });

    });
  };

  Results.prototype.showLoading = function (params) {
    this.hideLoading();

    var loadingMore = this.options.get('translations').get('searching');

    var loading = {
      disabled: true,
      loading: true,
      text: loadingMore(params)
    };
    var $loading = this.option(loading);
    $loading.className += ' loading-results';

    this.$results.prepend($loading);
  };

  Results.prototype.hideLoading = function () {
    this.$results.find('.loading-results').remove();
  };

  Results.prototype.option = function (data) {
    var option = document.createElement('li');
    option.className = 'select2-results__option';

    var attrs = {
      'role': 'treeitem',
      'aria-selected': 'false'
    };

    if (data.disabled) {
      delete attrs['aria-selected'];
      attrs['aria-disabled'] = 'true';
    }

    if (data.id == null) {
      delete attrs['aria-selected'];
    }

    if (data._resultId != null) {
      option.id = data._resultId;
    }

    if (data.title) {
      option.title = data.title;
    }

    if (data.children) {
      attrs.role = 'group';
      attrs['aria-label'] = data.text;
      delete attrs['aria-selected'];
    }

    for (var attr in attrs) {
      var val = attrs[attr];

      option.setAttribute(attr, val);
    }

    if (data.children) {
      var $option = $(option);

      var label = document.createElement('strong');
      label.className = 'select2-results__group';

      var $label = $(label);
      this.template(data, label);

      var $children = [];

      for (var c = 0; c < data.children.length; c++) {
        var child = data.children[c];

        var $child = this.option(child);

        $children.push($child);
      }

      var $childrenContainer = $('<ul></ul>', {
        'class': 'select2-results__options select2-results__options--nested'
      });

      $childrenContainer.append($children);

      $option.append(label);
      $option.append($childrenContainer);
    } else {
      this.template(data, option);
    }

    $.data(option, 'data', data);

    return option;
  };

  Results.prototype.bind = function (container, $container) {
    var self = this;

    var id = container.id + '-results';

    this.$results.attr('id', id);

    container.on('results:all', function (params) {
      self.clear();
      self.append(params.data);

      if (container.isOpen()) {
        self.setClasses();
        self.highlightFirstItem();
      }
    });

    container.on('results:append', function (params) {
      self.append(params.data);

      if (container.isOpen()) {
        self.setClasses();
      }
    });

    container.on('query', function (params) {
      self.hideMessages();
      self.showLoading(params);
    });

    container.on('select', function () {
      if (!container.isOpen()) {
        return;
      }

      self.setClasses();
      self.highlightFirstItem();
    });

    container.on('unselect', function () {
      if (!container.isOpen()) {
        return;
      }

      self.setClasses();
      self.highlightFirstItem();
    });

    container.on('open', function () {
      // When the dropdown is open, aria-expended="true"
      self.$results.attr('aria-expanded', 'true');
      self.$results.attr('aria-hidden', 'false');

      self.setClasses();
      self.ensureHighlightVisible();
    });

    container.on('close', function () {
      // When the dropdown is closed, aria-expended="false"
      self.$results.attr('aria-expanded', 'false');
      self.$results.attr('aria-hidden', 'true');
      self.$results.removeAttr('aria-activedescendant');
    });

    container.on('results:toggle', function () {
      var $highlighted = self.getHighlightedResults();

      if ($highlighted.length === 0) {
        return;
      }

      $highlighted.trigger('mouseup');
    });

    container.on('results:select', function () {
      var $highlighted = self.getHighlightedResults();

      if ($highlighted.length === 0) {
        return;
      }

      var data = $highlighted.data('data');

      if ($highlighted.attr('aria-selected') == 'true') {
        self.trigger('close', {});
      } else {
        self.trigger('select', {
          data: data
        });
      }
    });

    container.on('results:previous', function () {
      var $highlighted = self.getHighlightedResults();

      var $options = self.$results.find('[aria-selected]');

      var currentIndex = $options.index($highlighted);

      // If we are already at te top, don't move further
      if (currentIndex === 0) {
        return;
      }

      var nextIndex = currentIndex - 1;

      // If none are highlighted, highlight the first
      if ($highlighted.length === 0) {
        nextIndex = 0;
      }

      var $next = $options.eq(nextIndex);

      $next.trigger('mouseenter');

      var currentOffset = self.$results.offset().top;
      var nextTop = $next.offset().top;
      var nextOffset = self.$results.scrollTop() + (nextTop - currentOffset);

      if (nextIndex === 0) {
        self.$results.scrollTop(0);
      } else if (nextTop - currentOffset < 0) {
        self.$results.scrollTop(nextOffset);
      }
    });

    container.on('results:next', function () {
      var $highlighted = self.getHighlightedResults();

      var $options = self.$results.find('[aria-selected]');

      var currentIndex = $options.index($highlighted);

      var nextIndex = currentIndex + 1;

      // If we are at the last option, stay there
      if (nextIndex >= $options.length) {
        return;
      }

      var $next = $options.eq(nextIndex);

      $next.trigger('mouseenter');

      var currentOffset = self.$results.offset().top +
        self.$results.outerHeight(false);
      var nextBottom = $next.offset().top + $next.outerHeight(false);
      var nextOffset = self.$results.scrollTop() + nextBottom - currentOffset;

      if (nextIndex === 0) {
        self.$results.scrollTop(0);
      } else if (nextBottom > currentOffset) {
        self.$results.scrollTop(nextOffset);
      }
    });

    container.on('results:focus', function (params) {
      params.element.addClass('select2-results__option--highlighted');
    });

    container.on('results:message', function (params) {
      self.displayMessage(params);
    });

    if ($.fn.mousewheel) {
      this.$results.on('mousewheel', function (e) {
        var top = self.$results.scrollTop();

        var bottom = self.$results.get(0).scrollHeight - top + e.deltaY;

        var isAtTop = e.deltaY > 0 && top - e.deltaY <= 0;
        var isAtBottom = e.deltaY < 0 && bottom <= self.$results.height();

        if (isAtTop) {
          self.$results.scrollTop(0);

          e.preventDefault();
          e.stopPropagation();
        } else if (isAtBottom) {
          self.$results.scrollTop(
            self.$results.get(0).scrollHeight - self.$results.height()
          );

          e.preventDefault();
          e.stopPropagation();
        }
      });
    }

    this.$results.on('mouseup', '.select2-results__option[aria-selected]',
      function (evt) {
      var $this = $(this);

      var data = $this.data('data');

      if ($this.attr('aria-selected') === 'true') {
        if (self.options.get('multiple')) {
          self.trigger('unselect', {
            originalEvent: evt,
            data: data
          });
        } else {
          self.trigger('close', {});
        }

        return;
      }

      self.trigger('select', {
        originalEvent: evt,
        data: data
      });
    });

    this.$results.on('mouseenter', '.select2-results__option[aria-selected]',
      function (evt) {
      var data = $(this).data('data');

      self.getHighlightedResults()
          .removeClass('select2-results__option--highlighted');

      self.trigger('results:focus', {
        data: data,
        element: $(this)
      });
    });
  };

  Results.prototype.getHighlightedResults = function () {
    var $highlighted = this.$results
    .find('.select2-results__option--highlighted');

    return $highlighted;
  };

  Results.prototype.destroy = function () {
    this.$results.remove();
  };

  Results.prototype.ensureHighlightVisible = function () {
    var $highlighted = this.getHighlightedResults();

    if ($highlighted.length === 0) {
      return;
    }

    var $options = this.$results.find('[aria-selected]');

    var currentIndex = $options.index($highlighted);

    var currentOffset = this.$results.offset().top;
    var nextTop = $highlighted.offset().top;
    var nextOffset = this.$results.scrollTop() + (nextTop - currentOffset);

    var offsetDelta = nextTop - currentOffset;
    nextOffset -= $highlighted.outerHeight(false) * 2;

    if (currentIndex <= 2) {
      this.$results.scrollTop(0);
    } else if (offsetDelta > this.$results.outerHeight() || offsetDelta < 0) {
      this.$results.scrollTop(nextOffset);
    }
  };

  Results.prototype.template = function (result, container) {
    var template = this.options.get('templateResult');
    var escapeMarkup = this.options.get('escapeMarkup');

    var content = template(result, container);

    if (content == null) {
      container.style.display = 'none';
    } else if (typeof content === 'string') {
      container.innerHTML = escapeMarkup(content);
    } else {
      $(container).append(content);
    }
  };

  return Results;
});

S2.define('select2/keys',[

], function () {
  var KEYS = {
    BACKSPACE: 8,
    TAB: 9,
    ENTER: 13,
    SHIFT: 16,
    CTRL: 17,
    ALT: 18,
    ESC: 27,
    SPACE: 32,
    PAGE_UP: 33,
    PAGE_DOWN: 34,
    END: 35,
    HOME: 36,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    DELETE: 46
  };

  return KEYS;
});

S2.define('select2/selection/base',[
  'jquery',
  '../utils',
  '../keys'
], function ($, Utils, KEYS) {
  function BaseSelection ($element, options) {
    this.$element = $element;
    this.options = options;

    BaseSelection.__super__.constructor.call(this);
  }

  Utils.Extend(BaseSelection, Utils.Observable);

  BaseSelection.prototype.render = function () {
    var $selection = $(
      '<span class="select2-selection" role="combobox" ' +
      ' aria-haspopup="true" aria-expanded="false">' +
      '</span>'
    );

    this._tabindex = 0;

    if (this.$element.data('old-tabindex') != null) {
      this._tabindex = this.$element.data('old-tabindex');
    } else if (this.$element.attr('tabindex') != null) {
      this._tabindex = this.$element.attr('tabindex');
    }

    $selection.attr('title', this.$element.attr('title'));
    $selection.attr('tabindex', this._tabindex);

    this.$selection = $selection;

    return $selection;
  };

  BaseSelection.prototype.bind = function (container, $container) {
    var self = this;

    var id = container.id + '-container';
    var resultsId = container.id + '-results';

    this.container = container;

    this.$selection.on('focus', function (evt) {
      self.trigger('focus', evt);
    });

    this.$selection.on('blur', function (evt) {
      self._handleBlur(evt);
    });

    this.$selection.on('keydown', function (evt) {
      self.trigger('keypress', evt);

      if (evt.which === KEYS.SPACE) {
        evt.preventDefault();
      }
    });

    container.on('results:focus', function (params) {
      self.$selection.attr('aria-activedescendant', params.data._resultId);
    });

    container.on('selection:update', function (params) {
      self.update(params.data);
    });

    container.on('open', function () {
      // When the dropdown is open, aria-expanded="true"
      self.$selection.attr('aria-expanded', 'true');
      self.$selection.attr('aria-owns', resultsId);

      self._attachCloseHandler(container);
    });

    container.on('close', function () {
      // When the dropdown is closed, aria-expanded="false"
      self.$selection.attr('aria-expanded', 'false');
      self.$selection.removeAttr('aria-activedescendant');
      self.$selection.removeAttr('aria-owns');

      self.$selection.focus();

      self._detachCloseHandler(container);
    });

    container.on('enable', function () {
      self.$selection.attr('tabindex', self._tabindex);
    });

    container.on('disable', function () {
      self.$selection.attr('tabindex', '-1');
    });
  };

  BaseSelection.prototype._handleBlur = function (evt) {
    var self = this;

    // This needs to be delayed as the active element is the body when the tab
    // key is pressed, possibly along with others.
    window.setTimeout(function () {
      // Don't trigger `blur` if the focus is still in the selection
      if (
        (document.activeElement == self.$selection[0]) ||
        ($.contains(self.$selection[0], document.activeElement))
      ) {
        return;
      }

      self.trigger('blur', evt);
    }, 1);
  };

  BaseSelection.prototype._attachCloseHandler = function (container) {
    var self = this;

    $(document.body).on('mousedown.select2.' + container.id, function (e) {
      var $target = $(e.target);

      var $select = $target.closest('.select2');

      var $all = $('.select2.select2-container--open');

      $all.each(function () {
        var $this = $(this);

        if (this == $select[0]) {
          return;
        }

        var $element = $this.data('element');

        $element.select2('close');
      });
    });
  };

  BaseSelection.prototype._detachCloseHandler = function (container) {
    $(document.body).off('mousedown.select2.' + container.id);
  };

  BaseSelection.prototype.position = function ($selection, $container) {
    var $selectionContainer = $container.find('.selection');
    $selectionContainer.append($selection);
  };

  BaseSelection.prototype.destroy = function () {
    this._detachCloseHandler(this.container);
  };

  BaseSelection.prototype.update = function (data) {
    throw new Error('The `update` method must be defined in child classes.');
  };

  return BaseSelection;
});

S2.define('select2/selection/single',[
  'jquery',
  './base',
  '../utils',
  '../keys'
], function ($, BaseSelection, Utils, KEYS) {
  function SingleSelection () {
    SingleSelection.__super__.constructor.apply(this, arguments);
  }

  Utils.Extend(SingleSelection, BaseSelection);

  SingleSelection.prototype.render = function () {
    var $selection = SingleSelection.__super__.render.call(this);

    $selection.addClass('select2-selection--single');

    $selection.html(
      '<span class="select2-selection__rendered"></span>' +
      '<span class="select2-selection__arrow" role="presentation">' +
        '<b role="presentation"></b>' +
      '</span>'
    );

    return $selection;
  };

  SingleSelection.prototype.bind = function (container, $container) {
    var self = this;

    SingleSelection.__super__.bind.apply(this, arguments);

    var id = container.id + '-container';

    this.$selection.find('.select2-selection__rendered').attr('id', id);
    this.$selection.attr('aria-labelledby', id);

    this.$selection.on('mousedown', function (evt) {
      // Only respond to left clicks
      if (evt.which !== 1) {
        return;
      }

      self.trigger('toggle', {
        originalEvent: evt
      });
    });

    this.$selection.on('focus', function (evt) {
      // User focuses on the container
    });

    this.$selection.on('blur', function (evt) {
      // User exits the container
    });

    container.on('focus', function (evt) {
      if (!container.isOpen()) {
        self.$selection.focus();
      }
    });

    container.on('selection:update', function (params) {
      self.update(params.data);
    });
  };

  SingleSelection.prototype.clear = function () {
    this.$selection.find('.select2-selection__rendered').empty();
  };

  SingleSelection.prototype.display = function (data, container) {
    var template = this.options.get('templateSelection');
    var escapeMarkup = this.options.get('escapeMarkup');

    return escapeMarkup(template(data, container));
  };

  SingleSelection.prototype.selectionContainer = function () {
    return $('<span></span>');
  };

  SingleSelection.prototype.update = function (data) {
    if (data.length === 0) {
      this.clear();
      return;
    }

    var selection = data[0];

    var $rendered = this.$selection.find('.select2-selection__rendered');
    var formatted = this.display(selection, $rendered);

    $rendered.empty().append(formatted);
    $rendered.prop('title', selection.title || selection.text);
  };

  return SingleSelection;
});

S2.define('select2/selection/multiple',[
  'jquery',
  './base',
  '../utils'
], function ($, BaseSelection, Utils) {
  function MultipleSelection ($element, options) {
    MultipleSelection.__super__.constructor.apply(this, arguments);
  }

  Utils.Extend(MultipleSelection, BaseSelection);

  MultipleSelection.prototype.render = function () {
    var $selection = MultipleSelection.__super__.render.call(this);

    $selection.addClass('select2-selection--multiple');

    $selection.html(
      '<ul class="select2-selection__rendered"></ul>'
    );

    return $selection;
  };

  MultipleSelection.prototype.bind = function (container, $container) {
    var self = this;

    MultipleSelection.__super__.bind.apply(this, arguments);

    this.$selection.on('click', function (evt) {
      self.trigger('toggle', {
        originalEvent: evt
      });
    });

    this.$selection.on(
      'click',
      '.select2-selection__choice__remove',
      function (evt) {
        // Ignore the event if it is disabled
        if (self.options.get('disabled')) {
          return;
        }

        var $remove = $(this);
        var $selection = $remove.parent();

        var data = $selection.data('data');

        self.trigger('unselect', {
          originalEvent: evt,
          data: data
        });
      }
    );
  };

  MultipleSelection.prototype.clear = function () {
    this.$selection.find('.select2-selection__rendered').empty();
  };

  MultipleSelection.prototype.display = function (data, container) {
    var template = this.options.get('templateSelection');
    var escapeMarkup = this.options.get('escapeMarkup');

    return escapeMarkup(template(data, container));
  };

  MultipleSelection.prototype.selectionContainer = function () {
    var $container = $(
      '<li class="select2-selection__choice">' +
        '<span class="select2-selection__choice__remove" role="presentation">' +
          '&times;' +
        '</span>' +
      '</li>'
    );

    return $container;
  };

  MultipleSelection.prototype.update = function (data) {
    this.clear();

    if (data.length === 0) {
      return;
    }

    var $selections = [];

    for (var d = 0; d < data.length; d++) {
      var selection = data[d];

      var $selection = this.selectionContainer();
      var formatted = this.display(selection, $selection);

      $selection.append(formatted);
      $selection.prop('title', selection.title || selection.text);

      $selection.data('data', selection);

      $selections.push($selection);
    }

    var $rendered = this.$selection.find('.select2-selection__rendered');

    Utils.appendMany($rendered, $selections);
  };

  return MultipleSelection;
});

S2.define('select2/selection/placeholder',[
  '../utils'
], function (Utils) {
  function Placeholder (decorated, $element, options) {
    this.placeholder = this.normalizePlaceholder(options.get('placeholder'));

    decorated.call(this, $element, options);
  }

  Placeholder.prototype.normalizePlaceholder = function (_, placeholder) {
    if (typeof placeholder === 'string') {
      placeholder = {
        id: '',
        text: placeholder
      };
    }

    return placeholder;
  };

  Placeholder.prototype.createPlaceholder = function (decorated, placeholder) {
    var $placeholder = this.selectionContainer();

    $placeholder.html(this.display(placeholder));
    $placeholder.addClass('select2-selection__placeholder')
                .removeClass('select2-selection__choice');

    return $placeholder;
  };

  Placeholder.prototype.update = function (decorated, data) {
    var singlePlaceholder = (
      data.length == 1 && data[0].id != this.placeholder.id
    );
    var multipleSelections = data.length > 1;

    if (multipleSelections || singlePlaceholder) {
      return decorated.call(this, data);
    }

    this.clear();

    var $placeholder = this.createPlaceholder(this.placeholder);

    this.$selection.find('.select2-selection__rendered').append($placeholder);
  };

  return Placeholder;
});

S2.define('select2/selection/allowClear',[
  'jquery',
  '../keys'
], function ($, KEYS) {
  function AllowClear () { }

  AllowClear.prototype.bind = function (decorated, container, $container) {
    var self = this;

    decorated.call(this, container, $container);

    if (this.placeholder == null) {
      if (this.options.get('debug') && window.console && console.error) {
        console.error(
          'Select2: The `allowClear` option should be used in combination ' +
          'with the `placeholder` option.'
        );
      }
    }

    this.$selection.on('mousedown', '.select2-selection__clear',
      function (evt) {
        self._handleClear(evt);
    });

    container.on('keypress', function (evt) {
      self._handleKeyboardClear(evt, container);
    });
  };

  AllowClear.prototype._handleClear = function (_, evt) {
    // Ignore the event if it is disabled
    if (this.options.get('disabled')) {
      return;
    }

    var $clear = this.$selection.find('.select2-selection__clear');

    // Ignore the event if nothing has been selected
    if ($clear.length === 0) {
      return;
    }

    evt.stopPropagation();

    var data = $clear.data('data');

    for (var d = 0; d < data.length; d++) {
      var unselectData = {
        data: data[d]
      };

      // Trigger the `unselect` event, so people can prevent it from being
      // cleared.
      this.trigger('unselect', unselectData);

      // If the event was prevented, don't clear it out.
      if (unselectData.prevented) {
        return;
      }
    }

    this.$element.val(this.placeholder.id).trigger('change');

    this.trigger('toggle', {});
  };

  AllowClear.prototype._handleKeyboardClear = function (_, evt, container) {
    if (container.isOpen()) {
      return;
    }

    if (evt.which == KEYS.DELETE || evt.which == KEYS.BACKSPACE) {
      this._handleClear(evt);
    }
  };

  AllowClear.prototype.update = function (decorated, data) {
    decorated.call(this, data);

    if (this.$selection.find('.select2-selection__placeholder').length > 0 ||
        data.length === 0) {
      return;
    }

    var $remove = $(
      '<span class="select2-selection__clear">' +
        '&times;' +
      '</span>'
    );
    $remove.data('data', data);

    this.$selection.find('.select2-selection__rendered').prepend($remove);
  };

  return AllowClear;
});

S2.define('select2/selection/search',[
  'jquery',
  '../utils',
  '../keys'
], function ($, Utils, KEYS) {
  function Search (decorated, $element, options) {
    decorated.call(this, $element, options);
  }

  Search.prototype.render = function (decorated) {
    var $search = $(
      '<li class="select2-search select2-search--inline">' +
        '<input class="select2-search__field" type="search" tabindex="-1"' +
        ' autocomplete="off" autocorrect="off" autocapitalize="off"' +
        ' spellcheck="false" role="textbox" aria-autocomplete="list" />' +
      '</li>'
    );

    this.$searchContainer = $search;
    this.$search = $search.find('input');

    var $rendered = decorated.call(this);

    this._transferTabIndex();

    return $rendered;
  };

  Search.prototype.bind = function (decorated, container, $container) {
    var self = this;

    decorated.call(this, container, $container);

    container.on('open', function () {
      self.$search.trigger('focus');
    });

    container.on('close', function () {
      self.$search.val('');
      self.$search.removeAttr('aria-activedescendant');
      self.$search.trigger('focus');
    });

    container.on('enable', function () {
      self.$search.prop('disabled', false);

      self._transferTabIndex();
    });

    container.on('disable', function () {
      self.$search.prop('disabled', true);
    });

    container.on('focus', function (evt) {
      self.$search.trigger('focus');
    });

    container.on('results:focus', function (params) {
      self.$search.attr('aria-activedescendant', params.id);
    });

    this.$selection.on('focusin', '.select2-search--inline', function (evt) {
      self.trigger('focus', evt);
    });

    this.$selection.on('focusout', '.select2-search--inline', function (evt) {
      self._handleBlur(evt);
    });

    this.$selection.on('keydown', '.select2-search--inline', function (evt) {
      evt.stopPropagation();

      self.trigger('keypress', evt);

      self._keyUpPrevented = evt.isDefaultPrevented();

      var key = evt.which;

      if (key === KEYS.BACKSPACE && self.$search.val() === '') {
        var $previousChoice = self.$searchContainer
          .prev('.select2-selection__choice');

        if ($previousChoice.length > 0) {
          var item = $previousChoice.data('data');

          self.searchRemoveChoice(item);

          evt.preventDefault();
        }
      }
    });

    // Try to detect the IE version should the `documentMode` property that
    // is stored on the document. This is only implemented in IE and is
    // slightly cleaner than doing a user agent check.
    // This property is not available in Edge, but Edge also doesn't have
    // this bug.
    var msie = document.documentMode;
    var disableInputEvents = msie && msie <= 11;

    // Workaround for browsers which do not support the `input` event
    // This will prevent double-triggering of events for browsers which support
    // both the `keyup` and `input` events.
    this.$selection.on(
      'input.searchcheck',
      '.select2-search--inline',
      function (evt) {
        // IE will trigger the `input` event when a placeholder is used on a
        // search box. To get around this issue, we are forced to ignore all
        // `input` events in IE and keep using `keyup`.
        if (disableInputEvents) {
          self.$selection.off('input.search input.searchcheck');
          return;
        }

        // Unbind the duplicated `keyup` event
        self.$selection.off('keyup.search');
      }
    );

    this.$selection.on(
      'keyup.search input.search',
      '.select2-search--inline',
      function (evt) {
        // IE will trigger the `input` event when a placeholder is used on a
        // search box. To get around this issue, we are forced to ignore all
        // `input` events in IE and keep using `keyup`.
        if (disableInputEvents && evt.type === 'input') {
          self.$selection.off('input.search input.searchcheck');
          return;
        }

        var key = evt.which;

        // We can freely ignore events from modifier keys
        if (key == KEYS.SHIFT || key == KEYS.CTRL || key == KEYS.ALT) {
          return;
        }

        // Tabbing will be handled during the `keydown` phase
        if (key == KEYS.TAB) {
          return;
        }

        self.handleSearch(evt);
      }
    );
  };

  /**
   * This method will transfer the tabindex attribute from the rendered
   * selection to the search box. This allows for the search box to be used as
   * the primary focus instead of the selection container.
   *
   * @private
   */
  Search.prototype._transferTabIndex = function (decorated) {
    this.$search.attr('tabindex', this.$selection.attr('tabindex'));
    this.$selection.attr('tabindex', '-1');
  };

  Search.prototype.createPlaceholder = function (decorated, placeholder) {
    this.$search.attr('placeholder', placeholder.text);
  };

  Search.prototype.update = function (decorated, data) {
    var searchHadFocus = this.$search[0] == document.activeElement;

    this.$search.attr('placeholder', '');

    decorated.call(this, data);

    this.$selection.find('.select2-selection__rendered')
                   .append(this.$searchContainer);

    this.resizeSearch();
    if (searchHadFocus) {
      this.$search.focus();
    }
  };

  Search.prototype.handleSearch = function () {
    this.resizeSearch();

    if (!this._keyUpPrevented) {
      var input = this.$search.val();

      this.trigger('query', {
        term: input
      });
    }

    this._keyUpPrevented = false;
  };

  Search.prototype.searchRemoveChoice = function (decorated, item) {
    this.trigger('unselect', {
      data: item
    });

    this.$search.val(item.text);
    this.handleSearch();
  };

  Search.prototype.resizeSearch = function () {
    this.$search.css('width', '25px');

    var width = '';

    if (this.$search.attr('placeholder') !== '') {
      width = this.$selection.find('.select2-selection__rendered').innerWidth();
    } else {
      var minimumWidth = this.$search.val().length + 1;

      width = (minimumWidth * 0.75) + 'em';
    }

    this.$search.css('width', width);
  };

  return Search;
});

S2.define('select2/selection/eventRelay',[
  'jquery'
], function ($) {
  function EventRelay () { }

  EventRelay.prototype.bind = function (decorated, container, $container) {
    var self = this;
    var relayEvents = [
      'open', 'opening',
      'close', 'closing',
      'select', 'selecting',
      'unselect', 'unselecting'
    ];

    var preventableEvents = ['opening', 'closing', 'selecting', 'unselecting'];

    decorated.call(this, container, $container);

    container.on('*', function (name, params) {
      // Ignore events that should not be relayed
      if ($.inArray(name, relayEvents) === -1) {
        return;
      }

      // The parameters should always be an object
      params = params || {};

      // Generate the jQuery event for the Select2 event
      var evt = $.Event('select2:' + name, {
        params: params
      });

      self.$element.trigger(evt);

      // Only handle preventable events if it was one
      if ($.inArray(name, preventableEvents) === -1) {
        return;
      }

      params.prevented = evt.isDefaultPrevented();
    });
  };

  return EventRelay;
});

S2.define('select2/translation',[
  'jquery',
  'require'
], function ($, require) {
  function Translation (dict) {
    this.dict = dict || {};
  }

  Translation.prototype.all = function () {
    return this.dict;
  };

  Translation.prototype.get = function (key) {
    return this.dict[key];
  };

  Translation.prototype.extend = function (translation) {
    this.dict = $.extend({}, translation.all(), this.dict);
  };

  // Static functions

  Translation._cache = {};

  Translation.loadPath = function (path) {
    if (!(path in Translation._cache)) {
      var translations = require(path);

      Translation._cache[path] = translations;
    }

    return new Translation(Translation._cache[path]);
  };

  return Translation;
});

S2.define('select2/diacritics',[

], function () {
  var diacritics = {
    '\u24B6': 'A',
    '\uFF21': 'A',
    '\u00C0': 'A',
    '\u00C1': 'A',
    '\u00C2': 'A',
    '\u1EA6': 'A',
    '\u1EA4': 'A',
    '\u1EAA': 'A',
    '\u1EA8': 'A',
    '\u00C3': 'A',
    '\u0100': 'A',
    '\u0102': 'A',
    '\u1EB0': 'A',
    '\u1EAE': 'A',
    '\u1EB4': 'A',
    '\u1EB2': 'A',
    '\u0226': 'A',
    '\u01E0': 'A',
    '\u00C4': 'A',
    '\u01DE': 'A',
    '\u1EA2': 'A',
    '\u00C5': 'A',
    '\u01FA': 'A',
    '\u01CD': 'A',
    '\u0200': 'A',
    '\u0202': 'A',
    '\u1EA0': 'A',
    '\u1EAC': 'A',
    '\u1EB6': 'A',
    '\u1E00': 'A',
    '\u0104': 'A',
    '\u023A': 'A',
    '\u2C6F': 'A',
    '\uA732': 'AA',
    '\u00C6': 'AE',
    '\u01FC': 'AE',
    '\u01E2': 'AE',
    '\uA734': 'AO',
    '\uA736': 'AU',
    '\uA738': 'AV',
    '\uA73A': 'AV',
    '\uA73C': 'AY',
    '\u24B7': 'B',
    '\uFF22': 'B',
    '\u1E02': 'B',
    '\u1E04': 'B',
    '\u1E06': 'B',
    '\u0243': 'B',
    '\u0182': 'B',
    '\u0181': 'B',
    '\u24B8': 'C',
    '\uFF23': 'C',
    '\u0106': 'C',
    '\u0108': 'C',
    '\u010A': 'C',
    '\u010C': 'C',
    '\u00C7': 'C',
    '\u1E08': 'C',
    '\u0187': 'C',
    '\u023B': 'C',
    '\uA73E': 'C',
    '\u24B9': 'D',
    '\uFF24': 'D',
    '\u1E0A': 'D',
    '\u010E': 'D',
    '\u1E0C': 'D',
    '\u1E10': 'D',
    '\u1E12': 'D',
    '\u1E0E': 'D',
    '\u0110': 'D',
    '\u018B': 'D',
    '\u018A': 'D',
    '\u0189': 'D',
    '\uA779': 'D',
    '\u01F1': 'DZ',
    '\u01C4': 'DZ',
    '\u01F2': 'Dz',
    '\u01C5': 'Dz',
    '\u24BA': 'E',
    '\uFF25': 'E',
    '\u00C8': 'E',
    '\u00C9': 'E',
    '\u00CA': 'E',
    '\u1EC0': 'E',
    '\u1EBE': 'E',
    '\u1EC4': 'E',
    '\u1EC2': 'E',
    '\u1EBC': 'E',
    '\u0112': 'E',
    '\u1E14': 'E',
    '\u1E16': 'E',
    '\u0114': 'E',
    '\u0116': 'E',
    '\u00CB': 'E',
    '\u1EBA': 'E',
    '\u011A': 'E',
    '\u0204': 'E',
    '\u0206': 'E',
    '\u1EB8': 'E',
    '\u1EC6': 'E',
    '\u0228': 'E',
    '\u1E1C': 'E',
    '\u0118': 'E',
    '\u1E18': 'E',
    '\u1E1A': 'E',
    '\u0190': 'E',
    '\u018E': 'E',
    '\u24BB': 'F',
    '\uFF26': 'F',
    '\u1E1E': 'F',
    '\u0191': 'F',
    '\uA77B': 'F',
    '\u24BC': 'G',
    '\uFF27': 'G',
    '\u01F4': 'G',
    '\u011C': 'G',
    '\u1E20': 'G',
    '\u011E': 'G',
    '\u0120': 'G',
    '\u01E6': 'G',
    '\u0122': 'G',
    '\u01E4': 'G',
    '\u0193': 'G',
    '\uA7A0': 'G',
    '\uA77D': 'G',
    '\uA77E': 'G',
    '\u24BD': 'H',
    '\uFF28': 'H',
    '\u0124': 'H',
    '\u1E22': 'H',
    '\u1E26': 'H',
    '\u021E': 'H',
    '\u1E24': 'H',
    '\u1E28': 'H',
    '\u1E2A': 'H',
    '\u0126': 'H',
    '\u2C67': 'H',
    '\u2C75': 'H',
    '\uA78D': 'H',
    '\u24BE': 'I',
    '\uFF29': 'I',
    '\u00CC': 'I',
    '\u00CD': 'I',
    '\u00CE': 'I',
    '\u0128': 'I',
    '\u012A': 'I',
    '\u012C': 'I',
    '\u0130': 'I',
    '\u00CF': 'I',
    '\u1E2E': 'I',
    '\u1EC8': 'I',
    '\u01CF': 'I',
    '\u0208': 'I',
    '\u020A': 'I',
    '\u1ECA': 'I',
    '\u012E': 'I',
    '\u1E2C': 'I',
    '\u0197': 'I',
    '\u24BF': 'J',
    '\uFF2A': 'J',
    '\u0134': 'J',
    '\u0248': 'J',
    '\u24C0': 'K',
    '\uFF2B': 'K',
    '\u1E30': 'K',
    '\u01E8': 'K',
    '\u1E32': 'K',
    '\u0136': 'K',
    '\u1E34': 'K',
    '\u0198': 'K',
    '\u2C69': 'K',
    '\uA740': 'K',
    '\uA742': 'K',
    '\uA744': 'K',
    '\uA7A2': 'K',
    '\u24C1': 'L',
    '\uFF2C': 'L',
    '\u013F': 'L',
    '\u0139': 'L',
    '\u013D': 'L',
    '\u1E36': 'L',
    '\u1E38': 'L',
    '\u013B': 'L',
    '\u1E3C': 'L',
    '\u1E3A': 'L',
    '\u0141': 'L',
    '\u023D': 'L',
    '\u2C62': 'L',
    '\u2C60': 'L',
    '\uA748': 'L',
    '\uA746': 'L',
    '\uA780': 'L',
    '\u01C7': 'LJ',
    '\u01C8': 'Lj',
    '\u24C2': 'M',
    '\uFF2D': 'M',
    '\u1E3E': 'M',
    '\u1E40': 'M',
    '\u1E42': 'M',
    '\u2C6E': 'M',
    '\u019C': 'M',
    '\u24C3': 'N',
    '\uFF2E': 'N',
    '\u01F8': 'N',
    '\u0143': 'N',
    '\u00D1': 'N',
    '\u1E44': 'N',
    '\u0147': 'N',
    '\u1E46': 'N',
    '\u0145': 'N',
    '\u1E4A': 'N',
    '\u1E48': 'N',
    '\u0220': 'N',
    '\u019D': 'N',
    '\uA790': 'N',
    '\uA7A4': 'N',
    '\u01CA': 'NJ',
    '\u01CB': 'Nj',
    '\u24C4': 'O',
    '\uFF2F': 'O',
    '\u00D2': 'O',
    '\u00D3': 'O',
    '\u00D4': 'O',
    '\u1ED2': 'O',
    '\u1ED0': 'O',
    '\u1ED6': 'O',
    '\u1ED4': 'O',
    '\u00D5': 'O',
    '\u1E4C': 'O',
    '\u022C': 'O',
    '\u1E4E': 'O',
    '\u014C': 'O',
    '\u1E50': 'O',
    '\u1E52': 'O',
    '\u014E': 'O',
    '\u022E': 'O',
    '\u0230': 'O',
    '\u00D6': 'O',
    '\u022A': 'O',
    '\u1ECE': 'O',
    '\u0150': 'O',
    '\u01D1': 'O',
    '\u020C': 'O',
    '\u020E': 'O',
    '\u01A0': 'O',
    '\u1EDC': 'O',
    '\u1EDA': 'O',
    '\u1EE0': 'O',
    '\u1EDE': 'O',
    '\u1EE2': 'O',
    '\u1ECC': 'O',
    '\u1ED8': 'O',
    '\u01EA': 'O',
    '\u01EC': 'O',
    '\u00D8': 'O',
    '\u01FE': 'O',
    '\u0186': 'O',
    '\u019F': 'O',
    '\uA74A': 'O',
    '\uA74C': 'O',
    '\u01A2': 'OI',
    '\uA74E': 'OO',
    '\u0222': 'OU',
    '\u24C5': 'P',
    '\uFF30': 'P',
    '\u1E54': 'P',
    '\u1E56': 'P',
    '\u01A4': 'P',
    '\u2C63': 'P',
    '\uA750': 'P',
    '\uA752': 'P',
    '\uA754': 'P',
    '\u24C6': 'Q',
    '\uFF31': 'Q',
    '\uA756': 'Q',
    '\uA758': 'Q',
    '\u024A': 'Q',
    '\u24C7': 'R',
    '\uFF32': 'R',
    '\u0154': 'R',
    '\u1E58': 'R',
    '\u0158': 'R',
    '\u0210': 'R',
    '\u0212': 'R',
    '\u1E5A': 'R',
    '\u1E5C': 'R',
    '\u0156': 'R',
    '\u1E5E': 'R',
    '\u024C': 'R',
    '\u2C64': 'R',
    '\uA75A': 'R',
    '\uA7A6': 'R',
    '\uA782': 'R',
    '\u24C8': 'S',
    '\uFF33': 'S',
    '\u1E9E': 'S',
    '\u015A': 'S',
    '\u1E64': 'S',
    '\u015C': 'S',
    '\u1E60': 'S',
    '\u0160': 'S',
    '\u1E66': 'S',
    '\u1E62': 'S',
    '\u1E68': 'S',
    '\u0218': 'S',
    '\u015E': 'S',
    '\u2C7E': 'S',
    '\uA7A8': 'S',
    '\uA784': 'S',
    '\u24C9': 'T',
    '\uFF34': 'T',
    '\u1E6A': 'T',
    '\u0164': 'T',
    '\u1E6C': 'T',
    '\u021A': 'T',
    '\u0162': 'T',
    '\u1E70': 'T',
    '\u1E6E': 'T',
    '\u0166': 'T',
    '\u01AC': 'T',
    '\u01AE': 'T',
    '\u023E': 'T',
    '\uA786': 'T',
    '\uA728': 'TZ',
    '\u24CA': 'U',
    '\uFF35': 'U',
    '\u00D9': 'U',
    '\u00DA': 'U',
    '\u00DB': 'U',
    '\u0168': 'U',
    '\u1E78': 'U',
    '\u016A': 'U',
    '\u1E7A': 'U',
    '\u016C': 'U',
    '\u00DC': 'U',
    '\u01DB': 'U',
    '\u01D7': 'U',
    '\u01D5': 'U',
    '\u01D9': 'U',
    '\u1EE6': 'U',
    '\u016E': 'U',
    '\u0170': 'U',
    '\u01D3': 'U',
    '\u0214': 'U',
    '\u0216': 'U',
    '\u01AF': 'U',
    '\u1EEA': 'U',
    '\u1EE8': 'U',
    '\u1EEE': 'U',
    '\u1EEC': 'U',
    '\u1EF0': 'U',
    '\u1EE4': 'U',
    '\u1E72': 'U',
    '\u0172': 'U',
    '\u1E76': 'U',
    '\u1E74': 'U',
    '\u0244': 'U',
    '\u24CB': 'V',
    '\uFF36': 'V',
    '\u1E7C': 'V',
    '\u1E7E': 'V',
    '\u01B2': 'V',
    '\uA75E': 'V',
    '\u0245': 'V',
    '\uA760': 'VY',
    '\u24CC': 'W',
    '\uFF37': 'W',
    '\u1E80': 'W',
    '\u1E82': 'W',
    '\u0174': 'W',
    '\u1E86': 'W',
    '\u1E84': 'W',
    '\u1E88': 'W',
    '\u2C72': 'W',
    '\u24CD': 'X',
    '\uFF38': 'X',
    '\u1E8A': 'X',
    '\u1E8C': 'X',
    '\u24CE': 'Y',
    '\uFF39': 'Y',
    '\u1EF2': 'Y',
    '\u00DD': 'Y',
    '\u0176': 'Y',
    '\u1EF8': 'Y',
    '\u0232': 'Y',
    '\u1E8E': 'Y',
    '\u0178': 'Y',
    '\u1EF6': 'Y',
    '\u1EF4': 'Y',
    '\u01B3': 'Y',
    '\u024E': 'Y',
    '\u1EFE': 'Y',
    '\u24CF': 'Z',
    '\uFF3A': 'Z',
    '\u0179': 'Z',
    '\u1E90': 'Z',
    '\u017B': 'Z',
    '\u017D': 'Z',
    '\u1E92': 'Z',
    '\u1E94': 'Z',
    '\u01B5': 'Z',
    '\u0224': 'Z',
    '\u2C7F': 'Z',
    '\u2C6B': 'Z',
    '\uA762': 'Z',
    '\u24D0': 'a',
    '\uFF41': 'a',
    '\u1E9A': 'a',
    '\u00E0': 'a',
    '\u00E1': 'a',
    '\u00E2': 'a',
    '\u1EA7': 'a',
    '\u1EA5': 'a',
    '\u1EAB': 'a',
    '\u1EA9': 'a',
    '\u00E3': 'a',
    '\u0101': 'a',
    '\u0103': 'a',
    '\u1EB1': 'a',
    '\u1EAF': 'a',
    '\u1EB5': 'a',
    '\u1EB3': 'a',
    '\u0227': 'a',
    '\u01E1': 'a',
    '\u00E4': 'a',
    '\u01DF': 'a',
    '\u1EA3': 'a',
    '\u00E5': 'a',
    '\u01FB': 'a',
    '\u01CE': 'a',
    '\u0201': 'a',
    '\u0203': 'a',
    '\u1EA1': 'a',
    '\u1EAD': 'a',
    '\u1EB7': 'a',
    '\u1E01': 'a',
    '\u0105': 'a',
    '\u2C65': 'a',
    '\u0250': 'a',
    '\uA733': 'aa',
    '\u00E6': 'ae',
    '\u01FD': 'ae',
    '\u01E3': 'ae',
    '\uA735': 'ao',
    '\uA737': 'au',
    '\uA739': 'av',
    '\uA73B': 'av',
    '\uA73D': 'ay',
    '\u24D1': 'b',
    '\uFF42': 'b',
    '\u1E03': 'b',
    '\u1E05': 'b',
    '\u1E07': 'b',
    '\u0180': 'b',
    '\u0183': 'b',
    '\u0253': 'b',
    '\u24D2': 'c',
    '\uFF43': 'c',
    '\u0107': 'c',
    '\u0109': 'c',
    '\u010B': 'c',
    '\u010D': 'c',
    '\u00E7': 'c',
    '\u1E09': 'c',
    '\u0188': 'c',
    '\u023C': 'c',
    '\uA73F': 'c',
    '\u2184': 'c',
    '\u24D3': 'd',
    '\uFF44': 'd',
    '\u1E0B': 'd',
    '\u010F': 'd',
    '\u1E0D': 'd',
    '\u1E11': 'd',
    '\u1E13': 'd',
    '\u1E0F': 'd',
    '\u0111': 'd',
    '\u018C': 'd',
    '\u0256': 'd',
    '\u0257': 'd',
    '\uA77A': 'd',
    '\u01F3': 'dz',
    '\u01C6': 'dz',
    '\u24D4': 'e',
    '\uFF45': 'e',
    '\u00E8': 'e',
    '\u00E9': 'e',
    '\u00EA': 'e',
    '\u1EC1': 'e',
    '\u1EBF': 'e',
    '\u1EC5': 'e',
    '\u1EC3': 'e',
    '\u1EBD': 'e',
    '\u0113': 'e',
    '\u1E15': 'e',
    '\u1E17': 'e',
    '\u0115': 'e',
    '\u0117': 'e',
    '\u00EB': 'e',
    '\u1EBB': 'e',
    '\u011B': 'e',
    '\u0205': 'e',
    '\u0207': 'e',
    '\u1EB9': 'e',
    '\u1EC7': 'e',
    '\u0229': 'e',
    '\u1E1D': 'e',
    '\u0119': 'e',
    '\u1E19': 'e',
    '\u1E1B': 'e',
    '\u0247': 'e',
    '\u025B': 'e',
    '\u01DD': 'e',
    '\u24D5': 'f',
    '\uFF46': 'f',
    '\u1E1F': 'f',
    '\u0192': 'f',
    '\uA77C': 'f',
    '\u24D6': 'g',
    '\uFF47': 'g',
    '\u01F5': 'g',
    '\u011D': 'g',
    '\u1E21': 'g',
    '\u011F': 'g',
    '\u0121': 'g',
    '\u01E7': 'g',
    '\u0123': 'g',
    '\u01E5': 'g',
    '\u0260': 'g',
    '\uA7A1': 'g',
    '\u1D79': 'g',
    '\uA77F': 'g',
    '\u24D7': 'h',
    '\uFF48': 'h',
    '\u0125': 'h',
    '\u1E23': 'h',
    '\u1E27': 'h',
    '\u021F': 'h',
    '\u1E25': 'h',
    '\u1E29': 'h',
    '\u1E2B': 'h',
    '\u1E96': 'h',
    '\u0127': 'h',
    '\u2C68': 'h',
    '\u2C76': 'h',
    '\u0265': 'h',
    '\u0195': 'hv',
    '\u24D8': 'i',
    '\uFF49': 'i',
    '\u00EC': 'i',
    '\u00ED': 'i',
    '\u00EE': 'i',
    '\u0129': 'i',
    '\u012B': 'i',
    '\u012D': 'i',
    '\u00EF': 'i',
    '\u1E2F': 'i',
    '\u1EC9': 'i',
    '\u01D0': 'i',
    '\u0209': 'i',
    '\u020B': 'i',
    '\u1ECB': 'i',
    '\u012F': 'i',
    '\u1E2D': 'i',
    '\u0268': 'i',
    '\u0131': 'i',
    '\u24D9': 'j',
    '\uFF4A': 'j',
    '\u0135': 'j',
    '\u01F0': 'j',
    '\u0249': 'j',
    '\u24DA': 'k',
    '\uFF4B': 'k',
    '\u1E31': 'k',
    '\u01E9': 'k',
    '\u1E33': 'k',
    '\u0137': 'k',
    '\u1E35': 'k',
    '\u0199': 'k',
    '\u2C6A': 'k',
    '\uA741': 'k',
    '\uA743': 'k',
    '\uA745': 'k',
    '\uA7A3': 'k',
    '\u24DB': 'l',
    '\uFF4C': 'l',
    '\u0140': 'l',
    '\u013A': 'l',
    '\u013E': 'l',
    '\u1E37': 'l',
    '\u1E39': 'l',
    '\u013C': 'l',
    '\u1E3D': 'l',
    '\u1E3B': 'l',
    '\u017F': 'l',
    '\u0142': 'l',
    '\u019A': 'l',
    '\u026B': 'l',
    '\u2C61': 'l',
    '\uA749': 'l',
    '\uA781': 'l',
    '\uA747': 'l',
    '\u01C9': 'lj',
    '\u24DC': 'm',
    '\uFF4D': 'm',
    '\u1E3F': 'm',
    '\u1E41': 'm',
    '\u1E43': 'm',
    '\u0271': 'm',
    '\u026F': 'm',
    '\u24DD': 'n',
    '\uFF4E': 'n',
    '\u01F9': 'n',
    '\u0144': 'n',
    '\u00F1': 'n',
    '\u1E45': 'n',
    '\u0148': 'n',
    '\u1E47': 'n',
    '\u0146': 'n',
    '\u1E4B': 'n',
    '\u1E49': 'n',
    '\u019E': 'n',
    '\u0272': 'n',
    '\u0149': 'n',
    '\uA791': 'n',
    '\uA7A5': 'n',
    '\u01CC': 'nj',
    '\u24DE': 'o',
    '\uFF4F': 'o',
    '\u00F2': 'o',
    '\u00F3': 'o',
    '\u00F4': 'o',
    '\u1ED3': 'o',
    '\u1ED1': 'o',
    '\u1ED7': 'o',
    '\u1ED5': 'o',
    '\u00F5': 'o',
    '\u1E4D': 'o',
    '\u022D': 'o',
    '\u1E4F': 'o',
    '\u014D': 'o',
    '\u1E51': 'o',
    '\u1E53': 'o',
    '\u014F': 'o',
    '\u022F': 'o',
    '\u0231': 'o',
    '\u00F6': 'o',
    '\u022B': 'o',
    '\u1ECF': 'o',
    '\u0151': 'o',
    '\u01D2': 'o',
    '\u020D': 'o',
    '\u020F': 'o',
    '\u01A1': 'o',
    '\u1EDD': 'o',
    '\u1EDB': 'o',
    '\u1EE1': 'o',
    '\u1EDF': 'o',
    '\u1EE3': 'o',
    '\u1ECD': 'o',
    '\u1ED9': 'o',
    '\u01EB': 'o',
    '\u01ED': 'o',
    '\u00F8': 'o',
    '\u01FF': 'o',
    '\u0254': 'o',
    '\uA74B': 'o',
    '\uA74D': 'o',
    '\u0275': 'o',
    '\u01A3': 'oi',
    '\u0223': 'ou',
    '\uA74F': 'oo',
    '\u24DF': 'p',
    '\uFF50': 'p',
    '\u1E55': 'p',
    '\u1E57': 'p',
    '\u01A5': 'p',
    '\u1D7D': 'p',
    '\uA751': 'p',
    '\uA753': 'p',
    '\uA755': 'p',
    '\u24E0': 'q',
    '\uFF51': 'q',
    '\u024B': 'q',
    '\uA757': 'q',
    '\uA759': 'q',
    '\u24E1': 'r',
    '\uFF52': 'r',
    '\u0155': 'r',
    '\u1E59': 'r',
    '\u0159': 'r',
    '\u0211': 'r',
    '\u0213': 'r',
    '\u1E5B': 'r',
    '\u1E5D': 'r',
    '\u0157': 'r',
    '\u1E5F': 'r',
    '\u024D': 'r',
    '\u027D': 'r',
    '\uA75B': 'r',
    '\uA7A7': 'r',
    '\uA783': 'r',
    '\u24E2': 's',
    '\uFF53': 's',
    '\u00DF': 's',
    '\u015B': 's',
    '\u1E65': 's',
    '\u015D': 's',
    '\u1E61': 's',
    '\u0161': 's',
    '\u1E67': 's',
    '\u1E63': 's',
    '\u1E69': 's',
    '\u0219': 's',
    '\u015F': 's',
    '\u023F': 's',
    '\uA7A9': 's',
    '\uA785': 's',
    '\u1E9B': 's',
    '\u24E3': 't',
    '\uFF54': 't',
    '\u1E6B': 't',
    '\u1E97': 't',
    '\u0165': 't',
    '\u1E6D': 't',
    '\u021B': 't',
    '\u0163': 't',
    '\u1E71': 't',
    '\u1E6F': 't',
    '\u0167': 't',
    '\u01AD': 't',
    '\u0288': 't',
    '\u2C66': 't',
    '\uA787': 't',
    '\uA729': 'tz',
    '\u24E4': 'u',
    '\uFF55': 'u',
    '\u00F9': 'u',
    '\u00FA': 'u',
    '\u00FB': 'u',
    '\u0169': 'u',
    '\u1E79': 'u',
    '\u016B': 'u',
    '\u1E7B': 'u',
    '\u016D': 'u',
    '\u00FC': 'u',
    '\u01DC': 'u',
    '\u01D8': 'u',
    '\u01D6': 'u',
    '\u01DA': 'u',
    '\u1EE7': 'u',
    '\u016F': 'u',
    '\u0171': 'u',
    '\u01D4': 'u',
    '\u0215': 'u',
    '\u0217': 'u',
    '\u01B0': 'u',
    '\u1EEB': 'u',
    '\u1EE9': 'u',
    '\u1EEF': 'u',
    '\u1EED': 'u',
    '\u1EF1': 'u',
    '\u1EE5': 'u',
    '\u1E73': 'u',
    '\u0173': 'u',
    '\u1E77': 'u',
    '\u1E75': 'u',
    '\u0289': 'u',
    '\u24E5': 'v',
    '\uFF56': 'v',
    '\u1E7D': 'v',
    '\u1E7F': 'v',
    '\u028B': 'v',
    '\uA75F': 'v',
    '\u028C': 'v',
    '\uA761': 'vy',
    '\u24E6': 'w',
    '\uFF57': 'w',
    '\u1E81': 'w',
    '\u1E83': 'w',
    '\u0175': 'w',
    '\u1E87': 'w',
    '\u1E85': 'w',
    '\u1E98': 'w',
    '\u1E89': 'w',
    '\u2C73': 'w',
    '\u24E7': 'x',
    '\uFF58': 'x',
    '\u1E8B': 'x',
    '\u1E8D': 'x',
    '\u24E8': 'y',
    '\uFF59': 'y',
    '\u1EF3': 'y',
    '\u00FD': 'y',
    '\u0177': 'y',
    '\u1EF9': 'y',
    '\u0233': 'y',
    '\u1E8F': 'y',
    '\u00FF': 'y',
    '\u1EF7': 'y',
    '\u1E99': 'y',
    '\u1EF5': 'y',
    '\u01B4': 'y',
    '\u024F': 'y',
    '\u1EFF': 'y',
    '\u24E9': 'z',
    '\uFF5A': 'z',
    '\u017A': 'z',
    '\u1E91': 'z',
    '\u017C': 'z',
    '\u017E': 'z',
    '\u1E93': 'z',
    '\u1E95': 'z',
    '\u01B6': 'z',
    '\u0225': 'z',
    '\u0240': 'z',
    '\u2C6C': 'z',
    '\uA763': 'z',
    '\u0386': '\u0391',
    '\u0388': '\u0395',
    '\u0389': '\u0397',
    '\u038A': '\u0399',
    '\u03AA': '\u0399',
    '\u038C': '\u039F',
    '\u038E': '\u03A5',
    '\u03AB': '\u03A5',
    '\u038F': '\u03A9',
    '\u03AC': '\u03B1',
    '\u03AD': '\u03B5',
    '\u03AE': '\u03B7',
    '\u03AF': '\u03B9',
    '\u03CA': '\u03B9',
    '\u0390': '\u03B9',
    '\u03CC': '\u03BF',
    '\u03CD': '\u03C5',
    '\u03CB': '\u03C5',
    '\u03B0': '\u03C5',
    '\u03C9': '\u03C9',
    '\u03C2': '\u03C3'
  };

  return diacritics;
});

S2.define('select2/data/base',[
  '../utils'
], function (Utils) {
  function BaseAdapter ($element, options) {
    BaseAdapter.__super__.constructor.call(this);
  }

  Utils.Extend(BaseAdapter, Utils.Observable);

  BaseAdapter.prototype.current = function (callback) {
    throw new Error('The `current` method must be defined in child classes.');
  };

  BaseAdapter.prototype.query = function (params, callback) {
    throw new Error('The `query` method must be defined in child classes.');
  };

  BaseAdapter.prototype.bind = function (container, $container) {
    // Can be implemented in subclasses
  };

  BaseAdapter.prototype.destroy = function () {
    // Can be implemented in subclasses
  };

  BaseAdapter.prototype.generateResultId = function (container, data) {
    var id = container.id + '-result-';

    id += Utils.generateChars(4);

    if (data.id != null) {
      id += '-' + data.id.toString();
    } else {
      id += '-' + Utils.generateChars(4);
    }
    return id;
  };

  return BaseAdapter;
});

S2.define('select2/data/select',[
  './base',
  '../utils',
  'jquery'
], function (BaseAdapter, Utils, $) {
  function SelectAdapter ($element, options) {
    this.$element = $element;
    this.options = options;

    SelectAdapter.__super__.constructor.call(this);
  }

  Utils.Extend(SelectAdapter, BaseAdapter);

  SelectAdapter.prototype.current = function (callback) {
    var data = [];
    var self = this;

    this.$element.find(':selected').each(function () {
      var $option = $(this);

      var option = self.item($option);

      data.push(option);
    });

    callback(data);
  };

  SelectAdapter.prototype.select = function (data) {
    var self = this;

    data.selected = true;

    // If data.element is a DOM node, use it instead
    if ($(data.element).is('option')) {
      data.element.selected = true;

      this.$element.trigger('change');

      return;
    }

    if (this.$element.prop('multiple')) {
      this.current(function (currentData) {
        var val = [];

        data = [data];
        data.push.apply(data, currentData);

        for (var d = 0; d < data.length; d++) {
          var id = data[d].id;

          if ($.inArray(id, val) === -1) {
            val.push(id);
          }
        }

        self.$element.val(val);
        self.$element.trigger('change');
      });
    } else {
      var val = data.id;

      this.$element.val(val);
      this.$element.trigger('change');
    }
  };

  SelectAdapter.prototype.unselect = function (data) {
    var self = this;

    if (!this.$element.prop('multiple')) {
      return;
    }

    data.selected = false;

    if ($(data.element).is('option')) {
      data.element.selected = false;

      this.$element.trigger('change');

      return;
    }

    this.current(function (currentData) {
      var val = [];

      for (var d = 0; d < currentData.length; d++) {
        var id = currentData[d].id;

        if (id !== data.id && $.inArray(id, val) === -1) {
          val.push(id);
        }
      }

      self.$element.val(val);

      self.$element.trigger('change');
    });
  };

  SelectAdapter.prototype.bind = function (container, $container) {
    var self = this;

    this.container = container;

    container.on('select', function (params) {
      self.select(params.data);
    });

    container.on('unselect', function (params) {
      self.unselect(params.data);
    });
  };

  SelectAdapter.prototype.destroy = function () {
    // Remove anything added to child elements
    this.$element.find('*').each(function () {
      // Remove any custom data set by Select2
      $.removeData(this, 'data');
    });
  };

  SelectAdapter.prototype.query = function (params, callback) {
    var data = [];
    var self = this;

    var $options = this.$element.children();

    $options.each(function () {
      var $option = $(this);

      if (!$option.is('option') && !$option.is('optgroup')) {
        return;
      }

      var option = self.item($option);

      var matches = self.matches(params, option);

      if (matches !== null) {
        data.push(matches);
      }
    });

    callback({
      results: data
    });
  };

  SelectAdapter.prototype.addOptions = function ($options) {
    Utils.appendMany(this.$element, $options);
  };

  SelectAdapter.prototype.option = function (data) {
    var option;

    if (data.children) {
      option = document.createElement('optgroup');
      option.label = data.text;
    } else {
      option = document.createElement('option');

      if (option.textContent !== undefined) {
        option.textContent = data.text;
      } else {
        option.innerText = data.text;
      }
    }

    if (data.id) {
      option.value = data.id;
    }

    if (data.disabled) {
      option.disabled = true;
    }

    if (data.selected) {
      option.selected = true;
    }

    if (data.title) {
      option.title = data.title;
    }

    var $option = $(option);

    var normalizedData = this._normalizeItem(data);
    normalizedData.element = option;

    // Override the option's data with the combined data
    $.data(option, 'data', normalizedData);

    return $option;
  };

  SelectAdapter.prototype.item = function ($option) {
    var data = {};

    data = $.data($option[0], 'data');

    if (data != null) {
      return data;
    }

    if ($option.is('option')) {
      data = {
        id: $option.val(),
        text: $option.text(),
        disabled: $option.prop('disabled'),
        selected: $option.prop('selected'),
        title: $option.prop('title')
      };
    } else if ($option.is('optgroup')) {
      data = {
        text: $option.prop('label'),
        children: [],
        title: $option.prop('title')
      };

      var $children = $option.children('option');
      var children = [];

      for (var c = 0; c < $children.length; c++) {
        var $child = $($children[c]);

        var child = this.item($child);

        children.push(child);
      }

      data.children = children;
    }

    data = this._normalizeItem(data);
    data.element = $option[0];

    $.data($option[0], 'data', data);

    return data;
  };

  SelectAdapter.prototype._normalizeItem = function (item) {
    if (!$.isPlainObject(item)) {
      item = {
        id: item,
        text: item
      };
    }

    item = $.extend({}, {
      text: ''
    }, item);

    var defaults = {
      selected: false,
      disabled: false
    };

    if (item.id != null) {
      item.id = item.id.toString();
    }

    if (item.text != null) {
      item.text = item.text.toString();
    }

    if (item._resultId == null && item.id && this.container != null) {
      item._resultId = this.generateResultId(this.container, item);
    }

    return $.extend({}, defaults, item);
  };

  SelectAdapter.prototype.matches = function (params, data) {
    var matcher = this.options.get('matcher');

    return matcher(params, data);
  };

  return SelectAdapter;
});

S2.define('select2/data/array',[
  './select',
  '../utils',
  'jquery'
], function (SelectAdapter, Utils, $) {
  function ArrayAdapter ($element, options) {
    var data = options.get('data') || [];

    ArrayAdapter.__super__.constructor.call(this, $element, options);

    this.addOptions(this.convertToOptions(data));
  }

  Utils.Extend(ArrayAdapter, SelectAdapter);

  ArrayAdapter.prototype.select = function (data) {
    var $option = this.$element.find('option').filter(function (i, elm) {
      return elm.value == data.id.toString();
    });

    if ($option.length === 0) {
      $option = this.option(data);

      this.addOptions($option);
    }

    ArrayAdapter.__super__.select.call(this, data);
  };

  ArrayAdapter.prototype.convertToOptions = function (data) {
    var self = this;

    var $existing = this.$element.find('option');
    var existingIds = $existing.map(function () {
      return self.item($(this)).id;
    }).get();

    var $options = [];

    // Filter out all items except for the one passed in the argument
    function onlyItem (item) {
      return function () {
        return $(this).val() == item.id;
      };
    }

    for (var d = 0; d < data.length; d++) {
      var item = this._normalizeItem(data[d]);

      // Skip items which were pre-loaded, only merge the data
      if ($.inArray(item.id, existingIds) >= 0) {
        var $existingOption = $existing.filter(onlyItem(item));

        var existingData = this.item($existingOption);
        var newData = $.extend(true, {}, item, existingData);

        var $newOption = this.option(newData);

        $existingOption.replaceWith($newOption);

        continue;
      }

      var $option = this.option(item);

      if (item.children) {
        var $children = this.convertToOptions(item.children);

        Utils.appendMany($option, $children);
      }

      $options.push($option);
    }

    return $options;
  };

  return ArrayAdapter;
});

S2.define('select2/data/ajax',[
  './array',
  '../utils',
  'jquery'
], function (ArrayAdapter, Utils, $) {
  function AjaxAdapter ($element, options) {
    this.ajaxOptions = this._applyDefaults(options.get('ajax'));

    if (this.ajaxOptions.processResults != null) {
      this.processResults = this.ajaxOptions.processResults;
    }

    AjaxAdapter.__super__.constructor.call(this, $element, options);
  }

  Utils.Extend(AjaxAdapter, ArrayAdapter);

  AjaxAdapter.prototype._applyDefaults = function (options) {
    var defaults = {
      data: function (params) {
        return $.extend({}, params, {
          q: params.term
        });
      },
      transport: function (params, success, failure) {
        var $request = $.ajax(params);

        $request.then(success);
        $request.fail(failure);

        return $request;
      }
    };

    return $.extend({}, defaults, options, true);
  };

  AjaxAdapter.prototype.processResults = function (results) {
    return results;
  };

  AjaxAdapter.prototype.query = function (params, callback) {
    var matches = [];
    var self = this;

    if (this._request != null) {
      // JSONP requests cannot always be aborted
      if ($.isFunction(this._request.abort)) {
        this._request.abort();
      }

      this._request = null;
    }

    var options = $.extend({
      type: 'GET'
    }, this.ajaxOptions);

    if (typeof options.url === 'function') {
      options.url = options.url.call(this.$element, params);
    }

    if (typeof options.data === 'function') {
      options.data = options.data.call(this.$element, params);
    }

    function request () {
      var $request = options.transport(options, function (data) {
        var results = self.processResults(data, params);

        if (self.options.get('debug') && window.console && console.error) {
          // Check to make sure that the response included a `results` key.
          if (!results || !results.results || !$.isArray(results.results)) {
            console.error(
              'Select2: The AJAX results did not return an array in the ' +
              '`results` key of the response.'
            );
          }
        }

        callback(results);
      }, function () {
        // Attempt to detect if a request was aborted
        // Only works if the transport exposes a status property
        if ($request.status && $request.status === '0') {
          return;
        }

        self.trigger('results:message', {
          message: 'errorLoading'
        });
      });

      self._request = $request;
    }

    if (this.ajaxOptions.delay && params.term != null) {
      if (this._queryTimeout) {
        window.clearTimeout(this._queryTimeout);
      }

      this._queryTimeout = window.setTimeout(request, this.ajaxOptions.delay);
    } else {
      request();
    }
  };

  return AjaxAdapter;
});

S2.define('select2/data/tags',[
  'jquery'
], function ($) {
  function Tags (decorated, $element, options) {
    var tags = options.get('tags');

    var createTag = options.get('createTag');

    if (createTag !== undefined) {
      this.createTag = createTag;
    }

    var insertTag = options.get('insertTag');

    if (insertTag !== undefined) {
        this.insertTag = insertTag;
    }

    decorated.call(this, $element, options);

    if ($.isArray(tags)) {
      for (var t = 0; t < tags.length; t++) {
        var tag = tags[t];
        var item = this._normalizeItem(tag);

        var $option = this.option(item);

        this.$element.append($option);
      }
    }
  }

  Tags.prototype.query = function (decorated, params, callback) {
    var self = this;

    this._removeOldTags();

    if (params.term == null || params.page != null) {
      decorated.call(this, params, callback);
      return;
    }

    function wrapper (obj, child) {
      var data = obj.results;

      for (var i = 0; i < data.length; i++) {
        var option = data[i];

        var checkChildren = (
          option.children != null &&
          !wrapper({
            results: option.children
          }, true)
        );

        var checkText = option.text === params.term;

        if (checkText || checkChildren) {
          if (child) {
            return false;
          }

          obj.data = data;
          callback(obj);

          return;
        }
      }

      if (child) {
        return true;
      }

      var tag = self.createTag(params);

      if (tag != null) {
        var $option = self.option(tag);
        $option.attr('data-select2-tag', true);

        self.addOptions([$option]);

        self.insertTag(data, tag);
      }

      obj.results = data;

      callback(obj);
    }

    decorated.call(this, params, wrapper);
  };

  Tags.prototype.createTag = function (decorated, params) {
    var term = $.trim(params.term);

    if (term === '') {
      return null;
    }

    return {
      id: term,
      text: term
    };
  };

  Tags.prototype.insertTag = function (_, data, tag) {
    data.unshift(tag);
  };

  Tags.prototype._removeOldTags = function (_) {
    var tag = this._lastTag;

    var $options = this.$element.find('option[data-select2-tag]');

    $options.each(function () {
      if (this.selected) {
        return;
      }

      $(this).remove();
    });
  };

  return Tags;
});

S2.define('select2/data/tokenizer',[
  'jquery'
], function ($) {
  function Tokenizer (decorated, $element, options) {
    var tokenizer = options.get('tokenizer');

    if (tokenizer !== undefined) {
      this.tokenizer = tokenizer;
    }

    decorated.call(this, $element, options);
  }

  Tokenizer.prototype.bind = function (decorated, container, $container) {
    decorated.call(this, container, $container);

    this.$search =  container.dropdown.$search || container.selection.$search ||
      $container.find('.select2-search__field');
  };

  Tokenizer.prototype.query = function (decorated, params, callback) {
    var self = this;

    function createAndSelect (data) {
      // Normalize the data object so we can use it for checks
      var item = self._normalizeItem(data);

      // Check if the data object already exists as a tag
      // Select it if it doesn't
      var $existingOptions = self.$element.find('option').filter(function () {
        return $(this).val() === item.id;
      });

      // If an existing option wasn't found for it, create the option
      if (!$existingOptions.length) {
        var $option = self.option(item);
        $option.attr('data-select2-tag', true);

        self._removeOldTags();
        self.addOptions([$option]);
      }

      // Select the item, now that we know there is an option for it
      select(item);
    }

    function select (data) {
      self.trigger('select', {
        data: data
      });
    }

    params.term = params.term || '';

    var tokenData = this.tokenizer(params, this.options, createAndSelect);

    if (tokenData.term !== params.term) {
      // Replace the search term if we have the search box
      if (this.$search.length) {
        this.$search.val(tokenData.term);
        this.$search.focus();
      }

      params.term = tokenData.term;
    }

    decorated.call(this, params, callback);
  };

  Tokenizer.prototype.tokenizer = function (_, params, options, callback) {
    var separators = options.get('tokenSeparators') || [];
    var term = params.term;
    var i = 0;

    var createTag = this.createTag || function (params) {
      return {
        id: params.term,
        text: params.term
      };
    };

    while (i < term.length) {
      var termChar = term[i];

      if ($.inArray(termChar, separators) === -1) {
        i++;

        continue;
      }

      var part = term.substr(0, i);
      var partParams = $.extend({}, params, {
        term: part
      });

      var data = createTag(partParams);

      if (data == null) {
        i++;
        continue;
      }

      callback(data);

      // Reset the term to not include the tokenized portion
      term = term.substr(i + 1) || '';
      i = 0;
    }

    return {
      term: term
    };
  };

  return Tokenizer;
});

S2.define('select2/data/minimumInputLength',[

], function () {
  function MinimumInputLength (decorated, $e, options) {
    this.minimumInputLength = options.get('minimumInputLength');

    decorated.call(this, $e, options);
  }

  MinimumInputLength.prototype.query = function (decorated, params, callback) {
    params.term = params.term || '';

    if (params.term.length < this.minimumInputLength) {
      this.trigger('results:message', {
        message: 'inputTooShort',
        args: {
          minimum: this.minimumInputLength,
          input: params.term,
          params: params
        }
      });

      return;
    }

    decorated.call(this, params, callback);
  };

  return MinimumInputLength;
});

S2.define('select2/data/maximumInputLength',[

], function () {
  function MaximumInputLength (decorated, $e, options) {
    this.maximumInputLength = options.get('maximumInputLength');

    decorated.call(this, $e, options);
  }

  MaximumInputLength.prototype.query = function (decorated, params, callback) {
    params.term = params.term || '';

    if (this.maximumInputLength > 0 &&
        params.term.length > this.maximumInputLength) {
      this.trigger('results:message', {
        message: 'inputTooLong',
        args: {
          maximum: this.maximumInputLength,
          input: params.term,
          params: params
        }
      });

      return;
    }

    decorated.call(this, params, callback);
  };

  return MaximumInputLength;
});

S2.define('select2/data/maximumSelectionLength',[

], function (){
  function MaximumSelectionLength (decorated, $e, options) {
    this.maximumSelectionLength = options.get('maximumSelectionLength');

    decorated.call(this, $e, options);
  }

  MaximumSelectionLength.prototype.query =
    function (decorated, params, callback) {
      var self = this;

      this.current(function (currentData) {
        var count = currentData != null ? currentData.length : 0;
        if (self.maximumSelectionLength > 0 &&
          count >= self.maximumSelectionLength) {
          self.trigger('results:message', {
            message: 'maximumSelected',
            args: {
              maximum: self.maximumSelectionLength
            }
          });
          return;
        }
        decorated.call(self, params, callback);
      });
  };

  return MaximumSelectionLength;
});

S2.define('select2/dropdown',[
  'jquery',
  './utils'
], function ($, Utils) {
  function Dropdown ($element, options) {
    this.$element = $element;
    this.options = options;

    Dropdown.__super__.constructor.call(this);
  }

  Utils.Extend(Dropdown, Utils.Observable);

  Dropdown.prototype.render = function () {
    var $dropdown = $(
      '<span class="select2-dropdown">' +
        '<span class="select2-results"></span>' +
      '</span>'
    );

    $dropdown.attr('dir', this.options.get('dir'));

    this.$dropdown = $dropdown;

    return $dropdown;
  };

  Dropdown.prototype.bind = function () {
    // Should be implemented in subclasses
  };

  Dropdown.prototype.position = function ($dropdown, $container) {
    // Should be implmented in subclasses
  };

  Dropdown.prototype.destroy = function () {
    // Remove the dropdown from the DOM
    this.$dropdown.remove();
  };

  return Dropdown;
});

S2.define('select2/dropdown/search',[
  'jquery',
  '../utils'
], function ($, Utils) {
  function Search () { }

  Search.prototype.render = function (decorated) {
    var $rendered = decorated.call(this);

    var $search = $(
      '<span class="select2-search select2-search--dropdown">' +
        '<input class="select2-search__field" type="search" tabindex="-1"' +
        ' autocomplete="off" autocorrect="off" autocapitalize="off"' +
        ' spellcheck="false" role="textbox" />' +
      '</span>'
    );

    this.$searchContainer = $search;
    this.$search = $search.find('input');

    $rendered.prepend($search);

    return $rendered;
  };

  Search.prototype.bind = function (decorated, container, $container) {
    var self = this;

    decorated.call(this, container, $container);

    this.$search.on('keydown', function (evt) {
      self.trigger('keypress', evt);

      self._keyUpPrevented = evt.isDefaultPrevented();
    });

    // Workaround for browsers which do not support the `input` event
    // This will prevent double-triggering of events for browsers which support
    // both the `keyup` and `input` events.
    this.$search.on('input', function (evt) {
      // Unbind the duplicated `keyup` event
      $(this).off('keyup');
    });

    this.$search.on('keyup input', function (evt) {
      self.handleSearch(evt);
    });

    container.on('open', function () {
      self.$search.attr('tabindex', 0);

      self.$search.focus();

      window.setTimeout(function () {
        self.$search.focus();
      }, 0);
    });

    container.on('close', function () {
      self.$search.attr('tabindex', -1);

      self.$search.val('');
    });

    container.on('focus', function () {
      if (container.isOpen()) {
        self.$search.focus();
      }
    });

    container.on('results:all', function (params) {
      if (params.query.term == null || params.query.term === '') {
        var showSearch = self.showSearch(params);

        if (showSearch) {
          self.$searchContainer.removeClass('select2-search--hide');
        } else {
          self.$searchContainer.addClass('select2-search--hide');
        }
      }
    });
  };

  Search.prototype.handleSearch = function (evt) {
    if (!this._keyUpPrevented) {
      var input = this.$search.val();

      this.trigger('query', {
        term: input
      });
    }

    this._keyUpPrevented = false;
  };

  Search.prototype.showSearch = function (_, params) {
    return true;
  };

  return Search;
});

S2.define('select2/dropdown/hidePlaceholder',[

], function () {
  function HidePlaceholder (decorated, $element, options, dataAdapter) {
    this.placeholder = this.normalizePlaceholder(options.get('placeholder'));

    decorated.call(this, $element, options, dataAdapter);
  }

  HidePlaceholder.prototype.append = function (decorated, data) {
    data.results = this.removePlaceholder(data.results);

    decorated.call(this, data);
  };

  HidePlaceholder.prototype.normalizePlaceholder = function (_, placeholder) {
    if (typeof placeholder === 'string') {
      placeholder = {
        id: '',
        text: placeholder
      };
    }

    return placeholder;
  };

  HidePlaceholder.prototype.removePlaceholder = function (_, data) {
    var modifiedData = data.slice(0);

    for (var d = data.length - 1; d >= 0; d--) {
      var item = data[d];

      if (this.placeholder.id === item.id) {
        modifiedData.splice(d, 1);
      }
    }

    return modifiedData;
  };

  return HidePlaceholder;
});

S2.define('select2/dropdown/infiniteScroll',[
  'jquery'
], function ($) {
  function InfiniteScroll (decorated, $element, options, dataAdapter) {
    this.lastParams = {};

    decorated.call(this, $element, options, dataAdapter);

    this.$loadingMore = this.createLoadingMore();
    this.loading = false;
  }

  InfiniteScroll.prototype.append = function (decorated, data) {
    this.$loadingMore.remove();
    this.loading = false;

    decorated.call(this, data);

    if (this.showLoadingMore(data)) {
      this.$results.append(this.$loadingMore);
    }
  };

  InfiniteScroll.prototype.bind = function (decorated, container, $container) {
    var self = this;

    decorated.call(this, container, $container);

    container.on('query', function (params) {
      self.lastParams = params;
      self.loading = true;
    });

    container.on('query:append', function (params) {
      self.lastParams = params;
      self.loading = true;
    });

    this.$results.on('scroll', function () {
      var isLoadMoreVisible = $.contains(
        document.documentElement,
        self.$loadingMore[0]
      );

      if (self.loading || !isLoadMoreVisible) {
        return;
      }

      var currentOffset = self.$results.offset().top +
        self.$results.outerHeight(false);
      var loadingMoreOffset = self.$loadingMore.offset().top +
        self.$loadingMore.outerHeight(false);

      if (currentOffset + 50 >= loadingMoreOffset) {
        self.loadMore();
      }
    });
  };

  InfiniteScroll.prototype.loadMore = function () {
    this.loading = true;

    var params = $.extend({}, {page: 1}, this.lastParams);

    params.page++;

    this.trigger('query:append', params);
  };

  InfiniteScroll.prototype.showLoadingMore = function (_, data) {
    return data.pagination && data.pagination.more;
  };

  InfiniteScroll.prototype.createLoadingMore = function () {
    var $option = $(
      '<li ' +
      'class="select2-results__option select2-results__option--load-more"' +
      'role="treeitem" aria-disabled="true"></li>'
    );

    var message = this.options.get('translations').get('loadingMore');

    $option.html(message(this.lastParams));

    return $option;
  };

  return InfiniteScroll;
});

S2.define('select2/dropdown/attachBody',[
  'jquery',
  '../utils'
], function ($, Utils) {
  function AttachBody (decorated, $element, options) {
    this.$dropdownParent = options.get('dropdownParent') || $(document.body);

    decorated.call(this, $element, options);
  }

  AttachBody.prototype.bind = function (decorated, container, $container) {
    var self = this;

    var setupResultsEvents = false;

    decorated.call(this, container, $container);

    container.on('open', function () {
      self._showDropdown();
      self._attachPositioningHandler(container);

      if (!setupResultsEvents) {
        setupResultsEvents = true;

        container.on('results:all', function () {
          self._positionDropdown();
          self._resizeDropdown();
        });

        container.on('results:append', function () {
          self._positionDropdown();
          self._resizeDropdown();
        });
      }
    });

    container.on('close', function () {
      self._hideDropdown();
      self._detachPositioningHandler(container);
    });

    this.$dropdownContainer.on('mousedown', function (evt) {
      evt.stopPropagation();
    });
  };

  AttachBody.prototype.destroy = function (decorated) {
    decorated.call(this);

    this.$dropdownContainer.remove();
  };

  AttachBody.prototype.position = function (decorated, $dropdown, $container) {
    // Clone all of the container classes
    $dropdown.attr('class', $container.attr('class'));

    $dropdown.removeClass('select2');
    $dropdown.addClass('select2-container--open');

    $dropdown.css({
      position: 'absolute',
      top: -999999
    });

    this.$container = $container;
  };

  AttachBody.prototype.render = function (decorated) {
    var $container = $('<span></span>');

    var $dropdown = decorated.call(this);
    $container.append($dropdown);

    this.$dropdownContainer = $container;

    return $container;
  };

  AttachBody.prototype._hideDropdown = function (decorated) {
    this.$dropdownContainer.detach();
  };

  AttachBody.prototype._attachPositioningHandler =
      function (decorated, container) {
    var self = this;

    var scrollEvent = 'scroll.select2.' + container.id;
    var resizeEvent = 'resize.select2.' + container.id;
    var orientationEvent = 'orientationchange.select2.' + container.id;

    var $watchers = this.$container.parents().filter(Utils.hasScroll);
    $watchers.each(function () {
      $(this).data('select2-scroll-position', {
        x: $(this).scrollLeft(),
        y: $(this).scrollTop()
      });
    });

    $watchers.on(scrollEvent, function (ev) {
      var position = $(this).data('select2-scroll-position');
      $(this).scrollTop(position.y);
    });

    $(window).on(scrollEvent + ' ' + resizeEvent + ' ' + orientationEvent,
      function (e) {
      self._positionDropdown();
      self._resizeDropdown();
    });
  };

  AttachBody.prototype._detachPositioningHandler =
      function (decorated, container) {
    var scrollEvent = 'scroll.select2.' + container.id;
    var resizeEvent = 'resize.select2.' + container.id;
    var orientationEvent = 'orientationchange.select2.' + container.id;

    var $watchers = this.$container.parents().filter(Utils.hasScroll);
    $watchers.off(scrollEvent);

    $(window).off(scrollEvent + ' ' + resizeEvent + ' ' + orientationEvent);
  };

  AttachBody.prototype._positionDropdown = function () {
    var $window = $(window);

    var isCurrentlyAbove = this.$dropdown.hasClass('select2-dropdown--above');
    var isCurrentlyBelow = this.$dropdown.hasClass('select2-dropdown--below');

    var newDirection = null;

    var offset = this.$container.offset();

    offset.bottom = offset.top + this.$container.outerHeight(false);

    var container = {
      height: this.$container.outerHeight(false)
    };

    container.top = offset.top;
    container.bottom = offset.top + container.height;

    var dropdown = {
      height: this.$dropdown.outerHeight(false)
    };

    var viewport = {
      top: $window.scrollTop(),
      bottom: $window.scrollTop() + $window.height()
    };

    var enoughRoomAbove = viewport.top < (offset.top - dropdown.height);
    var enoughRoomBelow = viewport.bottom > (offset.bottom + dropdown.height);

    var css = {
      left: offset.left,
      top: container.bottom
    };

    // Determine what the parent element is to use for calciulating the offset
    var $offsetParent = this.$dropdownParent;

    // For statically positoned elements, we need to get the element
    // that is determining the offset
    if ($offsetParent.css('position') === 'static') {
      $offsetParent = $offsetParent.offsetParent();
    }

    var parentOffset = $offsetParent.offset();

    css.top -= parentOffset.top;
    css.left -= parentOffset.left;

    if (!isCurrentlyAbove && !isCurrentlyBelow) {
      newDirection = 'below';
    }

    if (!enoughRoomBelow && enoughRoomAbove && !isCurrentlyAbove) {
      newDirection = 'above';
    } else if (!enoughRoomAbove && enoughRoomBelow && isCurrentlyAbove) {
      newDirection = 'below';
    }

    if (newDirection == 'above' ||
      (isCurrentlyAbove && newDirection !== 'below')) {
      css.top = container.top - parentOffset.top - dropdown.height;
    }

    if (newDirection != null) {
      this.$dropdown
        .removeClass('select2-dropdown--below select2-dropdown--above')
        .addClass('select2-dropdown--' + newDirection);
      this.$container
        .removeClass('select2-container--below select2-container--above')
        .addClass('select2-container--' + newDirection);
    }

    this.$dropdownContainer.css(css);
  };

  AttachBody.prototype._resizeDropdown = function () {
    var css = {
      width: this.$container.outerWidth(false) + 'px'
    };

    if (this.options.get('dropdownAutoWidth')) {
      css.minWidth = css.width;
      css.position = 'relative';
      css.width = 'auto';
    }

    this.$dropdown.css(css);
  };

  AttachBody.prototype._showDropdown = function (decorated) {
    this.$dropdownContainer.appendTo(this.$dropdownParent);

    this._positionDropdown();
    this._resizeDropdown();
  };

  return AttachBody;
});

S2.define('select2/dropdown/minimumResultsForSearch',[

], function () {
  function countResults (data) {
    var count = 0;

    for (var d = 0; d < data.length; d++) {
      var item = data[d];

      if (item.children) {
        count += countResults(item.children);
      } else {
        count++;
      }
    }

    return count;
  }

  function MinimumResultsForSearch (decorated, $element, options, dataAdapter) {
    this.minimumResultsForSearch = options.get('minimumResultsForSearch');

    if (this.minimumResultsForSearch < 0) {
      this.minimumResultsForSearch = Infinity;
    }

    decorated.call(this, $element, options, dataAdapter);
  }

  MinimumResultsForSearch.prototype.showSearch = function (decorated, params) {
    if (countResults(params.data.results) < this.minimumResultsForSearch) {
      return false;
    }

    return decorated.call(this, params);
  };

  return MinimumResultsForSearch;
});

S2.define('select2/dropdown/selectOnClose',[

], function () {
  function SelectOnClose () { }

  SelectOnClose.prototype.bind = function (decorated, container, $container) {
    var self = this;

    decorated.call(this, container, $container);

    container.on('close', function (params) {
      self._handleSelectOnClose(params);
    });
  };

  SelectOnClose.prototype._handleSelectOnClose = function (_, params) {
    if (params && params.originalSelect2Event != null) {
      var event = params.originalSelect2Event;

      // Don't select an item if the close event was triggered from a select or
      // unselect event
      if (event._type === 'select' || event._type === 'unselect') {
        return;
      }
    }

    var $highlightedResults = this.getHighlightedResults();

    // Only select highlighted results
    if ($highlightedResults.length < 1) {
      return;
    }

    var data = $highlightedResults.data('data');

    // Don't re-select already selected resulte
    if (
      (data.element != null && data.element.selected) ||
      (data.element == null && data.selected)
    ) {
      return;
    }

    this.trigger('select', {
        data: data
    });
  };

  return SelectOnClose;
});

S2.define('select2/dropdown/closeOnSelect',[

], function () {
  function CloseOnSelect () { }

  CloseOnSelect.prototype.bind = function (decorated, container, $container) {
    var self = this;

    decorated.call(this, container, $container);

    container.on('select', function (evt) {
      self._selectTriggered(evt);
    });

    container.on('unselect', function (evt) {
      self._selectTriggered(evt);
    });
  };

  CloseOnSelect.prototype._selectTriggered = function (_, evt) {
    var originalEvent = evt.originalEvent;

    // Don't close if the control key is being held
    if (originalEvent && originalEvent.ctrlKey) {
      return;
    }

    this.trigger('close', {
      originalEvent: originalEvent,
      originalSelect2Event: evt
    });
  };

  return CloseOnSelect;
});

S2.define('select2/i18n/en',[],function () {
  // English
  return {
    errorLoading: function () {
      return 'The results could not be loaded.';
    },
    inputTooLong: function (args) {
      var overChars = args.input.length - args.maximum;

      var message = 'Please delete ' + overChars + ' character';

      if (overChars != 1) {
        message += 's';
      }

      return message;
    },
    inputTooShort: function (args) {
      var remainingChars = args.minimum - args.input.length;

      var message = 'Please enter ' + remainingChars + ' or more characters';

      return message;
    },
    loadingMore: function () {
      return 'Loading more results…';
    },
    maximumSelected: function (args) {
      var message = 'You can only select ' + args.maximum + ' item';

      if (args.maximum != 1) {
        message += 's';
      }

      return message;
    },
    noResults: function () {
      return 'No results found';
    },
    searching: function () {
      return 'Searching…';
    }
  };
});

S2.define('select2/defaults',[
  'jquery',
  'require',

  './results',

  './selection/single',
  './selection/multiple',
  './selection/placeholder',
  './selection/allowClear',
  './selection/search',
  './selection/eventRelay',

  './utils',
  './translation',
  './diacritics',

  './data/select',
  './data/array',
  './data/ajax',
  './data/tags',
  './data/tokenizer',
  './data/minimumInputLength',
  './data/maximumInputLength',
  './data/maximumSelectionLength',

  './dropdown',
  './dropdown/search',
  './dropdown/hidePlaceholder',
  './dropdown/infiniteScroll',
  './dropdown/attachBody',
  './dropdown/minimumResultsForSearch',
  './dropdown/selectOnClose',
  './dropdown/closeOnSelect',

  './i18n/en'
], function ($, require,

             ResultsList,

             SingleSelection, MultipleSelection, Placeholder, AllowClear,
             SelectionSearch, EventRelay,

             Utils, Translation, DIACRITICS,

             SelectData, ArrayData, AjaxData, Tags, Tokenizer,
             MinimumInputLength, MaximumInputLength, MaximumSelectionLength,

             Dropdown, DropdownSearch, HidePlaceholder, InfiniteScroll,
             AttachBody, MinimumResultsForSearch, SelectOnClose, CloseOnSelect,

             EnglishTranslation) {
  function Defaults () {
    this.reset();
  }

  Defaults.prototype.apply = function (options) {
    options = $.extend(true, {}, this.defaults, options);

    if (options.dataAdapter == null) {
      if (options.ajax != null) {
        options.dataAdapter = AjaxData;
      } else if (options.data != null) {
        options.dataAdapter = ArrayData;
      } else {
        options.dataAdapter = SelectData;
      }

      if (options.minimumInputLength > 0) {
        options.dataAdapter = Utils.Decorate(
          options.dataAdapter,
          MinimumInputLength
        );
      }

      if (options.maximumInputLength > 0) {
        options.dataAdapter = Utils.Decorate(
          options.dataAdapter,
          MaximumInputLength
        );
      }

      if (options.maximumSelectionLength > 0) {
        options.dataAdapter = Utils.Decorate(
          options.dataAdapter,
          MaximumSelectionLength
        );
      }

      if (options.tags) {
        options.dataAdapter = Utils.Decorate(options.dataAdapter, Tags);
      }

      if (options.tokenSeparators != null || options.tokenizer != null) {
        options.dataAdapter = Utils.Decorate(
          options.dataAdapter,
          Tokenizer
        );
      }

      if (options.query != null) {
        var Query = require(options.amdBase + 'compat/query');

        options.dataAdapter = Utils.Decorate(
          options.dataAdapter,
          Query
        );
      }

      if (options.initSelection != null) {
        var InitSelection = require(options.amdBase + 'compat/initSelection');

        options.dataAdapter = Utils.Decorate(
          options.dataAdapter,
          InitSelection
        );
      }
    }

    if (options.resultsAdapter == null) {
      options.resultsAdapter = ResultsList;

      if (options.ajax != null) {
        options.resultsAdapter = Utils.Decorate(
          options.resultsAdapter,
          InfiniteScroll
        );
      }

      if (options.placeholder != null) {
        options.resultsAdapter = Utils.Decorate(
          options.resultsAdapter,
          HidePlaceholder
        );
      }

      if (options.selectOnClose) {
        options.resultsAdapter = Utils.Decorate(
          options.resultsAdapter,
          SelectOnClose
        );
      }
    }

    if (options.dropdownAdapter == null) {
      if (options.multiple) {
        options.dropdownAdapter = Dropdown;
      } else {
        var SearchableDropdown = Utils.Decorate(Dropdown, DropdownSearch);

        options.dropdownAdapter = SearchableDropdown;
      }

      if (options.minimumResultsForSearch !== 0) {
        options.dropdownAdapter = Utils.Decorate(
          options.dropdownAdapter,
          MinimumResultsForSearch
        );
      }

      if (options.closeOnSelect) {
        options.dropdownAdapter = Utils.Decorate(
          options.dropdownAdapter,
          CloseOnSelect
        );
      }

      if (
        options.dropdownCssClass != null ||
        options.dropdownCss != null ||
        options.adaptDropdownCssClass != null
      ) {
        var DropdownCSS = require(options.amdBase + 'compat/dropdownCss');

        options.dropdownAdapter = Utils.Decorate(
          options.dropdownAdapter,
          DropdownCSS
        );
      }

      options.dropdownAdapter = Utils.Decorate(
        options.dropdownAdapter,
        AttachBody
      );
    }

    if (options.selectionAdapter == null) {
      if (options.multiple) {
        options.selectionAdapter = MultipleSelection;
      } else {
        options.selectionAdapter = SingleSelection;
      }

      // Add the placeholder mixin if a placeholder was specified
      if (options.placeholder != null) {
        options.selectionAdapter = Utils.Decorate(
          options.selectionAdapter,
          Placeholder
        );
      }

      if (options.allowClear) {
        options.selectionAdapter = Utils.Decorate(
          options.selectionAdapter,
          AllowClear
        );
      }

      if (options.multiple) {
        options.selectionAdapter = Utils.Decorate(
          options.selectionAdapter,
          SelectionSearch
        );
      }

      if (
        options.containerCssClass != null ||
        options.containerCss != null ||
        options.adaptContainerCssClass != null
      ) {
        var ContainerCSS = require(options.amdBase + 'compat/containerCss');

        options.selectionAdapter = Utils.Decorate(
          options.selectionAdapter,
          ContainerCSS
        );
      }

      options.selectionAdapter = Utils.Decorate(
        options.selectionAdapter,
        EventRelay
      );
    }

    if (typeof options.language === 'string') {
      // Check if the language is specified with a region
      if (options.language.indexOf('-') > 0) {
        // Extract the region information if it is included
        var languageParts = options.language.split('-');
        var baseLanguage = languageParts[0];

        options.language = [options.language, baseLanguage];
      } else {
        options.language = [options.language];
      }
    }

    if ($.isArray(options.language)) {
      var languages = new Translation();
      options.language.push('en');

      var languageNames = options.language;

      for (var l = 0; l < languageNames.length; l++) {
        var name = languageNames[l];
        var language = {};

        try {
          // Try to load it with the original name
          language = Translation.loadPath(name);
        } catch (e) {
          try {
            // If we couldn't load it, check if it wasn't the full path
            name = this.defaults.amdLanguageBase + name;
            language = Translation.loadPath(name);
          } catch (ex) {
            // The translation could not be loaded at all. Sometimes this is
            // because of a configuration problem, other times this can be
            // because of how Select2 helps load all possible translation files.
            if (options.debug && window.console && console.warn) {
              console.warn(
                'Select2: The language file for "' + name + '" could not be ' +
                'automatically loaded. A fallback will be used instead.'
              );
            }

            continue;
          }
        }

        languages.extend(language);
      }

      options.translations = languages;
    } else {
      var baseTranslation = Translation.loadPath(
        this.defaults.amdLanguageBase + 'en'
      );
      var customTranslation = new Translation(options.language);

      customTranslation.extend(baseTranslation);

      options.translations = customTranslation;
    }

    return options;
  };

  Defaults.prototype.reset = function () {
    function stripDiacritics (text) {
      // Used 'uni range + named function' from http://jsperf.com/diacritics/18
      function match(a) {
        return DIACRITICS[a] || a;
      }

      return text.replace(/[^\u0000-\u007E]/g, match);
    }

    function matcher (params, data) {
      // Always return the object if there is nothing to compare
      if ($.trim(params.term) === '') {
        return data;
      }

      // Do a recursive check for options with children
      if (data.children && data.children.length > 0) {
        // Clone the data object if there are children
        // This is required as we modify the object to remove any non-matches
        var match = $.extend(true, {}, data);

        // Check each child of the option
        for (var c = data.children.length - 1; c >= 0; c--) {
          var child = data.children[c];

          var matches = matcher(params, child);

          // If there wasn't a match, remove the object in the array
          if (matches == null) {
            match.children.splice(c, 1);
          }
        }

        // If any children matched, return the new object
        if (match.children.length > 0) {
          return match;
        }

        // If there were no matching children, check just the plain object
        return matcher(params, match);
      }

      var original = stripDiacritics(data.text).toUpperCase();
      var term = stripDiacritics(params.term).toUpperCase();

      // Check if the text contains the term
      if (original.indexOf(term) > -1) {
        return data;
      }

      // If it doesn't contain the term, don't return anything
      return null;
    }

    this.defaults = {
      amdBase: './',
      amdLanguageBase: './i18n/',
      closeOnSelect: true,
      debug: false,
      dropdownAutoWidth: false,
      escapeMarkup: Utils.escapeMarkup,
      language: EnglishTranslation,
      matcher: matcher,
      minimumInputLength: 0,
      maximumInputLength: 0,
      maximumSelectionLength: 0,
      minimumResultsForSearch: 0,
      selectOnClose: false,
      sorter: function (data) {
        return data;
      },
      templateResult: function (result) {
        return result.text;
      },
      templateSelection: function (selection) {
        return selection.text;
      },
      theme: 'default',
      width: 'resolve'
    };
  };

  Defaults.prototype.set = function (key, value) {
    var camelKey = $.camelCase(key);

    var data = {};
    data[camelKey] = value;

    var convertedData = Utils._convertData(data);

    $.extend(this.defaults, convertedData);
  };

  var defaults = new Defaults();

  return defaults;
});

S2.define('select2/options',[
  'require',
  'jquery',
  './defaults',
  './utils'
], function (require, $, Defaults, Utils) {
  function Options (options, $element) {
    this.options = options;

    if ($element != null) {
      this.fromElement($element);
    }

    this.options = Defaults.apply(this.options);

    if ($element && $element.is('input')) {
      var InputCompat = require(this.get('amdBase') + 'compat/inputData');

      this.options.dataAdapter = Utils.Decorate(
        this.options.dataAdapter,
        InputCompat
      );
    }
  }

  Options.prototype.fromElement = function ($e) {
    var excludedData = ['select2'];

    if (this.options.multiple == null) {
      this.options.multiple = $e.prop('multiple');
    }

    if (this.options.disabled == null) {
      this.options.disabled = $e.prop('disabled');
    }

    if (this.options.language == null) {
      if ($e.prop('lang')) {
        this.options.language = $e.prop('lang').toLowerCase();
      } else if ($e.closest('[lang]').prop('lang')) {
        this.options.language = $e.closest('[lang]').prop('lang');
      }
    }

    if (this.options.dir == null) {
      if ($e.prop('dir')) {
        this.options.dir = $e.prop('dir');
      } else if ($e.closest('[dir]').prop('dir')) {
        this.options.dir = $e.closest('[dir]').prop('dir');
      } else {
        this.options.dir = 'ltr';
      }
    }

    $e.prop('disabled', this.options.disabled);
    $e.prop('multiple', this.options.multiple);

    if ($e.data('select2Tags')) {
      if (this.options.debug && window.console && console.warn) {
        console.warn(
          'Select2: The `data-select2-tags` attribute has been changed to ' +
          'use the `data-data` and `data-tags="true"` attributes and will be ' +
          'removed in future versions of Select2.'
        );
      }

      $e.data('data', $e.data('select2Tags'));
      $e.data('tags', true);
    }

    if ($e.data('ajaxUrl')) {
      if (this.options.debug && window.console && console.warn) {
        console.warn(
          'Select2: The `data-ajax-url` attribute has been changed to ' +
          '`data-ajax--url` and support for the old attribute will be removed' +
          ' in future versions of Select2.'
        );
      }

      $e.attr('ajax--url', $e.data('ajaxUrl'));
      $e.data('ajax--url', $e.data('ajaxUrl'));
    }

    var dataset = {};

    // Prefer the element's `dataset` attribute if it exists
    // jQuery 1.x does not correctly handle data attributes with multiple dashes
    if ($.fn.jquery && $.fn.jquery.substr(0, 2) == '1.' && $e[0].dataset) {
      dataset = $.extend(true, {}, $e[0].dataset, $e.data());
    } else {
      dataset = $e.data();
    }

    var data = $.extend(true, {}, dataset);

    data = Utils._convertData(data);

    for (var key in data) {
      if ($.inArray(key, excludedData) > -1) {
        continue;
      }

      if ($.isPlainObject(this.options[key])) {
        $.extend(this.options[key], data[key]);
      } else {
        this.options[key] = data[key];
      }
    }

    return this;
  };

  Options.prototype.get = function (key) {
    return this.options[key];
  };

  Options.prototype.set = function (key, val) {
    this.options[key] = val;
  };

  return Options;
});

S2.define('select2/core',[
  'jquery',
  './options',
  './utils',
  './keys'
], function ($, Options, Utils, KEYS) {
  var Select2 = function ($element, options) {
    if ($element.data('select2') != null) {
      $element.data('select2').destroy();
    }

    this.$element = $element;

    this.id = this._generateId($element);

    options = options || {};

    this.options = new Options(options, $element);

    Select2.__super__.constructor.call(this);

    // Set up the tabindex

    var tabindex = $element.attr('tabindex') || 0;
    $element.data('old-tabindex', tabindex);
    $element.attr('tabindex', '-1');

    // Set up containers and adapters

    var DataAdapter = this.options.get('dataAdapter');
    this.dataAdapter = new DataAdapter($element, this.options);

    var $container = this.render();

    this._placeContainer($container);

    var SelectionAdapter = this.options.get('selectionAdapter');
    this.selection = new SelectionAdapter($element, this.options);
    this.$selection = this.selection.render();

    this.selection.position(this.$selection, $container);

    var DropdownAdapter = this.options.get('dropdownAdapter');
    this.dropdown = new DropdownAdapter($element, this.options);
    this.$dropdown = this.dropdown.render();

    this.dropdown.position(this.$dropdown, $container);

    var ResultsAdapter = this.options.get('resultsAdapter');
    this.results = new ResultsAdapter($element, this.options, this.dataAdapter);
    this.$results = this.results.render();

    this.results.position(this.$results, this.$dropdown);

    // Bind events

    var self = this;

    // Bind the container to all of the adapters
    this._bindAdapters();

    // Register any DOM event handlers
    this._registerDomEvents();

    // Register any internal event handlers
    this._registerDataEvents();
    this._registerSelectionEvents();
    this._registerDropdownEvents();
    this._registerResultsEvents();
    this._registerEvents();

    // Set the initial state
    this.dataAdapter.current(function (initialData) {
      self.trigger('selection:update', {
        data: initialData
      });
    });

    // Hide the original select
    $element.addClass('select2-hidden-accessible');
    $element.attr('aria-hidden', 'true');

    // Synchronize any monitored attributes
    this._syncAttributes();

    $element.data('select2', this);
  };

  Utils.Extend(Select2, Utils.Observable);

  Select2.prototype._generateId = function ($element) {
    var id = '';

    if ($element.attr('id') != null) {
      id = $element.attr('id');
    } else if ($element.attr('name') != null) {
      id = $element.attr('name') + '-' + Utils.generateChars(2);
    } else {
      id = Utils.generateChars(4);
    }

    id = id.replace(/(:|\.|\[|\]|,)/g, '');
    id = 'select2-' + id;

    return id;
  };

  Select2.prototype._placeContainer = function ($container) {
    $container.insertAfter(this.$element);

    var width = this._resolveWidth(this.$element, this.options.get('width'));

    if (width != null) {
      $container.css('width', width);
    }
  };

  Select2.prototype._resolveWidth = function ($element, method) {
    var WIDTH = /^width:(([-+]?([0-9]*\.)?[0-9]+)(px|em|ex|%|in|cm|mm|pt|pc))/i;

    if (method == 'resolve') {
      var styleWidth = this._resolveWidth($element, 'style');

      if (styleWidth != null) {
        return styleWidth;
      }

      return this._resolveWidth($element, 'element');
    }

    if (method == 'element') {
      var elementWidth = $element.outerWidth(false);

      if (elementWidth <= 0) {
        return 'auto';
      }

      return elementWidth + 'px';
    }

    if (method == 'style') {
      var style = $element.attr('style');

      if (typeof(style) !== 'string') {
        return null;
      }

      var attrs = style.split(';');

      for (var i = 0, l = attrs.length; i < l; i = i + 1) {
        var attr = attrs[i].replace(/\s/g, '');
        var matches = attr.match(WIDTH);

        if (matches !== null && matches.length >= 1) {
          return matches[1];
        }
      }

      return null;
    }

    return method;
  };

  Select2.prototype._bindAdapters = function () {
    this.dataAdapter.bind(this, this.$container);
    this.selection.bind(this, this.$container);

    this.dropdown.bind(this, this.$container);
    this.results.bind(this, this.$container);
  };

  Select2.prototype._registerDomEvents = function () {
    var self = this;

    this.$element.on('change.select2', function () {
      self.dataAdapter.current(function (data) {
        self.trigger('selection:update', {
          data: data
        });
      });
    });

    this.$element.on('focus.select2', function (evt) {
      self.trigger('focus', evt);
    });

    this._syncA = Utils.bind(this._syncAttributes, this);
    this._syncS = Utils.bind(this._syncSubtree, this);

    if (this.$element[0].attachEvent) {
      this.$element[0].attachEvent('onpropertychange', this._syncA);
    }

    var observer = window.MutationObserver ||
      window.WebKitMutationObserver ||
      window.MozMutationObserver
    ;

    if (observer != null) {
      this._observer = new observer(function (mutations) {
        $.each(mutations, self._syncA);
        $.each(mutations, self._syncS);
      });
      this._observer.observe(this.$element[0], {
        attributes: true,
        childList: true,
        subtree: false
      });
    } else if (this.$element[0].addEventListener) {
      this.$element[0].addEventListener(
        'DOMAttrModified',
        self._syncA,
        false
      );
      this.$element[0].addEventListener(
        'DOMNodeInserted',
        self._syncS,
        false
      );
      this.$element[0].addEventListener(
        'DOMNodeRemoved',
        self._syncS,
        false
      );
    }
  };

  Select2.prototype._registerDataEvents = function () {
    var self = this;

    this.dataAdapter.on('*', function (name, params) {
      self.trigger(name, params);
    });
  };

  Select2.prototype._registerSelectionEvents = function () {
    var self = this;
    var nonRelayEvents = ['toggle', 'focus'];

    this.selection.on('toggle', function () {
      self.toggleDropdown();
    });

    this.selection.on('focus', function (params) {
      self.focus(params);
    });

    this.selection.on('*', function (name, params) {
      if ($.inArray(name, nonRelayEvents) !== -1) {
        return;
      }

      self.trigger(name, params);
    });
  };

  Select2.prototype._registerDropdownEvents = function () {
    var self = this;

    this.dropdown.on('*', function (name, params) {
      self.trigger(name, params);
    });
  };

  Select2.prototype._registerResultsEvents = function () {
    var self = this;

    this.results.on('*', function (name, params) {
      self.trigger(name, params);
    });
  };

  Select2.prototype._registerEvents = function () {
    var self = this;

    this.on('open', function () {
      self.$container.addClass('select2-container--open');
    });

    this.on('close', function () {
      self.$container.removeClass('select2-container--open');
    });

    this.on('enable', function () {
      self.$container.removeClass('select2-container--disabled');
    });

    this.on('disable', function () {
      self.$container.addClass('select2-container--disabled');
    });

    this.on('blur', function () {
      self.$container.removeClass('select2-container--focus');
    });

    this.on('query', function (params) {
      if (!self.isOpen()) {
        self.trigger('open', {});
      }

      this.dataAdapter.query(params, function (data) {
        self.trigger('results:all', {
          data: data,
          query: params
        });
      });
    });

    this.on('query:append', function (params) {
      this.dataAdapter.query(params, function (data) {
        self.trigger('results:append', {
          data: data,
          query: params
        });
      });
    });

    this.on('keypress', function (evt) {
      var key = evt.which;

      if (self.isOpen()) {
        if (key === KEYS.ESC || key === KEYS.TAB ||
            (key === KEYS.UP && evt.altKey)) {
          self.close();

          evt.preventDefault();
        } else if (key === KEYS.ENTER) {
          self.trigger('results:select', {});

          evt.preventDefault();
        } else if ((key === KEYS.SPACE && evt.ctrlKey)) {
          self.trigger('results:toggle', {});

          evt.preventDefault();
        } else if (key === KEYS.UP) {
          self.trigger('results:previous', {});

          evt.preventDefault();
        } else if (key === KEYS.DOWN) {
          self.trigger('results:next', {});

          evt.preventDefault();
        }
      } else {
        if (key === KEYS.ENTER || key === KEYS.SPACE ||
            (key === KEYS.DOWN && evt.altKey)) {
          self.open();

          evt.preventDefault();
        }
      }
    });
  };

  Select2.prototype._syncAttributes = function () {
    this.options.set('disabled', this.$element.prop('disabled'));

    if (this.options.get('disabled')) {
      if (this.isOpen()) {
        this.close();
      }

      this.trigger('disable', {});
    } else {
      this.trigger('enable', {});
    }
  };

  Select2.prototype._syncSubtree = function (evt, mutations) {
    var changed = false;
    var self = this;

    // Ignore any mutation events raised for elements that aren't options or
    // optgroups. This handles the case when the select element is destroyed
    if (
      evt && evt.target && (
        evt.target.nodeName !== 'OPTION' && evt.target.nodeName !== 'OPTGROUP'
      )
    ) {
      return;
    }

    if (!mutations) {
      // If mutation events aren't supported, then we can only assume that the
      // change affected the selections
      changed = true;
    } else if (mutations.addedNodes && mutations.addedNodes.length > 0) {
      for (var n = 0; n < mutations.addedNodes.length; n++) {
        var node = mutations.addedNodes[n];

        if (node.selected) {
          changed = true;
        }
      }
    } else if (mutations.removedNodes && mutations.removedNodes.length > 0) {
      changed = true;
    }

    // Only re-pull the data if we think there is a change
    if (changed) {
      this.dataAdapter.current(function (currentData) {
        self.trigger('selection:update', {
          data: currentData
        });
      });
    }
  };

  /**
   * Override the trigger method to automatically trigger pre-events when
   * there are events that can be prevented.
   */
  Select2.prototype.trigger = function (name, args) {
    var actualTrigger = Select2.__super__.trigger;
    var preTriggerMap = {
      'open': 'opening',
      'close': 'closing',
      'select': 'selecting',
      'unselect': 'unselecting'
    };

    if (args === undefined) {
      args = {};
    }

    if (name in preTriggerMap) {
      var preTriggerName = preTriggerMap[name];
      var preTriggerArgs = {
        prevented: false,
        name: name,
        args: args
      };

      actualTrigger.call(this, preTriggerName, preTriggerArgs);

      if (preTriggerArgs.prevented) {
        args.prevented = true;

        return;
      }
    }

    actualTrigger.call(this, name, args);
  };

  Select2.prototype.toggleDropdown = function () {
    if (this.options.get('disabled')) {
      return;
    }

    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  };

  Select2.prototype.open = function () {
    if (this.isOpen()) {
      return;
    }

    this.trigger('query', {});
  };

  Select2.prototype.close = function () {
    if (!this.isOpen()) {
      return;
    }

    this.trigger('close', {});
  };

  Select2.prototype.isOpen = function () {
    return this.$container.hasClass('select2-container--open');
  };

  Select2.prototype.hasFocus = function () {
    return this.$container.hasClass('select2-container--focus');
  };

  Select2.prototype.focus = function (data) {
    // No need to re-trigger focus events if we are already focused
    if (this.hasFocus()) {
      return;
    }

    this.$container.addClass('select2-container--focus');
    this.trigger('focus', {});
  };

  Select2.prototype.enable = function (args) {
    if (this.options.get('debug') && window.console && console.warn) {
      console.warn(
        'Select2: The `select2("enable")` method has been deprecated and will' +
        ' be removed in later Select2 versions. Use $element.prop("disabled")' +
        ' instead.'
      );
    }

    if (args == null || args.length === 0) {
      args = [true];
    }

    var disabled = !args[0];

    this.$element.prop('disabled', disabled);
  };

  Select2.prototype.data = function () {
    if (this.options.get('debug') &&
        arguments.length > 0 && window.console && console.warn) {
      console.warn(
        'Select2: Data can no longer be set using `select2("data")`. You ' +
        'should consider setting the value instead using `$element.val()`.'
      );
    }

    var data = [];

    this.dataAdapter.current(function (currentData) {
      data = currentData;
    });

    return data;
  };

  Select2.prototype.val = function (args) {
    if (this.options.get('debug') && window.console && console.warn) {
      console.warn(
        'Select2: The `select2("val")` method has been deprecated and will be' +
        ' removed in later Select2 versions. Use $element.val() instead.'
      );
    }

    if (args == null || args.length === 0) {
      return this.$element.val();
    }

    var newVal = args[0];

    if ($.isArray(newVal)) {
      newVal = $.map(newVal, function (obj) {
        return obj.toString();
      });
    }

    this.$element.val(newVal).trigger('change');
  };

  Select2.prototype.destroy = function () {
    this.$container.remove();

    if (this.$element[0].detachEvent) {
      this.$element[0].detachEvent('onpropertychange', this._syncA);
    }

    if (this._observer != null) {
      this._observer.disconnect();
      this._observer = null;
    } else if (this.$element[0].removeEventListener) {
      this.$element[0]
        .removeEventListener('DOMAttrModified', this._syncA, false);
      this.$element[0]
        .removeEventListener('DOMNodeInserted', this._syncS, false);
      this.$element[0]
        .removeEventListener('DOMNodeRemoved', this._syncS, false);
    }

    this._syncA = null;
    this._syncS = null;

    this.$element.off('.select2');
    this.$element.attr('tabindex', this.$element.data('old-tabindex'));

    this.$element.removeClass('select2-hidden-accessible');
    this.$element.attr('aria-hidden', 'false');
    this.$element.removeData('select2');

    this.dataAdapter.destroy();
    this.selection.destroy();
    this.dropdown.destroy();
    this.results.destroy();

    this.dataAdapter = null;
    this.selection = null;
    this.dropdown = null;
    this.results = null;
  };

  Select2.prototype.render = function () {
    var $container = $(
      '<span class="select2 select2-container">' +
        '<span class="selection"></span>' +
        '<span class="dropdown-wrapper" aria-hidden="true"></span>' +
      '</span>'
    );

    $container.attr('dir', this.options.get('dir'));

    this.$container = $container;

    this.$container.addClass('select2-container--' + this.options.get('theme'));

    $container.data('element', this.$element);

    return $container;
  };

  return Select2;
});

S2.define('jquery-mousewheel',[
  'jquery'
], function ($) {
  // Used to shim jQuery.mousewheel for non-full builds.
  return $;
});

S2.define('jquery.select2',[
  'jquery',
  'jquery-mousewheel',

  './select2/core',
  './select2/defaults'
], function ($, _, Select2, Defaults) {
  if ($.fn.select2 == null) {
    // All methods that should return the element
    var thisMethods = ['open', 'close', 'destroy'];

    $.fn.select2 = function (options) {
      options = options || {};

      if (typeof options === 'object') {
        this.each(function () {
          var instanceOptions = $.extend(true, {}, options);

          var instance = new Select2($(this), instanceOptions);
        });

        return this;
      } else if (typeof options === 'string') {
        var ret;
        var args = Array.prototype.slice.call(arguments, 1);

        this.each(function () {
          var instance = $(this).data('select2');

          if (instance == null && window.console && console.error) {
            console.error(
              'The select2(\'' + options + '\') method was called on an ' +
              'element that is not using Select2.'
            );
          }

          ret = instance[options].apply(instance, args);
        });

        // Check if we should be returning `this`
        if ($.inArray(options, thisMethods) > -1) {
          return this;
        }

        return ret;
      } else {
        throw new Error('Invalid arguments for Select2: ' + options);
      }
    };
  }

  if ($.fn.select2.defaults == null) {
    $.fn.select2.defaults = Defaults;
  }

  return Select2;
});

  // Return the AMD loader configuration so it can be used outside of this file
  return {
    define: S2.define,
    require: S2.require
  };
}());

  // Autoload the jQuery bindings
  // We know that all of the modules exist above this, so we're safe
  var select2 = S2.require('jquery.select2');

  // Hold the AMD module references on the jQuery function that was just loaded
  // This allows Select2 to use the internal loader outside of this file, such
  // as in the language files.
  jQuery.fn.select2.amd = S2;

  // Return the Select2 instance for anyone who is importing it.
  return select2;
}));
/*!
 * Datepicker for Bootstrap v1.8.0 (https://github.com/uxsolutions/bootstrap-datepicker)
 *
 * Licensed under the Apache License v2.0 (http://www.apache.org/licenses/LICENSE-2.0)
 */


(function(factory){
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        factory(require('jquery'));
    } else {
        factory(jQuery);
    }
}(function($, undefined){
	function UTCDate(){
		return new Date(Date.UTC.apply(Date, arguments));
	}
	function UTCToday(){
		var today = new Date();
		return UTCDate(today.getFullYear(), today.getMonth(), today.getDate());
	}
	function isUTCEquals(date1, date2) {
		return (
			date1.getUTCFullYear() === date2.getUTCFullYear() &&
			date1.getUTCMonth() === date2.getUTCMonth() &&
			date1.getUTCDate() === date2.getUTCDate()
		);
	}
	function alias(method, deprecationMsg){
		return function(){
			if (deprecationMsg !== undefined) {
				$.fn.datepicker.deprecated(deprecationMsg);
			}

			return this[method].apply(this, arguments);
		};
	}
	function isValidDate(d) {
		return d && !isNaN(d.getTime());
	}

	var DateArray = (function(){
		var extras = {
			get: function(i){
				return this.slice(i)[0];
			},
			contains: function(d){
				// Array.indexOf is not cross-browser;
				// $.inArray doesn't work with Dates
				var val = d && d.valueOf();
				for (var i=0, l=this.length; i < l; i++)
          // Use date arithmetic to allow dates with different times to match
          if (0 <= this[i].valueOf() - val && this[i].valueOf() - val < 1000*60*60*24)
						return i;
				return -1;
			},
			remove: function(i){
				this.splice(i,1);
			},
			replace: function(new_array){
				if (!new_array)
					return;
				if (!$.isArray(new_array))
					new_array = [new_array];
				this.clear();
				this.push.apply(this, new_array);
			},
			clear: function(){
				this.length = 0;
			},
			copy: function(){
				var a = new DateArray();
				a.replace(this);
				return a;
			}
		};

		return function(){
			var a = [];
			a.push.apply(a, arguments);
			$.extend(a, extras);
			return a;
		};
	})();


	// Picker object

	var Datepicker = function(element, options){
		$.data(element, 'datepicker', this);
		this._process_options(options);

		this.dates = new DateArray();
		this.viewDate = this.o.defaultViewDate;
		this.focusDate = null;

		this.element = $(element);
		this.isInput = this.element.is('input');
		this.inputField = this.isInput ? this.element : this.element.find('input');
		this.component = this.element.hasClass('date') ? this.element.find('.add-on, .input-group-addon, .btn') : false;
		if (this.component && this.component.length === 0)
			this.component = false;
		this.isInline = !this.component && this.element.is('div');

		this.picker = $(DPGlobal.template);

		// Checking templates and inserting
		if (this._check_template(this.o.templates.leftArrow)) {
			this.picker.find('.prev').html(this.o.templates.leftArrow);
		}

		if (this._check_template(this.o.templates.rightArrow)) {
			this.picker.find('.next').html(this.o.templates.rightArrow);
		}

		this._buildEvents();
		this._attachEvents();

		if (this.isInline){
			this.picker.addClass('datepicker-inline').appendTo(this.element);
		}
		else {
			this.picker.addClass('datepicker-dropdown dropdown-menu');
		}

		if (this.o.rtl){
			this.picker.addClass('datepicker-rtl');
		}

		if (this.o.calendarWeeks) {
			this.picker.find('.datepicker-days .datepicker-switch, thead .datepicker-title, tfoot .today, tfoot .clear')
				.attr('colspan', function(i, val){
					return Number(val) + 1;
				});
		}

		this._process_options({
			startDate: this._o.startDate,
			endDate: this._o.endDate,
			daysOfWeekDisabled: this.o.daysOfWeekDisabled,
			daysOfWeekHighlighted: this.o.daysOfWeekHighlighted,
			datesDisabled: this.o.datesDisabled
		});

		this._allow_update = false;
		this.setViewMode(this.o.startView);
		this._allow_update = true;

		this.fillDow();
		this.fillMonths();

		this.update();

		if (this.isInline){
			this.show();
		}
	};

	Datepicker.prototype = {
		constructor: Datepicker,

		_resolveViewName: function(view){
			$.each(DPGlobal.viewModes, function(i, viewMode){
				if (view === i || $.inArray(view, viewMode.names) !== -1){
					view = i;
					return false;
				}
			});

			return view;
		},

		_resolveDaysOfWeek: function(daysOfWeek){
			if (!$.isArray(daysOfWeek))
				daysOfWeek = daysOfWeek.split(/[,\s]*/);
			return $.map(daysOfWeek, Number);
		},

		_check_template: function(tmp){
			try {
				// If empty
				if (tmp === undefined || tmp === "") {
					return false;
				}
				// If no html, everything ok
				if ((tmp.match(/[<>]/g) || []).length <= 0) {
					return true;
				}
				// Checking if html is fine
				var jDom = $(tmp);
				return jDom.length > 0;
			}
			catch (ex) {
				return false;
			}
		},

		_process_options: function(opts){
			// Store raw options for reference
			this._o = $.extend({}, this._o, opts);
			// Processed options
			var o = this.o = $.extend({}, this._o);

			// Check if "de-DE" style date is available, if not language should
			// fallback to 2 letter code eg "de"
			var lang = o.language;
			if (!dates[lang]){
				lang = lang.split('-')[0];
				if (!dates[lang])
					lang = defaults.language;
			}
			o.language = lang;

			// Retrieve view index from any aliases
			o.startView = this._resolveViewName(o.startView);
			o.minViewMode = this._resolveViewName(o.minViewMode);
			o.maxViewMode = this._resolveViewName(o.maxViewMode);

			// Check view is between min and max
			o.startView = Math.max(this.o.minViewMode, Math.min(this.o.maxViewMode, o.startView));

			// true, false, or Number > 0
			if (o.multidate !== true){
				o.multidate = Number(o.multidate) || false;
				if (o.multidate !== false)
					o.multidate = Math.max(0, o.multidate);
			}
			o.multidateSeparator = String(o.multidateSeparator);

			o.weekStart %= 7;
			o.weekEnd = (o.weekStart + 6) % 7;

			var format = DPGlobal.parseFormat(o.format);
			if (o.startDate !== -Infinity){
				if (!!o.startDate){
					if (o.startDate instanceof Date)
						o.startDate = this._local_to_utc(this._zero_time(o.startDate));
					else
						o.startDate = DPGlobal.parseDate(o.startDate, format, o.language, o.assumeNearbyYear);
				}
				else {
					o.startDate = -Infinity;
				}
			}
			if (o.endDate !== Infinity){
				if (!!o.endDate){
					if (o.endDate instanceof Date)
						o.endDate = this._local_to_utc(this._zero_time(o.endDate));
					else
						o.endDate = DPGlobal.parseDate(o.endDate, format, o.language, o.assumeNearbyYear);
				}
				else {
					o.endDate = Infinity;
				}
			}

			o.daysOfWeekDisabled = this._resolveDaysOfWeek(o.daysOfWeekDisabled||[]);
			o.daysOfWeekHighlighted = this._resolveDaysOfWeek(o.daysOfWeekHighlighted||[]);

			o.datesDisabled = o.datesDisabled||[];
			if (!$.isArray(o.datesDisabled)) {
				o.datesDisabled = o.datesDisabled.split(',');
			}
			o.datesDisabled = $.map(o.datesDisabled, function(d){
				return DPGlobal.parseDate(d, format, o.language, o.assumeNearbyYear);
			});

			var plc = String(o.orientation).toLowerCase().split(/\s+/g),
				_plc = o.orientation.toLowerCase();
			plc = $.grep(plc, function(word){
				return /^auto|left|right|top|bottom$/.test(word);
			});
			o.orientation = {x: 'auto', y: 'auto'};
			if (!_plc || _plc === 'auto')
				; // no action
			else if (plc.length === 1){
				switch (plc[0]){
					case 'top':
					case 'bottom':
						o.orientation.y = plc[0];
						break;
					case 'left':
					case 'right':
						o.orientation.x = plc[0];
						break;
				}
			}
			else {
				_plc = $.grep(plc, function(word){
					return /^left|right$/.test(word);
				});
				o.orientation.x = _plc[0] || 'auto';

				_plc = $.grep(plc, function(word){
					return /^top|bottom$/.test(word);
				});
				o.orientation.y = _plc[0] || 'auto';
			}
			if (o.defaultViewDate instanceof Date || typeof o.defaultViewDate === 'string') {
				o.defaultViewDate = DPGlobal.parseDate(o.defaultViewDate, format, o.language, o.assumeNearbyYear);
			} else if (o.defaultViewDate) {
				var year = o.defaultViewDate.year || new Date().getFullYear();
				var month = o.defaultViewDate.month || 0;
				var day = o.defaultViewDate.day || 1;
				o.defaultViewDate = UTCDate(year, month, day);
			} else {
				o.defaultViewDate = UTCToday();
			}
		},
		_events: [],
		_secondaryEvents: [],
		_applyEvents: function(evs){
			for (var i=0, el, ch, ev; i < evs.length; i++){
				el = evs[i][0];
				if (evs[i].length === 2){
					ch = undefined;
					ev = evs[i][1];
				} else if (evs[i].length === 3){
					ch = evs[i][1];
					ev = evs[i][2];
				}
				el.on(ev, ch);
			}
		},
		_unapplyEvents: function(evs){
			for (var i=0, el, ev, ch; i < evs.length; i++){
				el = evs[i][0];
				if (evs[i].length === 2){
					ch = undefined;
					ev = evs[i][1];
				} else if (evs[i].length === 3){
					ch = evs[i][1];
					ev = evs[i][2];
				}
				el.off(ev, ch);
			}
		},
		_buildEvents: function(){
            var events = {
                keyup: $.proxy(function(e){
                    if ($.inArray(e.keyCode, [27, 37, 39, 38, 40, 32, 13, 9]) === -1)
                        this.update();
                }, this),
                keydown: $.proxy(this.keydown, this),
                paste: $.proxy(this.paste, this)
            };

            if (this.o.showOnFocus === true) {
                events.focus = $.proxy(this.show, this);
            }

            if (this.isInput) { // single input
                this._events = [
                    [this.element, events]
                ];
            }
            // component: input + button
            else if (this.component && this.inputField.length) {
                this._events = [
                    // For components that are not readonly, allow keyboard nav
                    [this.inputField, events],
                    [this.component, {
                        click: $.proxy(this.show, this)
                    }]
                ];
            }
			else {
				this._events = [
					[this.element, {
						click: $.proxy(this.show, this),
						keydown: $.proxy(this.keydown, this)
					}]
				];
			}
			this._events.push(
				// Component: listen for blur on element descendants
				[this.element, '*', {
					blur: $.proxy(function(e){
						this._focused_from = e.target;
					}, this)
				}],
				// Input: listen for blur on element
				[this.element, {
					blur: $.proxy(function(e){
						this._focused_from = e.target;
					}, this)
				}]
			);

			if (this.o.immediateUpdates) {
				// Trigger input updates immediately on changed year/month
				this._events.push([this.element, {
					'changeYear changeMonth': $.proxy(function(e){
						this.update(e.date);
					}, this)
				}]);
			}

			this._secondaryEvents = [
				[this.picker, {
					click: $.proxy(this.click, this)
				}],
				[this.picker, '.prev, .next', {
					click: $.proxy(this.navArrowsClick, this)
				}],
				[this.picker, '.day:not(.disabled)', {
					click: $.proxy(this.dayCellClick, this)
				}],
				[$(window), {
					resize: $.proxy(this.place, this)
				}],
				[$(document), {
					'mousedown touchstart': $.proxy(function(e){
						// Clicked outside the datepicker, hide it
						if (!(
							this.element.is(e.target) ||
							this.element.find(e.target).length ||
							this.picker.is(e.target) ||
							this.picker.find(e.target).length ||
							this.isInline
						)){
							this.hide();
						}
					}, this)
				}]
			];
		},
		_attachEvents: function(){
			this._detachEvents();
			this._applyEvents(this._events);
		},
		_detachEvents: function(){
			this._unapplyEvents(this._events);
		},
		_attachSecondaryEvents: function(){
			this._detachSecondaryEvents();
			this._applyEvents(this._secondaryEvents);
		},
		_detachSecondaryEvents: function(){
			this._unapplyEvents(this._secondaryEvents);
		},
		_trigger: function(event, altdate){
			var date = altdate || this.dates.get(-1),
				local_date = this._utc_to_local(date);

			this.element.trigger({
				type: event,
				date: local_date,
				viewMode: this.viewMode,
				dates: $.map(this.dates, this._utc_to_local),
				format: $.proxy(function(ix, format){
					if (arguments.length === 0){
						ix = this.dates.length - 1;
						format = this.o.format;
					} else if (typeof ix === 'string'){
						format = ix;
						ix = this.dates.length - 1;
					}
					format = format || this.o.format;
					var date = this.dates.get(ix);
					return DPGlobal.formatDate(date, format, this.o.language);
				}, this)
			});
		},

		show: function(){
			if (this.inputField.prop('disabled') || (this.inputField.prop('readonly') && this.o.enableOnReadonly === false))
				return;
			if (!this.isInline)
				this.picker.appendTo(this.o.container);
			this.place();
			this.picker.show();
			this._attachSecondaryEvents();
			this._trigger('show');
			if ((window.navigator.msMaxTouchPoints || 'ontouchstart' in document) && this.o.disableTouchKeyboard) {
				$(this.element).blur();
			}
			return this;
		},

		hide: function(){
			if (this.isInline || !this.picker.is(':visible'))
				return this;
			this.focusDate = null;
			this.picker.hide().detach();
			this._detachSecondaryEvents();
			this.setViewMode(this.o.startView);

			if (this.o.forceParse && this.inputField.val())
				this.setValue();
			this._trigger('hide');
			return this;
		},

		destroy: function(){
			this.hide();
			this._detachEvents();
			this._detachSecondaryEvents();
			this.picker.remove();
			delete this.element.data().datepicker;
			if (!this.isInput){
				delete this.element.data().date;
			}
			return this;
		},

		paste: function(e){
			var dateString;
			if (e.originalEvent.clipboardData && e.originalEvent.clipboardData.types
				&& $.inArray('text/plain', e.originalEvent.clipboardData.types) !== -1) {
				dateString = e.originalEvent.clipboardData.getData('text/plain');
			} else if (window.clipboardData) {
				dateString = window.clipboardData.getData('Text');
			} else {
				return;
			}
			this.setDate(dateString);
			this.update();
			e.preventDefault();
		},

		_utc_to_local: function(utc){
			if (!utc) {
				return utc;
			}

			var local = new Date(utc.getTime() + (utc.getTimezoneOffset() * 60000));

			if (local.getTimezoneOffset() !== utc.getTimezoneOffset()) {
				local = new Date(utc.getTime() + (local.getTimezoneOffset() * 60000));
			}

			return local;
		},
		_local_to_utc: function(local){
			return local && new Date(local.getTime() - (local.getTimezoneOffset()*60000));
		},
		_zero_time: function(local){
			return local && new Date(local.getFullYear(), local.getMonth(), local.getDate());
		},
		_zero_utc_time: function(utc){
			return utc && UTCDate(utc.getUTCFullYear(), utc.getUTCMonth(), utc.getUTCDate());
		},

		getDates: function(){
			return $.map(this.dates, this._utc_to_local);
		},

		getUTCDates: function(){
			return $.map(this.dates, function(d){
				return new Date(d);
			});
		},

		getDate: function(){
			return this._utc_to_local(this.getUTCDate());
		},

		getUTCDate: function(){
			var selected_date = this.dates.get(-1);
			if (selected_date !== undefined) {
				return new Date(selected_date);
			} else {
				return null;
			}
		},

		clearDates: function(){
			this.inputField.val('');
			this.update();
			this._trigger('changeDate');

			if (this.o.autoclose) {
				this.hide();
			}
		},

		setDates: function(){
			var args = $.isArray(arguments[0]) ? arguments[0] : arguments;
			this.update.apply(this, args);
			this._trigger('changeDate');
			this.setValue();
			return this;
		},

		setUTCDates: function(){
			var args = $.isArray(arguments[0]) ? arguments[0] : arguments;
			this.setDates.apply(this, $.map(args, this._utc_to_local));
			return this;
		},

		setDate: alias('setDates'),
		setUTCDate: alias('setUTCDates'),
		remove: alias('destroy', 'Method `remove` is deprecated and will be removed in version 2.0. Use `destroy` instead'),

		setValue: function(){
			var formatted = this.getFormattedDate();
			this.inputField.val(formatted);
			return this;
		},

		getFormattedDate: function(format){
			if (format === undefined)
				format = this.o.format;

			var lang = this.o.language;
			return $.map(this.dates, function(d){
				return DPGlobal.formatDate(d, format, lang);
			}).join(this.o.multidateSeparator);
		},

		getStartDate: function(){
			return this.o.startDate;
		},

		setStartDate: function(startDate){
			this._process_options({startDate: startDate});
			this.update();
			this.updateNavArrows();
			return this;
		},

		getEndDate: function(){
			return this.o.endDate;
		},

		setEndDate: function(endDate){
			this._process_options({endDate: endDate});
			this.update();
			this.updateNavArrows();
			return this;
		},

		setDaysOfWeekDisabled: function(daysOfWeekDisabled){
			this._process_options({daysOfWeekDisabled: daysOfWeekDisabled});
			this.update();
			return this;
		},

		setDaysOfWeekHighlighted: function(daysOfWeekHighlighted){
			this._process_options({daysOfWeekHighlighted: daysOfWeekHighlighted});
			this.update();
			return this;
		},

		setDatesDisabled: function(datesDisabled){
			this._process_options({datesDisabled: datesDisabled});
			this.update();
			return this;
		},

		place: function(){
			if (this.isInline)
				return this;
			var calendarWidth = this.picker.outerWidth(),
				calendarHeight = this.picker.outerHeight(),
				visualPadding = 10,
				container = $(this.o.container),
				windowWidth = container.width(),
				scrollTop = this.o.container === 'body' ? $(document).scrollTop() : container.scrollTop(),
				appendOffset = container.offset();

			var parentsZindex = [0];
			this.element.parents().each(function(){
				var itemZIndex = $(this).css('z-index');
				if (itemZIndex !== 'auto' && Number(itemZIndex) !== 0) parentsZindex.push(Number(itemZIndex));
			});
			var zIndex = Math.max.apply(Math, parentsZindex) + this.o.zIndexOffset;
			var offset = this.component ? this.component.parent().offset() : this.element.offset();
			var height = this.component ? this.component.outerHeight(true) : this.element.outerHeight(false);
			var width = this.component ? this.component.outerWidth(true) : this.element.outerWidth(false);
			var left = offset.left - appendOffset.left;
			var top = offset.top - appendOffset.top;

			if (this.o.container !== 'body') {
				top += scrollTop;
			}

			this.picker.removeClass(
				'datepicker-orient-top datepicker-orient-bottom '+
				'datepicker-orient-right datepicker-orient-left'
			);

			if (this.o.orientation.x !== 'auto'){
				this.picker.addClass('datepicker-orient-' + this.o.orientation.x);
				if (this.o.orientation.x === 'right')
					left -= calendarWidth - width;
			}
			// auto x orientation is best-placement: if it crosses a window
			// edge, fudge it sideways
			else {
				if (offset.left < 0) {
					// component is outside the window on the left side. Move it into visible range
					this.picker.addClass('datepicker-orient-left');
					left -= offset.left - visualPadding;
				} else if (left + calendarWidth > windowWidth) {
					// the calendar passes the widow right edge. Align it to component right side
					this.picker.addClass('datepicker-orient-right');
					left += width - calendarWidth;
				} else {
					if (this.o.rtl) {
						// Default to right
						this.picker.addClass('datepicker-orient-right');
					} else {
						// Default to left
						this.picker.addClass('datepicker-orient-left');
					}
				}
			}

			// auto y orientation is best-situation: top or bottom, no fudging,
			// decision based on which shows more of the calendar
			var yorient = this.o.orientation.y,
				top_overflow;
			if (yorient === 'auto'){
				top_overflow = -scrollTop + top - calendarHeight;
				yorient = top_overflow < 0 ? 'bottom' : 'top';
			}

			this.picker.addClass('datepicker-orient-' + yorient);
			if (yorient === 'top')
				top -= calendarHeight + parseInt(this.picker.css('padding-top'));
			else
				top += height;

			if (this.o.rtl) {
				var right = windowWidth - (left + width);
				this.picker.css({
					top: top,
					right: right,
					zIndex: zIndex
				});
			} else {
				this.picker.css({
					top: top,
					left: left,
					zIndex: zIndex
				});
			}
			return this;
		},

		_allow_update: true,
		update: function(){
			if (!this._allow_update)
				return this;

			var oldDates = this.dates.copy(),
				dates = [],
				fromArgs = false;
			if (arguments.length){
				$.each(arguments, $.proxy(function(i, date){
					if (date instanceof Date)
						date = this._local_to_utc(date);
					dates.push(date);
				}, this));
				fromArgs = true;
			} else {
				dates = this.isInput
						? this.element.val()
						: this.element.data('date') || this.inputField.val();
				if (dates && this.o.multidate)
					dates = dates.split(this.o.multidateSeparator);
				else
					dates = [dates];
				delete this.element.data().date;
			}

			dates = $.map(dates, $.proxy(function(date){
				return DPGlobal.parseDate(date, this.o.format, this.o.language, this.o.assumeNearbyYear);
			}, this));
			dates = $.grep(dates, $.proxy(function(date){
				return (
					!this.dateWithinRange(date) ||
					!date
				);
			}, this), true);
			this.dates.replace(dates);

			if (this.o.updateViewDate) {
				if (this.dates.length)
					this.viewDate = new Date(this.dates.get(-1));
				else if (this.viewDate < this.o.startDate)
					this.viewDate = new Date(this.o.startDate);
				else if (this.viewDate > this.o.endDate)
					this.viewDate = new Date(this.o.endDate);
				else
					this.viewDate = this.o.defaultViewDate;
			}

			if (fromArgs){
				// setting date by clicking
				this.setValue();
				this.element.change();
			}
			else if (this.dates.length){
				// setting date by typing
				if (String(oldDates) !== String(this.dates) && fromArgs) {
					this._trigger('changeDate');
					this.element.change();
				}
			}
			if (!this.dates.length && oldDates.length) {
				this._trigger('clearDate');
				this.element.change();
			}

			this.fill();
			return this;
		},

		fillDow: function(){
      if (this.o.showWeekDays) {
			var dowCnt = this.o.weekStart,
				html = '<tr>';
			if (this.o.calendarWeeks){
				html += '<th class="cw">&#160;</th>';
			}
			while (dowCnt < this.o.weekStart + 7){
				html += '<th class="dow';
        if ($.inArray(dowCnt, this.o.daysOfWeekDisabled) !== -1)
          html += ' disabled';
        html += '">'+dates[this.o.language].daysMin[(dowCnt++)%7]+'</th>';
			}
			html += '</tr>';
			this.picker.find('.datepicker-days thead').append(html);
      }
		},

		fillMonths: function(){
      var localDate = this._utc_to_local(this.viewDate);
			var html = '';
			var focused;
			for (var i = 0; i < 12; i++){
				focused = localDate && localDate.getMonth() === i ? ' focused' : '';
				html += '<span class="month' + focused + '">' + dates[this.o.language].monthsShort[i] + '</span>';
			}
			this.picker.find('.datepicker-months td').html(html);
		},

		setRange: function(range){
			if (!range || !range.length)
				delete this.range;
			else
				this.range = $.map(range, function(d){
					return d.valueOf();
				});
			this.fill();
		},

		getClassNames: function(date){
			var cls = [],
				year = this.viewDate.getUTCFullYear(),
				month = this.viewDate.getUTCMonth(),
				today = UTCToday();
			if (date.getUTCFullYear() < year || (date.getUTCFullYear() === year && date.getUTCMonth() < month)){
				cls.push('old');
			} else if (date.getUTCFullYear() > year || (date.getUTCFullYear() === year && date.getUTCMonth() > month)){
				cls.push('new');
			}
			if (this.focusDate && date.valueOf() === this.focusDate.valueOf())
				cls.push('focused');
			// Compare internal UTC date with UTC today, not local today
			if (this.o.todayHighlight && isUTCEquals(date, today)) {
				cls.push('today');
			}
			if (this.dates.contains(date) !== -1)
				cls.push('active');
			if (!this.dateWithinRange(date)){
				cls.push('disabled');
			}
			if (this.dateIsDisabled(date)){
				cls.push('disabled', 'disabled-date');
			}
			if ($.inArray(date.getUTCDay(), this.o.daysOfWeekHighlighted) !== -1){
				cls.push('highlighted');
			}

			if (this.range){
				if (date > this.range[0] && date < this.range[this.range.length-1]){
					cls.push('range');
				}
				if ($.inArray(date.valueOf(), this.range) !== -1){
					cls.push('selected');
				}
				if (date.valueOf() === this.range[0]){
          cls.push('range-start');
        }
        if (date.valueOf() === this.range[this.range.length-1]){
          cls.push('range-end');
        }
			}
			return cls;
		},

		_fill_yearsView: function(selector, cssClass, factor, year, startYear, endYear, beforeFn){
			var html = '';
			var step = factor / 10;
			var view = this.picker.find(selector);
			var startVal = Math.floor(year / factor) * factor;
			var endVal = startVal + step * 9;
			var focusedVal = Math.floor(this.viewDate.getFullYear() / step) * step;
			var selected = $.map(this.dates, function(d){
				return Math.floor(d.getUTCFullYear() / step) * step;
			});

			var classes, tooltip, before;
			for (var currVal = startVal - step; currVal <= endVal + step; currVal += step) {
				classes = [cssClass];
				tooltip = null;

				if (currVal === startVal - step) {
					classes.push('old');
				} else if (currVal === endVal + step) {
					classes.push('new');
				}
				if ($.inArray(currVal, selected) !== -1) {
					classes.push('active');
				}
				if (currVal < startYear || currVal > endYear) {
					classes.push('disabled');
				}
				if (currVal === focusedVal) {
				  classes.push('focused');
        }

				if (beforeFn !== $.noop) {
					before = beforeFn(new Date(currVal, 0, 1));
					if (before === undefined) {
						before = {};
					} else if (typeof before === 'boolean') {
						before = {enabled: before};
					} else if (typeof before === 'string') {
						before = {classes: before};
					}
					if (before.enabled === false) {
						classes.push('disabled');
					}
					if (before.classes) {
						classes = classes.concat(before.classes.split(/\s+/));
					}
					if (before.tooltip) {
						tooltip = before.tooltip;
					}
				}

				html += '<span class="' + classes.join(' ') + '"' + (tooltip ? ' title="' + tooltip + '"' : '') + '>' + currVal + '</span>';
			}

			view.find('.datepicker-switch').text(startVal + '-' + endVal);
			view.find('td').html(html);
		},

		fill: function(){
			var d = new Date(this.viewDate),
				year = d.getUTCFullYear(),
				month = d.getUTCMonth(),
				startYear = this.o.startDate !== -Infinity ? this.o.startDate.getUTCFullYear() : -Infinity,
				startMonth = this.o.startDate !== -Infinity ? this.o.startDate.getUTCMonth() : -Infinity,
				endYear = this.o.endDate !== Infinity ? this.o.endDate.getUTCFullYear() : Infinity,
				endMonth = this.o.endDate !== Infinity ? this.o.endDate.getUTCMonth() : Infinity,
				todaytxt = dates[this.o.language].today || dates['en'].today || '',
				cleartxt = dates[this.o.language].clear || dates['en'].clear || '',
				titleFormat = dates[this.o.language].titleFormat || dates['en'].titleFormat,
				tooltip,
				before;
			if (isNaN(year) || isNaN(month))
				return;
			this.picker.find('.datepicker-days .datepicker-switch')
						.text(DPGlobal.formatDate(d, titleFormat, this.o.language));
			this.picker.find('tfoot .today')
						.text(todaytxt)
						.css('display', this.o.todayBtn === true || this.o.todayBtn === 'linked' ? 'table-cell' : 'none');
			this.picker.find('tfoot .clear')
						.text(cleartxt)
						.css('display', this.o.clearBtn === true ? 'table-cell' : 'none');
			this.picker.find('thead .datepicker-title')
						.text(this.o.title)
						.css('display', typeof this.o.title === 'string' && this.o.title !== '' ? 'table-cell' : 'none');
			this.updateNavArrows();
			this.fillMonths();
			var prevMonth = UTCDate(year, month, 0),
				day = prevMonth.getUTCDate();
			prevMonth.setUTCDate(day - (prevMonth.getUTCDay() - this.o.weekStart + 7)%7);
			var nextMonth = new Date(prevMonth);
			if (prevMonth.getUTCFullYear() < 100){
        nextMonth.setUTCFullYear(prevMonth.getUTCFullYear());
      }
			nextMonth.setUTCDate(nextMonth.getUTCDate() + 42);
			nextMonth = nextMonth.valueOf();
			var html = [];
			var weekDay, clsName;
			while (prevMonth.valueOf() < nextMonth){
				weekDay = prevMonth.getUTCDay();
				if (weekDay === this.o.weekStart){
					html.push('<tr>');
					if (this.o.calendarWeeks){
						// ISO 8601: First week contains first thursday.
						// ISO also states week starts on Monday, but we can be more abstract here.
						var
							// Start of current week: based on weekstart/current date
							ws = new Date(+prevMonth + (this.o.weekStart - weekDay - 7) % 7 * 864e5),
							// Thursday of this week
							th = new Date(Number(ws) + (7 + 4 - ws.getUTCDay()) % 7 * 864e5),
							// First Thursday of year, year from thursday
							yth = new Date(Number(yth = UTCDate(th.getUTCFullYear(), 0, 1)) + (7 + 4 - yth.getUTCDay()) % 7 * 864e5),
							// Calendar week: ms between thursdays, div ms per day, div 7 days
							calWeek = (th - yth) / 864e5 / 7 + 1;
						html.push('<td class="cw">'+ calWeek +'</td>');
					}
				}
				clsName = this.getClassNames(prevMonth);
				clsName.push('day');

				var content = prevMonth.getUTCDate();

				if (this.o.beforeShowDay !== $.noop){
					before = this.o.beforeShowDay(this._utc_to_local(prevMonth));
					if (before === undefined)
						before = {};
					else if (typeof before === 'boolean')
						before = {enabled: before};
					else if (typeof before === 'string')
						before = {classes: before};
					if (before.enabled === false)
						clsName.push('disabled');
					if (before.classes)
						clsName = clsName.concat(before.classes.split(/\s+/));
					if (before.tooltip)
						tooltip = before.tooltip;
					if (before.content)
						content = before.content;
				}

				//Check if uniqueSort exists (supported by jquery >=1.12 and >=2.2)
				//Fallback to unique function for older jquery versions
				if ($.isFunction($.uniqueSort)) {
					clsName = $.uniqueSort(clsName);
				} else {
					clsName = $.unique(clsName);
				}

				html.push('<td class="'+clsName.join(' ')+'"' + (tooltip ? ' title="'+tooltip+'"' : '') + ' data-date="' + prevMonth.getTime().toString() + '">' + content + '</td>');
				tooltip = null;
				if (weekDay === this.o.weekEnd){
					html.push('</tr>');
				}
				prevMonth.setUTCDate(prevMonth.getUTCDate() + 1);
			}
			this.picker.find('.datepicker-days tbody').html(html.join(''));

			var monthsTitle = dates[this.o.language].monthsTitle || dates['en'].monthsTitle || 'Months';
			var months = this.picker.find('.datepicker-months')
						.find('.datepicker-switch')
							.text(this.o.maxViewMode < 2 ? monthsTitle : year)
							.end()
						.find('tbody span').removeClass('active');

			$.each(this.dates, function(i, d){
				if (d.getUTCFullYear() === year)
					months.eq(d.getUTCMonth()).addClass('active');
			});

			if (year < startYear || year > endYear){
				months.addClass('disabled');
			}
			if (year === startYear){
				months.slice(0, startMonth).addClass('disabled');
			}
			if (year === endYear){
				months.slice(endMonth+1).addClass('disabled');
			}

			if (this.o.beforeShowMonth !== $.noop){
				var that = this;
				$.each(months, function(i, month){
          var moDate = new Date(year, i, 1);
          var before = that.o.beforeShowMonth(moDate);
					if (before === undefined)
						before = {};
					else if (typeof before === 'boolean')
						before = {enabled: before};
					else if (typeof before === 'string')
						before = {classes: before};
					if (before.enabled === false && !$(month).hasClass('disabled'))
					    $(month).addClass('disabled');
					if (before.classes)
					    $(month).addClass(before.classes);
					if (before.tooltip)
					    $(month).prop('title', before.tooltip);
				});
			}

			// Generating decade/years picker
			this._fill_yearsView(
				'.datepicker-years',
				'year',
				10,
				year,
				startYear,
				endYear,
				this.o.beforeShowYear
			);

			// Generating century/decades picker
			this._fill_yearsView(
				'.datepicker-decades',
				'decade',
				100,
				year,
				startYear,
				endYear,
				this.o.beforeShowDecade
			);

			// Generating millennium/centuries picker
			this._fill_yearsView(
				'.datepicker-centuries',
				'century',
				1000,
				year,
				startYear,
				endYear,
				this.o.beforeShowCentury
			);
		},

		updateNavArrows: function(){
			if (!this._allow_update)
				return;

			var d = new Date(this.viewDate),
				year = d.getUTCFullYear(),
				month = d.getUTCMonth(),
				startYear = this.o.startDate !== -Infinity ? this.o.startDate.getUTCFullYear() : -Infinity,
				startMonth = this.o.startDate !== -Infinity ? this.o.startDate.getUTCMonth() : -Infinity,
				endYear = this.o.endDate !== Infinity ? this.o.endDate.getUTCFullYear() : Infinity,
				endMonth = this.o.endDate !== Infinity ? this.o.endDate.getUTCMonth() : Infinity,
				prevIsDisabled,
				nextIsDisabled,
				factor = 1;
			switch (this.viewMode){
				case 4:
					factor *= 10;
					/* falls through */
				case 3:
					factor *= 10;
					/* falls through */
				case 2:
					factor *= 10;
					/* falls through */
				case 1:
					prevIsDisabled = Math.floor(year / factor) * factor < startYear;
					nextIsDisabled = Math.floor(year / factor) * factor + factor > endYear;
					break;
				case 0:
					prevIsDisabled = year <= startYear && month < startMonth;
					nextIsDisabled = year >= endYear && month > endMonth;
					break;
			}

			this.picker.find('.prev').toggleClass('disabled', prevIsDisabled);
			this.picker.find('.next').toggleClass('disabled', nextIsDisabled);
		},

		click: function(e){
			e.preventDefault();
			e.stopPropagation();

			var target, dir, day, year, month;
			target = $(e.target);

			// Clicked on the switch
			if (target.hasClass('datepicker-switch') && this.viewMode !== this.o.maxViewMode){
				this.setViewMode(this.viewMode + 1);
			}

			// Clicked on today button
			if (target.hasClass('today') && !target.hasClass('day')){
				this.setViewMode(0);
				this._setDate(UTCToday(), this.o.todayBtn === 'linked' ? null : 'view');
			}

			// Clicked on clear button
			if (target.hasClass('clear')){
				this.clearDates();
			}

			if (!target.hasClass('disabled')){
				// Clicked on a month, year, decade, century
				if (target.hasClass('month')
						|| target.hasClass('year')
						|| target.hasClass('decade')
						|| target.hasClass('century')) {
					this.viewDate.setUTCDate(1);

					day = 1;
					if (this.viewMode === 1){
						month = target.parent().find('span').index(target);
						year = this.viewDate.getUTCFullYear();
						this.viewDate.setUTCMonth(month);
					} else {
						month = 0;
						year = Number(target.text());
						this.viewDate.setUTCFullYear(year);
					}

					this._trigger(DPGlobal.viewModes[this.viewMode - 1].e, this.viewDate);

					if (this.viewMode === this.o.minViewMode){
						this._setDate(UTCDate(year, month, day));
					} else {
						this.setViewMode(this.viewMode - 1);
						this.fill();
					}
				}
			}

			if (this.picker.is(':visible') && this._focused_from){
				this._focused_from.focus();
			}
			delete this._focused_from;
		},

		dayCellClick: function(e){
			var $target = $(e.currentTarget);
			var timestamp = $target.data('date');
			var date = new Date(timestamp);

			if (this.o.updateViewDate) {
				if (date.getUTCFullYear() !== this.viewDate.getUTCFullYear()) {
					this._trigger('changeYear', this.viewDate);
				}

				if (date.getUTCMonth() !== this.viewDate.getUTCMonth()) {
					this._trigger('changeMonth', this.viewDate);
				}
			}
			this._setDate(date);
		},

		// Clicked on prev or next
		navArrowsClick: function(e){
			var $target = $(e.currentTarget);
			var dir = $target.hasClass('prev') ? -1 : 1;
			if (this.viewMode !== 0){
				dir *= DPGlobal.viewModes[this.viewMode].navStep * 12;
			}
			this.viewDate = this.moveMonth(this.viewDate, dir);
			this._trigger(DPGlobal.viewModes[this.viewMode].e, this.viewDate);
			this.fill();
		},

		_toggle_multidate: function(date){
			var ix = this.dates.contains(date);
			if (!date){
				this.dates.clear();
			}

			if (ix !== -1){
				if (this.o.multidate === true || this.o.multidate > 1 || this.o.toggleActive){
					this.dates.remove(ix);
				}
			} else if (this.o.multidate === false) {
				this.dates.clear();
				this.dates.push(date);
			}
			else {
				this.dates.push(date);
			}

			if (typeof this.o.multidate === 'number')
				while (this.dates.length > this.o.multidate)
					this.dates.remove(0);
		},

		_setDate: function(date, which){
			if (!which || which === 'date')
				this._toggle_multidate(date && new Date(date));
			if ((!which && this.o.updateViewDate) || which === 'view')
				this.viewDate = date && new Date(date);

			this.fill();
			this.setValue();
			if (!which || which !== 'view') {
				this._trigger('changeDate');
			}
			this.inputField.trigger('change');
			if (this.o.autoclose && (!which || which === 'date')){
				this.hide();
			}
		},

		moveDay: function(date, dir){
			var newDate = new Date(date);
			newDate.setUTCDate(date.getUTCDate() + dir);

			return newDate;
		},

		moveWeek: function(date, dir){
			return this.moveDay(date, dir * 7);
		},

		moveMonth: function(date, dir){
			if (!isValidDate(date))
				return this.o.defaultViewDate;
			if (!dir)
				return date;
			var new_date = new Date(date.valueOf()),
				day = new_date.getUTCDate(),
				month = new_date.getUTCMonth(),
				mag = Math.abs(dir),
				new_month, test;
			dir = dir > 0 ? 1 : -1;
			if (mag === 1){
				test = dir === -1
					// If going back one month, make sure month is not current month
					// (eg, Mar 31 -> Feb 31 == Feb 28, not Mar 02)
					? function(){
						return new_date.getUTCMonth() === month;
					}
					// If going forward one month, make sure month is as expected
					// (eg, Jan 31 -> Feb 31 == Feb 28, not Mar 02)
					: function(){
						return new_date.getUTCMonth() !== new_month;
					};
				new_month = month + dir;
				new_date.setUTCMonth(new_month);
				// Dec -> Jan (12) or Jan -> Dec (-1) -- limit expected date to 0-11
				new_month = (new_month + 12) % 12;
			}
			else {
				// For magnitudes >1, move one month at a time...
				for (var i=0; i < mag; i++)
					// ...which might decrease the day (eg, Jan 31 to Feb 28, etc)...
					new_date = this.moveMonth(new_date, dir);
				// ...then reset the day, keeping it in the new month
				new_month = new_date.getUTCMonth();
				new_date.setUTCDate(day);
				test = function(){
					return new_month !== new_date.getUTCMonth();
				};
			}
			// Common date-resetting loop -- if date is beyond end of month, make it
			// end of month
			while (test()){
				new_date.setUTCDate(--day);
				new_date.setUTCMonth(new_month);
			}
			return new_date;
		},

		moveYear: function(date, dir){
			return this.moveMonth(date, dir*12);
		},

		moveAvailableDate: function(date, dir, fn){
			do {
				date = this[fn](date, dir);

				if (!this.dateWithinRange(date))
					return false;

				fn = 'moveDay';
			}
			while (this.dateIsDisabled(date));

			return date;
		},

		weekOfDateIsDisabled: function(date){
			return $.inArray(date.getUTCDay(), this.o.daysOfWeekDisabled) !== -1;
		},

		dateIsDisabled: function(date){
			return (
				this.weekOfDateIsDisabled(date) ||
				$.grep(this.o.datesDisabled, function(d){
					return isUTCEquals(date, d);
				}).length > 0
			);
		},

		dateWithinRange: function(date){
			return date >= this.o.startDate && date <= this.o.endDate;
		},

		keydown: function(e){
			if (!this.picker.is(':visible')){
				if (e.keyCode === 40 || e.keyCode === 27) { // allow down to re-show picker
					this.show();
					e.stopPropagation();
        }
				return;
			}
			var dateChanged = false,
				dir, newViewDate,
				focusDate = this.focusDate || this.viewDate;
			switch (e.keyCode){
				case 27: // escape
					if (this.focusDate){
						this.focusDate = null;
						this.viewDate = this.dates.get(-1) || this.viewDate;
						this.fill();
					}
					else
						this.hide();
					e.preventDefault();
					e.stopPropagation();
					break;
				case 37: // left
				case 38: // up
				case 39: // right
				case 40: // down
					if (!this.o.keyboardNavigation || this.o.daysOfWeekDisabled.length === 7)
						break;
					dir = e.keyCode === 37 || e.keyCode === 38 ? -1 : 1;
          if (this.viewMode === 0) {
  					if (e.ctrlKey){
  						newViewDate = this.moveAvailableDate(focusDate, dir, 'moveYear');

  						if (newViewDate)
  							this._trigger('changeYear', this.viewDate);
  					} else if (e.shiftKey){
  						newViewDate = this.moveAvailableDate(focusDate, dir, 'moveMonth');

  						if (newViewDate)
  							this._trigger('changeMonth', this.viewDate);
  					} else if (e.keyCode === 37 || e.keyCode === 39){
  						newViewDate = this.moveAvailableDate(focusDate, dir, 'moveDay');
  					} else if (!this.weekOfDateIsDisabled(focusDate)){
  						newViewDate = this.moveAvailableDate(focusDate, dir, 'moveWeek');
  					}
          } else if (this.viewMode === 1) {
            if (e.keyCode === 38 || e.keyCode === 40) {
              dir = dir * 4;
            }
            newViewDate = this.moveAvailableDate(focusDate, dir, 'moveMonth');
          } else if (this.viewMode === 2) {
            if (e.keyCode === 38 || e.keyCode === 40) {
              dir = dir * 4;
            }
            newViewDate = this.moveAvailableDate(focusDate, dir, 'moveYear');
          }
					if (newViewDate){
						this.focusDate = this.viewDate = newViewDate;
						this.setValue();
						this.fill();
						e.preventDefault();
					}
					break;
				case 13: // enter
					if (!this.o.forceParse)
						break;
					focusDate = this.focusDate || this.dates.get(-1) || this.viewDate;
					if (this.o.keyboardNavigation) {
						this._toggle_multidate(focusDate);
						dateChanged = true;
					}
					this.focusDate = null;
					this.viewDate = this.dates.get(-1) || this.viewDate;
					this.setValue();
					this.fill();
					if (this.picker.is(':visible')){
						e.preventDefault();
						e.stopPropagation();
						if (this.o.autoclose)
							this.hide();
					}
					break;
				case 9: // tab
					this.focusDate = null;
					this.viewDate = this.dates.get(-1) || this.viewDate;
					this.fill();
					this.hide();
					break;
			}
			if (dateChanged){
				if (this.dates.length)
					this._trigger('changeDate');
				else
					this._trigger('clearDate');
				this.inputField.trigger('change');
			}
		},

		setViewMode: function(viewMode){
			this.viewMode = viewMode;
			this.picker
				.children('div')
				.hide()
				.filter('.datepicker-' + DPGlobal.viewModes[this.viewMode].clsName)
					.show();
			this.updateNavArrows();
      this._trigger('changeViewMode', new Date(this.viewDate));
		}
	};

	var DateRangePicker = function(element, options){
		$.data(element, 'datepicker', this);
		this.element = $(element);
		this.inputs = $.map(options.inputs, function(i){
			return i.jquery ? i[0] : i;
		});
		delete options.inputs;

		this.keepEmptyValues = options.keepEmptyValues;
		delete options.keepEmptyValues;

		datepickerPlugin.call($(this.inputs), options)
			.on('changeDate', $.proxy(this.dateUpdated, this));

		this.pickers = $.map(this.inputs, function(i){
			return $.data(i, 'datepicker');
		});
		this.updateDates();
	};
	DateRangePicker.prototype = {
		updateDates: function(){
			this.dates = $.map(this.pickers, function(i){
				return i.getUTCDate();
			});
			this.updateRanges();
		},
		updateRanges: function(){
			var range = $.map(this.dates, function(d){
				return d.valueOf();
			});
			$.each(this.pickers, function(i, p){
				p.setRange(range);
			});
		},
		clearDates: function(){
			$.each(this.pickers, function(i, p){
				p.clearDates();
			});
		},
		dateUpdated: function(e){
			// `this.updating` is a workaround for preventing infinite recursion
			// between `changeDate` triggering and `setUTCDate` calling.  Until
			// there is a better mechanism.
			if (this.updating)
				return;
			this.updating = true;

			var dp = $.data(e.target, 'datepicker');

			if (dp === undefined) {
				return;
			}

			var new_date = dp.getUTCDate(),
				keep_empty_values = this.keepEmptyValues,
				i = $.inArray(e.target, this.inputs),
				j = i - 1,
				k = i + 1,
				l = this.inputs.length;
			if (i === -1)
				return;

			$.each(this.pickers, function(i, p){
				if (!p.getUTCDate() && (p === dp || !keep_empty_values))
					p.setUTCDate(new_date);
			});

			if (new_date < this.dates[j]){
				// Date being moved earlier/left
				while (j >= 0 && new_date < this.dates[j]){
					this.pickers[j--].setUTCDate(new_date);
				}
			} else if (new_date > this.dates[k]){
				// Date being moved later/right
				while (k < l && new_date > this.dates[k]){
					this.pickers[k++].setUTCDate(new_date);
				}
			}
			this.updateDates();

			delete this.updating;
		},
		destroy: function(){
			$.map(this.pickers, function(p){ p.destroy(); });
			$(this.inputs).off('changeDate', this.dateUpdated);
			delete this.element.data().datepicker;
		},
		remove: alias('destroy', 'Method `remove` is deprecated and will be removed in version 2.0. Use `destroy` instead')
	};

	function opts_from_el(el, prefix){
		// Derive options from element data-attrs
		var data = $(el).data(),
			out = {}, inkey,
			replace = new RegExp('^' + prefix.toLowerCase() + '([A-Z])');
		prefix = new RegExp('^' + prefix.toLowerCase());
		function re_lower(_,a){
			return a.toLowerCase();
		}
		for (var key in data)
			if (prefix.test(key)){
				inkey = key.replace(replace, re_lower);
				out[inkey] = data[key];
			}
		return out;
	}

	function opts_from_locale(lang){
		// Derive options from locale plugins
		var out = {};
		// Check if "de-DE" style date is available, if not language should
		// fallback to 2 letter code eg "de"
		if (!dates[lang]){
			lang = lang.split('-')[0];
			if (!dates[lang])
				return;
		}
		var d = dates[lang];
		$.each(locale_opts, function(i,k){
			if (k in d)
				out[k] = d[k];
		});
		return out;
	}

	var old = $.fn.datepicker;
	var datepickerPlugin = function(option){
		var args = Array.apply(null, arguments);
		args.shift();
		var internal_return;
		this.each(function(){
			var $this = $(this),
				data = $this.data('datepicker'),
				options = typeof option === 'object' && option;
			if (!data){
				var elopts = opts_from_el(this, 'date'),
					// Preliminary otions
					xopts = $.extend({}, defaults, elopts, options),
					locopts = opts_from_locale(xopts.language),
					// Options priority: js args, data-attrs, locales, defaults
					opts = $.extend({}, defaults, locopts, elopts, options);
				if ($this.hasClass('input-daterange') || opts.inputs){
					$.extend(opts, {
						inputs: opts.inputs || $this.find('input').toArray()
					});
					data = new DateRangePicker(this, opts);
				}
				else {
					data = new Datepicker(this, opts);
				}
				$this.data('datepicker', data);
			}
			if (typeof option === 'string' && typeof data[option] === 'function'){
				internal_return = data[option].apply(data, args);
			}
		});

		if (
			internal_return === undefined ||
			internal_return instanceof Datepicker ||
			internal_return instanceof DateRangePicker
		)
			return this;

		if (this.length > 1)
			throw new Error('Using only allowed for the collection of a single element (' + option + ' function)');
		else
			return internal_return;
	};
	$.fn.datepicker = datepickerPlugin;

	var defaults = $.fn.datepicker.defaults = {
		assumeNearbyYear: false,
		autoclose: false,
		beforeShowDay: $.noop,
		beforeShowMonth: $.noop,
		beforeShowYear: $.noop,
		beforeShowDecade: $.noop,
		beforeShowCentury: $.noop,
		calendarWeeks: false,
		clearBtn: false,
		toggleActive: false,
		daysOfWeekDisabled: [],
		daysOfWeekHighlighted: [],
		datesDisabled: [],
		endDate: Infinity,
		forceParse: true,
		format: 'mm/dd/yyyy',
		keepEmptyValues: false,
		keyboardNavigation: true,
		language: 'en',
		minViewMode: 0,
		maxViewMode: 4,
		multidate: false,
		multidateSeparator: ',',
		orientation: "auto",
		rtl: false,
		startDate: -Infinity,
		startView: 0,
		todayBtn: false,
		todayHighlight: false,
		updateViewDate: true,
		weekStart: 0,
		disableTouchKeyboard: false,
		enableOnReadonly: true,
		showOnFocus: true,
		zIndexOffset: 10,
		container: 'body',
		immediateUpdates: false,
		title: '',
		templates: {
			leftArrow: '&#x00AB;',
			rightArrow: '&#x00BB;'
		},
    showWeekDays: true
	};
	var locale_opts = $.fn.datepicker.locale_opts = [
		'format',
		'rtl',
		'weekStart'
	];
	$.fn.datepicker.Constructor = Datepicker;
	var dates = $.fn.datepicker.dates = {
		en: {
			days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
			daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
			daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
			months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
			monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
			today: "Today",
			clear: "Clear",
			titleFormat: "MM yyyy"
		}
	};

	var DPGlobal = {
		viewModes: [
			{
				names: ['days', 'month'],
				clsName: 'days',
				e: 'changeMonth'
			},
			{
				names: ['months', 'year'],
				clsName: 'months',
				e: 'changeYear',
				navStep: 1
			},
			{
				names: ['years', 'decade'],
				clsName: 'years',
				e: 'changeDecade',
				navStep: 10
			},
			{
				names: ['decades', 'century'],
				clsName: 'decades',
				e: 'changeCentury',
				navStep: 100
			},
			{
				names: ['centuries', 'millennium'],
				clsName: 'centuries',
				e: 'changeMillennium',
				navStep: 1000
			}
		],
		validParts: /dd?|DD?|mm?|MM?|yy(?:yy)?/g,
		nonpunctuation: /[^ -\/:-@\u5e74\u6708\u65e5\[-`{-~\t\n\r]+/g,
		parseFormat: function(format){
			if (typeof format.toValue === 'function' && typeof format.toDisplay === 'function')
                return format;
            // IE treats \0 as a string end in inputs (truncating the value),
			// so it's a bad format delimiter, anyway
			var separators = format.replace(this.validParts, '\0').split('\0'),
				parts = format.match(this.validParts);
			if (!separators || !separators.length || !parts || parts.length === 0){
				throw new Error("Invalid date format.");
			}
			return {separators: separators, parts: parts};
		},
		parseDate: function(date, format, language, assumeNearby){
			if (!date)
				return undefined;
			if (date instanceof Date)
				return date;
			if (typeof format === 'string')
				format = DPGlobal.parseFormat(format);
			if (format.toValue)
				return format.toValue(date, format, language);
			var fn_map = {
					d: 'moveDay',
					m: 'moveMonth',
					w: 'moveWeek',
					y: 'moveYear'
				},
				dateAliases = {
					yesterday: '-1d',
					today: '+0d',
					tomorrow: '+1d'
				},
				parts, part, dir, i, fn;
			if (date in dateAliases){
				date = dateAliases[date];
			}
			if (/^[\-+]\d+[dmwy]([\s,]+[\-+]\d+[dmwy])*$/i.test(date)){
				parts = date.match(/([\-+]\d+)([dmwy])/gi);
				date = new Date();
				for (i=0; i < parts.length; i++){
					part = parts[i].match(/([\-+]\d+)([dmwy])/i);
					dir = Number(part[1]);
					fn = fn_map[part[2].toLowerCase()];
					date = Datepicker.prototype[fn](date, dir);
				}
				return Datepicker.prototype._zero_utc_time(date);
			}

			parts = date && date.match(this.nonpunctuation) || [];

			function applyNearbyYear(year, threshold){
				if (threshold === true)
					threshold = 10;

				// if year is 2 digits or less, than the user most likely is trying to get a recent century
				if (year < 100){
					year += 2000;
					// if the new year is more than threshold years in advance, use last century
					if (year > ((new Date()).getFullYear()+threshold)){
						year -= 100;
					}
				}

				return year;
			}

			var parsed = {},
				setters_order = ['yyyy', 'yy', 'M', 'MM', 'm', 'mm', 'd', 'dd'],
				setters_map = {
					yyyy: function(d,v){
						return d.setUTCFullYear(assumeNearby ? applyNearbyYear(v, assumeNearby) : v);
					},
					m: function(d,v){
						if (isNaN(d))
							return d;
						v -= 1;
						while (v < 0) v += 12;
						v %= 12;
						d.setUTCMonth(v);
						while (d.getUTCMonth() !== v)
							d.setUTCDate(d.getUTCDate()-1);
						return d;
					},
					d: function(d,v){
						return d.setUTCDate(v);
					}
				},
				val, filtered;
			setters_map['yy'] = setters_map['yyyy'];
			setters_map['M'] = setters_map['MM'] = setters_map['mm'] = setters_map['m'];
			setters_map['dd'] = setters_map['d'];
			date = UTCToday();
			var fparts = format.parts.slice();
			// Remove noop parts
			if (parts.length !== fparts.length){
				fparts = $(fparts).filter(function(i,p){
					return $.inArray(p, setters_order) !== -1;
				}).toArray();
			}
			// Process remainder
			function match_part(){
				var m = this.slice(0, parts[i].length),
					p = parts[i].slice(0, m.length);
				return m.toLowerCase() === p.toLowerCase();
			}
			if (parts.length === fparts.length){
				var cnt;
				for (i=0, cnt = fparts.length; i < cnt; i++){
					val = parseInt(parts[i], 10);
					part = fparts[i];
					if (isNaN(val)){
						switch (part){
							case 'MM':
								filtered = $(dates[language].months).filter(match_part);
								val = $.inArray(filtered[0], dates[language].months) + 1;
								break;
							case 'M':
								filtered = $(dates[language].monthsShort).filter(match_part);
								val = $.inArray(filtered[0], dates[language].monthsShort) + 1;
								break;
						}
					}
					parsed[part] = val;
				}
				var _date, s;
				for (i=0; i < setters_order.length; i++){
					s = setters_order[i];
					if (s in parsed && !isNaN(parsed[s])){
						_date = new Date(date);
						setters_map[s](_date, parsed[s]);
						if (!isNaN(_date))
							date = _date;
					}
				}
			}
			return date;
		},
		formatDate: function(date, format, language){
			if (!date)
				return '';
			if (typeof format === 'string')
				format = DPGlobal.parseFormat(format);
			if (format.toDisplay)
                return format.toDisplay(date, format, language);
            var val = {
				d: date.getUTCDate(),
				D: dates[language].daysShort[date.getUTCDay()],
				DD: dates[language].days[date.getUTCDay()],
				m: date.getUTCMonth() + 1,
				M: dates[language].monthsShort[date.getUTCMonth()],
				MM: dates[language].months[date.getUTCMonth()],
				yy: date.getUTCFullYear().toString().substring(2),
				yyyy: date.getUTCFullYear()
			};
			val.dd = (val.d < 10 ? '0' : '') + val.d;
			val.mm = (val.m < 10 ? '0' : '') + val.m;
			date = [];
			var seps = $.extend([], format.separators);
			for (var i=0, cnt = format.parts.length; i <= cnt; i++){
				if (seps.length)
					date.push(seps.shift());
				date.push(val[format.parts[i]]);
			}
			return date.join('');
		},
		headTemplate: '<thead>'+
			              '<tr>'+
			                '<th colspan="7" class="datepicker-title"></th>'+
			              '</tr>'+
							'<tr>'+
								'<th class="prev">'+defaults.templates.leftArrow+'</th>'+
								'<th colspan="5" class="datepicker-switch"></th>'+
								'<th class="next">'+defaults.templates.rightArrow+'</th>'+
							'</tr>'+
						'</thead>',
		contTemplate: '<tbody><tr><td colspan="7"></td></tr></tbody>',
		footTemplate: '<tfoot>'+
							'<tr>'+
								'<th colspan="7" class="today"></th>'+
							'</tr>'+
							'<tr>'+
								'<th colspan="7" class="clear"></th>'+
							'</tr>'+
						'</tfoot>'
	};
	DPGlobal.template = '<div class="datepicker">'+
							'<div class="datepicker-days">'+
								'<table class="table-condensed">'+
									DPGlobal.headTemplate+
									'<tbody></tbody>'+
									DPGlobal.footTemplate+
								'</table>'+
							'</div>'+
							'<div class="datepicker-months">'+
								'<table class="table-condensed">'+
									DPGlobal.headTemplate+
									DPGlobal.contTemplate+
									DPGlobal.footTemplate+
								'</table>'+
							'</div>'+
							'<div class="datepicker-years">'+
								'<table class="table-condensed">'+
									DPGlobal.headTemplate+
									DPGlobal.contTemplate+
									DPGlobal.footTemplate+
								'</table>'+
							'</div>'+
							'<div class="datepicker-decades">'+
								'<table class="table-condensed">'+
									DPGlobal.headTemplate+
									DPGlobal.contTemplate+
									DPGlobal.footTemplate+
								'</table>'+
							'</div>'+
							'<div class="datepicker-centuries">'+
								'<table class="table-condensed">'+
									DPGlobal.headTemplate+
									DPGlobal.contTemplate+
									DPGlobal.footTemplate+
								'</table>'+
							'</div>'+
						'</div>';

	$.fn.datepicker.DPGlobal = DPGlobal;


	/* DATEPICKER NO CONFLICT
	* =================== */

	$.fn.datepicker.noConflict = function(){
		$.fn.datepicker = old;
		return this;
	};

	/* DATEPICKER VERSION
	 * =================== */
	$.fn.datepicker.version = '1.8.0';

	$.fn.datepicker.deprecated = function(msg){
		var console = window.console;
		if (console && console.warn) {
			console.warn('DEPRECATED: ' + msg);
		}
	};


	/* DATEPICKER DATA-API
	* ================== */

	$(document).on(
		'focus.datepicker.data-api click.datepicker.data-api',
		'[data-provide="datepicker"]',
		function(e){
			var $this = $(this);
			if ($this.data('datepicker'))
				return;
			e.preventDefault();
			// component click requires us to explicitly show it
			datepickerPlugin.call($this, 'show');
		}
	);
	$(function(){
		datepickerPlugin.call($('[data-provide="datepicker-inline"]'));
	});

}));
/**
 * Canadian English translation for bootstrap-datepicker
 * Mike Nacey <mnacey@gmail.com>
 * DEPRECATED: This filename doesn't follow the convention, use bootstrap-datepicker.en-CA.js instead
 */

;(function($){
	$.fn.datepicker.dates['en-CA'] = {
		days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
		daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
		daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
		months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
		monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
		today: "Today",
		monthsTitle: "Months",
		clear: "Clear",
		weekStart: 0,
		format: "yyyy-mm-dd"
	};

	$.fn.datepicker.deprecated('This filename doesn\'t follow the convention, use bootstrap-datepicker.en-CA.js instead.');

}(jQuery));
/**
 * Arabic-Tunisia translation for bootstrap-datepicker
 * Souhaieb Besbes <besbes.souhaieb@gmail.com>
 */

;(function($){
    $.fn.datepicker.dates['ar-tn'] = {
        days: ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت", "الأحد"],
        daysShort: ["أحد", "اثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت", "أحد"],
        daysMin: ["ح", "ن", "ث", "ع", "خ", "ج", "س", "ح"],
        months: ["جانفي","فيفري","مارس","أفريل","ماي","جوان","جويليه","أوت","سبتمبر","أكتوبر","نوفمبر","ديسمبر"],
        monthsShort: ["جانفي","فيفري","مارس","أفريل","ماي","جوان","جويليه","أوت","سبتمبر","أكتوبر","نوفمبر","ديسمبر"],
        today: "هذا اليوم",
        rtl: true
    };
}(jQuery));
/**
 * Arabic translation for bootstrap-datepicker
 * Mohammed Alshehri <alshehri866@gmail.com>
 */

;(function($){
    $.fn.datepicker.dates['ar'] = {
        days: ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت", "الأحد"],
        daysShort: ["أحد", "اثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت", "أحد"],
        daysMin: ["ح", "ن", "ث", "ع", "خ", "ج", "س", "ح"],
        months: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"],
        monthsShort: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"],
        today: "هذا اليوم",
        rtl: true
    };
}(jQuery));
// Azerbaijani
;(function($){
    $.fn.datepicker.dates['az'] = {
        days: ["Bazar", "Bazar ertəsi", "Çərşənbə axşamı", "Çərşənbə", "Cümə axşamı", "Cümə", "Şənbə"],
        daysShort: ["B.", "B.e", "Ç.a", "Ç.", "C.a", "C.", "Ş."],
        daysMin: ["B.", "B.e", "Ç.a", "Ç.", "C.a", "C.", "Ş."],
        months: ["Yanvar", "Fevral", "Mart", "Aprel", "May", "İyun", "İyul", "Avqust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr"],
        monthsShort: ["Yan", "Fev", "Mar", "Apr", "May", "İyun", "İyul", "Avq", "Sen", "Okt", "Noy", "Dek"],
        today: "Bu gün",
        weekStart: 1
    };
}(jQuery));
/**
 * Bulgarian translation for bootstrap-datepicker
 * Apostol Apostolov <apostol.s.apostolov@gmail.com>
 */

;(function($){
	$.fn.datepicker.dates['bg'] = {
		days: ["Неделя", "Понеделник", "Вторник", "Сряда", "Четвъртък", "Петък", "Събота"],
		daysShort: ["Нед", "Пон", "Вто", "Сря", "Чет", "Пет", "Съб"],
		daysMin: ["Н", "П", "В", "С", "Ч", "П", "С"],
		months: ["Януари", "Февруари", "Март", "Април", "Май", "Юни", "Юли", "Август", "Септември", "Октомври", "Ноември", "Декември"],
		monthsShort: ["Ян", "Фев", "Мар", "Апр", "Май", "Юни", "Юли", "Авг", "Сеп", "Окт", "Ное", "Дек"],
		today: "днес"
	};
}(jQuery));
/**
 * Bengali (Bangla) translation for bootstrap-datepicker
 * Karim Khan <kkhancse91@gmail.com>
 * Orif N. Jr. <orif.zade@gmail.com>
 */

;(function($){
  $.fn.datepicker.dates['bn'] = {
		days: ["রবিবার","সোমবার","মঙ্গলবার","বুধবার","বৃহস্পতিবার","শুক্রবার","শনিবার"],
		daysShort: ["রবিবার","সোমবার","মঙ্গলবার","বুধবার","বৃহস্পতিবার","শুক্রবার","শনিবার"],
		daysMin: ["রবি","সোম","মঙ্গল","বুধ","বৃহস্পতি","শুক্র","শনি"],
		months: ["জানুয়ারী","ফেব্রুয়ারি","মার্চ","এপ্রিল","মে","জুন","জুলাই","অগাস্ট","সেপ্টেম্বর","অক্টোবর","নভেম্বর","ডিসেম্বর"],
		monthsShort: ["জানুয়ারী","ফেব্রুয়ারি","মার্চ","এপ্রিল","মে","জুন","জুলাই","অগাস্ট","সেপ্টেম্বর","অক্টোবর","নভেম্বর","ডিসেম্বর"],
		today: "আজ",
		monthsTitle: "মাস",
		clear: "পরিষ্কার",
		weekStart: 0,
		format: "mm/dd/yyyy"
	};
}(jQuery));
/**
 * Breton translation for bootstrap-datepicker
 * Gwenn Meynier <tornoz@laposte.net>
 */

;(function($){
	$.fn.datepicker.dates['br'] = {
		days: ["Sul", "Lun", "Meurzh", "Merc'her", "Yaou", "Gwener", "Sadorn"],
		daysShort: ["Sul", "Lun", "Meu.", "Mer.", "Yao.", "Gwe.", "Sad."],
		daysMin: ["Su", "L", "Meu", "Mer", "Y", "G", "Sa"],
		months: ["Genver", "C'hwevrer", "Meurzh", "Ebrel", "Mae", "Mezheven", "Gouere", "Eost", "Gwengolo", "Here", "Du", "Kerzu"],
		monthsShort: ["Genv.", "C'hw.", "Meur.", "Ebre.", "Mae", "Mezh.", "Goue.", "Eost", "Gwen.", "Here", "Du", "Kerz."],
		today: "Hiziv",
		monthsTitle: "Miz",
		clear: "Dilemel",
		weekStart: 1,
		format: "dd/mm/yyyy"
	};
}(jQuery));
/**
 * Bosnian translation for bootstrap-datepicker
 */

;(function($){
	$.fn.datepicker.dates['bs'] = {
		days: ["Nedjelja","Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak", "Subota"],
		daysShort: ["Ned", "Pon", "Uto", "Sri", "Čet", "Pet", "Sub"],
		daysMin: ["N", "Po", "U", "Sr", "Č", "Pe", "Su"],
		months: ["Januar", "Februar", "Mart", "April", "Maj", "Juni", "Juli", "August", "Septembar", "Oktobar", "Novembar", "Decembar"],
		monthsShort: ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"],
		today: "Danas",
		weekStart: 1,
		format: "dd.mm.yyyy"
	};
}(jQuery));
/**
 * Catalan translation for bootstrap-datepicker
 * J. Garcia <jogaco.en@gmail.com>
 */

;(function($){
	$.fn.datepicker.dates['ca'] = {
		days: ["Diumenge", "Dilluns", "Dimarts", "Dimecres", "Dijous", "Divendres", "Dissabte"],
		daysShort: ["Diu",  "Dil", "Dmt", "Dmc", "Dij", "Div", "Dis"],
		daysMin: ["dg", "dl", "dt", "dc", "dj", "dv", "ds"],
		months: ["Gener", "Febrer", "Març", "Abril", "Maig", "Juny", "Juliol", "Agost", "Setembre", "Octubre", "Novembre", "Desembre"],
		monthsShort: ["Gen", "Feb", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Oct", "Nov", "Des"],
		today: "Avui",
		monthsTitle: "Mesos",
		clear: "Esborrar",
		weekStart: 1,
		format: "dd/mm/yyyy"
	};
}(jQuery));
/**
 * Czech translation for bootstrap-datepicker
 * Matěj Koubík <matej@koubik.name>
 * Fixes by Michal Remiš <michal.remis@gmail.com>
 */

;(function($){
	$.fn.datepicker.dates['cs'] = {
		days: ["Neděle", "Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota"],
		daysShort: ["Ned", "Pon", "Úte", "Stř", "Čtv", "Pát", "Sob"],
		daysMin: ["Ne", "Po", "Út", "St", "Čt", "Pá", "So"],
		months: ["Leden", "Únor", "Březen", "Duben", "Květen", "Červen", "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec"],
		monthsShort: ["Led", "Úno", "Bře", "Dub", "Kvě", "Čer", "Čnc", "Srp", "Zář", "Říj", "Lis", "Pro"],
		today: "Dnes",
		clear: "Vymazat",
		monthsTitle: "Měsíc",
		weekStart: 1,
		format: "dd.mm.yyyy"
	};
}(jQuery));
/**
 * Welsh translation for bootstrap-datepicker
 * S. Morris <s.morris@bangor.ac.uk>
 */

;(function($){
	$.fn.datepicker.dates['cy'] = {
		days: ["Sul", "Llun", "Mawrth", "Mercher", "Iau", "Gwener", "Sadwrn"],
		daysShort: ["Sul", "Llu", "Maw", "Mer", "Iau", "Gwe", "Sad"],
		daysMin: ["Su", "Ll", "Ma", "Me", "Ia", "Gwe", "Sa"],
		months: ["Ionawr", "Chewfror", "Mawrth", "Ebrill", "Mai", "Mehefin", "Gorfennaf", "Awst", "Medi", "Hydref", "Tachwedd", "Rhagfyr"],
		monthsShort: ["Ion", "Chw", "Maw", "Ebr", "Mai", "Meh", "Gor", "Aws", "Med", "Hyd", "Tach", "Rha"],
		today: "Heddiw"
	};
}(jQuery));
/**
 * Danish translation for bootstrap-datepicker
 * Christian Pedersen <http://github.com/chripede>
 * Ivan Mylyanyk <https://github.com/imylyanyk>
 */

;(function($){
	$.fn.datepicker.dates['da'] = {
		days: ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"],
		daysShort: ["Søn", "Man", "Tir", "Ons", "Tor", "Fre", "Lør"],
		daysMin: ["Sø", "Ma", "Ti", "On", "To", "Fr", "Lø"],
		months: ["Januar", "Februar", "Marts", "April", "Maj", "Juni", "Juli", "August", "September", "Oktober", "November", "December"],
		monthsShort: ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"],
		today: "I Dag",
		weekStart: 1,
		clear: "Nulstil",
        format: "dd/mm/yyyy",
        monthsTitle:"Måneder"
	};
}(jQuery));
/**
 * German translation for bootstrap-datepicker
 * Sam Zurcher <sam@orelias.ch>
 */

;(function($){
	$.fn.datepicker.dates['de'] = {
		days: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
		daysShort: ["Son", "Mon", "Die", "Mit", "Don", "Fre", "Sam"],
		daysMin: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
		months: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
		monthsShort: ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"],
		today: "Heute",
		monthsTitle: "Monate",
		clear: "Löschen",
		weekStart: 1,
		format: "dd.mm.yyyy"
	};
}(jQuery));
/**
 * Greek translation for bootstrap-datepicker
 */

;(function($){
  $.fn.datepicker.dates['el'] = {
    days: ["Κυριακή", "Δευτέρα", "Τρίτη", "Τετάρτη", "Πέμπτη", "Παρασκευή", "Σάββατο"],
    daysShort: ["Κυρ", "Δευ", "Τρι", "Τετ", "Πεμ", "Παρ", "Σαβ"],
    daysMin: ["Κυ", "Δε", "Τρ", "Τε", "Πε", "Πα", "Σα"],
    months: ["Ιανουάριος", "Φεβρουάριος", "Μάρτιος", "Απρίλιος", "Μάιος", "Ιούνιος", "Ιούλιος", "Αύγουστος", "Σεπτέμβριος", "Οκτώβριος", "Νοέμβριος", "Δεκέμβριος"],
    monthsShort: ["Ιαν", "Φεβ", "Μαρ", "Απρ", "Μάι", "Ιουν", "Ιουλ", "Αυγ", "Σεπ", "Οκτ", "Νοε", "Δεκ"],
    today: "Σήμερα",
    clear: "Καθαρισμός",
    weekStart: 1,
    format: "d/m/yyyy"
  };
}(jQuery));
/**
 * Australian English translation for bootstrap-datepicker
 * Steve Chapman <steven.p.chapman@gmail.com>
 */

;(function($){
	$.fn.datepicker.dates['en-AU'] = {
		days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
		daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
		daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
		months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
		monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
		today: "Today",
		monthsTitle: "Months",
		clear: "Clear",
		weekStart: 1,
		format: "d/mm/yyyy"
	};
}(jQuery));
/**
 * Canadian English translation for bootstrap-datepicker
 * Mike Nacey <mnacey@gmail.com>
 */

;(function($){
	$.fn.datepicker.dates['en-CA'] = {
		days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
		daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
		daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
		months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
		monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
		today: "Today",
		monthsTitle: "Months",
		clear: "Clear",
		weekStart: 0,
		format: "yyyy-mm-dd"
	};
}(jQuery));
/**
 * British English translation for bootstrap-datepicker
 * Xavier Dutreilh <xavier@dutreilh.com>
 */

;(function($){
	$.fn.datepicker.dates['en-GB'] = {
		days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
		daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
		daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
		months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
		monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
		today: "Today",
		monthsTitle: "Months",
		clear: "Clear",
		weekStart: 1,
		format: "dd/mm/yyyy"
	};
}(jQuery));
/**
 * Irish English translation for bootstrap-datepicker
 */

;(function($){
	$.fn.datepicker.dates['en-IE'] = {
		days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
		daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
		daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
		months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
		monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
		today: "Today",
		monthsTitle: "Months",
		clear: "Clear",
		weekStart: 1,
		format: "dd/mm/yyyy"
	};
}(jQuery));
/**
 * New Zealand English translation for bootstrap-datepicker
 */

;(function($){
	$.fn.datepicker.dates['en-NZ'] = {
		days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
		daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
		daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
		months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
		monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
		today: "Today",
		monthsTitle: "Months",
		clear: "Clear",
		weekStart: 1,
		format: "d/mm/yyyy"
	};
}(jQuery));
/**
 * South African English translation for bootstrap-datepicker
 */

;(function($){
	$.fn.datepicker.dates['en-ZA'] = {
		days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
		daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
		daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
		months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
		monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
		today: "Today",
		monthsTitle: "Months",
		clear: "Clear",
		weekStart: 1,
		format: "yyyy/mm/d"
	};
}(jQuery));
/**
 * Esperanto translation for bootstrap-datepicker
 * Emmanuel Debanne <https://github.com/debanne>
 */

;(function($){
	$.fn.datepicker.dates['eo'] = {
		days: ["dimanĉo", "lundo", "mardo", "merkredo", "ĵaŭdo", "vendredo", "sabato"],
		daysShort: ["dim.", "lun.", "mar.", "mer.", "ĵaŭ.", "ven.", "sam."],
		daysMin: ["d", "l", "ma", "me", "ĵ", "v", "s"],
		months: ["januaro", "februaro", "marto", "aprilo", "majo", "junio", "julio", "aŭgusto", "septembro", "oktobro", "novembro", "decembro"],
		monthsShort: ["jan.", "feb.", "mar.", "apr.", "majo", "jun.", "jul.", "aŭg.", "sep.", "okt.", "nov.", "dec."],
		today: "Hodiaŭ",
		clear: "Nuligi",
		weekStart: 1,
		format: "yyyy-mm-dd"
	};
}(jQuery));
/**
 * Spanish translation for bootstrap-datepicker
 * Bruno Bonamin <bruno.bonamin@gmail.com>
 */

;(function($){
	$.fn.datepicker.dates['es'] = {
		days: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
		daysShort: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
		daysMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
		months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
		monthsShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
		today: "Hoy",
		monthsTitle: "Meses",
		clear: "Borrar",
		weekStart: 1,
		format: "dd/mm/yyyy"
	};
}(jQuery));
/**
 * Estonian translation for bootstrap-datepicker
 * Ando Roots <https://github.com/anroots>
 * Fixes by Illimar Tambek <<https://github.com/ragulka>
 */

;(function($){
	$.fn.datepicker.dates['et'] = {
		days: ["Pühapäev", "Esmaspäev", "Teisipäev", "Kolmapäev", "Neljapäev", "Reede", "Laupäev"],
		daysShort: ["Pühap", "Esmasp", "Teisip", "Kolmap", "Neljap", "Reede", "Laup"],
		daysMin: ["P", "E", "T", "K", "N", "R", "L"],
		months: ["Jaanuar", "Veebruar", "Märts", "Aprill", "Mai", "Juuni", "Juuli", "August", "September", "Oktoober", "November", "Detsember"],
		monthsShort: ["Jaan", "Veebr", "Märts", "Apr", "Mai", "Juuni", "Juuli", "Aug", "Sept", "Okt", "Nov", "Dets"],
		today: "Täna",
		clear: "Tühjenda",
		weekStart: 1,
		format: "dd.mm.yyyy"
	};
}(jQuery));
/**
 * Basque translation for bootstrap-datepicker
 * Arkaitz Etxeberria <kondi80@gmail.com>
 */

;(function($){
    $.fn.datepicker.dates['eu'] = {
        days: ['Igandea', 'Astelehena', 'Asteartea', 'Asteazkena', 'Osteguna', 'Ostirala', 'Larunbata'],
        daysShort: ['Ig', 'Al', 'Ar', 'Az', 'Og', 'Ol', 'Lr'],
        daysMin: ['Ig', 'Al', 'Ar', 'Az', 'Og', 'Ol', 'Lr'],
        months: ['Urtarrila', 'Otsaila', 'Martxoa', 'Apirila', 'Maiatza', 'Ekaina', 'Uztaila', 'Abuztua', 'Iraila', 'Urria', 'Azaroa', 'Abendua'],
        monthsShort: ['Urt', 'Ots', 'Mar', 'Api', 'Mai', 'Eka', 'Uzt', 'Abu', 'Ira', 'Urr', 'Aza', 'Abe'],
        today: "Gaur",
        monthsTitle: "Hilabeteak",
        clear: "Ezabatu",
        weekStart: 1,
        format: "yyyy/mm/dd"
    };
}(jQuery));

/**
 * Persian translation for bootstrap-datepicker
 * Mostafa Rokooie <mostafa.rokooie@gmail.com>
 */

;(function($){
	$.fn.datepicker.dates['fa'] = {
		days: ["یک‌شنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه", "شنبه", "یک‌شنبه"],
		daysShort: ["یک", "دو", "سه", "چهار", "پنج", "جمعه", "شنبه", "یک"],
		daysMin: ["ی", "د", "س", "چ", "پ", "ج", "ش", "ی"],
		months: ["ژانویه", "فوریه", "مارس", "آوریل", "مه", "ژوئن", "ژوئیه", "اوت", "سپتامبر", "اکتبر", "نوامبر", "دسامبر"],
		monthsShort: ["ژان", "فور", "مار", "آور", "مه", "ژون", "ژوی", "اوت", "سپت", "اکت", "نوا", "دسا"],
		today: "امروز",
		clear: "پاک کن",
		weekStart: 1,
		format: "yyyy/mm/dd"
	};
}(jQuery));
/**
 * Finnish translation for bootstrap-datepicker
 * Jaakko Salonen <https://github.com/jsalonen>
 */

;(function($){
	$.fn.datepicker.dates['fi'] = {
		days: ["sunnuntai", "maanantai", "tiistai", "keskiviikko", "torstai", "perjantai", "lauantai"],
		daysShort: ["sun", "maa", "tii", "kes", "tor", "per", "lau"],
		daysMin: ["su", "ma", "ti", "ke", "to", "pe", "la"],
		months: ["tammikuu", "helmikuu", "maaliskuu", "huhtikuu", "toukokuu", "kesäkuu", "heinäkuu", "elokuu", "syyskuu", "lokakuu", "marraskuu", "joulukuu"],
		monthsShort: ["tam", "hel", "maa", "huh", "tou", "kes", "hei", "elo", "syy", "lok", "mar", "jou"],
		today: "tänään",
		clear: "Tyhjennä",
		weekStart: 1,
		format: "d.m.yyyy"
	};
}(jQuery));
/**
 * Faroese translation for bootstrap-datepicker
 * Theodor Johannesen <http://github.com/theodorjohannesen>
 */

;(function($){
	$.fn.datepicker.dates['fo'] = {
		days: ["Sunnudagur", "Mánadagur", "Týsdagur", "Mikudagur", "Hósdagur", "Fríggjadagur", "Leygardagur"],
		daysShort: ["Sun", "Mán", "Týs", "Mik", "Hós", "Frí", "Ley"],
		daysMin: ["Su", "Má", "Tý", "Mi", "Hó", "Fr", "Le"],
		months: ["Januar", "Februar", "Marts", "Apríl", "Mei", "Juni", "Juli", "August", "Septembur", "Oktobur", "Novembur", "Desembur"],
		monthsShort: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Des"],
		today: "Í Dag",
		clear: "Reinsa"
	};
}(jQuery));
/**
 * French (Switzerland) translation for bootstrap-datepicker
 * Christoph Jossi <c.jossi@ascami.ch>
 * Based on 
 * French translation for bootstrap-datepicker
 * Nico Mollet <nico.mollet@gmail.com>
 */

;(function($){
	$.fn.datepicker.dates['fr'] = {
		days: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
		daysShort: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
		daysMin: ["D", "L", "Ma", "Me", "J", "V", "S"],
		months: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
		monthsShort: ["Jan", "Fév", "Mar", "Avr", "Mai", "Jui", "Jul", "Aou", "Sep", "Oct", "Nov", "Déc"],
		today: "Aujourd'hui",
		monthsTitle: "Mois",
		clear: "Effacer",
		weekStart: 1,
		format: "dd.mm.yyyy"
	};
}(jQuery));
/**
 * French translation for bootstrap-datepicker
 * Nico Mollet <nico.mollet@gmail.com>
 */

;(function($){
	$.fn.datepicker.dates['fr'] = {
		days: ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"],
		daysShort: ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."],
		daysMin: ["d", "l", "ma", "me", "j", "v", "s"],
		months: ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"],
		monthsShort: ["janv.", "févr.", "mars", "avril", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."],
		today: "Aujourd'hui",
		monthsTitle: "Mois",
		clear: "Effacer",
		weekStart: 1,
		format: "dd/mm/yyyy"
	};
}(jQuery));
;(function($){
	$.fn.datepicker.dates['gl'] = {
		days: ["Domingo", "Luns", "Martes", "Mércores", "Xoves", "Venres", "Sábado"],
		daysShort: ["Dom", "Lun", "Mar", "Mér", "Xov", "Ven", "Sáb"],
		daysMin: ["Do", "Lu", "Ma", "Me", "Xo", "Ve", "Sa"],
		months: ["Xaneiro", "Febreiro", "Marzo", "Abril", "Maio", "Xuño", "Xullo", "Agosto", "Setembro", "Outubro", "Novembro", "Decembro"],
		monthsShort: ["Xan", "Feb", "Mar", "Abr", "Mai", "Xun", "Xul", "Ago", "Sep", "Out", "Nov", "Dec"],
		today: "Hoxe",
		clear: "Limpar",
		weekStart: 1,
		format: "dd/mm/yyyy"
	};
}(jQuery));
/**
 * Hebrew translation for bootstrap-datepicker
 * Sagie Maoz <sagie@maoz.info>
 */

;(function($){
  $.fn.datepicker.dates['he'] = {
      days: ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת", "ראשון"],
      daysShort: ["א", "ב", "ג", "ד", "ה", "ו", "ש", "א"],
      daysMin: ["א", "ב", "ג", "ד", "ה", "ו", "ש", "א"],
      months: ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"],
      monthsShort: ["ינו", "פבר", "מרץ", "אפר", "מאי", "יונ", "יול", "אוג", "ספט", "אוק", "נוב", "דצמ"],
      today: "היום",
      rtl: true
  };
}(jQuery));
/**
 * Hindi translation for bootstrap-datepicker
 * Visar Uruqi <visar.uruqi@gmail.com>
 */

; (function($){
	$.fn.datepicker.dates['hi'] = {
		days: ["रविवार", "सोमवार", "मंगलवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"],
		daysShort: ["सूर्य", "सोम", "मंगल", "बुध", "गुरु", "शुक्र", "शनि"],
		daysMin: ["र", "सो", "मं", "बु", "गु", "शु", "श"],
		months: ["जनवरी", "फ़रवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितम्बर", "अक्टूबर", "नवंबर", "दिसम्बर"],
		monthsShort: ["जन", "फ़रवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितं", "अक्टूबर", "नवं", "दिसम्बर"],
		today: "आज",
		monthsTitle: "महीने",
		clear: "साफ",
		weekStart: 1,
		format: "dd / mm / yyyy"
	};
}(jQuery));
/**
 * Croatian localisation
 */

;(function($){
	$.fn.datepicker.dates['hr'] = {
		days: ["Nedjelja", "Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak", "Subota"],
		daysShort: ["Ned", "Pon", "Uto", "Sri", "Čet", "Pet", "Sub"],
		daysMin: ["Ne", "Po", "Ut", "Sr", "Če", "Pe", "Su"],
		months: ["Siječanj", "Veljača", "Ožujak", "Travanj", "Svibanj", "Lipanj", "Srpanj", "Kolovoz", "Rujan", "Listopad", "Studeni", "Prosinac"],
		monthsShort: ["Sij", "Velj", "Ožu", "Tra", "Svi", "Lip", "Srp", "Kol", "Ruj", "Lis", "Stu", "Pro"],
		today: "Danas"
	};
}(jQuery));
/**
 * Hungarian translation for bootstrap-datepicker
 * Sotus László <lacisan@gmail.com>
 */

;(function($){
  $.fn.datepicker.dates['hu'] = {
		days: ["vasárnap", "hétfő", "kedd", "szerda", "csütörtök", "péntek", "szombat"],
		daysShort: ["vas", "hét", "ked", "sze", "csü", "pén", "szo"],
		daysMin: ["V", "H", "K", "Sze", "Cs", "P", "Szo"],
		months: ["január", "február", "március", "április", "május", "június", "július", "augusztus", "szeptember", "október", "november", "december"],
		monthsShort: ["jan", "feb", "már", "ápr", "máj", "jún", "júl", "aug", "sze", "okt", "nov", "dec"],
		today: "ma",
		weekStart: 1,
		clear: "töröl",
		titleFormat: "yyyy. MM",
		format: "yyyy.mm.dd"
	};
}(jQuery));
/**
 * Armenian translation for bootstrap-datepicker
 * Hayk Chamyan <hamshen@gmail.com>
 */

;(function($){
	$.fn.datepicker.dates['hy'] = {
		days: ["Կիրակի", "Երկուշաբթի", "Երեքշաբթի", "Չորեքշաբթի", "Հինգշաբթի", "Ուրբաթ", "Շաբաթ"],
		daysShort: ["Կիր", "Երկ", "Երե", "Չոր", "Հին", "Ուրբ", "Շաբ"],
		daysMin: ["Կի", "Եկ", "Եք", "Չո", "Հի", "Ու", "Շա"],
		months: ["Հունվար", "Փետրվար", "Մարտ", "Ապրիլ", "Մայիս", "Հունիս", "Հուլիս", "Օգոստոս", "Սեպտեմբեր", "Հոկտեմբեր", "Նոյեմբեր", "Դեկտեմբեր"],
		monthsShort: ["Հնվ", "Փետ", "Մար", "Ապր", "Մայ", "Հուն", "Հուլ", "Օգս", "Սեպ", "Հոկ", "Նոյ", "Դեկ"],
		today: "Այսօր",
		clear: "Ջնջել",
		format: "dd.mm.yyyy",
		weekStart: 1,
    monthsTitle: 'Ամիսնէր'
	};
}(jQuery));
/**
 * Bahasa translation for bootstrap-datepicker
 * Azwar Akbar <azwar.akbar@gmail.com>
 */

;(function($){
	$.fn.datepicker.dates['id'] = {
		days: ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"],
		daysShort: ["Mgu", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"],
		daysMin: ["Mg", "Sn", "Sl", "Ra", "Ka", "Ju", "Sa"],
		months: ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"],
		monthsShort: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"],
		today: "Hari Ini",
		clear: "Kosongkan"
	};
}(jQuery));
/**
 * Icelandic translation for bootstrap-datepicker
 * Hinrik Örn Sigurðsson <hinrik.sig@gmail.com>
 */

;(function($){
	$.fn.datepicker.dates['is'] = {
		days: ["Sunnudagur", "Mánudagur", "Þriðjudagur", "Miðvikudagur", "Fimmtudagur", "Föstudagur", "Laugardagur"],
		daysShort: ["Sun", "Mán", "Þri", "Mið", "Fim", "Fös", "Lau"],
		daysMin: ["Su", "Má", "Þr", "Mi", "Fi", "Fö", "La"],
		months: ["Janúar", "Febrúar", "Mars", "Apríl", "Maí", "Júní", "Júlí", "Ágúst", "September", "Október", "Nóvember", "Desember"],
		monthsShort: ["Jan", "Feb", "Mar", "Apr", "Maí", "Jún", "Júl", "Ágú", "Sep", "Okt", "Nóv", "Des"],
		today: "Í Dag"
	};
}(jQuery));
/**
 * Italian (Switzerland) translation for bootstrap-datepicker
 * Christoph Jossi <c.jossi@ascami.ch>
 * Based on 
 * Italian translation for bootstrap-datepicker
 * Enrico Rubboli <rubboli@gmail.com>
 */

;(function($){
	$.fn.datepicker.dates['it'] = {
		days: ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"],
		daysShort: ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"],
		daysMin: ["Do", "Lu", "Ma", "Me", "Gi", "Ve", "Sa"],
		months: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"],
		monthsShort: ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"],
		today: "Oggi",
		clear: "Cancella",
		weekStart: 1,
		format: "dd.mm.yyyy"
	};
}(jQuery));
/**
 * Italian translation for bootstrap-datepicker
 * Enrico Rubboli <rubboli@gmail.com>
 */

;(function($){
	$.fn.datepicker.dates['it'] = {
		days: ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"],
		daysShort: ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"],
		daysMin: ["Do", "Lu", "Ma", "Me", "Gi", "Ve", "Sa"],
		months: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"],
		monthsShort: ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"],
		today: "Oggi",
		monthsTitle: "Mesi",
		clear: "Cancella",
		weekStart: 1,
		format: "dd/mm/yyyy"
	};
}(jQuery));
/**
 * Japanese translation for bootstrap-datepicker
 * Norio Suzuki <https://github.com/suzuki/>
 */

;(function($){
	$.fn.datepicker.dates['ja'] = {
		days: ["日曜", "月曜", "火曜", "水曜", "木曜", "金曜", "土曜"],
		daysShort: ["日", "月", "火", "水", "木", "金", "土"],
		daysMin: ["日", "月", "火", "水", "木", "金", "土"],
		months: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
		monthsShort: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
		today: "今日",
		format: "yyyy/mm/dd",
		titleFormat: "yyyy年mm月",
		clear: "クリア"
	};
}(jQuery));
/**
 * Georgian translation for bootstrap-datepicker
 * Levan Melikishvili <levani0101@yahoo.com>
 */

;(function($){
    $.fn.datepicker.dates['ka'] = {
        days: ["კვირა", "ორშაბათი", "სამშაბათი", "ოთხშაბათი", "ხუთშაბათი", "პარასკევი", "შაბათი"],
        daysShort: ["კვი", "ორშ", "სამ", "ოთხ", "ხუთ", "პარ", "შაბ"],
        daysMin: ["კვ", "ორ", "სა", "ოთ", "ხუ", "პა", "შა"],
        months: ["იანვარი", "თებერვალი", "მარტი", "აპრილი", "მაისი", "ივნისი", "ივლისი", "აგვისტო", "სექტემბერი", "ოქტომბერი", "ნოემბერი", "დეკემბერი"],
        monthsShort: ["იან", "თებ", "მარ", "აპრ", "მაი", "ივნ", "ივლ", "აგვ", "სექ", "ოქტ", "ნოე", "დეკ"],
        today: "დღეს",
        clear: "გასუფთავება",
        weekStart: 1,
        format: "dd.mm.yyyy"
    };
}(jQuery));
/**
 * Cambodia (Khmer) translation for bootstrap-datepicker
 * Lytay TOUCH <lytaytouch@gmail.com>
 *
 * DEPRECATED: This language code 'kh' is deprecated and will be removed in 2.0.
 * Khmer support is now in a 'km' translation file to follow the ISO language
 * code - http://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
 */

;(function($){
	$.fn.datepicker.dates['kh'] = {
		days: ["អាទិត្យ", "ចន្ទ", "អង្គារ", "ពុធ", "ព្រហស្បតិ៍", "សុក្រ", "សៅរ៍"],
		daysShort: ["អា.ទិ", "ចន្ទ", "អង្គារ", "ពុធ", "ព្រ.ហ", "សុក្រ", "សៅរ៍"],
		daysMin: ["អា.ទិ", "ចន្ទ", "អង្គារ", "ពុធ", "ព្រ.ហ", "សុក្រ", "សៅរ៍"],
		months: ["មករា", "កុម្ភះ", "មិនា", "មេសា", "ឧសភា", "មិថុនា", "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ"],
		monthsShort: ["មករា", "កុម្ភះ", "មិនា", "មេសា", "ឧសភា", "មិថុនា", "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ"],
		today: "ថ្ងៃនេះ",
		clear: "សំអាត"
	};

	$.fn.datepicker.deprecated('The language code "kh" is deprecated and will be removed in 2.0. For Khmer support use "km" instead.');
}(jQuery));
/**
 * Kazakh translation for bootstrap-datepicker
 * Yerzhan Tolekov <era.tolekov@gmail.com>
 */

;(function($){
	$.fn.datepicker.dates['kk'] = {
		days: ["Жексенбі", "Дүйсенбі", "Сейсенбі", "Сәрсенбі", "Бейсенбі", "Жұма", "Сенбі"],
		daysShort: ["Жек", "Дүй", "Сей", "Сәр", "Бей", "Жұм", "Сен"],
		daysMin: ["Жк", "Дс", "Сс", "Ср", "Бс", "Жм", "Сн"],
		months: ["Қаңтар", "Ақпан", "Наурыз", "Сәуір", "Мамыр", "Маусым", "Шілде", "Тамыз", "Қыркүйек", "Қазан", "Қараша", "Желтоқсан"],
		monthsShort: ["Қаң", "Ақп", "Нау", "Сәу", "Мам", "Мау", "Шіл", "Там", "Қыр", "Қаз", "Қар", "Жел"],
		today: "Бүгін",
		weekStart: 1
	};
}(jQuery));
/**
 * Khmer translation for bootstrap-datepicker
 * This is the Updated Version of: https://github.com/uxsolutions/bootstrap-datepicker/blob/71308d42cce9524284c50c6fac50422d1790ac0f/js/locales/bootstrap-datepicker.kh.js
 */

;(function($){
  $.fn.datepicker.dates['km'] = {
    days: ["អាទិត្យ", "ចន្ទ", "អង្គារ", "ពុធ", "ព្រហស្បតិ៍", "សុក្រ", "សៅរ៍"],
    daysShort: ["អា.ទិ", "ចន្ទ", "អង្គារ", "ពុធ", "ព្រ.ហ", "សុក្រ", "សៅរ៍"],
    daysMin: ["អា.ទិ", "ចន្ទ", "អង្គារ", "ពុធ", "ព្រ.ហ", "សុក្រ", "សៅរ៍"],
    months: ["មករា", "កុម្ភះ", "មិនា", "មេសា", "ឧសភា", "មិថុនា", "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ"],
    monthsShort: ["មករា", "កុម្ភះ", "មិនា", "មេសា", "ឧសភា", "មិថុនា", "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ"],
    today: "ថ្ងៃនេះ",
    clear: "សំអាត"
  };
}(jQuery));
/**
 * Korean translation for bootstrap-datepicker
 * This is a port from https://github.com/moment/moment/blob/develop/src/locale/ko.js
 */

;(function($){
	$.fn.datepicker.dates['ko'] = {
		days: ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"],
		daysShort: ["일", "월", "화", "수", "목", "금", "토"],
		daysMin: ["일", "월", "화", "수", "목", "금", "토"],
		months: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
		monthsShort: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
		today: "오늘",
		clear: "삭제",
		format: "yyyy-mm-dd",
		titleFormat: "yyyy년mm월",
		weekStart: 0
	};
}(jQuery));
/**
 * Korean translation for bootstrap-datepicker
 * Gu Youn <http://github.com/guyoun>
 *
 * DEPRECATED: This language code 'kr' is deprecated and will be removed in 2.0.
 * Korean support is now in a 'ko' translation file to follow the ISO language
 * code - http://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
 */

;(function($){
	$.fn.datepicker.dates['kr'] = {
		days: ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"],
		daysShort: ["일", "월", "화", "수", "목", "금", "토"],
		daysMin: ["일", "월", "화", "수", "목", "금", "토"],
		months: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
		monthsShort: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"]
	};

	$.fn.datepicker.deprecated('The language code "kr" is deprecated and will be removed in 2.0. For korean support use "ko" instead.');
}(jQuery));
/**
 * Lithuanian translation for bootstrap-datepicker
 * Šarūnas Gliebus <ssharunas@yahoo.co.uk>
 */


;(function($){
    $.fn.datepicker.dates['lt'] = {
        days: ["Sekmadienis", "Pirmadienis", "Antradienis", "Trečiadienis", "Ketvirtadienis", "Penktadienis", "Šeštadienis"],
        daysShort: ["S", "Pr", "A", "T", "K", "Pn", "Š"],
        daysMin: ["Sk", "Pr", "An", "Tr", "Ke", "Pn", "Št"],
        months: ["Sausis", "Vasaris", "Kovas", "Balandis", "Gegužė", "Birželis", "Liepa", "Rugpjūtis", "Rugsėjis", "Spalis", "Lapkritis", "Gruodis"],
        monthsShort: ["Sau", "Vas", "Kov", "Bal", "Geg", "Bir", "Lie", "Rugp", "Rugs", "Spa", "Lap", "Gru"],
        today: "Šiandien",
        monthsTitle:"Mėnesiai",
        clear:"Išvalyti",
        weekStart: 1,
        format:"yyyy-mm-dd"
    };
}(jQuery));
/**
 * Latvian translation for bootstrap-datepicker
 * Artis Avotins <artis@apit.lv>
 */


;(function($){
    $.fn.datepicker.dates['lv'] = {
        days: ["Svētdiena", "Pirmdiena", "Otrdiena", "Trešdiena", "Ceturtdiena", "Piektdiena", "Sestdiena"],
        daysShort: ["Sv", "P", "O", "T", "C", "Pk", "S"],
        daysMin: ["Sv", "Pr", "Ot", "Tr", "Ce", "Pk", "Se"],
        months: ["Janvāris", "Februāris", "Marts", "Aprīlis", "Maijs", "Jūnijs", "Jūlijs", "Augusts", "Septembris", "Oktobris", "Novembris", "Decembris"],
        monthsShort: ["Jan", "Feb", "Mar", "Apr", "Mai", "Jūn", "Jūl", "Aug", "Sep", "Okt", "Nov", "Dec"],
        monthsTitle: "Mēneši",
        today: "Šodien",
        clear: "Nodzēst",
        weekStart: 1
    };
}(jQuery));
/**
 * Montenegrin translation for bootstrap-datepicker
 * Miodrag Nikač <miodrag@restartit.me>
 */

;(function($){
	$.fn.datepicker.dates['me'] = {
		days: ["Nedjelja","Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak", "Subota"],
		daysShort: ["Ned", "Pon", "Uto", "Sri", "Čet", "Pet", "Sub"],
		daysMin: ["Ne", "Po", "Ut", "Sr", "Če", "Pe", "Su"],
		months: ["Januar", "Februar", "Mart", "April", "Maj", "Jun", "Jul", "Avgust", "Septembar", "Oktobar", "Novembar", "Decembar"],
		monthsShort: ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Avg", "Sep", "Okt", "Nov", "Dec"],
		today: "Danas",
		weekStart: 1,
		clear: "Izbriši",
		format: "dd.mm.yyyy"
	};
}(jQuery));
/**
 * Macedonian translation for bootstrap-datepicker
 * Marko Aleksic <psybaron@gmail.com>
 */

;(function($){
    $.fn.datepicker.dates['mk'] = {
        days: ["Недела", "Понеделник", "Вторник", "Среда", "Четврток", "Петок", "Сабота"],
        daysShort: ["Нед", "Пон", "Вто", "Сре", "Чет", "Пет", "Саб"],
        daysMin: ["Не", "По", "Вт", "Ср", "Че", "Пе", "Са"],
        months: ["Јануари", "Февруари", "Март", "Април", "Мај", "Јуни", "Јули", "Август", "Септември", "Октомври", "Ноември", "Декември"],
        monthsShort: ["Јан", "Фев", "Мар", "Апр", "Мај", "Јун", "Јул", "Авг", "Сеп", "Окт", "Ное", "Дек"],
        today: "Денес",
        format: "dd.mm.yyyy"
    };
}(jQuery));
/**
 * Mongolian translation for bootstrap-datepicker
 * Andrey Torsunov <andrey.torsunov@gmail.com>
 */

;(function($){
    $.fn.datepicker.dates['mn'] = {
        days: ["Ням", "Даваа", "Мягмар", "Лхагва", "Пүрэв", "Баасан", "Бямба"],
        daysShort: ["Ням", "Дав", "Мяг", "Лха", "Пүр", "Баа", "Бям"],
        daysMin: ["Ня", "Да", "Мя", "Лх", "Пү", "Ба", "Бя"],
        months: ["Хулгана", "Үхэр", "Бар", "Туулай", "Луу", "Могой", "Морь", "Хонь", "Бич", "Тахиа", "Нохой", "Гахай"],
        monthsShort: ["Хул", "Үхэ", "Бар", "Туу", "Луу", "Мог", "Мор", "Хон", "Бич", "Тах", "Нох", "Гах"],
        today: "Өнөөдөр",
        clear: "Тодорхой",
        format: "yyyy.mm.dd",
        weekStart: 1
    };
}(jQuery));
/**
 * Malay translation for bootstrap-datepicker
 * Ateman Faiz <noorulfaiz@gmail.com>
 */

;(function($){
	$.fn.datepicker.dates['ms'] = {
		days: ["Ahad", "Isnin", "Selasa", "Rabu", "Khamis", "Jumaat", "Sabtu"],
		daysShort: ["Aha", "Isn", "Sel", "Rab", "Kha", "Jum", "Sab"],
		daysMin: ["Ah", "Is", "Se", "Ra", "Kh", "Ju", "Sa"],
		months: ["Januari", "Februari", "Mac", "April", "Mei", "Jun", "Julai", "Ogos", "September", "Oktober", "November", "Disember"],
		monthsShort: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ogo", "Sep", "Okt", "Nov", "Dis"],
		today: "Hari Ini",
        clear: "Bersihkan"
	};
}(jQuery));
/**
 * Norwegian (bokmål) translation for bootstrap-datepicker
 * Fredrik Sundmyhr <http://github.com/fsundmyhr>
 */

;(function($){
	$.fn.datepicker.dates['nb'] = {
		days: ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"],
		daysShort: ["Søn", "Man", "Tir", "Ons", "Tor", "Fre", "Lør"],
		daysMin: ["Sø", "Ma", "Ti", "On", "To", "Fr", "Lø"],
		months: ["Januar", "Februar", "Mars", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Desember"],
		monthsShort: ["Jan", "Feb", "Mar", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Des"],
		today: "I Dag",
		format: "dd.mm.yyyy"
	};
}(jQuery));
/**
 * Belgium-Dutch translation for bootstrap-datepicker
 * Julien Poulin <poulin_julien@hotmail.com>
 */

;(function($){
  $.fn.datepicker.dates['nl-BE'] = {
    days: ["zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag"],
    daysShort: ["zo", "ma", "di", "wo", "do", "vr", "za"],
    daysMin: ["zo", "ma", "di", "wo", "do", "vr", "za"],
    months: ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"],
    monthsShort: ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"],
    today: "Vandaag",
    monthsTitle: "Maanden",
    clear: "Leegmaken",
    weekStart: 1,
    format: "dd/mm/yyyy"
  };
}(jQuery));
/**
 * Dutch translation for bootstrap-datepicker
 * Reinier Goltstein <mrgoltstein@gmail.com>
 */

;(function($){
	$.fn.datepicker.dates['nl'] = {
		days: ["zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag"],
		daysShort: ["zo", "ma", "di", "wo", "do", "vr", "za"],
		daysMin: ["zo", "ma", "di", "wo", "do", "vr", "za"],
		months: ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"],
		monthsShort: ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"],
		today: "Vandaag",
		monthsTitle: "Maanden",
		clear: "Wissen",
		weekStart: 1,
		format: "dd-mm-yyyy"
	};
}(jQuery));
/**
 * Norwegian translation for bootstrap-datepicker
 * George Gooding <george@nettsentrisk.no>
 */

;(function($){
  $.fn.datepicker.dates['no'] = {
    days: ['søndag', 'mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag'],
    daysShort: ['søn', 'man', 'tir', 'ons', 'tor', 'fre', 'lør'],
    daysMin: ['sø', 'ma', 'ti', 'on', 'to', 'fr', 'lø'],
    months: ['januar', 'februar', 'mars', 'april', 'mai', 'juni', 'juli', 'august', 'september', 'oktober', 'vovember', 'desember'],
    monthsShort: ['jan', 'feb', 'mar', 'apr', 'mai', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'des'],
    today: 'i dag',
    monthsTitle: 'Måneder',
    clear: 'Nullstill',
    weekStart: 1,
    format: 'dd.mm.yyyy'
  };
}(jQuery));
/**
 * Occitan translation for bootstrap-datepicker
 */

;(function($){
	$.fn.datepicker.dates['oc'] = {
		days: ["Dimenge", "Diluns", "Dimars", "Dimècres", "Dijòus", "Divendres", "Dissabte"],
		daysShort: ["Dim",  "Dil", "Dmr", "Dmc", "Dij", "Div", "Dis"],
		daysMin: ["dg", "dl", "dr", "dc", "dj", "dv", "ds"],
		months: ["Genièr", "Febrièr", "Març", "Abrial", "Mai", "Junh", "Julhet", "Agost", "Setembre", "Octobre", "Novembre", "Decembre"],
		monthsShort: ["Gen", "Feb", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Oct", "Nov", "Dec"],
		today: "Uèi",
		monthsTitle: "Meses",
		clear: "Escafar",
		weekStart: 1,
		format: "dd/mm/yyyy"
	};
}(jQuery));
/**
 * Polish translation for bootstrap-datepicker
 * Robert <rtpm@gazeta.pl>
 */

;(function($){
    $.fn.datepicker.dates['pl'] = {
        days: ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"],
        daysShort: ["Niedz.", "Pon.", "Wt.", "Śr.", "Czw.", "Piąt.", "Sob."],
        daysMin: ["Ndz.", "Pn.", "Wt.", "Śr.", "Czw.", "Pt.", "Sob."],
        months: ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"],
        monthsShort: ["Sty.", "Lut.", "Mar.", "Kwi.", "Maj", "Cze.", "Lip.", "Sie.", "Wrz.", "Paź.", "Lis.", "Gru."],
        today: "Dzisiaj",
        weekStart: 1,
        clear: "Wyczyść",
        format: "dd.mm.yyyy"
    };
}(jQuery));
/**
 * Brazilian translation for bootstrap-datepicker
 * Cauan Cabral <cauan@radig.com.br>
 */

;(function($){
	$.fn.datepicker.dates['pt-BR'] = {
		days: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
		daysShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
		daysMin: ["Do", "Se", "Te", "Qu", "Qu", "Se", "Sa"],
		months: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
		monthsShort: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
		today: "Hoje",
		monthsTitle: "Meses",
		clear: "Limpar",
		format: "dd/mm/yyyy"
	};
}(jQuery));
/**
 * Portuguese translation for bootstrap-datepicker
 * Original code: Cauan Cabral <cauan@radig.com.br>
 * Tiago Melo <tiago.blackcode@gmail.com>
 */

;(function($){
	$.fn.datepicker.dates['pt'] = {
		days: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
		daysShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
		daysMin: ["Do", "Se", "Te", "Qu", "Qu", "Se", "Sa"],
		months: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
		monthsShort: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
		today: "Hoje",
		monthsTitle: "Meses",
		clear: "Limpar",
		format: "dd/mm/yyyy"
	};
}(jQuery));
/**
 * Romanian translation for bootstrap-datepicker
 * Cristian Vasile <cristi.mie@gmail.com>
 */

;(function($){
	$.fn.datepicker.dates['ro'] = {
		days: ["Duminică", "Luni", "Marţi", "Miercuri", "Joi", "Vineri", "Sâmbătă"],
		daysShort: ["Dum", "Lun", "Mar", "Mie", "Joi", "Vin", "Sâm"],
		daysMin: ["Du", "Lu", "Ma", "Mi", "Jo", "Vi", "Sâ"],
		months: ["Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie", "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"],
		monthsShort: ["Ian", "Feb", "Mar", "Apr", "Mai", "Iun", "Iul", "Aug", "Sep", "Oct", "Nov", "Dec"],
		today: "Astăzi",
		clear: "Șterge",
		weekStart: 1,
		format: "dd/mm/yyyy"
	};
}(jQuery));
/**
 * Serbian latin translation for bootstrap-datepicker
 * Bojan Milosavlević <milboj@gmail.com>
 *
 * DEPRECATED: This language code 'rs-latin' is deprecated (invalid serbian language code) and will be removed in 2.0.
 */

;(function($){
	$.fn.datepicker.dates['rs-latin'] = {
		days: ["Nedelja","Ponedeljak", "Utorak", "Sreda", "Četvrtak", "Petak", "Subota"],
		daysShort: ["Ned", "Pon", "Uto", "Sre", "Čet", "Pet", "Sub"],
		daysMin: ["N", "Po", "U", "Sr", "Č", "Pe", "Su"],
		months: ["Januar", "Februar", "Mart", "April", "Maj", "Jun", "Jul", "Avgust", "Septembar", "Oktobar", "Novembar", "Decembar"],
		monthsShort: ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Avg", "Sep", "Okt", "Nov", "Dec"],
		today: "Danas",
		weekStart: 1,
		format: "dd.mm.yyyy"
	};

	$.fn.datepicker.deprecated('This language code "rs-latin" is deprecated (invalid serbian language code) and will be removed in 2.0. For Serbian latin support use "sr-latin" instead.');
}(jQuery));
/**
 * Serbian cyrillic translation for bootstrap-datepicker
 * Bojan Milosavlević <milboj@gmail.com>
 *
 * DEPRECATED: This language code 'rs' is deprecated (invalid serbian language code) and will be removed in 2.0.
 */

;(function($){
	$.fn.datepicker.dates['rs'] = {
		days: ["Недеља","Понедељак", "Уторак", "Среда", "Четвртак", "Петак", "Субота"],
		daysShort: ["Нед", "Пон", "Уто", "Сре", "Чет", "Пет", "Суб"],
		daysMin: ["Н", "По", "У", "Ср", "Ч", "Пе", "Су"],
		months: ["Јануар", "Фебруар", "Март", "Април", "Мај", "Јун", "Јул", "Август", "Септембар", "Октобар", "Новембар", "Децембар"],
		monthsShort: ["Јан", "Феб", "Мар", "Апр", "Мај", "Јун", "Јул", "Авг", "Сеп", "Окт", "Нов", "Дец"],
		today: "Данас",
		weekStart: 1,
		format: "dd.mm.yyyy"
	};

	$.fn.datepicker.deprecated('This language code "rs" is deprecated (invalid serbian language code) and will be removed in 2.0. For Serbian support use "sr" instead.');
}(jQuery));
/**
 * Russian translation for bootstrap-datepicker
 * Victor Taranenko <darwin@snowdale.com>
 */

;(function($){
	$.fn.datepicker.dates['ru'] = {
		days: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"],
		daysShort: ["Вск", "Пнд", "Втр", "Срд", "Чтв", "Птн", "Суб"],
		daysMin: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
		months: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
		monthsShort: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],
		today: "Сегодня",
		clear: "Очистить",
		format: "dd.mm.yyyy",
		weekStart: 1,
    monthsTitle: 'Месяцы'
	};
}(jQuery));
/**
 * Sinhala translation for bootstrap-datepicker
 * Chanaka Fernando <chanaka.fernando@hotmail.com>
 */

;(function($){
	$.fn.datepicker.dates['si'] = {
		days: ["ඉරිදා", "සඳුදා", "අඟහරුවාදා", "බදාදා", "බ්‍රහස්පතින්දා", "සිකුරාදා", "සෙනසුරාදා"],
		daysShort: ["ඉරි", "සඳු", "අඟ", "බදා", "බ්‍රහ", "සිකු", "සෙන"],
		daysMin: ["ඉ", "ස", "අ", "බ", "බ්‍ර", "සි", "සෙ"],
		months: ["ජනවාරි", "පෙබරවාරි", "මාර්තු", "අප්‍රේල්", "මැයි", "ජුනි", "ජූලි", "අගෝස්තු", "සැප්තැම්බර්", "ඔක්තෝබර්", "නොවැම්බර්", "දෙසැම්බර්"],
		monthsShort: ["ජන", "පෙබ", "මාර්", "අප්‍රේ", "මැයි", "ජුනි", "ජූලි", "අගෝ", "සැප්", "ඔක්", "නොවැ", "දෙසැ"],
		today: "අද",
		monthsTitle: "මාස",
		clear: "මකන්න",
		weekStart: 0,
		format: "yyyy-mm-dd"
	};
}(jQuery));
/**
 * Slovak translation for bootstrap-datepicker
 * Marek Lichtner <marek@licht.sk>
 * Fixes by Michal Remiš <michal.remis@gmail.com>
 */

;(function($){
	$.fn.datepicker.dates["sk"] = {
		days: ["Nedeľa", "Pondelok", "Utorok", "Streda", "Štvrtok", "Piatok", "Sobota"],
		daysShort: ["Ned", "Pon", "Uto", "Str", "Štv", "Pia", "Sob"],
		daysMin: ["Ne", "Po", "Ut", "St", "Št", "Pia", "So"],
		months: ["Január", "Február", "Marec", "Apríl", "Máj", "Jún", "Júl", "August", "September", "Október", "November", "December"],
		monthsShort: ["Jan", "Feb", "Mar", "Apr", "Máj", "Jún", "Júl", "Aug", "Sep", "Okt", "Nov", "Dec"],
		today: "Dnes",
		clear: "Vymazať",
		weekStart: 1,
		format: "d.m.yyyy"
	};
}(jQuery));
/**
 * Slovene translation for bootstrap-datepicker
 * Gregor Rudolf <gregor.rudolf@gmail.com>
 */

;(function($){
	$.fn.datepicker.dates['sl'] = {
		days: ["Nedelja", "Ponedeljek", "Torek", "Sreda", "Četrtek", "Petek", "Sobota"],
		daysShort: ["Ned", "Pon", "Tor", "Sre", "Čet", "Pet", "Sob"],
		daysMin: ["Ne", "Po", "To", "Sr", "Če", "Pe", "So"],
		months: ["Januar", "Februar", "Marec", "April", "Maj", "Junij", "Julij", "Avgust", "September", "Oktober", "November", "December"],
		monthsShort: ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Avg", "Sep", "Okt", "Nov", "Dec"],
		today: "Danes",
		weekStart: 1
	};
}(jQuery));
/**
 * Albanian translation for bootstrap-datepicker
 * Tomor Pupovci <http://www.github.com/ttomor>
 */

;(function($){
	$.fn.datepicker.dates['sq'] = {
		days: ["E Diel", "E Hënë", "E Martē", "E Mërkurë", "E Enjte", "E Premte", "E Shtunë"],
		daysShort: ["Die", "Hën", "Mar", "Mër", "Enj", "Pre", "Shtu"],
		daysMin: ["Di", "Hë", "Ma", "Më", "En", "Pr", "Sht"],
		months: ["Janar", "Shkurt", "Mars", "Prill", "Maj", "Qershor", "Korrik", "Gusht", "Shtator", "Tetor", "Nëntor", "Dhjetor"],
		monthsShort: ["Jan", "Shk", "Mar", "Pri", "Maj", "Qer", "Korr", "Gu", "Sht", "Tet", "Nën", "Dhjet"],
		today: "Sot"
	};
}(jQuery));

/**
 * Serbian latin translation for bootstrap-datepicker
 * Bojan Milosavlević <milboj@gmail.com>
 */

;(function($){
	$.fn.datepicker.dates['sr-latin'] = {
		days: ["Nedelja","Ponedeljak", "Utorak", "Sreda", "Četvrtak", "Petak", "Subota"],
		daysShort: ["Ned", "Pon", "Uto", "Sre", "Čet", "Pet", "Sub"],
		daysMin: ["N", "Po", "U", "Sr", "Č", "Pe", "Su"],
		months: ["Januar", "Februar", "Mart", "April", "Maj", "Jun", "Jul", "Avgust", "Septembar", "Oktobar", "Novembar", "Decembar"],
		monthsShort: ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Avg", "Sep", "Okt", "Nov", "Dec"],
		today: "Danas",
		weekStart: 1,
		format: "dd.mm.yyyy"
	};
}(jQuery));
/**
 * Serbian cyrillic translation for bootstrap-datepicker
 * Bojan Milosavlević <milboj@gmail.com>
 */

;(function($){
	$.fn.datepicker.dates['sr'] = {
		days: ["Недеља","Понедељак", "Уторак", "Среда", "Четвртак", "Петак", "Субота"],
		daysShort: ["Нед", "Пон", "Уто", "Сре", "Чет", "Пет", "Суб"],
		daysMin: ["Н", "По", "У", "Ср", "Ч", "Пе", "Су"],
		months: ["Јануар", "Фебруар", "Март", "Април", "Мај", "Јун", "Јул", "Август", "Септембар", "Октобар", "Новембар", "Децембар"],
		monthsShort: ["Јан", "Феб", "Мар", "Апр", "Мај", "Јун", "Јул", "Авг", "Сеп", "Окт", "Нов", "Дец"],
		today: "Данас",
		weekStart: 1,
		format: "dd.mm.yyyy"
	};
}(jQuery));
/**
 * Swedish translation for bootstrap-datepicker
 * Patrik Ragnarsson <patrik@starkast.net>
 */

;(function($){
	$.fn.datepicker.dates['sv'] = {
		days: ["söndag", "måndag", "tisdag", "onsdag", "torsdag", "fredag", "lördag"],
		daysShort: ["sön", "mån", "tis", "ons", "tor", "fre", "lör"],
		daysMin: ["sö", "må", "ti", "on", "to", "fr", "lö"],
		months: ["januari", "februari", "mars", "april", "maj", "juni", "juli", "augusti", "september", "oktober", "november", "december"],
		monthsShort: ["jan", "feb", "mar", "apr", "maj", "jun", "jul", "aug", "sep", "okt", "nov", "dec"],
		today: "Idag",
		format: "yyyy-mm-dd",
		weekStart: 1,
		clear: "Rensa"
	};
}(jQuery));
/**
 * Swahili translation for bootstrap-datepicker
 * Edwin Mugendi <https://github.com/edwinmugendi>
 * Source: http://scriptsource.org/cms/scripts/page.php?item_id=entry_detail&uid=xnfaqyzcku
 */

;(function($){
    $.fn.datepicker.dates['sw'] = {
        days: ["Jumapili", "Jumatatu", "Jumanne", "Jumatano", "Alhamisi", "Ijumaa", "Jumamosi"],
        daysShort: ["J2", "J3", "J4", "J5", "Alh", "Ij", "J1"],
        daysMin: ["2", "3", "4", "5", "A", "I", "1"],
        months: ["Januari", "Februari", "Machi", "Aprili", "Mei", "Juni", "Julai", "Agosti", "Septemba", "Oktoba", "Novemba", "Desemba"],
        monthsShort: ["Jan", "Feb", "Mac", "Apr", "Mei", "Jun", "Jul", "Ago", "Sep", "Okt", "Nov", "Des"],
        today: "Leo"
    };
}(jQuery));
/**
 * Tamil translation for bootstrap-datepicker
 * Abubacker Siddik A <abuabdul86@hotmail.com>
 */

;(function($){
	$.fn.datepicker.dates['ta'] = {
		days: ["ஞாயிறு", "திங்கள்", "செவ்வாய்", "புதன்", "வியாழன்", "வெள்ளி", "சனி"],
		daysShort: ["ஞாயி", "திங்", "செவ்", "புத", "வியா", "வெள்", "சனி"],
		daysMin: ["ஞா", "தி", "செ", "பு", "வி", "வெ", "ச"],
		months: ["ஜனவரி", "பிப்ரவரி", "மார்ச்", "ஏப்ரல்", "மே", "ஜூன்", "ஜூலை", "ஆகஸ்டு", "செப்டம்பர்", "அக்டோபர்", "நவம்பர்", "டிசம்பர்"],
		monthsShort: ["ஜன", "பிப்", "மார்", "ஏப்", "மே", "ஜூன்", "ஜூலை", "ஆக", "செப்", "அக்", "நவ", "டிச"],
		today: "இன்று",
		monthsTitle: "மாதங்கள்",
		clear: "நீக்கு",
		weekStart: 1,
		format: "dd/mm/yyyy"
	};
}(jQuery));
/**
 * Tajik (cyrillic) translation for bootstrap-datepicker
 * Bakhtiyor Bahritidinov <i@bakhtiyor.tj>
 * Orif N. Jr. <orif.zade@gmail.com>
 */

;(function($){
    $.fn.datepicker.dates['tg'] = {
        days: ["Якшанбе", "Душанбе", "Сешанбе", "Чоршанбе", "Панҷшанбе", "Ҷумъа", "Шанбе"],
        daysShort: ["Яшб", "Дшб", "Сшб", "Чшб", "Пшб", "Ҷум", "Шнб"],
        daysMin: ["Яш", "Дш", "Сш", "Чш", "Пш", "Ҷм", "Шб"],
        months: ["Январ", "Феврал", "Март", "Апрел", "Май", "Июн", "Июл", "Август", "Сентябр", "Октябр", "Ноябр", "Декабр"],
        monthsShort: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],
        today: "Имрӯз",
        monthsTitle: "Моҳҳо",
        clear: "Тоза намудан",
        weekStart: 1,
        format: "dd.mm.yyyy"
    };
}(jQuery));
/**
 * Thai translation for bootstrap-datepicker
 * Suchau Jiraprapot <seroz24@gmail.com>
 */

;(function($){
	$.fn.datepicker.dates['th'] = {
		days: ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัส", "ศุกร์", "เสาร์", "อาทิตย์"],
		daysShort: ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส", "อา"],
		daysMin: ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส", "อา"],
		months: ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"],
		monthsShort: ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."],
		today: "วันนี้"
	};
}(jQuery));
/**
 * Turkmen translation for bootstrap-datepicker
 * N'Bayramberdiyev <nbayramberdiyev@outlook.com>
 */

;(function($){
	$.fn.datepicker.dates['tk'] = {
		days: ["Ýekşenbe", "Duşenbe", "Sişenbe", "Çarşenbe", "Penşenbe", "Anna", "Şenbe"],
		daysShort: ["Ýek", "Duş", "Siş", "Çar", "Pen", "Ann", "Şen"],
		daysMin: ["Ýe", "Du", "Si", "Ça", "Pe", "An", "Şe"],
		months: ["Ýanwar", "Fewral", "Mart", "Aprel", "Maý", "Iýun", "Iýul", "Awgust", "Sentýabr", "Oktýabr", "Noýabr", "Dekabr"],
		monthsShort: ["Ýan", "Few", "Mar", "Apr", "Maý", "Iýn", "Iýl", "Awg", "Sen", "Okt", "Noý", "Dek"],
		today: "Bu gün",
		monthsTitle: "Aýlar",
		clear: "Aýyr",
		weekStart: 1,
		format: "dd.mm.yyyy"
	};
}(jQuery));
/**
 * Turkish translation for bootstrap-datepicker
 * Serkan Algur <kaisercrazy_2@hotmail.com>
 */

;(function($){
	$.fn.datepicker.dates['tr'] = {
		days: ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"],
		daysShort: ["Pz", "Pzt", "Sal", "Çrş", "Prş", "Cu", "Cts"],
		daysMin: ["Pz", "Pzt", "Sa", "Çr", "Pr", "Cu", "Ct"],
		months: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"],
		monthsShort: ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"],
		today: "Bugün",
		clear: "Temizle",
		weekStart: 1,
		format: "dd.mm.yyyy"
	};
}(jQuery));

/**
 * Ukrainian translation for bootstrap-datepicker
 * Igor Polynets
 */

;(function($){
	$.fn.datepicker.dates['ua'] = {
		days: ["Неділя", "Понеділок", "Вівторок", "Середа", "Четвер", "П'ятница", "Субота", "Неділя"],
		daysShort: ["Нед", "Пнд", "Втр", "Срд", "Чтв", "Птн", "Суб", "Нед"],
		daysMin: ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"],
		months: ["Cічень", "Лютий", "Березень", "Квітень", "Травень", "Червень", "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"],
		monthsShort: ["Січ", "Лют", "Бер", "Кві", "Тра", "Чер", "Лип", "Сер", "Вер", "Жов", "Лис", "Гру"],
		today: "Сьогодні",
		weekStart: 1
	};
}(jQuery));
/**
 * Ukrainian translation for bootstrap-datepicker
 * Igor Polynets
 */

;(function($){
	$.fn.datepicker.dates['uk'] = {
		days: ["Неділя", "Понеділок", "Вівторок", "Середа", "Четвер", "П'ятниця", "Субота"],
		daysShort: ["Нед", "Пнд", "Втр", "Срд", "Чтв", "Птн", "Суб"],
		daysMin: ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
		months: ["Cічень", "Лютий", "Березень", "Квітень", "Травень", "Червень", "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"],
		monthsShort: ["Січ", "Лют", "Бер", "Кві", "Тра", "Чер", "Лип", "Сер", "Вер", "Жов", "Лис", "Гру"],
		today: "Сьогодні",
		clear: "Очистити",
		format: "dd.mm.yyyy",
		weekStart: 1
	};
}(jQuery));
/**
 * Uzbek latin translation for bootstrap-datepicker
 * Kakhramonov Javlonbek <kakjavlon@gmail.com>
 */

;(function($){
    $.fn.datepicker.dates['uz-cyrl'] = {
        days: ["Якшанба", "Душанба", "Сешанба", "Чоршанба", "Пайшанба", "Жума", "Шанба"],
        daysShort: ["Якш", "Ду", "Се", "Чор", "Пай", "Жу", "Ша"],
        daysMin: ["Як", "Ду", "Се", "Чо", "Па", "Жу", "Ша"],
        months: ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"],
        monthsShort: ["Янв","Фев","Мар","Апр","Май","Июн","Июл","Авг","Сен","Окт","Ноя","Дек"],
        today: "Бугун",
        clear: "Ўчириш",
        format: "dd.mm.yyyy",
        weekStart: 1,
        monthsTitle: 'Ойлар'
    };
}(jQuery));
/**
 * Uzbek latin translation for bootstrap-datepicker
 * Kakhramonov Javlonbek <kakjavlon@gmail.com>
 */

;(function($){
    $.fn.datepicker.dates['uz-latn'] = {
        days: ["Yakshanba", "Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba"],
        daysShort: ["Yak", "Du", "Se", "Chor", "Pay", "Ju", "Sha"],
        daysMin: ["Ya", "Du", "Se", "Cho", "Pa", "Ju", "Sha"],
        months: ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"],
        monthsShort: ["Yan", "Fev", "Mar", "Apr", "May", "Iyn", "Iyl", "Avg", "Sen", "Okt", "Noy", "Dek"],
        today: "Bugun",
        clear: "O'chirish",
        format: "dd.mm.yyyy",
        weekStart: 1,
        monthsTitle: 'Oylar'
    };
}(jQuery));
/**
 * Vietnamese translation for bootstrap-datepicker
 * An Vo <https://github.com/anvoz/>
 */

;(function($){
	$.fn.datepicker.dates['vi'] = {
		days: ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"],
		daysShort: ["CN", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"],
		daysMin: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
		months: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"],
		monthsShort: ["Th1", "Th2", "Th3", "Th4", "Th5", "Th6", "Th7", "Th8", "Th9", "Th10", "Th11", "Th12"],
		today: "Hôm nay",
		clear: "Xóa",
		format: "dd/mm/yyyy"
	};
}(jQuery));
/**
 * Simplified Chinese translation for bootstrap-datepicker
 * Yuan Cheung <advanimal@gmail.com>
 */

;(function($){
	$.fn.datepicker.dates['zh-CN'] = {
		days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
		daysShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
		daysMin:  ["日", "一", "二", "三", "四", "五", "六"],
		months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
		monthsShort: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
		today: "今日",
		clear: "清除",
		format: "yyyy年mm月dd日",
		titleFormat: "yyyy年mm月",
		weekStart: 1
	};
}(jQuery));
/**
 * Traditional Chinese translation for bootstrap-datepicker
 * Rung-Sheng Jang <daniel@i-trend.co.cc>
 * FrankWu  <frankwu100@gmail.com> Fix more appropriate use of Traditional Chinese habit
 */

;(function($){
	$.fn.datepicker.dates['zh-TW'] = {
		days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
		daysShort: ["週日", "週一", "週二", "週三", "週四", "週五", "週六"],
		daysMin:  ["日", "一", "二", "三", "四", "五", "六"],
		months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
		monthsShort: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
		today: "今天",
		format: "yyyy年mm月dd日",
		weekStart: 1,
		clear: "清除"
	};
}(jQuery));


(function() {


}).call(this);
(function() {
  var context = this;

  (function() {
    (function() {
      var slice = [].slice;

      this.ActionCable = {
        INTERNAL: {
          "message_types": {
            "welcome": "welcome",
            "ping": "ping",
            "confirmation": "confirm_subscription",
            "rejection": "reject_subscription"
          },
          "default_mount_path": "/cable",
          "protocols": ["actioncable-v1-json", "actioncable-unsupported"]
        },
        WebSocket: window.WebSocket,
        logger: window.console,
        createConsumer: function(url) {
          var ref;
          if (url == null) {
            url = (ref = this.getConfig("url")) != null ? ref : this.INTERNAL.default_mount_path;
          }
          return new ActionCable.Consumer(this.createWebSocketURL(url));
        },
        getConfig: function(name) {
          var element;
          element = document.head.querySelector("meta[name='action-cable-" + name + "']");
          return element != null ? element.getAttribute("content") : void 0;
        },
        createWebSocketURL: function(url) {
          var a;
          if (url && !/^wss?:/i.test(url)) {
            a = document.createElement("a");
            a.href = url;
            a.href = a.href;
            a.protocol = a.protocol.replace("http", "ws");
            return a.href;
          } else {
            return url;
          }
        },
        startDebugging: function() {
          return this.debugging = true;
        },
        stopDebugging: function() {
          return this.debugging = null;
        },
        log: function() {
          var messages, ref;
          messages = 1 <= arguments.length ? slice.call(arguments, 0) : [];
          if (this.debugging) {
            messages.push(Date.now());
            return (ref = this.logger).log.apply(ref, ["[ActionCable]"].concat(slice.call(messages)));
          }
        }
      };

    }).call(this);
  }).call(context);

  var ActionCable = context.ActionCable;

  (function() {
    (function() {
      var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

      ActionCable.ConnectionMonitor = (function() {
        var clamp, now, secondsSince;

        ConnectionMonitor.pollInterval = {
          min: 3,
          max: 30
        };

        ConnectionMonitor.staleThreshold = 6;

        function ConnectionMonitor(connection) {
          this.connection = connection;
          this.visibilityDidChange = bind(this.visibilityDidChange, this);
          this.reconnectAttempts = 0;
        }

        ConnectionMonitor.prototype.start = function() {
          if (!this.isRunning()) {
            this.startedAt = now();
            delete this.stoppedAt;
            this.startPolling();
            document.addEventListener("visibilitychange", this.visibilityDidChange);
            return ActionCable.log("ConnectionMonitor started. pollInterval = " + (this.getPollInterval()) + " ms");
          }
        };

        ConnectionMonitor.prototype.stop = function() {
          if (this.isRunning()) {
            this.stoppedAt = now();
            this.stopPolling();
            document.removeEventListener("visibilitychange", this.visibilityDidChange);
            return ActionCable.log("ConnectionMonitor stopped");
          }
        };

        ConnectionMonitor.prototype.isRunning = function() {
          return (this.startedAt != null) && (this.stoppedAt == null);
        };

        ConnectionMonitor.prototype.recordPing = function() {
          return this.pingedAt = now();
        };

        ConnectionMonitor.prototype.recordConnect = function() {
          this.reconnectAttempts = 0;
          this.recordPing();
          delete this.disconnectedAt;
          return ActionCable.log("ConnectionMonitor recorded connect");
        };

        ConnectionMonitor.prototype.recordDisconnect = function() {
          this.disconnectedAt = now();
          return ActionCable.log("ConnectionMonitor recorded disconnect");
        };

        ConnectionMonitor.prototype.startPolling = function() {
          this.stopPolling();
          return this.poll();
        };

        ConnectionMonitor.prototype.stopPolling = function() {
          return clearTimeout(this.pollTimeout);
        };

        ConnectionMonitor.prototype.poll = function() {
          return this.pollTimeout = setTimeout((function(_this) {
            return function() {
              _this.reconnectIfStale();
              return _this.poll();
            };
          })(this), this.getPollInterval());
        };

        ConnectionMonitor.prototype.getPollInterval = function() {
          var interval, max, min, ref;
          ref = this.constructor.pollInterval, min = ref.min, max = ref.max;
          interval = 5 * Math.log(this.reconnectAttempts + 1);
          return Math.round(clamp(interval, min, max) * 1000);
        };

        ConnectionMonitor.prototype.reconnectIfStale = function() {
          if (this.connectionIsStale()) {
            ActionCable.log("ConnectionMonitor detected stale connection. reconnectAttempts = " + this.reconnectAttempts + ", pollInterval = " + (this.getPollInterval()) + " ms, time disconnected = " + (secondsSince(this.disconnectedAt)) + " s, stale threshold = " + this.constructor.staleThreshold + " s");
            this.reconnectAttempts++;
            if (this.disconnectedRecently()) {
              return ActionCable.log("ConnectionMonitor skipping reopening recent disconnect");
            } else {
              ActionCable.log("ConnectionMonitor reopening");
              return this.connection.reopen();
            }
          }
        };

        ConnectionMonitor.prototype.connectionIsStale = function() {
          var ref;
          return secondsSince((ref = this.pingedAt) != null ? ref : this.startedAt) > this.constructor.staleThreshold;
        };

        ConnectionMonitor.prototype.disconnectedRecently = function() {
          return this.disconnectedAt && secondsSince(this.disconnectedAt) < this.constructor.staleThreshold;
        };

        ConnectionMonitor.prototype.visibilityDidChange = function() {
          if (document.visibilityState === "visible") {
            return setTimeout((function(_this) {
              return function() {
                if (_this.connectionIsStale() || !_this.connection.isOpen()) {
                  ActionCable.log("ConnectionMonitor reopening stale connection on visibilitychange. visbilityState = " + document.visibilityState);
                  return _this.connection.reopen();
                }
              };
            })(this), 200);
          }
        };

        now = function() {
          return new Date().getTime();
        };

        secondsSince = function(time) {
          return (now() - time) / 1000;
        };

        clamp = function(number, min, max) {
          return Math.max(min, Math.min(max, number));
        };

        return ConnectionMonitor;

      })();

    }).call(this);
    (function() {
      var i, message_types, protocols, ref, supportedProtocols, unsupportedProtocol,
        slice = [].slice,
        bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
        indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

      ref = ActionCable.INTERNAL, message_types = ref.message_types, protocols = ref.protocols;

      supportedProtocols = 2 <= protocols.length ? slice.call(protocols, 0, i = protocols.length - 1) : (i = 0, []), unsupportedProtocol = protocols[i++];

      ActionCable.Connection = (function() {
        Connection.reopenDelay = 500;

        function Connection(consumer) {
          this.consumer = consumer;
          this.open = bind(this.open, this);
          this.subscriptions = this.consumer.subscriptions;
          this.monitor = new ActionCable.ConnectionMonitor(this);
          this.disconnected = true;
        }

        Connection.prototype.send = function(data) {
          if (this.isOpen()) {
            this.webSocket.send(JSON.stringify(data));
            return true;
          } else {
            return false;
          }
        };

        Connection.prototype.open = function() {
          if (this.isActive()) {
            ActionCable.log("Attempted to open WebSocket, but existing socket is " + (this.getState()));
            return false;
          } else {
            ActionCable.log("Opening WebSocket, current state is " + (this.getState()) + ", subprotocols: " + protocols);
            if (this.webSocket != null) {
              this.uninstallEventHandlers();
            }
            this.webSocket = new ActionCable.WebSocket(this.consumer.url, protocols);
            this.installEventHandlers();
            this.monitor.start();
            return true;
          }
        };

        Connection.prototype.close = function(arg) {
          var allowReconnect, ref1;
          allowReconnect = (arg != null ? arg : {
            allowReconnect: true
          }).allowReconnect;
          if (!allowReconnect) {
            this.monitor.stop();
          }
          if (this.isActive()) {
            return (ref1 = this.webSocket) != null ? ref1.close() : void 0;
          }
        };

        Connection.prototype.reopen = function() {
          var error;
          ActionCable.log("Reopening WebSocket, current state is " + (this.getState()));
          if (this.isActive()) {
            try {
              return this.close();
            } catch (error1) {
              error = error1;
              return ActionCable.log("Failed to reopen WebSocket", error);
            } finally {
              ActionCable.log("Reopening WebSocket in " + this.constructor.reopenDelay + "ms");
              setTimeout(this.open, this.constructor.reopenDelay);
            }
          } else {
            return this.open();
          }
        };

        Connection.prototype.getProtocol = function() {
          var ref1;
          return (ref1 = this.webSocket) != null ? ref1.protocol : void 0;
        };

        Connection.prototype.isOpen = function() {
          return this.isState("open");
        };

        Connection.prototype.isActive = function() {
          return this.isState("open", "connecting");
        };

        Connection.prototype.isProtocolSupported = function() {
          var ref1;
          return ref1 = this.getProtocol(), indexOf.call(supportedProtocols, ref1) >= 0;
        };

        Connection.prototype.isState = function() {
          var ref1, states;
          states = 1 <= arguments.length ? slice.call(arguments, 0) : [];
          return ref1 = this.getState(), indexOf.call(states, ref1) >= 0;
        };

        Connection.prototype.getState = function() {
          var ref1, state, value;
          for (state in WebSocket) {
            value = WebSocket[state];
            if (value === ((ref1 = this.webSocket) != null ? ref1.readyState : void 0)) {
              return state.toLowerCase();
            }
          }
          return null;
        };

        Connection.prototype.installEventHandlers = function() {
          var eventName, handler;
          for (eventName in this.events) {
            handler = this.events[eventName].bind(this);
            this.webSocket["on" + eventName] = handler;
          }
        };

        Connection.prototype.uninstallEventHandlers = function() {
          var eventName;
          for (eventName in this.events) {
            this.webSocket["on" + eventName] = function() {};
          }
        };

        Connection.prototype.events = {
          message: function(event) {
            var identifier, message, ref1, type;
            if (!this.isProtocolSupported()) {
              return;
            }
            ref1 = JSON.parse(event.data), identifier = ref1.identifier, message = ref1.message, type = ref1.type;
            switch (type) {
              case message_types.welcome:
                this.monitor.recordConnect();
                return this.subscriptions.reload();
              case message_types.ping:
                return this.monitor.recordPing();
              case message_types.confirmation:
                return this.subscriptions.notify(identifier, "connected");
              case message_types.rejection:
                return this.subscriptions.reject(identifier);
              default:
                return this.subscriptions.notify(identifier, "received", message);
            }
          },
          open: function() {
            ActionCable.log("WebSocket onopen event, using '" + (this.getProtocol()) + "' subprotocol");
            this.disconnected = false;
            if (!this.isProtocolSupported()) {
              ActionCable.log("Protocol is unsupported. Stopping monitor and disconnecting.");
              return this.close({
                allowReconnect: false
              });
            }
          },
          close: function(event) {
            ActionCable.log("WebSocket onclose event");
            if (this.disconnected) {
              return;
            }
            this.disconnected = true;
            this.monitor.recordDisconnect();
            return this.subscriptions.notifyAll("disconnected", {
              willAttemptReconnect: this.monitor.isRunning()
            });
          },
          error: function() {
            return ActionCable.log("WebSocket onerror event");
          }
        };

        return Connection;

      })();

    }).call(this);
    (function() {
      var slice = [].slice;

      ActionCable.Subscriptions = (function() {
        function Subscriptions(consumer) {
          this.consumer = consumer;
          this.subscriptions = [];
        }

        Subscriptions.prototype.create = function(channelName, mixin) {
          var channel, params, subscription;
          channel = channelName;
          params = typeof channel === "object" ? channel : {
            channel: channel
          };
          subscription = new ActionCable.Subscription(this.consumer, params, mixin);
          return this.add(subscription);
        };

        Subscriptions.prototype.add = function(subscription) {
          this.subscriptions.push(subscription);
          this.consumer.ensureActiveConnection();
          this.notify(subscription, "initialized");
          this.sendCommand(subscription, "subscribe");
          return subscription;
        };

        Subscriptions.prototype.remove = function(subscription) {
          this.forget(subscription);
          if (!this.findAll(subscription.identifier).length) {
            this.sendCommand(subscription, "unsubscribe");
          }
          return subscription;
        };

        Subscriptions.prototype.reject = function(identifier) {
          var i, len, ref, results, subscription;
          ref = this.findAll(identifier);
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            subscription = ref[i];
            this.forget(subscription);
            this.notify(subscription, "rejected");
            results.push(subscription);
          }
          return results;
        };

        Subscriptions.prototype.forget = function(subscription) {
          var s;
          this.subscriptions = (function() {
            var i, len, ref, results;
            ref = this.subscriptions;
            results = [];
            for (i = 0, len = ref.length; i < len; i++) {
              s = ref[i];
              if (s !== subscription) {
                results.push(s);
              }
            }
            return results;
          }).call(this);
          return subscription;
        };

        Subscriptions.prototype.findAll = function(identifier) {
          var i, len, ref, results, s;
          ref = this.subscriptions;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            s = ref[i];
            if (s.identifier === identifier) {
              results.push(s);
            }
          }
          return results;
        };

        Subscriptions.prototype.reload = function() {
          var i, len, ref, results, subscription;
          ref = this.subscriptions;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            subscription = ref[i];
            results.push(this.sendCommand(subscription, "subscribe"));
          }
          return results;
        };

        Subscriptions.prototype.notifyAll = function() {
          var args, callbackName, i, len, ref, results, subscription;
          callbackName = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
          ref = this.subscriptions;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            subscription = ref[i];
            results.push(this.notify.apply(this, [subscription, callbackName].concat(slice.call(args))));
          }
          return results;
        };

        Subscriptions.prototype.notify = function() {
          var args, callbackName, i, len, results, subscription, subscriptions;
          subscription = arguments[0], callbackName = arguments[1], args = 3 <= arguments.length ? slice.call(arguments, 2) : [];
          if (typeof subscription === "string") {
            subscriptions = this.findAll(subscription);
          } else {
            subscriptions = [subscription];
          }
          results = [];
          for (i = 0, len = subscriptions.length; i < len; i++) {
            subscription = subscriptions[i];
            results.push(typeof subscription[callbackName] === "function" ? subscription[callbackName].apply(subscription, args) : void 0);
          }
          return results;
        };

        Subscriptions.prototype.sendCommand = function(subscription, command) {
          var identifier;
          identifier = subscription.identifier;
          return this.consumer.send({
            command: command,
            identifier: identifier
          });
        };

        return Subscriptions;

      })();

    }).call(this);
    (function() {
      ActionCable.Subscription = (function() {
        var extend;

        function Subscription(consumer, params, mixin) {
          this.consumer = consumer;
          if (params == null) {
            params = {};
          }
          this.identifier = JSON.stringify(params);
          extend(this, mixin);
        }

        Subscription.prototype.perform = function(action, data) {
          if (data == null) {
            data = {};
          }
          data.action = action;
          return this.send(data);
        };

        Subscription.prototype.send = function(data) {
          return this.consumer.send({
            command: "message",
            identifier: this.identifier,
            data: JSON.stringify(data)
          });
        };

        Subscription.prototype.unsubscribe = function() {
          return this.consumer.subscriptions.remove(this);
        };

        extend = function(object, properties) {
          var key, value;
          if (properties != null) {
            for (key in properties) {
              value = properties[key];
              object[key] = value;
            }
          }
          return object;
        };

        return Subscription;

      })();

    }).call(this);
    (function() {
      ActionCable.Consumer = (function() {
        function Consumer(url) {
          this.url = url;
          this.subscriptions = new ActionCable.Subscriptions(this);
          this.connection = new ActionCable.Connection(this);
        }

        Consumer.prototype.send = function(data) {
          return this.connection.send(data);
        };

        Consumer.prototype.connect = function() {
          return this.connection.open();
        };

        Consumer.prototype.disconnect = function() {
          return this.connection.close({
            allowReconnect: false
          });
        };

        Consumer.prototype.ensureActiveConnection = function() {
          if (!this.connection.isActive()) {
            return this.connection.open();
          }
        };

        return Consumer;

      })();

    }).call(this);
  }).call(this);

  if (typeof module === "object" && module.exports) {
    module.exports = ActionCable;
  } else if (typeof define === "function" && define.amd) {
    define(ActionCable);
  }
}).call(this);
// Action Cable provides the framework to deal with WebSockets in Rails.
// You can generate new channels where WebSocket features live using the `rails generate channel` command.
//




(function() {
  this.App || (this.App = {});

  App.cable = ActionCable.createConsumer();

}).call(this);
(function() {


}).call(this);
(function() {


}).call(this);
$(document).ready(function() {
  $('#information_request_instrument_ids').select2({
    placeholder: "Select associated instruments",
    theme: "bootstrap"
  });
  $('#information_request_equipment_ids').select2({
    placeholder: "Select associated equipment",
    theme: "bootstrap"
  });
  $('#information_request_handvalve_ids').select2({
    placeholder: "Select associated handvalves",
    theme: "bootstrap"
  });
});





(function() {


}).call(this);
(function() {


}).call(this);
(function() {


}).call(this);
(function() {


}).call(this);
(function() {


}).call(this);
(function() {


}).call(this);
(function() {


}).call(this);
(function() {


}).call(this);
(function() {


}).call(this);
(function() {


}).call(this);
(function() {


}).call(this);
(function() {


}).call(this);
// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, or any plugin's
// vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//







;
