const submit = document.getElementById("sub-btn")
const con = document.querySelectorAll(".con-qu")
const next = document.querySelector(".next")
const prv = document.querySelector(".prv")
let nameS = document.getElementById("name")
let error = 0;


let radioList = []

submit.addEventListener("click", () => {

    if (con.length > 1) {
        if (nameS.value.trim() !== "") {
            radioList = []

            const radio = document.querySelectorAll("input[type='radio']:checked")

            let windowURL = window.location.href

            if (windowURL.includes("math")){
                radio.forEach(function (r) {
                    let idR = r.id
                    const label = document.querySelector(`label[for=${idR}]`)
                    let text = label.getAttribute('data-original')
                    text = text.replace("$$" , "")
                    text = text.replace("$$" , "")
                    windowURL = windowURL.replace("/math", "")
                    radioList.push(text.trim())
                    text += "/math"
                })
            }else {
                radio.forEach(function (r) {
                    let idR = r.id
                    const label = document.querySelector(`label[for=${idR}]`)
                    let text = label.innerHTML
                    radioList.push(text)
                })
            }


            windowURL = windowURL.replace("http://127.0.0.1:5000/quiz/student/", "")

            nameS = nameS.value

            alert("آزمون با موفقیت به پایان رسید .")


            
            fetch("/quiz/student/" + windowURL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    radioList: radioList,
                    nameS: nameS,
                    windowURL: windowURL,
                    error: error
                })
            });
            window.location.href = "/end-page";
        } else {
            alert("لطفا نام و نام خانوادگی خود را وارد کنید .")
        }
    } else {
        alert("هیچ آزمونی وجود ندارد .")
    }

})

let i = 0
con.forEach((c) => {
    c.style.display = "none"
})


con[0].style.display = "block"


prv.addEventListener("click", () => {
    if (i == 0) {
        alert("این اولین سوال است .")
    } else {
        con[i].style.display = "none"
        i -= 1
        con[i].style.display = "block"
    }
})

next.addEventListener("click", () => {
    if (i == con.length - 1) {
        alert("این آخرین سوال است .")
    } else {
        if (nameS.value.trim() != ""){
            con[i].style.display = "none"
            i += 1
            con[i].style.display = "block"
        }else {
            alert("لطفا نام و نام خانوادگی خود را نگاه کنید .")
        }
    }
})


window.addEventListener("load", () => {
    if (con.length < 2) {
        alert("هیچ آزمونی وجود ندارد .")
    }
})



let now = new Date
now = now.toLocaleDateString()

let nowtime = new Date
nowtime = nowtime.toTimeString()

let nm = now.indexOf("/")
let nowmonth = now.slice(0, nm)
now = now.slice(nm + 1)


let nd = now.indexOf("/")
let nowday = now.slice(0, nd)
now = now.slice(nd + 1)

let nowyear = now


let nth = nowtime.indexOf(":")
let nowtimehur = nowtime.slice(0, nth)
nowtime = nowtime.slice(nth + 1)

let ntm = nowtime.indexOf(":")
let nowtimemin = nowtime.slice(0, ntm)
nowtime = nowtime.slice(ntm + 1)



let conTime = document.querySelector(".start-end-time")
let time = conTime.querySelector("p").innerHTML
time = Array.from(time)
let startyear = time[0] + time[1] + time[2] + time[3]
let startmonth = time[5] + time[6]
let startday = time[8] + time[9]

let starthur = time[11] + time[12]
let startmin = time[14] + time[15]

let d0 = Array.from(startday)
let m0 = Array.from(startmonth)

if (m0[0] == 0) {
    startmonth = m0[1]
}

if (d0[0] == 0) {
    startday = d0[1]
}

if (nowtimehur[0] == 0) {
    nowtimehur = nowtimehur[1]
}

if (nowtimemin[0] == 0) {
    nowtimemin = nowtimemin[1]
}

let timeEnd = conTime.querySelector(".end-time").innerHTML
timeEnd = Array.from(timeEnd)
let endyear = timeEnd[0] + timeEnd[1] + timeEnd[2] + timeEnd[3]
let endmonth = timeEnd[5] + timeEnd[6]
let endday = timeEnd[8] + timeEnd[9]

let endhur = timeEnd[11] + timeEnd[12]
let endmin = timeEnd[14] + timeEnd[15]

let d1 = Array.from(endday)
let m1 = Array.from(endmonth)

if (m1[0] == 0) {
    endmonth = m1[1]
}

if (d1[0] == 0) {
    endday = d1[1]
}



let time1 = conTime.querySelector("p").innerHTML


if (startyear < nowyear < endyear) {
    
}else if (startyear == nowyear) {
    if (startmonth < nowmonth < endmonth) {
        
    }else if (startmonth == nowmonth) {
        if (startday < nowday < endday) {
            
        }else if (startday == nowday) {
            if (starthur < nowtimehur < endhur) {
                
            }else if (starthur == nowtimehur) {
                if (startmin <= nowtimemin < endmin) {
                    
                }else {
                    alert("آزمون هنوز شروع نشده است . " + "\n" + time1)
                    window.location = "/"
                }
            }else {
                alert("آزمون هنوز شروع نشده است . " + "\n" + time1)
                window.location = "/"
            }
        }else {
            alert("آزمون هنوز شروع نشده است . " + "\n" + time1)
            window.location = "/"
        }
    }else {
        alert("آزمون هنوز شروع نشده است . " + "\n" + time1)
        window.location = "/"
    }
}else {
    alert("آزمون هنوز شروع نشده است . " + "\n" + time1)
    window.location = "/"
}

let duration = conTime.querySelectorAll("p")
duration = duration[1].querySelector("span").innerHTML
let durationToS = duration * 60
const minSpan = document.querySelector(".min")
const sonSpan = document.querySelector(".son")
minSpan.innerHTML = duration
let setTime;

nameS.addEventListener("change", () => {
    
    document.addEventListener("visibilitychange" , () => {
        error += 0.5
    })

    setTime = setInterval(() => {
        let min = Math.floor(durationToS / 60)
        let son = durationToS % 60

        minSpan.innerHTML = min
        sonSpan.innerHTML = son

        if (durationToS <= 0) {
            alert("زمان آزمون تمام شد .")
            radioList = []

            const radio = document.querySelectorAll("input[type = 'radio']:checked")

            radio.forEach(function (r) {
                let idR = r.id
                const label = document.querySelector(`label[for=${idR}]`)
                let text = label.textContent.trim()
                radioList.push(text)
            })

            nameS = nameS.value


            alert("آزمون با موفقیت به پایان رسید .")

            let windowURL = window.location.href
            windowURL = windowURL.replace("http://127.0.0.1:5000/quiz/student/", "")
            window.location.href = "/end-page";

            fetch(windowURL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    radioList: radioList,
                    nameS: nameS,
                    windowURL: windowURL,
                    error: error
                })
            });

            window.location = "/"
            clearInterval(setTime)
        }
        durationToS--
    }, 1000)

})