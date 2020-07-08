package com.example.ebayproject2;

import android.content.Intent;
import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;

public class SplashActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // start main Activity
        startActivity(new Intent(SplashActivity.this, MainActivity.class));

        // close splash screen
        finish();
    }
}
