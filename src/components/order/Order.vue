<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" clearable>
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 订单列表数据区域 -->
      <el-table :data="orderList" border stripe>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column
          label="订单价格"
          prop="order_price"
          width="100px"
        ></el-table-column>
        <el-table-column label="是否付款" prop="pay_status" width="100px">
          <template v-slot="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'"
              >已付款</el-tag
            >
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="是否发货"
          prop="is_send"
          width="100px"
        ></el-table-column>
        <el-table-column
          label="下单时间"
          prop="create_time"
          width="200px"
        ></el-table-column>
        <el-table-column label="操作" width="160px">
          <template v-slot>
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editBtn"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-location"
              size="mini"
              @click="showProgressBox"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 修改地址对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClose"
    >
      <!-- 表单 -->
      <el-form
        :model="addressForm"
        :rules="addressFormRules"
        ref="addressFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            :options="cityDate"
            v-model="addressForm.address1"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 展示物流进度的对话框 -->
    <el-dialog title="物流进度" :visible.sync="progressVisible" width="50%">
      <!-- 时间线区域 -->
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressData.data"
          :key="index"
          :timestamp="activity.time"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityDate from "./cityData";
import { progressInfo } from "./progressInfo";
export default {
  created() {
    this.getOrderList();
  },
  mounted() {
    console.log(this.progressData);
  },
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      total: 0,
      orderList: [],
      editDialogVisible: false,
      addressForm: {
        address1: [],
        address2: "",
      },
      addressFormRules: {
        address1: [
          {
            required: true,
            message: "请选择省市区/县",
            trigger: "blur",
          },
        ],
        address2: [
          {
            required: true,
            message: "请填写详细地址",
            trigger: "blur",
          },
        ],
      },
      cityDate,
      progressVisible: false,
      progressInfo: [],
      progressData: progressInfo,
    };
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$http.get("orders", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取订单数据列表失败！");
      }
      console.log(res);
      this.total = res.data.total;
      this.orderList = res.data.goods;
      if (this.orderList.length) {
        this.orderList.forEach((item) => {
          item.create_time = this.$dayjs(item.create_time).format(
            "YYYY-MM-DD HH:mm:ss"
          );
        });
      }
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getOrderList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getOrderList();
    },
    // 展示修改地址的对话框
    editBtn() {
      this.editDialogVisible = true;
    },
    editDialogClose() {
      this.$refs.addressFormRef.resetFields();
    },
    async showProgressBox() {
      // 由于接口问题获取不到后端的数据，所以自己设置了一个死值
      //   await this.$http.get("/kuaidi/1106975712662");
      //   if (res.meta.status !== 200) {
      //     return this.$message.error("获取物流信息失败");
      //   }
      //   this.progressInfo = res.data;

      this.progressVisible = true;
      console.log(this.progressInfo);
    },
  },
};
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>