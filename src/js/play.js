$(function(){
  let search = window.location.search
  let id = Number(search.match(/\?id=(\d+)/)[1])
  
  function initImg(coverUrl,bgUrl){
    let $cover = $('<img/>')
    //背景图片
    $('#app .song-bg').css({'background-image':`url(${bgUrl})`})
    //专辑封面
    $cover.attr({'src':coverUrl,'class':'cover'}).appendTo($('.default-cover'))
  }

  function initPlay(url){
    let audio = document.createElement('audio')
    let $disc = $('#app .disc')
    let $playBtn = $('.disc-container .play-btn')
    let $pauseBtn = $('.disc .pause-btn')

    audio.src = url
    
    audio.oncanplay = function(){
      audio.play()
      $disc.addClass('playing')
    }
    audio.onended = function(){
      $disc.addClass('paused').removeClass('playing')
    }

    //播放，暂停键
    $playBtn.click(function(){
      audio.play()
      $disc.removeClass('paused').addClass('playing')    
    })
    $pauseBtn.click(function(){
      audio.pause()
      $disc.addClass('paused').removeClass('playing')
    })
  }

  function separateLrc(lrc){
    let array = lrc.split('\n')
    let regexp = /\[\d+:\d+\.\d+\]/

    //去掉歌词上传者的注释信息
    //not map
    array = array.filter(function(ele){
      return !(!regexp.test(ele) || ele == '')
    })

    //将时间和歌词分开
    let regexp2 = /\[(.+)\](.*)/
    array = array.map(function(ele){
      let matches = regexp2.exec(ele)
      if(!!matches){
        return {time:matches[1],line:matches[2]}
      }
    })
    return array
  }

  function initLyric(songName,songAuthor,hasLrc,id){
    //歌手，专辑信息
    let $songInfo = $('.song-info')
    let $songTitle = $(`
      <div class="title">
        <span class="song-name">${songName}</span>
        <span>-</span>
        <span class="song-author">${songAuthor}</span>
      </div>
    `)
    $songTitle.prependTo($songInfo)
    
    //歌词
    let $lrcWrap = $('.lrc-wrap')
    let $lrc = $('<div class="lrc"></div>')
    let offset
    if(!hasLrc){
      let $p = $('<p></p>')
      $p.attr({'class':'lrc-line'}).text('纯音乐，无歌词').appendTo($lrc).appendTo($lrcWrap)
    }else{
      $.get(`/src/lrc/${id+1}.json`).then(function(response){
        let lyric = response.lrc.lyric
        let tlyric = response.tlyric.lyric
        
        let originLrc = separateLrc(lyric)
        
        //合并中英文歌词
        if(!(typeof tlyric === undefined)){
          let translateLrc = separateLrc(tlyric)
          
          originLrc.map((ele,index)=>{
            let originEle = ele
            let originIndex = index
            translateLrc.forEach((ele,index)=>{
              if(ele.time === originEle.time){
                originLrc[originIndex].line2 = ele.line
              }
            })
          })
        }
        
        //生成歌词dom节点
        originLrc.map((ele,index)=>{
          let $span1 = $('<span></span>')
          let $span2 = $('<span></span>')
          let $p = $('<p></p>')    
    
          $span1.attr({class:"origin-lrc-line"}).text(ele.line)
          $span2.attr({class:"translate-lrc-line"}).text(ele.line2)
          
          $p.attr({'data-time':ele.time,'class':"lrc-line"}).append($span1,$span2)
          
          $lrc.append($p)
        })
  
        $lrcWrap.append($lrc)
        offset = $('.lrc-line').outerHeight(true)
      })
    }
    console.log(offset)
    
    return offset
  }
  $.get('/src/songsDB.json').then(function(response){
    let song = response[id]   
    let {coverUrl,backgroundImgUrl,url,songName,songAuthor,hasLrc} = song
    console.log(song)

    initImg(coverUrl,backgroundImgUrl)
    initPlay(url)
    let height = initLyric(songName,songAuthor,hasLrc,id)

    // //歌词滚动
    // audio.ontimeupdate = function(){
    //   let currentTime = audio.currentTime
    // }

    
  })
})