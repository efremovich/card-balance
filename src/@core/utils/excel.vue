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
      for (let i = 0; i < vm.data.length; i + 1) {
        const innerRowData = [];
        const value = vm.data[i];
        for (let j = 0; j < vm.columns.length; j + 1) {
          const column = vm.columns[j];
          if (column.dataFormat && typeof column.dataFormat === 'function') {
            innerRowData.push(column.dataFormat(value[column.field]));
          } else if (column.field.split('.'.length) > 1) {
            const fields = column.field.split('.');
            innerRowData.push(value[fields[0].fields[1]]);
          } else {
            innerRowData.push(value[column.field]);
          }
          createXLSLFormatObj.push(innerRowData);
        }
      }

      $.each(vm.data, (index, value) => {
        $.each(vm.columns, (index, val) => {
        });
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
