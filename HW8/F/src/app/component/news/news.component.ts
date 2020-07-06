import { Component, OnInit, Input } from '@angular/core';
// import { EMLINK } from 'constants';


@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

	p: number = 1;
	cards: any = ['...','!!!']



	public arr_names:String[] = new Array(5); 
	  extend(element){
		console.log(element.target)
		let text = element.target.innerText;
	  if(text=='Show Detail'){
		  console.log("show");
		  element.target.innerText='Hide Detail';
	  }else{
		  console.log("hide")
		  element.target.innerText='Show Detail';
	  }
	  }

	  newsdata: any;
	  keyword: string;
	//   clear: string;
	  @Input() set getdad(getdad: any){
	  this.newsdata = getdad[0];
	  this.keyword = getdad[1];
	//   this.clear = getdad[2];
	//   console.log("this.newsdata");
	//   console.log(this.newsdata);
	//   console.log("this.keyword");
	//   console.log(this.keyword);
	  }
	
 
  constructor() {
	
   }

  ngOnInit():void { }

}
