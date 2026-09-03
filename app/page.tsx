'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { Award, BookHeart, Camera, Check, ChevronLeft, ChevronRight, Clock3, Heart, Home, LockKeyhole, PackageOpen, Plus, Refrigerator, Search, ShoppingBag, Sparkles, Star, Store, Timer, UserRound, Wheat, X } from 'lucide-react';

type MainTab = 'calendar' | 'bakery' | 'collection';
type RoomTab = 'room' | 'fridge' | 'make' | 'showcase' | 'orders';
type Identity = 'foodie' | 'chef' | 'owner';

const identities: Record<Identity, { name: string; note: string }> = {
  foodie: { name: '面包美食家', note: '日历、冰箱和一层橱窗' },
  chef: { name: '甜品师', note: '解锁食谱、制作台与手作层' },
  owner: { name: '主理人', note: '解锁现货、预订与订单' },
};

const monthDays = Array.from({ length: 35 }, (_, i) => i < 2 ? 0 : i - 1);
const diary: Record<number, { icons: string[]; count?: number }> = {
  1: { icons: ['🥐'], count: 2 }, 3: { icons: ['🍞'] }, 5: { icons: ['🥯', '🥖'] },
  8: { icons: ['🧁'] }, 10: { icons: ['🥐', '🍞', '🥯', '🍰'] }, 12: { icons: ['🥖'], count: 3 },
  15: { icons: ['🍞'] }, 18: { icons: ['🥐', '🍰'] }, 20: { icons: ['🥯'] }, 23: { icons: ['🧁'] }, 26: { icons: ['🥐'], count: 2 }, 28: { icons: ['🍞'] },
};

const fridgeItems = [
  { icon: '🥐', name: '海盐卷', qty: 3, freshness: '明天前吃完', tone: 'soon' },
  { icon: '🍞', name: '全麦吐司', qty: 6, freshness: '还可保存 3 天', tone: 'fresh' },
  { icon: '🥯', name: '蓝莓贝果', qty: 2, freshness: '冷冻 · 还可保存 12 天', tone: 'frozen' },
];

const achievements = [
  { icon: '🥐', name: '第一口记录', note: '完成第一次面包打卡', got: true },
  { icon: '❄️', name: '冰箱管理员', note: '及时吃完 5 次临期面包', got: true },
  { icon: '👩‍🍳', name: '第一次出炉', note: '成功完成第一份食谱', got: true },
  { icon: '✨', name: '小小改良家', note: '保存第一个改良副本', got: false },
  { icon: '💌', name: '有人想吃', note: '收到第一份想吃申请', got: false },
  { icon: '🌟', name: '五星面包房', note: '收到第一条五星评价', got: false },
];

export default function HomePage() {
  const [mainTab, setMainTab] = useState<MainTab>('calendar');
  const [roomTab, setRoomTab] = useState<RoomTab>('room');
  const [identity, setIdentity] = useState<Identity>('foodie');
  const [showIdentity, setShowIdentity] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(3);
  const [toast, setToast] = useState('');
  const [timer, setTimer] = useState(false);
  const title = mainTab === 'calendar' ? '今天吃了什么面包？' : mainTab === 'bakery' ? '小麦面包房' : '我的收藏';

  function flash(message: string) { setToast(message); window.setTimeout(() => setToast(''), 1800); }
  function openRoom(next: RoomTab) {
    if (next === 'make' && identity === 'foodie') return flash('成为甜品师后解锁制作台');
    if (next === 'orders' && identity !== 'owner') return flash('完成第一个成品后，可开启主理人任务');
    setRoomTab(next);
  }

  return <main className="app-shell">
    <div className="phone">
      <header className="topbar">
        <div><p className="eyebrow">BREAD DAYS · SEPTEMBER</p><h1>{title}</h1></div>
        <button className="avatar" onClick={() => setShowIdentity(true)} aria-label="切换身份"><span>🐮</span><small>{identities[identity].name}</small></button>
      </header>

      <div className="screen">
        {mainTab === 'calendar' && <CalendarView selectedDay={selectedDay} onSelect={setSelectedDay} onFlash={flash} />}
        {mainTab === 'bakery' && <BakeryView identity={identity} roomTab={roomTab} openRoom={openRoom} timer={timer} setTimer={setTimer} onFlash={flash} />}
        {mainTab === 'collection' && <CollectionView identity={identity} onIdentity={() => setShowIdentity(true)} />}
      </div>

      <nav className="main-nav">
        <NavButton active={mainTab === 'calendar'} icon={<BookHeart />} label="日历" onClick={() => setMainTab('calendar')} />
        <NavButton active={mainTab === 'bakery'} icon={<Home />} label="面包房" onClick={() => { setMainTab('bakery'); setRoomTab('room'); }} />
        <NavButton active={mainTab === 'collection'} icon={<Award />} label="收藏" onClick={() => setMainTab('collection')} />
      </nav>
      {toast && <div className="toast">{toast}</div>}
      {showIdentity && <IdentitySheet value={identity} onChange={(next) => { setIdentity(next); setShowIdentity(false); flash(`已切换为${identities[next].name}`); }} onClose={() => setShowIdentity(false)} />}
    </div>
  </main>;
}

