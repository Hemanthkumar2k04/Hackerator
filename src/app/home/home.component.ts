import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SendpromptService } from '../sendprompt.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [CommonModule, FormsModule]
})
export class HomeComponent implements OnInit{
  credits: number = 0;
  constructor(private toaster: ToastrService, private sendPrompt: SendpromptService, private authService: AuthService, private router: Router) {}
  ngOnInit(): void{
    this.loadUserCredits(this.username);
  }
  topics = [
    'Artificial Intelligence',
    'Blockchain',
    'Data Science',
    'Cloud Computing',
    'Cybersecurity',
    'Internet of Things',
    'Augmented Reality',
    'Virtual Reality',
    'Machine Learning',
    'Natural Language Processing',
    'Computer Vision',
    'Quantum Computing',
    'Robotics',
    'Edge Computing',
    '5G Technology'
  ];

  showCustomPrompt = false;
  customPrompt: string = '';
  selectedTopics: string[] = [];
  projectIdea: string | null = null;
  researchPapers: { title: string, link: string }[] = [];
  isLoading = false;  // Add this line for loading state
  canGenerate = true;
  username = localStorage.getItem('username');

  loadUserCredits(username: string | null): void {
    if (username) {
      this.authService.loadUserCredits(username).subscribe({
        next: (credits) => {
          this.credits = credits;
          console.log(`${username}: ${credits}`);
          if(this.credits < 20){
            this.canGenerate = false;
          }
        },
        error: (error) => {
          console.error('Error loading user credits:', error);
          // Handle the error appropriately, e.g., show a notification
        },
      });
    } else {
      console.warn('Username is not available.');
    }
  }

  updateCredits(username: string| null, credits: number):void{
    if(username){
      this.authService.UpdateUserCredits(username, credits).subscribe({
        next: (response) =>{
          this.loadUserCredits(username);
        },
        error: (error) =>{
          console.log(error);
          
        }
      })
    }
  }

  deductCredits(): void{
    this.credits -= 20;
    this.updateCredits(this.username, this.credits);
  }

  toggleSelection(topic: string): void {
    this.showCustomPrompt = false;
    if (this.selectedTopics.includes(topic)) {
      this.removeTopic(topic);
    } else {
      this.selectedTopics.push(topic);
    }
  }

  removeTopic(topic: string): void {
    this.selectedTopics = this.selectedTopics.filter(t => t !== topic);
  }

  openCustomPrompt() {
    this.showCustomPrompt = true;
    this.selectedTopics = [];
  }
  onLogout(){
    this.authService.logout();
    this.toaster.success("Successfully Logged out!");
    this.router.navigate(['login']);
  }
  generateIdea(): void {
    if (this.selectedTopics.length === 0 && !this.customPrompt) {
      alert('Please select at least one topic or provide a custom prompt!');
      return;
    }
    this.projectIdea = null;
    this.isLoading = true;  // Set loading to true before API call
    const promptToSend = this.customPrompt || this.selectedTopics.toString();
    
    

    this.sendPrompt.sendPrompt(promptToSend, !!this.customPrompt, this.username).subscribe({
      next: (response) => {
        this.projectIdea = this.formatProjectIdea(response.result);
        this.researchPapers = [
          { title: 'Research Paper 1', link: 'https://link-to-research-paper.com/1' },
          { title: 'Research Paper 2', link: 'https://link-to-research-paper.com/2' },
          { title: 'Research Paper 3', link: 'https://link-to-research-paper.com/3' }
        ];
        this.isLoading = false;  // Set loading to false after response
        this.deductCredits();
      },
      error: (error) => {
        console.error('Error generating idea:', error);
        this.isLoading = false;  // Set loading to false on error
      }
    });
  }
  
  formatProjectIdea(text: string): string {
    let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
    formattedText = formattedText.replace(/\n/g, '<br>');
    return formattedText;
  }
}