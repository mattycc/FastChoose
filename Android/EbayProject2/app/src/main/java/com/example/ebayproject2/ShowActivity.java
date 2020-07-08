package com.example.ebayproject2;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.text.Html;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.MenuItem;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.text.HtmlCompat;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.yqritc.recyclerviewflexibledivider.HorizontalDividerItemDecoration;
import com.yqritc.recyclerviewflexibledivider.VerticalDividerItemDecoration;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import org.json.JSONArray;
import org.json.JSONObject;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.List;

public class ShowActivity extends AppCompatActivity {
    String TAG = "cmt";
    String kwd;
    private ProgressBar mProgressBar;
    private TextView loadText;
    private TextView test;
    String jsonString;
    //    private ArrayList<String> condition = new ArrayList<>();
    private String[] condition = new String[3];
    private RecyclerView recyclerView;
    private ArrayList<String> listsss;
    private RecyclerView.Adapter mAdapter;
    private RecyclerView.LayoutManager layoutManager;
    private RecyclerView mRvMain;
    private RecyclerView mRecyclerView;
    private MyAdapter mMyAdapter;
    private LinearLayout process;
    private LinearLayoutManager mLayoutManager;
    private RelativeLayout mSuspensionBar;
    private TextView mSuspensionTv;
    private int mSuspensionHeight;
    private int mCurrentPosition = 0;
    private RequestQueue queue;
    private JsonObject jsonObj;
    public String cmtUrl;
    private JsonArray jsonArray = null;
    Context context;
    TextView topresult;

    final Handler handler = new Handler();
    private SwipeRefreshLayout mSwipeRefreshLayout;
    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        finish();
        return true;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.show_layout);
//        View view = LayoutInflater.from(this).inflate(R.layout.item, null);
        mSwipeRefreshLayout = (SwipeRefreshLayout) findViewById(R.id.swiperefresh_items);
        Log.d(TAG, "onCreate");
        context = this;
        process = (LinearLayout)findViewById(R.id.processing);
//        initData();
        queue = Volley.newRequestQueue(ShowActivity.this);
        cmtUrl = buildUrl();
        Log.d(TAG, "url"+cmtUrl);
        process.setVisibility(View.VISIBLE);
//        mProgressBar = (ProgressBar) findViewById(R.id.loading);
//        mProgressBar.setVisibility(View.GONE);
//        loadText = (TextView)findViewById(R.id.loadtext);
//        loadText.setVisibility(View.GONE);
//        mProgressBar.setVisibility(View.VISIBLE);
//        loadText.setVisibility(View.VISIBLE);
        final StringRequest stringRequest = new StringRequest(Request.Method.GET, cmtUrl, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                Log.d(TAG, response);
                showData(response);
            }
        },new Response.ErrorListener(){
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.d(TAG, "onErrorResponse: error");
//                test.setText(getString(R.string.error));
            }
        });
        queue.add(stringRequest);

        mSwipeRefreshLayout.setOnRefreshListener(new SwipeRefreshLayout.OnRefreshListener() {
            @Override
            public void onRefresh() {
                // Your code to make your refresh action
                // CallYourRefreshingMethod();
                final StringRequest stringRequest = new StringRequest(Request.Method.GET, cmtUrl, new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        Log.d(TAG, response);
                        showData(response);
                    }
                },new Response.ErrorListener(){
                    @Override
                    public void onErrorResponse(VolleyError error) {
//                test.setText(getString(R.string.error));
                    }
                });
                queue.add(stringRequest);
                handler.postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        if(mSwipeRefreshLayout.isRefreshing()) {
                            mSwipeRefreshLayout.setRefreshing(false);
                        }
                    }
                }, 2000);
            }
        });

//        @Override
//        public void onRefresh(){
//            new Handler().postDelayed(new Runnable() {
//                @Override
//                public void run() {
//                    mSwipeRefreshLayout.setRefreshing(false);
//                }
//            },4000);
//        }

