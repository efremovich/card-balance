import html2Canvas from 'html2canvas';
import JsPDF from 'jspdf';

export default {
  install(Vue) {
    Vue.prototype.getPdf = () => {
      // const title = this.htmlTitle;
      html2Canvas(document.querySelector('#pdfDom'), {
        allowTaint: true,
      }).then((canvas) => {
        const contentWidth = canvas.width;
        const contentHeight = canvas.height;
        const pageHeight = contentWidth; // 592.28 * 841.89;
        let leftHeight = contentHeight;
        let position = 0;
        const imgWidth = 595.28;
        const imgHeight = 592.28; // contentWidth * contentHeight;
        const pageData = canvas.toDataURL('image/jpeg', 1.0);
        const PDF = new JsPDF('', 'pt', 'a4');
        if (leftHeight < pageHeight) {
          PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight);
        } else {
          while (leftHeight > 0) {
            PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight);
            leftHeight -= pageHeight;
            position -= 841.89;
            if (leftHeight > 0) {
              PDF.addPage();
            }
          }
        }
        // eslint-disable-next-line no-useless-concat
        PDF.save('Чеки.pdf');
      });
    };
  },
};
