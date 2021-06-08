#### [五十家管理系统](http://erp.50-jia.com/test) 二次重构项目
-- 项目使用react + react hooks + webpack 5.x + babel 7.x + ali-react-table + antd 4.x + ahooks 2.x
###### 项目结构如下：
```
-- build 文件打包的文件位置
-- public html文件位置
-- src
   -- common     公共组件
      -- rules             表单校验规则
      -- Service           公共服务（ps：暂时还未实际使用，准备存放所有的数据请求等服务）
   -- components 页面组件
      -- Detail            公共详情页
      -- DetailSpec        特殊页面（待拆分）
      -- Edit              公共表单页
      -- Overview          列表页
      -- FitModel          公共弹框
      -- index             components的公共导出
      -- Login             登录页
      -- Main              菜单页 （ ps: 此页包含 Router, Router未拆分出来！待完善...）
   -- config     项目所用URI信息 和 请求方法封装
     -- API                项目中URL管理
     -- chooseRouter       项目中特殊路径的跳转
   -- hooks      项目所用hook部分封装 （可以存放自定义的hooks）
      -- createSevices     用于ahooks中useRequest的创建
   -- pulic      静态文件位置
   -- scss       层叠样式表
   -- util       工具类，集成了页面组件中的数据格式化
      -- cacheOperation    缓存操作（localStorage、seesionStorage等）
      -- cascaderOptions   省市区（待选择其他的方式）
      -- customPipline     项目中所用ali-react-table的自定义pipline
      -- fomattingRules    项目中各页面数据格式化为程序所用数据的规则定义
      -- initFormValue     根据类型初始化所有的表单数据（暂时只定义了部分表单项，待完善...）
      -- searchOperation   操作URL中search的方法
      -- SpecdetailData    特殊表单页死数据的维护
      -- statusMsg         状态提示信息
      -- transformRules    请求数据后转换数据规则（同fomattingRules功能有重复，待完善...）
```
