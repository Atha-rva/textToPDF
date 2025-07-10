import { API, BlockTool, BlockToolConstructorOptions } from '@editorjs/editorjs';

interface ProgressBarData {
  percentage: number;
  color: string;
}

export default class ProgressBarTool implements BlockTool {
  private data: ProgressBarData;
  private wrapper: HTMLElement | null = null;
  private api: API;

  constructor({ data, api }: BlockToolConstructorOptions) {
    this.data = {
      percentage: data?.percentage ?? 50,
      color: data?.color ?? '#3b82f6'
    };
    this.api = api;
  }

  static get toolbox() {
    return {
      title: 'Progress Bar',
      icon: '<svg width="17" height="15" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1.91l-.01-.01L23 10z"/></svg>',
    };
  }

  render() {
    this.wrapper = document.createElement('div');
    this.wrapper.className = 'progress-bar-tool';

    const percentageInput = document.createElement('input');
    percentageInput.type = 'range';
    percentageInput.min = '0';
    percentageInput.max = '100';
    percentageInput.value = this.data.percentage.toString();
    percentageInput.addEventListener('input', (e) => {
      this.data.percentage = parseInt((e.target as HTMLInputElement).value);
      this.updateProgressBar();
    });

    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.value = this.data.color;
    colorInput.addEventListener('input', (e) => {
      this.data.color = (e.target as HTMLInputElement).value;
      this.updateProgressBar();
    });

    const progressContainer = document.createElement('div');
    progressContainer.className = 'progress-container';
    progressContainer.style.width = '100%';
    progressContainer.style.height = '20px';
    progressContainer.style.backgroundColor = '#e0e0e0';
    progressContainer.style.borderRadius = '10px';
    progressContainer.style.overflow = 'hidden';

    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    progressBar.style.height = '100%';
    progressBar.style.backgroundColor = this.data.color;
    progressBar.style.width = `${this.data.percentage}%`;
    progressBar.style.transition = 'width 0.3s ease';

    progressContainer.appendChild(progressBar);

    const label = document.createElement('span');
    label.textContent = `${this.data.percentage}%`;

    this.wrapper.appendChild(percentageInput);
    this.wrapper.appendChild(colorInput);
    this.wrapper.appendChild(progressContainer);
    this.wrapper.appendChild(label);

    return this.wrapper;
  }

  private updateProgressBar() {
    const progressBar = this.wrapper?.querySelector('.progress-bar') as HTMLElement;
    const label = this.wrapper?.querySelector('span') as HTMLElement;
    
    if (progressBar && label) {
      progressBar.style.width = `${this.data.percentage}%`;
      progressBar.style.backgroundColor = this.data.color;
      label.textContent = `${this.data.percentage}%`;
    }
  }

  save() {
    return this.data;
  }
}