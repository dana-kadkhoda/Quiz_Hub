from flask import Flask, render_template, request, redirect, url_for, session, abort, send_file
import sqlite3
import requests
from khayyam import JalaliDatetime
import io
from pdf2docx import Converter
import os
import tempfile
import random

app = Flask(__name__)

app.secret_key = "mndjnksjhsdfjhehwhuihdsfksjdhmcsjhsdfsnkhanskadjuwar"

conn = sqlite3.connect("orders.db",check_same_thread=False)
cur = conn.cursor()
cur1 = conn.cursor()
cur2 = conn.cursor()
cur3 = conn.cursor()

cur.execute("DROP TABLE IF EXISTS Users")

cur.execute('''CREATE TABLE IF NOT EXISTS users(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    quiz_id TEXT,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    active_option TEXT NOT NULL DEFAULT 0,
    have_option INTEGER NOT NULL DEFAULT 0,
    number_quiz INTEGER NOT NULL DEFAULT 2,
    number_student INTEGER NOT NULL DEFAULT 10
)
''')

cur.execute('''CREATE TABLE IF NOT EXISTS students(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    score INTEGER NOT NULL,
    nFalseItem INTEGER NOT NULL,
    quiz_id INTEGER NOT NULL,
    all_score INTEGER NOT NULL,
    error INTEGER NOT NULL DEFAULT 0,
    number_true INTEGER NOT NULL DEFAULT 0
)''')

cur.execute('''CREATE TABLE IF NOT EXISTS quiz(
    name TEXT NOT NULL,
    quiz_id INTEGER NOT NULL,
    starttime TEXT NOT NULL,
    endtime TEXT NOT NULL,
    time TEXT NOT NULL
)''')


cur.execute('''CREATE TABLE IF NOT EXISTS question(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    quiz_id INTEGER NOT NULL,
    question TEXT NOT NULL,
    option_1 TEXT NOT NULL,
    option_2 TEXT NOT NULL,
    option_3 TEXT NOT NULL,
    option_4 TEXT NOT NULL,
    true_option TEXT NOT NULL
)
''')

cur.execute('''CREATE TABLE IF NOT EXISTS payment(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    token TEXT NOT NULL,
    price INTEGER NOT NULL,
    card_pan TEXT,
    refid INTEGER,
    status INTEGER DEFAULT 0
)''')


@app.route("/")
def home():
    return render_template("login.html")




@app.route("/quiz/teacher/login" ,  methods=['GET', 'POST'])
def teacher_login():

    error = 'لطفا نام کاربری ، رمز عبور و ایمیل خود را وارد کنید .'

    if request.method == "POST" :
        username = request.form.get('username')
        password = request.form.get('password')

        cur.execute("SELECT username FROM users WHERE username = ?", (username,))
        check_username = cur.fetchone()

        cur.execute("SELECT password FROM users WHERE password = ?", (password,))
        check_password = cur.fetchone()


        if check_username and check_password:
            session["quiz_scor"] = password
            session["password_login"] = username

            return redirect(url_for("border"))
        else:
                error = "نام کاربری یا رمز عبور اشتاه است ."


    return render_template("login-to-manage.html",error = error)

@app.route("/quiz/teacher/signup" ,  methods=['GET', 'POST'])
def teacher_signup():

    error = 'لطفا نام کاربری ، رمز عبور و ایمیل خود را وارد کنید .'

    if request.method == "POST" :
        username = request.form.get('username')
        password = request.form.get('password')



        cur.execute("SELECT * FROM users WHERE username = ?", (username,))
        check1 = cur.fetchone()
        cur.execute("SELECT * FROM users WHERE password = ?", (password,))
        check2 = cur.fetchone()


        if check1 or check2 :
            error = "رمز یا نام کاربری استفاده شده"
        else:
            session["quiz_scor"] = password
            session["password_login"] = username

            cur.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, password))
            conn.commit()




            return redirect(url_for("border"))


    return render_template("signup.html",error = error)

