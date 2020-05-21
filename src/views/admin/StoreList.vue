<template>
  <div>
    <area-title icon="el-icon-s-shop">所有商家</area-title>
    <el-table
      :data="storeList"
      style="width: auto;display: inline-block"
      :row-class-name="tableRowClass"
      border
      stripe
    >
      <el-table-column prop="sname" label="商家名称" width="280">
      </el-table-column>
      <el-table-column prop="tel" label="联系方式" width="180">
      </el-table-column>
      <el-table-column prop="limits" label="剩余期限" width="180">
      </el-table-column>
      <el-table-column prop="jointime" label="入驻日期" width="180">
      </el-table-column>
      <el-table-column label="操作" width="120" align="center">
        <el-button type="primary" size="small">查看</el-button>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import AreaTitle from "@/components/AreaTitle";

export default {
  components: { "area-title": AreaTitle },
  data() {
    return {
      storeList: []
    };
  },
  methods: {
    tableRowClass({ row }) {
      if (row.limits == "已过期") {
        console.log("ok");
        return "warning-row";
      } else return "";
    },
    formatList(data) {
      let result = [];
      data.forEach(item => {
        let { sname, tel, limits, jointime } = item;
        let limisTime = Math.floor(
          (limits - new Date().getTime()) / 1000 / 60 / 60 / 24
        );
        let jtFormat = new Date(parseInt(jointime));
        let timeStr = `${jtFormat.getFullYear()}年${jtFormat.getMonth() +
          1}月${jtFormat.getDate()}日`;
        result.push({
          sname,
          tel,
          limits: limisTime <= 0 ? "已过期" : limisTime + "天",
          jointime: timeStr
        });
      });
      return result;
    }
  },
  created() {
    this.axios
      .post("/admin/store/list")
      .then(res => {
        this.storeList = this.formatList(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  }
};
</script>

<style>
.el-table .warning-row {
  /* background-color: #faadad; */
  color: #f56c6c;
}
</style>
