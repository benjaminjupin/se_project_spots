import "./index.css";
import {
  enableValidation,
  settings,
  toggleButtonState,
  resetValidation,
} from "../scripts/validation.js";
import Api from "../utils/Api.js";


const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "a6544edb-35ac-4081-9bdd-cfa80eecd4b8",
    "Content-Type": "application/json",
  },
});

const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");

const cardsList = document.querySelector(".cards__list");

api
  .getAppInfo()
  .then(([cards, userInfo]) => {
    cards.forEach(function (item) {
      const cardElement = getCardElement(item);
      cardsList.append(cardElement);
    });
    profileAvatarEl.src = userInfo.avatar;
    profileNameEl.textContent = userInfo.name;
    profileDescriptionEl.textContent = userInfo.about;
  })
  .catch((err) => {
    console.error(err);
  });

const editProfileBtn = document.querySelector(".profile__edit-btn");
const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");

// profile elements
const editProfileModal = document.querySelector("#edit-modal");
const profileFormSubmitBtn =
  editProfileModal.querySelector(".modal__submit-btn");
const editProfileCloseBtn = editProfileModal.querySelector(".modal__close-btn");
const editProfileForm = editProfileModal.querySelector(".modal__form");
const nameProfileInput = editProfileModal.querySelector("#profile-name-input");
const editModalDescriptionInput = editProfileForm.querySelector(
  "#profile-description-input",
);
const profileAvatarEl = document.querySelector(".profile__avatar");

const newPostBtn = document.querySelector(".profile__add-btn");

// edit form elements
const editNewPost = document.querySelector("#newpost-modal");
const modalNewSubmitBtn = editNewPost.querySelector(".modal__submit-btn");
const editNewPostCloseBtn = editNewPost.querySelector(".modal__close-btn");
const editPostForm = editNewPost.querySelector(".modal__form");
const imageLinkInput = editNewPost.querySelector("#image-link-input");
const profileCaptionInput = editPostForm.querySelector(
  "#profile-caption-input",
);

//form elements
const previewModal = document.querySelector("#preview-modal");
const previewImageEl = previewModal.querySelector(".modal__image");
const previewCaption = previewModal.querySelector(".modal__caption");
const previewCloseBtn = previewModal.querySelector(
  ".modal__close-btn.modal__close-btn_type_preview",
);

// delete element
const deleteModal = document.querySelector("#delete-modal");
const deleteCloseBtn = deleteModal.querySelector(".modal__close-btn");
const deleteForm = deleteModal.querySelector("#delete-form");

// avatar
const avatarModal = document.querySelector("#avatar-modal");
const avatarCloseBtn = avatarModal.querySelector(".modal__close-btn");
const avatarForm = avatarModal.querySelector("#avatar-form");
const avatarLinkInput = avatarModal.querySelector("#avatar-link-input");
const avatarEditBtn = document.querySelector(".profile__avatar-btn");

let selectedCard;
let selectedCardId;
// ends here
previewCloseBtn.addEventListener("click", function () {
  closeModal(previewModal);
});

function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", handleEscapeKey);
  modal.addEventListener("mousedown", handleOverlayClose);
}

function setButtonLoading(button, loadingText, originalText) {
  button.textContent = loadingText;
  button.disabled = true;
  return function () {
    button.textContent = originalText;
    button.disabled = false;
  };
}

editProfileBtn.addEventListener("click", function () {
  nameProfileInput.value = profileNameEl.textContent;
  editModalDescriptionInput.value = profileDescriptionEl.textContent;
  resetValidation(
    editProfileForm,
    [nameProfileInput, editModalDescriptionInput],
    settings,
  );
  toggleButtonState(
    [nameProfileInput, editModalDescriptionInput],
    profileFormSubmitBtn,
    settings,
  );
  openModal(editProfileModal);
});

function handleEditProfileSubmit(evt) {
  evt.preventDefault();
  const restore = setButtonLoading(profileFormSubmitBtn, "Saving...", "Save");
  api
    .editUserInfo({
      name: nameProfileInput.value,
      about: editModalDescriptionInput.value,
    })
    .then((data) => {
      profileNameEl.textContent = data.name;
      profileDescriptionEl.textContent = data.about;
      closeModal(editProfileModal);
    })
    .catch(console.error)
    .finally(restore);
}

