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
  <el-form
    label-width="100px"
    class="form-container"
    :model="form"
    :rules="formRules"
    ref="form"
  >
    <area-title icon="el-icon-success">必选项</area-title>
    <el-form-item label="类别" prop="type">
      <el-select v-model="form.type" placeholder="请选择" class="short-item">
        <el-option
          v-for="item in typeList"
          :key="item.id"
          :label="item.typename"
          :value="item.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="图片" prop="files">
      <uploader :multiple="false" mode="single" v-model="form.files">
        <template v-slot:tip
          ><i class="el-icon-info uploader-icon"></i
          >选择一张比例为1:1的png/jpg图片</template
        >
      </uploader>
    </el-form-item>
    <el-form-item label="名称" prop="name">
      <el-input
        v-model="form.name"
        class="regular-item"
        placeholder="请输入内容"
      ></el-input>
    </el-form-item>
    <el-form-item label="价格" prop="price">
      <el-input v-model="form.price" class="short-item" placeholder="12">
        <template #prepend>￥</template>
        <template #append>元</template>
      </el-input>
    </el-form-item>
    <el-form-item label="选项">
      <option-menu
        :optionsData="optionsList"
        v-model="form.options"
      ></option-menu>
    </el-form-item>
    <area-title icon="el-icon-circle-plus">可选项</area-title>

    <el-form-item label="促销">
      <el-checkbox border @change="handleCheckSale" v-model="form.isSale"
        >优惠</el-checkbox
      >
      <span class="saleTip el-icon-warning-outline" v-show="saleTip"
        >先输入价格才能设置优惠</span
      >
    </el-form-item>

    <div v-if="showSale" class="sale-box">
      <el-form-item
        prop="saleType"
        label="优惠方式"
        style="display:inline-block;"
      >
        <el-select
          placeholder="请选择"
          v-model="form.saleType"
          class="sale-option"
          style="width:120px;line-height:32px"
          size="small"
        >
          <el-option label="折扣" :value="1"></el-option>
          <el-option label="立减" :value="2"></el-option>
          <el-option label="优惠价" :value="3"></el-option>
        </el-select>
      </el-form-item>
    </div>

    <div v-if="showSale" class="saleNum-box">
      <el-form-item prop="saleNum" :label="saleOptsText">
        <el-input-number
          v-if="form.saleType == 1"
          :min="1"
          :max="9.9"
          v-model="form.saleNum"
          size="small"
        ></el-input-number>
        <el-input
          v-else-if="form.saleType == 2 || form.saleType == 3"
          v-model="form.saleNum"
          style="width:150px;vertical-align:middle"
          size="small"
        >
          <template #prepend>￥</template>
          <template #append>元</template>
        </el-input>
      </el-form-item>
    </div>

    <el-form-item label="加入推荐">
      <el-checkbox border v-model="form.isNew">新品推荐</el-checkbox>
      <el-checkbox border v-model="form.isHot">热销推荐</el-checkbox>
    </el-form-item>
    <el-button
      type="primary"
      icon="el-icon-check"
      style="margin: 15px 0px 0px 20px"
      @click="handleSubmit"
      >确认添加</el-button
    >
    <el-button
      type="danger"
      icon="el-icon-refresh"
      style="margin: 15px 0px 0px 20px"
      @click="handleReset"
      >重置</el-button
    >
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
    var __this__ = this;
    var priceValid = function(rule, value, callback) {
      let reg = /^(\d+|\d+.\d+)$/;
      if (!reg.test(value.toString()))
        callback(new Error("价格只能是数字或小数"));
      else callback();
    };
    var saleValid = function(rule, value, callback) {
      value >= __this__.form.price
        ? callback(new Error("不能大于等于原价"))
        : callback();
    };
    return {
      form: {
        name: "",
        type: "",
        price: null,
        files: null,
        options: [],
        isSale: false,
        saleType: 1,
        saleNum: null,
        salePrice: null,
        isNew: false,
        isHot: false
      },
      formRules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        type: [{ required: true, message: "请选择类别", trigger: "change" }],
        price: [
          { required: true, message: "请输入价格", trigger: "blur" },
          { validator: priceValid, trigger: "blur" }
        ],
        files: [
          { required: true, message: "请选择菜品图片", trigger: "change" }
        ],
        saleType: [
          { required: true, message: "请选择优惠方式", trigger: "change" }
        ],
        saleNum: [
          { required: true, message: "请输入", trigger: "change" },
          { validator: saleValid, trigger: "change" }
        ]
      },
      typeList: [],
      optionsList: [],
      showSale: false,
      saleTip: false,
      dialogImageUrl: "",
      dialogVisible: false
    };
  },
  computed: {
    saleOptsText() {
      return this.form.saleType == 1
        ? "折扣"
        : this.form.saleType == 2
        ? "立减金额"
        : "直接优惠价";
    }
  },
  methods: {
    async handleSubmit() {
      try {
        await this.$refs.form.validate();
        console.log(this.form);
      } catch (error) {
        return;
      }
    },
    handleReset() {
      this.$refs.form.resetFields();
    },
    handleCheckSale(checked) {
      if (checked) {
        this.$refs.form.validateField("price", valid => {
          this.showSale = valid == "";
          this.saleTip = valid != "";
        });
      } else {
        this.showSale = false;
        this.saleTip = false;
      }
    },
    handleSaleChange() {
      // this.showSale = checked;
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
.uploader-icon {
  margin-right: 2px;
}
.sale-box {
  display: inline-block;
  vertical-align: top;
  line-height: 32px;
  padding-left: 80px;
}
.sale-box .el-select {
  margin-right: 25px;
  vertical-align: middle;
}
.sale-box .el-input-number {
  width: 120px;
}
.sale-box .el-input {
  vertical-align: middle;
}
.sale-option {
  width: 120px;
  display: inline-block;
  vertical-align: top;
}
.saleNum-box {
  display: inline-block;
  vertical-align: top;
  // padding-left: 80px;
}
.saleTip {
  margin-left: 10px;
  font-size: 12px;
  color: #f56c6c;
}
.saleTip::before {
  margin-right: 2px;
}
</style>
