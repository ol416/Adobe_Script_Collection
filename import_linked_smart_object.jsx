#target photoshop
<javascriptresource>

<name>批量置入链接智能对象</name>

<category>custom</category>

</javascriptresource>

var doc = app.activeDocument;


function browseFile(path){
    path = path ? path : Folder.desktop.absoluteURI;
    var f = new File(path);
    var files = f.openDlg(
        "选择要插入的文件",
        "*.psd;*.jpg;*.png",
        true
    );
    if(!files) return [];
    return files;
}

function showError(err) {
	if (confirm('An unknown error has occurred.\n' +
		'Would you like to see more information?', true, 'Unknown Error')) {
			alert(err + ': on line ' + err.line, 'Script Error', true);
	}
}

function placeEvent(ID, null2, linked, horizontal, vertical) {
	var c2t = function (s) {
		return app.charIDToTypeID(s);
	};

	var s2t = function (s) {
		return app.stringIDToTypeID(s);
	};

	var descriptor = new ActionDescriptor();
	var descriptor2 = new ActionDescriptor();

	descriptor.putInteger( s2t( "ID" ), ID );
	descriptor.putPath( c2t( "null" ), null2 );
	descriptor.putBoolean( s2t( "linked" ), linked );
	descriptor.putEnumerated( s2t( "freeTransformCenterState" ), s2t( "quadCenterState" ), s2t( "QCSAverage" ));
	descriptor2.putUnitDouble( s2t( "horizontal" ), s2t( "distanceUnit" ), horizontal );
	descriptor2.putUnitDouble( s2t( "vertical" ), s2t( "distanceUnit" ), vertical );
	descriptor.putObject( s2t( "offset" ), s2t( "offset" ), descriptor2 );
	executeAction( s2t( "placeEvent" ), descriptor, DialogModes.NO );
}

var files = browseFile(doc.path);
// 遍历选定的文件并插入为链接智能对象图层
try {
    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        
        // 插入链接智能对象图层
        placeEvent(2, file, true, 0, 0);

        // var smartObjectLayer = doc.artLayers.add();
        // smartObjectLayer.name = "Linked Smart Object " + (i + 1);
        // smartObjectLayer.kind = LayerKind.SMARTOBJECT;
        
        // // 将外部文件链接到智能对象
        // var smartObject = smartObjectLayer.smartObject;
        // smartObject.link(file);
    }
}
catch(e) {
    // don't report error on user cancel
    // if (e.number != 8007) {
    //     showError(e);
    // }
}