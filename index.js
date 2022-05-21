"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var axios_1 = require("axios");
var poller_1 = require("./poller");
var START_DATE = new Date().toDateString();
var END_DATE = new Date("5/25/2022").toDateString();
var today = new Date();
var Main = /** @class */ (function () {
    function Main(startDate, endDate) {
        this.API_ROUTE = "https://disneyland.disney.go.com/passes/blockout-dates/api/get-availability/?product-types=enchant-key-pass&destinationId=DLR&numMonths=3";
        this.startDate = startDate !== null && startDate !== void 0 ? startDate : new Date().toString();
        this.endDate =
            endDate !== null && endDate !== void 0 ? endDate : new Date(today.setDate(today.getDate() + 5)).toString(); // defaults to 5 days from today
        this.poller = new poller_1["default"](this.API_ROUTE, this.getHasAvailabilities.bind(this), // checkForTargetData
        this.genHandleAvailabilities.bind(this));
        this.init();
    }
    Main.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.poller.genPoll()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Main.prototype.genAvailableDates = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var availabilities, filteredDates;
            var _this = this;
            return __generator(this, function (_a) {
                availabilities = data["calendar-availabilities"];
                filteredDates = availabilities.filter(function (day) {
                    var date = day.date;
                    var calendarDate = new Date(replaceHyphensWithDash(date));
                    return (calendarDate > new Date(_this.startDate) &&
                        calendarDate <= new Date(_this.endDate));
                });
                return [2 /*return*/, filteredDates
                        .filter(function (day) {
                        var facilities = day.facilities;
                        return facilities.some(function (fac) {
                            return fac.available;
                        });
                    })
                        .map(function (_a) {
                        var date = _a.date;
                        return date;
                    })];
            });
        });
    };
    Main.prototype.genHandleAvailabilities = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var availableDates;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.genAvailableDates(data)];
                    case 1:
                        availableDates = _a.sent();
                        console.log({ availableDates: availableDates });
                        return [2 /*return*/];
                }
            });
        });
    };
    Main.prototype.getHasAvailabilities = function (data) {
        var _this = this;
        var availabilities = data["calendar-availabilities"];
        var filteredDates = availabilities.filter(function (day) {
            var date = day.date;
            var calendarDate = new Date(replaceHyphensWithDash(date));
            return (calendarDate > new Date(_this.startDate) &&
                calendarDate <= new Date(_this.endDate));
        });
        return filteredDates.some(function (day) {
            var facilities = day.facilities;
            return facilities.some(function (fac) {
                return fac.available;
            });
        });
    };
    return Main;
}());
function genCalendarAvailabilities() {
    return __awaiter(this, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, axios_1["default"].get("https://disneyland.disney.go.com/passes/blockout-dates/api/get-availability/?product-types=enchant-key-pass&destinationId=DLR&numMonths=3")];
                case 1:
                    data = (_a.sent()).data;
                    return [2 /*return*/, data];
            }
        });
    });
}
new Main(START_DATE, END_DATE);
// new Main<any>("6/1/2022", "6/12/2022");
// async function genCalendarAvailabilities() {
// 	const resp = await fetch(
// 		"https://disneyland.disney.go.com/passes/blockout-dates/api/get-availability/?product-types=enchant-key-pass&destinationId=DLR&numMonths=3",
// 		{
// 			headers: {
// 				"Content-Type": "application/json",
// 			},
// 		},
// 	);
// 	const final = await resp.json();
// 	return final;
// }
function replaceHyphensWithDash(date) {
    return date.replace(/-/gim, "/");
}
function findAvailabilitiesImpl(availabilities) {
    return __awaiter(this, void 0, void 0, function () {
        var out;
        return __generator(this, function (_a) {
            out = availabilities.filter(function (date) {
                var facilities = date.facilities;
                return facilities.some(function (facility) { return facility.available; });
            });
            return [2 /*return*/, out.map(function (val) { return val.date; })];
        });
    });
}
function findAvailabilitiesWithinDates(date1, date2) {
    return __awaiter(this, void 0, void 0, function () {
        var availabilities, calendarAvailabilities, startDate, endDate, filteredDates;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, genCalendarAvailabilities()];
                case 1:
                    availabilities = _a.sent();
                    calendarAvailabilities = availabilities["calendar-availabilities"];
                    startDate = new Date(replaceHyphensWithDash(date1));
                    endDate = new Date(replaceHyphensWithDash(date2));
                    filteredDates = calendarAvailabilities.filter(function (_a) {
                        var _date = _a.date;
                        var date = new Date(replaceHyphensWithDash(_date));
                        return date > startDate && date < endDate;
                    });
                    return [4 /*yield*/, findAvailabilitiesImpl(filteredDates)];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function findAvailabilities() {
    return __awaiter(this, void 0, void 0, function () {
        var dates, calendarAvailabilities, out;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, genCalendarAvailabilities()];
                case 1:
                    dates = _a.sent();
                    calendarAvailabilities = dates["calendar-availabilities"];
                    return [4 /*yield*/, findAvailabilitiesImpl(calendarAvailabilities)];
                case 2:
                    out = _a.sent();
                    console.log(out);
                    return [2 /*return*/, out];
            }
        });
    });
}
function hasTarget(dates, targetDate) {
    return dates.find(function (date) {
        return (new Date(replaceHyphensWithDash(date)).toString() ==
            new Date(replaceHyphensWithDash(targetDate)).toString());
    });
}
var MAX_PROCESS = 10000;
function process(targetDate) {
    return __awaiter(this, void 0, void 0, function () {
        var processIdx, interval;
        var _this = this;
        return __generator(this, function (_a) {
            processIdx = 0;
            interval = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                var resp;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (processIdx === MAX_PROCESS) {
                                clearInterval(interval);
                                console.log("max process reached");
                            }
                            return [4 /*yield*/, findAvailabilities()];
                        case 1:
                            resp = _a.sent();
                            if (hasTarget(resp, targetDate)) {
                                console.log("".concat(targetDate, " has availabilities"));
                                clearInterval(interval);
                            }
                            processIdx++;
                            return [2 /*return*/];
                    }
                });
            }); }, 2000);
            return [2 /*return*/];
        });
    });
}
// process("2022-05-13");
findAvailabilitiesWithinDates(START_DATE, END_DATE).then(function (resp) {
    if (resp.length) {
        console.log("availabilities between ".concat(START_DATE, " and ").concat(END_DATE));
        console.log(resp);
        return;
    }
    console.log("There are no availabilities between ".concat(START_DATE, " and ").concat(END_DATE));
});
