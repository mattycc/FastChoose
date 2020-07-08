package com.example.ebayproject2;

import androidx.appcompat.app.ActionBar;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.core.content.ContextCompat;
import androidx.viewpager.widget.ViewPager;

import android.graphics.ColorFilter;
import android.graphics.PorterDuff;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.content.Intent;

import com.google.android.material.tabs.TabLayout;
import androidx.fragment.app.Fragment;

import java.util.ArrayList;

import android.view.View;
import android.widget.LinearLayout;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

public class DeInfoActivity extends AppCompatActivity {
    String TAG = "Defo";
    private JsonObject itemJson;
    private String title;
    private String link;
    private String shipInfo;
    private String itemUrl;
    private RequestQueue queue2;
    private JsonObject jsonObject;
    private String itemID;
    private TabLayout tabLayout;
    private ViewPager viewPager;
    private LinearLayout process;
    private ArrayList<Fragment> fragments;
    private String pri;
    private String shipCost;
    private ArrayList<String> titles = new ArrayList<String>();
    final int img[]={R.drawable.information_variant_selected,R.drawable.sellershop,R.drawable.truck_delivery_selected};
//          添加自定义

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        finish();
        return true;
    }
    @Override
    protected void onCreate(Bundle savedInstanceState) {
//        this.supportRequestWindowFeature(Window.FEATURE_NO_TITLE);
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_deinfo);
        tabLayout = (TabLayout) findViewById(R.id.tablayout);
        viewPager = (ViewPager) findViewById(R.id.viewpager);
        init();
//        Log.d(TAG, tabLayout.getTabAt(0).getText().toString());
        process = (LinearLayout)findViewById(R.id.processing);
//("PRODUCT","SELLER INFO","SHIPPING")
        Bundle bundle = new Bundle();
        bundle = this.getIntent().getExtras();
        String jsonArray = bundle.getString("jsonArray");
        JsonParser parse =new JsonParser();
        JsonElement jsonElement = parse.parse(jsonArray);
        if(jsonElement.isJsonObject()){
            itemJson = jsonElement.getAsJsonObject();
        }
        title = itemJson.get("Title").toString();
        link = itemJson.get("Link").toString();
        shipCost = itemJson.get("ShippingCost").toString();
        pri = itemJson.get("Price").getAsString();
        shipInfo = itemJson.get("shippingInfo").getAsJsonObject().toString();
//        Log.d(TAG, "onCreate: sellerinfo");
////        Log.d(TAG, sellerInfo.toString());
        queue2 = Volley.newRequestQueue(DeInfoActivity.this);
        itemID = itemJson.get("ItemID").toString();
        itemUrl  = "https://fast-spanner-278817.wl.r.appspot.com/item?ItemID=" + itemID.substring(1,itemID.length()-1);
        Log.d(TAG, "itemurl"+itemUrl);
        final StringRequest stringRequest = new StringRequest(Request.Method.GET, itemUrl, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
//                Log.d(TAG, "onResponse: haha");
                Log.d(TAG, response);
                showData(response);
            }
        },new Response.ErrorListener(){
            @Override
            public void onErrorResponse(VolleyError error) {
//                test.setText(getString(R.string.error));
                Log.d(TAG, "onErrorResponse: ");
            }
        });
        queue2.add(stringRequest);
        Log.d(TAG, "onCreate: whywhywhy");
        Toolbar myToolbar = (Toolbar) findViewById(R.id.my_toolbar);
        myToolbar.inflateMenu(R.menu.actions);
        myToolbar.setTitle(title.substring(1,title.length()-1));
        setSupportActionBar(myToolbar);
        ActionBar ab = getSupportActionBar();
        // Enable the Up button
        ab.setDisplayHomeAsUpEnabled(true);
        myToolbar.setOnMenuItemClickListener(new Toolbar.OnMenuItemClickListener() {
            @Override
            public boolean onMenuItemClick(MenuItem item) {
                switch (item.getItemId()) {
                    case R.id.out:
//                        Toast.makeText(DeInfoActivity.this, "out !", Toast.LENGTH_SHORT).show();
                        Intent intent = new Intent();
                        intent.setData(Uri.parse(link.substring(1,link.length()-1)));//Url 就是你要打开的网址
                        intent.setAction(Intent.ACTION_VIEW);
                        startActivity(intent); //启动浏览器
                        break;
                }
                return true;
            }
        });


