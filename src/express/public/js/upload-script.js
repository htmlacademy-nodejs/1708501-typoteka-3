(function () {
  document.getElementById("upload-picture-field").onchange = function () {
    const file = this.files.item(0);
    if (file) {
      document.getElementById("picture-field").value = file.name;
    }
  };
})();
