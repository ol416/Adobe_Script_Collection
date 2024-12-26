// 获取当前智能对象的详细信息
function getSmartObjectResolution() {
    try {
        // 创建引用目标图层的 ActionReference
        var ref = new ActionReference();
        ref.putProperty(app.stringIDToTypeID("property"), app.stringIDToTypeID("smartObjectMore"));
        ref.putEnumerated(app.stringIDToTypeID("layer"), app.stringIDToTypeID("ordinal"), app.stringIDToTypeID("targetEnum"));
        
        // 获取图层描述符
        var desc = executeActionGet(ref);
        
        // 检查是否包含智能对象信息
        if (desc.hasKey(app.stringIDToTypeID("smartObjectMore"))) {
            var smartObjectInfo = desc.getObjectValue(app.stringIDToTypeID("smartObjectMore"));
            
            // 获取分辨率
            if (smartObjectInfo.hasKey(app.stringIDToTypeID("resolution"))) {
                var resolution = smartObjectInfo.getDouble(app.stringIDToTypeID("resolution"));
                return resolution; // 返回分辨率
            } else {
                throw new Error("智能对象中未找到分辨率信息！");
            }
        } else {
            throw new Error("当前图层不是智能对象！");
        }
    } catch (e) {
        alert("获取智能对象分辨率失败: " + e.message);
        return null;
    }
}

var resolution = getSmartObjectResolution();
if (resolution !== null) {
    alert("智能对象分辨率为: " + resolution + " ppi");
}
