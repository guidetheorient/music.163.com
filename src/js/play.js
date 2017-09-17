$(function(){
  $.get('/src/lyric.json').then(function(response){
    let lyric = response.lrc.lyric
    let array = lyric.split('\n')
    
    let regexp = /\[\d+:\d+\.\d+\]/
    //去掉歌词上传者的注释信息
    array.map(function(ele,index){
      if(!regexp.test(ele) || ele == ''){
        array.splice(index,1)
      }
    })

    //将时间和歌词分开
    let regexp2 = /\[(.+)\](.*)/
    array = array.map(function(ele){
      let matches = regexp2.exec(ele)
      if(!!matches){
        return {time:matches[1],line:matches[2]}
      }
    })
    
    //生成歌词dom节点
    let $lrc = $('.lrc')
    array.map(function(ele,index){
      let $p = $('<p></p>')
      console.log(ele)
      $p.attr({'data-time':ele.time,class:"lrc-line"}).text(ele.line)
      $lrc.append($p)
    })
  })
  
  let audio = document.createElement('audio')
  let $disc = $('#app .disc')
  audio.src = 'http://dl.stream.qqmusic.qq.com/C400000fvI5R4cjyYA.m4a?fromtag=38&vkey=25EE4BEB308BB660E8DDB55D3610C36FB16152F260B1BBF7689FFF6FCE8B17B37E810C34A63223AF766B5E1E0A2410E3C0F0DDBAD442EF23&guid=6400546447'
  audio.oncanplay = function(){
    audio.play()
    $disc.addClass('playing')
    scrollLrc()
  }

  function scrollLrc(){
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