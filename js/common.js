// 인증코드 받기 타이머::S //
var initial = 60;
var flag = true;
var flag1 = true;
var cord_result;

function timer1() {
    // 초를 00 으로 만들기 :: S //
    var seconds = initial % 70;
    if (seconds < 10) {
        seconds = '0' + initial % 70;
    }
    // 초를 00 으로 만들기 :: E //

    // 제한시간 표시하기 스타일링 //
    $('.limit_time').text(Math.floor(initial / 70) + ':' + seconds);
    initial -= 1;
    if (initial == -1) {
        clearInterval(tid);
        alert('시간이 초과되었습니다.')
        location.reload();
    }
}
$(document).ready(function () {
    // 인증코드 받기 클릭시 //
    $('.cord_btn').on('click', function () {

        /*
        // 휴대폰 번호 정규식 :: S//
        var ph1 = $('#ph1').val();
        var regExp = /^01[016]\d{3,4}\d{4}$/;
        var test = regExp.test(ph1);
        // 휴대폰 번호 정규식 :: E //
        
        // 휴대폰 번호 미입력시 or 잘못입력시에 인증코드받기 안되게 하기 //
        if ($('#ph1').val() == '' || !test) {
            return false;
        } else {
            $('.cord_btn').css({ 'background-color': 'gold' });
            $('.ph_txt1').css({ 'display': 'none' });
        }
        */

        // 이메일 정규식 :: S//
        var em1 = $('#em1').val();
        var regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i
        var test = regExp.test(em1);
        // 이메일 정규식 :: E //

        // 이메일 미입력시 or 잘못입력시에 인증코드받기 안되게 하기 //
        if (em1 == '' || !test) {
            alert('올바르지않은 이메일 형식입니다.');
            return false;
        } else {
            $('.ph_txt1').css({ 'display': 'none' });
        }


        // 중복 클릭 방지 //
        if (flag) {
            alert($('#em1').val() + '로 메일이 전송되었습니다.');
            timer1();
            tid = setInterval(timer1, 1000);
            setTimeout(function () { flag = true; initial = 60; }, 60000);
            flag = false;
        } else {
            return;
        }
        // 인증코드 번호 생성//
        random = Math.floor(Math.random() * 10000) + 1000;
        if (random >= 10000) {
            random = random - 1000;
        }
        // ajax로 인증번호 전송 //
        if (flag1) {
            setTimeout(function () { flag1 = true }, 60000);
            $.ajax({
                async: true,
                url: '/email/password',
                type: 'post',
                data: {
                    user_email: $('#em1').val(),
                    cord: random
                },
                success: function (result) {
                    cord_result = result;
                }
            })

            flag1 = false;
        } else {
            return;
        }


    })

    // 확인 버튼 클릭시  //
    $('.confirm_btn').on('click', function () {
        if (cord_result != $('#ph2').val()) {
            alert('인증번호가 일치하지 않습니다.');
        } else {
            alert('인증이 되었습니다.');
            auth = true;
            clearInterval(tid);
            $('.limit_time, .cord_btn, .ph_txt2').css({ 'display': 'none' });
        }
    });
    // 가입하기 버튼 누르기전 체크할것들 //
    $('.email_join_btn').on('click', function () {
        var ph1 = $('#ph1').val();
        var ph2 = $('#ph2').val();
        var ph3 = $('#pw1').val();
        var ph4 = $('#pw2').val();
        var ph5 = $('#privacy_agree').prop('checked');
        var ph6 = $('#terms_agree').prop('checked');
        // 이메일 정규식 :: S//
        var em1 = $('#em1').val();
        var regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i
        var test = regExp.test(em1);
        // 이메일 정규식 :: E //
        if (!test) {
            alert('올바르지않은 이메일 형식입니다.');
            return false;
        } else if (ph2 == '') {
            alert('인증코드를 입력하세요');
            return false;
        } else if (ph3 == '') {
            alert('비밀번호를 입력하세요');
            return false;
        } else if (ph4 == '') {
            alert('비밀번호 확인을 입력하세요');
            return false;
        } else if (ph3 != ph4) {
            alert('비밀번호가 일치하지 않습니다.');
            return false;
        } else if (ph3.length < 8 && ph4.length < 8) {
            alert('비밀번호를 8자이상 입력하세요');
            return false;
        } else if (ph5 == false) {
            alert('개인정보 취급방침에 동의해주세요')
            return false;
        } else if (ph6 == false) {
            alert('이용약관에 동의해주세요');
            return false;
        } else if (cord_result != $('#ph2').val()) {
            alert('인증번호가 일치하지 않습니다.');
            return false;
        }

    })
    // 휴대폰번호 로그인시 체크해야할것 //
    $('.submit_btn').on('click', function () {
        var ph1 = $('#phone_ch1').val();
        var ph2 = $('#phone_ch2').val();
        if (ph1 == '') {
            alert('휴대폰번호를 입력하세요')
            return false;
        } else if (ph2 == '') {
            alert('비밀번호를 입력하세요')
            return false;
        }
    })
})
// 인증코드 받기 타이머::E //


