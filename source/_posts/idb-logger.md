---
title: 基于WebWorker和indexedDB的高性能、高容量、高扩展的web端日志系统
tags: 作品
categories: 工具类库
top_img: 
date: 2022-08-12
updated:
cover: https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fi5.3conline.com%2Fimages%2Fpiclib%2F201105%2F04%2Fbatch%2F1%2F93468%2F13044854409495s2q5id96k.jpg&refer=http%3A%2F%2Fi5.3conline.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1660488620&t=83a346b5db553d096a7c6f3e991bfcc3
keywords: indexedDB,webworker,log
id: idb_logger
---

# [idb-logger](https://github.com/theajack/logger)

<h3>🚀 基于 WebWorker 和 indexedDB 的高性能、高容量、高扩展的web端日志系统</h3>

**[在线使用](https://shiyix.cn/jsbox?github=theajack.logger) | [English](https://github.com/theajack/logger) | [更新日志](https://github.com/theajack/logger/blob/master/scripts/version.md) | [问题反馈](https://github.com/theajack/logger/issues/new) | [Gitee](https://gitee.com/theajack/logger)**

## 0. 介绍

idb-logger 致力于帮助web开发者便捷高效的接入高性能的日志系统，依托于webworker和indexedDB技术，web应用可以已几乎不影响用户体验的方式在浏览器中存入大容量的日志，并且在合适的时机上报到服务端，或者由用户自行下载。

### 0.1 特性

1. 支持 WebWorker + indexedDB 存储日志
2. 可选三种日志存储模式，且当不支持时会自动向下选择支持的模式
3. 支持不存储模式，只使用idb-logger作为日志生成工具
4. 支持定义最大存储日志数量，会自动删除最早的记录
5. 支持下载日志
6. 支持查询日志，支持多种查询模式
7. 支持自定义基础数据
8. 支持基于onReport回调自定义上报

## 1. 快速使用

### 1.0 install

#### 1.0.1 npm install

```
npm i idb-logger
```

```js
import Logger from 'idb-logger';
```

#### 1.0.2 cdn

```html
<script src="https://cdn.jsdelivr.net/npm/idb-logger/idb-logger.min.js"></script>
<script>
  window.IDBLogger;
</script>
```

### 1.1 快速使用


```js
const logger = new Logger();

logger.log('一条普通日志');
logger.error('一条错误日志', '附加信息', {type: '附加信息'});

logger.download(); // 下载日志
```

### 1.2. api 介绍

ts声明：

```ts
declare class Logger {
    static version: string;
    private _store;
    id: string;
    storeType: TLogStoreType;
    constructor({ id, useConsole, storeType, maxRecords, baseInfo, onReport, onDiscard, }?: ILoggerOption);
    injectBaseInfo(baseInfo?: IBaseInfoOption & IJson): Promise<void>;
    log(...args: any[]): Promise<IAddReturn>;
    error(...args: any[]): Promise<IAddReturn>;
    warn(...args: any[]): Promise<IAddReturn>;
    info(...args: any[]): Promise<IAddReturn>;
    private _logCommon;
    close(): Promise<boolean>;
    destory(): Promise<boolean>;
    clear(): Promise<boolean>;
    count(): Promise<number>;
    delete(logid: string): Promise<boolean>;
    refreshTraceId(): Promise<void>;
    refreshDurationStart(): Promise<void>;
    download({ name, filter }?: {
        name?: string;
        filter?: TFilterOption;
        keys?: string[];
    }): Promise<number>;
    get(logid: string): Promise<ILogDBData | null>;
    getAll(): Promise<ILogDBData[]>;
    filter(filter?: TFilterOption): Promise<ILogDBData[]>;
}
```

完整的 logdata

```ts
interface ILogDBData {
    uid: string; // 用户id 会存储在storage中
    clientid: string; // 客户端id 会存储在storage中
    traceid: string; // 本次访问id，可以通过 refreshTraceId 刷新
    network: string; // 网络状况
    url: string; // 当前url
    ua: string; // 浏览器ua

    msg: string; // 消息类型，如果log第一个参数是字符串，则取该值
    payload?: any; // log的其他参数
    type: TLogType; // log info warn error
    duration: number; // 页面进入到当前日志的时间，可以通过 refreshDurationStart 刷新计时七点
    time: string; // 时间字符串
    timestamp: number; // 时间戳
    logid: string; // 日志唯一id
}
```

#### 1.2.1 构造函数

```ts
new Logger({
  id, // 指定数据库名称 默认值：default
  useConsole, // 是否打印到控制台 默认 true
  storeType, // 存储模式，默认 idb，支持 idb storage temp none
  maxRecords, // 最大存储记录数 默认10000
  baseInfo, // 注入自定义的基础信息
  onReport, // 当生成日志时触发，可用于自定义上报数据
  onDiscard // 当达到 maxRecords 时触发，丢弃掉的数据
});
```

1. storeType

idb 表示使用indexedDB存储日志，storage 表示使用 localStorage进行存储日志，temp 表示使用js变量存储数据（非持久化），none表示不存储数据（仅将idb-logger作为日志生成工具）

默认值为idb，当某个存储类型浏览器不支持时，会自动向后选用下一个模式

2. maxRecords

为了降低客户端性能消耗，可以指定一个最大存储数量，当超过这个数量时，logger会自动删除最早的记录并且 触发 onDiscard 回调

3. baseInfo 

接受一个json，用于注入日志的基础信息，当与默认baseInfo命名一致时会覆盖默认的baseInfo

默认的baseInfo `clientid, uid, traceid, network, url, ua`

#### 1.2.2 打日志

logger对象上有四个方法：log，error， warn，info

使用方法类似支持传入任意数量、任意类型的数据

参数规则

1. 当第一个参数是 字符串或者数字时，该参数作为log的msg字段，后面的所有参数合并成一个数组作为payload属性
2. 当第一个参数json时且仅有一个参数，会将该json中的所有属性覆盖到log的属性上
3. 当第一个参数不是数字或字符串，会将默认值__def__作为msg，所有参数合并成一个数组作为payload属性
   

```ts
await logger.log('start'); // 返回Promise<{discard, add}> add 是添加的日志数据。该调用方式符合规则1
await logger.info({
    msg: 'start', // 写入message
    time: 'xxxx', // 覆盖log的属性
    your_custom: 'xxxx', // 自定义属性
}); // 该调用方式符合规则2
await logger.warn({}, [], '', 1); // 该调用方式符合规则3
await logger.error('error', {}, [], '', 1); // 该调用方式符合规则1
```

#### 1.2.3 查询

```ts
await logger.filter(filter); // 返回Promise
```

filter 支持三种模式

1. 过滤器

支持传入一个函数 `(data: ILogDBData) => boolean`，回调函数是日志数据，返回 true 或者 false 表示是否该条数据命中

注意: 在indexedDB模式中，由于会将函数传到 worker中执行，要求函数中不能调用其他方法或者worker中不支持的特性

```ts
await logger.filter(item=>{
    return item.msg.includes('xxx') && item.type === 'log';
})
```

2. AND （传入json）

传入一个json，每个属性之间会使用 and 串起来, 支持正则表达式

```ts
await logger.filter({
    msg: /xxx/i,
    type: 'log',
})
```

3. OR （传入json数组）

传入一个json数组，数组中每个元素之间或使用 or 逻辑串起来，元素内属性之间使用 and 逻辑，与 2 中一致

```ts
await logger.filter([{
    msg: /xxx/i,
}, {
    type: 'log',
}])
```

上面语句表示日志中 msg含有xxx 或者 type等于log

#### 1.2.4 下载

下载indexedDB中存储的日志

```ts
await logger.download({
    name, // 可选 下载文件的名字 默认为时间戳
    filter, // 可选 同 1.2.3 中的 filter
    keys, // 可选 指定需要下载的额外属性
});
```

#### 1.2.5 其他api

##### 1.2.5.1 getAll

获取全部日志

```ts
await logger.getAll();
```

##### 1.2.5.1 get

根据日志id获取某条日志

```ts
await logger.getAll(logid);
```

##### 1.2.5.1 count

获取日志数量

```ts
await logger.count();
```

##### 1.2.5.1 delete

根据日志id删除某条日志

```ts
await logger.delete(logid);
```

##### 1.2.5.1 injectBaseInfo

注入日志基础信息

```ts
await logger.injectBaseInfo({
    network: 'wifi',
    phone: 'xxxx',
});
```

##### 1.2.5.1 refreshTraceId

刷新traceid，一般用于重连等，认为是第二次访问的场景

同时也会 refreshDurationStart

```ts
await logger.refreshTraceId();
```

##### 1.2.5.1 refreshDurationStart

刷新计时起点，一般用于需要重新统计时间的场景

```ts
await logger.refreshTraceId();
```

##### 1.2.5.1 close

关闭数据库

```ts
await logger.close();
```

##### 1.2.5.1 clear

关闭并且清空数据库

```ts
await logger.clear();
```

##### 1.2.5.1 destory

关闭、清空并且删除数据库

```ts
await logger.destory();
```
