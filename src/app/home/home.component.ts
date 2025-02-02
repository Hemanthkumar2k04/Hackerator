import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SendpromptService } from '../sendprompt.service';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [CommonModule, FormsModule]
})
export class HomeComponent {
  constructor(private sendPrompt: SendpromptService) {}

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

  toggleSelection(topic: string): void {
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
    this.showCustomPrompt = !this.showCustomPrompt;
  }

  generateIdea(): void {
    if (this.selectedTopics.length === 0 && !this.customPrompt) {
      alert('Please select at least one topic or provide a custom prompt!');
      return;
    }
  
    this.isLoading = true;  // Set loading to true before API call
    const promptToSend = this.customPrompt || this.selectedTopics.toString();
    
    this.sendPrompt.sendPrompt(promptToSend).subscribe({
      next: (response) => {
        this.projectIdea = this.formatProjectIdea(response.result);
        this.researchPapers = [
          { title: 'Research Paper 1', link: 'https://link-to-research-paper.com/1' },
          { title: 'Research Paper 2', link: 'https://link-to-research-paper.com/2' },
          { title: 'Research Paper 3', link: 'https://link-to-research-paper.com/3' }
        ];
        this.isLoading = false;  // Set loading to false after response
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