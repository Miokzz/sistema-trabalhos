
import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import * as THREE from 'three';
import Lenis from 'lenis';
import './styles.css';

const COLORS = {
  executivo: '#57f2a1',
  legislativo: '#ffd05b',
  judiciario: '#9f82ff',
};

const powers = [
  {
    id: 'executivo',
    index: '01',
    title: 'Executivo',
    role: 'Governa e administra',
    summary:
      'Executa as leis, administra o Estado e transforma decisões políticas em ações, serviços e políticas públicas.',
    items: [
      'Na União, é exercido pelo Presidente da República e seus ministros.',
      'Nos estados, o chefe do Executivo é o governador.',
      'Nos municípios, o chefe do Executivo é o prefeito.',
      'Pode propor projetos, sancionar ou vetar leis e administrar o orçamento dentro das regras legais.',
    ],
    phrase: 'Decisão vira ação.',
  },
  {
    id: 'legislativo',
    index: '02',
    title: 'Legislativo',
    role: 'Representa, legisla e fiscaliza',
    summary:
      'Cria e debate leis, fiscaliza o Poder Executivo e representa a sociedade e os entes da Federação.',
    items: [
      'Na União, o Congresso Nacional é formado pela Câmara dos Deputados e pelo Senado Federal.',
      'Nos estados, a função é exercida pelas Assembleias Legislativas.',
      'Nos municípios, pelas Câmaras de Vereadores.',
      'Também analisa orçamento, fiscaliza gastos e participa de mecanismos de controle político.',
    ],
    phrase: 'Voz vira regra.',
  },
  {
    id: 'judiciario',
    index: '03',
    title: 'Judiciário',
    role: 'Julga e garante direitos',
    summary:
      'Resolve conflitos, interpreta e aplica as leis e protege a Constituição e os direitos fundamentais.',
    items: [
      'É formado por tribunais e juízes em diferentes ramos e instâncias.',
      'O Supremo Tribunal Federal é o guardião da Constituição Federal.',
      'Pode controlar a constitucionalidade de leis e atos do poder público.',
      'Não existe um Poder Judiciário municipal próprio.',
    ],
    phrase: 'Conflito vira decisão.',
  },
];

const history = [
  ['1824', 'Constituição do Império', 'Havia quatro poderes: Legislativo, Executivo, Judiciário e Poder Moderador, exercido pelo imperador.'],
  ['1891', 'República', 'A primeira Constituição republicana consolida a estrutura dos três poderes clássicos no novo regime.'],
  ['1937', 'Estado Novo', 'A ordem autoritária ampliou a concentração de poder no Executivo e enfraqueceu o equilíbrio institucional.'],
  ['1946', 'Redemocratização', 'A nova Constituição recompõe a vida democrática e fortalece novamente a separação entre os poderes.'],
  ['1964–1985', 'Regime militar', 'O período marcou limitações às instituições democráticas e aos mecanismos de participação e controle.'],
  ['1988', 'Constituição Cidadã', 'A Constituição atual define Legislativo, Executivo e Judiciário como poderes independentes e harmônicos entre si.'],
];

const refs = [
  ['Constituição Federal de 1988', 'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm'],
  ['Constituição do Império de 1824', 'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao24.htm'],
  ['Câmara dos Deputados', 'https://www.camara.leg.br/'],
  ['Senado Federal', 'https://www12.senado.leg.br/hpsenado'],
  ['Supremo Tribunal Federal', 'https://portal.stf.jus.br/'],
  ['Conselho Nacional de Justiça', 'https://www.cnj.jus.br/'],
  ['Presidência da República / Planalto', 'https://www.gov.br/planalto/pt-br'],
  ['Tribunal Superior Eleitoral', 'https://www.tse.jus.br/'],
];

const slideIds = ['inicio', 'contexto', 'poderes', 'esferas', 'equilibrio', 'historia', 'problema', 'quiz', 'fontes'];

