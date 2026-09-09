
import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import * as THREE from 'three';
import Lenis from 'lenis';
import './styles.css';

const IMG = {
  constitution1824: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Constitui%C3%A7%C3%A3o_de_1824.jpg?width=1000',
  constitution1891: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Constitui%C3%A7%C3%A3o_da_Rep%C3%BAblica_dos_Estados_Unidos_do_Brasil_de_1891_p._00_(capa).jpg?width=1000',
  pedro: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/DpedroI-brasil-full.jpg?width=900',
  vargas: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Getulio_Vargas_(1930).jpg?width=900',
  constitution1946: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Constitui%C3%A7%C3%A3o_da_Rep%C3%BAblica_dos_Estados_Unidos_do_Brasil_de_1946.pdf/page1-937px-Constitui%C3%A7%C3%A3o_da_Rep%C3%BAblica_dos_Estados_Unidos_do_Brasil_de_1946.pdf.jpg',
  ulysses1988: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Ulyssesguimaraesconstituicao.jpg?width=1400',
  promulgacao1988: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Promulga%C3%A7%C3%A3o-Constitui%C3%A7%C3%A3o-1988.jpg?width=1400',
  congress: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Pal%C3%A1cio_do_Congresso_Nacional_(52780142794).jpg?width=1600',
};

const COLORS = {
  executivo: '#7a2e2e',
  legislativo: '#8d6a2b',
  judiciario: '#315f58',
};

const powers = [
  {
    id: 'executivo',
    number: 'I',
    title: 'Poder Executivo',
    short: 'Executar e administrar',
    lead: 'Transforma decisões políticas e leis em ação concreta.',
    body: [
      'Administra serviços públicos, formula e executa políticas, conduz a máquina estatal e representa o país em diversas relações institucionais.',
      'Na União, é chefiado pelo Presidente da República; nos estados, pelos governadores; nos municípios, pelos prefeitos.',
    ],
    bullets: [
      'Sanciona ou veta projetos aprovados pelo Legislativo.',
      'Propõe políticas públicas e administra o orçamento aprovado.',
      'Pode editar medidas provisórias nos limites previstos pela Constituição.',
    ],
    note: 'Função típica: administrar. Funções atípicas existem, mas sempre submetidas à Constituição e ao controle dos outros Poderes.',
  },
  {
    id: 'legislativo',
    number: 'II',
    title: 'Poder Legislativo',
    short: 'Representar, legislar e fiscalizar',
    lead: 'É a arena institucional onde a sociedade é representada na produção das leis.',
    body: [
      'Na esfera federal, o Congresso Nacional é bicameral: Câmara dos Deputados e Senado Federal.',
      'Além de elaborar leis, o Legislativo fiscaliza o Executivo, examina o orçamento e exerce controles políticos e financeiros.',
    ],
    bullets: [
      'Discute, altera e aprova projetos de lei.',
      'Pode derrubar vetos presidenciais conforme as regras constitucionais.',
      'Participa de processos de responsabilização política e de aprovação de certas autoridades.',
    ],
    note: 'A Câmara representa a população; o Senado representa os estados e o Distrito Federal.',
  },
  {
    id: 'judiciario',
    number: 'III',
    title: 'Poder Judiciário',
    short: 'Julgar e proteger a ordem constitucional',
    lead: 'Resolve conflitos e garante que o poder público atue dentro das regras.',
    body: [
      'É formado por juízes e tribunais de diferentes ramos e instâncias. No topo da ordem constitucional está o Supremo Tribunal Federal.',
      'Sua função não é governar nem criar leis em sentido político, mas interpretar e aplicar o direito aos casos concretos e controlar a constitucionalidade.',
    ],
    bullets: [
      'Julga conflitos entre pessoas, instituições e entes públicos.',
      'Pode declarar incompatíveis com a Constituição leis e atos do poder público.',
      'Não existe um Poder Judiciário municipal próprio.',
    ],
    note: 'O STF é chamado de guardião da Constituição porque exerce papel central no controle constitucional.',
  },
];

