import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Share2, Check, Instagram } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { fetchDetails, TMDB_IMAGE_BASE_URL } from '../lib/tmdb';
import { Movie } from '../types';
import { Row } from '../components/Row';

export function WatchScreen() {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const shareCanvasRef = useRef<HTMLCanvasElement>(null);

  const season = Number(searchParams.get('s')) || 1;
  const episode = Number(searchParams.get('e')) || 1;

  const [details, setDetails] = useState<Movie | null>(null);
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [generatingCard, setGeneratingCard] = useState(false);

  useEffect(() => {
    if (id && type) {
      fetchDetails(id, type as 'movie' | 'tv').then(setDetails).catch(console.error);
    }
  }, [id, type]);

  // Close share menu on outside click
  useEffect(() => {
    if (!shareMenuOpen) return;
    const handler = () => setShareMenuOpen(false);
    window.addEventListener('click', handler);
    return () => window.removeEventListener('click', handler);
  }, [shareMenuOpen]);

  const updateParam = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set(key, value);
    setSearchParams(newParams);
  };

  const [adsDismissed, setAdsDismissed] = useState(() =>
    localStorage.getItem('zf_ads_notice') === '1'
  );
  const dismissAds = () => {
    localStorage.setItem('zf_ads_notice', '1');
    setAdsDismissed(true);
  };

  // Vidlink URLs
  const movieUrl = `https://vidlink.pro/movie/${id}`;
  const tvUrl = `https://vidlink.pro/tv/${id}/${season}/${episode}`;
  const videoUrl = type === 'tv' ? tvUrl : movieUrl;

  const title = details?.title || details?.name || details?.original_name || '';
  const year = (details?.release_date || details?.first_air_date)?.substring(0, 4) || '';
  const rating = details?.vote_average?.toFixed(1) || '';
  const posterUrl = details?.poster_path ? `${TMDB_IMAGE_BASE_URL}${details.poster_path}` : null;
  const shareUrl = `https://zestyyflix.vercel.app/watch/${type}/${id}`;

  // ── Share helpers ──────────────────────────────────────────────
  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate a share card image on canvas then share/download
  const generateShareCard = async (forInstagram = false) => {
    setGeneratingCard(true);
    try {
      const canvas = document.createElement('canvas');
      // Instagram Stories ratio 9:16
      canvas.width = 1080;
      canvas.height = 1920;
      const ctx = canvas.getContext('2d')!;

      // Background
      ctx.fillStyle = '#141414';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Load & draw poster
      if (posterUrl) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        await new Promise((res) => {
          img.onload = res;
          img.onerror = res;
          img.src = posterUrl;
        });
        // Draw poster centered, covering top 65% of canvas
        const destH = canvas.height * 0.65;
        const destW = canvas.width;
        const scale = Math.max(destW / img.width, destH / img.height);
        const sw = destW / scale;
        const sh = destH / scale;
        const sx = (img.width - sw) / 2;
        const sy = (img.height - sh) / 2;
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, destW, destH);

        // Gradient overlay bottom of poster into bg
        const grad = ctx.createLinearGradient(0, destH * 0.5, 0, destH);
        grad.addColorStop(0, 'rgba(20,20,20,0)');
        grad.addColorStop(1, 'rgba(20,20,20,1)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, destH);
      }

      // Title
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 90px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(title.toUpperCase(), canvas.width / 2, 1320);

      // Year • ★ Rating
      ctx.font = 'bold 52px sans-serif';
      ctx.fillStyle = '#F5C518';
      ctx.fillText(`${year}  •  ★ ${rating}`, canvas.width / 2, 1410);

      // Divider
      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(canvas.width * 0.2, 1480);
      ctx.lineTo(canvas.width * 0.8, 1480);
      ctx.stroke();

      // Branding
      ctx.font = 'bold 72px sans-serif';
      ctx.fillStyle = '#E50914';
      ctx.fillText('ZESTYYFLIX', canvas.width / 2, 1590);

      ctx.font = '40px sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,0.45)';
      ctx.fillText('zestyyflix.vercel.app', canvas.width / 2, 1660);

      // Convert to blob
      const blob = await new Promise<Blob | null>((res) =>
        canvas.toBlob(res, 'image/png')
      );
      if (!blob) throw new Error('Canvas blob failed');

      const file = new File([blob], 'zestyyflix-share.png', { type: 'image/png' });

      if (forInstagram && navigator.share && navigator.canShare?.({ files: [file] })) {
        // Web Share API with file → goes straight to Instagram Stories on mobile
        await navigator.share({
          files: [file],
          title: `${title} on Zestyyflix`,
        });
      } else if (navigator.share) {
        // Fallback: share URL (desktop / browsers that don't support file share)
        await navigator.share({ title: `${title} on Zestyyflix`, url: shareUrl });
      } else {
        // Final fallback: download the image
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `zestyyflix-${title.replace(/\s+/g, '-')}.png`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Share failed:', err);
    } finally {
      setGeneratingCard(false);
      setShareMenuOpen(false);
    }
  };

  const director = details?.credits?.crew.find(c => c.job === 'Director') || details?.credits?.crew.find(c => c.job === 'Executive Producer');
  const cast = details?.credits?.cast.slice(0, 10) || [];

  const recommendations = details?.recommendations?.results?.length
    ? details.recommendations.results
    : (details as any)?.similar?.results || [];

  return (
    <div className="w-full min-h-screen bg-[#141414] flex flex-col relative overflow-x-hidden">
      {/* Top Navbar */}
      <div className="absolute top-0 left-0 w-full p-4 md:p-6 z-50 flex items-center justify-between bg-gradient-to-b from-black/90 via-black/50 to-transparent">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10"
        >
          <ArrowLeft className="w-6 h-6 md:w-8 md:h-8" />
          <span className="text-xs md:text-xl font-medium hidden sm:block">Back</span>
        </button>

        {/* Share Button */}
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setShareMenuOpen(v => !v)}
            className="flex items-center gap-2 text-white bg-black/40 hover:bg-black/70 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10 transition-all"
          >
            <Share2 className="w-5 h-5" />
            <span className="text-xs font-medium hidden sm:block">Share</span>
          </button>

          {shareMenuOpen && (
            <div className="absolute right-0 top-12 w-52 bg-[#1f1f1f] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50">
              {/* Instagram Stories */}
              <button
                onClick={() => generateShareCard(true)}
                disabled={generatingCard}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-sm text-white disabled:opacity-50"
              >
                <Instagram className="w-4 h-4 text-pink-400" />
                {generatingCard ? 'Generating...' : 'Share to Instagram'}
              </button>

              {/* Share Card (download) */}
              <button
                onClick={() => generateShareCard(false)}
                disabled={generatingCard}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-sm text-white disabled:opacity-50 border-t border-white/5"
              >
                <Share2 className="w-4 h-4 text-blue-400" />
                {generatingCard ? 'Generating...' : 'Share Card'}
              </button>

              {/* Copy Link */}
              <button
                onClick={copyLink}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-sm text-white border-t border-white/5"
              >
                {copied
                  ? <><Check className="w-4 h-4 text-green-400" /> Copied!</>
                  : <><span className="w-4 h-4 text-center text-xs">🔗</span> Copy Link</>
                }
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Video Player */}
      <div className="w-full aspect-video md:h-[80vh] md:aspect-auto relative z-0 bg-black shadow-2xl">
        <iframe
          src={videoUrl}
          className="w-full h-full border-0 absolute inset-0"
          allowFullScreen
          allow="autoplay; fullscreen; picture-in-picture"
        />
      </div>

      {/* Ads notice — dismissible, remembers preference */}
      {!adsDismissed && (
        <div className="flex items-center justify-between gap-3 px-4 py-2 bg-[#1a1a1a] border-b border-white/5">
          <p className="text-[11px] text-gray-500 leading-snug">
            You may see a brief ad before playback. Press play once and the stream will start — no further interruptions.
          </p>
          <button
            onClick={dismissAds}
            className="shrink-0 text-[11px] text-gray-600 hover:text-gray-400 transition-colors border border-white/10 rounded-full px-2 py-0.5"
          >
            ✕
          </button>
        </div>
      )}

      {/* Controls bar */}
      <div className="w-full bg-[#181818] border-b border-white/10 px-4 md:px-12 py-4 shadow-lg sticky top-0 z-40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 md:gap-8">
            {type === 'tv' && (
              <div className="flex items-center gap-4">
                <div className="flex gap-2 items-center bg-zinc-800/50 px-3 py-1.5 rounded-lg border border-white/5">
                  <label htmlFor="season" className="text-gray-400 text-xs md:text-sm font-bold uppercase tracking-wider">Season</label>
                  <select
                    id="season"
                    value={season}
                    onChange={(e) => updateParam('s', e.target.value)}
                    className="bg-zinc-900 text-white border-0 font-bold rounded-md px-3 py-1 outline-none focus:ring-2 focus:ring-red-600 transition-all cursor-pointer"
                  >
                    {[...Array(details?.number_of_seasons || 20)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2 items-center bg-zinc-800/50 px-3 py-1.5 rounded-lg border border-white/5">
                  <label htmlFor="episode" className="text-gray-400 text-xs md:text-sm font-bold uppercase tracking-wider">Episode</label>
                  <select
                    id="episode"
                    value={episode}
                    onChange={(e) => updateParam('e', e.target.value)}
                    className="bg-zinc-900 text-white border-0 font-bold rounded-md px-3 py-1 outline-none focus:ring-2 focus:ring-red-600 transition-all cursor-pointer"
                  >
                    {[...Array(40)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
          <div className="hidden md:flex items-center gap-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
            Now Playing on <span className="text-red-600">Zestyyflix</span>
          </div>
        </div>
      </div>

      {/* Details */}
      {details && (
        <div className="px-4 md:px-12 py-8 text-white max-w-7xl mx-auto w-full flex-1">
          <div className="flex items-start justify-between flex-wrap gap-6 mb-10 border-b border-white/10 pb-8">
            <div className="max-w-3xl">
              <h1 className="text-xl md:text-5xl font-bold tracking-tighter mb-4">
                {title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-xs md:text-base text-gray-400 mb-6 font-medium">
                {details.vote_average && details.vote_average > 0 ? (
                  <span className="text-green-500 font-bold flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    {details.vote_average.toFixed(1)} Rating
                  </span>
                ) : null}
                {year ? <span>{year}</span> : null}
                {details.runtime ? (
                  <span>{Math.floor(details.runtime / 60)}h {details.runtime % 60}m</span>
                ) : type === 'tv' && details.number_of_seasons ? (
                  <span>{details.number_of_seasons} Seasons</span>
                ) : null}
                <span className="border border-gray-600 px-2 rounded-sm text-xs text-gray-300 bg-white/5">HD</span>
              </div>
              <p className="text-gray-300 text-sm md:text-lg leading-relaxed">{details.overview}</p>
              {details.genres && details.genres.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2 text-sm text-gray-400">
                  <span className="text-gray-500">Genres:</span>
                  {details.genres.map(g => (
                    <span key={g.id} className="hover:text-white cursor-pointer transition-colors hover:underline">{g.name}</span>
                  )).reduce((prev, curr) => [prev, ', ', curr] as any)}
                </div>
              )}
            </div>

            {director && (
              <div className="flex flex-col gap-3 min-w-[200px] border border-white/5 bg-white/5 p-4 rounded-xl">
                <span className="text-sm text-gray-500 font-medium uppercase tracking-widest">{director.job}</span>
                <div
                  className="flex items-center gap-3 cursor-pointer group"
                  onClick={() => navigate(`/?actor=${director.id}&actorName=${encodeURIComponent(director.name)}`)}
                >
                  {director.profile_path ? (
                    <img src={`${TMDB_IMAGE_BASE_URL}${director.profile_path}`} alt={director.name}
                      className="w-12 h-12 rounded-full object-cover shadow-lg border border-white/10 group-hover:border-white/40 transition-colors" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 border border-white/10">
                      {director.name.charAt(0)}
                    </div>
                  )}
                  <span className="font-medium group-hover:text-red-400 transition-colors">{director.name}</span>
                </div>
              </div>
            )}
          </div>

          {cast.length > 0 && (
            <div className="mb-12">
              <h3 className="text-xl font-bold mb-6 text-gray-200">Top Cast</h3>
              <div className="flex overflow-x-auto gap-4 md:gap-6 pb-6 no-scrollbar snap-x">
                {cast.map(actor => (
                  <button key={actor.id}
                    onClick={() => navigate(`/?actor=${actor.id}&actorName=${encodeURIComponent(actor.name)}`)}
                    className="flex flex-col items-center gap-3 shrink-0 snap-start group text-center w-24 md:w-32"
                  >
                    <div className="w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-transparent group-hover:border-red-500 transition-all duration-300 shadow-xl bg-gray-900">
                      {actor.profile_path ? (
                        <img src={`${TMDB_IMAGE_BASE_URL}${actor.profile_path}`} alt={actor.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500 text-3xl font-light bg-zinc-800">
                          {actor.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white group-hover:text-red-400 transition-colors line-clamp-1">{actor.name}</div>
                      <div className="text-xs text-gray-500 line-clamp-1 mt-0.5">{actor.character}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mb-16 -mt-4">
        {recommendations.length > 0 && (
          <Row
            title="You Might Also Like"
            moviesList={recommendations}
            type={type as 'movie' | 'tv'}
            onMovieClick={(newId, newType) => {
              navigate(`/watch/${newType}/${newId}`);
              window.scrollTo(0, 0);
            }}
          />
        )}
      </div>

      {/* Hidden canvas for share card generation */}
      <canvas ref={shareCanvasRef} className="hidden" />
    </div>
  );
}
