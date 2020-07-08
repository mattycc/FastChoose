package com.example.ebayproject2;

import android.os.Bundle;

import androidx.core.text.HtmlCompat;
import androidx.fragment.app.Fragment;

import android.os.Handler;
import android.text.Html;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.squareup.picasso.Picasso;

import java.util.Iterator;
import java.util.Map;


/**
 * A simple {@link Fragment} subclass.
 * Use the {@link FragmentOne#newInstance} factory method to
 * create an instance of this fragment.
 */
public class FragmentOne extends Fragment {

    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;
    private String pic;
    private String fea;
    private String spe;
    private String pri;
    private String ship;
    private String TAG = "fOne";
    private String[] pics;
    private View view;
    private LinearLayout imgG;
    private String title;
    private JsonObject feajson;
    private JsonObject spejson;
    private JsonObject prijson;
    private JsonObject titlejson;
    private JsonObject shipjson;

    private LinearLayout process;

    public FragmentOne() {
        // Required empty public constructor
    }


    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @return A new instance of fragment FragmentOne.
     */
    // TODO: Rename and change types and number of parameters
    public static FragmentOne newInstance(String pic, String fea, String spe, String title, String pri, String ship) {
        FragmentOne fragment = new FragmentOne();
        Bundle args = new Bundle();
        args.putString("pic", pic);
        args.putString("fea", fea);
        args.putString("spe", spe);
        args.putString("title",title);
        args.putString("pri",pri);
        args.putString("ship",ship);
        fragment.setArguments(args);
        return fragment;
    }

    public static FragmentOne newInstance(String s) {
        Bundle bundle = new Bundle();
        bundle.putString("text", s);
        FragmentOne blankFragment = new FragmentOne();
        blankFragment.setArguments(bundle);
        return blankFragment;
    }

