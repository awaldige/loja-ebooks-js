
"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type Ebook = {
  id: number;
  nome: string;
  preco: number;
  imagem: string;
  categoria: string;
  descricao: string;
};

type CartItem = {
  ebook: Ebook;
  quantidade: number;
};

const ebooks: Ebook[] = [
  {
    id: 1,
    nome: "HTML & CSS",
    preco: 19.9,
    imagem: "/imagens/html-css.jpg",
    categoria: "Desenvolvimento Web",
    descricao: "Aprenda os fundamentos da criação de páginas e interfaces para a web.",
  },
  {
    id: 2,
    nome: "JavaScript Básico",
    preco: 24.9,
    imagem: "/imagens/javascript.jpg",
    categoria: "Programação",
    descricao: "Conheça a linguagem que dá vida e interatividade aos sites.",
  },
  {
    id: 3,
    nome: "Marketing Digital",
    preco: 29.9,
    imagem: "/imagens/marketing.jpg",
    categoria: "Marketing",
    descricao: "Conheça conceitos essenciais para divulgar produtos e serviços na internet.",
  },
  {
    id: 4,
    nome: "Git & GitHub",
    preco: 22.9,
    imagem: "/imagens/git.jpg",
    categoria: "Ferramentas",
    descricao: "Aprenda conceitos de versionamento e organização de projetos.",
  },
  {
    id: 5,
    nome: "React Iniciante",
    preco: 39.9,
    imagem: "/imagens/react.jpg",
    categoria: "Programação",
    descricao: "Dê os primeiros passos na criação de interfaces com React.",
  },
  {
    id: 6,
    nome: "UX/UI Design",
    preco: 27.9,
    imagem: "/imagens/uiux.jpg",
    categoria: "Design",
    descricao: "Explore princípios de experiência do usuário e design de interfaces.",
  },
  {
    id: 7,
    nome: "Node.js Básico",
    preco: 34.9,
    imagem: "/imagens/node.jpg",
    categoria: "Programação",
    descricao: "Conheça os fundamentos do desenvolvimento com Node.js.",
  },
  {
    id: 8,
    nome: "Banco de Dados SQL",
    preco: 31.9,
    imagem: "/imagens/sql.jpg",
    categoria: "Banco de Dados",
    descricao: "Entenda os fundamentos de bancos relacionais e consultas SQL.",
  },
  {
    id: 9,
    nome: "Python para Iniciantes",
    preco: 36.9,
    imagem: "/imagens/python.jpg",
    categoria: "Programação",
    descricao: "Comece a aprender lógica e programação com Python.",
  },
  {
    id: 10,
    nome: "PHP Moderno",
    preco: 28.9,
    imagem: "/imagens/php.jpg",
    categoria: "Programação",
    descricao: "Conheça os fundamentos do desenvolvimento web com PHP.",
  },
  {
    id: 11,
    nome: "Segurança Web",
    preco: 42.9,
    imagem: "/imagens/security.jpg",
    categoria: "Segurança",
    descricao: "Conheça conceitos importantes de segurança para aplicações web.",
  },
  {
    id: 12,
    nome: "SEO Profissional",
    preco: 26.9,
    imagem: "/imagens/seo.jpg",
    categoria: "Marketing",
    descricao: "Aprenda conceitos de otimização para mecanismos de busca.",
  },
];

const categorias = [
  "Todas",
  ...Array.from(new Set(ebooks.map((ebook) => ebook.categoria))),
];

const formatarPreco = (valor: number) =>
  valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

