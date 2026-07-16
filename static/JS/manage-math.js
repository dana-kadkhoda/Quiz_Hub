const main = document.getElementById("main")

let select = document.querySelectorAll(".select");
let inputs = document.querySelectorAll(".item");
let btnItem = document.querySelectorAll(".item-btn");
let closeBtn = document.querySelectorAll(".close-btn")
let quesstionText = document.querySelectorAll("input[name = question]")
let nextLevel = document.querySelector(".next-level")
let conQuizName = document.querySelector(".quiz-name")
let quizNameUser = document.getElementById("quiz-name-user")
let quizPassUser = document.getElementById("quiz-pass-user")
let body = document.querySelector("body")

const subBtn = document.querySelector(".send-btn")

let quizName = ""
let quizPass = ""

nextLevel.addEventListener("click", () => {
  quizName = quizNameUser.value
  quizPass = quizPassUser.value
  if (quizName.trim() !== "" && quizPass.trim() !== "") {
    conQuizName.style.display = "none"
    body.style.overflow = "auto"
    quiz_id = quizPass
  } else {
    alert("لطفا یک نام معتبر انتخاب کنید .")
  }
})

let quiz_id = ""

// ------------- Send Data --------------
let item_n = []
let selectsValue = []
let textQuesstion = []




subBtn.addEventListener("click", () => {

  textQuesstion = []
  let is = false
  let isOK = true
  let items = []
  let Forms = document.querySelectorAll(".form")
  item_n = []

  quesstionText = document.querySelectorAll(".text-q")
  for (let text of quesstionText) {
    textQuesstion.push(text.value)
  }


  for (let Form of Forms) {
    let item = Form.querySelectorAll(".added-option")
    items.push(item)
  }



  for (let nItem of items){
    for (let i of nItem){
      item_n.push(i.innerText)
    }
  }
  

  for (let i of item_n) {
    if (i.trim() !== "") {
      is = true

    } else {
      is = false;
      break
    }
  }

  if (is) {
    if(textQuesstion.length * 4 ==  item_n.length){
      for(let s in selectsValue){
        if (s.trim() == ""){
          isOK = false
          break
        }else {
          isOK = true
        }
      }

      if (isOK){
        alert("درحال ساخت ...")

        selectsValue = []


        select.forEach((s) => {
          selectsValue.push(s.options[s.selectedIndex].text);
        })


        fetch("/send_data_math", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            item_n: item_n,
            selectsValue: selectsValue,
            textQuesstion: textQuesstion,
            quiz_id: quiz_id,
            quizName: quizName
          })
        });



        subBtn.setAttribute("type", "submit")
      }else {
        alert("لطفا گزینه درست هر سوال را مشخص کنید .")
      }
    }else {
      alert("لطفا برای هر سوال چهار گزینه طراحی کنید .")
      subBtn.setAttribute("type", "button")
    }
  } else {
    alert("لطفا تمام گزینه ها را پر کنید .")
    subBtn.setAttribute("type", "button")
  }
})




// ------------- End Send Data --------------



setInterval(() => {
  btnItem.forEach(btn => {
    btn.removeEventListener("click", () => {
      let parForm = btn.closest(".form")
      let selectInForm = parForm.querySelector(".select")

      selectInForm.innerHTML = ""

      let inputsItem = parForm.querySelectorAll("input[class = 'item']")

      inputsItem.forEach(input => {
        if (input.value.trim() !== "") {
          let option = document.createElement("option");
          option.value = input.value;
          option.textContent = input.value;
          selectInForm.appendChild(option);
        }
      });
    })

    btn.addEventListener("click", () => {
      let parForm = btn.closest(".form")
      let selectInForm = parForm.querySelector(".select")

      selectInForm.innerHTML = ""

      let inputsItem = parForm.querySelectorAll(".added-option")

      inputsItem.forEach(input => {
        
        input = input.innerHTML.replace('<span class="remove-option">×</span>' , '')
        let option = document.createElement("option");
        option.value = input;
        option.textContent = input;

        selectInForm.appendChild(option);

      });
    });
  });
}, 3000)




