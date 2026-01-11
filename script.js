const ebooks = [
    { nome:"HTML & CSS", preco:19.90, img:"imagens/html-css.jpg", file:"ebooks/html-css.pdf" },
    { nome:"JavaScript Básico", preco:24.90, img:"imagens/javascript.jpg", file:"ebooks/javascript-basico.pdf" },
    { nome:"Marketing Digital", preco:29.90, img:"imagens/marketing.jpg", file:"ebooks/marketing-digital.pdf" },
    { nome:"Git & GitHub", preco:22.90, img:"imagens/git.jpg", file:"ebooks/git.pdf" },
    { nome:"React Iniciante", preco:39.90, img:"imagens/react.jpg", file:"ebooks/react.pdf" },
    { nome:"UX/UI Design", preco:27.90, img:"imagens/uiux.jpg", file:"ebooks/uiux.pdf" },

    { nome:"Node.js Básico", preco:34.90, img:"imagens/node.jpg", file:"ebooks/node.pdf" },
    { nome:"Banco de Dados SQL", preco:31.90, img:"imagens/sql.jpg", file:"ebooks/sql.pdf" },
    { nome:"Python para Iniciantes", preco:36.90, img:"imagens/python.jpg", file:"ebooks/python.pdf" },
    { nome:"PHP Moderno", preco:28.90, img:"imagens/php.jpg", file:"ebooks/php.pdf" },
    { nome:"Segurança Web", preco:42.90, img:"imagens/security.jpg", file:"ebooks/security.pdf" },
    { nome:"SEO Profissional", preco:26.90, img:"imagens/seo.jpg", file:"ebooks/seo.pdf" }
];

let paginaAtual = 1;
const porPagina = 6;
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || {};

/* CATÁLOGO */
function renderizarEbooks(){
    const catalogo = document.querySelector(".catalogo");
    catalogo.innerHTML = "";

    const inicio = (paginaAtual-1)*porPagina;
    const lista = ebooks.slice(inicio, inicio+porPagina);

    lista.forEach(e=>{
        catalogo.innerHTML += `
        <article class="ebook motion">
            <img src="${e.img}">
            <h2>${e.nome}</h2>
            <data>R$ ${e.preco.toFixed(2).replace(".",",")}</data>
            <button onclick="adicionar('${e.nome}',${e.preco})">Comprar</button>
        </article>`;
    });

    observar();
}

/* PAGINAÇÃO */
function renderizarPaginacao(){
    const p = document.getElementById("paginacao");
    p.innerHTML = "";
    const total = Math.ceil(ebooks.length/porPagina);

    for(let i=1;i<=total;i++){
        p.innerHTML += `<button class="${i===paginaAtual?'ativo':''}" onclick="mudarPagina(${i})">${i}</button>`;
    }
}

function mudarPagina(p){
    paginaAtual = p;
    renderizarEbooks();
    renderizarPaginacao();
    window.scrollTo({top:0,behavior:"smooth"});
}

/* CARRINHO */
function salvar(){
    localStorage.setItem("carrinho",JSON.stringify(carrinho));
    atualizarTopo();
}

function adicionar(nome,preco){
    carrinho[nome] ? carrinho[nome].qtd++ : carrinho[nome]={preco,qtd:1};
    salvar();
    toast(nome+" adicionado");
}

function atualizarTopo(){
    let itens=0,total=0;
    for(let p in carrinho){
        itens+=carrinho[p].qtd;
        total+=carrinho[p].preco*carrinho[p].qtd;
    }
    document.getElementById("qtd-itens").innerText=itens;
    document.getElementById("valor-total").innerText=total.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
}

function abrirModal(){
    const ul=document.getElementById("lista-produtos");
    ul.innerHTML="";
    let total=0;

    for(let p in carrinho){
        total+=carrinho[p].preco*carrinho[p].qtd;
        ul.innerHTML+=`
        <li class="item-modal">
            ${p}
            <div class="controles">
                <button onclick="alterar('${p}',-1)">−</button>
                <span>${carrinho[p].qtd}</span>
                <button onclick="alterar('${p}',1)">+</button>
                <button class="remover" onclick="remover('${p}')">✕</button>
            </div>
        </li>`;
    }

    document.getElementById("total-modal").innerText=total.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
    document.getElementById("modal").classList.add("ativo");
}

function fecharModal(){ document.getElementById("modal").classList.remove("ativo"); }

function alterar(nome,d){
    carrinho[nome].qtd+=d;
    if(carrinho[nome].qtd<=0) delete carrinho[nome];
    salvar(); abrirModal();
}

function remover(nome){
    delete carrinho[nome];
    salvar(); abrirModal();
}

/* PAGAMENTO */
function pagarPix(){ simular("Pix"); }
function pagarMP(){ simular("Mercado Pago"); }

function simular(m){
    document.getElementById("loading").classList.add("ativo");
    setTimeout(()=>{
        document.getElementById("loading").classList.remove("ativo");
        finalizar(m);
    },2000);
}

function finalizar(metodo){
    const ul=document.getElementById("lista-produtos");
    ul.innerHTML=`<h3>🎉 Obrigado! (${metodo})</h3>`;

    for(let p in carrinho){
        const ebook = ebooks.find(e=>e.nome===p);
        ul.innerHTML+=`
        <div class="download-item">
            📘 ${p}
            <a href="${ebook.file}" download>Baixar</a>
        </div>`;
    }

    carrinho={};
    salvar();
}

/* TOAST */
function toast(msg){
    const t=document.getElementById("toast");
    t.textContent=msg;
    t.classList.add("show");
    setTimeout(()=>t.classList.remove("show"),2500);
}

/* ANIMAÇÃO */
const obs=new IntersectionObserver(e=>{
    e.forEach(x=>x.isIntersecting&&x.target.classList.add("show"));
},{threshold:.25});

function observar(){
    document.querySelectorAll(".motion").forEach(el=>obs.observe(el));
}

/* INIT */
renderizarEbooks();
renderizarPaginacao();
atualizarTopo();
