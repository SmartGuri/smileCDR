import { Component, OnInit, OnChanges, Input, ChangeDetectionStrategy, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface JsonData {
  resourceType: string
  id: string
  url: string
  status: string
  subjectType: string[]
  date: string
  item: Item[]
}

interface Item {
  linkId: string
  text: string
  type: string
  option?: Option[]
}

interface Option {
  valueCoding: ValueCoding
}

interface ValueCoding {
  system: string
  code: string
  display: string
}

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.css']
})
// export class DynamicFormComponent implements OnChanges {
export class DynamicFormComponent implements OnChanges {
  @Input() jsonData: JsonData | undefined;
  public formVal: any;
  public textArr: any = [];
  public resultArr: any = [];
  public errorArr: any = [];
  public resultBox: boolean = false;
  public errorBox: boolean = false;

  constructor(private fb: FormBuilder) { }

  public myForm: FormGroup = this.fb.group({});

  ngOnChanges(changes: SimpleChanges) {
    if (!changes['jsonData'].firstChange) {
      this.createForm(this.jsonData);
    }
  }

  createForm(jsonData: JsonData | undefined) {
    // console.log('jsonData => ', jsonData)
    if (jsonData?.resourceType == "Questionnaire") {
      for (const item of jsonData.item) {
        this.myForm.addControl(item.linkId,
          this.fb.control('', Validators.required)
        );
        this.textArr[item.linkId] = item.text;
      }
    } else {
      console.log("No form to create!");
    }
    // throw new Error('Method not implemented.');
  }

  onSubmit() {
    this.resultBox = false;
    this.errorBox = false;
    this.resultArr.length = 0;
    this.errorArr.length = 0;
    let isFormValid = this.myForm.valid;
    this.formVal = this.myForm.value;

    console.log('Form valid : ', isFormValid);
    console.log('Form  : ', this.myForm);

    if (isFormValid) {
      for (let k in this.formVal) {

        Object.entries(this.textArr).find(([key, val]) => {
          if (key == k) {
            this.resultArr.push({ 'ques': val, 'ans': this.formVal[k] })
          }
        })
      }
      // console.log(this.resultArr)
      if (this.resultArr.length > 0) {
        this.resultBox = true;
      }
    } else {
      for (let k in this.formVal) {
        if (this.formVal[k] == "" || null || undefined) {
          Object.entries(this.textArr).find(([key, val]) => {
            if (key == k) {
              this.errorArr.push(val);
            }
          })
        }
      }

      if (this.errorArr.length > 0) {
        this.errorBox = true;
      }
    }
  }

  onReset() {
    this.resultBox = false;
    this.errorBox = false;
    this.myForm.reset();

  }
}