    @Override
    public void onStart() {
        super.onStart();
        process = (LinearLayout) view.findViewById(R.id.processing);
//        process.setVisibility(View.VISIBLE);
//        Handler handler = new Handler();
//        handler.postDelayed(new Runnable(){
//            @Override
//            public void run(){
//                process.setVisibility(View.GONE);//view是要bai隐藏的控du件
//            }
//        },1000);    //3000毫秒后执行zhi

        if (getArguments() != null) {
            imgG = (LinearLayout) view.findViewById(R.id.imgG);
            pic = getArguments().getString("pic");
            pics = pic.substring(1, pic.length() - 1).split(",");
            fea = getArguments().getString("fea");
            spe = getArguments().getString("spe");
            title = getArguments().getString("title");
            pri = getArguments().getString("pri");
            ship = getArguments().getString("ship");
            Log.d(TAG, pics.toString());
            //pic
            for (int i = 0; i < pics.length; i++) {
                Log.d(TAG, "i:" + i + "url:   " + pics[i]);
            }
            for (int i = 0; i < pics.length; i++) {
                String iPic = pics[i];
                iPic = iPic.substring(1, iPic.length() - 1);
//                Log.d(TAG, "onCreateView: ipic" + i + iPic);
                ImageView imageView = new ImageView((getActivity()));
//                ViewGroup.LayoutParams lp = ImageView.getLayoutParams();
//                lp.width = 100;
                imageView.setLayoutParams(new android.view.ViewGroup.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.MATCH_PARENT));
                imageView.setPadding(12,12,12,12);
                imageView.setAdjustViewBounds(true);
                imageView.setMaxHeight(300);
//                imageView.setMaxWidth();
                Picasso.with(getActivity()).load(iPic).into(imageView);
                imageView.setScaleType(ImageView.ScaleType.FIT_CENTER);
                imgG.addView(imageView);
            }
            //title
            TextView titlebox = (TextView)view.findViewById(R.id.titleInfo);
            String titletext = "<p style='color:#000000'>" + title.substring(1,title.length()-1) + "</p>";
            //price + ship
//            TextView pribox = (TextView)view.findViewById(R.id.priInfo);
            titletext += "<p><strong><span style='color:#8EA851'>$" + pri + "</span></strong> ";
            //ship
            if (ship.substring(1, ship.length() - 1).equals("0.0")) {
                titletext += "<span  style='color:#8E8C8C; font-size: 10dp'>FREE Shipping</span> </p>";
            } else {
                titletext += "<span  style='color:#8E8C8C; font-size: 10px'> Ships for $" + ship.substring(1, ship.length() - 1) + "</span></p>";
            }
            titlebox.setText(Html.fromHtml(titletext, HtmlCompat.FROM_HTML_MODE_LEGACY));

//            pribox.setText(Html.fromHtml(pritext, HtmlCompat.FROM_HTML_MODE_LEGACY));
            //fea
            TextView feabox = (TextView)view.findViewById(R.id.fea);
            String feati = "<p><strong>Product Features</strong></p>";
            feabox.setText(Html.fromHtml(feati, HtmlCompat.FROM_HTML_MODE_LEGACY));
            //feadel
            TextView feadelbox = (TextView)view.findViewById(R.id.detfea);
            String featext = "";
            JsonParser parse =new JsonParser();
            JsonElement jsonElement = parse.parse(fea);
            if(jsonElement.isJsonObject()){
                feajson = jsonElement.getAsJsonObject();
            }
            Iterator iter = feajson.entrySet().iterator();
            while (iter.hasNext()) {
                Map.Entry entry = (Map.Entry) iter.next();
                String key = entry.getKey().toString();
                String val = entry.getValue().toString();
                featext += "<p><strong>" +key + "</strong>: " + val.substring(2,val.length()-2) + "</p>";
            }
//
//            if(feajson.has("Brand")){
//                String brand = feajson.get("Brand").toString();
//                featext += "<p>Brand    " + brand.substring(2,brand.length()-2) + "</p>";
//            }
//            if(feajson.has("Subtitle")){
//                String subtitle = feajson.get("Subtitle").toString();
//                featext += "<p>Subtitle    " + subtitle.substring(1,subtitle.length()-1) + "</p>";
//            }
            feadelbox.setText(Html.fromHtml(featext, HtmlCompat.FROM_HTML_MODE_LEGACY));
            //spe
            TextView spebox = (TextView)view.findViewById(R.id.spe);
            String speti = "<p><strong>Specifications</strong></p>";
            spebox.setText(Html.fromHtml(speti, HtmlCompat.FROM_HTML_MODE_LEGACY));
            //spedel
            Log.d(TAG, "onStart: spe" +spe);
            JsonElement jsonElement2 = parse.parse(spe);
            if(jsonElement2.isJsonObject()){
                spejson = jsonElement2.getAsJsonObject();
            }
            TextView spedelbox = (TextView)view.findViewById(R.id.detspe);
            String spetext = "<ul>";
            Iterator iter2 = spejson.entrySet().iterator();
            while (iter2.hasNext()) {
                Map.Entry entry = (Map.Entry) iter2.next();
                String key2 = entry.getKey().toString();
                String val2 = entry.getValue().toString();
                Log.d(TAG, "onStart: "+key2 +"-----" +val2);
                spetext += "<li><strong>" +key2 + "</strong>: " + val2.substring(2,val2.length()-2) + "</li>";
            }
            spetext += "</ul>";
            spedelbox.setText(Html.fromHtml(spetext, HtmlCompat.FROM_HTML_MODE_LEGACY));

//            JsonElement jsonElement2 = parse.parse(spe);
//            if(jsonElement.isJsonObject()){
//                spejson = jsonElement.getAsJsonObject();
//            }

//            titlebox.setText(title);
//            feabox.setText(feajson);
//            spebox.setText(spe);
//            process.setVisibility(View.GONE);

        }
    }


    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        super.onActivityCreated(savedInstanceState);
        // Inflate the layout for this fragment
        view = inflater.inflate(R.layout.fragment_one, container, false);

        return view;
    }

//    @Override
//    public View onActivityCreated(LayoutInflater inflater, ViewGroup container,
//                             Bundle savedInstanceState) {
//
//        // Inflate the layout for this fragment
//        view = inflater.inflate(R.layout.fragment_one, container, false);
//        return view;
//    }


    private void showProduct(){
        Log.d(TAG, "onStart: "+pic);
        imgG = (LinearLayout) view.findViewById(R.id.imgG);
        pics = pic.substring(1,pic.length()-1).split(",");
        Log.d(TAG, pics.toString());
        for(int i=0;i<pics.length; i++){
            Log.d(TAG, "i:"+i+"url:   "+pics[i]);
        }
//            showProduct();
        for(int i=0; i<pics.length;i++){
            String iPic = pics[i];
            iPic = iPic.substring(1,iPic.length()-1);
            Log.d(TAG, "onCreateView: ipic"+i+iPic);
            ImageView imageView = new ImageView((getActivity()));
            imageView.setLayoutParams(new android.view.ViewGroup.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.MATCH_PARENT));
            imageView.setPadding(20,20,20,20);
            Picasso.with(getActivity()).load(iPic).into(imageView);
            imageView.setScaleType(ImageView.ScaleType.FIT_CENTER);
            imgG.addView(imageView);
            TextView titlebox = (TextView)view.findViewById(R.id.titleInfo);
            TextView feabox = (TextView)view.findViewById(R.id.fea);
            TextView spebox = (TextView)view.findViewById(R.id.spe);
            titlebox.setText(title);
            feabox.setText(fea);
            spebox.setText(spe);
    }

}
}