$(function(){
  $.get('//owf5g9dnv.bkt.clouddn.com/songsDB.json?v=20170921',function(response){
    let songDB = response
    let $latestMusic = $('.latest-music')
    let $musicList = $('<ol></ol>')

    songDB.forEach((ele,index)=>{
      $li = $(`
        <li>
          <h3 class="song-name">${ele.songName}</h3>
          <p class="song-info">  
            ${ele.songAuthor} - ${ele.album}
          </p>
          <a class="play-btn" href="#">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-play"></use>
              </svg>
          </a>
        </li>
      `)

      //添加超清标记
      if(ele.sq === true){
        $li.find('.song-info').prepend($(`
          <svg class="icon sq" aria-hidden="true">
            <use xlink:href="#icon-sq"></use>
          </svg>
        `))
      }
      
      $musicList.append($li)
    })
    //最新音乐
    $latestMusic.append($musicList)

    $latestMusic.find('.loading').remove()

    $musicList.on('click','li',function(){
      let $this = $(this)
      let index = $this.index()
      window.location.href = `./play.html?id=${index}`
    })
  })

})