@app.route("/teacher/border")
def border():

    try :
        if session.get("password_login" , None) == None :
            return render_template("not-signed.html")
        else :

            quiz_id = session.get("quiz_id")


            quiz_id_for_border = quiz_id

            if 'math' in str(quiz_id) :
                quiz_id_for_border = str(quiz_id) + "/math"
            
            username = session.get("password_login")
            


            cur.execute("SELECT * FROM users WHERE username = ?",(username,))
            info = cur.fetchone()


            info_user = []

            for inf in info :
                info_user.append(inf)

            left_time = "∞"
            active_option = info_user[4]
            number_quiz = info_user[6]
            number_student = info_user[7]
            
            if str(active_option) == "0" :
                active_option = "اشتراک پیش فرض"
    except:
        return "لطفا ثبت نام کنید ."

    return render_template("border.html" , quiz_id = quiz_id , quiz_id_for_border = quiz_id_for_border , number_quiz = number_quiz , number_student = number_student , active_option = active_option , left_time = left_time)


@app.route("/logout" , methods=['POST'])
def logout():
    if request.is_json:
        data = request.get_json()
        log = data.get("logout")
        
        if log:
            session["password_login"] = None

    return "ok"

@app.route("/quiz/teacher/manage-math" , methods=["POST" , "GET"])
def manage_math():

    if session.get("password_login" , None) == None :
        return render_template("not-signed.html")
    else :

        username = session.get("password_login")

        cur3.execute("SELECT * FROM users WHERE username = ?",(username,))
        info = cur3.fetchone()
        
        info_list = []

        if info :
            for inf in info :
                info_list.append(inf)
        
        if info_list[6] <= 0 :
            return redirect(url_for("border"))

        if session.get("password_login" , None) == None :
            return render_template("not-signed.html")
        else :
            if request.method == "POST":
                return redirect(url_for("send_data_math"))
            return render_template("teacher-manage-math.html")



@app.route("/shop" , methods=["POST" , "GET"])
def shop():
    if session.get("password_login" , None) == None :
        return render_template("not-signed.html")
    else :

        if request.is_json :
            data = request.get_json()
            price = data.get("price")

            session["price"] = price


        return render_template("shop.html")


@app.route("/payment" , methods=['GET' , 'POST'])
def payment():
    if session.get("password_login" , None) == None :
        return render_template("not-signed.html")
    else :

        price = session.get("price")

        r = requests.post("https://sandbox.shepa.com/api/v1/token" , 
        data = {
            'api' : 'sandbox',
            'amount' : int(price), 
            'callback' : 'http://127.0.0.1:5000/verify'
        })

        username = session.get("password_login")
        token = r.json()['result']['token']
        url = r.json()['result']['url']

        cur.execute("SELECT * FROM payment WHERE username = ?",(username,))
        is_pay = cur.fetchone()

        if is_pay :
            cur.execute("DELETE FROM payment WHERE username = ?",(username,))
            conn.commit()
        

        cur.execute("INSERT INTO payment (username, token, price) VALUES (?, ?, ?)",(username,token,price))
        conn.commit()

        return redirect(url)


@app.route("/verify")
def verify():
    if session.get("password_login" , None) == None :
        return render_template("not-signed.html")
    else :
        price = session.get("price")
        username = session.get("password_login")

        token = request.args.get('token')

        r = requests.post("https://sandbox.shepa.com/api/v1/verify" , 
        data = {
            'api' : 'sandbox',
            'amount' : int(price), 
            'token' : token
        })
        
        pay_status = r.json()['success']


        if pay_status :
            card_pan = r.json()['result']['card_pan']
            refid = r.json()['result']['refid']

            cur.execute("UPDATE payment SET status = ?, refid = ?, card_pan = ? WHERE username = ?",(1,refid,card_pan,username))
            conn.commit()

            def comite_pay (quiz,student,option):
                cur.execute("UPDATE users SET active_option = ?, number_quiz = ?, number_student = ? WHERE username = ?",(option,quiz,student,username))
                conn.commit()

            if int(price) == 230000 :
                active_option = "اشتراک طلایی"
                comite_pay(12,120,active_option)


            elif int(price) == 110000 :
                active_option = "اشتراک نقره ای"
                comite_pay(8,80,active_option)


            elif int(price) == 40000 :
                active_option = "اشتراک برنزی"
                comite_pay(5,30,active_option)

        else :
            pass
        
        return redirect(url_for('border'))


