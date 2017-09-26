$(function(){
  $.get('/src/recommendList.json').then(function(response){
    let recommendList = response
    console.log(recommendList)
    let $recommendList = $('.recommend-playlists')
    let $ul = $('<ul></ul>')

    recommendList.map(function(e,index){
      $li = `
        <li data-rId=${e.rId}>
          <img src="${e.rCoverUrl}" alt="">
          <p class="playlists-info">${e.rTitle}</p>
        </li>
      `
      $ul.append($li)
    })
    $recommendList.append($ul)
    $recommendList.find('ul').on('click','li',function(e){
      let rid = $(e.currentTarget).attr('data-rId')
      console.log(rid)
      window.location.href = `./playlist.html?rid=${rid}`
    })    
  })
  
  $.get('//owf5g9dnv.bkt.clouddn.com/songsDB.json?v=20170922',function(response){
    let songDB = response
    let $latestMusic = $('.latest-music')
    let $musicList = $('<ol></ol>')
    // alert('whf23l',songDB)
    
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
        let regexp = /^\[(.*)\]$/
        //组织form表单默认提交，储存查询历史
        $('.search form').keypress(function(e){
          if(e.keyCode==13){
            let value = $searchBox.val()
            e.preventDefault();
            if(localStorage.getItem('searchHistory')===null||!(regexp.test(localStorage.getItem('searchHistory')))){
              localStorage.setItem('searchHistory','[]')
            }
            let item = localStorage.getItem('searchHistory')
            let itemArray = item.match(regexp)[1].split(',')
            if(value !==''){
              itemArray.push(value)
              localStorage.setItem('searchHistory','['+itemArray+']')
              generateHistory(itemArray)
            }
          }
        })


        // generateHistory()
        function generateHistory(itemArray){
          console.log(itemArray)
          let $ul = $('<ul></ul>')
          if(itemArray.length < 1) return;
          itemArray.map(function(ele){
            if(ele==='')return
            let $li = `
              <li class="item">
                <svg class="icon history-icon" aria-hidden="true">
                  <use xlink:href="#icon-history"></use>
                </svg>
                <div class="history">
                    <span>${ele}</span>
                    <svg class="icon close-icon" aria-hidden="true">
                      <use xlink:href="#icon-close"></use>
                    </svg>
                </div>
              </li>
            `
            $ul.append($li)
          })
          $searchHistory.html($ul)
          $searchHistory.on('click','.close-icon',function(e){
            let itemArray = localStorage.getItem('searchHistory').match(regexp)[1].split(',')
            let oneHistory = $(e.currentTarget).siblings('span').text()
            // console.log(oneHistory)
            let index = itemArray.indexOf(oneHistory)
            $(e.currentTarget).parents('.item').remove()
            if(index!==-1){itemArray.splice(index,1)}

            localStorage.setItem('searchHistory','['+itemArray+']')            
            
          })
        }



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
              search(value).then(function(array){
                displaySearch(array)
              })
            }, 1000);
          }
        })

        mockHotSearch(songDB)

        $liContent.attr('data-isLoaded','yes')
        function displaySearch(array){
          let $musicList = $('<ul></ul>')
          array.map(function(ele,index){
            let $li = $(`
              <li class="item" data-index= ${ele.id}>
                <svg class="icon search-icon" aria-hidden="true">
                  <use xlink:href="#icon-search"></use>
                </svg>
                <span>${ele.songName}</span>
              </li>
            `)
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
        function mockHotSearch(songDB){
          let DB = songDB
          let array = []
          while (array.length < 6) {
            let number = Math.floor(Math.random()*10)
            if(array.indexOf(number) === -1){
              array.push(number)
            }
          }
          let $ul = $('<ul></ul>')
          array.map(function(ele){
            songDB.map(function(el){
              if(el.id === ele){
                let $li = $(`
                <li class="item"><a href="./play.html?id=${el.id}">${el.songName}</a></li>               
                `)
                $ul.append($li)
              }
            })
          })
          $hotSearch.append($ul)

        } 
      }
    })
  })
})