'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ChevronRight, Map, RotateCcw, Sparkles, X } from 'lucide-react';

const loadingFrames = [
  { src: '/loading/planting.png', eyebrow: '一粒小麦的旅行 · 01', title: '把期待，种进春天里', note: '小麦正在探出嫩芽…' },
  { src: '/loading/watering.png', eyebrow: '一粒小麦的旅行 · 02', title: '浇一点水，等风吹过', note: '麦苗正在努力长高…' },
  { src: '/loading/harvest.png', eyebrow: '一粒小麦的旅行 · 03', title: '金色麦浪，可以收割啦', note: '今天是丰收的好日子…' },
  { src: '/loading/bread-rain.png', eyebrow: '一粒小麦的旅行 · 04', title: '接住从天而降的面包', note: '你的面包世界准备好了' },
];

const places = [
  { id: 'field', label: '田野', sub: '从一粒小麦开始', pos: 'left-[47%] top-[24%]', accent: 'bg-[#c8dfa5]' },
  { id: 'market', label: '原料市场', sub: '把新鲜材料带回家', pos: 'left-[18%] top-[43%]', accent: 'bg-[#b9dded]' },
  { id: 'shop', label: '我的面包店', sub: '今天想做什么？', pos: 'left-[48%] top-[51%]', accent: 'bg-[#ffd3ae]' },
  { id: 'factory', label: '我的工厂', sub: '进入制作车间', pos: 'left-[78%] top-[43%]', accent: 'bg-[#d3c2ed]' },
  { id: 'pk', label: 'PK 广场', sub: '晒出你的得意作品', pos: 'left-[24%] top-[70%]', accent: 'bg-[#ffc7c8]' },
  { id: 'future', label: '待定…', sub: '一片等待发现的新大陆', pos: 'left-[69%] top-[70%]', accent: 'bg-[#d8e7c7]' },
] as const;

type Place = typeof places[number];