@app.route("/quiz/teacher/manage" , methods=["POST" , "GET"])
def manage():

    if session.get("password_login" , None) == None :
        return render_template("not-signed.html")
    else :

        username = session.get("password_login")

        cur2.execute("SELECT * FROM users WHERE username = ?",(username,))
        info = cur2.fetchone()

        
        info_list = []

        if info :
            for inf in info :
                info_list.append(inf)


        
        if info_list[6] <= 0 :
            return redirect(url_for("border"))

        if session.get("password_login" , None) == None :
            return render_template("not-signed.html")
        else :
            if request.method == "POST":
                return redirect(url_for("send_data"))
            return render_template("teacher-manage.html")


@app.route("/send_data", methods=["POST" , "GET"])
def send_data():
    if session.get("password_login" , None) == None :
        return render_template("not-signed.html")
    else :

        if request.is_json:


            data = request.get_json()
            text_qu = data.get("textQuesstion")
            items = data.get("item_n")
            select_val = data.get("selectsValue")
            quiz_id = data.get("quiz_id")
            quiz_name = data.get("quizName")
            session["quiz_id"] = quiz_id
            quiz_id_for_scor = session.get("quiz_scor")
            quiz_id += "-" + str(quiz_id_for_scor) + str(random.randint(1,300))
            session["quiz_id"] = quiz_id
            session["quiz_name"] = quiz_name



            for i in range(len(text_qu)) :
                for txt in text_qu:

                    n = 1
                    cur.execute(
                        "INSERT INTO question (quiz_id, question, option_1, option_2, option_3, option_4, true_option) VALUES (?, ?, ?, ?, ?, ?, ?)",
                        (quiz_id, txt, "s", "s", "s", "s", "s"))


                    for item in items:
                        cur.execute(f"UPDATE question SET option_{n} = ? WHERE question = ?", (item, txt))
                        n += 1
                        if n == 5:
                            break



                    for v in select_val:
                        cur.execute("UPDATE question SET true_option = ? WHERE question = ?", (v, txt))
                        break



                    items = items[4:]
                    select_val = select_val[1:]
                    text_qu = text_qu[1:]



                    conn.commit()

            username = session.get("password_login")
            cur1.execute("UPDATE users SET quiz_id = ? WHERE username = ?",(quiz_id,username))
            conn.commit()

        return redirect(url_for("setting"))



@app.route("/send_data_math", methods=["POST" , "GET"])
def send_data_math():
    if session.get("password_login" , None) == None :
        return render_template("not-signed.html")
    else :

        if request.is_json:


            data = request.get_json()
            text_qu = data.get("textQuesstion")
            items = data.get("item_n")
            select_val = data.get("selectsValue")
            quiz_name = data.get("quizName")
            quiz_id = data.get("quiz_id")
            session["quiz_id"] = quiz_id
            quiz_id_for_scor = session.get("quiz_scor")
            quiz_id += "-" + str(quiz_id_for_scor) + str(random.randint(1,300)) + "-" + "math"
            session["quiz_id"] = quiz_id
            session["quiz_name"] = quiz_name


            for i in range(len(text_qu)) :
                for txt in text_qu:

                    n = 1
                    cur.execute(
                        "INSERT INTO question (quiz_id, question, option_1, option_2, option_3, option_4, true_option) VALUES (?, ?, ?, ?, ?, ?, ?)",
                        (quiz_id, txt, "s", "s", "s", "s", "s"))


                    for item in items:
                        item = item.replace("×" , "")
                        item = item.replace("\n" , "")
                        cur.execute(f"UPDATE question SET option_{n} = ? WHERE question = ?", (item, txt))
                        n += 1
                        if n == 5:
                            break



                    for v in select_val:
                        cur.execute("UPDATE question SET true_option = ? WHERE question = ?", (v, txt))
                        break



                    items = items[4:]
                    select_val = select_val[1:]
                    text_qu = text_qu[1:]


            
            username = session.get("password_login")
            cur1.execute("UPDATE users SET quiz_id = ? WHERE username = ?",(quiz_id,username))
            conn.commit()
        

        return redirect(url_for("setting"))




