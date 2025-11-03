declare module 'kokoro-js' {
	export type Voice =
		| "af_heart" | "af_alloy" | "af_aoede" | "af_bella" | "af_jessica"
		| "af_kore" | "af_nicole" | "af_nova" | "af_river" | "af_sarah"
		| "af_sky" | "am_adam" | "am_echo" | "am_eric" | "am_felix"
		| "am_john" | "am_steve" | "am_susan";
	
	export interface RawAudio {
		array: Uint8Array;
		sampleRate: number;
		channels: number;
	}
	
	export class KokoroTTS {
		static from_pretrained(modelId: string, options?: { dtype?: string }): Promise<KokoroTTS>;
		generate(text: string, options?: { voice?: Voice }): Promise<RawAudio>;
	}
}

 
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV?: 'development' | 'production' | 'test';
    PORT?: string;
    LOG_LEVEL?: 'error' | 'warn' | 'info' | 'http' | 'verbose' | 'debug' | 'silly';
    LOG_DIR?: string;
    TTS_MODEL?: string;
    TTS_DTYPE?: string;
  }
}
