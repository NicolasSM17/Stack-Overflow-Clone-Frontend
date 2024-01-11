import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, inject } from '@angular/core';
import { MatChipEditedEvent, MatChipInputEvent } from '@angular/material/chips';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { QuestionService } from '../../user-services/question-service/question.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-post-question',
  templateUrl: './post-question.component.html',
  styleUrls: ['./post-question.component.scss']
})
export class PostQuestionComponent {
  tags = [];
  isSubmitting: boolean;
  addOnBlur = true;
  validateForm: FormGroup;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  announcer = inject(LiveAnnouncer);

  constructor(private service: QuestionService, private formBuilder: FormBuilder,
              private snackBar: MatSnackBar){}

  ngOnInit(){
    this.validateForm = this.formBuilder.group({
      title: ['', Validators.required],
      body: ['', Validators.required],
      tags: ['', Validators.required]
    });
  }

  add(event: MatChipInputEvent): void{
    const value = (event.value || '').trim();

    if(value){ // Add our tags
      this.tags.push({name: value});
    }

    event.chipInput!.clear();
  }

  remove(tag: any): void{
    const index = this.tags.indexOf(tag);

    if(index >= 0){
      this.tags.splice(index, 1);
      this.announcer.announce(`Removed ${tag}`);
    }
  }

  edit(tag: any, event: MatChipEditedEvent){
    const value = event.value.trim();

    if(!value){ // Remove tag if it no longer has a name
      this.remove(tag);

      return;
    }

    const index = this.tags.indexOf(tag); // Edit existing tag

    if(index >= 0){
      this.tags[index].name = value
    }
  }

  postQuestion(){
    console.log(this.validateForm.value);

    this.service.postQuestion(this.validateForm.value).subscribe(
      (res) => {
        console.log(res);

        if(res.id != null){
          this.snackBar.open("Question posted successfully", "Close", {duration: 5000});
        } else{
          this.snackBar.open("Something went wrong", "Close", {duration: 5000});
        }
      }
    );
  }
}
