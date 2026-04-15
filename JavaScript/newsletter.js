document.addEventListener('DOMContentLoaded', () => {

//Newsletter Constants
    const form = document.getElementById("form-newsletter")
    const nomeF = document.getElementById("nome")
    const telemovelF = document.getElementById("telemovel")
    const mensagemEscrita = document.getElementById("mensagem")
    const emailF = document.getElementById("email")
    const mensagemFeedback = document.getElementById("mensagem-feedback")

//Checks if each user input is correct, if not correct, makes the border of the incorrect input red
    function validadeForm(event) {
        event.preventDefault()
    //Here all border colors and the feedback messages are resetted 
        nomeF.style.border = ''
        telemovelF.style.border = ''
        emailF.style.border = ''
        mensagemEscrita.style.border= ''
        mensagemFeedback.textContent = ''

        let error = false //Created an boolean to check if any error is detected

        const regexpNome = /^[a-zA-ZÀ-ÿ\s]{2,}$/       
        const regexpEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        const indicativo = document.getElementById("indicativo").value
        const numeroInserido = telemovelF.value.trim().replace(/\s/g, '')
        const país = {
            "+351": /^9[1236]\d{7}$/, // Portugal
            "+49": /^1[5-7]\d{8,9}$/, // Alemanha
            "+61": /^4\d{8}$/, // Austrália
            "+55": /^[1-9]{2}9\d{8}$/, // Brasil
            "+1": /^[2-9]\d{9}$/, // EUA 
            "+33": /^[67]\d{8}$/, // França
            "+39": /^3\d{8,9}$/, // Itália
            "+81": /^[789]0\d{8}$/, // Japão
            "+44": /^7\d{9}$/, // Reino Unido
            "+41": /^7[5-9]\d{7}$/ // Suíça  
        }
        const regexpTelemovel = país[indicativo] 
        if (mensagemEscrita.value ===""){
            error = true
            mensagemEscrita.style.border = "2px solid red"
        }
        //If value inserted by user is blank, changes border to red and makes error var true
        if (!regexpNome.test(nomeF.value.trim())) {
            error = true
            nomeF.style.border = "2px solid red"
        }
        //If value inserted by user is not 9 in lenght, makes border red and error set to true
        if (regexpTelemovel.test(numeroInserido) === false) {
            error = true
            telemovelF.style.border = "2px solid red"
        }
        //If value inserted by user doesnt contain an @ makes border red and sets error to true
        if (!regexpEmail.test(emailF.value.trim())) {
            error = true
            emailF.style.border = "2px solid red"
        }
        //If error is true, changes the feedback message that was blankk, and makes the color red to emphasize user error
        if (error === true) {
            mensagemFeedback.textContent = "Por favor, corrija os campos a vermelho."
            mensagemFeedback.style.color = "red"
        } else {//If error is not true, shows sucecs message and makes the text color green to show correct submission by the user
            const dadosSubscritor = {
                nome: nomeF.value.trim(),
                email: emailF.value.trim(),
                indicativo: indicativo,
                telemovel: numeroInserido,
                mensagem: mensagemEscrita.value.trim()
            };

            adicionarSubscritorDB(dadosSubscritor).then(function() {
                mensagemFeedback.textContent = "Sucesso! A sua inscrição foi enviada e guardada."
                mensagemFeedback.style.color = "#29B89E" 
                form.reset() 
            }).catch(function(erro) {
                mensagemFeedback.textContent = erro;
                mensagemFeedback.style.color = "red"
            })
        }
}
    form.addEventListener("submit", validadeForm)


})