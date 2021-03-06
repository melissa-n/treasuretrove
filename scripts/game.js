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

  // variable so that some code only gets run on the last iteration of the getJson API calls in the for loop
  // in generateGameImages method
  timesCalled = 0;

  //map data
  mapData = [];
  // only images to find in game (the ones that appear on the treasure list scroll)
  treasureData = [];
  // all images in game
  gameImages = [];

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

  // ideally, if the website was fully functioning the first method called here would depend on which
  // form was submitted from index.html (chosen category, loaded custom game, or new custom game)
  // e.g.
  // // PRESET CATEGORY CHOSEN
  // if () {
  //   chosenCategoryGameSettings();
  //
  // // LOADED CATEGORY
  // } else if () {
  //   chosenCategoryGameSettings();
  //
  // // NEW CUSTOM CATEGORY
  // } else {
  //   customCategoryGameSettings();
  // }

  chosenCategoryGameSettings();
  generateMapBackground();
  resetGlobalImageData();
  setTimeout(generateGameImages, 1500);
  checkOffFoundItems();
  replacePhotoAfterClicked();

  // method was created to get game settings from a non preset category game option
  function loadGameGameSettings() {
    //searchTerms make all search term inputs into an array
    numTreasures = getValue("numberOfTreasures");
    gameSize = getValue("gameSize");
    timeLimit = getValue("timeLimit");
  }

  // from http://stackoverflow.com/questions/13470285/how-can-i-pass-values-from-one-html-page-to-another-html-page-using-javascript
  // gets the value from the get form method when moving from index.html to game.html to load game settngs
  function getValue(varname) {
    var url = window.location.href;
    var qparts = url.split("?");

    if (qparts.length == 1)
    {
        return "";
    }
    else{
        var query = qparts[1];
        var vars = query.split("&");
        var value = "";
        for (i=0;i<vars.length;i++)
        {
            var parts = vars[i].split("=");
            if (parts[0] == varname)
            {
                value = parts[1];
                break;
            }
        }
        value = unescape(value);

        // Convert "+"s to " "s
        value.replace(/\+/g," ");
        return value;
    }
  }

// both the map and game images use the same global variables so they must be cleared and reset
// after the map is loaded so that the game images do not contain map data
  function resetGlobalImageData() {
    found = 0;
    loadedImages = [];
    names = [];
    troveLinks = [];
  }

