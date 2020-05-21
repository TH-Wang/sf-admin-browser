<template>
  <div>
    <area-title icon="el-icon-s-unfold">所有类别</area-title>
    <!-- 菜品类别表单 -->
    <el-table
      :data="tableData"
      style="width: auto;display: inline-block"
      border
      show-summary
      sum-text="总计"
    >
      <el-table-column prop="typename" label="类别" width="280">
      </el-table-column>
      <el-table-column prop="foodCount" label="菜品数量" width="150">
      </el-table-column>
      <el-table-column label="操作" width="150" align="center">
        <template v-slot="rowData">
          <!-- <el-button-group> -->
          <el-button
            v-if="rowData.row.ishide != 1"
            size="mini"
            @click="showEditDialog(rowData.row)"
            >编辑</el-button
          >
          <el-button
            v-if="rowData.row.ishide != 1"
            type="danger"
            size="mini"
            @click="showRemoveDialog(rowData.row)"
            >删除</el-button
          >
          <!-- </el-button-group> -->
        </template>
      </el-table-column>
    </el-table>
    <area-title icon="el-icon-circle-plus" style="margin-top: 20px"
      >添加类别</area-title
    >
    <el-button type="primary" icon="el-icon-plus" @click="showAddTypeDialog"
      >点击添加</el-button
    >
    <!-- 对话框 -->
    <el-dialog
      :title="isAdd ? '添加类别' : '编辑类别'"
      :visible.sync="dialogForm.visible"
      append-to-body
      top="30vh"
      width="32%"
    >
      <el-form :model="dialogForm" :rules="dialogRules" ref="dialogForm">
        <el-form-item label="类别名称" label-width="100px" prop="typename">
          <el-input
            v-model="dialogForm.typename"
            style="width:95%"
            clearable
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogForm.visible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="isAdd ? handleAddType() : handleEditType()"
          v-html="dialogForm.confirmHtml"
        >
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import AreaTitle from "@/components/AreaTitle";

export default {
  components: { "area-title": AreaTitle },
  data: () => ({
    tableData: [],
    isAdd: false,
    requesting: false,
    dialogForm: {
      visible: false,
      id: null,
      typename: "",
      ishide: 0,
      confirmHtml: "确 定"
    },
    dialogRules: {
      typename: [{ required: true, message: "请输入商家名称", trigger: "blur" }]
    },
    editTypeId: null
  }),
  methods: {
    showEditDialog(row) {
      this.isAdd = false;
      this.dialogForm.visible = true;
      this.dialogForm = Object.assign(row, this.dialogForm);
    },
    async showRemoveDialog(row) {
      let text =
        row.foodCount > 0
          ? `该菜品类别还拥有 ${row.foodCount} 项菜品，删除后这些菜品将会被列为"其他类"`
          : "确认删除该类别吗？";
      await this.$confirm(text, "删除类别", {
        type: row.foodCount > 0 ? "error" : "warning"
      });
      let { id, storeid } = row;
      let res = await this.axios.post("/admin/foodtype/remove", {
        id,
        storeid
      });
      this.$message({
        message: res.data.err ? "删除失败，请稍后再试" : res.data.msg,
        type: res.data.err ? "error" : "success"
      });
      if (!res.data.err)
        this.tableData = this.tableData.filter(item => item.id != res.data.id);
    },
    showAddTypeDialog() {
      this.isAdd = true;
      this.dialogForm.visible = true;
      this.dialogForm.typename = "";
    },
    async handleEditType() {
      if (this.requesting) return;
      let { id, typename } = this.dialogForm;
      let storeid = this.$store.state.info.id;
      let res = await this.handleRequest("/admin/foodtype/edit", {
        id,
        typename,
        storeid
      });
      this.tableData = this.tableData.map(item => {
        if (item.id == res.data.foodtype.id)
          item.typename = res.data.foodtype.typename;
        return item;
      });
    },
    async handleAddType() {
      if (this.requesting) return;
      let data = {
        typename: this.dialogForm.typename,
        storeid: this.$store.state.info.id
      };
      let res = await this.handleRequest("/admin/foodtype/add", data);
      this.tableData.unshift(res.data.foodtype);
    },
    handleRequest(url, data) {
      return new Promise((resolve, reject) => {
        this.$refs.dialogForm.validate(valid => {
          if (valid) {
            this.changeState(true);
            this.axios
              .post(url, data)
              .then(res => {
                if (res.data.err) {
                  // 如果有错误
                  this.$message({ message: res.data.msg, type: "error" });
                } else {
                  // 如果添加成功
                  this.$message({ message: res.data.msg, type: "success" });
                  resolve(res);
                }
                this.changeState(false);
              })
              .catch(err => {
                this.changeState(false);
                reject(err);
              });
          }
        });
      });
    },
    changeState(state) {
      this.dialogForm.confirmHtml = state
        ? `${this.isAdd ? "添加" : "修改"}中<i class="el-icon-loading"></i>`
        : "确 定";
      this.requesting = state;
      this.dialogForm.visible = false;
    }
  },
  created() {
    this.axios
      .get(`/admin/foodtype/list?storeid=${this.$store.state.info.id}`)
      .then(res => {
        if (res.data.err) {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        } else {
          this.tableData = res.data;
        }
      });
  }
};
</script>

<style></style>
