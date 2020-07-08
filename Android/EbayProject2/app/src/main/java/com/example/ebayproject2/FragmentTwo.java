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
 * Use the {@link FragmentTwo#newInstance} factory method to
 * create an instance of this fragment.
 */
public class FragmentTwo extends Fragment {

    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String seller;
    private JsonObject sellerjson;
    private JsonObject retjson;

    private String returnPolicy;

    public FragmentTwo() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @return A new instance of fragment FragmentTwo.
     */
    // TODO: Rename and change types and number of parameters
    public static FragmentTwo newInstance(String seller, String returnPolicy) {
        FragmentTwo fragment = new FragmentTwo();
        Bundle args = new Bundle();
        args.putString("seller", seller);
        args.putString("returnPolicy", returnPolicy);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onStart() {
        super.onStart();
        if (getArguments() != null) {
            seller = getArguments().getString("seller");
            returnPolicy = getArguments().getString("returnPolicy");
            Log.d("fTwo", "onStart: ret2222"+returnPolicy);

            //sell
            TextView selbox = (TextView)getView().findViewById(R.id.sell);
            String seltext = "<p><strong>Seller Information</strong></p>";
            selbox.setText(Html.fromHtml(seltext, HtmlCompat.FROM_HTML_MODE_LEGACY));
            //selldet
            TextView seldetbox = (TextView)getView().findViewById(R.id.detsell);
            JsonParser parse =new JsonParser();
            JsonElement jsonElement = parse.parse(seller);
            if(jsonElement.isJsonObject()){
                sellerjson = jsonElement.getAsJsonObject();
            }
            String dseltext = "<ul>";
            Iterator iter = sellerjson.entrySet().iterator();
            while (iter.hasNext()) {
                Map.Entry entry = (Map.Entry) iter.next();
                String key = entry.getKey().toString();
                String val = entry.getValue().toString();
                val = val.replace("\"","");
                String cleanText = key.replaceAll("\\d+", "").replaceAll("(.)([A-Z])", "$1 $2");
                Log.d("kvvvvvvvvvv", cleanText +"-----" +val);

                dseltext += "<li><strong>" + cleanText + "</strong>: " + val + "</li>";
            }
            dseltext += "</ul>";
            seldetbox.setText(Html.fromHtml(dseltext, HtmlCompat.FROM_HTML_MODE_LEGACY));

            //ret
            Log.d("fTwo", "onStart: ret"+returnPolicy);
            TextView retbox = (TextView)getView().findViewById(R.id.ret);
            String rettext = "<p><strong>Return Policies</strong></p>";
            retbox.setText(Html.fromHtml(rettext, HtmlCompat.FROM_HTML_MODE_LEGACY));
            //detret
            TextView retdetbox = (TextView)getView().findViewById(R.id.detret);
            JsonElement jsonElement2 = parse.parse(returnPolicy);
            if(jsonElement2.isJsonObject()){
                retjson = jsonElement2.getAsJsonObject();
            }
            String drettext = "<ul>";
            Iterator iter2 = retjson.entrySet().iterator();
            while (iter2.hasNext()) {
                Map.Entry entry = (Map.Entry) iter2.next();
                String key2 = entry.getKey().toString();
                String val2 = entry.getValue().toString();
                String cleanText = key2.replaceAll("\\d+", "").replaceAll("(.)([A-Z])", "$1 $2");
                drettext += "<li><strong>" + cleanText + "</strong>: " + val2.substring(1,val2.length()-1) + "</li>";
            }
            drettext += "</ul>";
            retdetbox.setText(Html.fromHtml(drettext, HtmlCompat.FROM_HTML_MODE_LEGACY));

//            mParam1 = getArguments().getString(ARG_PARAM1);
//            mParam2 = getArguments().getString(ARG_PARAM2);
        }
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            seller = getArguments().getString("Seller");
            returnPolicy = getArguments().getString("ReturnPolicy");

//            mParam1 = getArguments().getString(ARG_PARAM1);
//            mParam2 = getArguments().getString(ARG_PARAM2);
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_two, container, false);
    }
}