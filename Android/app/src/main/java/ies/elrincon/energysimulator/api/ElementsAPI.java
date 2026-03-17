package ies.elrincon.energysimulator.api;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import ies.elrincon.energysimulator.models.EnergyElement;

public final class ElementsAPI {
    private ElementsAPI() {
    }

    public static List<EnergyElement> getAllElements() throws IOException, JSONException {
        JSONArray elementsArray = ApiConnection.getArray("elements");
        List<EnergyElement> elements = new ArrayList<>();
        for (int i = 0; i < elementsArray.length(); i++) {
            JSONObject object = elementsArray.optJSONObject(i);
            if (object != null) {
                elements.add(new EnergyElement(object));
            }
        }
        return elements;
    }
}
