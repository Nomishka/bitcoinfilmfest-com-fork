/* Bitcoin FilmFest — FormSubmit subscription form
   The static GitHub Pages site submits directly to FormSubmit. FormSubmit
   forwards each signup to mails@bitcoinfilmfest.com after the address is
   confirmed once. The field accepts either an e-mail address or a Nostr npub.
*/

(function () {
  document.querySelectorAll('form[data-subscribe]').forEach(function (form) {
    form.addEventListener('submit', function () {
      var button = form.querySelector('button[type="submit"]');
      if (button) {
        button.disabled = true;
        button.textContent = 'Sending…';
      }
    });
  });
})();
