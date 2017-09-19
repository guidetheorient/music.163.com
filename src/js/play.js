$(function(){
  let search = window.location.search
  let id = Number(search.match(/\?id=(\d+)/)[1])
  
  $.get('/src/songsDB.json').then(function(response){
    let song = response[id]
    console.log(song)
    let $songBg = $('#app .song-bg')
    let $cover = $('<img/>')
    let $defaultCover = $('.default-cover')
    var offset

    //背景图片
    $songBg.css({'background-image':`url(${song.backgroundImgUrl})`})
    
    //专辑封面
    $cover.attr({'src':song.coverUrl,'class':'cover'}).appendTo($defaultCover)

    //歌手，专辑信息
    let $songInfo = $('.song-info')
    let $songTitle = $(`
      <div class="title">
        <span class="song-name">${song.songName}</span>
        <span>-</span>
        <span class="song-author">${song.album}</span>
      </div>
    `)
    $songTitle.prependTo($songInfo)

    //歌词
    if(!song.hasLrc){

    }else{
      $.get(`/src/lrc/${id+1}.json`).then(function(response){
        let lyric = response.lrc.lyric
        let tlyric = response.tlyric.lyric
        
        let originLrc = generateLrc(lyric)
        let translateLrc = generateLrc(tlyric)
    
        //合并中英文数组
        originLrc.map((ele,index)=>{
          let originEle = ele
          let originIndex = index
          translateLrc.forEach((ele,index)=>{
            if(ele.time === originEle.time){
              originLrc[originIndex].line2 = ele.line
            }
          })
        })
    
        //生成歌词dom节点
        let $lrcWrap = $('.lrc-wrap')
  
        let $lrc = $('<div class="lrc"></div>')
        originLrc.map((ele,index)=>{
          let $p = $('<p></p>')
          let $span1 = $('<span></span>')
          let $span2 = $('<span></span>')
          
          $span1.attr({class:"origin-lrc-line"}).text(ele.line)
          $span2.attr({class:"translate-lrc-line"}).text(ele.line2)
          
          $p.attr({'data-time':ele.time,class:"lrc-line"}).append($span1,$span2)
          
          $lrc.append($p)
        })
  
        $lrcWrap.append($lrc)
        offset = $('.lrc-line').outerHeight(true)
        
        function generateLrc(lrc){
          let array = lrc.split('\n')
          let regexp = /\[\d+:\d+\.\d+\]/
    
          //去掉歌词上传者的注释信息
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
      })
    }
    console.log(offset)
    //音频
    let audio = document.createElement('audio')
    let $disc = $('#app .disc')
    audio.src = song.url
    audio.oncanplay = function(){
      audio.play()
      $disc.addClass('playing')
    }
    audio.onended = function(){
      $disc.addClass('paused').removeClass('playing')
    }

    //歌词滚动
    audio.ontimeupdate = function(){
      let currentTime = audio.currentTime
    }

    let $playBtn = $('.disc-container .play-btn')
    let $pauseBtn = $('.disc .pause-btn')
    $playBtn.click(function(){
      audio.play()
      $disc.removeClass('paused').addClass('playing')    
    })
    $pauseBtn.click(function(){
      audio.pause()
      $disc.addClass('paused').removeClass('playing')
    })
  })
  
  







})