closeBtn.forEach((b) => {
  b.addEventListener("click", () => {
    let closeBtnParForm = b.closest(".form")
    if (forms.length > 2) {
      closeBtnParForm.remove()
    } else {
      alert("آزمون باید حداقل 2 سوال داشته باشد .")
    }
  })


})



let n1 = 4
let n2 = 5
let n3 = 6
let n4 = 7

let co = document.querySelectorAll(".cont")
con = co[co.length - 1]

const addQu = document.getElementById("add-qu")
let forms = document.querySelectorAll(".form")

setInterval(() => {
  co = document.querySelectorAll(".cont")
  con = co[co.length - 1]

  select = document.querySelectorAll(".select");
  inputs = document.querySelectorAll(".item");
  btnItem = document.querySelectorAll(".item-btn");

  forms = document.querySelectorAll(".form")

  closeBtn = document.querySelectorAll(".close-btn")


}, 100)

// ====================  Start math  ==========================



document.querySelector(".radikal-q").addEventListener("click", () => {
  let PR = document.querySelector(".radikal-q").closest(".cont-con")
  let view = PR.querySelector(".view")
  let span = document.createElement("span")
  view.append(span)

  PR.querySelector(".item").value += "\\sqrt{x}"
  katex.render("\\sqrt{x}", span)
})


document.querySelector(".tavan-q").addEventListener("click", () => {
  let PR = document.querySelector(".tavan-q").closest(".cont-con")
  let view = PR.querySelector(".view")
  let span = document.createElement("span")
  view.append(span)

  PR.querySelector(".item").value += "x^2"
  katex.render("x^2", span)
})


document.querySelector(".binahayat-q").addEventListener("click", () => {
  let PR = document.querySelector(".binahayat-q").closest(".cont-con")
  let view = PR.querySelector(".view")
  let span = document.createElement("span")
  view.append(span)

  PR.querySelector(".item").value += "\\infty"
  katex.render("\\infty", span)
})


document.querySelector(".radikal-3-q").addEventListener("click", () => {
  let PR = document.querySelector(".radikal-3-q").closest(".cont-con")
  let view = PR.querySelector(".view")
  let span = document.createElement("span")
  view.append(span)

  PR.querySelector(".item").value += "\\sqrt[3]{x}"
  katex.render("\\sqrt[3]{x}", span)
})


document.querySelector(".darsad-q").addEventListener("click", () => {
  let PR = document.querySelector(".darsad-q").closest(".cont-con")
  let view = PR.querySelector(".view")
  let span = document.createElement("span")
  view.append(span)

  PR.querySelector(".item").value += "\\begin{bmatrix} x \\\\ y \\end{bmatrix}"
  katex.render("\\begin{bmatrix} x \\\\ y \\end{bmatrix}", span)
})



document.querySelector(".krorsha-q").addEventListener("click", () => {
  let PR = document.querySelector(".krorsha-q").closest(".cont-con")
  let view = PR.querySelector(".view")
  let span = document.createElement("span")
  view.append(span)

  PR.querySelector(".item").value += "×"
  katex.render("×", span)

})


document.querySelector(".kasr-q").addEventListener("click", () => {
  let PR = document.querySelector(".kasr-q").closest(".cont-con")
  let view = PR.querySelector(".view")
  let span = document.createElement("span")
  view.append(span)

  PR.querySelector(".item").value += "\\frac{a}{b}"
  katex.render("\\frac{a}{b}", view)

})

document.querySelector(".txt-q").addEventListener("click", () => {
  let PR = document.querySelector(".txt-q").closest(".cont-con")
  let view = PR.querySelector(".view")
  let span = document.createElement("span")
  view.append(span)

  PR.querySelector(".item").value += "\\text{متن سوال}"
  katex.render("\\text{متن سوال}", view)

})


// math for question -----------------

document.querySelector(".radikal").addEventListener("click", () => {
  let PR = document.querySelector(".radikal").closest(".form")
  let view = PR.querySelector(".text-q")

  PR.querySelector(".text-q").value += "\\sqrt{x}"
  katex.render("\\sqrt{x}", view)
})



