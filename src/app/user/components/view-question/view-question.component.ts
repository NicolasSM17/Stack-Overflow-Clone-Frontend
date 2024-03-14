import { Component } from '@angular/core';
import { QuestionService } from '../../user-services/question-service/question.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AnswerService } from '../../user-services/answer-service/answer.service';
import { StorageService } from 'src/app/auth-services/storage-service/storage.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-view-question',
  templateUrl: './view-question.component.html',
  styleUrls: ['./view-question.component.scss']
})
export class ViewQuestionComponent {
  questionId: number = this.activatedRoute.snapshot.params["questionId"];
  question: any;
  validateForm: FormGroup;
  selectedFile: File | null;
  imagePreview: string | ArrayBuffer | null;
  formData: FormData = new FormData();
  answers = [];

  constructor(private questionService: QuestionService, private activatedRoute: ActivatedRoute,
              private formBuilder: FormBuilder, private answerService: AnswerService,
              private snackBar: MatSnackBar){}

  ngOnInit(){
    this.validateForm = this.formBuilder.group({body: [null, Validators.required]})
    this.getQuestionById();
  }

  getQuestionById(){
    this.questionService.getQuestionById(this.questionId).subscribe(
      (res) => {
        console.log(res);

        this.question = res.questionDto;

        res.answerDTOList.forEach(element => {
          if(element.file != null){
            element.convertedImg = 'data:image/jpeg;base64,' + element.file.data;
          }

          this.answers.push(element);
        });
      }
    );
  }

  addAnswer(){
    console.log(this.validateForm.value);

    const data = this.validateForm.value;
    data.questionId = this.questionId;
    data.userId = StorageService.getUserId();
    console.log(data);

    this.formData.append("multipartFile", this.selectedFile);

    this.answerService.postAnswer(data).subscribe(
      (res) => {
        this.answerService.postAnswerImage(this.formData, res.id).subscribe(
          (res) => {
            console.log("Post Answer Image API", res);
          }
        );

        console.log(res);

        if(res.id != null){
          this.snackBar.open("Answer posted successfully", "Close", {duration:5000});
        } else{
          this.snackBar.open("Something went wrong", "Close", {duration:5000});
        }
      }
    );
  }

  addVote(voteType: string){
    console.log(voteType);

    const data = {
      voteType: voteType,
      userId: StorageService.getUserId(),
      questionId: this.questionId
    };

    this.questionService.addVoteToQuestion(data).subscribe(
      (res) => {
        console.log(res);

        if(res.id != null){
          this.snackBar.open("Vote added successfully", "Close", {duration: 5000});
        } else{
          this.snackBar.open("Something went wrong", "Close", {duration: 5000});
        }
      }
    );
  }

  onFileSelected(event: any){
    this.selectedFile = event.target.files[0];
    this.previewImage();
  }

  previewImage(){
    const reader = new FileReader();

    reader.onload = () => {
      this.imagePreview = reader.result;
    };

    reader.readAsDataURL(this.selectedFile);
  }
}
