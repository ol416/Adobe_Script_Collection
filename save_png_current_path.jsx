#target photoshop
<javascriptresource>

<name>将png保存到当前目录</name>

<category>custom</category>

</javascriptresource>
var prefix = "";
// var docName = activeDocument.name.replace(/\.[^\.]+$/, '');
var docName = "30" //将图片保存为30.png
var savePath = activeDocument.path; // 缓存路径

function saveAsPNG(fileName, quality,compression) {
  var saveFile = new File(savePath + "/" + prefix + fileName + ".png");
  var pngSaveOptions = new PNGSaveOptions();
  pngSaveOptions.quality = quality;
  pngSaveOptions.compression = compression; // 使用 ZIP 压缩
  activeDocument.saveAs(saveFile, pngSaveOptions, true, Extension.LOWERCASE);
}

// 示例用法：
saveAsPNG(docName, 100,6); // 保存为质量为 100 的 PNG