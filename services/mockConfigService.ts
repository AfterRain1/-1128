import { DeviceConfigResponse, UIStyleCategory, StyleItem } from '../types';

/* 
  ========================================================================
  IMPORTANT: PRODUCTION INTEGRATION INSTRUCTIONS
  ========================================================================
  
  1. Install the library:
     npm install pepefoto-bridge-lib

  2. Configure your .env file:
     VITE_GEMINI_BRIDGE_BASE_URL=https://pepe2.jielixinxi.com
     VITE_GEMINI_BRIDGE_AUTH_TOKEN=your_auth_token
     VITE_GEMINI_BRIDGE_DEVICE_CODE=your_device_code

  3. Uncomment the real import below and remove the mock class.
*/

// REAL IMPORT (Uncomment in production):
// import { DeviceConfigService as RealDeviceConfigService } from 'pepefoto-bridge-lib/platform/auth';

/**
 * Mock Service Adapter
 * Simulates 'pepefoto-bridge-lib/platform/auth' behavior for preview purposes.
 */
export class DeviceConfigService {
  
  private baseUrl: string;
  private token: string;
  private deviceCode: string;

  constructor(env: Record<string, string>) {
    this.baseUrl = env.VITE_GEMINI_BRIDGE_BASE_URL || '';
    this.token = env.VITE_GEMINI_BRIDGE_AUTH_TOKEN || '';
    this.deviceCode = env.VITE_GEMINI_BRIDGE_DEVICE_CODE || '';
  }

  /**
   * Helper to safely get environment variables across different environments (Vite, Webpack, etc.)
   */
  static getEnv(key: string): string {
    let value = '';

    // 1. Try Vite import.meta.env
    try {
      // @ts-ignore
      if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
        // @ts-ignore
        value = import.meta.env[key];
      }
    } catch (e) {}
    
    // 2. Try Node process.env (if step 1 failed)
    if (!value) {
      try {
        // @ts-ignore
        if (typeof process !== 'undefined' && process.env && process.env[key]) {
          // @ts-ignore
          value = process.env[key];
        }
      } catch (e) {}
    }

    // 3. Fallback to provided user defaults (Hardcoded for preview reliability)
    if (!value) {
      const defaults: Record<string, string> = {
        'VITE_GEMINI_BRIDGE_BASE_URL': 'https://pepe2.jielixinxi.com',
        'VITE_GEMINI_BRIDGE_AUTH_TOKEN': 'bc5119ccec861389398345fec69f0a11',
        'VITE_GEMINI_BRIDGE_DEVICE_CODE': 'dbfe65'
      };
      value = defaults[key] || '';
    }

    return value;
  }

  /**
   * Factory method to create service from environment variables.
   * Mirrors the actual library method: DeviceConfigService.fromEnv()
   */
  static fromEnv() {
    // In production, this would be: return RealDeviceConfigService.fromEnv();
    
    // Simulate reading env vars safely
    const env = {
      VITE_GEMINI_BRIDGE_BASE_URL: DeviceConfigService.getEnv('VITE_GEMINI_BRIDGE_BASE_URL'),
      VITE_GEMINI_BRIDGE_AUTH_TOKEN: DeviceConfigService.getEnv('VITE_GEMINI_BRIDGE_AUTH_TOKEN'),
      VITE_GEMINI_BRIDGE_DEVICE_CODE: DeviceConfigService.getEnv('VITE_GEMINI_BRIDGE_DEVICE_CODE'),
    };

    console.log('[DeviceConfigService] Initialized from Env:', {
      ...env,
      VITE_GEMINI_BRIDGE_AUTH_TOKEN: env.VITE_GEMINI_BRIDGE_AUTH_TOKEN ? '******' : 'MISSING'
    });
    
    return new DeviceConfigService(env);
  }

  /**
   * Fetch device configuration.
   * Mirrors: await service.getDeviceConfig()
   */
  async getDeviceConfig(): Promise<{ ok: boolean; value?: DeviceConfigResponse; error?: any }> {
    console.log(`[MockService] Fetching config for device: ${this.deviceCode} from ${this.baseUrl}`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Note: Since we don't have the real library installed in this preview,
    // we return mock data that matches the expected structure.
    return {
      ok: true,
      value: {
        uistyle: this.generateMockData()
      }
    };
  }

  // =========================================================
  // MOCK DATA GENERATION (Matches StyleItem Interface)
  // =========================================================
  private generateMockData(): UIStyleCategory[] {
    return [
      {
        id: 'cat_trends',
        cat_name: 'Trending',
        type: 1,
        btnimg: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=100&h=100&fit=crop',
        lst_style: this.generateStyles('trend', 6, 'Trending', { isGif: 0 })
      },
      {
        id: 'cat_ar',
        cat_name: 'AR Filters',
        type: 2,
        btnimg: 'https://images.unsplash.com/photo-1633412802994-5c058f151b66?w=100&h=100&fit=crop',
        lst_style: this.generateStyles('ar', 4, 'AR Effect', { ar8: 1 })
      },
      {
        id: 'cat_gif',
        cat_name: 'GIF Booth',
        type: 3,
        btnimg: 'https://images.unsplash.com/photo-1595068994297-f58c73204986?w=100&h=100&fit=crop',
        lst_style: this.generateStyles('gif', 5, 'Motion', { isGif: 1, videoParams: 'fps=15' })
      },
      {
        id: 'cat_print',
        cat_name: 'Print Layouts',
        type: 1,
        btnimg: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=100&h=100&fit=crop',
        lst_style: this.generateStyles('print', 8, 'Classic', { freePrintCount: 2 })
      }
    ];
  }

  private generateStyles(prefix: string, count: number, nameBase: string, overrides: Partial<StyleItem> = {}): StyleItem[] {
    return Array.from({ length: count }).map((_, idx) => ({
      id: `${prefix}_${idx}`,
      style_name: `${nameBase} ${idx + 1}`,
      img_preview: `https://picsum.photos/seed/${prefix}_${idx}/400/600`,
      img_type: 1,
      cut_type: 1,
      isClient: Math.random() > 0.5,
      keepBgImg: true,
      ar8: 0,
      arsubmit: 0,
      videoParams: null,
      typeParams: '',
      imgStyleId: idx,
      isGif: 0,
      resolution: '1920x1080',
      videoMerge: 0,
      clientMerge: 0,
      ratioCutStatus: 1,
      preImgStatus: 1,
      preWindow: 1,
      lst_layout: [],
      mergeStyleId: 0,
      arVideoType: 0,
      lst_photo: [],
      lst_sticker: [],
      lst_badge: [],
      lst_raster: [],
      price: idx % 2 === 0 ? 0 : 299,
      freePrice: 0,
      delsafe: false,
      delPhotoFrame: false,
      assetSplit: false,
      arVideoSource: 0,
      arVideoMp3: '',
      freePrintCount: 1,
      regenerationNum: 3,
      ...overrides
    }));
  }
}