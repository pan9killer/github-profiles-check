import "../styles/style.scss";

import axios from "axios";

import * as _ from "lodash";

import * as $ from "jquery";
import pagination from "paginationjs";

const refs = {
  mainContent: document.querySelector("main"),
  inputSearch: document.querySelector(".js-input-searchGitHub"),
  btnSearch: document.querySelector(".js-btn-search"),
};

// "https://api.github.com/users/Hibanaga/repos"
// "https://api.github.com/users/Hibanaga"

// axios(`https://api.github.com/users/Hibanaga/repos?per_page=36`).then(
//   (data) => {
//     console.log(data);
//   }
// );

// axios(`https://api.github.com/users/Hibanaga`).then((data) => {
//   console.log(data);
// });

refs.btnSearch.addEventListener("click", (event) => {
  let nameToSearch = refs.inputSearch.value;

  // console.log(nameToSearch);

  axiosInfoReposetory(nameToSearch);
});

function axiosInfoReposetory(name) {
  axios(`https://api.github.com/users/${name}`)
    .then((data) => {
      // console.log(data);
      successRequest(data.data, name);
    })
    .catch(() => {
      failedRequest();
    });
}

function successRequest(data, searchName) {
  let {
    avatar_url,
    name,
    followers,
    following,
    html_url,
    login,
    public_repos,
  } = data;

  let mainContentContainer = document.createElement("div");
  mainContentContainer.classList.add("mainContainer");

  let wrapperInfoDate = document.createElement("aside");
  wrapperInfoDate.classList.add("asideInfoWrapper");
  mainContentContainer.append(wrapperInfoDate);

  let imgProfile = document.createElement("div");
  imgProfile.style.backgroundImage = `url(${avatar_url})`;
  imgProfile.classList.add("imgProfile");
  wrapperInfoDate.append(imgProfile);

  let h2NameProfile = document.createElement("h2");
  h2NameProfile.classList.add("h2NameProfile");
  h2NameProfile.innerText = name;
  wrapperInfoDate.append(h2NameProfile);

  let linkProfileInfo = document.createElement("a");
  linkProfileInfo.classList.add("linkProfile");
  linkProfileInfo.setAttribute("target", "_blank");
  linkProfileInfo.href = html_url;
  linkProfileInfo.innerText = login;
  wrapperInfoDate.append(linkProfileInfo);

  let divInfoFollowers = document.createElement("div");
  divInfoFollowers.classList.add("wrapperFollowersInfo");
  wrapperInfoDate.append(divInfoFollowers);

  //follower info
  let followersLink = document.createElement("div");
  followersLink.classList.add("followersInfo");
  divInfoFollowers.append(followersLink);

  let imgFollowers = document.createElement("div");
  imgFollowers.classList.add("imgFollowers");
  followersLink.append(imgFollowers);

  let infoFollowers = document.createElement("span");
  infoFollowers.classList.add("spanInfoFollowers");
  infoFollowers.innerText = `${followers} followers`;
  followersLink.append(infoFollowers);

  //following Info
  let followingLink = document.createElement("div");
  followingLink.classList.add("followingInfo");
  divInfoFollowers.append(followingLink);

  let imgFollowing = document.createElement("div");
  imgFollowing.classList.add("imgFollowing");
  followingLink.append(imgFollowing);

  let infoFollowing = document.createElement("span");
  infoFollowing.classList.add("spanInfoFollowers");
  infoFollowing.classList.add("spanInfoFollowing");
  infoFollowing.innerText = `${following} following`;
  followingLink.append(infoFollowing);

  refs.mainContent.innerHTML = ``;
  refs.mainContent.append(mainContentContainer);

  axios(
    `https://api.github.com/users/${searchName}/repos?per_page=${public_repos}`
  )
    .then((data) => {
      let contentBlockReposetory = document.createElement("article");
      contentBlockReposetory.classList.add("reposetoryInfoContainer");
      mainContentContainer.append(contentBlockReposetory);

      let reposetoryInfoData = document.createElement("div");
      reposetoryInfoData.classList.add("mainContentInfoLoader");
      contentBlockReposetory.append(reposetoryInfoData);

      let loadingData = document.createElement("div");
      loadingData.classList.add("loaderImg");
      reposetoryInfoData.append(loadingData);

      return data.data;
    })
    .then((data) => {
      reposetoryContentInfo(data);
    });
}

