// Photoshop脚本：批量缩放选中的图层，支持锚点选择、相对/绝对缩放模式，持久化存储配置
function scaleSelectedLayers() {
    if (!app.documents.length) {
        alert("请先打开一个文档！");
        return;
    }

    var doc = app.activeDocument;
    var selectedLayers = getSelectedLayers(doc);

    if (selectedLayers.length === 0) {
        alert("请先选择一个或多个图层！");
        return;
    }

    // 读取持久化配置
    var settings = getSettings();

    // 创建用户界面
    var dialog = new Window("dialog", "批量缩放图层");

    // 缩放模式
    dialog.add("statictext", undefined, "缩放模式:");
    var scaleModeDropdown = dialog.add("dropdownlist", undefined, ["相对缩放（百分比）", "绝对缩放（百分比）"]);
    scaleModeDropdown.selection = settings.scaleMode || 0;

    // 缩放值
    dialog.add("statictext", undefined, "缩放值:");
    var scaleInput = dialog.add("edittext", undefined, settings.scaleValue || "100");
    scaleInput.characters = 10;

    // 锚点选择
    dialog.add("statictext", undefined, "锚点位置:");
    var anchorDropdown = dialog.add("dropdownlist", undefined, [
        "左上", "中上", "右上", "左中", "中心", "右中", "左下", "中下", "右下"
    ]);
    anchorDropdown.selection = settings.anchorIndex || 4; // 默认选择“中心”

    // 确认和取消按钮
    var buttonGroup = dialog.add("group");
    buttonGroup.alignment = "right";
    var confirmBtn = buttonGroup.add("button", undefined, "确认", {
        name: "ok"
    });
    var cancelBtn = buttonGroup.add("button", undefined, "取消", {
        name: "cancel"
    });

    // 修改主逻辑，缩放后调用居中函数
    confirmBtn.onClick = function() {
        var scaleMode = scaleModeDropdown.selection.index;
        var scaleValue = parseFloat(scaleInput.text);
        if (isNaN(scaleValue) || scaleValue <= 0) {
            alert("请输入有效的缩放值！");
            return;
        }

        var anchorIndex = anchorDropdown.selection.index;
        var anchorPosition = [
            AnchorPosition.TOPLEFT,
            AnchorPosition.TOPCENTER,
            AnchorPosition.TOPRIGHT,
            AnchorPosition.MIDDLELEFT,
            AnchorPosition.MIDDLECENTER,
            AnchorPosition.MIDDLERIGHT,
            AnchorPosition.BOTTOMLEFT,
            AnchorPosition.BOTTOMCENTER,
            AnchorPosition.BOTTOMRIGHT
        ][anchorIndex];

        for (var i = 0; i < selectedLayers.length; i++) {
            var layer = selectedLayers[i];
            app.activeDocument.activeLayer = layer;

            if (layer.typename === "LayerSet"){
                alert("无法对组进行缩放操作，请选择组内的图层。");
                continue;
            }
            if (scaleMode === 0) {
                layer.resize(scaleValue, scaleValue, anchorPosition);
            } else if (scaleMode === 1) {                if (layer.kind === LayerKind.SMARTOBJECT || layer.linkedLayers.length > 0) {
                    var ref = new ActionReference();
                    ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
                    var obj = executeActionGet(ref).getObjectValue(stringIDToTypeID("smartObjectMore"));
                    with(obj) {
                        var _tmp = getObjectValue(stringIDToTypeID("size"));
                        var size = new Object({
                            width: _tmp.getDouble(stringIDToTypeID("width")),
                            height: _tmp.getDouble(stringIDToTypeID("height")),
                        });
                        // alert(size.width + " " + size.height);
                    }
                }

                // 绝对缩放
                layerbound = layer.bounds;                
                var currentWidth = (layerbound[2].as('px') - layerbound[0].as('px'));
                var currentHeight = (layerbound[3].as('px') - layerbound[1].as('px'));
                var w_new = scaleValue*size.width/currentWidth;
                var h_new = scaleValue*size.height/currentHeight;                
                layer.resize(w_new, h_new);
            }

            // 调用居中函数
            centerLayer(layer, anchorPosition);
        }

        // alert("选中图层的缩放和居中操作已完成！");
        dialog.close();
    };

    cancelBtn.onClick = function() {
        dialog.close();
    };

    dialog.show();
}

