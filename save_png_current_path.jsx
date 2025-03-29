#target photoshop
<javascriptresource>

<name>将png保存到当前目录</name>

<category>custom</category>

</javascriptresource>
var prefix = "";
// var docName = activeDocument.name.replace(/\.[^\.]+$/, '');
var docName = "30" //将图片保存为30.png
var basePath = activeDocument.path;
var exportFolderName = "导出图片";
var exportDir = new Folder(basePath + "/" + exportFolderName);
var savePath = exportDir.exists ? exportDir.fsName : basePath.fsName;

function saveAsPNG(fileName, quality,compression) {
  var saveFile = new File(savePath + "/" + prefix + fileName + ".png");
  var pngSaveOptions = new PNGSaveOptions();
  pngSaveOptions.quality = quality;
  pngSaveOptions.compression = compression; // 使用 ZIP 压缩
  pngSaveOptions.interlace = false; // 不交错
  activeDocument.saveAs(saveFile, pngSaveOptions, true, Extension.LOWERCASE);
}

function saveAsWebPNG(fileName, quality,compression) {
  preferences.rulerUnits = Units.PIXELS;

  var doc = activeDocument;
  // var exportPath = doc.fullName.toString().replace(/\.psd$/, '.png');

  var newDoc = doc.duplicate();

  var webOpt = new ExportOptionsSaveForWeb();
  webOpt.format = SaveDocumentType.PNG;
  webOpt.PNG8 = true; // PNG-24

  var newFile = new File(savePath + "/" + prefix + fileName + ".png");
  newDoc.exportDocument(newFile, ExportType.SAVEFORWEB, webOpt);

  newDoc.close(SaveOptions.DONOTSAVECHANGES);
}

// 示例用法：
// saveAsPNG(docName, 100,6); // 保存为质量为 100 的 PNG
saveAsWebPNG(docName, 100,6); // 保存为质量为 100 的 PNG