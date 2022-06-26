import { Component, OnInit } from '@angular/core';
import { JsonData } from './components/dynamic-form/dynamic-form.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public formData: JsonData | undefined;
  showForm: boolean = false;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    // this.showForm = false;
    // throw new Error('Method not implemented.');
  }

  generateForm(){
    this.http
    .get('/assets/questionnaire.json')
    .subscribe((value: any) => {
      this.formData = value;
    });
    this.showForm = true;
  }

  title = 'testApp';
}
