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
import { searchData } from '@/utils/source'

export default {
  name: "Basic",

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
      const list = searchData(params)
      return {
        listData: list, // 表格数据
        total: list.length,   // 总数
        page: 1      // 当前页数
      }
    },
  }
};
</script>
