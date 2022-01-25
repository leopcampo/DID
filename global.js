/** ./global.js
 * 
 * Este é o JavaScript principal do aplicativo. 
 * Todo o controle do aplicativo é realizado por este arquivo.
 * 
 * By Luferat -   - http://github.com/Luferat 
 * MIT License - https://opensource.org/licenses/MIT
 */

// URL da API REST (back-end). Não esqueça da "/" no final. 
const apiURL = 'http://localhost:3300/';

/**
 * Super global que armazena as configurações gerais do aplicativo, obtidas do 
 * servidor (banco de dados) via API REST (JSON).
 */
var config = {}

/**
 * Promessa de acesso ao servidor para obter os dados de configuração do site.
 * O JavaScript do site só pode ser executado se os valores de 'config' foram
 * recebidos do servidor.
 */
fetch(apiURL + 'config')
    .then((resolveData) => {

        // Se deu certo -> Promessa cumprida.
        if (resolveData.ok) {

            // Extraindo os dados da configuração da promessa.
            resolveData.json().then((data) => {

                // Recebe os dados de 'config' e armazena na variável config.
                config = data;

                // Executa aplicativo principal.
                mainApp();
            });

            // Não deu certo -> Promessa não cumprida.
        } else {
            el('#content').innerHTML = `
                <article>
                    <h3 class="red">Ooooops!</h3>
                    <p class="red">Algo deu muito errado mesmo!</p>
                    <p class="red">Por favor, tente mais tarde...</p>
                </article>
            `;
        }
    });

/**
 * Aplicativo principal.
 */
function mainApp() {
    /**
     * Obtém nome da página que está sendo acessada, do 'localStorage'.
     * Estude './404.html' para mais detalhes.
     */
    let path = localStorage.getItem('path');

    // Lista de redes sociais no rodapé.
    getSocialList('.social');

    // Se cliente acessou uma página específica...
    if (path) {

        // Limpa o 'localStorage'.
        localStorage.removeItem('path');

        // Acessa a página solicitada.
        loadPage(path);

        // Se não solicitou uma página específica...
    } else {

        // Carrega a página inicial.
        loadPage('home');
    }

    /**
     * Força o fechamento do menu na incialização do aplicativo com 'hideMenu()' e
     * monitora as dimensões da view. Executa 'changeRes()' se ocorrerem mudanças.
     *   Referências: https://www.w3schools.com/jsref/event_onresize.asp
     */
    hideMenu();
    window.onresize = changeRes;

    /**
     * Monitora cliques nas tags <a>...</a> e executa 'routerLink()' se ocorrer.
     *   Referências: https://www.w3schools.com/js/js_loop_for.asp
     */
    var links = els('a');
    for (var i = 0; i < links.length; i++) {
        links[i].onclick = routerLink;
    }

    /**
     * Define o logotipo conforme 'config'
     */
    el('#logo').setAttribute('src', config.appLogo);

    /**
     * Define o título do site.
     */
    el('#siteName').innerHTML = config.appName;

    /**
     * Define mensagem de copyright conforme 'config'.
     */
    el('.license').innerHTML = '<i class="fab fa-creative-commons fa-fw"></i> ' + config.copyright;
}

/*******************************
 * Funções Específicas do tema *
 *******************************/

/**
 * Ação do clique no botão do menu. 
 *   Referências:
 *     https://www.w3schools.com/jsref/prop_element_classlist.asp
 */
function menuToggle() {

    // Se o menu está visível (class="menu-opened"), oculta ele.
    if (el('#mainMenu').classList.contains('menu-opened')) hideMenu();

    // Se o menu está oculto (class="menu-closed"), mostra ele.
    else showMenu();

    // Termina sem fazer mais nada.
    return false;
}

/**
 * Mostra menu, troca ícone e altera 'title' do botão.
 * Basicamente desfaz o que foi feito na função 'hideMenu()'.
 *   Referências:
 *     https://www.w3schools.com/jsref/prop_element_classlist.asp
 *     https://www.w3schools.com/jsref/met_element_setattribute.asp
 * 
 * OBS: esta funcionalidade poderia ser implementada na função 'menuToggle()',
 *      mas, dessa forma, podemos abrir o menu de forma independente, bastando
 *      executar 'showMenu()' a qualquer momento.  
 */
function showMenu() {
    el('#mainMenu').classList.remove('menu-closed');
    el('#mainMenu').classList.add('menu-opened');
    el('a[href="#menu"]').classList.add('fa-rotate-90');
    el('a[href="#menu"]').setAttribute('title', 'Oculta o menu');
}

/**
 * Oculta menu, troca ícone e altera 'title' do botão.
 * Basicamente desfaz o que foi feito na função 'showMenu()'.
 * 
 * OBS: esta funcionalidade poderia ser implementada na função 'menuToggle()',
 *      mas, dessa forma, podemos fechar o menu de forma independente, bastando
 *      executar 'hideMenu()' a qualquer momento.  
 */
