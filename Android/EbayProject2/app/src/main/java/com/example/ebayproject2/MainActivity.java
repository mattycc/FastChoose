package com.example.ebayproject2;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Context;
import android.content.Intent;
import android.icu.text.SymbolTable;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.material.textfield.TextInputLayout;


import java.util.ArrayList;
import java.util.Objects;


public class MainActivity extends AppCompatActivity {
    final String TAG = "cmt";
//    Button searchBnt;
//    Button clearBnt;
    private EditText iPrice;
    private EditText aPrice;
    private TextView err1;
    private TextView err2;
    private EditText keywords;
    private CheckBox cb1, cb2, cb3;
    private ArrayList<CheckBox> list=new ArrayList<>();
    private ArrayList<String> listString;
    Spinner spinner;
    Button searchBnt;
    Button clearBnt;
    float floatPri1;
    float floatPri2;
    private static final String[] sortOrder2 = {"Best Match", "Price: highest first", "Price + Shipping: Highest first", "Price + Shipping: Lowest first"};

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        setTheme(R.style.AppTheme);
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        err1 = (TextView) findViewById(R.id.error1);
        err2 = (TextView) findViewById(R.id.error2);
        keywords = (EditText) findViewById(R.id.keywords);
        iPrice = (EditText) findViewById(R.id.minPrice);
        aPrice = (EditText) findViewById(R.id.maxPrice);
        cb1 = (CheckBox) findViewById(R.id.checkbox1);
        cb2 = (CheckBox) findViewById(R.id.checkbox2);
        cb3 = (CheckBox) findViewById(R.id.checkbox3);
        list.add(cb1);
        list.add(cb2);
        list.add(cb3);
//        TextView result = (TextView) findViewById(R.id.sortBy);
        spinner = (Spinner) findViewById(R.id.sortOrder);
        searchBnt = (Button) findViewById(R.id.search);
        clearBnt = (Button) findViewById(R.id.clear);

        ArrayAdapter<String> adapter = new ArrayAdapter<String>(this, android.R.layout.simple_spinner_item, sortOrder2);
        //设置下拉列表风格
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        //将适配器添加到spinner中去
        spinner.setAdapter(adapter);
        spinner.setVisibility(View.VISIBLE);//设置默认显示

        searchBnt.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                closeKeyboard();
                String[] s;
                Boolean flag = true;
                Log.i("cmt", "search");
                err1.setVisibility(View.GONE);
                err2.setVisibility(View.GONE);
                String kwd = keywords.getText().toString().trim();
                String pri1 = iPrice.getText().toString();
                String pri2 = aPrice.getText().toString();
                // unspecified not checked
                if(!list.get(2).isChecked()) {
                    listString =new ArrayList<>();
                    for (CheckBox cb : list) {
                        Log.d(TAG, "onClick: ");
                        Log.d(TAG, String.valueOf(cb.isChecked()));
                        if (cb.isChecked()) {
                            listString.add(cb.getText().toString());
                        }
                    }
                    Log.d(TAG, "onClick: listString"+listString.toString());
                }else{
                    flag = false;
                }
                if(!list.get(0).isChecked()&&!list.get(1).isChecked()){
                    flag = false;
                }
                if(!pri1.isEmpty()){
                    floatPri1 = Float.parseFloat(pri1);
                    Log.d(TAG, "onClick: minprice not empty");
                }else{
                    Log.d(TAG, "onClick: minprice empty");
                }

                if(!pri2.isEmpty()){
                    floatPri2 = Float.parseFloat(pri2);
                    Log.d(TAG, "onClick: maxprice not empty");
                }else{
                    Log.d(TAG, "onClick: maxprice empty");
                }

                //验证用户名和密码
                boolean k = validateKwd(kwd);
                boolean p = validatePrice(floatPri1,floatPri2);
                if(!k || !p){
                    Log.i("cmt", "err");
                    Toast.makeText(MainActivity.this,"Please fix all fields with errors",Toast.LENGTH_SHORT).show();
                }else if(k && p){
                    Intent intent = new Intent(MainActivity.this, ShowActivity.class);
                    Bundle bundle = new Bundle();
                    bundle.putString("keyword",kwd);
                    if(!pri1.isEmpty()){
                        bundle.putFloat("minPrice",floatPri1);
                    }else{
                        bundle.putFloat("minPrice",-1);
                    }
                    if(!pri2.isEmpty()){
                        bundle.putFloat("maxPrice",floatPri2);
                    }else{
                        bundle.putFloat("maxPrice",-1);
                    }
                    // unspecified not checked
                    int i=0;
                    if(flag){
                        bundle.putString("ConditionStatus","specified");
                        for(String cs:listString){
                            String condition = "Condition" + i;
                            bundle.putString(condition,cs);
                            i++;
                        }
                    }else{
                        bundle.putString("ConditionStatus","unspecified");
                    }

                    bundle.putInt("num",i-1);
                    bundle.putString("sortOrder",spinner.getSelectedItem().toString());
                    intent.putExtras(bundle);
                    startActivity(intent);
                }
            }
        });

        clearBnt.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick (View view){
                Log.i("cmt", "clear");
                err1.setVisibility(View.GONE);
                err2.setVisibility(View.GONE);
                keywords.setText(null);
                iPrice.setText(null);
                aPrice.setText(null);
                cb1.setChecked(false);
                cb2.setChecked(false);
                cb3.setChecked(false);
                spinner.setSelection(0,true);

            }
        });
    }


    private void closeKeyboard() {
        InputMethodManager imm = (InputMethodManager)getSystemService(Context.INPUT_METHOD_SERVICE);
        if(imm.isActive()&&getCurrentFocus()!=null){
            if (getCurrentFocus().getWindowToken()!=null) {
                imm.hideSoftInputFromWindow(getCurrentFocus().getWindowToken(), InputMethodManager.HIDE_NOT_ALWAYS);
            }
        }
    }

    private boolean validateKwd(String kwd){
        if(TextUtils.isEmpty(kwd)){
            err1 = (TextView) findViewById(R.id.error1);
            err1.setVisibility(View.VISIBLE);
            return false;
        }
        return true;
    }

    private boolean validatePrice(Float floatPri1, Float floatPri2){
        if(floatPri1<0 || floatPri2<0 || floatPri1>floatPri2){
            err2 = (TextView) findViewById(R.id.error2);
            err2.setVisibility(View.VISIBLE);
            return false;
        }
        return true;
    }
}