const constitutions = [
  {
    year: '1824',
    title: 'Império e Poder Moderador',
    tone: 'Império',
    text: 'A primeira Constituição brasileira estruturou quatro poderes: Legislativo, Executivo, Judiciário e Moderador. O Poder Moderador, atribuído ao imperador, funcionava como uma chave de coordenação e de forte autoridade sobre o sistema.',
    image: IMG.constitution1824,
    source: 'Arquivo Nacional / Wikimedia Commons',
  },
  {
    year: '1891',
    title: 'República e três Poderes',
    tone: 'República',
    text: 'Com a República, desaparece o Poder Moderador e ganha forma o desenho republicano clássico de Executivo, Legislativo e Judiciário, associado ao federalismo presidencialista.',
    image: IMG.constitution1891,
    source: 'Arquivo Nacional / Wikimedia Commons',
  },
  {
    year: '1934',
    title: 'Nova ordem constitucional',
    tone: 'Constituição',
    text: 'A Constituição de 1934 preservou a separação institucional e ampliou a presença de temas sociais e trabalhistas na ordem constitucional brasileira.',
  },
  {
    year: '1937',
    title: 'Estado Novo e concentração',
    tone: 'Autoritarismo',
    text: 'No Estado Novo, o equilíbrio entre os Poderes foi profundamente reduzido. O Congresso foi fechado e o Executivo concentrou enorme capacidade de decisão.',
    image: IMG.vargas,
    source: 'Wikimedia Commons',
  },
  {
    year: '1946',
    title: 'Retorno democrático',
    tone: 'Redemocratização',
    text: 'A Constituição de 1946 recompôs instituições representativas e reafirmou a separação entre os Poderes após o fim do Estado Novo.',
    image: IMG.constitution1946,
    source: 'Arquivo Nacional / Wikimedia Commons',
  },
  {
    year: '1967',
    title: 'Regime militar',
    tone: 'Regime',
    text: 'A Constituição de 1967 surgiu em um contexto de forte limitação das liberdades políticas e de fortalecimento institucional do Executivo. Atos Institucionais alteraram profundamente a vida constitucional do período.',
  },
  {
    year: '1988',
    title: 'Constituição Cidadã',
    tone: 'Democracia',
    text: 'A Constituição de 1988 consolidou a ordem democrática contemporânea e, em seu artigo 2º, definiu Legislativo, Executivo e Judiciário como independentes e harmônicos entre si.',
    image: IMG.ulysses1988,
    source: 'Agência Brasil / Wikimedia Commons',
  },
];

const glossary = [
  ['Constituição', 'Norma fundamental que organiza o Estado, define competências e protege direitos.'],
  ['Sanção', 'Ato pelo qual o chefe do Executivo concorda com um projeto aprovado pelo Legislativo.'],
  ['Veto', 'Recusa total ou parcial do Executivo a um projeto. O Legislativo pode apreciá-lo.'],
  ['Bicameralismo', 'Sistema em que o Legislativo federal possui duas Casas: Câmara e Senado.'],
  ['Inconstitucionalidade', 'Situação em que uma norma ou ato entra em conflito com a Constituição.'],
  ['Freios e contrapesos', 'Mecanismos de controle recíproco entre instituições para impedir concentração excessiva de poder.'],
];

const refs = [
  ['Constituição Federal de 1988', 'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm'],
  ['Constituição do Império de 1824', 'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao24.htm'],
  ['Câmara dos Deputados', 'https://www.camara.leg.br/'],
  ['Senado Federal', 'https://www12.senado.leg.br/hpsenado'],
  ['Supremo Tribunal Federal', 'https://portal.stf.jus.br/'],
  ['Conselho Nacional de Justiça', 'https://www.cnj.jus.br/'],
  ['Presidência da República', 'https://www.gov.br/planalto/pt-br'],
  ['Tribunal Superior Eleitoral', 'https://www.tse.jus.br/'],
  ['Arquivo Nacional', 'https://www.gov.br/arquivonacional/pt-br'],
  ['Wikimedia Commons — acervos históricos', 'https://commons.wikimedia.org/'],
];

const chapters = ['capa', 'abertura', 'origem', 'poderes', 'equilibrio', 'esferas', 'constituicoes', 'rupturas', 'hoje', 'problema', 'quiz', 'fontes'];

function Icon({ name, size = 22, className = '' }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    className,
    'aria-hidden': true,
  };

  const paths = {
    arrow: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
    down: <><path d="M12 5v14"/><path d="m6 13 6 6 6-6"/></>,
    book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v16H6.5A2.5 2.5 0 0 0 4 21.5z"/><path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v16h4.5a2.5 2.5 0 0 1 2.5 2.5z"/></>,
    scale: <><path d="M12 3v18"/><path d="M6 7h12"/><path d="m6 7-3 6h6z"/><path d="m18 7-3 6h6z"/><path d="M8 21h8"/></>,
    building: <><path d="M4 21h16"/><path d="M6 21V9l6-4 6 4v12"/><path d="M9 12h.01M12 12h.01M15 12h.01M9 16h.01M15 16h.01"/></>,
    landmark: <><path d="M3 10h18"/><path d="M5 10v8M9 10v8M15 10v8M19 10v8"/><path d="M2 21h20"/><path d="m12 3 9 4H3z"/></>,
    shield: <><path d="M12 3 4.5 6v5.5c0 4.7 3.2 7.9 7.5 9.5 4.3-1.6 7.5-4.8 7.5-9.5V6z"/><path d="m9 12 2 2 4-4"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    quote: <><path d="M7 17H4a2 2 0 0 1-2-2v-3a5 5 0 0 1 5-5v2a3 3 0 0 0-3 3h3z"/><path d="M18 17h-3a2 2 0 0 1-2-2v-3a5 5 0 0 1 5-5v2a3 3 0 0 0-3 3h3z"/></>,
    external: <><path d="M14 3h7v7"/><path d="M10 14 21 3"/><path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/></>,
    expand: <><path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5"/></>,
    left: <><path d="M19 12H5"/><path d="m11 18-6-6 6-6"/></>,
    right: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
    close: <><path d="m5 5 14 14"/><path d="M19 5 5 19"/></>,
    spark: <><path d="m12 3 1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6z"/><path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/></>,
  };

  return <svg {...common}>{paths[name]}</svg>;
}

function ChapterLabel({ number, children }) {
  return (
    <div className="chapter-label">
      <span>CAPÍTULO {String(number).padStart(2, '0')}</span>
      <i />
      <b>{children}</b>
    </div>
  );
}

