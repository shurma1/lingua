import { KokoroTTS } from 'kokoro-js';
import * as fs from 'fs';
import * as path from 'path';
import logger from '../utils/logger';
import { TTS_MODEL, TTS_DTYPE } from '../config';

export interface KokoroGenerateResult {
	audio?: Float32Array;
	data?: Float32Array | number[];
	pcm?: Float32Array | number[];
	sample_rate?: number;
	sampleRate?: number;
	[key: string]: unknown;
}

function isFloat32ArrayLike(val: unknown): val is Float32Array | number[] | ArrayLike<number> {
	if (val instanceof Float32Array) return true;
	if (Array.isArray(val) && val.every(n => typeof n === 'number')) return true;
	if (val && typeof val === 'object' && 'length' in val) return true;
	return false;
}

interface QueueItem {
	text: string;
	resolve: (filePath: string) => void;
	reject: (error: Error) => void;
}

class TtsService {
	private model: KokoroTTS | null = null;
	private loadingPromise: Promise<void> | null = null;
	private queue: QueueItem[] = [];
	private isProcessing = false;
	private outputDir = path.join(process.cwd(), 'media', 'tts');
	
	constructor() {
		if (!fs.existsSync(this.outputDir)) {
			fs.mkdirSync(this.outputDir, { recursive: true });
		}
	}
	
	init(): Promise<void> {
		if (this.model) return Promise.resolve();
		if (this.loadingPromise) return this.loadingPromise;
		this.loadingPromise = (async () => {
			try {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				this.model = await KokoroTTS.from_pretrained(TTS_MODEL, { dtype: TTS_DTYPE as any });
				logger.info('[TTS] Модель загружена (%s, dtype=%s)', TTS_MODEL, TTS_DTYPE);
			} catch (e) {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				logger.error('[TTS] Ошибка загрузки модели: %s', (e as any)?.message || e);
				this.model = null;
				throw e;
			}
		})();
		return this.loadingPromise;
	}
	
	synthesize(text: string): Promise<string> {
		return new Promise((resolve, reject) => {
			this.queue.push({ text, resolve, reject });
			this.processQueue();
		});
	}
	
	private async processQueue(): Promise<void> {
		if (this.isProcessing || this.queue.length === 0) return;
		
		this.isProcessing = true;
		
		while (this.queue.length > 0) {
			const item = this.queue.shift()!;
			
			try {
				const filePath = await this.synthesizeInternal(item.text);
				item.resolve(filePath);
			} catch (error) {
				item.reject(error as Error);
			}
		}
		
		this.isProcessing = false;
	}
	
	private async synthesizeInternal(text: string): Promise<string> {
		if (!this.model) throw new Error('TTS model not ready');
		if (!text.trim()) throw new Error('Empty text');
		
		// Generate audio with default voice
		const rawAudio = await this.model.generate(text) as unknown as KokoroGenerateResult;
		const candidateAudio = (rawAudio.audio ?? rawAudio.data ?? rawAudio.pcm ?? rawAudio) as unknown;
		const sampleRate = (typeof rawAudio.sample_rate === 'number' ? rawAudio.sample_rate : (typeof rawAudio.sampleRate === 'number' ? rawAudio.sampleRate : 22050));
		
		if (!isFloat32ArrayLike(candidateAudio)) throw new Error('Model returned unexpected audio format');
		
		const floatArray: Float32Array | number[] = candidateAudio instanceof Float32Array ? candidateAudio : Array.from(candidateAudio as ArrayLike<number>);
		if (floatArray.length === 0) throw new Error('Model returned empty audio');
		
		// Generate unique filename
		const filename = `tts_${Date.now()}_${Math.random().toString(36).substring(7)}.wav`;
		const filePath = path.join(this.outputDir, filename);
		
		// Create WAV file with streaming
		await this.writeWavFile(filePath, sampleRate, floatArray);
		
		logger.debug('[TTS] Синтез завершен (%d samples, rate=%d, file=%s)', floatArray.length, sampleRate, filename);
		return filePath;
	}
	
	private async writeWavFile(filePath: string, sampleRate: number, floatArray: Float32Array | number[]): Promise<void> {
		return new Promise((resolve, reject) => {
			const stream = fs.createWriteStream(filePath);
			
			stream.on('error', reject);
			stream.on('finish', resolve);
			
			// Write WAV header
			const numChannels = 1;
			const bitsPerSample = 16;
			const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
			const blockAlign = numChannels * (bitsPerSample / 8);
			const dataSize = floatArray.length * 2;
			
			const header = Buffer.alloc(44);
			let offset = 0;
			
			// RIFF header
			header.write('RIFF', offset); offset += 4;
			header.writeUInt32LE(36 + dataSize, offset); offset += 4;
			header.write('WAVE', offset); offset += 4;
			
			// fmt chunk
			header.write('fmt ', offset); offset += 4;
			header.writeUInt32LE(16, offset); offset += 4; // chunk size
			header.writeUInt16LE(1, offset); offset += 2; // audio format (PCM)
			header.writeUInt16LE(numChannels, offset); offset += 2;
			header.writeUInt32LE(sampleRate, offset); offset += 4;
			header.writeUInt32LE(byteRate, offset); offset += 4;
			header.writeUInt16LE(blockAlign, offset); offset += 2;
			header.writeUInt16LE(bitsPerSample, offset); offset += 2;
			
			// data chunk header
			header.write('data', offset); offset += 4;
			header.writeUInt32LE(dataSize, offset);
			
			stream.write(header);
			
			// Write PCM data in chunks
			const chunkSize = 4096; // Write in 4KB chunks
			for (let i = 0; i < floatArray.length; i += chunkSize) {
				const end = Math.min(i + chunkSize, floatArray.length);
				const chunk = Buffer.alloc((end - i) * 2);
				
				for (let j = i; j < end; j++) {
					let sample = floatArray[j] as number;
					if (sample > 1) sample = 1;
					else if (sample < -1) sample = -1;
					const int16 = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
					chunk.writeInt16LE(int16, (j - i) * 2);
				}
				
				stream.write(chunk);
			}
			
			stream.end();
		});
	}
}

const ttsService = new TtsService();
export default ttsService;