editProfileCloseBtn.addEventListener("click", function () {
  closeModal(editProfileModal);
});

editProfileForm.addEventListener("submit", handleEditProfileSubmit);

newPostBtn.addEventListener("click", function () {
  openModal(editNewPost);
  const inputs = [imageLinkInput, profileCaptionInput];
  toggleButtonState(inputs, modalNewSubmitBtn, settings);
});

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", handleEscapeKey);
  modal.removeEventListener("mousedown", handleOverlayClose);
}

editNewPostCloseBtn.addEventListener("click", function () {
  closeModal(editNewPost);
});

function handleDeleteCard(cardElement, data) {
  selectedCard = cardElement;
  selectedCardId = data._id;
  openModal(deleteModal);
}
function handleDeleteSubmit(evt) {
  evt.preventDefault();
  const restore = setButtonLoading(
    deleteForm.querySelector(".modal__submit-btn"),
    "Deleting...",
    "Delete",
  );
  api
    .removeCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch(console.error)
    .finally(restore);
}
deleteCloseBtn.addEventListener("click", function () {
  closeModal(deleteModal);
});
deleteForm.addEventListener("submit", handleDeleteSubmit); // -- ends here

avatarEditBtn.addEventListener("click", function () {
  resetValidation(avatarForm, [avatarLinkInput], settings);
  toggleButtonState(
    [avatarLinkInput],
    avatarForm.querySelector(".modal__submit-btn"),
    settings,
  );
  openModal(avatarModal);
});
avatarCloseBtn.addEventListener("click", function () {
  closeModal(avatarModal);
});
avatarForm.addEventListener("submit", function (evt) {
  evt.preventDefault();
  const restore = setButtonLoading(
    avatarForm.querySelector(".modal__submit-btn"),
    "Saving...",
    "Save",
  );
  api
    .updateAvatar(avatarLinkInput.value)
    .then(() => {
      profileAvatarEl.src = avatarLinkInput.value;
      closeModal(avatarModal);
    })
    .catch(console.error)
    .finally(restore);
});

function handleOverlayClose(evt) {
  if (evt.target === evt.currentTarget) {
    closeModal(evt.currentTarget);
  }
}

function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;
  cardTitleEl.textContent = data.name;

  const cardLikeBtnEl = cardElement.querySelector(".card__like-btn"); // TODO - added if statement
  if (data.isLiked) {
    cardLikeBtnEl.classList.add("card__like-btn_active");
  }

  // -- added a api for change like status
  cardLikeBtnEl.addEventListener("click", () => {
    const isLiked = cardLikeBtnEl.classList.contains("card__like-btn_active");
    api
      .changeLikeStatus(data._id, isLiked)
      .then((res) => {
        if (res.isLiked) {
          cardLikeBtnEl.classList.add("card__like-btn_active");
        } else {
          cardLikeBtnEl.classList.remove("card__like-btn_active");
        }
      })
      .catch(console.error);
  });

  const cardDeleteBtnEl = cardElement.querySelector(".card__delete-btn");
  cardDeleteBtnEl.addEventListener("click", (evt) => {
    evt.stopPropagation();
    handleDeleteCard(cardElement, data);
  });

  cardImageEl.addEventListener("click", () => {
    previewImageEl.src = data.link;
    previewImageEl.alt = data.name;
    previewCaption.textContent = data.name;
    openModal(previewModal);
  });

  return cardElement;
}

editPostForm.addEventListener("submit", function (evt) {
  evt.preventDefault();

  const inputValues = {
    name: profileCaptionInput.value,
    link: imageLinkInput.value,
  };

  const restore = setButtonLoading(modalNewSubmitBtn, "Saving...", "Save");

  api
    .addCard(inputValues)
    .then((data) => {
      const cardElement = getCardElement(data);
      cardsList.prepend(cardElement);
      evt.target.reset();
      closeModal(editNewPost);
    })
    .catch(console.error)
    .finally(restore);
});

function handleEscapeKey(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal_opened");
    if (openedModal) {
      closeModal(openedModal);
    }
  }
}

enableValidation(settings);
