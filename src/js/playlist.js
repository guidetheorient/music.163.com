$(function(){
    $.get('./src/hotlist.json').then(function(response){
      let songDB = response
      let $musicList = $('<ol></ol>')
      let $playlist = $('.playlist')
      
      songDB.forEach((ele,index)=>{
        $li = $(`
          <li>
            <h3 class="order-number">${index+1}</h3>
            <div class="song">
              <h3 class="song-name">${ele.songName}</h3>
              <p class="song-info">  
                ${ele.songAuthor} - ${ele.album}
              </p>
              <a class="play-btn" href="#">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-play"></use>
                  </svg>
              </a>
            </div>
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

      $playlist.append($musicList).find('.loading').remove()
      $musicList.on('click','li',function(){
        let index = $(this).index()
        window.location.href = `./play.html?id=${index}`
      })
    })
    
    let $briefInfo = $('.brief-info')
    $briefInfo.on('click',function(e){
      $briefInfo.toggleClass('active')
    })
})