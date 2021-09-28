<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片布局 -->
    <el-card>
      <!-- 添加角色按钮区 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRoleVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>
      <!-- 角色列表区 -->
      <el-table :data="rolelist" border stripe>
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item1.id)">
                  {{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>

              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 通过for循环，嵌套渲染二三级权限 -->
                <div v-if="item1.children.length">
                  <el-row
                    :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                    v-for="(item2, i2) in item1.children"
                    :key="item2.id"
                  >
                    <el-col :span="5">
                      <el-tag
                        type="success"
                        closable
                        @close="removeRightById(scope.row, item2.id)"
                      >
                        {{ item2.authName }}
                      </el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <el-col :span="14">
                      <div v-if="item2.children.length">
                        <el-tag
                          type="warning"
                          v-for="item3 in item2.children"
                          :key="item3.id"
                          closable
                          @close="removeRightById(scope.row, item3.id)"
                        >
                          {{ item3.authName }}
                        </el-tag>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <!-- <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row.id)"
              >编辑</el-button
            > -->
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="editRowInfo(scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeRolesById(scope.row.id)"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDia(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRoleVisible"
      width="50%"
      @close="addDialogClose"
    >
      <!-- 内容主体 -->
      <el-form ref="addFormRef" :model="addForm" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <span slot="footer">
        <el-button @click="addRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRolePerson">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色对话框 -->
    <el-dialog
      title="编辑角色信息"
      :visible.sync="editRoleVisible"
      width="50%"
      @close="editDialogClose"
    >
      <el-form ref="editFormRef" :model="editForm" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="editRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRolesInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限的对话框 -->
    <el-dialog title="分配权限" :visible.sync="setRightDiaVisible" width="50%" @close="setRightDiaClosed">
      <!-- 树形控件 -->
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defkeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDiaVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    this.getRolelist();
  },
  data() {
    return {
      // 所有角色列表数据
      rolelist: [],
      // 控制用户添加对话框的显示和隐藏
      addRoleVisible: false,
      // 添加角色的数据
      addForm: {
        roleId: "",
        roleName: "",
        roleDesc: "",
      },
      // 控制用户编辑对话框的显示和隐藏
      editRoleVisible: false,
      // 编辑后的数据存放
      editForm: {},
      // 控制权限对话框的显示与隐藏
      setRightDiaVisible: false,
      // 所有权限的数据
      rightsList: [],
      // 树形控件的属性绑定对象
      treeProps: {
        label: "authName",
        children: "children",
      },
      // 默认选中的节点的ID值数组
      defkeys: [],
      // 当前即将被分配权限的角色ID
      roleId:''
    };
  },
  methods: {
    async getRolelist() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error("获取角色列表失败");
      }
      this.rolelist = res.data;
      // console.log(this.rolelist);
    },
    // 添加角色
    async addRolePerson() {
      const { data: res } = await this.$http.post("roles", this.addForm);
      if (res.meta.status !== 201) {
        return this.$message.error("添加角色失败");
      }
      this.$message.success("添加角色成功！");
      this.addRoleVisible = false;
      //  重新获取数据
      this.getRolelist();
    },
    // 重置表单
    addDialogClose() {
      this.$refs.addFormRef.resetFields();
    },
    // 编辑按钮点击显示对话框
    async showEditDialog(roleId) {
      const { data: res } = await this.$http.get("roles/" + roleId);
      if (res.meta.status !== 200) {
        return this.$message.error("查询角色信息失败！");
      }
      this.editForm = res.data;
      // console.log(res.data)
      this.editRoleVisible = true;
    },
    // 编辑
    editRowInfo(row) {
      // this.editForm = JSON.parse(JSON.stringify(row))
      this.editForm = Object.assign({}, row);
      // console.log(this.editForm);
      this.editRoleVisible = true;
    },
    editDialogClose() {
      this.$refs.editFormRef.resetFields();
    },
    // 编辑后完成数据修改
    async editRolesInfo() {
      const { data: res } = await this.$http.put("roles/" + this.editForm.id, {
        roleName: this.editForm.roleName,
        roleDesc: this.editForm.roleDesc,
      });
      // console.log(this.editForm.id)
      // console.log(res.meta.status)
      if (res.meta.status !== 200) {
        return this.$message.error("更新角色信息失败！");
      }
      this.editRoleVisible = false;
      this.getRolelist();
      this.$message.success("更新用户信息成功");
    },
    // 删除功能的实现
    async removeRolesById(id) {
      const confirmRes = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmRes !== "confirm") {
        return this.$message.info("已经取消删除");
      }
      const { data: res } = await this.$http.delete("roles/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("删除用户失败");
      }
      this.$message.success("删除用户成功！");
      this.getRolelist();
    },
    // 点击三级标签后删除的事件,根据ID删除
    async removeRightById(role, rightId) {
      // 弹框提示用户是否删除
      const confirmResult = await this.$confirm(
        "此操作将永久删除该权限, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm") {
        return this.$message.info("取消了删除");
      }
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("删除权限失败！");
      }
      // 这个操作会导致整个页面完整渲染，
      // 这个权限的删除后，返回的data是最新的
      // this.getRolelist();
      // 所以只要把当前的role的children上的值更新一下
      role.children = res.data;
    },
    // 展示分配权限的对话框
    async showSetRightDia(role) {
      this.roleId = role.id
      // 获取所有权限数据
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status !== 200) {
        return this.$message.errror("获取权限数据失败");
      }
      // 把获取到的权限数据保存到data中
      this.rightsList = res.data;
      // console.log(this.rightsList);

      // 通过递归获取三级节点的id
      // console.log(role)  有值
      this.getLeafKeys(role, this.defkeys);

      this.setRightDiaVisible = true;
    },
    // 定义一个递归的函数，获取角色下所有三级权限的ID，并保存到defKeys数组中
    getLeafKeys(node, arr) {
      // 如果当前node节点不包含children属性则是三级节点
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach((item) => this.getLeafKeys(item, arr));
    },
    // 监听分配权限对话框的关闭事件
    setRightDiaClosed(){
      this.defkeys = []
    },
    // 点击为角色分配权限
    async allotRights(){
      const keys = [
        // 用...扩展运算符将这两个数据合并成一个数组
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      // console.log(keys)
      const idStr = keys.join(',')
      const {data :res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids: idStr})
      if(res.meta.status !== 200){
        return this.$message.error('分配权限失败')
      }
      this.$message.success('分配权限成功')
      this.getRolelist();
      this.setRightDiaVisible = false
    }
  },
};
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>