function reposetoryContentInfo(data) {
  if (_.isEmpty(data)) {
    console.log("win");
    emptyRepositoryLists();
    return;
  }

  let containerReposetoryInfo = document.querySelector(
    ".reposetoryInfoContainer"
  );

  containerReposetoryInfo.innerHTML = ``;

  let reposetoryCountTitle = document.createElement("h1");
  reposetoryCountTitle.classList.add("reposetoryCountTitle");
  reposetoryCountTitle.innerText = `Repositories (${data.length})`;
  containerReposetoryInfo.append(reposetoryCountTitle);

  let listReposetory = document.createElement("div");
  listReposetory.classList.add("listReposetory");
  containerReposetoryInfo.append(listReposetory);

  let paginationBlockInfo = document.createElement("div");
  paginationBlockInfo.classList.add("paginationCounter");
  containerReposetoryInfo.append(paginationBlockInfo);

  $(".paginationCounter").pagination({
    dataSource: data,
    pageSize: 4,
    showPrevious: true,
    showNext: true,
    showPageNumbers: true,
    callback: function (data, pagination) {
      createListRepo(data);
    },
  });
}

function createListRepo(data) {
  console.log(data);

  let listRepo = document.querySelector(".listReposetory");
  listRepo.innerHTML = ``;

  data.map(({ clone_url, name, description, html_url }) => {
    let repoBlockInfo = document.createElement("div");
    repoBlockInfo.classList.add("repoInfoData");

    let linkRepoData = document.createElement("a");
    linkRepoData.classList.add("linkRepo");
    linkRepoData.setAttribute("target", "_blank");
    linkRepoData.href = clone_url;
    linkRepoData.innerText = name;
    repoBlockInfo.append(linkRepoData);

    let descriptionInfo = document.createElement("span");
    descriptionInfo.classList.add("descriptionProjectGitHub");
    descriptionInfo.innerText = html_url;
    repoBlockInfo.append(descriptionInfo);

    listRepo.append(repoBlockInfo);
  });
}

function emptyRepositoryLists() {
  let containerReposetoryInfo = document.querySelector(
    ".reposetoryInfoContainer"
  );
  containerReposetoryInfo.innerHTML = ``;

  let reposetoryEmptyList = document.createElement("div");
  reposetoryEmptyList.classList.add("containerInitial");
  containerReposetoryInfo.append(reposetoryEmptyList);

  let reposetoryStartPosition = document.createElement("div");
  reposetoryStartPosition.classList.add("startPositionInfo");
  reposetoryEmptyList.append(reposetoryStartPosition);

  let imgReposetoryEmpty = document.createElement("div");
  imgReposetoryEmpty.classList.add("imgReposetoryEmpty");
  imgReposetoryEmpty.classList.add("imgInitialSearch");
  reposetoryStartPosition.append(imgReposetoryEmpty);

  let subtitleReposetoryList = document.createElement("h2");
  subtitleReposetoryList.classList.add("descriptionInitialSearch");
  subtitleReposetoryList.classList.add("descriptionEmptyReposetoryList");
  subtitleReposetoryList.innerText = `Repository list is empty`;
  reposetoryStartPosition.append(subtitleReposetoryList);
}

function failedRequest() {
  let containerFailed = document.createElement("div");
  containerFailed.classList.add("containerInitial");

  let failedPositionInfo = document.createElement("div");
  failedPositionInfo.classList.add("startPositionInfo");
  containerFailed.append(failedPositionInfo);

  let imgCancelRequest = document.createElement("div");
  imgCancelRequest.classList.add("imgInitialSearch");
  imgCancelRequest.classList.add("imgCancel");
  failedPositionInfo.append(imgCancelRequest);

  let descriptionCancelRequest = document.createElement("h2");
  descriptionCancelRequest.classList.add("descriptionInitialSearch");
  descriptionCancelRequest.innerText = `User not found`;
  failedPositionInfo.append(descriptionCancelRequest);

  refs.mainContent.innerHTML = ``;

  refs.mainContent.append(containerFailed);
}



document.addEventListener('DOMContentLoaded', function() {
  document.querySelector('.js-input-searchGitHub').addEventListener('keydown', function(e) {
    if (e.keyCode == 13) {
      axiosInfoReposetory(this.value)
      e.preventDefault();
    }
  }, false);
});