function Reveal({ children, className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible');
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref} className={`reveal ${className}`}>{children}</div>;
}

function HistoricalImage({ src, alt, caption, source, className = '' }) {
  return (
    <figure className={`historical-image ${className}`}>
      <div className="photo-shell">
        <img src={src} alt={alt} loading="lazy" />
        <span className="photo-corner corner-a" />
        <span className="photo-corner corner-b" />
      </div>
      <figcaption>
        <strong>{caption}</strong>
        {source && <span>Fonte da imagem: {source}</span>}
      </figcaption>
    </figure>
  );
}

function BookScene() {
  const mount = useRef(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const el = mount.current;
    if (!el) return;

    let renderer;
    let raf;
    let resize;
    let pointer;

    try {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(42, el.clientWidth / el.clientHeight, 0.1, 100);
      camera.position.set(0, 0.1, 9);

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
      renderer.setSize(el.clientWidth, el.clientHeight);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.02;
      el.appendChild(renderer.domElement);

      scene.add(new THREE.AmbientLight(0xf3ddbd, 1.8));

      const warm = new THREE.PointLight(0xffd49c, 35, 20);
      warm.position.set(-4, 4, 7);
      scene.add(warm);

      const cool = new THREE.PointLight(0x7a9c93, 20, 14);
      cool.position.set(5, -3, 5);
      scene.add(cool);

      const group = new THREE.Group();
      group.rotation.set(-0.08, -0.34, -0.02);
      scene.add(group);

      const leather = new THREE.MeshPhysicalMaterial({
        color: 0x4a1f1d,
        roughness: 0.56,
        metalness: 0.04,
        clearcoat: 0.15,
      });

      const gold = new THREE.MeshStandardMaterial({
        color: 0xcaa76a,
        roughness: 0.34,
        metalness: 0.58,
      });

      const paper = new THREE.MeshStandardMaterial({
        color: 0xe7d7b9,
        roughness: 0.88,
        metalness: 0,
      });

      const pages = new THREE.Mesh(new THREE.BoxGeometry(4.18, 5.46, 0.74), paper);
      pages.position.z = 0;
      group.add(pages);

      const coverFront = new THREE.Mesh(new THREE.BoxGeometry(4.46, 5.78, 0.16), leather);
      coverFront.position.z = 0.45;
      group.add(coverFront);

      const coverBack = new THREE.Mesh(new THREE.BoxGeometry(4.46, 5.78, 0.16), leather);
      coverBack.position.z = -0.45;
      group.add(coverBack);

      const spine = new THREE.Mesh(new THREE.BoxGeometry(0.25, 5.76, 0.94), leather);
      spine.position.set(-2.12, 0, 0);
      group.add(spine);

      const border = new THREE.Mesh(new THREE.BoxGeometry(3.96, 5.26, 0.026), gold);
      border.position.z = 0.545;
      group.add(border);

      const inset = new THREE.Mesh(new THREE.BoxGeometry(3.68, 4.98, 0.032), leather);
      inset.position.z = 0.565;
      group.add(inset);

      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1400;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#4a1f1d';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#cba968';
      ctx.lineWidth = 12;
      ctx.strokeRect(78, 78, 868, 1244);
      ctx.lineWidth = 3;
      ctx.strokeRect(105, 105, 814, 1190);
      ctx.textAlign = 'center';
      ctx.fillStyle = '#d8ba79';
      ctx.font = '600 52px Georgia';
      ctx.fillText('HISTÓRIA POLÍTICA DO BRASIL', 512, 260);
      ctx.font = '700 116px Georgia';
      ctx.fillText('OS TRÊS', 512, 555);
      ctx.fillText('PODERES', 512, 690);
      ctx.font = 'italic 45px Georgia';
      ctx.fillText('1824 · 1891 · 1937 · 1946 · 1988', 512, 865);
      ctx.font = '500 38px Georgia';
      ctx.fillText('Executivo · Legislativo · Judiciário', 512, 1055);
      ctx.font = '600 31px Georgia';
      ctx.fillText('GRUPO 1 · SEMINÁRIO DE HISTÓRIA', 512, 1195);

      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      const titlePlane = new THREE.Mesh(
        new THREE.PlaneGeometry(3.64, 5.0),
        new THREE.MeshBasicMaterial({ map: texture, transparent: false })
      );
      titlePlane.position.z = 0.59;
      group.add(titlePlane);

      const pageLines = [];
      for (let i = 0; i < 18; i += 1) {
        const line = new THREE.Mesh(new THREE.BoxGeometry(0.025, 5.28, 0.71), gold);
        line.position.set(2.1 + Math.sin(i) * 0.008, 0, -0.02 + i * 0.001);
        line.scale.x = 0.16;
        line.material = new THREE.MeshStandardMaterial({ color: 0xa88456, roughness: 0.8, metalness: 0.05 });
        group.add(line);
        pageLines.push(line);
      }

      const dustGeo = new THREE.BufferGeometry();
      const count = 240;
      const points = new Float32Array(count * 3);
      for (let i = 0; i < count; i += 1) {
        points[i * 3] = (Math.random() - 0.5) * 14;
        points[i * 3 + 1] = (Math.random() - 0.5) * 11;
        points[i * 3 + 2] = (Math.random() - 0.5) * 10;
      }
      dustGeo.setAttribute('position', new THREE.BufferAttribute(points, 3));
      const dust = new THREE.Points(
        dustGeo,
        new THREE.PointsMaterial({ color: 0xdac59f, size: 0.025, transparent: true, opacity: 0.48 })
      );
      scene.add(dust);

      let mx = 0;
      let my = 0;
      pointer = (event) => {
        const rect = el.getBoundingClientRect();
        mx = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
        my = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      };
      el.addEventListener('pointermove', pointer);

      const clock = new THREE.Clock();
      const loop = () => {
        const t = clock.getElapsedTime();
        group.position.y = Math.sin(t * 0.75) * 0.08;
        group.rotation.y += ((-0.34 + mx * 0.13) - group.rotation.y) * 0.035;
        group.rotation.x += ((-0.08 - my * 0.07) - group.rotation.x) * 0.035;
        dust.rotation.y += 0.0004;
        renderer.render(scene, camera);
        raf = requestAnimationFrame(loop);
      };
      loop();

      resize = () => {
        camera.aspect = el.clientWidth / el.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(el.clientWidth, el.clientHeight);
      };
      window.addEventListener('resize', resize);
    } catch (error) {
      console.error('Falha ao renderizar o livro 3D:', error);
      setFallback(true);
    }

    return () => {
      if (raf) cancelAnimationFrame(raf);
      if (resize) window.removeEventListener('resize', resize);
      if (pointer && el) el.removeEventListener('pointermove', pointer);
      renderer?.dispose();
      if (el) el.innerHTML = '';
    };
  }, []);

  if (fallback) {
    return (
      <div className="book-fallback">
        <div className="fallback-cover">
          <small>HISTÓRIA POLÍTICA DO BRASIL</small>
          <strong>OS TRÊS<br />PODERES</strong>
          <span>1824 · 1891 · 1937 · 1946 · 1988</span>
        </div>
      </div>
    );
  }

  return <div className="book-canvas" ref={mount} />;
}

