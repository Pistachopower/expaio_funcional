import React from 'react';

interface AudioPlayerProps {
  src: string;
  title?: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, title }) => (
  <div className="mb-6">
    {title && <h3 className="font-semibold mb-2 text-lg">{title}</h3>}
    <audio controls src={src} className="w-full rounded shadow" />
  </div>
);

export default AudioPlayer;