function CalendarView({ selectedDay, onSelect, onFlash }: { selectedDay: number | null; onSelect: (day: number | null) => void; onFlash: (s: string) => void }) {
  const selected = selectedDay ? diary[selectedDay] : undefined;
  return <>
    <section className="date-head"><button><ChevronLeft /></button><div><strong>2026年 9月</strong><small>本月已经认识 8 款面包</small></div><button><ChevronRight /></button></section>
    <section className="calendar-card">
      <div className="week">{['一','二','三','四','五','六','日'].map(d => <span key={d}>{d}</span>)}</div>
      <div className="days">{monthDays.map((day, i) => day === 0 ? <span key={`blank-${i}`} /> : <button key={day} className={selectedDay === day ? 'selected' : ''} onClick={() => onSelect(day)}><small>{day}</small>{diary[day] && <StickerStack item={diary[day]} />}</button>)}</div>
    </section>
    <section className="month-summary"><div><span className="tag">THIS MONTH</span><strong>18 <small>次面包时光</small></strong><p>最常出现 · 海盐卷</p></div><div className="summary-stickers"><span>🥐</span><span>🍞</span><span>🥯</span></div></section>
    {selectedDay && <div className="drawer" role="dialog" aria-label={`${selectedDay}日面包记录`}><div className="grab" /><div className="drawer-title"><div><span className="tag">9月{selectedDay}日</span><h2>{selected ? '今天的面包' : '这一天还没有记录'}</h2></div><button onClick={() => onSelect(null)}><X /></button></div>{selected && <div className="diary-row"><div className="big-sticker">{selected.icons[0]}</div><div><strong>海盐卷 {selected.count ? `×${selected.count}` : '×1'}</strong><p>早餐 · ⭐ 还可以以后补充评价</p></div><ChevronRight /></div>}<div className="quick-actions"><button onClick={() => onFlash('打开相机：现在吃，直接完成记录')}><Camera /><span>拍照打卡</span></button><button onClick={() => onFlash('搜索已经记录过的面包')}><Search /><span>搜索面包</span></button><button onClick={() => onFlash('从冰箱库存快捷选择并扣减 pcs')}><Refrigerator /><span>选择库存</span></button></div><p className="privacy">默认公开 · 可改为仅好友或仅自己可见</p></div>}
  </>;
}

function StickerStack({ item }: { item: { icons: string[]; count?: number } }) {
  const shown = item.icons.slice(0, 3); const rest = item.icons.length - 3;
  return <span className="sticker-stack">{shown.map((icon, i) => <i key={`${icon}-${i}`} style={{ transform: `translateX(${i * 11}px) rotate(${i * 6 - 5}deg)` }}>{icon}{i === 0 && item.count && <b>×{item.count}</b>}</i>)}{rest > 0 && <em>+{rest}</em>}</span>;
}

