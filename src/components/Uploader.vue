<template>
  <div>
    <div style="display:inline-block">
      <div
        v-for="(item, index) in urlList"
        :key="item.id"
        :class="'preview-box ' + size"
        :style="`background-image: url(${item.url})`"
      >
        <span class="preview-options">
          <span class="preview-btn" @click="handlePreview(item.url)">
            <i class="el-icon-zoom-in"></i>
          </span>
          <span class="preview-btn" @click="handleRemove(index)">
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </div>
      <div :class="'container ' + size">
        <i class="el-icon-plus"></i>
        <input
          type="file"
          name=""
          id="filebtn"
          @change="handleFiles"
          :multiple="multiple"
        />
        <div
          v-if="isSingle"
          class="singleImage"
          :style="'background-image: url(' + url + ')'"
        >
          <span v-show="maskShow" class="options-box">
            <i class="el-icon-refresh-right"></i><span>重新选择</span>
          </span>
        </div>
      </div>
    </div>
    <div class="tip">
      <slot name="tip"></slot>
    </div>
  </div>
</template>

<script>
export default {
  model: {
    prop: "fileList",
    event: "change-file"
  },
  props: {
    // 选择框大小
    size: {
      default: "regular",
      type: String
    },
    // 模式：single--单个 || array--多个
    mode: {
      default: "array",
      type: String
    },
    // 图片数量限制
    limit: {
      default: 9,
      type: Number
    },
    // 一次能否选多张
    multiple: {
      default: true,
      type: Boolean
    },
    imgurl: {
      default: "",
      type: String
    }
  },
  data() {
    return {
      url: null,
      isSingle: false,
      file: null,
      fileArray: [],
      maskShow: false,
      urlList: []
    };
  },
  methods: {
    handleFiles(e) {
      let files = e.target.files;
      if (this.mode == "single") {
        this.file = files[0];
        this.$emit("change-file", this.file);
        this.toSingleBase64(files[0]).then(baseUrl => {
          this.url = baseUrl;
          this.maskShow = true;
        });
      } else {
        this.fileArray.push(...files);
        this.$emit("change-file", this.fileArray);
        this.toArrayBase64(files).then(dataArray => {
          this.urlList.push(
            ...dataArray.map(item => ({
              id: parseInt(Math.random() * 1000000),
              url: item
            }))
          );
        });
      }
    },
    handlePreview(baseUrl) {
      this.$emit("show-image", baseUrl);
    },
    handleRemove(idx) {
      this.urlList.splice(idx, 1);
      this.fileArray.splice(idx, 1);
      this.$emit("change-file", this.fileArray);
    },
    toSingleBase64(file) {
      return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(e) {
          resolve(e.target.result);
        };
        reader.onerror = function(err) {
          reject(err);
        };
      });
    },
    async toArrayBase64(files) {
      let arr = [];
      try {
        for (const file of files) {
          let dataUrl = await new Promise((resolve, reject) => {
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function(e) {
              resolve(e.target.result);
            };
            reader.onerror = function(err) {
              reject(err);
            };
          });
          arr.push(dataUrl);
        }
      } catch (error) {
        console.log(error);
      }
      return new Promise(resolve => {
        resolve(arr);
      });
    }
  },
  created() {
    this.isSingle = this.mode == "single";
    if (this.imgurl != "") {
      this.url = this.imgurl;
      this.maskShow = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  display: inline-block;
  text-align: center;
  background-color: #fbfdff;
  border: dashed 1px #c0ccda;
  color: #bbbbbb;
  font-size: 24px;
  position: relative;
  overflow: hidden;
}
.container:hover {
  border: dashed 1px #409eff;
  color: #409eff;
}
.large {
  width: 200px;
  height: 200px;
  line-height: 200px;
  border-radius: 8px;
}
.regular {
  width: 150px;
  height: 150px;
  line-height: 150px;
  border-radius: 6px;
}
.small {
  width: 100px;
  height: 100px;
  line-height: 100px;
  border-radius: 4px;
}
#filebtn {
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  opacity: 0;
  cursor: pointer;
}
.singleImage {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9;
  background-size: cover;
  background-position: center;
}
.options-box {
  width: 100%;
  height: 100%;
  line-height: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  opacity: 0;
  background-color: rgba(0, 0, 0, 0.5);
  transition: all, 0.3s;
  position: absolute;
  top: 0;
  left: 0;
}
.options-box i {
  font-size: 22px;
}
.options-box span {
  font-size: 12px;
  margin-top: 3px;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, PingFang SC,
    Hiragino Sans GB, Microsoft YaHei, Helvetica Neue, Helvetica, Arial,
    sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol;
}
.container:hover .options-box {
  opacity: 1;
}
.preview-box {
  display: inline-block;
  margin-right: 15px;
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
}
.preview-options {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: all, 0.3s;
  position: absolute;
  top: 0;
  left: 0;
}
.preview-box:hover .preview-options {
  opacity: 1;
}
.preview-btn {
  margin: 0px 5px;
  width: 35px;
  height: 35px;
  line-height: 35px;
  text-align: center;
  cursor: pointer;
  border-radius: 50%;
  transition: all, 0.2s;
}
.preview-btn:hover {
  background-color: rgba(0, 0, 0, 0.5);
}
.tip {
  display: inline-block;
  margin-left: 15px;
  font-size: 13px;
  line-height: 24px;
  color: #999;
}
</style>
