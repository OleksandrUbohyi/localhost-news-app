function customHttp() {
  return {
    get(url, cb) {
      try {
        let xhr = new XMLHttpRequest();

        xhr.open("GET", url);

        xhr.addEventListener("load", () => {
          if (xhr.status < 200 || xhr.status >= 300) {
            cb(`Error. Status code: ${xhr.status}`, xhr);
            return;
          }

          const response = JSON.parse(xhr.responseText);
          cb(null, response);
        });

        xhr.addEventListener("error", () => {
          cb(`Error. Status code: ${xhr.status}`, xhr);
        });

        xhr.send();
      } catch (error) {
        cb(error);
      }
    },
    post(url, body, headers, cb) {
      try {
        let xhr = new XMLHttpRequest();

        xhr.open("POST", url);

        xhr.addEventListener("load", () => {
          if (xhr.status < 200 || xhr.status >= 300) {
            cb(`Error. Status code: ${xhr.status}`, xhr);
            return;
          }

          const response = JSON.parse(xhr.responseText);
          cb(null, response);
        });

        xhr.addEventListener("error", () => {
          cb(`Error. Status code: ${xhr.status}`, xhr);
        });

        if (headers) {
          //если задано несколько заголовков - устанавливаем их все
          Object.entries(headers).forEach(([key, value]) => {
            xhr.setRequestHeader(key, value);
          });
        }

        xhr.send(JSON.stringify(body));
      } catch (error) {
        cb(error);
      }
    },
  };
}

document.addEventListener("DOMContentLoaded", () => {
  loadNews();
});

const http = customHttp();

//разделяем приложение на функции, каждая из которых выполняет свою отдельную задачу
const newsService = (function () {
  const apiKey = "47a87bd0ab604b76834b0e6d2fc9b5f7";
  const apiUrl = "http://newsapi.org/v2/";

  return {
    topHeadlines(country = "ua", cb) {
      http.get(
        `${apiUrl}/top-headlines?country=${country}&category=business&apiKey=${apiKey}`,
        cb
      );
    },
    everything(query, cb) {
      http.get(`${apiUrl}/everything?q=${query}&apiKey=${apiKey}`, cb);
      http.get(`${apiUrl}/everything?q=${query}&apiKey=${apiKey}`, cb);
    },
  };
})();

const newsForm = document.forms["news-search-form"];
const countrySelect = newsForm.country;
const searchInput = newsForm.query;
const newsContainer = document.querySelector(".news-container .row");

newsForm.addEventListener("submit", (e) => {
  e.preventDefault();
  loadNews();
});

function loadNews() {
  showLoader();
  const country = countrySelect.value;
  const searchText = searchInput.value;

  if (!searchText) {
    newsService.topHeadlines(country, onGetResponse);
  } else {
    newsService.everything(searchText, onGetResponse);
  }
}

function onGetResponse(err, res) {
  removeLoader();
  if (err) {
    alert(err);
    return;
  }

  if (!res.articles.length) {
    //show empty message
    newsContainer.innerHTML = "По вашему запросу новостей не найдено";
    return;
  }
  renderNews(res.articles);
}

function renderNews(news) {
  const newsContainer = document.querySelector(".news-container .row");
  if (newsContainer.children.length) {
    newsContainer.innerHTML = "";
  }

  let fragment = "";

  news.forEach((newsItem) => {
    const el = newsTemplate(newsItem);
    fragment += el;
  });

  newsContainer.insertAdjacentHTML("afterbegin", fragment);
}

// function newsTemplate(singleNews) {
//вытягиваем нужные поля с каждого объекта
function newsTemplate({ urlToImage, title, url, description }) {
  return `
    <div class="col-12 col-md-6 col-lg-4 col-xl-3">
          <div class="card">
            <img src="${
              urlToImage ||
              "https://upload.wikimedia.org/wikipedia/commons/6/6c/No_image_3x4.svg"
            }" class="card-img-top" alt="..." />
            <div class="card-body">
              <h5 class="card-title">${title || ""}</h5>
              <p class="card-text">
                ${description || ""}
              </p>
              <a href="${url}" class="btn btn-primary">Перейти к новости</a>
            </div>
          </div>
        </div>
  `;
}

function showAlert(msg, type = "success") {
  $(".toast").toast({ delay: 2000 });
  $(".toast .toast-header strong").html("привет");
  $(".toast .toast-body").html(msg);
  $(".toast").toast("show");
}

function showLoader() {
  newsContainer.innerHTML = `<div class="spinner-wrapper d-flex justify-content-center p-2">
                                                                <div class="spinner-border text-primary" role="status">
                                                                <span class="visually-hidden">Loading...</span>
                                                                </div>
                                                          </div> `;
}

function removeLoader() {
  const loader = document.querySelector(".spinner-wrapper");
  if (loader) {
    loader.remove();
  }
}