function BakeryView({ identity, roomTab, openRoom, timer, setTimer, onFlash }: { identity: Identity; roomTab: RoomTab; openRoom: (t: RoomTab) => void; timer: boolean; setTimer: (v: boolean) => void; onFlash: (s: string) => void }) {
  return <>
    {roomTab === 'room' && <section className="room-card"><Image src="/bakery-room.png" alt="奶油彩铅与温暖原木风格的面包房" fill priority className="room-image" /><div className="room-shade" /><button className="hotspot fridge" onClick={() => openRoom('fridge')}><Refrigerator />冰箱</button><button className="hotspot bench" onClick={() => openRoom('make')}><span>{identity === 'foodie' ? <LockKeyhole /> : <Wheat />}</span>制作台</button><button className="hotspot case" onClick={() => openRoom('showcase')}><Store />橱窗</button>{identity === 'owner' && <button className="customer" onClick={() => openRoom('orders')}><span>🐰</span><b>想吃 4 pcs</b></button>}<div className="room-caption"><span className="tag">{identities[identity].name}</span><h2>下午的面包房刚刚亮灯</h2><p>{identity === 'foodie' ? '先从记录每一口喜欢开始。' : identity === 'chef' ? '工作台已经准备好，今天想做什么？' : '门口有朋友在等你的面包。'}</p></div></section>}
    {roomTab === 'fridge' && <FridgeView onFlash={onFlash} />}
    {roomTab === 'make' && <MakeView timer={timer} setTimer={setTimer} onFlash={onFlash} />}
    {roomTab === 'showcase' && <ShowcaseView identity={identity} onFlash={onFlash} />}
    {roomTab === 'orders' && <OrdersView />}
    <nav className="room-nav"><NavButton active={roomTab === 'fridge'} icon={<Refrigerator />} label="冰箱" onClick={() => openRoom('fridge')} /><NavButton active={roomTab === 'make'} locked={identity === 'foodie'} icon={<Wheat />} label="制作" onClick={() => openRoom('make')} /><NavButton active={roomTab === 'showcase'} icon={<Store />} label="橱窗" onClick={() => openRoom('showcase')} /><NavButton active={roomTab === 'orders'} locked={identity !== 'owner'} icon={<ShoppingBag />} label="订单" onClick={() => openRoom('orders')} /></nav>
  </>;
}

function FridgeView({ onFlash }: { onFlash: (s: string) => void }) {
  return <section><div className="section-head"><div><span className="tag">MY FRIDGE</span><h2>今天先吃临期的</h2></div><button className="round-add" onClick={() => onFlash('拍照 → 店铺可选 → 名称 → pcs → 保存方式')}><Plus /></button></div><div className="notice">🐮 <span>海盐卷明天进入最佳赏味期最后一天，要不要安排进早餐？</span></div><div className="item-list">{fridgeItems.map(item => <button key={item.name} onClick={() => onFlash(`选择吃掉的 ${item.name} pcs，自动加入今日日历`)}><span className="item-sticker">{item.icon}</span><span><strong>{item.name}</strong><small>{item.freshness}</small></span><b>{item.qty} pcs</b></button>)}</div><div className="fridge-foot"><span>总库存</span><strong>11 pcs</strong><small>全部按最小份数记录</small></div></section>;
}

function MakeView({ timer, setTimer, onFlash }: { timer: boolean; setTimer: (v: boolean) => void; onFlash: (s: string) => void }) {
  return <section><div className="section-head"><div><span className="tag">WORKBENCH</span><h2>选择今天的食谱</h2></div><button className="filter">筛选</button></div><div className="filter-row"><span>时间</span><span>工具</span><span>难度</span></div><button className="ai-card" onClick={() => onFlash('粘贴文字或视频链接，AI 整理为工厂步骤')}><span><Sparkles /></span><div><strong>让 AI 帮你整理食谱</strong><small>文字或视频 → 可执行制作流程</small></div><Plus /></button><div className="recipe-grid"><button onClick={() => setTimer(!timer)}><span>🍮</span><strong>焦糖布丁</strong><small>50分钟 · 简单</small></button><button onClick={() => onFlash('打开食谱组：原版＋2个改良副本')}><span>🍰</span><strong>云朵戚风</strong><small>90分钟 · 3个版本</small></button></div>{timer && <div className="floating-timer"><span className="cow-clock">🥺</span><div><small>第一次发酵</small><strong>23:48</strong></div><button onClick={() => onFlash('返回当前制作步骤')}><Timer /></button></div>}</section>;
}

