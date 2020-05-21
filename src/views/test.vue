<template>
  <div id="container">
    <button @click="handleAxios">发送请求</button>
  </div>
</template>

<script>
export default {
  methods: {
    handleAxios() {
      this.axios({
        url: "/test",
        method: "POST",
        headers: {
          Authorization: "asdnasjdnkjs"
        }
      })
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
#container {
  padding: 50px;
  line-height: 50px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}
button {
  padding: 5px 8px;
  margin: 0 5px;
}
.flex-box {
  width: 300px;
  height: 45px;
  display: flex;
}
.flex-box div {
  height: 100%;
}
</style>
