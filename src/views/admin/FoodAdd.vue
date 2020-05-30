<template>
  <!-- 必选项 -->
  <!-- 1. 菜品名称 -->
  <!-- 2. 菜品价格 -->
  <!-- 3. 上传图片 -->
  <!-- 4. 描述 -->
  <!-- 5. 选择类别 -->
  <!-- 6. 菜品选项 -->
  <!-- 辅助选项 -->
  <!-- 6. 是否优惠 -->
  <!-- 7. 是否今日推送 -->
  <!-- 8. 是否新品推荐 -->
  <el-form
    label-width="90px"
    class="form-container"
    :model="form"
    :rules="formRules"
    ref="form"
  >
    <el-button
      icon="el-icon-back"
      v-if="isEdit"
      type="primary"
      size="medium"
      plain
      @click="handleBack"
      >返回</el-button
    >
    <area-title icon="el-icon-success">必选项</area-title>
    <el-form-item label="名称" prop="fname">
      <el-input
        v-model="form.fname"
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
    <el-form-item label="图片" prop="cover">
      <uploader
        :multiple="false"
        mode="single"
        v-model="form.cover"
        :imgurl="form.cover"
      >
        <template v-slot:tip
          ><i class="el-icon-info uploader-icon"></i
          >选择一张比例为1:1的png/jpg图片</template
        >
      </uploader>
    </el-form-item>
    <el-form-item label="描述" prop="descs">
      <el-input
        type="textarea"
        :row="2"
        placeholder="请输入描述内容"
        v-model="form.descs"
        class="regular-item"
      ></el-input>
    </el-form-item>
    <el-form-item label="类别" prop="typeid">
      <el-select v-model="form.typeid" placeholder="请选择" class="short-item">
        <el-option
          v-for="item in typeList"
          :key="item.id"
          :label="item.typename"
          :value="item.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="选项">
      <option-menu
        :optionsData="optionsList"
        v-model="form.opts"
        ref="opts"
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
          style="width:160px;vertical-align:middle"
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
      >{{ submitText }}</el-button
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
      if (!/^(\d+|\d+.\d+)$/.test(value)) {
        callback(new Error("请输入数字"));
        return;
      }
      if (__this__.form.saleType == 1) {
        parseFloat(value) >= 9.9
          ? callback(new Error("折扣不能超过9.9"))
          : callback();
      } else {
        parseFloat(value) >= parseFloat(__this__.form.price)
          ? callback(new Error("不能大于等于原价"))
          : callback();
      }
    };
    return {
      initial: {
        fname: "",
        price: "",
        cover: "",
        descs: "",
        typeid: "",
        opts: [],
        isSale: false,
        saleType: 1,
        saleNum: 1,
        salePrice: 0,
        isNew: false,
        isHot: false
      },
      form: {},
      formRules: {
        fname: [{ required: true, message: "请输入名称", trigger: "blur" }],
        typeid: [{ required: true, message: "请选择类别", trigger: "blur" }],
        price: [
          { required: true, message: "请输入价格", trigger: "blur" },
          { validator: priceValid, trigger: "blur" }
        ],
        cover: [
          { required: true, message: "请选择菜品图片", trigger: "change" }
        ],
        descs: [
          { required: true, message: "请输入菜品的描述内容", trigger: "blur" }
        ],
        opts: [{ required: false }],
        saleType: [
          { required: true, message: "请选择优惠方式", trigger: "change" }
        ],
        saleNum: [
          { required: true, message: "请输入", trigger: "change" },
          { validator: saleValid, trigger: "blur" }
        ]
      },
      isEdit: false,
      typeList: [],
      optionsList: [],
      showSale: false,
      saleTip: false,
      dialogImageUrl: "",
      dialogVisible: false,
      submitText: "确认添加",
      addSuccessful: false
    };
  },
  computed: {
    saleOptsText() {
      return this.form.saleType == 1
        ? "折扣"
        : this.form.saleType == 2
        ? "立减金额"
        : "优惠价";
    }
  },
  methods: {
    handleBack() {
      this.$router.go(-1);
    },
    async handleSubmit() {
      try {
        await this.$refs.form.validate();
        // 创建formdata数据，提交
        let formData = this.createFormData();
        // 判断请求类型
        let reqType = this.$route.params.data ? "edit" : "add";
        let res = await this.axios({
          url: `/admin/food/${reqType}`,
          method: "POST",
          data: formData,
          headers: { "Content-Type": "multipart/form-data" }
        });
        if (!res.data.err) {
          this.addSuccessful = true;
          // 响应操作成功，则做出相应提示
          let title = this.$route.params.data
            ? "修改成功，可返回列表查看"
            : "添加成功";
          let text = this.$route.params.data
            ? ["立即查看", "确认"]
            : ["查看", "继续添加"];
          this.$confirm(title, "操作", {
            confirmButtonText: text[0],
            cancelButtonText: text[1],
            type: "success"
          })
            .then(() => {
              this.$router.push({ path: "/admin/foodmanage" });
            })
            .catch(() => {
              this.$route.params.data ? void 0 : this.resetForm();
            });
        } else this.$alert(res.data.msg, "错误", { type: "error" });
      } catch (error) {
        Promise.reject(error);
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
    reactSalePrice(val) {
      let price = 0;
      switch (val) {
        case 1:
          if (!this.form.price == "") {
            price = (
              (parseFloat(this.form.price) * parseFloat(this.form.saleNum)) /
              10
            ).toFixed(2);
          }
          break;
        case 2:
          price = (
            parseFloat(this.form.price) - parseFloat(this.form.saleNum)
          ).toFixed(2);
          break;
        case 3:
          price = this.form.saleNum;
          break;
      }
      this.form.salePrice = parseFloat(price);
    },
    resetForm() {
      this.$refs.form.resetFields();
      this.$refs.opts.clearOptions();
      this.showSale = false;
      this.form.isSale = false;
      this.form.isNew = false;
      this.form.isHot = false;
    },
    createFormData() {
      let reqData = this.deepCopy(this.form);
      console.log(this.form);
      reqData.cover = this.form.cover;
      reqData.storeid = this.$store.state.info.id;
      if (!reqData.isSale) reqData.salePrice = reqData.price;
      reqData.opts = JSON.stringify(
        reqData.opts.map(item => {
          if (item.check) {
            item.opts = item.check;
            delete item.check;
          }
          return item;
        })
      );
      console.log(reqData);
      let formData = new FormData();
      for (const key in reqData) {
        if (["isSale", "isNew", "isHot"].indexOf(key) != -1) {
          reqData[key] = Number(reqData[key]);
        }
        formData.append(key, reqData[key]);
      }
      return formData;
    },
    deepCopy(obj) {
      let copyObj = Array.isArray(obj) ? [] : {};
      for (const key in obj) {
        const el = obj[key];
        copyObj[key] = typeof el == "object" ? this.deepCopy(el) : el;
      }
      return copyObj;
    },
    init() {
      // 如果是修改，则把传入的菜品数据传入到form中
      if (this.$route.params.data) {
        let data = this.$route.params.data;
        data.opts = JSON.parse(data.opts);
        // 将数字转换为布尔值
        for (const key in data) {
          if (["isSale", "isNew", "isHot"].indexOf(key) != -1)
            data[key] = Boolean(data[key]);
        }
        // 如果有优惠，则显示优惠组件，并计算saleNum
        if (data.isSale) {
          this.showSale = true;
          switch (data.saleType) {
            case 1:
              data.saleNum = parseFloat(
                ((data.salePrice / data.price) * 10).toFixed(2)
              );
              break;
            case 2:
              data.saleNum = parseFloat(
                (data.price - data.salePrice).toFixed(2)
              );
              break;
            case 3:
              data.saleNum = data.salePrice;
              break;
          }
        }
        this.form = this.deepCopy(data);
      } else {
        this.form = this.deepCopy(this.initial);
      }
    }
  },
  watch: {
    "form.saleType": function(val) {
      this.reactSalePrice(val);
    },
    "form.saleNum": function() {
      this.reactSalePrice(this.form.saleType);
    }
  },
  created() {
    if (this.$route.params.data) {
      this.isEdit = true;
      this.submitText = "确认修改";
    }
    this.init();
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
  },
  beforeRouteLeave(to, from, next) {
    if (!from.params.data && !this.addSuccessful) {
      // 如果是添加页面，判断是否填入了内容
      let formArr = Object.values(this.form).filter(
        item => typeof item != "object"
      );
      let initialArr = Object.values(this.initial).filter(
        item => typeof item != "object"
      );
      let result = formArr.every((item, index) => {
        return item == initialArr[index];
      });
      result
        ? next()
        : // 如果填入则提示
          this.$confirm(
            "如果现在离开，则当前内容会丢失，是否确认离开？",
            "未完成",
            {
              distinguishCancelAndClose: true,
              confirmButtonText: "继续填写",
              cancelButtonText: "离开",
              type: "warning"
            }
          )
            .then(() => void 0)
            .catch(action => (action == "cancel" ? next() : void 0));
    } else next();
  }
};
</script>

<style lang="scss" scoped>
.form-container {
  width: 650px;
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
