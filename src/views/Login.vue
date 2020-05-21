<template>
  <div>
    <div class="center-box">
      <div class="image-box"><img src="../assets/easy-work.png" alt="" /></div>
      <div class="login-box">
        <login-form class="login-form" ref="ruleForm" :formRules="formRules">
          <login-mode @mode="handleMode"></login-mode>
          <login-input
            placeholder="请输入手机号码"
            v-model="login.tel"
            ruleProp="tel"
            clearable
          ></login-input>
          <transition name="switch" mode="out-in">
            <login-input
              v-if="modeIsPass"
              key="pass"
              type="password"
              placeholder="请输入密码"
              v-model="login.password"
              ruleProp="pass"
              clearable
            ></login-input>
            <login-input
              v-else
              key="code"
              placeholder="验证码"
              v-model="login.code"
              ruleProp="code"
              :maxlength="6"
              clearable
            >
              <template #append>
                <div class="code-btn" @click="handleGetCode">
                  {{ codeState.codeText }}
                </div>
              </template>
            </login-input>
          </transition>
          <div class="btn-box">
            <login-button
              type="general"
              @click="handleLogin"
              v-html="loginState.loginText"
            >
            </login-button>
            <login-button type="contrast" @click="handleJoin"
              >加入我们</login-button
            >
          </div>
        </login-form>
      </div>
    </div>
  </div>
</template>

<script>
import LoginInput from "@/components/LoginInput";
import LoginButton from "@/components/LoginButton";
import LoginForm from "@/components/LoginForm";
import LoginMode from "@/components/LoginMode";
import md5 from "md5";

export default {
  components: {
    "login-input": LoginInput,
    "login-button": LoginButton,
    "login-form": LoginForm,
    "login-mode": LoginMode
  },
  data() {
    return {
      login: {
        tel: "",
        password: "",
        code: ""
      },
      formRules: this.$store.state.formRules,
      modeIsPass: true,
      codeState: {
        codeText: "获取验证码",
        getcoding: false
      },
      loginState: {
        loginText: "立即登录",
        logging: false
      }
    };
  },
  methods: {
    handleMode() {
      this.modeIsPass = arguments[0];
    },
    handleGetCode() {
      if (this.codeState.getcoding) return;
      if (this.$refs.ruleForm.validField("tel")) {
        this.changeCodeState(true);
        this.axios
          .get(`/admin/getcode?tel=${this.login.tel}`)
          .then(res => {
            this.alertCode(res.data.code);
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    handleLogin() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let mode = this.modeIsPass ? "pass" : "code";
          // 如果当前正在发送登录请求，则不再继续执行请求
          if (this.loginState.logging) return;
          // 改变登录按钮状态
          this.changeLoginState(true);
          let data = mode == "pass" ? { pass: md5(this.login.password) } : {};
          data.tel = this.login.tel;
          // 发起登录请求
          this.axios({
            url: `/admin/login/${mode}`,
            method: "POST",
            data: data,
            headers: { validcode: this.login.code }
          })
            .then(res => {
              // 改变登录状态
              this.changeLoginState(false);
              if (res.data.err) {
                // 如果响应的是错误信息，则弹窗提示
                this.$alert(res.data.msg, "提示", {
                  confirmButtonText: "确认",
                  type: "error"
                });
              } else {
                let token = res.headers["authorization"];
                // 保存token
                this.$store.commit("setToken", { token: token });
                // 保存用户信息
                this.$store.commit("setInfo", res.data.info);
                this.changeLoginState(false);
                // 如果正确则重定向到admin页面
                this.$router.push({ path: "/admin" });
              }
            })
            .catch(err => Promise.reject(err));
        }
      });
    },
    changeLoginState(state) {
      this.loginState.loginText = state
        ? `登录中<i class="el-icon-loading"></i>`
        : "立即登录";
      this.loginState.logging = state;
    },
    alertCode(code) {
      let _this_ = this;
      let alertTime = parseInt(Math.random() * 10);
      alertTime = alertTime < 3 ? 3000 : alertTime * 1000;
      setTimeout(() => {
        _this_.$message({
          message: `您的手机验证码为【${code}】，五分钟内有效`,
          type: "success",
          duration: 0,
          showClose: true
        });
      }, alertTime);
    },
    changeCodeState(state) {
      this.codeState.getcoding = state;
      if (state) {
        let num = 60;
        this.codeState.codeText = `${num--}s重新获取`;
        let timer = setInterval(() => {
          this.codeState.codeText = `${num--}s重新获取`;
          if (num < 0) {
            this.changeCodeState(false);
            clearInterval(timer);
            timer = null;
            num = null;
          }
        }, 1000);
      } else this.codeState.codeText = "获取验证码";
    },
    handleJoin() {
      alert("弹出");
      console.log(this.login);
    },
    test() {
      console.log("test");
    }
  }
};
</script>

<style lang="scss" scoped>
.center-box {
  width: 68vw;
  height: 36vw;
  border-radius: 10px;
  box-shadow: 0 0 70px 5px #eeeeee;
  overflow: hidden;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, PingFang SC,
    Hiragino Sans GB, Microsoft YaHei, Helvetica Neue, Helvetica, Arial,
    sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol;
}
.image-box {
  width: 62%;
  height: 100%;
}
.image-box img {
  width: 100%;
  height: 100%;
  vertical-align: top;
}
.login-box {
  width: 38%;
  height: 100%;
  background-color: #223080;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}
.login-form {
  width: 70%;
}
.btn-box {
  margin-top: 50px;
}
.code-btn {
  // width: 120px;
  height: 35px;
  margin-left: 15px;
  line-height: 35px;
  text-align: center;
  padding: 0px 15px;
  font-size: 13px;
  background-color: #99a6ff;
  color: #1b2665;
  border-radius: 4px;
  cursor: pointer;
}

.switch-enter-active,
.switch-leave-active {
  transition: all 0.3s;
}
.switch-enter,
.switch-leave-to {
  opacity: 0.7;
  transform: scale(0.8);
}
</style>