@app.route("/quiz/student/<quiz_id>" ,  methods=['GET', 'POST'])
def quiz(quiz_id):

    enter_quiz = session.get('enter_quiz' , None)

    if enter_quiz == quiz_id:
        return redirect(url_for('end_page'))


    try :
        cur.execute("SELECT * FROM users WHERE quiz_id = ?",(quiz_id,))
        user = cur.fetchone()

        user_info = []

        for usr in user :
            user_info.append(usr)

        if user_info[6] <= 0 :
            return redirect(url_for("border"))


        cur.execute("SELECT * FROM question WHERE quiz_id = ?", (quiz_id,))
        questions = cur.fetchall()

        cur.execute("SELECT * FROM quiz WHERE quiz_id = ?", (quiz_id,))
        quiz = cur.fetchone()


        quiz_list = []

        for quiz_item in quiz :
            quiz_list.append(quiz_item)

        ques = []

        for q in questions:
            ques.append(list(q))
    except :
        return "هیچ آزمونی وجود ندارد ."
    


    if request.method == "POST" :
        if request.is_json:
            d = request.get_json()
            radio_list = d.get("radioList")
            name_s = d.get("nameS")
            window_url = d.get("windowURL")
            error = d.get("error")



            session['enter_quiz'] = quiz_id


            cur.execute("SELECT true_option FROM question WHERE quiz_id = ?", (quiz_id,))
            true_option = cur.fetchall()

            true_op = []

            for t in true_option :
                true_op.append(list(t))


            l = []

            for i in true_op :
                l.append(i[0])

            s = 0
            a = 0
            k = 0

            for t in l:
                if t in radio_list:
                    s += 1
                else:
                    k += 1

                a += 1



            cur.execute("UPDATE number_true FROM students WHERE name = ?",(name_s,))

            cur.execute("INSERT INTO students (name , score , nFalseItem, quiz_id , all_score , error , number_true) VALUES (? , ? , ? , ? , ? , ? , ?)", (name_s, s, k, window_url , a, error , s))
            conn.commit()


            user_info[7] -= 1
            cur.execute("UPDATE users SET number_student = ? WHERE quiz_id = ?",(user_info[7],quiz_id))


            return redirect(url_for("end_page"))



    return render_template("index.html", ques = ques, quiz_list = quiz_list)



@app.route("/quiz/student/<quiz_id>/math" ,  methods=['GET', 'POST'])
def quiz_math(quiz_id):

    enter_quiz = session.get('enter_quiz')

    if enter_quiz == quiz_id:
        return redirect(url_for('end_page'))

    try :
        cur.execute("SELECT * FROM users WHERE quiz_id = ?",(quiz_id,))
        user = cur.fetchone()

        user_info = []

        for usr in user :
            user_info.append(usr)


        if user_info[7] <= 0 :
            return redirect(url_for("border"))

        cur2.execute("SELECT * FROM question WHERE quiz_id = ?", (quiz_id,))
        questions = cur2.fetchall()

        cur.execute("SELECT * FROM quiz WHERE quiz_id = ?", (quiz_id,))
        quiz = cur.fetchone()


        

        quiz_list = []

        for quiz_item in quiz :
            quiz_list.append(quiz_item)



        ques = []

        for q in questions:
            ques.append(q)

    except :
        return "هیچ آزمونی وجود ندارد ."



    if request.method == "POST" :
        if request.is_json:
            da = request.get_json()
            radio_list = da.get("radioList")
            name_s = da.get("nameS")
            window_url = da.get("windowURL")
            error = da.get("error")


            
            session['enter_quiz'] = quiz_id


            cur.execute("SELECT true_option FROM question WHERE quiz_id = ?", (quiz_id,))
            true_option = cur.fetchall()

            true_op = []

            for t in true_option :
                true_op.append(list(t))


            l = []

            for i in true_op :
                l.append(i[0])

            s = 0
            a = 0
            k = 0

            for t in l:
                if t in radio_list:
                    s += 1
                else:
                    k += 1

                a += 1

            cur.execute("INSERT INTO students (name , score , nFalseItem, quiz_id , all_score , error) VALUES (? , ? , ? , ? , ? , ?)", (name_s, s, k, window_url , a , error))
            conn.commit()


            user_info[7] -= 1
            cur.execute("UPDATE users SET number_student = ? WHERE quiz_id = ?",(user_info[7],quiz_id))


            return redirect(url_for("end_page"))


    return render_template("index-1.html", ques = ques , quiz_list = quiz_list)