function hideMenu() {
    el('#mainMenu').classList.remove('menu-opened');
    el('#mainMenu').classList.add('menu-closed');
    el('a[href="#menu"]').classList.remove('fa-rotate-90');
    el('a[href="#menu"]').setAttribute('title', 'Mostra o menu');
}

/**
 * Processa mudanças na view conforme as dimensões (clientWidth) desta.
 *   Referências:
 *     https://www.w3schools.com/jsref/prop_document_documentelement.asp
 */
function changeRes() {

    // Se a resolução é maior que 767 pixels, sempre mostra o menu.
    if (document.documentElement.clientWidth > config.clientWidth - 1) showMenu();

    // Se a resolução é menor, sempre oculta o menu.
    else hideMenu();

    // Sai sem fazer mais nada.
    return false;
}

/**
 * Processa clique no link, ou seja, em qualquer tag '<a>...</a>'.
 *   Referências:
 *     https://www.w3schools.com/jsref/dom_obj_event.asp
 */
function routerLink(event) {

    // Obtém os atributos 'href' e 'target' do link clicado.
    var href = this.getAttribute('href');
    var target = this.getAttribute('target');

    // Monitora cliques no 'a#btnMenu' e executa toggleMenu() se ocorrer.
    if (href === '#menu') {
        menuToggle();
        return false;
    }

    // Oculta o menu principal, mas somente em resoluções menores.
    hideMenu();

    // Se 'href' não existe ou esta vazio, não faz nada
    if (href === '' || href === null) return false;

    /** 
     * Se href é um link externo ('http://', 'https://'), uma âncora ('#')
     * ou neste, target='_blank', devolve o controle para o HTML.
     */
    if (
        target === '_blank' ||
        href.substr(0, 7) === 'http://' ||
        href.substr(0, 8) === 'https://' ||
        href.substr(0, 1) === '#'
    ) return true;

    /**
     * Se é uma rota (link interno), carrega a página solcitada com 
     * 'loadPage()' e bloqueia ação padrão do HTML com 'return false'.
     */
    else {
        loadPage(href);
        return false;
    }
}

/**
 * Carrega a página solicitada pela rota.
 * Observe que cada página fica em um diretório com o nome dela sob 'pages' 
 * e é composta de 3 arquivos:
 * 
 *   index.css --> Folha de estilos exclusiva desta página  
 *   index.html --> Estrutura HTMl desta página
 *   index.js --> JavaScript exclusivo desta página
 * 
 * OBS: mesmo que não use 'index.css' e/ou 'index.js', estes arquivos devem 
 * existir sem conteúdo (vazios).
 */
function loadPage(href) {

    /**
     * Monta caminhos para os componentes da página solicitada.
     * Por exemplo, ao acessar a página 'about' temos:
     *                       ┌─────────────┘
     *   page.css  → pages/about/index.css
     *   page.html → pages/about/index.html
     *   page.js   → pages/about/index.js
     */
    var page = {

        // Folha de estilos da página.
        css: `pages/${href}/index.css`,

        // HTML da página.
        html: `pages/${href}/index.html`,

        // JavaScript da página.
        js: `pages/${href}/index.js`
    };

    // Carrega o CSS e salva em style#pageCSS na 'index.html'.
    if (getFile(page.css, '#pageCSS')) {

        // Carrega o HTML e salva em div#content na 'index.html'.
        if (getFile(page.html, '#content')) {

            // Atualiza endereço da página no navegador
            window.history.replaceState('', '', href);

            // Carrega o JavaScript na memória e o executa.
            getFile(page.js);

            // Mensagens em caso de erros...
        } else console.error('Erro ao carregar componente "HTML" da página.');
    } else console.error('Erro ao carregar componente "CSS" da página.');
}

/**
 * Obtém arquivo via requisição HTTP assíncrona.
 *   Referências:
 *     https://www.w3schools.com/js/js_asynchronous.asp
 *     https://www.w3schools.com/js/js_async.asp
 *     
 *     https://www.w3schools.com/js/js_api_fetch.asp
 *     https://www.w3schools.com/jsref/jsref_eval.asp
 */
async function getFile(filePath, element = '') {

    // Faz a requisição via HTTP do documento em 'filePath'.
    // Quando a resposta chegar, armazena-a em 'response'.
    const response = await fetch(filePath);

    // Extrai os dados úteis de 'response' e armazena em 'content'.
    const content = await response.text();

    // Se não declarou um elemento onde deixar os resultados, executa-os,
    // pois se trata de um arquivo JavaScript.
    if (element === '') eval(content);

    // Se declarou um elemento, envia os dados para o innerHTML do elemento.
    else el(element).innerHTML = content;

    // Retorna com true se deu certo.
    return true;
}

/************************
 * Funções de uso geral *
 ************************/