function ShowcaseView({ identity, onFlash }: { identity: Identity; onFlash: (s: string) => void }) {
  return <section><div className="section-head"><div><span className="tag">BREAD WINDOW</span><h2>会长高的面包橱窗</h2></div><button className="filter">装修</button></div><div className="shelf"><div className="shelf-title"><span>第一层 · 吃过的</span><small>所有身份开放</small></div><div className="shelf-items"><BreadProduct icon="🥐" name="海盐卷" note="4.8 ★" /><BreadProduct icon="🥯" name="蓝莓贝果" note="吃过 6 次" /><BreadProduct icon="🍞" name="全麦吐司" note="本周最爱" /></div></div><div className={`shelf ${identity === 'foodie' ? 'locked-shelf' : ''}`}><div className="shelf-title"><span>第二层 · 我做的</span><small>{identity === 'foodie' ? '成为甜品师后解锁' : '成功成品'}</small></div>{identity === 'foodie' ? <div className="unlock-note"><LockKeyhole /><p>累计打卡 7 天后<br/>开启“成为甜品师”任务</p></div> : <div className="shelf-items"><button className="product" onClick={() => onFlash(identity === 'owner' ? '现货 4 pcs · 输入密码兑换' : '成功成品可以展示，成为主理人后接单')}><span>🍰</span><strong>草莓戚风</strong><small>{identity === 'owner' ? '现货 ×4' : '第一次成功'}</small></button><BreadProduct icon="🍮" name="焦糖布丁" note={identity === 'owner' ? '接受预订' : '我的作品'} /></div>}</div></section>;
}

function BreadProduct({ icon, name, note }: { icon: string; name: string; note: string }) { return <button className="product"><span>{icon}</span><strong>{name}</strong><small>{note}</small></button>; }
function OrdersView() { return <section><div className="section-head"><div><span className="tag">ORDERS</span><h2>门口排队的朋友</h2></div><span className="grain">🌾 260</span></div><div className="order-card"><span className="customer-face">🐰</span><div><strong>小桃想吃草莓戚风</strong><p>4 pcs · 当面配送 · 周六下午</p><span>趣味价格：一杯咖啡＋一个拥抱</span></div><button>处理</button></div><div className="order-card"><span className="customer-face">🐻</span><div><strong>现货兑换成功</strong><p>海盐卷 2 pcs · 快递到付</p><span>等待填写快递单号</span></div><button>发货</button></div></section>; }

function CollectionView({ identity, onIdentity }: { identity: Identity; onIdentity: () => void }) {
  return <section><div className="identity-card"><div><span className="tag">CURRENT ROLE</span><h2>{identities[identity].name}</h2><p>{identities[identity].note}</p></div><button onClick={onIdentity}>切换身份</button></div><div className="collection-tabs"><button className="active">徽章</button><button>图鉴</button><button>店铺</button><button>报告</button></div><div className="achievement-title"><h2>我的成就</h2><span>已解锁 3 / 6</span></div><div className="badge-grid">{achievements.map(item => <button key={item.name} className={item.got ? 'got' : 'locked'}><span>{item.got ? item.icon : '❔'}</span><strong>{item.name}</strong><small>{item.note}</small>{item.got && <i><Check /> 已获得</i>}</button>)}</div><div className="reward-note"><Wheat /><div><strong>成就奖励不会出现在麦粒商店</strong><p>解锁限定对话框、桌椅、餐盘，同时获得麦粒积分。</p></div></div></section>;
}

function IdentitySheet({ value, onChange, onClose }: { value: Identity; onChange: (i: Identity) => void; onClose: () => void }) {
  return <div className="modal-backdrop" onClick={onClose}><section className="identity-sheet" onClick={e => e.stopPropagation()}><div className="grab"/><div className="drawer-title"><div><span className="tag">体验功能递进</span><h2>切换店主身份</h2></div><button onClick={onClose}><X /></button></div>{(Object.keys(identities) as Identity[]).map((key, index) => <button className={`identity-option ${value === key ? 'active' : ''}`} key={key} onClick={() => onChange(key)}><span>{index === 0 ? '🥐' : index === 1 ? '👩‍🍳' : '🏠'}</span><div><strong>{identities[key].name}</strong><small>{identities[key].note}</small></div>{value === key && <Check />}</button>)}<p className="prototype-note">骨架版允许直接切换，正式产品将按打卡与成品任务逐步解锁。</p></section></div>;
}

function NavButton({ active, locked, icon, label, onClick }: { active: boolean; locked?: boolean; icon: React.ReactNode; label: string; onClick: () => void }) { return <button className={active ? 'active' : ''} onClick={onClick}>{locked && <i className="nav-lock">·</i>}{icon}<span>{label}</span></button>; }
