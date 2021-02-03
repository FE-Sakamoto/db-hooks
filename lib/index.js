"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.merge = exports.createDB = void 0;
var react_1 = require("react");
function createDB(initDB, initId) {
    var db = initDB;
    var allID = initId;
    var updaters = new Map();
    var index = 0;
    function useDB(tableName, id) {
        var _a = react_1.useState(db[tableName][id]), data = _a[0], setData = _a[1];
        function updater() {
            var newData = db[tableName][id];
            if (newData !== data) {
                setData(newData);
            }
        }
        react_1.useEffect(function () {
            allID[tableName][id] = allID[tableName][id] || 0;
            allID[tableName][id] += 1;
            var key = index++;
            updaters.set(key, updater);
            return function () {
                allID[tableName][id] -= 1;
                if (allID[tableName][id] === 0) {
                    delete db[tableName][id];
                }
                updaters.delete(key);
            };
        }, []);
        return data;
    }
    function updateDB(data) {
        merge(db, data);
        updaters.forEach(function (updater) { return updater(); });
    }
    function updateRow(tableName, id, data) {
        var _a, _b;
        return updateDB((_a = {},
            _a[tableName] = (_b = {},
                _b[id] = data,
                _b),
            _a));
    }
    return {
        useDB: useDB,
        updateDB: updateDB,
        updateRow: updateRow,
    };
}
exports.createDB = createDB;
function merge(target) {
    var arg = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        arg[_i - 1] = arguments[_i];
    }
    return arg.reduce(function (acc, cur) {
        return Object.keys(cur).reduce(function (subAcc, key) {
            var srcVal = cur[key];
            if (Array.isArray(srcVal)) {
                // series: []，下层数组直接赋值
                subAcc[key] = srcVal.map(function (item, idx) {
                    if (Object.prototype.toString.call(item) === '[object Object]') {
                        var curAccVal = subAcc[key] ? subAcc[key] : [];
                        return merge({}, curAccVal[idx] ? curAccVal[idx] : {}, item);
                    }
                    return item;
                });
            }
            else if (srcVal !== null && typeof srcVal === 'object') {
                subAcc[key] = merge({}, subAcc[key] ? subAcc[key] : {}, srcVal);
            }
            else {
                subAcc[key] = srcVal;
            }
            return subAcc;
        }, acc);
    }, target);
}
exports.merge = merge;