// the user chose to pick a pre-selected category
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

    // default settings
    numTreasures = 6;
    gameSize = 4;
    timeLimit = 1.5;
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
      pickAndDisplayMapBackground();
    });
  };

  // make sure all the flickr images are loaded
  function waitForFlickrToPrintMap() {
    if(found == loadedImages.length) {
      pickAndDisplayMapBackground();
    } else {
      setTimeout(waitForFlickrToPrintMap, 250);
    }
  }

  // once all the images are loaded, load the page data
  function pickAndDisplayMapBackground() {
    var randomIndex = (Math.floor(Math.random() * found  - 1));

    // make sure the picked image is loaded properly
    while (typeof loadedImages[randomIndex] == "undefined" ||
        typeof names[randomIndex] == "undefined" ||
        typeof troveLinks[randomIndex] == "undefined") {
      randomIndex = (Math.floor(Math.random() * found  - 1));
    }
    var mapData = [];
    // construct a map information array
    // index 0:imageURL, 1:name, 2:isTreasure, 3:trovelink
    var map = [];
    map.push(loadedImages[randomIndex]);
    map.push(names[randomIndex]);
    map.push(true);
    map.push(troveLinks[randomIndex]);
    mapData.push(map);
    $("#imagegrid").css({"background-image": "url(" + mapData[0][0] + ")"});
    mapInfoPopsUp(mapData[0]);
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
    $("#moremap").parent().attr("title", "<a href=\"" + mapImageTroveLink + "\">" + mapImageTroveLink + "</a>");
  }

  // makes api calls with each of the search terms
  function generateGameImages() {
    for (var i = 0; i < searchTerms.length; i++) {
      var url = createURL(searchTerms[i]);

      $.getJSON(url, function(data) {
        $.each(data.response.zone[0].records.work, processImages);
      }).done(function() {
        // only populate the game after the last api call
        timesCalled++;
        if (timesCalled == searchTerms.length) {
          populateGame();
        }
      });
    }
  }

  function waitForFlickrToPopulateGame() {
    if(found == loadedImages.length) {
      populateGame();
    } else {
      setTimeout(waitForFlickrToPopulateGame, 250);
    }
  }

  function populateGame() {
    // if not enough images tell the player to refresh
    if (!enoughImagesForGame) {
      window.alert("There were troubles loading your game data :( " +
        + "Please refresh or pick a different category!");
    } else {
      // pick random indices
      var randomIndices = pickRandomIndices(gameSize*gameSize);
      gameImages = setImages(randomIndices);
      console.log(gameImages);
      // populate game
      treasureData = createTreasureList(gameImages);
      window.localStorage.setItem("treasureData", JSON.stringify(treasureData));
      createImageGrid(gameImages);
    }
  }

  // pick random indices for random images
  function pickRandomIndices(imagesOnScreen) {
    var randomIndices = [];

    while (randomIndices.length < imagesOnScreen) {
      var randomIndex = Math.floor((Math.random() * found) + 1);
      if ($.inArray(randomIndex, randomIndices) <= -1
          && typeof loadedImages[randomIndex] != "undefined" &&
              typeof names[randomIndex] != "undefined" &&
              typeof troveLinks[randomIndex] != "undefined") {
        randomIndices.push(randomIndex);
      }
    }

    return randomIndices;
  }

