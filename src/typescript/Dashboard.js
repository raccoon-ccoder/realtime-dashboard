"use strict";
// vod, chat api가 있다고 가정
// 차트 타입은 line, table이 있다
// vod api는 조회 기간을 1일로만 설정할 수 있으며 나머지는 x일로 설정할 수 있다.
// table 차트의 경우 색상을 바꿀 수 있는 옵션을 가지며, 나머지는 존재하지 않는다.
exports.__esModule = true;
var CHART_KEYS = {
    line: "LINE",
    table: "TABLE"
};
var randomData = function () {
    return Math.round(Math.random() * 100);
};
// [ {date: x, data: y}, ...]
var daterangeData = function (url, past) {
    var res = [];
    for (var i = 0; i <= past; i++) {
        var today = new Date();
        var past_1 = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
        var data_1 = {
            date: past_1,
            data: randomData()
        };
        res.push(data_1);
    }
    return res;
};
var fetchData = function (param) {
    // axios 대신 임의 데이터 반환
    if (param.url === "/vod/api") {
        return daterangeData(param.url, param.pastdate);
    }
    else {
        return daterangeData(param.url, param.pastdate);
    }
};
var VodApi = /** @class */ (function () {
    function VodApi() {
    }
    VodApi.prototype.request = function (param) {
        return fetchData(param);
    };
    VodApi.prototype.validChartList = function () {
        return [CHART_KEYS.line, CHART_KEYS.table];
    };
    VodApi.prototype.isVodApi = function () {
        return true;
    };
    return VodApi;
}());
var ChatApi = /** @class */ (function () {
    function ChatApi() {
    }
    ChatApi.prototype.request = function (param) {
        return fetchData(param);
    };
    ChatApi.prototype.validChartList = function () {
        return [CHART_KEYS.line, CHART_KEYS.table];
    };
    ChatApi.prototype.isVodApi = function () {
        return false;
    };
    return ChatApi;
}());
var ApiFactory = /** @class */ (function () {
    function ApiFactory() {
    }
    ApiFactory.createApi = function (url) {
        switch (url) {
            case "chat":
                return new VodApi();
            case "vod":
                return new ChatApi();
            default:
                return new VodApi();
        }
    };
    return ApiFactory;
}());
var LineChart = /** @class */ (function () {
    function LineChart(title) {
        this.title = title;
    }
    LineChart.prototype.setTitle = function (title) {
        this.title = title;
    };
    LineChart.prototype.canUseColorOpt = function () {
        return false;
    };
    LineChart.prototype.transform = function (data) {
        var keys = Object.keys(data[0]);
        var result = keys.map(function (key) {
            return {
                name: key,
                value: data.reduce(function (acc, curr) {
                    acc.push(curr[key]);
                    return acc;
                }, [])
            };
        });
        return result;
    };
    LineChart.prototype.render = function (processedData) {
        console.log("LineChart with Data");
        return processedData;
    };
    return LineChart;
}());
var TableChart = /** @class */ (function () {
    function TableChart(title) {
        this.title = title;
        this.color = "red";
    }
    TableChart.prototype.setTitle = function (title) {
        this.title = title;
    };
    Object.defineProperty(TableChart.prototype, "Color", {
        get: function () {
            return this.color;
        },
        set: function (color) {
            this.color = color;
        },
        enumerable: false,
        configurable: true
    });
    TableChart.prototype.canUseColorOpt = function () {
        return true;
    };
    TableChart.prototype.transform = function (data) {
        return data;
    };
    TableChart.prototype.render = function (processedData) {
        console.log("TableChart with Data");
        return processedData;
    };
    return TableChart;
}());
var ChartFactory = /** @class */ (function () {
    function ChartFactory() {
    }
    ChartFactory.createChart = function (chart) {
        switch (chart) {
            case CHART_KEYS.line:
                return new LineChart("line chart");
            case CHART_KEYS.table:
                return new TableChart("table chart");
            default:
                return new LineChart("line chart");
        }
    };
    return ChartFactory;
}());
var api = ApiFactory.createApi("vod");
var data = api.request({ url: "vod", pastdate: 3 });
var chart = ChartFactory.createChart(CHART_KEYS.line);
var processedData = chart.transform(data);
var processedChart = chart.render(processedData);
console.log(processedChart);
