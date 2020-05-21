<template>
  <div>
    <el-form
      :model="form"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      style="width: 100%"
    >
      <area-title icon="el-icon-s-shop">商家信息</area-title>
      <el-form-item label="商家名称" prop="name">
        <el-input
          v-model="form.name"
          placeholder="请输入商家或店铺的名称"
          style="width:360px"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="使用时长">
        <div>
          <el-radio v-model="form.usetime" :label="7" border size="medium"
            >试用7天</el-radio
          >
          <el-radio v-model="form.usetime" :label="30" border size="medium"
            >30天</el-radio
          >
          <el-radio v-model="form.usetime" :label="90" border size="medium"
            >90天</el-radio
          >
          <el-radio v-model="form.usetime" :label="180" border size="medium"
            >180天</el-radio
          >
          <el-radio v-model="form.usetime" :label="365" border size="medium"
            >365天</el-radio
          >
        </div>
      </el-form-item>
      <el-form-item label="入驻日期">
        <el-input
          v-model="getFormatDate"
          placeholder="xx年 xx月 xx日"
          suffix-icon="el-icon-date"
          style="width:260px"
          disabled
        ></el-input>
      </el-form-item>

      <area-title icon="el-icon-user-solid">登录信息</area-title>
      <el-form-item label="绑定手机号" prop="tel">
        <el-input
          v-model="form.tel"
          placeholder="请输入手机号码"
          style="width:360px"
          clearable
        >
          <template #prepend>中国 (+86)</template>
        </el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="numCode">
        <el-input
          v-model="form.numCode"
          placeholder="6位数字验证码"
          style="width:260px"
        >
          <template #append
            ><el-button @click="handleGetCode">{{
              validCode.text
            }}</el-button></template
          >
        </el-input>
      </el-form-item>
      <el-form-item label="登录密码" prop="password">
        <el-input
          type="password"
          v-model="form.password"
          placeholder="8-20位数字、字母、特殊符号"
          style="width:260px"
          show-password
        ></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input
          type="password"
          v-model="form.checkPass"
          placeholder="请再确认一次密码"
          style="width:260px"
          show-password
        ></el-input>
      </el-form-item>
      <el-button
        type="primary"
        icon="el-icon-check"
        style="margin: 15px 0px 0px 20px"
        @click="submitForm"
        >确认加入</el-button
      >
      <el-button
        type="danger"
        icon="el-icon-refresh"
        style="margin: 15px 0px 0px 20px"
        @click="resetForm"
        >重置</el-button
      >
    </el-form>
  </div>
</template>

<script>
import AreaTitle from "@/components/AreaTitle";
import md5 from "md5";

