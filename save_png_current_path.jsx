#target photoshop
<javascriptresource>

<name>将png保存到当前目录</name>

<category>custom</category>

</javascriptresource>
var prefix = "";
// var docName = activeDocument.name.replace(/\.[^\.]+$/, '');
var docName = "30" //将图片保存为30.png
var saveFile = new File(activeDocument.path + "/" + prefix + docName);

pngSaveOptions = new PNGSaveOptions();
pngSaveOptions.quality = 100;

activeDocument.saveAs(saveFile, pngSaveOptions, true, Extension.LOWERCASE);