// textarea byte 수 계산 :: S //
function bytecheck() {
    var msg = document.getElementsByClassName('limit_text')[0];
    var byte = document.getElementsByClassName('byte_count')[0];
    var num = 0;
    if (msg.value == '') {
        byte.innerHTML = 0;
    }
    for (var i = 0; i < msg.value.length; i++) {
        // 한글일때 2바이트 //
        if (escape(msg.value.charAt(i)).length > 5) {
            $('.byte_count').text(num += 2);

        }
        // 나머지 1바이트 //
        else {
            $('.byte_count').text(num += 1);
        }
        if (byte.innerHTML > 100) {
            msg.value = msg.value.substring(0, i);
            $('.byte_count').text(100);
        }
    }
}
// textarea byte 수 계산 :: E //

// 닉네임 혹은 아이디 혹은 게임을 입력하세요 :: S //

// 게임검색하기 GAMES 전체맴버 친구추가 검색창 //
function search() {
    var search = document.getElementsByClassName('nickname_enter')[0].value;
    var lower = search.toLowerCase();
    var totalmember = document.getElementsByClassName('member_check')[0];
    if (lower == '') {
        $('.swiper-slide-active .member_list .member_list_wrap li').show();
        $('.friend_list li').show();
    }
    else {
        $('.swiper-slide-active .member_list .member_list_wrap li').not('.member_counting').hide();
        $('.friend_list li').hide();
        $('.swiper-slide-active .member_list .member_list_wrap li:contains("' + lower + '")').show();
        $('.friend_list li:contains("' + lower + '")').show();
    }
}
// 게임검색하기 GUILDS 검색창 //
function search2() {
    var search = document.getElementsByClassName('nickname_enter')[1].value;
    var lower = search.toLowerCase();
    if (lower == '') {
        $('.swiper-slide-active .member_list .member_list_wrap li').show();
    }
    else {
        $('.swiper-slide-active .member_list .member_list_wrap li').hide();
        $('.swiper-slide-active .member_list .member_list_wrap li:contains("' + lower + '")').show();
    }
}
// 게임검색하기 USERS 검색창 //
function search3() {
    var search = document.getElementsByClassName('nickname_enter')[2].value;
    var lower = search.toLowerCase();
    if (lower == '') {
        $('.swiper-slide-active .member_list .member_list_wrap li').show();
    }
    else {
        $('.swiper-slide-active .member_list .member_list_wrap li').hide();
        $('.swiper-slide-active .member_list .member_list_wrap li:contains("' + lower + '")').show();
    }
}
// 영구추방 내길드 검색창 //
function search1() {
    var search = document.getElementById('spc_search').value;
    var lower = search.toLowerCase();
    var totalmember1 = document.getElementsByClassName('member_check1')[0];
    if (lower == '') {
        $('.member_list1 .member_list_wrap li').not('.member_counting').show();
    }
    else {
        $('.member_list1 .member_list_wrap li').not('.member_counting').hide();
        $('.member_list1 .member_list_wrap li:contains("' + lower + '")').not('.member_counting').show();
    }
}
// 닉네임 혹은 아이디 혹은 게임을 입력하세요 :: E //


