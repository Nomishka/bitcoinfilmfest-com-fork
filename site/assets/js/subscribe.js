/* Bitcoin FilmFest — FormSubmit subscription form
   AJAX keeps visitors on the BFF site. FormSubmit still forwards each
   submission to mails@bitcoinfilmfest.com after the form is activated once.
*/

(function () {
  document.querySelectorAll('form[data-subscribe]').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var button = form.querySelector('button[type="submit"]');
      var status = form.querySelector('[data-subscribe-status]');
      var originalLabel = button ? button.textContent : 'Subscribe';

      if (button) {
        button.disabled = true;
        button.textContent = 'Sending…';
      }
      if (status) status.textContent = 'Sending…';

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      })
        .then(function (response) {
          return response.json().then(function (data) {
            if (!response.ok || data.success === false) {
              throw new Error(data.message || 'The form could not be sent.');
            }
            return data;
          });
        })
        .then(function () {
          window.location.href = '/thanks/';
        })
        .catch(function (error) {
          if (button) {
            button.disabled = false;
            button.textContent = originalLabel;
          }
          if (status) {
            status.textContent = error.message || 'The form could not be sent. Please try again.';
          }
        });
    });
  });
})();
