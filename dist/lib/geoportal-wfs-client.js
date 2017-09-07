var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var xhr = new XMLHttpRequest();
(function (f) { if (typeof exports === "object" && typeof module !== "undefined") {
    module.exports = f();
}
else if (typeof define === "function" && define.amd) {
    define([], f);
}
else {
    var g;
    if (typeof window !== "undefined") {
        g = window;
    }
    else if (typeof global !== "undefined") {
        g = global;
    }
    else if (typeof self !== "undefined") {
        g = self;
    }
    else {
        g = this;
    }
    g.GeoportalWfsClient = f();
} })(function () {
    var define, module, exports;
    return (function e(t, n, r) { function s(o, u) { if (!n[o]) {
        if (!t[o]) {
            var a = typeof require == "function" && require;
            if (!u && a)
                return a(o, !0);
            if (i)
                return i(o, !0);
            var f = new Error("Cannot find module '" + o + "'");
            throw f.code = "MODULE_NOT_FOUND", f;
        }
        var l = n[o] = { exports: {} };
        t[o][0].call(l.exports, function (e) { var n = t[o][1][e]; return s(n ? n : e); }, l, l.exports, e, t, n, r);
    } return n[o].exports; } var i = typeof require == "function" && require; for (var o = 0; o < r.length; o++)
        s(r[o]); return s; })({ 1: [function (require, module, exports) {
                module.exports = require('./src/Client.js');
            }, { "./src/Client.js": 36 }], 2: [function (require, module, exports) {
                var coordEach = require('@turf/meta').coordEach;
                module.exports = function flip(input) {
                    input = JSON.parse(JSON.stringify(input));
                    coordEach(input, function (coord) {
                        coord.reverse();
                    });
                    return input;
                };
            }, { "@turf/meta": 3 }], 3: [function (require, module, exports) {
                function coordEach(layer, callback, excludeWrapCoord) {
                    var i, j, k, g, l, geometry, stopG, coords, geometryMaybeCollection, wrapShrink = 0, isGeometryCollection, isFeatureCollection = layer.type === 'FeatureCollection', isFeature = layer.type === 'Feature', stop = isFeatureCollection ? layer.features.length : 1;
                    for (i = 0; i < stop; i++) {
                        geometryMaybeCollection = (isFeatureCollection ? layer.features[i].geometry :
                            (isFeature ? layer.geometry : layer));
                        isGeometryCollection = geometryMaybeCollection.type === 'GeometryCollection';
                        stopG = isGeometryCollection ? geometryMaybeCollection.geometries.length : 1;
                        for (g = 0; g < stopG; g++) {
                            geometry = isGeometryCollection ?
                                geometryMaybeCollection.geometries[g] : geometryMaybeCollection;
                            coords = geometry.coordinates;
                            wrapShrink = (excludeWrapCoord &&
                                (geometry.type === 'Polygon' || geometry.type === 'MultiPolygon')) ?
                                1 : 0;
                            if (geometry.type === 'Point') {
                                callback(coords);
                            }
                            else if (geometry.type === 'LineString' || geometry.type === 'MultiPoint') {
                                for (j = 0; j < coords.length; j++)
                                    callback(coords[j]);
                            }
                            else if (geometry.type === 'Polygon' || geometry.type === 'MultiLineString') {
                                for (j = 0; j < coords.length; j++)
                                    for (k = 0; k < coords[j].length - wrapShrink; k++)
                                        callback(coords[j][k]);
                            }
                            else if (geometry.type === 'MultiPolygon') {
                                for (j = 0; j < coords.length; j++)
                                    for (k = 0; k < coords[j].length; k++)
                                        for (l = 0; l < coords[j][k].length - wrapShrink; l++)
                                            callback(coords[j][k][l]);
                            }
                            else if (geometry.type === 'GeometryCollection') {
                                for (j = 0; j < geometry.geometries.length; j++)
                                    coordEach(geometry.geometries[j], callback, excludeWrapCoord);
                            }
                            else {
                                throw new Error('Unknown Geometry Type');
                            }
                        }
                    }
                }
                module.exports.coordEach = coordEach;
                function coordReduce(layer, callback, memo, excludeWrapCoord) {
                    coordEach(layer, function (coord) {
                        memo = callback(memo, coord);
                    }, excludeWrapCoord);
                    return memo;
                }
                module.exports.coordReduce = coordReduce;
                function propEach(layer, callback) {
                    var i;
                    switch (layer.type) {
                        case 'FeatureCollection':
                            for (i = 0; i < layer.features.length; i++) {
                                callback(layer.features[i].properties, i);
                            }
                            break;
                        case 'Feature':
                            callback(layer.properties, 0);
                            break;
                    }
                }
                module.exports.propEach = propEach;
                function propReduce(layer, callback, memo) {
                    propEach(layer, function (prop, i) {
                        memo = callback(memo, prop, i);
                    });
                    return memo;
                }
                module.exports.propReduce = propReduce;
                function featureEach(layer, callback) {
                    if (layer.type === 'Feature') {
                        callback(layer, 0);
                    }
                    else if (layer.type === 'FeatureCollection') {
                        for (var i = 0; i < layer.features.length; i++) {
                            callback(layer.features[i], i);
                        }
                    }
                }
                module.exports.featureEach = featureEach;
                function coordAll(layer) {
                    var coords = [];
                    coordEach(layer, function (coord) {
                        coords.push(coord);
                    });
                    return coords;
                }
                module.exports.coordAll = coordAll;
                function geomEach(layer, callback) {
                    var i, j, g, geometry, stopG, geometryMaybeCollection, isGeometryCollection, isFeatureCollection = layer.type === 'FeatureCollection', isFeature = layer.type === 'Feature', stop = isFeatureCollection ? layer.features.length : 1;
                    for (i = 0; i < stop; i++) {
                        geometryMaybeCollection = (isFeatureCollection ? layer.features[i].geometry :
                            (isFeature ? layer.geometry : layer));
                        isGeometryCollection = geometryMaybeCollection.type === 'GeometryCollection';
                        stopG = isGeometryCollection ? geometryMaybeCollection.geometries.length : 1;
                        for (g = 0; g < stopG; g++) {
                            geometry = isGeometryCollection ?
                                geometryMaybeCollection.geometries[g] : geometryMaybeCollection;
                            if (geometry.type === 'Point' ||
                                geometry.type === 'LineString' ||
                                geometry.type === 'MultiPoint' ||
                                geometry.type === 'Polygon' ||
                                geometry.type === 'MultiLineString' ||
                                geometry.type === 'MultiPolygon') {
                                callback(geometry);
                            }
                            else if (geometry.type === 'GeometryCollection') {
                                for (j = 0; j < geometry.geometries.length; j++)
                                    callback(geometry.geometries[j]);
                            }
                            else {
                                throw new Error('Unknown Geometry Type');
                            }
                        }
                    }
                }
                module.exports.geomEach = geomEach;
            }, {}], 4: [function (require, module, exports) {
                module.exports = require('./lib/axios');
            }, { "./lib/axios": 6 }], 5: [function (require, module, exports) {
                (function (process) {
                    'use strict';
                    var utils = require('./../utils');
                    var settle = require('./../core/settle');
                    var buildURL = require('./../helpers/buildURL');
                    var parseHeaders = require('./../helpers/parseHeaders');
                    var isURLSameOrigin = require('./../helpers/isURLSameOrigin');
                    var createError = require('../core/createError');
                    var btoa = (typeof window !== 'undefined' && window.btoa && window.btoa.bind(window)) || require('./../helpers/btoa');
                    module.exports = function xhrAdapter(config) {
                        return new Promise(function dispatchXhrRequest(resolve, reject) {
                            var requestData = config.data;
                            var requestHeaders = config.headers;
                            if (utils.isFormData(requestData)) {
                                delete requestHeaders['Content-Type'];
                            }
                            var request = new XMLHttpRequest();
                            var loadEvent = 'onreadystatechange';
                            var xDomain = false;
                            if (process.env.NODE_ENV !== 'test' &&
                                typeof window !== 'undefined' &&
                                window.XDomainRequest && !('withCredentials' in request) &&
                                !isURLSameOrigin(config.url)) {
                                request = new window.XDomainRequest();
                                loadEvent = 'onload';
                                xDomain = true;
                                request.onprogress = function handleProgress() { };
                                request.ontimeout = function handleTimeout() { };
                            }
                            if (config.auth) {
                                var username = config.auth.username || '';
                                var password = config.auth.password || '';
                                requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
                            }
                            request.open(config.method.toUpperCase(), buildURL(config.url, config.params, config.paramsSerializer), true);
                            request.timeout = config.timeout;
                            request[loadEvent] = function handleLoad() {
                                if (!request || (request.readyState !== 4 && !xDomain)) {
                                    return;
                                }
                                if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
                                    return;
                                }
                                var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
                                var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
                                var response = {
                                    data: responseData,
                                    status: request.status === 1223 ? 204 : request.status,
                                    statusText: request.status === 1223 ? 'No Content' : request.statusText,
                                    headers: responseHeaders,
                                    config: config,
                                    request: request
                                };
                                settle(resolve, reject, response);
                                request = null;
                            };
                            request.onerror = function handleError() {
                                reject(createError('Network Error', config));
                                request = null;
                            };
                            request.ontimeout = function handleTimeout() {
                                reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED'));
                                request = null;
                            };
                            if (utils.isStandardBrowserEnv()) {
                                var cookies = require('./../helpers/cookies');
                                var xsrfValue = (config.withCredentials || isURLSameOrigin(config.url)) && config.xsrfCookieName ?
                                    cookies.read(config.xsrfCookieName) :
                                    undefined;
                                if (xsrfValue) {
                                    requestHeaders[config.xsrfHeaderName] = xsrfValue;
                                }
                            }
                            if ('setRequestHeader' in request) {
                                utils.forEach(requestHeaders, function setRequestHeader(val, key) {
                                    if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
                                        delete requestHeaders[key];
                                    }
                                    else {
                                        request.setRequestHeader(key, val);
                                    }
                                });
                            }
                            if (config.withCredentials) {
                                request.withCredentials = true;
                            }
                            if (config.responseType) {
                                try {
                                    request.responseType = config.responseType;
                                }
                                catch (e) {
                                    if (request.responseType !== 'json') {
                                        throw e;
                                    }
                                }
                            }
                            if (typeof config.onDownloadProgress === 'function') {
                                request.addEventListener('progress', config.onDownloadProgress);
                            }
                            if (typeof config.onUploadProgress === 'function' && request.upload) {
                                request.upload.addEventListener('progress', config.onUploadProgress);
                            }
                            if (config.cancelToken) {
                                config.cancelToken.promise.then(function onCanceled(cancel) {
                                    if (!request) {
                                        return;
                                    }
                                    request.abort();
                                    reject(cancel);
                                    request = null;
                                });
                            }
                            if (requestData === undefined) {
                                requestData = null;
                            }
                            request.send(requestData);
                        });
                    };
                }).call(this, require('_process'));
            }, { "../core/createError": 12, "./../core/settle": 15, "./../helpers/btoa": 19, "./../helpers/buildURL": 20, "./../helpers/cookies": 22, "./../helpers/isURLSameOrigin": 24, "./../helpers/parseHeaders": 26, "./../utils": 28, "_process": 29 }], 6: [function (require, module, exports) {
                'use strict';
                var utils = require('./utils');
                var bind = require('./helpers/bind');
                var Axios = require('./core/Axios');
                var defaults = require('./defaults');
                function createInstance(defaultConfig) {
                    var context = new Axios(defaultConfig);
                    var instance = bind(Axios.prototype.request, context);
                    utils.extend(instance, Axios.prototype, context);
                    utils.extend(instance, context);
                    return instance;
                }
                var axios = createInstance(defaults);
                axios.Axios = Axios;
                axios.create = function create(instanceConfig) {
                    return createInstance(utils.merge(defaults, instanceConfig));
                };
                axios.Cancel = require('./cancel/Cancel');
                axios.CancelToken = require('./cancel/CancelToken');
                axios.isCancel = require('./cancel/isCancel');
                axios.all = function all(promises) {
                    return Promise.all(promises);
                };
                axios.spread = require('./helpers/spread');
                module.exports = axios;
                module.exports.default = axios;
            }, { "./cancel/Cancel": 7, "./cancel/CancelToken": 8, "./cancel/isCancel": 9, "./core/Axios": 10, "./defaults": 17, "./helpers/bind": 18, "./helpers/spread": 27, "./utils": 28 }], 7: [function (require, module, exports) {
                'use strict';
                function Cancel(message) {
                    this.message = message;
                }
                Cancel.prototype.toString = function toString() {
                    return 'Cancel' + (this.message ? ': ' + this.message : '');
                };
                Cancel.prototype.__CANCEL__ = true;
                module.exports = Cancel;
            }, {}], 8: [function (require, module, exports) {
                'use strict';
                var Cancel = require('./Cancel');
                function CancelToken(executor) {
                    if (typeof executor !== 'function') {
                        throw new TypeError('executor must be a function.');
                    }
                    var resolvePromise;
                    this.promise = new Promise(function promiseExecutor(resolve) {
                        resolvePromise = resolve;
                    });
                    var token = this;
                    executor(function cancel(message) {
                        if (token.reason) {
                            return;
                        }
                        token.reason = new Cancel(message);
                        resolvePromise(token.reason);
                    });
                }
                CancelToken.prototype.throwIfRequested = function throwIfRequested() {
                    if (this.reason) {
                        throw this.reason;
                    }
                };
                CancelToken.source = function source() {
                    var cancel;
                    var token = new CancelToken(function executor(c) {
                        cancel = c;
                    });
                    return {
                        token: token,
                        cancel: cancel
                    };
                };
                module.exports = CancelToken;
            }, { "./Cancel": 7 }], 9: [function (require, module, exports) {
                'use strict';
                module.exports = function isCancel(value) {
                    return !!(value && value.__CANCEL__);
                };
            }, {}], 10: [function (require, module, exports) {
                'use strict';
                var defaults = require('./../defaults');
                var utils = require('./../utils');
                var InterceptorManager = require('./InterceptorManager');
                var dispatchRequest = require('./dispatchRequest');
                var isAbsoluteURL = require('./../helpers/isAbsoluteURL');
                var combineURLs = require('./../helpers/combineURLs');
                function Axios(instanceConfig) {
                    this.defaults = instanceConfig;
                    this.interceptors = {
                        request: new InterceptorManager(),
                        response: new InterceptorManager()
                    };
                }
                Axios.prototype.request = function request(config) {
                    if (typeof config === 'string') {
                        config = utils.merge({
                            url: arguments[0]
                        }, arguments[1]);
                    }
                    config = utils.merge(defaults, this.defaults, { method: 'get' }, config);
                    if (config.baseURL && !isAbsoluteURL(config.url)) {
                        config.url = combineURLs(config.baseURL, config.url);
                    }
                    var chain = [dispatchRequest, undefined];
                    var promise = Promise.resolve(config);
                    this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
                        chain.unshift(interceptor.fulfilled, interceptor.rejected);
                    });
                    this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
                        chain.push(interceptor.fulfilled, interceptor.rejected);
                    });
                    while (chain.length) {
                        promise = promise.then(chain.shift(), chain.shift());
                    }
                    return promise;
                };
                utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
                    Axios.prototype[method] = function (url, config) {
                        return this.request(utils.merge(config || {}, {
                            method: method,
                            url: url
                        }));
                    };
                });
                utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
                    Axios.prototype[method] = function (url, data, config) {
                        return this.request(utils.merge(config || {}, {
                            method: method,
                            url: url,
                            data: data
                        }));
                    };
                });
                module.exports = Axios;
            }, { "./../defaults": 17, "./../helpers/combineURLs": 21, "./../helpers/isAbsoluteURL": 23, "./../utils": 28, "./InterceptorManager": 11, "./dispatchRequest": 13 }], 11: [function (require, module, exports) {
                'use strict';
                var utils = require('./../utils');
                function InterceptorManager() {
                    this.handlers = [];
                }
                InterceptorManager.prototype.use = function use(fulfilled, rejected) {
                    this.handlers.push({
                        fulfilled: fulfilled,
                        rejected: rejected
                    });
                    return this.handlers.length - 1;
                };
                InterceptorManager.prototype.eject = function eject(id) {
                    if (this.handlers[id]) {
                        this.handlers[id] = null;
                    }
                };
                InterceptorManager.prototype.forEach = function forEach(fn) {
                    utils.forEach(this.handlers, function forEachHandler(h) {
                        if (h !== null) {
                            fn(h);
                        }
                    });
                };
                module.exports = InterceptorManager;
            }, { "./../utils": 28 }], 12: [function (require, module, exports) {
                'use strict';
                var enhanceError = require('./enhanceError');
                module.exports = function createError(message, config, code, response) {
                    var error = new Error(message);
                    return enhanceError(error, config, code, response);
                };
            }, { "./enhanceError": 14 }], 13: [function (require, module, exports) {
                'use strict';
                var utils = require('./../utils');
                var transformData = require('./transformData');
                var isCancel = require('../cancel/isCancel');
                var defaults = require('../defaults');
                function throwIfCancellationRequested(config) {
                    if (config.cancelToken) {
                        config.cancelToken.throwIfRequested();
                    }
                }
                module.exports = function dispatchRequest(config) {
                    throwIfCancellationRequested(config);
                    config.headers = config.headers || {};
                    config.data = transformData(config.data, config.headers, config.transformRequest);
                    config.headers = utils.merge(config.headers.common || {}, config.headers[config.method] || {}, config.headers || {});
                    utils.forEach(['delete', 'get', 'head', 'post', 'put', 'patch', 'common'], function cleanHeaderConfig(method) {
                        delete config.headers[method];
                    });
                    var adapter = config.adapter || defaults.adapter;
                    return adapter(config).then(function onAdapterResolution(response) {
                        throwIfCancellationRequested(config);
                        response.data = transformData(response.data, response.headers, config.transformResponse);
                        return response;
                    }, function onAdapterRejection(reason) {
                        if (!isCancel(reason)) {
                            throwIfCancellationRequested(config);
                            if (reason && reason.response) {
                                reason.response.data = transformData(reason.response.data, reason.response.headers, config.transformResponse);
                            }
                        }
                        return Promise.reject(reason);
                    });
                };
            }, { "../cancel/isCancel": 9, "../defaults": 17, "./../utils": 28, "./transformData": 16 }], 14: [function (require, module, exports) {
                'use strict';
                module.exports = function enhanceError(error, config, code, response) {
                    error.config = config;
                    if (code) {
                        error.code = code;
                    }
                    error.response = response;
                    return error;
                };
            }, {}], 15: [function (require, module, exports) {
                'use strict';
                var createError = require('./createError');
                module.exports = function settle(resolve, reject, response) {
                    var validateStatus = response.config.validateStatus;
                    if (!response.status || !validateStatus || validateStatus(response.status)) {
                        resolve(response);
                    }
                    else {
                        reject(createError('Request failed with status code ' + response.status, response.config, null, response));
                    }
                };
            }, { "./createError": 12 }], 16: [function (require, module, exports) {
                'use strict';
                var utils = require('./../utils');
                module.exports = function transformData(data, headers, fns) {
                    utils.forEach(fns, function transform(fn) {
                        data = fn(data, headers);
                    });
                    return data;
                };
            }, { "./../utils": 28 }], 17: [function (require, module, exports) {
                (function (process) {
                    'use strict';
                    var utils = require('./utils');
                    var normalizeHeaderName = require('./helpers/normalizeHeaderName');
                    var PROTECTION_PREFIX = /^\)\]\}',?\n/;
                    var DEFAULT_CONTENT_TYPE = {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    };
                    function setContentTypeIfUnset(headers, value) {
                        if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
                            headers['Content-Type'] = value;
                        }
                    }
                    function getDefaultAdapter() {
                        var adapter;
                        if (typeof XMLHttpRequest !== 'undefined') {
                            adapter = require('./adapters/xhr');
                        }
                        else if (typeof process !== 'undefined') {
                            adapter = require('./adapters/http');
                        }
                        return adapter;
                    }
                    var defaults = {
                        adapter: getDefaultAdapter(),
                        transformRequest: [function transformRequest(data, headers) {
                                normalizeHeaderName(headers, 'Content-Type');
                                if (utils.isFormData(data) ||
                                    utils.isArrayBuffer(data) ||
                                    utils.isStream(data) ||
                                    utils.isFile(data) ||
                                    utils.isBlob(data)) {
                                    return data;
                                }
                                if (utils.isArrayBufferView(data)) {
                                    return data.buffer;
                                }
                                if (utils.isURLSearchParams(data)) {
                                    setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
                                    return data.toString();
                                }
                                if (utils.isObject(data)) {
                                    setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
                                    return JSON.stringify(data);
                                }
                                return data;
                            }],
                        transformResponse: [function transformResponse(data) {
                                if (typeof data === 'string') {
                                    data = data.replace(PROTECTION_PREFIX, '');
                                    try {
                                        data = JSON.parse(data);
                                    }
                                    catch (e) { }
                                }
                                return data;
                            }],
                        timeout: 0,
                        xsrfCookieName: 'XSRF-TOKEN',
                        xsrfHeaderName: 'X-XSRF-TOKEN',
                        maxContentLength: -1,
                        validateStatus: function validateStatus(status) {
                            return status >= 200 && status < 300;
                        }
                    };
                    defaults.headers = {
                        common: {
                            'Accept': 'application/json, text/plain, */*'
                        }
                    };
                    utils.forEach(['delete', 'get', 'head'], function forEachMehtodNoData(method) {
                        defaults.headers[method] = {};
                    });
                    utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
                        defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
                    });
                    module.exports = defaults;
                }).call(this, require('_process'));
            }, { "./adapters/http": 5, "./adapters/xhr": 5, "./helpers/normalizeHeaderName": 25, "./utils": 28, "_process": 29 }], 18: [function (require, module, exports) {
                'use strict';
                module.exports = function bind(fn, thisArg) {
                    return function wrap() {
                        var args = new Array(arguments.length);
                        for (var i = 0; i < args.length; i++) {
                            args[i] = arguments[i];
                        }
                        return fn.apply(thisArg, args);
                    };
                };
            }, {}], 19: [function (require, module, exports) {
                'use strict';
                var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
                function E() {
                    this.message = 'String contains an invalid character';
                }
                E.prototype = new Error;
                E.prototype.code = 5;
                E.prototype.name = 'InvalidCharacterError';
                function btoa(input) {
                    var str = String(input);
                    var output = '';
                    for (var block, charCode, idx = 0, map = chars; str.charAt(idx | 0) || (map = '=', idx % 1); output += map.charAt(63 & block >> 8 - idx % 1 * 8)) {
                        charCode = str.charCodeAt(idx += 3 / 4);
                        if (charCode > 0xFF) {
                            throw new E();
                        }
                        block = block << 8 | charCode;
                    }
                    return output;
                }
                module.exports = btoa;
            }, {}], 20: [function (require, module, exports) {
                'use strict';
                var utils = require('./../utils');
                function encode(val) {
                    return encodeURIComponent(val).
                        replace(/%40/gi, '@').
                        replace(/%3A/gi, ':').
                        replace(/%24/g, '$').
                        replace(/%2C/gi, ',').
                        replace(/%20/g, '+').
                        replace(/%5B/gi, '[').
                        replace(/%5D/gi, ']');
                }
                module.exports = function buildURL(url, params, paramsSerializer) {
                    if (!params) {
                        return url;
                    }
                    var serializedParams;
                    if (paramsSerializer) {
                        serializedParams = paramsSerializer(params);
                    }
                    else if (utils.isURLSearchParams(params)) {
                        serializedParams = params.toString();
                    }
                    else {
                        var parts = [];
                        utils.forEach(params, function serialize(val, key) {
                            if (val === null || typeof val === 'undefined') {
                                return;
                            }
                            if (utils.isArray(val)) {
                                key = key + '[]';
                            }
                            if (!utils.isArray(val)) {
                                val = [val];
                            }
                            utils.forEach(val, function parseValue(v) {
                                if (utils.isDate(v)) {
                                    v = v.toISOString();
                                }
                                else if (utils.isObject(v)) {
                                    v = JSON.stringify(v);
                                }
                                parts.push(encode(key) + '=' + encode(v));
                            });
                        });
                        serializedParams = parts.join('&');
                    }
                    if (serializedParams) {
                        url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
                    }
                    return url;
                };
            }, { "./../utils": 28 }], 21: [function (require, module, exports) {
                'use strict';
                module.exports = function combineURLs(baseURL, relativeURL) {
                    return baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '');
                };
            }, {}], 22: [function (require, module, exports) {
                'use strict';
                var utils = require('./../utils');
                module.exports = (utils.isStandardBrowserEnv() ?
                    (function standardBrowserEnv() {
                        return {
                            write: function write(name, value, expires, path, domain, secure) {
                                var cookie = [];
                                cookie.push(name + '=' + encodeURIComponent(value));
                                if (utils.isNumber(expires)) {
                                    cookie.push('expires=' + new Date(expires).toGMTString());
                                }
                                if (utils.isString(path)) {
                                    cookie.push('path=' + path);
                                }
                                if (utils.isString(domain)) {
                                    cookie.push('domain=' + domain);
                                }
                                if (secure === true) {
                                    cookie.push('secure');
                                }
                                document.cookie = cookie.join('; ');
                            },
                            read: function read(name) {
                                var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
                                return (match ? decodeURIComponent(match[3]) : null);
                            },
                            remove: function remove(name) {
                                this.write(name, '', Date.now() - 86400000);
                            }
                        };
                    })() :
                    (function nonStandardBrowserEnv() {
                        return {
                            write: function write() { },
                            read: function read() { return null; },
                            remove: function remove() { }
                        };
                    })());
            }, { "./../utils": 28 }], 23: [function (require, module, exports) {
                'use strict';
                module.exports = function isAbsoluteURL(url) {
                    return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
                };
            }, {}], 24: [function (require, module, exports) {
                'use strict';
                var utils = require('./../utils');
                module.exports = (utils.isStandardBrowserEnv() ?
                    (function standardBrowserEnv() {
                        var msie = /(msie|trident)/i.test(navigator.userAgent);
                        var urlParsingNode = document.createElement('a');
                        var originURL;
                        function resolveURL(url) {
                            var href = url;
                            if (msie) {
                                urlParsingNode.setAttribute('href', href);
                                href = urlParsingNode.href;
                            }
                            urlParsingNode.setAttribute('href', href);
                            return {
                                href: urlParsingNode.href,
                                protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
                                host: urlParsingNode.host,
                                search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
                                hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
                                hostname: urlParsingNode.hostname,
                                port: urlParsingNode.port,
                                pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
                                    urlParsingNode.pathname :
                                    '/' + urlParsingNode.pathname
                            };
                        }
                        originURL = resolveURL(window.location.href);
                        return function isURLSameOrigin(requestURL) {
                            var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
                            return (parsed.protocol === originURL.protocol &&
                                parsed.host === originURL.host);
                        };
                    })() :
                    (function nonStandardBrowserEnv() {
                        return function isURLSameOrigin() {
                            return true;
                        };
                    })());
            }, { "./../utils": 28 }], 25: [function (require, module, exports) {
                'use strict';
                var utils = require('../utils');
                module.exports = function normalizeHeaderName(headers, normalizedName) {
                    utils.forEach(headers, function processHeader(value, name) {
                        if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
                            headers[normalizedName] = value;
                            delete headers[name];
                        }
                    });
                };
            }, { "../utils": 28 }], 26: [function (require, module, exports) {
                'use strict';
                var utils = require('./../utils');
                module.exports = function parseHeaders(headers) {
                    var parsed = {};
                    var key;
                    var val;
                    var i;
                    if (!headers) {
                        return parsed;
                    }
                    utils.forEach(headers.split('\n'), function parser(line) {
                        i = line.indexOf(':');
                        key = utils.trim(line.substr(0, i)).toLowerCase();
                        val = utils.trim(line.substr(i + 1));
                        if (key) {
                            parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
                        }
                    });
                    return parsed;
                };
            }, { "./../utils": 28 }], 27: [function (require, module, exports) {
                'use strict';
                module.exports = function spread(callback) {
                    return function wrap(arr) {
                        return callback.apply(null, arr);
                    };
                };
            }, {}], 28: [function (require, module, exports) {
                'use strict';
                var bind = require('./helpers/bind');
                var toString = Object.prototype.toString;
                function isArray(val) {
                    return toString.call(val) === '[object Array]';
                }
                function isArrayBuffer(val) {
                    return toString.call(val) === '[object ArrayBuffer]';
                }
                function isFormData(val) {
                    return (typeof FormData !== 'undefined') && (val instanceof FormData);
                }
                function isArrayBufferView(val) {
                    var result;
                    if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
                        result = ArrayBuffer.isView(val);
                    }
                    else {
                        result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
                    }
                    return result;
                }
                function isString(val) {
                    return typeof val === 'string';
                }
                function isNumber(val) {
                    return typeof val === 'number';
                }
                function isUndefined(val) {
                    return typeof val === 'undefined';
                }
                function isObject(val) {
                    return val !== null && typeof val === 'object';
                }
                function isDate(val) {
                    return toString.call(val) === '[object Date]';
                }
                function isFile(val) {
                    return toString.call(val) === '[object File]';
                }
                function isBlob(val) {
                    return toString.call(val) === '[object Blob]';
                }
                function isFunction(val) {
                    return toString.call(val) === '[object Function]';
                }
                function isStream(val) {
                    return isObject(val) && isFunction(val.pipe);
                }
                function isURLSearchParams(val) {
                    return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
                }
                function trim(str) {
                    return str.replace(/^\s*/, '').replace(/\s*$/, '');
                }
                function isStandardBrowserEnv() {
                    return (typeof window !== 'undefined' &&
                        typeof document !== 'undefined' &&
                        typeof document.createElement === 'function');
                }
                function forEach(obj, fn) {
                    if (obj === null || typeof obj === 'undefined') {
                        return;
                    }
                    if (typeof obj !== 'object' && !isArray(obj)) {
                        obj = [obj];
                    }
                    if (isArray(obj)) {
                        for (var i = 0, l = obj.length; i < l; i++) {
                            fn.call(null, obj[i], i, obj);
                        }
                    }
                    else {
                        for (var key in obj) {
                            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                                fn.call(null, obj[key], key, obj);
                            }
                        }
                    }
                }
                function merge() {
                    var result = {};
                    function assignValue(val, key) {
                        if (typeof result[key] === 'object' && typeof val === 'object') {
                            result[key] = merge(result[key], val);
                        }
                        else {
                            result[key] = val;
                        }
                    }
                    for (var i = 0, l = arguments.length; i < l; i++) {
                        forEach(arguments[i], assignValue);
                    }
                    return result;
                }
                function extend(a, b, thisArg) {
                    forEach(b, function assignValue(val, key) {
                        if (thisArg && typeof val === 'function') {
                            a[key] = bind(val, thisArg);
                        }
                        else {
                            a[key] = val;
                        }
                    });
                    return a;
                }
                module.exports = {
                    isArray: isArray,
                    isArrayBuffer: isArrayBuffer,
                    isFormData: isFormData,
                    isArrayBufferView: isArrayBufferView,
                    isString: isString,
                    isNumber: isNumber,
                    isObject: isObject,
                    isUndefined: isUndefined,
                    isDate: isDate,
                    isFile: isFile,
                    isBlob: isBlob,
                    isFunction: isFunction,
                    isStream: isStream,
                    isURLSearchParams: isURLSearchParams,
                    isStandardBrowserEnv: isStandardBrowserEnv,
                    forEach: forEach,
                    merge: merge,
                    extend: extend,
                    trim: trim
                };
            }, { "./helpers/bind": 18 }], 29: [function (require, module, exports) {
                var process = module.exports = {};
                var cachedSetTimeout;
                var cachedClearTimeout;
                function defaultSetTimout() {
                    throw new Error('setTimeout has not been defined');
                }
                function defaultClearTimeout() {
                    throw new Error('clearTimeout has not been defined');
                }
                (function () {
                    try {
                        if (typeof setTimeout === 'function') {
                            cachedSetTimeout = setTimeout;
                        }
                        else {
                            cachedSetTimeout = defaultSetTimout;
                        }
                    }
                    catch (e) {
                        cachedSetTimeout = defaultSetTimout;
                    }
                    try {
                        if (typeof clearTimeout === 'function') {
                            cachedClearTimeout = clearTimeout;
                        }
                        else {
                            cachedClearTimeout = defaultClearTimeout;
                        }
                    }
                    catch (e) {
                        cachedClearTimeout = defaultClearTimeout;
                    }
                }());
                function runTimeout(fun) {
                    if (cachedSetTimeout === setTimeout) {
                        return setTimeout(fun, 0);
                    }
                    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
                        cachedSetTimeout = setTimeout;
                        return setTimeout(fun, 0);
                    }
                    try {
                        return cachedSetTimeout(fun, 0);
                    }
                    catch (e) {
                        try {
                            return cachedSetTimeout.call(null, fun, 0);
                        }
                        catch (e) {
                            return cachedSetTimeout.call(this, fun, 0);
                        }
                    }
                }
                function runClearTimeout(marker) {
                    if (cachedClearTimeout === clearTimeout) {
                        return clearTimeout(marker);
                    }
                    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
                        cachedClearTimeout = clearTimeout;
                        return clearTimeout(marker);
                    }
                    try {
                        return cachedClearTimeout(marker);
                    }
                    catch (e) {
                        try {
                            return cachedClearTimeout.call(null, marker);
                        }
                        catch (e) {
                            return cachedClearTimeout.call(this, marker);
                        }
                    }
                }
                var queue = [];
                var draining = false;
                var currentQueue;
                var queueIndex = -1;
                function cleanUpNextTick() {
                    if (!draining || !currentQueue) {
                        return;
                    }
                    draining = false;
                    if (currentQueue.length) {
                        queue = currentQueue.concat(queue);
                    }
                    else {
                        queueIndex = -1;
                    }
                    if (queue.length) {
                        drainQueue();
                    }
                }
                function drainQueue() {
                    if (draining) {
                        return;
                    }
                    var timeout = runTimeout(cleanUpNextTick);
                    draining = true;
                    var len = queue.length;
                    while (len) {
                        currentQueue = queue;
                        queue = [];
                        while (++queueIndex < len) {
                            if (currentQueue) {
                                currentQueue[queueIndex].run();
                            }
                        }
                        queueIndex = -1;
                        len = queue.length;
                    }
                    currentQueue = null;
                    draining = false;
                    runClearTimeout(timeout);
                }
                process.nextTick = function (fun) {
                    var args = new Array(arguments.length - 1);
                    if (arguments.length > 1) {
                        for (var i = 1; i < arguments.length; i++) {
                            args[i - 1] = arguments[i];
                        }
                    }
                    queue.push(new Item(fun, args));
                    if (queue.length === 1 && !draining) {
                        runTimeout(drainQueue);
                    }
                };
                function Item(fun, array) {
                    this.fun = fun;
                    this.array = array;
                }
                Item.prototype.run = function () {
                    this.fun.apply(null, this.array);
                };
                process.title = 'browser';
                process.browser = true;
                process.env = {};
                process.argv = [];
                process.version = '';
                process.versions = {};
                function noop() { }
                process.on = noop;
                process.addListener = noop;
                process.once = noop;
                process.off = noop;
                process.removeListener = noop;
                process.removeAllListeners = noop;
                process.emit = noop;
                process.binding = function (name) {
                    throw new Error('process.binding is not supported');
                };
                process.cwd = function () { return '/'; };
                process.chdir = function (dir) {
                    throw new Error('process.chdir is not supported');
                };
                process.umask = function () { return 0; };
            }, {}], 30: [function (require, module, exports) {
                (function (root, factory) {
                    if (typeof module === 'object' && typeof module.exports === 'object') {
                        exports = module.exports = factory(require("terraformer"));
                    }
                    else if (typeof navigator === "object") {
                        if (!root.Terraformer) {
                            throw new Error("Terraformer.WKT requires the core Terraformer library. http://github.com/esri/terraformer");
                        }
                        root.Terraformer.WKT = factory(root.Terraformer);
                    }
                }(this, function (Terraformer) {
                    var exports = {};
                    var parser = (function () {
                        var parser = { trace: function trace() { },
                            yy: {},
                            symbols_: { "error": 2, "expressions": 3, "point": 4, "EOF": 5, "linestring": 6, "polygon": 7, "multipoint": 8, "multilinestring": 9, "multipolygon": 10, "coordinate": 11, "DOUBLE_TOK": 12, "ptarray": 13, "COMMA": 14, "ring_list": 15, "ring": 16, "(": 17, ")": 18, "POINT": 19, "Z": 20, "ZM": 21, "M": 22, "EMPTY": 23, "point_untagged": 24, "polygon_list": 25, "polygon_untagged": 26, "point_list": 27, "LINESTRING": 28, "POLYGON": 29, "MULTIPOINT": 30, "MULTILINESTRING": 31, "MULTIPOLYGON": 32, "$accept": 0, "$end": 1 },
                            terminals_: { 2: "error", 5: "EOF", 12: "DOUBLE_TOK", 14: "COMMA", 17: "(", 18: ")", 19: "POINT", 20: "Z", 21: "ZM", 22: "M", 23: "EMPTY", 28: "LINESTRING", 29: "POLYGON", 30: "MULTIPOINT", 31: "MULTILINESTRING", 32: "MULTIPOLYGON" },
                            productions_: [0, [3, 2], [3, 2], [3, 2], [3, 2], [3, 2], [3, 2], [11, 2], [11, 3], [11, 4], [13, 3], [13, 1], [15, 3], [15, 1], [16, 3], [4, 4], [4, 5], [4, 5], [4, 5], [4, 2], [24, 1], [24, 3], [25, 3], [25, 1], [26, 3], [27, 3], [27, 1], [6, 4], [6, 5], [6, 5], [6, 5], [6, 2], [7, 4], [7, 5], [7, 5], [7, 5], [7, 2], [8, 4], [8, 5], [8, 5], [8, 5], [8, 2], [9, 4], [9, 5], [9, 5], [9, 5], [9, 2], [10, 4], [10, 5], [10, 5], [10, 5], [10, 2]],
                            performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $, _$) {
                                var $0 = $.length - 1;
                                switch (yystate) {
                                    case 1:
                                        return $[$0 - 1];
                                        break;
                                    case 2:
                                        return $[$0 - 1];
                                        break;
                                    case 3:
                                        return $[$0 - 1];
                                        break;
                                    case 4:
                                        return $[$0 - 1];
                                        break;
                                    case 5:
                                        return $[$0 - 1];
                                        break;
                                    case 6:
                                        return $[$0 - 1];
                                        break;
                                    case 7:
                                        this.$ = new PointArray([Number($[$0 - 1]), Number($[$0])]);
                                        break;
                                    case 8:
                                        this.$ = new PointArray([Number($[$0 - 2]), Number($[$0 - 1]), Number($[$0])]);
                                        break;
                                    case 9:
                                        this.$ = new PointArray([Number($[$0 - 3]), Number($[$0 - 2]), Number($[$0 - 1]), Number($[$0])]);
                                        break;
                                    case 10:
                                        this.$ = $[$0 - 2].addPoint($[$0]);
                                        break;
                                    case 11:
                                        this.$ = $[$0];
                                        break;
                                    case 12:
                                        this.$ = $[$0 - 2].addRing($[$0]);
                                        break;
                                    case 13:
                                        this.$ = new RingList($[$0]);
                                        break;
                                    case 14:
                                        this.$ = new Ring($[$0 - 1]);
                                        break;
                                    case 15:
                                        this.$ = { "type": "Point", "coordinates": $[$0 - 1].data[0] };
                                        break;
                                    case 16:
                                        this.$ = { "type": "Point", "coordinates": $[$0 - 1].data[0], "properties": { z: true } };
                                        break;
                                    case 17:
                                        this.$ = { "type": "Point", "coordinates": $[$0 - 1].data[0], "properties": { z: true, m: true } };
                                        break;
                                    case 18:
                                        this.$ = { "type": "Point", "coordinates": $[$0 - 1].data[0], "properties": { m: true } };
                                        break;
                                    case 19:
                                        this.$ = { "type": "Point", "coordinates": [] };
                                        break;
                                    case 20:
                                        this.$ = $[$0];
                                        break;
                                    case 21:
                                        this.$ = $[$0 - 1];
                                        break;
                                    case 22:
                                        this.$ = $[$0 - 2].addPolygon($[$0]);
                                        break;
                                    case 23:
                                        this.$ = new PolygonList($[$0]);
                                        break;
                                    case 24:
                                        this.$ = $[$0 - 1];
                                        break;
                                    case 25:
                                        this.$ = $[$0 - 2].addPoint($[$0]);
                                        break;
                                    case 26:
                                        this.$ = $[$0];
                                        break;
                                    case 27:
                                        this.$ = { "type": "LineString", "coordinates": $[$0 - 1].data };
                                        break;
                                    case 28:
                                        this.$ = { "type": "LineString", "coordinates": $[$0 - 1].data, "properties": { z: true } };
                                        break;
                                    case 29:
                                        this.$ = { "type": "LineString", "coordinates": $[$0 - 1].data, "properties": { m: true } };
                                        break;
                                    case 30:
                                        this.$ = { "type": "LineString", "coordinates": $[$0 - 1].data, "properties": { z: true, m: true } };
                                        break;
                                    case 31:
                                        this.$ = { "type": "LineString", "coordinates": [] };
                                        break;
                                    case 32:
                                        this.$ = { "type": "Polygon", "coordinates": $[$0 - 1].toJSON() };
                                        break;
                                    case 33:
                                        this.$ = { "type": "Polygon", "coordinates": $[$0 - 1].toJSON(), "properties": { z: true } };
                                        break;
                                    case 34:
                                        this.$ = { "type": "Polygon", "coordinates": $[$0 - 1].toJSON(), "properties": { m: true } };
                                        break;
                                    case 35:
                                        this.$ = { "type": "Polygon", "coordinates": $[$0 - 1].toJSON(), "properties": { z: true, m: true } };
                                        break;
                                    case 36:
                                        this.$ = { "type": "Polygon", "coordinates": [] };
                                        break;
                                    case 37:
                                        this.$ = { "type": "MultiPoint", "coordinates": $[$0 - 1].data };
                                        break;
                                    case 38:
                                        this.$ = { "type": "MultiPoint", "coordinates": $[$0 - 1].data, "properties": { z: true } };
                                        break;
                                    case 39:
                                        this.$ = { "type": "MultiPoint", "coordinates": $[$0 - 1].data, "properties": { m: true } };
                                        break;
                                    case 40:
                                        this.$ = { "type": "MultiPoint", "coordinates": $[$0 - 1].data, "properties": { z: true, m: true } };
                                        break;
                                    case 41:
                                        this.$ = { "type": "MultiPoint", "coordinates": [] };
                                        break;
                                    case 42:
                                        this.$ = { "type": "MultiLineString", "coordinates": $[$0 - 1].toJSON() };
                                        break;
                                    case 43:
                                        this.$ = { "type": "MultiLineString", "coordinates": $[$0 - 1].toJSON(), "properties": { z: true } };
                                        break;
                                    case 44:
                                        this.$ = { "type": "MultiLineString", "coordinates": $[$0 - 1].toJSON(), "properties": { m: true } };
                                        break;
                                    case 45:
                                        this.$ = { "type": "MultiLineString", "coordinates": $[$0 - 1].toJSON(), "properties": { z: true, m: true } };
                                        break;
                                    case 46:
                                        this.$ = { "type": "MultiLineString", "coordinates": [] };
                                        break;
                                    case 47:
                                        this.$ = { "type": "MultiPolygon", "coordinates": $[$0 - 1].toJSON() };
                                        break;
                                    case 48:
                                        this.$ = { "type": "MultiPolygon", "coordinates": $[$0 - 1].toJSON(), "properties": { z: true } };
                                        break;
                                    case 49:
                                        this.$ = { "type": "MultiPolygon", "coordinates": $[$0 - 1].toJSON(), "properties": { m: true } };
                                        break;
                                    case 50:
                                        this.$ = { "type": "MultiPolygon", "coordinates": $[$0 - 1].toJSON(), "properties": { z: true, m: true } };
                                        break;
                                    case 51:
                                        this.$ = { "type": "MultiPolygon", "coordinates": [] };
                                        break;
                                }
                            },
                            table: [{ 3: 1, 4: 2, 6: 3, 7: 4, 8: 5, 9: 6, 10: 7, 19: [1, 8], 28: [1, 9], 29: [1, 10], 30: [1, 11], 31: [1, 12], 32: [1, 13] }, { 1: [3] }, { 5: [1, 14] }, { 5: [1, 15] }, { 5: [1, 16] }, { 5: [1, 17] }, { 5: [1, 18] }, { 5: [1, 19] }, { 17: [1, 20], 20: [1, 21], 21: [1, 22], 22: [1, 23], 23: [1, 24] }, { 17: [1, 25], 20: [1, 26], 21: [1, 28], 22: [1, 27], 23: [1, 29] }, { 17: [1, 30], 20: [1, 31], 21: [1, 33], 22: [1, 32], 23: [1, 34] }, { 17: [1, 35], 20: [1, 36], 21: [1, 38], 22: [1, 37], 23: [1, 39] }, { 17: [1, 40], 20: [1, 41], 21: [1, 43], 22: [1, 42], 23: [1, 44] }, { 17: [1, 45], 20: [1, 46], 21: [1, 48], 22: [1, 47], 23: [1, 49] }, { 1: [2, 1] }, { 1: [2, 2] }, { 1: [2, 3] }, { 1: [2, 4] }, { 1: [2, 5] }, { 1: [2, 6] }, { 11: 51, 12: [1, 52], 13: 50 }, { 17: [1, 53] }, { 17: [1, 54] }, { 17: [1, 55] }, { 5: [2, 19] }, { 11: 58, 12: [1, 52], 17: [1, 59], 24: 57, 27: 56 }, { 17: [1, 60] }, { 17: [1, 61] }, { 17: [1, 62] }, { 5: [2, 31] }, { 15: 63, 16: 64, 17: [1, 65] }, { 17: [1, 66] }, { 17: [1, 67] }, { 17: [1, 68] }, { 5: [2, 36] }, { 11: 58, 12: [1, 52], 17: [1, 59], 24: 57, 27: 69 }, { 17: [1, 70] }, { 17: [1, 71] }, { 17: [1, 72] }, { 5: [2, 41] }, { 15: 73, 16: 64, 17: [1, 65] }, { 17: [1, 74] }, { 17: [1, 75] }, { 17: [1, 76] }, { 5: [2, 46] }, { 17: [1, 79], 25: 77, 26: 78 }, { 17: [1, 80] }, { 17: [1, 81] }, { 17: [1, 82] }, { 5: [2, 51] }, { 14: [1, 84], 18: [1, 83] }, { 14: [2, 11], 18: [2, 11] }, { 12: [1, 85] }, { 11: 51, 12: [1, 52], 13: 86 }, { 11: 51, 12: [1, 52], 13: 87 }, { 11: 51, 12: [1, 52], 13: 88 }, { 14: [1, 90], 18: [1, 89] }, { 14: [2, 26], 18: [2, 26] }, { 14: [2, 20], 18: [2, 20] }, { 11: 91, 12: [1, 52] }, { 11: 58, 12: [1, 52], 17: [1, 59], 24: 57, 27: 92 }, { 11: 58, 12: [1, 52], 17: [1, 59], 24: 57, 27: 93 }, { 11: 58, 12: [1, 52], 17: [1, 59], 24: 57, 27: 94 }, { 14: [1, 96], 18: [1, 95] }, { 14: [2, 13], 18: [2, 13] }, { 11: 51, 12: [1, 52], 13: 97 }, { 15: 98, 16: 64, 17: [1, 65] }, { 15: 99, 16: 64, 17: [1, 65] }, { 15: 100, 16: 64, 17: [1, 65] }, { 14: [1, 90], 18: [1, 101] }, { 11: 58, 12: [1, 52], 17: [1, 59], 24: 57, 27: 102 }, { 11: 58, 12: [1, 52], 17: [1, 59], 24: 57, 27: 103 }, { 11: 58, 12: [1, 52], 17: [1, 59], 24: 57, 27: 104 }, { 14: [1, 96], 18: [1, 105] }, { 15: 106, 16: 64, 17: [1, 65] }, { 15: 107, 16: 64, 17: [1, 65] }, { 15: 108, 16: 64, 17: [1, 65] }, { 14: [1, 110], 18: [1, 109] }, { 14: [2, 23], 18: [2, 23] }, { 15: 111, 16: 64, 17: [1, 65] }, { 17: [1, 79], 25: 112, 26: 78 }, { 17: [1, 79], 25: 113, 26: 78 }, { 17: [1, 79], 25: 114, 26: 78 }, { 5: [2, 15] }, { 11: 115, 12: [1, 52] }, { 12: [1, 116], 14: [2, 7], 18: [2, 7] }, { 14: [1, 84], 18: [1, 117] }, { 14: [1, 84], 18: [1, 118] }, { 14: [1, 84], 18: [1, 119] }, { 5: [2, 27] }, { 11: 58, 12: [1, 52], 17: [1, 59], 24: 120 }, { 18: [1, 121] }, { 14: [1, 90], 18: [1, 122] }, { 14: [1, 90], 18: [1, 123] }, { 14: [1, 90], 18: [1, 124] }, { 5: [2, 32] }, { 16: 125, 17: [1, 65] }, { 14: [1, 84], 18: [1, 126] }, { 14: [1, 96], 18: [1, 127] }, { 14: [1, 96], 18: [1, 128] }, { 14: [1, 96], 18: [1, 129] }, { 5: [2, 37] }, { 14: [1, 90], 18: [1, 130] }, { 14: [1, 90], 18: [1, 131] }, { 14: [1, 90], 18: [1, 132] }, { 5: [2, 42] }, { 14: [1, 96], 18: [1, 133] }, { 14: [1, 96], 18: [1, 134] }, { 14: [1, 96], 18: [1, 135] }, { 5: [2, 47] }, { 17: [1, 79], 26: 136 }, { 14: [1, 96], 18: [1, 137] }, { 14: [1, 110], 18: [1, 138] }, { 14: [1, 110], 18: [1, 139] }, { 14: [1, 110], 18: [1, 140] }, { 14: [2, 10], 18: [2, 10] }, { 12: [1, 141], 14: [2, 8], 18: [2, 8] }, { 5: [2, 16] }, { 5: [2, 17] }, { 5: [2, 18] }, { 14: [2, 25], 18: [2, 25] }, { 14: [2, 21], 18: [2, 21] }, { 5: [2, 28] }, { 5: [2, 29] }, { 5: [2, 30] }, { 14: [2, 12], 18: [2, 12] }, { 14: [2, 14], 18: [2, 14] }, { 5: [2, 33] }, { 5: [2, 34] }, { 5: [2, 35] }, { 5: [2, 38] }, { 5: [2, 39] }, { 5: [2, 40] }, { 5: [2, 43] }, { 5: [2, 44] }, { 5: [2, 45] }, { 14: [2, 22], 18: [2, 22] }, { 14: [2, 24], 18: [2, 24] }, { 5: [2, 48] }, { 5: [2, 49] }, { 5: [2, 50] }, { 14: [2, 9], 18: [2, 9] }],
                            defaultActions: { 14: [2, 1], 15: [2, 2], 16: [2, 3], 17: [2, 4], 18: [2, 5], 19: [2, 6], 24: [2, 19], 29: [2, 31], 34: [2, 36], 39: [2, 41], 44: [2, 46], 49: [2, 51], 83: [2, 15], 89: [2, 27], 95: [2, 32], 101: [2, 37], 105: [2, 42], 109: [2, 47], 117: [2, 16], 118: [2, 17], 119: [2, 18], 122: [2, 28], 123: [2, 29], 124: [2, 30], 127: [2, 33], 128: [2, 34], 129: [2, 35], 130: [2, 38], 131: [2, 39], 132: [2, 40], 133: [2, 43], 134: [2, 44], 135: [2, 45], 138: [2, 48], 139: [2, 49], 140: [2, 50] },
                            parseError: function parseError(str, hash) {
                                throw new Error(str);
                            },
                            parse: function parse(input) {
                                var self = this, stack = [0], vstack = [null], lstack = [], table = this.table, yytext = "", yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
                                this.lexer.setInput(input);
                                this.lexer.yy = this.yy;
                                this.yy.lexer = this.lexer;
                                this.yy.parser = this;
                                if (typeof this.lexer.yylloc == "undefined")
                                    this.lexer.yylloc = {};
                                var yyloc = this.lexer.yylloc;
                                lstack.push(yyloc);
                                var ranges = this.lexer.options && this.lexer.options.ranges;
                                if (typeof this.yy.parseError === "function")
                                    this.parseError = this.yy.parseError;
                                function popStack(n) {
                                    stack.length = stack.length - 2 * n;
                                    vstack.length = vstack.length - n;
                                    lstack.length = lstack.length - n;
                                }
                                function lex() {
                                    var token;
                                    token = self.lexer.lex() || 1;
                                    if (typeof token !== "number") {
                                        token = self.symbols_[token] || token;
                                    }
                                    return token;
                                }
                                var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
                                while (true) {
                                    state = stack[stack.length - 1];
                                    if (this.defaultActions[state]) {
                                        action = this.defaultActions[state];
                                    }
                                    else {
                                        if (symbol === null || typeof symbol == "undefined") {
                                            symbol = lex();
                                        }
                                        action = table[state] && table[state][symbol];
                                    }
                                    if (typeof action === "undefined" || !action.length || !action[0]) {
                                        var errStr = "";
                                        if (!recovering) {
                                            expected = [];
                                            for (p in table[state])
                                                if (this.terminals_[p] && p > 2) {
                                                    expected.push("'" + this.terminals_[p] + "'");
                                                }
                                            if (this.lexer.showPosition) {
                                                errStr = "Parse error on line " + (yylineno + 1) + ":\n" + this.lexer.showPosition() + "\nExpecting " + expected.join(", ") + ", got '" + (this.terminals_[symbol] || symbol) + "'";
                                            }
                                            else {
                                                errStr = "Parse error on line " + (yylineno + 1) + ": Unexpected " + (symbol == 1 ? "end of input" : "'" + (this.terminals_[symbol] || symbol) + "'");
                                            }
                                            this.parseError(errStr, { text: this.lexer.match, token: this.terminals_[symbol] || symbol, line: this.lexer.yylineno, loc: yyloc, expected: expected });
                                        }
                                    }
                                    if (action[0] instanceof Array && action.length > 1) {
                                        throw new Error("Parse Error: multiple actions possible at state: " + state + ", token: " + symbol);
                                    }
                                    switch (action[0]) {
                                        case 1:
                                            stack.push(symbol);
                                            vstack.push(this.lexer.yytext);
                                            lstack.push(this.lexer.yylloc);
                                            stack.push(action[1]);
                                            symbol = null;
                                            if (!preErrorSymbol) {
                                                yyleng = this.lexer.yyleng;
                                                yytext = this.lexer.yytext;
                                                yylineno = this.lexer.yylineno;
                                                yyloc = this.lexer.yylloc;
                                                if (recovering > 0)
                                                    recovering--;
                                            }
                                            else {
                                                symbol = preErrorSymbol;
                                                preErrorSymbol = null;
                                            }
                                            break;
                                        case 2:
                                            len = this.productions_[action[1]][1];
                                            yyval.$ = vstack[vstack.length - len];
                                            yyval._$ = { first_line: lstack[lstack.length - (len || 1)].first_line, last_line: lstack[lstack.length - 1].last_line, first_column: lstack[lstack.length - (len || 1)].first_column, last_column: lstack[lstack.length - 1].last_column };
                                            if (ranges) {
                                                yyval._$.range = [lstack[lstack.length - (len || 1)].range[0], lstack[lstack.length - 1].range[1]];
                                            }
                                            r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);
                                            if (typeof r !== "undefined") {
                                                return r;
                                            }
                                            if (len) {
                                                stack = stack.slice(0, -1 * len * 2);
                                                vstack = vstack.slice(0, -1 * len);
                                                lstack = lstack.slice(0, -1 * len);
                                            }
                                            stack.push(this.productions_[action[1]][0]);
                                            vstack.push(yyval.$);
                                            lstack.push(yyval._$);
                                            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
                                            stack.push(newState);
                                            break;
                                        case 3:
                                            return true;
                                    }
                                }
                                return true;
                            }
                        };
                        undefined;
                        var lexer = (function () {
                            var lexer = ({ EOF: 1,
                                parseError: function parseError(str, hash) {
                                    if (this.yy.parser) {
                                        this.yy.parser.parseError(str, hash);
                                    }
                                    else {
                                        throw new Error(str);
                                    }
                                },
                                setInput: function (input) {
                                    this._input = input;
                                    this._more = this._less = this.done = false;
                                    this.yylineno = this.yyleng = 0;
                                    this.yytext = this.matched = this.match = '';
                                    this.conditionStack = ['INITIAL'];
                                    this.yylloc = { first_line: 1, first_column: 0, last_line: 1, last_column: 0 };
                                    if (this.options.ranges)
                                        this.yylloc.range = [0, 0];
                                    this.offset = 0;
                                    return this;
                                },
                                input: function () {
                                    var ch = this._input[0];
                                    this.yytext += ch;
                                    this.yyleng++;
                                    this.offset++;
                                    this.match += ch;
                                    this.matched += ch;
                                    var lines = ch.match(/(?:\r\n?|\n).*/g);
                                    if (lines) {
                                        this.yylineno++;
                                        this.yylloc.last_line++;
                                    }
                                    else {
                                        this.yylloc.last_column++;
                                    }
                                    if (this.options.ranges)
                                        this.yylloc.range[1]++;
                                    this._input = this._input.slice(1);
                                    return ch;
                                },
                                unput: function (ch) {
                                    var len = ch.length;
                                    var lines = ch.split(/(?:\r\n?|\n)/g);
                                    this._input = ch + this._input;
                                    this.yytext = this.yytext.substr(0, this.yytext.length - len - 1);
                                    this.offset -= len;
                                    var oldLines = this.match.split(/(?:\r\n?|\n)/g);
                                    this.match = this.match.substr(0, this.match.length - 1);
                                    this.matched = this.matched.substr(0, this.matched.length - 1);
                                    if (lines.length - 1)
                                        this.yylineno -= lines.length - 1;
                                    var r = this.yylloc.range;
                                    this.yylloc = { first_line: this.yylloc.first_line,
                                        last_line: this.yylineno + 1,
                                        first_column: this.yylloc.first_column,
                                        last_column: lines ?
                                            (lines.length === oldLines.length ? this.yylloc.first_column : 0) + oldLines[oldLines.length - lines.length].length - lines[0].length :
                                            this.yylloc.first_column - len
                                    };
                                    if (this.options.ranges) {
                                        this.yylloc.range = [r[0], r[0] + this.yyleng - len];
                                    }
                                    return this;
                                },
                                more: function () {
                                    this._more = true;
                                    return this;
                                },
                                less: function (n) {
                                    this.unput(this.match.slice(n));
                                },
                                pastInput: function () {
                                    var past = this.matched.substr(0, this.matched.length - this.match.length);
                                    return (past.length > 20 ? '...' : '') + past.substr(-20).replace(/\n/g, "");
                                },
                                upcomingInput: function () {
                                    var next = this.match;
                                    if (next.length < 20) {
                                        next += this._input.substr(0, 20 - next.length);
                                    }
                                    return (next.substr(0, 20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
                                },
                                showPosition: function () {
                                    var pre = this.pastInput();
                                    var c = new Array(pre.length + 1).join("-");
                                    return pre + this.upcomingInput() + "\n" + c + "^";
                                },
                                next: function () {
                                    if (this.done) {
                                        return this.EOF;
                                    }
                                    if (!this._input)
                                        this.done = true;
                                    var token, match, tempMatch, index, col, lines;
                                    if (!this._more) {
                                        this.yytext = '';
                                        this.match = '';
                                    }
                                    var rules = this._currentRules();
                                    for (var i = 0; i < rules.length; i++) {
                                        tempMatch = this._input.match(this.rules[rules[i]]);
                                        if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                                            match = tempMatch;
                                            index = i;
                                            if (!this.options.flex)
                                                break;
                                        }
                                    }
                                    if (match) {
                                        lines = match[0].match(/(?:\r\n?|\n).*/g);
                                        if (lines)
                                            this.yylineno += lines.length;
                                        this.yylloc = { first_line: this.yylloc.last_line,
                                            last_line: this.yylineno + 1,
                                            first_column: this.yylloc.last_column,
                                            last_column: lines ? lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length : this.yylloc.last_column + match[0].length };
                                        this.yytext += match[0];
                                        this.match += match[0];
                                        this.matches = match;
                                        this.yyleng = this.yytext.length;
                                        if (this.options.ranges) {
                                            this.yylloc.range = [this.offset, this.offset += this.yyleng];
                                        }
                                        this._more = false;
                                        this._input = this._input.slice(match[0].length);
                                        this.matched += match[0];
                                        token = this.performAction.call(this, this.yy, this, rules[index], this.conditionStack[this.conditionStack.length - 1]);
                                        if (this.done && this._input)
                                            this.done = false;
                                        if (token)
                                            return token;
                                        else
                                            return;
                                    }
                                    if (this._input === "") {
                                        return this.EOF;
                                    }
                                    else {
                                        return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), { text: "", token: null, line: this.yylineno });
                                    }
                                },
                                lex: function lex() {
                                    var r = this.next();
                                    if (typeof r !== 'undefined') {
                                        return r;
                                    }
                                    else {
                                        return this.lex();
                                    }
                                },
                                begin: function begin(condition) {
                                    this.conditionStack.push(condition);
                                },
                                popState: function popState() {
                                    return this.conditionStack.pop();
                                },
                                _currentRules: function _currentRules() {
                                    return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
                                },
                                topState: function () {
                                    return this.conditionStack[this.conditionStack.length - 2];
                                },
                                pushState: function begin(condition) {
                                    this.begin(condition);
                                } });
                            lexer.options = {};
                            lexer.performAction = function anonymous(yy, yy_, $avoiding_name_collisions, YY_START) {
                                var YYSTATE = YY_START;
                                switch ($avoiding_name_collisions) {
                                    case 0:
                                        break;
                                    case 1:
                                        return 17;
                                        break;
                                    case 2:
                                        return 18;
                                        break;
                                    case 3:
                                        return 12;
                                        break;
                                    case 4:
                                        return 19;
                                        break;
                                    case 5:
                                        return 28;
                                        break;
                                    case 6:
                                        return 29;
                                        break;
                                    case 7:
                                        return 30;
                                        break;
                                    case 8:
                                        return 31;
                                        break;
                                    case 9:
                                        return 32;
                                        break;
                                    case 10:
                                        return 14;
                                        break;
                                    case 11:
                                        return 23;
                                        break;
                                    case 12:
                                        return 22;
                                        break;
                                    case 13:
                                        return 20;
                                        break;
                                    case 14:
                                        return 21;
                                        break;
                                    case 15:
                                        return 5;
                                        break;
                                    case 16:
                                        return "INVALID";
                                        break;
                                }
                            };
                            lexer.rules = [/^(?:\s+)/, /^(?:\()/, /^(?:\))/, /^(?:-?[0-9]+(\.[0-9]+)?([eE][\-\+]?[0-9]+)?)/, /^(?:POINT\b)/, /^(?:LINESTRING\b)/, /^(?:POLYGON\b)/, /^(?:MULTIPOINT\b)/, /^(?:MULTILINESTRING\b)/, /^(?:MULTIPOLYGON\b)/, /^(?:,)/, /^(?:EMPTY\b)/, /^(?:M\b)/, /^(?:Z\b)/, /^(?:ZM\b)/, /^(?:$)/, /^(?:.)/];
                            lexer.conditions = { "INITIAL": { "rules": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], "inclusive": true } };
                            return lexer;
                        })();
                        parser.lexer = lexer;
                        function Parser() { this.yy = {}; }
                        Parser.prototype = parser;
                        parser.Parser = Parser;
                        return new Parser;
                    })();
                    function PointArray(point) {
                        this.data = [point];
                        this.type = 'PointArray';
                    }
                    PointArray.prototype.addPoint = function (point) {
                        if (point.type === 'PointArray') {
                            this.data = this.data.concat(point.data);
                        }
                        else {
                            this.data.push(point);
                        }
                        return this;
                    };
                    PointArray.prototype.toJSON = function () {
                        return this.data;
                    };
                    function Ring(point) {
                        this.data = point;
                        this.type = 'Ring';
                    }
                    Ring.prototype.toJSON = function () {
                        var data = [];
                        for (var i = 0; i < this.data.data.length; i++) {
                            data.push(this.data.data[i]);
                        }
                        return data;
                    };
                    function RingList(ring) {
                        this.data = [ring];
                        this.type = 'RingList';
                    }
                    RingList.prototype.addRing = function (ring) {
                        this.data.push(ring);
                        return this;
                    };
                    RingList.prototype.toJSON = function () {
                        var data = [];
                        for (var i = 0; i < this.data.length; i++) {
                            data.push(this.data[i].toJSON());
                        }
                        if (data.length === 1) {
                            return data;
                        }
                        else {
                            return data;
                        }
                    };
                    function PolygonList(polygon) {
                        this.data = [polygon];
                        this.type = 'PolygonList';
                    }
                    PolygonList.prototype.addPolygon = function (polygon) {
                        this.data.push(polygon);
                        return this;
                    };
                    PolygonList.prototype.toJSON = function () {
                        var data = [];
                        for (var i = 0; i < this.data.length; i++) {
                            data = data.concat([this.data[i].toJSON()]);
                        }
                        return data;
                    };
                    function _parse() {
                        return parser.parse.apply(parser, arguments);
                    }
                    function parse(element) {
                        var res, primitive;
                        try {
                            res = parser.parse(element);
                        }
                        catch (err) {
                            throw Error("Unable to parse: " + err);
                        }
                        return Terraformer.Primitive(res);
                    }
                    function arrayToRing(arr) {
                        var parts = [], ret = '';
                        for (var i = 0; i < arr.length; i++) {
                            parts.push(arr[i].join(' '));
                        }
                        ret += '(' + parts.join(', ') + ')';
                        return ret;
                    }
                    function pointToWKTPoint(primitive) {
                        var ret = 'POINT ';
                        if (primitive.coordinates === undefined || primitive.coordinates.length === 0) {
                            ret += 'EMPTY';
                            return ret;
                        }
                        else if (primitive.coordinates.length === 3) {
                            if (primitive.properties && primitive.properties.m === true) {
                                ret += 'M ';
                            }
                            else {
                                ret += 'Z ';
                            }
                        }
                        else if (primitive.coordinates.length === 4) {
                            ret += 'ZM ';
                        }
                        ret += '(' + primitive.coordinates.join(' ') + ')';
                        return ret;
                    }
                    function lineStringToWKTLineString(primitive) {
                        var ret = 'LINESTRING ';
                        if (primitive.coordinates === undefined || primitive.coordinates.length === 0 || primitive.coordinates[0].length === 0) {
                            ret += 'EMPTY';
                            return ret;
                        }
                        else if (primitive.coordinates[0].length === 3) {
                            if (primitive.properties && primitive.properties.m === true) {
                                ret += 'M ';
                            }
                            else {
                                ret += 'Z ';
                            }
                        }
                        else if (primitive.coordinates[0].length === 4) {
                            ret += 'ZM ';
                        }
                        ret += arrayToRing(primitive.coordinates);
                        return ret;
                    }
                    function polygonToWKTPolygon(primitive) {
                        var ret = 'POLYGON ';
                        if (primitive.coordinates === undefined || primitive.coordinates.length === 0 || primitive.coordinates[0].length === 0) {
                            ret += 'EMPTY';
                            return ret;
                        }
                        else if (primitive.coordinates[0][0].length === 3) {
                            if (primitive.properties && primitive.properties.m === true) {
                                ret += 'M ';
                            }
                            else {
                                ret += 'Z ';
                            }
                        }
                        else if (primitive.coordinates[0][0].length === 4) {
                            ret += 'ZM ';
                        }
                        ret += '(';
                        var parts = [];
                        for (var i = 0; i < primitive.coordinates.length; i++) {
                            parts.push(arrayToRing(primitive.coordinates[i]));
                        }
                        ret += parts.join(', ');
                        ret += ')';
                        return ret;
                    }
                    function multiPointToWKTMultiPoint(primitive) {
                        var ret = 'MULTIPOINT ';
                        if (primitive.coordinates === undefined || primitive.coordinates.length === 0 || primitive.coordinates[0].length === 0) {
                            ret += 'EMPTY';
                            return ret;
                        }
                        else if (primitive.coordinates[0].length === 3) {
                            if (primitive.properties && primitive.properties.m === true) {
                                ret += 'M ';
                            }
                            else {
                                ret += 'Z ';
                            }
                        }
                        else if (primitive.coordinates[0].length === 4) {
                            ret += 'ZM ';
                        }
                        ret += arrayToRing(primitive.coordinates);
                        return ret;
                    }
                    function multiLineStringToWKTMultiLineString(primitive) {
                        var ret = 'MULTILINESTRING ';
                        if (primitive.coordinates === undefined || primitive.coordinates.length === 0 || primitive.coordinates[0].length === 0) {
                            ret += 'EMPTY';
                            return ret;
                        }
                        else if (primitive.coordinates[0][0].length === 3) {
                            if (primitive.properties && primitive.properties.m === true) {
                                ret += 'M ';
                            }
                            else {
                                ret += 'Z ';
                            }
                        }
                        else if (primitive.coordinates[0][0].length === 4) {
                            ret += 'ZM ';
                        }
                        ret += '(';
                        var parts = [];
                        for (var i = 0; i < primitive.coordinates.length; i++) {
                            parts.push(arrayToRing(primitive.coordinates[i]));
                        }
                        ret += parts.join(', ');
                        ret += ')';
                        return ret;
                    }
                    function multiPolygonToWKTMultiPolygon(primitive) {
                        var ret = 'MULTIPOLYGON ';
                        if (primitive.coordinates === undefined || primitive.coordinates.length === 0 || primitive.coordinates[0].length === 0) {
                            ret += 'EMPTY';
                            return ret;
                        }
                        else if (primitive.coordinates[0][0][0].length === 3) {
                            if (primitive.properties && primitive.properties.m === true) {
                                ret += 'M ';
                            }
                            else {
                                ret += 'Z ';
                            }
                        }
                        else if (primitive.coordinates[0][0][0].length === 4) {
                            ret += 'ZM ';
                        }
                        ret += '(';
                        var inner = [];
                        for (var c = 0; c < primitive.coordinates.length; c++) {
                            var it = '(';
                            var parts = [];
                            for (var i = 0; i < primitive.coordinates[c].length; i++) {
                                parts.push(arrayToRing(primitive.coordinates[c][i]));
                            }
                            it += parts.join(', ');
                            it += ')';
                            inner.push(it);
                        }
                        ret += inner.join(', ');
                        ret += ')';
                        return ret;
                    }
                    function convert(primitive) {
                        switch (primitive.type) {
                            case 'Point':
                                return pointToWKTPoint(primitive);
                            case 'LineString':
                                return lineStringToWKTLineString(primitive);
                            case 'Polygon':
                                return polygonToWKTPolygon(primitive);
                            case 'MultiPoint':
                                return multiPointToWKTMultiPoint(primitive);
                            case 'MultiLineString':
                                return multiLineStringToWKTMultiLineString(primitive);
                            case 'MultiPolygon':
                                return multiPolygonToWKTMultiPolygon(primitive);
                            default:
                                throw Error("Unknown Type: " + primitive.type);
                        }
                    }
                    exports.parser = parser;
                    exports.Parser = parser.Parser;
                    exports.parse = parse;
                    exports.convert = convert;
                    return exports;
                }));
            }, { "terraformer": 31 }], 31: [function (require, module, exports) {
                (function (root, factory) {
                    if (typeof module === 'object' && typeof module.exports === 'object') {
                        exports = module.exports = factory();
                    }
                    if (typeof window === "object") {
                        root.Terraformer = factory();
                    }
                }(this, function () {
                    var exports = {}, EarthRadius = 6378137, DegreesPerRadian = 57.295779513082320, RadiansPerDegree = 0.017453292519943, MercatorCRS = {
                        "type": "link",
                        "properties": {
                            "href": "http://spatialreference.org/ref/sr-org/6928/ogcwkt/",
                            "type": "ogcwkt"
                        }
                    }, GeographicCRS = {
                        "type": "link",
                        "properties": {
                            "href": "http://spatialreference.org/ref/epsg/4326/ogcwkt/",
                            "type": "ogcwkt"
                        }
                    };
                    function isArray(obj) {
                        return Object.prototype.toString.call(obj) === "[object Array]";
                    }
                    function warn() {
                        var args = Array.prototype.slice.apply(arguments);
                        if (typeof console !== undefined && console.warn) {
                            console.warn.apply(console, args);
                        }
                    }
                    function extend(destination, source) {
                        for (var k in source) {
                            if (source.hasOwnProperty(k)) {
                                destination[k] = source[k];
                            }
                        }
                        return destination;
                    }
                    function calculateBounds(geojson) {
                        if (geojson.type) {
                            switch (geojson.type) {
                                case 'Point':
                                    return [geojson.coordinates[0], geojson.coordinates[1], geojson.coordinates[0], geojson.coordinates[1]];
                                case 'MultiPoint':
                                    return calculateBoundsFromArray(geojson.coordinates);
                                case 'LineString':
                                    return calculateBoundsFromArray(geojson.coordinates);
                                case 'MultiLineString':
                                    return calculateBoundsFromNestedArrays(geojson.coordinates);
                                case 'Polygon':
                                    return calculateBoundsFromNestedArrays(geojson.coordinates);
                                case 'MultiPolygon':
                                    return calculateBoundsFromNestedArrayOfArrays(geojson.coordinates);
                                case 'Feature':
                                    return geojson.geometry ? calculateBounds(geojson.geometry) : null;
                                case 'FeatureCollection':
                                    return calculateBoundsForFeatureCollection(geojson);
                                case 'GeometryCollection':
                                    return calculateBoundsForGeometryCollection(geojson);
                                default:
                                    throw new Error("Unknown type: " + geojson.type);
                            }
                        }
                        return null;
                    }
                    function calculateBoundsFromNestedArrays(array) {
                        var x1 = null, x2 = null, y1 = null, y2 = null;
                        for (var i = 0; i < array.length; i++) {
                            var inner = array[i];
                            for (var j = 0; j < inner.length; j++) {
                                var lonlat = inner[j];
                                var lon = lonlat[0];
                                var lat = lonlat[1];
                                if (x1 === null) {
                                    x1 = lon;
                                }
                                else if (lon < x1) {
                                    x1 = lon;
                                }
                                if (x2 === null) {
                                    x2 = lon;
                                }
                                else if (lon > x2) {
                                    x2 = lon;
                                }
                                if (y1 === null) {
                                    y1 = lat;
                                }
                                else if (lat < y1) {
                                    y1 = lat;
                                }
                                if (y2 === null) {
                                    y2 = lat;
                                }
                                else if (lat > y2) {
                                    y2 = lat;
                                }
                            }
                        }
                        return [x1, y1, x2, y2];
                    }
                    function calculateBoundsFromNestedArrayOfArrays(array) {
                        var x1 = null, x2 = null, y1 = null, y2 = null;
                        for (var i = 0; i < array.length; i++) {
                            var inner = array[i];
                            for (var j = 0; j < inner.length; j++) {
                                var innerinner = inner[j];
                                for (var k = 0; k < innerinner.length; k++) {
                                    var lonlat = innerinner[k];
                                    var lon = lonlat[0];
                                    var lat = lonlat[1];
                                    if (x1 === null) {
                                        x1 = lon;
                                    }
                                    else if (lon < x1) {
                                        x1 = lon;
                                    }
                                    if (x2 === null) {
                                        x2 = lon;
                                    }
                                    else if (lon > x2) {
                                        x2 = lon;
                                    }
                                    if (y1 === null) {
                                        y1 = lat;
                                    }
                                    else if (lat < y1) {
                                        y1 = lat;
                                    }
                                    if (y2 === null) {
                                        y2 = lat;
                                    }
                                    else if (lat > y2) {
                                        y2 = lat;
                                    }
                                }
                            }
                        }
                        return [x1, y1, x2, y2];
                    }
                    function calculateBoundsFromArray(array) {
                        var x1 = null, x2 = null, y1 = null, y2 = null;
                        for (var i = 0; i < array.length; i++) {
                            var lonlat = array[i];
                            var lon = lonlat[0];
                            var lat = lonlat[1];
                            if (x1 === null) {
                                x1 = lon;
                            }
                            else if (lon < x1) {
                                x1 = lon;
                            }
                            if (x2 === null) {
                                x2 = lon;
                            }
                            else if (lon > x2) {
                                x2 = lon;
                            }
                            if (y1 === null) {
                                y1 = lat;
                            }
                            else if (lat < y1) {
                                y1 = lat;
                            }
                            if (y2 === null) {
                                y2 = lat;
                            }
                            else if (lat > y2) {
                                y2 = lat;
                            }
                        }
                        return [x1, y1, x2, y2];
                    }
                    function calculateBoundsForFeatureCollection(featureCollection) {
                        var extents = [], extent;
                        for (var i = featureCollection.features.length - 1; i >= 0; i--) {
                            extent = calculateBounds(featureCollection.features[i].geometry);
                            extents.push([extent[0], extent[1]]);
                            extents.push([extent[2], extent[3]]);
                        }
                        return calculateBoundsFromArray(extents);
                    }
                    function calculateBoundsForGeometryCollection(geometryCollection) {
                        var extents = [], extent;
                        for (var i = geometryCollection.geometries.length - 1; i >= 0; i--) {
                            extent = calculateBounds(geometryCollection.geometries[i]);
                            extents.push([extent[0], extent[1]]);
                            extents.push([extent[2], extent[3]]);
                        }
                        return calculateBoundsFromArray(extents);
                    }
                    function calculateEnvelope(geojson) {
                        var bounds = calculateBounds(geojson);
                        return {
                            x: bounds[0],
                            y: bounds[1],
                            w: Math.abs(bounds[0] - bounds[2]),
                            h: Math.abs(bounds[1] - bounds[3])
                        };
                    }
                    function radToDeg(rad) {
                        return rad * DegreesPerRadian;
                    }
                    function degToRad(deg) {
                        return deg * RadiansPerDegree;
                    }
                    function eachPosition(coordinates, func) {
                        for (var i = 0; i < coordinates.length; i++) {
                            if (typeof coordinates[i][0] === "number") {
                                coordinates[i] = func(coordinates[i]);
                            }
                            if (typeof coordinates[i] === "object") {
                                coordinates[i] = eachPosition(coordinates[i], func);
                            }
                        }
                        return coordinates;
                    }
                    function positionToGeographic(position) {
                        var x = position[0];
                        var y = position[1];
                        return [radToDeg(x / EarthRadius) - (Math.floor((radToDeg(x / EarthRadius) + 180) / 360) * 360), radToDeg((Math.PI / 2) - (2 * Math.atan(Math.exp(-1.0 * y / EarthRadius))))];
                    }
                    function positionToMercator(position) {
                        var lng = position[0];
                        var lat = Math.max(Math.min(position[1], 89.99999), -89.99999);
                        return [degToRad(lng) * EarthRadius, EarthRadius / 2.0 * Math.log((1.0 + Math.sin(degToRad(lat))) / (1.0 - Math.sin(degToRad(lat))))];
                    }
                    function applyConverter(geojson, converter, noCrs) {
                        if (geojson.type === "Point") {
                            geojson.coordinates = converter(geojson.coordinates);
                        }
                        else if (geojson.type === "Feature") {
                            geojson.geometry = applyConverter(geojson.geometry, converter, true);
                        }
                        else if (geojson.type === "FeatureCollection") {
                            for (var f = 0; f < geojson.features.length; f++) {
                                geojson.features[f] = applyConverter(geojson.features[f], converter, true);
                            }
                        }
                        else if (geojson.type === "GeometryCollection") {
                            for (var g = 0; g < geojson.geometries.length; g++) {
                                geojson.geometries[g] = applyConverter(geojson.geometries[g], converter, true);
                            }
                        }
                        else {
                            geojson.coordinates = eachPosition(geojson.coordinates, converter);
                        }
                        if (!noCrs) {
                            if (converter === positionToMercator) {
                                geojson.crs = MercatorCRS;
                            }
                        }
                        if (converter === positionToGeographic) {
                            delete geojson.crs;
                        }
                        return geojson;
                    }
                    function toMercator(geojson) {
                        return applyConverter(geojson, positionToMercator);
                    }
                    function toGeographic(geojson) {
                        return applyConverter(geojson, positionToGeographic);
                    }
                    function cmp(a, b) {
                        if (a < b) {
                            return -1;
                        }
                        else if (a > b) {
                            return 1;
                        }
                        else {
                            return 0;
                        }
                    }
                    function compSort(p1, p2) {
                        if (p1[0] > p2[0]) {
                            return -1;
                        }
                        else if (p1[0] < p2[0]) {
                            return 1;
                        }
                        else if (p1[1] > p2[1]) {
                            return -1;
                        }
                        else if (p1[1] < p2[1]) {
                            return 1;
                        }
                        else {
                            return 0;
                        }
                    }
                    function turn(p, q, r) {
                        return cmp((q[0] - p[0]) * (r[1] - p[1]) - (r[0] - p[0]) * (q[1] - p[1]), 0);
                    }
                    function euclideanDistance(p, q) {
                        var dx = q[0] - p[0];
                        var dy = q[1] - p[1];
                        return dx * dx + dy * dy;
                    }
                    function nextHullPoint(points, p) {
                        var q = p;
                        for (var r in points) {
                            var t = turn(p, q, points[r]);
                            if (t === -1 || t === 0 && euclideanDistance(p, points[r]) > euclideanDistance(p, q)) {
                                q = points[r];
                            }
                        }
                        return q;
                    }
                    function convexHull(points) {
                        if (points.length === 0) {
                            return [];
                        }
                        else if (points.length === 1) {
                            return points;
                        }
                        var hull = [points.sort(compSort)[0]];
                        for (var p = 0; p < hull.length; p++) {
                            var q = nextHullPoint(points, hull[p]);
                            if (q !== hull[0]) {
                                hull.push(q);
                            }
                        }
                        return hull;
                    }
                    function isConvex(points) {
                        var ltz;
                        for (var i = 0; i < points.length - 3; i++) {
                            var p1 = points[i];
                            var p2 = points[i + 1];
                            var p3 = points[i + 2];
                            var v = [p2[0] - p1[0], p2[1] - p1[1]];
                            var res = p3[0] * v[1] - p3[1] * v[0] + v[0] * p1[1] - v[1] * p1[0];
                            if (i === 0) {
                                if (res < 0) {
                                    ltz = true;
                                }
                                else {
                                    ltz = false;
                                }
                            }
                            else {
                                if (ltz && (res > 0) || !ltz && (res < 0)) {
                                    return false;
                                }
                            }
                        }
                        return true;
                    }
                    function coordinatesContainPoint(coordinates, point) {
                        var contains = false;
                        for (var i = -1, l = coordinates.length, j = l - 1; ++i < l; j = i) {
                            if (((coordinates[i][1] <= point[1] && point[1] < coordinates[j][1]) ||
                                (coordinates[j][1] <= point[1] && point[1] < coordinates[i][1])) &&
                                (point[0] < (coordinates[j][0] - coordinates[i][0]) * (point[1] - coordinates[i][1]) / (coordinates[j][1] - coordinates[i][1]) + coordinates[i][0])) {
                                contains = !contains;
                            }
                        }
                        return contains;
                    }
                    function polygonContainsPoint(polygon, point) {
                        if (polygon && polygon.length) {
                            if (polygon.length === 1) {
                                return coordinatesContainPoint(polygon[0], point);
                            }
                            else {
                                if (coordinatesContainPoint(polygon[0], point)) {
                                    for (var i = 1; i < polygon.length; i++) {
                                        if (coordinatesContainPoint(polygon[i], point)) {
                                            return false;
                                        }
                                    }
                                    return true;
                                }
                                else {
                                    return false;
                                }
                            }
                        }
                        else {
                            return false;
                        }
                    }
                    function edgeIntersectsEdge(a1, a2, b1, b2) {
                        var ua_t = (b2[0] - b1[0]) * (a1[1] - b1[1]) - (b2[1] - b1[1]) * (a1[0] - b1[0]);
                        var ub_t = (a2[0] - a1[0]) * (a1[1] - b1[1]) - (a2[1] - a1[1]) * (a1[0] - b1[0]);
                        var u_b = (b2[1] - b1[1]) * (a2[0] - a1[0]) - (b2[0] - b1[0]) * (a2[1] - a1[1]);
                        if (u_b !== 0) {
                            var ua = ua_t / u_b;
                            var ub = ub_t / u_b;
                            if (0 <= ua && ua <= 1 && 0 <= ub && ub <= 1) {
                                return true;
                            }
                        }
                        return false;
                    }
                    function isNumber(n) {
                        return !isNaN(parseFloat(n)) && isFinite(n);
                    }
                    function arraysIntersectArrays(a, b) {
                        if (isNumber(a[0][0])) {
                            if (isNumber(b[0][0])) {
                                for (var i = 0; i < a.length - 1; i++) {
                                    for (var j = 0; j < b.length - 1; j++) {
                                        if (edgeIntersectsEdge(a[i], a[i + 1], b[j], b[j + 1])) {
                                            return true;
                                        }
                                    }
                                }
                            }
                            else {
                                for (var k = 0; k < b.length; k++) {
                                    if (arraysIntersectArrays(a, b[k])) {
                                        return true;
                                    }
                                }
                            }
                        }
                        else {
                            for (var l = 0; l < a.length; l++) {
                                if (arraysIntersectArrays(a[l], b)) {
                                    return true;
                                }
                            }
                        }
                        return false;
                    }
                    function closedPolygon(coordinates) {
                        var outer = [];
                        for (var i = 0; i < coordinates.length; i++) {
                            var inner = coordinates[i].slice();
                            if (pointsEqual(inner[0], inner[inner.length - 1]) === false) {
                                inner.push(inner[0]);
                            }
                            outer.push(inner);
                        }
                        return outer;
                    }
                    function pointsEqual(a, b) {
                        for (var i = 0; i < a.length; i++) {
                            if (a[i] !== b[i]) {
                                return false;
                            }
                        }
                        return true;
                    }
                    function coordinatesEqual(a, b) {
                        if (a.length !== b.length) {
                            return false;
                        }
                        var na = a.slice().sort(compSort);
                        var nb = b.slice().sort(compSort);
                        for (var i = 0; i < na.length; i++) {
                            if (na[i].length !== nb[i].length) {
                                return false;
                            }
                            for (var j = 0; j < na.length; j++) {
                                if (na[i][j] !== nb[i][j]) {
                                    return false;
                                }
                            }
                        }
                        return true;
                    }
                    var excludeFromJSON = ["length"];
                    function Primitive(geojson) {
                        if (geojson) {
                            switch (geojson.type) {
                                case 'Point':
                                    return new Point(geojson);
                                case 'MultiPoint':
                                    return new MultiPoint(geojson);
                                case 'LineString':
                                    return new LineString(geojson);
                                case 'MultiLineString':
                                    return new MultiLineString(geojson);
                                case 'Polygon':
                                    return new Polygon(geojson);
                                case 'MultiPolygon':
                                    return new MultiPolygon(geojson);
                                case 'Feature':
                                    return new Feature(geojson);
                                case 'FeatureCollection':
                                    return new FeatureCollection(geojson);
                                case 'GeometryCollection':
                                    return new GeometryCollection(geojson);
                                default:
                                    throw new Error("Unknown type: " + geojson.type);
                            }
                        }
                    }
                    Primitive.prototype.toMercator = function () {
                        return toMercator(this);
                    };
                    Primitive.prototype.toGeographic = function () {
                        return toGeographic(this);
                    };
                    Primitive.prototype.envelope = function () {
                        return calculateEnvelope(this);
                    };
                    Primitive.prototype.bbox = function () {
                        return calculateBounds(this);
                    };
                    Primitive.prototype.convexHull = function () {
                        var coordinates = [], i, j;
                        if (this.type === 'Point') {
                            return null;
                        }
                        else if (this.type === 'LineString' || this.type === 'MultiPoint') {
                            if (this.coordinates && this.coordinates.length >= 3) {
                                coordinates = this.coordinates;
                            }
                            else {
                                return null;
                            }
                        }
                        else if (this.type === 'Polygon' || this.type === 'MultiLineString') {
                            if (this.coordinates && this.coordinates.length > 0) {
                                for (i = 0; i < this.coordinates.length; i++) {
                                    coordinates = coordinates.concat(this.coordinates[i]);
                                }
                                if (coordinates.length < 3) {
                                    return null;
                                }
                            }
                            else {
                                return null;
                            }
                        }
                        else if (this.type === 'MultiPolygon') {
                            if (this.coordinates && this.coordinates.length > 0) {
                                for (i = 0; i < this.coordinates.length; i++) {
                                    for (j = 0; j < this.coordinates[i].length; j++) {
                                        coordinates = coordinates.concat(this.coordinates[i][j]);
                                    }
                                }
                                if (coordinates.length < 3) {
                                    return null;
                                }
                            }
                            else {
                                return null;
                            }
                        }
                        else if (this.type === "Feature") {
                            var primitive = new Primitive(this.geometry);
                            return primitive.convexHull();
                        }
                        return new Polygon({
                            type: 'Polygon',
                            coordinates: closedPolygon([convexHull(coordinates)])
                        });
                    };
                    Primitive.prototype.toJSON = function () {
                        var obj = {};
                        for (var key in this) {
                            if (this.hasOwnProperty(key) && excludeFromJSON.indexOf(key) === -1) {
                                obj[key] = this[key];
                            }
                        }
                        obj.bbox = calculateBounds(this);
                        return obj;
                    };
                    Primitive.prototype.contains = function (primitive) {
                        return new Primitive(primitive).within(this);
                    };
                    Primitive.prototype.within = function (primitive) {
                        var coordinates, i, contains;
                        if (primitive.type === 'Feature') {
                            primitive = primitive.geometry;
                        }
                        if (primitive.type === "Point") {
                            if (this.type === "Point") {
                                return pointsEqual(this.coordinates, primitive.coordinates);
                            }
                        }
                        if (primitive.type === "MultiLineString") {
                            if (this.type === "Point") {
                                for (i = 0; i < primitive.coordinates.length; i++) {
                                    var linestring = { type: "LineString", coordinates: primitive.coordinates[i] };
                                    if (this.within(linestring)) {
                                        return true;
                                    }
                                }
                            }
                        }
                        if (primitive.type === "LineString" || primitive.type === "MultiPoint") {
                            if (this.type === "Point") {
                                for (i = 0; i < primitive.coordinates.length; i++) {
                                    if (this.coordinates.length !== primitive.coordinates[i].length) {
                                        return false;
                                    }
                                    if (pointsEqual(this.coordinates, primitive.coordinates[i])) {
                                        return true;
                                    }
                                }
                            }
                        }
                        if (primitive.type === "Polygon") {
                            if (this.type === "Polygon") {
                                if (primitive.coordinates.length === this.coordinates.length) {
                                    for (i = 0; i < this.coordinates.length; i++) {
                                        if (coordinatesEqual(this.coordinates[i], primitive.coordinates[i])) {
                                            return true;
                                        }
                                    }
                                }
                                if (this.coordinates.length && polygonContainsPoint(primitive.coordinates, this.coordinates[0][0])) {
                                    return !arraysIntersectArrays(closedPolygon(this.coordinates), closedPolygon(primitive.coordinates));
                                }
                                else {
                                    return false;
                                }
                            }
                            else if (this.type === "Point") {
                                return polygonContainsPoint(primitive.coordinates, this.coordinates);
                            }
                            else if (this.type === "LineString" || this.type === "MultiPoint") {
                                if (!this.coordinates || this.coordinates.length === 0) {
                                    return false;
                                }
                                for (i = 0; i < this.coordinates.length; i++) {
                                    if (polygonContainsPoint(primitive.coordinates, this.coordinates[i]) === false) {
                                        return false;
                                    }
                                }
                                return true;
                            }
                            else if (this.type === "MultiLineString") {
                                for (i = 0; i < this.coordinates.length; i++) {
                                    var ls = new LineString(this.coordinates[i]);
                                    if (ls.within(primitive) === false) {
                                        contains++;
                                        return false;
                                    }
                                }
                                return true;
                            }
                            else if (this.type === "MultiPolygon") {
                                for (i = 0; i < this.coordinates.length; i++) {
                                    var p1 = new Primitive({ type: "Polygon", coordinates: this.coordinates[i] });
                                    if (p1.within(primitive) === false) {
                                        return false;
                                    }
                                }
                                return true;
                            }
                        }
                        if (primitive.type === "MultiPolygon") {
                            if (this.type === "Point") {
                                if (primitive.coordinates.length) {
                                    for (i = 0; i < primitive.coordinates.length; i++) {
                                        coordinates = primitive.coordinates[i];
                                        if (polygonContainsPoint(coordinates, this.coordinates) && arraysIntersectArrays([this.coordinates], primitive.coordinates) === false) {
                                            return true;
                                        }
                                    }
                                }
                                return false;
                            }
                            else if (this.type === "Polygon") {
                                for (i = 0; i < this.coordinates.length; i++) {
                                    if (primitive.coordinates[i].length === this.coordinates.length) {
                                        for (j = 0; j < this.coordinates.length; j++) {
                                            if (coordinatesEqual(this.coordinates[j], primitive.coordinates[i][j])) {
                                                return true;
                                            }
                                        }
                                    }
                                }
                                if (arraysIntersectArrays(this.coordinates, primitive.coordinates) === false) {
                                    if (primitive.coordinates.length) {
                                        for (i = 0; i < primitive.coordinates.length; i++) {
                                            coordinates = primitive.coordinates[i];
                                            if (polygonContainsPoint(coordinates, this.coordinates[0][0]) === false) {
                                                contains = false;
                                            }
                                            else {
                                                contains = true;
                                            }
                                        }
                                        return contains;
                                    }
                                }
                            }
                            else if (this.type === "LineString" || this.type === "MultiPoint") {
                                for (i = 0; i < primitive.coordinates.length; i++) {
                                    var p = { type: "Polygon", coordinates: primitive.coordinates[i] };
                                    if (this.within(p)) {
                                        return true;
                                    }
                                    return false;
                                }
                            }
                            else if (this.type === "MultiLineString") {
                                for (i = 0; i < this.coordinates.length; i++) {
                                    var lines = new LineString(this.coordinates[i]);
                                    if (lines.within(primitive) === false) {
                                        return false;
                                    }
                                }
                                return true;
                            }
                            else if (this.type === "MultiPolygon") {
                                for (i = 0; i < primitive.coordinates.length; i++) {
                                    var mpoly = { type: "Polygon", coordinates: primitive.coordinates[i] };
                                    if (this.within(mpoly) === false) {
                                        return false;
                                    }
                                }
                                return true;
                            }
                        }
                        return false;
                    };
                    Primitive.prototype.intersects = function (primitive) {
                        if (primitive.type === 'Feature') {
                            primitive = primitive.geometry;
                        }
                        var p = new Primitive(primitive);
                        if (this.within(primitive) || p.within(this)) {
                            return true;
                        }
                        if (this.type !== 'Point' && this.type !== 'MultiPoint' &&
                            primitive.type !== 'Point' && primitive.type !== 'MultiPoint') {
                            return arraysIntersectArrays(this.coordinates, primitive.coordinates);
                        }
                        else if (this.type === 'Feature') {
                            var inner = new Primitive(this.geometry);
                            return inner.intersects(primitive);
                        }
                        warn("Type " + this.type + " to " + primitive.type + " intersection is not supported by intersects");
                        return false;
                    };
                    function Point(input) {
                        var args = Array.prototype.slice.call(arguments);
                        if (input && input.type === "Point" && input.coordinates) {
                            extend(this, input);
                        }
                        else if (input && isArray(input)) {
                            this.coordinates = input;
                        }
                        else if (args.length >= 2) {
                            this.coordinates = args;
                        }
                        else {
                            throw "Terraformer: invalid input for Terraformer.Point";
                        }
                        this.type = "Point";
                    }
                    Point.prototype = new Primitive();
                    Point.prototype.constructor = Point;
                    function MultiPoint(input) {
                        if (input && input.type === "MultiPoint" && input.coordinates) {
                            extend(this, input);
                        }
                        else if (isArray(input)) {
                            this.coordinates = input;
                        }
                        else {
                            throw "Terraformer: invalid input for Terraformer.MultiPoint";
                        }
                        this.type = "MultiPoint";
                    }
                    MultiPoint.prototype = new Primitive();
                    MultiPoint.prototype.constructor = MultiPoint;
                    MultiPoint.prototype.forEach = function (func) {
                        for (var i = 0; i < this.coordinates.length; i++) {
                            func.apply(this, [this.coordinates[i], i, this.coordinates]);
                        }
                        return this;
                    };
                    MultiPoint.prototype.addPoint = function (point) {
                        this.coordinates.push(point);
                        return this;
                    };
                    MultiPoint.prototype.insertPoint = function (point, index) {
                        this.coordinates.splice(index, 0, point);
                        return this;
                    };
                    MultiPoint.prototype.removePoint = function (remove) {
                        if (typeof remove === "number") {
                            this.coordinates.splice(remove, 1);
                        }
                        else {
                            this.coordinates.splice(this.coordinates.indexOf(remove), 1);
                        }
                        return this;
                    };
                    MultiPoint.prototype.get = function (i) {
                        return new Point(this.coordinates[i]);
                    };
                    function LineString(input) {
                        if (input && input.type === "LineString" && input.coordinates) {
                            extend(this, input);
                        }
                        else if (isArray(input)) {
                            this.coordinates = input;
                        }
                        else {
                            throw "Terraformer: invalid input for Terraformer.LineString";
                        }
                        this.type = "LineString";
                    }
                    LineString.prototype = new Primitive();
                    LineString.prototype.constructor = LineString;
                    LineString.prototype.addVertex = function (point) {
                        this.coordinates.push(point);
                        return this;
                    };
                    LineString.prototype.insertVertex = function (point, index) {
                        this.coordinates.splice(index, 0, point);
                        return this;
                    };
                    LineString.prototype.removeVertex = function (remove) {
                        this.coordinates.splice(remove, 1);
                        return this;
                    };
                    function MultiLineString(input) {
                        if (input && input.type === "MultiLineString" && input.coordinates) {
                            extend(this, input);
                        }
                        else if (isArray(input)) {
                            this.coordinates = input;
                        }
                        else {
                            throw "Terraformer: invalid input for Terraformer.MultiLineString";
                        }
                        this.type = "MultiLineString";
                    }
                    MultiLineString.prototype = new Primitive();
                    MultiLineString.prototype.constructor = MultiLineString;
                    MultiLineString.prototype.forEach = function (func) {
                        for (var i = 0; i < this.coordinates.length; i++) {
                            func.apply(this, [this.coordinates[i], i, this.coordinates]);
                        }
                    };
                    MultiLineString.prototype.get = function (i) {
                        return new LineString(this.coordinates[i]);
                    };
                    function Polygon(input) {
                        if (input && input.type === "Polygon" && input.coordinates) {
                            extend(this, input);
                        }
                        else if (isArray(input)) {
                            this.coordinates = input;
                        }
                        else {
                            throw "Terraformer: invalid input for Terraformer.Polygon";
                        }
                        this.type = "Polygon";
                    }
                    Polygon.prototype = new Primitive();
                    Polygon.prototype.constructor = Polygon;
                    Polygon.prototype.addVertex = function (point) {
                        this.insertVertex(point, this.coordinates[0].length - 1);
                        return this;
                    };
                    Polygon.prototype.insertVertex = function (point, index) {
                        this.coordinates[0].splice(index, 0, point);
                        return this;
                    };
                    Polygon.prototype.removeVertex = function (remove) {
                        this.coordinates[0].splice(remove, 1);
                        return this;
                    };
                    Polygon.prototype.close = function () {
                        this.coordinates = closedPolygon(this.coordinates);
                    };
                    Polygon.prototype.hasHoles = function () {
                        return this.coordinates.length > 1;
                    };
                    Polygon.prototype.holes = function () {
                        holes = [];
                        if (this.hasHoles()) {
                            for (var i = 1; i < this.coordinates.length; i++) {
                                holes.push(new Polygon([this.coordinates[i]]));
                            }
                        }
                        return holes;
                    };
                    function MultiPolygon(input) {
                        if (input && input.type === "MultiPolygon" && input.coordinates) {
                            extend(this, input);
                        }
                        else if (isArray(input)) {
                            this.coordinates = input;
                        }
                        else {
                            throw "Terraformer: invalid input for Terraformer.MultiPolygon";
                        }
                        this.type = "MultiPolygon";
                    }
                    MultiPolygon.prototype = new Primitive();
                    MultiPolygon.prototype.constructor = MultiPolygon;
                    MultiPolygon.prototype.forEach = function (func) {
                        for (var i = 0; i < this.coordinates.length; i++) {
                            func.apply(this, [this.coordinates[i], i, this.coordinates]);
                        }
                    };
                    MultiPolygon.prototype.get = function (i) {
                        return new Polygon(this.coordinates[i]);
                    };
                    MultiPolygon.prototype.close = function () {
                        var outer = [];
                        this.forEach(function (polygon) {
                            outer.push(closedPolygon(polygon));
                        });
                        this.coordinates = outer;
                        return this;
                    };
                    function Feature(input) {
                        if (input && input.type === "Feature") {
                            extend(this, input);
                        }
                        else if (input && input.type && input.coordinates) {
                            this.geometry = input;
                        }
                        else {
                            throw "Terraformer: invalid input for Terraformer.Feature";
                        }
                        this.type = "Feature";
                    }
                    Feature.prototype = new Primitive();
                    Feature.prototype.constructor = Feature;
                    function FeatureCollection(input) {
                        if (input && input.type === "FeatureCollection" && input.features) {
                            extend(this, input);
                        }
                        else if (isArray(input)) {
                            this.features = input;
                        }
                        else {
                            throw "Terraformer: invalid input for Terraformer.FeatureCollection";
                        }
                        this.type = "FeatureCollection";
                    }
                    FeatureCollection.prototype = new Primitive();
                    FeatureCollection.prototype.constructor = FeatureCollection;
                    FeatureCollection.prototype.forEach = function (func) {
                        for (var i = 0; i < this.features.length; i++) {
                            func.apply(this, [this.features[i], i, this.features]);
                        }
                    };
                    FeatureCollection.prototype.get = function (id) {
                        var found;
                        this.forEach(function (feature) {
                            if (feature.id === id) {
                                found = feature;
                            }
                        });
                        return new Feature(found);
                    };
                    function GeometryCollection(input) {
                        if (input && input.type === "GeometryCollection" && input.geometries) {
                            extend(this, input);
                        }
                        else if (isArray(input)) {
                            this.geometries = input;
                        }
                        else if (input.coordinates && input.type) {
                            this.type = "GeometryCollection";
                            this.geometries = [input];
                        }
                        else {
                            throw "Terraformer: invalid input for Terraformer.GeometryCollection";
                        }
                        this.type = "GeometryCollection";
                    }
                    GeometryCollection.prototype = new Primitive();
                    GeometryCollection.prototype.constructor = GeometryCollection;
                    GeometryCollection.prototype.forEach = function (func) {
                        for (var i = 0; i < this.geometries.length; i++) {
                            func.apply(this, [this.geometries[i], i, this.geometries]);
                        }
                    };
                    GeometryCollection.prototype.get = function (i) {
                        return new Primitive(this.geometries[i]);
                    };
                    function createCircle(center, radius, interpolate) {
                        var mercatorPosition = positionToMercator(center);
                        var steps = interpolate || 64;
                        var polygon = {
                            type: "Polygon",
                            coordinates: [[]]
                        };
                        for (var i = 1; i <= steps; i++) {
                            var radians = i * (360 / steps) * Math.PI / 180;
                            polygon.coordinates[0].push([mercatorPosition[0] + radius * Math.cos(radians), mercatorPosition[1] + radius * Math.sin(radians)]);
                        }
                        polygon.coordinates = closedPolygon(polygon.coordinates);
                        return toGeographic(polygon);
                    }
                    function Circle(center, radius, interpolate) {
                        var steps = interpolate || 64;
                        var rad = radius || 250;
                        if (!center || center.length < 2 || !rad || !steps) {
                            throw new Error("Terraformer: missing parameter for Terraformer.Circle");
                        }
                        extend(this, new Feature({
                            type: "Feature",
                            geometry: createCircle(center, rad, steps),
                            properties: {
                                radius: rad,
                                center: center,
                                steps: steps
                            }
                        }));
                    }
                    Circle.prototype = new Primitive();
                    Circle.prototype.constructor = Circle;
                    Circle.prototype.recalculate = function () {
                        this.geometry = createCircle(this.properties.center, this.properties.radius, this.properties.steps);
                        return this;
                    };
                    Circle.prototype.center = function (coordinates) {
                        if (coordinates) {
                            this.properties.center = coordinates;
                            this.recalculate();
                        }
                        return this.properties.center;
                    };
                    Circle.prototype.radius = function (radius) {
                        if (radius) {
                            this.properties.radius = radius;
                            this.recalculate();
                        }
                        return this.properties.radius;
                    };
                    Circle.prototype.steps = function (steps) {
                        if (steps) {
                            this.properties.steps = steps;
                            this.recalculate();
                        }
                        return this.properties.steps;
                    };
                    Circle.prototype.toJSON = function () {
                        var output = Primitive.prototype.toJSON.call(this);
                        return output;
                    };
                    exports.Primitive = Primitive;
                    exports.Point = Point;
                    exports.MultiPoint = MultiPoint;
                    exports.LineString = LineString;
                    exports.MultiLineString = MultiLineString;
                    exports.Polygon = Polygon;
                    exports.MultiPolygon = MultiPolygon;
                    exports.Feature = Feature;
                    exports.FeatureCollection = FeatureCollection;
                    exports.GeometryCollection = GeometryCollection;
                    exports.Circle = Circle;
                    exports.toMercator = toMercator;
                    exports.toGeographic = toGeographic;
                    exports.Tools = {};
                    exports.Tools.positionToMercator = positionToMercator;
                    exports.Tools.positionToGeographic = positionToGeographic;
                    exports.Tools.applyConverter = applyConverter;
                    exports.Tools.toMercator = toMercator;
                    exports.Tools.toGeographic = toGeographic;
                    exports.Tools.createCircle = createCircle;
                    exports.Tools.calculateBounds = calculateBounds;
                    exports.Tools.calculateEnvelope = calculateEnvelope;
                    exports.Tools.coordinatesContainPoint = coordinatesContainPoint;
                    exports.Tools.polygonContainsPoint = polygonContainsPoint;
                    exports.Tools.arraysIntersectArrays = arraysIntersectArrays;
                    exports.Tools.coordinatesContainPoint = coordinatesContainPoint;
                    exports.Tools.coordinatesEqual = coordinatesEqual;
                    exports.Tools.convexHull = convexHull;
                    exports.Tools.isConvex = isConvex;
                    exports.MercatorCRS = MercatorCRS;
                    exports.GeographicCRS = GeographicCRS;
                    return exports;
                }));
            }, {}], 32: [function (require, module, exports) {
                function DOMParser(options) {
                    this.options = options || { locator: {} };
                }
                DOMParser.prototype.parseFromString = function (source, mimeType) {
                    var options = this.options;
                    var sax = new XMLReader();
                    var domBuilder = options.domBuilder || new DOMHandler();
                    var errorHandler = options.errorHandler;
                    var locator = options.locator;
                    var defaultNSMap = options.xmlns || {};
                    var entityMap = { 'lt': '<', 'gt': '>', 'amp': '&', 'quot': '"', 'apos': "'" };
                    if (locator) {
                        domBuilder.setDocumentLocator(locator);
                    }
                    sax.errorHandler = buildErrorHandler(errorHandler, domBuilder, locator);
                    sax.domBuilder = options.domBuilder || domBuilder;
                    if (/\/x?html?$/.test(mimeType)) {
                        entityMap.nbsp = '\xa0';
                        entityMap.copy = '\xa9';
                        defaultNSMap[''] = 'http://www.w3.org/1999/xhtml';
                    }
                    defaultNSMap.xml = defaultNSMap.xml || 'http://www.w3.org/XML/1998/namespace';
                    if (source) {
                        sax.parse(source, defaultNSMap, entityMap);
                    }
                    else {
                        sax.errorHandler.error("invalid doc source");
                    }
                    return domBuilder.doc;
                };
                function buildErrorHandler(errorImpl, domBuilder, locator) {
                    if (!errorImpl) {
                        if (domBuilder instanceof DOMHandler) {
                            return domBuilder;
                        }
                        errorImpl = domBuilder;
                    }
                    var errorHandler = {};
                    var isCallback = errorImpl instanceof Function;
                    locator = locator || {};
                    function build(key) {
                        var fn = errorImpl[key];
                        if (!fn && isCallback) {
                            fn = errorImpl.length == 2 ? function (msg) { errorImpl(key, msg); } : errorImpl;
                        }
                        errorHandler[key] = fn && function (msg) {
                            fn('[xmldom ' + key + ']\t' + msg + _locator(locator));
                        } || function () { };
                    }
                    build('warning');
                    build('error');
                    build('fatalError');
                    return errorHandler;
                }
                function DOMHandler() {
                    this.cdata = false;
                }
                function position(locator, node) {
                    node.lineNumber = locator.lineNumber;
                    node.columnNumber = locator.columnNumber;
                }
                DOMHandler.prototype = {
                    startDocument: function () {
                        this.doc = new DOMImplementation().createDocument(null, null, null);
                        if (this.locator) {
                            this.doc.documentURI = this.locator.systemId;
                        }
                    },
                    startElement: function (namespaceURI, localName, qName, attrs) {
                        var doc = this.doc;
                        var el = doc.createElementNS(namespaceURI, qName || localName);
                        var len = attrs.length;
                        appendElement(this, el);
                        this.currentElement = el;
                        this.locator && position(this.locator, el);
                        for (var i = 0; i < len; i++) {
                            var namespaceURI = attrs.getURI(i);
                            var value = attrs.getValue(i);
                            var qName = attrs.getQName(i);
                            var attr = doc.createAttributeNS(namespaceURI, qName);
                            this.locator && position(attrs.getLocator(i), attr);
                            attr.value = attr.nodeValue = value;
                            el.setAttributeNode(attr);
                        }
                    },
                    endElement: function (namespaceURI, localName, qName) {
                        var current = this.currentElement;
                        var tagName = current.tagName;
                        this.currentElement = current.parentNode;
                    },
                    startPrefixMapping: function (prefix, uri) {
                    },
                    endPrefixMapping: function (prefix) {
                    },
                    processingInstruction: function (target, data) {
                        var ins = this.doc.createProcessingInstruction(target, data);
                        this.locator && position(this.locator, ins);
                        appendElement(this, ins);
                    },
                    ignorableWhitespace: function (ch, start, length) {
                    },
                    characters: function (chars, start, length) {
                        chars = _toString.apply(this, arguments);
                        if (chars) {
                            if (this.cdata) {
                                var charNode = this.doc.createCDATASection(chars);
                            }
                            else {
                                var charNode = this.doc.createTextNode(chars);
                            }
                            if (this.currentElement) {
                                this.currentElement.appendChild(charNode);
                            }
                            else if (/^\s*$/.test(chars)) {
                                this.doc.appendChild(charNode);
                            }
                            this.locator && position(this.locator, charNode);
                        }
                    },
                    skippedEntity: function (name) {
                    },
                    endDocument: function () {
                        this.doc.normalize();
                    },
                    setDocumentLocator: function (locator) {
                        if (this.locator = locator) {
                            locator.lineNumber = 0;
                        }
                    },
                    comment: function (chars, start, length) {
                        chars = _toString.apply(this, arguments);
                        var comm = this.doc.createComment(chars);
                        this.locator && position(this.locator, comm);
                        appendElement(this, comm);
                    },
                    startCDATA: function () {
                        this.cdata = true;
                    },
                    endCDATA: function () {
                        this.cdata = false;
                    },
                    startDTD: function (name, publicId, systemId) {
                        var impl = this.doc.implementation;
                        if (impl && impl.createDocumentType) {
                            var dt = impl.createDocumentType(name, publicId, systemId);
                            this.locator && position(this.locator, dt);
                            appendElement(this, dt);
                        }
                    },
                    warning: function (error) {
                        console.warn('[xmldom warning]\t' + error, _locator(this.locator));
                    },
                    error: function (error) {
                        console.error('[xmldom error]\t' + error, _locator(this.locator));
                    },
                    fatalError: function (error) {
                        console.error('[xmldom fatalError]\t' + error, _locator(this.locator));
                        throw error;
                    }
                };
                function _locator(l) {
                    if (l) {
                        return '\n@' + (l.systemId || '') + '#[line:' + l.lineNumber + ',col:' + l.columnNumber + ']';
                    }
                }
                function _toString(chars, start, length) {
                    if (typeof chars == 'string') {
                        return chars.substr(start, length);
                    }
                    else {
                        if (chars.length >= start + length || start) {
                            return new java.lang.String(chars, start, length) + '';
                        }
                        return chars;
                    }
                }
                "endDTD,startEntity,endEntity,attributeDecl,elementDecl,externalEntityDecl,internalEntityDecl,resolveEntity,getExternalSubset,notationDecl,unparsedEntityDecl".replace(/\w+/g, function (key) {
                    DOMHandler.prototype[key] = function () { return null; };
                });
                function appendElement(hander, node) {
                    if (!hander.currentElement) {
                        hander.doc.appendChild(node);
                    }
                    else {
                        hander.currentElement.appendChild(node);
                    }
                }
                var XMLReader = require('./sax').XMLReader;
                var DOMImplementation = exports.DOMImplementation = require('./dom').DOMImplementation;
                exports.XMLSerializer = require('./dom').XMLSerializer;
                exports.DOMParser = DOMParser;
            }, { "./dom": 33, "./sax": 34 }], 33: [function (require, module, exports) {
                function copy(src, dest) {
                    for (var p in src) {
                        dest[p] = src[p];
                    }
                }
                function _extends(Class, Super) {
                    var pt = Class.prototype;
                    if (Object.create) {
                        var ppt = Object.create(Super.prototype);
                        pt.__proto__ = ppt;
                    }
                    if (!(pt instanceof Super)) {
                        function t() { }
                        ;
                        t.prototype = Super.prototype;
                        t = new t();
                        copy(pt, t);
                        Class.prototype = pt = t;
                    }
                    if (pt.constructor != Class) {
                        if (typeof Class != 'function') {
                            console.error("unknow Class:" + Class);
                        }
                        pt.constructor = Class;
                    }
                }
                var htmlns = 'http://www.w3.org/1999/xhtml';
                var NodeType = {};
                var ELEMENT_NODE = NodeType.ELEMENT_NODE = 1;
                var ATTRIBUTE_NODE = NodeType.ATTRIBUTE_NODE = 2;
                var TEXT_NODE = NodeType.TEXT_NODE = 3;
                var CDATA_SECTION_NODE = NodeType.CDATA_SECTION_NODE = 4;
                var ENTITY_REFERENCE_NODE = NodeType.ENTITY_REFERENCE_NODE = 5;
                var ENTITY_NODE = NodeType.ENTITY_NODE = 6;
                var PROCESSING_INSTRUCTION_NODE = NodeType.PROCESSING_INSTRUCTION_NODE = 7;
                var COMMENT_NODE = NodeType.COMMENT_NODE = 8;
                var DOCUMENT_NODE = NodeType.DOCUMENT_NODE = 9;
                var DOCUMENT_TYPE_NODE = NodeType.DOCUMENT_TYPE_NODE = 10;
                var DOCUMENT_FRAGMENT_NODE = NodeType.DOCUMENT_FRAGMENT_NODE = 11;
                var NOTATION_NODE = NodeType.NOTATION_NODE = 12;
                var ExceptionCode = {};
                var ExceptionMessage = {};
                var INDEX_SIZE_ERR = ExceptionCode.INDEX_SIZE_ERR = ((ExceptionMessage[1] = "Index size error"), 1);
                var DOMSTRING_SIZE_ERR = ExceptionCode.DOMSTRING_SIZE_ERR = ((ExceptionMessage[2] = "DOMString size error"), 2);
                var HIERARCHY_REQUEST_ERR = ExceptionCode.HIERARCHY_REQUEST_ERR = ((ExceptionMessage[3] = "Hierarchy request error"), 3);
                var WRONG_DOCUMENT_ERR = ExceptionCode.WRONG_DOCUMENT_ERR = ((ExceptionMessage[4] = "Wrong document"), 4);
                var INVALID_CHARACTER_ERR = ExceptionCode.INVALID_CHARACTER_ERR = ((ExceptionMessage[5] = "Invalid character"), 5);
                var NO_DATA_ALLOWED_ERR = ExceptionCode.NO_DATA_ALLOWED_ERR = ((ExceptionMessage[6] = "No data allowed"), 6);
                var NO_MODIFICATION_ALLOWED_ERR = ExceptionCode.NO_MODIFICATION_ALLOWED_ERR = ((ExceptionMessage[7] = "No modification allowed"), 7);
                var NOT_FOUND_ERR = ExceptionCode.NOT_FOUND_ERR = ((ExceptionMessage[8] = "Not found"), 8);
                var NOT_SUPPORTED_ERR = ExceptionCode.NOT_SUPPORTED_ERR = ((ExceptionMessage[9] = "Not supported"), 9);
                var INUSE_ATTRIBUTE_ERR = ExceptionCode.INUSE_ATTRIBUTE_ERR = ((ExceptionMessage[10] = "Attribute in use"), 10);
                var INVALID_STATE_ERR = ExceptionCode.INVALID_STATE_ERR = ((ExceptionMessage[11] = "Invalid state"), 11);
                var SYNTAX_ERR = ExceptionCode.SYNTAX_ERR = ((ExceptionMessage[12] = "Syntax error"), 12);
                var INVALID_MODIFICATION_ERR = ExceptionCode.INVALID_MODIFICATION_ERR = ((ExceptionMessage[13] = "Invalid modification"), 13);
                var NAMESPACE_ERR = ExceptionCode.NAMESPACE_ERR = ((ExceptionMessage[14] = "Invalid namespace"), 14);
                var INVALID_ACCESS_ERR = ExceptionCode.INVALID_ACCESS_ERR = ((ExceptionMessage[15] = "Invalid access"), 15);
                function DOMException(code, message) {
                    if (message instanceof Error) {
                        var error = message;
                    }
                    else {
                        error = this;
                        Error.call(this, ExceptionMessage[code]);
                        this.message = ExceptionMessage[code];
                        if (Error.captureStackTrace)
                            Error.captureStackTrace(this, DOMException);
                    }
                    error.code = code;
                    if (message)
                        this.message = this.message + ": " + message;
                    return error;
                }
                ;
                DOMException.prototype = Error.prototype;
                copy(ExceptionCode, DOMException);
                function NodeList() {
                }
                ;
                NodeList.prototype = {
                    length: 0,
                    item: function (index) {
                        return this[index] || null;
                    },
                    toString: function (isHTML, nodeFilter) {
                        for (var buf = [], i = 0; i < this.length; i++) {
                            serializeToString(this[i], buf, isHTML, nodeFilter);
                        }
                        return buf.join('');
                    }
                };
                function LiveNodeList(node, refresh) {
                    this._node = node;
                    this._refresh = refresh;
                    _updateLiveList(this);
                }
                function _updateLiveList(list) {
                    var inc = list._node._inc || list._node.ownerDocument._inc;
                    if (list._inc != inc) {
                        var ls = list._refresh(list._node);
                        __set__(list, 'length', ls.length);
                        copy(ls, list);
                        list._inc = inc;
                    }
                }
                LiveNodeList.prototype.item = function (i) {
                    _updateLiveList(this);
                    return this[i];
                };
                _extends(LiveNodeList, NodeList);
                function NamedNodeMap() {
                }
                ;
                function _findNodeIndex(list, node) {
                    var i = list.length;
                    while (i--) {
                        if (list[i] === node) {
                            return i;
                        }
                    }
                }
                function _addNamedNode(el, list, newAttr, oldAttr) {
                    if (oldAttr) {
                        list[_findNodeIndex(list, oldAttr)] = newAttr;
                    }
                    else {
                        list[list.length++] = newAttr;
                    }
                    if (el) {
                        newAttr.ownerElement = el;
                        var doc = el.ownerDocument;
                        if (doc) {
                            oldAttr && _onRemoveAttribute(doc, el, oldAttr);
                            _onAddAttribute(doc, el, newAttr);
                        }
                    }
                }
                function _removeNamedNode(el, list, attr) {
                    var i = _findNodeIndex(list, attr);
                    if (i >= 0) {
                        var lastIndex = list.length - 1;
                        while (i < lastIndex) {
                            list[i] = list[++i];
                        }
                        list.length = lastIndex;
                        if (el) {
                            var doc = el.ownerDocument;
                            if (doc) {
                                _onRemoveAttribute(doc, el, attr);
                                attr.ownerElement = null;
                            }
                        }
                    }
                    else {
                        throw DOMException(NOT_FOUND_ERR, new Error(el.tagName + '@' + attr));
                    }
                }
                NamedNodeMap.prototype = {
                    length: 0,
                    item: NodeList.prototype.item,
                    getNamedItem: function (key) {
                        var i = this.length;
                        while (i--) {
                            var attr = this[i];
                            if (attr.nodeName == key) {
                                return attr;
                            }
                        }
                    },
                    setNamedItem: function (attr) {
                        var el = attr.ownerElement;
                        if (el && el != this._ownerElement) {
                            throw new DOMException(INUSE_ATTRIBUTE_ERR);
                        }
                        var oldAttr = this.getNamedItem(attr.nodeName);
                        _addNamedNode(this._ownerElement, this, attr, oldAttr);
                        return oldAttr;
                    },
                    setNamedItemNS: function (attr) {
                        var el = attr.ownerElement, oldAttr;
                        if (el && el != this._ownerElement) {
                            throw new DOMException(INUSE_ATTRIBUTE_ERR);
                        }
                        oldAttr = this.getNamedItemNS(attr.namespaceURI, attr.localName);
                        _addNamedNode(this._ownerElement, this, attr, oldAttr);
                        return oldAttr;
                    },
                    removeNamedItem: function (key) {
                        var attr = this.getNamedItem(key);
                        _removeNamedNode(this._ownerElement, this, attr);
                        return attr;
                    },
                    removeNamedItemNS: function (namespaceURI, localName) {
                        var attr = this.getNamedItemNS(namespaceURI, localName);
                        _removeNamedNode(this._ownerElement, this, attr);
                        return attr;
                    },
                    getNamedItemNS: function (namespaceURI, localName) {
                        var i = this.length;
                        while (i--) {
                            var node = this[i];
                            if (node.localName == localName && node.namespaceURI == namespaceURI) {
                                return node;
                            }
                        }
                        return null;
                    }
                };
                function DOMImplementation(features) {
                    this._features = {};
                    if (features) {
                        for (var feature in features) {
                            this._features = features[feature];
                        }
                    }
                }
                ;
                DOMImplementation.prototype = {
                    hasFeature: function (feature, version) {
                        var versions = this._features[feature.toLowerCase()];
                        if (versions && (!version || version in versions)) {
                            return true;
                        }
                        else {
                            return false;
                        }
                    },
                    createDocument: function (namespaceURI, qualifiedName, doctype) {
                        var doc = new Document();
                        doc.implementation = this;
                        doc.childNodes = new NodeList();
                        doc.doctype = doctype;
                        if (doctype) {
                            doc.appendChild(doctype);
                        }
                        if (qualifiedName) {
                            var root = doc.createElementNS(namespaceURI, qualifiedName);
                            doc.appendChild(root);
                        }
                        return doc;
                    },
                    createDocumentType: function (qualifiedName, publicId, systemId) {
                        var node = new DocumentType();
                        node.name = qualifiedName;
                        node.nodeName = qualifiedName;
                        node.publicId = publicId;
                        node.systemId = systemId;
                        return node;
                    }
                };
                function Node() {
                }
                ;
                Node.prototype = {
                    firstChild: null,
                    lastChild: null,
                    previousSibling: null,
                    nextSibling: null,
                    attributes: null,
                    parentNode: null,
                    childNodes: null,
                    ownerDocument: null,
                    nodeValue: null,
                    namespaceURI: null,
                    prefix: null,
                    localName: null,
                    insertBefore: function (newChild, refChild) {
                        return _insertBefore(this, newChild, refChild);
                    },
                    replaceChild: function (newChild, oldChild) {
                        this.insertBefore(newChild, oldChild);
                        if (oldChild) {
                            this.removeChild(oldChild);
                        }
                    },
                    removeChild: function (oldChild) {
                        return _removeChild(this, oldChild);
                    },
                    appendChild: function (newChild) {
                        return this.insertBefore(newChild, null);
                    },
                    hasChildNodes: function () {
                        return this.firstChild != null;
                    },
                    cloneNode: function (deep) {
                        return cloneNode(this.ownerDocument || this, this, deep);
                    },
                    normalize: function () {
                        var child = this.firstChild;
                        while (child) {
                            var next = child.nextSibling;
                            if (next && next.nodeType == TEXT_NODE && child.nodeType == TEXT_NODE) {
                                this.removeChild(next);
                                child.appendData(next.data);
                            }
                            else {
                                child.normalize();
                                child = next;
                            }
                        }
                    },
                    isSupported: function (feature, version) {
                        return this.ownerDocument.implementation.hasFeature(feature, version);
                    },
                    hasAttributes: function () {
                        return this.attributes.length > 0;
                    },
                    lookupPrefix: function (namespaceURI) {
                        var el = this;
                        while (el) {
                            var map = el._nsMap;
                            if (map) {
                                for (var n in map) {
                                    if (map[n] == namespaceURI) {
                                        return n;
                                    }
                                }
                            }
                            el = el.nodeType == ATTRIBUTE_NODE ? el.ownerDocument : el.parentNode;
                        }
                        return null;
                    },
                    lookupNamespaceURI: function (prefix) {
                        var el = this;
                        while (el) {
                            var map = el._nsMap;
                            if (map) {
                                if (prefix in map) {
                                    return map[prefix];
                                }
                            }
                            el = el.nodeType == ATTRIBUTE_NODE ? el.ownerDocument : el.parentNode;
                        }
                        return null;
                    },
                    isDefaultNamespace: function (namespaceURI) {
                        var prefix = this.lookupPrefix(namespaceURI);
                        return prefix == null;
                    }
                };
                function _xmlEncoder(c) {
                    return c == '<' && '&lt;' ||
                        c == '>' && '&gt;' ||
                        c == '&' && '&amp;' ||
                        c == '"' && '&quot;' ||
                        '&#' + c.charCodeAt() + ';';
                }
                copy(NodeType, Node);
                copy(NodeType, Node.prototype);
                function _visitNode(node, callback) {
                    if (callback(node)) {
                        return true;
                    }
                    if (node = node.firstChild) {
                        do {
                            if (_visitNode(node, callback)) {
                                return true;
                            }
                        } while (node = node.nextSibling);
                    }
                }
                function Document() {
                }
                function _onAddAttribute(doc, el, newAttr) {
                    doc && doc._inc++;
                    var ns = newAttr.namespaceURI;
                    if (ns == 'http://www.w3.org/2000/xmlns/') {
                        el._nsMap[newAttr.prefix ? newAttr.localName : ''] = newAttr.value;
                    }
                }
                function _onRemoveAttribute(doc, el, newAttr, remove) {
                    doc && doc._inc++;
                    var ns = newAttr.namespaceURI;
                    if (ns == 'http://www.w3.org/2000/xmlns/') {
                        delete el._nsMap[newAttr.prefix ? newAttr.localName : ''];
                    }
                }
                function _onUpdateChild(doc, el, newChild) {
                    if (doc && doc._inc) {
                        doc._inc++;
                        var cs = el.childNodes;
                        if (newChild) {
                            cs[cs.length++] = newChild;
                        }
                        else {
                            var child = el.firstChild;
                            var i = 0;
                            while (child) {
                                cs[i++] = child;
                                child = child.nextSibling;
                            }
                            cs.length = i;
                        }
                    }
                }
                function _removeChild(parentNode, child) {
                    var previous = child.previousSibling;
                    var next = child.nextSibling;
                    if (previous) {
                        previous.nextSibling = next;
                    }
                    else {
                        parentNode.firstChild = next;
                    }
                    if (next) {
                        next.previousSibling = previous;
                    }
                    else {
                        parentNode.lastChild = previous;
                    }
                    _onUpdateChild(parentNode.ownerDocument, parentNode);
                    return child;
                }
                function _insertBefore(parentNode, newChild, nextChild) {
                    var cp = newChild.parentNode;
                    if (cp) {
                        cp.removeChild(newChild);
                    }
                    if (newChild.nodeType === DOCUMENT_FRAGMENT_NODE) {
                        var newFirst = newChild.firstChild;
                        if (newFirst == null) {
                            return newChild;
                        }
                        var newLast = newChild.lastChild;
                    }
                    else {
                        newFirst = newLast = newChild;
                    }
                    var pre = nextChild ? nextChild.previousSibling : parentNode.lastChild;
                    newFirst.previousSibling = pre;
                    newLast.nextSibling = nextChild;
                    if (pre) {
                        pre.nextSibling = newFirst;
                    }
                    else {
                        parentNode.firstChild = newFirst;
                    }
                    if (nextChild == null) {
                        parentNode.lastChild = newLast;
                    }
                    else {
                        nextChild.previousSibling = newLast;
                    }
                    do {
                        newFirst.parentNode = parentNode;
                    } while (newFirst !== newLast && (newFirst = newFirst.nextSibling));
                    _onUpdateChild(parentNode.ownerDocument || parentNode, parentNode);
                    if (newChild.nodeType == DOCUMENT_FRAGMENT_NODE) {
                        newChild.firstChild = newChild.lastChild = null;
                    }
                    return newChild;
                }
                function _appendSingleChild(parentNode, newChild) {
                    var cp = newChild.parentNode;
                    if (cp) {
                        var pre = parentNode.lastChild;
                        cp.removeChild(newChild);
                        var pre = parentNode.lastChild;
                    }
                    var pre = parentNode.lastChild;
                    newChild.parentNode = parentNode;
                    newChild.previousSibling = pre;
                    newChild.nextSibling = null;
                    if (pre) {
                        pre.nextSibling = newChild;
                    }
                    else {
                        parentNode.firstChild = newChild;
                    }
                    parentNode.lastChild = newChild;
                    _onUpdateChild(parentNode.ownerDocument, parentNode, newChild);
                    return newChild;
                }
                Document.prototype = {
                    nodeName: '#document',
                    nodeType: DOCUMENT_NODE,
                    doctype: null,
                    documentElement: null,
                    _inc: 1,
                    insertBefore: function (newChild, refChild) {
                        if (newChild.nodeType == DOCUMENT_FRAGMENT_NODE) {
                            var child = newChild.firstChild;
                            while (child) {
                                var next = child.nextSibling;
                                this.insertBefore(child, refChild);
                                child = next;
                            }
                            return newChild;
                        }
                        if (this.documentElement == null && newChild.nodeType == ELEMENT_NODE) {
                            this.documentElement = newChild;
                        }
                        return _insertBefore(this, newChild, refChild), (newChild.ownerDocument = this), newChild;
                    },
                    removeChild: function (oldChild) {
                        if (this.documentElement == oldChild) {
                            this.documentElement = null;
                        }
                        return _removeChild(this, oldChild);
                    },
                    importNode: function (importedNode, deep) {
                        return importNode(this, importedNode, deep);
                    },
                    getElementById: function (id) {
                        var rtv = null;
                        _visitNode(this.documentElement, function (node) {
                            if (node.nodeType == ELEMENT_NODE) {
                                if (node.getAttribute('id') == id) {
                                    rtv = node;
                                    return true;
                                }
                            }
                        });
                        return rtv;
                    },
                    createElement: function (tagName) {
                        var node = new Element();
                        node.ownerDocument = this;
                        node.nodeName = tagName;
                        node.tagName = tagName;
                        node.childNodes = new NodeList();
                        var attrs = node.attributes = new NamedNodeMap();
                        attrs._ownerElement = node;
                        return node;
                    },
                    createDocumentFragment: function () {
                        var node = new DocumentFragment();
                        node.ownerDocument = this;
                        node.childNodes = new NodeList();
                        return node;
                    },
                    createTextNode: function (data) {
                        var node = new Text();
                        node.ownerDocument = this;
                        node.appendData(data);
                        return node;
                    },
                    createComment: function (data) {
                        var node = new Comment();
                        node.ownerDocument = this;
                        node.appendData(data);
                        return node;
                    },
                    createCDATASection: function (data) {
                        var node = new CDATASection();
                        node.ownerDocument = this;
                        node.appendData(data);
                        return node;
                    },
                    createProcessingInstruction: function (target, data) {
                        var node = new ProcessingInstruction();
                        node.ownerDocument = this;
                        node.tagName = node.target = target;
                        node.nodeValue = node.data = data;
                        return node;
                    },
                    createAttribute: function (name) {
                        var node = new Attr();
                        node.ownerDocument = this;
                        node.name = name;
                        node.nodeName = name;
                        node.localName = name;
                        node.specified = true;
                        return node;
                    },
                    createEntityReference: function (name) {
                        var node = new EntityReference();
                        node.ownerDocument = this;
                        node.nodeName = name;
                        return node;
                    },
                    createElementNS: function (namespaceURI, qualifiedName) {
                        var node = new Element();
                        var pl = qualifiedName.split(':');
                        var attrs = node.attributes = new NamedNodeMap();
                        node.childNodes = new NodeList();
                        node.ownerDocument = this;
                        node.nodeName = qualifiedName;
                        node.tagName = qualifiedName;
                        node.namespaceURI = namespaceURI;
                        if (pl.length == 2) {
                            node.prefix = pl[0];
                            node.localName = pl[1];
                        }
                        else {
                            node.localName = qualifiedName;
                        }
                        attrs._ownerElement = node;
                        return node;
                    },
                    createAttributeNS: function (namespaceURI, qualifiedName) {
                        var node = new Attr();
                        var pl = qualifiedName.split(':');
                        node.ownerDocument = this;
                        node.nodeName = qualifiedName;
                        node.name = qualifiedName;
                        node.namespaceURI = namespaceURI;
                        node.specified = true;
                        if (pl.length == 2) {
                            node.prefix = pl[0];
                            node.localName = pl[1];
                        }
                        else {
                            node.localName = qualifiedName;
                        }
                        return node;
                    }
                };
                _extends(Document, Node);
                function Element() {
                    this._nsMap = {};
                }
                ;
                Element.prototype = {
                    nodeType: ELEMENT_NODE,
                    hasAttribute: function (name) {
                        return this.getAttributeNode(name) != null;
                    },
                    getAttribute: function (name) {
                        var attr = this.getAttributeNode(name);
                        return attr && attr.value || '';
                    },
                    getAttributeNode: function (name) {
                        return this.attributes.getNamedItem(name);
                    },
                    setAttribute: function (name, value) {
                        var attr = this.ownerDocument.createAttribute(name);
                        attr.value = attr.nodeValue = "" + value;
                        this.setAttributeNode(attr);
                    },
                    removeAttribute: function (name) {
                        var attr = this.getAttributeNode(name);
                        attr && this.removeAttributeNode(attr);
                    },
                    appendChild: function (newChild) {
                        if (newChild.nodeType === DOCUMENT_FRAGMENT_NODE) {
                            return this.insertBefore(newChild, null);
                        }
                        else {
                            return _appendSingleChild(this, newChild);
                        }
                    },
                    setAttributeNode: function (newAttr) {
                        return this.attributes.setNamedItem(newAttr);
                    },
                    setAttributeNodeNS: function (newAttr) {
                        return this.attributes.setNamedItemNS(newAttr);
                    },
                    removeAttributeNode: function (oldAttr) {
                        return this.attributes.removeNamedItem(oldAttr.nodeName);
                    },
                    removeAttributeNS: function (namespaceURI, localName) {
                        var old = this.getAttributeNodeNS(namespaceURI, localName);
                        old && this.removeAttributeNode(old);
                    },
                    hasAttributeNS: function (namespaceURI, localName) {
                        return this.getAttributeNodeNS(namespaceURI, localName) != null;
                    },
                    getAttributeNS: function (namespaceURI, localName) {
                        var attr = this.getAttributeNodeNS(namespaceURI, localName);
                        return attr && attr.value || '';
                    },
                    setAttributeNS: function (namespaceURI, qualifiedName, value) {
                        var attr = this.ownerDocument.createAttributeNS(namespaceURI, qualifiedName);
                        attr.value = attr.nodeValue = "" + value;
                        this.setAttributeNode(attr);
                    },
                    getAttributeNodeNS: function (namespaceURI, localName) {
                        return this.attributes.getNamedItemNS(namespaceURI, localName);
                    },
                    getElementsByTagName: function (tagName) {
                        return new LiveNodeList(this, function (base) {
                            var ls = [];
                            _visitNode(base, function (node) {
                                if (node !== base && node.nodeType == ELEMENT_NODE && (tagName === '*' || node.tagName == tagName)) {
                                    ls.push(node);
                                }
                            });
                            return ls;
                        });
                    },
                    getElementsByTagNameNS: function (namespaceURI, localName) {
                        return new LiveNodeList(this, function (base) {
                            var ls = [];
                            _visitNode(base, function (node) {
                                if (node !== base && node.nodeType === ELEMENT_NODE && (namespaceURI === '*' || node.namespaceURI === namespaceURI) && (localName === '*' || node.localName == localName)) {
                                    ls.push(node);
                                }
                            });
                            return ls;
                        });
                    }
                };
                Document.prototype.getElementsByTagName = Element.prototype.getElementsByTagName;
                Document.prototype.getElementsByTagNameNS = Element.prototype.getElementsByTagNameNS;
                _extends(Element, Node);
                function Attr() {
                }
                ;
                Attr.prototype.nodeType = ATTRIBUTE_NODE;
                _extends(Attr, Node);
                function CharacterData() {
                }
                ;
                CharacterData.prototype = {
                    data: '',
                    substringData: function (offset, count) {
                        return this.data.substring(offset, offset + count);
                    },
                    appendData: function (text) {
                        text = this.data + text;
                        this.nodeValue = this.data = text;
                        this.length = text.length;
                    },
                    insertData: function (offset, text) {
                        this.replaceData(offset, 0, text);
                    },
                    appendChild: function (newChild) {
                        throw new Error(ExceptionMessage[HIERARCHY_REQUEST_ERR]);
                    },
                    deleteData: function (offset, count) {
                        this.replaceData(offset, count, "");
                    },
                    replaceData: function (offset, count, text) {
                        var start = this.data.substring(0, offset);
                        var end = this.data.substring(offset + count);
                        text = start + text + end;
                        this.nodeValue = this.data = text;
                        this.length = text.length;
                    }
                };
                _extends(CharacterData, Node);
                function Text() {
                }
                ;
                Text.prototype = {
                    nodeName: "#text",
                    nodeType: TEXT_NODE,
                    splitText: function (offset) {
                        var text = this.data;
                        var newText = text.substring(offset);
                        text = text.substring(0, offset);
                        this.data = this.nodeValue = text;
                        this.length = text.length;
                        var newNode = this.ownerDocument.createTextNode(newText);
                        if (this.parentNode) {
                            this.parentNode.insertBefore(newNode, this.nextSibling);
                        }
                        return newNode;
                    }
                };
                _extends(Text, CharacterData);
                function Comment() {
                }
                ;
                Comment.prototype = {
                    nodeName: "#comment",
                    nodeType: COMMENT_NODE
                };
                _extends(Comment, CharacterData);
                function CDATASection() {
                }
                ;
                CDATASection.prototype = {
                    nodeName: "#cdata-section",
                    nodeType: CDATA_SECTION_NODE
                };
                _extends(CDATASection, CharacterData);
                function DocumentType() {
                }
                ;
                DocumentType.prototype.nodeType = DOCUMENT_TYPE_NODE;
                _extends(DocumentType, Node);
                function Notation() {
                }
                ;
                Notation.prototype.nodeType = NOTATION_NODE;
                _extends(Notation, Node);
                function Entity() {
                }
                ;
                Entity.prototype.nodeType = ENTITY_NODE;
                _extends(Entity, Node);
                function EntityReference() {
                }
                ;
                EntityReference.prototype.nodeType = ENTITY_REFERENCE_NODE;
                _extends(EntityReference, Node);
                function DocumentFragment() {
                }
                ;
                DocumentFragment.prototype.nodeName = "#document-fragment";
                DocumentFragment.prototype.nodeType = DOCUMENT_FRAGMENT_NODE;
                _extends(DocumentFragment, Node);
                function ProcessingInstruction() {
                }
                ProcessingInstruction.prototype.nodeType = PROCESSING_INSTRUCTION_NODE;
                _extends(ProcessingInstruction, Node);
                function XMLSerializer() { }
                XMLSerializer.prototype.serializeToString = function (node, isHtml, nodeFilter) {
                    return nodeSerializeToString.call(node, isHtml, nodeFilter);
                };
                Node.prototype.toString = nodeSerializeToString;
                function nodeSerializeToString(isHtml, nodeFilter) {
                    var buf = [];
                    var refNode = this.nodeType == 9 ? this.documentElement : this;
                    var prefix = refNode.prefix;
                    var uri = refNode.namespaceURI;
                    if (uri && prefix == null) {
                        var prefix = refNode.lookupPrefix(uri);
                        if (prefix == null) {
                            var visibleNamespaces = [
                                { namespace: uri, prefix: null }
                            ];
                        }
                    }
                    serializeToString(this, buf, isHtml, nodeFilter, visibleNamespaces);
                    return buf.join('');
                }
                function needNamespaceDefine(node, isHTML, visibleNamespaces) {
                    var prefix = node.prefix || '';
                    var uri = node.namespaceURI;
                    if (!prefix && !uri) {
                        return false;
                    }
                    if (prefix === "xml" && uri === "http://www.w3.org/XML/1998/namespace"
                        || uri == 'http://www.w3.org/2000/xmlns/') {
                        return false;
                    }
                    var i = visibleNamespaces.length;
                    while (i--) {
                        var ns = visibleNamespaces[i];
                        if (ns.prefix == prefix) {
                            return ns.namespace != uri;
                        }
                    }
                    return true;
                }
                function serializeToString(node, buf, isHTML, nodeFilter, visibleNamespaces) {
                    if (nodeFilter) {
                        node = nodeFilter(node);
                        if (node) {
                            if (typeof node == 'string') {
                                buf.push(node);
                                return;
                            }
                        }
                        else {
                            return;
                        }
                    }
                    switch (node.nodeType) {
                        case ELEMENT_NODE:
                            if (!visibleNamespaces)
                                visibleNamespaces = [];
                            var startVisibleNamespaces = visibleNamespaces.length;
                            var attrs = node.attributes;
                            var len = attrs.length;
                            var child = node.firstChild;
                            var nodeName = node.tagName;
                            isHTML = (htmlns === node.namespaceURI) || isHTML;
                            buf.push('<', nodeName);
                            for (var i = 0; i < len; i++) {
                                var attr = attrs.item(i);
                                if (attr.prefix == 'xmlns') {
                                    visibleNamespaces.push({ prefix: attr.localName, namespace: attr.value });
                                }
                                else if (attr.nodeName == 'xmlns') {
                                    visibleNamespaces.push({ prefix: '', namespace: attr.value });
                                }
                            }
                            for (var i = 0; i < len; i++) {
                                var attr = attrs.item(i);
                                if (needNamespaceDefine(attr, isHTML, visibleNamespaces)) {
                                    var prefix = attr.prefix || '';
                                    var uri = attr.namespaceURI;
                                    var ns = prefix ? ' xmlns:' + prefix : " xmlns";
                                    buf.push(ns, '="', uri, '"');
                                    visibleNamespaces.push({ prefix: prefix, namespace: uri });
                                }
                                serializeToString(attr, buf, isHTML, nodeFilter, visibleNamespaces);
                            }
                            if (needNamespaceDefine(node, isHTML, visibleNamespaces)) {
                                var prefix = node.prefix || '';
                                var uri = node.namespaceURI;
                                var ns = prefix ? ' xmlns:' + prefix : " xmlns";
                                buf.push(ns, '="', uri, '"');
                                visibleNamespaces.push({ prefix: prefix, namespace: uri });
                            }
                            if (child || isHTML && !/^(?:meta|link|img|br|hr|input)$/i.test(nodeName)) {
                                buf.push('>');
                                if (isHTML && /^script$/i.test(nodeName)) {
                                    while (child) {
                                        if (child.data) {
                                            buf.push(child.data);
                                        }
                                        else {
                                            serializeToString(child, buf, isHTML, nodeFilter, visibleNamespaces);
                                        }
                                        child = child.nextSibling;
                                    }
                                }
                                else {
                                    while (child) {
                                        serializeToString(child, buf, isHTML, nodeFilter, visibleNamespaces);
                                        child = child.nextSibling;
                                    }
                                }
                                buf.push('</', nodeName, '>');
                            }
                            else {
                                buf.push('/>');
                            }
                            return;
                        case DOCUMENT_NODE:
                        case DOCUMENT_FRAGMENT_NODE:
                            var child = node.firstChild;
                            while (child) {
                                serializeToString(child, buf, isHTML, nodeFilter, visibleNamespaces);
                                child = child.nextSibling;
                            }
                            return;
                        case ATTRIBUTE_NODE:
                            return buf.push(' ', node.name, '="', node.value.replace(/[<&"]/g, _xmlEncoder), '"');
                        case TEXT_NODE:
                            return buf.push(node.data.replace(/[<&]/g, _xmlEncoder));
                        case CDATA_SECTION_NODE:
                            return buf.push('<![CDATA[', node.data, ']]>');
                        case COMMENT_NODE:
                            return buf.push("<!--", node.data, "-->");
                        case DOCUMENT_TYPE_NODE:
                            var pubid = node.publicId;
                            var sysid = node.systemId;
                            buf.push('<!DOCTYPE ', node.name);
                            if (pubid) {
                                buf.push(' PUBLIC "', pubid);
                                if (sysid && sysid != '.') {
                                    buf.push('" "', sysid);
                                }
                                buf.push('">');
                            }
                            else if (sysid && sysid != '.') {
                                buf.push(' SYSTEM "', sysid, '">');
                            }
                            else {
                                var sub = node.internalSubset;
                                if (sub) {
                                    buf.push(" [", sub, "]");
                                }
                                buf.push(">");
                            }
                            return;
                        case PROCESSING_INSTRUCTION_NODE:
                            return buf.push("<?", node.target, " ", node.data, "?>");
                        case ENTITY_REFERENCE_NODE:
                            return buf.push('&', node.nodeName, ';');
                        default:
                            buf.push('??', node.nodeName);
                    }
                }
                function importNode(doc, node, deep) {
                    var node2;
                    switch (node.nodeType) {
                        case ELEMENT_NODE:
                            node2 = node.cloneNode(false);
                            node2.ownerDocument = doc;
                        case DOCUMENT_FRAGMENT_NODE:
                            break;
                        case ATTRIBUTE_NODE:
                            deep = true;
                            break;
                    }
                    if (!node2) {
                        node2 = node.cloneNode(false);
                    }
                    node2.ownerDocument = doc;
                    node2.parentNode = null;
                    if (deep) {
                        var child = node.firstChild;
                        while (child) {
                            node2.appendChild(importNode(doc, child, deep));
                            child = child.nextSibling;
                        }
                    }
                    return node2;
                }
                function cloneNode(doc, node, deep) {
                    var node2 = new node.constructor();
                    for (var n in node) {
                        var v = node[n];
                        if (typeof v != 'object') {
                            if (v != node2[n]) {
                                node2[n] = v;
                            }
                        }
                    }
                    if (node.childNodes) {
                        node2.childNodes = new NodeList();
                    }
                    node2.ownerDocument = doc;
                    switch (node2.nodeType) {
                        case ELEMENT_NODE:
                            var attrs = node.attributes;
                            var attrs2 = node2.attributes = new NamedNodeMap();
                            var len = attrs.length;
                            attrs2._ownerElement = node2;
                            for (var i = 0; i < len; i++) {
                                node2.setAttributeNode(cloneNode(doc, attrs.item(i), true));
                            }
                            break;
                            ;
                        case ATTRIBUTE_NODE:
                            deep = true;
                    }
                    if (deep) {
                        var child = node.firstChild;
                        while (child) {
                            node2.appendChild(cloneNode(doc, child, deep));
                            child = child.nextSibling;
                        }
                    }
                    return node2;
                }
                function __set__(object, key, value) {
                    object[key] = value;
                }
                try {
                    if (Object.defineProperty) {
                        Object.defineProperty(LiveNodeList.prototype, 'length', {
                            get: function () {
                                _updateLiveList(this);
                                return this.$$length;
                            }
                        });
                        Object.defineProperty(Node.prototype, 'textContent', {
                            get: function () {
                                return getTextContent(this);
                            },
                            set: function (data) {
                                switch (this.nodeType) {
                                    case ELEMENT_NODE:
                                    case DOCUMENT_FRAGMENT_NODE:
                                        while (this.firstChild) {
                                            this.removeChild(this.firstChild);
                                        }
                                        if (data || String(data)) {
                                            this.appendChild(this.ownerDocument.createTextNode(data));
                                        }
                                        break;
                                    default:
                                        this.data = data;
                                        this.value = data;
                                        this.nodeValue = data;
                                }
                            }
                        });
                        function getTextContent(node) {
                            switch (node.nodeType) {
                                case ELEMENT_NODE:
                                case DOCUMENT_FRAGMENT_NODE:
                                    var buf = [];
                                    node = node.firstChild;
                                    while (node) {
                                        if (node.nodeType !== 7 && node.nodeType !== 8) {
                                            buf.push(getTextContent(node));
                                        }
                                        node = node.nextSibling;
                                    }
                                    return buf.join('');
                                default:
                                    return node.nodeValue;
                            }
                        }
                        __set__ = function (object, key, value) {
                            object['$$' + key] = value;
                        };
                    }
                }
                catch (e) {
                }
                exports.DOMImplementation = DOMImplementation;
                exports.XMLSerializer = XMLSerializer;
            }, {}], 34: [function (require, module, exports) {
                var nameStartChar = /[A-Z_a-z\xC0-\xD6\xD8-\xF6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/;
                var nameChar = new RegExp("[\\-\\.0-9" + nameStartChar.source.slice(1, -1) + "\\u00B7\\u0300-\\u036F\\u203F-\\u2040]");
                var tagNamePattern = new RegExp('^' + nameStartChar.source + nameChar.source + '*(?:\:' + nameStartChar.source + nameChar.source + '*)?$');
                var S_TAG = 0;
                var S_ATTR = 1;
                var S_ATTR_SPACE = 2;
                var S_EQ = 3;
                var S_ATTR_NOQUOT_VALUE = 4;
                var S_ATTR_END = 5;
                var S_TAG_SPACE = 6;
                var S_TAG_CLOSE = 7;
                function XMLReader() {
                }
                XMLReader.prototype = {
                    parse: function (source, defaultNSMap, entityMap) {
                        var domBuilder = this.domBuilder;
                        domBuilder.startDocument();
                        _copy(defaultNSMap, defaultNSMap = {});
                        parse(source, defaultNSMap, entityMap, domBuilder, this.errorHandler);
                        domBuilder.endDocument();
                    }
                };
                function parse(source, defaultNSMapCopy, entityMap, domBuilder, errorHandler) {
                    function fixedFromCharCode(code) {
                        if (code > 0xffff) {
                            code -= 0x10000;
                            var surrogate1 = 0xd800 + (code >> 10), surrogate2 = 0xdc00 + (code & 0x3ff);
                            return String.fromCharCode(surrogate1, surrogate2);
                        }
                        else {
                            return String.fromCharCode(code);
                        }
                    }
                    function entityReplacer(a) {
                        var k = a.slice(1, -1);
                        if (k in entityMap) {
                            return entityMap[k];
                        }
                        else if (k.charAt(0) === '#') {
                            return fixedFromCharCode(parseInt(k.substr(1).replace('x', '0x')));
                        }
                        else {
                            errorHandler.error('entity not found:' + a);
                            return a;
                        }
                    }
                    function appendText(end) {
                        if (end > start) {
                            var xt = source.substring(start, end).replace(/&#?\w+;/g, entityReplacer);
                            locator && position(start);
                            domBuilder.characters(xt, 0, end - start);
                            start = end;
                        }
                    }
                    function position(p, m) {
                        while (p >= lineEnd && (m = linePattern.exec(source))) {
                            lineStart = m.index;
                            lineEnd = lineStart + m[0].length;
                            locator.lineNumber++;
                        }
                        locator.columnNumber = p - lineStart + 1;
                    }
                    var lineStart = 0;
                    var lineEnd = 0;
                    var linePattern = /.*(?:\r\n?|\n)|.*$/g;
                    var locator = domBuilder.locator;
                    var parseStack = [{ currentNSMap: defaultNSMapCopy }];
                    var closeMap = {};
                    var start = 0;
                    while (true) {
                        try {
                            var tagStart = source.indexOf('<', start);
                            if (tagStart < 0) {
                                if (!source.substr(start).match(/^\s*$/)) {
                                    var doc = domBuilder.doc;
                                    var text = doc.createTextNode(source.substr(start));
                                    doc.appendChild(text);
                                    domBuilder.currentElement = text;
                                }
                                return;
                            }
                            if (tagStart > start) {
                                appendText(tagStart);
                            }
                            switch (source.charAt(tagStart + 1)) {
                                case '/':
                                    var end = source.indexOf('>', tagStart + 3);
                                    var tagName = source.substring(tagStart + 2, end);
                                    var config = parseStack.pop();
                                    if (end < 0) {
                                        tagName = source.substring(tagStart + 2).replace(/[\s<].*/, '');
                                        errorHandler.error("end tag name: " + tagName + ' is not complete:' + config.tagName);
                                        end = tagStart + 1 + tagName.length;
                                    }
                                    else if (tagName.match(/\s</)) {
                                        tagName = tagName.replace(/[\s<].*/, '');
                                        errorHandler.error("end tag name: " + tagName + ' maybe not complete');
                                        end = tagStart + 1 + tagName.length;
                                    }
                                    var localNSMap = config.localNSMap;
                                    var endMatch = config.tagName == tagName;
                                    var endIgnoreCaseMach = endMatch || config.tagName && config.tagName.toLowerCase() == tagName.toLowerCase();
                                    if (endIgnoreCaseMach) {
                                        domBuilder.endElement(config.uri, config.localName, tagName);
                                        if (localNSMap) {
                                            for (var prefix in localNSMap) {
                                                domBuilder.endPrefixMapping(prefix);
                                            }
                                        }
                                        if (!endMatch) {
                                            errorHandler.fatalError("end tag name: " + tagName + ' is not match the current start tagName:' + config.tagName);
                                        }
                                    }
                                    else {
                                        parseStack.push(config);
                                    }
                                    end++;
                                    break;
                                case '?':
                                    locator && position(tagStart);
                                    end = parseInstruction(source, tagStart, domBuilder);
                                    break;
                                case '!':
                                    locator && position(tagStart);
                                    end = parseDCC(source, tagStart, domBuilder, errorHandler);
                                    break;
                                default:
                                    locator && position(tagStart);
                                    var el = new ElementAttributes();
                                    var currentNSMap = parseStack[parseStack.length - 1].currentNSMap;
                                    var end = parseElementStartPart(source, tagStart, el, currentNSMap, entityReplacer, errorHandler);
                                    var len = el.length;
                                    if (!el.closed && fixSelfClosed(source, end, el.tagName, closeMap)) {
                                        el.closed = true;
                                        if (!entityMap.nbsp) {
                                            errorHandler.warning('unclosed xml attribute');
                                        }
                                    }
                                    if (locator && len) {
                                        var locator2 = copyLocator(locator, {});
                                        for (var i = 0; i < len; i++) {
                                            var a = el[i];
                                            position(a.offset);
                                            a.locator = copyLocator(locator, {});
                                        }
                                        domBuilder.locator = locator2;
                                        if (appendElement(el, domBuilder, currentNSMap)) {
                                            parseStack.push(el);
                                        }
                                        domBuilder.locator = locator;
                                    }
                                    else {
                                        if (appendElement(el, domBuilder, currentNSMap)) {
                                            parseStack.push(el);
                                        }
                                    }
                                    if (el.uri === 'http://www.w3.org/1999/xhtml' && !el.closed) {
                                        end = parseHtmlSpecialContent(source, end, el.tagName, entityReplacer, domBuilder);
                                    }
                                    else {
                                        end++;
                                    }
                            }
                        }
                        catch (e) {
                            errorHandler.error('element parse error: ' + e);
                            end = -1;
                        }
                        if (end > start) {
                            start = end;
                        }
                        else {
                            appendText(Math.max(tagStart, start) + 1);
                        }
                    }
                }
                function copyLocator(f, t) {
                    t.lineNumber = f.lineNumber;
                    t.columnNumber = f.columnNumber;
                    return t;
                }
                function parseElementStartPart(source, start, el, currentNSMap, entityReplacer, errorHandler) {
                    var attrName;
                    var value;
                    var p = ++start;
                    var s = S_TAG;
                    while (true) {
                        var c = source.charAt(p);
                        switch (c) {
                            case '=':
                                if (s === S_ATTR) {
                                    attrName = source.slice(start, p);
                                    s = S_EQ;
                                }
                                else if (s === S_ATTR_SPACE) {
                                    s = S_EQ;
                                }
                                else {
                                    throw new Error('attribute equal must after attrName');
                                }
                                break;
                            case '\'':
                            case '"':
                                if (s === S_EQ || s === S_ATTR) {
                                    if (s === S_ATTR) {
                                        errorHandler.warning('attribute value must after "="');
                                        attrName = source.slice(start, p);
                                    }
                                    start = p + 1;
                                    p = source.indexOf(c, start);
                                    if (p > 0) {
                                        value = source.slice(start, p).replace(/&#?\w+;/g, entityReplacer);
                                        el.add(attrName, value, start - 1);
                                        s = S_ATTR_END;
                                    }
                                    else {
                                        throw new Error('attribute value no end \'' + c + '\' match');
                                    }
                                }
                                else if (s == S_ATTR_NOQUOT_VALUE) {
                                    value = source.slice(start, p).replace(/&#?\w+;/g, entityReplacer);
                                    el.add(attrName, value, start);
                                    errorHandler.warning('attribute "' + attrName + '" missed start quot(' + c + ')!!');
                                    start = p + 1;
                                    s = S_ATTR_END;
                                }
                                else {
                                    throw new Error('attribute value must after "="');
                                }
                                break;
                            case '/':
                                switch (s) {
                                    case S_TAG:
                                        el.setTagName(source.slice(start, p));
                                    case S_ATTR_END:
                                    case S_TAG_SPACE:
                                    case S_TAG_CLOSE:
                                        s = S_TAG_CLOSE;
                                        el.closed = true;
                                    case S_ATTR_NOQUOT_VALUE:
                                    case S_ATTR:
                                    case S_ATTR_SPACE:
                                        break;
                                    default:
                                        throw new Error("attribute invalid close char('/')");
                                }
                                break;
                            case '':
                                errorHandler.error('unexpected end of input');
                                if (s == S_TAG) {
                                    el.setTagName(source.slice(start, p));
                                }
                                return p;
                            case '>':
                                switch (s) {
                                    case S_TAG:
                                        el.setTagName(source.slice(start, p));
                                    case S_ATTR_END:
                                    case S_TAG_SPACE:
                                    case S_TAG_CLOSE:
                                        break;
                                    case S_ATTR_NOQUOT_VALUE:
                                    case S_ATTR:
                                        value = source.slice(start, p);
                                        if (value.slice(-1) === '/') {
                                            el.closed = true;
                                            value = value.slice(0, -1);
                                        }
                                    case S_ATTR_SPACE:
                                        if (s === S_ATTR_SPACE) {
                                            value = attrName;
                                        }
                                        if (s == S_ATTR_NOQUOT_VALUE) {
                                            errorHandler.warning('attribute "' + value + '" missed quot(")!!');
                                            el.add(attrName, value.replace(/&#?\w+;/g, entityReplacer), start);
                                        }
                                        else {
                                            if (currentNSMap[''] !== 'http://www.w3.org/1999/xhtml' || !value.match(/^(?:disabled|checked|selected)$/i)) {
                                                errorHandler.warning('attribute "' + value + '" missed value!! "' + value + '" instead!!');
                                            }
                                            el.add(value, value, start);
                                        }
                                        break;
                                    case S_EQ:
                                        throw new Error('attribute value missed!!');
                                }
                                return p;
                            case '\u0080':
                                c = ' ';
                            default:
                                if (c <= ' ') {
                                    switch (s) {
                                        case S_TAG:
                                            el.setTagName(source.slice(start, p));
                                            s = S_TAG_SPACE;
                                            break;
                                        case S_ATTR:
                                            attrName = source.slice(start, p);
                                            s = S_ATTR_SPACE;
                                            break;
                                        case S_ATTR_NOQUOT_VALUE:
                                            var value = source.slice(start, p).replace(/&#?\w+;/g, entityReplacer);
                                            errorHandler.warning('attribute "' + value + '" missed quot(")!!');
                                            el.add(attrName, value, start);
                                        case S_ATTR_END:
                                            s = S_TAG_SPACE;
                                            break;
                                    }
                                }
                                else {
                                    switch (s) {
                                        case S_ATTR_SPACE:
                                            var tagName = el.tagName;
                                            if (currentNSMap[''] !== 'http://www.w3.org/1999/xhtml' || !attrName.match(/^(?:disabled|checked|selected)$/i)) {
                                                errorHandler.warning('attribute "' + attrName + '" missed value!! "' + attrName + '" instead2!!');
                                            }
                                            el.add(attrName, attrName, start);
                                            start = p;
                                            s = S_ATTR;
                                            break;
                                        case S_ATTR_END:
                                            errorHandler.warning('attribute space is required"' + attrName + '"!!');
                                        case S_TAG_SPACE:
                                            s = S_ATTR;
                                            start = p;
                                            break;
                                        case S_EQ:
                                            s = S_ATTR_NOQUOT_VALUE;
                                            start = p;
                                            break;
                                        case S_TAG_CLOSE:
                                            throw new Error("elements closed character '/' and '>' must be connected to");
                                    }
                                }
                        }
                        p++;
                    }
                }
                function appendElement(el, domBuilder, currentNSMap) {
                    var tagName = el.tagName;
                    var localNSMap = null;
                    var i = el.length;
                    while (i--) {
                        var a = el[i];
                        var qName = a.qName;
                        var value = a.value;
                        var nsp = qName.indexOf(':');
                        if (nsp > 0) {
                            var prefix = a.prefix = qName.slice(0, nsp);
                            var localName = qName.slice(nsp + 1);
                            var nsPrefix = prefix === 'xmlns' && localName;
                        }
                        else {
                            localName = qName;
                            prefix = null;
                            nsPrefix = qName === 'xmlns' && '';
                        }
                        a.localName = localName;
                        if (nsPrefix !== false) {
                            if (localNSMap == null) {
                                localNSMap = {};
                                _copy(currentNSMap, currentNSMap = {});
                            }
                            currentNSMap[nsPrefix] = localNSMap[nsPrefix] = value;
                            a.uri = 'http://www.w3.org/2000/xmlns/';
                            domBuilder.startPrefixMapping(nsPrefix, value);
                        }
                    }
                    var i = el.length;
                    while (i--) {
                        a = el[i];
                        var prefix = a.prefix;
                        if (prefix) {
                            if (prefix === 'xml') {
                                a.uri = 'http://www.w3.org/XML/1998/namespace';
                            }
                            if (prefix !== 'xmlns') {
                                a.uri = currentNSMap[prefix || ''];
                            }
                        }
                    }
                    var nsp = tagName.indexOf(':');
                    if (nsp > 0) {
                        prefix = el.prefix = tagName.slice(0, nsp);
                        localName = el.localName = tagName.slice(nsp + 1);
                    }
                    else {
                        prefix = null;
                        localName = el.localName = tagName;
                    }
                    var ns = el.uri = currentNSMap[prefix || ''];
                    domBuilder.startElement(ns, localName, tagName, el);
                    if (el.closed) {
                        domBuilder.endElement(ns, localName, tagName);
                        if (localNSMap) {
                            for (prefix in localNSMap) {
                                domBuilder.endPrefixMapping(prefix);
                            }
                        }
                    }
                    else {
                        el.currentNSMap = currentNSMap;
                        el.localNSMap = localNSMap;
                        return true;
                    }
                }
                function parseHtmlSpecialContent(source, elStartEnd, tagName, entityReplacer, domBuilder) {
                    if (/^(?:script|textarea)$/i.test(tagName)) {
                        var elEndStart = source.indexOf('</' + tagName + '>', elStartEnd);
                        var text = source.substring(elStartEnd + 1, elEndStart);
                        if (/[&<]/.test(text)) {
                            if (/^script$/i.test(tagName)) {
                                domBuilder.characters(text, 0, text.length);
                                return elEndStart;
                            }
                            text = text.replace(/&#?\w+;/g, entityReplacer);
                            domBuilder.characters(text, 0, text.length);
                            return elEndStart;
                        }
                    }
                    return elStartEnd + 1;
                }
                function fixSelfClosed(source, elStartEnd, tagName, closeMap) {
                    var pos = closeMap[tagName];
                    if (pos == null) {
                        pos = source.lastIndexOf('</' + tagName + '>');
                        if (pos < elStartEnd) {
                            pos = source.lastIndexOf('</' + tagName);
                        }
                        closeMap[tagName] = pos;
                    }
                    return pos < elStartEnd;
                }
                function _copy(source, target) {
                    for (var n in source) {
                        target[n] = source[n];
                    }
                }
                function parseDCC(source, start, domBuilder, errorHandler) {
                    var next = source.charAt(start + 2);
                    switch (next) {
                        case '-':
                            if (source.charAt(start + 3) === '-') {
                                var end = source.indexOf('-->', start + 4);
                                if (end > start) {
                                    domBuilder.comment(source, start + 4, end - start - 4);
                                    return end + 3;
                                }
                                else {
                                    errorHandler.error("Unclosed comment");
                                    return -1;
                                }
                            }
                            else {
                                return -1;
                            }
                        default:
                            if (source.substr(start + 3, 6) == 'CDATA[') {
                                var end = source.indexOf(']]>', start + 9);
                                domBuilder.startCDATA();
                                domBuilder.characters(source, start + 9, end - start - 9);
                                domBuilder.endCDATA();
                                return end + 3;
                            }
                            var matchs = split(source, start);
                            var len = matchs.length;
                            if (len > 1 && /!doctype/i.test(matchs[0][0])) {
                                var name = matchs[1][0];
                                var pubid = len > 3 && /^public$/i.test(matchs[2][0]) && matchs[3][0];
                                var sysid = len > 4 && matchs[4][0];
                                var lastMatch = matchs[len - 1];
                                domBuilder.startDTD(name, pubid && pubid.replace(/^(['"])(.*?)\1$/, '$2'), sysid && sysid.replace(/^(['"])(.*?)\1$/, '$2'));
                                domBuilder.endDTD();
                                return lastMatch.index + lastMatch[0].length;
                            }
                    }
                    return -1;
                }
                function parseInstruction(source, start, domBuilder) {
                    var end = source.indexOf('?>', start);
                    if (end) {
                        var match = source.substring(start, end).match(/^<\?(\S*)\s*([\s\S]*?)\s*$/);
                        if (match) {
                            var len = match[0].length;
                            domBuilder.processingInstruction(match[1], match[2]);
                            return end + 2;
                        }
                        else {
                            return -1;
                        }
                    }
                    return -1;
                }
                function ElementAttributes(source) {
                }
                ElementAttributes.prototype = {
                    setTagName: function (tagName) {
                        if (!tagNamePattern.test(tagName)) {
                            throw new Error('invalid tagName:' + tagName);
                        }
                        this.tagName = tagName;
                    },
                    add: function (qName, value, offset) {
                        if (!tagNamePattern.test(qName)) {
                            throw new Error('invalid attribute:' + qName);
                        }
                        this[this.length++] = { qName: qName, value: value, offset: offset };
                    },
                    length: 0,
                    getLocalName: function (i) { return this[i].localName; },
                    getLocator: function (i) { return this[i].locator; },
                    getQName: function (i) { return this[i].qName; },
                    getURI: function (i) { return this[i].uri; },
                    getValue: function (i) { return this[i].value; }
                };
                function _set_proto_(thiz, parent) {
                    thiz.__proto__ = parent;
                    return thiz;
                }
                if (!(_set_proto_({}, _set_proto_.prototype) instanceof _set_proto_)) {
                    _set_proto_ = function (thiz, parent) {
                        function p() { }
                        ;
                        p.prototype = parent;
                        p = new p();
                        for (parent in thiz) {
                            p[parent] = thiz[parent];
                        }
                        return p;
                    };
                }
                function split(source, start) {
                    var match;
                    var buf = [];
                    var reg = /'[^']+'|"[^"]+"|[^\s<>\/=]+=?|(\/?\s*>|<)/g;
                    reg.lastIndex = start;
                    reg.exec(source);
                    while (match = reg.exec(source)) {
                        buf.push(match);
                        if (match[1])
                            return buf;
                    }
                }
                exports.XMLReader = XMLReader;
            }, {}], 35: [function (require, module, exports) {
                var xpath = (typeof exports === 'undefined') ? {} : exports;
                (function (exports) {
                    "use strict";
                    XPathParser.prototype = new Object();
                    XPathParser.prototype.constructor = XPathParser;
                    XPathParser.superclass = Object.prototype;
                    function XPathParser() {
                        this.init();
                    }
                    XPathParser.prototype.init = function () {
                        this.reduceActions = [];
                        this.reduceActions[3] = function (rhs) {
                            return new OrOperation(rhs[0], rhs[2]);
                        };
                        this.reduceActions[5] = function (rhs) {
                            return new AndOperation(rhs[0], rhs[2]);
                        };
                        this.reduceActions[7] = function (rhs) {
                            return new EqualsOperation(rhs[0], rhs[2]);
                        };
                        this.reduceActions[8] = function (rhs) {
                            return new NotEqualOperation(rhs[0], rhs[2]);
                        };
                        this.reduceActions[10] = function (rhs) {
                            return new LessThanOperation(rhs[0], rhs[2]);
                        };
                        this.reduceActions[11] = function (rhs) {
                            return new GreaterThanOperation(rhs[0], rhs[2]);
                        };
                        this.reduceActions[12] = function (rhs) {
                            return new LessThanOrEqualOperation(rhs[0], rhs[2]);
                        };
                        this.reduceActions[13] = function (rhs) {
                            return new GreaterThanOrEqualOperation(rhs[0], rhs[2]);
                        };
                        this.reduceActions[15] = function (rhs) {
                            return new PlusOperation(rhs[0], rhs[2]);
                        };
                        this.reduceActions[16] = function (rhs) {
                            return new MinusOperation(rhs[0], rhs[2]);
                        };
                        this.reduceActions[18] = function (rhs) {
                            return new MultiplyOperation(rhs[0], rhs[2]);
                        };
                        this.reduceActions[19] = function (rhs) {
                            return new DivOperation(rhs[0], rhs[2]);
                        };
                        this.reduceActions[20] = function (rhs) {
                            return new ModOperation(rhs[0], rhs[2]);
                        };
                        this.reduceActions[22] = function (rhs) {
                            return new UnaryMinusOperation(rhs[1]);
                        };
                        this.reduceActions[24] = function (rhs) {
                            return new BarOperation(rhs[0], rhs[2]);
                        };
                        this.reduceActions[25] = function (rhs) {
                            return new PathExpr(undefined, undefined, rhs[0]);
                        };
                        this.reduceActions[27] = function (rhs) {
                            rhs[0].locationPath = rhs[2];
                            return rhs[0];
                        };
                        this.reduceActions[28] = function (rhs) {
                            rhs[0].locationPath = rhs[2];
                            rhs[0].locationPath.steps.unshift(new Step(Step.DESCENDANTORSELF, new NodeTest(NodeTest.NODE, undefined), []));
                            return rhs[0];
                        };
                        this.reduceActions[29] = function (rhs) {
                            return new PathExpr(rhs[0], [], undefined);
                        };
                        this.reduceActions[30] = function (rhs) {
                            if (Utilities.instance_of(rhs[0], PathExpr)) {
                                if (rhs[0].filterPredicates == undefined) {
                                    rhs[0].filterPredicates = [];
                                }
                                rhs[0].filterPredicates.push(rhs[1]);
                                return rhs[0];
                            }
                            else {
                                return new PathExpr(rhs[0], [rhs[1]], undefined);
                            }
                        };
                        this.reduceActions[32] = function (rhs) {
                            return rhs[1];
                        };
                        this.reduceActions[33] = function (rhs) {
                            return new XString(rhs[0]);
                        };
                        this.reduceActions[34] = function (rhs) {
                            return new XNumber(rhs[0]);
                        };
                        this.reduceActions[36] = function (rhs) {
                            return new FunctionCall(rhs[0], []);
                        };
                        this.reduceActions[37] = function (rhs) {
                            return new FunctionCall(rhs[0], rhs[2]);
                        };
                        this.reduceActions[38] = function (rhs) {
                            return [rhs[0]];
                        };
                        this.reduceActions[39] = function (rhs) {
                            rhs[2].unshift(rhs[0]);
                            return rhs[2];
                        };
                        this.reduceActions[43] = function (rhs) {
                            return new LocationPath(true, []);
                        };
                        this.reduceActions[44] = function (rhs) {
                            rhs[1].absolute = true;
                            return rhs[1];
                        };
                        this.reduceActions[46] = function (rhs) {
                            return new LocationPath(false, [rhs[0]]);
                        };
                        this.reduceActions[47] = function (rhs) {
                            rhs[0].steps.push(rhs[2]);
                            return rhs[0];
                        };
                        this.reduceActions[49] = function (rhs) {
                            return new Step(rhs[0], rhs[1], []);
                        };
                        this.reduceActions[50] = function (rhs) {
                            return new Step(Step.CHILD, rhs[0], []);
                        };
                        this.reduceActions[51] = function (rhs) {
                            return new Step(rhs[0], rhs[1], rhs[2]);
                        };
                        this.reduceActions[52] = function (rhs) {
                            return new Step(Step.CHILD, rhs[0], rhs[1]);
                        };
                        this.reduceActions[54] = function (rhs) {
                            return [rhs[0]];
                        };
                        this.reduceActions[55] = function (rhs) {
                            rhs[1].unshift(rhs[0]);
                            return rhs[1];
                        };
                        this.reduceActions[56] = function (rhs) {
                            if (rhs[0] == "ancestor") {
                                return Step.ANCESTOR;
                            }
                            else if (rhs[0] == "ancestor-or-self") {
                                return Step.ANCESTORORSELF;
                            }
                            else if (rhs[0] == "attribute") {
                                return Step.ATTRIBUTE;
                            }
                            else if (rhs[0] == "child") {
                                return Step.CHILD;
                            }
                            else if (rhs[0] == "descendant") {
                                return Step.DESCENDANT;
                            }
                            else if (rhs[0] == "descendant-or-self") {
                                return Step.DESCENDANTORSELF;
                            }
                            else if (rhs[0] == "following") {
                                return Step.FOLLOWING;
                            }
                            else if (rhs[0] == "following-sibling") {
                                return Step.FOLLOWINGSIBLING;
                            }
                            else if (rhs[0] == "namespace") {
                                return Step.NAMESPACE;
                            }
                            else if (rhs[0] == "parent") {
                                return Step.PARENT;
                            }
                            else if (rhs[0] == "preceding") {
                                return Step.PRECEDING;
                            }
                            else if (rhs[0] == "preceding-sibling") {
                                return Step.PRECEDINGSIBLING;
                            }
                            else if (rhs[0] == "self") {
                                return Step.SELF;
                            }
                            return -1;
                        };
                        this.reduceActions[57] = function (rhs) {
                            return Step.ATTRIBUTE;
                        };
                        this.reduceActions[59] = function (rhs) {
                            if (rhs[0] == "comment") {
                                return new NodeTest(NodeTest.COMMENT, undefined);
                            }
                            else if (rhs[0] == "text") {
                                return new NodeTest(NodeTest.TEXT, undefined);
                            }
                            else if (rhs[0] == "processing-instruction") {
                                return new NodeTest(NodeTest.PI, undefined);
                            }
                            else if (rhs[0] == "node") {
                                return new NodeTest(NodeTest.NODE, undefined);
                            }
                            return new NodeTest(-1, undefined);
                        };
                        this.reduceActions[60] = function (rhs) {
                            return new NodeTest(NodeTest.PI, rhs[2]);
                        };
                        this.reduceActions[61] = function (rhs) {
                            return rhs[1];
                        };
                        this.reduceActions[63] = function (rhs) {
                            rhs[1].absolute = true;
                            rhs[1].steps.unshift(new Step(Step.DESCENDANTORSELF, new NodeTest(NodeTest.NODE, undefined), []));
                            return rhs[1];
                        };
                        this.reduceActions[64] = function (rhs) {
                            rhs[0].steps.push(new Step(Step.DESCENDANTORSELF, new NodeTest(NodeTest.NODE, undefined), []));
                            rhs[0].steps.push(rhs[2]);
                            return rhs[0];
                        };
                        this.reduceActions[65] = function (rhs) {
                            return new Step(Step.SELF, new NodeTest(NodeTest.NODE, undefined), []);
                        };
                        this.reduceActions[66] = function (rhs) {
                            return new Step(Step.PARENT, new NodeTest(NodeTest.NODE, undefined), []);
                        };
                        this.reduceActions[67] = function (rhs) {
                            return new VariableReference(rhs[1]);
                        };
                        this.reduceActions[68] = function (rhs) {
                            return new NodeTest(NodeTest.NAMETESTANY, undefined);
                        };
                        this.reduceActions[69] = function (rhs) {
                            var prefix = rhs[0].substring(0, rhs[0].indexOf(":"));
                            return new NodeTest(NodeTest.NAMETESTPREFIXANY, prefix);
                        };
                        this.reduceActions[70] = function (rhs) {
                            return new NodeTest(NodeTest.NAMETESTQNAME, rhs[0]);
                        };
                    };
                    XPathParser.actionTable = [
                        " s s        sssssssss    s ss  s  ss",
                        "                 s                  ",
                        "r  rrrrrrrrr         rrrrrrr rr  r  ",
                        "                rrrrr               ",
                        " s s        sssssssss    s ss  s  ss",
                        "rs  rrrrrrrr s  sssssrrrrrr  rrs rs ",
                        " s s        sssssssss    s ss  s  ss",
                        "                            s       ",
                        "                            s       ",
                        "r  rrrrrrrrr         rrrrrrr rr rr  ",
                        "r  rrrrrrrrr         rrrrrrr rr rr  ",
                        "r  rrrrrrrrr         rrrrrrr rr rr  ",
                        "r  rrrrrrrrr         rrrrrrr rr rr  ",
                        "r  rrrrrrrrr         rrrrrrr rr rr  ",
                        "  s                                 ",
                        "                            s       ",
                        " s           s  sssss          s  s ",
                        "r  rrrrrrrrr         rrrrrrr rr  r  ",
                        "a                                   ",
                        "r       s                    rr  r  ",
                        "r      sr                    rr  r  ",
                        "r   s  rr            s       rr  r  ",
                        "r   rssrr            rss     rr  r  ",
                        "r   rrrrr            rrrss   rr  r  ",
                        "r   rrrrrsss         rrrrr   rr  r  ",
                        "r   rrrrrrrr         rrrrr   rr  r  ",
                        "r   rrrrrrrr         rrrrrs  rr  r  ",
                        "r   rrrrrrrr         rrrrrr  rr  r  ",
                        "r   rrrrrrrr         rrrrrr  rr  r  ",
                        "r  srrrrrrrr         rrrrrrs rr sr  ",
                        "r  srrrrrrrr         rrrrrrs rr  r  ",
                        "r  rrrrrrrrr         rrrrrrr rr rr  ",
                        "r  rrrrrrrrr         rrrrrrr rr rr  ",
                        "r  rrrrrrrrr         rrrrrrr rr rr  ",
                        "r   rrrrrrrr         rrrrrr  rr  r  ",
                        "r   rrrrrrrr         rrrrrr  rr  r  ",
                        "r  rrrrrrrrr         rrrrrrr rr  r  ",
                        "r  rrrrrrrrr         rrrrrrr rr  r  ",
                        "                sssss               ",
                        "r  rrrrrrrrr         rrrrrrr rr sr  ",
                        "r  rrrrrrrrr         rrrrrrr rr  r  ",
                        "r  rrrrrrrrr         rrrrrrr rr rr  ",
                        "r  rrrrrrrrr         rrrrrrr rr rr  ",
                        "                             s      ",
                        "r  srrrrrrrr         rrrrrrs rr  r  ",
                        "r   rrrrrrrr         rrrrr   rr  r  ",
                        "              s                     ",
                        "                             s      ",
                        "                rrrrr               ",
                        " s s        sssssssss    s sss s  ss",
                        "r  srrrrrrrr         rrrrrrs rr  r  ",
                        " s s        sssssssss    s ss  s  ss",
                        " s s        sssssssss    s ss  s  ss",
                        " s s        sssssssss    s ss  s  ss",
                        " s s        sssssssss    s ss  s  ss",
                        " s s        sssssssss    s ss  s  ss",
                        " s s        sssssssss    s ss  s  ss",
                        " s s        sssssssss    s ss  s  ss",
                        " s s        sssssssss    s ss  s  ss",
                        " s s        sssssssss    s ss  s  ss",
                        " s s        sssssssss    s ss  s  ss",
                        " s s        sssssssss    s ss  s  ss",
                        " s s        sssssssss    s ss  s  ss",
                        " s s        sssssssss    s ss  s  ss",
                        " s s        sssssssss      ss  s  ss",
                        " s s        sssssssss    s ss  s  ss",
                        " s           s  sssss          s  s ",
                        " s           s  sssss          s  s ",
                        "r  rrrrrrrrr         rrrrrrr rr rr  ",
                        " s           s  sssss          s  s ",
                        " s           s  sssss          s  s ",
                        "r  rrrrrrrrr         rrrrrrr rr sr  ",
                        "r  rrrrrrrrr         rrrrrrr rr sr  ",
                        "r  rrrrrrrrr         rrrrrrr rr  r  ",
                        "r  rrrrrrrrr         rrrrrrr rr rr  ",
                        "                             s      ",
                        "r  rrrrrrrrr         rrrrrrr rr rr  ",
                        "r  rrrrrrrrr         rrrrrrr rr rr  ",
                        "                             rr     ",
                        "                             s      ",
                        "                             rs     ",
                        "r      sr                    rr  r  ",
                        "r   s  rr            s       rr  r  ",
                        "r   rssrr            rss     rr  r  ",
                        "r   rssrr            rss     rr  r  ",
                        "r   rrrrr            rrrss   rr  r  ",
                        "r   rrrrr            rrrss   rr  r  ",
                        "r   rrrrr            rrrss   rr  r  ",
                        "r   rrrrr            rrrss   rr  r  ",
                        "r   rrrrrsss         rrrrr   rr  r  ",
                        "r   rrrrrsss         rrrrr   rr  r  ",
                        "r   rrrrrrrr         rrrrr   rr  r  ",
                        "r   rrrrrrrr         rrrrr   rr  r  ",
                        "r   rrrrrrrr         rrrrr   rr  r  ",
                        "r   rrrrrrrr         rrrrrr  rr  r  ",
                        "                                 r  ",
                        "                                 s  ",
                        "r  srrrrrrrr         rrrrrrs rr  r  ",
                        "r  srrrrrrrr         rrrrrrs rr  r  ",
                        "r  rrrrrrrrr         rrrrrrr rr  r  ",
                        "r  rrrrrrrrr         rrrrrrr rr  r  ",
                        "r  rrrrrrrrr         rrrrrrr rr  r  ",
                        "r  rrrrrrrrr         rrrrrrr rr  r  ",
                        "r  rrrrrrrrr         rrrrrrr rr rr  ",
                        "r  rrrrrrrrr         rrrrrrr rr rr  ",
                        " s s        sssssssss    s ss  s  ss",
                        "r  rrrrrrrrr         rrrrrrr rr rr  ",
                        "                             r      "
                    ];
                    XPathParser.actionTableNumber = [
                        " 1 0        /.-,+*)('    & %$  #  \"!",
                        "                 J                  ",
                        "a  aaaaaaaaa         aaaaaaa aa  a  ",
                        "                YYYYY               ",
                        " 1 0        /.-,+*)('    & %$  #  \"!",
                        "K1  KKKKKKKK .  +*)('KKKKKK  KK# K\" ",
                        " 1 0        /.-,+*)('    & %$  #  \"!",
                        "                            N       ",
                        "                            O       ",
                        "e  eeeeeeeee         eeeeeee ee ee  ",
                        "f  fffffffff         fffffff ff ff  ",
                        "d  ddddddddd         ddddddd dd dd  ",
                        "B  BBBBBBBBB         BBBBBBB BB BB  ",
                        "A  AAAAAAAAA         AAAAAAA AA AA  ",
                        "  P                                 ",
                        "                            Q       ",
                        " 1           .  +*)('          #  \" ",
                        "b  bbbbbbbbb         bbbbbbb bb  b  ",
                        "                                    ",
                        "!       S                    !!  !  ",
                        "\"      T\"                    \"\"  \"  ",
                        "$   V  $$            U       $$  $  ",
                        "&   &ZY&&            &XW     &&  &  ",
                        ")   )))))            )))\\[   ))  )  ",
                        ".   ....._^]         .....   ..  .  ",
                        "1   11111111         11111   11  1  ",
                        "5   55555555         55555`  55  5  ",
                        "7   77777777         777777  77  7  ",
                        "9   99999999         999999  99  9  ",
                        ":  c::::::::         ::::::b :: a:  ",
                        "I  fIIIIIIII         IIIIIIe II  I  ",
                        "=  =========         ======= == ==  ",
                        "?  ?????????         ??????? ?? ??  ",
                        "C  CCCCCCCCC         CCCCCCC CC CC  ",
                        "J   JJJJJJJJ         JJJJJJ  JJ  J  ",
                        "M   MMMMMMMM         MMMMMM  MM  M  ",
                        "N  NNNNNNNNN         NNNNNNN NN  N  ",
                        "P  PPPPPPPPP         PPPPPPP PP  P  ",
                        "                +*)('               ",
                        "R  RRRRRRRRR         RRRRRRR RR aR  ",
                        "U  UUUUUUUUU         UUUUUUU UU  U  ",
                        "Z  ZZZZZZZZZ         ZZZZZZZ ZZ ZZ  ",
                        "c  ccccccccc         ccccccc cc cc  ",
                        "                             j      ",
                        "L  fLLLLLLLL         LLLLLLe LL  L  ",
                        "6   66666666         66666   66  6  ",
                        "              k                     ",
                        "                             l      ",
                        "                XXXXX               ",
                        " 1 0        /.-,+*)('    & %$m #  \"!",
                        "_  f________         ______e __  _  ",
                        " 1 0        /.-,+*)('    & %$  #  \"!",
                        " 1 0        /.-,+*)('    & %$  #  \"!",
                        " 1 0        /.-,+*)('    & %$  #  \"!",
                        " 1 0        /.-,+*)('    & %$  #  \"!",
                        " 1 0        /.-,+*)('    & %$  #  \"!",
                        " 1 0        /.-,+*)('    & %$  #  \"!",
                        " 1 0        /.-,+*)('    & %$  #  \"!",
                        " 1 0        /.-,+*)('    & %$  #  \"!",
                        " 1 0        /.-,+*)('    & %$  #  \"!",
                        " 1 0        /.-,+*)('    & %$  #  \"!",
                        " 1 0        /.-,+*)('    & %$  #  \"!",
                        " 1 0        /.-,+*)('    & %$  #  \"!",
                        " 1 0        /.-,+*)('    & %$  #  \"!",
                        " 1 0        /.-,+*)('      %$  #  \"!",
                        " 1 0        /.-,+*)('    & %$  #  \"!",
                        " 1           .  +*)('          #  \" ",
                        " 1           .  +*)('          #  \" ",
                        ">  >>>>>>>>>         >>>>>>> >> >>  ",
                        " 1           .  +*)('          #  \" ",
                        " 1           .  +*)('          #  \" ",
                        "Q  QQQQQQQQQ         QQQQQQQ QQ aQ  ",
                        "V  VVVVVVVVV         VVVVVVV VV aV  ",
                        "T  TTTTTTTTT         TTTTTTT TT  T  ",
                        "@  @@@@@@@@@         @@@@@@@ @@ @@  ",
                        "                             \x87      ",
                        "[  [[[[[[[[[         [[[[[[[ [[ [[  ",
                        "D  DDDDDDDDD         DDDDDDD DD DD  ",
                        "                             HH     ",
                        "                             \x88      ",
                        "                             F\x89     ",
                        "#      T#                    ##  #  ",
                        "%   V  %%            U       %%  %  ",
                        "'   'ZY''            'XW     ''  '  ",
                        "(   (ZY((            (XW     ((  (  ",
                        "+   +++++            +++\\[   ++  +  ",
                        "*   *****            ***\\[   **  *  ",
                        "-   -----            ---\\[   --  -  ",
                        ",   ,,,,,            ,,,\\[   ,,  ,  ",
                        "0   00000_^]         00000   00  0  ",
                        "/   /////_^]         /////   //  /  ",
                        "2   22222222         22222   22  2  ",
                        "3   33333333         33333   33  3  ",
                        "4   44444444         44444   44  4  ",
                        "8   88888888         888888  88  8  ",
                        "                                 ^  ",
                        "                                 \x8a  ",
                        ";  f;;;;;;;;         ;;;;;;e ;;  ;  ",
                        "<  f<<<<<<<<         <<<<<<e <<  <  ",
                        "O  OOOOOOOOO         OOOOOOO OO  O  ",
                        "`  `````````         ``````` ``  `  ",
                        "S  SSSSSSSSS         SSSSSSS SS  S  ",
                        "W  WWWWWWWWW         WWWWWWW WW  W  ",
                        "\\  \\\\\\\\\\\\\\\\\\         \\\\\\\\\\\\\\ \\\\ \\\\  ",
                        "E  EEEEEEEEE         EEEEEEE EE EE  ",
                        " 1 0        /.-,+*)('    & %$  #  \"!",
                        "]  ]]]]]]]]]         ]]]]]]] ]] ]]  ",
                        "                             G      "
                    ];
                    XPathParser.gotoTable = [
                        "3456789:;<=>?@ AB  CDEFGH IJ ",
                        "                             ",
                        "                             ",
                        "                             ",
                        "L456789:;<=>?@ AB  CDEFGH IJ ",
                        "            M        EFGH IJ ",
                        "       N;<=>?@ AB  CDEFGH IJ ",
                        "                             ",
                        "                             ",
                        "                             ",
                        "                             ",
                        "                             ",
                        "                             ",
                        "                             ",
                        "                             ",
                        "                             ",
                        "            S        EFGH IJ ",
                        "                             ",
                        "                             ",
                        "                             ",
                        "                             ",
                        "                             ",
                        "                             ",
                        "                             ",
                        "                             ",
                        "                             ",
                        "                             ",
                        "                             ",
                        "                             ",
                        "              e              ",
                        "                             ",
                        "                             ",
                        "                             ",
                        "                             ",
                        "                             ",
                        "                             ",
                        "                             ",
                        "                             ",
                        "                        h  J ",
                        "              i          j   ",
                        "                             ",
                        "                             ",
                        "                             ",
                        "                             ",
                        "                             ",
                        "                             ",
                        "                             ",
                        "                             ",
                        "                             ",
                        "o456789:;<=>?@ ABpqCDEFGH IJ ",
                        "                             ",
                        "  r6789:;<=>?@ AB  CDEFGH IJ ",
                        "   s789:;<=>?@ AB  CDEFGH IJ ",
                        "    t89:;<=>?@ AB  CDEFGH IJ ",
                        "    u89:;<=>?@ AB  CDEFGH IJ ",
                        "     v9:;<=>?@ AB  CDEFGH IJ ",
                        "     w9:;<=>?@ AB  CDEFGH IJ ",
                        "     x9:;<=>?@ AB  CDEFGH IJ ",
                        "     y9:;<=>?@ AB  CDEFGH IJ ",
                        "      z:;<=>?@ AB  CDEFGH IJ ",
                        "      {:;<=>?@ AB  CDEFGH IJ ",
                        "       |;<=>?@ AB  CDEFGH IJ ",
                        "       };<=>?@ AB  CDEFGH IJ ",
                        "       ~;<=>?@ AB  CDEFGH IJ ",
                        "         \x7f=>?@ AB  CDEFGH IJ ",
                        "\x80456789:;<=>?@ AB  CDEFGH IJ\x81",
                        "            \x82        EFGH IJ ",
                        "            \x83        EFGH IJ ",
                        "                             ",
                        "                     \x84 GH IJ ",
                        "                     \x85 GH IJ ",
                        "              i          \x86   ",
                        "              i          \x87   ",
                        "                             ",
                        "                             ",
                        "                             ",
                        "                             ",
                        "                             ",
                        "                             ",
                        "                             ",
                        "                             ",
                        "                             ",
                        "                             ",
                        "                             ",
                        "                             ",
                        "                             ",
                        "                             ",
                        "                             ",
                        "                             ",
                        "                             ",
                        "                             ",
                        "                             ",
                        "                             ",
                        "                             ",
                        "                             ",
                        "                             ",
                        "                             ",
                        "                             ",
                        "                             ",
                        "                             ",
                        "                             ",
                        "                             ",
                        "                             ",
                        "                             ",
                        "                             ",
                        "o456789:;<=>?@ AB\x8cqCDEFGH IJ ",
                        "                             ",
                        "                             "
                    ];
                    XPathParser.productions = [
                        [1, 1, 2],
                        [2, 1, 3],
                        [3, 1, 4],
                        [3, 3, 3, -9, 4],
                        [4, 1, 5],
                        [4, 3, 4, -8, 5],
                        [5, 1, 6],
                        [5, 3, 5, -22, 6],
                        [5, 3, 5, -5, 6],
                        [6, 1, 7],
                        [6, 3, 6, -23, 7],
                        [6, 3, 6, -24, 7],
                        [6, 3, 6, -6, 7],
                        [6, 3, 6, -7, 7],
                        [7, 1, 8],
                        [7, 3, 7, -25, 8],
                        [7, 3, 7, -26, 8],
                        [8, 1, 9],
                        [8, 3, 8, -12, 9],
                        [8, 3, 8, -11, 9],
                        [8, 3, 8, -10, 9],
                        [9, 1, 10],
                        [9, 2, -26, 9],
                        [10, 1, 11],
                        [10, 3, 10, -27, 11],
                        [11, 1, 12],
                        [11, 1, 13],
                        [11, 3, 13, -28, 14],
                        [11, 3, 13, -4, 14],
                        [13, 1, 15],
                        [13, 2, 13, 16],
                        [15, 1, 17],
                        [15, 3, -29, 2, -30],
                        [15, 1, -15],
                        [15, 1, -16],
                        [15, 1, 18],
                        [18, 3, -13, -29, -30],
                        [18, 4, -13, -29, 19, -30],
                        [19, 1, 20],
                        [19, 3, 20, -31, 19],
                        [20, 1, 2],
                        [12, 1, 14],
                        [12, 1, 21],
                        [21, 1, -28],
                        [21, 2, -28, 14],
                        [21, 1, 22],
                        [14, 1, 23],
                        [14, 3, 14, -28, 23],
                        [14, 1, 24],
                        [23, 2, 25, 26],
                        [23, 1, 26],
                        [23, 3, 25, 26, 27],
                        [23, 2, 26, 27],
                        [23, 1, 28],
                        [27, 1, 16],
                        [27, 2, 16, 27],
                        [25, 2, -14, -3],
                        [25, 1, -32],
                        [26, 1, 29],
                        [26, 3, -20, -29, -30],
                        [26, 4, -21, -29, -15, -30],
                        [16, 3, -33, 30, -34],
                        [30, 1, 2],
                        [22, 2, -4, 14],
                        [24, 3, 14, -4, 23],
                        [28, 1, -35],
                        [28, 1, -2],
                        [17, 2, -36, -18],
                        [29, 1, -17],
                        [29, 1, -19],
                        [29, 1, -18]
                    ];
                    XPathParser.DOUBLEDOT = 2;
                    XPathParser.DOUBLECOLON = 3;
                    XPathParser.DOUBLESLASH = 4;
                    XPathParser.NOTEQUAL = 5;
                    XPathParser.LESSTHANOREQUAL = 6;
                    XPathParser.GREATERTHANOREQUAL = 7;
                    XPathParser.AND = 8;
                    XPathParser.OR = 9;
                    XPathParser.MOD = 10;
                    XPathParser.DIV = 11;
                    XPathParser.MULTIPLYOPERATOR = 12;
                    XPathParser.FUNCTIONNAME = 13;
                    XPathParser.AXISNAME = 14;
                    XPathParser.LITERAL = 15;
                    XPathParser.NUMBER = 16;
                    XPathParser.ASTERISKNAMETEST = 17;
                    XPathParser.QNAME = 18;
                    XPathParser.NCNAMECOLONASTERISK = 19;
                    XPathParser.NODETYPE = 20;
                    XPathParser.PROCESSINGINSTRUCTIONWITHLITERAL = 21;
                    XPathParser.EQUALS = 22;
                    XPathParser.LESSTHAN = 23;
                    XPathParser.GREATERTHAN = 24;
                    XPathParser.PLUS = 25;
                    XPathParser.MINUS = 26;
                    XPathParser.BAR = 27;
                    XPathParser.SLASH = 28;
                    XPathParser.LEFTPARENTHESIS = 29;
                    XPathParser.RIGHTPARENTHESIS = 30;
                    XPathParser.COMMA = 31;
                    XPathParser.AT = 32;
                    XPathParser.LEFTBRACKET = 33;
                    XPathParser.RIGHTBRACKET = 34;
                    XPathParser.DOT = 35;
                    XPathParser.DOLLAR = 36;
                    XPathParser.prototype.tokenize = function (s1) {
                        var types = [];
                        var values = [];
                        var s = s1 + '\0';
                        var pos = 0;
                        var c = s.charAt(pos++);
                        while (1) {
                            while (c == ' ' || c == '\t' || c == '\r' || c == '\n') {
                                c = s.charAt(pos++);
                            }
                            if (c == '\0' || pos >= s.length) {
                                break;
                            }
                            if (c == '(') {
                                types.push(XPathParser.LEFTPARENTHESIS);
                                values.push(c);
                                c = s.charAt(pos++);
                                continue;
                            }
                            if (c == ')') {
                                types.push(XPathParser.RIGHTPARENTHESIS);
                                values.push(c);
                                c = s.charAt(pos++);
                                continue;
                            }
                            if (c == '[') {
                                types.push(XPathParser.LEFTBRACKET);
                                values.push(c);
                                c = s.charAt(pos++);
                                continue;
                            }
                            if (c == ']') {
                                types.push(XPathParser.RIGHTBRACKET);
                                values.push(c);
                                c = s.charAt(pos++);
                                continue;
                            }
                            if (c == '@') {
                                types.push(XPathParser.AT);
                                values.push(c);
                                c = s.charAt(pos++);
                                continue;
                            }
                            if (c == ',') {
                                types.push(XPathParser.COMMA);
                                values.push(c);
                                c = s.charAt(pos++);
                                continue;
                            }
                            if (c == '|') {
                                types.push(XPathParser.BAR);
                                values.push(c);
                                c = s.charAt(pos++);
                                continue;
                            }
                            if (c == '+') {
                                types.push(XPathParser.PLUS);
                                values.push(c);
                                c = s.charAt(pos++);
                                continue;
                            }
                            if (c == '-') {
                                types.push(XPathParser.MINUS);
                                values.push(c);
                                c = s.charAt(pos++);
                                continue;
                            }
                            if (c == '=') {
                                types.push(XPathParser.EQUALS);
                                values.push(c);
                                c = s.charAt(pos++);
                                continue;
                            }
                            if (c == '$') {
                                types.push(XPathParser.DOLLAR);
                                values.push(c);
                                c = s.charAt(pos++);
                                continue;
                            }
                            if (c == '.') {
                                c = s.charAt(pos++);
                                if (c == '.') {
                                    types.push(XPathParser.DOUBLEDOT);
                                    values.push("..");
                                    c = s.charAt(pos++);
                                    continue;
                                }
                                if (c >= '0' && c <= '9') {
                                    var number = "." + c;
                                    c = s.charAt(pos++);
                                    while (c >= '0' && c <= '9') {
                                        number += c;
                                        c = s.charAt(pos++);
                                    }
                                    types.push(XPathParser.NUMBER);
                                    values.push(number);
                                    continue;
                                }
                                types.push(XPathParser.DOT);
                                values.push('.');
                                continue;
                            }
                            if (c == '\'' || c == '"') {
                                var delimiter = c;
                                var literal = "";
                                while (pos < s.length && (c = s.charAt(pos)) !== delimiter) {
                                    literal += c;
                                    pos += 1;
                                }
                                if (c !== delimiter) {
                                    throw XPathException.fromMessage("Unterminated string literal: " + delimiter + literal);
                                }
                                pos += 1;
                                types.push(XPathParser.LITERAL);
                                values.push(literal);
                                c = s.charAt(pos++);
                                continue;
                            }
                            if (c >= '0' && c <= '9') {
                                var number = c;
                                c = s.charAt(pos++);
                                while (c >= '0' && c <= '9') {
                                    number += c;
                                    c = s.charAt(pos++);
                                }
                                if (c == '.') {
                                    if (s.charAt(pos) >= '0' && s.charAt(pos) <= '9') {
                                        number += c;
                                        number += s.charAt(pos++);
                                        c = s.charAt(pos++);
                                        while (c >= '0' && c <= '9') {
                                            number += c;
                                            c = s.charAt(pos++);
                                        }
                                    }
                                }
                                types.push(XPathParser.NUMBER);
                                values.push(number);
                                continue;
                            }
                            if (c == '*') {
                                if (types.length > 0) {
                                    var last = types[types.length - 1];
                                    if (last != XPathParser.AT
                                        && last != XPathParser.DOUBLECOLON
                                        && last != XPathParser.LEFTPARENTHESIS
                                        && last != XPathParser.LEFTBRACKET
                                        && last != XPathParser.AND
                                        && last != XPathParser.OR
                                        && last != XPathParser.MOD
                                        && last != XPathParser.DIV
                                        && last != XPathParser.MULTIPLYOPERATOR
                                        && last != XPathParser.SLASH
                                        && last != XPathParser.DOUBLESLASH
                                        && last != XPathParser.BAR
                                        && last != XPathParser.PLUS
                                        && last != XPathParser.MINUS
                                        && last != XPathParser.EQUALS
                                        && last != XPathParser.NOTEQUAL
                                        && last != XPathParser.LESSTHAN
                                        && last != XPathParser.LESSTHANOREQUAL
                                        && last != XPathParser.GREATERTHAN
                                        && last != XPathParser.GREATERTHANOREQUAL) {
                                        types.push(XPathParser.MULTIPLYOPERATOR);
                                        values.push(c);
                                        c = s.charAt(pos++);
                                        continue;
                                    }
                                }
                                types.push(XPathParser.ASTERISKNAMETEST);
                                values.push(c);
                                c = s.charAt(pos++);
                                continue;
                            }
                            if (c == ':') {
                                if (s.charAt(pos) == ':') {
                                    types.push(XPathParser.DOUBLECOLON);
                                    values.push("::");
                                    pos++;
                                    c = s.charAt(pos++);
                                    continue;
                                }
                            }
                            if (c == '/') {
                                c = s.charAt(pos++);
                                if (c == '/') {
                                    types.push(XPathParser.DOUBLESLASH);
                                    values.push("//");
                                    c = s.charAt(pos++);
                                    continue;
                                }
                                types.push(XPathParser.SLASH);
                                values.push('/');
                                continue;
                            }
                            if (c == '!') {
                                if (s.charAt(pos) == '=') {
                                    types.push(XPathParser.NOTEQUAL);
                                    values.push("!=");
                                    pos++;
                                    c = s.charAt(pos++);
                                    continue;
                                }
                            }
                            if (c == '<') {
                                if (s.charAt(pos) == '=') {
                                    types.push(XPathParser.LESSTHANOREQUAL);
                                    values.push("<=");
                                    pos++;
                                    c = s.charAt(pos++);
                                    continue;
                                }
                                types.push(XPathParser.LESSTHAN);
                                values.push('<');
                                c = s.charAt(pos++);
                                continue;
                            }
                            if (c == '>') {
                                if (s.charAt(pos) == '=') {
                                    types.push(XPathParser.GREATERTHANOREQUAL);
                                    values.push(">=");
                                    pos++;
                                    c = s.charAt(pos++);
                                    continue;
                                }
                                types.push(XPathParser.GREATERTHAN);
                                values.push('>');
                                c = s.charAt(pos++);
                                continue;
                            }
                            if (c == '_' || Utilities.isLetter(c.charCodeAt(0))) {
                                var name = c;
                                c = s.charAt(pos++);
                                while (Utilities.isNCNameChar(c.charCodeAt(0))) {
                                    name += c;
                                    c = s.charAt(pos++);
                                }
                                if (types.length > 0) {
                                    var last = types[types.length - 1];
                                    if (last != XPathParser.AT
                                        && last != XPathParser.DOUBLECOLON
                                        && last != XPathParser.LEFTPARENTHESIS
                                        && last != XPathParser.LEFTBRACKET
                                        && last != XPathParser.AND
                                        && last != XPathParser.OR
                                        && last != XPathParser.MOD
                                        && last != XPathParser.DIV
                                        && last != XPathParser.MULTIPLYOPERATOR
                                        && last != XPathParser.SLASH
                                        && last != XPathParser.DOUBLESLASH
                                        && last != XPathParser.BAR
                                        && last != XPathParser.PLUS
                                        && last != XPathParser.MINUS
                                        && last != XPathParser.EQUALS
                                        && last != XPathParser.NOTEQUAL
                                        && last != XPathParser.LESSTHAN
                                        && last != XPathParser.LESSTHANOREQUAL
                                        && last != XPathParser.GREATERTHAN
                                        && last != XPathParser.GREATERTHANOREQUAL) {
                                        if (name == "and") {
                                            types.push(XPathParser.AND);
                                            values.push(name);
                                            continue;
                                        }
                                        if (name == "or") {
                                            types.push(XPathParser.OR);
                                            values.push(name);
                                            continue;
                                        }
                                        if (name == "mod") {
                                            types.push(XPathParser.MOD);
                                            values.push(name);
                                            continue;
                                        }
                                        if (name == "div") {
                                            types.push(XPathParser.DIV);
                                            values.push(name);
                                            continue;
                                        }
                                    }
                                }
                                if (c == ':') {
                                    if (s.charAt(pos) == '*') {
                                        types.push(XPathParser.NCNAMECOLONASTERISK);
                                        values.push(name + ":*");
                                        pos++;
                                        c = s.charAt(pos++);
                                        continue;
                                    }
                                    if (s.charAt(pos) == '_' || Utilities.isLetter(s.charCodeAt(pos))) {
                                        name += ':';
                                        c = s.charAt(pos++);
                                        while (Utilities.isNCNameChar(c.charCodeAt(0))) {
                                            name += c;
                                            c = s.charAt(pos++);
                                        }
                                        if (c == '(') {
                                            types.push(XPathParser.FUNCTIONNAME);
                                            values.push(name);
                                            continue;
                                        }
                                        types.push(XPathParser.QNAME);
                                        values.push(name);
                                        continue;
                                    }
                                    if (s.charAt(pos) == ':') {
                                        types.push(XPathParser.AXISNAME);
                                        values.push(name);
                                        continue;
                                    }
                                }
                                if (c == '(') {
                                    if (name == "comment" || name == "text" || name == "node") {
                                        types.push(XPathParser.NODETYPE);
                                        values.push(name);
                                        continue;
                                    }
                                    if (name == "processing-instruction") {
                                        if (s.charAt(pos) == ')') {
                                            types.push(XPathParser.NODETYPE);
                                        }
                                        else {
                                            types.push(XPathParser.PROCESSINGINSTRUCTIONWITHLITERAL);
                                        }
                                        values.push(name);
                                        continue;
                                    }
                                    types.push(XPathParser.FUNCTIONNAME);
                                    values.push(name);
                                    continue;
                                }
                                types.push(XPathParser.QNAME);
                                values.push(name);
                                continue;
                            }
                            throw new Error("Unexpected character " + c);
                        }
                        types.push(1);
                        values.push("[EOF]");
                        return [types, values];
                    };
                    XPathParser.SHIFT = 's';
                    XPathParser.REDUCE = 'r';
                    XPathParser.ACCEPT = 'a';
                    XPathParser.prototype.parse = function (s) {
                        var types;
                        var values;
                        var res = this.tokenize(s);
                        if (res == undefined) {
                            return undefined;
                        }
                        types = res[0];
                        values = res[1];
                        var tokenPos = 0;
                        var state = [];
                        var tokenType = [];
                        var tokenValue = [];
                        var s;
                        var a;
                        var t;
                        state.push(0);
                        tokenType.push(1);
                        tokenValue.push("_S");
                        a = types[tokenPos];
                        t = values[tokenPos++];
                        while (1) {
                            s = state[state.length - 1];
                            switch (XPathParser.actionTable[s].charAt(a - 1)) {
                                case XPathParser.SHIFT:
                                    tokenType.push(-a);
                                    tokenValue.push(t);
                                    state.push(XPathParser.actionTableNumber[s].charCodeAt(a - 1) - 32);
                                    a = types[tokenPos];
                                    t = values[tokenPos++];
                                    break;
                                case XPathParser.REDUCE:
                                    var num = XPathParser.productions[XPathParser.actionTableNumber[s].charCodeAt(a - 1) - 32][1];
                                    var rhs = [];
                                    for (var i = 0; i < num; i++) {
                                        tokenType.pop();
                                        rhs.unshift(tokenValue.pop());
                                        state.pop();
                                    }
                                    var s_ = state[state.length - 1];
                                    tokenType.push(XPathParser.productions[XPathParser.actionTableNumber[s].charCodeAt(a - 1) - 32][0]);
                                    if (this.reduceActions[XPathParser.actionTableNumber[s].charCodeAt(a - 1) - 32] == undefined) {
                                        tokenValue.push(rhs[0]);
                                    }
                                    else {
                                        tokenValue.push(this.reduceActions[XPathParser.actionTableNumber[s].charCodeAt(a - 1) - 32](rhs));
                                    }
                                    state.push(XPathParser.gotoTable[s_].charCodeAt(XPathParser.productions[XPathParser.actionTableNumber[s].charCodeAt(a - 1) - 32][0] - 2) - 33);
                                    break;
                                case XPathParser.ACCEPT:
                                    return new XPath(tokenValue.pop());
                                default:
                                    throw new Error("XPath parse error");
                            }
                        }
                    };
                    XPath.prototype = new Object();
                    XPath.prototype.constructor = XPath;
                    XPath.superclass = Object.prototype;
                    function XPath(e) {
                        this.expression = e;
                    }
                    XPath.prototype.toString = function () {
                        return this.expression.toString();
                    };
                    XPath.prototype.evaluate = function (c) {
                        c.contextNode = c.expressionContextNode;
                        c.contextSize = 1;
                        c.contextPosition = 1;
                        c.caseInsensitive = false;
                        if (c.contextNode != null) {
                            var doc = c.contextNode;
                            if (doc.nodeType != 9) {
                                doc = doc.ownerDocument;
                            }
                            try {
                                c.caseInsensitive = doc.implementation.hasFeature("HTML", "2.0");
                            }
                            catch (e) {
                                c.caseInsensitive = true;
                            }
                        }
                        return this.expression.evaluate(c);
                    };
                    XPath.XML_NAMESPACE_URI = "http://www.w3.org/XML/1998/namespace";
                    XPath.XMLNS_NAMESPACE_URI = "http://www.w3.org/2000/xmlns/";
                    Expression.prototype = new Object();
                    Expression.prototype.constructor = Expression;
                    Expression.superclass = Object.prototype;
                    function Expression() {
                    }
                    Expression.prototype.init = function () {
                    };
                    Expression.prototype.toString = function () {
                        return "<Expression>";
                    };
                    Expression.prototype.evaluate = function (c) {
                        throw new Error("Could not evaluate expression.");
                    };
                    UnaryOperation.prototype = new Expression();
                    UnaryOperation.prototype.constructor = UnaryOperation;
                    UnaryOperation.superclass = Expression.prototype;
                    function UnaryOperation(rhs) {
                        if (arguments.length > 0) {
                            this.init(rhs);
                        }
                    }
                    UnaryOperation.prototype.init = function (rhs) {
                        this.rhs = rhs;
                    };
                    UnaryMinusOperation.prototype = new UnaryOperation();
                    UnaryMinusOperation.prototype.constructor = UnaryMinusOperation;
                    UnaryMinusOperation.superclass = UnaryOperation.prototype;
                    function UnaryMinusOperation(rhs) {
                        if (arguments.length > 0) {
                            this.init(rhs);
                        }
                    }
                    UnaryMinusOperation.prototype.init = function (rhs) {
                        UnaryMinusOperation.superclass.init.call(this, rhs);
                    };
                    UnaryMinusOperation.prototype.evaluate = function (c) {
                        return this.rhs.evaluate(c).number().negate();
                    };
                    UnaryMinusOperation.prototype.toString = function () {
                        return "-" + this.rhs.toString();
                    };
                    BinaryOperation.prototype = new Expression();
                    BinaryOperation.prototype.constructor = BinaryOperation;
                    BinaryOperation.superclass = Expression.prototype;
                    function BinaryOperation(lhs, rhs) {
                        if (arguments.length > 0) {
                            this.init(lhs, rhs);
                        }
                    }
                    BinaryOperation.prototype.init = function (lhs, rhs) {
                        this.lhs = lhs;
                        this.rhs = rhs;
                    };
                    OrOperation.prototype = new BinaryOperation();
                    OrOperation.prototype.constructor = OrOperation;
                    OrOperation.superclass = BinaryOperation.prototype;
                    function OrOperation(lhs, rhs) {
                        if (arguments.length > 0) {
                            this.init(lhs, rhs);
                        }
                    }
                    OrOperation.prototype.init = function (lhs, rhs) {
                        OrOperation.superclass.init.call(this, lhs, rhs);
                    };
                    OrOperation.prototype.toString = function () {
                        return "(" + this.lhs.toString() + " or " + this.rhs.toString() + ")";
                    };
                    OrOperation.prototype.evaluate = function (c) {
                        var b = this.lhs.evaluate(c).bool();
                        if (b.booleanValue()) {
                            return b;
                        }
                        return this.rhs.evaluate(c).bool();
                    };
                    AndOperation.prototype = new BinaryOperation();
                    AndOperation.prototype.constructor = AndOperation;
                    AndOperation.superclass = BinaryOperation.prototype;
                    function AndOperation(lhs, rhs) {
                        if (arguments.length > 0) {
                            this.init(lhs, rhs);
                        }
                    }
                    AndOperation.prototype.init = function (lhs, rhs) {
                        AndOperation.superclass.init.call(this, lhs, rhs);
                    };
                    AndOperation.prototype.toString = function () {
                        return "(" + this.lhs.toString() + " and " + this.rhs.toString() + ")";
                    };
                    AndOperation.prototype.evaluate = function (c) {
                        var b = this.lhs.evaluate(c).bool();
                        if (!b.booleanValue()) {
                            return b;
                        }
                        return this.rhs.evaluate(c).bool();
                    };
                    EqualsOperation.prototype = new BinaryOperation();
                    EqualsOperation.prototype.constructor = EqualsOperation;
                    EqualsOperation.superclass = BinaryOperation.prototype;
                    function EqualsOperation(lhs, rhs) {
                        if (arguments.length > 0) {
                            this.init(lhs, rhs);
                        }
                    }
                    EqualsOperation.prototype.init = function (lhs, rhs) {
                        EqualsOperation.superclass.init.call(this, lhs, rhs);
                    };
                    EqualsOperation.prototype.toString = function () {
                        return "(" + this.lhs.toString() + " = " + this.rhs.toString() + ")";
                    };
                    EqualsOperation.prototype.evaluate = function (c) {
                        return this.lhs.evaluate(c).equals(this.rhs.evaluate(c));
                    };
                    NotEqualOperation.prototype = new BinaryOperation();
                    NotEqualOperation.prototype.constructor = NotEqualOperation;
                    NotEqualOperation.superclass = BinaryOperation.prototype;
                    function NotEqualOperation(lhs, rhs) {
                        if (arguments.length > 0) {
                            this.init(lhs, rhs);
                        }
                    }
                    NotEqualOperation.prototype.init = function (lhs, rhs) {
                        NotEqualOperation.superclass.init.call(this, lhs, rhs);
                    };
                    NotEqualOperation.prototype.toString = function () {
                        return "(" + this.lhs.toString() + " != " + this.rhs.toString() + ")";
                    };
                    NotEqualOperation.prototype.evaluate = function (c) {
                        return this.lhs.evaluate(c).notequal(this.rhs.evaluate(c));
                    };
                    LessThanOperation.prototype = new BinaryOperation();
                    LessThanOperation.prototype.constructor = LessThanOperation;
                    LessThanOperation.superclass = BinaryOperation.prototype;
                    function LessThanOperation(lhs, rhs) {
                        if (arguments.length > 0) {
                            this.init(lhs, rhs);
                        }
                    }
                    LessThanOperation.prototype.init = function (lhs, rhs) {
                        LessThanOperation.superclass.init.call(this, lhs, rhs);
                    };
                    LessThanOperation.prototype.evaluate = function (c) {
                        return this.lhs.evaluate(c).lessthan(this.rhs.evaluate(c));
                    };
                    LessThanOperation.prototype.toString = function () {
                        return "(" + this.lhs.toString() + " < " + this.rhs.toString() + ")";
                    };
                    GreaterThanOperation.prototype = new BinaryOperation();
                    GreaterThanOperation.prototype.constructor = GreaterThanOperation;
                    GreaterThanOperation.superclass = BinaryOperation.prototype;
                    function GreaterThanOperation(lhs, rhs) {
                        if (arguments.length > 0) {
                            this.init(lhs, rhs);
                        }
                    }
                    GreaterThanOperation.prototype.init = function (lhs, rhs) {
                        GreaterThanOperation.superclass.init.call(this, lhs, rhs);
                    };
                    GreaterThanOperation.prototype.evaluate = function (c) {
                        return this.lhs.evaluate(c).greaterthan(this.rhs.evaluate(c));
                    };
                    GreaterThanOperation.prototype.toString = function () {
                        return "(" + this.lhs.toString() + " > " + this.rhs.toString() + ")";
                    };
                    LessThanOrEqualOperation.prototype = new BinaryOperation();
                    LessThanOrEqualOperation.prototype.constructor = LessThanOrEqualOperation;
                    LessThanOrEqualOperation.superclass = BinaryOperation.prototype;
                    function LessThanOrEqualOperation(lhs, rhs) {
                        if (arguments.length > 0) {
                            this.init(lhs, rhs);
                        }
                    }
                    LessThanOrEqualOperation.prototype.init = function (lhs, rhs) {
                        LessThanOrEqualOperation.superclass.init.call(this, lhs, rhs);
                    };
                    LessThanOrEqualOperation.prototype.evaluate = function (c) {
                        return this.lhs.evaluate(c).lessthanorequal(this.rhs.evaluate(c));
                    };
                    LessThanOrEqualOperation.prototype.toString = function () {
                        return "(" + this.lhs.toString() + " <= " + this.rhs.toString() + ")";
                    };
                    GreaterThanOrEqualOperation.prototype = new BinaryOperation();
                    GreaterThanOrEqualOperation.prototype.constructor = GreaterThanOrEqualOperation;
                    GreaterThanOrEqualOperation.superclass = BinaryOperation.prototype;
                    function GreaterThanOrEqualOperation(lhs, rhs) {
                        if (arguments.length > 0) {
                            this.init(lhs, rhs);
                        }
                    }
                    GreaterThanOrEqualOperation.prototype.init = function (lhs, rhs) {
                        GreaterThanOrEqualOperation.superclass.init.call(this, lhs, rhs);
                    };
                    GreaterThanOrEqualOperation.prototype.evaluate = function (c) {
                        return this.lhs.evaluate(c).greaterthanorequal(this.rhs.evaluate(c));
                    };
                    GreaterThanOrEqualOperation.prototype.toString = function () {
                        return "(" + this.lhs.toString() + " >= " + this.rhs.toString() + ")";
                    };
                    PlusOperation.prototype = new BinaryOperation();
                    PlusOperation.prototype.constructor = PlusOperation;
                    PlusOperation.superclass = BinaryOperation.prototype;
                    function PlusOperation(lhs, rhs) {
                        if (arguments.length > 0) {
                            this.init(lhs, rhs);
                        }
                    }
                    PlusOperation.prototype.init = function (lhs, rhs) {
                        PlusOperation.superclass.init.call(this, lhs, rhs);
                    };
                    PlusOperation.prototype.evaluate = function (c) {
                        return this.lhs.evaluate(c).number().plus(this.rhs.evaluate(c).number());
                    };
                    PlusOperation.prototype.toString = function () {
                        return "(" + this.lhs.toString() + " + " + this.rhs.toString() + ")";
                    };
                    MinusOperation.prototype = new BinaryOperation();
                    MinusOperation.prototype.constructor = MinusOperation;
                    MinusOperation.superclass = BinaryOperation.prototype;
                    function MinusOperation(lhs, rhs) {
                        if (arguments.length > 0) {
                            this.init(lhs, rhs);
                        }
                    }
                    MinusOperation.prototype.init = function (lhs, rhs) {
                        MinusOperation.superclass.init.call(this, lhs, rhs);
                    };
                    MinusOperation.prototype.evaluate = function (c) {
                        return this.lhs.evaluate(c).number().minus(this.rhs.evaluate(c).number());
                    };
                    MinusOperation.prototype.toString = function () {
                        return "(" + this.lhs.toString() + " - " + this.rhs.toString() + ")";
                    };
                    MultiplyOperation.prototype = new BinaryOperation();
                    MultiplyOperation.prototype.constructor = MultiplyOperation;
                    MultiplyOperation.superclass = BinaryOperation.prototype;
                    function MultiplyOperation(lhs, rhs) {
                        if (arguments.length > 0) {
                            this.init(lhs, rhs);
                        }
                    }
                    MultiplyOperation.prototype.init = function (lhs, rhs) {
                        MultiplyOperation.superclass.init.call(this, lhs, rhs);
                    };
                    MultiplyOperation.prototype.evaluate = function (c) {
                        return this.lhs.evaluate(c).number().multiply(this.rhs.evaluate(c).number());
                    };
                    MultiplyOperation.prototype.toString = function () {
                        return "(" + this.lhs.toString() + " * " + this.rhs.toString() + ")";
                    };
                    DivOperation.prototype = new BinaryOperation();
                    DivOperation.prototype.constructor = DivOperation;
                    DivOperation.superclass = BinaryOperation.prototype;
                    function DivOperation(lhs, rhs) {
                        if (arguments.length > 0) {
                            this.init(lhs, rhs);
                        }
                    }
                    DivOperation.prototype.init = function (lhs, rhs) {
                        DivOperation.superclass.init.call(this, lhs, rhs);
                    };
                    DivOperation.prototype.evaluate = function (c) {
                        return this.lhs.evaluate(c).number().div(this.rhs.evaluate(c).number());
                    };
                    DivOperation.prototype.toString = function () {
                        return "(" + this.lhs.toString() + " div " + this.rhs.toString() + ")";
                    };
                    ModOperation.prototype = new BinaryOperation();
                    ModOperation.prototype.constructor = ModOperation;
                    ModOperation.superclass = BinaryOperation.prototype;
                    function ModOperation(lhs, rhs) {
                        if (arguments.length > 0) {
                            this.init(lhs, rhs);
                        }
                    }
                    ModOperation.prototype.init = function (lhs, rhs) {
                        ModOperation.superclass.init.call(this, lhs, rhs);
                    };
                    ModOperation.prototype.evaluate = function (c) {
                        return this.lhs.evaluate(c).number().mod(this.rhs.evaluate(c).number());
                    };
                    ModOperation.prototype.toString = function () {
                        return "(" + this.lhs.toString() + " mod " + this.rhs.toString() + ")";
                    };
                    BarOperation.prototype = new BinaryOperation();
                    BarOperation.prototype.constructor = BarOperation;
                    BarOperation.superclass = BinaryOperation.prototype;
                    function BarOperation(lhs, rhs) {
                        if (arguments.length > 0) {
                            this.init(lhs, rhs);
                        }
                    }
                    BarOperation.prototype.init = function (lhs, rhs) {
                        BarOperation.superclass.init.call(this, lhs, rhs);
                    };
                    BarOperation.prototype.evaluate = function (c) {
                        return this.lhs.evaluate(c).nodeset().union(this.rhs.evaluate(c).nodeset());
                    };
                    BarOperation.prototype.toString = function () {
                        return this.lhs.toString() + " | " + this.rhs.toString();
                    };
                    PathExpr.prototype = new Expression();
                    PathExpr.prototype.constructor = PathExpr;
                    PathExpr.superclass = Expression.prototype;
                    function PathExpr(filter, filterPreds, locpath) {
                        if (arguments.length > 0) {
                            this.init(filter, filterPreds, locpath);
                        }
                    }
                    PathExpr.prototype.init = function (filter, filterPreds, locpath) {
                        PathExpr.superclass.init.call(this);
                        this.filter = filter;
                        this.filterPredicates = filterPreds;
                        this.locationPath = locpath;
                    };
                    function findRoot(node) {
                        while (node && node.parentNode) {
                            node = node.parentNode;
                        }
                        return node;
                    }
                    PathExpr.prototype.evaluate = function (c) {
                        var nodes;
                        var xpc = new XPathContext();
                        xpc.variableResolver = c.variableResolver;
                        xpc.functionResolver = c.functionResolver;
                        xpc.namespaceResolver = c.namespaceResolver;
                        xpc.expressionContextNode = c.expressionContextNode;
                        xpc.virtualRoot = c.virtualRoot;
                        xpc.caseInsensitive = c.caseInsensitive;
                        if (this.filter == null) {
                            nodes = [c.contextNode];
                        }
                        else {
                            var ns = this.filter.evaluate(c);
                            if (!Utilities.instance_of(ns, XNodeSet)) {
                                if (this.filterPredicates != null && this.filterPredicates.length > 0 || this.locationPath != null) {
                                    throw new Error("Path expression filter must evaluate to a nodset if predicates or location path are used");
                                }
                                return ns;
                            }
                            nodes = ns.toUnsortedArray();
                            if (this.filterPredicates != null) {
                                for (var j = 0; j < this.filterPredicates.length; j++) {
                                    var pred = this.filterPredicates[j];
                                    var newNodes = [];
                                    xpc.contextSize = nodes.length;
                                    for (xpc.contextPosition = 1; xpc.contextPosition <= xpc.contextSize; xpc.contextPosition++) {
                                        xpc.contextNode = nodes[xpc.contextPosition - 1];
                                        if (this.predicateMatches(pred, xpc)) {
                                            newNodes.push(xpc.contextNode);
                                        }
                                    }
                                    nodes = newNodes;
                                }
                            }
                        }
                        if (this.locationPath != null) {
                            if (this.locationPath.absolute) {
                                if (nodes[0].nodeType != 9) {
                                    if (xpc.virtualRoot != null) {
                                        nodes = [xpc.virtualRoot];
                                    }
                                    else {
                                        if (nodes[0].ownerDocument == null) {
                                            var n = nodes[0];
                                            while (n.parentNode != null) {
                                                n = n.parentNode;
                                            }
                                            nodes = [n];
                                        }
                                        else {
                                            nodes = [nodes[0].ownerDocument];
                                        }
                                    }
                                }
                                else {
                                    nodes = [nodes[0]];
                                }
                            }
                            for (var i = 0; i < this.locationPath.steps.length; i++) {
                                var step = this.locationPath.steps[i];
                                var newNodes = [];
                                for (var j = 0; j < nodes.length; j++) {
                                    xpc.contextNode = nodes[j];
                                    switch (step.axis) {
                                        case Step.ANCESTOR:
                                            if (xpc.contextNode === xpc.virtualRoot) {
                                                break;
                                            }
                                            var m;
                                            if (xpc.contextNode.nodeType == 2) {
                                                m = this.getOwnerElement(xpc.contextNode);
                                            }
                                            else {
                                                m = xpc.contextNode.parentNode;
                                            }
                                            while (m != null) {
                                                if (step.nodeTest.matches(m, xpc)) {
                                                    newNodes.push(m);
                                                }
                                                if (m === xpc.virtualRoot) {
                                                    break;
                                                }
                                                m = m.parentNode;
                                            }
                                            break;
                                        case Step.ANCESTORORSELF:
                                            for (var m = xpc.contextNode; m != null; m = m.nodeType == 2 ? this.getOwnerElement(m) : m.parentNode) {
                                                if (step.nodeTest.matches(m, xpc)) {
                                                    newNodes.push(m);
                                                }
                                                if (m === xpc.virtualRoot) {
                                                    break;
                                                }
                                            }
                                            break;
                                        case Step.ATTRIBUTE:
                                            var nnm = xpc.contextNode.attributes;
                                            if (nnm != null) {
                                                for (var k = 0; k < nnm.length; k++) {
                                                    var m = nnm.item(k);
                                                    if (step.nodeTest.matches(m, xpc)) {
                                                        newNodes.push(m);
                                                    }
                                                }
                                            }
                                            break;
                                        case Step.CHILD:
                                            for (var m = xpc.contextNode.firstChild; m != null; m = m.nextSibling) {
                                                if (step.nodeTest.matches(m, xpc)) {
                                                    newNodes.push(m);
                                                }
                                            }
                                            break;
                                        case Step.DESCENDANT:
                                            var st = [xpc.contextNode.firstChild];
                                            while (st.length > 0) {
                                                for (var m = st.pop(); m != null;) {
                                                    if (step.nodeTest.matches(m, xpc)) {
                                                        newNodes.push(m);
                                                    }
                                                    if (m.firstChild != null) {
                                                        st.push(m.nextSibling);
                                                        m = m.firstChild;
                                                    }
                                                    else {
                                                        m = m.nextSibling;
                                                    }
                                                }
                                            }
                                            break;
                                        case Step.DESCENDANTORSELF:
                                            if (step.nodeTest.matches(xpc.contextNode, xpc)) {
                                                newNodes.push(xpc.contextNode);
                                            }
                                            var st = [xpc.contextNode.firstChild];
                                            while (st.length > 0) {
                                                for (var m = st.pop(); m != null;) {
                                                    if (step.nodeTest.matches(m, xpc)) {
                                                        newNodes.push(m);
                                                    }
                                                    if (m.firstChild != null) {
                                                        st.push(m.nextSibling);
                                                        m = m.firstChild;
                                                    }
                                                    else {
                                                        m = m.nextSibling;
                                                    }
                                                }
                                            }
                                            break;
                                        case Step.FOLLOWING:
                                            if (xpc.contextNode === xpc.virtualRoot) {
                                                break;
                                            }
                                            var st = [];
                                            if (xpc.contextNode.firstChild != null) {
                                                st.unshift(xpc.contextNode.firstChild);
                                            }
                                            else {
                                                st.unshift(xpc.contextNode.nextSibling);
                                            }
                                            for (var m = xpc.contextNode.parentNode; m != null && m.nodeType != 9 && m !== xpc.virtualRoot; m = m.parentNode) {
                                                st.unshift(m.nextSibling);
                                            }
                                            do {
                                                for (var m = st.pop(); m != null;) {
                                                    if (step.nodeTest.matches(m, xpc)) {
                                                        newNodes.push(m);
                                                    }
                                                    if (m.firstChild != null) {
                                                        st.push(m.nextSibling);
                                                        m = m.firstChild;
                                                    }
                                                    else {
                                                        m = m.nextSibling;
                                                    }
                                                }
                                            } while (st.length > 0);
                                            break;
                                        case Step.FOLLOWINGSIBLING:
                                            if (xpc.contextNode === xpc.virtualRoot) {
                                                break;
                                            }
                                            for (var m = xpc.contextNode.nextSibling; m != null; m = m.nextSibling) {
                                                if (step.nodeTest.matches(m, xpc)) {
                                                    newNodes.push(m);
                                                }
                                            }
                                            break;
                                        case Step.NAMESPACE:
                                            var n = {};
                                            if (xpc.contextNode.nodeType == 1) {
                                                n["xml"] = XPath.XML_NAMESPACE_URI;
                                                n["xmlns"] = XPath.XMLNS_NAMESPACE_URI;
                                                for (var m = xpc.contextNode; m != null && m.nodeType == 1; m = m.parentNode) {
                                                    for (var k = 0; k < m.attributes.length; k++) {
                                                        var attr = m.attributes.item(k);
                                                        var nm = String(attr.name);
                                                        if (nm == "xmlns") {
                                                            if (n[""] == undefined) {
                                                                n[""] = attr.value;
                                                            }
                                                        }
                                                        else if (nm.length > 6 && nm.substring(0, 6) == "xmlns:") {
                                                            var pre = nm.substring(6, nm.length);
                                                            if (n[pre] == undefined) {
                                                                n[pre] = attr.value;
                                                            }
                                                        }
                                                    }
                                                }
                                                for (var pre in n) {
                                                    var nsn = new XPathNamespace(pre, n[pre], xpc.contextNode);
                                                    if (step.nodeTest.matches(nsn, xpc)) {
                                                        newNodes.push(nsn);
                                                    }
                                                }
                                            }
                                            break;
                                        case Step.PARENT:
                                            m = null;
                                            if (xpc.contextNode !== xpc.virtualRoot) {
                                                if (xpc.contextNode.nodeType == 2) {
                                                    m = this.getOwnerElement(xpc.contextNode);
                                                }
                                                else {
                                                    m = xpc.contextNode.parentNode;
                                                }
                                            }
                                            if (m != null && step.nodeTest.matches(m, xpc)) {
                                                newNodes.push(m);
                                            }
                                            break;
                                        case Step.PRECEDING:
                                            var st;
                                            if (xpc.virtualRoot != null) {
                                                st = [xpc.virtualRoot];
                                            }
                                            else {
                                                st = [findRoot(xpc.contextNode)];
                                            }
                                            outer: while (st.length > 0) {
                                                for (var m = st.pop(); m != null;) {
                                                    if (m == xpc.contextNode) {
                                                        break outer;
                                                    }
                                                    if (step.nodeTest.matches(m, xpc)) {
                                                        newNodes.unshift(m);
                                                    }
                                                    if (m.firstChild != null) {
                                                        st.push(m.nextSibling);
                                                        m = m.firstChild;
                                                    }
                                                    else {
                                                        m = m.nextSibling;
                                                    }
                                                }
                                            }
                                            break;
                                        case Step.PRECEDINGSIBLING:
                                            if (xpc.contextNode === xpc.virtualRoot) {
                                                break;
                                            }
                                            for (var m = xpc.contextNode.previousSibling; m != null; m = m.previousSibling) {
                                                if (step.nodeTest.matches(m, xpc)) {
                                                    newNodes.push(m);
                                                }
                                            }
                                            break;
                                        case Step.SELF:
                                            if (step.nodeTest.matches(xpc.contextNode, xpc)) {
                                                newNodes.push(xpc.contextNode);
                                            }
                                            break;
                                        default:
                                    }
                                }
                                nodes = newNodes;
                                for (var j = 0; j < step.predicates.length; j++) {
                                    var pred = step.predicates[j];
                                    var newNodes = [];
                                    xpc.contextSize = nodes.length;
                                    for (xpc.contextPosition = 1; xpc.contextPosition <= xpc.contextSize; xpc.contextPosition++) {
                                        xpc.contextNode = nodes[xpc.contextPosition - 1];
                                        if (this.predicateMatches(pred, xpc)) {
                                            newNodes.push(xpc.contextNode);
                                        }
                                        else {
                                        }
                                    }
                                    nodes = newNodes;
                                }
                            }
                        }
                        var ns = new XNodeSet();
                        ns.addArray(nodes);
                        return ns;
                    };
                    PathExpr.prototype.predicateMatches = function (pred, c) {
                        var res = pred.evaluate(c);
                        if (Utilities.instance_of(res, XNumber)) {
                            return c.contextPosition == res.numberValue();
                        }
                        return res.booleanValue();
                    };
                    PathExpr.prototype.toString = function () {
                        if (this.filter != undefined) {
                            var s = this.filter.toString();
                            if (Utilities.instance_of(this.filter, XString)) {
                                s = "'" + s + "'";
                            }
                            if (this.filterPredicates != undefined) {
                                for (var i = 0; i < this.filterPredicates.length; i++) {
                                    s = s + "[" + this.filterPredicates[i].toString() + "]";
                                }
                            }
                            if (this.locationPath != undefined) {
                                if (!this.locationPath.absolute) {
                                    s += "/";
                                }
                                s += this.locationPath.toString();
                            }
                            return s;
                        }
                        return this.locationPath.toString();
                    };
                    PathExpr.prototype.getOwnerElement = function (n) {
                        if (n.ownerElement) {
                            return n.ownerElement;
                        }
                        try {
                            if (n.selectSingleNode) {
                                return n.selectSingleNode("..");
                            }
                        }
                        catch (e) {
                        }
                        var doc = n.nodeType == 9
                            ? n
                            : n.ownerDocument;
                        var elts = doc.getElementsByTagName("*");
                        for (var i = 0; i < elts.length; i++) {
                            var elt = elts.item(i);
                            var nnm = elt.attributes;
                            for (var j = 0; j < nnm.length; j++) {
                                var an = nnm.item(j);
                                if (an === n) {
                                    return elt;
                                }
                            }
                        }
                        return null;
                    };
                    LocationPath.prototype = new Object();
                    LocationPath.prototype.constructor = LocationPath;
                    LocationPath.superclass = Object.prototype;
                    function LocationPath(abs, steps) {
                        if (arguments.length > 0) {
                            this.init(abs, steps);
                        }
                    }
                    LocationPath.prototype.init = function (abs, steps) {
                        this.absolute = abs;
                        this.steps = steps;
                    };
                    LocationPath.prototype.toString = function () {
                        var s;
                        if (this.absolute) {
                            s = "/";
                        }
                        else {
                            s = "";
                        }
                        for (var i = 0; i < this.steps.length; i++) {
                            if (i != 0) {
                                s += "/";
                            }
                            s += this.steps[i].toString();
                        }
                        return s;
                    };
                    Step.prototype = new Object();
                    Step.prototype.constructor = Step;
                    Step.superclass = Object.prototype;
                    function Step(axis, nodetest, preds) {
                        if (arguments.length > 0) {
                            this.init(axis, nodetest, preds);
                        }
                    }
                    Step.prototype.init = function (axis, nodetest, preds) {
                        this.axis = axis;
                        this.nodeTest = nodetest;
                        this.predicates = preds;
                    };
                    Step.prototype.toString = function () {
                        var s;
                        switch (this.axis) {
                            case Step.ANCESTOR:
                                s = "ancestor";
                                break;
                            case Step.ANCESTORORSELF:
                                s = "ancestor-or-self";
                                break;
                            case Step.ATTRIBUTE:
                                s = "attribute";
                                break;
                            case Step.CHILD:
                                s = "child";
                                break;
                            case Step.DESCENDANT:
                                s = "descendant";
                                break;
                            case Step.DESCENDANTORSELF:
                                s = "descendant-or-self";
                                break;
                            case Step.FOLLOWING:
                                s = "following";
                                break;
                            case Step.FOLLOWINGSIBLING:
                                s = "following-sibling";
                                break;
                            case Step.NAMESPACE:
                                s = "namespace";
                                break;
                            case Step.PARENT:
                                s = "parent";
                                break;
                            case Step.PRECEDING:
                                s = "preceding";
                                break;
                            case Step.PRECEDINGSIBLING:
                                s = "preceding-sibling";
                                break;
                            case Step.SELF:
                                s = "self";
                                break;
                        }
                        s += "::";
                        s += this.nodeTest.toString();
                        for (var i = 0; i < this.predicates.length; i++) {
                            s += "[" + this.predicates[i].toString() + "]";
                        }
                        return s;
                    };
                    Step.ANCESTOR = 0;
                    Step.ANCESTORORSELF = 1;
                    Step.ATTRIBUTE = 2;
                    Step.CHILD = 3;
                    Step.DESCENDANT = 4;
                    Step.DESCENDANTORSELF = 5;
                    Step.FOLLOWING = 6;
                    Step.FOLLOWINGSIBLING = 7;
                    Step.NAMESPACE = 8;
                    Step.PARENT = 9;
                    Step.PRECEDING = 10;
                    Step.PRECEDINGSIBLING = 11;
                    Step.SELF = 12;
                    NodeTest.prototype = new Object();
                    NodeTest.prototype.constructor = NodeTest;
                    NodeTest.superclass = Object.prototype;
                    function NodeTest(type, value) {
                        if (arguments.length > 0) {
                            this.init(type, value);
                        }
                    }
                    NodeTest.prototype.init = function (type, value) {
                        this.type = type;
                        this.value = value;
                    };
                    NodeTest.prototype.toString = function () {
                        switch (this.type) {
                            case NodeTest.NAMETESTANY:
                                return "*";
                            case NodeTest.NAMETESTPREFIXANY:
                                return this.value + ":*";
                            case NodeTest.NAMETESTRESOLVEDANY:
                                return "{" + this.value + "}*";
                            case NodeTest.NAMETESTQNAME:
                                return this.value;
                            case NodeTest.NAMETESTRESOLVEDNAME:
                                return "{" + this.namespaceURI + "}" + this.value;
                            case NodeTest.COMMENT:
                                return "comment()";
                            case NodeTest.TEXT:
                                return "text()";
                            case NodeTest.PI:
                                if (this.value != undefined) {
                                    return "processing-instruction(\"" + this.value + "\")";
                                }
                                return "processing-instruction()";
                            case NodeTest.NODE:
                                return "node()";
                        }
                        return "<unknown nodetest type>";
                    };
                    NodeTest.prototype.matches = function (n, xpc) {
                        var nType = n.nodeType;
                        switch (this.type) {
                            case NodeTest.NAMETESTANY:
                                if (nType === 2
                                    || nType === 1
                                    || nType === XPathNamespace.XPATH_NAMESPACE_NODE) {
                                    return true;
                                }
                                return false;
                            case NodeTest.NAMETESTPREFIXANY:
                                if (nType === 2 || nType === 1) {
                                    var ns = xpc.namespaceResolver.getNamespace(this.value, xpc.expressionContextNode);
                                    if (ns == null) {
                                        throw new Error("Cannot resolve QName " + this.value);
                                    }
                                    return ns === (n.namespaceURI || '');
                                }
                                return false;
                            case NodeTest.NAMETESTQNAME:
                                if (nType === 2
                                    || nType === 1
                                    || nType === XPathNamespace.XPATH_NAMESPACE_NODE) {
                                    var test = Utilities.resolveQName(this.value, xpc.namespaceResolver, xpc.expressionContextNode, false);
                                    if (test[0] == null) {
                                        throw new Error("Cannot resolve QName " + this.value);
                                    }
                                    test[0] = String(test[0]) || null;
                                    test[1] = String(test[1]);
                                    var node = [
                                        String(n.namespaceURI || '') || null,
                                        String(n.localName || n.nodeName)
                                    ];
                                    if (xpc.caseInsensitive) {
                                        return test[0] === node[0] && test[1].toLowerCase() === node[1].toLowerCase();
                                    }
                                    return test[0] === node[0] && test[1] === node[1];
                                }
                                return false;
                            case NodeTest.COMMENT:
                                return nType === 8;
                            case NodeTest.TEXT:
                                return nType === 3 || nType == 4;
                            case NodeTest.PI:
                                return nType === 7
                                    && (this.value == null || n.nodeName == this.value);
                            case NodeTest.NODE:
                                return nType === 9
                                    || nType === 1
                                    || nType === 2
                                    || nType === 3
                                    || nType === 4
                                    || nType === 8
                                    || nType === 7;
                        }
                        return false;
                    };
                    NodeTest.NAMETESTANY = 0;
                    NodeTest.NAMETESTPREFIXANY = 1;
                    NodeTest.NAMETESTQNAME = 2;
                    NodeTest.COMMENT = 3;
                    NodeTest.TEXT = 4;
                    NodeTest.PI = 5;
                    NodeTest.NODE = 6;
                    VariableReference.prototype = new Expression();
                    VariableReference.prototype.constructor = VariableReference;
                    VariableReference.superclass = Expression.prototype;
                    function VariableReference(v) {
                        if (arguments.length > 0) {
                            this.init(v);
                        }
                    }
                    VariableReference.prototype.init = function (v) {
                        this.variable = v;
                    };
                    VariableReference.prototype.toString = function () {
                        return "$" + this.variable;
                    };
                    VariableReference.prototype.evaluate = function (c) {
                        var parts = Utilities.resolveQName(this.variable, c.namespaceResolver, c.contextNode, false);
                        if (parts[0] == null) {
                            throw new Error("Cannot resolve QName " + fn);
                        }
                        var result = c.variableResolver.getVariable(parts[1], parts[0]);
                        if (!result) {
                            throw XPathException.fromMessage("Undeclared variable: " + this.toString());
                        }
                        return result;
                    };
                    FunctionCall.prototype = new Expression();
                    FunctionCall.prototype.constructor = FunctionCall;
                    FunctionCall.superclass = Expression.prototype;
                    function FunctionCall(fn, args) {
                        if (arguments.length > 0) {
                            this.init(fn, args);
                        }
                    }
                    FunctionCall.prototype.init = function (fn, args) {
                        this.functionName = fn;
                        this.arguments = args;
                    };
                    FunctionCall.prototype.toString = function () {
                        var s = this.functionName + "(";
                        for (var i = 0; i < this.arguments.length; i++) {
                            if (i > 0) {
                                s += ", ";
                            }
                            s += this.arguments[i].toString();
                        }
                        return s + ")";
                    };
                    FunctionCall.prototype.evaluate = function (c) {
                        var f = FunctionResolver.getFunctionFromContext(this.functionName, c);
                        if (!f) {
                            throw new Error("Unknown function " + this.functionName);
                        }
                        var a = [c].concat(this.arguments);
                        return f.apply(c.functionResolver.thisArg, a);
                    };
                    XString.prototype = new Expression();
                    XString.prototype.constructor = XString;
                    XString.superclass = Expression.prototype;
                    function XString(s) {
                        if (arguments.length > 0) {
                            this.init(s);
                        }
                    }
                    XString.prototype.init = function (s) {
                        this.str = String(s);
                    };
                    XString.prototype.toString = function () {
                        return this.str;
                    };
                    XString.prototype.evaluate = function (c) {
                        return this;
                    };
                    XString.prototype.string = function () {
                        return this;
                    };
                    XString.prototype.number = function () {
                        return new XNumber(this.str);
                    };
                    XString.prototype.bool = function () {
                        return new XBoolean(this.str);
                    };
                    XString.prototype.nodeset = function () {
                        throw new Error("Cannot convert string to nodeset");
                    };
                    XString.prototype.stringValue = function () {
                        return this.str;
                    };
                    XString.prototype.numberValue = function () {
                        return this.number().numberValue();
                    };
                    XString.prototype.booleanValue = function () {
                        return this.bool().booleanValue();
                    };
                    XString.prototype.equals = function (r) {
                        if (Utilities.instance_of(r, XBoolean)) {
                            return this.bool().equals(r);
                        }
                        if (Utilities.instance_of(r, XNumber)) {
                            return this.number().equals(r);
                        }
                        if (Utilities.instance_of(r, XNodeSet)) {
                            return r.compareWithString(this, Operators.equals);
                        }
                        return new XBoolean(this.str == r.str);
                    };
                    XString.prototype.notequal = function (r) {
                        if (Utilities.instance_of(r, XBoolean)) {
                            return this.bool().notequal(r);
                        }
                        if (Utilities.instance_of(r, XNumber)) {
                            return this.number().notequal(r);
                        }
                        if (Utilities.instance_of(r, XNodeSet)) {
                            return r.compareWithString(this, Operators.notequal);
                        }
                        return new XBoolean(this.str != r.str);
                    };
                    XString.prototype.lessthan = function (r) {
                        if (Utilities.instance_of(r, XNodeSet)) {
                            return r.compareWithNumber(this.number(), Operators.greaterthanorequal);
                        }
                        return this.number().lessthan(r.number());
                    };
                    XString.prototype.greaterthan = function (r) {
                        if (Utilities.instance_of(r, XNodeSet)) {
                            return r.compareWithNumber(this.number(), Operators.lessthanorequal);
                        }
                        return this.number().greaterthan(r.number());
                    };
                    XString.prototype.lessthanorequal = function (r) {
                        if (Utilities.instance_of(r, XNodeSet)) {
                            return r.compareWithNumber(this.number(), Operators.greaterthan);
                        }
                        return this.number().lessthanorequal(r.number());
                    };
                    XString.prototype.greaterthanorequal = function (r) {
                        if (Utilities.instance_of(r, XNodeSet)) {
                            return r.compareWithNumber(this.number(), Operators.lessthan);
                        }
                        return this.number().greaterthanorequal(r.number());
                    };
                    XNumber.prototype = new Expression();
                    XNumber.prototype.constructor = XNumber;
                    XNumber.superclass = Expression.prototype;
                    function XNumber(n) {
                        if (arguments.length > 0) {
                            this.init(n);
                        }
                    }
                    XNumber.prototype.init = function (n) {
                        this.num = typeof n === "string" ? this.parse(n) : Number(n);
                    };
                    XNumber.prototype.numberFormat = /^\s*-?[0-9]*\.?[0-9]+\s*$/;
                    XNumber.prototype.parse = function (s) {
                        return this.numberFormat.test(s) ? parseFloat(s) : Number.NaN;
                    };
                    XNumber.prototype.toString = function () {
                        return this.num;
                    };
                    XNumber.prototype.evaluate = function (c) {
                        return this;
                    };
                    XNumber.prototype.string = function () {
                        return new XString(this.num);
                    };
                    XNumber.prototype.number = function () {
                        return this;
                    };
                    XNumber.prototype.bool = function () {
                        return new XBoolean(this.num);
                    };
                    XNumber.prototype.nodeset = function () {
                        throw new Error("Cannot convert number to nodeset");
                    };
                    XNumber.prototype.stringValue = function () {
                        return this.string().stringValue();
                    };
                    XNumber.prototype.numberValue = function () {
                        return this.num;
                    };
                    XNumber.prototype.booleanValue = function () {
                        return this.bool().booleanValue();
                    };
                    XNumber.prototype.negate = function () {
                        return new XNumber(-this.num);
                    };
                    XNumber.prototype.equals = function (r) {
                        if (Utilities.instance_of(r, XBoolean)) {
                            return this.bool().equals(r);
                        }
                        if (Utilities.instance_of(r, XString)) {
                            return this.equals(r.number());
                        }
                        if (Utilities.instance_of(r, XNodeSet)) {
                            return r.compareWithNumber(this, Operators.equals);
                        }
                        return new XBoolean(this.num == r.num);
                    };
                    XNumber.prototype.notequal = function (r) {
                        if (Utilities.instance_of(r, XBoolean)) {
                            return this.bool().notequal(r);
                        }
                        if (Utilities.instance_of(r, XString)) {
                            return this.notequal(r.number());
                        }
                        if (Utilities.instance_of(r, XNodeSet)) {
                            return r.compareWithNumber(this, Operators.notequal);
                        }
                        return new XBoolean(this.num != r.num);
                    };
                    XNumber.prototype.lessthan = function (r) {
                        if (Utilities.instance_of(r, XNodeSet)) {
                            return r.compareWithNumber(this, Operators.greaterthanorequal);
                        }
                        if (Utilities.instance_of(r, XBoolean) || Utilities.instance_of(r, XString)) {
                            return this.lessthan(r.number());
                        }
                        return new XBoolean(this.num < r.num);
                    };
                    XNumber.prototype.greaterthan = function (r) {
                        if (Utilities.instance_of(r, XNodeSet)) {
                            return r.compareWithNumber(this, Operators.lessthanorequal);
                        }
                        if (Utilities.instance_of(r, XBoolean) || Utilities.instance_of(r, XString)) {
                            return this.greaterthan(r.number());
                        }
                        return new XBoolean(this.num > r.num);
                    };
                    XNumber.prototype.lessthanorequal = function (r) {
                        if (Utilities.instance_of(r, XNodeSet)) {
                            return r.compareWithNumber(this, Operators.greaterthan);
                        }
                        if (Utilities.instance_of(r, XBoolean) || Utilities.instance_of(r, XString)) {
                            return this.lessthanorequal(r.number());
                        }
                        return new XBoolean(this.num <= r.num);
                    };
                    XNumber.prototype.greaterthanorequal = function (r) {
                        if (Utilities.instance_of(r, XNodeSet)) {
                            return r.compareWithNumber(this, Operators.lessthan);
                        }
                        if (Utilities.instance_of(r, XBoolean) || Utilities.instance_of(r, XString)) {
                            return this.greaterthanorequal(r.number());
                        }
                        return new XBoolean(this.num >= r.num);
                    };
                    XNumber.prototype.plus = function (r) {
                        return new XNumber(this.num + r.num);
                    };
                    XNumber.prototype.minus = function (r) {
                        return new XNumber(this.num - r.num);
                    };
                    XNumber.prototype.multiply = function (r) {
                        return new XNumber(this.num * r.num);
                    };
                    XNumber.prototype.div = function (r) {
                        return new XNumber(this.num / r.num);
                    };
                    XNumber.prototype.mod = function (r) {
                        return new XNumber(this.num % r.num);
                    };
                    XBoolean.prototype = new Expression();
                    XBoolean.prototype.constructor = XBoolean;
                    XBoolean.superclass = Expression.prototype;
                    function XBoolean(b) {
                        if (arguments.length > 0) {
                            this.init(b);
                        }
                    }
                    XBoolean.prototype.init = function (b) {
                        this.b = Boolean(b);
                    };
                    XBoolean.prototype.toString = function () {
                        return this.b.toString();
                    };
                    XBoolean.prototype.evaluate = function (c) {
                        return this;
                    };
                    XBoolean.prototype.string = function () {
                        return new XString(this.b);
                    };
                    XBoolean.prototype.number = function () {
                        return new XNumber(this.b);
                    };
                    XBoolean.prototype.bool = function () {
                        return this;
                    };
                    XBoolean.prototype.nodeset = function () {
                        throw new Error("Cannot convert boolean to nodeset");
                    };
                    XBoolean.prototype.stringValue = function () {
                        return this.string().stringValue();
                    };
                    XBoolean.prototype.numberValue = function () {
                        return this.num().numberValue();
                    };
                    XBoolean.prototype.booleanValue = function () {
                        return this.b;
                    };
                    XBoolean.prototype.not = function () {
                        return new XBoolean(!this.b);
                    };
                    XBoolean.prototype.equals = function (r) {
                        if (Utilities.instance_of(r, XString) || Utilities.instance_of(r, XNumber)) {
                            return this.equals(r.bool());
                        }
                        if (Utilities.instance_of(r, XNodeSet)) {
                            return r.compareWithBoolean(this, Operators.equals);
                        }
                        return new XBoolean(this.b == r.b);
                    };
                    XBoolean.prototype.notequal = function (r) {
                        if (Utilities.instance_of(r, XString) || Utilities.instance_of(r, XNumber)) {
                            return this.notequal(r.bool());
                        }
                        if (Utilities.instance_of(r, XNodeSet)) {
                            return r.compareWithBoolean(this, Operators.notequal);
                        }
                        return new XBoolean(this.b != r.b);
                    };
                    XBoolean.prototype.lessthan = function (r) {
                        if (Utilities.instance_of(r, XNodeSet)) {
                            return r.compareWithNumber(this.number(), Operators.greaterthanorequal);
                        }
                        return this.number().lessthan(r.number());
                    };
                    XBoolean.prototype.greaterthan = function (r) {
                        if (Utilities.instance_of(r, XNodeSet)) {
                            return r.compareWithNumber(this.number(), Operators.lessthanorequal);
                        }
                        return this.number().greaterthan(r.number());
                    };
                    XBoolean.prototype.lessthanorequal = function (r) {
                        if (Utilities.instance_of(r, XNodeSet)) {
                            return r.compareWithNumber(this.number(), Operators.greaterthan);
                        }
                        return this.number().lessthanorequal(r.number());
                    };
                    XBoolean.prototype.greaterthanorequal = function (r) {
                        if (Utilities.instance_of(r, XNodeSet)) {
                            return r.compareWithNumber(this.number(), Operators.lessthan);
                        }
                        return this.number().greaterthanorequal(r.number());
                    };
                    AVLTree.prototype = new Object();
                    AVLTree.prototype.constructor = AVLTree;
                    AVLTree.superclass = Object.prototype;
                    function AVLTree(n) {
                        this.init(n);
                    }
                    AVLTree.prototype.init = function (n) {
                        this.left = null;
                        this.right = null;
                        this.node = n;
                        this.depth = 1;
                    };
                    AVLTree.prototype.balance = function () {
                        var ldepth = this.left == null ? 0 : this.left.depth;
                        var rdepth = this.right == null ? 0 : this.right.depth;
                        if (ldepth > rdepth + 1) {
                            var lldepth = this.left.left == null ? 0 : this.left.left.depth;
                            var lrdepth = this.left.right == null ? 0 : this.left.right.depth;
                            if (lldepth < lrdepth) {
                                this.left.rotateRR();
                            }
                            this.rotateLL();
                        }
                        else if (ldepth + 1 < rdepth) {
                            var rrdepth = this.right.right == null ? 0 : this.right.right.depth;
                            var rldepth = this.right.left == null ? 0 : this.right.left.depth;
                            if (rldepth > rrdepth) {
                                this.right.rotateLL();
                            }
                            this.rotateRR();
                        }
                    };
                    AVLTree.prototype.rotateLL = function () {
                        var nodeBefore = this.node;
                        var rightBefore = this.right;
                        this.node = this.left.node;
                        this.right = this.left;
                        this.left = this.left.left;
                        this.right.left = this.right.right;
                        this.right.right = rightBefore;
                        this.right.node = nodeBefore;
                        this.right.updateInNewLocation();
                        this.updateInNewLocation();
                    };
                    AVLTree.prototype.rotateRR = function () {
                        var nodeBefore = this.node;
                        var leftBefore = this.left;
                        this.node = this.right.node;
                        this.left = this.right;
                        this.right = this.right.right;
                        this.left.right = this.left.left;
                        this.left.left = leftBefore;
                        this.left.node = nodeBefore;
                        this.left.updateInNewLocation();
                        this.updateInNewLocation();
                    };
                    AVLTree.prototype.updateInNewLocation = function () {
                        this.getDepthFromChildren();
                    };
                    AVLTree.prototype.getDepthFromChildren = function () {
                        this.depth = this.node == null ? 0 : 1;
                        if (this.left != null) {
                            this.depth = this.left.depth + 1;
                        }
                        if (this.right != null && this.depth <= this.right.depth) {
                            this.depth = this.right.depth + 1;
                        }
                    };
                    function nodeOrder(n1, n2) {
                        if (n1 === n2) {
                            return 0;
                        }
                        if (n1.compareDocumentPosition) {
                            var cpos = n1.compareDocumentPosition(n2);
                            if (cpos & 0x01) {
                                return 1;
                            }
                            if (cpos & 0x0A) {
                                return 1;
                            }
                            if (cpos & 0x14) {
                                return -1;
                            }
                            return 0;
                        }
                        var d1 = 0, d2 = 0;
                        for (var m1 = n1; m1 != null; m1 = m1.parentNode || m1.ownerElement) {
                            d1++;
                        }
                        for (var m2 = n2; m2 != null; m2 = m2.parentNode || m2.ownerElement) {
                            d2++;
                        }
                        if (d1 > d2) {
                            while (d1 > d2) {
                                n1 = n1.parentNode || n1.ownerElement;
                                d1--;
                            }
                            if (n1 === n2) {
                                return 1;
                            }
                        }
                        else if (d2 > d1) {
                            while (d2 > d1) {
                                n2 = n2.parentNode || n2.ownerElement;
                                d2--;
                            }
                            if (n1 === n2) {
                                return -1;
                            }
                        }
                        var n1Par = n1.parentNode || n1.ownerElement, n2Par = n2.parentNode || n2.ownerElement;
                        while (n1Par !== n2Par) {
                            n1 = n1Par;
                            n2 = n2Par;
                            n1Par = n1.parentNode || n1.ownerElement;
                            n2Par = n2.parentNode || n2.ownerElement;
                        }
                        var n1isAttr = Utilities.isAttribute(n1);
                        var n2isAttr = Utilities.isAttribute(n2);
                        if (n1isAttr && !n2isAttr) {
                            return -1;
                        }
                        if (!n1isAttr && n2isAttr) {
                            return 1;
                        }
                        if (n1Par) {
                            var cn = n1isAttr ? n1Par.attributes : n1Par.childNodes, len = cn.length;
                            for (var i = 0; i < len; i += 1) {
                                var n = cn[i];
                                if (n === n1) {
                                    return -1;
                                }
                                if (n === n2) {
                                    return 1;
                                }
                            }
                        }
                        throw new Error('Unexpected: could not determine node order');
                    }
                    AVLTree.prototype.add = function (n) {
                        if (n === this.node) {
                            return false;
                        }
                        var o = nodeOrder(n, this.node);
                        var ret = false;
                        if (o == -1) {
                            if (this.left == null) {
                                this.left = new AVLTree(n);
                                ret = true;
                            }
                            else {
                                ret = this.left.add(n);
                                if (ret) {
                                    this.balance();
                                }
                            }
                        }
                        else if (o == 1) {
                            if (this.right == null) {
                                this.right = new AVLTree(n);
                                ret = true;
                            }
                            else {
                                ret = this.right.add(n);
                                if (ret) {
                                    this.balance();
                                }
                            }
                        }
                        if (ret) {
                            this.getDepthFromChildren();
                        }
                        return ret;
                    };
                    XNodeSet.prototype = new Expression();
                    XNodeSet.prototype.constructor = XNodeSet;
                    XNodeSet.superclass = Expression.prototype;
                    function XNodeSet() {
                        this.init();
                    }
                    XNodeSet.prototype.init = function () {
                        this.tree = null;
                        this.nodes = [];
                        this.size = 0;
                    };
                    XNodeSet.prototype.toString = function () {
                        var p = this.first();
                        if (p == null) {
                            return "";
                        }
                        return this.stringForNode(p);
                    };
                    XNodeSet.prototype.evaluate = function (c) {
                        return this;
                    };
                    XNodeSet.prototype.string = function () {
                        return new XString(this.toString());
                    };
                    XNodeSet.prototype.stringValue = function () {
                        return this.toString();
                    };
                    XNodeSet.prototype.number = function () {
                        return new XNumber(this.string());
                    };
                    XNodeSet.prototype.numberValue = function () {
                        return Number(this.string());
                    };
                    XNodeSet.prototype.bool = function () {
                        return new XBoolean(this.booleanValue());
                    };
                    XNodeSet.prototype.booleanValue = function () {
                        return !!this.size;
                    };
                    XNodeSet.prototype.nodeset = function () {
                        return this;
                    };
                    XNodeSet.prototype.stringForNode = function (n) {
                        if (n.nodeType == 9 ||
                            n.nodeType == 1 ||
                            n.nodeType === 11) {
                            return this.stringForContainerNode(n);
                        }
                        if (n.nodeType === 2) {
                            return n.value || n.nodeValue;
                        }
                        if (n.isNamespaceNode) {
                            return n.namespace;
                        }
                        return n.nodeValue;
                    };
                    XNodeSet.prototype.stringForContainerNode = function (n) {
                        var s = "";
                        for (var n2 = n.firstChild; n2 != null; n2 = n2.nextSibling) {
                            var nt = n2.nodeType;
                            if (nt === 1 || nt === 3 || nt === 4 || nt === 9 || nt === 11) {
                                s += this.stringForNode(n2);
                            }
                        }
                        return s;
                    };
                    XNodeSet.prototype.buildTree = function () {
                        if (!this.tree && this.nodes.length) {
                            this.tree = new AVLTree(this.nodes[0]);
                            for (var i = 1; i < this.nodes.length; i += 1) {
                                this.tree.add(this.nodes[i]);
                            }
                        }
                        return this.tree;
                    };
                    XNodeSet.prototype.first = function () {
                        var p = this.buildTree();
                        if (p == null) {
                            return null;
                        }
                        while (p.left != null) {
                            p = p.left;
                        }
                        return p.node;
                    };
                    XNodeSet.prototype.add = function (n) {
                        for (var i = 0; i < this.nodes.length; i += 1) {
                            if (n === this.nodes[i]) {
                                return;
                            }
                        }
                        this.tree = null;
                        this.nodes.push(n);
                        this.size += 1;
                    };
                    XNodeSet.prototype.addArray = function (ns) {
                        for (var i = 0; i < ns.length; i += 1) {
                            this.add(ns[i]);
                        }
                    };
                    XNodeSet.prototype.toArray = function () {
                        var a = [];
                        this.toArrayRec(this.buildTree(), a);
                        return a;
                    };
                    XNodeSet.prototype.toArrayRec = function (t, a) {
                        if (t != null) {
                            this.toArrayRec(t.left, a);
                            a.push(t.node);
                            this.toArrayRec(t.right, a);
                        }
                    };
                    XNodeSet.prototype.toUnsortedArray = function () {
                        return this.nodes.slice();
                    };
                    XNodeSet.prototype.compareWithString = function (r, o) {
                        var a = this.toUnsortedArray();
                        for (var i = 0; i < a.length; i++) {
                            var n = a[i];
                            var l = new XString(this.stringForNode(n));
                            var res = o(l, r);
                            if (res.booleanValue()) {
                                return res;
                            }
                        }
                        return new XBoolean(false);
                    };
                    XNodeSet.prototype.compareWithNumber = function (r, o) {
                        var a = this.toUnsortedArray();
                        for (var i = 0; i < a.length; i++) {
                            var n = a[i];
                            var l = new XNumber(this.stringForNode(n));
                            var res = o(l, r);
                            if (res.booleanValue()) {
                                return res;
                            }
                        }
                        return new XBoolean(false);
                    };
                    XNodeSet.prototype.compareWithBoolean = function (r, o) {
                        return o(this.bool(), r);
                    };
                    XNodeSet.prototype.compareWithNodeSet = function (r, o) {
                        var a = this.toUnsortedArray();
                        for (var i = 0; i < a.length; i++) {
                            var n = a[i];
                            var l = new XString(this.stringForNode(n));
                            var b = r.toUnsortedArray();
                            for (var j = 0; j < b.length; j++) {
                                var n2 = b[j];
                                var r = new XString(this.stringForNode(n2));
                                var res = o(l, r);
                                if (res.booleanValue()) {
                                    return res;
                                }
                            }
                        }
                        return new XBoolean(false);
                    };
                    XNodeSet.prototype.equals = function (r) {
                        if (Utilities.instance_of(r, XString)) {
                            return this.compareWithString(r, Operators.equals);
                        }
                        if (Utilities.instance_of(r, XNumber)) {
                            return this.compareWithNumber(r, Operators.equals);
                        }
                        if (Utilities.instance_of(r, XBoolean)) {
                            return this.compareWithBoolean(r, Operators.equals);
                        }
                        return this.compareWithNodeSet(r, Operators.equals);
                    };
                    XNodeSet.prototype.notequal = function (r) {
                        if (Utilities.instance_of(r, XString)) {
                            return this.compareWithString(r, Operators.notequal);
                        }
                        if (Utilities.instance_of(r, XNumber)) {
                            return this.compareWithNumber(r, Operators.notequal);
                        }
                        if (Utilities.instance_of(r, XBoolean)) {
                            return this.compareWithBoolean(r, Operators.notequal);
                        }
                        return this.compareWithNodeSet(r, Operators.notequal);
                    };
                    XNodeSet.prototype.lessthan = function (r) {
                        if (Utilities.instance_of(r, XString)) {
                            return this.compareWithNumber(r.number(), Operators.lessthan);
                        }
                        if (Utilities.instance_of(r, XNumber)) {
                            return this.compareWithNumber(r, Operators.lessthan);
                        }
                        if (Utilities.instance_of(r, XBoolean)) {
                            return this.compareWithBoolean(r, Operators.lessthan);
                        }
                        return this.compareWithNodeSet(r, Operators.lessthan);
                    };
                    XNodeSet.prototype.greaterthan = function (r) {
                        if (Utilities.instance_of(r, XString)) {
                            return this.compareWithNumber(r.number(), Operators.greaterthan);
                        }
                        if (Utilities.instance_of(r, XNumber)) {
                            return this.compareWithNumber(r, Operators.greaterthan);
                        }
                        if (Utilities.instance_of(r, XBoolean)) {
                            return this.compareWithBoolean(r, Operators.greaterthan);
                        }
                        return this.compareWithNodeSet(r, Operators.greaterthan);
                    };
                    XNodeSet.prototype.lessthanorequal = function (r) {
                        if (Utilities.instance_of(r, XString)) {
                            return this.compareWithNumber(r.number(), Operators.lessthanorequal);
                        }
                        if (Utilities.instance_of(r, XNumber)) {
                            return this.compareWithNumber(r, Operators.lessthanorequal);
                        }
                        if (Utilities.instance_of(r, XBoolean)) {
                            return this.compareWithBoolean(r, Operators.lessthanorequal);
                        }
                        return this.compareWithNodeSet(r, Operators.lessthanorequal);
                    };
                    XNodeSet.prototype.greaterthanorequal = function (r) {
                        if (Utilities.instance_of(r, XString)) {
                            return this.compareWithNumber(r.number(), Operators.greaterthanorequal);
                        }
                        if (Utilities.instance_of(r, XNumber)) {
                            return this.compareWithNumber(r, Operators.greaterthanorequal);
                        }
                        if (Utilities.instance_of(r, XBoolean)) {
                            return this.compareWithBoolean(r, Operators.greaterthanorequal);
                        }
                        return this.compareWithNodeSet(r, Operators.greaterthanorequal);
                    };
                    XNodeSet.prototype.union = function (r) {
                        var ns = new XNodeSet();
                        ns.addArray(this.toUnsortedArray());
                        ns.addArray(r.toUnsortedArray());
                        return ns;
                    };
                    XPathNamespace.prototype = new Object();
                    XPathNamespace.prototype.constructor = XPathNamespace;
                    XPathNamespace.superclass = Object.prototype;
                    function XPathNamespace(pre, ns, p) {
                        this.isXPathNamespace = true;
                        this.ownerDocument = p.ownerDocument;
                        this.nodeName = "#namespace";
                        this.prefix = pre;
                        this.localName = pre;
                        this.namespaceURI = ns;
                        this.nodeValue = ns;
                        this.ownerElement = p;
                        this.nodeType = XPathNamespace.XPATH_NAMESPACE_NODE;
                    }
                    XPathNamespace.prototype.toString = function () {
                        return "{ \"" + this.prefix + "\", \"" + this.namespaceURI + "\" }";
                    };
                    var Operators = new Object();
                    Operators.equals = function (l, r) {
                        return l.equals(r);
                    };
                    Operators.notequal = function (l, r) {
                        return l.notequal(r);
                    };
                    Operators.lessthan = function (l, r) {
                        return l.lessthan(r);
                    };
                    Operators.greaterthan = function (l, r) {
                        return l.greaterthan(r);
                    };
                    Operators.lessthanorequal = function (l, r) {
                        return l.lessthanorequal(r);
                    };
                    Operators.greaterthanorequal = function (l, r) {
                        return l.greaterthanorequal(r);
                    };
                    XPathContext.prototype = new Object();
                    XPathContext.prototype.constructor = XPathContext;
                    XPathContext.superclass = Object.prototype;
                    function XPathContext(vr, nr, fr) {
                        this.variableResolver = vr != null ? vr : new VariableResolver();
                        this.namespaceResolver = nr != null ? nr : new NamespaceResolver();
                        this.functionResolver = fr != null ? fr : new FunctionResolver();
                    }
                    VariableResolver.prototype = new Object();
                    VariableResolver.prototype.constructor = VariableResolver;
                    VariableResolver.superclass = Object.prototype;
                    function VariableResolver() {
                    }
                    VariableResolver.prototype.getVariable = function (ln, ns) {
                        return null;
                    };
                    FunctionResolver.prototype = new Object();
                    FunctionResolver.prototype.constructor = FunctionResolver;
                    FunctionResolver.superclass = Object.prototype;
                    function FunctionResolver(thisArg) {
                        this.thisArg = thisArg != null ? thisArg : Functions;
                        this.functions = new Object();
                        this.addStandardFunctions();
                    }
                    FunctionResolver.prototype.addStandardFunctions = function () {
                        this.functions["{}last"] = Functions.last;
                        this.functions["{}position"] = Functions.position;
                        this.functions["{}count"] = Functions.count;
                        this.functions["{}id"] = Functions.id;
                        this.functions["{}local-name"] = Functions.localName;
                        this.functions["{}namespace-uri"] = Functions.namespaceURI;
                        this.functions["{}name"] = Functions.name;
                        this.functions["{}string"] = Functions.string;
                        this.functions["{}concat"] = Functions.concat;
                        this.functions["{}starts-with"] = Functions.startsWith;
                        this.functions["{}contains"] = Functions.contains;
                        this.functions["{}substring-before"] = Functions.substringBefore;
                        this.functions["{}substring-after"] = Functions.substringAfter;
                        this.functions["{}substring"] = Functions.substring;
                        this.functions["{}string-length"] = Functions.stringLength;
                        this.functions["{}normalize-space"] = Functions.normalizeSpace;
                        this.functions["{}translate"] = Functions.translate;
                        this.functions["{}boolean"] = Functions.boolean_;
                        this.functions["{}not"] = Functions.not;
                        this.functions["{}true"] = Functions.true_;
                        this.functions["{}false"] = Functions.false_;
                        this.functions["{}lang"] = Functions.lang;
                        this.functions["{}number"] = Functions.number;
                        this.functions["{}sum"] = Functions.sum;
                        this.functions["{}floor"] = Functions.floor;
                        this.functions["{}ceiling"] = Functions.ceiling;
                        this.functions["{}round"] = Functions.round;
                    };
                    FunctionResolver.prototype.addFunction = function (ns, ln, f) {
                        this.functions["{" + ns + "}" + ln] = f;
                    };
                    FunctionResolver.getFunctionFromContext = function (qName, context) {
                        var parts = Utilities.resolveQName(qName, context.namespaceResolver, context.contextNode, false);
                        if (parts[0] === null) {
                            throw new Error("Cannot resolve QName " + name);
                        }
                        return context.functionResolver.getFunction(parts[1], parts[0]);
                    };
                    FunctionResolver.prototype.getFunction = function (localName, namespace) {
                        return this.functions["{" + namespace + "}" + localName];
                    };
                    NamespaceResolver.prototype = new Object();
                    NamespaceResolver.prototype.constructor = NamespaceResolver;
                    NamespaceResolver.superclass = Object.prototype;
                    function NamespaceResolver() {
                    }
                    NamespaceResolver.prototype.getNamespace = function (prefix, n) {
                        if (prefix == "xml") {
                            return XPath.XML_NAMESPACE_URI;
                        }
                        else if (prefix == "xmlns") {
                            return XPath.XMLNS_NAMESPACE_URI;
                        }
                        if (n.nodeType == 9) {
                            n = n.documentElement;
                        }
                        else if (n.nodeType == 2) {
                            n = PathExpr.prototype.getOwnerElement(n);
                        }
                        else if (n.nodeType != 1) {
                            n = n.parentNode;
                        }
                        while (n != null && n.nodeType == 1) {
                            var nnm = n.attributes;
                            for (var i = 0; i < nnm.length; i++) {
                                var a = nnm.item(i);
                                var aname = a.name || a.nodeName;
                                if ((aname === "xmlns" && prefix === "")
                                    || aname === "xmlns:" + prefix) {
                                    return String(a.value || a.nodeValue);
                                }
                            }
                            n = n.parentNode;
                        }
                        return null;
                    };
                    var Functions = new Object();
                    Functions.last = function () {
                        var c = arguments[0];
                        if (arguments.length != 1) {
                            throw new Error("Function last expects ()");
                        }
                        return new XNumber(c.contextSize);
                    };
                    Functions.position = function () {
                        var c = arguments[0];
                        if (arguments.length != 1) {
                            throw new Error("Function position expects ()");
                        }
                        return new XNumber(c.contextPosition);
                    };
                    Functions.count = function () {
                        var c = arguments[0];
                        var ns;
                        if (arguments.length != 2 || !Utilities.instance_of(ns = arguments[1].evaluate(c), XNodeSet)) {
                            throw new Error("Function count expects (node-set)");
                        }
                        return new XNumber(ns.size);
                    };
                    Functions.id = function () {
                        var c = arguments[0];
                        var id;
                        if (arguments.length != 2) {
                            throw new Error("Function id expects (object)");
                        }
                        id = arguments[1].evaluate(c);
                        if (Utilities.instance_of(id, XNodeSet)) {
                            id = id.toArray().join(" ");
                        }
                        else {
                            id = id.stringValue();
                        }
                        var ids = id.split(/[\x0d\x0a\x09\x20]+/);
                        var count = 0;
                        var ns = new XNodeSet();
                        var doc = c.contextNode.nodeType == 9
                            ? c.contextNode
                            : c.contextNode.ownerDocument;
                        for (var i = 0; i < ids.length; i++) {
                            var n;
                            if (doc.getElementById) {
                                n = doc.getElementById(ids[i]);
                            }
                            else {
                                n = Utilities.getElementById(doc, ids[i]);
                            }
                            if (n != null) {
                                ns.add(n);
                                count++;
                            }
                        }
                        return ns;
                    };
                    Functions.localName = function () {
                        var c = arguments[0];
                        var n;
                        if (arguments.length == 1) {
                            n = c.contextNode;
                        }
                        else if (arguments.length == 2) {
                            n = arguments[1].evaluate(c).first();
                        }
                        else {
                            throw new Error("Function local-name expects (node-set?)");
                        }
                        if (n == null) {
                            return new XString("");
                        }
                        return new XString(n.localName ||
                            n.baseName ||
                            n.target ||
                            n.nodeName ||
                            "");
                    };
                    Functions.namespaceURI = function () {
                        var c = arguments[0];
                        var n;
                        if (arguments.length == 1) {
                            n = c.contextNode;
                        }
                        else if (arguments.length == 2) {
                            n = arguments[1].evaluate(c).first();
                        }
                        else {
                            throw new Error("Function namespace-uri expects (node-set?)");
                        }
                        if (n == null) {
                            return new XString("");
                        }
                        return new XString(n.namespaceURI);
                    };
                    Functions.name = function () {
                        var c = arguments[0];
                        var n;
                        if (arguments.length == 1) {
                            n = c.contextNode;
                        }
                        else if (arguments.length == 2) {
                            n = arguments[1].evaluate(c).first();
                        }
                        else {
                            throw new Error("Function name expects (node-set?)");
                        }
                        if (n == null) {
                            return new XString("");
                        }
                        if (n.nodeType == 1) {
                            return new XString(n.nodeName);
                        }
                        else if (n.nodeType == 2) {
                            return new XString(n.name || n.nodeName);
                        }
                        else if (n.nodeType === 7) {
                            return new XString(n.target || n.nodeName);
                        }
                        else if (n.localName == null) {
                            return new XString("");
                        }
                        else {
                            return new XString(n.localName);
                        }
                    };
                    Functions.string = function () {
                        var c = arguments[0];
                        if (arguments.length == 1) {
                            return new XString(XNodeSet.prototype.stringForNode(c.contextNode));
                        }
                        else if (arguments.length == 2) {
                            return arguments[1].evaluate(c).string();
                        }
                        throw new Error("Function string expects (object?)");
                    };
                    Functions.concat = function () {
                        var c = arguments[0];
                        if (arguments.length < 3) {
                            throw new Error("Function concat expects (string, string, string*)");
                        }
                        var s = "";
                        for (var i = 1; i < arguments.length; i++) {
                            s += arguments[i].evaluate(c).stringValue();
                        }
                        return new XString(s);
                    };
                    Functions.startsWith = function () {
                        var c = arguments[0];
                        if (arguments.length != 3) {
                            throw new Error("Function startsWith expects (string, string)");
                        }
                        var s1 = arguments[1].evaluate(c).stringValue();
                        var s2 = arguments[2].evaluate(c).stringValue();
                        return new XBoolean(s1.substring(0, s2.length) == s2);
                    };
                    Functions.contains = function () {
                        var c = arguments[0];
                        if (arguments.length != 3) {
                            throw new Error("Function contains expects (string, string)");
                        }
                        var s1 = arguments[1].evaluate(c).stringValue();
                        var s2 = arguments[2].evaluate(c).stringValue();
                        return new XBoolean(s1.indexOf(s2) !== -1);
                    };
                    Functions.substringBefore = function () {
                        var c = arguments[0];
                        if (arguments.length != 3) {
                            throw new Error("Function substring-before expects (string, string)");
                        }
                        var s1 = arguments[1].evaluate(c).stringValue();
                        var s2 = arguments[2].evaluate(c).stringValue();
                        return new XString(s1.substring(0, s1.indexOf(s2)));
                    };
                    Functions.substringAfter = function () {
                        var c = arguments[0];
                        if (arguments.length != 3) {
                            throw new Error("Function substring-after expects (string, string)");
                        }
                        var s1 = arguments[1].evaluate(c).stringValue();
                        var s2 = arguments[2].evaluate(c).stringValue();
                        if (s2.length == 0) {
                            return new XString(s1);
                        }
                        var i = s1.indexOf(s2);
                        if (i == -1) {
                            return new XString("");
                        }
                        return new XString(s1.substring(i + s2.length));
                    };
                    Functions.substring = function () {
                        var c = arguments[0];
                        if (!(arguments.length == 3 || arguments.length == 4)) {
                            throw new Error("Function substring expects (string, number, number?)");
                        }
                        var s = arguments[1].evaluate(c).stringValue();
                        var n1 = Math.round(arguments[2].evaluate(c).numberValue()) - 1;
                        var n2 = arguments.length == 4 ? n1 + Math.round(arguments[3].evaluate(c).numberValue()) : undefined;
                        return new XString(s.substring(n1, n2));
                    };
                    Functions.stringLength = function () {
                        var c = arguments[0];
                        var s;
                        if (arguments.length == 1) {
                            s = XNodeSet.prototype.stringForNode(c.contextNode);
                        }
                        else if (arguments.length == 2) {
                            s = arguments[1].evaluate(c).stringValue();
                        }
                        else {
                            throw new Error("Function string-length expects (string?)");
                        }
                        return new XNumber(s.length);
                    };
                    Functions.normalizeSpace = function () {
                        var c = arguments[0];
                        var s;
                        if (arguments.length == 1) {
                            s = XNodeSet.prototype.stringForNode(c.contextNode);
                        }
                        else if (arguments.length == 2) {
                            s = arguments[1].evaluate(c).stringValue();
                        }
                        else {
                            throw new Error("Function normalize-space expects (string?)");
                        }
                        var i = 0;
                        var j = s.length - 1;
                        while (Utilities.isSpace(s.charCodeAt(j))) {
                            j--;
                        }
                        var t = "";
                        while (i <= j && Utilities.isSpace(s.charCodeAt(i))) {
                            i++;
                        }
                        while (i <= j) {
                            if (Utilities.isSpace(s.charCodeAt(i))) {
                                t += " ";
                                while (i <= j && Utilities.isSpace(s.charCodeAt(i))) {
                                    i++;
                                }
                            }
                            else {
                                t += s.charAt(i);
                                i++;
                            }
                        }
                        return new XString(t);
                    };
                    Functions.translate = function () {
                        var c = arguments[0];
                        if (arguments.length != 4) {
                            throw new Error("Function translate expects (string, string, string)");
                        }
                        var s1 = arguments[1].evaluate(c).stringValue();
                        var s2 = arguments[2].evaluate(c).stringValue();
                        var s3 = arguments[3].evaluate(c).stringValue();
                        var map = [];
                        for (var i = 0; i < s2.length; i++) {
                            var j = s2.charCodeAt(i);
                            if (map[j] == undefined) {
                                var k = i > s3.length ? "" : s3.charAt(i);
                                map[j] = k;
                            }
                        }
                        var t = "";
                        for (var i = 0; i < s1.length; i++) {
                            var c = s1.charCodeAt(i);
                            var r = map[c];
                            if (r == undefined) {
                                t += s1.charAt(i);
                            }
                            else {
                                t += r;
                            }
                        }
                        return new XString(t);
                    };
                    Functions.boolean_ = function () {
                        var c = arguments[0];
                        if (arguments.length != 2) {
                            throw new Error("Function boolean expects (object)");
                        }
                        return arguments[1].evaluate(c).bool();
                    };
                    Functions.not = function () {
                        var c = arguments[0];
                        if (arguments.length != 2) {
                            throw new Error("Function not expects (object)");
                        }
                        return arguments[1].evaluate(c).bool().not();
                    };
                    Functions.true_ = function () {
                        if (arguments.length != 1) {
                            throw new Error("Function true expects ()");
                        }
                        return new XBoolean(true);
                    };
                    Functions.false_ = function () {
                        if (arguments.length != 1) {
                            throw new Error("Function false expects ()");
                        }
                        return new XBoolean(false);
                    };
                    Functions.lang = function () {
                        var c = arguments[0];
                        if (arguments.length != 2) {
                            throw new Error("Function lang expects (string)");
                        }
                        var lang;
                        for (var n = c.contextNode; n != null && n.nodeType != 9; n = n.parentNode) {
                            var a = n.getAttributeNS(XPath.XML_NAMESPACE_URI, "lang");
                            if (a != null) {
                                lang = String(a);
                                break;
                            }
                        }
                        if (lang == null) {
                            return new XBoolean(false);
                        }
                        var s = arguments[1].evaluate(c).stringValue();
                        return new XBoolean(lang.substring(0, s.length) == s
                            && (lang.length == s.length || lang.charAt(s.length) == '-'));
                    };
                    Functions.number = function () {
                        var c = arguments[0];
                        if (!(arguments.length == 1 || arguments.length == 2)) {
                            throw new Error("Function number expects (object?)");
                        }
                        if (arguments.length == 1) {
                            return new XNumber(XNodeSet.prototype.stringForNode(c.contextNode));
                        }
                        return arguments[1].evaluate(c).number();
                    };
                    Functions.sum = function () {
                        var c = arguments[0];
                        var ns;
                        if (arguments.length != 2 || !Utilities.instance_of((ns = arguments[1].evaluate(c)), XNodeSet)) {
                            throw new Error("Function sum expects (node-set)");
                        }
                        ns = ns.toUnsortedArray();
                        var n = 0;
                        for (var i = 0; i < ns.length; i++) {
                            n += new XNumber(XNodeSet.prototype.stringForNode(ns[i])).numberValue();
                        }
                        return new XNumber(n);
                    };
                    Functions.floor = function () {
                        var c = arguments[0];
                        if (arguments.length != 2) {
                            throw new Error("Function floor expects (number)");
                        }
                        return new XNumber(Math.floor(arguments[1].evaluate(c).numberValue()));
                    };
                    Functions.ceiling = function () {
                        var c = arguments[0];
                        if (arguments.length != 2) {
                            throw new Error("Function ceiling expects (number)");
                        }
                        return new XNumber(Math.ceil(arguments[1].evaluate(c).numberValue()));
                    };
                    Functions.round = function () {
                        var c = arguments[0];
                        if (arguments.length != 2) {
                            throw new Error("Function round expects (number)");
                        }
                        return new XNumber(Math.round(arguments[1].evaluate(c).numberValue()));
                    };
                    var Utilities = new Object();
                    Utilities.isAttribute = function (val) {
                        return val && (val.nodeType === 2 || val.ownerElement);
                    };
                    Utilities.splitQName = function (qn) {
                        var i = qn.indexOf(":");
                        if (i == -1) {
                            return [null, qn];
                        }
                        return [qn.substring(0, i), qn.substring(i + 1)];
                    };
                    Utilities.resolveQName = function (qn, nr, n, useDefault) {
                        var parts = Utilities.splitQName(qn);
                        if (parts[0] != null) {
                            parts[0] = nr.getNamespace(parts[0], n);
                        }
                        else {
                            if (useDefault) {
                                parts[0] = nr.getNamespace("", n);
                                if (parts[0] == null) {
                                    parts[0] = "";
                                }
                            }
                            else {
                                parts[0] = "";
                            }
                        }
                        return parts;
                    };
                    Utilities.isSpace = function (c) {
                        return c == 0x9 || c == 0xd || c == 0xa || c == 0x20;
                    };
                    Utilities.isLetter = function (c) {
                        return c >= 0x0041 && c <= 0x005A ||
                            c >= 0x0061 && c <= 0x007A ||
                            c >= 0x00C0 && c <= 0x00D6 ||
                            c >= 0x00D8 && c <= 0x00F6 ||
                            c >= 0x00F8 && c <= 0x00FF ||
                            c >= 0x0100 && c <= 0x0131 ||
                            c >= 0x0134 && c <= 0x013E ||
                            c >= 0x0141 && c <= 0x0148 ||
                            c >= 0x014A && c <= 0x017E ||
                            c >= 0x0180 && c <= 0x01C3 ||
                            c >= 0x01CD && c <= 0x01F0 ||
                            c >= 0x01F4 && c <= 0x01F5 ||
                            c >= 0x01FA && c <= 0x0217 ||
                            c >= 0x0250 && c <= 0x02A8 ||
                            c >= 0x02BB && c <= 0x02C1 ||
                            c == 0x0386 ||
                            c >= 0x0388 && c <= 0x038A ||
                            c == 0x038C ||
                            c >= 0x038E && c <= 0x03A1 ||
                            c >= 0x03A3 && c <= 0x03CE ||
                            c >= 0x03D0 && c <= 0x03D6 ||
                            c == 0x03DA ||
                            c == 0x03DC ||
                            c == 0x03DE ||
                            c == 0x03E0 ||
                            c >= 0x03E2 && c <= 0x03F3 ||
                            c >= 0x0401 && c <= 0x040C ||
                            c >= 0x040E && c <= 0x044F ||
                            c >= 0x0451 && c <= 0x045C ||
                            c >= 0x045E && c <= 0x0481 ||
                            c >= 0x0490 && c <= 0x04C4 ||
                            c >= 0x04C7 && c <= 0x04C8 ||
                            c >= 0x04CB && c <= 0x04CC ||
                            c >= 0x04D0 && c <= 0x04EB ||
                            c >= 0x04EE && c <= 0x04F5 ||
                            c >= 0x04F8 && c <= 0x04F9 ||
                            c >= 0x0531 && c <= 0x0556 ||
                            c == 0x0559 ||
                            c >= 0x0561 && c <= 0x0586 ||
                            c >= 0x05D0 && c <= 0x05EA ||
                            c >= 0x05F0 && c <= 0x05F2 ||
                            c >= 0x0621 && c <= 0x063A ||
                            c >= 0x0641 && c <= 0x064A ||
                            c >= 0x0671 && c <= 0x06B7 ||
                            c >= 0x06BA && c <= 0x06BE ||
                            c >= 0x06C0 && c <= 0x06CE ||
                            c >= 0x06D0 && c <= 0x06D3 ||
                            c == 0x06D5 ||
                            c >= 0x06E5 && c <= 0x06E6 ||
                            c >= 0x0905 && c <= 0x0939 ||
                            c == 0x093D ||
                            c >= 0x0958 && c <= 0x0961 ||
                            c >= 0x0985 && c <= 0x098C ||
                            c >= 0x098F && c <= 0x0990 ||
                            c >= 0x0993 && c <= 0x09A8 ||
                            c >= 0x09AA && c <= 0x09B0 ||
                            c == 0x09B2 ||
                            c >= 0x09B6 && c <= 0x09B9 ||
                            c >= 0x09DC && c <= 0x09DD ||
                            c >= 0x09DF && c <= 0x09E1 ||
                            c >= 0x09F0 && c <= 0x09F1 ||
                            c >= 0x0A05 && c <= 0x0A0A ||
                            c >= 0x0A0F && c <= 0x0A10 ||
                            c >= 0x0A13 && c <= 0x0A28 ||
                            c >= 0x0A2A && c <= 0x0A30 ||
                            c >= 0x0A32 && c <= 0x0A33 ||
                            c >= 0x0A35 && c <= 0x0A36 ||
                            c >= 0x0A38 && c <= 0x0A39 ||
                            c >= 0x0A59 && c <= 0x0A5C ||
                            c == 0x0A5E ||
                            c >= 0x0A72 && c <= 0x0A74 ||
                            c >= 0x0A85 && c <= 0x0A8B ||
                            c == 0x0A8D ||
                            c >= 0x0A8F && c <= 0x0A91 ||
                            c >= 0x0A93 && c <= 0x0AA8 ||
                            c >= 0x0AAA && c <= 0x0AB0 ||
                            c >= 0x0AB2 && c <= 0x0AB3 ||
                            c >= 0x0AB5 && c <= 0x0AB9 ||
                            c == 0x0ABD ||
                            c == 0x0AE0 ||
                            c >= 0x0B05 && c <= 0x0B0C ||
                            c >= 0x0B0F && c <= 0x0B10 ||
                            c >= 0x0B13 && c <= 0x0B28 ||
                            c >= 0x0B2A && c <= 0x0B30 ||
                            c >= 0x0B32 && c <= 0x0B33 ||
                            c >= 0x0B36 && c <= 0x0B39 ||
                            c == 0x0B3D ||
                            c >= 0x0B5C && c <= 0x0B5D ||
                            c >= 0x0B5F && c <= 0x0B61 ||
                            c >= 0x0B85 && c <= 0x0B8A ||
                            c >= 0x0B8E && c <= 0x0B90 ||
                            c >= 0x0B92 && c <= 0x0B95 ||
                            c >= 0x0B99 && c <= 0x0B9A ||
                            c == 0x0B9C ||
                            c >= 0x0B9E && c <= 0x0B9F ||
                            c >= 0x0BA3 && c <= 0x0BA4 ||
                            c >= 0x0BA8 && c <= 0x0BAA ||
                            c >= 0x0BAE && c <= 0x0BB5 ||
                            c >= 0x0BB7 && c <= 0x0BB9 ||
                            c >= 0x0C05 && c <= 0x0C0C ||
                            c >= 0x0C0E && c <= 0x0C10 ||
                            c >= 0x0C12 && c <= 0x0C28 ||
                            c >= 0x0C2A && c <= 0x0C33 ||
                            c >= 0x0C35 && c <= 0x0C39 ||
                            c >= 0x0C60 && c <= 0x0C61 ||
                            c >= 0x0C85 && c <= 0x0C8C ||
                            c >= 0x0C8E && c <= 0x0C90 ||
                            c >= 0x0C92 && c <= 0x0CA8 ||
                            c >= 0x0CAA && c <= 0x0CB3 ||
                            c >= 0x0CB5 && c <= 0x0CB9 ||
                            c == 0x0CDE ||
                            c >= 0x0CE0 && c <= 0x0CE1 ||
                            c >= 0x0D05 && c <= 0x0D0C ||
                            c >= 0x0D0E && c <= 0x0D10 ||
                            c >= 0x0D12 && c <= 0x0D28 ||
                            c >= 0x0D2A && c <= 0x0D39 ||
                            c >= 0x0D60 && c <= 0x0D61 ||
                            c >= 0x0E01 && c <= 0x0E2E ||
                            c == 0x0E30 ||
                            c >= 0x0E32 && c <= 0x0E33 ||
                            c >= 0x0E40 && c <= 0x0E45 ||
                            c >= 0x0E81 && c <= 0x0E82 ||
                            c == 0x0E84 ||
                            c >= 0x0E87 && c <= 0x0E88 ||
                            c == 0x0E8A ||
                            c == 0x0E8D ||
                            c >= 0x0E94 && c <= 0x0E97 ||
                            c >= 0x0E99 && c <= 0x0E9F ||
                            c >= 0x0EA1 && c <= 0x0EA3 ||
                            c == 0x0EA5 ||
                            c == 0x0EA7 ||
                            c >= 0x0EAA && c <= 0x0EAB ||
                            c >= 0x0EAD && c <= 0x0EAE ||
                            c == 0x0EB0 ||
                            c >= 0x0EB2 && c <= 0x0EB3 ||
                            c == 0x0EBD ||
                            c >= 0x0EC0 && c <= 0x0EC4 ||
                            c >= 0x0F40 && c <= 0x0F47 ||
                            c >= 0x0F49 && c <= 0x0F69 ||
                            c >= 0x10A0 && c <= 0x10C5 ||
                            c >= 0x10D0 && c <= 0x10F6 ||
                            c == 0x1100 ||
                            c >= 0x1102 && c <= 0x1103 ||
                            c >= 0x1105 && c <= 0x1107 ||
                            c == 0x1109 ||
                            c >= 0x110B && c <= 0x110C ||
                            c >= 0x110E && c <= 0x1112 ||
                            c == 0x113C ||
                            c == 0x113E ||
                            c == 0x1140 ||
                            c == 0x114C ||
                            c == 0x114E ||
                            c == 0x1150 ||
                            c >= 0x1154 && c <= 0x1155 ||
                            c == 0x1159 ||
                            c >= 0x115F && c <= 0x1161 ||
                            c == 0x1163 ||
                            c == 0x1165 ||
                            c == 0x1167 ||
                            c == 0x1169 ||
                            c >= 0x116D && c <= 0x116E ||
                            c >= 0x1172 && c <= 0x1173 ||
                            c == 0x1175 ||
                            c == 0x119E ||
                            c == 0x11A8 ||
                            c == 0x11AB ||
                            c >= 0x11AE && c <= 0x11AF ||
                            c >= 0x11B7 && c <= 0x11B8 ||
                            c == 0x11BA ||
                            c >= 0x11BC && c <= 0x11C2 ||
                            c == 0x11EB ||
                            c == 0x11F0 ||
                            c == 0x11F9 ||
                            c >= 0x1E00 && c <= 0x1E9B ||
                            c >= 0x1EA0 && c <= 0x1EF9 ||
                            c >= 0x1F00 && c <= 0x1F15 ||
                            c >= 0x1F18 && c <= 0x1F1D ||
                            c >= 0x1F20 && c <= 0x1F45 ||
                            c >= 0x1F48 && c <= 0x1F4D ||
                            c >= 0x1F50 && c <= 0x1F57 ||
                            c == 0x1F59 ||
                            c == 0x1F5B ||
                            c == 0x1F5D ||
                            c >= 0x1F5F && c <= 0x1F7D ||
                            c >= 0x1F80 && c <= 0x1FB4 ||
                            c >= 0x1FB6 && c <= 0x1FBC ||
                            c == 0x1FBE ||
                            c >= 0x1FC2 && c <= 0x1FC4 ||
                            c >= 0x1FC6 && c <= 0x1FCC ||
                            c >= 0x1FD0 && c <= 0x1FD3 ||
                            c >= 0x1FD6 && c <= 0x1FDB ||
                            c >= 0x1FE0 && c <= 0x1FEC ||
                            c >= 0x1FF2 && c <= 0x1FF4 ||
                            c >= 0x1FF6 && c <= 0x1FFC ||
                            c == 0x2126 ||
                            c >= 0x212A && c <= 0x212B ||
                            c == 0x212E ||
                            c >= 0x2180 && c <= 0x2182 ||
                            c >= 0x3041 && c <= 0x3094 ||
                            c >= 0x30A1 && c <= 0x30FA ||
                            c >= 0x3105 && c <= 0x312C ||
                            c >= 0xAC00 && c <= 0xD7A3 ||
                            c >= 0x4E00 && c <= 0x9FA5 ||
                            c == 0x3007 ||
                            c >= 0x3021 && c <= 0x3029;
                    };
                    Utilities.isNCNameChar = function (c) {
                        return c >= 0x0030 && c <= 0x0039
                            || c >= 0x0660 && c <= 0x0669
                            || c >= 0x06F0 && c <= 0x06F9
                            || c >= 0x0966 && c <= 0x096F
                            || c >= 0x09E6 && c <= 0x09EF
                            || c >= 0x0A66 && c <= 0x0A6F
                            || c >= 0x0AE6 && c <= 0x0AEF
                            || c >= 0x0B66 && c <= 0x0B6F
                            || c >= 0x0BE7 && c <= 0x0BEF
                            || c >= 0x0C66 && c <= 0x0C6F
                            || c >= 0x0CE6 && c <= 0x0CEF
                            || c >= 0x0D66 && c <= 0x0D6F
                            || c >= 0x0E50 && c <= 0x0E59
                            || c >= 0x0ED0 && c <= 0x0ED9
                            || c >= 0x0F20 && c <= 0x0F29
                            || c == 0x002E
                            || c == 0x002D
                            || c == 0x005F
                            || Utilities.isLetter(c)
                            || c >= 0x0300 && c <= 0x0345
                            || c >= 0x0360 && c <= 0x0361
                            || c >= 0x0483 && c <= 0x0486
                            || c >= 0x0591 && c <= 0x05A1
                            || c >= 0x05A3 && c <= 0x05B9
                            || c >= 0x05BB && c <= 0x05BD
                            || c == 0x05BF
                            || c >= 0x05C1 && c <= 0x05C2
                            || c == 0x05C4
                            || c >= 0x064B && c <= 0x0652
                            || c == 0x0670
                            || c >= 0x06D6 && c <= 0x06DC
                            || c >= 0x06DD && c <= 0x06DF
                            || c >= 0x06E0 && c <= 0x06E4
                            || c >= 0x06E7 && c <= 0x06E8
                            || c >= 0x06EA && c <= 0x06ED
                            || c >= 0x0901 && c <= 0x0903
                            || c == 0x093C
                            || c >= 0x093E && c <= 0x094C
                            || c == 0x094D
                            || c >= 0x0951 && c <= 0x0954
                            || c >= 0x0962 && c <= 0x0963
                            || c >= 0x0981 && c <= 0x0983
                            || c == 0x09BC
                            || c == 0x09BE
                            || c == 0x09BF
                            || c >= 0x09C0 && c <= 0x09C4
                            || c >= 0x09C7 && c <= 0x09C8
                            || c >= 0x09CB && c <= 0x09CD
                            || c == 0x09D7
                            || c >= 0x09E2 && c <= 0x09E3
                            || c == 0x0A02
                            || c == 0x0A3C
                            || c == 0x0A3E
                            || c == 0x0A3F
                            || c >= 0x0A40 && c <= 0x0A42
                            || c >= 0x0A47 && c <= 0x0A48
                            || c >= 0x0A4B && c <= 0x0A4D
                            || c >= 0x0A70 && c <= 0x0A71
                            || c >= 0x0A81 && c <= 0x0A83
                            || c == 0x0ABC
                            || c >= 0x0ABE && c <= 0x0AC5
                            || c >= 0x0AC7 && c <= 0x0AC9
                            || c >= 0x0ACB && c <= 0x0ACD
                            || c >= 0x0B01 && c <= 0x0B03
                            || c == 0x0B3C
                            || c >= 0x0B3E && c <= 0x0B43
                            || c >= 0x0B47 && c <= 0x0B48
                            || c >= 0x0B4B && c <= 0x0B4D
                            || c >= 0x0B56 && c <= 0x0B57
                            || c >= 0x0B82 && c <= 0x0B83
                            || c >= 0x0BBE && c <= 0x0BC2
                            || c >= 0x0BC6 && c <= 0x0BC8
                            || c >= 0x0BCA && c <= 0x0BCD
                            || c == 0x0BD7
                            || c >= 0x0C01 && c <= 0x0C03
                            || c >= 0x0C3E && c <= 0x0C44
                            || c >= 0x0C46 && c <= 0x0C48
                            || c >= 0x0C4A && c <= 0x0C4D
                            || c >= 0x0C55 && c <= 0x0C56
                            || c >= 0x0C82 && c <= 0x0C83
                            || c >= 0x0CBE && c <= 0x0CC4
                            || c >= 0x0CC6 && c <= 0x0CC8
                            || c >= 0x0CCA && c <= 0x0CCD
                            || c >= 0x0CD5 && c <= 0x0CD6
                            || c >= 0x0D02 && c <= 0x0D03
                            || c >= 0x0D3E && c <= 0x0D43
                            || c >= 0x0D46 && c <= 0x0D48
                            || c >= 0x0D4A && c <= 0x0D4D
                            || c == 0x0D57
                            || c == 0x0E31
                            || c >= 0x0E34 && c <= 0x0E3A
                            || c >= 0x0E47 && c <= 0x0E4E
                            || c == 0x0EB1
                            || c >= 0x0EB4 && c <= 0x0EB9
                            || c >= 0x0EBB && c <= 0x0EBC
                            || c >= 0x0EC8 && c <= 0x0ECD
                            || c >= 0x0F18 && c <= 0x0F19
                            || c == 0x0F35
                            || c == 0x0F37
                            || c == 0x0F39
                            || c == 0x0F3E
                            || c == 0x0F3F
                            || c >= 0x0F71 && c <= 0x0F84
                            || c >= 0x0F86 && c <= 0x0F8B
                            || c >= 0x0F90 && c <= 0x0F95
                            || c == 0x0F97
                            || c >= 0x0F99 && c <= 0x0FAD
                            || c >= 0x0FB1 && c <= 0x0FB7
                            || c == 0x0FB9
                            || c >= 0x20D0 && c <= 0x20DC
                            || c == 0x20E1
                            || c >= 0x302A && c <= 0x302F
                            || c == 0x3099
                            || c == 0x309A
                            || c == 0x00B7
                            || c == 0x02D0
                            || c == 0x02D1
                            || c == 0x0387
                            || c == 0x0640
                            || c == 0x0E46
                            || c == 0x0EC6
                            || c == 0x3005
                            || c >= 0x3031 && c <= 0x3035
                            || c >= 0x309D && c <= 0x309E
                            || c >= 0x30FC && c <= 0x30FE;
                    };
                    Utilities.coalesceText = function (n) {
                        for (var m = n.firstChild; m != null; m = m.nextSibling) {
                            if (m.nodeType == 3 || m.nodeType == 4) {
                                var s = m.nodeValue;
                                var first = m;
                                m = m.nextSibling;
                                while (m != null && (m.nodeType == 3 || m.nodeType == 4)) {
                                    s += m.nodeValue;
                                    var del = m;
                                    m = m.nextSibling;
                                    del.parentNode.removeChild(del);
                                }
                                if (first.nodeType == 4) {
                                    var p = first.parentNode;
                                    if (first.nextSibling == null) {
                                        p.removeChild(first);
                                        p.appendChild(p.ownerDocument.createTextNode(s));
                                    }
                                    else {
                                        var next = first.nextSibling;
                                        p.removeChild(first);
                                        p.insertBefore(p.ownerDocument.createTextNode(s), next);
                                    }
                                }
                                else {
                                    first.nodeValue = s;
                                }
                                if (m == null) {
                                    break;
                                }
                            }
                            else if (m.nodeType == 1) {
                                Utilities.coalesceText(m);
                            }
                        }
                    };
                    Utilities.instance_of = function (o, c) {
                        while (o != null) {
                            if (o.constructor === c) {
                                return true;
                            }
                            if (o === Object) {
                                return false;
                            }
                            o = o.constructor.superclass;
                        }
                        return false;
                    };
                    Utilities.getElementById = function (n, id) {
                        if (n.nodeType == 1) {
                            if (n.getAttribute("id") == id
                                || n.getAttributeNS(null, "id") == id) {
                                return n;
                            }
                        }
                        for (var m = n.firstChild; m != null; m = m.nextSibling) {
                            var res = Utilities.getElementById(m, id);
                            if (res != null) {
                                return res;
                            }
                        }
                        return null;
                    };
                    var XPathException = (function () {
                        function getMessage(code, exception) {
                            var msg = exception ? ": " + exception.toString() : "";
                            switch (code) {
                                case XPathException.INVALID_EXPRESSION_ERR:
                                    return "Invalid expression" + msg;
                                case XPathException.TYPE_ERR:
                                    return "Type error" + msg;
                            }
                            return null;
                        }
                        function XPathException(code, error, message) {
                            var err = Error.call(this, getMessage(code, error) || message);
                            err.code = code;
                            err.exception = error;
                            return err;
                        }
                        XPathException.prototype = Object.create(Error.prototype);
                        XPathException.prototype.constructor = XPathException;
                        XPathException.superclass = Error;
                        XPathException.prototype.toString = function () {
                            return this.message;
                        };
                        XPathException.fromMessage = function (message, error) {
                            return new XPathException(null, error, message);
                        };
                        XPathException.INVALID_EXPRESSION_ERR = 51;
                        XPathException.TYPE_ERR = 52;
                        return XPathException;
                    })();
                    XPathExpression.prototype = {};
                    XPathExpression.prototype.constructor = XPathExpression;
                    XPathExpression.superclass = Object.prototype;
                    function XPathExpression(e, r, p) {
                        this.xpath = p.parse(e);
                        this.context = new XPathContext();
                        this.context.namespaceResolver = new XPathNSResolverWrapper(r);
                    }
                    XPathExpression.prototype.evaluate = function (n, t, res) {
                        this.context.expressionContextNode = n;
                        var result = this.xpath.evaluate(this.context);
                        return new XPathResult(result, t);
                    };
                    XPathNSResolverWrapper.prototype = {};
                    XPathNSResolverWrapper.prototype.constructor = XPathNSResolverWrapper;
                    XPathNSResolverWrapper.superclass = Object.prototype;
                    function XPathNSResolverWrapper(r) {
                        this.xpathNSResolver = r;
                    }
                    XPathNSResolverWrapper.prototype.getNamespace = function (prefix, n) {
                        if (this.xpathNSResolver == null) {
                            return null;
                        }
                        return this.xpathNSResolver.lookupNamespaceURI(prefix);
                    };
                    NodeXPathNSResolver.prototype = {};
                    NodeXPathNSResolver.prototype.constructor = NodeXPathNSResolver;
                    NodeXPathNSResolver.superclass = Object.prototype;
                    function NodeXPathNSResolver(n) {
                        this.node = n;
                        this.namespaceResolver = new NamespaceResolver();
                    }
                    NodeXPathNSResolver.prototype.lookupNamespaceURI = function (prefix) {
                        return this.namespaceResolver.getNamespace(prefix, this.node);
                    };
                    XPathResult.prototype = {};
                    XPathResult.prototype.constructor = XPathResult;
                    XPathResult.superclass = Object.prototype;
                    function XPathResult(v, t) {
                        if (t == XPathResult.ANY_TYPE) {
                            if (v.constructor === XString) {
                                t = XPathResult.STRING_TYPE;
                            }
                            else if (v.constructor === XNumber) {
                                t = XPathResult.NUMBER_TYPE;
                            }
                            else if (v.constructor === XBoolean) {
                                t = XPathResult.BOOLEAN_TYPE;
                            }
                            else if (v.constructor === XNodeSet) {
                                t = XPathResult.UNORDERED_NODE_ITERATOR_TYPE;
                            }
                        }
                        this.resultType = t;
                        switch (t) {
                            case XPathResult.NUMBER_TYPE:
                                this.numberValue = v.numberValue();
                                return;
                            case XPathResult.STRING_TYPE:
                                this.stringValue = v.stringValue();
                                return;
                            case XPathResult.BOOLEAN_TYPE:
                                this.booleanValue = v.booleanValue();
                                return;
                            case XPathResult.ANY_UNORDERED_NODE_TYPE:
                            case XPathResult.FIRST_ORDERED_NODE_TYPE:
                                if (v.constructor === XNodeSet) {
                                    this.singleNodeValue = v.first();
                                    return;
                                }
                                break;
                            case XPathResult.UNORDERED_NODE_ITERATOR_TYPE:
                            case XPathResult.ORDERED_NODE_ITERATOR_TYPE:
                                if (v.constructor === XNodeSet) {
                                    this.invalidIteratorState = false;
                                    this.nodes = v.toArray();
                                    this.iteratorIndex = 0;
                                    return;
                                }
                                break;
                            case XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE:
                            case XPathResult.ORDERED_NODE_SNAPSHOT_TYPE:
                                if (v.constructor === XNodeSet) {
                                    this.nodes = v.toArray();
                                    this.snapshotLength = this.nodes.length;
                                    return;
                                }
                                break;
                        }
                        throw new XPathException(XPathException.TYPE_ERR);
                    }
                    ;
                    XPathResult.prototype.iterateNext = function () {
                        if (this.resultType != XPathResult.UNORDERED_NODE_ITERATOR_TYPE
                            && this.resultType != XPathResult.ORDERED_NODE_ITERATOR_TYPE) {
                            throw new XPathException(XPathException.TYPE_ERR);
                        }
                        return this.nodes[this.iteratorIndex++];
                    };
                    XPathResult.prototype.snapshotItem = function (i) {
                        if (this.resultType != XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE
                            && this.resultType != XPathResult.ORDERED_NODE_SNAPSHOT_TYPE) {
                            throw new XPathException(XPathException.TYPE_ERR);
                        }
                        return this.nodes[i];
                    };
                    XPathResult.ANY_TYPE = 0;
                    XPathResult.NUMBER_TYPE = 1;
                    XPathResult.STRING_TYPE = 2;
                    XPathResult.BOOLEAN_TYPE = 3;
                    XPathResult.UNORDERED_NODE_ITERATOR_TYPE = 4;
                    XPathResult.ORDERED_NODE_ITERATOR_TYPE = 5;
                    XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE = 6;
                    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE = 7;
                    XPathResult.ANY_UNORDERED_NODE_TYPE = 8;
                    XPathResult.FIRST_ORDERED_NODE_TYPE = 9;
                    function installDOM3XPathSupport(doc, p) {
                        doc.createExpression = function (e, r) {
                            try {
                                return new XPathExpression(e, r, p);
                            }
                            catch (e) {
                                throw new XPathException(XPathException.INVALID_EXPRESSION_ERR, e);
                            }
                        };
                        doc.createNSResolver = function (n) {
                            return new NodeXPathNSResolver(n);
                        };
                        doc.evaluate = function (e, cn, r, t, res) {
                            if (t < 0 || t > 9) {
                                throw { code: 0, toString: function () { return "Request type not supported"; } };
                            }
                            return doc.createExpression(e, r, p).evaluate(cn, t, res);
                        };
                    }
                    ;
                    try {
                        var shouldInstall = true;
                        try {
                            if (document.implementation
                                && document.implementation.hasFeature
                                && document.implementation.hasFeature("XPath", null)) {
                                shouldInstall = false;
                            }
                        }
                        catch (e) {
                        }
                        if (shouldInstall) {
                            installDOM3XPathSupport(document, new XPathParser());
                        }
                    }
                    catch (e) {
                    }
                    installDOM3XPathSupport(exports, new XPathParser());
                    (function () {
                        var parser = new XPathParser();
                        var defaultNSResolver = new NamespaceResolver();
                        var defaultFunctionResolver = new FunctionResolver();
                        var defaultVariableResolver = new VariableResolver();
                        function makeNSResolverFromFunction(func) {
                            return {
                                getNamespace: function (prefix, node) {
                                    var ns = func(prefix, node);
                                    return ns || defaultNSResolver.getNamespace(prefix, node);
                                }
                            };
                        }
                        function makeNSResolverFromObject(obj) {
                            return makeNSResolverFromFunction(obj.getNamespace.bind(obj));
                        }
                        function makeNSResolverFromMap(map) {
                            return makeNSResolverFromFunction(function (prefix) {
                                return map[prefix];
                            });
                        }
                        function makeNSResolver(resolver) {
                            if (resolver && typeof resolver.getNamespace === "function") {
                                return makeNSResolverFromObject(resolver);
                            }
                            if (typeof resolver === "function") {
                                return makeNSResolverFromFunction(resolver);
                            }
                            if (typeof resolver === "object") {
                                return makeNSResolverFromMap(resolver);
                            }
                            return defaultNSResolver;
                        }
                        function convertValue(value) {
                            if (value === null ||
                                typeof value === "undefined" ||
                                value instanceof XString ||
                                value instanceof XBoolean ||
                                value instanceof XNumber ||
                                value instanceof XNodeSet) {
                                return value;
                            }
                            switch (typeof value) {
                                case "string": return new XString(value);
                                case "boolean": return new XBoolean(value);
                                case "number": return new XNumber(value);
                            }
                            var ns = new XNodeSet();
                            ns.addArray([].concat(value));
                            return ns;
                        }
                        function makeEvaluator(func) {
                            return function (context) {
                                var args = Array.prototype.slice.call(arguments, 1).map(function (arg) {
                                    return arg.evaluate(context);
                                });
                                var result = func.apply(this, [].concat(context, args));
                                return convertValue(result);
                            };
                        }
                        function makeFunctionResolverFromFunction(func) {
                            return {
                                getFunction: function (name, namespace) {
                                    var found = func(name, namespace);
                                    if (found) {
                                        return makeEvaluator(found);
                                    }
                                    return defaultFunctionResolver.getFunction(name, namespace);
                                }
                            };
                        }
                        function makeFunctionResolverFromObject(obj) {
                            return makeFunctionResolverFromFunction(obj.getFunction.bind(obj));
                        }
                        function makeFunctionResolverFromMap(map) {
                            return makeFunctionResolverFromFunction(function (name) {
                                return map[name];
                            });
                        }
                        function makeFunctionResolver(resolver) {
                            if (resolver && typeof resolver.getFunction === "function") {
                                return makeFunctionResolverFromObject(resolver);
                            }
                            if (typeof resolver === "function") {
                                return makeFunctionResolverFromFunction(resolver);
                            }
                            if (typeof resolver === "object") {
                                return makeFunctionResolverFromMap(resolver);
                            }
                            return defaultFunctionResolver;
                        }
                        function makeVariableResolverFromFunction(func) {
                            return {
                                getVariable: function (name, namespace) {
                                    var value = func(name, namespace);
                                    return convertValue(value);
                                }
                            };
                        }
                        function makeVariableResolver(resolver) {
                            if (resolver) {
                                if (typeof resolver.getVariable === "function") {
                                    return makeVariableResolverFromFunction(resolver.getVariable.bind(resolver));
                                }
                                if (typeof resolver === "function") {
                                    return makeVariableResolverFromFunction(resolver);
                                }
                                if (typeof resolver === "object") {
                                    return makeVariableResolverFromFunction(function (name) {
                                        return resolver[name];
                                    });
                                }
                            }
                            return defaultVariableResolver;
                        }
                        function makeContext(options) {
                            var context = new XPathContext();
                            if (options) {
                                context.namespaceResolver = makeNSResolver(options.namespaces);
                                context.functionResolver = makeFunctionResolver(options.functions);
                                context.variableResolver = makeVariableResolver(options.variables);
                                context.expressionContextNode = options.node;
                            }
                            else {
                                context.namespaceResolver = defaultNSResolver;
                            }
                            return context;
                        }
                        function evaluate(parsedExpression, options) {
                            var context = makeContext(options);
                            return parsedExpression.evaluate(context);
                        }
                        var evaluatorPrototype = {
                            evaluate: function (options) {
                                return evaluate(this.expression, options);
                            },
                            evaluateNumber: function (options) {
                                return this.evaluate(options).numberValue();
                            },
                            evaluateString: function (options) {
                                return this.evaluate(options).stringValue();
                            },
                            evaluateBoolean: function (options) {
                                return this.evaluate(options).booleanValue();
                            },
                            evaluateNodeSet: function (options) {
                                return this.evaluate(options).nodeset();
                            },
                            select: function (options) {
                                return this.evaluateNodeSet(options).toArray();
                            },
                            select1: function (options) {
                                return this.select(options)[0];
                            }
                        };
                        function parse(xpath) {
                            var parsed = parser.parse(xpath);
                            return Object.create(evaluatorPrototype, {
                                expression: {
                                    value: parsed
                                }
                            });
                        }
                        exports.parse = parse;
                    })();
                    exports.XPath = XPath;
                    exports.XPathParser = XPathParser;
                    exports.XPathResult = XPathResult;
                    exports.Step = Step;
                    exports.NodeTest = NodeTest;
                    exports.BarOperation = BarOperation;
                    exports.NamespaceResolver = NamespaceResolver;
                    exports.FunctionResolver = FunctionResolver;
                    exports.VariableResolver = VariableResolver;
                    exports.Utilities = Utilities;
                    exports.XPathContext = XPathContext;
                    exports.XNodeSet = XNodeSet;
                    exports.XBoolean = XBoolean;
                    exports.XString = XString;
                    exports.XNumber = XNumber;
                    exports.select = function (e, doc, single) {
                        return exports.selectWithResolver(e, doc, null, single);
                    };
                    exports.useNamespaces = function (mappings) {
                        var resolver = {
                            mappings: mappings || {},
                            lookupNamespaceURI: function (prefix) {
                                return this.mappings[prefix];
                            }
                        };
                        return function (e, doc, single) {
                            return exports.selectWithResolver(e, doc, resolver, single);
                        };
                    };
                    exports.selectWithResolver = function (e, doc, resolver, single) {
                        var expression = new XPathExpression(e, resolver, new XPathParser());
                        var type = XPathResult.ANY_TYPE;
                        var result = expression.evaluate(doc, type, null);
                        if (result.resultType == XPathResult.STRING_TYPE) {
                            result = result.stringValue;
                        }
                        else if (result.resultType == XPathResult.NUMBER_TYPE) {
                            result = result.numberValue;
                        }
                        else if (result.resultType == XPathResult.BOOLEAN_TYPE) {
                            result = result.booleanValue;
                        }
                        else {
                            result = result.nodes;
                            if (single) {
                                result = result[0];
                            }
                        }
                        return result;
                    };
                    exports.select1 = function (e, doc) {
                        return exports.select(e, doc, true);
                    };
                })(xpath);
            }, {}], 36: [function (require, module, exports) {
                var axios = require('axios');
                var getTypeNamesFromCapabilities = require('./internal/getTypeNamesFromCapabilities');
                var clq_filter = require('./internal/cql_filter');
                var rp = function (options) {
                    var axiosOptions = {
                        'params': options.qs,
                        'headers': options.headers,
                        'responseType': 'text'
                    };
                    if (options.transform) {
                        axiosOptions.transformResponse = [options.transform];
                    }
                    return axios.get(options.uri, axiosOptions).then(function (response) {
                        return response.data;
                    });
                };
                var Client = function (apiKey, headers) {
                    if (typeof apiKey === 'undefined')
                        throw new Error('Required param: apiKey');
                    this.apiKey = apiKey;
                    this.headers = headers || {};
                };
                Client.prototype.getUrl = function () {
                    return 'http://wxs.ign.fr/' + this.apiKey + '/geoportail/wfs';
                };
                Client.prototype.getDefaultOptions = function () {
                    return {
                        uri: this.getUrl(),
                        qs: {
                            service: 'WFS',
                            version: '2.0.0'
                        },
                        headers: this.headers
                    };
                };
                Client.prototype.getTypeNames = function () {
                    var options = this.getDefaultOptions();
                    options.qs.request = 'GetCapabilities';
                    options.transform = function (body) {
                        return getTypeNamesFromCapabilities(body);
                    };
                    return rp(options);
                };
                Client.prototype.getFeatures = function (typeName, params) {
                    var params = params || {};
                    var options = this.getDefaultOptions();
                    options.qs.request = 'GetFeature';
                    options.qs.typename = typeName;
                    options.qs.outputFormat = 'application/json';
                    options.qs.srsName = 'CRS:84';
                    if (typeof params._limit !== 'undefined') {
                        options.qs.count = parseInt(params._limit);
                    }
                    if (typeof params._start !== 'undefined') {
                        options.qs.startIndex = parseInt(params._start);
                    }
                    options.transform = function (body) {
                        return JSON.parse(body);
                    };
                    var cql_filter = clq_filter(params);
                    if (cql_filter !== null) {
                        options.qs.cql_filter = cql_filter;
                    }
                    return rp(options);
                };
                module.exports = Client;
            }, { "./internal/cql_filter": 37, "./internal/getTypeNamesFromCapabilities": 38, "axios": 4 }], 37: [function (require, module, exports) {
                var WKT = require('terraformer-wkt-parser');
                var flip = require('@turf/flip');
                function parseBoundingBox(bbox) {
                    if (typeof bbox !== 'string') {
                        return bbox;
                    }
                    return bbox.replace(/'/g, '').split(',');
                }
                function bboxToFilter(bbox) {
                    bbox = parseBoundingBox(bbox);
                    var xmin = bbox[1];
                    var ymin = bbox[0];
                    var xmax = bbox[3];
                    var ymax = bbox[2];
                    return 'BBOX(the_geom,' + xmin + ',' + ymin + ',' + xmax + ',' + ymax + ')';
                }
                module.exports = function (params) {
                    var parts = [];
                    for (var name in params) {
                        if (name.charAt(0) === '_') {
                            continue;
                        }
                        if (name == 'bbox') {
                            parts.push(bboxToFilter(params['bbox']));
                        }
                        else if (name == 'geom') {
                            var geom = params[name];
                            if (typeof geom !== 'object') {
                                geom = JSON.parse(geom);
                            }
                            var wkt = WKT.convert(flip(geom));
                            parts.push('INTERSECTS(the_geom,' + wkt + ')');
                        }
                        else {
                            parts.push(name + '=\'' + params[name] + '\'');
                        }
                    }
                    if (parts.length === 0) {
                        return null;
                    }
                    return parts.join(' and ');
                };
            }, { "@turf/flip": 2, "terraformer-wkt-parser": 30 }], 38: [function (require, module, exports) {
                var xpath = require('xpath'), dom = require('xmldom').DOMParser;
                var getTypeNamesFromCapabilities = function (xml) {
                    var doc = new dom().parseFromString(xml);
                    var select = xpath.useNamespaces({ "wfs": "http://www.opengis.net/wfs/2.0" });
                    var featureTypeNodes = select("//wfs:Name/text()", doc);
                    var result = [];
                    featureTypeNodes.forEach(function (featureTypeNode) {
                        result.push(featureTypeNode.toString());
                    });
                    return result;
                };
                module.exports = getTypeNamesFromCapabilities;
            }, { "xmldom": 32, "xpath": 35 }] }, {}, [1])(1);
});
//# sourceMappingURL=geoportal-wfs-client.js.map