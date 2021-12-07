
export function getSourceData() {
  return [
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
}


export function searchData(params = {}) {
  const source = getSourceData()

  const isEmpty = val => [ '', null, undefined ].includes(val)

  const isMatch = item => {
    const entrys = Object.entries(params)
    const idxOf = (str, sub) => String.prototype.indexOf.call(str, sub)
    
    for (let [key, value] of entrys) {
      if (!isEmpty(value) && item[key] && idxOf(item[key], value) < 0) {
        return false
      }
    }
    return true
  }

  return source.filter(item => isMatch(item))
}
