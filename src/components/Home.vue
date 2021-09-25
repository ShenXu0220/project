<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div class="header-left">
        <img src="../assets/flight.png" alt="" style="width: 50px" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="loginOut">退出</el-button>
    </el-header>
    <!-- 页面主体区 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isShow ? '64px' : '200px'">
        <div class="toggle-btn" @click="toggleShow">|||</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFE"
          :unique-opened="true"
          :collapse="isShow"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="item.id + ''"
            v-for="(item, index) in menuList"
            :key="item.id"
          >
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <!-- <i :class="iconObj[item.id]"></i> -->
              <i :class="iconArr[index]" class="iconfont"></i>
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + child.path"
              v-for="(child, index) in item.children"
              :key="index"
              @click="saveNavStatu('/' + child.path)"
            >
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{ child.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  //在刚加载的时候就要获取左侧菜单，所以是created生命周期函数里
  created() {
    this.getMenuList();
    this.activePath = window.sessionStorage.getItem("activePath");
  },
  data() {
    return {
      menuList: [],
      //   iconObj: {
      //     125: "iconfont icon-user",
      //     103: "iconfont icon-tijikongjian",
      //     101: "iconfont icon-shangpin",
      //     102: "iconfont icon-danju",
      //     145: "iconfont icon-baobiao",
      //   },
      iconArr: [
        "icon-user",
        "icon-tijikongjian",
        "icon-shangpin",
        "icon-danju",
        "icon-baobiao",
      ],
      //是否折叠
      isShow: false,
      //被激活的链接地址
      activePath: "",
    };
  },
  methods: {
    loginOut() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    // 获取所有的菜单
    async getMenuList() {
      const { data: res } = await this.$http.get("menus");
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.menuList = res.data;
      //   console.log(res)
    },
    // 点击按钮，切换折叠和展开
    toggleShow() {
      this.isShow = !this.isShow;
    },
    // 保存链接的激活状态
    saveNavStatu(activePath) {
      window.sessionStorage.setItem("activePath", activePath);
      this.activePath = activePath;
    },
  },
};
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;

  .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 0;
    color: #fff;
    font-size: 20px;

    .header-left {
      display: flex;
      align-items: center;
      flex: 1;
      span {
        margin-left: 15px;
      }
    }
  }
  .el-aside {
    background-color: #333744;
    .toggle-btn {
      background-color: #4a5064;
      font-size: 10px;
      line-height: 24px;
      color: #fff;
      text-align: center;
      letter-spacing: 0.2em;
      cursor: pointer;
    }
    .el-menu {
      border-right: none;
    }
  }
  .el-main {
    background-color: #eaedf1;
  }
}
.iconfont {
  margin-right: 10px;
}
</style>