function PowerIcon({ id }) {
  return <Icon name={id === 'executivo' ? 'building' : id === 'legislativo' ? 'landmark' : 'scale'} size={44} />;
}

function Quiz() {
  const questions = [
    ['Qual Constituição brasileira criou o Poder Moderador?', ['1891', '1824', '1988'], 1],
    ['Quem aprova leis e fiscaliza politicamente o Executivo?', ['Legislativo', 'Judiciário', 'Ministério Público'], 0],
    ['O município possui Poder Judiciário próprio?', ['Sim', 'Não', 'Somente capitais'], 1],
    ['O que melhor resume os freios e contrapesos?', ['Um Poder controla todos os demais', 'Poderes sem qualquer contato', 'Controles recíprocos para limitar abusos'], 2],
    ['Qual Constituição marca a redemocratização contemporânea?', ['1937', '1967', '1988'], 2],
  ];

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const done = index >= questions.length;

  const choose = (option) => {
    if (selected !== null) return;
    setSelected(option);
    if (option === questions[index][2]) setScore((value) => value + 1);
    setTimeout(() => {
      setSelected(null);
      setIndex((value) => value + 1);
    }, 750);
  };

  return (
    <div className="quiz-card">
      <div className="quiz-topline">
        <span>PERGUNTA AO PLENÁRIO</span>
        <b>{done ? 'FIM' : `${index + 1} / ${questions.length}`}</b>
      </div>

      <AnimatePresence mode="wait">
        {!done ? (
          <motion.div
            key={index}
            className="quiz-content"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
          >
            <h3>{questions[index][0]}</h3>
            <div className="quiz-options">
              {questions[index][1].map((answer, answerIndex) => {
                let state = '';
                if (selected !== null) {
                  if (answerIndex === selected) state = answerIndex === questions[index][2] ? 'correct' : 'wrong';
                  else if (answerIndex === questions[index][2]) state = 'correct';
                  else state = 'dim';
                }

                return (
                  <button key={answer} className={`quiz-option ${state}`} onClick={() => choose(answerIndex)}>
                    <span>{String.fromCharCode(65 + answerIndex)}</span>
                    {answer}
                  </button>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="done"
            className="quiz-result"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Icon name="spark" size={42} />
            <strong>{score}/{questions.length}</strong>
            <p>{score >= 4 ? 'A turma já pode sair daqui discutindo Constituição no recreio.' : 'Boa. Repassar a linha do tempo já coloca tudo no lugar.'}</p>
            <button onClick={() => { setIndex(0); setSelected(null); setScore(0); }}>Recomeçar</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function App() {
  const [activePower, setActivePower] = useState(0);
  const [presenting, setPresenting] = useState(false);
  const [chapterIndex, setChapterIndex] = useState(0);
  const halo = useRef(null);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const power = powers[activePower];

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.02, smoothWheel: true });
    let raf;
    const frame = (time) => {
      lenis.raf(time);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    const move = (event) => {
      halo.current?.animate(
        { transform: `translate3d(${event.clientX - 190}px, ${event.clientY - 190}px, 0)` },
        { duration: 650, fill: 'forwards' }
      );
    };
    window.addEventListener('pointermove', move);
    return () => window.removeEventListener('pointermove', move);
  }, []);

  const go = (delta) => {
    const next = Math.max(0, Math.min(chapters.length - 1, chapterIndex + delta));
    setChapterIndex(next);
    document.getElementById(chapters[next])?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!presenting) return;
    const onKey = (event) => {
      if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(event.key)) {
        event.preventDefault();
        go(1);
      }
      if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(event.key)) {
        event.preventDefault();
        go(-1);
      }
      if (event.key === 'Escape') setPresenting(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [presenting, chapterIndex]);

  const startPresentation = async () => {
    setPresenting(true);
    setChapterIndex(0);
    document.getElementById('capa')?.scrollIntoView({ behavior: 'smooth' });
    try {
      await document.documentElement.requestFullscreen?.();
    } catch {}
  };

  const stopPresentation = async () => {
    setPresenting(false);
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
    } catch {}
  };

  return (
    <div className={presenting ? 'presentation' : ''}>
      <div className="paper-noise" />
      <div className="cursor-halo" ref={halo} />
      <motion.div className="reading-progress" style={{ scaleX: progress }} />

      <header className="topbar">
        <a className="brand" href="#capa">
          <span className="seal">CEJ</span>
          <div>
            <strong>SEMINÁRIO DE HISTÓRIA</strong>
            <small>Quem governa o Brasil?</small>
          </div>
        </a>

        <nav>
          <a href="#poderes">Os Poderes</a>
          <a href="#constituicoes">Constituições</a>
          <a href="#problema">Questão central</a>
          <button onClick={startPresentation}>
            <Icon name="expand" size={15} /> Apresentar
          </button>
        </nav>
      </header>

      <main>
        <section id="capa" className="hero chapter-page">
          <div className="hero-copy">
            <motion.span className="edition" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              GRUPO 1 · EDUCAÇÃO POLÍTICA, PODERES E VOTO NO BRASIL
            </motion.span>

            <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}>
              Quem governa<br /><em>o Brasil?</em>
            </motion.h1>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.38 }}>
              Um seminário em formato de <strong>livro de história interativo</strong> sobre a divisão do poder no Brasil,
              suas instituições, suas Constituições e os momentos em que esse equilíbrio foi fortalecido ou enfraquecido.
            </motion.p>

            <motion.div className="hero-actions" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.52 }}>
              <a href="#abertura" className="ink-button">Abrir o livro <Icon name="down" size={16} /></a>
              <button className="paper-button" onClick={startPresentation}><Icon name="expand" size={16} /> Modo seminário</button>
            </motion.div>

            <div className="hero-index">
              <span>1824</span><i />
              <span>1891</span><i />
              <span>1937</span><i />
              <span>1946</span><i />
              <span>1988</span>
            </div>
          </div>

          <motion.div className="hero-book" initial={{ opacity: 0, scale: 0.94, rotateY: 8 }} animate={{ opacity: 1, scale: 1, rotateY: 0 }} transition={{ duration: 1 }}>
            <BookScene />
          </motion.div>
        </section>

        <section id="abertura" className="section chapter-page">
          <ChapterLabel number={1}>O problema do poder</ChapterLabel>
          <div className="spread">
            <Reveal className="prose-page">
              <span className="dropcap">P</span>
              <p>
                Toda organização política enfrenta uma pergunta antiga: <strong>quem decide e quem limita quem decide?</strong>
                Um Estado precisa agir, criar regras e resolver conflitos. O risco aparece quando todas essas funções ficam
                concentradas no mesmo centro de autoridade.
              </p>
              <p>
                A Constituição brasileira de 1988 responde a esse problema organizando o Estado em três Poderes
                “independentes e harmônicos entre si”: Legislativo, Executivo e Judiciário. A independência impede submissão
                completa; a harmonia exige convivência institucional e controles recíprocos.
              </p>
              <blockquote>
                <Icon name="quote" size={24} />
                <p>“São Poderes da União, independentes e harmônicos entre si, o Legislativo, o Executivo e o Judiciário.”</p>
                <cite>Constituição Federal de 1988, art. 2º</cite>
              </blockquote>
            </Reveal>

            <Reveal>
              <HistoricalImage
                src={IMG.congress}
                alt="Palácio do Congresso Nacional em Brasília"
                caption="Palácio do Congresso Nacional, Brasília."
                source="Wikimedia Commons"
                className="hero-photo"
              />
              <div className="margin-note">
                <b>IDEIA-CHAVE</b>
                <p>Separar os Poderes não significa colocá-los em mundos diferentes. O sistema funciona justamente porque eles se cruzam, limitam e fiscalizam.</p>
              </div>
            </Reveal>
          </div>
        </section>

        <section id="origem" className="section chapter-page">
          <ChapterLabel number={2}>De onde vem a ideia de dividir o poder?</ChapterLabel>

          <Reveal className="chapter-heading">
            <h2>Antes de ser uma regra brasileira,<br />a separação era uma <em>ideia política.</em></h2>
            <p>
              A tradição constitucional moderna desenvolveu a defesa de que funções estatais diferentes deveriam ser
              distribuídas entre instituições distintas. Montesquieu, no século XVIII, tornou-se uma referência clássica
              dessa formulação.
            </p>
          </Reveal>

          <div className="origin-grid">
            <Reveal className="origin-card">
              <span>01</span>
              <h3>Evitar o poder absoluto</h3>
              <p>Quando a mesma autoridade cria a regra, executa a regra e julga a própria atuação, os controles ficam frágeis.</p>
            </Reveal>
            <Reveal className="origin-card">
              <span>02</span>
              <h3>Distribuir funções</h3>
              <p>Governar, legislar e julgar passam a ser funções com centros institucionais próprios.</p>
            </Reveal>
            <Reveal className="origin-card">
              <span>03</span>
              <h3>Criar limites</h3>
              <p>O objetivo não é paralisar o Estado, mas impedir que uma instituição possa agir sem qualquer controle.</p>
            </Reveal>
          </div>

          <Reveal className="archive-strip">
            <HistoricalImage
              src={IMG.pedro}
              alt="Retrato de Dom Pedro I"
              caption="Dom Pedro I, primeiro imperador do Brasil."
              source="Museu Imperial / Wikimedia Commons"
            />
            <div className="archive-copy">
              <span>NO BRASIL</span>
              <h3>1824: a separação chegou com uma particularidade.</h3>
              <p>
                A Constituição do Império adotou Legislativo, Executivo e Judiciário, mas acrescentou um quarto poder:
                o <strong>Poder Moderador</strong>, entregue ao imperador. Essa arquitetura dava ao monarca instrumentos
                importantes de intervenção sobre o funcionamento político.
              </p>
            </div>
          </Reveal>
        </section>

        <section id="poderes" className="section chapter-page">
          <ChapterLabel number={3}>Anatomia dos Três Poderes</ChapterLabel>

          <Reveal className="chapter-heading">
            <h2>Três instituições,<br /><em>três funções centrais.</em></h2>
            <p>Clique nos marcadores para trocar de página e explorar cada Poder.</p>
          </Reveal>

          <div className="power-book">
            <div className="power-tabs">
              {powers.map((item, index) => (
                <button
                  key={item.id}
                  className={activePower === index ? 'active' : ''}
                  style={{ '--accent': COLORS[item.id] }}
                  onClick={() => setActivePower(index)}
                >
                  <span>{item.number}</span>
                  <div>
                    <strong>{item.title}</strong>
                    <small>{item.short}</small>
                  </div>
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.article
                key={power.id}
                className="power-page"
                style={{ '--accent': COLORS[power.id] }}
                initial={{ opacity: 0, x: 28, rotateY: 2 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.36 }}
              >
                <div className="power-emblem">
                  <span>{power.number}</span>
                  <PowerIcon id={power.id} />
                </div>

                <div className="power-copy">
                  <small>FUNÇÃO CENTRAL</small>
                  <h3>{power.short}</h3>
                  <p className="lead">{power.lead}</p>
                  {power.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}

                  <ul>
                    {power.bullets.map((bullet) => (
                      <li key={bullet}><Icon name="check" size={16} /><span>{bullet}</span></li>
                    ))}
                  </ul>

                  <aside>
                    <b>NOTA DE MARGEM</b>
                    <p>{power.note}</p>
                  </aside>
                </div>
              </motion.article>
            </AnimatePresence>
          </div>
        </section>

        <section id="equilibrio" className="section chapter-page">
          <ChapterLabel number={4}>Freios e contrapesos</ChapterLabel>

          <div className="balance-layout">
            <Reveal className="balance-copy">
              <h2>O sistema funciona porque<br /><em>ninguém tem a última palavra em tudo.</em></h2>
              <p>
                Em vez de uma separação rígida, a Constituição cria pontos de contato. Cada Poder tem autonomia,
                mas determinadas decisões dependem da atuação ou do controle de outro.
              </p>

              <div className="checks-list">
                <div>
                  <span>01</span>
                  <p><strong>O Congresso aprova uma lei.</strong> O Presidente pode sancioná-la ou vetá-la.</p>
                </div>
                <div>
                  <span>02</span>
                  <p><strong>O veto não encerra necessariamente a história.</strong> O Congresso pode apreciá-lo e, nas condições constitucionais, derrubá-lo.</p>
                </div>
                <div>
                  <span>03</span>
                  <p><strong>Uma lei em vigor ainda pode ser questionada.</strong> O Judiciário pode exercer controle de constitucionalidade.</p>
                </div>
                <div>
                  <span>04</span>
                  <p><strong>Há controles cruzados na escolha de autoridades.</strong> O Presidente indica ministros do STF e o Senado aprecia essas indicações.</p>
                </div>
              </div>
            </Reveal>

            <Reveal className="balance-visual">
              <div className="scale-stage">
                <span className="scale-line" />
                <div className="scale-center"><Icon name="scale" size={54} /><b>equilíbrio</b></div>
                <div className="scale-node node-exe"><Icon name="building" size={30} /><strong>Executivo</strong></div>
                <div className="scale-node node-leg"><Icon name="landmark" size={30} /><strong>Legislativo</strong></div>
                <div className="scale-node node-jud"><Icon name="scale" size={30} /><strong>Judiciário</strong></div>
              </div>
              <div className="annotation">
                <span>↑</span>
                <p>Os controles não existem para “atrapalhar” o governo. Eles existem para tornar o exercício do poder juridicamente limitado e politicamente fiscalizável.</p>
              </div>
            </Reveal>
          </div>
        </section>

        <section id="esferas" className="section chapter-page">
          <ChapterLabel number={5}>Do Brasil ao município</ChapterLabel>

          <Reveal className="chapter-heading">
            <h2>O mesmo princípio aparece<br /><em>em escalas diferentes.</em></h2>
            <p>A estrutura varia conforme a esfera federativa.</p>
          </Reveal>

          <div className="sphere-table">
            <Reveal className="sphere-row header">
              <span>ESFERA</span><span>EXECUTIVO</span><span>LEGISLATIVO</span><span>JUDICIÁRIO</span>
            </Reveal>
            <Reveal className="sphere-row">
              <strong>União</strong><span>Presidente da República</span><span>Congresso Nacional</span><span>STF, STJ e Justiça Federal, entre outros ramos</span>
            </Reveal>
            <Reveal className="sphere-row">
              <strong>Estado</strong><span>Governador</span><span>Assembleia Legislativa</span><span>Tribunal de Justiça e juízes estaduais</span>
            </Reveal>
            <Reveal className="sphere-row">
              <strong>Município</strong><span>Prefeito</span><span>Câmara de Vereadores</span><span><em>Não possui Poder Judiciário municipal próprio</em></span>
            </Reveal>
          </div>

          <Reveal className="curiosity">
            <b>CURIOSIDADE QUE PODE CAIR NA PERGUNTA DO PROFESSOR</b>
            <p>
              A existência de prefeito e vereadores não significa que todo município tenha “três poderes municipais”.
              A Justiça que atua em causas locais pertence às estruturas estadual ou federal, conforme o caso.
            </p>
          </Reveal>
        </section>

        <section id="constituicoes" className="section chapter-page">
          <ChapterLabel number={6}>O poder através das Constituições</ChapterLabel>

          <Reveal className="chapter-heading">
            <h2>Um país, várias Constituições,<br /><em>diferentes equilíbrios.</em></h2>
            <p>
              A história constitucional brasileira mostra que a relação entre os Poderes muda quando o regime político muda.
              Aqui está o fio principal para o seminário.
            </p>
          </Reveal>

          <div className="constitution-timeline">
            {constitutions.map((item, index) => (
              <Reveal key={item.year} className={`constitution-entry ${item.image ? 'with-image' : ''}`}>
                <div className="timeline-year">
                  <span>{item.year}</span>
                  <i />
                </div>
                <div className="timeline-copy">
                  <small>{item.tone}</small>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
                {item.image && (
                  <HistoricalImage
                    src={item.image}
                    alt={`${item.title} — ${item.year}`}
                    caption={`${item.year} — ${item.title}`}
                    source={item.source}
                  />
                )}
              </Reveal>
            ))}
          </div>
        </section>

        <section id="rupturas" className="section chapter-page">
          <ChapterLabel number={7}>Quando o equilíbrio enfraquece</ChapterLabel>

          <div className="rupture-grid">
            <Reveal className="rupture-copy">
              <h2>Separação de Poderes também é uma forma de medir<br /><em>a saúde de um regime político.</em></h2>
              <p>
                Em períodos autoritários, uma característica recorrente é a redução da autonomia de instituições de controle,
                da competição política e da capacidade de fiscalização.
              </p>

              <div className="rupture-cases">
                <article>
                  <span>1937</span>
                  <h3>Estado Novo</h3>
                  <p>O fechamento do Congresso e a concentração decisória no Executivo enfraqueceram drasticamente o equilíbrio institucional.</p>
                </article>
                <article>
                  <span>1964–1985</span>
                  <h3>Regime militar</h3>
                  <p>Atos Institucionais, restrições políticas e mudanças constitucionais ampliaram o poder do Executivo e limitaram mecanismos democráticos.</p>
                </article>
              </div>
            </Reveal>

            <Reveal>
              <HistoricalImage
                src={IMG.vargas}
                alt="Retrato de Getúlio Vargas"
                caption="Getúlio Vargas. O Estado Novo começou em 1937."
                source="Wikimedia Commons"
                className="portrait-photo"
              />
              <div className="archival-caption">
                <b>LEITURA HISTÓRICA</b>
                <p>O ponto não é que todo Executivo forte seja autoritário. O problema é quando controles institucionais deixam de funcionar ou podem ser ignorados.</p>
              </div>
            </Reveal>
          </div>
        </section>

        <section id="hoje" className="section chapter-page">
          <ChapterLabel number={8}>Como isso aparece hoje?</ChapterLabel>

          <div className="today-spread">
            <Reveal>
              <HistoricalImage
                src={IMG.promulgacao1988}
                alt="Promulgação da Constituição de 1988"
                caption="Promulgação da Constituição Federal de 1988 no Congresso Nacional."
                source="Wikimedia Commons / Agência Brasil"
                className="wide-photo"
              />
            </Reveal>

            <Reveal className="today-copy">
              <span className="small-title">DA CONSTITUINTE AO PRESENTE</span>
              <h2>A Constituição de 1988 é o ponto de referência do sistema atual.</h2>
              <p>
                Ela combina separação de Poderes, direitos fundamentais, eleições periódicas, federalismo e mecanismos de controle.
                Em termos de seminário, o ponto mais importante é perceber que <strong>governar não é apenas executar</strong>:
                decisões públicas passam por instituições diferentes.
              </p>

              <div className="law-route">
                <div><span>1</span><p>Uma proposta é debatida e aprovada no Legislativo.</p></div>
                <Icon name="arrow" />
                <div><span>2</span><p>O Executivo sanciona ou veta, conforme o processo constitucional.</p></div>
                <Icon name="arrow" />
                <div><span>3</span><p>A aplicação da norma pode chegar ao Judiciário se houver conflito ou dúvida constitucional.</p></div>
              </div>
            </Reveal>
          </div>
        </section>

        <section id="problema" className="section chapter-page">
          <ChapterLabel number={9}>A questão central do trabalho</ChapterLabel>

          <Reveal className="problem-page">
            <span className="problem-number">?</span>
            <h2>Por que é importante que o poder do Estado não fique concentrado em uma única instituição?</h2>

            <div className="answer-columns">
              <article>
                <small>SE HÁ CONCENTRAÇÃO</small>
                <h3>O risco de abuso cresce</h3>
                <p>Menos fiscalização, menos possibilidade de revisão e maior dificuldade para impedir decisões arbitrárias.</p>
              </article>
              <article>
                <small>SE HÁ SEPARAÇÃO E CONTROLE</small>
                <h3>O poder encontra limites</h3>
                <p>Decisões podem ser debatidas, fiscalizadas, vetadas, revistas ou julgadas conforme regras previamente estabelecidas.</p>
              </article>
            </div>

            <blockquote>
              <Icon name="shield" size={28} />
              <p>
                <strong>Resposta do grupo:</strong> a separação dos Poderes não elimina conflitos políticos, mas impede que o Estado
                dependa da vontade isolada de uma única autoridade. Ela distribui funções, cria controles recíprocos e protege a
                continuidade das instituições democráticas.
              </p>
            </blockquote>
          </Reveal>

          <Reveal className="glossary">
            <span className="small-title">GLOSSÁRIO PARA A APRESENTAÇÃO</span>
            <div className="glossary-grid">
              {glossary.map(([term, definition]) => (
                <article key={term}><strong>{term}</strong><p>{definition}</p></article>
              ))}
            </div>
          </Reveal>
        </section>

        <section id="quiz" className="section chapter-page">
          <ChapterLabel number={10}>Fechamento interativo</ChapterLabel>
          <Reveal className="chapter-heading">
            <h2>Antes de fechar o livro,<br /><em>teste a turma.</em></h2>
            <p>O quiz funciona bem para os últimos dois minutos do seminário.</p>
          </Reveal>
          <Reveal><Quiz /></Reveal>
        </section>

        <section id="fontes" className="section chapter-page sources-section">
          <ChapterLabel number={11}>Fontes, documentos e imagens</ChapterLabel>

          <Reveal className="chapter-heading">
            <h2>Pesquisa com base<br /><em>institucional e documental.</em></h2>
            <p>As referências abaixo sustentam o conteúdo e os documentos históricos usados na experiência.</p>
          </Reveal>

          <div className="source-grid">
            {refs.map(([label, url], index) => (
              <Reveal key={url}>
                <a className="source-link" href={url} target="_blank" rel="noreferrer">
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <strong>{label}</strong>
                  <Icon name="external" size={16} />
                </a>
              </Reveal>
            ))}
          </div>

          <Reveal className="image-credits">
            <b>CRÉDITOS VISUAIS</b>
            <p>
              Imagens históricas provenientes de acervos públicos e páginas do Wikimedia Commons, incluindo Arquivo Nacional,
              Museu Imperial e Agência Brasil. Cada fotografia ou documento aparece acompanhado de sua indicação de fonte no site.
            </p>
          </Reveal>

          <Reveal className="colophon">
            <span className="seal large">CEJ</span>
            <div>
              <small>COLÉGIO EVANGÉLICO JARAGUÁ</small>
              <strong>Educação Política, Poderes e Voto no Brasil</strong>
              <p>Grupo 1 · Quem governa o Brasil? Conhecendo os três Poderes</p>
            </div>
          </Reveal>
        </section>
      </main>

      <footer>
        <span>FIM DO VOLUME</span>
        <strong>OS TRÊS PODERES NO BRASIL</strong>
        <a href="#capa">Voltar à capa ↑</a>
      </footer>

      {presenting && (
        <div className="presentation-controls">
          <button onClick={() => go(-1)} aria-label="Capítulo anterior"><Icon name="left" size={18} /></button>
          <span>{chapterIndex + 1} / {chapters.length}</span>
          <button onClick={() => go(1)} aria-label="Próximo capítulo"><Icon name="right" size={18} /></button>
          <button onClick={stopPresentation} aria-label="Sair do modo apresentação"><Icon name="close" size={18} /></button>
        </div>
      )}
    </div>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error(error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="fatal">
          <div>
            <b>O livro não conseguiu abrir.</b>
            <p>Atualize a página. Se continuar, tente Chrome, Edge ou Firefox.</p>
            <small>{String(this.state.error?.message || this.state.error)}</small>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
