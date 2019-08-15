class jQueryChat extends Chat {
  constructor({ source, element }) {
    const output = element.find('.chat__output');
    super({ source, element: output });
    this.block = $(element);
    this.output = $(output);
    this.toggleButton = element.find('.chat__toggle');
    this.boundToggleMethod = this.toggle.bind(this);
    this.addEventHandlers();
  }
  addEventHandlers() {
    this.toggleButton.on('click', this.boundToggleMethod);
  }
  removeEventHandlers() {
    this.toggleButton.off('click', this.boundToggleMethod);
  }
  toggle(event) {
    event.preventDefault();
    if (this.isEnabled) {
      this.stop();
    }
    else {
      this.start();
    }
    console.log(this);
  }
}
