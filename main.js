/* elementlere ulasip obje olarak kullanma, yakalama*/
const prevButton = document.getElementById('prev')
const nextButton = document.getElementById('next')
const repeatButton = document.getElementById('repeat')
const shuffleButton = document.getElementById('shuffle')
const audio = document.getElementById('audio')
const songImage = document.getElementById('song-image')
const songName = document.getElementById('song-name')
const songArtist = document.getElementById('song-artist')
const pauseButton = document.getElementById('pause')
const playButton = document.getElementById('play')
const playListButton = document.getElementById('playlist')


const maxDuration = document.getElementById('max-duration')
const currentTimeRef = document.getElementById('current-time')

const progressBar = document.getElementById('progress-bar')
const playListContainer = document.getElementById('playlist-container')
const closeButton= document.getElementById('close-button')
const playListSongs = document.getElementById('playlist-songs')

const currentProgress = document.getElementById('current-progress')

//indis sarki icin
let index

//dongu durumu
let loop = true

// decoding or parsing 
const songsList = [
    {
        name: "Haberimiz Yok",
        link: "assets/haberimizyok.mp3",
        artist: "Müslüm Gürses",
        image: "assets/mslm.jpg"
    },
    {
        name: "Ne Zamandır Sendeyim ",
        link: "assets/madrigal.mp3",
        artist: "Madrigal",
        image: "assets/mdrl.jpg"
    },
    {
        name: "Mahşer",
        link: "assets/mahser.mp3",
        artist: "Gökhan Türkmen",
        image: "assets/gkhn.jpg"
    },
    {
        name: "Hasret Rüzgarları",
        link: "assets/müslümhasret.mp3",
        artist: "Müslüm Gürses",
        image: "assets/mslmhsrt.jpg"
    },
    {
        name: "Bu Aşkın Katili Kim",
        link: "assets/brkblt.mp3",
        artist: "Burak Bulut & Eda Sakız",
        image: "assets/brkblt.jpg"
    }
]

//olaylar objesi
let events = {
    mouse:{
        click: "click"
    },
    touch: {
        click: "touchstart"
    }
}

let deviceType = ""


const isTouchDevice = () =>{
    try{
        document.createEvent("TouchEvent") // dokunulur bir cihaz ise burasi olusur
        deviceType = "touch"
        return true
    }catch(e){
        deviceType = "mouse"
        return false
    }
}


// zaman formatlama
const timeFormatter = (timeInput) =>{
    let minute = Math.floor(timeInput / 60)
    minute = minute < 10 ? "0" + minute : minute
    let second = Math.floor(timeInput % 60)
    second = second < 10 ? "0" +second : second
    return `${minute}:${second}`
}

//sarki atama
const setSong = (arrayIndex) => {
    //tum ozellikleri cikar
    console.log(arrayIndex)
    let {name, link, artist, image} = songsList[arrayIndex]
    audio.src = link
    songName.innerHTML = name
    songArtist.innerHTML = artist
    songImage.src = image

    //sureyi goster metadata yuklendiginde
    audio.onloadedmetadata = () =>{
        maxDuration.innerText = timeFormatter(audio.duration)//230 sn
    }
    playListContainer.classList.add('hide')
    playAudio()
}

//sarkiyi oynat
const playAudio = () =>{
    audio.play()
    pauseButton.classList.remove('hide') // gorun
    playButton.classList.add('hide') // kaybol
}


//tekrar et
repeatButton.addEventListener('click',()=>{
    if(repeatButton.classList.contains('active')){
        repeatButton.classList.remove('active')
        audio.loop = false
        console.log('tekrar kapatildi')
    }else {
        repeatButton.classList.add('active')
        audio.loop = true
        console.log('tekrar acik')
    }
})


//siradaki sarkiya gec
const nextSong = () =>{
    //eger normal caliyorsa sonrakine gec
    if(loop){
        if(index == (songsList.length - 1)){
            //sondaysa basa git
            index = 0
        }else {
            index += 1 
        }

        setSong(index)
        playAudio()
    } else {
        //rastgele bir sira bul ve oynat
        let randIndex = Math.floor(Math.random() * songsList.length)
        console.log(randIndex)
        setSong(randIndex)
        playAudio()
    }
}

//sarkiyi durdur
const pauseAudio= () =>{
    audio.pause()
    pauseButton.classList.add('hide')
    playButton.classList.remove('hide')
}

//Onceki sarkiya gec
const previousSong = () =>{
    if(index > 0){
        pauseAudio()
        index -=1
    }else {
        index = songsList.length - 1
    }
    setSong(index)
    playAudio()
}


//sarki kendisi biterse sonrakine gec
audio.onended = () =>{
    nextSong()
}


//shuffle songs
shuffleButton.addEventListener('click',()=>{
    if(shuffleButton.classList.contains('active')){
        shuffleButton.classList.remove('active')
        loop = true
        console.log("karistirma kapali")
    } else {
        shuffleButton.classList.add('active')
        loop = false
        console.log('karistirma acik')
    }
})


//play button
playButton.addEventListener('click',playAudio)

//next button
nextButton.addEventListener('click',nextSong)

//pause button
pauseButton.addEventListener('click', pauseAudio)

//prev button
prevButton.addEventListener('click', previousSong)

//cihaz tipiniz sec
isTouchDevice()
progressBar.addEventListener(events[deviceType].click,(event)=>{
    //proggress bar i baslat
    let coordStart = progressBar.getBoundingClientRect().left

    //mouse click yapma noktasi
    // false
    let coordEnd = !isTouchDevice() ? event.clientX : event.touches[0].clientX
    let progress = (coordEnd - coordStart) / progressBar.offsetWidth

    //genisligi progress e ata
    currentProgress.style.width = progress * 100 + "%"

    //zamani ata
    audio.currentTime = progress * audio.duration

    //oynat
    audio.play()
    pauseButton.classList.remove('hide')
    playButton.classList.add('hide')

})



//progress i guncelle zamana gore
setInterval(()=>{
    currentTimeRef.innerHTML  = timeFormatter(audio.currentTime)
    currentProgress.style.width = (audio.currentTime/audio.duration.toFixed(3)) * 100 + "%"

},1000)

//zamani guncelle
audio.addEventListener('timeupdate',()=>{
    currentTimeRef.innerText = timeFormatter(audio.currentTime)
})

//playlist olustur
const initializePlaylist = () =>{
    for(let i in songsList){
        playListSongs.innerHTML += `<li class="playlistSong"
        onclick="setSong(${i})">
        <div class="playlist-image-container"> 
          <img src="${songsList[i].image}"/>
        </div>
        <div class="playlist-song-details">
          <span id="playlist-song-name">
            ${songsList[i].name}
          </span>
          <span id="playlist-song-artist-album">
            ${songsList[i].artist}
          </span>
        </div>
        </li>`
    }
}  

//sarki listesini goster
playListButton.addEventListener("click",()=>{
    playListContainer.classList.remove('hide')
})

//sarki listesini kapat
closeButton.addEventListener('click',()=>{
    playListContainer.classList.add('hide')
})

//ekran yuklenirken
window.onload = () =>{
    //baslangic sarkin sirasi
    index = 0
    setSong(index)
    pauseAudio()
    //playlist olustur
    initializePlaylist()
}