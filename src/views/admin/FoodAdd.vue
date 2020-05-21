<template>
  <!-- 必选项 -->
  <!-- 1. 选择类别 -->
  <!-- 2. 上传图片 -->
  <!-- 3. 菜品名称 -->
  <!-- 4. 菜品价格 -->
  <!-- 5. 菜品选项 -->

  <!-- 辅助选项 -->
  <!-- 6. 是否优惠 -->
  <!-- 7. 是否今日推送 -->
  <!-- 7. 是否新品推荐 -->
  <el-form ref="form" label-width="80px" class="form-container">
    <area-title icon="el-icon-success">必选项</area-title>
    <el-form-item label="类别">
      <el-select
        v-model="form.foodtypeId"
        placeholder="请选择菜品类别"
        class="short-item"
      >
        <el-option
          v-for="item in typeList"
          :key="item.id"
          :label="item.typename"
          :value="item.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="图片">
      <uploader
        :multiple="false"
        mode="single"
        v-model="form.files"
        @show-image="previewImage"
      >
        <template v-slot:tip>选择一张比例为1:1的png/jpg图片</template>
      </uploader>
    </el-form-item>
    <el-form-item label="名称">
      <el-input
        v-model="form.name"
        class="regular-item"
        placeholder="请输入内容"
      ></el-input>
    </el-form-item>
    <el-form-item label="价格">
      <el-input v-model="form.price" class="short-item" placeholder="12">
        <template #prepend class="input-slot">￥</template>
        <template #append class="input-slot">元</template>
      </el-input>
    </el-form-item>
    <el-form-item label="选项">
      <option-menu
        :optionsData="optionsList"
        v-model="form.options"
      ></option-menu>
    </el-form-item>
    <el-button @click="handleGet">获取</el-button>
    <area-title icon="el-icon-info">可选项</area-title>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </el-form>
</template>

<script>
import AreaTitle from "@/components/AreaTitle";
import Uploader from "@/components/Uploader";
import OptionMenu from "@/components/OptionMenu";

export default {
  components: {
    "area-title": AreaTitle,
    uploader: Uploader,
    "option-menu": OptionMenu
  },
  data() {
    return {
      form: {
        name: "",
        foodtypeId: "",
        price: null,
        files: null,
        options: []
      },
      typeList: [],
      optionsList: [],
      dialogImageUrl: "",
      dialogVisible: false
    };
  },
  methods: {
    previewImage(baseUrl) {
      this.dialogVisible = true;
      this.dialogImageUrl = baseUrl;
    },
    handleGet() {
      console.log(this.form);
    }
  },
  created() {
    this.axios
      .get("/admin/food/config", {
        params: { storeid: this.$store.state.info.id }
      })
      .then(res => {
        if (!res.data.err) {
          this.typeList = res.data.typeList;
          this.optionsList = res.data.optsList.map(item => {
            item.check = [];
            return item;
          });
        } else {
          this.$message({ message: res.data.msg, type: "error" });
        }
      })
      .catch(err => {
        Promise.reject(err);
      });
  }
};
</script>

<style lang="scss" scoped>
.form-container {
  width: 100%;
}
.short-item {
  width: 200px;
}
.regular-item {
  width: 300px;
}
.uploader {
  display: block;
  width: 150px;
  height: 150px;
  line-height: 150px;
  border-radius: 6px;
}
.uploader i {
  font-size: 24px;
  color: #999;
}
.upload-tip {
  font-size: 13px;
  color: #999;
}
</style>
