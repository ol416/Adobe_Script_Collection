#target photoshop
<javascriptresource>

<name>获取当前智能对象的信息</name>

<category>custom</category>

</javascriptresource>
var mySO = getSmartObjectReference();

if (mySO.found) {
  alert('Is linked: ' + mySO.linked + '\nFile Name: ' + mySO.fileRef + '\nFile Path: ' + mySO.filePath);
}

function getSmartObjectReference()
{
  try
  {
    var smartObject = {
      found: false,
      fileRef: '',
      filePath: '',
      linked: false,
    };
    var ref, so;
    ref = new ActionReference();
    ref.putProperty(charIDToTypeID("Prpr"), stringIDToTypeID("smartObject"));
    ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    so = executeActionGet(ref).getObjectValue(stringIDToTypeID("smartObject"));
    smartObject.found = true;
    smartObject.linked = so.getBoolean(stringIDToTypeID("linked"));
    smartObject.fileRef = so.getString(stringIDToTypeID("fileReference"));
    if (smartObject.linked) {
      smartObject.filePath = so.getPath(stringIDToTypeID("link"));
    } else {
      smartObject.filePath = Folder.temp + '/' + smartObject.fileRef;
    }
    return smartObject;
  }
  catch (e)
  {
    alert(e);
    return smartObject;
  }
}