document.querySelector(".kasr").addEventListener("click", () => {
  let PR = document.querySelector(".kasr").closest(".form")
  let view = PR.querySelector(".text-q")



  PR.querySelector(".text-q").value += "\\frac{a}{b}"
  katex.render("\\frac{a}{b}", view)
})


document.querySelector(".darsad").addEventListener("click", () => {
  let PR = document.querySelector(".darsad").closest(".form")
  let view = PR.querySelector(".text-q")



  PR.querySelector(".text-q").value += "\\begin{bmatrix} x \\\\ y \\end{bmatrix}"
  katex.render("\\begin{bmatrix} x \\\\ y \\end{bmatrix}", view)
})


document.querySelector(".radikal-3").addEventListener("click", () => {
  let PR = document.querySelector(".radikal-3").closest(".form")
  let view = PR.querySelector(".text-q")



  PR.querySelector(".text-q").value += "\\sqrt[3]{x}"
  katex.render("\\sqrt[3]{x}", view)
})


document.querySelector(".tavan").addEventListener("click", () => {
  let PR = document.querySelector(".tavan").closest(".form")
  let view = PR.querySelector(".text-q")



  PR.querySelector(".text-q").value += " x^2"
  katex.render("x^2", view)
})


document.querySelector(".binahayat").addEventListener("click", () => {
  let PR = document.querySelector(".binahayat").closest(".form")
  let view = PR.querySelector(".text-q")



  PR.querySelector(".text-q").value += "\\infty"
  katex.render("\\infty", view)
})

document.querySelector(".krosha").addEventListener("click", () => {
  let PR = document.querySelector(".krosha").closest(".form")
  let view = PR.querySelector(".text-q")



  PR.querySelector(".text-q").value += "×"
  katex.render("×", view)
})

document.querySelector(".txt").addEventListener("click", () => {
  let PR = document.querySelector(".txt").closest(".form")
  let view = PR.querySelector(".text-q")



  PR.querySelector(".text-q").value += "\\text{متن سوال}"
  katex.render("\\text{متن سوال}", view)
})


// ====================  END math  ========================



// clear input (پاک کردن پیش نمایش سوال)

let clearInp = document.querySelector(".clear-input")

clearInp.addEventListener("click", () => {
  let PclearInp = clearInp.closest(".form")
  PclearInp.querySelector(".view").innerHTML = ""
  PclearInp.querySelector(".item").value = ""
})


// update btn for question ===============

let updateBtnForQu = document.querySelector(".update-btn-qu")

updateBtnForQu.addEventListener("click", () => {
  let PR = updateBtnForQu.closest(".form")
  let textQu = PR.querySelector(".text-q").value
  let viewQu = PR.querySelector(".view-question")

  viewQu.innerHTML = ""

  let spanForMath = document.createElement("span")
  viewQu.appendChild(spanForMath)

  katex.render(textQu, spanForMath)
})


// add option for question =========================


let addOptionForitem = document.getElementById("add-option")

addOptionForitem.addEventListener("click", () => {
  let parAddItem = addOptionForitem.closest(".form")
  let textAreaView = parAddItem.querySelector(".item")
  let containerOptions = parAddItem.querySelector("#container-options")
  let view = parAddItem.querySelector(".view")

  let allOptions = containerOptions.querySelectorAll("p")

  if (allOptions.length >= 5) {
    alert("حداکثر 5 گزینه مجاز است .")
  } else {
    if (textAreaView.value.trim() !== "") {
      view.innerHTML = ""
      let removeItem = document.createElement("span")

      let textQu = document.createElement("p")
      textQu.innerHTML = textAreaView.value
      containerOptions.appendChild(textQu)
      textQu.appendChild(removeItem)

      removeItem.innerHTML = "×"

      textQu.classList.add("added-option")
      removeItem.classList.add("remove-option")

      textAreaView.value = ""

      removeItem.addEventListener(("click"), () => {
      removeItem.closest(".added-option").remove()

      })
    } else {
      alert("گزینه خالی است .")
    }

  }
})


// insert the view question -----------------------


let updateBtn = document.querySelector(".update-btn")


updateBtn.addEventListener("click", () => {
  let PRform = updateBtn.closest(".form")

  let textOption = PRform.querySelector(".item")
  textOption = textOption.value

  let view = PRform.querySelector(".view")
  katex.render(textOption, view)

})