// 获取当前选中的图层
cTID = function(s) {
    return app.charIDToTypeID(s);
};
sTID = function(s) {
    return app.stringIDToTypeID(s);
};

function newGroupFromLayers(doc) {
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putClass(sTID('layerSection'));
    desc.putReference(cTID('null'), ref);
    var lref = new ActionReference();
    lref.putEnumerated(cTID('Lyr '), cTID('Ordn'), cTID('Trgt'));
    desc.putReference(cTID('From'), lref);
    executeAction(cTID('Mk  '), desc, DialogModes.NO);
};

function undo() {
    executeAction(cTID("undo"), undefined, DialogModes.NO);
};

function getSelectedLayers(doc) {
    var selLayers = [];
    newGroupFromLayers(doc);

    var group = doc.activeLayer;
    var layers = group.layers;

    for (var i = 0; i < layers.length; i++) {
        selLayers.push(layers[i]);
    }

    undo();

    return selLayers;
};

// 添加一个函数来计算图层中心点
function getLayerCenter(layer) {
    var bounds = layer.bounds; // 图层边界
    var xCenter = (bounds[0].as("px") + bounds[2].as("px")) / 2;
    var yCenter = (bounds[1].as("px") + bounds[3].as("px")) / 2;
    return {
        x: xCenter,
        y: yCenter
    };
}

// 添加一个函数来居中图层
function centerLayer(layer, anchorPosition) {
    var doc = app.activeDocument;
    var docWidth = doc.width.as("px");
    var docHeight = doc.height.as("px");

    var layerCenter = getLayerCenter(layer);

    // 根据锚点位置计算目标点
    var targetX = docWidth / 2;
    var targetY = docHeight / 2;

    if (anchorPosition === AnchorPosition.TOPLEFT) {
        targetX = 0;
        targetY = 0;
    } else if (anchorPosition === AnchorPosition.TOPRIGHT) {
        targetX = docWidth;
        targetY = 0;
    } else if (anchorPosition === AnchorPosition.BOTTOMLEFT) {
        targetX = 0;
        targetY = docHeight;
    } else if (anchorPosition === AnchorPosition.BOTTOMRIGHT) {
        targetX = docWidth;
        targetY = docHeight;
    } else if (anchorPosition === AnchorPosition.TOPCENTER) {
        targetX = docWidth / 2;
        targetY = 0;
    } else if (anchorPosition === AnchorPosition.BOTTOMCENTER) {
        targetX = docWidth / 2;
        targetY = docHeight;
    } else if (anchorPosition === AnchorPosition.MIDDLELEFT) {
        targetX = 0;
        targetY = docHeight / 2;
    } else if (anchorPosition === AnchorPosition.MIDDLERIGHT) {
        targetX = docWidth;
        targetY = docHeight / 2;
    }

    // 计算偏移量并移动图层
    var deltaX = targetX - layerCenter.x;
    var deltaY = targetY - layerCenter.y;
    layer.translate(deltaX, deltaY);
}



// 持久化存储用户配置
function saveSettings(settings) {
    try {
        var settingsFile = new File(Folder.userData + "/photoshop_layer_scaling_settings.json");
        if (settingsFile.open("w")) {
            settingsFile.write(JSON.stringify(settings));
            settingsFile.close();
        } else {
            alert("无法打开文件进行写入。");
        }
    } catch (e) {
        alert("无法保存配置: " + e.message);
    }
}

// 读取持久化配置
function getSettings() {
    try {
        var settingsFile = new File(Folder.userData + "/photoshop_layer_scaling_settings.json");
        if (settingsFile.exists && settingsFile.open("r")) {
            var content = settingsFile.read();
            settingsFile.close();
            return JSON.parse(content);
        }
    } catch (e) {
        alert("无法读取配置: " + e.message);
    }
    return {};
}

// 调用主函数
scaleSelectedLayers();