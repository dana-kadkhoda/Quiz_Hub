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

const subBtn = document.querySelector(".send-btn")

let quizName = ""
let quizPass = ""

nextLevel.addEventListener("click", () => {
  quizName = quizNameUser.value
  quizPass = quizPassUser.value
  if (quizName.trim() !== "" && quizPass.trim() !== "") {
    conQuizName.style.display = "none"
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
  let items = []
  let Forms = document.querySelectorAll(".form")
  item_n = []

  quesstionText = document.querySelectorAll(".text")
  for (let text of quesstionText) {
    textQuesstion.push(text.value)
  }





  for (let Form of Forms) {
    let item = Form.querySelectorAll(".item")
    items.push(item)
  }

  for (let nItem of items) {
    for (let vItem of nItem) {
      item_n.push(vItem.value)
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
    alert("درحال ساخت ...")

    selectsValue = []

    select.forEach((s) => {
      selectsValue.push(s.options[s.selectedIndex].text);
    })




    fetch("/send_data", {
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

      let inputsItem = parForm.querySelectorAll("input[class = 'item']")

      inputsItem.forEach(input => {
        if (input.value.trim() !== "") {
          let option = document.createElement("option");
          option.value = input.value;
          option.textContent = input.value;
          selectInForm.appendChild(option);
        }
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




addQu.addEventListener("click", () => {


  let form = document.createElement("form");

  let label1 = document.createElement("label");
  let label2 = document.createElement("label");
  let label3 = document.createElement("label");
  let label4 = document.createElement("label");
  let label5 = document.createElement("label");

  let p = document.createElement("p")

  let input1 = document.createElement("input");
  let input2 = document.createElement("input");
  let input3 = document.createElement("input");
  let input4 = document.createElement("input");
  let input5 = document.createElement("input");

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
  let div12 = document.createElement("div")


  let selectN = document.createElement("select");
  let aBtn = document.createElement("button");

  let closeBtn = document.createElement("button")

  label1.innerHTML = "متن سوال";

  p.innerHTML = "گزینه درست :"

  input1.setAttribute("type", "text");
  input1.setAttribute("placeholder", "متن سوال خود را وارد کنید ...");
  input1.setAttribute("name", "question");
  input1.setAttribute("required", "");
  input1.classList.add("text")

  selectN.setAttribute("name", "select");
  selectN.classList.add("select");

  aBtn.classList.add("item-btn")
  aBtn.innerHTML = "افزودن گزینه ها"
  aBtn.setAttribute("type", "button")

  label2.innerHTML = "گزینه 1"
  label3.innerHTML = "گزینه 2"
  label4.innerHTML = "گزینه 3"
  label5.innerHTML = "گزینه 4"

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
  input3.setAttribute("name", "item" + String(n2));
  input4.setAttribute("name", "item" + String(n3));
  input5.setAttribute("name", "item" + String(n4));

  n1 = Number(n1) + 1
  n2 = Number(n2) + 1
  n3 = Number(n3) + 1
  n4 = Number(n4) + 1

  input2.setAttribute("required", "");
  input3.setAttribute("required", "");
  input4.setAttribute("required", "");
  input5.setAttribute("required", "");

  input2.setAttribute("placeholder", "گزینه اول سوال ...");
  input3.setAttribute("placeholder", "گزینه دوم سوال ...");
  input4.setAttribute("placeholder", "گزینه سوم سوال ...");
  input5.setAttribute("placeholder", "گزینه چهارم سوال ...");

  div1.classList.add("cont-con");
  div2.classList.add("cont-con");
  div3.classList.add("con-item-add");
  div4.classList.add("con");
  div5.classList.add("con");
  div6.classList.add("con");
  div7.classList.add("con");
  input2.classList.add("item");
  input3.classList.add("item");
  input4.classList.add("item");
  input5.classList.add("item");

  closeBtn.classList.add("close-btn");

  div12.classList.add("con-t-s")

  p.classList.add("true-item")

  form.appendChild(label1);
  form.appendChild(input1);
  form.appendChild(div1);
  form.appendChild(div2);
  form.appendChild(div3);
  form.appendChild(closeBtn)


  // اضافه کردن بچه‌ها به div1, div2, div3
  div1.appendChild(div4);
  div1.appendChild(div5);

  div2.appendChild(div6);
  div2.appendChild(div7);

  div3.appendChild(div12);
  div3.appendChild(aBtn);

  div4.appendChild(label2);
  div4.appendChild(div8);

  div5.appendChild(label3);
  div5.appendChild(div9);

  div6.appendChild(label4);
  div6.appendChild(div10);

  div7.appendChild(label5);
  div7.appendChild(div11);

  div8.appendChild(input2);
  div9.appendChild(input3);
  div10.appendChild(input4);
  div11.appendChild(input5);
  div12.appendChild(p);
  div12.appendChild(selectN);

  let windowWidth = window.innerWidth

  if (windowWidth >= 1300) {
    if (forms.length % 3 == 0) {
      let conDiv = document.createElement("div")
      conDiv.classList.add("cont")
      conDiv.appendChild(form)
      main.appendChild(conDiv)
    } else if (forms.length % 3 != 0) {
      con.appendChild(form)
    }
  } else if (1000 <= windowWidth <= 1290) {
    if (forms.length % 2 == 0) {
      let conDiv = document.createElement("div")
      conDiv.classList.add("cont")
      conDiv.appendChild(form)
      main.appendChild(conDiv)
    } else if (forms.length % 2 != 0) {
      con.appendChild(form)
    }
  } else {
    let conDiv = document.createElement("div")
    conDiv.classList.add("cont")
    conDiv.appendChild(form)
    main.appendChild(conDiv)
  }
})