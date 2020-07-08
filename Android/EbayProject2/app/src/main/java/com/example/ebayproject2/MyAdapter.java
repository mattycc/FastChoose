package com.example.ebayproject2;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.text.Html;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.core.text.HtmlCompat;
import androidx.recyclerview.widget.RecyclerView;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;
import com.squareup.picasso.Picasso;

import org.w3c.dom.Text;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class MyAdapter extends RecyclerView.Adapter<MyAdapter.ViewHolder> {
    //数据源
    Context context1;
//    private RecyclerViewOnItemClickListener onItemClickListener;
    private OnItemClickListener onItemClickListener;

    String TAG="cmt1";
    private String img;
    JsonArray jsonArray = null;;
    public MyAdapter(String response, Context context) {
        context1 = context;
        JsonParser parse =new JsonParser();
        JsonElement jsonElement = parse.parse(response);
        if(jsonElement.isJsonArray()){
            jsonArray = jsonElement.getAsJsonArray();
        }
        Log.d(TAG, "3333333");
    }

    //返回item个数
    @Override
    public int getItemCount() {
        return jsonArray.size();
    }

    //创建ViewHolder
    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
//        View root = LayoutInflater.from(parent.getContext()).inflate(R.layout.item, parent, false);
//        ViewHolder vh = new ViewHolder(root);
//        //为Item设置点击事件
//        root.setOnClickListener(this);
//        root.setOnLongClickListener(this);
//        return vh;
        View view = LayoutInflater.from(context1).inflate(R.layout.item, parent, false);
        ViewHolder holder = new ViewHolder(view);
        return holder;

//        return new ViewHolder(LayoutInflater.from(parent.getContext()).inflate(R.layout.item, parent, false));
    }


    //填充视图
    @Override
    public void onBindViewHolder(@NonNull final ViewHolder holder, final int position) {
//        String s = String.valueOf(position);
//        Log.d(TAG, s);
//        holder.err.setVisibility(View.GONE);
//        if(jsonArray.size()!=0) {
            img = jsonArray.get(position).getAsJsonObject().get("Image").toString();
            String title = jsonArray.get(position).getAsJsonObject().get("Title").toString();
            String condition = jsonArray.get(position).getAsJsonObject().get("Condition").toString();
            String shipping = jsonArray.get(position).getAsJsonObject().get("ShippingCost").toString();
            String shipping_show;
            String price = jsonArray.get(position).getAsJsonObject().get("Price").toString();
            String topRatedListing = jsonArray.get(position).getAsJsonObject().get("TopRatedListing").toString();
            Picasso.with(context1).load(img.substring(1, img.length() - 1)).into(holder.mImage);
//        Log.d(TAG, title);
//        String html = "<img src='" + img.substring(1,img.length()-1)  + "'/><p style = 'color:red;'>" + title.substring(1,img.length()-1) + "</p>";
            String html1 = "<p>" + title.substring(1, title.length() - 1) + "</p>";
            holder.mTitle.setText(Html.fromHtml(html1, HtmlCompat.FROM_HTML_MODE_LEGACY));
//            Log.d("cmt ship", shipping.substring(1, shipping.length() - 1));
            if (shipping.substring(1, shipping.length() - 1).equals("0.0")) {
                shipping_show = "<p><span  Style='color:#696969'><Strong>FREE</Strong> </span> Shipping";
            } else {
                shipping_show = "<p> Ships for <span  Style='color:#696969'><Strong>$" + shipping.substring(1, shipping.length() - 1) + "</Strong></span>";
            }
            String html2;
//            Log.d("cmt top", topRatedListing.substring(1, topRatedListing.length() - 1));
            if (topRatedListing.substring(1, topRatedListing.length() - 1).equals("true")) {
                html2 = shipping_show + "<br><span  Style='color:#696969'> <Strong>Top Rated Listing </Strong> </span> </p>";
            } else {
                html2 = shipping_show + "</p>";
            }
//        Log.d("cmt html2" , html2);
            holder.mShip.setText(Html.fromHtml(html2, HtmlCompat.FROM_HTML_MODE_LEGACY));
            String html3 = "<p>" + condition.substring(1, condition.length() - 1) + "</p>";
//            Log.d("cmt html3", html3);
            holder.mCondi.setText(Html.fromHtml(html3, HtmlCompat.FROM_HTML_MODE_LEGACY));
            String html4 = "<p>$" + price.substring(1, price.length() - 1) + "</p>";
            holder.mPrice.setText(Html.fromHtml(html4, HtmlCompat.FROM_HTML_MODE_LEGACY));
//        holder.mView.setText(mList.get(position).toString());
        if(onItemClickListener!=null) {
            holder.itemView.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
//                Intent intent = new Intent(context1,DetailedActivity.class);
//                context1.startActivity(intent);
                    onItemClickListener.onClick(position);
//                    Toast.makeText(context1, "你点击了", Toast.LENGTH_SHORT).show();
                }
            });
        }
//        }else{
//            holder.err.setVisibility(View.VISIBLE);
//            Toast.makeText(context1, "No Records", Toast.LENGTH_SHORT).show();
//        }
    }

    public class ViewHolder extends RecyclerView.ViewHolder {
        public TextView mTitle;
        public ImageView mImage;
        public TextView mShip;
        public TextView mCondi;
        public TextView mPrice;
        public TextView err;
        public ViewHolder(View itemView) {
            super(itemView);
            mTitle = (TextView) itemView.findViewById(R.id.title_view);
            mImage = (ImageView) itemView.findViewById(R.id.image_view);
            mShip = (TextView) itemView.findViewById(R.id.shipping);
            mCondi = (TextView) itemView.findViewById(R.id.condition);
            mPrice = (TextView) itemView.findViewById(R.id.price_view);
//            err = (TextView) itemView.findViewById(R.id.noresult);
        }
    }

//    @Override
//    public void onClick(View v) {
//        if (onItemClickListener != null) {
//            //注意这里使用getTag方法获取数据
//            onItemClickListener.onItemClickListener(v, (Integer) v.getTag());
//        }
//    }

    /*设置点击事件*/
//    public void setRecyclerViewOnItemClickListener(RecyclerViewOnItemClickListener onItemClickListener) {
//        this.onItemClickListener = onItemClickListener;
////        Intent intent = new Intent(context1,DetailedActivity.class);
//
//    }
//
//    public interface RecyclerViewOnItemClickListener {
//
//        void onItemClickListener(View view, int position);
//
//    }

    //定义点击接口
    public interface OnItemClickListener{
        void onClick(int position);
    }
    //点击方法
    public void setOnItemClickListener(OnItemClickListener onItemClickListener){
        this.onItemClickListener = onItemClickListener;
    }
}


