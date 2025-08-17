#!/usr/bin/env node

/**
 * Real Audio Generation Script for Privacy Jenga
 * This script creates actual audio files using Web Audio API
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Audio directory path
const audioDir = path.join(__dirname, '..', 'public', 'audio');

// Create audio directory if it doesn't exist
if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
  console.log('✅ Created audio directory:', audioDir);
}

// Function to generate a simple audio file
function generateAudioFile(filename, options = {}) {
  const {
    duration = 1.0, // seconds
    frequency = 440, // Hz
    type = 'sine', // sine, square, sawtooth, triangle
    volume = 0.3,
    fadeIn = 0.1,
    fadeOut = 0.1
  } = options;

  // Create a simple WAV file header
  const sampleRate = 44100;
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = sampleRate * numChannels * bitsPerSample / 8;
  const blockAlign = numChannels * bitsPerSample / 8;
  const numSamples = Math.floor(duration * sampleRate);
  const dataSize = numSamples * numChannels * bitsPerSample / 8;
  const fileSize = 36 + dataSize;

  // Create WAV header
  const header = Buffer.alloc(44);
  
  // RIFF header
  header.write('RIFF', 0);
  header.writeUInt32LE(fileSize, 4);
  header.write('WAVE', 8);
  
  // fmt chunk
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16); // fmt chunk size
  header.writeUInt16LE(1, 20); // PCM format
  header.writeUInt16LE(numChannels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  
  // data chunk
  header.write('data', 36);
  header.writeUInt32LE(dataSize, 40);

  // Generate audio data
  const audioData = Buffer.alloc(dataSize);
  const amplitude = Math.floor(volume * 32767);

  for (let i = 0; i < numSamples; i++) {
    const time = i / sampleRate;
    
    // Calculate envelope (fade in/out)
    let envelope = 1.0;
    if (time < fadeIn) {
      envelope = time / fadeIn;
    } else if (time > duration - fadeOut) {
      envelope = (duration - time) / fadeOut;
    }
    
    // Generate waveform
    let sample = 0;
    switch (type) {
      case 'sine':
        sample = Math.sin(2 * Math.PI * frequency * time);
        break;
      case 'square':
        sample = Math.sin(2 * Math.PI * frequency * time) > 0 ? 1 : -1;
        break;
      case 'sawtooth':
        sample = 2 * (frequency * time - Math.floor(frequency * time + 0.5));
        break;
      case 'triangle':
        const phase = (frequency * time) % 1;
        sample = phase < 0.5 ? 4 * phase - 1 : 3 - 4 * phase;
        break;
    }
    
    // Apply envelope and convert to 16-bit integer
    const value = Math.floor(sample * envelope * amplitude);
    audioData.writeInt16LE(value, i * 2);
  }

  // Combine header and audio data
  const wavFile = Buffer.concat([header, audioData]);
  
  // Write to file
  const filePath = path.join(audioDir, filename);
  fs.writeFileSync(filePath, wavFile);
  console.log(`✅ Generated audio: ${filename}`);
}

// Generate different types of audio files
console.log('🎵 Generating real audio files...\n');

// Background music (longer, lower frequency)
generateAudioFile('background-music.wav', {
  duration: 30.0,
  frequency: 220,
  type: 'sine',
  volume: 0.2,
  fadeIn: 2.0,
  fadeOut: 2.0
});

// Ambient music
generateAudioFile('ambient-music.wav', {
  duration: 20.0,
  frequency: 330,
  type: 'sine',
  volume: 0.15,
  fadeIn: 1.5,
  fadeOut: 1.5
});

// Game sound effects
generateAudioFile('block-click.wav', {
  duration: 0.2,
  frequency: 800,
  type: 'sine',
  volume: 0.4,
  fadeIn: 0.01,
  fadeOut: 0.1
});

generateAudioFile('block-remove.wav', {
  duration: 0.3,
  frequency: 600,
  type: 'square',
  volume: 0.5,
  fadeIn: 0.01,
  fadeOut: 0.15
});

generateAudioFile('correct-answer.wav', {
  duration: 0.5,
  frequency: 523, // C5
  type: 'sine',
  volume: 0.6,
  fadeIn: 0.05,
  fadeOut: 0.2
});

generateAudioFile('wrong-answer.wav', {
  duration: 0.4,
  frequency: 196, // G3
  type: 'sawtooth',
  volume: 0.5,
  fadeIn: 0.01,
  fadeOut: 0.2
});

generateAudioFile('tower-shake.wav', {
  duration: 0.6,
  frequency: 150,
  type: 'triangle',
  volume: 0.4,
  fadeIn: 0.01,
  fadeOut: 0.3
});

generateAudioFile('tower-collapse.wav', {
  duration: 1.0,
  frequency: 100,
  type: 'sawtooth',
  volume: 0.7,
  fadeIn: 0.01,
  fadeOut: 0.5
});

generateAudioFile('achievement-unlock.wav', {
  duration: 0.8,
  frequency: 659, // E5
  type: 'sine',
  volume: 0.6,
  fadeIn: 0.05,
  fadeOut: 0.3
});

generateAudioFile('stability-warning.wav', {
  duration: 0.4,
  frequency: 440,
  type: 'square',
  volume: 0.5,
  fadeIn: 0.01,
  fadeOut: 0.2
});

generateAudioFile('button-hover.wav', {
  duration: 0.1,
  frequency: 1000,
  type: 'sine',
  volume: 0.3,
  fadeIn: 0.01,
  fadeOut: 0.05
});

generateAudioFile('button-click.wav', {
  duration: 0.15,
  frequency: 1200,
  type: 'square',
  volume: 0.4,
  fadeIn: 0.01,
  fadeOut: 0.08
});

generateAudioFile('game-start.wav', {
  duration: 0.8,
  frequency: 523, // C5
  type: 'sine',
  volume: 0.6,
  fadeIn: 0.1,
  fadeOut: 0.3
});

generateAudioFile('game-complete.wav', {
  duration: 1.2,
  frequency: 659, // E5
  type: 'sine',
  volume: 0.7,
  fadeIn: 0.1,
  fadeOut: 0.4
});

console.log('\n🎵 Real audio files generated successfully!');
console.log('📝 These are actual WAV audio files that can be played by browsers.');
console.log('🔧 You can replace these with higher quality audio files for production.');
