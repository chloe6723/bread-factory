'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft, Bot, Camera, Check, ChefHat, ChevronRight, CirclePlay, Clock3,
  Factory, FileText, ImagePlus, Map, PackageCheck, Plus, Share2, ShoppingBasket,
  Sparkles, Store, Trophy, Upload, Wheat, X,
} from 'lucide-react';

type Screen = 'map' | 'field' | 'market' | 'create' | 'prep' | 'factory' | 'line' | 'shop' | 'product' | 'pk';
type Recipe = { id: string; title: string; emoji: string; time: string; level: string; ingredients: string[]; steps: { title: string; detail: string; timer?: number; temperature?: string }[] };
type Product = { id: string; title: string; emoji: string; price: string; story: string; published?: boolean };

const loadingFrames = [
  { src: '/loading/planting.png', title: '把期待，种进春天里', note: '小麦正在探出嫩芽…' },
  { src: '/loading/watering.png', title: '浇一点水，等风吹过', note: '麦苗正在努力长高…' },
  { src: '/loading/harvest.png', title: '金色麦浪，可以收割啦', note: '今天是丰收的好日子…' },
  { src: '/loading/bread-rain.png', title: '接住从天而降的面包', note: '你的面包世界准备好了' },
];

const baseRecipes: Recipe[] = [
  { id: 'pudding', title: '焦糖布丁', emoji: '🍮', time: '50 分钟', level: '简单', ingredients: ['鸡蛋 3 个', '牛奶 300ml', '细砂糖 55g', '香草精 2g'], steps: [{ title: '熬焦糖', detail: '小火加热糖和水至琥珀色。' }, { title: '混合布丁液', detail: '蛋液与温牛奶轻柔混合并过筛。' }, { title: '水浴烘焙', detail: '150°C 水浴烘烤。', timer: 12, temperature: '150°C' }] },
  { id: 'chiffon', title: '云朵戚风', emoji: '🍰', time: '90 分钟', level: '进阶', ingredients: ['鸡蛋 5 个', '低筋面粉 85g', '牛奶 55g', '玉米油 50g', '细砂糖 70g'], steps: [{ title: '制作蛋黄糊', detail: '乳化油和牛奶，筛入面粉后加入蛋黄。' }, { title: '打发蛋白', detail: '蛋白打至小弯钩状态。' }, { title: '翻拌装模', detail: '分三次翻拌，倒入模具。' }, { title: '烘焙', detail: '150°C 烘烤并倒扣冷却。', timer: 15, temperature: '150°C' }] },
  { id: 'rice-cake', title: '黄油年糕', emoji: '🧈', time: '60 分钟', level: '简单', ingredients: ['糯米粉 220g', '牛奶 200g', '黄油 45g', '鸡蛋 2 个', '细砂糖 55g'], steps: [{ title: '融化黄油', detail: '隔水融化黄油并放至温热。' }, { title: '混合面糊', detail: '所有材料搅拌至顺滑。' }, { title: '烘焙', detail: '170°C 烘烤至表面金黄。', timer: 12, temperature: '170°C' }] },
  { id: 'macaron', title: '草莓马卡龙', emoji: '🌸', time: '120 分钟', level: '挑战', ingredients: ['杏仁粉 100g', '糖粉 100g', '蛋白 75g', '细砂糖 70g', '草莓粉 8g'], steps: [{ title: '混合粉类', detail: '杏仁粉、糖粉与草莓粉过筛。' }, { title: '打发蛋白', detail: '蛋白霜打至硬性发泡。' }, { title: '拌合挤花', detail: '翻拌至飘带状并挤圆。' }, { title: '晾皮', detail: '静置至表面不粘手。', timer: 10 }, { title: '烘烤', detail: '145°C 烘烤。', timer: 10, temperature: '145°C' }] },
];

