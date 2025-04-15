    // Create a modal class to handle the creation and display of modals
    export class ModalCreator {
        /**
         * Create a modal based on a configuration object.
         * @param {Object} config - Configuration for the modal.
         * @param {string} config.modalId - An ID for the modal container.
         * @param {string} config.title - Title of the modal.
         * @param {Array<Object>} config.fields - An array of field config objects.
         *        Each field object can have:
         *          - label: The label text for the field.
         *          - type: The type of field ("text", "number", "email", "password", "textarea", "select", "datalist", etc.).
         *          - placeholder: Placeholder text (if applicable).
         *          - name: The name attribute for the field.
         *          - options: (for select) an array of options (each option can be a string or an object with 'value' and 'text').
         *          - dataList: (for inputs with datalist) an array of items for the datalist.
         * @param {Function} config.onSubmit - Callback function when form is submitted.
         */
        constructor(config) {
            this.config = config;
            this.modalId = config.modalId || 'modal';
            this.createModal();
        }

        createModal() {
            // Create modal container if not already present
            if (document.getElementById(this.modalId)) {
                this.modal = document.getElementById(this.modalId);
                return;
            }
            this.modal = document.createElement('div');
            this.modal.id = this.modalId;
            Object.assign(this.modal.style, {
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'none',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: '1000'
            });

            // Create modal content container
            const modalContent = document.createElement('div');
            Object.assign(modalContent.style, {
                backgroundColor: 'var(--content-bg)',
                padding: '20px',
                borderRadius: '8px',
                width: '90%',
                maxWidth: '500px',
                position: 'relative',
                boxSizing: 'border-box'
            });
            
            // Create close button
            const closeButton = document.createElement('span');
            closeButton.innerHTML = '&times;';
            Object.assign(closeButton.style, {
                position: 'absolute',
                top: '10px',
                right: '15px',
                fontSize: '24px',
                cursor: 'pointer'
            });
            

            // Modal header
            const header = document.createElement('h2');
            header.textContent = this.config.title || 'Modal Title';
            header.style.marginBottom = '15px';
            modalContent.appendChild(header);

            // Create form container
            const form = document.createElement('form');
            form.addEventListener('submit', e => {
                e.preventDefault();
                if (typeof this.config.onSubmit === 'function') {
                    // Gather form data into an object
                    const formData = {};
                    this.config.fields.forEach(field => {
                        if (field.name) {
                            const input = form.querySelector(`[name="${field.name}"]`);
                            if (input) {
                                formData[field.name] = input.value;
                            }
                        }
                    });
                    this.config.onSubmit(formData);
                }
                this.close();
            });

            // Create input elements based on fields config
            this.config.fields.forEach((field, index) => {
                const fieldWrapper = document.createElement('div');
                fieldWrapper.style.marginBottom = '15px';

                // Optional label
                if (field.label) {
                    const label = document.createElement('label');
                    label.textContent = field.label;
                    label.style.display = 'block';
                    label.style.marginBottom = '5px';
                    fieldWrapper.appendChild(label);
                }

                let inputElement;
                switch (field.type) {
                    case 'textarea':
                        inputElement = document.createElement('textarea');
                        break;
                    case 'select':
                        inputElement = document.createElement('select');
                        if (Array.isArray(field.options)) {
                            field.options.forEach(optionItem => {
                                const option = document.createElement('option');
                                if (typeof optionItem === 'object') {
                                    option.value = optionItem.value;
                                    option.textContent = optionItem.text;
                                } else {
                                    option.value = optionItem;
                                    option.textContent = optionItem;
                                }
                                inputElement.appendChild(option);
                            });
                        }
                        break;
                    case 'datalist': {
                        // For datalist, create an input and associated datalist element.
                        inputElement = document.createElement('input');
                        inputElement.type = 'text';
                        const dataListId = `${this.modalId}-datalist-${index}`;
                        inputElement.setAttribute('list', dataListId);
                        const dataList = document.createElement('datalist');
                        dataList.id = dataListId;
                        if (Array.isArray(field.dataList)) {
                            field.dataList.forEach(item => {
                                const option = document.createElement('option');
                                option.value = item;
                                dataList.appendChild(option);
                            });
                        }
                        fieldWrapper.appendChild(dataList);
                        break;
                    }
                    default:
                        // default to input element using the specified type (text, number, email, etc.)
                        inputElement = document.createElement('input');
                        inputElement.type = field.type || 'text';
                }

                // Set common attributes if provided
                if (field.placeholder) {
                    inputElement.placeholder = field.placeholder;
                }
                if (field.name) {
                    inputElement.name = field.name;
                }
                inputElement.style.width = '100%';
                inputElement.style.padding = '8px';
                inputElement.style.color = 'var(--text-color)';
                inputElement.style.backgroundColor = 'var(--bg-color)';
                inputElement.style.border = '1px solid var(--border-color)';
                inputElement.style.borderRadius = '4px';
                inputElement.style.boxSizing = 'border-box';

                fieldWrapper.appendChild(inputElement);
                form.appendChild(fieldWrapper);
            });

            // Create submit button
            const submitButton = document.createElement('button');
            submitButton.type = 'submit';
            submitButton.textContent = 'Submit';
            Object.assign(submitButton.style, {
                padding: '10px 15px',
                backgroundColor: '#4a86f7',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
            });
            form.appendChild(submitButton);

            modalContent.appendChild(form);
            this.modal.appendChild(modalContent);
            document.body.appendChild(this.modal);

            // Close modal when clicking outside the content
            this.modal.addEventListener('click', e => {
                if (e.target === this.modal) {
                    this.close();
                }
            });
        }

        open() {
            this.modal.style.display = 'flex';
        }

        close() {
            this.modal.style.display = 'none';
        }
    }