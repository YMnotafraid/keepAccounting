# Node+React实现个人记账webApp
## 项目技术选型：
后端选择的是Node.js上层架构Egg.js，因为Egg提供了一个强大的插件机制，让独立的模块编写起来更方便，本项目中引入了现成的egg-mysql，egg-jwt等插件。大大的降低了开发成本，用过都说好~   [后端传送门](https://github.com/YMnotafraid/acount-server)

前端选择的是React技术栈，全程用hooks编写。脚手架选择的是Vite
## 项目介绍
### 账单列表
![账单列表](https://raw.githubusercontent.com/YMnotafraid/keepAccounting/master/img/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20230301135418.png)
### 账单详细
![账单详细](https://raw.githubusercontent.com/YMnotafraid/keepAccounting/master/img/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_202303011354181.png)
### 添加账单
![添加账单](https://raw.githubusercontent.com/YMnotafraid/keepAccounting/master/img/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_202303011354182.png)
### 统计收支
![统计收支](https://raw.githubusercontent.com/YMnotafraid/keepAccounting/master/img/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_202303011354183.png)
### 个人主页
![个人信息](https://raw.githubusercontent.com/YMnotafraid/keepAccounting/master/img/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_202303011354184.png)
### 修改个人信息
![修改个人信息](https://raw.githubusercontent.com/YMnotafraid/keepAccounting/master/img/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_202303011354185.png)
## 项目部分模块分享
### 编写登录验证中间件，解决了两个痛点：
1、每次编写新的接口，都需要在方法内部做判断，出现重复代码   
2、一旦鉴权有所调整，牵一发动全身，需要修改所有用到鉴权的代码
```javascript
module.exports = (secret) => {
  return async function jwtErr(ctx, next) {
    const token = ctx.request.header.authorization; // 若是没有 token，返回的是 null 字符串
    let decode;
    if (token != "null" && token) {
      try {
        decode = ctx.app.jwt.verify(token, secret); // 验证token
        await next();
      } catch (error) {
        console.log("error", error);
        ctx.status = 200;
        ctx.body = {
          msg: "token已过期，请重新登录",
          code: 401,
        };
        return;
      }
    } else {
      ctx.status = 200;
      ctx.body = {
        code: 401,
        msg: "token不存在",
      };
      return;
    }
  };
};

```
### 二次封装axios
设置请求头携带token用于鉴权，格式化post请求体，设置拦截器配合组件库弹窗反馈请求状态提高用户体验
```javascript
import axios from "axios";
import { Toast } from "zarm";

const MODE = import.meta.env.MODE; // 环境变量

axios.defaults.baseURL =
  MODE == "development" ? "http://127.0.0.1:7001" : "http://127.0.0.1:7001";
axios.defaults.withCredentials = true;
axios.defaults.headers["X-Requested-With"] = "XMLHttpRequest";
axios.defaults.headers["Authorization"] = `${
  localStorage.getItem("token") || null
}`;
axios.defaults.headers.post["Content-Type"] = "application/json";

axios.interceptors.response.use((res) => {
  if (typeof res.data !== "object") {
    Toast.show("服务端异常！");
    return Promise.reject(res);
  }
  if (res.data.code != 200) {
    if (res.data.msg) Toast.show(res.data.msg);
    if (res.data.code == 401) {
      window.location.href = "/login";
    }
    return Promise.reject(res.data);
  }

  return res.data;
});

export default axios;

```
### 封装公共组件：时间筛选弹窗
在账单详情页面和统计收支页面使用当前组件时间精确到月，在新增账单页面时间精确到日，通过mode参数可实现不同时间精度的筛选
```javascript
import React, { forwardRef, useState } from "react";
import PropTypes from "prop-types";
import { Popup, DatePicker } from "antd-mobile";
import dayjs from "dayjs";

const PopupDate = forwardRef(({ onSelect, mode = "day" }, ref) => {
  const [show, setShow] = useState(false);
  const [now, setNow] = useState(new Date());

  const choseMonth = (item) => {
    setNow(item);
    setShow(false);
    if (mode == "month") {
      onSelect(dayjs(item).format("YYYY-MM"));
    } else if (mode == "day") {
      onSelect(dayjs(item).format("YYYY-MM-DD"));
    }
  };

  if (ref) {
    ref.current = {
      show: () => {
        setShow(true);
      },
      close: () => {
        setShow(false);
      },
    };
  }
  return (
    <Popup
      visible={show}
      position="bottom"
      mask={false}
      onMaskClick={() => setShow(false)}
      getContainer={() => document.body}
    >
      <div>
        <DatePicker
          visible={show}
          value={now}
          precision={mode}
          onConfirm={choseMonth}
          onCancel={() => setShow(false)}
        />
      </div>
    </Popup>
  );
});

PopupDate.propTypes = {
  mode: PropTypes.string, // 日期模式
  onSelect: PropTypes.func, // 选择后的回调
};

export default PopupDate;

```
## 未来计划
1、用TS+Next.js重构项目   
2、抽取优化用户鉴权模块，在其他项目复用   
3、添加新功能：日志模块，社区模块...
