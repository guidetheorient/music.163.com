$(function(){
  $.get('//owf5g9dnv.bkt.clouddn.com/songsDB.json?v=20170922',function(response){
    let songDB = response
    let $latestMusic = $('.latest-music')
    let $musicList = $('<ol></ol>')

    songDB.forEach((ele,index)=>{
      $li = $(`
        <li>
          <div class="song">
            <h3 class="song-name">${ele.songName}</h3>
            <p class="song-info">  
              ${ele.songAuthor} - ${ele.album}
            </p>
          </div>
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
    $latestMusic.append($musicList).find('.loading').remove()

    $musicList.on('click','li',function(){
      let index = $(this).index()
      window.location.href = `./play.html?id=${index}`
    })

    //tab切换
    $('.index-nav').on('click','.tab-header>li',function(e){
      let $li = $(e.currentTarget)
      $li.addClass('active').siblings().removeClass('active')
      let index = $li.index()
      $li.trigger('tabSwitch',index)
      $('.tab-content > li').eq(index).addClass('active').siblings().removeClass('active')
    })
    
    //trigger指定或冒泡到祖先元素
    $('.index-nav').on('tabSwitch',function(e,index){
      let $liContent = $('.tab-content>li').eq(index)
      
      if($liContent.attr('data-isLoaded')==='yes') {
        return
      };
      if(index ===1){
        $.get('./src/hotlist.json').then(function(response){
          let songDB = response
          let $musicList = $('<ol></ol>')
          let $hotListTab = $('.hot-list-tab')
          
          function orderNumber(index){
            let number = index+1
            if(Number(number)>0&&Number(number)<10){
              return '0'+number
            }else{
              return ''+number
            }
          }

          songDB.forEach((ele,index)=>{
            $li = $(`
              <li>
                <h3 class="order-number">${orderNumber(index)}</h3>
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

          $hotListTab.append($musicList).find('.loading').remove()
          $musicList.on('click','li',function(){
            let index = $(this).index()
            window.location.href = `./play.html?id=${index}`
          })
          $liContent.attr('data-isLoaded','yes')
        })
      }else if(index ===2){
        $.get('./src/search.json').then(function(response){
          







          $liContent.attr('isLoaded','yes')
        })
      }
    })


  })

})