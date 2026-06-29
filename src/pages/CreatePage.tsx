import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Video, Upload, Mic, FileText, Loader2, Play, Download, ChevronDown, LayoutDashboard } from 'lucide-react';

const PRESET_AVATARS = [
  { id: 'anna', name: 'Anna', url: 'https://d-id-public-bucket.s3.us-east-1.amazonaws.com/alice.jpg' },
  { id: 'john', name: 'John', url: 'https://d-id-public-bucket.s3.us-east-1.amazonaws.com/samantha.jpg' },
];

const VOICES = [
  { id: 'en-US-JennyNeural',   label: 'Jenny (US English, Female)' },
  { id: 'en-US-GuyNeural',     label: 'Guy (US English, Male)' },
  { id: 'en-GB-SoniaNeural',   label: 'Sonia (British English, Female)' },
  { id: 'en-IN-NeerjaNeural',  label: 'Neerja (Indian English, Female)' },
  { id: 'en-IN-PrabhatNeural', label: 'Prabhat (Indian English, Male)' },
  { id: 'hi-IN-SwaraNeural',   label: 'Swara (Hindi, Female)' },
  { id: 'hi-IN-MadhurNeural',  label: 'Madhur (Hindi, Male)' },
];

type Status = 'idle' | 'generating' | 'polling' | 'done' | 'error';

export default function CreatePage() {
  const [selectedAvatar, setSelectedAvatar] = useState(PRESET_AVATARS[0]);
  const [customPhoto, setCustomPhoto]       = useState<string | null>(null);
  const [script, setScript]                 = useState('');
  const [voice, setVoice]                   = useState(VOICES[0].id);
  const [status, setStatus]                 = useState<Status>('idle');
  const [videoUrl, setVideoUrl]             = useState<string | null>(null);
  const [errorMsg, setErrorMsg]             = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const avatarUrl = customPhoto ?? selectedAvatar.url;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setCustomPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!script.trim()) return;
    setStatus('generating');
    setErrorMsg('');
    setVideoUrl(null);

    try {
      const res = await fetch('/api/generate-talk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceUrl: avatarUrl, script: script.trim(), voice }),
      });

      const data = await res.json();
      if (!res.ok) { setErrorMsg(data.error ?? 'Generation failed.'); setStatus('error'); return; }

      setStatus('polling');
      const talkId: string = data.id;
      let attempts = 0;

      const poll = async () => {
        attempts++;
        if (attempts > 30) { setErrorMsg('Timed out. Try again.'); setStatus('error'); return; }

        const pollRes = await fetch(`/api/get-talk?id=${talkId}`);
        const pollData = await pollRes.json();

        if (pollData.status === 'done') {
          setVideoUrl(pollData.result_url);
          setStatus('done');
        } else if (pollData.status === 'error') {
          setErrorMsg('D-ID generation failed.');
          setStatus('error');
        } else {
          setTimeout(poll, 3000);
        }
      };
      setTimeout(poll, 3000);

    } catch {
      setErrorMsg('Network error. Please try again.');
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white">
      {/* Nav */}
      <nav className="border-b border-white/10 sticky top-0 z-50 bg-[#0f0f1a]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-lg flex items-center justify-center">
              <Video className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">Talkr</span>
          </Link>
          <Link to="/dashboard" className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition">
            <LayoutDashboard className="w-4 h-4" /> My videos
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-2">Create a talking avatar</h1>
        <p className="text-slate-400 mb-10">Pick an avatar, write your script, choose a voice — generate.</p>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left — controls */}
          <div className="space-y-6">

            {/* Avatar picker */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <Upload className="w-4 h-4 text-violet-400" /> Avatar
              </h2>
              <div className="flex gap-3 mb-4">
                {PRESET_AVATARS.map(av => (
                  <button key={av.id} onClick={() => { setSelectedAvatar(av); setCustomPhoto(null); }}
                    className={`relative rounded-xl overflow-hidden border-2 transition ${selectedAvatar.id === av.id && !customPhoto ? 'border-violet-500' : 'border-white/10 hover:border-white/30'}`}>
                    <img src={av.url} alt={av.name} className="w-16 h-16 object-cover" />
                    <span className="absolute bottom-0 inset-x-0 text-center text-[10px] bg-black/60 py-0.5">{av.name}</span>
                  </button>
                ))}
                <button onClick={() => fileRef.current?.click()}
                  className={`w-16 h-16 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 transition text-xs text-slate-400 overflow-hidden
                    ${customPhoto ? 'border-violet-500' : 'border-white/20 hover:border-white/40'}`}>
                  {customPhoto
                    ? <img src={customPhoto} alt="Custom" className="w-full h-full object-cover" />
                    : <><Upload className="w-4 h-4" /><span>Upload</span></>}
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
              </div>
            </div>

            {/* Script */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-violet-400" /> Script
              </h2>
              <textarea value={script} onChange={e => setScript(e.target.value)} rows={6}
                placeholder="Type what you want your avatar to say..."
                className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500 transition resize-none" />
              <p className="text-xs text-slate-500 mt-2">{script.length} characters</p>
            </div>

            {/* Voice */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <Mic className="w-4 h-4 text-violet-400" /> Voice
              </h2>
              <div className="relative">
                <select value={voice} onChange={e => setVoice(e.target.value)}
                  className="w-full appearance-none bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 pr-10 text-sm focus:outline-none focus:border-violet-500 transition">
                  {VOICES.map(v => <option key={v.id} value={v.id} className="bg-slate-900">{v.label}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              </div>
            </div>

            {/* Generate button */}
            <button onClick={handleGenerate}
              disabled={!script.trim() || status === 'generating' || status === 'polling'}
              className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold py-4 rounded-xl hover:opacity-90 transition disabled:opacity-40 flex items-center justify-center gap-2 text-base">
              {status === 'generating' || status === 'polling'
                ? <><Loader2 className="w-5 h-5 animate-spin" />
                    {status === 'generating' ? 'Sending to D-ID...' : 'Generating video...'}</>
                : <><Play className="w-5 h-5" /> Generate video</>}
            </button>

            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">
                {errorMsg}
              </div>
            )}
          </div>

          {/* Right — preview */}
          <div className="flex flex-col gap-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex-1 flex flex-col">
              <h2 className="font-semibold mb-4">Preview</h2>

              {status === 'done' && videoUrl ? (
                <div className="flex-1 flex flex-col gap-4">
                  <video src={videoUrl} controls className="w-full rounded-xl bg-black aspect-video" />
                  <a href={videoUrl} download="talkr-video.mp4"
                    className="flex items-center justify-center gap-2 bg-violet-600/20 border border-violet-500/40 text-violet-300 font-medium py-3 rounded-xl hover:bg-violet-600/30 transition text-sm">
                    <Download className="w-4 h-4" /> Download MP4
                  </a>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center gap-4 min-h-64">
                  <img src={avatarUrl} alt="Avatar preview"
                    className="w-32 h-32 rounded-full object-cover border-4 border-white/10" />
                  {status === 'idle' && (
                    <p className="text-slate-500 text-sm text-center">Your video will appear here after generating</p>
                  )}
                  {(status === 'generating' || status === 'polling') && (
                    <div className="text-center">
                      <Loader2 className="w-8 h-8 animate-spin text-violet-400 mx-auto mb-2" />
                      <p className="text-slate-400 text-sm">Creating your talking avatar...</p>
                      <p className="text-slate-500 text-xs mt-1">This takes 20–40 seconds</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
