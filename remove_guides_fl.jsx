#target photoshop
<javascriptresource>

<name>删除开头和结尾的参考线</name>

<category>custom</category>

</javascriptresource>
try{
    var ad = activeDocument;
    var guides_len = ad.guides.length;
    ad.guides[guides_len-1].remove();
    ad.guides[0].remove();
 }catch (e) {       
}
