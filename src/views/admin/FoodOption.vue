<template>
  <div>
    <area-title icon="el-icon-menu">所有选项组</area-title>
    <el-table :data="optionsList" style="display:inline-block;width:auto">
      <el-table-column
        prop="title"
        label="选项组"
        width="150"
        align="center"
      ></el-table-column>
      <el-table-column prop="opts" label="选项" width="450">
        <template v-slot="rowData">
          <el-tag
            class="option-tag"
            type="success"
            v-for="item in rowData.row.opts"
            :key="item"
            >{{ item }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" align="center">
        <template v-slot="rowData">
          <!-- <el-button-group> -->
          <el-button size="mini" @click="showDialogEdit(rowData.row)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            size="mini"
            @click="handleOptionsDelete(rowData.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加 -->
    <area-title icon="el-icon-menu">添加选项组</area-title>
    <el-button type="primary" icon="el-icon-plus" @click="showDialogAdd"
      >点击添加</el-button
    >
    <!-- 对话框 -->
    <el-dialog
      :title="dialog.isAdd ? '添加选项组' : '编辑选项组'"
      :visible.sync="dialog.visible"
      append-to-body
      top="30vh"
      width="32%"
      @opened="handleDialogOpen"
      @close="changeDialogState(false)"
    >
      <el-form :model="dialog" :rules="dialog.rules" ref="dialogForm">
        <el-form-item prop="optionTitle">
          <el-input
            class="dialog-title-input"
            v-model="dialog.optionTitle"
            ref="optionTitleInput"
            placeholder="名称"
            clearable
          ></el-input>
        </el-form-item>
      </el-form>
      <el-tag
        class="dialog-option-tag"
        v-for="item in dialog.optionData"
        :key="item"
        @close="handleTagClose(item)"
        closable
        >{{ item }}</el-tag
      >
      <el-input
        v-show="dialog.inputing"
        v-model="dialog.inputValue"
        class="addInput"
        size="small"
        ref="addOptionInput"
        @keyup.enter.native="handleInputConfirm"
        @blur="handleInputConfirm"
      ></el-input>
      <el-button
        v-show="!dialog.inputing"
        size="small"
        @click="handleDialogInput"
      >
        + 添加选项</el-button
      >
      <div slot="footer" class="dialog-footer">
        <el-button @click="changeDialogState(false)">取 消</el-button>
        <el-button
          type="primary"
          @click="dialog.isAdd ? handleOptionsAdd() : handleOptionsEdit()"
          v-html="dialog.confirmHtml"
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
    optionsList: [],
    dialog: {
      isAdd: false,
      visible: false,
      optionId: null,
      optionTitle: "",
      optionData: [],
      inputing: false,
      inputValue: "",
      requesting: false,
      confirmHtml: "确 定",
      rules: {
        optionTitle: [
          { required: true, message: "名称不能为空", trigger: "blur" }
        ]
      }
    }
  }),
  methods: {
    handleDialogOpen() {
      this.$refs.optionTitleInput.$refs.input.focus();
    },
    showDialogEdit(data) {
      this.dialog.isAdd = false;
      this.changeDialogState(true, data);
    },
    showDialogAdd() {
      this.dialog.isAdd = true;
      this.changeDialogState(true, { id: null, title: "", opts: [] });
    },
    handleTagClose(tag) {
      this.dialog.optionData.splice(this.dialog.optionData.indexOf(tag), 1);
    },
    handleDialogInput() {
      this.dialog.inputing = true;
      this.$nextTick(() => {
        this.$refs.addOptionInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      this.dialog.inputing = false;
      let inputValue = this.dialog.inputValue;
      if (inputValue != "") {
        this.handleDialogInput();
        if (this.dialog.optionData.length == 0)
          this.dialog.optionData = [inputValue];
        else this.dialog.optionData.push(inputValue);
        this.dialog.inputValue = "";
      }
    },
    handleOptionsAdd() {
      if (this.dialog.requesting) return;
      let data = {
        title: this.dialog.optionTitle,
        opts: this.dialog.optionData,
        storeid: this.$store.state.info.id
      };
      this.handleRequest("/admin/foodoptions/add", data)
        .then(res => {
          this.optionsList.unshift(res.data.foodoptions);
        })
        .catch(err => {
          this.$message({ message: err, type: "error", showClose: true });
        });
    },
    handleOptionsEdit() {
      if (this.dialog.requesting) return;
      let data = {
        id: this.dialog.optionId,
        title: this.dialog.optionTitle,
        opts: this.dialog.optionData,
        storeid: this.$store.state.info.id
      };
      this.handleRequest("/admin/foodoptions/edit", data)
        .then(res => {
          let updateDate = res.data.foodoptions;
          console.log(updateDate);
          this.optionsList = this.optionsList.map(item => {
            if (item.id == updateDate.id)
              item = Object.assign(item, updateDate);
            return item;
          });
        })
        .catch(err => {
          this.$message({ message: err, type: "error", showClose: true });
        });
    },
    async handleOptionsDelete(id) {
      await this.$alert(
        "删除该选项组，带有该选项的菜品将无法使用，是否继续？",
        "删除选项",
        {
          type: "error"
        }
      );
      let data = {
        id,
        storeid: this.$store.state.info.id
      };
      this.axios
        .post("/admin/foodoptions/remove", data)
        .then(res => {
          let resError = res.data.err;
          if (!resError) {
            this.optionsList = this.optionsList.filter(
              item => item.id != res.data.id
            );
          }
          this.$message({
            message: resError ? res.data.msg : "删除成功!",
            type: resError ? "error" : "info",
            showClose: true
          });
        })
        .catch(err => {
          Promise.reject(err);
        });
    },
    handleRequest(url, data) {
      return new Promise((resolve, reject) => {
        if (
          this.dialog.optionTitle != "" &&
          this.dialog.optionData.length != 0
        ) {
          this.dialog.confirmHtml = `${
            this.dialog.isAdd ? "添加" : "修改"
          }中<i class="el-icon-loading"></i>`;
          this.dialog.requesting = true;
          this.axios
            .post(url, data)
            .then(res => {
              this.dialog.confirmHtml = "确 定";
              this.dialog.requesting = false;
              if (!res.data.err) {
                resolve(res);
                this.$message({
                  message: this.dialog.isAdd ? "添加成功!" : "修改成功！",
                  type: "success",
                  showClose: true
                });
                this.changeDialogState(false);
              } else {
                reject(res.data.msg);
              }
            })
            .catch(err => {
              this.dialog.confirmHtml = "确 定";
              this.dialog.requesting = false;
              reject(err);
            });
        }
      });
    },
    changeDialogState(state, data) {
      this.dialog.visible = state;
      if (state) {
        this.dialog.optionId = data.id;
        this.dialog.optionTitle = data.title;
        this.dialog.optionData = [...data.opts];
      } else {
        this.dialog.optionData = [];
        this.$refs.dialogForm.clearValidate();
      }
    }
  },
  created() {
    this.axios
      .get(`/admin/foodoptions/list?storeid=${this.$store.state.info.id}`)
      .then(res => {
        this.optionsList = res.data.list;
      })
      .catch(err => Promise.reject(err));
  }
};
</script>

<style lang="scss" scoped>
.option-tag {
  margin-right: 15px;
}
.dialog-option-tag {
  margin: 0 15px 12px 0;
}
.dialog-title-input {
  width: 150px;
  // margin-bottom: 20px;
  display: block;
}
.addInput {
  width: 90px;
  height: 32px;
  vertical-align: top;
}
</style>