@app.route("/quiz/setting", methods=['GET', 'POST'])
def setting() :

    if request.method == "POST" :
        if request.is_json :
            data = request.get_json()

            startyear = int(data.get("startyear"))
            startmonth = int(data.get("startmonth"))
            startday = int(data.get("startday"))
            starthur = int(data.get("starthur"))
            startmin = int(data.get("startmin"))

            endyear = int(data.get("endyear"))
            endmonth = int(data.get("endmonth"))
            endday = int(data.get("endday"))
            endhur = int(data.get("endhur"))
            endmin = int(data.get("endmin"))

            time = data.get("time")

            quiz_name = session.get("quiz_name")            
            quiz_id = session.get("quiz_id")
            



            satrttime = JalaliDatetime(startyear, startmonth, startday, starthur, startmin, 0, 0).todatetime()
            endtime = JalaliDatetime(endyear, endmonth, endday, endhur, endmin, 0, 0).todatetime()
            

            cur.execute("SELECT * FROM quiz WHERE quiz_id = ?",(quiz_id,))
            is_quiz = cur.fetchone()

            if is_quiz :
                cur.execute("DELETE FROM quiz WHERE quiz_id = ?",(quiz_id,))
                conn.commit()

            cur.execute("INSERT INTO quiz (name, quiz_id, starttime, endtime, time) VALUES (?, ?, ?, ?, ?)", (quiz_name,quiz_id,satrttime, endtime, time))
            conn.commit()

            username = session.get("password_login")

            cur.execute("UPDATE users SET quiz_id = ? WHERE username = ?",(quiz_id,username))
            conn.commit()


            cur.execute("SELECT * FROM users WHERE username = ?",(username,))
            user = cur.fetchone()
            
            info =[]

            for info_user in user :
                info.append(info_user)

            if info[6] > 0 :
                info[6] -= 1

            cur.execute("UPDATE users SET number_quiz = ? WHERE username = ?",(info[6],username))
            conn.commit()

            return redirect("/end_page")

            
    return render_template("setting.html")



@app.route("/end-page")
def end_page () :
    quiz_id = session.get("quiz_id")
    r = ""
    if "math" in str(quiz_id) :
        r = "/math"
    return render_template("end.html" , quiz_id = quiz_id , r = r)



@app.route("/score/<quiz_pass>")
def score(quiz_pass):

    if session.get("password_login" , None) == None :
        return render_template("not-signed.html")
    else :
        if quiz_pass == session.get("quiz_id") :
            cur.execute("SELECT * FROM students")
            students = cur.fetchall()


            student = []

            for st in students:
                student.append(list(st))


            return render_template("scores.html", student = student)
        return render_template("scores.html")



@app.route("/upload",methods = ['POST'])
def upload():
    if request.method == "POST" :
        if 'pdf_file' not in request.files:
            return "فایل آپلود نشده ."
        
        file = request.files['pdf_file']


        if file.filename == "" or not file.filename.endswith('.pdf') :
            return "نام فایل معتبر نیست ."
        
        if file :

            pdf_file_by = io.BytesIO(file.read())
            word_file_by = io.BytesIO()

            pdf_file_by.seek(0, 2)
            file_size = pdf_file_by.tell()
            file_size = (int(file_size) / 1024) / 1024
            pdf_file_by.seek(0)

            if file_size < 4 :

                    try :

                        temp_pdf = os.path.join('',"input.pdf")
                        temp_word = os.path.join('',"output.docx")

                        with open(temp_pdf, 'wb') as f:
                            f.write(pdf_file_by.getbuffer())

                        
                        cv = Converter(temp_pdf)
                        cv.convert(temp_word, start=0, end=-1)
                        cv.close()

                        with open(temp_word, 'rb') as f:
                            word_file_by.write(f.read())

                        word_file_by.seek(0)

                        return send_file(
                            word_file_by,
                            mimetype='application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                            as_attachment=True,
                            download_name='tich-azmoon_document.docx'
                        )

                    finally :

                        if os.path.exists("input.pdf"):
                            os.remove("input.pdf")
                        if os.path.exists("output.docx"):
                            os.remove("output.docx")
                    
            else :
                return "حجم فایل زیاد است ."
    return "ok"
    

@app.route("/convert")
def convert():
    return render_template("convert.html")


@app.route("/pdf")
def pdf ():
    cur.execute("SELECT * FROM question")
    test = cur.fetchall()
    return render_template("pdf.html" , test = test)


if __name__ == ("__main__"):
    app.run(debug = True)