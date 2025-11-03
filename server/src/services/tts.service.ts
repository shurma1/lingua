
import { KokoroTTS } from 'kokoro-js';
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

export interface SynthesizeOptions { voice?: string; }
export interface SynthesizeResult { wav: Buffer; sampleRate: number; voice?: string; }

function isStringArray(val: unknown): val is string[] { return Array.isArray(val) && val.every(v => typeof v === 'string'); }
function isFloat32ArrayLike(val: unknown): val is Float32Array | number[] | ArrayLike<number> {
	if (val instanceof Float32Array) return true;
	if (Array.isArray(val) && val.every(n => typeof n === 'number')) return true;
	if (val && typeof val === 'object' && 'length' in val) return true;
	return false;
}

class TtsService {
	private model: KokoroTTS | null = null;
	private loadingPromise: Promise<void> | null = null;

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

	isReady(): boolean { return this.model !== null; }

	getVoices(): string[] {
		if (!this.model) return [];
		const candidateKeys = ['voices', 'availableVoices', 'voice_list'];
		const modelObj: Record<string, unknown> = this.model as unknown as Record<string, unknown>;
		for (const key of candidateKeys) {
			const val = modelObj[key];
			if (isStringArray(val)) return val;
			if (val && typeof val === 'object' && !Array.isArray(val)) {
				const keys = Object.keys(val as Record<string, unknown>);
				if (keys.every(k => typeof k === 'string')) return keys;
			}
		}
		for (const [k, v] of Object.entries(modelObj)) {
			if (k.toLowerCase().includes('voice')) {
				if (isStringArray(v)) return v;
				if (v && typeof v === 'object') return Object.keys(v as Record<string, unknown>);
			}
		}
		return [];
	}

	async synthesize(text: string, opts: SynthesizeOptions = {}): Promise<SynthesizeResult> {
		if (!this.model) throw new Error('TTS model not ready');
		if (!text.trim()) throw new Error('Empty text');
		const voices = this.getVoices();
		let selected = opts.voice;
		if (selected && voices.length && !voices.includes(selected)) logger.warn(`[TTS] Unknown voice '${selected}'. Known: ${voices.join(', ')}`);
		if (!selected && voices.length) selected = voices[0];
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const generationOptions = selected ? { voice: selected as unknown as any } : undefined;
     
		const rawAudio = await this.model.generate(text, generationOptions) as unknown as KokoroGenerateResult;
		const candidateAudio = (rawAudio.audio ?? rawAudio.data ?? rawAudio.pcm ?? rawAudio) as unknown;
		const sampleRate = (typeof rawAudio.sample_rate === 'number' ? rawAudio.sample_rate : (typeof rawAudio.sampleRate === 'number' ? rawAudio.sampleRate : 22050));
		if (!isFloat32ArrayLike(candidateAudio)) throw new Error('Model returned unexpected audio format');
		const floatArray: Float32Array | number[] = candidateAudio instanceof Float32Array ? candidateAudio : Array.from(candidateAudio as ArrayLike<number>);
		if (floatArray.length === 0) throw new Error('Model returned empty audio');
		const pcm16 = this.floatTo16BitPCM(floatArray);
		const wav = this.buildWav(sampleRate, pcm16, 1);
		logger.debug('[TTS] Синтез завершен (%d samples, rate=%d, voice=%s)', floatArray.length, sampleRate, selected || 'default');
		return { wav, sampleRate, voice: selected };
	}

	private floatTo16BitPCM(float32: Float32Array | number[]): Buffer {
		const buffer = Buffer.alloc(float32.length * 2);
		let offset = 0;
		for (let i = 0; i < float32.length; i++) {
			let s = float32[i] as number;
			if (s > 1) s = 1; else if (s < -1) s = -1;
			const int16 = s < 0 ? s * 0x8000 : s * 0x7fff;
			buffer.writeInt16LE(int16, offset); offset += 2;
		}
		return buffer;
	}

	private buildWav(sampleRate: number, pcm16: Buffer, numChannels = 1): Buffer {
		const byteRate = sampleRate * numChannels * 2;
		const blockAlign = numChannels * 2;
		const dataSize = pcm16.length;
		const buffer = Buffer.alloc(44 + dataSize);
		let o = 0;
		const writeString = (s: string) => { buffer.write(s, o); o += s.length; };
		const writeUint32 = (v: number) => { buffer.writeUInt32LE(v, o); o += 4; };
		const writeUint16 = (v: number) => { buffer.writeUInt16LE(v, o); o += 2; };
		writeString('RIFF');
		writeUint32(36 + dataSize);
		writeString('WAVE');
		writeString('fmt ');
		writeUint32(16);
		writeUint16(1);
		writeUint16(numChannels);
		writeUint32(sampleRate);
		writeUint32(byteRate);
		writeUint16(blockAlign);
		writeUint16(16);
		writeString('data');
		writeUint32(dataSize);
		pcm16.copy(buffer, o);
		return buffer;
	}
}

const ttsService = new TtsService();
export default ttsService;