const mapPlaces = [
  { id: 'field', label: '田野', pos: 'left-[47%] top-[24%]' },
  { id: 'market', label: '原料市场', pos: 'left-[18%] top-[43%]' },
  { id: 'shop', label: '我的面包店', pos: 'left-[48%] top-[51%]' },
  { id: 'factory', label: '我的工厂', pos: 'left-[78%] top-[43%]' },
  { id: 'pk', label: 'PK 广场', pos: 'left-[24%] top-[70%]' },
] as const;

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [frame, setFrame] = useState(0);
  const [screen, setScreen] = useState<Screen>('map');
  const [recipes, setRecipes] = useState<Recipe[]>(baseRecipes);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [checked, setChecked] = useState<boolean[]>([]);
  const [ready, setReady] = useState<string[]>([]);
  const [source, setSource] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [activeRecipe, setActiveRecipe] = useState<Recipe | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [timer, setTimer] = useState<number | null>(null);
  const [stepPhotos, setStepPhotos] = useState<Record<number, string>>({});
  const [products, setProducts] = useState<Product[]>([{ id: 'salt-bread', title: '海盐卷', emoji: '🥐', price: '一颗真心', story: '第一次成功卷出漂亮层次的那个下午。', published: true }]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [shared, setShared] = useState(false);
  const allChecked = checked.length > 0 && checked.every(Boolean);

  useEffect(() => {
    if (!loading) return;
    const id = window.setTimeout(() => frame < 3 ? setFrame((n) => n + 1) : (setLoading(false), setScreen('map')), 900);
    return () => window.clearTimeout(id);
  }, [loading, frame]);

  useEffect(() => {
    if (timer === null || timer <= 0) return;
    const id = window.setInterval(() => setTimer((n) => n === null ? null : Math.max(0, n - 1)), 1000);
    return () => window.clearInterval(id);
  }, [timer]);

  const currentStep = activeRecipe?.steps[stepIndex];
  const publishedProducts = products.filter((p) => p.published);
  const timerText = useMemo(() => timer === null ? '' : `${String(Math.floor(timer / 60)).padStart(2, '0')}:${String(timer % 60).padStart(2, '0')}`, [timer]);

  function navigate(next: Screen) { setScreen(next); setShared(false); }
  function pickRecipe(recipe: Recipe) { setSelectedRecipe(recipe); setChecked(recipe.ingredients.map(() => false)); navigate('prep'); }
  function finishShopping() { if (!selectedRecipe || !allChecked) return; setReady((r) => [...new Set([...r, selectedRecipe.id])]); navigate('factory'); }
  function startLine(recipe: Recipe) { setActiveRecipe(recipe); setStepIndex(0); setTimer(null); setStepPhotos({}); navigate('line'); }
  function nextStep() {
    if (!activeRecipe) return;
    if (stepIndex < activeRecipe.steps.length - 1) { setStepIndex((n) => n + 1); setTimer(null); }
    else {
      const product = { id: `${activeRecipe.id}-${Date.now()}`, title: activeRecipe.title, emoji: activeRecipe.emoji, price: '一颗真心', story: `我完成了 ${activeRecipe.title} 的第一次制作。` };
      setProducts((p) => [product, ...p]); setSelectedProduct(product); navigate('product');
    }
  }
  function handlePhoto(file?: File) { if (file) setStepPhotos((p) => ({ ...p, [stepIndex]: URL.createObjectURL(file) })); }
  function analyzeRecipe() {
    if (!source.trim()) return;
    setAnalyzing(true);
    window.setTimeout(() => {
      const aiRecipe: Recipe = { id: `ai-${Date.now()}`, title: source.includes('http') ? 'AI 解析视频食谱' : '我的导入食谱', emoji: '✨', time: '约 80 分钟', level: 'AI 整理', ingredients: ['高筋面粉 250g', '牛奶 165g', '黄油 25g', '细砂糖 25g', '酵母 3g'], steps: [{ title: '混合原料', detail: '除黄油外混合所有原料，揉至初步成团。' }, { title: '加入黄油', detail: '加入软化黄油，揉至扩展阶段。' }, { title: '第一次发酵', detail: '发酵至约两倍大。', timer: 12 }, { title: '整形醒发', detail: '排气、分割、整形后进行最后醒发。', timer: 10 }, { title: '烘焙', detail: '180°C 烘焙至表面金黄。', timer: 12, temperature: '180°C' }] };
      setRecipes((r) => [aiRecipe, ...r]); setAnalyzing(false); setSource(''); navigate('market');
    }, 1200);
  }
  function saveProduct(next: Product) { setProducts((p) => p.map((item) => item.id === next.id ? next : item)); setSelectedProduct(next); }
  function publishProduct() { if (!selectedProduct) return; const next = { ...selectedProduct, published: true }; saveProduct(next); navigate('pk'); }
  async function shareProduct(product: Product) {
    const text = `今天的面包故事：${product.title}。${product.story}`;
    if (navigator.share) await navigator.share({ title: product.title, text });
    else await navigator.clipboard?.writeText(text);
    setShared(true);
  }

  if (loading) {
    const item = loadingFrames[frame];
    return <main className="loading-shell min-h-dvh bg-[#fff9ef] text-[#594538]"><section key={item.src} className="loading-frame relative mx-auto min-h-dvh max-w-md overflow-hidden"><Image src={item.src} alt={item.title} fill priority className="object-cover" /><div className="absolute inset-x-0 bottom-0 h-[38%] bg-gradient-to-t from-[#fffaf1] via-[#fffaf1]/85 to-transparent" /><div className="absolute inset-x-0 bottom-10 text-center"><h1 className="text-2xl font-bold">{item.title}</h1><p className="mt-2 text-sm text-[#8b7566]">{item.note}</p></div></section></main>;
  }

  if (screen === 'map') return <MapView onPlace={(id) => navigate(id as Screen)} onReplay={() => { setFrame(0); setLoading(true); }} />;
  if (screen === 'field') return <FieldView onMap={() => navigate('map')} />;

  return (
    <main className="min-h-dvh bg-[#fff9ef] pb-28 text-[#4f3d31]">
      <div className="mx-auto max-w-md px-5 pt-5">
        <PageHeader title={screen === 'market' ? '原料市场' : screen === 'create' ? '创建食谱' : screen === 'prep' ? '采购清单' : screen === 'factory' ? '我的工厂' : screen === 'line' ? '生产线' : screen === 'shop' ? '我的面包店' : screen === 'product' ? '产品档案' : 'PK 广场'} onBack={() => navigate(screen === 'create' || screen === 'prep' ? 'market' : screen === 'line' ? 'factory' : screen === 'product' ? 'shop' : 'map')} />

        {screen === 'market' && <section>
          <button onClick={() => navigate('create')} className="mt-5 flex w-full items-center gap-4 rounded-[28px] border-2 border-dashed border-[#e4b98d] bg-[#fffdf7] p-5 text-left"><span className="grid size-12 place-items-center rounded-2xl bg-[#ffe2bf]"><Plus /></span><span className="flex-1"><strong className="block text-lg">创建食谱</strong><small className="text-[#8f7767]">粘贴文字或视频链接，由 AI 整理</small></span><ChevronRight className="size-5" /></button>
          <div className="mt-7 flex items-center justify-between"><h2 className="text-xl font-black">基础食谱</h2><span className="text-xs text-[#9b8472]">{recipes.length} 份</span></div>
          <div className="mt-3 grid grid-cols-2 gap-3">{recipes.map((recipe) => <button key={recipe.id} onClick={() => pickRecipe(recipe)} className="rounded-[26px] border bg-white p-4 text-left shadow-sm"><span className="text-4xl">{recipe.emoji}</span><strong className="mt-4 block">{recipe.title}</strong><span className="mt-2 block text-xs text-[#917968]">{recipe.time} · {recipe.level}</span><span className="mt-4 flex items-center gap-1 text-xs font-bold text-[#7a5137]">准备原料 <ChevronRight className="size-3.5" /></span></button>)}</div>
        </section>}

        {screen === 'create' && <section className="mt-8"><div className="rounded-[30px] bg-[#f1e5ff] p-5"><Bot className="size-8 text-[#765493]" /><h2 className="mt-4 text-xl font-black">把食谱交给 AI 厨师</h2><p className="mt-2 text-sm leading-6 text-[#75647f]">复制一段食谱文字，或粘贴视频链接。AI 会拆解原料、步骤、计时点和温度，生成工厂可读格式。</p></div><textarea value={source} onChange={(e) => setSource(e.target.value)} className="mt-4 min-h-44 w-full rounded-[26px] border bg-white p-4 text-sm outline-none focus:ring-2 focus:ring-[#c7a9df]" placeholder="在这里粘贴食谱文字或视频链接…" /><button onClick={analyzeRecipe} disabled={!source.trim() || analyzing} className="mt-4 flex h-13 w-full items-center justify-center gap-2 rounded-full bg-[#6d4d7f] font-bold text-white disabled:opacity-50">{analyzing ? <><Sparkles className="size-4 animate-pulse" />正在分析并格式化…</> : <><FileText className="size-4" />生成工厂食谱</>}</button></section>}

        {screen === 'prep' && selectedRecipe && <section className="mt-6"><div className="rounded-[28px] bg-[#fff1cf] p-5"><span className="text-5xl">{selectedRecipe.emoji}</span><h2 className="mt-3 text-2xl font-black">{selectedRecipe.title}</h2><p className="mt-1 text-sm text-[#8f7657]">逐项确认已经买到并称量好</p></div><div className="mt-4 overflow-hidden rounded-[26px] border bg-white">{selectedRecipe.ingredients.map((item, index) => <button key={item} onClick={() => setChecked((items) => items.map((v, i) => i === index ? !v : v))} className="flex w-full items-center gap-3 border-b px-4 py-4 text-left last:border-0"><span className={`grid size-6 place-items-center rounded-full border ${checked[index] ? 'bg-[#769267] text-white' : ''}`}>{checked[index] && <Check className="size-4" />}</span><span className={checked[index] ? 'text-[#a29a93] line-through' : ''}>{item}</span></button>)}</div><button onClick={finishShopping} disabled={!allChecked} className="mt-5 flex h-13 w-full items-center justify-center gap-2 rounded-full bg-[#617b55] font-bold text-white disabled:bg-[#d8d2c9]"><PackageCheck className="size-5" />{allChecked ? '采购完毕，送往工厂' : `还差 ${checked.filter((v) => !v).length} 项`}</button></section>}

        {screen === 'factory' && <section className="mt-6"><div className="rounded-[30px] bg-[#e8e0f5] p-5"><Factory className="size-9 text-[#66537b]" /><h2 className="mt-3 text-2xl font-black">等待开工的生产线</h2><p className="mt-1 text-sm text-[#7d708a]">采购完成的原料会自动出现在这里</p></div>{ready.length === 0 ? <Empty icon={<ShoppingBasket />} title="还没有准备好的原料" note="先去原料市场选择食谱并完成采购" action={() => navigate('market')} actionText="去原料市场" /> : <div className="mt-4 space-y-3">{ready.map((id, index) => { const recipe = recipes.find((r) => r.id === id)!; return <div key={id} className="rounded-[28px] border bg-white p-5 shadow-sm"><div className="flex items-center gap-4"><span className="text-4xl">{recipe.emoji}</span><div className="flex-1"><small className="font-bold text-[#967fa9]">生产线 {String(index + 1).padStart(2, '0')}</small><strong className="block text-lg">{recipe.title}</strong><span className="text-xs text-[#8d7a6c]">原料已采购 · 尚未开工</span></div></div><button onClick={() => startLine(recipe)} className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#6c567b] font-bold text-white"><CirclePlay className="size-4" />开始动工</button></div>})}</div>}</section>}

        {screen === 'line' && activeRecipe && currentStep && <section className="mt-6"><div className="flex items-center justify-between"><span className="rounded-full bg-[#eee6f5] px-3 py-1 text-xs font-bold text-[#755e86]">关卡 {stepIndex + 1} / {activeRecipe.steps.length}</span><span className="text-3xl">{activeRecipe.emoji}</span></div><div className="mt-4 h-2 overflow-hidden rounded-full bg-[#eadfda]"><div className="h-full rounded-full bg-[#8c6e9f] transition-all" style={{ width: `${((stepIndex + 1) / activeRecipe.steps.length) * 100}%` }} /></div><div className="mt-5 rounded-[32px] bg-white p-6 shadow-lg shadow-[#725638]/10"><h2 className="text-2xl font-black">{currentStep.title}</h2><p className="mt-3 text-sm leading-7 text-[#76665b]">{currentStep.detail}</p>{currentStep.temperature && <span className="mt-4 inline-flex rounded-full bg-[#ffe1d4] px-3 py-1 text-xs font-bold text-[#a35038]">{currentStep.temperature}</span>}{currentStep.timer && <div className="mt-5 rounded-[26px] bg-[#4e3b54] p-5 text-center text-white"><Clock3 className="mx-auto size-5 text-[#e8cbee]" /><p className="mt-2 text-xs text-white/65">自动计时关卡</p><p className="mt-1 font-mono text-5xl font-bold">{timer === null ? `${String(currentStep.timer).padStart(2, '0')}:00` : timerText}</p>{timer === null && <button onClick={() => setTimer(currentStep.timer!)} className="mt-4 rounded-full bg-white px-5 py-2 text-sm font-bold text-[#4e3b54]">开启计时器</button>}{timer === 0 && <p className="mt-3 text-sm font-bold text-[#f4d28d]">时间到，可以进入下一关啦</p>}</div>}<label className="mt-5 flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed p-4"><span className="grid size-10 place-items-center rounded-xl bg-[#f7eadc]"><Camera className="size-5" /></span><span className="flex-1 text-sm font-bold">{stepPhotos[stepIndex] ? '已记录半成品状态' : '拍照记录这一步'}<small className="block font-normal text-[#988578]">开启下一步前可选</small></span>{stepPhotos[stepIndex] && <Check className="size-5 text-[#708b62]" />}<input type="file" accept="image/*" className="hidden" onChange={(e) => handlePhoto(e.target.files?.[0])} /></label><button onClick={nextStep} disabled={!!currentStep.timer && timer !== 0} className="mt-5 flex h-13 w-full items-center justify-center gap-2 rounded-full bg-[#72547f] font-bold text-white disabled:bg-[#d6ced9]">{stepIndex === activeRecipe.steps.length - 1 ? '拍成品照，完成出炉' : '完成，进入下一关'}<ChevronRight className="size-4" /></button></div></section>}

        {screen === 'shop' && <section className="mt-6"><div className="rounded-[30px] bg-[#ffe4c1] p-5"><Store className="size-9 text-[#865b33]" /><h2 className="mt-3 text-2xl font-black">我的展示橱窗</h2><p className="mt-1 text-sm text-[#8a6d51]">成功出炉的作品会陈列在这里</p></div><div className="mt-5 grid grid-cols-2 gap-3">{products.map((product) => <button key={product.id} onClick={() => { setSelectedProduct(product); navigate('product'); }} className="rounded-[28px] border bg-white p-4 text-left"><div className="grid aspect-square place-items-center rounded-[22px] bg-[#fff4dc] text-6xl">{product.emoji}</div><strong className="mt-3 block">{product.title}</strong><small className="text-[#9b806b]">{product.price}</small></button>)}</div></section>}

        {screen === 'product' && selectedProduct && <ProductEditor product={selectedProduct} onSave={saveProduct} onPublish={publishProduct} />}

        {screen === 'pk' && <section className="mt-6"><div className="rounded-[30px] bg-[#ffdfe3] p-5"><Trophy className="size-9 text-[#9b5660]" /><h2 className="mt-3 text-2xl font-black">今天也要漂亮出炉</h2><p className="mt-1 text-sm text-[#956d74]">展示制作记录、流程海报与面包故事</p></div>{publishedProducts.map((product) => <article key={product.id} className="mt-4 rounded-[30px] border bg-white p-5 shadow-sm"><div className="flex items-center gap-3"><span className="grid size-14 place-items-center rounded-2xl bg-[#fff1d7] text-4xl">{product.emoji}</span><div><strong className="text-lg">{product.title}</strong><small className="block text-[#9a8475]">来自我的面包店</small></div></div><div className="mt-4 rounded-[22px] bg-[#faf1e8] p-4"><span className="text-xs font-bold text-[#a0714f]">AI 制作流程海报</span><p className="mt-2 text-sm leading-6">称量 → 混合 → 发酵 / 醒发 → 烘焙 → 成品记录</p></div><p className="mt-4 text-sm leading-6 text-[#74645a]">{product.story}</p><button onClick={() => shareProduct(product)} className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#8b5963] font-bold text-white"><Share2 className="size-4" />{shared ? '文案已复制，可粘贴到朋友圈' : '转发到微信朋友圈'}</button></article>)}</section>}
      </div>
      <MapNav onClick={() => navigate('map')} />
    </main>
  );
}

function MapView({ onPlace, onReplay }: { onPlace: (id: string) => void; onReplay: () => void }) {
  return <main className="map-shell min-h-dvh overflow-hidden bg-[#eaf6fb] pb-24 text-[#514235]"><header className="pointer-events-none fixed inset-x-0 top-0 z-20 mx-auto flex max-w-md items-start justify-between px-5 pt-5"><div className="rounded-2xl bg-[#fffaf1]/86 px-4 py-2.5 shadow-sm backdrop-blur"><p className="text-[10px] font-bold tracking-[.18em] text-[#9d8773]">BREAD FACTORY</p><h1 className="text-lg font-extrabold">小麦世界地图</h1></div><button onClick={onReplay} className="pointer-events-auto rounded-full bg-white/85 px-3 py-2 text-xs font-bold shadow">重播田野故事</button></header><section className="relative mx-auto min-h-dvh w-full max-w-md overflow-hidden"><Image src="/map/bread-world.png" alt="面包世界地图" fill priority className="object-cover" />{mapPlaces.map((place) => <button key={place.id} onClick={() => onPlace(place.id)} className={`map-pin absolute ${place.pos} -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/80 bg-[#fffdf8]/90 px-3 py-2 text-center shadow-lg backdrop-blur-sm`}><strong className="whitespace-nowrap text-[12px]">{place.label}</strong></button>)}</section><MapNav onClick={() => onPlace('map')} /></main>;
}

function FieldView({ onMap }: { onMap: () => void }) {
  const [index, setIndex] = useState(1);
  useEffect(() => { const id = window.setInterval(() => setIndex((n) => (n + 1) % loadingFrames.length), 4500); return () => window.clearInterval(id); }, []);
  const item = loadingFrames[index];
  return <main className="min-h-dvh bg-[#eff8f4]"><section key={item.src} className="loading-frame relative mx-auto min-h-dvh max-w-md overflow-hidden"><Image src={item.src} alt={item.title} fill priority className="object-cover" /><div className="absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-[#fffaf1] via-[#fffaf1]/75 to-transparent" /><div className="absolute inset-x-0 bottom-28 px-7 text-center"><Wheat className="mx-auto size-6 text-[#8e9e60]" /><h1 className="mt-3 text-2xl font-black text-[#594538]">{item.title}</h1><p className="mt-2 text-sm text-[#806f62]">慢慢呼吸，看看小麦长大。不需要完成任何任务。</p><div className="mx-auto mt-5 h-1 w-24 overflow-hidden rounded-full bg-white/70"><div className="field-breathe h-full w-full bg-[#a8bb78]" /></div></div></section><MapNav onClick={onMap} /></main>;
}

function PageHeader({ title, onBack }: { title: string; onBack: () => void }) { return <header className="flex items-center gap-3"><button onClick={onBack} className="grid size-10 place-items-center rounded-full bg-white shadow-sm"><ArrowLeft className="size-4" /></button><div><p className="text-[10px] font-bold tracking-[.18em] text-[#a28977]">BREAD FACTORY</p><h1 className="text-xl font-black">{title}</h1></div></header>; }
function MapNav({ onClick }: { onClick: () => void }) { return <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto flex max-w-md justify-center bg-gradient-to-t from-[#fff9ef] via-[#fff9ef]/90 to-transparent pb-3 pt-5"><button onClick={onClick} className="flex min-w-24 flex-col items-center gap-1 rounded-[22px] border border-white bg-[#fffaf1]/95 px-7 py-2.5 text-[11px] font-extrabold tracking-[.12em] text-[#6f513e] shadow-xl"><Map className="size-5 fill-[#f1c794]" />MAP</button></nav>; }
function Empty({ icon, title, note, action, actionText }: { icon: React.ReactNode; title: string; note: string; action: () => void; actionText: string }) { return <div className="mt-6 rounded-[28px] border border-dashed bg-white/60 p-7 text-center"><div className="mx-auto grid size-12 place-items-center rounded-2xl bg-[#f3e9dd]">{icon}</div><h3 className="mt-4 font-black">{title}</h3><p className="mt-1 text-sm text-[#907c6f]">{note}</p><button onClick={action} className="mt-4 rounded-full bg-[#76543c] px-5 py-2 text-sm font-bold text-white">{actionText}</button></div>; }
function ProductEditor({ product, onSave, onPublish }: { product: Product; onSave: (p: Product) => void; onPublish: () => void }) {
  const [draft, setDraft] = useState(product);
  return <section className="mt-6"><div className="grid aspect-[4/3] place-items-center rounded-[32px] bg-[#fff0d2] text-8xl shadow-inner">{product.emoji}</div><div className="mt-4 space-y-4 rounded-[30px] border bg-white p-5"><label className="block text-xs font-bold text-[#8f7868]">产品名称<input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} className="mt-2 h-11 w-full rounded-xl border px-3 text-base font-bold" /></label><label className="block text-xs font-bold text-[#8f7868]">价格<input value={draft.price} onChange={(e) => setDraft({ ...draft, price: e.target.value })} className="mt-2 h-11 w-full rounded-xl border px-3 text-base" placeholder="例如：一颗真心" /></label><label className="block text-xs font-bold text-[#8f7868]">故事档案<textarea value={draft.story} onChange={(e) => setDraft({ ...draft, story: e.target.value })} className="mt-2 min-h-28 w-full rounded-xl border p-3 text-sm" /></label><button onClick={() => onSave(draft)} className="h-11 w-full rounded-full bg-[#795b45] font-bold text-white">保存产品档案</button></div><button onClick={() => { onSave(draft); onPublish(); }} className="mt-4 flex h-13 w-full items-center justify-center gap-2 rounded-full bg-[#9b5965] font-bold text-white"><Upload className="size-4" />一键生成海报并上传 PK 广场</button></section>;
}
