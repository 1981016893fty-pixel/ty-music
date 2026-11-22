import './ChromaGrid.css';

const GENRES = [
  ['流行乐', 'pop', '#ff2d95', 'linear-gradient(145deg, #ff2d95, #4a103a)', '椎名林檎'], ['摇滚', 'rock', '#7c4dff', 'linear-gradient(210deg, #7c4dff, #211044)', '五月天'], ['电子', 'electronic', '#00e5ff', 'linear-gradient(165deg, #00e5ff, #063e54)', 'Avicii'], ['嘻哈', 'hiphop', '#ff1744', 'linear-gradient(195deg, #ff1744, #4a0a21)', 'Eminem'], ['爵士', 'jazz', '#ff6d00', 'linear-gradient(225deg, #ff6d00, #4b1d06)', 'Miles Davis'], ['古典', 'classical', '#00e676', 'linear-gradient(135deg, #00e676, #073e2b)', 'Ludovico Einaudi'], ['K-Pop', 'kpop', '#ff4081', 'linear-gradient(145deg, #ff4081, #4b1234)', 'IU'], ['华语', 'chinese', '#e040fb', 'linear-gradient(210deg, #e040fb, #40105a)', '周杰伦'], ['R&B', 'rnb', '#448aff', 'linear-gradient(165deg, #448aff, #102c67)', 'The Weeknd'], ['拉丁', 'latin', '#ffab00', 'linear-gradient(195deg, #ffab00, #543606)', 'Bad Bunny'], ['动漫', 'anime', '#b388ff', 'linear-gradient(225deg, #b388ff, #2c1559)', 'Aimer'], ['乡村', 'country', '#ffd740', 'linear-gradient(135deg, #ffd740, #554514)', 'Taylor Swift']
];

export default function ChromaGrid({ onGenreClick }) {
  return <div className="chroma-grid">
    {GENRES.map(([title, id, borderColor, gradient, artist]) => <button type="button" key={id} className="chroma-card" onClick={() => onGenreClick?.(id)} style={{ '--card-border': borderColor, '--card-gradient': gradient }}>
      <span className="chroma-img-wrapper" aria-hidden="true"><img src={`/api/artist-photo?name=${encodeURIComponent(artist)}&size=320`} alt="" loading="lazy" decoding="async" /></span>
      <span className="chroma-info"><strong className="name">{title}</strong><span className="role">探索此流派</span></span>
    </button>)}
  </div>;
}