//        getActionBar().setTitle("title");
//        Log.d(TAG, "onCreate: haha"+);
//        getMenuInflater().inflate(R.menu.actions,menu);
    }

    private void init() {


    }


    private void showData(String response) {
//        Log.d(TAG, "showData");
//        Log.d(TAG, response);
        JsonParser parse = new JsonParser();
        JsonElement jsonElement = parse.parse(response);
        if (jsonElement.isJsonObject()) {
            jsonObject = jsonElement.getAsJsonObject();
        }
//        Log.d(TAG, "showData: jsonObject");
//        Log.d(TAG, jsonObject.toString());
        String pic = jsonObject.get("PictureURL").toString();
        String fea = jsonObject.get("Feature").toString();
        String spe = jsonObject.get("Speci").getAsJsonObject().toString();
        String sell = jsonObject.get("Seller").toString();
        String returnPolicy = jsonObject.get("ReturnPolicy").toString();
        Log.d(TAG, "showData: return" +returnPolicy);
//        fragments.add(FragmentOne.newInstance(pic,fea,spe));
        titles.add("PRODUCT");
        titles.add("SELLER INFO");
        titles.add("SHIPPING");
        fragments = new ArrayList<>();
//        fragments.add(new FragmentOne());
//        fragments.add(new FragmentTwo());
//        fragments.add(new FragmentThree());
//        String pic = "[\"https://i.ebayimg.com/00/s/OTkwWDEwMDA=/z/vrQAAOSwZIxe-C3Y/$_57.JPG?set_id=8800005007\",\"https://i.ebayimg.com/00/s/MTIwMFgxNjAw/z/Co8AAOSwKx9e-CxM/$_57.JPG?set_id=8800005007\",\"https://i.ebayimg.com/00/s/MTIwMFgxNjAw/z/ousAAOSwQMle-CxO/$_57.JPG?set_id=8800005007\",\"https://i.ebayimg.com/00/s/MTIwMFgxNjAw/z/Zt0AAOSwS4Ve-CxQ/$_57.JPG?set_id=8800005007\",\"https://i.ebayimg.com/00/s/MTIwMFgxNjAw/z/lt8AAOSwrWpe-CxS/$_57.JPG?set_id=8800005007\"]";
        fragments.add(FragmentOne.newInstance(pic,fea,spe,title,pri,shipCost));
        fragments.add(FragmentTwo.newInstance(sell,returnPolicy));
        fragments.add(FragmentThree.newInstance(shipInfo));
        Log.d(TAG, "showData: shipinfo"+shipInfo);
        Log.d(TAG, "init: "+fragments.size());
        viewPager.setAdapter(new MyFmPagerAdapter(getSupportFragmentManager(),titles,fragments));
        process.setVisibility(View.VISIBLE);
        Handler handler = new Handler();
        handler.postDelayed(new Runnable(){
            @Override
            public void run(){
                process.setVisibility(View.GONE);//view是要bai隐藏的控du件
            }
        },1000);    //3000毫秒后执行zhi

        tabLayout.setupWithViewPager(viewPager,false);
        tabLayout.getTabAt(0).setIcon(img[0]);
        tabLayout.getTabAt(1).setIcon(img[1]);
        int tabIconColor = ContextCompat.getColor(this, R.color.ic_launcher_background);
        tabLayout.getTabAt(1).getIcon().setColorFilter(tabIconColor, PorterDuff.Mode.SRC_IN);
        tabLayout.getTabAt(2).setIcon(img[2]);
//        process.setVisibility(View.VISIBLE);

        //        fragments.add(FragmentTwo.newInstance(sell,returnPolicy));
//        fragments.add(FragmentThree.newInstance(shipInfo));

//            topresult.setText(Html.fromHtml(html4, HtmlCompat.FROM_HTML_MODE_LEGACY));

//        process.setVisibility(View.GONE);

    }


    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.actions, menu);
        return true;
    }
//    public boolean onGroupItemClick(MenuItem item) {
//        switch (item.getItemId()) {
//            case R.id.out:
//                // User chose the "Settings" item, show the app settings UI...
//                Intent openURL = new Intent(Intent.ACTION_VIEW);
//                openURL.data = Uri.parse("https://www.google.com/");
//                startActivity(openURL);
//
//            default:
//                // If we got here, the user's action was not recognized.
//                // Invoke the superclass to handle it.
//                return super.onOptionsItemSelected(item);
//        }
//    }

}

