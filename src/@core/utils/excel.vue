<template>
  <button @click="exportExcel">
    <slot />
  </button>
</template>

<script>
import XLSX from 'xlsx/xlsx';

export default {
  name: 'VueExcelXlsx',
  props: {
    columns: {
      type: Array,
      default: [],
    },
    data: {
      type: Array,
      default: [],
    },
    filename: {
      type: String,
      default: 'excel',
    },
    sheetname: {
      type: String,
      default: 'SheetName',
    },
  },
  methods: {
    exportExcel() {
      const createXLSLFormatObj = [];
      const newXlsHeader = [];
      const vm = this;
      if (vm.columns.length === 0) {
        console.log('Add columns!');
        return;
      }
      if (vm.data.length === 0) {
        console.log('Add data!');
        return;
      }
      for (let i = 0; i < vm.columns.length; i + 1) {
        newXlsHeader.push(vm.columns[i].label);
        // ещё какие-то выражения
      }
      // vm.columns.forEach(value, index) => {
      //   newXlsHeader.push(value.label);
      // };
      createXLSLFormatObj.push(newXlsHeader);
      $.each(vm.data, (index, value) => {
        const innerRowData = [];
        $.each(vm.columns, (index, val) => {
          if (val.dataFormat && typeof val.dataFormat === 'function') {
            innerRowData.push(val.dataFormat(value[val.field]));
          } else if (val.split('.'.length) > 1) {

          } else {
            innerRowData.push(value[val.field]);
          }
        });
        createXLSLFormatObj.push(innerRowData);
      });
      const filename = `${vm.filename}.xlsx`;
      const ws_name = vm.sheetname;
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(createXLSLFormatObj);
      XLSX.utils.book_append_sheet(wb, ws, ws_name);
      XLSX.writeFile(wb, filename);
    },
  },
};
</script>
