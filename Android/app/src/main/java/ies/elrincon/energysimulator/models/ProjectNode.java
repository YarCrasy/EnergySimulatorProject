package ies.elrincon.energysimulator.models;

import org.json.JSONException;
import org.json.JSONObject;

public class ProjectNode {
    private Long id;
    private Long elementId;
    private float positionX;
    private float positionY;
    private String type;
    private String data;
    private EnergyElement element;

    public ProjectNode() {
    }

    public ProjectNode(JSONObject json) {
        if (json == null) {
            return;
        }
        if (json.has("id") && !json.isNull("id")) {
            id = json.optLong("id");
        }
        JSONObject elementObject = json.optJSONObject("element");
        if (elementObject != null) {
            element = new EnergyElement(elementObject);
            elementId = element.getId();
        } else if (json.has("elementIdReference") && !json.isNull("elementIdReference")) {
            elementId = json.optLong("elementIdReference");
        }
        positionX = (float) json.optDouble("positionX", 0d);
        positionY = (float) json.optDouble("positionY", 0d);
        type = json.optString("type", "");
        data = json.optString("data", "");
    }

    public JSONObject toJson() throws JSONException {
        JSONObject object = new JSONObject();
        if (id != null) {
            object.put("id", id);
        }
        object.put("element", new JSONObject().put("id", elementId));
        object.put("positionX", positionX);
        object.put("positionY", positionY);
        object.put("type", type != null ? type : "");
        object.put("data", data != null ? data : "");
        return object;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getElementId() {
        return elementId;
    }

    public void setElementId(Long elementId) {
        this.elementId = elementId;
    }

    public float getPositionX() {
        return positionX;
    }

    public void setPositionX(float positionX) {
        this.positionX = positionX;
    }

    public float getPositionY() {
        return positionY;
    }

    public void setPositionY(float positionY) {
        this.positionY = positionY;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }

    public EnergyElement getElement() {
        return element;
    }

    public void setElement(EnergyElement element) {
        this.element = element;
        this.elementId = element != null ? element.getId() : null;
    }
}
