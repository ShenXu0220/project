<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 1.引入earchs，我这次是全局挂载，看main.js -->
      <!-- 2.为earchs准备一个具备大小宽高的Dom -->
      <div id="main" style="width: 750px; height: 400px"></div>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {},
  //   在页面上的元素被渲染之后
  async mounted() {
    //3.基于准备好的Dom元素 初始化echars实例
    let myChart = this.$echarts.init(document.getElementById("main"));

    const { data: res } = await this.$http.get("reports/type/1");
    if (res.meta.status !== 200) {
      return this.$message.error("获取折线图数据失败");
    }
    //4.准备数据和配置项
    // 因为请求来的数据是最新，所以是要把请求过来的数据放在后面替换前面的数据
    console.log(this.options);
    const result = { ...this.options, ...res.data };
    // 5.展示数据  setOption方法
    myChart.setOption(result);
  },
  data() {
    return {
      // 需要合并的数据
      options: {
        title: {
          text: "用户来源",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3",
            },
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
      },
    };
  },
  methods: {},
};
</script>

<style lang="less" scoped>
</style>