import { Component, OnInit, Output ,EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import "rxjs/Rx";
import { Observable } from 'rxjs';
import {Router} from "@angular/router";
import axios from 'axios';
import { HttpParams} from "@angular/common/http";
import { importExpr } from '@angular/compiler/src/output/output_ast';
import {HttpHeaders} from '@angular/common/http';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
// import { request } from '@angular/common/http';
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  userForm: FormGroup;
  @Output() chongya = new EventEmitter();
  public clear:String = "true";
  

  onSubmit() {

    let alertMsg:string = "";
    let kwdDom:any = document.getElementById("inputKwd");
    let kwd = kwdDom.value;
    if(kwd==""){
      this.chongya.emit();
      alertMsg += "<p class='alertMsg' style='background: #FFFBC6;  margin-bottom: 10px'>Please enter a keyword</p>";
    }
    let lPDom:any = document.getElementById("inputMin");
    let hPDom:any = document.getElementById("inputMax");    
    let lP = parseFloat(lPDom.value);
    let hP = parseFloat(hPDom.value);
    let flag = 0;
    if (lPDom.value)
    {
      // console.log(lP);
       if (lP>=0){}
       else{
        if (flag == 0){
          flag = 1
          this.chongya.emit();
          alertMsg += "<p class='alertMsg' style='background: #FFFBC6;  margin-bottom: 10px'>Please use appropriate values for minPrice/MaxPrice</p>";
         }
       }
    }
    if (hPDom.value)
    {
       if (hP>=0){}
       else{
        if (flag == 0){
          flag = 1
          this.chongya.emit();
          alertMsg += "<p class='alertMsg' style='background: #FFFBC6;  margin-bottom: 10px'>Please use appropriate values for minPrice/MaxPrice</p>";
         }
        }       
    }


    if(lP>hP || lP<0 || hP<0 ){
      this.chongya.emit();
      alertMsg += "<p class='alertMsg' style='background: #FFFBC6;  margin-bottom: 10px'>Please use appropriate values for minPrice/MaxPrice</p>";
    }
    
    if(alertMsg==""){
      
      // console.log(this.userForm.value);

      let data: any = Object.assign(this.userForm.value);
      //http://fast-spanner-278817.wl.r.appspot.com/
      //http://localhost:8080
      this.http.post('http://fast-spanner-278817.wl.r.appspot.com/', data).subscribe((rep:any) => {
        // console.log(rep)
        // console.log(rep["result"]);
        if(rep["result"]=="No Result Found" || rep["result"]=="Failure"){
          this.chongya.emit();
          alertMsg += "<p class='alertMsg' style='background: #FFFBC6;  margin-bottom: 10px'>No Result Found</p>";
          document.getElementById("alertMsgDiv").innerHTML=alertMsg;
        }else{
          this.chongya.emit([rep, this.userForm.value.inputKwd]);

        }
      }, error => {
      });
    }

   
  

    // console.log(alertMsg);
    document.getElementById("alertMsgDiv").innerHTML=alertMsg;
  }
  

  // GET(){
  //   this.http.get('http://localhost:3001').subscribe((data:any) => {
  //     console.log("get request from front");
  //     }, error => {      
  //         console.log("error");
  //     });
  // }

  reset(){
    location.reload();
  }

  ngOnInit(): void {
  
   this.userForm = this.formBuilder.group({
     inputKwd: [""],
     inputMin: [""],
     inputMax: [""],
     condiCheck1: [""],
     condiCheck2: [""],
     condiCheck3: [""],
     condiCheck4: [""],
     condiCheck5: [""],
     sellerCheck: [""],
     shipCheck1: [""],
     shipCheck2: [""],
     sort: ["Best Match"]
   });
  
  }


constructor(private formBuilder: FormBuilder, private http: HttpClient, private router: Router)
  {
  //  this.http.get('/').subscribe((data:any) => {
  //   console.log("get request from front");
  //   }, error => {      
  //       console.log("error");
  //   });
  }


}
