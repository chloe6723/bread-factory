'use client';

import { useMemo, useState } from 'react';
import { BookOpen, Camera, Check, ChevronRight, Play, Sparkles, Store, Trophy, UserRound, Wheat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const ingredients = [['高筋面粉', '250 g'], ['冰牛奶', '175 g'], ['细砂糖', '28 g'], ['鲜酵母', '8 g']];
const nav = [[BookOpen, '食谱'], [Wheat, '车间'], [Trophy, '广场'], [UserRound, '我的']] as const;

export default function HomePage() {
  const [checked, setChecked] = useState([true, true, false, false]);
  const [started, setStarted] = useState(false);
  const [seconds, setSeconds] = useState(12 * 60 + 46);
  const [active, setActive] = useState('车间');
  const complete = checked.filter(Boolean).length;
  const time = useMemo(() => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`, [seconds]);

  function toggleIngredient(index: number) {
    setChecked((items) => items.map((value, i) => i === index ? !value : value));
  }

  function startTask() {
    setStarted(true);
    setSeconds((value) => Math.max(0, value - 60));
  }

  return (
    <main className="min-h-screen bg-background pb-28 text-foreground">
      <div className="mx-auto w-full max-w-md px-5 pt-5 sm:max-w-5xl sm:px-8">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground">SUNDAY · 10:24</p>
            <h1 className="mt-1 font-heading text-2xl font-bold tracking-tight">早上好，小麦同学</h1>
          </div>
          <button aria-label="查看我的面包小店" className="grid size-12 place-items-center rounded-full border bg-card shadow-sm">
            <Store className="size-5 text-primary" />
          </button>
        </header>

        <section className="bread-card mt-6 overflow-hidden rounded-[30px] p-5 text-[#fff9ec] shadow-xl shadow-primary/15 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#f8dba6]">
                <span className="rounded-full bg-white/12 px-2.5 py-1">进行中</span>
                <span>预计 12:40 出炉</span>
              </div>
              <h2 className="mt-4 text-2xl font-bold">盐面包 · 第一次发酵</h2>
              <p className="mt-1 text-sm text-white/70">步骤 4 / 9 · 室温 26°C</p>
            </div>
            <div className="loaf-mark" aria-hidden="true">🥐</div>
          </div>
          <div className="mt-7 grid grid-cols-[1fr_auto] items-end gap-4">
            <div>
              <p className="text-xs text-white/60">距离下次操作还有</p>
              <p className="mt-1 font-mono text-[2.7rem] font-semibold leading-none tracking-[-0.06em]">{time}</p>
            </div>
            <Button onClick={startTask} className="h-12 rounded-full bg-[#f6c876] px-5 font-bold text-[#432612] hover:bg-[#ffdb92]">
              {started ? <Check className="mr-1 size-4" /> : <Play className="mr-1 size-4 fill-current" />}
              {started ? '已记录' : '继续任务'}
            </Button>
          </div>
          <Progress value={44} className="mt-5 h-1.5 bg-white/15 [&>div]:bg-[#f6c876]" />
        </section>

        <section className="mt-7">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold tracking-widest text-primary">开工前核验</p>
              <h2 className="mt-1 text-xl font-bold">材料都准备好了吗？</h2>
            </div>
            <span className="text-sm font-semibold text-muted-foreground">{complete}/{ingredients.length}</span>
          </div>
          <div className="mt-3 overflow-hidden rounded-3xl border bg-card shadow-sm">
            {ingredients.map(([name, amount], index) => (
              <button key={name} onClick={() => toggleIngredient(index)} className="flex w-full items-center gap-3 border-b px-4 py-3.5 text-left last:border-0 hover:bg-muted/55">
                <span className={`grid size-6 place-items-center rounded-full border transition ${checked[index] ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background'}`}>
                  {checked[index] && <Check className="size-3.5 stroke-[3]" />}
                </span>
                <span className={`flex-1 text-sm font-semibold ${checked[index] ? 'text-muted-foreground line-through' : ''}`}>{name}</span>
                <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">{amount}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="mt-7 grid gap-3 sm:grid-cols-2">
          <button className="group flex items-center gap-4 rounded-3xl border bg-card p-4 text-left shadow-sm">
            <span className="grid size-11 place-items-center rounded-2xl bg-[#f4dfc4] text-[#6d3c1f]"><Camera className="size-5" /></span>
            <span className="flex-1"><strong className="block text-sm">记录这一刻</strong><small className="text-muted-foreground">拍下面团今天的状态</small></span>
            <ChevronRight className="size-4 text-muted-foreground transition group-hover:translate-x-0.5" />
          </button>
          <button className="group flex items-center gap-4 rounded-3xl border bg-card p-4 text-left shadow-sm">
            <span className="grid size-11 place-items-center rounded-2xl bg-[#deead3] text-[#4c683e]"><Sparkles className="size-5" /></span>
            <span className="flex-1"><strong className="block text-sm">今日灵感</strong><small className="text-muted-foreground">看看 862 人成功的秘诀</small></span>
            <ChevronRight className="size-4 text-muted-foreground transition group-hover:translate-x-0.5" />
          </button>
        </section>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-20 mx-auto flex max-w-md items-center justify-around border-t bg-background/92 px-3 pb-[max(12px,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl sm:bottom-5 sm:max-w-lg sm:rounded-full sm:border sm:shadow-xl">
        {nav.map(([Icon, label]) => (
          <button key={label} onClick={() => setActive(label)} className={`relative flex min-w-16 flex-col items-center gap-1 rounded-2xl py-2 text-[11px] font-semibold transition ${active === label ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
            {active === label && <span className="absolute inset-x-5 -top-2 h-0.5 rounded-full bg-primary" />}
            <Icon className={`size-5 ${active === label ? 'stroke-[2.6]' : ''}`} />
            {label}
          </button>
        ))}
      </nav>
    </main>
  );
}
