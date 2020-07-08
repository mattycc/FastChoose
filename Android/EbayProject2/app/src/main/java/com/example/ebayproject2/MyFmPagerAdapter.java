package com.example.ebayproject2;

import android.util.Log;

import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentPagerAdapter;

import java.util.ArrayList;
import java.util.List;

public class MyFmPagerAdapter extends FragmentPagerAdapter {
    private List<String> title;
    private List<Fragment> list;
    public MyFmPagerAdapter(FragmentManager fm, List<String> title, ArrayList<Fragment> fragments) {
        super(fm);
        this.title = title;
        this.list = fragments;
    }

    @Override
    public Fragment getItem(int position) {
        return (list.get(position));
    }

    @Override
    public int getCount() {
        Log.d("count", "getCount: "+list.size());
        return list.size();
    }

    @Override
    public CharSequence getPageTitle(int position) {
        Log.d("title", "getPageTitle: "+title.size());
        Log.d("position", "getPageTitle: "+position);
        return title.get(position);
    }




}