//// 设置布局
//        LinearLayoutManager linearLayoutManager = new LinearLayoutManager(this);
//        mRvMain.setLayoutManager(linearLayoutManager);

        }

    private void showData(String response) {
//        Log.d(TAG, "showData");
        JsonParser parse =new JsonParser();
        JsonElement jsonElement = parse.parse(response);
        if(jsonElement.isJsonArray()){
            jsonArray = jsonElement.getAsJsonArray();
        }
//        Log.d(TAG, "showData: ja");
//        Log.d(TAG, "jarray" + jsonArray);
        if(jsonArray.size()!=0) {
            topresult = (TextView) findViewById(R.id.topresult);
            String html4 = "<p>Showing <span style='color:#4F64AA'>" + jsonArray.size() + "</span> results for <span style='color:#5574CF'>" + kwd + "</span> </p>";
            topresult.setText(Html.fromHtml(html4, HtmlCompat.FROM_HTML_MODE_LEGACY));
            mRecyclerView = findViewById(R.id.recycler_view);
            mMyAdapter = new MyAdapter(response, this);
//        mLayoutManager = new LinearLayoutManager(this);
//        mRecyclerView.setLayoutManager(mLayoutManager);
            final GridLayoutManager gridLayoutManager
                    = new GridLayoutManager(context, 2);
//        mSuspensionBar = (RelativeLayout) findViewById(R.id.suspension_bar);
            mRecyclerView.setLayoutManager(gridLayoutManager);
            mRecyclerView.setAdapter(mMyAdapter);
            mRecyclerView.addItemDecoration(new HorizontalDividerItemDecoration.Builder(context).sizeResId(R.dimen.divider).build());
            mRecyclerView.addItemDecoration(new VerticalDividerItemDecoration.Builder(context).sizeResId(R.dimen.divider).build());
            mRecyclerView.setHasFixedSize(true);
            mMyAdapter.setOnItemClickListener(new MyAdapter.OnItemClickListener() {
                @Override
                public void onClick(int position) {
//                    Toast.makeText(ShowActivity.this,"您点击了"+position+"行",Toast.LENGTH_SHORT).show();
                    Intent intent = new Intent(ShowActivity.this, DeInfoActivity.class);
                    Bundle bundle = new Bundle();
//                    intent.putExtra("name", jsonArray.get(position).toString());
                    bundle.putString("jsonArray",jsonArray.get(position).toString());

//                    bundle.putString("itemID",jsonArray.get(position).getAsJsonObject().get("ItemID").toString());
//                    bundle.putString("title",jsonArray.get(position).getAsJsonObject().get("Title").toString());
                    intent.putExtras(bundle);
                    startActivity(intent);
                }
            });
//            mProgressBar.setVisibility(View.GONE);
//            loadText.setVisibility(View.GONE);
            process.setVisibility(View.GONE);
        }else{
            process.setVisibility(View.GONE);
            Log.d(TAG, "norecords");
            TextView err = (TextView) findViewById(R.id.noresult);
            err.setVisibility(View.VISIBLE);
            Toast.makeText(this, "No Records", Toast.LENGTH_SHORT).show();
        }

    }

    public String buildUrl(){
        StringBuilder url = new StringBuilder("https://fast-spanner-278817.wl.r.appspot.com/android?");
        Bundle bundle = new Bundle();
        bundle = this.getIntent().getExtras();
        kwd = bundle.getString("keyword");
        url.append("Keywords=").append(kwd);
        if(bundle.getFloat("minPrice")!=-1) {
            float iPrice = bundle.getFloat("minPrice");
            url.append("&MinPirce=").append(iPrice);
        }
        if(bundle.getFloat("maxPrice")!=-1){
            float aPrice = bundle.getFloat("maxPrice");
            url.append("&MaxPrice=").append(aPrice);
        }
        int i = bundle.getInt("num");
        if(bundle.getString("ConditionStatus").equals("specified")) {
            while (i >= 0) {
                String condi = "Condition" + i;
                condition[i] = bundle.getString(condi);
                url.append("&").append(condi).append("=").append(condition[i]);
                i--;
            }
        }
        String sortOrder = bundle.getString("sortOrder");
        url.append("&sortOrder=").append(sortOrder);
//        test.setText(url);
        return url.toString();
    }


}