function Icon({ name, size = 24, className = '' }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    className,
    'aria-hidden': true,
  };

  const shapes = {
    down: <><path d="M12 5v14"/><path d="m6 13 6 6 6-6"/></>,
    expand: <><path d="M8 3H3v5"/><path d="M16 3h5v5"/><path d="M8 21H3v-5"/><path d="M16 21h5v-5"/></>,
    shield: <><path d="M12 3 4.5 6v5.5c0 4.7 3.2 7.9 7.5 9.5 4.3-1.6 7.5-4.8 7.5-9.5V6z"/><path d="m9 12 2 2 4-4"/></>,
    eye: <><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"/><circle cx="12" cy="12" r="2.5"/></>,
    book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v16H6.5A2.5 2.5 0 0 0 4 21.5z"/><path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v16h4.5a2.5 2.5 0 0 1 2.5 2.5z"/></>,
    building: <><path d="M4 21h16"/><path d="M6 21V9l6-4 6 4v12"/><path d="M9 12h.01"/><path d="M12 12h.01"/><path d="M15 12h.01"/><path d="M9 16h.01"/><path d="M15 16h.01"/></>,
    landmark: <><path d="M3 10h18"/><path d="M5 10v8"/><path d="M9 10v8"/><path d="M15 10v8"/><path d="M19 10v8"/><path d="M2 21h20"/><path d="m12 3 9 4H3z"/></>,
    scale: <><path d="M12 3v18"/><path d="M6 7h12"/><path d="m6 7-3 6h6z"/><path d="m18 7-3 6h6z"/><path d="M8 21h8"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    chevron: <path d="m9 18 6-6-6-6"/>,
    crown: <><path d="m3 7 4 4 5-7 5 7 4-4-2 11H5z"/><path d="M5 18h14"/></>,
    help: <><circle cx="12" cy="12" r="9"/><path d="M9.8 9a2.4 2.4 0 1 1 3.6 2.1c-.9.5-1.4 1-1.4 1.9"/><path d="M12 17h.01"/></>,
    external: <><path d="M14 3h7v7"/><path d="M10 14 21 3"/><path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/></>,
    spark: <><path d="m12 3 1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6z"/><path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/></>,
    left: <><path d="M19 12H5"/><path d="m11 18-6-6 6-6"/></>,
    right: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
    close: <><path d="m5 5 14 14"/><path d="M19 5 5 19"/></>,
  };

  return <svg {...common}>{shapes[name]}</svg>;
}

function SectionLabel({ n, children }) {
  return (
    <div className="section-label">
      <span>{String(n).padStart(2, '0')}</span>
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
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible');
          io.disconnect();
        }
      },
      { threshold: 0.13 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return <div ref={ref} className={`reveal ${className}`}>{children}</div>;
}

function PowerIcon({ id, size = 52 }) {
  return <Icon name={id === 'executivo' ? 'building' : id === 'legislativo' ? 'landmark' : 'scale'} size={size} />;
}

