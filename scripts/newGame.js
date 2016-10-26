// this script is adapted form the Trove Image Search deco1800 example:
// http://deco1800.uqcloud.net/examples/troveImage.php

$(document).ready(function() {
  // apiKey to access Trove API
  apiKey = "jsk1qqntnrj7qbvf";
  // image hosts
  urlPatterns = ["flickr.com", "nla.gov.au", "artsearch.nga.gov.au", "recordsearch.naa.gov.au", "images.slsa.sa.gov.au"];

  // have to make these global as $.each iterator only takes 2 arguments
  found = 0;
  loadedImages = [];
  names = [];
  troveLinks = [];

  // preset search terms for pre-set categories
  atiHeritageTerms = ["Aboriginal", "Torres Strait Islander", "Aboriginal Heritage", "Aboriginal Artefacts", "Aboriginal History"];
  natureTerms = ["Australian Flora", "Australian Fauna", "Environment", "Sustainability", "Natural Resources", "Natural Disasters"];
  colAusTerms = ["Colonialism", "Settlement", "Post-Colonialism", "Colony"];
  techTerms = ["Technology", "Science", "Research", "Development", "Invention"];
  nineteenHundredsTerms = ["1900s", "Immigration", "Industrialism", "Development"];
  artTerms = ["Australian Flags", "Australian Art", "Aboriginal Art", "Australian Emblems", "Australian Symbols"];

  // map search term
  mapTerm = "Map of Australia";

  // game settings
  categoryName = "";
  searchTerms = [];
  numTreasures = 0;
  gameSize = 0;
  timeLimit = 0;

  chosenCategoryGameSettings();
  generateMapBackground();
  resetGlobalImageData();
  // // PRESET CATEGORY CHOSEN
  // if (true) {
  //   chosenCategoryGameSettings();
  //
  // // LOADED CATEGORY
  // } else if {
  //   chosenCategoryGameSettings();
  //
  // // NEW CUSTOM CATEGORY
  // } else {
  //   customCategoryGameSettings();
  // }

  // LOADED CATEGORY
  // NEW CUSTOM CATEGORY

  function resetGlobalImageData() {
    found = 0;
    loadedImages = [];
    names = [];
    troveLinks = [];
  }

  function chosenCategoryGameSettings() {
    var query = window.location.search;
    categoryName = query.substring(query.lastIndexOf("=") + 1);

    if (categoryName == "atiHeritage") {
      searchTerms = atiHeritageTerms;
    } else if (categoryName == "nature") {
      searchTerms = natureTerms;
    } else if (categoryName == "colAus") {
      searchTerms = colAusTerms;
    } else if (categoryName == "tech") {
      searchTerms = techTerms;
    } else if (categoryName == "nineteenHundreds") {
      searchTerms = nineteenHundredsTerms;
    } else if (categoryName == "art") {
      searchTerms = artTerms;
    }

    numTreasures = 6;
    gameSize = 4;
    timeLimit = 5;
  }

  function loadedCategoryGameSettings() {
  }

  function customCategoryGameSettings() {
  }

  // do the api call and process images to generate the map background
  function generateMapBackground() {
    var url = createURL(mapTerm);
    //get the JSON information we need to display the images
    $.getJSON(url, function(data) {
      $.each(data.response.zone[0].records.work, processImages);
    }). done (function() {
      waitForFlickrToPrintMap();
    });
  };

  function waitForFlickrToPrintMap() {
    if(found == loadedImages.length) {
      pickAndDisplayMapBackground();
    } else {
      setTimeout(waitForFlickr, 250);
    }
  }

  function pickAndDisplayMapBackground() {
    var randomIndex = (Math.floor(Math.random() * found  - 1));

    // make sure the picked image is loaded properly
    while (typeof loadedImages[randomIndex] == "undefined" ||
        typeof names[randomIndex] == "undefined" ||
        typeof troveLinks[randomIndex] == "undefined") {
      randomIndex = (Math.floor(Math.random() * found  - 1));
    }

    // construct a map information array
    // index 0:imageURL, 1:name, 2:isTreasure, 3:trovelink
    var map = [];
    map.push(loadedImages[randomIndex]);
    map.push(names[randomIndex]);
    map.push(true);
    map.push(troveLinks[randomIndex]);
    $("#imagegrid").css({"background-image": "url(" + map[0] + ")"});
    mapInfoPopsUp(map);
  }

  // set the more map button to pop up with map info
  function mapInfoPopsUp(map) {
    var mapImageUrl = map[0];
    var mapImageName = map[1];
    // we dont need mapImage[2] because we dont care about map status
    var mapImageTroveLink = map[3];

    // alt is the image title
    $("#moremap").attr("alt", mapImageName);

    // href of the link that contains the image is the popup image
    $("#moremap").parent().attr("href", mapImageUrl);

    // title of parent link is the description
    $("#moremap").parent().attr("title", mapImageTroveLink);
  }

  //s is the start number, n is the number of results
  function createURL(searchTerm) {
    // randomly generate a number for results to start from so that you get different
    // images every time

    return "http://api.trove.nla.gov.au/result?key="
      + apiKey
      // available online for free
      + "&l-availability=y%2Ff"
      // Works identified as published primarily in Australia, or written by Australians
      + "&l-australian=y"
      // json encoding and in the picture zone
      + "&encoding=json&zone=picture"
      // sort by relevance, and get the top 100 (max)
      + "&sortby=relevance"
      // number of results
      + "&n=100"
      // add random start number
      + "&s=0"
      // uri encode the search term
      + "&q=" + encodeURI(searchTerm) + "&callback=?";
  }

  /*
   *   Depending where the image comes from, there is a special way to get that image from the website.
   *   This function works out where the image is from, and gets the image URL
   */
  function processImages(index, troveItem) {
    var imgUrl = troveItem.identifier[0].value;
    var imgName = troveItem.title;
    var imgTroveLink = troveItem.troveUrl;

    if (imgUrl.indexOf(urlPatterns[0]) >= 0) { // flickr
      if (addFlickrItem(imgUrl, troveItem)) {
        found++;
        names.push(imgName);
        troveLinks.push(imgTroveLink);
      }
    } else if (imgUrl.indexOf(urlPatterns[1]) >= 0) { // nla.gov
      nlaUrl = imgUrl + "/representativeImage?wid=900"; // change ?wid=900 to scale the image
      if ($.inArray(nlaUrl, loadedImages) == -1) { // if not already in loadedImages
          found++;
          loadedImages.push(nlaUrl);
          names.push(imgName);
          troveLinks.push(imgTroveLink);
      }
    } else if (imgUrl.indexOf(urlPatterns[2]) >= 0) { //artsearch
      artUrl = "http://artsearch.nga.gov.au/IMAGES/LRG/" + getQueryVariable("IRN", imgUrl) + ".jpg";
      if ($.inArray(artUrl, loadedImages) == -1) { // if not already in loadedImages
          found++;
          loadedImages.push(artUrl);
          names.push(imgName);
          troveLinks.push(imgTroveLink);
      }
    } else if (imgUrl.indexOf(urlPatterns[3]) >= 0) { //recordsearch
      recordUrl = "http://recordsearch.naa.gov.au/NAAMedia/ShowImage.asp?T=P&S=1&B=" + getQueryVariable("Number", imgUrl);
      if ($.inArray(recordUrl, loadedImages) == -1) { // if not already in loadedImages
          found++;
          loadedImages.push(recordUrl);
          names.push(imgName);
          troveLinks.push(imgTroveLink);
      }
    } else if (imgUrl.indexOf(urlPatterns[4]) >= 0) { //slsa
      slsaUrl = imgUrl.slice(0, imgUrl.length - 3) + "jpg";
      if ($.inArray(slsaUrl, loadedImages) == -1) { // if not already in loadedImages
          found++;
          loadedImages.push(slsadUrl);
          names.push(imgName);
          troveLinks.push(imgTroveLink);
      }
    } else { // Could not reliably load image for item
          // UNCOMMENT FOR DEBUG:
    // console.log("Not available: " + imgUrl);
    }
  }

  // from http://css-tricks.com/snippets/javascript/get-url-variables/
  function getQueryVariable(variable, url) {
      var query = url.split("?");
      var vars = query[1].split("&");
      for (var i = 0; i < vars.length; i++) {
          var pair = vars[i].split("=");
          if (pair[0] == variable) {
              return pair[1];
          }
      }
      return (false);
  }

  function addFlickrItem(imgUrl, troveItem) {
      var flickr_key = "a4d0bf2f4bde0595521b7bd8317ec428";
      var flickr_secret = "efc7221b694ff55e";
      var flickr_url = "https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=" + flickr_key + "&photo_id=";
      var url_comps = imgUrl.split("/");
      var photo_id = url_comps[url_comps.length - 1];

      $.getJSON(flickr_url + photo_id + "&format=json&nojsoncallback=1", function(data) {
          if (data.stat == "ok") {
              var flickr_image_url = data.sizes.size[data.sizes.size.length - 1].source;
              if ($.inArray(flickr_image_url, loadedImages) == -1) {
                loadedImages.push(flickr_image_url);
                return true;
              } else {
                return false;
              }
          }
      });
  }
});
