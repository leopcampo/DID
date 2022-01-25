/** ./pages/contacts/index.js
 * 
 * Este JavaScript é de uso exclusivo da página/rota 'contacts'.
 * Ele faz a validação e processa o envio do formulário no front-end.
 * 
 * By Luferat - https://github.com/Luferat
 * MIT License - https://opensource.org/licenses/MIT
 */

// Define a página de reload
setPage('contacts');

// Título da página
setTitle('Faça contato');

/**
 * Cria a função de processamento do formulário somente se não existe na 
 * memória.
 *   Referências:
 *     https://www.w3schools.com/js/js_typeof.asp
 *     https://www.w3schools.com/jsref/prop_text_value.asp
 *     https://www.w3schools.com/js/js_json_stringfy.asp
 */
if (typeof sendForm !== 'function') {

    // Função que processa o formulário
    window.sendForm = function () {

        // Obtém os campos do formulário e sanitiza.
        var contact = {
            name: sanitizeString(el('#contactName').value),
            email: sanitizeString(el('#contactEmail').value),
            subject: sanitizeString(el('#contactSubject').value),
            message: sanitizeString(el('#contactMessage').value)
        }

        /**
         * Não envia o formulário se algum campo está vazio.
         * Isso é útil caso a validação do HTML/CSS falhe.
         */
        var empty = false;
        for (let key in contact) {
            if (contact[key] === '') {

                // Primeira letra de 'key' maiúscula
                let ucKey = key[0].toUpperCase() + key.substr(1);

                // Reescreve o campo
                el(`#contact${ucKey}`).value = '';

                // Marca o formulário como vazio
                empty = true;
            }
        }

        // Se formulário vazio, não processa.
        if (empty) return false;

        // Adiciona a data de envio e o status do contato.
        contact.date = getSystemDate();
        contact.status = 'recebido';

        /**
         * Salva contato no banco de dados.
         * 
         * O que vai acontecer aqui, depende de seu back-end e de como ele vai
         * receber os dados do front-end. Provavelmente uma API REST que recebe
         * os dados em JSON.
         * 
         * Veja um exemplo à seguir...
         */
        // console.log('Salvei isso no banco de dados --> ', contact);

        /**
         * Faz a conexão com a API REST contendo o banco de dados usando o
         * método HTTP 'POST' e postando os dados no 'body' do documento 
         * enviado, formatado como um JSON.
         * 
         * Neste exemplo, está salvando em um banco de dados JSON 
         * (./db/db.json) privido pelo 'json-server'.
         *   Referências:
         *     https://github.com/typicode/json-server
         */
        fetch(apiURL + 'contacts', {
            method: "POST",
            body: JSON.stringify(contact),
            headers: { "Content-type": "application/json; charset=UTF-8" }
        })

            // Resposta do 'fetch' --> Contato enviado.
            .then(response => {

                // Se falhou por algum motivo...
                if (!response.ok) {

                    // Formata mensagem de erro na view.
                    el('#feedback').innerHTML = `
                        <h2>Olá!</h2>
                        <p class="red">Algo deu errado e não foi possível enviar seu contato.</p>
                        <p class="red">Por favor, tente mais tarde.</p>
                        <p><em>Obrigado!</em></p>
                    `;

                    // Se deu tudo certo...
                } else {

                    // Obtém só o primeiro nome do remetente.
                    var name = contact.name.split(' ')[0];

                    // Mensagem de saída para o usuário (feedback)
                    el('#feedback').innerHTML = `
                        <h3>Olá ${name}!</h3>
                        <p>Seu contato foi enviado com sucesso.</p>
                        <p><em>Obrigado...</em></p>
                    `;
                }
            })

            // Resposta do 'fetch' --> Falha ao enviar contato.
            .catch(error => {
                console.error(`Oooops! Algo deu muito errado: ${error}.`);
            })

        // Limpa campos do formulário para permitir novos envios.
        el('#contactName').value = '';
        el('#contactEmail').value = '';
        el('#contactSubject').value = '';
        el('#contactMessage').value = '';

        // Oculta o formulário.
        el('#contact').style.display = 'none';

        // Mostra feedback
        el('#feedback').style.display = 'block';

        /**
         * Termina sem fazer mais nada.
         * Isso evita que o controle retorne para o HTML e que o formulário
         * seja enviado por lá também, gerando um erro 404.
         */
        return false;
    }
}

/**
 * Processa digitação nos campos.
 * 
 * A função 'inputFilters' evita que o usuário digite somente espaços no campo
 * do formulário. Também remove qualquer espaço duplicado digitado no campo.
 * 
 * Dica 1: esta função pode/deve ser ampliada com outros filtros que atuarão
 * durante a digitação (onkeyup) nos campos.
 * 
 * Dica 2: caso esta função seja necessária em outras páginas/formulários do
 * site, mova-a para './global.js'.
 * 
 *   Referências:
 *     https://www.w3schools.com/jsref/jsref_replace.asp
 *     https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/String/trimStart
 */
if (typeof inputFilters !== 'function') {
    window.inputFilters = function () {

        // Remove quaisquer espaços no começo do campo.
        this.value = this.value.trimStart();

        // Remove espaços duplicados.
        this.value = this.value.replace(/\s{2,}/g, ' ');
    }
}

// Se o formulário já existe...
if (el('#contact')) {

    /**
     * Processa o envio do formulário.
     *   Referências:
     *     https://www.w3schools.com/jsref/event_onsubmit.asp
     */
    el('#contact').onsubmit = sendForm;

    /**
     * Processa cada campo do formulário ao ser preenchido.
     * Chama 'inputFilters' quando uma tecla é solta.
     */
    var inputs = el('#contact').elements;
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].onkeyup = inputFilters;
    }

    // Lista de redes sociais na barra lateral
    getSocialList('.contact-list', true);
}