#target photoshop
<javascriptresource>

<name>将jpg保存到当前目录</name>

<category>custom</category>

</javascriptresource>
var prefix = "";
// var docName = activeDocument.name.replace(/\.[^\.]+$/, '');
var docName = "50"; //保存为50.jpg
var saveFile = new File(activeDocument.path + "/" + prefix + docName);

var qlty = 12; //set jpeg quality here
var jpgFile = new File(saveFile);
jpgSaveOptions = new JPEGSaveOptions();
jpgSaveOptions.formatOptions = FormatOptions.OPTIMIZEDBASELINE;
jpgSaveOptions.embedColorProfile = true;
jpgSaveOptions.matte = MatteType.NONE;
jpgSaveOptions.quality = qlty;

activeDocument.saveAs(jpgFile, jpgSaveOptions, true, Extension.LOWERCASE);