// create the new Option ======================--------=============



addQu.addEventListener("click", () => {


  let form = document.createElement("form");

  let label1 = document.createElement("label");
  let label2 = document.createElement("label");

  let h2ViewQues = document.createElement("h2")
  let h3ViewText = document.createElement("h3")

  let p = document.createElement("p")
  let clearBtn = document.createElement("p")

  let input1 = document.createElement("input");
  let input2 = document.createElement("input");

  let updateBtn = document.createElement("button")
  let updateBtnForQu = document.createElement("button")

  let div1 = document.createElement("div");
  let div2 = document.createElement("div");
  let div3 = document.createElement("div");
  let div4 = document.createElement("div");
  let div5 = document.createElement("div");
  let div6 = document.createElement("div");
  let div7 = document.createElement("div");
  let div8 = document.createElement("div");
  let div9 = document.createElement("div");
  let div10 = document.createElement("div");
  let div11 = document.createElement("div");
  let div12 = document.createElement("div");
  let div13 = document.createElement("div");
  let div14 = document.createElement("div");
  let div15 = document.createElement("div");
  let div16 = document.createElement("div");
  let div17 = document.createElement("div");

  let mathBtn1 = document.createElement("button")
  let mathBtn2 = document.createElement("button")
  let mathBtn3 = document.createElement("button")
  let mathBtn4 = document.createElement("button")
  let mathBtn5 = document.createElement("button")
  let mathBtn6 = document.createElement("button")
  let mathBtn7 = document.createElement("button")
  let mathBtn8 = document.createElement("button")


  let mathBtn1Q = document.createElement("button")
  let mathBtn2Q = document.createElement("button")
  let mathBtn3Q = document.createElement("button")
  let mathBtn4Q = document.createElement("button")
  let mathBtn5Q = document.createElement("button")
  let mathBtn6Q = document.createElement("button")
  let mathBtn7Q = document.createElement("button")
  let mathBtn8Q = document.createElement("button")


  // add event to math btn

  mathBtn1.addEventListener("click", () => {
    let PR = mathBtn1.closest(".cont-con")
    let view = PR.querySelector(".view")
    let span = document.createElement("span")
    view.append(span)

    PR.querySelector(".item").value += "\\frac{a}{b}"
    katex.render("\\sqrt{x}", span)

  })
  mathBtn2.addEventListener("click", () => {
    let PR = mathBtn2.closest(".cont-con")
    let view = PR.querySelector(".view")
    let span = document.createElement("span")
    view.append(span)

    PR.querySelector(".item").value += "\\frac{a}{b}"
    katex.render("\\frac{a}{b}", span)

  })
  mathBtn3.addEventListener("click", () => {
    let PR = mathBtn3.closest(".cont-con")
    let view = PR.querySelector(".view")
    let span = document.createElement("span")
    view.append(span)

    PR.querySelector(".item").value += "\\frac{a}{b}"
    katex.render("\\sqrt{x}", span)

  })
  mathBtn4.addEventListener("click", () => {
    let PR = mathBtn4.closest(".cont-con")
    let view = PR.querySelector(".view")
    let span = document.createElement("span")
    view.append(span)

    PR.querySelector(".item").value += "\\begin{bmatrix} 51.123 \\\\ 35.678 \\end{bmatrix}"
    katex.render("\\begin{bmatrix} x \\\\ y \\end{bmatrix}", span)

  })
  mathBtn5.addEventListener("click", () => {
    let PR = mathBtn5.closest(".cont-con")
    let view = PR.querySelector(".view")
    let span = document.createElement("span")
    view.append(span)

    PR.querySelector(".item").value += "\\sqrt[3]{x}"
    katex.render("\\sqrt[3]{x}", span)

  })
  mathBtn6.addEventListener("click", () => {
    let PR = mathBtn6.closest(".cont-con")
    let view = PR.querySelector(".view")
    let span = document.createElement("span")
    view.append(span)

    PR.querySelector(".item").value += "\\infty"
    katex.render("\\infty", span)

  })
  mathBtn7.addEventListener("click", () => {
    let PR = mathBtn7.closest(".cont-con")
    let view = PR.querySelector(".view")
    let span = document.createElement("span")
    view.append(span)

    PR.querySelector(".item").value += "x^2"
    katex.render("x^2", span)

  })


  mathBtn8.addEventListener("click", () => {
    let PR = mathBtn7.closest(".cont-con")
    let view = PR.querySelector(".view")
    let span = document.createElement("span")
    view.append(span)

    PR.querySelector(".item").value += "\\text{متن سوال}"
    katex.render("\\text{متن سوال}", span)

  })





  mathBtn1Q.addEventListener("click", () => {
    let PR = mathBtn1Q.closest(".form")
    let view = PR.querySelector(".text-q")

    PR.querySelector(".text-q").value += "\\sqrt{x}"
    katex.render("\\sqrt{x}", view)
  })


  mathBtn2Q.addEventListener("click", () => {
    let PR = mathBtn2Q.closest(".form")
    let view = PR.querySelector(".text-q")



    PR.querySelector(".text-q").value += "\\frac{a}{b}"
    katex.render("\\frac{a}{b}", view)
  })


  mathBtn3Q.addEventListener("click", () => {
    let PR = mathBtn3Q.closest(".form")
    let view = PR.querySelector(".text-q")



    PR.querySelector(".text-q").value += "\\frac{a}{b}"
    katex.render("\\frac{a}{b}", view)
  })


  mathBtn4Q.addEventListener("click", () => {
    let PR = mathBtn4Q.closest(".form")
    let view = PR.querySelector(".text-q")



    PR.querySelector(".text-q").value += "\\begin{bmatrix} 51.123 \\\\ 35.678 \\end{bmatrix}"
    katex.render("\\begin{bmatrix} x \\\\ y \\end{bmatrix}", view)
  })


  mathBtn5Q.addEventListener("click", () => {
    let PR = mathBtn5Q.closest(".form")
    let view = PR.querySelector(".text-q")



    PR.querySelector(".text-q").value += "\\sqrt[3]{x}"
    katex.render("\\sqrt[3]{x}", view)
  })


  mathBtn6Q.addEventListener("click", () => {
    let PR = mathBtn6Q.closest(".form")
    let view = PR.querySelector(".text-q")



    PR.querySelector(".text-q").value += "x^2"
    katex.render("x^2", view)
  })


  mathBtn7Q.addEventListener("click", () => {
    let PR = mathBtn7Q.closest(".form")
    let view = PR.querySelector(".text-q")



    PR.querySelector(".text-q").value += "\\infty"
    katex.render("\\infty", view)
  })


  mathBtn8Q.addEventListener("click", () => {
    let PR = mathBtn7Q.closest(".form")
    let view = PR.querySelector(".text-q")



    PR.querySelector(".text-q").value += "\\text{متن سوال}"
    katex.render("\\text{متن سوال}", view)
  })



  updateBtnForQu.addEventListener("click", () => {
    let PR = updateBtnForQu.closest(".form")
    let textQu = PR.querySelector(".text-q").value
    let viewQu = PR.querySelector(".view-question")

    viewQu.innerHTML = ""

    let spanForMath = document.createElement("span")
    viewQu.appendChild(spanForMath)

    katex.render(textQu, spanForMath)
  })


  // end =================--------------------


  mathBtn1.setAttribute("type", "button")
  mathBtn2.setAttribute("type", "button")
  mathBtn3.setAttribute("type", "button")
  mathBtn4.setAttribute("type", "button")
  mathBtn5.setAttribute("type", "button")
  mathBtn6.setAttribute("type", "button")
  mathBtn7.setAttribute("type", "button")
  mathBtn8.setAttribute("type", "button")

  updateBtnForQu.setAttribute("type", "button")

  mathBtn1.classList.add("radikal-q")
  mathBtn2.classList.add("kasr-q")
  mathBtn3.classList.add("krorsha-q")
  mathBtn4.classList.add("darsad-q")
  mathBtn5.classList.add("radikal-3-q")
  mathBtn6.classList.add("binahayat-q")
  mathBtn7.classList.add("tavan-q")
  mathBtn8.classList.add("txt-q")

  h2ViewQues.classList.add("view-question")
  h3ViewText.classList.add("title-view")

  clearBtn.classList.add("clear-input")
  clearBtn.innerHTML = "پاک کردن"

  updateBtn.innerHTML = "دیدن پیش نمایش"


  h3ViewText.innerHTML = "پیش نمایش سوال :"



  // insert the view question item ======================

  updateBtn.addEventListener("click", () => {
    let PRform = updateBtn.closest(".form")

    let textOption = PRform.querySelector(".item")
    textOption = textOption.value

    let view = PRform.querySelector(".view")
    katex.render(textOption, view)

  })



  mathBtn1Q.setAttribute("type", "button")
  mathBtn2Q.setAttribute("type", "button")
  mathBtn3Q.setAttribute("type", "button")
  mathBtn4Q.setAttribute("type", "button")
  mathBtn5Q.setAttribute("type", "button")
  mathBtn6Q.setAttribute("type", "button")
  mathBtn7Q.setAttribute("type", "button")
  mathBtn8Q.setAttribute("type", "button")

  mathBtn1Q.classList.add("radikal")
  mathBtn2Q.classList.add("kasr")
  mathBtn3Q.classList.add("krorsha")
  mathBtn4Q.classList.add("darsad")
  mathBtn5Q.classList.add("radikal-3")
  mathBtn6Q.classList.add("binahayat")
  mathBtn7Q.classList.add("tavan")
  mathBtn8Q.classList.add("txt")

  updateBtn.classList.add("update-btn")

  div6.classList.add("math-con-for-text-qu")

  let viewh2 = document.createElement("h2")

  let h3tag = document.createElement("h3")

  let addOptionText = document.createElement("button")

  addOptionText.innerHTML = "افزودن گزینه"

  addOptionText.addEventListener("click", () => {
    let parAddItem = addOptionText.closest(".form")
    let h2View = parAddItem.querySelector(".item")
    let containerOptions = parAddItem.querySelector("#container-options")
    let view = parAddItem.querySelector(".view")
    let allOptions = containerOptions.querySelectorAll("p")


    if (allOptions.length >= 5) {
      alert("حداکثر 5 گزینه مجاز است .")
    } else {
      if (h2View.value.trim() !== "") {
        let removeItem = document.createElement("span")
        
        let textQu = document.createElement("p")
        textQu.innerHTML = h2View.value
        containerOptions.appendChild(textQu)
        textQu.appendChild(removeItem)
        
        removeItem.innerHTML = "×"
        
        textQu.classList.add("added-option")
        removeItem.classList.add("remove-option")
        
        view.innerHTML = ""
        h2View.value = ""

        removeItem.addEventListener(("click"), () => {
          removeItem.closest(".added-option").remove()

        })
      } else {
        alert("گزینه خالی است .")
      }
    }
  })


  clearBtn.addEventListener("click", () => {
    let PclearInp = clearBtn.closest(".form")
    PclearInp.querySelector(".view").innerHTML = ""
    PclearInp.querySelector(".item").value = ""
  })


  mathBtn1.innerHTML = "√"
  mathBtn2.innerHTML = "÷"
  mathBtn3.innerHTML = "[ ]"
  mathBtn4.innerHTML = "[ ]"
  mathBtn5.innerHTML = "∛"
  mathBtn6.innerHTML = "∞"
  mathBtn7.innerHTML = "^"
  mathBtn8.innerHTML = "متن"


  mathBtn1Q.innerHTML = "√"
  mathBtn2Q.innerHTML = "÷"
  mathBtn3Q.innerHTML = "[ ]"
  mathBtn4Q.innerHTML = "[ ]"
  mathBtn5Q.innerHTML = "∛"
  mathBtn6Q.innerHTML = "∞"
  mathBtn7Q.innerHTML = "^"
  mathBtn8Q.innerHTML = "متن"

  h3tag.innerHTML = "پیش نمایش گزینه :"


  let selectN = document.createElement("select");
  let aBtn = document.createElement("button");

  let closeBtn = document.createElement("button")

  label1.innerHTML = "متن سوال";

  p.innerHTML = "گزینه درست :"

  updateBtnForQu.innerHTML = "دیدن پیش نمایش متن سوال"



  addOptionText.setAttribute("type", "button")

  input1.setAttribute("type", "text");
  input1.setAttribute("placeholder", "متن سوال خود را وارد کنید ...");
  input1.setAttribute("name", "question");
  input1.setAttribute("required", "");
  input1.classList.add("text-q");

  selectN.setAttribute("name", "select");
  selectN.classList.add("select");

  aBtn.classList.add("item-btn")
  aBtn.innerHTML = "افزودن گزینه ها"
  aBtn.setAttribute("type", "button")

  label2.innerHTML = "گزینه ها"


  closeBtn.innerHTML = "❌"

  closeBtn.addEventListener("click", () => {
    let closeBtnParForm = closeBtn.closest(".form")
    if (forms.length > 2) {
      closeBtnParForm.remove()
    } else {
      alert("آزمون باید حداقل 2 سوال داشته باشد .")
    }
  })


  form.classList.add("form")

  form.setAttribute("method", "post")

  closeBtn.setAttribute("type", "button")

  input2.setAttribute("name", "item" + String(n1));


  n1 = Number(n1) + 1
  n2 = Number(n2) + 1
  n3 = Number(n3) + 1
  n4 = Number(n4) + 1

  input2.setAttribute("required", "");


  input2.setAttribute("placeholder", "گزینه های سوال ...");


  div1.classList.add("cont-con");
  div3.classList.add("con-item-add");
  div4.classList.add("con");
  div5.classList.add("con");
  div9.classList.add("options-con")
  input2.classList.add("item");
  div13.classList.add("con-view")


  updateBtnForQu.classList.add("update-btn-qu")

  addOptionText.classList.add("add-option")

  viewh2.classList.add("view")

  div10.classList.add("math-con")
  div16.classList.add("math-con")


  closeBtn.classList.add("close-btn");

  div12.classList.add("con-t-s")

  div2.setAttribute("id", "container-options")

  p.classList.add("true-item")

  form.appendChild(div7);
  div7.appendChild(div14);
  div14.appendChild(label1)
  div14.appendChild(input1);
  form.appendChild(div6)
  form.appendChild(div1);
  form.appendChild(div2);
  form.appendChild(div3);
  form.appendChild(closeBtn)


  // اضافه کردن بچه‌ها به div1, div2, div3
  div1.appendChild(div4);
  div1.appendChild(div5);


  div3.appendChild(div12);
  div3.appendChild(aBtn);

  div4.appendChild(label2);
  div1.appendChild(div13);
  div4.appendChild(div8);

  div13.appendChild(div11)
  div11.appendChild(h3tag)
  div11.appendChild(viewh2)
  div13.appendChild(clearBtn)

  div6.appendChild(div16)
  div6.appendChild(updateBtnForQu)

  div16.appendChild(mathBtn1Q)
  div16.appendChild(mathBtn2Q)
  div16.appendChild(mathBtn3Q)
  div16.appendChild(mathBtn4Q)
  div16.appendChild(mathBtn5Q)
  div16.appendChild(mathBtn6Q)
  div16.appendChild(mathBtn7Q)
  div16.appendChild(mathBtn8Q)

  div6.appendChild(div17)

  div17.appendChild(h3ViewText)
  div17.appendChild(h2ViewQues)


  div8.appendChild(div9);
  div9.appendChild(input2);
  div9.appendChild(div10);
  div8.appendChild(div15);
  div15.appendChild(addOptionText)
  div15.appendChild(updateBtn)

  div10.appendChild(mathBtn1)
  div10.appendChild(mathBtn2)
  div10.appendChild(mathBtn3)
  div10.appendChild(mathBtn4)
  div10.appendChild(mathBtn5)
  div10.appendChild(mathBtn6)
  div10.appendChild(mathBtn7)
  div10.appendChild(mathBtn8)

  div12.appendChild(p);
  div12.appendChild(selectN);


  let conDiv = document.createElement("div")
  conDiv.classList.add("cont")
  conDiv.appendChild(form)
  main.appendChild(conDiv)
})