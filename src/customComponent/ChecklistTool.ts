import { API, BlockTool, BlockToolConstructorOptions } from '@editorjs/editorjs';

interface ChecklistData {
  items: Array<{
    text: string;
    checked: boolean;
  }>;
}

export default class ChecklistTool implements BlockTool {
  private data: ChecklistData;
  private wrapper: HTMLElement | null = null;
  private api: API;

  constructor({ data, api }: BlockToolConstructorOptions) {
    this.data = data || { items: [{ text: '', checked: false }] };
    this.api = api;
  }

  static get toolbox() {
    return {
      title: 'Checklist',
      icon: '<svg width="17" height="15" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>',
    };
  }

  render() {
    this.wrapper = document.createElement('div');
    this.wrapper.className = 'checklist-tool';

    this.renderItems();

    const addButton = document.createElement('button');
    addButton.textContent = '+ Add Item';
    addButton.className = 'add-checklist-item';
    addButton.addEventListener('click', () => {
      this.data.items.push({ text: '', checked: false });
      this.renderItems();
    });

    this.wrapper.appendChild(addButton);

    return this.wrapper;
  }

  private renderItems() {
    if (!this.wrapper) return;

    // Clear existing items (except add button)
    const existingItems = this.wrapper.querySelectorAll('.checklist-item');
    existingItems.forEach(item => item.remove());

    this.data.items.forEach((item, index) => {
      const itemWrapper = document.createElement('div');
      itemWrapper.className = 'checklist-item';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = item.checked;
      checkbox.addEventListener('change', (e) => {
        this.data.items[index].checked = (e.target as HTMLInputElement).checked;
      });

      const textInput = document.createElement('input');
      textInput.type = 'text';
      textInput.value = item.text;
      textInput.placeholder = 'Enter checklist item...';
      textInput.addEventListener('input', (e) => {
        this.data.items[index].text = (e.target as HTMLInputElement).value;
      });

      const deleteButton = document.createElement('button');
      deleteButton.textContent = '×';
      deleteButton.className = 'delete-checklist-item';
      deleteButton.addEventListener('click', () => {
        if (this.data.items.length > 1) {
          this.data.items.splice(index, 1);
          this.renderItems();
        }
      });

      itemWrapper.appendChild(checkbox);
      itemWrapper.appendChild(textInput);
      itemWrapper.appendChild(deleteButton);

      // Insert before the add button
      const addButton = this.wrapper.querySelector('.add-checklist-item');
      this.wrapper.insertBefore(itemWrapper, addButton);
    });
  }

  save() {
    return this.data;
  }
}