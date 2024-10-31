async function sendMessage() {
    const message = document.getElementById("chatInput").value.trim();
    const messagesContainer = document.getElementById("messages-container");

    // Verifica se o campo de mensagem está vazio
    if (message === "") { return; }

    // Remove a mensagem inicial se ela existir
    const mensagemInicial = document.getElementById("inicial-message");
    if (mensagemInicial) {
        mensagemInicial.remove();
    }

    // Altera o CSS do chat para mostrar a mensagem do usuário
    messagesContainer.style.gap = "5px";
    messagesContainer.style.padding = "20px";
    messagesContainer.style.width = "100%";
    messagesContainer.style.height = "100%";

    // Cria um novo elemento para a mensagem do usuário
    const userMessageDiv = document.createElement("div");
    const userMessage = document.createElement("div");
    userMessage.textContent = message;

    userMessageDiv.classList.add("message-div");
    userMessageDiv.style.justifyContent = "flex-end";
    userMessage.classList.add("sent-message");

    userMessageDiv.appendChild(userMessage);
    messagesContainer.appendChild(userMessageDiv);

    // Rola para a parte inferior do chat body
    const chatBody = document.querySelector(".chat-body");
    chatBody.scrollTop = chatBody.scrollHeight;

    // Limpa o campo de input após enviar a mensagem
    document.getElementById("chatInput").value = "";

    try {
        const response = await fetch('http://localhost:5000/api/data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ consulta: message }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Cria o elemento para a resposta do chatbot e insere o HTML gerado
        const botResponseDiv = document.createElement("div");
        const botResponse = document.createElement("div");

        botResponse.innerHTML = data.response; // Usa o HTML convertido
        botResponseDiv.classList.add("message-div");
        botResponse.classList.add("received-message");

        botResponseDiv.appendChild(botResponse);
        messagesContainer.appendChild(botResponseDiv);

        // Rola para a parte inferior do chat
        chatBody.scrollTop = chatBody.scrollHeight;
    } catch (error) {
        console.error('Error:', error); // Log de erro no console
        const errorMessageDiv = document.createElement("div");
        errorMessageDiv.textContent = "Ocorreu um erro ao enviar a mensagem.";
        errorMessageDiv.classList.add("error-message"); // Adicionando uma classe para estilização
        messagesContainer.appendChild(errorMessageDiv);

        // Rola para a parte inferior do chat body
        chatBody.scrollTop = chatBody.scrollHeight;
    }
}


document.getElementById("chatInput").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        sendMessage(); // Chama a função para enviar a mensagem
        event.preventDefault(); // Evita que uma nova linha seja inserida
    }
});

var animationAudioIndicator;