function ThreeHero() {
  const mount = useRef(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const el = mount.current;
    if (!el) return;

    let renderer;
    let raf;
    let onResize;
    let onMove;

    try {
      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x050914, 0.035);

      const camera = new THREE.PerspectiveCamera(46, el.clientWidth / el.clientHeight, 0.1, 100);
      camera.position.set(0, 1.2, 8.5);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
      renderer.setSize(el.clientWidth, el.clientHeight);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      el.appendChild(renderer.domElement);

      scene.add(new THREE.AmbientLight(0x9aadc8, 0.68));

      const key = new THREE.DirectionalLight(0xe8f8ff, 3.2);
      key.position.set(4, 7, 5);
      scene.add(key);

      const c1 = new THREE.PointLight(0x4fd8ff, 42, 16);
      c1.position.set(-4, 2, 4);
      scene.add(c1);

      const c2 = new THREE.PointLight(0x9f82ff, 36, 14);
      c2.position.set(4, -1, 4);
      scene.add(c2);

      const c3 = new THREE.PointLight(0xffd05b, 27, 13);
      c3.position.set(0, 5, -3);
      scene.add(c3);

      const group = new THREE.Group();
      scene.add(group);

      const core = new THREE.Mesh(
        new THREE.IcosahedronGeometry(1.22, 4),
        new THREE.MeshPhysicalMaterial({
          color: 0x8de8ff,
          roughness: 0.1,
          metalness: 0.42,
          clearcoat: 1,
          emissive: 0x4fd8ff,
          emissiveIntensity: 0.28,
        })
      );
      group.add(core);

      const ringMaterial = (color, opacity) => new THREE.MeshBasicMaterial({ color, transparent: true, opacity });
      const ring1 = new THREE.Mesh(new THREE.TorusGeometry(1.7, 0.018, 8, 120), ringMaterial(0xffffff, 0.22));
      ring1.rotation.x = Math.PI / 2;
      group.add(ring1);

      const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.15, 0.014, 8, 120), ringMaterial(0x7790ff, 0.3));
      ring2.rotation.set(0.55, 0.1, 0.6);
      group.add(ring2);

      const pillarData = [
        [-2.65, -0.22, 0.5, 0x57f2a1, 2.8],
        [2.65, -0.15, 0.5, 0xffd05b, 3.1],
        [0, -1.0, 2.35, 0x9f82ff, 2.45],
      ];

      const pillars = pillarData.map(([x, y, z, color, h], idx) => {
        const g = new THREE.Group();
        g.position.set(x, y, z);

        const box = new THREE.Mesh(
          new THREE.BoxGeometry(1.12, h, 1.12),
          new THREE.MeshPhysicalMaterial({
            color,
            roughness: 0.17,
            metalness: 0.6,
            clearcoat: 1,
            emissive: color,
            emissiveIntensity: 0.12,
          })
        );
        g.add(box);

        const cap = new THREE.Mesh(
          new THREE.CylinderGeometry(0.66, 0.66, 0.15, 6),
          new THREE.MeshStandardMaterial({ color: 0xdce7ff, metalness: 0.72, roughness: 0.24 })
        );
        cap.position.y = h / 2 + 0.14;
        g.add(cap);

        const orbit = new THREE.Mesh(
          new THREE.TorusGeometry(0.88, 0.014, 7, 80),
          ringMaterial(color, 0.55)
        );
        orbit.rotation.x = Math.PI / 2;
        g.add(orbit);

        g.userData = { baseY: y, idx, orbit };
        group.add(g);
        return g;
      });

      const count = 480;
      const starGeo = new THREE.BufferGeometry();
      const points = new Float32Array(count * 3);
      for (let i = 0; i < count; i += 1) {
        points[i * 3] = (Math.random() - 0.5) * 30;
        points[i * 3 + 1] = (Math.random() - 0.5) * 18;
        points[i * 3 + 2] = (Math.random() - 0.5) * 28;
      }
      starGeo.setAttribute('position', new THREE.BufferAttribute(points, 3));
      const stars = new THREE.Points(
        starGeo,
        new THREE.PointsMaterial({ color: 0xbde9ff, size: 0.035, transparent: true, opacity: 0.58 })
      );
      scene.add(stars);

      let mx = 0;
      let my = 0;
      onMove = (event) => {
        const rect = el.getBoundingClientRect();
        mx = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
        my = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      };
      el.addEventListener('pointermove', onMove);

      const clock = new THREE.Clock();
      const loop = () => {
        const t = clock.getElapsedTime();
        core.rotation.x += 0.0015;
        core.rotation.y += 0.0024;
        core.scale.setScalar(1 + Math.sin(t * 1.6) * 0.024);
        ring1.rotation.z += 0.0018;
        ring2.rotation.z -= 0.0011;

        pillars.forEach((g, i) => {
          g.position.y = g.userData.baseY + Math.sin(t * 0.8 + i) * 0.075;
          g.rotation.y += 0.002;
          g.userData.orbit.rotation.z -= 0.004;
        });

        group.rotation.y += (mx * 0.2 - group.rotation.y) * 0.035;
        group.rotation.x += (-my * 0.11 - group.rotation.x) * 0.035;
        stars.rotation.y += 0.00022;

        renderer.render(scene, camera);
        raf = requestAnimationFrame(loop);
      };
      loop();

      onResize = () => {
        if (!el || !renderer) return;
        camera.aspect = el.clientWidth / el.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(el.clientWidth, el.clientHeight);
      };
      window.addEventListener('resize', onResize);
    } catch (error) {
      console.error('Falha no WebGL, usando fallback:', error);
      setFallback(true);
    }

    return () => {
      if (raf) cancelAnimationFrame(raf);
      if (onResize) window.removeEventListener('resize', onResize);
      if (onMove && el) el.removeEventListener('pointermove', onMove);
      renderer?.dispose();
      if (el) el.innerHTML = '';
    };
  }, []);

  if (fallback) {
    return (
      <div className="fallback-3d">
        <div className="fallback-core">BRASIL</div>
        <span className="orb o1">Executivo</span>
        <span className="orb o2">Legislativo</span>
        <span className="orb o3">Judiciário</span>
      </div>
    );
  }

  return <div ref={mount} className="three-mount" />;
}