/**
 * Atalho para document.querySelector().
 *   Referências: 
 *     https://www.w3schools.com/jsref/met_document_queryselector.asp
 */
function el(selector) {
    return document.querySelector(selector);
}

/**
 * Atalho para document.querySelectorAll().
 *   Referências:
 *     https://www.w3schools.com/jsref/met_document_queryselectorall.asp
 */
function els(selector) {
    return document.querySelectorAll(selector);
}

/**
 * Processa o título da página dinâmicamente na tag <title>...</title>.
 */
function setTitle(pageTitle = '') {

    // Se não definiu o título, usa o formato especificado...
    if (pageTitle == '') el('head>title').innerHTML = `${config.appName} ${config.separator} ${config.appSlogan}`;

    // Se definiu o título, usa o formato especificado...
    else el('head>title').innerHTML = `${config.appName} ${config.separator} ${pageTitle}`;

    // Sai sem fazer mais nada.
    return false;
}

/** 
 * setPage() → Experimental
 * Para que o SPA funcione corretamente, configura a rota correta ao recarregar
 * a página no navegador em servidores HTTP sem suporte para '404.html'.
 * 
 * Esta função deve ser executada na chamada de cada rota. 
 * Por exemplo, ao chamar 'about', executamos 'setPage('about')' em 
 * 'pages/about/index.js'.   │                            │
 *          └────────────────┴────────────────────────────┘
 */
function setPage(pageName) {
    localStorage.setItem('path', pageName);
}

// Gera a data atual em formato system date "YYYY-MM-DD HH:II:SS"
function getSystemDate() {
    var yourDate = new Date(); // Obtém a data atual do navegador
    var offset = yourDate.getTimezoneOffset(); // Obtém o fusohorário
    yourDate = new Date(yourDate.getTime() - offset * 60 * 1000); // Ajusta o fusohorário
    returnDate = yourDate.toISOString().split("T"); // Separa data da hora
    returnTime = returnDate[1].split("."); // Separa partes da data
    return `${returnDate[0]} ${returnTime[0]}`; // Formata data como system date
}

// Formata uma 'system date' (YYYY-MM-DD HH:II:SS) para 'Br date' (DD/MM/YYYY HH:II:SS)
function getBrDate(dateString, separator = ' às ') {
    var p1 = dateString.split(" "); // Separa data e hora
    var p2 = p1[0].split("-"); // Separa partes da data
    return `${p2[2]}/${p2[1]}/${p2[0]}${separator}${p1[1]}`; // Remonta partes da data e hora
}

/**
 * Sanitiza a string, removendo caracteres perigosos, espaços desnecessários, etc...
 * Por padrão (stripTags = true), remove tags HTML e scripts.
 */
function sanitizeString(stringValue, stripTags = true) {

    // Remover todas as tags HTML
    if (stripTags) stringValue = stringValue.replace(/<[^>]*>?/gm, '');

    // Quebras de linha viram '<br>' e remove espaçis extras
    stringValue = stringValue.replace(/\n/g, '<br>').trim();

    // Remove espaços antes e depois, se existir
    return stringValue.trim();
}

/**
 * Obtém uma lista das redes sociais do aplicativo via API. * 
 *   'element' define onde a lista será exibida.
 *   'fullList' se 'true', lista todos os contatos
 *              se 'false', não lista os contatos com "nofooter": true
 *
 *    Por default, 'fullList' = 'true'
 * 
 *   Exemplos:
 *     getSocialList('.social') --> Gera a lista no rodapé.
 *     getSocialList('.contact-list', true); --> Gera a lista na aside.
 */
function getSocialList(element, fullList = false) {

    // View que exibe a lista.
    var socialList = '';

    // Obtém a lista do servidor (API)
    fetch(apiURL + 'social')
        .then((socialData) => {

            // Se deu certo...
            if (socialData.ok) {

                // Obtém os dados e armazena em 'data'.
                socialData.json().then((data) => {

                    // Itera 'data'
                    for (let i = 0; i < data.length; i++) {

                        // Se é para exibir a lista completa...
                        if (fullList) {

                            // Monta a view.
                            socialList += `
                                <a href="${data[i].href}" target="_blank" title="Meu ${data[i].name}">
                                    <i class="${data[i].icon}"></i><span>${data[i].name}</span>
                                </a>                        
                            `;

                            // Se é para exibir so redes sociais...
                        } else {

                            // Descarta o que não é rede social ("nofooter": true)
                            if (!data[i].nofooter) {

                                // Monta a view.
                                socialList += `
                                    <a href="${data[i].href}" target="_blank" title="Meu ${data[i].name}">
                                        <i class="${data[i].icon}"></i><span>${data[i].name}</span>
                                    </a>                        
                                `;
                            }
                        }
                    }

                    // Exibe a view no elemento selecionado.
                    el(element).innerHTML = socialList;
                })
            }
        });
}