export default function Home() {
  const [busca, setBusca] = useState("");
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todas");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [carrinho, setCarrinho] = useState<CartItem[]>([]);
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);
  const [aviso, setAviso] = useState("");
  const [finalizacao, setFinalizacao] = useState(false);

  const porPagina = 6;

  useEffect(() => {
    try {
      const salvo = localStorage.getItem("aw-ebooks-carrinho");
      if (salvo) {
        setCarrinho(JSON.parse(salvo) as CartItem[]);
      }
    } catch {
      localStorage.removeItem("aw-ebooks-carrinho");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("aw-ebooks-carrinho", JSON.stringify(carrinho));
  }, [carrinho]);

  const ebooksFiltrados = useMemo(() => {
    const termo = busca.trim().toLocaleLowerCase("pt-BR");

    return ebooks.filter((ebook) => {
      const correspondeBusca =
        ebook.nome.toLocaleLowerCase("pt-BR").includes(termo) ||
        ebook.descricao.toLocaleLowerCase("pt-BR").includes(termo);

      const correspondeCategoria =
        categoriaAtiva === "Todas" || ebook.categoria === categoriaAtiva;

      return correspondeBusca && correspondeCategoria;
    });
  }, [busca, categoriaAtiva]);

  const totalPaginas = Math.max(1, Math.ceil(ebooksFiltrados.length / porPagina));

  const ebooksExibidos = ebooksFiltrados.slice(
    (paginaAtual - 1) * porPagina,
    paginaAtual * porPagina
  );

  const quantidadeItens = carrinho.reduce(
    (total, item) => total + item.quantidade,
    0
  );

  const valorTotal = carrinho.reduce(
    (total, item) => total + item.ebook.preco * item.quantidade,
    0
  );

  function mostrarAviso(mensagem: string) {
    setAviso(mensagem);
    window.setTimeout(() => setAviso(""), 2500);
  }

  function adicionarAoCarrinho(ebook: Ebook) {
    setCarrinho((atual) => {
      const existente = atual.find((item) => item.ebook.id === ebook.id);

      if (existente) {
        return atual.map((item) =>
          item.ebook.id === ebook.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
      }

      return [...atual, { ebook, quantidade: 1 }];
    });

    setFinalizacao(false);
    mostrarAviso(`${ebook.nome} adicionado ao carrinho!`);
  }

  function alterarQuantidade(id: number, diferenca: number) {
    setCarrinho((atual) =>
      atual
        .map((item) =>
          item.ebook.id === id
            ? { ...item, quantidade: item.quantidade + diferenca }
            : item
        )
        .filter((item) => item.quantidade > 0)
    );
  }

  function removerItem(id: number) {
    setCarrinho((atual) => atual.filter((item) => item.ebook.id !== id));
  }

  function selecionarCategoria(categoria: string) {
    setCategoriaAtiva(categoria);
    setPaginaAtual(1);
  }

  function alterarBusca(valor: string) {
    setBusca(valor);
    setPaginaAtual(1);
  }

  function concluirDemonstracao() {
    setFinalizacao(true);
  }

  function fecharCarrinho() {
    setCarrinhoAberto(false);
    setFinalizacao(false);
  }

  return (
    <>
      <div className="topbar">
        <div className="container topbar-content">
          <span>Conhecimento para transformar seu futuro</span>
          <span>Produtos 100% digitais</span>
        </div>
      </div>

      <header className="header">
        <div className="container header-content">
          <a href="#" className="brand" aria-label="Página inicial">
            <span className="brand-icon">E</span>
            <span>
              <strong>AW EBOOKS</strong>
              <small>Conhecimento a um clique</small>
            </span>
          </a>

          <nav className="navigation" aria-label="Navegação principal">
            <a href="#inicio">Início</a>
            <a href="#catalogo">Catálogo</a>
            <a href="#sobre">Sobre</a>
          </nav>

          <button
            className="cart-button"
            onClick={() => setCarrinhoAberto(true)}
            aria-label={`Abrir carrinho com ${quantidadeItens} itens`}
          >
            <span>Meu carrinho</span>
            <span className="cart-count">{quantidadeItens}</span>
          </button>
        </div>
      </header>

      <main>
        <section className="hero" id="inicio">
          <div className="container hero-content">
            <div className="hero-text">
              <span className="eyebrow">BIBLIOTECA DIGITAL</span>
              <h1>
                Seu próximo aprendizado começa <span>aqui.</span>
              </h1>
              <p>
                Explore eBooks sobre tecnologia, programação, design e
                marketing. Amplie seus conhecimentos no seu próprio ritmo.
              </p>
              <a href="#catalogo" className="primary-button">
                Explorar eBooks <span>→</span>
              </a>

              <div className="hero-stats">
                <div>
                  <strong>12+</strong>
                  <span>eBooks disponíveis</span>
                </div>
                <div>
                  <strong>100%</strong>
                  <span>Conteúdo digital</span>
                </div>
              </div>
            </div>

            <div className="hero-visual" aria-hidden="true">
              <div className="hero-book hero-book-back">DEV</div>
              <div className="hero-book hero-book-front">
                <span>AW</span>
                <strong>SEU CONHECIMENTO</strong>
                <small>SEM LIMITES</small>
              </div>
              <div className="hero-decoration">✦</div>
            </div>
          </div>
        </section>

        <section className="benefits">
          <div className="container benefits-grid">
            <div className="benefit">
              <span className="benefit-icon">↗</span>
              <div>
                <strong>Aprenda no seu ritmo</strong>
                <small>Estude quando quiser</small>
              </div>
            </div>
            <div className="benefit">
              <span className="benefit-icon">▣</span>
              <div>
                <strong>Formato digital</strong>
                <small>Biblioteca sem papel</small>
              </div>
            </div>
            <div className="benefit">
              <span className="benefit-icon">✓</span>
              <div>
                <strong>Compra simplificada</strong>
                <small>Uma experiência prática</small>
              </div>
            </div>
          </div>
        </section>

        <section className="catalog-section" id="catalogo">
          <div className="container">
            <div className="section-heading">
              <div>
                <span className="eyebrow">NOSSO CATÁLOGO</span>
                <h2>Explore nossos eBooks</h2>
                <p>Encontre conteúdos para desenvolver novas habilidades.</p>
              </div>
              <span className="catalog-total">
                {ebooksFiltrados.length} produtos
              </span>
            </div>

            <div className="catalog-tools">
              <div className="search-box">
                <span aria-hidden="true">⌕</span>
                <input
                  type="search"
                  placeholder="Buscar eBook..."
                  value={busca}
                  onChange={(event) => alterarBusca(event.target.value)}
                  aria-label="Buscar eBooks"
                />
              </div>

              <div className="category-list">
                {categorias.map((categoria) => (
                  <button
                    key={categoria}
                    className={
                      categoriaAtiva === categoria
                        ? "category-button active"
                        : "category-button"
                    }
                    onClick={() => selecionarCategoria(categoria)}
                  >
                    {categoria}
                  </button>
                ))}
              </div>
            </div>

            {ebooksExibidos.length > 0 ? (
              <div className="ebook-grid">
                {ebooksExibidos.map((ebook) => (
                  <article className="ebook-card" key={ebook.id}>
                    <div className="ebook-image">
                      <Image
                        src={ebook.imagem}
                        alt={`Capa do eBook ${ebook.nome}`}
                        fill
                        sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 25vw"
                      />
                      <span className="ebook-category">{ebook.categoria}</span>
                    </div>

                    <div className="ebook-info">
                      <h3>{ebook.nome}</h3>
                      <p>{ebook.descricao}</p>

                      <div className="ebook-card-bottom">
                        <div>
                          <small>Preço</small>
                          <strong>{formatarPreco(ebook.preco)}</strong>
                        </div>

                        <button
                          className="buy-button"
                          onClick={() => adicionarAoCarrinho(ebook)}
                        >
                          Adicionar +
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-search">
                <span>⌕</span>
                <h3>Nenhum eBook encontrado</h3>
                <p>Tente outra palavra ou selecione uma categoria diferente.</p>
                <button
                  className="primary-button"
                  onClick={() => {
                    setBusca("");
                    selecionarCategoria("Todas");
                  }}
                >
                  Limpar filtros
                </button>
              </div>
            )}

            {totalPaginas > 1 && (
              <div className="pagination">
                <button
                  onClick={() => setPaginaAtual((pagina) => pagina - 1)}
                  disabled={paginaAtual === 1}
                >
                  ← Anterior
                </button>

                {Array.from({ length: totalPaginas }, (_, index) => index + 1).map(
                  (pagina) => (
                    <button
                      key={pagina}
                      className={paginaAtual === pagina ? "active" : ""}
                      onClick={() => setPaginaAtual(pagina)}
                    >
                      {pagina}
                    </button>
                  )
                )}

                <button
                  onClick={() => setPaginaAtual((pagina) => pagina + 1)}
                  disabled={paginaAtual === totalPaginas}
                >
                  Próxima →
                </button>
              </div>
            )}
          </div>
        </section>

        <section className="about-section" id="sobre">
          <div className="container about-content">
            <div>
              <span className="eyebrow">SOBRE A AW EBOOKS</span>
              <h2>Conhecimento acessível para quem quer evoluir.</h2>
            </div>
            <p>
              Nossa biblioteca digital reúne materiais de diferentes áreas
              para apoiar seus estudos e incentivar o aprendizado contínuo.
              Escolha um tema, descubra novos conhecimentos e avance no seu
              próprio caminho.
            </p>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-content">
          <div>
            <strong>AW EBOOKS</strong>
            <p>Conhecimento a um clique.</p>
          </div>
          <span>© 2026 AW TECHNOLOGY. Todos os direitos reservados.</span>
        </div>
      </footer>

      {aviso && <div className="toast">{aviso}</div>}

      {carrinhoAberto && (
        <div
          className="modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) fecharCarrinho();
          }}
        >
          <section
            className="cart-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
          >
            <div className="modal-header">
              <div>
                <span className="eyebrow">SUA SELEÇÃO</span>
                <h2 id="cart-title">
                  {finalizacao ? "Pedido demonstrativo" : "Meu carrinho"}
                </h2>
              </div>
              <button
                className="close-modal"
                onClick={fecharCarrinho}
                aria-label="Fechar carrinho"
              >
                ×
              </button>
            </div>

            {finalizacao ? (
              <div className="checkout-message">
                <span className="success-icon">✓</span>
                <h3>Simulação concluída!</h3>
                <p>
                  Esta é uma demonstração da loja. Nenhum pagamento foi
                  realizado e nenhum pedido real foi criado.
                </p>
                <button
                  className="checkout-button"
                  onClick={() => {
                    setCarrinho([]);
                    setFinalizacao(false);
                    setCarrinhoAberto(false);
                  }}
                >
                  Voltar à loja
                </button>
              </div>
            ) : carrinho.length === 0 ? (
              <div className="empty-cart">
                <span>▢</span>
                <h3>Seu carrinho está vazio</h3>
                <p>Explore o catálogo e adicione seus eBooks favoritos.</p>
                <button
                  className="checkout-button"
                  onClick={fecharCarrinho}
                >
                  Explorar catálogo
                </button>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {carrinho.map((item) => (
                    <div className="cart-item" key={item.ebook.id}>
                      <div className="cart-item-image">
                        <Image
                          src={item.ebook.imagem}
                          alt=""
                          fill
                          sizes="64px"
                        />
                      </div>

                      <div className="cart-item-info">
                        <strong>{item.ebook.nome}</strong>
                        <span>{formatarPreco(item.ebook.preco)}</span>
                        <div className="quantity-controls">
                          <button
                            onClick={() => alterarQuantidade(item.ebook.id, -1)}
                            aria-label={`Diminuir quantidade de ${item.ebook.nome}`}
                          >
                            −
                          </button>
                          <span>{item.quantidade}</span>
                          <button
                            onClick={() => alterarQuantidade(item.ebook.id, 1)}
                            aria-label={`Aumentar quantidade de ${item.ebook.nome}`}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <button
                        className="remove-item"
                        onClick={() => removerItem(item.ebook.id)}
                        aria-label={`Remover ${item.ebook.nome}`}
                      >
                        Remover
                      </button>
                    </div>
                  ))}
                </div>

                <div className="cart-summary">
                  <div>
                    <span>Quantidade de itens</span>
                    <strong>{quantidadeItens}</strong>
                  </div>
                  <div className="cart-total">
                    <span>Total</span>
                    <strong>{formatarPreco(valorTotal)}</strong>
                  </div>
                  <button
                    className="checkout-button"
                    onClick={concluirDemonstracao}
                  >
                    Simular finalização
                  </button>
                  <small>
                    Ambiente demonstrativo. A integração de pagamento será
                    implementada posteriormente.
                  </small>
                </div>
              </>
            )}
          </section>
        </div>
      )}
    </>
  );
}
