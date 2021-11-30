import TableView from "../index";
import Table from "../Table";
import {
  Table as ElTable,
  Button as ElButton,
  TableColumn as ElTableColumn,
  Pagination as ElPagination,
} from "element-ui";
import { shallowMount, mount, enableAutoDestroy } from "@vue/test-utils";
import { tableData, columns } from "./utils";

const isFunc = (item) => typeof item === "function";

const getListMethod = jest.fn(async () => {
  return {
    listData: tableData,
    total: tableData.length,
    page: 1,
  };
});

function factory({
  slots = {},
  scopedSlots = {},
  stubs = {},
  propsData = {},
  useMount = false,
} = {}) {
  const mountFn = useMount ? mount : shallowMount;

  return mountFn(TableView, {
    stubs: {
      Table,
      ElPagination,
      ElTable,
      ElTableColumn,
      ...stubs,
    },
    slots,
    scopedSlots,
    propsData: {
      columns,
      getListMethod,
      ...propsData,
    },
  });
}

afterEach(() => {
  // 清除mock函数调用记录
  getListMethod.mockClear();
});

enableAutoDestroy(afterEach);

describe("TableView", () => {
  describe("@props:", () => {
    test("should work with `autoFetch` prop", () => {
      factory({
        propsData: {
          autoFetch: false,
        },
      });

      const calls = getListMethod.mock.calls;
      // 未自动请求数据
      expect(calls.length).toBe(0);
    });

    test("should work with `defaultSearchParams` prop", async () => {
      factory({
        propsData: {
          defaultSearchParams: {
            name: "hello",
            address: "world",
          },
        },
      });

      const calls = getListMethod.mock.calls;
      expect(calls.length).toBe(1);

      const initCall = calls[0];
      const [params] = initCall;
      expect(params.name).toBe("hello");
      expect(params.address).toBe("world");
    });

    test("should work with `useColumnCustomer` prop", async () => {
      const columnCustomMethod = jest.fn();
      const wrapper = factory({
        propsData: {
          useColumnCustomer: true,
          columnCustomMethod,
        },
      });

      expect(wrapper.find(".table__cumtomer").exists()).toBe(true);
    });
  });

  describe("@slots:", () => {
    test("filter", () => {
      const wrapper = factory({
        scopedSlots: {
          filter: `<template slot-scope="{ search }">
            <div class="slot-filter" @click="search({ name: 'hello' })">filter slot</div>
          </template>`,
        },
      });

      const filter = wrapper.find(".slot-filter");
      expect(filter.exists()).toBe(true);

      // 清楚 mock 函数调用记录
      getListMethod.mockClear();
      filter.trigger("click");
      const call = getListMethod.mock.calls[0];
      const [params] = call;

      expect(params.name).toBe("hello");
      expect(params.pageNum).toBe(1);
    });

    test("toolBar", () => {
      const wrapper = factory({
        stubs: { ElButton },
        scopedSlots: {
          toolBar: `<template slot-scope="{ search }">
            <div class="slot-toolBar">
              <el-button >导出</el-button>
            </div>
          </template>`,
        },
      });

      const toolBar = wrapper.find(".slot-toolBar");
      expect(toolBar.exists()).toBe(true);
    });

    // TODO tabBar

    // 通过插槽自定义列
    /* test('should supprot customize column by named slot', async() => {
      const wrapper = factory({
        useMount: true,
        scopedSlots: {
          name: `<div class="custom-cell--name" slot-scope="{ row, col }">{{col.label}}: {{row.name}}</div>`
        }
      });
      const table = wrapper.findComponent(ElTable);
      await table.vm.$nextTick();
      const cells = table.findAll('.custom-cell--name');

      expect(cells).toHaveLength(4);
      expect(cells.at(0).text()).toBe('Name: John Brown');
    }); */
  });

  describe("public methods", () => {
    test("check the existence of public methods", () => {
      const wrapper = factory();
      expect(isFunc(wrapper.vm.search)).toBe(true);
      expect(isFunc(wrapper.vm.setSearchParams)).toBe(true);
      expect(isFunc(wrapper.vm.getParams)).toBe(true);
      expect(isFunc(wrapper.vm.fetchListData)).toBe(true);
      expect(isFunc(wrapper.vm.getElTable)).toBe(true);
    });

    test("search", async () => {
      const wrapper = factory();
      getListMethod.mockClear();
      wrapper.vm.search({ name: "" });

      const calls = getListMethod.mock.calls;
      const [params] = calls[0];
      expect(params.pageNum).toBe(1);
      expect(params.name).toBe("");
    });

    test("getElTable", () => {
      const wrapper = factory({
        useMount: true,
      });

      const result = wrapper.vm.getElTable();

      expect(result.$options.name).toBe("ElTable");
    });
  });
});