// 닉네임 최대 한글 10자, 영문20자, 숫자혼용가능 :: S //
function nick() {
    var regExp = /^[가-힣]{1,10}$/;
    var regExp1 = /^[a-zA-Z0-9]{1,20}/;
    var name = document.getElementsByClassName('nick')[0].value;
    var txt1 = document.getElementsByClassName('txt1')[0];
    var txt2 = document.getElementsByClassName('txt2')[0];
    var test = regExp.test(name);
    var test1 = regExp1.test(name);
    if ((test && name.length < 11) || (test1 && name.length < 21)) {
        txt1.style.display = 'block';
        txt2.style.display = 'none';
    } else {
        txt1.style.display = 'none';
        txt2.style.display = 'block';
        if (name == '') {
            txt1.style.display = 'none';
            txt2.style.display = 'none';
        }
        if (name.length > 10) {
            name = name.substring(0, 10);
        }
    }
}
// 닉네임 최대 한글 10자, 영문20자, 숫자혼용가능 :: E //

// on/off 이미지 바뀜 //
var flag = true;
function onoff() {
    var onoff = document.getElementsByClassName('onoff')[0];
    if (flag) {
        onoff.setAttribute('src', 'images/btn_off.png');
        flag = false;
    } else {
        onoff.setAttribute('src', 'images/btn_on.png');
        flag = true;
    }
}

$(document).ready(function () {
    // 체크박스 오로지 한개만 선택 :: S // 
    $('label[name="only"]').on('click', function () {
        var index = $('label[name="only"]').index(this);
        $('input[value="' + index + '"]').prop({ 'checked': true })
        $('input[type="checkbox"]').not($('input[value="' + index + '"]')).prop({ 'checked': false });
    })
    $('label[name="only"]').on('click', function () {
        return false;
    })
    // 체크박스 오로지 한개만 선택 :: E //

    // 휴대폰번호 확인 :: S //
    $('#ph1').on('blur', function () {
        var ph1 = $('#ph1').val();
        var ph2 = $('#ph2').val();
        // 휴대폰 번호 정규식 :: S//
        var regExp = /^01[016]\d{3,4}\d{4}$/;
        var test = regExp.test(ph1);
        if (test) {
            $('.ph_txt3').css({ 'display': 'none' });
        } else {
            $('.ph_txt3').css({ 'display': 'block' });
        }
        // 휴대폰 번호 정규식 :: E //
        if (ph1 == '') {
            $('.ph_txt1').css({ 'display': 'block' });
            $('.ph_txt3').css({ 'display': 'none' });
        } else {
            $('.ph_txt1').css({ 'display': 'none' });
        }
    })
    // 휴대폰번호 확인 :: E //

    // 비밀번호 확인 :: S//
    $('#pw1').on('blur', function () {
        var pw1 = $('#pw1').val();
        var pw2 = $('#pw2').val();
        if (pw1 == '') {
            $('.pw_txt1').css({ 'display': 'block' });
        } else {
            $('.pw_txt1').css({ 'display': 'none' });
        }
        if (pw1.length > 0 && pw1.length < 8) {
            $('.pw_txt2').css({ 'display': 'block' });
        } else {
            $('.pw_txt2').css({ 'display': 'none' });
        }
    })
    $('#pw2').on('blur', function () {
        var pw1 = $('#pw1').val();
        var pw2 = $('#pw2').val();

        if (pw1 !== pw2) {
            $('.pw_txt3').css({ 'display': 'block' });
        } else {
            $('.pw_txt3').css({ 'display': 'none' });
        }
    })
    // 비밀번호 확인 :: E //

    // 인증코드 확인 :: S //
    $('#ph2').on('blur', function () {
        var ph2 = $('#ph2').val();
        if (ph2 == '') {
            $('.ph_txt4').css({ 'display': 'block' });
        } else {
            $('.ph_txt4').css({ 'display': 'none' });
        }
    })
    // 인증코드 확인 :: E //
})