$(function () {
    $('header .navbar-toggler').click(function () {
        $('.menu-wrapper').toggleClass('active');
        $(this).toggleClass('active');
        //$('header').removeClass('dark-bg');
        //$('header').removeClass('nav-up').addClass('nav-down');

    });

    var animationLoading = bodymovin.loadAnimation({
        // animationData: { /* ... */ },
        container: document.getElementById('loadingDiv'), // required
        path: '/js/json/jdloading.json', // required
        renderer: 'svg', // required
        loop: true, // optional
        autoplay: true, // optional
        name: "Johnny Days Loading Animation", // optional
    });
    setTimeout(function () {
        $('.loading-wrap').fadeOut(300);

        //AOS.init({
        //    once: true
        //});
    }, 2000);

    //audios em geral
    //setOuvirClicks();

    animationAudioIndicator = bodymovin.loadAnimation({
        // animationData: { /* ... */ },
        container: $('.audio-indicator-wrapper')[0], // required
        path: '/js/json/waves.json', // required
        renderer: 'svg', // required
        loop: true, // optional
        autoplay: false, // optional
        name: "Johnny Days Waves Animation", // optional
    });



    //mute / unmute (na verdade é pause / desabilitar audio)
    $('.audio-indicator-wrapper').click(function () {
        if ($(this).hasClass('playing')) {
            $(this).removeClass('playing');
        }

        $(this).toggleClass('muted');
        if ($(this).hasClass('muted')) {
            $('.ouvir-btn.active').click();
            $('.ouvir-tl-btn.active').click();

        }
    });

    //$('#ContatoForm .form-control').on('blur', function () {
    //    $('#ContatoForm .form-control').each(function () {

    //        if ($(this).val && $(this).val.length > 0) {
    //            $(this).addClass('valid');
    //            $(this).removeClass('invalid');

    //        }
    //        else {
    //            $(this).removeClass('valid');
    //            $(this).addClass('invalid');
    //        }

    //    });
    //});

    $('.form-control').on('change blur', function () {
        if ($(this).attr('required')) {
            if ($(this).hasClass('contatoEmail')) {
                var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if (!re.test(String($('.contatoEmail').val()).toLowerCase())) {
                    $('.contatoEmail').addClass('is-invalid');
                    $('.contatoEmail').removeClass('is-valid');
                }
                else {
                    $('.contatoEmail').removeClass('is-invalid');
                    $('.contatoEmail').addClass('is-valid');
                }
            }
            else {
                if ($(this).val().length > 0) {
                    $(this).removeClass('is-invalid');
                    $(this).addClass('is-valid');
                }
                else {
                    $(this).addClass('is-invalid');
                    $(this).removeClass('is-valid');
                }
            }
        }
        else {
            $(this).addClass('is-valid');

        }
        $(this).parent().removeClass('focused');

    });

    $('#ContatoForm input[name=Nome]').on('change invalid', function () {
        var textfield = $(this).get(0);

        // 'setCustomValidity not only sets the message, but also marks
        // the field as invalid. In order to see whether the field really is
        // invalid, we have to remove the message first
        textfield.setCustomValidity('');

        if (!textfield.validity.valid) {
            textfield.setCustomValidity('"Nome" é um campo obrigatório.');
        }
    });
    $('#ContatoForm input[name=Email]').on('change invalid', function () {
        var textfield = $(this).get(0);

        // 'setCustomValidity not only sets the message, but also marks
        // the field as invalid. In order to see whether the field really is
        // invalid, we have to remove the message first
        textfield.setCustomValidity('');

        if (!textfield.validity.valid) {
            textfield.setCustomValidity('Insira um e-mail válido.');
        }
    });
    $('#ContatoForm textarea[name=Mensagem]').on('change invalid', function () {
        var textfield = $(this).get(0);

        // 'setCustomValidity not only sets the message, but also marks
        // the field as invalid. In order to see whether the field really is
        // invalid, we have to remove the message first
        textfield.setCustomValidity('');

        if (!textfield.validity.valid) {
            textfield.setCustomValidity('"Mensagem" é um campo obrigatório.');

        }
    });


    $('body').on('submit', '#ContatoForm', function (e) {
        e.preventDefault();

        $.ajax({
            type: 'post',
            url: '/Index?handler=EnviarEmail',
            datatype: "application/json",
            data: {
                __RequestVerificationToken: $('[name="__RequestVerificationToken"]').val(),
                nome: $('#ContatoForm input[name="Nome"]').val(),
                email: $('#ContatoForm  input[name="Email"]').val(),
                telefone: $('#ContatoForm  input[name="Telefone"]').val(),
                mensagem: $('#ContatoForm  textarea[name="Mensagem"]').val(),
            },
            success: function (data) {
                $('.msgFormContato').css('display', 'block');
                $('#ContatoForm  input[name="Nome"]').val('');
                $('#ContatoForm  input[name="Email"]').val('');
                $('#ContatoForm  input[name="Telefone"]').val('');
                $('#ContatoForm  textarea[name="Mensagem"]').val('');

                $('.msgFormContato').html('Obrigado pelo seu contato, retornaremos o mais breve possível!');
            },
            error: function (xhr, status, error) {
                console.log(xhr.responseText);  // to see the error message
            }
        });
    });


});


function setAudioPlaying() {
    animationAudioIndicator.play();
    $('.audio-indicator-wrapper').addClass('playing');
}

function setAudioStop() {
    animationAudioIndicator.pause();
    $('.audio-indicator-wrapper').removeClass('playing');
}

function setOuvirClicks(wavesurfer = null) {
    $("audio").on("ended", function () {
        setAudioStop();
        $(this).parent().removeClass('active');
    });

    $('.ouvir-btn').on('click', function (e) {
        if (e.target) {

            var el = $(this).find('audio');

            if (!$(this).hasClass('active')) {
                $('.ouvir-btn.active').click();

            }

            if (el) {

                if (!$('.audio-indicator-wrapper').hasClass('muted')) {
                    $(this).toggleClass('active');

                    if ($(this).hasClass('active')) {
                        el[0].play();
                        setAudioPlaying();
                        if ($('.audio-preview-wave').length > 0) {
                            wavesurfer.pause();
                            setAudioStop();
                        }
                    }
                    else {
                        el[0].pause();
                        el[0].currentTime = 0;
                        setAudioStop();

                    }
                }
                else {
                    $(this).removeClass('active');

                    el[0].pause();
                    el[0].currentTime = 0;
                    setAudioStop();

                }


            }
        }
    });
}

/* Máscaras ER */
function mascara(o, f) {
    v_obj = o
    v_fun = f
    setTimeout("execmascara()", 1)
}
function execmascara() {
    v_obj.value = v_fun(v_obj.value)
}
function mtel(v) {
    v = v.replace(/\D/g, ""); //Remove tudo o que não é dígito
    v = v.replace(/^(\d{2})(\d)/g, "($1) $2"); //Coloca parênteses em volta dos dois primeiros dígitos
    v = v.replace(/(\d)(\d{4})$/, "$1-$2"); //Coloca hífen entre o quarto e o quinto dígitos
    return v;
}
function id(el) {
    return document.getElementById(el);
}
window.onload = function () {
    id('telefone').onkeyup = function () {
        mascara(this, mtel);
    }
}

function isScrolledIntoView(elem) {
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();

    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + $(elem).height();

    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
}