class Api {
  constructor({baseUrl, headers, _id}) {
    this._baseUrl = baseUrl;
    this._headers = headers;
    this.__id = _id;
  }

getAppInfo() {
   return Promise.all([this.getInitialCards(), this.getuserInfo()]);
}

  getInitialCards() {
    return fetch(`${this._baseUrl}/cards`, {
  headers: this._headers,
}).then((res) => {
  if (res.ok) {
    return res.json()
  }
  return Promise.reject(`error: ${res.status}`);
});

  }

 getuserInfo() {
    return fetch(`${this._baseUrl}/users/me`, {
  headers: this._headers,
}).then((res) => {
  if (res.ok) {
    return res.json()
  }
  return Promise.reject(`error: ${res.status}`);
 });
}

 editUserInfo({ name, about }) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        name,
        about,
      }),
    }).then((res) => {
  if (res.ok) {
    return res.json()
  }
  return Promise.reject(`error: ${res.status}`);
 });
}

addCard({ name, link }) {
  return fetch(`${this._baseUrl}/cards`, {
    method: "POST",
    headers: this._headers,
    body: JSON.stringify({
      name,
      link,
    }),
  }).then((res) => {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`error: ${res.status}`);
  });
}

removeCard(cardId) {
  return fetch(`${this._baseUrl}/cards/${cardId}`, {
    method: "DELETE",
    headers: this._headers,
  }).then((res) => {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`error: ${res.status}`);
  });
}

changeLikeStatus(cardId, isLiked) {
  return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
    method: isLiked ? "DELETE" : "PUT",
    headers: this._headers,
  }).then((res) => {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`error: ${res.status}`);
  });
}

updateAvatar(avatar) {
  return fetch(`${this._baseUrl}/users/me/avatar`, {
    method: "PATCH",
    headers: this._headers,
    body: JSON.stringify({
      avatar,
    }),
  }).then((res) => {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`error: ${res.status}`);
  });
}
}

export default Api;