// 메뉴창 //

function menu() {
    $('.menu_wrap').stop().animate({ 'right': 0 }, 300);
    $('body').prepend("<div class = 'mask'></div>");
    $('.mask').css({
        'position': 'fixed',
        'top': 0,
        'left': 0,
        'width': '100%',
        'height': '100%',
        'background': 'rgba(0,0,0,0.8)',
        'z-index': 2
    })
    $(document).on('click', '.mask', function () {
        $('.menu_wrap').stop().animate({ 'right': '-51%' }, 300);
        $('.mask').remove();
    })
}
//닫기//
function disappear() {
    $('.menu_wrap').stop().animate({ 'right': '-51%' }, 300);
    $('.mask').remove();
}
//즐겨찾기 추가//
var chk = true;
var flag = true;
function add() {
    if (flag) {
        flag = false;
        var w = $(window).width();
        var h = $(window).height();
        $('body').prepend("<div class='bookmark_add' style='width:100%'>즐겨찾기추가 처리되었습니다.</div>")
        $('.a1').html('즐겨찾기해제<span>></span>');
        var w1 = $('.bookmark_add').width();
        var h1 = $('.bookmark_add').height();
        $('.bookmark_add').css({
            'position': 'fixed',
            'line-height': '308%',
            'font-size': '1.3rem',
            'z-index': 3,
            'text-align': 'center',
            'color': 'white',
            'background': 'rgba(0,0,0,0.6)',
            'top': (h - h1) / 2,
            'left': (w - w1) / 2
        })
        if (chk) {
            chk = false;
        } else {
            $('.a1').html('즐겨찾기추가<span>></span>');
            $('.bookmark_add').text('즐겨찾기해제 처리되었습니다.');
            chk = true;
        }
        setTimeout(function () { $('.bookmark_add').remove(); flag = true; }, 3000);
    } else {

        return;
    }
}

// 길드검색어 추가 //
function searchWord() {
    var va = document.getElementsByClassName('search_w')[0].value;
    var add = document.getElementsByClassName('closing_box')[0];
    var node = document.createElement('li');
    var cou = document.getElementsByClassName('cou')[0];
    // 추가된 검색어 //
    if (va == '') {
        alert('내용을 입력하세요');
        return;
    } else {
        node.innerHTML = '<a href="#">' + va + '</a><img src="images/ico-del.png" alt="닫기" title="닫기" class="arrow_ico del">'
        add.appendChild(node)
    }
    document.getElementsByClassName('search_w')[0].value = '';
    // 등록된 검색어 개수 //
    cou.innerHTML = $('.closing_box li').not('.ex').length + '개';
}
// 검색어 삭제 //
$(document).ready(function () {
    $(document).on('click', '.del', function () {
        var cou = document.getElementsByClassName('cou')[0];
        $(this).parent().remove();
        cou.innerHTML = $('.closing_box li').not('.ex').length + '개';
        return false;
    })
})

// textarea 글자수 제한 //
function limit() {
    var v = document.getElementsByClassName('conversation_name')[0];
    var d = v.value;
    var l = d.length;
    if (l > 60) {
        document.getElementsByClassName('conversation_name')[0].value = document.getElementsByClassName('conversation_name')[0].value.substring(0, 60);
    }
}
// 나의 친구수 실시간 계산 :: S  //
// memberlist1인경우 //
function cal1(counting) {
    var list1 = $('.member_list .member_list_wrap li').not('.member_counting').filter(function () {
        return $(this).css('display') != 'none';
    })
    counting.innerHTML = list1.length;
}
// memberlist2인경우 //
function cal(counting) {
    var list1 = $('.member_list1 .member_list_wrap li').not('.member_counting').filter(function () {
        return $(this).css('display') != 'none';
    })
    counting.innerHTML = list1.length;
}
// 나의 친구수 실시간 계산 :: E  //

//이전 페이지 이동//
function back() {
    history.back(-1)
}