export default {
  components: { "area-title": AreaTitle },
  data() {
    // 验证手机号码
    var validateTelRight = (rule, value, fn) => {
      let reg = /^1[34578]\d{9}$/;
      if (!reg.test(value)) {
        fn(new Error("号码格式不正确"));
      } else {
        fn();
      }
    };
    // 验证手机验证码
    var validateNumCode = (rule, value, fn) => {
      let reg = /^\d{6}$/;
      if (!reg.test(value)) {
        fn(new Error("验证码格式不正确"));
      } else {
        fn();
      }
    };
    // 验证密码长度
    var validatePassLength = (rule, value, fn) => {
      if (!/^[\s\S]{8,20}$/.test(value)) fn(new Error("密码长度8-20位"));
      else fn();
    };
    // 验证密码格式和安全等级
    var validatePassLevel = (rule, value, fn) => {
      if (/^[\s\S]{8,20}$/.test(value)) {
        if (/^[\da-zA-Z~!@#$%^&_=+\-*{};,.?/'"]{8,20}$/.test(value)) {
          let level = 0;
          let arr = [];
          /\d+/.test(value) ? level++ : arr.push("数字");
          /[a-z]+/.test(value) ? level++ : arr.push("小写字母");
          /[A-Z]+/.test(value) ? level++ : arr.push("大写字母");
          /[~!@#$%^&*{};,.?/'"]+/.test(value) ? level++ : arr.push("特殊符号");
          if (level <= 2) {
            fn(new Error(`密码强度太弱，还缺少：${arr.join("、")}中的一种`));
          } else {
            if (this.form.checkPass !== "") {
              this.$refs.ruleForm.validateField("checkPass");
            }
            fn();
          }
        } else {
          fn(new Error("密码格式不正确"));
        }
      }
    };
    // 验证确认密码
    var validateCheckPass = (rule, value, fn) => {
      if (this.form.password.length == 0) fn(new Error("请先输入登录密码"));
      else if (/^[\s\S]{8,20}$/.test(value) && value !== this.form.password) {
        fn(new Error("两次密码输入不一致"));
      } else fn();
    };
    return {
      form: {
        name: "",
        usetime: 90,
        jointime: null,
        tel: "",
        numCode: "",
        password: "",
        checkPass: ""
      },
      rules: {
        name: [{ required: true, message: "请输入商家名称", trigger: "blur" }],
        tel: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          {
            validator: validateTelRight,
            trigger: "blur"
          }
        ],
        numCode: [
          { required: true, message: "请输入验证码", trigger: "blur" },
          {
            validator: validateNumCode,
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            validator: validatePassLength,
            trigger: "blur"
          },
          {
            validator: validatePassLevel,
            trigger: "blur"
          }
        ],
        checkPass: [
          { required: true, message: "请再次输入密码", trigger: "blur" },
          {
            validator: validateCheckPass,
            trigger: "blur"
          }
        ]
      },
      validCode: {
        sending: false,
        text: "获取验证码",
        count: 60
      },
      timer: null
    };
  },
  methods: {
    submitForm() {
      this.$refs.ruleForm.validate(valid => {
        console.log(valid);
        if (valid) {
          let { name, usetime, jointime, tel, password } = this.form;
          let data = {
            sname: name,
            limits: jointime.getTime() + usetime * 1000 * 60 * 60 * 24,
            jointime: jointime.getTime(),
            tel: tel,
            pass: md5(password)
          };
          this.axios({
            url: "/admin/store/add",
            method: "POST",
            data,
            headers: { validcode: this.form.numCode }
          })
            .then(res => {
              if (!res.data.err) {
                this.$alert("欢迎您的加入！", "提交成功", {
                  confirmButtonText: "确定",
                  type: "success"
                });
                this.resetCodeTimer();
                this.$refs.ruleForm.resetFields();
                this.$router.push("/admin/storelist");
              } else {
                this.$alert(res.data.msg, "提示", {
                  confirmButtonText: "确认",
                  type: "warning"
                });
              }
            })
            .catch(err => {
              this.$alert(err, "提交失败", {
                confirmButtonText: "确定",
                type: "error"
              });
            });
        } else {
          this.$alert("部分信息验证错误，请再次检查！", "提交失败", {
            confirmButtonText: "确定",
            type: "error"
          });
        }
      });
    },
    resetForm() {
      this.$refs.ruleForm.resetFields();
    },
    handleGetCode() {
      let _this_ = this;
      this.$refs.ruleForm.validateField("tel", err => {
        if (err.length == 0) {
          if (!this.validCode.sending) {
            this.axios
              .get("/admin/getcode", { params: { tel: this.form.tel } })
              .then(res => {
                let alertTime = parseInt(Math.random() * 10);
                alertTime = alertTime < 3 ? 3000 : alertTime * 1000;
                console.log(alertTime);
                setTimeout(() => {
                  _this_.$message({
                    message: `您的手机验证码为【${res.data.code}】，五分钟内有效`,
                    type: "success",
                    duration: 0,
                    showClose: true
                  });
                }, alertTime);
              });
            this.validCode.sending = true;
            this.validCode.text = `(${this.validCode.count--}秒)重新发送`;
            this.timer = setInterval(() => {
              this.validCode.text = `(${this.validCode.count--}秒)重新发送`;
              if (this.validCode.count < 0) {
                this.resetCodeTimer();
              }
            }, 1000);
          }
        }
      });
    },
    resetCodeTimer() {
      clearInterval(this.timer);
      this.timer = null;
      this.validCode.text = "获取验证码";
      this.validCode.count = 60;
      this.validCode.sending = false;
    }
  },
  computed: {
    getFormatDate() {
      return `${this.form.jointime.getFullYear()}年${this.form.jointime.getMonth() +
        1}月${this.form.jointime.getDate()}日`;
    }
  },
  created() {
    this.form.jointime = new Date();
  }
};
</script>

<style>
.el-radio {
  margin-right: 10px;
}
</style>
