import axios from "axios";
import { error } from "jquery";

const form = document.querySelector<HTMLFormElement>('.js-form');
const submitButton = document.querySelector<HTMLButtonElement>('.js-submit');
const messageContainer = document.querySelector<HTMLElement>('.js-message');
const dataContainer = document.querySelector<HTMLElement>('.js-data');

type Form = {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    maleorfemale: string;
    selectcountry: string;
};

const addFormHTML = (form: Form) => {
    const hiddenPassword = '*'.repeat(form.password.length);

    const formHTML = `
        <div>
            <p>First Name: ${form.firstname}</p>
            <p>Last Name: ${form.lastname}</p>
            <p>E-mail: ${form.email}</p>
            <p>Password: ${hiddenPassword}</p>
            <p>Gender: ${form.maleorfemale}</p>
            <p>Country: ${form.selectcountry}</p>
        </div>
    `;
    dataContainer.insertAdjacentHTML('beforeend', formHTML);
};

form.addEventListener('submit', (e) => {
    e.preventDefault();
    submitButton.disabled = true;
    messageContainer.textContent = '';

    const formData = new FormData(form);
    const finalData: Form = {
        firstname: formData.get('firstname') as string,
        lastname: formData.get('lastname') as string,
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        maleorfemale: formData.get('maleorfemale') as string,
        selectcountry: formData.get('selectcountry') as string,
    };

    axios.post('http://localhost:3004/form', finalData)
        .then(() => {
            messageContainer.textContent = 'Form submitted successfully!';
            addFormHTML(finalData);
            form.reset();
        })
        .catch(error => {
            messageContainer.textContent = 'Error submitting form';
            if (error.response && error.response.data) {
                const errorFields = error.response.data;
                Object.keys(errorFields).forEach(field => {
                    const input = form.querySelector(`[name="${field}"]`);
                    if (input) {
                        const errorText = document.createElement('p');
                        errorText.textContent = errorFields[field];
                        input.insertAdjacentElement('afterend', errorText);
                    }
                });
            }
        })
        .finally(() => {
            submitButton.disabled = false;
        })
})