// 준비중입니다 //
var flag = true;
function preparing() {
    var w = $(window).width();
    var h = $(window).height();
    if (flag) {
        flag = false;
        $('body').prepend("<div class='prepare' style='width:100%'>준비중입니다.</div>")
        var w1 = $('.prepare').width();
        var h1 = $('.prepare').height();
        $('.prepare').css({
            'position': 'fixed',
            'line-height': '308%',
            'font-size': '1.3rem',
            'z-index': 3,
            'text-align': 'center',
            'color': 'white',
            'background': 'rgba(0,0,0,0.8)',
            'top': (h - h1) / 2,
            'left': (w - w1) / 2
        })
        setTimeout(function () { flag = true }, 3000);
    } else {
        return;
    }
    setTimeout(function () { $('.prepare').remove(); flag = true; }, 3000);
}
// 내프로필 클릭시 //
function profile() {
    $('body').prepend("<div class = 'mask'><div class = 'modify'><h1>염세중</h1><ul class = modify_list><li><a href ='profile_modify.html'><span>프로필 편집</span></a></li></ul></div></div>");
    $('.mask').css({
        'position': 'fixed',
        'top': 0,
        'left': 0,
        'width': '100%',
        'height': '100%',
        'background': 'rgba(0,0,0,0.8)',
        'z-index': 3
    })
    $('.modify').css({
        'position': 'fixed',
        'display': 'table',
        'max-width': '768px',
        'width': '80%',
        'padding': '4%',
        'box-sizing': 'border-box',
        'top': 0,
        'left': 0,
        'right': 0,
        'bottom': 0,
        'margin': 'auto',
        'background': 'white',
        'z-index': 4,
        'border-radius': '15px'
    })
    $(document).on('click', '.mask', function () {
        $('.mask, .modify').remove();
    })
}
// 즐겨찾기 친구 클릭시
function profile1() {
    $('body').prepend("<div class = 'mask'><div class = 'modify'><h1>염세중</h1><ul class = modify_list><li><a href ='#'><span>즐겨찾기 해제</span></a></li><li><a href ='#'><span>숨김</span></a></li><li><a href ='#'><span>차단</span></a></li></ul></div></div>");
    $('.mask').css({
        'position': 'fixed',
        'top': 0,
        'left': 0,
        'width': '100%',
        'height': '100%',
        'background': 'rgba(0,0,0,0.8)',
        'z-index': 3
    })
    $('.modify').css({
        'position': 'fixed',
        'display': 'table',
        'max-width': '768px',
        'width': '80%',
        'padding': '4%',
        'box-sizing': 'border-box',
        'top': 0,
        'left': 0,
        'right': 0,
        'bottom': 0,
        'margin': 'auto',
        'background': 'white',
        'z-index': 4,
        'border-radius': '15px'
    })
    $(document).on('click', '.mask', function () {
        $('.mask, .modify').remove();
    })
}

// 내 친구 클릭시
function profile2() {
    $('body').prepend("<div class = 'mask'><div class = 'modify'><h1>염세중</h1><ul class = modify_list><li><a href ='#'><span>즐겨찾기에 추가</span></a></li><li><a href ='#'><span>숨김</span></a></li><li><a href ='#'><span>차단</span></a></li></ul></div></div>");
    $('.mask').css({
        'position': 'fixed',
        'top': 0,
        'left': 0,
        'width': '100%',
        'height': '100%',
        'background': 'rgba(0,0,0,0.8)',
        'z-index': 3
    })
    $('.modify').css({
        'position': 'fixed',
        'display': 'table',
        'max-width': '768px',
        'width': '80%',
        'padding': '4%',
        'box-sizing': 'border-box',
        'top': 0,
        'left': 0,
        'right': 0,
        'bottom': 0,
        'margin': 'auto',
        'background': 'white',
        'z-index': 4,
        'border-radius': '15px'
    })
    $(document).on('click', '.mask', function () {
        $('.mask, .modify').remove();
    })
}

