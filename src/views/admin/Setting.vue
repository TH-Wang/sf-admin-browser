<template>
  <div>
    <el-button type="primary" @click="handleTest">æµ‹è¯•</el-button>
    <el-input type="password" v-model="pass"></el-input>
    <el-button type="primary" @click="getPass">èŽ·å�–</el-button>
  </div>
</template>

<script>
import md5 from "md5";

export default {
  data() {
    return {
      pass: ""
    };
  },
  methods: {
    handleTest() {
      this.axios({
        method: "POST",
        url: "/admin/test",
        headers: {
          "Content-type": "application/x-www-form-urlencoded",
          validcode: "147258"
        }
      })
        .then(res => {
          this.$message(res.data);
        })
        .catch(err => {
          console.log(err);
        });
    },
    getPass() {
      console.log(this.pass);
      console.log(md5(this.pass));
    }
  }
};
</script>

<style></style>
