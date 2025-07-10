import { API, BlockTool, BlockToolConstructorOptions } from '@editorjs/editorjs';

interface MathData {
  latex: string;
}

export default class MathTool implements BlockTool {
  private data: MathData;
  private wrapper: HTMLElement | null = null;
  private api: API;

  constructor({ data, api }: BlockToolConstructorOptions) {
    this.data = data || { latex: '' };
    this.api = api;
  }

  static get toolbox() {
    return {
      title: 'Math Equation',
      icon: '<svg width="17" height="15" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-8 12H9.5v-2h-2v2H6v-1.5h1.5v-2H6V10h1.5v2h2v-2H11v1.5H9.5v2H11V15zm7-2h-4v-2h4v2z"/></svg>',
    };
  }

  render() {
    this.wrapper = document.createElement('div');
    this.wrapper.className = 'math-tool';

    const latexInput = document.createElement('textarea');
    latexInput.placeholder = 'Enter LaTeX equation (e.g., E = mc^2)...';
    latexInput.value = this.data.latex;
    latexInput.addEventListener('input', (e) => {
      this.data.latex = (e.target as HTMLTextAreaElement).value;
    });

    this.wrapper.appendChild(latexInput);

    return this.wrapper;
  }

  save() {
    return this.data;
  }
}