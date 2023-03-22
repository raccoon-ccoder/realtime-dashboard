// vod, chat api가 있다고 가정
// 차트 타입은 line, table이 있다
// vod api는 조회 기간을 1일로만 설정할 수 있으며 나머지는 x일로 설정할 수 있다.
// table 차트의 경우 색상을 바꿀 수 있는 옵션을 가지며, 나머지는 존재하지 않는다.

const CHART_KEYS = {
  line: "LINE",
  table: "TABLE",
};

const randomData = () => {
  return Math.round(Math.random() * 100);
};

interface IData {
  date: Date;
  data: number;
}

// [ {date: x, data: y}, ...]
const daterangeData = (url: string, past: number) => {
  const res: IData[] = [];
  for (let i = 0; i <= past; i++) {
    const today = new Date();
    const past = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - i
    );
    const data = {
      date: past,
      data: randomData(),
    };
    res.push(data);
  }
  return res;
};

const fetchData = (param: IParam) => {
  // axios 대신 임의 데이터 반환
  if (param.url === "/vod/api") {
    return daterangeData(param.url, param.pastdate);
  } else {
    return daterangeData(param.url, param.pastdate);
  }
};

interface IParam {
  url: string;
  pastdate: number;
}

interface IApi {
  validChartList: () => string[];
  request: (param: IParam) => any;
  isVodApi: () => boolean;
}

class VodApi implements IApi {
  constructor() {}
  request(param: IParam) {
    return fetchData(param);
  }
  validChartList() {
    return [CHART_KEYS.line, CHART_KEYS.table];
  }
  isVodApi() {
    return true;
  }
}

class ChatApi implements IApi {
  constructor() {}
  request(param: IParam) {
    return fetchData(param);
  }
  validChartList() {
    return [CHART_KEYS.line, CHART_KEYS.table];
  }
  isVodApi() {
    return false;
  }
}

class ApiFactory {
  constructor() {}
  static createApi(url: string): IApi {
    switch (url) {
      case "chat":
        return new VodApi();
      case "vod":
        return new ChatApi();
      default:
        return new VodApi();
    }
  }
}

interface IChart {
  title: string;
  setTitle: (title: string) => void;
  canUseColorOpt: () => boolean;
  transform: (data: any) => any;
  render: (processedData: any) => string;
}

class LineChart implements IChart {
  constructor(public title: string) {}
  setTitle(title: string) {
    this.title = title;
  }

  canUseColorOpt() {
    return false;
  }
  transform(data: any) {
    const keys = Object.keys(data[0]);
    const result = keys.map((key: string) => {
      return {
        name: key,
        value: data.reduce((acc: any, curr: any) => {
          acc.push(curr[key]);
          return acc;
        }, []),
      };
    });
    return result;
  }
  render(processedData: any) {
    console.log("LineChart with Data");
    return processedData;
  }
}

class TableChart implements IChart {
  private color: string;
  constructor(public title: string) {
    this.color = "red";
  }
  setTitle(title: string) {
    this.title = title;
  }

  public get Color() {
    return this.color;
  }

  public set Color(color: string) {
    this.color = color;
  }

  canUseColorOpt() {
    return true;
  }
  transform(data: any) {
    return data;
  }
  render(processedData: any) {
    console.log("TableChart with Data");
    return processedData;
  }
}

class ChartFactory {
  constructor() {}
  static createChart(chart: string): IChart {
    switch (chart) {
      case CHART_KEYS.line:
        return new LineChart("line chart");
      case CHART_KEYS.table:
        return new TableChart("table chart");
      default:
        return new LineChart("line chart");
    }
  }
}

const api = ApiFactory.createApi("vod");
const data = api.request({ url: "vod", pastdate: 3 });
const chart = ChartFactory.createChart(CHART_KEYS.line);
const processedData = chart.transform(data);
const processedChart = chart.render(processedData);
console.log(processedChart);

export {};
