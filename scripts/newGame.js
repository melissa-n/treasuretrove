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
  categoryName;
  searchTerms;
  numTreasures;
  gameSize;
  timeLimit;

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
    categoryName = substring(query.lastIndexOf("=") + 1);

    if (category == "atiHeritage") {
      searchTerms = atiHeritageTerms;
    } else if (category == "nature") {
      searchTerms = natureTerms;
    } else if (category == "colAus") {
      searchTerms = colAusTerms;
    } else if (category == "tech") {
      searchTerms = techTerms;
    } else if (category == "nineteenHundreds") {
      searchTerms = nineteenHundredsTerms;
    } else if (category == "art") {
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

      var randomIndex = (Math.floor(Math.random() * ))
    });
        var randomIndex = (Math.floor(Math.random() * loadedImages.length  - 1));
        var map = [];
        map.push(loadedImages[randomIndex]);
        map.push(names[randomIndex]);
        map.push(true);
        map.push(troveLinks[randomIndex]);
        mapData.push(map);
        $("#imagegrid").css({"background-image": "url(" + mapData[0][0] + ")"});
        mapInfoPopsUp();
    });
  };

  function waitForFlickrToPrintMap() {
    if(found == loadedImages.length) {
      pickMapBackground();
    } else {
      setTimeout(waitForFlickr, 250);
    }
  }

  function pickMapBackground() {
    var randomIndex = (Math.floor(Math.random() * found  - 1));

    // make sure the picked image is loaded properly
    while (loadedImages[randomIndex] == null ||
        names[randomIndex] == null ||
        troveLinks[randomIndex] == null) {
      randomIndex = (Math.floor(Math.random() * found  - 1));
    }

    // construct a map information array
    // index 0:imageURL, 1:name, 2:isTreasure, 3:trovelink
    while (loadedImages[random])
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
