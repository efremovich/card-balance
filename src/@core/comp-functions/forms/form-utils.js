export const useInputImageRenderer = (inputEl, callback) => {
  const inputImageRenderer = () => {
    const file = inputEl.value.files[0];
    const reader = new FileReader();

    reader.addEventListener(
      'load',
      () => {
        callback(reader.result);
      },
      false,
    );

    if (file) {
      if (file.size < 5242880) {
        reader.readAsDataURL(file);
      } else {
        // eslint-disable-next-line no-alert
        alert('Размер файла слишком большой');
      }
    }
  };
  return {
    inputImageRenderer,
  };
};

export const _ = null;
