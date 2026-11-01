import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Copy, Check } from 'lucide-react';

// ============================================================
// The interview link as a QR code
// ============================================================
// A walk-in candidate standing at the counter should not have to be emailed
// and then find the email. They scan, and the interview opens on their phone.
//
// Generated in the browser, never through a QR image service. The link is the
// candidate's credential for that interview — handing it to a third party to
// draw a picture of would hand them the interview too.

export default function InterviewQr({ url }: { url: string }) {
  const [src, setSrc] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let live = true;
    if (!url) {
      setSrc('');
      return;
    }
    QRCode.toDataURL(url, {
      width: 320,
      margin: 1,
      // Dark on white. A phone camera reads contrast, and theming the code to
      // match the portal is the quickest way to make it unreadable.
      color: { dark: '#0b0f0c', light: '#ffffff' },
      errorCorrectionLevel: 'M',
    })
      .then(data => { if (live) setSrc(data); })
      .catch(() => { if (live) setSrc(''); });
    return () => { live = false; };
  }, [url]);

  const copy = () => {
    navigator.clipboard?.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }).catch(() => {});
  };

  if (!url) return null;

  return (
    <div
      className="flex items-center gap-3.5 rounded-xl p-3 mb-3"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      {src ? (
        <img
          src={src}
          alt="QR code for the interview link"
          className="rounded-lg flex-shrink-0"
          style={{ width: 96, height: 96, background: '#fff', padding: 4 }}
        />
      ) : (
        <div className="w-24 h-24 rounded-lg flex-shrink-0" style={{ background: 'rgba(255,255,255,0.05)' }} />
      )}

      <div className="min-w-0">
        <p className="text-xs font-bold text-white/85 mb-1">Or let them scan this</p>
        <p className="text-[11px] text-white/45 leading-relaxed mb-2">
          Works for someone standing in front of you — no email needed. Same link, so it still
          opens once and expires in a week.
        </p>
        <button
          type="button"
          onClick={copy}
          className="flex items-center gap-1.5 text-[11px] font-bold transition-colors"
          style={{ color: copied ? '#00FF66' : 'rgba(255,255,255,0.5)' }}
        >
          {copied ? <Check size={11} /> : <Copy size={11} />}
          {copied ? 'Link copied' : 'Copy link'}
        </button>
      </div>
    </div>
  );
}
