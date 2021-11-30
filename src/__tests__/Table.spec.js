import Table from "../Table";
import { Table as ElTable, TableColumn as ElTableColumn } from "element-ui";
import { mount, shallowMount, enableAutoDestroy } from "@vue/test-utils";
import { tableData, columns } from "./utils";

/**
 * 工厂函数
 * @param {Boolean} useMount - 使用 mount 挂载
 * @param {Object} opts
 * @returns
 */
function factory({ useMount, propsData = {}, scopedSlots = {} } = {}) {
  const mountFn = useMount ? mount : shallowMount;
  return mountFn(Table, {
    stubs: {
      ElTable,
      ElTableColumn,
    },
    scopedSlots,
    propsData: {
      data: tableData,
      columns: columns,
      ...propsData,
    },
  });
}

enableAutoDestroy(afterEach);

describe("TableView > Table", () => {
  test("should work with `columns` prop", async () => {
    const wrapper = factory({ useMount: true });
    await wrapper.vm.$nextTick();

    // 列数
    expect(wrapper.findAllComponents(ElTableColumn).length).toBe(3);
    // render自定义column
    const customCell = wrapper.findAll(".custom-cell");
    expect(customCell.exists()).toBe(true);
    expect(customCell.at(0).text()).toBe("Age: 18 (0,1)");
    expect(customCell.at(1).text()).toBe("Age: 24 (1,1)");
  });

  test("should work with `elTableProps` prop", () => {
    const wrapper = factory({
      propsData: {
        elTableProps: {
          border: true,
        },
      },
    });

    expect(wrapper.findComponent(ElTable).props().border).toBe(true);
  });

  test("should work with `useSelection` prop", () => {
    const wrapper = factory({
      propsData: {
        useSelection: true,
      },
    });

    expect(wrapper.findComponent(ElTableColumn).props().type).toBe("selection");
  });

  test("should work with `columnAlign` prop", () => {
    const wrapper = factory({
      propsData: {
        columnAlign: "center",
      },
    });

    const columns = wrapper.findAllComponents(ElTableColumn);

    for (let i = 0; i < columns.length; i++) {
      expect(columns.at(i).props().align).toBe("center");
    }
  });

  // 通过插槽自定义列
  test("should supprot customize column by named slot", async () => {
    const wrapper = factory({
      useMount: true,
      scopedSlots: {
        name: `<div class="name-custom-cell" slot-scope="{ row, col }">{{col.label}}: {{row.name}}</div>`,
      },
    });
    await wrapper.vm.$nextTick();

    const cells = wrapper.findAll(".name-custom-cell");

    expect(cells).toHaveLength(4);
    expect(cells.at(0).text()).toBe("Name: John Brown");
  });
});
