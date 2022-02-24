// 아이디 유효성 검사
function checkValid(check) {
    var str = check;
//문자열에 공백이 있는 경우
    var blank_pattern = /[\s]/g;
    if (blank_pattern.test(str) == true) {
        alert('공백이 입력되었습니다.');
        str = null;
    }
//특수문자가 있는 경우
    var special_pattern = /[`~!@#$%^&*|\\\'\";:\/?]/gi;
    if (special_pattern.test(str) == true) {
        alert('특수문자가 입력되었습니다.');
        str = null;
    }
// 아이디가 너무 짧거나 긴 경우 (4 ~ 15)
    var id_length = /^[a-zA-z0-9]{4,15}$/;
    if (!id_length.test(str)) {
        alert("아이디는 영문/숫자 4~15 자리 내로 입력해야합니다.")
        str = null;
    }

    if (str === null) {
        return false;
    } else {
        return true;
    }
}

function checkPasswordValid(check) {
    var str = check;
//문자열에 공백이 있는 경우
    var blank_pattern = /[\s]/g;
    if (blank_pattern.test(str) == true) {
        alert('공백이 입력되었습니다.');
        str = null;
    }
// 비밀번호가 너무 짧거나 긴 경우 (8 ~ 20)
    var id_length = /^[a-zA-z0-9]{8,15}$/;
    if (!id_length.test(str)) {
        alert("비밀번호는 문자/숫자/특수문자의 8~20 자리 내로 입력해야합니다.")
        str = null;
    }

    if (str === null) {
        return false;
    } else {
        return true;
    }
}


function checkId() {
    const checkId = $('#userId').val()
    const isValid = checkValid(checkId)
    if (!isValid) return;

    $.ajax({
        type: 'POST',
        url: '/register/checkDup',
        data: {id_give: checkId},
        success: function (response) {
            const showText = document.getElementById("checkDuplicate")
            $('#checkDuplicate').text(response['msg']);
            if (response['msg'] !== "이미 존재하는 아이디 입니다!!") {
                // 아이디 중복확인 후 비밀번호로 포커스 이동
                $('#userPassword').focus()
            }
        }
    });
}

function checkPassword() {

    const firstPassword = $('#userPassword').val()
    const secondPassword = $('#checkPassword').val()

    const isValid = checkPasswordValid(firstPassword)
    if (!isValid) {
        // 비밀번호 유효성검사에 걸러졌을때, 값을 비우고 다시 커서 옮김
        $('#userPassword').val("")
        $('#checkPassword').val("")
        $('#userPassword').focus();
        return;
    }

    if (firstPassword === secondPassword) {
        // "비밀번호가 일치합니다" 메세지 보이게하기
        const showText = document.getElementById("checkSamePassword")
        showText.style.visibility = "visible";

        // 더이상 수정하지 못하게 readonly 속성 주기
        $('#userPassword').attr("readonly", true)
        $('#checkPassword').attr("readonly", true)
        $('#userPassword').css({"color": "#d3d3d3"})
        $('#checkPassword').css({"color": "#d3d3d3"})

        // 나이로 포커스 옮김
        $('#userAge').focus()
    } else {
        // 비밀번호와 비밀번호확인이 일치하지않을때, 알럿 띄운 후 비밀번호확인 값을 비우고 다시 포커스
        alert("일치하지 않습니다!")
        $('#checkPassword').val("");
        $('#checkPassword').focus();
    }
}

// 회원가입 버튼 클릭
function register() {
    const userId = $('#userId').val()
    const userPassword = $('#userPassword').val()  // 비밀번호 해쉬 암호화 필요
    const userAge = $('#userAge').val()
    const userNickname = $('#userNickname').val()

    // 닉네임에 값을 넣지 않았을때
    if (userNickname === "") {
        alert("닉네임을 입력하세요!")
        $('#userNickname').focus();
        return;
    }
    // 나이의 값이 비어있을때
    if (userAge === "") {
        alert("나이를 입력하세요!")
        $('#userAge').focus();
        return;
    }

    $.ajax({
        type: "POST",
        url: "/register/insertDB",
        data: {id_give: userId, password_give: userPassword, age_give: userAge, nickname_give: userNickname},
        success: function (response) {
            alert(response['msg'])

            // 로그인 페이지로 이동
            window.location.href = 'login'
        }
    })

}