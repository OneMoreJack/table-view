export const tableData = [
  {
    name: "John Brown",
    age: 18,
    address: "New York No. 1 Lake Park",
    date: "2016-10-03",
  },
  {
    name: "Jim Green",
    age: 24,
    address: "London No. 1 Lake Park",
    date: "2016-10-01",
  },
  {
    name: "Joe Black",
    age: 30,
    address: "Sydney No. 1 Lake Park",
    date: "2016-10-02",
  },
  {
    name: "Jon Snow",
    age: 26,
    address: "Ottawa No. 2 Lake Park",
    date: "2016-10-04",
  },
];

export const columns = [
  {
    label: "Name",
    prop: "name",
  },
  {
    label: "Age",
    prop: "age",
    render: function (h, { row, col, rowIdx, colIdx }) {
      return h(
        "div",
        {
          class: ["custom-cell"],
        },
        `${col.label}: ${row.age} (${rowIdx},${colIdx})`
      );
    },
  },
  {
    label: "Address",
    prop: "address",
  },
];
