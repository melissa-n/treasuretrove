$(document).ready(function() {

  // this script is adapted form the Trove Image Search deco1800 example:
  // http://deco1800.uqcloud.net/examples/troveImage.php
  var loadedImages = [];
  var urlPatterns = ["flickr.com", "nla.gov.au", "artsearch.nga.gov.au", "recordsearch.naa.gov.au", "images.slsa.sa.gov.au"];
  var found = 0;
  var apiKey = "jsk1qqntnrj7qbvf";

  var atiHeritageTerms = ["Aboriginal", "Torres Strait Islander", "Aboriginal Heritage", "Aboriginal Artefacts", "Aboriginal History"];
  var natureTerms = ["Australian Flora", "Australian Fauna", "Environment", "Sustainability", "Natural Resources", "Natural Disasters"];
  var colAusTerms = ["Colonialism", "Settlement", "Post-Colonialism"];
  var techTerms = ["Technology", "Science", "Research", "Development", "Invention"];
  var nineteenHundredsTerms = ["1900s", "Immigration", "Industrialism", "Development"];
  var artTerms = ["Australian Flags", "Australian Art", "Aboriginal Art", "Australian Emblems", "Australian Symbols"];
  var mapTerm = "Map of Australia";

  var query = window.location.search;
  var category = query.substring(query.lastIndexOf("=") + 1);

  generateMapBackground();

  var loadedImages = [];
  var found = 0;
  var names = [];
  var troveLinks = [];

  imageData = [];
  mapData = [];
  treasureData = [];

  var searchTerms = [];

  var imageIndices = pickRandomIndices(16);
  var imageStatuses = assignSelectedStatus(imageIndices, 6);

  $('#output').empty();
  //get input values
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

  for (i in searchTerms) {
    var url = createURL(searchTerms[i]);
    //get the JSON information we need to display the images
    $.getJSON(url, function(data) {
        $.each(data.response.zone[0].records.work, processImages);
        if (i == (searchTerms.length - 1)) {
        	console.log("a");
          pickImages(imageIndices, imageStatuses);
          console.log(imageData);
          // waitForFlickr();
          createList();
          createImageGrid();
        }
    });
  }

  playGame();

  ////////////////////////////

  function waitForFlickr() {
    if(found == loadedImages.length) {
      printImages();
    } else {
      setTimeout(waitForFlickr, 250);
    }
  }

  function shuffleArray(array) {
      for (var i = array.length - 1; i > 0; i--) {
          var j = Math.floor(Math.random() * (i + 1));
          var temp = array[i];
          array[i] = array[j];
          array[j] = temp;
      }
      return array;
  }

  function pickRandomIndices(numberOnScreen) {
    randomIndices = [];
    while (randomIndices.length < numberOnScreen) {
      randomIndex = Math.floor((Math.random() * 30) + 1);
      if ($.inArray(randomIndex, randomIndices) <= -1) {
        randomIndices.push(randomIndex);
      }
    }
    return shuffleArray(randomIndices);
  }

  function assignSelectedStatus(array, numberSelected) {
    selectedValues = [];
    for (i = 0; i < array.length; i++) {
      if (i < numberSelected) {
        selectedValues.push(true);
      } else {
        selectedValues.push(false);
      }
    }
    return selectedValues;
  }

  function pickImages(indicesArray, statusArray) {
    assignedImages = [];
    for (i = 0; i < indicesArray.length; i++) {
      var imageArray = [];

      randomImageUrl = loadedImages[indicesArray[i]];
      imageArray.push(randomImageUrl);

      randomImageName = names[indicesArray[i]];
      imageArray.push(randomImageName);

      randomImageStatus = statusArray[i];
      imageArray.push(randomImageStatus);

      randomImageTroveLink = troveLinks[indicesArray[i]];
      imageArray.push(randomImageTroveLink);

      assignedImages.push(imageArray);
    }

    imageData = shuffleArray(assignedImages);
    return imageData;
  }

  function createURL(searchTerm, s, n) {
    // randomly generate a number for results to start from so that you get different
    // images every time
    if (s != null) {
      var randomS = s;
    } else {
      var randomS = Math.floor((Math.random() * 50) + 1);
    }

    if (n != null) {
      var results = n;
    } else {
      var results = 100;
    }

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
      + "&n=" + results.toString()
      // add random start number
      + "&s=" + randomS.toString()
      // uri encode the search term
      + "&q=" + encodeURI(searchTerm) + "&callback=?";
  }

  function generateMapBackground() {
    loadedImages = [];
    found = 0;
    names = [];
    troveLinks = [];

    var url = createURL(mapTerm, 0, 30);
    //get the JSON information we need to display the images
    $.getJSON(url, function(data) {
        console.log(data);
        $('#output').empty();
        $.each(data.response.zone[0].records.work, processImages);
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

  function createList() {
    var tableValues = $("#list tr td:first-of-type");
    var tableLineCounter = 0;
    for (i in imageData) {
      var isOnList = imageData[i][2];
      if (isOnList) {
        var name = imageData[i][1];

        if (name.length > 120) {
          var shortenedName = name.slice(0, 117) + "..."
        } else {
          var shortenedName = name;
        }
        $(tableValues[tableLineCounter]).replaceWith(shortenedName);
        treasureData.push(imageData[i]);

        tableLineCounter++;
      }
    }
  }

  //&lt;a href=&quot;yourLink.html&quot;&gt;Trade Show Panels - 2011&lt;/a&gt;

  function createImageGrid() {
    var gridImages = [];
    for (i = 1; i < 17; i++) {
      image = $("#imagegrid img#" + i.toString());
      gridImages.push(image);
    }

    console.log(gridImages);
    for (j in gridImages) {
      var treasureUrl = imageData[j][0];
      var treasureName = imageData[j][1];
      var treasureStatus = imageData[j][2];
      var treasureTroveLink = imageData[j][3];

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
      //treasureTroveLinkHtml will make the description a link
      // doesnt work :(
      /*
      var linkHtml = "&lt;a href=&quot;" + treasureTroveLink + "&quot;&gt;"
        + treasureTroveLink + "&lt;/a&gt;";*/
      $(gridImages[j]).parent().attr("title", treasureTroveLink);
      //if (imageData[j][2]) {
      //    $(gridImages[j]).css({"border": "1px solid red"});
      //}
    }
  }

  function printImages() {
     // Print out all images
      for (var i in imageData) {
          var image = new Image();
          fullImageName = imageData[i][1];
          if (fullImageName.length > 100) {
            var imageName = fullImageName.slice(0, 97) + "..."
          } else {
            var imageName = fullImageName;
          }
          image.src = imageData[i][0];
          image.style.display = "inline-block";
          image.style.width = "48%";
          image.style.margin = "1%";
          image.style.verticalAlign = "top";

          $("#output").append(image);
          if (imageData[i][2]) {
            image.style.border = "5px solid pink";
          }

          $("#output").append("</br>" + "Name: " + imageName + "</br>");
          $("#output").append("</br>" + "Source: " + image.src + "</br>");
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

  function imagesIncreaseSize() {
    $("#imagegrid img").hover(
      function () {
        $(this).addClass("over");
      },
      function () {
        $(this).removeClass("over");
      }
    );
  }

  function checkOffFoundItems() {
    $("#imagegrid img").click(function () {
      var tableValues = $("#list tr td:first-of-type");
      var checkValues = $("#list tr td.check");
      var imageUrl = $(this).attr("src");
      var found = 0;

      for (i in treasureData) {
        // if the image url matches
        if (treasureData[i][0] == imageUrl) {
          console.log(treasureData[i][1]);
          if ($(checkValues[i]).children().length <= 0) {
            $(checkValues[i]).append("<img class='tick' src='images/tick.png' alt='green tick'>");
          }
          break;
        }
      }

      for (i in treasureData) {
        if ($(checkValues[i]).children().length > 0) {
          found++;
        }
      }

      if (found == checkValues.length) {
        window.location = "endgame.html";
      }
    });
  }

  function mapInfoPopsUp() {
    var mapImage = mapData[0];
    console.log(mapImage);
    var mapImageUrl = mapImage[0];
    var mapImageName = mapImage[1];
    // we dont need mapImage[2] because we dont care about map status
    var mapImageTroveLink = mapImage[3];

    // alt is the image title
    $("#moremap").attr("alt", mapImageName);

    // href of the link that contains the image is the popup image
    $("#moremap").parent().attr("href", mapImageUrl);

    // title of parent link is the description
    $("#moremap").parent().attr("title", mapImageTroveLink);
  }

  function playGame() {
    // hover over image
    imagesIncreaseSize();

    // checks if clicked images are on the list - check them off if they are
    checkOffFoundItems();
  }
});
