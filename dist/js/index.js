"use strict";console.log(111),$(function(){$(".latest-music").append($("<h3>1</h3>")),"function"==typeof $.get&&$(".latest-music").append($("<h3>2</h3>")),$.get("//owf5g9dnv.bkt.clouddn.com/songsDB.json?v=20170921",function(n){$(".latest-music").append($("<h3>3</h3>"));var s=n,i=$(".latest-music"),o=$("<ol></ol>");s.forEach(function(n,s){$li=$('\n        <li>\n          <h3 class="song-name">'+n.songName+'</h3>\n          <p class="song-info">  \n            '+n.songAuthor+" - "+n.album+'\n          </p>\n          <a class="play-btn" href="#">\n              <svg class="icon" aria-hidden="true">\n                <use xlink:href="#icon-play"></use>\n              </svg>\n          </a>\n        </li>\n      '),!0===n.sq&&$li.find(".song-info").prepend($('\n          <svg class="icon sq" aria-hidden="true">\n            <use xlink:href="#icon-sq"></use>\n          </svg>\n        ')),o.append($li)}),i.append(o),i.find(".loading").remove(),o.on("click","li",function(){var n=$(this).index();window.location.href="./play.html?id="+n})})});