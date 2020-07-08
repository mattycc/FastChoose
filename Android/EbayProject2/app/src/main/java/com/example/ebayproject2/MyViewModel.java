package com.example.ebayproject2;

import android.os.Bundle;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.android.volley.toolbox.StringRequest;

public class MyViewModel extends ViewModel {
    private String pic;
    private String fea;
    private String spe;
    private String sell;
    private String retu;
    private String ship;

    public String getPic() {
        return pic;
    }

    public void setPic(String pic) {
        this.pic = pic;
    }

    public String getFea() {
        return fea;
    }

    public void setFea(String fea) {
        this.fea = fea;
    }

    public String getSpe() {
        return spe;
    }

    public void setSpe(String spe) {
        this.spe = spe;
    }

    public String getSell() {
        return sell;
    }

    public void setSell(String sell) {
        this.sell = sell;
    }

    public String getRetu() {
        return retu;
    }

    public void setRetu(String retu) {
        this.retu = retu;
    }

    public String getShip() {
        return ship;
    }

    public void setShip(String ship) {
        this.ship = ship;
    }

    private MutableLiveData<Bundle> users;
    public LiveData<Bundle> getUsers() {
        if (users == null) {
            users = new MutableLiveData<Bundle>();
            loadUsers();
        }
        return users;
    }

    private void loadUsers() {
        // Do an asyncronous operation to fetch users.
    }

}
