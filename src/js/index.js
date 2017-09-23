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

        let $searchBox = $('.search input')
        let timer
        let $emptyInput = $('.search .x-icon')
        let $hotSearch = $('.hot-search')
        let $searchHistory = $('.search-history')
        let $syncSearch = $('.sync-search')
        let $searchWhat = $('.search-what')
        //清空input值
        $emptyInput.on('click',function(){
          $searchBox.val('')
          $syncSearch.text('')
          $hotSearch.add($searchHistory).addClass('active')
        })

        $searchBox.on('input',function(e){
          let value = e.target.value.trim()
          if(value ===''){
            $emptyInput.add($syncSearch).removeClass('active');
            $hotSearch.add($searchHistory).addClass('active')
            return
          }else{
            $emptyInput.addClass('active');
            $hotSearch.add($searchHistory).removeClass('active')
            
            $h4 = $('<h4 class="search-what"></h4>').text(`搜索“${value}”`)
            $syncSearch.html($h4).addClass('active')
          
            clearTimeout(timer)
            timer = setTimeout(function() {
              console.log(value)
              search(value).then(function(array){
                console.log(array)
                displaySearch(array)
              })
            }, 1000);
          }
        })
        function displaySearch(array){
          let $musicList = $('<ul></ul>')
          array.map(function(ele,index){
            let $li = `
              <li class="item" data-index= ${ele.id}>
                <svg class="icon search-icon" aria-hidden="true">
                  <use xlink:href="#icon-search"></use>
                </svg>
                <span>${ele.songName}</span>
              </li>
            `
            $musicList.append($li)
          })
          $syncSearch.append($musicList)
         
          $('.sync-search>ul').on('click','li',function(e){
            window.location.href = `./play.html?id=${$(e.currentTarget).attr('data-index')}`
          })
        }
        

        function search(value){
          return new Promise(function(resolve,reject){
            $.get('./src/search.json').then(function(response){
              let songDB = response
              
              let array = songDB.filter(function(ele,index){
                for(key in ele){
                  if(key!=='id' && ele[key].toString().toLowerCase().indexOf(value.toLowerCase())!==-1){
                    return true
                  }
                }
              })
              resolve(array)
            })
          })
        }
        mockHotSearch(songDB)
        function mockHotSearch(songDB){
          let array = songDB
          console.log(array)
          for(let i = 0;i< 6;i++){
            let number = 
          }
        // `<ul>
        //   <li class="item"><a>一一一一</a></li>
        //   <li class="item"><a>二而而</a></li>
        //   <li class="item"><a>二而而</a></li>
        //   <li class="item"><a>123</a></li>
        //   <li class="item"><a>哈哈哈哈</a></li>
        //   <li class="item"><a>哈哈哈哈</a></li>
        //   <li class="item"><a>哈哈</a></li>
        // </ul>`
        }
        $liContent.attr('isLoaded','yes')

      }
    })


  })

})