(function () {

  let button = document.querySelector('button');
  let first = document.querySelector('.js-first');
  let second = document.querySelector('.js-second');
  let headers = document.querySelector('.js-headers');
  let body = document.querySelector('.js-body');

  const animateIntro = () => {
    let elems = document.querySelectorAll('.is-animated');
    [...elems].forEach((el) => el.classList.remove('is-animated'));
    first.classList.add('inputs-url--red');
    second.classList.add('inputs-url--green');
  };

  const displayError = (statusText) => {
    console.error('Error loading requests...');
  };

  const prettyPrint = (response) => {
    try {
      return JSON.stringify(JSON.parse(response), null, '\t');
    }
    catch (e) { return response; }
  }

  const successHandler = (xhr, cb) => {
    animateIntro();
    cb(null, xhr.response);
  };

  const errorHandler = (xhr, cb) => {
    console.error(xhr.statusText);
    cb(xhr.statusText);
  };

  const request = (url, cb) => {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onload = (evt) => {
      if (xhr.status === 200) successHandler(xhr, cb);
      else errorHandler(xhr, cb);
    };
    xhr.onerror = (evt) => errorHandler(xhr, cb);
    xhr.send();
  }

  const compare = (first, second, element) => {
    let diff = JsDiff.diffLines(first, second);
    let frag = document.createDocumentFragment();

    diff.forEach(function (part){
      let classes = ['diff-line'];
      if (part.added) classes.push('diff-line--green');
      else if (part.removed) classes.push('diff-line--red');

      let span = document.createElement('span');
      classes.forEach((c) => span.classList.add(c));

      span.appendChild(document.createTextNode(part.value));
      frag.appendChild(span);
    });

    element.appendChild(frag);
  }

  const start = () => {
    let firstURL = first.value;
    let secondURL = second.value;
    let url = `/proxy?url1=${firstURL}&url2=${secondURL}`;

    headers.innerHTML = '';
    body.innerHTML = '';

    request(url, function (err, res) {
      if (err) return displayError(err);

      let data = JSON.parse(res);
      compare(prettyPrint(data.first.headers),
              prettyPrint(data.second.headers),
              headers);
      compare(prettyPrint(data.first.body),
              prettyPrint(data.second.body),
              body);
    });
  }

  button.addEventListener('click', start);
  first.value = 'https://httpbin.org/get';
  second.value = 'https://httpbin.org/get?show_env=1';

})();