export default function HomePage() {
  const [frame, setFrame] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [selected, setSelected] = useState<Place | null>(null);

  useEffect(() => {
    if (loaded) return;
    const timer = window.setTimeout(() => {
      if (frame < loadingFrames.length - 1) setFrame((value) => value + 1);
      else setLoaded(true);
    }, frame === loadingFrames.length - 1 ? 1250 : 1050);
    return () => window.clearTimeout(timer);
  }, [frame, loaded]);

  if (!loaded) {
    const item = loadingFrames[frame];
    return (
      <main className="loading-shell min-h-dvh overflow-hidden bg-[#fff9ef] text-[#594538]">
        <section key={item.src} className="loading-frame relative mx-auto min-h-dvh w-full max-w-md overflow-hidden bg-[#eef8fb]">
          <Image src={item.src} alt={item.title} fill priority className="object-cover" sizes="(max-width: 768px) 100vw, 448px" />
          <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-[#fff9ef]/80 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-[#fffaf1] via-[#fffaf1]/85 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 px-7 pb-11 text-center">
            <p className="text-[11px] font-bold tracking-[0.2em] text-[#9a806d]">{item.eyebrow}</p>
            <h1 className="mt-3 text-2xl font-bold tracking-tight">{item.title}</h1>
            <p className="mt-2 text-sm text-[#8b7566]">{item.note}</p>
            <div className="mx-auto mt-6 flex w-fit items-center gap-2 rounded-full bg-white/75 px-4 py-2 shadow-sm backdrop-blur">
              {loadingFrames.map((_, index) => <span key={index} className={`h-1.5 rounded-full transition-all ${index === frame ? 'w-7 bg-[#e6a76e]' : index < frame ? 'w-2 bg-[#b9cf9a]' : 'w-2 bg-[#d9d2c8]'}`} />)}
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="map-shell min-h-dvh overflow-hidden bg-[#eaf6fb] pb-24 text-[#514235]">
      <header className="pointer-events-none fixed inset-x-0 top-0 z-20 mx-auto flex max-w-md items-start justify-between px-5 pt-[max(18px,env(safe-area-inset-top))]">
        <div className="rounded-2xl bg-[#fffaf1]/86 px-4 py-2.5 shadow-[0_8px_24px_rgb(89_67_45/10%)] backdrop-blur-md">
          <p className="text-[10px] font-bold tracking-[0.18em] text-[#9d8773]">BREAD FACTORY</p>
          <h1 className="mt-0.5 text-lg font-extrabold">小麦世界地图</h1>
        </div>
        <button onClick={() => { setFrame(0); setLoaded(false); }} aria-label="重新播放加载动画" className="pointer-events-auto grid size-11 place-items-center rounded-full border border-white/70 bg-white/80 shadow-sm backdrop-blur">
          <RotateCcw className="size-4.5" />
        </button>
      </header>

      <section className="relative mx-auto min-h-dvh w-full max-w-md overflow-hidden">
        <Image src="/map/bread-world.png" alt="面包工厂世界地图，包含田野、原料市场、面包店、工厂、PK 广场和待开发区域" fill priority className="object-cover" sizes="(max-width: 768px) 100vw, 448px" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-[#eaf6fb]/20" />
        {places.map((place) => (
          <button key={place.id} onClick={() => setSelected(place)} className={`map-pin absolute ${place.pos} -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/80 bg-[#fffdf8]/90 px-3 py-2 text-center shadow-[0_7px_18px_rgb(80_63_46/16%)] backdrop-blur-sm transition hover:-translate-y-[56%] active:scale-95`}>
            <span className={`mx-auto mb-1 block size-2 rounded-full ${place.accent}`} />
            <strong className="block whitespace-nowrap text-[12px] font-extrabold">{place.label}</strong>
          </button>
        ))}
      </section>

      {selected && (
        <div className="fixed inset-x-0 bottom-20 z-30 mx-auto max-w-md px-4">
          <section className="animate-in slide-in-from-bottom-4 rounded-[28px] border border-white bg-[#fffaf2]/95 p-5 shadow-[0_18px_55px_rgb(64_48_34/24%)] backdrop-blur-xl">
            <div className="flex items-start gap-3">
              <span className={`mt-1 size-3 rounded-full ${selected.accent}`} />
              <div className="flex-1">
                <p className="text-[10px] font-bold tracking-[0.16em] text-[#a08772]">地图区域</p>
                <h2 className="mt-1 text-xl font-extrabold">{selected.label}</h2>
                <p className="mt-1 text-sm text-[#887364]">{selected.sub}</p>
              </div>
              <button onClick={() => setSelected(null)} aria-label="关闭" className="grid size-9 place-items-center rounded-full bg-white"><X className="size-4" /></button>
            </div>
            <button disabled={selected.id === 'future'} className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#71513b] text-sm font-bold text-white shadow-sm disabled:bg-[#d8cfc7]">
              {selected.id === 'future' ? <><Sparkles className="size-4" />敬请期待</> : <>进入这里<ChevronRight className="size-4" /></>}
            </button>
          </section>
        </div>
      )}

      <nav className="fixed inset-x-0 bottom-0 z-20 mx-auto flex max-w-md justify-center bg-gradient-to-t from-[#eef8fb] via-[#eef8fb]/95 to-transparent pb-[max(12px,env(safe-area-inset-bottom))] pt-5">
        <button className="flex min-w-24 flex-col items-center gap-1 rounded-[22px] border border-white bg-[#fffaf1]/95 px-7 py-2.5 text-[11px] font-extrabold tracking-[0.12em] text-[#6f513e] shadow-[0_10px_24px_rgb(85_65_48/16%)]">
          <Map className="size-5 fill-[#f1c794] stroke-[#6f513e]" />
          MAP
        </button>
      </nav>
    </main>
  );
}
