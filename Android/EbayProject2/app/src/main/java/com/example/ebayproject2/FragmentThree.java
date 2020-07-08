package com.example.ebayproject2;

import android.os.Bundle;

import androidx.core.text.HtmlCompat;
import androidx.fragment.app.Fragment;

import android.text.Html;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import java.util.Iterator;
import java.util.Map;

/**
 * A simple {@link Fragment} subclass.
 * Use the {@link FragmentThree#newInstance} factory method to
 * create an instance of this fragment.
 */
public class FragmentThree extends Fragment {

    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String shipInfo;
    private JsonObject shipjson;

    public FragmentThree() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @return A new instance of fragment FragmentThree.
     */
    // TODO: Rename and change types and number of parameters
    public static FragmentThree newInstance(String shipInfo) {
        FragmentThree fragment = new FragmentThree();
        Bundle args = new Bundle();
        args.putString("shipInfo", shipInfo);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onStart() {
        super.onStart();
        if (getArguments() != null) {
            //ship
            TextView shipbox = (TextView) getView().findViewById(R.id.ship);
            String shiptext = "<p><strong>Shipping Information</strong></p>";
            shipbox.setText(Html.fromHtml(shiptext, HtmlCompat.FROM_HTML_MODE_LEGACY));
            //shipdet
            TextView shipdetbox = (TextView) getView().findViewById(R.id.detship);
            shipInfo = getArguments().getString("shipInfo");
            JsonParser parse = new JsonParser();
            JsonElement jsonElement = parse.parse(shipInfo);
            if (jsonElement.isJsonObject()) {
                shipjson = jsonElement.getAsJsonObject();
            }
            String shipdettext = "<ul>";
            Iterator iter = shipjson.entrySet().iterator();
            while (iter.hasNext()) {
                String val;
                Map.Entry entry = (Map.Entry) iter.next();
                String key = entry.getKey().toString();
                Log.d("key", key);
                if (!key.equals("shippingServiceCost")) {
//                    Log.d("key22222", key);
                    String cleanText = key.replaceAll("\\d+", "").replaceAll("(.)([A-Z])", "$1 $2");

                    val = entry.getValue().toString();
                    Log.d("val", val);
                    shipdettext += "<li><strong>" + cleanText + "</strong>: " + val.substring(2, val.length() - 2) + "</li>";
                    Log.d("shiptext", shipdettext);
                }
            }
            shipdettext += "</ul>";
            Log.d("onStart: ",shipdettext);
                shipdetbox.setText(Html.fromHtml(shipdettext, HtmlCompat.FROM_HTML_MODE_LEGACY));
            }
        }


    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            shipInfo = getArguments().getString("shipInfo");
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_three, container, false);
    }
}