// pick the images to be used in the game
  function setImages(randomIndices) {
    var gameImages = [];

    // construct a game images information array
    // index 0:imageURL, 1:name, 2:isTreasure, 3:trovelink
    for (var i = 0; i < randomIndices.length; i++) {
      var gameImage = [];

      // url
      var imageUrl = loadedImages[randomIndices[i]];
      gameImage.push(imageUrl);
      //name
      var imageName = names[randomIndices[i]];
      gameImage.push(imageName);
      // on list status
      if (i < numTreasures) {
        gameImage.push(true);
      } else {
        gameImage.push(false);
      }
      // trove link
      var trovelink = troveLinks[randomIndices[i]];
      gameImage.push(trovelink);

      gameImages.push(gameImage);
    }
    return shuffleArray(gameImages);
  }

  // creates the list on the scroll
  function createTreasureList(gameImages) {
    var treasures = [];
    var table = $("#list");

    for (var i = 0; i < numTreasures; i++) {
      table.append("<tr><td></td><td class='check'></td></tr>");
    }

    var tableLineCounter = 0;
    var tableValues = $("#list tr td:first-of-type");

    for (var i = 0; i < gameImages.length; i++) {
      var isOnList = gameImages[i][2];
      if (isOnList) {

        // replace long names
        var name = gameImages[i][1];
        if (name.length > 120) {
          var name = name.slice(0, 117) + "..."
        }

        $(tableValues[tableLineCounter]).replaceWith(name);
        treasures.push(gameImages[i]);

        tableLineCounter++;
      }
    }
    return treasures;
  }

  // create the image grid displayed
  function createImageGrid(gameImages) {
    var imageGrid = $("#imagegrid");
    var gridImages = [];
    for (var i = 0; i < gameSize*gameSize; i++) {
      imageGrid.append('<a href="" rel="prettyPhoto" title=""><img id="img' + i.toString() + '" class="grid" src="" alt=""/></a>');
      var image = $("#imagegrid #img" + i.toString());
      gridImages.push(image);
    }

    for (var j in gridImages) {
      var treasureUrl = gameImages[j][0];
      var treasureName = gameImages[j][1];
      var treasureStatus = gameImages[j][2];
      var treasureTroveLink = gameImages[j][3];

      // src for the image itself
      $(gridImages[j]).attr("src", treasureUrl);

      var popUpComment = "";
      if (treasureStatus) {
        popUpComment = "JOLLY GOOD! YOU FOUND: ";
      } else {
        popUpComment = "WALK THE PLANK! THAT'S NOT TREASURE: ";
      }

      // alt is the image title
      $(gridImages[j]).attr("alt", popUpComment + treasureName);

      // href of the link that contains the image is the popup image
      $(gridImages[j]).parent().attr("href", treasureUrl);

      // title of the link that contains the image is the title
      //treasureTroveLinkHtml
      $(gridImages[j]).parent().attr("title", "<a href=\"" + treasureTroveLink + "\">" + treasureTroveLink + "</a>");

      // activate pretty photo
      $("a[rel^='prettyPhoto']").prettyPhoto();
    }
  }

  function checkOffFoundItems() {
    // pretty photo takes over event handler so cant use .click function :( had  to see if a
    //  pretty photo image was presented on screen
    $(document).on('DOMNodeInserted', function(e) {
      if (e.target.id == 'fullResImage') {
         var clickedImageUrl = $("#fullResImage").attr("src");

         var checkValues = $("#list tbody tr td.check");
         var foundImages = 0;

         // add tick picture next to found images
         for (var i = 0; i < treasureData.length; i++) {
           // if the image url matches
           if (treasureData[i][0] == clickedImageUrl) {
             if ($(checkValues[i]).children().length <= 0) {
               $(checkValues[i]).append("<img class='tick' src='images/tick.png' alt='green tick'>");
             }
             break;
           }
         }

         for (var i = 0; i < treasureData.length; i++) {
           if ($(checkValues[i]).children().length > 0) {
             foundImages++;
           }
         }

         if (foundImages == checkValues.length) {
           window.location = "endGame.html";
         }
      }
    });
  }

  // replace the photow with a coin if they got it right and skull and crossbones
  // if they got it wrong
  function replacePhotoAfterClicked() {
    $(document).on('DOMNodeInserted', function(e) {
      if (e.target.id == 'fullResImage') {
         var clickedImageUrl = $("#fullResImage").attr("src");

         var imageOnScreenValues = [];
         for (var i = 0; i < gameImages.length; i++) {
           imageOnScreenValues.push($("#imagegrid #img" + i.toString()));
         }
         console.log(imageOnScreenValues);

         for (var i = 0; i < treasureData.length; i++) {
           // if the image url matches
           if (treasureData[i][0] == clickedImageUrl) {
             //console.log(clickedImageUrl);
             for (var j = 0; j < imageOnScreenValues.length; j++) {
               var imagesrc = $(imageOnScreenValues[j]).attr("src");
               //console.log(imagesrc);
               if (imagesrc == clickedImageUrl) {
                 $(imageOnScreenValues[j]).attr("src", "images/gold_coin.png");
                 break;
               }
             }
             break;
           } else if (i == treasureData.length - 1) {
             for (var k = 0; k < imageOnScreenValues.length; k++) {
               var imagesrc = $(imageOnScreenValues[k]).attr("src");
               //console.log(imagesrc);
               if (imagesrc == clickedImageUrl) {
                 $(imageOnScreenValues[k]).attr("src", "images/skull_crossbones.png");
                 break;
               }
             }
             break;
           }
         }
      }
    });
  }

// shuffle an array
  function shuffleArray(array) {
      for (var i = array.length - 1; i > 0; i--) {
          var j = Math.floor(Math.random() * (i + 1));
          var temp = array[i];
          array[i] = array[j];
          array[j] = temp;
      }
      return array;
  }

  // true if enough, false if not
  function enoughImagesForGame() {
    if (found < gameSize*gameSize) {
      return false;
    } else {
      return true;
    }
  }

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
