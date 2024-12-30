console.log("start the javascript")
let currentsong = new Audio();
let songs;

function secondsToMinutesSeconds(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    // Pad with zeros if needed
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

// // Example usage:
// console.log(formatTime(12));  // Output: "00:12"
// console.log(formatTime(75));  // Output: "01:15"
// console.log(formatTime(3600)); // Output: "60:00"


 async function getsongs(){
    let a =  await fetch("http://127.0.0.1:5500/songs/")
    let response = await a.text();
    console.log(response) 
    let div = document.createElement("div")
    div.innerHTML= response;
    let as = div.getElementsByTagName("a")
let songs = []
for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if(element.href.endsWith(".mp3")){
        songs.push(element.href.split("/songs/")[1])
    }
    
}
return songs

}
const playMusic = (track)=>{
    // let audio = new Audio("/songs/" + track)
    currentsong.src = "/songs/" + track
    currentsong.play()
    play.src = "pause.svg"
 document.querySelector(".songinfo").innerHTML = track
 document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}


async function main(){ 
    // get the list of all the song
    songs = await getsongs()
    console.log(songs)
// show all the song in the playlist
let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
for (const song of songs) {
    songUL.innerHTML = songUL.innerHTML + `<li><img class="invert" src="music.svg" alt="">
                            <div class="info">
                                <div> ${song.replace("%20"," ")} </div>
                                <div>suraj</div>

                            </div>
                            <div class="playnow">
                                <span>play now</span>
                                <img class="invert" src="play.svg" alt="">
                            </div>
    
   </li>`;
}
// attach a event listner to each song
Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
    e.addEventListener("click",element=>{
        console.log(e.querySelector(".info").firstElementChild.innerHTML)
        playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

    })
})
// attach an event listner to play adnext and previous
play.addEventListener("click",()=>{
    if(currentsong.paused){
        currentsong.play()
        play.src = "pause.svg"
    }
    else{
        currentsong.pause()
        play.src = "play.svg"
    }
})
// listen for timey[adte event]
currentsong.addEventListener("timeupdate", ()=>{
    console.log(currentsong.currentTime, currentsong.duration)
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)} / ${secondsToMinutesSeconds(currentsong.duration)}`
    document.querySelector(".circle").style.left = (currentsong.currentTime/ currentsong.duration) * 100 + "%"
})
// add an eventlistner to seek bar
document.querySelector(".seekbar").addEventListener("click",e=>{
    let percent = (e.offsetX/e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentsong.currentTime = ((currentsong.duration)* percent)/100
})
// add an event listner for hamburger
// document.querySelector(".hamburger").addEventListener("click",()=>{
//     document.querySelector(".left").style.left = "0"

// })
// add an event listner for close button
document.querySelector(".close").addEventListener("click",()=>{
    document.querySelector(".left").style.left = "-120%"

})
// add event listner ti previuos and next
previous.addEventListener("click",()=>{
    console.log("previous clicked")
    console.log(currentsong)
    let index = songs.indexOf(currentsong.src.split("/").slice(-1) [0])
    console.log(songs, index)
    if([index+1] >= 0){
        playMusic(songs[index-1])
    }

})
// add event listner ti previuos and next
next.addEventListener("click",()=>{
    console.log("next clicked")
    let index = songs.indexOf(currentsong.src.split("/").slice(-1) [0])
    console.log(songs, index)
    if([index+1] < songs.length){
        playMusic(songs[index+1])
    }
    
})
// add an event to volume
document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
    console.log( "setting volume to" ,e.target.value, "/ 100")
    currentsong.volume = parseInt(e.target.value)/100
})
// add an event listner to mute the track
document.querySelector(".volume>img").addEventListener("click",e=>{
    console.log(e.target)
    if(e.target.src.includes("volume.svg")){
        e.target.src = e.target.src.replace("volume.svg","mute.svg")
        currentsong.volume = 0;
        document.querySelector(".range").getElementsByTagName("input")[0].value = 0
    }
    else{
        e.target.src = e.target.src.replace("mute.svg","volume.svg")
        currentsong.volume = .10;
        document.querySelector(".range").getElementsByTagName("input")[0].value = 10        
    }
})

}
main()
