$(function(){
  let search = window.location.search
  let rId = Number(search.match(/\?rid=(\d+)/)[1])
  
  $.get(`/src/playlist.json/list${rId+1}.json`).then(function(response){
    let listInfo = response
    
    $('.playlist-header .background-img').css('background-image',`url(${listInfo.rCoverUrl})`)
    $('.playlist-header .cover').css('background-image',`url(${listInfo.rCoverUrl})`)
    let $viewTimes = $('.playlist-header .views')
    $viewTimes.text(listInfo.rPlayTimes)

    //歌单名及作者
    let $titleInfo = $('.playlist-header .main')
    $html1 = `
      <p class="title">${listInfo.rTitle}</p>
      <div class="editor">
        <img class="editor-photo" src="${listInfo.rCoverUrl}" class="img"></img>
        <p class="name">${listInfo.rEditor}</p>
      </div>
    `
    $titleInfo.append($html1)

    //标签及简介
    let $playlistIntro = $('.playlist-intro')
    let labels = listInfo.rLabel
    let $labelList = $(`<ul class="label-list"></ul>`)
    labels.forEach(function(el){
      $li = $(`<li>${el}</li>`)
      $labelList.append($li)
    })
    $html2 = $(`
      <div class="label">
        <p>标签：</p>
        ${$labelList[0].outerHTML}
      </div>
      <p class="brief-info active">
          简介：${listInfo.rBriefInfo.replace(/\\n/g,' <br> ')}
      </p>
      <svg class="icon down" aria-hidden="true">
          <use xlink:href="#icon-down"></use>
      </svg>
    `)
    
    //没用？？
    // $html2.find('div').append($labelList)
    
    $playlistIntro.append($html2)
    $('.playlist-intro').find('.brief-info').on('click',function(e){
      $(e.currentTarget).toggleClass('active')
    })
  })

  $.get('/src/hotlist.json').then(function(response){
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
  
  
})