function Quiz() {
  const questions = [
    ['Quem administra o país e executa políticas públicas?', ['Legislativo', 'Executivo', 'Judiciário'], 1],
    ['Quem cria leis e fiscaliza o Executivo?', ['Legislativo', 'Executivo', 'Judiciário'], 0],
    ['Quem protege a Constituição e julga conflitos?', ['Executivo', 'Legislativo', 'Judiciário'], 2],
    ['Por que os poderes são separados?', ['Para concentrar decisões', 'Para evitar abusos e criar equilíbrio', 'Para eliminar eleições'], 1],
  ];

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const done = index >= questions.length;

  const choose = (optionIndex) => {
    if (selected !== null) return;
    setSelected(optionIndex);
    if (optionIndex === questions[index][2]) setScore((s) => s + 1);

    setTimeout(() => {
      setSelected(null);
      setIndex((v) => v + 1);
    }, 700);
  };

  return (
    <div className="quiz-shell">
      <div className="quiz-head">
        <span>QUIZ DA TURMA</span>
        <b>{done ? 'FIM' : `${index + 1} / ${questions.length}`}</b>
      </div>

      <AnimatePresence mode="wait">
        {!done ? (
          <motion.div
            key={index}
            className="quiz-body"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
          >
            <h3>{questions[index][0]}</h3>
            <div className="quiz-options">
              {questions[index][1].map((option, optionIndex) => {
                let state = '';
                if (selected !== null) {
                  if (optionIndex === selected) state = optionIndex === questions[index][2] ? 'correct' : 'wrong';
                  else if (optionIndex === questions[index][2]) state = 'correct';
                  else state = 'dim';
                }

                return (
                  <button key={option} className={`quiz-option ${state}`} onClick={() => choose(optionIndex)}>
                    <span>{String.fromCharCode(65 + optionIndex)}</span>
                    {option}
                  </button>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            className="quiz-result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Icon name="spark" size={44} />
            <h3>{score}/{questions.length}</h3>
            <p>{score === questions.length ? 'Gabaritou. A democracia sobreviveu ao teste.' : 'Boa. Agora a turma já sabe onde cada poder entra em cena.'}</p>
            <button onClick={() => { setIndex(0); setSelected(null); setScore(0); }}>Refazer quiz</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function App() {
  const [activePower, setActivePower] = useState(0);
  const [presenting, setPresenting] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const halo = useRef(null);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const power = powers[activePower];

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.05, smoothWheel: true });
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
      if (!halo.current) return;
      halo.current.animate(
        { transform: `translate3d(${event.clientX - 190}px, ${event.clientY - 190}px, 0)` },
        { duration: 450, fill: 'forwards' }
      );
    };
    window.addEventListener('pointermove', move);
    return () => window.removeEventListener('pointermove', move);
  }, []);

  const go = (delta) => {
    const next = Math.max(0, Math.min(slideIds.length - 1, slideIndex + delta));
    setSlideIndex(next);
    document.getElementById(slideIds[next])?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!presenting) return;
    const key = (event) => {
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
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [presenting, slideIndex]);

  const startPresentation = async () => {
    setPresenting(true);
    setSlideIndex(0);
    document.getElementById('inicio')?.scrollIntoView({ behavior: 'smooth' });
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
      <div className="grid-bg" />
      <div className="halo" ref={halo} />
      <motion.div className="progress" style={{ scaleX: progress }} />

      <header className="topbar">
        <a className="brand" href="#inicio">
          <div className="brand-badge">CEJ</div>
          <div>
            <strong>HISTÓRIA</strong>
            <span>Os Três Poderes</span>
          </div>
        </a>

        <nav>
          <a href="#poderes">Poderes</a>
          <a href="#equilibrio">Equilíbrio</a>
          <a href="#historia">História</a>
          <a href="#problema">Questão</a>
          <button className="present-btn" onClick={startPresentation}>
            <Icon name="expand" size={15} />
            Apresentar
          </button>
        </nav>
      </header>

      <main>
        <section id="inicio" className="hero">
          <div className="hero-copy">
            <motion.div className="kicker" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
              <span>GRUPO 1</span><i /> EDUCAÇÃO POLÍTICA · HISTÓRIA
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12, duration: 0.8 }}>
              Quem governa<br />o <em>Brasil?</em>
            </motion.h1>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              Uma experiência interativa sobre <strong>Executivo</strong>, <strong>Legislativo</strong> e <strong>Judiciário</strong>,
              sua evolução histórica e o motivo de o poder não ficar concentrado em uma única instituição.
            </motion.p>

            <motion.div className="hero-actions" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.56 }}>
              <a className="primary" href="#contexto">
                Começar seminário <Icon name="down" size={17} />
              </a>
              <button className="secondary" onClick={startPresentation}>
                <Icon name="expand" size={17} /> Modo apresentação
              </button>
            </motion.div>

            <div className="micro">
              <span><Icon name="shield" size={15} /> Constituição</span>
              <span><Icon name="eye" size={15} /> Freios e contrapesos</span>
              <span><Icon name="book" size={15} /> História</span>
            </div>
          </div>

          <motion.div className="hero-scene" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }}>
            <ThreeHero />
            <div className="scene-tag t1"><i style={{ background: COLORS.executivo }} /> Executivo</div>
            <div className="scene-tag t2"><i style={{ background: COLORS.legislativo }} /> Legislativo</div>
            <div className="scene-tag t3"><i style={{ background: COLORS.judiciario }} /> Judiciário</div>
          </motion.div>
        </section>

        <section id="contexto" className="section">
          <SectionLabel n={1}>O ponto de partida</SectionLabel>
          <div className="context-grid">
            <Reveal className="context panel">
              <h2>Três poderes.<br /><span>Um Estado.</span></h2>
              <p>
                A Constituição de 1988 organiza o Estado brasileiro com três Poderes independentes e harmônicos.
                Cada um possui funções próprias e, ao mesmo tempo, mecanismos para limitar e fiscalizar os demais.
              </p>
              <div className="constitution">
                <b>ART. 2º</b>
                <p>“São Poderes da União, independentes e harmônicos entre si, o Legislativo, o Executivo e o Judiciário.”</p>
              </div>
            </Reveal>

            <Reveal className="stats panel">
              <div className="stat big"><strong>3</strong><span>poderes constitucionais</span></div>
              <div className="stat row"><strong>1</strong><span>objetivo central<br />evitar abuso e concentração</span></div>
              <div className="stat row"><strong>1988</strong><span>Constituição<br />atualmente em vigor</span></div>
            </Reveal>
          </div>
        </section>

        <section id="poderes" className="section">
          <SectionLabel n={2}>Conheça cada poder</SectionLabel>
          <Reveal className="title-row">
            <h2>Quem faz <span>o quê?</span></h2>
            <p>Selecione um poder para abrir sua função, estrutura e exemplos.</p>
          </Reveal>

          <div className="powers-layout">
            <Reveal className="power-list">
              {powers.map((item, index) => (
                <button
                  key={item.id}
                  className={`power-btn ${activePower === index ? 'active' : ''}`}
                  style={{ '--power': COLORS[item.id] }}
                  onClick={() => setActivePower(index)}
                >
                  <span>{item.index}</span>
                  <div>
                    <strong>{item.title}</strong>
                    <small>{item.role}</small>
                  </div>
                  <Icon name="chevron" size={18} />
                </button>
              ))}
            </Reveal>

            <AnimatePresence mode="wait">
              <motion.article
                key={power.id}
                className="power-detail"
                style={{ '--power': COLORS[power.id] }}
                initial={{ opacity: 0, x: 28, scale: 0.985 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -22 }}
              >
                <div className="monogram">
                  <i className="ring r1" />
                  <i className="ring r2" />
                  <i className="ring r3" />
                  <PowerIcon id={power.id} />
                </div>

                <div className="detail-copy">
                  <span className="detail-kicker">{power.index} / {power.title.toUpperCase()}</span>
                  <h3>{power.role}</h3>
                  <p>{power.summary}</p>
                  <ul>
                    {power.items.map((text) => (
                      <li key={text}>
                        <Icon name="check" size={17} />
                        <span>{text}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="phrase">{power.phrase}</div>
                </div>
              </motion.article>
            </AnimatePresence>
          </div>
        </section>

        <section id="esferas" className="section">
          <SectionLabel n={3}>Da União ao município</SectionLabel>
          <Reveal className="title-row">
            <h2>O mesmo sistema,<br /><span>três escalas.</span></h2>
            <p>Veja como os poderes aparecem em diferentes níveis da Federação.</p>
          </Reveal>

          <div className="sphere-grid">
            <Reveal className="sphere federal">
              <span>UNIÃO</span>
              <Icon name="crown" size={48} />
              <h3>Brasil</h3>
              <dl>
                <div><dt>Executivo</dt><dd>Presidente da República</dd></div>
                <div><dt>Legislativo</dt><dd>Congresso Nacional: Câmara + Senado</dd></div>
                <div><dt>Judiciário</dt><dd>STF, STJ e Justiça Federal</dd></div>
              </dl>
            </Reveal>

            <Reveal className="sphere estadual">
              <span>ESTADO</span>
              <Icon name="landmark" size={48} />
              <h3>Santa Catarina</h3>
              <dl>
                <div><dt>Executivo</dt><dd>Governador</dd></div>
                <div><dt>Legislativo</dt><dd>Assembleia Legislativa</dd></div>
                <div><dt>Judiciário</dt><dd>Tribunal de Justiça</dd></div>
              </dl>
            </Reveal>

            <Reveal className="sphere municipal">
              <span>MUNICÍPIO</span>
              <Icon name="building" size={48} />
              <h3>Jaraguá do Sul</h3>
              <dl>
                <div><dt>Executivo</dt><dd>Prefeito</dd></div>
                <div><dt>Legislativo</dt><dd>Câmara de Vereadores</dd></div>
                <div><dt>Judiciário</dt><dd>Não possui Judiciário próprio</dd></div>
              </dl>
            </Reveal>
          </div>
        </section>

        <section id="equilibrio" className="section">
          <SectionLabel n={4}>Freios e contrapesos</SectionLabel>
          <div className="checks-grid">
            <Reveal className="checks">
              <h2>Ninguém manda<br /><span>sozinho.</span></h2>
              <p>
                Separar poderes não significa isolá-los. Eles se relacionam, fiscalizam e limitam uns aos outros
                para reduzir o risco de abusos.
              </p>

              <div className="check-list">
                <div className="check"><span>01</span><div><h4>Legislativo → Executivo</h4><p>Fiscaliza, aprova orçamento e cria leis.</p></div></div>
                <div className="check"><span>02</span><div><h4>Executivo → Legislativo</h4><p>Pode sancionar ou vetar projetos aprovados.</p></div></div>
                <div className="check"><span>03</span><div><h4>Judiciário → Poder público</h4><p>Pode afastar atos incompatíveis com a Constituição.</p></div></div>
              </div>
            </Reveal>

            <Reveal>
              <div className="network">
                <div className="network-core">
                  <Icon name="scale" size={42} />
                  <strong>Equilíbrio</strong>
                  <small>freios + contrapesos</small>
                </div>
                <div className="network-node n1"><Icon name="building" size={30} /><b>Executivo</b></div>
                <div className="network-node n2"><Icon name="landmark" size={30} /><b>Legislativo</b></div>
                <div className="network-node n3"><Icon name="scale" size={30} /><b>Judiciário</b></div>
                <svg className="network-links" viewBox="0 0 600 470" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M300 90 C230 130 160 215 125 345" />
                  <path d="M300 90 C370 130 440 215 475 345" />
                  <path d="M125 345 C245 405 355 405 475 345" />
                </svg>
              </div>
            </Reveal>
          </div>
        </section>

        <section id="historia" className="section">
          <SectionLabel n={5}>Relação histórica</SectionLabel>
          <Reveal className="title-row">
            <h2>O equilíbrio foi<br /><span>construído no tempo.</span></h2>
            <p>A organização dos poderes mudou junto com os regimes políticos e as Constituições brasileiras.</p>
          </Reveal>

          <div className="timeline">
            {history.map(([year, title, text]) => (
              <Reveal key={year} className="time-card">
                <span className="year">{year}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="problema" className="section">
          <SectionLabel n={6}>Questão-problema</SectionLabel>
          <Reveal className="problem">
            <Icon name="help" size={56} className="help-icon" />
            <span className="problem-kicker">A pergunta central do trabalho</span>
            <h2>Por que é importante que o poder do Estado <em>não fique concentrado</em> em uma única instituição?</h2>

            <div className="answers">
              <div className="answer bad">
                <span>CONCENTRAÇÃO</span>
                <h3>Mais risco</h3>
                <p>Facilita abusos, enfraquece a fiscalização, reduz controles e pode ameaçar direitos e liberdades.</p>
              </div>
              <div className="answer good">
                <span>SEPARAÇÃO</span>
                <h3>Mais equilíbrio</h3>
                <p>Distribui responsabilidades, cria fiscalização mútua e torna decisões públicas sujeitas a limites constitucionais.</p>
              </div>
            </div>

            <div className="thesis">
              <Icon name="shield" size={24} />
              <p><strong>Conclusão:</strong> o Brasil não é governado por uma única pessoa ou instituição. A democracia depende de instituições diferentes, com funções próprias, limites e controles recíprocos.</p>
            </div>
          </Reveal>
        </section>

        <section id="quiz" className="section">
          <SectionLabel n={7}>Hora de envolver a turma</SectionLabel>
          <Reveal className="title-row">
            <h2>Mini quiz<br /><span>relâmpago.</span></h2>
            <p>Quatro perguntas para fechar a apresentação com participação da sala.</p>
          </Reveal>
          <Reveal><Quiz /></Reveal>
        </section>

        <section id="fontes" className="section">
          <SectionLabel n={8}>Pesquisa e referências</SectionLabel>
          <Reveal className="title-row">
            <h2>Fontes<br /><span>institucionais.</span></h2>
            <p>O trabalho prioriza as fontes oficiais sugeridas no projeto da disciplina.</p>
          </Reveal>

          <div className="sources">
            {refs.map(([label, url], index) => (
              <Reveal key={url}>
                <a className="source" href={url} target="_blank" rel="noreferrer">
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <strong>{label}</strong>
                  <Icon name="external" size={17} />
                </a>
              </Reveal>
            ))}
          </div>

          <Reveal className="credits">
            <div className="cej-mark">CEJ</div>
            <div>
              <span>COLÉGIO EVANGÉLICO JARAGUÁ</span>
              <strong>Educação Política, Poderes e Voto no Brasil</strong>
              <small>História · Grupo 1 · Seminário</small>
            </div>
          </Reveal>
        </section>
      </main>

      <footer>
        <strong>OS TRÊS PODERES</strong>
        <p>Seminário interativo de História · Grupo 1</p>
        <a href="#inicio">Voltar ao topo ↑</a>
      </footer>

      {presenting && (
        <div className="present-controls">
          <button onClick={() => go(-1)} aria-label="Voltar seção"><Icon name="left" size={19} /></button>
          <span>{slideIndex + 1} / {slideIds.length}</span>
          <button onClick={() => go(1)} aria-label="Próxima seção"><Icon name="right" size={19} /></button>
          <button onClick={stopPresentation} aria-label="Sair da apresentação"><Icon name="close" size={18} /></button>
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
            <b>O site encontrou um erro.</b>
            <p>Atualize a página. Se continuar, abra em Chrome, Edge ou Firefox.</p>
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
