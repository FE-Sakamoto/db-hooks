"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.merge = exports.createDB = void 0;
var react_1 = require("react");
var immer_1 = require("immer");
function createDB(initDB, initId) {
    var db = initDB;
    var allID = initId;
    var updaters = new Map();
    var index = 0;
    function useDB(tableName, id) {
        var _a = react_1.useState(db[tableName][id]), data = _a[0], setData = _a[1];
        react_1.useEffect(function () {
            // @ts-ignore
            allID[tableName][id] = allID[tableName][id] || 0;
            allID[tableName][id] += 1;
            var key = index++;
            updaters.set(key, [tableName, id, data, setData]);
            return function () {
                // @ts-ignore
                allID[tableName][id] -= 1;
                if (allID[tableName][id] === 0) {
                    delete db[tableName][id];
                }
                updaters.delete(key);
            };
        }, []);
        return data;
    }
    function snapshotDB(tableName, id) {
        return db[tableName][id];
    }
    function reRender() {
        updaters.forEach(function (updater) {
            var newData = db[updater[0]][updater[1]];
            if (newData !== updater[2]) {
                updater[3](newData);
            }
        });
    }
    function updateDB(dbData) {
        merge(db, dbData);
        reRender();
    }
    function editDB(edit) {
        db = immer_1.default(db, edit);
        reRender();
    }
    return {
        useDB: useDB,
        editDB: editDB,
        updateDB: updateDB,
        snapshotDB: snapshotDB,
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
