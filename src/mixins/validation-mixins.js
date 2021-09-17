import { Notify } from 'notiflix';

export default {
  methods: {
    setInvalid(fieldName, text) {
      const mainSelector = `.can-invalid.${fieldName}`;
      const input = document.querySelector(
        `${mainSelector} input.form-control`
      );
      const label = document.querySelector(`${mainSelector} span`);
      const errorMsg = document.querySelector(`${mainSelector} + .error-msg`);
      input.classList.add('border-danger');
      label.classList.add('text-danger');
      errorMsg.classList.remove('d-none');
      errorMsg.innerHTML = text;
    },
    processInvalid(invalids) {
      for (const invalidField in invalids.errors) {
        this.setInvalid(invalidField, invalids.errors[invalidField]);
      }
    },
    resetInvalid() {
      const mainSelector = `.can-invalid`;
      const input = document.querySelectorAll(
        `${mainSelector} input.form-control`
      );
      const label = document.querySelectorAll(`${mainSelector} span`);
      const errorMsg = document.querySelectorAll(
        `${mainSelector} + .error-msg`
      );

      input.forEach(input => {
        input.classList.remove('border-danger');
      });

      label.forEach(label => {
        label.classList.remove('text-danger');
      });

      errorMsg.forEach(errorMsg => {
        errorMsg.classList.add('d-none');
        errorMsg.innerHTML = '';
      });
    },
    checkForInvalidResponse(err) {
      switch (err.response?.status) {
        case 422:
          this.processInvalid(err.response.data);
          break;
        default:
          Notify.failure('Terjadi kesalahan');
          console.error(err);
          break;
      }
    },
  },
};
