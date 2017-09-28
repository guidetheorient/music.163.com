$(function(){
  //生成推荐歌单
  $.get('//owf5g9dnv.bkt.clouddn.com/recommendList.json').then(function(response){
    let recommendList = response
    let $recommendList = $('.recommend-playlists')
    let $ul = $('<ul></ul>')

    recommendList.map(function(e){
      let $li = `
        <li data-rId=${e.rId}>
          <span class="view-time">
            <svg class="icon headphone" aria-hidden="true">
                <use xlink:href="#icon-headphone"></use>
            </svg>
            <span class="views">${e.rPlayTimes}</span>
          </span>
          <img src="${e.rCoverUrl}" alt="">
          <p class="playlists-info">${e.rTitle}</p>
        </li>
      `
      $ul.append($li)
    })
    $recommendList.append($ul)
    $recommendList.find('ul').on('click','li',function(e){
      let rid = $(e.currentTarget).attr('data-rId')
      window.location.href = `./playlist.html?rid=${rid}`
    }) 
  })
  
  //生成最新音乐
  $.get('//owf5g9dnv.bkt.clouddn.com/songsDB.json?v=20170922',function(response){
    let songDB = response
    let $latestMusic = $('.latest-music')
    let $musicList = $('<ol></ol>')
    songDB.forEach((ele)=>{
      let $li = $(`
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
    $latestMusic.append($musicList).find('.loading').remove()
    $musicList.on('click','li',function(){
      let index = $(this).index()
      window.location.href = `./play.html?id=${index}`
    })
  })

  //tab切换
  $('.index-nav').on('click','.tab-header>li',function(e){
    let $li = $(e.currentTarget)
    let index = $li.index()    
    $li.addClass('active').siblings().removeClass('active')
    $li.trigger('tabSwitch',index)
    $('.tab-content > li').eq(index).addClass('active').siblings().removeClass('active')
  })
  

  //trigger指定或冒泡到祖先元素
  $('.index-nav').on('tabSwitch',function(e,index){
    let $liContent = $('.tab-content>li').eq(index)
    
    //已经加载过的，return掉
    if($liContent.attr('data-isLoaded')==='yes') {
      return
    }

    //index= 1热歌榜
    if(index ===1){
      $.get('//owf5g9dnv.bkt.clouddn.com/hotlist.json').then(function(response){
        let songDB = response
        let $musicList = $('<ol></ol>')
        let $hotListTab = $('.hot-list-tab')
        let $updateDate = $('.hot-top .update-date')
        songDB.forEach((ele,index)=>{
          let $li = $(`
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

        //标记已加载
        $liContent.attr('data-isLoaded','yes')

        //更新日期
        let now = new Date()
        let month = now.getMonth()+1
        let day = now.getDate()
        if(month<10){month = '0'+month}
        let date = `${month}月${day}日`
        $updateDate.text(`更新日期：${date}`)
        
        function orderNumber(index){
          let number = index+1
          if(Number(number)>0&&Number(number)<10){
            return '0'+number
          }else{
            return ''+number
          }
        }
      })
    //index=2 搜索歌曲
    }else if(index ===2){
      let $searchBox = $('.search input')
      //定时器，input去抖
      let timer
      //清空输入框按钮
      let $emptyInput = $('.search .x-icon')
      let $hotSearch = $('.hot-search')
      let $searchHistory = $('.search-history')
      //搜索时实时匹配结果
      let $syncSearch = $('.sync-search')
      
      //清空input值
      $emptyInput.on('click',function(){
        $searchBox.val('')
        $syncSearch.text('')
        $hotSearch.add($searchHistory).addClass('active')
      })

      //input事件，见stackoverflow
      $searchBox.on('input',function(e){
        let value = e.target.value.trim()
        //如果value为空，不显示清空按钮及搜索匹配
        //反之显示
        if(value ===''){
          $emptyInput.add($syncSearch).removeClass('active');
          $hotSearch.add($searchHistory).addClass('active')
          return
          
        }else{
          $emptyInput.addClass('active');
          $hotSearch.add($searchHistory).removeClass('active')
          
          //显示搜索的值
          let $h4 = $('<h4 class="search-what"></h4>').text(`搜索“${value}”`)
          $syncSearch.html($h4).addClass('active')
          
          //input事件计时1s后，触发
          clearTimeout(timer)
          //从数据库搜索func search，并将结果展示出来func displaySearch
          timer = setTimeout(function() {
            search(value).then(function(array){
              displaySearch(array)
            })
          }, 300);
        }
      })

      //阻止form默认事件，储存查询历史
      $('.search form').keypress(function(e){
        if(e.keyCode==13){
          let value = $searchBox.val()
          e.preventDefault();
          
          generateHistory(value)
        }
      })

      mockHotSearch()
      //1.首次加载时 2.按回车时 3.点击热门搜索时 4.点击实时生成的匹配时 
      generateHistory()
      

      //标记已加载过
      $liContent.attr('data-isLoaded','yes')

      function generateHistory(value){
        let regexp = /^\[(.*)\]$/
          
        if(localStorage.getItem('searchHistory')===null||!(regexp.test(localStorage.getItem('searchHistory')))){
          localStorage.setItem('searchHistory','[]')
        }
        let item = localStorage.getItem('searchHistory')
        let itemArray = item.match(/^\[[\,]*(.*)\]$/)[1].split(',')
        
        if(value !==''&&value!==undefined&&itemArray.indexOf(value)===-1){
          itemArray.push(value)
          // console.log(itemArray)
          localStorage.setItem('searchHistory',`[${itemArray.toString()}]`)  
        }
        // console.log(localStorage.getItem('searchHistory'),2)
        //生成搜索历史的dom及事件
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
        //事件：删除历史
        $searchHistory.find('.close-icon').on('click',function(e){
          e.stopPropagation()
          let itemArray = localStorage.getItem('searchHistory').match(regexp)[1].split(',')
          let oneHistory = $(e.currentTarget).siblings('span').text()
          // console.log(oneHistory)
          let index = itemArray.indexOf(oneHistory)
          $(e.currentTarget).parents('.item').remove()
          if(index!==-1){itemArray.splice(index,1)}
          localStorage.setItem('searchHistory','['+itemArray+']')
        })
        $searchHistory.find('ul').on('click','li',function(e){
          // console.log(e.currentTarget)
          // return
          let songName = $(e.currentTarget).text().trim()
          $.get('//owf5g9dnv.bkt.clouddn.com/search.json').then(function(response){
            let songDB = response
            songDB.map(function(ele){
              if(ele.songName === songName){
                window.location.href = `./play.html?id=${ele.id}`
                return
              }
            })
          })
        })
      }

      function displaySearch(array){
        let $musicList = $('<ul></ul>')
        array.map(function(ele){
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
          
          let value = $(e.currentTarget).text().trim()
          generateHistory(value)
          location.href = `./play.html?id=${$(e.currentTarget).attr('data-index')}`
        })
      }

      function search(value){
        return new Promise(function(resolve){
          $.get('//owf5g9dnv.bkt.clouddn.com/search.json').then(function(response){
            let songDB = response
            
            let array = songDB.filter(function(ele){
              for(let key in ele){
                if(key!=='id' && ele[key].toString().toLowerCase().indexOf(value.toLowerCase())!==-1){
                  return true
                }
              }
            })
            resolve(array)
          })
        })
      }
      //mock热门搜索
      function mockHotSearch(){
        let DB
        let array = []
        
        //mock热门搜索
        $.get('//owf5g9dnv.bkt.clouddn.com/songsDB.json?v=20170922',function(response){
          DB = response

          //mock 6个0-9不重复随机数
          while (array.length < 6) {
            let number = Math.floor(Math.random()*10)
            if(array.indexOf(number) === -1){
              array.push(number)
            }
          }

          let $ul = $('<ul></ul>')
          array.map(function(ele){
            DB.map(function(el){
              if(el.id === ele){
                let $li = $(`
                <li class="item"><a href="./play.html?id=${el.id}">${el.songName}</a></li>               
                `)
                $ul.append($li)
              }
            })
          })
          $ul.on('click','li',function(e){
            //innerText取的值有回车符
            let value = $(e.currentTarget).text().trim()
            generateHistory(value)
          })
          $hotSearch.append($ul)
        })
      } 
    }
  })
})
