//script ot make prettyPhotoWork

$(document).ready(function(){
  $("a[rel^='prettyPhoto']").prettyPhoto();
});

function prettyLaunch(linkurl, title) {
   document.getElementById("prettyLink").href = linkurl;
   document.getElementById("prettyLink").title = title;

   $.prettyPhoto.open(linkurl+'?iframe=true&amp;width=100%&amp;height=100%',title);
}