// 채팅방 클릭시
function chat1() {
    $('body').prepend("<div class = 'mask'><div class = 'modify'><h1>염세중</h1><ul class = modify_list><li><a href ='#'><span>즐겨찾기 추가</span></a></li><li><a href ='#'><span>채팅방 상단 고정</span></a></li><li class= 'alarm_off'><a href ='#'><span>채팅방 알림 끄기</span></a></li><li><a href ='#'><span>홈 화면에 바로가기 추가</span></a></li><li><a href ='#'><span>나가기</span></a></li></ul></div></div>");
    $('.mask').css({
        'position': 'fixed',
        'top': 0,
        'left': 0,
        'width': '100%',
        'height': '100%',
        'background': 'rgba(0,0,0,0.8)',
        'z-index': 3
    })
    $('.modify').css({
        'position': 'fixed',
        'display': 'table',
        'max-width': '768px',
        'width': '80%',
        'padding': '3%',
        'box-sizing': 'border-box',
        'top': 0,
        'left': 0,
        'right': 0,
        'bottom': 0,
        'margin': 'auto',
        'background': 'white',
        'z-index': 4,
        'border-radius': '15px'
    })
    $(document).on('click', '.mask', function () {
        $('.mask, .modify').remove();
    })
}
function chat2() {
    $('body').prepend("<div class = 'mask'><div class = 'modify'><h1>염세중</h1><ul class = modify_list><li><a href ='#'><span>즐겨찾기 해제</span></a></li><li><a href ='#'><span>채팅방 상단 고정 해제</span></a></li><li class = 'alarm_on'><a href ='#'><span>채팅방 알림 켜기</span></a></li><li><a href ='#'><span>홈 화면에 바로가기 추가</span></a></li><li><a href ='#'><span>나가기</span></a></li></ul></div></div>");
    $('.mask').css({
        'position': 'fixed',
        'top': 0,
        'left': 0,
        'width': '100%',
        'height': '100%',
        'background': 'rgba(0,0,0,0.8)',
        'z-index': 3
    })
    $('.modify').css({
        'position': 'fixed',
        'display': 'table',
        'max-width': '768px',
        'width': '80%',
        'padding': '3%',
        'box-sizing': 'border-box',
        'top': 0,
        'left': 0,
        'right': 0,
        'bottom': 0,
        'margin': 'auto',
        'background': 'white',
        'z-index': 4,
        'border-radius': '15px'
    })
    $(document).on('click', '.mask', function () {
        $('.mask, .modify').remove();
    })
}
// 채팅방 순서 정렬
function chat3() {
    $('body').prepend("<div class='mask'></div>");
    $('body').prepend("<div class = 'modify'><h1>채팅방 순서 정렬</h1><ul class = modify_list><li><input type='checkbox' id='mobile'checked=''><label for='mobile' name='mode1' value=0>최신 순<span class='chk1 circle_chk'></span></label></li><li><input type='checkbox'  id='mobile1'><label for='mobile1' name='mode1' value=1>안 읽은 순<span class='chk1 circle_chk'></span></label></li></ul></div>");
    $('.mask').css({
        'position': 'fixed',
        'top': 0,
        'left': 0,
        'width': '100%',
        'height': '100%',
        'background': 'rgba(0,0,0,0.8)',
        'z-index': 3
    })
    $('.modify').css({
        'position': 'fixed',
        'display': 'table',
        'max-width': '768px',
        'width': '80%',
        'padding': '3%',
        'box-sizing': 'border-box',
        'top': 0,
        'left': 0,
        'right': 0,
        'bottom': 0,
        'margin': 'auto',
        'background': 'white',
        'z-index': 4,
        'border-radius': '15px'
    })
    $('label').css({
        'display': 'block',
        'font-size': '1.5rem',
        'line-height': '137%'
    })
    $(document).on('click', 'label[name="mode1"]', function () {
        var a = $('label[name="mode1"]').index(this);
        $(this).prev().prop({ 'checked': true })
        $('label[name="mode1"]').not($('label[value="' + a + '"]')).prev().prop({ 'checked': false })
        return false;
    })
    $(document).on('click', '.mask', function () {
        $('.mask, .modify').remove();
    })

}
// 로딩시 이미지 //
window.onload = function () {
    $('.loading').hide();
}





