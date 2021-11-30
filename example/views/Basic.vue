<template>
  <TableView 
    :columns="columns"
    :get-list-method="getDataList">
    <template #filter="{ search }">
      <ListFilter 
        @search="search($event)"
        @reset="search($event)"
      ></ListFilter>
    </template>
  </TableView>
</template>

<script>
import TableView from "src/index";
import ListFilter from '@/components/Filter'
import { getSourceData } from '@/utils/source'

export default {
  name: "Home",

  components: {
    TableView,
    ListFilter
  },

  data() {
    return {
      columns: [
        {
          label: "Name",
          prop: "name",
        },
        {
          label: "Age",
          prop: "age",
        },
        {
          label: "Address",
          prop: "address",
        },
      ],
    };
  },

  methods: {
    async getDataList(params) {
      const list = this.filterData(params)
      this.$message.success(`搜索： ${JSON.stringify(params)}`)
      return {
        listData: list, // 表格数据
        total: list.length,   // 总数
        page: 1      // 当前页数
      }
    },

    filterData(params) {
      console.log('filter params', params)
      return getSourceData()
    }
  }
};
</script>
