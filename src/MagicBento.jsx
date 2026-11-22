import './MagicBento.css';
import { GlassIcon } from './GlassIcons';

const cards = [
  { title: '热门排行榜', description: '现在大家都在听', icon: 'fa-chart-line', color: 'red', source: 'netease-hot' },
  { title: '新歌速递', description: '刚刚上线的新声音', icon: 'fa-wand-magic-sparkles', color: 'blue', source: 'netease-new' },
  { title: '华语经典', description: '耐听的中文金曲', icon: 'fa-headphones', color: 'purple', query: '华语经典 金曲' },
  { title: '夜间氛围', description: '适合安静聆听', icon: 'fa-moon', color: 'indigo', query: '夜间 氛围 ambient' }
];

export default function MagicBento() {
  return <div className="card-grid bento-section">{cards.map(card =>
    <button key={card.title} type="button" className="magic-bento-card" data-browse-source={card.source} data-browse-query={card.query} data-browse-title={card.title}>
      <span className="magic-bento-card__header"><GlassIcon icon={card.icon} color={card.color} /></span>
      <span className="magic-bento-card__content"><strong className="magic-bento-card__title">{card.title}</strong><small className="magic-bento-card__description">{card.description}</small></span>
    </button>
  )}</div>;
}
